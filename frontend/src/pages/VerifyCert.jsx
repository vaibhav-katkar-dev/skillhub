import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { api } from '../store/authStore';
import { getCourseList } from '../data/courseLoader';
import {
  Search, CheckCircle, XCircle, Award, Loader2,
  ShieldCheck, Sparkles, ArrowRight, BookOpen
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
    <div className="min-h-[calc(100vh-140px)] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_36%,#f8fafc_100%)] py-10 sm:py-12 px-4">
      <Helmet>
        <title>Verify Certificate | SkillValix</title>
        <meta name="description" content="Verify the authenticity of a SkillValix certificate using its unique ID." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-sky-700 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Unified Certificate Verification
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Verify Any SkillValix Certificate</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-lg">
            One smart page for both course and event certificates. Enter the certificate ID and get instant verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-5 sm:gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_16px_60px_rgba(15,23,42,0.08)] p-5 sm:p-7">
            <form onSubmit={handleVerify} className="space-y-4">
              <label className="block text-sm font-bold text-slate-800">Certificate ID</label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-base sm:text-lg text-slate-900 font-mono uppercase focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all placeholder:normal-case placeholder:text-slate-400"
                    placeholder="e.g. CERT-1A2B3C4D or EVC-1A2B3C4D"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !certId.trim()}
                  className="h-12 sm:h-auto sm:px-6 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400 text-white font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Course Certificates', 'Job Simulation Certificates', 'Hackathon Certificates'].map((item) => (
                <span key={item} className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                  {item}
                </span>
              ))}
            </div>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
                <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Verification failed</p>
                  <p className="text-sm mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!error && !result && !loading && (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Enter certificate ID to start verification</p>
                <p className="text-sm text-slate-500 mt-1">We will show recipient, program, issue date, and certificate status.</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_16px_60px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">Verification Result</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${result ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {result ? 'VALID' : loading ? 'CHECKING' : 'WAITING'}
                </span>
              </div>

              {loading && !result ? (
                <div className="py-10 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-3" />
                  <p className="font-semibold text-slate-800">Checking official records...</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold">Certificate Type</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {result?.source === 'event' ? EVENT_TYPE_LABEL[result?.eventType] || 'Event Certificate' : 'Course Certificate'}
                    </p>
                  </div>

                  <InfoRow label="Recipient" value={result?.studentName} large />
                  <InfoRow label="Programme" value={result?.courseTitle || result?.eventTitle} />
                  {result?.role && <InfoRow label="Role" value={result.role} />}
                  <InfoRow
                    label="Issue Date"
                    value={result?.issueDate ? new Date(result.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                  />
                  <InfoRow label="Certificate ID" value={result?.certificateId} mono />

                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-800">Certificate verified</p>
                      <p className="text-sm text-emerald-700/80">This credential matches an official SkillValix record.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-slate-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium">Result will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg sm:text-xl font-black">Popular Certification Paths</h3>
            <Link to="/courses" className="text-sm font-bold text-sky-300 hover:text-sky-200 inline-flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map(course => (
              <Link
                key={course._id}
                to={`/courses/${course.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
              >
                <div className={`h-1.5 bg-gradient-to-r ${CTA_THEMES[course.theme] || CTA_THEMES.blue}`} />
                <div className="p-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-sky-200" />
                  </div>
                  <p className="font-bold text-sm text-white line-clamp-2">{course.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value, large = false, mono = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold">{label}</p>
      <p className={`mt-1 text-slate-900 break-words ${large ? 'text-xl font-black' : 'text-sm font-bold'} ${mono ? 'font-mono' : ''}`}>
        {value || '--'}
      </p>
    </div>
  );
}

export default VerifyCert;
