import express from 'express';
import Quiz from '../models/Quiz.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { getAllCoursesFromJSON, getCourseFromJSON } from '../utils/courseData.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// All course content (metadata + lessons) is served from all-courses.json.
// MongoDB is ONLY used for: Quizzes, Certificates, and Users.
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/courses — returns all published courses from JSON
router.get('/', async (req, res) => {
  try {
    const all = await getAllCoursesFromJSON();
    const courses = all
      .map(entry => entry.course)
      .filter(c => c.published !== false); // only published courses

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json(courses);
  } catch (err) {
    console.error('[Courses] Error reading JSON:', err);
    res.status(500).json({ message: 'Failed to load courses from static data.' });
  }
});

// GET /api/courses/:slug — returns single course + lessons + quiz from JSON/DB
router.get('/:slug', async (req, res) => {
  try {
    const all = await getAllCoursesFromJSON();
    const entry = all.find(e => e.course.slug === req.params.slug);

    if (!entry) return res.status(404).json({ message: 'Course not found' });

    const { course, lessons } = entry;

    // Quiz still comes from MongoDB (admin uploads it there)
    const quiz = await Quiz.findOne({ course: course._id }).lean();

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json({ course, lessons: lessons || [], quiz: quiz || null });
  } catch (err) {
    console.error('[Courses] Error fetching course by slug:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin: Quiz management only (courses/lessons are managed via all-courses.json)
// ─────────────────────────────────────────────────────────────────────────────

// Admin: Delete a quiz for a course (by courseId)
router.delete('/:courseId/quiz', authOptions, adminCheck, async (req, res) => {
  try {
    await Quiz.deleteMany({ course: req.params.courseId });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
