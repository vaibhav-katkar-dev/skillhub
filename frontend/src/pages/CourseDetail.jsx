import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug, getCourseList } from '../data/courseLoader';
import { getCourseCategory } from '../utils/course';
import { PlayCircle, ShieldCheck, ListTodo, Loader2, BookOpen, Clock, Award, Sparkles, Zap, ArrowRight } from 'lucide-react';

const THEMES = {
  blue: 'from-blue-600 to-indigo-700',
  green: 'from-emerald-600 to-teal-700',
  pink: 'from-rose-600 to-pink-700',
  orange: 'from-amber-600 to-orange-600',
};

const CourseDetail = () => {
  const { slug } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseBySlug(slug);
        if (!data) throw new Error('Not found');
        setCourseData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();

    const savedProgress = JSON.parse(localStorage.getItem('skillvalix_progress')) || {};
    if (savedProgress[slug]) {
      setCompletedLessons(savedProgress[slug]);
    }

    getCourseList()
      .then(all => {
        if (!all) return;
        const others = all.filter(c => c.slug !== slug && !c.isJobSimulation);
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 3));
      })
      .catch(console.error);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-slate-900">Course not found</h2>
        <Link to="/courses" className="text-blue-600 hover:text-blue-500 mt-4 inline-block font-medium">Return to Courses</Link>
      </div>
    );
  }

  const { course, lessons } = courseData;
  const themeClass = THEMES[course.theme] || THEMES.blue;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{course.title} | SkillValix</title>
        <meta name="description" content={course.description.substring(0, 155)} />
        <link rel="canonical" href={`https://www.skillvalix.com/courses/${slug}`} />
      </Helmet>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${themeClass} rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-white">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold tracking-wide backdrop-blur-sm">
            Course Module
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <ListTodo className="w-4 h-4 text-blue-200" /> {lessons.length} Modules
            </div>
            <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-orange-200" /> ~2 Hours
            </div>
            <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Certificate Included
            </div>
          </div>
        </div>

        {/* Progress Bar Override (Demo) */}
        <div className="relative z-10 mt-8 bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-white text-sm font-semibold">Your Progress</span>
            <span className="text-blue-200 text-sm font-bold">{Math.round((completedLessons.length / (lessons.length || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.round((completedLessons.length / (lessons.length || 1)) * 100)}%` }}></div>
          </div>
          <p className="text-white/70 text-xs mt-2 font-medium">{completedLessons.length} of {lessons.length} lessons completed</p>
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          Curriculum <span className="text-sm font-normal text-slate-500">({lessons.length} Modules)</span>
        </h2>
        <div className="space-y-4">
          {lessons.map((lesson, idx) => (
            <Link
              key={lesson._id}
              to={`/courses/${slug}/lesson/${lesson._id}`}
              className="group flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors mr-6 font-medium">
                {idx + 1}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h3>
              </div>
              <PlayCircle className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
            </Link>
          ))}
        </div>

        {/* ── Premium Exam CTA (Light / Gold Theme) ─────────── */}
        <style>{`
          @keyframes goldShimmer {
            0%   { background-position: 200% center }
            100% { background-position: -200% center }
          }
          @keyframes goldBorderSweep {
            0%,100% { opacity: 0.5 }
            50%      { opacity: 1 }
          }
          @keyframes goldFloat {
            0%,100% { transform: translateY(0px) rotate(0deg) }
            50%     { transform: translateY(-5px) rotate(10deg) }
          }
          @keyframes goldBtnShine {
            0%   { background-position: -200% center }
            100% { background-position: 200% center }
          }
          @keyframes softPing {
            0%       { transform:scale(1); opacity:.6 }
            75%,100% { transform:scale(2); opacity:0 }
          }
          .exam-gold-txt {
            background: linear-gradient(90deg, #b45309, #d97706, #f59e0b, #fbbf24, #d97706, #b45309);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: goldShimmer 4s linear infinite;
          }
          .exam-gold-btn {
            background: linear-gradient(100deg, #f59e0b 0%, #fbbf24 30%, #fff8e7 50%, #fbbf24 70%, #f59e0b 100%);
            background-size: 220% auto;
            animation: goldBtnShine 3s linear infinite;
            transition: transform .2s ease, box-shadow .2s ease;
          }
          .exam-gold-btn:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 8px 28px rgba(245,158,11,0.40);
          }
        `}</style>

        <div
          style={{
            marginTop: 40,
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            background: '#fffdf5',
            border: '1.5px solid #fde68a',
            boxShadow: '0 4px 32px rgba(245,158,11,0.10), 0 1px 6px rgba(0,0,0,0.05)',
            padding: '36px 32px',
          }}
        >
          {/* Soft gold ambient wash */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 110%, rgba(253,230,138,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Subtle dot pattern */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.12) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

          {/* Floating sparkle icons */}
          <div style={{ position: 'absolute', top: 18, right: 22, animation: 'goldFloat 4s ease-in-out infinite', pointerEvents: 'none' }}>
            <Sparkles style={{ color: '#fbbf24', width: 20, height: 20, opacity: 0.7 }} />
          </div>
          <div style={{ position: 'absolute', bottom: 18, right: 64, animation: 'goldFloat 6s ease-in-out infinite 1.5s', pointerEvents: 'none' }}>
            <Award style={{ color: '#d97706', width: 17, height: 17, opacity: 0.5 }} />
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ position: 'relative', display: 'flex', width: 7, height: 7 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#f59e0b', animation: 'softPing 2.4s ease-out infinite' }} />
                <span style={{ position: 'relative', width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'block' }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#92400e', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Certification Exam</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
              {/* Left: text */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, color: '#1e293b', lineHeight: 1.15, marginBottom: 10 }}>
                  Ready to get{' '}
                  <span className="exam-gold-txt">certified?</span>
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, maxWidth: 440, marginBottom: 18 }}>
                  All lessons are free to learn at your own pace. If you already know the skill, you can also take the exam directly and get certified quickly.
                </p>

                {/* Trust badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
                  {[
                    { icon: BookOpen, text: 'Lessons free to learn', color: '#2563eb' },
                    { icon: Zap, text: 'Direct exam allowed', color: '#d97706' },
                    { icon: ShieldCheck, text: 'Tamper-proof certificate', color: '#059669' },
                    { icon: Award, text: 'Unique verification ID', color: '#7c3aed' },
                    { icon: Award, text: 'Instant PDF certificate', color: '#059669' },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 500, color: '#64748b' }}>
                      <Icon style={{ width: 14, height: 14, color, flexShrink: 0 }} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Link
                  to={`/courses/${slug}/quiz`}
                  id="take-exam-cta"
                  className="exam-gold-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    color: '#78350f', fontWeight: 800, fontSize: 15,
                    padding: '15px 32px', borderRadius: 14,
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(245,158,11,0.25)',
                  }}
                >
                  <Award style={{ width: 18, height: 18 }} />
                  Take Exam →
                </Link>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>No time limit · click to attempt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/courses', title: 'Back to Courses', copy: 'Browse the full course library again.' },
            { to: '/free-courses', title: 'Free Courses Hub', copy: 'See the top starting points for beginners.' },
            { to: '/certification', title: 'Certification', copy: 'Understand the certificate path before you take the exam.' },
            { to: '/verify', title: 'Verify a Certificate', copy: 'Check how public certificate verification works.' },
            { to: '/hackathons', title: 'Hackathons', copy: 'Put your skills into real project challenges.' },
            { to: '/blog', title: 'Learning Blog', copy: 'Read supporting tutorials and roadmaps.' },
          ].map(({ to, title, copy }) => (
            <Link
              key={to}
              to={to}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">{title}</div>
              <p className="text-sm text-slate-500 leading-relaxed mb-0">{copy}</p>
            </Link>
          ))}
        </div>

        {/* ── Recommendations ── */}
        {recommended.length > 0 && (
          <div className="mt-16 pt-12 border-t-2 border-dashed border-slate-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">You can also try these related courses</h2>
                <p className="text-sm text-slate-500 font-medium">Picked at random just for you</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommended.map(rec => {
                const recCat = getCourseCategory(rec);
                const themeColor = rec.theme === 'pink' ? '#ec4899' : rec.theme === 'green' ? '#22c55e' : rec.theme === 'orange' ? '#f97316' : '#6366f1';
                const themeBg = rec.theme === 'pink' ? '#fdf2f8' : rec.theme === 'green' ? '#f0fdf4' : rec.theme === 'orange' ? '#fff7ed' : '#eef2ff';
                
                return (
                  <Link key={rec.slug} to={`/courses/${rec.slug}`} className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:border-blue-300 flex flex-col gap-4 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <BookOpen className="w-16 h-16" />
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white/50" style={{ backgroundColor: themeBg, color: themeColor }}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">{recCat}</span>
                      <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{rec.title}</h3>
                    </div>
                    <div className="mt-auto flex items-center gap-2 text-xs font-black text-blue-600">
                      EXPLORE COURSE <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
