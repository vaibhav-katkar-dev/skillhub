import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogs';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Article Not Found</h1>
        <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/blog')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Helmet>
        <title>{post.title} | SkillHub Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[300px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-blue-300 hover:text-white mb-6 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </button>
          
          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            {post.category}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" /> {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {post.readTime}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <article className="lg:col-span-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div 
            className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Sidebar / CTA */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Course CTA Card */}
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
        </aside>

      </div>
    </div>
  );
};

export default BlogPost;
