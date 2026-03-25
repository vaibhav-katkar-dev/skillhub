import express from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import Quiz from '../models/Quiz.js';
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
// ═══════════════════════════════════════════════════════════════════════════
//  Ribbon color themes — change RIBBON_THEME to switch accent color
//  Options: 'gold' | 'purple' | 'teal' | 'ruby' | 'blue' | 'emerald'
// ═══════════════════════════════════════════════════════════════════════════
const RIBBON_THEMES = {
  gold: { dark: '#92400E', mid: '#F59E0B', light: '#FDE68A', tab: '#78350F' },
  purple: { dark: '#4C1D95', mid: '#7C3AED', light: '#C4B5FD', tab: '#4C1D95' },
  teal: { dark: '#164E63', mid: '#0E7490', light: '#67E8F9', tab: '#164E63' },
  ruby: { dark: '#7F1D1D', mid: '#B91C1C', light: '#FCA5A5', tab: '#7F1D1D' },
  blue: { dark: '#1E3A8A', mid: '#2563EB', light: '#93C5FD', tab: '#1E3A8A' },
  emerald: { dark: '#134E4A', mid: '#0F766E', light: '#5EEAD4', tab: '#134E4A' },
};

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

    const quiz = await Quiz.findOne({ course: cert.course }).lean();
    const dynamicTheme = quiz?.ribbonTheme || 'blue';

    // ── QR Code ──────────────────────────────────────────────────────────────
    const verifyUrl = `https://www.skillvalix.com/verify/${cert.certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      errorCorrectionLevel: 'H',
      width: 200,
      margin: 1,
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
    const BLUE = '#2563EB';
    const WHITE = '#FFFFFF';
    const OFF_WHITE = '#F8FAFC';
    const DARK = '#0F172A';
    const DARK_MID = '#1E293B';
    const GRAY = '#475569';
    const GRAY_MID = '#64748B';
    const GRAY_LT = '#94A3B8';
    const BORDER = '#CBD5E1';
    const EMERALD = '#059669';
    const EMERALD_LT = '#34D399';

    // ── Ribbon theme colors ───────────────────────────────────────────────────
    const RIB = RIBBON_THEMES[dynamicTheme] || RIBBON_THEMES.blue;

    // ── LAYOUT CONSTANTS ──────────────────────────────────────────────────────
    const SIDEBAR_W = 220;
    const SIDEBAR_X = W - SIDEBAR_W;
    const LEFT_PAD = 64;
    const CONTENT_W = SIDEBAR_X - LEFT_PAD - 40;

    // ═════════════════════════════════════════════════════════════════════════
    //  1. BACKGROUND
    // ═════════════════════════════════════════════════════════════════════════
    doc.rect(0, 0, W, H).fill(OFF_WHITE);

    // Outer border frame
    doc.rect(6, 6, W - 12, H - 12)
      .lineWidth(2).strokeColor(BLUE).stroke();

    // Inner subtle border
    doc.rect(12, 12, W - 24, H - 24)
      .lineWidth(0.5).strokeColor(BORDER).stroke();

    // ═════════════════════════════════════════════════════════════════════════
    //  2. RIGHT BLUE SIDEBAR
    // ═════════════════════════════════════════════════════════════════════════

    // Shadow strip
    doc.rect(SIDEBAR_X - 6, 0, 6, H).fillOpacity(0.08).fill(DARK);
    doc.fillOpacity(1);

    // Sidebar gradient
    const ribbonGrad = doc.linearGradient(SIDEBAR_X, 0, W, 0);
    ribbonGrad.stop(0, '#0F2C6E');
    ribbonGrad.stop(0.3, '#1740A8');
    ribbonGrad.stop(0.6, '#2563EB');
    ribbonGrad.stop(1, '#3B7FF5');
    doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).fill(ribbonGrad);

    // Diagonal decorative stripe lines
    const stripePositions = [0.18, 0.38, 0.58, 0.78];
    stripePositions.forEach(pos => {
      const sy = H * pos;
      doc.save();
      doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).clip();
      doc.moveTo(SIDEBAR_X - 40, sy - 20).lineTo(W + 40, sy + 20)
        .lineWidth(8).strokeColor('rgba(255,255,255,0.05)').stroke();
      doc.restore();
    });

    // Vertical divider highlight
    doc.moveTo(SIDEBAR_X, 0).lineTo(SIDEBAR_X, H)
      .lineWidth(0.5).strokeColor('rgba(255,255,255,0.2)').stroke();

    // Corner triangle accent (top-right)
    doc.save();
    doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).clip();
    doc.polygon([W, 0, W - 56, 0, W, 56]).fill(RIB.mid);
    doc.restore();

    // ─────────────────────────────────────────────────────────────────────────
    //  SIDEBAR: Premium Ribbon Sash (course card)
    // ─────────────────────────────────────────────────────────────────────────
    const SASH_MARGIN = 14;          // left/right margin from sidebar edges
    const SASH_X = SIDEBAR_X + SASH_MARGIN;
    const SASH_W = SIDEBAR_W - SASH_MARGIN * 2;
    const SASH_Y = 24;
    const SASH_PAD_H = 14;         // inner padding inside sash
    const SASH_LABEL_H = 14;
    const TAB_W = 10;         // folded tab width
    const TAB_H = 8;

    // Measure course title to estimate sash height
    let coursePt = 20;
    doc.font('Helvetica-Bold');
    while (coursePt > 10 && doc.fontSize(coursePt).widthOfString(courseTitle) > SASH_W - 24) {
      coursePt -= 1;
    }
    const approxLines = Math.ceil(
      doc.fontSize(coursePt).widthOfString(courseTitle) / (SASH_W - 24)
    );
    const SASH_H = SASH_PAD_H + SASH_LABEL_H + (coursePt + 5) * approxLines + SASH_PAD_H;

    // ── Outer gold/ribbon gradient border (2px padding around inner) ──────
    const sashGrad = doc.linearGradient(SASH_X, SASH_Y, SASH_X + SASH_W, SASH_Y + SASH_H);
    sashGrad.stop(0, RIB.dark);
    sashGrad.stop(0.25, RIB.mid);
    sashGrad.stop(0.5, RIB.light);
    sashGrad.stop(0.75, RIB.mid);
    sashGrad.stop(1, RIB.dark);
    doc.roundedRect(SASH_X, SASH_Y, SASH_W, SASH_H, 5).fill(sashGrad);

    // ── Inner blue inset (2px inside) ─────────────────────────────────────
    const INSET = 2;
    doc.roundedRect(SASH_X + INSET, SASH_Y + INSET, SASH_W - INSET * 2, SASH_H - INSET * 2, 4)
      .fill('#1a3a8f');

    // ── Folded ribbon tabs (bottom-left and bottom-right) ─────────────────
    // Left tab triangle
    doc.polygon([
      SASH_X - TAB_W, SASH_Y + SASH_H,
      SASH_X, SASH_Y + SASH_H,
      SASH_X, SASH_Y + SASH_H + TAB_H
    ]).fill(RIB.tab);

    // Right tab triangle
    doc.polygon([
      SASH_X + SASH_W, SASH_Y + SASH_H,
      SASH_X + SASH_W + TAB_W, SASH_Y + SASH_H,
      SASH_X + SASH_W, SASH_Y + SASH_H + TAB_H
    ]).fill(RIB.tab);

    // ── "COURSE" label in ribbon color ────────────────────────────────────
    doc.fontSize(7).font('Helvetica-Bold').fillColor(RIB.light)
      .text('C O U R S E', SASH_X + INSET, SASH_Y + SASH_PAD_H, {
        width: SASH_W - INSET * 2,
        align: 'center',
        characterSpacing: 3
      });

    // ── Course title in white ─────────────────────────────────────────────
    doc.fontSize(coursePt).font('Helvetica-Bold').fillColor(WHITE)
      .text(courseTitle, SASH_X + 12, SASH_Y + SASH_PAD_H + SASH_LABEL_H, {
        width: SASH_W - 24,
        align: 'center',
        lineGap: 4
      });

    // ─────────────────────────────────────────────────────────────────────────
    //  SIDEBAR: Premium Verified Badge (Medallion)
    // ─────────────────────────────────────────────────────────────────────────
    const BADGE_CX = SIDEBAR_X + SIDEBAR_W / 2;
    const BADGE_CY = H / 2 + 16;

    // ── Ray burst halo ────────────────────────────────────────────────────
    const RAY_COUNT = 16;
    const RAY_INNER = 54;
    const RAY_OUTER = 65;
    doc.save();
    for (let i = 0; i < RAY_COUNT; i++) {
      const a1 = (i * 2 * Math.PI) / RAY_COUNT;
      const a2 = ((i + 0.5) * 2 * Math.PI) / RAY_COUNT;
      const a3 = ((i + 1) * 2 * Math.PI) / RAY_COUNT;
      doc.polygon([
        BADGE_CX + Math.cos(a1) * RAY_INNER, BADGE_CY + Math.sin(a1) * RAY_INNER,
        BADGE_CX + Math.cos(a2) * RAY_OUTER, BADGE_CY + Math.sin(a2) * RAY_OUTER,
        BADGE_CX + Math.cos(a3) * RAY_INNER, BADGE_CY + Math.sin(a3) * RAY_INNER,
      ]).fillOpacity(0.2).fill(WHITE);
    }
    doc.restore();
    doc.fillOpacity(1);

    // Outer aura glow
    doc.circle(BADGE_CX, BADGE_CY, 58).fillOpacity(0.07).fill(WHITE);
    doc.fillOpacity(1);

    // Dashed outer ring
    doc.circle(BADGE_CX, BADGE_CY, 52)
      .lineWidth(1).dash(3, { space: 4 }).strokeColor('rgba(255,255,255,0.45)').stroke();
    doc.undash();

    // Thin solid ring
    doc.circle(BADGE_CX, BADGE_CY, 47)
      .lineWidth(0.75).strokeColor('rgba(255,255,255,0.28)').stroke();

    // White outer disc
    doc.circle(BADGE_CX, BADGE_CY, 42).fill(WHITE);

    // Ribbon-colored gradient ring (3px thick stroke simulated with two circles)
    doc.circle(BADGE_CX, BADGE_CY, 42)
      .lineWidth(3.5).strokeColor(RIB.mid).stroke();
    doc.circle(BADGE_CX, BADGE_CY, 39)
      .lineWidth(0.75).strokeColor(RIB.light).stroke();

    // Emerald disc
    doc.circle(BADGE_CX, BADGE_CY, 31).fill(EMERALD);
    doc.circle(BADGE_CX, BADGE_CY, 31)
      .lineWidth(1.5).strokeColor(EMERALD_LT).stroke();

    // Star accent at top of emerald disc
    doc.fontSize(8).font('Helvetica').fillColor('rgba(255,255,255,0.45)')
      .text('*', BADGE_CX - 4, BADGE_CY - 28, { lineBreak: false });

    // Bold checkmark
    doc.moveTo(BADGE_CX - 12, BADGE_CY - 1)
      .lineTo(BADGE_CX - 3, BADGE_CY + 9)
      .lineTo(BADGE_CX + 13, BADGE_CY - 12)
      .lineWidth(3.5).lineCap('round').lineJoin('round')
      .strokeColor(WHITE).stroke();

    // ── VERIFIED pill ribbon below badge ──────────────────────────────────
    const PILL_W = 88;
    const PILL_H = 20;
    const PILL_X = BADGE_CX - PILL_W / 2;
    const PILL_Y = BADGE_CY + 51;

    // Pill outer gradient border
    const pillGrad = doc.linearGradient(PILL_X, PILL_Y, PILL_X + PILL_W, PILL_Y);
    pillGrad.stop(0, RIB.dark);
    pillGrad.stop(0.3, RIB.mid);
    pillGrad.stop(0.5, RIB.light);
    pillGrad.stop(0.7, RIB.mid);
    pillGrad.stop(1, RIB.dark);
    doc.roundedRect(PILL_X, PILL_Y, PILL_W, PILL_H, 10).fill(pillGrad);

    // Pill inner dark inset
    doc.roundedRect(PILL_X + 2, PILL_Y + 2, PILL_W - 4, PILL_H - 4, 9).fill('#1a3a8f');

    // Pill text
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(RIB.light)
      .text('* VERIFIED *', PILL_X, PILL_Y + 7, {
        width: PILL_W,
        align: 'center',
        characterSpacing: 1.5
      });

    // ─────────────────────────────────────────────────────────────────────────
    //  SIDEBAR: Issued date
    // ─────────────────────────────────────────────────────────────────────────
    const rawDate = cert.issueDate ? new Date(cert.issueDate) : new Date();
    const issueDate = rawDate.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const DATE_Y = H - 100;

    doc.moveTo(SIDEBAR_X + 28, DATE_Y - 12).lineTo(W - 28, DATE_Y - 12)
      .lineWidth(0.5).strokeColor('rgba(255,255,255,0.22)').stroke();

    doc.fontSize(8).font('Helvetica-Bold').fillColor('rgba(255,255,255,0.6)')
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

    doc.fontSize(8.5).font('Helvetica').fillColor('rgba(255,255,255,0.4)')
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
    const ICON_SIZE = 48;

    doc.save();
    doc.translate(LX, LY);
    const scale = ICON_SIZE / 40;
    doc.scale(scale);

    const iconGrad = doc.linearGradient(0, 0, 40, 40);
    iconGrad.stop(0, '#1D4ED8').stop(1, '#2563EB');
    doc.roundedRect(0, 0, 40, 40, 10).fill(iconGrad);
    doc.roundedRect(1, 1, 38, 19, 9).fillOpacity(0.06).fill(WHITE);
    doc.fillOpacity(1);
    doc.moveTo(8, 28).bezierCurveTo(13, 21, 17, 25, 32, 10)
      .lineWidth(3).lineCap('round').lineJoin('round').strokeColor(WHITE).stroke();
    doc.moveTo(23.5, 10).lineTo(32, 10).lineTo(32, 18.5)
      .lineWidth(3).lineCap('round').lineJoin('round').strokeColor(WHITE).stroke();
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

    // ── Separator ─────────────────────────────────────────────────────────
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

    // ── "Awarded to" ──────────────────────────────────────────────────────
    doc.fontSize(14).font('Helvetica').fillColor(GRAY_MID)
      .text('Awarded to', LX, CERT_Y + 80, { lineBreak: false });

    // ── Student Name ──────────────────────────────────────────────────────
    const studentName = cert.student?.name || 'Student';
    const NAME_Y = CERT_Y + 104;

    let namePt = 32;
    doc.font('Helvetica-Bold');
    while (namePt > 20 && doc.fontSize(namePt).widthOfString(studentName.toUpperCase()) > CONTENT_W) {
      namePt -= 1;
    }

    doc.fontSize(namePt).font('Helvetica-Bold').fillColor(DARK)
      .text(studentName.toUpperCase(), LX, NAME_Y, { lineBreak: false });

    const NAME_STR_W = Math.min(doc.fontSize(namePt).widthOfString(studentName.toUpperCase()), CONTENT_W);
    const UL_Y = NAME_Y + namePt + 12;

    doc.rect(LX, UL_Y, NAME_STR_W, 3).fill(BLUE);
    doc.rect(LX + NAME_STR_W + 8, UL_Y, CONTENT_W - NAME_STR_W - 8, 1)
      .fillOpacity(0.15).fill(BLUE);
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

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GRAY_LT)
      .text('CERTIFICATE ID', LX, BOTTOM_Y, {
        lineBreak: false,
        characterSpacing: 2
      });

    doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK_MID)
      .text(cert.certificateId, LX, BOTTOM_Y + 16, { lineBreak: false });

    const QR_SIZE = 72;
    const QR_X = SIDEBAR_X - QR_SIZE - 32;
    const QR_Y = H - QR_SIZE - 44;

    doc.rect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 20).fill(WHITE);
    doc.rect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 20)
      .lineWidth(1).strokeColor(BORDER).stroke();

    doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

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