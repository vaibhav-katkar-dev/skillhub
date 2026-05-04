import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Helmet } from "react-helmet-async";
import { RotateCcw, ChevronRight } from "lucide-react";
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
const Badge = ({ color, label }) => {
  const styles = {
    green: "bg-green-500/10 border-green-500/30 text-green-400",
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-block border rounded-full px-3 py-0.5 text-xs font-semibold ${styles[color]}`, children: label });
};
function RefundPolicy() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-950", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Refund Policy | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Understand SkillValix refund policy for exam access payments, including when refunds apply and how to request one." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-6 h-6 text-blue-400" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-blue-400", children: "Legal" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white mb-3", children: "Refund Policy" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-400 text-sm", children: [
        "Last updated: ",
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: LAST_UPDATED })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl", children: [
        "We want you to be completely satisfied with your purchase. This policy outlines when refunds are available for paid features on ",
        SITE,
        "."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12", children: [
        { color: "green", icon: "✅", title: "Eligible for Refund", desc: "Technical failure prevents exam access after payment" },
        { color: "green", icon: "✅", title: "Eligible for Refund", desc: "Duplicate charge or payment error on our side" },
        { color: "red", icon: "❌", title: "Not Eligible", desc: "Exam already attempted or certificate already issued" }
      ].map((c, i) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl", children: c.icon }),
        /* @__PURE__ */ jsx(Badge, { color: c.color, label: c.title }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-xs leading-relaxed", children: c.desc })
      ] }, i)) }),
      /* @__PURE__ */ jsxs(Section, { title: "1. What Requires Payment", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Course content on SkillValix is ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "free to access" }),
          ". Only the ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Certification Exam" }),
          " for each course requires a one-time payment."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "This payment grants you ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "lifetime access" }),
          " to that course's exam with unlimited retakes until you pass and earn your certificate."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "2. Our Refund Window", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Refund requests must be submitted within ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "7 days" }),
          " of the payment date."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "After 7 days, payments are non-refundable regardless of circumstance." })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "3. When You're Eligible for a Refund", children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Technical failure:" }),
          " You were charged but exam access was not granted due to a platform-side error, and we are unable to resolve it within 48 hours."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Duplicate charge:" }),
          " You were charged more than once for the same course exam."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "Payment not reflected:" }),
          " Your Razorpay transaction succeeded but exam access was never unlocked, and the issue persists after contacting support."
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Section, { title: "4. When You're NOT Eligible for a Refund", children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
        /* @__PURE__ */ jsx("li", { children: "You have already attempted the exam at least once after payment" }),
        /* @__PURE__ */ jsx("li", { children: "A certificate of completion has already been issued to you for that course" }),
        /* @__PURE__ */ jsx("li", { children: "You changed your mind after a successful payment with full access granted" }),
        /* @__PURE__ */ jsx("li", { children: "You failed the exam and want a refund — you still retain lifetime retake access" }),
        /* @__PURE__ */ jsx("li", { children: "The refund request was made after 7 days of payment" })
      ] }) }),
      /* @__PURE__ */ jsxs(Section, { title: "5. How to Request a Refund", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Email us at ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL }),
          " with the subject line ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: '"Refund Request – [Your Course Name]"' }),
          " and include:"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Your registered email address" }),
          /* @__PURE__ */ jsx("li", { children: "The course name for which you paid" }),
          /* @__PURE__ */ jsx("li", { children: "Your Razorpay payment ID or screenshot of the transaction" }),
          /* @__PURE__ */ jsx("li", { children: "A brief description of the issue" })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "We will respond within ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "3 business days" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "6. Refund Processing Time", children: /* @__PURE__ */ jsxs("p", { children: [
        "Approved refunds are processed back to your original payment method via Razorpay within ",
        /* @__PURE__ */ jsx("strong", { className: "text-slate-300", children: "5–10 business days" }),
        ", depending on your bank or card issuer."
      ] }) }),
      /* @__PURE__ */ jsx(Section, { title: "7. Chargebacks", children: /* @__PURE__ */ jsx("p", { children: "If you initiate a chargeback without first contacting us, we reserve the right to suspend your account pending investigation. We encourage you to reach out to us first — we are happy to help resolve any payment issues quickly." }) }),
      /* @__PURE__ */ jsx(Section, { title: "8. Changes to This Policy", children: /* @__PURE__ */ jsxs("p", { children: [
        "We may update this Refund Policy at any time. The latest version will always be available at ",
        SITE,
        "/refund-policy."
      ] }) }),
      /* @__PURE__ */ jsxs(Section, { title: "9. Contact", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "📧 ",
          /* @__PURE__ */ jsx("a", { href: `mailto:${EMAIL}`, className: "text-blue-400 hover:underline", children: EMAIL })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Please allow up to 3 business days for a response." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy-policy", className: "text-blue-400 hover:underline", children: "Privacy Policy →" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-blue-400 hover:underline", children: "Terms of Service →" }),
        /* @__PURE__ */ jsx(Link, { to: "/cookie-policy", className: "text-blue-400 hover:underline", children: "Cookie Policy →" })
      ] })
    ] })
  ] });
}
export {
  RefundPolicy as default
};
