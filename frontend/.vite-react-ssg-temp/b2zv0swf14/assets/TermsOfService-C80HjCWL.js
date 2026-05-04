import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Helmet } from "react-helmet-async";
import { FileText, ChevronRight } from "lucide-react";
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
function TermsOfService() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-950", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Terms of Service | SkillValix" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Read SkillValix Terms of Service, including the rules and guidelines for using our learning platform."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6 text-blue-400" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-blue-400", children: "Legal" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white mb-3", children: "Terms of Service" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-400 text-sm", children: [
        "Last updated: ",
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: LAST_UPDATED })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl", children: [
        "By accessing or using ",
        SITE,
        ' ("Platform"), you agree to be bound by these terms. Please read them carefully. If you do not agree, please do not use our platform.'
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14", children: [
      /* @__PURE__ */ jsx(Section, { title: "1. Acceptance of Terms", children: /* @__PURE__ */ jsxs("p", { children: [
        "By creating an account or using any part of the platform, you confirm that you are at least 13 years old, agree to these terms, and agree to our ",
        /* @__PURE__ */ jsx(Link, { to: "/privacy-policy", className: "text-blue-400 hover:underline", children: "Privacy Policy" }),
        "."
      ] }) }),
      /* @__PURE__ */ jsxs(Section, { title: "2. Account Registration", children: [
        /* @__PURE__ */ jsx("p", { children: "You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "You must notify us immediately at ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL }),
          " if you suspect unauthorised access to your account."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "3. Platform Access and Courses", children: [
        /* @__PURE__ */ jsx("p", { children: "Unless stated otherwise, all course lessons and learning materials on SkillValix are provided free of charge." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Certain features, such as ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "certification exams" }),
          ", require a one-time per-course payment. Once paid, you receive lifetime access to retake that course exam until you pass."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "We reserve the right to modify, suspend, or discontinue any part of the platform at any time." })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "4. Certificates", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Certificates of completion are issued after you pass the relevant course exam. Each certificate carries a unique ID and can be publicly verified at ",
          SITE,
          "/verify."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Certificates represent completion of the course as defined on our platform and do not constitute formal academic or professional qualifications unless explicitly stated." }),
        /* @__PURE__ */ jsx("p", { children: "Attempting to forge, misrepresent, or fraudulently obtain a certificate is strictly prohibited and may result in account termination and legal action." })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "5. Payments and Refunds", children: [
        /* @__PURE__ */ jsx("p", { children: "All payments are processed securely through Razorpay. By making a payment, you agree to Razorpay terms as well." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Please refer to our ",
          /* @__PURE__ */ jsx(Link, { to: "/refund-policy", className: "text-blue-400 hover:underline", children: "Refund Policy" }),
          " for details on when refunds are available."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "6. Prohibited Conduct", children: [
        /* @__PURE__ */ jsx("p", { children: "You agree not to:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Share your account credentials with others" }),
          /* @__PURE__ */ jsx("li", { children: "Use automated tools to scrape, copy, or download course content" }),
          /* @__PURE__ */ jsx("li", { children: "Distribute our course materials without written permission" }),
          /* @__PURE__ */ jsx("li", { children: "Attempt to reverse-engineer, hack, or disrupt the platform" }),
          /* @__PURE__ */ jsx("li", { children: "Post inaccurate, abusive, or illegal content" }),
          /* @__PURE__ */ jsx("li", { children: "Use the platform for any unlawful purpose" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Violations may result in immediate account suspension or termination without refund." })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "7. Intellectual Property", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "All content on the platform, including course videos, text, images, and code, is owned by or licensed to ",
          COMPANY,
          ". You may not reproduce, republish, distribute, or create derivative works without our express written consent."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "You retain ownership of any content you submit to us. By submitting it, you grant us a limited licence to use it to operate the platform." })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "8. Third-Party Links and Services", children: /* @__PURE__ */ jsx("p", { children: "The platform may contain links to third-party websites. We are not responsible for the content or practices of those sites. Your interactions with third-party services are governed by their respective terms." }) }),
      /* @__PURE__ */ jsx(Section, { title: "9. Disclaimer of Warranties", children: /* @__PURE__ */ jsxs("p", { children: [
        "The platform is provided on an ",
        /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: '"as is" and "as available"' }),
        " basis without warranties of any kind, express or implied. We do not guarantee the platform will be error-free, uninterrupted, or free from viruses."
      ] }) }),
      /* @__PURE__ */ jsxs(Section, { title: "10. Limitation of Liability", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "To the maximum extent permitted by law, ",
          COMPANY,
          " shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, even if we have been advised of the possibility of such damages."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim." })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "11. Governing Law", children: /* @__PURE__ */ jsx("p", { children: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India." }) }),
      /* @__PURE__ */ jsx(Section, { title: "12. Changes to Terms", children: /* @__PURE__ */ jsx("p", { children: 'We may update these terms at any time. The "Last updated" date at the top of this page will reflect the change. Continued use of the platform constitutes your acceptance of the updated terms.' }) }),
      /* @__PURE__ */ jsx(Section, { title: "13. Contact", children: /* @__PURE__ */ jsxs("p", { children: [
        "Questions? Contact us at ",
        /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy-policy", className: "text-blue-400 hover:underline", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { to: "/refund-policy", className: "text-blue-400 hover:underline", children: "Refund Policy" }),
        /* @__PURE__ */ jsx(Link, { to: "/cookie-policy", className: "text-blue-400 hover:underline", children: "Cookie Policy" })
      ] })
    ] })
  ] });
}
export {
  TermsOfService as default
};
