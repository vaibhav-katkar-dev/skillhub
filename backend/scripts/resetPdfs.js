import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';

await mongoose.connect(MONGO_URI);
const Cert = mongoose.model('Certificate', new mongoose.Schema({}, { strict: false }));

const result = await Cert.updateMany({}, {
  $set: { pdfStatus: 'pending', pdfSizeBytes: 0, pdfError: '' },
  $unset: { pdfBuffer: '', pdfGeneratedAt: '' }
});

console.log(`Reset ${result.modifiedCount} certificates — they will regenerate with the new premium design on next download.`);
await mongoose.disconnect();
process.exit(0);
