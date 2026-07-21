/**
 * ambassadorPoints.js (v2.0)
 * Central helper for awarding ambassador points, tracking history, and calculating levels/badges.
 * ALL point math and rules live here — single source of truth.
 */

import CampusAmbassador from '../models/CampusAmbassador.js';
import ReferralEvent from '../models/ReferralEvent.js';
import PointHistory from '../models/PointHistory.js';
import {
  AMBASSADOR_LEVELS,
  POINT_RULES,
  ACHIEVEMENT_BADGES,
  calculateRevenuePoints,
} from '../config/ambassadorConfig.js';

export { AMBASSADOR_LEVELS, POINT_RULES, ACHIEVEMENT_BADGES };

/**
 * Determine effective level & revenue share % for an ambassador.
 */
export function getAmbassadorLevel(totalPoints = 0, levelOverride = null, customRevenueShare = null) {
  const points = Math.max(0, totalPoints);
  let levelKey = 'explorer';

  if (levelOverride && AMBASSADOR_LEVELS[levelOverride]) {
    levelKey = levelOverride;
  } else if (points >= 6000) {
    levelKey = 'platinum';
  } else if (points >= 3000) {
    levelKey = 'gold';
  } else if (points >= 1500) {
    levelKey = 'silver';
  } else if (points >= 500) {
    levelKey = 'bronze';
  }

  const levelInfo = { ...AMBASSADOR_LEVELS[levelKey] };

  // Calculate actual display revenue share %
  if (customRevenueShare !== null && customRevenueShare !== undefined && !isNaN(customRevenueShare)) {
    levelInfo.effectiveRevenueShare = Number(customRevenueShare);
  } else {
    levelInfo.effectiveRevenueShare = levelInfo.revenueSharePercent;
  }

  return levelInfo;
}

/**
 * Award points to an ambassador for a referral event.
 * Ensures duplicate prevention, updates CampusAmbassador, and writes PointHistory audit.
 */
export async function awardPoints(ambassadorId, eventType, opts = {}) {
  if (!ambassadorId) return { points: 0, skipped: true, reason: 'No ambassadorId' };

  const {
    referredUserId = null,
    amountPaidInr = 0,
    fullPriceInr = 0,
    couponCode = null,
    couponDiscount = null,
    referenceId = null,
    description = '',
    meta = {},
  } = opts;

  // ── Single-award & Rate-limiting Duplicate Checks ─────────────────────────────
  if (['profile_completed', 'portfolio_published', 'first_certificate', 'student_becomes_ambassador'].includes(eventType)) {
    if (referredUserId || referenceId) {
      const query = { ambassadorId, eventType };
      if (referredUserId) query.referredUserId = referredUserId;
      if (referenceId) query.meta = { ...meta, referenceId };

      const existing = await ReferralEvent.findOne(query).lean();
      if (existing) {
        return { points: 0, skipped: true, reason: 'Duplicate event awarded previously' };
      }
    }
  }

  if (eventType === 'login' && referredUserId) {
    // Capped at 5 login credits per referred user
    const existingCount = await ReferralEvent.countDocuments({
      ambassadorId,
      referredUserId,
      eventType: 'login',
    });
    if (existingCount >= 5) {
      return { points: 0, skipped: true, reason: 'Max login credits reached for referred user' };
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
    if (existing) return { points: 0, skipped: true, reason: 'Daily login point already awarded' };
  }

  // ── Calculate Points ───────────────────────────────────────────────────────
  let points = 0;
  if (['paid_course', 'paid_hackathon', 'paid_simulation'].includes(eventType)) {
    points = calculateRevenuePoints(amountPaidInr);
  } else if (POINT_RULES[eventType] !== undefined) {
    points = POINT_RULES[eventType];
  }

  if (points <= 0) {
    return { points: 0, skipped: true, reason: 'Zero points calculated' };
  }

  // ── Persist ReferralEvent + PointHistory Audit + Update CampusAmbassador ──────
  try {
    const defaultDesc = description || getEventDescription(eventType, amountPaidInr);

    await ReferralEvent.create({
      ambassadorId,
      referredUserId,
      eventType,
      points,
      amountPaidInr: amountPaidInr || 0,
      fullPriceInr: fullPriceInr || 0,
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || null,
      meta,
    });

    await PointHistory.create({
      ambassadorId,
      points,
      eventType,
      description: defaultDesc,
      referenceId: referenceId ? String(referenceId) : null,
      addedBy: 'system',
    });

    const updatedAmb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      {
        $inc: {
          totalPoints: points,
          totalSVPoints: points,
        },
      },
      { new: true }
    );

    return { points, skipped: false, newTotal: updatedAmb?.totalPoints || 0 };
  } catch (err) {
    console.error('[AmbassadorPoints] Error awarding points:', err);
    return { points: 0, skipped: true, error: err.message };
  }
}

/**
 * Manually adjust points (Add/Deduct) by Admin with MANDATORY reason.
 */
export async function adjustPointsManually(ambassadorId, points, reason, adminUserId = 'admin') {
  if (!ambassadorId) throw new Error('Ambassador ID is required.');
  if (points === 0 || isNaN(points)) throw new Error('Points adjustment must be a non-zero number.');
  if (!reason || !String(reason).trim()) throw new Error('Mandatory reason required for manual point adjustment.');

  const amb = await CampusAmbassador.findById(ambassadorId);
  if (!amb) throw new Error('Ambassador not found.');

  const pointsNum = Number(points);
  const cleanReason = String(reason).trim();

  // Create PointHistory audit record
  await PointHistory.create({
    ambassadorId: amb._id,
    points: pointsNum,
    eventType: pointsNum > 0 ? 'admin_addition' : 'admin_deduction',
    description: cleanReason,
    addedBy: String(adminUserId),
  });

  // Also store as a ReferralEvent for consistency
  await ReferralEvent.create({
    ambassadorId: amb._id,
    eventType: pointsNum > 0 ? 'admin_addition' : 'admin_deduction',
    points: pointsNum,
    meta: { reason: cleanReason, adminUserId },
  });

  const updatedAmb = await CampusAmbassador.findByIdAndUpdate(
    amb._id,
    {
      $inc: {
        totalPoints: pointsNum,
        totalSVPoints: pointsNum,
      },
    },
    { new: true }
  );

  return updatedAmb;
}

/**
 * Calculate dynamic achievement badges for an ambassador.
 */
export function calculateBadges(stats = {}, totalPoints = 0, eventTypesSeen = []) {
  return ACHIEVEMENT_BADGES.map(badge => {
    let unlocked = false;

    switch (badge.reqType) {
      case 'referrals':
        unlocked = (stats.totalReferrals || 0) >= badge.reqCount;
        break;
      case 'portfolios':
        unlocked = (stats.totalPortfolios || 0) >= badge.reqCount;
        break;
      case 'certificates':
        unlocked = (stats.totalCerts || 0) >= badge.reqCount;
        break;
      case 'paidActivities':
        unlocked = (stats.paidActivities || 0) >= badge.reqCount;
        break;
      case 'points':
        unlocked = totalPoints >= badge.reqCount;
        break;
      default:
        unlocked = false;
    }

    return {
      ...badge,
      unlocked,
    };
  });
}

function getEventDescription(eventType, amountPaid = 0) {
  switch (eventType) {
    case 'ambassador_approved': return 'Campus Ambassador Approval Bonus (+20 SV Points)';
    case 'registration': return 'Referred user registration';
    case 'profile_completed': return 'Referred user profile completed';
    case 'portfolio_published': return 'Referred user portfolio published';
    case 'first_certificate': return 'Referred user first certificate earned';
    case 'additional_certificate': return 'Referred user additional certificate earned';
    case 'linkedin_certificate_share': return 'Referred user shared certificate on LinkedIn';
    case 'student_becomes_ambassador': return 'Referred student became a Campus Ambassador';
    case 'paid_course': return `Referred user paid course purchase (₹${amountPaid})`;
    case 'paid_hackathon': return `Referred user paid hackathon entry (₹${amountPaid})`;
    case 'paid_simulation': return `Referred user paid job simulation cert (₹${amountPaid})`;
    default: return eventType;
  }
}
