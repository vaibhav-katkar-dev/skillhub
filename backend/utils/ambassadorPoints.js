/**
 * ambassadorPoints.js
 * Central helper for awarding ambassador points.
 * ALL point math lives here — no client-provided values are trusted.
 */
import CampusAmbassador from '../models/CampusAmbassador.js';
import ReferralEvent from '../models/ReferralEvent.js';

// ─── Point config ─────────────────────────────────────────────────────────────
const POINT_CONFIG = {
  registration:         { flat: 10 },
  login:                { flat: 2,  maxPerUser: 5 },
  free_hackathon:       { flat: 15 },
  paid_hackathon:       { ceiling: 100, floor: 10 },
  paid_course:          { ceiling: 60,  floor: 5  },
  paid_simulation:      { ceiling: 80,  floor: 5  },
  certificate:          { flat: 20 },
  ambassador_login:     { flat: 1,  dailyCap: true },
  ambassador_approved:  { flat: 5  },
};

// Milestone tiers (points required to unlock each)
export const MILESTONES = {
  bronze: 500,
  silver: 1500,
  gold:   3000,
};

/**
 * Calculate points for a paid activity using price-aware linear scaling.
 *
 * @param {string} eventType
 * @param {number} amountPaidInr  — actual INR charged (after coupon)
 * @param {number} fullPriceInr   — base price before any coupon
 * @returns {number} points to award
 */
function calcPaidPoints(eventType, amountPaidInr = 0, fullPriceInr = 0) {
  const cfg = POINT_CONFIG[eventType];
  if (!cfg || cfg.flat !== undefined) return cfg?.flat ?? 0;

  const { ceiling, floor } = cfg;
  if (!fullPriceInr || fullPriceInr <= 0) return floor;

  const ratio = Math.min(1, Math.max(0, amountPaidInr / fullPriceInr));
  return Math.floor(floor + (ceiling - floor) * ratio);
}

/**
 * Award points to an ambassador for a referral activity.
 *
 * @param {string|ObjectId} ambassadorId  — CampusAmbassador._id
 * @param {string}          eventType
 * @param {object}          opts
 *   @param {string|ObjectId} [opts.referredUserId]
 *   @param {number}          [opts.amountPaidInr]
 *   @param {number}          [opts.fullPriceInr]
 *   @param {string}          [opts.couponCode]
 *   @param {number}          [opts.couponDiscount]
 *   @param {object}          [opts.meta]
 * @returns {Promise<{points: number, skipped: boolean}>}
 */
export async function awardPoints(ambassadorId, eventType, opts = {}) {
  const cfg = POINT_CONFIG[eventType];
  if (!cfg) return { points: 0, skipped: true };

  const {
    referredUserId = null,
    amountPaidInr  = 0,
    fullPriceInr   = 0,
    couponCode     = null,
    couponDiscount = null,
    meta           = {},
  } = opts;

  // ── Rate limiting checks ───────────────────────────────────────────────────
  if (eventType === 'login' && referredUserId) {
    // Max 5 login credits per referred user per ambassador
    const existingCount = await ReferralEvent.countDocuments({
      ambassadorId,
      referredUserId,
      eventType: 'login',
    });
    if (existingCount >= (cfg.maxPerUser || 5)) {
      return { points: 0, skipped: true };
    }
  }

  if (eventType === 'ambassador_login') {
    // Max 1 credit per UTC day
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const existing = await ReferralEvent.findOne({
      ambassadorId,
      eventType: 'ambassador_login',
      createdAt: { $gte: todayStart },
    }).lean();
    if (existing) return { points: 0, skipped: true };
  }

  // ── Calculate points ───────────────────────────────────────────────────────
  let points;
  if (cfg.flat !== undefined) {
    points = cfg.flat;
  } else {
    points = calcPaidPoints(eventType, amountPaidInr, fullPriceInr);
  }

  if (points <= 0) return { points: 0, skipped: true };

  // ── Persist event + update ambassador atomically ───────────────────────────
  try {
    await ReferralEvent.create({
      ambassadorId,
      referredUserId,
      eventType,
      points,
      amountPaidInr: amountPaidInr || 0,
      fullPriceInr:  fullPriceInr  || 0,
      couponCode:    couponCode    || null,
      couponDiscount:couponDiscount || null,
      meta,
    });

    await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $inc: { totalPoints: points } }
    );
  } catch (err) {
    console.error('[AmbassadorPoints] Error awarding points:', err.message);
    return { points: 0, skipped: true };
  }

  return { points, skipped: false };
}

/**
 * Get which new milestones an ambassador has just crossed (not yet claimed).
 * @param {number} totalPoints
 * @param {string[]} claimedMilestones
 * @returns {string[]} newly unlocked tiers
 */
export function getUnlockedMilestones(totalPoints, claimedMilestones = []) {
  return Object.entries(MILESTONES)
    .filter(([tier, req]) => totalPoints >= req && !claimedMilestones.includes(tier))
    .map(([tier]) => tier);
}
