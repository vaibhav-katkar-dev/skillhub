import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';
const PUBLIC_DATA_DIR = path.join(__dirname, '../../frontend/public/data');

async function exportToStatic() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create public/data directory if it doesn't exist
    if (!fs.existsSync(PUBLIC_DATA_DIR)) {
      fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
    }

    // 1. Fetch all published courses
    const courses = await Course.find({ published: true }).lean();
    
    // Save courses.json (used by Courses.jsx)
    const coursesJsonPath = path.join(PUBLIC_DATA_DIR, 'courses.json');
    fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2));
    console.log(`✅ Saved ${courses.length} courses to ${coursesJsonPath}`);

    // 2. Fetch specific lessons for each course and save [slug].json
    for (const course of courses) {
      const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
      
      const courseData = {
        course,
        lessons
      };

      const courseJsonPath = path.join(PUBLIC_DATA_DIR, `${course.slug}.json`);
      fs.writeFileSync(courseJsonPath, JSON.stringify(courseData, null, 2));
      console.log(`✅ Saved course detail to ${courseJsonPath} (${lessons.length} lessons)`);
    }

    console.log('🎉 Export complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  }
}

exportToStatic();
