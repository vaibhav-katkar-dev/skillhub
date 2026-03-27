import express from 'express';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Certificate from '../models/Certificate.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { getAllCoursesFromJSON } from '../utils/courseData.js';

const router = express.Router();

router.get('/analytics', authOptions, adminCheck, async (req, res) => {
  try {
    const allEntries = await getAllCoursesFromJSON();
    const courseEntries = allEntries.map(entry => ({
      ...entry.course,
      lessonCount: Array.isArray(entry.lessons) ? entry.lessons.length : 0,
    }));

    const publishedCourses = courseEntries.filter(course => course.published !== false);

    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalQuizzes,
      totalCertificates,
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
      User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Certificate.find()
        .populate('student', 'name email')
        .sort({ issueDate: -1, createdAt: -1 })
        .limit(6)
        .lean(),
      Quiz.find().select('course questions updatedAt').lean(),
      User.find().select('quizAttempts completedCourses').lean(),
    ]);

    const quizCourseIds = new Set(quizDocs.map(quiz => quiz.course?.toString()).filter(Boolean));
    const certificates = await Certificate.find().select('course student issueDate certificateId').lean();

    const certCountByCourse = certificates.reduce((acc, cert) => {
      const key = cert.course?.toString();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const uniqueCertifiedUsers = new Set(
      certificates.map(cert => cert.student?.toString()).filter(Boolean)
    ).size;

    const courseBreakdown = publishedCourses
      .map(course => ({
        courseId: course._id?.toString(),
        title: course.title,
        slug: course.slug,
        lessonCount: course.lessonCount || 0,
        hasQuiz: quizCourseIds.has(course._id?.toString()),
        certificatesEarned: certCountByCourse[course._id?.toString()] || 0,
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
      permissions: {
        canViewAnalytics: true,
        canManageQuizzes: true,
        canReadCourseGuide: true,
        adminAssignment: 'database_only',
        websiteRoleElevation: false,
      },
      courseBreakdown: courseBreakdown.slice(0, 8),
      recentUsers,
      recentCertificates: recentCertificates.map(cert => ({
        certificateId: cert.certificateId,
        issueDate: cert.issueDate || cert.createdAt,
        studentName: cert.student?.name || 'Unknown User',
        studentEmail: cert.student?.email || '',
        courseTitle:
          courseEntries.find(course => course._id?.toString() === cert.course?.toString())?.title || 'Unknown Course',
      })),
    });
  } catch (err) {
    console.error('[Admin Analytics] Error:', err);
    res.status(500).json({ message: 'Failed to load admin analytics.' });
  }
});

export default router;
