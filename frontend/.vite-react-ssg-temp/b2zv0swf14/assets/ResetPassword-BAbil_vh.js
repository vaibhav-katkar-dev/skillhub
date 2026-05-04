import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { d as api } from "../main.mjs";
import { Lock } from "lucide-react";
import "react-dom/client";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    var _a, _b;
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password has been successfully updated.");
      setTimeout(() => {
        navigate("/login");
      }, 3e3);
    } catch (err) {
      setError(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Failed to reset password. The link might be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("title", { children: "Set New Password | SkillValix Learning" }) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-50 rounded-full", children: /* @__PURE__ */ jsx(Lock, { className: "w-8 h-8 text-blue-600" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center text-slate-900 mb-6", children: "Set New Password" }),
      message && /* @__PURE__ */ jsx("div", { className: "bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-md mb-4 text-sm text-center", children: message }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm text-center", children: error }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "New Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              required: true,
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Confirm New Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              required: true,
              className: "w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              placeholder: "••••••••"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed",
            children: loading ? "Saving..." : "Reset Password"
          }
        )
      ] })
    ] })
  ] });
};
export {
  ResetPassword as default
};
