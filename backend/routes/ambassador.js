import express from 'express';
import crypto from 'crypto';
import CampusAmbassador from '../models/CampusAmbassador.js';
import ReferralEvent from '../models/ReferralEvent.js';
import RewardRequest from '../models/RewardRequest.js';
import PointHistory from '../models/PointHistory.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import {
  awardPoints,
  adjustPointsManually,
  getAmbassadorLevel,
  calculateBadges,
  AMBASSADOR_LEVELS,
} from '../utils/ambassadorPoints.js';

const router = express.Router();

const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'https://www.skillvalix.com').replace(/\/$/, '');

// Generate unique referral code: "ca-" + 8 hex chars
function generateReferralCode() {
  return 'ca-' + crypto.randomBytes(4).toString('hex');
}

// Middleware: Resolve ambassador for logged-in user
async function requireAmbassador(req, res, next) {
  try {
    const amb = await CampusAmbassador.findOne({ userId: req.user.id, status: 'approved' }).lean();
    if (!amb) {
      return res.status(403).json({ message: 'You are not an approved Campus Ambassador.' });
    }
    req.ambassador = amb;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC / AMBASSADOR ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/ambassador/apply
 * Submit a campus ambassador application.
 */
router.post('/apply', authOptions, async (req, res) => {
  try {
    const { college, mobile, location, whyJoin } = req.body;

    if (!college || !mobile || !location) {
      return res.status(400).json({ message: 'College, mobile, and location are required.' });
    }

    const mobileClean = String(mobile).replace(/\s/g, '');
    // Accept international numbers: optional '+' followed by 7-15 digits
    if (!/^\+?\d{7,15}$/.test(mobileClean)) {
      return res.status(400).json({ message: 'Please enter a valid mobile number with country code (e.g., +1234567890).' });
    }

    const existing = await CampusAmbassador.findOne({ userId: req.user.id }).lean();
    if (existing) {
      return res.status(400).json({
        message: existing.status === 'pending'
          ? 'Your application is already under review.'
          : existing.status === 'approved'
            ? 'You are already a Campus Ambassador!'
            : 'You already have an application on file.',
        status: existing.status,
      });
    }

    const amb = await CampusAmbassador.create({
      userId: req.user.id,
      college: String(college).trim(),
      mobile: mobileClean,
      location: String(location).trim(),
      whyJoin: String(whyJoin || '').trim().substring(0, 500),
      status: 'pending',
    });

    res.status(201).json({
      message: 'Application submitted! We will review and respond within 48 hours.',
      applicationId: amb._id,
      status: 'pending',
    });
  } catch (err) {
    console.error('[Ambassador] Apply error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already applied.' });
    }
    res.status(500).json({ message: 'Server error submitting application.' });
  }
});

/**
 * GET /api/ambassador/me
 * Check application status & info.
 */
/**
 * GET /api/ambassador/me
 * Check application status & info.
 */
const getAmbassadorMe = async (req, res) => {
  try {
    const amb = await CampusAmbassador.findOne({ userId: req.user.id }).lean();
    if (!amb) return res.json({ status: 'none', ambassador: null });

    const referralUrl = amb.referralCode
      ? `${FRONTEND_URL()}/register?ref=${amb.referralCode}`
      : null;

    const verifiedPts = amb.totalVerifiedPoints ?? amb.totalPoints ?? 0;
    const pendingPts = amb.totalPendingPoints ?? 0;
    const levelInfo = getAmbassadorLevel(verifiedPts, amb.levelOverride, amb.customRevenueShare);

    res.json({
      _id: amb._id,
      status: amb.status,
      college: amb.college,
      location: amb.location,
      referralCode: amb.referralCode,
      referralUrl,
      totalPoints: amb.totalPoints || 0,
      totalSVPoints: verifiedPts,
      totalVerifiedPoints: verifiedPts,
      totalPendingPoints: pendingPts,
      level: levelInfo,
      claimedMilestones: amb.claimedMilestones || [],
      createdAt: amb.createdAt,
      ambassador: amb,
    });
  } catch (err) {
    console.error('[Ambassador] Status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

router.get('/me', authOptions, getAmbassadorMe);
router.get('/status', authOptions, getAmbassadorMe);

/**
 * GET /api/ambassador/dashboard
 * Full dashboard data for v2.0 Campus Ambassador.
 */
router.get('/dashboard', authOptions, requireAmbassador, async (req, res) => {
  try {
    const amb = req.ambassador;
    const referralUrl = `${FRONTEND_URL()}/register?ref=${amb.referralCode}`;

    const verifiedPts = amb.totalVerifiedPoints ?? amb.totalPoints ?? 0;
    const pendingPts = amb.totalPendingPoints ?? 0;

    // Level info & revenue share %
    const currentLevel = getAmbassadorLevel(verifiedPts, amb.levelOverride, amb.customRevenueShare);

    // Aggregate structured statistics
    const [
      totalReferrals,
      verifiedReferrals,
      pendingReferrals,
      profileCompletions,
      portfolios,
      totalCerts,
      paidCourses,
      paidHackathons,
      paidSimulations,
      studentsConverted,
    ] = await Promise.all([
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'registration' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'registration', status: 'verified' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'registration', status: 'pending' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'profile_completed' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'portfolio_published' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: { $in: ['certificate', 'first_certificate', 'additional_certificate', 'free_course_certificate', 'skill_exam_certificate', 'paid_course_certificate'] } }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'paid_course' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'paid_hackathon' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'paid_simulation' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: { $in: ['student_becomes_ambassador', 'student_ambassador_verified'] } }),
    ]);

    const stats = {
      totalReferrals,
      verifiedReferrals,
      pendingReferrals,
      profileCompletions,
      portfolios,
      totalCerts,
      paidCourses,
      paidHackathons,
      paidSimulations,
      paidActivities: paidCourses + paidHackathons + paidSimulations,
      studentsConverted,
    };

    // Calculate Achievement Badges
    const badges = calculateBadges(stats, verifiedPts);

    // Point history audit log (recent 50)
    const pointHistory = await PointHistory.find({ ambassadorId: amb._id })
      .sort({ date: -1, createdAt: -1 })
      .limit(50)
      .lean();

    // Reward requests
    const rewardRequests = await RewardRequest.find({ ambassadorId: amb._id }).lean();

    // Reward Status Flow: locked -> eligible -> requested -> approved / rejected -> claimed
    const claimableTiers = ['bronze', 'silver', 'gold', 'platinum'];
    const milestoneStatus = claimableTiers.map((tier) => {
      const cfg = AMBASSADOR_LEVELS[tier];
      const isClaimed = (amb.claimedMilestones || []).includes(tier);
      const req = rewardRequests.find(r => r.tier === tier);

      let status = 'locked';
      if (isClaimed) {
        status = 'claimed';
      } else if (req) {
        status = req.status; // 'requested', 'approved', 'rejected'
      } else if (verifiedPts >= cfg.minPoints) {
        status = 'eligible';
      }

      return {
        tier,
        name: cfg.name,
        icon: cfg.icon,
        requiredPoints: cfg.minPoints,
        revenueSharePercent: cfg.revenueSharePercent,
        status,
        requestDate: req?.createdAt || null,
        adminNote: req?.adminNote || '',
      };
    });

    // Monthly growth data for charts (verified points only)
    const pointsByMonthRaw = await ReferralEvent.aggregate([
      { $match: { ambassadorId: amb._id, status: 'verified' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          points: { $sum: '$points' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const pointsByMonth = pointsByMonthRaw.map(d => {
      const [year, month] = d._id.split('-');
      const date = new Date(year, month - 1);
      return {
        name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        points: d.points,
      };
    });

    res.json({
      ambassador: {
        _id: amb._id,
        college: amb.college,
        location: amb.location,
        status: amb.status,
        totalPoints: amb.totalPoints || 0,
        totalSVPoints: verifiedPts,
        totalVerifiedPoints: verifiedPts,
        totalPendingPoints: pendingPts,
        level: currentLevel,
        referralCode: amb.referralCode,
        referralUrl,
        claimedMilestones: amb.claimedMilestones || [],
        approvedAt: amb.approvedAt,
      },
      stats,
      badges,
      milestoneStatus,
      pointHistory,
      pointsByMonth,
    });
  } catch (err) {
    console.error('[Ambassador] Dashboard error:', err);
    res.status(500).json({ message: 'Server error loading ambassador dashboard.' });
  }
});

/**
 * GET /api/ambassador/leaderboard
 * Leaderboard with Weekly, Monthly, and All-Time views, sortable by Verified Points, Referrals, Certificates.
 */
router.get('/leaderboard', authOptions, async (req, res) => {
  try {
    const { timeframe = 'all_time', sortBy = 'points' } = req.query;

    let dateFilter = { status: 'verified' };
    if (timeframe === 'weekly') {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { createdAt: { $gte: weekStart }, status: 'verified' };
    } else if (timeframe === 'monthly') {
      const now = new Date();
      const monthStart = new Date(now.setMonth(now.getMonth() - 1));
      dateFilter = { createdAt: { $gte: monthStart }, status: 'verified' };
    }

    let ambassadors;
    if (timeframe === 'all_time') {
      ambassadors = await CampusAmbassador.find({ status: 'approved' })
        .populate('userId', 'name email')
        .sort({ totalVerifiedPoints: -1, totalPoints: -1 })
        .lean();
    } else {
      // Aggregate verified points for specific timeframe
      const agg = await ReferralEvent.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$ambassadorId',
            periodPoints: { $sum: '$points' },
            periodReferrals: {
              $sum: { $cond: [{ $eq: ['$eventType', 'registration'] }, 1, 0] },
            },
            periodCerts: {
              $sum: { $cond: [{ $in: ['$eventType', ['certificate', 'first_certificate', 'additional_certificate', 'free_course_certificate', 'skill_exam_certificate', 'paid_course_certificate']] }, 1, 0] },
            },
          },
        },
      ]);

      const ambIds = agg.map(a => a._id);
      const ambList = await CampusAmbassador.find({ _id: { $in: ambIds }, status: 'approved' })
        .populate('userId', 'name email')
        .lean();

      ambassadors = ambList.map(amb => {
        const match = agg.find(a => String(a._id) === String(amb._id));
        return {
          ...amb,
          periodPoints: match?.periodPoints || 0,
          periodReferrals: match?.periodReferrals || 0,
          periodCerts: match?.periodCerts || 0,
        };
      });
    }

    // Enhance with calculated total stats & level info
    const leaderboardData = await Promise.all(
      ambassadors.map(async amb => {
        const [refCount, certCount] = await Promise.all([
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'registration', status: 'verified' }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: { $in: ['certificate', 'first_certificate', 'additional_certificate', 'free_course_certificate', 'skill_exam_certificate', 'paid_course_certificate'] }, status: 'verified' }),
        ]);

        const verifiedPts = amb.totalVerifiedPoints ?? amb.totalPoints ?? 0;
        const levelInfo = getAmbassadorLevel(verifiedPts, amb.levelOverride, amb.customRevenueShare);

        return {
          _id: amb._id,
          name: amb.userId?.name || 'Ambassador',
          college: amb.college,
          totalSVPoints: verifiedPts,
          totalVerifiedPoints: verifiedPts,
          totalPendingPoints: amb.totalPendingPoints || 0,
          totalReferrals: refCount,
          totalCertificates: certCount,
          periodPoints: amb.periodPoints ?? verifiedPts,
          periodReferrals: amb.periodReferrals ?? refCount,
          periodCertificates: amb.periodCerts ?? certCount,
          level: levelInfo,
        };
      })
    );

    // Sort leaderboard strictly by verified metrics
    leaderboardData.sort((a, b) => {
      if (sortBy === 'referrals') {
        return b.periodReferrals - a.periodReferrals;
      } else if (sortBy === 'certificates') {
        return b.periodCertificates - a.periodCertificates;
      }
      return b.periodPoints - a.periodPoints;
    });

    // Assign rank
    const ranked = leaderboardData.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    res.json(ranked);
  } catch (err) {
    console.error('[Ambassador] Leaderboard error:', err);
    res.status(500).json({ message: 'Server error loading leaderboard.' });
  }
});

/**
 * POST /api/ambassador/reward-request
 * Submit a reward claim for an eligible tier (bronze, silver, gold, platinum).
 */
router.post('/reward-request', authOptions, requireAmbassador, async (req, res) => {
  try {
    const amb = req.ambassador;
    const { tier } = req.body;

    const allowedTiers = ['bronze', 'silver', 'gold', 'platinum'];
    if (!allowedTiers.includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier selection.' });
    }

    const cfg = AMBASSADOR_LEVELS[tier];
    if (!cfg || !cfg.claimable) {
      return res.status(400).json({ message: 'This tier is not claimable.' });
    }

    if (amb.totalPoints < cfg.minPoints) {
      return res.status(400).json({
        message: `You need ${cfg.minPoints} SV Points for ${cfg.name} reward. You currently have ${amb.totalPoints}.`,
      });
    }

    if ((amb.claimedMilestones || []).includes(tier)) {
      return res.status(400).json({ message: `${cfg.name} reward already claimed.` });
    }

    const existing = await RewardRequest.findOne({ ambassadorId: amb._id, tier }).lean();
    if (existing) {
      return res.status(400).json({
        message: `${cfg.name} reward request already submitted. Current status: ${existing.status}.`,
        status: existing.status,
      });
    }

    const request = await RewardRequest.create({
      ambassadorId: amb._id,
      tier,
      pointsAtRequest: amb.totalPoints,
      status: 'requested',
    });

    res.status(201).json({
      message: `${cfg.name} reward requested! The SkillValix Admin team will review and process your request.`,
      request,
    });
  } catch (err) {
    console.error('[Ambassador] Reward request error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Reward request already submitted for this tier.' });
    }
    res.status(500).json({ message: 'Server error processing reward request.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES (AUTHENTICATED ADMIN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/ambassador/admin/list
 * List all ambassadors with filters & search.
 */
router.get('/admin/list', authOptions, adminCheck, async (req, res) => {
  try {
    const { status = '', sort = 'newest', search = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const ambassadors = await CampusAmbassador.find(filter)
      .populate('userId', 'name email createdAt')
      .sort(sort === 'points' ? { totalPoints: -1 } : { createdAt: -1 })
      .lean();

    const searchLower = String(search).trim().toLowerCase();
    const filtered = searchLower
      ? ambassadors.filter(a =>
          (a.userId?.name || '').toLowerCase().includes(searchLower) ||
          (a.userId?.email || '').toLowerCase().includes(searchLower) ||
          (a.college || '').toLowerCase().includes(searchLower) ||
          (a.location || '').toLowerCase().includes(searchLower)
        )
      : ambassadors;

    const formatted = filtered.map(a => {
      const levelInfo = getAmbassadorLevel(a.totalPoints, a.levelOverride, a.customRevenueShare);
      return {
        _id: a._id,
        user: { name: a.userId?.name, email: a.userId?.email, id: a.userId?._id, createdAt: a.userId?.createdAt },
        college: a.college,
        mobile: a.mobile,
        location: a.location,
        whyJoin: a.whyJoin,
        status: a.status,
        totalPoints: a.totalPoints || 0,
        totalSVPoints: a.totalSVPoints || a.totalPoints || 0,
        level: levelInfo,
        levelOverride: a.levelOverride || null,
        customRevenueShare: a.customRevenueShare || null,
        referralCode: a.referralCode,
        claimedMilestones: a.claimedMilestones || [],
        adminNote: a.adminNote,
        approvedAt: a.approvedAt,
        createdAt: a.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('[Ambassador Admin] List error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/adjust-points
 * Manually add/deduct points with MANDATORY reason.
 */
router.post('/admin/adjust-points', authOptions, adminCheck, async (req, res) => {
  try {
    const { ambassadorId, points, reason } = req.body;
    if (!ambassadorId || !points || !reason || !String(reason).trim()) {
      return res.status(400).json({ message: 'ambassadorId, non-zero points, and a mandatory reason are required.' });
    }

    const updatedAmb = await adjustPointsManually(ambassadorId, points, reason, req.user.id);

    res.json({
      message: `Successfully ${Number(points) > 0 ? 'added' : 'deducted'} ${Math.abs(points)} SV Points.`,
      ambassador: {
        _id: updatedAmb._id,
        totalPoints: updatedAmb.totalPoints,
        totalSVPoints: updatedAmb.totalSVPoints,
      },
    });
  } catch (err) {
    console.error('[Ambassador Admin] Adjust points error:', err.message);
    res.status(400).json({ message: err.message || 'Error adjusting points.' });
  }
});

/**
 * POST /api/ambassador/admin/override-level
 * Override ambassador level ('explorer', 'bronze', 'silver', 'gold', 'platinum', or null).
 */
router.post('/admin/override-level', authOptions, adminCheck, async (req, res) => {
  try {
    const { ambassadorId, levelOverride } = req.body;
    if (!ambassadorId) return res.status(400).json({ message: 'ambassadorId is required.' });

    const validLevels = ['explorer', 'bronze', 'silver', 'gold', 'platinum', null, ''];
    if (!validLevels.includes(levelOverride)) {
      return res.status(400).json({ message: 'Invalid level override value.' });
    }

    const targetLevel = levelOverride || null;
    const amb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $set: { levelOverride: targetLevel } },
      { new: true }
    );

    if (!amb) return res.status(404).json({ message: 'Ambassador not found.' });

    res.json({
      message: targetLevel ? `Level overridden to ${targetLevel.toUpperCase()}` : 'Level override removed.',
      level: getAmbassadorLevel(amb.totalPoints, amb.levelOverride, amb.customRevenueShare),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error overriding level.' });
  }
});

/**
 * POST /api/ambassador/admin/override-revshare
 * Configure custom revenue share % (e.g. 7-10% for Platinum).
 */
router.post('/admin/override-revshare', authOptions, adminCheck, async (req, res) => {
  try {
    const { ambassadorId, customRevenueShare } = req.body;
    if (!ambassadorId) return res.status(400).json({ message: 'ambassadorId is required.' });

    const val = customRevenueShare !== null && customRevenueShare !== '' ? Number(customRevenueShare) : null;
    if (val !== null && (isNaN(val) || val < 0 || val > 100)) {
      return res.status(400).json({ message: 'Revenue share must be a number between 0 and 100.' });
    }

    const amb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $set: { customRevenueShare: val } },
      { new: true }
    );

    if (!amb) return res.status(404).json({ message: 'Ambassador not found.' });

    res.json({
      message: val !== null ? `Custom revenue share configured to ${val}%.` : 'Custom revenue share reset to default.',
      level: getAmbassadorLevel(amb.totalPoints, amb.levelOverride, amb.customRevenueShare),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error configuring revenue share.' });
  }
});

/**
 * GET /api/ambassador/admin/point-history/:ambassadorId
 * Fetch full PointHistory audit log for an ambassador.
 */
router.get('/admin/point-history/:ambassadorId', authOptions, adminCheck, async (req, res) => {
  try {
    const history = await PointHistory.find({ ambassadorId: req.params.ambassadorId })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error loading point history.' });
  }
});

/**
 * POST /api/ambassador/admin/approve
 */
router.post('/admin/approve', authOptions, adminCheck, async (req, res) => {
  try {
    const { ambassadorId, userId, adminNote = '' } = req.body;
    if (!ambassadorId && !userId) {
      return res.status(400).json({ message: 'ambassadorId or userId required.' });
    }

    let amb = null;
    if (ambassadorId) {
      amb = await CampusAmbassador.findById(ambassadorId);
    } else if (userId) {
      amb = await CampusAmbassador.findOne({ userId });
      if (!amb) {
        const targetUser = await User.findById(userId).lean();
        if (!targetUser) return res.status(404).json({ message: 'User not found.' });

        amb = new CampusAmbassador({
          userId,
          college: targetUser.college || 'N/A',
          mobile: targetUser.phoneNumber || 'N/A',
          location: 'N/A',
          whyJoin: 'Admin assigned',
          status: 'pending',
        });
      }
    }

    if (!amb) return res.status(404).json({ message: 'Ambassador record or application not found.' });

    if (amb.status === 'approved') {
      return res.status(400).json({ message: 'Already approved.' });
    }

    let referralCode;
    let attempts = 0;
    do {
      referralCode = generateReferralCode();
      const exists = await CampusAmbassador.findOne({ referralCode }).lean();
      if (!exists) break;
      attempts++;
    } while (attempts < 5);

    amb.status = 'approved';
    amb.referralCode = referralCode;
    amb.approvedAt = new Date();
    amb.adminNote = adminNote;
    await amb.save();

    // Award approval bonus (20 pts)
    await awardPoints(amb._id, 'ambassador_approved', {});

    // Also check if referred user became ambassador (award referring user 100 pts)
    const currentStudentUser = await User.findById(amb.userId).lean();
    if (currentStudentUser?.referredBy) {
      await awardPoints(currentStudentUser.referredBy, 'student_becomes_ambassador', {
        referredUserId: currentStudentUser._id,
      }).catch(() => {});
    }

    res.json({
      message: 'Ambassador approved successfully.',
      referralCode,
      ambassador: { _id: amb._id, status: amb.status, referralCode, totalPoints: amb.totalPoints },
    });
  } catch (err) {
    console.error('[Ambassador Admin] Approve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/reject
 */
router.post('/admin/reject', authOptions, adminCheck, async (req, res) => {
  try {
    const { ambassadorId, adminNote = '' } = req.body;
    if (!ambassadorId) return res.status(400).json({ message: 'ambassadorId required.' });

    const amb = await CampusAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $set: { status: 'rejected', adminNote } },
      { new: true }
    ).lean();
    if (!amb) return res.status(404).json({ message: 'Not found.' });

    res.json({ message: 'Application rejected.', ambassador: { _id: amb._id, status: amb.status } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/suspend/:id
 */
router.post('/admin/suspend/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const amb = await CampusAmbassador.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'suspended' } },
      { new: true }
    ).lean();
    if (!amb) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Ambassador suspended.', status: amb.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/reactivate/:id
 */
router.post('/admin/reactivate/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const amb = await CampusAmbassador.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'approved' } },
      { new: true }
    ).lean();
    if (!amb) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Ambassador reactivated.', status: amb.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reward Requests Admin Management
router.get('/admin/rewards', authOptions, adminCheck, async (req, res) => {
  try {
    const { status = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const requests = await RewardRequest.find(filter)
      .populate({
        path: 'ambassadorId',
        select: 'userId college location totalPoints referralCode status levelOverride customRevenueShare',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json(requests);
  } catch (err) {
    console.error('[Ambassador Admin] Rewards list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/rewards/:id/status
 * Update status of reward request: 'approved', 'rejected', 'claimed'.
 */
router.post('/admin/rewards/:id/status', authOptions, adminCheck, async (req, res) => {
  try {
    const { status, adminNote = '' } = req.body;
    const allowed = ['approved', 'rejected', 'claimed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid reward status.' });
    }

    const request = await RewardRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    request.status = status;
    request.adminNote = adminNote;
    await request.save();

    if (status === 'claimed' || status === 'approved') {
      await CampusAmbassador.findByIdAndUpdate(
        request.ambassadorId,
        { $addToSet: { claimedMilestones: request.tier } }
      );
    }

    res.json({ message: `Reward request updated to ${status}.`, request });
  } catch (err) {
    console.error('[Ambassador Admin] Reward status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/ambassador/admin/export-report
 * Export comprehensive ambassador metrics report.
 */
router.get('/admin/export-report', authOptions, adminCheck, async (req, res) => {
  try {
    const ambassadors = await CampusAmbassador.find()
      .populate('userId', 'name email createdAt')
      .sort({ totalPoints: -1 })
      .lean();

    const report = await Promise.all(
      ambassadors.map(async amb => {
        const [
          totalReferrals,
          profileCompletions,
          portfolios,
          totalCerts,
          paidCourses,
          paidHackathons,
          paidSimulations,
        ] = await Promise.all([
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'registration' }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'profile_completed' }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'portfolio_published' }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: { $in: ['certificate', 'first_certificate', 'additional_certificate'] } }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'paid_course' }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'paid_hackathon' }),
          ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'paid_simulation' }),
        ]);

        const levelInfo = getAmbassadorLevel(amb.totalPoints, amb.levelOverride, amb.customRevenueShare);

        return {
          id: amb._id,
          name: amb.userId?.name || 'N/A',
          email: amb.userId?.email || 'N/A',
          college: amb.college,
          mobile: amb.mobile,
          location: amb.location,
          status: amb.status,
          referralCode: amb.referralCode || 'N/A',
          totalSVPoints: amb.totalPoints || 0,
          currentLevel: levelInfo.name,
          revenueSharePercent: levelInfo.effectiveRevenueShare,
          totalReferrals,
          profileCompletions,
          portfolios,
          totalCerts,
          paidCourses,
          paidHackathons,
          paidSimulations,
          claimedMilestones: (amb.claimedMilestones || []).join(', '),
          approvedAt: amb.approvedAt ? new Date(amb.approvedAt).toISOString() : 'N/A',
        };
      })
    );

    res.json(report);
  } catch (err) {
    console.error('[Ambassador Admin] Export report error:', err);
    res.status(500).json({ message: 'Server error generating report.' });
  }
});

export default router;
