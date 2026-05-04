import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { u as useAuthStore, f as cachedGet, g as getCourseList, H as Helmet, d as api } from "../main.mjs";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { C as CertificateTemplate, g as generatePDFFromDOM } from "./CertificateTemplate-DB_rTmRV.js";
import { Loader2, Share2, GraduationCap, CheckCircle, Trophy, BookOpen, Medal, User, Sparkles, Settings, UserRound, Globe, Linkedin, Github, FileText, Phone, Briefcase, ShieldCheck, Zap, Save, MapPin, ExternalLink, Clock, Award, ArrowRight, Star, Download } from "lucide-react";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
import "html-to-image";
import "jspdf";
import "qrcode.react";
const InfoItem = ({ label, value, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-slate-400" }) }),
  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1", children: label }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700 truncate", children: value || "Not specified" })
  ] })
] });
const SocialIcon = ({ title, value, icon: Icon, color }) => {
  if (!value) return /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 border border-slate-100 rounded-2xl opacity-40 grayscale flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 mb-1 text-slate-300" }),
    /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black text-slate-400 uppercase tracking-tighter", children: title })
  ] });
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: value.startsWith("http") ? value : `https://${value}`,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "p-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all flex flex-col items-center justify-center group",
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 mb-1 transition-transform group-hover:scale-110", style: { color } }),
        /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black text-slate-600 uppercase tracking-tighter", children: title })
      ]
    }
  );
};
const SectionHead = ({ icon: Icon, title, iconCls, count, countCls }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
  /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-100 ${iconCls}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900 tracking-tight", children: title }),
    count && /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mt-0.5 ${countCls}`, children: count })
  ] })
] });
const Sk = ({ cls }) => /* @__PURE__ */ jsx("div", { className: `bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded-xl ${cls}` });
const ProgressRing = ({ pct, size = 56, stroke = 5, color = "#6366f1" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - pct / 100 * circ;
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
    /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "#e2e8f0", strokeWidth: stroke }),
    /* @__PURE__ */ jsx(
      "circle",
      {
        cx: size / 2,
        cy: size / 2,
        r,
        fill: "none",
        stroke: color,
        strokeWidth: stroke,
        strokeDasharray: circ,
        strokeDashoffset: offset,
        strokeLinecap: "round",
        style: { transition: "stroke-dashoffset 0.8s ease" }
      }
    )
  ] });
};
const StatCard = ({ icon: Icon, label, value, total, gradient, iconBg, loading }) => {
  const pct = total > 0 ? Math.round(value / total * 100) : 0;
  const ringColors = { emerald: "#10b981", amber: "#f59e0b", indigo: "#6366f1" };
  Object.keys(ringColors).find((k) => iconBg.includes(k));
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-3xl p-6 ${gradient} shadow-xl text-white`, children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-10", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -left-4 -bottom-10 w-28 h-28 rounded-full bg-white" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[10px] font-bold uppercase tracking-[0.15em] mb-2", children: label }),
        loading ? /* @__PURE__ */ jsx("div", { className: "w-14 h-10 bg-white/20 rounded-xl animate-pulse" }) : /* @__PURE__ */ jsx("p", { className: "text-5xl font-black leading-none", children: value }),
        !loading && total !== void 0 && /* @__PURE__ */ jsxs("p", { className: "text-white/60 text-xs font-semibold mt-2", children: [
          "of ",
          total,
          " total"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        total !== void 0 && !loading && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ProgressRing, { pct, color: "#fff" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-white" }) })
        ] }),
        (total === void 0 || loading) && /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-white" }) })
      ] })
    ] })
  ] });
};
const CompletedCard = ({ course, cert, onDownload }) => /* @__PURE__ */ jsxs(
  "a",
  {
    href: `/courses/${course.slug}`,
    className: "group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block",
    children: [
      /* @__PURE__ */ jsx("div", { className: "h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" }),
      /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-sm leading-snug flex-1", children: course.title }),
          /* @__PURE__ */ jsxs("span", { className: "flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-extrabold rounded-full uppercase tracking-wide", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
            " Done"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2 text-xs font-bold text-slate-500", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-emerald-500" }),
            /* @__PURE__ */ jsx("span", { children: "Certificate Earned" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "group-hover:text-emerald-600 transition-colors flex items-center gap-1", children: [
            "Review Curriculum ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })
          ] })
        ] })
      ] })
    ]
  }
);
const AvailableCard = ({ course }) => /* @__PURE__ */ jsxs(
  "a",
  {
    href: `/courses/${course.slug}`,
    className: "group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block",
    children: [
      /* @__PURE__ */ jsx("div", { className: "h-2 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400" }),
      /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-indigo-500" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-sm leading-snug pt-1", children: course.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs font-bold text-indigo-500 group-hover:text-indigo-600 group-hover:gap-2 transition-all duration-200", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsx("span", { children: "Start learning" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" })
        ] })
      ] })
    ]
  }
);
const CertCard = ({ cert, onDownload, copyMsg, onCopy, prepState }) => {
  var _a, _b;
  const handleFeedPost = async (e) => {
    var _a2;
    e.preventDefault();
    const certUrl = `${window.location.origin}/verify/${cert.certificateId}`;
    const courseTitle = ((_a2 = cert.course) == null ? void 0 : _a2.title) || "Certification";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: "My SkillValix Certificate",
          text: `I just earned my certificate for ${courseTitle} on SkillValix! 🚀 Check it out: `,
          url: certUrl
        });
        return;
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    }
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
    const width = 800;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(linkedinUrl, "linkedin-share", `width=${width},height=${height},top=${top},left=${left},noopener,noreferrer`);
  };
  const isEvent = cert.isEvent;
  const isJobSim = isEvent && cert.eventType === "job-simulation";
  const cardBgCls = isJobSim ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100";
  const topGrad = isJobSim ? "from-emerald-400 via-teal-500 to-cyan-500" : "from-amber-400 via-orange-400 to-rose-400";
  const IconBg = isJobSim ? "from-emerald-400 to-teal-500 shadow-teal-500/40" : "from-amber-400 to-orange-500 shadow-amber-300/40";
  const titleCls = isJobSim ? "text-white" : "text-slate-900";
  const dateCls = isJobSim ? "text-teal-400" : "text-amber-400";
  const boxBgCls = isJobSim ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100";
  const boxTextCls = isJobSim ? "text-slate-300" : "text-slate-600";
  const primaryBtn = isJobSim ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-900 hover:bg-slate-800 text-white";
  const copyBtnBg = isJobSim ? copyMsg === cert.certificateId ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-400 scale-[0.98]" : "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300" : copyMsg === cert.certificateId ? "bg-emerald-50 border-emerald-300 text-emerald-600 scale-[0.98]" : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600";
  return /* @__PURE__ */ jsxs("div", { className: `group ${cardBgCls} rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`, children: [
    /* @__PURE__ */ jsx("div", { className: `h-2 bg-gradient-to-r ${topGrad}` }),
    /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg ${IconBg}`, children: /* @__PURE__ */ jsx(Award, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: `font-extrabold ${titleCls} text-sm leading-tight line-clamp-2`, children: ((_a = cert.course) == null ? void 0 : _a.title) || "Certificate Course" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Star, { className: `w-2.5 h-2.5 ${dateCls} fill-current` }),
            new Date(cert.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `${boxBgCls} rounded-xl px-3 py-2 mb-4`, children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium mb-0.5", children: "Certificate ID" }),
        /* @__PURE__ */ jsx("p", { className: `text-xs font-mono font-bold ${boxTextCls} truncate select-all`, children: cert.certificateId })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => onDownload(cert),
              disabled: prepState == null ? void 0 : prepState.busy,
              className: `flex-1 relative overflow-hidden text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98] ${primaryBtn}`,
              children: [
                (prepState == null ? void 0 : prepState.busy) ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }),
                (prepState == null ? void 0 : prepState.busy) ? "Generating..." : "Download PDF"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onCopy(cert),
              title: "Copy verification link",
              className: `flex-shrink-0 px-4 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300 ${copyBtnBg}`,
              children: copyMsg === cert.certificateId ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }),
                " Copied"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Share2, { className: "w-3.5 h-3.5" }),
                " Copy"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(((_b = cert.course) == null ? void 0 : _b.title) || "Certification")}&organizationName=SkillValix&certId=${cert.certificateId}&certUrl=${encodeURIComponent(`${window.location.origin}/verify/${cert.certificateId}`)}`,
              target: "_blank",
              rel: "noopener noreferrer",
              title: "Add certification to your LinkedIn Profile",
              className: "flex-1 bg-white border border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 text-[#0A66C2] text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98]",
              children: [
                /* @__PURE__ */ jsx(Linkedin, { className: "w-3.5 h-3.5" }),
                "Add to Profile"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleFeedPost,
              title: "Create a post on your LinkedIn Feed",
              className: "flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[.98]",
              children: [
                /* @__PURE__ */ jsx(Linkedin, { className: "w-3.5 h-3.5" }),
                "Post to Feed"
              ]
            }
          )
        ] })
      ] }),
      (prepState == null ? void 0 : prepState.message) && (prepState == null ? void 0 : prepState.busy) === false && /* @__PURE__ */ jsx("p", { className: "mt-3 text-[11px] font-medium leading-relaxed text-red-500", children: prepState.message })
    ] })
  ] });
};
const Empty = ({ icon: Icon, title, sub }) => /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center", children: [
  /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7 text-slate-300" }) }),
  /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-bold text-sm", children: title }),
  /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-xs mt-1", children: sub })
] });
const Dashboard = () => {
  var _a, _b;
  const { isAuthenticated, loading: authLoading, user: storeUser } = useAuthStore();
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState([]);
  const userData = storeUser;
  const [loading, setLoading] = useState(true);
  const [copyMsg, setCopyMsg] = useState("");
  const [prepStates, setPrepStates] = useState({});
  const [exportCert, setExportCert] = useState(null);
  const certTemplateRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "learning";
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "learning" || tab === "certificates" || tab === "profile")) {
      setActiveTab(tab);
    }
  }, [location.search]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    github: "",
    linkedin: "",
    resume: "",
    portfolio: "",
    username: "",
    openToWork: false,
    college: "",
    branch: "",
    year: "",
    phoneNumber: "",
    bio: "",
    showPhoneNumber: false,
    theme: "light",
    customSkillsText: "",
    projects: [],
    customLinks: []
  });
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
        resume: userData.resume || "",
        portfolio: userData.portfolio || "",
        username: userData.username || "",
        openToWork: userData.openToWork || false,
        college: userData.college || "",
        branch: userData.branch || "",
        year: userData.year || "",
        phoneNumber: userData.phoneNumber || "",
        bio: userData.bio || "",
        showPhoneNumber: userData.showPhoneNumber || false,
        theme: userData.theme || "light",
        customSkillsText: (userData.customSkills || []).join(", "),
        projects: userData.projects || [],
        customLinks: userData.customLinks || []
      });
    }
  }, [userData]);
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const validLinks = profileData.customLinks.filter((l) => l.title.trim() !== "" && l.url.trim() !== "");
      const validProjects = profileData.projects.filter((p) => p.title.trim() !== "");
      const payload = {
        ...profileData,
        customLinks: validLinks,
        projects: validProjects,
        customSkills: profileData.customSkillsText ? profileData.customSkillsText.split(",").map((s) => s.trim()).filter(Boolean) : []
      };
      const res = await api.put("/auth/profile", payload);
      useAuthStore.setState({ user: res.data });
      sessionStorage.setItem("skillvalix_user", JSON.stringify(res.data));
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile details.");
    } finally {
      setSavingProfile(false);
    }
  };
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const [cR, courseList] = await Promise.all([
          cachedGet("certs_mine", "/certificates/mine"),
          getCourseList()
        ]);
        setCerts(cR);
        setCourses(courseList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, authLoading, navigate]);
  useEffect(() => {
    const hasCountdown = Object.values(prepStates).some((state) => (state == null ? void 0 : state.seconds) > 0);
    if (!hasCountdown) return void 0;
    const timerId = setInterval(() => {
      setPrepStates((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          var _a2;
          if (((_a2 = next[key]) == null ? void 0 : _a2.seconds) > 0) {
            next[key] = { ...next[key], seconds: next[key].seconds - 1 };
          }
        });
        return next;
      });
    }, 1e3);
    return () => clearInterval(timerId);
  }, [prepStates]);
  const dl = async (cert) => {
    const certId = cert == null ? void 0 : cert.certificateId;
    if (!certId) return;
    setPrepStates((prev) => ({ ...prev, [certId]: { busy: true, seconds: 0, message: "Preparing your certificate PDF…" } }));
    setExportCert(cert);
    setTimeout(async () => {
      try {
        const fileName = `${cert.isEvent ? "JobSimCertificate" : "Certificate"}-${cert.certificateId}`;
        await generatePDFFromDOM(certTemplateRef, fileName);
        setExportCert(null);
        setPrepStates((prev) => {
          const next = { ...prev };
          delete next[certId];
          return next;
        });
      } catch (err) {
        setExportCert(null);
        setPrepStates((prev) => ({
          ...prev,
          [certId]: { busy: false, seconds: 0, message: err.message || "Generation failed. Please try again." }
        }));
      }
    }, 300);
  };
  const copy = (cert) => {
    const url = `${window.location.origin}/verify/${cert.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopyMsg(cert.certificateId);
    setTimeout(() => setCopyMsg(""), 2e3);
  };
  const certMap = {};
  certs.forEach((c) => {
    var _a2, _b2;
    const id = (_b2 = ((_a2 = c.course) == null ? void 0 : _a2._id) || c.course) == null ? void 0 : _b2.toString();
    if (id) certMap[id] = c;
  });
  const completed = courses.filter((c) => certMap[c._id.toString()]);
  const available = courses.filter((c) => !certMap[c._id.toString()]);
  const initials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  const firstName = ((_a = userData == null ? void 0 : userData.name) == null ? void 0 : _a.split(" ")[0]) || "Student";
  const pct = courses.length ? Math.round(completed.length / courses.length * 100) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8fafc]", children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .animate-shimmer { animation: shimmer 1.8s infinite linear; }
      ` }),
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("title", { children: "My Dashboard | SkillValix" }) }),
    exportCert && /* @__PURE__ */ jsx(
      CertificateTemplate,
      {
        ref: certTemplateRef,
        studentName: (userData == null ? void 0 : userData.name) || "Student",
        courseTitle: ((_b = exportCert.course) == null ? void 0 : _b.title) || "Certification",
        certificateId: exportCert.certificateId,
        issueDate: new Date(exportCert.issueDate || Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
        verifyUrl: `${window.location.origin}/verify/${exportCert.certificateId}`,
        isEvent: exportCert.isEvent
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 pt-10 pb-28 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.07]",
          style: { backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-3xl -translate-y-1/2 translate-x-1/4" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-xl font-black shadow-2xl select-none flex-shrink-0", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin opacity-60" }) : initials(userData == null ? void 0 : userData.name) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-1", children: "Dashboard" }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white leading-tight", children: loading ? /* @__PURE__ */ jsx("span", { className: "inline-block w-44 h-8 bg-white/15 rounded-lg animate-pulse align-middle" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Welcome, ",
            /* @__PURE__ */ jsx("span", { className: "text-yellow-300", children: firstName }),
            " 👋"
          ] }) }),
          !loading && userData && /* @__PURE__ */ jsx("div", { className: "mt-2.5", children: /* @__PURE__ */ jsxs("a", { href: `/u/${userData.username || userData._id || userData.id}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-indigo-50 px-3 py-1.5 rounded-lg border border-white/20 transition-all shadow-sm", children: [
            /* @__PURE__ */ jsx(Share2, { className: "w-3.5 h-3.5" }),
            "View Public Portfolio"
          ] }) })
        ] }),
        !loading && courses.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ml-auto hidden sm:flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-14 h-14", children: [
            /* @__PURE__ */ jsx(ProgressRing, { pct, size: 56, stroke: 5, color: "#fbbf24" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs("span", { className: "text-white text-xs font-black", children: [
              pct,
              "%"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[10px] font-bold uppercase tracking-widest", children: "Overall" }),
            /* @__PURE__ */ jsx("p", { className: "text-white font-extrabold text-sm", children: "Progress" }),
            /* @__PURE__ */ jsxs("p", { className: "text-indigo-200 text-xs", children: [
              completed.length,
              "/",
              courses.length,
              " done"
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 mb-10 relative z-10", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Sk, { cls: "h-28" }),
      /* @__PURE__ */ jsx(Sk, { cls: "h-28" }),
      /* @__PURE__ */ jsx(Sk, { cls: "h-28" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        StatCard,
        {
          icon: GraduationCap,
          label: "Total Courses",
          value: courses.length,
          gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
          iconBg: "bg-blue-400/30",
          loading
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          icon: CheckCircle,
          label: "Completed",
          value: completed.length,
          total: courses.length,
          gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
          iconBg: "bg-emerald-400/30",
          loading
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          icon: Trophy,
          label: "Certificates",
          value: certs.length,
          total: courses.length,
          gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500",
          iconBg: "bg-amber-400/30",
          loading
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 border-b border-slate-200 mb-8", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("learning"), className: `py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors text-center flex flex-col items-center gap-1 ${activeTab === "learning" ? "border-indigo-600 text-indigo-700 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-800"}`, children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }),
          "Learning"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("certificates"), className: `py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors text-center flex flex-col items-center gap-1 ${activeTab === "certificates" ? "border-indigo-600 text-indigo-700 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-800"}`, children: [
          /* @__PURE__ */ jsx(Medal, { className: "w-4 h-4" }),
          "Certificates"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("profile"), className: `py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors text-center flex flex-col items-center gap-1 ${activeTab === "profile" ? "border-indigo-600 text-indigo-700 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-800"}`, children: [
          /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
          "Portfolio"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
        activeTab === "learning" && /* @__PURE__ */ jsxs("div", { className: "space-y-10 animate-fade-in", children: [
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx(
              SectionHead,
              {
                icon: CheckCircle,
                title: "Completed Courses",
                iconCls: "bg-emerald-100 text-emerald-600",
                count: !loading ? `${completed.length} done` : void 0,
                countCls: "bg-emerald-100 text-emerald-700"
              }
            ),
            loading ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4", children: [
              /* @__PURE__ */ jsx(Sk, { cls: "h-36" }),
              /* @__PURE__ */ jsx(Sk, { cls: "h-36" })
            ] }) : completed.length === 0 ? /* @__PURE__ */ jsx(
              Empty,
              {
                icon: Sparkles,
                title: "No completed courses yet",
                sub: "Pass a quiz to earn your first certificate!"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4", children: completed.map((c) => /* @__PURE__ */ jsx(CompletedCard, { course: c, cert: certMap[c._id.toString()], onDownload: dl }, c._id)) })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx(
              SectionHead,
              {
                icon: BookOpen,
                title: "Available Courses",
                iconCls: "bg-indigo-100 text-indigo-600",
                count: !loading ? `${available.length} courses` : void 0,
                countCls: "bg-indigo-100 text-indigo-700"
              }
            ),
            loading ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4", children: [
              /* @__PURE__ */ jsx(Sk, { cls: "h-24" }),
              /* @__PURE__ */ jsx(Sk, { cls: "h-24" }),
              /* @__PURE__ */ jsx(Sk, { cls: "h-24" })
            ] }) : available.length === 0 ? /* @__PURE__ */ jsx(Empty, { icon: Trophy, title: "🎉 All courses completed!", sub: "You're a SkillValix champion." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(240px,320px))] justify-center gap-4", children: available.map((c) => /* @__PURE__ */ jsx(AvailableCard, { course: c }, c._id)) })
          ] })
        ] }),
        activeTab === "profile" && /* @__PURE__ */ jsx("div", { className: "animate-fade-in max-w-3xl mx-auto", children: !loading && userData && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-slate-900 tracking-tight", children: "Public Portfolio" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "How your profile appears to recruiters and visitors." })
            ] }),
            !editingProfile && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setProfileData({
                    name: userData.name || "",
                    github: userData.github || "",
                    linkedin: userData.linkedin || "",
                    resume: userData.resume || "",
                    portfolio: userData.portfolio || "",
                    username: userData.username || "",
                    openToWork: userData.openToWork || false,
                    college: userData.college || "",
                    branch: userData.branch || "",
                    year: userData.year || "",
                    phoneNumber: userData.phoneNumber || "",
                    bio: userData.bio || "",
                    showPhoneNumber: userData.showPhoneNumber || false,
                    theme: userData.theme || "light",
                    customSkillsText: (userData.customSkills || []).join(", "),
                    projects: userData.projects || [],
                    customLinks: userData.customLinks || []
                  });
                  setEditingProfile(true);
                },
                className: "inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95",
                children: [
                  /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
                  "Edit Profile"
                ]
              }
            )
          ] }),
          editingProfile ? (
            /* ── EDIT MODE ── */
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 space-y-8", children: [
              /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pb-2 border-b border-slate-100 mb-4", children: [
                  /* @__PURE__ */ jsx(UserRound, { className: "w-4 h-4 text-indigo-600" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-slate-800", children: "Personal Information" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Full Name" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: profileData.name, onChange: (e) => setProfileData({ ...profileData, name: e.target.value }), placeholder: "John Doe", className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Custom Username Slug" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex", children: [
                      /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-400 text-xs font-bold", children: "/u/" }),
                      /* @__PURE__ */ jsx("input", { type: "text", value: profileData.username, onChange: (e) => setProfileData({ ...profileData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }), placeholder: userData._id, className: "flex-1 min-w-0 text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-none rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Professional Bio / About Me" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: profileData.bio,
                      onChange: (e) => setProfileData({ ...profileData, bio: e.target.value }),
                      placeholder: "Tell recruiters about your goals, skills, and background...",
                      className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none h-32 resize-none transition-all"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 border-t border-slate-100 pt-4 mt-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Custom Skills (comma separated)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: profileData.customSkillsText,
                      onChange: (e) => setProfileData({ ...profileData, customSkillsText: e.target.value }),
                      placeholder: "e.g. React, Node.js, Graphic Design",
                      className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 pl-1", children: "These will merge with skills automatically extracted from your finished courses." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pb-2 border-b border-slate-100 mb-4", children: [
                  /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-indigo-600" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-slate-800", children: "Academic Details" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "College / University Name" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: profileData.college, onChange: (e) => setProfileData({ ...profileData, college: e.target.value }), placeholder: "IIT Bombay / Your University", className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Branch / Specialization" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: profileData.branch, onChange: (e) => setProfileData({ ...profileData, branch: e.target.value }), placeholder: "Computer Science / AI", className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Current Year / Status" }),
                    /* @__PURE__ */ jsxs("select", { value: profileData.year, onChange: (e) => setProfileData({ ...profileData, year: e.target.value }), className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer", children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Year" }),
                      /* @__PURE__ */ jsx("option", { value: "1st Year", children: "1st Year" }),
                      /* @__PURE__ */ jsx("option", { value: "2nd Year", children: "2nd Year" }),
                      /* @__PURE__ */ jsx("option", { value: "3rd Year", children: "3rd Year" }),
                      /* @__PURE__ */ jsx("option", { value: "4th Year", children: "4th Year" }),
                      /* @__PURE__ */ jsx("option", { value: "Graduated", children: "Graduated" }),
                      /* @__PURE__ */ jsx("option", { value: "Post-Graduation", children: "Post-Graduation" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pb-2 border-b border-slate-100 mb-4", children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-indigo-600" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-slate-800", children: "Social & Contact Links" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "LinkedIn URL" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(Linkedin, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A66C2]" }),
                      /* @__PURE__ */ jsx("input", { type: "text", value: profileData.linkedin, onChange: (e) => setProfileData({ ...profileData, linkedin: e.target.value }), placeholder: "linkedin.com/in/myname", className: "w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "GitHub URL" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(Github, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-800" }),
                      /* @__PURE__ */ jsx("input", { type: "text", value: profileData.github, onChange: (e) => setProfileData({ ...profileData, github: e.target.value }), placeholder: "github.com/myname", className: "w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Resume Link (G-Drive/Dropbox)" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" }),
                      /* @__PURE__ */ jsx("input", { type: "text", value: profileData.resume, onChange: (e) => setProfileData({ ...profileData, resume: e.target.value }), placeholder: "https://drive.google.com/...", className: "w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Phone Number" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" }),
                      /* @__PURE__ */ jsx("input", { type: "tel", value: profileData.phoneNumber, onChange: (e) => setProfileData({ ...profileData, phoneNumber: e.target.value }), placeholder: "+91 12345 67890", className: "w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Portfolio / Portfolio URL" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" }),
                      /* @__PURE__ */ jsx("input", { type: "text", value: profileData.portfolio, onChange: (e) => setProfileData({ ...profileData, portfolio: e.target.value }), placeholder: "myportfolio.com", className: "w-full text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-slate-100 mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("i", { className: "w-4 h-4 text-indigo-600 lucide lucide-link" }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-slate-800", children: "Featured Links" })
                  ] }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setProfileData({ ...profileData, customLinks: [...profileData.customLinks, { title: "", url: "" }] }), className: "text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors", children: "+ Add Link" })
                ] }),
                profileData.customLinks.map((link, idx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200", children: [
                  /* @__PURE__ */ jsx("input", { type: "text", value: link.title, onChange: (e) => {
                    const newLinks = [...profileData.customLinks];
                    newLinks[idx].title = e.target.value;
                    setProfileData({ ...profileData, customLinks: newLinks });
                  }, placeholder: "Link Title (e.g. My Blog)", className: "flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: link.url, onChange: (e) => {
                    const newLinks = [...profileData.customLinks];
                    newLinks[idx].url = e.target.value;
                    setProfileData({ ...profileData, customLinks: newLinks });
                  }, placeholder: "URL (https://...)", className: "flex-[2] text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    const newLinks = [...profileData.customLinks];
                    newLinks.splice(idx, 1);
                    setProfileData({ ...profileData, customLinks: newLinks });
                  }, className: "px-3 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors border border-rose-100", children: "Remove" })
                ] }, idx))
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-slate-100 mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Briefcase, { className: "w-4 h-4 text-indigo-600" }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-slate-800", children: "Portfolio Projects" })
                  ] }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setProfileData({ ...profileData, projects: [...profileData.projects, { title: "", description: "", link: "", github: "", techStack: [] }] }), className: "text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors", children: "+ Add Project" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5", children: profileData.projects.map((proj, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-slate-200 p-5 rounded-[1.5rem] relative shadow-sm", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    const newProjs = [...profileData.projects];
                    newProjs.splice(idx, 1);
                    setProfileData({ ...profileData, projects: newProjs });
                  }, className: "absolute top-4 right-4 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-100", children: "Remove" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
                    /* @__PURE__ */ jsx("input", { type: "text", value: proj.title, onChange: (e) => {
                      const newProjs = [...profileData.projects];
                      newProjs[idx].title = e.target.value;
                      setProfileData({ ...profileData, projects: newProjs });
                    }, placeholder: "Project Title", className: "w-full text-base font-black px-4 py-2 border-b border-slate-200 outline-none focus:border-indigo-500 placeholder:font-medium" }),
                    /* @__PURE__ */ jsx("textarea", { value: proj.description, onChange: (e) => {
                      const newProjs = [...profileData.projects];
                      newProjs[idx].description = e.target.value;
                      setProfileData({ ...profileData, projects: newProjs });
                    }, placeholder: "Briefly describe what you built...", className: "w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsx("input", { type: "text", value: proj.link, onChange: (e) => {
                        const newProjs = [...profileData.projects];
                        newProjs[idx].link = e.target.value;
                        setProfileData({ ...profileData, projects: newProjs });
                      }, placeholder: "Live Link (https://...)", className: "w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" }),
                      /* @__PURE__ */ jsx("input", { type: "text", value: proj.github, onChange: (e) => {
                        const newProjs = [...profileData.projects];
                        newProjs[idx].github = e.target.value;
                        setProfileData({ ...profileData, projects: newProjs });
                      }, placeholder: "GitHub / Source Link", className: "w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" })
                    ] }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: proj.techStack ? proj.techStack.join(", ") : "", onChange: (e) => {
                      const newProjs = [...profileData.projects];
                      newProjs[idx].techStack = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setProfileData({ ...profileData, projects: newProjs });
                    }, placeholder: "Tech Stack (comma separated, e.g. React, Tailwind, Express)", className: "w-full text-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" })
                  ] })
                ] }, idx)) })
              ] }),
              /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pb-2 border-b border-slate-100 mb-4", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-indigo-600" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-slate-800", children: "Public Privacy" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all group", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${profileData.openToWork ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500"}`, children: /* @__PURE__ */ jsx(Zap, { className: `w-5 h-5 ${profileData.openToWork ? "animate-bounce" : ""}` }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-900", children: "Open to Work" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Displays hired badge" })
                    ] }),
                    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: profileData.openToWork, onChange: (e) => setProfileData({ ...profileData, openToWork: e.target.checked }), className: "w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500" })
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all group", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${profileData.showPhoneNumber ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"}`, children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-900", children: "Show Contact" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Public phone view" })
                    ] }),
                    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: profileData.showPhoneNumber, onChange: (e) => setProfileData({ ...profileData, showPhoneNumber: e.target.checked }), className: "w-5 h-5 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-100 space-y-1.5 mt-4", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 ml-1", children: "Portfolio Theme" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: profileData.theme,
                      onChange: (e) => setProfileData({ ...profileData, theme: e.target.value }),
                      className: "w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "light", children: "Light Mode (Clean & Minimal)" }),
                        /* @__PURE__ */ jsx("option", { value: "dark", children: "Dark Mode (Premium & Modern)" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setEditingProfile(false),
                    className: "flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]",
                    children: "Discard Changes"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleSaveProfile,
                    disabled: savingProfile,
                    className: "flex-[2] py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 disabled:opacity-70 flex items-center justify-center gap-2 active:scale-[0.98]",
                    children: [
                      savingProfile ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-5 h-5" }),
                      savingProfile ? "Saving..." : "Save Profile"
                    ]
                  }
                )
              ] })
            ] })
          ) : (
            /* ── VIEW MODE ── */
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center text-white text-3xl font-black rotate-2 group-hover:rotate-0 transition-all", children: profileData.name.charAt(0) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-slate-900", children: profileData.name }),
                      /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-indigo-500" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-wider", children: [
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }),
                        userData.username ? `/u/${userData.username}` : "No username set"
                      ] }),
                      profileData.openToWork && /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg", children: [
                        /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 animate-bounce fill-current" }),
                        "Open to Work"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      to: `/u/${userData.username || userData._id}`,
                      target: "_blank",
                      className: "w-full md:w-auto h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-3 text-sm font-bold shadow-lg shadow-slate-100 transition-all",
                      children: [
                        "Visit Portfolio",
                        /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4" })
                      ]
                    }
                  )
                ] }),
                profileData.bio && /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-8 border-t border-slate-100", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3", children: "About Me" }),
                  /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line", children: profileData.bio })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5" }) }),
                    /* @__PURE__ */ jsx("h4", { className: "font-black text-slate-900 tracking-tight", children: "Academic Info" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx(InfoItem, { label: "University", value: profileData.college, icon: MapPin }),
                    /* @__PURE__ */ jsx(InfoItem, { label: "Branch", value: profileData.branch, icon: Settings }),
                    /* @__PURE__ */ jsx(InfoItem, { label: "Status", value: profileData.year, icon: Clock })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Share2, { className: "w-5 h-5" }) }),
                    /* @__PURE__ */ jsx("h4", { className: "font-black text-slate-900 tracking-tight", children: "Social Presence" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsx(SocialIcon, { title: "LinkedIn", value: profileData.linkedin, icon: Linkedin, color: "#0A66C2" }),
                    /* @__PURE__ */ jsx(SocialIcon, { title: "GitHub", value: profileData.github, icon: Github, color: "#181717" }),
                    /* @__PURE__ */ jsx(SocialIcon, { title: "Resume", value: profileData.resume, icon: FileText, color: "#EF4444" }),
                    /* @__PURE__ */ jsx(SocialIcon, { title: "My Work", value: profileData.portfolio, icon: Globe, color: "#4F46E5" })
                  ] })
                ] })
              ] })
            ] })
          )
        ] }) }),
        activeTab === "certificates" && /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
          /* @__PURE__ */ jsx(
            SectionHead,
            {
              icon: Medal,
              title: "My Certificates",
              iconCls: "bg-amber-100 text-amber-600",
              count: !loading && certs.length > 0 ? `${certs.length}` : void 0,
              countCls: "bg-amber-100 text-amber-700"
            }
          ),
          loading ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsx(Sk, { cls: "h-40" }),
            /* @__PURE__ */ jsx(Sk, { cls: "h-40" })
          ] }) : certs.length === 0 ? /* @__PURE__ */ jsx(Empty, { icon: Award, title: "No certificates yet", sub: "Pass a quiz to earn one!" }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: certs.map((cert) => /* @__PURE__ */ jsx(
            CertCard,
            {
              cert,
              onDownload: dl,
              copyMsg,
              onCopy: copy,
              prepState: prepStates[cert.certificateId]
            },
            cert.certificateId
          )) })
        ] })
      ] })
    ] })
  ] });
};
export {
  Dashboard as default
};
