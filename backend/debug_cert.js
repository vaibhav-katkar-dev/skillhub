import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';

const certSchema = new mongoose.Schema({
  certificateId: String,
  course: mongoose.Schema.Types.ObjectId,
  student: mongoose.Schema.Types.ObjectId
});

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    const Certificate = mongoose.model('Certificate', certSchema);
    const cert = await Certificate.findOne({ certificateId: 'CERT-393BCB70' });
    console.log('Cert raw:', JSON.stringify(cert, null, 2));
    
    if (cert && cert.course) {
      const Course = mongoose.model('Course', new mongoose.Schema({ title: String }));
      const course = await Course.findById(cert.course);
      console.log('Course found via direct findById:', !!course);
      if (course) console.log('Course title:', course.title);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
