import mongoose from 'mongoose';

const hostRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: String, required: true },
  expectedParticipants: { type: String },
  eventType: { type: String, default: 'hackathon' },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('HostRequest', hostRequestSchema);
