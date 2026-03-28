import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import {
  ArrowDownToLine,
  ArrowLeft,
  Award,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Laptop,
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
  const [certId, setCertId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState('');
  
  // Interactive Task tracking
  const [taskStatus, setTaskStatus] = useState({});
  const [submissions, setSubmissions] = useState({});

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
          if (existing) {
            setCertId(existing.certificateId);
          }
        })
        .catch(err => console.error(err));
        
      try {
        const saved = localStorage.getItem(`skx_sim_tasks_${user?._id || user?.id}_${sim.id}`);
        if(saved) setTaskStatus(JSON.parse(saved));
      } catch(e) {}
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

  const SimIcon = ICON_MAP[sim.icon] || Laptop;

  const handleTaskSubmit = (taskNum) => {
    if(!submissions[taskNum]?.trim() || !isAuthenticated) return;
    setTaskStatus(p => ({ ...p, [taskNum]: 'reviewing' }));
    
    setTimeout(() => {
      setTaskStatus(p => {
        const next = { ...p, [taskNum]: 'completed' };
        try {
          localStorage.setItem(`skx_sim_tasks_${user?._id || user?.id}_${sim.id}`, JSON.stringify(next));
        } catch(e) {}
        return next;
      });
    }, 2500);
  };

  const allTasksCompleted = sim.tasks.every(t => taskStatus[t.num] === 'completed');

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
            setCertId(res.data.certificateId);
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

  const handleDownload = async () => {
    if (!certId) return;

    setDownloading(true);
    try {
      const res = await apiClient.get(`/events/certificates/download/${certId}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `EventCertificate-${certId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setErr('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{sim.title} - SkillValix Events</title>
        <meta name="description" content={sim.about} />
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
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  <span className="inline-flex items-center gap-2">
                    {downloading ? (
                      <>
                        <Download className="w-4 h-4" aria-hidden="true" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" aria-hidden="true" />
                        Download Certificate
                      </>
                    )}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGetCertificate}
                disabled={paying || !allTasksCompleted}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60 ${
                  allTasksCompleted 
                    ? `bg-gradient-to-r ${sim.color} text-white hover:opacity-90` 
                    : 'bg-white/10 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!allTasksCompleted 
                  ? 'Complete all tasks to unlock' 
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
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Paste project URL (Github, Vercel, Figma...)"
                              value={submissions[task.num] || ''}
                              onChange={e => setSubmissions(p => ({ ...p, [task.num]: e.target.value }))}
                              disabled={!isAuthenticated}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                            />
                            {!isAuthenticated && (
                              <div className="text-[10px] text-red-500 font-bold mt-1">Please log in to submit tasks</div>
                            )}
                          </div>
                          <button
                            disabled={!submissions[task.num]?.trim() || !isAuthenticated}
                            onClick={() => handleTaskSubmit(task.num)}
                            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            Submit Task
                          </button>
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
