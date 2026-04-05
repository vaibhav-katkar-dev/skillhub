import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Award, CheckCircle2, ChevronDown, Download, Globe,
  Rocket, ShieldCheck, Sparkles, Star, Trophy, Users,
  ArrowRight, Zap, BookOpen, Target, GraduationCap, Briefcase
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CERT_STEPS = [
  { step:'01', title:'Choose Your Course',       desc:'Pick any free course — HTML, CSS, JavaScript, Python, Java, C, C++, or AI. Every one of them ends with a certificate waiting for you.',                         color:'#6366f1', bg:'#eef2ff', icon:BookOpen },
  { step:'02', title:'Master the Lessons',       desc:'Work through every lesson at your pace. Code-rich, beginner-first content that genuinely teaches — not just watches you click "next".',               color:'#8b5cf6', bg:'#f5f3ff', icon:GraduationCap },
  { step:'03', title:'Pass the Exam',            desc:'A server-graded exam that tests real understanding. It\'s meant to be challenging — which is exactly what makes the certificate worth having.',      color:'#0ea5e9', bg:'#f0f9ff', icon:Target },
  { step:'04', title:'Earn Your Certificate',    desc:'Pass and your verified certificate is ready. Download it. Add it to LinkedIn. Share the verification link. Show the world you did the work.',       color:'#10b981', bg:'#ecfdf5', icon:Award },
];

const CERT_TRUST = [
  { icon:ShieldCheck,  title:'Employer-Verified in Seconds',  desc:'Every certificate has a unique ID. Employers type it into skillvalix.com/verify and your achievement shows up instantly.', color:'#10b981', bg:'#ecfdf5' },
  { icon:Download,     title:'PDF Certificate — Yours Forever','desc':'Download a clean, printable PDF the moment you unlock it. Keep it. Share it. It\'s yours permanently.',             color:'#6366f1', bg:'#eef2ff' },
  { icon:Globe,        title:'LinkedIn-Ready in 60 Seconds',  desc:'Add your verification link to your LinkedIn "Licenses & Certifications" section. Let your profile do the talking.',     color:'#0ea5e9', bg:'#f0f9ff' },
  { icon:Zap,          title:'Issued Instantly on Passing',   desc:'No waiting period, no manual review. Pass the exam and your certificate appears immediately — ready to share.',          color:'#f59e0b', bg:'#fffbeb' },
  { icon:Star,         title:'Certificate of Merit',          desc:'Top scorers receive a Certificate of Merit — recognising exceptional performance. A distinction worth showing off.',     color:'#8b5cf6', bg:'#f5f3ff' },
  { icon:Trophy,       title:'Hackathon Certificates Too',    desc:'Join a SkillValix hackathon and earn a separate certificate for every event you participate in or win.',               color:'#ef4444', bg:'#fef2f2' },
];

const COURSES_CERTS = [
  { slug:'ultimate-html-masterclass',                         name:'HTML for Beginners',    color:'#6366f1', bg:'#eef2ff', border:'#c7d2fe', time:'4 hrs' },
  { slug:'css-for-beginners-learn-web-styling-zero-to-pro',   name:'CSS for Beginners',     color:'#0ea5e9', bg:'#f0f9ff', border:'#bae6fd', time:'5 hrs' },
  { slug:'ultimate-javascript-masterclass',                   name:'JavaScript for Beginners',color:'#f59e0b',bg:'#fffbeb', border:'#fde68a', time:'6 hrs' },
  { slug:'ultimate-python-masterclass',                       name:'Python for Beginners',  color:'#10b981', bg:'#ecfdf5', border:'#a7f3d0', time:'6 hrs' },
  { slug:'ultimate-java-masterclass',                         name:'Java Programming',       color:'#8b5cf6', bg:'#f5f3ff', border:'#ddd6fe', time:'7 hrs' },
  { slug:'basics-of-artificial-intelligence-beginners',       name:'AI for Beginners',      color:'#ef4444', bg:'#fef2f2', border:'#fecaca', time:'5 hrs' },
  { slug:'ultimate-c-programming',                            name:'C Programming',         color:'#64748b', bg:'#f8fafc', border:'#e2e8f0', time:'6 hrs' },
  { slug:'modern-cpp-mastery',                                name:'Modern C++',            color:'#4338ca', bg:'#eef2ff', border:'#c7d2fe', time:'8 hrs' },
];

const SOCIAL_PROOF = [
  { name:'Priya Sharma',    role:'Frontend Intern, Pune',      initials:'PS', grad:'from-indigo-500 to-violet-600',  quote:'My SkillValix JavaScript certificate is literally what got me the interview. The recruiter verified it live while we were on the call.' },
  { name:'Arjun Mehta',     role:'CS Student, Delhi',          initials:'AM', grad:'from-sky-500 to-blue-600',       quote:'I put the certificate on LinkedIn and had 3 DMs from recruiters within a week. I wasn\'t even actively looking.' },
  { name:'Fatima Siddiqui', role:'Career Switcher, Hyderabad', initials:'FS', grad:'from-emerald-500 to-teal-600',  quote:'The exam actually challenged me — which made earning the certificate feel genuinely satisfying, not just a formality.' },
];

const FAQS = [
  { q:'How do I earn a certificate on SkillValix?',               a:'Complete any course, pass the final exam, and your verified certificate unlocks immediately. It comes with a unique ID that can be verified by anyone — employers, universities, or recruiters.' },
  { q:'Are SkillValix certificates recognized by employers?',     a:'Yes. Every certificate carries a verification ID. Employers visit skillvalix.com/verify, enter the ID, and your achievement is confirmed in seconds. Thousands of students have used their certificates to land internships and full-time roles.' },
  { q:'What is on the SkillValix certificate?',                   a:'Your full name, the course title, the date of completion, your exam score, and a unique verification ID. Each certificate is generated as a high-quality PDF, downloadable and shareable.' },
  { q:'Can I add my SkillValix certificate to LinkedIn?',         a:'Absolutely. After earning your certificate, go to LinkedIn → Add Profile Section → Licenses & Certifications → add SkillValix as the issuer and paste your verification link. Takes under 60 seconds.' },
  { q:'Is there a merit certificate for top performers?',         a:'Yes. Students who score exceptionally on the exam receive a Certificate of Merit — a distinction that sets their profile apart from standard completions. Something worth aiming for.' },
  { q:'Can I earn certificates for hackathons too?',              a:'Yes. SkillValix hackathon participants earn a separate hackathon certificate for every event they join or win — stackable credentials that show you can both learn and build.' },
  { q:'How long does it take to earn a certificate?',             a:'Most courses take 2–6 hours of focused study. Dedicated learners have gone from starting a course to holding a certificate within a single day — it\'s built for speed without cutting corners.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:'#fff', border:`1.5px solid ${open?'#6366f1':'#e2e8f0'}`, borderRadius:16, overflow:'hidden', boxShadow:open?'0 4px 24px rgba(99,102,241,0.10)':'0 1px 4px rgba(0,0,0,0.04)', transition:'all .25s ease' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'20px 28px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
        <span style={{ fontWeight:700, fontSize:15, color:open?'#4f46e5':'#1e293b', lineHeight:1.4 }}>{q}</span>
        <span style={{ flexShrink:0, width:30, height:30, borderRadius:'50%', background:open?'#6366f1':'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .25s ease', transform:open?'rotate(180deg)':'rotate(0)' }}>
          <ChevronDown size={16} style={{ color:open?'#fff':'#64748b' }} />
        </span>
      </button>
      <div style={{ maxHeight:open?300:0, overflow:'hidden', transition:'max-height .3s ease', opacity:open?1:0 }}>
        <p style={{ padding:'0 28px 20px', margin:0, fontSize:14, color:'#64748b', lineHeight:1.8 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Certification() {
  return (
    <div style={{ fontFamily:"'Inter', system-ui, sans-serif", background:'#fff', color:'#0f172a', overflowX:'hidden' }}>

      <Helmet>
        <title>Skill-Based Online Certification Platform | Earn a Verified Certificate – SkillValix</title>
        <meta name="description" content="SkillValix is a skill-based online certification platform. Complete a free course, pass the exam, and earn a verified certificate that employers can confirm in seconds. Join 2,800+ certified students." />
        <meta name="keywords" content="online certification platform, skill based certification platform, get certificate fast, earn verified certificate online, online certificate for students, SkillValix certification, programming certificate online, skill certification India, verified certificate platform, best certification platform India" />
        <link rel="canonical" href="https://skillvalix.com/certification" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="SkillValix" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skillvalix.com/certification" />
        <meta property="og:site_name" content="SkillValix" />
        <meta property="og:title" content="Skill-Based Online Certification Platform | SkillValix" />
        <meta property="og:description" content="Earn a verified skill certificate on SkillValix. Complete a course, pass the exam, unlock a credential employers trust. Instantly verifiable. Trusted by 2,800+ learners." />
        <meta property="og:image" content="https://skillvalix.com/og-home.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SkillValix" />
        <meta name="twitter:title" content="Skill-Based Online Certification Platform | SkillValix" />
        <meta name="twitter:description" content="Pass the exam. Earn the certificate. Prove your skills. SkillValix — India's skill-based certification platform for students." />
        <meta name="twitter:image" content="https://skillvalix.com/og-home.png" />

        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"EducationalOccupationalProgram",
          "name":"SkillValix Skill-Based Certification Program",
          "description":"A skill-based online certification platform. Complete a course, pass the exam, and earn an instantly verifiable certificate.",
          "url":"https://skillvalix.com/certification",
          "provider":{"@type":"Organization","name":"SkillValix","url":"https://skillvalix.com"},
          "educationalCredentialAwarded":"Verified Certificate of Completion",
          "occupationalCredentialAwarded":"Skill-Based Certificate",
          "timeToComplete":"P1D",
          "programPrerequisites":"No prior experience required"
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"FAQPage",
          "mainEntity":FAQS.map(f=>({ "@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a} }))
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":"https://skillvalix.com"},
            {"@type":"ListItem","position":2,"name":"Certification","item":"https://skillvalix.com/certification"}
          ]
        })}</script>

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{`
        * { box-sizing:border-box; }
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes floatA{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-22px)}}
        @keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(-16px,20px)}}
        .cert-shimmer{background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite;}
        .cert-card{transition:transform .3s ease,box-shadow .3s ease;}
        .cert-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,0.09) !important;}
        .wrap{max-width:1200px;margin:0 auto;padding:0 24px;}
        @media(min-width:1280px){.wrap{padding:0 48px;}}
        .grid-2{display:grid;grid-template-columns:1fr;gap:20px;}
        .grid-3{display:grid;grid-template-columns:1fr;gap:20px;}
        @media(min-width:640px){.grid-2{grid-template-columns:1fr 1fr;}}
        @media(min-width:768px){.grid-3{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.grid-3{grid-template-columns:repeat(3,1fr);}}
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ background:'linear-gradient(160deg,#eef2ff 0%,#f5f3ff 50%,#fafcff 100%)', padding:'96px 0 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'rgba(99,102,241,0.09)', filter:'blur(100px)', top:'-20%', left:'-10%', animation:'floatA 12s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:480, height:480, borderRadius:'50%', background:'rgba(139,92,246,0.08)', filter:'blur(100px)', bottom:'-10%', right:'-8%', animation:'floatB 14s ease-in-out infinite', pointerEvents:'none' }} />

        <div className="wrap" style={{ position:'relative', zIndex:10, textAlign:'center' }}>
          <nav aria-label="breadcrumb" style={{ marginBottom:24, fontSize:13, color:'#94a3b8' }}>
            <Link to="/" style={{ color:'#6366f1', textDecoration:'none', fontWeight:600 }}>Home</Link>
            <span style={{ margin:'0 8px' }}>›</span>
            <span style={{ color:'#64748b' }}>Certification</span>
          </nav>

          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #e0e7ff', borderRadius:100, padding:'7px 18px', marginBottom:28, boxShadow:'0 2px 12px rgba(99,102,241,0.10)' }}>
            <Award size={14} style={{ color:'#6366f1' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'#4f46e5', letterSpacing:'0.05em' }}>VERIFIED · EMPLOYER-TRUSTED · INSTANTLY SHAREABLE</span>
          </div>

          {/* H1 — short direct answer for featured snippet */}
          <h1 style={{ fontSize:'clamp(2.2rem,6vw,3.8rem)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', marginBottom:20 }}>
            <span style={{ display:'block', color:'#0f172a' }}>The Certificate That</span>
            <span className="cert-shimmer" style={{ display:'block' }}>Proves You Did the Work.</span>
          </h1>

          <p style={{ fontSize:18, color:'#475569', maxWidth:620, margin:'0 auto 16px', lineHeight:1.8 }}>
            SkillValix is a <strong style={{ color:'#4f46e5' }}>skill-based online certification platform</strong> for students and beginners.
            Complete a free course, pass the exam, and earn a <strong style={{ color:'#0f172a' }}>verified certificate</strong> with a unique ID —
            shareable, employer-trusted, and ready for LinkedIn the moment you unlock it.
          </p>
          <p style={{ fontSize:15, color:'#64748b', maxWidth:520, margin:'0 auto 40px', lineHeight:1.7 }}>
            2,800+ students have already done it. The ones who earned their certificate are the ones with the interviews, the internship offers, and the LinkedIn endorsements to show for it.
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:14, marginBottom:44 }}>
            <Link to="/courses" id="cert-cta-courses" style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', padding:'14px 32px', borderRadius:12, fontWeight:700, fontSize:15, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 4px 20px rgba(79,70,229,0.35)' }}>
              <Rocket size={17} /> Earn Your Certificate <ArrowRight size={17} />
            </Link>
            <Link to="/verify" id="cert-cta-verify" style={{ background:'#fff', color:'#374151', padding:'13px 28px', borderRadius:12, fontWeight:600, fontSize:15, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, border:'1.5px solid #e0e7ff', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <ShieldCheck size={17} style={{ color:'#10b981' }} /> Verify a Certificate
            </Link>
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 24px' }}>
            {[{ icon:Users, text:'2,800+ students certified', color:'#6366f1' }, { icon:Award, text:'Unique verification ID on every cert', color:'#10b981' }, { icon:Star, text:'4.9 avg exam rating', color:'#f59e0b' }]
              .map(({ icon:Icon, text, color }, i) => (
                <span key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#64748b' }}>
                  <Icon size={15} style={{ color, flexShrink:0 }} />{text}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ══ WHAT MAKES IT REAL ════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'80px 0', borderTop:'1.5px solid #f1f5f9' }}>
        <div className="wrap" style={{ maxWidth:800, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:900, color:'#0f172a', textAlign:'center', marginBottom:20, lineHeight:1.2 }}>
            Not a Participation Trophy. A <span className="cert-shimmer">Real Credential.</span>
          </h2>
          <p style={{ fontSize:16, color:'#475569', lineHeight:1.85, marginBottom:18 }}>
            Most online certificates are handed out automatically. Click through slides, answer a 5-question quiz, get a PDF. Employers know this — and have stopped caring about those certificates.
          </p>
          <p style={{ fontSize:16, color:'#475569', lineHeight:1.85, marginBottom:18 }}>
            <strong>SkillValix is different.</strong> The final exam is server-graded and genuinely challenging. It tests what you actually learned — not memory tricks, not pattern matching.
            When you pass, the certificate that comes out is one you actually earned. It has your name, your score, and a <Link to="/verify" style={{ color:'#4f46e5', fontWeight:600 }}>verification link</Link> that anyone can check in seconds.
          </p>
          <p style={{ fontSize:16, color:'#475569', lineHeight:1.85 }}>
            That's why SkillValix certificates stand out to recruiters. Not because we tell them to trust it — but because the verification system lets them confirm it themselves.
            Beyond course certificates, every <Link to="/hackathons" style={{ color:'#4f46e5', fontWeight:600 }}>hackathon</Link> you participate in or win adds another credential to your profile.
          </p>
        </div>
      </section>

      {/* ══ HOW TO EARN ═══════════════════════════════════════ */}
      <section style={{ background:'#f8faff', padding:'80px 0', borderTop:'1.5px solid #e2e8f0' }}>
        <div className="wrap">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, color:'#0f172a', lineHeight:1.15, marginBottom:12 }}>
              How to Earn Your <span className="cert-shimmer">Certificate</span>
            </h2>
            <p style={{ fontSize:16, color:'#64748b', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
              4 steps. No shortcuts. That's the point — and why it's worth more.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
            {CERT_STEPS.map(s => (
              <div key={s.step} className="cert-card" style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:20, padding:'28px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', right:-8, top:-8, fontSize:90, fontWeight:900, lineHeight:1, color:`${s.color}08`, userSelect:'none' }}>{s.step}</div>
                <div style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color:s.color, marginBottom:18 }}>Step {s.step}</div>
                <div style={{ width:48, height:48, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <s.icon size={22} style={{ color:s.color }} />
                </div>
                <h3 style={{ fontSize:17, fontWeight:800, color:'#1e293b', marginBottom:8, lineHeight:1.3 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.75, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVAILABLE CERTIFICATES ════════════════════════════ */}
      <section style={{ background:'#fff', padding:'80px 0', borderTop:'1.5px solid #e2e8f0' }}>
        <div className="wrap">
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.4rem)', fontWeight:900, color:'#0f172a', marginBottom:10 }}>
              8 Certificates You Can <span className="cert-shimmer">Earn Right Now</span>
            </h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
              Each of these is a real, verifiable credential — not a participation badge.
            </p>
          </div>
          <div className="grid-3">
            {COURSES_CERTS.map(c => (
              <Link key={c.slug} to={`/courses/${c.slug}`} id={`cert-course-${c.slug}`} className="cert-card"
                style={{ background:'#fff', border:`1.5px solid ${c.border}`, borderRadius:16, padding:'24px', textDecoration:'none', display:'flex', alignItems:'center', gap:16, boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:c.bg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${c.border}` }}>
                  <Award size={22} style={{ color:c.color }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:'#0f172a', marginBottom:4 }}>{c.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#94a3b8', fontWeight:600 }}>
                    <span style={{ color:c.color, fontWeight:700, fontSize:11, background:c.bg, padding:'2px 8px', borderRadius:100, border:`1px solid ${c.border}` }}>CERTIFICATE INCLUDED</span>
                    <span>{c.time}</span>
                  </div>
                </div>
                <ArrowRight size={16} style={{ color:c.color, flexShrink:0 }} />
              </Link>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:36 }}>
            <Link to="/free-courses" id="cert-view-all" style={{ color:'#4f46e5', fontWeight:700, fontSize:15, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
              See All Courses <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRUST FEATURES ════════════════════════════════════ */}
      <section style={{ background:'#f8faff', padding:'80px 0', borderTop:'1.5px solid #e2e8f0' }}>
        <div className="wrap">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.4rem)', fontWeight:900, color:'#0f172a', marginBottom:10 }}>
              What Makes a SkillValix Certificate <span className="cert-shimmer">Worth Having</span>
            </h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
              It's not just a PDF. It's proof — designed to be verified, shared, and trusted.
            </p>
          </div>
          <div className="grid-3">
            {CERT_TRUST.map((f, i) => (
              <div key={i} className="cert-card" style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:20, padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <f.icon size={24} style={{ color:f.color }} />
                </div>
                <h3 style={{ fontSize:16, fontWeight:800, color:'#1e293b', marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.75, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF ══════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'80px 0', borderTop:'1.5px solid #e2e8f0' }}>
        <div className="wrap">
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.4rem)', fontWeight:900, color:'#0f172a', marginBottom:10 }}>
              Students Who Earned It. <span className="cert-shimmer">Then Used It.</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {SOCIAL_PROOF.map((t, i) => (
              <div key={i} className="cert-card" style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:20, padding:'32px 28px', display:'flex', flexDirection:'column', gap:18, position:'relative', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ position:'absolute', top:20, right:24, fontSize:64, lineHeight:1, fontWeight:900, color:'#f0f4ff', userSelect:'none' }}>"</div>
                <div style={{ display:'flex', gap:3 }}>
                  {[...Array(5)].map((_,si)=><Star key={si} size={15} style={{ color:'#f59e0b',fill:'#f59e0b' }} />)}
                </div>
                <p style={{ fontSize:14, color:'#475569', lineHeight:1.8, flex:1, fontStyle:'italic', margin:0 }}>"{t.quote}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:14, paddingTop:18, borderTop:'1px solid #f1f5f9' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:14, background:`linear-gradient(135deg,#6366f1,#8b5cf6)` }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{t.role}</div>
                  </div>
                  <CheckCircle2 size={18} style={{ color:'#10b981', marginLeft:'auto', flexShrink:0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HACKATHON CERT CALLOUT ════════════════════════════ */}
      <section style={{ background:'#f8faff', padding:'64px 0', borderTop:'1.5px solid #e2e8f0' }}>
        <div className="wrap" style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ background:'linear-gradient(135deg,#0f172a,#1e1b4b 50%,#312e81)', borderRadius:24, padding:'48px 40px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:'rgba(99,102,241,0.20)', filter:'blur(70px)', top:'-30%', right:'-5%', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Trophy size={24} style={{ color:'#f59e0b' }} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Stack Your Credentials</div>
                  <h3 style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, margin:0 }}>Course Certificate + Hackathon Certificate = Unstoppable Profile</h3>
                </div>
              </div>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.8, marginBottom:28, maxWidth:560 }}>
                A course certificate shows you can <strong style={{ color:'#fff' }}>learn</strong>.
                A hackathon project shows you can <strong style={{ color:'#fff' }}>build</strong>.
                Students who have both are the ones hiring managers remember.
                Join a <strong style={{ color:'#fff' }}>free SkillValix hackathon</strong> and stack both credentails on the same profile — it's the fastest way to stand out.
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
                <Link to="/hackathons" id="cert-hack-cta" style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', padding:'12px 28px', borderRadius:12, fontWeight:700, fontSize:14, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
                  <Trophy size={16} /> Join a Hackathon
                </Link>
                <Link to="/free-courses" id="cert-courses-cta" style={{ background:'rgba(255,255,255,0.10)', color:'#fff', padding:'12px 24px', borderRadius:12, fontWeight:600, fontSize:14, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, border:'1px solid rgba(255,255,255,0.2)' }}>
                  <BookOpen size={16} /> Start a Course
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'80px 0', borderTop:'1.5px solid #e2e8f0' }}>
        <div style={{ maxWidth:720, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.4rem)', fontWeight:900, color:'#0f172a', marginBottom:10 }}>Certification FAQ</h2>
            <p style={{ fontSize:15, color:'#64748b', lineHeight:1.7 }}>Everything you need to know about earning and using your SkillValix certificate.</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', padding:'96px 24px', textAlign:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#312e81,#4f46e5 45%,#6d28d9 100%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'56px 56px', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:10, maxWidth:700, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:100, padding:'7px 18px', marginBottom:28, backdropFilter:'blur(10px)' }}>
            <Sparkles size={14} style={{ color:'#fbbf24' }} />
            <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.85)' }}>2,800+ students already hold their certificate</span>
          </div>
          <h2 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            Skills without proof<br />are just hobbies.
            <span style={{ display:'block', background:'linear-gradient(135deg,#e0e7ff,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginTop:8 }}>
              Earn the certificate. Make it official.
            </span>
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', maxWidth:480, margin:'0 auto 40px', lineHeight:1.75 }}>
            Start the course. Pass the exam. Unlock your certificate. Then watch what happens to your LinkedIn replies.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:14 }}>
            <Link to="/courses" id="cert-final-cta-start" style={{ background:'#fff', color:'#4338ca', fontWeight:800, fontSize:16, padding:'16px 40px', borderRadius:14, textDecoration:'none', boxShadow:'0 4px 24px rgba(0,0,0,0.25)', display:'inline-flex', alignItems:'center', gap:8 }}>
              <Rocket size={18} /> Start Your First Course
            </Link>
            <Link to="/hackathons" id="cert-final-cta-hack" style={{ background:'rgba(255,255,255,0.12)', color:'#fff', fontWeight:700, fontSize:16, padding:'15px 32px', borderRadius:14, textDecoration:'none', border:'2px solid rgba(255,255,255,0.3)', display:'inline-flex', alignItems:'center', gap:8 }}>
              <Trophy size={18} /> Join a Hackathon
            </Link>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 28px', marginTop:32 }}>
            {['Courses are free', 'Real exams. Real certificates.', 'Instantly verifiable'].map((t, i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:500 }}>
                <CheckCircle2 size={14} style={{ color:'rgba(52,211,153,0.8)' }} />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
