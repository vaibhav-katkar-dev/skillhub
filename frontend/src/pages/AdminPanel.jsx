import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import { getCourseList } from '../data/courseLoader';
import {
  ShieldCheck, BookOpen, FileJson, Upload, CheckCircle,
  AlertCircle, ChevronDown, Loader2, Plus, Trash2, Save,
  ClipboardList, Edit3, RefreshCw
} from 'lucide-react';

// ─── Quiz Template for reference ─────────────────────────────────────────────
const QUIZ_TEMPLATE = {
  passingScore: 60,
  questions: [
    {
      questionText: "Your question here?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOptionIndex: 0
    }
  ]
};

// ─── AdminPanel ───────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Course list (from static file)
  const [courses, setCourses] = useState([]);

  // Quiz Manager state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [quizJson, setQuizJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [uploadMessage, setUploadMessage] = useState('');
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Active tab
  const [tab, setTab] = useState('quiz'); // 'quiz' | 'guide'

  // Load courses for dropdown
  useEffect(() => {
    getCourseList().then(setCourses).catch(console.error);
  }, []);

  // Auth guard
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // ── Validate JSON input ────────────────────────────────────────────────────
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
      return null; // valid
    } catch (e) {
      return 'Invalid JSON: ' + e.message;
    }
  };

  // ── Load existing quiz from DB ─────────────────────────────────────────────
  const handleLoadExisting = async () => {
    if (!selectedCourseId) return;
    setLoadingExisting(true);
    try {
      const res = await api.get(`/quizzes/${selectedCourseId}`);
      const { passingScore, questions } = res.data;
      // Re-add correctOptionIndex (admin gets it per backend route)
      setQuizJson(JSON.stringify({ passingScore, questions }, null, 2));
      setJsonError('');
    } catch (err) {
      setJsonError(err.response?.status === 404 ? 'No quiz found for this course yet.' : 'Failed to load quiz.');
    } finally {
      setLoadingExisting(false);
    }
  };

  // ── Handle JSON textarea change ────────────────────────────────────────────
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

  // ── Submit quiz to MongoDB via backend ─────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedCourseId) { setJsonError('Please select a course first.'); return; }
    const err = validateJson(quizJson);
    if (err) { setJsonError(err); return; }

    setUploadStatus('loading');
    setUploadMessage('');
    try {
      const parsed = JSON.parse(quizJson);
      await api.post(`/quizzes/${selectedCourseId}`, parsed);
      setUploadStatus('success');
      setUploadMessage(`Quiz saved to MongoDB for "${selectedCourseTitle}" ✅`);
    } catch (err) {
      setUploadStatus('error');
      setUploadMessage(err.response?.data?.message || 'Upload failed. Is the backend running?');
    }
  };

  // ── Load template into editor ──────────────────────────────────────────────
  const handleLoadTemplate = () => {
    setQuizJson(JSON.stringify(QUIZ_TEMPLATE, null, 2));
    setJsonError('');
    setUploadStatus(null);
  };

  const questionCount = (() => {
    try { return JSON.parse(quizJson).questions?.length || 0; } catch { return 0; }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <Helmet>
        <title>Admin Panel | SkillHub</title>
      </Helmet>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shadow-lg">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
              <p className="text-indigo-200 text-sm mt-0.5">Manage quizzes and course content · SkillHub</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-8">
            {[
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

        {/* ═══════ QUIZ MANAGER TAB ═══════ */}
        {tab === 'quiz' && (
          <div className="space-y-6">

            {/* Step 1 — Select Course */}
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
                      <option value="">— Choose a course —</option>
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
                    <span className="ml-1 text-slate-400">· Course ID: <code className="font-mono bg-slate-100 px-1 rounded">{selectedCourseId}</code></span>
                  </p>
                )}
              </div>
            </div>

            {/* Step 2 — Edit Quiz JSON */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
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
                {/* Format reference box */}
                <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                  <div className="text-slate-500 mb-2 text-xs uppercase tracking-wider font-sans font-bold">Expected JSON Format</div>
                  <pre className="whitespace-pre">{`{
  "passingScore": 60,
  "questions": [
    {
      "questionText": "What does JS stand for?",
      "options": ["Java Standard", "JavaScript", "Just Script", "None"],
      "correctOptionIndex": 1
    }
  ]
}`}</pre>
                </div>

                {/* JSON Editor */}
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

                {/* JSON Error */}
                {jsonError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3 — Upload */}
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

                {/* Upload result */}
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

        {/* ═══════ COURSE GUIDE TAB ═══════ */}
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
                    desc: '_id (unique hex), course (same as course._id), title, content (HTML string), order (1, 2, 3…)',
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
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono">all-courses.json — new course entry</div>
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
