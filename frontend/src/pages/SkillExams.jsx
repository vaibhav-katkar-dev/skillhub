import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { getCourseListWithMeta } from '../data/courseLoader';
import { api, useAuthStore } from '../store/authStore';
import {
  Award, CheckCircle, Zap, ArrowRight, Loader2,
  ShieldCheck, Trophy, Target, BookOpen, AlertCircle,
  FileText, ChevronDown, ChevronUp, Book, Clock, Medal,
  GraduationCap, BarChart2, Layers, CheckSquare, Download
} from 'lucide-react';

/* ── Colour palette per domain keyword ─────────────────── */
const DOMAIN_COLORS = [
  { match: ['html'],         accent: '#e34c26', light: '#fff4f1', border: '#fecaca' },
  { match: ['css'],          accent: '#2965f1', light: '#eff6ff', border: '#bfdbfe' },
  { match: ['javascript','js'], accent: '#f0db4f', light: '#fffbeb', border: '#fde68a', text: '#92400e' },
  { match: ['python'],       accent: '#3776ab', light: '#eff6ff', border: '#bfdbfe' },
  { match: ['java'],         accent: '#5382a1', light: '#f0f9ff', border: '#bae6fd' },
  { match: ['c++','cpp'],    accent: '#00599c', light: '#eff6ff', border: '#bfdbfe' },
  { match: ['c program'],    accent: '#4a90d9', light: '#f0f9ff', border: '#bae6fd' },
  { match: ['ai','artificial'], accent: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe' },
  { match: ['react'],        accent: '#61dafb', light: '#ecfeff', border: '#a5f3fc', text: '#0e7490' },
  { match: ['node'],         accent: '#339933', light: '#f0fdf4', border: '#bbf7d0' },
  { match: ['sql','database'], accent: '#f59e0b', light: '#fffbeb', border: '#fde68a' },
];

function domainStyle(title = '') {
  const t = title.toLowerCase();
  const found = DOMAIN_COLORS.find(d => d.match.some(m => t.includes(m)));
  return found || { accent: '#6366f1', light: '#eef2ff', border: '#c7d2fe' };
}

/* ── Stat pill ──────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl border" style={{ background: color + '18', borderColor: color + '30' }}>
      <Icon size={18} style={{ color }} />
      <div>
        <div style={{ color }} className="text-xl font-black leading-none">{value}</div>
        <div className="text-[11px] text-slate-500 font-bold mt-0.5 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

/* ── Exam card ──────────────────────────────────────────── */
function ExamCard({ item, cert, isAuthenticated }) {
  const { course, lessonCount, lessonTitles } = item;
  const style = domainStyle(course.title);
  const hasCert = !!cert;
  const navigate = useNavigate();
  const [showSyllabus, setShowSyllabus] = useState(false);

  const handleExamClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${course.slug}/quiz` } });
      return;
    }
    navigate(`/courses/${course.slug}/quiz`);
  };

  return (
    <div 
      className="bg-white rounded-2xl flex flex-col relative group"
      style={{
        border: `2px solid ${hasCert ? '#10b981' : style.border}`,
        boxShadow: hasCert ? '0 4px 24px rgba(16,185,129,0.12)' : '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = hasCert ? '0 12px 40px rgba(16,185,129,0.2)' : '0 12px 40px rgba(99,102,241,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = hasCert ? '0 4px 24px rgba(16,185,129,0.12)' : '0 2px 12px rgba(0,0,0,0.04)';
      }}
    >
      {/* Certified Ribbon */}
      {hasCert && (
        <div className="absolute top-3.5 right-3.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
          <CheckCircle size={10} strokeWidth={3} /> Certified
        </div>
      )}

      {/* Header */}
      <div 
        className="px-6 py-5 border-b rounded-t-[14px]"
        style={{ 
          background: hasCert ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : style.light,
          borderColor: hasCert ? '#a7f3d0' : style.border
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ 
              background: hasCert ? '#10b981' : style.accent,
              boxShadow: `0 4px 12px ${hasCert ? '#10b981' : style.accent}40`
            }}
          >
            {hasCert ? <Trophy size={24} color="#fff" /> : <BookOpen size={24} color={style.text || '#fff'} />}
          </div>
          {/* Difficulty hint based on lesson count */}
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md"
            style={{
              background: lessonCount > 20 ? '#fef3c7' : lessonCount > 10 ? '#ede9fe' : '#f0fdf4',
              color:      lessonCount > 20 ? '#92400e'  : lessonCount > 10 ? '#5b21b6'  : '#14532d',
            }}
          >
            {lessonCount > 20 ? 'Advanced' : lessonCount > 10 ? 'Intermediate' : 'Beginner'}
          </span>
        </div>
        <h3 className="text-base font-black text-slate-900 leading-snug mb-1">{course.title}</h3>
        {course.tagline && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{course.tagline}</p>}

        {/* Exam spec pills */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: hasCert ? '#a7f3d0' : style.border }}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/70 px-2 py-1 rounded-md">
            <Layers size={11} className="text-slate-400" />
            {lessonCount} Topics
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/70 px-2 py-1 rounded-md">
            <BarChart2 size={11} className="text-slate-400" />
            70% to Pass
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/70 px-2 py-1 rounded-md">
            <GraduationCap size={11} className="text-slate-400" />
            MCQ Format
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/70 px-2 py-1 rounded-md">
            <Medal size={11} className="text-slate-400" />
            Instant Cert
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        
        {/* Verified badge row */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className={hasCert ? 'text-emerald-500' : 'text-indigo-400'} />
          <span className="text-xs font-bold" style={{ color: hasCert ? '#059669' : '#4338ca' }}>
            {hasCert ? 'Certificate verified & shareable' : 'Certificate is employer-verifiable'}
          </span>
        </div>

        {/* Syllabus / What's tested Toggle */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
          <button 
            onClick={() => setShowSyllabus(!showSyllabus)}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Book size={14} className="text-slate-400" /> 
              What's tested ({lessonCount} topics)
            </span>
            {showSyllabus ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {showSyllabus && (
            <div className="border-t border-slate-100 bg-white">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syllabus covered in this exam</p>
              </div>
              <ul className="p-4 space-y-2.5">
                {lessonTitles.map((title, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{title}</span>
                  </li>
                ))}
                {lessonCount > 6 && (
                  <li className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100">
                    <CheckSquare size={13} className="text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">{lessonCount - 6} more topics included in full exam</span>
                  </li>
                )}
              </ul>
              <div className="px-4 pb-3">
                <Link
                  to={`/courses/${course.slug}`}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  <BookOpen size={12} /> View full course & all lessons
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cert Link (if passed) */}
        {hasCert && cert?.certificateId && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Your Certificate ID</div>
            <div className="text-xs font-mono text-emerald-900 font-bold mb-2">{cert.certificateId}</div>
            <Link 
              to={`/verify/${cert.certificateId}`} 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View live verification <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & CTA */}
        {!hasCert ? (
          <div className="space-y-3">
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleExamClick}
                className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${style.accent}, ${style.accent}dd)`,
                  color: style.text || '#fff',
                  boxShadow: `0 4px 14px ${style.accent}40`
                }}
              >
                <Zap size={16} fill="currentColor" />
                {isAuthenticated ? 'Take Exam Now' : 'Login to Take Exam'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
            <button
              onClick={handleExamClick}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
            >
              <Download size={14} /> Download
            </button>
            <Link
              to={`/courses/${course.slug}`}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <FileText size={14} /> Read Course
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function SkillExams() {
  const { isAuthenticated } = useAuthStore();
  const [items, setItems] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getCourseListWithMeta()
      .then(list => {
        setItems(list);
      })
      .catch(() => setError('Failed to load domains.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/certificates/mine')
      .then(r => setCerts(r.data || []))
      .catch(() => {});
  }, [isAuthenticated]);

  const certifiedCount = items.filter(i =>
    certs.some(cert => (cert.course?._id || cert.course)?.toString() === i.course._id?.toString())
  ).length;

  const getCert = (courseId) =>
    certs.find(cert => (cert.course?._id || cert.course)?.toString() === courseId?.toString());

  const filtered = items.filter(i => {
    const hasCert = !!getCert(i.course._id);
    if (filter === 'certified') return hasCert;
    if (filter === 'available') return !hasCert;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Helmet>
        <title>Skill Exams — Validate Your Knowledge | SkillValix</title>
        <meta name="description" content="Take a direct certification exam for any skill domain. Prove your knowledge instantly with employer-verified certificates." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-slate-900 pt-20 pb-28 px-6 relative overflow-hidden text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Industry-Verified Certifications</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-[1.1] tracking-tight">
            Know it? Prove it.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              Get certified today.
            </span>
          </h1>
          
          <p className="text-slate-400 text-base md:text-lg mb-4 max-w-xl mx-auto leading-relaxed">
            Skip the lectures. Take a domain exam directly, score 70% or higher, and download a verifiable certificate—no waiting, no manual review.
          </p>
          <p className="text-slate-500 text-sm mb-12 max-w-lg mx-auto">
            Each exam tests real understanding across all syllabus topics. Expand any card below to preview exactly what will be assessed before you pay.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <StatPill icon={BookOpen} label="Exam Domains" value={items.length || '—'} color="#818cf8" />
            {isAuthenticated && <StatPill icon={Trophy} label="Certified" value={`${certifiedCount}/${items.length}`} color="#10b981" />}
            <StatPill icon={Target} label="Pass Mark" value="70%" color="#f59e0b" />
            <StatPill icon={Clock} label="Results" value="Instant" color="#06b6d4" />
          </div>
        </div>
      </div>

      {/* How It Works Strip */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-slate-100">
          {[
            { icon: Target,        step: '01', title: 'Pick a domain',        desc: 'Browse all certification exams below' },
            { icon: Book,          step: '02', title: 'Preview the syllabus', desc: 'Expand the card to see every topic tested' },
            { icon: GraduationCap, step: '03', title: 'Take the exam',        desc: 'MCQ — real questions, 70% pass threshold' },
            { icon: Medal,         step: '04', title: 'Download certificate', desc: 'Instant PDF, verifiable link, LinkedIn-ready' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 py-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <s.icon size={18} />
              </div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Step {s.step}</div>
              <div className="text-sm font-bold text-slate-800 mb-0.5">{s.title}</div>
              <div className="text-xs text-slate-500 leading-snug">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {filter === 'all' ? 'All Exam Domains' : filter === 'available' ? 'Available Exams' : 'Your Achievements'}
            </h2>
            <p className="text-slate-500 font-medium">Select a domain to view the syllabus and begin.</p>
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Domains', icon: BookOpen },
              { id: 'available', label: 'Available', icon: Zap },
              { id: 'certified', label: 'Certified', icon: Trophy }
            ].map(f => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 md:flex-none justify-center ${
                    active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <f.icon size={16} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guest Warning */}
        {!isAuthenticated && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-indigo-900 font-bold text-lg mb-1">Track your certifications</h3>
                <p className="text-indigo-700 text-sm">Create a free account to save your exam results and access your verified certificates forever.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link to="/login" className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm text-center transition-colors">
                Login
              </Link>
              <Link to="/register" className="flex-1 sm:flex-none px-6 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 font-bold rounded-xl text-sm text-center transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* States */}
        {loading && (
          <div className="py-20 flex flex-col items-center">
            <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Loading exam catalogue...</p>
          </div>
        )}

        {error && (
          <div className="py-20 flex flex-col items-center text-rose-500">
            <AlertCircle size={48} className="mb-4" />
            <p className="font-bold text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Target size={40} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No exams found</h3>
            <p className="text-slate-500 mb-8">
              {filter === 'certified' 
                ? "You haven't earned any certificates yet. Take an exam to get started!"
                : "You've conquered every available domain. Awesome job!"}
            </p>
            <button onClick={() => setFilter('all')} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
              View All Domains
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
                const cid = item.course._id?.toString() || item.course._id;
                const c = certs.find(ct => (ct.course?._id || ct.course)?.toString() === cid);
                return (
                  <ExamCard 
                    key={cid} 
                    item={item} 
                    cert={c} 
                    isAuthenticated={isAuthenticated} 
                  />
                );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
