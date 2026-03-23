import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseBySlug } from '../data/courseLoader';
import {
  ChevronLeft, CheckCircle, BookOpen, Check,
  ArrowRight, Trophy, ListOrdered, GraduationCap,
  ChevronDown, ChevronUp
} from 'lucide-react';

const LessonView = () => {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();

  const [course,           setCourse]           = useState(null);
  const [lesson,           setLesson]           = useState(null);
  const [allLessons,       setAllLessons]       = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [mobileOpen,       setMobileOpen]       = useState(false);

  /* ── Progress persistence ── */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('skillhub_progress') || '{}');
    if (saved[slug]) setCompletedLessons(saved[slug]);
  }, [slug]);

  const persist = (list) => {
    const saved = JSON.parse(localStorage.getItem('skillhub_progress') || '{}');
    saved[slug] = list;
    localStorage.setItem('skillhub_progress', JSON.stringify(saved));
  };

  /* ── Fetch Course Data (Once per course) ── */
  useEffect(() => {
    setLoading(true);
    getCourseBySlug(slug)
      .then(data => {
        if (!data) throw new Error('Course not found');
        const lessons = data.lessons || [];
        setCourse(data.course);
        setAllLessons(lessons);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Switch Lesson Instantly (No API Call) ── */
  useEffect(() => {
    if (allLessons.length > 0) {
      const match = allLessons.find(l => l._id === lessonId);
      setLesson(match || null);
    }
  }, [lessonId, allLessons]);

  /* ── Computed ── */
  const currentIndex = allLessons.findIndex(l => l._id === lessonId);
  const nextLesson   = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson   = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const isLastLesson = currentIndex === allLessons.length - 1 && allLessons.length > 0;
  const progress     = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;
  const isCompleted  = completedLessons.includes(lessonId);

  const markCompleted = () => {
    if (isCompleted) return;
    const next = [...completedLessons, lessonId];
    setCompletedLessons(next);
    persist(next);
  };

  const handleContinue = () => {
    if (!isCompleted) {
      const next = [...completedLessons, lessonId];
      setCompletedLessons(next);
      persist(next);
    }
    navigate(nextLesson ? `/courses/${slug}/lesson/${nextLesson._id}` : `/courses/${slug}/quiz`);
  };

  /* ── States ── */
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100vh - 64px)' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        <div style={{ width:40, height:40, border:'4px solid #e0e7ff', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#94a3b8', fontSize:14, fontWeight:500 }}>Loading lesson…</p>
      </div>
    </div>
  );

  if (!lesson) return (
    <div style={{ padding:'80px 24px', textAlign:'center' }}>
      <p style={{ color:'#64748b', fontSize:16, marginBottom:16 }}>Lesson not found.</p>
      <Link to={`/courses/${slug}`} style={{ color:'#6366f1', fontWeight:600, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
        <ChevronLeft size={16} /> Back to Course
      </Link>
    </div>
  );

  /* ══════════════════════════════════════
      RENDER
  ══════════════════════════════════════ */
  return (
    <>
      <Helmet>
        <title>{lesson.title} | {course?.title} | SkillHub</title>
      </Helmet>

      <style>{`
        /* ── Base reset for lesson page ── */
        .lv-root { font-family: 'Inter', system-ui, sans-serif; background: #f1f5f9; min-height: calc(100vh - 64px); }

        /* ── Topbar ── */
        .lv-topbar {
          position: sticky; top: 64px; z-index: 40;
          background: #fff; border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        }
        .lv-topbar-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 0 20px;
          height: 52px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .lv-back { display:flex; align-items:center; font-size:14px; font-weight:700; color:#64748b; text-decoration:none; transition:color .15s; white-space:nowrap; }
        .lv-back:hover { color:#6366f1; }
        .lv-back-text { max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-left:4px; }
        .lv-pill { font-size:12px; font-weight:700; color:#6366f1; background:#eef2ff; border:1px solid #c7d2fe; padding:4px 14px; border-radius:100px; white-space:nowrap; display:flex; gap:4px; align-items:center; }
        .lv-pill-lbl { display:inline; }
        .lv-progress-wrap { display:flex; align-items:center; gap:8px; }
        .lv-progress-track { width:96px; height:6px; background:#e2e8f0; border-radius:100px; overflow:hidden; }
        .lv-progress-fill { height:100%; background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:100px; transition:width .5s ease; }
        .lv-progress-pct { font-size:11px; font-weight:800; color:#6366f1; }
        .lv-modules-btn {
          display:none; align-items:center; gap:6px;
          font-size:12px; font-weight:800; color:#6366f1;
          background:#eef2ff; border:1.5px solid #c7d2fe;
          padding:6px 14px; border-radius:10px; cursor:pointer;
          transition:all .15s;
        }
        .lv-modules-btn:hover { background:#e0e7ff; }

        /* ── Mobile drawer ── */
        .lv-mobile-drawer {
          background:#fff; border-bottom:1px solid #e2e8f0;
          box-shadow:0 4px 20px rgba(0,0,0,0.10);
          max-height:65vh; overflow-y:auto;
        }

        /* ── Two-column grid layout ── */
        .lv-body {
          max-width:1400px; margin:0 auto; padding:24px 20px;
          display:grid;
          grid-template-columns:1fr 320px;
          gap:24px;
          align-items:start;
        }

        /* ── Main content pane ── */
        .lv-main { min-width:0; }
        .lv-card { background:#fff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .lv-lesson-header {
          padding:32px 36px 24px;
          background:linear-gradient(135deg,#eef2ff 0%,#fdf4ff 40%,#fff 80%);
          border-bottom:1px solid #e2e8f0;
        }
        .lv-breadcrumb { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:12px; font-size:13px; font-weight:600; color:#6366f1; }
        .lv-breadcrumb-sep { color:#cbd5e1; }
        .lv-lesson-title { font-size:clamp(1.5rem,3.5vw,2.25rem); font-weight:900; color:#0f172a; line-height:1.2; margin:0; }
        .lv-body-content {
          padding:32px 36px;
          color:#374151; line-height:1.8; font-size:16px;
        }
        /* Prose styles */
        .lv-body-content h1,.lv-body-content h2,.lv-body-content h3,.lv-body-content h4 { color:#0f172a; font-weight:800; line-height:1.3; margin:1.5em 0 .5em; }
        .lv-body-content h1 { font-size:1.75rem; }
        .lv-body-content h2 { font-size:1.4rem; }
        .lv-body-content h3 { font-size:1.15rem; }
        .lv-body-content p { margin:0 0 1em; }
        .lv-body-content a { color:#6366f1; text-decoration:none; }
        .lv-body-content a:hover { text-decoration:underline; }
        .lv-body-content code { background:#f1f5f9; color:#7c3aed; padding:2px 7px; border-radius:6px; font-size:0.875em; font-family:monospace; }
        .lv-body-content pre { background:#1e293b; color:#e2e8f0; padding:20px 24px; border-radius:14px; overflow-x:auto; margin:1.25em 0; }
        .lv-body-content pre code { background:none; color:inherit; padding:0; font-size:0.9em; }
        .lv-body-content ul,.lv-body-content ol { padding-left:1.5em; margin:0 0 1em; }
        .lv-body-content li { margin-bottom:.4em; }
        .lv-body-content blockquote { border-left:4px solid #a5b4fc; background:#eef2ff; margin:1em 0; padding:12px 20px; border-radius:0 10px 10px 0; color:#4338ca; font-style:italic; }
        .lv-body-content img { max-width:100%; border-radius:10px; }
        .lv-video-wrap { aspect-ratio:16/9; overflow:hidden; border-radius:14px; border:1px solid #e2e8f0; background:#0f172a; margin-bottom:28px; box-shadow:0 4px 20px rgba(0,0,0,0.1); }
        .lv-video-wrap iframe { width:100%; height:100%; border:none; }

        /* ── Bottom action bar ── */
        .lv-actions {
          padding:20px 28px;
          background:#f8faff;
          border-top:1px solid #e2e8f0;
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
        }
        .lv-btn-complete {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 20px; border-radius:12px; font-size:14px; font-weight:700;
          border:1.5px solid #e2e8f0; background:#fff; color:#374151;
          cursor:pointer; transition:all .2s;
        }
        .lv-btn-complete:hover:not(:disabled) { background:#f8faff; border-color:#a5b4fc; color:#4f46e5; }
        .lv-btn-complete.done { background:#ecfdf5; border-color:#86efac; color:#16a34a; cursor:default; }
        .lv-nav-row { display:flex; align-items:center; gap:10px; }
        .lv-btn-prev {
          display:inline-flex; align-items:center; gap:6px;
          padding:11px 18px; border-radius:12px; font-size:14px; font-weight:700;
          border:1.5px solid #e2e8f0; background:#fff; color:#374151;
          text-decoration:none; transition:all .2s;
        }
        .lv-btn-prev:hover { background:#f1f5f9; border-color:#cbd5e1; }
        .lv-btn-next {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 24px; border-radius:12px; font-size:14px; font-weight:700;
          background:linear-gradient(135deg,#6366f1,#7c3aed);
          color:#fff; border:none; cursor:pointer;
          box-shadow:0 4px 16px rgba(99,102,241,.35);
          transition:all .2s;
        }
        .lv-btn-next:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.45); }
        .lv-btn-quiz {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 24px; border-radius:12px; font-size:14px; font-weight:700;
          background:linear-gradient(135deg,#059669,#0d9488);
          color:#fff; border:none; cursor:pointer;
          box-shadow:0 4px 16px rgba(5,150,105,.35);
          transition:all .2s;
        }
        .lv-btn-quiz:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(5,150,105,.45); }

        /* ── RIGHT SIDEBAR ── */
        .lv-sidebar {
          position:sticky;
          top: calc(64px + 52px + 24px); /* navbar + topbar + gap */
          max-height: calc(100vh - 64px - 52px - 48px);
          display:flex; flex-direction:column;
          background:#fff;
          border:1px solid #e2e8f0;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
        }

        /* Sidebar header */
        .lv-sb-header {
          flex-shrink:0;
          padding:18px 20px 16px;
          background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);
        }
        .lv-sb-title { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .lv-sb-title span { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:800; color:#fff; }
        .lv-sb-count { font-size:11px; font-weight:700; color:#c4b5fd; background:rgba(255,255,255,0.12); padding:3px 10px; border-radius:100px; }
        .lv-sb-track { height:4px; background:rgba(255,255,255,0.2); border-radius:100px; overflow:hidden; }
        .lv-sb-fill { height:100%; background:#fff; border-radius:100px; transition:width .5s ease; }
        .lv-sb-pct { font-size:11px; color:#c4b5fd; margin-top:6px; font-weight:600; }

        /* Sidebar module list — ONLY THIS SCROLLS */
        .lv-sb-list { flex:1; overflow-y:auto; overscroll-behavior:contain; }
        .lv-sb-list::-webkit-scrollbar { width:4px; }
        .lv-sb-list::-webkit-scrollbar-track { background:#f1f5f9; }
        .lv-sb-list::-webkit-scrollbar-thumb { background:#c7d2fe; border-radius:100px; }

        .lv-sb-item {
          display:flex; align-items:flex-start; gap:12px;
          padding:14px 18px;
          border-bottom:1px solid #f1f5f9;
          text-decoration:none;
          transition:background .15s;
          cursor:pointer;
        }
        .lv-sb-item:last-child { border-bottom:none; }
        .lv-sb-item:hover { background:#f8faff; }
        .lv-sb-item.active { background:#eef2ff; }
        .lv-sb-item.done-item .lv-sb-item-title { text-decoration:line-through; color:#94a3b8; }

        .lv-sb-badge {
          flex-shrink:0; width:28px; height:28px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:900;
          margin-top:1px;
          transition:all .2s;
        }
        .lv-sb-badge.pending { background:#f1f5f9; color:#64748b; }
        .lv-sb-badge.pending-hover:hover { background:#e0e7ff; color:#6366f1; }
        .lv-sb-badge.active-badge { background:#6366f1; color:#fff; box-shadow:0 0 0 4px #e0e7ff; }
        .lv-sb-badge.done-badge { background:#22c55e; color:#fff; }

        .lv-sb-item-text { flex:1; min-width:0; }
        .lv-sb-item-title { font-size:13px; font-weight:600; color:#334155; line-height:1.4; word-break:break-word; }
        .lv-sb-item.active .lv-sb-item-title { color:#4f46e5; font-weight:800; }
        .lv-sb-item-sub { font-size:11px; margin-top:3px; font-weight:600; }
        .lv-sb-item-sub.viewing { color:#818cf8; }
        .lv-sb-item-sub.done-sub { color:#22c55e; }

        /* Sidebar footer */
        .lv-sb-footer { flex-shrink:0; padding:14px 16px; background:#f8faff; border-top:1px solid #e2e8f0; }
        .lv-sb-quiz-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:12px; border-radius:14px; font-size:13px; font-weight:800; color:#fff;
          background:linear-gradient(135deg,#059669,#0d9488);
          text-decoration:none;
          box-shadow:0 4px 14px rgba(5,150,105,.3);
          transition:all .2s;
        }
        .lv-sb-quiz-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(5,150,105,.4); }
        .lv-sb-footer-note { text-align:center; font-size:11px; color:#94a3b8; margin-top:8px; font-weight:500; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .lv-body { grid-template-columns:1fr; }
          .lv-sidebar { display:none; }
          .lv-modules-btn { display:flex !important; }
          .lv-progress-wrap { display:none; }
          .lv-lesson-header { padding:24px 20px 18px; }
          .lv-body-content { padding:20px; }
          .lv-actions { padding:16px 20px; }
        }
        @media (max-width: 600px) {
          .lv-back-text { display:none; }
          .lv-pill { padding:4px 10px; font-size:11px; }
          .lv-pill-lbl { display:none; }
          .lv-topbar-inner { padding:0 12px; gap:8px; }
          .lv-modules-btn { padding:5px 10px; font-size:12px; }
          .lv-body { padding:16px 12px; }
          .lv-actions { flex-direction:column; align-items:stretch; }
          .lv-btn-complete, .lv-btn-next, .lv-btn-quiz { width:100%; justify-content:center; }
          .lv-nav-row { flex:1; }
          .lv-btn-next, .lv-btn-quiz { flex:1; }
          .lv-btn-prev { flex-shrink:0; }
        }
      `}</style>

      <div className="lv-root">

        {/* ══ STICKY TOPBAR ══ */}
        <div className="lv-topbar">
          <div className="lv-topbar-inner">
            {/* Back */}
            <Link to={`/courses/${slug}`} className="lv-back" title="Back to Course">
              <ChevronLeft size={18} />
              <span className="lv-back-text">
                {course?.title || 'Back'}
              </span>
            </Link>

            {/* Module position */}
            <span className="lv-pill">
              <span className="lv-pill-lbl">Module</span> {currentIndex + 1} of {allLessons.length}
            </span>

            {/* Right: desktop progress + mobile toggle */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div className="lv-progress-wrap">
                <div className="lv-progress-track">
                  <div className="lv-progress-fill" style={{ width:`${progress}%` }} />
                </div>
                <span className="lv-progress-pct">{progress}%</span>
              </div>

              <button className="lv-modules-btn" onClick={() => setMobileOpen(o => !o)}>
                <ListOrdered size={13} />
                Modules
                {mobileOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* ══ MOBILE MODULE DRAWER ══ */}
        {mobileOpen && (
          <div className="lv-mobile-drawer">
            <MobileModuleList
              allLessons={allLessons}
              lessonId={lessonId}
              slug={slug}
              completedLessons={completedLessons}
              progress={progress}
              onSelect={() => setMobileOpen(false)}
            />
          </div>
        )}

        {/* ══ MAIN GRID BODY ══ */}
        <div className="lv-body">

          {/* ─ LESSON CONTENT ─ */}
          <main className="lv-main">
            <div className="lv-card">

              {/* Lesson header */}
              <div className="lv-lesson-header">
                <div className="lv-breadcrumb">
                  <BookOpen size={14} />
                  <span style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{course?.title}</span>
                  <span className="lv-breadcrumb-sep">›</span>
                  <span style={{ color:'#64748b', fontWeight:500 }}>Module {currentIndex + 1}</span>
                </div>
                <h1 className="lv-lesson-title">{lesson.title}</h1>
              </div>

              {/* Lesson content */}
              <div className="lv-body-content">
                {lesson.videoUrl && (
                  <div className="lv-video-wrap">
                    <iframe
                      src={lesson.videoUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>

              {/* Action bar */}
              <div className="lv-actions">
                <button
                  onClick={markCompleted}
                  disabled={isCompleted}
                  className={`lv-btn-complete${isCompleted ? ' done' : ''}`}
                >
                  <CheckCircle size={17} style={{ color: isCompleted ? '#16a34a' : '#94a3b8' }} />
                  {isCompleted ? '✓ Completed' : 'Mark as Completed'}
                </button>

                <div className="lv-nav-row">
                  {prevLesson && (
                    <Link to={`/courses/${slug}/lesson/${prevLesson._id}`} className="lv-btn-prev">
                      <ChevronLeft size={15} />
                      Prev
                    </Link>
                  )}
                  {isLastLesson ? (
                    <button onClick={handleContinue} className="lv-btn-quiz">
                      <Trophy size={15} />
                      Take Certification Exam
                    </button>
                  ) : (
                    <button onClick={handleContinue} className="lv-btn-next">
                      Next Lesson
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* ─ RIGHT SIDEBAR (desktop only via CSS) ─ */}
          <aside className="lv-sidebar">
            {/* Header with progress */}
            <div className="lv-sb-header">
              <div className="lv-sb-title">
                <span><ListOrdered size={15} /> Course Modules</span>
                <span className="lv-sb-count">{completedLessons.length}/{allLessons.length} done</span>
              </div>
              <div className="lv-sb-track">
                <div className="lv-sb-fill" style={{ width:`${progress}%` }} />
              </div>
              <div className="lv-sb-pct">{progress}% complete</div>
            </div>

            {/* ─ THE ONLY SCROLLABLE PART ─ */}
            <div className="lv-sb-list">
              {allLessons.map((l, i) => {
                const isActive = l._id === lessonId;
                const isDone   = completedLessons.includes(l._id);
                return (
                  <Link
                    key={l._id}
                    to={`/courses/${slug}/lesson/${l._id}`}
                    className={`lv-sb-item${isActive ? ' active' : ''}${isDone && !isActive ? ' done-item' : ''}`}
                  >
                    <div className={`lv-sb-badge ${isDone ? 'done-badge' : isActive ? 'active-badge' : 'pending'}`}>
                      {isDone ? <Check size={13} /> : i + 1}
                    </div>
                    <div className="lv-sb-item-text">
                      <div className="lv-sb-item-title">
                        {l.title.replace(/^\d+\.\s*/, '')}
                      </div>
                      {isActive && <div className="lv-sb-item-sub viewing">▶ Viewing now</div>}
                      {isDone && !isActive && <div className="lv-sb-item-sub done-sub">✓ Completed</div>}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="lv-sb-footer">
              <Link to={`/courses/${slug}/quiz`} className="lv-sb-quiz-btn">
                <GraduationCap size={15} />
                Take Certification Exam
              </Link>
              <p className="lv-sb-footer-note">Pass the exam to earn your certificate</p>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
};

/* ── Mobile module list (inside drawer) ── */
const MobileModuleList = ({ allLessons, lessonId, slug, completedLessons, progress, onSelect }) => (
  <div>
    {/* Mini progress strip */}
    <div style={{ padding:'12px 16px 0', borderBottom:'1px solid #f1f5f9', background:'#fafbff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:12, fontWeight:800, color:'#64748b' }}>
          {completedLessons.length}/{allLessons.length} modules completed
        </span>
        <span style={{ fontSize:12, fontWeight:800, color:'#6366f1' }}>{progress}%</span>
      </div>
      <div style={{ height:4, background:'#e2e8f0', borderRadius:100, overflow:'hidden', marginBottom:12 }}>
        <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:100, transition:'width .5s' }} />
      </div>
    </div>
    {allLessons.map((l, i) => {
      const isActive = l._id === lessonId;
      const isDone   = completedLessons.includes(l._id);
      return (
        <Link
          key={l._id}
          to={`/courses/${slug}/lesson/${l._id}`}
          onClick={onSelect}
          style={{
            display:'flex', alignItems:'center', gap:12, padding:'13px 16px',
            borderBottom:'1px solid #f1f5f9', textDecoration:'none',
            background: isActive ? '#eef2ff' : '#fff',
            transition:'background .15s',
          }}
        >
          <div style={{
            width:28, height:28, borderRadius:'50%', flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:11, fontWeight:900,
            background: isDone ? '#22c55e' : isActive ? '#6366f1' : '#f1f5f9',
            color: isDone || isActive ? '#fff' : '#64748b',
            boxShadow: isActive ? '0 0 0 3px #e0e7ff' : 'none',
          }}>
            {isDone ? <Check size={12} /> : i + 1}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{
              fontSize:13, fontWeight: isActive ? 800 : 600,
              color: isActive ? '#4f46e5' : isDone ? '#94a3b8' : '#334155',
              lineHeight:1.4,
              textDecoration: isDone && !isActive ? 'line-through' : 'none',
            }}>
              {l.title.replace(/^\d+\.\s*/, '')}
            </div>
            {isActive && <div style={{ fontSize:11, color:'#818cf8', fontWeight:600, marginTop:2 }}>▶ Currently viewing</div>}
            {isDone && !isActive && <div style={{ fontSize:11, color:'#22c55e', fontWeight:600, marginTop:2 }}>✓ Completed</div>}
          </div>
        </Link>
      );
    })}
    <div style={{ padding:'12px 16px' }}>
      <Link
        to={`/courses/${slug}/quiz`}
        onClick={onSelect}
        style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          width:'100%', padding:'12px', borderRadius:12,
          background:'linear-gradient(135deg,#059669,#0d9488)', color:'#fff',
          fontWeight:800, fontSize:13, textDecoration:'none',
          boxShadow:'0 4px 14px rgba(5,150,105,.3)',
        }}
      >
        <GraduationCap size={15} /> Take Certification Exam
      </Link>
    </div>
  </div>
);

export default LessonView;
