import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api, useAuthStore, cachedGet } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.skillvalix.com/api';
import {
  Download, CheckCircle, Award, Share2, BookOpen,
  ArrowRight, Loader2, Trophy, GraduationCap, Medal,
  Sparkles, Clock, Star, Linkedin, Github, FileText, User, Settings, Briefcase, X, Save
} from 'lucide-react';

/* ────────────────────────────────────────────
   Skeleton
──────────────────────────────────────────── */
const Sk = ({ cls }) => (
  <div className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-xl ${cls}`} />
);

/* ────────────────────────────────────────────
   Progress Ring (SVG)
──────────────────────────────────────────── */
const ProgressRing = ({ pct, size = 56, stroke = 5, color = '#6366f1' }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
};

/* ────────────────────────────────────────────
   Stat Card
──────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, total, gradient, iconBg, loading }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const ringColors = { emerald: '#10b981', amber: '#f59e0b', indigo: '#6366f1' };
  const ring = Object.keys(ringColors).find(k => iconBg.includes(k));
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 ${gradient} shadow-xl text-white`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white" />
        <div className="absolute -left-4 -bottom-10 w-28 h-28 rounded-full bg-white" />
      </div>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">{label}</p>
          {loading
            ? <div className="w-14 h-10 bg-white/20 rounded-xl animate-pulse" />
            : <p className="text-5xl font-black leading-none">{value}</p>
          }
          {!loading && total !== undefined && (
            <p className="text-white/60 text-xs font-semibold mt-2">of {total} total</p>
          )}
        </div>
        <div className="relative">
          {total !== undefined && !loading && (
            <>
              <ProgressRing pct={pct} color="#fff" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
            </>
          )}
          {(total === undefined || loading) && (
            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────
   Course Card (Completed)
──────────────────────────────────────────── */
const CompletedCard = ({ course, cert, onDownload }) => (
  <a
    href={`/courses/${course.slug}`}
    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
  >
    {/* gradient top strip */}
    <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
    <div className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-bold text-slate-800 text-sm leading-snug flex-1">{course.title}</h3>
        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-extrabold rounded-full uppercase tracking-wide">
          <CheckCircle className="w-3 h-3" /> Done
        </span>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs font-bold text-slate-500">
         <div className="flex items-center gap-1.5">
           <Award className="w-4 h-4 text-emerald-500" />
           <span>Certificate Earned</span>
         </div>
         <span className="group-hover:text-emerald-600 transition-colors flex items-center gap-1">Review Curriculum <ArrowRight className="w-3 h-3"/></span>
      </div>
    </div>
  </a>
);

/* ────────────────────────────────────────────
   Course Card (Available)
──────────────────────────────────────────── */
const AvailableCard = ({ course }) => (
  <a
    href={`/courses/${course.slug}`}
    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
  >
    <div className="h-2 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400" />
    <div className="p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-indigo-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm leading-snug pt-1">{course.title}</h3>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-indigo-500 group-hover:text-indigo-600 group-hover:gap-2 transition-all duration-200">
        <Clock className="w-3 h-3" />
        <span>Start learning</span>
        <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </a>
);

/* ────────────────────────────────────────────
   Certificate Card
──────────────────────────────────────────── */
const CertCard = ({ cert, onDownload, copyMsg, onCopy }) => {
  const handleFeedPost = async (e) => {
    e.preventDefault();
    const certUrl = `${window.location.origin}/verify/${cert.certificateId}`;
    const courseTitle = cert.course?.title || 'Web Development';
    
    // Best approach for mobile: Native web share API
    // Opens native iOS/Android share sheet which properly hooks into installed social apps like LinkedIn
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: 'My SkillValix Certificate',
          text: `I just earned my certificate for ${courseTitle} on SkillValix! 🚀 Check it out: `,
          url: certUrl
        });
        return;
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    }
    
    // Fallback for Desktop (or if native share fails): Web LinkedIn share
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
    
    // Use popup for better UX on desktop
    const width = 800;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    window.open(linkedinUrl, 'linkedin-share', `width=${width},height=${height},top=${top},left=${left},noopener,noreferrer`);
  };

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-300/40">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-slate-900 text-sm leading-tight line-clamp-2">
              {cert.course?.title || 'Unknown Course'}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ID chip */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 mb-4">
          <p className="text-[10px] text-slate-400 font-medium mb-0.5">Certificate ID</p>
          <p className="text-xs font-mono font-bold text-slate-600 truncate select-all">{cert.certificateId}</p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Row 1: Core Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(cert.certificateId)}
              className="flex-1 relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98]"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>

            <button
              onClick={() => onCopy(cert.certificateId)}
              title="Copy verification link"
              className={`flex-shrink-0 px-4 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300 ${
                copyMsg === cert.certificateId
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600 scale-[0.98]'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {copyMsg === cert.certificateId ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Copied</>
              ) : (
                <><Share2 className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>
          </div>

          {/* Row 2: LinkedIn Actions */}
          <div className="flex gap-2">
            <a
              href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course?.title || 'Certification')}&organizationName=SkillValix&certId=${cert.certificateId}&certUrl=${encodeURIComponent(`${window.location.origin}/verify/${cert.certificateId}`)}`}
              target="_blank" rel="noopener noreferrer"
              title="Add certification to your LinkedIn Profile"
              className="flex-1 bg-white border border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 text-[#0A66C2] text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98]"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Add to Profile
            </a>

            <button
              onClick={handleFeedPost}
              title="Create a post on your LinkedIn Feed"
              className="flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98]"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Post to Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────
   Section Header
──────────────────────────────────────────── */
const SectionHead = ({ icon: Icon, title, iconCls, count, countCls }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconCls}`}>
      <Icon className="w-5 h-5" />
    </div>
    <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest">{title}</h2>
    {count !== undefined && (
      <span className={`ml-auto text-xs font-extrabold px-3 py-1 rounded-full ${countCls}`}>{count}</span>
    )}
  </div>
);

/* ────────────────────────────────────────────
   Empty State
──────────────────────────────────────────── */
const Empty = ({ icon: Icon, title, sub }) => (
  <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-slate-300" />
    </div>
    <p className="text-slate-600 font-bold text-sm">{title}</p>
    <p className="text-slate-400 text-xs mt-1">{sub}</p>
  </div>
);

/* ────────────────────────────────────────────
   MAIN DASHBOARD
──────────────────────────────────────────── */
const Dashboard = () => {
  const { isAuthenticated, loading: authLoading, user: storeUser } = useAuthStore();
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState([]);
  // userData comes from the auth store — no extra API call needed
  const userData = storeUser;
  const [loading, setLoading] = useState(true);
  const [copyMsg, setCopyMsg] = useState('');

  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    github: '', linkedin: '', resume: '', openToWork: false
  });

  useEffect(() => {
    if (userData) {
      setProfileData({
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        resume: userData.resume || '',
        openToWork: userData.openToWork || false
      });
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', profileData);
      useAuthStore.setState({ user: res.data });
      sessionStorage.setItem('skillvalix_user', JSON.stringify(res.data));
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile details.');
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    // Wait until auth store finishes its initial loadUser
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        // Use cachedGet — won't hit the network again within 5 minutes
        const [cR, response] = await Promise.all([
          cachedGet('certs_mine', '/certificates/mine'),
          fetch('/data/all-courses.json')
        ]);
        if (!response.ok) throw new Error('Failed to load courses');
        const raw = await response.json();
        // all-courses.json is [{course:{...}, lessons:[...]}, ...]
        const coR = raw.map(item => item.course);
        setCerts(cR);
        setCourses(coR);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, authLoading, navigate]);

  const dl = id => window.open(`${API_BASE}/certificates/download/${id}`, '_blank');
  const copy = id => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${id}`);
    setCopyMsg(id);
    setTimeout(() => setCopyMsg(''), 2000);
  };

  const certMap = {};
  certs.forEach(c => {
    const id = (c.course?._id || c.course)?.toString();
    if (id) certMap[id] = c;
  });

  const completed = courses.filter(c => certMap[c._id.toString()]);
  const available = courses.filter(c => !certMap[c._id.toString()]);
  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const firstName = userData?.name?.split(' ')[0] || 'Student';
  const pct = courses.length ? Math.round((completed.length / courses.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .animate-shimmer { animation: shimmer 1.8s infinite linear; }
      `}</style>
      <Helmet><title>My Dashboard | SkillValix</title></Helmet>

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 pt-10 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-5">
            {/* avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-xl font-black shadow-2xl select-none flex-shrink-0">
              {loading ? <Loader2 className="w-6 h-6 animate-spin opacity-60" /> : initials(userData?.name)}
            </div>
            <div>
              <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-1">Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {loading
                  ? <span className="inline-block w-44 h-8 bg-white/15 rounded-lg animate-pulse align-middle" />
                  : <>Welcome, <span className="text-yellow-300">{firstName}</span> 👋</>
                }
              </h1>
              {!loading && userData && (
                <div className="mt-2.5">
                  <a href={`/u/${userData._id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-indigo-50 px-3 py-1.5 rounded-lg border border-white/20 transition-all shadow-sm">
                    <Share2 className="w-3.5 h-3.5" />
                    View Public Portfolio
                  </a>
                </div>
              )}
            </div>

            {/* overall progress ring (desktop) */}
            {!loading && courses.length > 0 && (
              <div className="ml-auto hidden sm:flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3">
                <div className="relative w-14 h-14">
                  <ProgressRing pct={pct} size={56} stroke={5} color="#fbbf24" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-black">{pct}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Overall</p>
                  <p className="text-white font-extrabold text-sm">Progress</p>
                  <p className="text-indigo-200 text-xs">{completed.length}/{courses.length} done</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STAT CARDS (overlapping hero) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 mb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {loading ? (
            <>
              <Sk cls="h-28" /><Sk cls="h-28" /><Sk cls="h-28" />
            </>
          ) : (
            <>
              <StatCard icon={GraduationCap} label="Total Courses"
                value={courses.length}
                gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
                iconBg="bg-blue-400/30" loading={loading} />
              <StatCard icon={CheckCircle} label="Completed"
                value={completed.length} total={courses.length}
                gradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
                iconBg="bg-emerald-400/30" loading={loading} />
              <StatCard icon={Trophy} label="Certificates"
                value={certs.length} total={courses.length}
                gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
                iconBg="bg-amber-400/30" loading={loading} />
            </>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT – 2 cols */}
          <div className="lg:col-span-2 space-y-10">

            {/* Completed Courses */}
            <section>
              <SectionHead
                icon={CheckCircle} title="Completed Courses"
                iconCls="bg-emerald-100 text-emerald-600"
                count={!loading ? `${completed.length} done` : undefined}
                countCls="bg-emerald-100 text-emerald-700"
              />
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Sk cls="h-36" /><Sk cls="h-36" />
                </div>
              ) : completed.length === 0 ? (
                <Empty icon={Sparkles} title="No completed courses yet"
                  sub="Pass a quiz to earn your first certificate!" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completed.map(c => (
                    <CompletedCard key={c._id} course={c} cert={certMap[c._id.toString()]} onDownload={dl} />
                  ))}
                </div>
              )}
            </section>

            {/* Available Courses */}
            <section>
              <SectionHead
                icon={BookOpen} title="Available Courses"
                iconCls="bg-indigo-100 text-indigo-600"
                count={!loading ? `${available.length} courses` : undefined}
                countCls="bg-indigo-100 text-indigo-700"
              />
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Sk cls="h-24" /><Sk cls="h-24" /><Sk cls="h-24" />
                </div>
              ) : available.length === 0 ? (
                <Empty icon={Trophy} title="🎉 All courses completed!" sub="You're a SkillValix champion." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {available.map(c => <AvailableCard key={c._id} course={c} />)}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT – Profile & Certificates */}
          <div>
            {!loading && userData && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <SectionHead
                    icon={User} title="My Profile"
                    iconCls="bg-blue-100 text-blue-600"
                    count={userData.openToWork ? 'Hire Me' : undefined}
                    countCls="bg-emerald-100 text-emerald-700 font-bold uppercase text-[10px]"
                  />
                  {!editingProfile && (
                    <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                      <Settings className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300">
                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><Github className="w-3 h-3"/> GitHub Username / Link</label>
                        <input type="text" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} placeholder="github.com/myname" className="w-full text-sm px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><Linkedin className="w-3 h-3"/> LinkedIn URL</label>
                        <input type="text" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} placeholder="linkedin.com/in/myname" className="w-full text-sm px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><FileText className="w-3 h-3"/> Resume / Portfolio Link</label>
                        <input type="text" value={profileData.resume} onChange={e => setProfileData({...profileData, resume: e.target.value})} placeholder="https://myportfolio.com" className="w-full text-sm px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-slate-50">
                        <input type="checkbox" checked={profileData.openToWork} onChange={e => setProfileData({...profileData, openToWork: e.target.checked})} className="w-5 h-5 rounded text-indigo-600" />
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-500"/> Open to Work/Offers</span>
                      </label>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setEditingProfile(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                        <button onClick={handleSaveProfile} disabled={savingProfile} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70">
                          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileData.github || profileData.linkedin || profileData.resume ? (
                        <div className="flex flex-col gap-3">
                          {profileData.github && (
                            <a href={profileData.github.startsWith('http') ? profileData.github : `https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border">
                              <Github className="w-5 h-5 text-slate-700" />
                              <span className="text-sm font-semibold text-slate-700 truncate">{profileData.github.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                          {profileData.linkedin && (
                            <a href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100">
                              <Linkedin className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-700 truncate">{profileData.linkedin.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                          {profileData.resume && (
                            <a href={profileData.resume.startsWith('http') ? profileData.resume : `https://${profileData.resume}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-100">
                              <FileText className="w-5 h-5 text-indigo-600" />
                              <span className="text-sm font-semibold text-indigo-700 truncate">View Portfolio/Resume</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-slate-500 font-medium mb-3">Make your public portfolio stand out to recruiters.</p>
                          <button onClick={() => setEditingProfile(true)} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
                            Add Social Links
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <SectionHead
              icon={Medal} title="My Certificates"
              iconCls="bg-amber-100 text-amber-600"
              count={!loading && certs.length > 0 ? `${certs.length}` : undefined}
              countCls="bg-amber-100 text-amber-700"
            />
            {loading ? (
              <div className="space-y-4"><Sk cls="h-40" /><Sk cls="h-40" /></div>
            ) : certs.length === 0 ? (
              <Empty icon={Award} title="No certificates yet" sub="Pass a quiz to earn one!" />
            ) : (
              <div className="space-y-4">
                {certs.map(cert => (
                  <CertCard
                    key={cert.certificateId}
                    cert={cert}
                    onDownload={dl}
                    copyMsg={copyMsg}
                    onCopy={copy}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
