import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { u as useAuthStore, d as api, H as Helmet, e as clearCache, c as getCourseBySlug } from "../main.mjs";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Award, AlertCircle, Download, Percent, Tag, X, CheckCircle, CreditCard } from "lucide-react";
import { C as CertificateTemplate, g as generatePDFFromDOM } from "./CertificateTemplate-DB_rTmRV.js";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
import "html-to-image";
import "jspdf";
import "qrcode.react";
const QuizView = () => {
  var _a, _b;
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
  const [certStatusMessage, setCertStatusMessage] = useState("");
  const [exportCertData, setExportCertData] = useState(null);
  const certTemplateRef = useRef(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const handleClientDownload = async (certId) => {
    if (!certId) return;
    setCertPreparing(true);
    setCertStatusMessage("Generating your Certificate PDF locally... Please wait.");
    setExportCertData({
      course,
      certificateId: certId,
      issueDate: (existingCert == null ? void 0 : existingCert.issueDate) || Date.now(),
      isEvent: course == null ? void 0 : course.isEvent
    });
    setTimeout(async () => {
      try {
        const fileName = `${(course == null ? void 0 : course.isEvent) ? "JobSimCertificate" : "Certificate"}-${certId}`;
        await generatePDFFromDOM(certTemplateRef, fileName);
        setCertPreparing(false);
        setExportCertData(null);
        setCertStatusMessage("Certificate downloaded successfully!");
      } catch (err) {
        console.error(err);
        setCertPreparing(false);
        setExportCertData(null);
        setCertStatusMessage(`Failed to download: ${err.message || "Please try again."}`);
      }
    }, 500);
  };
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const fetchQuiz = async () => {
      var _a2;
      try {
        const localCourseData = await getCourseBySlug(slug);
        if (!((_a2 = localCourseData == null ? void 0 : localCourseData.course) == null ? void 0 : _a2._id)) {
          throw new Error("Course not found in static data");
        }
        const courseId = localCourseData.course._id;
        setCourse(localCourseData.course);
        const quizRes = await api.get(`/quizzes/${courseId}`);
        setQuiz(quizRes.data);
        try {
          const certRes = await api.get("/certificates/mine");
          const pastCert = certRes.data.find(
            (c) => {
              var _a3, _b2;
              return ((_b2 = ((_a3 = c.course) == null ? void 0 : _a3._id) || c.course) == null ? void 0 : _b2.toString()) === (courseId == null ? void 0 : courseId.toString());
            }
          );
          if (pastCert) {
            setAlreadyPassed(true);
            setExistingCert(pastCert);
            setGeneratedCertId(pastCert.certificateId);
          }
        } catch (certErr) {
          console.error("Could not fetch user certificates", certErr);
        }
      } catch {
        setError("Quiz not found or you do not have permission.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [slug, isAuthenticated, navigate, authLoading]);
  const handleOptionSelect = (qIndex, oIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };
  const handleSubmit = async (e) => {
    var _a2, _b2;
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
      if (res.data.passed && res.data.certificateId) {
        setGeneratedCertId(res.data.certificateId);
        clearCache("certs_mine");
      }
      if (!res.data.passed) {
        setQuiz((prev) => ({ ...prev, attemptsUsed: (prev.attemptsUsed || 0) + 1 }));
      }
    } catch (err) {
      if ((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.requirePayment) {
        setQuiz((prev) => ({ ...prev, requirePayment: true }));
      } else {
        setError("Error submitting quiz.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const handleValidateCoupon = useCallback(async () => {
    var _a2, _b2;
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    setCouponResult(null);
    try {
      const res = await api.post("/coupons/validate", { code, courseId: course._id });
      setCouponResult(res.data);
    } catch (err) {
      const msg = ((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Invalid or expired coupon.";
      setCouponError(msg);
      setCouponResult(null);
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, course]);
  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponError("");
    setCouponInput("");
  };
  const handlePayment = async () => {
    var _a2, _b2;
    setPaying(true);
    try {
      const appliedCode = (couponResult == null ? void 0 : couponResult.valid) ? couponResult.code : void 0;
      const res = await api.post("/payments/razorpay-order", {
        courseId: course._id,
        couponCode: appliedCode
      });
      const order = res.data;
      setPaymentInfo(order);
      const options = {
        key: "rzp_live_Rg7fc3FV1mTmCM",
        amount: order.amount,
        currency: order.currency,
        name: "SkillValix Certification",
        description: order.isAdminTestMode ? "Admin Test Mode Exam Unlock" : order.appliedCoupon ? `Exam Unlock — Coupon: ${order.appliedCoupon.code}` : "Unlock Lifetime Exam Access and Unlimited Retakes",
        order_id: order.id,
        handler: async function(response) {
          try {
            setPaying(true);
            await api.post("/payments/razorpay-verify", {
              ...response,
              courseId: course._id,
              couponCode: appliedCode
            });
            setQuiz((prev) => ({
              ...prev,
              requirePayment: false,
              unlockedAttempts: 1e3
            }));
            setError(null);
          } catch (err) {
            alert("Verification failed. Please contact support.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: (user == null ? void 0 : user.name) || "Student",
          email: (user == null ? void 0 : user.email) || ""
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function() {
            setPaying(false);
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function(response) {
        alert("Payment failed: " + response.error.description);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      const msg = ((_b2 = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Failed to initialize payment.";
      alert(msg);
      setPaying(false);
    }
  };
  if (authLoading || loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "p-20 text-center text-red-500 font-medium", children: error });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsxs("title", { children: [
      "Certification Exam | ",
      course == null ? void 0 : course.title,
      " | SkillValix"
    ] }) }),
    result ? /* @__PURE__ */ jsxs("div", { className: `p-8 rounded-3xl border shadow-sm text-center ${result.passed ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: result.passed ? /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce", children: /* @__PURE__ */ jsx(Award, { className: "w-10 h-10 text-emerald-600" }) }) : /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-red-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-10 h-10 text-red-500" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: `text-4xl font-extrabold mb-4 ${result.passed ? "text-emerald-700" : "text-red-700"}`, children: result.passed ? "Congratulations!" : "Almost There!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xl text-slate-700 mb-6 font-medium", children: [
        "You scored ",
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
          result.score,
          "%"
        ] }),
        " on the Certification Exam."
      ] }),
      result.passed ? /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-8 max-w-md mx-auto", children: "You've mastered this subject. Your certificate record is ready, and the PDF is being prepared safely for download." }) : /* @__PURE__ */ jsxs("p", { className: "text-slate-600 mb-8 max-w-md mx-auto", children: [
        "A score of ",
        result.passingScore || quiz.passingScore,
        "% is required to qualify. Review the course material and reattempt the exam when ready."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 flex-wrap", children: [
        result.passed && generatedCertId && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleClientDownload(generatedCertId),
            disabled: certPreparing,
            className: "px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white rounded-xl font-bold transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-2",
            children: [
              certPreparing ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "w-5 h-5" }),
              certPreparing ? "Generating PDF..." : "Download Certificate"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              clearCache("certs_mine");
              clearCache("courses_all");
              navigate("/dashboard");
            },
            className: "px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-medium transition-colors border border-slate-300 shadow-sm",
            children: "Go to Dashboard"
          }
        ),
        !result.passed && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setResult(null);
              setAnswers({});
            },
            className: "px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-md shadow-blue-500/20",
            children: "Retake Exam"
          }
        )
      ] }),
      result.passed && certStatusMessage && /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-slate-600", children: certStatusMessage })
    ] }) : alreadyPassed ? /* @__PURE__ */ jsxs("div", { className: "p-8 rounded-3xl border shadow-sm text-center bg-blue-50 border-blue-200", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Award, { className: "w-10 h-10 text-blue-600" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold mb-4 text-blue-700", children: "Exam Passed!" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-slate-700 mb-6 font-medium", children: "You have already cleared this Certification Exam." }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-8 max-w-md mx-auto", children: "Your certificate is securely recorded. You can download your official PDF copy directly below." }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 flex-wrap", children: [
        existingCert && generatedCertId && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleClientDownload(generatedCertId),
            disabled: certPreparing,
            className: "px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2",
            children: [
              certPreparing ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "w-5 h-5" }),
              certPreparing ? "Generating PDF..." : "Download Certificate"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              clearCache("certs_mine");
              clearCache("courses_all");
              navigate("/dashboard");
            },
            className: "px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-medium transition-colors border border-slate-300 shadow-sm",
            children: "Go to Dashboard"
          }
        )
      ] }),
      certStatusMessage && /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-slate-600", children: certStatusMessage })
    ] }) : (quiz == null ? void 0 : quiz.requirePayment) ? /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-indigo-100 rounded-3xl max-w-md mx-auto mt-8 shadow-2xl relative overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center text-white relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl shadow-sm", children: (user == null ? void 0 : user.role) === "admin" ? "Admin Test" : "Limited Time" }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/30 shadow-inner", children: /* @__PURE__ */ jsx(Award, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-extrabold mb-2 text-white", children: [
          "Unlock ",
          course == null ? void 0 : course.title
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-indigo-100 text-sm font-medium leading-relaxed max-w-xs mx-auto", children: (user == null ? void 0 : user.role) === "admin" ? "Admin test mode: unlock this certification exam for Rs. 1 only." : "One-time fee to permanently unlock the certification exam and earn your credential." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8 flex flex-col items-center bg-white", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-3 mb-6 w-full bg-slate-50 py-4 rounded-2xl border border-slate-100", children: (user == null ? void 0 : user.role) === "admin" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "line-through text-slate-400 text-xl font-bold mb-1", children: "Rs. 99" }),
          /* @__PURE__ */ jsx("span", { className: "text-5xl font-black text-slate-900 tracking-tight", children: "Rs. 1" })
        ] }) : (couponResult == null ? void 0 : couponResult.valid) ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "line-through text-slate-400 text-xl font-bold", children: [
              "Rs. ",
              couponResult.originalAmountRupees
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-5xl font-black text-emerald-600 tracking-tight", children: [
              "Rs. ",
              couponResult.discountedAmountRupees
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "mt-1.5 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full", children: [
            /* @__PURE__ */ jsx(Percent, { className: "w-3 h-3" }),
            "You save Rs. ",
            couponResult.savedAmountRupees,
            "!"
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "line-through text-slate-400 text-xl font-bold mb-1", children: "Rs. 499" }),
          /* @__PURE__ */ jsx("span", { className: "text-5xl font-black text-slate-900 tracking-tight", children: "Rs. 99" })
        ] }) }),
        (user == null ? void 0 : user.role) === "admin" && /* @__PURE__ */ jsx("div", { className: "w-full mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800", children: "Admin-only test mode is active. Passing score is 30% and unlock fee is Rs. 1." }),
        (user == null ? void 0 : user.role) !== "admin" && /* @__PURE__ */ jsx("div", { className: "w-full mb-6", children: (couponResult == null ? void 0 : couponResult.valid) ? (
          /* Applied coupon badge */
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 border border-emerald-300 bg-emerald-50 rounded-xl px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-emerald-600 shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black text-emerald-700 truncate", children: couponResult.code }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-emerald-600 truncate hidden sm:block", children: [
                "— ",
                couponResult.discountType === "percentage" ? `${couponResult.discountValue}% off` : `Rs. ${couponResult.discountValue} off`
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleRemoveCoupon,
                className: "shrink-0 p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 transition",
                title: "Remove coupon",
                children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
              }
            )
          ] })
        ) : (
          /* Coupon entry row */
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest", children: "Have a coupon?" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "coupon-code-input",
                  type: "text",
                  value: couponInput,
                  onChange: (e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError("");
                  },
                  onKeyDown: (e) => e.key === "Enter" && handleValidateCoupon(),
                  placeholder: "Enter coupon code",
                  maxLength: 30,
                  className: "flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleValidateCoupon,
                  disabled: couponLoading || !couponInput.trim(),
                  className: "px-4 py-2.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold text-sm transition disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap",
                  children: [
                    couponLoading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4" }),
                    "Apply"
                  ]
                }
              )
            ] }),
            couponError && /* @__PURE__ */ jsxs("p", { className: "text-xs text-rose-600 font-semibold flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }),
              " ",
              couponError
            ] })
          ] })
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full mb-8", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2", children: "What's included" }),
          /* @__PURE__ */ jsxs("ul", { className: "text-sm text-slate-700 space-y-3.5 font-medium", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }) }),
              "Valid securely for ",
              /* @__PURE__ */ jsx("b", { children: course == null ? void 0 : course.title }),
              " only"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }) }),
              "Unlimited retakes with no extra fees"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }) }),
              "Instant verifiable certificate"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }) }),
              (user == null ? void 0 : user.role) === "admin" ? "Admin-only reduced test pricing" : "Shareable on LinkedIn and resumes"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handlePayment,
            disabled: paying,
            className: "w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group",
            children: [
              paying ? /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ jsx(CreditCard, { className: "w-6 h-6 group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsx("span", { children: paying ? "Processing..." : (user == null ? void 0 : user.role) === "admin" ? `Pay Rs. ${(paymentInfo == null ? void 0 : paymentInfo.displayAmountRupees) || 1} for Test Access` : (couponResult == null ? void 0 : couponResult.valid) ? `Pay Rs. ${couponResult.discountedAmountRupees} Now` : "Pay Rs. 99 Now" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-5 font-semibold uppercase tracking-widest text-center", children: "Secured by Razorpay" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 border-b border-slate-200 pb-6 flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2 text-slate-900", children: "Certification Exam" }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-600 font-medium", children: [
            course == null ? void 0 : course.title,
            " | ",
            (_a = quiz == null ? void 0 : quiz.questions) == null ? void 0 : _a.length,
            " Questions | ",
            quiz == null ? void 0 : quiz.passingScore,
            "% required"
          ] }),
          (quiz == null ? void 0 : quiz.isAdminTestMode) && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold text-amber-700", children: "Admin test mode: 30% passing score is active for your account only." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 border border-slate-200 text-center", children: [
          "Attempt",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-lg text-indigo-600", children: (quiz == null ? void 0 : quiz.attemptsUsed) + 1 }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "/∞" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-10", children: quiz == null ? void 0 : quiz.questions.map((q, qIndex) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-blue-600 mr-2", children: [
            qIndex + 1,
            "."
          ] }),
          " ",
          q.questionText
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: q.options.map((opt, oIndex) => /* @__PURE__ */ jsxs(
          "label",
          {
            className: `flex items-center p-4 rounded-lg cursor-pointer border transition-all ${answers[qIndex] === oIndex ? "border-blue-400 bg-blue-50/50 shadow-sm" : "border-slate-300 hover:border-blue-300 bg-white shadow-sm"}`,
            onClick: () => handleOptionSelect(qIndex, oIndex),
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${answers[qIndex] === oIndex ? "border-blue-500 bg-white" : "border-slate-300 bg-slate-50"}`, children: answers[qIndex] === oIndex && /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 bg-blue-600 rounded-full" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-700 font-medium", children: opt })
            ]
          },
          oIndex
        )) })
      ] }, qIndex)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 pt-6 border-t border-slate-200 flex justify-end", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: submitting,
          className: "flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-[0.98]",
          children: [
            submitting && /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
            submitting ? "Submitting..." : "Submit Exam"
          ]
        }
      ) })
    ] }),
    exportCertData && /* @__PURE__ */ jsx(
      CertificateTemplate,
      {
        ref: certTemplateRef,
        studentName: (user == null ? void 0 : user.name) || "Student",
        courseTitle: ((_b = exportCertData.course) == null ? void 0 : _b.title) || "Certification",
        certificateId: exportCertData.certificateId,
        issueDate: new Date(exportCertData.issueDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
        verifyUrl: `${window.location.origin}/verify/${exportCertData.certificateId}`,
        isEvent: exportCertData.isEvent
      }
    )
  ] });
};
export {
  QuizView as default
};
