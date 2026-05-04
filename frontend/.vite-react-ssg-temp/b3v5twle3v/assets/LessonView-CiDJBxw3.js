import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { c as getCourseBySlug, H as Helmet, n as normalizeHtmlContent } from "../main.mjs";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ListOrdered, ChevronUp, ChevronDown, BookOpen, Volume2, Play, Pause, Square, CheckCircle, Trophy, ArrowRight, Check, GraduationCap } from "lucide-react";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const PRACTICE_TEMPLATES = {
  javascript: `function greet(name) {
  return 'Hello, ' + name + '!';
}

console.log(greet('SkillValix Learner'));`,
  html: `<section class="card">
  <h2>Practice Card</h2>
  <p>Edit this HTML and click Run Preview.</p>
  <button>Click me</button>
</section>`,
  css: `.card {
  max-width: 380px;
  margin: 16px auto;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-family: system-ui, sans-serif;
}

.card h2 { color: #1e3a8a; }
.card button {
  margin-top: 8px;
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
}`
};
const PRACTICE_MODE_LABELS = {
  javascript: "JavaScript Runner",
  html: "HTML Preview",
  css: "CSS Preview"
};
function getCoursePracticeConfig(slug) {
  const lower = String(slug || "").toLowerCase();
  if (lower.includes("ultimate-python")) {
    return {
      showLab: false,
      runnerEnabled: false,
      modes: [],
      defaultMode: null,
      description: "Python runtime is not enabled in this lightweight frontend lab. Use syntax examples and tasks below."
    };
  }
  if (lower.includes("cyber-security")) {
    return {
      showLab: false,
      runnerEnabled: false,
      modes: [],
      defaultMode: null,
      description: "Lab disabled for this introductory course"
    };
  }
  if (lower.includes("ultimate-java") || lower.includes("artificial-intelligence") || lower.includes("ultimate-c-programming") || lower.includes("modern-cpp-mastery")) {
    return {
      showLab: false,
      runnerEnabled: false,
      modes: [],
      defaultMode: null,
      description: "Note: No interactive runner for this topic. Use syntax examples and tasks below."
    };
  }
  if (lower.includes("css-for-beginners")) {
    return {
      showLab: true,
      runnerEnabled: true,
      modes: ["css", "html"],
      defaultMode: "css",
      description: "Frontend-only preview for CSS and HTML practice."
    };
  }
  if (lower.includes("ultimate-html")) {
    return {
      showLab: true,
      runnerEnabled: true,
      modes: ["html", "css"],
      defaultMode: "html",
      description: "Frontend-only preview for HTML and CSS practice."
    };
  }
  if (lower.includes("ultimate-javascript") || lower.includes("react")) {
    return {
      showLab: true,
      runnerEnabled: true,
      modes: ["javascript", "html", "css"],
      defaultMode: "javascript",
      description: "Frontend-only lab with JavaScript runner and HTML/CSS previews."
    };
  }
  if (lower.includes("node") || lower.includes("express")) {
    return {
      showLab: true,
      runnerEnabled: true,
      modes: ["javascript"],
      defaultMode: "javascript",
      description: "Frontend-only JavaScript syntax runner for backend logic practice."
    };
  }
  return {
    showLab: true,
    runnerEnabled: true,
    modes: ["javascript"],
    defaultMode: "javascript",
    description: "Frontend-only JavaScript practice lab."
  };
}
function buildPreviewDoc(mode, code) {
  const htmlBody = mode === "html" ? code : PRACTICE_TEMPLATES.html;
  const cssRules = mode === "css" ? code : PRACTICE_TEMPLATES.css;
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>body{margin:0;padding:12px;background:#f8fafc;} ${cssRules}</style>
  </head>
  <body>${htmlBody}</body>
</html>`;
}
function getLessonPracticePack(slug, lessonTitle) {
  const lower = String(slug || "").toLowerCase();
  if (lower.includes("ultimate-python")) {
    return {
      syntaxExamples: [
        {
          label: "Python Function",
          code: `def greet(name):
    return f"Hello, {name}"`
        },
        {
          label: "Python Loop",
          code: `for i in range(3):
    print(i)`
        }
      ],
      tasks: [
        `Write a Python function related to: ${lessonTitle}.`,
        "Add input validation using a simple if condition.",
        "Refactor the code into a clean, reusable function."
      ]
    };
  }
  if (lower.includes("ultimate-java")) {
    return {
      syntaxExamples: [
        {
          label: "Java Method",
          code: `public static int add(int a, int b) {
  return a + b;
}`
        },
        {
          label: "Java Class",
          code: `class User {
  String name;
  User(String name) { this.name = name; }
}`
        }
      ],
      tasks: [
        `Write a Java snippet for topic: ${lessonTitle}.`,
        "Use one class and one method with clear naming.",
        "Add one exception-safe handling path."
      ]
    };
  }
  if (lower.includes("artificial-intelligence")) {
    return {
      syntaxExamples: [
        {
          label: "Simple ML Pseudocode",
          code: `load_data()
split_train_test()
train_model()
evaluate_model()`
        },
        {
          label: "Python-style Inference",
          code: `prediction = model.predict(sample)
print(prediction)`
        }
      ],
      tasks: [
        `Describe a small AI workflow for: ${lessonTitle}.`,
        "Write pseudocode for training and evaluation steps.",
        "List one risk (bias/privacy) and one mitigation step."
      ]
    };
  }
  if (lower.includes("react")) {
    return {
      syntaxExamples: [
        {
          label: "React Component",
          code: `function ProfileCard({ name }) {
  return <h2>{name}</h2>;
}`
        },
        {
          label: "useState Hook",
          code: `const [count, setCount] = useState(0);
setCount((prev) => prev + 1);`
        }
      ],
      tasks: [
        `Create a reusable component related to: ${lessonTitle}.`,
        "Add one local state variable and update it through a button click.",
        "Refactor one repeated JSX block into a child component."
      ]
    };
  }
  if (lower.includes("node") || lower.includes("express")) {
    return {
      syntaxExamples: [
        {
          label: "Express Route",
          code: `router.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});`
        },
        {
          label: "Async Controller",
          code: `export async function getCourses(req, res, next) {
  try {
    const rows = await Course.find();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}`
        }
      ],
      tasks: [
        `Design one endpoint for lesson topic: ${lessonTitle}.`,
        "Add request validation for one body field before controller logic.",
        "Return consistent success and error response payloads."
      ]
    };
  }
  return {
    syntaxExamples: [
      {
        label: "JavaScript Condition",
        code: `if (score >= 80) {
  console.log('Great job');
} else {
  console.log('Keep practicing');
}`
      },
      {
        label: "HTML Structure",
        code: `<main>
  <h1>Lesson Practice</h1>
  <p>Build and test your code here.</p>
</main>`
      }
    ],
    tasks: [
      `Write a short code snippet that demonstrates: ${lessonTitle}.`,
      "Add one meaningful comment explaining your logic.",
      "Improve the snippet for readability after it works."
    ]
  };
}
const LessonView = () => {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModuleGlow, setShowModuleGlow] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [practiceMode, setPracticeMode] = useState("javascript");
  const [practiceCode, setPracticeCode] = useState(PRACTICE_TEMPLATES.javascript);
  const [practiceOutput, setPracticeOutput] = useState('Ready. Click "Run" to execute your code.');
  const [practicePreviewDoc, setPracticePreviewDoc] = useState(buildPreviewDoc("html", PRACTICE_TEMPLATES.html));
  const utteranceRef = useRef(null);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("skillvalix_progress") || "{}");
    if (saved[slug]) setCompletedLessons(saved[slug]);
  }, [slug]);
  useEffect(() => {
    if (mobileOpen) {
      setShowModuleGlow(false);
      return;
    }
    const timer = setTimeout(() => setShowModuleGlow(true), 4e3);
    const hideTimer = setTimeout(() => setShowModuleGlow(false), 12e3);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [lessonId, mobileOpen]);
  const persist = (list) => {
    const saved = JSON.parse(localStorage.getItem("skillvalix_progress") || "{}");
    saved[slug] = list;
    localStorage.setItem("skillvalix_progress", JSON.stringify(saved));
  };
  const lessonSpeakText = useMemo(() => {
    if (!lesson) return "";
    if (typeof window === "undefined") return "";
    const temp = document.createElement("div");
    temp.innerHTML = lesson.content || "";
    const plain = (temp.textContent || temp.innerText || "").replace(/\s+/g, " ").trim();
    return `${lesson.title}. ${plain}`;
  }, [lesson]);
  const lessonPractice = useMemo(
    () => getLessonPracticePack(slug, (lesson == null ? void 0 : lesson.title) || ""),
    [slug, lesson == null ? void 0 : lesson.title]
  );
  const practiceConfig = useMemo(() => getCoursePracticeConfig(slug), [slug]);
  useEffect(() => {
    setLoading(true);
    getCourseBySlug(slug).then((data) => {
      if (!data) throw new Error("Course not found");
      const lessons = data.lessons || [];
      setCourse(data.course);
      setAllLessons(lessons);
    }).catch(console.error).finally(() => setLoading(false));
  }, [slug]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setIsSpeechSupported(supported);
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, []);
  useEffect(() => {
    if (allLessons.length > 0) {
      const match = allLessons.find((l) => l._id === lessonId);
      setLesson(match || null);
    }
  }, [lessonId, allLessons]);
  useEffect(() => {
    if (!isSpeechSupported || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, [lessonId, isSpeechSupported]);
  const currentIndex = allLessons.findIndex((l) => l._id === lessonId);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const isLastLesson = currentIndex === allLessons.length - 1 && allLessons.length > 0;
  const progress = allLessons.length > 0 ? Math.round(completedLessons.length / allLessons.length * 100) : 0;
  const isCompleted = completedLessons.includes(lessonId);
  const markCompleted = () => {
    if (isCompleted) return;
    const next = [...completedLessons, lessonId];
    setCompletedLessons(next);
    persist(next);
  };
  const handleContinue = () => {
    if (!isCompleted) {
      const next = [...completedLessons, lessonId];
      setCompletedLessons(next);
      persist(next);
    }
    navigate(nextLesson ? `/courses/${slug}/lesson/${nextLesson._id}` : `/courses/${slug}/quiz`);
  };
  const startReading = () => {
    if (!isSpeechSupported || !lessonSpeakText || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lessonSpeakText);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  const togglePauseResume = () => {
    if (!isSpeechSupported || typeof window === "undefined") return;
    if (!window.speechSynthesis.speaking) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };
  const stopReading = () => {
    if (!isSpeechSupported || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };
  const getPracticeStorageKey = (mode) => `skillvalix_practice_${slug}_${lessonId}_${mode}`;
  useEffect(() => {
    if (!practiceConfig.runnerEnabled) return;
    if (!practiceConfig.modes.includes(practiceMode)) {
      setPracticeMode(practiceConfig.defaultMode);
    }
  }, [practiceConfig, practiceMode]);
  useEffect(() => {
    if (!lessonId || typeof window === "undefined") return;
    if (!practiceConfig.runnerEnabled) {
      setPracticeCode("");
      setPracticeOutput("Runner disabled for this course language. Use syntax examples and mini tasks below.");
      setPracticePreviewDoc(buildPreviewDoc("html", PRACTICE_TEMPLATES.html));
      return;
    }
    const key = getPracticeStorageKey(practiceMode);
    const saved = window.localStorage.getItem(key);
    const starter = PRACTICE_TEMPLATES[practiceMode] || PRACTICE_TEMPLATES.javascript;
    const nextCode = saved || starter;
    setPracticeCode(nextCode);
    setPracticeOutput('Ready. Click "Run" to execute your code.');
    setPracticePreviewDoc(buildPreviewDoc(practiceMode, nextCode));
  }, [lessonId, slug, practiceMode, practiceConfig]);
  const handlePracticeCodeChange = (value) => {
    setPracticeCode(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getPracticeStorageKey(practiceMode), value);
    }
  };
  const runPracticeCode = () => {
    if (!practiceConfig.runnerEnabled) {
      setPracticeOutput("Runner disabled for this course language.");
      return;
    }
    if (practiceMode === "javascript") {
      try {
        const logs = [];
        const sandboxConsole = {
          log: (...args) => logs.push(args.map((a) => String(a)).join(" "))
        };
        const runner = new Function("console", `"use strict";
${practiceCode}`);
        const result = runner(sandboxConsole);
        if (typeof result !== "undefined") logs.push(`Return: ${String(result)}`);
        setPracticeOutput(logs.length ? logs.join("\n") : "(No output)");
      } catch (err) {
        setPracticeOutput(`Error: ${err.message}`);
      }
      return;
    }
    setPracticePreviewDoc(buildPreviewDoc(practiceMode, practiceCode));
    setPracticeOutput("Preview updated successfully.");
  };
  const resetPracticeCode = () => {
    if (!practiceConfig.runnerEnabled) return;
    const starter = PRACTICE_TEMPLATES[practiceMode] || PRACTICE_TEMPLATES.javascript;
    handlePracticeCodeChange(starter);
    setPracticePreviewDoc(buildPreviewDoc(practiceMode, starter));
    setPracticeOutput("Template restored.");
  };
  if (loading) return /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 64px)" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }, children: [
    /* @__PURE__ */ jsx("div", { style: { width: 40, height: 40, border: "4px solid #e0e7ff", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin .8s linear infinite" } }),
    /* @__PURE__ */ jsx("style", { children: `@keyframes spin{to{transform:rotate(360deg)}}` }),
    /* @__PURE__ */ jsx("p", { style: { color: "#94a3b8", fontSize: 14, fontWeight: 500 }, children: "Loading lesson…" })
  ] }) });
  if (!lesson) return /* @__PURE__ */ jsxs("div", { style: { padding: "80px 24px", textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("p", { style: { color: "#64748b", fontSize: 16, marginBottom: 16 }, children: "Lesson not found." }),
    /* @__PURE__ */ jsxs(Link, { to: `/courses/${slug}`, style: { color: "#6366f1", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
      " Back to Course"
    ] })
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        lesson.title,
        " | ",
        course == null ? void 0 : course.title,
        " | SkillValix"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: lesson.description || `Learn ${lesson.title} in the ${course == null ? void 0 : course.title} course on SkillValix. Free, interactive, and project-based technical training.` }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `https://www.skillvalix.com/courses/${slug}/lesson/${lessonId}` }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CourseInstance",
        "name": lesson.title,
        "description": lesson.description || lesson.title,
        "courseMode": "Online",
        "educationalLevel": (course == null ? void 0 : course.level) || "Beginner",
        "isPartOf": {
          "@type": "Course",
          "name": course == null ? void 0 : course.title,
          "description": course == null ? void 0 : course.description,
          "publisher": {
            "@type": "Organization",
            "name": "SkillValix",
            "url": "https://www.skillvalix.com"
          }
        }
      }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        /* ── Base reset for lesson page ── */
        .lv-root { font-family: 'Inter', system-ui, sans-serif; background: #f1f5f9; min-height: calc(100vh - 64px); }

        /* ── Topbar ── */
        .lv-topbar {
          position: sticky; top: 64px; z-index: 40;
          background: #fff; border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        }
        .lv-topbar-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 0 20px;
          height: 52px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .lv-back { display:flex; align-items:center; font-size:14px; font-weight:700; color:#64748b; text-decoration:none; transition:color .15s; white-space:nowrap; }
        .lv-back:hover { color:#6366f1; }
        .lv-back-text { max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-left:4px; }
        .lv-pill { font-size:12px; font-weight:700; color:#6366f1; background:#eef2ff; border:1px solid #c7d2fe; padding:4px 14px; border-radius:100px; white-space:nowrap; display:flex; gap:4px; align-items:center; }
        .lv-pill-lbl { display:inline; }
        .lv-progress-wrap { display:flex; align-items:center; gap:8px; }
        .lv-progress-track { width:96px; height:6px; background:#e2e8f0; border-radius:100px; overflow:hidden; }
        .lv-progress-fill { height:100%; background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:100px; transition:width .5s ease; }
        .lv-progress-pct { font-size:11px; font-weight:800; color:#6366f1; }
        .lv-modules-btn {
          display:none; align-items:center; gap:6px;
          font-size:12px; font-weight:800; color:#6366f1;
          background:#eef2ff; border:1.5px solid #c7d2fe;
          padding:6px 14px; border-radius:10px; cursor:pointer;
          transition:all .15s;
        }
        .lv-modules-btn:hover { background:#e0e7ff; }

        .lv-modules-btn.glow {
          animation: module-glow 2s infinite;
          border-color: #6366f1;
          background: #f5f3ff;
        }
        @keyframes module-glow {
          0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.6); }
          70% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }

        /* ── Mobile drawer ── */
        .lv-mobile-drawer {
          background:#fff; border-bottom:1px solid #e2e8f0;
          box-shadow:0 4px 20px rgba(0,0,0,0.10);
          max-height:65vh; overflow-y:auto;
        }

        /* ── Two-column grid layout ── */
        .lv-body {
          max-width:1400px; margin:0 auto; padding:24px 20px 80px;
          display:grid;
          grid-template-columns:1fr 320px;
          gap:24px;
          align-items:start;
        }

        /* ── Main content pane ── */
        .lv-main { min-width:0; }
        .lv-card { background:#fff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .lv-lesson-header {
          padding:32px 36px 24px;
          background:linear-gradient(135deg,#eef2ff 0%,#fdf4ff 40%,#fff 80%);
          border-bottom:1px solid #e2e8f0;
        }
        .lv-breadcrumb { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:12px; font-size:13px; font-weight:600; color:#6366f1; }
        .lv-breadcrumb-sep { color:#cbd5e1; }
        .lv-lesson-title { font-size:clamp(1.5rem,3.5vw,2.25rem); font-weight:900; color:#0f172a; line-height:1.2; margin:0; }
        .lv-tts-controls { margin-top:14px; display:flex; flex-wrap:wrap; gap:8px; }
        .lv-tts-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:8px 12px; border-radius:10px;
          font-size:12px; font-weight:800; line-height:1;
          border:1px solid #cbd5e1; background:#fff; color:#334155;
          cursor:pointer; transition:all .15s;
        }
        .lv-tts-btn:hover { background:#f8fafc; border-color:#a5b4fc; color:#4f46e5; }
        .lv-tts-btn:disabled { opacity:0.55; cursor:not-allowed; }
        .lv-tts-btn.primary { background:#eef2ff; border-color:#c7d2fe; color:#4338ca; }
        .lv-tts-btn.stop { background:#fff1f2; border-color:#fecdd3; color:#be123c; }
        .lv-body-content {
          padding:32px 36px;
          color:#374151; line-height:1.8; font-size:16px;
        }
        /* Prose styles */
        .lv-body-content h1,.lv-body-content h2,.lv-body-content h3,.lv-body-content h4 { color:#0f172a; font-weight:800; line-height:1.3; margin:1.5em 0 .5em; }
        .lv-body-content h1 { font-size:1.75rem; }
        .lv-body-content h2 { font-size:1.4rem; }
        .lv-body-content h3 { font-size:1.15rem; }
        .lv-body-content p { margin:0 0 1em; }
        .lv-body-content a { color:#6366f1; text-decoration:none; }
        .lv-body-content a:hover { text-decoration:underline; }
        .lv-body-content code { background:#f1f5f9; color:#7c3aed; padding:2px 7px; border-radius:6px; font-size:0.875em; font-family:monospace; }
        .lv-body-content pre { background:#1e293b; color:#e2e8f0; padding:20px 24px; border-radius:14px; overflow-x:auto; margin:1.25em 0; }
        .lv-body-content pre code { background:none; color:inherit; padding:0; font-size:0.9em; }
        .lv-body-content ul,.lv-body-content ol { padding-left:1.5em; margin:0 0 1em; }
        .lv-body-content li { margin-bottom:.4em; }
        .lv-body-content blockquote { border-left:4px solid #a5b4fc; background:#eef2ff; margin:1em 0; padding:12px 20px; border-radius:0 10px 10px 0; color:#4338ca; font-style:italic; }
        .lv-body-content img { max-width:100%; border-radius:10px; }
        .lv-video-wrap { aspect-ratio:16/9; overflow:hidden; border-radius:14px; border:1px solid #e2e8f0; background:#0f172a; margin-bottom:28px; box-shadow:0 4px 20px rgba(0,0,0,0.1); }
        .lv-video-wrap iframe { width:100%; height:100%; border:none; }

        /* ── Frontend practice lab ── */
        .lv-practice-wrap { margin-top:28px; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; background:#ffffff; }
        .lv-practice-head { padding:14px 16px; border-bottom:1px solid #e2e8f0; background:#f8fafc; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; }
        .lv-practice-title { font-size:14px; font-weight:800; color:#0f172a; margin:0; }
        .lv-practice-sub { font-size:12px; color:#64748b; margin:3px 0 0; }
        .lv-practice-controls { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
        .lv-practice-select { font-size:12px; font-weight:700; border:1px solid #cbd5e1; border-radius:8px; padding:7px 10px; background:#fff; color:#334155; }
        .lv-practice-btn { border:1px solid #cbd5e1; background:#fff; color:#334155; font-size:12px; font-weight:800; border-radius:8px; padding:7px 10px; cursor:pointer; }
        .lv-practice-btn.run { background:#eef2ff; border-color:#c7d2fe; color:#3730a3; }
        .lv-practice-btn.reset { background:#fff7ed; border-color:#fed7aa; color:#9a3412; }
        .lv-practice-body { padding:16px; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .lv-practice-editor { min-height:230px; width:100%; border:1px solid #cbd5e1; border-radius:10px; padding:12px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:13px; line-height:1.55; color:#0f172a; background:#ffffff; resize:vertical; }
        .lv-practice-output { min-height:230px; border:1px solid #cbd5e1; border-radius:10px; background:#0f172a; color:#e2e8f0; padding:12px; margin:0; overflow:auto; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:13px; white-space:pre-wrap; }
        .lv-practice-preview { width:100%; min-height:230px; border:1px solid #cbd5e1; border-radius:10px; background:#fff; }
        .lv-practice-help { padding:14px 16px 16px; border-top:1px solid #e2e8f0; background:#f8fafc; }
        .lv-practice-help h3 { font-size:13px; font-weight:800; color:#0f172a; margin:0 0 8px; }
        .lv-practice-help-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .lv-practice-syntax-item { border:1px solid #e2e8f0; background:#fff; border-radius:10px; overflow:hidden; }
        .lv-practice-syntax-title { font-size:11px; font-weight:800; color:#334155; text-transform:uppercase; letter-spacing:.06em; padding:8px 10px; background:#f1f5f9; border-bottom:1px solid #e2e8f0; }
        .lv-practice-syntax-code { margin:0; padding:10px; font-size:12px; line-height:1.5; background:#0f172a; color:#e2e8f0; overflow:auto; white-space:pre; }
        .lv-practice-task-list { margin:0; padding-left:18px; color:#334155; font-size:13px; }
        .lv-practice-task-list li { margin-bottom:6px; }
        .lv-practice-disabled {
          margin: 0 16px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #475569;
          padding: 12px;
          font-size: 13px;
        }

        /* ── Bottom action bar ── */
        .lv-actions {
          padding:20px 28px;
          background:#f8faff;
          border-top:1px solid #e2e8f0;
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
        }
        .lv-btn-complete {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 20px; border-radius:12px; font-size:14px; font-weight:700;
          border:1.5px solid #e2e8f0; background:#fff; color:#374151;
          cursor:pointer; transition:all .2s;
        }
        .lv-btn-complete:hover:not(:disabled) { background:#f8faff; border-color:#a5b4fc; color:#4f46e5; }
        .lv-btn-complete.done { background:#ecfdf5; border-color:#86efac; color:#16a34a; cursor:default; }
        .lv-nav-row { display:flex; align-items:center; gap:10px; }
        .lv-btn-prev {
          display:inline-flex; align-items:center; gap:6px;
          padding:11px 18px; border-radius:12px; font-size:14px; font-weight:700;
          border:1.5px solid #e2e8f0; background:#fff; color:#374151;
          text-decoration:none; transition:all .2s;
        }
        .lv-btn-prev:hover { background:#f1f5f9; border-color:#cbd5e1; }
        .lv-btn-next {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 24px; border-radius:12px; font-size:14px; font-weight:700;
          background:linear-gradient(135deg,#6366f1,#7c3aed);
          color:#fff; border:none; cursor:pointer;
          box-shadow:0 4px 16px rgba(99,102,241,.35);
          transition:all .2s;
        }
        .lv-btn-next:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.45); }
        .lv-btn-quiz {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 24px; border-radius:12px; font-size:14px; font-weight:700;
          background:linear-gradient(135deg,#059669,#0d9488);
          color:#fff; border:none; cursor:pointer;
          box-shadow:0 4px 16px rgba(5,150,105,.35);
          transition:all .2s;
        }
        .lv-btn-quiz:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(5,150,105,.45); }

        /* ── RIGHT SIDEBAR ── */
        .lv-sidebar {
          position:sticky;
          top: calc(64px + 52px + 24px); /* navbar + topbar + gap */
          max-height: calc(100vh - 64px - 52px - 48px);
          display:flex; flex-direction:column;
          background:#fff;
          border:1px solid #e2e8f0;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
        }

        /* Sidebar header */
        .lv-sb-header {
          flex-shrink:0;
          padding:18px 20px 16px;
          background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);
        }
        .lv-sb-title { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .lv-sb-title span { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:800; color:#fff; }
        .lv-sb-count { font-size:11px; font-weight:700; color:#c4b5fd; background:rgba(255,255,255,0.12); padding:3px 10px; border-radius:100px; }
        .lv-sb-track { height:4px; background:rgba(255,255,255,0.2); border-radius:100px; overflow:hidden; }
        .lv-sb-fill { height:100%; background:#fff; border-radius:100px; transition:width .5s ease; }
        .lv-sb-pct { font-size:11px; color:#c4b5fd; margin-top:6px; font-weight:600; }

        /* Sidebar module list — ONLY THIS SCROLLS */
        .lv-sb-list { flex:1; overflow-y:auto; overscroll-behavior:contain; }
        .lv-sb-list::-webkit-scrollbar { width:4px; }
        .lv-sb-list::-webkit-scrollbar-track { background:#f1f5f9; }
        .lv-sb-list::-webkit-scrollbar-thumb { background:#c7d2fe; border-radius:100px; }

        .lv-sb-item {
          display:flex; align-items:flex-start; gap:12px;
          padding:14px 18px;
          border-bottom:1px solid #f1f5f9;
          text-decoration:none;
          transition:background .15s;
          cursor:pointer;
        }
        .lv-sb-item:last-child { border-bottom:none; }
        .lv-sb-item:hover { background:#f8faff; }
        .lv-sb-item.active { background:#eef2ff; }
        .lv-sb-item.done-item .lv-sb-item-title { text-decoration:line-through; color:#94a3b8; }

        .lv-sb-badge {
          flex-shrink:0; width:28px; height:28px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:900;
          margin-top:1px;
          transition:all .2s;
        }
        .lv-sb-badge.pending { background:#f1f5f9; color:#64748b; }
        .lv-sb-badge.pending-hover:hover { background:#e0e7ff; color:#6366f1; }
        .lv-sb-badge.active-badge { background:#6366f1; color:#fff; box-shadow:0 0 0 4px #e0e7ff; }
        .lv-sb-badge.done-badge { background:#22c55e; color:#fff; }

        .lv-sb-item-text { flex:1; min-width:0; }
        .lv-sb-item-title { font-size:13px; font-weight:600; color:#334155; line-height:1.4; word-break:break-word; }
        .lv-sb-item.active .lv-sb-item-title { color:#4f46e5; font-weight:800; }
        .lv-sb-item-sub { font-size:11px; margin-top:3px; font-weight:600; }
        .lv-sb-item-sub.viewing { color:#818cf8; }
        .lv-sb-item-sub.done-sub { color:#22c55e; }

        /* Sidebar footer */
        .lv-sb-footer { flex-shrink:0; padding:14px 16px; background:#f8faff; border-top:1px solid #e2e8f0; }
        .lv-sb-quiz-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:12px; border-radius:14px; font-size:13px; font-weight:800; color:#fff;
          background:linear-gradient(135deg,#059669,#0d9488);
          text-decoration:none;
          box-shadow:0 4px 14px rgba(5,150,105,.3);
          transition:all .2s;
        }
        .lv-sb-quiz-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(5,150,105,.4); }
        .lv-sb-footer-note { text-align:center; font-size:11px; color:#94a3b8; margin-top:8px; font-weight:500; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .lv-body { grid-template-columns:1fr; }
          .lv-sidebar { display:none; }
          .lv-modules-btn { display:flex !important; }
          .lv-progress-wrap { display:none; }
          .lv-lesson-header { padding:24px 20px 18px; }
          .lv-body-content { padding:20px; }
          .lv-actions { padding:16px 20px; }
          .lv-practice-body, .lv-practice-help-grid { grid-template-columns:1fr; }
        }
        @media (max-width: 600px) {
          .lv-back-text { display:none; }
          .lv-pill { padding:4px 10px; font-size:11px; }
          .lv-pill-lbl { display:none; }
          .lv-topbar-inner { padding:0 12px; gap:8px; }
          .lv-modules-btn { padding:5px 10px; font-size:12px; }
          .lv-body { padding:16px 12px; }
          .lv-actions { flex-direction:column; align-items:stretch; }
          .lv-btn-complete, .lv-btn-next, .lv-btn-quiz { width:100%; justify-content:center; }
          .lv-nav-row { flex:1; }
          .lv-btn-next, .lv-btn-quiz { flex:1; }
          .lv-btn-prev { flex-shrink:0; }
        }
      ` }),
    /* @__PURE__ */ jsxs("div", { className: "lv-root", children: [
      /* @__PURE__ */ jsx("div", { className: "lv-topbar", children: /* @__PURE__ */ jsxs("div", { className: "lv-topbar-inner", children: [
        /* @__PURE__ */ jsxs(Link, { to: `/courses/${slug}`, className: "lv-back", title: "Back to Course", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { size: 18 }),
          /* @__PURE__ */ jsx("span", { className: "lv-back-text", children: (course == null ? void 0 : course.title) || "Back" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "lv-pill", children: [
          /* @__PURE__ */ jsx("span", { className: "lv-pill-lbl", children: "Module" }),
          " ",
          currentIndex + 1,
          " of ",
          allLessons.length
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ jsxs("div", { className: "lv-progress-wrap", children: [
            /* @__PURE__ */ jsx("div", { className: "lv-progress-track", children: /* @__PURE__ */ jsx("div", { className: "lv-progress-fill", style: { width: `${progress}%` } }) }),
            /* @__PURE__ */ jsxs("span", { className: "lv-progress-pct", children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `lv-modules-btn ${showModuleGlow ? "glow" : ""}`,
              onClick: () => setMobileOpen((o) => !o),
              children: [
                /* @__PURE__ */ jsx(ListOrdered, { size: 13 }),
                "Modules",
                mobileOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 13 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 13 })
              ]
            }
          )
        ] })
      ] }) }),
      mobileOpen && /* @__PURE__ */ jsx("div", { className: "lv-mobile-drawer", children: /* @__PURE__ */ jsx(
        MobileModuleList,
        {
          allLessons,
          lessonId,
          slug,
          completedLessons,
          progress,
          onSelect: () => setMobileOpen(false)
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "lv-body", children: [
        /* @__PURE__ */ jsx("main", { className: "lv-main", children: /* @__PURE__ */ jsxs("div", { className: "lv-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "lv-lesson-header", children: [
            /* @__PURE__ */ jsxs("div", { className: "lv-breadcrumb", children: [
              /* @__PURE__ */ jsx(BookOpen, { size: 14 }),
              /* @__PURE__ */ jsx("span", { style: { maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: course == null ? void 0 : course.title }),
              /* @__PURE__ */ jsx("span", { className: "lv-breadcrumb-sep", children: "›" }),
              /* @__PURE__ */ jsxs("span", { style: { color: "#64748b", fontWeight: 500 }, children: [
                "Module ",
                currentIndex + 1
              ] })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "lv-lesson-title", children: lesson.title }),
            isSpeechSupported && /* @__PURE__ */ jsxs("div", { className: "lv-tts-controls", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "lv-tts-btn primary",
                  onClick: startReading,
                  disabled: isReading && !isPaused,
                  children: [
                    /* @__PURE__ */ jsx(Volume2, { size: 14 }),
                    "Read Lesson"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "lv-tts-btn",
                  onClick: togglePauseResume,
                  disabled: !isReading,
                  children: [
                    isPaused ? /* @__PURE__ */ jsx(Play, { size: 14 }) : /* @__PURE__ */ jsx(Pause, { size: 14 }),
                    isPaused ? "Resume" : "Pause"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "lv-tts-btn stop",
                  onClick: stopReading,
                  disabled: !isReading,
                  children: [
                    /* @__PURE__ */ jsx(Square, { size: 14 }),
                    "Stop"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lv-body-content", children: [
            /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: normalizeHtmlContent(lesson.content) } }),
            practiceConfig.showLab && /* @__PURE__ */ jsxs("section", { className: "lv-practice-wrap", "aria-label": "Lesson practice lab", children: [
              /* @__PURE__ */ jsxs("div", { className: "lv-practice-head", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "lv-practice-title", children: "Practice Lab (Frontend Only)" }),
                  /* @__PURE__ */ jsx("p", { className: "lv-practice-sub", children: practiceConfig.description })
                ] }),
                practiceConfig.runnerEnabled && /* @__PURE__ */ jsxs("div", { className: "lv-practice-controls", children: [
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      className: "lv-practice-select",
                      value: practiceMode,
                      onChange: (e) => setPracticeMode(e.target.value),
                      children: practiceConfig.modes.map((mode) => /* @__PURE__ */ jsx("option", { value: mode, children: PRACTICE_MODE_LABELS[mode] }, mode))
                    }
                  ),
                  /* @__PURE__ */ jsx("button", { type: "button", className: "lv-practice-btn run", onClick: runPracticeCode, children: "Run" }),
                  /* @__PURE__ */ jsx("button", { type: "button", className: "lv-practice-btn reset", onClick: resetPracticeCode, children: "Reset" })
                ] })
              ] }),
              practiceConfig.runnerEnabled ? /* @__PURE__ */ jsxs("div", { className: "lv-practice-body", children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "lv-practice-editor",
                    value: practiceCode,
                    onChange: (e) => handlePracticeCodeChange(e.target.value),
                    spellCheck: false
                  }
                ),
                practiceMode === "javascript" ? /* @__PURE__ */ jsx("pre", { className: "lv-practice-output", children: practiceOutput }) : /* @__PURE__ */ jsx(
                  "iframe",
                  {
                    title: "Practice preview",
                    className: "lv-practice-preview",
                    sandbox: "allow-scripts",
                    srcDoc: practicePreviewDoc
                  }
                )
              ] }) : /* @__PURE__ */ jsx("div", { className: "lv-practice-disabled", children: "Runtime execution is intentionally disabled for this course language in the lightweight frontend lab." }),
              /* @__PURE__ */ jsx("div", { className: "lv-practice-help", children: /* @__PURE__ */ jsxs("div", { className: "lv-practice-help-grid", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { children: "Syntax Examples" }),
                  lessonPractice.syntaxExamples.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "lv-practice-syntax-item", children: [
                    /* @__PURE__ */ jsx("div", { className: "lv-practice-syntax-title", children: item.label }),
                    /* @__PURE__ */ jsx("pre", { className: "lv-practice-syntax-code", children: item.code })
                  ] }, `${item.label}-${idx}`))
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { children: "Mini Practice Tasks" }),
                  /* @__PURE__ */ jsx("ol", { className: "lv-practice-task-list", children: lessonPractice.tasks.map((task) => /* @__PURE__ */ jsx("li", { children: task }, task)) })
                ] })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lv-actions", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: markCompleted,
                disabled: isCompleted,
                className: `lv-btn-complete${isCompleted ? " done" : ""}`,
                children: [
                  /* @__PURE__ */ jsx(CheckCircle, { size: 17, style: { color: isCompleted ? "#16a34a" : "#94a3b8" } }),
                  isCompleted ? "✓ Completed" : "Mark as Completed"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "lv-nav-row", children: [
              prevLesson && /* @__PURE__ */ jsxs(Link, { to: `/courses/${slug}/lesson/${prevLesson._id}`, className: "lv-btn-prev", children: [
                /* @__PURE__ */ jsx(ChevronLeft, { size: 15 }),
                "Prev"
              ] }),
              isLastLesson ? /* @__PURE__ */ jsxs("button", { onClick: handleContinue, className: "lv-btn-quiz", children: [
                /* @__PURE__ */ jsx(Trophy, { size: 15 }),
                "Take Certification Exam"
              ] }) : /* @__PURE__ */ jsxs("button", { onClick: handleContinue, className: "lv-btn-next", children: [
                "Next Lesson",
                /* @__PURE__ */ jsx(ArrowRight, { size: 15 })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("aside", { className: "lv-sidebar", children: [
          /* @__PURE__ */ jsxs("div", { className: "lv-sb-header", children: [
            /* @__PURE__ */ jsxs("div", { className: "lv-sb-title", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx(ListOrdered, { size: 15 }),
                " Course Modules"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "lv-sb-count", children: [
                completedLessons.length,
                "/",
                allLessons.length,
                " done"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "lv-sb-track", children: /* @__PURE__ */ jsx("div", { className: "lv-sb-fill", style: { width: `${progress}%` } }) }),
            /* @__PURE__ */ jsxs("div", { className: "lv-sb-pct", children: [
              progress,
              "% complete"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lv-sb-list", children: allLessons.map((l, i) => {
            const isActive = l._id === lessonId;
            const isDone = completedLessons.includes(l._id);
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/courses/${slug}/lesson/${l._id}`,
                className: `lv-sb-item${isActive ? " active" : ""}${isDone && !isActive ? " done-item" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: `lv-sb-badge ${isDone ? "done-badge" : isActive ? "active-badge" : "pending"}`, children: isDone ? /* @__PURE__ */ jsx(Check, { size: 13 }) : i + 1 }),
                  /* @__PURE__ */ jsxs("div", { className: "lv-sb-item-text", children: [
                    /* @__PURE__ */ jsx("div", { className: "lv-sb-item-title", children: l.title.replace(/^\d+\.\s*/, "") }),
                    isActive && /* @__PURE__ */ jsx("div", { className: "lv-sb-item-sub viewing", children: "▶ Viewing now" }),
                    isDone && !isActive && /* @__PURE__ */ jsx("div", { className: "lv-sb-item-sub done-sub", children: "✓ Completed" })
                  ] })
                ]
              },
              l._id
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "lv-sb-footer", children: [
            /* @__PURE__ */ jsxs(Link, { to: `/courses/${slug}/quiz`, className: "lv-sb-quiz-btn", children: [
              /* @__PURE__ */ jsx(GraduationCap, { size: 15 }),
              "Take Certification Exam"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "lv-sb-footer-note", children: "Pass the exam to earn your certificate" })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const MobileModuleList = ({ allLessons, lessonId, slug, completedLessons, progress, onSelect }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsxs("div", { style: { padding: "12px 16px 0", borderBottom: "1px solid #f1f5f9", background: "#fafbff" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, children: [
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, fontWeight: 800, color: "#64748b" }, children: [
        completedLessons.length,
        "/",
        allLessons.length,
        " modules completed"
      ] }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12, fontWeight: 800, color: "#6366f1" }, children: [
        progress,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { height: 4, background: "#e2e8f0", borderRadius: 100, overflow: "hidden", marginBottom: 12 }, children: /* @__PURE__ */ jsx("div", { style: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 100, transition: "width .5s" } }) })
  ] }),
  allLessons.map((l, i) => {
    const isActive = l._id === lessonId;
    const isDone = completedLessons.includes(l._id);
    return /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/courses/${slug}/lesson/${l._id}`,
        onClick: onSelect,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          borderBottom: "1px solid #f1f5f9",
          textDecoration: "none",
          background: isActive ? "#eef2ff" : "#fff",
          transition: "background .15s"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: 28,
            height: 28,
            borderRadius: "50%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 900,
            background: isDone ? "#22c55e" : isActive ? "#6366f1" : "#f1f5f9",
            color: isDone || isActive ? "#fff" : "#64748b",
            boxShadow: isActive ? "0 0 0 3px #e0e7ff" : "none"
          }, children: isDone ? /* @__PURE__ */ jsx(Check, { size: 12 }) : i + 1 }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: 13,
              fontWeight: isActive ? 800 : 600,
              color: isActive ? "#4f46e5" : isDone ? "#94a3b8" : "#334155",
              lineHeight: 1.4,
              textDecoration: isDone && !isActive ? "line-through" : "none"
            }, children: l.title.replace(/^\d+\.\s*/, "") }),
            isActive && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#818cf8", fontWeight: 600, marginTop: 2 }, children: "▶ Currently viewing" }),
            isDone && !isActive && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 2 }, children: "✓ Completed" })
          ] })
        ]
      },
      l._id
    );
  }),
  /* @__PURE__ */ jsx("div", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/courses/${slug}/quiz`,
      onClick: onSelect,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "12px",
        borderRadius: 12,
        background: "linear-gradient(135deg,#059669,#0d9488)",
        color: "#fff",
        fontWeight: 800,
        fontSize: 13,
        textDecoration: "none",
        boxShadow: "0 4px 14px rgba(5,150,105,.3)"
      },
      children: [
        /* @__PURE__ */ jsx(GraduationCap, { size: 15 }),
        " Take Certification Exam"
      ]
    }
  ) })
] });
export {
  LessonView as default
};
