import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Award, Briefcase, Calendar, FileText, 
  Github, Linkedin, CheckCircle, Globe, GraduationCap, 
  Zap, Phone, Download, ExternalLink,
  ShieldCheck, Share2, Sparkles, Code2, Link as LinkIcon
} from 'lucide-react';
import { api } from '../store/authStore';
import Logo from '../components/Logo';

const safeUrl = (url) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNav, setShowNav] = useState(true);
  
  // Optimization: Use ref instead of state to trace scroll without triggering continuous re-renders
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) setShowNav(false);
      else setShowNav(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              course: matched || { title: 'Verified Certification', skills: [] }
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
    <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Portfolio</p>
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
  const initials = (profile.name || '').split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || '?';
  
  const allSkills = Array.from(new Set([
    ...(profile.customSkills || []),
    ...(profile.certificates || []).map(c => c.course?.skills || []).flat()
  ])).filter(Boolean);

  const isDark = profile.theme === 'dark';

  // Theme Classes
  const bgMain = isDark ? "bg-[#0b0f19] text-slate-200" : "bg-[#fafbfc] text-slate-900";
  const bgCard = isDark ? "bg-[#111827] border-slate-800/60 shadow-none" : "bg-white border-slate-200 shadow-sm";
  const textHead = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const bgBadge = isDark ? "bg-slate-800/80 border-slate-700" : "bg-white/90 border-slate-200";
  const textBadge = isDark ? "text-slate-300" : "text-slate-700";

  // SEO Configurations
  const canonicalUrl = `https://skillvalix.com/u/${profile.username || id}`;
  const seoTitle = `${profile.name} - Professional Portfolio | SkillValix`;
  const seoDesc = profile.bio ? (profile.bio.length > 155 ? profile.bio.slice(0, 150) + '...' : profile.bio) : `Explore ${profile.name}'s verified professional portfolio, technical projects, and ${certCount} certified skills on SkillValix.`;

  const schemaJSON = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": profile.joinedAt,
    "mainEntity": {
      "@type": "Person",
      "name": profile.name,
      "description": profile.bio || `Professional portfolio of ${profile.name}.`,
      "url": canonicalUrl,
      "knowsAbout": allSkills,
      "alumniOf": profile.college ? {
        "@type": "CollegeOrUniversity",
        "name": profile.college
      } : undefined,
      "hasCredential": profile.certificates?.map(cert => ({
        "@type": "EducationalOccupationalCredential",
        "name": cert.course?.title || "SkillValix Certification",
        "credentialCategory": "Certificate",
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "SkillValix",
          "url": "https://skillvalix.com"
        }
      }))
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 ${bgMain}`}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="SkillValix" />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(schemaJSON)}
        </script>
      </Helmet>
      
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 pointer-events-none ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="pointer-events-auto filter brightness-0 invert opacity-80 mix-blend-difference">
                <Logo size="sm" linkTo="/" />
            </div>
            <div className="hidden sm:block pointer-events-auto">
               <Link to="/register" className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/90 backdrop-blur-md text-white border border-indigo-500 px-4 py-2 rounded-full shadow-lg hover:bg-indigo-500 transition-all">
                 Build Your Profile
               </Link>
            </div>
        </div>
      </nav>

      <div className="fixed bottom-6 left-6 right-6 z-[100] sm:hidden pointer-events-none">
        <div className={`transition-all duration-700 pointer-events-auto ${showNav ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link to="/register" className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white rounded-2xl py-4 shadow-2xl shadow-indigo-500/20 border border-slate-800 backdrop-blur-sm group active:scale-95 transition-all">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg">
                <Award className="w-5 h-5 text-indigo-100" />
             </div>
             <div className="text-left">
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 leading-none mb-1">Create Your Own</p>
               <p className="text-sm font-bold leading-none">Build Professional Profile</p>
             </div>
          </Link>
        </div>
      </div>

      <header className="pt-24 pb-12 lg:pb-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`relative overflow-hidden rounded-[2.5rem] border px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-16 shadow-2xl ${isDark ? 'bg-gradient-to-br from-[#111827] via-[#0f1422] to-indigo-950/30 border-slate-800 shadow-indigo-900/10' : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200 shadow-slate-200/50'}`}>
            <div className={`absolute -top-16 -right-16 w-64 h-64 blur-3xl rounded-full ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-200/40'}`} />
            <div className={`absolute -bottom-20 -left-20 w-72 h-72 blur-3xl rounded-full ${isDark ? 'bg-blue-900/20' : 'bg-sky-200/40'}`} />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="relative w-fit mx-auto mb-6 group">
                <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 rounded-[2.25rem] shadow-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-black rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
                  {initials}
                </div>
                {profile.openToWork && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-[#111827] animate-bounce">
                    <Zap className="w-5 h-5 fill-current border-[#111827]" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <h1 className={`text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] ${textHead}`}>
                  {profile.name}
                </h1>
                <CheckCircle className="w-8 h-8 text-indigo-500 flex-shrink-0" />
              </div>

              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 shadow-sm ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-wider">
                  {certCount} Verified Credentials
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-4 font-bold mb-8">
                {profile.college && (
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.1)] ${bgBadge}`}>
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span className={`text-xs uppercase tracking-wider ${textBadge}`}>{profile.college}</span>
                  </div>
                )}
                {profile.branch && (
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.1)] ${bgBadge}`}>
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span className={`text-xs uppercase tracking-wider ${textBadge}`}>{profile.branch}</span>
                  </div>
                )}
                {profile.year && (
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.1)] ${bgBadge}`}>
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className={`text-xs uppercase tracking-wider ${textBadge}`}>{profile.year}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {profile.linkedin && (
                  <a href={safeUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="h-12 px-7 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {profile.resume && (
                  <a href={safeUrl(profile.resume)} target="_blank" rel="noopener noreferrer" className="h-12 px-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                    <FileText className="w-4 h-4" />
                    Resume
                  </a>
                )}
                {profile.phoneNumber && (
                  <a href={`tel:${profile.phoneNumber}`} className={`h-12 px-7 border rounded-2xl flex items-center gap-2 font-bold text-sm hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}>
                    <Phone className="w-4 h-4 text-emerald-500" />
                    Contact
                  </a>
                )}
                {profile.github && (
                  <a href={safeUrl(profile.github)} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 border rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}>
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.portfolio && (
                  <a href={safeUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 border rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}>
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>

              {profile.bio && (
                <div className={`border-t pt-8 max-w-3xl mx-auto ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">About Me</h3>
                  <p className={`text-sm sm:text-base lg:text-lg leading-relaxed md:leading-loose font-medium whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
        
        {/* LEFT COLUMN */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-8">
            <section className={`border rounded-[2rem] p-6 ${bgCard}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5 pl-1">Professional Summary</h3>
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className={`text-2xl font-black ${textHead}`}>{certCount}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Verified Credentials</p>
                        </div>
                    </div>
                    {allSkills.length > 0 && (
                      <div className={`flex items-center gap-4 border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className={`text-2xl font-black ${textHead}`}>{allSkills.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Demonstrated Skills</p>
                        </div>
                      </div>
                    )}
                    {profile.joinedAt && (
                      <div className={`flex items-center gap-4 border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={`text-lg font-black ${textHead}`}>
                                {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Member Since</p>
                        </div>
                      </div>
                    )}
                </div>
            </section>

            {/* Custom Links */}
            {profile.customLinks && profile.customLinks.length > 0 && (
              <section className={`border rounded-[2rem] p-6 ${bgCard}`}>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pl-1">Featured Links</h3>
                  <div className="space-y-3">
                    {profile.customLinks.map((link, i) => (
                      <a key={i} href={safeUrl(link.url)} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md'}`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                          <LinkIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className={`text-sm font-bold truncate ${textHead}`}>{link.title}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
              </section>
            )}

            <section className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xl font-black mb-3">Recruiter Verified</h3>
                <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                    All credentials shown in this portfolio are graded by SkillValix algorithms and algorithmically verified for authenticity.
                </p>
                <div className="flex bg-white/10 p-1 rounded-xl">
                  <button onClick={() => window.print()} className="flex-1 py-3 bg-white text-indigo-600 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                      <Download className="w-4 h-4" /> Save PDF
                  </button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Portfolio Link Copied!");
                  }} className="flex-1 py-3 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                      <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
            </section>
        </aside>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Skills Array */}
            {allSkills.length > 0 && (
              <section>
                <h2 className={`text-xl font-black flex items-center gap-2 mb-6 ${textHead}`}>
                  <Code2 className="w-5 h-5 text-emerald-500" /> Demonstrated Capabilities
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {allSkills.map((skill, i) => (
                    <span key={i} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${isDark ? 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Array */}
            {profile.projects && profile.projects.length > 0 && (
              <section>
                <h2 className={`text-xl font-black flex items-center gap-2 mb-6 ${textHead}`}>
                  <Briefcase className="w-5 h-5 text-blue-500" /> Featured Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {profile.projects.map((proj, i) => (
                    <div key={i} className={`border rounded-[1.5rem] p-6 hover:-translate-y-1 transition-all ${bgCard}`}>
                      <h3 className={`font-black text-lg mb-2 ${textHead}`}>{proj.title}</h3>
                      {proj.description && <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${textMuted}`}>{proj.description}</p>}
                      
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {proj.techStack.map((tech, j) => (
                            <span key={j} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 mt-auto">
                        {proj.link && (
                          <a href={safeUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg">
                            <Globe className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                        {proj.github && (
                          <a href={safeUrl(proj.github)} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                            <Github className="w-3.5 h-3.5" /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications Section */}
            <section>
              <h2 className={`text-xl font-black flex items-center gap-2 mb-6 ${textHead}`}>
                <Award className="w-5 h-5 text-indigo-500" /> Verified Credentials
              </h2>

              {certCount > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {(profile.certificates || []).map((cert, i) => (
                        <div key={i} className={`group min-h-[200px] border-2 rounded-3xl p-6 transition-all flex flex-col justify-between ${isDark ? 'bg-slate-800/30 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-emerald-900/20' : 'bg-white border-slate-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100'}`}>
                              <div className="w-full mb-5">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                          <ShieldCheck className="w-5 h-5" />
                                      </div>
                                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                                        Verified
                                      </span>
                                  </div>
                                  <h3 className={`font-extrabold leading-tight mb-2 group-hover:text-indigo-500 transition-colors ${textHead}`}>
                                      {cert.course?.title || 'Certification'}
                                  </h3>
                                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 ${textMuted}`}>
                                      <Calendar className="w-3 h-3" />
                                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Lifetime Validity'}
                                  </p>
                                  <div className={`rounded-xl px-3 py-2.5 border ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1 flex justify-between">
                                        <span>Credential ID</span>
                                        <Award className="w-3 h-3" />
                                      </p>
                                      <p className={`text-[11px] font-mono font-bold truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cert.certificateId}</p>
                                  </div>
                              </div>
                              <Link 
                                  to={`/verify/${cert.certificateId}`} 
                                  className={`inline-flex items-center gap-1.5 text-xs font-black group/btn pt-2 border-t mt-auto ${isDark ? 'border-slate-700/50 text-indigo-400' : 'border-slate-100 text-indigo-600'}`}
                              >
                                  View Digital Certificate
                                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                              </Link>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="relative overflow-hidden">
                      <div className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center relative ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-white/40 border-slate-200 backdrop-blur-sm'}`}>
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6 ${isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-400 border border-indigo-100'}`}>
                              <Sparkles className="w-10 h-10" />
                          </div>
                          <h3 className={`text-xl font-black mb-2 ${textHead}`}>Learning Journey in Progress</h3>
                          <p className={`text-sm max-w-sm mx-auto leading-relaxed font-medium ${textMuted}`}>
                              This portfolio is under active development. The scholar is completing their training and will showcase their verified credentials soon.
                          </p>
                      </div>
                  </div>
              )}
            </section>
        </div>
      </main>
      
      <footer className={`px-6 py-10 border-t ${isDark ? 'border-slate-800/80 bg-[#0b0f19]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-opacity opacity-60 hover:opacity-100">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isDark ? 'bg-white' : 'bg-slate-900'}`}>
                    <Award className={`w-3.5 h-3.5 ${isDark ? 'text-slate-900' : 'text-white'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Verified by SkillValix</span>
            </Link>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} SkillValix Portfolio Cloud.
            </p>
            <div className="flex gap-6">
                <Link to="/privacy-policy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-colors">Terms</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
