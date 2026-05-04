import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Briefcase, Award, Zap, CheckCircle, ShieldCheck, GraduationCap, Calendar, Linkedin, FileText, Phone, Github, Globe, Code2, Link as Link$1, ExternalLink, Sparkles, Download, Share2 } from "lucide-react";
import { L as Logo, d as api } from "../main.mjs";
import "react-dom/client";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const safeUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};
function PublicProfile() {
  var _a, _b;
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) setShowNav(false);
      else setShowNav(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [res, coursesRes] = await Promise.all([
          api.get(`/auth/public/${id}`),
          fetch("/data/all-courses.json")
        ]);
        const profileData = res.data;
        if (coursesRes.ok) {
          const rawCourses = await coursesRes.json();
          const allCourses = rawCourses.map((item) => item.course);
          profileData.certificates = profileData.certificates.map((cert) => {
            var _a2;
            const courseIdStr = ((_a2 = cert.course) == null ? void 0 : _a2._id) || cert.course;
            const matched = allCourses.find((c) => c._id.toString() === (courseIdStr == null ? void 0 : courseIdStr.toString()));
            return {
              ...cert,
              course: matched || { title: "Verified Certification", skills: [] }
            };
          });
        }
        setProfile(profileData);
      } catch (err) {
        console.error(err);
        setError("This profile could not be found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center min-h-screen bg-slate-950", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" }),
    /* @__PURE__ */ jsx("p", { className: "text-slate-400 font-bold text-sm tracking-widest uppercase", children: "Loading Portfolio" })
  ] }) });
  if (error) return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center p-6 min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-center max-w-md w-full border border-slate-100", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3", children: /* @__PURE__ */ jsx(Briefcase, { className: "w-10 h-10" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-slate-900 mb-2", children: error }),
    /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm mb-8", children: "The portfolio link might be expired or the user has changed their username." }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-flex w-full justify-center bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]", children: "Go to SkillValix" })
  ] }) });
  const certCount = ((_a = profile.certificates) == null ? void 0 : _a.length) || 0;
  const initials = (profile.name || "").split(" ").map((n) => n[0] || "").join("").toUpperCase().slice(0, 2) || "?";
  const allSkills = Array.from(/* @__PURE__ */ new Set([
    ...profile.customSkills || [],
    ...(profile.certificates || []).map((c) => {
      var _a2;
      return ((_a2 = c.course) == null ? void 0 : _a2.skills) || [];
    }).flat()
  ])).filter(Boolean);
  const isDark = profile.theme === "dark";
  const bgMain = isDark ? "bg-[#0b0f19] text-slate-200" : "bg-[#fafbfc] text-slate-900";
  const bgCard = isDark ? "bg-[#111827] border-slate-800/60 shadow-none" : "bg-white border-slate-200 shadow-sm";
  const textHead = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const bgBadge = isDark ? "bg-slate-800/80 border-slate-700" : "bg-white/90 border-slate-200";
  const textBadge = isDark ? "text-slate-300" : "text-slate-700";
  const canonicalUrl = `https://www.skillvalix.com/u/${profile.username || id}`;
  const seoTitle = `${profile.name} - Professional Portfolio | SkillValix`;
  const seoDesc = profile.bio ? profile.bio.length > 155 ? profile.bio.slice(0, 150) + "..." : profile.bio : `Explore ${profile.name}'s verified professional portfolio, technical projects, and ${certCount} certified skills on SkillValix.`;
  const renderRecruiterVerified = (className = "") => /* @__PURE__ */ jsxs("section", { className: `bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" }),
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-black mb-3", children: "Recruiter Verified" }),
    /* @__PURE__ */ jsx("p", { className: "text-indigo-100 text-xs sm:text-sm leading-relaxed mb-6 font-medium", children: "All credentials shown in this portfolio are graded by SkillValix algorithms and algorithmically verified for authenticity." }),
    /* @__PURE__ */ jsxs("div", { className: "flex bg-white/10 p-1 rounded-xl gap-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => window.print(), className: "flex-1 py-3 bg-white text-indigo-600 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg relative z-10", children: [
        /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
        " Save PDF"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Portfolio Link Copied!");
      }, className: "flex-1 py-3 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-white/20 border border-white/30 hover:bg-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] relative z-10", children: [
        /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" }),
        " Share"
      ] })
    ] })
  ] });
  const schemaJSON = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": profile.joinedAt,
    "mainEntity": {
      "@type": "Person",
      "name": profile.name,
      "description": profile.bio || `Professional portfolio of ${profile.name}.`,
      "url": canonicalUrl,
      "knowsAbout": allSkills,
      "alumniOf": profile.college ? {
        "@type": "CollegeOrUniversity",
        "name": profile.college
      } : void 0,
      "hasCredential": (_b = profile.certificates) == null ? void 0 : _b.map((cert) => {
        var _a2;
        return {
          "@type": "EducationalOccupationalCredential",
          "name": ((_a2 = cert.course) == null ? void 0 : _a2.title) || "SkillValix Certification",
          "credentialCategory": "Certificate",
          "recognizedBy": {
            "@type": "EducationalOrganization",
            "name": "SkillValix",
            "url": "https://www.skillvalix.com"
          }
        };
      })
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 ${bgMain}`, children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: seoDesc }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: seoDesc }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "profile" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "SkillValix" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(schemaJSON) })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: `fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 pointer-events-none ${showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-auto opacity-90 hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Logo, { size: "sm", linkTo: "/", theme: isDark ? "dark" : "light" }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden sm:block pointer-events-auto", children: /* @__PURE__ */ jsx(Link, { to: "/register", className: "text-[10px] font-black uppercase tracking-widest bg-indigo-600/90 backdrop-blur-md text-white border border-indigo-500 px-4 py-2 rounded-full shadow-lg hover:bg-indigo-500 transition-all", children: "Build Your Profile" }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-6 left-6 right-6 z-[100] sm:hidden pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: `transition-all duration-700 pointer-events-auto ${showNav ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`, children: /* @__PURE__ */ jsxs(Link, { to: "/register", className: "flex items-center justify-center gap-3 w-full bg-slate-900 text-white rounded-2xl py-4 shadow-2xl shadow-indigo-500/20 border border-slate-800 backdrop-blur-sm group active:scale-95 transition-all", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg", children: /* @__PURE__ */ jsx(Award, { className: "w-5 h-5 text-indigo-100" }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-300 leading-none mb-1", children: "Create Your Own" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold leading-none", children: "Build Professional Profile" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("header", { className: "pt-24 pb-12 lg:pb-14 px-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-[2.5rem] border px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-16 shadow-2xl ${isDark ? "bg-gradient-to-br from-[#111827] via-[#0f1422] to-indigo-950/30 border-slate-800 shadow-indigo-900/10" : "bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200 shadow-slate-200/50"}`, children: [
      /* @__PURE__ */ jsx("div", { className: `absolute -top-16 -right-16 w-64 h-64 blur-3xl rounded-full ${isDark ? "bg-indigo-900/20" : "bg-indigo-200/40"}` }),
      /* @__PURE__ */ jsx("div", { className: `absolute -bottom-20 -left-20 w-72 h-72 blur-3xl rounded-full ${isDark ? "bg-blue-900/20" : "bg-sky-200/40"}` }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-4xl mx-auto text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-fit mx-auto mb-6 group", children: [
          /* @__PURE__ */ jsx("div", { className: "w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 rounded-[2.25rem] shadow-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-black rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white/10", children: initials }),
          profile.openToWork && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-[#111827] animate-bounce", children: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5 fill-current border-[#111827]" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] ${textHead}`, children: profile.name }),
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-indigo-500 flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 shadow-sm ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`, children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] md:text-xs font-black uppercase tracking-wider", children: [
            certCount,
            " Verified Credentials"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-y-3 gap-x-4 font-bold mb-8", children: [
          profile.college && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.1)] ${bgBadge}`, children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-indigo-400" }),
            /* @__PURE__ */ jsx("span", { className: `text-xs uppercase tracking-wider ${textBadge}`, children: profile.college })
          ] }),
          profile.branch && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.1)] ${bgBadge}`, children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-4 h-4 text-indigo-400" }),
            /* @__PURE__ */ jsx("span", { className: `text-xs uppercase tracking-wider ${textBadge}`, children: profile.branch })
          ] }),
          profile.year && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.1)] ${bgBadge}`, children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-indigo-400" }),
            /* @__PURE__ */ jsx("span", { className: `text-xs uppercase tracking-wider ${textBadge}`, children: profile.year })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 mb-10", children: [
          profile.linkedin && /* @__PURE__ */ jsxs("a", { href: safeUrl(profile.linkedin), target: "_blank", rel: "noopener noreferrer", className: "h-12 px-7 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all", children: [
            /* @__PURE__ */ jsx(Linkedin, { className: "w-4 h-4" }),
            "LinkedIn"
          ] }),
          profile.resume && /* @__PURE__ */ jsxs("a", { href: safeUrl(profile.resume), target: "_blank", rel: "noopener noreferrer", className: "h-12 px-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
            "Resume"
          ] }),
          profile.phoneNumber && /* @__PURE__ */ jsxs("a", { href: `tel:${profile.phoneNumber}`, className: `h-12 px-7 border rounded-2xl flex items-center gap-2 font-bold text-sm hover:scale-105 active:scale-95 transition-all ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"}`, children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-emerald-500" }),
            "Contact"
          ] }),
          profile.github && /* @__PURE__ */ jsx("a", { href: safeUrl(profile.github), target: "_blank", rel: "noopener noreferrer", className: `w-12 h-12 border rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"}`, children: /* @__PURE__ */ jsx(Github, { className: "w-5 h-5" }) }),
          profile.portfolio && /* @__PURE__ */ jsx("a", { href: safeUrl(profile.portfolio), target: "_blank", rel: "noopener noreferrer", className: `w-12 h-12 border rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"}`, children: /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5" }) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10", children: [
      /* @__PURE__ */ jsxs("aside", { className: "lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-8", children: [
        /* @__PURE__ */ jsxs("section", { className: `border rounded-[2rem] p-6 ${bgCard}`, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-black uppercase tracking-widest text-slate-500 mb-5 pl-1", children: "Professional Summary" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: `text-2xl font-black ${textHead}`, children: certCount }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Verified Credentials" })
              ] })
            ] }),
            allSkills.length > 0 && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 border-t pt-5 ${isDark ? "border-slate-800" : "border-slate-100"}`, children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Code2, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: `text-2xl font-black ${textHead}`, children: allSkills.length }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Demonstrated Skills" })
              ] })
            ] }),
            profile.joinedAt && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 border-t pt-5 ${isDark ? "border-slate-800" : "border-slate-100"}`, children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: `text-lg font-black ${textHead}`, children: new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Member Since" })
              ] })
            ] })
          ] })
        ] }),
        profile.customLinks && profile.customLinks.length > 0 && /* @__PURE__ */ jsxs("section", { className: `border rounded-[2rem] p-6 ${bgCard}`, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1", children: "Featured Links" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: profile.customLinks.map((link, i) => /* @__PURE__ */ jsxs("a", { href: safeUrl(link.url), target: "_blank", rel: "noopener noreferrer", className: `flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800" : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
              /* @__PURE__ */ jsx(Link$1, { className: "w-4 h-4 text-indigo-500 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: `text-sm font-bold truncate ${textHead}`, children: link.title })
            ] }),
            /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5 text-slate-400 flex-shrink-0" })
          ] }, i)) })
        ] }),
        renderRecruiterVerified("hidden lg:block")
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-12", children: [
        profile.bio && /* @__PURE__ */ jsxs("section", { className: `border rounded-[2rem] p-6 md:p-8 ${bgCard}`, children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-xl font-black flex items-center gap-2 mb-4 ${textHead}`, children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-indigo-500" }),
            " About Me"
          ] }),
          /* @__PURE__ */ jsx("p", { className: `text-sm sm:text-base leading-relaxed md:leading-loose font-medium whitespace-pre-line ${isDark ? "text-slate-300" : "text-slate-600"}`, children: profile.bio })
        ] }),
        allSkills.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-xl font-black flex items-center gap-2 mb-6 ${textHead}`, children: [
            /* @__PURE__ */ jsx(Code2, { className: "w-5 h-5 text-emerald-500" }),
            " Demonstrated Capabilities"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 md:gap-3", children: allSkills.map((skill, i) => /* @__PURE__ */ jsx("span", { className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${isDark ? "bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600" : "bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300"}`, children: skill }, i)) })
        ] }),
        profile.projects && profile.projects.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-xl font-black flex items-center gap-2 mb-6 ${textHead}`, children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-5 h-5 text-blue-500" }),
            " Featured Projects"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: profile.projects.map((proj, i) => /* @__PURE__ */ jsxs("div", { className: `border rounded-[1.5rem] p-6 hover:-translate-y-1 transition-all ${bgCard}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `font-black text-lg mb-2 ${textHead}`, children: proj.title }),
            proj.description && /* @__PURE__ */ jsx("p", { className: `text-sm mb-4 line-clamp-3 leading-relaxed ${textMuted}`, children: proj.description }),
            proj.techStack && proj.techStack.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mb-5", children: proj.techStack.map((tech, j) => /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`, children: tech }, j)) }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-auto", children: [
              proj.link && /* @__PURE__ */ jsxs("a", { href: safeUrl(proj.link), target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg", children: [
                /* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5" }),
                " Live Demo"
              ] }),
              proj.github && /* @__PURE__ */ jsxs("a", { href: safeUrl(proj.github), target: "_blank", rel: "noopener noreferrer", className: `flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`, children: [
                /* @__PURE__ */ jsx(Github, { className: "w-3.5 h-3.5" }),
                " Source"
              ] })
            ] })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-xl font-black flex items-center gap-2 mb-6 ${textHead}`, children: [
            /* @__PURE__ */ jsx(Award, { className: "w-5 h-5 text-indigo-500" }),
            " Verified Credentials"
          ] }),
          certCount > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: (profile.certificates || []).map((cert, i) => {
            var _a2;
            return /* @__PURE__ */ jsxs("div", { className: `group min-h-[200px] border-2 rounded-3xl p-6 transition-all flex flex-col justify-between ${isDark ? "bg-slate-800/30 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-emerald-900/20" : "bg-white border-slate-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "w-full mb-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`, children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" }) }),
                  /* @__PURE__ */ jsx("span", { className: `text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`, children: "Verified" })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: `font-extrabold leading-tight mb-2 group-hover:text-indigo-500 transition-colors ${textHead}`, children: ((_a2 = cert.course) == null ? void 0 : _a2.title) || "Certification" }),
                /* @__PURE__ */ jsxs("p", { className: `text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 ${textMuted}`, children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                  cert.issueDate ? new Date(cert.issueDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Lifetime Validity"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `rounded-xl px-3 py-2.5 border ${isDark ? "bg-slate-900/50 border-slate-700/50" : "bg-slate-50 border-slate-100"}`, children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-[9px] font-black text-slate-500 uppercase mb-1 flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { children: "Credential ID" }),
                    /* @__PURE__ */ jsx(Award, { className: "w-3 h-3" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: `text-[11px] font-mono font-bold truncate ${isDark ? "text-slate-300" : "text-slate-700"}`, children: cert.certificateId })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/verify/${cert.certificateId}`,
                  className: `inline-flex items-center gap-1.5 text-xs font-black group/btn pt-2 border-t mt-auto ${isDark ? "border-slate-700/50 text-indigo-400" : "border-slate-100 text-indigo-600"}`,
                  children: [
                    "View Digital Certificate",
                    /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" })
                  ]
                }
              )
            ] }, i);
          }) }) : /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: `border-2 border-dashed rounded-[2.5rem] p-12 text-center relative ${isDark ? "bg-slate-800/20 border-slate-700/50" : "bg-white/40 border-slate-200 backdrop-blur-sm"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6 ${isDark ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-indigo-50 text-indigo-400 border border-indigo-100"}`, children: /* @__PURE__ */ jsx(Sparkles, { className: "w-10 h-10" }) }),
            /* @__PURE__ */ jsx("h3", { className: `text-xl font-black mb-2 ${textHead}`, children: "Learning Journey in Progress" }),
            /* @__PURE__ */ jsx("p", { className: `text-sm max-w-sm mx-auto leading-relaxed font-medium ${textMuted}`, children: "This portfolio is under active development. The scholar is completing their training and will showcase their verified credentials soon." })
          ] }) })
        ] }),
        renderRecruiterVerified("block lg:hidden")
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: `px-6 py-10 border-t ${isDark ? "border-slate-800/80 bg-[#0b0f19]" : "border-slate-200 bg-white"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 text-center md:text-left", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 grayscale hover:grayscale-0 transition-opacity opacity-60 hover:opacity-100", children: [
        /* @__PURE__ */ jsx("div", { className: `w-6 h-6 rounded-md flex items-center justify-center ${isDark ? "bg-white" : "bg-slate-900"}`, children: /* @__PURE__ */ jsx(Award, { className: `w-3.5 h-3.5 ${isDark ? "text-slate-900" : "text-white"}` }) }),
        /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`, children: "Verified by SkillValix" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-[10px] font-bold uppercase tracking-widest", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " SkillValix Portfolio Cloud."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy-policy", className: "text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors", children: "Terms" })
      ] })
    ] }) })
  ] });
}
export {
  PublicProfile as default
};
