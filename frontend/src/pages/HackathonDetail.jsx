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
  FileText,
  Loader2,
  Send,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';

const STATUS_STYLE = {
  upcoming: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Upcoming', icon: Clock3 },
  live: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Live Now', icon: CircleDot },
  ended: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Ended', icon: CheckCircle2 },
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
  const { isAuthenticated } = useAuthStore();

  const [hack, setHack] = useState(null);
  const [loadingHack, setLoadingHack] = useState(true);

  const [registration, setRegistration] = useState(null);
  const [loadingReg, setLoadingReg] = useState(false);

  const [teamName, setTeamName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
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
    if (!isAuthenticated) {
      setRegistration(null);
      return;
    }

    setLoadingReg(true);
    try {
      const r = await api.get(`/events/hackathons/${id}/my-team`);
      setRegistration(r.data);
    } catch {
      setRegistration(null);
    } finally {
      setLoadingReg(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchHack();
  }, [fetchHack]);

  useEffect(() => {
    fetchMyTeam();
  }, [fetchMyTeam]);

  const handleRegisterTeam = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const trimmedTeam = String(teamName || '').trim();
    const emails = String(memberEmails || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

    if (trimmedTeam.length < 3) {
      showMsg('Team name must be at least 3 characters.', 'error');
      return;
    }

    setBusy(true);
    showMsg('Registering your team...', 'info');
    try {
      await api.post(`/events/hackathons/${id}/register`, {
        teamName: trimmedTeam,
        memberEmails: emails,
      });
      await fetchMyTeam();
      showMsg('Team registered successfully.', 'success');
      setTeamName('');
      setMemberEmails('');
    } catch (err) {
      const missing = err.response?.data?.missingEmails;
      if (Array.isArray(missing) && missing.length) {
        showMsg(`These emails are not registered users: ${missing.join(', ')}`, 'error');
      } else {
        showMsg(err.response?.data?.message || 'Failed to register team.', 'error');
      }
    } finally {
      setBusy(false);
    }
  };

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
      const orderRes = await api.post(`/events/hackathons/${id}/razorpay-order`, {
        registrationId: registration._id,
      });
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
            await api.post(`/events/hackathons/${id}/payment/verify`, {
              registrationId: registration._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await fetchMyTeam();
            showMsg('Payment successful. Submission is now unlocked.', 'success');
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

  const handleSubmit = async () => {
    if (!registration) return;
    const link = String(submissionLink || '').trim();
    if (!link) {
      showMsg('Submission link is required.', 'error');
      return;
    }

    setBusy(true);
    showMsg('Submitting your solution...', 'info');
    try {
      await api.post(`/events/hackathons/${id}/submit`, {
        registrationId: registration._id,
        submissionLink: link,
        note: String(note || '').trim(),
      });
      await fetchMyTeam();
      showMsg('Solution submitted successfully.', 'success');
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
        <div className="max-w-6xl mx-auto rounded-2xl border border-slate-200 bg-white h-72 animate-pulse" />
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

  const teamMin = Number(hack?.teamConfig?.minMembers || 1);
  const teamMax = Number(hack?.teamConfig?.maxMembers || 4);
  const paymentRequired = Boolean(hack?.paymentConfig?.enabled && Number(hack?.paymentConfig?.amountInr || 0) > 0);
  const submissionInstructions = hack?.submissionConfig?.instructions || 'Submit your final project link (Drive or PDF as configured by admin).';

  return (
    <>
      <Helmet>
        <title>{hack.title} | Hackathon | SkillValix</title>
        <meta name="description" content={hack.description?.slice(0, 160) || 'Hackathon details and registration'} />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 px-6">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <Link to="/events" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 text-white">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                  <StatusIcon className="w-3.5 h-3.5" /> {statusStyle.label}
                </span>
                {hack.featured ? <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">Featured</span> : null}
              </div>

              <h1 className="text-3xl md:text-4xl font-black leading-tight">{hack.title}</h1>
              {hack.tagline ? <p className="text-indigo-200 mt-2 font-semibold">{hack.tagline}</p> : null}
              <p className="text-slate-200 mt-4 leading-relaxed">{hack.description}</p>

              {hack.tags?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-5">
                  {hack.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm uppercase tracking-widest font-black text-slate-700 mb-4">Event Snapshot</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-slate-500">Team Size</span><span className="font-bold text-slate-900">{teamMin} - {teamMax}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Payment</span><span className="font-bold text-slate-900">{paymentRequired ? `INR ${hack.paymentConfig.amountInr}` : 'Free'}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Submission Limit</span><span className="font-bold text-slate-900">{hack?.submissionConfig?.maxSubmissionsPerTeam || 3}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">Drive Link</span><span className="font-bold text-slate-900">{hack?.submissionConfig?.acceptsDriveLink ? 'Allowed' : 'Not allowed'}</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">PDF Link</span><span className="font-bold text-slate-900">{hack?.submissionConfig?.acceptsPdfLink ? 'Allowed' : 'Not allowed'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-6">
          <div className="space-y-6">
            {(prizes.length > 0 || faqs.length > 0) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> About this Hackathon</h3>

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
                        <div key={`${faq.question}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-bold text-slate-900">{faq.question}</p>
                          <p className="text-sm text-slate-600 mt-2">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" /> Submission Instructions</h3>
              <p className="text-slate-600">{submissionInstructions}</p>
            </div>

            {rules.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3">Rules</h3>
                <ul className="space-y-2 text-slate-700 list-disc pl-5">
                  {rules.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>
            )}

            {judgingCriteria.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3">Judging Criteria</h3>
                <ul className="space-y-2 text-slate-700 list-disc pl-5">
                  {judgingCriteria.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            {timeline.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3">Timeline</h3>
                <div className="space-y-3">
                  {timeline.map((entry, idx) => (
                    <div key={`${entry.label}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-bold text-slate-900">{entry.label || `Milestone ${idx + 1}`}</p>
                      <p className="text-xs text-slate-500 mt-1">{entry.date ? new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date TBA'}</p>
                      {entry.description ? <p className="text-sm text-slate-600 mt-2">{entry.description}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-1">Team Registration</h3>
              <p className="text-sm text-slate-500 mb-4">Only existing SkillValix users can be team members.</p>

              {loadingReg ? (
                <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
              ) : registration ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
                  <p className="text-xs uppercase tracking-wide font-bold text-emerald-700">Registered Team</p>
                  <p className="text-sm font-black text-emerald-900 mt-1">{registration.teamName}</p>
                  <p className="text-xs text-emerald-700 mt-1">Status: {registration.status?.replace('_', ' ')}</p>
                  <p className="text-xs text-emerald-700">Members: {(registration.members || []).map((m) => m.email).join(', ')}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Team Name</label>
                      <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Member Emails (comma separated)</label>
                      <input value={memberEmails} onChange={(e) => setMemberEmails(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="user1@email.com, user2@email.com" />
                    </div>
                  </div>

                  <button onClick={handleRegisterTeam} disabled={busy || hack.status === 'ended'} className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-60">
                    <span className="inline-flex items-center gap-2">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                      Register Team
                    </span>
                  </button>
                </>
              )}

              {registration && registration.payment?.required && registration.payment?.status !== 'paid' && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Payment Required</p>
                  <p className="text-sm font-semibold text-amber-900 mt-1">INR {registration.payment.amountInr}</p>
                  <button onClick={handlePay} disabled={busy} className="mt-3 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold disabled:opacity-60">
                    <span className="inline-flex items-center gap-2">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Pay Registration Fee
                    </span>
                  </button>
                </div>
              )}

              {registration && (!registration.payment?.required || registration.payment?.status === 'paid') && hack.status !== 'ended' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Submission Link</label>
                    <input value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Drive or .pdf link as per event settings" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Note (optional)</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <button onClick={handleSubmit} disabled={busy} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-60">
                    <span className="inline-flex items-center gap-2">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Solution
                    </span>
                  </button>
                </div>
              )}

              {registration && hack.status === 'ended' && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-slate-500" />
                  This hackathon has ended. New submissions are disabled.
                </div>
              )}

              {msg.text ? (
                <div className={`mt-4 text-xs rounded-lg border px-3 py-2 ${
                  msg.tone === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : msg.tone === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {msg.text}
                </div>
              ) : null}

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1 inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Safety Checks</p>
                <p>- Team members must already be registered users</p>
                <p>- Duplicate member/team participation is blocked</p>
                <p>- Payment verification is cryptographically validated</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
