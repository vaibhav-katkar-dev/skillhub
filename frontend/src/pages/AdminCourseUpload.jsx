import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, useAuthStore, clearCache } from '../store/authStore';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AdminCourseUpload = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (location.state && location.state.editSlug) {
      setLoading(true);
      api.get(`/courses/${location.state.editSlug}`)
        .then(res => {
          const { course, lessons, quiz } = res.data;
          const template = {
            course: {
              title: course.title,
              slug: course.slug,
              description: course.description,
              image: course.image || '',
              theme: course.theme || 'blue',
              published: course.published
            },
            lessons: lessons.map(l => ({
              title: l.title,
              content: l.content,
              videoUrl: l.videoUrl || '',
              duration: l.duration || 10,
              order: l.order
            })),
            quiz: quiz ? {
              title: quiz.title || 'Course Quiz',
              passingScore: quiz.passingScore || 60,
              questions: quiz.questions.map(q => ({
                questionText: q.questionText,
                options: q.options,
                correctOptionIndex: q.correctOptionIndex
              }))
            } : null
          };
          setJsonText(JSON.stringify(template, null, 2));
          setSuccess(`Loaded "${course.title}" for editing!`);
          window.history.replaceState({}, document.title);
        })
        .catch(err => {
          setError('Failed to load course for editing.');
        })
        .finally(() => setLoading(false));
    }
  }, [location.state]);

  // If not admin, restrict access
  if (loading === false && (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-600 mt-2">You must be an administrator to view this page.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Return Home</button>
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!jsonText.trim()) return;

    setError(null);
    setSuccess(null);
    
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/courses/upload', parsedData);
      clearCache('courses_all'); // bust cache so new image shows immediately
      setSuccess(`Course "${res.data.slug}" uploaded successfully!`);
      setJsonText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload course. Check console for details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = (e) => {
    e.preventDefault();
    const template = {
      course: {
        title: "Sample Course Title",
        slug: "sample-course-title",
        description: "A comprehensive description of what this course covers.",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
        theme: "blue",
        published: true
      },
      lessons: [
        {
          title: "Introduction to the Course",
          content: "<p>Welcome to the sample course! This is the first lesson.</p>",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: 15
        }
      ],
      quiz: {
        title: "Course Final Quiz",
        passingScore: 60,
        questions: [
          {
            questionText: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctOptionIndex: 1
          }
        ]
      }
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Admin: Upload Course | SkillValix</title>
      </Helmet>

      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <UploadCloud className="w-8 h-8 text-blue-600" />
          Bulk Course Uploader
        </h1>
        <p className="text-slate-600 font-medium mt-2">
          Paste the complete JSON structure containing the course, lessons, and quiz data to automatically publish a new course.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-emerald-800 font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleUpload} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-slate-700 font-mono text-sm">COURSE_DATA.json</span>
          <button type="button" onClick={handleDownloadTemplate} className="text-blue-600 text-sm font-semibold hover:underline">Download Template</button>
        </div>
        <div className="p-1">
          <textarea
            className="w-full h-[500px] p-5 font-mono text-sm bg-slate-900 text-slate-200 resize-y focus:outline-none rounded-b-xl"
            placeholder='{ "course": { "title": "New Course", "slug": "new-course", "description": "...", "theme": "blue", "published": true }, "lessons": [], "quiz": {} }'
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck="false"
          ></textarea>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={loading || !jsonText.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UploadCloud className="w-5 h-5" /> Execute Upload</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseUpload;
