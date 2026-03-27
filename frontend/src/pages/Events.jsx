import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

// ── Static Job Simulations ────────────────────────────────────────────────────
const JOB_SIMULATIONS = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Job Simulation',
    company: 'SkillValix Labs',
    role: 'Frontend Developer Intern',
    duration: '4–6 hours',
    tasks: 4,
    skills: ['React', 'CSS', 'HTML', 'JavaScript'],
    level: 'Beginner',
    certCost: 99,
    color: 'from-blue-600 to-cyan-500',
    icon: '💻',
    description: 'Experience real-world frontend tasks like building responsive UIs, debugging components, and implementing API integrations.',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst Job Simulation',
    company: 'SkillValix Labs',
    role: 'Data Analyst Intern',
    duration: '4–6 hours',
    tasks: 4,
    skills: ['Python', 'Pandas', 'Excel', 'Data Viz'],
    level: 'Beginner',
    certCost: 99,
    color: 'from-violet-600 to-purple-500',
    icon: '📊',
    description: 'Analyze real datasets, create visualizations, write SQL queries, and present your insights just like a real data analyst.',
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer Job Simulation',
    company: 'SkillValix Labs',
    role: 'UI/UX Design Intern',
    duration: '3–5 hours',
    tasks: 3,
    skills: ['Figma', 'Design Thinking', 'Wireframing'],
    level: 'Beginner',
    certCost: 99,
    color: 'from-pink-600 to-rose-500',
    icon: '🎨',
    description: 'Design user flows, create wireframes, build Figma prototypes and conduct usability analysis for a real product.',
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer Job Simulation',
    company: 'SkillValix Labs',
    role: 'Backend Developer Intern',
    duration: '5–7 hours',
    tasks: 4,
    skills: ['Node.js', 'REST APIs', 'MongoDB', 'Auth'],
    level: 'Intermediate',
    certCost: 99,
    color: 'from-emerald-600 to-teal-500',
    icon: '⚙️',
    description: 'Build REST APIs, implement JWT authentication, connect databases, and write unit tests in a guided workspace.',
  },
];

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_STYLE = {
  upcoming: { bg: 'bg-amber-100', text: 'text-amber-700', label: '⏳ Upcoming' },
  live:     { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '🟢 Live Now' },
  ended:    { bg: 'bg-slate-100', text: 'text-slate-500', label: '✅ Ended' },
};

export default function Events() {
  const [hackathons, setHackathons] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);

  useEffect(() => {
    axios.get(`${API}/events/hackathons`)
      .then(r => setHackathons(r.data))
      .catch(() => setHackathons([]))
      .finally(() => setLoadingHacks(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Events — SkillValix</title>
        <meta name="description" content="Join job simulations, hackathons and virtual internships on SkillValix. Get industry-recognized certificates for just ₹99." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 px-6">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)'}} />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold tracking-widest">EVENTS HUB</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Experience Real Work.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Earn Proof of It.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Job simulations, hackathons and virtual internships designed to give you hands-on experience that employers actually value.
          </p>
        </div>
      </section>

      {/* ── Job Simulations ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💼</span>
              <h2 className="text-3xl font-black text-slate-900">Job Simulations</h2>
            </div>
            <p className="text-slate-500 max-w-xl ml-12">Complete real-world task modules and earn a verified certificate for just <span className="font-bold text-indigo-600">₹99</span>.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {JOB_SIMULATIONS.map(sim => (
              <Link
                key={sim.id}
                to={`/events/job-simulation/${sim.id}`}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Color top bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${sim.color}`} />

                <div className="p-6 flex flex-col flex-1">
                  <div className="text-4xl mb-4">{sim.icon}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{sim.company}</div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{sim.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1">{sim.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {sim.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{s}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>⏱ {sim.duration}</span>
                    <span>📋 {sim.tasks} tasks</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${sim.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{sim.level}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Certificate</div>
                      <div className="text-lg font-black text-indigo-600">₹{sim.certCost}</div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${sim.color} group-hover:opacity-90 transition-opacity`}>
                      Start →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hackathons ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏆</span>
              <h2 className="text-3xl font-black text-slate-900">Hackathons</h2>
            </div>
            <p className="text-slate-500 max-w-xl ml-12">Compete. Build. Win. Hackathons curated by the SkillValix team — open to all students.</p>
          </div>

          {loadingHacks ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 h-64 animate-pulse" />
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-lg font-semibold">No hackathons listed yet.</p>
              <p className="text-sm mt-1">Check back soon — exciting events are coming!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map(hack => {
                const statusStyle = STATUS_STYLE[hack.status] || STATUS_STYLE.upcoming;
                return (
                  <div key={hack._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                    {/* Banner */}
                    {hack.image ? (
                      <img src={hack.image} alt={hack.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-5xl select-none">🏆</div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>{statusStyle.label}</span>
                        {hack.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">⭐ Featured</span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">{hack.title}</h3>
                      {hack.tagline && <p className="text-sm text-indigo-600 font-medium mb-2">{hack.tagline}</p>}
                      <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-3">{hack.description}</p>

                      {hack.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {hack.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{t}</span>
                          ))}
                        </div>
                      )}

                      {hack.prizes?.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {hack.prizes.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex-1 text-center bg-amber-50 border border-amber-100 rounded-lg py-1.5">
                              <div className="text-xs font-bold text-amber-700">{p.rank}</div>
                              <div className="text-sm font-black text-amber-900">{p.amount}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {hack.registrationLink && hack.status !== 'ended' && (
                        <a
                          href={hack.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                          {hack.status === 'live' ? 'Join Now 🚀' : 'Register Free'}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-black mb-3">Ready to prove your skills?</h2>
          <p className="text-indigo-200 mb-8">Complete a job simulation, earn your certificate, and stand out to recruiters.</p>
          <Link to="/events/job-simulation/frontend-developer" className="inline-block px-8 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
            Start a Job Simulation →
          </Link>
        </div>
      </section>
    </>
  );
}
