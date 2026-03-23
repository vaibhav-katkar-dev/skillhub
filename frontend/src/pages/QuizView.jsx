import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { api, useAuthStore, clearCache } from '../store/authStore';
import { getCourseBySlug } from '../data/courseLoader';
import { Award, Loader2, AlertCircle, Download } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QuizView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [generatedCertId, setGeneratedCertId] = useState(null);
  const [error, setError] = useState(null);
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [existingCert, setExistingCert] = useState(null);
  const [retakeMode, setRetakeMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    
    const fetchQuiz = async () => {
      try {
        const localCourseData = await getCourseBySlug(slug);
        if (!localCourseData?.course?._id) {
          throw new Error('Course not found in static data');
        }

        const courseId = localCourseData.course._id;
        setCourse(localCourseData.course);

        const quizRes = await api.get(`/quizzes/${courseId}`);
        setQuiz(quizRes.data);

        try {
          // Always fetch fresh — don't use cache here to get accurate completion status
          const certRes = await api.get('/certificates/mine');
          const pastCert = certRes.data.find(c => 
            (c.course?._id || c.course)?.toString() === courseId?.toString()
          );
          if (pastCert) {
            setAlreadyPassed(true);
            setExistingCert(pastCert);
          }
        } catch (certErr) {
          console.error("Could not fetch user certificates", certErr);
        }
      } catch {
        setError('Quiz not found or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [slug, isAuthenticated, navigate]);

  const handleOptionSelect = (qIndex, oIndex) => {
    setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions.");
      return;
    }

    setSubmitting(true);
    const orderedAnswers = quiz.questions.map((_, i) => answers[i]);

    try {
      const res = await api.post(`/quizzes/${course._id}/submit`, { answers: orderedAnswers });
      setResult(res.data);
      
      // Certificate is now returned directly from quiz submit endpoint
      if (res.data.passed && res.data.certificateId) {
        setGeneratedCertId(res.data.certificateId);
        clearCache('certs_mine');
      }
    } catch {
      setError('Error submitting quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-20 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Quiz | {course?.title} | SkillHub</title>
      </Helmet>

      {result ? (
        <div className={`p-8 rounded-3xl border shadow-sm text-center ${result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex justify-center mb-6">
            {result.passed ? (
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-10 h-10 text-emerald-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
            )}
          </div>
          <h2 className={`text-4xl font-extrabold mb-4 ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
            {result.passed ? 'Congratulations!' : 'Almost There!'}
          </h2>
          <p className="text-xl text-slate-700 mb-6 font-medium">
            You scored <span className="font-bold text-slate-900">{result.score}%</span> on the quiz.
          </p>
          
          {result.passed ? (
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You've mastered this subject. Your verifiable PDF certificate has been generated successfully.
            </p>
          ) : (
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You need {quiz.passingScore}% to pass. Don't worry, you can always review the material and try again.
            </p>
          )}

          <div className="flex justify-center gap-4 flex-wrap">
            {result.passed && generatedCertId && (
              <button 
                onClick={() => window.open(`${API_BASE}/certificates/download/${generatedCertId}`, '_blank')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Certificate
              </button>
            )}
            
            <button 
              onClick={() => {
                clearCache('certs_mine');
                clearCache('courses_all');
                navigate('/dashboard');
              }}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-medium transition-colors border border-slate-300 shadow-sm"
            >
              Go to Dashboard
            </button>
            
            {!result.passed && (
              <button 
                onClick={() => { setResult(null); setAnswers({}); }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-md shadow-blue-500/20"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      ) : (alreadyPassed && !retakeMode) ? (
        <div className="p-8 rounded-3xl border shadow-sm text-center bg-blue-50 border-blue-200">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-blue-700">
            Already Completed!
          </h2>
          <p className="text-xl text-slate-700 mb-6 font-medium">
            You have already cleared this qualification quiz.
          </p>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            You can download your certificate here, or you can retake the quiz if you'd like to test your knowledge again.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {existingCert && (
              <button 
                onClick={() => window.open(`${API_BASE}/certificates/download/${existingCert.certificateId}`, '_blank')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Certificate
              </button>
            )}
            
            <button 
              onClick={() => {
                clearCache('certs_mine');
                clearCache('courses_all');
                navigate('/dashboard');
              }}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-medium transition-colors border border-slate-300 shadow-sm"
            >
              Go to Dashboard
            </button>

            <button 
              onClick={() => setRetakeMode(true)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-slate-800/20"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Final Assessment</h1>
            <p className="text-slate-600 font-medium">{course?.title} • {quiz?.questions?.length} Questions • {quiz?.passingScore}% to pass</p>
          </div>

          <div className="space-y-10">
            {quiz?.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  <span className="text-blue-600 mr-2">{qIndex + 1}.</span> {q.questionText}
                </h3>
                <div className="space-y-3">
                  {q.options.map((opt, oIndex) => (
                    <label 
                      key={oIndex} 
                      className={`flex items-center p-4 rounded-lg cursor-pointer border transition-all ${
                        answers[qIndex] === oIndex 
                        ? 'border-blue-400 bg-blue-50/50 shadow-sm' 
                        : 'border-slate-300 hover:border-blue-300 bg-white shadow-sm'
                      }`}
                      onClick={() => handleOptionSelect(qIndex, oIndex)}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${
                        answers[qIndex] === oIndex ? 'border-blue-500 bg-white' : 'border-slate-300 bg-slate-50'
                      }`}>
                        {answers[qIndex] === oIndex && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <span className="text-slate-700 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Assessment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuizView;
