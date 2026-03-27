import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RotateCcw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'March 25, 2026';
const EMAIL       = 'support@skillvalix.com';
const SITE        = 'www.skillvalix.com';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <ChevronRight className="w-5 h-5 text-blue-400 shrink-0" />
      {title}
    </h2>
    <div className="space-y-3 text-slate-400 text-sm leading-relaxed pl-7">
      {children}
    </div>
  </section>
);

const Badge = ({ color, label }) => {
  const styles = {
    green:  'bg-green-500/10 border-green-500/30 text-green-400',
    red:    'bg-red-500/10 border-red-500/30 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  };
  return (
    <span className={`inline-block border rounded-full px-3 py-0.5 text-xs font-semibold ${styles[color]}`}>
      {label}
    </span>
  );
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Helmet>
        <title>Refund Policy | SkillValix</title>
        <meta name="description" content="Understand SkillValix refund policy for exam access payments, including when refunds apply and how to request one." />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl">
              <RotateCcw className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Refund Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: <span className="text-slate-300">{LAST_UPDATED}</span></p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl">
            We want you to be completely satisfied with your purchase. This policy outlines when
            refunds are available for paid features on {SITE}.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Quick overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { color: 'green', icon: '✅', title: 'Eligible for Refund', desc: 'Technical failure prevents exam access after payment' },
            { color: 'green', icon: '✅', title: 'Eligible for Refund', desc: 'Duplicate charge or payment error on our side' },
            { color: 'red',   icon: '❌', title: 'Not Eligible', desc: 'Exam already attempted or certificate already issued' },
          ].map((c, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-2xl">{c.icon}</div>
              <Badge color={c.color} label={c.title} />
              <p className="text-slate-400 text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <Section title="1. What Requires Payment">
          <p>Course content on SkillValix is <strong className="text-slate-300">free to access</strong>. Only the <strong className="text-slate-300">Certification Exam</strong> for each course requires a one-time payment.</p>
          <p>This payment grants you <strong className="text-slate-300">lifetime access</strong> to that course's exam with unlimited retakes until you pass and earn your certificate.</p>
        </Section>

        <Section title="2. Our Refund Window">
          <p>Refund requests must be submitted within <strong className="text-slate-300">7 days</strong> of the payment date.</p>
          <p>After 7 days, payments are non-refundable regardless of circumstance.</p>
        </Section>

        <Section title="3. When You're Eligible for a Refund">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-300">Technical failure:</strong> You were charged but exam access was not granted due to a platform-side error, and we are unable to resolve it within 48 hours.
            </li>
            <li>
              <strong className="text-slate-300">Duplicate charge:</strong> You were charged more than once for the same course exam.
            </li>
            <li>
              <strong className="text-slate-300">Payment not reflected:</strong> Your Razorpay transaction succeeded but exam access was never unlocked, and the issue persists after contacting support.
            </li>
          </ul>
        </Section>

        <Section title="4. When You're NOT Eligible for a Refund">
          <ul className="list-disc pl-5 space-y-2">
            <li>You have already attempted the exam at least once after payment</li>
            <li>A certificate of completion has already been issued to you for that course</li>
            <li>You changed your mind after a successful payment with full access granted</li>
            <li>You failed the exam and want a refund — you still retain lifetime retake access</li>
            <li>The refund request was made after 7 days of payment</li>
          </ul>
        </Section>

        <Section title="5. How to Request a Refund">
          <p>Email us at <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a> with the subject line <strong className="text-slate-300">"Refund Request – [Your Course Name]"</strong> and include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your registered email address</li>
            <li>The course name for which you paid</li>
            <li>Your Razorpay payment ID or screenshot of the transaction</li>
            <li>A brief description of the issue</li>
          </ul>
          <p>We will respond within <strong className="text-slate-300">3 business days</strong>.</p>
        </Section>

        <Section title="6. Refund Processing Time">
          <p>Approved refunds are processed back to your original payment method via Razorpay within <strong className="text-slate-300">5–10 business days</strong>, depending on your bank or card issuer.</p>
        </Section>

        <Section title="7. Chargebacks">
          <p>If you initiate a chargeback without first contacting us, we reserve the right to suspend your account pending investigation. We encourage you to reach out to us first — we are happy to help resolve any payment issues quickly.</p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>We may update this Refund Policy at any time. The latest version will always be available at {SITE}/refund-policy.</p>
        </Section>

        <Section title="9. Contact">
          <p>📧 <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a></p>
          <p>Please allow up to 3 business days for a response.</p>
        </Section>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy →</Link>
          <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service →</Link>
          <Link to="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy →</Link>
        </div>
      </div>
    </div>
  );
}
