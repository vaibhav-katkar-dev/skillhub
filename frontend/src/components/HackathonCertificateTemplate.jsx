import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VERIFIED_STAMP_BASE64 } from './verified-base64';

/**
 * HackathonCertificateTemplate — v2
 * 100% inline styles, zero Tailwind dependency.
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

    // Winner: differentiate 1st/2nd/3rd vs other winners, keep participation text safe.
    const normalizedWinnerRank = (winnerRank || '').toLowerCase().trim();
    const isTop3Winner = ['1st', '2nd', '3rd'].includes(normalizedWinnerRank);
    const top3Label = isTop3Winner
      ? (normalizedWinnerRank === '1st'
        ? '1st Prize'
        : normalizedWinnerRank === '2nd'
          ? '2nd Prize'
          : '3rd Prize')
      : (winnerRank || 'Winner');

    // Rank badge visual config for top 3 winners
    const rankConfig = {
      '1st': {
        label: '1ST',
        subtitle: 'PRIZE',
        icon: 'crown',
        gradient: 'linear-gradient(145deg, #6B4C0A, #B8892B, #E8C876, #FFF2C8, #E8C876)',
        glow: 'rgba(232,200,118,0.5)',
        textColor: '#3E2A08',
        medalColor: '#D4A017',
        size: 88,
      },
      '2nd': {
        label: '2ND',
        subtitle: 'PRIZE',
        icon: 'medal',
        gradient: 'linear-gradient(145deg, #6B7280, #9CA3AF, #D1D5DB, #F3F4F6, #D1D5DB)',
        glow: 'rgba(156,163,175,0.5)',
        textColor: '#1F2937',
        medalColor: '#9CA3AF',
        size: 82,
      },
      '3rd': {
        label: '3RD',
        subtitle: 'PRIZE',
        icon: 'medal',
        gradient: 'linear-gradient(145deg, #78350F, #A0522D, #CD7F32, #E6A873, #CD7F32)',
        glow: 'rgba(205,127,50,0.5)',
        textColor: '#451A03',
        medalColor: '#CD7F32',
        size: 82,
      },
    };
    const currentRank = isTop3Winner ? rankConfig[normalizedWinnerRank] : null;

    const defaultTitle = isWinnerType ? 'OF ACHIEVEMENT' : 'OF PARTICIPATION';
    const defaultBody = isWinnerType
      ? isTop3Winner
        ? `Presented in recognition of securing ${top3Label} in ${title}, for exceptional innovation, technical craft, and outstanding teamwork as a member of team "${teamName || 'Solo'}".`
        : `Presented in recognition of securing ${winnerRank || 'Winner'} in ${title}, for exceptional innovation, technical craft, and teamwork as a member of team "${teamName || 'Solo'}".`
      : `Presented in recognition of active, valuable participation in ${title}, for creativity, technical problem-solving, and collaboration as a member of team "${teamName || 'Solo'}".`;

    const titleToDisplay = customTitle || defaultTitle;
    const bodyToDisplay = customBody || defaultBody;

    // Long custom titles/names would otherwise wrap onto extra lines and push the paragraph into footer.
    const titleFontSize = titleToDisplay.length > 55 ? 32 : titleToDisplay.length > 38 ? 40 : 54;
    const nameFontSize = studentName?.length > 28 ? 44 : studentName?.length > 18 ? 56 : 68;

    const renderCornerBracket = (corner) => {
      const size = 34;
      const thickness = 3;
      const positions = {
        tl: { top: 18, left: 18 },
        tr: { top: 18, right: 18 },
        bl: { bottom: 18, left: 18 },
        br: { bottom: 18, right: 18 }
      };
      const isTop = corner === 'tl' || corner === 'tr';
      const isLeft = corner === 'tl' || corner === 'bl';

      return (
        <div style={{ position: 'absolute', width: size, height: size, zIndex: 15, ...positions[corner] }}>
          <div
            style={{
              position: 'absolute',
              [isTop ? 'top' : 'bottom']: 0,
              [isLeft ? 'left' : 'right']: 0,
              width: size,
              height: thickness,
              backgroundColor: primaryColor
            }}
          />
          <div
            style={{
              position: 'absolute',
              [isTop ? 'top' : 'bottom']: 0,
              [isLeft ? 'left' : 'right']: 0,
              width: thickness,
              height: size,
              backgroundColor: primaryColor
            }}
          />
        </div>
      );
    };

    const renderCircuitMedallion = () => {
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
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={i % 2 === 0 ? 2.5 : 1.5}
              fill={i % 2 === 0 ? primaryColor : 'rgba(255,255,255,0.5)'}
            />
          ))}
          <text
            x="60"
            y="68"
            textAnchor="middle"
            fontFamily={fontMono}
            fontSize="22"
            fontWeight="700"
            fill="#FFFFFF"
          >
            {'</>'}
          </text>
        </svg>
      );
    };

    // RANK BADGE for top 3 winners — bold, eye-catching hero element
    const renderRankBadge = () => {
      if (!currentRank) return null;

      const size = Math.max(currentRank.size || 82, 72);
      const fontSize = Math.round(size * 0.52);
      const subtitleSize = Math.round(size * 0.18);

      // Crown icon SVG for 1st place
      const renderCrown = () => (
        <svg width={size * 0.32} height={size * 0.28} viewBox="0 0 24 24" fill="none" style={{ marginBottom: 2 }}>
          <path
            d="M2 19h20v3H2v-3zm1.5-15l4.5 5.5L12 5l4 4.5L20.5 4l-1 12h-15l-1-12z"
            fill="#FFF2C8"
            stroke="#6B4C0A"
            strokeWidth="0.8"
          />
        </svg>
      );

      // Medal icon SVG for 2nd/3rd place
      const renderMedal = (color) => (
        <svg width={size * 0.26} height={size * 0.26} viewBox="0 0 24 24" fill="none" style={{ marginBottom: 2 }}>
          <circle cx="12" cy="16" r="5" fill={color} stroke="#FFFFFF" strokeWidth="1" />
          <path d="M12 13l1 2h-2l1-2z" fill="#FFFFFF" opacity="0.4" />
          <path
            d="M9 10l-1-8h8l-1 8"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill={color}
            fillOpacity="0.3"
          />
        </svg>
      );

      const iconSize = size;

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* The rank badge itself */}
          <div
            style={{
              position: 'relative',
              width: iconSize + 24,
              height: iconSize + 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer glow ring */}
            <div
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                background: currentRank.glow,
                filter: 'blur(12px)',
                opacity: 0.6,
              }}
            />
            {/* Main badge circle */}
            <div
              style={{
                width: iconSize + 16,
                height: iconSize + 16,
                borderRadius: '50%',
                background: currentRank.gradient,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${currentRank.glow}, inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)`,
                border: '3px solid rgba(255,255,255,0.6)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Rank icon */}
              {currentRank.icon === 'crown' ? renderCrown() : renderMedal(currentRank.medalColor)}

              {/* Rank number */}
              <span
                style={{
                  fontSize,
                  fontWeight: 900,
                  fontFamily: fontDisplay,
                  color: currentRank.textColor,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                }}
              >
                {currentRank.label}
              </span>

              {/* Subtitle */}
              <span
                style={{
                  fontSize: subtitleSize,
                  fontWeight: 800,
                  fontFamily: fontSans,
                  color: currentRank.textColor,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  marginTop: -2,
                }}
              >
                {currentRank.subtitle}
              </span>
            </div>
          </div>

          {/* Ribbon label below badge */}
          <div
            style={{
              padding: '4px 22px',
              borderRadius: 20,
              background: currentRank.gradient,
              boxShadow: `0 4px 14px ${currentRank.glow}`,
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.25em',
                color: currentRank.textColor,
                textTransform: 'uppercase',
              }}
            >
              {ribbonText}
            </span>
          </div>
        </div>
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
          pointerEvents: 'none'
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
            boxSizing: 'border-box'
          }}
        >
          {/* Corner brackets — signature framing device instead of nested borders */}
          {renderCornerBracket('tl')}
          {renderCornerBracket('tr')}
          {renderCornerBracket('bl')}
          {renderCornerBracket('br')}

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
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 96 }}>
              {['SKILLVALIX · HACKATHON', 'SKILLVALIX · HACKATHON'].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 90,
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    whiteSpace: 'nowrap',
                    color: ink,
                    fontFamily: fontDisplay,
                    lineHeight: 1
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Top gradient band */}
          <div
            style={{
              position: 'relative',
              height: 132,
              width: '100%',
              background: bandGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 56px',
              boxSizing: 'border-box',
              zIndex: 5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src="/logo.svg"
                crossOrigin="anonymous"
                alt="SkillValix Logo"
                width="48"
                height="48"
                style={{ objectFit: 'contain' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', fontFamily: fontDisplay, lineHeight: 1 }}>
                  SkillValix
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.28em',
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase'
                  }}
                >
                  Hackathon Portal
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.65)',
                    textTransform: 'uppercase',
                    marginBottom: 4
                  }}
                >
                  Issued On
                </p>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', fontFamily: fontMono, margin: 0 }}>
                  {issueDate}
                </p>
              </div>
              <img src={VERIFIED_STAMP_BASE64} alt="Verified Stamp" width="52" height="52" style={{ objectFit: 'contain' }} />
            </div>
          </div>

          {/* Medallion / Rank Badge — overlaps the band's lower edge, centered */}
          <div
            style={{
              position: 'absolute',
              top: currentRank ? (132 - 100) : (132 - 60),
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {currentRank ? (
              /* ── PROMINENT RANK BADGE for 1st/2nd/3rd ── */
              renderRankBadge()
            ) : (
              /* ── Standard circuit medallion for participation / non-top-3 winners ── */
              <>
                {renderCircuitMedallion()}
                <div
                  style={{
                    marginTop: -6,
                    padding: '3px 14px',
                    borderRadius: 20,
                    backgroundColor: primaryColor,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#FFFFFF' }}>
                    {ribbonText}
                    {isWinnerType && winnerRank ? ` · ${winnerRank}` : ''}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Center content */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: 108,
              padding: '0 90px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.4em',
                color: primaryColor,
                textTransform: 'uppercase',
                marginBottom: 6
              }}
            >
              Certificate
            </p>

            <h1
              style={{
                fontSize: titleFontSize,
                fontWeight: 900,
                lineHeight: 1.15,
                color: ink,
                fontFamily: fontDisplay,
                margin: '0 0 18px',
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: 900
              }}
            >
              {titleToDisplay}
            </h1>

            <p style={{ fontSize: 15, fontWeight: 500, color: muted, marginBottom: 6 }}>This certifies that</p>

            <h2
              style={{
                fontSize: nameFontSize,
                fontWeight: 900,
                lineHeight: 1.1,
                color: ink,
                fontFamily: fontDisplay,
                margin: '0 0 10px',
                maxWidth: 880,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
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

            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.7,
                maxWidth: 700,
                color: muted,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {bodyToDisplay}
            </p>
          </div>

          {/* Footer bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              borderTop: `1px solid ${rule}`,
              padding: '18px 56px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: muted,
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}
              >
                Certificate ID
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: ink, fontFamily: fontMono, margin: 0 }}>{certificateId}</p>
            </div>

            <p style={{ fontSize: 11, color: muted, textAlign: 'center', margin: 0 }}>
              Issued by SkillValix · MSME Registered · skillvalix.com
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: muted,
                  textTransform: 'uppercase',
                  margin: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                Scan to<br />verify
              </p>
              <div style={{ padding: 8, border: `1px solid ${rule}`, borderRadius: 4, backgroundColor: '#FFFFFF', lineHeight: 0 }}>
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

