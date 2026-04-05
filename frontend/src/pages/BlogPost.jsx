import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { normalizeHtmlContent, normalizeDisplayText } from '../utils/text';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, BookOpen, ArrowRight, Tag, Trophy, Rocket } from 'lucide-react';
import { blogPosts } from '../data/blogs';

const SITE_URL = 'https://skillvalix.com';
const SITE_NAME = 'SkillValix';
const LOGO_URL = 'https://skillvalix.com/logo.svg';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === slug);

  // Get 2 related posts (same category, excluding current)
  const relatedPosts = post
    ? blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2)
    : [];

  // Get other posts for the sidebar to fill space
  const otherPosts = post 
    ? blogPosts.filter(p => p.id !== post.id && !relatedPosts.some(rp => rp.id === p.id))
    : [];
    
  const [showMoreSidebar, setShowMoreSidebar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <Helmet>
          <title>Article Not Found | SkillValix Blog</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404 — Article Not Found</h1>
        <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/blog')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
          Back to Blog
        </button>
      </div>
    );
  }

  // ── JSON-LD: Article Schema ───────────────────────────────────────────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.imageUrl,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Person',
      name: post.author,
      url: post.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
    keywords: post.keywords?.join(', '),
    wordCount: post.wordCount,
    articleSection: post.category,
    url: post.canonicalUrl,
  };

  // ── JSON-LD: Breadcrumb ───────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: post.canonicalUrl },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Helmet>
        {/* Primary SEO */}
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords?.join(', ')} />
        <link rel="canonical" href={post.canonicalUrl} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={post.canonicalUrl} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:image:alt" content={post.imageAlt} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta property="article:modified_time" content={post.modifiedDate} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.imageUrl} />
        <meta name="twitter:image:alt" content={post.imageAlt} />
        <meta name="twitter:site" content="@SkillValix" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[300px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src={post.imageUrl} alt={post.imageAlt || post.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          {/* Breadcrumb nav (semantic + SEO) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400 text-xs mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-[200px]">{post.title}</span>
          </nav>

          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </button>

          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            {post.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedDate}>{post.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {post.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Main Article */}
        <article className="lg:col-span-8 xl:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div
            className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-img:rounded-xl prose-code:text-blue-700 prose-pre:bg-slate-900 prose-pre:text-slate-100"
            dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(post.content) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default"
                  >
                    {normalizeDisplayText(tag)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{post.author.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Written by</p>
              <p className="text-slate-900 font-bold">{post.author}</p>
              <p className="text-xs text-slate-500">{post.category} Instructor at {SITE_NAME}</p>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
          {/* Hackathon CTA for hackathon posts, Course CTA for others */}
          {post.tags?.some(t => ['Hackathon', 'Host Hackathon India', 'Online Hackathon India', 'Corporate Hackathon', 'Coding Competition'].includes(t)) ? (
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 shadow-xl p-6 relative sticky top-8">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-300">Hackathons on SkillValix</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2 leading-snug">Ready to take the next step?</h3>
                <p className="text-indigo-200 text-xs mb-5 leading-relaxed">
                  Compete for prizes, or host a professional hackathon for your college or company — free.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/hackathons"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-colors shadow"
                  >
                    <Trophy className="w-4 h-4" /> Join a Hackathon
                  </Link>
                  <Link
                    to="/host"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-white font-bold text-sm hover:bg-indigo-500/50 transition-colors"
                  >
                    <Rocket className="w-4 h-4" /> Host for Free
                  </Link>
                </div>
              </div>
            </div>
          ) : post.relatedCourse ? (
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg sticky top-8">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5 backdrop-blur-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Master this topic completely</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Take the full, certified course: <strong>{post.relatedCourse.title}</strong>
              </p>
              <Link
                to={`/courses/${post.relatedCourse.slug}`}
                className="block w-full text-center bg-white text-blue-700 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
              >
                View Free Course <ArrowRight className="inline w-4 h-4 ml-1 -mt-0.5" />
              </Link>
            </div>
          ) : null}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-8 md:static">
              <h3 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wide">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map(rp => (
                  <Link key={rp.id} to={`/blog/${rp.id}`} className="group flex gap-3 items-start">
                    <img
                      src={rp.imageUrl}
                      alt={rp.imageAlt || rp.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 leading-snug transition-colors line-clamp-2">
                        {rp.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{rp.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More Articles & Lessons (fills empty space) */}
          {otherPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wide">More Resources</h3>
              <div className="flex flex-col gap-3">
                {otherPosts.slice(0, showMoreSidebar ? 12 : 4).map(op => (
                  <Link key={op.id} to={`/blog/${op.id}`} className="group block pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 leading-snug transition-colors line-clamp-2">
                      {op.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{op.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">{op.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
              {otherPosts.length > 4 && (
                <button 
                  onClick={() => setShowMoreSidebar(!showMoreSidebar)}
                  className="w-full mt-4 py-2 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {showMoreSidebar ? 'Show Less' : 'Show All Resources'}
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* ── Continue Reading ─────────────────────────────────────────────────── */}
      {(() => {
        // Priority: same-category first, then fill with any other posts
        const sameCat = blogPosts.filter(p => p.id !== post.id && p.category === post.category);
        const others = blogPosts.filter(p => p.id !== post.id && p.category !== post.category);
        const suggested = [...sameCat, ...others].slice(0, 3);
        if (suggested.length === 0) return null;

        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-20">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Keep Learning</p>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Continue Reading</h2>
              </div>
              <Link
                to="/blog"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggested.map(p => (
                <Link
                  key={p.id}
                  to={`/blog/${p.id}`}
                  className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 overflow-hidden flex-shrink-0">
                    <img
                      src={p.imageUrl}
                      alt={p.imageAlt || p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {p.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {p.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-grow mb-3">
                      {p.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-bold">{p.author.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{p.author}</span>
                      </div>
                      <span className="text-indigo-600 text-xs font-bold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile "all articles" link */}
            <div className="sm:hidden text-center mt-6">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline">
                Browse all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default BlogPost;
