import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { api, useAuthStore, cachedGet, clearCache } from '../store/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getCourseList } from '../data/courseLoader';
import { generatePDFFromDOM } from '../utils/pdfGenerator';
import CertificateTemplate from '../components/CertificateTemplate';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.skillvalix.com/api';
import {
  Download, CheckCircle, Award, Share2, BookOpen,
  ArrowRight, Loader2, Trophy, GraduationCap, Medal,
  Sparkles, Clock, Star, Linkedin, Github, FileText, Globe,
  User, Settings, Briefcase, X, Save, UserRound, MapPin, ExternalLink,
  Phone, ShieldCheck, Mail, Zap
} from 'lucide-react';

/* ────────────────────────────────────────────
   HELPER COMPONENTS FOR PROFILE
──────────────────────────────────────────── */
const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700 truncate">{value || 'Not specified'}</p>
    </div>
  </div>
);

const SocialIcon = ({ title, value, icon: Icon, color }) => {
  if (!value) return (
    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl opacity-40 grayscale flex flex-col items-center justify-center">
      <Icon className="w-5 h-5 mb-1 text-slate-300" />
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{title}</p>
    </div>
  );
  
  return (
    <a 
      href={value.startsWith('http') ? value : `https://${value}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all flex flex-col items-center justify-center group"
    >
      <Icon className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" style={{ color }} />
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{title}</p>
    </a>
  );
};

const SectionHead = ({ icon: Icon, title, iconCls, count, countCls }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-100 ${iconCls}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
      {count && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mt-0.5 ${countCls}`}>
          {count}
        </span>
      )}
    </div>
  </div>
);

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
const CertCard = ({ cert, onDownload, copyMsg, onCopy, prepState }) => {
  const handleFeedPost = async (e) => {
    e.preventDefault();
    const certUrl = `${window.location.origin}/verify/${cert.certificateId}`;
    const courseTitle = cert.course?.title || 'Certification';
    
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

  const isEvent = cert.isEvent;
  const isJobSim = isEvent && cert.eventType === 'job-simulation';
  
  // Dynamic Styles
  const cardBgCls = isJobSim ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const topGrad = isJobSim ? "from-emerald-400 via-teal-500 to-cyan-500" : "from-amber-400 via-orange-400 to-rose-400";
  const IconBg = isJobSim ? "from-emerald-400 to-teal-500 shadow-teal-500/40" : "from-amber-400 to-orange-500 shadow-amber-300/40";
  const titleCls = isJobSim ? "text-white" : "text-slate-900";
  const dateCls = isJobSim ? "text-teal-400" : "text-amber-400";
  const boxBgCls = isJobSim ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100";
  const boxTextCls = isJobSim ? "text-slate-300" : "text-slate-600";
  const primaryBtn = isJobSim ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white';
  const copyBtnBg = isJobSim ? (copyMsg === cert.certificateId ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400 scale-[0.98]' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300') : (copyMsg === cert.certificateId ? 'bg-emerald-50 border-emerald-300 text-emerald-600 scale-[0.98]' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600');

  return (
    <div className={`group ${cardBgCls} rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className={`h-2 bg-gradient-to-r ${topGrad}`} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg ${IconBg}`}>
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-extrabold ${titleCls} text-sm leading-tight line-clamp-2`}>
              {cert.course?.title || 'Certificate Course'}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <Star className={`w-2.5 h-2.5 ${dateCls} fill-current`} />
              {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ID chip */}
        <div className={`${boxBgCls} rounded-xl px-3 py-2 mb-4`}>
          <p className="text-[10px] text-slate-400 font-medium mb-0.5">Certificate ID</p>
          <p className={`text-xs font-mono font-bold ${boxTextCls} truncate select-all`}>{cert.certificateId}</p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Row 1: Core Actions */}
          <div className="flex gap-2">
    <button
              onClick={() => onDownload(cert)}
              disabled={prepState?.busy}
              className={`flex-1 relative overflow-hidden text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98] ${primaryBtn}`}
            >
              {prepState?.busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {prepState?.busy ? 'Generating...' : 'Download PDF'}
            </button>

            <button
              onClick={() => onCopy(cert)}
              title="Copy verification link"
              className={`flex-shrink-0 px-4 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300 ${copyBtnBg}`}
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

        {prepState?.message && prepState?.busy === false && (
          <p className="mt-3 text-[11px] font-medium leading-relaxed text-red-500">
            {prepState.message}
          </p>
        )}
      </div>
    </div>
  );
};

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
  const [prepStates, setPrepStates] = useState({});
  const [exportCert, setExportCert] = useState(null); // Local PDF export state
  const certTemplateRef = useRef(null); // Reference to the hidden template
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'learning';
  const [activeTab, setActiveTab] = useState(initialTab); // new tab state

  // Sync tab state with URL search param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'learning' || tab === 'certificates' || tab === 'profile')) {
      setActiveTab(tab);
    }
  }, [location.search]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '', github: '', linkedin: '', resume: '', portfolio: '', username: '', openToWork: false,
    college: '', branch: '', year: '', phoneNumber: '', bio: '', showPhoneNumber: false,
    theme: 'light', customSkillsText: '',
    projects: [], customLinks: []
  });

  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || '',
        github: userData.github || '',
        linkedin: userData.linkedin || '',
        resume: userData.resume || '',
        portfolio: userData.portfolio || '',
        username: userData.username || '',
        openToWork: userData.openToWork || false,
        college: userData.college || '',
        branch: userData.branch || '',
        year: userData.year || '',
        phoneNumber: userData.phoneNumber || '',
        bio: userData.bio || '',
        showPhoneNumber: userData.showPhoneNumber || false,
        theme: userData.theme || 'light',
        customSkillsText: (userData.customSkills || []).join(', '),
        projects: userData.projects || [],
        customLinks: userData.customLinks || []
      });
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // Filter out invalid projects or links to prevent backend database validation crashes
      const validLinks = profileData.customLinks.filter(l => l.title.trim() !== '' && l.url.trim() !== '');
      const validProjects = profileData.projects.filter(p => p.title.trim() !== '');

      const payload = { 
        ...profileData,
        customLinks: validLinks,
        projects: validProjects,
        customSkills: profileData.customSkillsText ? profileData.customSkillsText.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      const res = await api.put('/auth/profile', payload);
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
        const [cR, courseList] = await Promise.all([
          cachedGet('certs_mine', '/certificates/mine'),
          getCourseList()
        ]);
        setCerts(cR);
        setCourses(courseList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, authLoading, navigate]);

  // Backend PDF polling is deprecated completely as generation is handled exclusively client-side

  useEffect(() => {
    const hasCountdown = Object.values(prepStates).some(state => state?.seconds > 0);
    if (!hasCountdown) return undefined;

    const timerId = setInterval(() => {
      setPrepStates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key]?.seconds > 0) {
            next[key] = { ...next[key], seconds: next[key].seconds - 1 };
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [prepStates]);

  // Backend PDF state sync is deprecated

  const dl = async (cert) => {
    const certId = cert?.certificateId;
    if (!certId) return;

    // 1. Mark as loading locally
    setPrepStates(prev => ({ ...prev, [certId]: { busy: true, seconds: 0, message: 'Preparing your certificate PDF…' } }));

    // 2. Mount the hidden certificate template into the DOM
    setExportCert(cert);

    // 3. Wait for React to finish rendering the hidden template AND for the Inter
    //    font to be confirmed loaded, then use html-to-image to capture it.
    //    300 ms gives React two full render cycles plus font-load confirmation.
    setTimeout(async () => {
      try {
        const fileName = `${cert.isEvent ? 'JobSimCertificate' : 'Certificate'}-${cert.certificateId}`;

        await generatePDFFromDOM(certTemplateRef, fileName);

        // Clean up: hide the template and clear loading state
        setExportCert(null);
        setPrepStates(prev => { const next = { ...prev }; delete next[certId]; return next; });
      } catch (err) {
        setExportCert(null);
        setPrepStates(prev => ({
          ...prev,
          [certId]: { busy: false, seconds: 0, message: err.message || 'Generation failed. Please try again.' },
        }));
      }
    }, 300);
  };

  const copy = (cert) => {
    const url = `${window.location.origin}/verify/${cert.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopyMsg(cert.certificateId);
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

      {/* Hidden local template for compiling PDFs visually on client thread */}
      {exportCert && (
        <CertificateTemplate 
           ref={certTemplateRef}
           studentName={userData?.name || 'Student'}
           courseTitle={exportCert.course?.title || 'Certification'}
           certificateId={exportCert.certificateId}
           issueDate={new Date(exportCert.issueDate || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric'})}
           verifyUrl={`${window.location.origin}/verify/${exportCert.certificateId}`}
           isEvent={exportCert.isEvent}
        />
      )}

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
                  <a href={`/u/${userData.username || userData._id || userData.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-indigo-50 px-3 py-1.5 rounded-lg border border-white/20 transition-all shadow-sm">
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
        
        {/* Tab Navigation — always fully visible on mobile with equal-width buttons */}
        <div className="grid grid-cols-3 border-b border-slate-200 mb-8">
          <button onClick={() => setActiveTab('learning')} className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors text-center flex flex-col items-center gap-1 ${activeTab === 'learning' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <BookOpen className="w-4 h-4" />
            Learning
          </button>
          <button onClick={() => setActiveTab('certificates')} className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors text-center flex flex-col items-center gap-1 ${activeTab === 'certificates' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Medal className="w-4 h-4" />
            Certificates
          </button>
          <button onClick={() => setActiveTab('profile')} className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors text-center flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <User className="w-4 h-4" />
            Portfolio
          </button>
        </div>

        <div className="space-y-10">
          
          {/* TAB: LEARNING PATH */}
          {activeTab === 'learning' && (
            <div className="space-y-10 animate-fade-in">
              {/* Completed Courses */}
              <section>
              <SectionHead
                icon={CheckCircle} title="Completed Courses"
                iconCls="bg-emerald-100 text-emerald-600"
                count={!loading ? `${completed.length} done` : undefined}
                countCls="bg-emerald-100 text-emerald-700"
              />
              {loading ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4">
                  <Sk cls="h-36" /><Sk cls="h-36" />
                </div>
              ) : completed.length === 0 ? (
                <Empty icon={Sparkles} title="No completed courses yet"
                  sub="Pass a quiz to earn your first certificate!" />
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4">
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
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4">
                  <Sk cls="h-24" /><Sk cls="h-24" /><Sk cls="h-24" />
                </div>
              ) : available.length === 0 ? (
                <Empty icon={Trophy} title="🎉 All courses completed!" sub="You're a SkillValix champion." />
              ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4">
                  {available.map(c => <AvailableCard key={c._id} course={c} />)}
                </div>
              )}
            </section>
            </div>
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              {!loading && userData && (
                <div className="space-y-6">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Public Portfolio</h2>
                      <p className="text-sm font-medium text-slate-500">How your profile appears to recruiters and visitors.</p>
                    </div>
                    {!editingProfile && (
                      <button 
                        onClick={() => {
                          setProfileData({
                            name: userData.name || '',
                            github: userData.github || '',
                            linkedin: userData.linkedin || '',
                            resume: userData.resume || '',
                            portfolio: userData.portfolio || '',
                            username: userData.username || '',
                            openToWork: userData.openToWork || false,
                            college: userData.college || '',
                            branch: userData.branch || '',
                            year: userData.year || '',
                            phoneNumber: userData.phoneNumber || '',
                            bio: userData.bio || '',
                            showPhoneNumber: userData.showPhoneNumber || false,
                            theme: userData.theme || 'light',
                            customSkillsText: (userData.customSkills || []).join(', '),
                            projects: userData.projects || [],
                            customLinks: userData.customLinks || []
                          });
                          setEditingProfile(true);
                        }} 
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editingProfile ? (
                    /* ── EDIT MODE ── */
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 space-y-8">
                      
                      {/* Section: Personal Info */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                          <UserRound className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Personal Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                            <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} placeholder="John Doe" className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Custom Username Slug</label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-400 text-xs font-bold">/u/</span>
                              <input type="text" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} placeholder={userData._id} className="flex-1 min-w-0 text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-none rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">Professional Bio / About Me</label>
                          <textarea 
                            value={profileData.bio} 
                            onChange={e => setProfileData({...profileData, bio: e.target.value})} 
                            placeholder="Tell recruiters about your goals, skills, and background..." 
                            className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none h-32 resize-none transition-all" 
                          />
                        </div>
                        <div className="space-y-1.5 border-t border-slate-100 pt-4 mt-2">
                          <label className="text-xs font-bold text-slate-500 ml-1">Custom Skills (comma separated)</label>
                          <input 
                            type="text" 
                            value={profileData.customSkillsText} 
                            onChange={e => setProfileData({...profileData, customSkillsText: e.target.value})} 
                            placeholder="e.g. React, Node.js, Graphic Design" 
                            className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                          />
                          <p className="text-[10px] text-slate-400 pl-1">These will merge with skills automatically extracted from your finished courses.</p>
                        </div>
                      </section>

                      {/* Section: Academic Info */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Academic Details</h3>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">College / University Name</label>
                          <input type="text" value={profileData.college} onChange={e => setProfileData({...profileData, college: e.target.value})} placeholder="IIT Bombay / Your University" className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Branch / Specialization</label>
                            <input type="text" value={profileData.branch} onChange={e => setProfileData({...profileData, branch: e.target.value})} placeholder="Computer Science / AI" className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Current Year / Status</label>
                            <select value={profileData.year} onChange={e => setProfileData({...profileData, year: e.target.value})} className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                              <option value="">Select Year</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                              <option value="Graduated">Graduated</option>
                              <option value="Post-Graduation">Post-Graduation</option>
                            </select>
                          </div>
                        </div>
                      </section>

                      {/* Section: Social & Contact */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                          <Globe className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Social & Contact Links</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">LinkedIn URL</label>
                            <div className="relative">
                              <Linkedin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A66C2]" />
                              <input type="text" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} placeholder="linkedin.com/in/myname" className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">GitHub URL</label>
                            <div className="relative">
                              <Github className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-800" />
                              <input type="text" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} placeholder="github.com/myname" className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Resume Link (G-Drive/Dropbox)</label>
                            <div className="relative">
                              <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
                              <input type="text" value={profileData.resume} onChange={e => setProfileData({...profileData, resume: e.target.value})} placeholder="https://drive.google.com/..." className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                            <div className="relative">
                              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                              <input type="tel" value={profileData.phoneNumber} onChange={e => setProfileData({...profileData, phoneNumber: e.target.value})} placeholder="+91 12345 67890" className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1">Portfolio / Portfolio URL</label>
                            <div className="relative">
                              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
                              <input type="text" value={profileData.portfolio} onChange={e => setProfileData({...profileData, portfolio: e.target.value})} placeholder="myportfolio.com" className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Section: Custom Links (New Feature) */}
                      <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                          <div className="flex items-center gap-2">
                            <i className="w-4 h-4 text-indigo-600 lucide lucide-link" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Featured Links</h3>
                          </div>
                          <button onClick={() => setProfileData({...profileData, customLinks: [...profileData.customLinks, {title: '', url: ''}]})} className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">+ Add Link</button>
                        </div>
                        {profileData.customLinks.map((link, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                             <input type="text" value={link.title} onChange={e => { const newLinks = [...profileData.customLinks]; newLinks[idx].title = e.target.value; setProfileData({...profileData, customLinks: newLinks}); }} placeholder="Link Title (e.g. My Blog)" className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                             <input type="text" value={link.url} onChange={e => { const newLinks = [...profileData.customLinks]; newLinks[idx].url = e.target.value; setProfileData({...profileData, customLinks: newLinks}); }} placeholder="URL (https://...)" className="flex-[2] text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                             <button onClick={() => { const newLinks = [...profileData.customLinks]; newLinks.splice(idx, 1); setProfileData({...profileData, customLinks: newLinks}); }} className="px-3 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors border border-rose-100">Remove</button>
                          </div>
                        ))}
                      </section>

                      {/* Section: Dynamic Portfolio Projects */}
                      <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                          <div className="flex items-center gap-2">
                             <Briefcase className="w-4 h-4 text-indigo-600" />
                             <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Portfolio Projects</h3>
                          </div>
                          <button onClick={() => setProfileData({...profileData, projects: [...profileData.projects, {title: '', description: '', link: '', github: '', techStack: []}]})} className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">+ Add Project</button>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                          {profileData.projects.map((proj, idx) => (
                            <div key={idx} className="bg-white border-2 border-slate-200 p-5 rounded-[1.5rem] relative shadow-sm">
                              <button onClick={() => { const newProjs = [...profileData.projects]; newProjs.splice(idx, 1); setProfileData({...profileData, projects: newProjs}); }} className="absolute top-4 right-4 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-100">Remove</button>
                              <div className="space-y-3 pt-2">
                                <input type="text" value={proj.title} onChange={e => { const newProjs = [...profileData.projects]; newProjs[idx].title = e.target.value; setProfileData({...profileData, projects: newProjs}); }} placeholder="Project Title" className="w-full text-base font-black px-4 py-2 border-b border-slate-200 outline-none focus:border-indigo-500 placeholder:font-medium" />
                                <textarea value={proj.description} onChange={e => { const newProjs = [...profileData.projects]; newProjs[idx].description = e.target.value; setProfileData({...profileData, projects: newProjs}); }} placeholder="Briefly describe what you built..." className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <input type="text" value={proj.link} onChange={e => { const newProjs = [...profileData.projects]; newProjs[idx].link = e.target.value; setProfileData({...profileData, projects: newProjs}); }} placeholder="Live Link (https://...)" className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                  <input type="text" value={proj.github} onChange={e => { const newProjs = [...profileData.projects]; newProjs[idx].github = e.target.value; setProfileData({...profileData, projects: newProjs}); }} placeholder="GitHub / Source Link" className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <input type="text" value={proj.techStack ? proj.techStack.join(', ') : ''} onChange={e => { const newProjs = [...profileData.projects]; newProjs[idx].techStack = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); setProfileData({...profileData, projects: newProjs}); }} placeholder="Tech Stack (comma separated, e.g. React, Tailwind, Express)" className="w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Section: Privacy Settings */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Public Privacy</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all group">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${profileData.openToWork ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                              <Zap className={`w-5 h-5 ${profileData.openToWork ? 'animate-bounce' : ''}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-900">Open to Work</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Displays hired badge</p>
                            </div>
                            <input type="checkbox" checked={profileData.openToWork} onChange={e => setProfileData({...profileData, openToWork: e.target.checked})} className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all group">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${profileData.showPhoneNumber ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                              <Phone className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-900">Show Contact</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Public phone view</p>
                            </div>
                            <input type="checkbox" checked={profileData.showPhoneNumber} onChange={e => setProfileData({...profileData, showPhoneNumber: e.target.checked})} className="w-5 h-5 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                          </label>
                        </div>
                        <div className="pt-4 border-t border-slate-100 space-y-1.5 mt-4">
                            <label className="text-xs font-bold text-slate-500 ml-1">Portfolio Theme</label>
                            <select 
                                value={profileData.theme} 
                                onChange={e => setProfileData({...profileData, theme: e.target.value})} 
                                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="light">Light Mode (Clean & Minimal)</option>
                                <option value="dark">Dark Mode (Premium & Modern)</option>
                            </select>
                        </div>
                      </section>

                      {/* Form Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => setEditingProfile(false)} 
                          className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                          Discard Changes
                        </button>
                        <button 
                          onClick={handleSaveProfile} 
                          disabled={savingProfile} 
                          className="flex-[2] py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 disabled:opacity-70 flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          {savingProfile ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                          {savingProfile ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <div className="space-y-6">
                      
                      {/* Top Preview Card */}
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center text-white text-3xl font-black rotate-2 group-hover:rotate-0 transition-all">
                            {profileData.name.charAt(0)}
                          </div>
                          <div className="text-center md:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                              <h3 className="text-2xl font-black text-slate-900">{profileData.name}</h3>
                              <CheckCircle className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-wider">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {userData.username ? `/u/${userData.username}` : 'No username set'}
                              </span>
                              {profileData.openToWork && (
                                <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                  <Zap className="w-3.5 h-3.5 animate-bounce fill-current" />
                                  Open to Work
                                </span>
                              )}
                            </div>
                          </div>
                          <Link 
                            to={`/u/${userData.username || userData._id}`} 
                            target="_blank"
                            className="w-full md:w-auto h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-3 text-sm font-bold shadow-lg shadow-slate-100 transition-all"
                          >
                            Visit Portfolio
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>

                        {profileData.bio && (
                          <div className="mt-8 pt-8 border-t border-slate-100">
                            <p className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3">About Me</p>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">{profileData.bio}</p>
                          </div>
                        )}
                      </div>

                      {/* Secondary Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Academic Block */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                           <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                              </div>
                              <h4 className="font-black text-slate-900 tracking-tight">Academic Info</h4>
                           </div>
                           <div className="space-y-4">
                              <InfoItem label="University" value={profileData.college} icon={MapPin} />
                              <InfoItem label="Branch" value={profileData.branch} icon={Settings} />
                              <InfoItem label="Status" value={profileData.year} icon={Clock} />
                           </div>
                        </div>

                        {/* Social Block */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                           <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                <Share2 className="w-5 h-5" />
                              </div>
                              <h4 className="font-black text-slate-900 tracking-tight">Social Presence</h4>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <SocialIcon title="LinkedIn" value={profileData.linkedin} icon={Linkedin} color="#0A66C2" />
                              <SocialIcon title="GitHub" value={profileData.github} icon={Github} color="#181717" />
                              <SocialIcon title="Resume" value={profileData.resume} icon={FileText} color="#EF4444" />
                              <SocialIcon title="My Work" value={profileData.portfolio} icon={Globe} color="#4F46E5" />
                           </div>
                        </div>

                      </div>

                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="animate-fade-in">
              <SectionHead
                icon={Medal} title="My Certificates"
                iconCls="bg-amber-100 text-amber-600"
                count={!loading && certs.length > 0 ? `${certs.length}` : undefined}
                countCls="bg-amber-100 text-amber-700"
              />
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><Sk cls="h-40" /><Sk cls="h-40" /></div>
              ) : certs.length === 0 ? (
                <Empty icon={Award} title="No certificates yet" sub="Pass a quiz to earn one!" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certs.map(cert => (
                    <CertCard
                      key={cert.certificateId}
                      cert={cert}
                      onDownload={dl}
                      copyMsg={copyMsg}
                      onCopy={copy}
                      prepState={prepStates[cert.certificateId]}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
