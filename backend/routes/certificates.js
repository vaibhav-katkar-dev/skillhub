import express from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../middleware/auth.js';
import { getCourseFromJSON, getAllCoursesFromJSON } from '../utils/courseData.js';

const router = express.Router();

const MAX_CONCURRENT_PDF_GENERATIONS = 4;              // allow a few parallel jobs
const PDF_RETRY_AFTER_SECONDS = 5;                     // faster client retry hint
const PDF_GENERATION_STALE_MS = 2 * 60 * 1000;
const DOWNLOAD_WAIT_MS = 15000;                        // wait up to 15s before giving up
const DOWNLOAD_WAIT_POLL_MS = 400;

let activePdfGenerations = 0;
const pdfGenerationQueue = [];
const queuedCertificateIds = new Set();

function hasStoredPdf(cert) {
  if (!cert) return false;
  if ('pdfBuffer' in cert) {
    const raw = cert.pdfBuffer?.buffer || cert.pdfBuffer;
    return Buffer.isBuffer(raw) && raw.length > 0;
  }
  return Number(cert.pdfSizeBytes || 0) > 0;
}

function isPdfReady(cert) {
  return cert?.pdfStatus === 'ready' && hasStoredPdf(cert);
}

function normalizeId(value) {
  let current = value;
  let depth = 0;

  while (current && depth < 5) {
    if (typeof current === 'string') return current;
    if (typeof current.toHexString === 'function') return current.toHexString();
    if (typeof current === 'object') {
      if ('_id' in current && current._id && current._id !== current) {
        current = current._id;
        depth += 1;
        continue;
      }
      if (typeof current.toString === 'function') {
        try {
          const str = current.toString();
          return str && str !== '[object Object]' ? str : null;
        } catch (err) {
          return null; // Prevent stack overflows if toString fails
        }
      }
    }
    break;
  }

  return null;
}

async function resolveCourseTitle(courseOrId, fallbackTitle = '') {
  const idStr = normalizeId(courseOrId);
  if (idStr) {
    const jsonCourse = await getCourseFromJSON(idStr);
    if (jsonCourse?.title) return jsonCourse.title;
  }
  return fallbackTitle || null;
}

function canAccessCertificate(user, cert) {
  if (!user || !cert) return false;
  if (user.role === 'admin') return true;
  return normalizeId(cert.student) === normalizeId(user.id);
}

async function loadCertificateForRendering(certificateId, includePdfBuffer = false) {
  let query = Certificate.findOne({ certificateId }).populate('student', 'name').lean();
  if (includePdfBuffer) query = query.select('+pdfBuffer');
  return query;
}

// ─── Ribbon color themes ────────────────────────────────────────────────────
const RIBBON_THEMES = {
  gold:    { dark: '#92400E', mid: '#F59E0B', light: '#FDE68A', tab: '#78350F' },
  purple:  { dark: '#4C1D95', mid: '#7C3AED', light: '#C4B5FD', tab: '#4C1D95' },
  teal:    { dark: '#164E63', mid: '#0E7490', light: '#67E8F9', tab: '#164E63' },
  ruby:    { dark: '#7F1D1D', mid: '#B91C1C', light: '#FCA5A5', tab: '#7F1D1D' },
  blue:    { dark: '#1E3A8A', mid: '#2563EB', light: '#93C5FD', tab: '#1E3A8A' },
  emerald: { dark: '#134E4A', mid: '#0F766E', light: '#5EEAD4', tab: '#134E4A' },
};

function buildCertificatePdfBuffer({ studentName, courseTitle, certificateId, issueDate, verifyUrl, ribbonTheme = 'blue' }) {
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

      // ── PALETTE ──────────────────────────────────────────────────────────
      const BLUE = '#2563EB', WHITE = '#FFFFFF', OFF_WHITE = '#F8FAFC';
      const DARK = '#0F172A', DARK_MID = '#1E293B';
      const GRAY = '#475569', GRAY_MID = '#64748B', GRAY_LT = '#94A3B8';
      const BORDER = '#CBD5E1', EMERALD = '#059669', EMERALD_LT = '#34D399';
      const RIB = RIBBON_THEMES[ribbonTheme] || RIBBON_THEMES.blue;

      // ── LAYOUT ───────────────────────────────────────────────────────────
      const SIDEBAR_W = 220, SIDEBAR_X = W - SIDEBAR_W;
      const LEFT_PAD = 64, CONTENT_W = SIDEBAR_X - LEFT_PAD - 40;

      // ── 1. BACKGROUND ────────────────────────────────────────────────────
      doc.rect(0, 0, W, H).fill(OFF_WHITE);
      doc.rect(6, 6, W - 12, H - 12).lineWidth(2).strokeColor(BLUE).stroke();
      doc.rect(12, 12, W - 24, H - 24).lineWidth(0.5).strokeColor(BORDER).stroke();

      // Watermark
      doc.save();
      doc.rect(12, 12, SIDEBAR_X - 12, H - 24).clip();
      doc.fontSize(100).font('Helvetica-Bold').fillOpacity(0.015).fill(DARK);
      doc.rotate(-35, { origin: [W / 2 - 100, H / 2] });
      ['SKILLVALIX', 'SKILLVALIX', 'SKILLVALIX'].forEach((txt, i) => {
        doc.text(txt, W / 2 - 500 + i * 150, H / 2 - 300 + i * 280, { lineBreak: false });
      });
      doc.restore();
      doc.fillOpacity(1);

      // ── 2. RIGHT BLUE SIDEBAR ─────────────────────────────────────────────
      doc.rect(SIDEBAR_X - 6, 0, 6, H).fillOpacity(0.08).fill(DARK);
      doc.fillOpacity(1);
      const ribbonGrad = doc.linearGradient(SIDEBAR_X, 0, W, 0);
      ribbonGrad.stop(0, '#0F2C6E'); ribbonGrad.stop(0.3, '#1740A8');
      ribbonGrad.stop(0.6, '#2563EB'); ribbonGrad.stop(1, '#3B7FF5');
      doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).fill(ribbonGrad);

      // Sparkle dots
      doc.save();
      doc.rect(SIDEBAR_X, 0, SIDEBAR_W, H).clip();
      [{ x: 30, y: 0.2 }, { x: 80, y: 0.3 }, { x: 140, y: 0.1 }, { x: 50, y: 0.5 },
       { x: 190, y: 0.45 }, { x: 160, y: 0.7 }, { x: 20, y: 0.75 }, { x: 100, y: 0.95 },
       { x: 180, y: 0.85 }].forEach(d => doc.circle(SIDEBAR_X + d.x, H * d.y, 1.2).fillOpacity(0.25).fill(WHITE));

      [{ x: SIDEBAR_X + 40, y: H * 0.15, size: 8, opacity: 0.4 },
       { x: SIDEBAR_X + SIDEBAR_W - 30, y: H * 0.30, size: 5, opacity: 0.6 },
       { x: SIDEBAR_X + 25, y: H * 0.48, size: 5, opacity: 0.35 },
       { x: SIDEBAR_X + SIDEBAR_W - 55, y: H * 0.65, size: 10, opacity: 0.5 },
       { x: SIDEBAR_X + 60, y: H * 0.82, size: 7, opacity: 0.4 },
       { x: SIDEBAR_X + SIDEBAR_W - 25, y: H * 0.94, size: 4, opacity: 0.7 }].forEach(sp => {
        doc.save();
        doc.translate(sp.x, sp.y);
        doc.moveTo(0, -sp.size).quadraticCurveTo(0, 0, sp.size, 0)
           .quadraticCurveTo(0, 0, 0, sp.size).quadraticCurveTo(0, 0, -sp.size, 0)
           .quadraticCurveTo(0, 0, 0, -sp.size).fillOpacity(sp.opacity).fill(WHITE);
        doc.circle(0, 0, sp.size * 0.18).fillOpacity(Math.min(1, sp.opacity + 0.3)).fill(WHITE);
        doc.restore();
      });
      doc.restore();
      doc.moveTo(SIDEBAR_X, 0).lineTo(SIDEBAR_X, H).lineWidth(0.5).strokeColor('rgba(255,255,255,0.2)').stroke();

      // ── SIDEBAR: Ribbon Course Card ───────────────────────────────────────
      let coursePt = 22;
      doc.font('Helvetica-Bold');
      const CARD_W = SIDEBAR_W - 32, CARD_X = SIDEBAR_X + 16;
      const textOptions = { width: CARD_W - 24, align: 'center', lineGap: 2 };
      const words = courseTitle.split(' ');
      while (coursePt > 10) {
        doc.fontSize(coursePt);
        let wordOverflow = false;
        for (const w of words) { if (doc.widthOfString(w) > CARD_W - 24) { wordOverflow = true; break; } }
        if (!wordOverflow && doc.heightOfString(courseTitle, textOptions) <= 85) break;
        coursePt -= 1;
      }
      const textHeight = doc.heightOfString(courseTitle, textOptions);
      const CARD_Y = 36, CARD_H = 62 + textHeight;
      const TAIL_W = 14, TAIL_OFFSET_Y = 16, NOTCH = 8;

      doc.save();
      // Left tail
      doc.polygon([CARD_X + 10, CARD_Y + TAIL_OFFSET_Y, CARD_X - TAIL_W, CARD_Y + TAIL_OFFSET_Y,
        CARD_X - TAIL_W + NOTCH, CARD_Y + TAIL_OFFSET_Y + CARD_H / 2,
        CARD_X - TAIL_W, CARD_Y + CARD_H + TAIL_OFFSET_Y, CARD_X + 10, CARD_Y + CARD_H + TAIL_OFFSET_Y]).fill(RIB.tab);
      // Right tail
      doc.polygon([CARD_X + CARD_W - 10, CARD_Y + TAIL_OFFSET_Y, CARD_X + CARD_W + TAIL_W, CARD_Y + TAIL_OFFSET_Y,
        CARD_X + CARD_W + TAIL_W - NOTCH, CARD_Y + TAIL_OFFSET_Y + CARD_H / 2,
        CARD_X + CARD_W + TAIL_W, CARD_Y + CARD_H + TAIL_OFFSET_Y, CARD_X + CARD_W - 10, CARD_Y + CARD_H + TAIL_OFFSET_Y]).fill(RIB.tab);
      // Shadow triangles
      doc.polygon([CARD_X, CARD_Y + CARD_H, CARD_X + 10, CARD_Y + CARD_H, CARD_X + 10, CARD_Y + CARD_H + TAIL_OFFSET_Y]).fillOpacity(0.4).fill('#000000');
      doc.polygon([CARD_X + CARD_W, CARD_Y + CARD_H, CARD_X + CARD_W - 10, CARD_Y + CARD_H, CARD_X + CARD_W - 10, CARD_Y + CARD_H + TAIL_OFFSET_Y]).fillOpacity(0.4).fill('#000000');
      doc.fillOpacity(1);
      // Drop shadow
      doc.roundedRect(CARD_X, CARD_Y + 5, CARD_W, CARD_H, 6).fillOpacity(0.15).fill(DARK);
      doc.fillOpacity(1);
      // Card gradient
      const cardGrad = doc.linearGradient(CARD_X, CARD_Y, CARD_X + CARD_W, CARD_Y + CARD_H);
      cardGrad.stop(0, RIB.dark); cardGrad.stop(0.3, RIB.mid); cardGrad.stop(0.7, RIB.light); cardGrad.stop(1, RIB.dark);
      doc.roundedRect(CARD_X, CARD_Y, CARD_W, CARD_H, 6).fill(cardGrad);
      const INSET = 4;
      doc.roundedRect(CARD_X + INSET, CARD_Y + INSET, CARD_W - INSET * 2, CARD_H - INSET * 2, 4).fill('#0D225C');
      doc.roundedRect(CARD_X + INSET, CARD_Y + INSET, CARD_W - INSET * 2, CARD_H - INSET * 2, 4).lineWidth(0.75).strokeColor(RIB.light).stroke();
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(RIB.light).text('COURSE', CARD_X, CARD_Y + 20, { width: CARD_W, align: 'center', characterSpacing: 4 });
      doc.fontSize(coursePt).font('Helvetica-Bold').fillColor(WHITE).text(courseTitle, CARD_X + 12, CARD_Y + 44, { width: CARD_W - 24, align: 'center', lineGap: 2 });
      doc.restore();

      // ── SIDEBAR: Verified Badge ───────────────────────────────────────────
      const BADGE_CX = SIDEBAR_X + SIDEBAR_W / 2, BADGE_CY = H / 2 + 16;
      const RAY_COUNT = 16, RAY_INNER = 54, RAY_OUTER = 65;
      doc.save();
      for (let i = 0; i < RAY_COUNT; i++) {
        const a1 = (i * 2 * Math.PI) / RAY_COUNT, a2 = ((i + 0.5) * 2 * Math.PI) / RAY_COUNT, a3 = ((i + 1) * 2 * Math.PI) / RAY_COUNT;
        doc.polygon([BADGE_CX + Math.cos(a1) * RAY_INNER, BADGE_CY + Math.sin(a1) * RAY_INNER, BADGE_CX + Math.cos(a2) * RAY_OUTER, BADGE_CY + Math.sin(a2) * RAY_OUTER, BADGE_CX + Math.cos(a3) * RAY_INNER, BADGE_CY + Math.sin(a3) * RAY_INNER]).fillOpacity(0.2).fill(WHITE);
      }
      doc.restore();
      doc.fillOpacity(1);
      doc.circle(BADGE_CX, BADGE_CY, 58).fillOpacity(0.07).fill(WHITE); doc.fillOpacity(1);
      doc.circle(BADGE_CX, BADGE_CY, 52).lineWidth(1).dash(3, { space: 4 }).strokeColor('rgba(255,255,255,0.45)').stroke(); doc.undash();
      doc.circle(BADGE_CX, BADGE_CY, 47).lineWidth(0.75).strokeColor('rgba(255,255,255,0.28)').stroke();
      doc.circle(BADGE_CX, BADGE_CY, 42).fill(WHITE);
      doc.circle(BADGE_CX, BADGE_CY, 42).lineWidth(3.5).strokeColor(RIB.mid).stroke();
      doc.circle(BADGE_CX, BADGE_CY, 39).lineWidth(0.75).strokeColor(RIB.light).stroke();
      doc.circle(BADGE_CX, BADGE_CY, 31).fill(EMERALD);
      doc.circle(BADGE_CX, BADGE_CY, 31).lineWidth(1.5).strokeColor(EMERALD_LT).stroke();
      doc.moveTo(BADGE_CX - 12, BADGE_CY - 1).lineTo(BADGE_CX - 3, BADGE_CY + 9).lineTo(BADGE_CX + 13, BADGE_CY - 12).lineWidth(3.5).lineCap('round').lineJoin('round').strokeColor(WHITE).stroke();
      // Verified pill
      const PILL_W = 88, PILL_H = 20, PILL_X = BADGE_CX - PILL_W / 2, PILL_Y = BADGE_CY + 51;
      const pillGrad = doc.linearGradient(PILL_X, PILL_Y, PILL_X + PILL_W, PILL_Y);
      pillGrad.stop(0, RIB.dark); pillGrad.stop(0.3, RIB.mid); pillGrad.stop(0.5, RIB.light); pillGrad.stop(0.7, RIB.mid); pillGrad.stop(1, RIB.dark);
      doc.roundedRect(PILL_X, PILL_Y, PILL_W, PILL_H, 10).fill(pillGrad);
      doc.roundedRect(PILL_X + 2, PILL_Y + 2, PILL_W - 4, PILL_H - 4, 9).fill('#1a3a8f');
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor(RIB.light).text('* VERIFIED *', PILL_X, PILL_Y + 7, { width: PILL_W, align: 'center', characterSpacing: 1.5 });

      // ── SIDEBAR: Issue Date ───────────────────────────────────────────────
      const DATE_Y = H - 100;
      doc.moveTo(SIDEBAR_X + 28, DATE_Y - 12).lineTo(W - 28, DATE_Y - 12).lineWidth(0.5).strokeColor('rgba(255,255,255,0.22)').stroke();
      doc.fontSize(8).font('Helvetica-Bold').fillColor('rgba(255,255,255,0.6)').text('ISSUED ON', SIDEBAR_X, DATE_Y, { width: SIDEBAR_W, align: 'center', characterSpacing: 2 });
      doc.fontSize(13).font('Helvetica-Bold').fillColor(WHITE).text(issueDate, SIDEBAR_X, DATE_Y + 16, { width: SIDEBAR_W, align: 'center' });
      doc.fontSize(8.5).font('Helvetica').fillColor('rgba(255,255,255,0.4)').text('skillvalix.com', SIDEBAR_X, H - 36, { width: SIDEBAR_W, align: 'center' });

      // ── 3. LEFT CONTENT ───────────────────────────────────────────────────
      const LX = LEFT_PAD, LY = 28, LOGO_SCALE = 110 / 270;
      doc.save();
      doc.translate(LX, LY);
      doc.scale(LOGO_SCALE);
      doc.circle(148, 138, 70).fill('#2563EB');
      doc.circle(148, 138, 70).lineWidth(2).strokeColor('#93C5FD').stroke();
      doc.circle(132, 122, 20).fillOpacity(0.12).fill('#FFFFFF'); doc.fillOpacity(1);
      doc.save();
      doc.circle(148, 138, 63).clip();
      doc.roundedRect(105, 166, 17, 26, 3.5).fillOpacity(0.55).fill('#FFFFFF');
      doc.roundedRect(128, 150, 17, 42, 3.5).fillOpacity(0.72).fill('#FFFFFF');
      doc.roundedRect(151, 132, 17, 60, 3.5).fillOpacity(0.88).fill('#FFFFFF');
      doc.roundedRect(174, 112, 17, 80, 3.5).fillOpacity(1).fill('#FFFFFF');
      doc.roundedRect(105, 166, 17, 4, 2).fillOpacity(0.35).fill('#FFFFFF');
      doc.roundedRect(128, 150, 17, 4, 2).fillOpacity(0.35).fill('#FFFFFF');
      doc.roundedRect(151, 132, 17, 4, 2).fillOpacity(0.35).fill('#FFFFFF');
      doc.roundedRect(174, 112, 17, 4, 2).fillOpacity(0.35).fill('#FFFFFF');
      doc.fillOpacity(1);
      doc.restore();
      doc.moveTo(98, 193).lineTo(198, 193).lineWidth(1.5).lineCap('round').strokeColor('#FFFFFF').strokeOpacity(0.3).stroke(); doc.strokeOpacity(1);
      doc.circle(197, 80, 26).fill('#16A34A');
      doc.circle(197, 80, 26).lineWidth(1.2).strokeColor('#86EFAC').stroke();
      doc.moveTo(183, 78).lineTo(194, 91).lineTo(213, 63).lineWidth(5).lineCap('round').lineJoin('round').strokeColor('#FFFFFF').stroke();
      doc.font('Helvetica-Bold').fontSize(72);
      doc.fillColor('#111827').text('Skill', 245, 75, { lineBreak: false, continued: true, characterSpacing: -2 }).fillColor('#2563EB').text('valix', { lineBreak: false, characterSpacing: -2 });
      doc.moveTo(245, 155).lineTo(580, 155).lineWidth(1.2).strokeOpacity(0.3).strokeColor('#d1d5db').stroke(); doc.strokeOpacity(1);
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#9ca3af').text('LEARN  \xB7  VALIDATE  \xB7  GROW', 245, 172, { lineBreak: false, characterSpacing: 3.5 });
      doc.restore();

      // Separator
      const SEP_Y = LY + 90 + 16;
      doc.moveTo(LX, SEP_Y).lineTo(SIDEBAR_X - 40, SEP_Y).lineWidth(0.5).strokeColor(BORDER).stroke();

      // Certificate heading
      const CERT_Y = SEP_Y + 40;
      doc.fontSize(11).font('Helvetica-Bold').fillColor(BLUE).text('C E R T I F I C A T E', LX, CERT_Y, { lineBreak: false, characterSpacing: 4 });
      doc.fontSize(38).font('Helvetica-Bold').fillColor(DARK).text('OF COMPLETION', LX, CERT_Y + 18, { lineBreak: false });
      doc.fontSize(14).font('Helvetica').fillColor(GRAY_MID).text('Awarded to', LX, CERT_Y + 80, { lineBreak: false });

      // Student name
      const NAME_Y = CERT_Y + 104;
      let namePt = 32;
      doc.font('Helvetica-Bold');
      while (namePt > 20 && doc.fontSize(namePt).widthOfString(String(studentName || 'Student').toUpperCase()) > CONTENT_W) namePt -= 1;
      doc.fontSize(namePt).font('Helvetica-Bold').fillColor(DARK).text(String(studentName || 'Student').toUpperCase(), LX, NAME_Y, { lineBreak: false });
      const NAME_STR_W = Math.min(doc.fontSize(namePt).widthOfString(String(studentName || 'Student').toUpperCase()), CONTENT_W);
      const UL_Y = NAME_Y + namePt + 12;
      doc.rect(LX, UL_Y, NAME_STR_W, 3).fill(BLUE);
      doc.rect(LX + NAME_STR_W + 8, UL_Y, CONTENT_W - NAME_STR_W - 8, 1).fillOpacity(0.15).fill(BLUE); doc.fillOpacity(1);

      // Course line
      const COURSE_Y = UL_Y + 36;
      doc.fontSize(13).font('Helvetica').fillColor(GRAY).text('for successfully completing the online learning course:', LX, COURSE_Y, { lineBreak: false });
      doc.fontSize(18).font('Helvetica-Bold').fillColor(DARK_MID).text(courseTitle, LX, COURSE_Y + 24, { lineBreak: false });

      // Description paragraph
      const PARA_Y = COURSE_Y + 64;
      doc.fontSize(12).font('Helvetica').fillColor(GRAY).text('This certificate is proudly awarded in recognition of the outstanding performance, dedication, and practical professional skills demonstrated throughout the curriculum.', LX, PARA_Y, { width: CONTENT_W, lineGap: 6, align: 'left' });

      // ── Bottom row: Cert ID + QR ───────────────────────────────────────────
      const BOTTOM_Y = H - 72, QR_SIZE = 72;
      const QR_X = SIDEBAR_X - QR_SIZE - 32, QR_Y = H - QR_SIZE - 44;
      const ISSUED_Y = BOTTOM_Y + 40, LEFT_W = QR_X - 20 - LX;

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(GRAY_LT).text('CERTIFICATE ID', LX, BOTTOM_Y, { width: LEFT_W, lineBreak: false, characterSpacing: 2 });
      doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK_MID).text(certificateId, LX, BOTTOM_Y + 16, { width: LEFT_W, lineBreak: false });
      doc.moveTo(LX, ISSUED_Y - 8).lineTo(LX + LEFT_W, ISSUED_Y - 8).lineWidth(0.3).strokeColor(BORDER).stroke();
      doc.fontSize(9).font('Helvetica').fillColor(GRAY_MID).text('Issued by Skillvalix  \xB7  MSME Registered', LX, ISSUED_Y, { width: LEFT_W, align: 'left', lineBreak: false, characterSpacing: 0.5 });

      // QR panel
      doc.rect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 20).fill(WHITE);
      doc.rect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 20).lineWidth(1).strokeColor(BORDER).stroke();
      doc.image(qrBuffer, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });
      const QR_CARD_BOTTOM = QR_Y + QR_SIZE + 10;
      doc.moveTo(QR_X - 10, QR_CARD_BOTTOM + 6).lineTo(QR_X + QR_SIZE + 10, QR_CARD_BOTTOM + 6).lineWidth(0.3).strokeColor(BORDER).stroke();
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor(GRAY_LT).text('SCAN TO VERIFY', QR_X - 10, QR_CARD_BOTTOM + 10, { width: QR_SIZE + 20, align: 'center', characterSpacing: 1, lineBreak: false });

      doc.end();
    } catch (err) {
      doc.destroy();
      reject(err);
    }
  });
}

async function prepareCertificatePdf(certificateId) {
  const staleBefore = new Date(Date.now() - PDF_GENERATION_STALE_MS);

  let cert = await Certificate.findOne({ certificateId }).select('certificateId pdfStatus pdfRequestedAt pdfSizeBytes').lean();
  if (!cert) return { status: 'missing' };
  if (isPdfReady(cert)) return { status: 'ready' };

  const lockedCert = await Certificate.findOneAndUpdate(
    {
      certificateId,
      $or: [
        { pdfStatus: { $in: ['pending', 'queued', 'failed'] } },
        { pdfStatus: { $exists: false } },
        { pdfStatus: 'generating', pdfRequestedAt: { $lt: staleBefore } },
        { pdfStatus: 'ready', pdfBuffer: { $exists: false } },
      ],
    },
    {
      $set: {
        pdfStatus: 'generating',
        pdfRequestedAt: new Date(),
        pdfError: '',
      },
    },
    { new: true }
  );

  if (!lockedCert) {
    cert = await Certificate.findOne({ certificateId }).select('certificateId pdfStatus pdfSizeBytes').lean();
    return { status: cert?.pdfStatus || 'queued' };
  }

  try {
    const fullCert = await loadCertificateForRendering(certificateId);
    if (!fullCert) {
      throw new Error('Certificate not found while preparing PDF');
    }

    const courseTitle = await resolveCourseTitle(fullCert.course, fullCert.courseTitleSnapshot);
    if (!fullCert.student?.name || !courseTitle) {
      throw new Error('Certificate data incomplete');
    }

    const issueDate = new Date(fullCert.issueDate || fullCert.createdAt || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const baseUrl = process.env.FRONTEND_URL || 'https://www.skillvalix.com';
    const verifyUrl = `${baseUrl.replace(/\/$/, '')}/verify/${fullCert.certificateId}`;
    const pdfBuffer = await buildCertificatePdfBuffer({
      studentName: fullCert.student.name,
      courseTitle,
      certificateId: fullCert.certificateId,
      issueDate,
      verifyUrl,
    });

    await Certificate.updateOne(
      { certificateId },
      {
        $set: {
          pdfStatus: 'ready',
          pdfBuffer,
          pdfMimeType: 'application/pdf',
          pdfSizeBytes: pdfBuffer.length,
          pdfGeneratedAt: new Date(),
          pdfError: '',
        },
      }
    );

    return { status: 'ready' };
  } catch (err) {
    await Certificate.updateOne(
      { certificateId },
      {
        $set: {
          pdfStatus: 'failed',
          pdfError: err.message || 'PDF generation failed',
        },
      }
    );
    return { status: 'failed', error: err.message };
  }
}

async function waitForPreparedPdf(certificateId, timeoutMs = DOWNLOAD_WAIT_MS) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const cert = await Certificate.findOne({ certificateId })
      .select('certificateId pdfStatus +pdfBuffer pdfMimeType pdfError')
      .lean();

    if (!cert) return null;
    if (isPdfReady(cert)) return cert;
    if (cert.pdfStatus === 'failed') return cert;

    await new Promise(resolve => setTimeout(resolve, DOWNLOAD_WAIT_POLL_MS));
  }

  return Certificate.findOne({ certificateId })
    .select('certificateId pdfStatus pdfSizeBytes pdfError')
    .lean();
}

function getClientPdfState(cert) {
  if (isPdfReady(cert)) {
    return {
      pdfStatus: 'ready',
      pdfReady: true,
      retryAfterSeconds: 0,
    };
  }

  if (cert?.pdfStatus === 'failed') {
    return {
      pdfStatus: 'failed',
      pdfReady: false,
      retryAfterSeconds: PDF_RETRY_AFTER_SECONDS,
    };
  }

  if (cert?.pdfStatus === 'generating') {
    return {
      pdfStatus: 'generating',
      pdfReady: false,
      retryAfterSeconds: PDF_RETRY_AFTER_SECONDS,
    };
  }

  return {
    pdfStatus: 'queued',
    pdfReady: false,
    retryAfterSeconds: PDF_RETRY_AFTER_SECONDS,
  };
}

function processPdfQueue() {
  if (activePdfGenerations >= MAX_CONCURRENT_PDF_GENERATIONS) return;
  const nextCertificateId = pdfGenerationQueue.shift();
  if (!nextCertificateId) return;
  queuedCertificateIds.delete(nextCertificateId);
  startCertificatePreparation(nextCertificateId).catch((err) => {
    console.error('[Certificates] Queue generation error:', err);
  });
}

async function startCertificatePreparation(certificateId) {
  activePdfGenerations += 1;
  try {
    return await prepareCertificatePdf(certificateId);
  } finally {
    activePdfGenerations -= 1;
    if (pdfGenerationQueue.length > 0) {
      setImmediate(processPdfQueue);
    }
  }
}

async function enqueueCertificatePreparation(certificateId) {
  // Always try immediate generation first; only queue if we hit concurrency limit
  const queued = await Certificate.updateOne(
    {
      certificateId,
      $or: [
        { pdfStatus: { $nin: ['ready', 'generating'] } },
        { pdfStatus: 'ready', pdfSizeBytes: { $lte: 0 } },
        { pdfStatus: 'ready', pdfSizeBytes: { $exists: false } },
      ],
    },
    {
      $set: {
        pdfStatus: 'queued',
        pdfRequestedAt: new Date(),
        pdfError: '',
      },
    }
  );

  if (activePdfGenerations < MAX_CONCURRENT_PDF_GENERATIONS) {
    queuedCertificateIds.delete(certificateId);
    return startCertificatePreparation(certificateId);
  }

  if (!queuedCertificateIds.has(certificateId)) {
    queuedCertificateIds.add(certificateId);
    pdfGenerationQueue.push(certificateId);
    processPdfQueue();
  }

  return { status: 'queued' };
}

function certificateResponseShape(cert, courseTitle) {
  const clientPdfState = getClientPdfState(cert);
  return {
    ...cert,
    course: {
      _id: normalizeId(cert.course),
      title: courseTitle,
    },
    pdfReady: clientPdfState.pdfReady,
    pdfStatus: clientPdfState.pdfStatus,
  };
}

router.post('/generate', authOptions, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);
    const resolvedCourseId = normalizeId(courseId);
    const hasCompletedCourse = (user?.completedCourses || []).some(course => normalizeId(course) === resolvedCourseId);
    let cert = await Certificate.findOne({ student: user._id, course: resolvedCourseId });

    if (!hasCompletedCourse && !cert) {
      return res.status(403).json({ message: 'Certificate can only be generated after completing the certification exam.' });
    }

    const courseTitle = await resolveCourseTitle(resolvedCourseId, `Course ID: ${resolvedCourseId || 'Unknown'}`);
    if (!cert) {
      const certId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;
      cert = new Certificate({
        student: user._id,
        course: resolvedCourseId,
        courseTitleSnapshot: courseTitle,
        certificateId: certId,
        pdfStatus: 'pending',
      });
      await cert.save();
    } else {
      let shouldResetPdf = false;
      if (!cert.courseTitleSnapshot && courseTitle) {
        cert.courseTitleSnapshot = courseTitle;
        shouldResetPdf = true;
      }
      if (!cert.pdfStatus || cert.pdfStatus === 'failed') {
        cert.pdfStatus = 'pending';
        shouldResetPdf = true;
      }
      if (shouldResetPdf) {
        cert.pdfBuffer = undefined;
        cert.pdfGeneratedAt = null;
        cert.pdfSizeBytes = 0;
        cert.pdfError = '';
        await cert.save();
      }
    }

    await User.findByIdAndUpdate(user._id, { $addToSet: { completedCourses: resolvedCourseId } });
    enqueueCertificatePreparation(cert.certificateId).catch(() => { });

    res.json({
      message: 'Certificate created and queued for PDF preparation.',
      certificateId: cert.certificateId,
      pdfStatus: cert.pdfStatus,
      retryAfterSeconds: PDF_RETRY_AFTER_SECONDS,
    });
  } catch (err) {
    console.error('[Certificates] Generation error:', err);
    res.status(500).json({ message: 'Server error generating certificate.' });
  }
});

router.get('/mine', authOptions, async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user.id })
      .populate('student', 'name')
      .select('student course courseTitleSnapshot certificateId issueDate createdAt pdfStatus pdfSizeBytes pdfGeneratedAt pdfRequestedAt pdfError')
      .sort({ issueDate: -1 })
      .lean();

    const allJSONEntries = await getAllCoursesFromJSON();
    const enrichedCerts = certs.map(cert => {
      const courseIdStr = normalizeId(cert.course);
      const jsonEntry = allJSONEntries.find(e => e.course._id.toString() === courseIdStr);
      const courseTitle = jsonEntry?.course?.title || cert.courseTitleSnapshot || `Course ID: ${courseIdStr || 'Unknown'}`;
      return certificateResponseShape(cert, courseTitle);
    });

    const uniqueMap = new Map();
    enrichedCerts.forEach(cert => {
      if (cert.course?._id && !uniqueMap.has(cert.course._id)) {
        uniqueMap.set(cert.course._id, cert);
      }
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json(Array.from(uniqueMap.values()));
  } catch (err) {
    console.error('[Certificates] Error fetching user certs:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/prepare/:certId', authOptions, async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId }).select('certificateId student pdfStatus pdfSizeBytes').lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
    if (!canAccessCertificate(req.user, cert)) {
      return res.status(403).json({ message: 'You do not have access to prepare this certificate.' });
    }

    if (!isPdfReady(cert)) {
      await enqueueCertificatePreparation(cert.certificateId);
    }

    const latest = await Certificate.findOne({ certificateId: cert.certificateId })
      .select('certificateId pdfStatus pdfSizeBytes pdfGeneratedAt pdfError')
      .lean();
    const clientPdfState = getClientPdfState(latest);

    res.setHeader('Cache-Control', 'no-store');
    res.status(clientPdfState.pdfReady ? 200 : 202).json({
      certificateId: cert.certificateId,
      pdfStatus: clientPdfState.pdfStatus,
      pdfReady: clientPdfState.pdfReady,
      pdfGeneratedAt: latest?.pdfGeneratedAt || null,
      retryAfterSeconds: clientPdfState.retryAfterSeconds,
      pdfError: latest?.pdfError || '',
    });
  } catch (err) {
    console.error('[Certificates] Prepare error:', err);
    res.status(500).json({ message: 'Server error preparing certificate.' });
  }
});

router.get('/status/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .select('certificateId pdfStatus pdfSizeBytes pdfGeneratedAt pdfError')
      .lean();

    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
    const clientPdfState = getClientPdfState(cert);

    res.setHeader('Cache-Control', 'no-store');
    res.json({
      certificateId: cert.certificateId,
      pdfStatus: clientPdfState.pdfStatus,
      pdfReady: clientPdfState.pdfReady,
      pdfGeneratedAt: cert.pdfGeneratedAt || null,
      retryAfterSeconds: clientPdfState.retryAfterSeconds,
      pdfError: cert.pdfError || '',
    });
  } catch (err) {
    console.error('[Certificates] Status error:', err);
    res.status(500).json({ message: 'Server error checking certificate status.' });
  }
});

router.get('/download/:certId', async (req, res) => {
  try {
    let cert = await loadCertificateForRendering(req.params.certId, true);
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });

    if (isPdfReady(cert)) {
      res.setHeader('Content-Type', cert.pdfMimeType || 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      const rawBuf = cert.pdfBuffer?.buffer || cert.pdfBuffer;
      return res.send(rawBuf);
    }

    await enqueueCertificatePreparation(cert.certificateId);
    cert = await waitForPreparedPdf(cert.certificateId);

    if (isPdfReady(cert)) {
      res.setHeader('Content-Type', cert.pdfMimeType || 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      const rawBuf = cert.pdfBuffer?.buffer || cert.pdfBuffer;
      return res.send(rawBuf);
    }

    const clientPdfState = getClientPdfState(cert);

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Retry-After', String(PDF_RETRY_AFTER_SECONDS));
    return res.status(202).json({
      message: 'Certificate PDF is being prepared. Please retry shortly.',
      certificateId: cert?.certificateId || req.params.certId,
      pdfStatus: clientPdfState.pdfStatus,
      pdfReady: clientPdfState.pdfReady,
      retryAfterSeconds: clientPdfState.retryAfterSeconds,
      pdfError: cert?.pdfError || '',
    });
  } catch (err) {
    console.error('[Certificates] Download error:', err);
    res.status(500).json({ message: 'Server error generating certificate.' });
  }
});

router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid id' });

    const courseTitle = await resolveCourseTitle(cert.course, cert.courseTitleSnapshot);
    if (!cert.student || !courseTitle) {
      return res.status(404).json({ message: 'Certificate invalid: associated student or course not found' });
    }

    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json({
      valid: true,
      studentName: cert.student.name,
      courseTitle,
      issueDate: cert.issueDate,
      certificateId: cert.certificateId,
      pdfStatus: getClientPdfState(cert).pdfStatus,
      pdfReady: getClientPdfState(cert).pdfReady,
    });
  } catch (err) {
    console.error('[Certificates] Verify error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
