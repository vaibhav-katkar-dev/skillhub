import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { b as blogPosts, H as Helmet, n as normalizeHtmlContent, a as normalizeDisplayText } from "../main.mjs";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Clock, Tag, Trophy, Rocket, BookOpen, ArrowRight } from "lucide-react";
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
const LOGO_URL = "https://www.skillvalix.com/logo.svg";
const BlogPost = () => {
  var _a, _b, _c, _d;
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === slug);
  const relatedPosts = post ? blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2) : [];
  const otherPosts = post ? blogPosts.filter((p) => p.id !== post.id && !relatedPosts.some((rp) => rp.id === p.id)) : [];
  const [showMoreSidebar, setShowMoreSidebar] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!post) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-[70vh] flex flex-col items-center justify-center p-4 text-center", children: [
      /* @__PURE__ */ jsxs(Helmet, { children: [
        /* @__PURE__ */ jsx("title", { children: "Article Not Found | SkillValix Blog" }),
        /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-slate-900 mb-4", children: "404 — Article Not Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-6", children: "The blog post you're looking for doesn't exist or has been moved." }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate("/blog"), className: "px-6 py-2 bg-blue-600 text-white rounded-lg font-bold", children: "Back to Blog" })
    ] });
  }
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: {
      "@type": "ImageObject",
      url: post.imageUrl,
      width: 1200,
      height: 630
    },
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate || post.publishedDate,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      name: post.author,
      url: post.authorUrl
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: "https://www.skillvalix.com",
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonicalUrl
    },
    keywords: (_a = post.keywords) == null ? void 0 : _a.join(", "),
    wordCount: post.wordCount,
    articleSection: post.category,
    url: post.canonicalUrl
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: post.canonicalUrl }
    ]
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 min-h-screen pb-20", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: post.metaTitle }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: post.metaDescription }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: (_b = post.keywords) == null ? void 0 : _b.join(", ") }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: post.canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: post.author }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: post.metaTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: post.metaDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: post.canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: post.imageUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:alt", content: post.imageAlt }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_IN" }),
      /* @__PURE__ */ jsx("meta", { property: "article:published_time", content: post.publishedDate }),
      /* @__PURE__ */ jsx("meta", { property: "article:modified_time", content: post.modifiedDate }),
      /* @__PURE__ */ jsx("meta", { property: "article:author", content: post.author }),
      /* @__PURE__ */ jsx("meta", { property: "article:section", content: post.category }),
      (_c = post.tags) == null ? void 0 : _c.map((tag) => /* @__PURE__ */ jsx("meta", { property: "article:tag", content: tag }, tag)),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: post.metaTitle }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: post.metaDescription }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: post.imageUrl }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image:alt", content: post.imageAlt }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@SkillValix" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(articleSchema) }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative h-[40vh] md:h-[50vh] min-h-[300px] w-full bg-slate-900 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-40", children: /* @__PURE__ */ jsx("img", { src: post.imageUrl, alt: post.imageAlt || post.title, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "flex items-center gap-2 text-slate-400 text-xs mb-4", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-white transition-colors", children: "Home" }),
          /* @__PURE__ */ jsx("span", { children: "/" }),
          /* @__PURE__ */ jsx(Link, { to: "/blog", className: "hover:text-white transition-colors", children: "Blog" }),
          /* @__PURE__ */ jsx("span", { children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-300 truncate max-w-[200px]", children: post.title })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate("/blog"),
            className: "flex items-center gap-2 text-blue-300 hover:text-white mb-4 text-sm font-bold uppercase tracking-wide transition-colors",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              " Back to all articles"
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4", children: post.category }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6", children: post.title }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 md:gap-6 text-slate-300 text-sm font-medium", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: post.author })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("time", { dateTime: post.publishedDate, children: post.date })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
            " ",
            post.readTime
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10", children: [
      /* @__PURE__ */ jsxs("article", { className: "lg:col-span-8 xl:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-img:rounded-xl prose-code:text-blue-700 prose-pre:bg-slate-900 prose-pre:text-slate-100",
            dangerouslySetInnerHTML: { __html: normalizeHtmlContent(post.content) }
          }
        ),
        post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-10 pt-6 border-t border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-slate-400" }),
          post.tags.map((tag) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default",
              children: normalizeDisplayText(tag)
            },
            tag
          ))
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-lg", children: post.author.charAt(0) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 uppercase tracking-wide font-semibold", children: "Written by" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-900 font-bold", children: post.author }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
              post.category,
              " Instructor at ",
              SITE_NAME
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "lg:col-span-4 xl:col-span-3 space-y-8", children: [
        ((_d = post.tags) == null ? void 0 : _d.some((t) => ["Hackathon", "Host Hackathon India", "Online Hackathon India", "Corporate Hackathon", "Coding Competition"].includes(t))) ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 shadow-xl p-6 relative sticky top-8", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -right-4 w-24 h-24 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 text-white" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-indigo-300", children: "Hackathons on SkillValix" })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-white mb-2 leading-snug", children: "Ready to take the next step?" }),
            /* @__PURE__ */ jsx("p", { className: "text-indigo-200 text-xs mb-5 leading-relaxed", children: "Compete for prizes, or host a professional hackathon for your college or company — free." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/hackathons",
                  className: "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-colors shadow",
                  children: [
                    /* @__PURE__ */ jsx(Trophy, { className: "w-4 h-4" }),
                    " Join a Hackathon"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/host",
                  className: "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-white font-bold text-sm hover:bg-indigo-500/50 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(Rocket, { className: "w-4 h-4" }),
                    " Host for Free"
                  ]
                }
              )
            ] })
          ] })
        ] }) : post.relatedCourse ? /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg sticky top-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5 backdrop-blur-sm", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-6 h-6 text-white" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: "Master this topic completely" }),
          /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-sm mb-6 leading-relaxed", children: [
            "Take the full, certified course: ",
            /* @__PURE__ */ jsx("strong", { children: post.relatedCourse.title })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/courses/${post.relatedCourse.slug}`,
              className: "block w-full text-center bg-white text-blue-700 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl transition-colors shadow-md",
              children: [
                "View Free Course ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "inline w-4 h-4 ml-1 -mt-0.5" })
              ]
            }
          )
        ] }) : null,
        relatedPosts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8 md:static", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 mb-4 uppercase tracking-wide", children: "Related Articles" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: relatedPosts.map((rp) => /* @__PURE__ */ jsxs(Link, { to: `/blog/${rp.id}`, className: "group flex gap-3 items-start", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: rp.imageUrl,
                alt: rp.imageAlt || rp.title,
                className: "w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 group-hover:text-blue-600 leading-snug transition-colors line-clamp-2", children: rp.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-1", children: rp.readTime })
            ] })
          ] }, rp.id)) })
        ] }),
        otherPosts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 mb-4 uppercase tracking-wide", children: "More Resources" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: otherPosts.slice(0, showMoreSidebar ? 12 : 4).map((op) => /* @__PURE__ */ jsxs(Link, { to: `/blog/${op.id}`, className: "group block pb-3 border-b border-slate-100 last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-700 group-hover:text-blue-600 leading-snug transition-colors line-clamp-2", children: op.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: op.category }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "•" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400", children: op.readTime })
            ] })
          ] }, op.id)) }),
          otherPosts.length > 4 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowMoreSidebar(!showMoreSidebar),
              className: "w-full mt-4 py-2 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors",
              children: showMoreSidebar ? "Show Less" : "Show All Resources"
            }
          )
        ] })
      ] })
    ] }),
    (() => {
      const sameCat = blogPosts.filter((p) => p.id !== post.id && p.category === post.category);
      const others = blogPosts.filter((p) => p.id !== post.id && p.category !== post.category);
      const suggested = [...sameCat, ...others].slice(0, 3);
      if (suggested.length === 0) return null;
      return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1", children: "Keep Learning" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-black text-slate-900", children: "Continue Reading" })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/blog",
              className: "hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors",
              children: [
                "All Articles ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: suggested.map((p) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/blog/${p.id}`,
            className: "group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative h-40 overflow-hidden flex-shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: p.imageUrl,
                    alt: p.imageAlt || p.title,
                    loading: "lazy",
                    className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }),
                /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full", children: p.category })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-grow", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-400 mb-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                    " ",
                    p.readTime
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                    " ",
                    p.date
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 mb-2", children: p.title }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 leading-relaxed line-clamp-2 flex-grow mb-3", children: p.excerpt }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-100 mt-auto", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white text-[10px] font-bold", children: p.author.charAt(0) }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-600 truncate max-w-[100px]", children: p.author })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-indigo-600 text-xs font-bold flex items-center gap-0.5 group-hover:gap-1.5 transition-all", children: [
                    "Read ",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                  ] })
                ] })
              ] })
            ]
          },
          p.id
        )) }),
        /* @__PURE__ */ jsx("div", { className: "sm:hidden text-center mt-6", children: /* @__PURE__ */ jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline", children: [
          "Browse all articles ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] }) })
      ] });
    })()
  ] });
};
export {
  BlogPost as default
};
