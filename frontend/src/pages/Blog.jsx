import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogs';

const SITE_URL = 'https://skillvalix.com';
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

const Blog = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <Helmet>
        {/* Primary SEO */}
        <title>Blog — Web Development Tutorials & Tips | SkillValix</title>
        <meta
          name="description"
          content="Read free web development tutorials, Python tips, JavaScript guides, CSS tricks and more on the SkillValix blog. Written by expert developers and educators in India."
        />
        <meta
          name="keywords"
          content="web development blog, JavaScript tutorials, Python tips, CSS guide, HTML5 tutorial, programming blog India, SkillValix blog"
        />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog — Web Development Tutorials & Tips | SkillValix" />
        <meta
          property="og:description"
          content="Free web development tutorials, Python tips, JavaScript guides, CSS tricks and more on the SkillValix blog."
        />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:image" content={`${SITE_URL}/og-blog.png`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog — Web Development Tutorials & Tips | SkillValix" />
        <meta
          name="twitter:description"
          content="Free web development tutorials, Python tips, JavaScript guides, CSS tricks and more."
        />
        <meta name="twitter:site" content="@SkillValix" />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(blogListSchema)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            SkillValix{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Blog
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Thoughts, tutorials, and insights from our team of expert developers and educators. Keep your skills sharp.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
            >
              <div className="relative overflow-hidden h-48 sm:h-56">
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  loading="lazy"
                  width="1200"
                  height="630"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.publishedDate}>{post.date}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>

                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{post.author.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{post.author}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors group/link"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read more <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
