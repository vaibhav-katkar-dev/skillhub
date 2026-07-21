import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import {
  Award, BookOpen, CheckCircle2, ChevronDown, ExternalLink, Gift, Globe,
  GraduationCap, Linkedin, Mail, Rocket, Shield, Star, Trophy, Users, Zap,
  Sparkles, Send, AlertCircle, LogIn, ArrowRight, ShieldCheck, Check, Building,
  Phone, MapPin, HelpCircle, Crown
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

const POINTS_TABLE_V2 = [
  { activity: 'Student Converted to Ambassador', points: '100 SV pts', trigger: 'Referred user becomes an approved Campus Ambassador' },
  { activity: 'First Certificate Earned', points: '50 SV pts', trigger: 'Referred user earns their first SkillValix certificate' },
  { activity: 'Portfolio Published', points: '20 SV pts', trigger: 'Referred user publishes their public portfolio' },
  { activity: 'Additional Certificate Earned', points: '20 SV pts', trigger: 'Referred user earns subsequent course certificates' },
  { activity: 'Campus Ambassador Approved', points: '20 SV pts', trigger: 'One-time bonus on admin approval of your application' },
  { activity: 'LinkedIn Cert Share', points: '15 SV pts', trigger: 'Referred user shares certificate on LinkedIn' },
  { activity: 'Referred User Registration', points: '10 SV pts', trigger: 'New student registers using your referral link/QR' },
  { activity: 'Profile Completed', points: '10 SV pts', trigger: 'Referred user completes their student profile' },
  { activity: 'Paid Course / Hackathon / Sim Purchase', points: '10% of Paid Amount', trigger: 'Floor(Final Amount Paid × 10%) on actual payment received' },
];

const FAQS = [
  {
    q: 'Who can apply to become a Campus Ambassador?',
    a: 'Any student currently enrolled in a college or university in India can apply. There is no minimum GPA or branch requirement — just passion for technology, community building, and upskilling.',
  },
  {
    q: 'How are SV Points calculated for paid courses and hackathons?',
    a: 'Revenue points use the exact formula Floor(Final Amount Paid × 10%) based on actual INR received after discounts. For instance, ₹499 paid = 49 points; ₹249 paid = 24 points.',
  },
  {
    q: 'Are financial payouts or reward shipping automated?',
    a: 'No. All reward fulfillment, milestone approvals, level overrides, and revenue share payouts are strictly managed manually by the SkillValix Admin Team.',
  },
  {
    q: 'How do I track my level and reward status?',
    a: 'Your Ambassador Dashboard shows your real-time level progress (Explorer to Platinum), referral analytics, badge unlocks, and reward request status flow (Locked → Eligible → Requested → Approved/Rejected → Claimed).',
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
        <title>Campus Ambassador Program v2.0 | SkillValix</title>
        <meta
          name="description"
          content="Join the official SkillValix Campus Ambassador Program v2.0. SV Points, 5 Ambassador Levels (Explorer to Platinum), achievement badges, and reward tracking."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6 animate-pulse">
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            SkillValix Campus Ambassador Program v2.0
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Become a Registered{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Campus Ambassador
            </span>
            <br />
            & Lead SkillValix at Your College
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Earn <span className="text-amber-300 font-bold">SV Points</span>, advance through 5 Ambassador Levels (Explorer, Bronze, Silver, Gold, Platinum), unlock achievement badges, and track your referral milestones.
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
          </div>
        </div>
      </section>

      {/* 5 Ambassador Levels Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              5 Gamified Ambassador Levels
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Progress from Explorer to Platinum by helping fellow students upskill.
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

      {/* Point Calculation Rules Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Transparent Point Matrix (v2.0)
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Every point rule is defined centrally. Duplicate events are strictly prevented.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Activity Event</th>
                    <th className="px-6 py-4">Award Points</th>
                    <th className="px-6 py-4">Trigger Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {POINTS_TABLE_V2.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        {row.activity}
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-extrabold">{row.points}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{row.trigger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
