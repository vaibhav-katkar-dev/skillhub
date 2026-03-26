import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Award, Briefcase, Calendar, ChevronRight, FileText, Github, Linkedin, MapPin, CheckCircle, GraduationCap, Globe } from 'lucide-react';
import { api } from '../store/authStore';

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
            const matchedCourse = allCourses.find(c => c._id.toString() === courseIdStr.toString());
            return {
              ...cert,
              course: matchedCourse || { 
                title: 'Verified Certification',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'
              }
            };
          });
        }

        setProfile(profileData);
      } catch (err) {
        console.error(err);
        setError('This user profile could not be found or is set to private.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-3xl mx-auto w-full items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 text-center w-full border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">{error}</h2>
          <p className="text-slate-500 mb-8">The link might be broken, or the user hasn't made their profile public yet.</p>
          <Link to="/" className="inline-flex bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* Decorative Background */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-50 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
        <div className="absolute top-12 -left-20 w-72 h-72 bg-purple-500 blur-3xl opacity-20 rounded-full"></div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          
          {/* Header Section */}
          <div className="relative px-8 lg:px-12 pt-12 pb-10 border-b border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
              
              {/* User Identity */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-4xl font-black rounded-2xl shadow-lg shadow-indigo-200">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                    {profile.name}
                    <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-50" />
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      Joined {new Date(profile.joinedAt).getFullYear()}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      SkillValix Scholar
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                {profile.openToWork && (
                  <div className="inline-flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm animate-pulse-slow">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative">
                      <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
                    </span>
                    Available for Hire
                  </div>
                )}
                
                {/* Social Links Row */}
                <div className="flex gap-2">
                  {profile.github && (
                    <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all hover:shadow-md hover:-translate-y-0.5" title="GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200 transition-all hover:shadow-md hover:-translate-y-0.5" title="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.portfolio && (
                    <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer" className="px-5 h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition-all hover:shadow-md hover:-translate-y-0.5" title="Portfolio">
                      <Globe className="w-5 h-5" />
                      <span className="hidden sm:inline">Portfolio</span>
                    </a>
                  )}
                  {profile.resume && (
                    <a href={profile.resume.startsWith('http') ? profile.resume : `https://${profile.resume}`} target="_blank" rel="noopener noreferrer" className="px-5 h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5" title="View Resume">
                      <FileText className="w-5 h-5" />
                      <span className="hidden sm:inline">Resume</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="p-8 lg:p-12 bg-slate-50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Verified Certifications</h2>
            </div>
            
            {profile.certificates?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.certificates.map(cert => (
                  <div key={cert.certificateId} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all hover:-translate-y-1 flex flex-col">
                    <div className="relative h-40 bg-slate-100 overflow-hidden border-b border-slate-100">
                      {cert.course?.image && (
                        <img src={cert.course.image} alt={cert.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block shadow-sm">
                          Completed
                        </span>
                        <h3 className="text-white font-bold leading-tight line-clamp-2">
                          {cert.course?.title || 'Certification Title'}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">CREDENTIAL ID</p>
                        <p className="font-mono text-sm text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100">{cert.certificateId}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500">
                          {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <Link to={`/verify/${cert.certificateId}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/btn">
                          Verify
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Certifications Yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto">This academic hasn't completed any SkillValix masterclasses yet. Check back later!</p>
              </div>
            )}
          </div>

        </div>

        {/* Marketing Footer (Viral Loop) */}
        {!loading && !error && (
          <div className="mt-12 text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Want to showcase your own skills?</h3>
            <p className="text-slate-500 mb-5 max-w-lg mx-auto">Join SkillValix today to master web development, earn verified credentials, and land your dream role.</p>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 rounded-xl transition-colors">
              Get Started for Free
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
