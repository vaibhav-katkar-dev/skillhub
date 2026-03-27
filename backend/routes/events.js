import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import Hackathon from '../models/Hackathon.js';
import EventCertificate from '../models/EventCertificate.js';
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
        errorCorrectionLevel: 'H', width: 180, margin: 1,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      });

      const W = doc.page.width, H = doc.page.height;

      // ── Background ──────────────────────────────────────────────────────
      doc.rect(0, 0, W, H).fill('#0F172A');          // Dark navy

      // Gradient top band
      const topGrad = doc.linearGradient(0, 0, W, 0);
      topGrad.stop(0, '#4F46E5'); topGrad.stop(0.5, '#7C3AED'); topGrad.stop(1, '#4F46E5');
      doc.rect(0, 0, W, 8).fill(topGrad);

      // Bottom accent line
      const botGrad = doc.linearGradient(0, 0, W, 0);
      botGrad.stop(0, '#10B981'); botGrad.stop(0.5, '#3B82F6'); botGrad.stop(1, '#10B981');
      doc.rect(0, H - 8, W, 8).fill(botGrad);

      // Subtle grid pattern
      doc.save();
      doc.rect(0, 0, W, H).clip();
      for (let x = 0; x < W; x += 48) {
        doc.moveTo(x, 0).lineTo(x, H).lineWidth(0.3).strokeColor('#1E293B').stroke();
      }
      for (let y = 0; y < H; y += 48) {
        doc.moveTo(0, y).lineTo(W, y).lineWidth(0.3).strokeColor('#1E293B').stroke();
      }
      doc.restore();

      // Glowing circle accent (top-right)
      doc.circle(W - 80, 80, 160).fillOpacity(0.04).fill('#7C3AED'); doc.fillOpacity(1);
      doc.circle(W - 80, 80, 100).fillOpacity(0.06).fill('#4F46E5'); doc.fillOpacity(1);

      // ── Border frame ────────────────────────────────────────────────────
      doc.roundedRect(16, 16, W - 32, H - 32, 8).lineWidth(1).strokeColor('#1E3A8A').stroke();
      doc.roundedRect(20, 20, W - 40, H - 40, 6).lineWidth(0.5).strokeColor('#334155').stroke();

      // ── Event type badge (top-left) ─────────────────────────────────────
      const badgeLabel = eventType === 'job-simulation' ? 'JOB SIMULATION' : eventType === 'hackathon' ? 'HACKATHON' : 'INTERNSHIP';
      const badgeColor = eventType === 'job-simulation' ? '#10B981' : eventType === 'hackathon' ? '#F59E0B' : '#3B82F6';
      doc.roundedRect(40, 36, 160, 26, 13).fill(badgeColor);
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF').text(badgeLabel, 40, 43, { width: 160, align: 'center', characterSpacing: 2, lineBreak: false });

      // ── SkillValix wordmark ─────────────────────────────────────────────
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#94A3B8').text('Skill', W - 185, 36, { lineBreak: false, continued: true, characterSpacing: -0.3 }).fillColor('#4F46E5').text('Valix', { lineBreak: false });
      doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text('LEARN · VALIDATE · GROW', W - 185, 52, { width: 160, align: 'right', characterSpacing: 1, lineBreak: false });

      // ── Main content area ────────────────────────────────────────────────
      const CX = W / 2;   // center X
      const MAIN_TOP = 95;

      // "CERTIFICATE OF" label
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#64748B')
        .text('CERTIFICATE OF', CX - 200, MAIN_TOP, { width: 400, align: 'center', characterSpacing: 4, lineBreak: false });

      // Event type large heading
      const headLabel = eventType === 'job-simulation' ? 'COMPLETION' : eventType === 'hackathon' ? 'PARTICIPATION' : 'COMPLETION';
      doc.fontSize(42).font('Helvetica-Bold').fillColor('#F8FAFC')
        .text(headLabel, CX - 200, MAIN_TOP + 14, { width: 400, align: 'center', lineBreak: false });

      // Decorative divider
      const divY = MAIN_TOP + 68;
      const gradDiv = doc.linearGradient(CX - 180, divY, CX + 180, divY);
      gradDiv.stop(0, '#0F172A'); gradDiv.stop(0.3, badgeColor); gradDiv.stop(0.7, '#4F46E5'); gradDiv.stop(1, '#0F172A');
      doc.moveTo(CX - 180, divY).lineTo(CX + 180, divY).lineWidth(2).strokeColor(badgeColor).stroke();

      // "Awarded to"
      doc.fontSize(12).font('Helvetica').fillColor('#94A3B8')
        .text('Proudly awarded to', CX - 200, divY + 18, { width: 400, align: 'center', lineBreak: false });

      // Student name
      let namePt = 34;
      doc.font('Helvetica-Bold');
      while (namePt > 18 && doc.fontSize(namePt).widthOfString(String(studentName || '').toUpperCase()) > 420) namePt -= 1;
      doc.fontSize(namePt).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text(String(studentName || 'Learner').toUpperCase(), CX - 210, divY + 42, { width: 420, align: 'center', lineBreak: false });

      // Name underline
      const nameW = Math.min(doc.fontSize(namePt).widthOfString(String(studentName || 'Learner').toUpperCase()), 380);
      const nameLine = divY + 42 + namePt + 6;
      const gradLine = doc.linearGradient(CX - nameW/2, nameLine, CX + nameW/2, nameLine);
      gradLine.stop(0, '#0F172A'); gradLine.stop(0.2, badgeColor); gradLine.stop(0.8, '#4F46E5'); gradLine.stop(1, '#0F172A');
      doc.moveTo(CX - nameW/2, nameLine).lineTo(CX + nameW/2, nameLine).lineWidth(2.5).strokeColor(badgeColor).stroke();

      // Role line
      if (role) {
        doc.fontSize(13).font('Helvetica-Bold').fillColor(badgeColor)
          .text(`as ${role}`, CX - 200, nameLine + 14, { width: 400, align: 'center', lineBreak: false });
      }

      // "for completing" + event title
      const forY = nameLine + (role ? 38 : 18);
      doc.fontSize(12).font('Helvetica').fillColor('#64748B')
        .text('for successfully completing', CX - 220, forY, { width: 440, align: 'center', lineBreak: false });
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#E2E8F0')
        .text(eventTitle, CX - 220, forY + 20, { width: 440, align: 'center', lineBreak: false });

      // ── Bottom row ────────────────────────────────────────────────────────
      const BOT_Y = H - 100;

      // Left: Cert ID
      doc.roundedRect(40, BOT_Y, 200, 56, 6).fill('#1E293B');
      doc.roundedRect(40, BOT_Y, 200, 56, 6).lineWidth(0.5).strokeColor('#334155').stroke();
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#64748B').text('CERTIFICATE ID', 52, BOT_Y + 10, { characterSpacing: 1.5, lineBreak: false });
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#E2E8F0').text(certificateId, 52, BOT_Y + 26, { lineBreak: false });

      // Center: Issued date
      doc.roundedRect(CX - 100, BOT_Y, 200, 56, 6).fill('#1E293B');
      doc.roundedRect(CX - 100, BOT_Y, 200, 56, 6).lineWidth(0.5).strokeColor('#334155').stroke();
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#64748B').text('DATE OF ISSUE', CX - 88, BOT_Y + 10, { characterSpacing: 1.5, lineBreak: false });
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#E2E8F0').text(issueDate, CX - 88, BOT_Y + 26, { lineBreak: false });

      // Right: QR
      const QR_X = W - 130, QR_Y = BOT_Y - 2;
      doc.roundedRect(QR_X - 10, QR_Y - 8, 96, 96, 6).fill('#1E293B');
      doc.roundedRect(QR_X - 10, QR_Y - 8, 96, 96, 6).lineWidth(0.5).strokeColor('#334155').stroke();
      doc.image(qrBuffer, QR_X, QR_Y, { width: 72, height: 72 });
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#64748B').text('SCAN TO VERIFY', QR_X - 8, QR_Y + 76, { width: 92, align: 'center', characterSpacing: 1, lineBreak: false });

      // Issuer line
      doc.fontSize(8).font('Helvetica').fillColor('#334155')
        .text('Issued by SkillValix · MSME Registered', 40, H - 28, { lineBreak: false });
      doc.fontSize(8).font('Helvetica').fillColor('#334155')
        .text('skillvalix.com', W - 140, H - 28, { width: 120, align: 'right', lineBreak: false });

      doc.end();
    } catch (err) {
      doc.destroy();
      reject(err);
    }
  });
}

// ─── Generate event certificate (authenticated) ───────────────────────────────
router.post('/certificates/generate', authOptions, async (req, res) => {
  try {
    const { eventType, eventTitle, role, paymentId } = req.body;
    if (!eventType || !eventTitle) return res.status(400).json({ message: 'eventType and eventTitle are required.' });

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Check for existing cert
    let cert = await EventCertificate.findOne({ student: user._id, eventTitle, eventType });
    if (!cert) {
      const certId = `EVC-${uuidv4().substring(0, 8).toUpperCase()}`;
      cert = new EventCertificate({ student: user._id, eventType, eventTitle, role, certificateId: certId, paymentId });
      await cert.save();
    }

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

export default router;
