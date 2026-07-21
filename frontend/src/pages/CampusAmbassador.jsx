import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import {
  Award, BookOpen, CheckCircle2, ChevronDown, ExternalLink, Gift, Globe,
  GraduationCap, Linkedin, Mail, Rocket, Shield, Star, Trophy, Users, Zap,
  Sparkles, Send, AlertCircle, LogIn, ArrowRight, ShieldCheck, Check, Building,
  Phone, MapPin, HelpCircle, Crown, FileText
} from 'lucide-react';
import { AMBASSADOR_LEVELS, POINT_RULES } from '../config/ambassadorConfig';

const GMAIL_SUBJECT = encodeURIComponent('Campus Ambassador Application – SkillValix');
const GMAIL_BODY = encodeURIComponent(
  `Hi SkillValix Team,

I'd like to apply to be a Campus Ambassador at my college.

Full Name:
College / University:
City & State:
Mobile Number:
LinkedIn Profile:
Why do you want to be a SkillValix Campus Ambassador?

Looking forward to hearing from you!`
);
const APPLY_GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=skillvalix%40gmail.com&su=${GMAIL_SUBJECT}&body=${GMAIL_BODY}`;

const MILESTONES_V2 = [
  {
    tier: '🌱 Explorer',
    points: '0–499 Points',
    badge: 'from-emerald-700/20 to-slate-800 text-emerald-300 border-emerald-600/40',
    headerBg: 'from-emerald-950/40 to-slate-900',
    revShare: '0% Revenue Share',
    perks: [
      'Access to Campus Ambassador Portal & Live Referral Code',
      'Custom Referral Link & Printable QR Code Card',
      'Access to SkillValix Student Community',
      'Official Explorer Digital Badge',
    ],
  },
  {
    tier: '🥉 Bronze',
    points: '500–1,499 Points',
    badge: 'from-amber-700/20 to-orange-700/20 text-amber-300 border-amber-600/40',
    headerBg: 'from-amber-900/40 to-slate-900',
    revShare: '0% Revenue Share',
    perks: [
      'Official Bronze Ambassador Certificate',
      'Exclusive SkillValix Profile Badge & Laptop Stickers',
      'LinkedIn Feature & Recommendation Badge',
      'Access to VIP Ambassador Discord / WhatsApp Groups',
    ],
  },
  {
    tier: '🥈 Silver',
    points: '1,500–2,999 Points',
    badge: 'from-slate-400/20 to-slate-200/20 text-slate-200 border-slate-300/40',
    headerBg: 'from-slate-800 to-slate-900',
    revShare: '3% Revenue Share Eligible (Manual by Admin)',
    perks: [
      'Verified Silver Certificate & Letter of Recommendation',
      'Silver Ambassador Badge on SkillValix Profile',
      '3% Display Revenue Share Eligibility',
      'Priority Access to Partner Hackathons & Tech Events',
    ],
  },
  {
    tier: '🥇 Gold',
    points: '3,000–5,999 Points',
    badge: 'from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/40',
    headerBg: 'from-yellow-900/30 to-slate-900',
    revShare: '5% Revenue Share Eligible (Manual by Admin)',
    perks: [
      'Gold Ambassador Trophy & Merch Box',
      'SkillValix Official Website Hall of Fame Feature',
      '5% Display Revenue Share Eligibility',
      'Direct Internship / Executive Networking Referrals',
    ],
  },
  {
    tier: '💎 Platinum',
    points: '6,000+ Points',
    badge: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/40',
    headerBg: 'from-cyan-950/40 to-slate-900',
    revShare: '7–10% Revenue Share (Admin Configurable)',
    perks: [
      'Campus Leader & Mentor Badge',
      'Configurable 7–10% Display Revenue Share Eligibility',
      'Direct Founder Recognition & Career Referral Priority',
      'Lead Official SkillValix Campus Tech Events',
    ],
  },
];

const POINT_GROUPS = [
  {
    group: 'Ambassador Network',
    color: 'from-indigo-500/10 to-purple-500/10',
    borderColor: 'border-indigo-500/30',
    groupBadge: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30',
    icon: '👑',
    items: [
      {
        emoji: '👑',
        activity: 'Verified Ambassador Referral',
        badge: '+100 SV',
        badgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-500/30',
        trigger: 'Referred student becomes an approved Campus Ambassador and completes their first verified activity.',
      },
      {
        emoji: '🛡️',
        activity: 'Campus Ambassador Approved',
        badge: '+20 SV',
        badgeColor: 'bg-gradient-to-r from-indigo-500/80 to-blue-600/80 text-white shadow-blue-500/20',
        trigger: 'One-time bonus awarded immediately after Admin approves your application.',
      },
    ],
  },
  {
    group: 'Certificates',
    color: 'from-amber-500/10 to-yellow-500/10',
    borderColor: 'border-amber-500/30',
    groupBadge: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    icon: '🎓',
    items: [
      {
        emoji: '🎓',
        activity: 'First Paid Course Certificate',
        badge: '+50 SV',
        badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-amber-500/30',
        trigger: 'Referred user earns their very first paid course certificate on SkillValix.',
      },
      {
        emoji: '📜',
        activity: 'Additional Paid Course Certificate',
        badge: '+20 SV',
        badgeColor: 'bg-gradient-to-r from-amber-500/70 to-yellow-600/70 text-slate-950 shadow-yellow-500/20',
        trigger: 'Every additional paid course certificate earned by the referred user.',
      },
    ],
  },
  {
    group: 'Profile & Engagement',
    color: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    groupBadge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    icon: '✨',
    items: [
      {
        emoji: '📂',
        activity: 'Portfolio Published',
        badge: '+20 SV',
        badgeColor: 'bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white shadow-emerald-500/20',
        trigger: 'Referred user publishes their first public portfolio with at least one project.',
      },
      {
        emoji: '💼',
        activity: 'LinkedIn Certificate Share',
        badge: '+15 SV',
        badgeColor: 'bg-gradient-to-r from-sky-500/80 to-blue-500/80 text-white shadow-sky-500/20',
        trigger: 'Referred user shares a verified SkillValix certificate on LinkedIn.',
      },
      {
        emoji: '📝',
        activity: 'Profile Completed',
        badge: '+10 SV',
        badgeColor: 'bg-gradient-to-r from-teal-500/70 to-emerald-600/70 text-white shadow-teal-500/20',
        trigger: 'Referred user completes all required profile fields (name, phone, college, bio).',
      },
      {
        emoji: '🎉',
        activity: 'Verified Student Registration',
        badge: '+10 SV',
        badgeColor: 'bg-gradient-to-r from-emerald-600/60 to-green-600/60 text-white shadow-green-500/20',
        trigger: 'New student registers via your referral link and verifies their email address.',
      },
    ],
  },
  {
    group: 'Revenue Rewards',
    color: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-500/30',
    groupBadge: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    icon: '💳',
    items: [
      {
        emoji: '💳',
        activity: 'Paid Course / Hackathon / Job Simulation',
        badge: '10% Rev',
        badgeColor: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30',
        trigger: 'Floor(Final Amount Paid × 10%) calculated automatically on the actual amount after all coupons and discounts.',
        isRevenue: true,
      },
    ],
  },
];

const FAQS = [
  {
    q: 'Who can apply to become a Campus Ambassador in India?',
    a: 'Any student currently enrolled in a college or university in India can apply for the SkillValix Campus Ambassador Program. There is no minimum GPA, branch, or year requirement — just passion for technology, community building, and student upskilling.',
  },
  {
    q: 'How are SV Points calculated for paid courses and hackathons?',
    a: 'Revenue points are calculated using the exact formula: Floor(Final Amount Paid × 10%) based on actual INR received after all coupons and discounts. For example: ₹499 paid = 49 SV Points; ₹249 paid = 24 SV Points; ₹999 paid = 99 SV Points.',
  },
  {
    q: 'Are financial payouts or reward shipping automated?',
    a: 'No. All reward fulfilment, milestone approvals, level overrides, and revenue share payouts are strictly managed manually by the SkillValix Admin Team. No automated bank transfers or payouts are made.',
  },
  {
    q: 'How do I track my ambassador level and reward status?',
    a: 'Your Ambassador Dashboard shows your real-time level progress (Explorer to Platinum), referral analytics, badge unlocks, and reward request status flow: Locked → Eligible → Requested → Approved / Rejected → Claimed.',
  },
  {
    q: 'What is the difference between Pending and Verified SV Points?',
    a: 'Registration points start as Pending until the referred student verifies their email address. Only Verified SV Points count toward your ambassador level, leaderboard ranking, and milestone reward eligibility.',
  },
  {
    q: 'Can I refer someone who is already registered on SkillValix?',
    a: 'No. Referral points are only awarded when a new student registers on SkillValix for the first time using your unique referral link or QR code and subsequently verifies their email address.',
  },
  {
    q: 'How long does the campus ambassador application review take?',
    a: 'Applications are typically reviewed by the SkillValix Admin Team within 24 to 48 hours of submission. You will receive an email confirmation once your application is approved or if additional details are required.',
  },
  {
    q: 'What rewards do Gold and Platinum Campus Ambassadors receive?',
    a: 'Gold Campus Ambassadors (3,000–5,999 SV Points) receive a Gold Ambassador Trophy, SkillValix Merch Box, Hall of Fame website feature, and eligibility for 5% revenue share. Platinum Ambassadors (6,000+ SV Points) receive the Campus Leader Badge, 7–10% configurable revenue share eligibility, and direct Founder recognition and career referral priority.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${open ? 'border-indigo-500/40 bg-slate-900/90' : 'border-slate-800 bg-slate-900/40'}`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-slate-800/60 pt-4">
          <p className="text-sm text-slate-300 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function CampusAmbassador() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [ambStatus, setAmbStatus] = useState(null);
  const [college, setCollege] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/ambassador/me')
      .then(res => setAmbStatus(res.data?.status || 'none'))
      .catch(() => setAmbStatus('none'));
  }, [isAuthenticated]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!isAuthenticated) {
      navigate('/login?redirect=/campus-ambassador');
      return;
    }

    if (!college.trim()) {
      setFormError('Please enter your College or University name.');
      return;
    }

    const cleanMobile = mobile.replace(/\s/g, '').replace(/^\+91/, '');
    if (!/^\d{10}$/.test(cleanMobile)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!location.trim()) {
      setFormError('Please enter your City and State location.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/ambassador/apply', {
        college: college.trim(),
        mobile: cleanMobile,
        location: location.trim(),
        whyJoin: whyJoin.trim(),
      });

      setFormSuccess(res.data.message || 'Application submitted successfully!');
      setAmbStatus('pending');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Helmet>
        {/* ── Primary SEO ─────────────────────────────────────────── */}
        <title>Campus Ambassador Program 2026 | Earn SV Points & Rewards | SkillValix</title>
        <meta
          name="description"
          content="Join the official SkillValix Campus Ambassador Program 2026. Earn SV Points by referring students, unlock 5 ambassador levels (Explorer to Platinum), win certificates, merit badges, and revenue share rewards. Apply free as a college student in India."
        />
        <meta
          name="keywords"
          content="campus ambassador program India, campus ambassador 2026, student ambassador program, college ambassador program India, SkillValix campus ambassador, earn money as student India, student referral program India, earn SV points, ambassador program for college students, campus brand ambassador"
        />
        <link rel="canonical" href="https://www.skillvalix.com/campus-ambassador" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="SkillValix" />

        {/* ── Open Graph (Facebook / LinkedIn / WhatsApp) ─────────── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SkillValix" />
        <meta property="og:url" content="https://www.skillvalix.com/campus-ambassador" />
        <meta property="og:title" content="Campus Ambassador Program 2026 | Earn Rewards & SV Points | SkillValix" />
        <meta
          property="og:description"
          content="Become an official SkillValix Campus Ambassador. Earn SV Points, unlock Bronze to Platinum levels, win merch, certificates, and revenue share. Free to apply for Indian college students."
        />
        <meta property="og:image" content="https://www.skillvalix.com/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* ── Twitter Card ────────────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@skillvalix" />
        <meta name="twitter:title" content="Campus Ambassador Program 2026 | SkillValix" />
        <meta
          name="twitter:description"
          content="Earn SV Points, climb from Explorer to Platinum, and win rewards by becoming a SkillValix Campus Ambassador. Free application for college students in India."
        />
        <meta name="twitter:image" content="https://www.skillvalix.com/logo.png" />

        {/* ── JSON-LD Structured Data ─────────────────────────────── */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.skillvalix.com/" },
                { "@type": "ListItem", "position": 2, "name": "Campus Ambassador Program", "item": "https://www.skillvalix.com/campus-ambassador" }
              ]
            },
            {
              "@type": "EducationalOrganization",
              "name": "SkillValix",
              "url": "https://www.skillvalix.com",
              "logo": "https://www.skillvalix.com/logo.png",
              "description": "SkillValix is an Indian edtech platform offering free courses, skill exams, job simulations, and hackathons for college students."
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Who can apply to become a Campus Ambassador in India?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Any student currently enrolled in a college or university in India can apply. No minimum GPA or branch required." }
                },
                {
                  "@type": "Question",
                  "name": "How are SV Points calculated for paid courses and hackathons?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Revenue points = Floor(Final Amount Paid × 10%). For example, ₹499 paid = 49 SV Points." }
                },
                {
                  "@type": "Question",
                  "name": "What rewards do Gold and Platinum Campus Ambassadors receive?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Gold Ambassadors get a Trophy, Merch Box, Hall of Fame feature, and 5% revenue share eligibility. Platinum Ambassadors get a Campus Leader Badge and 7–10% revenue share eligibility." }
                },
                {
                  "@type": "Question",
                  "name": "How long does campus ambassador application review take?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Applications are reviewed within 24 to 48 hours by the SkillValix Admin Team." }
                }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6 animate-pulse">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            SkillValix Campus Ambassador Program v2.0
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Join the Official{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              SkillValix Campus Ambassador
            </span>
            {' '}Program 2026
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            India's leading <strong className="text-white">college campus ambassador program</strong> — earn{' '}
            <span className="text-amber-300 font-bold">SV Points</span> by referring students, advance through 5 levels
            (Explorer → Platinum), unlock achievement badges, and win{' '}
            <strong className="text-white">certificates, merch, and revenue rewards</strong>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {ambStatus === 'approved' ? (
              <Link
                to="/ambassador/dashboard"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base shadow-2xl shadow-emerald-500/30 transition-all duration-200"
              >
                <ShieldCheck className="w-5 h-5" />
                Go to Ambassador Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <a
                href="#application-form"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-base shadow-2xl shadow-indigo-500/40 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
                Fill Application Form
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
            <Link
              to="/campus-ambassador/terms"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-indigo-300 hover:text-white hover:border-indigo-500/40 font-semibold text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              Read Terms & Anti-Abuse Rules
            </Link>
          </div>
        </div>
      </section>

      {/* 5 Ambassador Levels Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              5 Campus Ambassador Levels &amp; Rewards
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Progress from Explorer to Platinum by helping fellow Indian college students upskill with free courses, skill exams, and hackathons. Unlock exclusive rewards at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {MILESTONES_V2.map((m) => (
              <div
                key={m.tier}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className={`bg-gradient-to-r ${m.headerBg} p-4 border-b border-slate-800 text-center`}>
                    <h3 className="text-lg font-black text-white">{m.tier}</h3>
                    <p className="text-xs font-mono text-amber-300 font-bold mt-1">{m.points}</p>
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-950/80 text-indigo-300 border border-indigo-500/30 mt-2">
                      {m.revShare}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5">
                    {m.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-[11px] text-slate-300 leading-snug">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Point Matrix — Premium Grouped Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Point System
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Transparent Point Matrix{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">v2.0</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
              Every point rule is defined centrally in our backend. Duplicate events, self-referrals, and unverified activities are automatically rejected.
            </p>
          </div>

          {/* Grouped Card Sections */}
          <div className="space-y-8">
            {POINT_GROUPS.map((group) => (
              <div key={group.group} className={`rounded-3xl border ${group.borderColor} bg-gradient-to-br ${group.color} backdrop-blur-sm p-0.5 shadow-xl`}>
                <div className="rounded-[22px] bg-slate-900/95 overflow-hidden">
                  {/* Group Header */}
                  <div className="px-6 py-4 border-b border-slate-800/70 flex items-center gap-3">
                    <span className="text-xl" role="img" aria-label={group.group}>{group.icon}</span>
                    <h3 className="font-extrabold text-white text-base tracking-tight">{group.group}</h3>
                    <span className={`ml-auto text-[10px] font-bold px-3 py-1 rounded-full border ${group.groupBadge} uppercase tracking-wider`}>
                      {group.items.length} {group.items.length === 1 ? 'Rule' : 'Rules'}
                    </span>
                  </div>

                  {/* Activity Cards Grid */}
                  <div className={`grid gap-px bg-slate-800/40 ${
                    group.items.length === 1
                      ? 'grid-cols-1'
                      : group.items.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2'
                  }`}>
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        tabIndex={0}
                        role="article"
                        aria-label={`${item.activity}: ${item.badge}`}
                        className="group relative bg-slate-900 hover:bg-slate-800/70 focus:bg-slate-800/70 transition-all duration-200 p-6 outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-inset"
                      >
                        {/* Hover shimmer line */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Emoji Icon */}
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 text-xl group-hover:scale-110 transition-transform duration-200">
                              {item.emoji}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-sm leading-tight mb-1.5">
                                {item.activity}
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {item.trigger}
                              </p>
                              {item.isRevenue && (
                                <p className="mt-2 text-[10px] text-rose-300/80 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg inline-block font-mono">
                                  e.g. ₹499 paid → 49 SV pts &nbsp;|&nbsp; ₹999 paid → 99 SV pts
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Reward Badge */}
                          <div className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg ${item.badgeColor} group-hover:scale-105 transition-transform duration-200 whitespace-nowrap`}>
                            {item.badge}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer Note */}
          <div className="mt-10 flex items-start gap-3 px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-semibold">SV Points are awarded only for verified activities.</span>{' '}
              Duplicate, fraudulent, or self-referral events are automatically rejected by our backend system. All points are calculated exclusively server-side.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-white mb-2">Apply for Campus Ambassador v2.0</h2>
            <p className="text-slate-400 text-sm mb-6">Applications are reviewed within 24–48 hours by the SkillValix team.</p>

            {formSuccess && <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 text-emerald-300 text-sm">{formSuccess}</div>}
            {formError && <div className="mb-4 p-4 rounded-xl bg-red-500/10 text-red-300 text-sm">{formError}</div>}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Bombay"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">10-Digit Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City & State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Why do you want to join? (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us briefly about your campus interest..."
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQs — Schema-friendly */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-2xl font-extrabold text-white text-center mb-2">
            Campus Ambassador Program — FAQs
          </h2>
          <p className="text-slate-400 text-sm text-center mb-8">
            Everything you need to know about the SkillValix Campus Ambassador Program for Indian college students.
          </p>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
