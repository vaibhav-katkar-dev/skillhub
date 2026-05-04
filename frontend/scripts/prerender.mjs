/**
 * prerender.mjs  —  Post-build static HTML generator
 *
 * Runs AFTER `vite build`. For every blog post (from scripts/blogMeta.json)
 * and every key static page it writes:
 *   dist/<route>/index.html
 * …with correct <title>, <meta description>, canonical, OG, Twitter, JSON-LD.
 *
 * Crawlers receive full meta-data in raw HTML.
 * The React SPA hydrates normally in the browser.
 *
 * To update when you add new blog posts:
 *   node scripts/extractMeta.mjs   (or just run `npm run build`)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const DIST      = path.join(ROOT, 'dist');
const META_PATH = path.join(__dirname, 'blogMeta.json');

// ── 1.  Load blog metadata ─────────────────────────────────────────────────────
const blogPosts = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
console.log(`\n[prerender] Loaded ${blogPosts.length} blog posts from blogMeta.json`);

// ── 2.  Read the Vite build shell ─────────────────────────────────────────────
const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// ── 3.  Meta tag helpers ──────────────────────────────────────────────────────
function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHead({ title, description, canonical, ogImage, ogType = 'article', keywords, jsonLd }) {
  const kw = Array.isArray(keywords) ? keywords.join(', ') : (keywords || '');
  const lines = [
    title       ? `  <title>${esc(title)}</title>`                                          : '',
    description ? `  <meta name="description" content="${esc(description)}" />`             : '',
    kw          ? `  <meta name="keywords" content="${esc(kw)}" />`                         : '',
    canonical   ? `  <link rel="canonical" href="${esc(canonical)}" />`                     : '',
    // Open Graph
    `  <meta property="og:title" content="${esc(title)}" />`,
    `  <meta property="og:description" content="${esc(description)}" />`,
    canonical   ? `  <meta property="og:url" content="${esc(canonical)}" />`                : '',
    `  <meta property="og:type" content="${esc(ogType)}" />`,
    ogImage     ? `  <meta property="og:image" content="${esc(ogImage)}" />`                : '',
    `  <meta property="og:site_name" content="SkillValix" />`,
    // Twitter Card
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${esc(title)}" />`,
    `  <meta name="twitter:description" content="${esc(description)}" />`,
    ogImage     ? `  <meta name="twitter:image" content="${esc(ogImage)}" />`               : '',
    // JSON-LD
    jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '',
  ].filter(Boolean);

  return lines.join('\n');
}

function injectIntoHtml(html, head) {
  return html
    .replace(/<title>.*?<\/title>/is, '')                          // shell title
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?>/gi, '')       // shell canonical
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, '')    // shell description
    .replace(/<meta\s+name=["']keywords["'][^>]*\/?>/gi, '')       // shell keywords
    .replace(/<meta\s+name=["']robots["'][^>]*\/?>/gi, '')         // shell robots
    .replace(/<meta\s+name=["']author["'][^>]*\/?>/gi, '')         // shell author
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, '')  // all og: tags
    .replace(/<meta\s+property=["']article:[^"']+["'][^>]*\/?>/gi, '') // article: tags
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, '') // all twitter: tags
    .replace(/<\/head>/i, `${head}\n</head>`);                     // inject before </head>
}

function writeRoute(routePath, html) {
  const segments = routePath.split('/').filter(Boolean);
  const dir      = segments.length ? path.join(DIST, ...segments) : DIST;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`  ✓ ${routePath || '/'}`);
}

// ── 4.  Blog post pages ────────────────────────────────────────────────────────
console.log('\n[prerender] Generating blog post pages...');
let generated = 0;

for (const post of blogPosts) {
  const slug      = post.id;
  const canonical = post.canonicalUrl || `https://www.skillvalix.com/blog/${slug}`;
  const kw        = Array.isArray(post.keywords) ? post.keywords.join(', ') : (post.keywords || '');

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'Article',
    headline:     post.metaTitle || post.title,
    description:  post.metaDescription || post.excerpt || '',
    image:        post.imageUrl || '',
    author:       { '@type': 'Person', name: post.author || 'SkillValix Team' },
    publisher: {
      '@type': 'Organization',
      name:    'SkillValix',
      logo:    { '@type': 'ImageObject', url: 'https://www.skillvalix.com/logo.png' },
    },
    datePublished:    post.publishedDate || post.date || '',
    dateModified:     post.publishedDate || post.date || '',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords:         kw,
  };

  const head = buildHead({
    title:       post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    canonical,
    ogImage:     post.imageUrl || '',
    ogType:      'article',
    keywords:    kw,
    jsonLd,
  });

  writeRoute(`/blog/${slug}`, injectIntoHtml(indexHtml, head));
  generated++;
}

// ── 5.  Courses pages ────────────────────────────────────────────────────────
console.log('\n[prerender] Generating course pages...');
const coursesPath = path.join(ROOT, 'public/data/all-courses.json');
if (fs.existsSync(coursesPath)) {
  const allCourses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
  for (const item of allCourses) {
    const course = item.course;
    if (!course || !course.slug) continue;
    
    const slug = course.slug;
    const canonical = `https://www.skillvalix.com/courses/${slug}`;
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: 'SkillValix',
        sameAs: 'https://www.skillvalix.com'
      }
    };

    const head = buildHead({
      title: `${course.title} | SkillValix Courses`,
      description: course.description,
      canonical,
      ogImage: course.image || '',
      ogType: 'website',
      keywords: `${course.title}, free course, skillvalix courses, learn online`,
      jsonLd,
    });

    writeRoute(`/courses/${slug}`, injectIntoHtml(indexHtml, head));
    generated++;
  }
}

// ── 6.  Job Simulation pages ──────────────────────────────────────────────────
console.log('\n[prerender] Generating job simulation pages...');
const simsPath = path.join(ROOT, 'public/data/job-simulations.json');
if (fs.existsSync(simsPath)) {
  const allSims = JSON.parse(fs.readFileSync(simsPath, 'utf8'));
  for (const sim of allSims) {
    if (!sim.id) continue;
    const canonical = `https://www.skillvalix.com/job-simulation/${sim.id}`;
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOccupationalProgram',
      name: sim.title,
      description: sim.about,
      provider: {
        '@type': 'Organization',
        name: 'SkillValix',
        sameAs: 'https://www.skillvalix.com'
      }
    };

    const head = buildHead({
      title: `${sim.title} - SkillValix Events`,
      description: sim.about,
      canonical,
      ogType: 'website',
      keywords: `job simulation, ${sim.role}, virtual experience, skillvalix`,
      jsonLd,
    });

    writeRoute(`/job-simulation/${sim.id}`, injectIntoHtml(indexHtml, head));
    generated++;
  }
}

// ── 7.  Blog listing ──────────────────────────────────────────────────────────
console.log('\n[prerender] Generating static pages...');
writeRoute('/blog', injectIntoHtml(indexHtml, buildHead({
  title:       'Free Online Course Guides & Tech Tutorials | SkillValix Blog',
  description: "Explore expert guides on web development, Python, JavaScript, certifications, and career tips. Learn with SkillValix — India's top free online learning platform.",
  canonical:   'https://www.skillvalix.com/blog',
  ogImage:     'https://www.skillvalix.com/og-blog.png',
  ogType:      'website',
  keywords:    'free online courses, web development tutorials, python guides, javascript tips, certification blog',
  jsonLd: {
    '@context':  'https://schema.org',
    '@type':     'Blog',
    name:        'SkillValix Blog',
    url:         'https://www.skillvalix.com/blog',
    description: 'Expert learning guides on programming, certifications and career development.',
    publisher:   { '@type': 'Organization', name: 'SkillValix', url: 'https://www.skillvalix.com' },
  },
})));
generated++;

// ── 6.  Other static pages ────────────────────────────────────────────────────
const STATIC_PAGES = [
  {
    path:        '/',
    title:       'SkillValix — Free Online Courses with Certificate | Learn & Grow',
    description: 'Join SkillValix to access free online courses with certificates in web development, data science, Python, JavaScript & more. Start learning today!',
    canonical:   'https://www.skillvalix.com/',
    ogType:      'website',
    keywords:    'free online courses, online learning, web development course, python course, certificate',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type':    'WebSite',
      name:       'SkillValix',
      url:        'https://www.skillvalix.com',
      description:'Free online courses with certificates for students and professionals.',
      potentialAction: {
        '@type':       'SearchAction',
        target:        'https://www.skillvalix.com/courses?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  },
  {
    path:        '/courses',
    title:       'Free Online Courses with Certificate | SkillValix',
    description: 'Browse 100+ free online courses with certificate in programming, design, data science and more. Learn at your own pace on SkillValix.',
    canonical:   'https://www.skillvalix.com/courses',
    ogType:      'website',
    keywords:    'free courses online, programming courses, data science course, free certificate courses',
  },
  {
    path:        '/hackathons',
    title:       'Online Hackathons & Coding Competitions | SkillValix',
    description: 'Participate in live hackathons and coding competitions. Win prizes, build real projects, and get recognized on SkillValix.',
    canonical:   'https://www.skillvalix.com/hackathons',
    ogType:      'website',
    keywords:    'online hackathon, coding competition, student hackathon India, coding challenge',
  },
  {
    path:        '/certification',
    title:       'Get Certified Online | SkillValix Certifications',
    description: 'Earn industry-recognized certificates from SkillValix. Validate your skills in web development, Python, JavaScript and more.',
    canonical:   'https://www.skillvalix.com/certification',
    ogType:      'website',
    keywords:    'online certification, skill certificate, web development certificate, python certification',
  },
  {
    path:        '/free-courses',
    title:       'Top Free Online Courses | SkillValix',
    description: 'Access 100% free courses on SkillValix. No credit card required. Start learning coding, design, and business skills today.',
    canonical:   'https://www.skillvalix.com/free-courses',
    ogType:      'website',
    keywords:    'free courses, free coding courses, free online learning, 100% free certification',
  },
  {
    path:        '/campus-ambassador',
    title:       'Campus Ambassador Program | SkillValix',
    description: 'Become a SkillValix Campus Ambassador. Lead your campus community, earn rewards, and build leadership skills.',
    canonical:   'https://www.skillvalix.com/campus-ambassador',
    ogType:      'website',
    keywords:    'campus ambassador program, student leadership, college ambassador India',
  },
  {
    path:        '/privacy-policy',
    title:       'Privacy Policy | SkillValix',
    description: 'Read the SkillValix Privacy Policy to understand how we collect, use, and protect your personal information.',
    canonical:   'https://www.skillvalix.com/privacy-policy',
    ogType:      'website',
    keywords:    'privacy policy, data protection, SkillValix privacy',
  },
  {
    path:        '/terms',
    title:       'Terms of Service | SkillValix',
    description: 'Read the SkillValix Terms of Service governing the use of our platform, courses, and services.',
    canonical:   'https://www.skillvalix.com/terms',
    ogType:      'website',
    keywords:    'terms of service, terms and conditions, SkillValix terms',
  },
];

for (const page of STATIC_PAGES) {
  writeRoute(page.path, injectIntoHtml(indexHtml, buildHead({
    title:       page.title,
    description: page.description,
    canonical:   page.canonical,
    ogImage:     'https://www.skillvalix.com/og-default.png',
    ogType:      page.ogType,
    keywords:    page.keywords,
    jsonLd:      page.jsonLd,
  })));
  generated++;
}

console.log(`\n[prerender] ✅ Done — ${generated} static HTML files written to dist/`);
