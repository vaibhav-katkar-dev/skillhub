import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SkillValix logo — matches the uploaded brand image exactly:
 *  • Blue rounded-square icon with upward-trend arrow
 *  • "Skill" regular weight + "Valix" bold
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
  const subColor  = darkText ? 'text-slate-500' : 'text-blue-100/70';

  const Icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Blue rounded square background */}
      <rect width="40" height="40" rx="9" fill="#2563EB" />
      {/* Trend-line / arrow chart icon */}
      <polyline
        points="7,28 16,18 22,23 33,11"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow head at top-right */}
      <polyline
        points="27,10 33,11 32,17"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const content = (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {Icon}
      <span className="flex flex-col leading-none">
        <span className={`${s.brand} font-black tracking-tight ${textColor}`}>
          <span className="font-medium">Skill</span>
          <span className="font-black text-blue-600">Valix</span>
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
