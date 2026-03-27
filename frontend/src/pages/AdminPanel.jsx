import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import { getCourseList } from '../data/courseLoader';
import {
  ShieldCheck, BookOpen, FileJson, Upload, CheckCircle,
  AlertCircle, ChevronDown, Loader2, Plus,
  ClipboardList, Edit3, RefreshCw, BarChart3, Users,
  Award, Activity, Lock, Database, Eye
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

  useEffect(() => {
    getCourseList().then(setCourses).catch(console.error);
  }, []);

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
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {tab === 'analytics' && (
          <div className="space-y-6">
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
                    <Icon className="w-5 h-5 text-white/90" />
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
                          <Icon className="w-5 h-5" />
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
      </div>
    </div>
  );
};

export default AdminPanel;

