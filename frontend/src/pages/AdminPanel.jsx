import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  FolderOpen, FileJson, BookOpen, AlertCircle,
  Copy, CheckCircle, Download, GraduationCap,
  Shield, ChevronRight, Info, Sparkles, Code2
} from 'lucide-react';

/* ── Course JSON Template ── */
const TEMPLATE = {
  course: {
    _id: "UNIQUE_ID_HERE",
    title: "Your Course Title",
    slug: "your-course-slug",
    description: "A comprehensive description of what this course covers.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    theme: "blue",
    published: true,
    instructor: "INSTRUCTOR_ID",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  },
  lessons: [
    {
      _id: "LESSON_ID_1",
      title: "1. Introduction",
      content: "<h2>Welcome!</h2><p>This is the first lesson. Write HTML content here.</p><pre><code>// Example code block</code></pre>",
      videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
      duration: 15,
      order: 1
    },
    {
      _id: "LESSON_ID_2",
      title: "2. Core Concepts",
      content: "<h2>Core Concepts</h2><p>Lesson content goes here...</p>",
      videoUrl: "",
      duration: 20,
      order: 2
    }
  ]
};

/* Courses index entry */
const INDEX_ENTRY = {
  _id: "UNIQUE_ID_HERE",
  title: "Your Course Title",
  slug: "your-course-slug",
  description: "A comprehensive description of what this course covers.",
  image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
  theme: "blue",
  instructor: "INSTRUCTOR_ID",
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  __v: 0
};

/* ── Step Card ── */
const Step = ({ num, title, children, color = 'indigo' }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-600', ring: 'ring-indigo-100', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-600', ring: 'ring-emerald-100', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-500', ring: 'ring-amber-100', border: 'border-amber-100' },
    blue: { bg: 'bg-blue-600', ring: 'ring-blue-100', border: 'border-blue-100' },
  };
  const c = colors[color];
  return (
    <div className={`bg-white border ${c.border} rounded-2xl p-6 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 ${c.bg} text-white rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0`}>
          {num}
        </div>
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
      </div>
      <div className="text-slate-600 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};

/* ── Code Block with Copy ── */
const CopyBlock = ({ code, label }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(typeof code === 'string' ? code : JSON.stringify(code, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
      <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between">
        <span className="text-slate-400 text-xs font-mono font-semibold">{label}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
          }`}
        >
          {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-slate-900 text-slate-200 p-5 text-xs overflow-x-auto leading-relaxed max-h-64 overflow-y-auto">
        <code>{typeof code === 'string' ? code : JSON.stringify(code, null, 2)}</code>
      </pre>
    </div>
  );
};

/* ── Download Button ── */
const DownloadBtn = ({ data, filename, label }) => {
  const handle = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const AdminPanel = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-600 mt-2">You must be an administrator to view this page.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Admin Panel | SkillHub</title>
      </Helmet>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-4 h-4 text-indigo-300" />
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            SkillHub <span className="text-indigo-400">Admin</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl leading-relaxed">
            Courses &amp; lessons are managed via <span className="text-indigo-300 font-bold">static JSON files</span>.
            Quiz and certificate features remain dynamic via the backend API.
          </p>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-bold">Courses — Static Files</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-bold">Quiz — Dynamic API</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-bold">Certificates — Dynamic API</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* ── Info Banner ── */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-indigo-900 mb-1">How Course Content Works</p>
            <p className="text-indigo-700 text-sm leading-relaxed">
              All course and lesson data is stored in <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-xs">frontend/public/data/</code>.
              Editing a JSON file and redeploying is all you need — <strong>no database, no admin UI upload.</strong>
              Only quiz questions and certificate records use the backend API.
            </p>
          </div>
        </div>

        {/* ── File Structure ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">File Structure</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm leading-8 shadow-xl overflow-x-auto">
            <div className="text-slate-400 mb-1">frontend/public/data/</div>
            <div className="ml-4">
              <div className="text-yellow-300">
                <FileJson className="w-4 h-4 inline mr-2 text-yellow-400" />
                courses.json
                <span className="text-slate-500 text-xs ml-3 font-sans">← Course listing (index)</span>
              </div>
              <div className="text-blue-300 mt-1">
                <FileJson className="w-4 h-4 inline mr-2 text-blue-400" />
                ultimate-html-masterclass.json
                <span className="text-slate-500 text-xs ml-3 font-sans">← Course detail + lessons</span>
              </div>
              <div className="text-blue-300 mt-1">
                <FileJson className="w-4 h-4 inline mr-2 text-blue-400" />
                css-for-beginners-learn-web-styling-zero-to-pro.json
                <span className="text-slate-500 text-xs ml-3 font-sans">← Course detail + lessons</span>
              </div>
              <div className="text-slate-500 mt-1 italic">
                <FileJson className="w-4 h-4 inline mr-2" />
                your-new-course-slug.json
                <span className="text-slate-600 text-xs ml-3 font-sans">← Add new courses here</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Step-by-Step Guide ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">How to Add / Edit a Course</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Step num="1" title="Create the course detail file" color="indigo">
              <p>Create a new file in <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">public/data/</code> named after the course slug.</p>
              <p className="mt-2 font-semibold text-slate-700">Example: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">my-new-course.json</code></p>
              <p className="mt-2">Use the template below. It contains <code className="bg-slate-100 px-1 rounded font-mono text-xs">course</code> + <code className="bg-slate-100 px-1 rounded font-mono text-xs">lessons</code> arrays. No quiz data needed here.</p>
            </Step>

            <Step num="2" title="Add the course to the index" color="blue">
              <p>Open <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">public/data/courses.json</code> and add a new entry to the array.</p>
              <p className="mt-2">Copy the <code className="bg-slate-100 px-1 rounded font-mono text-xs">course</code> object (without lessons). The <code className="bg-slate-100 px-1 rounded font-mono text-xs">_id</code> must match the one in your detail file — it's used for certificate matching.</p>
            </Step>

            <Step num="3" title="Use unique, stable IDs" color="amber">
              <p>The <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">_id</code> field (course and lesson) must be a unique 24-char hex string.</p>
              <p className="mt-2">Generate them free at <a href="https://www.mongodb.com/docs/manual/reference/method/ObjectId/" target="_blank" rel="noreferrer" className="text-amber-600 font-semibold underline">objectid.io</a> or by running <code className="bg-slate-100 px-1 rounded font-mono text-xs">new ObjectId()</code> in Node.</p>
              <p className="mt-2 text-amber-700 font-semibold">⚠️ Never change an ID after publishing — it will break quiz/cert links!</p>
            </Step>

            <Step num="4" title="Redeploy / restart dev server" color="emerald">
              <p>Static files are served directly — no rebuild needed in development. Just save the file and refresh.</p>
              <p className="mt-2">For production: commit the new JSON files and redeploy. Vercel/Netlify will serve them instantly as static assets.</p>
            </Step>
          </div>
        </section>

        {/* ── Templates ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Code2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">JSON Templates</h2>
          </div>

          <div className="space-y-6">
            {/* Course detail template */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">Course Detail File</p>
                  <p className="text-slate-500 text-xs mt-0.5">Save as <code className="font-mono">public/data/your-course-slug.json</code></p>
                </div>
                <DownloadBtn data={TEMPLATE} filename="your-course-slug.json" label="Download Template" />
              </div>
              <CopyBlock code={TEMPLATE} label="your-course-slug.json" />
            </div>

            {/* Index entry template */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">courses.json  —  Index Entry</p>
                  <p className="text-slate-500 text-xs mt-0.5">Add this object to the array in <code className="font-mono">public/data/courses.json</code></p>
                </div>
                <DownloadBtn data={[INDEX_ENTRY]} filename="courses_entry.json" label="Download Entry" />
              </div>
              <CopyBlock code={INDEX_ENTRY} label="courses.json → new entry" />
            </div>
          </div>
        </section>

        {/* ── Themes Reference ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">Available Themes</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'blue', from: '#4f46e5', to: '#1d4ed8' },
              { name: 'green', from: '#059669', to: '#0d9488' },
              { name: 'pink', from: '#e11d48', to: '#be185d' },
              { name: 'orange', from: '#f59e0b', to: '#ea580c' },
            ].map(t => (
              <div key={t.name} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="h-12" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
                <div className="p-3 bg-white">
                  <p className="font-mono font-bold text-slate-700 text-sm">"{t.name}"</p>
                  <p className="text-slate-400 text-xs mt-0.5">Set in course.theme</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dynamic Features (Quiz + Certs) ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">Dynamic Features (Remain On Backend)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-800">Quiz Management</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Quiz questions are stored in MongoDB and managed via backend API.
                To edit quizzes, update the backend route or use the database directly.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-600 border border-slate-100">
                POST /api/courses/upload
                <br />
                <span className="text-slate-400"># Only quiz field is used from this</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-800">Certificate Verification</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Certificates are auto-generated after a quiz pass and stored in the database.
                They are linked by <code className="bg-slate-100 px-1.5 rounded font-mono">course._id</code> from the static JSON.
              </p>
              <a
                href="/verify"
                className="inline-flex items-center gap-2 text-amber-600 font-bold text-sm hover:gap-3 transition-all"
              >
                Go to Certificate Verifier <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Quick Links ── */}
        <div className="bg-slate-900 rounded-2xl p-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-white font-bold">Need to add a quiz to a new course?</p>
            <p className="text-slate-400 text-sm mt-0.5">
              Use the backend <code className="text-indigo-300 font-mono text-xs">POST /api/courses/upload</code> route with only the <code className="text-indigo-300 font-mono text-xs">quiz</code> field populated.
              The course <code className="text-indigo-300 font-mono text-xs">slug</code> must match your JSON filename.
            </p>
          </div>
          <a
            href="http://localhost:5000/api"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all whitespace-nowrap"
          >
            Open API <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
