import express from 'express';
import PDFDocument from 'pdfkit';
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

router.post('/generate', authOptions, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);
    const jsonCourse = await getCourseFromJSON(courseId);
    if (!jsonCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }
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
      return { ...cert, course: { _id: courseIdStr, title: jsonEntry?.course?.title || 'Unknown Course' } };
    });
    const uniqueMap = new Map();
    enrichedCerts.forEach(cert => {
      if (cert.course?._id && !uniqueMap.has(cert.course._id)) uniqueMap.set(cert.course._id, cert);
    });
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.json(Array.from(uniqueMap.values()));
  } catch (err) {
    console.error('[Certificates] Error fetching user certs:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/download/:certId', async (req, res) => {
  let doc;
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });

    const courseTitle = await resolveCourseTitle(cert.course);
    if (!cert.student || !courseTitle) {
      return res.status(404).json({ message: 'Certificate data incomplete.' });
    }

    doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);
    doc.pipe(res);
    doc.on('error', (err) => { console.error('PDF stream error:', err.message); doc.destroy(); });

    const W = doc.page.width;   // 841.89
    const H = doc.page.height;  // 595.28
    const cx = W / 2;

    // ── PALETTE ───────────────────────────────────────────────
    const NAVY     = '#0f2a4a';
    const NAVY_MID = '#1a3a6b';
    const GOLD     = '#b8922a';
    const GOLD_LT  = '#d4aa50';
    const GOLD_PAL = '#e8d08a';
    const CREAM    = '#fdf9f2';
    const CREAM_DK = '#f5eddc';
    const SLATE    = '#4a5568';
    const STEEL    = '#7a9bbf';

    // ── HELPERS ───────────────────────────────────────────────
    // CRITICAL: always pass x=0, width=W for true horizontal centering
    const centerText = (text, y, size, font, color, opts = {}) => {
      doc.fontSize(size).font(font).fillColor(color)
         .text(text, 0, y, { width: W, align: 'center', lineBreak: false, ...opts });
    };

    const drawDiamond = (x, y, outer, hollow = false) => {
      doc.save();
      doc.translate(x, y).rotate(45);
      doc.rect(-outer / 2, -outer / 2, outer, outer).fill(GOLD);
      if (hollow) {
        const inner = outer * 0.55;
        doc.rect(-inner / 2, -inner / 2, inner, inner).fill(CREAM);
        const core = outer * 0.22;
        doc.rect(-core / 2, -core / 2, core, core).fill(GOLD);
      }
      doc.restore();
    };

    const drawDivider = (y, halfW = 200) => {
      doc.moveTo(cx - halfW, y).lineTo(cx - 20, y).lineWidth(0.8).stroke(GOLD);
      doc.moveTo(cx + 20, y).lineTo(cx + halfW, y).lineWidth(0.8).stroke(GOLD);
      drawDiamond(cx, y, 10, true);
      doc.circle(cx - 35, y, 2).fill(GOLD_PAL);
      doc.circle(cx + 35, y, 2).fill(GOLD_PAL);
    };

    // ── BACKGROUND ────────────────────────────────────────────
    doc.rect(0, 0, W, H).fill(CREAM);

    // Subtle diagonal line texture
    doc.save();
    doc.opacity(0.028);
    for (let i = -H; i < W + H; i += 26) {
      doc.moveTo(i, 0).lineTo(i + H, H).lineWidth(10).stroke(NAVY);
    }
    doc.restore();

    // ── BORDER SYSTEM ─────────────────────────────────────────
    // 1) Outer navy frame
    doc.rect(0, 0, W, H).fill(NAVY);

    // 2) Ivory inset with texture
    doc.rect(14, 14, W - 28, H - 28).fill(CREAM);
    doc.save();
    doc.rect(14, 14, W - 28, H - 28).clip();
    doc.opacity(0.022);
    for (let i = -H; i < W + H; i += 26) {
      doc.moveTo(i, 0).lineTo(i + H, H).lineWidth(10).stroke(NAVY);
    }
    doc.restore();

    // 3) Gold rule
    doc.rect(22, 22, W - 44, H - 44).lineWidth(1.5).stroke(GOLD);

    // 4) Inner navy hairline
    doc.rect(30, 30, W - 60, H - 60).lineWidth(0.5).stroke(NAVY_MID);

    // ── CORNER L-BRACKETS ────────────────────────────────────
    const bracket = (ox, oy, fx, fy) => {
      doc.save();
      doc.translate(ox, oy).scale(fx, fy);
      doc.rect(0, 0, 42, 4).fill(GOLD);
      doc.rect(0, 0, 4, 42).fill(GOLD);
      doc.rect(40, 4, 3, 3).fill(GOLD);
      doc.rect(4, 40, 3, 3).fill(GOLD);
      doc.restore();
    };
    bracket(22, 22,  1,  1);
    bracket(W - 22, 22, -1,  1);
    bracket(22, H - 22,  1, -1);
    bracket(W - 22, H - 22, -1, -1);

    // Edge center dots
    [[cx, 22], [cx, H - 22], [22, H / 2], [W - 22, H / 2]]
      .forEach(([x, y]) => doc.circle(x, y, 3.5).fill(GOLD));

    // ── HEADER BAND ───────────────────────────────────────────
    doc.rect(30, 30, W - 60, 60).fill(NAVY);
    doc.rect(30, 90, W - 60, 2).fill(GOLD);

    // Flanking rule lines beside brand
    const bY = 48;
    doc.moveTo(cx - 210, bY).lineTo(cx - 108, bY).lineWidth(0.5).stroke(GOLD);
    doc.moveTo(cx + 108, bY).lineTo(cx + 210, bY).lineWidth(0.5).stroke(GOLD);
    doc.circle(cx - 108, bY, 2.5).fill(GOLD_PAL);
    doc.circle(cx + 108, bY, 2.5).fill(GOLD_PAL);

    // Brand & tagline — x=30, width=W-60 to stay inside band bounds
    doc.fontSize(11).font('Helvetica-Bold').fillColor(GOLD_LT)
       .text('S  K  I  L  L  H  U  B', 30, 40,
         { width: W - 60, align: 'center', lineBreak: false, characterSpacing: 6 });

    doc.fontSize(7.5).font('Helvetica-Oblique').fillColor(STEEL)
       .text('EMPOWERING LEARNERS  ·  BUILDING FUTURES  ·  INSPIRING EXCELLENCE',
         30, 62, { width: W - 60, align: 'center', lineBreak: false, characterSpacing: 1.5 });

    // ── WATERMARK ─────────────────────────────────────────────
    doc.save();
    doc.opacity(0.03);
    doc.translate(cx, H / 2 + 20).rotate(-28);
    doc.fontSize(108).fillColor(NAVY).font('Helvetica-Bold')
       .text('CERTIFIED', -250, -54, { lineBreak: false });
    doc.restore();

    // ── DIVIDER 1 ─────────────────────────────────────────────
    drawDivider(105, 250);

    // ── SMALL CAPS LABEL ──────────────────────────────────────
    centerText('— CERTIFICATE OF ACHIEVEMENT —', 112, 8.5, 'Helvetica-Bold', GOLD);

    // ── MAIN TITLE ────────────────────────────────────────────
    centerText('Certificate of Achievement', 124, 34, 'Helvetica-Bold', NAVY);

    // ── DIVIDER 2 ─────────────────────────────────────────────
    drawDivider(168, 170);

    // ── INTRO LINE ────────────────────────────────────────────
    centerText('This certificate is proudly presented to', 177, 11, 'Helvetica-Oblique', SLATE);

    // ── STUDENT NAME ──────────────────────────────────────────
    // Auto-size: shrink from 36 until fits inside W - 140 (70px margin each side)
    const studentName = cert.student?.name || 'Student';
    let namePt = 36;
    doc.font('Helvetica-Bold');
    while (namePt > 16 && doc.fontSize(namePt).widthOfString(studentName) > W - 140) {
      namePt -= 1;
    }

    const nameY  = 193;
    const nameW  = doc.fontSize(namePt).font('Helvetica-Bold').widthOfString(studentName);
    const nameX0 = cx - nameW / 2;  // left edge of rendered name
    const nameX1 = cx + nameW / 2;  // right edge

    // Draw name — x=0, width=W for perfect center alignment
    doc.fontSize(namePt).font('Helvetica-Bold').fillColor(NAVY)
       .text(studentName, 0, nameY, { width: W, align: 'center', lineBreak: false });

    // Double underline anchored to actual name width
    const ul1Y = nameY + namePt + 3;
    const ul2Y = ul1Y + 4;
    doc.moveTo(nameX0, ul1Y).lineTo(nameX1, ul1Y).lineWidth(2.5).stroke(GOLD);
    doc.moveTo(nameX0 + 12, ul2Y).lineTo(nameX1 - 12, ul2Y).lineWidth(0.8).stroke(NAVY_MID);

    // Flanking dashes outside the name
    doc.moveTo(nameX0 - 22, nameY + namePt / 2)
       .lineTo(nameX0 - 6, nameY + namePt / 2).lineWidth(1.2).stroke(GOLD);
    doc.moveTo(nameX1 + 6, nameY + namePt / 2)
       .lineTo(nameX1 + 22, nameY + namePt / 2).lineWidth(1.2).stroke(GOLD);

    // ── COURSE LINE & PILL ────────────────────────────────────
    const afterUl = ul2Y + 10;
    centerText('has successfully completed the course', afterUl, 10.5, 'Helvetica', SLATE);

    const courseFitted = fitSingleLineText(doc, courseTitle, W - 120);
    doc.fontSize(14).font('Helvetica-Bold');
    const pillW = Math.min(doc.widthOfString(courseFitted) + 90, W - 80);
    const pillX = cx - pillW / 2;
    const pillY = afterUl + 17;

    doc.rect(pillX, pillY, pillW, 28).fill(NAVY);
    doc.rect(pillX, pillY, pillW, 28).lineWidth(1).stroke(GOLD);
    doc.rect(pillX, pillY, pillW, 3).fill(GOLD);         // gold top strip
    doc.rect(pillX, pillY + 25, pillW, 3).fill(GOLD);    // gold bottom strip

    doc.fontSize(14).font('Helvetica-Bold').fillColor(GOLD_LT)
       .text(courseFitted, pillX, pillY + 7,
         { width: pillW, align: 'center', lineBreak: false });

    // ── BODY PARAGRAPH ────────────────────────────────────────
    const paraY  = pillY + 36;
    const paraPad = 70;

    // Thin separator
    doc.moveTo(cx - 240, paraY).lineTo(cx + 240, paraY)
       .lineWidth(0.4).stroke(GOLD_PAL);

    const bodyText =
      'and has demonstrated a clear understanding of the course concepts by successfully passing the final ' +
      'assessment. The candidate has met the required qualification criteria and has shown competency in ' +
      "applying the acquired knowledge effectively. This certification acknowledges the individual's " +
      'dedication, skills, and readiness to apply their learning in real-world scenarios.';

    // Multi-line justified paragraph — PDFKit wraps automatically with lineBreak: true
    doc.fontSize(8.6).font('Helvetica-Oblique').fillColor(SLATE)
       .text(bodyText, paraPad, paraY + 8, {
         width: W - paraPad * 2,
         align: 'justify',
         lineBreak: true,
         lineGap: 4
       });

    // Compute bottom of paragraph for positioning divider dynamically
    const paraBottom = doc.y + 4;

    // ── DIVIDER 3 ─────────────────────────────────────────────
    const div3Y = Math.max(paraBottom + 6, H - 100);
    drawDivider(div3Y, 230);

    // ── INFO ROW ──────────────────────────────────────────────
    const rawDate   = cert.issueDate ? new Date(cert.issueDate) : new Date();
    const issueDate = rawDate.toLocaleDateString('en-IN',
      { year: 'numeric', month: 'long', day: 'numeric' });
    const verifyUrl = `https://skillhubpro.vercel.app/verify/${cert.certificateId}`;

    const rowY = div3Y + 10;
    const colW = (W - 100) / 3;

    // Column dividers
    [cx - colW / 2, cx + colW / 2].forEach(x =>
      doc.moveTo(x, rowY + 2).lineTo(x, rowY + 50)
         .lineWidth(0.5).stroke(GOLD_PAL)
    );

    const infoCol = (label, value, xc, isLink, linkUrl) => {
      doc.fontSize(7).font('Helvetica-Bold').fillColor(GOLD)
         .text(label, xc - colW / 2, rowY + 2,
           { width: colW, align: 'center', lineBreak: false, characterSpacing: 1.5 });

      doc.moveTo(xc - 30, rowY + 14).lineTo(xc + 30, rowY + 14)
         .lineWidth(0.4).stroke(GOLD_PAL);

      const tOpts = { width: colW, align: 'center', lineBreak: false };
      if (isLink) { tOpts.link = linkUrl; tOpts.underline = true; }

      doc.fontSize(9).font(isLink ? 'Helvetica-Oblique' : 'Helvetica-Bold')
         .fillColor(isLink ? GOLD : NAVY)
         .text(value, xc - colW / 2, rowY + 20, tOpts);
    };

    infoCol('DATE OF ISSUE', issueDate, cx - colW,       false, null);
    infoCol('CERTIFICATE ID', cert.certificateId, cx,    false, null);
    infoCol('VERIFY ONLINE',
      fitSingleLineText(doc, verifyUrl, colW - 12),
      cx + colW, true, verifyUrl);

    // ── BOTTOM BAND ───────────────────────────────────────────
    doc.rect(30, H - 48, W - 60, 2).fill(GOLD);
    doc.rect(30, H - 46, W - 60, 16).fill(NAVY);

    doc.fontSize(7).font('Helvetica-Oblique').fillColor(STEEL)
       .text(
         `This document certifies the above named individual has met all requirements · ${new Date().getFullYear()} SkillHub · All Rights Reserved`,
         30, H - 41, { width: W - 60, align: 'center', lineBreak: false }
       );

    doc.rect(30, H - 30, W - 60, 1.2).fill(GOLD_LT);

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GOLD_PAL)
       .text('S K I L L H U B', 30, H - 26,
         { width: W - 60, align: 'center', lineBreak: false, characterSpacing: 4 });

    // Flanking lines by bottom brand
    doc.moveTo(cx - 200, H - 22).lineTo(cx - 86, H - 22).lineWidth(0.4).stroke(GOLD);
    doc.moveTo(cx + 86,  H - 22).lineTo(cx + 200, H - 22).lineWidth(0.4).stroke(GOLD);

    doc.end();
  } catch (err) {
    console.error('[Certificates] Download error:', err);
    if (doc) { try { doc.destroy(); } catch (_) {} }
    if (!res.headersSent) res.status(500).json({ message: 'Server error generating certificate.' });
  }
});

router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid id' });

    const courseTitle = await resolveCourseTitle(cert.course);
    if (!cert.student || !courseTitle) {
      return res.status(404).json({ message: 'Certificate invalid: associated student or course not found' });
    }

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