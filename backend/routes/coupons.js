import express from 'express';
import DiscountCoupon from '../models/DiscountCoupon.js';
import { authOptions, adminCheck } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────
// PUBLIC  POST /api/coupons/validate
// Body: { code, courseId }  (courseId kept for future per-course coupons)
// Returns: discount details if valid
// ─────────────────────────────────────────────────────────
router.post('/validate', authOptions, async (req, res) => {
  try {
    const code = (req.body.code || '').toString().trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code is required.' });
    }

    const coupon = await DiscountCoupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Coupon not found.' });
    }

    if (!coupon.isValid()) {
      let reason = 'This coupon is not valid.';
      if (!coupon.isActive) reason = 'This coupon has been deactivated.';
      else if (coupon.validUntil && new Date() > coupon.validUntil) reason = 'This coupon has expired.';
      else if (coupon.validFrom && new Date() < coupon.validFrom) reason = 'This coupon is not yet active.';
      else if (coupon.maxUsageLimit !== null && coupon.usedCount >= coupon.maxUsageLimit) {
        reason = 'This coupon has reached its usage limit.';
      }
      return res.status(400).json({ valid: false, message: reason });
    }

    // Original amount for a regular student is ₹99 = 9900 paise
    const BASE_PAISE = 9900;
    const discountedPaise = coupon.applyDiscount(BASE_PAISE);
    const savedPaise = BASE_PAISE - discountedPaise;

    return res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      description: coupon.description,
      originalAmountPaise: BASE_PAISE,
      discountedAmountPaise: discountedPaise,
      savedAmountPaise: savedPaise,
      originalAmountRupees: BASE_PAISE / 100,
      discountedAmountRupees: discountedPaise / 100,
      savedAmountRupees: savedPaise / 100,
      usageRemaining: coupon.maxUsageLimit !== null
        ? coupon.maxUsageLimit - coupon.usedCount
        : null,
      validUntil: coupon.validUntil || null,
    });
  } catch (err) {
    console.error('[Coupons] Validate error:', err);
    res.status(500).json({ valid: false, message: 'Server error validating coupon.' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN  GET /api/coupons/admin
// List all coupons
// ─────────────────────────────────────────────────────────
router.get('/admin', authOptions, adminCheck, async (req, res) => {
  try {
    const coupons = await DiscountCoupon.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(coupons);
  } catch (err) {
    console.error('[Coupons] List error:', err);
    res.status(500).json({ message: 'Failed to fetch coupons.' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN  POST /api/coupons/admin
// Create a coupon
// ─────────────────────────────────────────────────────────
router.post('/admin', authOptions, adminCheck, async (req, res) => {
  try {
    const {
      code,
      discountType = 'percentage',
      discountValue,
      maxUsageLimit,
      validFrom,
      validUntil,
      description = '',
    } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'A valid coupon code is required.' });
    }
    const cleanCode = code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]+$/.test(cleanCode) || cleanCode.length < 3 || cleanCode.length > 30) {
      return res.status(400).json({ message: 'Code must be 3-30 characters: A-Z, 0-9, _ or -.' });
    }
    if (!['percentage', 'flat'].includes(discountType)) {
      return res.status(400).json({ message: 'discountType must be "percentage" or "flat".' });
    }
    const dv = Number(discountValue);
    if (isNaN(dv) || dv <= 0) {
      return res.status(400).json({ message: 'discountValue must be a positive number.' });
    }
    if (discountType === 'percentage' && dv > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100.' });
    }
    if (discountType === 'flat' && dv >= 99) {
      return res.status(400).json({ message: 'Flat discount cannot be ≥ ₹99 (original price).' });
    }

    const existing = await DiscountCoupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(409).json({ message: `Coupon code "${cleanCode}" already exists.` });
    }

    const coupon = new DiscountCoupon({
      code: cleanCode,
      discountType,
      discountValue: dv,
      maxUsageLimit: maxUsageLimit ? Number(maxUsageLimit) : null,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      description: String(description).slice(0, 200),
      createdBy: req.user.id,
      isActive: true,
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully.', coupon });
  } catch (err) {
    console.error('[Coupons] Create error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Coupon code already exists.' });
    }
    res.status(500).json({ message: 'Failed to create coupon.' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN  PATCH /api/coupons/admin/:id/toggle
// Toggle isActive
// ─────────────────────────────────────────────────────────
router.patch('/admin/:id/toggle', authOptions, adminCheck, async (req, res) => {
  try {
    const coupon = await DiscountCoupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}.`, coupon });
  } catch (err) {
    console.error('[Coupons] Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle coupon.' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN  DELETE /api/coupons/admin/:id
// Permanently delete a coupon
// ─────────────────────────────────────────────────────────
router.delete('/admin/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const coupon = await DiscountCoupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (err) {
    console.error('[Coupons] Delete error:', err);
    res.status(500).json({ message: 'Failed to delete coupon.' });
  }
});

export default router;
