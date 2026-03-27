import express from 'express';
import Quiz from '../models/Quiz.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { getQuizFromJSON, getCourseFromJSON } from '../utils/courseData.js';

const router = express.Router();
const ADMIN_TEST_PASSING_SCORE = 30;

function normalizeId(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value.toHexString === 'function') return value.toHexString();
  if (typeof value === 'object') {
    if (Object.prototype.hasOwnProperty.call(value, '_id')) return normalizeId(value._id);
    if (typeof value.toString === 'function') {
      const str = value.toString();
      return str && str !== '[object Object]' ? str : null;
    }
  }
  return null;
}

// Get Quiz for a course by courseId (Exclude correct options for student)
router.get('/:courseId', authOptions, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId }).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const user = await User.findById(req.user.id);
    const attemptRecord = user.quizAttempts?.find(a => a.courseId === req.params.courseId);
    quiz.attemptsUsed = attemptRecord ? attemptRecord.attempts : 0;
    quiz.unlockedAttempts = attemptRecord ? attemptRecord.unlockedAttempts : 0;
    quiz.requirePayment = quiz.attemptsUsed >= quiz.unlockedAttempts;
    quiz.isAdminTestMode = req.user?.role === 'admin';
    if (quiz.isAdminTestMode) {
      quiz.passingScore = ADMIN_TEST_PASSING_SCORE;
    }
    
    
    // Remove correct options so students can't cheat
    if (req.user?.role !== 'admin') {
      quiz.questions = quiz.questions.map(q => {
        const { correctOptionIndex, ...rest } = q;
        return rest;
      });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Submit Quiz
router.post('/:courseId/submit', authOptions, async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected option indexes
    const courseIdString = req.params.courseId;
    const quiz = await Quiz.findOne({ course: courseIdString });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Track Attempts
    const user = await User.findById(req.user.id);
    let attemptRecordCount = 0;
    let unlockedCount = 0;
    
    const attemptIndex = user.quizAttempts?.findIndex(a => a.courseId === courseIdString);
    if (attemptIndex > -1) {
      attemptRecordCount = user.quizAttempts[attemptIndex].attempts;
      unlockedCount = user.quizAttempts[attemptIndex].unlockedAttempts;
    }
    
    // Check if limit exceeded
    if (attemptRecordCount >= unlockedCount) {
      return res.status(403).json({ 
        message: 'You need to pay to unlock this exam attempt.',
        requirePayment: true
      });
    }

    // Increment attempts
    if (attemptIndex > -1) {
      user.quizAttempts[attemptIndex].attempts += 1;
    } else {
      user.quizAttempts.push({ courseId: courseIdString, attempts: 1, unlockedAttempts: unlockedCount });
    }
    await user.save();

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const effectivePassingScore = req.user?.role === 'admin' ? ADMIN_TEST_PASSING_SCORE : quiz.passingScore;
    const passed = score >= effectivePassingScore;

    let certificateId = null;

    // Generate certificate if passed
    if (passed) {
      const user = await User.findById(req.user.id);
      const jsonCourse = await getCourseFromJSON(courseIdString);
      const courseTitleSnapshot = jsonCourse?.title || `Course ID: ${courseIdString}`;
      // Ensure we don't duplicate certificates for the same course and student
      let cert = await Certificate.findOne({ student: user._id, course: req.params.courseId });
      if (!cert) {
        let certId;
        let isUnique = false;
        while (!isUnique) {
          certId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;
          const existingCert = await Certificate.findOne({ certificateId: certId });
          if (!existingCert) {
            isUnique = true;
          }
        }

        cert = new Certificate({
          student: user._id,
          course: req.params.courseId,
          courseTitleSnapshot,
          certificateId: certId
        });
        await cert.save();
      } else if (!cert.courseTitleSnapshot && courseTitleSnapshot) {
        cert.courseTitleSnapshot = courseTitleSnapshot;
        await cert.save();
      }

      certificateId = cert.certificateId;

      // Update user completedCourses
      await User.findByIdAndUpdate(user._id, { $addToSet: { completedCourses: req.params.courseId } });
    }

    res.json({
      score,
      passed,
      certificateId,
      passingScore: effectivePassingScore,
      isAdminTestMode: req.user?.role === 'admin',
      message: passed ? 'Passed!' : 'Failed. Try again.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Admin: Create/Update Quiz for Course
router.post('/:courseId', authOptions, adminCheck, async (req, res) => {
  try {
    let quiz = await Quiz.findOne({ course: req.params.courseId });
    if (quiz) {
      quiz.questions = req.body.questions;
      quiz.passingScore = req.body.passingScore || 70;
      if (req.body.ribbonTheme) quiz.ribbonTheme = req.body.ribbonTheme;
      await quiz.save();
    } else {
      quiz = new Quiz({ course: req.params.courseId, ...req.body });
      await quiz.save();
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
