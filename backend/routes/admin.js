import express from 'express';
import fs from 'fs/promises';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Certificate from '../models/Certificate.js';
import EventCertificate from '../models/EventCertificate.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { COURSE_JSON_PATH, getAllCoursesFromJSON } from '../utils/courseData.js';
import { sendEmail } from '../utils/mailer.js';

const router = express.Router();

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

router.get('/users', authOptions, adminCheck, async (req, res) => {
  try {
    const { search = '', limit = 50, hasPortfolio = 'false', hasCertificate = 'false' } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter for users with portfolio
    if (hasPortfolio === 'true') {
      query.portfolio = { $exists: true, $ne: '', $ne: null };
    }

    // Filter for users with certificates
    let userIdsWithCerts = [];
    if (hasCertificate === 'true') {
      const stdCerts = await Certificate.find({}).select('student').lean();
      const eventCerts = await EventCertificate.find({}).select('student').lean();
      const certUserIds = new Set([
        ...stdCerts.map(c => c.student?.toString()),
        ...eventCerts.map(c => c.student?.toString())
      ]);
      userIdsWithCerts = Array.from(certUserIds).filter(Boolean);
      query._id = { $in: userIdsWithCerts };
    }

    const users = await User.find(query)
      .select('name email role createdAt isVerified trafficSource lastLogin loginCount portfolio github linkedin resume')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json(users);
  } catch (err) {
    console.error('[Admin] Fetch users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/users/:id/details', authOptions, adminCheck, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const stdCerts = await Certificate.find({ student: user._id }).lean();
    const eventCertsRaw = await EventCertificate.find({ student: user._id }).lean();
    
    const eventCerts = eventCertsRaw.map(c => ({
      ...c,
      isEvent: true,
      course: { title: c.eventTitle }
    }));
    
    const allCerts = [...stdCerts, ...eventCerts].sort((a,b) => new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt));

    res.json({ user, certificates: allCerts });
  } catch (err) {
    console.error('[Admin] User details error:', err);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

router.post('/send-email', authOptions, adminCheck, async (req, res) => {
  try {
    const { target, userIds, subject, html } = req.body;

    if (!subject?.trim() || !html?.trim()) {
      return res.status(400).json({ message: 'Subject and HTML content are required' });
    }

    let recipients = [];

    if (target === 'all') {
      // Only send to verified users when targeting all
      const users = await User.find({ isVerified: true }).select('email').lean();
      recipients = users.map(u => u.email).filter(Boolean);
    } else if (target === 'selected' && Array.isArray(userIds) && userIds.length > 0) {
      const users = await User.find({ _id: { $in: userIds } }).select('email').lean();
      recipients = users.map(u => u.email).filter(Boolean);
    } else {
      return res.status(400).json({ message: 'Invalid target or missing userIds' });
    }

    if (recipients.length === 0) {
      return res.status(404).json({ message: 'No eligible recipients found' });
    }

    // Hard cap to prevent accidental email floods
    const MAX_RECIPIENTS = 500;
    if (recipients.length > MAX_RECIPIENTS) {
      return res.status(400).json({
        message: `Cannot send to more than ${MAX_RECIPIENTS} users at once. Use filtered selection to narrow the list.`
      });
    }

    // Send individually to protect recipient privacy (no exposed email lists in To/CC)
    let successCount = 0;
    let failCount = 0;

    for (const email of recipients) {
      try {
        await sendEmail({ to: email, subject, html });
        successCount++;
      } catch (err) {
        failCount++;
        console.error(`[Admin Email] Failed to send to ${email}:`, err.message);
      }
    }

    res.json({
      message: `Done. Sent: ${successCount}, Failed: ${failCount} out of ${recipients.length} recipients.`,
      successCount,
      failCount,
      total: recipients.length
    });
  } catch (err) {
    console.error('[Admin] Send email error:', err);
    res.status(500).json({ message: 'Failed to send custom emails' });
  }
});

router.get('/users/export', authOptions, adminCheck, async (req, res) => {
  try {
    const users = await User.find({}).lean();
    if (!users.length) return res.status(404).json({ message: 'No users found' });

    let csv = 'Name,Email,Role,Registered At\n';
    users.forEach(u => {
      const name = (u.name || '').replace(/"/g, '""');
      const email = (u.email || '').replace(/"/g, '""');
      const role = u.role || 'student';
      const date = u.createdAt ? new Date(u.createdAt).toISOString() : '';
      csv += `"${name}","${email}","${role}","${date}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('skillvalix-users.csv');
    return res.send(csv);
  } catch (err) {
    console.error('[Admin] Export Users error:', err);
    res.status(500).json({ message: 'Failed to export users' });
  }
});

router.get('/analytics', authOptions, adminCheck, async (req, res) => {
  try {
    const allEntries = await getAllCoursesFromJSON();
    const courseJsonStats = await fs.stat(COURSE_JSON_PATH).catch(() => null);
    const courseEntries = allEntries.map(entry => ({
      ...entry.course,
      normalizedId: normalizeId(entry.course?._id),
      lessonCount: Array.isArray(entry.lessons) ? entry.lessons.length : 0,
    }));
    const courseTitleById = new Map(
      courseEntries
        .filter(course => course.normalizedId)
        .map(course => [course.normalizedId, course.title])
    );

    const publishedCourses = courseEntries.filter(course => course.published !== false);

    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalQuizzes,
      totalCertificates,
      readyCertificates,
      pendingCertificates,
      queuedCertificates,
      generatingCertificates,
      failedCertificates,
      pdfStorageStats,
      recentUsers,
      recentCertificates,
      quizDocs,
      usersForAttempts,
      userGrowthRaw,
      certificateGrowthRaw
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Quiz.countDocuments(),
      Certificate.countDocuments(),
      Certificate.countDocuments({ pdfStatus: 'ready' }),
      Certificate.countDocuments({ pdfStatus: 'pending' }),
      Certificate.countDocuments({ pdfStatus: 'queued' }),
      Certificate.countDocuments({ pdfStatus: 'generating' }),
      Certificate.countDocuments({ pdfStatus: 'failed' }),
      Certificate.aggregate([
        {
          $group: {
            _id: null,
            totalPdfBytes: { $sum: { $ifNull: ['$pdfSizeBytes', 0] } },
            avgPdfBytes: { $avg: { $ifNull: ['$pdfSizeBytes', 0] } },
            cachedPdfCount: {
              $sum: {
                $cond: [{ $gt: [{ $ifNull: ['$pdfSizeBytes', 0] }, 0] }, 1, 0],
              },
            },
          },
        },
      ]),
      User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Certificate.find()
        .populate('student', 'name email')
        .select('certificateId issueDate createdAt course courseTitleSnapshot student')
        .sort({ issueDate: -1, createdAt: -1 })
        .limit(6)
        .lean(),
      Quiz.find().select('course questions updatedAt').lean(),
      User.find().select('quizAttempts completedCourses').lean(),
      User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ]),
      Certificate.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: { $ifNull: ["$issueDate", "$createdAt"] } } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ])
    ]);

    const formatGrowthData = (rawData) => {
      return rawData.filter(d => d._id).map(d => {
        const [year, month] = d._id.split('-');
        const date = new Date(year, month - 1);
        return {
          name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          count: d.count
        };
      });
    };

    const userGrowth = formatGrowthData(userGrowthRaw);
    const certificateGrowth = formatGrowthData(certificateGrowthRaw);

    const quizCourseIds = new Set(quizDocs.map(quiz => normalizeId(quiz.course)).filter(Boolean));
    const certificates = await Certificate.find().select('course student issueDate certificateId').lean();

    const certCountByCourse = certificates.reduce((acc, cert) => {
      const key = normalizeId(cert.course);
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const uniqueCertifiedUsers = new Set(
      certificates.map(cert => cert.student?.toString()).filter(Boolean)
    ).size;

    const courseBreakdown = publishedCourses
      .map(course => ({
        courseId: course.normalizedId,
        title: course.title,
        slug: course.slug,
        lessonCount: course.lessonCount || 0,
        hasQuiz: quizCourseIds.has(course.normalizedId),
        certificatesEarned: certCountByCourse[course.normalizedId] || 0,
      }))
      .sort((a, b) => b.certificatesEarned - a.certificatesEarned || a.title.localeCompare(b.title));

    const totalAttemptsUsed = usersForAttempts.reduce(
      (sum, user) => sum + (user.quizAttempts || []).reduce((inner, attempt) => inner + (attempt.attempts || 0), 0),
      0
    );

    const totalAttemptsUnlocked = usersForAttempts.reduce(
      (sum, user) => sum + (user.quizAttempts || []).reduce((inner, attempt) => inner + (attempt.unlockedAttempts || 0), 0),
      0
    );

    const quizCoverage = publishedCourses.length
      ? Math.round((quizCourseIds.size / publishedCourses.length) * 100)
      : 0;

    const courseCompletionCoverage = publishedCourses.length
      ? Math.round((courseBreakdown.filter(course => course.certificatesEarned > 0).length / publishedCourses.length) * 100)
      : 0;

    const lessonCount = allEntries.reduce(
      (sum, entry) => sum + (Array.isArray(entry.lessons) ? entry.lessons.length : 0),
      0
    );
    const embeddedQuizCount = allEntries.reduce(
      (sum, entry) => sum + (entry.quiz ? 1 : 0),
      0
    );
    const pdfStats = pdfStorageStats[0] || {};
    const totalPdfBytes = pdfStats.totalPdfBytes || 0;
    const avgPdfBytes = pdfStats.avgPdfBytes || 0;
    const cachedPdfCount = pdfStats.cachedPdfCount || 0;
    const queueDepth = pendingCertificates + queuedCertificates + generatingCertificates;
    const cachedPdfCoverage = totalCertificates
      ? Math.round((cachedPdfCount / totalCertificates) * 100)
      : 0;

    res.json({
      generatedAt: new Date().toISOString(),
      overview: {
        totalUsers,
        totalStudents,
        totalAdmins,
        publishedCourses: publishedCourses.length,
        totalQuizzes,
        quizCoverage,
        totalCertificates,
        uniqueCertifiedUsers,
        courseCompletionCoverage,
      },
      engagement: {
        totalAttemptsUsed,
        totalAttemptsUnlocked,
        averageCertificatesPerCertifiedUser: uniqueCertifiedUsers
          ? Number((totalCertificates / uniqueCertifiedUsers).toFixed(2))
          : 0,
      },
      certificatePipeline: {
        ready: readyCertificates,
        pending: pendingCertificates,
        queued: queuedCertificates,
        generating: generatingCertificates,
        failed: failedCertificates,
        queueDepth,
        cachedPdfCount,
        cachedPdfCoverage,
        totalCachedPdfBytes: totalPdfBytes,
        totalCachedPdfMb: Number((totalPdfBytes / (1024 * 1024)).toFixed(2)),
        averagePdfBytes: Math.round(avgPdfBytes || 0),
        averagePdfKb: Number(((avgPdfBytes || 0) / 1024).toFixed(2)),
      },
      permissions: {
        canViewAnalytics: true,
        canManageQuizzes: true,
        canReadCourseGuide: true,
        adminAssignment: 'database_only',
        websiteRoleElevation: false,
      },
      contentFootprint: {
        courseJsonBytes: courseJsonStats?.size || 0,
        courseJsonKb: courseJsonStats?.size ? Number((courseJsonStats.size / 1024).toFixed(2)) : 0,
        staticCourses: allEntries.length,
        staticLessons: lessonCount,
        staticEmbeddedQuizzes: embeddedQuizCount,
      },
      courseBreakdown: courseBreakdown.slice(0, 8),
      recentUsers,
      recentCertificates: recentCertificates.map(cert => ({
        certificateId: cert.certificateId,
        issueDate: cert.issueDate || cert.createdAt,
        studentName: cert.student?.name || 'Unknown User',
        studentEmail: cert.student?.email || '',
        courseTitle: courseTitleById.get(normalizeId(cert.course)) || cert.courseTitleSnapshot || `Course ID: ${normalizeId(cert.course) || 'Unknown'}`,
      })),
      charts: {
        userGrowth,
        certificateGrowth
      }
    });
  } catch (err) {
    console.error('[Admin Analytics] Error:', err);
    res.status(500).json({ message: 'Failed to load admin analytics.' });
  }
});

export default router;
