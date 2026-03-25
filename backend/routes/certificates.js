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
      margin: 1,
      color: { dark: '#1A6FE8', light: '#FFFFFF' }
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
    const BLUE = '#1A6FE8';
    const BLUE_DARK = '#0F4BAD';
    const WHITE = '#FFFFFF';
    const OFF_WHITE = '#FAFAF8';
    const DARK = '#0D0D0D';
    const DARK_MID = '#111111';
    const GRAY = '#555555';
    const GRAY_MID = '#777777';
    const GRAY_LT = '#999999';
    const GRAY_XLT = '#AAAAAA';
    const BORDER = '#E8E4DC';
    const BORDER_LT = '#EBEBEB';

    // ── LAYOUT CONSTANTS ──────────────────────────────────────────────────────
    const SIDEBAR_W = 200;          // right blue sidebar width
    const SIDEBAR_X = W - SIDEBAR_W;
    const LEFT_PAD = 52;
    const CONTENT_W = SIDEBAR_X - LEFT_PAD - 40; // usable text width in left area

    // ═════════════════════════════════════════════════════════════════════════
    //  1. BACKGROUND
    // ═════════════════════════════════════════════════════════════════════════
    doc.rect(0, 0, W, H).fill(OFF_WHITE);

    // ─── Outer border frame ───────────────────────────────────────────────
    // Thin blue tint outer frame
    doc.rect(4, 4, W - 8, H - 8)
      .lineWidth(2).strokeColor(BLUE).stroke();
    doc.opacity(0.18);
    doc.rect(4, 4, W - 8, H - 8)
      .lineWidth(2).strokeColor(BLUE).stroke();
    doc.opacity(1);

    // Inner neutral border
    doc.rect(8, 8, W - 16, H - 16)
      .lineWidth(0.5).strokeColor(BORDER).stroke();

    // ═════════════════════════════════════════════════════════════════════════
    //  2. RIGHT BLUE SIDEBAR
    // ═════════════════════════════════════════════════════════════════════════
    doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).fill(BLUE);

    // Vertical divider between left content and sidebar
    doc.moveTo(SIDEBAR_X, 0).lineTo(SIDEBAR_X, H)
      .lineWidth(0.5).strokeColor(BORDER).stroke();

    // ── Sidebar: "COURSE" label ───────────────────────────────────────────
    doc.fontSize(7).font('Helvetica-Bold').fillColor('rgba(255,255,255,0.6)')
      .text('COURSE', SIDEBAR_X, 36, {
        width: SIDEBAR_W,
        align: 'center',
        characterSpacing: 2.5
      });

    // ── Sidebar: Course title ─────────────────────────────────────────────
    // Auto-shrink font if course title is long
    let coursePt = 13;
    doc.font('Helvetica-Bold');
    while (coursePt > 9 && doc.fontSize(coursePt).widthOfString(courseTitle) > SIDEBAR_W - 32) {
      coursePt -= 0.5;
    }
    doc.fontSize(coursePt).font('Helvetica-Bold').fillColor(WHITE)
      .text(courseTitle, SIDEBAR_X + 16, 52, {
        width: SIDEBAR_W - 32,
        align: 'center',
        lineGap: 3
      });

    // ── Sidebar: Verified Badge (centered, middle of page) ────────────────
    const BADGE_CX = SIDEBAR_X + SIDEBAR_W / 2;
    const BADGE_CY = H / 2;
    const OUTER_R = 44;
    const INNER_R = 36;

    // Outer ring
    doc.circle(BADGE_CX, BADGE_CY, OUTER_R)
      .lineWidth(1.5).strokeColor('rgba(255,255,255,0.35)').stroke();

    // Faint fill inside outer ring
    doc.circle(BADGE_CX, BADGE_CY, OUTER_R)
      .fillOpacity(0.08).fill(WHITE);
    doc.fillOpacity(1);

    // White inner circle
    doc.circle(BADGE_CX, BADGE_CY, INNER_R).fill(WHITE);

    // Blue inner circle (checkmark bg)
    doc.circle(BADGE_CX, BADGE_CY - 6, 16).fill(BLUE);

    // Checkmark
    doc.moveTo(BADGE_CX - 7, BADGE_CY - 6)
      .lineTo(BADGE_CX - 2, BADGE_CY - 1)
      .lineTo(BADGE_CX + 7, BADGE_CY - 13)
      .lineWidth(2.5).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // "VERIFIED" text inside badge
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(BLUE)
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

    const DATE_Y = H - 88;

    // Thin separator above date
    doc.moveTo(SIDEBAR_X + 20, DATE_Y - 10).lineTo(W - 20, DATE_Y - 10)
      .lineWidth(0.5).strokeColor('rgba(255,255,255,0.2)').stroke();

    doc.fontSize(7).font('Helvetica-Bold').fillColor('rgba(255,255,255,0.55)')
      .text('ISSUED ON', SIDEBAR_X, DATE_Y, {
        width: SIDEBAR_W,
        align: 'center',
        characterSpacing: 2
      });

    doc.fontSize(11).font('Helvetica-Bold').fillColor(WHITE)
      .text(issueDate, SIDEBAR_X, DATE_Y + 14, {
        width: SIDEBAR_W,
        align: 'center'
      });

    // skillvalix.com at very bottom of sidebar
    doc.fontSize(7.5).font('Helvetica').fillColor('rgba(255,255,255,0.45)')
      .text('skillvalix.com', SIDEBAR_X, H - 26, {
        width: SIDEBAR_W,
        align: 'center'
      });

    // ═════════════════════════════════════════════════════════════════════════
    //  3. LEFT CONTENT AREA
    // ═════════════════════════════════════════════════════════════════════════

    // ── Logo icon ─────────────────────────────────────────────────────────
    const LX = LEFT_PAD;
    const LY = 32;
    const ICON_SIZE = 36;

    doc.roundedRect(LX, LY, ICON_SIZE, ICON_SIZE, 9).fill(BLUE);

    // Smooth zigzag growth arrow inside icon
    doc.moveTo(LX + 7, LY + ICON_SIZE - 9)
      .bezierCurveTo(
        LX + 11, LY + 20,
        LX + 13, LY + 22,
        LX + 18, LY + 16
      )
      .bezierCurveTo(
        LX + 23, LY + 10,
        LX + 25, LY + 13,
        LX + 29, LY + 8
      )
      .lineWidth(2.8).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // Arrow head
    doc.moveTo(LX + 24, LY + 8).lineTo(LX + 29, LY + 8).lineTo(LX + 29, LY + 13)
      .lineWidth(2.5).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // ── Brand name ────────────────────────────────────────────────────────
    const BRAND_X = LX + ICON_SIZE + 11;

    doc.fontSize(17).font('Helvetica').fillColor(DARK_MID)
      .text('Skill', BRAND_X, LY + 6, { lineBreak: false, continued: true })
      .font('Helvetica-Bold').fillColor(BLUE)
      .text('Valix', { lineBreak: false });

    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(GRAY_XLT)
      .text('GROW YOUR CAREER', BRAND_X, LY + 26, {
        lineBreak: false,
        characterSpacing: 2
      });

    // ── Thin separator under header ───────────────────────────────────────
    const SEP_Y = LY + ICON_SIZE + 14;
    doc.moveTo(LX, SEP_Y).lineTo(SIDEBAR_X - 40, SEP_Y)
      .lineWidth(0.5).strokeColor(BORDER_LT).stroke();

    // ── "CERTIFICATE" label ───────────────────────────────────────────────
    const CERT_Y = SEP_Y + 18;

    doc.fontSize(8).font('Helvetica-Bold').fillColor(BLUE)
      .text('CERTIFICATE', LX, CERT_Y, {
        lineBreak: false,
        characterSpacing: 3.5
      });

    // ── "of Completion" heading ───────────────────────────────────────────
    doc.fontSize(24).font('Helvetica-Bold').fillColor(DARK_MID)
      .text('of Completion', LX, CERT_Y + 12, { lineBreak: false });

    // ── "Awarded to" subtitle ─────────────────────────────────────────────
    doc.fontSize(10).font('Helvetica').fillColor(GRAY_LT)
      .text('Awarded to', LX, CERT_Y + 42, { lineBreak: false });

    // ── Student Name ──────────────────────────────────────────────────────
    const studentName = cert.student?.name || 'Student';
    const NAME_Y = CERT_Y + 58;

    let namePt = 28;
    doc.font('Helvetica-Bold');
    while (namePt > 14 && doc.fontSize(namePt).widthOfString(studentName) > CONTENT_W) {
      namePt -= 0.5;
    }

    doc.fontSize(namePt).font('Helvetica-Bold').fillColor(DARK)
      .text(studentName, LX, NAME_Y, { lineBreak: false });

    // Blue underline accent
    const NAME_STR_W = Math.min(doc.fontSize(namePt).widthOfString(studentName), CONTENT_W);
    const UL_Y = NAME_Y + namePt + 5;

    doc.rect(LX, UL_Y, NAME_STR_W, 2.5)
      .fill(BLUE);

    // ── Course line ───────────────────────────────────────────────────────
    const COURSE_Y = UL_Y + 14;

    doc.fontSize(10).font('Helvetica').fillColor(GRAY_MID)
      .text('on successful completion of ', LX, COURSE_Y,
        { lineBreak: false, continued: true })
      .font('Helvetica-Bold').fillColor(DARK_MID)
      .text(courseTitle, { lineBreak: false });

    // ── Paragraphs ────────────────────────────────────────────────────────
    const PARA_Y = COURSE_Y + 20;

    doc.fontSize(9.5).font('Helvetica').fillColor(GRAY)
      .text(
        'This certificate is proudly awarded in recognition of the dedication, consistent effort, and outstanding performance demonstrated throughout the course.',
        LX, PARA_Y,
        { width: CONTENT_W, lineGap: 2, align: 'left' }
      );

    const PARA2_Y = PARA_Y + 36;

    doc.fontSize(9.5).font('Helvetica').fillColor(GRAY)
      .text(
        'The holder has successfully demonstrated core knowledge and the ability to apply practical skills in real-world professional scenarios using course-taught strategies.',
        LX, PARA2_Y,
        { width: CONTENT_W, lineGap: 2, align: 'left' }
      );

    // ═════════════════════════════════════════════════════════════════════════
    //  4. BOTTOM ROW: Cert ID + QR
    // ═════════════════════════════════════════════════════════════════════════
    const BOTTOM_Y = H - 72;

    // ── Certificate ID ────────────────────────────────────────────────────
    doc.fontSize(7).font('Helvetica-Bold').fillColor(GRAY_XLT)
      .text('CERTIFICATE ID', LX, BOTTOM_Y, {
        lineBreak: false,
        characterSpacing: 1.5
      });

    doc.fontSize(9).font('Helvetica-Bold').fillColor(GRAY_MID)
      .text(cert.certificateId, LX, BOTTOM_Y + 12, { lineBreak: false });

    // ── QR Code ───────────────────────────────────────────────────────────
    const QR_SIZE = 58;
    const QR_X = SIDEBAR_X - QR_SIZE - 20;
    const QR_Y = H - QR_SIZE - 16;

    // White card behind QR
    doc.rect(QR_X - 5, QR_Y - 5, QR_SIZE + 10, QR_SIZE + 10)
      .fill(WHITE);

    // Blue border around QR card
    doc.rect(QR_X - 5, QR_Y - 5, QR_SIZE + 10, QR_SIZE + 10)
      .lineWidth(1.2).strokeColor(BLUE).stroke();

    // Blue top accent strip on QR card
    doc.rect(QR_X - 5, QR_Y - 5, QR_SIZE + 10, 3).fill(BLUE);

    // QR image
    doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

    // "Scan to Verify" label below QR
    doc.fontSize(6).font('Helvetica').fillColor(GRAY_LT)
      .text('Scan to Verify', QR_X - 5, QR_Y + QR_SIZE + 6, {
        width: QR_SIZE + 10,
        align: 'center',
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

// ─── HELPER ────────────────────────────────────────────────────────────────
function fitSingleLineText(doc, text, maxWidth) {
  let pt = 10;
  while (pt > 7 && doc.fontSize(pt).widthOfString(text) > maxWidth) {
    pt -= 0.5;
  }
  doc.fontSize(pt);
  return text;
}
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