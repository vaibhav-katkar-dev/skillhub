import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      try {
        const data = await verifyEmail(token);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    if (token) {
      performVerification();
    } else {
      setStatus('error');
      setMessage('Invalid verification token.');
    }
  }, [token, verifyEmail]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50 px-4">
      <Helmet>
        <title>Verify Email | SkillValix</title>
      </Helmet>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
        {status === 'loading' && (
          <div className="py-8">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Email...</h2>
            <p className="text-slate-500">Please wait while we confirm your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <div className="p-4 bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-slate-600 mb-8">{message}</p>
            <Link 
              to="/login" 
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-3 rounded-lg shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <div className="p-4 bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-slate-600 mb-8">{message}</p>
            <div className="space-y-4">
              <Link 
                to="/register" 
                className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all"
              >
                Try Registering Again
              </Link>
              <Link to="/login" className="block text-emerald-600 font-medium hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
