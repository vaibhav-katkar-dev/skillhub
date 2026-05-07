import express from 'express';
import CoursePrice from '../models/CoursePrice.js';
import { authOptions, adminCheck } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────
// Shared helper: resolve the price for a given courseId.
// Returns price in PAISE.
// Falls back to DEFAULT_PRICE_PAISE (₹99) if no record found or inactive.
// ─────────────────────────────────────────────────────────
export const DEFAULT_PRICE_PAISE = 9900; // ₹99

export async function getCoursePricePaise(courseId) {
  if (!courseId) return DEFAULT_PRICE_PAISE;
  try {
    const doc = await CoursePrice.findOne({ courseId: String(courseId), isActive: true }).lean();
    if (doc && Number.isInteger(doc.pricePaise) && doc.pricePaise >= 100) {
      return doc.pricePaise;
    }
  } catch {
    // Swallow — fall back to default
  }
  return DEFAULT_PRICE_PAISE;
}

// ─────────────────────────────────────────────────────────
// ADMIN routes MUST be declared before /:courseId so Express
// does not match "admin" as a courseId param.
// ─────────────────────────────────────────────────────────

// ADMIN  GET /api/prices/admin/all — list all custom prices
router.get('/admin/all', authOptions, adminCheck, async (req, res) => {
  try {
    const prices = await CoursePrice.find().sort({ updatedAt: -1 }).lean();
    res.json({ prices, defaultPricePaise: DEFAULT_PRICE_PAISE });
  } catch (err) {
    console.error('[Prices] List error:', err);
    res.status(500).json({ message: 'Failed to fetch prices.' });
  }
});

// ADMIN  PUT /api/prices/admin/:courseId — upsert price
// Body: { pricePaise: integer, courseTitle?: string }
router.put('/admin/:courseId', authOptions, adminCheck, async (req, res) => {
  try {
    const courseId = String(req.params.courseId).trim();
    const { pricePaise, courseTitle = '' } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required.' });
    }

    const parsed = Number(pricePaise);
    if (!Number.isInteger(parsed) || parsed < 100) {
      return res.status(400).json({
        message: 'pricePaise must be an integer ≥ 100 (minimum ₹1).',
      });
    }
    if (parsed > 100_000_000) {
      // Hard cap: ₹10,00,000 max
      return res.status(400).json({ message: 'Price too high. Maximum is ₹10,00,000.' });
    }

    const doc = await CoursePrice.findOneAndUpdate(
      { courseId },
      {
        courseId,
        courseTitle: String(courseTitle).slice(0, 200).trim(),
        pricePaise: parsed,
        isActive: true,
        updatedBy: req.user.id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      message: `Price for "${courseId}" set to ₹${parsed / 100}.`,
      price: doc,
    });
  } catch (err) {
    console.error('[Prices] Upsert error:', err);
    res.status(500).json({ message: 'Failed to update price.' });
  }
});

// ADMIN  DELETE /api/prices/admin/:courseId — remove custom price (reverts to default)
router.delete('/admin/:courseId', authOptions, adminCheck, async (req, res) => {
  try {
    const courseId = String(req.params.courseId).trim();
    await CoursePrice.findOneAndDelete({ courseId });
    res.json({ message: `Custom price removed for "${courseId}". Reverts to ₹${DEFAULT_PRICE_PAISE / 100}.` });
  } catch (err) {
    console.error('[Prices] Delete error:', err);
    res.status(500).json({ message: 'Failed to delete price.' });
  }
});

// ─────────────────────────────────────────────────────────
// ADMIN  PATCH /api/prices/admin/:courseId/toggle
// Toggle isActive (deactivate custom price → falls back to default)
// ─────────────────────────────────────────────────────────
router.patch('/admin/:courseId/toggle', authOptions, adminCheck, async (req, res) => {
  try {
    const courseId = String(req.params.courseId).trim();
    const doc = await CoursePrice.findOne({ courseId });
    if (!doc) return res.status(404).json({ message: 'No custom price found for this course.' });
    doc.isActive = !doc.isActive;
    await doc.save();
    res.json({
      message: `Price ${doc.isActive ? 'activated' : 'deactivated'} for course "${courseId}".`,
      price: doc,
    });
  } catch (err) {
    console.error('[Prices] Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle price.' });
  }
});

// ─────────────────────────────────────────────────────────
// PUBLIC  GET /api/prices/:courseId
// Returns the effective exam price for a course.
// Used by QuizView to display the price before payment.
// MUST be registered LAST — after all /admin/* routes —
// so Express does not treat "admin" as a :courseId param.
// ─────────────────────────────────────────────────────────
router.get('/:courseId', async (req, res) => {
  try {
    const courseId = String(req.params.courseId).trim();
    if (!courseId) return res.status(400).json({ message: 'courseId is required.' });
    const pricePaise = await getCoursePricePaise(courseId);
    return res.json({
      courseId,
      pricePaise,
      priceRupees: pricePaise / 100,
    });
  } catch (err) {
    console.error('[Prices] Fetch error:', err);
    res.status(500).json({ message: 'Server error fetching price.' });
  }
});

export default router;
