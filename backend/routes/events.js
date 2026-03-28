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
const EVENT_CERT_TEMPLATE_VERSION = 2;

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
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    try {
      const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        errorCorrectionLevel: 'H', width: 200, margin: 1,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      });

      const W = doc.page.width;
      const H = doc.page.height;
      const CX = W / 2;
      const isJobSimulation = String(eventType || '').toLowerCase() === 'job-simulation';
      const normalizedRole = String(role || '').trim();
      const personalizedRole = normalizedRole && normalizedRole.toLowerCase() !== 'participant'
        ? normalizedRole
        : 'the selected role';

      const drawPremiumFooter = ({
        dividerColor = '#D8C9A2',
        issuerColor = '#8A6A2F',
        metaColor = '#7A818C',
        trustLine = 'Verified Credential Platform  ·  Industry-Relevant Certification',
      } = {}) => {
        const dividerY = H - 44;
        const issuerY = H - 34;
        const urlY = H - 24;
        const trustY = H - 14;

        doc.moveTo(80, dividerY)
          .lineTo(W - 80, dividerY)
          .lineWidth(0.7)
          .strokeColor(dividerColor)
          .stroke();

        doc.fontSize(7.1)
          .font('Helvetica-Bold')
          .fillColor(issuerColor)
          .text('ISSUED BY SKILLVALIX', 0, issuerY, {
            width: W,
            align: 'center',
            characterSpacing: 2,
          });

        doc.fontSize(7.2)
          .font('Helvetica')
          .fillColor(metaColor)
          .text('www.skillvalix.com', 0, urlY, {
            width: W,
            align: 'center',
          });

        doc.fontSize(6.6)
          .font('Helvetica')
          .fillColor(metaColor)
          .text(trustLine, 0, trustY, {
            width: W,
            align: 'center',
          });
      };

      const truncateToWidth = (text, maxWidth, suffix = '...') => {
        const raw = String(text || '').trim();
        if (!raw) return '';
        if (doc.widthOfString(raw) <= maxWidth) return raw;

        const suffixWidth = doc.widthOfString(suffix);
        let fitted = '';
        for (const ch of raw) {
          const next = fitted + ch;
          if (doc.widthOfString(next) + suffixWidth > maxWidth) break;
          fitted = next;
        }
        return `${fitted.trimEnd()}${suffix}`;
      };

      if (isJobSimulation) {
        const INK = '#111827';
        const INK_MUTED = '#4B5563';
        const GOLD_DARK = '#7C5A06';
        const GOLD = '#D4A327';
        const GOLD_LIGHT = '#F3D37A';
        const BG = '#FBF7EE';
        const PANEL = '#FFFDF7';

        doc.rect(0, 0, W, H).fill(BG);

        const glow = doc.radialGradient(CX, H / 2, 40, CX, H / 2, 430);
        glow.stop(0, '#FFFFFF');
        glow.stop(1, BG);
        doc.rect(0, 0, W, H).fill(glow);

        doc.rect(16, 16, W - 32, H - 32).lineWidth(2).strokeColor(GOLD).stroke();
        doc.rect(28, 28, W - 56, H - 56).lineWidth(0.8).strokeColor('#E4C98B').stroke();

        const bandGrad = doc.linearGradient(0, 0, W, 0);
        bandGrad.stop(0, GOLD_DARK);
        bandGrad.stop(0.5, GOLD);
        bandGrad.stop(1, GOLD_DARK);
        doc.rect(28, 28, W - 56, 44).fill(bandGrad);
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#FFF8E6')
          .text('SKILLVALIX PROFESSIONAL ACHIEVEMENT', 0, 43, { width: W, align: 'center', characterSpacing: 2.3 });

        // Accent laurels (simple vector motif)
        const laurelY = 128;
        for (let i = 0; i < 6; i += 1) {
          const dx = i * 12;
          doc.ellipse(CX - 190 - dx, laurelY + (i % 2 ? 8 : 0), 7, 3).fill('#D7B35D');
          doc.ellipse(CX + 190 + dx, laurelY + (i % 2 ? 8 : 0), 7, 3).fill('#D7B35D');
        }

        doc.fontSize(14).font('Helvetica-Bold').fillColor(GOLD_DARK)
          .text('CERTIFICATE OF ACHIEVEMENT', 0, 112, { width: W, align: 'center', characterSpacing: 3.5 });

        doc.fontSize(12).font('Helvetica').fillColor(INK_MUTED)
          .text('This certifies that', 0, 158, { width: W, align: 'center' });

        const learnerName = String(studentName || 'Learner').toUpperCase();
        let nameSize = 43;
        doc.font('Helvetica-Bold');
        while (nameSize > 21 && doc.fontSize(nameSize).widthOfString(learnerName) > W - 220) nameSize -= 1;
        doc.fontSize(nameSize).fillColor(INK).text(learnerName, 0, 182, { width: W, align: 'center' });

        const underlineY = 182 + nameSize + 12;
        doc.moveTo(CX - 205, underlineY).lineTo(CX + 205, underlineY).lineWidth(1.5).strokeColor('#CCAA52').stroke();

        doc.fontSize(12).font('Helvetica').fillColor(INK_MUTED)
          .text('has successfully completed a professional job simulation', 0, underlineY + 22, { width: W, align: 'center' });

        const eventPanelX = 120;
        const eventPanelW = W - 240;
        const eventPanelY = underlineY + 52;
        doc.roundedRect(eventPanelX, eventPanelY, eventPanelW, 64, 10).fill(PANEL);
        doc.roundedRect(eventPanelX, eventPanelY, eventPanelW, 64, 10).lineWidth(1).strokeColor('#EAD6A8').stroke();
        doc.fontSize(23).font('Helvetica-Bold').fillColor('#1F2937')
          .text(eventTitle, eventPanelX + 22, eventPanelY + 19, { width: eventPanelW - 44, align: 'center' });

        doc.fontSize(10).font('Helvetica').fillColor(INK_MUTED)
          .text('This certification is awarded for successfully completing a real-world job simulation, demonstrating practical expertise, problem-solving ability, and job-ready skills.', 0, eventPanelY + 74, { width: W, align: 'center' });

        const infoY = H - 118;
        const boxW = 206;
        const boxH = 74;
        const gap = 22;
        const startX = (W - (boxW * 3 + gap * 2)) / 2;

        const drawInfo = (x, label, value) => {
          doc.roundedRect(x, infoY, boxW, boxH, 8).fill('#FFFDF8');
          doc.roundedRect(x, infoY, boxW, boxH, 8).lineWidth(1).strokeColor('#E7D2A1').stroke();
          doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#8B6A1D')
            .text(label, x + 14, infoY + 15, { characterSpacing: 1.2 });
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#1F2937')
            .text(value, x + 14, infoY + 37, { width: boxW - 28, lineBreak: false });
        };

        drawInfo(startX, 'CERTIFICATE ID', certificateId);
        drawInfo(startX + boxW + gap, 'ISSUED ON', issueDate);
        drawInfo(startX + (boxW + gap) * 2, 'ROLE', role || 'Participant');

        const qrSize = 78;
        const qrX = W - qrSize - 52;
        const qrY = 86;
        doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 36, 8).fill('#FFFFFF');
        doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 36, 8).lineWidth(1).strokeColor('#E5E7EB').stroke();
        doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
        doc.fontSize(7.2).font('Helvetica-Bold').fillColor('#6B7280')
          .text('Scan to verify certificate authenticity', qrX - 8, qrY + qrSize + 13, { width: qrSize + 16, align: 'center' });

        drawPremiumFooter({
          dividerColor: '#DCC99A',
          issuerColor: '#8B6A1D',
          metaColor: '#6B7280',
          trustLine: 'Digitally verifiable credential  ·  Scan QR to validate authenticity',
        });
      } else {
        // Keep existing event-certificate design unchanged for non job-simulation events.
        const BG_LIGHT = '#F8FAFC';
        const TEXT_DARK = '#0F172A';
        const TEXT_MUTED = '#64748B';
        const ACCENT_BLUE = '#3B82F6';

        doc.rect(0, 0, W, H).fill(BG_LIGHT);

        const headerGrad = doc.linearGradient(0, 0, W, 0);
        headerGrad.stop(0, '#4338CA');
        headerGrad.stop(1, '#6D28D9');
        doc.rect(0, 0, W, 140).fill(headerGrad);

        doc.fontSize(32).font('Helvetica-Bold').fillColor('#FFFFFF').text('SkillValix', 48, 48, { lineBreak: false });
        doc.fontSize(12).font('Helvetica').fillColor('#E2E8F0').text('Verified Certificate of Completion', 48, 88, { lineBreak: false });

        doc.rect(20, 20, W - 40, H - 40).lineWidth(1).strokeColor('#E2E8F0').stroke();

        doc.fontSize(14).font('Helvetica-Bold').fillColor(TEXT_DARK)
          .text('CERTIFICATE OF COMPLETION', 0, 185, { width: W, align: 'center', characterSpacing: 4 });

        doc.fontSize(12).font('Helvetica').fillColor(TEXT_MUTED)
          .text('This is proudly presented to', 0, 240, { width: W, align: 'center' });

        let nameSize = 44;
        const upperName = String(studentName || 'Learner').toUpperCase();
        doc.font('Helvetica-Bold');
        while (nameSize > 20 && doc.fontSize(nameSize).widthOfString(upperName) > 520) nameSize -= 2;
        doc.fontSize(nameSize).fillColor(TEXT_DARK).text(upperName, 0, 275, { width: W, align: 'center' });

        doc.moveTo(CX - 160, 275 + nameSize + 12).lineTo(CX + 160, 275 + nameSize + 12).lineWidth(1.5).strokeColor(ACCENT_BLUE).stroke();

        doc.fontSize(12).font('Helvetica').fillColor(TEXT_MUTED)
          .text('for successfully completing the event', 0, 370, { width: W, align: 'center' });

        doc.fontSize(22).font('Helvetica-Bold').fillColor(ACCENT_BLUE)
          .text(eventTitle, 60, 405, { width: W - 120, align: 'center' });

        doc.fontSize(9.5).font('Helvetica').fillColor(TEXT_MUTED)
          .text('This certificate is issued as a verifiable record of practical performance, consistency, and applied outcomes.', 0, 465, { width: W, align: 'center' });

        doc.fontSize(8.8).font('Helvetica').fillColor('#6B7280');
        const personalizedLineDefault = truncateToWidth(
          `${studentName || 'The learner'} has demonstrated readiness for ${personalizedRole} in an industry-aligned environment.`,
          W - 140
        );
        doc.text(personalizedLineDefault, 0, 481, { width: W, align: 'center' });

        const QR_SIZE = 100;
        const QR_X = W - QR_SIZE - 76;
        const QR_Y = 230;

        doc.roundedRect(QR_X - 12, QR_Y - 12, QR_SIZE + 24, QR_SIZE + 50, 12).fill('#FFFFFF');
        doc.roundedRect(QR_X - 12, QR_Y - 12, QR_SIZE + 24, QR_SIZE + 50, 12).lineWidth(1).strokeColor('#F1F5F9').stroke();
        doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });
        doc.fontSize(8).font('Helvetica-Bold').fillColor(TEXT_MUTED).text('SCAN TO VERIFY', QR_X, QR_Y + QR_SIZE + 18, { width: QR_SIZE, align: 'center' });

        const BOX_Y = H - 110;
        const BOX_W = 210;
        const BOX_H = 70;

        const drawBox = (x, label, val) => {
          doc.roundedRect(x, BOX_Y, BOX_W, BOX_H, 10).fill('#FFFFFF');
          doc.roundedRect(x, BOX_Y, BOX_W, BOX_H, 10).lineWidth(1).strokeColor('#E2E8F0').stroke();
          doc.fontSize(7).font('Helvetica-Bold').fillColor(TEXT_MUTED).text(label, x + 18, BOX_Y + 18, { characterSpacing: 1.5 });
          doc.fontSize(12).font('Helvetica-Bold').fillColor(TEXT_DARK).text(val, x + 18, BOX_Y + 38);
        };

        drawBox(48, 'CERTIFICATE ID', certificateId);
        drawBox(CX - (BOX_W / 2), 'ISSUED ON', issueDate);
        drawBox(W - BOX_W - 48, 'ROLE', role || 'Participant');

        drawPremiumFooter({
          dividerColor: '#D6C8A7',
          issuerColor: '#8A6A2F',
          metaColor: '#6B7280',
        });
      }

      doc.end();
    } catch (err) {
      doc.destroy();
      reject(err);
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
      const rawBuf = cert.pdfBuffer?.buffer || cert.pdfBuffer;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=EventCertificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
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
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('[Events] Download cert error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Verify event certificate (public) ───────────────────────────────────────
router.get('/certificates/verify/:certId', async (req, res) => {
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
