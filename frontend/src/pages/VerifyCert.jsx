import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { api } from '../store/authStore';
import { Search, CheckCircle, XCircle, Award, Loader2 } from 'lucide-react';

const VerifyCert = () => {
  const { certId: urlCertId } = useParams();
  const [certId, setCertId] = useState(urlCertId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-verify if an ID was passed in the URL
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
      const res = await api.get(`/certificates/verify/${idToVerify.trim()}`);
      setResult(res.data);
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-12 px-4 bg-slate-50">
      <Helmet>
        <title>Verify Certificate | SkillHub</title>
        <meta name="description" content="Verify the authenticity of a SkillHub certificate using its unique ID." />
      </Helmet>

      <div className="w-full max-w-2xl bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-6 shadow-sm">
            <Search className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Verify Certificate</h1>
          <p className="text-slate-600 max-w-md mx-auto font-medium">
            Enter the unique Certificate ID to verify its authenticity and check the details of the issuer and recipient.
          </p>
        </div>

        <form onSubmit={handleVerify} className="relative max-w-md mx-auto mb-10">
          <input
            type="text"
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg text-slate-900 font-mono uppercase focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:normal-case placeholder:text-slate-400 font-medium"
            placeholder="e.g. CERT-1A2B3C4D"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading || !certId.trim()}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white px-6 rounded-lg font-bold transition-colors flex items-center shadow-md shadow-blue-500/20 disabled:shadow-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
          </button>
        </form>

        {error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <XCircle className="w-12 h-12 mb-3 text-red-500" />
              <h3 className="text-xl font-bold mb-1">Verification Failed</h3>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center relative overflow-hidden shadow-sm">
              <div className="absolute -right-6 -top-6 text-emerald-100">
                <Award className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <CheckCircle className="w-12 h-12 mb-3 text-emerald-500" />
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">Certificate Verified</h3>
                
                <div className="w-full text-left space-y-4 bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Recipient Name</span>
                    <span className="text-lg font-bold text-slate-900">{result.studentName}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Course Details</span>
                    <span className="text-lg font-bold text-blue-600">{result.courseTitle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Issue Date</span>
                      <span className="text-slate-700 font-medium">{new Date(result.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Certificate ID</span>
                      <span className="text-slate-700 font-mono font-medium">{result.certificateId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyCert;
