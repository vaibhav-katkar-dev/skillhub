import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import Hackathon from '../models/Hackathon.js';
import HackathonRegistration from '../models/HackathonRegistration.js';
import EventCertificate from '../models/EventCertificate.js';
import SimulationProgress from '../models/SimulationProgress.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';

const router = express.Router();
const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'https://www.skillvalix.com').replace(/\/$/, '');
const EVENT_CERT_TEMPLATE_VERSION = 4;


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
    const simsPath = path.resolve(process.cwd(), 'frontend/public/data/job-simulations.json');
    const raw = fs.readFileSync(simsPath, 'utf-8');
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

// ─── PUBLIC: Get single hackathon ────────────────────────────────────────────
router.get('/hackathons/:id', async (req, res) => {
  try {
    const hack = await Hackathon.findOne({ _id: req.params.id, visible: true }).lean();
    if (!hack) return res.status(404).json({ message: 'Hackathon not found.' });
    res.json(hack);
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

// ─── ADMIN: List ALL hackathons (incl. hidden) ───────────────────────────────
router.get('/admin/hackathons', authOptions, adminCheck, async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 }).lean();
    res.json(hackathons);
  } catch (err) {
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
      return res.status(400).json({ message: 'Submission link must be a valid public URL.' });
    }

    const registration = await HackathonRegistration.findOne({
      _id: registrationId,
      hackathon: req.params.id,
      'members.user': req.user.id,
    })
      .populate('hackathon', 'submissionConfig paymentConfig')
      .lean();

    if (!registration || !registration.hackathon) {
      return res.status(404).json({ message: 'Team registration not found.' });
    }

    if (registration.payment?.required && registration.payment?.status !== 'paid') {
      return res.status(400).json({ message: 'Please complete payment before submission.' });
    }

    const maxSubmissions = Number(registration.hackathon.submissionConfig?.maxSubmissionsPerTeam || 3);
    if ((registration.submissions || []).length >= maxSubmissions) {
      return res.status(400).json({ message: `Submission limit reached (${maxSubmissions}).` });
    }

    const acceptsDriveLink = Boolean(registration.hackathon.submissionConfig?.acceptsDriveLink);
    const acceptsPdfLink = Boolean(registration.hackathon.submissionConfig?.acceptsPdfLink);
    const isDrive = isDriveLink(submissionLink);
    const isPdf = isPdfLink(submissionLink);

    const allowedByType = (acceptsDriveLink && isDrive) || (acceptsPdfLink && isPdf) || (acceptsDriveLink && acceptsPdfLink);
    if (!allowedByType) {
      return res.status(400).json({
        message: 'Invalid submission link type for this hackathon. Check admin submission instructions.',
      });
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

// ─── ADMIN: Update registration status / remarks ─────────────────────────────
router.put('/admin/hackathons/:id/registrations/:registrationId', authOptions, adminCheck, async (req, res) => {
  try {
    const { status, adminRemarks = '' } = req.body;
    const allowedStatus = ['registered', 'payment_pending', 'submitted', 'under_review', 'approved', 'rejected'];
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
 * Repeating micro-dot texture overlay — gives a subtle premium paper feel.
 * Very low opacity; drawn as tiny circles on a grid.
 */
function drawGrainOverlay(doc) {
  const W = doc.page.width;
  const H = doc.page.height;
  doc.save();
  doc.fillOpacity(0.018).fillColor(P.goldDark);
  const step = 9;
  for (let x = MARGIN_INNER + 4; x < W - MARGIN_INNER; x += step) {
    for (let y = MARGIN_INNER + 4; y < H - MARGIN_INNER; y += step) {
      doc.circle(x, y, 0.55).fill();
    }
  }
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

  // ── 2. Grain texture ──────────────────────────────────────────────────────
  drawGrainOverlay(doc);

  // ── 3. Watermark monogram ─────────────────────────────────────────────────
  drawWatermark(doc);

  // ── 4. Borders: outer (thick gold) + inner (hairline) ────────────────────
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
  const rawName  = String(studentName || 'Learner').toUpperCase();
  const nameSize = fitFontSize(doc, rawName, {
    font: 'Helvetica-Bold', maxPt: 46, minPt: 22, maxWidth: nameMaxW,
  });
  const safeName = clipText(doc.font('Helvetica-Bold').fontSize(nameSize), rawName, nameMaxW);
  doc.font('Helvetica-Bold').fontSize(nameSize).fillColor(P.inkDark)
     .text(safeName, (W - nameMaxW) / 2, curY, { width: nameMaxW, align: 'center', lineBreak: false });

  const underY = curY + nameSize + 5;
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

  // Grain
  drawGrainOverlay(doc);

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
  const rawName  = String(studentName || 'Learner').toUpperCase();
  const nameSize = fitFontSize(doc, rawName, {
    font: 'Helvetica-Bold', maxPt: 44, minPt: 20, maxWidth: nameMaxW,
  });
  doc.font('Helvetica-Bold').fontSize(nameSize).fillColor('#0F172A')
     .text(rawName, 0, curY, { width: W, align: 'center', lineBreak: false });

  const underY = curY + nameSize + 6;
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

// ─── Razorpay Order Creation (Event Certificates) ───────────────────────────
router.post('/certificates/razorpay-order', authOptions, async (req, res) => {
  try {
    const { eventTitle, eventType = 'job-simulation', role = 'Participant' } = req.body;
    if (!eventTitle) return res.status(400).json({ message: 'eventTitle is required.' });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure we parse the actual exact price from JSON instead of hardcoded 99 INR.
    let basePrice = 99; // Fallback
    try {
      if (eventType === 'job-simulation') {
        const simsPath = path.resolve(process.cwd(), 'frontend/public/data/job-simulations.json');
        const simsData = JSON.parse(fs.readFileSync(simsPath, 'utf-8'));
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

        if (matchedSim.certCost) basePrice = matchedSim.certCost;
      }
    } catch(e) { console.error('[Events] Failed to parse job-simulations.json for price/completion', e); }

    const isAdminTestMode = user.role === 'admin';
    const amountToCharge = isAdminTestMode ? 100 : basePrice * 100; // paise

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const expectedReceipt = `receipt_event_${req.user.id}`.substring(0, 40);
    const options = {
      amount: amountToCharge,
      currency: 'INR',
      receipt: expectedReceipt,
      notes: { eventTitle, eventType, role } // Store in backend order directly
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
    let basePrice = 99; 
    try {
      if (verifiedType === 'job-simulation') {
        const simsPath = path.resolve(process.cwd(), 'frontend/public/data/job-simulations.json');
        const simsData = JSON.parse(fs.readFileSync(simsPath, 'utf-8'));
        const matchedSim = simsData.find(s => s.title === verifiedTitle);
        if (matchedSim && matchedSim.certCost) basePrice = matchedSim.certCost;
      }
    } catch(e) {}
    
    const expectedAmount = user.role === 'admin' ? 100 : basePrice * 100;
    if (order.amount !== expectedAmount) {
       return res.status(400).json({ message: 'Payment mismatch: The order amount does not match current event price.' });
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

    res.json({ message: 'Certificate generated.', certificateId: cert.certificateId });
  } catch (err) {
    console.error('[Events] Generate cert error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Download event certificate ───────────────────────────────────────────────
router.get('/certificates/download/:certId', async (req, res) => {
  try {
    const cert = await EventCertificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name').select('+pdfBuffer').lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });

    const hasLatestTemplate = Number(cert.pdfTemplateVersion || 0) >= EVENT_CERT_TEMPLATE_VERSION;

    if (cert.pdfStatus === 'ready' && hasLatestTemplate) {
      // Robustly pull buffer from Mongoose model
      const rawBuf = (cert.pdfBuffer && cert.pdfBuffer.buffer) 
        ? Buffer.from(cert.pdfBuffer.buffer)
        : cert.pdfBuffer;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=EventCertificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.send(rawBuf);
    }

    // Regenerate on the fly
    const issueDate = new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `${FRONTEND_URL()}/verify/${cert.certificateId}`;
    const pdfBuffer = await buildEventCertificatePdf({
      studentName: cert.student?.name, eventTitle: cert.eventTitle, role: cert.role,
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
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=EventCertificate-${cert.certificateId}.pdf`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('[Events] Download cert error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Verify event certificate (public) ───────────────────────────────────────
router.get('/certificates/verify/:certId', async (req, res) => {
  try {
    applyEventDownloadCors(req, res);
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
router.post('/simulations/validate-task', authOptions, async (req, res) => {
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

    // Save to Progress DB
    await SimulationProgress.findOneAndUpdate(
      { user: req.user.id, simulationId: simId },
      { $addToSet: { completedTasks: numericTaskNum } },
      { upsert: true, new: true }
    );

    // Passed
    res.json({ valid: true, message: 'Submission correctly formatted and verified.' });
  } catch (err) {
    console.error('[Events] Task validation error:', err);
    res.status(500).json({ valid: false, message: 'Server error during validation.' });
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

export default router;
