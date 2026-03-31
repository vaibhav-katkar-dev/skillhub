import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock3,
  CreditCard,
  ExternalLink,
  FileText,
  Link2,
  Lock,
  Loader2,
  Plus,
  Send,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';

const STATUS_STYLE = {
  upcoming: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Upcoming', icon: Clock3 },
  live:     { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Live Now', icon: CircleDot },
  ended:    { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Ended', icon: CheckCircle2 },
};

const REG_STATUS_STYLE = {
  registered:      { bg: 'bg-indigo-100',  text: 'text-indigo-700',  label: 'Registered' },
  payment_pending: { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Payment Pending' },
  submitted:       { bg: 'bg-sky-100',     text: 'text-sky-700',     label: 'Submitted' },
  under_review:    { bg: 'bg-violet-100',  text: 'text-violet-700',  label: 'Under Review' },
  approved:        { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' },
  rejected:        { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Rejected' },
  winner:          { bg: 'bg-amber-200',   text: 'text-amber-900',   label: '🏆 Winner' },
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function HackathonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [hack, setHack] = useState(null);
  const [loadingHack, setLoadingHack] = useState(true);

  const [registration, setRegistration] = useState(null);
  const [loadingReg, setLoadingReg] = useState(false);

  const [winners, setWinners] = useState(null);

  // Team registration
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]); // array of {name, email}

  // Submission
  const [submissionLink, setSubmissionLink] = useState('');
  const [note, setNote] = useState('');

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: '', tone: 'info' });

  const rules = useMemo(() => hack?.contentConfig?.rules || [], [hack]);
  const judgingCriteria = useMemo(() => hack?.contentConfig?.judgingCriteria || [], [hack]);
  const timeline = useMemo(() => hack?.contentConfig?.timeline || [], [hack]);
  const prizes = useMemo(() => hack?.prizes || [], [hack]);
  const faqs = useMemo(() => hack?.contentConfig?.faqs || [], [hack]);

  const statusStyle = STATUS_STYLE[hack?.status] || STATUS_STYLE.upcoming;
  const StatusIcon = statusStyle.icon;

  const showMsg = (text, tone = 'info') => setMsg({ text, tone });

  const fetchHack = useCallback(async () => {
    setLoadingHack(true);
    try {
      const r = await api.get(`/events/hackathons/${id}`);
      setHack(r.data);
    } catch {
      setHack(null);
    } finally {
      setLoadingHack(false);
    }
  }, [id]);

  const fetchMyTeam = useCallback(async () => {
    if (!isAuthenticated || !hack?._id) { setRegistration(null); return; }
    setLoadingReg(true);
    try {
      const r = await api.get(`/events/hackathons/${hack._id}/my-team`);
      setRegistration(r.data);
    } catch {
      setRegistration(null);
    } finally {
      setLoadingReg(false);
    }
  }, [hack?._id, isAuthenticated]);

  const fetchWinners = useCallback(async () => {
    try {
      const r = await api.get(`/events/hackathons/${id}/winners`);
      setWinners(r.data);
    } catch {
      setWinners(null);
    }
  }, [id]);

  useEffect(() => { fetchHack(); }, [fetchHack]);
  useEffect(() => { fetchMyTeam(); }, [fetchMyTeam]);
  useEffect(() => { if (hack?.winnerConfig?.announced) fetchWinners(); }, [hack, fetchWinners]);

  // ── Dynamic member rows ──────────────────────────────────────────────────
  const teamMax = Number(hack?.teamConfig?.maxMembers || 4);
  const teamMin = Number(hack?.teamConfig?.minMembers || 1);

  const addMemberRow = () => {
    if (members.length < teamMax - 1) {
      setMembers((prev) => [...prev, { name: '', email: '' }]);
    }
  };

  const removeMemberRow = (idx) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMember = (idx, field, val) => {
    setMembers((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: val } : m));
  };

  // ── Countdown Timer ────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!hack?.endDate || hack.status === 'ended') {
      setTimeLeft('');
      return;
    }
    const updateTimer = () => {
      const diff = new Date(hack.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`);
    };
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [hack?.endDate, hack?.status]);

  // ── Team registration ──────────────────────────────────────────────────────
  const handleRegisterTeam = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }

    const trimmedTeam = String(teamName || '').trim();
    if (trimmedTeam.length < 3) {
      showMsg('Team name must be at least 3 characters.', 'error'); return;
    }

    // Validate members: every non-empty row must have both name and email
    const filledMembers = members.filter((m) => m.email.trim());
    for (const m of filledMembers) {
      if (!m.name.trim()) {
        showMsg('Please enter a name for every teammate you added.', 'error'); return;
      }
      try { new URL(`mailto:${m.email.trim()}`); } catch { /* basic check */ }
    }

    setBusy(true);
    showMsg('Registering your team…', 'info');
    try {
      await api.post(`/events/hackathons/${hack._id}/register`, {
        teamName: trimmedTeam,
        memberEmails: filledMembers.map((m) => m.email.trim()),
      });
      await fetchMyTeam();
      showMsg('Team registered successfully! You are the team leader.', 'success');
      setTeamName('');
      setMembers([{ name: '', email: '' }]);
    } catch (err) {
      const missing = err.response?.data?.missingEmails;
      if (Array.isArray(missing) && missing.length) {
        showMsg(`These emails are not registered SkillValix users: ${missing.join(', ')}`, 'error');
      } else {
        showMsg(err.response?.data?.message || 'Failed to register team.', 'error');
      }
    } finally {
      setBusy(false);
    }
  };

  // ── Payment ────────────────────────────────────────────────────────────────
  const handlePay = async () => {
    if (!registration) return;
    setBusy(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      showMsg('Payment gateway failed to load. Please try again.', 'error');
      setBusy(false);
      return;
    }
    try {
      const orderRes = await api.post(`/events/hackathons/${hack._id}/razorpay-order`, { registrationId: registration._id });
      const order = orderRes.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'SkillValix',
        description: order.description || `Hackathon Registration: ${hack?.title || ''}`,
        theme: { color: hack?.styleConfig?.accentColor || '#4F46E5' },
        handler: async (response) => {
          try {
            await api.post(`/events/hackathons/${hack._id}/payment/verify`, {
              registrationId: registration._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await fetchMyTeam();
            showMsg('Payment successful. Submission is now unlocked!', 'success');
          } catch (err) {
            showMsg(err.response?.data?.message || 'Payment verification failed.', 'error');
          } finally {
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        showMsg(response?.error?.description || 'Payment failed.', 'error');
        setBusy(false);
      });
      razorpay.open();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Could not initiate payment.', 'error');
      setBusy(false);
    }
  };

  // ── Submit solution ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!registration) return;
    const link = String(submissionLink || '').trim();
    if (!link) { showMsg('Submission link is required.', 'error'); return; }
    try { new URL(link); } catch {
      showMsg('Please enter a valid URL (starting with https:// or http://).', 'error'); return;
    }

    setBusy(true);
    showMsg('Submitting your solution…', 'info');
    try {
      await api.post(`/events/hackathons/${hack._id}/submit`, {
        registrationId: registration._id,
        submissionLink: link,
        note: String(note || '').trim(),
      });
      await fetchMyTeam();
      showMsg('Solution submitted successfully! 🎉', 'success');
      setSubmissionLink('');
      setNote('');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to submit solution.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loadingHack) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-8 w-40 rounded-xl bg-slate-200 animate-pulse" />
          <div className="rounded-2xl border border-slate-200 bg-white h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!hack) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="text-slate-900 text-xl font-bold">Hackathon not found.</p>
          <Link to="/events" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const paymentRequired = Boolean(hack?.paymentConfig?.enabled && Number(hack?.paymentConfig?.amountInr || 0) > 0);
  const submissionInstructions = hack?.submissionConfig?.instructions || '';
  const linkLabel = hack?.submissionConfig?.linkLabel || 'Submission Link';
  const linkPlaceholder = hack?.submissionConfig?.linkPlaceholder || 'Paste your link here…';
  const linkHint = hack?.submissionConfig?.linkHint || '';
  const canSubmit = registration && (!registration.payment?.required || registration.payment?.status === 'paid') && hack.status !== 'ended';
  const regStatusStyle = REG_STATUS_STYLE[registration?.status] || REG_STATUS_STYLE.registered;
  const isLeader = registration && user && String(registration.leader?._id || registration.leader) === String(user._id || user.id);
  const submissionCount = registration?.submissions?.length || 0;
  const maxSubs = Number(hack?.submissionConfig?.maxSubmissionsPerTeam || 3);

  // SEO canonical URL
  const canonicalPath = hack.slug ? `/events/hackathon/${hack.slug}` : `/events/hackathon/${hack._id}`;
  const canonicalUrl = `https://www.skillvalix.com${canonicalPath}`;

  return (
    <>
      <Helmet>
        <title>{hack.title} | Hackathon | SkillValix</title>
        <meta name="description" content={hack.tagline || hack.description?.slice(0, 155) || 'Join this hackathon on SkillValix'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph */}
        <meta property="og:title" content={`${hack.title} | SkillValix Hackathon`} />
        <meta property="og:description" content={hack.tagline || hack.description?.slice(0, 155) || ''} />
        {hack.image && <meta property="og:image" content={hack.image} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="event" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${hack.title} | SkillValix Hackathon`} />
        <meta name="twitter:description" content={hack.tagline || hack.description?.slice(0, 155) || ''} />
        {hack.image && <meta name="twitter:image" content={hack.image} />}
      </Helmet>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 px-6">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto">
          <Link to="/events" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white text-sm font-semibold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
            {/* Title card */}
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 text-white">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusStyle.label}
                </span>
                {hack.featured && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black leading-tight">{hack.title}</h1>
              {hack.tagline && <p className="text-indigo-200 mt-2 font-semibold">{hack.tagline}</p>}
              <p className="text-slate-200 mt-4 leading-relaxed">{hack.description}</p>

              {hack.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {hack.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Snapshot card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm uppercase tracking-widest font-black text-slate-700 mb-4">Event Snapshot</h2>

              {/* Countdown Timer */}
              {hack?.endDate && hack.status !== 'ended' && timeLeft && timeLeft !== 'Ended' && (
                <div className="mb-5 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-3 text-center">
                  <p className="text-xs uppercase tracking-widest font-black text-red-500 mb-1 flex items-center justify-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5" /> Submission Deadline
                  </p>
                  <p className="text-xl font-black text-red-600 font-mono tracking-tight tabular-nums">
                    {timeLeft}
                  </p>
                </div>
              )}
              {hack.status === 'ended' && (
                <div className="mb-5 rounded-xl bg-slate-100 border border-slate-200 p-3 text-center">
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Ended</p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Team Size</span>
                  <span className="font-bold text-slate-900">{teamMin} – {teamMax} members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Entry</span>
                  <span className="font-bold text-slate-900">{paymentRequired ? `₹${hack.paymentConfig.amountInr}` : 'Free'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Submission Limit</span>
                  <span className="font-bold text-slate-900">{maxSubs} per team</span>
                </div>
                {hack?.submissionConfig?.acceptsAnyLink ? (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Link Type</span>
                    <span className="font-bold text-emerald-700">Any URL</span>
                  </div>
                ) : (
                  <>
                    {hack?.submissionConfig?.acceptsDriveLink && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Google Drive</span>
                        <span className="font-bold text-emerald-700">✓ Allowed</span>
                      </div>
                    )}
                    {hack?.submissionConfig?.acceptsPdfLink && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">PDF Link</span>
                        <span className="font-bold text-emerald-700">✓ Allowed</span>
                      </div>
                    )}
                  </>
                )}
                {hack?.startDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Starts</span>
                    <span className="font-bold text-slate-900">{new Date(hack.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
                {hack?.endDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ends</span>
                    <span className="font-bold text-slate-900">{new Date(hack.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Winners Banner ── */}
      {hack.winnerConfig?.announced && winners?.winners?.length > 0 && (
        <section className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-5">
              <h2 className="text-2xl font-black text-amber-900 flex items-center justify-center gap-2">
                <Trophy className="w-7 h-7" /> Winners Announced!
              </h2>
              {winners.note && <p className="text-amber-800 mt-1 font-medium">{winners.note}</p>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {winners.winners.map((w) => (
                <div key={w._id} className="bg-white rounded-2xl border-2 border-amber-300 p-5 text-center shadow-lg">
                  <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-1">{w.winnerRank || 'Winner'}</p>
                  <p className="text-lg font-black text-slate-900">{w.teamName}</p>
                  {w.winnerNote && <p className="text-sm text-slate-500 mt-1">{w.winnerNote}</p>}
                  <p className="text-xs text-slate-400 mt-2">
                    {(w.members || []).map((m) => m.name || m.email).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <section className="bg-slate-50 px-6 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-6">
          {/* Left column - info */}
          <div className="space-y-6">
            {/* Prizes & FAQs */}
            {(prizes.length > 0 || faqs.length > 0) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> About this Hackathon
                </h2>

                {prizes.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Prize Pool</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {prizes.map((prize, idx) => (
                        <div key={`${prize.rank}-${idx}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">{prize.rank || `Prize ${idx + 1}`}</p>
                          <p className="text-lg font-black text-amber-900 mt-1">{prize.amount || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {faqs.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">FAQs</p>
                    <div className="space-y-3">
                      {faqs.map((faq, idx) => (
                        <details key={`${faq.question}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4 group">
                          <summary className="text-sm font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                            {faq.question}
                            <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg">+</span>
                          </summary>
                          <p className="text-sm text-slate-600 mt-2">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submission instructions */}
            {submissionInstructions && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Submission Instructions
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{submissionInstructions}</p>
              </div>
            )}

            {/* Rules */}
            {rules.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3">Rules</h3>
                <ul className="space-y-2 text-slate-700 list-none">
                  {rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Judging criteria */}
            {judgingCriteria.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3">Judging Criteria</h3>
                <ul className="space-y-2 text-slate-700 list-none">
                  {judgingCriteria.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Clock3 className="w-5 h-5 text-indigo-600" /> Timeline
                </h3>
                <div className="relative pl-4 border-l-2 border-indigo-200 space-y-4">
                  {timeline.map((entry, idx) => (
                    <div key={`${entry.label}-${idx}`} className="relative">
                      <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white" />
                      <p className="text-sm font-bold text-slate-900">{entry.label || `Milestone ${idx + 1}`}</p>
                      <p className="text-xs text-indigo-600 mt-0.5">
                        {entry.date ? new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date TBA'}
                      </p>
                      {entry.description && <p className="text-sm text-slate-600 mt-1">{entry.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - registration sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
              {/* Already registered - status card */}
              {loadingReg ? (
                <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
              ) : registration ? (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="text-lg font-black text-slate-900">Your Registration</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${regStatusStyle.bg} ${regStatusStyle.text}`}>
                      {regStatusStyle.label}
                    </span>
                  </div>

                  {/* Team info */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
                    <p className="text-xs uppercase tracking-wide font-bold text-slate-500 mb-2">Team</p>
                    <p className="font-black text-slate-900 text-base">{registration.teamName}</p>
                    <p className="text-xs text-indigo-600 mt-1 font-medium">
                      {isLeader ? '👑 You are the team leader' : 'You are a member'}
                    </p>
                    <div className="mt-3 space-y-1">
                      {(registration.members || []).map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium">{m.name}</span>
                          <span className="text-slate-400">({m.email})</span>
                          {String(m.user?._id || m.user) === String(user?._id || user?.id) && (
                            <span className="text-indigo-600 font-bold">(you)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment required */}
                  {registration.payment?.required && registration.payment?.status !== 'paid' && (
                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Payment Required</p>
                      <p className="text-lg font-black text-amber-900 mt-1">₹{registration.payment.amountInr}</p>
                      <p className="text-xs text-amber-700 mt-1">Complete payment to unlock submission access.</p>
                      {isLeader && (
                        <button
                          onClick={handlePay}
                          disabled={busy}
                          className="mt-3 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold disabled:opacity-60 transition-colors"
                        >
                          <span className="inline-flex items-center gap-2">
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                            Pay ₹{registration.payment.amountInr}
                          </span>
                        </button>
                      )}
                      {!isLeader && (
                        <p className="mt-2 text-xs text-amber-700">Your team leader needs to complete payment.</p>
                      )}
                    </div>
                  )}

                  {/* Previous submissions */}
                  {(registration.submissions || []).length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wide font-bold text-slate-500 mb-2">
                        Submissions ({submissionCount}/{maxSubs})
                      </p>
                      <div className="space-y-2">
                        {registration.submissions.map((sub, idx) => (
                          <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Link2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <a
                                href={sub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 underline truncate flex-1"
                              >
                                {sub.link}
                              </a>
                              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                            </div>
                            {sub.note && <p className="text-xs text-slate-400 mt-1 pl-5">{sub.note}</p>}
                            <p className="text-xs text-slate-300 mt-0.5 pl-5">
                              {new Date(sub.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit form — hidden once limit hit */}
                  {canSubmit && submissionCount < maxSubs && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{linkLabel}</label>
                        <input
                          type="url"
                          value={submissionLink}
                          onChange={(e) => setSubmissionLink(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none"
                          placeholder={linkPlaceholder}
                        />
                        {linkHint && <p className="text-xs text-slate-500 mt-1">{linkHint}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Note (optional)</label>
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                          placeholder="Any notes for the judges…"
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={busy || !submissionLink.trim()}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-60 transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Submit Solution
                          {submissionCount > 0 && ` (${submissionCount + 1}/${maxSubs})`}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Locked — max submissions reached */}
                  {canSubmit && submissionCount >= maxSubs && (
                    <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-center">
                      <Lock className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm font-bold text-slate-700">Submission Locked</p>
                      <p className="text-xs text-slate-500 mt-1">Max {maxSubs} submission{maxSubs !== 1 ? 's' : ''} reached. No further submissions allowed.</p>
                    </div>
                  )}

                  {hack.status === 'ended' && (
                    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-slate-500" />
                      This hackathon has ended. No new submissions accepted.
                    </div>
                  )}
                </div>
              ) : (
                /* Registration form */
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Join this Hackathon</h3>
                  <p className="text-sm text-slate-500 mb-5">
                    You are the team leader. Add teammates by their SkillValix email addresses.
                    Team size: {teamMin}–{teamMax} members (including yourself).
                  </p>

                  {hack.status === 'ended' ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-500 text-sm">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      Registrations are closed for this hackathon.
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="text-center">
                      <p className="text-sm text-slate-500 mb-4">You need to be logged in to register.</p>
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Login to Register
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Team Name *</label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                          placeholder="e.g. Team Phoenix"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-slate-600">Teammates</label>
                          <span className="text-xs text-slate-400">{members.filter(m => m.email.trim()).length + 1}/{teamMax} members</span>
                        </div>
                        <div className="space-y-3">
                          {members.map((member, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500">Teammate {idx + 1}</span>
                                {members.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeMemberRow(idx)}
                                    className="p-1 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateMember(idx, 'name', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                placeholder="Full name"
                              />
                              <input
                                type="email"
                                value={member.email}
                                onChange={(e) => updateMember(idx, 'email', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                placeholder="Email (must be registered SkillValix account)"
                              />
                            </div>
                          ))}
                        </div>
                        {members.length < teamMax - 1 && (
                          <button
                            type="button"
                            onClick={addMemberRow}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Another Teammate
                          </button>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          Leave empty for solo. All teammates must be registered SkillValix users.
                        </p>
                      </div>

                      <button
                        onClick={handleRegisterTeam}
                        disabled={busy || !teamName.trim()}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold disabled:opacity-60 transition-all shadow-lg shadow-indigo-500/25"
                      >
                        <span className="inline-flex items-center gap-2">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                          Register Team
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback messages */}
              {msg.text && (
                <div className={`mt-4 text-xs rounded-lg border px-3 py-2.5 ${
                  msg.tone === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : msg.tone === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {msg.text}
                </div>
              )}

              {/* Safety notice */}
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1 inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> Security Guarantees
                </p>
                <ul className="space-y-0.5 mt-1">
                  <li>• Team members must be registered SkillValix users</li>
                  <li>• Duplicate registration per hackathon is blocked</li>
                  <li>• Payment verified cryptographically before unlock</li>
                  <li>• Submission limit enforced server-side</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
