import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VERIFIED_STAMP_BASE64 } from './verified-base64';

/**
 * HackathonCertificateTemplate — v2
 * 100% inline styles, zero Tailwind dependency.
 *
 * DESIGN NOTES
 * - Structure: centered composition instead of the old left-content /
 *   right-sidebar split. A full-width gradient band runs across the top,
 *   a "circuit medallion" (a nod to the hackathon/code subject matter,
 *   standing in for the generic laurel-wreath seal) overlaps the band's
 *   lower edge, and the footer is a single hairline-divided bar.
 * - Corner brackets replace the old nested double-rectangle border.
 * - Type: a serif display face carries the name and title big and loud;
 *   a sans face carries labels/eyebrows; mono carries the data (ID, date).
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
    const fontDisplay = "'Georgia', 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif";
    const fontSans = "'Inter', 'Helvetica Neue', Arial, sans-serif";
    const fontMono = "'JetBrains Mono', 'Courier New', monospace";

    const isWinnerType = certType === 'winner' || isWinner;
    const title = hackathonTitle || eventTitle || 'Hackathon';

    // Palette — warm ink on parchment, muted antique gold vs deep violet
    const ink = '#18130E';
    const parchment = '#FBF7ED';
    const rule = '#E4DAC2';
    const muted = '#7A7267';

    const primaryColor = isWinnerType ? '#B8892B' : '#5B21B6';
    const bandGradient = isWinnerType
      ? 'linear-gradient(100deg, #3E2A08, #6B4E14, #B8892B, #E8C876)'
      : 'linear-gradient(100deg, #211048, #3B1E82, #5B21B6, #9C7FE0)';
    const ribbonText = isWinnerType ? 'WINNER' : 'PARTICIPANT';

    const defaultTitle = isWinnerType ? 'OF ACHIEVEMENT' : 'OF PARTICIPATION';
    const defaultBody = isWinnerType
      ? `Presented in recognition of securing ${winnerRank || 'Winner'} in ${title}, for exceptional innovation, technical craft, and teamwork as a member of team "${teamName || 'Solo'}".`
      : `Presented in recognition of active, valuable participation in ${title}, for creativity, technical problem-solving, and collaboration as a member of team "${teamName || 'Solo'}".`;

    const titleToDisplay = customTitle || defaultTitle;
    const bodyToDisplay = customBody || defaultBody;

    // Corner bracket component (used 4x, one per corner)
    const CornerBracket = ({ corner }) => {
      const size = 34;
      const thickness = 3;
      const positions = {
        tl: { top: 18, left: 18 },
        tr: { top: 18, right: 18 },
        bl: { bottom: 18, left: 18 },
        br: { bottom: 18, right: 18 },
      };
      const isTop = corner === 'tl' || corner === 'tr';
      const isLeft = corner === 'tl' || corner === 'bl';
      return (
        <div style={{ position: 'absolute', width: size, height: size, zIndex: 15, ...positions[corner] }}>
          <div style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: 0,
            [isLeft ? 'left' : 'right']: 0,
            width: size, height: thickness,
            backgroundColor: primaryColor,
          }} />
          <div style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: 0,
            [isLeft ? 'left' : 'right']: 0,
            width: thickness, height: size,
            backgroundColor: primaryColor,
          }} />
        </div>
      );
    };

    // Circuit medallion — the signature element. A ring of small "solder
    // point" dots joined by hairline traces around a </> glyph, standing
    // in for the generic laurel wreath most certificates reach for.
    const CircuitMedallion = () => {
      const r = 52;
      const dotCount = 10;
      const dots = Array.from({ length: dotCount }, (_, i) => {
        const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
        return { x: 60 + r * Math.cos(angle), y: 60 + r * Math.sin(angle) };
      });
      return (
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block' }}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="2 5" />
          <circle cx="60" cy="60" r={r - 14} fill={ink} stroke={primaryColor} strokeWidth="2" />
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={i % 2 === 0 ? 2.5 : 1.5} fill={i % 2 === 0 ? primaryColor : 'rgba(255,255,255,0.5)'} />
          ))}
          <text x="60" y="68" textAnchor="middle" fontFamily={fontMono} fontSize="22" fontWeight="700" fill="#FFFFFF">
            {'</>'}
          </text>
        </svg>
      );
    };

    return (
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
        <div
          ref={ref}
          id="pdf-certificate-export"
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '1123px',
            height: '794px',
            backgroundColor: parchment,
            fontFamily: fontSans,
            boxSizing: 'border-box',
          }}
        >
          {/* Corner brackets — signature framing device instead of nested borders */}
          <CornerBracket corner="tl" />
          <CornerBracket corner="tr" />
          <CornerBracket corner="bl" />
          <CornerBracket corner="br" />

          {/* Faint diagonal watermark */}
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
              transform: 'rotate(-20deg)',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 96 }}>
              {['SKILLVALIX · HACKATHON', 'SKILLVALIX · HACKATHON'].map((t, i) => (
                <span key={i} style={{
                  fontSize: 90, fontWeight: 900, letterSpacing: '-0.04em',
                  whiteSpace: 'nowrap', color: ink, fontFamily: fontDisplay, lineHeight: 1,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ══════════════ TOP GRADIENT BAND ══════════════ */}
          <div style={{
            position: 'relative',
            height: 132,
            width: '100%',
            background: bandGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 56px',
            boxSizing: 'border-box',
            zIndex: 5,
          }}>
            {/* Logo + brand, left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/logo.svg" crossOrigin="anonymous" alt="SkillValix Logo" width="48" height="48" style={{ objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', fontFamily: fontDisplay, lineHeight: 1 }}>
                  SkillValix
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                  Hackathon Portal
                </span>
              </div>
            </div>

            {/* Verified stamp + issue date, right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Issued On
                </p>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', fontFamily: fontMono }}>
                  {issueDate}
                </p>
              </div>
              <img src={VERIFIED_STAMP_BASE64} alt="Verified Stamp" width="52" height="52" style={{ objectFit: 'contain' }} />
            </div>
          </div>

          {/* Medallion — overlaps the band's lower edge, centered */}
          <div style={{
            position: 'absolute',
            top: 132 - 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <CircuitMedallion />
            <div style={{
              marginTop: -6,
              padding: '3px 14px',
              borderRadius: 20,
              backgroundColor: primaryColor,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#FFFFFF' }}>
                {ribbonText}{isWinnerType && winnerRank ? ` · ${winnerRank}` : ''}
              </span>
            </div>
          </div>

          {/* ══════════════ CENTER CONTENT ══════════════ */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            marginTop: 76,
            padding: '0 90px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.4em', color: primaryColor, textTransform: 'uppercase', marginBottom: 6 }}>
              Certificate
            </p>
            <h1 style={{
              fontSize: 54, fontWeight: 900, lineHeight: 1.05,
              color: ink, fontFamily: fontDisplay, margin: '0 0 22px',
              textTransform: 'uppercase', letterSpacing: '0.01em',
            }}>
              {titleToDisplay}
            </h1>

            <p style={{ fontSize: 15, fontWeight: 500, color: muted, marginBottom: 6 }}>
              This certifies that
            </p>

            <h2 style={{
              fontSize: 68, fontWeight: 900, lineHeight: 1.05,
              color: ink, fontFamily: fontDisplay, margin: '0 0 10px',
              maxWidth: 880, wordBreak: 'break-word',
            }}>
              {studentName}
            </h2>

            {/* Flourish divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 90, height: 2, backgroundColor: rule }} />
              <div style={{ width: 7, height: 7, transform: 'rotate(45deg)', backgroundColor: primaryColor }} />
              <div style={{ width: 90, height: 2, backgroundColor: rule }} />
            </div>

            <p style={{ fontSize: 17, fontWeight: 700, color: ink, marginBottom: 14 }}>
              for outstanding contribution in <span style={{ color: primaryColor }}>{title}</span>
            </p>

            <p style={{ fontSize: 14.5, lineHeight: 1.75, maxWidth: 700, color: muted }}>
              {bodyToDisplay}
            </p>
          </div>

          {/* ══════════════ FOOTER BAR ══════════════ */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            zIndex: 10,
            borderTop: `1px solid ${rule}`,
            padding: '18px 56px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}>
            {/* Cert ID, left */}
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase', marginBottom: 4 }}>
                Certificate ID
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: ink, fontFamily: fontMono }}>
                {certificateId}
              </p>
            </div>

            {/* Issuer note, center */}
            <p style={{ fontSize: 11, color: muted, textAlign: 'center' }}>
              Issued by SkillValix · MSME Registered · skillvalix.com
            </p>

            {/* QR, right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase' }}>
                  Scan to
                </p>
                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase' }}>
                  Verify
                </p>
              </div>
              <div style={{
                padding: 8, border: `1px solid ${rule}`, borderRadius: 4,
                backgroundColor: '#FFFFFF',
              }}>
                <QRCodeSVG value={verifyUrl} size={64} level="H" fgColor={ink} bgColor="#FFFFFF" />
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