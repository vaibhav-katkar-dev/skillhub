import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  courseTitleSnapshot: { type: String, default: '' },
  certificateId: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  pdfUrl: { type: String }, // Optional if generating on the fly vs storing
  pdfStatus: {
    type: String,
    enum: ['pending', 'queued', 'generating', 'ready', 'failed'],
    default: 'pending',
    index: true,
  },
  pdfBuffer: { type: Buffer, select: false },
  pdfMimeType: { type: String, default: 'application/pdf' },
  pdfSizeBytes: { type: Number, default: 0 },
  pdfGeneratedAt: { type: Date, default: null },
  pdfRequestedAt: { type: Date, default: null },
  pdfError: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
