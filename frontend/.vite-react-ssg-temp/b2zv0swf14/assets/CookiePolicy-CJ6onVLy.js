import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Helmet } from "react-helmet-async";
import { Cookie, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
const LAST_UPDATED = "March 25, 2026";
const EMAIL = "support@skillvalix.com";
const SITE = "www.skillvalix.com";
const Section = ({ title, children }) => /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
  /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-blue-400 shrink-0" }),
    title
  ] }),
  /* @__PURE__ */ jsx("div", { className: "space-y-3 text-slate-400 text-sm leading-relaxed pl-7", children })
] });
const CookieTable = ({ rows }) => /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-800 mt-3", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left", children: [
  /* @__PURE__ */ jsx("thead", { className: "bg-slate-900 text-slate-400 text-xs uppercase tracking-wider", children: /* @__PURE__ */ jsx("tr", { children: ["Cookie Name", "Purpose", "Duration", "Type"].map((h) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: h }, h)) }) }),
  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-800", children: rows.map((r, i) => /* @__PURE__ */ jsxs("tr", { className: "bg-slate-950 hover:bg-slate-900/60 transition-colors", children: [
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs text-blue-300", children: r.name }),
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: r.purpose }),
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-500", children: r.duration }),
    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
      "span",
      {
        className: `inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold border ${r.type === "Essential" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"}`,
        children: r.type
      }
    ) })
  ] }, i)) })
] }) });
function CookiePolicy() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-950", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Cookie Policy | SkillValix" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Learn how SkillValix uses cookies, which ones we use, and how you can control them."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(Cookie, { className: "w-6 h-6 text-blue-400" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-blue-400", children: "Legal" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white mb-3", children: "Cookie Policy" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-400 text-sm", children: [
        "Last updated: ",
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: LAST_UPDATED })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl", children: [
        "This policy explains what cookies are, how we use them on ",
        SITE,
        ", and your choices regarding cookies."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14", children: [
      /* @__PURE__ */ jsxs(Section, { title: "1. What Are Cookies?", children: [
        /* @__PURE__ */ jsx("p", { children: "Cookies are small text files placed on your device by a website when you visit it. They help websites remember your preferences, keep you signed in, and understand how you use the site." }),
        /* @__PURE__ */ jsx("p", { children: "Cookies are not programs. They cannot carry viruses or install malware on your device." })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "2. Types of Cookies We Use", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "We keep our cookie usage minimal and purposeful. We use only ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Essential" }),
          " cookies required to operate the platform."
        ] }),
        /* @__PURE__ */ jsx(CookieTable, { rows: [
          {
            name: "auth_token",
            purpose: "Keeps you securely logged in to your account (JWT session token)",
            duration: "Session / 7 days",
            type: "Essential"
          },
          {
            name: "skillhub_pref",
            purpose: "Remembers lightweight UI preferences such as the last visited course",
            duration: "30 days",
            type: "Essential"
          },
          {
            name: "__razorpay_*",
            purpose: "Set by Razorpay to process payments securely; we do not read these",
            duration: "Session",
            type: "Essential"
          },
          {
            name: "g_state",
            purpose: "Set by Google Sign-In to manage OAuth login flow",
            duration: "Session",
            type: "Essential"
          }
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "3. What We Do Not Use", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "We ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "do not" }),
          " use:"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Advertising or tracking cookies" }),
          /* @__PURE__ */ jsx("li", { children: "Third-party analytics cookies" }),
          /* @__PURE__ */ jsx("li", { children: "Social media tracking pixels" }),
          /* @__PURE__ */ jsx("li", { children: "Cross-site behavioural profiling" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "4. How to Control Cookies", children: [
        /* @__PURE__ */ jsx("p", { children: "You can control and delete cookies through your browser settings:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Chrome:" }),
            " Settings > Privacy and Security > Cookies and other site data"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Firefox:" }),
            " Settings > Privacy and Security > Cookies and Site Data"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Safari:" }),
            " Preferences > Privacy > Manage Website Data"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Edge:" }),
            " Settings > Cookies and site permissions"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-yellow-300/80", children: "Disabling cookies may prevent you from staying logged in or completing payments on the platform." })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "5. Third-Party Cookies", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Our payment provider ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Razorpay" }),
          " and authentication provider ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Google" }),
          " may set cookies governed by their own policies:"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://razorpay.com/privacy/", target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:underline", children: "Razorpay Privacy Policy" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://policies.google.com/privacy", target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:underline", children: "Google Privacy Policy" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "6. Consent", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "By continuing to use ",
          SITE,
          " after seeing our cookie notice, you consent to our use of essential cookies as described in this policy."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Since we only use essential cookies, we are not required to obtain separate opt-in consent for analytics or advertising cookies because we do not use them." })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "7. Updates to This Policy", children: /* @__PURE__ */ jsx("p", { children: 'We may update this Cookie Policy from time to time. Check the "Last updated" date above for the most recent version.' }) }),
      /* @__PURE__ */ jsx(Section, { title: "8. Contact", children: /* @__PURE__ */ jsxs("p", { children: [
        "Questions about our cookie practices? Email us at ",
        /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy-policy", className: "text-blue-400 hover:underline", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-blue-400 hover:underline", children: "Terms of Service" }),
        /* @__PURE__ */ jsx(Link, { to: "/refund-policy", className: "text-blue-400 hover:underline", children: "Refund Policy" })
      ] })
    ] })
  ] });
}
export {
  CookiePolicy as default
};
