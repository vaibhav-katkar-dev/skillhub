/**
 * extractMeta.mjs
 *
 * Reads src/data/blogs.js and writes scripts/blogMeta.json containing
 * only the SEO metadata fields (no `content` HTML strings).
 *
 * Run automatically before each build via `npm run build`.
 * Run manually: node scripts/extractMeta.mjs
 *
 * Add this to your workflow whenever you add a new blog post to blogs.js.
 */

import { createRequire } from 'node:module';
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

// Dynamic import of blogs.js (it's an ES module)
const { blogPosts } = await import(
  `file:///${path.join(ROOT, 'src', 'data', 'blogs.js').replace(/\\/g, '/')}`
);

// Strip the `content` field — it's huge and not needed for prerendering
const meta = blogPosts.map(({
  id, title, metaTitle, metaDescription, canonicalUrl,
  imageUrl, keywords, author, publishedDate, date,
  excerpt, category, readTime, tags,
}) => ({
  id, title, metaTitle, metaDescription, canonicalUrl,
  imageUrl, keywords, author, publishedDate, date,
  excerpt, category, readTime, tags,
}));

const outPath = path.join(__dirname, 'blogMeta.json');
fs.writeFileSync(outPath, JSON.stringify(meta, null, 2), 'utf8');
console.log(`[extractMeta] ✓ Wrote ${meta.length} posts to scripts/blogMeta.json`);
