import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useEffect } from "react";
import { u as useAuthStore, d as api, H as Helmet } from "../main.mjs";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, CircleDot, Clock3, ArrowLeft, Link2, Star, Users, Linkedin, Trophy, FileText, Loader2, CreditCard, ExternalLink, Send, Lock, AlertTriangle, X, Plus, ShieldCheck, Github, HardDriveUpload } from "lucide-react";
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
const REG_STATUS_STYLE = {
  registered: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Registered" },
  payment_pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Payment Pending" },
  submitted: { bg: "bg-sky-100", text: "text-sky-700", label: "Submitted" },
  under_review: { bg: "bg-violet-100", text: "text-violet-700", label: "Under Review" },
  approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  winner: { bg: "bg-amber-200", text: "text-amber-900", label: "🏆 Winner" }
};
const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});
function HackathonDetail() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [hack, setHack] = useState(null);
  const [loadingHack, setLoadingHack] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [loadingReg, setLoadingReg] = useState(false);
  const [winners, setWinners] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "" }]);
  const [submissionLink, setSubmissionLink] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "", tone: "info" });
  const rules = useMemo(() => {
    var _a2;
    return ((_a2 = hack == null ? void 0 : hack.contentConfig) == null ? void 0 : _a2.rules) || [];
  }, [hack]);
  const judgingCriteria = useMemo(() => {
    var _a2;
    return ((_a2 = hack == null ? void 0 : hack.contentConfig) == null ? void 0 : _a2.judgingCriteria) || [];
  }, [hack]);
  const timeline = useMemo(() => {
    var _a2;
    return ((_a2 = hack == null ? void 0 : hack.contentConfig) == null ? void 0 : _a2.timeline) || [];
  }, [hack]);
  const prizes = useMemo(() => (hack == null ? void 0 : hack.prizes) || [], [hack]);
  const faqs = useMemo(() => {
    var _a2;
    return ((_a2 = hack == null ? void 0 : hack.contentConfig) == null ? void 0 : _a2.faqs) || [];
  }, [hack]);
  const problemStatement = useMemo(() => {
    var _a2;
    return ((_a2 = hack == null ? void 0 : hack.contentConfig) == null ? void 0 : _a2.problemStatement) || "";
  }, [hack]);
  const statusStyle = STATUS_STYLE[hack == null ? void 0 : hack.status] || STATUS_STYLE.upcoming;
  const StatusIcon = statusStyle.icon;
  const showMsg = (text, tone = "info") => setMsg({ text, tone });
  const fetchHack = useCallback(async () => {
    setLoadingHack(true);
    try {
      const r = await api.get(`/events/hackathons/${id}`);
      setHack(r.data);
    } catch {
      setHack(null);
    } finally {
      setLoadingHack(false);
    }
  }, [id]);
  const fetchMyTeam = useCallback(async () => {
    if (!isAuthenticated || !(hack == null ? void 0 : hack._id)) {
      setRegistration(null);
      return;
    }
    setLoadingReg(true);
    try {
      const r = await api.get(`/events/hackathons/${hack._id}/my-team`);
      setRegistration(r.data);
    } catch {
      setRegistration(null);
    } finally {
      setLoadingReg(false);
    }
  }, [hack == null ? void 0 : hack._id, isAuthenticated]);
  const fetchWinners = useCallback(async () => {
    try {
      const r = await api.get(`/events/hackathons/${id}/winners`);
      setWinners(r.data);
    } catch {
      setWinners(null);
    }
  }, [id]);
  useEffect(() => {
    fetchHack();
  }, [fetchHack]);
  useEffect(() => {
    fetchMyTeam();
  }, [fetchMyTeam]);
  useEffect(() => {
    var _a2;
    if ((_a2 = hack == null ? void 0 : hack.winnerConfig) == null ? void 0 : _a2.announced) fetchWinners();
  }, [hack, fetchWinners]);
  const teamMax = Number(((_a = hack == null ? void 0 : hack.teamConfig) == null ? void 0 : _a.maxMembers) || 4);
  const teamMin = Number(((_b = hack == null ? void 0 : hack.teamConfig) == null ? void 0 : _b.minMembers) || 1);
  const addMemberRow = () => {
    if (members.length < teamMax - 1) {
      setMembers((prev) => [...prev, { name: "", email: "" }]);
    }
  };
  const removeMemberRow = (idx) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateMember = (idx, field, val) => {
    setMembers((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: val } : m));
  };
  const [timeLeft, setTimeLeft] = useState("");
  const [timerLabel, setTimerLabel] = useState("");
  const isSubmissionOpen = useMemo(() => {
    if ((hack == null ? void 0 : hack.status) === "ended") return false;
    const subDeadline = (hack == null ? void 0 : hack.submissionDeadline) ? new Date(hack.submissionDeadline).getTime() : (hack == null ? void 0 : hack.endDate) ? new Date(hack.endDate).getTime() : null;
    if (!subDeadline) return true;
    return Date.now() < subDeadline;
  }, [hack]);
  const isRegistrationOpen = useMemo(() => {
    if ((hack == null ? void 0 : hack.status) === "ended") return false;
    const regDeadline = (hack == null ? void 0 : hack.registrationDeadline) ? new Date(hack.registrationDeadline).getTime() : (hack == null ? void 0 : hack.endDate) ? new Date(hack.endDate).getTime() : null;
    if (!regDeadline) return true;
    return Date.now() < regDeadline;
  }, [hack]);
  useEffect(() => {
    if ((hack == null ? void 0 : hack.status) === "ended") {
      setTimeLeft("Ended");
      setTimerLabel("Ended");
      return;
    }
    const regDeadline = (hack == null ? void 0 : hack.registrationDeadline) ? new Date(hack.registrationDeadline).getTime() : (hack == null ? void 0 : hack.endDate) ? new Date(hack.endDate).getTime() : null;
    const subDeadline = (hack == null ? void 0 : hack.submissionDeadline) ? new Date(hack.submissionDeadline).getTime() : (hack == null ? void 0 : hack.endDate) ? new Date(hack.endDate).getTime() : null;
    if (!regDeadline && !subDeadline) {
      setTimeLeft("");
      return;
    }
    const updateTimer = () => {
      const now = Date.now();
      let diff = 0;
      let label = "";
      if (regDeadline && now < regDeadline) {
        diff = regDeadline - now;
        label = "Registration Deadline";
      } else if (subDeadline && now < subDeadline) {
        diff = subDeadline - now;
        label = "Submission Deadline";
      } else {
        setTimeLeft("Ended");
        setTimerLabel("Ended");
        return;
      }
      const d = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const h = Math.floor(diff / (1e3 * 60 * 60) % 24).toString().padStart(2, "0");
      const m = Math.floor(diff / 1e3 / 60 % 60).toString().padStart(2, "0");
      const s = Math.floor(diff / 1e3 % 60).toString().padStart(2, "0");
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`);
      setTimerLabel(label);
    };
    updateTimer();
    const timerId = setInterval(updateTimer, 1e3);
    return () => clearInterval(timerId);
  }, [hack]);
  const handleRegisterTeam = async () => {
    var _a2, _b2, _c2, _d2;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const trimmedTeam = String(teamName || "").trim();
    if (trimmedTeam.length < 3) {
      showMsg("Team name must be at least 3 characters.", "error");
      return;
    }
    const filledMembers = members.filter((m) => m.email.trim());
    for (const m of filledMembers) {
      if (!m.name.trim()) {
        showMsg("Please enter a name for every teammate you added.", "error");
        return;
      }
      try {
        new URL(`mailto:${m.email.trim()}`);
      } catch {
      }
    }
    setBusy(true);
    showMsg("Registering your team…", "info");
    try {
      await api.post(`/events/hackathons/${hack._id}/register`, {
        teamName: trimmedTeam,
        memberEmails: filledMembers.map((m) => m.email.trim())
      });
      await fetchMyTeam();
      showMsg("Team registered successfully! You are the team leader.", "success");
      setTeamName("");
      setMembers([{ name: "", email: "" }]);
    } catch (err) {
      const missing = (_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.missingEmails;
      if (Array.isArray(missing) && missing.length) {
        showMsg(`These emails are not registered SkillValix users: ${missing.join(", ")}`, "error");
      } else {
        showMsg(((_d2 = (_c2 = err.response) == null ? void 0 : _c2.data) == null ? void 0 : _d2.message) || "Failed to register team.", "error");
      }
    } finally {
      setBusy(false);
    }
  };
  const handlePay = async () => {
    var _a2, _b2, _c2;
    if (!registration) return;
    setBusy(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      showMsg("Payment gateway failed to load. Please try again.", "error");
      setBusy(false);
      return;
    }
    try {
      const orderRes = await api.post(`/events/hackathons/${hack._id}/razorpay-order`, { registrationId: registration._id });
      const order = orderRes.data;
      const options = {
        key: "rzp_live_Rg7fc3FV1mTmCM",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "SkillValix",
        description: order.description || `Hackathon Registration: ${(hack == null ? void 0 : hack.title) || ""}`,
        theme: { color: ((_a2 = hack == null ? void 0 : hack.styleConfig) == null ? void 0 : _a2.accentColor) || "#4F46E5" },
        handler: async (response) => {
          var _a3, _b3;
          try {
            await api.post(`/events/hackathons/${hack._id}/payment/verify`, {
              registrationId: registration._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            await fetchMyTeam();
            showMsg("Payment successful. Submission is now unlocked!", "success");
          } catch (err) {
            showMsg(((_b3 = (_a3 = err.response) == null ? void 0 : _a3.data) == null ? void 0 : _b3.message) || "Payment verification failed.", "error");
          } finally {
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        var _a3;
        showMsg(((_a3 = response == null ? void 0 : response.error) == null ? void 0 : _a3.description) || "Payment failed.", "error");
        setBusy(false);
      });
      razorpay.open();
    } catch (err) {
      showMsg(((_c2 = (_b2 = err.response) == null ? void 0 : _b2.data) == null ? void 0 : _c2.message) || "Could not initiate payment.", "error");
      setBusy(false);
    }
  };
  const isDriveLink = (url) => {
    try {
      return new URL(url).hostname.includes("drive.google.com");
    } catch {
      return false;
    }
  };
  const isPdfLink = (url) => /\.pdf(\?|#|$)/i.test(url);
  const isGitHub = (url) => {
    try {
      const h = new URL(url).hostname;
      return h === "github.com" || h.endsWith(".github.com");
    } catch {
      return false;
    }
  };
  const isNotion = (url) => {
    try {
      const h = new URL(url).hostname;
      return h.includes("notion.site") || h.includes("notion.so");
    } catch {
      return false;
    }
  };
  const handleSubmit = async () => {
    var _a2, _b2;
    if (!registration) return;
    const link = String(submissionLink || "").trim();
    if (!link) {
      showMsg("Submission link is required.", "error");
      return;
    }
    try {
      new URL(link);
    } catch {
      showMsg("Please enter a valid URL (starting with https:// or http://).", "error");
      return;
    }
    const cfg = (hack == null ? void 0 : hack.submissionConfig) || {};
    if (!cfg.acceptsAnyLink) {
      const ok = cfg.acceptsDriveLink && isDriveLink(link) || cfg.acceptsPdfLink && isPdfLink(link) || cfg.acceptsGitHubLink && isGitHub(link) || cfg.acceptsNotionLink && isNotion(link);
      if (!ok) {
        const allowed = [];
        if (cfg.acceptsGitHubLink) allowed.push("GitHub repo (github.com)");
        if (cfg.acceptsNotionLink) allowed.push("Notion page (notion.site / notion.so)");
        if (cfg.acceptsDriveLink) allowed.push("Google Drive");
        if (cfg.acceptsPdfLink) allowed.push("PDF link (.pdf)");
        showMsg(
          allowed.length ? `This link type isn't accepted. Allowed: ${allowed.join(", ")}.` : "This link type is not accepted for this hackathon.",
          "error"
        );
        return;
      }
    }
    setBusy(true);
    showMsg("Submitting your solution…", "info");
    try {
      await api.post(`/events/hackathons/${hack._id}/submit`, {
        registrationId: registration._id,
        submissionLink: link,
        note: String(note || "").trim()
      });
      await fetchMyTeam();
      showMsg("Solution submitted successfully! 🎉", "success");
      setSubmissionLink("");
      setNote("");
    } catch (err) {
      showMsg(((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to submit solution.", "error");
    } finally {
      setBusy(false);
    }
  };
  if (loadingHack) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[70vh] bg-slate-50 px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-40 rounded-xl bg-slate-200 animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-white h-72 animate-pulse" })
    ] }) });
  }
  if (!hack) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[70vh] bg-slate-50 px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-slate-900 text-xl font-bold", children: "Hackathon not found." }),
      /* @__PURE__ */ jsxs(Link, { to: "/hackathons", className: "inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Back to Hackathons"
      ] })
    ] }) });
  }
  const paymentRequired = Boolean(((_c = hack == null ? void 0 : hack.paymentConfig) == null ? void 0 : _c.enabled) && Number(((_d = hack == null ? void 0 : hack.paymentConfig) == null ? void 0 : _d.amountInr) || 0) > 0);
  const submissionInstructions = ((_e = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _e.instructions) || "";
  const linkLabel = ((_f = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _f.linkLabel) || "Submission Link";
  const linkHint = ((_g = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _g.linkHint) || "";
  const subCfg = (hack == null ? void 0 : hack.submissionConfig) || {};
  const linkPlaceholder = (() => {
    if (subCfg.linkPlaceholder && subCfg.linkPlaceholder !== "Paste your submission link here...") return subCfg.linkPlaceholder;
    if (subCfg.acceptsAnyLink) return "Paste any valid URL here…";
    const hints = [];
    if (subCfg.acceptsGitHubLink) hints.push("https://github.com/your-org/your-repo");
    if (subCfg.acceptsNotionLink) hints.push("https://your-workspace.notion.site/…");
    if (subCfg.acceptsDriveLink) hints.push("https://drive.google.com/…");
    if (subCfg.acceptsPdfLink) hints.push("https://…/report.pdf");
    return hints[0] || "Paste your submission link here…";
  })();
  const acceptedLinkBadges = (() => {
    if (subCfg.acceptsAnyLink) return [{ icon: Link2, label: "Any URL", color: "bg-indigo-50 text-indigo-700 border-indigo-200" }];
    const badges = [];
    if (subCfg.acceptsGitHubLink) badges.push({ icon: Github, label: "GitHub", color: "bg-slate-50 text-slate-700 border-slate-300" });
    if (subCfg.acceptsNotionLink) badges.push({ icon: FileText, label: "Notion", color: "bg-neutral-50 text-neutral-700 border-neutral-300" });
    if (subCfg.acceptsDriveLink) badges.push({ icon: HardDriveUpload, label: "Google Drive", color: "bg-emerald-50 text-emerald-700 border-emerald-200" });
    if (subCfg.acceptsPdfLink) badges.push({ icon: FileText, label: "PDF Link", color: "bg-rose-50 text-rose-700 border-rose-200" });
    return badges;
  })();
  const canSubmit = registration && (!((_h = registration.payment) == null ? void 0 : _h.required) || ((_i = registration.payment) == null ? void 0 : _i.status) === "paid") && isSubmissionOpen;
  const regStatusStyle = REG_STATUS_STYLE[registration == null ? void 0 : registration.status] || REG_STATUS_STYLE.registered;
  const isLeader = registration && user && String(((_j = registration.leader) == null ? void 0 : _j._id) || registration.leader) === String(user._id || user.id);
  const submissionCount = ((_k = registration == null ? void 0 : registration.submissions) == null ? void 0 : _k.length) || 0;
  const maxSubs = Number(((_l = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _l.maxSubmissionsPerTeam) || 3);
  const canonicalPath = hack.slug ? `/hackathons/${hack.slug}` : `/hackathons/${hack._id}`;
  const canonicalUrl = `https://www.skillvalix.com${canonicalPath}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        hack.title,
        " | Hackathon | SkillValix"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: hack.tagline || ((_m = hack.description) == null ? void 0 : _m.slice(0, 155)) || "Join this hackathon on SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: `${hack.title} | SkillValix Hackathon` }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: hack.tagline || ((_n = hack.description) == null ? void 0 : _n.slice(0, 155)) || "" }),
      hack.image && /* @__PURE__ */ jsx("meta", { property: "og:image", content: hack.image }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "event" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: `${hack.title} | SkillValix Hackathon` }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: hack.tagline || ((_o = hack.description) == null ? void 0 : _o.slice(0, 155)) || "" }),
      hack.image && /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: hack.image }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": hack.title,
        "description": hack.tagline || ((_p = hack.description) == null ? void 0 : _p.slice(0, 155)) || "Participate in this Hackathon on SkillValix.",
        "startDate": hack.startDate || hack.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        "endDate": hack.endDate || hack.submissionDeadline || hack.registrationDeadline || new Date(Date.now() + 864e5 * 30).toISOString(),
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": { "@type": "VirtualLocation", "url": canonicalUrl },
        "image": hack.image ? [hack.image] : [],
        "organizer": { "@type": "Organization", "name": "SkillValix", "url": "https://www.skillvalix.com" },
        "performer": { "@type": "Organization", "name": "SkillValix" },
        "offers": {
          "@type": "Offer",
          "price": ((_q = hack == null ? void 0 : hack.paymentConfig) == null ? void 0 : _q.amountInr) ? String(hack.paymentConfig.amountInr) : "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        }
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 px-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-20",
          style: { backgroundImage: "radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)" },
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/hackathons", className: "inline-flex items-center gap-2 text-indigo-200 hover:text-white text-sm font-semibold mb-6 transition-colors", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
          " Back to Hackathons"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 text-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 mb-4", children: [
              /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`, children: [
                /* @__PURE__ */ jsx(StatusIcon, { className: "w-3.5 h-3.5" }),
                statusStyle.label
              ] }),
              hack.featured && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold", children: [
                /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-current" }),
                " Featured"
              ] })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-black leading-tight", children: hack.title }),
            hack.tagline && /* @__PURE__ */ jsx("p", { className: "text-indigo-200 mt-2 font-semibold", children: hack.tagline }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-200 mt-4 leading-relaxed", children: hack.description }),
            ((_r = hack.tags) == null ? void 0 : _r.length) > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-5", children: hack.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold", children: tag }, tag)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-widest font-black text-slate-700 mb-4", children: "Event Snapshot" }),
            ((hack == null ? void 0 : hack.registrationDeadline) || (hack == null ? void 0 : hack.submissionDeadline) || (hack == null ? void 0 : hack.endDate)) && /* @__PURE__ */ jsx(Fragment, { children: timeLeft === "Ended" || hack.status === "ended" ? /* @__PURE__ */ jsx("div", { className: "mb-5 rounded-xl bg-slate-100 border border-slate-200 p-3 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-500 uppercase tracking-widest", children: "Ended" }) }) : /* @__PURE__ */ jsxs("div", { className: "mb-5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-3 text-center", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs uppercase tracking-widest font-black text-indigo-500 mb-1 flex items-center justify-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Clock3, { className: "w-3.5 h-3.5" }),
                " ",
                timerLabel
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-indigo-600 font-mono tracking-tight tabular-nums", children: timeLeft })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Team Size" }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                  teamMin,
                  " – ",
                  teamMax,
                  " members"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Entry" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: paymentRequired ? `₹${hack.paymentConfig.amountInr}` : "Free" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Submission Limit" }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                  maxSubs,
                  " per team"
                ] })
              ] }),
              ((_s = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _s.acceptsAnyLink) ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Link Type" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: "Any URL" })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                ((_t = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _t.acceptsGitHubLink) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "GitHub Repo" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: "✓ Allowed" })
                ] }),
                ((_u = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _u.acceptsNotionLink) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Notion URL" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: "✓ Allowed" })
                ] }),
                ((_v = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _v.acceptsDriveLink) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Google Drive" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: "✓ Allowed" })
                ] }),
                ((_w = hack == null ? void 0 : hack.submissionConfig) == null ? void 0 : _w.acceptsPdfLink) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "PDF Link" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: "✓ Allowed" })
                ] })
              ] }),
              (hack == null ? void 0 : hack.registrationDeadline) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Reg. Closes" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: new Date(hack.registrationDeadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) })
              ] }),
              ((hack == null ? void 0 : hack.submissionDeadline) || (hack == null ? void 0 : hack.endDate)) && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Sub. Closes" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: new Date(hack.submissionDeadline || hack.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 border-t border-slate-100 pt-5 space-y-3", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://chat.whatsapp.com/IejES4kDNfx1RgMWLPeA6P",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-emerald-500/25",
                  children: [
                    /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
                    " Join WhatsApp Community"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://www.linkedin.com/company/skillvalix/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-[#0A66C2]/25",
                  children: [
                    /* @__PURE__ */ jsx(Linkedin, { className: "w-4 h-4" }),
                    " Follow for Updates & Opportunities"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    ((_x = hack.winnerConfig) == null ? void 0 : _x.announced) && ((_y = winners == null ? void 0 : winners.winners) == null ? void 0 : _y.length) > 0 && /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-5", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-black text-amber-900 flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Trophy, { className: "w-7 h-7" }),
          " Winners Announced!"
        ] }),
        winners.note && /* @__PURE__ */ jsx("p", { className: "text-amber-800 mt-1 font-medium", children: winners.note })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: winners.winners.map((w) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border-2 border-amber-300 p-5 text-center shadow-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-black uppercase tracking-widest text-amber-500 mb-1", children: w.winnerRank || "Winner" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-slate-900", children: w.teamName }),
        w.winnerNote && /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: w.winnerNote }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: (w.members || []).map((m) => m.name || m.email).join(", ") })
      ] }, w._id)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-slate-50 px-6 py-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        problemStatement && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-slate-900 mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-indigo-600" }),
            " Problem Statement"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-700 leading-relaxed whitespace-pre-line", children: problemStatement })
        ] }),
        (prizes.length > 0 || faqs.length > 0) && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-black text-slate-900 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 text-amber-500" }),
            " Prizes & FAQs"
          ] }),
          prizes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest font-black text-slate-500 mb-3", children: "Prize Pool" }),
            /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: prizes.map((prize, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-amber-700", children: prize.rank || `Prize ${idx + 1}` }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-black text-amber-900 mt-1", children: prize.amount || "-" })
            ] }, `${prize.rank}-${idx}`)) })
          ] }),
          faqs.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest font-black text-slate-500 mb-3", children: "FAQs" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: faqs.map((faq, idx) => /* @__PURE__ */ jsxs("details", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 group", children: [
              /* @__PURE__ */ jsxs("summary", { className: "text-sm font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between", children: [
                faq.question,
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 group-open:rotate-45 transition-transform text-lg", children: "+" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mt-2", children: faq.answer })
            ] }, `${faq.question}-${idx}`)) })
          ] })
        ] }),
        submissionInstructions && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-slate-900 mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-indigo-600" }),
            " Submission Instructions"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-600 leading-relaxed whitespace-pre-line", children: submissionInstructions })
        ] }),
        rules.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-slate-900 mb-3", children: "Rules" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-slate-700 list-none", children: rules.map((rule, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-indigo-500 mt-0.5 shrink-0" }),
            rule
          ] }, idx)) })
        ] }),
        judgingCriteria.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-slate-900 mb-3", children: "Judging Criteria" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-slate-700 list-none", children: judgingCriteria.map((item, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-amber-400 mt-0.5 shrink-0" }),
            item
          ] }, idx)) })
        ] }),
        timeline.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-slate-900 mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Clock3, { className: "w-5 h-5 text-indigo-600" }),
            " Timeline"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative pl-4 border-l-2 border-indigo-200 space-y-4", children: timeline.map((entry, idx) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -left-5 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900", children: entry.label || `Milestone ${idx + 1}` }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-0.5", children: entry.date ? new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date TBA" }),
            entry.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mt-1", children: entry.description })
          ] }, `${entry.label}-${idx}`)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-5", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 sticky top-24", children: [
        loadingReg ? /* @__PURE__ */ jsx("div", { className: "h-24 rounded-xl bg-slate-100 animate-pulse" }) : registration ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-slate-900", children: "Your Registration" }),
            /* @__PURE__ */ jsx("span", { className: `text-xs px-2.5 py-1 rounded-full font-bold ${regStatusStyle.bg} ${regStatusStyle.text}`, children: regStatusStyle.label })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide font-bold text-slate-500 mb-2", children: "Team" }),
            /* @__PURE__ */ jsx("p", { className: "font-black text-slate-900 text-base", children: registration.teamName }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600 mt-1 font-medium", children: isLeader ? "👑 You are the team leader" : "You are a member" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-1", children: (registration.members || []).map((m, idx) => {
              var _a2;
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: m.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
                  "(",
                  m.email,
                  ")"
                ] }),
                String(((_a2 = m.user) == null ? void 0 : _a2._id) || m.user) === String((user == null ? void 0 : user._id) || (user == null ? void 0 : user.id)) && /* @__PURE__ */ jsx("span", { className: "text-indigo-600 font-bold", children: "(you)" })
              ] }, idx);
            }) })
          ] }),
          ((_z = registration.payment) == null ? void 0 : _z.required) && ((_A = registration.payment) == null ? void 0 : _A.status) !== "paid" && /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-amber-700 uppercase tracking-wide", children: "Payment Required" }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-black text-amber-900 mt-1", children: [
              "₹",
              registration.payment.amountInr
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700 mt-1", children: "Complete payment to unlock submission access." }),
            isLeader && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handlePay,
                disabled: busy,
                className: "mt-3 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold disabled:opacity-60 transition-colors",
                children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                  busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }),
                  "Pay ₹",
                  registration.payment.amountInr
                ] })
              }
            ),
            !isLeader && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-amber-700", children: "Your team leader needs to complete payment." })
          ] }),
          (registration.submissions || []).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-xs uppercase tracking-wide font-bold text-slate-500 mb-2", children: [
              "Submissions (",
              submissionCount,
              "/",
              maxSubs,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: registration.submissions.map((sub, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Link2, { className: "w-3.5 h-3.5 text-indigo-400 shrink-0" }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: sub.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-xs text-indigo-600 underline truncate flex-1",
                    children: sub.link
                  }
                ),
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-slate-400 shrink-0" })
              ] }),
              sub.note && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1 pl-5", children: sub.note }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 mt-0.5 pl-5", children: new Date(sub.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) })
            ] }, idx)) })
          ] }),
          canSubmit && submissionCount < maxSubs && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            acceptedLinkBadges.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-500 mb-1.5", children: "Accepted link types" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: acceptedLinkBadges.map(({ icon: Icon, label, color }) => /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${color}`,
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }),
                    label
                  ]
                },
                label
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-600 mb-1", children: linkLabel }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "url",
                  value: submissionLink,
                  onChange: (e) => setSubmissionLink(e.target.value),
                  className: "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none",
                  placeholder: linkPlaceholder
                }
              ),
              linkHint && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: linkHint })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-600 mb-1", children: "Note (optional)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  rows: 2,
                  className: "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none resize-none",
                  placeholder: "Any notes for the judges…"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSubmit,
                disabled: busy || !submissionLink.trim(),
                className: "w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-60 transition-colors",
                children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                  busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }),
                  "Submit Solution",
                  submissionCount > 0 && ` (${submissionCount + 1}/${maxSubs})`
                ] })
              }
            )
          ] }),
          canSubmit && submissionCount >= maxSubs && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-center", children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-6 h-6 mx-auto mb-2 text-slate-400" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: "Submission Locked" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
              "Max ",
              maxSubs,
              " submission",
              maxSubs !== 1 ? "s" : "",
              " reached. No further submissions allowed."
            ] })
          ] }),
          !isSubmissionOpen && /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 mt-0.5 text-slate-500" }),
            "Submissions are now closed for this hackathon."
          ] })
        ] }) : (
          /* Registration form */
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-slate-900 mb-1", children: "Join this Hackathon" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mb-5", children: [
              "You are the team leader. Add teammates by their SkillValix email addresses. Team size: ",
              teamMin,
              "–",
              teamMax,
              " members (including yourself)."
            ] }),
            !isRegistrationOpen ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-500 text-sm", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8 mx-auto mb-2 text-slate-400" }),
              "Registrations are closed for this hackathon."
            ] }) : !isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-4", children: "You need to be logged in to register." }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/login",
                  className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors",
                  children: "Login to Register"
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-600 mb-1", children: "Team Name *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: teamName,
                    onChange: (e) => setTeamName(e.target.value),
                    className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none",
                    placeholder: "e.g. Team Phoenix"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-600", children: "Teammates" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-400", children: [
                    members.filter((m) => m.email.trim()).length + 1,
                    "/",
                    teamMax,
                    " members"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: members.map((member, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-slate-500", children: [
                      "Teammate ",
                      idx + 1
                    ] }),
                    members.length > 0 && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeMemberRow(idx),
                        className: "p-1 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors",
                        children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: member.name,
                      onChange: (e) => updateMember(idx, "name", e.target.value),
                      className: "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none",
                      placeholder: "Full name"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: member.email,
                      onChange: (e) => updateMember(idx, "email", e.target.value),
                      className: "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none",
                      placeholder: "Email (must be registered SkillValix account)"
                    }
                  )
                ] }, idx)) }),
                members.length < teamMax - 1 && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addMemberRow,
                    className: "mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                      " Add Another Teammate"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: "Leave empty for solo. All teammates must be registered SkillValix users." })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleRegisterTeam,
                  disabled: busy || !teamName.trim(),
                  className: "w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold disabled:opacity-60 transition-all shadow-lg shadow-indigo-500/25",
                  children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                    busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
                    "Register Team"
                  ] })
                }
              )
            ] })
          ] })
        ),
        msg.text && /* @__PURE__ */ jsx("div", { className: `mt-4 text-xs rounded-lg border px-3 py-2.5 ${msg.tone === "error" ? "bg-red-50 text-red-700 border-red-200" : msg.tone === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"}`, children: msg.text }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-semibold text-slate-800 mb-1 inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-indigo-500" }),
            " Security Guarantees"
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-0.5 mt-1", children: [
            /* @__PURE__ */ jsx("li", { children: "• Team members must be registered SkillValix users" }),
            /* @__PURE__ */ jsx("li", { children: "• Duplicate registration per hackathon is blocked" }),
            /* @__PURE__ */ jsx("li", { children: "• Payment verified cryptographically before unlock" }),
            /* @__PURE__ */ jsx("li", { children: "• Submission limit enforced server-side" })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  HackathonDetail as default
};
