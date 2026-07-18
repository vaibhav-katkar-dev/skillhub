import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VERIFIED_STAMP_BASE64 } from './verified-base64';

/**
 * HackathonCertificateTemplate — 100% inline styles, zero Tailwind dependency.
 * Designed specifically for hackathon participation and winner certificates.
 * 
 * A4 Landscape: 1123 × 794 px
 */
const HackathonCertificateTemplate = forwardRef(
  ({ 
    studentName, 
    hackathonTitle,
    eventTitle, // Hackathon title
    certificateId, 
    issueDate, 
    verifyUrl, 
    certType = 'participation',
    isWinner = false,
    winnerRank = '',
    teamName = '',
    customTitle = '',
    customBody = ''
  }, ref) => {
    const fontSans = "'Inter', 'Helvetica Neue', Arial, sans-serif";
    const fontMono = "'JetBrains Mono', 'Courier New', monospace";

    const isWinnerType = certType === 'winner' || isWinner;
    const title = hackathonTitle || eventTitle || 'Hackathon';

    // Underline width proportional to name length
    const underlineW = Math.min((studentName?.length ?? 10) * 20, 600);

    // Theme variables
    const primaryColor = isWinnerType ? '#D4AF37' : '#7C3AED'; // Gold vs Purple
    const bgSidebar = isWinnerType
      ? 'linear-gradient(to right, #5A3F0E, #8C6212, #D4AF37, #EBC85E)' // Gold gradient
      : 'linear-gradient(to right, #2E1065, #4C1D95, #7C3AED, #A78BFA)'; // Purple gradient
    const ribbonText = isWinnerType ? 'WINNER' : 'PARTICIPANT';

    // Default title / body
    const defaultTitle = isWinnerType ? 'OF ACHIEVEMENT' : 'OF PARTICIPATION';
    const defaultBody = isWinnerType
      ? `This certificate is proudly awarded in recognition of securing ${winnerRank || 'Winner'} in the hackathon, demonstrating exceptional innovation, technical skills, and teamwork as a member of team "${teamName || 'Solo'}".`
      : `This certificate is proudly awarded in recognition of active and valuable participation in the hackathon, demonstrating outstanding creativity, technical problem solving, and collaboration as a member of team "${teamName || 'Solo'}".`;

    const titleToDisplay = customTitle || defaultTitle;
    const bodyToDisplay = customBody || defaultBody;

    return (
      /* Outer wrapper: positioned off-screen and invisible to the user */
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -9999,
          opacity: 0.01,
          pointerEvents: 'none',
        }}
      >
        {/* Root canvas */}
        <div
          ref={ref}
          id="pdf-certificate-export"
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '1123px',
            height: '794px',
            backgroundColor: '#FDFBF7', // Slightly warmer cream bg
            fontFamily: fontSans,
            boxSizing: 'border-box',
          }}
        >
          {/* Outer primary border */}
          <div
            style={{
              position: 'absolute',
              top: 6, left: 6, right: 6, bottom: 6,
              border: `2px solid ${primaryColor}`,
              borderRadius: 2,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
          {/* Inner slate border */}
          <div
            style={{
              position: 'absolute',
              top: 12, left: 12, right: 12, bottom: 12,
              border: '1px solid #E2E8F0',
              borderRadius: 2,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />

          {/* Diagonal watermark */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.02,
              transform: 'rotate(-35deg)',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 128 }}>
              {['SKILLVALIX HACKATHON', 'SKILLVALIX HACKATHON', 'SKILLVALIX HACKATHON'].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 100,
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                    whiteSpace: 'nowrap',
                    color: '#0F172A',
                    fontFamily: fontSans,
                    lineHeight: 1,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════
              RIGHT SIDEBAR (Gradient panel)
          ════════════════════════════════════════════ */}
          <div
            style={{
              position: 'absolute',
              right: 0, top: 0, bottom: 0,
              width: 220,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 40,
              background: bgSidebar,
              boxShadow: '-10px 0 25px rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
            }}
          >
            {/* Sparkles */}
            {[
              { top: '10%', left: '20%', size: 8, opacity: 0.4 },
              { top: '30%', left: '80%', size: 6, opacity: 0.6 },
              { top: '65%', left: '60%', size: 12, opacity: 0.3 },
              { top: '85%', left: '25%', size: 4, opacity: 0.8 },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: s.top, left: s.left,
                  width: s.size, height: s.size,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  opacity: s.opacity,
                }}
              />
            ))}

            {/* Left edge tint */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, backgroundColor: 'rgba(15,23,42,0.05)' }} />

            {/* Hackathon badge card */}
            <div
              style={{
                position: 'relative',
                marginTop: 32,
                marginBottom: 64,
                width: 188,
                border: `2px solid ${isWinnerType ? '#FFFFFF' : '#D4AF37'}`,
                borderRadius: 6,
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 16px',
                background: 'linear-gradient(to bottom, #111827, #1f2937, #111827)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                boxSizing: 'border-box',
              }}
            >
              <p style={{
                fontSize: 9, fontWeight: 900,
                letterSpacing: '0.3em', marginBottom: 12,
                color: primaryColor, fontFamily: fontSans,
                textTransform: 'uppercase',
              }}>
                {ribbonText}
              </p>
              {isWinnerType && winnerRank && (
                <p style={{
                  fontSize: 11, fontWeight: 950,
                  backgroundColor: '#D4AF37', color: '#111827',
                  padding: '2px 8px', borderRadius: 4,
                  marginBottom: 12, fontFamily: fontSans,
                  textTransform: 'uppercase',
                }}>
                  {winnerRank}
                </p>
              )}
              <p style={{
                fontSize: 13, fontWeight: 700,
                textAlign: 'center', lineHeight: 1.2,
                wordBreak: 'break-word', width: '100%',
                color: '#FFFFFF', fontFamily: fontSans,
              }}>
                {title}
              </p>
            </div>

            {/* Premium Stamp */}
            <div style={{ position: 'relative', marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={VERIFIED_STAMP_BASE64}
                alt="Verified Stamp"
                width="105"
                height="105"
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Issue date block */}
            <div style={{ width: '100%', textAlign: 'center', padding: '0 24px', marginTop: 64, boxSizing: 'border-box' }}>
              <div style={{ width: '100%', height: 1, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 8, color: 'rgba(255,255,255,0.6)', fontFamily: fontSans, textTransform: 'uppercase' }}>
                ISSUED ON
              </p>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', fontFamily: fontSans }}>
                {issueDate}
              </p>
            </div>

            {/* Footer domain */}
            <p style={{
              position: 'absolute', bottom: 32,
              width: '100%', textAlign: 'center',
              fontSize: 10, letterSpacing: '0.1em', fontWeight: 500,
              color: 'rgba(255,255,255,0.5)', fontFamily: fontSans,
            }}>
              skillvalix.com
            </p>
          </div>

          {/* ════════════════════════════════════════════
              LEFT MAIN CONTENT AREA
          ════════════════════════════════════════════ */}
          <div
            style={{
              position: 'absolute',
              left: 64, top: 48, bottom: 48, right: 240,
              display: 'flex', flexDirection: 'column',
              zIndex: 10, paddingTop: 16,
              boxSizing: 'border-box',
            }}
          >
            {/* Logo row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
              <img src="/logo.svg" crossOrigin="anonymous" alt="SkillValix Logo" width="80" height="80" style={{ objectFit: 'contain', position: 'relative', zIndex: 10 }} />

              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: -8, position: 'relative', zIndex: 0 }}>
                <h1 style={{
                  fontSize: 36, fontWeight: 900,
                  letterSpacing: '-0.025em', lineHeight: 1,
                  marginBottom: 4, fontFamily: fontSans,
                  color: '#0F172A',
                }}>
                  Skill<span style={{ color: primaryColor }}>Valix</span>
                </h1>
                <div style={{ width: '100%', height: 1, marginBottom: 4, backgroundColor: '#E2E8F0' }} />
                <p style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#64748B', fontFamily: fontSans,
                }}>
                  HACKATHON PORTAL
                </p>
              </div>
            </div>

            {/* Main body */}
            <div style={{ flex: 1, marginTop: 12 }}>
              <p style={{
                fontSize: 12, fontWeight: 900,
                letterSpacing: '0.3em', marginBottom: 4,
                color: primaryColor, fontFamily: fontSans,
                textTransform: 'uppercase',
              }}>
                C E R T I F I C A T E
              </p>
              <h2 style={{
                fontSize: 42, fontWeight: 900,
                lineHeight: 1.1, marginBottom: 24,
                color: '#0F172A', fontFamily: fontSans,
                textTransform: 'uppercase'
              }}>
                {titleToDisplay}
              </h2>

              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: '#64748B', fontFamily: fontSans }}>
                Awarded to
              </p>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{
                  fontSize: 36, fontWeight: 900,
                  lineHeight: 1, marginBottom: 8,
                  wordBreak: 'break-word', maxWidth: 700,
                  color: '#0F172A', fontFamily: fontSans,
                }}>
                  {studentName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', maxWidth: 700, width: '100%' }}>
                  <div style={{ height: 4, width: underlineW, backgroundColor: primaryColor }} />
                  <div style={{ height: 1, flex: 1, marginLeft: 8, backgroundColor: 'rgba(124,58,237,0.2)' }} />
                </div>
              </div>

              <p style={{ fontSize: 15, fontWeight: 700, color: '#475569', marginBottom: 12, fontFamily: fontSans }}>
                For outstanding contribution in: {title}
              </p>

              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 720, color: '#64748B', fontFamily: fontSans }}>
                {bodyToDisplay}
              </p>
            </div>

            {/* Footer row (ID + QR) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 16, width: '100%' }}>
              <div style={{ flex: 1, maxWidth: 500 }}>
                <p style={{
                  fontSize: 10, fontWeight: 900,
                  letterSpacing: '0.12em', marginBottom: 8,
                  color: '#94A3B8', fontFamily: fontSans,
                  textTransform: 'uppercase',
                }}>
                  CERTIFICATE ID
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1E293B', fontFamily: fontMono }}>
                  {certificateId}
                </p>
                <div style={{ width: '100%', height: 1, marginBottom: 8, backgroundColor: '#E2E8F0' }} />
                <p style={{ fontSize: 10, color: '#64748B', fontFamily: fontSans }}>
                  Issued by SkillValix · MSME Registered
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 32 }}>
                <div style={{
                  padding: 12, border: '1px solid #E2E8F0',
                  borderRadius: 4, marginBottom: 8,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}>
                  <QRCodeSVG value={verifyUrl} size={88} level="H" fgColor="#0F172A" bgColor="#FFFFFF" />
                </div>
                <div style={{ width: '110%', height: 1, marginBottom: 4, backgroundColor: '#CBD5E1' }} />
                <p style={{
                  fontSize: 9, fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#94A3B8', fontFamily: fontSans,
                  textTransform: 'uppercase',
                }}>
                  SCAN TO VERIFY
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HackathonCertificateTemplate.displayName = 'HackathonCertificateTemplate';

export default HackathonCertificateTemplate;
