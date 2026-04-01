import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  Lock,
  Rocket,
  Star,
  Trophy,
} from 'lucide-react';
import { api } from '../store/authStore';

const STATUS_STYLE = {
  upcoming: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Upcoming', icon: Clock3 },
  live: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Live Now', icon: CircleDot },
  ended: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Ended', icon: CheckCircle2 },
};

export default function Events() {
  const [hackathons, setHackathons] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingHacks(true);
      try {
        const r = await api.get('/events/hackathons');
        setHackathons(r.data || []);
      } catch {
        setHackathons([]);
      } finally {
        setLoadingHacks(false);
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Events - SkillValix</title>
        <meta
          name="description"
          content="Explore SkillValix hackathons, open detailed event pages, register teams, and submit solutions from one in-platform workflow."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 px-6">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold tracking-widest">
            EVENTS HUB
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Experience Real Work.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Build. Submit. Get Recognized.
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Open each hackathon for full details, team registration, secure payment, and submission workflow.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-amber-500" aria-hidden="true" />
              <h2 className="text-3xl font-black text-slate-900">Hackathons</h2>
            </div>
            <p className="text-slate-500 max-w-xl ml-12">
              Click any hackathon card to view complete details and register your team on a dedicated page.
            </p>
          </div>

          {loadingHacks ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 h-72 animate-pulse" />
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Rocket className="w-16 h-16 mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg font-semibold">No hackathons listed yet.</p>
              <p className="text-sm mt-1">Check back soon. Exciting events are coming.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map((hack) => {
                const statusStyle = STATUS_STYLE[hack.status] || STATUS_STYLE.upcoming;
                const StatusIcon = statusStyle.icon;

                return (
                  <div
                    key={hack._id}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {hack.image ? (
                      <img src={hack.image} alt={hack.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                        <Trophy className="w-14 h-14" aria-hidden="true" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                          <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                          {statusStyle.label}
                        </span>
                        {hack.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">{hack.title}</h3>
                      {hack.tagline && <p className="text-sm text-indigo-600 font-medium mb-2">{hack.tagline}</p>}
                      <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-3">{hack.description}</p>

                      {hack.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {hack.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {hack.endDate && (
                        <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                          <Clock3 className="w-4 h-4 text-rose-500" />
                          <span className="text-rose-700">
                            Deadline: {new Date(hack.endDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}

                      <Link
                        to={`/events/hackathon/${hack.slug || hack._id}`}
                        className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        <span className="inline-flex items-center gap-2">
                          View Details & Register
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-black mb-3">Job Simulations Coming Soon</h2>
          <p className="text-indigo-200 mb-8">The simulations stay visible, but the launch flow is locked for now while we rebuild the heavy CPU path.</p>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white/20 text-white font-bold text-sm cursor-not-allowed border border-white/20 shadow-lg"
          >
            <Lock className="w-4 h-4" aria-hidden="true" />
            Coming Soon
          </button>
        </div>
      </section>
    </>
  );
}
