import mongoose from 'mongoose';

const pointHistorySchema = new mongoose.Schema({
  ambassadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampusAmbassador',
    required: true,
    index: true,
  },
  points: {
    type: Number,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  referenceId: {
    type: String,
    default: null,
  },
  addedBy: {
    type: String,
    default: 'system', // 'system' or 'admin' or Admin User ID
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, { timestamps: true });

pointHistorySchema.index({ ambassadorId: 1, date: -1 });

export default mongoose.model('PointHistory', pointHistorySchema);
