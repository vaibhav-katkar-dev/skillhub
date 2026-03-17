import express from 'express';
import PDFDocument from 'pdfkit';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../middleware/auth.js';

const router = express.Router();

// Generate Certificate (Internal, triggered when passing a quiz typically)
router.post('/generate', authOptions, async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Assuming we verified passing in the quiz route, or we check a ledger here
    const certId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Ensure we don't duplicate certificates for the same course and student
    let cert = await Certificate.findOne({ student: user._id, course: course._id });
    if (!cert) {
      cert = new Certificate({
        student: user._id,
        course: course._id,
        certificateId: certId
      });
      await cert.save();
    }

    // Update user completedCourses
    await User.findByIdAndUpdate(user._id, { $addToSet: { completedCourses: course._id } });

    res.json({ message: 'Certificate Generated', certificateId: cert.certificateId });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user's certificates
router.get('/mine', authOptions, async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user.id })
      .populate('course', 'title')
      .sort({ issueDate: -1 })
      .lean();

    // Deduplicate by course (keep first/latest per course)
    const uniqueMap = new Map();
    certs.forEach(cert => {
      const cId = cert.course?._id?.toString() || cert.course?.toString();
      if (cId && !uniqueMap.has(cId)) uniqueMap.set(cId, cert);
    });

    // Private cache — user-specific, browser can cache 1 min
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.json(Array.from(uniqueMap.values()));
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Download/View PDF
router.get('/download/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .populate('course', 'title');

    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    // Generate PDF on the fly
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Certificate-${cert.certificateId}.pdf`);

    // Handle client disconnect or stream errors gracefully to prevent server crash
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

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

    doc.fontSize(40).fillColor('#1d4ed8').text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).fillColor('#000').text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(30).fillColor('#10b981').text(cert.student.name, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).fillColor('#000').text('has successfully completed the course', { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).fillColor('#3b82f6').text(cert.course.title, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(15).fillColor('#6b7280').text(`Certificate ID: ${cert.certificateId}`, { align: 'center' });
    doc.text(`Date of Issue: ${cert.issueDate.toDateString()}`, { align: 'center' });
    doc.text(`Verify at: https://skillhubpro.vercel.app/verify/${cert.certificateId}`, { align: 'center' });

    doc.end();

  } catch (err) {
    console.error('Certificate download error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
});

// Verify Certificate (Public) — cached 10 min (certs don't change)
router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('student', 'name')
      .populate('course', 'title')
      .lean();

    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid id' });

    res.setHeader('Cache-Control', 'public, max-age=600');
    res.json({
      valid: true,
      studentName: cert.student.name,
      courseTitle: cert.course.title,
      issueDate: cert.issueDate,
      certificateId: cert.certificateId
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
