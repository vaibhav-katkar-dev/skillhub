import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../store/authStore';
import { Award, Calendar, GraduationCap, ArrowRight, Loader2, Star, Trophy, ExternalLink, Github, Linkedin, FileText, Briefcase } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.skillvalix.com/api';

const Sk = ({ cls }) => (
  <div className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.8s_infinite] rounded-xl ${cls}`} />
);

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/auth/public/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('This user profile could not be found or is set to private.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center pt-24 pb-20 px-4">
        <Sk cls="w-24 h-24 rounded-full mb-6" />
        <Sk cls="h-10 w-64 mb-3" />
        <Sk cls="h-5 w-40 mb-12" />
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Sk cls="h-40" /><Sk cls="h-40" /><Sk cls="h-40" /><Sk cls="h-40" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
          <Award className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Profile Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-center">
          {error || "We couldn't locate this user's public portfolio."}
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
          Explore Free Courses
        </button>
      </div>
    );
  }

  // Generate initials for avatar
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const joinDate = new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <Helmet>
        <title>{profile.name}'s Profile | SkillValix</title>
        <meta name="description" content={`View ${profile.name}'s verified certifications and achievements on SkillValix.`} />
      </Helmet>

      {/* ── COVER HIGHLIGHT ── */}
      <div className="bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-500/30 blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 flex-shrink-0 animate-[fadeUp_0.5s_ease_forwards]">
              {initials}
            </div>
            {profile.openToWork && (
              <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border-2 border-indigo-700 shadow-md flex items-center gap-1 animate-bounce">
                <Briefcase className="w-3 h-3" /> Hire Me
              </div>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3">
            {profile.name}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-indigo-200 text-sm font-medium mb-5">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {joinDate}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-400" /> {profile.certificates.length} Certifications</span>
          </div>

          {/* Social Links */}
          {(profile.github || profile.linkedin || profile.resume) && (
            <div className="flex items-center justify-center gap-3">
              {profile.github && (
                <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors shadow-sm" title="GitHub">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors shadow-sm" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile.resume && (
                <a href={profile.resume.startsWith('http') ? profile.resume : `https://${profile.resume}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors shadow-sm" title="View Resume">
                  <FileText className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CERTIFICATES BOARD ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 -mt-16">
        <h2 className="text-slate-800 text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 drop-shadow-sm">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          Verified Accolades
        </h2>

        {profile.certificates.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold text-lg">No certifications yet.</p>
            <p className="text-slate-400 text-sm mt-1 mb-6 max-w-xs mx-auto">This student is currently working hard on their first certification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {profile.certificates.map(cert => (
              <div key={cert.certificateId} className="group bg-white border border-slate-100 hover:border-indigo-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-300/40">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
                        {cert.course?.title || 'Unknown Course'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Credential ID</p>
                      <p className="text-xs font-mono font-bold text-slate-600">{cert.certificateId}</p>
                    </div>
                    {cert.course?.slug && (
                      <Link to={`/courses/${cert.course.slug}`} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors" title="View Course">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                  
                  <a
                    href={`/verify/${cert.certificateId}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[.98]"
                  >
                    View Official Credential <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CALL TO ACTION ── */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-slate-900 mb-3">Want your own Portfolio?</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-8 font-medium">
              Join SkillValix to learn web development for free and earn verifiable certificates you can share with employers.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/register" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5">
                Join for Free
              </Link>
              <Link to="/courses" className="px-8 py-3.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
