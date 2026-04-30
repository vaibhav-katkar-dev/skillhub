import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import DiscountCoupon from '../models/DiscountCoupon.js';
import { authOptions } from '../middleware/auth.js';

const router = express.Router();

// ──────────────────────────────────────────────────────────────────
// Helper: safely normalise a coupon code string
// ──────────────────────────────────────────────────────────────────
function cleanCode(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const c = raw.trim().toUpperCase();
  return c.length >= 3 ? c : null;
}

// ──────────────────────────────────────────────────────────────────
// POST /api/payments/razorpay-order
// Body: { courseId, couponCode? }
// ──────────────────────────────────────────────────────────────────
router.post('/razorpay-order', authOptions, async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ message: 'A valid courseId is required' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAdminTestMode = user.role === 'admin';

    // Base amount: admin = ₹1, others = ₹99
    let amountToCharge = isAdminTestMode ? 100 : 9900;
    let appliedCoupon = null;
    let savedAmountPaise = 0;

    // Apply coupon only for non-admin users
    if (!isAdminTestMode) {
      const code = cleanCode(couponCode);
      if (code) {
        const coupon = await DiscountCoupon.findOne({ code });

        if (!coupon || !coupon.isValid()) {
          const reason = !coupon
            ? 'Invalid coupon code.'
            : !coupon.isActive
              ? 'This coupon has been deactivated.'
              : coupon.validUntil && new Date() > coupon.validUntil
                ? 'This coupon has expired.'
                : coupon.validFrom && new Date() < coupon.validFrom
                  ? 'This coupon is not yet active.'
                  : 'This coupon has reached its usage limit.';
          return res.status(400).json({ message: reason });
        }

        const discountedPaise = coupon.applyDiscount(amountToCharge);
        savedAmountPaise = amountToCharge - discountedPaise;
        amountToCharge = discountedPaise;
        appliedCoupon = {
          code: coupon.code,
          couponId: coupon._id.toString(),
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          savedAmountRupees: savedAmountPaise / 100,
        };
      }
    }

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const expectedReceipt = `receipt_${courseId}_${req.user.id}`.substring(0, 40);
    const options = {
      amount: amountToCharge,
      currency: 'INR',
      receipt: expectedReceipt,
    };

    const order = await rzp.orders.create(options);

    res.json({
      ...order,
      isAdminTestMode,
      displayAmountRupees: amountToCharge / 100,
      appliedCoupon,
      savedAmountRupees: savedAmountPaise / 100,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// ──────────────────────────────────────────────────────────────────
// POST /api/payments/razorpay-verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature,
//         courseId, couponCode? }
//
// Security model:
//  1. Signature check  → proves Razorpay actually processed this payment
//  2. Receipt check    → proves this order belongs to this user+course
//  3. Amount check     → proves the discount was applied correctly
//
// NOTE: We do NOT re-run coupon.isValid() here.  The coupon was
// validated at order-creation time.  Re-validating here would wrongly
// reject a legitimate payment if the coupon happened to expire or
// reach its limit between order creation and the Razorpay callback.
// ──────────────────────────────────────────────────────────────────
router.post('/razorpay-verify', authOptions, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      couponCode,
    } = req.body;

    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ success: false, message: 'A valid courseId is required' });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay keys not configured' });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    // ── Step 1: Verify Razorpay signature ───────────────────────
    const signBody = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // ── Step 2: Load user & verify receipt ──────────────────────
    const [user, rzp] = await Promise.all([
      User.findById(req.user.id),
      Promise.resolve(new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const order = await rzp.orders.fetch(razorpay_order_id);
    const expectedReceipt = `receipt_${courseId}_${req.user.id}`.substring(0, 40);

    if (!order || order.receipt !== expectedReceipt) {
      return res.status(400).json({
        success: false,
        message: 'Payment does not match this course unlock request',
      });
    }

    // ── Step 3: Recompute expected amount & compare ──────────────
    // We reconstruct the discounted amount using the coupon (if any)
    // WITHOUT calling isValid() — the legitimacy of the payment is
    // already proven by the signature + receipt above.
    const isAdminTestMode = user.role === 'admin';
    let expectedAmount = isAdminTestMode ? 100 : 9900;
    let couponDoc = null;

    if (!isAdminTestMode) {
      const code = cleanCode(couponCode);
      if (code) {
        couponDoc = await DiscountCoupon.findOne({ code });
        if (couponDoc) {
          expectedAmount = couponDoc.applyDiscount(expectedAmount);
        } else {
          // Coupon code claimed but not found — amount must still match
          // (it won't, so the check below will reject it)
          expectedAmount = 9900; // falls back to full price
        }
      }
    }

    if (order.amount !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match the expected charge.',
      });
    }

    // ── Step 4: Atomically record coupon usage ───────────────────
    // Only increment after the amount check passes, so a tampered
    // couponCode that causes a mismatch never burns a real usage slot.
    if (couponDoc) {
      await DiscountCoupon.findByIdAndUpdate(
        couponDoc._id,
        { $inc: { usedCount: 1 } }
      );
    }

    // ── Step 5: Grant exam access ────────────────────────────────
    let attemptRecord = user.quizAttempts?.find(a => a.courseId === courseId);
    if (!attemptRecord) {
      user.quizAttempts.push({ courseId, attempts: 0, unlockedAttempts: 1000 });
    } else {
      attemptRecord.unlockedAttempts = 1000;
    }

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Verification error' });
  }
});

export default router;
