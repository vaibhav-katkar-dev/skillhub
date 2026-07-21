import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Award,
  RefreshCw,
  Scale,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { POINT_RULES, HACKATHON_TIERS } from '../config/ambassadorConfig';

export default function CampusAmbassadorTerms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation back */}
        <Link
          to="/campus-ambassador"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Campus Ambassador Hub
        </Link>

        {/* Header Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            Official Program Terms & Anti-Abuse Rules (v2.0)
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-4">
            Campus Ambassador Guidelines & Fair Point Policy
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Designed to empower authentic student leaders, recognize genuine learning, and eliminate referral farming. Every rule is transparent, automated, and enforced strictly.
          </p>
        </div>

        {/* Quick Rule Cards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Pending vs Verified</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Registration points remain <span className="text-amber-400 font-semibold">Pending</span> until email verification. Only <span className="text-emerald-400 font-semibold">Verified Points</span> rank on leaderboards & unlock rewards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Ambassador Network Rule</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Referred student becoming an ambassador awards <span className="text-indigo-400 font-semibold">+100 SV</span> after they complete their <span className="text-white font-semibold">1st verified activity</span>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Admin Fair Review Policy</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Points from fraudulent or cancelled transactions are subject to <span className="text-amber-400 font-semibold">Admin Review</span>. If points are adjusted below a tier threshold, milestone status updates accordingly.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10">
          {/* 1. Eligibility */}
          <section className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">1. Eligibility & Application Approval</h2>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>Must be a currently enrolled college student in an accredited Indian institution.</li>
              <li>Applications are reviewed by SkillValix Admin within 24–48 hours based on college details, contact verification, and statement of interest.</li>
              <li>Approved Campus Ambassadors are assigned a unique, immutable referral code format (<code className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-mono text-xs">ca-XXXXXXXX</code>).</li>
              <li>SkillValix reserves the right to reject incomplete or duplicate applications.</li>
            </ul>
          </section>

          {/* 2. Point Matrix Table */}
          <section className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">2. Point Earning Matrix & Isolation Rules</h2>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl mb-6">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Activity Category</th>
                    <th className="py-3.5 px-4">Points Awarded</th>
                    <th className="py-3.5 px-4">Verification Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Student Registration</td>
                    <td className="py-3 px-4 text-amber-400 font-semibold">+10 SV (Pending)</td>
                    <td className="py-3 px-4 text-slate-400">Converts to Verified upon email confirmation</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Profile Completion</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+10 SV</td>
                    <td className="py-3 px-4 text-slate-400">Verified email + name + phone + college + bio (&ge;20 chars)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Portfolio Published</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+20 SV</td>
                    <td className="py-3 px-4 text-slate-400">Verified portfolio URL + &ge;1 published project</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Free Course Certificate</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+5 SV</td>
                    <td className="py-3 px-4 text-slate-400">Capped at max 2 free course certificates per referred user</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Skill Assessment Exam Pass</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+20 SV</td>
                    <td className="py-3 px-4 text-slate-400">Earned upon passing proctored skill exam</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Paid Course Certificate</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+50 SV (1st) / +20 SV (Subsequent)</td>
                    <td className="py-3 px-4 text-slate-400">Earned upon completed paid course certificate</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Free Hackathon Entry</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+10 SV</td>
                    <td className="py-3 px-4 text-slate-400">Awarded on verified hackathon registration</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Paid Hackathon Entry</td>
                    <td className="py-3 px-4 text-indigo-400 font-semibold">8% to 18% Range Tier</td>
                    <td className="py-3 px-4 text-slate-400">Calculated on actual amount paid after discounts</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Paid Course / Job Simulation</td>
                    <td className="py-3 px-4 text-indigo-400 font-semibold">10% Revenue Points</td>
                    <td className="py-3 px-4 text-slate-400">Floor(Amount Paid * 10%) after all discounts</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Ambassador Referral (Network Growth)</td>
                    <td className="py-3 px-4 text-indigo-400 font-semibold">+100 SV</td>
                    <td className="py-3 px-4 text-slate-400">Unlocked after referred ambassador completes 1st verified milestone</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-white">Ambassador Daily Check-in</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">+1 SV</td>
                    <td className="py-3 px-4 text-slate-400">Max 1 point credit per UTC calendar day</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-sm font-semibold text-slate-200 mb-3">Paid Hackathon Range Tiers</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {HACKATHON_TIERS.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-xs text-slate-400">{t.label}</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">{t.display} SVC</div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Anti-Abuse & Self-Referral */}
          <section className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">3. Self-Referral Prohibition & Multi-Account Anti-Abuse</h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                To maintain complete program integrity, SkillValix strictly prohibits self-referrals, fake email registrations, bot automation, and referral farming.
              </p>
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-2">
                <div className="font-semibold text-rose-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Strictly Prohibited Practices:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-rose-200/90">
                  <li>Registering secondary accounts using your own referral code.</li>
                  <li>Using disposable, temporary, or fake email addresses.</li>
                  <li>Exceeding 3 referral registrations per IP address per 24-hour window.</li>
                  <li>Automating signups or certificate completion using scripts or bots.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Refund & Manual Adjustment Policy */}
          <section className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">4. Refund, Cancellation & Point Adjustment Policy</h2>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>If a paid course, hackathon, or job simulation transaction is refunded or cancelled, associated points are subject to <strong className="text-white">Admin review and manual adjustment</strong>.</li>
              <li>If an admin point adjustment causes an ambassador's total verified points to drop below a milestone tier (e.g., Bronze 500, Silver 1,500, Gold 3,000, Platinum 6,000), that milestone tier reverts to <strong className="text-amber-400">Locked</strong> status.</li>
              <li>Certificates revoked for academic integrity or program violations result in manual point adjustment of associated certificate points.</li>
            </ul>
          </section>

          {/* 5. Leaderboard & Auditing */}
          <section className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">5. Verified Leaderboard & System Audit Trail</h2>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm leading-relaxed list-disc list-inside">
              <li>The public Campus Ambassador Leaderboard strictly ranks ambassadors based on <strong className="text-white">totalVerifiedPoints</strong>.</li>
              <li>Points in <span className="text-amber-400">Pending</span> or <span className="text-rose-400">Flagged</span> status are excluded from leaderboard standings until verified.</li>
              <li>Every point addition, deduction, clawback, or admin adjustment is permanently logged with timestamp, event code, reference ID, and audit trigger.</li>
            </ul>
          </section>

          {/* 6. Admin Disqualification Authority */}
          <section className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">6. Disqualification & Final Admin Authority</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              SkillValix reserves the right to audit ambassador activity at any time. Any ambassador found attempting to game, manipulate, or abuse the point matrix will face immediate consequences:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                <span className="block text-rose-400 font-bold text-sm mb-1">Point Deduction</span>
                Forfeiture of all pending and verified point balances.
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                <span className="block text-rose-400 font-bold text-sm mb-1">Reward Revocation</span>
                Cancellation of unfulfilled reward requests and revenue share.
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                <span className="block text-rose-400 font-bold text-sm mb-1">Permanent Suspension</span>
                Permanent ban from SkillValix Campus Ambassador Program.
              </div>
            </div>
          </section>
        </div>

        {/* Footer Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-purple-900/50 border border-indigo-500/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Drive Real Impact on Your Campus?</h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Join thousands of student leaders earning verified rewards, revenue share, and exclusive certificates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/campus-ambassador"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
            >
              Go to Ambassador Hub
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
