import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    const Lesson = mongoose.model('Lesson', new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId }));
    const Quiz = mongoose.model('Quiz', new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId }));
    const Course = mongoose.model('Course', new mongoose.Schema({ title: String }));
    const Certificate = mongoose.model('Certificate', new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId }));

    const quizzes = await Quiz.find();
    console.log('Quizzes in DB:', quizzes.length);
    for (const q of quizzes) {
      const course = await Course.findById(q.course);
      console.log(`Quiz for Course ID ${q.course}: ${course ? 'VALID (' + course.title + ')' : 'ORPHANED'}`);
    }

    const certs = await Certificate.find();
    console.log('Certificates in DB:', certs.length);
    for (const c of certs) {
      const course = await Course.findById(c.course);
      console.log(`Cert ${c.certificateId} for Course ID ${c.course}: ${course ? 'VALID (' + course.title + ')' : 'ORPHANED'}`);
    }
    
    const courses = await Course.find();
    console.log('Actual Courses in DB:', courses.length);
    for (const c of courses) {
      console.log(`Course Found: ${c._id} - ${c.title}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
