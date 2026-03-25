import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'March 25, 2026';
const COMPANY     = 'SkillHub (SkillValix Learning Platform)';
const SITE        = 'www.skillvalix.com';
const EMAIL       = 'support@skillvalix.com';

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

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – SkillHub</title>
        <meta name="description" content="Read SkillHub's Privacy Policy to understand how we collect, use, and protect your personal data." />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: <span className="text-slate-300">{LAST_UPDATED}</span></p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl">
            Your privacy is important to us. This policy explains what data we collect, why we collect it,
            and how we protect it. By using {SITE} you agree to the practices described below.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <Section title="1. Who We Are">
          <p>{COMPANY} operates the website <strong className="text-slate-300">{SITE}</strong> ("Platform"). We are the data controller for information collected through the Platform.</p>
          <p>Contact us at: <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a></p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong className="text-slate-300">Account Data:</strong> Name, email address, and password (hashed) when you register.</p>
          <p><strong className="text-slate-300">Profile & Course Data:</strong> Courses enrolled, lessons completed, exam scores, and certificates issued.</p>
          <p><strong className="text-slate-300">Payment Data:</strong> Payment amounts and order IDs via Razorpay. We do not store full card numbers — Razorpay handles PCI-compliant payment processing.</p>
          <p><strong className="text-slate-300">Usage Data:</strong> Browser type, IP address, pages visited, and time spent — collected automatically via server logs.</p>
          <p><strong className="text-slate-300">Communications:</strong> Emails you send us or that we send you (e.g., password reset, certificates).</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use collected data to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create and manage your account and course progress</li>
            <li>Issue and verify certificates of completion</li>
            <li>Process exam payments and provide lifetime access</li>
            <li>Send transactional emails (password reset, receipts)</li>
            <li>Improve Platform performance and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We do <strong className="text-slate-300">not</strong> sell your personal data to third parties.</p>
        </Section>

        <Section title="4. Cookies & Tracking">
          <p>We use essential cookies to maintain user sessions. We do not use third-party advertising cookies. You may disable cookies in your browser, but some features (e.g., staying logged in) may not work correctly.</p>
          <p>See our <Link to="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy</Link> for full details.</p>
        </Section>

        <Section title="5. Data Sharing">
          <p>We share data only with trusted service providers necessary to operate the Platform:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-slate-300">MongoDB Atlas</strong> – Cloud database hosting</li>
            <li><strong className="text-slate-300">Razorpay</strong> – Payment processing</li>
            <li><strong className="text-slate-300">Vercel</strong> – Frontend and backend hosting</li>
            <li><strong className="text-slate-300">Google</strong> – Google Sign-In (OAuth)</li>
          </ul>
          <p>All providers are contractually bound to protect your data.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your account data for as long as your account is active. Certificates are retained indefinitely to support lifetime verification. You may request deletion of your account by emailing us.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Receive a copy of your data in a portable format</li>
          </ul>
          <p>To exercise any right, email <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="8. Security">
          <p>We implement industry-standard security measures including encrypted connections (HTTPS/TLS), hashed passwords (bcrypt), and access-controlled databases. However, no system is 100% secure — please use a strong, unique password.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>Our Platform is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us personal data, please contact us and we will delete it promptly.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this policy periodically. We'll update the "Last updated" date at the top of this page. Continued use of the Platform after changes constitutes acceptance of the revised policy.</p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have questions about this Privacy Policy, contact us:</p>
          <p>📧 <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a></p>
          <p>🌐 <a href={`https://${SITE}`} className="text-blue-400 hover:underline">{SITE}</a></p>
        </Section>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm">
          <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service →</Link>
          <Link to="/refund-policy" className="text-blue-400 hover:underline">Refund Policy →</Link>
          <Link to="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy →</Link>
        </div>
      </div>
    </>
  );
}
