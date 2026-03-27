import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft, BadgeCheck, CircleX, LoaderCircle, ShieldCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '/api';

const EVENT_TYPE_LABEL = {
  'job-simulation': 'Job Simulation',
  hackathon: 'Hackathon',
  internship: 'Internship',
};

export default function VerifyEventCert() {
  const { certId: paramId } = useParams();
  const [certId, setCertId] = useState(paramId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const verify = async (id) => {
    const cid = (id || certId).trim();
    if (!cid) return;
    setLoading(true);
    setErr('');
    setResult(null);
    try {
      const res = await axios.get(`${API}/events/certificates/verify/${cid}`);
      setResult(res.data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Certificate not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) verify(paramId);
  }, [paramId]);

  const issueDate = result?.issueDate
    ? new Date(result.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <>
      <Helmet>
        <title>Verify Event Certificate - SkillValix</title>
        <meta name="description" content="Verify the authenticity of a SkillValix event certificate." />
      </Helmet>

      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <BadgeCheck className="w-14 h-14 mx-auto mb-4 text-amber-300" aria-hidden="true" />
            <h1 className="text-3xl font-black text-white mb-2">Verify Event Certificate</h1>
            <p className="text-slate-400">Enter a Certificate ID to confirm authenticity.</p>
          </div>

          <div className="flex gap-2 mb-8">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              placeholder="e.g. EVC-19ED8548"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={() => verify()}
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" /> : 'Verify'}
            </button>
          </div>

          {err && (
            <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-center">
              <CircleX className="w-10 h-10 mx-auto mb-2 text-red-300" aria-hidden="true" />
              <p className="text-red-300 font-semibold">{err}</p>
              <p className="text-slate-400 text-sm mt-1">Double-check the ID and try again.</p>
            </div>
          )}

          {result && (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-white" aria-hidden="true" />
                <div className="text-white font-black text-xl">Certificate Verified</div>
                <div className="text-emerald-200 text-sm mt-1">This certificate is genuine and issued by SkillValix</div>
              </div>

              <div className="p-6 space-y-4">
                <Row label="Name" value={result.studentName} />
                <Row label="Event Type" value={EVENT_TYPE_LABEL[result.eventType] || result.eventType} />
                <Row label="Programme" value={result.eventTitle} />
                {result.role && <Row label="Role" value={result.role} />}
                <Row label="Date of Issue" value={issueDate} />
                <Row label="Certificate ID" value={result.certificateId} mono />
              </div>

              <div className="px-6 pb-6">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center text-xs text-indigo-300">
                  Issued by <strong>SkillValix</strong> | MSME Registered | skillvalix.com
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/events" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <span className={`text-sm font-semibold text-white text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
