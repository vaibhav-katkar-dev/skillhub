import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'March 25, 2026';
const COMPANY = 'SkillValix Learning Platform';
const SITE = 'www.skillvalix.com';
const EMAIL = 'support@skillvalix.com';

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

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Helmet>
        <title>Terms of Service | SkillValix</title>
        <meta
          name="description"
          content="Read SkillValix Terms of Service, including the rules and guidelines for using our learning platform."
        />
      </Helmet>

      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: <span className="text-slate-300">{LAST_UPDATED}</span></p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl">
            By accessing or using {SITE} ("Platform"), you agree to be bound by these terms. Please read them carefully.
            If you do not agree, please do not use our platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Section title="1. Acceptance of Terms">
          <p>By creating an account or using any part of the platform, you confirm that you are at least 13 years old, agree to these terms, and agree to our <Link to="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>.</p>
        </Section>

        <Section title="2. Account Registration">
          <p>You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <p>You must notify us immediately at <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a> if you suspect unauthorised access to your account.</p>
        </Section>

        <Section title="3. Platform Access and Courses">
          <p>Unless stated otherwise, all course lessons and learning materials on SkillValix are provided free of charge.</p>
          <p>Certain features, such as <strong className="text-slate-300">certification exams</strong>, require a one-time per-course payment. Once paid, you receive lifetime access to retake that course exam until you pass.</p>
          <p>We reserve the right to modify, suspend, or discontinue any part of the platform at any time.</p>
        </Section>

        <Section title="4. Certificates">
          <p>Certificates of completion are issued after you pass the relevant course exam. Each certificate carries a unique ID and can be publicly verified at {SITE}/verify.</p>
          <p>Certificates represent completion of the course as defined on our platform and do not constitute formal academic or professional qualifications unless explicitly stated.</p>
          <p>Attempting to forge, misrepresent, or fraudulently obtain a certificate is strictly prohibited and may result in account termination and legal action.</p>
        </Section>

        <Section title="5. Payments and Refunds">
          <p>All payments are processed securely through Razorpay. By making a payment, you agree to Razorpay terms as well.</p>
          <p>Please refer to our <Link to="/refund-policy" className="text-blue-400 hover:underline">Refund Policy</Link> for details on when refunds are available.</p>
        </Section>

        <Section title="6. Prohibited Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share your account credentials with others</li>
            <li>Use automated tools to scrape, copy, or download course content</li>
            <li>Distribute our course materials without written permission</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the platform</li>
            <li>Post inaccurate, abusive, or illegal content</li>
            <li>Use the platform for any unlawful purpose</li>
          </ul>
          <p>Violations may result in immediate account suspension or termination without refund.</p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>All content on the platform, including course videos, text, images, and code, is owned by or licensed to {COMPANY}. You may not reproduce, republish, distribute, or create derivative works without our express written consent.</p>
          <p>You retain ownership of any content you submit to us. By submitting it, you grant us a limited licence to use it to operate the platform.</p>
        </Section>

        <Section title="8. Third-Party Links and Services">
          <p>The platform may contain links to third-party websites. We are not responsible for the content or practices of those sites. Your interactions with third-party services are governed by their respective terms.</p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>The platform is provided on an <strong className="text-slate-300">"as is" and "as available"</strong> basis without warranties of any kind, express or implied. We do not guarantee the platform will be error-free, uninterrupted, or free from viruses.</p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>To the maximum extent permitted by law, {COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, even if we have been advised of the possibility of such damages.</p>
          <p>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </Section>

        <Section title="11. Governing Law">
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>We may update these terms at any time. The "Last updated" date at the top of this page will reflect the change. Continued use of the platform constitutes your acceptance of the updated terms.</p>
        </Section>

        <Section title="13. Contact">
          <p>Questions? Contact us at <a href={`mailto:${EMAIL}`} className="text-blue-400 hover:underline">{EMAIL}</a></p>
        </Section>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>
          <Link to="/refund-policy" className="text-blue-400 hover:underline">Refund Policy</Link>
          <Link to="/cookie-policy" className="text-blue-400 hover:underline">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}
