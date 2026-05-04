import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { g as getCourseList, c as getCourseBySlug } from "../main.mjs";
import { g as getCourseCategory } from "./course-CnlTDUsW.js";
import { Loader2, BookOpen, ListTodo, Clock, ShieldCheck, PlayCircle, Sparkles, Award, Zap, ArrowRight } from "lucide-react";
import "react-dom/client";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const THEMES = {
  blue: "from-blue-600 to-indigo-700",
  green: "from-emerald-600 to-teal-700",
  pink: "from-rose-600 to-pink-700",
  orange: "from-amber-600 to-orange-600"
};
const CourseDetail = () => {
  const { slug } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [recommended, setRecommended] = useState([]);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseBySlug(slug);
        if (!data) throw new Error("Not found");
        setCourseData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    const savedProgress = JSON.parse(localStorage.getItem("skillvalix_progress")) || {};
    if (savedProgress[slug]) {
      setCompletedLessons(savedProgress[slug]);
    }
    getCourseList().then((all) => {
      if (!all) return;
      const others = all.filter((c) => c.slug !== slug && !c.isJobSimulation);
      const shuffled = [...others].sort(() => 0.5 - Math.random());
      setRecommended(shuffled.slice(0, 3));
    }).catch(console.error);
  }, [slug]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-[calc(100vh-140px)]", children: /* @__PURE__ */ jsx(Loader2, { className: "w-10 h-10 text-blue-600 animate-spin" }) });
  }
  if (error || !courseData) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-32", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "Course not found" }),
      /* @__PURE__ */ jsx(Link, { to: "/courses", className: "text-blue-600 hover:text-blue-500 mt-4 inline-block font-medium", children: "Return to Courses" })
    ] });
  }
  const { course, lessons } = courseData;
  const themeClass = THEMES[course.theme] || THEMES.blue;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        course.title,
        " | SkillValix"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: course.description.substring(0, 155) }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `https://www.skillvalix.com/courses/${slug}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `bg-gradient-to-br ${themeClass} rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden`, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-white", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-64 h-64" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-block px-3 py-1 mb-6 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold tracking-wide backdrop-blur-sm", children: "Course Module" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight", children: course.title }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-blue-100 mb-8 max-w-2xl", children: course.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm font-medium", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(ListTodo, { className: "w-4 h-4 text-blue-200" }),
            " ",
            lessons.length,
            " Modules"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-orange-200" }),
            " ~2 Hours"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-300" }),
            " Certificate Included"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 mt-8 bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-semibold", children: "Your Progress" }),
          /* @__PURE__ */ jsxs("span", { className: "text-blue-200 text-sm font-bold", children: [
            Math.round(completedLessons.length / (lessons.length || 1) * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-black/40 rounded-full h-2.5 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 h-2.5 rounded-full transition-all duration-500", style: { width: `${Math.round(completedLessons.length / (lessons.length || 1) * 100)}%` } }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-white/70 text-xs mt-2 font-medium", children: [
          completedLessons.length,
          " of ",
          lessons.length,
          " lessons completed"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: [
        "Curriculum ",
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-normal text-slate-500", children: [
          "(",
          lessons.length,
          " Modules)"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: lessons.map((lesson, idx) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/courses/${slug}/lesson/${lesson._id}`,
          className: "group flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors mr-6 font-medium", children: idx + 1 }),
            /* @__PURE__ */ jsx("div", { className: "flex-grow", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors", children: lesson.title }) }),
            /* @__PURE__ */ jsx(PlayCircle, { className: "w-6 h-6 text-slate-400 group-hover:text-blue-500" })
          ]
        },
        lesson._id
      )) }),
      /* @__PURE__ */ jsx("style", { children: `
          @keyframes goldShimmer {
            0%   { background-position: 200% center }
            100% { background-position: -200% center }
          }
          @keyframes goldBorderSweep {
            0%,100% { opacity: 0.5 }
            50%      { opacity: 1 }
          }
          @keyframes goldFloat {
            0%,100% { transform: translateY(0px) rotate(0deg) }
            50%     { transform: translateY(-5px) rotate(10deg) }
          }
          @keyframes goldBtnShine {
            0%   { background-position: -200% center }
            100% { background-position: 200% center }
          }
          @keyframes softPing {
            0%       { transform:scale(1); opacity:.6 }
            75%,100% { transform:scale(2); opacity:0 }
          }
          .exam-gold-txt {
            background: linear-gradient(90deg, #b45309, #d97706, #f59e0b, #fbbf24, #d97706, #b45309);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: goldShimmer 4s linear infinite;
          }
          .exam-gold-btn {
            background: linear-gradient(100deg, #f59e0b 0%, #fbbf24 30%, #fff8e7 50%, #fbbf24 70%, #f59e0b 100%);
            background-size: 220% auto;
            animation: goldBtnShine 3s linear infinite;
            transition: transform .2s ease, box-shadow .2s ease;
          }
          .exam-gold-btn:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 8px 28px rgba(245,158,11,0.40);
          }
        ` }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            marginTop: 40,
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            background: "#fffdf5",
            border: "1.5px solid #fde68a",
            boxShadow: "0 4px 32px rgba(245,158,11,0.10), 0 1px 6px rgba(0,0,0,0.05)",
            padding: "36px 32px"
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 110%, rgba(253,230,138,0.35) 0%, transparent 70%)", pointerEvents: "none" } }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" } }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 18, right: 22, animation: "goldFloat 4s ease-in-out infinite", pointerEvents: "none" }, children: /* @__PURE__ */ jsx(Sparkles, { style: { color: "#fbbf24", width: 20, height: 20, opacity: 0.7 } }) }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 18, right: 64, animation: "goldFloat 6s ease-in-out infinite 1.5s", pointerEvents: "none" }, children: /* @__PURE__ */ jsx(Award, { style: { color: "#d97706", width: 17, height: 17, opacity: 0.5 } }) }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 10 }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 100, padding: "5px 14px", marginBottom: 18 }, children: [
                /* @__PURE__ */ jsxs("span", { style: { position: "relative", display: "flex", width: 7, height: 7 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { position: "absolute", inset: 0, borderRadius: "50%", background: "#f59e0b", animation: "softPing 2.4s ease-out infinite" } }),
                  /* @__PURE__ */ jsx("span", { style: { position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "block" } })
                ] }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 800, color: "#92400e", letterSpacing: "0.07em", textTransform: "uppercase" }, children: "Certification Exam" })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }, children: [
                /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 220 }, children: [
                  /* @__PURE__ */ jsxs("h3", { style: { fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 900, color: "#1e293b", lineHeight: 1.15, marginBottom: 10 }, children: [
                    "Ready to get",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "exam-gold-txt", children: "certified?" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.75, maxWidth: 440, marginBottom: 18 }, children: "All lessons are free to learn at your own pace. If you already know the skill, you can also take the exam directly and get certified quickly." }),
                  /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px 18px" }, children: [
                    { icon: BookOpen, text: "Lessons free to learn", color: "#2563eb" },
                    { icon: Zap, text: "Direct exam allowed", color: "#d97706" },
                    { icon: ShieldCheck, text: "Tamper-proof certificate", color: "#059669" },
                    { icon: Award, text: "Unique verification ID", color: "#7c3aed" },
                    { icon: Award, text: "Instant PDF certificate", color: "#059669" }
                  ].map(({ icon: Icon, text, color }) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 500, color: "#64748b" }, children: [
                    /* @__PURE__ */ jsx(Icon, { style: { width: 14, height: 14, color, flexShrink: 0 } }),
                    text
                  ] }, text)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      to: `/courses/${slug}/quiz`,
                      id: "take-exam-cta",
                      className: "exam-gold-btn",
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        color: "#78350f",
                        fontWeight: 800,
                        fontSize: 15,
                        padding: "15px 32px",
                        borderRadius: 14,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
                      },
                      children: [
                        /* @__PURE__ */ jsx(Award, { style: { width: 18, height: 18 } }),
                        "Take Exam →"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "#94a3b8", fontWeight: 500 }, children: "No time limit · click to attempt" })
                ] })
              ] })
            ] })
          ]
        }
      ),
      recommended.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-12 border-t-2 border-dashed border-slate-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100", children: /* @__PURE__ */ jsx(Sparkles, { size: 22 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900 leading-tight", children: "You can also try these related courses" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Picked at random just for you" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: recommended.map((rec) => {
          const recCat = getCourseCategory(rec);
          const themeColor = rec.theme === "pink" ? "#ec4899" : rec.theme === "green" ? "#22c55e" : rec.theme === "orange" ? "#f97316" : "#6366f1";
          const themeBg = rec.theme === "pink" ? "#fdf2f8" : rec.theme === "green" ? "#f0fdf4" : rec.theme === "orange" ? "#fff7ed" : "#eef2ff";
          return /* @__PURE__ */ jsxs(Link, { to: `/courses/${rec.slug}`, className: "group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-xl hover:border-blue-300 flex flex-col gap-4 overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-16 h-16" }) }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white/50", style: { backgroundColor: themeBg, color: themeColor }, children: /* @__PURE__ */ jsx(BookOpen, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block", children: recCat }),
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2", children: rec.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-2 text-xs font-black text-blue-600", children: [
              "EXPLORE COURSE ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 14, className: "transition-transform group-hover:translate-x-1" })
            ] })
          ] }, rec.slug);
        }) })
      ] })
    ] })
  ] });
};
export {
  CourseDetail as default
};
