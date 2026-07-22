import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock3,
  CreditCard,
  ExternalLink,
  FileText,
  Github,
  HardDriveUpload,
  Link2,
  Lock,
  Loader2,
  Plus,
  Send,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Linkedin,
  X,
  Award,
  Download,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCheck,
  Rocket,
  Target,
  Zap,
  Crown,
  Sparkles,
  Layers,
  HelpCircle,
  FileCode,
  Info,
  Calendar,
  DollarSign,
  Medal,
} from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';
import { generatePDFFromDOM } from '../utils/pdfGenerator';
import HackathonCertificateTemplate from '../components/HackathonCertificateTemplate';

const STATUS_STYLE = {
  upcoming: { bg: '#fef3c7', text: '#92400e', border: '#fbbf24', dot: '#f59e0b', label: 'Upcoming', icon: Clock3 },
  live:     { bg: '#d1fae5', text: '#065f46', border: '#34d399', dot: '#10b981', label: 'Live Now', icon: CircleDot },
  ended:    { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', dot: '#94a3b8', label: 'Ended',    icon: CheckCircle2 },
};

const REG_STATUS_STYLE = {
  registered:      { bg: '#eef2ff', text: '#4338ca', label: 'Registered' },
  payment_pending: { bg: '#fffbeb', text: '#92400e', label: 'Payment Pending' },
  submitted:       { bg: '#f0f9ff', text: '#0369a1', label: 'Submitted' },
  under_review:    { bg: '#f5f3ff', text: '#6d28d9', label: 'Under Review' },
  approved:        { bg: '#ecfdf5', text: '#065f46', label: 'Approved' },
  rejected:        { bg: '#fef2f2', text: '#991b1b', label: 'Rejected' },
  winner:          { bg: '#fef3c7', text: '#78350f', label: 'Winner' },
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ── Step indicator ─────────────────────────────────────── */
function StepBar({ step, steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#10b981' : active ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9',
                border: `2px solid ${done ? '#10b981' : active ? '#4f46e5' : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done || active ? '#fff' : '#94a3b8',
                fontSize: 12, fontWeight: 900,
                boxShadow: active ? '0 4px 14px rgba(79,70,229,0.35)' : 'none',
                transition: 'all 0.25s',
              }}>
                {done ? <CheckCheck size={14} /> : i + 1}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, marginTop: 4,
                color: done ? '#10b981' : active ? '#4f46e5' : '#94a3b8',
                whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                height: 2, flex: 1, marginBottom: 16,
                background: done ? '#10b981' : '#e2e8f0',
                transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Snapshot Row Item ──────────────────────────────────── */
function SnapshotItem({ icon: Icon, label, value, sub, color = '#6366f1' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 14px', borderRadius: 12, background: '#f8fafc',
      border: '1.5px solid #f1f5f9', marginBottom: 8, transition: 'transform 0.2s, border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: color + '15', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} color={color} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{label}</div>
          {sub && <div style={{ fontSize: 10, color: '#94a3b8' }}>{sub}</div>}
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', textAlign: 'right' }}>
        {value}
      </div>
    </div>
  );
}

/* ── Section card ───────────────────────────────────────── */
function Card({ id, title, icon: Icon, iconColor, children, accent, extra }) {
  return (
    <div id={id} style={{
      background: '#fff', border: `1.5px solid ${accent || '#e2e8f0'}`,
      borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
      scrollMarginTop: 100,
      transition: 'box-shadow 0.2s',
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 22px', borderBottom: '1px solid #f1f5f9',
          background: accent ? accent + '08' : '#fafafa',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {Icon && (
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: (iconColor || '#6366f1') + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={15} color={iconColor || '#6366f1'} />
              </div>
            )}
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>{title}</h3>
          </div>
          {extra}
        </div>
      )}
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  );
}

/* ── Digital Glassmorphic Countdown Box ──────────────────── */
function DigitalCountdown({ label, days, hours, minutes, seconds }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#0f172a,#1e1b4b)',
      borderRadius: 18, padding: '20px 20px', textAlign: 'center',
      boxShadow: '0 8px 28px rgba(30,27,75,0.35)', border: '1px solid rgba(255,255,255,0.1)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(30px)' }} />
      <div style={{ fontSize: 10, fontWeight: 900, color: '#a5b4fc', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <Clock3 size={11} /> {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {[
          { val: days, label: 'Days' },
          { val: hours, label: 'Hours' },
          { val: minutes, label: 'Mins' },
          { val: seconds, label: 'Secs' },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
            padding: '8px 2px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{item.val}</div>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Custom Animated FAQ Accordion ───────────────────────── */
function FAQAccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={{
      background: isOpen ? '#ffffff' : '#fafafa',
      border: `1.5px solid ${isOpen ? '#c7d2fe' : '#f1f5f9'}`,
      borderRadius: 14, overflow: 'hidden', transition: 'all 0.25s ease',
      boxShadow: isOpen ? '0 4px 14px rgba(79,70,229,0.06)' : 'none',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '14px 18px', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 14, fontWeight: 800, color: isOpen ? '#4f46e5' : '#0f172a', gap: 12,
        }}
      >
        <span>{question}</span>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: isOpen ? '#eef2ff' : '#f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
        }}>
          <ChevronDown size={14} color={isOpen ? '#4f46e5' : '#64748b'} />
        </div>
      </button>
      {isOpen && (
        <div style={{
          padding: '0 18px 16px', fontSize: 13, color: '#475569', lineHeight: 1.7,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}

/* ── Prize Card Item Component ─────────────────────────────── */
function PrizeCardItem({ prize, idx }) {
  const rankText = String(prize.rank || '').toLowerCase();
  const isFirst = idx === 0 || rankText.includes('1st') || rankText.includes('winner');
  const isSecond = idx === 1 || rankText.includes('2nd') || rankText.includes('runner up');
  const isThird = idx === 2 || rankText.includes('3rd');

  const theme = isFirst ? {
    bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
    border: '#fde68a',
    badgeBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
    badgeText: '#fff',
    titleColor: '#78350f',
    iconBg: '#fff',
    iconColor: '#d97706',
    icon: Crown,
    perkIconColor: '#d97706',
  } : isSecond ? {
    bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)',
    border: '#cbd5e1',
    badgeBg: '#64748b',
    badgeText: '#fff',
    titleColor: '#1e293b',
    iconBg: '#fff',
    iconColor: '#64748b',
    icon: Trophy,
    perkIconColor: '#475569',
  } : isThird ? {
    bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
    border: '#fed7aa',
    badgeBg: '#d97706',
    badgeText: '#fff',
    titleColor: '#7c2d12',
    iconBg: '#fff',
    iconColor: '#d97706',
    icon: Medal,
    perkIconColor: '#c2410c',
  } : {
    bg: '#ffffff',
    border: '#e2e8f0',
    badgeBg: '#6366f1',
    badgeText: '#fff',
    titleColor: '#0f172a',
    iconBg: '#eef2ff',
    iconColor: '#6366f1',
    icon: Award,
    perkIconColor: '#4f46e5',
  };

  const PrizeIcon = theme.icon;

  const amountStr = String(prize.amount || '').trim();
  const descStr = String(prize.description || '').trim();

  let combined = amountStr;
  if (descStr && descStr !== 'Certificate of Merit, Goodies & SkillValix Badge') {
    if (!amountStr.includes(descStr)) {
      combined = combined ? `${combined} + ${descStr}` : descStr;
    }
  }

  const rawPerks = combined
    .split(/\+|\n|;/)
    .map(p => p.trim())
    .filter(Boolean);

  const perks = rawPerks.length > 0 ? rawPerks : [amountStr || descStr || 'Certificate of Merit & SkillValix Recognition'];

  return (
    <div style={{
      background: theme.bg,
      border: `2px solid ${theme.border}`,
      borderRadius: 18,
      padding: '20px',
      boxShadow: isFirst ? '0 8px 24px rgba(245,158,11,0.14)' : '0 2px 10px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: theme.iconBg, border: `1.5px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <PrizeIcon size={22} color={theme.iconColor} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: theme.titleColor }}>
                {prize.rank || `Prize Tier ${idx + 1}`}
              </span>
              {isFirst && <span style={{ background: theme.badgeBg, color: theme.badgeText, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 12, boxShadow: '0 2px 6px rgba(245,158,11,0.3)' }}>1ST PLACE</span>}
              {isSecond && <span style={{ background: theme.badgeBg, color: theme.badgeText, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 12 }}>2ND PLACE</span>}
              {isThird && <span style={{ background: theme.badgeBg, color: theme.badgeText, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 12 }}>3RD PLACE</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Perks / Benefits Items */}
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {perks.map((perk, pIdx) => {
          const isCash = /₹|\$|cash|prize/i.test(perk);
          return (
            <div key={pIdx} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              fontSize: isCash ? 15 : 13,
              fontWeight: isCash ? 900 : 700,
              color: isCash ? theme.titleColor : '#334155',
              lineHeight: 1.5,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7,
                background: isCash ? theme.badgeBg : '#eef2ff',
                color: isCash ? '#fff' : '#4f46e5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1, fontSize: 11, fontWeight: 900,
              }}>
                {isCash ? '₹' : <Sparkles size={12} color={theme.perkIconColor} />}
              </div>
              <span style={{ flex: 1, wordBreak: 'break-word' }}>{perk}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HackathonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [hack, setHack] = useState(null);
  const [loadingHack, setLoadingHack] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [loadingReg, setLoadingReg] = useState(false);
  const [winners, setWinners] = useState(null);

  // Certificate
  const [certificate, setCertificate] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [prepState, setPrepState] = useState(null);
  const [exportCert, setExportCert] = useState(null);
  const hackCertTemplateRef = useRef(null);

  // Multi-step registration
  const [regStep, setRegStep] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]);

  // Submission
  const [submissionLink, setSubmissionLink] = useState('');
  const [note, setNote] = useState('');

  const [busy, setBusy] = useState(false);
  const payingRef = useRef(false);
  const [msg, setMsg] = useState({ text: '', tone: 'info' });

  // Navigation mode & active section
  const [activeSection, setActiveSection] = useState('all');
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const rules = useMemo(() => hack?.contentConfig?.rules || [], [hack]);
  const judgingCriteria = useMemo(() => hack?.contentConfig?.judgingCriteria || [], [hack]);
  const timeline = useMemo(() => hack?.contentConfig?.timeline || [], [hack]);
  const prizes = useMemo(() => hack?.prizes || [], [hack]);
  const faqs = useMemo(() => hack?.contentConfig?.faqs || [], [hack]);
  const problemStatement = useMemo(() => hack?.contentConfig?.problemStatement || '', [hack]);
  const submissionInstructions = useMemo(() => hack?.submissionConfig?.instructions || '', [hack]);

  const statusStyle = STATUS_STYLE[hack?.status] || STATUS_STYLE.upcoming;
  const StatusIcon = statusStyle.icon;
  const showMsg = (text, tone = 'info') => setMsg({ text, tone });

  const fetchHack = useCallback(async () => {
    setLoadingHack(true);
    try { const r = await api.get(`/events/hackathons/${id}`); setHack(r.data); }
    catch { setHack(null); }
    finally { setLoadingHack(false); }
  }, [id]);

  const fetchMyTeam = useCallback(async () => {
    if (!isAuthenticated || !hack?._id) { setRegistration(null); return; }
    setLoadingReg(true);
    try { const r = await api.get(`/events/hackathons/${hack._id}/my-team`); setRegistration(r.data); }
    catch { setRegistration(null); }
    finally { setLoadingReg(false); }
  }, [hack?._id, isAuthenticated]);

  const fetchWinners = useCallback(async () => {
    try { const r = await api.get(`/events/hackathons/${id}/winners`); setWinners(r.data); }
    catch { setWinners(null); }
  }, [id]);

  const fetchMyCertificate = useCallback(async () => {
    if (!isAuthenticated || !hack?._id) { setCertificate(null); return; }
    setLoadingCert(true);
    try { const r = await api.get(`/events/hackathons/${hack._id}/my-certificate`); setCertificate(r.data); }
    catch { setCertificate(null); }
    finally { setLoadingCert(false); }
  }, [hack?._id, isAuthenticated]);

  useEffect(() => { fetchHack(); }, [fetchHack]);
  useEffect(() => { fetchMyTeam(); }, [fetchMyTeam]);
  useEffect(() => { if (hack?.winnerConfig?.announced) fetchWinners(); }, [hack, fetchWinners]);
  useEffect(() => { fetchMyCertificate(); }, [hack?._id, fetchMyCertificate]);

  const teamMax = Number(hack?.teamConfig?.maxMembers || 4);
  const teamMin = Number(hack?.teamConfig?.minMembers || 1);

  const addMemberRow = () => { if (members.length < teamMax - 1) setMembers(prev => [...prev, { name: '', email: '' }]); };
  const removeMemberRow = (idx) => setMembers(prev => prev.filter((_, i) => i !== idx));
  const updateMember = (idx, field, val) => setMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: val } : m));

  // Countdown timer calculation
  const [timeObj, setTimeObj] = useState({ label: '', days: '00', hours: '00', minutes: '00', seconds: '00', ended: false });

  const isSubmissionOpen = useMemo(() => {
    if (hack?.status === 'ended') return false;
    const d = hack?.submissionDeadline ? new Date(hack.submissionDeadline).getTime() : hack?.endDate ? new Date(hack.endDate).getTime() : null;
    return !d || Date.now() < d;
  }, [hack]);

  const isRegistrationOpen = useMemo(() => {
    if (hack?.status === 'ended') return false;
    const d = hack?.registrationDeadline ? new Date(hack.registrationDeadline).getTime() : hack?.endDate ? new Date(hack.endDate).getTime() : null;
    return !d || Date.now() < d;
  }, [hack]);

  useEffect(() => {
    if (hack?.status === 'ended') {
      setTimeObj({ label: 'Ended', days: '00', hours: '00', minutes: '00', seconds: '00', ended: true });
      return;
    }
    const reg = hack?.registrationDeadline ? new Date(hack.registrationDeadline).getTime() : hack?.endDate ? new Date(hack.endDate).getTime() : null;
    const sub = hack?.submissionDeadline ? new Date(hack.submissionDeadline).getTime() : hack?.endDate ? new Date(hack.endDate).getTime() : null;
    if (!reg && !sub) { setTimeObj(prev => ({ ...prev, ended: false, label: '' })); return; }

    const tick = () => {
      const now = Date.now();
      let diff = 0, label = '';
      if (reg && now < reg) { diff = reg - now; label = 'Registration closes in'; }
      else if (sub && now < sub) { diff = sub - now; label = 'Submission closes in'; }
      else { setTimeObj({ label: 'Ended', days: '00', hours: '00', minutes: '00', seconds: '00', ended: true }); return; }

      const d = Math.floor(diff / 86400000).toString().padStart(2, '0');
      const h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0');
      const m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTimeObj({ label, days: d, hours: h, minutes: m, seconds: s, ended: false });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hack]);

  // Available sections for navigation bar
  const navSections = useMemo(() => [
    { id: 'all', label: 'All', icon: Layers, show: true },
    { id: 'overview', label: 'Overview', icon: Info, show: !!hack?.description },
    { id: 'problem', label: 'Problem', icon: Target, show: !!problemStatement },
    { id: 'prizes', label: 'Prizes', icon: Trophy, show: prizes.length > 0 },
    { id: 'timeline', label: 'Timeline', icon: Clock3, show: timeline.length > 0 },
    { id: 'rules', label: 'Rules', icon: ShieldCheck, show: rules.length > 0 },
    { id: 'judging', label: 'Judging', icon: Star, show: judgingCriteria.length > 0 },
    { id: 'submission', label: 'Submission', icon: FileCode, show: !!submissionInstructions },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, show: faqs.length > 0 },
  ].filter(s => s.show), [hack?.description, problemStatement, prizes, timeline, rules, judgingCriteria, submissionInstructions, faqs]);

  // IntersectionObserver to highlight active nav pill when in 'all' mode
  const [observedActiveSec, setObservedActiveSec] = useState('all');

  useEffect(() => {
    if (activeSection !== 'all') return;

    const sections = navSections.filter(s => s.id !== 'all').map(s => document.getElementById(s.id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setObservedActiveSec(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [activeSection, navSections]);

  const handleNavClick = (secId) => {
    if (secId === 'all') {
      setActiveSection('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeSection === 'all') {
      const el = document.getElementById(secId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setActiveSection(secId);
    }
  };

  // Registration handler
  const handleRegisterTeam = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const trimmed = String(teamName || '').trim();
    if (trimmed.length < 3) { showMsg('Team name must be at least 3 characters.', 'error'); return; }
    const filled = members.filter(m => m.email.trim());
    for (const m of filled) {
      if (!m.name.trim()) { showMsg('Please enter a name for every teammate you added.', 'error'); return; }
    }
    setBusy(true);
    showMsg('Registering your team…', 'info');
    try {
      await api.post(`/events/hackathons/${hack._id}/register`, {
        teamName: trimmed,
        memberEmails: filled.map(m => m.email.trim()),
      });
      await fetchMyTeam();
      showMsg('Team registered successfully! You are the team leader.', 'success');
      setTeamName(''); setMembers([{ name: '', email: '' }]); setRegStep(0);
    } catch (err) {
      const missing = err.response?.data?.missingEmails;
      if (Array.isArray(missing) && missing.length)
        showMsg(`These emails are not registered SkillValix users: ${missing.join(', ')}`, 'error');
      else showMsg(err.response?.data?.message || 'Failed to register team.', 'error');
    } finally { setBusy(false); }
  };

  // Payment
  const handlePay = async () => {
    if (!registration || payingRef.current) return;
    payingRef.current = true; setBusy(true);
    const loaded = await loadRazorpay();
    if (!loaded) { showMsg('Payment gateway failed to load.', 'error'); payingRef.current = false; setBusy(false); return; }
    try {
      const orderRes = await api.post(`/events/hackathons/${hack._id}/razorpay-order`, { registrationId: registration._id });
      const order = orderRes.data;
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) { showMsg('Payment system not configured.', 'error'); payingRef.current = false; setBusy(false); return; }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency, order_id: order.id,
        name: 'SkillValix', description: `Hackathon Registration: ${hack?.title || ''}`,
        theme: { color: '#4F46E5' },
        handler: async (res) => {
          try {
            await api.post(`/events/hackathons/${hack._id}/payment/verify`, { registrationId: registration._id, ...res });
            await fetchMyTeam(); showMsg('Payment successful. Submission is now unlocked!', 'success');
          } catch (e) { showMsg(e.response?.data?.message || 'Payment verification failed.', 'error'); }
          finally { payingRef.current = false; setBusy(false); }
        },
        modal: { ondismiss: () => { payingRef.current = false; setBusy(false); } },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => { showMsg(r?.error?.description || 'Payment failed.', 'error'); payingRef.current = false; setBusy(false); });
      rzp.open();
    } catch (err) { showMsg(err.response?.data?.message || 'Could not initiate payment.', 'error'); payingRef.current = false; setBusy(false); }
  };

  const isDriveLink = (url) => { try { return new URL(url).hostname.includes('drive.google.com'); } catch { return false; } };
  const isPdfLink  = (url) => /\.pdf(\?|#|$)/i.test(url);
  const isGitHub   = (url) => { try { const h = new URL(url).hostname; return h === 'github.com' || h.endsWith('.github.com'); } catch { return false; } };
  const isNotion   = (url) => { try { const h = new URL(url).hostname; return h.includes('notion.site') || h.includes('notion.so'); } catch { return false; } };

  const handleSubmit = async () => {
    if (!registration) return;
    const link = String(submissionLink || '').trim();
    if (!link) { showMsg('Submission link is required.', 'error'); return; }
    try { new URL(link); } catch { showMsg('Please enter a valid URL.', 'error'); return; }
    const cfg = hack?.submissionConfig || {};
    if (!cfg.acceptsAnyLink) {
      const ok = (cfg.acceptsDriveLink && isDriveLink(link)) || (cfg.acceptsPdfLink && isPdfLink(link)) || (cfg.acceptsGitHubLink && isGitHub(link)) || (cfg.acceptsNotionLink && isNotion(link));
      if (!ok) {
        const allowed = [];
        if (cfg.acceptsGitHubLink) allowed.push('GitHub');
        if (cfg.acceptsNotionLink) allowed.push('Notion');
        if (cfg.acceptsDriveLink)  allowed.push('Google Drive');
        if (cfg.acceptsPdfLink)    allowed.push('PDF link');
        showMsg(`Link type not accepted. Allowed: ${allowed.join(', ')}.`, 'error'); return;
      }
    }
    setBusy(true); showMsg('Submitting your solution…', 'info');
    try {
      await api.post(`/events/hackathons/${hack._id}/submit`, { registrationId: registration._id, submissionLink: link, note: String(note || '').trim() });
      await fetchMyTeam(); showMsg('Solution submitted successfully!', 'success');
      setSubmissionLink(''); setNote('');
    } catch (err) { showMsg(err.response?.data?.message || 'Failed to submit solution.', 'error'); }
    finally { setBusy(false); }
  };

  if (loadingHack) {
    return (
      <div style={{ minHeight: '70vh', background: '#f8fafc', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ height: 320, borderRadius: 20, background: '#e2e8f0', animation: 'pulse 1.4s ease-in-out infinite', marginBottom: 20 }} />
          <div style={{ height: 200, borderRadius: 20, background: '#e2e8f0', animation: 'pulse 1.4s ease-in-out infinite' }} />
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      </div>
    );
  }

  if (!hack) {
    return (
      <div style={{ minHeight: '70vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '48px 40px', textAlign: 'center', maxWidth: 420 }}>
          <Rocket size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 900, color: '#0f172a' }}>Hackathon not found</h2>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>This hackathon may have been removed or the link is incorrect.</p>
          <Link to="/hackathons" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 800, fontSize: 14, padding: '11px 24px', borderRadius: 12, textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Hackathons
          </Link>
        </div>
      </div>
    );
  }

  const paymentRequired = Boolean(hack?.paymentConfig?.enabled && Number(hack?.paymentConfig?.amountInr || 0) > 0);
  const linkLabel = hack?.submissionConfig?.linkLabel || 'Submission Link';
  const linkHint  = hack?.submissionConfig?.linkHint || '';
  const subCfg    = hack?.submissionConfig || {};
  const linkPlaceholder = (() => {
    if (subCfg.linkPlaceholder && subCfg.linkPlaceholder !== 'Paste your submission link here...') return subCfg.linkPlaceholder;
    if (subCfg.acceptsAnyLink) return 'Paste any valid URL here…';
    const h = [];
    if (subCfg.acceptsGitHubLink) h.push('https://github.com/your-org/your-repo');
    if (subCfg.acceptsNotionLink) h.push('https://your-workspace.notion.site/…');
    if (subCfg.acceptsDriveLink)  h.push('https://drive.google.com/…');
    if (subCfg.acceptsPdfLink)    h.push('https://…/report.pdf');
    return h[0] || 'Paste your submission link here…';
  })();

  const acceptedLinkBadges = (() => {
    if (subCfg.acceptsAnyLink) return [{ icon: Link2, label: 'Any URL', color: '#eef2ff', textColor: '#4338ca' }];
    const b = [];
    if (subCfg.acceptsGitHubLink) b.push({ icon: Github, label: 'GitHub', color: '#f8fafc', textColor: '#1e293b' });
    if (subCfg.acceptsNotionLink) b.push({ icon: FileText, label: 'Notion', color: '#fafaf9', textColor: '#292524' });
    if (subCfg.acceptsDriveLink)  b.push({ icon: HardDriveUpload, label: 'Drive', color: '#f0fdf4', textColor: '#166534' });
    if (subCfg.acceptsPdfLink)    b.push({ icon: FileText, label: 'PDF', color: '#fff1f2', textColor: '#9f1239' });
    return b;
  })();

  const canSubmit = registration && (!registration.payment?.required || registration.payment?.status === 'paid') && isSubmissionOpen;
  const regStatusStyle = REG_STATUS_STYLE[registration?.status] || REG_STATUS_STYLE.registered;
  const isLeader = registration && user && String(registration.leader?._id || registration.leader) === String(user._id || user.id);
  const submissionCount = registration?.submissions?.length || 0;
  const maxSubs = Number(hack?.submissionConfig?.maxSubmissionsPerTeam || 3);

  const canonicalPath = hack.slug ? `/hackathons/${hack.slug}` : `/hackathons/${hack._id}`;
  const canonicalUrl  = `https://www.skillvalix.com${canonicalPath}`;

  const REG_STEPS = ['Team Info', 'Add Members', 'Review & Submit'];

  const totalPrizeSum = prizes.reduce((acc, p) => acc + (p.amount || ''), '');

  return (
    <>
      {exportCert && (
        <HackathonCertificateTemplate
          ref={hackCertTemplateRef}
          studentName={user?.name || 'Student'}
          hackathonTitle={hack.title || 'Hackathon'}
          eventTitle={hack.title || 'Hackathon'}
          certificateId={exportCert.certificateId}
          issueDate={new Date(exportCert.issueDate || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          verifyUrl={`${window.location.origin}/verify/${exportCert.certificateId}`}
          certType={exportCert.certType}
          isWinner={exportCert.isWinner}
          winnerRank={exportCert.winnerRank}
          teamName={exportCert.teamName}
          customTitle={exportCert.customTitle}
          customBody={exportCert.customBody}
        />
      )}

      <Helmet>
        <title>{hack.title} | Hackathon | SkillValix</title>
        <meta name="description" content={hack.tagline || hack.description?.slice(0, 155) || 'Join this hackathon on SkillValix'} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${hack.title} | SkillValix Hackathon`} />
        <meta property="og:description" content={hack.tagline || hack.description?.slice(0, 155) || ''} />
        {hack.image && <meta property="og:image" content={hack.image} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="event" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${hack.title} | SkillValix Hackathon`} />
        <meta name="twitter:description" content={hack.tagline || hack.description?.slice(0, 155) || ''} />
        {hack.image && <meta name="twitter:image" content={hack.image} />}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Event',
          name: hack.title,
          description: hack.tagline || hack.description?.slice(0, 155) || 'Participate in this Hackathon on SkillValix.',
          startDate: hack.startDate || hack.createdAt || new Date().toISOString(),
          endDate: hack.endDate || hack.submissionDeadline || hack.registrationDeadline || new Date(Date.now() + 86400000 * 30).toISOString(),
          eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: { '@type': 'VirtualLocation', url: canonicalUrl },
          image: hack.image ? [hack.image] : [],
          organizer: { '@type': 'Organization', name: 'SkillValix', url: 'https://www.skillvalix.com' },
          offers: { '@type': 'Offer', price: hack?.paymentConfig?.amountInr ? String(hack.paymentConfig.amountInr) : '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: canonicalUrl },
        })}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>

        {/* ── Back nav ─────────────────────────────────────────────── */}
        <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <Link to="/hackathons" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
              <ArrowLeft size={14} /> Back to All Hackathons
            </Link>
          </div>
        </div>

        {/* ── Hero Banner Header ───────────────────────────────────── */}
        {hack.image ? (
          <div style={{ position: 'relative', width: '100%', height: 'clamp(260px,40vw,440px)', overflow: 'hidden', background: '#0f172a' }}>
            <img src={hack.image} alt={hack.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Shading Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.2) 100%)' }} />
            {/* Content overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 20px 28px', boxSizing: 'border-box' }}>
              <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: statusStyle.bg, color: statusStyle.text,
                    border: `1px solid ${statusStyle.border}`,
                    fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle.dot, boxShadow: hack.status === 'live' ? `0 0 0 3px ${statusStyle.dot}44` : 'none' }} />
                    {statusStyle.label}
                  </span>
                  {hack.featured && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 20, boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}>
                      <Star size={11} fill="#fff" strokeWidth={0} /> Featured Event
                    </span>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                    <Sparkles size={11} color="#fbbf24" /> SkillValix Hackathon
                  </span>
                </div>
                <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.8rem,4.5vw,2.9rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, textShadow: '0 2px 12px rgba(0,0,0,0.6)', wordBreak: 'break-word' }}>{hack.title}</h1>
                {hack.tagline && <p style={{ margin: 0, fontSize: 16, color: '#e2e8f0', fontWeight: 600, textShadow: '0 1px 6px rgba(0,0,0,0.6)', maxWidth: 800 }}>{hack.tagline}</p>}
              </div>
            </div>
          </div>
        ) : (
          /* Mesh Gradient Header (When no banner image) */
          <div style={{
            background: 'linear-gradient(135deg,#0a0a1a 0%,#1e1b4b 50%,#0f172a 100%)',
            padding: '44px 20px 38px', position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
          }}>
            <div style={{ position: 'absolute', top: '-40%', left: '15%', width: 450, height: 450, borderRadius: '50%', background: 'rgba(79,70,229,0.25)', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', filter: 'blur(90px)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: statusStyle.bg, color: statusStyle.text,
                  border: `1px solid ${statusStyle.border}`,
                  fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle.dot, boxShadow: hack.status === 'live' ? `0 0 0 3px ${statusStyle.dot}44` : 'none' }} />
                  {statusStyle.label}
                </span>
                {hack.featured && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 20 }}>
                    <Star size={10} fill="#fff" strokeWidth={0} /> Featured Event
                  </span>
                )}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.1)', color: '#a5b4fc', border: '1px solid rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                  <Sparkles size={11} color="#fbbf24" /> SkillValix Hackathon
                </span>
              </div>
              <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(1.8rem,4.5vw,2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, wordBreak: 'break-word' }}>{hack.title}</h1>
              {hack.tagline && <p style={{ margin: '0 0 16px', fontSize: 16, color: '#c7d2fe', fontWeight: 600, maxWidth: 800 }}>{hack.tagline}</p>}
              {hack.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {hack.tags.map(t => (
                    <span key={t} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 700, padding: '3px 11px', borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Sticky Section Navigation Bar ────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)',
          borderBottom: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          padding: '10px 20px', overflowX: 'auto', width: '100%', boxSizing: 'border-box',
        }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 6, display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <Layers size={11} /> Sections:
            </span>
            {navSections.map(({ id: secId, label, icon: Icon }) => {
              const isActive = activeSection === secId || (activeSection === 'all' && observedActiveSec === secId);
              return (
                <button
                  key={secId}
                  onClick={() => handleNavClick(secId)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, border: '1.5px solid',
                    borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                    background: isActive ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f8fafc',
                    color: isActive ? '#fff' : '#475569',
                    fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                    boxShadow: isActive ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.borderColor = '#c7d2fe'; }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }
                  }}
                >
                  <Icon size={12} /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Winners Announcement Banner (If Announced) ──────────── */}
        {hack.winnerConfig?.announced && winners?.winners?.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)', borderBottom: '2px solid #fde68a', padding: '22px 20px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1120, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trophy size={20} color="#fff" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#78350f' }}>Official Winners Announced!</h2>
                  {winners.note && <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>{winners.note}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {winners.winners.map(w => (
                  <div key={w._id} style={{
                    background: '#fff', border: '2px solid #fbbf24', borderRadius: 16,
                    padding: '16px 20px', minWidth: 180, flex: '1 1 200px',
                    boxShadow: '0 4px 14px rgba(245,158,11,0.12)',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#f59e0b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Crown size={12} /> {w.winnerRank || 'WINNER'}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>{w.teamName}</div>
                    {w.winnerNote && <div style={{ fontSize: 12, color: '#d97706', fontWeight: 700, marginTop: 4 }}>{w.winnerNote}</div>}
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{(w.members || []).map(m => m.name || m.email).join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Layout Body ─────────────────────────────────────── */}
        <div className="hackathon-detail-grid" style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 20px 60px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start', boxSizing: 'border-box' }}>

          {/* ────── LEFT COLUMN (Main Content Sections) ───────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

            {/* Tags below image if banner exists */}
            {hack.image && hack.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
                {hack.tags.map(t => (
                  <span key={t} style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 20 }}>{t}</span>
                ))}
              </div>
            )}

            {/* 1. Overview */}
            {(activeSection === 'all' || activeSection === 'overview') && hack.description && (
              <div className="hack-section-fade-in" key="overview">
                <Card id="overview" title="About this Hackathon" icon={Rocket} iconColor="#6366f1">
                  <p style={{ margin: 0, fontSize: 15, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{hack.description}</p>
                </Card>
              </div>
            )}

            {/* 2. Problem Statement */}
            {(activeSection === 'all' || activeSection === 'problem') && problemStatement && (
              <div className="hack-section-fade-in" key="problem">
                <Card id="problem" title="Problem Statement" icon={Target} iconColor="#7c3aed" accent="#ede9fe">
                  <div style={{ background: '#fcfaff', border: '1.5px solid #ddd6fe', borderRadius: 14, padding: '18px 20px' }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{problemStatement}</p>
                  </div>
                </Card>
              </div>
            )}

            {/* 3. Prizes & Rewards (Podium Layout) */}
            {(activeSection === 'all' || activeSection === 'prizes') && prizes.length > 0 && (
              <div className="hack-section-fade-in" key="prizes">
                <Card id="prizes" title="Prize Pool & Rewards" icon={Trophy} iconColor="#f59e0b" accent="#fef3c7">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {prizes.map((prize, idx) => (
                      <PrizeCardItem key={idx} prize={prize} idx={idx} />
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* 4. Timeline & Schedule (Roadmap) */}
            {(activeSection === 'all' || activeSection === 'timeline') && timeline.length > 0 && (
              <div className="hack-section-fade-in" key="timeline">
                <Card id="timeline" title="Timeline & Schedule" icon={Clock3} iconColor="#0ea5e9">
                  <div style={{ position: 'relative', paddingLeft: 24 }}>
                    <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: 'linear-gradient(180deg,#6366f1 0%,#38bdf8 50%,#e2e8f0 100%)' }} />
                    {timeline.map((entry, idx) => {
                      const entryDate = entry.date ? new Date(entry.date) : null;
                      const isPast = entryDate && entryDate.getTime() < Date.now();
                      return (
                        <div key={idx} style={{ position: 'relative', marginBottom: idx < timeline.length - 1 ? 24 : 0 }}>
                          <div style={{
                            position: 'absolute', left: -20, top: 4, width: 12, height: 12, borderRadius: '50%',
                            background: isPast ? '#10b981' : '#6366f1',
                            border: '2px solid #fff', boxShadow: `0 0 0 2px ${isPast ? '#10b981' : '#6366f1'}`,
                          }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{entry.label || `Milestone ${idx + 1}`}</span>
                            {isPast && <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>Completed</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={12} />
                            {entryDate ? entryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date TBA'}
                          </div>
                          {entry.description && <div style={{ fontSize: 13, color: '#64748b', marginTop: 5, lineHeight: 1.6 }}>{entry.description}</div>}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* 5. Rules & Guidelines */}
            {(activeSection === 'all' || activeSection === 'rules') && rules.length > 0 && (
              <div className="hack-section-fade-in" key="rules">
                <Card id="rules" title="Rules & Guidelines" icon={ShieldCheck} iconColor="#10b981" accent="#ecfdf5">
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {rules.map((rule, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <CheckCircle2 size={13} color="#10b981" />
                        </div>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {/* 6. Judging Criteria */}
            {(activeSection === 'all' || activeSection === 'judging') && judgingCriteria.length > 0 && (
              <div className="hack-section-fade-in" key="judging">
                <Card id="judging" title="Judging Criteria" icon={Star} iconColor="#f59e0b" accent="#fffbeb">
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {judgingCriteria.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {/* 7. Submission Instructions */}
            {(activeSection === 'all' || activeSection === 'submission') && submissionInstructions && (
              <div className="hack-section-fade-in" key="submission">
                <Card id="submission" title="Submission Instructions" icon={FileCode} iconColor="#6366f1">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {submissionInstructions.split('\n').filter(Boolean).map((instruction, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        background: '#f8fafc', border: '1.5px solid #f1f5f9',
                        borderRadius: 14, padding: '14px 16px',
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 8,
                          background: '#eef2ff', border: '1px solid #c7d2fe',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, color: '#4f46e5', fontSize: 12, fontWeight: 900,
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, flex: 1 }}>
                          {instruction}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* 8. FAQs */}
            {(activeSection === 'all' || activeSection === 'faqs') && faqs.length > 0 && (
              <div className="hack-section-fade-in" key="faqs">
                <Card id="faqs" title="Frequently Asked Questions" icon={HelpCircle} iconColor="#8b5cf6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {faqs.map((faq, idx) => (
                      <FAQAccordionItem
                        key={idx}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openFaqIdx === idx}
                        onToggle={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>

          {/* ────── RIGHT COLUMN (Sticky Sidebar) ─────────────────── */}
          <div className="hackathon-detail-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 70, minWidth: 0, width: '100%', boxSizing: 'border-box' }}>

            {/* ── Countdown Timer Box ────────────────────────────── */}
            {!timeObj.ended && timeObj.label && (
              <DigitalCountdown
                label={timeObj.label}
                days={timeObj.days}
                hours={timeObj.hours}
                minutes={timeObj.minutes}
                seconds={timeObj.seconds}
              />
            )}
            {timeObj.ended && (
              <div style={{ background: '#f1f5f9', border: '1.5px solid #cbd5e1', borderRadius: 18, padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Hackathon Ended
                </div>
              </div>
            )}

            {/* ── Event Snapshot Card ─────────────────────────────── */}
            <Card title="Event Snapshot" icon={Target} iconColor="#6366f1">
              <div>
                <SnapshotItem icon={Users} label="Team Size" value={`${teamMin}–${teamMax} members`} sub="Solo or team allowed" color="#6366f1" />
                <SnapshotItem icon={DollarSign} label="Entry Fee" value={paymentRequired ? `₹${hack.paymentConfig.amountInr}` : 'Free Entry'} sub={paymentRequired ? 'Verified payment' : 'No registration fee'} color={paymentRequired ? '#b45309' : '#10b981'} />
                <SnapshotItem icon={FileCode} label="Submissions" value={`${maxSubs} per team`} sub="Allowed project link types" color="#0ea5e9" />
                {hack?.registrationDeadline && (
                  <SnapshotItem icon={Calendar} label="Reg. Deadline" value={new Date(hack.registrationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} color="#f59e0b" />
                )}
                {(hack?.submissionDeadline || hack?.endDate) && (
                  <SnapshotItem icon={Clock3} label="Sub. Deadline" value={new Date(hack.submissionDeadline || hack.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} color="#ef4444" />
                )}

                <div style={{ paddingTop: 10 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Accepted Link Formats</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {acceptedLinkBadges.map(({ icon: Icon, label, color, textColor }) => (
                      <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: color, color: textColor, border: `1px solid ${textColor}30`, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        <Icon size={11} /> {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* ── Certificate Card (If Issued) ─────────────────────── */}
            {certificate && (
              <div style={{
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#6d28d9)',
                borderRadius: 18, padding: '22px', color: '#fff', position: 'relative', overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(79,70,229,0.35)',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Congratulations!</div>
                      <div style={{ fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {certificate.certType === 'winner' ? <Trophy size={18} color="#fcd34d" /> : <Award size={18} color="#fcd34d" />}
                        {certificate.certType === 'winner' ? 'Winner Certificate' : 'Participation Certificate'}
                      </div>
                    </div>
                    <Award size={30} color="#fcd34d" />
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 14px' }}>
                    Your official certificate for <strong>{hack.title}</strong> has been issued.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={async () => {
                        setPrepState({ busy: true, message: 'Preparing PDF...' });
                        setExportCert(certificate);
                        setTimeout(async () => {
                          try {
                            await generatePDFFromDOM(hackCertTemplateRef, `HackathonCertificate-${certificate.certificateId}`);
                            setExportCert(null); setPrepState(null);
                          } catch (err) { setExportCert(null); setPrepState({ busy: false, message: err.message || 'Download failed.' }); }
                        }, 300);
                      }}
                      disabled={prepState?.busy}
                      style={{ flex: 1, background: '#fff', color: '#1e1b4b', fontWeight: 900, fontSize: 12, padding: '10px 12px', borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {prepState?.busy ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={13} />} Download PDF
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/verify/${certificate.certificateId}`); alert('Verification link copied to clipboard!'); }}
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 800, fontSize: 12, padding: '10px 14px', borderRadius: 11, cursor: 'pointer' }}
                    >
                      Share
                    </button>
                  </div>
                  {prepState?.message && <p style={{ fontSize: 11, color: '#fcd34d', marginTop: 8 }}>{prepState.message}</p>}
                </div>
              </div>
            )}

            {/* ── Registration / My Registration Card ─────────────── */}
            <div id="registration-section" style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              {loadingReg ? (
                <div style={{ padding: 24 }}>
                  <div style={{ height: 80, borderRadius: 12, background: '#f1f5f9', animation: 'pulse 1.4s ease-in-out infinite' }} />
                </div>
              ) : registration ? (
                /* ── Already registered ── */
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Your Registration</h3>
                    <span style={{ fontSize: 11, fontWeight: 800, background: regStatusStyle.bg, color: regStatusStyle.text, padding: '4px 10px', borderRadius: 20 }}>
                      {regStatusStyle.label}
                    </span>
                  </div>

                  {/* Team info box */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Team Identity</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{registration.teamName}</div>
                    <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Crown size={13} /> {isLeader ? 'You are the team leader' : 'You are a team member'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(registration.members || []).map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Users size={11} color="#6366f1" />
                          </div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                            <span style={{ color: '#94a3b8', marginLeft: 5 }}>({m.email})</span>
                            {String(m.user?._id || m.user) === String(user?._id || user?.id) && (
                              <span style={{ marginLeft: 5, fontSize: 10, color: '#6366f1', fontWeight: 800 }}>(you)</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment required */}
                  {registration.payment?.required && registration.payment?.status !== 'paid' && (
                    <div style={{ background: '#fffbeb', border: '1.5px solid #fbbf24', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#92400e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Payment Required</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#78350f', marginBottom: 4 }}>₹{registration.payment.amountInr}</div>
                      <div style={{ fontSize: 12, color: '#b45309', marginBottom: 12 }}>Complete payment to unlock submission access.</div>
                      {isLeader ? (
                        <button onClick={handlePay} disabled={busy} style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                          {busy ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CreditCard size={14} />}
                          Pay ₹{registration.payment.amountInr}
                        </button>
                      ) : (
                        <p style={{ fontSize: 12, color: '#b45309', margin: 0 }}>Your team leader needs to complete payment.</p>
                      )}
                    </div>
                  )}

                  {/* Past submissions */}
                  {(registration.submissions || []).length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Submissions ({submissionCount}/{maxSubs})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {registration.submissions.map((sub, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Link2 size={12} color="#6366f1" />
                              <a href={sub.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#4f46e5', textDecoration: 'none', fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.link}</a>
                              <ExternalLink size={11} color="#94a3b8" />
                            </div>
                            {sub.note && <p style={{ margin: '4px 0 0 18px', fontSize: 11, color: '#94a3b8' }}>{sub.note}</p>}
                            <p style={{ margin: '2px 0 0 18px', fontSize: 11, color: '#cbd5e1' }}>{new Date(sub.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit solution form */}
                  {canSubmit && submissionCount < maxSubs && (
                    <div style={{ borderTop: '1.5px solid #f1f5f9', paddingTop: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>Submit Your Solution</div>
                      {acceptedLinkBadges.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>Accepted link types</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {acceptedLinkBadges.map(({ icon: Icon, label, color, textColor }) => (
                              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: color, color: textColor, border: `1px solid ${textColor}30`, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>
                                <Icon size={10} /> {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: 5 }}>{linkLabel} *</label>
                        <input
                          type="url"
                          value={submissionLink}
                          onChange={e => setSubmissionLink(e.target.value)}
                          placeholder={linkPlaceholder}
                          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#0f172a', background: '#fff' }}
                        />
                        {linkHint && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{linkHint}</p>}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: 5 }}>Note (optional)</label>
                        <textarea
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          rows={2}
                          placeholder="Any notes for the judges…"
                          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', color: '#0f172a', background: '#fff' }}
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={busy || !submissionLink.trim()}
                        style={{ width: '100%', background: busy || !submissionLink.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#10b981,#059669)', color: busy || !submissionLink.trim() ? '#94a3b8' : '#fff', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 12, border: 'none', cursor: busy || !submissionLink.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.2s', boxShadow: busy || !submissionLink.trim() ? 'none' : '0 4px 14px rgba(16,185,129,0.3)' }}
                      >
                        {busy ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
                        Submit Solution {submissionCount > 0 ? `(${submissionCount + 1}/${maxSubs})` : ''}
                      </button>
                    </div>
                  )}

                  {canSubmit && submissionCount >= maxSubs && (
                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                      <Lock size={22} color="#94a3b8" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#475569' }}>Submission Limit Reached</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Maximum {maxSubs} submission{maxSubs !== 1 ? 's' : ''} allowed per team.</div>
                    </div>
                  )}

                  {!isSubmissionOpen && registration && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#64748b', marginTop: 10 }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1, color: '#94a3b8' }} />
                      Submissions are closed for this hackathon.
                    </div>
                  )}
                </div>
              ) : (
                /* ── Multi-Step Registration Form ── */
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                      <Rocket size={18} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Join this Hackathon</h3>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Team size: {teamMin}–{teamMax} members</p>
                    </div>
                  </div>

                  {!isRegistrationOpen ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <AlertTriangle size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#475569', marginBottom: 4 }}>Registrations Closed</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>This hackathon is no longer accepting registrations.</div>
                    </div>
                  ) : !isAuthenticated ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <Lock size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
                      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Login to register for this hackathon.</p>
                      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '11px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>
                        Login to Register
                      </Link>
                    </div>
                  ) : (
                    <>
                      <StepBar step={regStep} steps={REG_STEPS} />

                      {/* Step 0: Team Name */}
                      {regStep === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: 6 }}>Team Name *</label>
                            <input
                              type="text"
                              value={teamName}
                              onChange={e => setTeamName(e.target.value)}
                              placeholder="e.g. Team CyberKnights"
                              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box', color: '#0f172a', background: '#fff', transition: 'border 0.15s' }}
                              onFocus={e => e.target.style.borderColor = '#6366f1'}
                              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                            <p style={{ margin: '5px 0 0', fontSize: 11, color: '#94a3b8' }}>Min 3 characters. This will be your team's name in the event.</p>
                          </div>
                          <button
                            onClick={() => {
                              if (String(teamName).trim().length < 3) { showMsg('Team name must be at least 3 characters.', 'error'); return; }
                              showMsg('', ''); setRegStep(1);
                            }}
                            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}
                          >
                            Next: Add Teammates <ChevronRight size={15} />
                          </button>
                        </div>
                      )}

                      {/* Step 1: Add Members */}
                      {regStep === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Crown size={14} color="#10b981" /> <span><strong>You</strong> are the team leader. Add teammates below (optional for solo).</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#374151' }}>Teammates</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{members.filter(m => m.email.trim()).length + 1}/{teamMax} members</div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {members.map((member, idx) => (
                              <div key={idx} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '12px 14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Users size={11} color="#6366f1" />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#374151' }}>Teammate {idx + 1}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeMemberRow(idx)}
                                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 6, padding: '3px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={e => updateMember(idx, 'name', e.target.value)}
                                  placeholder="Full name"
                                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, outline: 'none', marginBottom: 7, boxSizing: 'border-box', background: '#fff' }}
                                />
                                <input
                                  type="email"
                                  value={member.email}
                                  onChange={e => updateMember(idx, 'email', e.target.value)}
                                  placeholder="SkillValix registered email"
                                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                                />
                              </div>
                            ))}
                          </div>

                          {members.length < teamMax - 1 && (
                            <button
                              type="button"
                              onClick={addMemberRow}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#6366f1', background: '#eef2ff', border: '1.5px dashed #a5b4fc', borderRadius: 10, padding: '9px 14px', cursor: 'pointer' }}
                            >
                              <Plus size={13} /> Add Teammate
                            </button>
                          )}

                          <div style={{ display: 'flex', gap: 9 }}>
                            <button
                              onClick={() => { setRegStep(0); showMsg('', ''); }}
                              style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: 12, padding: '11px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                            >
                              <ChevronLeft size={14} /> Back
                            </button>
                            <button
                              onClick={() => { showMsg('', ''); setRegStep(2); }}
                              style={{ flex: 2, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                              Review & Confirm <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Review & Submit */}
                      {regStep === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '16px' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Review Registration</div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                              <span style={{ fontSize: 12, color: '#64748b' }}>Team Name</span>
                              <span style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>{teamName}</span>
                            </div>

                            <div style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Members</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Crown size={13} color="#fff" />
                                </div>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{user?.name || 'You'}</div>
                                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Team Leader</div>
                                </div>
                              </div>
                              {members.filter(m => m.email.trim()).map((m, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eef2ff', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Users size={12} color="#6366f1" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{m.name || m.email}</div>
                                    {m.name && <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.email}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                              <span style={{ fontSize: 12, color: '#64748b' }}>Entry Fee</span>
                              <span style={{ fontSize: 13, fontWeight: 900, color: paymentRequired ? '#b45309' : '#065f46', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                {paymentRequired ? `₹${hack.paymentConfig.amountInr}` : <><Sparkles size={11} color="#065f46" /> Free</>}
                              </span>
                            </div>
                          </div>

                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 8 }}>
                            <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                            <p style={{ margin: 0, fontSize: 11, color: '#166534', lineHeight: 1.6 }}>
                              Teammates must be registered SkillValix users. Payment (if required) is verified before submission access.
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: 9 }}>
                            <button
                              onClick={() => { setRegStep(1); showMsg('', ''); }}
                              style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: 12, padding: '11px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                            >
                              <ChevronLeft size={14} /> Back
                            </button>
                            <button
                              onClick={handleRegisterTeam}
                              disabled={busy}
                              style={{ flex: 2, background: busy ? '#e2e8f0' : 'linear-gradient(135deg,#10b981,#059669)', color: busy ? '#94a3b8' : '#fff', fontWeight: 800, fontSize: 13, padding: '11px', borderRadius: 12, border: 'none', cursor: busy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: busy ? 'none' : '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                            >
                              {busy ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCheck size={14} />}
                              Confirm Registration
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Feedback Message */}
              {msg.text && (
                <div style={{
                  margin: '0 22px 22px',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 12, fontWeight: 700,
                  background: msg.tone === 'error' ? '#fef2f2' : msg.tone === 'success' ? '#f0fdf4' : '#eef2ff',
                  color: msg.tone === 'error' ? '#b91c1c' : msg.tone === 'success' ? '#166534' : '#4338ca',
                  border: `1px solid ${msg.tone === 'error' ? '#fecaca' : msg.tone === 'success' ? '#bbf7d0' : '#c7d2fe'}`,
                }}>
                  {msg.text}
                </div>
              )}
            </div>

            {/* ── Community Links ─────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://chat.whatsapp.com/IejES4kDNfx1RgMWLPeA6P" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}>
                <Users size={15} /> Join WhatsApp Community
              </a>
              <a href="https://www.linkedin.com/company/skillvalix/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0A66C2', color: '#fff', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(10,102,194,0.3)' }}>
                <Linkedin size={15} /> Follow for Updates
              </a>
            </div>

          </div>
        </div>

        {/* ── Mobile Floating CTA Bar ───────────────────────────────── */}
        <div className="mobile-hackathon-cta" style={{
          display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
          background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 900, textTransform: 'uppercase' }}>{hack.title}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>
                {registration ? (registration.status === 'registered' ? 'Registered' : 'Submitted') : isRegistrationOpen ? 'Registration Open' : 'Closed'}
              </div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('registration-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff',
                fontWeight: 800, fontSize: 13, padding: '10px 20px', borderRadius: 12,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
              }}
            >
              {registration ? 'View Status' : 'Register Now'} <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .hack-section-fade-in {
          animation: fadeInUp 0.35s ease-out forwards;
        }
        @media (max-width: 900px) {
          .hackathon-detail-grid {
            grid-template-columns: 1fr !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
            padding-bottom: 90px !important;
          }
          .hackathon-detail-sidebar {
            position: static !important;
            width: 100% !important;
          }
          .mobile-hackathon-cta {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
