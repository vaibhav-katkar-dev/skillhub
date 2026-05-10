import React, { useEffect, useState } from 'react';
import { X, Zap, Users, TrendingUp, BookOpen, Briefcase, Trophy, Target } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
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
            padding: '20px 20px 16px',
            position: 'relative',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
               <div style={{ background: '#fff', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: 34, color: '#25D366' }} />
               </div>
            </div>

            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Don't Learn Alone!
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              Join our fast-growing private community.
            </p>

            <button
              type="button"
              onClick={closePopup}
              aria-label="Close"
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: 8, padding: '6px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', color: '#fff',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { Icon: BookOpen, text: 'Instant updates on Free Courses' },
                { Icon: Trophy, text: 'Exclusive Hackathon Alerts' },
                { Icon: Briefcase, text: 'Internship & Job Referrals' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: '10px 14px', borderRadius: 12 }}>
                  <Icon size={18} style={{ color: '#059669', flexShrink: 0 }} />
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b' }}>{text}</div>
                </div>
              ))}
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
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #25d366, #128c7e)',
                color: '#fff', textDecoration: 'none',
                padding: '14px 20px', borderRadius: 12,
                fontSize: 15, fontWeight: 800,
                boxShadow: '0 4px 18px rgba(37,211,102,0.3)',
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(37,211,102,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(37,211,102,0.3)'; }}
            >
              <Zap size={16} />
              Join WhatsApp Free
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
                No thanks, I'll learn alone
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppJoinPopup;
