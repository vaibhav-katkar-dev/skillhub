import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Helmet } from "react-helmet-async";
import { Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
const LAST_UPDATED = "March 25, 2026";
const COMPANY = "SkillValix Learning Platform";
const SITE = "www.skillvalix.com";
const EMAIL = "support@skillvalix.com";
const Section = ({ title, children }) => /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
  /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-blue-400 shrink-0" }),
    title
  ] }),
  /* @__PURE__ */ jsx("div", { className: "space-y-3 text-slate-400 text-sm leading-relaxed pl-7", children })
] });
function PrivacyPolicy() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-950", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Privacy Policy | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Read SkillValix Privacy Policy to understand how we collect, use, and protect your personal data." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-blue-400" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-blue-400", children: "Legal" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white mb-3", children: "Privacy Policy" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-400 text-sm", children: [
        "Last updated: ",
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: LAST_UPDATED })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl", children: [
        "Your privacy is important to us. This policy explains what data we collect, why we collect it, and how we protect it. By using ",
        SITE,
        " you agree to the practices described below."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14", children: [
      /* @__PURE__ */ jsxs(Section, { title: "1. Who We Are", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          COMPANY,
          " operates the website ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: SITE }),
          ' ("Platform"). We are the data controller for information collected through the Platform.'
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Contact us at: ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "2. Information We Collect", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Account Data:" }),
          " Name, email address, and password (hashed) when you register."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Profile & Course Data:" }),
          " Courses enrolled, lessons completed, exam scores, and certificates issued."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Payment Data:" }),
          " Payment amounts and order IDs via Razorpay. We do not store full card numbers — Razorpay handles PCI-compliant payment processing."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Usage Data:" }),
          " Browser type, IP address, pages visited, and time spent — collected automatically via server logs."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Communications:" }),
          " Emails you send us or that we send you (e.g., password reset, certificates)."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "3. How We Use Your Information", children: [
        /* @__PURE__ */ jsx("p", { children: "We use collected data to:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Create and manage your account and course progress" }),
          /* @__PURE__ */ jsx("li", { children: "Issue and verify certificates of completion" }),
          /* @__PURE__ */ jsx("li", { children: "Process exam payments and provide lifetime access" }),
          /* @__PURE__ */ jsx("li", { children: "Send transactional emails (password reset, receipts)" }),
          /* @__PURE__ */ jsx("li", { children: "Improve Platform performance and user experience" }),
          /* @__PURE__ */ jsx("li", { children: "Comply with legal obligations" })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "We do ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "not" }),
          " sell your personal data to third parties."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "4. Cookies & Tracking", children: [
        /* @__PURE__ */ jsx("p", { children: "We use essential cookies to maintain user sessions. We do not use third-party advertising cookies. You may disable cookies in your browser, but some features (e.g., staying logged in) may not work correctly." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "See our ",
          /* @__PURE__ */ jsx(Link, { to: "/cookie-policy", className: "text-blue-400 hover:underline", children: "Cookie Policy" }),
          " for full details."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "5. Data Sharing", children: [
        /* @__PURE__ */ jsx("p", { children: "We share data only with trusted service providers necessary to operate the Platform:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "MongoDB Atlas" }),
            " – Cloud database hosting"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Razorpay" }),
            " – Payment processing"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Vercel" }),
            " – Frontend and backend hosting"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Google" }),
            " – Google Sign-In (OAuth)"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "All providers are contractually bound to protect your data." })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "6. Data Retention", children: /* @__PURE__ */ jsx("p", { children: "We retain your account data for as long as your account is active. Certificates are retained indefinitely to support lifetime verification. You may request deletion of your account by emailing us." }) }),
      /* @__PURE__ */ jsxs(Section, { title: "7. Your Rights", children: [
        /* @__PURE__ */ jsx("p", { children: "You have the right to:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Access the personal data we hold about you" }),
          /* @__PURE__ */ jsx("li", { children: "Correct inaccurate information" }),
          /* @__PURE__ */ jsx("li", { children: "Request deletion of your account and associated data" }),
          /* @__PURE__ */ jsx("li", { children: "Object to or restrict processing of your data" }),
          /* @__PURE__ */ jsx("li", { children: "Receive a copy of your data in a portable format" })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "To exercise any right, email ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL }),
          ". We will respond within 30 days."
        ] })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "8. Security", children: /* @__PURE__ */ jsx("p", { children: "We implement industry-standard security measures including encrypted connections (HTTPS/TLS), hashed passwords (bcrypt), and access-controlled databases. However, no system is 100% secure — please use a strong, unique password." }) }),
      /* @__PURE__ */ jsx(Section, { title: "9. Children's Privacy", children: /* @__PURE__ */ jsx("p", { children: "Our Platform is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us personal data, please contact us and we will delete it promptly." }) }),
      /* @__PURE__ */ jsx(Section, { title: "10. Changes to This Policy", children: /* @__PURE__ */ jsx("p", { children: `We may update this policy periodically. We'll update the "Last updated" date at the top of this page. Continued use of the Platform after changes constitutes acceptance of the revised policy.` }) }),
      /* @__PURE__ */ jsxs(Section, { title: "11. Contact Us", children: [
        /* @__PURE__ */ jsx("p", { children: "If you have questions about this Privacy Policy, contact us:" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "📧 ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "🌐 ",
          /* @__PURE__ */ jsx("a", { href: `https://${SITE}`, className: "text-blue-400 hover:underline", children: SITE })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-blue-400 hover:underline", children: "Terms of Service →" }),
        /* @__PURE__ */ jsx(Link, { to: "/refund-policy", className: "text-blue-400 hover:underline", children: "Refund Policy →" }),
        /* @__PURE__ */ jsx(Link, { to: "/cookie-policy", className: "text-blue-400 hover:underline", children: "Cookie Policy →" })
      ] })
    ] })
  ] });
}
export {
  PrivacyPolicy as default
};
