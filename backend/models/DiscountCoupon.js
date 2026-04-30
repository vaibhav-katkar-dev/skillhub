import mongoose from 'mongoose';

const discountCouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[A-Z0-9_-]+$/,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    default: 'percentage',
  },
  discountValue: {
    // percent (0-100) or flat rupees
    type: Number,
    required: true,
    min: 0,
  },
  maxUsageLimit: {
    // null means unlimited; positive integer = hard cap
    type: Number,
    default: null,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  validFrom: {
    type: Date,
    default: null,
  },
  validUntil: {
    type: Date,
    default: null,   // null = no expiry
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: 200,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// isActive+validUntil compound index for efficient active-coupon queries
discountCouponSchema.index({ isActive: 1, validUntil: 1 });

/** Returns true only if this coupon is currently valid for use */
discountCouponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  const now = new Date();
  if (this.validFrom && now < this.validFrom) return false;
  if (this.validUntil && now > this.validUntil) return false;
  if (this.maxUsageLimit !== null && this.usedCount >= this.maxUsageLimit) return false;
  return true;
};

/**
 * Calculate the final charge in paise given original amount in paise.
 * Never goes below 100 paise (₹1).
 */
discountCouponSchema.methods.applyDiscount = function (originalPaise) {
  let discounted = originalPaise;
  if (this.discountType === 'percentage') {
    const fraction = Math.min(this.discountValue, 100) / 100;
    discounted = Math.round(originalPaise * (1 - fraction));
  } else {
    // flat — value is in rupees, convert to paise
    discounted = originalPaise - Math.round(this.discountValue * 100);
  }
  return Math.max(discounted, 100); // minimum ₹1
};

export default mongoose.model('DiscountCoupon', discountCouponSchema);
