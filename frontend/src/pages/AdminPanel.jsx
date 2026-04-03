import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import { getCourseList } from '../data/courseLoader';
import {
  ShieldCheck, BookOpen, FileJson, Upload, CheckCircle,
  AlertCircle, ChevronDown, Loader2, Plus, X,
  ClipboardList, Edit3, RefreshCw, BarChart3, Users,
  Award, Activity, Lock, Database, Eye, Star,
  Trophy, Link2, ExternalLink, Filter, Crown
} from 'lucide-react';

const QUIZ_TEMPLATE = {
  passingScore: 60,
  ribbonTheme: 'blue',
  questions: [
    {
      questionText: 'Your question here?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 0
    }
  ]
};

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuthStore();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [quizJson, setQuizJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [tab, setTab] = useState('analytics');

  // Hackathon manager state
  const [hacks, setHacks] = useState([]);
  const [hacksLoading, setHacksLoading] = useState(false);
  const [hackForm, setHackForm] = useState({
    title: '', slug: '', tagline: '', description: '', theme: '',
    status: 'upcoming', image: '', tags: '', visible: false, featured: false,
    startDate: '', endDate: '',
    teamMin: 1, teamMax: 4,
    paymentEnabled: false, paymentAmountInr: 0, paymentDescription: 'Hackathon registration fee',
    acceptsDriveLink: true, acceptsPdfLink: true, acceptsAnyLink: false, acceptsGitHubLink: true, acceptsNotionLink: true,
    submissionInstructions: '', maxSubmissionsPerTeam: 3,
    linkLabel: 'Submission Link', linkPlaceholder: 'Paste your submission link here...', linkHint: '',
    rules: '', judgingCriteria: '', prizes: '', faqs: '', accentColor: '#4F46E5',
  });
  const [editingHackId, setEditingHackId] = useState('');
  const [hackSaving, setHackSaving] = useState(false);
  const [hackMsg, setHackMsg] = useState('');
  const [registrationsByHack, setRegistrationsByHack] = useState({});
  const [loadingRegistrationsFor, setLoadingRegistrationsFor] = useState('');
  
  // Host requests state
  const [hostRequests, setHostRequests] = useState([]);
  const [hostRequestsLoading, setHostRequestsLoading] = useState(false);
  const [showHackForm, setShowHackForm] = useState(false);
  
  const [warmJob, setWarmJob] = useState(null);
  const [warmJobLoading, setWarmJobLoading] = useState(false);
  const [warmJobError, setWarmJobError] = useState('');
  // Submissions viewer state
  const [submissionsViewHackId, setSubmissionsViewHackId] = useState('');
  const [submissionsData, setSubmissionsData] = useState(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsStatusFilter, setSubmissionsStatusFilter] = useState('');
  // Winner state
  const [winnerModal, setWinnerModal] = useState(null); // { hackId, reg }
  const [winnerRank, setWinnerRank] = useState('');
  const [winnerNote, setWinnerNote] = useState('');
  const [winnerSaving, setWinnerSaving] = useState(false);
  const [winnerConfigHackId, setWinnerConfigHackId] = useState('');
  const [winnerConfigNote, setWinnerConfigNote] = useState('');
  const [winnerConfigSaving, setWinnerConfigSaving] = useState(false);

  useEffect(() => {
    getCourseList().then(setCourses).catch(console.error);
  }, []);

  const loadHacks = async () => {
    setHacksLoading(true);
    try { const r = await api.get('/events/admin/hackathons'); setHacks(r.data); } catch { setHacks([]); }
    finally { setHacksLoading(false); }
  };

  const loadRegistrations = async (hackId) => {
    setLoadingRegistrationsFor(hackId);
    try {
      const r = await api.get(`/events/admin/hackathons/${hackId}/registrations`);
      setRegistrationsByHack((prev) => ({ ...prev, [hackId]: r.data || [] }));
    } catch {
      setRegistrationsByHack((prev) => ({ ...prev, [hackId]: [] }));
    } finally {
      setLoadingRegistrationsFor('');
    }
  };

  const handleExportAllUsers = async () => {
    try {
      const response = await api.get('/admin/users/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'skillvalix-users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to export users.');
    }
  };

  const handleExportHackathonUsers = async (hackId) => {
    try {
      const response = await api.get(`/events/admin/hackathons/${hackId}/registrations/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hackathon-${hackId}-registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to export hackathon registrations.');
    }
  };

  const loadHostRequests = async () => {
    setHostRequestsLoading(true);
    try { const r = await api.get('/host/admin/all'); setHostRequests(r.data); } catch { setHostRequests([]); }
    finally { setHostRequestsLoading(false); }
  };

  const updateHostRequestStatus = async (id, status) => {
    try {
      await api.put(`/host/admin/${id}/status`, { status });
      loadHostRequests();
    } catch (e) { alert('Failed to update status'); }
  };


  const resetHackForm = () => {
    setHackForm({
      title: '', slug: '', tagline: '', description: '', theme: '',
      status: 'upcoming', image: '', tags: '', visible: false, featured: false,
      startDate: '', endDate: '', registrationDeadline: '', submissionDeadline: '',
      problemStatement: '',
      teamMin: 1, teamMax: 4,
      paymentEnabled: false, paymentAmountInr: 0, paymentDescription: 'Hackathon registration fee',
      acceptsDriveLink: true, acceptsPdfLink: true, acceptsAnyLink: false, acceptsGitHubLink: true, acceptsNotionLink: true,
      submissionInstructions: '', maxSubmissionsPerTeam: 3,
      linkLabel: 'Submission Link', linkPlaceholder: 'Paste your submission link here...', linkHint: '',
      rules: '', judgingCriteria: '', prizes: '', faqs: '', accentColor: '#4F46E5',
    });
    setEditingHackId('');
  };

  const loadSubmissionsView = async (hackId, page = 1, statusFilter = '') => {
    setSubmissionsViewHackId(hackId);
    setSubmissionsLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const r = await api.get(`/events/admin/hackathons/${hackId}/submissions?${params}`);
      setSubmissionsData(r.data);
      setSubmissionsPage(page);
    } catch { setSubmissionsData(null); }
    finally { setSubmissionsLoading(false); }
  };

  const handleSetWinner = async (hackId, regId, isWinner) => {
    setWinnerSaving(true);
    try {
      await api.put(`/events/admin/hackathons/${hackId}/registrations/${regId}/winner`, {
        isWinner, winnerRank, winnerNote,
      });
      setWinnerModal(null); setWinnerRank(''); setWinnerNote('');
      loadRegistrations(hackId);
      if (submissionsViewHackId === hackId) loadSubmissionsView(hackId, submissionsPage, submissionsStatusFilter);
    } catch (e) { alert(e.response?.data?.message || 'Failed to set winner.'); }
    finally { setWinnerSaving(false); }
  };

  const handleAnnounceWinners = async (hackId, announced) => {
    setWinnerConfigSaving(true);
    try {
      await api.put(`/events/admin/hackathons/${hackId}/winner-config`, { announced, note: winnerConfigNote });
      loadHacks();
      setWinnerConfigHackId('');
    } catch (e) { alert(e.response?.data?.message || 'Failed.'); }
    finally { setWinnerConfigSaving(false); }
  };

  useEffect(() => { 
    if (tab === 'hackathons') loadHacks(); 
    if (tab === 'host-requests') loadHostRequests();
  }, [tab]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError('');
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (err) {
        setAnalyticsError(err.response?.data?.message || 'Failed to load admin analytics.');
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    let stopped = false;
    let timer = null;

    const loadWarmStatus = async () => {
      try {
        const res = await api.get('/events/admin/certificates/warm-event-pdfs/status');
        if (!stopped) {
          const status = res.data || null;
          setWarmJob(status);
          if (!status?.running && (status?.totalInDb ?? 0) === 0) {
            setWarmJobError('No event/job certificates exist yet. Generate at least one event certificate, then run fix again.');
          } else {
            setWarmJobError('');
          }
          if (status?.running) {
            timer = setTimeout(loadWarmStatus, 4000);
          }
        }
      } catch (err) {
        if (!stopped) {
          setWarmJobError(err.response?.data?.message || 'Failed to load warm job status.');
        }
      }
    };

    loadWarmStatus();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const validateJson = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.questions)) return 'Missing "questions" array';
      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        if (!q.questionText) return `Question ${i + 1}: missing "questionText"`;
        if (!Array.isArray(q.options) || q.options.length < 2) return `Question ${i + 1}: needs at least 2 options`;
        if (typeof q.correctOptionIndex !== 'number') return `Question ${i + 1}: missing "correctOptionIndex"`;
        if (q.correctOptionIndex >= q.options.length) return `Question ${i + 1}: correctOptionIndex out of range`;
      }
      return null;
    } catch (e) {
      return 'Invalid JSON: ' + e.message;
    }
  };

  const handleLoadExisting = async () => {
    if (!selectedCourseId) return;
    setLoadingExisting(true);
    try {
      const res = await api.get(`/quizzes/${selectedCourseId}`);
      const { passingScore, questions, ribbonTheme } = res.data;
      setQuizJson(JSON.stringify({ passingScore, ribbonTheme: ribbonTheme || 'blue', questions }, null, 2));
      setJsonError('');
    } catch (err) {
      setJsonError(err.response?.status === 404 ? 'No quiz found for this course yet.' : 'Failed to load quiz.');
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleJsonChange = (val) => {
    setQuizJson(val);
    setUploadStatus(null);
    if (val.trim()) {
      const err = validateJson(val);
      setJsonError(err || '');
    } else {
      setJsonError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedCourseId) {
      setJsonError('Please select a course first.');
      return;
    }
    const err = validateJson(quizJson);
    if (err) {
      setJsonError(err);
      return;
    }

    setUploadStatus('loading');
    setUploadMessage('');
    try {
      const parsed = JSON.parse(quizJson);
      await api.post(`/quizzes/${selectedCourseId}`, parsed);
      setUploadStatus('success');
      setUploadMessage(`Quiz saved to MongoDB for "${selectedCourseTitle}" successfully.`);
    } catch (err) {
      setUploadStatus('error');
      setUploadMessage(err.response?.data?.message || 'Upload failed. Is the backend running?');
    }
  };

  const handleLoadTemplate = () => {
    setQuizJson(JSON.stringify(QUIZ_TEMPLATE, null, 2));
    setJsonError('');
    setUploadStatus(null);
  };

  const questionCount = (() => {
    try { return JSON.parse(quizJson).questions?.length || 0; } catch { return 0; }
  })();

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const startWarmCertificates = async () => {
    if (warmJobLoading) return;
    setWarmJobLoading(true);
    setWarmJobError('');
    try {
      const res = await api.post('/events/admin/certificates/warm-event-pdfs', { forceAll: true });
      setWarmJob(res.data?.job || null);
    } catch (err) {
      const statusCode = err.response?.status;
      if (statusCode === 409) {
        setWarmJobError('Warm job is already running. Showing live status below.');
      } else {
        setWarmJobError(err.response?.data?.message || 'Failed to start warm job.');
      }
    } finally {
      try {
        const statusRes = await api.get('/events/admin/certificates/warm-event-pdfs/status');
        const status = statusRes.data || null;
        setWarmJob(status);
        if (!status?.running && (status?.totalInDb ?? 0) === 0) {
          setWarmJobError('No event/job certificates exist yet. Generate at least one event certificate, then run fix again.');
        }
      } catch {
        // Keep existing warmJob state when status fetch fails.
      }
      setWarmJobLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <Helmet>
        <title>Admin Panel | SkillValix</title>
      </Helmet>

      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shadow-lg">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
              <p className="text-indigo-200 text-sm mt-0.5">Protected admin workspace for analytics, quiz operations, and course guidance.</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-sm text-indigo-50">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Security notice</p>
                <p className="text-indigo-100/90 mt-1">
                  Admin access is controlled only by the role stored in the database. This website does not include any option to create admins, assign admins, or promote users.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {[
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              { key: 'quiz', label: 'Quiz Manager', icon: ClipboardList },
              { key: 'hackathons', label: 'Hackathons', icon: Award },
              { key: 'host-requests', label: 'Host Requests', icon: Users },
              { key: 'guide', label: 'Course Guide', icon: BookOpen },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tab === key
                    ? 'bg-white text-indigo-700 shadow-lg'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                {React.createElement(Icon, { className: 'w-4 h-4' })}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Certificate Maintenance (Admin Only)
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    One-click fix for stale event/job certificate PDFs.
                  </p>
                </div>

                <div className="min-w-[240px]">
                  <button
                    onClick={startWarmCertificates}
                    disabled={warmJobLoading || warmJob?.running}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold shadow"
                  >
                    {warmJobLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {warmJob?.running ? 'Fix Running...' : 'Fix Certificates Now'}
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">Status</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.running ? 'Running' : 'Idle'}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">Progress</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.processed ?? 0}/{warmJob?.total ?? 0}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-emerald-50 px-2.5 py-2"><span className="text-slate-500">Success</span><div className="font-bold text-emerald-700 mt-0.5">{warmJob?.success ?? 0}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-rose-50 px-2.5 py-2"><span className="text-slate-500">Failed</span><div className="font-bold text-rose-700 mt-0.5">{warmJob?.failed ?? 0}</div></div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">Mode</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.mode || 'stale-only'}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">In DB</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.totalInDb ?? 0}</div></div>
                  </div>
                </div>
              </div>

              {warmJob?.currentCertificateId && (
                <p className="mt-2 text-xs text-slate-600">Current certificate: <span className="font-mono">{warmJob.currentCertificateId}</span></p>
              )}

              {warmJob?.lastError && (
                <p className="mt-2 text-xs text-rose-700">Last error: {warmJob.lastError}</p>
              )}

              {warmJobError && (
                <p className="mt-2 text-xs text-rose-700">{warmJobError}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: analytics?.overview?.totalUsers ?? '-', icon: Users, tone: 'from-indigo-600 to-blue-600' },
                { label: 'Published Courses', value: analytics?.overview?.publishedCourses ?? '-', icon: BookOpen, tone: 'from-emerald-600 to-teal-600' },
                { label: 'Certificates', value: analytics?.overview?.totalCertificates ?? '-', icon: Award, tone: 'from-amber-500 to-orange-500' },
                { label: 'Quiz Coverage', value: analytics?.overview ? `${analytics.overview.quizCoverage}%` : '-', icon: Activity, tone: 'from-violet-600 to-fuchsia-600' },
              ].map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className={`rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] font-bold text-white/70">{label}</p>
                    {React.createElement(Icon, { className: 'w-5 h-5 text-white/90' })}
                  </div>
                  <p className="mt-4 text-4xl font-black leading-none">
                    {analyticsLoading ? <span className="inline-block h-10 w-20 rounded-lg bg-white/20 animate-pulse" /> : value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Admin Dashboard Overview
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Live platform analytics available only to authenticated admins.</p>
                  </div>
                  {analytics?.generatedAt && (
                    <span className="text-xs font-medium text-slate-400">Updated {formatDate(analytics.generatedAt)}</span>
                  )}
                </div>

                {analyticsError && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{analyticsError}</span>
                  </div>
                )}

                {!analyticsLoading && !analyticsError && !analytics && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Analytics data is not available yet. Refresh this page after the backend update is live.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Users</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Students</span><span className="font-bold text-slate-900">{analytics?.overview?.totalStudents ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Admins</span><span className="font-bold text-slate-900">{analytics?.overview?.totalAdmins ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Certified users</span><span className="font-bold text-slate-900">{analytics?.overview?.uniqueCertifiedUsers ?? '-'}</span></div>
                    </div>
                    <button
                      onClick={handleExportAllUsers}
                      className="mt-4 w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                    >
                      Export All Users (CSV)
                    </button>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Assessment</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Total quizzes</span><span className="font-bold text-slate-900">{analytics?.overview?.totalQuizzes ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Attempts used</span><span className="font-bold text-slate-900">{analytics?.engagement?.totalAttemptsUsed ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Attempts unlocked</span><span className="font-bold text-slate-900">{analytics?.engagement?.totalAttemptsUnlocked ?? '-'}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Completion</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Courses with certificates</span><span className="font-bold text-slate-900">{analytics?.overview?.courseCompletionCoverage ?? '-'}%</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Avg certs per certified user</span><span className="font-bold text-slate-900">{analytics?.engagement?.averageCertificatesPerCertifiedUser ?? '-'}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Permissions</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">View analytics</span><span className="font-bold text-emerald-700">{analytics?.permissions?.canViewAnalytics ? 'Allowed' : 'Blocked'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Manage quizzes</span><span className="font-bold text-emerald-700">{analytics?.permissions?.canManageQuizzes ? 'Allowed' : 'Blocked'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Admin assignment</span><span className="font-bold text-slate-900">Database only</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Access Policy
                </h2>
                <div className="mt-5 space-y-3">
                  {[
                    { icon: Database, title: 'Admin role source', desc: 'Admin users are recognized from the database role field only.' },
                    { icon: Lock, title: 'No website promotion', desc: 'There is no in-app button or form to make any user an admin.' },
                    { icon: Eye, title: 'Permission visibility', desc: 'This page explains what admins can access without allowing privilege changes.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          {React.createElement(Icon, { className: 'w-5 h-5' })}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{title}</p>
                          <p className="text-sm text-slate-500 mt-1">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Top Course Analytics</h2>
                <div className="space-y-3">
                  {analyticsLoading && Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                  {!analyticsLoading && !analytics?.courseBreakdown?.length && (
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No course analytics are available yet.
                    </div>
                  )}
                  {!analyticsLoading && analytics?.courseBreakdown?.map((course, idx) => (
                    <div key={course.courseId || course.slug} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">#{idx + 1}</p>
                          <p className="font-semibold text-slate-900 mt-1">{course.title}</p>
                          <p className="text-sm text-slate-500 mt-1">{course.lessonCount} lessons | {course.hasQuiz ? 'Quiz ready' : 'Quiz missing'}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          {course.certificatesEarned} certs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Certificate Queue Health</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Ready PDFs', value: analytics?.certificatePipeline?.ready ?? '-', tone: 'border-emerald-200 bg-emerald-50' },
                      { label: 'Pending', value: analytics?.certificatePipeline?.pending ?? '-', tone: 'border-slate-200 bg-slate-50' },
                      { label: 'Queued', value: analytics?.certificatePipeline?.queued ?? '-', tone: 'border-amber-200 bg-amber-50' },
                      { label: 'Generating', value: analytics?.certificatePipeline?.generating ?? '-', tone: 'border-indigo-200 bg-indigo-50' },
                      { label: 'Failed', value: analytics?.certificatePipeline?.failed ?? '-', tone: 'border-rose-200 bg-rose-50' },
                      { label: 'Queue Depth', value: analytics?.certificatePipeline?.queueDepth ?? '-', tone: 'border-violet-200 bg-violet-50' },
                    ].map(({ label, value, tone }) => (
                      <div key={label} className={`rounded-xl border p-4 ${tone}`}>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                        <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">PDF Cache</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Cached PDFs</span><span className="font-bold text-slate-900">{analytics?.certificatePipeline?.cachedPdfCount ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Coverage</span><span className="font-bold text-slate-900">{analytics?.certificatePipeline?.cachedPdfCoverage ?? '-'}%</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Avg PDF size</span><span className="font-bold text-slate-900">{analytics?.certificatePipeline?.averagePdfKb ? `${analytics.certificatePipeline.averagePdfKb} KB` : '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Total cached size</span><span className="font-bold text-slate-900">{formatSize(analytics?.certificatePipeline?.totalCachedPdfBytes)}</span></div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-indigo-50 border border-indigo-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">One-Click Fix</p>
                    <p className="text-sm text-indigo-900 mt-1">Use the detailed Certificate Maintenance panel at the top of this page for accurate status and actions.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Users</h2>
                  <div className="space-y-3">
                    {analyticsLoading && Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                    {!analyticsLoading && !analytics?.recentUsers?.length && (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        No recent users were returned for analytics yet.
                      </div>
                    )}
                    {!analyticsLoading && analytics?.recentUsers?.map((entry) => (
                      <div key={`${entry.email}-${entry.createdAt}`} className="rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{entry.name}</p>
                          <p className="text-sm text-slate-500 truncate">{entry.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-bold uppercase tracking-wide ${entry.role === 'admin' ? 'text-violet-700' : 'text-slate-500'}`}>{entry.role}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatDate(entry.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Certificates</h2>
                  <div className="space-y-3">
                    {analyticsLoading && Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                    {!analyticsLoading && !analytics?.recentCertificates?.length && (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        No recent certificate records were returned for analytics yet.
                      </div>
                    )}
                    {!analyticsLoading && analytics?.recentCertificates?.map((entry) => (
                      <div key={entry.certificateId} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{entry.courseTitle}</p>
                            <p className="text-sm text-slate-500 truncate">{entry.studentName}{entry.studentEmail ? ` | ${entry.studentEmail}` : ''}</p>
                          </div>
                          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg shrink-0">{entry.certificateId}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{formatDate(entry.issueDate)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Hosting Capacity Report
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Practical estimate for the current Vercel + MongoDB free-tier style deployment based on this codebase and content footprint.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Content Footprint</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Course JSON</span><span className="font-bold text-slate-900">{formatSize(analytics?.contentFootprint?.courseJsonBytes)}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Courses</span><span className="font-bold text-slate-900">{analytics?.contentFootprint?.staticCourses ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Lessons</span><span className="font-bold text-slate-900">{analytics?.contentFootprint?.staticLessons ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Embedded JSON quizzes</span><span className="font-bold text-slate-900">{analytics?.contentFootprint?.staticEmbeddedQuizzes ?? '-'}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Concurrency Estimate</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Browsing visitors</span><span className="font-bold text-slate-900 text-right">{analytics?.capacityEstimate?.frontendOnlyConcurrentVisitors ?? '-'}</span></div>
                      <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Active full-stack users</span><span className="font-bold text-slate-900 text-right">{analytics?.capacityEstimate?.fullStackActiveConcurrentUsers ?? '-'}</span></div>
                      <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Short burst traffic</span><span className="font-bold text-slate-900 text-right">{analytics?.capacityEstimate?.shortBurstConcurrentUsers ?? '-'}</span></div>
                      <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Certificate jobs</span><span className="font-bold text-slate-900 text-right">{analytics?.capacityEstimate?.certificateGenerationConcurrency ?? '-'}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Platform Shape</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-900">Frontend:</span> {analytics?.infrastructure?.frontend?.delivery || '-'}</p>
                      <p><span className="font-semibold text-slate-900">Backend:</span> {analytics?.infrastructure?.backend?.runtime || '-'}</p>
                      <p><span className="font-semibold text-slate-900">Database:</span> {analytics?.infrastructure?.database?.provider || '-'}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Free Tier Estimate</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">MongoDB storage</span><span className="font-bold text-slate-900">{analytics?.freeTierEstimate?.mongodbStorageMb ? `${analytics.freeTierEstimate.mongodbStorageMb} MB` : '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Approx DB ops/sec</span><span className="font-bold text-slate-900">{analytics?.freeTierEstimate?.mongodbApproxOpsPerSecond ?? '-'}</span></div>
                    </div>
                    <p className="text-sm text-slate-500 mt-3">
                      {analytics?.freeTierEstimate?.mongodbLikelyFirstLimit || 'No estimate available.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Primary Bottleneck</p>
                  <p className="mt-2 text-sm text-amber-900 font-medium">
                    {analytics?.capacityEstimate?.practicalBottleneck || 'No bottleneck estimate available yet.'}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Certificate Strategy</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl border border-rose-200 bg-white p-4">
                      <p className="font-semibold text-slate-900">Previous flow</p>
                      <p className="mt-2 text-slate-600">
                        {analytics?.certificateArchitecture?.previousFlow || 'No previous flow summary available.'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-white p-4">
                      <p className="font-semibold text-slate-900">Current flow</p>
                      <p className="mt-2 text-slate-600">
                        {analytics?.certificateArchitecture?.currentFlow || 'No current flow summary available.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {analytics?.certificateArchitecture?.mainWins?.length ? analytics.certificateArchitecture.mainWins.map((item) => (
                      <div key={item} className="rounded-xl border border-indigo-200 bg-white p-4 text-sm text-slate-700">
                        {item}
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-indigo-200 bg-white p-4 text-sm text-slate-500 md:col-span-3">
                        Improvement notes are not available yet.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Scaling Limit</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {analytics?.certificateArchitecture?.scalingLimit || 'No scaling-limit note available.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Upgrade Order</h2>
                  <div className="space-y-3">
                    {analytics?.freeTierEstimate?.recommendationOrder?.length ? analytics.freeTierEstimate.recommendationOrder.map((item, idx) => (
                      <div key={item} className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Step {idx + 1}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-1">{item}</p>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        Upgrade guidance is not available yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Security Review</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Recently Fixed</p>
                      <div className="mt-3 space-y-2">
                        {analytics?.securityReview?.fixedRecently?.length ? analytics.securityReview.fixedRecently.map((item) => (
                          <div key={item} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                            {item}
                          </div>
                        )) : (
                          <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                            No recent fixes recorded.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Watch List</p>
                      <div className="mt-3 space-y-2">
                        {analytics?.securityReview?.watchList?.length ? analytics.securityReview.watchList.map((item) => (
                          <div key={item} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            {item}
                          </div>
                        )) : (
                          <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                            No watch list items available.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Select Course
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <select
                      id="course-select"
                      value={selectedCourseId}
                      onChange={(e) => {
                        const opt = e.target.options[e.target.selectedIndex];
                        setSelectedCourseId(e.target.value);
                        setSelectedCourseTitle(opt.text);
                        setUploadStatus(null);
                        setJsonError('');
                      }}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    >
                      <option value="">Select a course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={handleLoadExisting}
                    disabled={!selectedCourseId || loadingExisting}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition-all active:scale-95"
                  >
                    {loadingExisting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Load Existing Quiz
                  </button>
                </div>

                {selectedCourseId && (
                  <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    Selected: <span className="font-semibold text-slate-700">{selectedCourseTitle}</span>
                    <span className="ml-1 text-slate-400">| Course ID: <code className="font-mono bg-slate-100 px-1 rounded">{selectedCourseId}</code></span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Write / Paste Quiz JSON
                  {questionCount > 0 && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      {questionCount} question{questionCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </h2>
                <button
                  onClick={handleLoadTemplate}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Load Template
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                  <div className="text-slate-500 mb-2 text-xs uppercase tracking-wider font-sans font-bold">Expected JSON Format</div>
                  <pre className="whitespace-pre">{`{
  "passingScore": 60,
  "ribbonTheme": "gold",
  "questions": [
    {
      "questionText": "What does JS stand for?",
      "options": ["Java Standard", "JavaScript", "Just Script", "None"],
      "correctOptionIndex": 1
    }
  ]
}`}</pre>
                </div>

                <div className="relative">
                  <textarea
                    id="quiz-json-editor"
                    rows={18}
                    value={quizJson}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder={'{\n  "passingScore": 60,\n  "questions": [...]\n}'}
                    spellCheck={false}
                    className={`w-full font-mono text-sm bg-slate-50 border rounded-xl px-4 py-4 focus:ring-2 outline-none transition resize-y leading-relaxed ${
                      jsonError
                        ? 'border-red-300 focus:ring-red-300 bg-red-50/30'
                        : quizJson && !jsonError
                        ? 'border-emerald-300 focus:ring-emerald-300'
                        : 'border-slate-200 focus:ring-indigo-400'
                    }`}
                  />
                  {quizJson && !jsonError && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Valid JSON
                    </div>
                  )}
                </div>

                {jsonError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Save to MongoDB
                </h2>
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-5">
                  Clicking <strong>Upload Quiz</strong> will POST your JSON to the backend. If a quiz already exists for this course, it will be <strong>overwritten</strong>.
                </p>

                <button
                  id="upload-quiz-btn"
                  onClick={handleUpload}
                  disabled={!selectedCourseId || !quizJson || !!jsonError || uploadStatus === 'loading'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-95"
                >
                  {uploadStatus === 'loading'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    : <><Upload className="w-4 h-4" /> Upload Quiz to MongoDB</>
                  }
                </button>

                {uploadStatus === 'success' && (
                  <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {uploadMessage}
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Upload failed</p>
                      <p className="opacity-80 mt-0.5">{uploadMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {tab === 'hackathons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Hackathons Dashboard</h2>
              <button
                onClick={() => {
                  if (showHackForm && editingHackId) {
                    resetHackForm();
                  }
                  setShowHackForm(!showHackForm);
                  setHackMsg('');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${showHackForm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
              >
                {showHackForm ? <><X className="w-4 h-4" /> Close Form</> : <><Plus className="w-4 h-4" /> Post a Hackathon</>}
              </button>
            </div>

            {showHackForm && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> {editingHackId ? 'Edit Hackathon' : 'Post a Hackathon'} (Full Dynamic Control)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['title', 'Title *'], ['slug', 'SEO Slug (e.g. ai-hackathon-2026)'], ['tagline', 'Tagline'], ['theme', 'Theme / Track'], ['image', 'Banner Image URL'], ['tags', 'Tags (comma-separated)'], ['accentColor', 'Accent Color (hex)']].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                    <input value={hackForm[key]} onChange={e => setHackForm(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                    <select value={hackForm.status} onChange={e => setHackForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Hackathon Start Date</label>
                      <input type="datetime-local" value={hackForm.startDate} onChange={e => setHackForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Registration Deadline</label>
                      <input type="datetime-local" value={hackForm.registrationDeadline} onChange={e => setHackForm(p => ({ ...p, registrationDeadline: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Submission Deadline</label>
                      <input type="datetime-local" value={hackForm.submissionDeadline} onChange={e => setHackForm(p => ({ ...p, submissionDeadline: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Team Min</label>
                    <input type="number" min="1" value={hackForm.teamMin} onChange={e => setHackForm(p => ({ ...p, teamMin: Number(e.target.value || 1) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Team Max</label>
                    <input type="number" min="1" value={hackForm.teamMax} onChange={e => setHackForm(p => ({ ...p, teamMax: Number(e.target.value || 1) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Description *</label>
                  <textarea value={hackForm.description} onChange={e => setHackForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="md:col-span-2 text-xs font-black uppercase tracking-widest text-slate-500">Toggles</p>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.paymentEnabled} onChange={e => setHackForm(p => ({ ...p, paymentEnabled: e.target.checked }))} className="rounded" />
                    Enable Payment
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.visible} onChange={e => setHackForm(p => ({ ...p, visible: e.target.checked }))} className="rounded" />
                    Visible to public
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.featured} onChange={e => setHackForm(p => ({ ...p, featured: e.target.checked }))} className="rounded" />
                    Featured card
                  </label>
                  <p className="md:col-span-2 text-xs font-black uppercase tracking-widest text-slate-500 mt-2">Accepted Link Types</p>
                   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.acceptsAnyLink} onChange={e => setHackForm(p => ({ ...p, acceptsAnyLink: e.target.checked }))} className="rounded" />
                    Accept Any Valid URL <span className="text-xs text-slate-400">(overrides below)</span>
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsGitHubLink} onChange={e => setHackForm(p => ({ ...p, acceptsGitHubLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    GitHub repo links (github.com)
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsNotionLink} onChange={e => setHackForm(p => ({ ...p, acceptsNotionLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    Notion links (notion.site / notion.so)
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsDriveLink} onChange={e => setHackForm(p => ({ ...p, acceptsDriveLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    Google Drive links
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsPdfLink} onChange={e => setHackForm(p => ({ ...p, acceptsPdfLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    Direct PDF links
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Amount (INR)</label>
                  <input type="number" min="0" value={hackForm.paymentAmountInr} onChange={e => setHackForm(p => ({ ...p, paymentAmountInr: Number(e.target.value || 0) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Max Submissions / Team</label>
                  <input type="number" min="1" value={hackForm.maxSubmissionsPerTeam} onChange={e => setHackForm(p => ({ ...p, maxSubmissionsPerTeam: Number(e.target.value || 1) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Description</label>
                  <input value={hackForm.paymentDescription} onChange={e => setHackForm(p => ({ ...p, paymentDescription: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>

                {/* ── Submission link customisation ── */}
                <div className="sm:col-span-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">Submission Link Field Labels</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Field Label (shown to user)</label>
                      <input value={hackForm.linkLabel} onChange={e => setHackForm(p => ({ ...p, linkLabel: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm" placeholder="Submission Link" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Placeholder Text</label>
                      <input value={hackForm.linkPlaceholder} onChange={e => setHackForm(p => ({ ...p, linkPlaceholder: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm" placeholder="Paste your link here..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Hint Text (below field)</label>
                      <input value={hackForm.linkHint} onChange={e => setHackForm(p => ({ ...p, linkHint: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm" placeholder="e.g. Share your GitHub repo or project demo link" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Submission Instructions</label>
                  <textarea value={hackForm.submissionInstructions} onChange={e => setHackForm(p => ({ ...p, submissionInstructions: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Problem Statement</label>
                  <textarea value={hackForm.problemStatement} onChange={e => setHackForm(p => ({ ...p, problemStatement: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Rules (one per line)</label>
                  <textarea value={hackForm.rules} onChange={e => setHackForm(p => ({ ...p, rules: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Judging Criteria (one per line)</label>
                  <textarea value={hackForm.judgingCriteria} onChange={e => setHackForm(p => ({ ...p, judgingCriteria: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Prizes (one per line in format: Rank | Amount)</label>
                  <textarea value={hackForm.prizes} onChange={e => setHackForm(p => ({ ...p, prizes: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="1st | INR 50,000\n2nd | INR 25,000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">FAQs (one per line in format: Question | Answer)</label>
                  <textarea value={hackForm.faqs} onChange={e => setHackForm(p => ({ ...p, faqs: e.target.value }))} rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="Who can join? | Any registered student\nCan solo join? | Yes, if team min is 1" />
                </div>
              </div>

              {hackMsg && <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${hackMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{hackMsg}</div>}

              <button
                onClick={async () => {
                  if (!hackForm.title || !hackForm.description) {
                    setHackMsg('❌ Title and description are required.');
                    return;
                  }
                  if (hackForm.teamMin > hackForm.teamMax) {
                    setHackMsg('❌ Team min cannot be greater than team max.');
                    return;
                  }

                  setHackSaving(true);
                  setHackMsg('');
                  try {
                    const prizes = (hackForm.prizes || '')
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [rank, amount] = line.split('|').map((part) => (part || '').trim());
                        return { rank: rank || 'Prize', amount: amount || '' };
                      })
                      .filter((item) => item.amount);

                    const faqs = (hackForm.faqs || '')
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [question, answer] = line.split('|').map((part) => (part || '').trim());
                        return { question, answer };
                      })
                      .filter((item) => item.question && item.answer);

                    const payloadTitle = hackForm.title || '';
                    const payloadSlug = hackForm.slug || '';
                    
                    const generatedSlug = payloadSlug 
                      ? payloadSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                      : payloadTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                    const payload = {
                      title: payloadTitle,
                      slug: generatedSlug,
                      tagline: hackForm.tagline,
                      description: hackForm.description,
                      theme: hackForm.theme,
                      startDate: hackForm.startDate || null,
                      registrationDeadline: hackForm.registrationDeadline || null,
                      submissionDeadline: hackForm.submissionDeadline || null,
                      status: hackForm.status || 'upcoming',
                      endDate: hackForm.endDate || null,
                      image: hackForm.image,
                      tags: (hackForm.tags || '').split(',').map(t => t.trim()).filter(Boolean),
                      visible: Boolean(hackForm.visible),
                      featured: Boolean(hackForm.featured),
                      prizes,
                      teamConfig: {
                        minMembers: Number(hackForm.teamMin),
                        maxMembers: Number(hackForm.teamMax),
                        requireExistingUsers: true,
                      },
                      paymentConfig: {
                        enabled: Boolean(hackForm.paymentEnabled),
                        amountInr: Number(hackForm.paymentAmountInr || 0),
                        description: hackForm.paymentDescription,
                      },
                      submissionConfig: {
                        acceptsAnyLink:    Boolean(hackForm.acceptsAnyLink),
                        acceptsDriveLink:  Boolean(hackForm.acceptsDriveLink),
                        acceptsPdfLink:    Boolean(hackForm.acceptsPdfLink),
                        acceptsGitHubLink: Boolean(hackForm.acceptsGitHubLink),
                        acceptsNotionLink: Boolean(hackForm.acceptsNotionLink),
                        instructions:      hackForm.submissionInstructions,
                        maxSubmissionsPerTeam: Number(hackForm.maxSubmissionsPerTeam || 3),
                        linkLabel:         hackForm.linkLabel || 'Submission Link',
                        linkPlaceholder:   hackForm.linkPlaceholder || 'Paste your submission link here...',
                        linkHint:          hackForm.linkHint || '',
                      },
                      contentConfig: {
                        problemStatement: hackForm.problemStatement,
                        rules: (hackForm.rules || '').split('\n').map(x => x.trim()).filter(Boolean),
                        judgingCriteria: (hackForm.judgingCriteria || '').split('\n').map(x => x.trim()).filter(Boolean),
                        faqs,
                      },
                      styleConfig: {
                        accentColor: hackForm.accentColor || '#4F46E5',
                        cardStyle: 'modern',
                        bannerStyle: 'gradient',
                      },
                    };

                    if (editingHackId) {
                      await api.put(`/events/hackathons/${editingHackId}`, payload);
                      setHackMsg('✅ Hackathon updated successfully!');
                    } else {
                      await api.post('/events/hackathons', payload);
                      setHackMsg('✅ Hackathon posted successfully!');
                    }
                    resetHackForm();
                    loadHacks();
                    setShowHackForm(false);
                  } catch (e) {
                    console.error("Post Hackathon Error:", e);
                    setHackMsg('❌ ' + (e.response?.data?.message || e.message || 'Failed to save.'));
                  } finally {
                    setHackSaving(false);
                  }
                }}
                disabled={hackSaving}
                className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
              >
                {hackSaving ? 'Saving…' : editingHackId ? '💾 Update Hackathon' : '🚀 Post Hackathon'}
              </button>
              {editingHackId && (
                <button
                  onClick={() => { resetHackForm(); setHackMsg(''); setShowHackForm(false); }}
                  className="mt-3 ml-3 px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5">All Hackathons + Team Registrations</h2>
              {hacksLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}</div>
              ) : hacks.length === 0 ? (
                <p className="text-slate-400 text-sm">No hackathons created yet.</p>
              ) : (
                <div className="space-y-4">
                  {hacks.map(h => (
                    <div key={h._id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900">{h.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${h.status === 'live' ? 'bg-emerald-100 text-emerald-700' : h.status === 'ended' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}`}>{h.status}</span>
                            {h.visible ? <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Visible</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">Hidden</span>}
                            {h.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>}
                          </div>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{h.description}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            Team: {h.teamConfig?.minMembers || 1}-{h.teamConfig?.maxMembers || 4} | Payment: {h.paymentConfig?.enabled ? `INR ${h.paymentConfig?.amountInr || 0}` : 'Free'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingHackId(h._id);
                              setHackForm({
                                title: h.title || '',
                                slug: h.slug || '',
                                tagline: h.tagline || '',
                                description: h.description || '',
                                theme: h.theme || '',
                                status: h.status || 'upcoming',
                                startDate: h.startDate ? new Date(h.startDate).toISOString().slice(0, 16) : '',
                                registrationDeadline: h.registrationDeadline ? new Date(h.registrationDeadline).toISOString().slice(0, 16) : '',
                                submissionDeadline: h.submissionDeadline ? new Date(h.submissionDeadline).toISOString().slice(0, 16) : '',
                                endDate: h.endDate ? new Date(h.endDate).toISOString().slice(0, 16) : '',
                                image: h.image || '',
                                tags: (h.tags || []).join(', '),
                                visible: Boolean(h.visible),
                                featured: Boolean(h.featured),
                                teamMin: Number(h.teamConfig?.minMembers || 1),
                                teamMax: Number(h.teamConfig?.maxMembers || 4),
                                paymentEnabled: Boolean(h.paymentConfig?.enabled),
                                paymentAmountInr: Number(h.paymentConfig?.amountInr || 0),
                                paymentDescription: h.paymentConfig?.description || 'Hackathon registration fee',
                                acceptsAnyLink:    Boolean(h.submissionConfig?.acceptsAnyLink),
                                acceptsDriveLink:  Boolean(h.submissionConfig?.acceptsDriveLink ?? true),
                                acceptsPdfLink:    Boolean(h.submissionConfig?.acceptsPdfLink ?? true),
                                acceptsGitHubLink: Boolean(h.submissionConfig?.acceptsGitHubLink ?? true),
                                acceptsNotionLink: Boolean(h.submissionConfig?.acceptsNotionLink ?? true),
                                submissionInstructions: h.submissionConfig?.instructions || '',
                                maxSubmissionsPerTeam: Number(h.submissionConfig?.maxSubmissionsPerTeam || 3),
                                linkLabel:         h.submissionConfig?.linkLabel || 'Submission Link',
                                linkPlaceholder:   h.submissionConfig?.linkPlaceholder || 'Paste your submission link here...',
                                linkHint:          h.submissionConfig?.linkHint || '',
                                problemStatement: h.contentConfig?.problemStatement || '',
                                rules: (h.contentConfig?.rules || []).join('\n'),
                                judgingCriteria: (h.contentConfig?.judgingCriteria || []).join('\n'),
                                prizes: (h.prizes || []).map((p) => `${p.rank || 'Prize'} | ${p.amount || ''}`).join('\n'),
                                faqs: (h.contentConfig?.faqs || []).map((f) => `${f.question || ''} | ${f.answer || ''}`).join('\n'),
                                accentColor: h.styleConfig?.accentColor || '#4F46E5',
                              });
                              setHackMsg('📝 Edit mode enabled. Update fields and click "Update Hackathon".');
                              setShowHackForm(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                          >
                            Edit
                          </button>
                          <button onClick={async () => { await api.put(`/events/hackathons/${h._id}`, { visible: !h.visible }); loadHacks(); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${h.visible ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                            {h.visible ? 'Hide' : 'Show'}
                          </button>
                          <button onClick={() => loadRegistrations(h._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
                            Teams
                          </button>
                          <button onClick={() => handleExportHackathonUsers(h._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
                            Export
                          </button>
                          <button onClick={async () => { if (!confirm('Delete this hackathon?')) return; await api.delete(`/events/hackathons/${h._id}`); loadHacks(); }} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition">
                            Delete
                          </button>
                        </div>
                      </div>

                      {loadingRegistrationsFor === h._id && <div className="mt-3 text-xs text-slate-500">Loading team registrations...</div>}

                      {Array.isArray(registrationsByHack[h._id]) && registrationsByHack[h._id].length > 0 && (
                        <div className="mt-4">
                          <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Team</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Leader</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Members</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Submissions</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Payment</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Score /100</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {registrationsByHack[h._id].map(reg => (
                                  <tr key={reg._id} className="hover:bg-slate-50 transition-colors align-top">
                                    {/* Team Name */}
                                    <td className="px-3 py-2.5">
                                      <p className="font-bold text-slate-900">{reg.teamName}</p>
                                      {reg.isWinner && <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">🏆 {reg.winnerRank || 'Winner'}</span>}
                                    </td>
                                    {/* Leader */}
                                    <td className="px-3 py-2.5">
                                      <p className="font-semibold text-slate-800">{reg.leader?.name || '—'}</p>
                                      <p className="text-slate-400">{reg.leader?.email || ''}</p>
                                    </td>
                                    {/* Members */}
                                    <td className="px-3 py-2.5">
                                      <div className="space-y-1">
                                        {(reg.members || []).map((m, mi) => (
                                          <div key={mi}>
                                            <span className="font-medium text-slate-800">{m.name || m.user?.name || '—'}</span>
                                            <span className="text-slate-400 ml-1">({m.email})</span>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                    {/* Submissions */}
                                    <td className="px-3 py-2.5">
                                      {(reg.submissions || []).length === 0 ? (
                                        <span className="text-slate-400 italic">None</span>
                                      ) : (
                                        <div className="space-y-1">
                                          {reg.submissions.map((sub, si) => (
                                            <div key={si} className="flex items-center gap-1">
                                              <span className="text-slate-400">{si + 1}.</span>
                                              <a href={sub.link} target="_blank" rel="noopener noreferrer"
                                                className="text-indigo-600 underline hover:text-indigo-800 max-w-[160px] truncate block"
                                                title={sub.link}>
                                                {sub.link}
                                              </a>
                                              <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </td>
                                    {/* Payment */}
                                    <td className="px-3 py-2.5">
                                      <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                        reg.payment?.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                        reg.payment?.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        'bg-slate-100 text-slate-500'
                                      }`}>
                                        {reg.payment?.status || 'not_required'}
                                      </span>
                                    </td>
                                    {/* Score input */}
                                    <td className="px-3 py-2.5">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number" min="0" max="100"
                                          defaultValue={reg.score ?? 0}
                                          onBlur={async (e) => {
                                            const val = Number(e.target.value);
                                            if (val < 0 || val > 100) { e.target.value = reg.score ?? 0; return; }
                                            try {
                                              await api.put(`/events/admin/hackathons/${h._id}/registrations/${reg._id}/score`, { score: val });
                                            } catch { e.target.value = reg.score ?? 0; }
                                          }}
                                          className="w-14 px-2 py-1 border border-slate-200 rounded text-xs text-center focus:ring-2 focus:ring-indigo-400 outline-none"
                                        />
                                        {reg.scoredAt && <span className="text-slate-300 text-xs" title={`Scored ${new Date(reg.scoredAt).toLocaleDateString()}`}>✓</span>}
                                      </div>
                                    </td>
                                    {/* Status dropdown */}
                                    <td className="px-3 py-2.5">
                                      <select
                                        value={reg.status}
                                        onChange={async (e) => {
                                          await api.put(`/events/admin/hackathons/${h._id}/registrations/${reg._id}`, {
                                            status: e.target.value,
                                            adminRemarks: reg.adminRemarks || '',
                                          });
                                          loadRegistrations(h._id);
                                        }}
                                        className="px-2 py-1 rounded border border-slate-200 text-xs"
                                      >
                                        {['registered', 'payment_pending', 'submitted', 'under_review', 'approved', 'rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {Array.isArray(registrationsByHack[h._id]) && registrationsByHack[h._id].length === 0 && loadingRegistrationsFor !== h._id && (
                        <div className="mt-3 text-xs text-slate-500">No team registrations yet.</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-indigo-600" />
                How to Add / Edit Courses
              </h2>

              <ol className="space-y-5 text-slate-700">
                {[
                  {
                    step: '1',
                    title: 'Open all-courses.json',
                    desc: 'Located at frontend/public/data/all-courses.json. This is the single source of truth for all course content.',
                  },
                  {
                    step: '2',
                    title: 'Add a new entry at the bottom of the array',
                    desc: 'Each course entry has two keys: "course" (metadata) and "lessons" (array of lesson objects). Copy an existing entry and update the fields.',
                  },
                  {
                    step: '3',
                    title: 'Required fields for a course',
                    desc: '_id (unique hex), title, slug (kebab-case, used in URL), description, image (URL), theme (blue/green/orange/pink), published (true/false)',
                  },
                  {
                    step: '4',
                    title: 'Required fields for each lesson',
                    desc: '_id (unique hex), course (same as course._id), title, content (HTML string), order (1, 2, 3...)',
                  },
                  {
                    step: '5',
                    title: 'Save the file',
                    desc: 'Vite dev server hot-reloads instantly. In production, redeploy the frontend build. No backend changes needed.',
                  },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-violet-600" />
                Course Entry Template
              </h2>
              <div className="bg-slate-900 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono">all-courses.json - new course entry</div>
                <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre">{`{
  "course": {
    "_id": "UNIQUE_HEX_24_CHARS",
    "title": "My New Course",
    "slug": "my-new-course",
    "description": "Short description here.",
    "image": "https://link-to-image.jpg",
    "instructor": "69b7983467bb2f063cefab80",
    "published": true,
    "theme": "orange",
    "createdAt": "2026-03-17T00:00:00.000Z",
    "updatedAt": "2026-03-17T00:00:00.000Z",
    "__v": 0
  },
  "lessons": [
    {
      "_id": "UNIQUE_HEX_24_CHARS",
      "course": "SAME_AS_COURSE_ID",
      "title": "1. Introduction",
      "content": "<h2>Welcome!</h2><p>Your lesson HTML here.</p>",
      "videoUrl": "",
      "order": 1,
      "__v": 0,
      "createdAt": "2026-03-17T00:00:00.000Z",
      "updatedAt": "2026-03-17T00:00:00.000Z"
    }
  ]
}`}</pre>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Themes Available
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'blue', cls: 'bg-indigo-600' },
                  { name: 'green', cls: 'bg-emerald-600' },
                  { name: 'orange', cls: 'bg-amber-500' },
                  { name: 'pink', cls: 'bg-rose-600' },
                ].map(({ name, cls }) => (
                  <span key={name} className={`${cls} text-white px-3 py-1 rounded-full text-xs font-bold`}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'host-requests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Host Requests (B2B)
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportAllUsers}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm flex items-center gap-2"
                  >
                    Export All Users
                  </button>
                  <button
                    onClick={loadHostRequests}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-sm flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>
              </div>

              {hostRequestsLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
              ) : hostRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                  No hosting requests received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {hostRequests.map(req => (
                    <div key={req._id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg text-slate-900">{req.organization}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              req.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {req.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                            <div><span className="text-slate-500 text-xs block">Contact Name</span><span className="font-medium">{req.name}</span></div>
                            <div><span className="text-slate-500 text-xs block">Email</span><a href={`mailto:${req.email}`} className="font-medium text-indigo-600 hover:underline">{req.email}</a></div>
                            <div><span className="text-slate-500 text-xs block">Expected Pax</span><span className="font-medium text-slate-700">{req.expectedParticipants || 'Not specified'}</span></div>
                            <div><span className="text-slate-500 text-xs block">Date Submitted</span><span className="font-medium text-slate-700">{formatDate(req.createdAt)}</span></div>
                          </div>
                          
                          {req.message && (
                            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
                              <span className="font-semibold text-slate-400 block mb-1">Message:</span>
                              {req.message}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex flex-row md:flex-col gap-2">
                          <select 
                            value={req.status} 
                            onChange={(e) => updateHostRequestStatus(req._id, e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="approved">Approved & Created</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          {req.status !== 'approved' && (
                            <button
                              onClick={() => {
                                setTab('hackathons');
                                setHackForm((prev) => ({
                                  ...prev,
                                  title: `${req.organization} Hackathon`,
                                  paymentDescription: `Registration for ${req.organization} event`
                                }));
                                setShowHackForm(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition"
                            >
                              <Plus className="w-4 h-4" /> Create Hackathon
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

