import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import { authOptions, adminCheck } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DATA_DIR = path.join(__dirname, '../../frontend/public/data');

// Helper to regenerate static JSON
async function regenerateStaticData() {
  try {
    if (!fs.existsSync(PUBLIC_DATA_DIR)) {
      fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
    }
    const courses = await Course.find({ published: true }).lean();

    // Build unified all-courses.json — [{course, lessons}, ...]
    const unified = await Promise.all(
      courses.map(async (course) => {
        const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
        return { course, lessons };
      })
    );
    fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'all-courses.json'), JSON.stringify(unified, null, 2));
    console.log('✅ Static all-courses.json regenerated automatically');
  } catch (err) {
    console.error('❌ Failed to regenerate static JSON:', err);
  }
}

const router = express.Router();

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .select('-__v -createdAt')
      .lean();  // returns plain JS objects, ~2x faster than Mongoose docs

    // Cache for 5 min on CDN/browser — courses don't change often
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single course by slug
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).lean();
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const [lessons, quiz] = await Promise.all([
      Lesson.find({ course: course._id }).sort('order').lean(),
      Quiz.findOne({ course: course._id }).lean()
    ]);

    // Cache individual course for 5 min
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json({ course, lessons, quiz });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: Upload full course structure via JSON
router.post('/upload', authOptions, adminCheck, async (req, res) => {
  try {
    const { course, lessons, quiz } = req.body;
    
    if (!course || !course.title || !course.slug) {
      return res.status(400).json({ message: 'Invalid course data. Must include title and slug.' });
    }

    // Optional: Delete existing course if conflicting slug (or let it fail)
    const existingCourse = await Course.findOne({ slug: course.slug });
    if (existingCourse) {
      await Lesson.deleteMany({ course: existingCourse._id });
      await Quiz.deleteMany({ course: existingCourse._id });
      await Course.deleteOne({ _id: existingCourse._id });
    }
    
    // Create course
    const newCourse = new Course({ ...course, instructor: req.user.id });
    const savedCourse = await newCourse.save();

    // Create lessons
    if (lessons && Array.isArray(lessons)) {
      const lessonDocs = lessons.map((l, index) => ({
        ...l, 
        course: savedCourse._id,
        order: l.order || index + 1
      }));
      await Lesson.insertMany(lessonDocs);
    }

    // Create quiz
    if (quiz && quiz.questions) {
      const mappedQuestions = quiz.questions.map(q => ({
        ...q,
        correctOptionIndex: q.correctOptionIndex ?? q.correctAnswerIndex ?? q.answerIndex ?? 0
      }));
      const newQuiz = new Quiz({ ...quiz, questions: mappedQuestions, course: savedCourse._id });
      await newQuiz.save();
    }

    res.json({ message: 'Course uploaded successfully!', slug: savedCourse.slug });
    
    // Asynchronously regenerate the static files
    regenerateStaticData();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error. Are you sure slug is unique?', error: err.message });
  }
});

// Admin: Create Course
router.post('/', authOptions, adminCheck, async (req, res) => {
  try {
    const newCourse = new Course({ ...req.body, instructor: req.user.id });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Admin: Add Lesson to Course
router.post('/:courseId/lessons', authOptions, adminCheck, async (req, res) => {
  try {
    const newLesson = new Lesson({ ...req.body, course: req.params.courseId });
    const lesson = await newLesson.save();
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Admin: Delete Course
router.delete('/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const courseId = req.params.id;
    await Lesson.deleteMany({ course: courseId });
    await Quiz.deleteMany({ course: courseId });
    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course deleted successfully' });
    
    // Regnerate static files after deletion
    regenerateStaticData();
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
