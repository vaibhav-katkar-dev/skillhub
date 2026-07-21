/**
 * ambassadorPoints.js (v2.0)
 * Central helper for awarding ambassador points, tracking history, and calculating levels/badges.
 * ALL point math and rules live here — single source of truth.
 */

import CampusAmbassador from '../models/CampusAmbassador.js';
import ReferralEvent from '../models/ReferralEvent.js';
import PointHistory from '../models/PointHistory.js';
import User from '../models/User.js';
import {
  AMBASSADOR_LEVELS,
  POINT_RULES,
  ACHIEVEMENT_BADGES,
  calculateRevenuePoints,
} from '../config/ambassadorConfig.js';

export { AMBASSADOR_LEVELS, POINT_RULES, ACHIEVEMENT_BADGES };

/**
 * Determine effective level & revenue share % for an ambassador.
 * Uses totalVerifiedPoints for level calculations.
 */
export function getAmbassadorLevel(totalVerifiedPoints = 0, levelOverride = null, customRevenueShare = null) {
  const points = Math.max(0, totalVerifiedPoints);
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
 * Handles pending vs verified status and prevents self-referrals.
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
    status = eventType === 'registration' ? 'pending' : 'verified',
    meta = {},
  } = opts;

  // ── Self-Referral Prevention ───────────────────────────────────────────────
  if (referredUserId) {
    const amb = await CampusAmbassador.findById(ambassadorId).lean();
    if (amb && String(amb.userId) === String(referredUserId)) {
      return { points: 0, skipped: true, reason: 'Self-referral prohibited' };
    }
  }

  // ── Single-award & Rate-limiting Duplicate Checks ─────────────────────────────
  if (['profile_completed', 'portfolio_published', 'first_certificate', 'student_becomes_ambassador', 'student_ambassador_verified'].includes(eventType)) {
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

  if (eventType === 'free_course_certificate' && referredUserId) {
    const count = await ReferralEvent.countDocuments({
      ambassadorId,
      referredUserId,
      eventType: 'free_course_certificate',
    });
    if (count >= 2) {
      return { points: 0, skipped: true, reason: 'Capped at max 2 free course certificates per referred student' };
    }
  }

  if (eventType === 'login' && referredUserId) {
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
      status,
      points,
      amountPaidInr: amountPaidInr || 0,
      fullPriceInr: fullPriceInr || 0,
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || null,
      meta,
    });

    if (status === 'verified') {
      await PointHistory.create({
        ambassadorId,
        points,
        eventType,
        description: defaultDesc,
        referenceId: referenceId ? String(referenceId) : null,
        addedBy: 'system',
      });
    }

    const incQuery = status === 'pending'
      ? { totalPendingPoints: points }
      : {
          totalPoints: points,
          totalSVPoints: points,
          totalVerifiedPoints: points,
        };

    const updatedAmb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $inc: incQuery },
      { new: true }
    );

    // If verified event performed by a referred user, check if this completes referred user's 1st verified milestone!
    if (status === 'verified' && referredUserId) {
      checkAmbassadorFirstMilestone(referredUserId).catch(() => {});
    }

    return {
      points,
      skipped: false,
      newVerifiedTotal: updatedAmb?.totalVerifiedPoints || 0,
      newPendingTotal: updatedAmb?.totalPendingPoints || 0,
    };
  } catch (err) {
    console.error('[AmbassadorPoints] Error awarding points:', err);
    return { points: 0, skipped: true, error: err.message };
  }
}

/**
 * Transition points from pending to verified status (e.g. when user verifies email).
 */
export async function verifyPendingPoints(ambassadorId, eventType, referredUserId) {
  if (!ambassadorId || !referredUserId) return null;

  try {
    const event = await ReferralEvent.findOne({
      ambassadorId,
      referredUserId,
      eventType,
      status: 'pending',
    });

    if (!event) return null;

    event.status = 'verified';
    await event.save();

    await PointHistory.create({
      ambassadorId,
      points: event.points,
      eventType: `${eventType}_verified`,
      description: `${getEventDescription(eventType)} (Email Verified)`,
      addedBy: 'system',
    });

    const updatedAmb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      {
        $inc: {
          totalPendingPoints: -event.points,
          totalVerifiedPoints: event.points,
          totalPoints: event.points,
          totalSVPoints: event.points,
        },
      },
      { new: true }
    );

    // Check if referred user is an ambassador who now completed 1st verified milestone
    checkAmbassadorFirstMilestone(referredUserId).catch(() => {});

    return updatedAmb;
  } catch (err) {
    console.error('[AmbassadorPoints] Error verifying pending points:', err);
    return null;
  }
}

/**
 * Automatic Point Clawback for payment refunds / cancellations.
 * Automatically deducts points and re-locks milestone tiers if balance drops below threshold.
 */
export async function clawbackPoints(ambassadorId, referenceId, reason = 'Payment Refund Clawback') {
  if (!ambassadorId || !referenceId) return { success: false, reason: 'Missing parameters' };

  try {
    // Find original referral event associated with payment
    const originalEvent = await ReferralEvent.findOne({
      ambassadorId,
      $or: [
        { 'meta.referenceId': String(referenceId) },
        { 'meta.paymentId': String(referenceId) },
        { 'meta.orderId': String(referenceId) },
      ],
      status: { $ne: 'clawed_back' },
    });

    if (!originalEvent) {
      return { success: false, reason: 'Original event not found or already clawed back' };
    }

    const clawbackAmount = originalEvent.points;

    // Create clawback event
    await ReferralEvent.create({
      ambassadorId,
      referredUserId: originalEvent.referredUserId,
      eventType: 'payment_refund_clawback',
      status: 'clawed_back',
      points: -clawbackAmount,
      amountPaidInr: originalEvent.amountPaidInr,
      meta: {
        originalEventId: originalEvent._id,
        referenceId: String(referenceId),
        reason,
      },
    });

    // Mark original event as clawed_back
    originalEvent.status = 'clawed_back';
    await originalEvent.save();

    // Create audit record
    await PointHistory.create({
      ambassadorId,
      points: -clawbackAmount,
      eventType: 'payment_refund_clawback',
      description: `Clawback: ${reason} (-${clawbackAmount} SV Points)`,
      referenceId: String(referenceId),
      addedBy: 'system',
    });

    // Deduct points from CampusAmbassador
    const updatedAmb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      {
        $inc: {
          totalPoints: -clawbackAmount,
          totalSVPoints: -clawbackAmount,
          totalVerifiedPoints: -clawbackAmount,
        },
      },
      { new: true }
    );

    return {
      success: true,
      clawbackedPoints: clawbackAmount,
      newVerifiedTotal: updatedAmb?.totalVerifiedPoints || 0,
    };
  } catch (err) {
    console.error('[AmbassadorPoints] Error in clawbackPoints:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Checks if a user is an ambassador who has completed their 1st verified milestone activity.
 * If yes, unlocks +100 SV points for the referrer (`student_ambassador_verified`).
 */
export async function checkAmbassadorFirstMilestone(userId) {
  if (!userId) return;

  try {
    const amb = await CampusAmbassador.findOne({ userId, status: 'approved' }).lean();
    if (!amb) return;

    const user = await User.findById(userId).lean();
    if (!user || !user.referredBy) return; // Not referred by any ambassador

    // Check if ambassador has at least 1 verified activity
    const verifiedActivityCount = await ReferralEvent.countDocuments({
      ambassadorId: amb._id,
      status: 'verified',
    });

    if (verifiedActivityCount > 0) {
      // Award referrer +100 SV points for verified ambassador network growth
      await awardPoints(user.referredBy, 'student_ambassador_verified', {
        referredUserId: userId,
        description: 'Referred student completed 1st verified milestone as Campus Ambassador',
      });
    }
  } catch (err) {
    console.error('[AmbassadorPoints] Error in checkAmbassadorFirstMilestone:', err);
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
    status: 'verified',
    points: pointsNum,
    meta: { reason: cleanReason, adminUserId },
  });

  const updatedAmb = await CampusAmbassador.findByIdAndUpdate(
    amb._id,
    {
      $inc: {
        totalPoints: pointsNum,
        totalSVPoints: pointsNum,
        totalVerifiedPoints: pointsNum,
      },
    },
    { new: true }
  );

  return updatedAmb;
}

/**
 * Calculate dynamic achievement badges for an ambassador.
 */
export function calculateBadges(stats = {}, totalVerifiedPoints = 0) {
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
        unlocked = totalVerifiedPoints >= badge.reqCount;
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
    case 'free_course_certificate': return 'Referred user free course certificate earned';
    case 'skill_exam_certificate': return 'Referred user passed skill assessment exam';
    case 'paid_course_certificate': return 'Referred user paid course certificate earned';
    case 'first_certificate': return 'Referred user first certificate earned';
    case 'additional_certificate': return 'Referred user additional certificate earned';
    case 'linkedin_certificate_share': return 'Referred user shared certificate on LinkedIn';
    case 'student_becomes_ambassador': return 'Referred student became a Campus Ambassador';
    case 'student_ambassador_verified': return 'Referred student completed 1st verified ambassador activity';
    case 'paid_course': return `Referred user paid course purchase (₹${amountPaid})`;
    case 'paid_hackathon': return `Referred user paid hackathon entry (₹${amountPaid})`;
    case 'paid_simulation': return `Referred user paid job simulation cert (₹${amountPaid})`;
    case 'payment_refund_clawback': return 'Payment refund point clawback';
    default: return eventType;
  }
}
