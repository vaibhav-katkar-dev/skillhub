import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, Loader2,
  ArrowRight, Sparkles, GraduationCap, Star,
  Search, Filter, X, BriefcaseBusiness, Lock
} from 'lucide-react';
import { getCourseList, preloadCourses } from '../data/courseLoader';

// Deeper, more saturated colour themes for better contrast
const THEMES = {
  blue:   { bar: 'from-indigo-600 to-blue-700',   iconBg: 'bg-indigo-100',  iconText: 'text-indigo-700',  link: 'text-indigo-700' },
  green:  { bar: 'from-emerald-600 to-teal-700',  iconBg: 'bg-emerald-100', iconText: 'text-emerald-700', link: 'text-emerald-700' },
  pink:   { bar: 'from-rose-600 to-pink-700',     iconBg: 'bg-rose-100',    iconText: 'text-rose-700',    link: 'text-rose-700' },
  orange: { bar: 'from-amber-500 to-orange-600',  iconBg: 'bg-amber-100',   iconText: 'text-amber-700',   link: 'text-amber-700' },
};

// Category map based on title keywords
import { getCourseCategory, CATEGORY_KEYWORDS } from '../utils/course';

// Skeleton card
const Skeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
    <div className="h-1.5 bg-slate-200" />
    <div className="p-5">
      <div className="w-11 h-11 rounded-2xl bg-slate-200 mb-4" />
      <div className="h-5 bg-slate-200 rounded-lg mb-2 w-4/5" />
      <div className="h-4 bg-slate-100 rounded-lg mb-4 w-3/5" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded w-11/12" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="h-px bg-slate-100 mt-5 mb-3" />
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

const ALL_CATEGORIES = ['All', 'HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'AI / ML', 'Other'];

const Courses = () => {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode]   = useState('courses'); // 'courses' | 'simulations'
  const navigate = useNavigate();

  const isSims = viewMode === 'simulations';

  useEffect(() => {
    (async () => {
      try {
        const [courseData, simResponse] = await Promise.all([
          getCourseList(),
          fetch('/data/job-simulations.json')
        ]);
        const simsData = await simResponse.json();
        // job simulations have `id`, we should emulate course ids `_id: sim.id` so mapping works cleanly
        const mappedSims = simsData.map(s => ({ ...s, _id: s.id, isJobSimulation: true }));
        setCourses([...courseData, ...mappedSims]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = courses.filter(c => (isSims ? c.isJobSimulation : !c.isJobSimulation));
    if (!isSims && activeCategory !== 'All') {
      list = list.filter(c => getCourseCategory(c) === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const searchWords = q.split(/\s+/).filter(Boolean);
      list = list.filter(c => {
        const title = (c.title || '').toLowerCase();
        const desc = (c.description || '').toLowerCase();
        const cat = getCourseCategory(c).toLowerCase();
        const searchableText = `${title} ${desc} ${cat}`;
        
        // Match each word individually
        return searchWords.every(word => searchableText.includes(word));
      });
    }
    return list;
  }, [courses, search, activeCategory, isSims]);

  const clearFilters = () => { setSearch(''); setActiveCategory('All'); };

  const heroTheme = isSims
    ? {
        gradient: 'from-slate-950 via-indigo-950 to-cyan-900',
        blobA: 'bg-indigo-300/20',
        blobB: 'bg-cyan-300/20',
        accent: 'text-cyan-200',
        stroke: '#67e8f9',
        copy: 'text-slate-100/90',
        icon: 'text-cyan-200',
        underline: 'decoration-cyan-300',
      }
    : {
        gradient: 'from-slate-950 via-emerald-900 to-teal-900',
        blobA: 'bg-emerald-300/20',
        blobB: 'bg-teal-300/20',
        accent: 'text-emerald-200',
        stroke: '#6ee7b7',
        copy: 'text-emerald-100/90',
        icon: 'text-emerald-200',
        underline: 'decoration-emerald-300',
      };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Explore Courses | SkillValix</title>
        <meta name="description" content="Browse courses on HTML, CSS, JavaScript and more. All free." />
        <link rel="canonical" href="https://www.skillvalix.com/courses" />
      </Helmet>

      {/* ── HERO ── */}
      <div className={`relative bg-gradient-to-br ${heroTheme.gradient} overflow-hidden`}>
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '26px 26px' }} />
        {/* blobs */}
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full ${heroTheme.blobA} blur-3xl pointer-events-none`} />
        <div className={`absolute -bottom-16 -left-16 w-72 h-72 rounded-full ${heroTheme.blobB} blur-3xl pointer-events-none`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-32 relative z-10">
          {/* label */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <GraduationCap className={`w-4 h-4 ${heroTheme.icon}`} />
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">SkillValix Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Explore All{' '}
            <span className="relative inline-block">
              <span className={heroTheme.accent}>{isSims ? 'Job Simulations' : 'Courses'}</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6 Q100 2 198 6" stroke={heroTheme.stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
              </svg>
            </span>
          </h1>
          <p className={`${heroTheme.copy} text-lg font-medium max-w-2xl mb-7`}>
            {isSims 
              ? <>Job simulations are <span className="text-white font-bold">coming soon</span>. They stay visible here, but the launch flow is locked for now while we rebuild the CPU-heavy parts.</>
              : <>Industry-leading curriculum designed to take you from absolute beginner to professional. All courses are <span className={`text-white font-bold underline ${heroTheme.underline}`}>100% free</span>.</>}
          </p>

          <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-sm border border-white/20 w-fit mb-4">
            <button
              onClick={() => { setViewMode('courses'); clearFilters(); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                !isSims ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${!isSims ? 'text-indigo-600' : 'text-indigo-200'}`} />
              Free Courses
            </button>
            <button
              onClick={() => { setViewMode('simulations'); clearFilters(); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                 isSims ? 'bg-white text-indigo-700 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <BriefcaseBusiness className={`w-4 h-4 ${isSims ? 'text-indigo-600' : 'text-indigo-200'}`} />
              Job Simulations
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-bold">
                {loading ? '...' : `${courses.filter(c => (isSims ? c.isJobSimulation : !c.isJobSimulation)).length} ${isSims ? 'Simulations' : 'Courses'}`}
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

      {/* ── SEARCH + FILTER BAR (overlaps hero) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="course-search"
                type="text"
                placeholder="Search courses…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select (Hide if sim) */}
            {!isSims && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  id="course-category"
                  value={activeCategory}
                  onChange={e => setActiveCategory(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer"
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}
          </div>

          {/* Category Pills (Hide if sim) */}
          {!isSims && (
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-3 pb-1">
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── COURSE GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6 relative z-10">
        {/* Results count */}
        {!loading && (search || activeCategory !== 'All') && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm">
              Showing <strong className="text-slate-800">{filtered.length}</strong> of {courses.length} courses
              {activeCategory !== 'All' && <span> in <strong className="text-indigo-600">{activeCategory}</strong></span>}
              {search && <span> matching "<strong className="text-indigo-600">{search}</strong>"</span>}
            </p>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold text-lg">No courses found.</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search term or category.</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-indigo-600 font-semibold hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => {
              const t = THEMES[course.theme] || THEMES.blue;
              const isLockedSimulation = Boolean(course.isJobSimulation && course.comingSoon);
              const handleCardClick = () => {
                if (isLockedSimulation) return;
                navigate(course.isJobSimulation ? `/job-simulation/${course.slug}` : `/courses/${course.slug}`);
              };
              return (
                <div
                  key={course._id}
                  onClick={handleCardClick}
                  className={`group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md transition-all duration-300 flex flex-col ${
                    isLockedSimulation ? 'opacity-90 cursor-not-allowed' : 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
                  }`}
                >
                  {isLockedSimulation && (
                    <div className="absolute inset-0 z-10 bg-slate-950/10 backdrop-blur-[1px] pointer-events-none" />
                  )}
                  {/* ── Image banner (if image set) ── */}
                  {course.image ? (
                    <div className="relative h-40 overflow-hidden flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.classList.add('fallback-bg'); }}
                      />
                      {/* dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      {/* Category badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                          isLockedSimulation ? 'text-slate-700' : 'text-indigo-700'
                        }`}>
                          {isLockedSimulation ? <Lock className="w-3 h-3" /> : null}
                          {isLockedSimulation ? 'Coming Soon' : getCourseCategory(course)}
                        </span>
                      </div>
                      {/* Title overlaid on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-white text-base font-extrabold leading-snug line-clamp-2 drop-shadow-sm">
                          {course.title}
                        </h2>
                      </div>
                    </div>
                  ) : (
                    /* ── No image: coloured strip ── */
                    <div className={`relative h-1.5 bg-gradient-to-r ${t.bar} flex-shrink-0`}>
                      {isLockedSimulation && <div className="absolute inset-0 bg-slate-900/20" />}
                    </div>
                  )}

                  {/* ── Card body ── */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Icon + title row (only show when NO image) */}
                    {!course.image && (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl ${t.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0 border border-black/5`}>
                            <BookOpen className={`w-5 h-5 ${t.iconText}`} />
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${t.iconBg} ${isLockedSimulation ? 'text-slate-500' : t.iconText}`}>
                            {isLockedSimulation ? <Lock className="w-3 h-3" /> : null}
                            {isLockedSimulation ? 'Coming Soon' : getCourseCategory(course)}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-700 transition-colors duration-200 line-clamp-2">
                          {course.title}
                        </h2>
                      </>
                    )}

                    {/* Description */}
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-3">
                      {course.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {isSims ? course.duration || 'Self-paced' : 'Self-paced'}
                      </span>
                      {isLockedSimulation ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                          Locked <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${t.link} group-hover:gap-2 transition-all duration-200`}>
                          View {isSims ? 'Simulation' : 'Course'} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
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
