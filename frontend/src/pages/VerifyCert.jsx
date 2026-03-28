import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { getCourseList } from '../data/courseLoader';
import {
  Search, CheckCircle, XCircle, Award, Loader2,
  ShieldCheck, Sparkles, ArrowRight, BookOpen, Clock, BadgeCheck, Zap
} from 'lucide-react';

const EVENT_TYPE_LABEL = {
  'job-simulation': 'Job Simulation',
  hackathon: 'Hackathon',
  internship: 'Internship',
};

const CTA_THEMES = {
  blue: 'from-indigo-600 to-blue-700',
  green: 'from-emerald-600 to-teal-700',
  pink: 'from-rose-600 to-pink-700',
  orange: 'from-amber-500 to-orange-600',
};

const VerifyCert = () => {
  const { certId: urlCertId } = useParams();
  const [certId, setCertId] = useState(urlCertId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourseList()
      .then(data => setCourses((data || []).slice(0, 6)))
      .catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    if (urlCertId) {
      verifyCertificate(urlCertId);
    }
  }, [urlCertId]);

  const verifyCertificate = async (idToVerify) => {
    if (!idToVerify.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const certKey = idToVerify.trim();

      try {
        const res = await api.get(`/certificates/verify/${certKey}`);
        setResult({ ...res.data, source: 'course' });
        return;
      } catch (courseErr) {
        if (courseErr?.response?.status !== 404) throw courseErr;
      }

      const eventRes = await api.get(`/events/certificates/verify/${certKey}`);
      setResult({ ...eventRes.data, source: 'event' });
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    verifyCertificate(certId);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[radial-gradient(circle_at_top,#e0ecff_0%,#f8fafc_35%,#f8fafc_100%)] py-12 px-4">
      <Helmet>
        <title>Verify Certificate | SkillValix</title>
        <meta name="description" content="Verify the authenticity of a SkillValix certificate using its unique ID." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Official Certificate Verification
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Verify a SkillValix Certificate
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
            Confirm certificate authenticity, recipient details, and course completion from one secure verification page.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-[2rem] shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Search Certificate ID</h2>
                <p className="text-sm text-slate-500">Use the exact certificate code shown on the PDF.</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="relative mb-8">
              <input
                type="text"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pr-32 text-lg text-slate-900 font-mono uppercase focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:normal-case placeholder:text-slate-400"
                placeholder="e.g. CERT-1A2B3C4D"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !certId.trim()}
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white px-6 rounded-xl font-bold transition-colors flex items-center shadow-md shadow-blue-500/20 disabled:shadow-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
              </button>
            </form>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: ShieldCheck, title: 'Tamper Checked', text: 'Validated against official certificate records.' },
                { icon: BadgeCheck, title: 'Trusted Data', text: 'Shows verified recipient and course details.' },
                { icon: Award, title: 'Instant Result', text: 'Know in seconds whether a certificate is genuine.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Icon className="w-5 h-5 text-indigo-600 mb-3" />
                  <p className="font-bold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <XCircle className="w-12 h-12 mb-3 text-red-500" />
                <h3 className="text-xl font-bold mb-1">Verification Failed</h3>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {!error && !result && !loading && (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">Enter a certificate ID to begin</h3>
                <p className="text-slate-500 mt-2">We&apos;ll show the verified learner, course, issue date, and certificate code here.</p>
              </div>
            )}
          </div>

          {(loading || result) && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 via-blue-300/10 to-indigo-400/20 blur-3xl rounded-[2rem]" />
              <div className="relative bg-white border border-slate-200 rounded-[2rem] shadow-[0_24px_80px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600" />
                <div className="p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Verification Result</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">
                        {loading ? 'Checking Certificate' : 'Certificate Authenticated'}
                      </h2>
                    </div>
                    <div className={`rounded-2xl px-4 py-2 text-sm font-bold border ${result ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {result ? 'Valid' : 'Verifying'}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#f1f5f9_100%)] p-6 sm:p-7 shadow-inner">
                    {loading && !result ? (
                      <div className="py-10 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900">Verifying certificate details</h3>
                        <p className="text-slate-500 mt-2">The official certificate record will appear here once the data is confirmed.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-200">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">SkillValix</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">Certificate of Completion</h3>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Award className="w-7 h-7 text-white" />
                          </div>
                        </div>

                        <div className="mt-6 space-y-5">
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold">Certificate Type</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">
                              {result?.source === 'event'
                                ? EVENT_TYPE_LABEL[result?.eventType] || 'Event Certificate'
                                : 'Course Certificate'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Recipient</p>
                            <p className="text-2xl font-black text-slate-900 break-words">{result?.studentName}</p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Programme</p>
                            <p className="text-lg font-bold text-blue-700 break-words">{result?.courseTitle || result?.eventTitle}</p>
                          </div>

                          {result?.role && (
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Role</p>
                              <p className="text-base font-bold text-slate-800 break-words">{result.role}</p>
                            </div>
                          )}

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Credential Authority</p>
                            <p className="text-sm font-semibold text-slate-700">SkillValix Verified Credential Platform</p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-white border border-slate-200 p-4">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Issue Date</p>
                              <p className="font-semibold text-slate-800">
                                {result?.issueDate ? new Date(result.issueDate).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                }) : ''}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white border border-slate-200 p-4">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Certificate ID</p>
                              <p className="font-mono text-sm font-semibold text-slate-800 break-all">{result?.certificateId}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
                            <div>
                              <p className="font-bold text-emerald-800">This certificate is valid.</p>
                              <p className="text-sm text-emerald-700/80 mt-1">
                                The certificate details match an official SkillValix record.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>SkillValix certificates are designed to be simple to verify and easy to trust.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-slate-900 text-white rounded-[2rem] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
          <div className="p-8 sm:p-10 border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_35%),linear-gradient(135deg,#0f172a_0%,#172554_45%,#111827_100%)]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Get Certified Fast
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black leading-tight">
                Get quickly certified in your skills with real course-based certificates
              </h2>
              <p className="mt-4 text-slate-300 text-lg">
                Learn every lesson for free, or move faster and take the exam directly when you already know the skill. It is built for both full learners and quick certification seekers.
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {[
                  { icon: BookOpen, title: 'All lessons are free', text: 'Study the full course at your own pace with no paywall.' },
                  { icon: Zap, title: 'Direct exam option', text: 'Already confident? Skip ahead and take the exam directly.' },
                  { icon: Award, title: 'Get certified quickly', text: 'Pass the exam and earn a verified certificate fast.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon className="w-5 h-5 text-amber-300 mb-3" />
                    <p className="font-bold text-white text-sm">{title}</p>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 font-bold hover:bg-slate-100 transition-colors"
                >
                  Browse All Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 text-white px-5 py-3 font-bold hover:bg-white/15 transition-colors"
                >
                  Start Learning Free
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black">Popular Certification Paths</h3>
                <p className="text-slate-400 text-sm mt-1">Choose a course and work toward a verified certificate.</p>
              </div>
              <Link to="/courses" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors">
                View all courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map(course => (
                <Link
                  key={course._id}
                  to={`/courses/${course.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${CTA_THEMES[course.theme] || CTA_THEMES.blue}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-200" />
                      </div>
                      <div className="text-right text-xs text-slate-400 font-bold uppercase tracking-wide">
                        Certificate Track
                      </div>
                    </div>
                    <h4 className="mt-4 text-lg font-extrabold text-white leading-snug">{course.title}</h4>
                    <p className="mt-2 text-sm text-slate-300 line-clamp-3">{course.description}</p>
                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-300 border-t border-white/10 pt-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Self-paced
                      </span>
                      <span className="inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Get Certified
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-white">Want a faster route?</p>
                  <p className="text-sm text-emerald-50/85 mt-1 leading-relaxed">
                    You do not need to complete every lesson before taking the exam. If you already know the topic, you can go straight for certification and get verified quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCert;
