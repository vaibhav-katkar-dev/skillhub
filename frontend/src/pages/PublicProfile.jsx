import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, Briefcase, Calendar, ChevronRight, FileText, 
  Github, Linkedin, CheckCircle, Globe, GraduationCap, 
  Zap, Mail, Phone, Download, MapPin, ExternalLink,
  ShieldCheck, Share2
} from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';

// Helper to safely prefix URLs
const safeUrl = (url) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

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
    <div className="flex-1 flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Profile</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-screen bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-center max-w-md w-full border border-slate-100">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <Briefcase className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">{error}</h2>
        <p className="text-slate-500 text-sm mb-8">The portfolio link might be expired or the user has changed their username.</p>
        <Link to="/" className="inline-flex w-full justify-center bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
          Go to SkillValix
        </Link>
      </div>
    </div>
  );

  const certCount = profile.certificates?.length || 0;
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ── MINIMAL BRANDING BAR (Marketing) ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="pointer-events-auto">
                <Logo size="sm" linkTo="/" />
            </div>
            <div className="hidden sm:block pointer-events-auto">
               <Link to="/register" className="text-[10px] font-black uppercase tracking-widest bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                 Build Your Profile
               </Link>
            </div>
        </div>
      </nav>

      {/* ── PROFILE HERO ── */}
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            
            {/* Avatar */}
            <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-black rotate-2 group-hover:rotate-0 transition-all duration-500 border-4 border-white">
                    {initials}
                </div>
                {profile.openToWork && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white animate-bounce">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                  {profile.name}
                </h1>
                <CheckCircle className="w-8 h-8 text-indigo-500" />
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-slate-500 font-bold mb-6">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs uppercase tracking-wider">{profile.college || 'SkillValix Scholar'}</span>
                </div>
                {profile.branch && (
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs uppercase tracking-wider">{profile.branch}</span>
                  </div>
                )}
                {profile.year && (
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs uppercase tracking-wider">{profile.year}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {profile.linkedin && (
                  <a href={safeUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="h-11 px-6 bg-[#0A66C2] text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {profile.resume && (
                  <a href={safeUrl(profile.resume)} target="_blank" rel="noopener noreferrer" className="h-11 px-6 bg-slate-900 text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
                    <FileText className="w-4 h-4" />
                    View Resume
                  </a>
                )}
                {profile.phoneNumber && (
                  <a href={`tel:${profile.phoneNumber}`} className="h-11 px-6 bg-white border border-slate-200 text-slate-800 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    Contact
                  </a>
                )}
                {profile.github && (
                   <a href={safeUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all">
                     <Github className="w-5 h-5 text-slate-800" />
                   </a>
                )}
                {profile.portfolio && (
                   <a href={safeUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all">
                     <Globe className="w-5 h-5 text-slate-800" />
                   </a>
                )}
              </div>
            </div>

            {/* Bio / About Section */}
            {profile.bio && (
              <div className="mt-8 text-center md:text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">About Me</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-2xl whitespace-pre-line">
                    {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN RESUME BODY ── */}
      <main className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTACT & ABOUT */}
        <aside className="lg:col-span-4 space-y-8">
            
            {/* Quick Summary Card */}
            <section className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Credentials Summary</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-900">{certCount}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Verified Skills</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-900">Verified</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Profile Status</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recruiter Note */}
            <section className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xl font-black mb-3">Recruiter Friendly</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                    All certifications shown on this profile are verified by SkillValix. You can view the original verification records by clicking on any certificate.
                </p>
                <button 
                  onClick={() => window.print()}
                  className="w-full h-12 bg-white text-indigo-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    Download as PDF
                </button>
            </section>
        </aside>

        {/* RIGHT COLUMN: CERTIFICATIONS & SKILLS */}
        <div className="lg:col-span-8 space-y-10">
            
            {/* Certifications Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <Award className="w-6 h-6 text-indigo-600" />
                        Verified Certifications
                    </h2>
                </div>

                {certCount > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.certificates.map(cert => (
                            <div key={cert.certificateId} className="group bg-white border border-slate-200 rounded-3xl p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all flex flex-col justify-between items-start">
                                <div className="w-full mb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Verified</span>
                                    </div>
                                    <h3 className="font-extrabold text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                        {cert.course?.title || 'Certification'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        Issued {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Verified'}
                                    </p>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Verification ID</p>
                                        <p className="text-[11px] font-mono font-bold text-slate-700 truncate">{cert.certificateId}</p>
                                    </div>
                                </div>
                                <Link 
                                    to={`/verify/${cert.certificateId}`} 
                                    className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:underline group/btn pt-1"
                                >
                                    View Digital Credential
                                    <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[2.5rem] -z-10" />
                        <div className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center relative">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-300 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Mastering Today, Ready Tomorrow</h3>
                            <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed font-medium">
                                This scholar is currently in the "Deep Learning" phase of their SkillValix journey. Check back soon for verified certifications in advanced technologies.
                            </p>
                            
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                               <div className="h-1 py-1 px-8 bg-slate-200 rounded-full w-32" />
                               <div className="h-1 py-1 px-8 bg-indigo-200 rounded-full w-44" />
                               <div className="h-1 py-1 px-8 bg-slate-100 rounded-full w-24" />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Platform Marketing Overlay (Subtle) */}
            <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-black mb-2">Build Your Future with SkillValix</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                            Join thousands of students who are earning verified credentials and building professional portfolios like this one. Start your journey today—it's completely free.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Link to="/register" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center shadow-lg transition-all active:scale-95">
                                Get Started Free
                            </Link>
                            <Link to="/courses" className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm flex items-center justify-center backdrop-blur-sm transition-all active:scale-95">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </main>

      {/* ── CUSTOM MINIMAL FOOTER ── */}
      <footer className="px-6 py-10 border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified by SkillValix</span>
            </Link>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} SkillValix. Professional Portfolio System.
            </p>
            <div className="flex gap-6">
                <Link to="/privacy-policy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Terms</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
