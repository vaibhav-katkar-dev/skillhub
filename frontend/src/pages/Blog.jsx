import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Filter, X, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/blogs';

const SITE_URL  = 'https://skillvalix.com';
const SITE_NAME = 'SkillValix';

// JSON-LD: Blog listing as ItemList
const blogListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'SkillValix Blog — Web Development Tutorials & Insights',
  url: `${SITE_URL}/blog`,
  numberOfItems: blogPosts.length,
  itemListElement: blogPosts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: post.canonicalUrl,
    name: post.title,
  })),
};

// Derive unique categories from posts
const ALL_CATEGORIES = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

// Category colour map
const CATEGORY_COLORS = {
  'SEO & HTML':        { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'CSS & Design':      { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200' },
  'JavaScript':        { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  'Python':            { bg: 'bg-emerald-100',text: 'text-emerald-700',border: 'border-emerald-200' },
  'Java':              { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200' },
  'AI & Data Science': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'Career & Industry': { bg: 'bg-teal-100',   text: 'text-teal-700',   border: 'border-teal-200' },
};

function getCategoryStyle(category) {
  return CATEGORY_COLORS[category] || { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
}

const Blog = () => {
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    let list = blogPosts;
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);

  const clearFilters = () => { setSearch(''); setActiveCategory('All'); };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        {/* Primary SEO */}
        <title>Blog — Web Development Tutorials & Tips | SkillValix</title>
        <meta name="description" content="Read free web development tutorials, Python tips, JavaScript guides, CSS tricks and more on the SkillValix blog. Written by expert developers and educators in India." />
        <meta name="keywords" content="web development blog, JavaScript tutorials, Python tips, CSS guide, HTML5 tutorial, programming blog India, SkillValix blog" />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog — Web Development Tutorials & Tips | SkillValix" />
        <meta property="og:description" content="Free web development tutorials, Python tips, JavaScript guides, CSS tricks and more on the SkillValix blog." />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:image" content={`${SITE_URL}/og-blog.png`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog — Web Development Tutorials & Tips | SkillValix" />
        <meta name="twitter:description" content="Free web development tutorials, Python tips, JavaScript guides, CSS tricks and more." />
        <meta name="twitter:site" content="@SkillValix" />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(blogListSchema)}</script>
      </Helmet>

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-5">
            <BookOpen className="w-4 h-4 text-indigo-300" />
            <span className="text-white/75 text-xs font-bold uppercase tracking-widest">SkillValix Blog</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Insights, Tutorials &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
              Dev Tips
            </span>
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Free web development tutorials, tips, and insights from our expert team. Stay sharp, stay current.
          </p>
        </div>
      </div>

      {/* ── SEARCH + FILTER BAR (overlaps hero) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="blog-search"
                type="text"
                placeholder="Search articles, topics, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                id="blog-category"
                value={activeCategory}
                onChange={e => setActiveCategory(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer"
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-3 pb-1">
            {ALL_CATEGORIES.map(cat => {
              const cs = getCategoryStyle(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : `${cs.bg} ${cs.text} ${cs.border} hover:opacity-80`
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BLOG GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6">
        {/* Results count */}
        {(search || activeCategory !== 'All') && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm">
              Showing <strong className="text-slate-800">{filtered.length}</strong> of {blogPosts.length} articles
              {activeCategory !== 'All' && <span> in <strong className="text-indigo-600">{activeCategory}</strong></span>}
              {search && <span> matching "<strong className="text-indigo-600">{search}</strong>"</span>}
            </p>
            <button onClick={clearFilters} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold">No articles found.</p>
            <p className="text-slate-400 text-sm mt-1">Try a different keyword or category.</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-indigo-600 font-semibold hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => {
              const cs = getCategoryStyle(post.category);
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden h-40 flex-shrink-0">
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`${cs.bg} ${cs.text} text-xs font-bold px-2.5 py-1 rounded-full border ${cs.border} backdrop-blur-sm`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.publishedDate}>{post.date}</time>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-slate-500 text-xs leading-relaxed flex-grow line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">{post.author.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{post.author}</span>
                      </div>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-0.5 transition-colors group/link"
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read more <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
