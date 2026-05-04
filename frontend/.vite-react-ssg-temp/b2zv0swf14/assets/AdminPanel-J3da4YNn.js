import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { u as useAuthStore, g as getCourseList, d as api } from "../main.mjs";
import { ShieldCheck, Lock, BarChart3, ClipboardList, Award, Users, Tag, Mail, BookOpen, Loader2, RefreshCw, Activity, AlertCircle, Database, Eye, Search, Send, ChevronDown, Plus, CheckCircle, Upload, X, ExternalLink, FileJson, Edit3, Percent, ToggleRight, ToggleLeft, Trash2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import "react-dom/client";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const QUIZ_TEMPLATE = {
  passingScore: 60,
  ribbonTheme: "blue",
  questions: [
    {
      questionText: "Your question here?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOptionIndex: 0
    }
  ]
};
const AdminPanel = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da;
  const { user, isAuthenticated } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [quizJson, setQuizJson] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  const [tab, setTab] = useState("analytics");
  const [hacks, setHacks] = useState([]);
  const [hacksLoading, setHacksLoading] = useState(false);
  const [hackForm, setHackForm] = useState({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    theme: "",
    status: "upcoming",
    image: "",
    tags: "",
    visible: false,
    featured: false,
    startDate: "",
    endDate: "",
    teamMin: 1,
    teamMax: 4,
    paymentEnabled: false,
    paymentAmountInr: 0,
    paymentDescription: "Hackathon registration fee",
    acceptsDriveLink: true,
    acceptsPdfLink: true,
    acceptsAnyLink: false,
    acceptsGitHubLink: true,
    acceptsNotionLink: true,
    submissionInstructions: "",
    maxSubmissionsPerTeam: 3,
    linkLabel: "Submission Link",
    linkPlaceholder: "Paste your submission link here...",
    linkHint: "",
    rules: "",
    judgingCriteria: "",
    prizes: "",
    faqs: "",
    accentColor: "#4F46E5"
  });
  const [editingHackId, setEditingHackId] = useState("");
  const [hackSaving, setHackSaving] = useState(false);
  const [hackMsg, setHackMsg] = useState("");
  const [registrationsByHack, setRegistrationsByHack] = useState({});
  const [loadingRegistrationsFor, setLoadingRegistrationsFor] = useState("");
  const [hostRequests, setHostRequests] = useState([]);
  const [hostRequestsLoading, setHostRequestsLoading] = useState(false);
  const [showHackForm, setShowHackForm] = useState(false);
  const [warmJob, setWarmJob] = useState(null);
  const [warmJobLoading, setWarmJobLoading] = useState(false);
  const [warmJobError, setWarmJobError] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxUsageLimit: "",
    validFrom: "",
    validUntil: "",
    description: ""
  });
  const [deletingCouponId, setDeletingCouponId] = useState("");
  const [submissionsViewHackId, setSubmissionsViewHackId] = useState("");
  const [submissionsData, setSubmissionsData] = useState(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsStatusFilter, setSubmissionsStatusFilter] = useState("");
  const [winnerModal, setWinnerModal] = useState(null);
  const [winnerRank, setWinnerRank] = useState("");
  const [winnerNote, setWinnerNote] = useState("");
  const [winnerSaving, setWinnerSaving] = useState(false);
  const [winnerConfigHackId, setWinnerConfigHackId] = useState("");
  const [winnerConfigNote, setWinnerConfigNote] = useState("");
  const [winnerConfigSaving, setWinnerConfigSaving] = useState(false);
  const [emailUsers, setEmailUsers] = useState([]);
  const [emailUsersLoading, setEmailUsersLoading] = useState(false);
  const [emailSearch, setEmailSearch] = useState("");
  const [selectedEmails, setSelectedEmails] = useState(/* @__PURE__ */ new Set());
  const [emailForm, setEmailForm] = useState({ subject: "", html: "" });
  const [emailSending, setEmailSending] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: "", text: "" });
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  useEffect(() => {
    getCourseList().then(setCourses).catch(console.error);
  }, []);
  const loadHacks = async () => {
    setHacksLoading(true);
    try {
      const r = await api.get("/events/admin/hackathons");
      setHacks(r.data);
    } catch {
      setHacks([]);
    } finally {
      setHacksLoading(false);
    }
  };
  const loadRegistrations = async (hackId) => {
    setLoadingRegistrationsFor(hackId);
    try {
      const r = await api.get(`/events/admin/hackathons/${hackId}/registrations`);
      setRegistrationsByHack((prev) => ({ ...prev, [hackId]: r.data || [] }));
    } catch {
      setRegistrationsByHack((prev) => ({ ...prev, [hackId]: [] }));
    } finally {
      setLoadingRegistrationsFor("");
    }
  };
  const handleExportAllUsers = async () => {
    try {
      const response = await api.get("/admin/users/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "skillvalix-users.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert("Failed to export users.");
    }
  };
  const handleExportHackathonUsers = async (hackId) => {
    try {
      const response = await api.get(`/events/admin/hackathons/${hackId}/registrations/export`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hackathon-${hackId}-registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert("Failed to export hackathon registrations.");
    }
  };
  const loadHostRequests = async () => {
    setHostRequestsLoading(true);
    try {
      const r = await api.get("/host/admin/all");
      setHostRequests(r.data);
    } catch {
      setHostRequests([]);
    } finally {
      setHostRequestsLoading(false);
    }
  };
  const updateHostRequestStatus = async (id, status) => {
    try {
      await api.put(`/host/admin/${id}/status`, { status });
      loadHostRequests();
    } catch (e) {
      alert("Failed to update status");
    }
  };
  const resetHackForm = () => {
    setHackForm({
      title: "",
      slug: "",
      tagline: "",
      description: "",
      theme: "",
      status: "upcoming",
      image: "",
      tags: "",
      visible: false,
      featured: false,
      startDate: "",
      endDate: "",
      registrationDeadline: "",
      submissionDeadline: "",
      problemStatement: "",
      teamMin: 1,
      teamMax: 4,
      paymentEnabled: false,
      paymentAmountInr: 0,
      paymentDescription: "Hackathon registration fee",
      acceptsDriveLink: true,
      acceptsPdfLink: true,
      acceptsAnyLink: false,
      acceptsGitHubLink: true,
      acceptsNotionLink: true,
      submissionInstructions: "",
      maxSubmissionsPerTeam: 3,
      linkLabel: "Submission Link",
      linkPlaceholder: "Paste your submission link here...",
      linkHint: "",
      rules: "",
      judgingCriteria: "",
      prizes: "",
      faqs: "",
      accentColor: "#4F46E5"
    });
    setEditingHackId("");
  };
  const loadCoupons = async () => {
    setCouponsLoading(true);
    try {
      const r = await api.get("/coupons/admin");
      setCoupons(r.data || []);
    } catch {
      setCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  };
  const handleCreateCoupon = async (e) => {
    var _a2, _b2;
    e.preventDefault();
    setCouponSaving(true);
    setCouponMsg({ type: "", text: "" });
    try {
      const payload = {
        code: couponForm.code.trim().toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        maxUsageLimit: couponForm.maxUsageLimit ? Number(couponForm.maxUsageLimit) : null,
        validFrom: couponForm.validFrom || null,
        validUntil: couponForm.validUntil || null,
        description: couponForm.description
      };
      await api.post("/coupons/admin", payload);
      setCouponMsg({ type: "success", text: `Coupon "${payload.code}" created successfully!` });
      setCouponForm({ code: "", discountType: "percentage", discountValue: "", maxUsageLimit: "", validFrom: "", validUntil: "", description: "" });
      loadCoupons();
    } catch (err) {
      setCouponMsg({ type: "error", text: ((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to create coupon." });
    } finally {
      setCouponSaving(false);
    }
  };
  const handleToggleCoupon = async (id) => {
    var _a2, _b2;
    try {
      await api.patch(`/coupons/admin/${id}/toggle`);
      loadCoupons();
    } catch (err) {
      setCouponMsg({ type: "error", text: ((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to toggle coupon." });
    }
  };
  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Permanently delete coupon "${code}"? This cannot be undone.`)) return;
    setDeletingCouponId(id);
    try {
      await api.delete(`/coupons/admin/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      setCouponMsg({ type: "success", text: `Coupon "${code}" deleted.` });
    } catch {
      setCouponMsg({ type: "error", text: "Failed to delete coupon." });
    } finally {
      setDeletingCouponId("");
    }
  };
  const loadEmailUsers = async (search = "") => {
    setEmailUsersLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search) params.set("search", search);
      const res = await api.get(`/admin/users?${params.toString()}`);
      setEmailUsers(res.data);
    } catch {
      setEmailMsg({ type: "error", text: "Failed to load users." });
    } finally {
      setEmailUsersLoading(false);
    }
  };
  const handleSendEmail = async (e) => {
    var _a2, _b2;
    e.preventDefault();
    if (selectedEmails.size === 0 && !selectAllUsers) {
      setEmailMsg({ type: "error", text: 'Please select at least one user or choose "Select All".' });
      return;
    }
    setEmailSending(true);
    setEmailMsg({ type: "", text: "" });
    try {
      const payload = {
        subject: emailForm.subject,
        html: emailForm.html,
        target: selectAllUsers ? "all" : "selected",
        userIds: Array.from(selectedEmails)
      };
      const res = await api.post("/admin/send-email", payload);
      setEmailMsg({ type: "success", text: res.data.message || "Emails queued successfully." });
      setEmailForm({ subject: "", html: "" });
      setSelectedEmails(/* @__PURE__ */ new Set());
      setSelectAllUsers(false);
    } catch (err) {
      setEmailMsg({ type: "error", text: ((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to send emails." });
    } finally {
      setEmailSending(false);
    }
  };
  const toggleEmailSelection = (userId) => {
    const newSet = new Set(selectedEmails);
    if (newSet.has(userId)) newSet.delete(userId);
    else newSet.add(userId);
    setSelectedEmails(newSet);
  };
  useEffect(() => {
    if (tab === "hackathons") loadHacks();
    if (tab === "host-requests") loadHostRequests();
    if (tab === "coupons") loadCoupons();
    if (tab === "email") {
      setEmailMsg({ type: "", text: "" });
      setEmailSearch("");
      setSelectedEmails(/* @__PURE__ */ new Set());
      setSelectAllUsers(false);
      loadEmailUsers("");
    }
  }, [tab]);
  useEffect(() => {
    if (tab !== "email") return;
    const debounceTimer = setTimeout(() => {
      loadEmailUsers(emailSearch);
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [emailSearch]);
  useEffect(() => {
    if (!isAuthenticated || (user == null ? void 0 : user.role) !== "admin") return;
    const loadAnalytics = async () => {
      var _a2, _b2;
      setAnalyticsLoading(true);
      setAnalyticsError("");
      try {
        const res = await api.get("/admin/analytics");
        setAnalytics(res.data);
      } catch (err) {
        setAnalyticsError(((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to load admin analytics.");
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
  }, [isAuthenticated, user == null ? void 0 : user.role]);
  useEffect(() => {
    if (!isAuthenticated || (user == null ? void 0 : user.role) !== "admin") return;
    let stopped = false;
    let timer = null;
    const loadWarmStatus = async () => {
      var _a2, _b2;
      try {
        const res = await api.get("/events/admin/certificates/warm-event-pdfs/status");
        if (!stopped) {
          const status = res.data || null;
          setWarmJob(status);
          if (!(status == null ? void 0 : status.running) && ((status == null ? void 0 : status.totalInDb) ?? 0) === 0) {
            setWarmJobError("No event/job certificates exist yet. Generate at least one event certificate, then run fix again.");
          } else {
            setWarmJobError("");
          }
          if (status == null ? void 0 : status.running) {
            timer = setTimeout(loadWarmStatus, 4e3);
          }
        }
      } catch (err) {
        if (!stopped) {
          setWarmJobError(((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to load warm job status.");
        }
      }
    };
    loadWarmStatus();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, user == null ? void 0 : user.role]);
  if (!isAuthenticated || (user == null ? void 0 : user.role) !== "admin") {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  const validateJson = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.questions)) return 'Missing "questions" array';
      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        if (!q.questionText) return `Question ${i + 1}: missing "questionText"`;
        if (!Array.isArray(q.options) || q.options.length < 2) return `Question ${i + 1}: needs at least 2 options`;
        if (typeof q.correctOptionIndex !== "number") return `Question ${i + 1}: missing "correctOptionIndex"`;
        if (q.correctOptionIndex >= q.options.length) return `Question ${i + 1}: correctOptionIndex out of range`;
      }
      return null;
    } catch (e) {
      return "Invalid JSON: " + e.message;
    }
  };
  const handleLoadExisting = async () => {
    var _a2;
    if (!selectedCourseId) return;
    setLoadingExisting(true);
    try {
      const res = await api.get(`/quizzes/${selectedCourseId}`);
      const { passingScore, questions, ribbonTheme } = res.data;
      setQuizJson(JSON.stringify({ passingScore, ribbonTheme: ribbonTheme || "blue", questions }, null, 2));
      setJsonError("");
    } catch (err) {
      setJsonError(((_a2 = err.response) == null ? void 0 : _a2.status) === 404 ? "No quiz found for this course yet." : "Failed to load quiz.");
    } finally {
      setLoadingExisting(false);
    }
  };
  const handleJsonChange = (val) => {
    setQuizJson(val);
    setUploadStatus(null);
    if (val.trim()) {
      const err = validateJson(val);
      setJsonError(err || "");
    } else {
      setJsonError("");
    }
  };
  const handleUpload = async () => {
    var _a2, _b2;
    if (!selectedCourseId) {
      setJsonError("Please select a course first.");
      return;
    }
    const err = validateJson(quizJson);
    if (err) {
      setJsonError(err);
      return;
    }
    setUploadStatus("loading");
    setUploadMessage("");
    try {
      const parsed = JSON.parse(quizJson);
      await api.post(`/quizzes/${selectedCourseId}`, parsed);
      setUploadStatus("success");
      setUploadMessage(`Quiz saved to MongoDB for "${selectedCourseTitle}" successfully.`);
    } catch (err2) {
      setUploadStatus("error");
      setUploadMessage(((_b2 = (_a2 = err2.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Upload failed. Is the backend running?");
    }
  };
  const handleLoadTemplate = () => {
    setQuizJson(JSON.stringify(QUIZ_TEMPLATE, null, 2));
    setJsonError("");
    setUploadStatus(null);
  };
  const questionCount = (() => {
    var _a2;
    try {
      return ((_a2 = JSON.parse(quizJson).questions) == null ? void 0 : _a2.length) || 0;
    } catch {
      return 0;
    }
  })();
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };
  const startWarmCertificates = async () => {
    var _a2, _b2, _c2, _d2;
    if (warmJobLoading) return;
    setWarmJobLoading(true);
    setWarmJobError("");
    try {
      const res = await api.post("/events/admin/certificates/warm-event-pdfs", { forceAll: true });
      setWarmJob(((_a2 = res.data) == null ? void 0 : _a2.job) || null);
    } catch (err) {
      const statusCode = (_b2 = err.response) == null ? void 0 : _b2.status;
      if (statusCode === 409) {
        setWarmJobError("Warm job is already running. Showing live status below.");
      } else {
        setWarmJobError(((_d2 = (_c2 = err.response) == null ? void 0 : _c2.data) == null ? void 0 : _d2.message) || "Failed to start warm job.");
      }
    } finally {
      try {
        const statusRes = await api.get("/events/admin/certificates/warm-event-pdfs/status");
        const status = statusRes.data || null;
        setWarmJob(status);
        if (!(status == null ? void 0 : status.running) && ((status == null ? void 0 : status.totalInDb) ?? 0) === 0) {
          setWarmJobError("No event/job certificates exist yet. Generate at least one event certificate, then run fix again.");
        }
      } catch {
      }
      setWarmJobLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("title", { children: "Admin Panel | SkillValix" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shadow-lg", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-7 h-7 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-white", children: "Admin Panel" }),
            /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-sm mt-0.5", children: "Protected admin workspace for analytics, quiz operations, and course guidance." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleExportAllUsers,
            className: "px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 border border-emerald-400 whitespace-nowrap",
            children: "Export All Users (CSV)"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-sm text-indigo-50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-yellow-300 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Security notice" }),
          /* @__PURE__ */ jsx("p", { className: "text-indigo-100/90 mt-1", children: "Admin access is controlled only by the role stored in the database. This website does not include any option to create admins, assign admins, or promote users." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-8", children: [
        { key: "analytics", label: "Analytics", icon: BarChart3 },
        { key: "quiz", label: "Quiz Manager", icon: ClipboardList },
        { key: "hackathons", label: "Hackathons", icon: Award },
        { key: "host-requests", label: "Host Requests", icon: Users },
        { key: "coupons", label: "Coupons", icon: Tag },
        { key: "email", label: "Email Campaign", icon: Mail },
        { key: "guide", label: "Course Guide", icon: BookOpen }
      ].map(({ key, label, icon: Icon }) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setTab(key),
          className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === key ? "bg-white text-indigo-700 shadow-lg" : "bg-white/15 text-white hover:bg-white/25 border border-white/20"}`,
          children: [
            React.createElement(Icon, { className: "w-4 h-4" }),
            label
          ]
        },
        key
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8", children: [
      tab === "analytics" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-6 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-xl font-black text-slate-900 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-indigo-600" }),
                "Certificate Maintenance (Admin Only)"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mt-2", children: "One-click fix for stale event/job certificate PDFs." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-[240px]", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: startWarmCertificates,
                  disabled: warmJobLoading || (warmJob == null ? void 0 : warmJob.running),
                  className: "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold shadow",
                  children: [
                    warmJobLoading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
                    (warmJob == null ? void 0 : warmJob.running) ? "Fix Running..." : "Fix Certificates Now"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Status" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: (warmJob == null ? void 0 : warmJob.running) ? "Running" : "Idle" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Progress" }),
                  /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-900 mt-0.5", children: [
                    (warmJob == null ? void 0 : warmJob.processed) ?? 0,
                    "/",
                    (warmJob == null ? void 0 : warmJob.total) ?? 0
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-emerald-50 px-2.5 py-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Success" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-emerald-700 mt-0.5", children: (warmJob == null ? void 0 : warmJob.success) ?? 0 })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-rose-50 px-2.5 py-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Failed" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-rose-700 mt-0.5", children: (warmJob == null ? void 0 : warmJob.failed) ?? 0 })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2 text-[11px]", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Mode" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: (warmJob == null ? void 0 : warmJob.mode) || "stale-only" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "In DB" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 mt-0.5", children: (warmJob == null ? void 0 : warmJob.totalInDb) ?? 0 })
                ] })
              ] })
            ] })
          ] }),
          (warmJob == null ? void 0 : warmJob.currentCertificateId) && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-slate-600", children: [
            "Current certificate: ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: warmJob.currentCertificateId })
          ] }),
          (warmJob == null ? void 0 : warmJob.lastError) && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-rose-700", children: [
            "Last error: ",
            warmJob.lastError
          ] }),
          warmJobError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-700", children: warmJobError })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", children: [
          { label: "Total Users", value: ((_a = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _a.totalUsers) ?? "-", icon: Users, tone: "from-indigo-600 to-blue-600" },
          { label: "Published Courses", value: ((_b = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _b.publishedCourses) ?? "-", icon: BookOpen, tone: "from-emerald-600 to-teal-600" },
          { label: "Certificates", value: ((_c = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _c.totalCertificates) ?? "-", icon: Award, tone: "from-amber-500 to-orange-500" },
          { label: "Quiz Coverage", value: (analytics == null ? void 0 : analytics.overview) ? `${analytics.overview.quizCoverage}%` : "-", icon: Activity, tone: "from-violet-600 to-fuchsia-600" }
        ].map(({ label, value, icon: Icon, tone }) => /* @__PURE__ */ jsxs("div", { className: `rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-lg`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.15em] font-bold text-white/70", children: label }),
            React.createElement(Icon, { className: "w-5 h-5 text-white/90" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-4xl font-black leading-none", children: analyticsLoading ? /* @__PURE__ */ jsx("span", { className: "inline-block h-10 w-20 rounded-lg bg-white/20 animate-pulse" }) : value })
        ] }, label)) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 mb-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5 text-indigo-600" }),
                  "Admin Dashboard Overview"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Live platform analytics available only to authenticated admins." })
              ] }),
              (analytics == null ? void 0 : analytics.generatedAt) && /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-slate-400", children: [
                "Updated ",
                formatDate(analytics.generatedAt)
              ] })
            ] }),
            analyticsError && /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: analyticsError })
            ] }),
            !analyticsLoading && !analyticsError && !analytics && /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: "Analytics data is not available yet. Refresh this page after the backend update is live." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Users" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Students" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_d = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _d.totalStudents) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Admins" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_e = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _e.totalAdmins) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Certified users" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_f = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _f.uniqueCertifiedUsers) ?? "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleExportAllUsers,
                    className: "mt-4 w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition",
                    children: "Export All Users (CSV)"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Assessment" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Total quizzes" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_g = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _g.totalQuizzes) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Attempts used" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_h = analytics == null ? void 0 : analytics.engagement) == null ? void 0 : _h.totalAttemptsUsed) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Attempts unlocked" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_i = analytics == null ? void 0 : analytics.engagement) == null ? void 0 : _i.totalAttemptsUnlocked) ?? "-" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Completion" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Courses with certificates" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                      ((_j = analytics == null ? void 0 : analytics.overview) == null ? void 0 : _j.courseCompletionCoverage) ?? "-",
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Avg certs per certified user" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_k = analytics == null ? void 0 : analytics.engagement) == null ? void 0 : _k.averageCertificatesPerCertifiedUser) ?? "-" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Permissions" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "View analytics" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: ((_l = analytics == null ? void 0 : analytics.permissions) == null ? void 0 : _l.canViewAnalytics) ? "Allowed" : "Blocked" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Manage quizzes" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: ((_m = analytics == null ? void 0 : analytics.permissions) == null ? void 0 : _m.canManageQuizzes) ? "Allowed" : "Blocked" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Admin assignment" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: "Database only" })
                  ] })
                ] })
              ] })
            ] }),
            (analytics == null ? void 0 : analytics.charts) && /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide", children: "User Growth" }),
                /* @__PURE__ */ jsx("div", { className: "h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: analytics.charts.userGrowth, margin: { top: 5, right: 20, bottom: 5, left: 0 }, children: [
                  /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "count", stroke: "#4f46e5", strokeWidth: 3, dot: { r: 4, strokeWidth: 2 }, activeDot: { r: 6 } }),
                  /* @__PURE__ */ jsx(CartesianGrid, { stroke: "#e2e8f0", strokeDasharray: "5 5", vertical: false }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#64748b", fontSize: 12, tickLine: false, axisLine: false, dy: 10 }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 12, tickLine: false, axisLine: false, dx: -10 }),
                  /* @__PURE__ */ jsx(Tooltip, { contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" } })
                ] }) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-slate-100", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide", children: "Certificates Issued" }),
                /* @__PURE__ */ jsx("div", { className: "h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: analytics.charts.certificateGrowth, margin: { top: 5, right: 20, bottom: 5, left: 0 }, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { stroke: "#e2e8f0", strokeDasharray: "5 5", vertical: false }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#64748b", fontSize: 12, tickLine: false, axisLine: false, dy: 10 }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#64748b", fontSize: 12, tickLine: false, axisLine: false, dx: -10 }),
                  /* @__PURE__ */ jsx(Tooltip, { contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }, cursor: { fill: "#f1f5f9" } }),
                  /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#10b981", radius: [4, 4, 0, 0], maxBarSize: 50 })
                ] }) }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-indigo-600" }),
              "Access Policy"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-3", children: [
              { icon: Database, title: "Admin role source", desc: "Admin users are recognized from the database role field only." },
              { icon: Lock, title: "No website promotion", desc: "There is no in-app button or form to make any user an admin." },
              { icon: Eye, title: "Permission visibility", desc: "This page explains what admins can access without allowing privilege changes." }
            ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0", children: React.createElement(Icon, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: desc })
              ] })
            ] }) }, title)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-4", children: "Top Course Analytics" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              analyticsLoading && Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ jsx("div", { className: "h-20 rounded-xl bg-slate-100 animate-pulse" }, idx)),
              !analyticsLoading && !((_n = analytics == null ? void 0 : analytics.courseBreakdown) == null ? void 0 : _n.length) && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500", children: "No course analytics are available yet." }),
              !analyticsLoading && ((_o = analytics == null ? void 0 : analytics.courseBreakdown) == null ? void 0 : _o.map((course, idx) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400", children: [
                    "#",
                    idx + 1
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 mt-1", children: course.title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mt-1", children: [
                    course.lessonCount,
                    " lessons | ",
                    course.hasQuiz ? "Quiz ready" : "Quiz missing"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold", children: [
                  course.certificatesEarned,
                  " certs"
                ] })
              ] }) }, course.courseId || course.slug)))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-4", children: "Certificate Queue Health" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                { label: "Ready PDFs", value: ((_p = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _p.ready) ?? "-", tone: "border-emerald-200 bg-emerald-50" },
                { label: "Pending", value: ((_q = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _q.pending) ?? "-", tone: "border-slate-200 bg-slate-50" },
                { label: "Queued", value: ((_r = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _r.queued) ?? "-", tone: "border-amber-200 bg-amber-50" },
                { label: "Generating", value: ((_s = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _s.generating) ?? "-", tone: "border-indigo-200 bg-indigo-50" },
                { label: "Failed", value: ((_t = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _t.failed) ?? "-", tone: "border-rose-200 bg-rose-50" },
                { label: "Queue Depth", value: ((_u = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _u.queueDepth) ?? "-", tone: "border-violet-200 bg-violet-50" }
              ].map(({ label, value, tone }) => /* @__PURE__ */ jsxs("div", { className: `rounded-xl border p-4 ${tone}`, children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: label }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-black text-slate-900", children: value })
              ] }, label)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "PDF Cache" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Cached PDFs" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_v = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _v.cachedPdfCount) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Coverage" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                      ((_w = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _w.cachedPdfCoverage) ?? "-",
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Avg PDF size" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_x = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _x.averagePdfKb) ? `${analytics.certificatePipeline.averagePdfKb} KB` : "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Total cached size" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: formatSize((_y = analytics == null ? void 0 : analytics.certificatePipeline) == null ? void 0 : _y.totalCachedPdfBytes) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl bg-indigo-50 border border-indigo-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-indigo-700", children: "One-Click Fix" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-indigo-900 mt-1", children: "Use the detailed Certificate Maintenance panel at the top of this page for accurate status and actions." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-4", children: "Recent Users" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                analyticsLoading && Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ jsx("div", { className: "h-16 rounded-xl bg-slate-100 animate-pulse" }, idx)),
                !analyticsLoading && !((_z = analytics == null ? void 0 : analytics.recentUsers) == null ? void 0 : _z.length) && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500", children: "No recent users were returned for analytics yet." }),
                !analyticsLoading && ((_A = analytics == null ? void 0 : analytics.recentUsers) == null ? void 0 : _A.map((entry) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 truncate", children: entry.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 truncate", children: entry.email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
                    /* @__PURE__ */ jsx("p", { className: `text-xs font-bold uppercase tracking-wide ${entry.role === "admin" ? "text-violet-700" : "text-slate-500"}`, children: entry.role }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: formatDate(entry.createdAt) })
                  ] })
                ] }, `${entry.email}-${entry.createdAt}`)))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-4", children: "Recent Certificates" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                analyticsLoading && Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ jsx("div", { className: "h-16 rounded-xl bg-slate-100 animate-pulse" }, idx)),
                !analyticsLoading && !((_B = analytics == null ? void 0 : analytics.recentCertificates) == null ? void 0 : _B.length) && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500", children: "No recent certificate records were returned for analytics yet." }),
                !analyticsLoading && ((_C = analytics == null ? void 0 : analytics.recentCertificates) == null ? void 0 : _C.map((entry) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900 truncate", children: entry.courseTitle }),
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 truncate", children: [
                        entry.studentName,
                        entry.studentEmail ? ` | ${entry.studentEmail}` : ""
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg shrink-0", children: entry.certificateId })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2", children: formatDate(entry.issueDate) })
                ] }, entry.certificateId)))
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Database, { className: "w-5 h-5 text-indigo-600" }),
              "Hosting Capacity Report"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Practical estimate for the current Vercel + MongoDB free-tier style deployment based on this codebase and content footprint." }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Content Footprint" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Course JSON" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: formatSize((_D = analytics == null ? void 0 : analytics.contentFootprint) == null ? void 0 : _D.courseJsonBytes) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Courses" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_E = analytics == null ? void 0 : analytics.contentFootprint) == null ? void 0 : _E.staticCourses) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Lessons" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_F = analytics == null ? void 0 : analytics.contentFootprint) == null ? void 0 : _F.staticLessons) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Embedded JSON quizzes" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_G = analytics == null ? void 0 : analytics.contentFootprint) == null ? void 0 : _G.staticEmbeddedQuizzes) ?? "-" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Concurrency Estimate" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Browsing visitors" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-right", children: ((_H = analytics == null ? void 0 : analytics.capacityEstimate) == null ? void 0 : _H.frontendOnlyConcurrentVisitors) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Active full-stack users" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-right", children: ((_I = analytics == null ? void 0 : analytics.capacityEstimate) == null ? void 0 : _I.fullStackActiveConcurrentUsers) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Short burst traffic" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-right", children: ((_J = analytics == null ? void 0 : analytics.capacityEstimate) == null ? void 0 : _J.shortBurstConcurrentUsers) ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Certificate jobs" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-right", children: ((_K = analytics == null ? void 0 : analytics.capacityEstimate) == null ? void 0 : _K.certificateGenerationConcurrency) ?? "-" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Platform Shape" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm text-slate-600", children: [
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: "Frontend:" }),
                    " ",
                    ((_M = (_L = analytics == null ? void 0 : analytics.infrastructure) == null ? void 0 : _L.frontend) == null ? void 0 : _M.delivery) || "-"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: "Backend:" }),
                    " ",
                    ((_O = (_N = analytics == null ? void 0 : analytics.infrastructure) == null ? void 0 : _N.backend) == null ? void 0 : _O.runtime) || "-"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: "Database:" }),
                    " ",
                    ((_Q = (_P = analytics == null ? void 0 : analytics.infrastructure) == null ? void 0 : _P.database) == null ? void 0 : _Q.provider) || "-"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-500", children: "Free Tier Estimate" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "MongoDB storage" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_R = analytics == null ? void 0 : analytics.freeTierEstimate) == null ? void 0 : _R.mongodbStorageMb) ? `${analytics.freeTierEstimate.mongodbStorageMb} MB` : "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Approx DB ops/sec" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ((_S = analytics == null ? void 0 : analytics.freeTierEstimate) == null ? void 0 : _S.mongodbApproxOpsPerSecond) ?? "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-3", children: ((_T = analytics == null ? void 0 : analytics.freeTierEstimate) == null ? void 0 : _T.mongodbLikelyFirstLimit) || "No estimate available." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-amber-700", children: "Primary Bottleneck" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-amber-900 font-medium", children: ((_U = analytics == null ? void 0 : analytics.capacityEstimate) == null ? void 0 : _U.practicalBottleneck) || "No bottleneck estimate available yet." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-indigo-700", children: "Certificate Strategy" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-rose-200 bg-white p-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: "Previous flow" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-slate-600", children: ((_V = analytics == null ? void 0 : analytics.certificateArchitecture) == null ? void 0 : _V.previousFlow) || "No previous flow summary available." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-emerald-200 bg-white p-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: "Current flow" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-slate-600", children: ((_W = analytics == null ? void 0 : analytics.certificateArchitecture) == null ? void 0 : _W.currentFlow) || "No current flow summary available." })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3", children: ((_Y = (_X = analytics == null ? void 0 : analytics.certificateArchitecture) == null ? void 0 : _X.mainWins) == null ? void 0 : _Y.length) ? analytics.certificateArchitecture.mainWins.map((item) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-indigo-200 bg-white p-4 text-sm text-slate-700", children: item }, item)) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-indigo-200 bg-white p-4 text-sm text-slate-500 md:col-span-3", children: "Improvement notes are not available yet." }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl border border-amber-200 bg-white p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-amber-700", children: "Scaling Limit" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-700", children: ((_Z = analytics == null ? void 0 : analytics.certificateArchitecture) == null ? void 0 : _Z.scalingLimit) || "No scaling-limit note available." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-4", children: "Upgrade Order" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: ((_$ = (__ = analytics == null ? void 0 : analytics.freeTierEstimate) == null ? void 0 : __.recommendationOrder) == null ? void 0 : _$.length) ? analytics.freeTierEstimate.recommendationOrder.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-wide text-slate-400", children: [
                  "Step ",
                  idx + 1
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900 mt-1", children: item })
              ] }, item)) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500", children: "Upgrade guidance is not available yet." }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-4", children: "Security Review" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-emerald-700", children: "Recently Fixed" }),
                  /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: ((_ba = (_aa = analytics == null ? void 0 : analytics.securityReview) == null ? void 0 : _aa.fixedRecently) == null ? void 0 : _ba.length) ? analytics.securityReview.fixedRecently.map((item) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900", children: item }, item)) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500", children: "No recent fixes recorded." }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-amber-700", children: "Watch List" }),
                  /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: ((_da = (_ca = analytics == null ? void 0 : analytics.securityReview) == null ? void 0 : _ca.watchList) == null ? void 0 : _da.length) ? analytics.securityReview.watchList.map((item) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900", children: item }, item)) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500", children: "No watch list items available." }) })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      tab === "email" && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-indigo-600" }),
          "Custom Email Campaign"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-6", children: "Send customized emails, announcements, or discount codes to your users." }),
        emailMsg.text && /* @__PURE__ */ jsx("div", { className: `mb-4 p-3 rounded-xl border ${emailMsg.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`, children: emailMsg.text }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "border border-slate-200 rounded-xl flex flex-col h-[500px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-slate-200 bg-slate-50", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search users by name or email...",
                    className: "flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none",
                    value: emailSearch,
                    onChange: (e) => setEmailSearch(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 select-none", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500",
                    checked: selectAllUsers,
                    onChange: (e) => {
                      setSelectAllUsers(e.target.checked);
                      if (e.target.checked) setSelectedEmails(/* @__PURE__ */ new Set());
                    }
                  }
                ),
                "Select All Users",
                emailUsers.length > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs font-normal text-slate-500", children: [
                  "(",
                  emailUsers.length,
                  " loaded)"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-2", children: [
              emailUsersLoading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-4", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-indigo-500" }) }) : emailUsers.map((u) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition ${selectedEmails.has(u._id) ? "bg-indigo-50 border border-indigo-100" : "border border-transparent"}`, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500",
                    checked: selectAllUsers || selectedEmails.has(u._id),
                    disabled: selectAllUsers,
                    onChange: () => toggleEmailSelection(u._id)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-slate-900 text-sm truncate", children: u.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 truncate", children: u.email })
                ] }),
                u.isVerified && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full", children: "Verified" })
              ] }, u._id)),
              !emailUsersLoading && emailUsers.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center p-4 text-slate-500 text-sm", children: "No users found." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSendEmail, className: "flex flex-col h-[500px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-1", children: "Subject" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  placeholder: "e.g. Special Discount Inside!",
                  className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none",
                  value: emailForm.subject,
                  onChange: (e) => setEmailForm({ ...emailForm, subject: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-1", children: "Email Body (HTML supported)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  required: true,
                  placeholder: "<h1>Hello!</h1><p>Here is your discount code...</p>",
                  className: "w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none",
                  value: emailForm.html,
                  onChange: (e) => setEmailForm({ ...emailForm, html: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: emailSending,
                className: "w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition",
                children: [
                  emailSending ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" }),
                  emailSending ? "Sending..." : "Send Email"
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      tab === "quiz" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100", children: /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold", children: "1" }),
            "Select Course"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "course-select",
                    value: selectedCourseId,
                    onChange: (e) => {
                      const opt = e.target.options[e.target.selectedIndex];
                      setSelectedCourseId(e.target.value);
                      setSelectedCourseTitle(opt.text);
                      setUploadStatus(null);
                      setJsonError("");
                    },
                    className: "w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select a course" }),
                      courses.map((c) => /* @__PURE__ */ jsx("option", { value: c._id, children: c.title }, c._id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleLoadExisting,
                  disabled: !selectedCourseId || loadingExisting,
                  className: "flex items-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition-all active:scale-95",
                  children: [
                    loadingExisting ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
                    "Load Existing Quiz"
                  ]
                }
              )
            ] }),
            selectedCourseId && /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-slate-500 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "w-3.5 h-3.5 text-indigo-400" }),
              "Selected: ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-700", children: selectedCourseTitle }),
              /* @__PURE__ */ jsxs("span", { className: "ml-1 text-slate-400", children: [
                "| Course ID: ",
                /* @__PURE__ */ jsx("code", { className: "font-mono bg-slate-100 px-1 rounded", children: selectedCourseId })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold", children: "2" }),
              "Write / Paste Quiz JSON",
              questionCount > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold", children: [
                questionCount,
                " question",
                questionCount !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleLoadTemplate,
                className: "flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Load Template"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto", children: [
              /* @__PURE__ */ jsx("div", { className: "text-slate-500 mb-2 text-xs uppercase tracking-wider font-sans font-bold", children: "Expected JSON Format" }),
              /* @__PURE__ */ jsx("pre", { className: "whitespace-pre", children: `{
  "passingScore": 60,
  "ribbonTheme": "gold",
  "questions": [
    {
      "questionText": "What does JS stand for?",
      "options": ["Java Standard", "JavaScript", "Just Script", "None"],
      "correctOptionIndex": 1
    }
  ]
}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "quiz-json-editor",
                  rows: 18,
                  value: quizJson,
                  onChange: (e) => handleJsonChange(e.target.value),
                  placeholder: '{\n  "passingScore": 60,\n  "questions": [...]\n}',
                  spellCheck: false,
                  className: `w-full font-mono text-sm bg-slate-50 border rounded-xl px-4 py-4 focus:ring-2 outline-none transition resize-y leading-relaxed ${jsonError ? "border-red-300 focus:ring-red-300 bg-red-50/30" : quizJson && !jsonError ? "border-emerald-300 focus:ring-emerald-300" : "border-slate-200 focus:ring-indigo-400"}`
                }
              ),
              quizJson && !jsonError && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                " Valid JSON"
              ] })
            ] }),
            jsonError && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: jsonError })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100", children: /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold", children: "3" }),
            "Save to MongoDB"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-sm mb-5", children: [
              "Clicking ",
              /* @__PURE__ */ jsx("strong", { children: "Upload Quiz" }),
              " will POST your JSON to the backend. If a quiz already exists for this course, it will be ",
              /* @__PURE__ */ jsx("strong", { children: "overwritten" }),
              "."
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                id: "upload-quiz-btn",
                onClick: handleUpload,
                disabled: !selectedCourseId || !quizJson || !!jsonError || uploadStatus === "loading",
                className: "w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-95",
                children: uploadStatus === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                  " Uploading..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                  " Upload Quiz to MongoDB"
                ] })
              }
            ),
            uploadStatus === "success" && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-emerald-600 shrink-0" }),
              uploadMessage
            ] }),
            uploadStatus === "error" && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-500 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Upload failed" }),
                /* @__PURE__ */ jsx("p", { className: "opacity-80 mt-0.5", children: uploadMessage })
              ] })
            ] })
          ] })
        ] })
      ] }),
      tab === "hackathons" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-slate-900", children: "Hackathons Dashboard" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                if (showHackForm && editingHackId) {
                  resetHackForm();
                }
                setShowHackForm(!showHackForm);
                setHackMsg("");
              },
              className: `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${showHackForm ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"}`,
              children: showHackForm ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
                " Close Form"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                " Post a Hackathon"
              ] })
            }
          )
        ] }),
        showHackForm && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 mb-5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-5 h-5 text-amber-500" }),
            " ",
            editingHackId ? "Edit Hackathon" : "Post a Hackathon",
            " (Full Dynamic Control)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            [["title", "Title *"], ["slug", "SEO Slug (e.g. ai-hackathon-2026)"], ["tagline", "Tagline"], ["theme", "Theme / Track"], ["image", "Banner Image URL"], ["tags", "Tags (comma-separated)"], ["accentColor", "Accent Color (hex)"]].map(([key, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: label }),
              /* @__PURE__ */ jsx("input", { value: hackForm[key], onChange: (e) => setHackForm((p) => ({ ...p, [key]: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }, key)),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Status" }),
                /* @__PURE__ */ jsxs("select", { value: hackForm.status, onChange: (e) => setHackForm((p) => ({ ...p, status: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm", children: [
                  /* @__PURE__ */ jsx("option", { value: "upcoming", children: "Upcoming" }),
                  /* @__PURE__ */ jsx("option", { value: "live", children: "Live" }),
                  /* @__PURE__ */ jsx("option", { value: "ended", children: "Ended" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Hackathon Start Date" }),
                  /* @__PURE__ */ jsx("input", { type: "datetime-local", value: hackForm.startDate, onChange: (e) => setHackForm((p) => ({ ...p, startDate: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Registration Deadline" }),
                  /* @__PURE__ */ jsx("input", { type: "datetime-local", value: hackForm.registrationDeadline, onChange: (e) => setHackForm((p) => ({ ...p, registrationDeadline: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Submission Deadline" }),
                  /* @__PURE__ */ jsx("input", { type: "datetime-local", value: hackForm.submissionDeadline, onChange: (e) => setHackForm((p) => ({ ...p, submissionDeadline: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Team Min" }),
                /* @__PURE__ */ jsx("input", { type: "number", min: "1", value: hackForm.teamMin, onChange: (e) => setHackForm((p) => ({ ...p, teamMin: Number(e.target.value || 1) })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Team Max" }),
                /* @__PURE__ */ jsx("input", { type: "number", min: "1", value: hackForm.teamMax, onChange: (e) => setHackForm((p) => ({ ...p, teamMax: Number(e.target.value || 1) })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Description *" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.description, onChange: (e) => setHackForm((p) => ({ ...p, description: e.target.value })), rows: 3, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50", children: [
              /* @__PURE__ */ jsx("p", { className: "md:col-span-2 text-xs font-black uppercase tracking-widest text-slate-500", children: "Toggles" }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.paymentEnabled, onChange: (e) => setHackForm((p) => ({ ...p, paymentEnabled: e.target.checked })), className: "rounded" }),
                "Enable Payment"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.visible, onChange: (e) => setHackForm((p) => ({ ...p, visible: e.target.checked })), className: "rounded" }),
                "Visible to public"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.featured, onChange: (e) => setHackForm((p) => ({ ...p, featured: e.target.checked })), className: "rounded" }),
                "Featured card"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "md:col-span-2 text-xs font-black uppercase tracking-widest text-slate-500 mt-2", children: "Accepted Link Types" }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.acceptsAnyLink, onChange: (e) => setHackForm((p) => ({ ...p, acceptsAnyLink: e.target.checked })), className: "rounded" }),
                "Accept Any Valid URL ",
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "(overrides below)" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? "text-slate-400" : "text-slate-700"}`, children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.acceptsGitHubLink, onChange: (e) => setHackForm((p) => ({ ...p, acceptsGitHubLink: e.target.checked })), className: "rounded", disabled: hackForm.acceptsAnyLink }),
                "GitHub repo links (github.com)"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? "text-slate-400" : "text-slate-700"}`, children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.acceptsNotionLink, onChange: (e) => setHackForm((p) => ({ ...p, acceptsNotionLink: e.target.checked })), className: "rounded", disabled: hackForm.acceptsAnyLink }),
                "Notion links (notion.site / notion.so)"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? "text-slate-400" : "text-slate-700"}`, children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.acceptsDriveLink, onChange: (e) => setHackForm((p) => ({ ...p, acceptsDriveLink: e.target.checked })), className: "rounded", disabled: hackForm.acceptsAnyLink }),
                "Google Drive links"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? "text-slate-400" : "text-slate-700"}`, children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hackForm.acceptsPdfLink, onChange: (e) => setHackForm((p) => ({ ...p, acceptsPdfLink: e.target.checked })), className: "rounded", disabled: hackForm.acceptsAnyLink }),
                "Direct PDF links"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Payment Amount (INR)" }),
              /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: hackForm.paymentAmountInr, onChange: (e) => setHackForm((p) => ({ ...p, paymentAmountInr: Number(e.target.value || 0) })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Max Submissions / Team" }),
              /* @__PURE__ */ jsx("input", { type: "number", min: "1", value: hackForm.maxSubmissionsPerTeam, onChange: (e) => setHackForm((p) => ({ ...p, maxSubmissionsPerTeam: Number(e.target.value || 1) })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Payment Description" }),
              /* @__PURE__ */ jsx("input", { value: hackForm.paymentDescription, onChange: (e) => setHackForm((p) => ({ ...p, paymentDescription: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-black uppercase tracking-widest text-indigo-700 mb-3", children: "Submission Link Field Labels" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Field Label (shown to user)" }),
                  /* @__PURE__ */ jsx("input", { value: hackForm.linkLabel, onChange: (e) => setHackForm((p) => ({ ...p, linkLabel: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm", placeholder: "Submission Link" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Placeholder Text" }),
                  /* @__PURE__ */ jsx("input", { value: hackForm.linkPlaceholder, onChange: (e) => setHackForm((p) => ({ ...p, linkPlaceholder: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm", placeholder: "Paste your link here..." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Hint Text (below field)" }),
                  /* @__PURE__ */ jsx("input", { value: hackForm.linkHint, onChange: (e) => setHackForm((p) => ({ ...p, linkHint: e.target.value })), className: "w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm", placeholder: "e.g. Share your GitHub repo or project demo link" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Submission Instructions" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.submissionInstructions, onChange: (e) => setHackForm((p) => ({ ...p, submissionInstructions: e.target.value })), rows: 2, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Problem Statement" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.problemStatement, onChange: (e) => setHackForm((p) => ({ ...p, problemStatement: e.target.value })), rows: 3, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Rules (one per line)" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.rules, onChange: (e) => setHackForm((p) => ({ ...p, rules: e.target.value })), rows: 3, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Judging Criteria (one per line)" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.judgingCriteria, onChange: (e) => setHackForm((p) => ({ ...p, judgingCriteria: e.target.value })), rows: 3, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Prizes (one per line in format: Rank | Amount)" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.prizes, onChange: (e) => setHackForm((p) => ({ ...p, prizes: e.target.value })), rows: 3, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm", placeholder: "1st | INR 50,000\\n2nd | INR 25,000" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "FAQs (one per line in format: Question | Answer)" }),
              /* @__PURE__ */ jsx("textarea", { value: hackForm.faqs, onChange: (e) => setHackForm((p) => ({ ...p, faqs: e.target.value })), rows: 4, className: "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm", placeholder: "Who can join? | Any registered student\\nCan solo join? | Yes, if team min is 1" })
            ] })
          ] }),
          hackMsg && /* @__PURE__ */ jsx("div", { className: `mt-4 p-3 rounded-xl text-sm font-medium ${hackMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`, children: hackMsg }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: async () => {
                var _a2, _b2;
                if (!hackForm.title || !hackForm.description) {
                  setHackMsg("❌ Title and description are required.");
                  return;
                }
                if (hackForm.teamMin > hackForm.teamMax) {
                  setHackMsg("❌ Team min cannot be greater than team max.");
                  return;
                }
                setHackSaving(true);
                setHackMsg("");
                try {
                  const prizes = (hackForm.prizes || "").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
                    const [rank, amount] = line.split("|").map((part) => (part || "").trim());
                    return { rank: rank || "Prize", amount: amount || "" };
                  }).filter((item) => item.amount);
                  const faqs = (hackForm.faqs || "").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
                    const [question, answer] = line.split("|").map((part) => (part || "").trim());
                    return { question, answer };
                  }).filter((item) => item.question && item.answer);
                  const payloadTitle = hackForm.title || "";
                  const payloadSlug = hackForm.slug || "";
                  const generatedSlug = payloadSlug ? payloadSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : payloadTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                  const payload = {
                    title: payloadTitle,
                    slug: generatedSlug,
                    tagline: hackForm.tagline,
                    description: hackForm.description,
                    theme: hackForm.theme,
                    startDate: hackForm.startDate || null,
                    registrationDeadline: hackForm.registrationDeadline || null,
                    submissionDeadline: hackForm.submissionDeadline || null,
                    status: hackForm.status || "upcoming",
                    endDate: hackForm.endDate || null,
                    image: hackForm.image,
                    tags: (hackForm.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
                    visible: Boolean(hackForm.visible),
                    featured: Boolean(hackForm.featured),
                    prizes,
                    teamConfig: {
                      minMembers: Number(hackForm.teamMin),
                      maxMembers: Number(hackForm.teamMax),
                      requireExistingUsers: true
                    },
                    paymentConfig: {
                      enabled: Boolean(hackForm.paymentEnabled),
                      amountInr: Number(hackForm.paymentAmountInr || 0),
                      description: hackForm.paymentDescription
                    },
                    submissionConfig: {
                      acceptsAnyLink: Boolean(hackForm.acceptsAnyLink),
                      acceptsDriveLink: Boolean(hackForm.acceptsDriveLink),
                      acceptsPdfLink: Boolean(hackForm.acceptsPdfLink),
                      acceptsGitHubLink: Boolean(hackForm.acceptsGitHubLink),
                      acceptsNotionLink: Boolean(hackForm.acceptsNotionLink),
                      instructions: hackForm.submissionInstructions,
                      maxSubmissionsPerTeam: Number(hackForm.maxSubmissionsPerTeam || 3),
                      linkLabel: hackForm.linkLabel || "Submission Link",
                      linkPlaceholder: hackForm.linkPlaceholder || "Paste your submission link here...",
                      linkHint: hackForm.linkHint || ""
                    },
                    contentConfig: {
                      problemStatement: hackForm.problemStatement,
                      rules: (hackForm.rules || "").split("\n").map((x) => x.trim()).filter(Boolean),
                      judgingCriteria: (hackForm.judgingCriteria || "").split("\n").map((x) => x.trim()).filter(Boolean),
                      faqs
                    },
                    styleConfig: {
                      accentColor: hackForm.accentColor || "#4F46E5",
                      cardStyle: "modern",
                      bannerStyle: "gradient"
                    }
                  };
                  if (editingHackId) {
                    await api.put(`/events/hackathons/${editingHackId}`, payload);
                    setHackMsg("✅ Hackathon updated successfully!");
                  } else {
                    await api.post("/events/hackathons", payload);
                    setHackMsg("✅ Hackathon posted successfully!");
                  }
                  resetHackForm();
                  loadHacks();
                  setShowHackForm(false);
                } catch (e) {
                  console.error("Post Hackathon Error:", e);
                  setHackMsg("❌ " + (((_b2 = (_a2 = e.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || e.message || "Failed to save."));
                } finally {
                  setHackSaving(false);
                }
              },
              disabled: hackSaving,
              className: "mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60",
              children: hackSaving ? "Saving…" : editingHackId ? "💾 Update Hackathon" : "🚀 Post Hackathon"
            }
          ),
          editingHackId && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                resetHackForm();
                setHackMsg("");
                setShowHackForm(false);
              },
              className: "mt-3 ml-3 px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition",
              children: "Cancel Edit"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-5", children: "All Hackathons + Team Registrations" }),
          hacksLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-20 rounded-xl bg-slate-100 animate-pulse" }, i)) }) : hacks.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm", children: "No hackathons created yet." }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hacks.map((h) => {
            var _a2, _b2, _c2, _d2;
            return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: h.title }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold ${h.status === "live" ? "bg-emerald-100 text-emerald-700" : h.status === "ended" ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700"}`, children: h.status }),
                    h.visible ? /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700", children: "Visible" }) : /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400", children: "Hidden" }),
                    h.featured && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700", children: "Featured" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1 line-clamp-2", children: h.description }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 mt-2", children: [
                    "Team: ",
                    ((_a2 = h.teamConfig) == null ? void 0 : _a2.minMembers) || 1,
                    "-",
                    ((_b2 = h.teamConfig) == null ? void 0 : _b2.maxMembers) || 4,
                    " | Payment: ",
                    ((_c2 = h.paymentConfig) == null ? void 0 : _c2.enabled) ? `INR ${((_d2 = h.paymentConfig) == null ? void 0 : _d2.amountInr) || 0}` : "Free"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        var _a3, _b3, _c3, _d3, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2, _p2, _q2, _r2, _s2, _t2;
                        setEditingHackId(h._id);
                        setHackForm({
                          title: h.title || "",
                          slug: h.slug || "",
                          tagline: h.tagline || "",
                          description: h.description || "",
                          theme: h.theme || "",
                          status: h.status || "upcoming",
                          startDate: h.startDate ? new Date(h.startDate).toISOString().slice(0, 16) : "",
                          registrationDeadline: h.registrationDeadline ? new Date(h.registrationDeadline).toISOString().slice(0, 16) : "",
                          submissionDeadline: h.submissionDeadline ? new Date(h.submissionDeadline).toISOString().slice(0, 16) : "",
                          endDate: h.endDate ? new Date(h.endDate).toISOString().slice(0, 16) : "",
                          image: h.image || "",
                          tags: (h.tags || []).join(", "),
                          visible: Boolean(h.visible),
                          featured: Boolean(h.featured),
                          teamMin: Number(((_a3 = h.teamConfig) == null ? void 0 : _a3.minMembers) || 1),
                          teamMax: Number(((_b3 = h.teamConfig) == null ? void 0 : _b3.maxMembers) || 4),
                          paymentEnabled: Boolean((_c3 = h.paymentConfig) == null ? void 0 : _c3.enabled),
                          paymentAmountInr: Number(((_d3 = h.paymentConfig) == null ? void 0 : _d3.amountInr) || 0),
                          paymentDescription: ((_e2 = h.paymentConfig) == null ? void 0 : _e2.description) || "Hackathon registration fee",
                          acceptsAnyLink: Boolean((_f2 = h.submissionConfig) == null ? void 0 : _f2.acceptsAnyLink),
                          acceptsDriveLink: Boolean(((_g2 = h.submissionConfig) == null ? void 0 : _g2.acceptsDriveLink) ?? true),
                          acceptsPdfLink: Boolean(((_h2 = h.submissionConfig) == null ? void 0 : _h2.acceptsPdfLink) ?? true),
                          acceptsGitHubLink: Boolean(((_i2 = h.submissionConfig) == null ? void 0 : _i2.acceptsGitHubLink) ?? true),
                          acceptsNotionLink: Boolean(((_j2 = h.submissionConfig) == null ? void 0 : _j2.acceptsNotionLink) ?? true),
                          submissionInstructions: ((_k2 = h.submissionConfig) == null ? void 0 : _k2.instructions) || "",
                          maxSubmissionsPerTeam: Number(((_l2 = h.submissionConfig) == null ? void 0 : _l2.maxSubmissionsPerTeam) || 3),
                          linkLabel: ((_m2 = h.submissionConfig) == null ? void 0 : _m2.linkLabel) || "Submission Link",
                          linkPlaceholder: ((_n2 = h.submissionConfig) == null ? void 0 : _n2.linkPlaceholder) || "Paste your submission link here...",
                          linkHint: ((_o2 = h.submissionConfig) == null ? void 0 : _o2.linkHint) || "",
                          problemStatement: ((_p2 = h.contentConfig) == null ? void 0 : _p2.problemStatement) || "",
                          rules: (((_q2 = h.contentConfig) == null ? void 0 : _q2.rules) || []).join("\n"),
                          judgingCriteria: (((_r2 = h.contentConfig) == null ? void 0 : _r2.judgingCriteria) || []).join("\n"),
                          prizes: (h.prizes || []).map((p) => `${p.rank || "Prize"} | ${p.amount || ""}`).join("\n"),
                          faqs: (((_s2 = h.contentConfig) == null ? void 0 : _s2.faqs) || []).map((f) => `${f.question || ""} | ${f.answer || ""}`).join("\n"),
                          accentColor: ((_t2 = h.styleConfig) == null ? void 0 : _t2.accentColor) || "#4F46E5"
                        });
                        setHackMsg('📝 Edit mode enabled. Update fields and click "Update Hackathon".');
                        setShowHackForm(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      },
                      className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition",
                      children: "Edit"
                    }
                  ),
                  /* @__PURE__ */ jsx("button", { onClick: async () => {
                    await api.put(`/events/hackathons/${h._id}`, { visible: !h.visible });
                    loadHacks();
                  }, className: `px-3 py-1.5 rounded-lg text-xs font-bold transition ${h.visible ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`, children: h.visible ? "Hide" : "Show" }),
                  /* @__PURE__ */ jsx("button", { onClick: () => loadRegistrations(h._id), className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition", children: "Teams" }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleExportHackathonUsers(h._id), className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition", children: "Export Teams CSV" }),
                  /* @__PURE__ */ jsx("button", { onClick: async () => {
                    if (!confirm("Delete this hackathon?")) return;
                    await api.delete(`/events/hackathons/${h._id}`);
                    loadHacks();
                  }, className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition", children: "Delete" })
                ] })
              ] }),
              loadingRegistrationsFor === h._id && /* @__PURE__ */ jsx("div", { className: "mt-3 text-xs text-slate-500", children: "Loading team registrations..." }),
              Array.isArray(registrationsByHack[h._id]) && registrationsByHack[h._id].length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-b border-slate-200", children: [
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Team" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Leader" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Members" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Submissions" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Payment" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Score /100" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-bold text-slate-600", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: registrationsByHack[h._id].map((reg) => {
                  var _a3, _b3, _c3, _d3, _e2;
                  return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors align-top", children: [
                    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2.5", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900", children: reg.teamName }),
                      reg.isWinner && /* @__PURE__ */ jsxs("span", { className: "inline-block mt-1 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold", children: [
                        "🏆 ",
                        reg.winnerRank || "Winner"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2.5", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-800", children: ((_a3 = reg.leader) == null ? void 0 : _a3.name) || "—" }),
                      /* @__PURE__ */ jsx("p", { className: "text-slate-400", children: ((_b3 = reg.leader) == null ? void 0 : _b3.email) || "" })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsx("div", { className: "space-y-1", children: (reg.members || []).map((m, mi) => {
                      var _a4;
                      return /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-800", children: m.name || ((_a4 = m.user) == null ? void 0 : _a4.name) || "—" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-slate-400 ml-1", children: [
                          "(",
                          m.email,
                          ")"
                        ] })
                      ] }, mi);
                    }) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5", children: (reg.submissions || []).length === 0 ? /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "None" }) : /* @__PURE__ */ jsx("div", { className: "space-y-1", children: reg.submissions.map((sub, si) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
                        si + 1,
                        "."
                      ] }),
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: sub.link,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "text-indigo-600 underline hover:text-indigo-800 max-w-[160px] truncate block",
                          title: sub.link,
                          children: sub.link
                        }
                      ),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "w-2.5 h-2.5 text-slate-400 shrink-0" })
                    ] }, si)) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsx("span", { className: `px-1.5 py-0.5 rounded text-xs font-semibold ${((_c3 = reg.payment) == null ? void 0 : _c3.status) === "paid" ? "bg-emerald-100 text-emerald-700" : ((_d3 = reg.payment) == null ? void 0 : _d3.status) === "pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`, children: ((_e2 = reg.payment) == null ? void 0 : _e2.status) || "not_required" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "number",
                          min: "0",
                          max: "100",
                          defaultValue: reg.score ?? 0,
                          onBlur: async (e) => {
                            const val = Number(e.target.value);
                            if (val < 0 || val > 100) {
                              e.target.value = reg.score ?? 0;
                              return;
                            }
                            try {
                              await api.put(`/events/admin/hackathons/${h._id}/registrations/${reg._id}/score`, { score: val });
                            } catch {
                              e.target.value = reg.score ?? 0;
                            }
                          },
                          className: "w-14 px-2 py-1 border border-slate-200 rounded text-xs text-center focus:ring-2 focus:ring-indigo-400 outline-none"
                        }
                      ),
                      reg.scoredAt && /* @__PURE__ */ jsx("span", { className: "text-slate-300 text-xs", title: `Scored ${new Date(reg.scoredAt).toLocaleDateString()}`, children: "✓" })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsx(
                      "select",
                      {
                        value: reg.status,
                        onChange: async (e) => {
                          await api.put(`/events/admin/hackathons/${h._id}/registrations/${reg._id}`, {
                            status: e.target.value,
                            adminRemarks: reg.adminRemarks || ""
                          });
                          loadRegistrations(h._id);
                        },
                        className: "px-2 py-1 rounded border border-slate-200 text-xs",
                        children: ["registered", "payment_pending", "submitted", "under_review", "approved", "rejected"].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
                      }
                    ) })
                  ] }, reg._id);
                }) })
              ] }) }) }),
              Array.isArray(registrationsByHack[h._id]) && registrationsByHack[h._id].length === 0 && loadingRegistrationsFor !== h._id && /* @__PURE__ */ jsx("div", { className: "mt-3 text-xs text-slate-500", children: "No team registrations yet." })
            ] }, h._id);
          }) })
        ] })
      ] }),
      tab === "guide" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileJson, { className: "w-5 h-5 text-indigo-600" }),
            "How to Add / Edit Courses"
          ] }),
          /* @__PURE__ */ jsx("ol", { className: "space-y-5 text-slate-700", children: [
            {
              step: "1",
              title: "Open all-courses.json",
              desc: "Located at frontend/public/data/all-courses.json. This is the single source of truth for all course content."
            },
            {
              step: "2",
              title: "Add a new entry at the bottom of the array",
              desc: 'Each course entry has two keys: "course" (metadata) and "lessons" (array of lesson objects). Copy an existing entry and update the fields.'
            },
            {
              step: "3",
              title: "Required fields for a course",
              desc: "_id (unique hex), title, slug (kebab-case, used in URL), description, image (URL), theme (blue/green/orange/pink), published (true/false)"
            },
            {
              step: "4",
              title: "Required fields for each lesson",
              desc: "_id (unique hex), course (same as course._id), title, content (HTML string), order (1, 2, 3...)"
            },
            {
              step: "5",
              title: "Save the file",
              desc: "Vite dev server hot-reloads instantly. In production, redeploy the frontend build. No backend changes needed."
            }
          ].map(({ step, title, desc }) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5", children: step }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: desc })
            ] })
          ] }, step)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Edit3, { className: "w-5 h-5 text-violet-600" }),
            "Course Entry Template"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono", children: "all-courses.json - new course entry" }),
            /* @__PURE__ */ jsx("pre", { className: "p-5 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre", children: `{
  "course": {
    "_id": "UNIQUE_HEX_24_CHARS",
    "title": "My New Course",
    "slug": "my-new-course",
    "description": "Short description here.",
    "image": "https://link-to-image.jpg",
    "instructor": "69b7983467bb2f063cefab80",
    "published": true,
    "theme": "orange",
    "createdAt": "2026-03-17T00:00:00.000Z",
    "updatedAt": "2026-03-17T00:00:00.000Z",
    "__v": 0
  },
  "lessons": [
    {
      "_id": "UNIQUE_HEX_24_CHARS",
      "course": "SAME_AS_COURSE_ID",
      "title": "1. Introduction",
      "content": "<h2>Welcome!</h2><p>Your lesson HTML here.</p>",
      "videoUrl": "",
      "order": 1,
      "__v": 0,
      "createdAt": "2026-03-17T00:00:00.000Z",
      "updatedAt": "2026-03-17T00:00:00.000Z"
    }
  ]
}` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-amber-800 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }),
            "Themes Available"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: [
            { name: "blue", cls: "bg-indigo-600" },
            { name: "green", cls: "bg-emerald-600" },
            { name: "orange", cls: "bg-amber-500" },
            { name: "pink", cls: "bg-rose-600" }
          ].map(({ name, cls }) => /* @__PURE__ */ jsx("span", { className: `${cls} text-white px-3 py-1 rounded-full text-xs font-bold`, children: name }, name)) })
        ] })
      ] }),
      tab === "host-requests" && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-6 h-6 text-indigo-600" }),
            "Host Requests (B2B)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleExportAllUsers,
                className: "px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm flex items-center gap-2",
                children: "Export All Users"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: loadHostRequests,
                className: "px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-sm flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
                  " Refresh"
                ]
              }
            )
          ] })
        ] }),
        hostRequestsLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 rounded-xl bg-slate-100 animate-pulse" }, i)) }) : hostRequests.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500", children: "No hosting requests received yet." }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostRequests.map((req) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-slate-900", children: req.organization }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${req.status === "pending" ? "bg-amber-100 text-amber-700" : req.status === "contacted" ? "bg-blue-100 text-blue-700" : req.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`, children: req.status.toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs block", children: "Contact Name" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: req.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs block", children: "Email" }),
                /* @__PURE__ */ jsx("a", { href: `mailto:${req.email}`, className: "font-medium text-indigo-600 hover:underline", children: req.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs block", children: "Expected Pax" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: req.expectedParticipants || "Not specified" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs block", children: "Date Submitted" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: formatDate(req.createdAt) })
              ] })
            ] }),
            req.message && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-400 block mb-1", children: "Message:" }),
              req.message
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex flex-row md:flex-col gap-2", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: req.status,
                onChange: (e) => updateHostRequestStatus(req._id, e.target.value),
                className: "px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
                  /* @__PURE__ */ jsx("option", { value: "contacted", children: "Contacted" }),
                  /* @__PURE__ */ jsx("option", { value: "approved", children: "Approved & Created" }),
                  /* @__PURE__ */ jsx("option", { value: "rejected", children: "Rejected" })
                ]
              }
            ),
            req.status !== "approved" && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setTab("hackathons");
                  setHackForm((prev) => ({
                    ...prev,
                    title: `${req.organization} Hackathon`,
                    paymentDescription: `Registration for ${req.organization} event`
                  }));
                  setShowHackForm(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                },
                className: "px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  " Create Hackathon"
                ]
              }
            )
          ] })
        ] }) }, req._id)) })
      ] }) }),
      tab === "coupons" && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        couponMsg.text && /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${couponMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`, children: [
          couponMsg.type === "success" ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: couponMsg.text }),
          /* @__PURE__ */ jsx("button", { onClick: () => setCouponMsg({ type: "", text: "" }), className: "ml-auto shrink-0", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-indigo-600" }),
            "Create Discount Coupon"
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateCoupon, className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Coupon Code *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    required: true,
                    type: "text",
                    placeholder: "e.g. SKILL20",
                    value: couponForm.code,
                    onChange: (e) => setCouponForm((p) => ({ ...p, code: e.target.value.toUpperCase() })),
                    maxLength: 30,
                    pattern: "[A-Z0-9_-]+",
                    title: "Only A-Z, 0-9, _ or - allowed",
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 uppercase"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "3–30 chars, A-Z / 0-9 / _ / -" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Discount Type *" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: couponForm.discountType,
                    onChange: (e) => setCouponForm((p) => ({ ...p, discountType: e.target.value })),
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "percentage", children: "Percentage (%) off" }),
                      /* @__PURE__ */ jsx("option", { value: "flat", children: "Flat (₹) off" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: couponForm.discountType === "percentage" ? "Discount % (1–100) *" : "Flat Discount ₹ *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    required: true,
                    type: "number",
                    min: "1",
                    max: couponForm.discountType === "percentage" ? 100 : 98,
                    step: "0.01",
                    placeholder: couponForm.discountType === "percentage" ? "20" : "30",
                    value: couponForm.discountValue,
                    onChange: (e) => setCouponForm((p) => ({ ...p, discountValue: e.target.value })),
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Usage Limit" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    placeholder: "Leave blank for unlimited",
                    value: couponForm.maxUsageLimit,
                    onChange: (e) => setCouponForm((p) => ({ ...p, maxUsageLimit: e.target.value })),
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Valid From" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "datetime-local",
                    value: couponForm.validFrom,
                    onChange: (e) => setCouponForm((p) => ({ ...p, validFrom: e.target.value })),
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Valid Until (Expiry)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "datetime-local",
                    value: couponForm.validUntil,
                    onChange: (e) => setCouponForm((p) => ({ ...p, validUntil: e.target.value })),
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 md:col-span-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-wide", children: "Internal Description" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "e.g. Campus ambassador batch April 2026",
                    value: couponForm.description,
                    maxLength: 200,
                    onChange: (e) => setCouponForm((p) => ({ ...p, description: e.target.value })),
                    className: "border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }
                )
              ] })
            ] }),
            couponForm.code && couponForm.discountValue && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Percent, { className: "w-4 h-4 shrink-0" }),
              /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("strong", { children: couponForm.code || "..." }),
                " — ",
                couponForm.discountType === "percentage" ? `${couponForm.discountValue}% off → ₹${Math.max(1, Math.round(99 * (1 - couponForm.discountValue / 100)))}` : `₹${couponForm.discountValue} off → ₹${Math.max(1, 99 - Number(couponForm.discountValue))}`,
                couponForm.maxUsageLimit ? ` · limit ${couponForm.maxUsageLimit} uses` : " · unlimited uses",
                couponForm.validUntil ? ` · expires ${new Date(couponForm.validUntil).toLocaleDateString("en-IN")}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: couponSaving,
                className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition disabled:opacity-60",
                children: [
                  couponSaving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  couponSaving ? "Creating..." : "Create Coupon"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-5", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-indigo-600" }),
              "All Coupons",
              /* @__PURE__ */ jsx("span", { className: "ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold", children: coupons.length })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: loadCoupons,
                disabled: couponsLoading,
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition",
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${couponsLoading ? "animate-spin" : ""}` }),
                  "Refresh"
                ]
              }
            )
          ] }),
          couponsLoading && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-20 rounded-xl bg-slate-100 animate-pulse" }, i)) }),
          !couponsLoading && coupons.length === 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-slate-200 p-8 text-center", children: [
            /* @__PURE__ */ jsx(Tag, { className: "w-8 h-8 text-slate-300 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 font-medium", children: "No coupons created yet." }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Use the form above to create your first discount coupon." })
          ] }),
          !couponsLoading && coupons.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: coupons.map((coupon) => {
            const isExpired = coupon.validUntil && new Date(coupon.validUntil) < /* @__PURE__ */ new Date();
            const isExhausted = coupon.maxUsageLimit !== null && coupon.usedCount >= coupon.maxUsageLimit;
            const statusBadge = !coupon.isActive ? { label: "Inactive", cls: "bg-slate-100 text-slate-600" } : isExpired ? { label: "Expired", cls: "bg-rose-100 text-rose-700" } : isExhausted ? { label: "Exhausted", cls: "bg-amber-100 text-amber-700" } : { label: "Active", cls: "bg-emerald-100 text-emerald-700" };
            return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900 text-base font-mono tracking-widest", children: coupon.code }),
                  /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusBadge.cls}`, children: statusBadge.label }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full", children: coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off` })
                ] }),
                coupon.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-1 truncate max-w-sm", children: coupon.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Used: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: coupon.usedCount }),
                    coupon.maxUsageLimit !== null ? ` / ${coupon.maxUsageLimit}` : " / ∞"
                  ] }),
                  coupon.validUntil && /* @__PURE__ */ jsxs("span", { children: [
                    "Expires: ",
                    /* @__PURE__ */ jsx("strong", { className: `${isExpired ? "text-rose-600" : "text-slate-700"}`, children: new Date(coupon.validUntil).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) })
                  ] }),
                  coupon.validFrom && /* @__PURE__ */ jsxs("span", { children: [
                    "From: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: new Date(coupon.validFrom).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Created: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: formatDate(coupon.createdAt) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleToggleCoupon(coupon._id),
                    title: coupon.isActive ? "Deactivate coupon" : "Activate coupon",
                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${coupon.isActive ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"}`,
                    children: [
                      coupon.isActive ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-4 h-4" }),
                      coupon.isActive ? "Active" : "Inactive"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleDeleteCoupon(coupon._id, coupon.code),
                    disabled: deletingCouponId === coupon._id,
                    title: "Delete coupon permanently",
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition disabled:opacity-50",
                    children: [
                      deletingCouponId === coupon._id ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                      "Delete"
                    ]
                  }
                )
              ] })
            ] }) }, coupon._id);
          }) })
        ] })
      ] })
    ] })
  ] });
};
export {
  AdminPanel as default
};
