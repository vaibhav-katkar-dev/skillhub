import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { useAuthStore } from './store/authStore';
import { preloadCourses } from './data/courseLoader';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PreFooterCTA from './components/PreFooterCTA';
import WhatsAppJoinPopup from './components/WhatsAppJoinPopup';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import Dashboard from './pages/Dashboard';
import VerifyCert from './pages/VerifyCert';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicProfile from './pages/PublicProfile';

import AdminPanel from './pages/AdminPanel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Events from './pages/Events';
import HackathonDetail from './pages/HackathonDetail';
import JobSimulation from './pages/JobSimulation';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
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
          <Route path="/events" element={<Events />} />
          <Route path="/events/hackathon/:id" element={<HackathonDetail />} />
          <Route path="/job-simulation/:id" element={<JobSimulation />} />
          <Route path="/events/job-simulation/:id" element={<JobSimulation />} />
          <Route path="/verify-event/:certId" element={<VerifyCert />} />
          <Route path="/verify-event" element={<VerifyCert />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Routes>
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
