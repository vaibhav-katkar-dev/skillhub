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
      'job_sim_free',
      'certificate',
      'first_certificate',
      'additional_certificate',
      'free_course_certificate',
      'skill_exam_certificate',
      'paid_course_certificate',
      'additional_paid_certificate',
      'linkedin_certificate_share',
      'ambassador_login',
      'ambassador_approved',
      'profile_completed',
      'portfolio_published',
      'student_becomes_ambassador',
      'student_ambassador_verified',
      'payment_refund_clawback',
      'admin_addition',
      'admin_deduction',
    ],
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'clawed_back', 'flagged'],
    default: 'verified',
    index: true,
  },
  points: { type: Number, required: true },

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
