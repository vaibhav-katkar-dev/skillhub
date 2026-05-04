import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { u as useAuthStore, H as Helmet } from "../main.mjs";
import axios from "axios";
import { C as CertificateTemplate, g as generatePDFFromDOM } from "./CertificateTemplate-DB_rTmRV.js";
import { Search, Lock, ArrowLeft, Settings, Palette, BarChart3, Laptop, Clock3, ClipboardList, UserRound, Award, ShieldCheck, CheckCircle2, BadgeCheck, ArrowDownToLine } from "lucide-react";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "@react-oauth/google";
import "vite-react-ssg";
import "html-to-image";
import "jspdf";
import "qrcode.react";
const API_BASE = "https://api.skillvalix.com/api";
const ICON_MAP = {
  Laptop,
  BarChart3,
  Palette,
  Settings
};
const prettyDomain = (domain) => {
  if (!domain) return "";
  return domain.replace(/^www\./i, "");
};
const getPlaceholder = (task) => {
  if (!Array.isArray(task == null ? void 0 : task.acceptedDomains) || task.acceptedDomains.length === 0) {
    return `Paste project URL (${task.type} link)...`;
  }
  const sample = task.acceptedDomains.slice(0, 2).map(prettyDomain).join(" or ");
  return `Paste public URL (${sample})`;
};
const apiClient = axios.create({ baseURL: API_BASE });
apiClient.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
function JobSimulation() {
  var _a;
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [certData, setCertData] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const certTemplateRef = useRef(null);
  const [err, setErr] = useState("");
  const [taskStatus, setTaskStatus] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [taskErrors, setTaskErrors] = useState({});
  useEffect(() => {
    fetch("/data/job-simulations.json").then((r) => r.json()).then((data) => {
      const found = data.find((item) => item.id === id);
      setSim(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (isAuthenticated && sim) {
      apiClient.get("/certificates/mine").then((res) => {
        const existing = res.data.find((c) => c.isEvent && c.eventType === "job-simulation" && c.eventTitle === sim.title);
        if (existing) setCertData(existing);
      }).catch((err2) => console.error(err2));
      apiClient.get(`/events/simulations/progress/${sim.id}`).then((res) => {
        var _a2;
        const completedMap = {};
        (_a2 = res.data.completedTasks) == null ? void 0 : _a2.forEach((num) => {
          completedMap[num] = "completed";
        });
        setTaskStatus((p) => ({ ...p, ...completedMap }));
      }).catch((err2) => console.error("[Progress] Fetch failed:", err2));
    }
  }, [isAuthenticated, sim, user]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Loading Simulation..." })
    ] });
  }
  if (!sim) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4", children: [
      /* @__PURE__ */ jsx(Search, { className: "w-16 h-16", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold", children: "Simulation not found." }),
      /* @__PURE__ */ jsx(Link, { to: "/events", className: "text-indigo-600 underline", children: "Back to Events" })
    ] });
  }
  if (sim.comingSoon) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Helmet, { children: [
        /* @__PURE__ */ jsxs("title", { children: [
          sim.title,
          " - Coming Soon | SkillValix Events"
        ] }),
        /* @__PURE__ */ jsx("meta", { name: "description", content: `${sim.title} is coming soon.` })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-20 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 text-center shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-200 text-xs font-bold uppercase tracking-[0.3em] mb-6", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4", "aria-hidden": "true" }),
          "Coming Soon"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-5xl font-black text-white mb-4", children: sim.title }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-300 max-w-2xl mx-auto mb-8", children: "This job simulation is visible for preview, but it is currently locked while we work on a lighter version of the experience." }),
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4 mb-8 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-widest text-slate-400 mb-1", children: "Role" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-white", children: sim.role })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-widest text-slate-400 mb-1", children: "Duration" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-white", children: sim.duration })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-widest text-slate-400 mb-1", children: "Status" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-amber-200", children: "Locked" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/events",
            className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4", "aria-hidden": "true" }),
              "Back to Events"
            ]
          }
        )
      ] }) })
    ] });
  }
  const SimIcon = ICON_MAP[sim.icon] || Laptop;
  const handleTaskSubmit = async (taskNum, taskType) => {
    var _a2;
    const url = (_a2 = submissions[taskNum]) == null ? void 0 : _a2.trim();
    if (!url || !isAuthenticated) return;
    setTaskStatus((p) => ({ ...p, [taskNum]: "reviewing" }));
    setTaskErrors((p) => ({ ...p, [taskNum]: "" }));
    try {
      await apiClient.post("/events/simulations/validate-task", {
        url,
        taskType,
        simId: sim.id,
        taskNum
      });
      setTaskStatus((p) => ({ ...p, [taskNum]: "completed" }));
    } catch (error) {
      setTaskStatus((p) => ({ ...p, [taskNum]: "pending" }));
      setTaskErrors((p) => {
        var _a3, _b;
        return { ...p, [taskNum]: ((_b = (_a3 = error.response) == null ? void 0 : _a3.data) == null ? void 0 : _b.message) || "Validation failed. Ensure your URL is valid and public." };
      });
    }
  };
  const totalTasks = sim.tasks.length;
  const completedCount = sim.tasks.filter((t) => taskStatus[t.num] === "completed").length;
  const minRequired = Math.max(1, Math.ceil(totalTasks * 0.6));
  const canUnlockCertificate = completedCount >= minRequired;
  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  const handleGetCertificate = async () => {
    var _a2, _b;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setErr("");
    setPaying(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      setErr("Payment gateway failed to load. Please try again.");
      setPaying(false);
      return;
    }
    try {
      const orderRes = await apiClient.post("/events/certificates/razorpay-order", {
        eventTitle: sim.title,
        eventType: "job-simulation",
        role: sim.role
      });
      const order = orderRes.data;
      const options = {
        key: "rzp_live_Rg7fc3FV1mTmCM",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "SkillValix",
        description: `Certificate: ${sim.title}`,
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          var _a3, _b2;
          try {
            const res = await apiClient.post("/events/certificates/generate", {
              eventType: "job-simulation",
              eventTitle: sim.title,
              role: sim.role,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            const newCertId = res.data.certificateId;
            setCertData({ certificateId: newCertId, issueDate: res.data.issueDate || /* @__PURE__ */ new Date() });
          } catch (e) {
            setErr(((_b2 = (_a3 = e.response) == null ? void 0 : _a3.data) == null ? void 0 : _b2.message) || "Verification failed. Contact support.");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed", response.error);
        setErr(response.error.description || "Payment failed.");
        setPaying(false);
      });
      razorpay.open();
    } catch (e) {
      setErr(((_b = (_a2 = e.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "Could not initiate payment. Server might be down.");
      setPaying(false);
    }
  };
  const certId = certData == null ? void 0 : certData.certificateId;
  const handleClientDownload = () => {
    if (!certId || generatingPdf) return;
    setGeneratingPdf(true);
    setErr("");
    setTimeout(async () => {
      try {
        const success = await generatePDFFromDOM(certTemplateRef, `JobSimCertificate-${certId}`);
        if (!success) throw new Error("PDF generation failed. Please try again.");
      } catch (e) {
        setErr(e.message || "Download failed. Please try again.");
      } finally {
        setGeneratingPdf(false);
      }
    }, 300);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    certId && /* @__PURE__ */ jsx(
      CertificateTemplate,
      {
        ref: certTemplateRef,
        studentName: (user == null ? void 0 : user.name) || "Student",
        courseTitle: sim.title,
        certificateId: certId,
        issueDate: (certData == null ? void 0 : certData.issueDate) ? new Date(certData.issueDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
        verifyUrl: `${window.location.origin}/verify/${certId}`,
        isEvent: true
      }
    ),
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        sim.title,
        " - SkillValix Events"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: sim.about }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `https://www.skillvalix.com/job-simulation/${id}` })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 opacity-10 bg-gradient-to-r ${sim.color}` }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/events", className: "inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6 transition-colors", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
            "Back to Events"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white border border-white/10", children: /* @__PURE__ */ jsx(SimIcon, { className: "w-8 h-8", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest", children: sim.company }),
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-indigo-400 mt-0.5", children: "Job Simulation" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-black text-white mb-4 leading-tight", children: sim.title }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-300 mb-6 max-w-lg", children: sim.about }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 mb-6", children: sim.skills.map((skill) => /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20", children: skill }, skill)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Clock3, { className: "w-4 h-4", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("strong", { children: sim.duration })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(ClipboardList, { className: "w-4 h-4", "aria-hidden": "true" }),
              /* @__PURE__ */ jsxs("strong", { children: [
                sim.tasks.length,
                " tasks"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("strong", { children: sim.level })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(UserRound, { className: "w-4 h-4", "aria-hidden": "true" }),
              "Role: ",
              /* @__PURE__ */ jsx("strong", { children: sim.role })
            ] })
          ] }),
          Array.isArray(sim.modules) && sim.modules.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-white/15 bg-white/5 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-slate-300 font-bold mb-2", children: "Simulation Modules" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: sim.modules.map((module, idx) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-slate-200 flex items-start gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "mt-0.5 text-cyan-300 font-bold", children: [
                idx + 1,
                "."
              ] }),
              /* @__PURE__ */ jsx("span", { children: module })
            ] }, `${module}-${idx}`)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-8 h-8 mx-auto mb-1 text-white", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("div", { className: "text-white font-bold text-lg", children: "Verified Certificate" }),
            /* @__PURE__ */ jsx("div", { className: "text-slate-400 text-sm", children: "Complete tasks, pay INR 99, and get your certificate." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-white/10 pt-4 space-y-2 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Certificate fee" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-white", children: [
                "INR ",
                sim.certCost
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Format" }),
              /* @__PURE__ */ jsx("span", { children: "PDF (Downloadable)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { children: "Verification" }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-300", "aria-hidden": "true" }),
                "QR Code"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { children: "LinkedIn share" }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-300", "aria-hidden": "true" }),
                "Supported"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { children: "Pass requirement" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-white", children: [
                minRequired,
                "/",
                totalTasks,
                " tasks"
              ] })
            ] })
          ] }),
          err && /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm", children: err }),
          certId ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm text-center font-semibold", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(BadgeCheck, { className: "w-4 h-4", "aria-hidden": "true" }),
              "Certificate Ready!"
            ] }) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleClientDownload,
                disabled: generatingPdf,
                className: `w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${generatingPdf ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-wait" : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-emerald-500/25"}`,
                children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2", children: generatingPdf ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" }),
                  "Generating PDF..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(ArrowDownToLine, { className: "w-4 h-4", "aria-hidden": "true" }),
                  "Download Certificate"
                ] }) })
              }
            ),
            generatingPdf && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-center animate-pulse", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-800 font-semibold leading-relaxed", children: [
              "Generating your PDF certificate.",
              /* @__PURE__ */ jsx("br", {}),
              "This takes 3–5 seconds..."
            ] }) })
          ] }) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleGetCertificate,
              disabled: paying || !canUnlockCertificate,
              className: `w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60 ${canUnlockCertificate ? `bg-gradient-to-r ${sim.color} text-white hover:opacity-90` : "bg-white/10 text-slate-400 cursor-not-allowed"}`,
              children: !canUnlockCertificate ? `Complete ${minRequired} tasks to unlock (${completedCount}/${totalTasks})` : paying ? "Processing..." : `Get Certificate for INR ${sim.certCost}`
            }
          ),
          !isAuthenticated && /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-slate-400", children: [
            /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-indigo-400 underline", children: "Log in" }),
            " ",
            "to unlock your certificate"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-16 px-6 bg-slate-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("h2", { className: "inline-flex items-center gap-2 text-2xl font-black text-slate-900 mb-8", children: [
        /* @__PURE__ */ jsx(ClipboardList, { className: "w-6 h-6 text-slate-700", "aria-hidden": "true" }),
        "Simulation Tasks"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sim.tasks.map((task) => {
        var _a2;
        return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${sim.color} flex items-center justify-center text-white font-black text-base`, children: task.num }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: task.title }),
              /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500", children: task.type })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-sm leading-relaxed", children: task.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 inline-flex items-center gap-1 text-xs text-slate-400", children: [
              /* @__PURE__ */ jsx(Clock3, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
              "Estimated: ",
              task.time
            ] }),
            task.deliverable && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-900", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Deliverable:" }),
              " ",
              task.deliverable
            ] }),
            Array.isArray(task.acceptedDomains) && task.acceptedDomains.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2", children: "Accepted Platforms" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: task.acceptedDomains.map((domain) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600",
                  children: prettyDomain(domain)
                },
                domain
              )) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 pt-5 border-t border-slate-100", children: taskStatus[task.num] === "completed" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5", "aria-hidden": "true" }),
              "Task Accepted! Great work."
            ] }) : taskStatus[task.num] === "reviewing" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-indigo-600 font-bold bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100", children: [
              /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" }),
              "Evaluating submission against AI grading metrics..."
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "url",
                      placeholder: getPlaceholder(task),
                      value: submissions[task.num] || "",
                      onChange: (e) => {
                        setSubmissions((p) => ({ ...p, [task.num]: e.target.value }));
                        setTaskErrors((p) => ({ ...p, [task.num]: "" }));
                      },
                      disabled: !isAuthenticated,
                      className: `w-full bg-slate-50 border ${taskErrors[task.num] ? "border-red-300 ring-1 ring-red-300" : "border-slate-200"} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60`
                    }
                  ),
                  !isAuthenticated && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-red-500 font-bold mt-1", children: "Please log in to submit tasks" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    disabled: !((_a2 = submissions[task.num]) == null ? void 0 : _a2.trim()) || !isAuthenticated,
                    onClick: () => handleTaskSubmit(task.num, task.type),
                    className: "px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap",
                    children: "Submit Task"
                  }
                )
              ] }),
              taskErrors[task.num] && /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-red-500 px-1 mt-1", children: taskErrors[task.num] })
            ] }) })
          ] })
        ] }) }, task.num);
      }) })
    ] }) }),
    ((_a = sim.faq) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsx("section", { className: "py-16 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("h2", { className: "inline-flex items-center gap-2 text-2xl font-black text-slate-900 mb-8", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-6 h-6 text-slate-700", "aria-hidden": "true" }),
        "Frequently Asked Questions"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sim.faq.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "border border-slate-100 rounded-xl p-5 bg-slate-50", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mb-1", children: item.q }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600", children: item.a })
      ] }, index)) })
    ] }) })
  ] });
}
export {
  JobSimulation as default
};
