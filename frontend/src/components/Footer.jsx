import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Twitter,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  BookMarked,
  Building2,
  ChevronRight,
  Shield,
} from 'lucide-react';

/* ─────────────── data ─────────────── */
const NAV_COLUMNS = [
  {
    heading: 'Learn',
    icon: GraduationCap,
    links: [
      { to: '/courses',        label: 'All Courses' },
      { to: '/courses',        label: 'HTML Masterclass' },
      { to: '/courses',        label: 'CSS Fundamentals' },
      { to: '/courses',        label: 'JavaScript Basics' },
    ],
  },
  {
    heading: 'Resources',
    icon: BookMarked,
    links: [
      { to: '/blog',           label: 'Blog' },
      { to: '/verify',         label: 'Verify Certificate' },
      { to: '/dashboard',      label: 'Student Dashboard' },
      { to: '/',               label: 'Help Center' },
    ],
  },
  {
    heading: 'Company',
    icon: Building2,
    links: [
      { to: '/register',       label: 'Create Account' },
      { to: '/login',          label: 'Sign In' },
      { to: '/',               label: 'Privacy Policy' },
      { to: '/',               label: 'Terms of Service' },
    ],
  },
];

const STATS = [
  { value: '12+',  label: 'Modules' },
  { value: '25',   label: 'Quizzes' },
  { value: '100%', label: 'Free' },
  { value: '∞',    label: 'Skills' },
];

const SOCIAL = [
  { icon: Twitter,  href: '#', label: 'Twitter'  },
  { icon: Github,   href: '#', label: 'GitHub'   },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail,     href: '#', label: 'Email'    },
];

const LEGAL_LINKS = [
  { to: '/', label: 'Privacy Policy'  },
  { to: '/', label: 'Terms of Service' },
  { to: '/', label: 'Cookie Policy'   },
];

/* ─────────────── component ─────────────── */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-slate-950 text-slate-400 border-t border-slate-800"
      aria-label="Site footer"
    >
      {/* ── Top Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="SkillHub home">
              <div className="bg-blue-600 group-hover:bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-900/40 transition-colors duration-200">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Skill</span>
                <span className="text-white">Hub</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              The premier platform for mastering web technology. Beginner-friendly
              lessons, rigorous certifications, and verifiable credentials — all in
              one place.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                Stay Updated
              </p>
              <p className="text-xs text-slate-500">Get new courses and tips in your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="flex-1 min-w-0 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  className="shrink-0 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          <nav
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10"
            aria-label="Footer navigation"
          >
            {NAV_COLUMNS.map(({ heading, icon: Icon, links }) => (
              <div key={heading}>
                {/* Column header */}
                <h3 className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-5">
                  <Icon className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                  {heading}
                </h3>

                <ul className="space-y-3" role="list">
                  {links.map(({ to, label }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors duration-150"
                      >
                        <ChevronRight
                          className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-blue-500"
                          aria-hidden="true"
                        />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="text-2xl font-black text-white">{value}</dt>
                <dd className="mt-1 text-[11px] text-slate-500 uppercase tracking-wider">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-xs text-slate-500 order-2 sm:order-1">
            &copy; {year} SkillHub Learning Platform. All rights reserved.
          </p>

          {/* Legal Links */}
          <nav
            className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center"
            aria-label="Legal"
          >
            <Shield className="w-3 h-3 text-slate-600 mr-1" aria-hidden="true" />
            {LEGAL_LINKS.map(({ to, label }, i) => (
              <React.Fragment key={label}>
                <Link
                  to={to}
                  className="text-xs text-slate-500 hover:text-blue-400 transition-colors duration-150"
                >
                  {label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="text-slate-700 select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
