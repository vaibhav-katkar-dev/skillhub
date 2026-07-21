import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIM_JSON_PATH = path.resolve(__dirname, '../../frontend/public/data/job-simulations.json');

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import Hackathon from '../models/Hackathon.js';
import HackathonRegistration from '../models/HackathonRegistration.js';
import EventCertificate from '../models/EventCertificate.js';
import SimulationProgress from '../models/SimulationProgress.js';
import SimulationSubmission from '../models/SimulationSubmission.js';
import SimulationPrice from '../models/SimulationPrice.js';
import SimulationCoupon from '../models/SimulationCoupon.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { awardPoints } from '../utils/ambassadorPoints.js';

const router = express.Router();
const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'https://www.skillvalix.com').replace(/\/$/, '');
const EVENT_CERT_TEMPLATE_VERSION = 4;
const DEFAULT_SIM_CERT_COST = 99; // INR fallback if JSON and DB both lack a price

/**
 * Resolve the effective cert cost (INR) for a simulation.
 * Priority: MongoDB SimulationPrice (isActive) → JSON certCost → DEFAULT_SIM_CERT_COST
 */
async function getSimCertCostInr(simId, jsonCertCost) {
  try {
    const dbPrice = await SimulationPrice.findOne({ simId: String(simId), isActive: true }).lean();
    if (dbPrice && Number.isInteger(dbPrice.certCostInr) && dbPrice.certCostInr >= 1) {
      return dbPrice.certCostInr;
    }
  } catch (e) {
    console.warn('[SimPrice] DB lookup failed, falling back to JSON:', e.message);
  }
  if (Number.isInteger(jsonCertCost) && jsonCertCost >= 1) return jsonCertCost;
  if (typeof jsonCertCost === 'number' && jsonCertCost >= 1) return Math.round(jsonCertCost);
  return DEFAULT_SIM_CERT_COST;
}

// Rate limiter: max 10 task submissions per user per hour.
// Uses the authenticated user's ID as the key so banning one user doesn't
// affect others (unlike IP-based limiting behind a proxy).
const taskValidateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  // User-ID as key when authenticated (prevents one user eating others' quota);
  // falls back to IPv6-safe IP via the official helper when ID is unavailable.
  keyGenerator: (req) => req.user?.id ? String(req.user.id) : ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  message: { valid: false, message: 'Too many submissions. Please wait before submitting again.' },
});

// Rate limiter: public cert verify endpoint — max 30 requests per 10 minutes per IP.
// Prevents brute-force scraping of valid certificate IDs.
const certVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { valid: false, message: 'Too many requests. Please try again later.' },
});


const EVENT_CERT_WARM_CONCURRENCY = Math.max(1, Number(process.env.CERT_WARM_CONCURRENCY || 1));
const eventCertWarmJob = {
  running: false,
  startedAt: null,
  finishedAt: null,
  requestedBy: null,
  mode: 'stale-only',
  totalInDb: 0,
  total: 0,
  processed: 0,
  success: 0,
  failed: 0,
  currentCertificateId: '',
  lastError: '',
};

function resetEventCertWarmJobMeta() {
  eventCertWarmJob.totalInDb = 0;
  eventCertWarmJob.total = 0;
  eventCertWarmJob.processed = 0;
  eventCertWarmJob.success = 0;
  eventCertWarmJob.failed = 0;
  eventCertWarmJob.currentCertificateId = '';
  eventCertWarmJob.lastError = '';
}

function chunkArray(values = [], size = 1) {
  const chunks = [];
  for (let i = 0; i < values.length; i += size) chunks.push(values.slice(i, i + size));
  return chunks;
}

async function regenerateEventCertificate(certDoc) {
  const issueDate = new Date(certDoc.issueDate || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const verifyUrl = `${FRONTEND_URL()}/verify/${certDoc.certificateId}`;

  const pdfBuffer = await buildEventCertificatePdf({
    studentName: certDoc.student?.name,
    eventTitle: certDoc.eventTitle,
    role: certDoc.role,
    certificateId: certDoc.certificateId,
    issueDate,
    eventType: certDoc.eventType,
    verifyUrl,
  });

  await EventCertificate.updateOne(
    { _id: certDoc._id },
    {
      $set: {
        pdfStatus: 'ready',
        pdfBuffer,
        pdfSizeBytes: pdfBuffer.length,
        pdfGeneratedAt: new Date(),
        pdfTemplateVersion: EVENT_CERT_TEMPLATE_VERSION,
        pdfError: '',
      },
    }
  );
}

async function runEventCertWarmJob(requestedBy, options = {}) {
  if (eventCertWarmJob.running) return;

  const forceAll = options?.forceAll === true;

  eventCertWarmJob.running = true;
  eventCertWarmJob.startedAt = new Date();
  eventCertWarmJob.finishedAt = null;
  eventCertWarmJob.requestedBy = requestedBy || 'admin';
  eventCertWarmJob.mode = forceAll ? 'force-all' : 'stale-only';
  resetEventCertWarmJobMeta();

  try {
    const staleFilter = {
      $or: [
        { pdfTemplateVersion: { $exists: false } },
        { pdfTemplateVersion: { $lt: EVENT_CERT_TEMPLATE_VERSION } },
        { pdfStatus: { $ne: 'ready' } },
      ],
    };

    eventCertWarmJob.totalInDb = await EventCertificate.countDocuments({});

    let selectedCerts = await EventCertificate.find(forceAll ? {} : staleFilter)
      .populate('student', 'name')
      .select('certificateId eventType eventTitle role issueDate student')
      .lean();

    if (!forceAll && selectedCerts.length === 0 && eventCertWarmJob.totalInDb > 0) {
      eventCertWarmJob.mode = 'auto-fallback-all';
      selectedCerts = await EventCertificate.find({})
        .populate('student', 'name')
        .select('certificateId eventType eventTitle role issueDate student')
        .lean();
    }

    eventCertWarmJob.total = selectedCerts.length;

    const groups = chunkArray(selectedCerts, EVENT_CERT_WARM_CONCURRENCY);
    for (const group of groups) {
      await Promise.all(
        group.map(async (certDoc) => {
          eventCertWarmJob.currentCertificateId = certDoc.certificateId;
          try {
            if (!certDoc?.student?.name) {
              throw new Error('Missing student reference');
            }
            await regenerateEventCertificate(certDoc);
            eventCertWarmJob.success += 1;
          } catch (err) {
            eventCertWarmJob.failed += 1;
            eventCertWarmJob.lastError = `${certDoc.certificateId}: ${err.message}`;
            await EventCertificate.updateOne(
              { _id: certDoc._id },
              { $set: { pdfStatus: 'failed', pdfError: err.message || 'Warm job regeneration failed' } }
            );
          } finally {
            eventCertWarmJob.processed += 1;
          }
        })
      );
    }
  } catch (err) {
    eventCertWarmJob.lastError = err.message || 'Warm job failed unexpectedly';
  } finally {
    eventCertWarmJob.running = false;
    eventCertWarmJob.currentCertificateId = '';
    eventCertWarmJob.finishedAt = new Date();
  }
}

function normalizeEmailList(emailList = []) {
  const normalized = emailList
    .map((value) => String(value || '').trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(String(value || ''));
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isDriveLink(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('drive.google.com');
  } catch {
    return false;
  }
}

function isPdfLink(url) {
  return /\.pdf(\?|#|$)/i.test(url);
}

function isGitHubLink(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' || parsed.hostname.endsWith('.github.com');
  } catch {
    return false;
  }
}

function isNotionLink(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('notion.site') || parsed.hostname.includes('notion.so');
  } catch {
    return false;
  }
}

function normalizeDomainList(values = []) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function getTaskDomainsFromSimData(simId, taskNum) {
  try {
    const raw = fs.readFileSync(SIM_JSON_PATH, 'utf-8');
    const simulations = JSON.parse(raw);
    const sim = simulations.find((item) => item.id === simId || item.slug === simId);
    if (!sim || !Array.isArray(sim.tasks)) return [];
    const task = sim.tasks.find((item) => Number(item.num) === Number(taskNum));
    if (!task) return [];
    return normalizeDomainList(task.acceptedDomains || []);
  } catch {
    return [];
  }
}

// ─── PUBLIC: List visible hackathons ────────────────────────────────────────
router.get('/hackathons', async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ visible: true })
      .sort({ featured: -1, startDate: 1 })
      .lean();
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(hackathons);
  } catch (err) {
    console.error('[Events] List hackathons error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUBLIC: Get single hackathon by ID or slug ──────────────────────────────
router.get('/hackathons/:id', async (req, res) => {
  try {
    const param = req.params.id;
    // Try ObjectId first, then fall back to slug
    let hack = null;
    if (/^[a-f\d]{24}$/i.test(param)) {
      hack = await Hackathon.findOne({ _id: param, visible: true }).lean();
    }
    if (!hack) {
      hack = await Hackathon.findOne({ slug: param, visible: true }).lean();
    }
    if (!hack) return res.status(404).json({ message: 'Hackathon not found.' });
    res.json(hack);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUBLIC: Get winners for a hackathon ────────────────────────────────────
router.get('/hackathons/:id/winners', async (req, res) => {
  try {
    const param = req.params.id;
    let hack = null;
    if (/^[a-f\d]{24}$/i.test(param)) {
      hack = await Hackathon.findOne({ _id: param, visible: true }).select('_id winnerConfig title').lean();
    }
    if (!hack) {
      hack = await Hackathon.findOne({ slug: param, visible: true }).select('_id winnerConfig title').lean();
    }
    if (!hack) return res.status(404).json({ message: 'Hackathon not found.' });

    const winners = await HackathonRegistration.find({ hackathon: hack._id, isWinner: true })
      .select('teamName winnerRank winnerNote members leader')
      .populate('leader', 'name email')
      .populate('members.user', 'name')
      .lean();
    res.json({ announced: Boolean(hack.winnerConfig?.announced), note: hack.winnerConfig?.note || '', winners });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Create hackathon ─────────────────────────────────────────────────
router.post('/hackathons', authOptions, adminCheck, async (req, res) => {
  try {
    const hack = new Hackathon(req.body);
    await hack.save();
    res.status(201).json(hack);
  } catch (err) {
    console.error('[Events] Create hackathon error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Update hackathon ─────────────────────────────────────────────────
router.put('/hackathons/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const hack = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hack) return res.status(404).json({ message: 'Hackathon not found.' });
    res.json(hack);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Delete hackathon ─────────────────────────────────────────────────
router.delete('/hackathons/:id', authOptions, adminCheck, async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: List ALL hackathons (incl. hidden + DB cert stats) ─────────────────
router.get('/admin/hackathons', authOptions, adminCheck, async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 }).lean();

    // Query DB for real event certificate counts per hackathon
    const certStats = await EventCertificate.aggregate([
      { $match: { eventType: 'hackathon', hackathonId: { $ne: null } } },
      {
        $group: {
          _id: '$hackathonId',
          totalCertificates: { $sum: 1 },
          participationCertificates: {
            $sum: { $cond: [{ $eq: ['$certType', 'participation'] }, 1, 0] }
          },
          winnerCertificates: {
            $sum: { $cond: [{ $eq: ['$certType', 'winner'] }, 1, 0] }
          }
        }
      }
    ]);

    const certMap = {};
    certStats.forEach(s => {
      if (s._id) {
        certMap[s._id.toString()] = {
          totalCertificates: s.totalCertificates || 0,
          participationCertificates: s.participationCertificates || 0,
          winnerCertificates: s.winnerCertificates || 0
        };
      }
    });

    const result = hackathons.map(h => {
      const stats = certMap[h._id.toString()] || { totalCertificates: 0, participationCertificates: 0, winnerCertificates: 0 };
      return {
        ...h,
        certificatesCount: stats.totalCertificates,
        participationCertificatesCount: stats.participationCertificates,
        winnerCertificatesCount: stats.winnerCertificates
      };
    });

    res.json(result);
  } catch (err) {
    console.error('[Events] Admin list hackathons error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Warm / regenerate stale event certificate PDFs ─────────────────
router.post('/admin/certificates/warm-event-pdfs', authOptions, adminCheck, async (req, res) => {
  try {
    if (eventCertWarmJob.running) {
      return res.status(409).json({
        message: 'Warm job is already running.',
        job: eventCertWarmJob,
      });
    }

    const requestedBy = req.user?.id || 'admin';
    const forceAll = req.body?.forceAll !== false;
    // Run in background so admin API responds instantly and UI can poll status.
    runEventCertWarmJob(requestedBy, { forceAll }).catch((err) => {
      console.error('[Events] Warm job background error:', err);
      eventCertWarmJob.lastError = err.message || 'Warm job background execution failed';
    });

    return res.status(202).json({
      message: 'Warm job started.',
      job: eventCertWarmJob,
    });
  } catch (err) {
    console.error('[Events] Start warm job error:', err);
    return res.status(500).json({ message: 'Server error starting warm job.' });
  }
});

router.get('/admin/certificates/warm-event-pdfs/status', authOptions, adminCheck, async (req, res) => {
  try {
    res.json({
      running: eventCertWarmJob.running,
      startedAt: eventCertWarmJob.startedAt,
      finishedAt: eventCertWarmJob.finishedAt,
      requestedBy: eventCertWarmJob.requestedBy,
      mode: eventCertWarmJob.mode,
      totalInDb: eventCertWarmJob.totalInDb,
      total: eventCertWarmJob.total,
      processed: eventCertWarmJob.processed,
      success: eventCertWarmJob.success,
      failed: eventCertWarmJob.failed,
      currentCertificateId: eventCertWarmJob.currentCertificateId,
      lastError: eventCertWarmJob.lastError,
      concurrency: EVENT_CERT_WARM_CONCURRENCY,
      templateVersion: EVENT_CERT_TEMPLATE_VERSION,
    });
  } catch (err) {
    console.error('[Events] Warm job status error:', err);
    res.status(500).json({ message: 'Server error fetching warm job status.' });
  }
});

// ─── USER: List my hackathon registrations ─────────────────────────────────
router.get('/hackathons/my-registrations', authOptions, async (req, res) => {
  try {
    const registrations = await HackathonRegistration.find({
      'members.user': req.user.id,
    })
      .populate('hackathon', 'title status visible paymentConfig submissionConfig')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const visibleOrMine = registrations.filter((reg) => reg.hackathon);
    res.json(visibleOrMine);
  } catch (err) {
    console.error('[Events] My registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── USER: Register team to a hackathon (members must be existing users) ───
router.post('/hackathons/:id/register', authOptions, async (req, res) => {
  try {
    const { teamName, memberEmails = [] } = req.body;
    if (!teamName || String(teamName).trim().length < 3) {
      return res.status(400).json({ message: 'Team name must be at least 3 characters.' });
    }

    const hackathon = await Hackathon.findById(req.params.id).lean();
    if (!hackathon || !hackathon.visible) {
      return res.status(404).json({ message: 'Hackathon not found.' });
    }
    if (hackathon.status === 'ended') {
      return res.status(400).json({ message: 'Registrations are closed for this hackathon.' });
    }

    const leader = await User.findById(req.user.id).select('_id name email').lean();
    if (!leader?.email) return res.status(404).json({ message: 'User not found.' });

    const uniqueEmails = normalizeEmailList([leader.email, ...memberEmails]);
    const minMembers = Math.max(1, Number(hackathon?.teamConfig?.minMembers || 1));
    const maxMembers = Math.max(minMembers, Number(hackathon?.teamConfig?.maxMembers || 4));

    if (uniqueEmails.length < minMembers || uniqueEmails.length > maxMembers) {
      return res.status(400).json({
        message: `Team size must be between ${minMembers} and ${maxMembers} members.`,
      });
    }

    const users = await User.find({ email: { $in: uniqueEmails } }).select('_id name email').lean();
    const foundEmails = new Set(users.map((u) => String(u.email).trim().toLowerCase()));
    const missing = uniqueEmails.filter((email) => !foundEmails.has(email));
    if (missing.length > 0) {
      return res.status(400).json({
        message: 'All team members must already be registered users.',
        missingEmails: missing,
      });
    }

    const memberIds = users.map((u) => u._id);

    const alreadyInAnotherTeam = await HackathonRegistration.findOne({
      hackathon: hackathon._id,
      'members.user': { $in: memberIds },
      leader: { $ne: leader._id },
    }).lean();

    if (alreadyInAnotherTeam) {
      return res.status(400).json({ message: 'One or more members are already part of another team in this hackathon.' });
    }

    const existingLeaderTeam = await HackathonRegistration.findOne({
      hackathon: hackathon._id,
      leader: leader._id,
    });
    if (existingLeaderTeam) {
      return res.status(400).json({ message: 'You have already registered a team for this hackathon.' });
    }

    const paymentEnabled = Boolean(hackathon?.paymentConfig?.enabled && Number(hackathon?.paymentConfig?.amountInr || 0) > 0);
    const paymentAmountInr = paymentEnabled ? Number(hackathon.paymentConfig.amountInr) : 0;

    const registration = new HackathonRegistration({
      hackathon: hackathon._id,
      teamName: String(teamName).trim(),
      leader: leader._id,
      members: users.map((u) => ({
        user: u._id,
        name: u.name,
        email: String(u.email).trim().toLowerCase(),
      })),
      status: paymentEnabled ? 'payment_pending' : 'registered',
      payment: {
        required: paymentEnabled,
        amountInr: paymentAmountInr,
        status: paymentEnabled ? 'pending' : 'not_required',
      },
    });
    await registration.save();

    if (!paymentEnabled && leader.referredBy) {
      awardPoints(leader.referredBy, 'free_hackathon', {
        referredUserId: leader._id,
        meta: { hackathonId: hackathon._id },
      }).catch(console.error);
    }

    const populated = await HackathonRegistration.findById(registration._id)
      .populate('members.user', 'name email')
      .lean();

    res.status(201).json({
      message: paymentEnabled
        ? 'Team registered. Complete payment to unlock submissions.'
        : 'Team registered successfully.',
      registration: populated,
    });
  } catch (err) {
    console.error('[Events] Hackathon registration error:', err);
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'Team name already exists for this hackathon.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── USER: Create payment order for hackathon registration ──────────────────
router.post('/hackathons/:id/razorpay-order', authOptions, async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) return res.status(400).json({ message: 'registrationId is required.' });

    const registration = await HackathonRegistration.findOne({
      _id: registrationId,
      hackathon: req.params.id,
      leader: req.user.id,
    })
      .populate('hackathon', 'title paymentConfig')
      .lean();

    if (!registration || !registration.hackathon) {
      return res.status(404).json({ message: 'Registration not found.' });
    }
    if (!registration.payment?.required) {
      return res.status(400).json({ message: 'Payment is not required for this hackathon.' });
    }
    if (registration.payment?.status === 'paid') {
      return res.status(400).json({ message: 'Registration is already paid.' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }

    const amountInr = Number(registration.payment.amountInr || registration.hackathon.paymentConfig?.amountInr || 0);
    if (amountInr <= 0) {
      return res.status(400).json({ message: 'Invalid registration amount.' });
    }

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const receipt = `hack_${registration._id}`.substring(0, 40);
    const order = await rzp.orders.create({
      amount: amountInr * 100,
      currency: 'INR',
      receipt,
      notes: {
        hackathonId: String(req.params.id),
        registrationId: String(registration._id),
        leaderId: String(req.user.id),
        teamName: registration.teamName,
      },
    });

    await HackathonRegistration.updateOne(
      { _id: registration._id },
      {
        $set: {
          'payment.razorpayOrderId': order.id,
          status: 'payment_pending',
          'payment.status': 'pending',
        },
      }
    );

    res.json({
      ...order,
      displayAmountRupees: amountInr,
      title: registration.hackathon.title,
      description: registration.hackathon.paymentConfig?.description || 'Hackathon registration fee',
    });
  } catch (err) {
    console.error('[Events] Hackathon order error:', err);
    res.status(500).json({ message: 'Error creating payment order.' });
  }
});

// ─── USER: Verify payment for hackathon registration ────────────────────────
router.post('/hackathons/:id/payment/verify', authOptions, async (req, res) => {
  try {
    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!registrationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields.' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    const registration = await HackathonRegistration.findOne({
      _id: registrationId,
      hackathon: req.params.id,
      leader: req.user.id,
    }).lean();

    if (!registration) return res.status(404).json({ message: 'Registration not found.' });
    if (!registration.payment?.required) return res.status(400).json({ message: 'Payment not required for this registration.' });
    if (registration.payment?.status === 'paid') return res.status(400).json({ message: 'Payment already verified.' });

    const paymentUsed = await HackathonRegistration.findOne({ 'payment.razorpayPaymentId': razorpay_payment_id }).lean();
    if (paymentUsed) {
      return res.status(400).json({ message: 'This payment has already been used.' });
    }

    await HackathonRegistration.updateOne(
      { _id: registration._id },
      {
        $set: {
          status: 'registered',
          'payment.status': 'paid',
          'payment.razorpayOrderId': razorpay_order_id,
          'payment.razorpayPaymentId': razorpay_payment_id,
          'payment.paidAt': new Date(),
        },
      }
    );

    const leaderUser = await User.findById(registration.leader).lean();
    if (leaderUser?.referredBy) {
      const amountPaidInr = Number(registration.payment?.amountInr || 0);
      const fullPriceInr  = Number(registration.payment?.amountInr || amountPaidInr);
      awardPoints(leaderUser.referredBy, 'paid_hackathon', {
        referredUserId: leaderUser._id,
        amountPaidInr,
        fullPriceInr,
        meta: { hackathonId: req.params.id, registrationId: registration._id },
      }).catch(console.error);
    }

    res.json({ message: 'Payment verified. You can now submit your solution.' });
  } catch (err) {
    console.error('[Events] Hackathon payment verify error:', err);
    res.status(500).json({ message: 'Server error verifying payment.' });
  }
});

// ─── USER: Submit hackathon solution ────────────────────────────────────────
router.post('/hackathons/:id/submit', authOptions, async (req, res) => {
  try {
    const { registrationId, submissionLink, note = '' } = req.body;
    if (!registrationId || !submissionLink) {
      return res.status(400).json({ message: 'registrationId and submissionLink are required.' });
    }

    if (!isHttpUrl(submissionLink)) {
      return res.status(400).json({ message: 'Submission link must be a valid URL starting with http:// or https://.' });
    }

    const registration = await HackathonRegistration.findOne({
      _id: registrationId,
      hackathon: req.params.id,
      'members.user': req.user.id,
    })
      .populate('hackathon', 'submissionConfig paymentConfig status')
      .lean();

    if (!registration || !registration.hackathon) {
      return res.status(404).json({ message: 'Team registration not found.' });
    }

    if (registration.hackathon.status === 'ended') {
      return res.status(400).json({ message: 'This hackathon has ended. Submissions are closed.' });
    }

    // ── STRICT PAYMENT GATE ──────────────────────────────────────────────────
    if (registration.payment?.required && registration.payment?.status !== 'paid') {
      return res.status(403).json({
        message: 'Payment required. Please complete registration payment before submitting.',
        paymentRequired: true,
      });
    }

    // Status must be 'registered' or 'submitted' — not payment_pending
    if (registration.status === 'payment_pending') {
      return res.status(403).json({
        message: 'Your registration payment is pending. Complete payment to unlock submissions.',
        paymentRequired: true,
      });
    }

    const maxSubmissions = Number(registration.hackathon.submissionConfig?.maxSubmissionsPerTeam || 3);
    if ((registration.submissions || []).length >= maxSubmissions) {
      return res.status(400).json({ message: `Submission limit reached (${maxSubmissions}).` });
    }

    // ── Link type validation ─────────────────────────────────────────────────
    const acceptsAnyLink    = Boolean(registration.hackathon.submissionConfig?.acceptsAnyLink);
    const acceptsDriveLink  = Boolean(registration.hackathon.submissionConfig?.acceptsDriveLink);
    const acceptsPdfLink    = Boolean(registration.hackathon.submissionConfig?.acceptsPdfLink);
    const acceptsGitHubLink = Boolean(registration.hackathon.submissionConfig?.acceptsGitHubLink);
    const acceptsNotionLink = Boolean(registration.hackathon.submissionConfig?.acceptsNotionLink);

    if (!acceptsAnyLink) {
      const isDrive  = isDriveLink(submissionLink);
      const isPdf    = isPdfLink(submissionLink);
      const isGitHub = isGitHubLink(submissionLink);
      const isNotion = isNotionLink(submissionLink);

      const allowedByType =
        (acceptsDriveLink  && isDrive)  ||
        (acceptsPdfLink    && isPdf)    ||
        (acceptsGitHubLink && isGitHub) ||
        (acceptsNotionLink && isNotion);

      if (!allowedByType) {
        const allowed = [];
        if (acceptsDriveLink)  allowed.push('Google Drive');
        if (acceptsPdfLink)    allowed.push('PDF link');
        if (acceptsGitHubLink) allowed.push('GitHub repo');
        if (acceptsNotionLink) allowed.push('Notion workspace');
        return res.status(400).json({
          message: `Invalid link type. Accepted: ${allowed.join(', ')}. Check submission instructions.`,
        });
      }
    }

    await HackathonRegistration.updateOne(
      { _id: registrationId },
      {
        $set: {
          status: 'submitted',
          latestSubmissionAt: new Date(),
        },
        $push: {
          submissions: {
            link: String(submissionLink).trim(),
            note: String(note || '').trim(),
            submittedBy: req.user.id,
            submittedAt: new Date(),
          },
        },
      }
    );

    const updated = await HackathonRegistration.findById(registrationId)
      .populate('members.user', 'name email')
      .lean();

    res.json({ message: 'Submission received successfully.', registration: updated });
  } catch (err) {
    console.error('[Events] Hackathon submit error:', err);
    res.status(500).json({ message: 'Server error while submitting.' });
  }
});

// ─── USER: Get my team for a specific hackathon ─────────────────────────────
router.get('/hackathons/:id/my-team', authOptions, async (req, res) => {
  try {
    const registration = await HackathonRegistration.findOne({
      hackathon: req.params.id,
      'members.user': req.user.id,
    })
      .populate('hackathon', 'title paymentConfig submissionConfig')
      .populate('members.user', 'name email')
      .lean();

    if (!registration) return res.status(404).json({ message: 'No team registration found.' });
    res.json(registration);
  } catch (err) {
    console.error('[Events] My team fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: List registrations of a hackathon ───────────────────────────────
router.get('/admin/hackathons/:id/registrations', authOptions, adminCheck, async (req, res) => {
  try {
    const list = await HackathonRegistration.find({ hackathon: req.params.id })
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    console.error('[Events] Admin registrations list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Export registrations of a hackathon to CSV ────────────────────
router.get('/admin/hackathons/:id/registrations/export', authOptions, adminCheck, async (req, res) => {
  try {
    const list = await HackathonRegistration.find({ hackathon: req.params.id })
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    if (!list.length) return res.status(404).json({ message: 'No registrations found' });

    let csv = 'Team Name,Leader Name,Leader Email,Members,Status,Payment Status,Submission Link,Registered At\n';
    list.forEach(reg => {
      const tName = (reg.teamName || '').replace(/"/g, '""');
      const lName = (reg.leader?.name || '').replace(/"/g, '""');
      const lEmail = (reg.leader?.email || '').replace(/"/g, '""');
      
      const membersText = (reg.members || []).map(m => `${m.name} (${m.email})`).join('; ').replace(/"/g, '""');
      const status = reg.status || '';
      const payStatus = reg.payment?.status || '';
      
      const link = reg.submissions?.length > 0 ? (reg.submissions[reg.submissions.length - 1].link || '').replace(/"/g, '""') : '';
      const date = reg.createdAt ? new Date(reg.createdAt).toISOString() : '';
      
      csv += `"${tName}","${lName}","${lEmail}","${membersText}","${status}","${payStatus}","${link}","${date}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`hackathon-${req.params.id}-users.csv`);
    return res.send(csv);
  } catch (err) {
    console.error('[Events] Admin export registrations error:', err);
    res.status(500).json({ message: 'Server error exporting' });
  }
});

// ─── ADMIN: Update registration status / remarks ─────────────────────────────
router.put('/admin/hackathons/:id/registrations/:registrationId', authOptions, adminCheck, async (req, res) => {
  try {
    const { status, adminRemarks = '' } = req.body;
    const allowedStatus = ['registered', 'payment_pending', 'submitted', 'under_review', 'approved', 'rejected', 'winner'];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updates = { adminRemarks: String(adminRemarks || '').trim() };
    if (status) updates.status = status;

    const updated = await HackathonRegistration.findOneAndUpdate(
      { _id: req.params.registrationId, hackathon: req.params.id },
      { $set: updates },
      { new: true }
    )
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .lean();

    if (!updated) return res.status(404).json({ message: 'Registration not found.' });
    res.json(updated);
  } catch (err) {
    console.error('[Events] Admin registration update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Set / unset winner for a registration ───────────────────────────
router.put('/admin/hackathons/:id/registrations/:registrationId/winner', authOptions, adminCheck, async (req, res) => {
  try {
    const { isWinner = true, winnerRank = '', winnerNote = '' } = req.body;

    const updates = {
      isWinner:    Boolean(isWinner),
      winnerRank:  String(winnerRank || '').trim(),
      winnerNote:  String(winnerNote || '').trim(),
      winnerSetAt: isWinner ? new Date() : null,
      status:      isWinner ? 'winner' : 'approved',
    };

    const updated = await HackathonRegistration.findOneAndUpdate(
      { _id: req.params.registrationId, hackathon: req.params.id },
      { $set: updates },
      { new: true }
    )
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .lean();

    if (!updated) return res.status(404).json({ message: 'Registration not found.' });
    res.json(updated);
  } catch (err) {
    console.error('[Events] Admin set winner error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Get all submissions for hackathon (paginated + sorted) ──────────
router.get('/admin/hackathons/:id/submissions', authOptions, adminCheck, async (req, res) => {
  try {
    const page   = Math.max(1, Number(req.query.page   || 1));
    const limit  = Math.min(50, Math.max(5, Number(req.query.limit || 20)));
    const sort   = req.query.sort === 'oldest' ? 1 : -1;
    const status = req.query.status || '';

    const filter = { hackathon: req.params.id, 'submissions.0': { $exists: true } };
    if (status) filter.status = status;

    const total = await HackathonRegistration.countDocuments(filter);
    const registrations = await HackathonRegistration.find(filter)
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .sort({ latestSubmissionAt: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      registrations,
    });
  } catch (err) {
    console.error('[Events] Admin submissions list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Announce / update winner config for hackathon ──────────────────
router.put('/admin/hackathons/:id/winner-config', authOptions, adminCheck, async (req, res) => {
  try {
    const { announced, note } = req.body;
    const updates = {
      'winnerConfig.announced':   Boolean(announced),
      'winnerConfig.note':        String(note || '').trim(),
      'winnerConfig.announcedAt': announced ? new Date() : null,
    };
    const hack = await Hackathon.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!hack) return res.status(404).json({ message: 'Hackathon not found.' });
    res.json(hack);
  } catch (err) {
    console.error('[Events] Admin winner config error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Set score / points for a registration ───────────────────────────
router.put('/admin/hackathons/:id/registrations/:registrationId/score', authOptions, adminCheck, async (req, res) => {
  try {
    const { score, scoreNote = '' } = req.body;
    const parsedScore = Number(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      return res.status(400).json({ message: 'Score must be a number between 0 and 100.' });
    }
    const updated = await HackathonRegistration.findOneAndUpdate(
      { _id: req.params.registrationId, hackathon: req.params.id },
      { $set: { score: parsedScore, scoreNote: String(scoreNote || '').trim(), scoredAt: new Date() } },
      { new: true }
    )
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .lean();
    if (!updated) return res.status(404).json({ message: 'Registration not found.' });
    res.json(updated);
  } catch (err) {
    console.error('[Events] Admin score error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: Issue certificates for a hackathon ───────────────────────────────
router.post('/admin/hackathons/:id/issue-certificates', authOptions, adminCheck, async (req, res) => {
  try {
    const { certType, customTitle, customBody, targetMode, teamIds, winnerRankFilter } = req.body;
    const hackathonId = req.params.id;

    if (!['participation', 'winner'].includes(certType)) {
      return res.status(400).json({ message: 'Invalid certificate type.' });
    }

    const hackathon = await Hackathon.findById(hackathonId).lean();
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found.' });
    }

    // Build filter to query team registrations
    const filter = { hackathon: hackathonId };
    if (targetMode === 'winners') {
      filter.isWinner = true;
      // If specific winner ranks are provided (e.g. ["1st","2nd","3rd"]), filter by them
      if (winnerRankFilter && Array.isArray(winnerRankFilter) && winnerRankFilter.length > 0) {
        filter.winnerRank = { $in: winnerRankFilter.map(r => String(r).trim()).filter(Boolean) };
      }
    } else if (targetMode === 'selected') {
      if (!Array.isArray(teamIds) || teamIds.length === 0) {
        return res.status(400).json({ message: 'No teams selected.' });
      }
      filter._id = { $in: teamIds };
    }

    const registrations = await HackathonRegistration.find(filter)
      .populate('leader', 'name email')
      .populate('members.user', 'name email')
      .lean();

    let issued = 0;
    let skipped = 0;

    const applyTemplate = (value, replacements = {}) => {
      const raw = String(value || '');
      return raw
        .replace(/\{studentName\}/g, replacements.studentName || '')
        .replace(/\{hackathonTitle\}/g, replacements.hackathonTitle || '')
        .replace(/\{hackathonName\}/g, replacements.hackathonTitle || '')
        .replace(/\{teamName\}/g, replacements.teamName || '')
        .replace(/\{winnerRank\}/g, replacements.winnerRank || '');
    };

    for (const reg of registrations) {
      // Gather all team members including the leader
      const studentsToIssue = [];
      const seen = new Set();

      const addStudent = (userField, name, email) => {
        if (!userField) return;
        const uid = typeof userField === 'object' ? (userField._id || userField.id) : userField;
        if (!uid) return;
        const uidStr = uid.toString();
        if (seen.has(uidStr)) return;
        seen.add(uidStr);
        studentsToIssue.push({
          userId: uid,
          name: name || 'Participant',
          email
        });
      };

      // 1. Leader
      if (reg.leader) {
        addStudent(reg.leader, reg.leader.name, reg.leader.email);
      }

      // 2. Members
      if (Array.isArray(reg.members)) {
        for (const m of reg.members) {
          const mUser = m.user;
          const mName = m.name || (mUser && mUser.name);
          const mEmail = m.email || (mUser && mUser.email);
          addStudent(mUser, mName, mEmail);
        }
      }

      // Create certificate for each student
      for (const student of studentsToIssue) {
        const existing = await EventCertificate.findOne({
          student: student.userId,
          hackathonId: hackathon._id,
          certType,
        });

        if (existing) {
          skipped++;
          continue;
        }

        const winnerRankText = String(reg.winnerRank || '').trim() || 'Winner';
        const certificateId = `EVC-${uuidv4().substring(0, 8).toUpperCase()}`;
        const eventCert = new EventCertificate({
          student: student.userId,
          eventType: 'hackathon',
          eventTitle: hackathon.title,
          role: certType === 'winner' ? winnerRankText : 'Participant',
          certificateId,
          issueDate: new Date(),
          pdfStatus: 'ready',
          hackathonId: hackathon._id,
          certType,
          isWinner: certType === 'winner',
          winnerRank: certType === 'winner' ? winnerRankText : '',
          teamName: reg.teamName,
          customTitle: applyTemplate(customTitle, {
            studentName: student.name,
            hackathonTitle: hackathon.title,
            teamName: reg.teamName,
            winnerRank: winnerRankText,
          }),
          customBody: applyTemplate(customBody, {
            studentName: student.name,
            hackathonTitle: hackathon.title,
            teamName: reg.teamName,
            winnerRank: winnerRankText,
          }),
          issuedByAdmin: true,
        });

        await eventCert.save();
        issued++;
      }
    }

    res.json({ message: 'Certificate process complete.', issued, skipped, total: issued + skipped });
  } catch (err) {
    console.error('[Events] Issue certificates error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ADMIN: List certificates of a hackathon ───────────────────────────────
router.get('/admin/hackathons/:id/certificates', authOptions, adminCheck, async (req, res) => {
  try {
    const list = await EventCertificate.find({ hackathonId: req.params.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (err) {
    console.error('[Events] Admin list hackathon certificates error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── USER: Get my hackathon certificate ─────────────────────────────────────
router.get('/hackathons/:id/my-certificate', authOptions, async (req, res) => {
  try {
    const certs = await EventCertificate.find({
      hackathonId: req.params.id,
      student: req.user.id
    })
      .populate('student', 'name')
      .lean();
    
    // Prioritize winner certificate if both exist
    const winnerCert = certs.find(c => c.certType === 'winner');
    res.json(winnerCert || certs[0] || null);
  } catch (err) {
    console.error('[Events] Fetch user hackathon cert error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PDF Builder: Event Certificate (job simulation has premium achievement look) ─────
function buildEventCertificatePdf({ studentName, eventTitle, role, certificateId, issueDate, eventType, verifyUrl }) {
  return new Promise(async (resolve, reject) => {
    /**
 * SkillValix — Professional Certificate PDF Builder (v5)
 *
 * Drop-in replacement for the existing buildEventCertificatePdf function.
 * Uses PDFKit (already installed in the project) + qrcode.
 *
 * Key improvements over v4:
 *  - Richer gold gradient system with shimmer effect
 *  - Refined typography hierarchy and tighter vertical rhythm
 *  - Decorative corner rosette marks
 *  - Elegant watermark monogram behind the name
 *  - Subtle grain/texture overlay via repeating micro-dots
 *  - Improved QR panel with gold border
 *  - Smoother info-card layout with icon-like labels
 *  - Consistent padding constants for easy tweaking
 *  - Non-job-simulation path also fully modernised
 */



// ─── Shared palette ──────────────────────────────────────────────────────────
const P = {
  // Backgrounds
  pageBg:      '#FDFAF3',
  panelBg:     '#FFFEF9',
  // Gold tones
  goldDeep:    '#6B4C0A',
  goldDark:    '#8B6012',
  gold:        '#C9911F',
  goldMid:     '#D4A827',
  goldLight:   '#E8C96A',
  goldPale:    '#F5E4A8',
  goldFaint:   '#FAF3D8',
  // Text
  inkDark:     '#0F1923',
  inkMid:      '#2D3748',
  inkMuted:    '#64748B',
  inkLight:    '#94A3B8',
  // Blue (for non-job-sim variant)
  blueDark:    '#1E3A8A',
  blueMid:     '#2563EB',
  blueLight:   '#BFDBFE',
};

// ─── Layout constants (A4 landscape = 841.89 × 595.28 pt) ───────────────────
const MARGIN_OUTER   = 18;   // outer border inset
const MARGIN_INNER   = 30;   // inner border inset
const BAND_H         = 46;   // gold header band height

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Return a linear gradient spanning the full width of the doc. */
function hGrad(doc, stops) {
  const W = doc.page.width;
  const g = doc.linearGradient(0, 0, W, 0);
  stops.forEach(([pos, color]) => g.stop(pos, color));
  return g;
}

/** Clip text that overflows maxWidth, appending suffix. */
function clipText(doc, text, maxWidth, suffix = '…') {
  const raw = String(text || '').trim();
  if (!raw) return '';
  if (doc.widthOfString(raw) <= maxWidth) return raw;
  const sw = doc.widthOfString(suffix);
  let out = '';
  for (const ch of raw) {
    if (doc.widthOfString(out + ch) + sw > maxWidth) break;
    out += ch;
  }
  return out.trimEnd() + suffix;
}

/** Shrink font until text fits maxWidth; never below minPt. */
function fitFontSize(doc, text, { font = 'Helvetica-Bold', maxPt, minPt, maxWidth }) {
  doc.font(font);
  let size = maxPt;
  while (size > minPt) {
    doc.fontSize(size);
    if (doc.widthOfString(String(text)) <= maxWidth) return size;
    size -= 0.5;
  }
  return minPt;
}

/** Shrink font until text fits within maxHeight; never below minPt. */
function fitFontSizeH(doc, text, opts, { maxPt, minPt }) {
  let size = maxPt;
  while (size > minPt) {
    doc.fontSize(size);
    if (doc.heightOfString(text, opts) <= opts.maxHeight) return size;
    size -= 0.5;
  }
  return minPt;
}

function normalizeCertificateName(name, fallback = 'Learner') {
  return String(name || fallback).trim().replace(/\s+/g, ' ').toUpperCase();
}

function fitCertificateNameLayout(doc, name, maxWidth, { font = 'Helvetica-Bold', maxPt, minPt }) {
  const displayName = normalizeCertificateName(name);
  const words = displayName.split(' ').filter(Boolean);

  let size = maxPt;
  let bestLines = [displayName];

  while (size >= minPt) {
    doc.font(font).fontSize(size);

    if (doc.widthOfString(displayName) <= maxWidth) {
      return { displayName, size, lines: [displayName] };
    }

    if (words.length > 1) {
      let bestSplit = null;
      for (let i = 1; i < words.length; i++) {
        const line1 = words.slice(0, i).join(' ');
        const line2 = words.slice(i).join(' ');
        const width1 = doc.widthOfString(line1);
        const width2 = doc.widthOfString(line2);
        const widest = Math.max(width1, width2);
        if (width1 <= maxWidth && width2 <= maxWidth) {
          if (!bestSplit || widest < bestSplit.widest) {
            bestSplit = { lines: [line1, line2], widest };
          }
        }
      }

      if (bestSplit) {
        return { displayName, size, lines: bestSplit.lines };
      }

      bestLines = [words.join(' ')];
    }

    size -= 0.5;
  }

  doc.font(font).fontSize(minPt);
  if (words.length > 1) {
    for (let i = 1; i < words.length; i++) {
      const line1 = words.slice(0, i).join(' ');
      const line2 = words.slice(i).join(' ');
      if (doc.widthOfString(line1) <= maxWidth && doc.widthOfString(line2) <= maxWidth) {
        return { displayName, size: minPt, lines: [line1, line2] };
      }
    }
  }

  return { displayName, size: minPt, lines: bestLines };
}

/**
 * Draw four decorative corner rosettes (cross + diamond).
 * Placed at each corner inside the inner border.
 */
function drawCornerOrnaments(doc, color = P.goldMid) {
  const W = doc.page.width;
  const H = doc.page.height;
  const inset = MARGIN_INNER + 8;
  const size  = 9;
  const corners = [
    [inset, inset],
    [W - inset, inset],
    [inset, H - inset],
    [W - inset, H - inset],
  ];

  doc.save();
  doc.strokeColor(color).lineWidth(0.8);

  corners.forEach(([cx, cy]) => {
    // Cross arms
    doc.moveTo(cx - size, cy).lineTo(cx + size, cy).stroke();
    doc.moveTo(cx, cy - size).lineTo(cx, cy + size).stroke();
    // Diamond
    const d = size * 0.55;
    doc.moveTo(cx, cy - d)
       .lineTo(cx + d, cy)
       .lineTo(cx, cy + d)
       .lineTo(cx - d, cy)
       .closePath()
       .stroke();
    // Centre dot
    doc.circle(cx, cy, 1.8).fill(color);
  });

  doc.restore();
}

/**
 * Central watermark monogram "SV" printed at very low opacity
 * behind the name area.
 */
function drawWatermark(doc) {
  const W = doc.page.width;
  const H = doc.page.height;
  doc.save();
  doc.fillOpacity(0.032).fillColor(P.goldMid)
     .font('Helvetica-Bold').fontSize(220)
     .text('SV', 0, H / 2 - 130, { width: W, align: 'center', lineBreak: false });
  doc.restore();
}

/**
 * Standard premium footer (shared by both certificate variants).
 */
function drawFooter(doc, opts = {}) {
  const W = doc.page.width;
  const H = doc.page.height;
  const {
    dividerColor = P.goldLight,
    issuerColor  = P.goldDark,
    metaColor    = P.inkMuted,
    trustLine    = 'Digitally Verifiable Credential  ·  Scan QR to Validate Authenticity',
  } = opts;

  const divY   = H - 52;
  const issueY = H - 41;
  const urlY   = H - 29;
  const trustY = H - 18;

  doc.save().fillOpacity(0.85);

  doc.moveTo(90, divY).lineTo(W - 90, divY)
     .lineWidth(0.6).strokeColor(dividerColor).stroke();

  doc.fontSize(6.8).font('Helvetica-Bold').fillColor(issuerColor)
     .text('ISSUED BY SKILLVALIX', 0, issueY, { width: W, align: 'center', characterSpacing: 2.2 });

  doc.fontSize(7).font('Helvetica').fillColor(metaColor)
     .text('www.skillvalix.com', 0, urlY, { width: W, align: 'center' });

  doc.fontSize(6.4).font('Helvetica').fillColor(metaColor)
     .text(trustLine, 0, trustY, { width: W, align: 'center' });

  doc.restore();
}

/**
 * Draw a single info card (Certificate ID / Issued On / Role).
 */
function drawInfoCard(doc, { x, y, w, h, label, value, radius = 9 }) {
  // Card background
  doc.roundedRect(x, y, w, h, radius).fill(P.panelBg);

  // Gold-tinted top stripe
  const stripe = doc.linearGradient(x, y, x + w, y);
  stripe.stop(0, P.goldPale).stop(1, P.goldFaint);
  doc.roundedRect(x, y, w, 18, radius).fill(stripe);
  // Re-cover bottom-round corners of the stripe so it's flat at the bottom
  doc.rect(x, y + 9, w, 9).fill(P.goldPale);

  // Card border
  doc.roundedRect(x, y, w, h, radius)
     .lineWidth(0.9).strokeColor(P.goldLight).stroke();

  const padX = 18;

  // Label
    const labelMaxW = w - padX * 2;
    const safeLabel = clipText(doc.font('Helvetica-Bold').fontSize(6.6), String(label).toUpperCase(), labelMaxW);
    doc.fillColor(P.goldDark)
       .text(safeLabel, x + padX, y + 6,
         { width: labelMaxW, characterSpacing: 1.2, lineBreak: false });

  // Separator
  doc.moveTo(x + padX, y + 20).lineTo(x + w - padX, y + 20)
     .lineWidth(0.4).strokeColor(P.goldLight).stroke();

  // Value — auto-shrink
  const maxValW = w - padX * 2;
  const valSize = fitFontSize(doc, value, {
    font: 'Helvetica-Bold', maxPt: 12.5, minPt: 8, maxWidth: maxValW,
  });
  const safeVal = clipText(doc.fontSize(valSize), value, maxValW);
  const valY = y + 24 + (h - 44 - valSize) / 2;

  doc.font('Helvetica-Bold').fontSize(valSize)
     .fillColor(P.inkDark)
     .text(safeVal, x + padX, valY, { width: maxValW, lineBreak: false });
}

// ─── Main exported function ───────────────────────────────────────────────────

/**
 * Builds and returns a PDF buffer for an event certificate.
 *
 * @param {object} params
 * @param {string} params.studentName
 * @param {string} params.eventTitle
 * @param {string} params.role
 * @param {string} params.certificateId
 * @param {string} params.issueDate        — pre-formatted, e.g. "28 March 2026"
 * @param {string} params.eventType        — "job-simulation" | anything else
 * @param {string} params.verifyUrl        — full URL for QR code
 * @returns {Promise<Buffer>}
 */
 function buildEventCertificatePdf({
  studentName,
  eventTitle,
  role,
  certificateId,
  issueDate,
  eventType,
  verifyUrl,
}) {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data',  (c) => chunks.push(c));
    doc.on('end',   ()  => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    try {
      // ── QR code ────────────────────────────────────────────────────────────
      const qrBuf = await QRCode.toBuffer(verifyUrl, {
        errorCorrectionLevel: 'H',
        width: 220,
        margin: 1,
        color: { dark: '#0F1923', light: '#FFFFFF' },
      });

      const W  = doc.page.width;   // 841.89
      const H  = doc.page.height;  // 595.28
      const CX = W / 2;

      const isJobSim = String(eventType || '').toLowerCase() === 'job-simulation';

      if (isJobSim) {
        await buildJobSimCertificate(doc, {
          W, H, CX, qrBuf,
          studentName, eventTitle, role, certificateId, issueDate,
        });
      } else {
        await buildGenericCertificate(doc, {
          W, H, CX, qrBuf,
          studentName, eventTitle, role, certificateId, issueDate,
        });
      }

      doc.end();
    } catch (err) {
      doc.destroy();
      reject(err);
    }
  });
}

// ─── Job Simulation Certificate ───────────────────────────────────────────────

async function buildJobSimCertificate(doc, {
  W, H, CX, qrBuf, studentName, eventTitle, role, certificateId, issueDate,
}) {
  // ── 1. Page background with warm radial centre-glow ──────────────────────
  doc.rect(0, 0, W, H).fill(P.pageBg);

  const radGlow = doc.radialGradient(CX, H * 0.48, 20, CX, H * 0.48, 390);
  radGlow.stop(0, '#FFFFFF').stop(0.6, '#FDFAF2').stop(1, P.pageBg);
  doc.rect(0, 0, W, H).fill(radGlow);

  // ── 2. Watermark monogram ─────────────────────────────────────────────────
  drawWatermark(doc);

  // ── 3. Borders: outer (thick gold) + inner (hairline) ────────────────────
  const outerGrad = hGrad(doc, [[0, P.goldDark], [0.25, P.goldMid], [0.5, P.goldLight], [0.75, P.goldMid], [1, P.goldDark]]);
  doc.rect(MARGIN_OUTER, MARGIN_OUTER, W - MARGIN_OUTER * 2, H - MARGIN_OUTER * 2)
     .lineWidth(2.5).strokeColor(outerGrad).stroke();

  doc.rect(MARGIN_INNER, MARGIN_INNER, W - MARGIN_INNER * 2, H - MARGIN_INNER * 2)
     .lineWidth(0.7).strokeColor(P.goldPale).stroke();

  // ── 5. Corner ornaments ───────────────────────────────────────────────────
  drawCornerOrnaments(doc);

  // ── 6. Header band ───────────────────────────────────────────────────────
  const BAND_Y = MARGIN_INNER;
  const bandGrad = hGrad(doc, [[0, P.goldDeep], [0.15, P.goldDark], [0.5, P.goldMid], [0.85, P.goldDark], [1, P.goldDeep]]);
  doc.rect(MARGIN_INNER, BAND_Y, W - MARGIN_INNER * 2, BAND_H).fill(bandGrad);

  // Gold shimmer line at top of band
  doc.moveTo(MARGIN_INNER, BAND_Y + 2).lineTo(W - MARGIN_INNER, BAND_Y + 2)
     .lineWidth(0.5).strokeColor('#F0D98A').stroke();
  // Bottom edge highlight
  doc.moveTo(MARGIN_INNER, BAND_Y + BAND_H - 1).lineTo(W - MARGIN_INNER, BAND_Y + BAND_H - 1)
     .lineWidth(0.5).strokeColor(P.goldDeep).stroke();

  doc.fontSize(10.2).font('Helvetica-Bold').fillColor('#FFF8E0')
     .text('SKILLVALIX  ·  PROFESSIONAL ACHIEVEMENT', 0, BAND_Y + 16,
           { width: W, align: 'center', characterSpacing: 3.2 });

  // ── 7. Layout anchor ─────────────────────────────────────────────────────
  let curY = BAND_Y + BAND_H + 14;

  // ── 8. Certificate title ─────────────────────────────────────────────────
  doc.fontSize(13.5).font('Helvetica-Bold').fillColor(P.goldDeep)
     .text('CERTIFICATE OF ACHIEVEMENT', 0, curY,
           { width: W, align: 'center', characterSpacing: 3 });
  curY += 22;

  // Thin gold divider
  const divHalf = 130;
  doc.moveTo(CX - divHalf, curY).lineTo(CX + divHalf, curY)
     .lineWidth(0.5).strokeColor(P.goldLight).stroke();
  curY += 10;

  // ── 9. "This certifies that" ─────────────────────────────────────────────
  doc.fontSize(10.5).font('Helvetica').fillColor(P.inkMuted)
     .text('This certifies that', 0, curY, { width: W, align: 'center' });
  curY += 15;

  // ── 10. Learner name (auto-size) ─────────────────────────────────────────
  const nameMaxW = W - 230; // leave room for QR on the right
  const { size: nameSize, lines: nameLines } = fitCertificateNameLayout(doc, studentName, nameMaxW, {
    font: 'Helvetica-Bold', maxPt: 46, minPt: 22, maxWidth: nameMaxW,
  });
  const nameLineGap = 4;
  const nameBlockH = nameLines.length * nameSize + (nameLines.length - 1) * nameLineGap;
  doc.font('Helvetica-Bold').fontSize(nameSize).fillColor(P.inkDark)
     .text(nameLines.join('\n'), (W - nameMaxW) / 2, curY, {
       width: nameMaxW,
       align: 'center',
       lineBreak: true,
       lineGap: nameLineGap,
     });

  const underY = curY + nameBlockH + 5;
  // Double underline (thick + thin)
  doc.moveTo(CX - 220, underY).lineTo(CX + 220, underY)
     .lineWidth(1.6).strokeColor(P.goldMid).stroke();
  doc.moveTo(CX - 220, underY + 3.5).lineTo(CX + 220, underY + 3.5)
     .lineWidth(0.4).strokeColor(P.goldPale).stroke();

  curY = underY + 13;

  // ── 11. Subtitle ─────────────────────────────────────────────────────────
  doc.fontSize(10.8).font('Helvetica').fillColor(P.inkMuted)
     .text('has successfully completed the professional job simulation', 0, curY,
           { width: W, align: 'center' });
  curY += 18;

  // ── 12. Event title panel ─────────────────────────────────────────────────
  const ET_W  = W - 250;
  const ET_X  = (W - ET_W) / 2;
  const ET_PAD_X = 24;
  const ET_PAD_Y = 10;
  const textW = ET_W - ET_PAD_X * 2;

  // Measure title text to determine panel height
  let etSize = 22;
  const etTextOpts = { width: textW, align: 'center', lineGap: 1 };
  etSize = fitFontSizeH(doc.font('Helvetica-Bold'), String(eventTitle || ''), { ...etTextOpts, maxHeight: 44 }, { maxPt: 22, minPt: 14 });
  const etText   = String(eventTitle || '').trim() || 'Job Simulation';
  const etH      = doc.fontSize(etSize).heightOfString(etText, etTextOpts) + ET_PAD_Y * 2;
  const ET_Y     = curY;

  // Panel shadow (offset fill)
  doc.roundedRect(ET_X + 3, ET_Y + 3, ET_W, etH, 11).fill('#E8D9A0').fillOpacity(0.35);
  doc.fillOpacity(1);

  // Panel bg + border
  doc.roundedRect(ET_X, ET_Y, ET_W, etH, 11).fill(P.panelBg);
  const panelBorder = hGrad(doc, [[0, P.goldPale], [0.5, P.goldLight], [1, P.goldPale]]);
  doc.roundedRect(ET_X, ET_Y, ET_W, etH, 11)
     .lineWidth(1.1).strokeColor(panelBorder).stroke();

  // Left + right gold bars inside panel
  doc.rect(ET_X + 8, ET_Y + 8, 3, Math.max(8, etH - 16)).fill(P.goldMid);
  doc.rect(ET_X + ET_W - 11, ET_Y + 8, 3, Math.max(8, etH - 16)).fill(P.goldMid);

  doc.font('Helvetica-Bold').fontSize(etSize).fillColor(P.inkDark)
     .text(etText, ET_X + ET_PAD_X, ET_Y + ET_PAD_Y, etTextOpts);

  curY = ET_Y + etH + 8;

  // ── 13. Description line ─────────────────────────────────────────────────
    const descText = 'Awarded for practical expertise, structured problem-solving, and job-ready skills in a real-world simulation.';
    const descW = Math.round(W * 0.63);
    const descX = (W - descW) / 2;
    const safeDesc = clipText(doc.font('Helvetica').fontSize(8.3), descText, descW);
    doc.fillColor(P.inkMuted)
      .text(safeDesc, descX, curY, { width: descW, align: 'center', lineBreak: false });

    curY += 18;

  // ── 14. Info cards (Certificate ID / Issued On / Role) ──────────────────
  const CARD_W   = 198;
  const CARD_H   = 68;
  const CARD_GAP = 20;
  const totalCardsW = CARD_W * 3 + CARD_GAP * 2;
  const cardsX  = (W - totalCardsW) / 2;
  const cardsY  = Math.max(curY, H - 140);

  [
    { label: 'Certificate ID', value: certificateId },
    { label: 'Issued On',      value: issueDate      },
    { label: 'Role',           value: role || 'Participant' },
  ].forEach((card, i) => {
    drawInfoCard(doc, {
      x: cardsX + i * (CARD_W + CARD_GAP),
      y: cardsY,
      w: CARD_W,
      h: CARD_H,
      label: card.label,
      value: card.value,
    });
  });

  // ── 15. QR panel (top-right) ─────────────────────────────────────────────
  const QR_SIZE  = 80;
  const QR_PAD   = 10;
  const QR_TOTAL = QR_SIZE + QR_PAD * 2;
  const QR_LABEL_H = 28;
  const QR_BOX_H = QR_TOTAL + QR_LABEL_H;
  const QR_BOX_W = QR_TOTAL + 6;
  const QR_X = W - MARGIN_INNER - QR_BOX_W - 8;
  const QR_Y = BAND_Y + BAND_H + 14;

  // QR card shadow
  doc.roundedRect(QR_X + 2, QR_Y + 2, QR_BOX_W, QR_BOX_H, 10).fill('#D4BE88').fillOpacity(0.22);
  doc.fillOpacity(1);

  doc.roundedRect(QR_X, QR_Y, QR_BOX_W, QR_BOX_H, 10).fill('#FFFFFF');
  const qrBorder = hGrad(doc, [[0, P.goldPale], [0.5, P.goldLight], [1, P.goldPale]]);
  doc.roundedRect(QR_X, QR_Y, QR_BOX_W, QR_BOX_H, 10)
     .lineWidth(1).strokeColor(qrBorder).stroke();

  // Gold bar at top of QR panel
  const qrBandGrad = hGrad(doc, [[0, P.goldDark], [0.5, P.goldMid], [1, P.goldDark]]);
  doc.roundedRect(QR_X, QR_Y, QR_BOX_W, 16, 10).fill(qrBandGrad);
  doc.rect(QR_X, QR_Y + 8, QR_BOX_W, 8).fill(qrBandGrad); // flatten bottom rounds
  doc.fontSize(5.5).font('Helvetica-Bold').fillColor('#FFF8E0')
     .text('VERIFY', QR_X, QR_Y + 5, { width: QR_BOX_W, align: 'center', characterSpacing: 1.5 });

  doc.image(qrBuf, QR_X + QR_PAD + 3, QR_Y + 18, { width: QR_SIZE, height: QR_SIZE });

  doc.fontSize(6).font('Helvetica').fillColor(P.inkMuted)
     .text('Scan to verify', QR_X, QR_Y + 20 + QR_SIZE + 4, { width: QR_BOX_W, align: 'center' });
  doc.fontSize(5.5).font('Helvetica').fillColor(P.goldDark)
     .text('authenticity', QR_X, QR_Y + 30 + QR_SIZE + 4, { width: QR_BOX_W, align: 'center' });

  // ── 16. Footer ────────────────────────────────────────────────────────────
  drawFooter(doc, {
    dividerColor: P.goldLight,
    issuerColor:  P.goldDark,
    metaColor:    P.inkMuted,
    trustLine:    'Digitally Verifiable Credential  ·  Scan QR to Validate Authenticity',
  });
}

// ─── Generic / Event Certificate ─────────────────────────────────────────────

async function buildGenericCertificate(doc, {
  W, H, CX, qrBuf, studentName, eventTitle, role, certificateId, issueDate,
}) {
  // Background
  doc.rect(0, 0, W, H).fill('#F8FAFC');

  // Header band (blue gradient)
  const headerGrad = hGrad(doc, [[0, P.blueDark], [0.5, P.blueMid], [1, P.blueDark]]);
  doc.rect(0, 0, W, 130).fill(headerGrad);

  // Shimmer line in header
  doc.moveTo(0, 2).lineTo(W, 2).lineWidth(1).strokeColor('#93C5FD').stroke();

  // Brand name
  doc.fontSize(30).font('Helvetica-Bold').fillColor('#FFFFFF')
     .text('SkillValix', 50, 44, { lineBreak: false });

  // Tagline
  doc.fontSize(11).font('Helvetica').fillColor(P.blueLight)
     .text('Verified Certificate of Completion', 50, 84, { lineBreak: false });

  // Outer border
  doc.rect(18, 18, W - 36, H - 36).lineWidth(1).strokeColor('#CBD5E1').stroke();

  let curY = 160;

  // Certificate title
  doc.fontSize(13).font('Helvetica-Bold').fillColor('#0F172A')
     .text('CERTIFICATE OF COMPLETION', 0, curY,
           { width: W, align: 'center', characterSpacing: 3.5 });
  curY += 30;

  // Divider
  const blueDivGrad = doc.linearGradient(CX - 120, 0, CX + 120, 0);
  blueDivGrad.stop(0, 'transparent').stop(0.3, P.blueMid).stop(0.7, P.blueMid).stop(1, 'transparent');
  doc.moveTo(CX - 120, curY).lineTo(CX + 120, curY).lineWidth(1.2).strokeColor(P.blueMid).stroke();
  curY += 14;

  // Intro
  doc.fontSize(11).font('Helvetica').fillColor('#64748B')
     .text('This is proudly presented to', 0, curY, { width: W, align: 'center' });
  curY += 18;

  // Name
  const nameMaxW = W - 200;
  const { size: nameSize, lines: nameLines } = fitCertificateNameLayout(doc, studentName, nameMaxW, {
    font: 'Helvetica-Bold', maxPt: 44, minPt: 20, maxWidth: nameMaxW,
  });
  const nameLineGap = 4;
  const nameBlockH = nameLines.length * nameSize + (nameLines.length - 1) * nameLineGap;
  doc.font('Helvetica-Bold').fontSize(nameSize).fillColor('#0F172A')
     .text(nameLines.join('\n'), 0, curY, {
       width: W,
       align: 'center',
       lineBreak: true,
       lineGap: nameLineGap,
     });

  const underY = curY + nameBlockH + 6;
  doc.moveTo(CX - 180, underY).lineTo(CX + 180, underY)
     .lineWidth(1.4).strokeColor(P.blueMid).stroke();
  curY = underY + 14;

  // Body
  doc.fontSize(11).font('Helvetica').fillColor('#64748B')
     .text('for successfully completing the event', 0, curY, { width: W, align: 'center' });
  curY += 18;

  doc.fontSize(22).font('Helvetica-Bold').fillColor(P.blueMid)
     .text(String(eventTitle || ''), 60, curY, { width: W - 120, align: 'center' });
  const evH = doc.heightOfString(String(eventTitle || ''), { width: W - 120, align: 'center' });
  curY += evH + 14;

  doc.fontSize(9).font('Helvetica').fillColor('#64748B')
     .text('This certificate is a verifiable record of practical performance, consistency, and applied outcomes.', 0, curY, { width: W, align: 'center' });
  curY += 22;

  // Info cards
  const CARD_W   = 200;
  const CARD_H   = 68;
  const CARD_GAP = 20;
  const totalW   = CARD_W * 3 + CARD_GAP * 2;
  const startX   = (W - totalW) / 2;
  const cardsY   = H - CARD_H - 60;

  [
    { label: 'Certificate ID', value: certificateId },
    { label: 'Issued On',      value: issueDate      },
    { label: 'Role',           value: role || 'Participant' },
  ].forEach((card, i) => {
    drawInfoCard(doc, {
      x: startX + i * (CARD_W + CARD_GAP),
      y: cardsY,
      w: CARD_W,
      h: CARD_H,
      label: card.label,
      value: card.value,
    });
  });

  // QR panel
  const QR_SIZE   = 96;
  const QR_PAD    = 10;
  const QR_BOX_W  = QR_SIZE + QR_PAD * 2 + 4;
  const QR_BOX_H  = QR_SIZE + QR_PAD * 2 + 30;
  const QR_X      = W - QR_BOX_W - 54;
  const QR_Y      = 150;

  doc.roundedRect(QR_X, QR_Y, QR_BOX_W, QR_BOX_H, 12).fill('#FFFFFF');
  doc.roundedRect(QR_X, QR_Y, QR_BOX_W, QR_BOX_H, 12)
     .lineWidth(1).strokeColor('#E2E8F0').stroke();
  doc.image(qrBuf, QR_X + QR_PAD, QR_Y + QR_PAD, { width: QR_SIZE, height: QR_SIZE });
  doc.fontSize(7.2).font('Helvetica-Bold').fillColor('#94A3B8')
     .text('SCAN TO VERIFY', QR_X, QR_Y + QR_PAD * 2 + QR_SIZE + 6,
           { width: QR_BOX_W, align: 'center' });

  // Footer
  drawFooter(doc, {
    dividerColor: '#CBD5E1',
    issuerColor:  P.blueDark,
    metaColor:    '#64748B',
    trustLine:    'Verified Credential Platform  ·  Industry-Relevant Certification',
  });
}
  });
}

// ─── Public Job Simulation Endpoints ───────────────────────────────────────

router.get('/simulations/:simId/price', async (req, res) => {
  try {
    const { simId } = req.params;
    let basePrice = DEFAULT_SIM_CERT_COST;
    let title = simId;
    try {
      const simsData = JSON.parse(fs.readFileSync(SIM_JSON_PATH, 'utf-8'));
      const matchedSim = simsData.find(s => s.id === simId || s.slug === simId);
      if (matchedSim) {
        basePrice = await getSimCertCostInr(matchedSim.id, matchedSim.certCost);
        title = matchedSim.title;
      } else {
        const dbPrice = await SimulationPrice.findOne({ simId: String(simId), isActive: true }).lean();
        if (dbPrice) basePrice = dbPrice.certCostInr;
      }
    } catch(e) {
      console.warn('Failed reading JSON for sim price:', e.message);
    }
    res.json({ simId, certCostInr: basePrice, priceRupees: basePrice, title });
  } catch (err) {
    console.error('[Events] Fetch sim price error:', err);
    res.status(500).json({ message: 'Error fetching simulation price' });
  }
});

router.post('/simulations/validate-coupon', authOptions, async (req, res) => {
  try {
    const code = (req.body.code || '').toString().trim().toUpperCase();
    const { simId } = req.body;

    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code is required.' });
    if (!simId) return res.status(400).json({ valid: false, message: 'Simulation ID is required.' });

    const coupon = await SimulationCoupon.findOne({ code });
    if (!coupon) return res.status(404).json({ valid: false, message: 'Coupon not found.' });

    if (!coupon.isValid()) {
      let reason = 'This coupon is not valid.';
      if (!coupon.isActive) reason = 'This coupon has been deactivated.';
      else if (coupon.validUntil && new Date() > coupon.validUntil) reason = 'This coupon has expired.';
      else if (coupon.validFrom && new Date() < coupon.validFrom) reason = 'This coupon is not yet active.';
      else if (coupon.maxUsageLimit !== null && coupon.usedCount >= coupon.maxUsageLimit) {
        reason = 'This coupon has reached its usage limit.';
      }
      return res.status(400).json({ valid: false, message: reason });
    }

    if (coupon.simIds && coupon.simIds.length > 0 && !coupon.simIds.includes(String(simId))) {
      return res.status(400).json({ valid: false, message: 'This coupon is not valid for this simulation.' });
    }

    let basePrice = DEFAULT_SIM_CERT_COST;
    try {
      const simsData = JSON.parse(fs.readFileSync(SIM_JSON_PATH, 'utf-8'));
      const matchedSim = simsData.find(s => s.id === String(simId) || s.slug === String(simId));
      if (matchedSim) {
        basePrice = await getSimCertCostInr(matchedSim.id, matchedSim.certCost);
      }
    } catch(e) {}
    
    const basePaise = basePrice * 100;
    const discountedPaise = coupon.applyDiscount(basePaise);
    
    return res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalAmountPaise: basePaise,
      discountedAmountPaise: discountedPaise,
      originalAmountRupees: basePaise / 100,
      discountedAmountRupees: discountedPaise / 100,
      savedAmountRupees: (basePaise - discountedPaise) / 100,
    });
  } catch (err) {
    console.error('[Events] Validate sim coupon error:', err);
    res.status(500).json({ valid: false, message: 'Server error validating coupon.' });
  }
});

// ─── Razorpay Order Creation (Event Certificates) ───────────────────────────
router.post('/certificates/razorpay-order', authOptions, async (req, res) => {
  try {
    const { eventTitle, eventType = 'job-simulation', role = 'Participant', couponCode } = req.body;
    if (!eventTitle) return res.status(400).json({ message: 'eventTitle is required.' });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Resolve the actual price from DB first, then JSON, then fallback.
    let basePrice = DEFAULT_SIM_CERT_COST; // Fallback
    let matchedSimId = null;
    try {
      if (eventType === 'job-simulation') {
        const simsData = JSON.parse(fs.readFileSync(SIM_JSON_PATH, 'utf-8'));
        const matchedSim = simsData.find(s => s.title === eventTitle);
        if (!matchedSim) return res.status(404).json({ message: 'Simulation data not found' });
        
        // SECURITY LOOPHOLE: Prevent users from buying a certificate without finishing tasks
        const progress = await SimulationProgress.findOne({ user: req.user.id, simulationId: matchedSim.id });
        const totalTasks = Array.isArray(matchedSim.tasks) ? matchedSim.tasks.length : 0;
        const minRequired = Math.max(1, Math.ceil(totalTasks * 0.6));
        const completedCount = matchedSim.tasks.filter(t => progress?.completedTasks?.includes(t.num)).length;

        if (completedCount < minRequired && user.role !== 'admin') {
          return res.status(400).json({
            message: `Complete at least ${minRequired} out of ${totalTasks} tasks before paying for a certificate.`,
          });
        }

        // DB price takes priority over JSON certCost
        basePrice = await getSimCertCostInr(matchedSim.id, matchedSim.certCost);
        matchedSimId = matchedSim.id;
      }
    } catch(e) { console.error('[Events] Failed to parse job-simulations.json for price/completion', e); }

    const isAdminTestMode = user.role === 'admin';
    let amountToCharge = isAdminTestMode ? 100 : basePrice * 100; // paise

    let appliedCoupon = null;
    if (!isAdminTestMode && couponCode && matchedSimId && eventType === 'job-simulation') {
      const code = String(couponCode).trim().toUpperCase();
      const coupon = await SimulationCoupon.findOne({ code });
      if (coupon && coupon.isValid()) {
        if (!coupon.simIds?.length || coupon.simIds.includes(matchedSimId)) {
          amountToCharge = coupon.applyDiscount(amountToCharge);
          appliedCoupon = code;
        }
      }
    }

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const expectedReceipt = `receipt_event_${req.user.id}`.substring(0, 40);
    const options = {
      amount: amountToCharge,
      currency: 'INR',
      receipt: expectedReceipt,
      notes: { eventTitle, eventType, role, couponCode: appliedCoupon || '' } // Store in backend order directly
    };

    const order = await rzp.orders.create(options);
    res.json({
      ...order,
      isAdminTestMode,
      displayAmountRupees: amountToCharge / 100,
    });
  } catch (err) {
    console.error('[Events] Razorpay order error:', err);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// ─── Generate event certificate (Verified Payment Required) ─────────────────
router.post('/certificates/generate', authOptions, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required payment verification fields' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature - potential tampering detected' });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await rzp.orders.fetch(razorpay_order_id);
    const expectedReceipt = `receipt_event_${req.user.id}`.substring(0, 40);

    if (!order || order.receipt !== expectedReceipt) {
      return res.status(400).json({ message: 'Payment mismatch: The order receipt is invalid.' });
    }

    // SECURITY LOOPHOLE CLOSED: Extract metadata firmly from the verified Razorpay order
    // to prevent malicious payload tampering in the request block.
    const verifiedTitle = order.notes?.eventTitle || req.body.eventTitle;
    const verifiedType = order.notes?.eventType || req.body.eventType || 'job-simulation';
    const verifiedRole = order.notes?.role || req.body.role || 'Participant';

    if (!verifiedTitle) {
      return res.status(400).json({ message: 'Missing authentic eventTitle from order logs.' });
    }

    // Determine actual expected amount to fully stamp out price manipulation checks
    let basePrice = DEFAULT_SIM_CERT_COST;
    let matchedSimId = null;
    try {
      if (verifiedType === 'job-simulation') {
        const simsData = JSON.parse(fs.readFileSync(SIM_JSON_PATH, 'utf-8'));
        const matchedSim = simsData.find(s => s.title === verifiedTitle);
        if (matchedSim) {
          matchedSimId = matchedSim.id;
          // DB price takes priority over JSON certCost
          basePrice = await getSimCertCostInr(matchedSim.id, matchedSim.certCost);
        }
      }
    } catch(e) { console.warn('[Events] Price verify fallback:', e.message); }
    
    let expectedAmount = user.role === 'admin' ? 100 : basePrice * 100;
    let appliedCouponDoc = null;

    if (user.role !== 'admin' && order.notes?.couponCode && matchedSimId && verifiedType === 'job-simulation') {
      const code = String(order.notes.couponCode).trim().toUpperCase();
      const coupon = await SimulationCoupon.findOne({ code });
      if (coupon && coupon.isValid()) {
        if (!coupon.simIds?.length || coupon.simIds.includes(matchedSimId)) {
          expectedAmount = coupon.applyDiscount(expectedAmount);
          appliedCouponDoc = coupon;
        }
      }
    }

    if (order.amount !== expectedAmount) {
       return res.status(400).json({ message: 'Payment mismatch: The order amount does not match current event price (or coupon invalid).' });
    }

    // SECURITY: Ensure payment ID hasn't been used for another certificate
    const paymentUsed = await EventCertificate.findOne({ paymentId: razorpay_payment_id });
    if (paymentUsed) {
      return res.status(400).json({ message: 'This payment has already been redeemed.' });
    }

    // Payment successfully verified! Create the certificate records.
    let cert = await EventCertificate.findOne({ student: user._id, eventTitle: verifiedTitle, eventType: verifiedType });
    if (cert) {
      return res.status(400).json({ message: 'You already have this certificate.' });
    }

    const certId = `EVC-${uuidv4().substring(0, 8).toUpperCase()}`;
    cert = new EventCertificate({ 
      student: user._id, 
      eventType: verifiedType, 
      eventTitle: verifiedTitle, 
      role: verifiedRole, 
      certificateId: certId, 
      paymentId: razorpay_payment_id,
      pdfTemplateVersion: EVENT_CERT_TEMPLATE_VERSION,
    });
    await cert.save();

    if (user.referredBy) {
      const amountPaidInr = order.amount / 100;
      const fullPriceInr  = basePrice;
      awardPoints(user.referredBy, 'paid_simulation', {
        referredUserId: user._id,
        amountPaidInr,
        fullPriceInr,
        couponCode: appliedCouponDoc?.code,
        couponDiscount: appliedCouponDoc?.discountValue,
        meta: { simId: matchedSimId, eventTitle: verifiedTitle },
      }).catch(console.error);

      awardPoints(user.referredBy, 'certificate', {
        referredUserId: user._id,
        meta: { certificateId: cert.certificateId, eventType: cert.eventType },
      }).catch(console.error);
    }

    if (appliedCouponDoc) {
      appliedCouponDoc.usedCount += 1;
      await appliedCouponDoc.save();
    }

    // Generate PDF immediately
    const issueDate = new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `${FRONTEND_URL()}/verify/${cert.certificateId}`;

    try {
      const pdfBuffer = await buildEventCertificatePdf({
        studentName: user.name, eventTitle: cert.eventTitle, role: cert.role,
        certificateId: cert.certificateId, issueDate, eventType: cert.eventType, verifyUrl,
      });
      await EventCertificate.updateOne({ _id: cert._id }, {
        $set: {
          pdfStatus: 'ready',
          pdfBuffer,
          pdfSizeBytes: pdfBuffer.length,
          pdfGeneratedAt: new Date(),
          pdfTemplateVersion: EVENT_CERT_TEMPLATE_VERSION,
          pdfError: '',
        }
      });
    } catch (pdfErr) {
      console.error('[Events] PDF build error:', pdfErr.message);
    }

    res.json({ message: 'Certificate generated.', certificateId: cert.certificateId, issueDate: cert.issueDate });
  } catch (err) {
    console.error('[Events] Generate cert error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Prepare event certificate PDF (generate + save) ──────────────────────────
router.post('/certificates/prepare/:certId', authOptions, async (req, res) => {
  try {
    const cert = await EventCertificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name').lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });

    // Only the owner or admin can prepare
    const isOwner = String(cert.student?._id || cert.student) === String(req.user.id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const hasLatestTemplate = Number(cert.pdfTemplateVersion || 0) >= EVENT_CERT_TEMPLATE_VERSION;
    if (cert.pdfStatus === 'ready' && hasLatestTemplate) {
      return res.json({ pdfStatus: 'ready', certificateId: cert.certificateId });
    }

    // Mark as generating
    await EventCertificate.updateOne({ _id: cert._id }, { $set: { pdfStatus: 'generating', pdfError: '' } });

    const issueDate = new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `${FRONTEND_URL()}/verify/${cert.certificateId}`;
    const studentName = cert.student?.name || 'Student';

    try {
      const pdfBuffer = await buildEventCertificatePdf({
        studentName, eventTitle: cert.eventTitle, role: cert.role,
        certificateId: cert.certificateId, issueDate, eventType: cert.eventType, verifyUrl,
      });
      await EventCertificate.updateOne({ _id: cert._id }, {
        $set: {
          pdfStatus: 'ready',
          pdfBuffer,
          pdfSizeBytes: pdfBuffer.length,
          pdfGeneratedAt: new Date(),
          pdfTemplateVersion: EVENT_CERT_TEMPLATE_VERSION,
          pdfError: '',
        }
      });
      return res.json({ pdfStatus: 'ready', certificateId: cert.certificateId });
    } catch (pdfErr) {
      console.error('[Events] PDF build error in prepare:', pdfErr.message);
      await EventCertificate.updateOne({ _id: cert._id }, { $set: { pdfStatus: 'failed', pdfError: pdfErr.message } });
      return res.status(500).json({ message: 'PDF generation failed. Please try again.', pdfStatus: 'failed' });
    }
  } catch (err) {
    console.error('[Events] Prepare cert error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Download event certificate (ONLY serves stored PDFs) ─────────────────────
router.get('/certificates/download/:certId', async (req, res) => {
  try {
    const cert = await EventCertificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name').select('+pdfBuffer').lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });

    const hasLatestTemplate = Number(cert.pdfTemplateVersion || 0) >= EVENT_CERT_TEMPLATE_VERSION;

    if (cert.pdfStatus === 'ready' && hasLatestTemplate) {
      const rawBuf = cert.pdfBuffer?.buffer || cert.pdfBuffer;
      if (!rawBuf || rawBuf.length === 0) {
        return res.status(503).json({ message: 'PDF not ready. Call /prepare first.', pdfStatus: 'pending' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=EventCertificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.send(rawBuf);
    }

    // PDF not ready — tell client to call prepare first
    return res.status(503).json({
      message: 'PDF not ready. Please call prepare first.',
      pdfStatus: cert.pdfStatus || 'pending',
      certificateId: cert.certificateId,
    });
  } catch (err) {
    console.error('[Events] Download cert error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Verify event certificate (public) ───────────────────────────────────────
router.get('/certificates/verify/:certId', certVerifyLimiter, async (req, res) => {
  try {
    const cert = await EventCertificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name').lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({
      valid: true, studentName: cert.student?.name,
      eventTitle: cert.eventTitle, eventType: cert.eventType,
      role: cert.role, issueDate: cert.issueDate,
      certificateId: cert.certificateId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Get my event certificates ────────────────────────────────────────────────
router.get('/certificates/mine', authOptions, async (req, res) => {
  try {
    const certs = await EventCertificate.find({ student: req.user.id })
      .select('eventType eventTitle role certificateId issueDate pdfStatus createdAt')
      .sort({ createdAt: -1 }).lean();
    res.setHeader('Cache-Control', 'no-store');
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Lightweight Task Validation ──────────────────────────────────────────────
router.post('/simulations/validate-task', authOptions, taskValidateLimiter, async (req, res) => {
  try {
    const { url, taskType, simId, taskNum } = req.body;
    if (!url || !taskType || !simId || !taskNum) {
      return res.status(400).json({ valid: false, message: 'Missing required parameters.' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({ valid: false, message: 'Invalid format. Please submit a valid http:// or https:// link.' });
    }

    const host = parsedUrl.host.toLowerCase();
    const numericTaskNum = Number(taskNum);
    if (!Number.isFinite(numericTaskNum)) {
      return res.status(400).json({ valid: false, message: 'Invalid task number.' });
    }

    // Map domains by type for realism
    const EXPECTED_DOMAINS = {
      'Coding': ['github.com', 'codesandbox.io', 'codepen.io', 'vercel.app', 'netlify.app', 'gitlab.com', 'replit.com', 'drive.google.com'],
      'Security': ['github.com', 'gitlab.com', 'drive.google.com'],
      'Testing': ['github.com', 'gitlab.com', 'drive.google.com'],
      'Design': ['figma.com', 'invisionapp.com', 'dribbble.com', 'behance.net', 'canva.com', 'drive.google.com'],
      'Research': ['docs.google.com', 'notion.so', 'drive.google.com', 'medium.com', 'figma.com'],
      'Data': ['github.com', 'kaggle.com', 'colab.research.google.com', 'drive.google.com', 'tableau.com'],
      'Analysis': ['github.com', 'kaggle.com', 'colab.research.google.com', 'drive.google.com', 'docs.google.com', 'notion.so'],
      'Visualization': ['tableau.com', 'github.com', 'kaggle.com', 'docs.google.com', 'drive.google.com'],
      'Communication': ['docs.google.com', 'notion.so', 'drive.google.com', 'medium.com', 'linkedin.com'],
      'API Design': ['swagger.io', 'postman.com', 'github.com', 'gitlab.com', 'drive.google.com', 'docs.google.com'],
      'Debugging': ['github.com', 'gitlab.com', 'codesandbox.io', 'stackblitz.com', 'replit.com', 'drive.google.com'],
    };

    const domainsFromTask = getTaskDomainsFromSimData(simId, numericTaskNum);
    const allowed = domainsFromTask.length > 0
      ? domainsFromTask
      : normalizeDomainList(EXPECTED_DOMAINS[taskType] || []);

    if (allowed.length > 0) {
      const isAllowed = allowed.some(d => host === d || host.endsWith('.' + d));
      if (!isAllowed) {
        return res.status(400).json({
          valid: false,
          message: `For a ${taskType} task, we expect a link from recognized platforms like ${allowed.slice(0, 3).join(', ')}.`,
        });
      }
    }

    // Attempt a lightweight ping (best effort only)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const fetchOpts = { 
        method: 'HEAD', 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: controller.signal 
      };

      const response = await fetch(url, fetchOpts); 
      clearTimeout(timeoutId);

      if (!response.ok && response.status !== 403 && response.status !== 405) {
        // Fallback to GET if HEAD was blocked by server
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 4000);
        const getFallback = await fetch(url, { ...fetchOpts, method: 'GET', signal: controller2.signal });
        clearTimeout(timeoutId2);

        if (!getFallback.ok && getFallback.status !== 403 && getFallback.status !== 405) {
          // Keep this non-blocking; some valid platforms throttle probe requests.
          console.warn('[Events] Link probe failed but accepted by domain rules:', url, getFallback.status);
        }
      }
    } catch (fetchErr) {
      // Non-blocking fallback: domain check already passed.
      console.warn('[Events] Link probe skipped due to network/platform restrictions:', url, fetchErr?.message);
    }

    // Save to Progress DB (legacy — keeps existing task-completion logic intact)
    await SimulationProgress.findOneAndUpdate(
      { user: req.user.id, simulationId: simId },
      { $addToSet: { completedTasks: numericTaskNum } },
      { upsert: true, new: true }
    );

    // Persist the submission record so it can be shown in the user's portfolio.
    // Upsert on (userId, simId, taskNum) — resubmitting just updates the row,
    // never creates a duplicate. URL is already validated above so it is safe to store.
    await SimulationSubmission.findOneAndUpdate(
      { userId: req.user.id, simId, taskNum: numericTaskNum },
      {
        $set: {
          taskType,
          url: parsedUrl.href, // normalized, validated URL
          status: 'completed',
          submittedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Passed
    res.json({ valid: true, message: 'Submission correctly formatted and verified.' });
  } catch (err) {
    console.error('[Events] Task validation error:', err);
    res.status(500).json({ valid: false, message: 'Server error during validation.' });
  }
});

// ─── Get My Submissions for a Simulation ──────────────────────────────────────
// Returns all task submissions for the authenticated user for one simulation.
// The frontend uses this to hydrate task status from the DB on load.
router.get('/simulations/submissions/:simId', authOptions, async (req, res) => {
  try {
    const submissions = await SimulationSubmission.find({
      userId: req.user.id,
      simId: req.params.simId,
    })
      .select('taskNum taskType url status feedback submittedAt reviewedAt')
      .sort({ taskNum: 1 })
      .lean();
    res.setHeader('Cache-Control', 'no-store');
    res.json(submissions);
  } catch (err) {
    console.error('[Events] Fetch submissions error:', err);
    res.status(500).json({ message: 'Server error fetching submissions.' });
  }
});

// ─── Get All My Simulation Submissions (for portfolio) ────────────────────────
// Returns all task submissions across ALL simulations for the authenticated user
// in a single query — the profile/dashboard aggregates this without looping.
router.get('/simulations/submissions', authOptions, async (req, res) => {
  try {
    const submissions = await SimulationSubmission.find({ userId: req.user.id })
      .select('simId taskNum taskType url status submittedAt')
      .sort({ simId: 1, taskNum: 1 })
      .lean();
    res.setHeader('Cache-Control', 'no-store');
    res.json(submissions);
  } catch (err) {
    console.error('[Events] Fetch all submissions error:', err);
    res.status(500).json({ message: 'Server error fetching submissions.' });
  }
});

// ─── Get Simulation Progress ──────────────────────────────────────────────────
router.get('/simulations/progress/:simId', authOptions, async (req, res) => {
  try {
    const progress = await SimulationProgress.findOne({ 
      user: req.user.id, 
      simulationId: req.params.simId 
    }).lean();
    res.json(progress || { simulationId: req.params.simId, completedTasks: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching progress.' });
  }
});

// ─── ADMIN: List all simulations with live stats ──────────────────────────────
// GET /api/events/admin/simulations
// Returns each simulation from the JSON file enriched with DB-backed stats:
//   completionCount (users who completed ≥ 1 task), certCount, submissionCount
router.get('/admin/simulations', authOptions, adminCheck, async (req, res) => {
  try {
    const raw = fs.readFileSync(SIM_JSON_PATH, 'utf-8');
    const simulations = JSON.parse(raw);

    // Aggregate per-sim stats from DB in one batch each to keep it lightweight.
    const [progressStats, certStats, submissionStats] = await Promise.all([
      SimulationProgress.aggregate([
        { $group: { _id: '$simulationId', completionCount: { $sum: 1 } } }
      ]),
      EventCertificate.aggregate([
        { $match: { eventType: 'job-simulation' } },
        { $group: { _id: '$eventTitle', certCount: { $sum: 1 } } }
      ]),
      SimulationSubmission.aggregate([
        { $group: { _id: '$simId', submissionCount: { $sum: 1 }, uniqueUsers: { $addToSet: '$userId' } } }
      ])
    ]);

    const progressMap = Object.fromEntries(progressStats.map(s => [s._id, s.completionCount]));
    const certMap = Object.fromEntries(certStats.map(s => [s._id, s.certCount]));
    const submissionMap = Object.fromEntries(submissionStats.map(s => [
      s._id, { submissionCount: s.submissionCount, uniqueUsers: s.uniqueUsers?.length || 0 }
    ]));

    // Fetch all DB prices in one query and build a lookup map by simId
    const dbPrices = await SimulationPrice.find({ isActive: true }).lean();
    const dbPriceMap = Object.fromEntries(dbPrices.map(p => [p.simId, p.certCostInr]));

    const enriched = simulations.map(sim => ({
      id: sim.id,
      title: sim.title,
      role: sim.role,
      level: sim.level,
      duration: sim.duration,
      // DB price overrides JSON certCost so the admin always sees the live value
      certCost: dbPriceMap[sim.id] ?? sim.certCost ?? DEFAULT_SIM_CERT_COST,
      certCostSource: sim.id in dbPriceMap ? 'db' : 'json',
      comingSoon: sim.comingSoon || false,
      color: sim.color,
      taskCount: Array.isArray(sim.tasks) ? sim.tasks.length : 0,
      skills: sim.skills || [],
      // Live DB stats:
      completionCount: progressMap[sim.id] || 0,
      certCount: certMap[sim.title] || 0,
      submissionCount: submissionMap[sim.id]?.submissionCount || 0,
      uniqueActiveUsers: submissionMap[sim.id]?.uniqueUsers || 0,
    }));

    res.json(enriched);
  } catch (err) {
    console.error('[Admin Simulations] List error:', err);
    res.status(500).json({ message: 'Failed to load simulation list.' });
  }
});

// ─── ADMIN: Update certCost price for a simulation ────────────────────────────
// PUT /api/events/admin/simulations/:simId/price
// Body: { certCost: number }   — price in INR (positive integer)
// Persists the price to MongoDB (SimulationPrice collection).
// The JSON file is intentionally NOT mutated: production (Vercel) has a
// read-only filesystem, so file writes would silently fail or throw EROFS.
router.put('/admin/simulations/:simId/price', authOptions, adminCheck, async (req, res) => {
  try {
    const { simId } = req.params;
    const { certCost } = req.body;

    const parsed = Number(certCost);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 100000) {
      return res.status(400).json({ message: 'certCost must be a number between 1 and 100000.' });
    }
    const roundedCost = Math.round(parsed);

    // Verify the simulation exists in the JSON catalogue
    let simTitle = simId;
    try {
      const raw = fs.readFileSync(SIM_JSON_PATH, 'utf-8');
      const simulations = JSON.parse(raw);
      const found = simulations.find(s => s.id === simId || s.slug === simId);
      if (!found) return res.status(404).json({ message: `Simulation "${simId}" not found.` });
      simTitle = found.title || simId;
    } catch (readErr) {
      // If the JSON can't be read (shouldn't happen locally; can happen on edge cases),
      // proceed with the DB write using simId as title rather than blocking the admin.
      console.warn('[Admin Simulations] Could not read JSON for title lookup:', readErr.message);
    }

    // Upsert into MongoDB — this works on all environments including Vercel.
    const doc = await SimulationPrice.findOneAndUpdate(
      { simId },
      {
        simId,
        simTitle,
        certCostInr: roundedCost,
        isActive: true,
        updatedBy: req.user.id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      message: `Certificate price for "${simTitle}" updated to ₹${roundedCost}.`,
      simId,
      certCost: roundedCost,
      source: 'db',
    });
  } catch (err) {
    console.error('[Admin Simulations] Price update error:', err);
    res.status(500).json({ message: 'Failed to update simulation price.' });
  }
});

// ─── ADMIN: Toggle comingSoon flag for a simulation ───────────────────────────
// PATCH /api/events/admin/simulations/:simId/toggle-visibility
// Flips the comingSoon boolean in the JSON file.
router.patch('/admin/simulations/:simId/toggle-visibility', authOptions, adminCheck, async (req, res) => {
  try {
    const { simId } = req.params;

    const raw = fs.readFileSync(SIM_JSON_PATH, 'utf-8');
    const simulations = JSON.parse(raw);

    const idx = simulations.findIndex(s => s.id === simId || s.slug === simId);
    if (idx === -1) return res.status(404).json({ message: `Simulation "${simId}" not found.` });

    simulations[idx].comingSoon = !simulations[idx].comingSoon;
    const newState = simulations[idx].comingSoon;

    const tmpPath = SIM_JSON_PATH + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(simulations, null, 2), 'utf-8');
    fs.renameSync(tmpPath, SIM_JSON_PATH);

    res.json({
      message: `"${simulations[idx].title}" is now ${newState ? 'hidden (Coming Soon)' : 'live'}.`,
      simId,
      comingSoon: newState,
    });
  } catch (err) {
    console.error('[Admin Simulations] Toggle visibility error:', err);
    res.status(500).json({ message: 'Failed to toggle simulation visibility.' });
  }
});

// ─── ADMIN: Get detailed stats for a single simulation ────────────────────────
// GET /api/events/admin/simulations/:simId/stats
// Returns task-level completion breakdown and recent submissions.
router.get('/admin/simulations/:simId/stats', authOptions, adminCheck, async (req, res) => {
  try {
    const { simId } = req.params;

    const raw = fs.readFileSync(SIM_JSON_PATH, 'utf-8');
    const simulations = JSON.parse(raw);
    const sim = simulations.find(s => s.id === simId || s.slug === simId);
    if (!sim) return res.status(404).json({ message: `Simulation "${simId}" not found.` });

    const [taskBreakdown, recentSubs, totalCerts] = await Promise.all([
      SimulationSubmission.aggregate([
        { $match: { simId } },
        { $group: { _id: '$taskNum', count: { $sum: 1 }, taskType: { $first: '$taskType' } } },
        { $sort: { _id: 1 } }
      ]),
      SimulationSubmission.find({ simId })
        .populate({ path: 'userId', model: 'User', select: 'name email' })
        .select('taskNum taskType url status submittedAt userId')
        .sort({ submittedAt: -1 })
        .limit(20)
        .lean(),
      EventCertificate.countDocuments({ eventType: 'job-simulation', eventTitle: sim.title }),
    ]);

    res.json({
      sim: { id: sim.id, title: sim.title, taskCount: sim.tasks?.length || 0 },
      taskBreakdown,
      recentSubmissions: recentSubs.map(s => ({
        taskNum: s.taskNum,
        taskType: s.taskType,
        url: s.url,
        status: s.status,
        submittedAt: s.submittedAt,
        userName: s.userId?.name || 'Unknown',
        userEmail: s.userId?.email || '',
      })),
      totalCerts,
    });
  } catch (err) {
    console.error('[Admin Simulations] Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch simulation stats.' });
  }
});

// ─── ADMIN: Manage Simulation Coupons ───────────────────────────────────────

router.get('/admin/sim-coupons', authOptions, adminCheck, async (req, res) => {
  try {
    const coupons = await SimulationCoupon.find().sort({ createdAt: -1 }).lean();
    res.json(coupons);
  } catch (err) {
    console.error('[Admin SimCoupons] List error:', err);
    res.status(500).json({ message: 'Failed to fetch sim coupons.' });
  }
});

router.post('/admin/sim-coupons', authOptions, adminCheck, async (req, res) => {
  try {
    const {
      code, discountType = 'percentage', discountValue, simIds = [],
      maxUsageLimit, validFrom, validUntil, description = ''
    } = req.body;

    if (!code || typeof code !== 'string') return res.status(400).json({ message: 'A valid coupon code is required.' });
    const cleanCode = code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(cleanCode) || cleanCode.length < 3 || cleanCode.length > 30) {
      return res.status(400).json({ message: 'Code must be 3-30 characters: A-Z, 0-9, _ or -.' });
    }
    if (!['percentage', 'flat'].includes(discountType)) return res.status(400).json({ message: 'discountType must be "percentage" or "flat".' });
    
    const dv = Number(discountValue);
    if (isNaN(dv) || dv <= 0) return res.status(400).json({ message: 'discountValue must be a positive number.' });
    if (discountType === 'percentage' && dv > 100) return res.status(400).json({ message: 'Percentage discount cannot exceed 100.' });

    const existing = await SimulationCoupon.findOne({ code: cleanCode });
    if (existing) return res.status(409).json({ message: `Coupon code "${cleanCode}" already exists.` });

    const coupon = new SimulationCoupon({
      code: cleanCode,
      discountType,
      discountValue: dv,
      simIds: Array.isArray(simIds) ? simIds.map(String).filter(Boolean) : [],
      maxUsageLimit: maxUsageLimit ? Number(maxUsageLimit) : null,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      description: String(description).slice(0, 200),
      createdBy: req.user.id,
      isActive: true,
    });

    await coupon.save();
    res.status(201).json({ message: 'Simulation Coupon created.', coupon });
  } catch (err) {
    console.error('[Admin SimCoupons] Create error:', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Coupon code already exists.' });
    res.status(500).json({ message: 'Failed to create sim coupon.' });
  }
});

router.patch('/admin/sim-coupons/:id/toggle', authOptions, adminCheck, async (req, res) => {
  try {
    const coupon = await SimulationCoupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}.`, coupon });
  } catch (err) {
    console.error('[Admin SimCoupons] Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle sim coupon.' });
  }
});

router.delete('/admin/sim-coupons/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const coupon = await SimulationCoupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
    res.json({ message: 'Simulation Coupon deleted successfully.' });
  } catch (err) {
    console.error('[Admin SimCoupons] Delete error:', err);
    res.status(500).json({ message: 'Failed to delete sim coupon.' });
  }
});

router.patch('/admin/sim-coupons/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const coupon = await SimulationCoupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });

    const {
      discountType, discountValue, simIds, maxUsageLimit,
      validFrom, validUntil, description, isActive,
    } = req.body;

    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (simIds !== undefined) coupon.simIds = Array.isArray(simIds) ? simIds.map(String).filter(Boolean) : [];
    if (maxUsageLimit !== undefined) coupon.maxUsageLimit = maxUsageLimit ? Number(maxUsageLimit) : null;
    if (validFrom !== undefined) coupon.validFrom = validFrom ? new Date(validFrom) : null;
    if (validUntil !== undefined) coupon.validUntil = validUntil ? new Date(validUntil) : null;
    if (description !== undefined) coupon.description = String(description).slice(0, 200);
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);

    await coupon.save();
    res.json({ message: 'Simulation Coupon updated.', coupon });
  } catch (err) {
    console.error('[Admin SimCoupons] Edit error:', err);
    res.status(500).json({ message: 'Failed to update sim coupon.' });
  }
});

export default router;
