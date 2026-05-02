import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { login, googleLogin, resendVerification } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed. Please try again.');
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const data = await resendVerification(email);
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50">
      <Helmet>
        <title>Login | SkillValix Learning</title>
        <meta name="description" content="Sign in to your SkillValix account to track progress and earn certificates." />
      </Helmet>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-full">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Welcome Back</h2>
        
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-md mb-4 text-sm text-center">{success}</div>}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm text-center">
            {error}
            {error.toLowerCase().includes('verify') && (
              <button 
                onClick={handleResend}
                disabled={resendLoading}
                className="block mx-auto mt-2 text-blue-600 font-semibold hover:underline disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Link'}
              </button>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              autoComplete="email"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              autoComplete="current-password"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-[34px] text-slate-500 hover:text-slate-700 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-sm text-slate-500 bg-white">or</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
            theme="outline"
            size="large"
            width="360"
          />
        </div>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
