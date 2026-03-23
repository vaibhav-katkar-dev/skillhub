import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';

const courseSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  image: String,
  instructor: mongoose.Schema.Types.ObjectId,
  published: Boolean,
  theme: String,
  createdAt: Date,
  updatedAt: Date
});

async function restore() {
  try {
    await mongoose.connect(MONGO_URI);
    const Course = mongoose.model('Course', courseSchema);
    
    const pythonID = '72c9fd68ed2750d1d53d0e9e';
    const existing = await Course.findById(pythonID);
    
    if (existing) {
      console.log('Python course already exists in DB.');
    } else {
      console.log('Restoring Python course to DB...');
      const pythonCourse = new Course({
        _id: pythonID,
        title: "The Ultimate Python Masterclass for Beginners",
        slug: "ultimate-python-masterclass",
        description: "A definitive, beginner-friendly course covering everything from absolute Python basics to functions, lists, dictionaries, file handling, and object-oriented programming. Highly detailed, interactive, and beautifully designed. Includes a massive 25-question final exam to truly test your mastery.",
        image: "https://quantumzeitgeist.com/wp-content/uploads/python.jpg",
        instructor: "69b7983467bb2f063cefab80", // from user snippet
        published: true,
        theme: "blue",
        createdAt: new Date("2026-03-17T10:00:00.000Z"),
        updatedAt: new Date("2026-03-17T10:00:00.000Z")
      });
      await pythonCourse.save();
      console.log('✅ Python course restored successfully.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

restore();
