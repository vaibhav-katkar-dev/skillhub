import mongoose from 'mongoose';

const simulationProgressSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  simulationId:   { type: String, required: true }, // e.g. "frontend-developer"
  completedTasks: [Number],                         // e.g. [1, 2, 4]
}, { timestamps: true });

// Ensure one user has only one progress record per simulation
simulationProgressSchema.index({ user: 1, simulationId: 1 }, { unique: true });

export default mongoose.model('SimulationProgress', simulationProgressSchema);
