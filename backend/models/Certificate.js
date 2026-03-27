import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseTitleSnapshot: { type: String, default: '' },
  certificateId: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  pdfUrl: { type: String } // Optional if generating on the fly vs storing
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
