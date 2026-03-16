import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { api, useAuthStore } from '../store/authStore';
import { PlayCircle, ShieldCheck, ListTodo, Loader2, BookOpen, Clock } from 'lucide-react';

const CourseDetail = () => {
  const { slug } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourseData(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    
    const savedProgress = JSON.parse(localStorage.getItem('skillhub_progress')) || {};
    if (savedProgress[slug]) {
      setCompletedLessons(savedProgress[slug]);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-slate-900">Course not found</h2>
        <Link to="/courses" className="text-blue-600 hover:text-blue-500 mt-4 inline-block font-medium">Return to Courses</Link>
      </div>
    );
  }

  const { course, lessons } = courseData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{course.title} | SkillHub</title>
        <meta name="description" content={course.description.substring(0, 155)} />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-white">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold tracking-wide backdrop-blur-sm">
            Course Module
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <ListTodo className="w-4 h-4 text-blue-200" /> {lessons.length} Modules
            </div>
            <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-orange-200" /> ~2 Hours
            </div>
            <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Certificate Included
            </div>
          </div>
        </div>
        
        {/* Progress Bar Override (Demo) */}
        <div className="relative z-10 mt-8 bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-white text-sm font-semibold">Your Progress</span>
            <span className="text-blue-200 text-sm font-bold">{Math.round((completedLessons.length / (lessons.length || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.round((completedLessons.length / (lessons.length || 1)) * 100)}%` }}></div>
          </div>
          <p className="text-white/70 text-xs mt-2 font-medium">{completedLessons.length} of {lessons.length} lessons completed</p>
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          Curriculum <span className="text-sm font-normal text-slate-500">({lessons.length} Modules)</span>
        </h2>
        <div className="space-y-4">
          {lessons.map((lesson, idx) => (
            <Link 
              key={lesson._id} 
              to={`/courses/${slug}/lesson/${lesson._id}`}
              className="group flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors mr-6 font-medium">
                {idx + 1}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h3>
              </div>
              <PlayCircle className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
            </Link>
          ))}
        </div>

        {/* Final Quiz CTA */}
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-emerald-800 mb-1">Final Assessment</h3>
            <p className="text-emerald-700">Pass the quiz spanning all modules to generate your verified certificate.</p>
          </div>
          <Link 
            to={`/courses/${slug}/quiz`}
            className="flex-shrink-0 whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium shadow-md shadow-emerald-600/20 transition-all active:scale-95 text-center"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
