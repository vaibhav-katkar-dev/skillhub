import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { api, useAuthStore } from '../store/authStore';
import {
  Award, Copy, Check, Share2, Sparkles, TrendingUp, Users, LogIn,
  CreditCard, ShieldCheck, Gift, ChevronRight, Clock, CheckCircle2,
  AlertCircle, Trophy, Star, ArrowUpRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AmbassadorDashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [claimingTier, setClaimingTier] = useState('');
  const [claimMsg, setClaimMsg] = useState({ type: '', text: '' });

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

  useEffect(() => {
    fetchDashboard();
  }, []);

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
          text: 'Master in-demand skills, get certified, and land your dream job with SkillValix.',
          url: data.ambassador.referralUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading Ambassador Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Ambassador Portal Access</h2>
          <p className="text-slate-300 text-sm">{error}</p>
          <div className="pt-2">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
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
  const recentEvents = data?.recentEvents || [];
  const pointsByMonth = data?.pointsByMonth || [];
  const milestoneStatus = data?.milestoneStatus || [];
  const nextMilestone = data?.nextMilestone;

  // Calculate current tier
  let currentTier = 'Explorer';
  let tierBadgeBg = 'from-slate-700 to-slate-800 text-slate-300 border-slate-600';
  if (amb.totalPoints >= 3000) {
    currentTier = '🥇 Gold Ambassador';
    tierBadgeBg = 'from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30';
  } else if (amb.totalPoints >= 1500) {
    currentTier = '🥈 Silver Ambassador';
    tierBadgeBg = 'from-slate-400/20 to-slate-200/20 text-slate-200 border-slate-300/30';
  } else if (amb.totalPoints >= 500) {
    currentTier = '🥉 Bronze Ambassador';
    tierBadgeBg = 'from-amber-700/20 to-orange-700/20 text-amber-300 border-amber-600/30';
  }

  // Calculate progress percent to next tier
  let progressPercent = 100;
  if (nextMilestone) {
    const prevThreshold = nextMilestone.tier === 'bronze' ? 0 : nextMilestone.tier === 'silver' ? 500 : 1500;
    const needed = nextMilestone.required - prevThreshold;
    const currentInTier = Math.max(0, amb.totalPoints - prevThreshold);
    progressPercent = Math.min(100, Math.round((currentInTier / needed) * 100));
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'registration': return <Users className="w-4 h-4 text-emerald-400" />;
      case 'login': return <LogIn className="w-4 h-4 text-cyan-400" />;
      case 'free_hackathon': return <Award className="w-4 h-4 text-indigo-400" />;
      case 'paid_hackathon': return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'paid_course': return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'paid_simulation': return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'certificate': return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'ambassador_login': return <Star className="w-4 h-4 text-amber-300" />;
      case 'ambassador_approved': return <Gift className="w-4 h-4 text-emerald-300" />;
      default: return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventLabel = (event) => {
    switch (event.eventType) {
      case 'registration': return 'Referred User Registration';
      case 'login': return 'Referred User Login';
      case 'free_hackathon': return 'Referred Free Hackathon Registration';
      case 'paid_hackathon': return 'Referred Paid Hackathon';
      case 'paid_course': return 'Referred Paid Course Purchase';
      case 'paid_simulation': return 'Referred Job Simulation Cert';
      case 'certificate': return 'Referred User Certificate Issued';
      case 'ambassador_login': return 'Daily Ambassador Login';
      case 'ambassador_approved': return 'Campus Ambassador Approval Bonus';
      default: return event.eventType;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Helmet>
        <title>Campus Ambassador Dashboard | SkillValix</title>
        <meta name="description" content="SkillValix Campus Ambassador Portal. Track referrals, earn price-aware points, unlock rewards, and view admin analytics." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 pt-10 pb-12 border-b border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border bg-gradient-to-r ${tierBadgeBg}`}>
                  {currentTier}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Official Ambassador ({amb.college})
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>!
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Share your referral link to help peers gain industry skills and unlock reward tiers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </button>
            </div>
          </div>

          {/* Core Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Points</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{amb.totalPoints} <span className="text-xs font-normal text-amber-400">pts</span></div>
              <p className="text-slate-400 text-xs mt-1">Price-aware referral points</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Referred Users</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{stats.totalReferrals}</div>
              <p className="text-slate-400 text-xs mt-1">Registered using your code</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Paid Activities</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{stats.paidActivities}</div>
              <p className="text-slate-400 text-xs mt-1">Courses, Sims & Hackathons</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Certs Earned</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{stats.totalCerts}</div>
              <p className="text-slate-400 text-xs mt-1">Completed by referred users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Claim Feedback Banner */}
        {claimMsg.text && (
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
            claimMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <span>{claimMsg.text}</span>
            <button onClick={() => setClaimMsg({ type: '', text: '' })} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Referral URL Card & Progress Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Referral Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Your Unique Referral Link
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Share this link with students. Anyone registering via your link earns you referral points on logins, courses, hackathons, and certifications.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg">
                {amb.referralCode}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <input
                type="text"
                readOnly
                value={amb.referralUrl || ''}
                className="flex-1 bg-transparent px-3 py-1.5 text-sm text-indigo-200 font-mono focus:outline-none select-all overflow-ellipsis"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Point Table summary */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Registration</span>
                <span className="text-emerald-400 font-bold">+10 pts</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Login (5× cap)</span>
                <span className="text-cyan-400 font-bold">+2 pts</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Paid Course</span>
                <span className="text-purple-400 font-bold">Up to 60 pts</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Paid Hackathon</span>
                <span className="text-amber-400 font-bold">Up to 100 pts</span>
              </div>
            </div>
          </div>

          {/* Tier Progress Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Milestone Progress</h3>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              {nextMilestone ? (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-black text-white">{amb.totalPoints} <span className="text-xs font-normal text-slate-400">/ {nextMilestone.required} pts</span></span>
                    <span className="text-xs font-semibold text-indigo-400">Next: {nextMilestone.tier.toUpperCase()}</span>
                  </div>

                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <p className="text-slate-400 text-xs mt-3">
                    Need <strong className="text-white">{nextMilestone.required - amb.totalPoints} more points</strong> to unlock {nextMilestone.tier} reward milestone!
                  </p>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">All Tiers Unlocked!</h4>
                  <p className="text-xs text-slate-400 mt-1">You have reached the maximum Gold Ambassador tier status.</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2">Milestones:</div>
              <div className="flex items-center gap-2">
                {milestoneStatus.map((m) => (
                  <div
                    key={m.tier}
                    className={`flex-1 p-2 rounded-xl text-center border transition-all ${
                      m.claimed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : m.requested
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : m.unlocked
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200 animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold">{m.tier}</div>
                    <div className="text-xs font-extrabold mt-0.5">{m.required} pts</div>
                    {m.unlocked && !m.claimed && !m.requested && (
                      <button
                        onClick={() => handleClaimReward(m.tier)}
                        disabled={claimingTier === m.tier}
                        className="mt-1.5 w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded transition-all"
                      >
                        {claimingTier === m.tier ? '...' : 'CLAIM'}
                      </button>
                    )}
                    {m.requested && <span className="text-[9px] block text-amber-400 mt-1">Pending</span>}
                    {m.claimed && <span className="text-[9px] block text-emerald-400 mt-1">Claimed</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Points Over Time Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Monthly Points Growth
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Points earned from your referral ecosystem per month</p>
              </div>
            </div>

            {pointsByMonth.length > 0 ? (
              <div className="h-64 w-full">
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
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                <TrendingUp className="w-8 h-8 mb-2 text-slate-600" />
                No monthly data yet. Start sharing your referral link!
              </div>
            )}
          </div>

          {/* Milestone Status detail */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              Reward Tier Directory
            </h3>
            
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-700/20 border border-amber-600/30 text-amber-400 flex items-center justify-center font-bold">
                    🥉
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bronze Tier</h4>
                    <p className="text-xs text-slate-400">500 points required</p>
                  </div>
                </div>
                {amb.claimedMilestones?.includes('bronze') ? (
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">Claimed</span>
                ) : amb.totalPoints >= 500 ? (
                  <button
                    onClick={() => handleClaimReward('bronze')}
                    disabled={claimingTier === 'bronze'}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Locked</span>
                )}
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-400/20 border border-slate-300/30 text-slate-200 flex items-center justify-center font-bold">
                    🥈
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Silver Tier</h4>
                    <p className="text-xs text-slate-400">1,500 points required</p>
                  </div>
                </div>
                {amb.claimedMilestones?.includes('silver') ? (
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">Claimed</span>
                ) : amb.totalPoints >= 1500 ? (
                  <button
                    onClick={() => handleClaimReward('silver')}
                    disabled={claimingTier === 'silver'}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Locked</span>
                )}
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-yellow-500/30 text-yellow-400 flex items-center justify-center font-bold">
                    🥇
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Gold Tier</h4>
                    <p className="text-xs text-slate-400">3,000 points required</p>
                  </div>
                </div>
                {amb.claimedMilestones?.includes('gold') ? (
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">Claimed</span>
                ) : amb.totalPoints >= 3000 ? (
                  <button
                    onClick={() => handleClaimReward('gold')}
                    disabled={claimingTier === 'gold'}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Locked</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Live Referral Activity Feed
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 30 point events triggered by your referrals</p>
            </div>
          </div>

          {recentEvents.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {recentEvents.map((event) => (
                <div key={event._id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getEventIcon(event.eventType)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {getEventLabel(event)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{new Date(event.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        {event.amountPaidInr > 0 && (
                          <span className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 text-[10px]">
                            ₹{event.amountPaidInr} paid
                          </span>
                        )}
                        {event.couponCode && (
                          <span className="text-pink-300 bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20 text-[10px]">
                            Coupon: {event.couponCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-emerald-400 font-extrabold text-sm shrink-0">
                    +{event.points} pts
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              No referral activity recorded yet. Share your referral link to get started!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AmbassadorDashboard;
