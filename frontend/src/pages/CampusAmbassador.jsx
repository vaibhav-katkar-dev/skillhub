import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Gift,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MessageCircle,
  Rocket,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

const GMAIL_SUBJECT = encodeURIComponent('Campus Ambassador Application – SkillValix');
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
// Using Gmail web compose URL instead of mailto: for reliable cross-browser opening
const APPLY_GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=skillvalix%40gmail.com&su=${GMAIL_SUBJECT}&body=${GMAIL_BODY}`;

const WHATSAPP_LINK = 'https://chat.whatsapp.com/HxtxKbZCw39BNGzy7hXVSt?mode=gi_t';

const PERKS = [
  {
    icon: Trophy,
    title: 'Exclusive Prizes & Goodies',
    desc: 'Top ambassadors win premium swag kits, cash prizes, e-gift cards, and limited-edition SkillValix merch every month.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Award,
    title: 'Verified Ambassador Certificate',
    desc: 'A blockchain-verifiable SkillValix Campus Ambassador certificate that stands out on your LinkedIn profile.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Shoutout & Feature',
    desc: "Get featured on SkillValix's official LinkedIn with followers. Your name, college, and achievements — spotlighted.",
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: BookOpen,
    title: 'Free Premium Course Access',
    desc: 'Unlock all current and upcoming SkillValix premium courses — zero cost, full access, forever.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Lead Your Campus Community',
    desc: 'Host webinars, workshops, and hackathons at your college under the SkillValix brand. Build your own tribe.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Rocket,
    title: 'Early Access to Launches',
    desc: 'Be the first to experience new features, hackathons, and job simulations before they go live to the public.',
    color: 'from-purple-500 to-fuchsia-500',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Send Your Application',
    desc: 'Click "Apply Now", fill in the pre-loaded Gmail template, and hit send. Takes under 2 minutes.',
  },
  {
    num: '02',
    title: 'Get Onboarded',
    desc: "Our team reviews your application within 48 hours. Once approved, you'll receive your official welcome kit.",
  },
  {
    num: '03',
    title: 'Start Spreading the Word',
    desc: "Share SkillValix at your college, organize events, and bring your peers on board. We'll support you every step.",
  },
  {
    num: '04',
    title: 'Earn Rewards',
    desc: 'Hit milestones → unlock prizes. More referrals, more events, more impact = more goodies coming your way.',
  },
];

const FAQS = [
  {
    q: 'Who can apply to become a Campus Ambassador?',
    a: 'Any student currently enrolled in a college or university in India can apply. There is no GPA or branch requirement — just enthusiasm for learning and sharing knowledge.',
  },
  {
    q: 'Is there any cost involved?',
    a: 'Absolutely not. The Campus Ambassador Program is completely free. You earn rewards, we never charge you anything.',
  },
  {
    q: 'How much time do I need to commit?',
    a: "Around 2–5 hours per week depending on how active you want to be. There's no strict minimum — but the more you do, the more you earn.",
  },
  {
    q: 'Can there be multiple ambassadors from the same college?',
    a: "Yes! We encourage it. A team of ambassadors from the same college amplifies the impact. You'll all get individual recognition.",
  },
  {
    q: 'What happens after I apply?',
    a: "We'll review your application within 48 hours and reply to your email with next steps. Check your inbox (and spam just in case).",
  },
  {
    q: 'What do I do as a Campus Ambassador?',
    a: 'Share SkillValix courses & hackathons with your peers, organize mini workshops, post about us on LinkedIn/Instagram, and help students in your college upskill.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${open ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-200 bg-white'}`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-slate-900">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-indigo-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function CampusAmbassador() {
  return (
    <>
      <Helmet>
        <title>Campus Ambassador Program | SkillValix – Be the First at Your College</title>
        <meta
          name="description"
          content="Join the SkillValix Campus Ambassador Program. Represent SkillValix at your college, host events, earn exclusive prizes, a verified certificate, LinkedIn features, and free premium course access. Apply now via email."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.skillvalix.com/campus-ambassador" />

        {/* Open Graph */}
        <meta property="og:title" content="SkillValix Campus Ambassador Program – Apply Now" />
        <meta
          property="og:description"
          content="Become the first SkillValix Campus Ambassador at your college. Earn prizes, certificates, LinkedIn features & free premium courses."
        />
        <meta property="og:url" content="https://www.skillvalix.com/campus-ambassador" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SkillValix Campus Ambassador Program" />
        <meta
          name="twitter:description"
          content="Be the first SkillValix Campus Ambassador at your college. Exclusive prizes, certificates & community leadership await."
        />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOccupationalProgram',
          name: 'SkillValix Campus Ambassador Program',
          description: 'A student-led campus ambassador initiative by SkillValix that rewards college students for spreading digital skills education across India.',
          url: 'https://www.skillvalix.com/campus-ambassador',
          provider: {
            '@type': 'Organization',
            name: 'SkillValix',
            url: 'https://www.skillvalix.com',
          },
          educationalProgramMode: 'online',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
          },
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 40%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.2) 0%, transparent 45%), radial-gradient(circle at 60% 80%, rgba(251,191,36,0.1) 0%, transparent 40%)',
          }}
          aria-hidden="true"
        />

        {/* Animated orbs */}
        <div className="absolute top-16 left-10 w-56 h-56 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-16 right-10 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6">
            <Star className="w-3.5 h-3.5 fill-current" />
            Limited Spots Available
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Become the First{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
              SkillValix
            </span>
            <br />
            Campus Ambassador
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl text-slate-300">at Your College</span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Represent SkillValix, empower your peers, host events, and unlock{' '}
            <span className="text-white font-semibold">exclusive prizes, certificates, LinkedIn features</span>{' '}
            & free premium courses — all while building a rockstar resume.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={APPLY_GMAIL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-base shadow-2xl shadow-indigo-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Mail className="w-5 h-5" />
              Apply Now — It's Free
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base transition-colors"
            >
              How It Works
            </a>
          </div>

          {/* Quick proof badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              { icon: Gift, label: 'Monthly Prizes' },
              { icon: Shield, label: 'Verified Certificate' },
              { icon: Globe, label: 'Pan-India Community' },
              { icon: Zap, label: '48h Onboarding' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-slate-200 text-sm font-semibold"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-300" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-slate-50 px-6 py-20" aria-labelledby="perks-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 id="perks-heading" className="text-3xl sm:text-4xl font-black text-slate-900">
              What You Get as an Ambassador
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Real rewards for real impact. No fluff — just value stacked upon value.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-white px-6 py-20" aria-labelledby="steps-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 id="steps-heading" className="text-3xl sm:text-4xl font-black text-slate-900">
              How It Works
            </h2>
            <p className="text-slate-500 mt-3">Four simple steps. Zero gatekeeping.</p>
          </div>

          <div className="space-y-6">
            {STEPS.map(({ num, title, desc }, idx) => (
              <div
                key={num}
                className="flex gap-5 items-start rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                  {num}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <GraduationCap className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Be the Change-Maker <br />at Your Campus
          </h2>
          <p className="text-indigo-200 mt-4 text-base max-w-lg mx-auto leading-relaxed">
            Click the button below — it opens a pre-filled Gmail draft. Just add your details and hit send. Our team responds within 48 hours.
          </p>
          <a
            href={APPLY_GMAIL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-indigo-700 font-black text-base hover:bg-indigo-50 transition-colors shadow-2xl shadow-indigo-900/40 hover:scale-105 active:scale-95 duration-200"
          >
            <Mail className="w-5 h-5" />
            Apply via Gmail
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
          <p className="mt-4 text-indigo-300 text-xs">
            Or email us directly at{' '}
            <a href="mailto:skillvalix@gmail.com" className="underline hover:text-white">
              skillvalix@gmail.com
            </a>{' '}
            with subject "Campus Ambassador Application"
          </p>
        </div>
      </section>

      {/* ── What top ambassadors do ── */}
      <section className="bg-slate-50 px-6 py-20" aria-labelledby="responsibilities-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="responsibilities-heading" className="text-3xl font-black text-slate-900">
              What Top Ambassadors Do
            </h2>
            <p className="text-slate-500 mt-2">These are the moves that unlock maximum rewards.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Share SkillValix courses with classmates and batch-mates',
              'Post about hackathons & certifications on LinkedIn & Instagram',
              'Organize mini workshops or coding sessions at your college',
              'Onboard the most new students from their campus each month',
              'Participate in SkillValix hackathons and invite teammates',
              'Create short reels or posts about their learning journey',
              'Represent SkillValix in college tech fests & events',
              'Provide feedback to help SkillValix improve its platform',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="bg-white px-6 py-20" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 mt-2">Everything you need to know before applying.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-6">
            <Zap className="w-3.5 h-3.5" />
            Limited college spots open
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to Lead? <br />
            <span className="text-indigo-400">Apply in 2 Minutes.</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-md mx-auto">
            Your college. Your community. Your prizes. The first ambassador at your campus gets a special founding badge — don't miss it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={APPLY_GMAIL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-base shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Mail className="w-5 h-5" />
              Apply Now — It's Free
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-emerald-600/50 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-300 font-bold text-base transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp for Updates
            </a>
          </div>
          <p className="mt-6 text-slate-600 text-xs">
            Already applied?{' '}
            <a href="mailto:skillvalix@gmail.com" className="text-indigo-400 hover:text-indigo-300 underline">
              Email us
            </a>{' '}
            to check your status.
          </p>
        </div>
      </section>
    </>
  );
}
