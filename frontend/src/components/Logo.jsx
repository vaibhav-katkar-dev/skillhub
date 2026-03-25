import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SkillValix logo — original brand style, polished:
 *  • Blue rounded-square icon with crisp upward-trend arrow + dot
 *  • "Skill" regular weight + "Valix" bold blue
 *  • Optional tagline "GROW YOUR CAREER"
 *
 * Props:
 *  size      – 'sm' | 'md' | 'lg'   (default 'md')
 *  tagline   – bool                  (default false)
 *  darkText  – bool  use dark text   (default false → white/blue for dark bg)
 *  linkTo    – string|null           (default '/')
 *  className – extra wrapper classes
 */
export default function Logo({
  size = 'md',
  tagline = false,
  darkText = false,
  linkTo = '/',
  className = '',
}) {
  const sizes = {
    sm: { icon: 28, brand: 'text-base',  tag: 'text-[7px]', gap: 'gap-1.5' },
    md: { icon: 36, brand: 'text-xl',    tag: 'text-[8px]', gap: 'gap-2'   },
    lg: { icon: 48, brand: 'text-3xl',   tag: 'text-[10px]', gap: 'gap-3'  },
  };
  const s = sizes[size] || sizes.md;
  const textColor = darkText ? 'text-slate-800' : 'text-white';
  const subColor  = darkText ? 'text-slate-400' : 'text-blue-100/70';

  const Icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Blue rounded square background */}
      <rect width="40" height="40" rx="10" fill="url(#bgGrad)" />

      {/* Subtle inner highlight */}
      <rect x="1" y="1" width="38" height="19" rx="9" fill="white" fillOpacity="0.06" />

      {/* Trend line — smooth upward curve from bottom-left to top-right */}
      <path
        d="M 8 28 C 13 21, 17 25, 32 10"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Arrow head at top-right of the trend line */}
      <path
        d="M 23.5 10 L 32 10 L 32 18.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small dot at start of trend line */}
      <circle cx="8" cy="28" r="2" fill="white" fillOpacity="0.7" />
    </svg>
  );

  const content = (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {Icon}
      <span className="flex flex-col leading-none">
        <span className={`${s.brand} font-black tracking-tight ${textColor}`}>
          <span className="font-medium">Skill</span>
          <span className="font-black text-blue-400">Valix</span>
        </span>
        {tagline && (
          <span className={`${s.tag} font-bold tracking-[0.18em] uppercase mt-0.5 ${subColor}`}>
            Grow Your Career
          </span>
        )}
      </span>
    </span>
  );

  if (!linkTo) return content;
  return (
    <Link to={linkTo} aria-label="SkillValix home">
      {content}
    </Link>
  );
}
