import mongoose from 'mongoose';

// Lightweight log — one document per login attempt.
// Kept slim intentionally so inserts are fast and the collection stays small.
const loginEventSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  method:  { type: String, enum: ['email', 'google'], default: 'email' },
  // Redundant hour field for ultra-fast $group by hour without $hour operator overhead
  hour:    { type: Number, min: 0, max: 23 },   // 0-23 (UTC)
}, {
  timestamps: true,   // createdAt = exact login time
  versionKey: false,
});

// TTL: auto-delete events older than 90 days to keep collection light
loginEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.model('LoginEvent', loginEventSchema);
