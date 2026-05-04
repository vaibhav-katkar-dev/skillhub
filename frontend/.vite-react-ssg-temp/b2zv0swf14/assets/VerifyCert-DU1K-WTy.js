import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { g as getCourseList, d as api } from "../main.mjs";
import { ShieldCheck, Search, Loader2, XCircle, Award, CheckCircle, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import "react-dom/client";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const EVENT_TYPE_LABEL = {
  "job-simulation": "Job Simulation",
  hackathon: "Hackathon",
  internship: "Internship"
};
const CTA_THEMES = {
  blue: "from-indigo-600 to-blue-700",
  green: "from-emerald-600 to-teal-700",
  pink: "from-rose-600 to-pink-700",
  orange: "from-amber-500 to-orange-600"
};
const VerifyCert = () => {
  const { certId: urlCertId } = useParams();
  const [certId, setCertId] = useState(urlCertId || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    getCourseList().then((data) => setCourses((data || []).slice(0, 6))).catch(() => setCourses([]));
  }, []);
  useEffect(() => {
    if (urlCertId) {
      verifyCertificate(urlCertId);
    }
  }, [urlCertId]);
  const verifyCertificate = async (idToVerify) => {
    var _a, _b, _c;
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const certKey = idToVerify.trim();
      try {
        const res = await api.get(`/certificates/verify/${certKey}`);
        setResult({ ...res.data, source: "course" });
        return;
      } catch (courseErr) {
        if (((_a = courseErr == null ? void 0 : courseErr.response) == null ? void 0 : _a.status) !== 404) throw courseErr;
      }
      const eventRes = await api.get(`/events/certificates/verify/${certKey}`);
      setResult({ ...eventRes.data, source: "event" });
    } catch (err) {
      setError(((_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "Certificate not found or invalid.");
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = (e) => {
    e.preventDefault();
    verifyCertificate(certId);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-[calc(100vh-140px)] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_36%,#f8fafc_100%)] py-10 sm:py-12 px-4", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Verify Certificate | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Verify the authenticity of a SkillValix certificate using its unique ID." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 sm:mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-sky-700 shadow-sm", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }),
          "Unified Certificate Verification"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight", children: "Verify Any SkillValix Certificate" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-lg", children: "One smart page for both course and event certificates. Enter the certificate ID and get instant verification." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1.05fr_0.95fr] gap-5 sm:gap-6 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-3xl shadow-[0_16px_60px_rgba(15,23,42,0.08)] p-5 sm:p-7", children: [
          /* @__PURE__ */ jsxs("form", { onSubmit: handleVerify, className: "space-y-4", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-800", children: "Certificate ID" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-base sm:text-lg text-slate-900 font-mono uppercase focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all placeholder:normal-case placeholder:text-slate-400",
                    placeholder: "e.g. CERT-1A2B3C4D or EVC-1A2B3C4D",
                    value: certId,
                    onChange: (e) => setCertId(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading || !certId.trim(),
                  className: "h-12 sm:h-auto sm:px-6 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400 text-white font-bold transition-colors flex items-center justify-center gap-2",
                  children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Verify"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: ["Course Certificates", "Job Simulation Certificates", "Hackathon Certificates"].map((item) => /* @__PURE__ */ jsx("span", { className: "text-[11px] sm:text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold", children: item }, item)) }),
          error && /* @__PURE__ */ jsxs("div", { className: "mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(XCircle, { className: "w-5 h-5 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Verification failed" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm mt-0.5", children: error })
            ] })
          ] }),
          !error && !result && !loading && /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-10 h-10 text-slate-300 mx-auto mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-700", children: "Enter certificate ID to start verification" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: "We will show recipient, program, issue date, and certificate status." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-3xl shadow-[0_16px_60px_rgba(15,23,42,0.08)] overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500" }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg sm:text-xl font-black text-slate-900", children: "Verification Result" }),
              /* @__PURE__ */ jsx("span", { className: `text-xs font-bold px-3 py-1 rounded-full border ${result ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`, children: result ? "VALID" : loading ? "CHECKING" : "WAITING" })
            ] }),
            loading && !result ? /* @__PURE__ */ jsxs("div", { className: "py-10 text-center", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-sky-600 mx-auto mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-800", children: "Checking official records..." })
            ] }) : result ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-200 p-3.5", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold", children: "Certificate Type" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800 mt-1", children: (result == null ? void 0 : result.source) === "event" ? EVENT_TYPE_LABEL[result == null ? void 0 : result.eventType] || "Event Certificate" : "Course Certificate" })
              ] }),
              /* @__PURE__ */ jsx(InfoRow, { label: "Recipient", value: result == null ? void 0 : result.studentName, large: true }),
              /* @__PURE__ */ jsx(InfoRow, { label: "Programme", value: (result == null ? void 0 : result.courseTitle) || (result == null ? void 0 : result.eventTitle) }),
              (result == null ? void 0 : result.role) && /* @__PURE__ */ jsx(InfoRow, { label: "Role", value: result.role }),
              /* @__PURE__ */ jsx(
                InfoRow,
                {
                  label: "Issue Date",
                  value: (result == null ? void 0 : result.issueDate) ? new Date(result.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : ""
                }
              ),
              /* @__PURE__ */ jsx(InfoRow, { label: "Certificate ID", value: result == null ? void 0 : result.certificateId, mono: true }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-emerald-600 mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-emerald-800", children: "Certificate verified" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700/80", children: "This credential matches an official SkillValix record." })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "py-10 text-center text-slate-500", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 mx-auto mb-2 text-slate-300" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Result will appear here" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 sm:mt-10 bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.2)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-black", children: "Popular Certification Paths" }),
          /* @__PURE__ */ jsxs(Link, { to: "/courses", className: "text-sm font-bold text-sky-300 hover:text-sky-200 inline-flex items-center gap-1", children: [
            "View all",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: courses.map((course) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/courses/${course.slug}`,
            className: "group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden",
            children: [
              /* @__PURE__ */ jsx("div", { className: `h-1.5 bg-gradient-to-r ${CTA_THEMES[course.theme] || CTA_THEMES.blue}` }),
              /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-sky-200" }) }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-sm text-white line-clamp-2", children: course.title })
              ] })
            ]
          },
          course._id
        )) })
      ] })
    ] })
  ] });
};
function InfoRow({ label, value, large = false, mono = false }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-white px-3.5 py-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold", children: label }),
    /* @__PURE__ */ jsx("p", { className: `mt-1 text-slate-900 break-words ${large ? "text-xl font-black" : "text-sm font-bold"} ${mono ? "font-mono" : ""}`, children: value || "--" })
  ] });
}
export {
  VerifyCert as default
};
