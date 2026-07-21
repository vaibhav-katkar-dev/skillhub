/**
 * ambassadorConfig.js
 * Single source of truth for Campus Ambassador levels, point rules, and achievement badges.
 * NEVER hardcode point rules or level logic anywhere else in the application.
 */

export const AMBASSADOR_LEVELS = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    icon: '🌱',
    minPoints: 0,
    maxPoints: 499,
    revenueSharePercent: 0,
    claimable: false,
    badgeBg: 'from-emerald-700/20 to-slate-800 text-emerald-300 border-emerald-600/30',
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    icon: '🥉',
    minPoints: 500,
    maxPoints: 1499,
    revenueSharePercent: 0,
    claimable: true,
    badgeBg: 'from-amber-700/20 to-orange-700/20 text-amber-300 border-amber-600/30',
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    icon: '🥈',
    minPoints: 1500,
    maxPoints: 2999,
    revenueSharePercent: 3,
    claimable: true,
    badgeBg: 'from-slate-400/20 to-slate-200/20 text-slate-200 border-slate-300/30',
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    icon: '🥇',
    minPoints: 3000,
    maxPoints: 5999,
    revenueSharePercent: 5,
    claimable: true,
    badgeBg: 'from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    icon: '💎',
    minPoints: 6000,
    maxPoints: Infinity,
    revenueSharePercent: 7, // Admin can override 7-10%
    claimable: true,
    badgeBg: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/30',
  },
};

export const POINT_RULES = {
  ambassador_approved: 20,
  registration: 10,                 // Pending until email verified
  profile_completed: 10,            // Requires verified email + name + phone + college + bio (>=20 chars)
  portfolio_published: 20,          // Requires verified portfolio link + at least 1 added project

  // Certificate separation
  free_course_certificate: 5,       // Max 2 free course certificates per referred student
  skill_exam_certificate: 20,        // Passed skill assessment exam
  paid_course_certificate: 50,       // 1st paid course cert
  additional_paid_certificate: 20,  // Subsequent paid course certs
  first_certificate: 50,             // Legacy compatibility alias
  additional_certificate: 20,        // Legacy compatibility alias
  linkedin_certificate_share: 15,
  linkedin_cert_share: 15,

  // Hackathon & Job Sim
  free_hackathon: 10,
  hackathon_free: 10,
  job_sim_free: 15,

  // Ambassador Network Growth
  student_becomes_ambassador: 100,
  student_ambassador_verified: 100,  // Awarded when referred user becomes ambassador AND completes 1st verified milestone

  // Daily / Login activity
  login: 2,
  ambassador_login: 1,              // Max 1 credit per UTC day for approved ambassadors
};

/**
 * Hackathon registration fee tiers (range-based SVC %).
 */
export const HACKATHON_TIERS = [
  { label: '₹1–₹99',    min: 1,    max: 99,   pct: 0.08, display: '8%' },
  { label: '₹100–₹299', min: 100,  max: 299,  pct: 0.10, display: '10%' },
  { label: '₹300–₹499', min: 300,  max: 499,  pct: 0.12, display: '12%' },
  { label: '₹500–₹999', min: 500,  max: 999,  pct: 0.15, display: '15%' },
  { label: '₹1000+',    min: 1000, max: Infinity, pct: 0.18, display: '18%' },
];

/**
 * Calculates revenue points: Floor(Final Amount Paid * 10%)
 * @param {number} finalAmountPaid - Actual amount paid after discounts
 * @returns {number} points to award
 */
export function calculateRevenuePoints(finalAmountPaid) {
  if (!finalAmountPaid || finalAmountPaid <= 0) return 0;
  return Math.floor(finalAmountPaid * 0.10);
}

/**
 * Range-based hackathon SVC calculation
 */
export function calculateHackathonPoints(registrationFee) {
  if (!registrationFee || registrationFee <= 0) return POINT_RULES.hackathon_free;
  const tier = HACKATHON_TIERS.find(t => registrationFee >= t.min && registrationFee <= t.max);
  return tier ? Math.floor(registrationFee * tier.pct) : POINT_RULES.hackathon_free;
}

export const ACHIEVEMENT_BADGES = [
  {
    id: 'first_referral',
    title: 'First Spark',
    description: 'Brought your first referred student to SkillValix',
    icon: '🚀',
    reqType: 'referrals',
    reqCount: 1,
  },
  {
    id: 'portfolio_builder',
    title: 'Portfolio Builder',
    description: 'Referred student published their professional portfolio',
    icon: '📂',
    reqType: 'portfolios',
    reqCount: 1,
  },
  {
    id: 'certificate_champion',
    title: 'Cert Champion',
    description: 'Referred student completed and earned a certificate',
    icon: '📜',
    reqType: 'certificates',
    reqCount: 1,
  },
  {
    id: 'revenue_creator',
    title: 'Growth Engine',
    description: 'Generated first paid purchase from a referred user',
    icon: '💰',
    reqType: 'paidActivities',
    reqCount: 1,
  },
  {
    id: 'community_builder',
    title: 'Tribe Builder',
    description: 'Referred 5+ active students to SkillValix',
    icon: '👥',
    reqType: 'referrals',
    reqCount: 5,
  },
  {
    id: 'top_recruiter',
    title: 'Campus Ambassador Lead',
    description: 'Referred 20+ active students to SkillValix',
    icon: '👑',
    reqType: 'referrals',
    reqCount: 20,
  },
  {
    id: 'elite_ambassador',
    title: 'Elite Ambassador',
    description: 'Crossed 3,000 SV Points (Gold Level)',
    icon: '🥇',
    reqType: 'points',
    reqCount: 3000,
  },
  {
    id: 'campus_legend',
    title: 'Campus Legend',
    description: 'Crossed 6,000 SV Points (Platinum Level)',
    icon: '💎',
    reqType: 'points',
    reqCount: 6000,
  },
];
