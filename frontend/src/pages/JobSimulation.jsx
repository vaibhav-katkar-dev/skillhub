import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore, clearCache } from '../store/authStore';
import axios from 'axios';
import CertificateTemplate from '../components/CertificateTemplate';
import JobSimCertificateTemplate from '../components/JobSimCertificateTemplate';
import { generatePDFFromDOM } from '../utils/pdfGenerator';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Code2,
  ExternalLink,
  FileSearch,
  FlaskConical,
  Laptop,
  Lock,
  Menu,
  MessageSquare,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Zap,
  Home,
  Linkedin,
  Calendar,
  X
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const INR_PER_USD = Number(import.meta.env.VITE_INR_PER_USD || 83);

const formatInr = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const formatUsd = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
}).format(Number(value || 0));

const ICON_MAP = {
  Laptop,
  BarChart3,
  Palette,
  Settings,
};

const prettyDomain = (domain) => {
  if (!domain) return '';
  return domain.replace(/^www\./i, '');
};

const getPlaceholder = (task) => {
  if (!Array.isArray(task?.acceptedDomains) || task.acceptedDomains.length === 0) {
    return `Paste project URL (${task.type} link)...`;
  }
  const sample = task.acceptedDomains.slice(0, 2).map(prettyDomain).join(' or ');
  return `Paste public URL (${sample})`;
};

const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ─── Phase inference ──────────────────────────────────────────────── */
const PHASE_RULES = [
  {
    id: 'onboarding',
    label: 'Onboarding & Brief',
    icon: FileSearch,
    color: 'indigo',
    matchTypes: ['Research', 'API Design', 'Communication'],
    firstOnly: true,
  },
  {
    id: 'core',
    label: 'Core Build',
    icon: Code2,
    color: 'violet',
    matchTypes: ['Coding', 'Data', 'Design', 'Analysis', 'Visualization', 'Security'],
  },
  {
    id: 'review',
    label: 'Review & Polish',
    icon: FlaskConical,
    color: 'amber',
    matchTypes: ['Debugging', 'Testing', 'Analysis'],
  },
  {
    id: 'certification',
    label: 'Certification',
    icon: Award,
    color: 'emerald',
    matchTypes: ['Communication'],
    lastOnly: true,
  },
];

const PHASE_COLORS = {
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'bg-indigo-600 text-white',
    header: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
    ring: 'ring-indigo-400',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: 'bg-violet-600 text-white',
    header: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-400',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-500 text-white',
    header: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    ring: 'ring-amber-400',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'bg-emerald-600 text-white',
    header: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-400',
  },
};

function inferPhases(tasks) {
  if (!tasks || tasks.length === 0) return [];

  const hasPhaseKey = tasks.every((t) => t.phase);
  if (hasPhaseKey) {
    const groups = {};
    tasks.forEach((t) => {
      if (!groups[t.phase]) groups[t.phase] = { label: t.phase, tasks: [] };
      groups[t.phase].tasks.push(t);
    });
    return Object.values(groups).map((g, i) => ({
      ...PHASE_RULES[i % PHASE_RULES.length],
      label: g.label,
      tasks: g.tasks,
    }));
  }

  const phases = [
    { ...PHASE_RULES[0], tasks: [] },
    { ...PHASE_RULES[1], tasks: [] },
    { ...PHASE_RULES[2], tasks: [] },
    { ...PHASE_RULES[3], tasks: [] },
  ];

  const last = tasks[tasks.length - 1];
  tasks.forEach((task, idx) => {
    if (idx === 0) {
      phases[0].tasks.push(task);
    } else if (task === last && ['Communication'].includes(task.type)) {
      phases[3].tasks.push(task);
    } else if (['Debugging', 'Testing'].includes(task.type)) {
      phases[2].tasks.push(task);
    } else {
      phases[1].tasks.push(task);
    }
  });

  return phases.filter((p) => p.tasks.length > 0);
}

const TYPE_ICONS = {
  Coding: Code2,
  Debugging: Zap,
  Testing: FlaskConical,
  Research: FileSearch,
  Communication: MessageSquare,
  Data: BarChart3,
  Analysis: TrendingUp,
  Visualization: BarChart3,
  Design: Palette,
  'API Design': Settings,
  Security: ShieldCheck,
};

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Placed at Infosys',
    text: 'The simulation tasks were surprisingly close to real sprint work. Got my LinkedIn badge and two recruiter messages within a week.',
    stars: 5,
  },
  {
    name: 'Arjun M.',
    role: 'Freelancer → Product Co.',
    text: 'Completing the Backend simulation helped me answer technical interviews confidently. The QR cert verified on the first try.',
    stars: 5,
  },
  {
    name: 'Tanvi R.',
    role: 'CS final year, BITS',
    text: 'Loved the phase structure — it felt like actual sprint planning, not just a checklist. Finished in 6 hours.',
    stars: 5,
  },
];

export default function JobSimulation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [certData, setCertData] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const certTemplateRef = useRef(null);
  const payingRef = useRef(false);
  const [err, setErr] = useState('');

  // Tracking
  const [taskStatus, setTaskStatus] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [taskErrors, setTaskErrors] = useState({});

  // Layout State
  const [activeSection, setActiveSection] = useState('overview'); // overview | task | certificate | faq
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isInternationalUser, setIsInternationalUser] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Price & Coupon State
  const [certCostInr, setCertCostInr] = useState(null);
  const [certCostLoading, setCertCostLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const cachedCountry = localStorage.getItem('user_country');
    if (cachedCountry) {
      setIsInternationalUser(cachedCountry !== 'IN');
      return;
    }
    const timeZone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || '' : '';
    setIsInternationalUser(!/Asia\/Kolkata/i.test(timeZone));

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        if (d.country) {
          localStorage.setItem('user_country', d.country);
          setIsInternationalUser(d.country !== 'IN');
        }
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    fetch('/data/job-simulations.json')
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((item) => item.id === id);
        setSim(found);
        setLoading(false);
        if (found) {
          apiClient.get(`/events/simulations/${found.id}/price`)
            .then(res => {
              setCertCostInr(res.data.certCostInr);
              setCertCostLoading(false);
            })
            .catch(() => setCertCostLoading(false));
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && sim) {
      apiClient.get('/certificates/mine')
        .then((res) => {
          const existing = res.data.find(
            (c) => c.isEvent && c.eventType === 'job-simulation' && c.eventTitle === sim.title
          );
          if (existing) setCertData(existing);
        })
        .catch((err) => console.error(err));

      apiClient.get(`/events/simulations/progress/${sim.id}`)
        .then((res) => {
          const completedMap = {};
          res.data.completedTasks?.forEach((num) => {
            completedMap[num] = 'completed';
          });
          setTaskStatus((p) => ({ ...p, ...completedMap }));
        })
        .catch((err) => console.error('[Progress] Fetch failed:', err));
    }
  }, [isAuthenticated, sim, user]);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Loading Simulation...</p>
      </div>
    );
  }

  if (!sim) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
        <Search className="w-16 h-16" aria-hidden="true" />
        <p className="text-xl font-semibold">Simulation not found.</p>
        <Link to="/events" className="text-indigo-600 underline">
          Back to Events
        </Link>
      </div>
    );
  }

  if (sim.comingSoon) {
    return (
      <>
        <Helmet>
          <title>{sim.title} - Coming Soon | SkillValix Events</title>
          <meta name="description" content={`${sim.title} is coming soon.`} />
        </Helmet>
        <section className="min-h-screen bg-slate-950 px-6 py-20 flex items-center justify-center">
          <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 text-center shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-200 text-xs font-bold uppercase tracking-[0.3em] mb-6">
              <Lock className="w-4 h-4" aria-hidden="true" />
              Coming Soon
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{sim.title}</h1>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              This job simulation is currently locked while we work on a lighter version of the experience.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Events
            </Link>
          </div>
        </section>
      </>
    );
  }

  const handleTaskSubmit = async (taskNum, taskType) => {
    const url = submissions[taskNum]?.trim();
    if (!url || !isAuthenticated) return;

    setTaskStatus((p) => ({ ...p, [taskNum]: 'reviewing' }));
    setTaskErrors((p) => ({ ...p, [taskNum]: '' }));

    try {
      await apiClient.post('/events/simulations/validate-task', {
        url,
        taskType,
        simId: sim.id,
        taskNum,
      });

      setTaskStatus((p) => ({ ...p, [taskNum]: 'completed' }));
    } catch (error) {
      setTaskStatus((p) => ({ ...p, [taskNum]: 'pending' }));
      setTaskErrors((p) => ({
        ...p,
        [taskNum]: error.response?.data?.message || 'Validation failed. Ensure your URL is valid and public.',
      }));
    }
  };

  const totalTasks = sim.tasks.length;
  const completedCount = sim.tasks.filter((t) => taskStatus[t.num] === 'completed').length;
  const minRequired = Math.max(1, Math.ceil(totalTasks * 0.6));
  const canUnlockCertificate = completedCount >= minRequired;
  const progressPct = Math.round((completedCount / totalTasks) * 100);
  const tasksLeft = minRequired - completedCount;


  const displayAmount = (inr) => {
    if (inr == null) return '...';
    if (!isInternationalUser) return formatInr(inr);
    return formatUsd(Number(inr || 0) / INR_PER_USD);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    setCouponResult(null);
    try {
      const res = await apiClient.post('/events/simulations/validate-coupon', {
        code: couponCode,
        simId: sim.id
      });
      setCouponResult(res.data);
    } catch (e) {
      setCouponError(e.response?.data?.message || 'Invalid coupon.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const clearCoupon = () => {
    setCouponCode('');
    setCouponResult(null);
    setCouponError('');
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

  const handleGetCertificate = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (payingRef.current) return;
    payingRef.current = true;
    setErr('');
    setPaying(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      setErr('Payment gateway failed to load. Please try again.');
      payingRef.current = false;
      setPaying(false);
      return;
    }

    try {
      const orderRes = await apiClient.post('/events/certificates/razorpay-order', {
        eventTitle: sim.title,
        eventType: 'job-simulation',
        role: sim.role,
        couponCode: couponResult?.code || '',
      });
      const order = orderRes.data;

      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        setErr('Payment system not configured. Please contact support.');
        payingRef.current = false;
        setPaying(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'SkillValix',
        description: `Certificate: ${sim.title}`,
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            const res = await apiClient.post('/events/certificates/generate', {
              eventType: 'job-simulation',
              eventTitle: sim.title,
              role: sim.role,
              couponCode: couponResult?.code || '',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const newCertId = res.data.certificateId;
            setCertData({ certificateId: newCertId, issueDate: res.data.issueDate || new Date() });
            clearCache('certs_mine');
          } catch (e) {
            setErr(e.response?.data?.message || 'Verification failed. Contact support.');
          } finally {
            payingRef.current = false;
            setPaying(false);
          }
        },
        modal: { ondismiss: () => {
          payingRef.current = false;
          setPaying(false);
        } },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setErr(response.error.description || 'Payment failed.');
        payingRef.current = false;
        setPaying(false);
      });
      razorpay.open();
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not initiate payment.');
      payingRef.current = false;
      setPaying(false);
    }
  };

  const certId = certData?.certificateId;

  const handleClientDownload = () => {
    if (!certId || generatingPdf) return;
    setGeneratingPdf(true);
    setErr('');
    setTimeout(async () => {
      try {
        const success = await generatePDFFromDOM(certTemplateRef, `JobSimCertificate-${certId}`);
        if (!success) throw new Error('PDF generation failed. Please try again.');
      } catch (e) {
        setErr(e.message || 'Download failed. Please try again.');
      } finally {
        setGeneratingPdf(false);
      }
    }, 300);
  };

  const phases = inferPhases(sim.tasks);
  const SimIcon = ICON_MAP[sim.icon] || Laptop;

  const activeTask = sim.tasks[activeTaskIndex];
  const activeTaskPhase = phases.find(p => p.tasks.some(t => t.num === activeTask?.num));
  const activePhaseColors = activeTaskPhase ? PHASE_COLORS[activeTaskPhase.color] : PHASE_COLORS.indigo;

  const navigateTask = (direction) => {
    let newIndex = activeTaskIndex + direction;
    if (newIndex >= 0 && newIndex < totalTasks) {
      setActiveTaskIndex(newIndex);
    }
  };

  const handleNavClick = (section, taskIdx = 0) => {
    if (!isAuthenticated && section === 'task') {
      setShowLoginPrompt(true);
      return;
    }
    setShowLoginPrompt(false);
    setActiveSection(section);
    if (section === 'task') {
      setActiveTaskIndex(taskIdx);
    }
    setMobileMenuOpen(false);
  };

  const renderSidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/events" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Exit
        </Link>
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        <button
          onClick={() => handleNavClick('overview')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeSection === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" /> Overview
        </button>

        <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Simulation Tasks
        </div>
        
        {phases.map((phase, pIdx) => {
          const isPhaseActive = activeSection === 'task' && activeTaskPhase?.id === phase.id;
          return (
            <div key={phase.id} className="mb-2">
              <div className={`px-3 py-1.5 text-xs font-bold flex items-center gap-2 ${isPhaseActive ? 'text-indigo-700' : 'text-slate-500'}`}>
                <phase.icon className="w-3.5 h-3.5" /> Phase {pIdx + 1}
              </div>
              <div className="space-y-0.5 mt-1 relative">
                {phase.tasks.map((task) => {
                  const globalIdx = sim.tasks.findIndex(t => t.num === task.num);
                  const isActive = activeSection === 'task' && activeTaskIndex === globalIdx;
                  const isDone = taskStatus[task.num] === 'completed';
                  
                  return (
                    <button
                      key={task.num}
                      onClick={() => handleNavClick('task', globalIdx)}
                      className={`w-full flex items-start gap-3 pl-7 pr-3 py-2 text-left text-sm rounded-lg transition-colors relative group ${
                        isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isActive && <div className="absolute left-2 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />}
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-emerald-400'}`} />
                        ) : (
                          <div className={`w-3.5 h-3.5 rounded-full border-2 ${isActive ? 'border-indigo-400' : 'border-slate-300'}`} />
                        )}
                      </div>
                      <span className={`line-clamp-2 leading-snug ${isDone && !isActive ? 'text-slate-400' : ''}`}>
                        {task.num}. {task.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Wrap Up
        </div>
        
        <button
          onClick={() => handleNavClick('certificate')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeSection === 'certificate' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" /> Get Certificate
        </button>

        {sim.faq?.length > 0 && (
          <button
            onClick={() => handleNavClick('faq')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeSection === 'faq' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> FAQ
          </button>
        )}
      </div>

      {/* Mini Progress widget in sidebar footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="relative w-10 h-10 shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke={canUnlockCertificate ? '#10b981' : '#6366f1'}
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 18}
              strokeDashoffset={(2 * Math.PI * 18) * (1 - progressPct / 100)}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
            {progressPct}%
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">{completedCount}/{totalTasks} Tasks</div>
          <div className={`text-[10px] font-semibold ${canUnlockCertificate ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {canUnlockCertificate ? 'Certificate ready!' : `${tasksLeft} tasks to unlock`}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Helmet>
        <title>{sim.metaTitle || `${sim.title} - SkillValix Events`}</title>
        <meta name="description" content={sim.metaDescription || sim.about} />
        {sim.keywords && (
          <meta name="keywords" content={Array.isArray(sim.keywords) ? sim.keywords.join(', ') : sim.keywords} />
        )}
        <link rel="canonical" href={`https://www.skillvalix.com/job-simulation/${sim.id}`} />
      </Helmet>

      {/* Hidden Job Simulation certificate canvas */}
      {certId && (
        <JobSimCertificateTemplate
          ref={certTemplateRef}
          studentName={user?.name || 'Student'}
          simTitle={sim.title}
          role={sim.role}
          company={sim.company || 'SkillValix Labs'}
          certificateId={certId}
          issueDate={
            certData?.issueDate
              ? new Date(certData.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
              : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
          }
          verifyUrl={`${window.location.origin}/verify/${certId}`}
        />
      )}

      {/* Mobile Top Nav */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 text-slate-600 bg-slate-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold text-sm text-slate-800 truncate">{sim.title}</div>
        </div>
        <div className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
          {completedCount}/{totalTasks}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[80%] h-full bg-white shadow-xl">
            {renderSidebar()}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 h-screen sticky top-0">
        {renderSidebar()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-10 py-8 pb-24 overflow-x-hidden">
        
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${sim.color} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <SimIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{sim.company}</div>
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mt-1">{sim.title}</h1>
                </div>
              </div>

              <p className="text-slate-600 md:text-lg max-w-3xl leading-relaxed mb-8">{sim.about}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 w-full sm:w-auto pr-4 border-r border-slate-200">
                  <Clock3 className="w-4 h-4 text-slate-400" /> <strong>{sim.duration}</strong>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto pr-4 border-r border-slate-200">
                  <ClipboardList className="w-4 h-4 text-slate-400" /> <strong>{totalTasks} Tasks</strong>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto pr-4 border-r border-slate-200">
                  <BarChart3 className="w-4 h-4 text-slate-400" /> <strong>{sim.level}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-slate-400" /> Role: <strong>{sim.role}</strong>
                </div>
              </div>

              {sim.techStack && sim.techStack.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> Technologies & Tools Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sim.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50/65 text-indigo-700 border border-indigo-100/50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-10 mb-4">Why this matters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <Sparkles className="w-5 h-5 text-indigo-600 mb-3" />
                <div className="text-xs font-bold uppercase text-indigo-500 mb-1">Skills Gained</div>
                <div className="text-sm text-slate-700 font-semibold">{sim.skills.slice(0, 3).join(', ')}{sim.skills.length > 3 && ' & more'}</div>
              </div>
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
                <ClipboardList className="w-5 h-5 text-violet-600 mb-3" />
                <div className="text-xs font-bold uppercase text-violet-500 mb-1">Real Deliverables</div>
                <div className="text-sm text-slate-700 font-semibold">{totalTasks} portfolio-ready work samples</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-3" />
                <div className="text-xs font-bold uppercase text-emerald-500 mb-1">Verified Certificate</div>
                <div className="text-sm text-slate-700 font-semibold">QR-verified PDF certificate</div>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
                <ExternalLink className="w-5 h-5 text-sky-600 mb-3" />
                <div className="text-xs font-bold uppercase text-sky-500 mb-1">LinkedIn Experience</div>
                <div className="text-sm text-slate-700 font-semibold">Add this to your LinkedIn <em>Experience</em> section — not just Certifications</div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginPrompt(true);
                    setTimeout(() => {
                      document.getElementById('sim-login-prompt')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 50);
                  } else {
                    setShowLoginPrompt(false);
                    handleNavClick('task', 0);
                  }
                }}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r ${sim.color} hover:opacity-90 transition-opacity shadow-lg`}
              >
                Start Simulation <ArrowRight className="w-5 h-5" />
              </button>

              {/* Login prompt — shown inline when not authenticated */}
              {showLoginPrompt && (
                <div
                  id="sim-login-prompt"
                  role="alert"
                  aria-live="polite"
                  className="relative mt-6 mx-auto max-w-md rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-lg text-left animate-in fade-in slide-in-from-bottom-3 duration-300"
                >
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 mb-1">
                        Sign in to start your simulation
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        Your progress, task completions, and certificate are saved to your account.
                        It's free to join — create an account in under a minute.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to="/login"
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <UserRound className="w-4 h-4" />
                          Go to Login
                        </Link>
                        <Link
                          to="/register"
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-300 text-indigo-700 font-bold text-sm bg-white hover:bg-indigo-50 transition-colors"
                        >
                          Create free account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SINGLE TASK WIZARD SECTION */}
        {activeSection === 'task' && activeTask && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
            
            {/* Phase header pill */}
            <div className="flex items-center justify-between mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${activePhaseColors.border} ${activePhaseColors.bg}`}>
                {activeTaskPhase && <activeTaskPhase.icon className={`w-4 h-4 ${activePhaseColors.header}`} />}
                <span className={`text-xs font-bold uppercase tracking-wider ${activePhaseColors.header}`}>
                  Phase {phases.findIndex(p => p.id === activeTaskPhase?.id) + 1}: {activeTaskPhase?.label}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-400">
                Task {activeTaskIndex + 1} of {totalTasks}
              </div>
            </div>

            {/* Task Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm mb-6">
              <div className="flex items-start gap-4 md:gap-6 mb-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl text-white bg-gradient-to-br ${sim.color}`}>
                  {activeTask.num}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">{activeTask.title}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 shadow-sm">
                      {React.createElement(TYPE_ICONS[activeTask.type] || ClipboardList, { className: "w-4 h-4 text-slate-500" })}
                      {activeTask.type}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center gap-1.5 shadow-sm">
                      <Clock3 className="w-4 h-4 text-indigo-500" /> Duration: {activeTask.time}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold flex items-center gap-1.5 shadow-sm">
                      <Calendar className="w-4 h-4 text-emerald-500" /> Deadline: Flexible
                    </span>
                  </div>
                  {((activeTask.techStack && activeTask.techStack.length > 0) || (sim.techStack && sim.techStack.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Recommended Stack:</span>
                      {(activeTask.techStack || sim.techStack).map((tech) => (
                        <span key={tech} className="text-[11px] px-2 py-0.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 text-slate-600 rounded-md font-semibold transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-slate-600 mb-10">
                <p className="text-base md:text-lg leading-relaxed">{activeTask.description}</p>
              </div>

              {activeTask.deliverable && (
                <div className="mb-8 p-4 rounded-2xl border border-sky-100 bg-sky-50 flex gap-4 items-start">
                  <div className="p-2 bg-sky-200 text-sky-700 rounded-lg shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Required Deliverable</div>
                    <div className="text-sm text-sky-900 font-medium">{activeTask.deliverable}</div>
                  </div>
                </div>
              )}

              {/* Submission Area */}
              <div className="border-t border-slate-100 pt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Submit your work</h3>
                  {Array.isArray(activeTask.acceptedDomains) && activeTask.acceptedDomains.length > 0 && (
                     <div className="text-[10px] uppercase font-bold text-slate-400">
                       Accepted: {activeTask.acceptedDomains.slice(0,3).map(prettyDomain).join(', ')}{activeTask.acceptedDomains.length > 3 && '...'}
                     </div>
                  )}
                </div>

                {/* Dynamic Submission Guidelines */}
                {(() => {
                  const guide = activeTask.submissionGuide || sim.submissionGuide;
                  if (!guide) return null;
                  return (
                    <div className="mb-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-sm transition-all duration-300">
                      <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="w-full flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                          <Laptop className="w-4 h-4 text-indigo-500" />
                          {guide.title || "How to Submit Your Work"}
                        </span>
                        <span className="text-xs text-indigo-600 hover:text-indigo-700 font-bold underline cursor-pointer select-none">
                          {showGuide ? "Hide instructions" : "Show step-by-step"}
                        </span>
                      </button>

                      {showGuide && (
                        <div className="mt-4 border-t border-slate-200/50 pt-4 space-y-2.5">
                          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
                            {guide.steps?.map((step, sIdx) => (
                              <li key={sIdx} className="leading-relaxed pl-1 font-medium text-slate-700">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {taskStatus[activeTask.num] === 'completed' ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-emerald-800 mb-1">Task Accepted!</h4>
                    <p className="text-emerald-700 text-sm">Great job. You can move on to the next task.</p>
                  </div>
                ) : taskStatus[activeTask.num] === 'reviewing' ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                    <h4 className="font-bold text-indigo-800 mb-1">Evaluating submission...</h4>
                    <p className="text-indigo-600 text-xs">Checking URL accessibility and domain requirements.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="url"
                        placeholder={getPlaceholder(activeTask)}
                        value={submissions[activeTask.num] || ''}
                        onChange={(e) => {
                          setSubmissions((p) => ({ ...p, [activeTask.num]: e.target.value }));
                          setTaskErrors((p) => ({ ...p, [activeTask.num]: '' }));
                        }}
                        disabled={!isAuthenticated}
                        className={`flex-1 bg-slate-50 border ${taskErrors[activeTask.num] ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                      />
                      <button
                        disabled={!submissions[activeTask.num]?.trim() || !isAuthenticated}
                        onClick={() => handleTaskSubmit(activeTask.num, activeTask.type)}
                        className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                    {!isAuthenticated && <p className="text-xs font-bold text-red-500">Please log in to submit tasks.</p>}
                    {taskErrors[activeTask.num] && <p className="text-xs font-bold text-red-500">{taskErrors[activeTask.num]}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Next / Prev Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateTask(-1)}
                disabled={activeTaskIndex === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" /> Previous Task
              </button>
              
              {activeTaskIndex === totalTasks - 1 ? (
                <button
                  onClick={() => handleNavClick('certificate')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  Finish <Award className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigateTask(1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
                >
                  Next Task <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* CERTIFICATE SECTION */}
        {activeSection === 'certificate' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Your Certificate</h2>
              <p className="text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                Unlock a verified <strong>Certificate of Experience</strong> — designed to be added to your
                LinkedIn <span className="text-blue-600 font-bold">Experience section</span>, not just Certifications.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Status</span>
                  {canUnlockCertificate ? (
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Unlocked</span>
                  ) : (
                    <span className="font-bold text-slate-400 flex items-center gap-1.5"><Lock className="w-4 h-4"/> Locked</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Tasks Completed</span>
                  <span className="font-bold text-slate-900">{completedCount} / {totalTasks} (min {minRequired})</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Certificate Fee</span>
                  <div className="flex flex-col items-end">
                    {certCostLoading ? (
                      <span className="w-12 h-4 bg-slate-200 animate-pulse rounded"></span>
                    ) : couponResult ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 line-through text-sm">
                          {displayAmount(certCostInr)}
                        </span>
                        <span className="font-bold text-emerald-600">
                          {displayAmount(couponResult.discountedAmountRupees)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-900">{displayAmount(certCostInr)}</span>
                    )}
                  </div>
                </div>
              </div>

              {!certId && canUnlockCertificate && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Discount Code (Optional)
                  </label>
                  {couponResult ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div>
                        <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> {couponResult.code} Applied
                        </div>
                        <div className="text-xs text-emerald-600 font-medium mt-0.5">
                          {couponResult.discountType === 'percentage' 
                            ? `${couponResult.discountValue}% off` 
                            : `₹${couponResult.discountValue} off`} 
                          · Saved {displayAmount(couponResult.savedAmountRupees)}
                        </div>
                      </div>
                      <button onClick={clearCoupon} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors" title="Remove coupon">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        disabled={validatingCoupon}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || validatingCoupon}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
                      >
                        {validatingCoupon ? 'Wait...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500 font-bold mt-2">{couponError}</p>}
                </div>
              )}

              {err && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100">{err}</div>}

              {certId ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm text-center font-bold flex items-center justify-center gap-2">
                    <BadgeCheck className="w-5 h-5" /> Certificate Ready!
                  </div>
                  <button
                    onClick={handleClientDownload}
                    disabled={generatingPdf}
                    className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {generatingPdf ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating PDF...</>
                    ) : (
                      <><ArrowDownToLine className="w-5 h-5" /> Download Certificate</>
                    )}
                  </button>

                  {/* LinkedIn Experience Guide */}
                  <div className="mt-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center shrink-0">
                        <Linkedin className="w-4 h-4 text-white fill-white" />
                      </div>
                      <span className="font-black text-slate-800 text-sm">Add to LinkedIn Experience Section</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      This certificate is formatted to be added as a work experience entry on LinkedIn, boosting your profile with real hands-on skills.
                    </p>
                    <ol className="space-y-2 text-xs text-slate-700">
                      {[
                        'Go to your LinkedIn profile → click \"Add profile section\" → choose \"Work Experience\".',
                        `Title: ${sim.role}`,
                        `Company: ${sim.company || 'SkillValix Labs'} (search and select SkillValix)`,
                        'Employment type: Apprenticeship / Freelance',
                        'Start date: month you started — End date: month you received this certificate.',
                        'Description: Add a short summary and paste the certificate verify link.',
                        'Media: Upload the downloaded PDF certificate under this experience entry.',
                      ].map((step, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="shrink-0 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold" style={{ fontSize: 9 }}>{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGetCertificate}
                  disabled={paying || !canUnlockCertificate}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-sm ${
                    canUnlockCertificate
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {!canUnlockCertificate
                    ? `Complete ${minRequired} tasks to unlock`
                    : paying ? 'Processing...' : `Get Certificate · ${displayAmount(couponResult ? couponResult.discountedAmountRupees : certCostInr)}`}
                </button>
              )}

              {!isAuthenticated && (
                <p className="text-sm text-center text-slate-500 mt-4">
                  Please <Link to="/login" className="text-indigo-600 font-bold">log in</Link> to unlock your certificate.
                </p>
              )}
            </div>

            {/* Testimonial in certificate page to build trust */}
            <div className="bg-slate-100 rounded-2xl p-6 text-center">
               <div className="flex justify-center gap-1 mb-3">
                 {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
               </div>
               <p className="text-slate-700 font-medium italic mb-4">"{TESTIMONIALS[activeTestimonial].text}"</p>
               <div className="text-sm font-bold text-slate-900">{TESTIMONIALS[activeTestimonial].name}</div>
               <div className="text-xs text-slate-500">{TESTIMONIALS[activeTestimonial].role}</div>
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {activeSection === 'faq' && sim.faq?.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Search className="w-6 h-6 text-indigo-500" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {sim.faq.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                  <div className="font-bold text-slate-900 text-lg mb-2">{item.q}</div>
                  <div className="text-slate-600 leading-relaxed">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
