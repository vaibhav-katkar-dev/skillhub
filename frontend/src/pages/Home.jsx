import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Award, BookOpen, BrainCircuit, ArrowRight, CheckCircle2,
  ChevronDown, Code2, Layers, ShieldCheck, Star, Users, Zap,
  Play, GraduationCap, Trophy, Clock, Sparkles,
  Target, Rocket, ChevronRight, Globe
} from 'lucide-react';

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */

const STATS = [
  { value: 2800, suffix: '+', label: 'Students Enrolled', icon: Users,  color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { value: 12,   suffix: '+', label: 'Course Modules',    icon: Layers, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { value: 98,   suffix: '%', label: 'Completion Rate',   icon: Trophy, color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { value: 100,  suffix: '%', label: 'Free to Learn',     icon: Zap,    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
];

const HOW_IT_WORKS = [
  { step: 1, label: '01', title: 'Pick a Course',         desc: 'Browse our growing library of structured web development courses — all completely free.',    icon: BookOpen,    accent: '#6366f1', light: '#eef2ff' },
  { step: 2, label: '02', title: 'Study the Lessons',     desc: 'Work through interactive, code-rich modules at your own pace. No deadlines, no pressure.',    icon: Play,        accent: '#8b5cf6', light: '#f5f3ff' },
  { step: 3, label: '03', title: 'Take the Exam',         desc: "When you're ready, sit the assessment. Questions are server-graded to keep results secure.",   icon: BrainCircuit,accent: '#a855f7', light: '#faf5ff' },
  { step: 4, label: '04', title: 'Earn Your Certificate', desc: 'Pass and instantly download your verifiable PDF certificate to share with the world.',         icon: Award,       accent: '#10b981', light: '#ecfdf5' },
];

const COURSES = [
  {
    slug: 'ultimate-html-masterclass',
    title: 'HTML Masterclass',
    level: 'Beginner',
    duration: '4 hrs',
    modules: 12,
    rating: 4.9,
    badge: 'Most Popular',
    badgeColor: '#6366f1',
    tags: ['HTML5', 'Semantics', 'Forms', 'SEO'],
    desc: 'A complete deep-dive into modern HTML — from document structure to semantic tags, accessibility and forms.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=500',
    accent: '#6366f1',
    accentLight: '#eef2ff',
    accentBorder: '#c7d2fe',
  },
  {
    slug: 'css-for-beginners-learn-web-styling-zero-to-pro',
    title: 'CSS Fundamentals',
    level: 'Beginner',
    duration: '5 hrs',
    modules: 10,
    rating: 4.8,
    badge: 'Trending',
    badgeColor: '#0ea5e9',
    tags: ['CSS3', 'Flexbox', 'Grid', 'Animations'],
    desc: 'Master styling from the ground up — cascade, specificity, Flexbox, Grid, and CSS animations.',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800&h=500',
    accent: '#0ea5e9',
    accentLight: '#f0f9ff',
    accentBorder: '#bae6fd',
  },
  {
    slug: 'ultimate-javascript-masterclass',
    title: 'JavaScript Basics',
    level: 'Beginner',
    duration: '6 hrs',
    modules: 14,
    rating: 4.9,
    badge: 'New',
    badgeColor: '#f59e0b',
    tags: ['ES6+', 'DOM', 'Events', 'APIs'],
    desc: 'Learn the language of the web — variables, functions, DOM manipulation, and async JavaScript.',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800&h=500',
    accent: '#f59e0b',
    accentLight: '#fffbeb',
    accentBorder: '#fde68a',
  },
];

const FEATURES = [
  { icon: BookOpen,     bg: '#eff6ff', color: '#3b82f6', title: 'Structured Learning Paths',  desc: 'Content built in clear progression — from fundamentals to advanced mastery.' },
  { icon: BrainCircuit, bg: '#f5f3ff', color: '#7c3aed', title: 'Interactive Exams',          desc: 'Server-graded assessments with instant feedback to solidify your understanding.' },
  { icon: Award,        bg: '#ecfdf5', color: '#059669', title: 'Verifiable Certificates',    desc: 'Pass the exam, earn a secure PDF certificate with a unique trackable ID.' },
  { icon: Code2,        bg: '#fff1f2', color: '#e11d48', title: 'Real-World Code Snippets',   desc: 'Annotated, live code examples you can copy, adapt, and run immediately.' },
  { icon: ShieldCheck,  bg: '#fffbeb', color: '#d97706', title: 'Secure & Private',           desc: 'Your progress and certificates are stored securely. We never sell your data.' },
  { icon: GraduationCap,bg:'#f0f9ff', color: '#0284c7', title: 'Beginner Friendly',          desc: 'Zero prerequisites. Every concept explained from scratch with zero jargon.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  role: 'Frontend Developer',      initials: 'PS', grad: 'from-indigo-500 to-violet-600',  body: "SkillValix's HTML course is the clearest resource I've found online. Finished it in a weekend and the certificate added real credibility to my portfolio." },
  { name: 'James Okonkwo', role: 'CS Student',              initials: 'JO', grad: 'from-sky-500 to-blue-600',      body: "The exams genuinely test your knowledge, not just memorization. I felt confident in interviews knowing I really understood the material." },
  { name: 'Ayesha Khan',   role: 'Career Switcher',         initials: 'AK', grad: 'from-emerald-500 to-teal-600',  body: "100% free and yet the quality is higher than paid platforms I've tried. The step-by-step structure made switching careers actually feel possible." },
];

const FAQS = [
  { q: 'Is SkillValix really free?',              a: 'Yes — completely. Every course, every exam, every certificate is free. No hidden fees, no premium tiers. We believe education should be accessible to everyone.' },
  { q: 'How are the certificates verified?',    a: 'Each certificate has a unique ID. Anyone can visit our Verify page, enter that ID and see your full result and completion date in seconds.' },
  { q: 'Do I need prior experience to start?',  a: 'Not at all. Every course starts from zero and assumes no prior knowledge. If you can browse the web, you can start learning with us.' },
  { q: 'Can I learn at my own pace?',           a: 'Absolutely. There are no deadlines, cohorts, or time limits. Start a lesson, pause, continue tomorrow — your progress is always saved.' },
  { q: 'How difficult are the exams?',          a: "Challenging but fair. Each question links directly to lesson content, so thorough study leads to a confident pass. You can retake them too." },
];

/* ─────────────────────────────────────
   HOOKS
───────────────────────────────────── */

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, opts);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────── */

function Pill({ children, color = '#6366f1', bg = '#eef2ff', border = '#c7d2fe' }) {
  return (
    <span style={{ color, background: bg, border: `1px solid ${border}`, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '5px 14px', borderRadius: 100, display: 'inline-block' }}>
      {children}
    </span>
  );
}

function SectionHeader({ pill, pillColor, pillBg, pillBorder, title, subtitle, align = 'center' }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? 640 : '100%', margin: align === 'center' ? '0 auto 56px' : '0 0 48px' }}>
      <Pill color={pillColor} bg={pillBg} border={pillBorder}>{pill}</Pill>
      <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: 16, marginBottom: subtitle ? 14 : 0 }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function StatCard({ s, start }) {
  const count = useCountUp(s.value, 2000, start);
  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${s.border}`,
      borderRadius: 20,
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      boxShadow: `0 4px 24px ${s.color}18`,
      transition: 'transform .3s ease, box-shadow .3s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${s.color}28`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 24px ${s.color}18`; }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, border: `1.5px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <s.icon size={22} style={{ color: s.color }} />
      </div>
      <div style={{ fontSize: 38, fontWeight: 900, color: s.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
        {count}<span style={{ fontSize: 22, fontWeight: 700, opacity: 0.6 }}>{s.suffix}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{s.label}</div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: '#fff',
        border: `1.5px solid ${open ? '#6366f1' : '#e2e8f0'}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: open ? '0 4px 24px rgba(99,102,241,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'all .25s ease',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 28px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: open ? '#4f46e5' : '#1e293b', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
          background: open ? '#6366f1' : '#f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .25s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
        }}>
          <ChevronDown size={16} style={{ color: open ? '#fff' : '#64748b' }} />
        </span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s ease, opacity .3s ease', opacity: open ? 1 : 0 }}>
        <p style={{ padding: '0 28px 20px', margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   PAGE
───────────────────────────────────── */

export default function Home() {
  const [statsRef, statsInView] = useInView({ threshold: 0.2 });

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#f8faff', color: '#0f172a', overflowX: 'hidden' }}>
      <Helmet>
        {/* ── Primary SEO ─────────────────────────────────── */}
        <title>SkillValix — Free Online Coding Courses with Certificates | Learn HTML, CSS, JavaScript, Python & More</title>
        <meta name="description" content="Learn to code 100% FREE — no credit card, no hidden fees, ever. SkillValix offers structured courses in HTML, CSS, JavaScript, Python, Java &amp; AI with verifiable certificates. Join 2,800+ students already building their careers online. Start today!" />
        <meta name="keywords" content="free online coding courses, free web development course, learn HTML free, learn CSS free, learn JavaScript free, Python for beginners free, free programming courses India, coding courses with certificates, learn to code for free, web development for beginners, best free coding website, free HTML CSS JavaScript course, online learning platform India, programming certificate online free, learn AI machine learning free, free computer science courses, free tech courses 2026, programming for students free, software development course free, SkillValix, skillvalix.com" />
        <link rel="canonical" href="https://www.skillvalix.com/" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="SkillValix" />
        <meta name="rating" content="general" />

        {/* ── Open Graph (Facebook / LinkedIn / WhatsApp) ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.skillvalix.com/" />
        <meta property="og:site_name" content="SkillValix" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:title" content="SkillValix — Free Coding Courses with Certificates | HTML, CSS, JS, Python, AI" />
        <meta property="og:description" content="Learn in-demand tech skills 100% free. SkillValix offers structured beginner-to-pro courses with real exam assessments and verifiable PDF certificates. No credit card. No paywall. Ever." />
        <meta property="og:image" content="https://www.skillvalix.com/og-home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SkillValix — Free Online Coding Courses with Certificates" />

        {/* ── Twitter Card ─────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SkillValix" />
        <meta name="twitter:creator" content="@SkillValix" />
        <meta name="twitter:title" content="SkillValix — Free Coding Courses with Certificates" />
        <meta name="twitter:description" content="Master HTML, CSS, JavaScript, Python, Java & AI for free. Get verifiable certificates and boost your career — no credit card needed." />
        <meta name="twitter:image" content="https://www.skillvalix.com/og-home.png" />

        {/* ── JSON-LD: WebSite + Sitelinks Search Box ─────── */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "SkillValix",
          "url": "https://www.skillvalix.com",
          "description": "Free online coding courses with certificates. Learn HTML, CSS, JavaScript, Python, Java and AI for free.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.skillvalix.com/courses?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        })}</script>

        {/* ── JSON-LD: Organization ────────────────────────── */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SkillValix",
          "url": "https://www.skillvalix.com",
          "logo": "https://www.skillvalix.com/logo.svg",
          "sameAs": [
            "https://www.linkedin.com/company/skillvalix",
            "https://twitter.com/skillvalix"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "availableLanguage": ["English", "Hindi"]
          }
        })}</script>

        {/* ── JSON-LD: EducationalOrganization ─────────────── */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "SkillValix",
          "url": "https://www.skillvalix.com",
          "description": "SkillValix is a 100% free online learning platform offering structured web development and programming courses with verifiable certificates.",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Free Online Coding Courses",
            "itemListElement": [
              { "@type": "Course", "name": "Ultimate HTML Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-html-masterclass", "isAccessibleForFree": true },
              { "@type": "Course", "name": "CSS for Beginners — Zero to Pro", "url": "https://www.skillvalix.com/courses/css-for-beginners-learn-web-styling-zero-to-pro", "isAccessibleForFree": true },
              { "@type": "Course", "name": "Ultimate JavaScript Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-javascript-masterclass", "isAccessibleForFree": true },
              { "@type": "Course", "name": "Ultimate Python Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-python-masterclass", "isAccessibleForFree": true },
              { "@type": "Course", "name": "Ultimate Java Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-java-masterclass", "isAccessibleForFree": true },
              { "@type": "Course", "name": "AI & Machine Learning Fundamentals", "url": "https://www.skillvalix.com/courses/basics-of-artificial-intelligence-beginners", "isAccessibleForFree": true }
            ]
          }
        })}</script>

        {/* ── Fonts ────────────────────────────────────────── */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes floatA { 0%,100%{transform:translate(0,0)} 40%{transform:translate(20px,-28px)} 70%{transform:translate(-10px,14px)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 40%{transform:translate(-22px,22px)} 70%{transform:translate(14px,-12px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping { 0%{transform:scale(1);opacity:.8} 75%,100%{transform:scale(2);opacity:0} }

        .anim-fadeUp { animation: fadeUp .7s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .hero-grad {
          background: linear-gradient(135deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover { transition: transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s ease !important; }
        .card-hover:hover { transform: translateY(-6px) !important; }
        .hero-grid {
          background-image:
            linear-gradient(rgba(99,102,241,.07) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,102,241,.07) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .section-divider { border-top: 1.5px solid #e2e8f0; }
        .feature-card:hover { border-color: #a5b4fc !important; box-shadow: 0 8px 32px rgba(99,102,241,0.12) !important; }
        .course-card:hover { border-color: var(--accent-border) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.10) !important; }
        .course-card:hover .card-cta { background: var(--accent-color) !important; color: #fff !important; }
        .course-card .card-cta { transition: all .25s ease; }
        .course-img { transition: transform .7s ease; }
        .course-card:hover .course-img { transform: scale(1.07); }
        .step-card:hover { border-color: var(--step-accent) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; }
        .ping-ring::before { content:''; display:block; position:absolute; inset:0; border-radius:50%; background:inherit; animation: ping 2s ease-out infinite; }
        .trust-item { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:#475569; }

        @media (min-width:768px) {
          .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
          .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
          .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
          .grid-2-3 { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
        }
        @media (min-width:1024px) {
          .grid-2-3 { grid-template-columns:repeat(3,1fr); }
        }

        .section-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        @media(min-width:1280px) { .section-wrap { padding: 0 48px; } }
      `}</style>

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <section style={{ position:'relative', background:'#f8faff', minHeight:'92vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:100, paddingBottom:80, overflow:'hidden' }}>
        {/* Ambient blobs — softer, more asymmetric */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'rgba(99,102,241,0.09)', filter:'blur(100px)', top:'-10%', left:'-10%', animation:'floatA 14s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:480, height:480, borderRadius:'50%', background:'rgba(168,85,247,0.07)', filter:'blur(100px)', bottom:'0%', right:'-8%', animation:'floatB 16s ease-in-out infinite', pointerEvents:'none' }} />

        {/* Grid */}
        <div className="hero-grid" style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
        {/* Radial vignette */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #f8faff 100%)', pointerEvents:'none' }} />

        <div className="section-wrap" style={{ position:'relative', zIndex:10, textAlign:'center' }}>

          {/* Badge — feels hand-crafted, not AI */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #e0e7ff', borderRadius:100, padding:'7px 18px', marginBottom:32, boxShadow:'0 2px 12px rgba(99,102,241,0.10)' }}>
            <span style={{ position:'relative', display:'flex', width:8, height:8 }}>
              <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#10b981', animation:'ping 2s ease-out infinite', opacity:.7 }} />
              <span style={{ position:'relative', width:8, height:8, borderRadius:'50%', background:'#10b981', display:'block' }} />
            </span>
            <span style={{ fontSize:12, fontWeight:700, color:'#4f46e5', letterSpacing:'0.05em' }}>Free · No sign-up fees · No paywalls</span>
          </div>

          {/* Headline — human, direct, broader scope */}
          <h1 style={{ fontSize:'clamp(2.6rem,7.5vw,5rem)', fontWeight:900, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:20 }}>
            <span style={{ display:'block', color:'#0f172a' }}>Gain New Skills.</span>
            <span style={{ display:'block', color:'#0f172a' }}>Earn Credentials.</span>
            <span className="shimmer-text" style={{ display:'block' }}>Stand Out.</span>
          </h1>

          {/* Subtext — genuine growth focus */}
          <p style={{ fontSize:'clamp(1rem,2.2vw,1.15rem)', color:'#64748b', maxWidth:520, margin:'0 auto 36px', lineHeight:1.8 }}>
            Master new abilities through our structured, 100% free learning courses. 
            Finish a module, pass the exam, and walk away with a&nbsp;
            <strong style={{ color:'#4f46e5', fontWeight:700 }}>verified certificate</strong>&nbsp;you can proudly showcase.
          </p>

          {/* Buttons */}
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:14, marginBottom:44 }}>
            <Link to="/courses" id="hero-cta-start" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color:'#fff', fontWeight:700, fontSize:15,
              padding:'15px 32px', borderRadius:12, textDecoration:'none',
              boxShadow:'0 4px 20px rgba(79,70,229,0.35)',
              transition:'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(79,70,229,0.45)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 20px rgba(79,70,229,0.35)';}}
            >
              <Rocket size={17} />
              Browse Courses
              <ArrowRight size={17} />
            </Link>
            <Link to="/verify" id="hero-cta-verify" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'#fff', color:'#374151', fontWeight:600, fontSize:15,
              padding:'14px 28px', borderRadius:12, textDecoration:'none',
              border:'1.5px solid #e0e7ff',
              boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
              transition:'all .2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#6366f1';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#e0e7ff';e.currentTarget.style.transform='';}}
            >
              <ShieldCheck size={17} style={{ color:'#10b981' }} />
              Verify a Certificate
            </Link>
          </div>

          {/* Social proof strip — numbers feel real */}
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:'10px 28px' }}>
            {[
              { icon: CheckCircle2, text: '2,800+ students enrolled', color: '#10b981' },
              { icon: Award,        text: 'Free forever — no card needed', color: '#6366f1' },
              { icon: Star,         text: '4.9 avg course rating', color: '#f59e0b' },
            ].map(({ icon: Icon, text, color }, i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:500, color:'#64748b' }}>
                <Icon size={15} style={{ color, flexShrink:0 }} />{text}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(to bottom,transparent,#f8faff)', pointerEvents:'none' }} />
      </section>

      {/* ══════════════════════════
          STATS
      ══════════════════════════ */}
      <section ref={statsRef} style={{ background:'#fff', padding:'72px 0' }} className="section-divider">
        <div className="section-wrap">
          <div className="grid-4" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
            {STATS.map(s => <StatCard key={s.label} s={s} start={statsInView} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          MARQUEE
      ══════════════════════════ */}
      <div style={{ background:'#f1f5f9', borderTop:'1px solid #e2e8f0', borderBottom:'1px solid #e2e8f0', padding:'18px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', width:'max-content', animation:'marqueeScroll 22s linear infinite' }}>
          {[...Array(4)].flatMap(() => ['HTML5','✦','CSS3','✦','JavaScript','✦','React','✦','Node.js','✦','Git','✦']).map((item,i) => (
            <span key={i} style={{ marginRight:28, fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color: item==='✦' ? '#c7d2fe' : '#94a3b8' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════
          HOW IT WORKS
      ══════════════════════════ */}
      <section style={{ background:'#fff', padding:'96px 0' }} className="section-divider">
        <div className="section-wrap">
          <SectionHeader
            pill="The Process"
            pillColor="#4f46e5" pillBg="#eef2ff" pillBorder="#c7d2fe"
            title={<>From zero to <span className="shimmer-text">certified dev</span>.</>}
            subtitle="Four simple steps. No prior experience required. Start today."
          />

          {/* Step cards - horizontal on desktop */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, position:'relative' }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div
                key={s.label}
                className="step-card card-hover"
                style={{
                  '--step-accent': s.accent,
                  background:'#fff',
                  border:'1.5px solid #e2e8f0',
                  borderRadius:20,
                  padding:'32px 28px',
                  position:'relative',
                  overflow:'hidden',
                  boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
                }}
              >
                {/* Ghost number */}
                <div style={{ position:'absolute', right:-8, top:-8, fontSize:100, fontWeight:900, lineHeight:1, color:`${s.accent}08`, userSelect:'none', pointerEvents:'none' }}>
                  {s.label}
                </div>

                {/* Step label */}
                <div style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color:s.accent, marginBottom:20 }}>
                  Step {s.label}
                </div>

                {/* Icon */}
                <div style={{ width:52, height:52, borderRadius:14, background:s.light, border:`1.5px solid ${s.accent}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <s.icon size={24} style={{ color:s.accent }} />
                </div>

                <h3 style={{ fontSize:18, fontWeight:800, color:'#1e293b', marginBottom:10, lineHeight:1.3 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.75, margin:0 }}>{s.desc}</p>

                {/* Arrow connector (all but last) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{ display:'none' }} className="step-arrow">
                    <ChevronRight size={20} style={{ color:'#cbd5e1' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          COURSES
      ══════════════════════════ */}
      <section style={{ background:'#f8faff', padding:'96px 0' }} className="section-divider">
        <div className="section-wrap">
          {/* Header row */}
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:52 }}>
            <div>
              <Pill color="#059669" bg="#ecfdf5" border="#a7f3d0">Curriculum</Pill>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#0f172a', lineHeight:1.1, marginTop:14, marginBottom:0 }}>
                Premium courses,<br />
                <span style={{ color:'#cbd5e1' }}>zero cost.</span>
              </h2>
            </div>
            <div style={{ display:'flex', gap: 12 }}>
              <Link to="/blog" id="home-view-blog" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                fontSize:14, fontWeight:700, color:'#475569',
                background:'#f8fafc', border:'1.5px solid #e2e8f0',
                padding:'12px 24px', borderRadius:12, textDecoration:'none',
                transition:'all .2s', whiteSpace:'nowrap',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#f1f5f9';e.currentTarget.style.borderColor='#cbd5e1';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#f8fafc';e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.transform='';}}
              >
                Read our Blog
              </Link>
              <Link to="/courses" id="courses-view-all" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                fontSize:14, fontWeight:700, color:'#4f46e5',
                background:'#fff', border:'1.5px solid #c7d2fe',
                padding:'12px 24px', borderRadius:12, textDecoration:'none',
                boxShadow:'0 2px 8px rgba(99,102,241,0.08)',
                transition:'all .2s', whiteSpace:'nowrap',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='#eef2ff';e.currentTarget.style.borderColor='#6366f1';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor='#c7d2fe';e.currentTarget.style.transform='';}}
              >
                Explore All Courses <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Course grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:28 }}>
            {COURSES.map(c => (
              <Link
                key={c.slug}
                to={`/courses/${c.slug}`}
                id={`course-card-${c.slug}`}
                className="course-card card-hover"
                style={{
                  '--accent-color': c.accent,
                  '--accent-border': c.accentBorder,
                  display:'flex', flexDirection:'column',
                  background:'#fff',
                  border:`1.5px solid #e2e8f0`,
                  borderRadius:20,
                  overflow:'hidden',
                  textDecoration:'none',
                  boxShadow:'0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                {/* Image */}
                <div style={{ position:'relative', height:200, overflow:'hidden', background:'#f1f5f9' }}>
                  <img
                    src={c.image}
                    alt={c.title}
                    className="course-img"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                    onError={e => { e.target.style.display='none'; }}
                  />
                  {/* Gradient overlay at bottom of image */}
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(255,255,255,0.95),transparent)' }} />
                  {/* Badge */}
                  <span style={{
                    position:'absolute', top:16, left:16,
                    background:c.badgeColor, color:'#fff',
                    fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em',
                    padding:'5px 14px', borderRadius:100,
                    boxShadow:`0 4px 12px ${c.badgeColor}60`,
                  }}>{c.badge}</span>
                </div>

                {/* Body */}
                <div style={{ display:'flex', flexDirection:'column', flex:1, padding:'24px 28px 28px' }}>
                  {/* Tags */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                    {c.tags.map(t => (
                      <span key={t} style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', padding:'3px 10px', borderRadius:100, background:c.accentLight, color:c.accent, border:`1px solid ${c.accentBorder}` }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3 style={{ fontSize:20, fontWeight:900, color:'#0f172a', marginBottom:10, lineHeight:1.3 }}>{c.title}</h3>
                  <p style={{ fontSize:14, color:'#64748b', lineHeight:1.75, flex:1, marginBottom:20 }}>{c.desc}</p>

                  {/* Meta */}
                  <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:12, fontWeight:600, color:'#94a3b8', paddingTop:16, borderTop:'1px solid #f1f5f9', marginBottom:18 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:5 }}><Clock size={14} /> {c.duration}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:5 }}><Layers size={14} /> {c.modules} modules</span>
                    <span style={{ display:'flex', alignItems:'center', gap:5, marginLeft:'auto' }}><Star size={14} style={{ color:'#f59e0b', fill:'#f59e0b' }} /> {c.rating}</span>
                  </div>

                  {/* CTA bar */}
                  <div
                    className="card-cta"
                    style={{
                      width:'100%', padding:'13px 0', borderRadius:12,
                      background:c.accentLight, color:c.accent,
                      fontSize:14, fontWeight:700, textAlign:'center',
                      border:`1px solid ${c.accentBorder}`,
                    }}
                  >
                    View Course Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          FEATURES
      ══════════════════════════ */}
      <section style={{ background:'#fff', padding:'96px 0' }} className="section-divider">
        <div className="section-wrap">
          <SectionHeader
            pill="Why SkillValix"
            pillColor="#7c3aed" pillBg="#f5f3ff" pillBorder="#ddd6fe"
            title={<>Built for <span className="shimmer-text">real learning.</span></>}
            subtitle="Every feature is designed to maximise your growth as a developer."
          />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                id={`feature-${i}`}
                className="feature-card card-hover"
                style={{
                  background:'#fff',
                  border:'1.5px solid #e2e8f0',
                  borderRadius:20,
                  padding:'32px 28px',
                  boxShadow:'0 2px 12px rgba(0,0,0,0.04)',
                  transition:'all .3s ease',
                }}
              >
                <div style={{ width:52, height:52, borderRadius:14, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <f.icon size={24} style={{ color:f.color }} />
                </div>
                <h3 style={{ fontSize:17, fontWeight:800, color:'#1e293b', marginBottom:10, lineHeight:1.3 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.75, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          TESTIMONIALS
      ══════════════════════════ */}
      <section style={{ background:'#f8faff', padding:'96px 0' }} className="section-divider">
        <div className="section-wrap">
          <SectionHeader
            pill="Community"
            pillColor="#e11d48" pillBg="#fff1f2" pillBorder="#fecdd3"
            title={<>Loved by <span className="shimmer-text">real learners.</span></>}
            subtitle="Thousands of students have already levelled up their careers with SkillValix."
          />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                id={`testimonial-${i}`}
                className="card-hover"
                style={{
                  background:'#fff',
                  border:'1.5px solid #e2e8f0',
                  borderRadius:20,
                  padding:'32px 28px',
                  display:'flex', flexDirection:'column', gap:18,
                  position:'relative',
                  boxShadow:'0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                {/* Big quote char */}
                <div style={{ position:'absolute', top:20, right:24, fontSize:64, lineHeight:1, fontWeight:900, color:'#f0f4ff', userSelect:'none' }}>"</div>

                {/* Stars */}
                <div style={{ display:'flex', gap:3 }}>
                  {[...Array(5)].map((_,si) => <Star key={si} size={15} style={{ color:'#f59e0b', fill:'#f59e0b' }} />)}
                </div>

                <p style={{ fontSize:14, color:'#475569', lineHeight:1.8, flex:1, fontStyle:'italic', margin:0 }}>"{t.body}"</p>

                <div style={{ display:'flex', alignItems:'center', gap:14, paddingTop:18, borderTop:'1px solid #f1f5f9' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:14, background:`linear-gradient(135deg, var(--from-c), var(--to-c))` }}
                    className={`bg-gradient-to-br ${t.grad}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{t.role}</div>
                  </div>
                  <CheckCircle2 size={18} style={{ color:'#10b981', marginLeft:'auto', flexShrink:0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          FAQ
      ══════════════════════════ */}
      <section style={{ background:'#fff', padding:'96px 0' }} className="section-divider">
        <div style={{ maxWidth:720, margin:'0 auto', padding:'0 24px' }}>
          <SectionHeader
            pill="FAQ"
            pillColor="#4f46e5" pillBg="#eef2ff" pillBorder="#c7d2fe"
            title="Got questions?"
            subtitle="Everything you need to know about the platform."
          />
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          CTA BANNER
      ══════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', padding:'112px 24px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
        {/* Gradient background */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#312e81 0%,#4f46e5 40%,#6d28d9 70%,#312e81 100%)' }} />
        {/* Grid overlay */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'56px 56px', pointerEvents:'none' }} />
        {/* Orbs */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'rgba(255,255,255,0.07)', filter:'blur(80px)', top:'-30%', left:'-10%', animation:'floatA 11s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(236,72,153,0.18)', filter:'blur(80px)', bottom:'-25%', right:'-10%', animation:'floatB 13s ease-in-out infinite', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:10, textAlign:'center', maxWidth:840, width:'100%' }}>
          {/* Mini badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:100, padding:'7px 18px', marginBottom:36, backdropFilter:'blur(10px)' }}>
            <Target size={14} style={{ color:'#fbbf24' }} />
            <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>Join 2,800+ learners already on the platform</span>
          </div>

          <h2 style={{ fontSize:'clamp(2.2rem,6vw,4rem)', fontWeight:900, color:'#fff', lineHeight:1.0, marginBottom:24, letterSpacing:'-0.02em' }}>
            Your career in tech<br />
            <span style={{ background:'linear-gradient(135deg,#e0e7ff,#c4b5fd,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              starts right here.
            </span>
          </h2>

          <p style={{ fontSize:18, color:'rgba(255,255,255,0.65)', maxWidth:560, margin:'0 auto 48px', lineHeight:1.75, fontWeight:400 }}>
            100% free courses. Interactive learning. Verifiable certificates. Join the community today.
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:16 }}>
            <Link to="/register" id="cta-create-account" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              background:'#fff', color:'#4338ca', fontWeight:800, fontSize:17,
              padding:'18px 44px', borderRadius:16, textDecoration:'none',
              boxShadow:'0 4px 28px rgba(0,0,0,0.25)',
              transition:'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px) scale(1.03)';e.currentTarget.style.boxShadow='0 8px 40px rgba(0,0,0,0.35)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 28px rgba(0,0,0,0.25)';}}
            >
              <Rocket size={20} /> Create Free Account
            </Link>
            <Link to="/courses" id="cta-browse-courses" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              background:'rgba(255,255,255,0.12)', color:'#fff', fontWeight:700, fontSize:17,
              padding:'17px 36px', borderRadius:16, textDecoration:'none',
              border:'2px solid rgba(255,255,255,0.3)',
              transition:'all .2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.2)';e.currentTarget.style.borderColor='rgba(255,255,255,0.6)';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.borderColor='rgba(255,255,255,0.3)';e.currentTarget.style.transform='';}}
            >
              <BookOpen size={20} /> Browse Courses
            </Link>
          </div>

          {/* Trust strip */}
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 28px', marginTop:40 }}>
            {['No credit card','Always free','Cancel anytime'].map((t,i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:500 }}>
                <CheckCircle2 size={15} style={{ color:'rgba(52,211,153,0.7)' }} />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
