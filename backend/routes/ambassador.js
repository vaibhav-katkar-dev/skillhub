import express from 'express';
import crypto from 'crypto';
import CampusAmbassador from '../models/CampusAmbassador.js';
import ReferralEvent from '../models/ReferralEvent.js';
import RewardRequest from '../models/RewardRequest.js';
import User from '../models/User.js';
import { authOptions, adminCheck } from '../middleware/auth.js';
import { awardPoints, getUnlockedMilestones, MILESTONES } from '../utils/ambassadorPoints.js';

const router = express.Router();

const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'https://www.skillvalix.com').replace(/\/$/, '');

// Generate a short unique referral code: "ca-" + 8 hex chars
function generateReferralCode() {
  return 'ca-' + crypto.randomBytes(4).toString('hex');
}

// ── Middleware: Resolve ambassador for logged-in user ──────────────────────────
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
// PUBLIC (authenticated) ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/ambassador/apply
 * Submit a campus ambassador application.
 * Any logged-in user can apply (once).
 */
router.post('/apply', authOptions, async (req, res) => {
  try {
    const { college, mobile, location, whyJoin } = req.body;

    if (!college || !mobile || !location) {
      return res.status(400).json({ message: 'College, mobile, and location are required.' });
    }

    // Phone validation: Indian mobile 10 digits, optionally starting with +91
    const mobileClean = String(mobile).replace(/\s/g, '').replace(/^\+91/, '');
    if (!/^\d{10}$/.test(mobileClean)) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    // Check duplicate
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
      userId:   req.user.id,
      college:  String(college).trim(),
      mobile:   mobileClean,
      location: String(location).trim(),
      whyJoin:  String(whyJoin || '').trim().substring(0, 500),
      status:   'pending',
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
 * GET /api/ambassador/status
 * Check this user's application/ambassador status & profile info.
 */
const getAmbassadorMe = async (req, res) => {
  try {
    const amb = await CampusAmbassador.findOne({ userId: req.user.id }).lean();
    if (!amb) return res.json({ status: 'none', ambassador: null });

    const referralUrl = amb.referralCode
      ? `${FRONTEND_URL()}/register?ref=${amb.referralCode}`
      : null;

    res.json({
      _id:              amb._id,
      status:           amb.status,
      college:          amb.college,
      location:         amb.location,
      referralCode:     amb.referralCode,
      referralUrl,
      totalPoints:      amb.totalPoints || 0,
      claimedMilestones:amb.claimedMilestones || [],
      createdAt:        amb.createdAt,
      ambassador:       amb,
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
 * Full dashboard data for an approved ambassador.
 */
router.get('/dashboard', authOptions, requireAmbassador, async (req, res) => {
  try {
    const amb = req.ambassador;
    const referralUrl = `${FRONTEND_URL()}/register?ref=${amb.referralCode}`;

    // Recent 30 activity events
    const recentEvents = await ReferralEvent.find({ ambassadorId: amb._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // Aggregate stats
    const [
      totalReferrals,
      totalLogins,
      paidActivities,
      totalCerts,
      pointsByMonth,
    ] = await Promise.all([
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'registration' }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'login' }),
      ReferralEvent.countDocuments({
        ambassadorId: amb._id,
        eventType: { $in: ['paid_course', 'paid_simulation', 'paid_hackathon'] },
      }),
      ReferralEvent.countDocuments({ ambassadorId: amb._id, eventType: 'certificate' }),
      ReferralEvent.aggregate([
        { $match: { ambassadorId: amb._id } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            points: { $sum: '$points' },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
    ]);

    // Pending reward requests for this ambassador
    const rewardRequests = await RewardRequest.find({ ambassadorId: amb._id }).lean();

    // Which tiers are unlocked but not yet claimed or requested
    const unlockedMilestones = getUnlockedMilestones(amb.totalPoints, amb.claimedMilestones);
    const requestedTiers = rewardRequests.map(r => r.tier);

    const milestoneStatus = Object.entries(MILESTONES).map(([tier, required]) => ({
      tier,
      required,
      unlocked: amb.totalPoints >= required,
      claimed:  amb.claimedMilestones.includes(tier),
      requested:requestedTiers.includes(tier),
      requestStatus: rewardRequests.find(r => r.tier === tier)?.status || null,
    }));

    res.json({
      ambassador: {
        _id:         amb._id,
        college:     amb.college,
        location:    amb.location,
        status:      amb.status,
        totalPoints: amb.totalPoints,
        referralUrl,
        referralCode:amb.referralCode,
        claimedMilestones: amb.claimedMilestones,
        approvedAt:  amb.approvedAt,
      },
      stats: {
        totalReferrals,
        totalLogins,
        paidActivities,
        totalCerts,
      },
      recentEvents: recentEvents.map(e => ({
        _id:       e._id,
        eventType: e.eventType,
        points:    e.points,
        amountPaidInr: e.amountPaidInr,
        couponCode:    e.couponCode,
        createdAt: e.createdAt,
        meta:      e.meta,
      })),
      pointsByMonth: pointsByMonth.map(d => {
        const [year, month] = d._id.split('-');
        const date = new Date(year, month - 1);
        return {
          name:   date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          points: d.points,
        };
      }),
      milestoneStatus,
      nextMilestone: milestoneStatus.find(m => !m.unlocked) || null,
    });
  } catch (err) {
    console.error('[Ambassador] Dashboard error:', err);
    res.status(500).json({ message: 'Server error loading dashboard.' });
  }
});

/**
 * POST /api/ambassador/reward-request
 * Submit a reward claim for an unlocked tier.
 */
router.post('/reward-request', authOptions, requireAmbassador, async (req, res) => {
  try {
    const amb = req.ambassador;
    const { tier } = req.body;

    if (!['bronze', 'silver', 'gold'].includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier.' });
    }

    const required = MILESTONES[tier];
    if (amb.totalPoints < required) {
      return res.status(400).json({
        message: `You need ${required} points for ${tier} reward. You have ${amb.totalPoints}.`,
      });
    }

    if (amb.claimedMilestones.includes(tier)) {
      return res.status(400).json({ message: `${tier} reward already claimed.` });
    }

    // Check if already requested
    const existing = await RewardRequest.findOne({ ambassadorId: amb._id, tier }).lean();
    if (existing) {
      return res.status(400).json({
        message: `${tier} reward request already submitted. Status: ${existing.status}.`,
        status: existing.status,
      });
    }

    const request = await RewardRequest.create({
      ambassadorId:    amb._id,
      tier,
      pointsAtRequest: amb.totalPoints,
      status:          'pending',
    });

    res.status(201).json({
      message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} reward requested! Admin will review within 48 hours.`,
      request,
    });
  } catch (err) {
    console.error('[Ambassador] Reward request error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Reward request already submitted for this tier.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/ambassador/admin/list
 * All ambassador applications (all statuses), sortable.
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

    res.json(filtered.map(a => ({
      _id:         a._id,
      user:        { name: a.userId?.name, email: a.userId?.email, id: a.userId?._id, createdAt: a.userId?.createdAt },
      college:     a.college,
      mobile:      a.mobile,
      location:    a.location,
      whyJoin:     a.whyJoin,
      status:      a.status,
      totalPoints: a.totalPoints,
      referralCode:a.referralCode,
      claimedMilestones: a.claimedMilestones,
      adminNote:   a.adminNote,
      approvedAt:  a.approvedAt,
      createdAt:   a.createdAt,
    })));
  } catch (err) {
    console.error('[Ambassador Admin] List error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/ambassador/admin/:id
 * Single ambassador detail + growth chart.
 */
router.get('/admin/:id', authOptions, adminCheck, async (req, res) => {
  try {
    const amb = await CampusAmbassador.findById(req.params.id)
      .populate('userId', 'name email college')
      .lean();
    if (!amb) return res.status(404).json({ message: 'Not found.' });

    const [recentEvents, pointsByMonth, eventBreakdown] = await Promise.all([
      ReferralEvent.find({ ambassadorId: amb._id })
        .populate('referredUserId', 'name email')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      ReferralEvent.aggregate([
        { $match: { ambassadorId: amb._id } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, points: { $sum: '$points' } } },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      ReferralEvent.aggregate([
        { $match: { ambassadorId: amb._id } },
        { $group: { _id: '$eventType', count: { $sum: 1 }, totalPoints: { $sum: '$points' } } },
      ]),
    ]);

    const rewardRequests = await RewardRequest.find({ ambassadorId: amb._id }).lean();

    res.json({
      ambassador: {
        _id: amb._id,
        user: { name: amb.userId?.name, email: amb.userId?.email },
        college: amb.college,
        mobile: amb.mobile,
        location: amb.location,
        whyJoin: amb.whyJoin,
        status: amb.status,
        totalPoints: amb.totalPoints,
        referralCode: amb.referralCode,
        claimedMilestones: amb.claimedMilestones,
        adminNote: amb.adminNote,
        approvedAt: amb.approvedAt,
        createdAt: amb.createdAt,
      },
      recentEvents,
      pointsByMonth: pointsByMonth.map(d => {
        const [year, month] = d._id.split('-');
        return { name: new Date(year, month - 1).toLocaleString('default', { month: 'short', year: '2-digit' }), points: d.points };
      }),
      eventBreakdown,
      rewardRequests,
    });
  } catch (err) {
    console.error('[Ambassador Admin] Detail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/approve
 * Approve a pending application. Generates referral code + awards base points.
 * Body: { ambassadorId }
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
        // Create CampusAmbassador record directly for user
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

    // Generate unique referral code
    let referralCode;
    let attempts = 0;
    do {
      referralCode = generateReferralCode();
      const exists = await CampusAmbassador.findOne({ referralCode }).lean();
      if (!exists) break;
      attempts++;
    } while (attempts < 5);

    amb.status      = 'approved';
    amb.referralCode= referralCode;
    amb.approvedAt  = new Date();
    amb.adminNote   = adminNote;
    await amb.save();

    // Award base points (5 pts for approval)
    await awardPoints(amb._id, 'ambassador_approved', {});

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
 * Reject a pending application.
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

// ─── Reward Requests (Admin) ──────────────────────────────────────────────────

/**
 * GET /api/ambassador/admin/rewards
 */
router.get('/admin/rewards', authOptions, adminCheck, async (req, res) => {
  try {
    const { status = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const requests = await RewardRequest.find(filter)
      .populate({
        path: 'ambassadorId',
        select: 'userId college location totalPoints referralCode status',
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
 * POST /api/ambassador/admin/rewards/:id/approve
 */
router.post('/admin/rewards/:id/approve', authOptions, adminCheck, async (req, res) => {
  try {
    const { adminNote = '' } = req.body;
    const request = await RewardRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}.` });
    }

    request.status    = 'approved';
    request.adminNote = adminNote;
    await request.save();

    // Add tier to claimedMilestones
    await CampusAmbassador.findByIdAndUpdate(
      request.ambassadorId,
      { $addToSet: { claimedMilestones: request.tier } }
    );

    res.json({ message: `${request.tier} reward approved.`, request });
  } catch (err) {
    console.error('[Ambassador Admin] Approve reward error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/ambassador/admin/rewards/:id/reject
 */
router.post('/admin/rewards/:id/reject', authOptions, adminCheck, async (req, res) => {
  try {
    const { adminNote = '' } = req.body;
    const request = await RewardRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'rejected', adminNote } },
      { new: true }
    ).lean();
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    res.json({ message: 'Reward request rejected.', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
