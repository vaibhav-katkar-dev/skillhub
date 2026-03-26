import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({
  size = 'md',
  tagline = false,
  linkTo = '/',
  className = '',
}) {
  const sizes = {
    sm: { width: 130, height: 44 },
    md: { width: 175, height: 60 },
    lg: { width: 240, height: 82 },
  };
  const s = sizes[size] || sizes.md;

  // ViewBox: 0 0 520 180 — tightly cropped around icon + wordmark
  const content = (
    <div className={`inline-flex items-center ${className}`} style={{ lineHeight: 0 }}>
      <svg
        width={s.width}
        height={s.height}
        viewBox="0 0 520 220"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SkillValix"
      >
        <defs>
          <clipPath id="logo-clip"><circle cx="88" cy="90" r="42"/></clipPath>
        </defs>

        {/* ── ICON: Ring ── */}
        <circle cx="88" cy="90" r="46" fill="none" stroke="#4b5563" strokeWidth="7"/>

        {/* ── ICON: Rising bars clipped inside ring ── */}
        <g clipPath="url(#logo-clip)">
          <rect x="62"  y="107" width="11" height="17" rx="2.5" fill="#1D4ED8"/>
          <rect x="77"  y="97"  width="11" height="27" rx="2.5" fill="#2563EB"/>
          <rect x="92"  y="86"  width="11" height="38" rx="2.5" fill="#3B82F6"/>
          <rect x="107" y="73"  width="11" height="51" rx="2.5" fill="#2563EB"/>
        </g>

        {/* ── ICON: Baseline ── */}
        <line x1="58" y1="127" x2="128" y2="127" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ── ICON: Green tick badge ── */}
        <circle cx="126" cy="50" r="17" fill="#16A34A"/>
        <path d="M 118 49 L 124 56 L 136 40" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* ── WORDMARK: single line, vertically centered ── */}
        <text
          x="152"
          y="122"
          fontFamily="'DM Sans', 'Segoe UI', system-ui, sans-serif"
          fontSize="68"
          fontWeight="900"
          letterSpacing="-2"
        >
          <tspan fill="#111827">Skill</tspan><tspan fill="#2563EB">valix</tspan>
        </text>

        {/* ── TAGLINE (only in footer via tagline prop) ── */}
        {tagline && (
          <g>
            <line x1="152" y1="135" x2="510" y2="135" stroke="#d1d5db" strokeWidth="1"/>
            <text
              x="152"
              y="168"
              fontFamily="'DM Sans', 'Segoe UI', system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              letterSpacing="4"
              fill="#9ca3af"
            >
              LEARN · VALIDATE · GROW
            </text>
          </g>
        )}
      </svg>
    </div>
  );

  if (!linkTo) return content;
  return (
    <Link to={linkTo} aria-label="SkillValix home" style={{ textDecoration: 'none', display: 'inline-flex' }}>
      {content}
    </Link>
  );
}
