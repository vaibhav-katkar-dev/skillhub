import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';

async function cleanup() {
  try {
    await mongoose.connect(MONGO_URI);
    const Course = mongoose.model('Course', new mongoose.Schema({}));
    const Lesson = mongoose.model('Lesson', new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId }));
    const Quiz = mongoose.model('Quiz', new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId }));
    const Certificate = mongoose.model('Certificate', new mongoose.Schema({ course: mongoose.Schema.Types.ObjectId, certificateId: String }));

    const courses = await Course.find();
    const courseIds = courses.map(c => c._id.toString());
    console.log(`Current valid course IDs in DB (${courseIds.length}):`, courseIds);

    // Clean up or identify orphans
    const orphanedQuizzes = await Quiz.find({ course: { $nin: courseIds } });
    if (orphanedQuizzes.length > 0) {
      console.log(`Deleting ${orphanedQuizzes.length} orphaned quizzes with no valid course.`);
      await Quiz.deleteMany({ course: { $nin: courseIds } });
    }

    const orphanedLessons = await Lesson.find({ course: { $nin: courseIds } });
    if (orphanedLessons.length > 0) {
      console.log(`Deleting ${orphanedLessons.length} orphaned lessons with no valid course.`);
      await Lesson.deleteMany({ course: { $nin: courseIds } });
    }

    const orphanedCerts = await Certificate.find({ course: { $nin: courseIds } });
    if (orphanedCerts.length > 0) {
      console.log(`Warning: Found ⚠️ ${orphanedCerts.length} orphaned certificates pointing to deleted course IDs.`);
      // We'll leave the certs for now but they won't show up in the dashboard because of previous fixes
      // Actually, let's delete them to clean up the DB if they aren't repairable
      console.log('Cleaning up orphaned certificates to ensure a fresh start for affected courses...');
      await Certificate.deleteMany({ course: { $nin: courseIds } });
    }

    console.log('✅ Database cleanup completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }
}

cleanup();
