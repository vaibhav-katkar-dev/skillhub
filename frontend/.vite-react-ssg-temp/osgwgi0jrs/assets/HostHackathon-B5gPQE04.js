import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { H as Helmet, d as api } from "../main.mjs";
import { Sparkles, ShieldCheck, ChevronRight, Globe, Award, Zap, Users } from "lucide-react";
import "react-dom/client";
import "react-router-dom";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
function HostHackathon() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    expectedParticipants: "",
    eventType: "hackathon",
    message: ""
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await api.post("/host/submit", formData);
      setStatus("success");
      setFormData({ name: "", email: "", organization: "", expectedParticipants: "", eventType: "hackathon", message: "" });
      setTimeout(() => setStatus("idle"), 5e3);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit. Please try again.");
      setStatus("idle");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const features = [
    {
      icon: /* @__PURE__ */ jsx(Globe, { className: "w-6 h-6 text-indigo-400" }),
      title: "Custom Subdomain",
      description: "Get a dedicated, lightning-fast landing page on hackathons.skillvalix.com instantly."
    },
    {
      icon: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6 text-purple-400" }),
      title: "Automated Certificates",
      description: "1-Click HD certificate generation for all participants with perfect alignment."
    },
    {
      icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6 text-amber-400" }),
      title: "Scalable Infrastructure",
      description: "Our Vercel edge network handles traffic spikes of 5,000+ users seamlessly."
    },
    {
      icon: /* @__PURE__ */ jsx(Users, { className: "w-6 h-6 text-emerald-400" }),
      title: "Built-in Audience",
      description: "Instantly promote your event to our thousands of verified, active developers."
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a0a0f] text-slate-200 selection:bg-indigo-500/30 overflow-hidden relative", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Host a Hackathon | SkillHub" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Host your hackathons and tech events seamlessly with SkillHub. Get a dedicated subdomain, auto-certificates, and reach thousands of developers." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-indigo-400" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-300", children: "SkillHub For Creators" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-indigo-300/50 leading-[1.1]", children: [
          "Elevate Your ",
          /* @__PURE__ */ jsx("br", {}),
          " Tech Events."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg lg:text-xl text-slate-400 max-w-xl leading-relaxed", children: "Don't get lost in crowded platforms. Host your hackathons on SkillHub with a premium UI, zero-hassle certificate generation, and an exclusive audience." }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-6 pt-6", children: features.map((feature, idx) => /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: feature.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: feature.description })
        ] }, idx)) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-8 flex items-center gap-4 text-sm text-slate-500 font-medium pb-10 lg:pb-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500" }),
            "No setup cost"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-slate-700" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500" }),
            "Concierge onboarding"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md mx-auto lg:ml-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-[1px] bg-gradient-to-b from-indigo-500/50 to-purple-500/50 rounded-3xl blur-sm opacity-50" }),
        /* @__PURE__ */ jsxs("div", { className: "relative bg-[#0d0d14]/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "Request Access" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Tell us about your event and our team will get your custom page live in 24 hours." }),
          errorMsg && /* @__PURE__ */ jsx("div", { className: "mb-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg p-3", children: errorMsg }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider", children: "Your Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "name",
                  required: true,
                  value: formData.name,
                  onChange: handleChange,
                  className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all",
                  placeholder: "John Doe"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider", children: "Work Email" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  name: "email",
                  required: true,
                  value: formData.email,
                  onChange: handleChange,
                  className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all",
                  placeholder: "john@college.edu or @company.com"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider", children: "Organization" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "organization",
                    required: true,
                    value: formData.organization,
                    onChange: handleChange,
                    className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all",
                    placeholder: "College/Company"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider", children: "Expected Pax" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "expectedParticipants",
                    value: formData.expectedParticipants,
                    onChange: handleChange,
                    className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", className: "bg-[#0d0d14]", children: "Select" }),
                      /* @__PURE__ */ jsx("option", { value: "50-200", className: "bg-[#0d0d14]", children: "50 - 200" }),
                      /* @__PURE__ */ jsx("option", { value: "200-500", className: "bg-[#0d0d14]", children: "200 - 500" }),
                      /* @__PURE__ */ jsx("option", { value: "500+", className: "bg-[#0d0d14]", children: "500+" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider", children: "Event Details (Optional)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "message",
                  value: formData.message,
                  onChange: handleChange,
                  rows: "3",
                  className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none",
                  placeholder: "We want to host a Web3 hackathon..."
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: status === "submitting",
                className: "w-full mt-2 bg-white text-black hover:bg-slate-200 focus:ring-4 focus:ring-white/20 font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-70",
                children: status === "idle" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { children: "Submit Request" }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
                ] }) : status === "submitting" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-black", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                    /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                  ] }),
                  "Processing..."
                ] }) : /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" }),
                  " Request Sent!"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  HostHackathon as default
};
