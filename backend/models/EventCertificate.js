import mongoose from 'mongoose';

const eventCertificateSchema = new mongoose.Schema({
  student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  eventType:       { type: String, enum: ['job-simulation', 'hackathon', 'internship'], required: true, index: true },
  eventTitle:      { type: String, required: true },       // e.g. "Frontend Developer Job Simulation" or hackathon title
  role:            { type: String },                       // e.g. "Frontend Developer Intern" or role in hackathon
  certificateId:   { type: String, required: true, unique: true },
  issueDate:       { type: Date, default: Date.now },
  paymentId:       { type: String },                       // Razorpay payment ID
  pdfBuffer:       { type: Buffer, select: false },
  pdfMimeType:     { type: String, default: 'application/pdf' },
  pdfSizeBytes:    { type: Number, default: 0 },
  pdfStatus:       { type: String, enum: ['pending','generating','ready','failed'], default: 'pending' },
  pdfTemplateVersion: { type: Number, default: 1 },
  pdfGeneratedAt:  { type: Date },
  pdfError:        { type: String, default: '' },

  // Hackathon-specific fields (optional)
  hackathonId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', index: true },
  certType:        { type: String, enum: ['participation', 'winner'], default: 'participation' },
  isWinner:        { type: Boolean, default: false },
  winnerRank:      { type: String, default: '' },   // e.g. "1st", "2nd", "Best UI"
  teamName:        { type: String, default: '' },
  customTitle:     { type: String, default: '' },   // admin-customised certificate headline
  customBody:      { type: String, default: '' },   // admin-customised body text
  issuedByAdmin:   { type: Boolean, default: false },
}, { timestamps: true });

// Prevent duplicate certificates of the same type for a student in a single hackathon
eventCertificateSchema.index(
  { student: 1, hackathonId: 1, certType: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model('EventCertificate', eventCertificateSchema);
