import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { useAuthStore } from './store/authStore';
import { preloadCourses } from './data/courseLoader';

// Always-on shell components — kept eager
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PreFooterCTA from './components/PreFooterCTA';
import WhatsAppJoinPopup from './components/WhatsAppJoinPopup';

// Critical above-the-fold pages — eager
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// All other pages — lazily loaded on first navigation
const Courses          = lazy(() => import('./pages/Courses'));
const CourseDetail     = lazy(() => import('./pages/CourseDetail'));
const LessonView       = lazy(() => import('./pages/LessonView'));
const QuizView         = lazy(() => import('./pages/QuizView'));
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const VerifyCert       = lazy(() => import('./pages/VerifyCert'));
const Blog             = lazy(() => import('./pages/Blog'));
const BlogPost         = lazy(() => import('./pages/BlogPost'));
const ForgotPassword   = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword    = lazy(() => import('./pages/ResetPassword'));
const PublicProfile    = lazy(() => import('./pages/PublicProfile'));
const AdminPanel       = lazy(() => import('./pages/AdminPanel'));
const PrivacyPolicy    = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService   = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy     = lazy(() => import('./pages/RefundPolicy'));
const CookiePolicy     = lazy(() => import('./pages/CookiePolicy'));
const Events           = lazy(() => import('./pages/Events'));
const HackathonDetail  = lazy(() => import('./pages/HackathonDetail'));
const JobSimulation    = lazy(() => import('./pages/JobSimulation'));
const HostHackathon    = lazy(() => import('./pages/HostHackathon'));
const CampusAmbassador = lazy(() => import('./pages/CampusAmbassador'));
const FreeCourses      = lazy(() => import('./pages/FreeCourses'));
const Certification    = lazy(() => import('./pages/Certification'));

// Lightweight page-transition loader shown during lazy chunk fetch
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid #e0e7ff',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
    
    const t1 = setTimeout(() => window.scrollTo(0, 0), 10);
    const t2 = setTimeout(() => window.scrollTo(0, 0), 100);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);
  return null;
}

function AppContent() {
  const { loadUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    loadUser();
    preloadCourses();
  }, [loadUser]);

  const isCoursePath = location.pathname.startsWith('/courses/');
  const isCoursesList = location.pathname === '/courses';
  const isQuizPath = location.pathname.includes('/quiz');
  const isPublicProfile = location.pathname.startsWith('/u/');
  const isVerifyPath = location.pathname.startsWith('/verify/') || location.pathname.startsWith('/verify-event');
  const isLearningView = (isCoursePath && !isCoursesList) || isQuizPath;
  const isCleanView = isPublicProfile || isVerifyPath;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500/30">
      {!isCleanView && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/courses/:slug/lesson/:lessonId" element={<LessonView />} />
            <Route path="/courses/:slug/quiz" element={<QuizView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/u/:id" element={<PublicProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/upload" element={<AdminPanel />} />
            <Route path="/verify" element={<VerifyCert />} />
            <Route path="/verify/:certId" element={<VerifyCert />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/hackathons" element={<Events />} />
            <Route path="/hackathons/:id" element={<HackathonDetail />} />
            <Route path="/job-simulation/:id" element={<JobSimulation />} />
            <Route path="/events/job-simulation/:id" element={<JobSimulation />} />
            <Route path="/verify-event/:certId" element={<VerifyCert />} />
            <Route path="/verify-event" element={<VerifyCert />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/host" element={<HostHackathon />} />
            <Route path="/campus-ambassador" element={<CampusAmbassador />} />
            <Route path="/free-courses" element={<FreeCourses />} />
            <Route path="/certification" element={<Certification />} />
          </Routes>
        </Suspense>
      </main>
      {!isLearningView && !isCleanView && <PreFooterCTA />}
      {!isLearningView && !isCleanView && <Footer />}
      <WhatsAppJoinPopup />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
        <Analytics />
      </Router>
    </HelmetProvider>
  );
}

export default App;
