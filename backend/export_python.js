import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';
const PYTHON_ID = '72c9fd68ed2750d1d53d0e9e';

const lessonSchema = new mongoose.Schema({
  course: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  videoUrl: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}, { versionKey: '__v' });

async function run() {
  await mongoose.connect(MONGO_URI);
  const Lesson = mongoose.model('Lesson', lessonSchema);
  const lessons = await Lesson.find({ course: PYTHON_ID }).sort('order').lean();
  console.log(JSON.stringify(lessons, null, 2));
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
