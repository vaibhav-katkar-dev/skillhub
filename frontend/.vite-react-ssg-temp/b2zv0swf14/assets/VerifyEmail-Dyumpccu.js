import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { u as useAuthStore } from "../main.mjs";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import "react-dom/client";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const performVerification = async () => {
      var _a, _b;
      try {
        const data = await verifyEmail(token);
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Verification failed. The link may be invalid or expired.");
      }
    };
    if (token) {
      performVerification();
    } else {
      setStatus("error");
      setMessage("Invalid verification token.");
    }
  }, [token, verifyEmail]);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50 px-4", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("title", { children: "Verify Email | SkillValix" }) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center", children: [
      status === "loading" && /* @__PURE__ */ jsxs("div", { className: "py-8", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Verifying Email..." }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Please wait while we confirm your account." })
      ] }),
      status === "success" && /* @__PURE__ */ jsxs("div", { className: "py-8", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-12 h-12 text-emerald-600" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Email Verified!" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-8", children: message }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/login",
            className: "inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-3 rounded-lg shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]",
            children: "Go to Login"
          }
        )
      ] }),
      status === "error" && /* @__PURE__ */ jsxs("div", { className: "py-8", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(XCircle, { className: "w-12 h-12 text-red-600" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Verification Failed" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-8", children: message }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/register",
              className: "block w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all",
              children: "Try Registering Again"
            }
          ),
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "block text-emerald-600 font-medium hover:underline", children: "Back to Login" })
        ] })
      ] })
    ] })
  ] });
};
export {
  VerifyEmail as default
};
