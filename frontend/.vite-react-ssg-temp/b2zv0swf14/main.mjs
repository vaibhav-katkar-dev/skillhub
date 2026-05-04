import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useMemo, lazy, Suspense, StrictMode } from "react";
import { createRoot as createRoot$1 } from "react-dom/client";
import { Link, useLocation, NavLink, useNavigate, BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { create } from "zustand";
import axios from "axios";
import { X, Menu, ChevronRight, Linkedin, Instagram, Mail, MessageCircle, GraduationCap, BookMarked, Building2, Shield, Rocket, ArrowRight, Users, BookOpen, Briefcase, Trophy, Target, TrendingUp, Zap, ShieldCheck, CheckCircle2, Award, Star, Layers, Play, BrainCircuit, Clock, Code2, ChevronDown, LogIn, EyeOff, Eye, UserPlus } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ViteReactSSG } from "vite-react-ssg";
const api = axios.create({
  baseURL: "https://api.skillvalix.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const CACHE = {};
const CACHE_TTL = 5 * 60 * 1e3;
const getCached = (key) => {
  const item = CACHE[key];
  if (!item) return null;
  if (Date.now() - item.ts > CACHE_TTL) {
    delete CACHE[key];
    return null;
  }
  return item.data;
};
const setCache = (key, data) => {
  CACHE[key] = { data, ts: Date.now() };
};
const clearCache = (key) => {
  if (key) delete CACHE[key];
  else Object.keys(CACHE).forEach((k) => delete CACHE[k]);
};
const cachedGet = async (key, url) => {
  const cached = getCached(key);
  if (cached) return cached;
  const res = await api.get(url);
  setCache(key, res.data);
  return res.data;
};
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  // On app boot — load from cache first, then validate token
  loadUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    if (get().user) {
      set({ loading: false });
      return;
    }
    try {
      const cached = sessionStorage.getItem("skillvalix_user");
      if (cached) {
        const parsed = JSON.parse(cached);
        set({ user: parsed, isAuthenticated: true, loading: false });
        return;
      }
    } catch (_) {
    }
    try {
      const res = await api.get("/auth/me");
      sessionStorage.setItem("skillvalix_user", JSON.stringify(res.data));
      set({ user: res.data, isAuthenticated: true, loading: false });
    } catch (err) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("skillvalix_user");
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    const userRes = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    sessionStorage.setItem("skillvalix_user", JSON.stringify(userRes.data));
    clearCache();
    set({ user: userRes.data, isAuthenticated: true });
  },
  register: async (name, email, password, role) => {
    const res = await api.post("/auth/register", { name, email, password, role });
    return res.data;
  },
  verifyEmail: async (token) => {
    const res = await api.get(`/auth/verify-email/${token}`);
    return res.data;
  },
  resendVerification: async (email) => {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("skillvalix_user");
    clearCache();
    set({ user: null, isAuthenticated: false });
  },
  googleLogin: async (credential) => {
    const res = await api.post("/auth/google", { credential });
    localStorage.setItem("token", res.data.token);
    const userRes = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    sessionStorage.setItem("skillvalix_user", JSON.stringify(userRes.data));
    clearCache();
    set({ user: userRes.data, isAuthenticated: true, loading: false });
  }
}));
const REPLACEMENTS = [
  ["Â·", "·"],
  ["â€”", "-"],
  ["â€“", "-"],
  ['â€"', "-"],
  ["â€˜", "'"],
  ["â€™", "'"],
  ["â€œ", '"'],
  ["â€", '"'],
  ["â€¦", "..."],
  ["â€¢", "•"],
  ["âœ¦", "•"],
  ["âœ…", ""],
  ["â†’", "->"],
  ["Ã—", "x"],
  ["âƒ£", ""],
  ["DALLÂ·E", "DALL·E"],
  ["â€", '"']
];
function normalizeDisplayText(value) {
  if (typeof value !== "string") return value;
  let normalized = value;
  for (const [from, to] of REPLACEMENTS) {
    normalized = normalized.split(from).join(to);
  }
  return normalized.replace(/\uFEFF/g, "").replace(/�/g, "").trim();
}
function normalizeHtmlContent(html) {
  return normalizeDisplayText(html);
}
function normalizeDeepStrings(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeDeepStrings);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeDeepStrings(entryValue)])
    );
  }
  return normalizeDisplayText(value);
}
let _promise = null;
let _data = null;
async function _load() {
  if (_data) return _data;
  if (_promise) return _promise;
  _promise = fetch("/data/all-courses.json").then((res) => {
    if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
    return res.json();
  }).then((parsed) => {
    const normalized = normalizeDeepStrings(parsed);
    _data = normalized;
    return normalized;
  });
  return _promise;
}
async function getCourseList() {
  const all = await _load();
  return all.map((entry) => entry.course);
}
async function getCourseBySlug(slug) {
  const all = await _load();
  return all.find((entry) => entry.course.slug === slug) || null;
}
function preloadCourses() {
  _load().catch(() => {
  });
}
function Logo({
  size = "md",
  tagline = false,
  linkTo = "/",
  className = "",
  theme = "light"
}) {
  const sizes = {
    sm: { img: 32, text: "text-xl", tag: "invisible hidden" },
    md: { img: 42, text: "text-3xl", tag: "text-[10px]" },
    lg: { img: 48, text: "text-4xl", tag: "text-xs" }
  };
  const s = sizes[size] || sizes.md;
  const content = /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-0 ${className}`, children: [
    /* @__PURE__ */ jsx("img", { src: "/logo.svg", alt: "SkillValix Logo", width: s.img, height: s.img, className: "object-contain drop-shadow-md z-10 relative" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center -ml-2 relative z-0", children: [
      /* @__PURE__ */ jsxs("span", { className: `font-black tracking-tight leading-none ${theme === "dark" ? "text-white" : "text-slate-900"} ${s.text} font-sans`, children: [
        "kill",
        /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "Valix" })
      ] }),
      tagline && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("span", { className: `font-bold tracking-[0.2em] text-slate-500 uppercase ${s.tag} font-sans` }) })
    ] })
  ] });
  if (!linkTo) return content;
  return /* @__PURE__ */ jsx(Link, { to: linkTo, "aria-label": "SkillValix home", className: "inline-flex no-underline", children: content });
}
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/blog", label: "Blog" },
  { to: "/verify", label: "Verify Certificate" }
];
const HIDE_ON_SCROLL_PATHS = ["/", "/courses", "/blog"];
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const hideOnScroll = HIDE_ON_SCROLL_PATHS.includes(location.pathname);
  useEffect(() => {
    setIsMenuOpen(false);
    setVisible(true);
    setAtTop(true);
    lastScrollY.current = 0;
  }, [location.pathname]);
  useEffect(() => {
    if (!hideOnScroll) {
      setVisible(true);
      return;
    }
    const handleScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 10);
      if (y < 10) {
        setVisible(true);
      } else if (y > lastScrollY.current && y > 80) {
        setVisible(false);
        setIsMenuOpen(false);
      } else if (y < lastScrollY.current) {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideOnScroll]);
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      className: `
        bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-full"}
        ${atTop ? "shadow-none" : "shadow-md"}
      `,
      children: [
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
          /* @__PURE__ */ jsx(Logo, { size: "md", linkTo: "/" }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-1 flex-1 justify-center", children: navLinks.map(({ to, label }) => /* @__PURE__ */ jsx(
            NavLink,
            {
              to,
              end: to === "/",
              className: ({ isActive }) => `px-4 py-2 rounded-lg text-sm whitespace-nowrap ${isActive ? "text-blue-600 font-semibold bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 font-medium transition-colors"}`,
              children: label
            },
            to
          )) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-2 shrink-0", children: isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
            (user == null ? void 0 : user.role) === "admin" && /* @__PURE__ */ jsx(
              NavLink,
              {
                to: "/admin",
                className: ({ isActive }) => `px-4 py-2 rounded-lg text-sm whitespace-nowrap ${isActive ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-600 hover:text-indigo-600 font-medium transition-colors"}`,
                children: "Admin Panel"
              }
            ),
            /* @__PURE__ */ jsx(
              NavLink,
              {
                to: "/dashboard",
                className: ({ isActive }) => `px-4 py-2 rounded-lg text-sm whitespace-nowrap ${isActive ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600 font-medium transition-colors"}`,
                children: "Dashboard"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: logout,
                className: "px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap",
                children: "Logout"
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/login",
                className: "px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap",
                children: "Login"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/register",
                className: "px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap",
                children: "Get Started"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors",
              onClick: () => setIsMenuOpen(!isMenuOpen),
              "aria-label": "Toggle menu",
              children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
            }
          )
        ] }) }),
        isMenuOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg", children: [
          navLinks.map(({ to, label }) => /* @__PURE__ */ jsxs(
            NavLink,
            {
              to,
              end: to === "/",
              onClick: () => setIsMenuOpen(false),
              className: ({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-xl text-sm ${isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"}`,
              children: [
                label,
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 opacity-40" })
              ]
            },
            to
          )),
          /* @__PURE__ */ jsx("div", { className: "pt-3 border-t border-slate-100 space-y-2", children: isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
            (user == null ? void 0 : user.role) === "admin" && /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/admin",
                onClick: () => setIsMenuOpen(false),
                className: "flex items-center justify-between px-4 py-3 rounded-xl text-sm text-indigo-600 hover:bg-indigo-50 font-bold",
                children: [
                  "Admin Panel ",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 opacity-40" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/dashboard",
                onClick: () => setIsMenuOpen(false),
                className: "flex items-center justify-between px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 font-medium",
                children: [
                  "Dashboard ",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 opacity-40" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  logout();
                  setIsMenuOpen(false);
                },
                className: "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors",
                children: "Logout"
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/login",
                onClick: () => setIsMenuOpen(false),
                className: "block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 text-center border border-slate-200 transition-colors",
                children: "Login"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/register",
                onClick: () => setIsMenuOpen(false),
                className: "block px-4 py-3 rounded-xl text-sm font-bold text-white text-center bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 transition-all active:scale-95",
                children: "Get Started Free"
              }
            )
          ] }) })
        ] })
      ]
    }
  );
};
const WHATSAPP_GROUP_LINK$1 = "https://chat.whatsapp.com/HxtxKbZCw39BNGzy7hXVSt?mode=gi_t";
const NAV_COLUMNS = [
  {
    heading: "Learn",
    icon: GraduationCap,
    links: [
      { to: "/free-courses", label: "Free Courses" },
      { to: "/courses/ultimate-html-masterclass", label: "HTML Masterclass" },
      { to: "/courses/css-for-beginners-learn-web-styling-zero-to-pro", label: "CSS Fundamentals" },
      { to: "/courses/ultimate-javascript-masterclass", label: "JavaScript Basics" }
    ]
  },
  {
    heading: "Resources",
    icon: BookMarked,
    links: [
      { to: "/certification", label: "Certification" },
      { to: "/verify", label: "Verify Certificate" },
      { to: "/hackathons", label: "Student Hackathons" },
      { to: "/blog/how-to-build-powerful-public-portfolio-2026", label: "🚀 Public Portfolio Guide", highlight: true },
      { to: "/blog", label: "Blog" }
    ]
  },
  {
    heading: "Company",
    icon: Building2,
    links: [
      { to: "/campus-ambassador", label: "🎓 Campus Ambassador", highlight: true },
      { to: "/host", label: "Host a Hackathon" },
      { to: "/dashboard", label: "Student Dashboard" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" }
    ]
  }
];
const STATS$1 = [
  { value: "12+", label: "Modules" },
  { value: "25", label: "Quizzes" },
  { value: "100%", label: "Free" },
  { value: "∞", label: "Skills" }
];
const SOCIAL = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/skillvalix/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/skillvalix/", label: "Instagram" },
  { icon: Mail, href: "mailto:skillvalix@gmail.com", label: "Email" }
];
const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/cookie-policy", label: "Cookie Policy" }
];
const Footer = () => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsxs(
    "footer",
    {
      className: "bg-slate-950 text-slate-400 border-t border-slate-800",
      "aria-label": "Site footer",
      children: [
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-6", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Logo, { size: "lg", tagline: true, linkTo: "/", theme: "dark" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-slate-400 max-w-sm", children: "The premier platform for mastering web technology. Beginner-friendly lessons, rigorous certifications, and verifiable credentials — all in one place." }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: SOCIAL.map(({ icon: Icon, href, label }) => /* @__PURE__ */ jsx(
              "a",
              {
                href,
                "aria-label": label,
                className: "w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200",
                children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
              },
              label
            )) }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: WHATSAPP_GROUP_LINK$1,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 rounded-xl border border-emerald-700/60 bg-emerald-900/30 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-800/40 hover:border-emerald-600 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4" }),
                  "Join WhatsApp Group"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-700/60 bg-slate-900/60 p-5 space-y-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-300 uppercase tracking-widest", children: "Stay Updated" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Get course updates and career tips." }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    placeholder: "your@email.com",
                    "aria-label": "Email address",
                    className: "flex-1 min-w-0 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "shrink-0 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200",
                    children: "Subscribe"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "nav",
            {
              className: "lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10",
              "aria-label": "Footer navigation",
              children: NAV_COLUMNS.map(({ heading, icon: Icon, links }) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-5", children: [
                  /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5 text-blue-400", "aria-hidden": "true" }),
                  heading
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-3", role: "list", children: links.map(({ to, label, highlight }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to,
                    className: `group inline-flex items-center gap-1.5 text-sm transition-colors duration-150 ${highlight ? "text-amber-400 hover:text-amber-300 font-semibold" : "text-slate-400 hover:text-blue-400"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        ChevronRight,
                        {
                          className: "w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-blue-500",
                          "aria-hidden": "true"
                        }
                      ),
                      label
                    ]
                  }
                ) }, label)) })
              ] }, heading))
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-slate-800", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: /* @__PURE__ */ jsx("dl", { className: "grid grid-cols-2 sm:grid-cols-4 gap-6 text-center", children: STATS$1.map(({ value, label }) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-2xl font-black text-white", children: value }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1 text-[11px] text-slate-500 uppercase tracking-wider", children: label })
        ] }, label)) }) }) }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-slate-800/60", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 order-2 sm:order-1", children: [
            "© ",
            year,
            " SkillValix Learning Platform. All rights reserved."
          ] }),
          /* @__PURE__ */ jsxs(
            "nav",
            {
              className: "flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center",
              "aria-label": "Legal",
              children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3 text-slate-600 mr-1", "aria-hidden": "true" }),
                LEGAL_LINKS.map(({ to, label }, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to,
                      className: "text-xs text-slate-500 hover:text-blue-400 transition-colors duration-150",
                      children: label
                    }
                  ),
                  i < LEGAL_LINKS.length - 1 && /* @__PURE__ */ jsx("span", { className: "text-slate-700 select-none", children: "·" })
                ] }, label))
              ]
            }
          )
        ] }) })
      ]
    }
  );
};
const PreFooterCTA = () => {
  var _a;
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const hiddenPaths = ["/login", "/register", "/admin", "/admin/upload", "/dashboard"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border-t border-slate-200 py-16 sm:py-24 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 sm:mb-8", children: isAuthenticated ? /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" }) : /* @__PURE__ */ jsx(Rocket, { className: "w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" }) }),
      isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight", children: [
          "Ready to continue your ",
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500", children: "learning journey" }),
          "?"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium", children: [
          "Welcome back, ",
          ((_a = user == null ? void 0 : user.name) == null ? void 0 : _a.split(" ")[0]) || "Student",
          "! Jump right back into your courses or explore new skills to master today."
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight", children: [
          "Ready to kickstart your ",
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500", children: "development career" }),
          "?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium", children: "Join thousands of students who are already learning highly sought-after skills for free on SkillValix. No credit card required, ever." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4", children: [
        isAuthenticated ? /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/dashboard",
            className: "w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2",
            children: [
              "Go to Dashboard ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/register",
            className: "w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2",
            children: [
              "Create Free Account ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/courses",
            className: "w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 transition-all duration-300 text-center",
            children: "Explore Courses"
          }
        )
      ] })
    ] })
  ] });
};
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/HxtxKbZCw39BNGzy7hXVSt?mode=gi_t";
const POPUP_SEEN_KEY = "skillvalix_whatsapp_popup_seen";
const POPUP_DELAY_MS = 6e3;
const WhatsAppJoinPopup = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(POPUP_SEEN_KEY) === "1";
    if (hasSeenPopup) return;
    const timer = window.setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);
  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem(POPUP_SEEN_KEY, "1");
      setOpen(false);
      setClosing(false);
    }, 250);
  };
  if (!open) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes wa-slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes wa-fade-out {
          from { opacity: 1; transform: translateY(0)   scale(1); }
          to   { opacity: 0; transform: translateY(20px) scale(0.97); }
        }
        @keyframes wa-pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.6; transform:scale(1.5); }
        }
        .wa-popup-card {
          animation: ${closing ? "wa-fade-out .25s ease forwards" : "wa-slide-up .35s cubic-bezier(.34,1.56,.64,1) forwards"};
        }
        .wa-pulse { animation: wa-pulse-dot 1.4s ease-in-out infinite; }
      ` }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4",
        style: { background: "rgba(2,6,23,0.65)", backdropFilter: "blur(4px)" },
        onClick: closePopup,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "wa-popup-card w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl",
            style: { background: "#fff", border: "1px solid rgba(16,185,129,0.2)" },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { style: {
                background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
                padding: "18px 20px 14px",
                position: "relative"
              }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }, children: [
                  /* @__PURE__ */ jsx("span", { className: "wa-pulse", style: {
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "inline-block",
                    boxShadow: "0 0 0 3px rgba(255,255,255,0.3)"
                  } }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.06em", textTransform: "uppercase" }, children: "4,200+ Members Active" })
                ] }),
                /* @__PURE__ */ jsxs("h2", { style: { margin: 0, fontSize: 19, fontWeight: 900, color: "#fff", lineHeight: 1.25 }, children: [
                  "Level Up Your Career",
                  /* @__PURE__ */ jsx("br", {}),
                  "With Industry Skills"
                ] }),
                /* @__PURE__ */ jsx("p", { style: { margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }, children: "Free community. Zero spam. Career-focused content." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: closePopup,
                    "aria-label": "Close",
                    style: {
                      position: "absolute",
                      top: 14,
                      right: 14,
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff"
                    },
                    children: /* @__PURE__ */ jsx(X, { size: 15 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { padding: "16px 20px" }, children: [
                /* @__PURE__ */ jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 10,
                  padding: "8px 12px",
                  marginBottom: 14
                }, children: [
                  /* @__PURE__ */ jsx(Users, { size: 14, style: { color: "#059669", flexShrink: 0 } }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "#065f46", fontWeight: 600 }, children: "Students from 200+ colleges have already joined" })
                ] }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
                  { Icon: BookOpen, bold: "Free Courses & Certificates", sub: "HTML, CSS, JS, Python, React, AI" },
                  { Icon: Briefcase, bold: "Job Simulations", sub: "Platform projects for your resume" },
                  { Icon: Trophy, bold: "Hackathon Alerts", sub: "Win prizes and get noticed by recruiters" },
                  { Icon: Target, bold: "Career Growth Tips", sub: "Resume structuring, LinkedIn updates, and interview prep" },
                  { Icon: Users, bold: "Referrals & Opportunities", sub: "Internships and jobs shared by the community" }
                ].map(({ Icon, bold, sub }) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 12 }, children: [
                  /* @__PURE__ */ jsx("div", { style: { padding: 6, background: "#f1f5f9", borderRadius: 8, color: "#059669", flexShrink: 0, marginTop: 1 }, children: /* @__PURE__ */ jsx(Icon, { size: 16 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }, children: bold }),
                    /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: "#64748b", marginTop: 2 }, children: sub })
                  ] })
                ] }, bold)) }),
                /* @__PURE__ */ jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  margin: "16px 0 0",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 8,
                  padding: "7px 11px"
                }, children: [
                  /* @__PURE__ */ jsx(TrendingUp, { size: 13, style: { color: "#d97706", flexShrink: 0 } }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 11.5, color: "#92400e", fontWeight: 600 }, children: "47 people joined today! The community is growing fast." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { padding: "0 20px 18px", display: "flex", flexDirection: "column", gap: 8 }, children: [
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: WHATSAPP_GROUP_LINK,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    onClick: closePopup,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "linear-gradient(135deg, #25d366, #128c7e)",
                      color: "#fff",
                      textDecoration: "none",
                      padding: "13px 20px",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 800,
                      boxShadow: "0 4px 18px rgba(37,211,102,0.35)",
                      transition: "transform .15s, box-shadow .15s"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 22px rgba(37,211,102,0.45)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 4px 18px rgba(37,211,102,0.35)";
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: "https://cdn.cdnlogo.com/logos/w/10/whatsapp.svg",
                          alt: "WhatsApp",
                          style: { width: 20, height: 20, flexShrink: 0 },
                          onError: (e) => {
                            e.currentTarget.style.display = "none";
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(Zap, { size: 15 }),
                      "Join WhatsApp Group For Free"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: closePopup,
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#94a3b8",
                      fontWeight: 500,
                      padding: "4px 0",
                      textAlign: "center"
                    },
                    children: "No thanks, I will figure it out alone"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
};
const STATS = [
  { value: 2800, suffix: "+", label: "Students", icon: Users, color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  { value: 150, suffix: "+", label: "Modules", icon: Layers, color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  { value: 98, suffix: "%", label: "Completion", icon: Trophy, color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { value: 100, suffix: "%", label: "Free Access", icon: Zap, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" }
];
const HOW_IT_WORKS = [
  { step: 1, label: "01", title: "Pick a Course", desc: "Browse our growing library of structured web development courses - all completely free.", icon: BookOpen, accent: "#6366f1", light: "#eef2ff" },
  { step: 2, label: "02", title: "Study the Lessons", desc: "Work through interactive, code-rich modules at your own pace. No deadlines, no pressure.", icon: Play, accent: "#8b5cf6", light: "#f5f3ff" },
  { step: 3, label: "03", title: "Take the Exam", desc: "When you're ready, sit the assessment. Questions are server-graded to keep results secure.", icon: BrainCircuit, accent: "#a855f7", light: "#faf5ff" },
  { step: 4, label: "04", title: "Earn Your Certificate", desc: "Pass and instantly download your verifiable PDF certificate to share with the world.", icon: Award, accent: "#10b981", light: "#ecfdf5" }
];
const COURSES = [
  {
    slug: "ultimate-html-masterclass",
    title: "HTML for Beginners",
    level: "Beginner",
    duration: "4 hrs",
    modules: 12,
    rating: 4.9,
    badge: "Most Popular",
    badgeColor: "#6366f1",
    tags: ["HTML5", "Semantics", "Forms", "SEO"],
    desc: "A complete deep-dive into modern HTML - from document structure to semantic tags, accessibility and forms.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=500",
    accent: "#6366f1",
    accentLight: "#eef2ff",
    accentBorder: "#c7d2fe"
  },
  {
    slug: "css-for-beginners-learn-web-styling-zero-to-pro",
    title: "CSS for Beginners",
    level: "Beginner",
    duration: "5 hrs",
    modules: 10,
    rating: 4.8,
    badge: "Trending",
    badgeColor: "#0ea5e9",
    tags: ["CSS3", "Flexbox", "Grid", "Animations"],
    desc: "Master styling from the ground up - cascade, specificity, Flexbox, Grid, and CSS animations.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800&h=500",
    accent: "#0ea5e9",
    accentLight: "#f0f9ff",
    accentBorder: "#bae6fd"
  },
  {
    slug: "ultimate-javascript-masterclass",
    title: "JavaScript for Beginners",
    level: "Beginner",
    duration: "6 hrs",
    modules: 14,
    rating: 4.9,
    badge: "New",
    badgeColor: "#f59e0b",
    tags: ["ES6+", "DOM", "Events", "APIs"],
    desc: "Learn the language of the web - variables, functions, DOM manipulation, and async JavaScript.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800&h=500",
    accent: "#f59e0b",
    accentLight: "#fffbeb",
    accentBorder: "#fde68a"
  }
];
const FEATURES = [
  { icon: BookOpen, bg: "#eff6ff", color: "#3b82f6", title: "Structured Learning Paths", desc: "Content built in clear progression - from fundamentals to advanced mastery." },
  { icon: BrainCircuit, bg: "#f5f3ff", color: "#7c3aed", title: "Interactive Exams", desc: "Server-graded assessments with instant feedback to solidify your understanding." },
  { icon: Award, bg: "#ecfdf5", color: "#059669", title: "Verifiable Certificates", desc: "Pass the exam, earn a secure PDF certificate with a unique trackable ID." },
  { icon: Code2, bg: "#fff1f2", color: "#e11d48", title: "Real-World Code Snippets", desc: "Annotated, live code examples you can copy, adapt, and run immediately." },
  { icon: ShieldCheck, bg: "#fffbeb", color: "#d97706", title: "Secure & Private", desc: "Your progress and certificates are stored securely. We never sell your data." },
  { icon: GraduationCap, bg: "#f0f9ff", color: "#0284c7", title: "Beginner Friendly", desc: "Zero prerequisites. Every concept explained from scratch with zero jargon." }
];
const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Frontend Developer", initials: "PS", grad: "from-indigo-500 to-violet-600", body: "SkillValix's HTML course is the clearest resource I've found online. Finished it in a weekend and the certificate added real credibility to my portfolio." },
  { name: "James Okonkwo", role: "CS Student", initials: "JO", grad: "from-sky-500 to-blue-600", body: "The exams genuinely test your knowledge, not just memorization. I felt confident in interviews knowing I really understood the material." },
  { name: "Ayesha Khan", role: "Career Switcher", initials: "AK", grad: "from-emerald-500 to-teal-600", body: "100% free and yet the quality is higher than paid platforms I've tried. The step-by-step structure made switching careers actually feel possible." }
];
const FAQS = [
  { q: "Are the courses on SkillValix free?", a: "Yes — all courses on SkillValix are completely free to access. Browse our full library, study at your own pace, and level up your skills with zero upfront cost." },
  { q: "How do I earn a certificate on SkillValix?", a: "Complete a course, pass the final exam, and unlock your verified certificate — a unique, employer-ready credential with your name and a verification ID. It's how top students prove their skills stand out." },
  { q: "Does SkillValix have hackathons for students?", a: "Yes! SkillValix hosts online hackathons where students build real projects, collaborate with peers, and get recognized for their work. Ideal for your portfolio and resume." },
  { q: "Are SkillValix certificates trusted by employers?", a: "Absolutely. Every certificate has a unique verification ID — employers can confirm your achievement in seconds at skillvalix.com/verify. Thousands of students have landed internships and jobs with theirs." },
  { q: "Can beginners join SkillValix hackathons?", a: "Yes — SkillValix hackathons are designed for beginners aged 16–30. No prior experience needed. Show up, build something, and see what you're capable of." },
  { q: "How fast can I finish a course?", a: "Most courses take just 2–6 hours. Focused learners have gone from zero to exam-ready in a single day. Your pace, your schedule — no deadlines." },
  { q: "Do I need prior experience to start?", a: "Not at all. Every course starts from absolute zero. If you can browse the internet, you can start learning with SkillValix right now." },
  { q: "Can I learn at my own pace?", a: "Completely. No cohorts, no deadlines, no pressure. Progress is saved automatically — pick up exactly where you left off, whenever life allows." }
];
function useCountUp(target, duration = 2e3, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}
function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, opts);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [opts]);
  return [ref, inView];
}
function Pill({ children, color = "#6366f1", bg = "#eef2ff", border = "#c7d2fe" }) {
  return /* @__PURE__ */ jsx("span", { style: { color, background: bg, border: `1px solid ${border}`, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", padding: "5px 14px", borderRadius: 100, display: "inline-block" }, children });
}
function SectionHeader({ pill, pillColor, pillBg, pillBorder, title, subtitle, align = "center" }) {
  return /* @__PURE__ */ jsxs("div", { style: { textAlign: align, maxWidth: align === "center" ? 640 : "100%", margin: align === "center" ? "0 auto 56px" : "0 0 48px" }, children: [
    /* @__PURE__ */ jsx(Pill, { color: pillColor, bg: pillBg, border: pillBorder, children: pill }),
    /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginTop: 16, marginBottom: subtitle ? 14 : 0 }, children: title }),
    subtitle && /* @__PURE__ */ jsx("p", { style: { fontSize: 17, color: "#64748b", lineHeight: 1.7, margin: 0 }, children: subtitle })
  ] });
}
function StatCard({ s, start }) {
  const count = useCountUp(s.value, 2e3, start);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#fff",
        border: `1.5px solid ${s.border}`,
        borderRadius: 20,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        textAlign: "left",
        boxShadow: `0 4px 24px ${s.color}18`,
        transition: "transform .3s ease, box-shadow .3s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 32px ${s.color}28`;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = `0 4px 24px ${s.color}18`;
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { width: 34, height: 34, borderRadius: 10, background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsx(s.icon, { size: 15, style: { color: s.color } }) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "baseline", justifyContent: "center", gap: 2, whiteSpace: "nowrap", fontSize: "clamp(0.95rem,3.6vw,1.1rem)", fontWeight: 800, color: "#334155", lineHeight: 1.1 }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: s.color, fontWeight: 900 }, children: count }),
          /* @__PURE__ */ jsx("span", { style: { color: s.color, fontWeight: 800, opacity: 0.85 }, children: s.suffix }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "0.78em", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }, children: s.label })
        ] })
      ]
    }
  );
}
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#fff",
        border: `1.5px solid ${open ? "#6366f1" : "#e2e8f0"}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: open ? "0 4px 24px rgba(99,102,241,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all .25s ease"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setOpen((o) => !o),
            style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left" },
            children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: 15, color: open ? "#4f46e5" : "#1e293b", lineHeight: 1.4 }, children: q }),
              /* @__PURE__ */ jsx("span", { style: {
                flexShrink: 0,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: open ? "#6366f1" : "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .25s ease",
                transform: open ? "rotate(180deg)" : "rotate(0)"
              }, children: /* @__PURE__ */ jsx(ChevronDown, { size: 16, style: { color: open ? "#fff" : "#64748b" } }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .3s ease, opacity .3s ease", opacity: open ? 1 : 0 }, children: /* @__PURE__ */ jsx("p", { style: { padding: "0 28px 20px", margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.8 }, children: a }) })
      ]
    }
  );
}
function Home() {
  const statsObserverOpts = useMemo(() => ({ threshold: 0.2 }), []);
  const [statsRef, statsInView] = useInView(statsObserverOpts);
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(180deg,#f5f7ff 0%, #f3fae9 34%, #ffffff 100%)", color: "#0f172a", overflowX: "hidden" }, children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "SkillValix – Free Online Courses & Student Hackathons | Skill-Based Certification Platform" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "SkillValix: Learn free online courses in HTML, CSS, JavaScript, Python & more. Join student hackathons, earn verified skill certificates, and build a career. 2,800+ learners. Start free today!" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "SkillValix, free online courses for students, student hackathons, online hackathon platform, skill based certification platform, online certification platform, free courses India, student hackathons with certificate, online hackathon for beginners, learn skills online free, free courses and hackathons for students, free web development course, online certification India" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.skillvalix.com/" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "rating", content: "general" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://www.skillvalix.com/" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_IN" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "SkillValix – Free Online Courses & Student Hackathons" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Learn HTML, CSS, JavaScript, Python & AI — free. Join student hackathons. Earn verified skill certificates and launch your tech career on SkillValix." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://www.skillvalix.com/og-home.png" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:alt", content: "SkillValix – Free Online Courses, Hackathons & Certificates" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "SkillValix – Free Online Courses & Student Hackathons" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Learn HTML, CSS, JS, Python & more for free. Join student hackathons. Earn verified skill certificates. 2,800+ learners on SkillValix. Start today." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://www.skillvalix.com/og-home.png" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SkillValix",
        "url": "https://www.skillvalix.com",
        "description": "Free online coding courses with certificates. Learn HTML, CSS, JavaScript, Python, Java and AI for free.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.skillvalix.com/courses?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SkillValix",
        "url": "https://www.skillvalix.com",
        "logo": "https://www.skillvalix.com/logo.svg",
        "sameAs": [
          "https://www.linkedin.com/company/skillvalix",
          "https://twitter.com/skillvalix"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "availableLanguage": ["English", "Hindi"]
        }
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "SkillValix",
        "url": "https://www.skillvalix.com",
        "description": "SkillValix is a 100% free online learning platform offering structured web development and programming courses with verifiable certificates.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Free Online Coding Courses",
          "itemListElement": [
            { "@type": "Course", "name": "HTML for Beginners: Complete HTML5 Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-html-masterclass", "isAccessibleForFree": true },
            { "@type": "Course", "name": "CSS for Beginners — Zero to Pro", "url": "https://www.skillvalix.com/courses/css-for-beginners-learn-web-styling-zero-to-pro", "isAccessibleForFree": true },
            { "@type": "Course", "name": "JavaScript for Beginners: Complete JS Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-javascript-masterclass", "isAccessibleForFree": true },
            { "@type": "Course", "name": "Python for Beginners: Complete Python Programming Masterclass", "url": "https://www.skillvalix.com/courses/ultimate-python-masterclass", "isAccessibleForFree": true },
            { "@type": "Course", "name": "Java Programming Masterclass: Beginner to Advanced", "url": "https://www.skillvalix.com/courses/ultimate-java-masterclass", "isAccessibleForFree": true },
            { "@type": "Course", "name": "Ultimate C Programming: Hardware to High Performance", "url": "https://www.skillvalix.com/courses/ultimate-c-programming", "isAccessibleForFree": true },
            { "@type": "Course", "name": "Modern C++: Powerful Object-Oriented Development", "url": "https://www.skillvalix.com/courses/modern-cpp-mastery", "isAccessibleForFree": true },
            { "@type": "Course", "name": "Artificial Intelligence for Beginners: AI & Machine Learning Fundamentals", "url": "https://www.skillvalix.com/courses/basics-of-artificial-intelligence-beginners", "isAccessibleForFree": true }
          ]
        }
      }) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }) }),
      /* @__PURE__ */ jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap", rel: "stylesheet" })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        * { box-sizing: border-box; }
        @keyframes floatA { 0%,100%{transform:translate(0,0)} 40%{transform:translate(20px,-28px)} 70%{transform:translate(-10px,14px)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 40%{transform:translate(-22px,22px)} 70%{transform:translate(14px,-12px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping { 0%{transform:scale(1);opacity:.8} 75%,100%{transform:scale(2);opacity:0} }

        .anim-fadeUp { animation: fadeUp .7s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .hero-grad {
          background: linear-gradient(135deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover { transition: transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s ease !important; }
        .card-hover:hover { transform: translateY(-6px) !important; }
        .hero-grid {
          background-image:
            linear-gradient(rgba(99,102,241,.07) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,102,241,.07) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .section-divider { border-top: 1.5px solid #e2e8f0; }
        .feature-card:hover { border-color: #a5b4fc !important; box-shadow: 0 8px 32px rgba(99,102,241,0.12) !important; }
        .course-card:hover { border-color: var(--accent-border) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.10) !important; }
        .course-card:hover .card-cta { background: var(--accent-color) !important; color: #fff !important; }
        .course-card .card-cta { transition: all .25s ease; }
        .course-img { transition: transform .7s ease; }
        .course-card:hover .course-img { transform: scale(1.07); }
        .step-card:hover { border-color: var(--step-accent) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; }
        .ping-ring::before { content:''; display:block; position:absolute; inset:0; border-radius:50%; background:inherit; animation: ping 2s ease-out infinite; }
        .trust-item { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:#475569; }
        .stats-track {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .stats-item {
          min-width: 0;
        }

        @media (min-width:768px) {
          .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
          .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
          .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
          .grid-2-3 { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
          .stats-track {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 20px;
          }
          .stats-item {
            min-width: 0;
          }
        }
        @media (min-width:1024px) {
          .grid-2-3 { grid-template-columns:repeat(3,1fr); }
        }

        .section-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        @media(min-width:1280px) { .section-wrap { padding: 0 48px; } }
      ` }),
    /* @__PURE__ */ jsxs("section", { style: { position: "relative", background: "linear-gradient(160deg,#eef2ff 0%, #f4f7ff 44%, #fafcff 100%)", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 100, paddingBottom: 80, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 620, height: 620, borderRadius: "50%", background: "rgba(79,70,229,0.10)", filter: "blur(110px)", top: "-14%", left: "-12%", animation: "floatA 14s ease-in-out infinite", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "rgba(124,58,237,0.08)", filter: "blur(110px)", bottom: "-6%", right: "-10%", animation: "floatB 16s ease-in-out infinite", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(60% 46% at 50% 0%, rgba(30,41,59,0.10) 0%, rgba(255,255,255,0) 78%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { className: "hero-grid", style: { position: "absolute", inset: 0, pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #f8faff 100%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { className: "section-wrap", style: { position: "relative", zIndex: 10, textAlign: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 100, padding: "7px 18px", marginBottom: 32, boxShadow: "0 2px 12px rgba(99,102,241,0.10)" }, children: [
          /* @__PURE__ */ jsxs("span", { style: { position: "relative", display: "flex", width: 8, height: 8 }, children: [
            /* @__PURE__ */ jsx("span", { style: { position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981", animation: "ping 2s ease-out infinite", opacity: 0.7 } }),
            /* @__PURE__ */ jsx("span", { style: { position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "block" } })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 12, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.05em" }, children: "Free | No sign-up fees | No paywalls" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { style: { fontSize: "clamp(2.6rem,7.5vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }, children: [
          /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#0f172a" }, children: "Gain New Skills." }),
          /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#0f172a" }, children: "Earn Credentials." }),
          /* @__PURE__ */ jsx("span", { className: "shimmer-text", style: { display: "block" }, children: "Stand Out." })
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { fontSize: "clamp(1rem,2.2vw,1.15rem)", color: "#64748b", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.8 }, children: [
          "Master new abilities through our structured, 100% free learning courses. Finish a module, pass the exam, and walk away with a ",
          /* @__PURE__ */ jsx("strong", { style: { color: "#4f46e5", fontWeight: 700 }, children: "verified certificate" }),
          " you can proudly showcase."
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 44 }, children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/courses",
              id: "hero-cta-start",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "15px 32px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(79,70,229,0.35)",
                transition: "transform .2s, box-shadow .2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(79,70,229,0.45)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(79,70,229,0.35)";
              },
              children: [
                /* @__PURE__ */ jsx(Rocket, { size: 17 }),
                "Browse Courses",
                /* @__PURE__ */ jsx(ArrowRight, { size: 17 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/verify",
              id: "hero-cta-verify",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: "#374151",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 12,
                textDecoration: "none",
                border: "1.5px solid #e0e7ff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all .2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.transform = "translateY(-2px)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "#e0e7ff";
                e.currentTarget.style.transform = "";
              },
              children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 17, style: { color: "#10b981" } }),
                "Verify a Certificate"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "8px 22px" }, children: [
          { icon: CheckCircle2, text: "2,800+ students enrolled", color: "#10b981" },
          { icon: Award, text: "Free forever - no card needed", color: "#6366f1" },
          { icon: Star, text: "4.9 avg course rating", color: "#f59e0b" }
        ].map(({ icon: Icon, text, color }, i) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }, children: [
          React.createElement(Icon, { size: 15, style: { color, flexShrink: 0 } }),
          text
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to bottom,transparent,#f8faff)", pointerEvents: "none" } })
    ] }),
    /* @__PURE__ */ jsx("section", { ref: statsRef, style: { background: "#fff", padding: "72px 0" }, className: "section-divider", children: /* @__PURE__ */ jsx("div", { className: "section-wrap", children: /* @__PURE__ */ jsx("div", { className: "stats-track", children: STATS.map((s) => /* @__PURE__ */ jsx("div", { className: "stats-item", children: /* @__PURE__ */ jsx(StatCard, { s, start: statsInView }) }, s.label)) }) }) }),
    /* @__PURE__ */ jsx("div", { style: { background: "#f1f5f9", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "18px 0", overflow: "hidden" }, children: /* @__PURE__ */ jsx("div", { style: { display: "flex", width: "max-content", animation: "marqueeScroll 22s linear infinite" }, children: [...Array(4)].flatMap(() => ["HTML5", "•", "CSS3", "•", "JavaScript", "•", "React", "•", "Node.js", "•", "Git", "•"]).map((item, i) => /* @__PURE__ */ jsx("span", { style: { marginRight: 28, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: item === "•" ? "#c7d2fe" : "#94a3b8" }, children: item }, i)) }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "96px 0" }, className: "section-divider", children: /* @__PURE__ */ jsxs("div", { className: "section-wrap", children: [
      /* @__PURE__ */ jsx(
        SectionHeader,
        {
          pill: "The Process",
          pillColor: "#4f46e5",
          pillBg: "#eef2ff",
          pillBorder: "#c7d2fe",
          title: /* @__PURE__ */ jsxs(Fragment, { children: [
            "From zero to ",
            /* @__PURE__ */ jsx("span", { className: "shimmer-text", children: "certified dev" }),
            "."
          ] }),
          subtitle: "Four simple steps. No prior experience required. Start today."
        }
      ),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, position: "relative" }, children: HOW_IT_WORKS.map((s, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "step-card card-hover",
          style: {
            "--step-accent": s.accent,
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 20,
            padding: "32px 28px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", right: -8, top: -8, fontSize: 100, fontWeight: 900, lineHeight: 1, color: `${s.accent}08`, userSelect: "none", pointerEvents: "none" }, children: s.label }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: s.accent, marginBottom: 20 }, children: [
              "Step ",
              s.label
            ] }),
            /* @__PURE__ */ jsx("div", { style: { width: 52, height: 52, borderRadius: 14, background: s.light, border: `1.5px solid ${s.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }, children: /* @__PURE__ */ jsx(s.icon, { size: 24, style: { color: s.accent } }) }),
            /* @__PURE__ */ jsx("h3", { style: { fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 10, lineHeight: 1.3 }, children: s.title }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.75, margin: 0 }, children: s.desc }),
            i < HOW_IT_WORKS.length - 1 && /* @__PURE__ */ jsx("div", { style: { display: "none" }, className: "step-arrow", children: /* @__PURE__ */ jsx(ChevronRight, { size: 20, style: { color: "#cbd5e1" } }) })
          ]
        },
        s.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#f8faff", padding: "96px 0" }, className: "section-divider", children: /* @__PURE__ */ jsxs("div", { className: "section-wrap", children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 52 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Pill, { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", children: "Curriculum" }),
          /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginTop: 14, marginBottom: 0 }, children: [
            "Premium courses,",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { style: { color: "#cbd5e1" }, children: "zero cost." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/blog",
              id: "home-view-blog",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#475569",
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                padding: "12px 24px",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all .2s",
                whiteSpace: "nowrap"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.transform = "translateY(-2px)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "";
              },
              children: "Read our Blog"
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/courses",
              id: "courses-view-all",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#4f46e5",
                background: "#fff",
                border: "1.5px solid #c7d2fe",
                padding: "12px 24px",
                borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
                transition: "all .2s",
                whiteSpace: "nowrap"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "#eef2ff";
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.transform = "translateY(-2px)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#c7d2fe";
                e.currentTarget.style.transform = "";
              },
              children: [
                "Explore All Courses ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }, children: COURSES.map((c) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/courses/${c.slug}`,
          id: `course-card-${c.slug}`,
          className: "course-card card-hover",
          style: {
            "--accent-color": c.accent,
            "--accent-border": c.accentBorder,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            border: `1.5px solid #e2e8f0`,
            borderRadius: 20,
            overflow: "hidden",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { style: { position: "relative", height: 200, overflow: "hidden", background: "#f1f5f9" }, children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: c.image,
                  alt: c.title,
                  loading: "lazy",
                  decoding: "async",
                  width: "800",
                  height: "500",
                  className: "course-img",
                  style: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top,rgba(255,255,255,0.95),transparent)" } }),
              /* @__PURE__ */ jsx("span", { style: {
                position: "absolute",
                top: 16,
                left: 16,
                background: c.badgeColor,
                color: "#fff",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "5px 14px",
                borderRadius: 100,
                boxShadow: `0 4px 12px ${c.badgeColor}60`
              }, children: c.badge })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, padding: "24px 28px 28px" }, children: [
              /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }, children: c.tags.map((t) => /* @__PURE__ */ jsx("span", { style: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 100, background: c.accentLight, color: c.accent, border: `1px solid ${c.accentBorder}` }, children: t }, t)) }),
              /* @__PURE__ */ jsx("h3", { style: { fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom: 10, lineHeight: 1.3 }, children: c.title }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.75, flex: 1, marginBottom: 20 }, children: c.desc }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16, fontSize: 12, fontWeight: 600, color: "#94a3b8", paddingTop: 16, borderTop: "1px solid #f1f5f9", marginBottom: 18 }, children: [
                /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
                  /* @__PURE__ */ jsx(Clock, { size: 14 }),
                  " ",
                  c.duration
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
                  /* @__PURE__ */ jsx(Layers, { size: 14 }),
                  " ",
                  c.modules,
                  " modules"
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 5, marginLeft: "auto" }, children: [
                  /* @__PURE__ */ jsx(Star, { size: 14, style: { color: "#f59e0b", fill: "#f59e0b" } }),
                  " ",
                  c.rating
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "card-cta",
                  style: {
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 12,
                    background: c.accentLight,
                    color: c.accent,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "center",
                    border: `1px solid ${c.accentBorder}`
                  },
                  children: "View Course Details â†’"
                }
              )
            ] })
          ]
        },
        c.slug
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "96px 0" }, className: "section-divider", children: /* @__PURE__ */ jsxs("div", { className: "section-wrap", children: [
      /* @__PURE__ */ jsx(
        SectionHeader,
        {
          pill: "Why SkillValix",
          pillColor: "#7c3aed",
          pillBg: "#f5f3ff",
          pillBorder: "#ddd6fe",
          title: /* @__PURE__ */ jsxs(Fragment, { children: [
            "Built for ",
            /* @__PURE__ */ jsx("span", { className: "shimmer-text", children: "real learning." })
          ] }),
          subtitle: "Every feature is designed to maximise your growth as a developer."
        }
      ),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }, children: FEATURES.map((f, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          id: `feature-${i}`,
          className: "feature-card card-hover",
          style: {
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 20,
            padding: "32px 28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            transition: "all .3s ease"
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { width: 52, height: 52, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }, children: /* @__PURE__ */ jsx(f.icon, { size: 24, style: { color: f.color } }) }),
            /* @__PURE__ */ jsx("h3", { style: { fontSize: 17, fontWeight: 800, color: "#1e293b", marginBottom: 10, lineHeight: 1.3 }, children: f.title }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#64748b", lineHeight: 1.75, margin: 0 }, children: f.desc })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#f8faff", padding: "96px 0" }, className: "section-divider", children: /* @__PURE__ */ jsxs("div", { className: "section-wrap", children: [
      /* @__PURE__ */ jsx(
        SectionHeader,
        {
          pill: "Community",
          pillColor: "#e11d48",
          pillBg: "#fff1f2",
          pillBorder: "#fecdd3",
          title: /* @__PURE__ */ jsxs(Fragment, { children: [
            "Loved by ",
            /* @__PURE__ */ jsx("span", { className: "shimmer-text", children: "real learners." })
          ] }),
          subtitle: "Thousands of students have already levelled up their careers with SkillValix."
        }
      ),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }, children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          id: `testimonial-${i}`,
          className: "card-hover",
          style: {
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 20,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            position: "relative",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 20, right: 24, fontSize: 64, lineHeight: 1, fontWeight: 900, color: "#f0f4ff", userSelect: "none" }, children: '"' }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 3 }, children: [...Array(5)].map((_, si) => /* @__PURE__ */ jsx(Star, { size: 15, style: { color: "#f59e0b", fill: "#f59e0b" } }, si)) }),
            /* @__PURE__ */ jsxs("p", { style: { fontSize: 14, color: "#475569", lineHeight: 1.8, flex: 1, fontStyle: "italic", margin: 0 }, children: [
              '"',
              t.body,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14, paddingTop: 18, borderTop: "1px solid #f1f5f9" }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: { width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, background: `linear-gradient(135deg, var(--from-c), var(--to-c))` },
                  className: `bg-gradient-to-br ${t.grad}`,
                  children: t.initials
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 800, color: "#0f172a" }, children: t.name }),
                /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "#94a3b8", marginTop: 2 }, children: t.role })
              ] }),
              /* @__PURE__ */ jsx(CheckCircle2, { size: 18, style: { color: "#10b981", marginLeft: "auto", flexShrink: 0 } })
            ] })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { background: "#fff", padding: "96px 0" }, className: "section-divider", children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 720, margin: "0 auto", padding: "0 24px" }, children: [
      /* @__PURE__ */ jsx(
        SectionHeader,
        {
          pill: "FAQ",
          pillColor: "#4f46e5",
          pillBg: "#eef2ff",
          pillBorder: "#c7d2fe",
          title: "Got questions?",
          subtitle: "Everything you need to know about the platform."
        }
      ),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: FAQS.map((f, i) => /* @__PURE__ */ jsx(FaqItem, { ...f }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { style: { position: "relative", overflow: "hidden", padding: "112px 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg,#312e81 0%,#4f46e5 40%,#6d28d9 70%,#312e81 100%)" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "rgba(255,255,255,0.07)", filter: "blur(80px)", top: "-30%", left: "-10%", animation: "floatA 11s ease-in-out infinite", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(236,72,153,0.18)", filter: "blur(80px)", bottom: "-25%", right: "-10%", animation: "floatB 13s ease-in-out infinite", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 10, textAlign: "center", maxWidth: 840, width: "100%" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "7px 18px", marginBottom: 36, backdropFilter: "blur(10px)" }, children: [
          /* @__PURE__ */ jsx(Target, { size: 14, style: { color: "#fbbf24" } }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }, children: "Join 2,800+ learners already on the platform" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { style: { fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: 24, letterSpacing: "-0.02em" }, children: [
          "Your career in tech",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#e0e7ff,#c4b5fd,#f9a8d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, children: "starts right here." })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.75, fontWeight: 400 }, children: "100% free courses. Interactive learning. Verifiable certificates. Join the community today." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16 }, children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/register",
              id: "cta-create-account",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                color: "#4338ca",
                fontWeight: 800,
                fontSize: 17,
                padding: "18px 44px",
                borderRadius: 16,
                textDecoration: "none",
                boxShadow: "0 4px 28px rgba(0,0,0,0.25)",
                transition: "transform .2s, box-shadow .2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.35)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 28px rgba(0,0,0,0.25)";
              },
              children: [
                /* @__PURE__ */ jsx(Rocket, { size: 20 }),
                " Create Free Account"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/courses",
              id: "cta-browse-courses",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                padding: "17px 36px",
                borderRadius: 16,
                textDecoration: "none",
                border: "2px solid rgba(255,255,255,0.3)",
                transition: "all .2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                e.currentTarget.style.transform = "translateY(-2px)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.transform = "";
              },
              children: [
                /* @__PURE__ */ jsx(BookOpen, { size: 20 }),
                " Browse Courses"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 28px", marginTop: 40 }, children: ["No credit card", "Always free", "Cancel anytime"].map((t, i) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }, children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 15, style: { color: "rgba(52,211,153,0.7)" } }),
          t
        ] }, i)) })
      ] })
    ] })
  ] });
}
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { login, googleLogin, resendVerification } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };
  const handleResend = async () => {
    var _a, _b;
    setResendLoading(true);
    setError(null);
    try {
      const data = await resendVerification(email);
      setSuccess(data.message);
    } catch (err) {
      setError(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    var _a, _b;
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Login Failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Login | SkillValix Learning" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Sign in to your SkillValix account to track progress and earn certificates." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-50 rounded-full", children: /* @__PURE__ */ jsx(LogIn, { className: "w-8 h-8 text-blue-600" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center text-slate-900 mb-6", children: "Welcome Back" }),
      success && /* @__PURE__ */ jsx("div", { className: "bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-md mb-4 text-sm text-center", children: success }),
      error && /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm text-center", children: [
        error,
        error.toLowerCase().includes("verify") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleResend,
            disabled: resendLoading,
            className: "block mx-auto mt-2 text-blue-600 font-semibold hover:underline disabled:opacity-50",
            children: resendLoading ? "Sending..." : "Resend Verification Link"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              required: true,
              autoComplete: "email",
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@email.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              required: true,
              autoComplete: "current-password",
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "absolute right-3 top-[34px] text-slate-500 hover:text-slate-700 transition-colors",
              onClick: () => setShowPassword(!showPassword),
              children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Link, { to: "/forgot-password", className: "text-sm font-medium text-blue-600 hover:text-blue-500", children: "Forgot your password?" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
            children: loading ? "Signing in..." : "Sign In"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 border-t border-slate-200" }),
        /* @__PURE__ */ jsx("span", { className: "px-4 text-sm text-slate-500 bg-white", children: "or" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 border-t border-slate-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsx(
        GoogleLogin,
        {
          onSuccess: handleGoogleSuccess,
          onError: () => setError("Google login failed"),
          theme: "outline",
          size: "large",
          width: "360"
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-slate-500", children: [
        "Don't have an account? ",
        /* @__PURE__ */ jsx(Link, { to: "/register", className: "text-blue-600 hover:text-blue-500 font-medium", children: "Sign up" })
      ] })
    ] })
  ] });
};
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const { register, googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError("Google signup failed. Please try again.");
    }
  };
  const handleSubmit = async (e) => {
    var _a, _b;
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      setSuccess(data.message || "Registration successful! Please check your email.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Register | SkillValix Learning" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Create a new SkillValix account to start learning and earning certificates today." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-emerald-50 rounded-full", children: /* @__PURE__ */ jsx(UserPlus, { className: "w-8 h-8 text-emerald-600" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center text-slate-900 mb-6", children: "Create Account" }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm text-center", children: error }),
      success && /* @__PURE__ */ jsx("div", { className: "bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-md mb-4 text-sm text-center", children: success }),
      !success && /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Full Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "John Doe"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              required: true,
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@email.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              required: true,
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "absolute right-3 top-[34px] text-slate-500 hover:text-slate-700 transition-colors",
              onClick: () => setShowPassword(!showPassword),
              children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
            children: loading ? "Creating Account..." : "Sign Up"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 border-t border-slate-200" }),
        /* @__PURE__ */ jsx("span", { className: "px-4 text-sm text-slate-500 bg-white", children: "or" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 border-t border-slate-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsx(
        GoogleLogin,
        {
          onSuccess: handleGoogleSuccess,
          onError: () => setError("Google login failed"),
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signup_with"
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-slate-500", children: [
        "Already have an account? ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-emerald-600 hover:text-emerald-500 font-medium", children: "Log in" })
      ] })
    ] })
  ] });
};
const Courses$1 = lazy(() => import("./assets/Courses-DqzUykqJ.js"));
const CourseDetail = lazy(() => import("./assets/CourseDetail-BVKHCQ38.js"));
const LessonView = lazy(() => import("./assets/LessonView-DIyz3CPH.js"));
const QuizView = lazy(() => import("./assets/QuizView-D6XVbx1X.js"));
const Dashboard = lazy(() => import("./assets/Dashboard-TTSM1jZH.js"));
const VerifyCert$1 = lazy(() => import("./assets/VerifyCert-DU1K-WTy.js"));
const Blog$1 = lazy(() => import("./assets/Blog-4dbMPmp_.js"));
const BlogPost$1 = lazy(() => import("./assets/BlogPost-DV38c6vZ.js"));
const ForgotPassword = lazy(() => import("./assets/ForgotPassword-BOVH5Ume.js"));
const ResetPassword = lazy(() => import("./assets/ResetPassword-BAbil_vh.js"));
const PublicProfile = lazy(() => import("./assets/PublicProfile-RKoITiyv.js"));
const AdminPanel = lazy(() => import("./assets/AdminPanel-J3da4YNn.js"));
const PrivacyPolicy$1 = lazy(() => import("./assets/PrivacyPolicy-kIrTHnsR.js"));
const TermsOfService$1 = lazy(() => import("./assets/TermsOfService-C80HjCWL.js"));
const RefundPolicy$1 = lazy(() => import("./assets/RefundPolicy-DkQHOyI1.js"));
const CookiePolicy$1 = lazy(() => import("./assets/CookiePolicy-CJ6onVLy.js"));
const Events$1 = lazy(() => import("./assets/Events-Ci1Sejyn.js"));
const HackathonDetail = lazy(() => import("./assets/HackathonDetail-zKfbxAKn.js"));
const JobSimulation = lazy(() => import("./assets/JobSimulation-bSIl1oTF.js"));
const HostHackathon$1 = lazy(() => import("./assets/HostHackathon-YjWyDviu.js"));
const CampusAmbassador$1 = lazy(() => import("./assets/CampusAmbassador-7ekhtrZz.js"));
const FreeCourses$1 = lazy(() => import("./assets/FreeCourses-B7VrcakI.js"));
const Certification$1 = lazy(() => import("./assets/Certification-B9v0BhEq.js"));
const VerifyEmail = lazy(() => import("./assets/VerifyEmail-Dyumpccu.js"));
function PageLoader() {
  return /* @__PURE__ */ jsxs("div", { style: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      width: 40,
      height: 40,
      border: "3px solid #e0e7ff",
      borderTopColor: "#6366f1",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite"
    } }),
    /* @__PURE__ */ jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
  ] });
}
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  useLocation();
  if (loading) return /* @__PURE__ */ jsx(PageLoader, {});
  if (isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/dashboard", replace: true });
  }
  return children;
};
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useAuthStore();
  const location = useLocation();
  if (loading) return /* @__PURE__ */ jsx(PageLoader, {});
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
  }
  if (adminOnly && (user == null ? void 0 : user.role) !== "admin") {
    return /* @__PURE__ */ jsx(Navigate, { to: "/dashboard", replace: true });
  }
  return children;
};
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => window.scrollTo(0, 0), 10);
    const t2 = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);
  return null;
}
function AppContent() {
  const { loadUser } = useAuthStore();
  const location = useLocation();
  useEffect(() => {
    loadUser();
    preloadCourses();
  }, [loadUser]);
  const isCoursePath = location.pathname.startsWith("/courses/");
  const isCoursesList = location.pathname === "/courses";
  const isQuizPath = location.pathname.includes("/quiz");
  const isPublicProfile = location.pathname.startsWith("/u/");
  const isVerifyPath = location.pathname.startsWith("/verify/") || location.pathname.startsWith("/verify-event") || location.pathname.startsWith("/verify-email");
  const isLearningView = isCoursePath && !isCoursesList || isQuizPath;
  const isCleanView = isPublicProfile || isVerifyPath;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500/30", children: [
    !isCleanView && /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageLoader, {}), children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(GuestRoute, { children: /* @__PURE__ */ jsx(Login, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(GuestRoute, { children: /* @__PURE__ */ jsx(Register, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsx(GuestRoute, { children: /* @__PURE__ */ jsx(ForgotPassword, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/reset-password/:token", element: /* @__PURE__ */ jsx(GuestRoute, { children: /* @__PURE__ */ jsx(ResetPassword, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/courses", element: /* @__PURE__ */ jsx(Courses$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/courses/:slug", element: /* @__PURE__ */ jsx(CourseDetail, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/courses/:slug/lesson/:lessonId", element: /* @__PURE__ */ jsx(LessonView, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/courses/:slug/quiz", element: /* @__PURE__ */ jsx(QuizView, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Dashboard, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/u/:id", element: /* @__PURE__ */ jsx(PublicProfile, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(ProtectedRoute, { adminOnly: true, children: /* @__PURE__ */ jsx(AdminPanel, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin/upload", element: /* @__PURE__ */ jsx(ProtectedRoute, { adminOnly: true, children: /* @__PURE__ */ jsx(AdminPanel, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/verify", element: /* @__PURE__ */ jsx(VerifyCert$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/verify/:certId", element: /* @__PURE__ */ jsx(VerifyCert$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog", element: /* @__PURE__ */ jsx(Blog$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog/:slug", element: /* @__PURE__ */ jsx(BlogPost$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/hackathons", element: /* @__PURE__ */ jsx(Events$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/hackathons/:id", element: /* @__PURE__ */ jsx(HackathonDetail, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/job-simulation/:id", element: /* @__PURE__ */ jsx(JobSimulation, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/events/job-simulation/:id", element: /* @__PURE__ */ jsx(JobSimulation, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/verify-event/:certId", element: /* @__PURE__ */ jsx(VerifyCert$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/verify-event", element: /* @__PURE__ */ jsx(VerifyCert$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy-policy", element: /* @__PURE__ */ jsx(PrivacyPolicy$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(TermsOfService$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/refund-policy", element: /* @__PURE__ */ jsx(RefundPolicy$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/cookie-policy", element: /* @__PURE__ */ jsx(CookiePolicy$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/host", element: /* @__PURE__ */ jsx(HostHackathon$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/campus-ambassador", element: /* @__PURE__ */ jsx(CampusAmbassador$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/free-courses", element: /* @__PURE__ */ jsx(FreeCourses$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/certification", element: /* @__PURE__ */ jsx(Certification$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/verify-email/:token", element: /* @__PURE__ */ jsx(VerifyEmail, {}) })
    ] }) }) }),
    !isLearningView && !isCleanView && /* @__PURE__ */ jsx(PreFooterCTA, {}),
    !isLearningView && !isCleanView && /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(WhatsAppJoinPopup, {})
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(AppContent, {})
  ] }) });
}
const blogPosts = [
  {
    id: "mastering-html5-semantic-tags-seo",
    title: "Mastering HTML5 in 2026: Why Semantic Tags Matter for SEO",
    metaTitle: "Mastering HTML5 in 2026: Why Semantic Tags Matter for SEO | SkillValix",
    metaDescription: "Learn how HTML5 semantic tags like <article>, <section>, and <nav> boost your search engine rankings and web accessibility in 2026. A must-read for every web developer.",
    keywords: [
      "HTML5 semantic tags",
      "HTML SEO",
      "semantic HTML for SEO",
      "web development 2026",
      "HTML5 tutorial",
      "web accessibility",
      "article tag HTML",
      "section tag HTML"
    ],
    excerpt: "Semantic HTML5 tags like <article>, <section>, and <nav> are no longer optional. Learn how using them correctly boosts both your search engine rankings and web accessibility.",
    content: `
      <h2>The Shift to Meaningful Markup</h2>
      <p>For years, developers relied heavily on <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> tags to structure their web pages. While this worked fine for styling, it gave search engines and screen readers zero context about <em>what</em> the content actually means. Enter HTML5 semantic tags — the single most underrated tool for boosting both SEO rankings and web accessibility.</p>
      <p>By replacing generic containers with meaningful elements, you are essentially handing Google a labelled map of your content's hierarchy and importance. This article covers every semantic tag that matters, why each one exists, and how using them correctly translates directly into better search rankings.</p>

      <h2>The Complete HTML5 Semantic Tag Reference</h2>

      <h3>&lt;header&gt; and &lt;footer&gt; — Define Your Page Boundaries</h3>
      <p>The <code>&lt;header&gt;</code> element represents introductory content for a page or a section. It typically contains the logo, primary navigation, and a headline. The <code>&lt;footer&gt;</code> holds secondary information — copyright, policy links, and contact details.</p>
      <p>Search engines use these to understand where your primary content begins and ends. Content inside <code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code> is weighted lower in relevance than content inside <code>&lt;main&gt;</code> or <code>&lt;article&gt;</code>.</p>
      <pre><code>&lt;header&gt;
  &lt;nav aria-label="Primary navigation"&gt;
    &lt;a href="/"&gt;Home&lt;/a&gt;
    &lt;a href="/courses"&gt;Courses&lt;/a&gt;
    &lt;a href="/blog"&gt;Blog&lt;/a&gt;
  &lt;/nav&gt;
&lt;/header&gt;</code></pre>

      <h3>&lt;main&gt; — The Crown Jewel</h3>
      <p>The <code>&lt;main&gt;</code> element is the most critical semantic tag for SEO. It identifies the dominant, unique content of the page. Google's crawlers prioritise content inside <code>&lt;main&gt;</code> above all else when determining relevance and ranking. Every page must have exactly one <code>&lt;main&gt;</code> element.</p>
      <pre><code>&lt;body&gt;
  &lt;header&gt;...&lt;/header&gt;

  &lt;main&gt;
    &lt;!-- This is what Google cares about most --&gt;
    &lt;article&gt;
      &lt;h1&gt;Your Primary Keyword-Rich Heading&lt;/h1&gt;
      &lt;p&gt;Your core content...&lt;/p&gt;
    &lt;/article&gt;
  &lt;/main&gt;

  &lt;footer&gt;...&lt;/footer&gt;
&lt;/body&gt;</code></pre>

      <h3>&lt;article&gt; and &lt;section&gt; — Content Hierarchy</h3>
      <p>These two are the most commonly confused semantic tags. Here is the simple rule: an <code>&lt;article&gt;</code> is self-contained content that makes sense on its own — a blog post, a product card, a forum post. A <code>&lt;section&gt;</code> is a thematic grouping of related content within a page that is NOT self-contained.</p>
      <ul>
        <li><strong>Use <code>&lt;article&gt;</code> for:</strong> Blog posts, news articles, product listings, user reviews, comment cards.</li>
        <li><strong>Use <code>&lt;section&gt;</code> for:</strong> Chapters within an article, thematic groups on a homepage (hero, features, pricing, testimonials).</li>
        <li><strong>Never use <code>&lt;div&gt;</code> when either applies.</strong> A div has no semantic meaning — it is invisible to search engines and screen readers.</li>
      </ul>

      <h3>&lt;nav&gt; — Signal Your Navigation Structure</h3>
      <p>The <code>&lt;nav&gt;</code> element should wrap your primary and secondary navigation menus. Using <code>aria-label</code> on multiple <code>&lt;nav&gt;</code> elements helps screen readers and search bots distinguish between your header nav, footer nav, and breadcrumb nav.</p>
      <pre><code>&lt;!-- Header navigation --&gt;
&lt;nav aria-label="Primary"&gt;...&lt;/nav&gt;

&lt;!-- Breadcrumb --&gt;
&lt;nav aria-label="Breadcrumb"&gt;
  &lt;ol&gt;
    &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="/blog"&gt;Blog&lt;/a&gt;&lt;/li&gt;
    &lt;li aria-current="page"&gt;Current Article&lt;/li&gt;
  &lt;/ol&gt;
&lt;/nav&gt;</code></pre>

      <h3>&lt;aside&gt; — Supplementary Content</h3>
      <p>The <code>&lt;aside&gt;</code> element marks content that is tangentially related to the main content — sidebars, pull quotes, related article lists, and advertisement slots. Google treats content inside <code>&lt;aside&gt;</code> as supplementary, not core — which is exactly correct for sidebars.</p>

      <h3>&lt;figure&gt; and &lt;figcaption&gt; — Images with Context</h3>
      <p>Whenever you use an image that is directly referenced by the surrounding text, wrap it in <code>&lt;figure&gt;</code> and describe it with <code>&lt;figcaption&gt;</code>. This creates a semantic link between the image and its description that Google can understand and index.</p>
      <pre><code>&lt;figure&gt;
  &lt;img src="css-flexbox-diagram.png" alt="CSS Flexbox axis diagram" width="800" height="450" /&gt;
  &lt;figcaption&gt;The main axis and cross axis in a CSS Flexbox container&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>

      <h3>&lt;time&gt; — Dates Google Can Read</h3>
      <p>The <code>&lt;time&gt;</code> element with a <code>datetime</code> attribute gives search engines a machine-readable date. This is critical for blog posts and news articles because Google uses it for freshness scoring — a key ranking signal.</p>
      <pre><code>&lt;time datetime="2026-03-15T09:00:00+05:30"&gt;March 15, 2026&lt;/time&gt;</code></pre>

      <h2>How Semantic Tags Directly Boost SEO Rankings</h2>
      <p>Here is the concrete mechanism: Google's crawler assigns different relevance weights to words based on which semantic container they are in. Keywords inside an <code>&lt;h1&gt;</code> within a <code>&lt;main&gt;</code> within an <code>&lt;article&gt;</code> carry the highest topical relevance signal. The same keywords buried inside a <code>&lt;div&gt;</code> inside another <code>&lt;div&gt;</code> carry virtually none.</p>
      <p>This is why two pages with identical visible content but different HTML structure can rank wildly differently. Semantic HTML is a direct ranking factor — not a nice-to-have.</p>

      <h2>Semantic HTML and Web Accessibility</h2>
      <p>Screen readers used by visually impaired users rely 100% on semantic HTML. When a user navigates to a page using a screen reader, it announces the page structure: "Header, navigation with 5 links. Main content. Heading level 1: Mastering HTML5 Semantic Tags. Article. Section..." Without semantic tags, a screen reader reads the entire page as one flat, undifferentiated stream of text — making it completely inaccessible.</p>
      <p>Accessibility is also a Lighthouse metric. A score below 90 on accessibility actively signals to Google that your site may not be high-quality — impacting your Search Console performance.</p>

      <h2>The Perfect HTML5 Page Structure Template</h2>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;Page Title — Your Brand&lt;/title&gt;
  &lt;meta name="description" content="Compelling 155-character description..."&gt;
  &lt;link rel="canonical" href="https://yoursite.com/this-page" /&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;nav aria-label="Primary"&gt;...&lt;/nav&gt;
  &lt;/header&gt;

  &lt;main&gt;
    &lt;article&gt;
      &lt;header&gt;
        &lt;h1&gt;Primary Keyword-Rich Title&lt;/h1&gt;
        &lt;time datetime="2026-03-15"&gt;March 15, 2026&lt;/time&gt;
      &lt;/header&gt;

      &lt;section&gt;
        &lt;h2&gt;Subtopic One&lt;/h2&gt;
        &lt;p&gt;Content...&lt;/p&gt;
        &lt;figure&gt;
          &lt;img src="..." alt="Descriptive alt text" /&gt;
          &lt;figcaption&gt;...&lt;/figcaption&gt;
        &lt;/figure&gt;
      &lt;/section&gt;

      &lt;section&gt;
        &lt;h2&gt;Subtopic Two&lt;/h2&gt;
        &lt;p&gt;Content...&lt;/p&gt;
      &lt;/section&gt;
    &lt;/article&gt;

    &lt;aside&gt;
      &lt;h3&gt;Related Articles&lt;/h3&gt;
      &lt;!-- Related links --&gt;
    &lt;/aside&gt;
  &lt;/main&gt;

  &lt;footer&gt;...&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

      <h2>Common Semantic HTML Mistakes to Avoid</h2>
      <ul>
        <li><strong>Multiple &lt;h1&gt; tags:</strong> Each page should have exactly one <code>&lt;h1&gt;</code>. It is your primary ranking signal. Multiple H1s dilute it.</li>
        <li><strong>Using &lt;section&gt; as a styled wrapper:</strong> If you are using <code>&lt;section&gt;</code> just to add padding or a background colour, use a <code>&lt;div&gt;</code>. Semantic tags must have a meaningful purpose.</li>
        <li><strong>Missing alt attributes on images:</strong> Every <code>&lt;img&gt;</code> needs a descriptive <code>alt</code> attribute. It is an accessibility requirement AND a ranking signal for image search.</li>
        <li><strong>Nesting interactive elements:</strong> Never put a <code>&lt;button&gt;</code> inside an <code>&lt;a&gt;</code> tag or vice versa. It is invalid HTML and breaks keyboard navigation.</li>
      </ul>

      <h2>What to Learn Next</h2>
      <p>Mastering semantic HTML is the first step. The next is learning how to style those semantic structures beautifully with CSS. Our <a href="/blog/css-grid-vs-flexbox-modern-web">CSS Grid vs Flexbox guide</a> shows you how to build modern, responsive page layouts that sit perfectly on top of your semantic HTML foundation. Then, add behaviour with our <a href="/blog/javascript-dom-manipulation-secrets">JavaScript DOM manipulation guide</a>.</p>
      <p>To master HTML5 from scratch — including forms, multimedia, accessibility, and structured data — check out the completely free <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> on SkillValix. It ends with a verifiable certificate you can link to on LinkedIn.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Do semantic HTML tags actually affect Google rankings?</strong><br/>
      Yes, directly. Google's crawler uses HTML structure to assign topical weight to keywords. Content inside semantic containers like <code>&lt;article&gt;</code> and <code>&lt;main&gt;</code> is weighted higher than content in generic <code>&lt;div&gt;</code> wrappers. The structure also enables rich results and featured snippets, which are exclusively triggered by correct semantic markup.</p>

      <p><strong>Q2: What is the difference between &lt;article&gt; and &lt;section&gt;?</strong><br/>
      An <code>&lt;article&gt;</code> is self-contained content that makes sense independently — you could publish it elsewhere and it would still make sense. A <code>&lt;section&gt;</code> is a thematic grouping within a larger page that is not independently meaningful. When in doubt: if it could be an RSS feed item, it is an <code>&lt;article&gt;</code>.</p>

      <p><strong>Q3: Can I use HTML5 semantic tags with React or other frameworks?</strong><br/>
      Absolutely. React and all modern JavaScript frameworks render to standard HTML in the browser. You write JSX using the same semantic tags — <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code> — and they compile to proper HTML that search engines and screen readers can read. SkillValix itself is built with React and uses full semantic HTML throughout.</p>

      <p><strong>Q4: Is semantic HTML different in 2026 vs older HTML5?</strong><br/>
      The core semantic tags have not changed — <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;figure&gt;</code>, <code>&lt;time&gt;</code> are all still the standard. What has evolved is Google's ability to parse and leverage them. In 2026, Google's understanding of semantic structure is far more nuanced — making correct usage even more impactful for rankings than it was even 3 years ago.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-15T09:00:00+05:30",
    modifiedDate: "2026-03-15T09:00:00+05:30",
    date: "March 15, 2026",
    readTime: "12 min read",
    wordCount: 1420,
    category: "SEO & HTML",
    tags: ["HTML5", "SEO", "Semantic HTML", "Web Development", "Accessibility", "HTML5 Tutorial", "On-Page SEO"],
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "HTML5 code on a computer screen showing semantic tags",
    canonicalUrl: "https://www.skillvalix.com/blog/mastering-html5-semantic-tags-seo",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass for Beginners",
      slug: "ultimate-html-masterclass",
      description: "Master semantic HTML5, multimedia, and form validations."
    }
  },
  {
    id: "css-grid-vs-flexbox-modern-web",
    title: "CSS Grid vs Flexbox: The Ultimate Guide for Modern Web Design",
    metaTitle: "CSS Grid vs Flexbox: The Ultimate Guide (2026) | SkillValix",
    metaDescription: "CSS Grid or Flexbox — which should you use and when? This 2026 guide breaks down the key differences, use cases, and how to combine both for pixel-perfect responsive web layouts.",
    keywords: [
      "CSS Grid vs Flexbox",
      "CSS layout tutorial",
      "Flexbox guide 2026",
      "CSS Grid guide 2026",
      "responsive web design",
      "modern CSS layout",
      "web design tutorial",
      "CSS for beginners"
    ],
    excerpt: "Confused about when to use CSS Grid and when to use Flexbox? We break down the differences and explain how to combine them for pixel-perfect, responsive layouts.",
    content: `
      <h2>The Two Kings of CSS Layout</h2>
      <p>Before Flexbox and CSS Grid, building layouts was a dark art of floats, clearfixes, and table-based hacks. Today, CSS gives us two purpose-built layout modules that solve different problems. But choosing between them — or knowing when to combine them — is a skill that separates junior developers from senior ones.</p>
      <p>This guide gives you the definitive answer, with real code examples for every scenario.</p>

      <h2>CSS Flexbox: The One-Dimensional Specialist</h2>
      <p>Flexbox (Flexible Box Layout) was built for <strong>one-dimensional layouts</strong> — it handles a row of items OR a column of items, not both simultaneously. Its superpower is distributing space and aligning items within a single axis.</p>

      <h3>When to Use Flexbox</h3>
      <ul>
        <li><strong>Navigation bars</strong> — distribute links horizontally with equal spacing</li>
        <li><strong>Card rows</strong> — keep cards equal height regardless of content</li>
        <li><strong>Centering anything</strong> — <code>display: flex; align-items: center; justify-content: center</code> is the cleanest centering technique in CSS</li>
        <li><strong>Icon + text alignment</strong> — keep an icon vertically centred next to text</li>
        <li><strong>Responsive button groups</strong> — wrap buttons to a new row on mobile</li>
      </ul>

      <pre><code>/* Perfect horizontal navbar with Flexbox */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

/* Equal-height card row */
.card-row {
  display: flex;
  gap: 24px;
  align-items: stretch; /* Cards match height of tallest */
}

/* The famous perfect-center trick */
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}</code></pre>

      <h3>Key Flexbox Properties You Must Know</h3>
      <ul>
        <li><code>flex-direction</code>: <code>row</code> (default) or <code>column</code> — sets the main axis</li>
        <li><code>justify-content</code>: Aligns items on the main axis (<code>flex-start</code>, <code>center</code>, <code>space-between</code>, <code>space-around</code>)</li>
        <li><code>align-items</code>: Aligns items on the cross axis (<code>stretch</code>, <code>center</code>, <code>flex-start</code>)</li>
        <li><code>flex-wrap: wrap</code>: Allows items to wrap to a new row when space runs out</li>
        <li><code>flex: 1</code>: Tells an item to take up all remaining space</li>
        <li><code>gap</code>: Sets spacing between flex items (much cleaner than margins)</li>
      </ul>

      <h2>CSS Grid: The Two-Dimensional Powerhouse</h2>
      <p>CSS Grid was designed for <strong>two-dimensional layouts</strong> — it controls rows AND columns simultaneously. It is the correct tool for the overall page skeleton, complex content grids, and any layout where you need items to align on both axes.</p>

      <h3>When to Use CSS Grid</h3>
      <ul>
        <li><strong>Overall page layout</strong> — header, sidebar, main content, footer</li>
        <li><strong>Responsive card grids</strong> — a 4-column grid that collapses to 2, then 1</li>
        <li><strong>Magazine/editorial layouts</strong> — items spanning multiple columns or rows</li>
        <li><strong>Dashboard widgets</strong> — widgets of different sizes arranged in a precise grid</li>
        <li><strong>Image galleries</strong> — masonry-style or uniform grids</li>
      </ul>

      <pre><code>/* Full page layout with CSS Grid */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main  "
    "footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header;  }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main;    }
.footer  { grid-area: footer;  }

/* Responsive card grid — automatically adjusts columns */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* An item spanning multiple columns */
.featured-card {
  grid-column: span 2;
}</code></pre>

      <h3>The repeat(auto-fill, minmax()) Pattern</h3>
      <p>This single line of CSS Grid code is one of the most powerful responsive layout techniques ever created. It automatically fills the row with as many columns as fit, with each column being at minimum 280px wide. No media queries needed:</p>
      <pre><code>grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
/* On a wide screen: 4 columns
   On a tablet:       2 columns  
   On mobile:         1 column
   — all automatically, no @media queries */</code></pre>

      <h2>The Decision Framework: Grid or Flexbox?</h2>
      <p>Ask yourself this one question: <strong>"Does my layout have both rows AND columns?"</strong></p>
      <ul>
        <li><strong>Yes:</strong> Use CSS Grid. You need two-dimensional control.</li>
        <li><strong>No, just one direction:</strong> Use Flexbox. You only need one-dimensional alignment.</li>
      </ul>
      <p>A quick visual reference:</p>
      <ul>
        <li>Navbar links in a row → <strong>Flexbox</strong></li>
        <li>Course cards in a responsive grid → <strong>CSS Grid</strong></li>
        <li>Centering a modal → <strong>Flexbox</strong></li>
        <li>Full page skeleton (header/sidebar/main/footer) → <strong>CSS Grid</strong></li>
        <li>Button with icon + text → <strong>Flexbox</strong></li>
        <li>Dashboard with mixed widget sizes → <strong>CSS Grid</strong></li>
      </ul>

      <h2>The Expert Approach: Combine Both</h2>
      <p>The secret that senior developers know is that it is never Grid <em>versus</em> Flexbox — it is Grid <em>and</em> Flexbox together. The pattern is:</p>
      <ul>
        <li><strong>CSS Grid</strong> controls the macro layout — the overall page structure with areas</li>
        <li><strong>Flexbox</strong> controls the micro layout — how items align <em>inside</em> each grid cell</li>
      </ul>
      <pre><code>/* Grid handles the page structure */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

/* Flexbox handles alignment inside a grid cell */
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}</code></pre>
      <p>Using them together like this is the correct approach — you are using each tool for what it was designed for.</p>

      <h2>CSS Grid vs Flexbox Browser Support in 2026</h2>
      <p>Both are supported in 100% of modern browsers. CSS Grid (including <code>grid-template-areas</code> and <code>subgrid</code>) has been available in all major browsers since 2022. You can use everything in this guide in production today without any polyfills.</p>

      <h2>Related Learning</h2>
      <p>Now that you understand layout, the next step is adding motion and interactivity. Our <a href="/blog/css-animations-micro-interactions-guide">CSS micro animations guide</a> shows you how to animate your Flexbox and Grid components with CSS transitions. And our <a href="/blog/mastering-html5-semantic-tags-seo">HTML5 semantic tags guide</a> explains the meaningful container elements that Grid and Flexbox should be applied to.</p>
      <p>To practice these in a structured, hands-on environment, check out the free <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro course</a> on SkillValix — complete with exercises and a verifiable certificate.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Is CSS Grid replacing Flexbox?</strong><br/>
      No. They serve different purposes and will likely both exist forever. Grid solves two-dimensional layout problems that Flexbox cannot handle elegantly. Flexbox solves one-dimensional alignment problems with less code than Grid. Both are used extensively on every modern website — including SkillValix.</p>

      <p><strong>Q2: Can I use CSS Grid for all my layouts?</strong><br/>
      Technically yes, but Grid has more syntax overhead for simple one-dimensional cases. Using <code>display: grid; grid-template-columns: repeat(3, 1fr)</code> when <code>display: flex</code> would achieve the same with less code is fighting the tool. Use Flexbox when you only need one axis of control.</p>

      <p><strong>Q3: Which is better for responsive design?</strong><br/>
      Both are excellent for responsive design. CSS Grid's <code>repeat(auto-fill, minmax(280px, 1fr))</code> is the most powerful single responsive layout technique in CSS — no media queries required. Flexbox's <code>flex-wrap: wrap</code> is great for simpler responsive rows. Often the best responsive designs use both.</p>

      <p><strong>Q4: What is CSS Subgrid and should I use it?</strong><br/>
      CSS Subgrid (the <code>subgrid</code> value for <code>grid-template-columns</code>) allows nested grid items to align to the parent grid's columns. It is fully supported in all modern browsers as of 2023 and is extremely useful for card grids where you want inner elements (titles, descriptions, buttons) to align across different-sized cards. Yes, use it.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-12T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 12, 2026",
    readTime: "13 min read",
    wordCount: 1550,
    category: "CSS & Design",
    tags: ["CSS Grid", "Flexbox", "CSS Layout", "Responsive Design", "Web Design", "CSS Tutorial 2026"],
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "CSS code on screen showing grid and flexbox layout examples",
    canonicalUrl: "https://www.skillvalix.com/blog/css-grid-vs-flexbox-modern-web",
    relatedCourse: {
      title: "CSS for Beginners: Learn Web Styling from Zero to Pro",
      slug: "css-for-beginners-learn-web-styling-zero-to-pro",
      description: "Learn Flexbox, Grid, animations and responsive design."
    }
  },
  {
    id: "javascript-dom-manipulation-secrets",
    title: "JavaScript DOM Manipulation Secrets that Pro Developers Use (2026)",
    metaTitle: "JavaScript DOM Manipulation Secrets Pro Developers Use (2026) | SkillValix",
    metaDescription: "Discover the modern, performant techniques to select, traverse, and modify the DOM using vanilla JavaScript in 2026. Learn querySelector, DocumentFragment, event delegation, and MutationObserver — upgrade your JS skills today.",
    keywords: [
      "JavaScript DOM manipulation",
      "DOM tutorial 2026",
      "vanilla JavaScript DOM",
      "querySelector vs getElementById",
      "DocumentFragment JavaScript",
      "event delegation JavaScript",
      "JavaScript performance optimization",
      "MutationObserver JavaScript",
      "modern JavaScript techniques",
      "JavaScript for beginners 2026"
    ],
    excerpt: "Stop relying on older, slower DOM techniques. Discover the modern, performant ways to select, traverse, and modify the Document Object Model using vanilla JavaScript — the techniques senior developers actually use in production.",
    content: `
      <h2>The DOM is Your Playground</h2>
      <p>The Document Object Model (DOM) is the bridge between your HTML and your JavaScript. It is a live, in-memory tree representation of your page — every element, attribute, and text node is an object you can read, modify, or delete with JavaScript. While frameworks like React and Vue abstract the DOM away with virtual diffing, understanding how to manipulate it directly is a foundational skill every developer needs — because frameworks are built on top of it.</p>
      <p>The difference between a junior and a senior JavaScript developer is often not what they know about the language itself — it is how efficiently they interact with the DOM. Let us cover every technique that matters.</p>

      <h2>Selecting Elements: The Modern Way</h2>
      <p>Forget <code>getElementById</code>, <code>getElementsByClassName</code>, and <code>getElementsByTagName</code>. These older APIs return <em>live</em> HTMLCollections and have inconsistent return types. Modern JavaScript uses two methods for everything:</p>

      <h3>querySelector and querySelectorAll</h3>
      <pre><code>// Selects the first matching element (returns a single Element or null)
const activeBtn = document.querySelector('nav button.active');

// Selects ALL matching elements (returns a static NodeList)
const allCards = document.querySelectorAll('.course-card');

// Complex CSS selectors work perfectly
const firstInputInForm = document.querySelector('form:first-of-type input[type="email"]');

// Convert NodeList to Array for full array methods
const cardsArray = Array.from(allCards);
// or
const cardsArray2 = [...allCards];</code></pre>
      <p>The critical insight: <code>querySelectorAll</code> returns a <strong>static</strong> NodeList — it captures the elements at the moment of the call and does not update if elements are added or removed. This is almost always what you want.</p>

      <h3>Traversing the DOM Tree</h3>
      <pre><code>const card = document.querySelector('.course-card');

// Navigate parent/child/sibling relationships
card.parentElement;          // The element's direct parent
card.children;               // Live HTMLCollection of direct children
card.firstElementChild;      // First child element
card.lastElementChild;       // Last child element
card.nextElementSibling;     // Next sibling element
card.previousElementSibling; // Previous sibling element

// Check if an element matches a selector
if (card.matches('.featured')) { /* ... */ }

// Get closest ancestor matching a selector (very useful for event delegation)
const form = inputElement.closest('form');</code></pre>

      <h2>Reading and Writing Content</h2>
      <h3>textContent vs innerHTML vs innerText</h3>
      <p>This is one of the most common sources of bugs and security vulnerabilities in JavaScript:</p>
      <pre><code>const el = document.querySelector('.title');

// ✅ textContent — safest, fastest. Returns/sets ALL text, including hidden elements.
el.textContent = 'New Title';

// ⚠️ innerHTML — parses HTML, so it is slower and a security risk if the 
// content comes from user input (XSS vulnerability!)
el.innerHTML = '<strong>Bold Title</strong>';

// ⚠️ innerText — returns only VISIBLE text, triggers layout reflow. Slow.
// Use textContent unless you need to exclude hidden text.</code></pre>
      <p><strong>Security rule:</strong> Never set <code>innerHTML</code> with content that comes from a user — this is a classic XSS (Cross-Site Scripting) attack vector. Always use <code>textContent</code> for user-provided strings.</p>

      <h2>Modifying Styles and Classes</h2>
      <pre><code>const card = document.querySelector('.card');

// ✅ Use classList methods — cleaner than manipulating className strings
card.classList.add('active');
card.classList.remove('hidden');
card.classList.toggle('expanded');       // Adds if absent, removes if present
card.classList.replace('old', 'new');
card.classList.contains('active');       // Returns boolean

// Add inline styles (only when dynamic values require it)
card.style.transform = 'translateY(-8px)';
card.style.setProperty('--card-color', '#4f46e5'); // Set CSS custom property

// Read computed styles (what the browser actually renders)
const styles = getComputedStyle(card);
console.log(styles.fontSize); // '16px'</code></pre>

      <h2>Efficient DOM Updates: The DocumentFragment Pattern</h2>
      <p>Directly modifying the live DOM is the most expensive operation in JavaScript. Every insertion triggers the browser to recalculate layout (reflow) and repaint the screen. If you insert 50 elements one by one in a loop, you trigger 50 reflows. The solution is <code>DocumentFragment</code>:</p>
      <pre><code>// ❌ Bad — 50 reflows
const list = document.querySelector('#course-list');
courses.forEach(course => {
  const li = document.createElement('li');
  li.textContent = course.title;
  list.appendChild(li); // Reflow on every call!
});

// ✅ Good — exactly 1 reflow
const list = document.querySelector('#course-list');
const fragment = document.createDocumentFragment();

courses.forEach(course => {
  const li = document.createElement('li');
  li.textContent = course.title;
  fragment.appendChild(li); // No reflow — fragment is NOT in the live DOM
});

list.appendChild(fragment); // One reflow total</code></pre>
      <p>For even better performance when inserting large amounts of HTML, use <code>insertAdjacentHTML</code> — it is faster than <code>innerHTML</code> because it does not destroy and recreate existing DOM:</p>
      <pre><code>// Insert HTML without destroying existing content
list.insertAdjacentHTML('beforeend', '<li>New Course</li>');
// Positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'</code></pre>

      <h2>Event Handling: The Right Way</h2>

      <h3>addEventListener vs onclick</h3>
      <pre><code>// ❌ Old way — onclick property (only one handler per element)
button.onclick = handleClick;

// ✅ Modern way — addEventListener (multiple handlers, more control)
button.addEventListener('click', handleClick);
button.addEventListener('click', handleAnalytics); // Both will fire

// Remove a listener (must pass the same function reference)
button.removeEventListener('click', handleClick);

// One-time listener (auto-removes after first trigger)
button.addEventListener('click', handleClick, { once: true });</code></pre>

      <h3>Event Delegation: The Performance Superpower</h3>
      <p>Event delegation is the single most impactful DOM performance pattern. Instead of attaching individual listeners to each item in a list (which wastes memory and does not work for dynamically added items), you attach ONE listener to a parent element and use the event object to determine what was clicked:</p>
      <pre><code>// ❌ Bad — 100 listeners for 100 items, and new items won't work
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('click', () => { /* ... */ });
});

// ✅ Good — 1 listener handles all cards, including future ones
const grid = document.querySelector('.courses-grid');

grid.addEventListener('click', (event) => {
  // Find the closest .course-card ancestor of the clicked element
  const card = event.target.closest('.course-card');
  if (!card) return; // Click was outside a card

  const courseId = card.dataset.courseId;
  navigateToCourse(courseId);
});</code></pre>
      <p>Event delegation works because of <strong>event bubbling</strong>: events fire on the target element and then "bubble up" through every ancestor element. A click on a button fires on the button, then the card, then the grid, then the body, then the document.</p>

      <h2>Watching DOM Changes: MutationObserver</h2>
      <p>Sometimes you need to react when the DOM changes — for example, when a third-party script adds an element, or when a framework renders content asynchronously. <code>MutationObserver</code> is the modern API for this:</p>
      <pre><code>const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Check for added nodes
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.matches('.notification')) {
        handleNewNotification(node);
      }
    });
  });
});

// Start observing a target element
observer.observe(document.body, {
  childList: true,  // Watch for added/removed children
  subtree: true,    // Watch all descendants
});

// Stop when done (important for memory management!)
observer.disconnect();</code></pre>

      <h2>Async DOM Patterns: Intersection Observer</h2>
      <p>The <code>IntersectionObserver</code> API lets you efficiently detect when an element enters or leaves the viewport — without any scroll event listeners (which are expensive):</p>
      <pre><code>// Lazy load images — only fetch when they enter the viewport
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Load the real image
      imageObserver.unobserve(img); // Stop watching once loaded
    }
  });
}, { rootMargin: '200px' }); // Start loading 200px before visible

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});</code></pre>

      <h2>The complete DOM API Cheat Sheet</h2>
      <ul>
        <li><strong>Select one:</strong> <code>document.querySelector(selector)</code></li>
        <li><strong>Select all:</strong> <code>document.querySelectorAll(selector)</code></li>
        <li><strong>Create:</strong> <code>document.createElement('div')</code></li>
        <li><strong>Append:</strong> <code>parent.appendChild(el)</code> or <code>parent.append(el, text)</code></li>
        <li><strong>Remove:</strong> <code>el.remove()</code></li>
        <li><strong>Replace:</strong> <code>parent.replaceChild(newEl, oldEl)</code></li>
        <li><strong>Clone:</strong> <code>el.cloneNode(true)</code> (deep clone)</li>
        <li><strong>Get attribute:</strong> <code>el.getAttribute('href')</code></li>
        <li><strong>Set attribute:</strong> <code>el.setAttribute('data-id', '42')</code></li>
        <li><strong>Data attributes:</strong> <code>el.dataset.courseId</code> (reads <code>data-course-id</code>)</li>
      </ul>

      <h2>Related Learning</h2>
      <p>DOM manipulation works best when you understand the HTML structure underneath it. Read our <a href="/blog/mastering-html5-semantic-tags-seo">HTML5 semantic tags guide</a> to understand what you are selecting, and our <a href="/blog/css-animations-micro-interactions-guide">CSS micro animations guide</a> to learn how to trigger CSS animations from JavaScript using <code>classList</code>.</p>
      <p>To master JavaScript from scratch — variables, functions, closures, async/await, and DOM manipulation — enrol in the completely free <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a> on SkillValix. It ends with a verifiable certificate you can attach to your LinkedIn profile.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Should I still learn DOM manipulation if I use React?</strong><br/>
      Absolutely. React's virtual DOM is an abstraction built on top of real DOM APIs. When you face a problem React can't solve cleanly — integrating a third-party library, manipulating a canvas, or optimising a critical rendering path — you need direct DOM knowledge. Senior React developers reach for the DOM regularly.</p>

      <p><strong>Q2: What is the difference between getElementById and querySelector?</strong><br/>
      <code>getElementById</code> is marginally faster for ID lookups because it has a dedicated internal index. But <code>querySelector</code> is far more flexible (it accepts any CSS selector), returns <code>null</code> instead of <code>undefined</code> for missing elements, and has a consistent API with <code>querySelectorAll</code>. In 2026, use <code>querySelector</code> exclusively unless you need the absolute maximum performance in a tight loop.</p>

      <p><strong>Q3: Is innerHTML safe to use?</strong><br/>
      Only if the HTML content is entirely under your control. If any part of the HTML string comes from user input (a search term, a form field, a URL parameter), you must sanitise it first using the <code>DOMPurify</code> library or use <code>textContent</code> instead. Setting raw user input via <code>innerHTML</code> is a textbook XSS vulnerability.</p>

      <p><strong>Q4: What is event.stopPropagation() and when should I use it?</strong><br/>
      <code>event.stopPropagation()</code> stops the event from bubbling up to parent elements. Use it sparingly — it can break event delegation patterns and make debugging difficult. The only valid case is when you genuinely need to prevent a parent handler from firing for a specific child interaction, like a delete button inside a clickable card.</p>
    `,
    author: "Amit Patel",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-08T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 08, 2026",
    readTime: "14 min read",
    wordCount: 1620,
    category: "JavaScript",
    tags: ["JavaScript DOM", "Vanilla JavaScript", "Web Performance", "Frontend Development", "JavaScript Tutorial 2026", "Event Delegation"],
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "JavaScript code on a dark editor screen showing DOM manipulation techniques",
    canonicalUrl: "https://www.skillvalix.com/blog/javascript-dom-manipulation-secrets",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Master Vanilla JS, DOM manipulation, closures, async/await and more — free with a verifiable certificate."
    }
  },
  {
    id: "python-beginner-mistakes-to-avoid",
    title: "10 Python Mistakes Every Beginner Makes (And How to Fix Them)",
    metaTitle: "10 Python Mistakes Every Beginner Makes & How to Fix Them (2026) | SkillValix",
    metaDescription: "Avoid the most common Python beginner mistakes in 2026. From mutable default arguments to bare exceptions — learn how to write clean, Pythonic code from day one.",
    keywords: [
      "Python beginner mistakes",
      "Python tips 2026",
      "Python tutorial for beginners",
      "Pythonic code",
      "Python best practices",
      "Python list comprehension",
      "Python context manager",
      "learn Python"
    ],
    excerpt: "Writing Python code is easy — writing it correctly is another story. Avoid these common beginner pitfalls and instantly level up your Python skills with clean, professional habits.",
    content: `
      <h2>Python Looks Easy — Until It Isn't</h2>
      <p>Python is famous for its beginner-friendly syntax. But that simplicity can be deceiving. Many beginners pick up bad habits early that cause hard-to-debug bugs later. Let's fix them right now.</p>

      <h3>1. Using == to Compare Instead of is</h3>
      <p>Beginners often use <code>==</code> to check if a variable is <code>None</code>, <code>True</code>, or <code>False</code>. The correct and Pythonic way is to use <code>is</code> for identity checks.</p>
      <pre><code># ❌ Wrong
if result == None:
    print("No result")

# ✅ Correct
if result is None:
    print("No result")</code></pre>

      <h3>2. Mutable Default Arguments in Functions</h3>
      <p>This is one of Python's most notorious traps. Never use a mutable object like a list or dictionary as a default parameter value. It is created once and shared across all calls to the function.</p>
      <pre><code># ❌ Wrong — the same list persists across calls!
def add_item(item, cart=[]):
    cart.append(item)
    return cart

# ✅ Correct — use None as default, create inside
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart</code></pre>

      <h3>3. Not Using List Comprehensions</h3>
      <p>A traditional loop to build a list is verbose and slow. Python's list comprehensions are not just shorter — they are also faster under the hood because they are optimised at the interpreter level.</p>
      <pre><code># ❌ Verbose way
squares = []
for i in range(1, 11):
    squares.append(i ** 2)

# ✅ Pythonic way — list comprehension
squares = [i ** 2 for i in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]</code></pre>

      <h3>4. Catching Bare Exceptions</h3>
      <p>Writing <code>except:</code> with no exception type silently swallows every error — including keyboard interrupts and system exits. Always specify which exception you expect.</p>
      <pre><code># ❌ Wrong — catches literally everything
try:
    result = 10 / 0
except:
    print("Something went wrong")

# ✅ Correct — specific and informative
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Math error: {e}")</code></pre>

      <h3>5. Opening Files Without a Context Manager</h3>
      <p>Forgetting to close a file leads to memory leaks and data corruption. Always use <code>with open()</code> — it guarantees the file is closed automatically, even if an error occurs inside the block.</p>
      <pre><code># ❌ Wrong — what if an error occurs before file.close()?
file = open("data.txt", "r")
content = file.read()
file.close()

# ✅ Correct — auto-closes no matter what
with open("data.txt", "r") as file:
    content = file.read()</code></pre>

      <h3>Bonus: Use enumerate() Instead of range(len())</h3>
      <p>When you need both the index and the value while looping over a list, avoid the clunky <code>range(len(...))</code> pattern. Python's built-in <code>enumerate()</code> is cleaner and more readable.</p>
      <pre><code># ❌ Ugly way
fruits = ["Apple", "Banana", "Mango"]
for i in range(len(fruits)):
    print(i, fruits[i])

# ✅ Pythonic way
for i, fruit in enumerate(fruits):
    print(i, fruit)</code></pre>

      <h2>Write Python the Way Python Was Meant to Be Written</h2>
      <p>These fixes are not just cosmetic. They improve performance, prevent bugs, and make your code far easier for other developers (and your future self) to read and maintain. The Python community calls this writing <strong>Pythonic</strong> code — clean, expressive, and idiomatic.</p>
      <p>To build these habits from day one, start the free <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass</a> on SkillValix. Begin with <a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e01">Lesson 1: Welcome to Python</a> and follow through to <a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e05">Lesson 5: Functions — Reusable Code Blocks</a> where default argument pitfalls (mistake #2 above) are covered in depth. The course ends with a verifiable certificate you can add to your LinkedIn and resume.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: What is the most dangerous Python mistake in this list?</strong><br/>
      Mutable default arguments (Mistake #2). Unlike the other mistakes which simply produce wrong output, mutable defaults cause shared state between function calls — bugs that are extremely hard to reproduce and diagnose because the function works correctly on the first call and fails on subsequent ones. This specific mistake has been responsible for production bugs at major companies.</p>

      <p><strong>Q2: Should I use list comprehensions everywhere?</strong><br/>
      Use them when they make the code clearly readable — which is most of the time for simple transformations. However, if a comprehension becomes too nested or complex to read in one glance, a traditional loop is better. Python's philosophy is: readability counts. If a comprehension requires 5 seconds to parse, it has failed.</p>

      <p><strong>Q3: Are these mistakes relevant to Python 3.11+?</strong><br/>
      Yes. Python 3.11 and later versions improved error messages and performance, but the language-level patterns remain identical. Using <code>is None</code> instead of <code>== None</code>, avoiding bare except, and using context managers are timeless Python best practices that apply to every version from 3.8 to 3.13+.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-17T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 17, 2026",
    readTime: "10 min read",
    wordCount: 820,
    category: "Python",
    tags: ["Python", "Python Tips", "Beginner Python", "Clean Code", "Pythonic Code", "Python Best Practices", "Programming"],
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Python code on a laptop screen with a dark theme",
    canonicalUrl: "https://www.skillvalix.com/blog/python-beginner-mistakes-to-avoid",
    relatedCourse: {
      title: "Python Basics",
      slug: "ultimate-python-masterclass",
      description: "Master Python from scratch — variables, loops, functions, OOP and more."
    }
  },
  {
    id: "java-beginner-mistakes-to-avoid",
    title: "10 Java Mistakes Every Beginner Makes (And How to Fix Them)",
    metaTitle: "10 Java Mistakes Every Beginner Makes & How to Fix Them (2026) | SkillValix",
    metaDescription: "Avoid the most common Java beginner mistakes in 2026. From NullPointerException to ignoring access modifiers — learn how to write clean, professional Java code from day one.",
    keywords: [
      "Java beginner mistakes",
      "Java tips 2026",
      "Java tutorial for beginners",
      "Java best practices",
      "Java common errors",
      "Java NullPointerException fix",
      "Java OOP tips",
      "learn Java programming",
      "Java clean code",
      "Java interview tips"
    ],
    excerpt: "Java is one of the most powerful languages in the world — but beginners fall into the same traps every time. Fix these 10 Java mistakes right now and write code that actually works in production.",
    content: `
      <h2>Java Is Powerful — But It Punishes Bad Habits</h2>
      <p>Java is famous for being strict and verbose. That strictness is actually a feature — it forces you to think. But beginners still manage to write Java that compiles fine yet behaves horribly at runtime. Let's fix the 10 most common mistakes right now.</p>

      <h3>1. Using == to Compare Strings</h3>
      <p>This is the #1 Java beginner mistake. The <code>==</code> operator checks if two variables point to the <em>same object in memory</em> — not whether their content is equal. For Strings, always use <code>.equals()</code>.</p>
      <pre><code>// ❌ Wrong — compares memory references, not content
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b); // false 😱

// ✅ Correct — compares actual string content
System.out.println(a.equals(b)); // true ✅

// ✅ Extra safe — avoids NullPointerException
System.out.println("hello".equals(a)); // true ✅</code></pre>

      <h3>2. Not Handling NullPointerException (NPE)</h3>
      <p>NullPointerException is the most common Java runtime crash. It happens when you call a method on a variable that holds <code>null</code>. Always check for null or use the <code>Optional</code> class introduced in Java 8.</p>
      <pre><code>// ❌ Wrong — crashes if getName() returns null
String name = user.getName();
System.out.println(name.toUpperCase()); // 💥 NPE!

// ✅ Correct — null check first
String name = user.getName();
if (name != null) {
    System.out.println(name.toUpperCase());
}

// ✅ Modern way — use Optional (Java 8+)
Optional.ofNullable(user.getName())
        .map(String::toUpperCase)
        .ifPresent(System.out::println);</code></pre>

      <h3>3. Ignoring Access Modifiers</h3>
      <p>Beginners make every field <code>public</code> for convenience — breaking encapsulation. Making fields public means any class can change them directly, bypassing validation logic and causing unpredictable bugs.</p>
      <pre><code>// ❌ Wrong — anyone can set a negative age!
public class Person {
    public int age;
}
Person p = new Person();
p.age = -999; // Nothing stops this 😱

// ✅ Correct — private field + validated setter
public class Person {
    private int age;

    public int getAge() { return age; }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) this.age = age;
        else throw new IllegalArgumentException("Invalid age!");
    }
}</code></pre>

      <h3>4. Using Raw Types Instead of Generics</h3>
      <p>Raw types like <code>ArrayList</code> without a type parameter were the old Java way. They cause <code>ClassCastException</code> at runtime and lose all compiler type-safety. Always specify the generic type.</p>
      <pre><code>// ❌ Wrong — raw type loses type safety
ArrayList list = new ArrayList();
list.add("hello");
list.add(42); // No error at compile time!
String s = (String) list.get(1); // 💥 ClassCastException at runtime!

// ✅ Correct — generic type enforced at compile time
ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("hello");
// list.add(42); // ✅ Compiler catches this immediately!</code></pre>

      <h3>5. Catching Generic Exception</h3>
      <p>Catching <code>Exception</code> or <code>Throwable</code> at the top level silently swallows every error — including <code>OutOfMemoryError</code> and <code>StackOverflowError</code>. Always catch the most specific exception possible.</p>
      <pre><code>// ❌ Wrong — hides the real problem completely
try {
    int result = Integer.parseInt(input);
} catch (Exception e) {
    System.out.println("Error");
}

// ✅ Correct — catch specific, log the cause
try {
    int result = Integer.parseInt(input);
} catch (NumberFormatException e) {
    System.out.println("Invalid number: " + e.getMessage());
}</code></pre>

      <h3>6. Not Closing Resources (Memory Leaks)</h3>
      <p>File streams, database connections, and network sockets must be closed after use. If an exception occurs before <code>close()</code>, you leak resources. Use <strong>try-with-resources</strong> (Java 7+) — it auto-closes everything.</p>
      <pre><code>// ❌ Wrong — connection may never close on error!
Connection conn = DriverManager.getConnection(url);
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users");
// ... if exception here, conn never closes 😱

// ✅ Correct — try-with-resources auto-closes all
try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
    while (rs.next()) {
        System.out.println(rs.getString("name"));
    }
} // All auto-closed, even on exception ✅</code></pre>

      <h3>7. Concatenating Strings in Loops</h3>
      <p>Strings in Java are <strong>immutable</strong>. Every time you use <code>+</code> inside a loop, Java creates a brand new String object in memory — this is O(n²) performance and causes massive memory pressure. Use <code>StringBuilder</code> instead.</p>
      <pre><code>// ❌ Wrong — creates 1000 temporary String objects!
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i + ", "; // New object every iteration 😱
}

// ✅ Correct — StringBuilder modifies in-place
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String result = sb.toString(); // One final String ✅</code></pre>

      <h3>8. Using int Instead of long for Large Numbers</h3>
      <p>Java's <code>int</code> holds a maximum value of ~2.1 billion (2,147,483,647). Many beginners use <code>int</code> for calculations involving large numbers — like milliseconds, factorials, or population counts — causing silent <strong>integer overflow</strong> with no error or warning.</p>
      <pre><code>// ❌ Wrong — int overflows silently!
int millisInYear = 365 * 24 * 60 * 60 * 1000;
System.out.println(millisInYear); // 1471228928 😱 WRONG!

// ✅ Correct — use long for large values
long millisInYear = 365L * 24 * 60 * 60 * 1000;
System.out.println(millisInYear); // 31536000000 ✅</code></pre>

      <h3>9. Not Overriding equals() and hashCode() Together</h3>
      <p>When you store custom objects in a <code>HashMap</code> or <code>HashSet</code>, Java uses <code>equals()</code> and <code>hashCode()</code> to find them. If you override one but not the other, your collection will silently behave incorrectly — objects you stored will mysteriously "disappear".</p>
      <pre><code>// ❌ Wrong — overrides equals but not hashCode
public class Student {
    int rollNo;
    @Override
    public boolean equals(Object o) {
        return ((Student) o).rollNo == this.rollNo;
    }
    // Missing hashCode! HashMap will break 😱
}

// ✅ Correct — always override BOTH together
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Student)) return false;
    return this.rollNo == ((Student) o).rollNo;
}

@Override
public int hashCode() {
    return Objects.hash(rollNo); // ✅ Consistent with equals
}</code></pre>

      <h3>10. Writing God Classes (Violating Single Responsibility)</h3>
      <p>Beginners dump everything into one giant class — database logic, UI logic, business logic, file handling. This violates the <strong>Single Responsibility Principle (SRP)</strong>: a class should have one reason to change. God classes become impossible to test, debug, or extend.</p>
      <pre><code>// ❌ Wrong — one class does EVERYTHING
public class StudentApp {
    void connectDatabase() { /* DB logic */ }
    void validateInput()   { /* Validation */ }
    void saveToDatabase()  { /* Save */ }
    void sendEmail()       { /* Email */ }
    void renderUI()        { /* Display */ }
    // 500 more lines... 😱
}

// ✅ Correct — each class has ONE job
public class DatabaseService  { void connect() { } }
public class StudentValidator  { boolean validate(Student s) { } }
public class StudentRepository { void save(Student s) { } }
public class EmailService      { void send(String to) { } }</code></pre>

      <h3>Bonus: Use Enhanced for Loop Instead of Index Loop</h3>
      <p>When you don't need the index, avoid the verbose <code>for (int i = 0; i < list.size(); i++)</code> pattern. The enhanced for-each loop is cleaner, less error-prone (no off-by-one errors), and expresses intent clearly.</p>
      <pre><code>// ❌ Verbose — index not even needed here
List&lt;String&gt; names = List.of("Alice", "Bob", "Charlie");
for (int i = 0; i < names.size(); i++) {
    System.out.println(names.get(i));
}

// ✅ Cleaner — enhanced for-each
for (String name : names) {
    System.out.println(name);
}

// ✅ Even cleaner — Java 8 forEach + lambda
names.forEach(System.out::println);</code></pre>

      <h2>Write Java the Way Professionals Write It</h2>
      <p>These mistakes are not random — they are the exact patterns that show up in code reviews at every company. Fixing them now means fewer bugs, faster performance, and code that your team will actually respect. Java rewards discipline. Start writing it that way.</p>
      <p>To master Java from the ground up — including all 10 of these patterns taught in depth with live coding — start with <a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea0">Lesson 1: Welcome to Java</a> on the free <a href="/courses/ultimate-java-masterclass">Ultimate Java Masterclass</a>. When you are confident with the basics, study OOP encapsulation in <a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea2">Lesson 3: Variables &amp; Data Types</a> and control flow (including the enhanced for-each loop) in <a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea4">Lesson 5: Control Flow</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Which is the most critical Java mistake to fix first?</strong><br/>
      Using <code>==</code> to compare Strings. It causes bugs that are invisible at compile time and extremely confusing at runtime. Every Java developer must know that String equality requires <code>.equals()</code> — learn this on day one.</p>

      <p><strong>Q2: Do these mistakes apply to modern Java (17, 21, 22)?</strong><br/>
      Yes. While modern Java has added records, sealed classes, and pattern matching, the fundamental OOP and exception-handling mistakes in this list apply to all Java versions. String comparison with <code>==</code>, NPE handling, and resource leaks are language-level concerns that transcend version updates.</p>

      <p><strong>Q3: How can I practice avoiding these mistakes?</strong><br/>
      Code review is the best teacher. After writing any Java code, go through this list as a checklist. Better yet, set up SonarQube or IntelliJ's inspection warnings — they flag most of these mistakes automatically. And enroll in the <a href="/courses/ultimate-java-masterclass">Ultimate Java Masterclass</a> for structured, mentor-level guidance.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-23T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 23, 2026",
    readTime: "12 min read",
    wordCount: 1050,
    category: "Java",
    tags: ["Java", "Java Tips", "Beginner Java", "Clean Code", "OOP", "Java Interview", "Java Mistakes", "Programming"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Java code on a laptop screen with a dark editor theme showing OOP concepts",
    canonicalUrl: "https://www.skillvalix.com/blog/java-beginner-mistakes-to-avoid",
    relatedCourse: {
      title: "The Ultimate Java Masterclass: From Beginner to Advanced",
      slug: "ultimate-java-masterclass",
      description: "Master Java from scratch — variables, OOP, collections, multithreading, JDBC and more. Zero to job-ready."
    }
  },
  {
    id: "why-learn-ai-machine-learning-2026",
    title: "Why 2026 is the Best Year to Learn AI & Machine Learning",
    metaTitle: "Why Learn AI & Machine Learning in 2026 | SkillValix Blog",
    metaDescription: "Artificial Intelligence is no longer just a buzzword—it is the driving force behind modern software. Discover why every developer must learn AI and Machine Learning in 2026.",
    keywords: [
      "Learn AI",
      "Machine Learning for Beginners",
      "Artificial Intelligence 2026",
      "Python for AI",
      "AI career",
      "Machine learning tutorial",
      "AI course online"
    ],
    excerpt: "From ChatGPT to self-driving cars, AI is reshaping the world. Find out why 2026 is the ultimate year to start your Artificial Intelligence and Machine Learning journey.",
    content: `
      <h2>The AI Revolution is No Longer Future — It Is Now</h2>
      <p>A few years ago, Artificial Intelligence was a specialised niche reserved for PhDs and research labs. Today, it is baked into every product you use — from the search results you see, to the emails your inbox filters, to the code your IDE auto-completes. AI is not coming. It is here. The only question left is: are you on the building side or the using side?</p>
      <p>This guide explains exactly why 2026 is the most important year yet to learn AI and Machine Learning, what skills you need, and how to learn them in the most efficient way possible — for free.</p>

      <h2>Why 2026 is the Year That Matters</h2>

      <h3>1. The AI Talent Supply Crisis</h3>
      <p>LinkedIn's 2026 Emerging Jobs Report ranks AI/ML Engineering as the #1 fastest-growing technical role globally. The demand has grown 74% year-over-year, but the supply of qualified developers has grown at only 22%. This gap means that developers who can work with AI models — training, fine-tuning, deploying, and integrating them — command salaries 40-60% above equivalent software engineering roles.</p>
      <p>In India specifically, tier-1 tech companies are actively hiring for roles that combine Python programming skills with machine learning expertise. If you can demonstrate both, you are in the top 5% of applicants for these positions.</p>

      <h3>2. Generative AI Has Changed What "AI Skills" Means</h3>
      <p>Before 2023, "AI skills" meant researching novel architectures and publishing papers. In 2026, it means being able to:</p>
      <ul>
        <li>Integrate LLM APIs (OpenAI, Anthropic, Google Gemini) into web and mobile applications</li>
        <li>Fine-tune pre-trained models on specific datasets</li>
        <li>Build RAG (Retrieval-Augmented Generation) systems that combine databases with language models</li>
        <li>Understand model evaluation, bias detection, and responsible AI deployment</li>
        <li>Use AI-powered developer tools (GitHub Copilot, Cursor) to 3x your own coding speed</li>
      </ul>
      <p>These are practical, job-applicable skills — not academic research. And they are learnable in weeks, not years.</p>

      <h3>3. Python Has Made AI Accessible to Every Developer</h3>
      <p>The Python ecosystem has made machine learning radically accessible. You can train your first classification model in 15 lines of Scikit-Learn. You can build a neural network in 30 lines of PyTorch. The mathematical complexity still exists — but libraries abstract it into clean, readable functions that any developer with Python basics can use.</p>
      <p>Start with <a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e01">Lesson 1 of the Python Masterclass</a> to build your foundation, then move to AI. You can learn the core Python you need for machine learning in under 4 weeks.</p>

      <h2>The AI Learning Roadmap for 2026</h2>
      <p>Here is the exact sequence to go from zero to AI-ready:</p>

      <h3>Stage 1: Python Fundamentals (Weeks 1–3)</h3>
      <p>Every AI library is Python-first. Before touching TensorFlow or PyTorch, you need solid Python — variables, functions, loops, list comprehensions, classes, and file I/O. Our free <a href="/courses/ultimate-python-masterclass">Python Masterclass</a> covers all of this. Key lessons to focus on:</p>
      <ul>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e02">Variables &amp; Data Types</a> — NumPy arrays are just enhanced Python lists</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e05">Functions: Reusable Code Blocks</a> — all ML pipelines are built on functions</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e04">Loops: for &amp; while</a> — training loops are literally just loops over data batches</li>
      </ul>

      <h3>Stage 2: AI & Machine Learning Fundamentals (Weeks 4–8)</h3>
      <p>Once you have Python, start with the conceptual foundations of AI. You need to understand what a model is, how training works, what loss functions do, and why gradient descent is the core algorithm behind almost all modern AI. Our free <a href="/courses/basics-of-artificial-intelligence-beginners">AI &amp; Machine Learning Fundamentals course</a> covers this ground-up:</p>
      <ul>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666201">Lesson 1: What is Artificial Intelligence?</a> — the taxonomy of AI, ML, and Deep Learning</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666204">Lesson 4: What is Machine Learning?</a> — supervised vs unsupervised vs reinforcement learning</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666205">Lesson 5: Neural Networks &amp; Deep Learning</a> — the architecture powering ChatGPT, image recognition, and more</li>
      </ul>

      <h3>Stage 3: Practical AI Projects (Weeks 9–12)</h3>
      <p>Theory without projects is worthless in AI interviews. Build these three projects:</p>
      <ul>
        <li><strong>Sentiment classifier:</strong> Train a model on tweet data to predict positive/negative sentiment using Scikit-Learn's Naive Bayes</li>
        <li><strong>Image classifier:</strong> Use a pre-trained ResNet model (transfer learning) to classify your own image dataset with PyTorch</li>
        <li><strong>LLM-powered chatbot:</strong> Build a simple RAG chatbot using OpenAI's API and a vector database like ChromaDB</li>
      </ul>
      <p>All three are portfolio-worthy. Host them on GitHub with detailed README files and they become your AI credentials — more valuable than most certificates.</p>

      <h2>AI Career Paths in 2026</h2>
      <p>Contrary to popular belief, "AI developer" is not one job. Here are the distinct career tracks and what each requires:</p>
      <ul>
        <li><strong>ML Engineer:</strong> Trains, evaluates, and deploys ML models at scale. Needs Python, statistics, and cloud platforms (AWS SageMaker, GCP Vertex). High demand, highest salaries.</li>
        <li><strong>AI Application Developer:</strong> Integrates LLM APIs and builds AI-powered products. Needs Python or JavaScript + API integration skills. Fastest-growing segment in 2026.</li>
        <li><strong>Data Scientist:</strong> Analyses data and builds predictive models. Needs Python, pandas, SQL, statistics, and business insight. Large overlap with ML engineering.</li>
        <li><strong>Prompt Engineer:</strong> Designs and optimises prompts for LLMs. Lower barriers to entry, but competitive. Best as a complementary skill.</li>
      </ul>

      <h2>The One Reason Developers Fail to Learn AI</h2>
      <p>The number one reason developers abandon AI learning is starting with the mathematics. They open a textbook on linear algebra, hit matrix multiplication, panic, and quit. The correct order is the reverse: <strong>start with code, understand concepts, then optionally deepen the math</strong>. Build a working model first. The intuition for why it works will come from watching it train and fail and improve. The math explains the intuition — it does not precede it.</p>

      <h2>Related Resources on SkillValix</h2>
      <p>AI builds on a solid programming foundation. If you are not yet comfortable with Python, start with <a href="/blog/python-beginner-mistakes-to-avoid">our Python mistakes guide</a> to build correct habits from day one. And for a look at the AI tools that working developers use daily, read our <a href="/blog/ai-tools-every-developer-should-use-2026">10 AI Tools Every Developer Must Use in 2026</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Do I need to know math to learn AI?</strong><br/>
      Not initially. The libraries handle the math. You will be far more effective if you understand concepts like gradient descent, loss functions, and regularisation intuitively — but you do not need to derive them from scratch. Build first. Math second.</p>

      <p><strong>Q2: How long does it take to learn Machine Learning?</strong><br/>
      With consistent daily study (2 hours/day), you can build your first working ML project in 4–6 weeks. To reach a job-ready level for an ML Engineer position at a tech company, expect 4–8 months of focused learning and project building. Speed varies enormously based on prior programming experience.</p>

      <p><strong>Q3: Should I start with TensorFlow or PyTorch?</strong><br/>
      Start with Scikit-Learn for classical ML (regression, classification, clustering). Once you are comfortable with model training concepts, move to PyTorch for deep learning — it has overtaken TensorFlow as the dominant framework in both research and production as of 2025.</p>

      <p><strong>Q4: Is AI going to replace programmers?</strong><br/>
      AI is replacing specific tasks, not the role of programmer. In 2026, AI tools write boilerplate, suggest code, find bugs, and generate tests. Programmers who use these tools are dramatically more productive than those who do not. The programmers most at risk are those who do repetitive, low-complexity coding — exactly the work AI tools handle. Learning AI makes you the developer who builds those tools, not the one replaced by them.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-26T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 26, 2026",
    readTime: "13 min read",
    wordCount: 1480,
    category: "AI & Data Science",
    tags: ["Artificial Intelligence", "Machine Learning", "Python for AI", "Data Science", "AI Career 2026", "Deep Learning", "Technology"],
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Futuristic AI neural network concept with glowing connections",
    canonicalUrl: "https://www.skillvalix.com/blog/why-learn-ai-machine-learning-2026",
    relatedCourse: {
      title: "Artificial Intelligence & Machine Learning Fundamentals",
      slug: "basics-of-artificial-intelligence-beginners",
      description: "Master Python, Machine Learning algorithms, and Neural Networks from scratch."
    }
  },
  {
    id: "top-skills-students-learn-online-free",
    title: "Top Skills Students Can Learn Online (With Free Resources)",
    metaTitle: "Top Skills Students Can Learn Online (With Free Resources) | SkillValix",
    metaDescription: "Discover the most in-demand technical skills students can learn online for free in 2026. From HTML and Python to AI, accelerate your career with SkillValix.",
    keywords: [
      "top skills to learn online",
      "free coding courses",
      "learn HTML online",
      "Python for beginners",
      "Java course free",
      "learn AI online",
      "web development students",
      "free programming resources",
      "SkillValix"
    ],
    excerpt: "Whether you are in high school or college, learning technical skills online has never been easier. Discover the top free skills that will guarantee you a future-proof career.",
    content: `
      <h2>The Best Investment You Can Make as a Student</h2>
      <p>The modern job market does not care about your age; it cares about what you can build. With the rise of accessible online platforms, students anywhere in the world can now master industry-standard technical skills for absolutely free. The question is no longer "can I afford to learn?" — it is "what should I learn first?"</p>
      <p>This guide gives you the answer. Here are the five highest-ROI technical skills for students in 2026, in the order you should learn them, with specific starting lessons for each.</p>

      <h3>1. HTML &amp; CSS: The Mandatory Foundation</h3>
      <p>Every website on the internet is built on HTML and CSS. HTML provides the structure; CSS provides the styling. These are the non-negotiable entry point into the world of tech. Even if you eventually specialise in backend development, data science, or AI — knowing how to build and style a frontend gives you a massive advantage in understanding full-stack systems.</p>
      <p><strong>What you will build:</strong> Portfolio pages, landing pages, blog layouts, responsive multi-page websites.</p>
      <p><strong>Time to job-ready basics:</strong> 4–6 weeks with daily practice.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d8f">Lesson 1: Welcome to Web Development</a> — understand how browsers render HTML</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d90">Lesson 2: Your Very First HTML File</a> — write your first webpage from scratch</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c661">CSS Lesson 1: Welcome to CSS!</a> — start styling immediately</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c664">CSS Lesson 4: The CSS Box Model</a> — the layout concept every developer must understand</li>
      </ul>
      <p><strong>Free Courses:</strong> <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> and <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro</a></p>

      <h3>2. JavaScript: From Static to Interactive</h3>
      <p>JavaScript is what turns a static page into a living application. It handles user interactions, fetches data from APIs, validates forms, and powers everything from simple carousels to full-blown single-page applications. In 2026, JavaScript is also the language of Node.js (backend), React (frontend framework), and even React Native (mobile). Mastering it opens four career paths simultaneously.</p>
      <p><strong>What you will build:</strong> Interactive UIs, API-connected apps, form validation, dynamic content rendering.</p>
      <p><strong>Time to job-ready basics:</strong> 6–8 weeks after HTML/CSS.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a68">JS Lesson 1: Welcome to JavaScript!</a> — understand where JS runs and why</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a69">JS Lesson 2: Variables: Storing Data</a> — <code>let</code>, <code>const</code>, and <code>var</code> explained clearly</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a6c">JS Lesson 5: Conditionals: Making Decisions</a> — the logic that powers every interactive feature</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a></p>

      <h3>3. Python: The Most Versatile Language</h3>
      <p>Python is the language of data science, machine learning, backend development, automation, and scripting. Its beginner-friendly syntax (English-like, no semicolons, no type declarations) makes it the ideal second language for students who have learned JavaScript, or the ideal first language for those coming from a non-web background.</p>
      <p><strong>What you will build:</strong> Automation scripts, data analysis notebooks, REST APIs with Flask/FastAPI, ML models.</p>
      <p><strong>Time to job-ready basics:</strong> 4–6 weeks.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e01">Python Lesson 1: Welcome to Python</a> — why Python and how to set up your environment</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e03">Python Lesson 3: Control Flow</a> — conditionals and loops are where Python's readability shines</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e05">Python Lesson 5: Functions</a> — the building block of every Python program</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass</a></p>

      <h3>4. Java: The Enterprise Standard</h3>
      <p>Java powers Android apps, enterprise banking systems, e-commerce backends, and large-scale distributed systems. It is one of the most consistently in-demand languages at multinational companies in India and globally. Learning Java teaches you Object-Oriented Programming in its most rigorous form — making you a more disciplined developer in any language.</p>
      <p><strong>What you will build:</strong> Command-line applications, OOP designs, Android app foundations, backend APIs with Spring Boot.</p>
      <p><strong>Time to job-ready basics:</strong> 6–8 weeks.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea0">Java Lesson 1: Welcome to Java</a> — JVM, compilation, and your first Hello World</li>
        <li><a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea2">Java Lesson 3: Variables &amp; Data Types</a> — strict typing that builds discipline</li>
        <li><a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea4">Java Lesson 5: Control Flow</a> — if/else, switch, loops in Java</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-java-masterclass">Ultimate Java Masterclass</a></p>

      <h3>5. Artificial Intelligence &amp; Machine Learning</h3>
      <p>AI has crossed the threshold from specialised niche to mainstream requirement. Students who graduate in 2026 and beyond will be entering a workforce where AI literacy is as expected as Excel proficiency was a decade ago. Understanding how models are trained, what neural networks do, and how to integrate AI APIs gives you a permanent edge in any tech role.</p>
      <p><strong>What you will build:</strong> Classification models, image recognisers, LLM-powered chatbots.</p>
      <p><strong>Prerequisite:</strong> Python basics (3–4 weeks in).</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666201">AI Lesson 1: What is Artificial Intelligence?</a> — clear taxonomy of AI, ML, and Deep Learning</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666204">AI Lesson 4: What is Machine Learning?</a> — how models learn from data</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666205">AI Lesson 5: Neural Networks &amp; Deep Learning</a> — the architecture behind ChatGPT</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/basics-of-artificial-intelligence-beginners">AI &amp; Machine Learning Fundamentals</a></p>

      <h2>The Recommended Learning Order</h2>
      <p>If you are starting from zero, follow this sequence. Each skill builds a foundation for the next:</p>
      <ol>
        <li><strong>HTML</strong> — structure (Week 1–2)</li>
        <li><strong>CSS</strong> — style (Week 2–4)</li>
        <li><strong>JavaScript</strong> — interactivity (Week 4–10)</li>
        <li><strong>Python</strong> — versatility (Week 10–16, can overlap with JS)</li>
        <li><strong>AI/ML</strong> — intelligence (after Python basics)</li>
        <li><strong>Java</strong> — enterprise depth (can start parallel to Python)</li>
      </ol>
      <p>You do not need to finish one before starting the next. Once you are comfortable with HTML/CSS basics, you can begin JavaScript. Once Python loops feel natural, you can start the AI course. Progress is cumulative, not sequential.</p>

      <h2>Related Guides</h2>
      <p>Looking for a more structured career plan? Read our complete <a href="/blog/how-to-become-web-developer-2026-roadmap">Web Developer Roadmap for 2026</a>. To understand why certifications matter alongside skills, read <a href="/blog/how-skillvalix-helps-students-become-job-ready">How SkillValix Helps Students Become Job Ready</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Should I learn all 5 skills?</strong><br/>
      Not necessarily — at least not at the same time. Pick a primary track: Web Development (HTML + CSS + JavaScript), Data Science (Python + AI), or Full-Stack (all). Specialise first, then expand. Trying to learn all five simultaneously leads to superficial understanding of all and mastery of none.</p>

      <p><strong>Q2: Can I get a job knowing only HTML and CSS?</strong><br/>
      It is difficult to get a full-time software engineering role with only HTML and CSS. However, many freelancers, junior web designers, and template developers earn well with these two skills. For software engineering roles, add JavaScript and at least one backend skill (Python with Flask, or Node.js). Our <a href="/blog/freelancing-as-developer-beginners-guide">freelancing guide</a> explains how to monetise basic HTML/CSS skills while learning more.</p>

      <p><strong>Q3: Which is better to learn first — Python or JavaScript?</strong><br/>
      For web development: JavaScript first. For data science, AI, or scripting: Python first. If you are completely undecided, JavaScript is marginally more versatile for getting hired quickly — both frontend and backend Node.js roles are available to strong JavaScript developers. But Python has a lower learning curve and is almost universally required for AI/ML roles.</p>

      <h2>Start Free. Start Today.</h2>
      <p>At <a href="/">SkillValix</a>, every course in this list is 100% free. No subscription, no trial, no credit card. All courses end with a verified certificate tied to a unique ID — something you can link directly on LinkedIn and your resume. The only investment required is your time and consistency.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-27T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 27, 2026",
    readTime: "12 min read",
    wordCount: 1380,
    category: "Career & Industry",
    tags: ["Student Resources", "Career Advice", "Free Courses", "Learn to Code", "Programming", "Technology 2026", "HTML CSS JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Students studying together with laptops",
    canonicalUrl: "https://www.skillvalix.com/blog/top-skills-students-learn-online-free",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass for Beginners",
      slug: "ultimate-html-masterclass",
      description: "Start your journey today from absolute scratch."
    }
  },
  // ── NEW POSTS ────────────────────────────────────────────
  {
    id: "how-to-build-powerful-public-portfolio-2026",
    title: "How to Build a Powerful Public Portfolio to Get Hired in 2026",
    metaTitle: "How to Build a Powerful Public Portfolio to Get Hired (2026) | SkillValix",
    metaDescription: "Learn how to create a job-winning public developer portfolio in 2026. Showcase your certificates, projects, and skills all in one professional URL. Step-by-step guide included.",
    keywords: [
      "developer portfolio template 2026",
      "public portfolio for recruiters",
      "showcase certifications on portfolio",
      "build developer profile free",
      "web developer portfolio India",
      "SkillValix public portfolio",
      "get hired as a developer 2026",
      "portfolio SEO for developers"
    ],
    excerpt: "Your GitHub alone is no longer enough. In 2026, recruiters want a unified professional presence that shows not just your code, but your verifiable skills and certifications. Here is how to build one in 5 minutes.",
    content: `
      <h2>The New Standard: The Unified Professional Profile</h2>
      <p>Gone are the days when you could just send a PDF resume and a GitHub link. In a competitive 2026 job market, hiring managers are looking for <strong>social proof</strong>. They want to see that your skills are verified, your certificates are real, and your projects are accessible—all in one place.</p>

      <h3>1. Why You Need a Public Portfolio URL</h3>
      <p>A personal portfolio URL like <code>skillvalix.com/u/yourname</code> acts as your digital identity. It is SEO-friendly, meaning when a recruiter searches your name on Google, your professional achievements appear first. It aggregates your GitHub, LinkedIn, Resume, and all your SkillValix certifications into a single, high-conversion page.</p>

      <h3>2. Essential Elements of a 2026 Portfolio</h3>
      <ul>
        <li><strong>Verifiable Credentials:</strong> Don't just list skills; show the certificates that prove them. Every course you complete on SkillValix automatically syncs to your public profile.</li>
        <li><strong>Open to Work Status:</strong> Clearly signal to recruiters that you are available for new opportunities with a single toggle.</li>
        <li><strong>Project Showcases:</strong> Link your top GitHub repositories with descriptions that explain the <em>problem you solved</em>, not just the tech you used.</li>
      </ul>

      <h3>3. How to Activate Your Portfolio on SkillValix</h3>
      <p>At SkillValix, we've built the Public Portfolio feature to be entirely automatic. Once you complete your profile details and set a custom username, your portfolio is live for the world to see.</p>
      
      <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-8">
        <h4 class="text-blue-900 font-bold mb-2">🚀 Ready to get started?</h4>
        <p class="text-blue-700 text-sm mb-4">Click the button below to go directly to your Portfolio settings. Fill in your bio, add your social links, and make your profile public today!</p>
        <a href="/dashboard?tab=profile" class="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Set Up My Portfolio Now</a>
      </div>

      <h3>4. SEO Tips for Your Developer Profile</h3>
      <p>To rank higher in Google, ensure your <strong>Bio</strong> contains relevant keywords like "Frontend Developer", "React Specialist", or "Data Analyst". Mention the specific technologies you are passionate about. Search engines love rich, keyword-relevant text content.</p>

      <p>Stop sending scattered links. Start sending a professional legacy. Build your portfolio for free at <a href="https://www.skillvalix.com" target="_blank">SkillValix</a>.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-05T10:00:00+05:30",
    modifiedDate: "2026-04-05T10:00:00+05:30",
    date: "April 05, 2026",
    readTime: "5 min read",
    wordCount: 480,
    category: "Career & Industry",
    tags: ["Portfolio", "Career Development", "Recruitment", "Personal Branding", "Web Development"],
    imageUrl: "https://images.unsplash.com/photo-1547014762-3a94fb4df70a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Professional developer portfolio on a high-resolution monitor",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-build-powerful-public-portfolio-2026",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass for Beginners",
      slug: "ultimate-html-masterclass",
      description: "The foundation for any developer portfolio—master HTML5 and earn a verifiable certificate."
    }
  },
  {
    id: "what-is-skillvalix-complete-guide",
    title: "What is SkillValix? The Complete Guide to Building Your Career in 2026",
    metaTitle: "What is SkillValix? — Free Career Building Platform | SkillValix",
    metaDescription: "Discover what SkillValix is and how it helps students and professionals build tech careers. Learn about free courses, job simulations, hackathons, and certifications.",
    keywords: [
      "skillvalix",
      "what is skillvalix",
      "skillvalix free courses",
      "skillvalix review",
      "skillvalix certificate",
      "skillvalix hackathon India",
      "skillvalix job simulations",
      "build tech career free"
    ],
    excerpt: "SkillValix is more than just a learning platform—it is a complete career building engine. Discover how you can use SkillValix to learn, build projects, and get hired by world-class companies.",
    content: `
      <h2>What Exactly is SkillValix?</h2>
      <p>In today's fast-paced digital world, the gap between traditional education and industry requirements is wider than ever. Many students graduate with degrees but lack the practical "shipping" skills that top tech companies look for. This disconnect is exactly why <strong>SkillValix</strong> was founded.</p>
      
      <p>Whether you are a college student in India looking for your first internship, a career switcher trying to enter the tech industry, or a developer wanting to prove your skills, <strong>SkillValix</strong> is built for you. Unlike traditional learning platforms that stop at video tutorials, SkillValix focuses on the entire lifecycle of a developer’s journey: <strong>Learn, Build, and Get Hired.</strong></p>

      <h3>A Platform Built for Practical Skills</h3>
      <p>At its core, <strong>SkillValix</strong> is a bridge. It connects the theory of programming with the reality of professional software engineering. By providing high-quality, free education paired with industry-level assessments, SkillValix ensures that every hour you spend on the platform translates into a measurable career advantage. The platform was built on a simple philosophy: <strong>Skills should be verifiable, not just claimed.</strong></p>

      <h2>Key Features of SkillValix</h2>
      <p>To understand why SkillValix is different from other sites like Udemy or Coursera, you need to look at its integrated ecosystem. Here are the five core pillars that make SkillValix a powerhouse for career growth.</p>

      <h3>1. Free, High-Quality Technical Courses</h3>
      <p>Education should not have a price tag that prevents talented individuals from learning. Every masterclass on SkillValix is completely free. From the <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> to <a href="/courses/ultimate-react-masterclass">React.js Mastery</a> and <a href="/courses/basics-of-artificial-intelligence-beginners">AI Fundamentals</a>, our curriculum is designed by industry experts who know what is currently being used in production.</p>

      <h3>2. Real-World Job Simulations (Virtual Internships)</h3>
      <p>The biggest struggle for freshers is the "experience required" loop: you need experience to get a job, but you need a job to get experience. SkillValix breaks this cycle with Job Simulations. These are curated, multi-task simulations that mirror the actual tickets and tasks a junior developer receives in a startup.</p>

      <h3>3. Industry-Level Hackathons</h3>
      <p>Competition breeds excellence. SkillValix hosts and supports some of India’s most exciting online hackathons. These aren't just coding contests; they are opportunities to collaborate with others, network with mentors, and win prizes that look incredible on your resume.</p>

      <h3>4. Verified Certifications</h3>
      <p>A PDF "certificate of completion" is easy to forge. SkillValix Certifications are different. Every certificate issued by SkillValix is tied to a unique ID and a verification link hosted on our platform. When a recruiter clicks that link, they see your exam score and the specific skills you mastered.</p>

      <h3>5. The Public LinkedIn-Style Portfolio</h3>
      <p>Your SkillValix profile automatically aggregates your course progress, your hackathon wins, and your job simulation results into a sleek, public-facing portfolio. Instead of sending 10 different links to recruiters, you send one: your SkillValix profile.</p>

      <h2>Why Choose SkillValix over Other Platforms?</h2>
      <p>With so many resources online, why should you spend your time on SkillValix? Here is our unique value proposition:</p>
      <ul>
        <li><strong>Focus on Portfolio Building:</strong> We track your "Building Ability," which is a far better predictor of job success than just "Learning Time."</li>
        <li><strong>No Gatekeeping (Free Access):</strong> We believe that talent is universal, but opportunity is not. We keep our core courses free for everyone.</li>
        <li><strong>Verified Credibility:</strong> Because our exams and simulations are rigorous, a SkillValix credential means something in the real world.</li>
      </ul>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <p><strong>Q1: Is SkillValix really free?</strong><br/>
      Yes! All core technical masterclasses, project guides, and community hackathons on SkillValix are 100% free. Our mission is to make high-quality tech education accessible to every student.</p>

      <p><strong>Q2: Can I get a job through SkillValix?</strong><br/>
      While SkillValix is a skill-building platform, many students use their SkillValix portfolios and verified certificates to stand out in interviews. We also host hiring hackathons where startups directly recruit winners.</p>

      <p><strong>Q3: How do the SkillValix Job Simulations work?</strong><br/>
      They provide you with a series of tasks that a developer would do in a real company. You receive a brief, write the code, and submit your work. It’s designed to give you virtual experience for your resume.</p>

      <p>Your tech career in 2026 waits for no one. Stop just "learning" and start <strong>validating</strong>. Build your portfolio, earn your credentials, and show the world what you are capable of at <a href="https://www.skillvalix.com" target="_blank">SkillValix.com</a>.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-05T11:00:00+05:30",
    modifiedDate: "2026-04-05T11:00:00+05:30",
    date: "April 05, 2026",
    readTime: "7 min read",
    wordCount: 880,
    category: "Career & Industry",
    tags: ["SkillValix", "Career Development", "Free Courses", "Education", "Personal Branding"],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Young professionals collaborating in a modern tech environment",
    canonicalUrl: "https://www.skillvalix.com/blog/what-is-skillvalix-complete-guide",
    relatedCourse: {
      title: "Ultimate HTML Masterclass",
      slug: "ultimate-html-masterclass",
      description: "The best way to start your journey on SkillValix—master the core of the web for free."
    }
  },
  {
    id: "how-skillvalix-helps-students-become-job-ready",
    title: "How SkillValix Helps Students Become Job Ready: 7 Key SkillValix Benefits",
    metaTitle: "How SkillValix Helps Students Become Job Ready | SkillValix Benefits",
    metaDescription: "Discover the top SkillValix benefits for students and freshers. Learn how our free courses, job simulations, and verified portfolios make you job-ready in 2026.",
    keywords: [
      "skillvalix benefits",
      "how to become job ready as a student",
      "skillvalix for engineering students India",
      "virtual internship for freshers",
      "build a developer portfolio free",
      "skillvalix certified developer",
      "career growth with skillvalix",
      "free technical certifications India"
    ],
    excerpt: "Is your college degree enough to land a tech job in 2026? Probably not. Discover the major SkillValix benefits that help you bridge the gap between being a student and becoming a professional developer.",
    content: `
      <h2>The Gap Between College and Careers</h2>
      <p>The tech industry in 2026 moves faster than any university curriculum can keep up with. Every year, thousands of engineering students graduate in India with high grades but struggle to land their first job. Why? Because they are "educated" in theory but not "ready" for production environments.</p>
      
      <p>This is where <strong>SkillValix</strong> comes in. Our platform is specifically designed to solve the "lack of experience" problem. By focusing on practical application over rote memorization, we offer several <strong>SkillValix benefits</strong> that traditional education simply cannot provide.</p>

      <h3>Why Traditional Degrees Aren't Enough</h3>
      <p>A degree proves you can learn; a portfolio proves you can build. Most recruiters now skip past the "Education" section and head straight for the "Projects" and "Certifications" links. If you don't have proof of work, you are invisible to top-tier startups and MNCs.</p>

      <h2>7 Major SkillValix Benefits for Students</h2>
      <p>If you are looking to accelerate your career, here is how <strong>SkillValix</strong> transforms your professional outlook.</p>

      <h3>1. Gaining "Building Experience" through Simulations</h3>
      <p>One of the top <strong>SkillValix benefits</strong> is our unique Job Simulations. These aren't just tutorials; they are virtual internships. You receive a realistic project brief, complete with bugs to fix and features to ship. This gives you the confidence to say "I have done this before" during an interview.</p>

      <h3>2. Mastering Industry-Standard Tools</h3>
      <p>We don't teach outdated technologies. SkillValix courses focus on the stacks currently used by the world's best engineering teams—React, Node.js, MongoDB, Python, and AI. You learn the tools that are actually in demand on job boards today.</p>

      <h3>3. Earning High-Trust Verified Certifications</h3>
      <p>Most free certificates are worth nothing because they don't require an exam. SkillValix certifications require you to pass a rigorous assessment. Every certificate comes with a unique verification link that recruiters can check instantly. This adds massive credibility to your CV.</p>

      <h3>4. Creating a Public-Facing Professional Portfolio</h3>
      <p>Your SkillValix profile is your resume, portfolio, and credit score all in one. It automatically displays your course progress, your hackathon wins, and your simulation tasks in a sleek, public-facing format that you can share on LinkedIn.</p>

      <h3>5. Networking via Nationwide Hackathons</h3>
      <p>SkillValix hosts and manages some of the most competitive online hackathons in India. Participating in these events allows you to meet other ambitious developers, connect with mentors, and get noticed by corporate sponsors looking for fresh talent.</p>

      <h3>6. Learning to Debug and Ship Production Code</h3>
      <p>In college, you write code that only you see. In <strong>SkillValix</strong> simulations, you learn to write clean, documented, and production-ready code. You learn how to use GitHub, how to write README files, and how to deploy your applications to the web.</p>

      <h3>7. No-Cost Access to Premium Technical Knowledge</h3>
      <p>High-quality tech education should not be locked behind a paywall. One of the most significant <strong>SkillValix benefits</strong> is that our core masterclasses are 100% free. This ensures that every student, regardless of their financial background, has a fair shot at a tech career.</p>

      <h2>How to Use SkillValix to Get Your First Internship</h2>
      <p>If you want to maximize your chances of getting hired, follow this simple blueprint:</p>
      <ul>
        <li><strong>Pick a Track:</strong> Choose a specific path like Frontend, Backend, or Data Analyst.</li>
        <li><strong>Complete the Masterclass:</strong> Go through the lessons and build every project alongside the instructor.</li>
        <li><strong>Pass the Exam:</strong> Get your verified certificate and add it to your LinkedIn profile.</li>
        <li><strong>Run a Simulation:</strong> Complete the Job Simulation for your track to gain "virtual experience."</li>
        <li><strong>Optimize Your Portfolio:</strong> Add a professional bio to your SkillValix profile and share your public link in job applications.</li>
      </ul>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <p><strong>Q1: What are the main SkillValix benefits for freshers?</strong><br/>
      The main benefits include free access to industry-level courses, the ability to earn verified certifications that recruiters trust, and a platform to build a professional public portfolio that proves your skills.</p>

      <p><strong>Q2: How do SkillValix certifications help in job interviews?</strong><br/>
      Because SkillValix certificates are verifiable and tied to real assessments, they prove to the interviewer that you actually have the skills listed on your resume. You can simply share your verification link, and they can see your proof of work.</p>

      <p><strong>Q3: Is SkillValix available for students outside India?</strong><br/>
      Yes! While we have a strong focus on the Indian developer community, <strong>SkillValix</strong> is available to students and professionals worldwide. Anyone wanting to build a career in tech can join for free.</p>

      <p>Ready to unlock these <strong>SkillValix benefits</strong>? Your professional legacy starts here. Join thousands of other students who are building their future today at <a href="https://www.skillvalix.com" target="_blank">SkillValix.com</a>.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-05T11:30:00+05:30",
    modifiedDate: "2026-04-05T11:30:00+05:30",
    date: "April 05, 2026",
    readTime: "8 min read",
    wordCount: 920,
    category: "Career & Industry",
    tags: ["SkillValix Benefits", "Job Ready", "Student Career", "Engineering Students India", "Career Advice"],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Engineering students in India collaborating on a tech project",
    canonicalUrl: "https://www.skillvalix.com/blog/how-skillvalix-helps-students-become-job-ready",
    relatedCourse: {
      title: "Ultimate React Masterclass",
      slug: "ultimate-react-masterclass",
      description: "The fastest way to become job-ready — master modern React and earn a verified certificate."
    }
  },
  {
    id: "how-to-become-web-developer-2026-roadmap",
    title: "How to Become a Web Developer in 2026: The Complete Free Roadmap",
    metaTitle: "How to Become a Web Developer in 2026 — Free Roadmap | SkillValix",
    metaDescription: "The definitive step-by-step roadmap to becoming a web developer in 2026 — completely free. Learn HTML, CSS, JavaScript, React, Node.js and beyond with no money and no experience needed.",
    keywords: [
      "how to become a web developer 2026",
      "web developer roadmap free",
      "learn web development from scratch",
      "web development beginner guide",
      "frontend developer career path",
      "free web development course 2026",
      "become a developer without a degree",
      "learn to code free India",
      "full stack developer roadmap 2026"
    ],
    excerpt: "Becoming a web developer in 2026 has never been more achievable. Here is the exact free roadmap — from HTML to your first job — with no degree, no bootcamp fees, and no guesswork.",
    content: `
      <h2>The Myth: You Need a CS Degree or an Expensive Bootcamp</h2>
      <p>The single biggest barrier stopping people from becoming developers is the belief that you need a CS degree or a ₹1,50,000 bootcamp. In 2026, that barrier does not exist. Every skill you need is available online — for free — in a structured, progressive format. This roadmap shows you exactly what to learn, in what order, and where to start each step.</p>
      <p>We estimate it takes <strong>4–6 months of consistent learning (1–2 hours/day)</strong> to go from zero to junior developer ready. Let's break it down.</p>

      <h2>Step 1: HTML — The Structure of the Web (Weeks 1–2)</h2>
      <p>Every website on the internet starts with HTML (HyperText Markup Language). HTML defines the structure of a page — what is a heading, what is a paragraph, what is a navigation menu. Before CSS, before JavaScript, before any framework — HTML.</p>
      <p><strong>What to learn:</strong> Document structure (<code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>), semantic tags (<code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;nav&gt;</code>), headings, paragraphs, links, images, lists, tables, and forms.</p>
      <p><strong>Specific lessons to start with:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d8f">Lesson 1: Welcome to Web Development</a> — understand how the browser renders HTML before writing a single line</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d90">Lesson 2: Your Very First HTML File</a> — set up VS Code and write your first real page</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d91">Lesson 3: Headings and Paragraphs</a> — the building blocks of all text content</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d93">Lesson 5: Links: Connecting the Web</a> — every website relies on anchor tags</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> — free, structured, ends with a verifiable certificate.</p>

      <h2>Step 2: CSS — Making It Look Good (Weeks 2–4)</h2>
      <p>CSS (Cascading Style Sheets) is what transforms a plain HTML document into a beautiful, responsive design. CSS controls colours, fonts, spacing, layouts, and animations. The most important layout concepts you need to master are the Box Model, Flexbox, and CSS Grid.</p>
      <p><strong>What to learn:</strong> Selectors, specificity, the Box Model, Flexbox, CSS Grid, responsive design with media queries, CSS variables, and transitions.</p>
      <p><strong>Specific lessons to start with:</strong></p>
      <ul>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c661">CSS Lesson 1: Welcome to CSS!</a> — how CSS connects to HTML with the three linking methods</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c662">CSS Lesson 2: Selectors — Targeting Elements Precisely</a> — class, ID, attribute, and pseudo-class selectors</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c664">CSS Lesson 4: The CSS Box Model</a> — every layout problem traces back to this</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c665">CSS Lesson 5: Colors, Backgrounds &amp; Gradients</a> — make your designs visually compelling</li>
      </ul>
      <p>Once you finish the CSS course, read our <a href="/blog/css-grid-vs-flexbox-modern-web">CSS Grid vs Flexbox deep dive</a> and our <a href="/blog/css-animations-micro-interactions-guide">CSS micro animations guide</a> — two skills that immediately set you apart from other entry-level developers.</p>
      <p><strong>Free Course:</strong> <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro</a></p>

      <h2>Step 3: JavaScript — The Engine of the Web (Weeks 4–10)</h2>
      <p>JavaScript is the only programming language that runs natively in every web browser. It is what turns a static page into an interactive application. Variables, functions, loops, DOM manipulation, arrays, objects, fetch APIs, async/await — these are the concepts that separate a web beginner from a working developer.</p>
      <p><strong>What to learn:</strong> Variables (<code>let</code>/<code>const</code>), data types, conditionals, loops, functions, arrays, objects, DOM manipulation, events, fetch API, Promises, and async/await.</p>
      <p><strong>Specific lessons to start with:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a68">JS Lesson 1: Welcome to JavaScript!</a> — how JS runs in the browser and how to use the console</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a69">JS Lesson 2: Variables — Storing Data</a> — the difference between <code>let</code>, <code>const</code>, and <code>var</code></li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a6a">JS Lesson 3: Data Types</a> — strings, numbers, booleans, null, undefined, objects</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a6c">JS Lesson 5: Conditionals — Making Decisions</a> — the core of every interactive feature</li>
      </ul>
      <p>After the fundamentals, make sure to read our <a href="/blog/javascript-dom-manipulation-secrets">JavaScript DOM Manipulation guide</a> — it covers the advanced DOM patterns used in production that the course introduces.</p>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a></p>

      <h2>Step 4: Build 3 Real Projects (Weeks 11–14)</h2>
      <p>No recruiter cares what you studied. They care what you built. After completing the three courses above, build these three projects and publish them to GitHub:</p>
      <ol>
        <li><strong>Personal Portfolio Website</strong> — HTML + CSS only. Showcase your name, skills, projects, and a contact form. This is the first link in your job applications.</li>
        <li><strong>Weather App</strong> — HTML + CSS + JavaScript + a public API (OpenWeatherMap is free). Fetches live weather data based on a city name and displays it. Demonstrates DOM manipulation and async/fetch.</li>
        <li><strong>Task Manager App</strong> — HTML + CSS + JavaScript + localStorage. A full CRUD app (Create, Read, Update, Delete) with data persistence. Demonstrates state management at the DOM level.</li>
      </ol>
      <p>Each project needs: a GitHub repository with a clear README, a live demo link (deploy free on Vercel or GitHub Pages), and a brief description of what problem it solves and what technologies it uses.</p>

      <h2>Step 5: Learn React (Weeks 14–20)</h2>
      <p>Once you are solid on vanilla JavaScript, add React — the most popular frontend framework in the world, used by Meta, Netflix, Airbnb, and thousands of startups. React lets you build complex UIs from reusable components, manages application state, and is the industry standard for frontend engineering roles.</p>
      <ul>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b910">React Lesson 1: React Ecosystem and Modern Tooling</a> — Vite, npm, and the modern React setup</li>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b911">React Lesson 2: JSX Syntax in Depth</a> — writing HTML inside JavaScript</li>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b913">React Lesson 4: Props, State, and Data Flow</a> — the core mental model of React</li>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b914">React Lesson 5: Event Handling and Controlled Forms</a> — real-world forms that actually work</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-react-masterclass">Ultimate React Masterclass</a></p>

      <h2>Step 6: Add a Backend with Node.js (Weeks 20–26, Optional for Frontend Roles)</h2>
      <p>Full-stack developers build both the frontend (React) and the backend (the server, database, and API). Node.js with Express is the most beginner-friendly backend technology — it uses JavaScript, the same language you already know.</p>
      <ul>
        <li><a href="/courses/nodejs-express-api-development/lesson/7ac1f8b20d4f9a3e61c2ba10">Node.js Lesson 1: Architecture and Event Loop</a> — why non-blocking I/O is a superpower</li>
        <li><a href="/courses/nodejs-express-api-development/lesson/7ac1f8b20d4f9a3e61c2ba12">Node.js Lesson 3: REST API Design Principles</a> — build a real API from scratch</li>
        <li><a href="/courses/nodejs-express-api-development/lesson/7ac1f8b20d4f9a3e61c2ba14">Node.js Lesson 5: Authentication with JWT</a> — add user login to your applications</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/nodejs-express-api-development">Node.js &amp; Express API Development</a></p>

      <h2>Step 7: Get Certified and Apply</h2>
      <p>After completing each SkillValix course, take the certification exam to earn a verifiable certificate. A verifiable certificate is fundamentally different from a "completion badge" — it proves you passed a real assessment. The certificate links directly to your score and skills on your SkillValix public profile. Add every certificate to your LinkedIn profile and link your profile URL in every job application.</p>
      <p>Read our guide on <a href="/blog/how-to-build-powerful-public-portfolio-2026">how to build a powerful developer portfolio</a> so your profile is optimised for recruiter discovery.</p>

      <h2>The Realistic Timeline</h2>
      <ul>
        <li><strong>Month 1:</strong> HTML + CSS basics. Can build simple static websites.</li>
        <li><strong>Month 2:</strong> CSS advanced (Flexbox, Grid, animations) + JavaScript basics (variables, loops, functions).</li>
        <li><strong>Month 3:</strong> JavaScript DOM manipulation. Build Weather App + Portfolio site.</li>
        <li><strong>Month 4:</strong> JavaScript advanced (async, fetch, Promises). Build Task Manager. Start React.</li>
        <li><strong>Month 5:</strong> React components, state, hooks. Build one React project (e.g. a movie search app using TMDB API).</li>
        <li><strong>Month 6:</strong> Polish portfolio, apply for junior frontend roles, do SkillValix job simulations.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Can I become a web developer without any prior programming experience?</strong><br/>
      Yes, completely. HTML and CSS are among the most beginner-friendly technologies ever created. Most developers started with zero experience. The key is consistency — even 1 hour every day compounds significantly over 6 months.</p>

      <p><strong>Q2: Do I need to learn backend development to get a job?</strong><br/>
      No. Frontend-only roles (HTML + CSS + JavaScript + React) are extremely common at startups, agencies, and product companies. Full-stack roles command higher salaries but require more learning time. Start with frontend, get hired, then add backend knowledge on the job.</p>

      <p><strong>Q3: How important are certifications vs projects for getting hired?</strong><br/>
      Both matter, for different reasons. Projects prove you can build — they are the most important hiring signal. Certifications from verified assessments (like SkillValix) prove the projects are not flukes — they show you passed a rigorous test. The winning combination is strong projects + verified certificates + an optimised portfolio URL.</p>

      <p><strong>Q4: What is the best first project to build?</strong><br/>
      Your personal portfolio website. It serves double duty: it is a project that demonstrates your HTML/CSS/JS skills, AND it is the live URL you send to every employer. Build it with HTML and CSS only first. Then add JavaScript animations and interactivity as you learn. Then eventually rebuild it in React. It grows with you as your skills grow.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-28T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 28, 2026",
    readTime: "14 min read",
    wordCount: 1620,
    category: "Career & Industry",
    tags: ["Web Development", "Career Roadmap", "Beginners", "Frontend Developer", "Full Stack", "Free Courses", "Learn to Code 2026"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer working on laptop with HTML CSS JavaScript code on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-become-web-developer-2026-roadmap",
    relatedCourse: {
      title: "Ultimate HTML Masterclass",
      slug: "ultimate-html-masterclass",
      description: "Your first step on the roadmap — master HTML5 from scratch with a free verifiable certificate."
    }
  },
  {
    id: "css-animations-micro-interactions-guide",
    title: "CSS Micro Animations & Micro-Interactions: The Complete Guide to Making Your Website Feel Alive (2026)",
    metaTitle: "CSS Micro Animations & Micro-Interactions: Complete Guide 2026 | SkillValix",
    metaDescription: "Master CSS micro animations and micro-interactions in 2026. Learn transitions, @keyframes, hover effects, scroll animations, and GPU-accelerated techniques with real code examples. Build websites users love.",
    keywords: [
      "CSS micro animations",
      "CSS micro-interactions",
      "CSS animations tutorial 2026",
      "CSS transitions guide",
      "keyframes animation CSS",
      "CSS hover effects",
      "web animation best practices",
      "UI animation CSS examples",
      "CSS animation performance",
      "button hover animation CSS",
      "card hover effect CSS",
      "CSS loading animation",
      "scroll animation CSS",
      "pure CSS animation no JavaScript"
    ],
    excerpt: "CSS micro animations are the secret weapon of elite UX designers. A button that lifts on hover, a card that glows on focus, a loader that pulses — these tiny moments transform a website from functional to unforgettable. Here is the complete 2026 guide to building them with pure CSS.",
    content: `
      <h2>What Are CSS Micro Animations? (And Why They Matter)</h2>
      <p>A <strong>CSS micro animation</strong> is a small, purposeful motion that responds to a user action. It is not a flashy banner or a full-page transition. It is a button that shifts 2px upward when hovered. It is a checkbox that scales with a satisfying pop when checked. It is a navigation link whose underline slides in from the left.</p>
      <p>These micro animations serve a critical UX purpose: they provide <strong>feedback</strong>. They tell the user "yes, your action was registered" without a single line of copy. Research from the Nielsen Norman Group consistently shows that interfaces with purposeful micro-interactions feel more trustworthy and easier to use.</p>
      <p>The best news? In 2026, you need <strong>zero JavaScript</strong> for 90% of these effects. Pure CSS is faster, simpler, and more accessible.</p>

      <h2>The Foundation: CSS transitions</h2>
      <p>The <code>transition</code> property is your most-used tool for CSS micro animations. (Learn more in <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c66e">Lesson 14: CSS Transitions &amp; Animations</a>). It smoothly animates a CSS property from one value to another whenever that property changes — typically on <code>:hover</code>, <code>:focus</code>, or <code>:active</code>.</p>
      <p>The syntax has four parts:</p>
      <pre><code>transition: [property] [duration] [timing-function] [delay];</code></pre>
      <p>Here is the most useful pattern — a button micro animation that lifts and deepens its shadow on hover:</p>
      <pre><code>.btn-primary {
  background: #4f46e5;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);

  /* Micro animation: transition multiple properties at once */
  transition:
    background-color 0.25s ease,
    transform       0.2s  ease,
    box-shadow      0.25s ease;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.btn-primary:active {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
}</code></pre>
      <p>Notice the <code>:active</code> state — when a user clicks, the button snaps back down. This "press" micro animation is a subtle but powerful piece of physical feedback that makes buttons feel tactile.</p>

      <h3>Timing Functions: The Soul of a Micro Animation</h3>
      <p>The timing function (or "easing") controls the acceleration curve of your CSS micro animation. Choosing the wrong one makes animations feel mechanical. Here are the ones that matter:</p>
      <ul>
        <li><strong>ease</strong> (default): Starts slow, speeds up, then slows down. Good for most general micro animations.</li>
        <li><strong>ease-out</strong>: Starts fast, ends slow. Best for elements entering the screen (feels natural, like something sliding into place).</li>
        <li><strong>ease-in</strong>: Starts slow, ends fast. Best for elements leaving the screen.</li>
        <li><strong>cubic-bezier()</strong>: Full custom control. Use <a href="https://cubic-bezier.com" target="_blank" rel="noopener noreferrer">cubic-bezier.com</a> to design your exact curve.</li>
      </ul>
      <pre><code>/* A "bouncy" custom easing — great for card hover effects */
.card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card:hover {
  transform: translateY(-8px) scale(1.02);
}</code></pre>
      <p>The <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code> value overshoots slightly before settling — this is called a "spring" easing and it makes micro animations feel alive and physical.</p>

      <h2>Going Deeper: CSS @keyframes Animations</h2>
      <p>While <code>transition</code> animates between two states, <code>@keyframes</code> gives you full narrative control. You define every step of the animation — and the browser handles the rest.</p>
      <p>Here is the syntax pattern:</p>
      <pre><code>@keyframes animation-name {
  0%   { /* starting state */ }
  50%  { /* mid-point state */ }
  100% { /* ending state */ }
}

.element {
  animation: animation-name [duration] [timing] [delay] [iteration] [direction];
}</code></pre>

      <h3>Practical Example 1: Pulsing Notification Dot</h3>
      <p>This is one of the most common CSS micro animations you see on modern dashboards — the pulsing red dot on a notification icon:</p>
      <pre><code>@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 1; }
  70%  { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}

.notification-dot {
  position: relative;
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
}

/* The expanding ring effect */
.notification-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse-ring 1.5s ease-out infinite;
}</code></pre>

      <h3>Practical Example 2: Skeleton Loading Animation</h3>
      <p>Skeleton loaders are a fantastic CSS micro animation pattern. Instead of showing a spinner, you show a shimmering placeholder in the exact shape of the content being loaded. This dramatically reduces perceived loading time:</p>
      <pre><code>@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position:  1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #e2e8f0 25%,
    #f1f5f9 50%,
    #e2e8f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.8s infinite linear;
  border-radius: 6px;
}

/* Usage examples */
.skeleton-title  { height: 24px; width: 70%; margin-bottom: 12px; }
.skeleton-text   { height: 14px; width: 100%; margin-bottom: 8px; }
.skeleton-avatar { height: 48px; width: 48px; border-radius: 50%; }</code></pre>

      <h3>Practical Example 3: Slide-In Navigation Underline</h3>
      <p>This CSS micro animation replaces the plain underline on nav links with a smooth sliding effect — a hallmark of polished navigation design:</p>
      <pre><code>.nav-link {
  position: relative;
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  padding-bottom: 4px;
}

/* The animated underline */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #4f46e5;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.nav-link:hover::after {
  transform: scaleX(1);
}</code></pre>
      <p>The key here is <code>transform-origin: left</code> — it makes the underline slide <em>from left to right</em>. Change it to <code>right</code> to reverse direction, or <code>center</code> for a expansion-from-center effect.</p>

      <h2>CSS Micro Animations for Cards and Interactive Elements</h2>

      <h3>The Card Lift Effect</h3>
      <p>Card hover effects are among the most searched CSS micro animations. Done correctly, they make a grid of content cards feel interactive and premium:</p>
      <pre><code>.course-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  /* Micro animation setup */
  transition:
    transform   0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow  0.3s ease,
    border-color 0.3s ease;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.15);
  border-color: #c7d2fe;
}</code></pre>

      <h3>Input Focus Micro Animation</h3>
      <p>Form inputs are often overlooked, but a polished focus state micro animation makes your forms feel professional:</p>
      <pre><code>.form-input {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow   0.2s ease,
    transform    0.15s ease;
}

.form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  transform: scale(1.01);
}</code></pre>

      <h2>The Performance Rules of CSS Micro Animations</h2>
      <p>This is where most tutorials fail. Beautiful CSS micro animations that cause jank (stuttering) are worse than no animation at all. Here are the non-negotiable performance rules:</p>

      <h3>Rule 1: Only Animate transform and opacity</h3>
      <p>Modern browsers use the GPU to composite layers for <code>transform</code> and <code>opacity</code>. These properties do not trigger layout recalculation or repaint. Everything else — <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>, <code>margin</code> — forces a full layout reflow on every frame, causing 60fps to drop to 15fps.</p>
      <pre><code>/* ❌ DO NOT animate these — causes layout thrash */
.bad { transition: width 0.3s ease; }
.also-bad { transition: top 0.3s ease, left 0.3s ease; }

/* ✅ DO animate these — GPU accelerated */
.good { transition: transform 0.3s ease; }
.also-good { transition: opacity 0.3s ease, transform 0.3s ease; }</code></pre>

      <h3>Rule 2: Use will-change Sparingly</h3>
      <p>The <code>will-change</code> property tells the browser to promote an element to its own GPU layer <em>before</em> the animation starts. This eliminates the initial frame jank:</p>
      <pre><code>.animated-element {
  will-change: transform, opacity;
}

/* ⚠️ Important: Remove will-change after animation ends */
/* Never apply it to every element — it wastes GPU memory */</code></pre>

      <h3>Rule 3: Respect prefers-reduced-motion</h3>
      <p>Approximately 35% of users have vestibular disorders or motion sensitivity. Always wrap your CSS micro animations in a <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c66b">media query</a> that respects the user's system preference:</p>
      <pre><code>/* All your micro animations here... */
.card { transition: transform 0.3s ease; }
.card:hover { transform: translateY(-6px); }

/* Override for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
  .card:hover {
    transform: none;
  }
}</code></pre>
      <p>This is also a Google Lighthouse accessibility criterion. Ignoring it will hurt your SEO score.</p>

      <h2>Scroll-Triggered CSS Micro Animations (No JavaScript)</h2>
      <p>In 2026, CSS has a native way to trigger micro animations based on scroll position using <code>@keyframes</code> combined with <code>animation-timeline: scroll()</code> — a new feature supported in all modern browsers:</p>
      <pre><code>@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Elements animate in as they enter the viewport */
.animate-on-scroll {
  animation: fade-in-up 0.6s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}</code></pre>
      <p>This is a game-changer. Previously, developers needed Intersection Observer + JavaScript to achieve this. Now it is pure CSS.</p>

      <h2>CSS Micro Animations Cheat Sheet</h2>
      <p>Here is a quick-reference table of the most useful CSS micro animation patterns:</p>
      <ul>
        <li><strong>Button lift:</strong> <code>transform: translateY(-3px)</code> on <code>:hover</code> + box-shadow deepening</li>
        <li><strong>Button press:</strong> <code>transform: translateY(1px) scale(0.98)</code> on <code>:active</code></li>
        <li><strong>Card glow:</strong> <code>box-shadow: 0 0 0 3px rgba(99,102,241,0.3)</code> on <code>:hover</code></li>
        <li><strong>Icon spin:</strong> <code>@keyframes spin { to { transform: rotate(360deg); } }</code></li>
        <li><strong>Fade in:</strong> <code>@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }</code></li>
        <li><strong>Slide up:</strong> <code>@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } }</code></li>
        <li><strong>Underline reveal:</strong> <code>::after</code> with <code>scaleX(0) → scaleX(1)</code> via <code>transition</code></li>
        <li><strong>Skeleton shimmer:</strong> Animated <code>background-position</code> on a gradient background</li>
      </ul>

      <h2>Putting It All Together: A Real-World Component</h2>
      <p>Here is a complete, production-ready course card component that combines multiple CSS micro animations in harmony — the kind you see on platforms like SkillValix's <a href="/courses">free courses page</a>:</p>
      <pre><code>.course-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform   0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow  0.3s ease,
    border-color 0.3s ease;
}

.course-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 24px 48px rgba(79, 70, 229, 0.12);
  border-color: #a5b4fc;
}

/* Thumbnail zoom on hover */
.course-card .thumbnail {
  overflow: hidden;
}

.course-card .thumbnail img {
  transition: transform 0.5s ease;
}

.course-card:hover .thumbnail img {
  transform: scale(1.08);
}

/* CTA button reveal on hover */
.course-card .enroll-btn {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.course-card:hover .enroll-btn {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .course-card,
  .course-card .thumbnail img,
  .course-card .enroll-btn {
    transition: none;
    animation: none;
  }
}</code></pre>

      <h2>Where to Learn CSS Animations in Depth</h2>
      <p>If you want to go beyond micro animations and master the full CSS toolkit — including <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c669">Flexbox</a>, <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c66a">CSS Grid</a>, responsive design, and advanced animations — the best starting point is our free <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro course</a>. It is completely free, structured, and ends with a verifiable certificate that proves your skills to employers.</p>
      <p>You should also explore our <a href="/blog/css-grid-vs-flexbox-modern-web">CSS Grid vs Flexbox guide</a> to understand how to build the layouts that your CSS micro animations will live inside. And if you want to combine these animations with JavaScript interactivity, our <a href="/blog/javascript-dom-manipulation-secrets">JavaScript DOM manipulation guide</a> shows you exactly how to trigger CSS animations programmatically.</p>

      <h2>Frequently Asked Questions About CSS Micro Animations</h2>

      <p><strong>Q1: What is the difference between a CSS transition and a CSS animation?</strong><br/>
      A <code>transition</code> animates between exactly two states (e.g., default → hover). A <code>@keyframes</code> animation can have multiple steps, can loop, can auto-play on page load, and gives you much more timing control. For simple hover micro animations, always use <code>transition</code>. For complex, multi-step, or looping animations, use <code>@keyframes</code>.</p>

      <p><strong>Q2: Do CSS micro animations hurt website performance?</strong><br/>
      Only if you animate the wrong properties. Animating <code>transform</code> and <code>opacity</code> is GPU-accelerated and has zero performance cost. Animating <code>width</code>, <code>height</code>, <code>top</code>, or <code>left</code> triggers layout recalculation on every frame and can severely hurt performance, especially on mobile devices.</p>

      <p><strong>Q3: Should I use CSS animations or JavaScript animations?</strong><br/>
      For UI micro animations (hover states, loading indicators, transitions between states), CSS is almost always the better choice. It is parsed directly by the browser, runs off the main thread, and requires no library. Use JavaScript (or libraries like GSAP) only when you need truly complex sequencing, user-controlled scrubbing, or physics-based animations.</p>

      <p><strong>Q4: How many CSS micro animations should a page have?</strong><br/>
      Quality over quantity. A page with 3–5 purposeful micro animations feels premium. A page with 20 competing animations feels chaotic and overwhelming. Each animation should serve exactly one purpose: confirm an action, indicate state change, or guide the user's attention.</p>

      <p><strong>Q5: Are CSS animations accessible?</strong><br/>
      They can be, if you implement the <code>prefers-reduced-motion</code> media query. Always write a fallback that disables or reduces animation for users who have indicated motion sensitivity in their OS settings. This is both an ethical requirement and a Lighthouse accessibility criterion.</p>

      <p>Ready to build stunning, animated interfaces from the ground up? Start with the free <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners course on SkillValix</a> — no fees, no gatekeeping, just real skills with a verifiable certificate.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-29T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 29, 2026",
    readTime: "14 min read",
    wordCount: 2250,
    category: "CSS & Design",
    tags: ["CSS Micro Animations", "CSS Animations", "CSS Transitions", "UI Design", "Web Development", "Micro-Interactions", "CSS Performance", "UX Design"],
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "CSS micro animations and interactive UI design patterns on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/css-animations-micro-interactions-guide",
    relatedCourse: {
      title: "CSS for Beginners — Zero to Pro",
      slug: "css-for-beginners-learn-web-styling-zero-to-pro",
      description: "Master CSS animations, Flexbox, Grid and transitions with a free verifiable certificate."
    }
  },
  {
    id: "freelancing-as-developer-beginners-guide",
    title: "How to Start Freelancing as a Developer in 2026 (Even as a Beginner)",
    metaTitle: "How to Start Freelancing as a Developer in 2026 — Beginner Guide | SkillValix",
    metaDescription: "A practical guide to starting your freelancing career as a web developer in 2026. Learn how to find your first client, set your rates, and build a portfolio — even if you are just starting out.",
    keywords: [
      "freelancing for developers 2026",
      "how to start freelancing beginner",
      "web developer freelance guide",
      "find first client freelancer",
      "freelance web development India",
      "upwork fiverr developer tips",
      "build portfolio for freelancing",
      "developer side income"
    ],
    excerpt: "You do not need years of experience to start freelancing. You need one good project and one happy client. Here is the exact blueprint to get your first paid project as a developer in 2026.",
    content: `
      <h2>The Freelance Developer Opportunity in 2026</h2>
      <p>The global demand for web development freelancers has never been higher. Small businesses, content creators, local shops, and startups all need websites. Most of them cannot afford a full-time developer — but they can absolutely afford a skilled freelancer.</p>

      <h3>Step 1: Build a Portfolio with 3 Projects</h3>
      <p>You do not need 10 projects. You need 3 excellent ones. A personal portfolio site, a business landing page, and one interactive app. Host them all on GitHub Pages or Netlify for free. This is your proof of ability.</p>

      <h3>Step 2: Get a Verifiable Certificate</h3>
      <p>A certificate from a recognised platform signals credibility. When pitching to a client on Upwork or Fiverr, attaching a verifiable certificate link from <a href="https://www.skillvalix.com" target="_blank">SkillValix</a> gives them immediate confidence that you passed a real exam — not just watched YouTube tutorials.</p>

      <h3>Step 3: Pricing Your First Projects</h3>
      <p>Start at ₹5,000–₹15,000 ($60–$180) per project for simple landing pages. As you accumulate reviews and testimonials, raise your rates every 3 months. Your skills will improve faster than you think.</p>

      <h3>Step 4: Where to Find Clients</h3>
      <ul>
        <li><strong>Platforms:</strong> Upwork, Fiverr, Toptal (as you grow)</li>
        <li><strong>Local businesses:</strong> Restaurants, clinics, boutiques near you who lack a website</li>
        <li><strong>LinkedIn:</strong> Post your projects weekly and engage with business owners</li>
      </ul>

      <p>The skills you need to start are available free today at <a href="https://www.skillvalix.com/courses" target="_blank">SkillValix Courses</a>.</p>
    `,
    author: "Rahul Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-30T09:00:00+05:30",
    modifiedDate: "2026-03-30T09:00:00+05:30",
    date: "March 30, 2026",
    readTime: "7 min read",
    wordCount: 450,
    category: "Career & Industry",
    tags: ["Freelancing", "Web Development", "Career", "Beginners", "Income"],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Freelancer working remotely on laptop at a coffee shop",
    canonicalUrl: "https://www.skillvalix.com/blog/freelancing-as-developer-beginners-guide",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Build the JavaScript skills every client expects — free with a verifiable certificate."
    }
  },
  {
    id: "developer-resume-portfolio-tips-2026",
    title: "7 Things Every Developer Resume Must Have in 2026 (With Examples)",
    metaTitle: "7 Things Every Developer Resume Must Have in 2026 | SkillValix",
    metaDescription: "Struggling to get interviews as a developer? Your resume might be the problem. Learn the 7 essential elements every developer CV needs in 2026 to get noticed by recruiters.",
    keywords: [
      "developer resume tips 2026",
      "web developer CV guide",
      "programmer resume examples",
      "developer portfolio tips",
      "tech resume India",
      "get developer job 2026",
      "resume for freshers software developer",
      "programmer CV no experience"
    ],
    excerpt: "Most developer resumes fail within the first 6 seconds of review. Find out the 7 critical elements that separate CVs that get interviews from those that get ignored — even for fresh graduates.",
    content: `
      <h2>The 6-Second Resume Test</h2>
      <p>Recruiters spend an average of 6 seconds scanning a resume before deciding whether to read it further. That means your most important information must be immediately visible, scannable, and compelling.</p>

      <h3>1. A GitHub Profile Link (Not Optional in 2026)</h3>
      <p>A GitHub profile with regular commits is worth more than a list of skills. It shows that you build things, that you care, and that you write real code. Include your 3 best repositories with clear README files.</p>

      <h3>2. Verifiable Certificates, Not Just "Completed" Claims</h3>
      <p>Anyone can write "Completed HTML Course" on a resume. A verifiable certificate with a unique ID that a recruiter can actually check is a completely different signal. Certificates from platforms with real exams — like <a href="https://www.skillvalix.com" target="_blank">SkillValix</a> — provide that verification link instantly.</p>

      <h3>3. Quantified Projects, Not Vague Descriptions</h3>
      <p>Bad: "Built a portfolio website." Good: "Built a responsive portfolio site using HTML5 & CSS Grid, with 95+ Lighthouse performance score, deployed on Netlify." Numbers and specifics tell a story skills lists cannot.</p>

      <h3>4. A Skills Section Ordered by Proficiency</h3>
      <p>List languages and tools you are confident being tested on. Recruiters will ask you about anything you list. Only include what you can discuss in depth.</p>

      <h3>5. A One-Line LinkedIn Profile URL</h3>
      <h3>6. A Clean, Single-Column Layout (No Graphics, No Tables)</h3>
      <h3>7. A Tailored Summary, Not a Generic Objective</h3>
      <p>Write 2–3 sentences that say exactly what kind of role you want and what unique value you bring. This is your 6-second hook.</p>

      <p>Build the skills that fill your resume at <a href="https://www.skillvalix.com/courses" target="_blank">SkillValix</a> — completely free with certified exams.</p>
    `,
    author: "Priya Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-01T09:00:00+05:30",
    modifiedDate: "2026-04-01T09:00:00+05:30",
    date: "April 1, 2026",
    readTime: "6 min read",
    wordCount: 420,
    category: "Career & Industry",
    tags: ["Resume Tips", "Job Search", "Developer Career", "Portfolio", "Freshers"],
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer reviewing resume and portfolio on desk",
    canonicalUrl: "https://www.skillvalix.com/blog/developer-resume-portfolio-tips-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Add JS to your resume with confidence — pass the exam and earn a verifiable certificate for free."
    }
  },
  {
    id: "ai-tools-every-developer-should-use-2026",
    title: "10 AI Tools Every Developer Must Use in 2026 to Code Faster",
    metaTitle: "10 AI Tools Every Developer Must Use in 2026 | SkillValix",
    metaDescription: "Discover the top 10 AI-powered developer tools in 2026 that will supercharge your productivity — from AI code completion to automated testing. Stay ahead of the curve.",
    keywords: [
      "AI tools for developers 2026",
      "best AI coding tools",
      "GitHub Copilot alternatives",
      "AI for web development",
      "developer productivity AI",
      "AI code review tools",
      "machine learning tools programmers",
      "ChatGPT for developers"
    ],
    excerpt: "AI is not replacing developers — but developers who use AI are replacing those who do not. Here are the 10 AI tools in 2026 that will make you code twice as fast with half the frustration.",
    content: `
      <h2>The AI-Augmented Developer in 2026</h2>
      <p>The biggest productivity shift in software development right now is not a new framework or a new language. It is AI-powered tooling. Developers who integrate these tools into their workflow are dramatically outperforming those who do not.</p>

      <h3>1. GitHub Copilot — AI Pair Programmer</h3>
      <p>Copilot autocompletes entire functions as you type. It reads the context of your file and suggests the next logical block of code. Treat it as a fast, tireless junior developer who suggests, while you review and decide.</p>

      <h3>2. Cursor — AI-Native Code Editor</h3>
      <p>A fork of VS Code with deep AI integration. You can use natural language commands to refactor code, explain error messages, and even generate complete components from a description.</p>

      <h3>3. Tabnine — Privacy-First AI Completion</h3>
      <p>For developers or teams who cannot send code to external servers (healthcare, fintech), Tabnine runs entirely locally. Enterprise-grade AI completion without data exposure.</p>

      <h3>4. ChatGPT / Claude for Debugging</h3>
      <p>Paste a confusing error stack trace and ask AI to explain it. The explanation quality in 2026 is remarkable — often better than Stack Overflow for uncommon edge cases.</p>

      <h3>5–10. Honourable Mentions</h3>
      <ul>
        <li><strong>Codeium</strong> — Free GitHub Copilot alternative</li>
        <li><strong>Pieces.app</strong> — AI-powered code snippet manager</li>
        <li><strong>Warp</strong> — AI terminal with natural language commands</li>
        <li><strong>Vercel v0</strong> — Generate React UI components from text prompts</li>
        <li><strong>Mintlify</strong> — Auto-generate code documentation</li>
        <li><strong>Snyk</strong> — AI-powered security vulnerability scanner</li>
      </ul>

      <p>Understanding how AI and Machine Learning work under the hood makes you a significantly better user of these tools. Explore the free <a href="https://www.skillvalix.com/courses/basics-of-artificial-intelligence-beginners" target="_blank">AI & Machine Learning Fundamentals</a> course on SkillValix.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T09:00:00+05:30",
    modifiedDate: "2026-04-02T09:00:00+05:30",
    date: "April 2, 2026",
    readTime: "7 min read",
    wordCount: 460,
    category: "AI & Data Science",
    tags: ["AI Tools", "Developer Productivity", "GitHub Copilot", "Machine Learning", "Technology 2026"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "AI code generation interface on a developer screen",
    canonicalUrl: "https://www.skillvalix.com/blog/ai-tools-every-developer-should-use-2026",
    relatedCourse: {
      title: "AI & Machine Learning Fundamentals",
      slug: "basics-of-artificial-intelligence-beginners",
      description: "Understand the AI powering these tools — learn for free with a verifiable certificate."
    }
  },
  {
    id: "how-to-host-hackathon-in-india-2026",
    title: "How to Host a Hackathon in India in 2026: The Complete Guide",
    metaTitle: "How to Host a Hackathon in India in 2026 — Complete Guide | SkillValix",
    metaDescription: "Planning to host a hackathon in India? This complete 2026 guide covers everything — from team registration and payment collection to submission management and certification. No Google Forms needed.",
    keywords: [
      "how to host a hackathon in India",
      "hackathon host India",
      "organize hackathon online India",
      "hackathon platform India 2026",
      "host college hackathon",
      "hackathon management platform",
      "online hackathon India",
      "hackathon registration platform"
    ],
    excerpt: "Hosting a hackathon in India used to mean chaotic Google Forms, manual payment tracking, and WhatsApp group pandemonium. Not anymore. Here is how to run a professional, fully-automated hackathon end-to-end.",
    content: `
      <h2>The Problem with "Traditional" Hackathon Organizing in India</h2>
      <p>If you have ever tried to organize a hackathon — whether for your college fest, a corporate innovation drive, or a community event — you know the pain. It starts with a Google Form. Then someone builds a WhatsApp group. Then Excel sheets for team tracking. Then a UPI QR code for payments. Then chasing 200 participants for their submission links the night before the deadline.</p>
      <p>The result? Organizers burn out. Participants get confused. And the hackathon's reputation suffers before it even begins.</p>

      <h3>What Does a Modern Hackathon Platform Do?</h3>
      <p>A dedicated hackathon hosting platform eliminates every manual step in the process. Here is what the workflow looks like on a purpose-built platform like <a href="https://www.skillvalix.com/host" target="_blank">SkillValix</a>:</p>
      <ul>
        <li><strong>Team Registration:</strong> Participants sign up, create teams, and invite members — all managed inside a secure dashboard. No more Excel.</li>
        <li><strong>Built-in Payment:</strong> If your hackathon has a registration fee, participants pay directly through the platform. You receive INR payments without sharing a personal UPI QR or chasing confirmations.</li>
        <li><strong>Deadline Countdown:</strong> Every participant sees a live countdown to the submission deadline. No more "Sir, what is the last time?" messages.</li>
        <li><strong>Structured Submissions:</strong> Teams paste their GitHub repo, Google Drive link, or PDF directly from their team dashboard — organized, timestamped, and ready for review.</li>
        <li><strong>Admin Scoring:</strong> You review each team's submission, assign a score out of 100, and the platform tracks rankings automatically.</li>
        <li><strong>Auto-Certificates:</strong> Winners and participants receive beautiful, verifiable digital certificates the moment you click "Publish Results". Zero manual PDF generation.</li>
      </ul>

      <h3>Who Should Host a Hackathon?</h3>
      <ul>
        <li><strong>Engineering Colleges:</strong> Technical fests, department-level coding events, inter-college collaborative hackathons.</li>
        <li><strong>Tech Communities:</strong> Developer meetup groups, open-source clubs, bootcamp cohorts.</li>
        <li><strong>Startups & Companies:</strong> Product innovation sprints, campus hiring drives, internal team-building events.</li>
        <li><strong>NGOs & Education Platforms:</strong> Social impact hackathons, education innovation challenges.</li>
      </ul>

      <h3>How to Launch Your Hackathon in 2 Minutes</h3>
      <p>On SkillValix, creating a hackathon is as fast as filling a form. You set the title, description, deadline, team size limits, payment config, and submission rules. The platform goes live instantly. Participants can register the same minute.</p>
      <p>Ready to run India's next great hackathon? <a href="https://www.skillvalix.com/host" target="_blank">Submit your hosting request here</a> and let's make it happen.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T10:00:00+05:30",
    modifiedDate: "2026-04-02T10:00:00+05:30",
    date: "April 2, 2026",
    readTime: "8 min read",
    wordCount: 540,
    category: "Career & Industry",
    tags: ["Hackathon", "Host Hackathon India", "Event Management", "Coding Events", "Tech Community"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developers collaborating at a hackathon event in India",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-host-hackathon-in-india-2026",
    relatedCourse: {
      title: "The Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Build the skills to compete and win at your first hackathon — free with a verifiable certificate."
    }
  },
  {
    id: "best-online-hackathons-india-2026",
    title: "Best Online Hackathons in India 2026: Where to Compete & Win",
    metaTitle: "Best Online Hackathons in India 2026 — Win Prizes & Certificates | SkillValix",
    metaDescription: "Looking for the best online hackathons in India in 2026? Discover top coding challenges, win cash prizes, and earn verifiable digital certificates. Find and join live events on SkillValix.",
    keywords: [
      "best online hackathons in India 2026",
      "online hackathon India",
      "coding challenges India 2026",
      "hackathon for students India",
      "free hackathon online India",
      "win prizes hackathon India",
      "hackathon with certificate India",
      "coding competition India 2026"
    ],
    excerpt: "Forget scouring Reddit and Discord for hackathon announcements. Here is your authoritative guide to finding, joining, and winning the best online hackathons in India in 2026 — complete with prizes and certificates.",
    content: `
      <h2>Why Online Hackathons are the Best Career Move for Indian Developers</h2>
      <p>Five years ago, participating in a top hackathon meant travelling to Mumbai, Bengaluru, or Delhi, booking hotels, and taking time off college. In 2026, the most prestigious, high-paying coding challenges are fully online. You compete from your room, collaborate with teammates across the country, and win cash prizes — all without leaving your city.</p>
      <p>For engineering students and early-career developers in India, hackathons are the single fastest way to build a portfolio, earn industry recognition, and get noticed by recruiters.</p>

      <h3>What Makes a Hackathon "The Best"?</h3>
      <p>Not all hackathons are equal. Before registering, evaluate each event on these five criteria:</p>
      <ul>
        <li><strong>Clear Problem Statement:</strong> The best hackathons give you a defined scope. Vague "build anything" prompts lead to vague projects that do not impress judges or employers.</li>
        <li><strong>Transparent Judging Criteria:</strong> You should know exactly how your project will be evaluated — innovation, technical complexity, UX, and presentation weight.</li>
        <li><strong>Structured Registration:</strong> A professional event uses a proper platform — not a Google Form. Platforms like <a href="https://www.skillvalix.com/hackathons" target="_blank">SkillValix</a> manage your team, payment, and submission in one place.</li>
        <li><strong>Real Prizes:</strong> Cash prizes, internship offers, or guaranteed interview opportunities from real companies signal a serious event.</li>
        <li><strong>Verifiable Certificates:</strong> A certificate you can link to on LinkedIn — with a unique ID that anyone can verify — carries far more weight than a PNG file emailed to you.</li>
      </ul>

      <h3>How to Maximize Your Chances of Winning</h3>
      <ol>
        <li><strong>Read the brief 3 times.</strong> Most losing teams solve the wrong problem.</li>
        <li><strong>Build an MVP, not a masterpiece.</strong> A working demo with 3 features beats a perfect design with 0 features. Judges click buttons.</li>
        <li><strong>Prepare a 2-minute pitch.</strong> Your presentation matters as much as your code. Practice explaining your solution to a non-technical person.</li>
        <li><strong>Document on GitHub.</strong> A clean README with screenshots, a live demo link, and install instructions is the mark of a professional team.</li>
      </ol>

      <h3>Where to Find the Best Online Hackathons in India</h3>
      <p>Rather than chasing scattered announcements across social media, visit <a href="https://www.skillvalix.com/hackathons" target="_blank">SkillValix Hackathons</a> — a curated hub of live and upcoming events built specifically for the Indian developer community. Each event page shows you the full details: deadline, team size, prizes, rules, and submission format — all in one place.</p>
      <p>Register, form your team, and start building. Your next win is one hackathon away.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T11:00:00+05:30",
    modifiedDate: "2026-04-02T11:00:00+05:30",
    date: "April 2, 2026",
    readTime: "7 min read",
    wordCount: 510,
    category: "Career & Industry",
    tags: ["Hackathon", "Online Hackathon India", "Coding Competition", "Student Career", "Win Prizes"],
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Team of young Indian developers working together at a hackathon",
    canonicalUrl: "https://www.skillvalix.com/blog/best-online-hackathons-india-2026",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Python is the #1 language used in winning AI and data-focused hackathons — learn it free."
    }
  },
  {
    id: "corporate-hackathon-platform-india-hiring",
    title: "Why Indian Startups are Replacing Technical Interviews with Hackathons",
    metaTitle: "Corporate Hackathon Platform India — Hire Developers Through Hackathons | SkillValix",
    metaDescription: "Discover why leading Indian startups and companies are using hackathons as their primary technical hiring tool in 2026. Learn how to host a corporate hackathon and find your next best engineer.",
    keywords: [
      "corporate hackathon platform India",
      "hire developers through hackathon",
      "hackathon for recruitment India",
      "tech hiring hackathon 2026",
      "host hackathon for companies",
      "campus hackathon India",
      "startup hackathon India",
      "developer recruitment platform India"
    ],
    excerpt: "The traditional technical interview is broken. Whiteboard problems cannot tell you if a candidate can ship real code under real pressure. Here is why India's fastest-growing companies are switching to hackathon-based hiring.",
    content: `
      <h2>The Technical Interview is Failing Everyone</h2>
      <p>Engineering hiring in India follows a predictable, broken pattern. A recruiter screens 500 resumes. 50 candidates get a LeetCode online assessment. 10 pass. 5 get a technical interview. 2 get offers. Of those 2, one joins and turns out to be a great LeetCode solver but a mediocre builder.</p>
      <p>The problem is fundamental: the skills required to ace a whiteboard interview have almost zero correlation with the skills required to build a product under a deadline.</p>

      <h3>What a Hackathon Reveal That an Interview Cannot</h3>
      <ul>
        <li><strong>Real-World Building Ability:</strong> Can the candidate scope a problem, make architecture decisions, and ship working code in 48 hours? A hackathon answers this with certainty.</li>
        <li><strong>Collaboration Under Pressure:</strong> Can they communicate clearly with teammates, divide tasks efficiently, and integrate each other's code? You will see this live.</li>
        <li><strong>Product Sense:</strong> Do they think about the user experience, or do they only think about algorithms? The best engineers do both.</li>
        <li><strong>Code Quality:</strong> A GitHub submission with clean commits, a proper README, and readable code tells you more than any take-home assessment.</li>
      </ul>

      <h3>How to Run a Hiring Hackathon Without Building Custom Infrastructure</h3>
      <p>The #1 reason companies avoided hackathon-based hiring in the past was logistics. Building a custom registration portal, payment system, submission tracker, and scoring dashboard just for hiring felt disproportionate.</p>
      <p>In 2026, that excuse no longer exists. <a href="https://www.skillvalix.com/host" target="_blank">SkillValix</a> provides all of this out of the box. As a company, you submit your event details and get a fully functional hackathon page live within minutes:</p>
      <ul>
        <li>Participants register and form teams on the platform</li>
        <li>Your problem statement and judging criteria are displayed clearly</li>
        <li>Teams submit GitHub links, live demos, or PDFs directly</li>
        <li>Your hiring team reviews submissions side-by-side and assigns scores</li>
        <li>Top performers get certificates and an invitation to the next interview round</li>
      </ul>

      <h3>The ROI of Hackathon Hiring</h3>
      <p>Consider this: a traditional campus hiring drive costs ₹3–8 lakhs when you factor in travel, setup, and HR hours. A hackathon on a platform costs a fraction of that, reaches 10x the candidate pool nationally, and filters talent far more effectively.</p>
      <p>Companies running hackathons through SkillValix have reported finding candidates they would have screened out on paper — students from Tier-2 colleges with extraordinary building ability who simply test poorly in interview formats.</p>

      <h3>Get Started Today</h3>
      <p>If you are a startup, a scale-up, or an established tech company looking for your next great engineer, stop relying on resume screening and LeetCode. <a href="https://www.skillvalix.com/host" target="_blank">Submit a hosting request on SkillValix</a> and run your first corporate hackathon this quarter.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T12:00:00+05:30",
    modifiedDate: "2026-04-02T12:00:00+05:30",
    date: "April 2, 2026",
    readTime: "8 min read",
    wordCount: 580,
    category: "Career & Industry",
    tags: ["Corporate Hackathon", "Tech Hiring India", "Recruitment", "Hackathon Platform", "Startups India"],
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Corporate team evaluating developer hackathon submissions in India",
    canonicalUrl: "https://www.skillvalix.com/blog/corporate-hackathon-platform-india-hiring",
    relatedCourse: {
      title: "AI & Machine Learning Fundamentals",
      slug: "basics-of-artificial-intelligence-beginners",
      description: "The skill companies want most in hackathon candidates — learn it free with a verifiable certificate."
    }
  },
  {
    id: "free-online-courses-with-certificate-india-2026",
    title: "Best Free Online Courses with Certificate in India 2026 (No Fee, Verified)",
    metaTitle: "Best Free Online Courses with Certificate in India 2026 | SkillValix",
    metaDescription: "Looking for free online courses with certificate in India? SkillValix offers 100% free courses in HTML, CSS, JavaScript, Python, Java & AI — all with verifiable certificates. No fee, no credit card.",
    keywords: [
      "free online courses with certificate in India",
      "free courses with certificate India 2026",
      "free certification courses India",
      "online courses free certificate India",
      "best free online courses India",
      "free skill courses India",
      "free certificate courses for students India",
      "free online learning India"
    ],
    excerpt: "India has thousands of free course platforms — but very few give you a certificate that actually means something. Here are the best free online courses with verifiable certificates available to Indian students in 2026.",
    content: `
      <h2>Why Free Certificates in India Are a Big Deal in 2026</h2>
      <p>India produces over 1.5 million engineering graduates annually. The brutal reality? Most of them compete for the same entry-level roles with nearly identical resumes. A free, verifiable certificate from a credible platform is one of the fastest ways to make your application stand out — especially if you're a student from a Tier-2 or Tier-3 college.</p>
      <p>The good news: you don't need to spend a rupee. The best free online courses with certificates in India are available right now, and they're more comprehensive than most paid alternatives.</p>

      <h2>What Makes a Free Certificate Worth Having?</h2>
      <p>Not all free certificates are equal. Before you spend 10 hours on a course, check for these three things:</p>
      <ul>
        <li><strong>Verifiability:</strong> Can an employer independently verify that you actually completed the course? A good platform gives every certificate a unique ID that anyone can check online.</li>
        <li><strong>Exam requirement:</strong> Certificates that require you to pass an actual exam are worth far more than course-completion certificates. Completion proves you watched. An exam proves you understood.</li>
        <li><strong>No paywall at the end:</strong> Some platforms offer free course access but then charge you for the certificate. Avoid these. On SkillValix, both learning and the certificate are completely free.</li>
      </ul>

      <h2>Best Free Online Courses with Certificate in India — 2026 List</h2>

      <h3>1. HTML5 for Beginners — SkillValix</h3>
      <p>The foundation of all web development. This free course covers everything from document structure to forms, semantic HTML, and SEO-relevant markup. Pass the exam and get a verified certificate immediately. Perfect for beginners — no prior knowledge required. <a href="/courses/ultimate-html-masterclass">Start the HTML course free →</a></p>

      <h3>2. CSS for Beginners: Zero to Pro — SkillValix</h3>
      <p>Modern CSS including Flexbox, Grid, animations, and responsive design. This course is built for someone who has finished HTML and wants to make websites look professional. Free, self-paced, and ends with a certificate on exam completion. <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">Start the CSS course free →</a></p>

      <h3>3. JavaScript Masterclass — SkillValix</h3>
      <p>The most sought-after skill in Indian tech hiring. This free JavaScript course covers variables, functions, DOM manipulation, closures, async/await, and APIs. Verified certificate included. <a href="/courses/ultimate-javascript-masterclass">Start the JavaScript course free →</a></p>

      <h3>4. Python for Beginners — SkillValix</h3>
      <p>Used in AI, data science, automation, and backend development. Python is the single most versatile language to learn in 2026. This free course takes you from zero to functional Python programmer with a verified certificate. <a href="/courses/ultimate-python-masterclass">Start the Python course free →</a></p>

      <h3>5. Java Programming Masterclass — SkillValix</h3>
      <p>Java remains the dominant language for Android development, enterprise software, and backend systems. This free course covers OOP, collections, streams, and exception handling. Certificate included. <a href="/courses/ultimate-java-masterclass">Start the Java course free →</a></p>

      <h3>6. AI & Machine Learning Fundamentals — SkillValix</h3>
      <p>Artificial intelligence is the defining skill of this decade. This course gives you a conceptual and practical foundation in AI — neural networks, machine learning pipelines, real-world AI use cases — all free with a verifiable certificate. <a href="/courses/basics-of-artificial-intelligence-beginners">Start the AI course free →</a></p>

      <h2>How to Add These Certificates to LinkedIn</h2>
      <p>Once you earn your certificate on SkillValix, here's exactly how to add it to your LinkedIn profile:</p>
      <ol>
        <li>Go to your LinkedIn profile and click <strong>Add section → Licenses & Certifications</strong></li>
        <li>Enter the course name as the Certificate Name</li>
        <li>Set Issuing Organization to <strong>SkillValix</strong></li>
        <li>Enter your certificate's unique ID in the Credential ID field</li>
        <li>Add the verification URL: <strong>https://www.skillvalix.com/verify/[your-certificate-id]</strong></li>
      </ol>
      <p>This makes your certificate independently verifiable — any recruiter can click the URL and instantly confirm your achievement.</p>

      <h2>Beyond Certificates: Student Hackathons</h2>
      <p>A certificate shows you can learn. A <a href="/hackathons">hackathon project</a> shows you can build. The students who combine both — a verifiable certificate and a real hackathon submission — are the ones who consistently stand out in applications. SkillValix runs free online student hackathons year-round, open to beginners. No registration fee. Every participant gets a certificate.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Are SkillValix certificates recognized by employers in India?</strong><br/>
      Yes. Each SkillValix certificate has a unique verification ID. Employers can verify your achievement at skillvalix.com/verify in seconds. Thousands of Indian students have successfully added these certificates to their LinkedIn profiles and received interview calls from IT companies, startups, and product companies.</p>

      <p><strong>Q2: Do I need to pay anything for the certificate?</strong><br/>
      No. On SkillValix, both the course content and the certificate are completely free. You pass the exam, you get the certificate — no credit card, no hidden fees, no subscription.</p>

      <p><strong>Q3: Which free course should I start with as a complete beginner?</strong><br/>
      Start with HTML. It's the foundation of all web development and takes most students just 3–4 hours to complete. Then move to CSS, then JavaScript. This three-course path gives you a full frontend web development foundation — all free, all with certificates.</p>

      <p><strong>Q4: Can students from any college in India join SkillValix?</strong><br/>
      Absolutely. SkillValix is open to all students across India — Tier-1, Tier-2, and Tier-3 colleges. The platform was specifically built to give equal opportunity to students who don't have access to premium coaching or expensive courses.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-06T09:00:00+05:30",
    modifiedDate: "2026-04-08T09:00:00+05:30",
    date: "April 6, 2026",
    readTime: "11 min read",
    wordCount: 1180,
    category: "Career & Industry",
    tags: ["Free Courses India", "Free Certificate India", "Online Learning India", "SkillValix", "Student Skills", "Certification"],
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Indian student studying online on laptop with free course certificate on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/free-online-courses-with-certificate-india-2026",
    relatedCourse: {
      title: "Free Online Courses — All Subjects",
      slug: "ultimate-html-masterclass",
      description: "Start with HTML — the foundation of all web development. Free course, free certificate."
    }
  },
  {
    id: "how-to-win-a-hackathon-beginner-guide-2026",
    title: "How to Win a Hackathon: Complete Beginner Guide (2026)",
    metaTitle: "How to Win a Hackathon: Beginner Strategy Guide 2026 | SkillValix",
    metaDescription: "Want to win your first hackathon? This complete beginner guide covers team formation, idea selection, project execution, and presentation strategies that judges actually reward.",
    keywords: [
      "how to win a hackathon",
      "hackathon tips for beginners",
      "how to participate in hackathon",
      "hackathon strategy 2026",
      "first hackathon tips",
      "online hackathon for beginners India",
      "hackathon project ideas",
      "hackathon winning tips"
    ],
    excerpt: "Most beginners lose hackathons not because they lack skill — but because they pick the wrong idea, burn time on the wrong features, or present badly. Here is the complete strategy guide for your first hackathon win.",
    content: `
      <h2>Why Most Beginners Don't Win — And How to Fix It</h2>
      <p>The #1 reason beginners don't win hackathons has nothing to do with coding ability. It's strategy. Most first-timers try to build something impressive rather than something <em>complete</em>. Judges don't reward ambition — they reward execution. A simple idea that actually works beats a complex idea that barely runs every single time.</p>
      <p>This guide gives you the exact strategy to maximize your chances of winning your first hackathon — even if you're a beginner, even if you're a solo participant, and even if you've never built anything at scale before.</p>

      <h2>Step 1: Pick the Right Hackathon</h2>
      <p>Not all hackathons are equal. As a beginner, look for:</p>
      <ul>
        <li><strong>Beginner-friendly themes:</strong> "Social Impact", "EdTech", "Health" are easier to build for than "Blockchain" or "Quantum Computing"</li>
        <li><strong>Online format:</strong> Online hackathons remove travel stress and let you work in your own environment. <a href="/hackathons">SkillValix hackathons</a> are 100% online and free to enter.</li>
        <li><strong>Participation certificates:</strong> Even if you don't win, you leave with a verifiable certificate documenting your participation</li>
        <li><strong>Solo or small team options:</strong> Solo participation means you control every decision and submit without coordination complexity</li>
      </ul>

      <h2>Step 2: Idea Selection — Think Small, Think Complete</h2>
      <p>The most common beginner mistake is scope creep — picking an idea that requires 10 features and only finishing 3. Here's the winning framework:</p>
      <ul>
        <li><strong>One core problem, one core solution.</strong> If you can't describe your project in one sentence, it's too complex.</li>
        <li><strong>Solve a real problem for a specific user.</strong> "An app for students to track study time with auto-scheduling" beats "An AI-powered super platform for productivity"</li>
        <li><strong>Build something you can demo in 2 minutes.</strong> Judges see dozens of projects. A clean, working demo that takes 90 seconds to show wins over a polished pitch deck for something that doesn't work.</li>
      </ul>

      <h2>Step 3: Team Formation (If You're Not Solo)</h2>
      <p>The ideal hackathon team of 2–4 people has one person in each role:</p>
      <ul>
        <li><strong>Builder/Developer:</strong> Focuses on making the product actually work</li>
        <li><strong>Designer:</strong> Makes it look credible — even basic Figma mockups help enormously</li>
        <li><strong>Presenter:</strong> Owns the pitch and the demo — the person who can talk confidently about the problem and solution</li>
      </ul>
      <p>If you're building solo, allocate your time: 70% building, 20% designing/polishing, 10% preparing your presentation or submission document.</p>

      <h2>Step 4: Execution — The 3-Phase Approach</h2>
      <h3>Phase 1: Foundation (First 30% of time)</h3>
      <p>Get the core working. No UI polish, no extra features — just the essential user flow working end to end. This is your safety net. If you run out of time, this is what you submit.</p>

      <h3>Phase 2: Polish (Middle 50% of time)</h3>
      <p>Add the UI layer, fix obvious bugs, connect loose wires. This is where most of your visible progress comes from.</p>

      <h3>Phase 3: Submission Prep (Final 20% of time)</h3>
      <p>Stop adding features. Write your README or submission document. Record a clear demo video if required. A well-documented, mediocre project consistently beats an undocumented excellent one.</p>

      <h2>Step 5: The Winning Submission</h2>
      <p>Most hackathon submissions are judged on 4 things:</p>
      <ol>
        <li><strong>Problem clarity:</strong> Did you clearly define a real problem?</li>
        <li><strong>Solution quality:</strong> Does your solution actually address the problem?</li>
        <li><strong>Technical execution:</strong> Does it work? Is the code reasonable?</li>
        <li><strong>Impact potential:</strong> Could this actually help people if developed further?</li>
      </ol>
      <p>Structure your submission document around these four points. One paragraph each. Clear, direct language. No jargon.</p>

      <h2>Where to Practice: Free Hackathons on SkillValix</h2>
      <p>The best way to get better at hackathons is to do them. <a href="/hackathons">SkillValix hackathons</a> are specifically designed for beginners aged 16–30. They're online, free to enter, have beginner-friendly themes, and every participant receives a verified certificate whether they win or not. Winning teams receive merit certificates that are verifiable on your public profile.</p>
      <p>Before you join, strengthen your fundamentals — the <a href="/courses/ultimate-javascript-masterclass">free JavaScript course</a> and <a href="/courses/ultimate-python-masterclass">free Python course</a> on SkillValix will give you the technical foundation to build something meaningful in any hackathon environment.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Can a complete beginner win a hackathon?</strong><br/>
      Yes — if they pick the right hackathon and execute strategically. Beginners who focus on building a simple, complete, well-documented solution often beat advanced teams who overscope and submit something broken. Execution beats ambition every time.</p>

      <p><strong>Q2: Do I need a team to participate in hackathons?</strong><br/>
      No. Many hackathons, including those on SkillValix, allow solo participation. Solo submissions are evaluated on the same criteria as team submissions. Working solo means you control every decision, which can be an advantage for beginners learning their workflow.</p>

      <p><strong>Q3: What programming languages should I know for hackathons?</strong><br/>
      HTML + CSS + JavaScript covers the vast majority of hackathon use cases (web apps). Python is useful for data/AI themed challenges. Most judges don't care which language you use — they care that your project works.</p>

      <p><strong>Q4: How do I get a hackathon participation certificate?</strong><br/>
      On SkillValix, every participant who submits a valid project receives a verified participation certificate. Winners receive special merit certificates. Both are verifiable on your public SkillValix profile.</p>
    `,
    author: "Amit Patel",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-07T09:00:00+05:30",
    modifiedDate: "2026-04-08T09:00:00+05:30",
    date: "April 7, 2026",
    readTime: "12 min read",
    wordCount: 1250,
    category: "Career & Industry",
    tags: ["Hackathon Tips", "How to Win Hackathon", "Beginner Hackathon", "Online Hackathon India", "Student Hackathon", "Hackathon Strategy"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Students collaborating on a hackathon project with laptops in a bright workspace",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-win-a-hackathon-beginner-guide-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Build the JavaScript skills you need to ship a hackathon project in hours. Free with certificate."
    }
  },
  {
    id: "web-development-roadmap-2026-beginners",
    title: "Web Development Roadmap 2026: The Complete Free Guide for Beginners",
    metaTitle: "Web Development Roadmap 2026: Complete Free Guide for Beginners | SkillValix",
    metaDescription: "Follow the complete web development roadmap for 2026. Learn HTML, CSS, JavaScript, React, Node.js and more — in the right order, with free resources and certificates at every step.",
    keywords: [
      "web development roadmap 2026",
      "how to become a web developer 2026",
      "web development for beginners",
      "frontend development roadmap",
      "learn web development free India",
      "web developer roadmap beginners",
      "HTML CSS JavaScript roadmap",
      "full stack development roadmap 2026"
    ],
    excerpt: "There's no shortage of web development content — but no one tells you what to learn first, what to skip, and what order actually makes sense. This is the complete, opinionated roadmap for 2026.",
    content: `
      <h2>The Problem with Most Web Dev Roadmaps</h2>
      <p>Search "web development roadmap" and you'll get a 200-technology diagram that makes you feel like you need 5 years to even start. This guide is different. It gives you the exact learning path — in sequence, with time estimates — to go from zero to job-ready web developer using only free resources.</p>

      <h2>Phase 1: HTML — The Non-Negotiable Foundation (2–4 weeks)</h2>
      <p>Every website on the internet is built on HTML. No exceptions. You cannot skip this. HTML teaches you the structure of the web — how browsers understand content, how pages are organized, and how to write meaningful markup that search engines and screen readers can understand.</p>
      <p>What to learn in HTML:</p>
      <ul>
        <li>Document structure: DOCTYPE, html, head, body</li>
        <li>Semantic tags: article, section, nav, header, footer, main, aside</li>
        <li>Links, images, and multimedia</li>
        <li>Forms and input validation</li>
        <li>Tables and lists</li>
        <li>Accessibility basics (aria-label, alt attributes)</li>
      </ul>
      <p>Free resource: <a href="/courses/ultimate-html-masterclass">The Ultimate HTML Masterclass on SkillValix</a> covers all of this with code examples, quizzes, and a verifiable certificate.</p>
      <p><strong>Time estimate:</strong> 3–4 hours of focused study. Most determined beginners finish in a weekend.</p>

      <h2>Phase 2: CSS — Making Things Look Good (3–5 weeks)</h2>
      <p>HTML gives you structure. CSS gives you design. In 2026, CSS is remarkably powerful — you can build complex layouts, animations, and responsive designs with pure CSS alone.</p>
      <p>What to learn in CSS:</p>
      <ul>
        <li>Selectors, specificity, and the cascade</li>
        <li>Box model: margin, padding, border</li>
        <li>Flexbox — for one-dimensional layouts (navbars, card rows)</li>
        <li>CSS Grid — for two-dimensional layouts (full page structure)</li>
        <li>Responsive design and media queries</li>
        <li>CSS Custom Properties (variables)</li>
        <li>Transitions and animations</li>
      </ul>
      <p>Free resource: <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro on SkillValix</a> covers everything above in a structured, beginner-first format.</p>
      <p><strong>Time estimate:</strong> 5–6 hours. This is where beginners often spend the most time — CSS is intuitive once it clicks, but it takes practice.</p>

      <h2>Phase 3: JavaScript — Bringing Pages to Life (6–10 weeks)</h2>
      <p>JavaScript is the most important language for web development. It makes websites interactive — handling clicks, fetching data from APIs, updating content without page reloads, and building complex user interfaces.</p>
      <p>What to learn in JavaScript (in this order):</p>
      <ul>
        <li>Variables, data types, operators</li>
        <li>Functions, scope, and closures</li>
        <li>DOM manipulation — selecting, modifying, and adding HTML elements</li>
        <li>Events — click, submit, keypress</li>
        <li>Arrays and objects — the two most important data structures</li>
        <li>Async JavaScript — Promises, async/await, fetch API</li>
        <li>ES6+ features — arrow functions, destructuring, spread, modules</li>
      </ul>
      <p>Free resource: <a href="/courses/ultimate-javascript-masterclass">The Ultimate JavaScript Masterclass on SkillValix</a> covers all of the above with a verifiable certificate on completion.</p>
      <p><strong>Time estimate:</strong> 6–8 hours of course content, plus 20–40 hours of practice projects. JavaScript requires building things to truly internalize.</p>

      <h2>Phase 4: Build 3 Projects (4–6 weeks)</h2>
      <p>After HTML, CSS, and JavaScript, stop learning and start building. The three best beginner projects:</p>
      <ol>
        <li><strong>Personal portfolio website</strong> — Shows your HTML/CSS skills and becomes your online presence</li>
        <li><strong>To-do list app with localStorage</strong> — Tests your JavaScript, DOM manipulation, and data persistence</li>
        <li><strong>Weather app using a public API</strong> — Introduces async JavaScript, fetch, and working with JSON data</li>
      </ol>
      <p>Put these on GitHub. Link them in your LinkedIn profile. This is your portfolio.</p>

      <h2>Phase 5: React (6–8 weeks)</h2>
      <p>React is the dominant JavaScript framework for building complex user interfaces. It's used by Meta, Airbnb, Netflix, and thousands of startups. Once you understand JavaScript, React's concepts (components, state, props, hooks) follow logically.</p>

      <h2>Phase 6: Backend Basics — Node.js & Express (4–6 weeks)</h2>
      <p>Frontend alone limits what you can build. Node.js lets you write JavaScript on the server. Combined with Express.js and a database like MongoDB, you can build full-stack applications — the foundation for most modern web products.</p>

      <h2>Accelerate with Hackathons</h2>
      <p>Nothing accelerates learning faster than building something under pressure. <a href="/hackathons">SkillValix student hackathons</a> give you a real constraint — a theme, a deadline, and a submission requirement. The projects you build in hackathons become your strongest portfolio pieces.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: How long does it take to become a web developer from scratch?</strong><br/>
      With focused, consistent effort (2–3 hours per day), most beginners are job-ready in 6–12 months. The roadmap above takes approximately 6 months for a dedicated learner working on weekends and evenings.</p>

      <p><strong>Q2: Do I need a computer science degree to become a web developer?</strong><br/>
      No. Web development is one of the most accessible fields for self-learners. Thousands of Indian developers — including senior engineers at top product companies — are self-taught. What matters is your GitHub portfolio and your ability to build things.</p>

      <p><strong>Q3: Which is the best first programming language for web development?</strong><br/>
      HTML first (it's not technically a programming language but it's the foundation), then CSS, then JavaScript. This order is non-negotiable — each builds on the previous one.</p>

      <p><strong>Q4: Are free courses enough to get a web development job?</strong><br/>
      Yes, if you supplement them with real projects. The free HTML, CSS, and JavaScript courses on SkillValix — combined with 3–5 portfolio projects and a hackathon participation — give you everything you need to apply for junior frontend roles.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-08T09:00:00+05:30",
    modifiedDate: "2026-04-08T09:00:00+05:30",
    date: "April 8, 2026",
    readTime: "13 min read",
    wordCount: 1320,
    category: "Career & Industry",
    tags: ["Web Development Roadmap", "Learn Web Development", "Frontend Development", "HTML CSS JavaScript", "Web Dev 2026", "Beginner Guide"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer looking at web development roadmap on dual monitor setup",
    canonicalUrl: "https://www.skillvalix.com/blog/web-development-roadmap-2026-beginners",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass",
      slug: "ultimate-html-masterclass",
      description: "Start your web development journey here. Free course, free certificate."
    }
  },
  {
    id: "javascript-interview-questions-2026",
    title: "Top 30 JavaScript Interview Questions & Answers for 2026 (Freshers & Experienced)",
    metaTitle: "Top 30 JavaScript Interview Questions & Answers 2026 | SkillValix",
    metaDescription: "Prepare for your JavaScript interview with the top 30 most asked JS questions in 2026. Covers closures, promises, event loop, hoisting, this keyword, and ES6+ features with clear answers.",
    keywords: [
      "JavaScript interview questions 2026",
      "JavaScript interview questions for freshers",
      "JavaScript interview questions and answers",
      "JS interview questions",
      "JavaScript coding interview questions",
      "JavaScript ES6 interview questions",
      "closures JavaScript interview",
      "promises async await interview questions"
    ],
    excerpt: "Preparing for a JavaScript interview in 2026? These are the 30 most commonly asked questions — from closures and hoisting to event loops and async/await — with clear, concise answers you can use immediately.",
    content: `
      <h2>How to Use This Guide</h2>
      <p>Don't memorize these answers. Understand them. Interviewers at product companies can immediately tell when candidates are reciting answers versus when they actually understand the concept. Read each question, cover the answer, try to explain it in your own words, then check the answer for accuracy.</p>

      <h2>Core JavaScript Concepts</h2>

      <h3>Q1: What is the difference between var, let, and const?</h3>
      <p><code>var</code> is function-scoped and hoisted (initialized as undefined). <code>let</code> and <code>const</code> are block-scoped and in the temporal dead zone before their declaration line. <code>const</code> creates a reference that cannot be reassigned — but the object or array it points to can still be mutated. In modern JavaScript, use <code>const</code> by default, <code>let</code> when you need to reassign, and never use <code>var</code>.</p>

      <h3>Q2: What is hoisting in JavaScript?</h3>
      <p>Hoisting is JavaScript's behavior of moving function and variable declarations to the top of their scope before code executes. Function declarations are fully hoisted (available before the line they appear). <code>var</code> declarations are hoisted but initialized as <code>undefined</code>. <code>let</code> and <code>const</code> are hoisted but NOT initialized — accessing them before declaration throws a ReferenceError (the Temporal Dead Zone).</p>

      <h3>Q3: Explain closures in JavaScript.</h3>
      <p>A closure is a function that retains access to variables from its outer (enclosing) scope even after that outer function has returned. This happens because JavaScript functions carry a reference to their lexical environment. Closures are used for data encapsulation, factory functions, memoization, and event handlers.</p>
      <pre><code>function makeCounter() {
  let count = 0;           // 'count' is in makeCounter's scope
  return function() {
    count++;               // Inner function retains access — closure
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2 — 'count' persists across calls</code></pre>

      <h3>Q4: What is the event loop in JavaScript?</h3>
      <p>JavaScript is single-threaded but handles async tasks through the event loop. The call stack executes synchronous code. When an async operation completes (setTimeout, fetch, etc.), its callback is placed in the callback queue. The event loop continuously checks: if the call stack is empty, it pushes the next callback from the queue onto the stack. Microtasks (Promises) have a separate, higher-priority queue that is drained completely before the next macrotask callback runs.</p>

      <h3>Q5: What is the difference between == and ===?</h3>
      <p><code>==</code> performs type coercion before comparing. <code>===</code> checks both value and type without coercion. Always use <code>===</code>. Examples of <code>==</code> surprises: <code>0 == false</code> (true), <code>'' == false</code> (true), <code>null == undefined</code> (true).</p>

      <h2>Functions & Scope</h2>

      <h3>Q6: What is the difference between function declarations and function expressions?</h3>
      <p>Function declarations (<code>function foo() {}</code>) are fully hoisted — you can call them before they appear in code. Function expressions (<code>const foo = function() {}</code>) are not available before their line. Arrow functions are always expressions. In modern code, prefer arrow functions for callbacks and regular functions for methods that need their own <code>this</code>.</p>

      <h3>Q7: What does the 'this' keyword refer to?</h3>
      <p><code>this</code> refers to the execution context. In a regular function, <code>this</code> is determined at call time — it's the object before the dot. In an arrow function, <code>this</code> is lexically bound (inherited from the enclosing scope at definition time). <code>this</code> inside a class method refers to the class instance. In strict mode global code, <code>this</code> is undefined.</p>

      <h3>Q8: What is the difference between call, apply, and bind?</h3>
      <p>All three set the value of <code>this</code> explicitly. <code>call(thisArg, arg1, arg2)</code> invokes the function immediately. <code>apply(thisArg, [args])</code> invokes immediately but passes args as an array. <code>bind(thisArg)</code> returns a new function with <code>this</code> permanently set — useful for event handlers and callbacks.</p>

      <h2>Async JavaScript</h2>

      <h3>Q9: What is a Promise? What are its states?</h3>
      <p>A Promise represents an asynchronous operation that will eventually produce a value. States: <strong>Pending</strong> (initial), <strong>Fulfilled</strong> (resolved with a value), <strong>Rejected</strong> (failed with a reason). Promises are consumed with <code>.then()</code> for success, <code>.catch()</code> for errors, and <code>.finally()</code> for cleanup regardless of outcome.</p>

      <h3>Q10: What is async/await and how does it differ from Promises?</h3>
      <p><code>async/await</code> is syntactic sugar over Promises that makes async code read like synchronous code. An <code>async</code> function always returns a Promise. <code>await</code> pauses execution until the Promise resolves. Error handling uses try/catch instead of .catch(). Under the hood, they are identical — async/await compiles to Promise chains.</p>

      <h2>ES6+ Features</h2>

      <h3>Q11: What is destructuring?</h3>
      <p>Destructuring extracts values from arrays or properties from objects into distinct variables.</p>
      <pre><code>// Object destructuring
const { name, age } = user;

// Array destructuring
const [first, second] = numbers;

// With defaults
const { role = 'user' } = options;</code></pre>

      <h3>Q12: What is the spread operator and rest parameters?</h3>
      <p>Both use <code>...</code>. The spread operator expands iterables: <code>const merged = [...arr1, ...arr2]</code>. Rest parameters collect remaining function arguments: <code>function sum(...nums)</code>. Same syntax, opposite direction — spread expands, rest collects.</p>

      <h2>Prototype & OOP</h2>

      <h3>Q13: What is the prototype chain?</h3>
      <p>Every JavaScript object has a <code>[[Prototype]]</code> link to another object. When you access a property, JavaScript first looks on the object itself, then walks up the prototype chain until it finds it or reaches <code>null</code>. This is the mechanism behind inheritance in JavaScript — classes are syntactic sugar over prototype-based inheritance.</p>

      <h2>Build the Skills These Questions Test</h2>
      <p>Understanding these concepts deeply requires practice — not memorization. The <a href="/courses/ultimate-javascript-masterclass">free JavaScript Masterclass on SkillValix</a> covers all of these topics in depth: closures, async/await, the event loop, prototypes, and ES6+ features. Completing it gives you both the knowledge and a verified certificate to prove it.</p>
      <p>To get real interview experience, join a <a href="/hackathons">SkillValix hackathon</a> — building a real project under time pressure is the single best way to make these concepts stick.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q: Which JavaScript topics are most commonly asked in fresher interviews in India?</strong><br/>
      Closures, hoisting, var/let/const differences, the event loop, Promises, and array methods (map, filter, reduce) are asked in nearly every JavaScript interview for freshers in India. Know these inside out.</p>

      <p><strong>Q: How should I prepare for a JavaScript interview in 2 weeks?</strong><br/>
      Day 1–5: Core concepts (closures, hoisting, this, prototype). Day 6–10: Async JavaScript (Promises, async/await, event loop). Day 11–14: Build 2 small projects from scratch and do mock interviews explaining your code.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-08T10:00:00+05:30",
    modifiedDate: "2026-04-08T10:00:00+05:30",
    date: "April 8, 2026",
    readTime: "15 min read",
    wordCount: 1480,
    category: "JavaScript",
    tags: ["JavaScript Interview", "JS Interview Questions", "JavaScript 2026", "Fresher Interview", "Coding Interview", "JavaScript Concepts"],
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "JavaScript code on screen with interview preparation notes on desk",
    canonicalUrl: "https://www.skillvalix.com/blog/javascript-interview-questions-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Master every concept covered in these interview questions — free with a verifiable certificate."
    }
  },
  {
    id: "python-for-data-science-beginners-2026",
    title: "Python for Data Science: Beginner Guide 2026 (Free Resources Included)",
    metaTitle: "Python for Data Science Beginners 2026 – Free Guide | SkillValix",
    metaDescription: "Learn Python for Data Science from scratch in 2026. Covers NumPy, Pandas, data visualization, and machine learning basics — with free learning resources and a step-by-step roadmap for beginners.",
    keywords: [
      "Python for data science beginners",
      "learn Python for data science 2026",
      "Python data science roadmap",
      "Python machine learning beginners",
      "data science Python tutorial",
      "Python AI beginners India",
      "learn data science free India",
      "Python NumPy Pandas tutorial"
    ],
    excerpt: "Python is the language of data science. This beginner guide shows you exactly what to learn, in what order, and where to get the foundational Python skills you need before diving into data science libraries.",
    content: `
      <h2>Why Python Is the Language of Data Science</h2>
      <p>In 2026, Python runs the AI revolution. Every major machine learning framework — TensorFlow, PyTorch, scikit-learn — is written in or for Python. Every data science team in India uses Python. And Python has the most beginner-friendly syntax of any language, which is why it's the universal starting point for aspiring data scientists regardless of their background.</p>
      <p>But here's the trap beginners fall into: jumping straight into NumPy and machine learning before mastering Python fundamentals. This guide gives you the correct sequence.</p>

      <h2>Step 1: Python Fundamentals (Before Anything Else)</h2>
      <p>Before you touch a single data science library, you need to be comfortable with core Python. If you try to learn Pandas without understanding Python dictionaries, you'll be lost constantly.</p>
      <p>Python fundamentals you must know first:</p>
      <ul>
        <li><strong>Variables and data types:</strong> int, float, str, bool, None</li>
        <li><strong>Lists and dictionaries:</strong> The two most used data structures in data science</li>
        <li><strong>Loops and conditionals:</strong> for loops, while loops, if/elif/else</li>
        <li><strong>Functions:</strong> Defining, calling, parameters, return values, lambda functions</li>
        <li><strong>File I/O:</strong> Reading and writing CSV and text files — essential for data science</li>
        <li><strong>List comprehensions:</strong> The Pythonic way to transform data</li>
        <li><strong>Error handling:</strong> try/except blocks</li>
      </ul>
      <p>Free resource: The <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass on SkillValix</a> covers all of this from scratch with a verifiable certificate on completion. This is your foundation. Don't skip it.</p>

      <h2>Step 2: NumPy — Numerical Computing</h2>
      <p>NumPy (Numerical Python) is the foundation of all scientific computing in Python. It introduces arrays — multi-dimensional data structures that are dramatically faster than Python lists for numerical operations.</p>
      <p>Key NumPy concepts:</p>
      <ul>
        <li>Creating arrays: <code>np.array()</code>, <code>np.zeros()</code>, <code>np.ones()</code>, <code>np.arange()</code></li>
        <li>Array operations: element-wise arithmetic, broadcasting</li>
        <li>Indexing and slicing: selecting rows, columns, and subsets</li>
        <li>Statistical functions: <code>np.mean()</code>, <code>np.std()</code>, <code>np.sum()</code></li>
        <li>Reshaping: <code>reshape()</code>, <code>flatten()</code>, <code>transpose()</code></li>
      </ul>

      <h2>Step 3: Pandas — Data Manipulation</h2>
      <p>Pandas is what data scientists use for 80% of their daily work — loading, cleaning, transforming, and analyzing tabular data. A DataFrame is Pandas' core structure: a 2D table with labelled rows and columns (essentially a spreadsheet in code).</p>
      <p>Essential Pandas skills:</p>
      <ul>
        <li>Loading data: <code>pd.read_csv()</code>, <code>pd.read_excel()</code></li>
        <li>Exploring data: <code>.head()</code>, <code>.info()</code>, <code>.describe()</code></li>
        <li>Selecting data: <code>loc[]</code> (label-based), <code>iloc[]</code> (index-based)</li>
        <li>Filtering rows: boolean indexing</li>
        <li>Handling missing values: <code>.dropna()</code>, <code>.fillna()</code></li>
        <li>Grouping and aggregating: <code>groupby()</code>, <code>agg()</code></li>
        <li>Merging DataFrames: <code>merge()</code>, <code>concat()</code></li>
      </ul>

      <h2>Step 4: Data Visualization</h2>
      <p>Data scientists communicate findings through visualizations. Two libraries dominate:</p>
      <ul>
        <li><strong>Matplotlib:</strong> The low-level foundation. Gives you full control over every element of a plot.</li>
        <li><strong>Seaborn:</strong> Built on Matplotlib. Creates beautiful statistical plots in 2–3 lines of code.</li>
      </ul>

      <h2>Step 5: Machine Learning Basics with scikit-learn</h2>
      <p>Once you're comfortable with NumPy and Pandas, scikit-learn makes it easy to train machine learning models. It provides a consistent API for preprocessing data, splitting train/test sets, training models, and evaluating performance.</p>
      <p>Start with these scikit-learn concepts:</p>
      <ul>
        <li>Train/test split: <code>train_test_split()</code></li>
        <li>Linear Regression: predicting continuous values</li>
        <li>Logistic Regression: binary classification</li>
        <li>Decision Trees and Random Forests</li>
        <li>Model evaluation: accuracy, precision, recall, confusion matrix</li>
      </ul>

      <h2>Build the Foundation with SkillValix</h2>
      <p>The <a href="/courses/ultimate-python-masterclass">free Python course on SkillValix</a> gives you the Python fundamentals you need before data science libraries — with a verifiable certificate at the end. Combined with the <a href="/courses/basics-of-artificial-intelligence-beginners">free AI & Machine Learning Fundamentals course</a>, you get the conceptual foundation to understand what scikit-learn and TensorFlow are actually doing under the hood.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Do I need a math background to learn Python for data science?</strong><br/>
      Basic statistics (mean, median, standard deviation) and linear algebra basics (matrices, vectors) help, but you don't need advanced mathematics to get started. As you advance into machine learning, you'll naturally encounter the math and can study it contextually.</p>

      <p><strong>Q2: How long does it take to learn Python for data science?</strong><br/>
      Python fundamentals: 2–4 weeks with consistent practice. NumPy + Pandas: 3–4 weeks. Visualization + ML basics: 4–6 weeks. Total: 2–4 months to be employable as a junior data analyst.</p>

      <p><strong>Q3: Is Python enough to get a data science job in India?</strong><br/>
      Python is the foundation, but employers also want: SQL (for database queries), data visualization skills, and knowledge of at least one ML framework. The combination of Python + SQL + Tableau/Power BI is enough for most junior data analyst roles in India.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-08T11:00:00+05:30",
    modifiedDate: "2026-04-08T11:00:00+05:30",
    date: "April 8, 2026",
    readTime: "12 min read",
    wordCount: 1250,
    category: "Python",
    tags: ["Python Data Science", "Data Science Beginners", "Python Machine Learning", "NumPy Pandas", "AI Python 2026", "Learn Data Science India"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Data science charts and Python code on a computer screen",
    canonicalUrl: "https://www.skillvalix.com/blog/python-for-data-science-beginners-2026",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Learn Python from scratch — the foundation for data science, AI, and automation. Free with certificate."
    }
  },
  {
    id: "how-to-become-a-web-developer-2026",
    title: "How to Become a Web Developer in 2026: The Complete Roadmap",
    metaTitle: "How to Become a Web Developer in 2026 — Complete Roadmap | SkillValix",
    metaDescription: "Want to become a web developer in 2026? This complete step-by-step roadmap covers HTML, CSS, JavaScript, React, backend, and how to land your first job — even without a degree.",
    keywords: [
      "how to become a web developer",
      "web developer roadmap 2026",
      "become a web developer without degree",
      "web development career 2026",
      "learn web development free",
      "frontend developer roadmap",
      "web developer salary India",
      "how to get web developer job",
      "full stack developer roadmap",
      "web development for beginners 2026"
    ],
    excerpt: "Web development is one of the most in-demand and highest-paying careers in 2026. Here is the exact step-by-step roadmap to go from zero to job-ready — no degree required.",
    content: `
      <h2>Why Web Development is the Best Career to Start in 2026</h2>
      <p>Web developers are among the most in-demand professionals in India and globally. The average fresher web developer salary in India ranges from ₹3.5 LPA to ₹7 LPA, with experienced developers earning ₹15–40 LPA and above. Unlike many careers, web development is 100% skill-based — no degree, no college brand, no entrance exam. What matters is what you can build.</p>
      <p>This roadmap gives you the exact sequence of skills to learn, in the correct order, with free resources for each step.</p>

      <h2>Step 1: Master HTML — The Foundation (2–3 Weeks)</h2>
      <p>HTML (HyperText Markup Language) is the skeleton of every webpage. Every web developer starts here. There are no shortcuts. You must understand HTML before touching CSS or JavaScript.</p>
      <p>What to learn in HTML:</p>
      <ul>
        <li><strong>Document structure:</strong> <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code></li>
        <li><strong>Text elements:</strong> Headings (h1–h6), paragraphs, lists, links, images</li>
        <li><strong>Semantic HTML5 tags:</strong> <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;nav&gt;</code></li>
        <li><strong>Forms:</strong> Input types, validation attributes, labels, buttons</li>
        <li><strong>Tables and media:</strong> Tables, video, audio, iframes</li>
        <li><strong>Accessibility basics:</strong> alt text, aria-label, semantic structure</li>
      </ul>
      <p>Free resource: The <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass on SkillValix</a> covers all of this from scratch with a verifiable certificate.</p>

      <h2>Step 2: Learn CSS — Make It Look Good (3–4 Weeks)</h2>
      <p>CSS (Cascading Style Sheets) controls the visual presentation of your HTML. This is where web development gets creative. Modern CSS is powerful — you can build stunning, responsive layouts without a single line of JavaScript.</p>
      <p>Essential CSS skills:</p>
      <ul>
        <li><strong>Selectors and specificity:</strong> class, id, element, pseudo-class selectors</li>
        <li><strong>The box model:</strong> margin, padding, border, content — the foundation of all layout</li>
        <li><strong>Flexbox:</strong> One-dimensional layouts — navbars, card rows, centering</li>
        <li><strong>CSS Grid:</strong> Two-dimensional layouts — full page structures, card grids</li>
        <li><strong>Responsive design:</strong> Media queries, mobile-first approach, viewport units</li>
        <li><strong>CSS variables:</strong> <code>--primary-color</code> for consistent, maintainable styles</li>
        <li><strong>Transitions and animations:</strong> Smooth hover effects and micro-interactions</li>
      </ul>
      <p>Free resource: The <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro course on SkillValix</a> takes you from your first selector to advanced Grid layouts.</p>

      <h2>Step 3: Master JavaScript — Add Behaviour (4–6 Weeks)</h2>
      <p>JavaScript is what makes websites interactive. Forms that validate, menus that open, content that loads without refreshing — all JavaScript. It is the most important language in web development and one of the most versatile programming languages ever created.</p>
      <p>JavaScript fundamentals to master:</p>
      <ul>
        <li>Variables: <code>let</code>, <code>const</code>, data types, type coercion</li>
        <li>Functions: declarations, expressions, arrow functions, callbacks</li>
        <li>Arrays and objects: methods, destructuring, spread operator</li>
        <li>DOM manipulation: <code>querySelector</code>, <code>addEventListener</code>, <code>classList</code></li>
        <li>Async JavaScript: Promises, <code>async/await</code>, <code>fetch()</code> API</li>
        <li>ES6+ features: modules, template literals, optional chaining</li>
        <li>Error handling: try/catch, error types</li>
      </ul>
      <p>At this point — with HTML, CSS, and JavaScript — you can build complete static websites and apply for junior frontend roles or internships. Build 2–3 projects (a portfolio site, a to-do app, a weather app using a public API) and put them on GitHub.</p>

      <h2>Step 4: Learn React — The Industry Standard (4–5 Weeks)</h2>
      <p>React is used by 40%+ of all web applications globally. Every major tech company in India — Flipkart, Swiggy, Zomato, Razorpay — uses React. Learning React makes you dramatically more employable as a frontend developer.</p>
      <p>Core React concepts:</p>
      <ul>
        <li><strong>JSX:</strong> HTML-like syntax inside JavaScript</li>
        <li><strong>Components:</strong> Functional components, props, component composition</li>
        <li><strong>State management:</strong> <code>useState</code>, <code>useEffect</code>, <code>useContext</code></li>
        <li><strong>React Router:</strong> Client-side routing for single-page applications</li>
        <li><strong>Fetching data:</strong> API calls with <code>fetch</code> or Axios in useEffect</li>
        <li><strong>Forms in React:</strong> Controlled inputs, form validation</li>
      </ul>
      <p>Build a full React project — a multi-page app with routing, API integration, and state management. This is your portfolio centrepiece.</p>

      <h2>Step 5: Backend Basics — Node.js and Express (3–4 Weeks)</h2>
      <p>To become a full-stack developer — which pays significantly more — you need backend knowledge. Node.js lets you run JavaScript on the server, and Express is the most popular framework for building APIs in Node.</p>
      <p>Backend skills to learn:</p>
      <ul>
        <li>Node.js fundamentals: modules, npm, file system</li>
        <li>Express: routing, middleware, request/response handling</li>
        <li>REST APIs: GET, POST, PUT, DELETE endpoints</li>
        <li>MongoDB: document-based database, CRUD operations with Mongoose</li>
        <li>Authentication: JWT tokens, bcrypt password hashing</li>
        <li>Environment variables and .env files</li>
        <li>Deploying to Vercel or Render</li>
      </ul>

      <h2>Step 6: Build Projects and Create Your Portfolio</h2>
      <p>Projects are the most important part of your web development journey. Recruiters spend 10 seconds on your resume — but they spend 5 minutes on your portfolio. Here are the projects every junior developer should have:</p>
      <ul>
        <li><strong>Personal portfolio website</strong> — Showcases your skills, projects, and contact info</li>
        <li><strong>Full-stack CRUD app</strong> — A note-taking app, task manager, or blog with user authentication</li>
        <li><strong>API integration project</strong> — A weather app, currency converter, or movie database using a public API</li>
        <li><strong>E-commerce or booking UI clone</strong> — Demonstrates your ability to build complex, real-world interfaces</li>
      </ul>
      <p>Host all projects on GitHub with clear README files. Deploy them live (Vercel for frontend, Render for backend) so recruiters can see them working.</p>

      <h2>Step 7: Apply for Jobs and Freelance Projects</h2>
      <p>Once you have 3 projects live and your fundamentals solid, start applying. Here is the realistic timeline for landing your first role:</p>
      <ul>
        <li><strong>Month 1–2:</strong> HTML, CSS, basic JavaScript</li>
        <li><strong>Month 3–4:</strong> Advanced JavaScript, React</li>
        <li><strong>Month 5–6:</strong> Node.js/Express, MongoDB, full-stack project</li>
        <li><strong>Month 6–8:</strong> Actively applying, building portfolio, doing mock interviews</li>
      </ul>
      <p>Where to find jobs: LinkedIn Jobs, Naukri, Internshala (for internships), AngelList for startups, and direct applications to companies you admire. For freelancing, platforms like Toptal, Upwork, and Fiverr are starting points while you build your reputation.</p>

      <h2>Do You Need a Computer Science Degree to Become a Web Developer?</h2>
      <p>No — and this is one of the most liberating facts about web development. Employers hire web developers based on their portfolio and what they can build, not their degrees. Many of India's top frontend and full-stack developers are self-taught. A strong GitHub profile with deployed projects is worth more than most college degrees in this field.</p>
      <p>That said, if you want to move into backend engineering, system design, or machine learning later, a CS foundation helps. But for web development specifically, skills and portfolio beat credentials every time.</p>

      <h2>Free Web Development Courses on SkillValix</h2>
      <p>All the courses you need for this roadmap are available free on SkillValix, each ending with a verifiable certificate:</p>
      <ul>
        <li><a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> — Master semantic HTML5 from scratch</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro</a> — Flexbox, Grid, animations, responsive design</li>
        <li><a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a> — Full JS from variables to async/await</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: How long does it take to become a web developer from scratch?</strong><br/>
      With consistent daily practice of 2–3 hours, most people reach junior job-ready level in 6–9 months. If you study full-time (6–8 hours per day), you can compress this to 3–4 months. The key variable is not time — it is the quality and quantity of projects you build along the way.</p>

      <p><strong>Q2: What is the salary of a web developer in India in 2026?</strong><br/>
      Junior web developer: ₹3–6 LPA. Mid-level (2–4 years experience): ₹8–18 LPA. Senior/full-stack (5+ years): ₹20–45 LPA. React and Node.js skills push salaries to the higher end. Freelancing can earn ₹50,000–₹3,00,000+ per month for experienced developers with good clients.</p>

      <p><strong>Q3: Should I learn frontend or full-stack first?</strong><br/>
      Always start with frontend (HTML, CSS, JavaScript, React). It is faster to see results, more beginner-friendly, and gives you the visual feedback that keeps you motivated. Once you are comfortable with React, adding Node.js and MongoDB takes 4–6 additional weeks. Full-stack knowledge nearly doubles your job opportunities and salary potential.</p>

      <p><strong>Q4: Is web development still in demand in 2026?</strong><br/>
      Yes — more than ever. Every business needs a web presence. AI tools like GitHub Copilot assist developers but cannot replace them — they require a developer who understands the code they generate. The rise of AI has actually increased demand for developers who understand both code AND AI tools. Web development remains one of the most secure and high-paying technology careers through at least 2030.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-01T09:00:00+05:30",
    modifiedDate: "2026-05-01T09:00:00+05:30",
    date: "May 1, 2026",
    readTime: "14 min read",
    wordCount: 1540,
    category: "Career",
    tags: ["Web Development Career", "Web Developer Roadmap", "Learn Web Development", "Frontend Developer", "Full Stack Developer", "Web Developer Salary India", "Coding Career 2026"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer coding on laptop with HTML CSS JavaScript code on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-become-a-web-developer-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Master the most critical skill in web development — JavaScript — for free with a verifiable certificate."
    }
  },
  {
    id: "best-programming-languages-to-learn-2026",
    title: "Best Programming Languages to Learn in 2026 (Ranked by Jobs & Salary)",
    metaTitle: "Best Programming Languages to Learn in 2026 — Ranked | SkillValix",
    metaDescription: "Which programming language should you learn in 2026? We rank the top languages by job demand, average salary, and learning curve — so you can make the right choice for your career.",
    keywords: [
      "best programming languages to learn 2026",
      "which programming language to learn",
      "most in demand programming languages 2026",
      "programming language for job 2026",
      "best coding language for beginners",
      "JavaScript vs Python 2026",
      "programming language salary India",
      "top programming languages for jobs India"
    ],
    excerpt: "JavaScript, Python, Java, Go, Rust — with so many languages, which one should you actually learn in 2026? We rank the top programming languages by job demand, salary, and learning curve.",
    content: `
      <h2>The Most Important Decision a Beginner Makes</h2>
      <p>Choosing your first programming language is the most impactful decision you will make as a beginner — not because some languages are impossibly hard, but because each one opens a different door. Python gets you into data science and AI. JavaScript gets you into web and mobile development. Java gets you into enterprise software and Android. The right choice depends on where you want to go.</p>
      <p>This guide ranks the top programming languages by three factors that actually matter: job demand in India and globally, average salary, and realistic learning curve for a beginner.</p>

      <h2>1. JavaScript — Best for Web Development & Highest Job Volume</h2>
      <p><strong>Best for:</strong> Web development (frontend + backend), mobile apps (React Native), serverless functions</p>
      <p><strong>Average salary in India:</strong> ₹5–30 LPA depending on experience and framework</p>
      <p><strong>Learning curve:</strong> Medium — easy to start, deep to master</p>
      <p>JavaScript is the only language that runs natively in web browsers — which means every website on the internet uses it. It also runs on servers (Node.js), mobile (React Native), and desktop (Electron). The job volume for JavaScript developers is the highest of any language in India on Naukri, LinkedIn, and Instahyre.</p>
      <p>In 2026, knowing JavaScript with React (frontend) and Node.js (backend) makes you a full-stack developer — one of the most in-demand and versatile roles in tech. The learning path is well-documented, free resources are abundant, and the community is enormous.</p>
      <p><strong>Learn it if:</strong> You want to build websites, web apps, or mobile apps, or want the most job opportunities as a fresher.</p>
      <p>Free resource: <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass on SkillValix</a></p>

      <h2>2. Python — Best for AI, Data Science & Automation</h2>
      <p><strong>Best for:</strong> Data science, machine learning, AI, automation, scripting, web APIs (Django/FastAPI)</p>
      <p><strong>Average salary in India:</strong> ₹4–35 LPA (data science roles pay significantly more)</p>
      <p><strong>Learning curve:</strong> Low — the most beginner-friendly syntax of any major language</p>
      <p>Python's dominance in AI and machine learning is absolute. Every major ML framework — TensorFlow, PyTorch, scikit-learn, Hugging Face — is Python-first. As AI transforms every industry in 2026, Python skills are becoming a requirement in roles far beyond traditional software engineering — data analysts, researchers, product managers, and even finance professionals are learning Python.</p>
      <p>Python also has the simplest, most readable syntax of any language — which makes it the best first language for complete beginners. You write less code to do more, and error messages are clear and actionable.</p>
      <p><strong>Learn it if:</strong> You want to work in AI, data science, automation, or need a beginner-friendly first language.</p>
      <p>Free resource: <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass on SkillValix</a></p>

      <h2>3. Java — Best for Enterprise Software & Android</h2>
      <p><strong>Best for:</strong> Enterprise backend systems, Android development, large-scale distributed systems</p>
      <p><strong>Average salary in India:</strong> ₹5–40 LPA (senior Java architects command very high salaries)</p>
      <p><strong>Learning curve:</strong> High — strict typing and verbose syntax</p>
      <p>Java has powered enterprise software for 30 years — and it still does. BFSI (Banking, Financial Services, Insurance) companies, large enterprises, and MNCs like TCS, Infosys, Wipro, and IBM hire Java developers at massive scale. Android development (though Kotlin is now preferred, Java remains widely used) also drives Java demand.</p>
      <p>Java is more verbose and has a steeper learning curve than Python or JavaScript — but it teaches you strong software engineering principles (OOP, design patterns, type systems) that transfer to every other language. Java developers are reliably employed and command strong salaries at mid-to-senior levels.</p>
      <p><strong>Learn it if:</strong> You want to work at large companies, in enterprise banking/insurance software, or want Android development.</p>

      <h2>4. SQL — The Most Underrated Essential Skill</h2>
      <p><strong>Best for:</strong> Data analysis, backend development, business intelligence, any role that touches data</p>
      <p><strong>Average salary boost:</strong> SQL adds ₹1–5 LPA to any role that uses data</p>
      <p><strong>Learning curve:</strong> Very low — most basics learnable in a week</p>
      <p>SQL is not a general-purpose programming language — it is a query language for databases. But it is arguably the most universally useful technical skill of all. Every company stores data in databases. Every data analyst, backend developer, business analyst, and product manager who touches data uses SQL daily.</p>
      <p>SQL is often overlooked by beginners in favour of flashier languages — which is a mistake. Being SQL-proficient sets you apart in job applications, is learnable in 2–4 weeks, and applies to virtually every tech role.</p>
      <p><strong>Learn it if:</strong> You want any role that involves data — which is basically every tech role.</p>

      <h2>5. TypeScript — The Professional JavaScript</h2>
      <p><strong>Best for:</strong> Large-scale web application development, teams, enterprise React/Node.js projects</p>
      <p><strong>Average salary:</strong> TypeScript developers earn 15–25% more than plain JavaScript developers</p>
      <p><strong>Learning curve:</strong> Low for JavaScript developers — TypeScript is a superset of JS</p>
      <p>TypeScript adds optional static typing to JavaScript. In 2026, every major React codebase, Node.js backend, and Next.js application at a serious company uses TypeScript. It catches bugs at compile time that JavaScript would only catch at runtime, makes large codebases maintainable, and dramatically improves IDE autocomplete and error detection.</p>
      <p>If you already know JavaScript, adding TypeScript takes 1–2 weeks and makes you a significantly more attractive candidate to companies with mature engineering teams.</p>
      <p><strong>Learn it if:</strong> You know JavaScript and want to work at companies with senior engineering teams or on large codebases.</p>

      <h2>6. Go (Golang) — Best for High-Performance Backend</h2>
      <p><strong>Best for:</strong> High-performance APIs, microservices, cloud infrastructure, DevOps tools</p>
      <p><strong>Average salary in India:</strong> ₹15–50 LPA (Go is a specialist skill with premium salaries)</p>
      <p><strong>Learning curve:</strong> Medium — simpler than Java, more explicit than Python</p>
      <p>Go was built by Google for high-performance backend systems. It compiles to machine code (fast as C), has built-in concurrency primitives (goroutines), and produces small, single-binary executables. Companies like Google, Uber, Cloudflare, and Razorpay use Go for their most performance-critical services.</p>
      <p>Go is not a first language — learn Python or JavaScript first. But for developers who want to specialise in backend infrastructure, DevOps, or high-performance microservices, Go is the most valuable specialist skill with the highest salary premium in 2026.</p>
      <p><strong>Learn it if:</strong> You have 1–2 years of experience and want to specialise in backend infrastructure or cloud systems.</p>

      <h2>The Decision Framework: Which Language Should YOU Learn?</h2>
      <ul>
        <li><strong>Complete beginner, want maximum job opportunities:</strong> JavaScript</li>
        <li><strong>Complete beginner, interested in AI or data:</strong> Python</li>
        <li><strong>Want to work at large Indian enterprises or MNCs:</strong> Java</li>
        <li><strong>Already know JavaScript, want a salary bump:</strong> TypeScript</li>
        <li><strong>Want to work in data analysis without full engineering:</strong> SQL + Python</li>
        <li><strong>Experienced developer, want specialist backend premium:</strong> Go</li>
      </ul>
      <p>One important principle: master one language deeply before adding a second. A developer who knows JavaScript at a senior level is far more employable than one who knows six languages at a beginner level. Depth beats breadth — especially for your first two years.</p>

      <h2>What About Rust, Kotlin, Swift, and PHP?</h2>
      <p>Rust is excellent for systems programming and memory safety but has a very steep learning curve and limited job volume in India. Kotlin is preferred for new Android apps but Java remains dominant. Swift is essential for iOS/macOS development. PHP powers WordPress sites but has declining relevance for new projects. These are all valuable — but none of them are the right first choice for a beginner targeting maximum career impact in 2026.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Should I learn Python or JavaScript first?</strong><br/>
      Both are excellent choices. If you want to build websites or apps — choose JavaScript. If you want to work with data, AI, or automation — choose Python. Both are beginner-friendly and have strong job markets. The single biggest mistake is spending weeks unable to decide. Pick one and start today.</p>

      <p><strong>Q2: Is Java still worth learning in 2026?</strong><br/>
      Yes, absolutely. Java's job volume in India is enormous — particularly in BFSI, enterprise software, and large IT companies. Java developers with Spring Boot skills are consistently in demand and well-paid. Kotlin is preferred for new Android development, but Java's enterprise dominance makes it a sound career choice.</p>

      <p><strong>Q3: How many programming languages should I know?</strong><br/>
      For job applications: master one language and know one secondary language. For senior roles: typically 2–3 languages well, with familiarity in 2–3 others. The goal is always mastery of at least one language — a junior who knows JavaScript deeply will outcompete one who knows JavaScript, Python, Java, and Go superficially every time.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-02T09:00:00+05:30",
    modifiedDate: "2026-05-02T09:00:00+05:30",
    date: "May 2, 2026",
    readTime: "13 min read",
    wordCount: 1380,
    category: "Career",
    tags: ["Best Programming Languages 2026", "JavaScript vs Python", "Learn to Code", "Coding Career India", "Programming for Beginners", "Web Development Career", "Data Science Career"],
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Multiple programming language logos on a screen representing coding language choices",
    canonicalUrl: "https://www.skillvalix.com/blog/best-programming-languages-to-learn-2026",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Learn the #2 most important language for 2026 — free with a verifiable certificate."
    }
  },
  {
    id: "free-online-courses-with-certificate-india-2026",
    title: "Free Online Courses with Certificate in India (2026) — Verified & Recognised",
    metaTitle: "Free Online Courses with Certificate India 2026 — Verified | SkillValix",
    metaDescription: "Looking for free online courses with certificates in India for 2026? Discover the best free certified courses in web development, Python, AI, data science, and more — recognised by employers.",
    keywords: [
      "free online courses with certificate India 2026",
      "free certification courses India",
      "free online courses with certificate",
      "best free online courses India",
      "free coding courses with certificate",
      "free python course certificate India",
      "online certificate courses for jobs India",
      "free web development course certificate",
      "SkillValix free courses",
      "learn online free certificate 2026"
    ],
    excerpt: "Free online courses with verifiable certificates are one of the fastest ways to upskill and prove your skills to employers in 2026. Here are the best options in India — no fees, no hidden costs.",
    content: `
      <h2>Why Certificates from Free Courses Matter in 2026</h2>
      <p>The certificate itself is not what matters — the skills behind it are. But a verifiable certificate from a reputable platform serves as proof of those skills to recruiters who receive hundreds of applications. In 2026, Indian employers — from startups to MNCs — actively look for candidates with demonstrable, self-directed learning through online platforms. A verified certificate on your LinkedIn or resume is a credibility signal that costs you nothing except time and effort.</p>
      <p>This guide covers the best free certified courses in India in 2026, what skills they teach, and who should take them.</p>

      <h2>Free Courses on SkillValix (With Verifiable Certificates)</h2>
      <p>SkillValix offers completely free courses across programming, web development, AI, and data science — all ending with a verifiable certificate that can be shared on LinkedIn and included on your resume. Unlike many platforms that offer free course content but charge for the certificate, SkillValix certificates are completely free.</p>

      <h3>1. Ultimate JavaScript Masterclass — Free with Certificate</h3>
      <p>JavaScript is the most in-demand programming language for web development jobs. This course takes you from zero to proficient: variables, functions, DOM manipulation, arrays, objects, closures, Promises, async/await, and ES6+ features. Ideal for anyone who wants to become a frontend or full-stack developer.</p>
      <p><strong>Duration:</strong> 8–12 hours of content | <strong>Certificate:</strong> Verifiable, shareable on LinkedIn</p>
      <p><a href="/courses/ultimate-javascript-masterclass">Enrol free → Ultimate JavaScript Masterclass</a></p>

      <h3>2. Ultimate Python Masterclass — Free with Certificate</h3>
      <p>Python is the language of data science, AI, and automation. This course covers Python from the ground up: variables, control flow, functions, data structures, file I/O, error handling, and object-oriented programming. Suitable for complete beginners with no prior coding experience.</p>
      <p><strong>Duration:</strong> 10–14 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/ultimate-python-masterclass">Enrol free → Ultimate Python Masterclass</a></p>

      <h3>3. Ultimate HTML Masterclass — Free with Certificate</h3>
      <p>HTML is the foundation of every website on the internet. This course covers semantic HTML5, forms, accessibility, multimedia, and document structure — giving you the solid foundation every web developer needs before learning CSS and JavaScript.</p>
      <p><strong>Duration:</strong> 4–6 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/ultimate-html-masterclass">Enrol free → Ultimate HTML Masterclass</a></p>

      <h3>4. CSS for Beginners: Zero to Pro — Free with Certificate</h3>
      <p>Learn CSS from first principles: selectors, the box model, Flexbox, CSS Grid, responsive design with media queries, CSS variables, and animations. Build beautiful, responsive web layouts. This is the course that makes your HTML look professional.</p>
      <p><strong>Duration:</strong> 6–8 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">Enrol free → CSS: Zero to Pro</a></p>

      <h3>5. AI & Machine Learning Fundamentals — Free with Certificate</h3>
      <p>Understand the core concepts behind artificial intelligence and machine learning without advanced mathematics. This course explains neural networks, supervised and unsupervised learning, model evaluation, and real-world AI applications — giving you the conceptual foundation for deeper ML study.</p>
      <p><strong>Duration:</strong> 5–7 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/basics-of-artificial-intelligence-beginners">Enrol free → AI & ML Fundamentals</a></p>

      <h2>How to Make the Most of Free Online Courses</h2>
      <p>Free courses only create value if you complete them and apply the skills. Here is how to maximise the return from any free course:</p>
      <ul>
        <li><strong>Code along, don't just watch:</strong> Passive watching retains 10% of content. Typing every line of code yourself retains 80%+.</li>
        <li><strong>Build a project after each course:</strong> Apply what you learned in a real mini-project before moving on. Projects are what employers actually evaluate.</li>
        <li><strong>Add your certificate to LinkedIn immediately:</strong> Go to LinkedIn → Profile → Add section → Licenses & Certifications. Include the course name, issuing platform (SkillValix), and credential URL.</li>
        <li><strong>Combine courses into a skill stack:</strong> HTML + CSS + JavaScript gives you frontend skills. Python + AI Fundamentals gives you a data science foundation. Think in stacks, not individual courses.</li>
        <li><strong>Complete the assessment/quiz:</strong> SkillValix certificates require passing a quiz — this reinforces the concepts and proves genuine understanding rather than passive watching.</li>
      </ul>

      <h2>What Makes a Certificate Valuable to Employers?</h2>
      <p>Not all certificates are equal. Employers look for certificates that indicate real skill, not just course completion. The factors that make an online certificate credible:</p>
      <ul>
        <li><strong>Verifiability:</strong> Can the employer verify it is real? SkillValix certificates have a unique ID and verification URL.</li>
        <li><strong>Assessment-based:</strong> Certificates awarded after passing a quiz or building a project carry more weight than completion-only certificates.</li>
        <li><strong>Relevance:</strong> A JavaScript certificate is valuable for web development roles. A Python certificate is valuable for data science and automation roles. Match certificates to the jobs you are targeting.</li>
        <li><strong>Recency:</strong> 2025–2026 certificates signal that your skills are current — especially important in fast-moving fields like AI and web development.</li>
      </ul>

      <h2>Other Free Certification Platforms in India</h2>
      <p>Beyond SkillValix, these platforms also offer free courses and certificates:</p>
      <ul>
        <li><strong>NPTEL (IIT/IISc):</strong> Government-backed courses with proctored exams. Highly respected by PSUs and large Indian corporates. Subjects: engineering, CS, management.</li>
        <li><strong>Google Digital Garage:</strong> Free digital marketing and data fundamentals courses with Google-branded certificates. Excellent for non-tech roles.</li>
        <li><strong>Microsoft Learn:</strong> Free courses on Azure, Power BI, and Microsoft technologies with Microsoft badges.</li>
        <li><strong>Coursera (Audit mode):</strong> Access course content free by auditing — certificate requires payment, but the learning is free.</li>
        <li><strong>edX (Audit mode):</strong> Similar to Coursera — free content, paid certificate.</li>
      </ul>
      <p>For programming and web development specifically, SkillValix's free courses with completely free certificates provide the best combination of quality, relevance, and verifiability for the Indian job market.</p>

      <h2>Building a Resume Around Free Certificates</h2>
      <p>Here is a sample resume skills section built entirely from free certificates:</p>
      <ul>
        <li><strong>Frontend Development:</strong> HTML5, CSS3 (Flexbox, Grid), JavaScript ES6+, React.js — Certified via SkillValix</li>
        <li><strong>Python Programming:</strong> Variables, functions, OOP, file I/O — Certified via SkillValix</li>
        <li><strong>AI Fundamentals:</strong> Machine learning concepts, neural networks, model evaluation — Certified via SkillValix</li>
      </ul>
      <p>This demonstrates initiative, self-directed learning, and current skills — all from free resources. Pair these with GitHub projects and you have a genuinely competitive profile.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Are free online certificates recognised by employers in India?</strong><br/>
      Yes — especially from established platforms. SkillValix, Google, Microsoft, and NPTEL certificates are all recognised by Indian employers. The key is that the certificate should be verifiable online. Employers in tech startups in particular actively value self-directed learning shown through online courses.</p>

      <p><strong>Q2: Do I need to pay for a certificate on SkillValix?</strong><br/>
      No. All SkillValix courses and certificates are completely free — including the certificate. There are no hidden fees, no premium tiers for certificates. You enrol, complete the course, pass the assessment, and get a verifiable certificate at no cost.</p>

      <p><strong>Q3: Which free certificate course is best for getting a job in 2026?</strong><br/>
      For web development jobs: start with HTML → CSS → JavaScript (all free on SkillValix). For data science/AI jobs: start with Python → AI Fundamentals. For any tech job: Python is the most universally applicable. The best certificate is from whichever course builds skills directly relevant to the jobs you are applying for.</p>

      <p><strong>Q4: How long does it take to complete a SkillValix course?</strong><br/>
      Courses range from 4 hours (HTML) to 14 hours (Python). At a pace of 1–2 hours per day, you can complete any course in 1–2 weeks. Completing all five core courses (HTML, CSS, JavaScript, Python, AI Fundamentals) takes approximately 6–8 weeks at a comfortable learning pace.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-03T09:00:00+05:30",
    modifiedDate: "2026-05-03T09:00:00+05:30",
    date: "May 3, 2026",
    readTime: "11 min read",
    wordCount: 1280,
    category: "Career",
    tags: ["Free Courses India 2026", "Free Certificate Courses", "Online Learning India", "SkillValix Courses", "Learn Online Free", "Coding Certificate India", "Upskill India"],
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Student studying online on laptop with course certificate on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/free-online-courses-with-certificate-india-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Start your free certified learning journey with the most in-demand skill in tech."
    }
  },
  {
    id: "python-vs-javascript-which-to-learn-first",
    title: "Python vs JavaScript: Which Should You Learn First in 2026?",
    metaTitle: "Python vs JavaScript: Which to Learn First in 2026? | SkillValix",
    metaDescription: "Python or JavaScript — which programming language should you learn first in 2026? A detailed, honest comparison covering jobs, salary, learning curve, and career paths to help you decide.",
    keywords: [
      "python vs javascript which to learn first",
      "python or javascript for beginners",
      "python vs javascript 2026",
      "best first programming language 2026",
      "python vs javascript salary India",
      "should I learn python or javascript",
      "python vs javascript for jobs",
      "first programming language beginners India"
    ],
    excerpt: "The most common question beginners ask — should I learn Python or JavaScript first? Here is an honest, detailed comparison covering jobs, salary, learning curve, and career paths.",
    content: `
      <h2>The Question Every Beginner Asks</h2>
      <p>Python and JavaScript are the two most beginner-friendly and job-relevant programming languages in 2026. Both are excellent. Both have massive job markets. Both are free to learn. The problem is that beginners spend weeks (sometimes months) paralysed trying to choose between them — and every week of indecision is a week you could have spent learning.</p>
      <p>This article gives you a definitive answer based on your specific career goals — so you can decide today and start tomorrow.</p>

      <h2>The Core Difference in One Sentence</h2>
      <p><strong>JavaScript runs in browsers and builds websites. Python runs on servers and analyses data.</strong></p>
      <p>That is the most important distinction. Everything else follows from this fundamental difference in what each language was designed to do.</p>

      <h2>Learning Curve Comparison</h2>
      <h3>Python Learning Curve: Very Low</h3>
      <p>Python was explicitly designed to be readable. Its syntax is close to plain English — which means you spend less mental energy decoding syntax and more energy understanding programming concepts.</p>
      <pre><code># Python — simple, readable
name = "Arjun"
if name == "Arjun":
    print(f"Hello, {name}!")
# Output: Hello, Arjun!</code></pre>
      <p>Python enforces indentation, which forces clean code habits from day one. Error messages are clear and descriptive. The standard library is enormous — there is a built-in module for almost everything.</p>

      <h3>JavaScript Learning Curve: Medium</h3>
      <p>JavaScript is beginner-friendly but has more quirks than Python. Type coercion, the <code>this</code> keyword, asynchronous programming, and the prototype chain are all concepts that trip beginners up. However, JavaScript's immediate visual feedback (you can open a browser console and run code instantly) is extremely motivating.</p>
      <pre><code>// JavaScript — slightly more syntax to manage
const name = "Arjun";
if (name === "Arjun") {
  console.log(&#96;Hello, \${name}!&#96;);
}
// Output: Hello, Arjun!</code></pre>
      <p><strong>Verdict: Python has a lower learning curve for complete beginners.</strong></p>

      <h2>Job Market Comparison in India (2026)</h2>
      <h3>JavaScript Jobs</h3>
      <ul>
        <li>Frontend Developer (React, Vue, Angular)</li>
        <li>Full-Stack Developer (React + Node.js)</li>
        <li>Backend Developer (Node.js, Express)</li>
        <li>Mobile Developer (React Native)</li>
        <li>Software Engineer at product startups</li>
      </ul>
      <p>JavaScript has the highest raw job volume of any language in India. On LinkedIn Jobs and Naukri, React developer roles alone number in the thousands at any given time.</p>

      <h3>Python Jobs</h3>
      <ul>
        <li>Data Analyst / Data Scientist</li>
        <li>Machine Learning Engineer</li>
        <li>AI Engineer / MLOps Engineer</li>
        <li>Backend Developer (Django, FastAPI)</li>
        <li>Automation / DevOps Engineer</li>
        <li>Research Engineer</li>
      </ul>
      <p>Python's job market is growing faster than JavaScript's in 2026, driven by the AI boom. Data science and ML roles command higher salaries but often require additional skills (SQL, statistics, domain knowledge).</p>
      <p><strong>Verdict: JavaScript has more total jobs. Python jobs pay more on average and are growing faster.</strong></p>

      <h2>Salary Comparison in India</h2>
      <ul>
        <li><strong>JavaScript developer (fresher):</strong> ₹3.5–6 LPA</li>
        <li><strong>Python developer (fresher):</strong> ₹3.5–6 LPA</li>
        <li><strong>React developer (2–3 years):</strong> ₹8–18 LPA</li>
        <li><strong>Data scientist with Python (2–3 years):</strong> ₹12–25 LPA</li>
        <li><strong>Senior Full-Stack (JS, 5+ years):</strong> ₹25–45 LPA</li>
        <li><strong>Senior ML Engineer (Python, 5+ years):</strong> ₹30–60 LPA</li>
      </ul>
      <p>At the fresher level, salaries are similar. The divergence happens at mid and senior levels — Python data science/ML careers tend to pay significantly more at the top end.</p>

      <h2>What Can You Build?</h2>
      <h3>With JavaScript you can build:</h3>
      <ul>
        <li>Any website or web application (frontend)</li>
        <li>REST APIs and backend services (Node.js)</li>
        <li>Mobile apps (React Native)</li>
        <li>Desktop apps (Electron)</li>
        <li>Browser extensions</li>
        <li>Real-time apps (WebSockets, Socket.io)</li>
      </ul>
      <h3>With Python you can build:</h3>
      <ul>
        <li>Data analysis and visualisation scripts</li>
        <li>Machine learning models</li>
        <li>Web APIs (Django, FastAPI)</li>
        <li>Automation scripts (web scraping, file processing)</li>
        <li>AI chatbots and NLP applications</li>
        <li>Scientific simulations</li>
      </ul>

      <h2>The Definitive Decision Guide</h2>
      <p>Answer these questions honestly:</p>
      <ul>
        <li><strong>Do you want to build websites and apps?</strong> → JavaScript</li>
        <li><strong>Do you want to work with data, AI, or machine learning?</strong> → Python</li>
        <li><strong>Do you want the most job postings to apply to as a fresher?</strong> → JavaScript</li>
        <li><strong>Do you want the highest earning potential long-term?</strong> → Python (data science/ML path)</li>
        <li><strong>Do you want the easiest learning experience?</strong> → Python</li>
        <li><strong>Do you want to see immediate visual results in the browser?</strong> → JavaScript</li>
        <li><strong>Do you have no clear preference?</strong> → JavaScript (most versatile, most jobs)</li>
      </ul>

      <h2>The Answer Most Experts Give</h2>
      <p>If you have no strong preference and just want to start coding and get a job as efficiently as possible: <strong>start with JavaScript</strong>. It has the most job opportunities at the fresher level, you can see your code working in the browser immediately (which is extremely motivating), and the path from zero to employed is faster and more direct for most people.</p>
      <p>If you know you want to work in AI, data science, or research — or if you are already comfortable with logic and want the cleanest possible first language: <strong>start with Python</strong>.</p>
      <p>Both are available for free with verifiable certificates on SkillValix: <a href="/courses/ultimate-javascript-masterclass">JavaScript Masterclass</a> and <a href="/courses/ultimate-python-masterclass">Python Masterclass</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Can I learn both Python and JavaScript at the same time?</strong><br/>
      Not recommended for beginners. Learning two languages simultaneously doubles your confusion and halves your progress in each. Master one to a productive level (where you can build real things) before starting the second. The second language always comes faster because you already understand programming concepts.</p>

      <p><strong>Q2: Is Python easier than JavaScript for complete beginners?</strong><br/>
      Yes, marginally. Python's syntax is cleaner, its error messages are clearer, and it has fewer "gotcha" behaviours than JavaScript. But the difference is not dramatic — both are beginner-friendly. JavaScript has the advantage of immediate browser feedback, which some beginners find more motivating than Python's terminal output.</p>

      <p><strong>Q3: If I learn JavaScript, do I still need to learn Python later?</strong><br/>
      Not necessarily. Many successful developers use JavaScript exclusively for their entire careers. However, if you want to add data science, machine learning, or AI to your skill set later, you will need to learn Python. The good news: once you know JavaScript well, picking up Python takes 2–3 weeks.</p>
    `,
    author: "Amit Patel",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-04T09:00:00+05:30",
    modifiedDate: "2026-05-04T09:00:00+05:30",
    date: "May 4, 2026",
    readTime: "12 min read",
    wordCount: 1320,
    category: "Career",
    tags: ["Python vs JavaScript", "Best First Programming Language", "Learn Python", "Learn JavaScript", "Coding for Beginners India", "Programming Career 2026"],
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Python and JavaScript code side by side on a monitor showing comparison",
    canonicalUrl: "https://www.skillvalix.com/blog/python-vs-javascript-which-to-learn-first",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Start your Python journey today — free course with a verifiable certificate."
    }
  }
];
const __vite_import_meta_env__ = {};
const Blog = lazy(() => import("./assets/Blog-4dbMPmp_.js"));
const BlogPost = lazy(() => import("./assets/BlogPost-DV38c6vZ.js"));
const Courses = lazy(() => import("./assets/Courses-DqzUykqJ.js"));
lazy(() => import("./assets/CourseDetail-BVKHCQ38.js"));
const Events = lazy(() => import("./assets/Events-Ci1Sejyn.js"));
const PrivacyPolicy = lazy(() => import("./assets/PrivacyPolicy-kIrTHnsR.js"));
const TermsOfService = lazy(() => import("./assets/TermsOfService-C80HjCWL.js"));
const RefundPolicy = lazy(() => import("./assets/RefundPolicy-DkQHOyI1.js"));
const CookiePolicy = lazy(() => import("./assets/CookiePolicy-CJ6onVLy.js"));
const FreeCourses = lazy(() => import("./assets/FreeCourses-B7VrcakI.js"));
const CampusAmbassador = lazy(() => import("./assets/CampusAmbassador-7ekhtrZz.js"));
const HostHackathon = lazy(() => import("./assets/HostHackathon-YjWyDviu.js"));
const Certification = lazy(() => import("./assets/Certification-B9v0BhEq.js"));
const VerifyCert = lazy(() => import("./assets/VerifyCert-DU1K-WTy.js"));
const staticRoutes = [
  { path: "/", element: /* @__PURE__ */ jsx(Home, {}) },
  { path: "/login", element: /* @__PURE__ */ jsx(Login, {}) },
  { path: "/register", element: /* @__PURE__ */ jsx(Register, {}) },
  { path: "/blog", element: /* @__PURE__ */ jsx(Blog, {}) },
  { path: "/courses", element: /* @__PURE__ */ jsx(Courses, {}) },
  { path: "/hackathons", element: /* @__PURE__ */ jsx(Events, {}) },
  { path: "/privacy-policy", element: /* @__PURE__ */ jsx(PrivacyPolicy, {}) },
  { path: "/terms", element: /* @__PURE__ */ jsx(TermsOfService, {}) },
  { path: "/refund-policy", element: /* @__PURE__ */ jsx(RefundPolicy, {}) },
  { path: "/cookie-policy", element: /* @__PURE__ */ jsx(CookiePolicy, {}) },
  { path: "/free-courses", element: /* @__PURE__ */ jsx(FreeCourses, {}) },
  { path: "/campus-ambassador", element: /* @__PURE__ */ jsx(CampusAmbassador, {}) },
  { path: "/host", element: /* @__PURE__ */ jsx(HostHackathon, {}) },
  { path: "/certification", element: /* @__PURE__ */ jsx(Certification, {}) },
  { path: "/verify", element: /* @__PURE__ */ jsx(VerifyCert, {}) },
  // Dynamic blog routes — one per post
  ...blogPosts.map((post) => ({
    path: `/blog/${post.id}`,
    element: /* @__PURE__ */ jsx(BlogPost, {})
  }))
];
const clientId = typeof window !== "undefined" && __vite_import_meta_env__ ? "1054570330456-tm3ef672i0h2374doipk9rv45lv1qu7u.apps.googleusercontent.com" : "";
if (typeof window !== "undefined") {
  if (!window.__vite_plugin_react_preamble_installed__) {
    const root = document.getElementById("root");
    if (root && root.innerHTML === "") {
      createRoot$1(root).render(
        /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(GoogleOAuthProvider, { clientId, children: /* @__PURE__ */ jsx(App, {}) }) })
      );
    }
  }
}
const createRoot = ViteReactSSG(
  {
    routes: staticRoutes
  },
  ({ app }) => {
    return /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(GoogleOAuthProvider, { clientId: clientId || "dummy", children: app }) });
  }
);
export {
  Logo as L,
  normalizeDisplayText as a,
  blogPosts as b,
  getCourseBySlug as c,
  createRoot,
  api as d,
  clearCache as e,
  cachedGet as f,
  getCourseList as g,
  normalizeHtmlContent as n,
  useAuthStore as u
};
