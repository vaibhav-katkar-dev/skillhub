import React, { useState } from 'react';
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

const SIMULATIONS = {
  'frontend-developer': {
    id: 'frontend-developer',
    title: 'Frontend Developer Job Simulation',
    company: 'SkillValix Labs',
    role: 'Frontend Developer Intern',
    duration: '4-6 hours',
    skills: ['React', 'CSS', 'HTML', 'JavaScript'],
    level: 'Beginner',
    certCost: 99,
    color: 'from-blue-600 to-cyan-500',
    icon: Laptop,
    about:
      "Get a taste of what it means to work as a Frontend Developer at a fast-growing tech startup. You'll work through real tasks similar to those given to junior developers on their first week.",
    tasks: [
      {
        num: 1,
        title: 'Build a Responsive Navbar',
        description:
          'Create a fully responsive navigation bar using HTML and CSS. It must work on mobile, tablet, and desktop. Include a hamburger menu for mobile.',
        time: '45 min',
        type: 'Coding',
      },
      {
        num: 2,
        title: 'React Component Architecture',
        description:
          'Build a reusable card component in React. Accept props for title, description, image, and a CTA button. Style it with CSS modules.',
        time: '60 min',
        type: 'Coding',
      },
      {
        num: 3,
        title: 'API Integration',
        description:
          'Fetch data from a public REST API (JSONPlaceholder) and display a paginated list of users. Handle loading, error, and empty states.',
        time: '60 min',
        type: 'Coding',
      },
      {
        num: 4,
        title: 'Bug Hunt & Debugging',
        description:
          'You are given a broken React app with 5 intentional bugs. Find and fix all bugs. Write a short explanation of what each bug was and how you fixed it.',
        time: '45 min',
        type: 'Analysis',
      },
    ],
    faq: [
      { q: 'Is this a live interview?', a: 'No. This is a self-paced simulation. Complete tasks at your own speed within the time estimates.' },
      { q: 'Do I need to submit code?', a: 'Tasks are designed for self-assessment. Follow each task guide, complete it, and then proceed to the next.' },
      { q: 'What do I get for INR 99?', a: 'A verified PDF certificate issued by SkillValix with your name, role, and a QR code to verify authenticity.' },
      { q: 'Is the certificate recognized?', a: 'The certificate is issued by SkillValix, an MSME-registered ed-tech company. You can share it on LinkedIn.' },
    ],
  },
  'data-analyst': {
    id: 'data-analyst',
    title: 'Data Analyst Job Simulation',
    company: 'SkillValix Labs',
    role: 'Data Analyst Intern',
    duration: '4-6 hours',
    skills: ['Python', 'Pandas', 'Excel', 'Data Viz'],
    level: 'Beginner',
    certCost: 99,
    color: 'from-violet-600 to-purple-500',
    icon: BarChart3,
    about:
      'Experience a real data analyst workflow: cleaning messy data, exploring datasets, creating dashboards, and communicating insights.',
    tasks: [
      {
        num: 1,
        title: 'Data Cleaning with Pandas',
        description:
          "You're given a CSV with missing values, duplicates, and inconsistent formatting. Clean the dataset and export a clean version.",
        time: '60 min',
        type: 'Data',
      },
      {
        num: 2,
        title: 'Exploratory Data Analysis (EDA)',
        description: 'Analyze the clean dataset. Find the top 5 insights. Use descriptive statistics and correlation analysis.',
        time: '60 min',
        type: 'Analysis',
      },
      {
        num: 3,
        title: 'Data Visualization',
        description:
          'Create 4 meaningful charts using matplotlib/seaborn or Excel: a bar chart, line trend, scatter plot, and heatmap.',
        time: '45 min',
        type: 'Visualization',
      },
      {
        num: 4,
        title: 'Executive Summary',
        description:
          'Write a one-page executive summary of your analysis. Highlight key findings, anomalies, and business recommendations.',
        time: '30 min',
        type: 'Communication',
      },
    ],
    faq: [
      {
        q: 'What tools do I need?',
        a: 'Python 3 with pandas, matplotlib, and seaborn. Or you can use Excel or Google Sheets for the visualization task.',
      },
      { q: 'Is this a test?', a: "No. This is a guided self-paced experience. There is no automated grader. It's about your learning." },
      { q: 'What do I get for INR 99?', a: 'A verified, downloadable PDF certificate issued by SkillValix with your name and role.' },
    ],
  },
  'ui-ux-designer': {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer Job Simulation',
    company: 'SkillValix Labs',
    role: 'UI/UX Design Intern',
    duration: '3-5 hours',
    skills: ['Figma', 'Design Thinking', 'Wireframing'],
    level: 'Beginner',
    certCost: 99,
    color: 'from-pink-600 to-rose-500',
    icon: Palette,
    about:
      "Step into the shoes of a UX designer at a product startup. You'll go from user research to polished Figma prototypes.",
    tasks: [
      {
        num: 1,
        title: 'User Research & Personas',
        description: 'Define 2 user personas for a food delivery app. Include goals, pain points, and tech comfort level.',
        time: '45 min',
        type: 'Research',
      },
      {
        num: 2,
        title: 'Wireframing',
        description: 'Create low-fidelity wireframes for 4 key screens of the app: Home, Search, Order Detail, and Checkout.',
        time: '60 min',
        type: 'Design',
      },
      {
        num: 3,
        title: 'High-Fidelity Prototype',
        description:
          'Build a clickable high-fidelity prototype in Figma using a consistent design system (colors, typography, components).',
        time: '90 min',
        type: 'Design',
      },
    ],
    faq: [
      { q: 'Do I need Figma experience?', a: 'Basic Figma knowledge is helpful but not required. The task guides walk you through what to deliver.' },
      { q: 'What do I get for INR 99?', a: 'A verified PDF certificate with your name and the role "UI/UX Design Intern".' },
    ],
  },
  'backend-developer': {
    id: 'backend-developer',
    title: 'Backend Developer Job Simulation',
    company: 'SkillValix Labs',
    role: 'Backend Developer Intern',
    duration: '5-7 hours',
    skills: ['Node.js', 'REST APIs', 'MongoDB', 'Auth'],
    level: 'Intermediate',
    certCost: 99,
    color: 'from-emerald-600 to-teal-500',
    icon: Settings,
    about: 'Build real backend systems used in production apps. This simulation covers API design, authentication, database operations, and testing.',
    tasks: [
      {
        num: 1,
        title: 'Design a REST API',
        description:
          'Design and document a REST API for a task-management app. Define all endpoints, request bodies, and response schemas using OpenAPI (Swagger).',
        time: '60 min',
        type: 'Design',
      },
      {
        num: 2,
        title: 'Build & Implement the API',
        description: 'Implement the API in Node.js + Express. Connect it to MongoDB using Mongoose. Implement CRUD for tasks and users.',
        time: '90 min',
        type: 'Coding',
      },
      {
        num: 3,
        title: 'JWT Authentication',
        description: 'Add JWT-based authentication. Implement register, login, and a protected route. Hash passwords with bcrypt.',
        time: '60 min',
        type: 'Security',
      },
      {
        num: 4,
        title: 'Unit Tests',
        description: 'Write unit tests for at least 3 API endpoints using Jest + Supertest. Aim for happy path and at least 1 edge case per endpoint.',
        time: '60 min',
        type: 'Testing',
      },
    ],
    faq: [
      { q: 'What tech stack is required?', a: 'Node.js, Express, MongoDB. The tasks also mention JWT and Jest which are standard in the ecosystem.' },
      { q: 'What do I get for INR 99?', a: 'A verified, downloadable PDF certificate with QR code verification.' },
    ],
  },
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
  const { isAuthenticated } = useAuthStore();
  const sim = SIMULATIONS[id];
  const [paying, setPaying] = useState(false);
  const [certId, setCertId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState('');

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

  const SimIcon = sim.icon;

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
                disabled={paying}
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${sim.color} text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-60`}
              >
                {paying ? 'Processing...' : `Get Certificate for INR ${sim.certCost}`}
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
