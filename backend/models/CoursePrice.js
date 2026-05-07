import mongoose from 'mongoose';

/**
 * CoursePrice — stores the exam unlock price for each course.
 *
 * Prices are stored in PAISE (integer) to avoid floating-point issues.
 * Minimum price is ₹1 (100 paise).
 *
 * If a course has no document here, the system falls back to DEFAULT_PRICE_PAISE
 * defined in the payments route.
 */
const coursePriceSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Human-readable title stored for easy display in admin (denormalised)
    courseTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
    // Price in PAISE. E.g. ₹99 → 9900
    pricePaise: {
      type: Number,
      required: true,
      min: 100, // minimum ₹1
      validate: {
        validator: Number.isInteger,
        message: 'pricePaise must be an integer.',
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

coursePriceSchema.index({ courseId: 1 });

export default mongoose.model('CoursePrice', coursePriceSchema);
