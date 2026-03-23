import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import './models/Course.js';
import './models/Quiz.js';

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Course = mongoose.model('Course');
    const Quiz = mongoose.model('Quiz');
    
    const courses = await Course.find();
    console.log(`Total courses in DB: ${courses.length}`);
    for (const c of courses) {
      const quiz = await Quiz.findOne({ course: c._id });
      console.log(`Course: ${c.title} (ID: ${c._id}, Slug: ${c.slug}, Published: ${c.published}) - Quiz: ${quiz ? 'EXISTS' : 'MISSING'}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
