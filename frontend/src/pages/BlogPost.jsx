import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogs';

const SITE_URL = 'https://skillhub.in';
const SITE_NAME = 'SkillHub';
const LOGO_URL = 'https://skillhub.in/favicon.svg';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === slug);

  // Get 2 related posts (same category, excluding current)
  const relatedPosts = post
    ? blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <Helmet>
          <title>Article Not Found | SkillHub Blog</title>
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
        <meta name="twitter:site" content="@SkillHubIn" />

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

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Main Article */}
        <article className="lg:col-span-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div
            className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-img:rounded-xl prose-code:text-blue-700 prose-pre:bg-slate-900 prose-pre:text-slate-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
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
                    {tag}
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
        <aside className="lg:col-span-4 space-y-8">
          {/* Course CTA */}
          {post.relatedCourse && (
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
                View Full Course <ArrowRight className="inline w-4 h-4 ml-1 -mt-0.5" />
              </Link>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
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
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 leading-snug transition-colors">
                        {rp.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{rp.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;
