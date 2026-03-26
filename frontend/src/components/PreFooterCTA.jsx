import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const PreFooterCTA = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  // Don't show the CTA on auth or admin pages
  const hiddenPaths = ['/login', '/register', '/admin', '/admin/upload', '/dashboard'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="bg-slate-50 border-t border-slate-200 py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative background elements safely */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 sm:mb-8">
          {isAuthenticated ? (
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          ) : (
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          )}
        </div>
        
        {isAuthenticated ? (
          <>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight">
              Ready to continue your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">learning journey</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! Jump right back into your courses or explore new skills to master today.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight">
              Ready to kickstart your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">development career</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of students who are already learning highly sought-after skills for free on SkillValix. No credit card required, ever.
            </p>
          </>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {isAuthenticated ? (
             <Link
               to="/dashboard"
               className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
             >
               Go to Dashboard <ArrowRight className="w-4 h-4" />
             </Link>
          ) : (
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            to="/courses"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 transition-all duration-300 text-center"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreFooterCTA;
