import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Define models again since we're in a script
const courseSchema = new mongoose.Schema({ title: String, slug: String, description: String, image: String, instructor: mongoose.Schema.Types.ObjectId, published: Boolean, theme: String });
const lessonSchema = new mongoose.Schema({ title: String, content: String, course: mongoose.Schema.Types.ObjectId, order: Number });
const quizSchema = new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId, questions: Array, passingScore: Number });

const Course = mongoose.model('Course', courseSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.model('Quiz', quizSchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DATA_DIR = path.join(__dirname, '../frontend/public/data');

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const courses = await Course.find({ published: true }).lean();
  const unified = await Promise.all(
    courses.map(async (course) => {
      const [lessons, quiz] = await Promise.all([
        Lesson.find({ course: course._id }).sort({ order: 1 }).lean(),
        Quiz.findOne({ course: course._id }).lean()
      ]);
      return { course, lessons, quiz };
    })
  );

  if (!fs.existsSync(PUBLIC_DATA_DIR)) fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'all-courses.json'), JSON.stringify(unified, null, 2));
  console.log('✅ all-courses.json synced with Quizzes included!');
  process.exit(0);
}

sync();
