import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Cookie, ChevronRight } from 'lucide-react';
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

const CookieTable = ({ rows }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-800 mt-3">
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
        <tr>
          {['Cookie Name', 'Purpose', 'Duration', 'Type'].map(h => (
            <th key={h} className="px-4 py-3 font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {rows.map((r, i) => (
          <tr key={i} className="bg-slate-950 hover:bg-slate-900/60 transition-colors">
            <td className="px-4 py-3 font-mono text-xs text-blue-300">{r.name}</td>
            <td className="px-4 py-3 text-slate-400">{r.purpose}</td>
            <td className="px-4 py-3 text-slate-500">{r.duration}</td>
            <td className="px-4 py-3">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                r.type === 'Essential'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}>{r.type}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function CookiePolicy() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy – SkillHub</title>
        <meta name="description" content="Learn how SkillHub uses cookies — what they are, which ones we use, and how you can control them." />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl">
              <Cookie className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Cookie Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: <span className="text-slate-300">{LAST_UPDATED}</span></p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl">
            This policy explains what cookies are, how we use them on {SITE}, and your choices regarding cookies.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <Section title="1. What Are Cookies?">
          <p>Cookies are small text files placed on your device by a website when you visit it. They help websites remember your preferences, keep you signed in, and understand how you use the site.</p>
          <p>Cookies are not programs — they cannot carry viruses or install malware on your device.</p>
        </Section>

        <Section title="2. Types of Cookies We Use">
          <p>We keep our cookie usage minimal and purposeful. We use only <strong className="text-slate-300">Essential</strong> cookies required to operate the Platform.</p>

          <CookieTable rows={[
            {
              name: 'auth_token',
              purpose: 'Keeps you securely logged in to your account (JWT session token)',
              duration: 'Session / 7 days',
              type: 'Essential',
            },
            {
              name: 'skillhub_pref',
              purpose: 'Remembers lightweight UI preferences (e.g., last visited course)',
              duration: '30 days',
              type: 'Essential',
            },
            {
              name: '__razorpay_*',
              purpose: 'Set by Razorpay to process payments securely; we do not read these',
              duration: 'Session',
              type: 'Essential',
            },
            {
              name: 'g_state',
              purpose: 'Set by Google Sign-In to manage OAuth login flow',
              duration: 'Session',
              type: 'Essential',
            },
          ]} />
        </Section>

        <Section title="3. What We Do NOT Use">
          <p>We <strong className="text-slate-300">do not</strong> use:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Advertising or tracking cookies</li>
            <li>Third-party analytics cookies (e.g., Google Analytics)</li>
            <li>Social media tracking pixels</li>
            <li>Cross-site behavioural profiling</li>
          </ul>
        </Section>

        <Section title="4. How to Control Cookies">
          <p>You can control and delete cookies through your browser settings:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-slate-300">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong className="text-slate-300">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong className="text-slate-300">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong className="text-slate-300">Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>
          <p className="mt-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-yellow-300/80">
            ⚠️ Disabling cookies may prevent you from staying logged in or completing payments on the Platform.
          </p>
        </Section>

        <Section title="5. Third-Party Cookies">
          <p>Our payment provider <strong className="text-slate-300">Razorpay</strong> and authentication provider <strong className="text-slate-300">Google</strong> may set cookies governed by their own policies:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Razorpay Privacy Policy ↗</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Privacy Policy ↗</a></li>
          </ul>
        </Section>

        <Section title="6. Consent">
          <p>By continuing to use {SITE} after seeing our cookie notice, you consent to our use of essential cookies as described in this policy.</p>
          <p>Since we only use essential cookies, we are not required to obtain separate opt-in consent for analytics or advertising cookies — we simply don't use them.</p>
        </Section>

        <Section title="7. Updates to This Policy">
          <p>We may update this Cookie Policy from time to time. Check the "Last updated" date above for the most recent version.</p>
        </Section>

        <Section title="8. Contact">
          <p>Questions about our cookie practices? Email us at <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a></p>
        </Section>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy →</Link>
          <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service →</Link>
          <Link to="/refund-policy" className="text-blue-400 hover:underline">Refund Policy →</Link>
        </div>
      </div>
    </>
  );
}
