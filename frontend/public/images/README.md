# SkillValix Public Images Directory

This directory holds static image assets for SkillValix. Any file placed inside `public/images/` will be served directly at root path `/images/...`.

## Recommended Folder Structure
- `public/images/courses/` -> Course cover images & thumbnails (e.g. `/images/courses/html5-masterclass.jpg`)
- `public/images/blogs/` -> Blog post header & inline images (e.g. `/images/blogs/seo-guide.png`)
- `public/images/banners/` -> Page hero banners & promotional graphics (e.g. `/images/banners/hackathon-2026.webp`)

## How to use in code & JSON:
1. **In `all-courses.json`**:
   ```json
   "image": "/images/courses/html5-masterclass.jpg"
   ```
2. **In React components**:
   ```jsx
   <img src="/images/courses/html5-masterclass.jpg" alt="HTML5 Course" />
   ```
3. **In Open Graph / SEO metadata**:
   Relative path `/images/courses/html5-masterclass.jpg` will automatically resolve to `https://www.skillvalix.com/images/courses/html5-masterclass.jpg`.

## Best Practices
- **Formats**: Use `.jpg` or `.webp` for photographs/illustrations, `.svg` or `.png` for icons and logos.
- **Dimensions**: Course cover images work best at 1200x630 px (standard Open Graph ratio).
- **Optimization**: Keep file sizes under 200KB for fast loading and maximum SEO performance.
