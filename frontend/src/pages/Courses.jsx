import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, Loader2,
  ArrowRight, Sparkles, GraduationCap, Star
} from 'lucide-react';

// Deeper, more saturated colour themes for better contrast
const THEMES = {
  blue: { bar: 'from-indigo-600 to-blue-700',   iconBg: 'bg-indigo-100',  iconText: 'text-indigo-700',  link: 'text-indigo-700' },
  green: { bar: 'from-emerald-600 to-teal-700',  iconBg: 'bg-emerald-100', iconText: 'text-emerald-700', link: 'text-emerald-700' },
  pink: { bar: 'from-rose-600 to-pink-700',     iconBg: 'bg-rose-100',    iconText: 'text-rose-700',    link: 'text-rose-700' },
  orange: { bar: 'from-amber-500 to-orange-600',  iconBg: 'bg-amber-100',   iconText: 'text-amber-700',   link: 'text-amber-700' },
};

// Skeleton card
const Skeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
    <div className="h-1.5 bg-slate-200" />
    <div className="p-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-200 mb-5" />
      <div className="h-5 bg-slate-200 rounded-lg mb-2 w-4/5" />
      <div className="h-5 bg-slate-100 rounded-lg mb-4 w-3/5" />
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-100 rounded" />
        <div className="h-3.5 bg-slate-100 rounded w-11/12" />
        <div className="h-3.5 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="h-px bg-slate-100 mt-6 mb-4" />
      <div className="flex justify-between">
        <div className="h-3.5 w-20 bg-slate-100 rounded" />
        <div className="h-3.5 w-24 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/data/courses.json');
        if (!response.ok) throw new Error('Failed to load courses');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Explore Courses | SkillHub</title>
        <meta name="description" content="Browse courses on HTML, CSS, JavaScript and more. All free." />
      </Helmet>

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 overflow-hidden">
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '26px 26px' }} />
        {/* blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-28 relative z-10">
          {/* label */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <GraduationCap className="w-4 h-4 text-cyan-300" />
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">SkillHub Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Explore All{' '}
            <span className="relative inline-block">
              <span className="text-cyan-300">Courses</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6 Q100 2 198 6" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
              </svg>
            </span>
          </h1>
          <p className="text-indigo-100 text-lg font-medium max-w-2xl">
            Industry-leading curriculum designed to take you from absolute beginner to professional. All courses are <span className="text-white font-bold underline decoration-cyan-400">100% free</span>.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-bold">
                {loading ? '...' : `${courses.length} Courses`}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-white text-sm font-bold">Free Forever</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-cyan-300" />
              <span className="text-white text-sm font-bold">Self-Paced</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── COURSE GRID (overlaps hero) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-24 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold text-lg">No courses available yet.</p>
            <p className="text-slate-400 text-sm mt-1">Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const t = THEMES[course.theme] || THEMES.blue;
              return (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courses/${course.slug}`)}
                  className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* ── Image banner (if image set) ── */}
                  {course.image ? (
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.classList.add('fallback-bg'); }}
                      />
                      {/* dark gradient overlay so text is always readable */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      {/* Title overlaid on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-white text-lg font-extrabold leading-snug line-clamp-2 drop-shadow-sm">
                          {course.title}
                        </h2>
                      </div>
                    </div>
                  ) : (
                    /* ── No image: coloured strip + icon layout ── */
                    <div className={`h-1.5 bg-gradient-to-r ${t.bar} flex-shrink-0`} />
                  )}

                  {/* ── Card body ── */}
                  <div className="p-5 flex flex-col flex-1" style={{ minHeight: 180 }}>
                    {/* Icon + title row (only show icon when NO image) */}
                    {!course.image && (
                      <div className={`w-11 h-11 rounded-2xl ${t.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0 border border-black/5`}>
                        <BookOpen className={`w-5 h-5 ${t.iconText}`} />
                      </div>
                    )}

                    {/* Title (only shown here when NO image — otherwise it's on top of image) */}
                    {!course.image && (
                      <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-700 transition-colors duration-200 line-clamp-2">
                        {course.title}
                      </h2>
                    )}

                    {/* Description */}
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                      {course.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> Self-paced
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${t.link} group-hover:gap-2 transition-all duration-200`}>
                        View Course <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
