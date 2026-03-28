import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Briefcase, Calendar, ChevronRight, FileText, Github, Linkedin, CheckCircle, Globe, GraduationCap, Zap } from 'lucide-react';
import { api } from '../store/authStore';

// Helper to safely prefix URLs
const safeUrl = (url) => url.startsWith('http') ? url : `https://${url}`;

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [res, coursesRes] = await Promise.all([
          api.get(`/auth/public/${id}`),
          fetch('/data/all-courses.json')
        ]);

        const profileData = res.data;

        if (coursesRes.ok) {
          const rawCourses = await coursesRes.json();
          const allCourses = rawCourses.map(item => item.course);

          profileData.certificates = profileData.certificates.map(cert => {
            const courseIdStr = cert.course?._id || cert.course;
            const matched = allCourses.find(c => c._id.toString() === courseIdStr?.toString());
            return {
              ...cert,
              course: matched || {
                title: 'Verified Certification',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'
              }
            };
          });
        }

        setProfile(profileData);
      } catch (err) {
        console.error(err);
        setError('This profile could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100">
        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">{error}</h2>
        <p className="text-slate-500 text-sm mb-6">The link might be broken or invalid.</p>
        <Link to="/" className="inline-flex bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
          Return Home
        </Link>
      </div>
    </div>
  );

  const certCount = profile.certificates?.length || 0;
  // Only show the join year — real data
  const joinYear = profile.joinedAt ? new Date(profile.joinedAt).getFullYear() : null;

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Decorative top gradient */}
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-transparent pointer-events-none -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
        <div className="absolute top-12 -left-20 w-72 h-72 bg-purple-500 blur-3xl opacity-20 rounded-full"></div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 lg:py-14">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 mb-6">

          {/* Header — centered stack on mobile, horizontal on sm+ */}
          <div className="p-6 sm:p-10 border-b border-slate-100">

            {/* Avatar + Info — column on mobile, row on sm+ */}
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-5 mb-6">
              <div className="w-20 h-20 shrink-0 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-3xl font-black rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="break-words">{profile.name}</span>
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  {joinYear && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      Since {joinYear}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    SkillValix Scholar
                  </span>
                  {profile.openToWork && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                      Available for Hire
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social links — centered on mobile, left-aligned on sm+ */}
            {(profile.github || profile.linkedin || profile.portfolio || profile.resume) && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {profile.github && (
                  <a href={safeUrl(profile.github)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all">
                    <Github className="w-4 h-4 shrink-0" />
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={safeUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-all">
                    <Linkedin className="w-4 h-4 shrink-0" />
                    LinkedIn
                  </a>
                )}
                {profile.portfolio && (
                  <a href={safeUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm transition-all">
                    <Globe className="w-4 h-4 shrink-0" />
                    Portfolio
                  </a>
                )}
                {profile.resume && (
                  <a href={safeUrl(profile.resume)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all">
                    <FileText className="w-4 h-4 shrink-0" />
                    Resume
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Stats — only real data */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
            <div className="p-5 text-center">
              <p className="text-3xl font-black text-indigo-600">{certCount}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Certificates</p>
            </div>
            <div className="p-5 text-center">
              {profile.openToWork ? (
                <div className="flex justify-center mb-1">
                  <Zap className="w-8 h-8 text-emerald-500 animate-bounce" />
                </div>
              ) : (
                <div className="flex justify-center mb-1">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                {profile.openToWork ? 'Open to Work' : 'Not Looking'}
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Verified Certifications</h2>
          {certCount > 0 && (
            <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1 rounded-full">{certCount}</span>
          )}
        </div>

        {certCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.certificates.map(cert => (
              <div key={cert.certificateId} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all hover:-translate-y-1 flex flex-col">
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  {cert.course?.image && (
                    <img src={cert.course.image} alt={cert.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="bg-indigo-500/90 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-1 inline-block">
                      Completed
                    </span>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                      {cert.course?.title || 'Certification'}
                    </h3>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Credential ID</p>
                    <p className="font-mono text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 truncate">{cert.certificateId}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-400">
                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                    </span>
                    <Link to={cert.isEvent ? `/verify-event/${cert.certificateId}` : `/verify/${cert.certificateId}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 group/btn">
                      Verify <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 mb-1">No Certifications Yet</h3>
            <p className="text-sm text-slate-400">This scholar hasn't completed any SkillValix courses yet.</p>
          </div>
        )}

        {/* Viral footer */}
        <div className="mt-10 text-center bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-slate-800 font-bold mb-1">Build your own skill portfolio</p>
          <p className="text-slate-500 text-sm mb-4">Join SkillValix, earn verified credentials, and share them with employers.</p>
          <Link to="/register" className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors">
            Get Started — It's Free
          </Link>
        </div>
      </main>
    </div>
  );
}
