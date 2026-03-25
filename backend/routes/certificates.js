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

    // ── QR Code ──────────────────────────────────────────────
    const verifyUrl = `https://www.skillvalix.com/verify/${cert.certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      errorCorrectionLevel: 'H',
      width: 220,
      margin: 1,
      color: { dark: '#1a1a1a', light: '#FFFFFF' }
    });

    // ── PDF Setup ─────────────────────────────────────────────
    doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);
    doc.pipe(res);
    doc.on('error', (err) => { console.error('PDF stream error:', err.message); doc.destroy(); });

    const W = doc.page.width;   // 841.89
    const H = doc.page.height;  // 595.28

    // ── PALETTE ───────────────────────────────────────────────
    const YELLOW    = '#FFB800';
    const YELLOW_DK = '#D99A00';
    const YELLOW_LT = '#FFD55A';
    const WHITE     = '#FFFFFF';
    const DARK      = '#1A1A2E';
    const DARK_MID  = '#2D2D50';
    const GRAY      = '#555570';
    const GRAY_LT   = '#9090A8';
    const OFF_WHITE = '#FFFDF5';

    // ── BANNER DIMENSIONS ─────────────────────────────────────
    const BANNER_W = 200;
    const BANNER_X = W - BANNER_W;

    // ═══════════════════════════════════════════════════════════
    //  BACKGROUND
    // ═══════════════════════════════════════════════════════════
    doc.rect(0, 0, W, H).fill(OFF_WHITE);

    // ── Multi-layer border (matching reference style) ─────────
    // Outermost thin line
    doc.rect(5, 5, W - 10, H - 10).lineWidth(1).stroke(YELLOW_DK);
    // Bold yellow frame
    doc.rect(9, 9, W - 18, H - 18).lineWidth(5).stroke(YELLOW);
    // Inner thin accent
    doc.rect(16, 16, W - 32, H - 32).lineWidth(0.7).stroke(YELLOW_DK);

    // ═══════════════════════════════════════════════════════════
    //  RIGHT YELLOW BANNER
    // ═══════════════════════════════════════════════════════════
    doc.rect(BANNER_X, 0, BANNER_W, H).fill(YELLOW);

    // Subtle dot-grid texture on banner
    doc.save();
    doc.rect(BANNER_X, 0, BANNER_W, H).clip();
    doc.opacity(0.07);
    for (let row = 14; row < H; row += 20) {
      for (let col = BANNER_X + 10; col < W; col += 18) {
        doc.circle(col, row, 1.8).fill(DARK);
      }
    }
    doc.restore();

    // Left edge dark accent line
    doc.rect(BANNER_X, 0, 4, H).fill(YELLOW_DK);
    doc.rect(BANNER_X + 4, 0, 1.2, H).fill(YELLOW_LT);

    // ═══════════════════════════════════════════════════════════
    //  LOGO + BRAND  (top-left)
    // ═══════════════════════════════════════════════════════════
    const LX = 44, LY = 32;

    // SkillValix new modern logo
    doc.save();
    doc.roundedRect(LX, LY, 40, 40, 10).fill('#2563EB');
    doc.moveTo(LX + 9, LY + 29)
       .bezierCurveTo(LX + 15, LY + 20, LX + 18, LY + 26, LX + 31, LY + 11)
       .lineWidth(3.2).lineCap('round').lineJoin('round').stroke('#FFFFFF');
    // Arrow head
    doc.moveTo(LX + 24, LY + 11).lineTo(LX + 31, LY + 11).lineTo(LX + 31, LY + 18)
       .lineWidth(3.2).lineCap('round').lineJoin('round').stroke('#FFFFFF');
    doc.restore();

    // Brand name
    const brandX = LX + 52;
    doc.fontSize(20).font('Helvetica').fillColor(DARK)
       .text('Skill', brandX, LY + 6, { lineBreak: false, continued: true })
       .font('Helvetica-Bold').fillColor('#2563EB')
       .text('Valix', { lineBreak: false });
       
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(GRAY_LT)
       .text('GROW YOUR CAREER', brandX, LY + 28, {
         lineBreak: false, characterSpacing: 1.5
       });

    // Separator under header area
    doc.moveTo(LX, LY + 46).lineTo(BANNER_X - LX, LY + 46)
       .lineWidth(0.5).stroke('#DDDDDD');

    // ═══════════════════════════════════════════════════════════
    //  MAIN CONTENT  (left area)
    // ═══════════════════════════════════════════════════════════
    const CONTENT_CUT = BANNER_X - 22;  // right boundary of content
    const LEFT_PAD    = 44;

    // "Certificate" large title
    const TITLE_Y = 92;
    doc.fontSize(50).font('Helvetica-Bold').fillColor(DARK)
       .text('Certificate', LEFT_PAD, TITLE_Y, { lineBreak: false });

    // Subtitle italic
    doc.fontSize(12.5).font('Helvetica-Oblique').fillColor(GRAY)
       .text('of Completion Awarded to', LEFT_PAD, TITLE_Y + 60, { lineBreak: false });

    // ── Student Name ──────────────────────────────────────────
    const studentName = cert.student?.name || 'Student';
    let namePt = 26;
    doc.font('Helvetica-Bold');
    while (namePt > 13 && doc.fontSize(namePt).widthOfString(studentName.toUpperCase()) > CONTENT_CUT - LEFT_PAD - 20) {
      namePt -= 1;
    }

    const NAME_Y = TITLE_Y + 82;
    doc.fontSize(namePt).font('Helvetica-Bold').fillColor(DARK)
       .text(studentName.toUpperCase(), LEFT_PAD, NAME_Y, {
         lineBreak: false, characterSpacing: 2
       });

    // Underline the name with a yellow stroke
    const nameStrW = doc.fontSize(namePt).widthOfString(studentName.toUpperCase());
    const UL_Y     = NAME_Y + namePt + 5;
    doc.moveTo(LEFT_PAD, UL_Y).lineTo(LEFT_PAD + nameStrW, UL_Y)
       .lineWidth(2.5).stroke(YELLOW);
    doc.moveTo(LEFT_PAD + 10, UL_Y + 4).lineTo(LEFT_PAD + nameStrW - 10, UL_Y + 4)
       .lineWidth(0.6).stroke(YELLOW_DK);

    // ── Course completion line ────────────────────────────────
    const COURSE_Y = UL_Y + 14;
    const fittedTitle = fitSingleLineText(doc, courseTitle, CONTENT_CUT - LEFT_PAD - 40);

    doc.fontSize(10).font('Helvetica').fillColor(GRAY)
       .text('on successful completion of ', LEFT_PAD, COURSE_Y,
         { lineBreak: false, continued: true })
       .font('Helvetica-Bold').fillColor(DARK_MID)
       .text(fittedTitle, { lineBreak: false });

    const COURSE_AFTER_Y = COURSE_Y + 14;
    doc.fontSize(10).font('Helvetica').fillColor(GRAY)
       .text('Holder of this certificate can', LEFT_PAD, COURSE_AFTER_Y, { lineBreak: false });

    // ── Bullet Points ─────────────────────────────────────────
    const bullets = [
      'Demonstrate core knowledge and applied skills in the subject area',
      'Apply learned concepts effectively in real-world professional scenarios',
      'Automate tasks and build solutions using course-taught strategies'
    ];
    const BULLET_Y = COURSE_AFTER_Y + 18;

    bullets.forEach((bullet, i) => {
      const BY = BULLET_Y + i * 16;
      // Diamond bullet — matching reference style
      doc.save();
      doc.translate(LEFT_PAD + 5, BY + 5.5).rotate(45);
      doc.rect(-3.2, -3.2, 6.4, 6.4).fill(YELLOW);
      doc.restore();
      doc.fontSize(9).font('Helvetica').fillColor(GRAY)
         .text(bullet, LEFT_PAD + 16, BY, {
           width: CONTENT_CUT - LEFT_PAD - 30,
           lineBreak: false
         });
    });

    // No signatures in the new clean layout as per request

    // ── QR Code (bottom-right, just before banner) ────────────
    const QR_SIZE = 74;
    const QR_X    = BANNER_X - QR_SIZE - 16;
    const QR_Y    = H - QR_SIZE - 24;

    // White card behind QR
    doc.rect(QR_X - 5, QR_Y - 5, QR_SIZE + 10, QR_SIZE + 10).fill(WHITE);
    doc.rect(QR_X - 5, QR_Y - 5, QR_SIZE + 10, QR_SIZE + 10)
       .lineWidth(1.2).stroke(YELLOW);
    // Top accent strip on QR card
    doc.rect(QR_X - 5, QR_Y - 5, QR_SIZE + 10, 3).fill(YELLOW);

    doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

    doc.fontSize(5.5).font('Helvetica').fillColor(GRAY)
       .text('Scan to Verify', QR_X - 5, QR_Y + QR_SIZE + 7, {
         width: QR_SIZE + 10, align: 'center', lineBreak: false
       });

    // ── Certificate ID at bottom ──────────────────────────────
    doc.fontSize(7).font('Helvetica').fillColor(GRAY_LT)
       .text(`Certificate ID: ${cert.certificateId}`, LEFT_PAD, H - 26, { lineBreak: false });

    // ═══════════════════════════════════════════════════════════
    //  RIGHT BANNER CONTENT
    // ═══════════════════════════════════════════════════════════
    const BCX = BANNER_X + BANNER_W / 2;  // banner center X

    // Course title at top of banner
    doc.fontSize(13.5).font('Helvetica-Bold').fillColor(DARK)
       .text(courseTitle, BANNER_X + 14, 26, {
         width: BANNER_W - 28,
         align: 'center',
         lineBreak: true,
         lineGap: 2
       });

    // Separator
    const SEP_Y = 90;
    doc.moveTo(BANNER_X + 20, SEP_Y).lineTo(W - 20, SEP_Y)
       .lineWidth(0.8).stroke(YELLOW_DK);

    // ── Verified Badge ────────────────────────────────────────
    const BADGE_CX = BCX;
    const BADGE_CY = H / 2 - 18;
    const OUTER_R  = 58;

    // Scalloped / wavy outer ring (dashed-arc effect)
    const SCALLOP_N = 28;
    for (let i = 0; i < SCALLOP_N; i++) {
      const a1 = (i       / SCALLOP_N) * Math.PI * 2;
      const a2 = ((i + 0.6) / SCALLOP_N) * Math.PI * 2;
      const R  = OUTER_R + 2;
      doc.moveTo(BADGE_CX + R * Math.cos(a1), BADGE_CY + R * Math.sin(a1))
         .lineTo(BADGE_CX + R * Math.cos(a2), BADGE_CY + R * Math.sin(a2))
         .lineWidth(2.2).stroke(DARK);
    }

    // Main ring
    doc.circle(BADGE_CX, BADGE_CY, OUTER_R - 5).lineWidth(1.5).stroke(DARK);

    // White badge fill
    doc.circle(BADGE_CX, BADGE_CY, OUTER_R - 8).fill(WHITE);

    // Inner yellow circle with mini logo
    doc.circle(BADGE_CX, BADGE_CY - 9, 24).fill(YELLOW);

    // Mini bulb icon inside badge
    doc.save();
    doc.circle(BADGE_CX, BADGE_CY - 14, 9).fill(YELLOW_LT);
    doc.rect(BADGE_CX - 5.5, BADGE_CY - 3.5, 11, 3.5).fill(YELLOW_DK);
    doc.rect(BADGE_CX - 4.5, BADGE_CY, 9, 3).fill(YELLOW_DK);
    // Shine dot
    doc.save();
    doc.opacity(0.6);
    doc.circle(BADGE_CX - 3, BADGE_CY - 18, 2.5).fill(WHITE);
    doc.restore();
    doc.restore();

    // "Verified" text inside badge
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(GRAY)
       .text('Verified', BADGE_CX - 30, BADGE_CY + 18, {
         width: 60, align: 'center', lineBreak: false
       });

    // Separator below badge
    const BADGE_SEP = BADGE_CY + OUTER_R + 4;
    doc.moveTo(BANNER_X + 20, BADGE_SEP).lineTo(W - 20, BADGE_SEP)
       .lineWidth(0.8).stroke(YELLOW_DK);

    // ── Issue Date inside banner ──────────────────────────────
    const rawDate  = cert.issueDate ? new Date(cert.issueDate) : new Date();
    const issueDate = rawDate.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const DATE_Y = BADGE_SEP + 8;

    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(DARK_MID)
       .text('Issued on:', BANNER_X + 8, DATE_Y, {
         width: BANNER_W - 16, align: 'center', lineBreak: false
       });

    doc.fontSize(11.5).font('Helvetica-Bold').fillColor(DARK)
       .text(issueDate, BANNER_X + 8, DATE_Y + 15, {
         width: BANNER_W - 16, align: 'center', lineBreak: false
       });

    doc.end();
  } catch (err) {
    console.error('[Certificates] Download error:', err);
    if (doc) { try { doc.destroy(); } catch (_) {} }
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