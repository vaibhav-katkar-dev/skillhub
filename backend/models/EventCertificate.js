import mongoose from 'mongoose';

const eventCertificateSchema = new mongoose.Schema({
  student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType:       { type: String, enum: ['job-simulation', 'hackathon', 'internship'], required: true },
  eventTitle:      { type: String, required: true },       // e.g. "Frontend Developer Job Simulation"
  role:            { type: String },                       // e.g. "Frontend Developer Intern"
  certificateId:   { type: String, required: true, unique: true },
  issueDate:       { type: Date, default: Date.now },
  paymentId:       { type: String },                       // Razorpay payment ID
  pdfBuffer:       { type: Buffer, select: false },
  pdfMimeType:     { type: String, default: 'application/pdf' },
  pdfSizeBytes:    { type: Number, default: 0 },
  pdfStatus:       { type: String, enum: ['pending','generating','ready','failed'], default: 'pending' },
  pdfGeneratedAt:  { type: Date },
  pdfError:        { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('EventCertificate', eventCertificateSchema);
