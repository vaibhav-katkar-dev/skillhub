import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * Job Simulation Certificate — "Ledger" redesign
 * A4 Landscape: 1123 × 794 px
 *
 * Design language: credential/diploma, not product UI.
 * Ink navy + brass gold on warm paper, with a forest-green seal ribbon
 * as the one restrained secondary color. Signature element is a
 * hand-built laurel + ribbon seal (inline SVG) instead of an image asset,
 * so it always matches the palette exactly.
 */
const JobSimCertificateTemplate = forwardRef(
  (
    {
      studentName = 'Your Name Here',
      simTitle = 'Frontend Developer Job Simulation',
      role = 'Frontend Developer',
      company = 'SkillValix Labs',
     
      certificateId = 'SVX-FE-2026-0001',
      issueDate = 'July 14, 2026',
      verifyUrl = 'https://skillvalix.com/verify/SVX-FE-2026-0001',
    },
    ref
  ) => {
    const fontSans = "'Inter', 'Helvetica Neue', Arial, sans-serif";
    const fontMono = "'JetBrains Mono', 'Courier New', monospace";
    const fontDisplay = "'Source Serif 4', 'Georgia', 'Times New Roman', serif";

    const underlineW = Math.min((studentName?.length ?? 10) * 19, 480);
    const safeCompany = company || 'SkillValix Labs';

    // ── Colour tokens ───────────────────────────────────────────────
    const paper       = '#F7F5EC'; // warm paper background
    const ink         = '#12213D'; // primary ink navy — headings
    const inkSidebar  = '#0B1730'; // near-black navy — sidebar fill
    const gold        = '#B8892B'; // brass/gold — primary accent
    const goldLight   = '#E8C877'; // light gold — on-dark highlights
    const forest      = '#1F4D3D'; // deep green — seal ribbon only
    const textBody    = '#2B313D'; // body copy — darkened for readability
    const textMuted   = '#5F5847'; // labels on paper — darkened for contrast
    const hairline     = '#DED7C4'; // warm hairline rule on paper
    const sidebarMuted = '#A8B0C4'; // muted text on navy — lightened for contrast
    const sidebarFaint = '#7C86A0'; // faint text on navy — lightened for contrast

    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          zIndex: -9999, opacity: 0.01, pointerEvents: 'none',
        }}
      >
        <div
          ref={ref}
          id="pdf-jobsim-certificate-export"
          style={{
            position: 'relative', overflow: 'hidden',
            width: '1123px', height: '794px',
            backgroundColor: paper,
            fontFamily: fontSans, boxSizing: 'border-box',
          }}
        >
          {/* ── Fine paper texture: hairline grid, very quiet ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5,
            backgroundImage: `linear-gradient(${hairline} 1px, transparent 1px), linear-gradient(90deg, ${hairline} 1px, transparent 1px)`,
            backgroundSize: '38px 38px',
            maskImage: 'radial-gradient(ellipse at 30% 30%, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 30%, black 0%, transparent 70%)',
          }} />

          {/* ── Top hairline + gold rule ── */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: gold, zIndex: 20 }} />

          {/* ── Double border, engraved feel ── */}
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 12, bottom: 12,
            border: `1.5px solid ${ink}`, borderRadius: 2, opacity: 0.15,
            pointerEvents: 'none', zIndex: 10,
          }} />
          <div style={{
            position: 'absolute', top: 18, left: 18, right: 18, bottom: 18,
            border: `1px solid ${gold}`, borderRadius: 1, opacity: 0.35,
            pointerEvents: 'none', zIndex: 10,
          }} />

          {/* Corner marks */}
          {[
            { top: 26, left: 26 }, { top: 26, right: 26 },
            { bottom: 26, left: 26 }, { bottom: 26, right: 26 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', width: 14, height: 14, zIndex: 11,
              borderTop: pos.top !== undefined ? `1.5px solid ${gold}` : 'none',
              borderBottom: pos.bottom !== undefined ? `1.5px solid ${gold}` : 'none',
              borderLeft: pos.left !== undefined ? `1.5px solid ${gold}` : 'none',
              borderRight: pos.right !== undefined ? `1.5px solid ${gold}` : 'none',
              ...pos,
            }} />
          ))}

          {/* ════════════════════════════════════════════
              RIGHT SIDEBAR
          ════════════════════════════════════════════ */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 230, zIndex: 20,
            background: inkSidebar,
            boxShadow: '-10px 0 30px rgba(11,23,48,0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 38, boxSizing: 'border-box',
            borderLeft: `1px solid ${gold}55`,
          }}>
            {/* Gold rule at top of sidebar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: gold }} />

            {/* Role card — flat, gold hairline border, no gradient fill */}
            <div style={{
              width: 190, borderRadius: 4, boxSizing: 'border-box',
              padding: '18px 16px', marginBottom: 22,
              backgroundColor: 'rgba(184,137,43,0.08)',
              border: `1px solid ${gold}66`,
            }}>
              <p style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.26em',
                color: goldLight, fontFamily: fontSans,
                textTransform: 'uppercase', marginBottom: 11, textAlign: 'center',
              }}>Job simulation role</p>

              <div style={{ width: '100%', height: 1, backgroundColor: `${gold}55`, marginBottom: 11 }} />

              <p style={{
                fontSize: 19, fontWeight: 700, textAlign: 'center',
                lineHeight: 1.28, color: '#F5F2E8', fontFamily: fontDisplay,
                wordBreak: 'break-word', marginBottom: 9,
              }}>{role}</p>

              <p style={{
                fontSize: 10.5, fontWeight: 500, textAlign: 'center',
                color: sidebarMuted, fontFamily: fontSans, marginBottom: 10, fontStyle: 'italic',
              }}>completed at</p>

              <p style={{
                fontSize: 14, fontWeight: 700, textAlign: 'center',
                color: goldLight, fontFamily: fontSans, letterSpacing: '0.01em',
              }}>{safeCompany}</p>

              <div style={{ width: '100%', height: 1, backgroundColor: `${gold}55`, marginTop: 10 }} />
            </div>

            {/* ── Custom seal: laurel + ribbon, drawn in palette ── */}
            <svg width="128" height="128" viewBox="0 0 128 128" style={{ marginBottom: 12 }}>
              {/* Ribbon tails */}
              <path d="M50 96 L38 124 L50 118 L58 126 Z" fill={forest} />
              <path d="M78 96 L90 124 L78 118 L70 126 Z" fill={forest} />
              {/* Outer laurel arcs */}
              <path d="M64 20 C40 24 30 46 34 68 C36 82 46 92 56 98"
                    fill="none" stroke={gold} strokeWidth="2" opacity="0.85" />
              <path d="M64 20 C88 24 98 46 94 68 C92 82 82 92 72 98"
                    fill="none" stroke={gold} strokeWidth="2" opacity="0.85" />
              {/* Laurel leaves — left */}
              {[26, 34, 42, 50, 58].map((y, i) => (
                <ellipse key={`l${i}`} cx={38 - i * 1.5} cy={y} rx="6" ry="3"
                  fill={gold} opacity={0.9}
                  transform={`rotate(${-40 + i * 8} ${38 - i * 1.5} ${y})`} />
              ))}
              {/* Laurel leaves — right */}
              {[26, 34, 42, 50, 58].map((y, i) => (
                <ellipse key={`r${i}`} cx={90 + i * 1.5} cy={y} rx="6" ry="3"
                  fill={gold} opacity={0.9}
                  transform={`rotate(${40 - i * 8} ${90 + i * 1.5} ${y})`} />
              ))}
              {/* Medallion */}
              <circle cx="64" cy="62" r="30" fill={inkSidebar} stroke={gold} strokeWidth="2.5" />
              <circle cx="64" cy="62" r="25" fill="none" stroke={gold} strokeWidth="1" opacity="0.5" />
              <text x="64" y="58" textAnchor="middle" fontFamily={fontSans}
                    fontSize="8" fontWeight="700" letterSpacing="1.5" fill={goldLight}>VERIFIED</text>
              <text x="64" y="72" textAnchor="middle" fontFamily={fontDisplay}
                    fontSize="9" fontWeight="600" fill="#F5F2E8">SkillValix</text>
            </svg>

            {/* Issue date */}
            <div style={{ width: '100%', textAlign: 'center', padding: '0 20px', boxSizing: 'border-box', marginTop: 2 }}>
              <div style={{ width: '100%', height: 1, backgroundColor: `${gold}33`, marginBottom: 10 }} />
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                color: sidebarMuted, fontFamily: fontSans,
                textTransform: 'uppercase', marginBottom: 6,
              }}>Date of issue</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F0EAD6', fontFamily: fontDisplay }}>{issueDate}</p>
            </div>

            {/* Footer */}
            <p style={{
              position: 'absolute', bottom: 22, width: '100%', textAlign: 'center',
              fontSize: 10, letterSpacing: '0.1em', fontWeight: 600,
              color: sidebarFaint, fontFamily: fontSans,
            }}>skillvalix.com</p>
          </div>

          {/* ════════════════════════════════════════════
              MAIN LEFT CONTENT
          ════════════════════════════════════════════ */}
          <div style={{
            position: 'absolute', left: 54, top: 32, bottom: 32, right: 250,
            display: 'flex', flexDirection: 'column', zIndex: 10,
            boxSizing: 'border-box',
          }}>

            {/* ── Logo row ── */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              <img
                src="/logo.svg" crossOrigin="anonymous"
                alt="SkillValix" width="52" height="52"
                style={{ objectFit: 'contain', zIndex: 10 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                <h1 style={{
                  fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em',
                  lineHeight: 1, marginBottom: 5, fontFamily: fontDisplay, color: ink,
                }}>
                  Skill<span style={{ color: gold }}>Valix</span>
                </h1>
                <p style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: textMuted, fontFamily: fontSans,
                }}>Learn · Validate · Grow</p>
              </div>
            </div>

            {/* Gold hairline under logo */}
            <div style={{ height: 1, width: 260, backgroundColor: gold, opacity: 0.5, marginBottom: 20 }} />

            {/* ── Type + Headline ── */}
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.28em',
                color: gold, fontFamily: fontSans,
                textTransform: 'uppercase', marginBottom: 8,
              }}>Certificate of professional completion</p>

              <h2 style={{
                fontSize: 42, fontWeight: 600, lineHeight: 1.1,
                color: ink, fontFamily: fontDisplay, letterSpacing: '-0.005em',
              }}>
                {simTitle}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10 }}>
                <div style={{ width: 3, height: 17, backgroundColor: gold, borderRadius: 1 }} />
                <p style={{ fontSize: 14, fontWeight: 500, color: textBody, fontFamily: fontSans }}>
                  Completed at&nbsp;
                  <span style={{ color: ink, fontWeight: 700 }}>{safeCompany}</span>
                </p>
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, width: '100%', marginBottom: 16, backgroundColor: hairline }} />

            {/* ── Awarded to ── */}
            <div style={{ marginBottom: 14 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: textMuted,
                fontFamily: fontSans, marginBottom: 4, fontStyle: 'italic',
              }}>This certificate is proudly presented to</p>
              <h3 style={{
                fontSize: 38, fontWeight: 600, lineHeight: 1.06,
                color: ink, fontFamily: fontDisplay,
                wordBreak: 'break-word', maxWidth: 600, marginBottom: 9,
              }}>
                {studentName}
              </h3>
              <div style={{ height: 2, width: underlineW, backgroundColor: gold }} />
            </div>

            {/* ── Body text ── */}
            <p style={{
              fontSize: 14, lineHeight: 1.6,
              color: textBody, fontFamily: fontSans, maxWidth: 640, marginBottom: 14,
            }}>
              In recognition of the successful completion of the&nbsp;
              <strong style={{ color: ink }}>{simTitle}</strong>, demonstrating
              professional-level proficiency in the role of&nbsp;
              <strong style={{ color: ink }}>{role}</strong> at&nbsp;
              <strong style={{ color: ink }}>{safeCompany}</strong>.
              This simulation replicated real-world responsibilities, deliverables,
              and evaluation standards used by practicing industry professionals,
              and was completed to a satisfactory professional standard.
            </p>

            <div style={{ flex: 1, minHeight: 10 }} />

            {/* ── Footer row ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', paddingTop: 10,
              borderTop: `1px solid ${hairline}`,
            }}>
              <div style={{ flex: 1, maxWidth: 420, paddingTop: 10 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                  marginBottom: 6, color: textMuted, fontFamily: fontSans,
                  textTransform: 'uppercase',
                }}>Certificate ID</p>
                <p style={{
                  fontSize: 14, fontWeight: 600, marginBottom: 9,
                  color: ink, fontFamily: fontMono,
                }}>{certificateId}</p>
                <p style={{ fontSize: 11, color: textMuted, fontFamily: fontSans }}>
                  Issued by SkillValix · MSME registered · Scan QR code to verify authenticity
                </p>
              </div>

              {/* QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 16, paddingTop: 10 }}>
                <div style={{
                  padding: 9, border: `1.5px solid ${gold}`,
                  borderRadius: 4, marginBottom: 6,
                  backgroundColor: '#FFFFFF',
                }}>
                  <QRCodeSVG
                    value={verifyUrl} size={72}
                    level="H" fgColor={ink} bgColor="#FFFFFF"
                  />
                </div>
                <p style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  color: textMuted, fontFamily: fontSans,
                  textTransform: 'uppercase',
                }}>Scan to verify</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JobSimCertificateTemplate.displayName = 'JobSimCertificateTemplate';
export default JobSimCertificateTemplate;