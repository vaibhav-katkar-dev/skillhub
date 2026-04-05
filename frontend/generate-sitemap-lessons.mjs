/**
 * generate-sitemap-lessons.mjs
 * Run: node generate-sitemap-lessons.mjs
 * Generates public/sitemap-lessons.xml from public/data/all-courses.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.skillvalix.com';
const TODAY = new Date().toISOString().split('T')[0];

// Lessons starting with these keywords are typically thin/intro content
// — we still include them, but at lower priority
const LOW_VALUE_KEYWORDS = ['welcome', 'introduction', 'intro', 'overview', 'conclusion', 'summary', 'what\'s next'];

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isLowValueLesson(title) {
  const lower = (title || '').toLowerCase();
  return LOW_VALUE_KEYWORDS.some(kw => lower.includes(kw));
}

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Load data ──────────────────────────────────────────────────────────────
const raw = readFileSync(join(__dirname, 'public/data/all-courses.json'), 'utf-8');
const courses = JSON.parse(raw);

// ── Build XML entries ──────────────────────────────────────────────────────
const urlEntries = [];
let totalLessons = 0;

for (const entry of courses) {
  const course = entry.course;
  const lessons = entry.lessons || [];
  const courseSlug = course.slug;
  const courseTitle = escapeXml(course.title);

  for (const lesson of lessons) {
    const lessonId = lesson._id;
    const lessonTitle = lesson.title || '';
    const priority = isLowValueLesson(lessonTitle) ? '0.5' : '0.7';
    const escapedTitle = escapeXml(`${lessonTitle} — ${course.title} | SkillValix`);

    urlEntries.push(`  <url>
    <loc>${BASE_URL}/courses/${courseSlug}/lesson/${lessonId}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);

    totalLessons++;
  }
}

// ── Compose full XML ───────────────────────────────────────────────────────
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  SkillValix Lesson Sitemap — Auto-generated on ${TODAY}
  Total lessons indexed: ${totalLessons}
  DO NOT EDIT MANUALLY. Re-run: node generate-sitemap-lessons.mjs
-->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urlEntries.join('\n\n')}

</urlset>
`;

// ── Write output ───────────────────────────────────────────────────────────
const outPath = join(__dirname, 'public/sitemap-lessons.xml');
writeFileSync(outPath, xml, 'utf-8');

console.log(`✅ sitemap-lessons.xml generated`);
console.log(`   Courses : ${courses.length}`);
console.log(`   Lessons : ${totalLessons}`);
console.log(`   Output  : public/sitemap-lessons.xml`);
