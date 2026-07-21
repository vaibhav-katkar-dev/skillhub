import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { api, useAuthStore } from '../store/authStore';
import {
  Award, Copy, Check, Share2, Sparkles, TrendingUp, Users, LogIn,
  CreditCard, ShieldCheck, Gift, ChevronRight, Clock, AlertCircle, Trophy,
  Star, ArrowUpRight, Download, QrCode, Crown, CheckCircle2, UserCheck,
  Briefcase, Code, Flame, Shield, HelpCircle, RefreshCw,
  Zap, Lock, Eye, BookOpen, Target, Cpu, GraduationCap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AMBASSADOR_LEVELS, ACHIEVEMENT_BADGES, POINT_RULES, HACKATHON_TIERS } from '../config/ambassadorConfig';

const AmbassadorDashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [claimingTier, setClaimingTier] = useState('');
  const [claimMsg, setClaimMsg] = useState({ type: '', text: '' });

  // Point Matrix reveal states — psychology: cards are "locked" until user reveals them
  const [revealedCards, setRevealedCards] = useState({});
  const [matrixHovered, setMatrixHovered] = useState(null);

  const toggleReveal = (id) => {
    setRevealedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLb, setLoadingLb] = useState(false);
  const [lbTimeframe, setLbTimeframe] = useState('all_time');
  const [lbSortBy, setLbSortBy] = useState('points');
  const [showLbModal, setShowLbModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ambassador/dashboard');
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error('[AmbassadorDashboard] Error:', err);
      setError(err.response?.data?.message || 'Failed to load ambassador dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLb(true);
      const res = await api.get(`/ambassador/leaderboard?timeframe=${lbTimeframe}&sortBy=${lbSortBy}`);
      setLeaderboard(res.data);
    } catch (err) {
      console.error('[Leaderboard] Error:', err);
    } finally {
      setLoadingLb(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (showLbModal) {
      fetchLeaderboard();
    }
  }, [showLbModal, lbTimeframe, lbSortBy]);

  const handleCopyLink = () => {
    if (!data?.ambassador?.referralUrl) return;
    navigator.clipboard.writeText(data.ambassador.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (!data?.ambassador?.referralUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join SkillValix with my referral link!',
          text: 'Master in-demand skills, get certified, and land your dream tech job with SkillValix.',
          url: data.ambassador.referralUrl,
        });
      } catch (err) {
        // User cancelled or share not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQR = () => {
    if (!data?.ambassador?.referralUrl) return;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(data.ambassador.referralUrl)}`;
    
    fetch(qrApiUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SkillValix-QR-${data.ambassador.referralCode || 'referral'}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => {
        window.open(qrApiUrl, '_blank');
      });
  };

  const handleClaimReward = async (tier) => {
    setClaimingTier(tier);
    setClaimMsg({ type: '', text: '' });
    try {
      const res = await api.post('/ambassador/reward-request', { tier });
      setClaimMsg({ type: 'success', text: res.data.message });
      fetchDashboard();
    } catch (err) {
      setClaimMsg({ type: 'error', text: err.response?.data?.message || 'Failed to submit reward claim.' });
    } finally {
      setClaimingTier('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading SkillValix Ambassador Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mx-auto border border-red-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Ambassador Portal Access</h2>
          <p className="text-slate-300 text-sm">{error}</p>
          <div className="pt-2">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30"
            >
              Return to Student Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const amb = data?.ambassador || {};
  const stats = data?.stats || {};
  const badges = data?.badges || [];
  const milestoneStatus = data?.milestoneStatus || [];
  const pointHistory = data?.pointHistory || [];
  const pointsByMonth = data?.pointsByMonth || [];
  const level = amb.level || AMBASSADOR_LEVELS.explorer;

  // Level roadmap calculations
  const levelKeys = ['explorer', 'bronze', 'silver', 'gold', 'platinum'];
  const nextLevelKey = levelKeys[levelKeys.indexOf(level.id) + 1];
  const nextLevel = nextLevelKey ? AMBASSADOR_LEVELS[nextLevelKey] : null;

  let progressPercent = 100;
  if (nextLevel) {
    const prevMin = level.minPoints;
    const needed = nextLevel.minPoints - prevMin;
    const currentInTier = Math.max(0, amb.totalPoints - prevMin);
    progressPercent = Math.min(100, Math.round((currentInTier / needed) * 100));
  }

  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(amb.referralUrl || '')}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Helmet>
        <title>Campus Ambassador Dashboard | SkillValix v2.0</title>
        <meta name="description" content="SkillValix Campus Ambassador Portal v2.0. SV Points, Level progression, achievement badges, referral analytics, and leaderboards." />
      </Helmet>

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 pt-10 pb-12 border-b border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`px-3.5 py-1 text-xs font-black rounded-full border bg-gradient-to-r ${level.badgeBg} flex items-center gap-1.5 shadow-sm`}>
                  <span>{level.icon}</span>
                  <span>{level.name} Ambassador</span>
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Official ({amb.college})
                </span>
                <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
                  Revenue Share: {level.effectiveRevenueShare}%
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>!
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                SkillValix Campus Ambassador Program v2.0 • Earn SV Points, stack achievement badges, and lead your campus.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLbModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl text-sm font-bold shadow-lg transition-all duration-200"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                Leaderboard
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </button>
            </div>
          </div>

          {/* Level Progress & SV Points Card */}
          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* SV Points summary */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total SV Points</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">{amb.totalSVPoints || amb.totalPoints} <span className="text-xs font-bold text-amber-400">pts</span></div>
                  <span className="text-xs text-slate-400">Price-aware engagement points</span>
                </div>
              </div>

              {/* Progress to Next Level */}
              <div className="md:col-span-2 space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Rank Progress</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <span>{level.icon} {level.name}</span>
                      {nextLevel && <ChevronRight className="w-4 h-4 text-slate-500" />}
                      {nextLevel && <span className="text-indigo-400">{nextLevel.icon} {nextLevel.name}</span>}
                    </span>
                  </div>
                  {nextLevel ? (
                    <span className="text-xs font-bold text-indigo-300">
                      {amb.totalPoints} / {nextLevel.minPoints} pts ({nextLevel.minPoints - amb.totalPoints} needed)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Crown className="w-4 h-4" /> Max Rank Reached!
                    </span>
                  )}
                </div>

                <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-700 shadow-md"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Revenue Share: <strong className="text-white">{level.effectiveRevenueShare}%</strong> (Manual by Admin)</span>
                  <span>Ambassador Level: <strong className="text-amber-300">{level.name}</strong></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Claim Feedback Banner */}
        {claimMsg.text && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-medium ${
            claimMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {claimMsg.text}
            </span>
            <button onClick={() => setClaimMsg({ type: '', text: '' })} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Level Roadmap */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                Ambassador Level Roadmap
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Progression tiers with points requirements and display revenue share</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.values(AMBASSADOR_LEVELS).map((lvl) => {
              const isCurrent = level.id === lvl.id;
              const isPassed = amb.totalPoints >= lvl.minPoints;

              return (
                <div
                  key={lvl.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40 scale-105'
                      : isPassed
                      ? 'bg-slate-950/80 border-slate-800 opacity-90'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{lvl.icon}</span>
                      {isCurrent ? (
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-[10px] font-black uppercase">Current</span>
                      ) : isPassed ? (
                        <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] font-bold">Locked</span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-white text-base">{lvl.name}</h3>
                    <p className="text-slate-400 text-xs font-mono mt-0.5">
                      {lvl.minPoints}{lvl.maxPoints === Infinity ? '+' : `–${lvl.maxPoints}`} pts
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] flex justify-between items-center text-slate-300 font-semibold">
                    <span>Rev Share:</span>
                    <span className="text-amber-400 font-bold">{lvl.id === 'platinum' ? '7–10%' : `${lvl.revenueSharePercent}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* QR Referral & Share Card */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Your Personal Referral Hub
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Share your unique link or QR code with peers. All registrations, completions, and course orders earn you live SV points.
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold shrink-0">
                  {amb.referralCode}
                </span>
              </div>

              {/* Referral Input & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-6">
                <input
                  type="text"
                  readOnly
                  value={amb.referralUrl || ''}
                  className="flex-1 bg-transparent px-3 py-1 text-sm text-indigo-200 font-mono focus:outline-none select-all overflow-ellipsis"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
                    title="Native Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Points Summary mini-matrix — teaser strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 group cursor-default">
                  <span className="text-slate-400 block text-[11px]">Approved Bonus</span>
                  <span className="text-emerald-400 font-extrabold">+{POINT_RULES.ambassador_approved} SVC</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Registration</span>
                  <span className="text-indigo-300 font-extrabold">+{POINT_RULES.registration} SVC</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Cert Completion</span>
                  <span className="text-cyan-400 font-extrabold">+{POINT_RULES.additional_certificate}–{POINT_RULES.first_certificate} SVC</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
                  <span className="text-slate-400 block text-[11px]">Hackathon Reg</span>
                  <span className="text-amber-400 font-extrabold">{HACKATHON_TIERS[0].display}–{HACKATHON_TIERS[HACKATHON_TIERS.length-1].display} Amt</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Share Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 justify-center">
                <QrCode className="w-4 h-4 text-indigo-400" />
                Referral QR Card
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-xl inline-block mb-4 border-2 border-indigo-500/30">
                <img
                  src={qrImageSrc}
                  alt="Referral QR Code"
                  className="w-36 h-36 object-contain"
                />
              </div>

              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Scan to instantly register on SkillValix using code <strong className="text-white">{amb.referralCode}</strong>
              </p>
            </div>

            <button
              onClick={handleDownloadQR}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              Download QR Image
            </button>
          </div>

        </section>

        {/* Structured Referral Analytics (8 Key Metrics) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Referral Analytics & Tracking
            </h2>
            <span className="text-xs text-slate-400">Live statistics summary</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Registrations</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalReferrals || 0}</div>
              <span className="text-[11px] text-slate-500">+10 pts each</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Profiles</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.profileCompletions || 0}</div>
              <span className="text-[11px] text-slate-500">+10 pts each</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Portfolios</span>
                <Code className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.portfolios || 0}</div>
              <span className="text-[11px] text-slate-500">+20 pts each</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Certificates</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalCerts || 0}</div>
              <span className="text-[11px] text-slate-500">First: +50 / Add: +20</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Paid Courses</span>
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.paidCourses || 0}</div>
              <span className="text-[11px] text-slate-500">10% Final Amt</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Paid Hackathons</span>
                <Trophy className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.paidHackathons || 0}</div>
              <span className="text-[11px] text-slate-500">10% Final Amt</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Job Simulations</span>
                <Briefcase className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.paidSimulations || 0}</div>
              <span className="text-[11px] text-slate-500">10% Final Amt</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Ambassadors</span>
                <Crown className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.studentsConverted || 0}</div>
              <span className="text-[11px] text-slate-500">+100 pts each</span>
            </div>
          </div>
        </section>

        {/* ===== TRANSPARENT POINT MATRIX v2.0 ===== */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 40%, #0d1020 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
          className="rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative"
        >
          {/* Decorative animated orbs */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-indigo-600/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-violet-600/8 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-600/4 blur-3xl" />

          {/* Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/40 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Transparent Point Matrix
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full">v2.0</span>
              </div>
              <p className="text-slate-400 text-xs">
                Every action your referred students take creates <span className="text-indigo-300 font-semibold">SV Contribution (SVC)</span> impact for you — tap a card to reveal your value.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl shrink-0">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tap cards to <span className="text-indigo-300 font-semibold">reveal</span></span>
            </div>
          </div>

          {/* Matrix grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* ── CARD 1: Course Certification ── */}
            <div
              onClick={() => toggleReveal('course_cert')}
              onMouseEnter={() => setMatrixHovered('course_cert')}
              onMouseLeave={() => setMatrixHovered(null)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: revealedCards['course_cert']
                  ? 'linear-gradient(135deg, #0c1a2e 0%, #0d1f3a 100%)'
                  : 'linear-gradient(135deg, #0c0c1e 0%, #111128 100%)',
                borderColor: revealedCards['course_cert'] ? 'rgba(34,211,238,0.4)' : 'rgba(51,65,85,0.7)',
                boxShadow: revealedCards['course_cert'] ? '0 0 30px rgba(34,211,238,0.08)' : 'none',
              }}
            >
              {matrixHovered === 'course_cert' && !revealedCards['course_cert'] && (
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none rounded-2xl" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                    style={{ background: 'rgba(34,211,238,0.12)', borderColor: 'rgba(34,211,238,0.3)' }}
                  >
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className={`transition-all duration-300 ${
                    revealedCards['course_cert'] ? 'opacity-100 scale-100' : 'opacity-60 scale-90'
                  }`}>
                    {revealedCards['course_cert']
                      ? <Check className="w-4 h-4 text-cyan-400" />
                      : <Lock className="w-4 h-4 text-slate-500" />
                    }
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-sm mb-1">Course Certification</h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  When your referred student earns a course certificate on SkillValix
                </p>

                {/* Reveal area */}
                <div className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  revealedCards['course_cert']
                    ? 'border-cyan-500/40 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700'
                }`}>
                  {revealedCards['course_cert'] ? (
                    <div className="animate-in fade-in duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your SVC Impact</span>
                        <span className="text-[10px] text-cyan-400/60">per student cert</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">🎓 First Certificate</span>
                          <span className="text-cyan-400 font-black text-sm">+{POINT_RULES.first_certificate} SVC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">📜 Additional Certs</span>
                          <span className="text-cyan-300 font-black text-sm">+{POINT_RULES.additional_certificate} SVC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">🔗 LinkedIn Share</span>
                          <span className="text-cyan-200 font-black text-sm">+{POINT_RULES.linkedin_certificate_share} SVC</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-cyan-500/20 text-[10px] text-cyan-400/70 text-center">
                        ✨ Stacks per student — no cap!
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-600 font-semibold ml-1">tap to reveal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 2: Job Simulation ── */}
            <div
              onClick={() => toggleReveal('job_sim')}
              onMouseEnter={() => setMatrixHovered('job_sim')}
              onMouseLeave={() => setMatrixHovered(null)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: revealedCards['job_sim']
                  ? 'linear-gradient(135deg, #1a0c2e 0%, #1e0d3a 100%)'
                  : 'linear-gradient(135deg, #0c0c1e 0%, #111128 100%)',
                borderColor: revealedCards['job_sim'] ? 'rgba(167,139,250,0.4)' : 'rgba(51,65,85,0.7)',
                boxShadow: revealedCards['job_sim'] ? '0 0 30px rgba(167,139,250,0.08)' : 'none',
              }}
            >
              {matrixHovered === 'job_sim' && !revealedCards['job_sim'] && (
                <div className="absolute inset-0 bg-violet-500/5 animate-pulse pointer-events-none rounded-2xl" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                    style={{ background: 'rgba(167,139,250,0.12)', borderColor: 'rgba(167,139,250,0.3)' }}
                  >
                    <Briefcase className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className={`transition-all duration-300 ${
                    revealedCards['job_sim'] ? 'opacity-100 scale-100' : 'opacity-60 scale-90'
                  }`}>
                    {revealedCards['job_sim']
                      ? <Check className="w-4 h-4 text-violet-400" />
                      : <Lock className="w-4 h-4 text-slate-500" />
                    }
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-sm mb-1">Job Simulation</h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  When your referred student completes a job simulation program
                </p>

                <div className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  revealedCards['job_sim']
                    ? 'border-violet-500/40 bg-violet-950/30'
                    : 'border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700'
                }`}>
                  {revealedCards['job_sim'] ? (
                    <div className="animate-in fade-in duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your SVC Impact</span>
                        <span className="text-[10px] text-violet-400/60">per completion</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">🆓 Free Simulation</span>
                          <span className="text-violet-300 font-black text-sm">+{POINT_RULES.job_simulation_free} SVC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">💼 Paid Simulation</span>
                          <span className="text-violet-400 font-black text-sm">10% of Amt</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-300">🏆 With Certificate</span>
                          <span className="text-violet-200 font-black text-sm">+{POINT_RULES.job_simulation_with_cert} SVC</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-violet-500/20 text-[10px] text-violet-400/70 text-center">
                        🎯 Counted per unique simulation completed
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-600 font-semibold ml-1">tap to reveal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 3: Hackathon Registration (RANGE-BASED) ── */}
            <div
              onClick={() => toggleReveal('hackathon_reg')}
              onMouseEnter={() => setMatrixHovered('hackathon_reg')}
              onMouseLeave={() => setMatrixHovered(null)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: revealedCards['hackathon_reg']
                  ? 'linear-gradient(135deg, #1a150a 0%, #261c05 100%)'
                  : 'linear-gradient(135deg, #0c0c1e 0%, #111128 100%)',
                borderColor: revealedCards['hackathon_reg'] ? 'rgba(251,191,36,0.4)' : 'rgba(51,65,85,0.7)',
                boxShadow: revealedCards['hackathon_reg'] ? '0 0 30px rgba(251,191,36,0.08)' : 'none',
              }}
            >
              {matrixHovered === 'hackathon_reg' && !revealedCards['hackathon_reg'] && (
                <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none rounded-2xl" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                    style={{ background: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.3)' }}
                  >
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">Range-Based</span>
                    <div className={`transition-all duration-300 ${
                      revealedCards['hackathon_reg'] ? 'opacity-100' : 'opacity-60'
                    }`}>
                      {revealedCards['hackathon_reg']
                        ? <Check className="w-4 h-4 text-amber-400" />
                        : <Lock className="w-4 h-4 text-slate-500" />
                      }
                    </div>
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-sm mb-1">Hackathon Registration</h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  When your referred student registers for a hackathon — higher fees = bigger multiplier
                </p>

                <div className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  revealedCards['hackathon_reg']
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-950/60 cursor-pointer hover:border-slate-700'
                }`}>
                  {revealedCards['hackathon_reg'] ? (
                    <div className="animate-in fade-in duration-300">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SVC by Registration Fee</span>
                      </div>
                      <div className="space-y-1">
                        {HACKATHON_TIERS.map((tier) => (
                          <div key={tier.label} className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-mono w-28">{tier.label}</span>
                            <div className="flex-1 mx-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-500"
                                style={{ width: tier.display }}
                              />
                            </div>
                            <span className={`text-xs font-black ${tier.color} w-8 text-right`}>{tier.display}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-amber-500/20 text-[10px] text-amber-400/70 text-center">
                        🚀 Free hackathons = flat +{POINT_RULES.hackathon_free} SVC per referral
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-600 font-semibold">tap to reveal tiers</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 4: Referral Registration ── */}
            <div
              onClick={() => toggleReveal('referral_reg')}
              onMouseEnter={() => setMatrixHovered('referral_reg')}
              onMouseLeave={() => setMatrixHovered(null)}
              className="cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: revealedCards['referral_reg']
                  ? 'linear-gradient(135deg, #0c1a10 0%, #0d2010 100%)'
                  : 'linear-gradient(135deg, #0c0c1e 0%, #111128 100%)',
                borderColor: revealedCards['referral_reg'] ? 'rgba(52,211,153,0.4)' : 'rgba(51,65,85,0.7)',
                boxShadow: revealedCards['referral_reg'] ? '0 0 30px rgba(52,211,153,0.08)' : 'none',
              }}
            >
              {matrixHovered === 'referral_reg' && !revealedCards['referral_reg'] && (
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none rounded-2xl" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                    style={{ background: 'rgba(52,211,153,0.12)', borderColor: 'rgba(52,211,153,0.3)' }}
                  >
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  {revealedCards['referral_reg']
                    ? <Check className="w-4 h-4 text-emerald-400" />
                    : <Lock className="w-4 h-4 text-slate-500" />
                  }
                </div>
                <h3 className="font-extrabold text-white text-sm mb-1">Student Registration</h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  When your link brings a new student to SkillValix
                </p>
                <div className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  revealedCards['referral_reg']
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}>
                  {revealedCards['referral_reg'] ? (
                    <div className="animate-in fade-in duration-300 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">📧 Signs Up</span>
                        <span className="text-emerald-400 font-black text-sm">+{POINT_RULES.registration} SVC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">✅ Profile Complete</span>
                        <span className="text-emerald-400 font-black text-sm">+{POINT_RULES.profile_completed} SVC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">🗂️ Portfolio Live</span>
                        <span className="text-emerald-400 font-black text-sm">+{POINT_RULES.portfolio_published} SVC</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="flex gap-1">{[...Array(5)].map((_, i) => <div key={i} className="w-5 h-5 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />)}</div>
                      <span className="text-[11px] text-slate-600 font-semibold ml-1">tap to reveal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 5: Paid Courses ── */}
            <div
              onClick={() => toggleReveal('paid_course')}
              onMouseEnter={() => setMatrixHovered('paid_course')}
              onMouseLeave={() => setMatrixHovered(null)}
              className="cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: revealedCards['paid_course']
                  ? 'linear-gradient(135deg, #1a100c 0%, #201205 100%)'
                  : 'linear-gradient(135deg, #0c0c1e 0%, #111128 100%)',
                borderColor: revealedCards['paid_course'] ? 'rgba(251,146,60,0.4)' : 'rgba(51,65,85,0.7)',
                boxShadow: revealedCards['paid_course'] ? '0 0 30px rgba(251,146,60,0.08)' : 'none',
              }}
            >
              {matrixHovered === 'paid_course' && !revealedCards['paid_course'] && (
                <div className="absolute inset-0 bg-orange-500/5 animate-pulse pointer-events-none rounded-2xl" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                    style={{ background: 'rgba(251,146,60,0.12)', borderColor: 'rgba(251,146,60,0.3)' }}
                  >
                    <BookOpen className="w-5 h-5 text-orange-400" />
                  </div>
                  {revealedCards['paid_course']
                    ? <Check className="w-4 h-4 text-orange-400" />
                    : <Lock className="w-4 h-4 text-slate-500" />
                  }
                </div>
                <h3 className="font-extrabold text-white text-sm mb-1">Paid Course Purchase</h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  When your referred student buys a premium course
                </p>
                <div className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  revealedCards['paid_course']
                    ? 'border-orange-500/40 bg-orange-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}>
                  {revealedCards['paid_course'] ? (
                    <div className="animate-in fade-in duration-300 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">💳 Purchase Amount</span>
                        <span className="text-orange-400 font-black text-sm">{Math.round(0.10 * 100)}% SVC</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">e.g., ₹999 course → +{Math.floor(999 * 0.10)} SVC credited to you</p>
                      <div className="mt-2 pt-2 border-t border-orange-500/20 text-[10px] text-orange-400/70 text-center">
                        ♾️ No cap — every rupee counts!
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="flex gap-1">{[...Array(5)].map((_, i) => <div key={i} className="w-5 h-5 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.12}s` }} />)}</div>
                      <span className="text-[11px] text-slate-600 font-semibold ml-1">tap to reveal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CARD 6: Ambassador Conversion (JACKPOT) ── */}
            <div
              onClick={() => toggleReveal('amb_convert')}
              onMouseEnter={() => setMatrixHovered('amb_convert')}
              onMouseLeave={() => setMatrixHovered(null)}
              className="cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: revealedCards['amb_convert']
                  ? 'linear-gradient(135deg, #160a2a 0%, #1a0835 100%)'
                  : 'linear-gradient(135deg, #0c0c1e 0%, #111128 100%)',
                borderColor: revealedCards['amb_convert'] ? 'rgba(232,121,249,0.5)' : 'rgba(51,65,85,0.7)',
                boxShadow: revealedCards['amb_convert'] ? '0 0 40px rgba(232,121,249,0.12)' : 'none',
              }}
            >
              {!revealedCards['amb_convert'] && (
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-black bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded-full uppercase animate-pulse">Jackpot</span>
                </div>
              )}
              {matrixHovered === 'amb_convert' && !revealedCards['amb_convert'] && (
                <div className="absolute inset-0 bg-fuchsia-500/5 animate-pulse pointer-events-none rounded-2xl" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                    style={{ background: 'rgba(232,121,249,0.12)', borderColor: 'rgba(232,121,249,0.3)' }}
                  >
                    <Crown className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  {revealedCards['amb_convert']
                    ? <Check className="w-4 h-4 text-fuchsia-400" />
                    : <Lock className="w-4 h-4 text-slate-500" />
                  }
                </div>
                <h3 className="font-extrabold text-white text-sm mb-1">Ambassador Conversion</h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  When your referred student becomes a Campus Ambassador themselves
                </p>
                <div className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  revealedCards['amb_convert']
                    ? 'border-fuchsia-500/40 bg-fuchsia-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}>
                  {revealedCards['amb_convert'] ? (
                    <div className="animate-in fade-in duration-300 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">👑 Per Conversion</span>
                        <span className="text-fuchsia-400 font-black text-lg">+{POINT_RULES.student_becomes_ambassador} SVC</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-fuchsia-500/20 text-[10px] text-fuchsia-400/80 text-center">
                        🌟 Rare event, massive impact!
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 py-3">
                      <div className="flex gap-1">{[...Array(5)].map((_, i) => <div key={i} className="w-5 h-5 rounded bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
                      <span className="text-[11px] text-slate-600 font-semibold">🤫 biggest secret</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom CTA strip */}
          <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/60 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">SVC = SV Contribution Points</p>
                <p className="text-[11px] text-slate-500">All points are tracked in real-time and contribute to your Ambassador level & reward eligibility.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Your current total: <strong className="text-indigo-300">{amb.totalSVPoints || amb.totalPoints || 0} SVC</strong></span>
            </div>
          </div>
        </section>

        {/* Achievement Badges Grid */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-400" />
                Achievement Badges
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Stack badges as you grow your referral network</p>
            </div>
            <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
              {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                  b.unlocked
                    ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/40 shadow-lg shadow-purple-500/5'
                    : 'bg-slate-950/50 border-slate-800 opacity-40'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                  b.unlocked ? 'bg-purple-500/20 border-purple-500/40' : 'bg-slate-900 border-slate-800'
                }`}>
                  {b.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-white text-sm">{b.title}</h3>
                    {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-snug">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reward Status Flow Tracker */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-400" />
                Milestone Reward Eligibility & Tracker
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Status Flow: Locked → Eligible → Requested → Approved/Rejected → Claimed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {milestoneStatus.map((m) => (
              <div
                key={m.tier}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  m.status === 'claimed'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : m.status === 'approved'
                    ? 'bg-teal-950/30 border-teal-500/40 text-teal-300'
                    : m.status === 'requested'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    : m.status === 'eligible'
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{m.icon}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      m.status === 'claimed'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : m.status === 'approved'
                        ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                        : m.status === 'requested'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : m.status === 'eligible'
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-lg">{m.name} Tier</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{m.requiredPoints} SV Points required</p>

                  {m.adminNote && (
                    <p className="text-xs italic text-amber-300/80 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      Note: {m.adminNote}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60">
                  {m.status === 'eligible' && (
                    <button
                      onClick={() => handleClaimReward(m.tier)}
                      disabled={claimingTier === m.tier}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
                    >
                      {claimingTier === m.tier ? 'Submitting Request...' : 'REQUEST REWARD'}
                    </button>
                  )}

                  {m.status === 'requested' && (
                    <span className="text-xs text-amber-400 font-semibold block text-center">
                      Under Admin Review
                    </span>
                  )}

                  {m.status === 'approved' && (
                    <span className="text-xs text-teal-400 font-semibold block text-center">
                      Approved! Fulfillment in progress.
                    </span>
                  )}

                  {m.status === 'claimed' && (
                    <span className="text-xs text-emerald-400 font-semibold block text-center flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Milestone Claimed
                    </span>
                  )}

                  {m.status === 'locked' && (
                    <span className="text-xs text-slate-500 block text-center">
                      Locked ({m.requiredPoints - amb.totalPoints} pts left)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Chart & Audit History */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Monthly Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Monthly Point Growth Chart
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Points earned from your referral activity per month</p>
              </div>
            </div>

            {pointsByMonth.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pointsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="points" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#818cf8', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
                <TrendingUp className="w-8 h-8 mb-2 text-slate-600" />
                No monthly point data recorded yet.
              </div>
            )}
          </div>

          {/* Recent Point History Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Point Audit History Log
                </h3>
              </div>

              {pointHistory.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {pointHistory.map((h) => (
                    <div key={h._id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white truncate max-w-[180px]">
                          {h.description || h.eventType}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.date || h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • {h.addedBy}
                        </span>
                      </div>
                      <span className={`font-black text-sm ${h.points > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {h.points > 0 ? `+${h.points}` : h.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No point history recorded yet.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center mt-3">
              🔒 Every point update is saved in an audit trail log.
            </div>
          </div>

        </section>

      </div>

      {/* Leaderboard Modal */}
      {showLbModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Campus Ambassador Leaderboard</h3>
                  <p className="text-xs text-slate-400">Top performing Campus Ambassadors across India</p>
                </div>
              </div>
              <button
                onClick={() => setShowLbModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {['weekly', 'monthly', 'all_time'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setLbTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                      lbTimeframe === tf ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Sort By:</span>
                <select
                  value={lbSortBy}
                  onChange={(e) => setLbSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="points">SV Points</option>
                  <option value="referrals">Referrals</option>
                  <option value="certificates">Certificates</option>
                </select>
              </div>
            </div>

            {/* Leaderboard Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loadingLb ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading leaderboard rankings...
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No rankings found for this timeframe.
                </div>
              ) : (
                <>
                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {/* Rank 2 - Silver */}
                    {leaderboard[1] && (
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center flex flex-col items-center justify-end relative shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 font-black text-sm flex items-center justify-center mb-2">
                          🥈
                        </div>
                        <h4 className="font-extrabold text-white text-xs truncate max-w-[120px]">{leaderboard[1].name}</h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{leaderboard[1].college}</p>
                        <span className="mt-2 text-xs font-black text-indigo-300">
                          {lbSortBy === 'referrals' ? `${leaderboard[1].periodReferrals} refs` : lbSortBy === 'certificates' ? `${leaderboard[1].periodCertificates} certs` : `${leaderboard[1].periodPoints} pts`}
                        </span>
                      </div>
                    )}

                    {/* Rank 1 - Gold */}
                    {leaderboard[0] && (
                      <div className="bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-500/50 rounded-2xl p-5 text-center flex flex-col items-center justify-end relative shadow-2xl scale-105">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 text-yellow-400 border border-yellow-500/40 font-black text-base flex items-center justify-center mb-2 animate-bounce">
                          🥇
                        </div>
                        <h4 className="font-extrabold text-white text-sm truncate max-w-[130px]">{leaderboard[0].name}</h4>
                        <p className="text-[10px] text-slate-300 truncate max-w-[130px]">{leaderboard[0].college}</p>
                        <span className="mt-2 text-sm font-black text-amber-400">
                          {lbSortBy === 'referrals' ? `${leaderboard[0].periodReferrals} refs` : lbSortBy === 'certificates' ? `${leaderboard[0].periodCertificates} certs` : `${leaderboard[0].periodPoints} pts`}
                        </span>
                      </div>
                    )}

                    {/* Rank 3 - Bronze */}
                    {leaderboard[2] && (
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center flex flex-col items-center justify-end relative shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-amber-800/20 text-amber-400 border border-amber-700/40 font-black text-sm flex items-center justify-center mb-2">
                          🥉
                        </div>
                        <h4 className="font-extrabold text-white text-xs truncate max-w-[120px]">{leaderboard[2].name}</h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{leaderboard[2].college}</p>
                        <span className="mt-2 text-xs font-black text-amber-300">
                          {lbSortBy === 'referrals' ? `${leaderboard[2].periodReferrals} refs` : lbSortBy === 'certificates' ? `${leaderboard[2].periodCertificates} certs` : `${leaderboard[2].periodPoints} pts`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rest of Ranks List */}
                  <div className="divide-y divide-slate-800 pt-4">
                    {leaderboard.slice(3).map((item) => (
                      <div key={item._id} className="py-3 flex items-center justify-between text-xs px-2 hover:bg-slate-800/30 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-6 font-bold text-slate-500 text-center">#{item.rank}</span>
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.college}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-white text-sm block">
                            {lbSortBy === 'referrals' ? `${item.periodReferrals} refs` : lbSortBy === 'certificates' ? `${item.periodCertificates} certs` : `${item.periodPoints} pts`}
                          </span>
                          <span className="text-[10px] text-indigo-400">{item.level?.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AmbassadorDashboard;
