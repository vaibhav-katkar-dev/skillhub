import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  Lock,
  Rocket,
  Star,
  Trophy,
  Target,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Users,
  Tag,
  Zap,
  Award,
  X,
  Filter,
} from 'lucide-react';
import { api } from '../store/authStore';

const STATUS_STYLE = {
  upcoming: {
    bg: 'rgba(245,158,11,0.12)',
    text: '#b45309',
    border: '#fbbf24',
    label: 'Upcoming',
    icon: Clock3,
    dot: '#f59e0b',
  },
  live: {
    bg: 'rgba(16,185,129,0.12)',
    text: '#065f46',
    border: '#34d399',
    label: 'Live Now',
    icon: CircleDot,
    dot: '#10b981',
  },
  ended: {
    bg: 'rgba(100,116,139,0.10)',
    text: '#475569',
    border: '#cbd5e1',
    label: 'Ended',
    icon: CheckCircle2,
    dot: '#94a3b8',
  },
};

/* ── Horizontal Hackathon Row ──────────────────────────── */
function HackathonRow({ hack }) {
  const statusStyle = STATUS_STYLE[hack.status] || STATUS_STYLE.upcoming;
  const StatusIcon = statusStyle.icon;
  const isEnded = hack.status === 'ended';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        background: '#fff',
        borderRadius: 16,
        border: `1.5px solid ${isEnded ? '#e2e8f0' : statusStyle.border}`,
        boxShadow: isEnded ? 'none' : `0 4px 24px ${statusStyle.dot}22`,
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        marginBottom: 12,
      }}
      className="hackathon-row"
      onMouseEnter={e => {
        if (!isEnded) {
          e.currentTarget.style.transform = 'translateX(4px)';
          e.currentTarget.style.boxShadow = `0 8px 32px ${statusStyle.dot}33`;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = isEnded ? 'none' : `0 4px 24px ${statusStyle.dot}22`;
      }}
    >
      {/* Left accent bar */}
      <div style={{
        width: 5,
        flexShrink: 0,
        background: isEnded
          ? 'linear-gradient(180deg,#cbd5e1,#e2e8f0)'
          : `linear-gradient(180deg,${statusStyle.dot},${statusStyle.dot}88)`,
      }} />

      {/* Thumbnail */}
      <div style={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        {hack.image ? (
          <img src={hack.image} alt={hack.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%', minHeight: 110,
            background: isEnded
              ? 'linear-gradient(135deg,#f1f5f9,#e2e8f0)'
              : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={32} color={isEnded ? '#94a3b8' : '#fff'} />
          </div>
        )}
        {hack.featured && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: '#f59e0b', color: '#fff',
            fontSize: 9, fontWeight: 900, letterSpacing: '0.08em',
            padding: '2px 7px', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Star size={9} fill="#fff" strokeWidth={0} /> FEATURED
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, minWidth: 0 }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Status badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: statusStyle.bg, color: statusStyle.text,
            border: `1px solid ${statusStyle.border}`,
            fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
            padding: '3px 9px', borderRadius: 20,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: statusStyle.dot,
              boxShadow: hack.status === 'live' ? `0 0 0 3px ${statusStyle.dot}44` : 'none',
            }} />
            {statusStyle.label}
          </span>

          {/* Tags */}
          {hack.tags?.slice(0, 3).map(tag => (
            <span key={tag} style={{
              background: '#f1f5f9', color: '#475569',
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
              border: '1px solid #e2e8f0',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: isEnded ? '#64748b' : '#0f172a', lineHeight: 1.3 }}>
          {hack.title}
        </h3>

        {/* Tagline */}
        {hack.tagline && (
          <p style={{ margin: 0, fontSize: 12, color: '#6366f1', fontWeight: 700 }}>{hack.tagline}</p>
        )}

        {/* Description */}
        <p style={{
          margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {hack.description}
        </p>

        {/* Deadline row */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 2 }}>
          {hack.registrationDeadline && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#b45309', fontWeight: 700 }}>
              <Clock3 size={11} />
              Reg. closes: {new Date(hack.registrationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
          {(hack.submissionDeadline || hack.endDate) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#be123c', fontWeight: 700 }}>
              <Clock3 size={11} />
              Submission: {new Date(hack.submissionDeadline || hack.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Right CTA section */}
      <div style={{
        flexShrink: 0, width: 160,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: '18px 20px',
        background: isEnded ? '#f8fafc' : 'linear-gradient(135deg,#f5f3ff,#eef2ff)',
        borderLeft: '1.5px solid #f1f5f9',
      }}>
        {hack.prize && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Prize Pool</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#4f46e5' }}>{hack.prize}</div>
          </div>
        )}
        <Link
          to={`/hackathons/${hack.slug || hack._id}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: isEnded
              ? '#f1f5f9'
              : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            color: isEnded ? '#64748b' : '#fff',
            fontWeight: 800, fontSize: 12,
            padding: '9px 14px', borderRadius: 10,
            textDecoration: 'none',
            border: isEnded ? '1.5px solid #e2e8f0' : 'none',
            whiteSpace: 'nowrap',
            boxShadow: isEnded ? 'none' : '0 4px 14px rgba(79,70,229,0.35)',
            transition: 'all 0.18s',
          }}
        >
          {isEnded ? 'View Results' : 'View & Register'}
          <ArrowRight size={13} />
        </Link>

        {hack.teamSize && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
            <Users size={10} />
            Team: {hack.teamSize}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Filter Sidebar ────────────────────────────────────── */
function FilterSidebar({ statusFilter, setStatusFilter, tagFilter, setTagFilter, allTags, onClear }) {
  const hasFilters = statusFilter !== 'all' || tagFilter.length > 0;

  const toggleTag = (tag) => {
    setTagFilter(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      position: 'sticky', top: 90, alignSelf: 'flex-start',
    }}>
      {/* Filter header */}
      <div style={{
        background: '#fff', border: '1.5px solid #e2e8f0',
        borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SlidersHorizontal size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>Filters</span>
          </div>
          {hasFilters && (
            <button
              onClick={onClear}
              style={{
                fontSize: 11, fontWeight: 700, color: '#ef4444',
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <X size={10} /> Clear
            </button>
          )}
        </div>

        {/* Status filter */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { id: 'all', label: 'All Events', icon: Zap, color: '#6366f1' },
              { id: 'live', label: 'Live Now', icon: CircleDot, color: '#10b981' },
              { id: 'upcoming', label: 'Upcoming', icon: Clock3, color: '#f59e0b' },
              { id: 'ended', label: 'Ended', icon: CheckCircle2, color: '#94a3b8' },
            ].map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                  border: `1.5px solid ${statusFilter === id ? color + '50' : 'transparent'}`,
                  background: statusFilter === id ? color + '12' : 'transparent',
                  color: statusFilter === id ? color : '#64748b',
                  fontSize: 12, fontWeight: statusFilter === id ? 800 : 600,
                  transition: 'all 0.15s', textAlign: 'left',
                }}
              >
                <Icon size={13} />
                {label}
                {statusFilter === id && (
                  <span style={{
                    marginLeft: 'auto', width: 6, height: 6,
                    borderRadius: '50%', background: color,
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              Topics / Tags
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {allTags.map(tag => {
                const active = tagFilter.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${active ? '#4f46e5' : '#e2e8f0'}`,
                      background: active ? '#eef2ff' : '#f8fafc',
                      color: active ? '#4f46e5' : '#64748b',
                      fontSize: 12, fontWeight: active ? 800 : 600,
                      transition: 'all 0.15s', textAlign: 'left',
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                    {active && <CheckCircle2 size={11} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div style={{
        marginTop: 14, background: 'linear-gradient(135deg,#1e1b4b,#312e81)',
        borderRadius: 14, padding: '18px 18px', color: '#fff',
      }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#a5b4fc', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Why Join?
        </div>
        {[
          { icon: Award, text: 'Free certificates' },
          { icon: Zap, text: '100% free to enter' },
          { icon: Users, text: 'Solo or team' },
          { icon: Trophy, text: 'Win recognition' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={11} color="#a5b4fc" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#c7d2fe' }}>{text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function Events() {
  const [hackathons, setHackathons] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoadingHacks(true);
      try {
        const r = await api.get('/events/hackathons');
        setHackathons(r.data || []);
      } catch {
        setHackathons([]);
      } finally {
        setLoadingHacks(false);
      }
    })();
  }, []);

  /* Collect all unique tags */
  const allTags = useMemo(() => {
    const s = new Set();
    hackathons.forEach(h => h.tags?.forEach(t => s.add(t)));
    return [...s];
  }, [hackathons]);

  /* Filter hackathons */
  const filtered = useMemo(() => {
    return hackathons.filter(h => {
      const matchStatus = statusFilter === 'all' || h.status === statusFilter;
      const matchTag = tagFilter.length === 0 || tagFilter.every(t => h.tags?.includes(t));
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        h.title?.toLowerCase().includes(q) ||
        h.description?.toLowerCase().includes(q) ||
        h.tagline?.toLowerCase().includes(q) ||
        h.tags?.some(t => t.toLowerCase().includes(q));
      return matchStatus && matchTag && matchSearch;
    });
  }, [hackathons, statusFilter, tagFilter, searchQuery]);

  /* Live count */
  const liveCount = hackathons.filter(h => h.status === 'live').length;
  const upcomingCount = hackathons.filter(h => h.status === 'upcoming').length;

  const clearFilters = () => {
    setStatusFilter('all');
    setTagFilter([]);
    setSearchQuery('');
  };

  return (
    <>
      <Helmet>
        <title>Free Student Hackathons with Certificate | SkillValix Online Hackathon Platform</title>
        <meta name="description" content="Join free online hackathons for students on SkillValix. Build real projects, win prizes, and earn verified certificates. Beginner-friendly. Register today — 100% free!" />
        <meta name="keywords" content="student hackathons, free hackathons for students with certificates, online hackathon platform, online hackathon for beginners, SkillValix hackathons, free hackathon India, hackathon with certificate, coding competition for students, free tech events students, programming contest beginners" />
        <link rel="canonical" href="https://www.skillvalix.com/hackathons" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="SkillValix" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.skillvalix.com/hackathons" />
        <meta property="og:site_name" content="SkillValix" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:title" content="Free Student Hackathons with Certificate | SkillValix" />
        <meta property="og:description" content="Build real projects, compete with peers, and earn free verified certificates. Join SkillValix hackathons — open to all beginners. 100% free to enter." />
        <meta property="og:image" content="https://www.skillvalix.com/og-home.png" />
        <meta property="og:image:alt" content="SkillValix – Free Online Hackathons for Students" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SkillValix" />
        <meta name="twitter:title" content="Free Student Hackathons with Certificate | SkillValix" />
        <meta name="twitter:description" content="Join SkillValix free online hackathons for students. Build projects, earn verified certificates, get recognized. Register now." />
        <meta name="twitter:image" content="https://www.skillvalix.com/og-home.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SkillValix",
          "url": "https://www.skillvalix.com",
          "logo": "https://www.skillvalix.com/logo.svg",
          "sameAs": ["https://www.linkedin.com/company/skillvalix", "https://www.instagram.com/skillvalix"]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "Student Hackathons",
          "description": "Free online hackathons for students and beginners. Build real projects, collaborate with peers, and earn verifiable certificates on SkillValix.",
          "url": "https://www.skillvalix.com/hackathons",
          "startDate": "2025-01-01T00:00:00+05:30",
          "endDate": "2027-12-31T23:59:59+05:30",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "isAccessibleForFree": true,
          "organizer": { "@type": "Organization", "name": "SkillValix", "url": "https://www.skillvalix.com" },
          "performer": { "@type": "Organization", "name": "SkillValix" },
          "location": { "@type": "VirtualLocation", "url": "https://www.skillvalix.com/hackathons" },
          "image": ["https://www.skillvalix.com/og-home.png"],
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock", "url": "https://www.skillvalix.com/hackathons" },
          "audience": { "@type": "Audience", "audienceType": "Students, Beginners, Developers aged 16-30" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Are SkillValix hackathons free for students?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all hackathons on SkillValix are 100% free to enter. No registration fee, no hidden charges. Every participant gets a certificate." } },
            { "@type": "Question", "name": "Can beginners join SkillValix hackathons?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! SkillValix hackathons are designed specifically for beginners aged 16-30. No prior experience is required to participate." } },
            { "@type": "Question", "name": "Do I get a certificate for participating in a hackathon?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every participant receives a verified participation certificate. Winners receive special merit certificates that are verifiable on the SkillValix platform." } },
            { "@type": "Question", "name": "How do I register for a hackathon on SkillValix?", "acceptedAnswer": { "@type": "Answer", "text": "Simply create a free SkillValix account, browse the hackathons page, click on any active hackathon, and click the Register button. It takes less than 2 minutes." } },
            { "@type": "Question", "name": "Can I participate in hackathons solo or only in teams?", "acceptedAnswer": { "@type": "Answer", "text": "Both solo and team participation are welcome on SkillValix. Check each hackathon's detail page for specific team size requirements." } }
          ]
        })}</script>
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg,#0f0e2a 0%,#1a1560 45%,#0f172a 100%)',
        padding: '28px 24px 22px',
      }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: '-60%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(79,70,229,0.18)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60%', right: '10%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 999, padding: '6px 16px',
            fontSize: 12, fontWeight: 800, color: '#a5b4fc', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <Rocket size={13} /> Hackathons Hub
          </span>


          {/* Live / upcoming count pills + nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {liveCount > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.35)',
                borderRadius: 999, padding: '7px 16px',
                fontSize: 13, fontWeight: 800, color: '#6ee7b7',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 4px rgba(16,185,129,0.25)' }} />
                {liveCount} Live Now
              </div>
            )}
            {upcomingCount > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: 999, padding: '7px 16px',
                fontSize: 13, fontWeight: 800, color: '#fcd34d',
              }}>
                <Clock3 size={13} />
                {upcomingCount} Upcoming
              </div>
            )}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999, padding: '7px 16px',
              fontSize: 13, fontWeight: 800, color: '#cbd5e1',
            }}>
              <Trophy size={13} />
              {hackathons.length} Total Events
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <section style={{ background: '#f8fafc', padding: '40px 24px 60px', minHeight: 500 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Search bar + mobile filter toggle */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search hackathons by name, tag, or keyword…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px 11px 40px',
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 13, fontWeight: 500, color: '#0f172a',
                  background: '#fff', outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(p => !p)}
              style={{
                alignItems: 'center', gap: 6,
                padding: '10px 16px', border: '1.5px solid #e2e8f0',
                borderRadius: 12, background: '#fff', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, color: '#475569',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              className="mobile-filter-btn"
            >
              <Filter size={14} /> Filters {tagFilter.length > 0 || statusFilter !== 'all' ? `(${tagFilter.length + (statusFilter !== 'all' ? 1 : 0)})` : ''}
            </button>
          </div>

          {/* Two-column layout: sidebar + list */}
          <div className="events-main-layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* Filter sidebar */}
            <div className={`filter-sidebar-wrapper ${mobileFilterOpen ? 'mobile-open' : ''}`}>
              <FilterSidebar
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                tagFilter={tagFilter}
                setTagFilter={setTagFilter}
                allTags={allTags}
                onClear={clearFilters}
              />
            </div>

            {/* Hackathon list */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Result count & section header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {statusFilter === 'all' && 'All Hackathons'}
                    {statusFilter === 'live' && <><CircleDot size={18} color="#10b981" /> Live Hackathons</>}
                    {statusFilter === 'upcoming' && <><Clock3 size={18} color="#f59e0b" /> Upcoming Hackathons</>}
                    {statusFilter === 'ended' && <><CheckCircle2 size={18} color="#64748b" /> Past Hackathons</>}
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                    {loadingHacks ? 'Loading…' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
                  </p>
                </div>

                {/* Sort indicator (cosmetic) */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700, color: '#64748b',
                  background: '#fff', border: '1.5px solid #e2e8f0',
                  borderRadius: 9, padding: '6px 12px',
                }}>
                  <Trophy size={12} color="#6366f1" /> Newest First
                </div>
              </div>

              {/* Loading skeletons */}
              {loadingHacks && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      height: 120, borderRadius: 16, background: '#fff',
                      border: '1.5px solid #e2e8f0',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loadingHacks && filtered.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '60px 24px',
                  background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0',
                }}>
                  <Rocket size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                  <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, color: '#334155' }}>
                    No hackathons found
                  </h3>
                  <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8' }}>
                    {hackathons.length === 0
                      ? 'No hackathons listed yet. Check back soon — exciting events are coming!'
                      : 'Try adjusting your search or filters.'}
                  </p>
                  {hackathons.length > 0 && (
                    <button
                      onClick={clearFilters}
                      style={{
                        padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
                        background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                        color: '#fff', fontWeight: 800, fontSize: 13, border: 'none',
                      }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Hackathon rows */}
              {!loadingHacks && filtered.length > 0 && (
                <div>
                  {filtered.map(hack => (
                    <HackathonRow key={hack._id} hack={hack} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Skill Exams Promo ──────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto', borderRadius: 24, padding: '52px 48px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 45%,#1e3a5f 100%)',
          boxShadow: '0 16px 48px -12px rgba(49,46,129,0.45)',
        }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: 999, padding: '5px 14px', marginBottom: 20,
              fontSize: 11, fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <Target size={12} /> Direct Certification
            </div>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              Don't want to wait for the next hackathon to prove your skills?
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 15, color: '#94a3b8', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              Verify your skills instantly by taking a direct Skill Exam. Score 70%+ and get an employer-verifiable certificate — no full course required.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/skill-exams" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg,#10b981,#059669)',
                color: '#fff', fontWeight: 800, fontSize: 14,
                padding: '13px 28px', borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
              }}>
                Take an Exam Instantly <ArrowRight size={16} />
              </Link>
              <Link to="/blog/online-skill-exam-certificate-validate-programming-skills" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#e2e8f0', fontWeight: 700, fontSize: 14,
                padding: '13px 28px', borderRadius: 12, textDecoration: 'none',
              }}>
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEO Content ────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <div style={{ marginBottom: 52 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>What Is a Student Hackathon?</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 12 }}>
              A <strong>student hackathon</strong> is a time-limited building competition where participants — individually or in teams — solve a real-world problem by creating a working software project. Hackathons typically run for 24–72 hours and end with project submissions that are evaluated by judges.
            </p>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8 }}>
              On SkillValix, hackathons are designed specifically for students and beginners aged 16–30. They're <strong>100% free to enter</strong>, fully online, and structured around beginner-friendly themes. Every hackathon comes with a verified participation certificate.
            </p>
          </div>

          <div style={{ marginBottom: 52 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 20 }}>Why Join a Hackathon? 7 Reasons That Matter</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 14 }}>
              {[
                { num: '01', title: 'Build Real Projects', desc: 'Hackathons force you to build something complete under time pressure — the most effective way to consolidate everything you\'ve learned in courses.' },
                { num: '02', title: 'Earn a Verified Certificate', desc: 'Every SkillValix hackathon participant earns a certificate. Winners get a merit certificate visible on their public profile and verifiable by employers.' },
                { num: '03', title: 'Stand Out in Applications', desc: 'Hackathon participation shows recruiters you can build, not just learn. It\'s the portfolio evidence that separates you from 90% of applicants.' },
                { num: '04', title: 'Learn Faster Under Pressure', desc: 'Time constraints accelerate learning. You\'ll figure out in 48 hours what might take weeks in a classroom — because you have a real goal to ship.' },
                { num: '05', title: 'Network with Peers', desc: 'Meet other students and developers from across India who are building in the same space. Communities formed in hackathons often turn into co-founders.' },
                { num: '06', title: 'Free to Enter', desc: 'No registration fee. No hidden charges. SkillValix hackathons are 100% free for all students. Your only investment is time and effort.' },
                { num: '07', title: 'Beginner-Friendly Themes', desc: 'Themes are chosen specifically for beginners. You don\'t need to know ML or blockchain — a well-built web app solves real problems and wins.' },
              ].map(({ num, title, desc }) => (
                <div key={num} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.1em', marginBottom: 6 }}>REASON {num}</div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 52 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 20 }}>How SkillValix Hackathons Work</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { step: '1', title: 'Create a Free Account', desc: 'Register on SkillValix — it\'s free and takes under 2 minutes. No credit card required.' },
                { step: '2', title: 'Browse Open Hackathons', desc: 'Use the filters on the left to find active, upcoming, or past hackathons matching your interest.' },
                { step: '3', title: 'Register Before the Deadline', desc: 'Click "View & Register" on the hackathon. Complete the registration form as a solo participant or with your team.' },
                { step: '4', title: 'Build Your Project', desc: 'Work on your solution during the hackathon window using any tech stack you\'re comfortable with.' },
                { step: '5', title: 'Submit Before the Deadline', desc: 'Submit via the hackathon form. Include a demo link, GitHub repo, and a short description of the problem solved.' },
                { step: '6', title: 'Receive Your Certificate', desc: 'All valid submissions receive a participation certificate. Top submissions get merit certificates and are featured.' },
              ].map(({ step, title, desc }) => (
                <li key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '18px 22px' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#eef2ff', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#4f46e5', fontSize: 14, flexShrink: 0 }}>{step}</div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Prepare section */}
          <div style={{ marginBottom: 52, padding: '28px 32px', borderRadius: 18, background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1.5px solid #c7d2fe' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 900, color: '#1e1b4b' }}>Prepare for Your First Hackathon</h2>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: '#4338ca', lineHeight: 1.65 }}>
              Not sure if your skills are ready? The fastest way to get hackathon-ready is to complete one of our free courses.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { label: 'JavaScript Course →', to: '/courses/ultimate-javascript-masterclass' },
                { label: 'Python Course →', to: '/courses/ultimate-python-masterclass' },
                { label: 'HTML Course →', to: '/courses/ultimate-html-masterclass' },
                { label: 'CSS Course →', to: '/courses/css-for-beginners-learn-web-styling-zero-to-pro' },
                { label: 'AI Course →', to: '/courses/basics-of-artificial-intelligence-beginners' },
              ].map(({ label, to }) => (
                <Link key={to} to={to} style={{ background: '#fff', color: '#4f46e5', border: '1.5px solid #c7d2fe', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 18 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { q: 'Are SkillValix hackathons free for students?', a: 'Yes. All hackathons on SkillValix are 100% free to enter. There is no registration fee, no hidden charges, and no payment required at any step. Every participant receives a verified certificate.' },
                { q: 'Can complete beginners participate in hackathons on SkillValix?', a: 'Absolutely. SkillValix hackathons are specifically designed for students and beginners aged 16–30. Hackathon themes are chosen to be accessible to participants who have basic coding knowledge.' },
                { q: 'What kind of projects can I build in a SkillValix hackathon?', a: 'You can build any software project — a web app, a mobile app, a data analysis tool, or an AI prototype — as long as it responds to the hackathon\'s theme.' },
                { q: 'Do I get a certificate for participating even if I don\'t win?', a: 'Yes. Every participant who submits a valid project receives a verified participation certificate. Winners receive a special merit certificate that highlights their achievement.' },
                { q: 'Can I participate solo or do I need a team?', a: 'Both solo and team participation are supported. Check the specific hackathon details page for team size requirements. Solo participation is fully competitive.' },
                { q: 'How is the hackathon evaluated?', a: 'Projects are evaluated on: (1) problem clarity, (2) solution quality, (3) technical execution, and (4) impact potential.' },
              ].map(({ q, a }) => (
                <details key={q} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 22px', cursor: 'pointer', fontWeight: 700, color: '#0f172a', fontSize: 14, listStyle: 'none', userSelect: 'none' }}>
                    {q}
                    <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#64748b', fontWeight: 400 }}>+</span>
                  </summary>
                  <p style={{ margin: 0, padding: '0 22px 16px', fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Blog links */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>Learn More About Hackathons</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link to="/blog/how-to-win-a-hackathon-beginner-guide-2026" style={{ color: '#4f46e5', fontSize: 13, fontWeight: 600, textDecoration: 'none', background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: 8, padding: '8px 14px' }}>How to Win a Hackathon: Beginner Guide →</Link>
              <Link to="/blog/web-development-roadmap-2026-beginners" style={{ color: '#4f46e5', fontSize: 13, fontWeight: 600, textDecoration: 'none', background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: 8, padding: '8px 14px' }}>Web Development Roadmap 2026 →</Link>
              <Link to="/blog/free-online-courses-with-certificate-india-2026" style={{ color: '#4f46e5', fontSize: 13, fontWeight: 600, textDecoration: 'none', background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: 8, padding: '8px 14px' }}>Free Courses with Certificate India →</Link>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .hackathon-row:hover {
          cursor: pointer;
        }
        .mobile-filter-btn {
          display: none;
        }
        .filter-sidebar-wrapper aside {
          width: 230px !important;
        }
        @media (max-width: 768px) {
          .events-main-layout {
            flex-direction: column !important;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
          .filter-sidebar-wrapper {
            display: none;
            width: 100%;
            margin-bottom: 16px;
          }
          .filter-sidebar-wrapper.mobile-open {
            display: block !important;
          }
          .filter-sidebar-wrapper aside {
            width: 100% !important;
            position: static !important;
          }
          .hackathon-row {
            flex-direction: column !important;
          }
          .hackathon-row > div:first-child {
            width: 100% !important;
            height: 4px !important;
          }
          .hackathon-row > div:nth-child(2) {
            width: 100% !important;
            height: 160px !important;
          }
          .hackathon-row > div:last-child {
            width: 100% !important;
            border-left: none !important;
            border-top: 1.5px solid #f1f5f9 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </>
  );
}
