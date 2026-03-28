import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import Hackathon from '../models/Hackathon.js';
import EventCertificate from '../models/EventCertificate.js';
import SimulationProgress from '../models/SimulationProgress.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';

const router = express.Router();
const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'https://www.skillvalix.com').replace(/\/$/, '');

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

// ─── PDF Builder: Event Certificate (different design) ───────────────────────
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

      const W = doc.page.width, H = doc.page.height;
      const CX = W / 2;

      // ── Colors & Branding ──────────────────────────────────────────────
      const PRIMARY = '#4F46E5'; 
      const BG_LIGHT = '#F8FAFC';
      const TEXT_DARK = '#0F172A';
      const TEXT_MUTED = '#64748B';
      const ACCENT_BLUE = '#3B82F6';

      // ── 1. Background & Header ──────────────────────────────────────────
      doc.rect(0, 0, W, H).fill(BG_LIGHT);

      // Top Gradient Header
      const headerGrad = doc.linearGradient(0, 0, W, 0);
      headerGrad.stop(0, '#4338CA'); 
      headerGrad.stop(1, '#6D28D9');
      doc.rect(0, 0, W, 140).fill(headerGrad);

      doc.fontSize(32).font('Helvetica-Bold').fillColor('#FFFFFF').text('SkillValix', 48, 48, { lineBreak: false });
      doc.fontSize(12).font('Helvetica').fillColor('#E2E8F0').text('Verified Certificate of Completion', 48, 88, { lineBreak: false });

      // ── 2. Border & Frame ───────────────────────────────────────────────
      doc.rect(20, 20, W - 40, H - 40).lineWidth(1).strokeColor('#E2E8F0').stroke();

      // ── 3. Main Certificate Text ────────────────────────────────────────
      doc.fontSize(14).font('Helvetica-Bold').fillColor(TEXT_DARK)
        .text('CERTIFICATE OF COMPLETION', 0, 185, { width: W, align: 'center', characterSpacing: 4 });

      doc.fontSize(12).font('Helvetica').fillColor(TEXT_MUTED)
        .text('This is proudly presented to', 0, 240, { width: W, align: 'center' });

      // Student Name
      let nameSize = 44;
      const upperName = String(studentName || 'Learner').toUpperCase();
      doc.font('Helvetica-Bold');
      while (nameSize > 20 && doc.fontSize(nameSize).widthOfString(upperName) > 520) nameSize -= 2;
      doc.fontSize(nameSize).fillColor(TEXT_DARK).text(upperName, 0, 275, { width: W, align: 'center' });

      // Divider Line
      doc.moveTo(CX - 160, 275 + nameSize + 12).lineTo(CX + 160, 275 + nameSize + 12).lineWidth(1.5).strokeColor(ACCENT_BLUE).stroke();

      // Course Info
      doc.fontSize(12).font('Helvetica').fillColor(TEXT_MUTED)
        .text('for successfully completing the job simulation', 0, 370, { width: W, align: 'center' });

      doc.fontSize(22).font('Helvetica-Bold').fillColor(ACCENT_BLUE)
        .text(eventTitle, 60, 405, { width: W - 120, align: 'center' });

      doc.fontSize(9.5).font('Helvetica').fillColor(TEXT_MUTED)
        .text('This certificate is issued as a verifiable record of professional skill demonstration on SkillValix.', 0, 465, { width: W, align: 'center' });

      // ── 4. QR Code Container (Right) ────────────────────────────────────
      const QR_SIZE = 100;
      const QR_X = W - QR_SIZE - 76;
      const QR_Y = 230;

      doc.roundedRect(QR_X - 12, QR_Y - 12, QR_SIZE + 24, QR_SIZE + 50, 12).fill('#FFFFFF');
      doc.roundedRect(QR_X - 12, QR_Y - 12, QR_SIZE + 24, QR_SIZE + 50, 12).lineWidth(1).strokeColor('#F1F5F9').stroke();
      doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });
      doc.fontSize(8).font('Helvetica-Bold').fillColor(TEXT_MUTED).text('SCAN TO VERIFY', QR_X, QR_Y + QR_SIZE + 18, { width: QR_SIZE, align: 'center' });

      // ── 5. Information Boxes (Bottom) ───────────────────────────────────
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
      drawBox(W - BOX_W - 48, 'ISSUED BY', 'SkillValix');

      // ── 6. Bottom Legal Line ────────────────────────────────────────────
      doc.fontSize(8).font('Helvetica').fillColor('#94A3B8')
        .text('Issued by SkillValix · skillvalix.com', 48, H - 30);

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
        const allCompleted = matchedSim.tasks.every(t => progress?.completedTasks?.includes(t.num));
        if (!allCompleted && user.role !== 'admin') {
          return res.status(400).json({ message: 'You must complete and get all tasks accepted before paying for a certificate.' });
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
      paymentId: razorpay_payment_id 
    });
    await cert.save();

    // Generate PDF immediately
    const issueDate = new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `${FRONTEND_URL()}/verify-event/${cert.certificateId}`;

    try {
      const pdfBuffer = await buildEventCertificatePdf({
        studentName: user.name, eventTitle: cert.eventTitle, role: cert.role,
        certificateId: cert.certificateId, issueDate, eventType: cert.eventType, verifyUrl,
      });
      await EventCertificate.updateOne({ _id: cert._id }, {
        $set: { pdfStatus: 'ready', pdfBuffer, pdfSizeBytes: pdfBuffer.length, pdfGeneratedAt: new Date(), pdfError: '' }
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

    if (cert.pdfStatus === 'ready') {
      const rawBuf = cert.pdfBuffer?.buffer || cert.pdfBuffer;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=EventCertificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(rawBuf);
    }

    // Regenerate on the fly
    const issueDate = new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `${FRONTEND_URL()}/verify-event/${cert.certificateId}`;
    const pdfBuffer = await buildEventCertificatePdf({
      studentName: cert.student?.name, eventTitle: cert.eventTitle, role: cert.role,
      certificateId: cert.certificateId, issueDate, eventType: cert.eventType, verifyUrl,
    });
    await EventCertificate.updateOne({ _id: cert._id }, {
      $set: { pdfStatus: 'ready', pdfBuffer, pdfSizeBytes: pdfBuffer.length, pdfGeneratedAt: new Date(), pdfError: '' }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=EventCertificate-${cert.certificateId}.pdf`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
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
    };

    const allowed = EXPECTED_DOMAINS[taskType] || [];
    if (allowed.length > 0) {
      const isAllowed = allowed.some(d => host === d || host.endsWith('.' + d));
      if (!isAllowed) {
        return res.status(400).json({
          valid: false,
          message: `For a ${taskType} task, we expect a link from recognized platforms like ${allowed.slice(0, 3).join(', ')}.`,
        });
      }
    }

    // Attempt a lightweight ping
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
           return res.status(400).json({ valid: false, message: 'Link returned an error. Ensure the repository or file is public.' });
        }
      }
    } catch (fetchErr) {
       return res.status(400).json({ valid: false, message: 'Could not access the link. Please check if the URL is correct and public.' });
    }

    // Save to Progress DB
    await SimulationProgress.findOneAndUpdate(
      { user: req.user.id, simulationId: simId },
      { $addToSet: { completedTasks: taskNum } },
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
