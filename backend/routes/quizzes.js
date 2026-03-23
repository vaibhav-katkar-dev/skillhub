import express from 'express';
import Quiz from '../models/Quiz.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { getQuizFromJSON, getCourseFromJSON } from '../utils/courseData.js';

const router = express.Router();

// Get Quiz for a course by courseId (Exclude correct options for student)
router.get('/:courseId', authOptions, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId }).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
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
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    let certificateId = null;

    // Generate certificate if passed
    if (passed) {
      const user = await User.findById(req.user.id);
      
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
          certificateId: certId
        });
        await cert.save();
      }

      certificateId = cert.certificateId;

      // Update user completedCourses
      await User.findByIdAndUpdate(user._id, { $addToSet: { completedCourses: req.params.courseId } });
    }

    res.json({ score, passed, certificateId, message: passed ? 'Passed!' : 'Failed. Try again.' });
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
