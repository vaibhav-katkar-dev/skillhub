import React, { useEffect, useState } from 'react';
import { X, Zap, Users, TrendingUp, BookOpen, Briefcase, Trophy, Target } from 'lucide-react';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/HxtxKbZCw39BNGzy7hXVSt?mode=gi_t';
const POPUP_SEEN_KEY = 'skillvalix_whatsapp_popup_seen';
const POPUP_DELAY_MS = 6000;

const WhatsAppJoinPopup = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(POPUP_SEEN_KEY) === '1';
    if (hasSeenPopup) return;
    const timer = window.setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem(POPUP_SEEN_KEY, '1');
      setOpen(false);
      setClosing(false);
    }, 250);
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes wa-slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes wa-fade-out {
          from { opacity: 1; transform: translateY(0)   scale(1); }
          to   { opacity: 0; transform: translateY(20px) scale(0.97); }
        }
        @keyframes wa-pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.6; transform:scale(1.5); }
        }
        .wa-popup-card {
          animation: ${closing ? 'wa-fade-out .25s ease forwards' : 'wa-slide-up .35s cubic-bezier(.34,1.56,.64,1) forwards'};
        }
        .wa-pulse { animation: wa-pulse-dot 1.4s ease-in-out infinite; }
      `}</style>

      <div
        className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4"
        style={{ background: 'rgba(2,6,23,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={closePopup}
      >
        <div
          className="wa-popup-card w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
          style={{ background: '#fff', border: '1px solid rgba(16,185,129,0.2)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top Header */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
            padding: '18px 20px 14px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span className="wa-pulse" style={{
                width: 8, height: 8, borderRadius: '50%', background: '#fff',
                display: 'inline-block', boxShadow: '0 0 0 3px rgba(255,255,255,0.3)'
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                4,200+ Members Active
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
              Level Up Your Career<br />With Industry Skills
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
              Free community. Zero spam. Career-focused content.
            </p>

            <button
              type="button"
              onClick={closePopup}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14,
                background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: 8, padding: '4px 5px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', color: '#fff',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 20px' }}>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 10, padding: '8px 12px', marginBottom: 14,
            }}>
              <Users size={14} style={{ color: '#059669', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>
                Students from 200+ colleges have already joined
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { Icon: BookOpen, bold: 'Free Courses & Certificates', sub: 'HTML, CSS, JS, Python, React, AI' },
                { Icon: Briefcase, bold: 'Job Simulations', sub: 'Platform projects for your resume' },
                { Icon: Trophy, bold: 'Hackathon Alerts', sub: 'Win prizes and get noticed by recruiters' },
                { Icon: Target, bold: 'Career Growth Tips', sub: 'Resume structuring, LinkedIn updates, and interview prep' },
                { Icon: Users, bold: 'Referrals & Opportunities', sub: 'Internships and jobs shared by the community' },
              ].map(({ Icon, bold, sub }) => (
                <div key={bold} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ padding: 6, background: '#f1f5f9', borderRadius: 8, color: '#059669', flexShrink: 0, marginTop: 1 }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{bold}</div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              margin: '16px 0 0',
              background: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: 8, padding: '7px 11px',
            }}>
              <TrendingUp size={13} style={{ color: '#d97706', flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: '#92400e', fontWeight: 600 }}>
                47 people joined today! The community is growing fast.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href={WHATSAPP_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closePopup}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #25d366, #128c7e)',
                color: '#fff', textDecoration: 'none',
                padding: '13px 20px', borderRadius: 12,
                fontSize: 15, fontWeight: 800,
                boxShadow: '0 4px 18px rgba(37,211,102,0.35)',
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(37,211,102,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(37,211,102,0.35)'; }}
            >
              <img
                src="https://cdn.cdnlogo.com/logos/w/10/whatsapp.svg"
                alt="WhatsApp"
                style={{ width: 20, height: 20, flexShrink: 0 }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <Zap size={15} />
              Join WhatsApp Group For Free
            </a>

            <button
              type="button"
              onClick={closePopup}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#94a3b8', fontWeight: 500,
                padding: '4px 0', textAlign: 'center',
              }}
            >
              No thanks, I will figure it out alone
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppJoinPopup;
