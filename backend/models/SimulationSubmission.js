import mongoose from 'mongoose';

// Submission record for each individual task a user submits in a Job Simulation.
// Uses a unique compound index on (userId, simId, taskNum) so upserts are
// idempotent — resubmitting a task simply updates the existing row.
const simulationSubmissionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  simId:       { type: String, required: true }, // e.g. "frontend-developer"
  taskNum:     { type: Number, required: true },
  taskType:    { type: String, default: '' },    // e.g. "Coding", "Design"
  // URL is stored as-is from the validated URL string (protocol + host + path).
  // It was validated server-side before storage so it is a safe https:// link.
  url:         { type: String, default: '' },
  // Status lifecycle: pending → reviewing → completed | rejected
  // Auto-validated submissions are immediately set to "completed".
  status:      { type: String, enum: ['pending','reviewing','completed','rejected'], default: 'completed' },
  // Optional admin feedback (currently unused in automated flow).
  feedback:    { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt:  { type: Date },
}, { timestamps: true });

// Unique compound index: prevents duplicate rows and enables fast O(1) upserts.
simulationSubmissionSchema.index({ userId: 1, simId: 1, taskNum: 1 }, { unique: true });
// Secondary index for "all submissions by user" queries used in profile pages.
simulationSubmissionSchema.index({ userId: 1, simId: 1 });
// Index for admin dashboard simulation analytics and submission logs.
simulationSubmissionSchema.index({ simId: 1, submittedAt: -1 });

export default mongoose.model('SimulationSubmission', simulationSubmissionSchema);
