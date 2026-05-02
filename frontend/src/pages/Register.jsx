import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { register, googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError('Google signup failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await register(name, email, password, role);
      setSuccess(data.message || 'Registration successful! Please check your email.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50">
      <Helmet>
        <title>Register | SkillValix Learning</title>
        <meta name="description" content="Create a new SkillValix account to start learning and earning certificates today." />
      </Helmet>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-emerald-50 rounded-full">
            <UserPlus className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Create Account</h2>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm text-center">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-md mb-4 text-sm text-center">{success}</div>}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        )}

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
            width="100%"
            text="signup_with"
          />
        </div>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
