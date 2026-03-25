import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Certificate from '../models/Certificate.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  // Get all certificates sorted oldest first
  const allCerts = await Certificate.find({}).sort({ createdAt: 1 });
  
  const seen = new Set();
  const toDelete = [];

  for (const cert of allCerts) {
    const key = `${cert.student.toString()}-${cert.course.toString()}`;
    if (seen.has(key)) {
      toDelete.push(cert._id);
    } else {
      seen.add(key);
    }
  }

  if (toDelete.length === 0) {
    console.log('✅ No duplicate certificates found!');
  } else {
    console.log(`🗑️  Found ${toDelete.length} duplicate certificate(s). Deleting...`);
    await Certificate.deleteMany({ _id: { $in: toDelete } });
    console.log('✅ Duplicates deleted successfully!');
  }

  await mongoose.disconnect();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
