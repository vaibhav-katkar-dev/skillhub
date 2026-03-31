import mongoose from 'mongoose';

const hackathonRegistrationSchema = new mongoose.Schema({
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true, index: true },
  teamName: { type: String, required: true, trim: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  members: [{
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name:  { type: String, required: true, trim: true },
  }],
  status: {
    type: String,
    enum: ['registered', 'payment_pending', 'submitted', 'under_review', 'approved', 'rejected', 'winner'],
    default: 'registered',
    index: true,
  },
  adminRemarks: { type: String, default: '' },
  payment: {
    required:          { type: Boolean, default: false },
    amountInr:         { type: Number, default: 0 },
    status:            { type: String, enum: ['not_required', 'pending', 'paid'], default: 'not_required' },
    razorpayOrderId:   { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '', index: true },
    paidAt:            { type: Date },
  },
  submissions: [{
    link:        { type: String, required: true, trim: true },
    note:        { type: String, default: '', trim: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date, default: Date.now },
  }],
  latestSubmissionAt: { type: Date },
  // Winner tracking - set by admin
  isWinner:    { type: Boolean, default: false, index: true },
  winnerRank:  { type: String, default: '' },   // e.g. "1st", "2nd", "Best UI"
  winnerNote:  { type: String, default: '' },
  winnerSetAt: { type: Date },
}, { timestamps: true });

hackathonRegistrationSchema.index({ hackathon: 1, leader: 1 }, { unique: true });
hackathonRegistrationSchema.index({ hackathon: 1, teamName: 1 }, { unique: true });
hackathonRegistrationSchema.index({ hackathon: 1, isWinner: 1 });

export default mongoose.model('HackathonRegistration', hackathonRegistrationSchema);
