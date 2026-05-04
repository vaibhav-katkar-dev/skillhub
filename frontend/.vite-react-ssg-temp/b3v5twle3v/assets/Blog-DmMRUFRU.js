import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { b as blogPosts, H as Helmet } from "../main.mjs";
import { Link } from "react-router-dom";
import { BookOpen, Search, X, Filter, Calendar, Clock, ArrowRight } from "lucide-react";
import "react-dom/client";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "zustand";
import "axios";
import "@react-oauth/google";
import "vite-react-ssg";
const SITE_URL = "https://www.skillvalix.com";
const SITE_NAME = "SkillValix";
const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SkillValix Blog — Web Development Tutorials & Insights",
  url: `${SITE_URL}/blog`,
  numberOfItems: blogPosts.length,
  itemListElement: blogPosts.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: post.canonicalUrl,
    name: post.title
  }))
};
const ALL_CATEGORIES = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
const CATEGORY_COLORS = {
  "SEO & HTML": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  "CSS & Design": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  "JavaScript": { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  "Python": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  "Java": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  "AI & Data Science": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  "Career & Industry": { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200" }
};
function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };
}
const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = useMemo(() => {
    let list = blogPosts;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);
  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Blog — Web Development Tutorials & Tips | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Read free web development tutorials, Python tips, JavaScript guides, CSS tricks and more on the SkillValix blog. Written by expert developers and educators in India." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "web development blog, JavaScript tutorials, Python tips, CSS guide, HTML5 tutorial, programming blog India, SkillValix blog" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `${SITE_URL}/blog` }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Blog — Web Development Tutorials & Tips | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Free web development tutorials, Python tips, JavaScript guides, CSS tricks and more on the SkillValix blog." }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: `${SITE_URL}/blog` }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: `${SITE_URL}/og-blog.png` }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_IN" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "Blog — Web Development Tutorials & Tips | SkillValix" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Free web development tutorials, Python tips, JavaScript guides, CSS tricks and more." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@SkillValix" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(blogListSchema) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.06]",
          style: { backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 relative z-10 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-5", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-indigo-300" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/75 text-xs font-bold uppercase tracking-widest", children: "SkillValix Blog" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight", children: [
          "Insights, Tutorials &",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300", children: "Dev Tips" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-300 text-base max-w-2xl mx-auto", children: "Free web development tutorials, tips, and insights from our expert team. Stay sharp, stay current." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-4 relative z-20", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-slate-100 p-4 sm:p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "blog-search",
              type: "text",
              placeholder: "Search articles, topics, tags…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            }
          ),
          search && /* @__PURE__ */ jsx("button", { onClick: () => setSearch(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              id: "blog-category",
              value: activeCategory,
              onChange: (e) => setActiveCategory(e.target.value),
              className: "w-full sm:w-auto appearance-none pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer",
              children: ALL_CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat === "All" ? "All Categories" : cat }, cat))
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-slate-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto hide-scrollbar gap-2 mt-3 pb-1", children: ALL_CATEGORIES.map((cat) => {
        const cs = getCategoryStyle(cat);
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveCategory(cat),
            className: `whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${activeCategory === cat ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : `${cs.bg} ${cs.text} ${cs.border} hover:opacity-80`}`,
            children: cat
          },
          cat
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6", children: [
      (search || activeCategory !== "All") && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-sm", children: [
          "Showing ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-800", children: filtered.length }),
          " of ",
          blogPosts.length,
          " articles",
          activeCategory !== "All" && /* @__PURE__ */ jsxs("span", { children: [
            " in ",
            /* @__PURE__ */ jsx("strong", { className: "text-indigo-600", children: activeCategory })
          ] }),
          search && /* @__PURE__ */ jsxs("span", { children: [
            ' matching "',
            /* @__PURE__ */ jsx("strong", { className: "text-indigo-600", children: search }),
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: clearFilters, className: "text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition", children: [
          /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }),
          " Clear"
        ] })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-7 h-7 text-slate-300" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-bold", children: "No articles found." }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Try a different keyword or category." }),
        /* @__PURE__ */ jsx("button", { onClick: clearFilters, className: "mt-4 text-sm text-indigo-600 font-semibold hover:underline", children: "Clear filters" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((post) => {
        const cs = getCategoryStyle(post.category);
        return /* @__PURE__ */ jsxs(
          "article",
          {
            className: "bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden h-40 flex-shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: post.imageUrl,
                    alt: post.imageAlt || post.title,
                    loading: "lazy",
                    className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsx("span", { className: `${cs.bg} ${cs.text} text-xs font-bold px-2.5 py-1 rounded-full border ${cs.border} backdrop-blur-sm`, children: post.category }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-grow", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-400 mb-2.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                    /* @__PURE__ */ jsx("time", { dateTime: post.publishedDate, children: post.date })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                    " ",
                    post.readTime
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2", children: /* @__PURE__ */ jsx(Link, { to: `/blog/${post.id}`, children: post.title }) }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-xs leading-relaxed flex-grow line-clamp-2 mb-3", children: post.excerpt }),
                post.tags && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: post.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", { className: "bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full", children: tag }, tag)) }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-100 mt-auto", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xs", children: post.author.charAt(0) }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-600 truncate max-w-[100px]", children: post.author })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Link,
                    {
                      to: `/blog/${post.id}`,
                      className: "text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-0.5 transition-colors group/link",
                      "aria-label": `Read more about ${post.title}`,
                      children: [
                        "Read more ",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          post.id
        );
      }) })
    ] })
  ] });
};
export {
  Blog as default
};
