import express from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../middleware/auth.js';
import { getCourseFromJSON, getAllCoursesFromJSON } from '../utils/courseData.js';

const router = express.Router();

async function resolveCourseTitle(courseId) {
  if (!courseId) return null;
  const idStr = courseId.toString();
  const jsonCourse = await getCourseFromJSON(idStr);
  return jsonCourse?.title || null;
}

function fitSingleLineText(doc, value, maxWidth) {
  let text = String(value ?? '');
  if (!text) return '';
  if (doc.widthOfString(text) <= maxWidth) return text;
  const suffix = '...';
  while (text.length > 0 && doc.widthOfString(text + suffix) > maxWidth) {
    text = text.slice(0, -1);
  }
  return text.length ? text + suffix : suffix;
}

// ─── GENERATE ──────────────────────────────────────────────────────────────
router.post('/generate', authOptions, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);
    const jsonCourse = await getCourseFromJSON(courseId);
    if (!jsonCourse) return res.status(404).json({ message: 'Course not found.' });

    let cert = await Certificate.findOne({ student: user._id, course: courseId });
    if (!cert) {
      const certId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;
      cert = new Certificate({ student: user._id, course: courseId, certificateId: certId });
      await cert.save();
    }
    await User.findByIdAndUpdate(user._id, { $addToSet: { completedCourses: courseId } });
    res.json({ message: 'Certificate Generated', certificateId: cert.certificateId });
  } catch (err) {
    console.error('[Certificates] Generation error:', err);
    res.status(500).json({ message: 'Server error generating certificate.' });
  }
});

// ─── MINE ──────────────────────────────────────────────────────────────────
router.get('/mine', authOptions, async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user.id })
      .populate('student', 'name')
      .sort({ issueDate: -1 })
      .lean();

    const allJSONEntries = await getAllCoursesFromJSON();
    const enrichedCerts = certs.map(cert => {
      const courseIdStr = cert.course?.toString();
      const jsonEntry = allJSONEntries.find(e => e.course._id.toString() === courseIdStr);
      return {
        ...cert,
        course: { _id: courseIdStr, title: jsonEntry?.course?.title || 'Unknown Course' }
      };
    });

    const uniqueMap = new Map();
    enrichedCerts.forEach(cert => {
      if (cert.course?._id && !uniqueMap.has(cert.course._id))
        uniqueMap.set(cert.course._id, cert);
    });

    res.setHeader('Cache-Control', 'private, max-age=60');
    res.json(Array.from(uniqueMap.values()));
  } catch (err) {
    console.error('[Certificates] Error fetching user certs:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── DOWNLOAD ──────────────────────────────────────────────────────────────
// ─── DOWNLOAD ──────────────────────────────────────────────────────────────
router.get('/download/:certId', async (req, res) => {
  let doc;
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });

    const courseTitle = await resolveCourseTitle(cert.course);
    if (!cert.student || !courseTitle)
      return res.status(404).json({ message: 'Certificate data incomplete.' });

    // ── QR Code ──────────────────────────────────────────────────────────────
    const verifyUrl = `https://www.skillvalix.com/verify/${cert.certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      errorCorrectionLevel: 'H',
      width: 200,
      margin: 1, // smaller internal margin
      color: { dark: '#0F172A', light: '#FFFFFF' }
    });

    // ── PDF Setup ─────────────────────────────────────────────────────────────
    doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);
    doc.pipe(res);
    doc.on('error', (err) => { console.error('PDF stream error:', err.message); doc.destroy(); });

    const W = doc.page.width;   // 841.89
    const H = doc.page.height;  // 595.28

    // ── PALETTE ───────────────────────────────────────────────────────────────
    const BLUE = '#2563EB';       // Primary Brand Blue
    const BLUE_DARK = '#1D4ED8';
    const WHITE = '#FFFFFF';
    const OFF_WHITE = '#F8FAFC';  // slate-50
    const DARK = '#0F172A';       // slate-900
    const DARK_MID = '#1E293B';   // slate-800
    const GRAY = '#475569';       // slate-600
    const GRAY_MID = '#64748B';   // slate-500
    const GRAY_LT = '#94A3B8';    // slate-400
    const GRAY_XLT = '#E2E8F0';   // slate-200
    const BORDER = '#CBD5E1';     // slate-300
    const BORDER_LT = '#F1F5F9';  // slate-100

    // ── LAYOUT CONSTANTS ──────────────────────────────────────────────────────
    const SIDEBAR_W = 220;          // right blue sidebar width slightly larger
    const SIDEBAR_X = W - SIDEBAR_W;
    const LEFT_PAD = 64;
    const CONTENT_W = SIDEBAR_X - LEFT_PAD - 40; // usable text width in left area

    // ═════════════════════════════════════════════════════════════════════════
    //  1. BACKGROUND
    // ═════════════════════════════════════════════════════════════════════════
    doc.rect(0, 0, W, H).fill(OFF_WHITE);

    // ─── Outer border frame ───────────────────────────────────────────────
    // Thin blue/dark tint outer frame
    doc.rect(6, 6, W - 12, H - 12)
      .lineWidth(2).strokeColor(BLUE).stroke();
    doc.opacity(0.18);
    doc.rect(6, 6, W - 12, H - 12)
      .lineWidth(2).strokeColor(BLUE).stroke();
    doc.opacity(1);

    // Inner subtle border
    doc.rect(12, 12, W - 24, H - 24)
      .lineWidth(0.5).strokeColor(BORDER).stroke();

    // ═════════════════════════════════════════════════════════════════════════
    //  2. RIGHT BLUE SIDEBAR
    // ═════════════════════════════════════════════════════════════════════════
    doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).fill(BLUE);

    // Vertical divider between left content and sidebar
    doc.moveTo(SIDEBAR_X, 0).lineTo(SIDEBAR_X, H)
      .lineWidth(0.5).strokeColor(GRAY_XLT).stroke();

    // ── Sidebar: "COURSE" label ───────────────────────────────────────────
    doc.fontSize(8).font('Helvetica-Bold').fillColor('rgba(255,255,255,0.7)')
      .text('COURSE', SIDEBAR_X, 50, {
        width: SIDEBAR_W,
        align: 'center',
        characterSpacing: 3
      });

    // ── Sidebar: Course title ─────────────────────────────────────────────
    let coursePt = 16;
    doc.font('Helvetica-Bold');
    while (coursePt > 10 && doc.fontSize(coursePt).widthOfString(courseTitle) > SIDEBAR_W - 40) {
      coursePt -= 0.5;
    }
    doc.fontSize(coursePt).font('Helvetica-Bold').fillColor(WHITE)
      .text(courseTitle, SIDEBAR_X + 20, 70, {
        width: SIDEBAR_W - 40,
        align: 'center',
        lineGap: 4
      });

    // ── Sidebar: Verified Badge (centered, middle of page) ────────────────
    const BADGE_CX = SIDEBAR_X + SIDEBAR_W / 2;
    const BADGE_CY = H / 2;
    const OUTER_R = 50;
    const INNER_R = 40;

    // Outer ring
    doc.circle(BADGE_CX, BADGE_CY, OUTER_R)
      .lineWidth(1.5).strokeColor('rgba(255,255,255,0.4)').stroke();

    // Faint fill inside outer ring
    doc.circle(BADGE_CX, BADGE_CY, OUTER_R)
      .fillOpacity(0.1).fill(WHITE);
    doc.fillOpacity(1);

    // White inner circle
    doc.circle(BADGE_CX, BADGE_CY, INNER_R).fill(WHITE);

    // Dark/Blue inner circle for checkmark
    doc.circle(BADGE_CX, BADGE_CY - 8, 18).fill(BLUE);

    // Checkmark
    doc.moveTo(BADGE_CX - 8, BADGE_CY - 8)
      .lineTo(BADGE_CX - 2, BADGE_CY - 2)
      .lineTo(BADGE_CX + 8, BADGE_CY - 16)
      .lineWidth(3).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // "VERIFIED" text inside badge
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(BLUE)
      .text('VERIFIED', BADGE_CX - INNER_R, BADGE_CY + 22, {
        width: INNER_R * 2,
        align: 'center',
        characterSpacing: 1.5
      });

    // ── Sidebar: Issued date ──────────────────────────────────────────────
    const rawDate = cert.issueDate ? new Date(cert.issueDate) : new Date();
    const issueDate = rawDate.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const DATE_Y = H - 100;

    // Thin separator above date
    doc.moveTo(SIDEBAR_X + 30, DATE_Y - 14).lineTo(W - 30, DATE_Y - 14)
      .lineWidth(0.5).strokeColor('rgba(255,255,255,0.25)').stroke();

    doc.fontSize(8).font('Helvetica-Bold').fillColor('rgba(255,255,255,0.7)')
      .text('ISSUED ON', SIDEBAR_X, DATE_Y, {
        width: SIDEBAR_W,
        align: 'center',
        characterSpacing: 2
      });

    doc.fontSize(13).font('Helvetica-Bold').fillColor(WHITE)
      .text(issueDate, SIDEBAR_X, DATE_Y + 16, {
        width: SIDEBAR_W,
        align: 'center'
      });

    // skillvalix.com at very bottom of sidebar
    doc.fontSize(8.5).font('Helvetica').fillColor('rgba(255,255,255,0.5)')
      .text('skillvalix.com', SIDEBAR_X, H - 36, {
        width: SIDEBAR_W,
        align: 'center'
      });

    // ═════════════════════════════════════════════════════════════════════════
    //  3. LEFT CONTENT AREA
    // ═════════════════════════════════════════════════════════════════════════

    // ── Logo icon ─────────────────────────────────────────────────────────
    const LX = LEFT_PAD;
    const LY = 50;
    const ICON_SIZE = 48; // larger logo

    doc.save();
    doc.translate(LX, LY);
    // Draw the new accurate logo shapes, scaled
    const scale = ICON_SIZE / 40;
    doc.scale(scale);

    // Background gradient - dark blue to blue
    const grad = doc.linearGradient(0, 0, 40, 40);
    grad.stop(0, '#1D4ED8').stop(1, '#2563EB');
    doc.roundedRect(0, 0, 40, 40, 10).fill(grad);

    // Highlight
    doc.roundedRect(1, 1, 38, 19, 9).fillOpacity(0.06).fill(WHITE);
    doc.fillOpacity(1);

    // Trendline
    doc.moveTo(8, 28).bezierCurveTo(13, 21, 17, 25, 32, 10)
      .lineWidth(3).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // Arrowhead
    doc.moveTo(23.5, 10).lineTo(32, 10).lineTo(32, 18.5)
      .lineWidth(3).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // Dot at start
    doc.circle(8, 28, 2).fillOpacity(0.7).fill(WHITE);
    doc.fillOpacity(1);

    doc.restore();

    // ── Brand name ────────────────────────────────────────────────────────
    const BRAND_X = LX + ICON_SIZE + 16;

    doc.fontSize(22).font('Helvetica').fillColor(DARK_MID)
      .text('Skill', BRAND_X, LY + 8, { lineBreak: false, continued: true })
      .font('Helvetica-Bold').fillColor(BLUE)
      .text('Valix', { lineBreak: false });

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GRAY_LT)
      .text('GROW YOUR CAREER', BRAND_X, LY + 34, {
        lineBreak: false,
        characterSpacing: 2.5
      });

    // ── Thin separator under header ───────────────────────────────────────
    const SEP_Y = LY + ICON_SIZE + 24;
    doc.moveTo(LX, SEP_Y).lineTo(SIDEBAR_X - 40, SEP_Y)
      .lineWidth(0.5).strokeColor(BORDER).stroke();

    // ── "CERTIFICATE" label ───────────────────────────────────────────────
    const CERT_Y = SEP_Y + 40;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(BLUE)
      .text('C E R T I F I C A T E', LX, CERT_Y, {
        lineBreak: false,
        characterSpacing: 4
      });

    // ── "OF COMPLETION" heading ───────────────────────────────────────────
    doc.fontSize(38).font('Helvetica-Bold').fillColor(DARK)
      .text('OF COMPLETION', LX, CERT_Y + 18, { lineBreak: false });

    // ── "Awarded to" subtitle ─────────────────────────────────────────────
    doc.fontSize(14).font('Helvetica').fillColor(GRAY_MID)
      .text('Awarded to', LX, CERT_Y + 80, { lineBreak: false });

    // ── Student Name ──────────────────────────────────────────────────────
    const studentName = cert.student?.name || 'Student';
    const NAME_Y = CERT_Y + 104;

    let namePt = 42;
    doc.font('Helvetica-Bold');
    while (namePt > 20 && doc.fontSize(namePt).widthOfString(studentName.toUpperCase()) > CONTENT_W) {
      namePt -= 1;
    }

    doc.fontSize(namePt).font('Helvetica-Bold').fillColor(DARK)
      .text(studentName.toUpperCase(), LX, NAME_Y, { lineBreak: false });

    // Premium accent line
    const NAME_STR_W = Math.min(doc.fontSize(namePt).widthOfString(studentName.toUpperCase()), CONTENT_W);
    const UL_Y = NAME_Y + namePt + 12;

    doc.rect(LX, UL_Y, NAME_STR_W, 3).fill(BLUE);
    doc.rect(LX + NAME_STR_W + 8, UL_Y, CONTENT_W - NAME_STR_W - 8, 1).fillOpacity(0.15).fill(BLUE);
    doc.fillOpacity(1);

    // ── Course line ───────────────────────────────────────────────────────
    const COURSE_Y = UL_Y + 36;

    doc.fontSize(13).font('Helvetica').fillColor(GRAY)
      .text('for successfully completing the online learning course:', LX, COURSE_Y,
        { lineBreak: false });
        
    doc.fontSize(18).font('Helvetica-Bold').fillColor(DARK_MID)
      .text(courseTitle, LX, COURSE_Y + 24, { lineBreak: false });

    // ── Paragraphs ────────────────────────────────────────────────────────
    const PARA_Y = COURSE_Y + 64;

    doc.fontSize(11.5).font('Helvetica').fillColor(GRAY)
      .text(
        'This certificate is proudly awarded in recognition of the dedication, consistent effort, and outstanding performance demonstrated throughout the curriculum.',
        LX, PARA_Y,
        { width: CONTENT_W, lineGap: 6, align: 'left' }
      );

    const PARA2_Y = PARA_Y + 44;

    doc.fontSize(11.5).font('Helvetica').fillColor(GRAY)
      .text(
        'The holder has successfully proven core knowledge and the ability to apply practical skills in real-world professional scenarios using the foundational strategies taught in this program.',
        LX, PARA2_Y,
        { width: CONTENT_W, lineGap: 6, align: 'left' }
      );

    // ═════════════════════════════════════════════════════════════════════════
    //  4. BOTTOM ROW: Cert ID + QR
    // ═════════════════════════════════════════════════════════════════════════
    const BOTTOM_Y = H - 86;

    // ── Certificate ID ────────────────────────────────────────────────────
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GRAY_LT)
      .text('CERTIFICATE ID', LX, BOTTOM_Y, {
        lineBreak: false,
        characterSpacing: 2
      });

    doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK_MID)
      .text(cert.certificateId, LX, BOTTOM_Y + 16, { lineBreak: false });

    // ── QR Code ───────────────────────────────────────────────────────────
    const QR_SIZE = 72; // Increased size
    const QR_X = SIDEBAR_X - QR_SIZE - 32;
    const QR_Y = H - QR_SIZE - 28;

    // White card with shadow-like subtle border
    doc.rect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 20).fill(WHITE);

    // Border around QR card
    doc.rect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 20)
      .lineWidth(1).strokeColor(BORDER).stroke();

    // QR image
    doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

    // "Scan to Verify" label below QR
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY_LT)
      .text('SCAN TO VERIFY', QR_X - 10, QR_Y + QR_SIZE + 16, {
        width: QR_SIZE + 20,
        align: 'center',
        characterSpacing: 1,
        lineBreak: false
      });

    doc.end();

  } catch (err) {
    console.error('[Certificates] Download error:', err);
    if (doc) { try { doc.destroy(); } catch (_) { } }
    if (!res.headersSent)
      res.status(500).json({ message: 'Server error generating certificate.' });
  }
});


// ─── VERIFY ────────────────────────────────────────────────────────────────
router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid id' });

    const courseTitle = await resolveCourseTitle(cert.course);
    if (!cert.student || !courseTitle)
      return res.status(404).json({ message: 'Certificate invalid: associated student or course not found' });

    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json({
      valid: true,
      studentName: cert.student.name,
      courseTitle,
      issueDate: cert.issueDate,
      certificateId: cert.certificateId
    });
  } catch (err) {
    console.error('[Certificates] Verify error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;