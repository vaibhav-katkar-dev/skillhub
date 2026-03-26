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
    const RIB = RIBBON_THEMES[dynamicTheme] || RIBBON_THEMES.gold;

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

    // ── Subtle Premium Watermark (Left Area Only) ──
    doc.save();
    doc.rect(12, 12, SIDEBAR_X - 12, H - 24).clip();
    doc.fontSize(100).font('Helvetica-Bold').fillOpacity(0.015).fill(DARK);
    doc.rotate(-35, { origin: [W / 2 - 100, H / 2] });
    // Draw pattern of watermarks
    ['SKILLVALIX', 'SKILLVALIX', 'SKILLVALIX'].forEach((txt, i) => {
      doc.text(txt, W / 2 - 500 + i * 150, H / 2 - 300 + i * 280, { lineBreak: false });
    });
    doc.restore();
    doc.fillOpacity(1);

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

    // Premium Sparkle Accents (replacing old diagonal lines)
    doc.save();
    doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).clip();

    // Tiny floating magic dots
    const dots = [
      { x: 30, y: 0.2 }, { x: 80, y: 0.3 }, { x: 140, y: 0.1 },
      { x: 50, y: 0.5 }, { x: 190, y: 0.45 }, { x: 160, y: 0.7 },
      { x: 20, y: 0.75 }, { x: 100, y: 0.95 }, { x: 180, y: 0.85 },
      { x: 140, y: 1.05 } // slightly off bottom
    ];
    dots.forEach(d => doc.circle(SIDEBAR_X + d.x, H * d.y, 1.2).fillOpacity(0.25).fill(WHITE));

    // Dynamic concave star sparkles
    const sparkles = [
      { x: SIDEBAR_X + 40, y: H * 0.15, size: 8, opacity: 0.4 },
      { x: SIDEBAR_X + SIDEBAR_W - 30, y: H * 0.30, size: 5, opacity: 0.6 },
      { x: SIDEBAR_X + 25, y: H * 0.48, size: 5, opacity: 0.35 },
      { x: SIDEBAR_X + SIDEBAR_W - 55, y: H * 0.65, size: 10, opacity: 0.5 },
      { x: SIDEBAR_X + 60, y: H * 0.82, size: 7, opacity: 0.4 },
      { x: SIDEBAR_X + SIDEBAR_W - 25, y: H * 0.94, size: 4, opacity: 0.7 }
    ];

    sparkles.forEach(sp => {
      doc.save();
      doc.translate(sp.x, sp.y);
      doc.moveTo(0, -sp.size);
      doc.quadraticCurveTo(0, 0, sp.size, 0);
      doc.quadraticCurveTo(0, 0, 0, sp.size);
      doc.quadraticCurveTo(0, 0, -sp.size, 0);
      doc.quadraticCurveTo(0, 0, 0, -sp.size);
      doc.fillOpacity(sp.opacity).fill(WHITE);
      // Soft glowing center for the sparkle
      doc.circle(0, 0, sp.size * 0.18).fillOpacity(Math.min(1, sp.opacity + 0.3)).fill(WHITE);
      doc.restore();
    });

    doc.restore();

    // Vertical divider highlight
    doc.moveTo(SIDEBAR_X, 0).lineTo(SIDEBAR_X, H)
      .lineWidth(0.5).strokeColor('rgba(255,255,255,0.2)').stroke();

    // ─────────────────────────────────────────────────────────────────────────
    //  SIDEBAR: Classic Premium Ribbon Card (Course Name)
    // ─────────────────────────────────────────────────────────────────────────
    // Start with a slightly smaller baseline for a more elegant, less heavy look
    let coursePt = 22;
    doc.font('Helvetica-Bold');

    // The main badge width
    const CARD_W = SIDEBAR_W - 32;
    const CARD_X = SIDEBAR_X + 16;
    // Tighter line-height (lineGap: 2) for luxury density
    const textOptions = { width: CARD_W - 24, align: 'center', lineGap: 2 };

    // Intelligently scale down text so it fits securely (ensures max 3 lines)
    const words = courseTitle.split(' ');
    while (coursePt > 10) {
      doc.fontSize(coursePt);
      let wordOverflow = false;
      for (const w of words) {
        if (doc.widthOfString(w) > CARD_W - 24) {
          wordOverflow = true;
          break;
        }
      }
      // Tighter height check due to tighter lineGap, roughly 85px max for 3 lines of 22pt
      if (!wordOverflow && doc.heightOfString(courseTitle, textOptions) <= 85) {
        break;
      }
      coursePt -= 1;
    }

    // Precisely calculate the required dynamic card height
    const textHeight = doc.heightOfString(courseTitle, textOptions);
    const CARD_Y = 36;
    // Adding +2px extra inside the top padding to push label/title completely independent of border
    const CARD_H = 62 + textHeight;
    const TAIL_W = 14;              // How far tails stick out
    const TAIL_OFFSET_Y = 16;       // Drop down for the tail fold look
    const NOTCH = 8;                // V-cut depth

    doc.save();

    // 1. Left and Right folded Ribbon Tails (shadow color)
    // Left tail
    doc.polygon([
      CARD_X + 10, CARD_Y + TAIL_OFFSET_Y,
      CARD_X - TAIL_W, CARD_Y + TAIL_OFFSET_Y,
      CARD_X - TAIL_W + NOTCH, CARD_Y + TAIL_OFFSET_Y + (CARD_H / 2),
      CARD_X - TAIL_W, CARD_Y + CARD_H + TAIL_OFFSET_Y,
      CARD_X + 10, CARD_Y + CARD_H + TAIL_OFFSET_Y
    ]).fill(RIB.tab);

    // Right tail
    doc.polygon([
      CARD_X + CARD_W - 10, CARD_Y + TAIL_OFFSET_Y,
      CARD_X + CARD_W + TAIL_W, CARD_Y + TAIL_OFFSET_Y,
      CARD_X + CARD_W + TAIL_W - NOTCH, CARD_Y + TAIL_OFFSET_Y + (CARD_H / 2),
      CARD_X + CARD_W + TAIL_W, CARD_Y + CARD_H + TAIL_OFFSET_Y,
      CARD_X + CARD_W - 10, CARD_Y + CARD_H + TAIL_OFFSET_Y
    ]).fill(RIB.tab);

    // Dark fold triangle shadows (where tail tucks under the main card)
    doc.polygon([
      CARD_X, CARD_Y + CARD_H,
      CARD_X + 10, CARD_Y + CARD_H,
      CARD_X + 10, CARD_Y + CARD_H + TAIL_OFFSET_Y
    ]).fillOpacity(0.4).fill('#000000');

    doc.polygon([
      CARD_X + CARD_W, CARD_Y + CARD_H,
      CARD_X + CARD_W - 10, CARD_Y + CARD_H,
      CARD_X + CARD_W - 10, CARD_Y + CARD_H + TAIL_OFFSET_Y
    ]).fillOpacity(0.4).fill('#000000');
    doc.fillOpacity(1);

    // 2. Drop shadow for the main card
    doc.roundedRect(CARD_X, CARD_Y + 5, CARD_W, CARD_H, 6)
      .fillOpacity(0.15).fill(DARK);
    doc.fillOpacity(1);

    // 3. Main Premium Card Background
    const cardGrad = doc.linearGradient(CARD_X, CARD_Y, CARD_X + CARD_W, CARD_Y + CARD_H);
    cardGrad.stop(0, RIB.dark);
    cardGrad.stop(0.3, RIB.mid);
    cardGrad.stop(0.7, RIB.light);
    cardGrad.stop(1, RIB.dark);
    doc.roundedRect(CARD_X, CARD_Y, CARD_W, CARD_H, 6).fill(cardGrad);

    // Elegant inner deep blue plate for popping text
    const INSET = 4;
    doc.roundedRect(CARD_X + INSET, CARD_Y + INSET, CARD_W - INSET * 2, CARD_H - INSET * 2, 4)
      .fill('#0D225C');

    // Shiny gold/theme rim line inside
    doc.roundedRect(CARD_X + INSET, CARD_Y + INSET, CARD_W - INSET * 2, CARD_H - INSET * 2, 4)
      .lineWidth(0.75).strokeColor(RIB.light).stroke();

    // 4. "COURSE" label
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(RIB.light)
      .text('COURSE', CARD_X, CARD_Y + 20, {
        width: CARD_W,
        align: 'center',
        characterSpacing: 4
      });

    // 5. Bold Course Title
    doc.fontSize(coursePt).font('Helvetica-Bold').fillColor(WHITE)
      .text(courseTitle, CARD_X + 12, CARD_Y + 44, {
        width: CARD_W - 24,
        align: 'center',
        lineGap: 2
      });

    doc.restore();

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
    // Subtle gap decoration between pill and date (✦ ✦ ✦)
    // ─────────────────────────────────────────────────────────────────────────
    const DATE_Y = H - 100;
    const pillBottomY = PILL_Y + PILL_H;
    const dateLineY = DATE_Y - 12;
    const gapCenterY = (pillBottomY + dateLineY) / 2;

    doc.fontSize(8.5).font('Helvetica').fillOpacity(0.25).fill(WHITE)
      .text('✦  ✦  ✦', SIDEBAR_X, gapCenterY - 4, {
        width: SIDEBAR_W,
        align: 'center',
        characterSpacing: 4
      });
    doc.fillOpacity(1);

    // ─────────────────────────────────────────────────────────────────────────
    //  SIDEBAR: Issued date
    // ─────────────────────────────────────────────────────────────────────────
    const rawDate = cert.issueDate ? new Date(cert.issueDate) : new Date();
    const issueDate = rawDate.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

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
    const LY = 40;
    const LOGO_SCALE = 60 / 270;

    doc.save();
    doc.translate(LX, LY);
    doc.scale(LOGO_SCALE);

    // 1. MAIN RING
    doc.circle(148, 138, 70).lineWidth(11).strokeColor('#5a5a5a').stroke();

    // 2. INNER BARS WITH CLIP
    doc.save();
    doc.circle(148, 138, 63).clip();
    doc.roundedRect(105, 166, 17, 26, 3.5).fill('#1D4ED8');
    doc.roundedRect(128, 150, 17, 42, 3.5).fill('#2563EB');
    doc.roundedRect(151, 132, 17, 60, 3.5).fill('#3B82F6');
    doc.roundedRect(174, 112, 17, 80, 3.5).fill('#16A34A');
    doc.restore();

    // 3. BASELINE
    doc.moveTo(98, 193).lineTo(198, 193)
       .lineWidth(1.5).lineCap('round').strokeColor('#5a5a5a').stroke();

    // 4. TICK BADGE
    doc.circle(197, 80, 26).fill('#16A34A');
    doc.moveTo(183, 78).lineTo(194, 91).lineTo(213, 63)
       .lineWidth(5).lineCap('round').lineJoin('round').strokeColor('#FFFFFF').stroke();

    // 5. WORDMARK TEXT
    doc.font('Helvetica-Bold');
    doc.fontSize(72); 
    doc.fillColor('#111827').text('Skill', 245, 75, { lineBreak: false, continued: true, characterSpacing: -2 })
       .fillColor('#2563EB').text('valix', { lineBreak: false, characterSpacing: -2 });

    // Underline
    doc.moveTo(245, 155).lineTo(520, 155).lineWidth(0.8).strokeOpacity(0.35).strokeColor('#d1d5db').stroke();
    doc.strokeOpacity(1);

    // Tagline
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#9ca3af')
       .text('LEARN  ·  VALIDATE  ·  GROW', 245, 170, { lineBreak: false, characterSpacing: 3 });

    doc.restore();

    // ── Separator ─────────────────────────────────────────────────────────
    const SEP_Y = LY + 60 + 24;
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

    // ── Single Premium Paragraph ───────────────────────────────────────────
    const PARA_Y = COURSE_Y + 64;
    doc.fontSize(12).font('Helvetica').fillColor(GRAY)
      .text(
        'This certificate is proudly awarded in recognition of the outstanding performance, dedication, and practical professional skills demonstrated throughout the curriculum.',
        LX, PARA_Y,
        { width: CONTENT_W, lineGap: 6, align: 'left' }
      );

    // ═════════════════════════════════════════════════════════════════════════
    //  4. BOTTOM ROW: Cert ID + QR
    // ═════════════════════════════════════════════════════════════════════════
    const BOTTOM_Y = H - 72; // Pulled down for tighter balance (<= 60px from bottom edge)

    // Calculate vertical center of the bottom row (approx 36px tall block)
    const ROW_CY = BOTTOM_Y + 16;

    // ── Certificate ID ──
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GRAY_LT)
      .text('CERTIFICATE ID', LX, BOTTOM_Y, {
        lineBreak: false,
        characterSpacing: 2
      });

    doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK_MID)
      .text(cert.certificateId, LX, BOTTOM_Y + 16, { lineBreak: false });

    // ── QR Code ──
    const QR_SIZE = 72;
    const QR_X = SIDEBAR_X - QR_SIZE - 32;
    const QR_Y = H - QR_SIZE - 44;

    // ── 0.5px Vertical Divider ──
    // Placed horizontally exactly centered between ID block and QR card start
    const DIVIDER_X = LX + (QR_X - 10 - LX) / 2;
    doc.moveTo(DIVIDER_X, ROW_CY - 20)
      .lineTo(DIVIDER_X, ROW_CY + 20)
      .lineWidth(0.5).strokeColor('#CBD5E1').stroke();

    // White card background behind QR
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