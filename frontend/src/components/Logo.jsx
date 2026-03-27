import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({
  size = 'md',
  tagline = false,
  linkTo = '/',
  className = '',
}) {
  const sizes = {
    sm: { width: 145, height: 50 },
    md: { width: 205, height: 72 },
    lg: { width: 275, height: 96 },
  };
  const s = sizes[size] || sizes.md;

  // ViewBox: 0 0 520 180 — tightly cropped around icon + wordmark
  const content = (
    <div className={`inline-flex items-center ${className}`} style={{ lineHeight: 0 }}>
      <svg
      width={s.width}
      height={s.height}
      viewBox="0 0 520 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SkillValix"
    >
      <defs>
        {/* Main circle gradient */}
        <radialGradient id="circleGrad" cx="32%" cy="28%" r="75%">
          <stop offset="0%"   stopColor="#93C5FD" />
          <stop offset="40%"  stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </radialGradient>
 
        {/* Inner rim shimmer */}
        <radialGradient id="rimGrad" cx="35%" cy="30%" r="65%">
          <stop offset="60%"  stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0.12" />
        </radialGradient>
 
        {/* Badge gradient */}
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
 
        {/* Wordmark "Skill" gradient */}
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#111827" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
 
        {/* Wordmark "valix" gradient */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
 
        {/* Tagline gradient */}
        <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6B7280" />
          <stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
 
        {/* Filters */}
        <filter id="circleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1E3A8A" floodOpacity="0.35" />
        </filter>
        <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#166534" floodOpacity="0.4" />
        </filter>
        <filter id="textShadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#1D4ED8" floodOpacity="0.15" />
        </filter>
 
        <clipPath id="circleClip">
          <circle cx="88" cy="90" r="46" />
        </clipPath>
      </defs>
 
      {/* ── CIRCLE: shadow layer ── */}
      <circle cx="88" cy="90" r="46" fill="#1E3A8A" filter="url(#circleShadow)" opacity="0.5" />
 
      {/* ── CIRCLE: main gradient fill ── */}
      <circle cx="88" cy="90" r="46" fill="url(#circleGrad)" />
 
      {/* ── CIRCLE: inner rim shimmer ── */}
      <circle cx="88" cy="90" r="46" fill="url(#rimGrad)" />
 
      {/* ── CIRCLE: crisp outer stroke ── */}
      <circle cx="88" cy="90" r="46" fill="none" stroke="white" strokeWidth="1" opacity="0.18" />
 
      {/* ── BARS: inside clipped circle ── */}
      <g clipPath="url(#circleClip)">
        {/* Bar shadows */}
        <rect x="63"  y="108" width="11" height="17" rx="2" fill="black" opacity="0.2" transform="translate(1,2)" />
        <rect x="78"  y="98"  width="11" height="27" rx="2" fill="black" opacity="0.2" transform="translate(1,2)" />
        <rect x="93"  y="87"  width="11" height="38" rx="2" fill="black" opacity="0.2" transform="translate(1,2)" />
        <rect x="108" y="74"  width="11" height="51" rx="2" fill="black" opacity="0.2" transform="translate(1,2)" />
 
        {/* Bars */}
        <rect x="62"  y="107" width="11" height="17" rx="2" fill="white" opacity="0.50" />
        <rect x="77"  y="97"  width="11" height="27" rx="2" fill="white" opacity="0.68" />
        <rect x="92"  y="86"  width="11" height="38" rx="2" fill="white" opacity="0.85" />
        <rect x="107" y="73"  width="11" height="51" rx="2" fill="white" opacity="1.00" />
 
        {/* Bar top highlights */}
        <rect x="62"  y="107" width="11" height="3" rx="1.5" fill="white" opacity="0.4" />
        <rect x="77"  y="97"  width="11" height="3" rx="1.5" fill="white" opacity="0.4" />
        <rect x="92"  y="86"  width="11" height="3" rx="1.5" fill="white" opacity="0.4" />
        <rect x="107" y="73"  width="11" height="3" rx="1.5" fill="white" opacity="0.4" />
 
        {/* Baseline */}
        <line x1="58" y1="126" x2="130" y2="126" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      </g>
 
      {/* ── BADGE: shadow ── */}
      <circle cx="126" cy="50" r="17" fill="#166534" filter="url(#badgeShadow)" opacity="0.5" />
 
      {/* ── BADGE: gradient fill ── */}
      <circle cx="126" cy="50" r="17" fill="url(#badgeGrad)" />
 
      {/* ── BADGE: inner rim ── */}
      <circle cx="126" cy="50" r="17" fill="none" stroke="white" strokeWidth="1" opacity="0.25" />
 
      {/* ── BADGE: checkmark ── */}
      <path d="M 118.5 49.5 L 124 56 L 135.5 40.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 118.5 49.5 L 124 56 L 135.5 40.5" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
 
      {/* ── WORDMARK ── */}
      <text
        x="152"
        y="115"
        fontFamily="'DM Sans', 'Segoe UI', system-ui, sans-serif"
        fontSize="70"
        fontWeight="900"
        letterSpacing="-2.5"
        filter="url(#textShadow)"
      >
        <tspan fill="url(#textGrad)">Skill</tspan>
        <tspan fill="url(#blueGrad)">valix</tspan>
      </text>
 
      {/* ── TAGLINE ── */}
      {tagline && (
        <g>
          <line x1="152" y1="133" x2="508" y2="133" stroke="url(#tagGrad)" strokeWidth="0.8" opacity="0.5" />
          <text
            x="153"
            y="162"
            fontFamily="'DM Sans', 'Segoe UI', system-ui, sans-serif"
            fontSize="15"
            fontWeight="700"
            letterSpacing="5"
            fill="url(#tagGrad)"
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
