import mongoose from 'mongoose';

/**
 * SimulationPrice — stores the certificate cost (INR) for each job simulation.
 *
 * Prices are stored in INR (integer) so they can be compared directly to
 * certCost values in job-simulations.json.
 *
 * If no document exists for a simulation, the system falls back to the
 * certCost field in the JSON file, and ultimately to DEFAULT_SIM_CERT_COST.
 */
const simulationPriceSchema = new mongoose.Schema(
  {
    simId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Human-readable title stored for easy admin display (denormalised)
    simTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    // Certificate price in INR (integer). E.g. ₹199
    certCostInr: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'certCostInr must be an integer.',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('SimulationPrice', simulationPriceSchema);
