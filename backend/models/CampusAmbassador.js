import mongoose from 'mongoose';

const campusAmbassadorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true, // only set after approval
  },

  // Application info collected from form
  college:  { type: String, required: true, trim: true },
  mobile:   { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true }, // city, state
  whyJoin:  { type: String, default: '', trim: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
    index: true,
  },

  totalPoints:      { type: Number, default: 0, min: 0, index: true },
  claimedMilestones: [{ type: String, enum: ['bronze', 'silver', 'gold'] }],

  adminNote: { type: String, default: '' },
  approvedAt: { type: Date },
}, { timestamps: true });

campusAmbassadorSchema.index({ userId: 1 }, { unique: true });
campusAmbassadorSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
campusAmbassadorSchema.index({ totalPoints: -1 });
campusAmbassadorSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('CampusAmbassador', campusAmbassadorSchema);
