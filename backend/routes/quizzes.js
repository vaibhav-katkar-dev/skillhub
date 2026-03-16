import express from 'express';
import Quiz from '../models/Quiz.js';
import { authOptions, adminCheck } from '../middleware/auth.js';

const router = express.Router();

// Get Quiz for a course by courseId (Exclude correct options for student)
router.get('/:courseId', authOptions, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId }).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    // Remove correct options so students can't cheat
    if (req.user.role !== 'admin') {
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

    // Further logic to unlock certificate generation...
    res.json({ score, passed, message: passed ? 'Passed!' : 'Failed. Try again.' });
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
