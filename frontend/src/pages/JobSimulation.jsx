import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import CertificateTemplate from '../components/CertificateTemplate';
import { generatePDFFromDOM } from '../utils/pdfGenerator';
import {
  ArrowDownToLine,
  ArrowLeft,
  Award,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Laptop,
  Lock,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const ICON_MAP = {
  Laptop,
  BarChart3,
  Palette,
  Settings
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
  const [err, setErr] = useState('');
  
  // Interactive Task tracking
  const [taskStatus, setTaskStatus] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [taskErrors, setTaskErrors] = useState({});

  useEffect(() => {
    fetch('/data/job-simulations.json')
      .then(r => r.json())
      .then(data => {
        const found = data.find(item => item.id === id);
        setSim(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && sim) {
      apiClient.get('/certificates/mine')
        .then(res => {
          const existing = res.data.find(c => c.isEvent && c.eventType === 'job-simulation' && c.eventTitle === sim.title);
          if (existing) setCertData(existing);
        })
        .catch(err => console.error(err));
        
      // Fetch DB progress instead of just relying on local storage
      apiClient.get(`/events/simulations/progress/${sim.id}`)
        .then(res => {
          const completedMap = {};
          res.data.completedTasks?.forEach(num => {
            completedMap[num] = 'completed';
          });
          setTaskStatus(p => ({ ...p, ...completedMap }));
        })
        .catch(err => console.error('[Progress] Fetch failed:', err));
    }
  }, [isAuthenticated, sim, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Loading Simulation...</p>
      </div>
    );
  }

  if (!sim) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4">
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

        <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-20 flex items-center justify-center">
          <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 text-center shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-200 text-xs font-bold uppercase tracking-[0.3em] mb-6">
              <Lock className="w-4 h-4" aria-hidden="true" />
              Coming Soon
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{sim.title}</h1>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              This job simulation is visible for preview, but it is currently locked while we work on a lighter version of the experience.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Role</div>
                <div className="font-bold text-white">{sim.role}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Duration</div>
                <div className="font-bold text-white">{sim.duration}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Status</div>
                <div className="font-bold text-amber-200">Locked</div>
              </div>
            </div>
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

  const SimIcon = ICON_MAP[sim.icon] || Laptop;

  const handleTaskSubmit = async (taskNum, taskType) => {
    const url = submissions[taskNum]?.trim();
    if (!url || !isAuthenticated) return;
    
    setTaskStatus(p => ({ ...p, [taskNum]: 'reviewing' }));
    setTaskErrors(p => ({ ...p, [taskNum]: '' }));
    
    try {
      await apiClient.post('/events/simulations/validate-task', { 
        url, 
        taskType,
        simId: sim.id,
        taskNum
      });
      
      setTaskStatus(p => ({ ...p, [taskNum]: 'completed' }));
    } catch (error) {
      setTaskStatus(p => ({ ...p, [taskNum]: 'pending' }));
      setTaskErrors(p => ({ ...p, [taskNum]: error.response?.data?.message || 'Validation failed. Ensure your URL is valid and public.' }));
    }
  };

  const totalTasks = sim.tasks.length;
  const completedCount = sim.tasks.filter(t => taskStatus[t.num] === 'completed').length;
  const minRequired = Math.max(1, Math.ceil(totalTasks * 0.6));
  const canUnlockCertificate = completedCount >= minRequired;

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

    setErr('');
    setPaying(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      setErr('Payment gateway failed to load. Please try again.');
      setPaying(false);
      return;
    }

    try {
      const orderRes = await apiClient.post('/events/certificates/razorpay-order', {
        eventTitle: sim.title,
        eventType: 'job-simulation',
        role: sim.role,
      });
      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
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
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const newCertId = res.data.certificateId;
            setCertData({ certificateId: newCertId, issueDate: res.data.issueDate || new Date() });
          } catch (e) {
            setErr(e.response?.data?.message || 'Verification failed. Contact support.');
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed', response.error);
        setErr(response.error.description || 'Payment failed.');
        setPaying(false);
      });
      razorpay.open();
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not initiate payment. Server might be down.');
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

  return (
    <>
      {/* Hidden certificate canvas for client-side PDF export */}
      {certId && (
        <CertificateTemplate
          ref={certTemplateRef}
          studentName={user?.name || 'Student'}
          courseTitle={sim.title}
          certificateId={certId}
          issueDate={
            certData?.issueDate
              ? new Date(certData.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
              : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
          }
          verifyUrl={`${window.location.origin}/verify/${certId}`}
          isEvent={true}
        />
      )}
      <Helmet>
        <title>{sim.title} - SkillValix Events</title>
        <meta name="description" content={sim.about} />
        <link rel="canonical" href={`https://www.skillvalix.com/job-simulation/${id}`} />
      </Helmet>

      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6 overflow-hidden">
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${sim.color}`} />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <Link to="/events" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Events
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white border border-white/10">
                <SimIcon className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{sim.company}</div>
                <div className="text-xs font-semibold text-indigo-400 mt-0.5">Job Simulation</div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{sim.title}</h1>
            <p className="text-slate-300 mb-6 max-w-lg">{sim.about}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {sim.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="w-4 h-4" aria-hidden="true" />
                <strong>{sim.duration}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4" aria-hidden="true" />
                <strong>{sim.tasks.length} tasks</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                <strong>{sim.level}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="w-4 h-4" aria-hidden="true" />
                Role: <strong>{sim.role}</strong>
              </span>
            </div>

            {Array.isArray(sim.modules) && sim.modules.length > 0 && (
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-2">Simulation Modules</p>
                <ul className="space-y-1.5">
                  {sim.modules.map((module, idx) => (
                    <li key={`${module}-${idx}`} className="text-sm text-slate-200 flex items-start gap-2">
                      <span className="mt-0.5 text-cyan-300 font-bold">{idx + 1}.</span>
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-1 text-white" aria-hidden="true" />
              <div className="text-white font-bold text-lg">Verified Certificate</div>
              <div className="text-slate-400 text-sm">Complete tasks, pay INR 99, and get your certificate.</div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Certificate fee</span>
                <span className="font-bold text-white">INR {sim.certCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Format</span>
                <span>PDF (Downloadable)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Verification</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                  QR Code
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>LinkedIn share</span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                  Supported
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pass requirement</span>
                <span className="font-bold text-white">{minRequired}/{totalTasks} tasks</span>
              </div>
            </div>

            {err && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{err}</div>}

            {certId ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm text-center font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" aria-hidden="true" />
                    Certificate Ready!
                  </span>
                </div>
                <button
                  onClick={handleClientDownload}
                  disabled={generatingPdf}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    generatingPdf
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-wait'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-emerald-500/25'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {generatingPdf ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" aria-hidden="true" />
                        Download Certificate
                      </>
                    )}
                  </span>
                </button>
                {generatingPdf && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-center animate-pulse">
                    <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                      Generating your PDF certificate.<br/>
                      This takes 3–5 seconds...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGetCertificate}
                  disabled={paying || !canUnlockCertificate}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60 ${
                  canUnlockCertificate
                    ? `bg-gradient-to-r ${sim.color} text-white hover:opacity-90` 
                    : 'bg-white/10 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!canUnlockCertificate
                  ? `Complete ${minRequired} tasks to unlock (${completedCount}/${totalTasks})`
                  : paying 
                    ? 'Processing...' 
                    : `Get Certificate for INR ${sim.certCost}`}
              </button>
            )}

            {!isAuthenticated && (
              <p className="text-xs text-center text-slate-400">
                <Link to="/login" className="text-indigo-400 underline">
                  Log in
                </Link>{' '}
                to unlock your certificate
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="inline-flex items-center gap-2 text-2xl font-black text-slate-900 mb-8">
            <ClipboardList className="w-6 h-6 text-slate-700" aria-hidden="true" />
            Simulation Tasks
          </h2>
          <div className="space-y-4">
            {sim.tasks.map((task) => (
              <div key={task.num} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${sim.color} flex items-center justify-center text-white font-black text-base`}>
                    {task.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-slate-900">{task.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{task.type}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock3 className="w-3.5 h-3.5" aria-hidden="true" />
                      Estimated: {task.time}
                    </div>

                    {task.deliverable && (
                      <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-900">
                        <span className="font-bold">Deliverable:</span> {task.deliverable}
                      </div>
                    )}

                    {Array.isArray(task.acceptedDomains) && task.acceptedDomains.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Accepted Platforms</p>
                        <div className="flex flex-wrap gap-1.5">
                          {task.acceptedDomains.map((domain) => (
                            <span
                              key={domain}
                              className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              {prettyDomain(domain)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 pt-5 border-t border-slate-100">
                      {taskStatus[task.num] === 'completed' ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                          Task Accepted! Great work.
                        </div>
                      ) : taskStatus[task.num] === 'reviewing' ? (
                        <div className="flex items-center gap-3 text-indigo-600 font-bold bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          Evaluating submission against AI grading metrics...
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                              <input
                                type="url"
                                placeholder={getPlaceholder(task)}
                                value={submissions[task.num] || ''}
                                onChange={e => {
                                  setSubmissions(p => ({ ...p, [task.num]: e.target.value }));
                                  setTaskErrors(p => ({ ...p, [task.num]: '' }));
                                }}
                                disabled={!isAuthenticated}
                                className={`w-full bg-slate-50 border ${taskErrors[task.num] ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60`}
                              />
                              {!isAuthenticated && (
                                <div className="text-[10px] text-red-500 font-bold mt-1">Please log in to submit tasks</div>
                              )}
                            </div>
                            <button
                              disabled={!submissions[task.num]?.trim() || !isAuthenticated}
                              onClick={() => handleTaskSubmit(task.num, task.type)}
                              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                              Submit Task
                            </button>
                          </div>
                          {taskErrors[task.num] && (
                            <div className="text-xs font-bold text-red-500 px-1 mt-1">
                              {taskErrors[task.num]}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sim.faq?.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="inline-flex items-center gap-2 text-2xl font-black text-slate-900 mb-8">
              <Search className="w-6 h-6 text-slate-700" aria-hidden="true" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {sim.faq.map((item, index) => (
                <div key={index} className="border border-slate-100 rounded-xl p-5 bg-slate-50">
                  <div className="font-bold text-slate-900 mb-1">{item.q}</div>
                  <div className="text-sm text-slate-600">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
