import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { api, useAuthStore, clearCache } from '../store/authStore';
import { getCourseBySlug } from '../data/courseLoader';
import { Award, Loader2, AlertCircle, Download, CreditCard, CheckCircle, Tag, X, Percent } from 'lucide-react';
import { generatePDFFromDOM } from '../utils/pdfGenerator';
import CertificateTemplate from '../components/CertificateTemplate';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.skillvalix.com/api';

const QuizView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuthStore();
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
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [certPreparing, setCertPreparing] = useState(false);
  const [certStatusMessage, setCertStatusMessage] = useState('');
  const [exportCertData, setExportCertData] = useState(null);
  const certTemplateRef = useRef(null);

  // ── Coupon state ──────────────────────────────────────
  const [couponInput, setCouponInput]       = useState('');
  const [couponLoading, setCouponLoading]   = useState(false);
  const [couponResult, setCouponResult]     = useState(null); // { valid, ...data } | null
  const [couponError, setCouponError]       = useState('');

  const handleClientDownload = async (certId) => {
    if (!certId) return;
    setCertPreparing(true);
    setCertStatusMessage('Generating your Certificate PDF locally... Please wait.');

    setExportCertData({
      course,
      certificateId: certId,
      issueDate: existingCert?.issueDate || Date.now(),
      isEvent: course?.isEvent,
    });

    setTimeout(async () => {
      try {
        const fileName = `${course?.isEvent ? 'JobSimCertificate' : 'Certificate'}-${certId}`;
        await generatePDFFromDOM(certTemplateRef, fileName);
        setCertPreparing(false);
        setExportCertData(null);
        setCertStatusMessage('Certificate downloaded successfully!');
      } catch (err) {
        console.error(err);
        setCertPreparing(false);
        setExportCertData(null);
        setCertStatusMessage(`Failed to download: ${err.message || 'Please try again.'}`);
      }
    }, 500);
  };

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
          const certRes = await api.get('/certificates/mine');
          const pastCert = certRes.data.find(c =>
            (c.course?._id || c.course)?.toString() === courseId?.toString()
          );
          if (pastCert) {
            setAlreadyPassed(true);
            setExistingCert(pastCert);
            setGeneratedCertId(pastCert.certificateId);
          }
        } catch (certErr) {
          console.error('Could not fetch user certificates', certErr);
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
      alert('Please answer all questions.');
      return;
    }

    setSubmitting(true);
    const orderedAnswers = quiz.questions.map((_, i) => answers[i]);

    try {
      const res = await api.post(`/quizzes/${course._id}/submit`, { answers: orderedAnswers });
      setResult(res.data);

      if (res.data.passed && res.data.certificateId) {
        setGeneratedCertId(res.data.certificateId);
        clearCache('certs_mine');
      }

      if (!res.data.passed) {
        setQuiz(prev => ({ ...prev, attemptsUsed: (prev.attemptsUsed || 0) + 1 }));
      }
    } catch (err) {
      if (err.response?.data?.requirePayment) {
        setQuiz(prev => ({ ...prev, requirePayment: true }));
        // Do NOT setError here — the payment card UI below handles this state.
        // Setting error would trigger the early-return and hide the payment card.
      } else {
        setError('Error submitting quiz.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Validate coupon against backend ───────────────────
  const handleValidateCoupon = useCallback(async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }
    setCouponLoading(true);
    setCouponError('');
    setCouponResult(null);
    try {
      const res = await api.post('/coupons/validate', { code, courseId: course._id });
      setCouponResult(res.data);   // { valid:true, discountedAmountRupees, ... }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon.';
      setCouponError(msg);
      setCouponResult(null);
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, course]);

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponError('');
    setCouponInput('');
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const appliedCode = couponResult?.valid ? couponResult.code : undefined;
      const res = await api.post('/payments/razorpay-order', {
        courseId: course._id,
        couponCode: appliedCode,
      });
      const order = res.data;
      setPaymentInfo(order);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here',
        amount: order.amount,
        currency: order.currency,
        name: 'SkillValix Certification',
        description: order.isAdminTestMode
          ? 'Admin Test Mode Exam Unlock'
          : order.appliedCoupon
            ? `Exam Unlock — Coupon: ${order.appliedCoupon.code}`
            : 'Unlock Lifetime Exam Access and Unlimited Retakes',
        order_id: order.id,
        handler: async function (response) {
          try {
            setPaying(true);
            await api.post('/payments/razorpay-verify', {
              ...response,
              courseId: course._id,
              couponCode: appliedCode,
            });
            setQuiz(prev => ({
              ...prev,
              requirePayment: false,
              unlockedAttempts: 1000,
            }));
            setError(null);
          } catch (err) {
            alert('Verification failed. Please contact support.');
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: user?.name || 'Student',
          email: user?.email || '',
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to initialize payment.';
      alert(msg);
      setPaying(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="p-20 text-center text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Certification Exam | {course?.title} | SkillValix</title>
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
              You&apos;ve mastered this subject. Your certificate record is ready, and the PDF is being prepared safely for download.
            </p>
          ) : (
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              A score of {result.passingScore || quiz.passingScore}% is required to qualify. Review the course material and reattempt the exam when ready.
            </p>
          )}

          <div className="flex justify-center gap-4 flex-wrap">
            {result.passed && generatedCertId && (
              <button
                onClick={() => handleClientDownload(generatedCertId)}
                disabled={certPreparing}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white rounded-xl font-bold transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                {certPreparing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {certPreparing ? 'Generating PDF...' : 'Download Certificate'}
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

          {result.passed && certStatusMessage && (
            <p className="mt-5 text-sm font-medium text-slate-600">{certStatusMessage}</p>
          )}
        </div>
      ) : alreadyPassed ? (
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
            Your certificate is securely recorded. You can download your official PDF copy directly below.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {existingCert && generatedCertId && (
              <button
                onClick={() => handleClientDownload(generatedCertId)}
                disabled={certPreparing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                {certPreparing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {certPreparing ? 'Generating PDF...' : 'Download Certificate'}
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

          {certStatusMessage && (
            <p className="mt-5 text-sm font-medium text-slate-600">{certStatusMessage}</p>
          )}
        </div>
      ) : quiz?.requirePayment ? (
        <div className="bg-white border-2 border-indigo-100 rounded-3xl max-w-md mx-auto mt-8 shadow-2xl relative overflow-hidden flex flex-col">
          {/* ── Header ── */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center text-white relative">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl shadow-sm">
              {user?.role === 'admin' ? 'Admin Test' : 'Limited Time'}
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/30 shadow-inner">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-white">Unlock {course?.title}</h2>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              {user?.role === 'admin'
                ? 'Admin test mode: unlock this certification exam for Rs. 1 only.'
                : 'One-time fee to permanently unlock the certification exam and earn your credential.'}
            </p>
          </div>

          <div className="p-8 flex flex-col items-center bg-white">

            {/* ── Price display ── */}
            <div className="flex items-end justify-center gap-3 mb-6 w-full bg-slate-50 py-4 rounded-2xl border border-slate-100">
              {user?.role === 'admin' ? (
                <>
                  <span className="line-through text-slate-400 text-xl font-bold mb-1">Rs. 99</span>
                  <span className="text-5xl font-black text-slate-900 tracking-tight">Rs. 1</span>
                </>
              ) : couponResult?.valid ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <span className="line-through text-slate-400 text-xl font-bold">Rs. {couponResult.originalAmountRupees}</span>
                    <span className="text-5xl font-black text-emerald-600 tracking-tight">Rs. {couponResult.discountedAmountRupees}</span>
                  </div>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    <Percent className="w-3 h-3" />
                    You save Rs. {couponResult.savedAmountRupees}!
                  </span>
                </div>
              ) : (
                <>
                  <span className="line-through text-slate-400 text-xl font-bold mb-1">Rs. 499</span>
                  <span className="text-5xl font-black text-slate-900 tracking-tight">Rs. 99</span>
                </>
              )}
            </div>

            {/* ── Admin notice ── */}
            {user?.role === 'admin' && (
              <div className="w-full mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Admin-only test mode is active. Passing score is 30% and unlock fee is Rs. 1.
              </div>
            )}

            {/* ── Coupon input (non-admin only) ── */}
            {user?.role !== 'admin' && (
              <div className="w-full mb-6">
                {couponResult?.valid ? (
                  /* Applied coupon badge */
                  <div className="flex items-center justify-between gap-2 border border-emerald-300 bg-emerald-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-black text-emerald-700 truncate">{couponResult.code}</span>
                      <span className="text-xs text-emerald-600 truncate hidden sm:block">
                        — {couponResult.discountType === 'percentage'
                          ? `${couponResult.discountValue}% off`
                          : `Rs. ${couponResult.discountValue} off`}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 transition"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Coupon entry row */
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Have a coupon?</label>
                    <div className="flex gap-2">
                      <input
                        id="coupon-code-input"
                        type="text"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleValidateCoupon()}
                        placeholder="Enter coupon code"
                        maxLength={30}
                        className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                      />
                      <button
                        onClick={handleValidateCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold text-sm transition disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── What's included ── */}
            <div className="w-full mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">What&apos;s included</p>
              <ul className="text-sm text-slate-700 space-y-3.5 font-medium">
                <li className="flex items-center gap-3">
                  <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                  Valid securely for <b>{course?.title}</b> only
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                  Unlimited retakes with no extra fees
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                  Instant verifiable certificate
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm"><CheckCircle className="w-3.5 h-3.5" /></span>
                  {user?.role === 'admin' ? 'Admin-only reduced test pricing' : 'Shareable on LinkedIn and resumes'}
                </li>
              </ul>
            </div>

            {/* ── Pay button ── */}
            <button
              onClick={handlePayment}
              disabled={paying}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
            >
              {paying ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform" />}
              <span>
                {paying
                  ? 'Processing...'
                  : user?.role === 'admin'
                    ? `Pay Rs. ${paymentInfo?.displayAmountRupees || 1} for Test Access`
                    : couponResult?.valid
                      ? `Pay Rs. ${couponResult.discountedAmountRupees} Now`
                      : 'Pay Rs. 99 Now'}
              </span>
            </button>
            <p className="text-[10px] text-slate-400 mt-5 font-semibold uppercase tracking-widest text-center">
              Secured by Razorpay
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="mb-8 border-b border-slate-200 pb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-slate-900">Certification Exam</h1>
              <p className="text-slate-600 font-medium">{course?.title} | {quiz?.questions?.length} Questions | {quiz?.passingScore}% required</p>
              {quiz?.isAdminTestMode && (
                <p className="mt-2 text-sm font-semibold text-amber-700">
                  Admin test mode: 30% passing score is active for your account only.
                </p>
              )}
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 text-center">
              Attempt<br /><span className="text-lg text-indigo-600">{quiz?.attemptsUsed + 1}</span><span className="text-slate-400">/∞</span>
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
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </form>
      )}

      {/* Hidden local template for compiling PDFs visually on client thread */}
      {exportCertData && (
        <CertificateTemplate
          ref={certTemplateRef}
          studentName={user?.name || 'Student'}
          courseTitle={exportCertData.course?.title || 'Certification'}
          certificateId={exportCertData.certificateId}
          issueDate={new Date(exportCertData.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric'})}
          verifyUrl={`${window.location.origin}/verify/${exportCertData.certificateId}`}
          isEvent={exportCertData.isEvent}
        />
      )}
    </div>
  );
};

export default QuizView;
