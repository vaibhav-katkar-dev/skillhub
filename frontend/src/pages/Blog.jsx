import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "10 Essential HTML5 Tags Every Developer Should Know",
    excerpt: "HTML5 introduced a slew of new semantic tags. Discover how to use <article>, <section>, <nav>, and more to improve your SEO and accessibility.",
    author: "Jane Doe",
    date: "March 15, 2026",
    readTime: "5 min read",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Why Responsive Design is Non-Negotiable in 2026",
    excerpt: "With mobile traffic dominating the web, building responsive applications is more critical than ever. Learn the core principles of fluid grids and media queries.",
    author: "John Smith",
    date: "March 10, 2026",
    readTime: "7 min read",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Understanding CSS Flexbox vs Grid",
    excerpt: "Confused about when to use Flexbox and when to use CSS Grid? We break down the differences and show you real-world examples of both.",
    author: "Alice Johnson",
    date: "March 5, 2026",
    readTime: "8 min read",
    category: "CSS",
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <Helmet>
        <title>Blog | SkillHub</title>
        <meta name="description" content="Read the latest news, tutorials, and insights regarding web development and design on the SkillHub blog." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            SkillHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Blog</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Thoughts, tutorials, and insights from our team of expert developers and educators. Keep your skills sharp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
              <div className="relative overflow-hidden h-48 sm:h-56">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
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
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  <Link to="#">{post.title}</Link>
                </h3>
                
                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 p-1.5 rounded-full text-slate-500"><User className="w-4 h-4" /></div>
                    <span className="text-sm font-semibold text-slate-700">{post.author}</span>
                  </div>
                  <Link to="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors group/link">
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
