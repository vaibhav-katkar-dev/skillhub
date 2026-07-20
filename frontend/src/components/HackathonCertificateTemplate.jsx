import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VERIFIED_STAMP_BASE64 } from './verified-base64';

/**
 * HackathonCertificateTemplate — v3
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

    // Rank badge visual config for top 3 winners.
    // Design note: the badge circle only carries the number + icon.
    // Rank + "WINNER" text lives once, in the ribbon below — no duplicated labels.
    const rankConfig = {
      '1st': {
        label: '1',
        ribbonLabel: '1ST PLACE',
        icon: 'crown',
        gradient: 'linear-gradient(150deg, #7A5510, #C79A3B, #F0D68C, #FFF6DC, #D9AE4F)',
        ring: '#8A6212',
        glow: 'rgba(216,169,79,0.55)',
        textColor: '#3E2A08',
      },
      '2nd': {
        label: '2',
        ribbonLabel: '2ND PLACE',
        icon: 'medal',
        gradient: 'linear-gradient(150deg, #6B7280, #A7ADB8, #DDE1E6, #F7F8FA, #C3C8CF)',
        ring: '#7C828B',
        glow: 'rgba(160,167,177,0.5)',
        textColor: '#1F2937',
      },
      '3rd': {
        label: '3',
        ribbonLabel: '3RD PLACE',
        icon: 'medal',
        gradient: 'linear-gradient(150deg, #7C4A1E, #B67A3F, #DDA36E, #F2CFA8, #C6853F)',
        ring: '#8A5424',
        glow: 'rgba(198,133,63,0.5)',
        textColor: '#3D2004',
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

    // RANK BADGE for top 3 winners — a clean medal disc (icon + big number only)
    // with a single ribbon underneath carrying the rank + "winner" text.
    // This replaces the old version, which crammed icon + number + subtitle
    // into one small circle and then repeated the same message in a second
    // ribbon below — that duplication is what made it feel busy/unpolished.
    const renderRankBadge = () => {
      if (!currentRank) return null;

      const discSize = 108;

      const renderCrown = () => (
        <svg width="26" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 19h20v2.4H2V19zm1.5-13.4l4.5 5.2L12 5.6l4 5.2 4.5-5.2-1 10.4h-15l-1-10.4z"
            fill="#FFFDF4"
            stroke={currentRank.textColor}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      );

      const renderMedal = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 3h7l-2.6 6.4h-1.8L8.5 3z" fill="#FFFDF4" opacity="0.85" />
          <circle cx="12" cy="15" r="6.5" fill="none" stroke="#FFFDF4" strokeWidth="1.4" />
          <circle cx="12" cy="15" r="4.2" fill="#FFFDF4" opacity="0.9" />
        </svg>
      );

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: discSize,
              height: discSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Soft glow behind the disc */}
            <div
              style={{
                position: 'absolute',
                inset: -10,
                borderRadius: '50%',
                background: currentRank.glow,
                filter: 'blur(14px)',
              }}
            />
            {/* Medal disc */}
            <div
              style={{
                position: 'relative',
                width: discSize,
                height: discSize,
                borderRadius: '50%',
                background: currentRank.gradient,
                border: `3px solid ${parchment}`,
                boxShadow: `0 6px 22px ${currentRank.glow}, inset 0 -3px 6px rgba(0,0,0,0.18), inset 0 2px 3px rgba(255,255,255,0.55), 0 0 0 1px ${currentRank.ring}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0,
              }}
            >
              {currentRank.icon === 'crown' ? renderCrown() : renderMedal()}
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  fontFamily: fontDisplay,
                  color: currentRank.textColor,
                  lineHeight: 1,
                  marginTop: -2,
                  textShadow: '0 1px 1px rgba(255,255,255,0.35)',
                }}
              >
                {currentRank.label}
              </span>
            </div>
          </div>

          {/* Ribbon — the single place rank + "winner" language appears */}
          <div
            style={{
              marginTop: -8,
              padding: '5px 20px',
              borderRadius: 20,
              background: currentRank.gradient,
              boxShadow: `0 4px 12px ${currentRank.glow}`,
              border: `1px solid ${parchment}`,
            }}
          >
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 900,
                letterSpacing: '0.18em',
                color: currentRank.textColor,
                whiteSpace: 'nowrap',
              }}
            >
              {currentRank.ribbonLabel} · WINNER
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

          {/* Medallion / Rank Badge — overlaps the band's lower edge, centered.
              Offset is computed from the actual rendered element height so the
              circuit medallion (120px) and rank disc (~140px incl. ribbon)
              both sit visually centered on the band edge, not just eyeballed. */}
          <div
            style={{
              position: 'absolute',
              top: currentRank ? 132 - 108 / 2 - 14 : 132 - 60,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {currentRank ? (
              /* ── Clean medal disc + single ribbon for 1st/2nd/3rd ── */
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
              marginTop: currentRank ? 128 : 108,
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