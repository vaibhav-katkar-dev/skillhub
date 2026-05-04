import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Star, Mail, ExternalLink, Gift, Shield, Globe, Zap, Trophy, Award, Linkedin, BookOpen, Users, Rocket, GraduationCap, CheckCircle2, MessageCircle, ChevronDown } from "lucide-react";
const GMAIL_SUBJECT = encodeURIComponent("Campus Ambassador Application – SkillValix");
const GMAIL_BODY = encodeURIComponent(
  `Hi SkillValix Team,

I'd like to apply to be a Campus Ambassador at my college.

Full Name:
College / University:
City & State:
LinkedIn Profile:
Instagram Handle (optional):
Why do you want to be a SkillValix Campus Ambassador?

Looking forward to hearing from you!`
);
const APPLY_GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=skillvalix%40gmail.com&su=${GMAIL_SUBJECT}&body=${GMAIL_BODY}`;
const WHATSAPP_LINK = "https://chat.whatsapp.com/HxtxKbZCw39BNGzy7hXVSt?mode=gi_t";
const PERKS = [
  {
    icon: Trophy,
    title: "Exclusive Prizes & Goodies",
    desc: "Top ambassadors win premium swag kits, cash prizes, e-gift cards, and limited-edition SkillValix merch every month.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Award,
    title: "Verified Ambassador Certificate",
    desc: "A blockchain-verifiable SkillValix Campus Ambassador certificate that stands out on your LinkedIn profile.",
    color: "from-indigo-500 to-violet-500"
  },
  {
    icon: Linkedin,
    title: "LinkedIn Shoutout & Feature",
    desc: "Get featured on SkillValix's official LinkedIn with followers. Your name, college, and achievements — spotlighted.",
    color: "from-sky-500 to-blue-600"
  },
  {
    icon: BookOpen,
    title: "Free Premium Course Access",
    desc: "Unlock all current and upcoming SkillValix premium courses — zero cost, full access, forever.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Users,
    title: "Lead Your Campus Community",
    desc: "Host webinars, workshops, and hackathons at your college under the SkillValix brand. Build your own tribe.",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: Rocket,
    title: "Early Access to Launches",
    desc: "Be the first to experience new features, hackathons, and job simulations before they go live to the public.",
    color: "from-purple-500 to-fuchsia-500"
  }
];
const STEPS = [
  {
    num: "01",
    title: "Send Your Application",
    desc: 'Click "Apply Now", fill in the pre-loaded Gmail template, and hit send. Takes under 2 minutes.'
  },
  {
    num: "02",
    title: "Get Onboarded",
    desc: "Our team reviews your application within 48 hours. Once approved, you'll receive your official welcome kit."
  },
  {
    num: "03",
    title: "Start Spreading the Word",
    desc: "Share SkillValix at your college, organize events, and bring your peers on board. We'll support you every step."
  },
  {
    num: "04",
    title: "Earn Rewards",
    desc: "Hit milestones → unlock prizes. More referrals, more events, more impact = more goodies coming your way."
  }
];
const FAQS = [
  {
    q: "Who can apply to become a Campus Ambassador?",
    a: "Any student currently enrolled in a college or university in India can apply. There is no GPA or branch requirement — just enthusiasm for learning and sharing knowledge."
  },
  {
    q: "Is there any cost involved?",
    a: "Absolutely not. The Campus Ambassador Program is completely free. You earn rewards, we never charge you anything."
  },
  {
    q: "How much time do I need to commit?",
    a: "Around 2–5 hours per week depending on how active you want to be. There's no strict minimum — but the more you do, the more you earn."
  },
  {
    q: "Can there be multiple ambassadors from the same college?",
    a: "Yes! We encourage it. A team of ambassadors from the same college amplifies the impact. You'll all get individual recognition."
  },
  {
    q: "What happens after I apply?",
    a: "We'll review your application within 48 hours and reply to your email with next steps. Check your inbox (and spam just in case)."
  },
  {
    q: "What do I do as a Campus Ambassador?",
    a: "Share SkillValix courses & hackathons with your peers, organize mini workshops, post about us on LinkedIn/Instagram, and help students in your college upskill."
  }
];
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `rounded-2xl border transition-all duration-200 ${open ? "border-indigo-200 bg-indigo-50/50" : "border-slate-200 bg-white"}`,
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "w-full flex items-center justify-between gap-4 px-6 py-5 text-left",
            onClick: () => setOpen(!open),
            "aria-expanded": open,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: q }),
              /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: `w-4 h-4 text-indigo-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsx("div", { className: "px-6 pb-5", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: a }) })
      ]
    }
  );
}
function CampusAmbassador() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Campus Ambassador Program | SkillValix – Be the First at Your College" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Join the SkillValix Campus Ambassador Program. Represent SkillValix at your college, host events, earn exclusive prizes, a verified certificate, LinkedIn features, and free premium course access. Apply now via email."
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.skillvalix.com/campus-ambassador" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "SkillValix Campus Ambassador Program – Apply Now" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Become the first SkillValix Campus Ambassador at your college. Earn prizes, certificates, LinkedIn features & free premium courses."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://www.skillvalix.com/campus-ambassador" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "SkillValix Campus Ambassador Program" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "twitter:description",
          content: "Be the first SkillValix Campus Ambassador at your college. Exclusive prizes, certificates & community leadership await."
        }
      ),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: "SkillValix Campus Ambassador Program",
        description: "A student-led campus ambassador initiative by SkillValix that rewards college students for spreading digital skills education across India.",
        url: "https://www.skillvalix.com/campus-ambassador",
        provider: {
          "@type": "Organization",
          name: "SkillValix",
          url: "https://www.skillvalix.com"
        },
        educationalProgramMode: "online",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR"
        }
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 px-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 pointer-events-none",
          style: {
            backgroundImage: "radial-gradient(circle at 20% 40%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.2) 0%, transparent 45%), radial-gradient(circle at 60% 80%, rgba(251,191,36,0.1) 0%, transparent 40%)"
          },
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute top-16 left-10 w-56 h-56 rounded-full bg-indigo-600/10 blur-3xl animate-pulse", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-16 right-10 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl animate-pulse", style: { animationDelay: "1s" }, "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-5xl mx-auto text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current" }),
          "Limited Spots Available"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight", children: [
          "Become the First",
          " ",
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent", children: "SkillValix" }),
          /* @__PURE__ */ jsx("br", {}),
          "Campus Ambassador",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-3xl sm:text-4xl md:text-5xl text-slate-300", children: "at Your College" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed", children: [
          "Represent SkillValix, empower your peers, host events, and unlock",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "exclusive prizes, certificates, LinkedIn features" }),
          " ",
          "& free premium courses — all while building a rockstar resume."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: APPLY_GMAIL,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-base shadow-2xl shadow-indigo-500/40 transition-all duration-200 hover:scale-105 active:scale-95",
              children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
                "Apply Now — It's Free",
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 opacity-70 group-hover:opacity-100" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#how-it-works",
              className: "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base transition-colors",
              children: "How It Works"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 flex flex-wrap justify-center gap-4", children: [
          { icon: Gift, label: "Monthly Prizes" },
          { icon: Shield, label: "Verified Certificate" },
          { icon: Globe, label: "Pan-India Community" },
          { icon: Zap, label: "48h Onboarding" }
        ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-slate-200 text-sm font-semibold",
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5 text-indigo-300" }),
              label
            ]
          },
          label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-slate-50 px-6 py-20", "aria-labelledby": "perks-heading", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsx("h2", { id: "perks-heading", className: "text-3xl sm:text-4xl font-black text-slate-900", children: "What You Get as an Ambassador" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-3 max-w-xl mx-auto", children: "Real rewards for real impact. No fluff — just value stacked upon value." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: PERKS.map(({ icon: Icon, title, desc, color }) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1",
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-black text-slate-900 mb-2", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 leading-relaxed", children: desc })
          ]
        },
        title
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "how-it-works", className: "bg-white px-6 py-20", "aria-labelledby": "steps-heading", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsx("h2", { id: "steps-heading", className: "text-3xl sm:text-4xl font-black text-slate-900", children: "How It Works" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-3", children: "Four simple steps. Zero gatekeeping." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: STEPS.map(({ num, title, desc }, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex gap-5 items-start rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors",
          children: [
            /* @__PURE__ */ jsx("div", { className: "shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg", children: num }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-slate-900 mb-1", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 leading-relaxed", children: desc })
            ] })
          ]
        },
        num
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-6 py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx(GraduationCap, { className: "w-12 h-12 text-indigo-200 mx-auto mb-4" }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl sm:text-4xl font-black text-white leading-tight", children: [
        "Be the Change-Maker ",
        /* @__PURE__ */ jsx("br", {}),
        "at Your Campus"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-indigo-200 mt-4 text-base max-w-lg mx-auto leading-relaxed", children: "Click the button below — it opens a pre-filled Gmail draft. Just add your details and hit send. Our team responds within 48 hours." }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: APPLY_GMAIL,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "mt-8 inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-indigo-700 font-black text-base hover:bg-indigo-50 transition-colors shadow-2xl shadow-indigo-900/40 hover:scale-105 active:scale-95 duration-200",
          children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
            "Apply via Gmail",
            /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 opacity-60" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-indigo-300 text-xs", children: [
        "Or email us directly at",
        " ",
        /* @__PURE__ */ jsx("a", { href: "mailto:skillvalix@gmail.com", className: "underline hover:text-white", children: "skillvalix@gmail.com" }),
        " ",
        'with subject "Campus Ambassador Application"'
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-slate-50 px-6 py-20", "aria-labelledby": "responsibilities-heading", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { id: "responsibilities-heading", className: "text-3xl font-black text-slate-900", children: "What Top Ambassadors Do" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-2", children: "These are the moves that unlock maximum rewards." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        "Share SkillValix courses with classmates and batch-mates",
        "Post about hackathons & certifications on LinkedIn & Instagram",
        "Organize mini workshops or coding sessions at your college",
        "Onboard the most new students from their campus each month",
        "Participate in SkillValix hackathons and invite teammates",
        "Create short reels or posts about their learning journey",
        "Represent SkillValix in college tech fests & events",
        "Provide feedback to help SkillValix improve its platform"
      ].map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700", children: item })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-white px-6 py-20", "aria-labelledby": "faq-heading", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { id: "faq-heading", className: "text-3xl font-black text-slate-900", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-2", children: "Everything you need to know before applying." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: FAQS.map((faq) => /* @__PURE__ */ jsx(FaqItem, { q: faq.q, a: faq.a }, faq.q)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-slate-900 px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-6", children: [
        /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5" }),
        "Limited college spots open"
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl sm:text-4xl font-black text-white", children: [
        "Ready to Lead? ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-indigo-400", children: "Apply in 2 Minutes." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 mt-4 max-w-md mx-auto", children: "Your college. Your community. Your prizes. The first ambassador at your campus gets a special founding badge — don't miss it." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-4 justify-center", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: APPLY_GMAIL,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-base shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95",
            children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
              "Apply Now — It's Free"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: WHATSAPP_LINK,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-emerald-600/50 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-300 font-bold text-base transition-colors",
            children: [
              /* @__PURE__ */ jsx(MessageCircle, { className: "w-5 h-5" }),
              "Join WhatsApp for Updates"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-slate-600 text-xs", children: [
        "Already applied?",
        " ",
        /* @__PURE__ */ jsx("a", { href: "mailto:skillvalix@gmail.com", className: "text-indigo-400 hover:text-indigo-300 underline", children: "Email us" }),
        " ",
        "to check your status."
      ] })
    ] }) })
  ] });
}
export {
  CampusAmbassador as default
};
