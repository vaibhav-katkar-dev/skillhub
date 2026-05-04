import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { H as Helmet } from "../main.mjs";
import { Link } from "react-router-dom";
import { Rocket, ArrowRight, Trophy, Users, Award, Star, Clock, BookOpen, Play, GraduationCap, Target, ShieldCheck, Zap, Code2, CheckCircle2, Sparkles, ChevronDown } from "lucide-react";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const COURSES = [
  { slug: "ultimate-html-masterclass", title: "HTML for Beginners", level: "Beginner", duration: "4 hrs", modules: 12, rating: 4.9, tag: "Most Popular", tagColor: "#6366f1", tagBg: "#eef2ff", accent: "#6366f1", accentBg: "#eef2ff", accentBorder: "#c7d2fe", skills: ["HTML5", "Semantics", "Forms", "SEO Basics"], desc: "Build the foundation of every website. Learn HTML5 from scratch — structure, semantics, forms — and prove your skills with a verified certificate." },
  { slug: "css-for-beginners-learn-web-styling-zero-to-pro", title: "CSS for Beginners", level: "Beginner", duration: "5 hrs", modules: 10, rating: 4.8, tag: "Trending", tagColor: "#0ea5e9", tagBg: "#f0f9ff", accent: "#0ea5e9", accentBg: "#f0f9ff", accentBorder: "#bae6fd", skills: ["CSS3", "Flexbox", "Grid", "Animations"], desc: "Master modern CSS — Flexbox, Grid, animations. Go from plain HTML to polished, professional-looking websites." },
  { slug: "ultimate-javascript-masterclass", title: "JavaScript for Beginners", level: "Beginner", duration: "6 hrs", modules: 14, rating: 4.9, tag: "Hot 🔥", tagColor: "#f59e0b", tagBg: "#fffbeb", accent: "#f59e0b", accentBg: "#fffbeb", accentBorder: "#fde68a", skills: ["ES6+", "DOM", "Events", "Async JS"], desc: "The skill that opens every door. Learn JavaScript — variables, functions, DOM, async — and become the developer companies are hiring." },
  { slug: "ultimate-python-masterclass", title: "Python for Beginners", level: "Beginner", duration: "6 hrs", modules: 15, rating: 4.8, tag: "New", tagColor: "#10b981", tagBg: "#ecfdf5", accent: "#10b981", accentBg: "#ecfdf5", accentBorder: "#a7f3d0", skills: ["Python 3", "OOP", "File I/O", "Libraries"], desc: "The most beginner-friendly language in the world. Used by data scientists, AI engineers, and automation pros. Start here." },
  { slug: "ultimate-java-masterclass", title: "Java Programming", level: "Beginner", duration: "7 hrs", modules: 16, rating: 4.7, tag: "Beginner", tagColor: "#8b5cf6", tagBg: "#f5f3ff", accent: "#8b5cf6", accentBg: "#f5f3ff", accentBorder: "#ddd6fe", skills: ["Java", "OOP", "Collections", "Streams"], desc: "Structured, powerful, in-demand. Java gives you backend, Android, and enterprise-level credibility. Build it here." },
  { slug: "ultimate-c-programming", title: "C Programming", level: "Beginner", duration: "6 hrs", modules: 12, rating: 4.8, tag: "Hardware", tagColor: "#64748b", tagBg: "#f8fafc", accent: "#64748b", accentBg: "#f8fafc", accentBorder: "#e2e8f0", skills: ["C", "Pointers", "Memory", "Embedded"], desc: "Master the mother of all modern programming languages. Learn memory management and low-level systems programming." },
  { slug: "modern-cpp-mastery", title: "Modern C++", level: "Intermediate", duration: "8 hrs", modules: 14, rating: 4.9, tag: "Advanced", tagColor: "#4338ca", tagBg: "#eef2ff", accent: "#4338ca", accentBg: "#eef2ff", accentBorder: "#c7d2fe", skills: ["C++", "OOP", "STL", "Performance"], desc: "Level up from C to C++. Learn Object-Oriented Principles, the STL, and advanced memory safety." },
  { slug: "basics-of-artificial-intelligence-beginners", title: "AI for Beginners", level: "Beginner", duration: "5 hrs", modules: 11, rating: 4.9, tag: "Trending", tagColor: "#ef4444", tagBg: "#fef2f2", accent: "#ef4444", accentBg: "#fef2f2", accentBorder: "#fecaca", skills: ["AI Concepts", "ML Basics", "Neural Nets", "Use Cases"], desc: "AI is the defining skill of this decade. Understand it, talk about it, build with it — before everyone else does." }
];
const BENEFITS = [
  { icon: BookOpen, title: "Structured Learning Paths", desc: "Every course is built lesson-by-lesson so you always know what comes next. No confusion, no rabbit holes — just clear progress.", color: "#6366f1", bg: "#eef2ff" },
  { icon: ShieldCheck, title: "Verified Certificates", desc: "Pass the exam and earn a certificate with your name and a unique verification ID — ready to share on LinkedIn the moment you unlock it.", color: "#10b981", bg: "#ecfdf5" },
  { icon: Zap, title: "Learn in Hours, Not Months", desc: "Focused students finish in as little as 2–6 hours. Built for the generation that moves fast and doesn't wait for a semester to start.", color: "#f59e0b", bg: "#fffbeb" },
  { icon: GraduationCap, "title": "Beginner-First Design", desc: "Zero prerequisites. Written for someone opening a code editor for the first time. Every concept is explained from the ground up.", color: "#0ea5e9", bg: "#f0f9ff" },
  { icon: Target, title: "Real Exam. Real Credential.", "desc": "Server-graded assessments that actually test your understanding. When you pass — it means something. So does the certificate.", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: Code2, title: "Hands-On Code Examples", desc: "Every lesson includes real, runnable code. Copy it, break it, fix it. That's how engineers actually learn.", color: "#ef4444", bg: "#fef2f2" }
];
const COMPARISON = [
  { feature: "Course Access", skillvalix: "Free — Always", others: "Paywalled / Subscription" },
  { feature: "Certificate", skillvalix: "Earn & Unlock on Completion", others: "Paid add-on or unavailable" },
  { feature: "Exam", skillvalix: "Server-graded, Secure", others: "Often skipped or self-graded" },
  { feature: "Pace", skillvalix: "Self-paced, No Deadline", others: "Cohort-based or time-limited" },
  { feature: "Hackathons", skillvalix: "Student Hackathons Included", others: "Rarely offered" },
  { feature: "Verification", skillvalix: "Instant Employer Verification", others: "Manual or unavailable" }
];
const FAQS = [
  { q: "Are the courses on SkillValix really free?", a: "Yes — all courses on SkillValix are completely free to access. No credit card, no sign-up fee, no subscription. Start any course right now at zero cost." },
  { q: "What happens after I complete a course?", a: "Once you finish all lessons and pass the final exam, you unlock your verified certificate — a unique credential with your name and a verification ID that you can share on LinkedIn, your resume, or your portfolio." },
  { q: "How long does it take to complete a course?", a: "Most learners finish in 2–6 hours of focused study. Many students go from zero to exam-ready in a single day. You set the pace — no deadlines, no pressure." },
  { q: "Are SkillValix certificates trusted by employers?", a: "Yes. Each certificate carries a unique verification ID. Employers can confirm your achievement at skillvalix.com/verify in seconds. Thousands of students have added SkillValix certificates to their LinkedIn profiles and landed internships as a result." },
  { q: "Which courses are available on SkillValix?", a: "SkillValix currently offers courses in HTML, CSS, JavaScript, Python, Java, and Artificial Intelligence — all at beginner level, all free to learn. New courses are added regularly." },
  { q: "Can I join hackathons on SkillValix too?", a: "Absolutely. SkillValix hosts online student hackathons where you build real projects, compete with peers across India, and get recognized. Great for your portfolio — especially if you combine it with a course certificate." }
];
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: `1.5px solid ${open ? "#6366f1" : "#e2e8f0"}`, borderRadius: 16, overflow: "hidden", boxShadow: open ? "0 4px 24px rgba(99,102,241,0.10)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all .25s ease" }, children: [
    /* @__PURE__ */ jsxs("button", { onClick: () => setOpen((o) => !o), style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: 15, color: open ? "#4f46e5" : "#1e293b", lineHeight: 1.4 }, children: q }),
      /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: open ? "#6366f1" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }, children: /* @__PURE__ */ jsx(ChevronDown, { size: 16, style: { color: open ? "#fff" : "#64748b" } }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .3s ease", opacity: open ? 1 : 0 }, children: /* @__PURE__ */ jsx("p", { style: { padding: "0 28px 20px", margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.8 }, children: a }) })
  ] });
}
function FreeCourses() {
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: "'Inter', system-ui, sans-serif", background: "#fff", color: "#0f172a", overflowX: "hidden" }, children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Free Online Courses for Students | Earn a Verified Certificate – SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "SkillValix offers 100% free online courses in HTML, CSS, JavaScript, Python, Java & AI. Learn at your pace, pass the exam, and earn a verified certificate. Trusted by 2,800+ students. Start now." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "free online courses for students, free courses with certificate, skill based certification platform, learn skills online free, free web development course India, online courses for beginners, free programming courses, student certification platform, SkillValix free courses, best free courses India" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.skillvalix.com/free-courses" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://www.skillvalix.com/free-courses" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Free Online Courses for Students | Earn a Verified Certificate – SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Learn HTML, CSS, JavaScript, Python, Java & AI — free. Pass the exam, earn a verified certificate, and stand out. 2,800+ learners on SkillValix." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://www.skillvalix.com/og-home.png" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Free Online Courses for Students | Earn a Verified Certificate – SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Free courses in HTML, CSS, JavaScript, Python & AI. Learn, pass the exam, unlock your certificate. 2,800+ students on SkillValix." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://www.skillvalix.com/og-home.png" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Free Online Courses on SkillValix",
        "description": "Learn HTML, CSS, JavaScript, Python, Java and AI for free on SkillValix. Earn a verified certificate on completion.",
        "url": "https://www.skillvalix.com/free-courses",
        "numberOfItems": COURSES.length,
        "itemListElement": COURSES.map((c, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Course",
            "name": c.title,
            "description": c.desc,
            "url": `https://www.skillvalix.com/courses/${c.slug}`,
            "provider": { "@type": "Organization", "name": "SkillValix", "url": "https://www.skillvalix.com" },
            "isAccessibleForFree": true,
            "educationalLevel": "Beginner",
            "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online" }
          }
        }))
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.skillvalix.com" },
          { "@type": "ListItem", "position": 2, "name": "Free Courses", "item": "https://www.skillvalix.com/free-courses" }
        ]
      }) }),
      /* @__PURE__ */ jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap", rel: "stylesheet" })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        * { box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-20px)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-14px,18px)} }
        .fc-shimmer { background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
        .fc-card { transition:transform .3s ease,box-shadow .3s ease; }
        .fc-card:hover { transform:translateY(-6px); box-shadow:0 16px 48px rgba(0,0,0,0.10) !important; }
        .wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
        @media(min-width:1280px){ .wrap{padding:0 48px;} }
        .grid-2 { display:grid; grid-template-columns:1fr; gap:20px; }
        .grid-3 { display:grid; grid-template-columns:1fr; gap:24px; }
        @media(min-width:640px){ .grid-2{grid-template-columns:1fr 1fr;} }
        @media(min-width:768px){ .grid-3{grid-template-columns:1fr 1fr;} }
        @media(min-width:1024px){ .grid-3{grid-template-columns:repeat(3,1fr);} }
      ` }),
    /* @__PURE__ */ jsxs("section", { style: { background: "linear-gradient(160deg,#eef2ff 0%,#f4f7ff 50%,#fafcff 100%)", padding: "96px 0 80px", position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "rgba(99,102,241,0.08)", filter: "blur(100px)", top: "-20%", left: "-10%", animation: "floatA 12s ease-in-out infinite", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "rgba(139,92,246,0.07)", filter: "blur(100px)", bottom: "-10%", right: "-8%", animation: "floatB 14s ease-in-out infinite", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { className: "wrap", style: { position: "relative", zIndex: 10, textAlign: "center" }, children: [
        /* @__PURE__ */ jsxs("nav", { "aria-label": "breadcrumb", style: { marginBottom: 24, fontSize: 13, color: "#94a3b8" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", style: { color: "#6366f1", textDecoration: "none", fontWeight: 600 }, children: "Home" }),
          /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#64748b" }, children: "Free Courses" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 100, padding: "7px 18px", marginBottom: 28, boxShadow: "0 2px 12px rgba(99,102,241,0.10)" }, children: [
          /* @__PURE__ */ jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "block" } }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.05em" }, children: "LEARN FREE · STUDY AT YOUR PACE · PROVE YOUR SKILLS" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { style: { fontSize: "clamp(2.2rem,6vw,3.8rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }, children: [
          /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#0f172a" }, children: "Free Online Courses." }),
          /* @__PURE__ */ jsx("span", { className: "fc-shimmer", style: { display: "block" }, children: "Real Skills. Verified Credentials." })
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 18, color: "#475569", maxWidth: 600, margin: "0 auto 16px", lineHeight: 1.8 }, children: [
          "All ",
          /* @__PURE__ */ jsx("strong", { style: { color: "#0f172a" }, children: "SkillValix courses are 100% free" }),
          " to learn. Study HTML, CSS, JavaScript, Python, Java or AI at your own pace — then pass the exam and ",
          /* @__PURE__ */ jsx("strong", { style: { color: "#4f46e5" }, children: "unlock a verified certificate" }),
          " that employers can confirm in seconds."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#64748b", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }, children: "2,800+ students have already started. The ones who finished — and earned their certificate — have the LinkedIn badge and the internship offers to show for it." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginBottom: 44 }, children: [
          /* @__PURE__ */ jsxs(Link, { to: "/courses", id: "fc-cta-courses", style: { background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(79,70,229,0.35)", transition: "transform .2s" }, children: [
            /* @__PURE__ */ jsx(Rocket, { size: 17 }),
            " Start Learning Free ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 17 })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/hackathons", id: "fc-cta-hackathons", style: { background: "#fff", color: "#374151", padding: "13px 28px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, border: "1.5px solid #e0e7ff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all .2s" }, children: [
            /* @__PURE__ */ jsx(Trophy, { size: 17, style: { color: "#f59e0b" } }),
            " Join a Hackathon"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 24px" }, children: [{ icon: Users, text: "2,800+ students learning", color: "#6366f1" }, { icon: Award, text: "Verified certificate on completion", color: "#10b981" }, { icon: Star, text: "4.9 avg rating", color: "#f59e0b" }].map(({ icon: Icon, text, color }, i) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b" }, children: [
          /* @__PURE__ */ jsx(Icon, { size: 15, style: { color, flexShrink: 0 } }),
          text
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "80px 0", borderTop: "1.5px solid #f1f5f9" }, children: /* @__PURE__ */ jsxs("div", { className: "wrap", style: { maxWidth: 800, margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 900, color: "#0f172a", textAlign: "center", marginBottom: 20, lineHeight: 1.2 }, children: [
        "Why Thousands of Students Choose ",
        /* @__PURE__ */ jsx("span", { className: "fc-shimmer", children: "SkillValix" })
      ] }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: 16, color: "#475569", lineHeight: 1.85, marginBottom: 18 }, children: [
        /* @__PURE__ */ jsx("strong", { children: "SkillValix" }),
        " is a ",
        /* @__PURE__ */ jsx("strong", { children: "skill-based certification platform" }),
        " built for students and beginners aged 16–30. Every course is free to access — because we believe the decision to learn should never be blocked by money. What you earn at the end — a ",
        /* @__PURE__ */ jsx(Link, { to: "/certification", style: { color: "#4f46e5", fontWeight: 600 }, children: "verified certificate" }),
        " — is the proof that you actually did the work."
      ] }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: 16, color: "#475569", lineHeight: 1.85, marginBottom: 18 }, children: [
        "Start with ",
        /* @__PURE__ */ jsx(Link, { to: "/courses/ultimate-html-masterclass", style: { color: "#4f46e5", fontWeight: 600 }, children: "HTML" }),
        ", stack on ",
        /* @__PURE__ */ jsx(Link, { to: "/courses/css-for-beginners-learn-web-styling-zero-to-pro", style: { color: "#4f46e5", fontWeight: 600 }, children: "CSS" }),
        " and",
        /* @__PURE__ */ jsx(Link, { to: "/courses/ultimate-javascript-masterclass", style: { color: "#4f46e5", fontWeight: 600 }, children: " JavaScript" }),
        ", then level up with",
        /* @__PURE__ */ jsx(Link, { to: "/courses/ultimate-python-masterclass", style: { color: "#4f46e5", fontWeight: 600 }, children: " Python" }),
        ",",
        /* @__PURE__ */ jsx(Link, { to: "/courses/ultimate-java-masterclass", style: { color: "#4f46e5", fontWeight: 600 }, children: " Java" }),
        ",",
        /* @__PURE__ */ jsx(Link, { to: "/courses/ultimate-c-programming", style: { color: "#4f46e5", fontWeight: 600 }, children: " C" }),
        ",",
        /* @__PURE__ */ jsx(Link, { to: "/courses/modern-cpp-mastery", style: { color: "#4f46e5", fontWeight: 600 }, children: " C++" }),
        ", or",
        /* @__PURE__ */ jsx(Link, { to: "/courses/basics-of-artificial-intelligence-beginners", style: { color: "#4f46e5", fontWeight: 600 }, children: " AI" }),
        ". Each course has a final exam — pass it, and a certificate with your name lands in your hands."
      ] }),
      /* @__PURE__ */ jsxs("p", { style: { fontSize: 16, color: "#475569", lineHeight: 1.85 }, children: [
        "On top of courses, SkillValix runs ",
        /* @__PURE__ */ jsx(Link, { to: "/hackathons", style: { color: "#4f46e5", fontWeight: 600 }, children: "free student hackathons" }),
        " — real build challenges that push your skills further and give you the kind of experience that looks exceptional on a resume."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "free-courses-list", style: { background: "#f8faff", padding: "80px 0", borderTop: "1.5px solid #e2e8f0" }, children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 52 }, children: [
        /* @__PURE__ */ jsx("span", { style: { display: "inline-block", background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe", borderRadius: 100, padding: "5px 16px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }, children: "Learn Free" }),
        /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.15, marginBottom: 12 }, children: [
          "8 Courses. All Free.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "fc-shimmer", children: "Every one comes with a certificate." })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 16, color: "#64748b", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }, children: "Pick any course, study at your pace, pass the exam — and earn a credential that actually means something." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid-3", children: COURSES.map((c) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/courses/${c.slug}`,
          id: `fc-course-${c.slug}`,
          className: "fc-card",
          style: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, overflow: "hidden", textDecoration: "none", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
          children: [
            /* @__PURE__ */ jsxs("div", { style: { background: `linear-gradient(135deg,${c.accentBg},${c.accentBorder}30)`, padding: "28px 24px 20px", borderBottom: `1px solid ${c.accentBorder}` }, children: [
              /* @__PURE__ */ jsx("span", { style: { background: c.tagBg, color: c.tagColor, border: `1px solid ${c.accentBorder}`, borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }, children: c.tag }),
              /* @__PURE__ */ jsx("h3", { style: { fontSize: 20, fontWeight: 900, color: "#0f172a", marginTop: 14, marginBottom: 8, lineHeight: 1.3 }, children: c.title }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }, children: c.desc })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }, children: [
              /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: c.skills.map((s) => /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: c.accentBg, color: c.accent, border: `1px solid ${c.accentBorder}`, textTransform: "uppercase", letterSpacing: "0.05em" }, children: s }, s)) }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, fontSize: 12, fontWeight: 600, color: "#94a3b8", paddingTop: 12, borderTop: "1px solid #f1f5f9" }, children: [
                /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
                  /* @__PURE__ */ jsx(Clock, { size: 13 }),
                  c.duration
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
                  /* @__PURE__ */ jsx(BookOpen, { size: 13 }),
                  c.modules,
                  " lessons"
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }, children: [
                  /* @__PURE__ */ jsx(Star, { size: 13, style: { color: "#f59e0b", fill: "#f59e0b" } }),
                  c.rating
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { padding: "12px", borderRadius: 10, background: `linear-gradient(135deg,${c.accentBg},#fff)`, color: c.accent, border: `1px solid ${c.accentBorder}`, fontWeight: 700, fontSize: 14, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsx(Play, { size: 14 }),
                " Start Course Free →"
              ] })
            ] })
          ]
        },
        c.slug
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "80px 0", borderTop: "1.5px solid #e2e8f0" }, children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 52 }, children: [
        /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.15, marginBottom: 12 }, children: [
          "From Zero to ",
          /* @__PURE__ */ jsx("span", { className: "fc-shimmer", children: "Certified" }),
          " — 4 Steps"
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 16, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }, children: "No classroom. No schedule. Just you, the course, and a certificate waiting at the finish line." })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }, children: [
        { step: "01", title: "Pick Your Course", desc: "Choose any of the 8 free courses — HTML, CSS, JS, Python, Java, C, C++, or AI. All free, all beginner-friendly.", color: "#6366f1", bg: "#eef2ff", icon: BookOpen },
        { step: "02", title: "Study at Your Own Pace", desc: "No deadlines, no cohort, no pressure. Go lesson by lesson whenever you have time. Progress is always saved.", color: "#8b5cf6", bg: "#f5f3ff", icon: GraduationCap },
        { step: "03", title: "Pass the Final Exam", desc: "A real, server-graded exam that tests what you actually learned. Not easy — which is exactly why the certificate means something.", color: "#0ea5e9", bg: "#f0f9ff", icon: Target },
        { step: "04", title: "Unlock Your Certificate", desc: "Pass the exam and earn your verified certificate — shareable, verifiable, and ready for LinkedIn the moment you get it.", color: "#10b981", bg: "#ecfdf5", icon: Award }
      ].map((s) => /* @__PURE__ */ jsxs("div", { className: "fc-card", style: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsx("div", { style: { position: "absolute", right: -8, top: -8, fontSize: 90, fontWeight: 900, lineHeight: 1, color: `${s.color}08`, userSelect: "none" }, children: s.step }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: s.color, marginBottom: 18 }, children: [
          "Step ",
          s.step
        ] }),
        /* @__PURE__ */ jsx("div", { style: { width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }, children: /* @__PURE__ */ jsx(s.icon, { size: 22, style: { color: s.color } }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: 17, fontWeight: 800, color: "#1e293b", marginBottom: 8, lineHeight: 1.3 }, children: s.title }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.75, margin: 0 }, children: s.desc })
      ] }, s.step)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#f8faff", padding: "80px 0", borderTop: "1.5px solid #e2e8f0" }, children: /* @__PURE__ */ jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 52 }, children: [
        /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.15, marginBottom: 12 }, children: [
          "Why the Best Students ",
          /* @__PURE__ */ jsx("span", { className: "fc-shimmer", children: "Choose SkillValix" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 16, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }, children: "Not just another online course. A platform built to produce confident, certified, job-ready developers." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid-3", children: BENEFITS.map((b, i) => /* @__PURE__ */ jsxs("div", { className: "fc-card", style: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 52, height: 52, borderRadius: 14, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }, children: /* @__PURE__ */ jsx(b.icon, { size: 24, style: { color: b.color } }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: 17, fontWeight: 800, color: "#1e293b", marginBottom: 8 }, children: b.title }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.75, margin: 0 }, children: b.desc })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "80px 0", borderTop: "1.5px solid #e2e8f0" }, children: /* @__PURE__ */ jsxs("div", { className: "wrap", style: { maxWidth: 760 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 40 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 900, color: "#0f172a", marginBottom: 10 }, children: "SkillValix vs Other Platforms" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#64748b", lineHeight: 1.7 }, children: "Most platforms make you pay to learn. SkillValix flips the model — learn free, earn your credential." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { border: "1.5px solid #e2e8f0", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", padding: "16px 24px", fontWeight: 800, fontSize: 14 }, children: [
          /* @__PURE__ */ jsx("span", { children: "Feature" }),
          /* @__PURE__ */ jsx("span", { style: { textAlign: "center" }, children: "SkillValix ✓" }),
          /* @__PURE__ */ jsx("span", { style: { textAlign: "center" }, children: "Others" })
        ] }),
        COMPARISON.map((row, i) => /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafcff", fontSize: 14 }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, color: "#374151" }, children: row.feature }),
          /* @__PURE__ */ jsxs("span", { style: { textAlign: "center", color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }, children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 14, style: { flexShrink: 0 } }),
            row.skillvalix
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { textAlign: "center", color: "#ef4444", fontWeight: 500 }, children: [
            "✗ ",
            row.others
          ] })
        ] }, i))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#f8faff", padding: "64px 0", borderTop: "1.5px solid #e2e8f0" }, children: /* @__PURE__ */ jsx("div", { className: "wrap", children: /* @__PURE__ */ jsxs("div", { className: "grid-2", style: { gap: 24 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", border: "1.5px solid #c7d2fe", borderRadius: 20, padding: "36px 32px" }, children: [
        /* @__PURE__ */ jsx(Award, { size: 36, style: { color: "#6366f1", marginBottom: 16 } }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: 22, fontWeight: 900, color: "#1e293b", marginBottom: 10 }, children: "Your Certificate Is Waiting" }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 20 }, children: [
          "Every course on SkillValix comes with a ",
          /* @__PURE__ */ jsx(Link, { to: "/certification", style: { color: "#4f46e5", fontWeight: 600 }, children: "verified certificate" }),
          ". Pass the exam and unlock a credential with a unique ID — shareable, verifiable, and genuinely respected by recruiters."
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/certification", id: "fc-cert-link", style: { color: "#4f46e5", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          "Learn about Certification ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { background: "linear-gradient(135deg,#ecfdf5,#f0f9ff)", border: "1.5px solid #a7f3d0", borderRadius: 20, padding: "36px 32px" }, children: [
        /* @__PURE__ */ jsx(Trophy, { size: 36, style: { color: "#059669", marginBottom: 16 } }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: 22, fontWeight: 900, color: "#1e293b", marginBottom: 10 }, children: "Go Further with Hackathons" }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 20 }, children: [
          "A course certificate shows you can learn. A ",
          /* @__PURE__ */ jsx(Link, { to: "/hackathons", style: { color: "#059669", fontWeight: 600 }, children: "hackathon project" }),
          " shows you can build. The students who do both are the ones who stand out."
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/hackathons", id: "fc-hack-link", style: { color: "#059669", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          "View Hackathons ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "80px 0", borderTop: "1.5px solid #e2e8f0" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 720, margin: "0 auto", padding: "0 24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 44 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 900, color: "#0f172a", marginBottom: 10 }, children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#64748b", lineHeight: 1.7 }, children: "Everything you need to know about courses and certification on SkillValix." })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: FAQS.map((f, i) => /* @__PURE__ */ jsx(FaqItem, { ...f }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { style: { position: "relative", overflow: "hidden", padding: "96px 24px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg,#312e81,#4f46e5 45%,#6d28d9 100%)" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "7px 18px", marginBottom: 28, backdropFilter: "blur(10px)" }, children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 14, style: { color: "#fbbf24" } }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }, children: "2,800+ students have already started their journey" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }, children: [
          "Your skills won't prove themselves.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#e0e7ff,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, children: "Start. Learn. Get Certified." })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.75 }, children: "Pick a course. Study free. Pass the exam. Unlock the certificate that tells the world you did the work." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }, children: [
          /* @__PURE__ */ jsxs(Link, { to: "/register", id: "fc-final-cta-register", style: { background: "#fff", color: "#4338ca", fontWeight: 800, fontSize: 16, padding: "16px 40px", borderRadius: 14, textDecoration: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.25)", display: "inline-flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsx(Rocket, { size: 18 }),
            " Start Learning — It's Free"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/hackathons", id: "fc-final-cta-hack", style: { background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "15px 32px", borderRadius: 14, textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsx(Trophy, { size: 18 }),
            " Join a Hackathon"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 28px", marginTop: 32 }, children: ["No credit card needed", "Learn at your pace", "Real verified certificates"].map((t, i) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }, children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 14, style: { color: "rgba(52,211,153,0.8)" } }),
          t
        ] }, i)) })
      ] })
    ] })
  ] });
}
export {
  FreeCourses as default
};
