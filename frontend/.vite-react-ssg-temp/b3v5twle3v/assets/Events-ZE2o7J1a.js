import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { d as api, H as Helmet } from "../main.mjs";
import { Trophy, Rocket, CheckCircle2, CircleDot, Clock3, Star, ArrowRight } from "lucide-react";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const STATUS_STYLE = {
  upcoming: { bg: "bg-amber-100", text: "text-amber-700", label: "Upcoming", icon: Clock3 },
  live: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Live Now", icon: CircleDot },
  ended: { bg: "bg-slate-100", text: "text-slate-500", label: "Ended", icon: CheckCircle2 }
};
function Events() {
  const [hackathons, setHackathons] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);
  useEffect(() => {
    (async () => {
      setLoadingHacks(true);
      try {
        const r = await api.get("/events/hackathons");
        setHackathons(r.data || []);
      } catch {
        setHackathons([]);
      } finally {
        setLoadingHacks(false);
      }
    })();
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Free Student Hackathons with Certificate | SkillValix Online Hackathon Platform" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Join free online hackathons for students on SkillValix. Build real projects, win prizes, and earn verified certificates. Beginner-friendly. Register today — 100% free!" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "student hackathons, free hackathons for students with certificates, online hackathon platform, online hackathon for beginners, SkillValix hackathons, free hackathon India, hackathon with certificate, coding competition for students, free tech events students, programming contest beginners" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.skillvalix.com/hackathons" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://www.skillvalix.com/hackathons" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_IN" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Free Student Hackathons with Certificate | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Build real projects, compete with peers, and earn free verified certificates. Join SkillValix hackathons — open to all beginners. 100% free to enter." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://www.skillvalix.com/og-home.png" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:alt", content: "SkillValix – Free Online Hackathons for Students" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Free Student Hackathons with Certificate | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Join SkillValix free online hackathons for students. Build projects, earn verified certificates, get recognized. Register now." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://www.skillvalix.com/og-home.png" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SkillValix",
        "url": "https://www.skillvalix.com",
        "logo": "https://www.skillvalix.com/logo.svg",
        "sameAs": ["https://www.linkedin.com/company/skillvalix", "https://www.instagram.com/skillvalix"]
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
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
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Are SkillValix hackathons free for students?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all hackathons on SkillValix are 100% free to enter. No registration fee, no hidden charges. Every participant gets a certificate." } },
          { "@type": "Question", "name": "Can beginners join SkillValix hackathons?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! SkillValix hackathons are designed specifically for beginners aged 16-30. No prior experience is required to participate." } },
          { "@type": "Question", "name": "Do I get a certificate for participating in a hackathon?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every participant receives a verified participation certificate. Winners receive special merit certificates that are verifiable on the SkillValix platform." } },
          { "@type": "Question", "name": "How do I register for a hackathon on SkillValix?", "acceptedAnswer": { "@type": "Answer", "text": "Simply create a free SkillValix account, browse the hackathons page, click on any active hackathon, and click the Register button. It takes less than 2 minutes." } },
          { "@type": "Question", "name": "Can I participate in hackathons solo or only in teams?", "acceptedAnswer": { "@type": "Answer", "text": "Both solo and team participation are welcome on SkillValix. Check each hackathon's detail page for specific team size requirements." } }
        ]
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 px-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-20",
          style: {
            backgroundImage: "radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)"
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-4xl mx-auto text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold tracking-widest", children: "HACKATHONS HUB" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl font-black text-white mb-6 leading-tight", children: [
          "Experience Real Work.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent", children: "Build. Submit. Get Recognized." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-300 max-w-2xl mx-auto", children: "Open each hackathon for full details, team registration, secure payment, and submission workflow." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx(Trophy, { className: "w-8 h-8 text-amber-500", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900", children: "Hackathons" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-xl ml-12", children: "Click any hackathon card to view complete details and register your team on a dedicated page." })
      ] }),
      loadingHacks ? /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3].map((item) => /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-100 bg-slate-50 h-72 animate-pulse" }, item)) }) : hackathons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20 text-slate-400", children: [
        /* @__PURE__ */ jsx(Rocket, { className: "w-16 h-16 mx-auto mb-4", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold", children: "No hackathons listed yet." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "Check back soon. Exciting events are coming." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: hackathons.map((hack) => {
        var _a;
        const statusStyle = STATUS_STYLE[hack.status] || STATUS_STYLE.upcoming;
        const StatusIcon = statusStyle.icon;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col",
            children: [
              hack.image ? /* @__PURE__ */ jsx("img", { src: hack.image, alt: hack.title, className: "w-full h-40 object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-40 bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white", children: /* @__PURE__ */ jsx(Trophy, { className: "w-14 h-14", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`, children: [
                    /* @__PURE__ */ jsx(StatusIcon, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
                    statusStyle.label
                  ] }),
                  hack.featured && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold", children: [
                    /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current", "aria-hidden": "true" }),
                    "Featured"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-1", children: hack.title }),
                hack.tagline && /* @__PURE__ */ jsx("p", { className: "text-sm text-indigo-600 font-medium mb-2", children: hack.tagline }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-4 flex-1 line-clamp-3", children: hack.description }),
                ((_a = hack.tags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mb-4", children: hack.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs", children: tag }, tag)) }),
                hack.registrationDeadline && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-2 text-xs font-semibold bg-indigo-50 p-2.5 rounded-xl border border-indigo-100", children: [
                  /* @__PURE__ */ jsx(Clock3, { className: "w-4 h-4 text-indigo-500" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-indigo-700", children: [
                    "Reg. Deadline: ",
                    new Date(hack.registrationDeadline).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                  ] })
                ] }),
                (hack.submissionDeadline || hack.endDate) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-4 text-xs font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-100", children: [
                  /* @__PURE__ */ jsx(Clock3, { className: "w-4 h-4 text-rose-500" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-rose-700", children: [
                    "Sub. Deadline: ",
                    new Date(hack.submissionDeadline || hack.endDate).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: `/hackathons/${hack.slug || hack._id}`,
                    className: "block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity",
                    children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                      "View Details & Register",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4", "aria-hidden": "true" })
                    ] })
                  }
                )
              ] })
            ]
          },
          hack._id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-slate-50 border-t border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-14", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900 mb-4", children: "What Is a Student Hackathon?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-600 text-lg leading-relaxed mb-4", children: [
          "A ",
          /* @__PURE__ */ jsx("strong", { children: "student hackathon" }),
          " is a time-limited building competition where participants — individually or in teams — solve a real-world problem by creating a working software project. Hackathons typically run for 24–72 hours and end with project submissions that are evaluated by judges."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-600 leading-relaxed mb-4", children: [
          "On SkillValix, hackathons are designed specifically for students and beginners aged 16–30. They're ",
          /* @__PURE__ */ jsx("strong", { children: "100% free to enter" }),
          ", fully online, and structured around beginner-friendly themes like EdTech, Social Impact, Health Tech, and Web Development. You don't need to be a senior developer to participate — you need curiosity, commitment, and a willingness to build."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 leading-relaxed", children: "Every hackathon on SkillValix comes with a verified participation certificate. Winners receive merit certificates that appear on their public SkillValix profile — verifiable by any employer or university." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900 mb-6", children: "Why Join a Hackathon? 7 Reasons That Matter" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
          { num: "01", title: "Build Real Projects", desc: "Hackathons force you to build something complete under time pressure — the most effective way to consolidate everything you've learned in courses." },
          { num: "02", title: "Earn a Verified Certificate", desc: "Every SkillValix hackathon participant earns a certificate. Winners get a merit certificate visible on their public profile and verifiable by employers." },
          { num: "03", title: "Stand Out in Applications", desc: "Hackathon participation shows recruiters you can build, not just learn. It's the portfolio evidence that separates you from 90% of applicants." },
          { num: "04", title: "Learn Faster Under Pressure", desc: "Time constraints accelerate learning. You'll figure out in 48 hours what might take weeks in a classroom — because you have a real goal to ship." },
          { num: "05", title: "Network with Peers", desc: "Meet other students and developers from across India who are building in the same space. Communities formed in hackathons often turn into co-founders and collaborators." },
          { num: "06", title: "Free to Enter", desc: "No registration fee. No hidden charges. SkillValix hackathons are 100% free for all students. Your only investment is time and effort." },
          { num: "07", title: "Beginner-Friendly Themes", desc: "Themes are chosen specifically for beginners. You don't need to know machine learning or blockchain — a well-built web app solves real problems and wins." }
        ].map(({ num, title, desc }) => /* @__PURE__ */ jsxs("div", { style: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "24px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, fontWeight: 900, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 8 }, children: [
            "REASON ",
            num
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-slate-900 font-bold text-base mb-2", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm leading-relaxed", children: desc })
        ] }, num)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900 mb-6", children: "How SkillValix Hackathons Work" }),
        /* @__PURE__ */ jsx("ol", { className: "space-y-4", children: [
          { step: "1", title: "Create a Free Account", desc: "Register on SkillValix — it's free and takes under 2 minutes. No credit card required." },
          { step: "2", title: "Browse Open Hackathons", desc: "Visit this page to see all active, upcoming, and past hackathons. Each listing shows the theme, deadline, prize, and eligibility." },
          { step: "3", title: "Register Before the Deadline", desc: 'Click "View Details & Register" on the hackathon you want to join. Complete the registration form as a solo participant or with your team.' },
          { step: "4", title: "Build Your Project", desc: "Work on your solution during the hackathon window. Use any tech stack — HTML/CSS/JS, React, Python, or any language you're comfortable with." },
          { step: "5", title: "Submit Before the Deadline", desc: "Submit your project via the hackathon submission form. Include a demo link, GitHub repo, and a short description of the problem you solved." },
          { step: "6", title: "Receive Your Certificate", desc: "All valid submissions receive a participation certificate. Top submissions get merit certificates and are featured on the SkillValix platform." }
        ].map(({ step, title, desc }) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 items-start", children: [
          /* @__PURE__ */ jsx("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#eef2ff", border: "1.5px solid #c7d2fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#4f46e5", fontSize: 14, flexShrink: 0 }, children: step }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900 mb-0.5", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm leading-relaxed", children: desc })
          ] })
        ] }, step)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14 p-8 rounded-2xl", style: { background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1.5px solid #c7d2fe" }, children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-slate-900 mb-3", children: "Prepare for Your First Hackathon" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-5 text-sm leading-relaxed", children: "Not sure if your skills are ready? The fastest way to get hackathon-ready is to complete one of our free courses. Most hackathon winners started with these exact resources." }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: [
          { label: "JavaScript Course →", to: "/courses/ultimate-javascript-masterclass" },
          { label: "Python Course →", to: "/courses/ultimate-python-masterclass" },
          { label: "HTML Course →", to: "/courses/ultimate-html-masterclass" },
          { label: "CSS Course →", to: "/courses/css-for-beginners-learn-web-styling-zero-to-pro" },
          { label: "AI Course →", to: "/courses/basics-of-artificial-intelligence-beginners" }
        ].map(({ label, to }) => /* @__PURE__ */ jsx(Link, { to, style: { background: "#fff", color: "#4f46e5", border: "1.5px solid #c7d2fe", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, textDecoration: "none" }, children: label }, to)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900 mb-6", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
          { q: "Are SkillValix hackathons free for students?", a: "Yes. All hackathons on SkillValix are 100% free to enter. There is no registration fee, no hidden charges, and no payment required at any step. Every participant receives a verified certificate." },
          { q: "Can complete beginners participate in hackathons on SkillValix?", a: "Absolutely. SkillValix hackathons are specifically designed for students and beginners aged 16–30. Hackathon themes are chosen to be accessible to participants who have basic coding knowledge. If you've completed even one free course on SkillValix, you have enough foundation to participate." },
          { q: "What kind of projects can I build in a SkillValix hackathon?", a: "You can build any software project — a web app, a mobile app, a data analysis tool, or an AI prototype — as long as it responds to the hackathon's theme. Most winning projects are simple, well-executed ideas that clearly solve a real problem." },
          { q: "Do I get a certificate for participating even if I don't win?", a: "Yes. Every participant who submits a valid project receives a verified participation certificate. Winners receive a special merit certificate that highlights their achievement. Both certificates are verifiable on the SkillValix platform." },
          { q: "Can I participate solo or do I need a team?", a: "Both solo and team participation are supported. Check the specific hackathon details page for team size requirements. Solo participation is fully competitive — many of our strongest submissions come from individual participants." },
          { q: "How is the hackathon evaluated?", a: "Projects are evaluated by SkillValix judges on four criteria: (1) problem clarity — is a real problem clearly defined; (2) solution quality — does the project actually address it; (3) technical execution — does the product work; (4) impact potential — could this scale or help real users." }
        ].map(({ q, a }) => /* @__PURE__ */ jsxs("details", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden group", style: { boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }, children: [
          /* @__PURE__ */ jsxs("summary", { className: "flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-bold text-slate-800 text-sm list-none select-none", children: [
            q,
            /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#64748b", fontWeight: 400 }, children: "+" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "px-6 pb-5 text-sm text-slate-500 leading-relaxed", children: a })
        ] }, q)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900 mb-4", children: "Learn More About Hackathons" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/blog/how-to-win-a-hackathon-beginner-guide-2026", style: { color: "#4f46e5", fontSize: 13, fontWeight: 600, textDecoration: "none", background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 8, padding: "8px 14px" }, children: "How to Win a Hackathon: Beginner Guide →" }),
          /* @__PURE__ */ jsx(Link, { to: "/blog/web-development-roadmap-2026-beginners", style: { color: "#4f46e5", fontSize: 13, fontWeight: 600, textDecoration: "none", background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 8, padding: "8px 14px" }, children: "Web Development Roadmap 2026 →" }),
          /* @__PURE__ */ jsx(Link, { to: "/blog/free-online-courses-with-certificate-india-2026", style: { color: "#4f46e5", fontSize: 13, fontWeight: 600, textDecoration: "none", background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 8, padding: "8px 14px" }, children: "Free Courses with Certificate India →" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Events as default
};
