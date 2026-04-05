import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({
  size = 'md',
  tagline = false,
  linkTo = '/',
  className = '',
  theme = 'light',
}) {
  const sizes = {
    sm: { img: 32, text: 'text-xl', tag: 'invisible hidden' },
    md: { img: 42, text: 'text-3xl', tag: 'text-[10px]' },
    lg: { img: 48, text: 'text-4xl', tag: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div className={`inline-flex items-center gap-0 ${className}`}>
      <img src="/logo.svg" alt="SkillValix Logo" width={s.img} height={s.img} className="object-contain drop-shadow-md z-10 relative" />
      <div className="flex flex-col justify-center -ml-2 relative z-0">
        <span className={`font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'} ${s.text} font-sans`}>
          kill<span className="text-blue-600">Valix</span>
        </span>
        {tagline &&
          (
            <>
              {/* <div className="w-full h-px bg-slate-300 my-0.5" /> */}
              <span className={`font-bold tracking-[0.2em] text-slate-500 uppercase ${s.tag} font-sans`}>
                {/* LEARN · VALIDATE · GROW */}
              </span>
            </>
          )
        }

      </div>
    </div>
  );

  if (!linkTo) return content;
  return (
    <Link to={linkTo} aria-label="SkillValix home" className="inline-flex no-underline">
      {content}
    </Link>
  );
}
