import express from 'express';
import PDFDocument from 'pdfkit';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../middleware/auth.js';
import { getCourseFromJSON, getAllCoursesFromJSON } from '../utils/courseData.js';

const router = express.Router();

// ─── Internal helper: resolve course title from JSON (primary) ────────────────
// Courses are stored in all-courses.json, not necessarily in MongoDB.
// We always look up the title from JSON to avoid populate() returning null.
async function resolveCourseTitle(courseId) {
  if (!courseId) return null;
  const idStr = courseId.toString();
  const jsonCourse = await getCourseFromJSON(idStr);
  return jsonCourse?.title || null;
}

// Generate Certificate (Internal, triggered when passing a quiz typically)
router.post('/generate', authOptions, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);

    // Verify the course exists in JSON (source of truth)
    const jsonCourse = await getCourseFromJSON(courseId);
    if (!jsonCourse) {
      console.warn(`[Certificates] Generation failed: Course not found in JSON for ID: ${courseId}`);
      return res.status(404).json({ message: 'Course not found. Please check if the course exists.' });
    }

    // Ensure we don't duplicate certificates for the same course and student
    let cert = await Certificate.findOne({ student: user._id, course: courseId });
    if (!cert) {
      const certId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;
      cert = new Certificate({
        student: user._id,
        course: courseId,
        certificateId: certId
      });
      await cert.save();
      console.info(`[Certificates] New certificate created: ${certId} for user ${user._id}`);
    }

    // Update user completedCourses
    await User.findByIdAndUpdate(user._id, { $addToSet: { completedCourses: courseId } });

    res.json({ message: 'Certificate Generated', certificateId: cert.certificateId });
  } catch (err) {
    console.error('[Certificates] Generation error:', err);
    res.status(500).json({ message: 'Server error generating certificate.' });
  }
});

// Get user's certificates
router.get('/mine', authOptions, async (req, res) => {
  try {
    // Fetch raw certs WITHOUT populate — course IDs may not exist in MongoDB
    const certs = await Certificate.find({ student: req.user.id })
      .populate('student', 'name')   // user always exists
      .sort({ issueDate: -1 })
      .lean();

    const allJSONEntries = await getAllCoursesFromJSON();

    const enrichedCerts = certs.map(cert => {
      const courseIdStr = cert.course?.toString();
      const jsonEntry = allJSONEntries.find(e => e.course._id.toString() === courseIdStr);
      return {
        ...cert,
        course: {
          _id: courseIdStr,
          title: jsonEntry?.course?.title || 'Unknown Course'
        }
      };
    });

    // Deduplicate by course (keep latest per course)
    const uniqueMap = new Map();
    enrichedCerts.forEach(cert => {
      if (cert.course?._id) {
        if (!uniqueMap.has(cert.course._id)) uniqueMap.set(cert.course._id, cert);
      }
    });

    res.setHeader('Cache-Control', 'private, max-age=60');
    res.json(Array.from(uniqueMap.values()));
  } catch (err) {
    console.error('[Certificates] Error fetching user certs:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Download/View PDF
router.get('/download/:certId', async (req, res) => {
  let doc;
  try {
    // Do NOT populate course — it may not exist in MongoDB
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();

    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    // Resolve course title from JSON (the source of truth for course data)
    const courseTitle = await resolveCourseTitle(cert.course);

    if (!cert.student || !courseTitle) {
      console.warn(`[Certificates] Certificate ${req.params.certId} missing data:`, {
        hasStudent: !!cert.student,
        hasCourseTitle: !!courseTitle,
        courseId: cert.course?.toString()
      });
      return res.status(404).json({
        message: 'Certificate invalid: associated student or course not found. Please contact support.'
      });
    }

    // Generate PDF on the fly
    doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);

    // Handle client disconnect or stream errors gracefully
    res.on('error', (err) => {
      console.error('Response stream error:', err.message);
      doc.destroy();
    });

    req.on('close', () => {
      doc.destroy();
    });

    doc.on('error', (err) => {
      console.error('PDF doc error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ message: 'PDF generation failed' });
      }
    });

    doc.pipe(res);

    // ── PDF Content ──────────────────────────────────────────────────────────
    const pageW = doc.page.width;
    const pageH = doc.page.height;

    // Background
    doc.rect(0, 0, pageW, pageH).fill('#f8fafc');

    // Decorative border
    doc.rect(20, 20, pageW - 40, pageH - 40)
      .lineWidth(3)
      .stroke('#1d4ed8');

    // Inner border (double border effect)
    doc.rect(28, 28, pageW - 56, pageH - 56)
      .lineWidth(1)
      .stroke('#93c5fd');

    // Header accent bar
    doc.rect(20, 20, pageW - 40, 8).fill('#1d4ed8');

    // Title
    doc.fontSize(42)
      .fillColor('#1d4ed8')
      .font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 80, { align: 'center' });

    // Subtitle line
    doc.moveTo(pageW / 2 - 200, 140)
      .lineTo(pageW / 2 + 200, 140)
      .lineWidth(1)
      .stroke('#cbd5e1');

    doc.fontSize(16)
      .fillColor('#475569')
      .font('Helvetica')
      .text('This is to certify that', 0, 160, { align: 'center' });

    // Student name
    doc.fontSize(34)
      .fillColor('#059669')
      .font('Helvetica-Bold')
      .text(cert.student?.name || 'Student Name Unavailable', 0, 195, { align: 'center' });

    doc.moveTo(pageW / 2 - 160, 245)
      .lineTo(pageW / 2 + 160, 245)
      .lineWidth(1)
      .stroke('#d1d5db');

    doc.fontSize(16)
      .fillColor('#475569')
      .font('Helvetica')
      .text('has successfully completed the course', 0, 260, { align: 'center' });

    // Course title
    doc.fontSize(26)
      .fillColor('#1d4ed8')
      .font('Helvetica-Bold')
      .text(courseTitle, 60, 290, { align: 'center', width: pageW - 120 });

    // Footer details
    const footerY = pageH - 110;
    doc.fontSize(12)
      .fillColor('#6b7280')
      .font('Helvetica')
      .text(`Certificate ID: ${cert.certificateId}`, 0, footerY, { align: 'center' });

    doc.text(
      `Date of Issue: ${cert.issueDate ? new Date(cert.issueDate).toDateString() : new Date().toDateString()}`,
      0, footerY + 20, { align: 'center' }
    );

    doc.text(
      `Verify at: https://skillhubpro.vercel.app/verify/${cert.certificateId}`,
      0, footerY + 40, { align: 'center' }
    );

    // Bottom accent bar
    doc.rect(20, pageH - 28, pageW - 40, 8).fill('#1d4ed8');

    doc.end();

  } catch (err) {
    console.error('[Certificates] Download error:', err);
    if (doc) {
      try { doc.destroy(); } catch (_) { /* ignore */ }
    }
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error generating certificate. Please try again later.' });
    }
  }
});

// Verify Certificate (Public)
router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .lean();

    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid id' });

    // Resolve course title from JSON
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
