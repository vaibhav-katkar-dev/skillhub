import mongoose from 'mongoose';

const rewardRequestSchema = new mongoose.Schema({
  ambassadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampusAmbassador',
    required: true,
    index: true,
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    required: true,
  },
  pointsAtRequest: { type: Number, required: true },
  status: {
    type: String,
    enum: ['locked', 'eligible', 'requested', 'approved', 'rejected', 'claimed'],
    default: 'requested',
    index: true,
  },
  adminNote: { type: String, default: '' },
}, { timestamps: true });

// One request per tier per ambassador
rewardRequestSchema.index({ ambassadorId: 1, tier: 1 }, { unique: true });

export default mongoose.model('RewardRequest', rewardRequestSchema);
