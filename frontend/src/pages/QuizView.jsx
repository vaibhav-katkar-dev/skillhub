import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { api, useAuthStore, clearCache } from '../store/authStore';
import { getCourseBySlug } from '../data/courseLoader';
import { Award, Loader2, AlertCircle, Download, CreditCard, RefreshCcw, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QuizView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthStore();
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
  const [paying, setPaying] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
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
  }, [slug, isAuthenticated, navigate, authLoading]);

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

      // Decrement attempts locally since submit was successful (it incremented on backend)
      if (!res.data.passed) {
        setQuiz(prev => ({ ...prev, attemptsUsed: (prev.attemptsUsed || 0) + 1 }));
      }
    } catch (err) {
      if (err.response?.data?.requirePayment) {
        setQuiz(prev => ({ ...prev, requirePayment: true }));
        setError('Payment required to access exam.');
      } else {
        setError('Error submitting quiz.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await api.post('/payments/razorpay-order', { courseId: course._id });
      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here',
        amount: order.amount,
        currency: order.currency,
        name: 'SkillHub Certification',
        description: `Unlock Lifetime Exam Access & Unlimited Retakes`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post('/payments/razorpay-verify', {
              ...response,
              courseId: course._id
            });
            // Update attempts locally and continue
            setQuiz(prev => ({ 
              ...prev, 
              requirePayment: false,
              unlockedAttempts: 1000
            }));
            setError(null);
          } catch (err) {
            alert('Verification Failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || 'Student',
          email: user?.email || ''
        },
        theme: { color: '#4f46e5' }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();
    } catch(err) {
      alert('Failed to initialize payment.');
    } finally {
      setPaying(false);
    }
  };

  if (authLoading || loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-20 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Certification Exam | {course?.title} | SkillHub</title>
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
            You scored <span className="font-bold text-slate-900">{result.score}%</span> on the Certification Exam.
          </p>
          
          {result.passed ? (
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You've mastered this subject. Your verifiable PDF certificate has been generated successfully.
            </p>
          ) : (
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              A score of {quiz.passingScore}% is required to qualify. Review the course material and reattempt the exam when ready.
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
                Retake Exam
              </button>
            )}
          </div>
        </div>
      ) : (alreadyPassed) ? (
        <div className="p-8 rounded-3xl border shadow-sm text-center bg-blue-50 border-blue-200">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-blue-700">
            Exam Passed!
          </h2>
          <p className="text-xl text-slate-700 mb-6 font-medium">
            You have already cleared this Certification Exam.
          </p>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Your certificate is ready to download. You do not need to take this exam again.
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
          </div>
        </div>
      ) : (quiz?.requirePayment) ? (
        <div className="bg-white border-2 border-indigo-100 rounded-3xl max-w-md mx-auto mt-8 shadow-2xl relative overflow-hidden flex flex-col">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center text-white relative">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl shadow-sm">
                Limited Time
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/30 shadow-inner">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-white">
               Unlock {course?.title}
            </h2>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-xs mx-auto">
               One-time fee to permanently unlock the certification exam and earn your credential.
            </p>
          </div>

          {/* Body Section */}
          <div className="p-8 flex flex-col items-center bg-white">
            
            {/* Price Box */}
            <div className="flex items-end justify-center gap-3 mb-8 w-full bg-slate-50 py-4 rounded-2xl border border-slate-100">
              <span className="line-through text-slate-400 text-xl font-bold mb-1">₹499</span>
              <span className="text-5xl font-black text-slate-900 tracking-tight">₹49</span>
            </div>

            {/* Feature List */}
            <div className="w-full mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">What's included</p>
              <ul className="text-sm text-slate-700 space-y-3.5 font-medium">
                 <li className="flex items-center gap-3">
                    <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                    Valid securely for <b>{course?.title}</b> only
                 </li>
                 <li className="flex items-center gap-3">
                    <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                    Unlimited Retakes (No extra fees)
                 </li>
                 <li className="flex items-center gap-3">
                    <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                    Instant Verifiable Certificate
                 </li>
                 <li className="flex items-center gap-3">
                    <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                    Shareable on LinkedIn & Resumes
                 </li>
              </ul>
            </div>

            {/* CTA */}
            <button 
              onClick={handlePayment}
              disabled={paying}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
            >
              {paying ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform" />}
              <span>Pay Safely Now</span>
            </button>
            <p className="text-[10px] text-slate-400 mt-5 font-semibold uppercase tracking-widest text-center">
               💳 Secured by Razorpay
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="mb-8 border-b border-slate-200 pb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-slate-900">Certification Exam</h1>
              <p className="text-slate-600 font-medium">{course?.title} • {quiz?.questions?.length} Questions • {quiz?.passingScore}% required</p>
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 text-center">
              Attempt<br/><span className="text-lg text-indigo-600">{quiz?.attemptsUsed + 1}</span><span className="text-slate-400">/∞</span>
            </div>
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
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Exam'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuizView;
