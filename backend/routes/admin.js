import express from 'express';
import fs from 'fs/promises';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Certificate from '../models/Certificate.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { COURSE_JSON_PATH, getAllCoursesFromJSON } from '../utils/courseData.js';

const router = express.Router();

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
    ]);

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
      certificateArchitecture: {
        previousFlow: 'Each download request could regenerate the certificate PDF synchronously.',
        currentFlow: 'Certificate records are saved first, PDF generation is queued, and ready PDFs are cached for fast repeat downloads.',
        mainWins: [
          'Repeat downloads avoid CPU-heavy regeneration once the PDF is cached.',
          'Users receive controlled waiting states instead of timeouts during bursts.',
          'Queue state is persisted in MongoDB so certificate records remain recoverable across retries.',
        ],
        scalingLimit: 'This is a strong serverless-safe improvement, but the in-memory queue still runs per warm instance rather than as a fully distributed global queue.',
      },
      permissions: {
        canViewAnalytics: true,
        canManageQuizzes: true,
        canReadCourseGuide: true,
        adminAssignment: 'database_only',
        websiteRoleElevation: false,
      },
      infrastructure: {
        frontend: {
          platform: 'Vercel',
          delivery: 'Static Vite build served by CDN',
          primaryPayload: 'Frontend assets plus course JSON',
        },
        backend: {
          platform: 'Vercel',
          runtime: 'Serverless Node/Express API',
          databaseConnectionMode: 'Cached mongoose connection with pooled maxPoolSize 10',
          heaviestEndpoints: ['certificate PDF generation', 'quiz submit', 'payment verify', 'admin analytics'],
        },
        database: {
          provider: 'MongoDB Atlas',
          tierAssumption: 'Free/shared tier baseline estimate',
          primaryCollections: ['users', 'certificates', 'quizzes'],
          courseContentStorage: 'Static JSON file, not MongoDB',
        },
      },
      contentFootprint: {
        courseJsonBytes: courseJsonStats?.size || 0,
        courseJsonKb: courseJsonStats?.size ? Number((courseJsonStats.size / 1024).toFixed(2)) : 0,
        staticCourses: allEntries.length,
        staticLessons: lessonCount,
        staticEmbeddedQuizzes: embeddedQuizCount,
      },
      capacityEstimate: {
        frontendOnlyConcurrentVisitors: '1000+ browsing visitors',
        fullStackActiveConcurrentUsers: '20-50 active users',
        shortBurstConcurrentUsers: '100-300 mixed burst users',
        certificateGenerationConcurrency: '5-15 simultaneous certificate jobs',
        practicalBottleneck: 'MongoDB free tier throughput and serverless cold starts before frontend CDN limits',
      },
      freeTierEstimate: {
        mongodbStorageMb: 512,
        mongodbApproxOpsPerSecond: 100,
        mongodbLikelyFirstLimit: 'throughput before storage',
        backendNotes: 'Serverless execution is suitable for early-stage traffic but PDF generation and payment verification are the most expensive requests.',
        recommendationOrder: [
          'Upgrade MongoDB first when active exam traffic grows',
          'Cache analytics and course lookups',
          'Move certificate generation to a queued or background flow for larger volume',
          'Upgrade Vercel plan after database bottlenecks are solved',
        ],
      },
      securityReview: {
        fixedRecently: [
          'JWT secret fallback removed',
          'Certificate generation restricted to completed courses',
          'Payment verification now checks order receipt and amount',
          'Certificate downloads now prefer cached PDFs over regenerating on every request',
        ],
        watchList: [
          'Lesson and blog HTML rendering should stay trusted or be sanitized before rendering',
          'Certificate PDF generation is CPU-heavy compared to normal API requests',
          'Serverless queue coordination is per warm instance, so very large bursts still need a true external queue for best scale',
        ],
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
    });
  } catch (err) {
    console.error('[Admin Analytics] Error:', err);
    res.status(500).json({ message: 'Failed to load admin analytics.' });
  }
});

export default router;
