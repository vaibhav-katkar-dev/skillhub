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
  if (Object.prototype.hasOwnProperty.call(cert, 'pdfBuffer')) {
    return Buffer.isBuffer(cert.pdfBuffer) && cert.pdfBuffer.length > 0;
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
      if (
        Object.prototype.hasOwnProperty.call(current, '_id') &&
        current._id &&
        current._id !== current
      ) {
        current = current._id;
        depth += 1;
        continue;
      }
      if (typeof current.toString === 'function') {
        const str = current.toString();
        return str && str !== '[object Object]' ? str : null;
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

function buildCertificatePdfBuffer({ studentName, courseTitle, certificateId, issueDate, verifyUrl }) {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    try {
      const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        errorCorrectionLevel: 'H',
        width: 180,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      });

      const W = doc.page.width;
      const H = doc.page.height;

      doc.rect(0, 0, W, H).fill('#f8fafc');
      doc.rect(12, 12, W - 24, H - 24).lineWidth(2).strokeColor('#2563eb').stroke();
      doc.rect(24, 24, W - 48, H - 48).lineWidth(1).strokeColor('#cbd5e1').stroke();

      const headerGrad = doc.linearGradient(0, 0, W, 0);
      headerGrad.stop(0, '#1d4ed8');
      headerGrad.stop(1, '#7c3aed');
      doc.rect(0, 0, W, 110).fill(headerGrad);

      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(34)
        .text('SkillValix', 56, 34, { lineBreak: false });
      doc.font('Helvetica').fontSize(13).fillColor('#dbeafe')
        .text('Verified Certificate of Completion', 58, 74, { lineBreak: false });

      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16)
        .text('CERTIFICATE OF COMPLETION', 56, 150, {
          width: W - 280,
          align: 'center',
          characterSpacing: 3,
        });

      doc.font('Helvetica').fontSize(17).fillColor('#475569')
        .text('This is proudly presented to', 56, 205, {
          width: W - 280,
          align: 'center',
        });

      doc.font('Helvetica-Bold').fontSize(30).fillColor('#111827')
        .text(String(studentName || 'Learner').toUpperCase(), 56, 240, {
          width: W - 280,
          align: 'center',
        });

      doc.moveTo(180, 292).lineTo(W - 340, 292).lineWidth(2).strokeColor('#60a5fa').stroke();

      doc.font('Helvetica').fontSize(14).fillColor('#64748b')
        .text('for successfully completing', 56, 320, {
          width: W - 280,
          align: 'center',
        });

      doc.font('Helvetica-Bold').fontSize(24).fillColor('#1e3a8a')
        .text(courseTitle, 56, 350, {
          width: W - 280,
          align: 'center',
        });

      doc.font('Helvetica').fontSize(12).fillColor('#475569')
        .text(
          'This certificate is issued as a verifiable record of successful exam completion on SkillValix.',
          90,
          405,
          { width: W - 420, align: 'center', lineGap: 4 }
        );

      doc.roundedRect(W - 220, 160, 140, 140, 16).fill('#ffffff');
      doc.roundedRect(W - 220, 160, 140, 140, 16).lineWidth(1).strokeColor('#cbd5e1').stroke();
      doc.image(qrBuffer, W - 205, 175, { width: 110, height: 110 });

      doc.font('Helvetica-Bold').fontSize(10).fillColor('#64748b')
        .text('SCAN TO VERIFY', W - 220, 315, { width: 140, align: 'center', characterSpacing: 1.5 });

      doc.roundedRect(56, H - 118, 260, 70, 14).fill('#ffffff');
      doc.roundedRect(56, H - 118, 260, 70, 14).lineWidth(1).strokeColor('#cbd5e1').stroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#64748b')
        .text('CERTIFICATE ID', 74, H - 102, { characterSpacing: 1.5 });
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a')
        .text(certificateId, 74, H - 82);

      doc.roundedRect(338, H - 118, 220, 70, 14).fill('#ffffff');
      doc.roundedRect(338, H - 118, 220, 70, 14).lineWidth(1).strokeColor('#cbd5e1').stroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#64748b')
        .text('ISSUED ON', 356, H - 102, { characterSpacing: 1.5 });
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a')
        .text(issueDate, 356, H - 82);

      doc.roundedRect(580, H - 118, 190, 70, 14).fill('#ffffff');
      doc.roundedRect(580, H - 118, 190, 70, 14).lineWidth(1).strokeColor('#cbd5e1').stroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#64748b')
        .text('ISSUED BY', 598, H - 102, { characterSpacing: 1.5 });
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a')
        .text('SkillValix', 598, H - 82);

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

    const verifyUrl = `https://www.skillvalix.com/verify/${fullCert.certificateId}`;
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
    enqueueCertificatePreparation(cert.certificateId).catch(() => {});

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

    res.setHeader('Cache-Control', 'private, max-age=30');
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
      return res.send(cert.pdfBuffer);
    }

    await enqueueCertificatePreparation(cert.certificateId);
    cert = await waitForPreparedPdf(cert.certificateId);

    if (isPdfReady(cert)) {
      res.setHeader('Content-Type', cert.pdfMimeType || 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cert.pdfBuffer);
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
