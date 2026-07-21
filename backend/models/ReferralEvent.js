import mongoose from 'mongoose';

const referralEventSchema = new mongoose.Schema({
  ambassadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampusAmbassador',
    required: true,
    index: true,
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for ambassador_login / ambassador_approved
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'registration',
      'login',
      'free_hackathon',
      'paid_hackathon',
      'paid_course',
      'paid_simulation',
      'certificate',
      'ambassador_login',
      'ambassador_approved',
    ],
    index: true,
  },
  points: { type: Number, required: true, min: 0 },

  // Payment-aware fields (0 for non-payment events)
  amountPaidInr: { type: Number, default: 0 },
  fullPriceInr:  { type: Number, default: 0 },
  couponCode:    { type: String, default: null },
  couponDiscount:{ type: Number, default: null }, // percent or flat amount

  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // events are immutable
  versionKey: false,
});

referralEventSchema.index({ ambassadorId: 1, createdAt: -1 });
referralEventSchema.index({ referredUserId: 1, eventType: 1 }); // for login cap check

// Auto-delete events older than 2 years to keep collection light
referralEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 730 });

export default mongoose.model('ReferralEvent', referralEventSchema);
