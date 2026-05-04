// vite.config.js
import { defineConfig } from "file:///H:/SkillHub/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///H:/SkillHub/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcjs from "file:///H:/SkillHub/frontend/node_modules/@tailwindcss/vite/dist/index.mjs";

// src/data/blogs.js
var blogPosts = [
  {
    id: "mastering-html5-semantic-tags-seo",
    title: "Mastering HTML5 in 2026: Why Semantic Tags Matter for SEO",
    metaTitle: "Mastering HTML5 in 2026: Why Semantic Tags Matter for SEO | SkillValix",
    metaDescription: "Learn how HTML5 semantic tags like <article>, <section>, and <nav> boost your search engine rankings and web accessibility in 2026. A must-read for every web developer.",
    keywords: [
      "HTML5 semantic tags",
      "HTML SEO",
      "semantic HTML for SEO",
      "web development 2026",
      "HTML5 tutorial",
      "web accessibility",
      "article tag HTML",
      "section tag HTML"
    ],
    excerpt: "Semantic HTML5 tags like <article>, <section>, and <nav> are no longer optional. Learn how using them correctly boosts both your search engine rankings and web accessibility.",
    content: `
      <h2>The Shift to Meaningful Markup</h2>
      <p>For years, developers relied heavily on <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> tags to structure their web pages. While this worked fine for styling, it gave search engines and screen readers zero context about <em>what</em> the content actually means. Enter HTML5 semantic tags \u2014 the single most underrated tool for boosting both SEO rankings and web accessibility.</p>
      <p>By replacing generic containers with meaningful elements, you are essentially handing Google a labelled map of your content's hierarchy and importance. This article covers every semantic tag that matters, why each one exists, and how using them correctly translates directly into better search rankings.</p>

      <h2>The Complete HTML5 Semantic Tag Reference</h2>

      <h3>&lt;header&gt; and &lt;footer&gt; \u2014 Define Your Page Boundaries</h3>
      <p>The <code>&lt;header&gt;</code> element represents introductory content for a page or a section. It typically contains the logo, primary navigation, and a headline. The <code>&lt;footer&gt;</code> holds secondary information \u2014 copyright, policy links, and contact details.</p>
      <p>Search engines use these to understand where your primary content begins and ends. Content inside <code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code> is weighted lower in relevance than content inside <code>&lt;main&gt;</code> or <code>&lt;article&gt;</code>.</p>
      <pre><code>&lt;header&gt;
  &lt;nav aria-label="Primary navigation"&gt;
    &lt;a href="/"&gt;Home&lt;/a&gt;
    &lt;a href="/courses"&gt;Courses&lt;/a&gt;
    &lt;a href="/blog"&gt;Blog&lt;/a&gt;
  &lt;/nav&gt;
&lt;/header&gt;</code></pre>

      <h3>&lt;main&gt; \u2014 The Crown Jewel</h3>
      <p>The <code>&lt;main&gt;</code> element is the most critical semantic tag for SEO. It identifies the dominant, unique content of the page. Google's crawlers prioritise content inside <code>&lt;main&gt;</code> above all else when determining relevance and ranking. Every page must have exactly one <code>&lt;main&gt;</code> element.</p>
      <pre><code>&lt;body&gt;
  &lt;header&gt;...&lt;/header&gt;

  &lt;main&gt;
    &lt;!-- This is what Google cares about most --&gt;
    &lt;article&gt;
      &lt;h1&gt;Your Primary Keyword-Rich Heading&lt;/h1&gt;
      &lt;p&gt;Your core content...&lt;/p&gt;
    &lt;/article&gt;
  &lt;/main&gt;

  &lt;footer&gt;...&lt;/footer&gt;
&lt;/body&gt;</code></pre>

      <h3>&lt;article&gt; and &lt;section&gt; \u2014 Content Hierarchy</h3>
      <p>These two are the most commonly confused semantic tags. Here is the simple rule: an <code>&lt;article&gt;</code> is self-contained content that makes sense on its own \u2014 a blog post, a product card, a forum post. A <code>&lt;section&gt;</code> is a thematic grouping of related content within a page that is NOT self-contained.</p>
      <ul>
        <li><strong>Use <code>&lt;article&gt;</code> for:</strong> Blog posts, news articles, product listings, user reviews, comment cards.</li>
        <li><strong>Use <code>&lt;section&gt;</code> for:</strong> Chapters within an article, thematic groups on a homepage (hero, features, pricing, testimonials).</li>
        <li><strong>Never use <code>&lt;div&gt;</code> when either applies.</strong> A div has no semantic meaning \u2014 it is invisible to search engines and screen readers.</li>
      </ul>

      <h3>&lt;nav&gt; \u2014 Signal Your Navigation Structure</h3>
      <p>The <code>&lt;nav&gt;</code> element should wrap your primary and secondary navigation menus. Using <code>aria-label</code> on multiple <code>&lt;nav&gt;</code> elements helps screen readers and search bots distinguish between your header nav, footer nav, and breadcrumb nav.</p>
      <pre><code>&lt;!-- Header navigation --&gt;
&lt;nav aria-label="Primary"&gt;...&lt;/nav&gt;

&lt;!-- Breadcrumb --&gt;
&lt;nav aria-label="Breadcrumb"&gt;
  &lt;ol&gt;
    &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="/blog"&gt;Blog&lt;/a&gt;&lt;/li&gt;
    &lt;li aria-current="page"&gt;Current Article&lt;/li&gt;
  &lt;/ol&gt;
&lt;/nav&gt;</code></pre>

      <h3>&lt;aside&gt; \u2014 Supplementary Content</h3>
      <p>The <code>&lt;aside&gt;</code> element marks content that is tangentially related to the main content \u2014 sidebars, pull quotes, related article lists, and advertisement slots. Google treats content inside <code>&lt;aside&gt;</code> as supplementary, not core \u2014 which is exactly correct for sidebars.</p>

      <h3>&lt;figure&gt; and &lt;figcaption&gt; \u2014 Images with Context</h3>
      <p>Whenever you use an image that is directly referenced by the surrounding text, wrap it in <code>&lt;figure&gt;</code> and describe it with <code>&lt;figcaption&gt;</code>. This creates a semantic link between the image and its description that Google can understand and index.</p>
      <pre><code>&lt;figure&gt;
  &lt;img src="css-flexbox-diagram.png" alt="CSS Flexbox axis diagram" width="800" height="450" /&gt;
  &lt;figcaption&gt;The main axis and cross axis in a CSS Flexbox container&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>

      <h3>&lt;time&gt; \u2014 Dates Google Can Read</h3>
      <p>The <code>&lt;time&gt;</code> element with a <code>datetime</code> attribute gives search engines a machine-readable date. This is critical for blog posts and news articles because Google uses it for freshness scoring \u2014 a key ranking signal.</p>
      <pre><code>&lt;time datetime="2026-03-15T09:00:00+05:30"&gt;March 15, 2026&lt;/time&gt;</code></pre>

      <h2>How Semantic Tags Directly Boost SEO Rankings</h2>
      <p>Here is the concrete mechanism: Google's crawler assigns different relevance weights to words based on which semantic container they are in. Keywords inside an <code>&lt;h1&gt;</code> within a <code>&lt;main&gt;</code> within an <code>&lt;article&gt;</code> carry the highest topical relevance signal. The same keywords buried inside a <code>&lt;div&gt;</code> inside another <code>&lt;div&gt;</code> carry virtually none.</p>
      <p>This is why two pages with identical visible content but different HTML structure can rank wildly differently. Semantic HTML is a direct ranking factor \u2014 not a nice-to-have.</p>

      <h2>Semantic HTML and Web Accessibility</h2>
      <p>Screen readers used by visually impaired users rely 100% on semantic HTML. When a user navigates to a page using a screen reader, it announces the page structure: "Header, navigation with 5 links. Main content. Heading level 1: Mastering HTML5 Semantic Tags. Article. Section..." Without semantic tags, a screen reader reads the entire page as one flat, undifferentiated stream of text \u2014 making it completely inaccessible.</p>
      <p>Accessibility is also a Lighthouse metric. A score below 90 on accessibility actively signals to Google that your site may not be high-quality \u2014 impacting your Search Console performance.</p>

      <h2>The Perfect HTML5 Page Structure Template</h2>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;Page Title \u2014 Your Brand&lt;/title&gt;
  &lt;meta name="description" content="Compelling 155-character description..."&gt;
  &lt;link rel="canonical" href="https://yoursite.com/this-page" /&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;nav aria-label="Primary"&gt;...&lt;/nav&gt;
  &lt;/header&gt;

  &lt;main&gt;
    &lt;article&gt;
      &lt;header&gt;
        &lt;h1&gt;Primary Keyword-Rich Title&lt;/h1&gt;
        &lt;time datetime="2026-03-15"&gt;March 15, 2026&lt;/time&gt;
      &lt;/header&gt;

      &lt;section&gt;
        &lt;h2&gt;Subtopic One&lt;/h2&gt;
        &lt;p&gt;Content...&lt;/p&gt;
        &lt;figure&gt;
          &lt;img src="..." alt="Descriptive alt text" /&gt;
          &lt;figcaption&gt;...&lt;/figcaption&gt;
        &lt;/figure&gt;
      &lt;/section&gt;

      &lt;section&gt;
        &lt;h2&gt;Subtopic Two&lt;/h2&gt;
        &lt;p&gt;Content...&lt;/p&gt;
      &lt;/section&gt;
    &lt;/article&gt;

    &lt;aside&gt;
      &lt;h3&gt;Related Articles&lt;/h3&gt;
      &lt;!-- Related links --&gt;
    &lt;/aside&gt;
  &lt;/main&gt;

  &lt;footer&gt;...&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

      <h2>Common Semantic HTML Mistakes to Avoid</h2>
      <ul>
        <li><strong>Multiple &lt;h1&gt; tags:</strong> Each page should have exactly one <code>&lt;h1&gt;</code>. It is your primary ranking signal. Multiple H1s dilute it.</li>
        <li><strong>Using &lt;section&gt; as a styled wrapper:</strong> If you are using <code>&lt;section&gt;</code> just to add padding or a background colour, use a <code>&lt;div&gt;</code>. Semantic tags must have a meaningful purpose.</li>
        <li><strong>Missing alt attributes on images:</strong> Every <code>&lt;img&gt;</code> needs a descriptive <code>alt</code> attribute. It is an accessibility requirement AND a ranking signal for image search.</li>
        <li><strong>Nesting interactive elements:</strong> Never put a <code>&lt;button&gt;</code> inside an <code>&lt;a&gt;</code> tag or vice versa. It is invalid HTML and breaks keyboard navigation.</li>
      </ul>

      <h2>What to Learn Next</h2>
      <p>Mastering semantic HTML is the first step. The next is learning how to style those semantic structures beautifully with CSS. Our <a href="/blog/css-grid-vs-flexbox-modern-web">CSS Grid vs Flexbox guide</a> shows you how to build modern, responsive page layouts that sit perfectly on top of your semantic HTML foundation. Then, add behaviour with our <a href="/blog/javascript-dom-manipulation-secrets">JavaScript DOM manipulation guide</a>.</p>
      <p>To master HTML5 from scratch \u2014 including forms, multimedia, accessibility, and structured data \u2014 check out the completely free <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> on SkillValix. It ends with a verifiable certificate you can link to on LinkedIn.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Do semantic HTML tags actually affect Google rankings?</strong><br/>
      Yes, directly. Google's crawler uses HTML structure to assign topical weight to keywords. Content inside semantic containers like <code>&lt;article&gt;</code> and <code>&lt;main&gt;</code> is weighted higher than content in generic <code>&lt;div&gt;</code> wrappers. The structure also enables rich results and featured snippets, which are exclusively triggered by correct semantic markup.</p>

      <p><strong>Q2: What is the difference between &lt;article&gt; and &lt;section&gt;?</strong><br/>
      An <code>&lt;article&gt;</code> is self-contained content that makes sense independently \u2014 you could publish it elsewhere and it would still make sense. A <code>&lt;section&gt;</code> is a thematic grouping within a larger page that is not independently meaningful. When in doubt: if it could be an RSS feed item, it is an <code>&lt;article&gt;</code>.</p>

      <p><strong>Q3: Can I use HTML5 semantic tags with React or other frameworks?</strong><br/>
      Absolutely. React and all modern JavaScript frameworks render to standard HTML in the browser. You write JSX using the same semantic tags \u2014 <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code> \u2014 and they compile to proper HTML that search engines and screen readers can read. SkillValix itself is built with React and uses full semantic HTML throughout.</p>

      <p><strong>Q4: Is semantic HTML different in 2026 vs older HTML5?</strong><br/>
      The core semantic tags have not changed \u2014 <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;figure&gt;</code>, <code>&lt;time&gt;</code> are all still the standard. What has evolved is Google's ability to parse and leverage them. In 2026, Google's understanding of semantic structure is far more nuanced \u2014 making correct usage even more impactful for rankings than it was even 3 years ago.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-15T09:00:00+05:30",
    modifiedDate: "2026-03-15T09:00:00+05:30",
    date: "March 15, 2026",
    readTime: "12 min read",
    wordCount: 1420,
    category: "SEO & HTML",
    tags: ["HTML5", "SEO", "Semantic HTML", "Web Development", "Accessibility", "HTML5 Tutorial", "On-Page SEO"],
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "HTML5 code on a computer screen showing semantic tags",
    canonicalUrl: "https://www.skillvalix.com/blog/mastering-html5-semantic-tags-seo",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass for Beginners",
      slug: "ultimate-html-masterclass",
      description: "Master semantic HTML5, multimedia, and form validations."
    }
  },
  {
    id: "css-grid-vs-flexbox-modern-web",
    title: "CSS Grid vs Flexbox: The Ultimate Guide for Modern Web Design",
    metaTitle: "CSS Grid vs Flexbox: The Ultimate Guide (2026) | SkillValix",
    metaDescription: "CSS Grid or Flexbox \u2014 which should you use and when? This 2026 guide breaks down the key differences, use cases, and how to combine both for pixel-perfect responsive web layouts.",
    keywords: [
      "CSS Grid vs Flexbox",
      "CSS layout tutorial",
      "Flexbox guide 2026",
      "CSS Grid guide 2026",
      "responsive web design",
      "modern CSS layout",
      "web design tutorial",
      "CSS for beginners"
    ],
    excerpt: "Confused about when to use CSS Grid and when to use Flexbox? We break down the differences and explain how to combine them for pixel-perfect, responsive layouts.",
    content: `
      <h2>The Two Kings of CSS Layout</h2>
      <p>Before Flexbox and CSS Grid, building layouts was a dark art of floats, clearfixes, and table-based hacks. Today, CSS gives us two purpose-built layout modules that solve different problems. But choosing between them \u2014 or knowing when to combine them \u2014 is a skill that separates junior developers from senior ones.</p>
      <p>This guide gives you the definitive answer, with real code examples for every scenario.</p>

      <h2>CSS Flexbox: The One-Dimensional Specialist</h2>
      <p>Flexbox (Flexible Box Layout) was built for <strong>one-dimensional layouts</strong> \u2014 it handles a row of items OR a column of items, not both simultaneously. Its superpower is distributing space and aligning items within a single axis.</p>

      <h3>When to Use Flexbox</h3>
      <ul>
        <li><strong>Navigation bars</strong> \u2014 distribute links horizontally with equal spacing</li>
        <li><strong>Card rows</strong> \u2014 keep cards equal height regardless of content</li>
        <li><strong>Centering anything</strong> \u2014 <code>display: flex; align-items: center; justify-content: center</code> is the cleanest centering technique in CSS</li>
        <li><strong>Icon + text alignment</strong> \u2014 keep an icon vertically centred next to text</li>
        <li><strong>Responsive button groups</strong> \u2014 wrap buttons to a new row on mobile</li>
      </ul>

      <pre><code>/* Perfect horizontal navbar with Flexbox */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

/* Equal-height card row */
.card-row {
  display: flex;
  gap: 24px;
  align-items: stretch; /* Cards match height of tallest */
}

/* The famous perfect-center trick */
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}</code></pre>

      <h3>Key Flexbox Properties You Must Know</h3>
      <ul>
        <li><code>flex-direction</code>: <code>row</code> (default) or <code>column</code> \u2014 sets the main axis</li>
        <li><code>justify-content</code>: Aligns items on the main axis (<code>flex-start</code>, <code>center</code>, <code>space-between</code>, <code>space-around</code>)</li>
        <li><code>align-items</code>: Aligns items on the cross axis (<code>stretch</code>, <code>center</code>, <code>flex-start</code>)</li>
        <li><code>flex-wrap: wrap</code>: Allows items to wrap to a new row when space runs out</li>
        <li><code>flex: 1</code>: Tells an item to take up all remaining space</li>
        <li><code>gap</code>: Sets spacing between flex items (much cleaner than margins)</li>
      </ul>

      <h2>CSS Grid: The Two-Dimensional Powerhouse</h2>
      <p>CSS Grid was designed for <strong>two-dimensional layouts</strong> \u2014 it controls rows AND columns simultaneously. It is the correct tool for the overall page skeleton, complex content grids, and any layout where you need items to align on both axes.</p>

      <h3>When to Use CSS Grid</h3>
      <ul>
        <li><strong>Overall page layout</strong> \u2014 header, sidebar, main content, footer</li>
        <li><strong>Responsive card grids</strong> \u2014 a 4-column grid that collapses to 2, then 1</li>
        <li><strong>Magazine/editorial layouts</strong> \u2014 items spanning multiple columns or rows</li>
        <li><strong>Dashboard widgets</strong> \u2014 widgets of different sizes arranged in a precise grid</li>
        <li><strong>Image galleries</strong> \u2014 masonry-style or uniform grids</li>
      </ul>

      <pre><code>/* Full page layout with CSS Grid */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main  "
    "footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header;  }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main;    }
.footer  { grid-area: footer;  }

/* Responsive card grid \u2014 automatically adjusts columns */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* An item spanning multiple columns */
.featured-card {
  grid-column: span 2;
}</code></pre>

      <h3>The repeat(auto-fill, minmax()) Pattern</h3>
      <p>This single line of CSS Grid code is one of the most powerful responsive layout techniques ever created. It automatically fills the row with as many columns as fit, with each column being at minimum 280px wide. No media queries needed:</p>
      <pre><code>grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
/* On a wide screen: 4 columns
   On a tablet:       2 columns  
   On mobile:         1 column
   \u2014 all automatically, no @media queries */</code></pre>

      <h2>The Decision Framework: Grid or Flexbox?</h2>
      <p>Ask yourself this one question: <strong>"Does my layout have both rows AND columns?"</strong></p>
      <ul>
        <li><strong>Yes:</strong> Use CSS Grid. You need two-dimensional control.</li>
        <li><strong>No, just one direction:</strong> Use Flexbox. You only need one-dimensional alignment.</li>
      </ul>
      <p>A quick visual reference:</p>
      <ul>
        <li>Navbar links in a row \u2192 <strong>Flexbox</strong></li>
        <li>Course cards in a responsive grid \u2192 <strong>CSS Grid</strong></li>
        <li>Centering a modal \u2192 <strong>Flexbox</strong></li>
        <li>Full page skeleton (header/sidebar/main/footer) \u2192 <strong>CSS Grid</strong></li>
        <li>Button with icon + text \u2192 <strong>Flexbox</strong></li>
        <li>Dashboard with mixed widget sizes \u2192 <strong>CSS Grid</strong></li>
      </ul>

      <h2>The Expert Approach: Combine Both</h2>
      <p>The secret that senior developers know is that it is never Grid <em>versus</em> Flexbox \u2014 it is Grid <em>and</em> Flexbox together. The pattern is:</p>
      <ul>
        <li><strong>CSS Grid</strong> controls the macro layout \u2014 the overall page structure with areas</li>
        <li><strong>Flexbox</strong> controls the micro layout \u2014 how items align <em>inside</em> each grid cell</li>
      </ul>
      <pre><code>/* Grid handles the page structure */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

/* Flexbox handles alignment inside a grid cell */
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}</code></pre>
      <p>Using them together like this is the correct approach \u2014 you are using each tool for what it was designed for.</p>

      <h2>CSS Grid vs Flexbox Browser Support in 2026</h2>
      <p>Both are supported in 100% of modern browsers. CSS Grid (including <code>grid-template-areas</code> and <code>subgrid</code>) has been available in all major browsers since 2022. You can use everything in this guide in production today without any polyfills.</p>

      <h2>Related Learning</h2>
      <p>Now that you understand layout, the next step is adding motion and interactivity. Our <a href="/blog/css-animations-micro-interactions-guide">CSS micro animations guide</a> shows you how to animate your Flexbox and Grid components with CSS transitions. And our <a href="/blog/mastering-html5-semantic-tags-seo">HTML5 semantic tags guide</a> explains the meaningful container elements that Grid and Flexbox should be applied to.</p>
      <p>To practice these in a structured, hands-on environment, check out the free <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro course</a> on SkillValix \u2014 complete with exercises and a verifiable certificate.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Is CSS Grid replacing Flexbox?</strong><br/>
      No. They serve different purposes and will likely both exist forever. Grid solves two-dimensional layout problems that Flexbox cannot handle elegantly. Flexbox solves one-dimensional alignment problems with less code than Grid. Both are used extensively on every modern website \u2014 including SkillValix.</p>

      <p><strong>Q2: Can I use CSS Grid for all my layouts?</strong><br/>
      Technically yes, but Grid has more syntax overhead for simple one-dimensional cases. Using <code>display: grid; grid-template-columns: repeat(3, 1fr)</code> when <code>display: flex</code> would achieve the same with less code is fighting the tool. Use Flexbox when you only need one axis of control.</p>

      <p><strong>Q3: Which is better for responsive design?</strong><br/>
      Both are excellent for responsive design. CSS Grid's <code>repeat(auto-fill, minmax(280px, 1fr))</code> is the most powerful single responsive layout technique in CSS \u2014 no media queries required. Flexbox's <code>flex-wrap: wrap</code> is great for simpler responsive rows. Often the best responsive designs use both.</p>

      <p><strong>Q4: What is CSS Subgrid and should I use it?</strong><br/>
      CSS Subgrid (the <code>subgrid</code> value for <code>grid-template-columns</code>) allows nested grid items to align to the parent grid's columns. It is fully supported in all modern browsers as of 2023 and is extremely useful for card grids where you want inner elements (titles, descriptions, buttons) to align across different-sized cards. Yes, use it.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-12T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 12, 2026",
    readTime: "13 min read",
    wordCount: 1550,
    category: "CSS & Design",
    tags: ["CSS Grid", "Flexbox", "CSS Layout", "Responsive Design", "Web Design", "CSS Tutorial 2026"],
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "CSS code on screen showing grid and flexbox layout examples",
    canonicalUrl: "https://www.skillvalix.com/blog/css-grid-vs-flexbox-modern-web",
    relatedCourse: {
      title: "CSS for Beginners: Learn Web Styling from Zero to Pro",
      slug: "css-for-beginners-learn-web-styling-zero-to-pro",
      description: "Learn Flexbox, Grid, animations and responsive design."
    }
  },
  {
    id: "javascript-dom-manipulation-secrets",
    title: "JavaScript DOM Manipulation Secrets that Pro Developers Use (2026)",
    metaTitle: "JavaScript DOM Manipulation Secrets Pro Developers Use (2026) | SkillValix",
    metaDescription: "Discover the modern, performant techniques to select, traverse, and modify the DOM using vanilla JavaScript in 2026. Learn querySelector, DocumentFragment, event delegation, and MutationObserver \u2014 upgrade your JS skills today.",
    keywords: [
      "JavaScript DOM manipulation",
      "DOM tutorial 2026",
      "vanilla JavaScript DOM",
      "querySelector vs getElementById",
      "DocumentFragment JavaScript",
      "event delegation JavaScript",
      "JavaScript performance optimization",
      "MutationObserver JavaScript",
      "modern JavaScript techniques",
      "JavaScript for beginners 2026"
    ],
    excerpt: "Stop relying on older, slower DOM techniques. Discover the modern, performant ways to select, traverse, and modify the Document Object Model using vanilla JavaScript \u2014 the techniques senior developers actually use in production.",
    content: `
      <h2>The DOM is Your Playground</h2>
      <p>The Document Object Model (DOM) is the bridge between your HTML and your JavaScript. It is a live, in-memory tree representation of your page \u2014 every element, attribute, and text node is an object you can read, modify, or delete with JavaScript. While frameworks like React and Vue abstract the DOM away with virtual diffing, understanding how to manipulate it directly is a foundational skill every developer needs \u2014 because frameworks are built on top of it.</p>
      <p>The difference between a junior and a senior JavaScript developer is often not what they know about the language itself \u2014 it is how efficiently they interact with the DOM. Let us cover every technique that matters.</p>

      <h2>Selecting Elements: The Modern Way</h2>
      <p>Forget <code>getElementById</code>, <code>getElementsByClassName</code>, and <code>getElementsByTagName</code>. These older APIs return <em>live</em> HTMLCollections and have inconsistent return types. Modern JavaScript uses two methods for everything:</p>

      <h3>querySelector and querySelectorAll</h3>
      <pre><code>// Selects the first matching element (returns a single Element or null)
const activeBtn = document.querySelector('nav button.active');

// Selects ALL matching elements (returns a static NodeList)
const allCards = document.querySelectorAll('.course-card');

// Complex CSS selectors work perfectly
const firstInputInForm = document.querySelector('form:first-of-type input[type="email"]');

// Convert NodeList to Array for full array methods
const cardsArray = Array.from(allCards);
// or
const cardsArray2 = [...allCards];</code></pre>
      <p>The critical insight: <code>querySelectorAll</code> returns a <strong>static</strong> NodeList \u2014 it captures the elements at the moment of the call and does not update if elements are added or removed. This is almost always what you want.</p>

      <h3>Traversing the DOM Tree</h3>
      <pre><code>const card = document.querySelector('.course-card');

// Navigate parent/child/sibling relationships
card.parentElement;          // The element's direct parent
card.children;               // Live HTMLCollection of direct children
card.firstElementChild;      // First child element
card.lastElementChild;       // Last child element
card.nextElementSibling;     // Next sibling element
card.previousElementSibling; // Previous sibling element

// Check if an element matches a selector
if (card.matches('.featured')) { /* ... */ }

// Get closest ancestor matching a selector (very useful for event delegation)
const form = inputElement.closest('form');</code></pre>

      <h2>Reading and Writing Content</h2>
      <h3>textContent vs innerHTML vs innerText</h3>
      <p>This is one of the most common sources of bugs and security vulnerabilities in JavaScript:</p>
      <pre><code>const el = document.querySelector('.title');

// \u2705 textContent \u2014 safest, fastest. Returns/sets ALL text, including hidden elements.
el.textContent = 'New Title';

// \u26A0\uFE0F innerHTML \u2014 parses HTML, so it is slower and a security risk if the 
// content comes from user input (XSS vulnerability!)
el.innerHTML = '<strong>Bold Title</strong>';

// \u26A0\uFE0F innerText \u2014 returns only VISIBLE text, triggers layout reflow. Slow.
// Use textContent unless you need to exclude hidden text.</code></pre>
      <p><strong>Security rule:</strong> Never set <code>innerHTML</code> with content that comes from a user \u2014 this is a classic XSS (Cross-Site Scripting) attack vector. Always use <code>textContent</code> for user-provided strings.</p>

      <h2>Modifying Styles and Classes</h2>
      <pre><code>const card = document.querySelector('.card');

// \u2705 Use classList methods \u2014 cleaner than manipulating className strings
card.classList.add('active');
card.classList.remove('hidden');
card.classList.toggle('expanded');       // Adds if absent, removes if present
card.classList.replace('old', 'new');
card.classList.contains('active');       // Returns boolean

// Add inline styles (only when dynamic values require it)
card.style.transform = 'translateY(-8px)';
card.style.setProperty('--card-color', '#4f46e5'); // Set CSS custom property

// Read computed styles (what the browser actually renders)
const styles = getComputedStyle(card);
console.log(styles.fontSize); // '16px'</code></pre>

      <h2>Efficient DOM Updates: The DocumentFragment Pattern</h2>
      <p>Directly modifying the live DOM is the most expensive operation in JavaScript. Every insertion triggers the browser to recalculate layout (reflow) and repaint the screen. If you insert 50 elements one by one in a loop, you trigger 50 reflows. The solution is <code>DocumentFragment</code>:</p>
      <pre><code>// \u274C Bad \u2014 50 reflows
const list = document.querySelector('#course-list');
courses.forEach(course => {
  const li = document.createElement('li');
  li.textContent = course.title;
  list.appendChild(li); // Reflow on every call!
});

// \u2705 Good \u2014 exactly 1 reflow
const list = document.querySelector('#course-list');
const fragment = document.createDocumentFragment();

courses.forEach(course => {
  const li = document.createElement('li');
  li.textContent = course.title;
  fragment.appendChild(li); // No reflow \u2014 fragment is NOT in the live DOM
});

list.appendChild(fragment); // One reflow total</code></pre>
      <p>For even better performance when inserting large amounts of HTML, use <code>insertAdjacentHTML</code> \u2014 it is faster than <code>innerHTML</code> because it does not destroy and recreate existing DOM:</p>
      <pre><code>// Insert HTML without destroying existing content
list.insertAdjacentHTML('beforeend', '<li>New Course</li>');
// Positions: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'</code></pre>

      <h2>Event Handling: The Right Way</h2>

      <h3>addEventListener vs onclick</h3>
      <pre><code>// \u274C Old way \u2014 onclick property (only one handler per element)
button.onclick = handleClick;

// \u2705 Modern way \u2014 addEventListener (multiple handlers, more control)
button.addEventListener('click', handleClick);
button.addEventListener('click', handleAnalytics); // Both will fire

// Remove a listener (must pass the same function reference)
button.removeEventListener('click', handleClick);

// One-time listener (auto-removes after first trigger)
button.addEventListener('click', handleClick, { once: true });</code></pre>

      <h3>Event Delegation: The Performance Superpower</h3>
      <p>Event delegation is the single most impactful DOM performance pattern. Instead of attaching individual listeners to each item in a list (which wastes memory and does not work for dynamically added items), you attach ONE listener to a parent element and use the event object to determine what was clicked:</p>
      <pre><code>// \u274C Bad \u2014 100 listeners for 100 items, and new items won't work
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('click', () => { /* ... */ });
});

// \u2705 Good \u2014 1 listener handles all cards, including future ones
const grid = document.querySelector('.courses-grid');

grid.addEventListener('click', (event) => {
  // Find the closest .course-card ancestor of the clicked element
  const card = event.target.closest('.course-card');
  if (!card) return; // Click was outside a card

  const courseId = card.dataset.courseId;
  navigateToCourse(courseId);
});</code></pre>
      <p>Event delegation works because of <strong>event bubbling</strong>: events fire on the target element and then "bubble up" through every ancestor element. A click on a button fires on the button, then the card, then the grid, then the body, then the document.</p>

      <h2>Watching DOM Changes: MutationObserver</h2>
      <p>Sometimes you need to react when the DOM changes \u2014 for example, when a third-party script adds an element, or when a framework renders content asynchronously. <code>MutationObserver</code> is the modern API for this:</p>
      <pre><code>const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Check for added nodes
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.matches('.notification')) {
        handleNewNotification(node);
      }
    });
  });
});

// Start observing a target element
observer.observe(document.body, {
  childList: true,  // Watch for added/removed children
  subtree: true,    // Watch all descendants
});

// Stop when done (important for memory management!)
observer.disconnect();</code></pre>

      <h2>Async DOM Patterns: Intersection Observer</h2>
      <p>The <code>IntersectionObserver</code> API lets you efficiently detect when an element enters or leaves the viewport \u2014 without any scroll event listeners (which are expensive):</p>
      <pre><code>// Lazy load images \u2014 only fetch when they enter the viewport
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Load the real image
      imageObserver.unobserve(img); // Stop watching once loaded
    }
  });
}, { rootMargin: '200px' }); // Start loading 200px before visible

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});</code></pre>

      <h2>The complete DOM API Cheat Sheet</h2>
      <ul>
        <li><strong>Select one:</strong> <code>document.querySelector(selector)</code></li>
        <li><strong>Select all:</strong> <code>document.querySelectorAll(selector)</code></li>
        <li><strong>Create:</strong> <code>document.createElement('div')</code></li>
        <li><strong>Append:</strong> <code>parent.appendChild(el)</code> or <code>parent.append(el, text)</code></li>
        <li><strong>Remove:</strong> <code>el.remove()</code></li>
        <li><strong>Replace:</strong> <code>parent.replaceChild(newEl, oldEl)</code></li>
        <li><strong>Clone:</strong> <code>el.cloneNode(true)</code> (deep clone)</li>
        <li><strong>Get attribute:</strong> <code>el.getAttribute('href')</code></li>
        <li><strong>Set attribute:</strong> <code>el.setAttribute('data-id', '42')</code></li>
        <li><strong>Data attributes:</strong> <code>el.dataset.courseId</code> (reads <code>data-course-id</code>)</li>
      </ul>

      <h2>Related Learning</h2>
      <p>DOM manipulation works best when you understand the HTML structure underneath it. Read our <a href="/blog/mastering-html5-semantic-tags-seo">HTML5 semantic tags guide</a> to understand what you are selecting, and our <a href="/blog/css-animations-micro-interactions-guide">CSS micro animations guide</a> to learn how to trigger CSS animations from JavaScript using <code>classList</code>.</p>
      <p>To master JavaScript from scratch \u2014 variables, functions, closures, async/await, and DOM manipulation \u2014 enrol in the completely free <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a> on SkillValix. It ends with a verifiable certificate you can attach to your LinkedIn profile.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Should I still learn DOM manipulation if I use React?</strong><br/>
      Absolutely. React's virtual DOM is an abstraction built on top of real DOM APIs. When you face a problem React can't solve cleanly \u2014 integrating a third-party library, manipulating a canvas, or optimising a critical rendering path \u2014 you need direct DOM knowledge. Senior React developers reach for the DOM regularly.</p>

      <p><strong>Q2: What is the difference between getElementById and querySelector?</strong><br/>
      <code>getElementById</code> is marginally faster for ID lookups because it has a dedicated internal index. But <code>querySelector</code> is far more flexible (it accepts any CSS selector), returns <code>null</code> instead of <code>undefined</code> for missing elements, and has a consistent API with <code>querySelectorAll</code>. In 2026, use <code>querySelector</code> exclusively unless you need the absolute maximum performance in a tight loop.</p>

      <p><strong>Q3: Is innerHTML safe to use?</strong><br/>
      Only if the HTML content is entirely under your control. If any part of the HTML string comes from user input (a search term, a form field, a URL parameter), you must sanitise it first using the <code>DOMPurify</code> library or use <code>textContent</code> instead. Setting raw user input via <code>innerHTML</code> is a textbook XSS vulnerability.</p>

      <p><strong>Q4: What is event.stopPropagation() and when should I use it?</strong><br/>
      <code>event.stopPropagation()</code> stops the event from bubbling up to parent elements. Use it sparingly \u2014 it can break event delegation patterns and make debugging difficult. The only valid case is when you genuinely need to prevent a parent handler from firing for a specific child interaction, like a delete button inside a clickable card.</p>
    `,
    author: "Amit Patel",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-08T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 08, 2026",
    readTime: "14 min read",
    wordCount: 1620,
    category: "JavaScript",
    tags: ["JavaScript DOM", "Vanilla JavaScript", "Web Performance", "Frontend Development", "JavaScript Tutorial 2026", "Event Delegation"],
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "JavaScript code on a dark editor screen showing DOM manipulation techniques",
    canonicalUrl: "https://www.skillvalix.com/blog/javascript-dom-manipulation-secrets",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Master Vanilla JS, DOM manipulation, closures, async/await and more \u2014 free with a verifiable certificate."
    }
  },
  {
    id: "python-beginner-mistakes-to-avoid",
    title: "10 Python Mistakes Every Beginner Makes (And How to Fix Them)",
    metaTitle: "10 Python Mistakes Every Beginner Makes & How to Fix Them (2026) | SkillValix",
    metaDescription: "Avoid the most common Python beginner mistakes in 2026. From mutable default arguments to bare exceptions \u2014 learn how to write clean, Pythonic code from day one.",
    keywords: [
      "Python beginner mistakes",
      "Python tips 2026",
      "Python tutorial for beginners",
      "Pythonic code",
      "Python best practices",
      "Python list comprehension",
      "Python context manager",
      "learn Python"
    ],
    excerpt: "Writing Python code is easy \u2014 writing it correctly is another story. Avoid these common beginner pitfalls and instantly level up your Python skills with clean, professional habits.",
    content: `
      <h2>Python Looks Easy \u2014 Until It Isn't</h2>
      <p>Python is famous for its beginner-friendly syntax. But that simplicity can be deceiving. Many beginners pick up bad habits early that cause hard-to-debug bugs later. Let's fix them right now.</p>

      <h3>1. Using == to Compare Instead of is</h3>
      <p>Beginners often use <code>==</code> to check if a variable is <code>None</code>, <code>True</code>, or <code>False</code>. The correct and Pythonic way is to use <code>is</code> for identity checks.</p>
      <pre><code># \u274C Wrong
if result == None:
    print("No result")

# \u2705 Correct
if result is None:
    print("No result")</code></pre>

      <h3>2. Mutable Default Arguments in Functions</h3>
      <p>This is one of Python's most notorious traps. Never use a mutable object like a list or dictionary as a default parameter value. It is created once and shared across all calls to the function.</p>
      <pre><code># \u274C Wrong \u2014 the same list persists across calls!
def add_item(item, cart=[]):
    cart.append(item)
    return cart

# \u2705 Correct \u2014 use None as default, create inside
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart</code></pre>

      <h3>3. Not Using List Comprehensions</h3>
      <p>A traditional loop to build a list is verbose and slow. Python's list comprehensions are not just shorter \u2014 they are also faster under the hood because they are optimised at the interpreter level.</p>
      <pre><code># \u274C Verbose way
squares = []
for i in range(1, 11):
    squares.append(i ** 2)

# \u2705 Pythonic way \u2014 list comprehension
squares = [i ** 2 for i in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]</code></pre>

      <h3>4. Catching Bare Exceptions</h3>
      <p>Writing <code>except:</code> with no exception type silently swallows every error \u2014 including keyboard interrupts and system exits. Always specify which exception you expect.</p>
      <pre><code># \u274C Wrong \u2014 catches literally everything
try:
    result = 10 / 0
except:
    print("Something went wrong")

# \u2705 Correct \u2014 specific and informative
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Math error: {e}")</code></pre>

      <h3>5. Opening Files Without a Context Manager</h3>
      <p>Forgetting to close a file leads to memory leaks and data corruption. Always use <code>with open()</code> \u2014 it guarantees the file is closed automatically, even if an error occurs inside the block.</p>
      <pre><code># \u274C Wrong \u2014 what if an error occurs before file.close()?
file = open("data.txt", "r")
content = file.read()
file.close()

# \u2705 Correct \u2014 auto-closes no matter what
with open("data.txt", "r") as file:
    content = file.read()</code></pre>

      <h3>Bonus: Use enumerate() Instead of range(len())</h3>
      <p>When you need both the index and the value while looping over a list, avoid the clunky <code>range(len(...))</code> pattern. Python's built-in <code>enumerate()</code> is cleaner and more readable.</p>
      <pre><code># \u274C Ugly way
fruits = ["Apple", "Banana", "Mango"]
for i in range(len(fruits)):
    print(i, fruits[i])

# \u2705 Pythonic way
for i, fruit in enumerate(fruits):
    print(i, fruit)</code></pre>

      <h2>Write Python the Way Python Was Meant to Be Written</h2>
      <p>These fixes are not just cosmetic. They improve performance, prevent bugs, and make your code far easier for other developers (and your future self) to read and maintain. The Python community calls this writing <strong>Pythonic</strong> code \u2014 clean, expressive, and idiomatic.</p>
      <p>To build these habits from day one, start the free <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass</a> on SkillValix. Begin with <a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e01">Lesson 1: Welcome to Python</a> and follow through to <a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e05">Lesson 5: Functions \u2014 Reusable Code Blocks</a> where default argument pitfalls (mistake #2 above) are covered in depth. The course ends with a verifiable certificate you can add to your LinkedIn and resume.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: What is the most dangerous Python mistake in this list?</strong><br/>
      Mutable default arguments (Mistake #2). Unlike the other mistakes which simply produce wrong output, mutable defaults cause shared state between function calls \u2014 bugs that are extremely hard to reproduce and diagnose because the function works correctly on the first call and fails on subsequent ones. This specific mistake has been responsible for production bugs at major companies.</p>

      <p><strong>Q2: Should I use list comprehensions everywhere?</strong><br/>
      Use them when they make the code clearly readable \u2014 which is most of the time for simple transformations. However, if a comprehension becomes too nested or complex to read in one glance, a traditional loop is better. Python's philosophy is: readability counts. If a comprehension requires 5 seconds to parse, it has failed.</p>

      <p><strong>Q3: Are these mistakes relevant to Python 3.11+?</strong><br/>
      Yes. Python 3.11 and later versions improved error messages and performance, but the language-level patterns remain identical. Using <code>is None</code> instead of <code>== None</code>, avoiding bare except, and using context managers are timeless Python best practices that apply to every version from 3.8 to 3.13+.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-17T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 17, 2026",
    readTime: "10 min read",
    wordCount: 820,
    category: "Python",
    tags: ["Python", "Python Tips", "Beginner Python", "Clean Code", "Pythonic Code", "Python Best Practices", "Programming"],
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Python code on a laptop screen with a dark theme",
    canonicalUrl: "https://www.skillvalix.com/blog/python-beginner-mistakes-to-avoid",
    relatedCourse: {
      title: "Python Basics",
      slug: "ultimate-python-masterclass",
      description: "Master Python from scratch \u2014 variables, loops, functions, OOP and more."
    }
  },
  {
    id: "java-beginner-mistakes-to-avoid",
    title: "10 Java Mistakes Every Beginner Makes (And How to Fix Them)",
    metaTitle: "10 Java Mistakes Every Beginner Makes & How to Fix Them (2026) | SkillValix",
    metaDescription: "Avoid the most common Java beginner mistakes in 2026. From NullPointerException to ignoring access modifiers \u2014 learn how to write clean, professional Java code from day one.",
    keywords: [
      "Java beginner mistakes",
      "Java tips 2026",
      "Java tutorial for beginners",
      "Java best practices",
      "Java common errors",
      "Java NullPointerException fix",
      "Java OOP tips",
      "learn Java programming",
      "Java clean code",
      "Java interview tips"
    ],
    excerpt: "Java is one of the most powerful languages in the world \u2014 but beginners fall into the same traps every time. Fix these 10 Java mistakes right now and write code that actually works in production.",
    content: `
      <h2>Java Is Powerful \u2014 But It Punishes Bad Habits</h2>
      <p>Java is famous for being strict and verbose. That strictness is actually a feature \u2014 it forces you to think. But beginners still manage to write Java that compiles fine yet behaves horribly at runtime. Let's fix the 10 most common mistakes right now.</p>

      <h3>1. Using == to Compare Strings</h3>
      <p>This is the #1 Java beginner mistake. The <code>==</code> operator checks if two variables point to the <em>same object in memory</em> \u2014 not whether their content is equal. For Strings, always use <code>.equals()</code>.</p>
      <pre><code>// \u274C Wrong \u2014 compares memory references, not content
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b); // false \u{1F631}

// \u2705 Correct \u2014 compares actual string content
System.out.println(a.equals(b)); // true \u2705

// \u2705 Extra safe \u2014 avoids NullPointerException
System.out.println("hello".equals(a)); // true \u2705</code></pre>

      <h3>2. Not Handling NullPointerException (NPE)</h3>
      <p>NullPointerException is the most common Java runtime crash. It happens when you call a method on a variable that holds <code>null</code>. Always check for null or use the <code>Optional</code> class introduced in Java 8.</p>
      <pre><code>// \u274C Wrong \u2014 crashes if getName() returns null
String name = user.getName();
System.out.println(name.toUpperCase()); // \u{1F4A5} NPE!

// \u2705 Correct \u2014 null check first
String name = user.getName();
if (name != null) {
    System.out.println(name.toUpperCase());
}

// \u2705 Modern way \u2014 use Optional (Java 8+)
Optional.ofNullable(user.getName())
        .map(String::toUpperCase)
        .ifPresent(System.out::println);</code></pre>

      <h3>3. Ignoring Access Modifiers</h3>
      <p>Beginners make every field <code>public</code> for convenience \u2014 breaking encapsulation. Making fields public means any class can change them directly, bypassing validation logic and causing unpredictable bugs.</p>
      <pre><code>// \u274C Wrong \u2014 anyone can set a negative age!
public class Person {
    public int age;
}
Person p = new Person();
p.age = -999; // Nothing stops this \u{1F631}

// \u2705 Correct \u2014 private field + validated setter
public class Person {
    private int age;

    public int getAge() { return age; }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) this.age = age;
        else throw new IllegalArgumentException("Invalid age!");
    }
}</code></pre>

      <h3>4. Using Raw Types Instead of Generics</h3>
      <p>Raw types like <code>ArrayList</code> without a type parameter were the old Java way. They cause <code>ClassCastException</code> at runtime and lose all compiler type-safety. Always specify the generic type.</p>
      <pre><code>// \u274C Wrong \u2014 raw type loses type safety
ArrayList list = new ArrayList();
list.add("hello");
list.add(42); // No error at compile time!
String s = (String) list.get(1); // \u{1F4A5} ClassCastException at runtime!

// \u2705 Correct \u2014 generic type enforced at compile time
ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("hello");
// list.add(42); // \u2705 Compiler catches this immediately!</code></pre>

      <h3>5. Catching Generic Exception</h3>
      <p>Catching <code>Exception</code> or <code>Throwable</code> at the top level silently swallows every error \u2014 including <code>OutOfMemoryError</code> and <code>StackOverflowError</code>. Always catch the most specific exception possible.</p>
      <pre><code>// \u274C Wrong \u2014 hides the real problem completely
try {
    int result = Integer.parseInt(input);
} catch (Exception e) {
    System.out.println("Error");
}

// \u2705 Correct \u2014 catch specific, log the cause
try {
    int result = Integer.parseInt(input);
} catch (NumberFormatException e) {
    System.out.println("Invalid number: " + e.getMessage());
}</code></pre>

      <h3>6. Not Closing Resources (Memory Leaks)</h3>
      <p>File streams, database connections, and network sockets must be closed after use. If an exception occurs before <code>close()</code>, you leak resources. Use <strong>try-with-resources</strong> (Java 7+) \u2014 it auto-closes everything.</p>
      <pre><code>// \u274C Wrong \u2014 connection may never close on error!
Connection conn = DriverManager.getConnection(url);
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users");
// ... if exception here, conn never closes \u{1F631}

// \u2705 Correct \u2014 try-with-resources auto-closes all
try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
    while (rs.next()) {
        System.out.println(rs.getString("name"));
    }
} // All auto-closed, even on exception \u2705</code></pre>

      <h3>7. Concatenating Strings in Loops</h3>
      <p>Strings in Java are <strong>immutable</strong>. Every time you use <code>+</code> inside a loop, Java creates a brand new String object in memory \u2014 this is O(n\xB2) performance and causes massive memory pressure. Use <code>StringBuilder</code> instead.</p>
      <pre><code>// \u274C Wrong \u2014 creates 1000 temporary String objects!
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i + ", "; // New object every iteration \u{1F631}
}

// \u2705 Correct \u2014 StringBuilder modifies in-place
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String result = sb.toString(); // One final String \u2705</code></pre>

      <h3>8. Using int Instead of long for Large Numbers</h3>
      <p>Java's <code>int</code> holds a maximum value of ~2.1 billion (2,147,483,647). Many beginners use <code>int</code> for calculations involving large numbers \u2014 like milliseconds, factorials, or population counts \u2014 causing silent <strong>integer overflow</strong> with no error or warning.</p>
      <pre><code>// \u274C Wrong \u2014 int overflows silently!
int millisInYear = 365 * 24 * 60 * 60 * 1000;
System.out.println(millisInYear); // 1471228928 \u{1F631} WRONG!

// \u2705 Correct \u2014 use long for large values
long millisInYear = 365L * 24 * 60 * 60 * 1000;
System.out.println(millisInYear); // 31536000000 \u2705</code></pre>

      <h3>9. Not Overriding equals() and hashCode() Together</h3>
      <p>When you store custom objects in a <code>HashMap</code> or <code>HashSet</code>, Java uses <code>equals()</code> and <code>hashCode()</code> to find them. If you override one but not the other, your collection will silently behave incorrectly \u2014 objects you stored will mysteriously "disappear".</p>
      <pre><code>// \u274C Wrong \u2014 overrides equals but not hashCode
public class Student {
    int rollNo;
    @Override
    public boolean equals(Object o) {
        return ((Student) o).rollNo == this.rollNo;
    }
    // Missing hashCode! HashMap will break \u{1F631}
}

// \u2705 Correct \u2014 always override BOTH together
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Student)) return false;
    return this.rollNo == ((Student) o).rollNo;
}

@Override
public int hashCode() {
    return Objects.hash(rollNo); // \u2705 Consistent with equals
}</code></pre>

      <h3>10. Writing God Classes (Violating Single Responsibility)</h3>
      <p>Beginners dump everything into one giant class \u2014 database logic, UI logic, business logic, file handling. This violates the <strong>Single Responsibility Principle (SRP)</strong>: a class should have one reason to change. God classes become impossible to test, debug, or extend.</p>
      <pre><code>// \u274C Wrong \u2014 one class does EVERYTHING
public class StudentApp {
    void connectDatabase() { /* DB logic */ }
    void validateInput()   { /* Validation */ }
    void saveToDatabase()  { /* Save */ }
    void sendEmail()       { /* Email */ }
    void renderUI()        { /* Display */ }
    // 500 more lines... \u{1F631}
}

// \u2705 Correct \u2014 each class has ONE job
public class DatabaseService  { void connect() { } }
public class StudentValidator  { boolean validate(Student s) { } }
public class StudentRepository { void save(Student s) { } }
public class EmailService      { void send(String to) { } }</code></pre>

      <h3>Bonus: Use Enhanced for Loop Instead of Index Loop</h3>
      <p>When you don't need the index, avoid the verbose <code>for (int i = 0; i < list.size(); i++)</code> pattern. The enhanced for-each loop is cleaner, less error-prone (no off-by-one errors), and expresses intent clearly.</p>
      <pre><code>// \u274C Verbose \u2014 index not even needed here
List&lt;String&gt; names = List.of("Alice", "Bob", "Charlie");
for (int i = 0; i < names.size(); i++) {
    System.out.println(names.get(i));
}

// \u2705 Cleaner \u2014 enhanced for-each
for (String name : names) {
    System.out.println(name);
}

// \u2705 Even cleaner \u2014 Java 8 forEach + lambda
names.forEach(System.out::println);</code></pre>

      <h2>Write Java the Way Professionals Write It</h2>
      <p>These mistakes are not random \u2014 they are the exact patterns that show up in code reviews at every company. Fixing them now means fewer bugs, faster performance, and code that your team will actually respect. Java rewards discipline. Start writing it that way.</p>
      <p>To master Java from the ground up \u2014 including all 10 of these patterns taught in depth with live coding \u2014 start with <a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea0">Lesson 1: Welcome to Java</a> on the free <a href="/courses/ultimate-java-masterclass">Ultimate Java Masterclass</a>. When you are confident with the basics, study OOP encapsulation in <a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea2">Lesson 3: Variables &amp; Data Types</a> and control flow (including the enhanced for-each loop) in <a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea4">Lesson 5: Control Flow</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Which is the most critical Java mistake to fix first?</strong><br/>
      Using <code>==</code> to compare Strings. It causes bugs that are invisible at compile time and extremely confusing at runtime. Every Java developer must know that String equality requires <code>.equals()</code> \u2014 learn this on day one.</p>

      <p><strong>Q2: Do these mistakes apply to modern Java (17, 21, 22)?</strong><br/>
      Yes. While modern Java has added records, sealed classes, and pattern matching, the fundamental OOP and exception-handling mistakes in this list apply to all Java versions. String comparison with <code>==</code>, NPE handling, and resource leaks are language-level concerns that transcend version updates.</p>

      <p><strong>Q3: How can I practice avoiding these mistakes?</strong><br/>
      Code review is the best teacher. After writing any Java code, go through this list as a checklist. Better yet, set up SonarQube or IntelliJ's inspection warnings \u2014 they flag most of these mistakes automatically. And enroll in the <a href="/courses/ultimate-java-masterclass">Ultimate Java Masterclass</a> for structured, mentor-level guidance.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-23T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 23, 2026",
    readTime: "12 min read",
    wordCount: 1050,
    category: "Java",
    tags: ["Java", "Java Tips", "Beginner Java", "Clean Code", "OOP", "Java Interview", "Java Mistakes", "Programming"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Java code on a laptop screen with a dark editor theme showing OOP concepts",
    canonicalUrl: "https://www.skillvalix.com/blog/java-beginner-mistakes-to-avoid",
    relatedCourse: {
      title: "The Ultimate Java Masterclass: From Beginner to Advanced",
      slug: "ultimate-java-masterclass",
      description: "Master Java from scratch \u2014 variables, OOP, collections, multithreading, JDBC and more. Zero to job-ready."
    }
  },
  {
    id: "why-learn-ai-machine-learning-2026",
    title: "Why 2026 is the Best Year to Learn AI & Machine Learning",
    metaTitle: "Why Learn AI & Machine Learning in 2026 | SkillValix Blog",
    metaDescription: "Artificial Intelligence is no longer just a buzzword\u2014it is the driving force behind modern software. Discover why every developer must learn AI and Machine Learning in 2026.",
    keywords: [
      "Learn AI",
      "Machine Learning for Beginners",
      "Artificial Intelligence 2026",
      "Python for AI",
      "AI career",
      "Machine learning tutorial",
      "AI course online"
    ],
    excerpt: "From ChatGPT to self-driving cars, AI is reshaping the world. Find out why 2026 is the ultimate year to start your Artificial Intelligence and Machine Learning journey.",
    content: `
      <h2>The AI Revolution is No Longer Future \u2014 It Is Now</h2>
      <p>A few years ago, Artificial Intelligence was a specialised niche reserved for PhDs and research labs. Today, it is baked into every product you use \u2014 from the search results you see, to the emails your inbox filters, to the code your IDE auto-completes. AI is not coming. It is here. The only question left is: are you on the building side or the using side?</p>
      <p>This guide explains exactly why 2026 is the most important year yet to learn AI and Machine Learning, what skills you need, and how to learn them in the most efficient way possible \u2014 for free.</p>

      <h2>Why 2026 is the Year That Matters</h2>

      <h3>1. The AI Talent Supply Crisis</h3>
      <p>LinkedIn's 2026 Emerging Jobs Report ranks AI/ML Engineering as the #1 fastest-growing technical role globally. The demand has grown 74% year-over-year, but the supply of qualified developers has grown at only 22%. This gap means that developers who can work with AI models \u2014 training, fine-tuning, deploying, and integrating them \u2014 command salaries 40-60% above equivalent software engineering roles.</p>
      <p>In India specifically, tier-1 tech companies are actively hiring for roles that combine Python programming skills with machine learning expertise. If you can demonstrate both, you are in the top 5% of applicants for these positions.</p>

      <h3>2. Generative AI Has Changed What "AI Skills" Means</h3>
      <p>Before 2023, "AI skills" meant researching novel architectures and publishing papers. In 2026, it means being able to:</p>
      <ul>
        <li>Integrate LLM APIs (OpenAI, Anthropic, Google Gemini) into web and mobile applications</li>
        <li>Fine-tune pre-trained models on specific datasets</li>
        <li>Build RAG (Retrieval-Augmented Generation) systems that combine databases with language models</li>
        <li>Understand model evaluation, bias detection, and responsible AI deployment</li>
        <li>Use AI-powered developer tools (GitHub Copilot, Cursor) to 3x your own coding speed</li>
      </ul>
      <p>These are practical, job-applicable skills \u2014 not academic research. And they are learnable in weeks, not years.</p>

      <h3>3. Python Has Made AI Accessible to Every Developer</h3>
      <p>The Python ecosystem has made machine learning radically accessible. You can train your first classification model in 15 lines of Scikit-Learn. You can build a neural network in 30 lines of PyTorch. The mathematical complexity still exists \u2014 but libraries abstract it into clean, readable functions that any developer with Python basics can use.</p>
      <p>Start with <a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e01">Lesson 1 of the Python Masterclass</a> to build your foundation, then move to AI. You can learn the core Python you need for machine learning in under 4 weeks.</p>

      <h2>The AI Learning Roadmap for 2026</h2>
      <p>Here is the exact sequence to go from zero to AI-ready:</p>

      <h3>Stage 1: Python Fundamentals (Weeks 1\u20133)</h3>
      <p>Every AI library is Python-first. Before touching TensorFlow or PyTorch, you need solid Python \u2014 variables, functions, loops, list comprehensions, classes, and file I/O. Our free <a href="/courses/ultimate-python-masterclass">Python Masterclass</a> covers all of this. Key lessons to focus on:</p>
      <ul>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e02">Variables &amp; Data Types</a> \u2014 NumPy arrays are just enhanced Python lists</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e05">Functions: Reusable Code Blocks</a> \u2014 all ML pipelines are built on functions</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e04">Loops: for &amp; while</a> \u2014 training loops are literally just loops over data batches</li>
      </ul>

      <h3>Stage 2: AI & Machine Learning Fundamentals (Weeks 4\u20138)</h3>
      <p>Once you have Python, start with the conceptual foundations of AI. You need to understand what a model is, how training works, what loss functions do, and why gradient descent is the core algorithm behind almost all modern AI. Our free <a href="/courses/basics-of-artificial-intelligence-beginners">AI &amp; Machine Learning Fundamentals course</a> covers this ground-up:</p>
      <ul>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666201">Lesson 1: What is Artificial Intelligence?</a> \u2014 the taxonomy of AI, ML, and Deep Learning</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666204">Lesson 4: What is Machine Learning?</a> \u2014 supervised vs unsupervised vs reinforcement learning</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666205">Lesson 5: Neural Networks &amp; Deep Learning</a> \u2014 the architecture powering ChatGPT, image recognition, and more</li>
      </ul>

      <h3>Stage 3: Practical AI Projects (Weeks 9\u201312)</h3>
      <p>Theory without projects is worthless in AI interviews. Build these three projects:</p>
      <ul>
        <li><strong>Sentiment classifier:</strong> Train a model on tweet data to predict positive/negative sentiment using Scikit-Learn's Naive Bayes</li>
        <li><strong>Image classifier:</strong> Use a pre-trained ResNet model (transfer learning) to classify your own image dataset with PyTorch</li>
        <li><strong>LLM-powered chatbot:</strong> Build a simple RAG chatbot using OpenAI's API and a vector database like ChromaDB</li>
      </ul>
      <p>All three are portfolio-worthy. Host them on GitHub with detailed README files and they become your AI credentials \u2014 more valuable than most certificates.</p>

      <h2>AI Career Paths in 2026</h2>
      <p>Contrary to popular belief, "AI developer" is not one job. Here are the distinct career tracks and what each requires:</p>
      <ul>
        <li><strong>ML Engineer:</strong> Trains, evaluates, and deploys ML models at scale. Needs Python, statistics, and cloud platforms (AWS SageMaker, GCP Vertex). High demand, highest salaries.</li>
        <li><strong>AI Application Developer:</strong> Integrates LLM APIs and builds AI-powered products. Needs Python or JavaScript + API integration skills. Fastest-growing segment in 2026.</li>
        <li><strong>Data Scientist:</strong> Analyses data and builds predictive models. Needs Python, pandas, SQL, statistics, and business insight. Large overlap with ML engineering.</li>
        <li><strong>Prompt Engineer:</strong> Designs and optimises prompts for LLMs. Lower barriers to entry, but competitive. Best as a complementary skill.</li>
      </ul>

      <h2>The One Reason Developers Fail to Learn AI</h2>
      <p>The number one reason developers abandon AI learning is starting with the mathematics. They open a textbook on linear algebra, hit matrix multiplication, panic, and quit. The correct order is the reverse: <strong>start with code, understand concepts, then optionally deepen the math</strong>. Build a working model first. The intuition for why it works will come from watching it train and fail and improve. The math explains the intuition \u2014 it does not precede it.</p>

      <h2>Related Resources on SkillValix</h2>
      <p>AI builds on a solid programming foundation. If you are not yet comfortable with Python, start with <a href="/blog/python-beginner-mistakes-to-avoid">our Python mistakes guide</a> to build correct habits from day one. And for a look at the AI tools that working developers use daily, read our <a href="/blog/ai-tools-every-developer-should-use-2026">10 AI Tools Every Developer Must Use in 2026</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Do I need to know math to learn AI?</strong><br/>
      Not initially. The libraries handle the math. You will be far more effective if you understand concepts like gradient descent, loss functions, and regularisation intuitively \u2014 but you do not need to derive them from scratch. Build first. Math second.</p>

      <p><strong>Q2: How long does it take to learn Machine Learning?</strong><br/>
      With consistent daily study (2 hours/day), you can build your first working ML project in 4\u20136 weeks. To reach a job-ready level for an ML Engineer position at a tech company, expect 4\u20138 months of focused learning and project building. Speed varies enormously based on prior programming experience.</p>

      <p><strong>Q3: Should I start with TensorFlow or PyTorch?</strong><br/>
      Start with Scikit-Learn for classical ML (regression, classification, clustering). Once you are comfortable with model training concepts, move to PyTorch for deep learning \u2014 it has overtaken TensorFlow as the dominant framework in both research and production as of 2025.</p>

      <p><strong>Q4: Is AI going to replace programmers?</strong><br/>
      AI is replacing specific tasks, not the role of programmer. In 2026, AI tools write boilerplate, suggest code, find bugs, and generate tests. Programmers who use these tools are dramatically more productive than those who do not. The programmers most at risk are those who do repetitive, low-complexity coding \u2014 exactly the work AI tools handle. Learning AI makes you the developer who builds those tools, not the one replaced by them.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-26T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 26, 2026",
    readTime: "13 min read",
    wordCount: 1480,
    category: "AI & Data Science",
    tags: ["Artificial Intelligence", "Machine Learning", "Python for AI", "Data Science", "AI Career 2026", "Deep Learning", "Technology"],
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Futuristic AI neural network concept with glowing connections",
    canonicalUrl: "https://www.skillvalix.com/blog/why-learn-ai-machine-learning-2026",
    relatedCourse: {
      title: "Artificial Intelligence & Machine Learning Fundamentals",
      slug: "basics-of-artificial-intelligence-beginners",
      description: "Master Python, Machine Learning algorithms, and Neural Networks from scratch."
    }
  },
  {
    id: "top-skills-students-learn-online-free",
    title: "Top Skills Students Can Learn Online (With Free Resources)",
    metaTitle: "Top Skills Students Can Learn Online (With Free Resources) | SkillValix",
    metaDescription: "Discover the most in-demand technical skills students can learn online for free in 2026. From HTML and Python to AI, accelerate your career with SkillValix.",
    keywords: [
      "top skills to learn online",
      "free coding courses",
      "learn HTML online",
      "Python for beginners",
      "Java course free",
      "learn AI online",
      "web development students",
      "free programming resources",
      "SkillValix"
    ],
    excerpt: "Whether you are in high school or college, learning technical skills online has never been easier. Discover the top free skills that will guarantee you a future-proof career.",
    content: `
      <h2>The Best Investment You Can Make as a Student</h2>
      <p>The modern job market does not care about your age; it cares about what you can build. With the rise of accessible online platforms, students anywhere in the world can now master industry-standard technical skills for absolutely free. The question is no longer "can I afford to learn?" \u2014 it is "what should I learn first?"</p>
      <p>This guide gives you the answer. Here are the five highest-ROI technical skills for students in 2026, in the order you should learn them, with specific starting lessons for each.</p>

      <h3>1. HTML &amp; CSS: The Mandatory Foundation</h3>
      <p>Every website on the internet is built on HTML and CSS. HTML provides the structure; CSS provides the styling. These are the non-negotiable entry point into the world of tech. Even if you eventually specialise in backend development, data science, or AI \u2014 knowing how to build and style a frontend gives you a massive advantage in understanding full-stack systems.</p>
      <p><strong>What you will build:</strong> Portfolio pages, landing pages, blog layouts, responsive multi-page websites.</p>
      <p><strong>Time to job-ready basics:</strong> 4\u20136 weeks with daily practice.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d8f">Lesson 1: Welcome to Web Development</a> \u2014 understand how browsers render HTML</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d90">Lesson 2: Your Very First HTML File</a> \u2014 write your first webpage from scratch</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c661">CSS Lesson 1: Welcome to CSS!</a> \u2014 start styling immediately</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c664">CSS Lesson 4: The CSS Box Model</a> \u2014 the layout concept every developer must understand</li>
      </ul>
      <p><strong>Free Courses:</strong> <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> and <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro</a></p>

      <h3>2. JavaScript: From Static to Interactive</h3>
      <p>JavaScript is what turns a static page into a living application. It handles user interactions, fetches data from APIs, validates forms, and powers everything from simple carousels to full-blown single-page applications. In 2026, JavaScript is also the language of Node.js (backend), React (frontend framework), and even React Native (mobile). Mastering it opens four career paths simultaneously.</p>
      <p><strong>What you will build:</strong> Interactive UIs, API-connected apps, form validation, dynamic content rendering.</p>
      <p><strong>Time to job-ready basics:</strong> 6\u20138 weeks after HTML/CSS.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a68">JS Lesson 1: Welcome to JavaScript!</a> \u2014 understand where JS runs and why</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a69">JS Lesson 2: Variables: Storing Data</a> \u2014 <code>let</code>, <code>const</code>, and <code>var</code> explained clearly</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a6c">JS Lesson 5: Conditionals: Making Decisions</a> \u2014 the logic that powers every interactive feature</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a></p>

      <h3>3. Python: The Most Versatile Language</h3>
      <p>Python is the language of data science, machine learning, backend development, automation, and scripting. Its beginner-friendly syntax (English-like, no semicolons, no type declarations) makes it the ideal second language for students who have learned JavaScript, or the ideal first language for those coming from a non-web background.</p>
      <p><strong>What you will build:</strong> Automation scripts, data analysis notebooks, REST APIs with Flask/FastAPI, ML models.</p>
      <p><strong>Time to job-ready basics:</strong> 4\u20136 weeks.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e01">Python Lesson 1: Welcome to Python</a> \u2014 why Python and how to set up your environment</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e03">Python Lesson 3: Control Flow</a> \u2014 conditionals and loops are where Python's readability shines</li>
        <li><a href="/courses/ultimate-python-masterclass/lesson/72c9fd68ed2750d1d53d0e05">Python Lesson 5: Functions</a> \u2014 the building block of every Python program</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass</a></p>

      <h3>4. Java: The Enterprise Standard</h3>
      <p>Java powers Android apps, enterprise banking systems, e-commerce backends, and large-scale distributed systems. It is one of the most consistently in-demand languages at multinational companies in India and globally. Learning Java teaches you Object-Oriented Programming in its most rigorous form \u2014 making you a more disciplined developer in any language.</p>
      <p><strong>What you will build:</strong> Command-line applications, OOP designs, Android app foundations, backend APIs with Spring Boot.</p>
      <p><strong>Time to job-ready basics:</strong> 6\u20138 weeks.</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea0">Java Lesson 1: Welcome to Java</a> \u2014 JVM, compilation, and your first Hello World</li>
        <li><a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea2">Java Lesson 3: Variables &amp; Data Types</a> \u2014 strict typing that builds discipline</li>
        <li><a href="/courses/ultimate-java-masterclass/lesson/78c9fd68ed2750d1d53d0ea4">Java Lesson 5: Control Flow</a> \u2014 if/else, switch, loops in Java</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-java-masterclass">Ultimate Java Masterclass</a></p>

      <h3>5. Artificial Intelligence &amp; Machine Learning</h3>
      <p>AI has crossed the threshold from specialised niche to mainstream requirement. Students who graduate in 2026 and beyond will be entering a workforce where AI literacy is as expected as Excel proficiency was a decade ago. Understanding how models are trained, what neural networks do, and how to integrate AI APIs gives you a permanent edge in any tech role.</p>
      <p><strong>What you will build:</strong> Classification models, image recognisers, LLM-powered chatbots.</p>
      <p><strong>Prerequisite:</strong> Python basics (3\u20134 weeks in).</p>
      <p><strong>Where to start:</strong></p>
      <ul>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666201">AI Lesson 1: What is Artificial Intelligence?</a> \u2014 clear taxonomy of AI, ML, and Deep Learning</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666204">AI Lesson 4: What is Machine Learning?</a> \u2014 how models learn from data</li>
        <li><a href="/courses/basics-of-artificial-intelligence-beginners/lesson/69b8f8094d49fdf216666205">AI Lesson 5: Neural Networks &amp; Deep Learning</a> \u2014 the architecture behind ChatGPT</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/basics-of-artificial-intelligence-beginners">AI &amp; Machine Learning Fundamentals</a></p>

      <h2>The Recommended Learning Order</h2>
      <p>If you are starting from zero, follow this sequence. Each skill builds a foundation for the next:</p>
      <ol>
        <li><strong>HTML</strong> \u2014 structure (Week 1\u20132)</li>
        <li><strong>CSS</strong> \u2014 style (Week 2\u20134)</li>
        <li><strong>JavaScript</strong> \u2014 interactivity (Week 4\u201310)</li>
        <li><strong>Python</strong> \u2014 versatility (Week 10\u201316, can overlap with JS)</li>
        <li><strong>AI/ML</strong> \u2014 intelligence (after Python basics)</li>
        <li><strong>Java</strong> \u2014 enterprise depth (can start parallel to Python)</li>
      </ol>
      <p>You do not need to finish one before starting the next. Once you are comfortable with HTML/CSS basics, you can begin JavaScript. Once Python loops feel natural, you can start the AI course. Progress is cumulative, not sequential.</p>

      <h2>Related Guides</h2>
      <p>Looking for a more structured career plan? Read our complete <a href="/blog/how-to-become-web-developer-2026-roadmap">Web Developer Roadmap for 2026</a>. To understand why certifications matter alongside skills, read <a href="/blog/how-skillvalix-helps-students-become-job-ready">How SkillValix Helps Students Become Job Ready</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Should I learn all 5 skills?</strong><br/>
      Not necessarily \u2014 at least not at the same time. Pick a primary track: Web Development (HTML + CSS + JavaScript), Data Science (Python + AI), or Full-Stack (all). Specialise first, then expand. Trying to learn all five simultaneously leads to superficial understanding of all and mastery of none.</p>

      <p><strong>Q2: Can I get a job knowing only HTML and CSS?</strong><br/>
      It is difficult to get a full-time software engineering role with only HTML and CSS. However, many freelancers, junior web designers, and template developers earn well with these two skills. For software engineering roles, add JavaScript and at least one backend skill (Python with Flask, or Node.js). Our <a href="/blog/freelancing-as-developer-beginners-guide">freelancing guide</a> explains how to monetise basic HTML/CSS skills while learning more.</p>

      <p><strong>Q3: Which is better to learn first \u2014 Python or JavaScript?</strong><br/>
      For web development: JavaScript first. For data science, AI, or scripting: Python first. If you are completely undecided, JavaScript is marginally more versatile for getting hired quickly \u2014 both frontend and backend Node.js roles are available to strong JavaScript developers. But Python has a lower learning curve and is almost universally required for AI/ML roles.</p>

      <h2>Start Free. Start Today.</h2>
      <p>At <a href="/">SkillValix</a>, every course in this list is 100% free. No subscription, no trial, no credit card. All courses end with a verified certificate tied to a unique ID \u2014 something you can link directly on LinkedIn and your resume. The only investment required is your time and consistency.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-27T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 27, 2026",
    readTime: "12 min read",
    wordCount: 1380,
    category: "Career & Industry",
    tags: ["Student Resources", "Career Advice", "Free Courses", "Learn to Code", "Programming", "Technology 2026", "HTML CSS JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Students studying together with laptops",
    canonicalUrl: "https://www.skillvalix.com/blog/top-skills-students-learn-online-free",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass for Beginners",
      slug: "ultimate-html-masterclass",
      description: "Start your journey today from absolute scratch."
    }
  },
  // ── NEW POSTS ────────────────────────────────────────────
  {
    id: "how-to-build-powerful-public-portfolio-2026",
    title: "How to Build a Powerful Public Portfolio to Get Hired in 2026",
    metaTitle: "How to Build a Powerful Public Portfolio to Get Hired (2026) | SkillValix",
    metaDescription: "Learn how to create a job-winning public developer portfolio in 2026. Showcase your certificates, projects, and skills all in one professional URL. Step-by-step guide included.",
    keywords: [
      "developer portfolio template 2026",
      "public portfolio for recruiters",
      "showcase certifications on portfolio",
      "build developer profile free",
      "web developer portfolio India",
      "SkillValix public portfolio",
      "get hired as a developer 2026",
      "portfolio SEO for developers"
    ],
    excerpt: "Your GitHub alone is no longer enough. In 2026, recruiters want a unified professional presence that shows not just your code, but your verifiable skills and certifications. Here is how to build one in 5 minutes.",
    content: `
      <h2>The New Standard: The Unified Professional Profile</h2>
      <p>Gone are the days when you could just send a PDF resume and a GitHub link. In a competitive 2026 job market, hiring managers are looking for <strong>social proof</strong>. They want to see that your skills are verified, your certificates are real, and your projects are accessible\u2014all in one place.</p>

      <h3>1. Why You Need a Public Portfolio URL</h3>
      <p>A personal portfolio URL like <code>skillvalix.com/u/yourname</code> acts as your digital identity. It is SEO-friendly, meaning when a recruiter searches your name on Google, your professional achievements appear first. It aggregates your GitHub, LinkedIn, Resume, and all your SkillValix certifications into a single, high-conversion page.</p>

      <h3>2. Essential Elements of a 2026 Portfolio</h3>
      <ul>
        <li><strong>Verifiable Credentials:</strong> Don't just list skills; show the certificates that prove them. Every course you complete on SkillValix automatically syncs to your public profile.</li>
        <li><strong>Open to Work Status:</strong> Clearly signal to recruiters that you are available for new opportunities with a single toggle.</li>
        <li><strong>Project Showcases:</strong> Link your top GitHub repositories with descriptions that explain the <em>problem you solved</em>, not just the tech you used.</li>
      </ul>

      <h3>3. How to Activate Your Portfolio on SkillValix</h3>
      <p>At SkillValix, we've built the Public Portfolio feature to be entirely automatic. Once you complete your profile details and set a custom username, your portfolio is live for the world to see.</p>
      
      <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-8">
        <h4 class="text-blue-900 font-bold mb-2">\u{1F680} Ready to get started?</h4>
        <p class="text-blue-700 text-sm mb-4">Click the button below to go directly to your Portfolio settings. Fill in your bio, add your social links, and make your profile public today!</p>
        <a href="/dashboard?tab=profile" class="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Set Up My Portfolio Now</a>
      </div>

      <h3>4. SEO Tips for Your Developer Profile</h3>
      <p>To rank higher in Google, ensure your <strong>Bio</strong> contains relevant keywords like "Frontend Developer", "React Specialist", or "Data Analyst". Mention the specific technologies you are passionate about. Search engines love rich, keyword-relevant text content.</p>

      <p>Stop sending scattered links. Start sending a professional legacy. Build your portfolio for free at <a href="https://www.skillvalix.com" target="_blank">SkillValix</a>.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-05T10:00:00+05:30",
    modifiedDate: "2026-04-05T10:00:00+05:30",
    date: "April 05, 2026",
    readTime: "5 min read",
    wordCount: 480,
    category: "Career & Industry",
    tags: ["Portfolio", "Career Development", "Recruitment", "Personal Branding", "Web Development"],
    imageUrl: "https://images.unsplash.com/photo-1547014762-3a94fb4df70a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Professional developer portfolio on a high-resolution monitor",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-build-powerful-public-portfolio-2026",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass for Beginners",
      slug: "ultimate-html-masterclass",
      description: "The foundation for any developer portfolio\u2014master HTML5 and earn a verifiable certificate."
    }
  },
  {
    id: "what-is-skillvalix-complete-guide",
    title: "What is SkillValix? The Complete Guide to Building Your Career in 2026",
    metaTitle: "What is SkillValix? \u2014 Free Career Building Platform | SkillValix",
    metaDescription: "Discover what SkillValix is and how it helps students and professionals build tech careers. Learn about free courses, job simulations, hackathons, and certifications.",
    keywords: [
      "skillvalix",
      "what is skillvalix",
      "skillvalix free courses",
      "skillvalix review",
      "skillvalix certificate",
      "skillvalix hackathon India",
      "skillvalix job simulations",
      "build tech career free"
    ],
    excerpt: "SkillValix is more than just a learning platform\u2014it is a complete career building engine. Discover how you can use SkillValix to learn, build projects, and get hired by world-class companies.",
    content: `
      <h2>What Exactly is SkillValix?</h2>
      <p>In today's fast-paced digital world, the gap between traditional education and industry requirements is wider than ever. Many students graduate with degrees but lack the practical "shipping" skills that top tech companies look for. This disconnect is exactly why <strong>SkillValix</strong> was founded.</p>
      
      <p>Whether you are a college student in India looking for your first internship, a career switcher trying to enter the tech industry, or a developer wanting to prove your skills, <strong>SkillValix</strong> is built for you. Unlike traditional learning platforms that stop at video tutorials, SkillValix focuses on the entire lifecycle of a developer\u2019s journey: <strong>Learn, Build, and Get Hired.</strong></p>

      <h3>A Platform Built for Practical Skills</h3>
      <p>At its core, <strong>SkillValix</strong> is a bridge. It connects the theory of programming with the reality of professional software engineering. By providing high-quality, free education paired with industry-level assessments, SkillValix ensures that every hour you spend on the platform translates into a measurable career advantage. The platform was built on a simple philosophy: <strong>Skills should be verifiable, not just claimed.</strong></p>

      <h2>Key Features of SkillValix</h2>
      <p>To understand why SkillValix is different from other sites like Udemy or Coursera, you need to look at its integrated ecosystem. Here are the five core pillars that make SkillValix a powerhouse for career growth.</p>

      <h3>1. Free, High-Quality Technical Courses</h3>
      <p>Education should not have a price tag that prevents talented individuals from learning. Every masterclass on SkillValix is completely free. From the <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> to <a href="/courses/ultimate-react-masterclass">React.js Mastery</a> and <a href="/courses/basics-of-artificial-intelligence-beginners">AI Fundamentals</a>, our curriculum is designed by industry experts who know what is currently being used in production.</p>

      <h3>2. Real-World Job Simulations (Virtual Internships)</h3>
      <p>The biggest struggle for freshers is the "experience required" loop: you need experience to get a job, but you need a job to get experience. SkillValix breaks this cycle with Job Simulations. These are curated, multi-task simulations that mirror the actual tickets and tasks a junior developer receives in a startup.</p>

      <h3>3. Industry-Level Hackathons</h3>
      <p>Competition breeds excellence. SkillValix hosts and supports some of India\u2019s most exciting online hackathons. These aren't just coding contests; they are opportunities to collaborate with others, network with mentors, and win prizes that look incredible on your resume.</p>

      <h3>4. Verified Certifications</h3>
      <p>A PDF "certificate of completion" is easy to forge. SkillValix Certifications are different. Every certificate issued by SkillValix is tied to a unique ID and a verification link hosted on our platform. When a recruiter clicks that link, they see your exam score and the specific skills you mastered.</p>

      <h3>5. The Public LinkedIn-Style Portfolio</h3>
      <p>Your SkillValix profile automatically aggregates your course progress, your hackathon wins, and your job simulation results into a sleek, public-facing portfolio. Instead of sending 10 different links to recruiters, you send one: your SkillValix profile.</p>

      <h2>Why Choose SkillValix over Other Platforms?</h2>
      <p>With so many resources online, why should you spend your time on SkillValix? Here is our unique value proposition:</p>
      <ul>
        <li><strong>Focus on Portfolio Building:</strong> We track your "Building Ability," which is a far better predictor of job success than just "Learning Time."</li>
        <li><strong>No Gatekeeping (Free Access):</strong> We believe that talent is universal, but opportunity is not. We keep our core courses free for everyone.</li>
        <li><strong>Verified Credibility:</strong> Because our exams and simulations are rigorous, a SkillValix credential means something in the real world.</li>
      </ul>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <p><strong>Q1: Is SkillValix really free?</strong><br/>
      Yes! All core technical masterclasses, project guides, and community hackathons on SkillValix are 100% free. Our mission is to make high-quality tech education accessible to every student.</p>

      <p><strong>Q2: Can I get a job through SkillValix?</strong><br/>
      While SkillValix is a skill-building platform, many students use their SkillValix portfolios and verified certificates to stand out in interviews. We also host hiring hackathons where startups directly recruit winners.</p>

      <p><strong>Q3: How do the SkillValix Job Simulations work?</strong><br/>
      They provide you with a series of tasks that a developer would do in a real company. You receive a brief, write the code, and submit your work. It\u2019s designed to give you virtual experience for your resume.</p>

      <p>Your tech career in 2026 waits for no one. Stop just "learning" and start <strong>validating</strong>. Build your portfolio, earn your credentials, and show the world what you are capable of at <a href="https://www.skillvalix.com" target="_blank">SkillValix.com</a>.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-05T11:00:00+05:30",
    modifiedDate: "2026-04-05T11:00:00+05:30",
    date: "April 05, 2026",
    readTime: "7 min read",
    wordCount: 880,
    category: "Career & Industry",
    tags: ["SkillValix", "Career Development", "Free Courses", "Education", "Personal Branding"],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Young professionals collaborating in a modern tech environment",
    canonicalUrl: "https://www.skillvalix.com/blog/what-is-skillvalix-complete-guide",
    relatedCourse: {
      title: "Ultimate HTML Masterclass",
      slug: "ultimate-html-masterclass",
      description: "The best way to start your journey on SkillValix\u2014master the core of the web for free."
    }
  },
  {
    id: "how-skillvalix-helps-students-become-job-ready",
    title: "How SkillValix Helps Students Become Job Ready: 7 Key SkillValix Benefits",
    metaTitle: "How SkillValix Helps Students Become Job Ready | SkillValix Benefits",
    metaDescription: "Discover the top SkillValix benefits for students and freshers. Learn how our free courses, job simulations, and verified portfolios make you job-ready in 2026.",
    keywords: [
      "skillvalix benefits",
      "how to become job ready as a student",
      "skillvalix for engineering students India",
      "virtual internship for freshers",
      "build a developer portfolio free",
      "skillvalix certified developer",
      "career growth with skillvalix",
      "free technical certifications India"
    ],
    excerpt: "Is your college degree enough to land a tech job in 2026? Probably not. Discover the major SkillValix benefits that help you bridge the gap between being a student and becoming a professional developer.",
    content: `
      <h2>The Gap Between College and Careers</h2>
      <p>The tech industry in 2026 moves faster than any university curriculum can keep up with. Every year, thousands of engineering students graduate in India with high grades but struggle to land their first job. Why? Because they are "educated" in theory but not "ready" for production environments.</p>
      
      <p>This is where <strong>SkillValix</strong> comes in. Our platform is specifically designed to solve the "lack of experience" problem. By focusing on practical application over rote memorization, we offer several <strong>SkillValix benefits</strong> that traditional education simply cannot provide.</p>

      <h3>Why Traditional Degrees Aren't Enough</h3>
      <p>A degree proves you can learn; a portfolio proves you can build. Most recruiters now skip past the "Education" section and head straight for the "Projects" and "Certifications" links. If you don't have proof of work, you are invisible to top-tier startups and MNCs.</p>

      <h2>7 Major SkillValix Benefits for Students</h2>
      <p>If you are looking to accelerate your career, here is how <strong>SkillValix</strong> transforms your professional outlook.</p>

      <h3>1. Gaining "Building Experience" through Simulations</h3>
      <p>One of the top <strong>SkillValix benefits</strong> is our unique Job Simulations. These aren't just tutorials; they are virtual internships. You receive a realistic project brief, complete with bugs to fix and features to ship. This gives you the confidence to say "I have done this before" during an interview.</p>

      <h3>2. Mastering Industry-Standard Tools</h3>
      <p>We don't teach outdated technologies. SkillValix courses focus on the stacks currently used by the world's best engineering teams\u2014React, Node.js, MongoDB, Python, and AI. You learn the tools that are actually in demand on job boards today.</p>

      <h3>3. Earning High-Trust Verified Certifications</h3>
      <p>Most free certificates are worth nothing because they don't require an exam. SkillValix certifications require you to pass a rigorous assessment. Every certificate comes with a unique verification link that recruiters can check instantly. This adds massive credibility to your CV.</p>

      <h3>4. Creating a Public-Facing Professional Portfolio</h3>
      <p>Your SkillValix profile is your resume, portfolio, and credit score all in one. It automatically displays your course progress, your hackathon wins, and your simulation tasks in a sleek, public-facing format that you can share on LinkedIn.</p>

      <h3>5. Networking via Nationwide Hackathons</h3>
      <p>SkillValix hosts and manages some of the most competitive online hackathons in India. Participating in these events allows you to meet other ambitious developers, connect with mentors, and get noticed by corporate sponsors looking for fresh talent.</p>

      <h3>6. Learning to Debug and Ship Production Code</h3>
      <p>In college, you write code that only you see. In <strong>SkillValix</strong> simulations, you learn to write clean, documented, and production-ready code. You learn how to use GitHub, how to write README files, and how to deploy your applications to the web.</p>

      <h3>7. No-Cost Access to Premium Technical Knowledge</h3>
      <p>High-quality tech education should not be locked behind a paywall. One of the most significant <strong>SkillValix benefits</strong> is that our core masterclasses are 100% free. This ensures that every student, regardless of their financial background, has a fair shot at a tech career.</p>

      <h2>How to Use SkillValix to Get Your First Internship</h2>
      <p>If you want to maximize your chances of getting hired, follow this simple blueprint:</p>
      <ul>
        <li><strong>Pick a Track:</strong> Choose a specific path like Frontend, Backend, or Data Analyst.</li>
        <li><strong>Complete the Masterclass:</strong> Go through the lessons and build every project alongside the instructor.</li>
        <li><strong>Pass the Exam:</strong> Get your verified certificate and add it to your LinkedIn profile.</li>
        <li><strong>Run a Simulation:</strong> Complete the Job Simulation for your track to gain "virtual experience."</li>
        <li><strong>Optimize Your Portfolio:</strong> Add a professional bio to your SkillValix profile and share your public link in job applications.</li>
      </ul>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <p><strong>Q1: What are the main SkillValix benefits for freshers?</strong><br/>
      The main benefits include free access to industry-level courses, the ability to earn verified certifications that recruiters trust, and a platform to build a professional public portfolio that proves your skills.</p>

      <p><strong>Q2: How do SkillValix certifications help in job interviews?</strong><br/>
      Because SkillValix certificates are verifiable and tied to real assessments, they prove to the interviewer that you actually have the skills listed on your resume. You can simply share your verification link, and they can see your proof of work.</p>

      <p><strong>Q3: Is SkillValix available for students outside India?</strong><br/>
      Yes! While we have a strong focus on the Indian developer community, <strong>SkillValix</strong> is available to students and professionals worldwide. Anyone wanting to build a career in tech can join for free.</p>

      <p>Ready to unlock these <strong>SkillValix benefits</strong>? Your professional legacy starts here. Join thousands of other students who are building their future today at <a href="https://www.skillvalix.com" target="_blank">SkillValix.com</a>.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-05T11:30:00+05:30",
    modifiedDate: "2026-04-05T11:30:00+05:30",
    date: "April 05, 2026",
    readTime: "8 min read",
    wordCount: 920,
    category: "Career & Industry",
    tags: ["SkillValix Benefits", "Job Ready", "Student Career", "Engineering Students India", "Career Advice"],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Engineering students in India collaborating on a tech project",
    canonicalUrl: "https://www.skillvalix.com/blog/how-skillvalix-helps-students-become-job-ready",
    relatedCourse: {
      title: "Ultimate React Masterclass",
      slug: "ultimate-react-masterclass",
      description: "The fastest way to become job-ready \u2014 master modern React and earn a verified certificate."
    }
  },
  {
    id: "how-to-become-web-developer-2026-roadmap",
    title: "How to Become a Web Developer in 2026: The Complete Free Roadmap",
    metaTitle: "How to Become a Web Developer in 2026 \u2014 Free Roadmap | SkillValix",
    metaDescription: "The definitive step-by-step roadmap to becoming a web developer in 2026 \u2014 completely free. Learn HTML, CSS, JavaScript, React, Node.js and beyond with no money and no experience needed.",
    keywords: [
      "how to become a web developer 2026",
      "web developer roadmap free",
      "learn web development from scratch",
      "web development beginner guide",
      "frontend developer career path",
      "free web development course 2026",
      "become a developer without a degree",
      "learn to code free India",
      "full stack developer roadmap 2026"
    ],
    excerpt: "Becoming a web developer in 2026 has never been more achievable. Here is the exact free roadmap \u2014 from HTML to your first job \u2014 with no degree, no bootcamp fees, and no guesswork.",
    content: `
      <h2>The Myth: You Need a CS Degree or an Expensive Bootcamp</h2>
      <p>The single biggest barrier stopping people from becoming developers is the belief that you need a CS degree or a \u20B91,50,000 bootcamp. In 2026, that barrier does not exist. Every skill you need is available online \u2014 for free \u2014 in a structured, progressive format. This roadmap shows you exactly what to learn, in what order, and where to start each step.</p>
      <p>We estimate it takes <strong>4\u20136 months of consistent learning (1\u20132 hours/day)</strong> to go from zero to junior developer ready. Let's break it down.</p>

      <h2>Step 1: HTML \u2014 The Structure of the Web (Weeks 1\u20132)</h2>
      <p>Every website on the internet starts with HTML (HyperText Markup Language). HTML defines the structure of a page \u2014 what is a heading, what is a paragraph, what is a navigation menu. Before CSS, before JavaScript, before any framework \u2014 HTML.</p>
      <p><strong>What to learn:</strong> Document structure (<code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>), semantic tags (<code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;nav&gt;</code>), headings, paragraphs, links, images, lists, tables, and forms.</p>
      <p><strong>Specific lessons to start with:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d8f">Lesson 1: Welcome to Web Development</a> \u2014 understand how the browser renders HTML before writing a single line</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d90">Lesson 2: Your Very First HTML File</a> \u2014 set up VS Code and write your first real page</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d91">Lesson 3: Headings and Paragraphs</a> \u2014 the building blocks of all text content</li>
        <li><a href="/courses/ultimate-html-masterclass/lesson/69b8ec57dc1649c0c42c9d93">Lesson 5: Links: Connecting the Web</a> \u2014 every website relies on anchor tags</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> \u2014 free, structured, ends with a verifiable certificate.</p>

      <h2>Step 2: CSS \u2014 Making It Look Good (Weeks 2\u20134)</h2>
      <p>CSS (Cascading Style Sheets) is what transforms a plain HTML document into a beautiful, responsive design. CSS controls colours, fonts, spacing, layouts, and animations. The most important layout concepts you need to master are the Box Model, Flexbox, and CSS Grid.</p>
      <p><strong>What to learn:</strong> Selectors, specificity, the Box Model, Flexbox, CSS Grid, responsive design with media queries, CSS variables, and transitions.</p>
      <p><strong>Specific lessons to start with:</strong></p>
      <ul>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c661">CSS Lesson 1: Welcome to CSS!</a> \u2014 how CSS connects to HTML with the three linking methods</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c662">CSS Lesson 2: Selectors \u2014 Targeting Elements Precisely</a> \u2014 class, ID, attribute, and pseudo-class selectors</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c664">CSS Lesson 4: The CSS Box Model</a> \u2014 every layout problem traces back to this</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c665">CSS Lesson 5: Colors, Backgrounds &amp; Gradients</a> \u2014 make your designs visually compelling</li>
      </ul>
      <p>Once you finish the CSS course, read our <a href="/blog/css-grid-vs-flexbox-modern-web">CSS Grid vs Flexbox deep dive</a> and our <a href="/blog/css-animations-micro-interactions-guide">CSS micro animations guide</a> \u2014 two skills that immediately set you apart from other entry-level developers.</p>
      <p><strong>Free Course:</strong> <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro</a></p>

      <h2>Step 3: JavaScript \u2014 The Engine of the Web (Weeks 4\u201310)</h2>
      <p>JavaScript is the only programming language that runs natively in every web browser. It is what turns a static page into an interactive application. Variables, functions, loops, DOM manipulation, arrays, objects, fetch APIs, async/await \u2014 these are the concepts that separate a web beginner from a working developer.</p>
      <p><strong>What to learn:</strong> Variables (<code>let</code>/<code>const</code>), data types, conditionals, loops, functions, arrays, objects, DOM manipulation, events, fetch API, Promises, and async/await.</p>
      <p><strong>Specific lessons to start with:</strong></p>
      <ul>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a68">JS Lesson 1: Welcome to JavaScript!</a> \u2014 how JS runs in the browser and how to use the console</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a69">JS Lesson 2: Variables \u2014 Storing Data</a> \u2014 the difference between <code>let</code>, <code>const</code>, and <code>var</code></li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a6a">JS Lesson 3: Data Types</a> \u2014 strings, numbers, booleans, null, undefined, objects</li>
        <li><a href="/courses/ultimate-javascript-masterclass/lesson/69b8f8094d49fdf216666a6c">JS Lesson 5: Conditionals \u2014 Making Decisions</a> \u2014 the core of every interactive feature</li>
      </ul>
      <p>After the fundamentals, make sure to read our <a href="/blog/javascript-dom-manipulation-secrets">JavaScript DOM Manipulation guide</a> \u2014 it covers the advanced DOM patterns used in production that the course introduces.</p>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a></p>

      <h2>Step 4: Build 3 Real Projects (Weeks 11\u201314)</h2>
      <p>No recruiter cares what you studied. They care what you built. After completing the three courses above, build these three projects and publish them to GitHub:</p>
      <ol>
        <li><strong>Personal Portfolio Website</strong> \u2014 HTML + CSS only. Showcase your name, skills, projects, and a contact form. This is the first link in your job applications.</li>
        <li><strong>Weather App</strong> \u2014 HTML + CSS + JavaScript + a public API (OpenWeatherMap is free). Fetches live weather data based on a city name and displays it. Demonstrates DOM manipulation and async/fetch.</li>
        <li><strong>Task Manager App</strong> \u2014 HTML + CSS + JavaScript + localStorage. A full CRUD app (Create, Read, Update, Delete) with data persistence. Demonstrates state management at the DOM level.</li>
      </ol>
      <p>Each project needs: a GitHub repository with a clear README, a live demo link (deploy free on Vercel or GitHub Pages), and a brief description of what problem it solves and what technologies it uses.</p>

      <h2>Step 5: Learn React (Weeks 14\u201320)</h2>
      <p>Once you are solid on vanilla JavaScript, add React \u2014 the most popular frontend framework in the world, used by Meta, Netflix, Airbnb, and thousands of startups. React lets you build complex UIs from reusable components, manages application state, and is the industry standard for frontend engineering roles.</p>
      <ul>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b910">React Lesson 1: React Ecosystem and Modern Tooling</a> \u2014 Vite, npm, and the modern React setup</li>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b911">React Lesson 2: JSX Syntax in Depth</a> \u2014 writing HTML inside JavaScript</li>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b913">React Lesson 4: Props, State, and Data Flow</a> \u2014 the core mental model of React</li>
        <li><a href="/courses/ultimate-react-masterclass/lesson/7ac1f8b20d4f9a3e61c2b914">React Lesson 5: Event Handling and Controlled Forms</a> \u2014 real-world forms that actually work</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/ultimate-react-masterclass">Ultimate React Masterclass</a></p>

      <h2>Step 6: Add a Backend with Node.js (Weeks 20\u201326, Optional for Frontend Roles)</h2>
      <p>Full-stack developers build both the frontend (React) and the backend (the server, database, and API). Node.js with Express is the most beginner-friendly backend technology \u2014 it uses JavaScript, the same language you already know.</p>
      <ul>
        <li><a href="/courses/nodejs-express-api-development/lesson/7ac1f8b20d4f9a3e61c2ba10">Node.js Lesson 1: Architecture and Event Loop</a> \u2014 why non-blocking I/O is a superpower</li>
        <li><a href="/courses/nodejs-express-api-development/lesson/7ac1f8b20d4f9a3e61c2ba12">Node.js Lesson 3: REST API Design Principles</a> \u2014 build a real API from scratch</li>
        <li><a href="/courses/nodejs-express-api-development/lesson/7ac1f8b20d4f9a3e61c2ba14">Node.js Lesson 5: Authentication with JWT</a> \u2014 add user login to your applications</li>
      </ul>
      <p><strong>Free Course:</strong> <a href="/courses/nodejs-express-api-development">Node.js &amp; Express API Development</a></p>

      <h2>Step 7: Get Certified and Apply</h2>
      <p>After completing each SkillValix course, take the certification exam to earn a verifiable certificate. A verifiable certificate is fundamentally different from a "completion badge" \u2014 it proves you passed a real assessment. The certificate links directly to your score and skills on your SkillValix public profile. Add every certificate to your LinkedIn profile and link your profile URL in every job application.</p>
      <p>Read our guide on <a href="/blog/how-to-build-powerful-public-portfolio-2026">how to build a powerful developer portfolio</a> so your profile is optimised for recruiter discovery.</p>

      <h2>The Realistic Timeline</h2>
      <ul>
        <li><strong>Month 1:</strong> HTML + CSS basics. Can build simple static websites.</li>
        <li><strong>Month 2:</strong> CSS advanced (Flexbox, Grid, animations) + JavaScript basics (variables, loops, functions).</li>
        <li><strong>Month 3:</strong> JavaScript DOM manipulation. Build Weather App + Portfolio site.</li>
        <li><strong>Month 4:</strong> JavaScript advanced (async, fetch, Promises). Build Task Manager. Start React.</li>
        <li><strong>Month 5:</strong> React components, state, hooks. Build one React project (e.g. a movie search app using TMDB API).</li>
        <li><strong>Month 6:</strong> Polish portfolio, apply for junior frontend roles, do SkillValix job simulations.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Can I become a web developer without any prior programming experience?</strong><br/>
      Yes, completely. HTML and CSS are among the most beginner-friendly technologies ever created. Most developers started with zero experience. The key is consistency \u2014 even 1 hour every day compounds significantly over 6 months.</p>

      <p><strong>Q2: Do I need to learn backend development to get a job?</strong><br/>
      No. Frontend-only roles (HTML + CSS + JavaScript + React) are extremely common at startups, agencies, and product companies. Full-stack roles command higher salaries but require more learning time. Start with frontend, get hired, then add backend knowledge on the job.</p>

      <p><strong>Q3: How important are certifications vs projects for getting hired?</strong><br/>
      Both matter, for different reasons. Projects prove you can build \u2014 they are the most important hiring signal. Certifications from verified assessments (like SkillValix) prove the projects are not flukes \u2014 they show you passed a rigorous test. The winning combination is strong projects + verified certificates + an optimised portfolio URL.</p>

      <p><strong>Q4: What is the best first project to build?</strong><br/>
      Your personal portfolio website. It serves double duty: it is a project that demonstrates your HTML/CSS/JS skills, AND it is the live URL you send to every employer. Build it with HTML and CSS only first. Then add JavaScript animations and interactivity as you learn. Then eventually rebuild it in React. It grows with you as your skills grow.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-28T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 28, 2026",
    readTime: "14 min read",
    wordCount: 1620,
    category: "Career & Industry",
    tags: ["Web Development", "Career Roadmap", "Beginners", "Frontend Developer", "Full Stack", "Free Courses", "Learn to Code 2026"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer working on laptop with HTML CSS JavaScript code on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-become-web-developer-2026-roadmap",
    relatedCourse: {
      title: "Ultimate HTML Masterclass",
      slug: "ultimate-html-masterclass",
      description: "Your first step on the roadmap \u2014 master HTML5 from scratch with a free verifiable certificate."
    }
  },
  {
    id: "css-animations-micro-interactions-guide",
    title: "CSS Micro Animations & Micro-Interactions: The Complete Guide to Making Your Website Feel Alive (2026)",
    metaTitle: "CSS Micro Animations & Micro-Interactions: Complete Guide 2026 | SkillValix",
    metaDescription: "Master CSS micro animations and micro-interactions in 2026. Learn transitions, @keyframes, hover effects, scroll animations, and GPU-accelerated techniques with real code examples. Build websites users love.",
    keywords: [
      "CSS micro animations",
      "CSS micro-interactions",
      "CSS animations tutorial 2026",
      "CSS transitions guide",
      "keyframes animation CSS",
      "CSS hover effects",
      "web animation best practices",
      "UI animation CSS examples",
      "CSS animation performance",
      "button hover animation CSS",
      "card hover effect CSS",
      "CSS loading animation",
      "scroll animation CSS",
      "pure CSS animation no JavaScript"
    ],
    excerpt: "CSS micro animations are the secret weapon of elite UX designers. A button that lifts on hover, a card that glows on focus, a loader that pulses \u2014 these tiny moments transform a website from functional to unforgettable. Here is the complete 2026 guide to building them with pure CSS.",
    content: `
      <h2>What Are CSS Micro Animations? (And Why They Matter)</h2>
      <p>A <strong>CSS micro animation</strong> is a small, purposeful motion that responds to a user action. It is not a flashy banner or a full-page transition. It is a button that shifts 2px upward when hovered. It is a checkbox that scales with a satisfying pop when checked. It is a navigation link whose underline slides in from the left.</p>
      <p>These micro animations serve a critical UX purpose: they provide <strong>feedback</strong>. They tell the user "yes, your action was registered" without a single line of copy. Research from the Nielsen Norman Group consistently shows that interfaces with purposeful micro-interactions feel more trustworthy and easier to use.</p>
      <p>The best news? In 2026, you need <strong>zero JavaScript</strong> for 90% of these effects. Pure CSS is faster, simpler, and more accessible.</p>

      <h2>The Foundation: CSS transitions</h2>
      <p>The <code>transition</code> property is your most-used tool for CSS micro animations. (Learn more in <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c66e">Lesson 14: CSS Transitions &amp; Animations</a>). It smoothly animates a CSS property from one value to another whenever that property changes \u2014 typically on <code>:hover</code>, <code>:focus</code>, or <code>:active</code>.</p>
      <p>The syntax has four parts:</p>
      <pre><code>transition: [property] [duration] [timing-function] [delay];</code></pre>
      <p>Here is the most useful pattern \u2014 a button micro animation that lifts and deepens its shadow on hover:</p>
      <pre><code>.btn-primary {
  background: #4f46e5;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);

  /* Micro animation: transition multiple properties at once */
  transition:
    background-color 0.25s ease,
    transform       0.2s  ease,
    box-shadow      0.25s ease;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.btn-primary:active {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
}</code></pre>
      <p>Notice the <code>:active</code> state \u2014 when a user clicks, the button snaps back down. This "press" micro animation is a subtle but powerful piece of physical feedback that makes buttons feel tactile.</p>

      <h3>Timing Functions: The Soul of a Micro Animation</h3>
      <p>The timing function (or "easing") controls the acceleration curve of your CSS micro animation. Choosing the wrong one makes animations feel mechanical. Here are the ones that matter:</p>
      <ul>
        <li><strong>ease</strong> (default): Starts slow, speeds up, then slows down. Good for most general micro animations.</li>
        <li><strong>ease-out</strong>: Starts fast, ends slow. Best for elements entering the screen (feels natural, like something sliding into place).</li>
        <li><strong>ease-in</strong>: Starts slow, ends fast. Best for elements leaving the screen.</li>
        <li><strong>cubic-bezier()</strong>: Full custom control. Use <a href="https://cubic-bezier.com" target="_blank" rel="noopener noreferrer">cubic-bezier.com</a> to design your exact curve.</li>
      </ul>
      <pre><code>/* A "bouncy" custom easing \u2014 great for card hover effects */
.card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card:hover {
  transform: translateY(-8px) scale(1.02);
}</code></pre>
      <p>The <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code> value overshoots slightly before settling \u2014 this is called a "spring" easing and it makes micro animations feel alive and physical.</p>

      <h2>Going Deeper: CSS @keyframes Animations</h2>
      <p>While <code>transition</code> animates between two states, <code>@keyframes</code> gives you full narrative control. You define every step of the animation \u2014 and the browser handles the rest.</p>
      <p>Here is the syntax pattern:</p>
      <pre><code>@keyframes animation-name {
  0%   { /* starting state */ }
  50%  { /* mid-point state */ }
  100% { /* ending state */ }
}

.element {
  animation: animation-name [duration] [timing] [delay] [iteration] [direction];
}</code></pre>

      <h3>Practical Example 1: Pulsing Notification Dot</h3>
      <p>This is one of the most common CSS micro animations you see on modern dashboards \u2014 the pulsing red dot on a notification icon:</p>
      <pre><code>@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 1; }
  70%  { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}

.notification-dot {
  position: relative;
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
}

/* The expanding ring effect */
.notification-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse-ring 1.5s ease-out infinite;
}</code></pre>

      <h3>Practical Example 2: Skeleton Loading Animation</h3>
      <p>Skeleton loaders are a fantastic CSS micro animation pattern. Instead of showing a spinner, you show a shimmering placeholder in the exact shape of the content being loaded. This dramatically reduces perceived loading time:</p>
      <pre><code>@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position:  1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #e2e8f0 25%,
    #f1f5f9 50%,
    #e2e8f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.8s infinite linear;
  border-radius: 6px;
}

/* Usage examples */
.skeleton-title  { height: 24px; width: 70%; margin-bottom: 12px; }
.skeleton-text   { height: 14px; width: 100%; margin-bottom: 8px; }
.skeleton-avatar { height: 48px; width: 48px; border-radius: 50%; }</code></pre>

      <h3>Practical Example 3: Slide-In Navigation Underline</h3>
      <p>This CSS micro animation replaces the plain underline on nav links with a smooth sliding effect \u2014 a hallmark of polished navigation design:</p>
      <pre><code>.nav-link {
  position: relative;
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  padding-bottom: 4px;
}

/* The animated underline */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #4f46e5;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.nav-link:hover::after {
  transform: scaleX(1);
}</code></pre>
      <p>The key here is <code>transform-origin: left</code> \u2014 it makes the underline slide <em>from left to right</em>. Change it to <code>right</code> to reverse direction, or <code>center</code> for a expansion-from-center effect.</p>

      <h2>CSS Micro Animations for Cards and Interactive Elements</h2>

      <h3>The Card Lift Effect</h3>
      <p>Card hover effects are among the most searched CSS micro animations. Done correctly, they make a grid of content cards feel interactive and premium:</p>
      <pre><code>.course-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  /* Micro animation setup */
  transition:
    transform   0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow  0.3s ease,
    border-color 0.3s ease;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.15);
  border-color: #c7d2fe;
}</code></pre>

      <h3>Input Focus Micro Animation</h3>
      <p>Form inputs are often overlooked, but a polished focus state micro animation makes your forms feel professional:</p>
      <pre><code>.form-input {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow   0.2s ease,
    transform    0.15s ease;
}

.form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  transform: scale(1.01);
}</code></pre>

      <h2>The Performance Rules of CSS Micro Animations</h2>
      <p>This is where most tutorials fail. Beautiful CSS micro animations that cause jank (stuttering) are worse than no animation at all. Here are the non-negotiable performance rules:</p>

      <h3>Rule 1: Only Animate transform and opacity</h3>
      <p>Modern browsers use the GPU to composite layers for <code>transform</code> and <code>opacity</code>. These properties do not trigger layout recalculation or repaint. Everything else \u2014 <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>, <code>margin</code> \u2014 forces a full layout reflow on every frame, causing 60fps to drop to 15fps.</p>
      <pre><code>/* \u274C DO NOT animate these \u2014 causes layout thrash */
.bad { transition: width 0.3s ease; }
.also-bad { transition: top 0.3s ease, left 0.3s ease; }

/* \u2705 DO animate these \u2014 GPU accelerated */
.good { transition: transform 0.3s ease; }
.also-good { transition: opacity 0.3s ease, transform 0.3s ease; }</code></pre>

      <h3>Rule 2: Use will-change Sparingly</h3>
      <p>The <code>will-change</code> property tells the browser to promote an element to its own GPU layer <em>before</em> the animation starts. This eliminates the initial frame jank:</p>
      <pre><code>.animated-element {
  will-change: transform, opacity;
}

/* \u26A0\uFE0F Important: Remove will-change after animation ends */
/* Never apply it to every element \u2014 it wastes GPU memory */</code></pre>

      <h3>Rule 3: Respect prefers-reduced-motion</h3>
      <p>Approximately 35% of users have vestibular disorders or motion sensitivity. Always wrap your CSS micro animations in a <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c66b">media query</a> that respects the user's system preference:</p>
      <pre><code>/* All your micro animations here... */
.card { transition: transform 0.3s ease; }
.card:hover { transform: translateY(-6px); }

/* Override for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
  .card:hover {
    transform: none;
  }
}</code></pre>
      <p>This is also a Google Lighthouse accessibility criterion. Ignoring it will hurt your SEO score.</p>

      <h2>Scroll-Triggered CSS Micro Animations (No JavaScript)</h2>
      <p>In 2026, CSS has a native way to trigger micro animations based on scroll position using <code>@keyframes</code> combined with <code>animation-timeline: scroll()</code> \u2014 a new feature supported in all modern browsers:</p>
      <pre><code>@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Elements animate in as they enter the viewport */
.animate-on-scroll {
  animation: fade-in-up 0.6s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}</code></pre>
      <p>This is a game-changer. Previously, developers needed Intersection Observer + JavaScript to achieve this. Now it is pure CSS.</p>

      <h2>CSS Micro Animations Cheat Sheet</h2>
      <p>Here is a quick-reference table of the most useful CSS micro animation patterns:</p>
      <ul>
        <li><strong>Button lift:</strong> <code>transform: translateY(-3px)</code> on <code>:hover</code> + box-shadow deepening</li>
        <li><strong>Button press:</strong> <code>transform: translateY(1px) scale(0.98)</code> on <code>:active</code></li>
        <li><strong>Card glow:</strong> <code>box-shadow: 0 0 0 3px rgba(99,102,241,0.3)</code> on <code>:hover</code></li>
        <li><strong>Icon spin:</strong> <code>@keyframes spin { to { transform: rotate(360deg); } }</code></li>
        <li><strong>Fade in:</strong> <code>@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }</code></li>
        <li><strong>Slide up:</strong> <code>@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } }</code></li>
        <li><strong>Underline reveal:</strong> <code>::after</code> with <code>scaleX(0) \u2192 scaleX(1)</code> via <code>transition</code></li>
        <li><strong>Skeleton shimmer:</strong> Animated <code>background-position</code> on a gradient background</li>
      </ul>

      <h2>Putting It All Together: A Real-World Component</h2>
      <p>Here is a complete, production-ready course card component that combines multiple CSS micro animations in harmony \u2014 the kind you see on platforms like SkillValix's <a href="/courses">free courses page</a>:</p>
      <pre><code>.course-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform   0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow  0.3s ease,
    border-color 0.3s ease;
}

.course-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 24px 48px rgba(79, 70, 229, 0.12);
  border-color: #a5b4fc;
}

/* Thumbnail zoom on hover */
.course-card .thumbnail {
  overflow: hidden;
}

.course-card .thumbnail img {
  transition: transform 0.5s ease;
}

.course-card:hover .thumbnail img {
  transform: scale(1.08);
}

/* CTA button reveal on hover */
.course-card .enroll-btn {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.course-card:hover .enroll-btn {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .course-card,
  .course-card .thumbnail img,
  .course-card .enroll-btn {
    transition: none;
    animation: none;
  }
}</code></pre>

      <h2>Where to Learn CSS Animations in Depth</h2>
      <p>If you want to go beyond micro animations and master the full CSS toolkit \u2014 including <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c669">Flexbox</a>, <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro/lesson/69b8f5684036e3809b50c66a">CSS Grid</a>, responsive design, and advanced animations \u2014 the best starting point is our free <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro course</a>. It is completely free, structured, and ends with a verifiable certificate that proves your skills to employers.</p>
      <p>You should also explore our <a href="/blog/css-grid-vs-flexbox-modern-web">CSS Grid vs Flexbox guide</a> to understand how to build the layouts that your CSS micro animations will live inside. And if you want to combine these animations with JavaScript interactivity, our <a href="/blog/javascript-dom-manipulation-secrets">JavaScript DOM manipulation guide</a> shows you exactly how to trigger CSS animations programmatically.</p>

      <h2>Frequently Asked Questions About CSS Micro Animations</h2>

      <p><strong>Q1: What is the difference between a CSS transition and a CSS animation?</strong><br/>
      A <code>transition</code> animates between exactly two states (e.g., default \u2192 hover). A <code>@keyframes</code> animation can have multiple steps, can loop, can auto-play on page load, and gives you much more timing control. For simple hover micro animations, always use <code>transition</code>. For complex, multi-step, or looping animations, use <code>@keyframes</code>.</p>

      <p><strong>Q2: Do CSS micro animations hurt website performance?</strong><br/>
      Only if you animate the wrong properties. Animating <code>transform</code> and <code>opacity</code> is GPU-accelerated and has zero performance cost. Animating <code>width</code>, <code>height</code>, <code>top</code>, or <code>left</code> triggers layout recalculation on every frame and can severely hurt performance, especially on mobile devices.</p>

      <p><strong>Q3: Should I use CSS animations or JavaScript animations?</strong><br/>
      For UI micro animations (hover states, loading indicators, transitions between states), CSS is almost always the better choice. It is parsed directly by the browser, runs off the main thread, and requires no library. Use JavaScript (or libraries like GSAP) only when you need truly complex sequencing, user-controlled scrubbing, or physics-based animations.</p>

      <p><strong>Q4: How many CSS micro animations should a page have?</strong><br/>
      Quality over quantity. A page with 3\u20135 purposeful micro animations feels premium. A page with 20 competing animations feels chaotic and overwhelming. Each animation should serve exactly one purpose: confirm an action, indicate state change, or guide the user's attention.</p>

      <p><strong>Q5: Are CSS animations accessible?</strong><br/>
      They can be, if you implement the <code>prefers-reduced-motion</code> media query. Always write a fallback that disables or reduces animation for users who have indicated motion sensitivity in their OS settings. This is both an ethical requirement and a Lighthouse accessibility criterion.</p>

      <p>Ready to build stunning, animated interfaces from the ground up? Start with the free <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners course on SkillValix</a> \u2014 no fees, no gatekeeping, just real skills with a verifiable certificate.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-29T09:00:00+05:30",
    modifiedDate: "2026-04-05T18:00:00+05:30",
    date: "March 29, 2026",
    readTime: "14 min read",
    wordCount: 2250,
    category: "CSS & Design",
    tags: ["CSS Micro Animations", "CSS Animations", "CSS Transitions", "UI Design", "Web Development", "Micro-Interactions", "CSS Performance", "UX Design"],
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "CSS micro animations and interactive UI design patterns on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/css-animations-micro-interactions-guide",
    relatedCourse: {
      title: "CSS for Beginners \u2014 Zero to Pro",
      slug: "css-for-beginners-learn-web-styling-zero-to-pro",
      description: "Master CSS animations, Flexbox, Grid and transitions with a free verifiable certificate."
    }
  },
  {
    id: "freelancing-as-developer-beginners-guide",
    title: "How to Start Freelancing as a Developer in 2026 (Even as a Beginner)",
    metaTitle: "How to Start Freelancing as a Developer in 2026 \u2014 Beginner Guide | SkillValix",
    metaDescription: "A practical guide to starting your freelancing career as a web developer in 2026. Learn how to find your first client, set your rates, and build a portfolio \u2014 even if you are just starting out.",
    keywords: [
      "freelancing for developers 2026",
      "how to start freelancing beginner",
      "web developer freelance guide",
      "find first client freelancer",
      "freelance web development India",
      "upwork fiverr developer tips",
      "build portfolio for freelancing",
      "developer side income"
    ],
    excerpt: "You do not need years of experience to start freelancing. You need one good project and one happy client. Here is the exact blueprint to get your first paid project as a developer in 2026.",
    content: `
      <h2>The Freelance Developer Opportunity in 2026</h2>
      <p>The global demand for web development freelancers has never been higher. Small businesses, content creators, local shops, and startups all need websites. Most of them cannot afford a full-time developer \u2014 but they can absolutely afford a skilled freelancer.</p>

      <h3>Step 1: Build a Portfolio with 3 Projects</h3>
      <p>You do not need 10 projects. You need 3 excellent ones. A personal portfolio site, a business landing page, and one interactive app. Host them all on GitHub Pages or Netlify for free. This is your proof of ability.</p>

      <h3>Step 2: Get a Verifiable Certificate</h3>
      <p>A certificate from a recognised platform signals credibility. When pitching to a client on Upwork or Fiverr, attaching a verifiable certificate link from <a href="https://www.skillvalix.com" target="_blank">SkillValix</a> gives them immediate confidence that you passed a real exam \u2014 not just watched YouTube tutorials.</p>

      <h3>Step 3: Pricing Your First Projects</h3>
      <p>Start at \u20B95,000\u2013\u20B915,000 ($60\u2013$180) per project for simple landing pages. As you accumulate reviews and testimonials, raise your rates every 3 months. Your skills will improve faster than you think.</p>

      <h3>Step 4: Where to Find Clients</h3>
      <ul>
        <li><strong>Platforms:</strong> Upwork, Fiverr, Toptal (as you grow)</li>
        <li><strong>Local businesses:</strong> Restaurants, clinics, boutiques near you who lack a website</li>
        <li><strong>LinkedIn:</strong> Post your projects weekly and engage with business owners</li>
      </ul>

      <p>The skills you need to start are available free today at <a href="https://www.skillvalix.com/courses" target="_blank">SkillValix Courses</a>.</p>
    `,
    author: "Rahul Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-03-30T09:00:00+05:30",
    modifiedDate: "2026-03-30T09:00:00+05:30",
    date: "March 30, 2026",
    readTime: "7 min read",
    wordCount: 450,
    category: "Career & Industry",
    tags: ["Freelancing", "Web Development", "Career", "Beginners", "Income"],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Freelancer working remotely on laptop at a coffee shop",
    canonicalUrl: "https://www.skillvalix.com/blog/freelancing-as-developer-beginners-guide",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Build the JavaScript skills every client expects \u2014 free with a verifiable certificate."
    }
  },
  {
    id: "developer-resume-portfolio-tips-2026",
    title: "7 Things Every Developer Resume Must Have in 2026 (With Examples)",
    metaTitle: "7 Things Every Developer Resume Must Have in 2026 | SkillValix",
    metaDescription: "Struggling to get interviews as a developer? Your resume might be the problem. Learn the 7 essential elements every developer CV needs in 2026 to get noticed by recruiters.",
    keywords: [
      "developer resume tips 2026",
      "web developer CV guide",
      "programmer resume examples",
      "developer portfolio tips",
      "tech resume India",
      "get developer job 2026",
      "resume for freshers software developer",
      "programmer CV no experience"
    ],
    excerpt: "Most developer resumes fail within the first 6 seconds of review. Find out the 7 critical elements that separate CVs that get interviews from those that get ignored \u2014 even for fresh graduates.",
    content: `
      <h2>The 6-Second Resume Test</h2>
      <p>Recruiters spend an average of 6 seconds scanning a resume before deciding whether to read it further. That means your most important information must be immediately visible, scannable, and compelling.</p>

      <h3>1. A GitHub Profile Link (Not Optional in 2026)</h3>
      <p>A GitHub profile with regular commits is worth more than a list of skills. It shows that you build things, that you care, and that you write real code. Include your 3 best repositories with clear README files.</p>

      <h3>2. Verifiable Certificates, Not Just "Completed" Claims</h3>
      <p>Anyone can write "Completed HTML Course" on a resume. A verifiable certificate with a unique ID that a recruiter can actually check is a completely different signal. Certificates from platforms with real exams \u2014 like <a href="https://www.skillvalix.com" target="_blank">SkillValix</a> \u2014 provide that verification link instantly.</p>

      <h3>3. Quantified Projects, Not Vague Descriptions</h3>
      <p>Bad: "Built a portfolio website." Good: "Built a responsive portfolio site using HTML5 & CSS Grid, with 95+ Lighthouse performance score, deployed on Netlify." Numbers and specifics tell a story skills lists cannot.</p>

      <h3>4. A Skills Section Ordered by Proficiency</h3>
      <p>List languages and tools you are confident being tested on. Recruiters will ask you about anything you list. Only include what you can discuss in depth.</p>

      <h3>5. A One-Line LinkedIn Profile URL</h3>
      <h3>6. A Clean, Single-Column Layout (No Graphics, No Tables)</h3>
      <h3>7. A Tailored Summary, Not a Generic Objective</h3>
      <p>Write 2\u20133 sentences that say exactly what kind of role you want and what unique value you bring. This is your 6-second hook.</p>

      <p>Build the skills that fill your resume at <a href="https://www.skillvalix.com/courses" target="_blank">SkillValix</a> \u2014 completely free with certified exams.</p>
    `,
    author: "Priya Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-01T09:00:00+05:30",
    modifiedDate: "2026-04-01T09:00:00+05:30",
    date: "April 1, 2026",
    readTime: "6 min read",
    wordCount: 420,
    category: "Career & Industry",
    tags: ["Resume Tips", "Job Search", "Developer Career", "Portfolio", "Freshers"],
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer reviewing resume and portfolio on desk",
    canonicalUrl: "https://www.skillvalix.com/blog/developer-resume-portfolio-tips-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Add JS to your resume with confidence \u2014 pass the exam and earn a verifiable certificate for free."
    }
  },
  {
    id: "ai-tools-every-developer-should-use-2026",
    title: "10 AI Tools Every Developer Must Use in 2026 to Code Faster",
    metaTitle: "10 AI Tools Every Developer Must Use in 2026 | SkillValix",
    metaDescription: "Discover the top 10 AI-powered developer tools in 2026 that will supercharge your productivity \u2014 from AI code completion to automated testing. Stay ahead of the curve.",
    keywords: [
      "AI tools for developers 2026",
      "best AI coding tools",
      "GitHub Copilot alternatives",
      "AI for web development",
      "developer productivity AI",
      "AI code review tools",
      "machine learning tools programmers",
      "ChatGPT for developers"
    ],
    excerpt: "AI is not replacing developers \u2014 but developers who use AI are replacing those who do not. Here are the 10 AI tools in 2026 that will make you code twice as fast with half the frustration.",
    content: `
      <h2>The AI-Augmented Developer in 2026</h2>
      <p>The biggest productivity shift in software development right now is not a new framework or a new language. It is AI-powered tooling. Developers who integrate these tools into their workflow are dramatically outperforming those who do not.</p>

      <h3>1. GitHub Copilot \u2014 AI Pair Programmer</h3>
      <p>Copilot autocompletes entire functions as you type. It reads the context of your file and suggests the next logical block of code. Treat it as a fast, tireless junior developer who suggests, while you review and decide.</p>

      <h3>2. Cursor \u2014 AI-Native Code Editor</h3>
      <p>A fork of VS Code with deep AI integration. You can use natural language commands to refactor code, explain error messages, and even generate complete components from a description.</p>

      <h3>3. Tabnine \u2014 Privacy-First AI Completion</h3>
      <p>For developers or teams who cannot send code to external servers (healthcare, fintech), Tabnine runs entirely locally. Enterprise-grade AI completion without data exposure.</p>

      <h3>4. ChatGPT / Claude for Debugging</h3>
      <p>Paste a confusing error stack trace and ask AI to explain it. The explanation quality in 2026 is remarkable \u2014 often better than Stack Overflow for uncommon edge cases.</p>

      <h3>5\u201310. Honourable Mentions</h3>
      <ul>
        <li><strong>Codeium</strong> \u2014 Free GitHub Copilot alternative</li>
        <li><strong>Pieces.app</strong> \u2014 AI-powered code snippet manager</li>
        <li><strong>Warp</strong> \u2014 AI terminal with natural language commands</li>
        <li><strong>Vercel v0</strong> \u2014 Generate React UI components from text prompts</li>
        <li><strong>Mintlify</strong> \u2014 Auto-generate code documentation</li>
        <li><strong>Snyk</strong> \u2014 AI-powered security vulnerability scanner</li>
      </ul>

      <p>Understanding how AI and Machine Learning work under the hood makes you a significantly better user of these tools. Explore the free <a href="https://www.skillvalix.com/courses/basics-of-artificial-intelligence-beginners" target="_blank">AI & Machine Learning Fundamentals</a> course on SkillValix.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T09:00:00+05:30",
    modifiedDate: "2026-04-02T09:00:00+05:30",
    date: "April 2, 2026",
    readTime: "7 min read",
    wordCount: 460,
    category: "AI & Data Science",
    tags: ["AI Tools", "Developer Productivity", "GitHub Copilot", "Machine Learning", "Technology 2026"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "AI code generation interface on a developer screen",
    canonicalUrl: "https://www.skillvalix.com/blog/ai-tools-every-developer-should-use-2026",
    relatedCourse: {
      title: "AI & Machine Learning Fundamentals",
      slug: "basics-of-artificial-intelligence-beginners",
      description: "Understand the AI powering these tools \u2014 learn for free with a verifiable certificate."
    }
  },
  {
    id: "how-to-host-hackathon-in-india-2026",
    title: "How to Host a Hackathon in India in 2026: The Complete Guide",
    metaTitle: "How to Host a Hackathon in India in 2026 \u2014 Complete Guide | SkillValix",
    metaDescription: "Planning to host a hackathon in India? This complete 2026 guide covers everything \u2014 from team registration and payment collection to submission management and certification. No Google Forms needed.",
    keywords: [
      "how to host a hackathon in India",
      "hackathon host India",
      "organize hackathon online India",
      "hackathon platform India 2026",
      "host college hackathon",
      "hackathon management platform",
      "online hackathon India",
      "hackathon registration platform"
    ],
    excerpt: "Hosting a hackathon in India used to mean chaotic Google Forms, manual payment tracking, and WhatsApp group pandemonium. Not anymore. Here is how to run a professional, fully-automated hackathon end-to-end.",
    content: `
      <h2>The Problem with "Traditional" Hackathon Organizing in India</h2>
      <p>If you have ever tried to organize a hackathon \u2014 whether for your college fest, a corporate innovation drive, or a community event \u2014 you know the pain. It starts with a Google Form. Then someone builds a WhatsApp group. Then Excel sheets for team tracking. Then a UPI QR code for payments. Then chasing 200 participants for their submission links the night before the deadline.</p>
      <p>The result? Organizers burn out. Participants get confused. And the hackathon's reputation suffers before it even begins.</p>

      <h3>What Does a Modern Hackathon Platform Do?</h3>
      <p>A dedicated hackathon hosting platform eliminates every manual step in the process. Here is what the workflow looks like on a purpose-built platform like <a href="https://www.skillvalix.com/host" target="_blank">SkillValix</a>:</p>
      <ul>
        <li><strong>Team Registration:</strong> Participants sign up, create teams, and invite members \u2014 all managed inside a secure dashboard. No more Excel.</li>
        <li><strong>Built-in Payment:</strong> If your hackathon has a registration fee, participants pay directly through the platform. You receive INR payments without sharing a personal UPI QR or chasing confirmations.</li>
        <li><strong>Deadline Countdown:</strong> Every participant sees a live countdown to the submission deadline. No more "Sir, what is the last time?" messages.</li>
        <li><strong>Structured Submissions:</strong> Teams paste their GitHub repo, Google Drive link, or PDF directly from their team dashboard \u2014 organized, timestamped, and ready for review.</li>
        <li><strong>Admin Scoring:</strong> You review each team's submission, assign a score out of 100, and the platform tracks rankings automatically.</li>
        <li><strong>Auto-Certificates:</strong> Winners and participants receive beautiful, verifiable digital certificates the moment you click "Publish Results". Zero manual PDF generation.</li>
      </ul>

      <h3>Who Should Host a Hackathon?</h3>
      <ul>
        <li><strong>Engineering Colleges:</strong> Technical fests, department-level coding events, inter-college collaborative hackathons.</li>
        <li><strong>Tech Communities:</strong> Developer meetup groups, open-source clubs, bootcamp cohorts.</li>
        <li><strong>Startups & Companies:</strong> Product innovation sprints, campus hiring drives, internal team-building events.</li>
        <li><strong>NGOs & Education Platforms:</strong> Social impact hackathons, education innovation challenges.</li>
      </ul>

      <h3>How to Launch Your Hackathon in 2 Minutes</h3>
      <p>On SkillValix, creating a hackathon is as fast as filling a form. You set the title, description, deadline, team size limits, payment config, and submission rules. The platform goes live instantly. Participants can register the same minute.</p>
      <p>Ready to run India's next great hackathon? <a href="https://www.skillvalix.com/host" target="_blank">Submit your hosting request here</a> and let's make it happen.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T10:00:00+05:30",
    modifiedDate: "2026-04-02T10:00:00+05:30",
    date: "April 2, 2026",
    readTime: "8 min read",
    wordCount: 540,
    category: "Career & Industry",
    tags: ["Hackathon", "Host Hackathon India", "Event Management", "Coding Events", "Tech Community"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developers collaborating at a hackathon event in India",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-host-hackathon-in-india-2026",
    relatedCourse: {
      title: "The Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Build the skills to compete and win at your first hackathon \u2014 free with a verifiable certificate."
    }
  },
  {
    id: "best-online-hackathons-india-2026",
    title: "Best Online Hackathons in India 2026: Where to Compete & Win",
    metaTitle: "Best Online Hackathons in India 2026 \u2014 Win Prizes & Certificates | SkillValix",
    metaDescription: "Looking for the best online hackathons in India in 2026? Discover top coding challenges, win cash prizes, and earn verifiable digital certificates. Find and join live events on SkillValix.",
    keywords: [
      "best online hackathons in India 2026",
      "online hackathon India",
      "coding challenges India 2026",
      "hackathon for students India",
      "free hackathon online India",
      "win prizes hackathon India",
      "hackathon with certificate India",
      "coding competition India 2026"
    ],
    excerpt: "Forget scouring Reddit and Discord for hackathon announcements. Here is your authoritative guide to finding, joining, and winning the best online hackathons in India in 2026 \u2014 complete with prizes and certificates.",
    content: `
      <h2>Why Online Hackathons are the Best Career Move for Indian Developers</h2>
      <p>Five years ago, participating in a top hackathon meant travelling to Mumbai, Bengaluru, or Delhi, booking hotels, and taking time off college. In 2026, the most prestigious, high-paying coding challenges are fully online. You compete from your room, collaborate with teammates across the country, and win cash prizes \u2014 all without leaving your city.</p>
      <p>For engineering students and early-career developers in India, hackathons are the single fastest way to build a portfolio, earn industry recognition, and get noticed by recruiters.</p>

      <h3>What Makes a Hackathon "The Best"?</h3>
      <p>Not all hackathons are equal. Before registering, evaluate each event on these five criteria:</p>
      <ul>
        <li><strong>Clear Problem Statement:</strong> The best hackathons give you a defined scope. Vague "build anything" prompts lead to vague projects that do not impress judges or employers.</li>
        <li><strong>Transparent Judging Criteria:</strong> You should know exactly how your project will be evaluated \u2014 innovation, technical complexity, UX, and presentation weight.</li>
        <li><strong>Structured Registration:</strong> A professional event uses a proper platform \u2014 not a Google Form. Platforms like <a href="https://www.skillvalix.com/hackathons" target="_blank">SkillValix</a> manage your team, payment, and submission in one place.</li>
        <li><strong>Real Prizes:</strong> Cash prizes, internship offers, or guaranteed interview opportunities from real companies signal a serious event.</li>
        <li><strong>Verifiable Certificates:</strong> A certificate you can link to on LinkedIn \u2014 with a unique ID that anyone can verify \u2014 carries far more weight than a PNG file emailed to you.</li>
      </ul>

      <h3>How to Maximize Your Chances of Winning</h3>
      <ol>
        <li><strong>Read the brief 3 times.</strong> Most losing teams solve the wrong problem.</li>
        <li><strong>Build an MVP, not a masterpiece.</strong> A working demo with 3 features beats a perfect design with 0 features. Judges click buttons.</li>
        <li><strong>Prepare a 2-minute pitch.</strong> Your presentation matters as much as your code. Practice explaining your solution to a non-technical person.</li>
        <li><strong>Document on GitHub.</strong> A clean README with screenshots, a live demo link, and install instructions is the mark of a professional team.</li>
      </ol>

      <h3>Where to Find the Best Online Hackathons in India</h3>
      <p>Rather than chasing scattered announcements across social media, visit <a href="https://www.skillvalix.com/hackathons" target="_blank">SkillValix Hackathons</a> \u2014 a curated hub of live and upcoming events built specifically for the Indian developer community. Each event page shows you the full details: deadline, team size, prizes, rules, and submission format \u2014 all in one place.</p>
      <p>Register, form your team, and start building. Your next win is one hackathon away.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T11:00:00+05:30",
    modifiedDate: "2026-04-02T11:00:00+05:30",
    date: "April 2, 2026",
    readTime: "7 min read",
    wordCount: 510,
    category: "Career & Industry",
    tags: ["Hackathon", "Online Hackathon India", "Coding Competition", "Student Career", "Win Prizes"],
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Team of young Indian developers working together at a hackathon",
    canonicalUrl: "https://www.skillvalix.com/blog/best-online-hackathons-india-2026",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Python is the #1 language used in winning AI and data-focused hackathons \u2014 learn it free."
    }
  },
  {
    id: "corporate-hackathon-platform-india-hiring",
    title: "Why Indian Startups are Replacing Technical Interviews with Hackathons",
    metaTitle: "Corporate Hackathon Platform India \u2014 Hire Developers Through Hackathons | SkillValix",
    metaDescription: "Discover why leading Indian startups and companies are using hackathons as their primary technical hiring tool in 2026. Learn how to host a corporate hackathon and find your next best engineer.",
    keywords: [
      "corporate hackathon platform India",
      "hire developers through hackathon",
      "hackathon for recruitment India",
      "tech hiring hackathon 2026",
      "host hackathon for companies",
      "campus hackathon India",
      "startup hackathon India",
      "developer recruitment platform India"
    ],
    excerpt: "The traditional technical interview is broken. Whiteboard problems cannot tell you if a candidate can ship real code under real pressure. Here is why India's fastest-growing companies are switching to hackathon-based hiring.",
    content: `
      <h2>The Technical Interview is Failing Everyone</h2>
      <p>Engineering hiring in India follows a predictable, broken pattern. A recruiter screens 500 resumes. 50 candidates get a LeetCode online assessment. 10 pass. 5 get a technical interview. 2 get offers. Of those 2, one joins and turns out to be a great LeetCode solver but a mediocre builder.</p>
      <p>The problem is fundamental: the skills required to ace a whiteboard interview have almost zero correlation with the skills required to build a product under a deadline.</p>

      <h3>What a Hackathon Reveal That an Interview Cannot</h3>
      <ul>
        <li><strong>Real-World Building Ability:</strong> Can the candidate scope a problem, make architecture decisions, and ship working code in 48 hours? A hackathon answers this with certainty.</li>
        <li><strong>Collaboration Under Pressure:</strong> Can they communicate clearly with teammates, divide tasks efficiently, and integrate each other's code? You will see this live.</li>
        <li><strong>Product Sense:</strong> Do they think about the user experience, or do they only think about algorithms? The best engineers do both.</li>
        <li><strong>Code Quality:</strong> A GitHub submission with clean commits, a proper README, and readable code tells you more than any take-home assessment.</li>
      </ul>

      <h3>How to Run a Hiring Hackathon Without Building Custom Infrastructure</h3>
      <p>The #1 reason companies avoided hackathon-based hiring in the past was logistics. Building a custom registration portal, payment system, submission tracker, and scoring dashboard just for hiring felt disproportionate.</p>
      <p>In 2026, that excuse no longer exists. <a href="https://www.skillvalix.com/host" target="_blank">SkillValix</a> provides all of this out of the box. As a company, you submit your event details and get a fully functional hackathon page live within minutes:</p>
      <ul>
        <li>Participants register and form teams on the platform</li>
        <li>Your problem statement and judging criteria are displayed clearly</li>
        <li>Teams submit GitHub links, live demos, or PDFs directly</li>
        <li>Your hiring team reviews submissions side-by-side and assigns scores</li>
        <li>Top performers get certificates and an invitation to the next interview round</li>
      </ul>

      <h3>The ROI of Hackathon Hiring</h3>
      <p>Consider this: a traditional campus hiring drive costs \u20B93\u20138 lakhs when you factor in travel, setup, and HR hours. A hackathon on a platform costs a fraction of that, reaches 10x the candidate pool nationally, and filters talent far more effectively.</p>
      <p>Companies running hackathons through SkillValix have reported finding candidates they would have screened out on paper \u2014 students from Tier-2 colleges with extraordinary building ability who simply test poorly in interview formats.</p>

      <h3>Get Started Today</h3>
      <p>If you are a startup, a scale-up, or an established tech company looking for your next great engineer, stop relying on resume screening and LeetCode. <a href="https://www.skillvalix.com/host" target="_blank">Submit a hosting request on SkillValix</a> and run your first corporate hackathon this quarter.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-02T12:00:00+05:30",
    modifiedDate: "2026-04-02T12:00:00+05:30",
    date: "April 2, 2026",
    readTime: "8 min read",
    wordCount: 580,
    category: "Career & Industry",
    tags: ["Corporate Hackathon", "Tech Hiring India", "Recruitment", "Hackathon Platform", "Startups India"],
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Corporate team evaluating developer hackathon submissions in India",
    canonicalUrl: "https://www.skillvalix.com/blog/corporate-hackathon-platform-india-hiring",
    relatedCourse: {
      title: "AI & Machine Learning Fundamentals",
      slug: "basics-of-artificial-intelligence-beginners",
      description: "The skill companies want most in hackathon candidates \u2014 learn it free with a verifiable certificate."
    }
  },
  {
    id: "free-online-courses-with-certificate-india-2026",
    title: "Best Free Online Courses with Certificate in India 2026 (No Fee, Verified)",
    metaTitle: "Best Free Online Courses with Certificate in India 2026 | SkillValix",
    metaDescription: "Looking for free online courses with certificate in India? SkillValix offers 100% free courses in HTML, CSS, JavaScript, Python, Java & AI \u2014 all with verifiable certificates. No fee, no credit card.",
    keywords: [
      "free online courses with certificate in India",
      "free courses with certificate India 2026",
      "free certification courses India",
      "online courses free certificate India",
      "best free online courses India",
      "free skill courses India",
      "free certificate courses for students India",
      "free online learning India"
    ],
    excerpt: "India has thousands of free course platforms \u2014 but very few give you a certificate that actually means something. Here are the best free online courses with verifiable certificates available to Indian students in 2026.",
    content: `
      <h2>Why Free Certificates in India Are a Big Deal in 2026</h2>
      <p>India produces over 1.5 million engineering graduates annually. The brutal reality? Most of them compete for the same entry-level roles with nearly identical resumes. A free, verifiable certificate from a credible platform is one of the fastest ways to make your application stand out \u2014 especially if you're a student from a Tier-2 or Tier-3 college.</p>
      <p>The good news: you don't need to spend a rupee. The best free online courses with certificates in India are available right now, and they're more comprehensive than most paid alternatives.</p>

      <h2>What Makes a Free Certificate Worth Having?</h2>
      <p>Not all free certificates are equal. Before you spend 10 hours on a course, check for these three things:</p>
      <ul>
        <li><strong>Verifiability:</strong> Can an employer independently verify that you actually completed the course? A good platform gives every certificate a unique ID that anyone can check online.</li>
        <li><strong>Exam requirement:</strong> Certificates that require you to pass an actual exam are worth far more than course-completion certificates. Completion proves you watched. An exam proves you understood.</li>
        <li><strong>No paywall at the end:</strong> Some platforms offer free course access but then charge you for the certificate. Avoid these. On SkillValix, both learning and the certificate are completely free.</li>
      </ul>

      <h2>Best Free Online Courses with Certificate in India \u2014 2026 List</h2>

      <h3>1. HTML5 for Beginners \u2014 SkillValix</h3>
      <p>The foundation of all web development. This free course covers everything from document structure to forms, semantic HTML, and SEO-relevant markup. Pass the exam and get a verified certificate immediately. Perfect for beginners \u2014 no prior knowledge required. <a href="/courses/ultimate-html-masterclass">Start the HTML course free \u2192</a></p>

      <h3>2. CSS for Beginners: Zero to Pro \u2014 SkillValix</h3>
      <p>Modern CSS including Flexbox, Grid, animations, and responsive design. This course is built for someone who has finished HTML and wants to make websites look professional. Free, self-paced, and ends with a certificate on exam completion. <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">Start the CSS course free \u2192</a></p>

      <h3>3. JavaScript Masterclass \u2014 SkillValix</h3>
      <p>The most sought-after skill in Indian tech hiring. This free JavaScript course covers variables, functions, DOM manipulation, closures, async/await, and APIs. Verified certificate included. <a href="/courses/ultimate-javascript-masterclass">Start the JavaScript course free \u2192</a></p>

      <h3>4. Python for Beginners \u2014 SkillValix</h3>
      <p>Used in AI, data science, automation, and backend development. Python is the single most versatile language to learn in 2026. This free course takes you from zero to functional Python programmer with a verified certificate. <a href="/courses/ultimate-python-masterclass">Start the Python course free \u2192</a></p>

      <h3>5. Java Programming Masterclass \u2014 SkillValix</h3>
      <p>Java remains the dominant language for Android development, enterprise software, and backend systems. This free course covers OOP, collections, streams, and exception handling. Certificate included. <a href="/courses/ultimate-java-masterclass">Start the Java course free \u2192</a></p>

      <h3>6. AI & Machine Learning Fundamentals \u2014 SkillValix</h3>
      <p>Artificial intelligence is the defining skill of this decade. This course gives you a conceptual and practical foundation in AI \u2014 neural networks, machine learning pipelines, real-world AI use cases \u2014 all free with a verifiable certificate. <a href="/courses/basics-of-artificial-intelligence-beginners">Start the AI course free \u2192</a></p>

      <h2>How to Add These Certificates to LinkedIn</h2>
      <p>Once you earn your certificate on SkillValix, here's exactly how to add it to your LinkedIn profile:</p>
      <ol>
        <li>Go to your LinkedIn profile and click <strong>Add section \u2192 Licenses & Certifications</strong></li>
        <li>Enter the course name as the Certificate Name</li>
        <li>Set Issuing Organization to <strong>SkillValix</strong></li>
        <li>Enter your certificate's unique ID in the Credential ID field</li>
        <li>Add the verification URL: <strong>https://www.skillvalix.com/verify/[your-certificate-id]</strong></li>
      </ol>
      <p>This makes your certificate independently verifiable \u2014 any recruiter can click the URL and instantly confirm your achievement.</p>

      <h2>Beyond Certificates: Student Hackathons</h2>
      <p>A certificate shows you can learn. A <a href="/hackathons">hackathon project</a> shows you can build. The students who combine both \u2014 a verifiable certificate and a real hackathon submission \u2014 are the ones who consistently stand out in applications. SkillValix runs free online student hackathons year-round, open to beginners. No registration fee. Every participant gets a certificate.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Are SkillValix certificates recognized by employers in India?</strong><br/>
      Yes. Each SkillValix certificate has a unique verification ID. Employers can verify your achievement at skillvalix.com/verify in seconds. Thousands of Indian students have successfully added these certificates to their LinkedIn profiles and received interview calls from IT companies, startups, and product companies.</p>

      <p><strong>Q2: Do I need to pay anything for the certificate?</strong><br/>
      No. On SkillValix, both the course content and the certificate are completely free. You pass the exam, you get the certificate \u2014 no credit card, no hidden fees, no subscription.</p>

      <p><strong>Q3: Which free course should I start with as a complete beginner?</strong><br/>
      Start with HTML. It's the foundation of all web development and takes most students just 3\u20134 hours to complete. Then move to CSS, then JavaScript. This three-course path gives you a full frontend web development foundation \u2014 all free, all with certificates.</p>

      <p><strong>Q4: Can students from any college in India join SkillValix?</strong><br/>
      Absolutely. SkillValix is open to all students across India \u2014 Tier-1, Tier-2, and Tier-3 colleges. The platform was specifically built to give equal opportunity to students who don't have access to premium coaching or expensive courses.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-06T09:00:00+05:30",
    modifiedDate: "2026-04-08T09:00:00+05:30",
    date: "April 6, 2026",
    readTime: "11 min read",
    wordCount: 1180,
    category: "Career & Industry",
    tags: ["Free Courses India", "Free Certificate India", "Online Learning India", "SkillValix", "Student Skills", "Certification"],
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Indian student studying online on laptop with free course certificate on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/free-online-courses-with-certificate-india-2026",
    relatedCourse: {
      title: "Free Online Courses \u2014 All Subjects",
      slug: "ultimate-html-masterclass",
      description: "Start with HTML \u2014 the foundation of all web development. Free course, free certificate."
    }
  },
  {
    id: "how-to-win-a-hackathon-beginner-guide-2026",
    title: "How to Win a Hackathon: Complete Beginner Guide (2026)",
    metaTitle: "How to Win a Hackathon: Beginner Strategy Guide 2026 | SkillValix",
    metaDescription: "Want to win your first hackathon? This complete beginner guide covers team formation, idea selection, project execution, and presentation strategies that judges actually reward.",
    keywords: [
      "how to win a hackathon",
      "hackathon tips for beginners",
      "how to participate in hackathon",
      "hackathon strategy 2026",
      "first hackathon tips",
      "online hackathon for beginners India",
      "hackathon project ideas",
      "hackathon winning tips"
    ],
    excerpt: "Most beginners lose hackathons not because they lack skill \u2014 but because they pick the wrong idea, burn time on the wrong features, or present badly. Here is the complete strategy guide for your first hackathon win.",
    content: `
      <h2>Why Most Beginners Don't Win \u2014 And How to Fix It</h2>
      <p>The #1 reason beginners don't win hackathons has nothing to do with coding ability. It's strategy. Most first-timers try to build something impressive rather than something <em>complete</em>. Judges don't reward ambition \u2014 they reward execution. A simple idea that actually works beats a complex idea that barely runs every single time.</p>
      <p>This guide gives you the exact strategy to maximize your chances of winning your first hackathon \u2014 even if you're a beginner, even if you're a solo participant, and even if you've never built anything at scale before.</p>

      <h2>Step 1: Pick the Right Hackathon</h2>
      <p>Not all hackathons are equal. As a beginner, look for:</p>
      <ul>
        <li><strong>Beginner-friendly themes:</strong> "Social Impact", "EdTech", "Health" are easier to build for than "Blockchain" or "Quantum Computing"</li>
        <li><strong>Online format:</strong> Online hackathons remove travel stress and let you work in your own environment. <a href="/hackathons">SkillValix hackathons</a> are 100% online and free to enter.</li>
        <li><strong>Participation certificates:</strong> Even if you don't win, you leave with a verifiable certificate documenting your participation</li>
        <li><strong>Solo or small team options:</strong> Solo participation means you control every decision and submit without coordination complexity</li>
      </ul>

      <h2>Step 2: Idea Selection \u2014 Think Small, Think Complete</h2>
      <p>The most common beginner mistake is scope creep \u2014 picking an idea that requires 10 features and only finishing 3. Here's the winning framework:</p>
      <ul>
        <li><strong>One core problem, one core solution.</strong> If you can't describe your project in one sentence, it's too complex.</li>
        <li><strong>Solve a real problem for a specific user.</strong> "An app for students to track study time with auto-scheduling" beats "An AI-powered super platform for productivity"</li>
        <li><strong>Build something you can demo in 2 minutes.</strong> Judges see dozens of projects. A clean, working demo that takes 90 seconds to show wins over a polished pitch deck for something that doesn't work.</li>
      </ul>

      <h2>Step 3: Team Formation (If You're Not Solo)</h2>
      <p>The ideal hackathon team of 2\u20134 people has one person in each role:</p>
      <ul>
        <li><strong>Builder/Developer:</strong> Focuses on making the product actually work</li>
        <li><strong>Designer:</strong> Makes it look credible \u2014 even basic Figma mockups help enormously</li>
        <li><strong>Presenter:</strong> Owns the pitch and the demo \u2014 the person who can talk confidently about the problem and solution</li>
      </ul>
      <p>If you're building solo, allocate your time: 70% building, 20% designing/polishing, 10% preparing your presentation or submission document.</p>

      <h2>Step 4: Execution \u2014 The 3-Phase Approach</h2>
      <h3>Phase 1: Foundation (First 30% of time)</h3>
      <p>Get the core working. No UI polish, no extra features \u2014 just the essential user flow working end to end. This is your safety net. If you run out of time, this is what you submit.</p>

      <h3>Phase 2: Polish (Middle 50% of time)</h3>
      <p>Add the UI layer, fix obvious bugs, connect loose wires. This is where most of your visible progress comes from.</p>

      <h3>Phase 3: Submission Prep (Final 20% of time)</h3>
      <p>Stop adding features. Write your README or submission document. Record a clear demo video if required. A well-documented, mediocre project consistently beats an undocumented excellent one.</p>

      <h2>Step 5: The Winning Submission</h2>
      <p>Most hackathon submissions are judged on 4 things:</p>
      <ol>
        <li><strong>Problem clarity:</strong> Did you clearly define a real problem?</li>
        <li><strong>Solution quality:</strong> Does your solution actually address the problem?</li>
        <li><strong>Technical execution:</strong> Does it work? Is the code reasonable?</li>
        <li><strong>Impact potential:</strong> Could this actually help people if developed further?</li>
      </ol>
      <p>Structure your submission document around these four points. One paragraph each. Clear, direct language. No jargon.</p>

      <h2>Where to Practice: Free Hackathons on SkillValix</h2>
      <p>The best way to get better at hackathons is to do them. <a href="/hackathons">SkillValix hackathons</a> are specifically designed for beginners aged 16\u201330. They're online, free to enter, have beginner-friendly themes, and every participant receives a verified certificate whether they win or not. Winning teams receive merit certificates that are verifiable on your public profile.</p>
      <p>Before you join, strengthen your fundamentals \u2014 the <a href="/courses/ultimate-javascript-masterclass">free JavaScript course</a> and <a href="/courses/ultimate-python-masterclass">free Python course</a> on SkillValix will give you the technical foundation to build something meaningful in any hackathon environment.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Can a complete beginner win a hackathon?</strong><br/>
      Yes \u2014 if they pick the right hackathon and execute strategically. Beginners who focus on building a simple, complete, well-documented solution often beat advanced teams who overscope and submit something broken. Execution beats ambition every time.</p>

      <p><strong>Q2: Do I need a team to participate in hackathons?</strong><br/>
      No. Many hackathons, including those on SkillValix, allow solo participation. Solo submissions are evaluated on the same criteria as team submissions. Working solo means you control every decision, which can be an advantage for beginners learning their workflow.</p>

      <p><strong>Q3: What programming languages should I know for hackathons?</strong><br/>
      HTML + CSS + JavaScript covers the vast majority of hackathon use cases (web apps). Python is useful for data/AI themed challenges. Most judges don't care which language you use \u2014 they care that your project works.</p>

      <p><strong>Q4: How do I get a hackathon participation certificate?</strong><br/>
      On SkillValix, every participant who submits a valid project receives a verified participation certificate. Winners receive special merit certificates. Both are verifiable on your public SkillValix profile.</p>
    `,
    author: "Amit Patel",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-07T09:00:00+05:30",
    modifiedDate: "2026-04-08T09:00:00+05:30",
    date: "April 7, 2026",
    readTime: "12 min read",
    wordCount: 1250,
    category: "Career & Industry",
    tags: ["Hackathon Tips", "How to Win Hackathon", "Beginner Hackathon", "Online Hackathon India", "Student Hackathon", "Hackathon Strategy"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Students collaborating on a hackathon project with laptops in a bright workspace",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-win-a-hackathon-beginner-guide-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Build the JavaScript skills you need to ship a hackathon project in hours. Free with certificate."
    }
  },
  {
    id: "web-development-roadmap-2026-beginners",
    title: "Web Development Roadmap 2026: The Complete Free Guide for Beginners",
    metaTitle: "Web Development Roadmap 2026: Complete Free Guide for Beginners | SkillValix",
    metaDescription: "Follow the complete web development roadmap for 2026. Learn HTML, CSS, JavaScript, React, Node.js and more \u2014 in the right order, with free resources and certificates at every step.",
    keywords: [
      "web development roadmap 2026",
      "how to become a web developer 2026",
      "web development for beginners",
      "frontend development roadmap",
      "learn web development free India",
      "web developer roadmap beginners",
      "HTML CSS JavaScript roadmap",
      "full stack development roadmap 2026"
    ],
    excerpt: "There's no shortage of web development content \u2014 but no one tells you what to learn first, what to skip, and what order actually makes sense. This is the complete, opinionated roadmap for 2026.",
    content: `
      <h2>The Problem with Most Web Dev Roadmaps</h2>
      <p>Search "web development roadmap" and you'll get a 200-technology diagram that makes you feel like you need 5 years to even start. This guide is different. It gives you the exact learning path \u2014 in sequence, with time estimates \u2014 to go from zero to job-ready web developer using only free resources.</p>

      <h2>Phase 1: HTML \u2014 The Non-Negotiable Foundation (2\u20134 weeks)</h2>
      <p>Every website on the internet is built on HTML. No exceptions. You cannot skip this. HTML teaches you the structure of the web \u2014 how browsers understand content, how pages are organized, and how to write meaningful markup that search engines and screen readers can understand.</p>
      <p>What to learn in HTML:</p>
      <ul>
        <li>Document structure: DOCTYPE, html, head, body</li>
        <li>Semantic tags: article, section, nav, header, footer, main, aside</li>
        <li>Links, images, and multimedia</li>
        <li>Forms and input validation</li>
        <li>Tables and lists</li>
        <li>Accessibility basics (aria-label, alt attributes)</li>
      </ul>
      <p>Free resource: <a href="/courses/ultimate-html-masterclass">The Ultimate HTML Masterclass on SkillValix</a> covers all of this with code examples, quizzes, and a verifiable certificate.</p>
      <p><strong>Time estimate:</strong> 3\u20134 hours of focused study. Most determined beginners finish in a weekend.</p>

      <h2>Phase 2: CSS \u2014 Making Things Look Good (3\u20135 weeks)</h2>
      <p>HTML gives you structure. CSS gives you design. In 2026, CSS is remarkably powerful \u2014 you can build complex layouts, animations, and responsive designs with pure CSS alone.</p>
      <p>What to learn in CSS:</p>
      <ul>
        <li>Selectors, specificity, and the cascade</li>
        <li>Box model: margin, padding, border</li>
        <li>Flexbox \u2014 for one-dimensional layouts (navbars, card rows)</li>
        <li>CSS Grid \u2014 for two-dimensional layouts (full page structure)</li>
        <li>Responsive design and media queries</li>
        <li>CSS Custom Properties (variables)</li>
        <li>Transitions and animations</li>
      </ul>
      <p>Free resource: <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro on SkillValix</a> covers everything above in a structured, beginner-first format.</p>
      <p><strong>Time estimate:</strong> 5\u20136 hours. This is where beginners often spend the most time \u2014 CSS is intuitive once it clicks, but it takes practice.</p>

      <h2>Phase 3: JavaScript \u2014 Bringing Pages to Life (6\u201310 weeks)</h2>
      <p>JavaScript is the most important language for web development. It makes websites interactive \u2014 handling clicks, fetching data from APIs, updating content without page reloads, and building complex user interfaces.</p>
      <p>What to learn in JavaScript (in this order):</p>
      <ul>
        <li>Variables, data types, operators</li>
        <li>Functions, scope, and closures</li>
        <li>DOM manipulation \u2014 selecting, modifying, and adding HTML elements</li>
        <li>Events \u2014 click, submit, keypress</li>
        <li>Arrays and objects \u2014 the two most important data structures</li>
        <li>Async JavaScript \u2014 Promises, async/await, fetch API</li>
        <li>ES6+ features \u2014 arrow functions, destructuring, spread, modules</li>
      </ul>
      <p>Free resource: <a href="/courses/ultimate-javascript-masterclass">The Ultimate JavaScript Masterclass on SkillValix</a> covers all of the above with a verifiable certificate on completion.</p>
      <p><strong>Time estimate:</strong> 6\u20138 hours of course content, plus 20\u201340 hours of practice projects. JavaScript requires building things to truly internalize.</p>

      <h2>Phase 4: Build 3 Projects (4\u20136 weeks)</h2>
      <p>After HTML, CSS, and JavaScript, stop learning and start building. The three best beginner projects:</p>
      <ol>
        <li><strong>Personal portfolio website</strong> \u2014 Shows your HTML/CSS skills and becomes your online presence</li>
        <li><strong>To-do list app with localStorage</strong> \u2014 Tests your JavaScript, DOM manipulation, and data persistence</li>
        <li><strong>Weather app using a public API</strong> \u2014 Introduces async JavaScript, fetch, and working with JSON data</li>
      </ol>
      <p>Put these on GitHub. Link them in your LinkedIn profile. This is your portfolio.</p>

      <h2>Phase 5: React (6\u20138 weeks)</h2>
      <p>React is the dominant JavaScript framework for building complex user interfaces. It's used by Meta, Airbnb, Netflix, and thousands of startups. Once you understand JavaScript, React's concepts (components, state, props, hooks) follow logically.</p>

      <h2>Phase 6: Backend Basics \u2014 Node.js & Express (4\u20136 weeks)</h2>
      <p>Frontend alone limits what you can build. Node.js lets you write JavaScript on the server. Combined with Express.js and a database like MongoDB, you can build full-stack applications \u2014 the foundation for most modern web products.</p>

      <h2>Accelerate with Hackathons</h2>
      <p>Nothing accelerates learning faster than building something under pressure. <a href="/hackathons">SkillValix student hackathons</a> give you a real constraint \u2014 a theme, a deadline, and a submission requirement. The projects you build in hackathons become your strongest portfolio pieces.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: How long does it take to become a web developer from scratch?</strong><br/>
      With focused, consistent effort (2\u20133 hours per day), most beginners are job-ready in 6\u201312 months. The roadmap above takes approximately 6 months for a dedicated learner working on weekends and evenings.</p>

      <p><strong>Q2: Do I need a computer science degree to become a web developer?</strong><br/>
      No. Web development is one of the most accessible fields for self-learners. Thousands of Indian developers \u2014 including senior engineers at top product companies \u2014 are self-taught. What matters is your GitHub portfolio and your ability to build things.</p>

      <p><strong>Q3: Which is the best first programming language for web development?</strong><br/>
      HTML first (it's not technically a programming language but it's the foundation), then CSS, then JavaScript. This order is non-negotiable \u2014 each builds on the previous one.</p>

      <p><strong>Q4: Are free courses enough to get a web development job?</strong><br/>
      Yes, if you supplement them with real projects. The free HTML, CSS, and JavaScript courses on SkillValix \u2014 combined with 3\u20135 portfolio projects and a hackathon participation \u2014 give you everything you need to apply for junior frontend roles.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-08T09:00:00+05:30",
    modifiedDate: "2026-04-08T09:00:00+05:30",
    date: "April 8, 2026",
    readTime: "13 min read",
    wordCount: 1320,
    category: "Career & Industry",
    tags: ["Web Development Roadmap", "Learn Web Development", "Frontend Development", "HTML CSS JavaScript", "Web Dev 2026", "Beginner Guide"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer looking at web development roadmap on dual monitor setup",
    canonicalUrl: "https://www.skillvalix.com/blog/web-development-roadmap-2026-beginners",
    relatedCourse: {
      title: "The Ultimate HTML Masterclass",
      slug: "ultimate-html-masterclass",
      description: "Start your web development journey here. Free course, free certificate."
    }
  },
  {
    id: "javascript-interview-questions-2026",
    title: "Top 30 JavaScript Interview Questions & Answers for 2026 (Freshers & Experienced)",
    metaTitle: "Top 30 JavaScript Interview Questions & Answers 2026 | SkillValix",
    metaDescription: "Prepare for your JavaScript interview with the top 30 most asked JS questions in 2026. Covers closures, promises, event loop, hoisting, this keyword, and ES6+ features with clear answers.",
    keywords: [
      "JavaScript interview questions 2026",
      "JavaScript interview questions for freshers",
      "JavaScript interview questions and answers",
      "JS interview questions",
      "JavaScript coding interview questions",
      "JavaScript ES6 interview questions",
      "closures JavaScript interview",
      "promises async await interview questions"
    ],
    excerpt: "Preparing for a JavaScript interview in 2026? These are the 30 most commonly asked questions \u2014 from closures and hoisting to event loops and async/await \u2014 with clear, concise answers you can use immediately.",
    content: `
      <h2>How to Use This Guide</h2>
      <p>Don't memorize these answers. Understand them. Interviewers at product companies can immediately tell when candidates are reciting answers versus when they actually understand the concept. Read each question, cover the answer, try to explain it in your own words, then check the answer for accuracy.</p>

      <h2>Core JavaScript Concepts</h2>

      <h3>Q1: What is the difference between var, let, and const?</h3>
      <p><code>var</code> is function-scoped and hoisted (initialized as undefined). <code>let</code> and <code>const</code> are block-scoped and in the temporal dead zone before their declaration line. <code>const</code> creates a reference that cannot be reassigned \u2014 but the object or array it points to can still be mutated. In modern JavaScript, use <code>const</code> by default, <code>let</code> when you need to reassign, and never use <code>var</code>.</p>

      <h3>Q2: What is hoisting in JavaScript?</h3>
      <p>Hoisting is JavaScript's behavior of moving function and variable declarations to the top of their scope before code executes. Function declarations are fully hoisted (available before the line they appear). <code>var</code> declarations are hoisted but initialized as <code>undefined</code>. <code>let</code> and <code>const</code> are hoisted but NOT initialized \u2014 accessing them before declaration throws a ReferenceError (the Temporal Dead Zone).</p>

      <h3>Q3: Explain closures in JavaScript.</h3>
      <p>A closure is a function that retains access to variables from its outer (enclosing) scope even after that outer function has returned. This happens because JavaScript functions carry a reference to their lexical environment. Closures are used for data encapsulation, factory functions, memoization, and event handlers.</p>
      <pre><code>function makeCounter() {
  let count = 0;           // 'count' is in makeCounter's scope
  return function() {
    count++;               // Inner function retains access \u2014 closure
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2 \u2014 'count' persists across calls</code></pre>

      <h3>Q4: What is the event loop in JavaScript?</h3>
      <p>JavaScript is single-threaded but handles async tasks through the event loop. The call stack executes synchronous code. When an async operation completes (setTimeout, fetch, etc.), its callback is placed in the callback queue. The event loop continuously checks: if the call stack is empty, it pushes the next callback from the queue onto the stack. Microtasks (Promises) have a separate, higher-priority queue that is drained completely before the next macrotask callback runs.</p>

      <h3>Q5: What is the difference between == and ===?</h3>
      <p><code>==</code> performs type coercion before comparing. <code>===</code> checks both value and type without coercion. Always use <code>===</code>. Examples of <code>==</code> surprises: <code>0 == false</code> (true), <code>'' == false</code> (true), <code>null == undefined</code> (true).</p>

      <h2>Functions & Scope</h2>

      <h3>Q6: What is the difference between function declarations and function expressions?</h3>
      <p>Function declarations (<code>function foo() {}</code>) are fully hoisted \u2014 you can call them before they appear in code. Function expressions (<code>const foo = function() {}</code>) are not available before their line. Arrow functions are always expressions. In modern code, prefer arrow functions for callbacks and regular functions for methods that need their own <code>this</code>.</p>

      <h3>Q7: What does the 'this' keyword refer to?</h3>
      <p><code>this</code> refers to the execution context. In a regular function, <code>this</code> is determined at call time \u2014 it's the object before the dot. In an arrow function, <code>this</code> is lexically bound (inherited from the enclosing scope at definition time). <code>this</code> inside a class method refers to the class instance. In strict mode global code, <code>this</code> is undefined.</p>

      <h3>Q8: What is the difference between call, apply, and bind?</h3>
      <p>All three set the value of <code>this</code> explicitly. <code>call(thisArg, arg1, arg2)</code> invokes the function immediately. <code>apply(thisArg, [args])</code> invokes immediately but passes args as an array. <code>bind(thisArg)</code> returns a new function with <code>this</code> permanently set \u2014 useful for event handlers and callbacks.</p>

      <h2>Async JavaScript</h2>

      <h3>Q9: What is a Promise? What are its states?</h3>
      <p>A Promise represents an asynchronous operation that will eventually produce a value. States: <strong>Pending</strong> (initial), <strong>Fulfilled</strong> (resolved with a value), <strong>Rejected</strong> (failed with a reason). Promises are consumed with <code>.then()</code> for success, <code>.catch()</code> for errors, and <code>.finally()</code> for cleanup regardless of outcome.</p>

      <h3>Q10: What is async/await and how does it differ from Promises?</h3>
      <p><code>async/await</code> is syntactic sugar over Promises that makes async code read like synchronous code. An <code>async</code> function always returns a Promise. <code>await</code> pauses execution until the Promise resolves. Error handling uses try/catch instead of .catch(). Under the hood, they are identical \u2014 async/await compiles to Promise chains.</p>

      <h2>ES6+ Features</h2>

      <h3>Q11: What is destructuring?</h3>
      <p>Destructuring extracts values from arrays or properties from objects into distinct variables.</p>
      <pre><code>// Object destructuring
const { name, age } = user;

// Array destructuring
const [first, second] = numbers;

// With defaults
const { role = 'user' } = options;</code></pre>

      <h3>Q12: What is the spread operator and rest parameters?</h3>
      <p>Both use <code>...</code>. The spread operator expands iterables: <code>const merged = [...arr1, ...arr2]</code>. Rest parameters collect remaining function arguments: <code>function sum(...nums)</code>. Same syntax, opposite direction \u2014 spread expands, rest collects.</p>

      <h2>Prototype & OOP</h2>

      <h3>Q13: What is the prototype chain?</h3>
      <p>Every JavaScript object has a <code>[[Prototype]]</code> link to another object. When you access a property, JavaScript first looks on the object itself, then walks up the prototype chain until it finds it or reaches <code>null</code>. This is the mechanism behind inheritance in JavaScript \u2014 classes are syntactic sugar over prototype-based inheritance.</p>

      <h2>Build the Skills These Questions Test</h2>
      <p>Understanding these concepts deeply requires practice \u2014 not memorization. The <a href="/courses/ultimate-javascript-masterclass">free JavaScript Masterclass on SkillValix</a> covers all of these topics in depth: closures, async/await, the event loop, prototypes, and ES6+ features. Completing it gives you both the knowledge and a verified certificate to prove it.</p>
      <p>To get real interview experience, join a <a href="/hackathons">SkillValix hackathon</a> \u2014 building a real project under time pressure is the single best way to make these concepts stick.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q: Which JavaScript topics are most commonly asked in fresher interviews in India?</strong><br/>
      Closures, hoisting, var/let/const differences, the event loop, Promises, and array methods (map, filter, reduce) are asked in nearly every JavaScript interview for freshers in India. Know these inside out.</p>

      <p><strong>Q: How should I prepare for a JavaScript interview in 2 weeks?</strong><br/>
      Day 1\u20135: Core concepts (closures, hoisting, this, prototype). Day 6\u201310: Async JavaScript (Promises, async/await, event loop). Day 11\u201314: Build 2 small projects from scratch and do mock interviews explaining your code.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-08T10:00:00+05:30",
    modifiedDate: "2026-04-08T10:00:00+05:30",
    date: "April 8, 2026",
    readTime: "15 min read",
    wordCount: 1480,
    category: "JavaScript",
    tags: ["JavaScript Interview", "JS Interview Questions", "JavaScript 2026", "Fresher Interview", "Coding Interview", "JavaScript Concepts"],
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "JavaScript code on screen with interview preparation notes on desk",
    canonicalUrl: "https://www.skillvalix.com/blog/javascript-interview-questions-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Master every concept covered in these interview questions \u2014 free with a verifiable certificate."
    }
  },
  {
    id: "python-for-data-science-beginners-2026",
    title: "Python for Data Science: Beginner Guide 2026 (Free Resources Included)",
    metaTitle: "Python for Data Science Beginners 2026 \u2013 Free Guide | SkillValix",
    metaDescription: "Learn Python for Data Science from scratch in 2026. Covers NumPy, Pandas, data visualization, and machine learning basics \u2014 with free learning resources and a step-by-step roadmap for beginners.",
    keywords: [
      "Python for data science beginners",
      "learn Python for data science 2026",
      "Python data science roadmap",
      "Python machine learning beginners",
      "data science Python tutorial",
      "Python AI beginners India",
      "learn data science free India",
      "Python NumPy Pandas tutorial"
    ],
    excerpt: "Python is the language of data science. This beginner guide shows you exactly what to learn, in what order, and where to get the foundational Python skills you need before diving into data science libraries.",
    content: `
      <h2>Why Python Is the Language of Data Science</h2>
      <p>In 2026, Python runs the AI revolution. Every major machine learning framework \u2014 TensorFlow, PyTorch, scikit-learn \u2014 is written in or for Python. Every data science team in India uses Python. And Python has the most beginner-friendly syntax of any language, which is why it's the universal starting point for aspiring data scientists regardless of their background.</p>
      <p>But here's the trap beginners fall into: jumping straight into NumPy and machine learning before mastering Python fundamentals. This guide gives you the correct sequence.</p>

      <h2>Step 1: Python Fundamentals (Before Anything Else)</h2>
      <p>Before you touch a single data science library, you need to be comfortable with core Python. If you try to learn Pandas without understanding Python dictionaries, you'll be lost constantly.</p>
      <p>Python fundamentals you must know first:</p>
      <ul>
        <li><strong>Variables and data types:</strong> int, float, str, bool, None</li>
        <li><strong>Lists and dictionaries:</strong> The two most used data structures in data science</li>
        <li><strong>Loops and conditionals:</strong> for loops, while loops, if/elif/else</li>
        <li><strong>Functions:</strong> Defining, calling, parameters, return values, lambda functions</li>
        <li><strong>File I/O:</strong> Reading and writing CSV and text files \u2014 essential for data science</li>
        <li><strong>List comprehensions:</strong> The Pythonic way to transform data</li>
        <li><strong>Error handling:</strong> try/except blocks</li>
      </ul>
      <p>Free resource: The <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass on SkillValix</a> covers all of this from scratch with a verifiable certificate on completion. This is your foundation. Don't skip it.</p>

      <h2>Step 2: NumPy \u2014 Numerical Computing</h2>
      <p>NumPy (Numerical Python) is the foundation of all scientific computing in Python. It introduces arrays \u2014 multi-dimensional data structures that are dramatically faster than Python lists for numerical operations.</p>
      <p>Key NumPy concepts:</p>
      <ul>
        <li>Creating arrays: <code>np.array()</code>, <code>np.zeros()</code>, <code>np.ones()</code>, <code>np.arange()</code></li>
        <li>Array operations: element-wise arithmetic, broadcasting</li>
        <li>Indexing and slicing: selecting rows, columns, and subsets</li>
        <li>Statistical functions: <code>np.mean()</code>, <code>np.std()</code>, <code>np.sum()</code></li>
        <li>Reshaping: <code>reshape()</code>, <code>flatten()</code>, <code>transpose()</code></li>
      </ul>

      <h2>Step 3: Pandas \u2014 Data Manipulation</h2>
      <p>Pandas is what data scientists use for 80% of their daily work \u2014 loading, cleaning, transforming, and analyzing tabular data. A DataFrame is Pandas' core structure: a 2D table with labelled rows and columns (essentially a spreadsheet in code).</p>
      <p>Essential Pandas skills:</p>
      <ul>
        <li>Loading data: <code>pd.read_csv()</code>, <code>pd.read_excel()</code></li>
        <li>Exploring data: <code>.head()</code>, <code>.info()</code>, <code>.describe()</code></li>
        <li>Selecting data: <code>loc[]</code> (label-based), <code>iloc[]</code> (index-based)</li>
        <li>Filtering rows: boolean indexing</li>
        <li>Handling missing values: <code>.dropna()</code>, <code>.fillna()</code></li>
        <li>Grouping and aggregating: <code>groupby()</code>, <code>agg()</code></li>
        <li>Merging DataFrames: <code>merge()</code>, <code>concat()</code></li>
      </ul>

      <h2>Step 4: Data Visualization</h2>
      <p>Data scientists communicate findings through visualizations. Two libraries dominate:</p>
      <ul>
        <li><strong>Matplotlib:</strong> The low-level foundation. Gives you full control over every element of a plot.</li>
        <li><strong>Seaborn:</strong> Built on Matplotlib. Creates beautiful statistical plots in 2\u20133 lines of code.</li>
      </ul>

      <h2>Step 5: Machine Learning Basics with scikit-learn</h2>
      <p>Once you're comfortable with NumPy and Pandas, scikit-learn makes it easy to train machine learning models. It provides a consistent API for preprocessing data, splitting train/test sets, training models, and evaluating performance.</p>
      <p>Start with these scikit-learn concepts:</p>
      <ul>
        <li>Train/test split: <code>train_test_split()</code></li>
        <li>Linear Regression: predicting continuous values</li>
        <li>Logistic Regression: binary classification</li>
        <li>Decision Trees and Random Forests</li>
        <li>Model evaluation: accuracy, precision, recall, confusion matrix</li>
      </ul>

      <h2>Build the Foundation with SkillValix</h2>
      <p>The <a href="/courses/ultimate-python-masterclass">free Python course on SkillValix</a> gives you the Python fundamentals you need before data science libraries \u2014 with a verifiable certificate at the end. Combined with the <a href="/courses/basics-of-artificial-intelligence-beginners">free AI & Machine Learning Fundamentals course</a>, you get the conceptual foundation to understand what scikit-learn and TensorFlow are actually doing under the hood.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Do I need a math background to learn Python for data science?</strong><br/>
      Basic statistics (mean, median, standard deviation) and linear algebra basics (matrices, vectors) help, but you don't need advanced mathematics to get started. As you advance into machine learning, you'll naturally encounter the math and can study it contextually.</p>

      <p><strong>Q2: How long does it take to learn Python for data science?</strong><br/>
      Python fundamentals: 2\u20134 weeks with consistent practice. NumPy + Pandas: 3\u20134 weeks. Visualization + ML basics: 4\u20136 weeks. Total: 2\u20134 months to be employable as a junior data analyst.</p>

      <p><strong>Q3: Is Python enough to get a data science job in India?</strong><br/>
      Python is the foundation, but employers also want: SQL (for database queries), data visualization skills, and knowledge of at least one ML framework. The combination of Python + SQL + Tableau/Power BI is enough for most junior data analyst roles in India.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-04-08T11:00:00+05:30",
    modifiedDate: "2026-04-08T11:00:00+05:30",
    date: "April 8, 2026",
    readTime: "12 min read",
    wordCount: 1250,
    category: "Python",
    tags: ["Python Data Science", "Data Science Beginners", "Python Machine Learning", "NumPy Pandas", "AI Python 2026", "Learn Data Science India"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Data science charts and Python code on a computer screen",
    canonicalUrl: "https://www.skillvalix.com/blog/python-for-data-science-beginners-2026",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Learn Python from scratch \u2014 the foundation for data science, AI, and automation. Free with certificate."
    }
  },
  {
    id: "how-to-become-a-web-developer-2026",
    title: "How to Become a Web Developer in 2026: The Complete Roadmap",
    metaTitle: "How to Become a Web Developer in 2026 \u2014 Complete Roadmap | SkillValix",
    metaDescription: "Want to become a web developer in 2026? This complete step-by-step roadmap covers HTML, CSS, JavaScript, React, backend, and how to land your first job \u2014 even without a degree.",
    keywords: [
      "how to become a web developer",
      "web developer roadmap 2026",
      "become a web developer without degree",
      "web development career 2026",
      "learn web development free",
      "frontend developer roadmap",
      "web developer salary India",
      "how to get web developer job",
      "full stack developer roadmap",
      "web development for beginners 2026"
    ],
    excerpt: "Web development is one of the most in-demand and highest-paying careers in 2026. Here is the exact step-by-step roadmap to go from zero to job-ready \u2014 no degree required.",
    content: `
      <h2>Why Web Development is the Best Career to Start in 2026</h2>
      <p>Web developers are among the most in-demand professionals in India and globally. The average fresher web developer salary in India ranges from \u20B93.5 LPA to \u20B97 LPA, with experienced developers earning \u20B915\u201340 LPA and above. Unlike many careers, web development is 100% skill-based \u2014 no degree, no college brand, no entrance exam. What matters is what you can build.</p>
      <p>This roadmap gives you the exact sequence of skills to learn, in the correct order, with free resources for each step.</p>

      <h2>Step 1: Master HTML \u2014 The Foundation (2\u20133 Weeks)</h2>
      <p>HTML (HyperText Markup Language) is the skeleton of every webpage. Every web developer starts here. There are no shortcuts. You must understand HTML before touching CSS or JavaScript.</p>
      <p>What to learn in HTML:</p>
      <ul>
        <li><strong>Document structure:</strong> <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code></li>
        <li><strong>Text elements:</strong> Headings (h1\u2013h6), paragraphs, lists, links, images</li>
        <li><strong>Semantic HTML5 tags:</strong> <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;nav&gt;</code></li>
        <li><strong>Forms:</strong> Input types, validation attributes, labels, buttons</li>
        <li><strong>Tables and media:</strong> Tables, video, audio, iframes</li>
        <li><strong>Accessibility basics:</strong> alt text, aria-label, semantic structure</li>
      </ul>
      <p>Free resource: The <a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass on SkillValix</a> covers all of this from scratch with a verifiable certificate.</p>

      <h2>Step 2: Learn CSS \u2014 Make It Look Good (3\u20134 Weeks)</h2>
      <p>CSS (Cascading Style Sheets) controls the visual presentation of your HTML. This is where web development gets creative. Modern CSS is powerful \u2014 you can build stunning, responsive layouts without a single line of JavaScript.</p>
      <p>Essential CSS skills:</p>
      <ul>
        <li><strong>Selectors and specificity:</strong> class, id, element, pseudo-class selectors</li>
        <li><strong>The box model:</strong> margin, padding, border, content \u2014 the foundation of all layout</li>
        <li><strong>Flexbox:</strong> One-dimensional layouts \u2014 navbars, card rows, centering</li>
        <li><strong>CSS Grid:</strong> Two-dimensional layouts \u2014 full page structures, card grids</li>
        <li><strong>Responsive design:</strong> Media queries, mobile-first approach, viewport units</li>
        <li><strong>CSS variables:</strong> <code>--primary-color</code> for consistent, maintainable styles</li>
        <li><strong>Transitions and animations:</strong> Smooth hover effects and micro-interactions</li>
      </ul>
      <p>Free resource: The <a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro course on SkillValix</a> takes you from your first selector to advanced Grid layouts.</p>

      <h2>Step 3: Master JavaScript \u2014 Add Behaviour (4\u20136 Weeks)</h2>
      <p>JavaScript is what makes websites interactive. Forms that validate, menus that open, content that loads without refreshing \u2014 all JavaScript. It is the most important language in web development and one of the most versatile programming languages ever created.</p>
      <p>JavaScript fundamentals to master:</p>
      <ul>
        <li>Variables: <code>let</code>, <code>const</code>, data types, type coercion</li>
        <li>Functions: declarations, expressions, arrow functions, callbacks</li>
        <li>Arrays and objects: methods, destructuring, spread operator</li>
        <li>DOM manipulation: <code>querySelector</code>, <code>addEventListener</code>, <code>classList</code></li>
        <li>Async JavaScript: Promises, <code>async/await</code>, <code>fetch()</code> API</li>
        <li>ES6+ features: modules, template literals, optional chaining</li>
        <li>Error handling: try/catch, error types</li>
      </ul>
      <p>At this point \u2014 with HTML, CSS, and JavaScript \u2014 you can build complete static websites and apply for junior frontend roles or internships. Build 2\u20133 projects (a portfolio site, a to-do app, a weather app using a public API) and put them on GitHub.</p>

      <h2>Step 4: Learn React \u2014 The Industry Standard (4\u20135 Weeks)</h2>
      <p>React is used by 40%+ of all web applications globally. Every major tech company in India \u2014 Flipkart, Swiggy, Zomato, Razorpay \u2014 uses React. Learning React makes you dramatically more employable as a frontend developer.</p>
      <p>Core React concepts:</p>
      <ul>
        <li><strong>JSX:</strong> HTML-like syntax inside JavaScript</li>
        <li><strong>Components:</strong> Functional components, props, component composition</li>
        <li><strong>State management:</strong> <code>useState</code>, <code>useEffect</code>, <code>useContext</code></li>
        <li><strong>React Router:</strong> Client-side routing for single-page applications</li>
        <li><strong>Fetching data:</strong> API calls with <code>fetch</code> or Axios in useEffect</li>
        <li><strong>Forms in React:</strong> Controlled inputs, form validation</li>
      </ul>
      <p>Build a full React project \u2014 a multi-page app with routing, API integration, and state management. This is your portfolio centrepiece.</p>

      <h2>Step 5: Backend Basics \u2014 Node.js and Express (3\u20134 Weeks)</h2>
      <p>To become a full-stack developer \u2014 which pays significantly more \u2014 you need backend knowledge. Node.js lets you run JavaScript on the server, and Express is the most popular framework for building APIs in Node.</p>
      <p>Backend skills to learn:</p>
      <ul>
        <li>Node.js fundamentals: modules, npm, file system</li>
        <li>Express: routing, middleware, request/response handling</li>
        <li>REST APIs: GET, POST, PUT, DELETE endpoints</li>
        <li>MongoDB: document-based database, CRUD operations with Mongoose</li>
        <li>Authentication: JWT tokens, bcrypt password hashing</li>
        <li>Environment variables and .env files</li>
        <li>Deploying to Vercel or Render</li>
      </ul>

      <h2>Step 6: Build Projects and Create Your Portfolio</h2>
      <p>Projects are the most important part of your web development journey. Recruiters spend 10 seconds on your resume \u2014 but they spend 5 minutes on your portfolio. Here are the projects every junior developer should have:</p>
      <ul>
        <li><strong>Personal portfolio website</strong> \u2014 Showcases your skills, projects, and contact info</li>
        <li><strong>Full-stack CRUD app</strong> \u2014 A note-taking app, task manager, or blog with user authentication</li>
        <li><strong>API integration project</strong> \u2014 A weather app, currency converter, or movie database using a public API</li>
        <li><strong>E-commerce or booking UI clone</strong> \u2014 Demonstrates your ability to build complex, real-world interfaces</li>
      </ul>
      <p>Host all projects on GitHub with clear README files. Deploy them live (Vercel for frontend, Render for backend) so recruiters can see them working.</p>

      <h2>Step 7: Apply for Jobs and Freelance Projects</h2>
      <p>Once you have 3 projects live and your fundamentals solid, start applying. Here is the realistic timeline for landing your first role:</p>
      <ul>
        <li><strong>Month 1\u20132:</strong> HTML, CSS, basic JavaScript</li>
        <li><strong>Month 3\u20134:</strong> Advanced JavaScript, React</li>
        <li><strong>Month 5\u20136:</strong> Node.js/Express, MongoDB, full-stack project</li>
        <li><strong>Month 6\u20138:</strong> Actively applying, building portfolio, doing mock interviews</li>
      </ul>
      <p>Where to find jobs: LinkedIn Jobs, Naukri, Internshala (for internships), AngelList for startups, and direct applications to companies you admire. For freelancing, platforms like Toptal, Upwork, and Fiverr are starting points while you build your reputation.</p>

      <h2>Do You Need a Computer Science Degree to Become a Web Developer?</h2>
      <p>No \u2014 and this is one of the most liberating facts about web development. Employers hire web developers based on their portfolio and what they can build, not their degrees. Many of India's top frontend and full-stack developers are self-taught. A strong GitHub profile with deployed projects is worth more than most college degrees in this field.</p>
      <p>That said, if you want to move into backend engineering, system design, or machine learning later, a CS foundation helps. But for web development specifically, skills and portfolio beat credentials every time.</p>

      <h2>Free Web Development Courses on SkillValix</h2>
      <p>All the courses you need for this roadmap are available free on SkillValix, each ending with a verifiable certificate:</p>
      <ul>
        <li><a href="/courses/ultimate-html-masterclass">Ultimate HTML Masterclass</a> \u2014 Master semantic HTML5 from scratch</li>
        <li><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">CSS for Beginners: Zero to Pro</a> \u2014 Flexbox, Grid, animations, responsive design</li>
        <li><a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass</a> \u2014 Full JS from variables to async/await</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: How long does it take to become a web developer from scratch?</strong><br/>
      With consistent daily practice of 2\u20133 hours, most people reach junior job-ready level in 6\u20139 months. If you study full-time (6\u20138 hours per day), you can compress this to 3\u20134 months. The key variable is not time \u2014 it is the quality and quantity of projects you build along the way.</p>

      <p><strong>Q2: What is the salary of a web developer in India in 2026?</strong><br/>
      Junior web developer: \u20B93\u20136 LPA. Mid-level (2\u20134 years experience): \u20B98\u201318 LPA. Senior/full-stack (5+ years): \u20B920\u201345 LPA. React and Node.js skills push salaries to the higher end. Freelancing can earn \u20B950,000\u2013\u20B93,00,000+ per month for experienced developers with good clients.</p>

      <p><strong>Q3: Should I learn frontend or full-stack first?</strong><br/>
      Always start with frontend (HTML, CSS, JavaScript, React). It is faster to see results, more beginner-friendly, and gives you the visual feedback that keeps you motivated. Once you are comfortable with React, adding Node.js and MongoDB takes 4\u20136 additional weeks. Full-stack knowledge nearly doubles your job opportunities and salary potential.</p>

      <p><strong>Q4: Is web development still in demand in 2026?</strong><br/>
      Yes \u2014 more than ever. Every business needs a web presence. AI tools like GitHub Copilot assist developers but cannot replace them \u2014 they require a developer who understands the code they generate. The rise of AI has actually increased demand for developers who understand both code AND AI tools. Web development remains one of the most secure and high-paying technology careers through at least 2030.</p>
    `,
    author: "Arjun Mehta",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-01T09:00:00+05:30",
    modifiedDate: "2026-05-01T09:00:00+05:30",
    date: "May 1, 2026",
    readTime: "14 min read",
    wordCount: 1540,
    category: "Career",
    tags: ["Web Development Career", "Web Developer Roadmap", "Learn Web Development", "Frontend Developer", "Full Stack Developer", "Web Developer Salary India", "Coding Career 2026"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer coding on laptop with HTML CSS JavaScript code on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/how-to-become-a-web-developer-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Master the most critical skill in web development \u2014 JavaScript \u2014 for free with a verifiable certificate."
    }
  },
  {
    id: "best-programming-languages-to-learn-2026",
    title: "Best Programming Languages to Learn in 2026 (Ranked by Jobs & Salary)",
    metaTitle: "Best Programming Languages to Learn in 2026 \u2014 Ranked | SkillValix",
    metaDescription: "Which programming language should you learn in 2026? We rank the top languages by job demand, average salary, and learning curve \u2014 so you can make the right choice for your career.",
    keywords: [
      "best programming languages to learn 2026",
      "which programming language to learn",
      "most in demand programming languages 2026",
      "programming language for job 2026",
      "best coding language for beginners",
      "JavaScript vs Python 2026",
      "programming language salary India",
      "top programming languages for jobs India"
    ],
    excerpt: "JavaScript, Python, Java, Go, Rust \u2014 with so many languages, which one should you actually learn in 2026? We rank the top programming languages by job demand, salary, and learning curve.",
    content: `
      <h2>The Most Important Decision a Beginner Makes</h2>
      <p>Choosing your first programming language is the most impactful decision you will make as a beginner \u2014 not because some languages are impossibly hard, but because each one opens a different door. Python gets you into data science and AI. JavaScript gets you into web and mobile development. Java gets you into enterprise software and Android. The right choice depends on where you want to go.</p>
      <p>This guide ranks the top programming languages by three factors that actually matter: job demand in India and globally, average salary, and realistic learning curve for a beginner.</p>

      <h2>1. JavaScript \u2014 Best for Web Development & Highest Job Volume</h2>
      <p><strong>Best for:</strong> Web development (frontend + backend), mobile apps (React Native), serverless functions</p>
      <p><strong>Average salary in India:</strong> \u20B95\u201330 LPA depending on experience and framework</p>
      <p><strong>Learning curve:</strong> Medium \u2014 easy to start, deep to master</p>
      <p>JavaScript is the only language that runs natively in web browsers \u2014 which means every website on the internet uses it. It also runs on servers (Node.js), mobile (React Native), and desktop (Electron). The job volume for JavaScript developers is the highest of any language in India on Naukri, LinkedIn, and Instahyre.</p>
      <p>In 2026, knowing JavaScript with React (frontend) and Node.js (backend) makes you a full-stack developer \u2014 one of the most in-demand and versatile roles in tech. The learning path is well-documented, free resources are abundant, and the community is enormous.</p>
      <p><strong>Learn it if:</strong> You want to build websites, web apps, or mobile apps, or want the most job opportunities as a fresher.</p>
      <p>Free resource: <a href="/courses/ultimate-javascript-masterclass">Ultimate JavaScript Masterclass on SkillValix</a></p>

      <h2>2. Python \u2014 Best for AI, Data Science & Automation</h2>
      <p><strong>Best for:</strong> Data science, machine learning, AI, automation, scripting, web APIs (Django/FastAPI)</p>
      <p><strong>Average salary in India:</strong> \u20B94\u201335 LPA (data science roles pay significantly more)</p>
      <p><strong>Learning curve:</strong> Low \u2014 the most beginner-friendly syntax of any major language</p>
      <p>Python's dominance in AI and machine learning is absolute. Every major ML framework \u2014 TensorFlow, PyTorch, scikit-learn, Hugging Face \u2014 is Python-first. As AI transforms every industry in 2026, Python skills are becoming a requirement in roles far beyond traditional software engineering \u2014 data analysts, researchers, product managers, and even finance professionals are learning Python.</p>
      <p>Python also has the simplest, most readable syntax of any language \u2014 which makes it the best first language for complete beginners. You write less code to do more, and error messages are clear and actionable.</p>
      <p><strong>Learn it if:</strong> You want to work in AI, data science, automation, or need a beginner-friendly first language.</p>
      <p>Free resource: <a href="/courses/ultimate-python-masterclass">Ultimate Python Masterclass on SkillValix</a></p>

      <h2>3. Java \u2014 Best for Enterprise Software & Android</h2>
      <p><strong>Best for:</strong> Enterprise backend systems, Android development, large-scale distributed systems</p>
      <p><strong>Average salary in India:</strong> \u20B95\u201340 LPA (senior Java architects command very high salaries)</p>
      <p><strong>Learning curve:</strong> High \u2014 strict typing and verbose syntax</p>
      <p>Java has powered enterprise software for 30 years \u2014 and it still does. BFSI (Banking, Financial Services, Insurance) companies, large enterprises, and MNCs like TCS, Infosys, Wipro, and IBM hire Java developers at massive scale. Android development (though Kotlin is now preferred, Java remains widely used) also drives Java demand.</p>
      <p>Java is more verbose and has a steeper learning curve than Python or JavaScript \u2014 but it teaches you strong software engineering principles (OOP, design patterns, type systems) that transfer to every other language. Java developers are reliably employed and command strong salaries at mid-to-senior levels.</p>
      <p><strong>Learn it if:</strong> You want to work at large companies, in enterprise banking/insurance software, or want Android development.</p>

      <h2>4. SQL \u2014 The Most Underrated Essential Skill</h2>
      <p><strong>Best for:</strong> Data analysis, backend development, business intelligence, any role that touches data</p>
      <p><strong>Average salary boost:</strong> SQL adds \u20B91\u20135 LPA to any role that uses data</p>
      <p><strong>Learning curve:</strong> Very low \u2014 most basics learnable in a week</p>
      <p>SQL is not a general-purpose programming language \u2014 it is a query language for databases. But it is arguably the most universally useful technical skill of all. Every company stores data in databases. Every data analyst, backend developer, business analyst, and product manager who touches data uses SQL daily.</p>
      <p>SQL is often overlooked by beginners in favour of flashier languages \u2014 which is a mistake. Being SQL-proficient sets you apart in job applications, is learnable in 2\u20134 weeks, and applies to virtually every tech role.</p>
      <p><strong>Learn it if:</strong> You want any role that involves data \u2014 which is basically every tech role.</p>

      <h2>5. TypeScript \u2014 The Professional JavaScript</h2>
      <p><strong>Best for:</strong> Large-scale web application development, teams, enterprise React/Node.js projects</p>
      <p><strong>Average salary:</strong> TypeScript developers earn 15\u201325% more than plain JavaScript developers</p>
      <p><strong>Learning curve:</strong> Low for JavaScript developers \u2014 TypeScript is a superset of JS</p>
      <p>TypeScript adds optional static typing to JavaScript. In 2026, every major React codebase, Node.js backend, and Next.js application at a serious company uses TypeScript. It catches bugs at compile time that JavaScript would only catch at runtime, makes large codebases maintainable, and dramatically improves IDE autocomplete and error detection.</p>
      <p>If you already know JavaScript, adding TypeScript takes 1\u20132 weeks and makes you a significantly more attractive candidate to companies with mature engineering teams.</p>
      <p><strong>Learn it if:</strong> You know JavaScript and want to work at companies with senior engineering teams or on large codebases.</p>

      <h2>6. Go (Golang) \u2014 Best for High-Performance Backend</h2>
      <p><strong>Best for:</strong> High-performance APIs, microservices, cloud infrastructure, DevOps tools</p>
      <p><strong>Average salary in India:</strong> \u20B915\u201350 LPA (Go is a specialist skill with premium salaries)</p>
      <p><strong>Learning curve:</strong> Medium \u2014 simpler than Java, more explicit than Python</p>
      <p>Go was built by Google for high-performance backend systems. It compiles to machine code (fast as C), has built-in concurrency primitives (goroutines), and produces small, single-binary executables. Companies like Google, Uber, Cloudflare, and Razorpay use Go for their most performance-critical services.</p>
      <p>Go is not a first language \u2014 learn Python or JavaScript first. But for developers who want to specialise in backend infrastructure, DevOps, or high-performance microservices, Go is the most valuable specialist skill with the highest salary premium in 2026.</p>
      <p><strong>Learn it if:</strong> You have 1\u20132 years of experience and want to specialise in backend infrastructure or cloud systems.</p>

      <h2>The Decision Framework: Which Language Should YOU Learn?</h2>
      <ul>
        <li><strong>Complete beginner, want maximum job opportunities:</strong> JavaScript</li>
        <li><strong>Complete beginner, interested in AI or data:</strong> Python</li>
        <li><strong>Want to work at large Indian enterprises or MNCs:</strong> Java</li>
        <li><strong>Already know JavaScript, want a salary bump:</strong> TypeScript</li>
        <li><strong>Want to work in data analysis without full engineering:</strong> SQL + Python</li>
        <li><strong>Experienced developer, want specialist backend premium:</strong> Go</li>
      </ul>
      <p>One important principle: master one language deeply before adding a second. A developer who knows JavaScript at a senior level is far more employable than one who knows six languages at a beginner level. Depth beats breadth \u2014 especially for your first two years.</p>

      <h2>What About Rust, Kotlin, Swift, and PHP?</h2>
      <p>Rust is excellent for systems programming and memory safety but has a very steep learning curve and limited job volume in India. Kotlin is preferred for new Android apps but Java remains dominant. Swift is essential for iOS/macOS development. PHP powers WordPress sites but has declining relevance for new projects. These are all valuable \u2014 but none of them are the right first choice for a beginner targeting maximum career impact in 2026.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Should I learn Python or JavaScript first?</strong><br/>
      Both are excellent choices. If you want to build websites or apps \u2014 choose JavaScript. If you want to work with data, AI, or automation \u2014 choose Python. Both are beginner-friendly and have strong job markets. The single biggest mistake is spending weeks unable to decide. Pick one and start today.</p>

      <p><strong>Q2: Is Java still worth learning in 2026?</strong><br/>
      Yes, absolutely. Java's job volume in India is enormous \u2014 particularly in BFSI, enterprise software, and large IT companies. Java developers with Spring Boot skills are consistently in demand and well-paid. Kotlin is preferred for new Android development, but Java's enterprise dominance makes it a sound career choice.</p>

      <p><strong>Q3: How many programming languages should I know?</strong><br/>
      For job applications: master one language and know one secondary language. For senior roles: typically 2\u20133 languages well, with familiarity in 2\u20133 others. The goal is always mastery of at least one language \u2014 a junior who knows JavaScript deeply will outcompete one who knows JavaScript, Python, Java, and Go superficially every time.</p>
    `,
    author: "Neha Sharma",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-02T09:00:00+05:30",
    modifiedDate: "2026-05-02T09:00:00+05:30",
    date: "May 2, 2026",
    readTime: "13 min read",
    wordCount: 1380,
    category: "Career",
    tags: ["Best Programming Languages 2026", "JavaScript vs Python", "Learn to Code", "Coding Career India", "Programming for Beginners", "Web Development Career", "Data Science Career"],
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Multiple programming language logos on a screen representing coding language choices",
    canonicalUrl: "https://www.skillvalix.com/blog/best-programming-languages-to-learn-2026",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Learn the #2 most important language for 2026 \u2014 free with a verifiable certificate."
    }
  },
  {
    id: "free-online-courses-with-certificate-india-2026",
    title: "Free Online Courses with Certificate in India (2026) \u2014 Verified & Recognised",
    metaTitle: "Free Online Courses with Certificate India 2026 \u2014 Verified | SkillValix",
    metaDescription: "Looking for free online courses with certificates in India for 2026? Discover the best free certified courses in web development, Python, AI, data science, and more \u2014 recognised by employers.",
    keywords: [
      "free online courses with certificate India 2026",
      "free certification courses India",
      "free online courses with certificate",
      "best free online courses India",
      "free coding courses with certificate",
      "free python course certificate India",
      "online certificate courses for jobs India",
      "free web development course certificate",
      "SkillValix free courses",
      "learn online free certificate 2026"
    ],
    excerpt: "Free online courses with verifiable certificates are one of the fastest ways to upskill and prove your skills to employers in 2026. Here are the best options in India \u2014 no fees, no hidden costs.",
    content: `
      <h2>Why Certificates from Free Courses Matter in 2026</h2>
      <p>The certificate itself is not what matters \u2014 the skills behind it are. But a verifiable certificate from a reputable platform serves as proof of those skills to recruiters who receive hundreds of applications. In 2026, Indian employers \u2014 from startups to MNCs \u2014 actively look for candidates with demonstrable, self-directed learning through online platforms. A verified certificate on your LinkedIn or resume is a credibility signal that costs you nothing except time and effort.</p>
      <p>This guide covers the best free certified courses in India in 2026, what skills they teach, and who should take them.</p>

      <h2>Free Courses on SkillValix (With Verifiable Certificates)</h2>
      <p>SkillValix offers completely free courses across programming, web development, AI, and data science \u2014 all ending with a verifiable certificate that can be shared on LinkedIn and included on your resume. Unlike many platforms that offer free course content but charge for the certificate, SkillValix certificates are completely free.</p>

      <h3>1. Ultimate JavaScript Masterclass \u2014 Free with Certificate</h3>
      <p>JavaScript is the most in-demand programming language for web development jobs. This course takes you from zero to proficient: variables, functions, DOM manipulation, arrays, objects, closures, Promises, async/await, and ES6+ features. Ideal for anyone who wants to become a frontend or full-stack developer.</p>
      <p><strong>Duration:</strong> 8\u201312 hours of content | <strong>Certificate:</strong> Verifiable, shareable on LinkedIn</p>
      <p><a href="/courses/ultimate-javascript-masterclass">Enrol free \u2192 Ultimate JavaScript Masterclass</a></p>

      <h3>2. Ultimate Python Masterclass \u2014 Free with Certificate</h3>
      <p>Python is the language of data science, AI, and automation. This course covers Python from the ground up: variables, control flow, functions, data structures, file I/O, error handling, and object-oriented programming. Suitable for complete beginners with no prior coding experience.</p>
      <p><strong>Duration:</strong> 10\u201314 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/ultimate-python-masterclass">Enrol free \u2192 Ultimate Python Masterclass</a></p>

      <h3>3. Ultimate HTML Masterclass \u2014 Free with Certificate</h3>
      <p>HTML is the foundation of every website on the internet. This course covers semantic HTML5, forms, accessibility, multimedia, and document structure \u2014 giving you the solid foundation every web developer needs before learning CSS and JavaScript.</p>
      <p><strong>Duration:</strong> 4\u20136 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/ultimate-html-masterclass">Enrol free \u2192 Ultimate HTML Masterclass</a></p>

      <h3>4. CSS for Beginners: Zero to Pro \u2014 Free with Certificate</h3>
      <p>Learn CSS from first principles: selectors, the box model, Flexbox, CSS Grid, responsive design with media queries, CSS variables, and animations. Build beautiful, responsive web layouts. This is the course that makes your HTML look professional.</p>
      <p><strong>Duration:</strong> 6\u20138 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/css-for-beginners-learn-web-styling-zero-to-pro">Enrol free \u2192 CSS: Zero to Pro</a></p>

      <h3>5. AI & Machine Learning Fundamentals \u2014 Free with Certificate</h3>
      <p>Understand the core concepts behind artificial intelligence and machine learning without advanced mathematics. This course explains neural networks, supervised and unsupervised learning, model evaluation, and real-world AI applications \u2014 giving you the conceptual foundation for deeper ML study.</p>
      <p><strong>Duration:</strong> 5\u20137 hours | <strong>Certificate:</strong> Verifiable, free</p>
      <p><a href="/courses/basics-of-artificial-intelligence-beginners">Enrol free \u2192 AI & ML Fundamentals</a></p>

      <h2>How to Make the Most of Free Online Courses</h2>
      <p>Free courses only create value if you complete them and apply the skills. Here is how to maximise the return from any free course:</p>
      <ul>
        <li><strong>Code along, don't just watch:</strong> Passive watching retains 10% of content. Typing every line of code yourself retains 80%+.</li>
        <li><strong>Build a project after each course:</strong> Apply what you learned in a real mini-project before moving on. Projects are what employers actually evaluate.</li>
        <li><strong>Add your certificate to LinkedIn immediately:</strong> Go to LinkedIn \u2192 Profile \u2192 Add section \u2192 Licenses & Certifications. Include the course name, issuing platform (SkillValix), and credential URL.</li>
        <li><strong>Combine courses into a skill stack:</strong> HTML + CSS + JavaScript gives you frontend skills. Python + AI Fundamentals gives you a data science foundation. Think in stacks, not individual courses.</li>
        <li><strong>Complete the assessment/quiz:</strong> SkillValix certificates require passing a quiz \u2014 this reinforces the concepts and proves genuine understanding rather than passive watching.</li>
      </ul>

      <h2>What Makes a Certificate Valuable to Employers?</h2>
      <p>Not all certificates are equal. Employers look for certificates that indicate real skill, not just course completion. The factors that make an online certificate credible:</p>
      <ul>
        <li><strong>Verifiability:</strong> Can the employer verify it is real? SkillValix certificates have a unique ID and verification URL.</li>
        <li><strong>Assessment-based:</strong> Certificates awarded after passing a quiz or building a project carry more weight than completion-only certificates.</li>
        <li><strong>Relevance:</strong> A JavaScript certificate is valuable for web development roles. A Python certificate is valuable for data science and automation roles. Match certificates to the jobs you are targeting.</li>
        <li><strong>Recency:</strong> 2025\u20132026 certificates signal that your skills are current \u2014 especially important in fast-moving fields like AI and web development.</li>
      </ul>

      <h2>Other Free Certification Platforms in India</h2>
      <p>Beyond SkillValix, these platforms also offer free courses and certificates:</p>
      <ul>
        <li><strong>NPTEL (IIT/IISc):</strong> Government-backed courses with proctored exams. Highly respected by PSUs and large Indian corporates. Subjects: engineering, CS, management.</li>
        <li><strong>Google Digital Garage:</strong> Free digital marketing and data fundamentals courses with Google-branded certificates. Excellent for non-tech roles.</li>
        <li><strong>Microsoft Learn:</strong> Free courses on Azure, Power BI, and Microsoft technologies with Microsoft badges.</li>
        <li><strong>Coursera (Audit mode):</strong> Access course content free by auditing \u2014 certificate requires payment, but the learning is free.</li>
        <li><strong>edX (Audit mode):</strong> Similar to Coursera \u2014 free content, paid certificate.</li>
      </ul>
      <p>For programming and web development specifically, SkillValix's free courses with completely free certificates provide the best combination of quality, relevance, and verifiability for the Indian job market.</p>

      <h2>Building a Resume Around Free Certificates</h2>
      <p>Here is a sample resume skills section built entirely from free certificates:</p>
      <ul>
        <li><strong>Frontend Development:</strong> HTML5, CSS3 (Flexbox, Grid), JavaScript ES6+, React.js \u2014 Certified via SkillValix</li>
        <li><strong>Python Programming:</strong> Variables, functions, OOP, file I/O \u2014 Certified via SkillValix</li>
        <li><strong>AI Fundamentals:</strong> Machine learning concepts, neural networks, model evaluation \u2014 Certified via SkillValix</li>
      </ul>
      <p>This demonstrates initiative, self-directed learning, and current skills \u2014 all from free resources. Pair these with GitHub projects and you have a genuinely competitive profile.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Are free online certificates recognised by employers in India?</strong><br/>
      Yes \u2014 especially from established platforms. SkillValix, Google, Microsoft, and NPTEL certificates are all recognised by Indian employers. The key is that the certificate should be verifiable online. Employers in tech startups in particular actively value self-directed learning shown through online courses.</p>

      <p><strong>Q2: Do I need to pay for a certificate on SkillValix?</strong><br/>
      No. All SkillValix courses and certificates are completely free \u2014 including the certificate. There are no hidden fees, no premium tiers for certificates. You enrol, complete the course, pass the assessment, and get a verifiable certificate at no cost.</p>

      <p><strong>Q3: Which free certificate course is best for getting a job in 2026?</strong><br/>
      For web development jobs: start with HTML \u2192 CSS \u2192 JavaScript (all free on SkillValix). For data science/AI jobs: start with Python \u2192 AI Fundamentals. For any tech job: Python is the most universally applicable. The best certificate is from whichever course builds skills directly relevant to the jobs you are applying for.</p>

      <p><strong>Q4: How long does it take to complete a SkillValix course?</strong><br/>
      Courses range from 4 hours (HTML) to 14 hours (Python). At a pace of 1\u20132 hours per day, you can complete any course in 1\u20132 weeks. Completing all five core courses (HTML, CSS, JavaScript, Python, AI Fundamentals) takes approximately 6\u20138 weeks at a comfortable learning pace.</p>
    `,
    author: "Riya Desai",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-03T09:00:00+05:30",
    modifiedDate: "2026-05-03T09:00:00+05:30",
    date: "May 3, 2026",
    readTime: "11 min read",
    wordCount: 1280,
    category: "Career",
    tags: ["Free Courses India 2026", "Free Certificate Courses", "Online Learning India", "SkillValix Courses", "Learn Online Free", "Coding Certificate India", "Upskill India"],
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Student studying online on laptop with course certificate on screen",
    canonicalUrl: "https://www.skillvalix.com/blog/free-online-courses-with-certificate-india-2026",
    relatedCourse: {
      title: "Ultimate JavaScript Masterclass",
      slug: "ultimate-javascript-masterclass",
      description: "Start your free certified learning journey with the most in-demand skill in tech."
    }
  },
  {
    id: "python-vs-javascript-which-to-learn-first",
    title: "Python vs JavaScript: Which Should You Learn First in 2026?",
    metaTitle: "Python vs JavaScript: Which to Learn First in 2026? | SkillValix",
    metaDescription: "Python or JavaScript \u2014 which programming language should you learn first in 2026? A detailed, honest comparison covering jobs, salary, learning curve, and career paths to help you decide.",
    keywords: [
      "python vs javascript which to learn first",
      "python or javascript for beginners",
      "python vs javascript 2026",
      "best first programming language 2026",
      "python vs javascript salary India",
      "should I learn python or javascript",
      "python vs javascript for jobs",
      "first programming language beginners India"
    ],
    excerpt: "The most common question beginners ask \u2014 should I learn Python or JavaScript first? Here is an honest, detailed comparison covering jobs, salary, learning curve, and career paths.",
    content: `
      <h2>The Question Every Beginner Asks</h2>
      <p>Python and JavaScript are the two most beginner-friendly and job-relevant programming languages in 2026. Both are excellent. Both have massive job markets. Both are free to learn. The problem is that beginners spend weeks (sometimes months) paralysed trying to choose between them \u2014 and every week of indecision is a week you could have spent learning.</p>
      <p>This article gives you a definitive answer based on your specific career goals \u2014 so you can decide today and start tomorrow.</p>

      <h2>The Core Difference in One Sentence</h2>
      <p><strong>JavaScript runs in browsers and builds websites. Python runs on servers and analyses data.</strong></p>
      <p>That is the most important distinction. Everything else follows from this fundamental difference in what each language was designed to do.</p>

      <h2>Learning Curve Comparison</h2>
      <h3>Python Learning Curve: Very Low</h3>
      <p>Python was explicitly designed to be readable. Its syntax is close to plain English \u2014 which means you spend less mental energy decoding syntax and more energy understanding programming concepts.</p>
      <pre><code># Python \u2014 simple, readable
name = "Arjun"
if name == "Arjun":
    print(f"Hello, {name}!")
# Output: Hello, Arjun!</code></pre>
      <p>Python enforces indentation, which forces clean code habits from day one. Error messages are clear and descriptive. The standard library is enormous \u2014 there is a built-in module for almost everything.</p>

      <h3>JavaScript Learning Curve: Medium</h3>
      <p>JavaScript is beginner-friendly but has more quirks than Python. Type coercion, the <code>this</code> keyword, asynchronous programming, and the prototype chain are all concepts that trip beginners up. However, JavaScript's immediate visual feedback (you can open a browser console and run code instantly) is extremely motivating.</p>
      <pre><code>// JavaScript \u2014 slightly more syntax to manage
const name = "Arjun";
if (name === "Arjun") {
  console.log(&#96;Hello, \${name}!&#96;);
}
// Output: Hello, Arjun!</code></pre>
      <p><strong>Verdict: Python has a lower learning curve for complete beginners.</strong></p>

      <h2>Job Market Comparison in India (2026)</h2>
      <h3>JavaScript Jobs</h3>
      <ul>
        <li>Frontend Developer (React, Vue, Angular)</li>
        <li>Full-Stack Developer (React + Node.js)</li>
        <li>Backend Developer (Node.js, Express)</li>
        <li>Mobile Developer (React Native)</li>
        <li>Software Engineer at product startups</li>
      </ul>
      <p>JavaScript has the highest raw job volume of any language in India. On LinkedIn Jobs and Naukri, React developer roles alone number in the thousands at any given time.</p>

      <h3>Python Jobs</h3>
      <ul>
        <li>Data Analyst / Data Scientist</li>
        <li>Machine Learning Engineer</li>
        <li>AI Engineer / MLOps Engineer</li>
        <li>Backend Developer (Django, FastAPI)</li>
        <li>Automation / DevOps Engineer</li>
        <li>Research Engineer</li>
      </ul>
      <p>Python's job market is growing faster than JavaScript's in 2026, driven by the AI boom. Data science and ML roles command higher salaries but often require additional skills (SQL, statistics, domain knowledge).</p>
      <p><strong>Verdict: JavaScript has more total jobs. Python jobs pay more on average and are growing faster.</strong></p>

      <h2>Salary Comparison in India</h2>
      <ul>
        <li><strong>JavaScript developer (fresher):</strong> \u20B93.5\u20136 LPA</li>
        <li><strong>Python developer (fresher):</strong> \u20B93.5\u20136 LPA</li>
        <li><strong>React developer (2\u20133 years):</strong> \u20B98\u201318 LPA</li>
        <li><strong>Data scientist with Python (2\u20133 years):</strong> \u20B912\u201325 LPA</li>
        <li><strong>Senior Full-Stack (JS, 5+ years):</strong> \u20B925\u201345 LPA</li>
        <li><strong>Senior ML Engineer (Python, 5+ years):</strong> \u20B930\u201360 LPA</li>
      </ul>
      <p>At the fresher level, salaries are similar. The divergence happens at mid and senior levels \u2014 Python data science/ML careers tend to pay significantly more at the top end.</p>

      <h2>What Can You Build?</h2>
      <h3>With JavaScript you can build:</h3>
      <ul>
        <li>Any website or web application (frontend)</li>
        <li>REST APIs and backend services (Node.js)</li>
        <li>Mobile apps (React Native)</li>
        <li>Desktop apps (Electron)</li>
        <li>Browser extensions</li>
        <li>Real-time apps (WebSockets, Socket.io)</li>
      </ul>
      <h3>With Python you can build:</h3>
      <ul>
        <li>Data analysis and visualisation scripts</li>
        <li>Machine learning models</li>
        <li>Web APIs (Django, FastAPI)</li>
        <li>Automation scripts (web scraping, file processing)</li>
        <li>AI chatbots and NLP applications</li>
        <li>Scientific simulations</li>
      </ul>

      <h2>The Definitive Decision Guide</h2>
      <p>Answer these questions honestly:</p>
      <ul>
        <li><strong>Do you want to build websites and apps?</strong> \u2192 JavaScript</li>
        <li><strong>Do you want to work with data, AI, or machine learning?</strong> \u2192 Python</li>
        <li><strong>Do you want the most job postings to apply to as a fresher?</strong> \u2192 JavaScript</li>
        <li><strong>Do you want the highest earning potential long-term?</strong> \u2192 Python (data science/ML path)</li>
        <li><strong>Do you want the easiest learning experience?</strong> \u2192 Python</li>
        <li><strong>Do you want to see immediate visual results in the browser?</strong> \u2192 JavaScript</li>
        <li><strong>Do you have no clear preference?</strong> \u2192 JavaScript (most versatile, most jobs)</li>
      </ul>

      <h2>The Answer Most Experts Give</h2>
      <p>If you have no strong preference and just want to start coding and get a job as efficiently as possible: <strong>start with JavaScript</strong>. It has the most job opportunities at the fresher level, you can see your code working in the browser immediately (which is extremely motivating), and the path from zero to employed is faster and more direct for most people.</p>
      <p>If you know you want to work in AI, data science, or research \u2014 or if you are already comfortable with logic and want the cleanest possible first language: <strong>start with Python</strong>.</p>
      <p>Both are available for free with verifiable certificates on SkillValix: <a href="/courses/ultimate-javascript-masterclass">JavaScript Masterclass</a> and <a href="/courses/ultimate-python-masterclass">Python Masterclass</a>.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Q1: Can I learn both Python and JavaScript at the same time?</strong><br/>
      Not recommended for beginners. Learning two languages simultaneously doubles your confusion and halves your progress in each. Master one to a productive level (where you can build real things) before starting the second. The second language always comes faster because you already understand programming concepts.</p>

      <p><strong>Q2: Is Python easier than JavaScript for complete beginners?</strong><br/>
      Yes, marginally. Python's syntax is cleaner, its error messages are clearer, and it has fewer "gotcha" behaviours than JavaScript. But the difference is not dramatic \u2014 both are beginner-friendly. JavaScript has the advantage of immediate browser feedback, which some beginners find more motivating than Python's terminal output.</p>

      <p><strong>Q3: If I learn JavaScript, do I still need to learn Python later?</strong><br/>
      Not necessarily. Many successful developers use JavaScript exclusively for their entire careers. However, if you want to add data science, machine learning, or AI to your skill set later, you will need to learn Python. The good news: once you know JavaScript well, picking up Python takes 2\u20133 weeks.</p>
    `,
    author: "Amit Patel",
    authorUrl: "https://www.skillvalix.com/blog",
    publishedDate: "2026-05-04T09:00:00+05:30",
    modifiedDate: "2026-05-04T09:00:00+05:30",
    date: "May 4, 2026",
    readTime: "12 min read",
    wordCount: 1320,
    category: "Career",
    tags: ["Python vs JavaScript", "Best First Programming Language", "Learn Python", "Learn JavaScript", "Coding for Beginners India", "Programming Career 2026"],
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Python and JavaScript code side by side on a monitor showing comparison",
    canonicalUrl: "https://www.skillvalix.com/blog/python-vs-javascript-which-to-learn-first",
    relatedCourse: {
      title: "Ultimate Python Masterclass",
      slug: "ultimate-python-masterclass",
      description: "Start your Python journey today \u2014 free course with a verifiable certificate."
    }
  }
];

// vite.config.js
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcjs()
  ],
  // ── vite-ssg options (used by `vite-ssg build`) ─────────────
  ssgOptions: {
    script: "async",
    formatting: "minify",
    // Generate a pre-rendered HTML file for every blog post + key static pages
    includedRoutes(paths, routes) {
      const blogRoutes = blogPosts.map((p) => `/blog/${p.id}`);
      const staticRoutes = [
        "/",
        "/blog",
        "/courses",
        "/hackathons",
        "/privacy-policy",
        "/terms",
        "/refund-policy",
        "/cookie-policy",
        "/certification",
        "/free-courses",
        "/campus-ambassador",
        "/host",
        "/verify",
        "/login",
        "/register"
      ];
      return [...staticRoutes, ...blogRoutes];
    },
    // Use onBeforePageRender to inject Helmet-rendered tags into <head>
    onBeforePageRender(route, indexHTML, { getHeadContent }) {
      return indexHTML;
    }
  },
  ssr: {
    noExternal: ["html-encoding-sniffer", "@exodus/bytes"]
  },
  build: {
    // Re-enable module preload for optimal browser prefetching
    modulePreload: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached separately, rarely changes
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // UI icon library — large but static
          "vendor-ui": ["lucide-react"],
          // Auth & state — changes independently of UI
          "vendor-auth": ["@react-oauth/google", "zustand"],
          // HTTP utils
          "vendor-utils": ["axios"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAic3JjL2RhdGEvYmxvZ3MuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFxTa2lsbEh1YlxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiSDpcXFxcU2tpbGxIdWJcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0g6L1NraWxsSHViL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHRhaWx3aW5kY2pzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJztcbmltcG9ydCB7IGJsb2dQb3N0cyB9IGZyb20gJy4vc3JjL2RhdGEvYmxvZ3MuanMnO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHRhaWx3aW5kY2pzKCksXG4gIF0sXG5cbiAgLy8gXHUyNTAwXHUyNTAwIHZpdGUtc3NnIG9wdGlvbnMgKHVzZWQgYnkgYHZpdGUtc3NnIGJ1aWxkYCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIHNzZ09wdGlvbnM6IHtcbiAgICBzY3JpcHQ6ICdhc3luYycsXG4gICAgZm9ybWF0dGluZzogJ21pbmlmeScsXG4gICAgLy8gR2VuZXJhdGUgYSBwcmUtcmVuZGVyZWQgSFRNTCBmaWxlIGZvciBldmVyeSBibG9nIHBvc3QgKyBrZXkgc3RhdGljIHBhZ2VzXG4gICAgaW5jbHVkZWRSb3V0ZXMocGF0aHMsIHJvdXRlcykge1xuICAgICAgY29uc3QgYmxvZ1JvdXRlcyA9IGJsb2dQb3N0cy5tYXAocCA9PiBgL2Jsb2cvJHtwLmlkfWApO1xuICAgICAgY29uc3Qgc3RhdGljUm91dGVzID0gW1xuICAgICAgICAnLycsICcvYmxvZycsICcvY291cnNlcycsICcvaGFja2F0aG9ucycsXG4gICAgICAgICcvcHJpdmFjeS1wb2xpY3knLCAnL3Rlcm1zJywgJy9yZWZ1bmQtcG9saWN5JywgJy9jb29raWUtcG9saWN5JyxcbiAgICAgICAgJy9jZXJ0aWZpY2F0aW9uJywgJy9mcmVlLWNvdXJzZXMnLCAnL2NhbXB1cy1hbWJhc3NhZG9yJyxcbiAgICAgICAgJy9ob3N0JywgJy92ZXJpZnknLCAnL2xvZ2luJywgJy9yZWdpc3RlcicsXG4gICAgICBdO1xuICAgICAgcmV0dXJuIFsuLi5zdGF0aWNSb3V0ZXMsIC4uLmJsb2dSb3V0ZXNdO1xuICAgIH0sXG4gICAgLy8gVXNlIG9uQmVmb3JlUGFnZVJlbmRlciB0byBpbmplY3QgSGVsbWV0LXJlbmRlcmVkIHRhZ3MgaW50byA8aGVhZD5cbiAgICBvbkJlZm9yZVBhZ2VSZW5kZXIocm91dGUsIGluZGV4SFRNTCwgeyBnZXRIZWFkQ29udGVudCB9KSB7XG4gICAgICByZXR1cm4gaW5kZXhIVE1MO1xuICAgIH0sXG4gIH0sXG5cbiAgc3NyOiB7XG4gICAgbm9FeHRlcm5hbDogWydodG1sLWVuY29kaW5nLXNuaWZmZXInLCAnQGV4b2R1cy9ieXRlcyddXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICAvLyBSZS1lbmFibGUgbW9kdWxlIHByZWxvYWQgZm9yIG9wdGltYWwgYnJvd3NlciBwcmVmZXRjaGluZ1xuICAgIG1vZHVsZVByZWxvYWQ6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIENvcmUgUmVhY3QgcnVudGltZSBcdTIwMTQgY2FjaGVkIHNlcGFyYXRlbHksIHJhcmVseSBjaGFuZ2VzXG4gICAgICAgICAgJ3ZlbmRvci1yZWFjdCc6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAvLyBVSSBpY29uIGxpYnJhcnkgXHUyMDE0IGxhcmdlIGJ1dCBzdGF0aWNcbiAgICAgICAgICAndmVuZG9yLXVpJzogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAvLyBBdXRoICYgc3RhdGUgXHUyMDE0IGNoYW5nZXMgaW5kZXBlbmRlbnRseSBvZiBVSVxuICAgICAgICAgICd2ZW5kb3ItYXV0aCc6IFsnQHJlYWN0LW9hdXRoL2dvb2dsZScsICd6dXN0YW5kJ10sXG4gICAgICAgICAgLy8gSFRUUCB1dGlsc1xuICAgICAgICAgICd2ZW5kb3ItdXRpbHMnOiBbJ2F4aW9zJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiSDpcXFxcU2tpbGxIdWJcXFxcZnJvbnRlbmRcXFxcc3JjXFxcXGRhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkg6XFxcXFNraWxsSHViXFxcXGZyb250ZW5kXFxcXHNyY1xcXFxkYXRhXFxcXGJsb2dzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9IOi9Ta2lsbEh1Yi9mcm9udGVuZC9zcmMvZGF0YS9ibG9ncy5qc1wiOy8vIEFsbCBibG9nIHBvc3RzIHdpdGggZnVsbCBTRU8gbWV0YWRhdGFcbi8vIEZpZWxkcyB1c2VkIGZvciBIZWxtZXQgLyBKU09OLUxEIC8gT3BlbiBHcmFwaCAvIFR3aXR0ZXIgQ2FyZFxuZXhwb3J0IGNvbnN0IGJsb2dQb3N0cyA9IFtcbiAge1xuICAgIGlkOiAnbWFzdGVyaW5nLWh0bWw1LXNlbWFudGljLXRhZ3Mtc2VvJyxcbiAgICB0aXRsZTogJ01hc3RlcmluZyBIVE1MNSBpbiAyMDI2OiBXaHkgU2VtYW50aWMgVGFncyBNYXR0ZXIgZm9yIFNFTycsXG4gICAgbWV0YVRpdGxlOiAnTWFzdGVyaW5nIEhUTUw1IGluIDIwMjY6IFdoeSBTZW1hbnRpYyBUYWdzIE1hdHRlciBmb3IgU0VPIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgJ0xlYXJuIGhvdyBIVE1MNSBzZW1hbnRpYyB0YWdzIGxpa2UgPGFydGljbGU+LCA8c2VjdGlvbj4sIGFuZCA8bmF2PiBib29zdCB5b3VyIHNlYXJjaCBlbmdpbmUgcmFua2luZ3MgYW5kIHdlYiBhY2Nlc3NpYmlsaXR5IGluIDIwMjYuIEEgbXVzdC1yZWFkIGZvciBldmVyeSB3ZWIgZGV2ZWxvcGVyLicsXG4gICAga2V5d29yZHM6IFtcbiAgICAgICdIVE1MNSBzZW1hbnRpYyB0YWdzJyxcbiAgICAgICdIVE1MIFNFTycsXG4gICAgICAnc2VtYW50aWMgSFRNTCBmb3IgU0VPJyxcbiAgICAgICd3ZWIgZGV2ZWxvcG1lbnQgMjAyNicsXG4gICAgICAnSFRNTDUgdHV0b3JpYWwnLFxuICAgICAgJ3dlYiBhY2Nlc3NpYmlsaXR5JyxcbiAgICAgICdhcnRpY2xlIHRhZyBIVE1MJyxcbiAgICAgICdzZWN0aW9uIHRhZyBIVE1MJyxcbiAgICBdLFxuICAgIGV4Y2VycHQ6XG4gICAgICAnU2VtYW50aWMgSFRNTDUgdGFncyBsaWtlIDxhcnRpY2xlPiwgPHNlY3Rpb24+LCBhbmQgPG5hdj4gYXJlIG5vIGxvbmdlciBvcHRpb25hbC4gTGVhcm4gaG93IHVzaW5nIHRoZW0gY29ycmVjdGx5IGJvb3N0cyBib3RoIHlvdXIgc2VhcmNoIGVuZ2luZSByYW5raW5ncyBhbmQgd2ViIGFjY2Vzc2liaWxpdHkuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIFNoaWZ0IHRvIE1lYW5pbmdmdWwgTWFya3VwPC9oMj5cbiAgICAgIDxwPkZvciB5ZWFycywgZGV2ZWxvcGVycyByZWxpZWQgaGVhdmlseSBvbiA8Y29kZT4mbHQ7ZGl2Jmd0OzwvY29kZT4gYW5kIDxjb2RlPiZsdDtzcGFuJmd0OzwvY29kZT4gdGFncyB0byBzdHJ1Y3R1cmUgdGhlaXIgd2ViIHBhZ2VzLiBXaGlsZSB0aGlzIHdvcmtlZCBmaW5lIGZvciBzdHlsaW5nLCBpdCBnYXZlIHNlYXJjaCBlbmdpbmVzIGFuZCBzY3JlZW4gcmVhZGVycyB6ZXJvIGNvbnRleHQgYWJvdXQgPGVtPndoYXQ8L2VtPiB0aGUgY29udGVudCBhY3R1YWxseSBtZWFucy4gRW50ZXIgSFRNTDUgc2VtYW50aWMgdGFncyBcdTIwMTQgdGhlIHNpbmdsZSBtb3N0IHVuZGVycmF0ZWQgdG9vbCBmb3IgYm9vc3RpbmcgYm90aCBTRU8gcmFua2luZ3MgYW5kIHdlYiBhY2Nlc3NpYmlsaXR5LjwvcD5cbiAgICAgIDxwPkJ5IHJlcGxhY2luZyBnZW5lcmljIGNvbnRhaW5lcnMgd2l0aCBtZWFuaW5nZnVsIGVsZW1lbnRzLCB5b3UgYXJlIGVzc2VudGlhbGx5IGhhbmRpbmcgR29vZ2xlIGEgbGFiZWxsZWQgbWFwIG9mIHlvdXIgY29udGVudCdzIGhpZXJhcmNoeSBhbmQgaW1wb3J0YW5jZS4gVGhpcyBhcnRpY2xlIGNvdmVycyBldmVyeSBzZW1hbnRpYyB0YWcgdGhhdCBtYXR0ZXJzLCB3aHkgZWFjaCBvbmUgZXhpc3RzLCBhbmQgaG93IHVzaW5nIHRoZW0gY29ycmVjdGx5IHRyYW5zbGF0ZXMgZGlyZWN0bHkgaW50byBiZXR0ZXIgc2VhcmNoIHJhbmtpbmdzLjwvcD5cblxuICAgICAgPGgyPlRoZSBDb21wbGV0ZSBIVE1MNSBTZW1hbnRpYyBUYWcgUmVmZXJlbmNlPC9oMj5cblxuICAgICAgPGgzPiZsdDtoZWFkZXImZ3Q7IGFuZCAmbHQ7Zm9vdGVyJmd0OyBcdTIwMTQgRGVmaW5lIFlvdXIgUGFnZSBCb3VuZGFyaWVzPC9oMz5cbiAgICAgIDxwPlRoZSA8Y29kZT4mbHQ7aGVhZGVyJmd0OzwvY29kZT4gZWxlbWVudCByZXByZXNlbnRzIGludHJvZHVjdG9yeSBjb250ZW50IGZvciBhIHBhZ2Ugb3IgYSBzZWN0aW9uLiBJdCB0eXBpY2FsbHkgY29udGFpbnMgdGhlIGxvZ28sIHByaW1hcnkgbmF2aWdhdGlvbiwgYW5kIGEgaGVhZGxpbmUuIFRoZSA8Y29kZT4mbHQ7Zm9vdGVyJmd0OzwvY29kZT4gaG9sZHMgc2Vjb25kYXJ5IGluZm9ybWF0aW9uIFx1MjAxNCBjb3B5cmlnaHQsIHBvbGljeSBsaW5rcywgYW5kIGNvbnRhY3QgZGV0YWlscy48L3A+XG4gICAgICA8cD5TZWFyY2ggZW5naW5lcyB1c2UgdGhlc2UgdG8gdW5kZXJzdGFuZCB3aGVyZSB5b3VyIHByaW1hcnkgY29udGVudCBiZWdpbnMgYW5kIGVuZHMuIENvbnRlbnQgaW5zaWRlIDxjb2RlPiZsdDtoZWFkZXImZ3Q7PC9jb2RlPiBhbmQgPGNvZGU+Jmx0O2Zvb3RlciZndDs8L2NvZGU+IGlzIHdlaWdodGVkIGxvd2VyIGluIHJlbGV2YW5jZSB0aGFuIGNvbnRlbnQgaW5zaWRlIDxjb2RlPiZsdDttYWluJmd0OzwvY29kZT4gb3IgPGNvZGU+Jmx0O2FydGljbGUmZ3Q7PC9jb2RlPi48L3A+XG4gICAgICA8cHJlPjxjb2RlPiZsdDtoZWFkZXImZ3Q7XG4gICZsdDtuYXYgYXJpYS1sYWJlbD1cIlByaW1hcnkgbmF2aWdhdGlvblwiJmd0O1xuICAgICZsdDthIGhyZWY9XCIvXCImZ3Q7SG9tZSZsdDsvYSZndDtcbiAgICAmbHQ7YSBocmVmPVwiL2NvdXJzZXNcIiZndDtDb3Vyc2VzJmx0Oy9hJmd0O1xuICAgICZsdDthIGhyZWY9XCIvYmxvZ1wiJmd0O0Jsb2cmbHQ7L2EmZ3Q7XG4gICZsdDsvbmF2Jmd0O1xuJmx0Oy9oZWFkZXImZ3Q7PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+Jmx0O21haW4mZ3Q7IFx1MjAxNCBUaGUgQ3Jvd24gSmV3ZWw8L2gzPlxuICAgICAgPHA+VGhlIDxjb2RlPiZsdDttYWluJmd0OzwvY29kZT4gZWxlbWVudCBpcyB0aGUgbW9zdCBjcml0aWNhbCBzZW1hbnRpYyB0YWcgZm9yIFNFTy4gSXQgaWRlbnRpZmllcyB0aGUgZG9taW5hbnQsIHVuaXF1ZSBjb250ZW50IG9mIHRoZSBwYWdlLiBHb29nbGUncyBjcmF3bGVycyBwcmlvcml0aXNlIGNvbnRlbnQgaW5zaWRlIDxjb2RlPiZsdDttYWluJmd0OzwvY29kZT4gYWJvdmUgYWxsIGVsc2Ugd2hlbiBkZXRlcm1pbmluZyByZWxldmFuY2UgYW5kIHJhbmtpbmcuIEV2ZXJ5IHBhZ2UgbXVzdCBoYXZlIGV4YWN0bHkgb25lIDxjb2RlPiZsdDttYWluJmd0OzwvY29kZT4gZWxlbWVudC48L3A+XG4gICAgICA8cHJlPjxjb2RlPiZsdDtib2R5Jmd0O1xuICAmbHQ7aGVhZGVyJmd0Oy4uLiZsdDsvaGVhZGVyJmd0O1xuXG4gICZsdDttYWluJmd0O1xuICAgICZsdDshLS0gVGhpcyBpcyB3aGF0IEdvb2dsZSBjYXJlcyBhYm91dCBtb3N0IC0tJmd0O1xuICAgICZsdDthcnRpY2xlJmd0O1xuICAgICAgJmx0O2gxJmd0O1lvdXIgUHJpbWFyeSBLZXl3b3JkLVJpY2ggSGVhZGluZyZsdDsvaDEmZ3Q7XG4gICAgICAmbHQ7cCZndDtZb3VyIGNvcmUgY29udGVudC4uLiZsdDsvcCZndDtcbiAgICAmbHQ7L2FydGljbGUmZ3Q7XG4gICZsdDsvbWFpbiZndDtcblxuICAmbHQ7Zm9vdGVyJmd0Oy4uLiZsdDsvZm9vdGVyJmd0O1xuJmx0Oy9ib2R5Jmd0OzwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPiZsdDthcnRpY2xlJmd0OyBhbmQgJmx0O3NlY3Rpb24mZ3Q7IFx1MjAxNCBDb250ZW50IEhpZXJhcmNoeTwvaDM+XG4gICAgICA8cD5UaGVzZSB0d28gYXJlIHRoZSBtb3N0IGNvbW1vbmx5IGNvbmZ1c2VkIHNlbWFudGljIHRhZ3MuIEhlcmUgaXMgdGhlIHNpbXBsZSBydWxlOiBhbiA8Y29kZT4mbHQ7YXJ0aWNsZSZndDs8L2NvZGU+IGlzIHNlbGYtY29udGFpbmVkIGNvbnRlbnQgdGhhdCBtYWtlcyBzZW5zZSBvbiBpdHMgb3duIFx1MjAxNCBhIGJsb2cgcG9zdCwgYSBwcm9kdWN0IGNhcmQsIGEgZm9ydW0gcG9zdC4gQSA8Y29kZT4mbHQ7c2VjdGlvbiZndDs8L2NvZGU+IGlzIGEgdGhlbWF0aWMgZ3JvdXBpbmcgb2YgcmVsYXRlZCBjb250ZW50IHdpdGhpbiBhIHBhZ2UgdGhhdCBpcyBOT1Qgc2VsZi1jb250YWluZWQuPC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Vc2UgPGNvZGU+Jmx0O2FydGljbGUmZ3Q7PC9jb2RlPiBmb3I6PC9zdHJvbmc+IEJsb2cgcG9zdHMsIG5ld3MgYXJ0aWNsZXMsIHByb2R1Y3QgbGlzdGluZ3MsIHVzZXIgcmV2aWV3cywgY29tbWVudCBjYXJkcy48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Vc2UgPGNvZGU+Jmx0O3NlY3Rpb24mZ3Q7PC9jb2RlPiBmb3I6PC9zdHJvbmc+IENoYXB0ZXJzIHdpdGhpbiBhbiBhcnRpY2xlLCB0aGVtYXRpYyBncm91cHMgb24gYSBob21lcGFnZSAoaGVybywgZmVhdHVyZXMsIHByaWNpbmcsIHRlc3RpbW9uaWFscykuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TmV2ZXIgdXNlIDxjb2RlPiZsdDtkaXYmZ3Q7PC9jb2RlPiB3aGVuIGVpdGhlciBhcHBsaWVzLjwvc3Ryb25nPiBBIGRpdiBoYXMgbm8gc2VtYW50aWMgbWVhbmluZyBcdTIwMTQgaXQgaXMgaW52aXNpYmxlIHRvIHNlYXJjaCBlbmdpbmVzIGFuZCBzY3JlZW4gcmVhZGVycy48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgzPiZsdDtuYXYmZ3Q7IFx1MjAxNCBTaWduYWwgWW91ciBOYXZpZ2F0aW9uIFN0cnVjdHVyZTwvaDM+XG4gICAgICA8cD5UaGUgPGNvZGU+Jmx0O25hdiZndDs8L2NvZGU+IGVsZW1lbnQgc2hvdWxkIHdyYXAgeW91ciBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgbmF2aWdhdGlvbiBtZW51cy4gVXNpbmcgPGNvZGU+YXJpYS1sYWJlbDwvY29kZT4gb24gbXVsdGlwbGUgPGNvZGU+Jmx0O25hdiZndDs8L2NvZGU+IGVsZW1lbnRzIGhlbHBzIHNjcmVlbiByZWFkZXJzIGFuZCBzZWFyY2ggYm90cyBkaXN0aW5ndWlzaCBiZXR3ZWVuIHlvdXIgaGVhZGVyIG5hdiwgZm9vdGVyIG5hdiwgYW5kIGJyZWFkY3J1bWIgbmF2LjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Jmx0OyEtLSBIZWFkZXIgbmF2aWdhdGlvbiAtLSZndDtcbiZsdDtuYXYgYXJpYS1sYWJlbD1cIlByaW1hcnlcIiZndDsuLi4mbHQ7L25hdiZndDtcblxuJmx0OyEtLSBCcmVhZGNydW1iIC0tJmd0O1xuJmx0O25hdiBhcmlhLWxhYmVsPVwiQnJlYWRjcnVtYlwiJmd0O1xuICAmbHQ7b2wmZ3Q7XG4gICAgJmx0O2xpJmd0OyZsdDthIGhyZWY9XCIvXCImZ3Q7SG9tZSZsdDsvYSZndDsmbHQ7L2xpJmd0O1xuICAgICZsdDtsaSZndDsmbHQ7YSBocmVmPVwiL2Jsb2dcIiZndDtCbG9nJmx0Oy9hJmd0OyZsdDsvbGkmZ3Q7XG4gICAgJmx0O2xpIGFyaWEtY3VycmVudD1cInBhZ2VcIiZndDtDdXJyZW50IEFydGljbGUmbHQ7L2xpJmd0O1xuICAmbHQ7L29sJmd0O1xuJmx0Oy9uYXYmZ3Q7PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+Jmx0O2FzaWRlJmd0OyBcdTIwMTQgU3VwcGxlbWVudGFyeSBDb250ZW50PC9oMz5cbiAgICAgIDxwPlRoZSA8Y29kZT4mbHQ7YXNpZGUmZ3Q7PC9jb2RlPiBlbGVtZW50IG1hcmtzIGNvbnRlbnQgdGhhdCBpcyB0YW5nZW50aWFsbHkgcmVsYXRlZCB0byB0aGUgbWFpbiBjb250ZW50IFx1MjAxNCBzaWRlYmFycywgcHVsbCBxdW90ZXMsIHJlbGF0ZWQgYXJ0aWNsZSBsaXN0cywgYW5kIGFkdmVydGlzZW1lbnQgc2xvdHMuIEdvb2dsZSB0cmVhdHMgY29udGVudCBpbnNpZGUgPGNvZGU+Jmx0O2FzaWRlJmd0OzwvY29kZT4gYXMgc3VwcGxlbWVudGFyeSwgbm90IGNvcmUgXHUyMDE0IHdoaWNoIGlzIGV4YWN0bHkgY29ycmVjdCBmb3Igc2lkZWJhcnMuPC9wPlxuXG4gICAgICA8aDM+Jmx0O2ZpZ3VyZSZndDsgYW5kICZsdDtmaWdjYXB0aW9uJmd0OyBcdTIwMTQgSW1hZ2VzIHdpdGggQ29udGV4dDwvaDM+XG4gICAgICA8cD5XaGVuZXZlciB5b3UgdXNlIGFuIGltYWdlIHRoYXQgaXMgZGlyZWN0bHkgcmVmZXJlbmNlZCBieSB0aGUgc3Vycm91bmRpbmcgdGV4dCwgd3JhcCBpdCBpbiA8Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4gYW5kIGRlc2NyaWJlIGl0IHdpdGggPGNvZGU+Jmx0O2ZpZ2NhcHRpb24mZ3Q7PC9jb2RlPi4gVGhpcyBjcmVhdGVzIGEgc2VtYW50aWMgbGluayBiZXR3ZWVuIHRoZSBpbWFnZSBhbmQgaXRzIGRlc2NyaXB0aW9uIHRoYXQgR29vZ2xlIGNhbiB1bmRlcnN0YW5kIGFuZCBpbmRleC48L3A+XG4gICAgICA8cHJlPjxjb2RlPiZsdDtmaWd1cmUmZ3Q7XG4gICZsdDtpbWcgc3JjPVwiY3NzLWZsZXhib3gtZGlhZ3JhbS5wbmdcIiBhbHQ9XCJDU1MgRmxleGJveCBheGlzIGRpYWdyYW1cIiB3aWR0aD1cIjgwMFwiIGhlaWdodD1cIjQ1MFwiIC8mZ3Q7XG4gICZsdDtmaWdjYXB0aW9uJmd0O1RoZSBtYWluIGF4aXMgYW5kIGNyb3NzIGF4aXMgaW4gYSBDU1MgRmxleGJveCBjb250YWluZXImbHQ7L2ZpZ2NhcHRpb24mZ3Q7XG4mbHQ7L2ZpZ3VyZSZndDs8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz4mbHQ7dGltZSZndDsgXHUyMDE0IERhdGVzIEdvb2dsZSBDYW4gUmVhZDwvaDM+XG4gICAgICA8cD5UaGUgPGNvZGU+Jmx0O3RpbWUmZ3Q7PC9jb2RlPiBlbGVtZW50IHdpdGggYSA8Y29kZT5kYXRldGltZTwvY29kZT4gYXR0cmlidXRlIGdpdmVzIHNlYXJjaCBlbmdpbmVzIGEgbWFjaGluZS1yZWFkYWJsZSBkYXRlLiBUaGlzIGlzIGNyaXRpY2FsIGZvciBibG9nIHBvc3RzIGFuZCBuZXdzIGFydGljbGVzIGJlY2F1c2UgR29vZ2xlIHVzZXMgaXQgZm9yIGZyZXNobmVzcyBzY29yaW5nIFx1MjAxNCBhIGtleSByYW5raW5nIHNpZ25hbC48L3A+XG4gICAgICA8cHJlPjxjb2RlPiZsdDt0aW1lIGRhdGV0aW1lPVwiMjAyNi0wMy0xNVQwOTowMDowMCswNTozMFwiJmd0O01hcmNoIDE1LCAyMDI2Jmx0Oy90aW1lJmd0OzwvY29kZT48L3ByZT5cblxuICAgICAgPGgyPkhvdyBTZW1hbnRpYyBUYWdzIERpcmVjdGx5IEJvb3N0IFNFTyBSYW5raW5nczwvaDI+XG4gICAgICA8cD5IZXJlIGlzIHRoZSBjb25jcmV0ZSBtZWNoYW5pc206IEdvb2dsZSdzIGNyYXdsZXIgYXNzaWducyBkaWZmZXJlbnQgcmVsZXZhbmNlIHdlaWdodHMgdG8gd29yZHMgYmFzZWQgb24gd2hpY2ggc2VtYW50aWMgY29udGFpbmVyIHRoZXkgYXJlIGluLiBLZXl3b3JkcyBpbnNpZGUgYW4gPGNvZGU+Jmx0O2gxJmd0OzwvY29kZT4gd2l0aGluIGEgPGNvZGU+Jmx0O21haW4mZ3Q7PC9jb2RlPiB3aXRoaW4gYW4gPGNvZGU+Jmx0O2FydGljbGUmZ3Q7PC9jb2RlPiBjYXJyeSB0aGUgaGlnaGVzdCB0b3BpY2FsIHJlbGV2YW5jZSBzaWduYWwuIFRoZSBzYW1lIGtleXdvcmRzIGJ1cmllZCBpbnNpZGUgYSA8Y29kZT4mbHQ7ZGl2Jmd0OzwvY29kZT4gaW5zaWRlIGFub3RoZXIgPGNvZGU+Jmx0O2RpdiZndDs8L2NvZGU+IGNhcnJ5IHZpcnR1YWxseSBub25lLjwvcD5cbiAgICAgIDxwPlRoaXMgaXMgd2h5IHR3byBwYWdlcyB3aXRoIGlkZW50aWNhbCB2aXNpYmxlIGNvbnRlbnQgYnV0IGRpZmZlcmVudCBIVE1MIHN0cnVjdHVyZSBjYW4gcmFuayB3aWxkbHkgZGlmZmVyZW50bHkuIFNlbWFudGljIEhUTUwgaXMgYSBkaXJlY3QgcmFua2luZyBmYWN0b3IgXHUyMDE0IG5vdCBhIG5pY2UtdG8taGF2ZS48L3A+XG5cbiAgICAgIDxoMj5TZW1hbnRpYyBIVE1MIGFuZCBXZWIgQWNjZXNzaWJpbGl0eTwvaDI+XG4gICAgICA8cD5TY3JlZW4gcmVhZGVycyB1c2VkIGJ5IHZpc3VhbGx5IGltcGFpcmVkIHVzZXJzIHJlbHkgMTAwJSBvbiBzZW1hbnRpYyBIVE1MLiBXaGVuIGEgdXNlciBuYXZpZ2F0ZXMgdG8gYSBwYWdlIHVzaW5nIGEgc2NyZWVuIHJlYWRlciwgaXQgYW5ub3VuY2VzIHRoZSBwYWdlIHN0cnVjdHVyZTogXCJIZWFkZXIsIG5hdmlnYXRpb24gd2l0aCA1IGxpbmtzLiBNYWluIGNvbnRlbnQuIEhlYWRpbmcgbGV2ZWwgMTogTWFzdGVyaW5nIEhUTUw1IFNlbWFudGljIFRhZ3MuIEFydGljbGUuIFNlY3Rpb24uLi5cIiBXaXRob3V0IHNlbWFudGljIHRhZ3MsIGEgc2NyZWVuIHJlYWRlciByZWFkcyB0aGUgZW50aXJlIHBhZ2UgYXMgb25lIGZsYXQsIHVuZGlmZmVyZW50aWF0ZWQgc3RyZWFtIG9mIHRleHQgXHUyMDE0IG1ha2luZyBpdCBjb21wbGV0ZWx5IGluYWNjZXNzaWJsZS48L3A+XG4gICAgICA8cD5BY2Nlc3NpYmlsaXR5IGlzIGFsc28gYSBMaWdodGhvdXNlIG1ldHJpYy4gQSBzY29yZSBiZWxvdyA5MCBvbiBhY2Nlc3NpYmlsaXR5IGFjdGl2ZWx5IHNpZ25hbHMgdG8gR29vZ2xlIHRoYXQgeW91ciBzaXRlIG1heSBub3QgYmUgaGlnaC1xdWFsaXR5IFx1MjAxNCBpbXBhY3RpbmcgeW91ciBTZWFyY2ggQ29uc29sZSBwZXJmb3JtYW5jZS48L3A+XG5cbiAgICAgIDxoMj5UaGUgUGVyZmVjdCBIVE1MNSBQYWdlIFN0cnVjdHVyZSBUZW1wbGF0ZTwvaDI+XG4gICAgICA8cHJlPjxjb2RlPiZsdDshRE9DVFlQRSBodG1sJmd0O1xuJmx0O2h0bWwgbGFuZz1cImVuXCImZ3Q7XG4mbHQ7aGVhZCZndDtcbiAgJmx0O21ldGEgY2hhcnNldD1cIlVURi04XCImZ3Q7XG4gICZsdDttZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCImZ3Q7XG4gICZsdDt0aXRsZSZndDtQYWdlIFRpdGxlIFx1MjAxNCBZb3VyIEJyYW5kJmx0Oy90aXRsZSZndDtcbiAgJmx0O21ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIkNvbXBlbGxpbmcgMTU1LWNoYXJhY3RlciBkZXNjcmlwdGlvbi4uLlwiJmd0O1xuICAmbHQ7bGluayByZWw9XCJjYW5vbmljYWxcIiBocmVmPVwiaHR0cHM6Ly95b3Vyc2l0ZS5jb20vdGhpcy1wYWdlXCIgLyZndDtcbiZsdDsvaGVhZCZndDtcbiZsdDtib2R5Jmd0O1xuICAmbHQ7aGVhZGVyJmd0O1xuICAgICZsdDtuYXYgYXJpYS1sYWJlbD1cIlByaW1hcnlcIiZndDsuLi4mbHQ7L25hdiZndDtcbiAgJmx0Oy9oZWFkZXImZ3Q7XG5cbiAgJmx0O21haW4mZ3Q7XG4gICAgJmx0O2FydGljbGUmZ3Q7XG4gICAgICAmbHQ7aGVhZGVyJmd0O1xuICAgICAgICAmbHQ7aDEmZ3Q7UHJpbWFyeSBLZXl3b3JkLVJpY2ggVGl0bGUmbHQ7L2gxJmd0O1xuICAgICAgICAmbHQ7dGltZSBkYXRldGltZT1cIjIwMjYtMDMtMTVcIiZndDtNYXJjaCAxNSwgMjAyNiZsdDsvdGltZSZndDtcbiAgICAgICZsdDsvaGVhZGVyJmd0O1xuXG4gICAgICAmbHQ7c2VjdGlvbiZndDtcbiAgICAgICAgJmx0O2gyJmd0O1N1YnRvcGljIE9uZSZsdDsvaDImZ3Q7XG4gICAgICAgICZsdDtwJmd0O0NvbnRlbnQuLi4mbHQ7L3AmZ3Q7XG4gICAgICAgICZsdDtmaWd1cmUmZ3Q7XG4gICAgICAgICAgJmx0O2ltZyBzcmM9XCIuLi5cIiBhbHQ9XCJEZXNjcmlwdGl2ZSBhbHQgdGV4dFwiIC8mZ3Q7XG4gICAgICAgICAgJmx0O2ZpZ2NhcHRpb24mZ3Q7Li4uJmx0Oy9maWdjYXB0aW9uJmd0O1xuICAgICAgICAmbHQ7L2ZpZ3VyZSZndDtcbiAgICAgICZsdDsvc2VjdGlvbiZndDtcblxuICAgICAgJmx0O3NlY3Rpb24mZ3Q7XG4gICAgICAgICZsdDtoMiZndDtTdWJ0b3BpYyBUd28mbHQ7L2gyJmd0O1xuICAgICAgICAmbHQ7cCZndDtDb250ZW50Li4uJmx0Oy9wJmd0O1xuICAgICAgJmx0Oy9zZWN0aW9uJmd0O1xuICAgICZsdDsvYXJ0aWNsZSZndDtcblxuICAgICZsdDthc2lkZSZndDtcbiAgICAgICZsdDtoMyZndDtSZWxhdGVkIEFydGljbGVzJmx0Oy9oMyZndDtcbiAgICAgICZsdDshLS0gUmVsYXRlZCBsaW5rcyAtLSZndDtcbiAgICAmbHQ7L2FzaWRlJmd0O1xuICAmbHQ7L21haW4mZ3Q7XG5cbiAgJmx0O2Zvb3RlciZndDsuLi4mbHQ7L2Zvb3RlciZndDtcbiZsdDsvYm9keSZndDtcbiZsdDsvaHRtbCZndDs8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMj5Db21tb24gU2VtYW50aWMgSFRNTCBNaXN0YWtlcyB0byBBdm9pZDwvaDI+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPk11bHRpcGxlICZsdDtoMSZndDsgdGFnczo8L3N0cm9uZz4gRWFjaCBwYWdlIHNob3VsZCBoYXZlIGV4YWN0bHkgb25lIDxjb2RlPiZsdDtoMSZndDs8L2NvZGU+LiBJdCBpcyB5b3VyIHByaW1hcnkgcmFua2luZyBzaWduYWwuIE11bHRpcGxlIEgxcyBkaWx1dGUgaXQuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+VXNpbmcgJmx0O3NlY3Rpb24mZ3Q7IGFzIGEgc3R5bGVkIHdyYXBwZXI6PC9zdHJvbmc+IElmIHlvdSBhcmUgdXNpbmcgPGNvZGU+Jmx0O3NlY3Rpb24mZ3Q7PC9jb2RlPiBqdXN0IHRvIGFkZCBwYWRkaW5nIG9yIGEgYmFja2dyb3VuZCBjb2xvdXIsIHVzZSBhIDxjb2RlPiZsdDtkaXYmZ3Q7PC9jb2RlPi4gU2VtYW50aWMgdGFncyBtdXN0IGhhdmUgYSBtZWFuaW5nZnVsIHB1cnBvc2UuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TWlzc2luZyBhbHQgYXR0cmlidXRlcyBvbiBpbWFnZXM6PC9zdHJvbmc+IEV2ZXJ5IDxjb2RlPiZsdDtpbWcmZ3Q7PC9jb2RlPiBuZWVkcyBhIGRlc2NyaXB0aXZlIDxjb2RlPmFsdDwvY29kZT4gYXR0cmlidXRlLiBJdCBpcyBhbiBhY2Nlc3NpYmlsaXR5IHJlcXVpcmVtZW50IEFORCBhIHJhbmtpbmcgc2lnbmFsIGZvciBpbWFnZSBzZWFyY2guPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TmVzdGluZyBpbnRlcmFjdGl2ZSBlbGVtZW50czo8L3N0cm9uZz4gTmV2ZXIgcHV0IGEgPGNvZGU+Jmx0O2J1dHRvbiZndDs8L2NvZGU+IGluc2lkZSBhbiA8Y29kZT4mbHQ7YSZndDs8L2NvZGU+IHRhZyBvciB2aWNlIHZlcnNhLiBJdCBpcyBpbnZhbGlkIEhUTUwgYW5kIGJyZWFrcyBrZXlib2FyZCBuYXZpZ2F0aW9uLjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDI+V2hhdCB0byBMZWFybiBOZXh0PC9oMj5cbiAgICAgIDxwPk1hc3RlcmluZyBzZW1hbnRpYyBIVE1MIGlzIHRoZSBmaXJzdCBzdGVwLiBUaGUgbmV4dCBpcyBsZWFybmluZyBob3cgdG8gc3R5bGUgdGhvc2Ugc2VtYW50aWMgc3RydWN0dXJlcyBiZWF1dGlmdWxseSB3aXRoIENTUy4gT3VyIDxhIGhyZWY9XCIvYmxvZy9jc3MtZ3JpZC12cy1mbGV4Ym94LW1vZGVybi13ZWJcIj5DU1MgR3JpZCB2cyBGbGV4Ym94IGd1aWRlPC9hPiBzaG93cyB5b3UgaG93IHRvIGJ1aWxkIG1vZGVybiwgcmVzcG9uc2l2ZSBwYWdlIGxheW91dHMgdGhhdCBzaXQgcGVyZmVjdGx5IG9uIHRvcCBvZiB5b3VyIHNlbWFudGljIEhUTUwgZm91bmRhdGlvbi4gVGhlbiwgYWRkIGJlaGF2aW91ciB3aXRoIG91ciA8YSBocmVmPVwiL2Jsb2cvamF2YXNjcmlwdC1kb20tbWFuaXB1bGF0aW9uLXNlY3JldHNcIj5KYXZhU2NyaXB0IERPTSBtYW5pcHVsYXRpb24gZ3VpZGU8L2E+LjwvcD5cbiAgICAgIDxwPlRvIG1hc3RlciBIVE1MNSBmcm9tIHNjcmF0Y2ggXHUyMDE0IGluY2x1ZGluZyBmb3JtcywgbXVsdGltZWRpYSwgYWNjZXNzaWJpbGl0eSwgYW5kIHN0cnVjdHVyZWQgZGF0YSBcdTIwMTQgY2hlY2sgb3V0IHRoZSBjb21wbGV0ZWx5IGZyZWUgPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWh0bWwtbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBIVE1MIE1hc3RlcmNsYXNzPC9hPiBvbiBTa2lsbFZhbGl4LiBJdCBlbmRzIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIHlvdSBjYW4gbGluayB0byBvbiBMaW5rZWRJbi48L3A+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9uczwvaDI+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IERvIHNlbWFudGljIEhUTUwgdGFncyBhY3R1YWxseSBhZmZlY3QgR29vZ2xlIHJhbmtpbmdzPzwvc3Ryb25nPjxici8+XG4gICAgICBZZXMsIGRpcmVjdGx5LiBHb29nbGUncyBjcmF3bGVyIHVzZXMgSFRNTCBzdHJ1Y3R1cmUgdG8gYXNzaWduIHRvcGljYWwgd2VpZ2h0IHRvIGtleXdvcmRzLiBDb250ZW50IGluc2lkZSBzZW1hbnRpYyBjb250YWluZXJzIGxpa2UgPGNvZGU+Jmx0O2FydGljbGUmZ3Q7PC9jb2RlPiBhbmQgPGNvZGU+Jmx0O21haW4mZ3Q7PC9jb2RlPiBpcyB3ZWlnaHRlZCBoaWdoZXIgdGhhbiBjb250ZW50IGluIGdlbmVyaWMgPGNvZGU+Jmx0O2RpdiZndDs8L2NvZGU+IHdyYXBwZXJzLiBUaGUgc3RydWN0dXJlIGFsc28gZW5hYmxlcyByaWNoIHJlc3VsdHMgYW5kIGZlYXR1cmVkIHNuaXBwZXRzLCB3aGljaCBhcmUgZXhjbHVzaXZlbHkgdHJpZ2dlcmVkIGJ5IGNvcnJlY3Qgc2VtYW50aWMgbWFya3VwLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogV2hhdCBpcyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuICZsdDthcnRpY2xlJmd0OyBhbmQgJmx0O3NlY3Rpb24mZ3Q7Pzwvc3Ryb25nPjxici8+XG4gICAgICBBbiA8Y29kZT4mbHQ7YXJ0aWNsZSZndDs8L2NvZGU+IGlzIHNlbGYtY29udGFpbmVkIGNvbnRlbnQgdGhhdCBtYWtlcyBzZW5zZSBpbmRlcGVuZGVudGx5IFx1MjAxNCB5b3UgY291bGQgcHVibGlzaCBpdCBlbHNld2hlcmUgYW5kIGl0IHdvdWxkIHN0aWxsIG1ha2Ugc2Vuc2UuIEEgPGNvZGU+Jmx0O3NlY3Rpb24mZ3Q7PC9jb2RlPiBpcyBhIHRoZW1hdGljIGdyb3VwaW5nIHdpdGhpbiBhIGxhcmdlciBwYWdlIHRoYXQgaXMgbm90IGluZGVwZW5kZW50bHkgbWVhbmluZ2Z1bC4gV2hlbiBpbiBkb3VidDogaWYgaXQgY291bGQgYmUgYW4gUlNTIGZlZWQgaXRlbSwgaXQgaXMgYW4gPGNvZGU+Jmx0O2FydGljbGUmZ3Q7PC9jb2RlPi48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IENhbiBJIHVzZSBIVE1MNSBzZW1hbnRpYyB0YWdzIHdpdGggUmVhY3Qgb3Igb3RoZXIgZnJhbWV3b3Jrcz88L3N0cm9uZz48YnIvPlxuICAgICAgQWJzb2x1dGVseS4gUmVhY3QgYW5kIGFsbCBtb2Rlcm4gSmF2YVNjcmlwdCBmcmFtZXdvcmtzIHJlbmRlciB0byBzdGFuZGFyZCBIVE1MIGluIHRoZSBicm93c2VyLiBZb3Ugd3JpdGUgSlNYIHVzaW5nIHRoZSBzYW1lIHNlbWFudGljIHRhZ3MgXHUyMDE0IDxjb2RlPiZsdDtoZWFkZXImZ3Q7PC9jb2RlPiwgPGNvZGU+Jmx0O21haW4mZ3Q7PC9jb2RlPiwgPGNvZGU+Jmx0O2FydGljbGUmZ3Q7PC9jb2RlPiBcdTIwMTQgYW5kIHRoZXkgY29tcGlsZSB0byBwcm9wZXIgSFRNTCB0aGF0IHNlYXJjaCBlbmdpbmVzIGFuZCBzY3JlZW4gcmVhZGVycyBjYW4gcmVhZC4gU2tpbGxWYWxpeCBpdHNlbGYgaXMgYnVpbHQgd2l0aCBSZWFjdCBhbmQgdXNlcyBmdWxsIHNlbWFudGljIEhUTUwgdGhyb3VnaG91dC48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTQ6IElzIHNlbWFudGljIEhUTUwgZGlmZmVyZW50IGluIDIwMjYgdnMgb2xkZXIgSFRNTDU/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFRoZSBjb3JlIHNlbWFudGljIHRhZ3MgaGF2ZSBub3QgY2hhbmdlZCBcdTIwMTQgPGNvZGU+Jmx0O2hlYWRlciZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7bWFpbiZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7YXJ0aWNsZSZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7bmF2Jmd0OzwvY29kZT4sIDxjb2RlPiZsdDthc2lkZSZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7c2VjdGlvbiZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4sIDxjb2RlPiZsdDt0aW1lJmd0OzwvY29kZT4gYXJlIGFsbCBzdGlsbCB0aGUgc3RhbmRhcmQuIFdoYXQgaGFzIGV2b2x2ZWQgaXMgR29vZ2xlJ3MgYWJpbGl0eSB0byBwYXJzZSBhbmQgbGV2ZXJhZ2UgdGhlbS4gSW4gMjAyNiwgR29vZ2xlJ3MgdW5kZXJzdGFuZGluZyBvZiBzZW1hbnRpYyBzdHJ1Y3R1cmUgaXMgZmFyIG1vcmUgbnVhbmNlZCBcdTIwMTQgbWFraW5nIGNvcnJlY3QgdXNhZ2UgZXZlbiBtb3JlIGltcGFjdGZ1bCBmb3IgcmFua2luZ3MgdGhhbiBpdCB3YXMgZXZlbiAzIHllYXJzIGFnby48L3A+XG4gICAgYCxcbiAgICBhdXRob3I6ICdBcmp1biBNZWh0YScsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDMtMTVUMDk6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDMtMTVUMDk6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdNYXJjaCAxNSwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxMiBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxNDIwLFxuICAgIGNhdGVnb3J5OiAnU0VPICYgSFRNTCcsXG4gICAgdGFnczogWydIVE1MNScsICdTRU8nLCAnU2VtYW50aWMgSFRNTCcsICdXZWIgRGV2ZWxvcG1lbnQnLCAnQWNjZXNzaWJpbGl0eScsICdIVE1MNSBUdXRvcmlhbCcsICdPbi1QYWdlIFNFTyddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDI4MzEzNzEtMjliMGY3NGY5NzEzP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnE9ODAmdz0xMjAwJyxcbiAgICBpbWFnZUFsdDogJ0hUTUw1IGNvZGUgb24gYSBjb21wdXRlciBzY3JlZW4gc2hvd2luZyBzZW1hbnRpYyB0YWdzJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL21hc3RlcmluZy1odG1sNS1zZW1hbnRpYy10YWdzLXNlbycsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdUaGUgVWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzcyBmb3IgQmVnaW5uZXJzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFzdGVyIHNlbWFudGljIEhUTUw1LCBtdWx0aW1lZGlhLCBhbmQgZm9ybSB2YWxpZGF0aW9ucy4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdjc3MtZ3JpZC12cy1mbGV4Ym94LW1vZGVybi13ZWInLFxuICAgIHRpdGxlOiAnQ1NTIEdyaWQgdnMgRmxleGJveDogVGhlIFVsdGltYXRlIEd1aWRlIGZvciBNb2Rlcm4gV2ViIERlc2lnbicsXG4gICAgbWV0YVRpdGxlOiAnQ1NTIEdyaWQgdnMgRmxleGJveDogVGhlIFVsdGltYXRlIEd1aWRlICgyMDI2KSB8IFNraWxsVmFsaXgnLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgICdDU1MgR3JpZCBvciBGbGV4Ym94IFx1MjAxNCB3aGljaCBzaG91bGQgeW91IHVzZSBhbmQgd2hlbj8gVGhpcyAyMDI2IGd1aWRlIGJyZWFrcyBkb3duIHRoZSBrZXkgZGlmZmVyZW5jZXMsIHVzZSBjYXNlcywgYW5kIGhvdyB0byBjb21iaW5lIGJvdGggZm9yIHBpeGVsLXBlcmZlY3QgcmVzcG9uc2l2ZSB3ZWIgbGF5b3V0cy4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnQ1NTIEdyaWQgdnMgRmxleGJveCcsXG4gICAgICAnQ1NTIGxheW91dCB0dXRvcmlhbCcsXG4gICAgICAnRmxleGJveCBndWlkZSAyMDI2JyxcbiAgICAgICdDU1MgR3JpZCBndWlkZSAyMDI2JyxcbiAgICAgICdyZXNwb25zaXZlIHdlYiBkZXNpZ24nLFxuICAgICAgJ21vZGVybiBDU1MgbGF5b3V0JyxcbiAgICAgICd3ZWIgZGVzaWduIHR1dG9yaWFsJyxcbiAgICAgICdDU1MgZm9yIGJlZ2lubmVycycsXG4gICAgXSxcbiAgICBleGNlcnB0OlxuICAgICAgJ0NvbmZ1c2VkIGFib3V0IHdoZW4gdG8gdXNlIENTUyBHcmlkIGFuZCB3aGVuIHRvIHVzZSBGbGV4Ym94PyBXZSBicmVhayBkb3duIHRoZSBkaWZmZXJlbmNlcyBhbmQgZXhwbGFpbiBob3cgdG8gY29tYmluZSB0aGVtIGZvciBwaXhlbC1wZXJmZWN0LCByZXNwb25zaXZlIGxheW91dHMuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIFR3byBLaW5ncyBvZiBDU1MgTGF5b3V0PC9oMj5cbiAgICAgIDxwPkJlZm9yZSBGbGV4Ym94IGFuZCBDU1MgR3JpZCwgYnVpbGRpbmcgbGF5b3V0cyB3YXMgYSBkYXJrIGFydCBvZiBmbG9hdHMsIGNsZWFyZml4ZXMsIGFuZCB0YWJsZS1iYXNlZCBoYWNrcy4gVG9kYXksIENTUyBnaXZlcyB1cyB0d28gcHVycG9zZS1idWlsdCBsYXlvdXQgbW9kdWxlcyB0aGF0IHNvbHZlIGRpZmZlcmVudCBwcm9ibGVtcy4gQnV0IGNob29zaW5nIGJldHdlZW4gdGhlbSBcdTIwMTQgb3Iga25vd2luZyB3aGVuIHRvIGNvbWJpbmUgdGhlbSBcdTIwMTQgaXMgYSBza2lsbCB0aGF0IHNlcGFyYXRlcyBqdW5pb3IgZGV2ZWxvcGVycyBmcm9tIHNlbmlvciBvbmVzLjwvcD5cbiAgICAgIDxwPlRoaXMgZ3VpZGUgZ2l2ZXMgeW91IHRoZSBkZWZpbml0aXZlIGFuc3dlciwgd2l0aCByZWFsIGNvZGUgZXhhbXBsZXMgZm9yIGV2ZXJ5IHNjZW5hcmlvLjwvcD5cblxuICAgICAgPGgyPkNTUyBGbGV4Ym94OiBUaGUgT25lLURpbWVuc2lvbmFsIFNwZWNpYWxpc3Q8L2gyPlxuICAgICAgPHA+RmxleGJveCAoRmxleGlibGUgQm94IExheW91dCkgd2FzIGJ1aWx0IGZvciA8c3Ryb25nPm9uZS1kaW1lbnNpb25hbCBsYXlvdXRzPC9zdHJvbmc+IFx1MjAxNCBpdCBoYW5kbGVzIGEgcm93IG9mIGl0ZW1zIE9SIGEgY29sdW1uIG9mIGl0ZW1zLCBub3QgYm90aCBzaW11bHRhbmVvdXNseS4gSXRzIHN1cGVycG93ZXIgaXMgZGlzdHJpYnV0aW5nIHNwYWNlIGFuZCBhbGlnbmluZyBpdGVtcyB3aXRoaW4gYSBzaW5nbGUgYXhpcy48L3A+XG5cbiAgICAgIDxoMz5XaGVuIHRvIFVzZSBGbGV4Ym94PC9oMz5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+TmF2aWdhdGlvbiBiYXJzPC9zdHJvbmc+IFx1MjAxNCBkaXN0cmlidXRlIGxpbmtzIGhvcml6b250YWxseSB3aXRoIGVxdWFsIHNwYWNpbmc8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5DYXJkIHJvd3M8L3N0cm9uZz4gXHUyMDE0IGtlZXAgY2FyZHMgZXF1YWwgaGVpZ2h0IHJlZ2FyZGxlc3Mgb2YgY29udGVudDwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkNlbnRlcmluZyBhbnl0aGluZzwvc3Ryb25nPiBcdTIwMTQgPGNvZGU+ZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI8L2NvZGU+IGlzIHRoZSBjbGVhbmVzdCBjZW50ZXJpbmcgdGVjaG5pcXVlIGluIENTUzwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkljb24gKyB0ZXh0IGFsaWdubWVudDwvc3Ryb25nPiBcdTIwMTQga2VlcCBhbiBpY29uIHZlcnRpY2FsbHkgY2VudHJlZCBuZXh0IHRvIHRleHQ8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5SZXNwb25zaXZlIGJ1dHRvbiBncm91cHM8L3N0cm9uZz4gXHUyMDE0IHdyYXAgYnV0dG9ucyB0byBhIG5ldyByb3cgb24gbW9iaWxlPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxwcmU+PGNvZGU+LyogUGVyZmVjdCBob3Jpem9udGFsIG5hdmJhciB3aXRoIEZsZXhib3ggKi9cbi5uYXZiYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDAgMjRweDtcbiAgaGVpZ2h0OiA2NHB4O1xufVxuXG4vKiBFcXVhbC1oZWlnaHQgY2FyZCByb3cgKi9cbi5jYXJkLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMjRweDtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7IC8qIENhcmRzIG1hdGNoIGhlaWdodCBvZiB0YWxsZXN0ICovXG59XG5cbi8qIFRoZSBmYW1vdXMgcGVyZmVjdC1jZW50ZXIgdHJpY2sgKi9cbi5jZW50ZXJlZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbn08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz5LZXkgRmxleGJveCBQcm9wZXJ0aWVzIFlvdSBNdXN0IEtub3c8L2gzPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGNvZGU+ZmxleC1kaXJlY3Rpb248L2NvZGU+OiA8Y29kZT5yb3c8L2NvZGU+IChkZWZhdWx0KSBvciA8Y29kZT5jb2x1bW48L2NvZGU+IFx1MjAxNCBzZXRzIHRoZSBtYWluIGF4aXM8L2xpPlxuICAgICAgICA8bGk+PGNvZGU+anVzdGlmeS1jb250ZW50PC9jb2RlPjogQWxpZ25zIGl0ZW1zIG9uIHRoZSBtYWluIGF4aXMgKDxjb2RlPmZsZXgtc3RhcnQ8L2NvZGU+LCA8Y29kZT5jZW50ZXI8L2NvZGU+LCA8Y29kZT5zcGFjZS1iZXR3ZWVuPC9jb2RlPiwgPGNvZGU+c3BhY2UtYXJvdW5kPC9jb2RlPik8L2xpPlxuICAgICAgICA8bGk+PGNvZGU+YWxpZ24taXRlbXM8L2NvZGU+OiBBbGlnbnMgaXRlbXMgb24gdGhlIGNyb3NzIGF4aXMgKDxjb2RlPnN0cmV0Y2g8L2NvZGU+LCA8Y29kZT5jZW50ZXI8L2NvZGU+LCA8Y29kZT5mbGV4LXN0YXJ0PC9jb2RlPik8L2xpPlxuICAgICAgICA8bGk+PGNvZGU+ZmxleC13cmFwOiB3cmFwPC9jb2RlPjogQWxsb3dzIGl0ZW1zIHRvIHdyYXAgdG8gYSBuZXcgcm93IHdoZW4gc3BhY2UgcnVucyBvdXQ8L2xpPlxuICAgICAgICA8bGk+PGNvZGU+ZmxleDogMTwvY29kZT46IFRlbGxzIGFuIGl0ZW0gdG8gdGFrZSB1cCBhbGwgcmVtYWluaW5nIHNwYWNlPC9saT5cbiAgICAgICAgPGxpPjxjb2RlPmdhcDwvY29kZT46IFNldHMgc3BhY2luZyBiZXR3ZWVuIGZsZXggaXRlbXMgKG11Y2ggY2xlYW5lciB0aGFuIG1hcmdpbnMpPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5DU1MgR3JpZDogVGhlIFR3by1EaW1lbnNpb25hbCBQb3dlcmhvdXNlPC9oMj5cbiAgICAgIDxwPkNTUyBHcmlkIHdhcyBkZXNpZ25lZCBmb3IgPHN0cm9uZz50d28tZGltZW5zaW9uYWwgbGF5b3V0czwvc3Ryb25nPiBcdTIwMTQgaXQgY29udHJvbHMgcm93cyBBTkQgY29sdW1ucyBzaW11bHRhbmVvdXNseS4gSXQgaXMgdGhlIGNvcnJlY3QgdG9vbCBmb3IgdGhlIG92ZXJhbGwgcGFnZSBza2VsZXRvbiwgY29tcGxleCBjb250ZW50IGdyaWRzLCBhbmQgYW55IGxheW91dCB3aGVyZSB5b3UgbmVlZCBpdGVtcyB0byBhbGlnbiBvbiBib3RoIGF4ZXMuPC9wPlxuXG4gICAgICA8aDM+V2hlbiB0byBVc2UgQ1NTIEdyaWQ8L2gzPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5PdmVyYWxsIHBhZ2UgbGF5b3V0PC9zdHJvbmc+IFx1MjAxNCBoZWFkZXIsIHNpZGViYXIsIG1haW4gY29udGVudCwgZm9vdGVyPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UmVzcG9uc2l2ZSBjYXJkIGdyaWRzPC9zdHJvbmc+IFx1MjAxNCBhIDQtY29sdW1uIGdyaWQgdGhhdCBjb2xsYXBzZXMgdG8gMiwgdGhlbiAxPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TWFnYXppbmUvZWRpdG9yaWFsIGxheW91dHM8L3N0cm9uZz4gXHUyMDE0IGl0ZW1zIHNwYW5uaW5nIG11bHRpcGxlIGNvbHVtbnMgb3Igcm93czwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkRhc2hib2FyZCB3aWRnZXRzPC9zdHJvbmc+IFx1MjAxNCB3aWRnZXRzIG9mIGRpZmZlcmVudCBzaXplcyBhcnJhbmdlZCBpbiBhIHByZWNpc2UgZ3JpZDwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkltYWdlIGdhbGxlcmllczwvc3Ryb25nPiBcdTIwMTQgbWFzb25yeS1zdHlsZSBvciB1bmlmb3JtIGdyaWRzPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxwcmU+PGNvZGU+LyogRnVsbCBwYWdlIGxheW91dCB3aXRoIENTUyBHcmlkICovXG4ucGFnZSB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjUwcHggMWZyO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDY0cHggMWZyIGF1dG87XG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XG4gICAgXCJoZWFkZXIgIGhlYWRlclwiXG4gICAgXCJzaWRlYmFyIG1haW4gIFwiXG4gICAgXCJmb290ZXIgIGZvb3RlclwiO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbn1cblxuLmhlYWRlciAgeyBncmlkLWFyZWE6IGhlYWRlcjsgIH1cbi5zaWRlYmFyIHsgZ3JpZC1hcmVhOiBzaWRlYmFyOyB9XG4ubWFpbiAgICB7IGdyaWQtYXJlYTogbWFpbjsgICAgfVxuLmZvb3RlciAgeyBncmlkLWFyZWE6IGZvb3RlcjsgIH1cblxuLyogUmVzcG9uc2l2ZSBjYXJkIGdyaWQgXHUyMDE0IGF1dG9tYXRpY2FsbHkgYWRqdXN0cyBjb2x1bW5zICovXG4uY291cnNlcy1ncmlkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjgwcHgsIDFmcikpO1xuICBnYXA6IDI0cHg7XG59XG5cbi8qIEFuIGl0ZW0gc3Bhbm5pbmcgbXVsdGlwbGUgY29sdW1ucyAqL1xuLmZlYXR1cmVkLWNhcmQge1xuICBncmlkLWNvbHVtbjogc3BhbiAyO1xufTwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPlRoZSByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoKSkgUGF0dGVybjwvaDM+XG4gICAgICA8cD5UaGlzIHNpbmdsZSBsaW5lIG9mIENTUyBHcmlkIGNvZGUgaXMgb25lIG9mIHRoZSBtb3N0IHBvd2VyZnVsIHJlc3BvbnNpdmUgbGF5b3V0IHRlY2huaXF1ZXMgZXZlciBjcmVhdGVkLiBJdCBhdXRvbWF0aWNhbGx5IGZpbGxzIHRoZSByb3cgd2l0aCBhcyBtYW55IGNvbHVtbnMgYXMgZml0LCB3aXRoIGVhY2ggY29sdW1uIGJlaW5nIGF0IG1pbmltdW0gMjgwcHggd2lkZS4gTm8gbWVkaWEgcXVlcmllcyBuZWVkZWQ6PC9wPlxuICAgICAgPHByZT48Y29kZT5ncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyODBweCwgMWZyKSk7XG4vKiBPbiBhIHdpZGUgc2NyZWVuOiA0IGNvbHVtbnNcbiAgIE9uIGEgdGFibGV0OiAgICAgICAyIGNvbHVtbnMgIFxuICAgT24gbW9iaWxlOiAgICAgICAgIDEgY29sdW1uXG4gICBcdTIwMTQgYWxsIGF1dG9tYXRpY2FsbHksIG5vIEBtZWRpYSBxdWVyaWVzICovPC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDI+VGhlIERlY2lzaW9uIEZyYW1ld29yazogR3JpZCBvciBGbGV4Ym94PzwvaDI+XG4gICAgICA8cD5Bc2sgeW91cnNlbGYgdGhpcyBvbmUgcXVlc3Rpb246IDxzdHJvbmc+XCJEb2VzIG15IGxheW91dCBoYXZlIGJvdGggcm93cyBBTkQgY29sdW1ucz9cIjwvc3Ryb25nPjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+WWVzOjwvc3Ryb25nPiBVc2UgQ1NTIEdyaWQuIFlvdSBuZWVkIHR3by1kaW1lbnNpb25hbCBjb250cm9sLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPk5vLCBqdXN0IG9uZSBkaXJlY3Rpb246PC9zdHJvbmc+IFVzZSBGbGV4Ym94LiBZb3Ugb25seSBuZWVkIG9uZS1kaW1lbnNpb25hbCBhbGlnbm1lbnQuPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD5BIHF1aWNrIHZpc3VhbCByZWZlcmVuY2U6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+TmF2YmFyIGxpbmtzIGluIGEgcm93IFx1MjE5MiA8c3Ryb25nPkZsZXhib3g8L3N0cm9uZz48L2xpPlxuICAgICAgICA8bGk+Q291cnNlIGNhcmRzIGluIGEgcmVzcG9uc2l2ZSBncmlkIFx1MjE5MiA8c3Ryb25nPkNTUyBHcmlkPC9zdHJvbmc+PC9saT5cbiAgICAgICAgPGxpPkNlbnRlcmluZyBhIG1vZGFsIFx1MjE5MiA8c3Ryb25nPkZsZXhib3g8L3N0cm9uZz48L2xpPlxuICAgICAgICA8bGk+RnVsbCBwYWdlIHNrZWxldG9uIChoZWFkZXIvc2lkZWJhci9tYWluL2Zvb3RlcikgXHUyMTkyIDxzdHJvbmc+Q1NTIEdyaWQ8L3N0cm9uZz48L2xpPlxuICAgICAgICA8bGk+QnV0dG9uIHdpdGggaWNvbiArIHRleHQgXHUyMTkyIDxzdHJvbmc+RmxleGJveDwvc3Ryb25nPjwvbGk+XG4gICAgICAgIDxsaT5EYXNoYm9hcmQgd2l0aCBtaXhlZCB3aWRnZXQgc2l6ZXMgXHUyMTkyIDxzdHJvbmc+Q1NTIEdyaWQ8L3N0cm9uZz48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPlRoZSBFeHBlcnQgQXBwcm9hY2g6IENvbWJpbmUgQm90aDwvaDI+XG4gICAgICA8cD5UaGUgc2VjcmV0IHRoYXQgc2VuaW9yIGRldmVsb3BlcnMga25vdyBpcyB0aGF0IGl0IGlzIG5ldmVyIEdyaWQgPGVtPnZlcnN1czwvZW0+IEZsZXhib3ggXHUyMDE0IGl0IGlzIEdyaWQgPGVtPmFuZDwvZW0+IEZsZXhib3ggdG9nZXRoZXIuIFRoZSBwYXR0ZXJuIGlzOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q1NTIEdyaWQ8L3N0cm9uZz4gY29udHJvbHMgdGhlIG1hY3JvIGxheW91dCBcdTIwMTQgdGhlIG92ZXJhbGwgcGFnZSBzdHJ1Y3R1cmUgd2l0aCBhcmVhczwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkZsZXhib3g8L3N0cm9uZz4gY29udHJvbHMgdGhlIG1pY3JvIGxheW91dCBcdTIwMTQgaG93IGl0ZW1zIGFsaWduIDxlbT5pbnNpZGU8L2VtPiBlYWNoIGdyaWQgY2VsbDwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHByZT48Y29kZT4vKiBHcmlkIGhhbmRsZXMgdGhlIHBhZ2Ugc3RydWN0dXJlICovXG4uZGFzaGJvYXJkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAyNDBweCAxZnI7XG4gIGdhcDogMjRweDtcbn1cblxuLyogRmxleGJveCBoYW5kbGVzIGFsaWdubWVudCBpbnNpZGUgYSBncmlkIGNlbGwgKi9cbi5zdGF0LWNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDE2cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG59PC9jb2RlPjwvcHJlPlxuICAgICAgPHA+VXNpbmcgdGhlbSB0b2dldGhlciBsaWtlIHRoaXMgaXMgdGhlIGNvcnJlY3QgYXBwcm9hY2ggXHUyMDE0IHlvdSBhcmUgdXNpbmcgZWFjaCB0b29sIGZvciB3aGF0IGl0IHdhcyBkZXNpZ25lZCBmb3IuPC9wPlxuXG4gICAgICA8aDI+Q1NTIEdyaWQgdnMgRmxleGJveCBCcm93c2VyIFN1cHBvcnQgaW4gMjAyNjwvaDI+XG4gICAgICA8cD5Cb3RoIGFyZSBzdXBwb3J0ZWQgaW4gMTAwJSBvZiBtb2Rlcm4gYnJvd3NlcnMuIENTUyBHcmlkIChpbmNsdWRpbmcgPGNvZGU+Z3JpZC10ZW1wbGF0ZS1hcmVhczwvY29kZT4gYW5kIDxjb2RlPnN1YmdyaWQ8L2NvZGU+KSBoYXMgYmVlbiBhdmFpbGFibGUgaW4gYWxsIG1ham9yIGJyb3dzZXJzIHNpbmNlIDIwMjIuIFlvdSBjYW4gdXNlIGV2ZXJ5dGhpbmcgaW4gdGhpcyBndWlkZSBpbiBwcm9kdWN0aW9uIHRvZGF5IHdpdGhvdXQgYW55IHBvbHlmaWxscy48L3A+XG5cbiAgICAgIDxoMj5SZWxhdGVkIExlYXJuaW5nPC9oMj5cbiAgICAgIDxwPk5vdyB0aGF0IHlvdSB1bmRlcnN0YW5kIGxheW91dCwgdGhlIG5leHQgc3RlcCBpcyBhZGRpbmcgbW90aW9uIGFuZCBpbnRlcmFjdGl2aXR5LiBPdXIgPGEgaHJlZj1cIi9ibG9nL2Nzcy1hbmltYXRpb25zLW1pY3JvLWludGVyYWN0aW9ucy1ndWlkZVwiPkNTUyBtaWNybyBhbmltYXRpb25zIGd1aWRlPC9hPiBzaG93cyB5b3UgaG93IHRvIGFuaW1hdGUgeW91ciBGbGV4Ym94IGFuZCBHcmlkIGNvbXBvbmVudHMgd2l0aCBDU1MgdHJhbnNpdGlvbnMuIEFuZCBvdXIgPGEgaHJlZj1cIi9ibG9nL21hc3RlcmluZy1odG1sNS1zZW1hbnRpYy10YWdzLXNlb1wiPkhUTUw1IHNlbWFudGljIHRhZ3MgZ3VpZGU8L2E+IGV4cGxhaW5zIHRoZSBtZWFuaW5nZnVsIGNvbnRhaW5lciBlbGVtZW50cyB0aGF0IEdyaWQgYW5kIEZsZXhib3ggc2hvdWxkIGJlIGFwcGxpZWQgdG8uPC9wPlxuICAgICAgPHA+VG8gcHJhY3RpY2UgdGhlc2UgaW4gYSBzdHJ1Y3R1cmVkLCBoYW5kcy1vbiBlbnZpcm9ubWVudCwgY2hlY2sgb3V0IHRoZSBmcmVlIDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByb1wiPkNTUyBmb3IgQmVnaW5uZXJzOiBaZXJvIHRvIFBybyBjb3Vyc2U8L2E+IG9uIFNraWxsVmFsaXggXHUyMDE0IGNvbXBsZXRlIHdpdGggZXhlcmNpc2VzIGFuZCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUuPC9wPlxuXG4gICAgICA8aDI+RnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnM8L2gyPlxuXG4gICAgICA8cD48c3Ryb25nPlExOiBJcyBDU1MgR3JpZCByZXBsYWNpbmcgRmxleGJveD88L3N0cm9uZz48YnIvPlxuICAgICAgTm8uIFRoZXkgc2VydmUgZGlmZmVyZW50IHB1cnBvc2VzIGFuZCB3aWxsIGxpa2VseSBib3RoIGV4aXN0IGZvcmV2ZXIuIEdyaWQgc29sdmVzIHR3by1kaW1lbnNpb25hbCBsYXlvdXQgcHJvYmxlbXMgdGhhdCBGbGV4Ym94IGNhbm5vdCBoYW5kbGUgZWxlZ2FudGx5LiBGbGV4Ym94IHNvbHZlcyBvbmUtZGltZW5zaW9uYWwgYWxpZ25tZW50IHByb2JsZW1zIHdpdGggbGVzcyBjb2RlIHRoYW4gR3JpZC4gQm90aCBhcmUgdXNlZCBleHRlbnNpdmVseSBvbiBldmVyeSBtb2Rlcm4gd2Vic2l0ZSBcdTIwMTQgaW5jbHVkaW5nIFNraWxsVmFsaXguPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEyOiBDYW4gSSB1c2UgQ1NTIEdyaWQgZm9yIGFsbCBteSBsYXlvdXRzPzwvc3Ryb25nPjxici8+XG4gICAgICBUZWNobmljYWxseSB5ZXMsIGJ1dCBHcmlkIGhhcyBtb3JlIHN5bnRheCBvdmVyaGVhZCBmb3Igc2ltcGxlIG9uZS1kaW1lbnNpb25hbCBjYXNlcy4gVXNpbmcgPGNvZGU+ZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgMWZyKTwvY29kZT4gd2hlbiA8Y29kZT5kaXNwbGF5OiBmbGV4PC9jb2RlPiB3b3VsZCBhY2hpZXZlIHRoZSBzYW1lIHdpdGggbGVzcyBjb2RlIGlzIGZpZ2h0aW5nIHRoZSB0b29sLiBVc2UgRmxleGJveCB3aGVuIHlvdSBvbmx5IG5lZWQgb25lIGF4aXMgb2YgY29udHJvbC48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IFdoaWNoIGlzIGJldHRlciBmb3IgcmVzcG9uc2l2ZSBkZXNpZ24/PC9zdHJvbmc+PGJyLz5cbiAgICAgIEJvdGggYXJlIGV4Y2VsbGVudCBmb3IgcmVzcG9uc2l2ZSBkZXNpZ24uIENTUyBHcmlkJ3MgPGNvZGU+cmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDI4MHB4LCAxZnIpKTwvY29kZT4gaXMgdGhlIG1vc3QgcG93ZXJmdWwgc2luZ2xlIHJlc3BvbnNpdmUgbGF5b3V0IHRlY2huaXF1ZSBpbiBDU1MgXHUyMDE0IG5vIG1lZGlhIHF1ZXJpZXMgcmVxdWlyZWQuIEZsZXhib3gncyA8Y29kZT5mbGV4LXdyYXA6IHdyYXA8L2NvZGU+IGlzIGdyZWF0IGZvciBzaW1wbGVyIHJlc3BvbnNpdmUgcm93cy4gT2Z0ZW4gdGhlIGJlc3QgcmVzcG9uc2l2ZSBkZXNpZ25zIHVzZSBib3RoLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RNDogV2hhdCBpcyBDU1MgU3ViZ3JpZCBhbmQgc2hvdWxkIEkgdXNlIGl0Pzwvc3Ryb25nPjxici8+XG4gICAgICBDU1MgU3ViZ3JpZCAodGhlIDxjb2RlPnN1YmdyaWQ8L2NvZGU+IHZhbHVlIGZvciA8Y29kZT5ncmlkLXRlbXBsYXRlLWNvbHVtbnM8L2NvZGU+KSBhbGxvd3MgbmVzdGVkIGdyaWQgaXRlbXMgdG8gYWxpZ24gdG8gdGhlIHBhcmVudCBncmlkJ3MgY29sdW1ucy4gSXQgaXMgZnVsbHkgc3VwcG9ydGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMgYXMgb2YgMjAyMyBhbmQgaXMgZXh0cmVtZWx5IHVzZWZ1bCBmb3IgY2FyZCBncmlkcyB3aGVyZSB5b3Ugd2FudCBpbm5lciBlbGVtZW50cyAodGl0bGVzLCBkZXNjcmlwdGlvbnMsIGJ1dHRvbnMpIHRvIGFsaWduIGFjcm9zcyBkaWZmZXJlbnQtc2l6ZWQgY2FyZHMuIFllcywgdXNlIGl0LjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ05laGEgU2hhcm1hJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wMy0xMlQwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wNVQxODowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ01hcmNoIDEyLCAyMDI2JyxcbiAgICByZWFkVGltZTogJzEzIG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDE1NTAsXG4gICAgY2F0ZWdvcnk6ICdDU1MgJiBEZXNpZ24nLFxuICAgIHRhZ3M6IFsnQ1NTIEdyaWQnLCAnRmxleGJveCcsICdDU1MgTGF5b3V0JywgJ1Jlc3BvbnNpdmUgRGVzaWduJywgJ1dlYiBEZXNpZ24nLCAnQ1NTIFR1dG9yaWFsIDIwMjYnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA3NzIxOTk5NDcyLThlZDQ0MjFjNGFmMj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZxPTgwJnc9MTIwMCcsXG4gICAgaW1hZ2VBbHQ6ICdDU1MgY29kZSBvbiBzY3JlZW4gc2hvd2luZyBncmlkIGFuZCBmbGV4Ym94IGxheW91dCBleGFtcGxlcycsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9jc3MtZ3JpZC12cy1mbGV4Ym94LW1vZGVybi13ZWInLFxuICAgIHJlbGF0ZWRDb3Vyc2U6IHtcbiAgICAgIHRpdGxlOiAnQ1NTIGZvciBCZWdpbm5lcnM6IExlYXJuIFdlYiBTdHlsaW5nIGZyb20gWmVybyB0byBQcm8nLFxuICAgICAgc2x1ZzogJ2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGVhcm4gRmxleGJveCwgR3JpZCwgYW5pbWF0aW9ucyBhbmQgcmVzcG9uc2l2ZSBkZXNpZ24uJ1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnamF2YXNjcmlwdC1kb20tbWFuaXB1bGF0aW9uLXNlY3JldHMnLFxuICAgIHRpdGxlOiAnSmF2YVNjcmlwdCBET00gTWFuaXB1bGF0aW9uIFNlY3JldHMgdGhhdCBQcm8gRGV2ZWxvcGVycyBVc2UgKDIwMjYpJyxcbiAgICBtZXRhVGl0bGU6ICdKYXZhU2NyaXB0IERPTSBNYW5pcHVsYXRpb24gU2VjcmV0cyBQcm8gRGV2ZWxvcGVycyBVc2UgKDIwMjYpIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgJ0Rpc2NvdmVyIHRoZSBtb2Rlcm4sIHBlcmZvcm1hbnQgdGVjaG5pcXVlcyB0byBzZWxlY3QsIHRyYXZlcnNlLCBhbmQgbW9kaWZ5IHRoZSBET00gdXNpbmcgdmFuaWxsYSBKYXZhU2NyaXB0IGluIDIwMjYuIExlYXJuIHF1ZXJ5U2VsZWN0b3IsIERvY3VtZW50RnJhZ21lbnQsIGV2ZW50IGRlbGVnYXRpb24sIGFuZCBNdXRhdGlvbk9ic2VydmVyIFx1MjAxNCB1cGdyYWRlIHlvdXIgSlMgc2tpbGxzIHRvZGF5LicsXG4gICAga2V5d29yZHM6IFtcbiAgICAgICdKYXZhU2NyaXB0IERPTSBtYW5pcHVsYXRpb24nLFxuICAgICAgJ0RPTSB0dXRvcmlhbCAyMDI2JyxcbiAgICAgICd2YW5pbGxhIEphdmFTY3JpcHQgRE9NJyxcbiAgICAgICdxdWVyeVNlbGVjdG9yIHZzIGdldEVsZW1lbnRCeUlkJyxcbiAgICAgICdEb2N1bWVudEZyYWdtZW50IEphdmFTY3JpcHQnLFxuICAgICAgJ2V2ZW50IGRlbGVnYXRpb24gSmF2YVNjcmlwdCcsXG4gICAgICAnSmF2YVNjcmlwdCBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24nLFxuICAgICAgJ011dGF0aW9uT2JzZXJ2ZXIgSmF2YVNjcmlwdCcsXG4gICAgICAnbW9kZXJuIEphdmFTY3JpcHQgdGVjaG5pcXVlcycsXG4gICAgICAnSmF2YVNjcmlwdCBmb3IgYmVnaW5uZXJzIDIwMjYnXG4gICAgXSxcbiAgICBleGNlcnB0OlxuICAgICAgJ1N0b3AgcmVseWluZyBvbiBvbGRlciwgc2xvd2VyIERPTSB0ZWNobmlxdWVzLiBEaXNjb3ZlciB0aGUgbW9kZXJuLCBwZXJmb3JtYW50IHdheXMgdG8gc2VsZWN0LCB0cmF2ZXJzZSwgYW5kIG1vZGlmeSB0aGUgRG9jdW1lbnQgT2JqZWN0IE1vZGVsIHVzaW5nIHZhbmlsbGEgSmF2YVNjcmlwdCBcdTIwMTQgdGhlIHRlY2huaXF1ZXMgc2VuaW9yIGRldmVsb3BlcnMgYWN0dWFsbHkgdXNlIGluIHByb2R1Y3Rpb24uJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIERPTSBpcyBZb3VyIFBsYXlncm91bmQ8L2gyPlxuICAgICAgPHA+VGhlIERvY3VtZW50IE9iamVjdCBNb2RlbCAoRE9NKSBpcyB0aGUgYnJpZGdlIGJldHdlZW4geW91ciBIVE1MIGFuZCB5b3VyIEphdmFTY3JpcHQuIEl0IGlzIGEgbGl2ZSwgaW4tbWVtb3J5IHRyZWUgcmVwcmVzZW50YXRpb24gb2YgeW91ciBwYWdlIFx1MjAxNCBldmVyeSBlbGVtZW50LCBhdHRyaWJ1dGUsIGFuZCB0ZXh0IG5vZGUgaXMgYW4gb2JqZWN0IHlvdSBjYW4gcmVhZCwgbW9kaWZ5LCBvciBkZWxldGUgd2l0aCBKYXZhU2NyaXB0LiBXaGlsZSBmcmFtZXdvcmtzIGxpa2UgUmVhY3QgYW5kIFZ1ZSBhYnN0cmFjdCB0aGUgRE9NIGF3YXkgd2l0aCB2aXJ0dWFsIGRpZmZpbmcsIHVuZGVyc3RhbmRpbmcgaG93IHRvIG1hbmlwdWxhdGUgaXQgZGlyZWN0bHkgaXMgYSBmb3VuZGF0aW9uYWwgc2tpbGwgZXZlcnkgZGV2ZWxvcGVyIG5lZWRzIFx1MjAxNCBiZWNhdXNlIGZyYW1ld29ya3MgYXJlIGJ1aWx0IG9uIHRvcCBvZiBpdC48L3A+XG4gICAgICA8cD5UaGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGEganVuaW9yIGFuZCBhIHNlbmlvciBKYXZhU2NyaXB0IGRldmVsb3BlciBpcyBvZnRlbiBub3Qgd2hhdCB0aGV5IGtub3cgYWJvdXQgdGhlIGxhbmd1YWdlIGl0c2VsZiBcdTIwMTQgaXQgaXMgaG93IGVmZmljaWVudGx5IHRoZXkgaW50ZXJhY3Qgd2l0aCB0aGUgRE9NLiBMZXQgdXMgY292ZXIgZXZlcnkgdGVjaG5pcXVlIHRoYXQgbWF0dGVycy48L3A+XG5cbiAgICAgIDxoMj5TZWxlY3RpbmcgRWxlbWVudHM6IFRoZSBNb2Rlcm4gV2F5PC9oMj5cbiAgICAgIDxwPkZvcmdldCA8Y29kZT5nZXRFbGVtZW50QnlJZDwvY29kZT4sIDxjb2RlPmdldEVsZW1lbnRzQnlDbGFzc05hbWU8L2NvZGU+LCBhbmQgPGNvZGU+Z2V0RWxlbWVudHNCeVRhZ05hbWU8L2NvZGU+LiBUaGVzZSBvbGRlciBBUElzIHJldHVybiA8ZW0+bGl2ZTwvZW0+IEhUTUxDb2xsZWN0aW9ucyBhbmQgaGF2ZSBpbmNvbnNpc3RlbnQgcmV0dXJuIHR5cGVzLiBNb2Rlcm4gSmF2YVNjcmlwdCB1c2VzIHR3byBtZXRob2RzIGZvciBldmVyeXRoaW5nOjwvcD5cblxuICAgICAgPGgzPnF1ZXJ5U2VsZWN0b3IgYW5kIHF1ZXJ5U2VsZWN0b3JBbGw8L2gzPlxuICAgICAgPHByZT48Y29kZT4vLyBTZWxlY3RzIHRoZSBmaXJzdCBtYXRjaGluZyBlbGVtZW50IChyZXR1cm5zIGEgc2luZ2xlIEVsZW1lbnQgb3IgbnVsbClcbmNvbnN0IGFjdGl2ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdiBidXR0b24uYWN0aXZlJyk7XG5cbi8vIFNlbGVjdHMgQUxMIG1hdGNoaW5nIGVsZW1lbnRzIChyZXR1cm5zIGEgc3RhdGljIE5vZGVMaXN0KVxuY29uc3QgYWxsQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY291cnNlLWNhcmQnKTtcblxuLy8gQ29tcGxleCBDU1Mgc2VsZWN0b3JzIHdvcmsgcGVyZmVjdGx5XG5jb25zdCBmaXJzdElucHV0SW5Gb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybTpmaXJzdC1vZi10eXBlIGlucHV0W3R5cGU9XCJlbWFpbFwiXScpO1xuXG4vLyBDb252ZXJ0IE5vZGVMaXN0IHRvIEFycmF5IGZvciBmdWxsIGFycmF5IG1ldGhvZHNcbmNvbnN0IGNhcmRzQXJyYXkgPSBBcnJheS5mcm9tKGFsbENhcmRzKTtcbi8vIG9yXG5jb25zdCBjYXJkc0FycmF5MiA9IFsuLi5hbGxDYXJkc107PC9jb2RlPjwvcHJlPlxuICAgICAgPHA+VGhlIGNyaXRpY2FsIGluc2lnaHQ6IDxjb2RlPnF1ZXJ5U2VsZWN0b3JBbGw8L2NvZGU+IHJldHVybnMgYSA8c3Ryb25nPnN0YXRpYzwvc3Ryb25nPiBOb2RlTGlzdCBcdTIwMTQgaXQgY2FwdHVyZXMgdGhlIGVsZW1lbnRzIGF0IHRoZSBtb21lbnQgb2YgdGhlIGNhbGwgYW5kIGRvZXMgbm90IHVwZGF0ZSBpZiBlbGVtZW50cyBhcmUgYWRkZWQgb3IgcmVtb3ZlZC4gVGhpcyBpcyBhbG1vc3QgYWx3YXlzIHdoYXQgeW91IHdhbnQuPC9wPlxuXG4gICAgICA8aDM+VHJhdmVyc2luZyB0aGUgRE9NIFRyZWU8L2gzPlxuICAgICAgPHByZT48Y29kZT5jb25zdCBjYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdXJzZS1jYXJkJyk7XG5cbi8vIE5hdmlnYXRlIHBhcmVudC9jaGlsZC9zaWJsaW5nIHJlbGF0aW9uc2hpcHNcbmNhcmQucGFyZW50RWxlbWVudDsgICAgICAgICAgLy8gVGhlIGVsZW1lbnQncyBkaXJlY3QgcGFyZW50XG5jYXJkLmNoaWxkcmVuOyAgICAgICAgICAgICAgIC8vIExpdmUgSFRNTENvbGxlY3Rpb24gb2YgZGlyZWN0IGNoaWxkcmVuXG5jYXJkLmZpcnN0RWxlbWVudENoaWxkOyAgICAgIC8vIEZpcnN0IGNoaWxkIGVsZW1lbnRcbmNhcmQubGFzdEVsZW1lbnRDaGlsZDsgICAgICAgLy8gTGFzdCBjaGlsZCBlbGVtZW50XG5jYXJkLm5leHRFbGVtZW50U2libGluZzsgICAgIC8vIE5leHQgc2libGluZyBlbGVtZW50XG5jYXJkLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7IC8vIFByZXZpb3VzIHNpYmxpbmcgZWxlbWVudFxuXG4vLyBDaGVjayBpZiBhbiBlbGVtZW50IG1hdGNoZXMgYSBzZWxlY3RvclxuaWYgKGNhcmQubWF0Y2hlcygnLmZlYXR1cmVkJykpIHsgLyogLi4uICovIH1cblxuLy8gR2V0IGNsb3Nlc3QgYW5jZXN0b3IgbWF0Y2hpbmcgYSBzZWxlY3RvciAodmVyeSB1c2VmdWwgZm9yIGV2ZW50IGRlbGVnYXRpb24pXG5jb25zdCBmb3JtID0gaW5wdXRFbGVtZW50LmNsb3Nlc3QoJ2Zvcm0nKTs8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMj5SZWFkaW5nIGFuZCBXcml0aW5nIENvbnRlbnQ8L2gyPlxuICAgICAgPGgzPnRleHRDb250ZW50IHZzIGlubmVySFRNTCB2cyBpbm5lclRleHQ8L2gzPlxuICAgICAgPHA+VGhpcyBpcyBvbmUgb2YgdGhlIG1vc3QgY29tbW9uIHNvdXJjZXMgb2YgYnVncyBhbmQgc2VjdXJpdHkgdnVsbmVyYWJpbGl0aWVzIGluIEphdmFTY3JpcHQ6PC9wPlxuICAgICAgPHByZT48Y29kZT5jb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xuXG4vLyBcdTI3MDUgdGV4dENvbnRlbnQgXHUyMDE0IHNhZmVzdCwgZmFzdGVzdC4gUmV0dXJucy9zZXRzIEFMTCB0ZXh0LCBpbmNsdWRpbmcgaGlkZGVuIGVsZW1lbnRzLlxuZWwudGV4dENvbnRlbnQgPSAnTmV3IFRpdGxlJztcblxuLy8gXHUyNkEwXHVGRTBGIGlubmVySFRNTCBcdTIwMTQgcGFyc2VzIEhUTUwsIHNvIGl0IGlzIHNsb3dlciBhbmQgYSBzZWN1cml0eSByaXNrIGlmIHRoZSBcbi8vIGNvbnRlbnQgY29tZXMgZnJvbSB1c2VyIGlucHV0IChYU1MgdnVsbmVyYWJpbGl0eSEpXG5lbC5pbm5lckhUTUwgPSAnPHN0cm9uZz5Cb2xkIFRpdGxlPC9zdHJvbmc+JztcblxuLy8gXHUyNkEwXHVGRTBGIGlubmVyVGV4dCBcdTIwMTQgcmV0dXJucyBvbmx5IFZJU0lCTEUgdGV4dCwgdHJpZ2dlcnMgbGF5b3V0IHJlZmxvdy4gU2xvdy5cbi8vIFVzZSB0ZXh0Q29udGVudCB1bmxlc3MgeW91IG5lZWQgdG8gZXhjbHVkZSBoaWRkZW4gdGV4dC48L2NvZGU+PC9wcmU+XG4gICAgICA8cD48c3Ryb25nPlNlY3VyaXR5IHJ1bGU6PC9zdHJvbmc+IE5ldmVyIHNldCA8Y29kZT5pbm5lckhUTUw8L2NvZGU+IHdpdGggY29udGVudCB0aGF0IGNvbWVzIGZyb20gYSB1c2VyIFx1MjAxNCB0aGlzIGlzIGEgY2xhc3NpYyBYU1MgKENyb3NzLVNpdGUgU2NyaXB0aW5nKSBhdHRhY2sgdmVjdG9yLiBBbHdheXMgdXNlIDxjb2RlPnRleHRDb250ZW50PC9jb2RlPiBmb3IgdXNlci1wcm92aWRlZCBzdHJpbmdzLjwvcD5cblxuICAgICAgPGgyPk1vZGlmeWluZyBTdHlsZXMgYW5kIENsYXNzZXM8L2gyPlxuICAgICAgPHByZT48Y29kZT5jb25zdCBjYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQnKTtcblxuLy8gXHUyNzA1IFVzZSBjbGFzc0xpc3QgbWV0aG9kcyBcdTIwMTQgY2xlYW5lciB0aGFuIG1hbmlwdWxhdGluZyBjbGFzc05hbWUgc3RyaW5nc1xuY2FyZC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbmNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5jYXJkLmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJyk7ICAgICAgIC8vIEFkZHMgaWYgYWJzZW50LCByZW1vdmVzIGlmIHByZXNlbnRcbmNhcmQuY2xhc3NMaXN0LnJlcGxhY2UoJ29sZCcsICduZXcnKTtcbmNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKTsgICAgICAgLy8gUmV0dXJucyBib29sZWFuXG5cbi8vIEFkZCBpbmxpbmUgc3R5bGVzIChvbmx5IHdoZW4gZHluYW1pYyB2YWx1ZXMgcmVxdWlyZSBpdClcbmNhcmQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLThweCknO1xuY2FyZC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1jYXJkLWNvbG9yJywgJyM0ZjQ2ZTUnKTsgLy8gU2V0IENTUyBjdXN0b20gcHJvcGVydHlcblxuLy8gUmVhZCBjb21wdXRlZCBzdHlsZXMgKHdoYXQgdGhlIGJyb3dzZXIgYWN0dWFsbHkgcmVuZGVycylcbmNvbnN0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoY2FyZCk7XG5jb25zb2xlLmxvZyhzdHlsZXMuZm9udFNpemUpOyAvLyAnMTZweCc8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMj5FZmZpY2llbnQgRE9NIFVwZGF0ZXM6IFRoZSBEb2N1bWVudEZyYWdtZW50IFBhdHRlcm48L2gyPlxuICAgICAgPHA+RGlyZWN0bHkgbW9kaWZ5aW5nIHRoZSBsaXZlIERPTSBpcyB0aGUgbW9zdCBleHBlbnNpdmUgb3BlcmF0aW9uIGluIEphdmFTY3JpcHQuIEV2ZXJ5IGluc2VydGlvbiB0cmlnZ2VycyB0aGUgYnJvd3NlciB0byByZWNhbGN1bGF0ZSBsYXlvdXQgKHJlZmxvdykgYW5kIHJlcGFpbnQgdGhlIHNjcmVlbi4gSWYgeW91IGluc2VydCA1MCBlbGVtZW50cyBvbmUgYnkgb25lIGluIGEgbG9vcCwgeW91IHRyaWdnZXIgNTAgcmVmbG93cy4gVGhlIHNvbHV0aW9uIGlzIDxjb2RlPkRvY3VtZW50RnJhZ21lbnQ8L2NvZGU+OjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIEJhZCBcdTIwMTQgNTAgcmVmbG93c1xuY29uc3QgbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3Vyc2UtbGlzdCcpO1xuY291cnNlcy5mb3JFYWNoKGNvdXJzZSA9PiB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgbGkudGV4dENvbnRlbnQgPSBjb3Vyc2UudGl0bGU7XG4gIGxpc3QuYXBwZW5kQ2hpbGQobGkpOyAvLyBSZWZsb3cgb24gZXZlcnkgY2FsbCFcbn0pO1xuXG4vLyBcdTI3MDUgR29vZCBcdTIwMTQgZXhhY3RseSAxIHJlZmxvd1xuY29uc3QgbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3Vyc2UtbGlzdCcpO1xuY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbmNvdXJzZXMuZm9yRWFjaChjb3Vyc2UgPT4ge1xuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGxpLnRleHRDb250ZW50ID0gY291cnNlLnRpdGxlO1xuICBmcmFnbWVudC5hcHBlbmRDaGlsZChsaSk7IC8vIE5vIHJlZmxvdyBcdTIwMTQgZnJhZ21lbnQgaXMgTk9UIGluIHRoZSBsaXZlIERPTVxufSk7XG5cbmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpOyAvLyBPbmUgcmVmbG93IHRvdGFsPC9jb2RlPjwvcHJlPlxuICAgICAgPHA+Rm9yIGV2ZW4gYmV0dGVyIHBlcmZvcm1hbmNlIHdoZW4gaW5zZXJ0aW5nIGxhcmdlIGFtb3VudHMgb2YgSFRNTCwgdXNlIDxjb2RlPmluc2VydEFkamFjZW50SFRNTDwvY29kZT4gXHUyMDE0IGl0IGlzIGZhc3RlciB0aGFuIDxjb2RlPmlubmVySFRNTDwvY29kZT4gYmVjYXVzZSBpdCBkb2VzIG5vdCBkZXN0cm95IGFuZCByZWNyZWF0ZSBleGlzdGluZyBET006PC9wPlxuICAgICAgPHByZT48Y29kZT4vLyBJbnNlcnQgSFRNTCB3aXRob3V0IGRlc3Ryb3lpbmcgZXhpc3RpbmcgY29udGVudFxubGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICc8bGk+TmV3IENvdXJzZTwvbGk+Jyk7XG4vLyBQb3NpdGlvbnM6ICdiZWZvcmViZWdpbicsICdhZnRlcmJlZ2luJywgJ2JlZm9yZWVuZCcsICdhZnRlcmVuZCc8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMj5FdmVudCBIYW5kbGluZzogVGhlIFJpZ2h0IFdheTwvaDI+XG5cbiAgICAgIDxoMz5hZGRFdmVudExpc3RlbmVyIHZzIG9uY2xpY2s8L2gzPlxuICAgICAgPHByZT48Y29kZT4vLyBcdTI3NEMgT2xkIHdheSBcdTIwMTQgb25jbGljayBwcm9wZXJ0eSAob25seSBvbmUgaGFuZGxlciBwZXIgZWxlbWVudClcbmJ1dHRvbi5vbmNsaWNrID0gaGFuZGxlQ2xpY2s7XG5cbi8vIFx1MjcwNSBNb2Rlcm4gd2F5IFx1MjAxNCBhZGRFdmVudExpc3RlbmVyIChtdWx0aXBsZSBoYW5kbGVycywgbW9yZSBjb250cm9sKVxuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2xpY2spO1xuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQW5hbHl0aWNzKTsgLy8gQm90aCB3aWxsIGZpcmVcblxuLy8gUmVtb3ZlIGEgbGlzdGVuZXIgKG11c3QgcGFzcyB0aGUgc2FtZSBmdW5jdGlvbiByZWZlcmVuY2UpXG5idXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGljayk7XG5cbi8vIE9uZS10aW1lIGxpc3RlbmVyIChhdXRvLXJlbW92ZXMgYWZ0ZXIgZmlyc3QgdHJpZ2dlcilcbmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZUNsaWNrLCB7IG9uY2U6IHRydWUgfSk7PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+RXZlbnQgRGVsZWdhdGlvbjogVGhlIFBlcmZvcm1hbmNlIFN1cGVycG93ZXI8L2gzPlxuICAgICAgPHA+RXZlbnQgZGVsZWdhdGlvbiBpcyB0aGUgc2luZ2xlIG1vc3QgaW1wYWN0ZnVsIERPTSBwZXJmb3JtYW5jZSBwYXR0ZXJuLiBJbnN0ZWFkIG9mIGF0dGFjaGluZyBpbmRpdmlkdWFsIGxpc3RlbmVycyB0byBlYWNoIGl0ZW0gaW4gYSBsaXN0ICh3aGljaCB3YXN0ZXMgbWVtb3J5IGFuZCBkb2VzIG5vdCB3b3JrIGZvciBkeW5hbWljYWxseSBhZGRlZCBpdGVtcyksIHlvdSBhdHRhY2ggT05FIGxpc3RlbmVyIHRvIGEgcGFyZW50IGVsZW1lbnQgYW5kIHVzZSB0aGUgZXZlbnQgb2JqZWN0IHRvIGRldGVybWluZSB3aGF0IHdhcyBjbGlja2VkOjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIEJhZCBcdTIwMTQgMTAwIGxpc3RlbmVycyBmb3IgMTAwIGl0ZW1zLCBhbmQgbmV3IGl0ZW1zIHdvbid0IHdvcmtcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb3Vyc2UtY2FyZCcpLmZvckVhY2goY2FyZCA9PiB7XG4gIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IC8qIC4uLiAqLyB9KTtcbn0pO1xuXG4vLyBcdTI3MDUgR29vZCBcdTIwMTQgMSBsaXN0ZW5lciBoYW5kbGVzIGFsbCBjYXJkcywgaW5jbHVkaW5nIGZ1dHVyZSBvbmVzXG5jb25zdCBncmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdXJzZXMtZ3JpZCcpO1xuXG5ncmlkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gIC8vIEZpbmQgdGhlIGNsb3Nlc3QgLmNvdXJzZS1jYXJkIGFuY2VzdG9yIG9mIHRoZSBjbGlja2VkIGVsZW1lbnRcbiAgY29uc3QgY2FyZCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuY291cnNlLWNhcmQnKTtcbiAgaWYgKCFjYXJkKSByZXR1cm47IC8vIENsaWNrIHdhcyBvdXRzaWRlIGEgY2FyZFxuXG4gIGNvbnN0IGNvdXJzZUlkID0gY2FyZC5kYXRhc2V0LmNvdXJzZUlkO1xuICBuYXZpZ2F0ZVRvQ291cnNlKGNvdXJzZUlkKTtcbn0pOzwvY29kZT48L3ByZT5cbiAgICAgIDxwPkV2ZW50IGRlbGVnYXRpb24gd29ya3MgYmVjYXVzZSBvZiA8c3Ryb25nPmV2ZW50IGJ1YmJsaW5nPC9zdHJvbmc+OiBldmVudHMgZmlyZSBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQgYW5kIHRoZW4gXCJidWJibGUgdXBcIiB0aHJvdWdoIGV2ZXJ5IGFuY2VzdG9yIGVsZW1lbnQuIEEgY2xpY2sgb24gYSBidXR0b24gZmlyZXMgb24gdGhlIGJ1dHRvbiwgdGhlbiB0aGUgY2FyZCwgdGhlbiB0aGUgZ3JpZCwgdGhlbiB0aGUgYm9keSwgdGhlbiB0aGUgZG9jdW1lbnQuPC9wPlxuXG4gICAgICA8aDI+V2F0Y2hpbmcgRE9NIENoYW5nZXM6IE11dGF0aW9uT2JzZXJ2ZXI8L2gyPlxuICAgICAgPHA+U29tZXRpbWVzIHlvdSBuZWVkIHRvIHJlYWN0IHdoZW4gdGhlIERPTSBjaGFuZ2VzIFx1MjAxNCBmb3IgZXhhbXBsZSwgd2hlbiBhIHRoaXJkLXBhcnR5IHNjcmlwdCBhZGRzIGFuIGVsZW1lbnQsIG9yIHdoZW4gYSBmcmFtZXdvcmsgcmVuZGVycyBjb250ZW50IGFzeW5jaHJvbm91c2x5LiA8Y29kZT5NdXRhdGlvbk9ic2VydmVyPC9jb2RlPiBpcyB0aGUgbW9kZXJuIEFQSSBmb3IgdGhpczo8L3A+XG4gICAgICA8cHJlPjxjb2RlPmNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAvLyBDaGVjayBmb3IgYWRkZWQgbm9kZXNcbiAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUubWF0Y2hlcygnLm5vdGlmaWNhdGlvbicpKSB7XG4gICAgICAgIGhhbmRsZU5ld05vdGlmaWNhdGlvbihub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8gU3RhcnQgb2JzZXJ2aW5nIGEgdGFyZ2V0IGVsZW1lbnRcbm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICBjaGlsZExpc3Q6IHRydWUsICAvLyBXYXRjaCBmb3IgYWRkZWQvcmVtb3ZlZCBjaGlsZHJlblxuICBzdWJ0cmVlOiB0cnVlLCAgICAvLyBXYXRjaCBhbGwgZGVzY2VuZGFudHNcbn0pO1xuXG4vLyBTdG9wIHdoZW4gZG9uZSAoaW1wb3J0YW50IGZvciBtZW1vcnkgbWFuYWdlbWVudCEpXG5vYnNlcnZlci5kaXNjb25uZWN0KCk7PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDI+QXN5bmMgRE9NIFBhdHRlcm5zOiBJbnRlcnNlY3Rpb24gT2JzZXJ2ZXI8L2gyPlxuICAgICAgPHA+VGhlIDxjb2RlPkludGVyc2VjdGlvbk9ic2VydmVyPC9jb2RlPiBBUEkgbGV0cyB5b3UgZWZmaWNpZW50bHkgZGV0ZWN0IHdoZW4gYW4gZWxlbWVudCBlbnRlcnMgb3IgbGVhdmVzIHRoZSB2aWV3cG9ydCBcdTIwMTQgd2l0aG91dCBhbnkgc2Nyb2xsIGV2ZW50IGxpc3RlbmVycyAod2hpY2ggYXJlIGV4cGVuc2l2ZSk6PC9wPlxuICAgICAgPHByZT48Y29kZT4vLyBMYXp5IGxvYWQgaW1hZ2VzIFx1MjAxNCBvbmx5IGZldGNoIHdoZW4gdGhleSBlbnRlciB0aGUgdmlld3BvcnRcbmNvbnN0IGltYWdlT2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgY29uc3QgaW1nID0gZW50cnkudGFyZ2V0O1xuICAgICAgaW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYzsgLy8gTG9hZCB0aGUgcmVhbCBpbWFnZVxuICAgICAgaW1hZ2VPYnNlcnZlci51bm9ic2VydmUoaW1nKTsgLy8gU3RvcCB3YXRjaGluZyBvbmNlIGxvYWRlZFxuICAgIH1cbiAgfSk7XG59LCB7IHJvb3RNYXJnaW46ICcyMDBweCcgfSk7IC8vIFN0YXJ0IGxvYWRpbmcgMjAwcHggYmVmb3JlIHZpc2libGVcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtc3JjXScpLmZvckVhY2goaW1nID0+IHtcbiAgaW1hZ2VPYnNlcnZlci5vYnNlcnZlKGltZyk7XG59KTs8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMj5UaGUgY29tcGxldGUgRE9NIEFQSSBDaGVhdCBTaGVldDwvaDI+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPlNlbGVjdCBvbmU6PC9zdHJvbmc+IDxjb2RlPmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlNlbGVjdCBhbGw6PC9zdHJvbmc+IDxjb2RlPmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkNyZWF0ZTo8L3N0cm9uZz4gPGNvZGU+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+QXBwZW5kOjwvc3Ryb25nPiA8Y29kZT5wYXJlbnQuYXBwZW5kQ2hpbGQoZWwpPC9jb2RlPiBvciA8Y29kZT5wYXJlbnQuYXBwZW5kKGVsLCB0ZXh0KTwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5SZW1vdmU6PC9zdHJvbmc+IDxjb2RlPmVsLnJlbW92ZSgpPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlJlcGxhY2U6PC9zdHJvbmc+IDxjb2RlPnBhcmVudC5yZXBsYWNlQ2hpbGQobmV3RWwsIG9sZEVsKTwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5DbG9uZTo8L3N0cm9uZz4gPGNvZGU+ZWwuY2xvbmVOb2RlKHRydWUpPC9jb2RlPiAoZGVlcCBjbG9uZSk8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5HZXQgYXR0cmlidXRlOjwvc3Ryb25nPiA8Y29kZT5lbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5TZXQgYXR0cmlidXRlOjwvc3Ryb25nPiA8Y29kZT5lbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCAnNDInKTwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5EYXRhIGF0dHJpYnV0ZXM6PC9zdHJvbmc+IDxjb2RlPmVsLmRhdGFzZXQuY291cnNlSWQ8L2NvZGU+IChyZWFkcyA8Y29kZT5kYXRhLWNvdXJzZS1pZDwvY29kZT4pPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5SZWxhdGVkIExlYXJuaW5nPC9oMj5cbiAgICAgIDxwPkRPTSBtYW5pcHVsYXRpb24gd29ya3MgYmVzdCB3aGVuIHlvdSB1bmRlcnN0YW5kIHRoZSBIVE1MIHN0cnVjdHVyZSB1bmRlcm5lYXRoIGl0LiBSZWFkIG91ciA8YSBocmVmPVwiL2Jsb2cvbWFzdGVyaW5nLWh0bWw1LXNlbWFudGljLXRhZ3Mtc2VvXCI+SFRNTDUgc2VtYW50aWMgdGFncyBndWlkZTwvYT4gdG8gdW5kZXJzdGFuZCB3aGF0IHlvdSBhcmUgc2VsZWN0aW5nLCBhbmQgb3VyIDxhIGhyZWY9XCIvYmxvZy9jc3MtYW5pbWF0aW9ucy1taWNyby1pbnRlcmFjdGlvbnMtZ3VpZGVcIj5DU1MgbWljcm8gYW5pbWF0aW9ucyBndWlkZTwvYT4gdG8gbGVhcm4gaG93IHRvIHRyaWdnZXIgQ1NTIGFuaW1hdGlvbnMgZnJvbSBKYXZhU2NyaXB0IHVzaW5nIDxjb2RlPmNsYXNzTGlzdDwvY29kZT4uPC9wPlxuICAgICAgPHA+VG8gbWFzdGVyIEphdmFTY3JpcHQgZnJvbSBzY3JhdGNoIFx1MjAxNCB2YXJpYWJsZXMsIGZ1bmN0aW9ucywgY2xvc3VyZXMsIGFzeW5jL2F3YWl0LCBhbmQgRE9NIG1hbmlwdWxhdGlvbiBcdTIwMTQgZW5yb2wgaW4gdGhlIGNvbXBsZXRlbHkgZnJlZSA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3M8L2E+IG9uIFNraWxsVmFsaXguIEl0IGVuZHMgd2l0aCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUgeW91IGNhbiBhdHRhY2ggdG8geW91ciBMaW5rZWRJbiBwcm9maWxlLjwvcD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zPC9oMj5cblxuICAgICAgPHA+PHN0cm9uZz5RMTogU2hvdWxkIEkgc3RpbGwgbGVhcm4gRE9NIG1hbmlwdWxhdGlvbiBpZiBJIHVzZSBSZWFjdD88L3N0cm9uZz48YnIvPlxuICAgICAgQWJzb2x1dGVseS4gUmVhY3QncyB2aXJ0dWFsIERPTSBpcyBhbiBhYnN0cmFjdGlvbiBidWlsdCBvbiB0b3Agb2YgcmVhbCBET00gQVBJcy4gV2hlbiB5b3UgZmFjZSBhIHByb2JsZW0gUmVhY3QgY2FuJ3Qgc29sdmUgY2xlYW5seSBcdTIwMTQgaW50ZWdyYXRpbmcgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5LCBtYW5pcHVsYXRpbmcgYSBjYW52YXMsIG9yIG9wdGltaXNpbmcgYSBjcml0aWNhbCByZW5kZXJpbmcgcGF0aCBcdTIwMTQgeW91IG5lZWQgZGlyZWN0IERPTSBrbm93bGVkZ2UuIFNlbmlvciBSZWFjdCBkZXZlbG9wZXJzIHJlYWNoIGZvciB0aGUgRE9NIHJlZ3VsYXJseS48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTI6IFdoYXQgaXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBnZXRFbGVtZW50QnlJZCBhbmQgcXVlcnlTZWxlY3Rvcj88L3N0cm9uZz48YnIvPlxuICAgICAgPGNvZGU+Z2V0RWxlbWVudEJ5SWQ8L2NvZGU+IGlzIG1hcmdpbmFsbHkgZmFzdGVyIGZvciBJRCBsb29rdXBzIGJlY2F1c2UgaXQgaGFzIGEgZGVkaWNhdGVkIGludGVybmFsIGluZGV4LiBCdXQgPGNvZGU+cXVlcnlTZWxlY3RvcjwvY29kZT4gaXMgZmFyIG1vcmUgZmxleGlibGUgKGl0IGFjY2VwdHMgYW55IENTUyBzZWxlY3RvciksIHJldHVybnMgPGNvZGU+bnVsbDwvY29kZT4gaW5zdGVhZCBvZiA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGZvciBtaXNzaW5nIGVsZW1lbnRzLCBhbmQgaGFzIGEgY29uc2lzdGVudCBBUEkgd2l0aCA8Y29kZT5xdWVyeVNlbGVjdG9yQWxsPC9jb2RlPi4gSW4gMjAyNiwgdXNlIDxjb2RlPnF1ZXJ5U2VsZWN0b3I8L2NvZGU+IGV4Y2x1c2l2ZWx5IHVubGVzcyB5b3UgbmVlZCB0aGUgYWJzb2x1dGUgbWF4aW11bSBwZXJmb3JtYW5jZSBpbiBhIHRpZ2h0IGxvb3AuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBJcyBpbm5lckhUTUwgc2FmZSB0byB1c2U/PC9zdHJvbmc+PGJyLz5cbiAgICAgIE9ubHkgaWYgdGhlIEhUTUwgY29udGVudCBpcyBlbnRpcmVseSB1bmRlciB5b3VyIGNvbnRyb2wuIElmIGFueSBwYXJ0IG9mIHRoZSBIVE1MIHN0cmluZyBjb21lcyBmcm9tIHVzZXIgaW5wdXQgKGEgc2VhcmNoIHRlcm0sIGEgZm9ybSBmaWVsZCwgYSBVUkwgcGFyYW1ldGVyKSwgeW91IG11c3Qgc2FuaXRpc2UgaXQgZmlyc3QgdXNpbmcgdGhlIDxjb2RlPkRPTVB1cmlmeTwvY29kZT4gbGlicmFyeSBvciB1c2UgPGNvZGU+dGV4dENvbnRlbnQ8L2NvZGU+IGluc3RlYWQuIFNldHRpbmcgcmF3IHVzZXIgaW5wdXQgdmlhIDxjb2RlPmlubmVySFRNTDwvY29kZT4gaXMgYSB0ZXh0Ym9vayBYU1MgdnVsbmVyYWJpbGl0eS48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTQ6IFdoYXQgaXMgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgYW5kIHdoZW4gc2hvdWxkIEkgdXNlIGl0Pzwvc3Ryb25nPjxici8+XG4gICAgICA8Y29kZT5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTwvY29kZT4gc3RvcHMgdGhlIGV2ZW50IGZyb20gYnViYmxpbmcgdXAgdG8gcGFyZW50IGVsZW1lbnRzLiBVc2UgaXQgc3BhcmluZ2x5IFx1MjAxNCBpdCBjYW4gYnJlYWsgZXZlbnQgZGVsZWdhdGlvbiBwYXR0ZXJucyBhbmQgbWFrZSBkZWJ1Z2dpbmcgZGlmZmljdWx0LiBUaGUgb25seSB2YWxpZCBjYXNlIGlzIHdoZW4geW91IGdlbnVpbmVseSBuZWVkIHRvIHByZXZlbnQgYSBwYXJlbnQgaGFuZGxlciBmcm9tIGZpcmluZyBmb3IgYSBzcGVjaWZpYyBjaGlsZCBpbnRlcmFjdGlvbiwgbGlrZSBhIGRlbGV0ZSBidXR0b24gaW5zaWRlIGEgY2xpY2thYmxlIGNhcmQuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnQW1pdCBQYXRlbCcsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDMtMDhUMDk6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDQtMDVUMTg6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdNYXJjaCAwOCwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxNCBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxNjIwLFxuICAgIGNhdGVnb3J5OiAnSmF2YVNjcmlwdCcsXG4gICAgdGFnczogWydKYXZhU2NyaXB0IERPTScsICdWYW5pbGxhIEphdmFTY3JpcHQnLCAnV2ViIFBlcmZvcm1hbmNlJywgJ0Zyb250ZW5kIERldmVsb3BtZW50JywgJ0phdmFTY3JpcHQgVHV0b3JpYWwgMjAyNicsICdFdmVudCBEZWxlZ2F0aW9uJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1NTA5OTk2Mi00MTk5YzM0NWU1ZGQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnSmF2YVNjcmlwdCBjb2RlIG9uIGEgZGFyayBlZGl0b3Igc2NyZWVuIHNob3dpbmcgRE9NIG1hbmlwdWxhdGlvbiB0ZWNobmlxdWVzJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL2phdmFzY3JpcHQtZG9tLW1hbmlwdWxhdGlvbi1zZWNyZXRzJyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1VsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3MnLFxuICAgICAgc2x1ZzogJ3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXN0ZXIgVmFuaWxsYSBKUywgRE9NIG1hbmlwdWxhdGlvbiwgY2xvc3VyZXMsIGFzeW5jL2F3YWl0IGFuZCBtb3JlIFx1MjAxNCBmcmVlIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlLidcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ3B5dGhvbi1iZWdpbm5lci1taXN0YWtlcy10by1hdm9pZCcsXG4gICAgdGl0bGU6ICcxMCBQeXRob24gTWlzdGFrZXMgRXZlcnkgQmVnaW5uZXIgTWFrZXMgKEFuZCBIb3cgdG8gRml4IFRoZW0pJyxcbiAgICBtZXRhVGl0bGU6ICcxMCBQeXRob24gTWlzdGFrZXMgRXZlcnkgQmVnaW5uZXIgTWFrZXMgJiBIb3cgdG8gRml4IFRoZW0gKDIwMjYpIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgJ0F2b2lkIHRoZSBtb3N0IGNvbW1vbiBQeXRob24gYmVnaW5uZXIgbWlzdGFrZXMgaW4gMjAyNi4gRnJvbSBtdXRhYmxlIGRlZmF1bHQgYXJndW1lbnRzIHRvIGJhcmUgZXhjZXB0aW9ucyBcdTIwMTQgbGVhcm4gaG93IHRvIHdyaXRlIGNsZWFuLCBQeXRob25pYyBjb2RlIGZyb20gZGF5IG9uZS4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnUHl0aG9uIGJlZ2lubmVyIG1pc3Rha2VzJyxcbiAgICAgICdQeXRob24gdGlwcyAyMDI2JyxcbiAgICAgICdQeXRob24gdHV0b3JpYWwgZm9yIGJlZ2lubmVycycsXG4gICAgICAnUHl0aG9uaWMgY29kZScsXG4gICAgICAnUHl0aG9uIGJlc3QgcHJhY3RpY2VzJyxcbiAgICAgICdQeXRob24gbGlzdCBjb21wcmVoZW5zaW9uJyxcbiAgICAgICdQeXRob24gY29udGV4dCBtYW5hZ2VyJyxcbiAgICAgICdsZWFybiBQeXRob24nLFxuICAgIF0sXG4gICAgZXhjZXJwdDpcbiAgICAgICdXcml0aW5nIFB5dGhvbiBjb2RlIGlzIGVhc3kgXHUyMDE0IHdyaXRpbmcgaXQgY29ycmVjdGx5IGlzIGFub3RoZXIgc3RvcnkuIEF2b2lkIHRoZXNlIGNvbW1vbiBiZWdpbm5lciBwaXRmYWxscyBhbmQgaW5zdGFudGx5IGxldmVsIHVwIHlvdXIgUHl0aG9uIHNraWxscyB3aXRoIGNsZWFuLCBwcm9mZXNzaW9uYWwgaGFiaXRzLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPlB5dGhvbiBMb29rcyBFYXN5IFx1MjAxNCBVbnRpbCBJdCBJc24ndDwvaDI+XG4gICAgICA8cD5QeXRob24gaXMgZmFtb3VzIGZvciBpdHMgYmVnaW5uZXItZnJpZW5kbHkgc3ludGF4LiBCdXQgdGhhdCBzaW1wbGljaXR5IGNhbiBiZSBkZWNlaXZpbmcuIE1hbnkgYmVnaW5uZXJzIHBpY2sgdXAgYmFkIGhhYml0cyBlYXJseSB0aGF0IGNhdXNlIGhhcmQtdG8tZGVidWcgYnVncyBsYXRlci4gTGV0J3MgZml4IHRoZW0gcmlnaHQgbm93LjwvcD5cblxuICAgICAgPGgzPjEuIFVzaW5nID09IHRvIENvbXBhcmUgSW5zdGVhZCBvZiBpczwvaDM+XG4gICAgICA8cD5CZWdpbm5lcnMgb2Z0ZW4gdXNlIDxjb2RlPj09PC9jb2RlPiB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIDxjb2RlPk5vbmU8L2NvZGU+LCA8Y29kZT5UcnVlPC9jb2RlPiwgb3IgPGNvZGU+RmFsc2U8L2NvZGU+LiBUaGUgY29ycmVjdCBhbmQgUHl0aG9uaWMgd2F5IGlzIHRvIHVzZSA8Y29kZT5pczwvY29kZT4gZm9yIGlkZW50aXR5IGNoZWNrcy48L3A+XG4gICAgICA8cHJlPjxjb2RlPiMgXHUyNzRDIFdyb25nXG5pZiByZXN1bHQgPT0gTm9uZTpcbiAgICBwcmludChcIk5vIHJlc3VsdFwiKVxuXG4jIFx1MjcwNSBDb3JyZWN0XG5pZiByZXN1bHQgaXMgTm9uZTpcbiAgICBwcmludChcIk5vIHJlc3VsdFwiKTwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPjIuIE11dGFibGUgRGVmYXVsdCBBcmd1bWVudHMgaW4gRnVuY3Rpb25zPC9oMz5cbiAgICAgIDxwPlRoaXMgaXMgb25lIG9mIFB5dGhvbidzIG1vc3Qgbm90b3Jpb3VzIHRyYXBzLiBOZXZlciB1c2UgYSBtdXRhYmxlIG9iamVjdCBsaWtlIGEgbGlzdCBvciBkaWN0aW9uYXJ5IGFzIGEgZGVmYXVsdCBwYXJhbWV0ZXIgdmFsdWUuIEl0IGlzIGNyZWF0ZWQgb25jZSBhbmQgc2hhcmVkIGFjcm9zcyBhbGwgY2FsbHMgdG8gdGhlIGZ1bmN0aW9uLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+IyBcdTI3NEMgV3JvbmcgXHUyMDE0IHRoZSBzYW1lIGxpc3QgcGVyc2lzdHMgYWNyb3NzIGNhbGxzIVxuZGVmIGFkZF9pdGVtKGl0ZW0sIGNhcnQ9W10pOlxuICAgIGNhcnQuYXBwZW5kKGl0ZW0pXG4gICAgcmV0dXJuIGNhcnRcblxuIyBcdTI3MDUgQ29ycmVjdCBcdTIwMTQgdXNlIE5vbmUgYXMgZGVmYXVsdCwgY3JlYXRlIGluc2lkZVxuZGVmIGFkZF9pdGVtKGl0ZW0sIGNhcnQ9Tm9uZSk6XG4gICAgaWYgY2FydCBpcyBOb25lOlxuICAgICAgICBjYXJ0ID0gW11cbiAgICBjYXJ0LmFwcGVuZChpdGVtKVxuICAgIHJldHVybiBjYXJ0PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+My4gTm90IFVzaW5nIExpc3QgQ29tcHJlaGVuc2lvbnM8L2gzPlxuICAgICAgPHA+QSB0cmFkaXRpb25hbCBsb29wIHRvIGJ1aWxkIGEgbGlzdCBpcyB2ZXJib3NlIGFuZCBzbG93LiBQeXRob24ncyBsaXN0IGNvbXByZWhlbnNpb25zIGFyZSBub3QganVzdCBzaG9ydGVyIFx1MjAxNCB0aGV5IGFyZSBhbHNvIGZhc3RlciB1bmRlciB0aGUgaG9vZCBiZWNhdXNlIHRoZXkgYXJlIG9wdGltaXNlZCBhdCB0aGUgaW50ZXJwcmV0ZXIgbGV2ZWwuPC9wPlxuICAgICAgPHByZT48Y29kZT4jIFx1Mjc0QyBWZXJib3NlIHdheVxuc3F1YXJlcyA9IFtdXG5mb3IgaSBpbiByYW5nZSgxLCAxMSk6XG4gICAgc3F1YXJlcy5hcHBlbmQoaSAqKiAyKVxuXG4jIFx1MjcwNSBQeXRob25pYyB3YXkgXHUyMDE0IGxpc3QgY29tcHJlaGVuc2lvblxuc3F1YXJlcyA9IFtpICoqIDIgZm9yIGkgaW4gcmFuZ2UoMSwgMTEpXVxucHJpbnQoc3F1YXJlcykgICMgWzEsIDQsIDksIDE2LCAyNSwgMzYsIDQ5LCA2NCwgODEsIDEwMF08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz40LiBDYXRjaGluZyBCYXJlIEV4Y2VwdGlvbnM8L2gzPlxuICAgICAgPHA+V3JpdGluZyA8Y29kZT5leGNlcHQ6PC9jb2RlPiB3aXRoIG5vIGV4Y2VwdGlvbiB0eXBlIHNpbGVudGx5IHN3YWxsb3dzIGV2ZXJ5IGVycm9yIFx1MjAxNCBpbmNsdWRpbmcga2V5Ym9hcmQgaW50ZXJydXB0cyBhbmQgc3lzdGVtIGV4aXRzLiBBbHdheXMgc3BlY2lmeSB3aGljaCBleGNlcHRpb24geW91IGV4cGVjdC48L3A+XG4gICAgICA8cHJlPjxjb2RlPiMgXHUyNzRDIFdyb25nIFx1MjAxNCBjYXRjaGVzIGxpdGVyYWxseSBldmVyeXRoaW5nXG50cnk6XG4gICAgcmVzdWx0ID0gMTAgLyAwXG5leGNlcHQ6XG4gICAgcHJpbnQoXCJTb21ldGhpbmcgd2VudCB3cm9uZ1wiKVxuXG4jIFx1MjcwNSBDb3JyZWN0IFx1MjAxNCBzcGVjaWZpYyBhbmQgaW5mb3JtYXRpdmVcbnRyeTpcbiAgICByZXN1bHQgPSAxMCAvIDBcbmV4Y2VwdCBaZXJvRGl2aXNpb25FcnJvciBhcyBlOlxuICAgIHByaW50KGZcIk1hdGggZXJyb3I6IHtlfVwiKTwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPjUuIE9wZW5pbmcgRmlsZXMgV2l0aG91dCBhIENvbnRleHQgTWFuYWdlcjwvaDM+XG4gICAgICA8cD5Gb3JnZXR0aW5nIHRvIGNsb3NlIGEgZmlsZSBsZWFkcyB0byBtZW1vcnkgbGVha3MgYW5kIGRhdGEgY29ycnVwdGlvbi4gQWx3YXlzIHVzZSA8Y29kZT53aXRoIG9wZW4oKTwvY29kZT4gXHUyMDE0IGl0IGd1YXJhbnRlZXMgdGhlIGZpbGUgaXMgY2xvc2VkIGF1dG9tYXRpY2FsbHksIGV2ZW4gaWYgYW4gZXJyb3Igb2NjdXJzIGluc2lkZSB0aGUgYmxvY2suPC9wPlxuICAgICAgPHByZT48Y29kZT4jIFx1Mjc0QyBXcm9uZyBcdTIwMTQgd2hhdCBpZiBhbiBlcnJvciBvY2N1cnMgYmVmb3JlIGZpbGUuY2xvc2UoKT9cbmZpbGUgPSBvcGVuKFwiZGF0YS50eHRcIiwgXCJyXCIpXG5jb250ZW50ID0gZmlsZS5yZWFkKClcbmZpbGUuY2xvc2UoKVxuXG4jIFx1MjcwNSBDb3JyZWN0IFx1MjAxNCBhdXRvLWNsb3NlcyBubyBtYXR0ZXIgd2hhdFxud2l0aCBvcGVuKFwiZGF0YS50eHRcIiwgXCJyXCIpIGFzIGZpbGU6XG4gICAgY29udGVudCA9IGZpbGUucmVhZCgpPC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+Qm9udXM6IFVzZSBlbnVtZXJhdGUoKSBJbnN0ZWFkIG9mIHJhbmdlKGxlbigpKTwvaDM+XG4gICAgICA8cD5XaGVuIHlvdSBuZWVkIGJvdGggdGhlIGluZGV4IGFuZCB0aGUgdmFsdWUgd2hpbGUgbG9vcGluZyBvdmVyIGEgbGlzdCwgYXZvaWQgdGhlIGNsdW5reSA8Y29kZT5yYW5nZShsZW4oLi4uKSk8L2NvZGU+IHBhdHRlcm4uIFB5dGhvbidzIGJ1aWx0LWluIDxjb2RlPmVudW1lcmF0ZSgpPC9jb2RlPiBpcyBjbGVhbmVyIGFuZCBtb3JlIHJlYWRhYmxlLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+IyBcdTI3NEMgVWdseSB3YXlcbmZydWl0cyA9IFtcIkFwcGxlXCIsIFwiQmFuYW5hXCIsIFwiTWFuZ29cIl1cbmZvciBpIGluIHJhbmdlKGxlbihmcnVpdHMpKTpcbiAgICBwcmludChpLCBmcnVpdHNbaV0pXG5cbiMgXHUyNzA1IFB5dGhvbmljIHdheVxuZm9yIGksIGZydWl0IGluIGVudW1lcmF0ZShmcnVpdHMpOlxuICAgIHByaW50KGksIGZydWl0KTwvY29kZT48L3ByZT5cblxuICAgICAgPGgyPldyaXRlIFB5dGhvbiB0aGUgV2F5IFB5dGhvbiBXYXMgTWVhbnQgdG8gQmUgV3JpdHRlbjwvaDI+XG4gICAgICA8cD5UaGVzZSBmaXhlcyBhcmUgbm90IGp1c3QgY29zbWV0aWMuIFRoZXkgaW1wcm92ZSBwZXJmb3JtYW5jZSwgcHJldmVudCBidWdzLCBhbmQgbWFrZSB5b3VyIGNvZGUgZmFyIGVhc2llciBmb3Igb3RoZXIgZGV2ZWxvcGVycyAoYW5kIHlvdXIgZnV0dXJlIHNlbGYpIHRvIHJlYWQgYW5kIG1haW50YWluLiBUaGUgUHl0aG9uIGNvbW11bml0eSBjYWxscyB0aGlzIHdyaXRpbmcgPHN0cm9uZz5QeXRob25pYzwvc3Ryb25nPiBjb2RlIFx1MjAxNCBjbGVhbiwgZXhwcmVzc2l2ZSwgYW5kIGlkaW9tYXRpYy48L3A+XG4gICAgICA8cD5UbyBidWlsZCB0aGVzZSBoYWJpdHMgZnJvbSBkYXkgb25lLCBzdGFydCB0aGUgZnJlZSA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzXCI+VWx0aW1hdGUgUHl0aG9uIE1hc3RlcmNsYXNzPC9hPiBvbiBTa2lsbFZhbGl4LiBCZWdpbiB3aXRoIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3MvbGVzc29uLzcyYzlmZDY4ZWQyNzUwZDFkNTNkMGUwMVwiPkxlc3NvbiAxOiBXZWxjb21lIHRvIFB5dGhvbjwvYT4gYW5kIGZvbGxvdyB0aHJvdWdoIHRvIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3MvbGVzc29uLzcyYzlmZDY4ZWQyNzUwZDFkNTNkMGUwNVwiPkxlc3NvbiA1OiBGdW5jdGlvbnMgXHUyMDE0IFJldXNhYmxlIENvZGUgQmxvY2tzPC9hPiB3aGVyZSBkZWZhdWx0IGFyZ3VtZW50IHBpdGZhbGxzIChtaXN0YWtlICMyIGFib3ZlKSBhcmUgY292ZXJlZCBpbiBkZXB0aC4gVGhlIGNvdXJzZSBlbmRzIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIHlvdSBjYW4gYWRkIHRvIHlvdXIgTGlua2VkSW4gYW5kIHJlc3VtZS48L3A+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9uczwvaDI+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IFdoYXQgaXMgdGhlIG1vc3QgZGFuZ2Vyb3VzIFB5dGhvbiBtaXN0YWtlIGluIHRoaXMgbGlzdD88L3N0cm9uZz48YnIvPlxuICAgICAgTXV0YWJsZSBkZWZhdWx0IGFyZ3VtZW50cyAoTWlzdGFrZSAjMikuIFVubGlrZSB0aGUgb3RoZXIgbWlzdGFrZXMgd2hpY2ggc2ltcGx5IHByb2R1Y2Ugd3Jvbmcgb3V0cHV0LCBtdXRhYmxlIGRlZmF1bHRzIGNhdXNlIHNoYXJlZCBzdGF0ZSBiZXR3ZWVuIGZ1bmN0aW9uIGNhbGxzIFx1MjAxNCBidWdzIHRoYXQgYXJlIGV4dHJlbWVseSBoYXJkIHRvIHJlcHJvZHVjZSBhbmQgZGlhZ25vc2UgYmVjYXVzZSB0aGUgZnVuY3Rpb24gd29ya3MgY29ycmVjdGx5IG9uIHRoZSBmaXJzdCBjYWxsIGFuZCBmYWlscyBvbiBzdWJzZXF1ZW50IG9uZXMuIFRoaXMgc3BlY2lmaWMgbWlzdGFrZSBoYXMgYmVlbiByZXNwb25zaWJsZSBmb3IgcHJvZHVjdGlvbiBidWdzIGF0IG1ham9yIGNvbXBhbmllcy48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTI6IFNob3VsZCBJIHVzZSBsaXN0IGNvbXByZWhlbnNpb25zIGV2ZXJ5d2hlcmU/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFVzZSB0aGVtIHdoZW4gdGhleSBtYWtlIHRoZSBjb2RlIGNsZWFybHkgcmVhZGFibGUgXHUyMDE0IHdoaWNoIGlzIG1vc3Qgb2YgdGhlIHRpbWUgZm9yIHNpbXBsZSB0cmFuc2Zvcm1hdGlvbnMuIEhvd2V2ZXIsIGlmIGEgY29tcHJlaGVuc2lvbiBiZWNvbWVzIHRvbyBuZXN0ZWQgb3IgY29tcGxleCB0byByZWFkIGluIG9uZSBnbGFuY2UsIGEgdHJhZGl0aW9uYWwgbG9vcCBpcyBiZXR0ZXIuIFB5dGhvbidzIHBoaWxvc29waHkgaXM6IHJlYWRhYmlsaXR5IGNvdW50cy4gSWYgYSBjb21wcmVoZW5zaW9uIHJlcXVpcmVzIDUgc2Vjb25kcyB0byBwYXJzZSwgaXQgaGFzIGZhaWxlZC48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IEFyZSB0aGVzZSBtaXN0YWtlcyByZWxldmFudCB0byBQeXRob24gMy4xMSs/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFllcy4gUHl0aG9uIDMuMTEgYW5kIGxhdGVyIHZlcnNpb25zIGltcHJvdmVkIGVycm9yIG1lc3NhZ2VzIGFuZCBwZXJmb3JtYW5jZSwgYnV0IHRoZSBsYW5ndWFnZS1sZXZlbCBwYXR0ZXJucyByZW1haW4gaWRlbnRpY2FsLiBVc2luZyA8Y29kZT5pcyBOb25lPC9jb2RlPiBpbnN0ZWFkIG9mIDxjb2RlPj09IE5vbmU8L2NvZGU+LCBhdm9pZGluZyBiYXJlIGV4Y2VwdCwgYW5kIHVzaW5nIGNvbnRleHQgbWFuYWdlcnMgYXJlIHRpbWVsZXNzIFB5dGhvbiBiZXN0IHByYWN0aWNlcyB0aGF0IGFwcGx5IHRvIGV2ZXJ5IHZlcnNpb24gZnJvbSAzLjggdG8gMy4xMysuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnUml5YSBEZXNhaScsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDMtMTdUMDk6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDQtMDVUMTg6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdNYXJjaCAxNywgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxMCBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiA4MjAsXG4gICAgY2F0ZWdvcnk6ICdQeXRob24nLFxuICAgIHRhZ3M6IFsnUHl0aG9uJywgJ1B5dGhvbiBUaXBzJywgJ0JlZ2lubmVyIFB5dGhvbicsICdDbGVhbiBDb2RlJywgJ1B5dGhvbmljIENvZGUnLCAnUHl0aG9uIEJlc3QgUHJhY3RpY2VzJywgJ1Byb2dyYW1taW5nJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUyNjM3OTA5NTA5OC1kNDAwZmQwYmY5MzU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnUHl0aG9uIGNvZGUgb24gYSBsYXB0b3Agc2NyZWVuIHdpdGggYSBkYXJrIHRoZW1lJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL3B5dGhvbi1iZWdpbm5lci1taXN0YWtlcy10by1hdm9pZCcsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdQeXRob24gQmFzaWNzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXN0ZXIgUHl0aG9uIGZyb20gc2NyYXRjaCBcdTIwMTQgdmFyaWFibGVzLCBsb29wcywgZnVuY3Rpb25zLCBPT1AgYW5kIG1vcmUuJ1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnamF2YS1iZWdpbm5lci1taXN0YWtlcy10by1hdm9pZCcsXG4gICAgdGl0bGU6ICcxMCBKYXZhIE1pc3Rha2VzIEV2ZXJ5IEJlZ2lubmVyIE1ha2VzIChBbmQgSG93IHRvIEZpeCBUaGVtKScsXG4gICAgbWV0YVRpdGxlOiAnMTAgSmF2YSBNaXN0YWtlcyBFdmVyeSBCZWdpbm5lciBNYWtlcyAmIEhvdyB0byBGaXggVGhlbSAoMjAyNikgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246XG4gICAgICAnQXZvaWQgdGhlIG1vc3QgY29tbW9uIEphdmEgYmVnaW5uZXIgbWlzdGFrZXMgaW4gMjAyNi4gRnJvbSBOdWxsUG9pbnRlckV4Y2VwdGlvbiB0byBpZ25vcmluZyBhY2Nlc3MgbW9kaWZpZXJzIFx1MjAxNCBsZWFybiBob3cgdG8gd3JpdGUgY2xlYW4sIHByb2Zlc3Npb25hbCBKYXZhIGNvZGUgZnJvbSBkYXkgb25lLicsXG4gICAga2V5d29yZHM6IFtcbiAgICAgICdKYXZhIGJlZ2lubmVyIG1pc3Rha2VzJyxcbiAgICAgICdKYXZhIHRpcHMgMjAyNicsXG4gICAgICAnSmF2YSB0dXRvcmlhbCBmb3IgYmVnaW5uZXJzJyxcbiAgICAgICdKYXZhIGJlc3QgcHJhY3RpY2VzJyxcbiAgICAgICdKYXZhIGNvbW1vbiBlcnJvcnMnLFxuICAgICAgJ0phdmEgTnVsbFBvaW50ZXJFeGNlcHRpb24gZml4JyxcbiAgICAgICdKYXZhIE9PUCB0aXBzJyxcbiAgICAgICdsZWFybiBKYXZhIHByb2dyYW1taW5nJyxcbiAgICAgICdKYXZhIGNsZWFuIGNvZGUnLFxuICAgICAgJ0phdmEgaW50ZXJ2aWV3IHRpcHMnLFxuICAgIF0sXG4gICAgZXhjZXJwdDpcbiAgICAgICdKYXZhIGlzIG9uZSBvZiB0aGUgbW9zdCBwb3dlcmZ1bCBsYW5ndWFnZXMgaW4gdGhlIHdvcmxkIFx1MjAxNCBidXQgYmVnaW5uZXJzIGZhbGwgaW50byB0aGUgc2FtZSB0cmFwcyBldmVyeSB0aW1lLiBGaXggdGhlc2UgMTAgSmF2YSBtaXN0YWtlcyByaWdodCBub3cgYW5kIHdyaXRlIGNvZGUgdGhhdCBhY3R1YWxseSB3b3JrcyBpbiBwcm9kdWN0aW9uLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPkphdmEgSXMgUG93ZXJmdWwgXHUyMDE0IEJ1dCBJdCBQdW5pc2hlcyBCYWQgSGFiaXRzPC9oMj5cbiAgICAgIDxwPkphdmEgaXMgZmFtb3VzIGZvciBiZWluZyBzdHJpY3QgYW5kIHZlcmJvc2UuIFRoYXQgc3RyaWN0bmVzcyBpcyBhY3R1YWxseSBhIGZlYXR1cmUgXHUyMDE0IGl0IGZvcmNlcyB5b3UgdG8gdGhpbmsuIEJ1dCBiZWdpbm5lcnMgc3RpbGwgbWFuYWdlIHRvIHdyaXRlIEphdmEgdGhhdCBjb21waWxlcyBmaW5lIHlldCBiZWhhdmVzIGhvcnJpYmx5IGF0IHJ1bnRpbWUuIExldCdzIGZpeCB0aGUgMTAgbW9zdCBjb21tb24gbWlzdGFrZXMgcmlnaHQgbm93LjwvcD5cblxuICAgICAgPGgzPjEuIFVzaW5nID09IHRvIENvbXBhcmUgU3RyaW5nczwvaDM+XG4gICAgICA8cD5UaGlzIGlzIHRoZSAjMSBKYXZhIGJlZ2lubmVyIG1pc3Rha2UuIFRoZSA8Y29kZT49PTwvY29kZT4gb3BlcmF0b3IgY2hlY2tzIGlmIHR3byB2YXJpYWJsZXMgcG9pbnQgdG8gdGhlIDxlbT5zYW1lIG9iamVjdCBpbiBtZW1vcnk8L2VtPiBcdTIwMTQgbm90IHdoZXRoZXIgdGhlaXIgY29udGVudCBpcyBlcXVhbC4gRm9yIFN0cmluZ3MsIGFsd2F5cyB1c2UgPGNvZGU+LmVxdWFscygpPC9jb2RlPi48L3A+XG4gICAgICA8cHJlPjxjb2RlPi8vIFx1Mjc0QyBXcm9uZyBcdTIwMTQgY29tcGFyZXMgbWVtb3J5IHJlZmVyZW5jZXMsIG5vdCBjb250ZW50XG5TdHJpbmcgYSA9IG5ldyBTdHJpbmcoXCJoZWxsb1wiKTtcblN0cmluZyBiID0gbmV3IFN0cmluZyhcImhlbGxvXCIpO1xuU3lzdGVtLm91dC5wcmludGxuKGEgPT0gYik7IC8vIGZhbHNlIFx1RDgzRFx1REUzMVxuXG4vLyBcdTI3MDUgQ29ycmVjdCBcdTIwMTQgY29tcGFyZXMgYWN0dWFsIHN0cmluZyBjb250ZW50XG5TeXN0ZW0ub3V0LnByaW50bG4oYS5lcXVhbHMoYikpOyAvLyB0cnVlIFx1MjcwNVxuXG4vLyBcdTI3MDUgRXh0cmEgc2FmZSBcdTIwMTQgYXZvaWRzIE51bGxQb2ludGVyRXhjZXB0aW9uXG5TeXN0ZW0ub3V0LnByaW50bG4oXCJoZWxsb1wiLmVxdWFscyhhKSk7IC8vIHRydWUgXHUyNzA1PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+Mi4gTm90IEhhbmRsaW5nIE51bGxQb2ludGVyRXhjZXB0aW9uIChOUEUpPC9oMz5cbiAgICAgIDxwPk51bGxQb2ludGVyRXhjZXB0aW9uIGlzIHRoZSBtb3N0IGNvbW1vbiBKYXZhIHJ1bnRpbWUgY3Jhc2guIEl0IGhhcHBlbnMgd2hlbiB5b3UgY2FsbCBhIG1ldGhvZCBvbiBhIHZhcmlhYmxlIHRoYXQgaG9sZHMgPGNvZGU+bnVsbDwvY29kZT4uIEFsd2F5cyBjaGVjayBmb3IgbnVsbCBvciB1c2UgdGhlIDxjb2RlPk9wdGlvbmFsPC9jb2RlPiBjbGFzcyBpbnRyb2R1Y2VkIGluIEphdmEgOC48L3A+XG4gICAgICA8cHJlPjxjb2RlPi8vIFx1Mjc0QyBXcm9uZyBcdTIwMTQgY3Jhc2hlcyBpZiBnZXROYW1lKCkgcmV0dXJucyBudWxsXG5TdHJpbmcgbmFtZSA9IHVzZXIuZ2V0TmFtZSgpO1xuU3lzdGVtLm91dC5wcmludGxuKG5hbWUudG9VcHBlckNhc2UoKSk7IC8vIFx1RDgzRFx1RENBNSBOUEUhXG5cbi8vIFx1MjcwNSBDb3JyZWN0IFx1MjAxNCBudWxsIGNoZWNrIGZpcnN0XG5TdHJpbmcgbmFtZSA9IHVzZXIuZ2V0TmFtZSgpO1xuaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgIFN5c3RlbS5vdXQucHJpbnRsbihuYW1lLnRvVXBwZXJDYXNlKCkpO1xufVxuXG4vLyBcdTI3MDUgTW9kZXJuIHdheSBcdTIwMTQgdXNlIE9wdGlvbmFsIChKYXZhIDgrKVxuT3B0aW9uYWwub2ZOdWxsYWJsZSh1c2VyLmdldE5hbWUoKSlcbiAgICAgICAgLm1hcChTdHJpbmc6OnRvVXBwZXJDYXNlKVxuICAgICAgICAuaWZQcmVzZW50KFN5c3RlbS5vdXQ6OnByaW50bG4pOzwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPjMuIElnbm9yaW5nIEFjY2VzcyBNb2RpZmllcnM8L2gzPlxuICAgICAgPHA+QmVnaW5uZXJzIG1ha2UgZXZlcnkgZmllbGQgPGNvZGU+cHVibGljPC9jb2RlPiBmb3IgY29udmVuaWVuY2UgXHUyMDE0IGJyZWFraW5nIGVuY2Fwc3VsYXRpb24uIE1ha2luZyBmaWVsZHMgcHVibGljIG1lYW5zIGFueSBjbGFzcyBjYW4gY2hhbmdlIHRoZW0gZGlyZWN0bHksIGJ5cGFzc2luZyB2YWxpZGF0aW9uIGxvZ2ljIGFuZCBjYXVzaW5nIHVucHJlZGljdGFibGUgYnVncy48L3A+XG4gICAgICA8cHJlPjxjb2RlPi8vIFx1Mjc0QyBXcm9uZyBcdTIwMTQgYW55b25lIGNhbiBzZXQgYSBuZWdhdGl2ZSBhZ2UhXG5wdWJsaWMgY2xhc3MgUGVyc29uIHtcbiAgICBwdWJsaWMgaW50IGFnZTtcbn1cblBlcnNvbiBwID0gbmV3IFBlcnNvbigpO1xucC5hZ2UgPSAtOTk5OyAvLyBOb3RoaW5nIHN0b3BzIHRoaXMgXHVEODNEXHVERTMxXG5cbi8vIFx1MjcwNSBDb3JyZWN0IFx1MjAxNCBwcml2YXRlIGZpZWxkICsgdmFsaWRhdGVkIHNldHRlclxucHVibGljIGNsYXNzIFBlcnNvbiB7XG4gICAgcHJpdmF0ZSBpbnQgYWdlO1xuXG4gICAgcHVibGljIGludCBnZXRBZ2UoKSB7IHJldHVybiBhZ2U7IH1cblxuICAgIHB1YmxpYyB2b2lkIHNldEFnZShpbnQgYWdlKSB7XG4gICAgICAgIGlmIChhZ2UgPj0gMCAmJiBhZ2UgPD0gMTUwKSB0aGlzLmFnZSA9IGFnZTtcbiAgICAgICAgZWxzZSB0aHJvdyBuZXcgSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uKFwiSW52YWxpZCBhZ2UhXCIpO1xuICAgIH1cbn08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz40LiBVc2luZyBSYXcgVHlwZXMgSW5zdGVhZCBvZiBHZW5lcmljczwvaDM+XG4gICAgICA8cD5SYXcgdHlwZXMgbGlrZSA8Y29kZT5BcnJheUxpc3Q8L2NvZGU+IHdpdGhvdXQgYSB0eXBlIHBhcmFtZXRlciB3ZXJlIHRoZSBvbGQgSmF2YSB3YXkuIFRoZXkgY2F1c2UgPGNvZGU+Q2xhc3NDYXN0RXhjZXB0aW9uPC9jb2RlPiBhdCBydW50aW1lIGFuZCBsb3NlIGFsbCBjb21waWxlciB0eXBlLXNhZmV0eS4gQWx3YXlzIHNwZWNpZnkgdGhlIGdlbmVyaWMgdHlwZS48L3A+XG4gICAgICA8cHJlPjxjb2RlPi8vIFx1Mjc0QyBXcm9uZyBcdTIwMTQgcmF3IHR5cGUgbG9zZXMgdHlwZSBzYWZldHlcbkFycmF5TGlzdCBsaXN0ID0gbmV3IEFycmF5TGlzdCgpO1xubGlzdC5hZGQoXCJoZWxsb1wiKTtcbmxpc3QuYWRkKDQyKTsgLy8gTm8gZXJyb3IgYXQgY29tcGlsZSB0aW1lIVxuU3RyaW5nIHMgPSAoU3RyaW5nKSBsaXN0LmdldCgxKTsgLy8gXHVEODNEXHVEQ0E1IENsYXNzQ2FzdEV4Y2VwdGlvbiBhdCBydW50aW1lIVxuXG4vLyBcdTI3MDUgQ29ycmVjdCBcdTIwMTQgZ2VuZXJpYyB0eXBlIGVuZm9yY2VkIGF0IGNvbXBpbGUgdGltZVxuQXJyYXlMaXN0Jmx0O1N0cmluZyZndDsgbGlzdCA9IG5ldyBBcnJheUxpc3QmbHQ7Jmd0OygpO1xubGlzdC5hZGQoXCJoZWxsb1wiKTtcbi8vIGxpc3QuYWRkKDQyKTsgLy8gXHUyNzA1IENvbXBpbGVyIGNhdGNoZXMgdGhpcyBpbW1lZGlhdGVseSE8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz41LiBDYXRjaGluZyBHZW5lcmljIEV4Y2VwdGlvbjwvaDM+XG4gICAgICA8cD5DYXRjaGluZyA8Y29kZT5FeGNlcHRpb248L2NvZGU+IG9yIDxjb2RlPlRocm93YWJsZTwvY29kZT4gYXQgdGhlIHRvcCBsZXZlbCBzaWxlbnRseSBzd2FsbG93cyBldmVyeSBlcnJvciBcdTIwMTQgaW5jbHVkaW5nIDxjb2RlPk91dE9mTWVtb3J5RXJyb3I8L2NvZGU+IGFuZCA8Y29kZT5TdGFja092ZXJmbG93RXJyb3I8L2NvZGU+LiBBbHdheXMgY2F0Y2ggdGhlIG1vc3Qgc3BlY2lmaWMgZXhjZXB0aW9uIHBvc3NpYmxlLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIFdyb25nIFx1MjAxNCBoaWRlcyB0aGUgcmVhbCBwcm9ibGVtIGNvbXBsZXRlbHlcbnRyeSB7XG4gICAgaW50IHJlc3VsdCA9IEludGVnZXIucGFyc2VJbnQoaW5wdXQpO1xufSBjYXRjaCAoRXhjZXB0aW9uIGUpIHtcbiAgICBTeXN0ZW0ub3V0LnByaW50bG4oXCJFcnJvclwiKTtcbn1cblxuLy8gXHUyNzA1IENvcnJlY3QgXHUyMDE0IGNhdGNoIHNwZWNpZmljLCBsb2cgdGhlIGNhdXNlXG50cnkge1xuICAgIGludCByZXN1bHQgPSBJbnRlZ2VyLnBhcnNlSW50KGlucHV0KTtcbn0gY2F0Y2ggKE51bWJlckZvcm1hdEV4Y2VwdGlvbiBlKSB7XG4gICAgU3lzdGVtLm91dC5wcmludGxuKFwiSW52YWxpZCBudW1iZXI6IFwiICsgZS5nZXRNZXNzYWdlKCkpO1xufTwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPjYuIE5vdCBDbG9zaW5nIFJlc291cmNlcyAoTWVtb3J5IExlYWtzKTwvaDM+XG4gICAgICA8cD5GaWxlIHN0cmVhbXMsIGRhdGFiYXNlIGNvbm5lY3Rpb25zLCBhbmQgbmV0d29yayBzb2NrZXRzIG11c3QgYmUgY2xvc2VkIGFmdGVyIHVzZS4gSWYgYW4gZXhjZXB0aW9uIG9jY3VycyBiZWZvcmUgPGNvZGU+Y2xvc2UoKTwvY29kZT4sIHlvdSBsZWFrIHJlc291cmNlcy4gVXNlIDxzdHJvbmc+dHJ5LXdpdGgtcmVzb3VyY2VzPC9zdHJvbmc+IChKYXZhIDcrKSBcdTIwMTQgaXQgYXV0by1jbG9zZXMgZXZlcnl0aGluZy48L3A+XG4gICAgICA8cHJlPjxjb2RlPi8vIFx1Mjc0QyBXcm9uZyBcdTIwMTQgY29ubmVjdGlvbiBtYXkgbmV2ZXIgY2xvc2Ugb24gZXJyb3IhXG5Db25uZWN0aW9uIGNvbm4gPSBEcml2ZXJNYW5hZ2VyLmdldENvbm5lY3Rpb24odXJsKTtcblN0YXRlbWVudCBzdG10ID0gY29ubi5jcmVhdGVTdGF0ZW1lbnQoKTtcblJlc3VsdFNldCBycyA9IHN0bXQuZXhlY3V0ZVF1ZXJ5KFwiU0VMRUNUICogRlJPTSB1c2Vyc1wiKTtcbi8vIC4uLiBpZiBleGNlcHRpb24gaGVyZSwgY29ubiBuZXZlciBjbG9zZXMgXHVEODNEXHVERTMxXG5cbi8vIFx1MjcwNSBDb3JyZWN0IFx1MjAxNCB0cnktd2l0aC1yZXNvdXJjZXMgYXV0by1jbG9zZXMgYWxsXG50cnkgKENvbm5lY3Rpb24gY29ubiA9IERyaXZlck1hbmFnZXIuZ2V0Q29ubmVjdGlvbih1cmwpO1xuICAgICBTdGF0ZW1lbnQgc3RtdCA9IGNvbm4uY3JlYXRlU3RhdGVtZW50KCk7XG4gICAgIFJlc3VsdFNldCBycyA9IHN0bXQuZXhlY3V0ZVF1ZXJ5KFwiU0VMRUNUICogRlJPTSB1c2Vyc1wiKSkge1xuICAgIHdoaWxlIChycy5uZXh0KCkpIHtcbiAgICAgICAgU3lzdGVtLm91dC5wcmludGxuKHJzLmdldFN0cmluZyhcIm5hbWVcIikpO1xuICAgIH1cbn0gLy8gQWxsIGF1dG8tY2xvc2VkLCBldmVuIG9uIGV4Y2VwdGlvbiBcdTI3MDU8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz43LiBDb25jYXRlbmF0aW5nIFN0cmluZ3MgaW4gTG9vcHM8L2gzPlxuICAgICAgPHA+U3RyaW5ncyBpbiBKYXZhIGFyZSA8c3Ryb25nPmltbXV0YWJsZTwvc3Ryb25nPi4gRXZlcnkgdGltZSB5b3UgdXNlIDxjb2RlPis8L2NvZGU+IGluc2lkZSBhIGxvb3AsIEphdmEgY3JlYXRlcyBhIGJyYW5kIG5ldyBTdHJpbmcgb2JqZWN0IGluIG1lbW9yeSBcdTIwMTQgdGhpcyBpcyBPKG5cdTAwQjIpIHBlcmZvcm1hbmNlIGFuZCBjYXVzZXMgbWFzc2l2ZSBtZW1vcnkgcHJlc3N1cmUuIFVzZSA8Y29kZT5TdHJpbmdCdWlsZGVyPC9jb2RlPiBpbnN0ZWFkLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIFdyb25nIFx1MjAxNCBjcmVhdGVzIDEwMDAgdGVtcG9yYXJ5IFN0cmluZyBvYmplY3RzIVxuU3RyaW5nIHJlc3VsdCA9IFwiXCI7XG5mb3IgKGludCBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xuICAgIHJlc3VsdCArPSBpICsgXCIsIFwiOyAvLyBOZXcgb2JqZWN0IGV2ZXJ5IGl0ZXJhdGlvbiBcdUQ4M0RcdURFMzFcbn1cblxuLy8gXHUyNzA1IENvcnJlY3QgXHUyMDE0IFN0cmluZ0J1aWxkZXIgbW9kaWZpZXMgaW4tcGxhY2VcblN0cmluZ0J1aWxkZXIgc2IgPSBuZXcgU3RyaW5nQnVpbGRlcigpO1xuZm9yIChpbnQgaSA9IDA7IGkgPCAxMDAwOyBpKyspIHtcbiAgICBzYi5hcHBlbmQoaSkuYXBwZW5kKFwiLCBcIik7XG59XG5TdHJpbmcgcmVzdWx0ID0gc2IudG9TdHJpbmcoKTsgLy8gT25lIGZpbmFsIFN0cmluZyBcdTI3MDU8L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz44LiBVc2luZyBpbnQgSW5zdGVhZCBvZiBsb25nIGZvciBMYXJnZSBOdW1iZXJzPC9oMz5cbiAgICAgIDxwPkphdmEncyA8Y29kZT5pbnQ8L2NvZGU+IGhvbGRzIGEgbWF4aW11bSB2YWx1ZSBvZiB+Mi4xIGJpbGxpb24gKDIsMTQ3LDQ4Myw2NDcpLiBNYW55IGJlZ2lubmVycyB1c2UgPGNvZGU+aW50PC9jb2RlPiBmb3IgY2FsY3VsYXRpb25zIGludm9sdmluZyBsYXJnZSBudW1iZXJzIFx1MjAxNCBsaWtlIG1pbGxpc2Vjb25kcywgZmFjdG9yaWFscywgb3IgcG9wdWxhdGlvbiBjb3VudHMgXHUyMDE0IGNhdXNpbmcgc2lsZW50IDxzdHJvbmc+aW50ZWdlciBvdmVyZmxvdzwvc3Ryb25nPiB3aXRoIG5vIGVycm9yIG9yIHdhcm5pbmcuPC9wPlxuICAgICAgPHByZT48Y29kZT4vLyBcdTI3NEMgV3JvbmcgXHUyMDE0IGludCBvdmVyZmxvd3Mgc2lsZW50bHkhXG5pbnQgbWlsbGlzSW5ZZWFyID0gMzY1ICogMjQgKiA2MCAqIDYwICogMTAwMDtcblN5c3RlbS5vdXQucHJpbnRsbihtaWxsaXNJblllYXIpOyAvLyAxNDcxMjI4OTI4IFx1RDgzRFx1REUzMSBXUk9ORyFcblxuLy8gXHUyNzA1IENvcnJlY3QgXHUyMDE0IHVzZSBsb25nIGZvciBsYXJnZSB2YWx1ZXNcbmxvbmcgbWlsbGlzSW5ZZWFyID0gMzY1TCAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG5TeXN0ZW0ub3V0LnByaW50bG4obWlsbGlzSW5ZZWFyKTsgLy8gMzE1MzYwMDAwMDAgXHUyNzA1PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+OS4gTm90IE92ZXJyaWRpbmcgZXF1YWxzKCkgYW5kIGhhc2hDb2RlKCkgVG9nZXRoZXI8L2gzPlxuICAgICAgPHA+V2hlbiB5b3Ugc3RvcmUgY3VzdG9tIG9iamVjdHMgaW4gYSA8Y29kZT5IYXNoTWFwPC9jb2RlPiBvciA8Y29kZT5IYXNoU2V0PC9jb2RlPiwgSmF2YSB1c2VzIDxjb2RlPmVxdWFscygpPC9jb2RlPiBhbmQgPGNvZGU+aGFzaENvZGUoKTwvY29kZT4gdG8gZmluZCB0aGVtLiBJZiB5b3Ugb3ZlcnJpZGUgb25lIGJ1dCBub3QgdGhlIG90aGVyLCB5b3VyIGNvbGxlY3Rpb24gd2lsbCBzaWxlbnRseSBiZWhhdmUgaW5jb3JyZWN0bHkgXHUyMDE0IG9iamVjdHMgeW91IHN0b3JlZCB3aWxsIG15c3RlcmlvdXNseSBcImRpc2FwcGVhclwiLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIFdyb25nIFx1MjAxNCBvdmVycmlkZXMgZXF1YWxzIGJ1dCBub3QgaGFzaENvZGVcbnB1YmxpYyBjbGFzcyBTdHVkZW50IHtcbiAgICBpbnQgcm9sbE5vO1xuICAgIEBPdmVycmlkZVxuICAgIHB1YmxpYyBib29sZWFuIGVxdWFscyhPYmplY3Qgbykge1xuICAgICAgICByZXR1cm4gKChTdHVkZW50KSBvKS5yb2xsTm8gPT0gdGhpcy5yb2xsTm87XG4gICAgfVxuICAgIC8vIE1pc3NpbmcgaGFzaENvZGUhIEhhc2hNYXAgd2lsbCBicmVhayBcdUQ4M0RcdURFMzFcbn1cblxuLy8gXHUyNzA1IENvcnJlY3QgXHUyMDE0IGFsd2F5cyBvdmVycmlkZSBCT1RIIHRvZ2V0aGVyXG5AT3ZlcnJpZGVcbnB1YmxpYyBib29sZWFuIGVxdWFscyhPYmplY3Qgbykge1xuICAgIGlmICh0aGlzID09IG8pIHJldHVybiB0cnVlO1xuICAgIGlmICghKG8gaW5zdGFuY2VvZiBTdHVkZW50KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0aGlzLnJvbGxObyA9PSAoKFN0dWRlbnQpIG8pLnJvbGxObztcbn1cblxuQE92ZXJyaWRlXG5wdWJsaWMgaW50IGhhc2hDb2RlKCkge1xuICAgIHJldHVybiBPYmplY3RzLmhhc2gocm9sbE5vKTsgLy8gXHUyNzA1IENvbnNpc3RlbnQgd2l0aCBlcXVhbHNcbn08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz4xMC4gV3JpdGluZyBHb2QgQ2xhc3NlcyAoVmlvbGF0aW5nIFNpbmdsZSBSZXNwb25zaWJpbGl0eSk8L2gzPlxuICAgICAgPHA+QmVnaW5uZXJzIGR1bXAgZXZlcnl0aGluZyBpbnRvIG9uZSBnaWFudCBjbGFzcyBcdTIwMTQgZGF0YWJhc2UgbG9naWMsIFVJIGxvZ2ljLCBidXNpbmVzcyBsb2dpYywgZmlsZSBoYW5kbGluZy4gVGhpcyB2aW9sYXRlcyB0aGUgPHN0cm9uZz5TaW5nbGUgUmVzcG9uc2liaWxpdHkgUHJpbmNpcGxlIChTUlApPC9zdHJvbmc+OiBhIGNsYXNzIHNob3VsZCBoYXZlIG9uZSByZWFzb24gdG8gY2hhbmdlLiBHb2QgY2xhc3NlcyBiZWNvbWUgaW1wb3NzaWJsZSB0byB0ZXN0LCBkZWJ1Zywgb3IgZXh0ZW5kLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIFdyb25nIFx1MjAxNCBvbmUgY2xhc3MgZG9lcyBFVkVSWVRISU5HXG5wdWJsaWMgY2xhc3MgU3R1ZGVudEFwcCB7XG4gICAgdm9pZCBjb25uZWN0RGF0YWJhc2UoKSB7IC8qIERCIGxvZ2ljICovIH1cbiAgICB2b2lkIHZhbGlkYXRlSW5wdXQoKSAgIHsgLyogVmFsaWRhdGlvbiAqLyB9XG4gICAgdm9pZCBzYXZlVG9EYXRhYmFzZSgpICB7IC8qIFNhdmUgKi8gfVxuICAgIHZvaWQgc2VuZEVtYWlsKCkgICAgICAgeyAvKiBFbWFpbCAqLyB9XG4gICAgdm9pZCByZW5kZXJVSSgpICAgICAgICB7IC8qIERpc3BsYXkgKi8gfVxuICAgIC8vIDUwMCBtb3JlIGxpbmVzLi4uIFx1RDgzRFx1REUzMVxufVxuXG4vLyBcdTI3MDUgQ29ycmVjdCBcdTIwMTQgZWFjaCBjbGFzcyBoYXMgT05FIGpvYlxucHVibGljIGNsYXNzIERhdGFiYXNlU2VydmljZSAgeyB2b2lkIGNvbm5lY3QoKSB7IH0gfVxucHVibGljIGNsYXNzIFN0dWRlbnRWYWxpZGF0b3IgIHsgYm9vbGVhbiB2YWxpZGF0ZShTdHVkZW50IHMpIHsgfSB9XG5wdWJsaWMgY2xhc3MgU3R1ZGVudFJlcG9zaXRvcnkgeyB2b2lkIHNhdmUoU3R1ZGVudCBzKSB7IH0gfVxucHVibGljIGNsYXNzIEVtYWlsU2VydmljZSAgICAgIHsgdm9pZCBzZW5kKFN0cmluZyB0bykgeyB9IH08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz5Cb251czogVXNlIEVuaGFuY2VkIGZvciBMb29wIEluc3RlYWQgb2YgSW5kZXggTG9vcDwvaDM+XG4gICAgICA8cD5XaGVuIHlvdSBkb24ndCBuZWVkIHRoZSBpbmRleCwgYXZvaWQgdGhlIHZlcmJvc2UgPGNvZGU+Zm9yIChpbnQgaSA9IDA7IGkgPCBsaXN0LnNpemUoKTsgaSsrKTwvY29kZT4gcGF0dGVybi4gVGhlIGVuaGFuY2VkIGZvci1lYWNoIGxvb3AgaXMgY2xlYW5lciwgbGVzcyBlcnJvci1wcm9uZSAobm8gb2ZmLWJ5LW9uZSBlcnJvcnMpLCBhbmQgZXhwcmVzc2VzIGludGVudCBjbGVhcmx5LjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gXHUyNzRDIFZlcmJvc2UgXHUyMDE0IGluZGV4IG5vdCBldmVuIG5lZWRlZCBoZXJlXG5MaXN0Jmx0O1N0cmluZyZndDsgbmFtZXMgPSBMaXN0Lm9mKFwiQWxpY2VcIiwgXCJCb2JcIiwgXCJDaGFybGllXCIpO1xuZm9yIChpbnQgaSA9IDA7IGkgPCBuYW1lcy5zaXplKCk7IGkrKykge1xuICAgIFN5c3RlbS5vdXQucHJpbnRsbihuYW1lcy5nZXQoaSkpO1xufVxuXG4vLyBcdTI3MDUgQ2xlYW5lciBcdTIwMTQgZW5oYW5jZWQgZm9yLWVhY2hcbmZvciAoU3RyaW5nIG5hbWUgOiBuYW1lcykge1xuICAgIFN5c3RlbS5vdXQucHJpbnRsbihuYW1lKTtcbn1cblxuLy8gXHUyNzA1IEV2ZW4gY2xlYW5lciBcdTIwMTQgSmF2YSA4IGZvckVhY2ggKyBsYW1iZGFcbm5hbWVzLmZvckVhY2goU3lzdGVtLm91dDo6cHJpbnRsbik7PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDI+V3JpdGUgSmF2YSB0aGUgV2F5IFByb2Zlc3Npb25hbHMgV3JpdGUgSXQ8L2gyPlxuICAgICAgPHA+VGhlc2UgbWlzdGFrZXMgYXJlIG5vdCByYW5kb20gXHUyMDE0IHRoZXkgYXJlIHRoZSBleGFjdCBwYXR0ZXJucyB0aGF0IHNob3cgdXAgaW4gY29kZSByZXZpZXdzIGF0IGV2ZXJ5IGNvbXBhbnkuIEZpeGluZyB0aGVtIG5vdyBtZWFucyBmZXdlciBidWdzLCBmYXN0ZXIgcGVyZm9ybWFuY2UsIGFuZCBjb2RlIHRoYXQgeW91ciB0ZWFtIHdpbGwgYWN0dWFsbHkgcmVzcGVjdC4gSmF2YSByZXdhcmRzIGRpc2NpcGxpbmUuIFN0YXJ0IHdyaXRpbmcgaXQgdGhhdCB3YXkuPC9wPlxuICAgICAgPHA+VG8gbWFzdGVyIEphdmEgZnJvbSB0aGUgZ3JvdW5kIHVwIFx1MjAxNCBpbmNsdWRpbmcgYWxsIDEwIG9mIHRoZXNlIHBhdHRlcm5zIHRhdWdodCBpbiBkZXB0aCB3aXRoIGxpdmUgY29kaW5nIFx1MjAxNCBzdGFydCB3aXRoIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhLW1hc3RlcmNsYXNzL2xlc3Nvbi83OGM5ZmQ2OGVkMjc1MGQxZDUzZDBlYTBcIj5MZXNzb24gMTogV2VsY29tZSB0byBKYXZhPC9hPiBvbiB0aGUgZnJlZSA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YS1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEphdmEgTWFzdGVyY2xhc3M8L2E+LiBXaGVuIHlvdSBhcmUgY29uZmlkZW50IHdpdGggdGhlIGJhc2ljcywgc3R1ZHkgT09QIGVuY2Fwc3VsYXRpb24gaW4gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmEtbWFzdGVyY2xhc3MvbGVzc29uLzc4YzlmZDY4ZWQyNzUwZDFkNTNkMGVhMlwiPkxlc3NvbiAzOiBWYXJpYWJsZXMgJmFtcDsgRGF0YSBUeXBlczwvYT4gYW5kIGNvbnRyb2wgZmxvdyAoaW5jbHVkaW5nIHRoZSBlbmhhbmNlZCBmb3ItZWFjaCBsb29wKSBpbiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YS1tYXN0ZXJjbGFzcy9sZXNzb24vNzhjOWZkNjhlZDI3NTBkMWQ1M2QwZWE0XCI+TGVzc29uIDU6IENvbnRyb2wgRmxvdzwvYT4uPC9wPlxuXG4gICAgICA8aDI+RnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnM8L2gyPlxuXG4gICAgICA8cD48c3Ryb25nPlExOiBXaGljaCBpcyB0aGUgbW9zdCBjcml0aWNhbCBKYXZhIG1pc3Rha2UgdG8gZml4IGZpcnN0Pzwvc3Ryb25nPjxici8+XG4gICAgICBVc2luZyA8Y29kZT49PTwvY29kZT4gdG8gY29tcGFyZSBTdHJpbmdzLiBJdCBjYXVzZXMgYnVncyB0aGF0IGFyZSBpbnZpc2libGUgYXQgY29tcGlsZSB0aW1lIGFuZCBleHRyZW1lbHkgY29uZnVzaW5nIGF0IHJ1bnRpbWUuIEV2ZXJ5IEphdmEgZGV2ZWxvcGVyIG11c3Qga25vdyB0aGF0IFN0cmluZyBlcXVhbGl0eSByZXF1aXJlcyA8Y29kZT4uZXF1YWxzKCk8L2NvZGU+IFx1MjAxNCBsZWFybiB0aGlzIG9uIGRheSBvbmUuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEyOiBEbyB0aGVzZSBtaXN0YWtlcyBhcHBseSB0byBtb2Rlcm4gSmF2YSAoMTcsIDIxLCAyMik/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFllcy4gV2hpbGUgbW9kZXJuIEphdmEgaGFzIGFkZGVkIHJlY29yZHMsIHNlYWxlZCBjbGFzc2VzLCBhbmQgcGF0dGVybiBtYXRjaGluZywgdGhlIGZ1bmRhbWVudGFsIE9PUCBhbmQgZXhjZXB0aW9uLWhhbmRsaW5nIG1pc3Rha2VzIGluIHRoaXMgbGlzdCBhcHBseSB0byBhbGwgSmF2YSB2ZXJzaW9ucy4gU3RyaW5nIGNvbXBhcmlzb24gd2l0aCA8Y29kZT49PTwvY29kZT4sIE5QRSBoYW5kbGluZywgYW5kIHJlc291cmNlIGxlYWtzIGFyZSBsYW5ndWFnZS1sZXZlbCBjb25jZXJucyB0aGF0IHRyYW5zY2VuZCB2ZXJzaW9uIHVwZGF0ZXMuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBIb3cgY2FuIEkgcHJhY3RpY2UgYXZvaWRpbmcgdGhlc2UgbWlzdGFrZXM/PC9zdHJvbmc+PGJyLz5cbiAgICAgIENvZGUgcmV2aWV3IGlzIHRoZSBiZXN0IHRlYWNoZXIuIEFmdGVyIHdyaXRpbmcgYW55IEphdmEgY29kZSwgZ28gdGhyb3VnaCB0aGlzIGxpc3QgYXMgYSBjaGVja2xpc3QuIEJldHRlciB5ZXQsIHNldCB1cCBTb25hclF1YmUgb3IgSW50ZWxsaUoncyBpbnNwZWN0aW9uIHdhcm5pbmdzIFx1MjAxNCB0aGV5IGZsYWcgbW9zdCBvZiB0aGVzZSBtaXN0YWtlcyBhdXRvbWF0aWNhbGx5LiBBbmQgZW5yb2xsIGluIHRoZSA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YS1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEphdmEgTWFzdGVyY2xhc3M8L2E+IGZvciBzdHJ1Y3R1cmVkLCBtZW50b3ItbGV2ZWwgZ3VpZGFuY2UuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnUml5YSBEZXNhaScsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDMtMjNUMDk6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDQtMDVUMTg6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdNYXJjaCAyMywgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxMiBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxMDUwLFxuICAgIGNhdGVnb3J5OiAnSmF2YScsXG4gICAgdGFnczogWydKYXZhJywgJ0phdmEgVGlwcycsICdCZWdpbm5lciBKYXZhJywgJ0NsZWFuIENvZGUnLCAnT09QJywgJ0phdmEgSW50ZXJ2aWV3JywgJ0phdmEgTWlzdGFrZXMnLCAnUHJvZ3JhbW1pbmcnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTE3Njk0NzEyMjAyLTE0ZGQ5NTM4YWE5Nz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdKYXZhIGNvZGUgb24gYSBsYXB0b3Agc2NyZWVuIHdpdGggYSBkYXJrIGVkaXRvciB0aGVtZSBzaG93aW5nIE9PUCBjb25jZXB0cycsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9qYXZhLWJlZ2lubmVyLW1pc3Rha2VzLXRvLWF2b2lkJyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1RoZSBVbHRpbWF0ZSBKYXZhIE1hc3RlcmNsYXNzOiBGcm9tIEJlZ2lubmVyIHRvIEFkdmFuY2VkJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1qYXZhLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFzdGVyIEphdmEgZnJvbSBzY3JhdGNoIFx1MjAxNCB2YXJpYWJsZXMsIE9PUCwgY29sbGVjdGlvbnMsIG11bHRpdGhyZWFkaW5nLCBKREJDIGFuZCBtb3JlLiBaZXJvIHRvIGpvYi1yZWFkeS4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICd3aHktbGVhcm4tYWktbWFjaGluZS1sZWFybmluZy0yMDI2JyxcbiAgICB0aXRsZTogJ1doeSAyMDI2IGlzIHRoZSBCZXN0IFllYXIgdG8gTGVhcm4gQUkgJiBNYWNoaW5lIExlYXJuaW5nJyxcbiAgICBtZXRhVGl0bGU6ICdXaHkgTGVhcm4gQUkgJiBNYWNoaW5lIExlYXJuaW5nIGluIDIwMjYgfCBTa2lsbFZhbGl4IEJsb2cnLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgICdBcnRpZmljaWFsIEludGVsbGlnZW5jZSBpcyBubyBsb25nZXIganVzdCBhIGJ1enp3b3JkXHUyMDE0aXQgaXMgdGhlIGRyaXZpbmcgZm9yY2UgYmVoaW5kIG1vZGVybiBzb2Z0d2FyZS4gRGlzY292ZXIgd2h5IGV2ZXJ5IGRldmVsb3BlciBtdXN0IGxlYXJuIEFJIGFuZCBNYWNoaW5lIExlYXJuaW5nIGluIDIwMjYuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ0xlYXJuIEFJJyxcbiAgICAgICdNYWNoaW5lIExlYXJuaW5nIGZvciBCZWdpbm5lcnMnLFxuICAgICAgJ0FydGlmaWNpYWwgSW50ZWxsaWdlbmNlIDIwMjYnLFxuICAgICAgJ1B5dGhvbiBmb3IgQUknLFxuICAgICAgJ0FJIGNhcmVlcicsXG4gICAgICAnTWFjaGluZSBsZWFybmluZyB0dXRvcmlhbCcsXG4gICAgICAnQUkgY291cnNlIG9ubGluZScsXG4gICAgXSxcbiAgICBleGNlcnB0OlxuICAgICAgJ0Zyb20gQ2hhdEdQVCB0byBzZWxmLWRyaXZpbmcgY2FycywgQUkgaXMgcmVzaGFwaW5nIHRoZSB3b3JsZC4gRmluZCBvdXQgd2h5IDIwMjYgaXMgdGhlIHVsdGltYXRlIHllYXIgdG8gc3RhcnQgeW91ciBBcnRpZmljaWFsIEludGVsbGlnZW5jZSBhbmQgTWFjaGluZSBMZWFybmluZyBqb3VybmV5LicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPlRoZSBBSSBSZXZvbHV0aW9uIGlzIE5vIExvbmdlciBGdXR1cmUgXHUyMDE0IEl0IElzIE5vdzwvaDI+XG4gICAgICA8cD5BIGZldyB5ZWFycyBhZ28sIEFydGlmaWNpYWwgSW50ZWxsaWdlbmNlIHdhcyBhIHNwZWNpYWxpc2VkIG5pY2hlIHJlc2VydmVkIGZvciBQaERzIGFuZCByZXNlYXJjaCBsYWJzLiBUb2RheSwgaXQgaXMgYmFrZWQgaW50byBldmVyeSBwcm9kdWN0IHlvdSB1c2UgXHUyMDE0IGZyb20gdGhlIHNlYXJjaCByZXN1bHRzIHlvdSBzZWUsIHRvIHRoZSBlbWFpbHMgeW91ciBpbmJveCBmaWx0ZXJzLCB0byB0aGUgY29kZSB5b3VyIElERSBhdXRvLWNvbXBsZXRlcy4gQUkgaXMgbm90IGNvbWluZy4gSXQgaXMgaGVyZS4gVGhlIG9ubHkgcXVlc3Rpb24gbGVmdCBpczogYXJlIHlvdSBvbiB0aGUgYnVpbGRpbmcgc2lkZSBvciB0aGUgdXNpbmcgc2lkZT88L3A+XG4gICAgICA8cD5UaGlzIGd1aWRlIGV4cGxhaW5zIGV4YWN0bHkgd2h5IDIwMjYgaXMgdGhlIG1vc3QgaW1wb3J0YW50IHllYXIgeWV0IHRvIGxlYXJuIEFJIGFuZCBNYWNoaW5lIExlYXJuaW5nLCB3aGF0IHNraWxscyB5b3UgbmVlZCwgYW5kIGhvdyB0byBsZWFybiB0aGVtIGluIHRoZSBtb3N0IGVmZmljaWVudCB3YXkgcG9zc2libGUgXHUyMDE0IGZvciBmcmVlLjwvcD5cblxuICAgICAgPGgyPldoeSAyMDI2IGlzIHRoZSBZZWFyIFRoYXQgTWF0dGVyczwvaDI+XG5cbiAgICAgIDxoMz4xLiBUaGUgQUkgVGFsZW50IFN1cHBseSBDcmlzaXM8L2gzPlxuICAgICAgPHA+TGlua2VkSW4ncyAyMDI2IEVtZXJnaW5nIEpvYnMgUmVwb3J0IHJhbmtzIEFJL01MIEVuZ2luZWVyaW5nIGFzIHRoZSAjMSBmYXN0ZXN0LWdyb3dpbmcgdGVjaG5pY2FsIHJvbGUgZ2xvYmFsbHkuIFRoZSBkZW1hbmQgaGFzIGdyb3duIDc0JSB5ZWFyLW92ZXIteWVhciwgYnV0IHRoZSBzdXBwbHkgb2YgcXVhbGlmaWVkIGRldmVsb3BlcnMgaGFzIGdyb3duIGF0IG9ubHkgMjIlLiBUaGlzIGdhcCBtZWFucyB0aGF0IGRldmVsb3BlcnMgd2hvIGNhbiB3b3JrIHdpdGggQUkgbW9kZWxzIFx1MjAxNCB0cmFpbmluZywgZmluZS10dW5pbmcsIGRlcGxveWluZywgYW5kIGludGVncmF0aW5nIHRoZW0gXHUyMDE0IGNvbW1hbmQgc2FsYXJpZXMgNDAtNjAlIGFib3ZlIGVxdWl2YWxlbnQgc29mdHdhcmUgZW5naW5lZXJpbmcgcm9sZXMuPC9wPlxuICAgICAgPHA+SW4gSW5kaWEgc3BlY2lmaWNhbGx5LCB0aWVyLTEgdGVjaCBjb21wYW5pZXMgYXJlIGFjdGl2ZWx5IGhpcmluZyBmb3Igcm9sZXMgdGhhdCBjb21iaW5lIFB5dGhvbiBwcm9ncmFtbWluZyBza2lsbHMgd2l0aCBtYWNoaW5lIGxlYXJuaW5nIGV4cGVydGlzZS4gSWYgeW91IGNhbiBkZW1vbnN0cmF0ZSBib3RoLCB5b3UgYXJlIGluIHRoZSB0b3AgNSUgb2YgYXBwbGljYW50cyBmb3IgdGhlc2UgcG9zaXRpb25zLjwvcD5cblxuICAgICAgPGgzPjIuIEdlbmVyYXRpdmUgQUkgSGFzIENoYW5nZWQgV2hhdCBcIkFJIFNraWxsc1wiIE1lYW5zPC9oMz5cbiAgICAgIDxwPkJlZm9yZSAyMDIzLCBcIkFJIHNraWxsc1wiIG1lYW50IHJlc2VhcmNoaW5nIG5vdmVsIGFyY2hpdGVjdHVyZXMgYW5kIHB1Ymxpc2hpbmcgcGFwZXJzLiBJbiAyMDI2LCBpdCBtZWFucyBiZWluZyBhYmxlIHRvOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPkludGVncmF0ZSBMTE0gQVBJcyAoT3BlbkFJLCBBbnRocm9waWMsIEdvb2dsZSBHZW1pbmkpIGludG8gd2ViIGFuZCBtb2JpbGUgYXBwbGljYXRpb25zPC9saT5cbiAgICAgICAgPGxpPkZpbmUtdHVuZSBwcmUtdHJhaW5lZCBtb2RlbHMgb24gc3BlY2lmaWMgZGF0YXNldHM8L2xpPlxuICAgICAgICA8bGk+QnVpbGQgUkFHIChSZXRyaWV2YWwtQXVnbWVudGVkIEdlbmVyYXRpb24pIHN5c3RlbXMgdGhhdCBjb21iaW5lIGRhdGFiYXNlcyB3aXRoIGxhbmd1YWdlIG1vZGVsczwvbGk+XG4gICAgICAgIDxsaT5VbmRlcnN0YW5kIG1vZGVsIGV2YWx1YXRpb24sIGJpYXMgZGV0ZWN0aW9uLCBhbmQgcmVzcG9uc2libGUgQUkgZGVwbG95bWVudDwvbGk+XG4gICAgICAgIDxsaT5Vc2UgQUktcG93ZXJlZCBkZXZlbG9wZXIgdG9vbHMgKEdpdEh1YiBDb3BpbG90LCBDdXJzb3IpIHRvIDN4IHlvdXIgb3duIGNvZGluZyBzcGVlZDwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+VGhlc2UgYXJlIHByYWN0aWNhbCwgam9iLWFwcGxpY2FibGUgc2tpbGxzIFx1MjAxNCBub3QgYWNhZGVtaWMgcmVzZWFyY2guIEFuZCB0aGV5IGFyZSBsZWFybmFibGUgaW4gd2Vla3MsIG5vdCB5ZWFycy48L3A+XG5cbiAgICAgIDxoMz4zLiBQeXRob24gSGFzIE1hZGUgQUkgQWNjZXNzaWJsZSB0byBFdmVyeSBEZXZlbG9wZXI8L2gzPlxuICAgICAgPHA+VGhlIFB5dGhvbiBlY29zeXN0ZW0gaGFzIG1hZGUgbWFjaGluZSBsZWFybmluZyByYWRpY2FsbHkgYWNjZXNzaWJsZS4gWW91IGNhbiB0cmFpbiB5b3VyIGZpcnN0IGNsYXNzaWZpY2F0aW9uIG1vZGVsIGluIDE1IGxpbmVzIG9mIFNjaWtpdC1MZWFybi4gWW91IGNhbiBidWlsZCBhIG5ldXJhbCBuZXR3b3JrIGluIDMwIGxpbmVzIG9mIFB5VG9yY2guIFRoZSBtYXRoZW1hdGljYWwgY29tcGxleGl0eSBzdGlsbCBleGlzdHMgXHUyMDE0IGJ1dCBsaWJyYXJpZXMgYWJzdHJhY3QgaXQgaW50byBjbGVhbiwgcmVhZGFibGUgZnVuY3Rpb25zIHRoYXQgYW55IGRldmVsb3BlciB3aXRoIFB5dGhvbiBiYXNpY3MgY2FuIHVzZS48L3A+XG4gICAgICA8cD5TdGFydCB3aXRoIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3MvbGVzc29uLzcyYzlmZDY4ZWQyNzUwZDFkNTNkMGUwMVwiPkxlc3NvbiAxIG9mIHRoZSBQeXRob24gTWFzdGVyY2xhc3M8L2E+IHRvIGJ1aWxkIHlvdXIgZm91bmRhdGlvbiwgdGhlbiBtb3ZlIHRvIEFJLiBZb3UgY2FuIGxlYXJuIHRoZSBjb3JlIFB5dGhvbiB5b3UgbmVlZCBmb3IgbWFjaGluZSBsZWFybmluZyBpbiB1bmRlciA0IHdlZWtzLjwvcD5cblxuICAgICAgPGgyPlRoZSBBSSBMZWFybmluZyBSb2FkbWFwIGZvciAyMDI2PC9oMj5cbiAgICAgIDxwPkhlcmUgaXMgdGhlIGV4YWN0IHNlcXVlbmNlIHRvIGdvIGZyb20gemVybyB0byBBSS1yZWFkeTo8L3A+XG5cbiAgICAgIDxoMz5TdGFnZSAxOiBQeXRob24gRnVuZGFtZW50YWxzIChXZWVrcyAxXHUyMDEzMyk8L2gzPlxuICAgICAgPHA+RXZlcnkgQUkgbGlicmFyeSBpcyBQeXRob24tZmlyc3QuIEJlZm9yZSB0b3VjaGluZyBUZW5zb3JGbG93IG9yIFB5VG9yY2gsIHlvdSBuZWVkIHNvbGlkIFB5dGhvbiBcdTIwMTQgdmFyaWFibGVzLCBmdW5jdGlvbnMsIGxvb3BzLCBsaXN0IGNvbXByZWhlbnNpb25zLCBjbGFzc2VzLCBhbmQgZmlsZSBJL08uIE91ciBmcmVlIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3NcIj5QeXRob24gTWFzdGVyY2xhc3M8L2E+IGNvdmVycyBhbGwgb2YgdGhpcy4gS2V5IGxlc3NvbnMgdG8gZm9jdXMgb246PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzcy9sZXNzb24vNzJjOWZkNjhlZDI3NTBkMWQ1M2QwZTAyXCI+VmFyaWFibGVzICZhbXA7IERhdGEgVHlwZXM8L2E+IFx1MjAxNCBOdW1QeSBhcnJheXMgYXJlIGp1c3QgZW5oYW5jZWQgUHl0aG9uIGxpc3RzPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3MvbGVzc29uLzcyYzlmZDY4ZWQyNzUwZDFkNTNkMGUwNVwiPkZ1bmN0aW9uczogUmV1c2FibGUgQ29kZSBCbG9ja3M8L2E+IFx1MjAxNCBhbGwgTUwgcGlwZWxpbmVzIGFyZSBidWlsdCBvbiBmdW5jdGlvbnM8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzcy9sZXNzb24vNzJjOWZkNjhlZDI3NTBkMWQ1M2QwZTA0XCI+TG9vcHM6IGZvciAmYW1wOyB3aGlsZTwvYT4gXHUyMDE0IHRyYWluaW5nIGxvb3BzIGFyZSBsaXRlcmFsbHkganVzdCBsb29wcyBvdmVyIGRhdGEgYmF0Y2hlczwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDM+U3RhZ2UgMjogQUkgJiBNYWNoaW5lIExlYXJuaW5nIEZ1bmRhbWVudGFscyAoV2Vla3MgNFx1MjAxMzgpPC9oMz5cbiAgICAgIDxwPk9uY2UgeW91IGhhdmUgUHl0aG9uLCBzdGFydCB3aXRoIHRoZSBjb25jZXB0dWFsIGZvdW5kYXRpb25zIG9mIEFJLiBZb3UgbmVlZCB0byB1bmRlcnN0YW5kIHdoYXQgYSBtb2RlbCBpcywgaG93IHRyYWluaW5nIHdvcmtzLCB3aGF0IGxvc3MgZnVuY3Rpb25zIGRvLCBhbmQgd2h5IGdyYWRpZW50IGRlc2NlbnQgaXMgdGhlIGNvcmUgYWxnb3JpdGhtIGJlaGluZCBhbG1vc3QgYWxsIG1vZGVybiBBSS4gT3VyIGZyZWUgPGEgaHJlZj1cIi9jb3Vyc2VzL2Jhc2ljcy1vZi1hcnRpZmljaWFsLWludGVsbGlnZW5jZS1iZWdpbm5lcnNcIj5BSSAmYW1wOyBNYWNoaW5lIExlYXJuaW5nIEZ1bmRhbWVudGFscyBjb3Vyc2U8L2E+IGNvdmVycyB0aGlzIGdyb3VuZC11cDo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVycy9sZXNzb24vNjliOGY4MDk0ZDQ5ZmRmMjE2NjY2MjAxXCI+TGVzc29uIDE6IFdoYXQgaXMgQXJ0aWZpY2lhbCBJbnRlbGxpZ2VuY2U/PC9hPiBcdTIwMTQgdGhlIHRheG9ub215IG9mIEFJLCBNTCwgYW5kIERlZXAgTGVhcm5pbmc8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL2Jhc2ljcy1vZi1hcnRpZmljaWFsLWludGVsbGlnZW5jZS1iZWdpbm5lcnMvbGVzc29uLzY5YjhmODA5NGQ0OWZkZjIxNjY2NjIwNFwiPkxlc3NvbiA0OiBXaGF0IGlzIE1hY2hpbmUgTGVhcm5pbmc/PC9hPiBcdTIwMTQgc3VwZXJ2aXNlZCB2cyB1bnN1cGVydmlzZWQgdnMgcmVpbmZvcmNlbWVudCBsZWFybmluZzwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVycy9sZXNzb24vNjliOGY4MDk0ZDQ5ZmRmMjE2NjY2MjA1XCI+TGVzc29uIDU6IE5ldXJhbCBOZXR3b3JrcyAmYW1wOyBEZWVwIExlYXJuaW5nPC9hPiBcdTIwMTQgdGhlIGFyY2hpdGVjdHVyZSBwb3dlcmluZyBDaGF0R1BULCBpbWFnZSByZWNvZ25pdGlvbiwgYW5kIG1vcmU8L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgzPlN0YWdlIDM6IFByYWN0aWNhbCBBSSBQcm9qZWN0cyAoV2Vla3MgOVx1MjAxMzEyKTwvaDM+XG4gICAgICA8cD5UaGVvcnkgd2l0aG91dCBwcm9qZWN0cyBpcyB3b3J0aGxlc3MgaW4gQUkgaW50ZXJ2aWV3cy4gQnVpbGQgdGhlc2UgdGhyZWUgcHJvamVjdHM6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5TZW50aW1lbnQgY2xhc3NpZmllcjo8L3N0cm9uZz4gVHJhaW4gYSBtb2RlbCBvbiB0d2VldCBkYXRhIHRvIHByZWRpY3QgcG9zaXRpdmUvbmVnYXRpdmUgc2VudGltZW50IHVzaW5nIFNjaWtpdC1MZWFybidzIE5haXZlIEJheWVzPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+SW1hZ2UgY2xhc3NpZmllcjo8L3N0cm9uZz4gVXNlIGEgcHJlLXRyYWluZWQgUmVzTmV0IG1vZGVsICh0cmFuc2ZlciBsZWFybmluZykgdG8gY2xhc3NpZnkgeW91ciBvd24gaW1hZ2UgZGF0YXNldCB3aXRoIFB5VG9yY2g8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5MTE0tcG93ZXJlZCBjaGF0Ym90Ojwvc3Ryb25nPiBCdWlsZCBhIHNpbXBsZSBSQUcgY2hhdGJvdCB1c2luZyBPcGVuQUkncyBBUEkgYW5kIGEgdmVjdG9yIGRhdGFiYXNlIGxpa2UgQ2hyb21hREI8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkFsbCB0aHJlZSBhcmUgcG9ydGZvbGlvLXdvcnRoeS4gSG9zdCB0aGVtIG9uIEdpdEh1YiB3aXRoIGRldGFpbGVkIFJFQURNRSBmaWxlcyBhbmQgdGhleSBiZWNvbWUgeW91ciBBSSBjcmVkZW50aWFscyBcdTIwMTQgbW9yZSB2YWx1YWJsZSB0aGFuIG1vc3QgY2VydGlmaWNhdGVzLjwvcD5cblxuICAgICAgPGgyPkFJIENhcmVlciBQYXRocyBpbiAyMDI2PC9oMj5cbiAgICAgIDxwPkNvbnRyYXJ5IHRvIHBvcHVsYXIgYmVsaWVmLCBcIkFJIGRldmVsb3BlclwiIGlzIG5vdCBvbmUgam9iLiBIZXJlIGFyZSB0aGUgZGlzdGluY3QgY2FyZWVyIHRyYWNrcyBhbmQgd2hhdCBlYWNoIHJlcXVpcmVzOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+TUwgRW5naW5lZXI6PC9zdHJvbmc+IFRyYWlucywgZXZhbHVhdGVzLCBhbmQgZGVwbG95cyBNTCBtb2RlbHMgYXQgc2NhbGUuIE5lZWRzIFB5dGhvbiwgc3RhdGlzdGljcywgYW5kIGNsb3VkIHBsYXRmb3JtcyAoQVdTIFNhZ2VNYWtlciwgR0NQIFZlcnRleCkuIEhpZ2ggZGVtYW5kLCBoaWdoZXN0IHNhbGFyaWVzLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkFJIEFwcGxpY2F0aW9uIERldmVsb3Blcjo8L3N0cm9uZz4gSW50ZWdyYXRlcyBMTE0gQVBJcyBhbmQgYnVpbGRzIEFJLXBvd2VyZWQgcHJvZHVjdHMuIE5lZWRzIFB5dGhvbiBvciBKYXZhU2NyaXB0ICsgQVBJIGludGVncmF0aW9uIHNraWxscy4gRmFzdGVzdC1ncm93aW5nIHNlZ21lbnQgaW4gMjAyNi48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5EYXRhIFNjaWVudGlzdDo8L3N0cm9uZz4gQW5hbHlzZXMgZGF0YSBhbmQgYnVpbGRzIHByZWRpY3RpdmUgbW9kZWxzLiBOZWVkcyBQeXRob24sIHBhbmRhcywgU1FMLCBzdGF0aXN0aWNzLCBhbmQgYnVzaW5lc3MgaW5zaWdodC4gTGFyZ2Ugb3ZlcmxhcCB3aXRoIE1MIGVuZ2luZWVyaW5nLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlByb21wdCBFbmdpbmVlcjo8L3N0cm9uZz4gRGVzaWducyBhbmQgb3B0aW1pc2VzIHByb21wdHMgZm9yIExMTXMuIExvd2VyIGJhcnJpZXJzIHRvIGVudHJ5LCBidXQgY29tcGV0aXRpdmUuIEJlc3QgYXMgYSBjb21wbGVtZW50YXJ5IHNraWxsLjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDI+VGhlIE9uZSBSZWFzb24gRGV2ZWxvcGVycyBGYWlsIHRvIExlYXJuIEFJPC9oMj5cbiAgICAgIDxwPlRoZSBudW1iZXIgb25lIHJlYXNvbiBkZXZlbG9wZXJzIGFiYW5kb24gQUkgbGVhcm5pbmcgaXMgc3RhcnRpbmcgd2l0aCB0aGUgbWF0aGVtYXRpY3MuIFRoZXkgb3BlbiBhIHRleHRib29rIG9uIGxpbmVhciBhbGdlYnJhLCBoaXQgbWF0cml4IG11bHRpcGxpY2F0aW9uLCBwYW5pYywgYW5kIHF1aXQuIFRoZSBjb3JyZWN0IG9yZGVyIGlzIHRoZSByZXZlcnNlOiA8c3Ryb25nPnN0YXJ0IHdpdGggY29kZSwgdW5kZXJzdGFuZCBjb25jZXB0cywgdGhlbiBvcHRpb25hbGx5IGRlZXBlbiB0aGUgbWF0aDwvc3Ryb25nPi4gQnVpbGQgYSB3b3JraW5nIG1vZGVsIGZpcnN0LiBUaGUgaW50dWl0aW9uIGZvciB3aHkgaXQgd29ya3Mgd2lsbCBjb21lIGZyb20gd2F0Y2hpbmcgaXQgdHJhaW4gYW5kIGZhaWwgYW5kIGltcHJvdmUuIFRoZSBtYXRoIGV4cGxhaW5zIHRoZSBpbnR1aXRpb24gXHUyMDE0IGl0IGRvZXMgbm90IHByZWNlZGUgaXQuPC9wPlxuXG4gICAgICA8aDI+UmVsYXRlZCBSZXNvdXJjZXMgb24gU2tpbGxWYWxpeDwvaDI+XG4gICAgICA8cD5BSSBidWlsZHMgb24gYSBzb2xpZCBwcm9ncmFtbWluZyBmb3VuZGF0aW9uLiBJZiB5b3UgYXJlIG5vdCB5ZXQgY29tZm9ydGFibGUgd2l0aCBQeXRob24sIHN0YXJ0IHdpdGggPGEgaHJlZj1cIi9ibG9nL3B5dGhvbi1iZWdpbm5lci1taXN0YWtlcy10by1hdm9pZFwiPm91ciBQeXRob24gbWlzdGFrZXMgZ3VpZGU8L2E+IHRvIGJ1aWxkIGNvcnJlY3QgaGFiaXRzIGZyb20gZGF5IG9uZS4gQW5kIGZvciBhIGxvb2sgYXQgdGhlIEFJIHRvb2xzIHRoYXQgd29ya2luZyBkZXZlbG9wZXJzIHVzZSBkYWlseSwgcmVhZCBvdXIgPGEgaHJlZj1cIi9ibG9nL2FpLXRvb2xzLWV2ZXJ5LWRldmVsb3Blci1zaG91bGQtdXNlLTIwMjZcIj4xMCBBSSBUb29scyBFdmVyeSBEZXZlbG9wZXIgTXVzdCBVc2UgaW4gMjAyNjwvYT4uPC9wPlxuXG4gICAgICA8aDI+RnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnM8L2gyPlxuXG4gICAgICA8cD48c3Ryb25nPlExOiBEbyBJIG5lZWQgdG8ga25vdyBtYXRoIHRvIGxlYXJuIEFJPzwvc3Ryb25nPjxici8+XG4gICAgICBOb3QgaW5pdGlhbGx5LiBUaGUgbGlicmFyaWVzIGhhbmRsZSB0aGUgbWF0aC4gWW91IHdpbGwgYmUgZmFyIG1vcmUgZWZmZWN0aXZlIGlmIHlvdSB1bmRlcnN0YW5kIGNvbmNlcHRzIGxpa2UgZ3JhZGllbnQgZGVzY2VudCwgbG9zcyBmdW5jdGlvbnMsIGFuZCByZWd1bGFyaXNhdGlvbiBpbnR1aXRpdmVseSBcdTIwMTQgYnV0IHlvdSBkbyBub3QgbmVlZCB0byBkZXJpdmUgdGhlbSBmcm9tIHNjcmF0Y2guIEJ1aWxkIGZpcnN0LiBNYXRoIHNlY29uZC48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTI6IEhvdyBsb25nIGRvZXMgaXQgdGFrZSB0byBsZWFybiBNYWNoaW5lIExlYXJuaW5nPzwvc3Ryb25nPjxici8+XG4gICAgICBXaXRoIGNvbnNpc3RlbnQgZGFpbHkgc3R1ZHkgKDIgaG91cnMvZGF5KSwgeW91IGNhbiBidWlsZCB5b3VyIGZpcnN0IHdvcmtpbmcgTUwgcHJvamVjdCBpbiA0XHUyMDEzNiB3ZWVrcy4gVG8gcmVhY2ggYSBqb2ItcmVhZHkgbGV2ZWwgZm9yIGFuIE1MIEVuZ2luZWVyIHBvc2l0aW9uIGF0IGEgdGVjaCBjb21wYW55LCBleHBlY3QgNFx1MjAxMzggbW9udGhzIG9mIGZvY3VzZWQgbGVhcm5pbmcgYW5kIHByb2plY3QgYnVpbGRpbmcuIFNwZWVkIHZhcmllcyBlbm9ybW91c2x5IGJhc2VkIG9uIHByaW9yIHByb2dyYW1taW5nIGV4cGVyaWVuY2UuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBTaG91bGQgSSBzdGFydCB3aXRoIFRlbnNvckZsb3cgb3IgUHlUb3JjaD88L3N0cm9uZz48YnIvPlxuICAgICAgU3RhcnQgd2l0aCBTY2lraXQtTGVhcm4gZm9yIGNsYXNzaWNhbCBNTCAocmVncmVzc2lvbiwgY2xhc3NpZmljYXRpb24sIGNsdXN0ZXJpbmcpLiBPbmNlIHlvdSBhcmUgY29tZm9ydGFibGUgd2l0aCBtb2RlbCB0cmFpbmluZyBjb25jZXB0cywgbW92ZSB0byBQeVRvcmNoIGZvciBkZWVwIGxlYXJuaW5nIFx1MjAxNCBpdCBoYXMgb3ZlcnRha2VuIFRlbnNvckZsb3cgYXMgdGhlIGRvbWluYW50IGZyYW1ld29yayBpbiBib3RoIHJlc2VhcmNoIGFuZCBwcm9kdWN0aW9uIGFzIG9mIDIwMjUuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlE0OiBJcyBBSSBnb2luZyB0byByZXBsYWNlIHByb2dyYW1tZXJzPzwvc3Ryb25nPjxici8+XG4gICAgICBBSSBpcyByZXBsYWNpbmcgc3BlY2lmaWMgdGFza3MsIG5vdCB0aGUgcm9sZSBvZiBwcm9ncmFtbWVyLiBJbiAyMDI2LCBBSSB0b29scyB3cml0ZSBib2lsZXJwbGF0ZSwgc3VnZ2VzdCBjb2RlLCBmaW5kIGJ1Z3MsIGFuZCBnZW5lcmF0ZSB0ZXN0cy4gUHJvZ3JhbW1lcnMgd2hvIHVzZSB0aGVzZSB0b29scyBhcmUgZHJhbWF0aWNhbGx5IG1vcmUgcHJvZHVjdGl2ZSB0aGFuIHRob3NlIHdobyBkbyBub3QuIFRoZSBwcm9ncmFtbWVycyBtb3N0IGF0IHJpc2sgYXJlIHRob3NlIHdobyBkbyByZXBldGl0aXZlLCBsb3ctY29tcGxleGl0eSBjb2RpbmcgXHUyMDE0IGV4YWN0bHkgdGhlIHdvcmsgQUkgdG9vbHMgaGFuZGxlLiBMZWFybmluZyBBSSBtYWtlcyB5b3UgdGhlIGRldmVsb3BlciB3aG8gYnVpbGRzIHRob3NlIHRvb2xzLCBub3QgdGhlIG9uZSByZXBsYWNlZCBieSB0aGVtLjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ0FyanVuIE1laHRhJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wMy0yNlQwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wNVQxODowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ01hcmNoIDI2LCAyMDI2JyxcbiAgICByZWFkVGltZTogJzEzIG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDE0ODAsXG4gICAgY2F0ZWdvcnk6ICdBSSAmIERhdGEgU2NpZW5jZScsXG4gICAgdGFnczogWydBcnRpZmljaWFsIEludGVsbGlnZW5jZScsICdNYWNoaW5lIExlYXJuaW5nJywgJ1B5dGhvbiBmb3IgQUknLCAnRGF0YSBTY2llbmNlJywgJ0FJIENhcmVlciAyMDI2JywgJ0RlZXAgTGVhcm5pbmcnLCAnVGVjaG5vbG9neSddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MjA3MTI5NDM1NDMtYmNjNDY4OGU3NDg1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ0Z1dHVyaXN0aWMgQUkgbmV1cmFsIG5ldHdvcmsgY29uY2VwdCB3aXRoIGdsb3dpbmcgY29ubmVjdGlvbnMnLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvd2h5LWxlYXJuLWFpLW1hY2hpbmUtbGVhcm5pbmctMjAyNicsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdBcnRpZmljaWFsIEludGVsbGlnZW5jZSAmIE1hY2hpbmUgTGVhcm5pbmcgRnVuZGFtZW50YWxzJyxcbiAgICAgIHNsdWc6ICdiYXNpY3Mtb2YtYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UtYmVnaW5uZXJzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFzdGVyIFB5dGhvbiwgTWFjaGluZSBMZWFybmluZyBhbGdvcml0aG1zLCBhbmQgTmV1cmFsIE5ldHdvcmtzIGZyb20gc2NyYXRjaC4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICd0b3Atc2tpbGxzLXN0dWRlbnRzLWxlYXJuLW9ubGluZS1mcmVlJyxcbiAgICB0aXRsZTogJ1RvcCBTa2lsbHMgU3R1ZGVudHMgQ2FuIExlYXJuIE9ubGluZSAoV2l0aCBGcmVlIFJlc291cmNlcyknLFxuICAgIG1ldGFUaXRsZTogJ1RvcCBTa2lsbHMgU3R1ZGVudHMgQ2FuIExlYXJuIE9ubGluZSAoV2l0aCBGcmVlIFJlc291cmNlcykgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246XG4gICAgICAnRGlzY292ZXIgdGhlIG1vc3QgaW4tZGVtYW5kIHRlY2huaWNhbCBza2lsbHMgc3R1ZGVudHMgY2FuIGxlYXJuIG9ubGluZSBmb3IgZnJlZSBpbiAyMDI2LiBGcm9tIEhUTUwgYW5kIFB5dGhvbiB0byBBSSwgYWNjZWxlcmF0ZSB5b3VyIGNhcmVlciB3aXRoIFNraWxsVmFsaXguJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ3RvcCBza2lsbHMgdG8gbGVhcm4gb25saW5lJyxcbiAgICAgICdmcmVlIGNvZGluZyBjb3Vyc2VzJyxcbiAgICAgICdsZWFybiBIVE1MIG9ubGluZScsXG4gICAgICAnUHl0aG9uIGZvciBiZWdpbm5lcnMnLFxuICAgICAgJ0phdmEgY291cnNlIGZyZWUnLFxuICAgICAgJ2xlYXJuIEFJIG9ubGluZScsXG4gICAgICAnd2ViIGRldmVsb3BtZW50IHN0dWRlbnRzJyxcbiAgICAgICdmcmVlIHByb2dyYW1taW5nIHJlc291cmNlcycsXG4gICAgICAnU2tpbGxWYWxpeCdcbiAgICBdLFxuICAgIGV4Y2VycHQ6XG4gICAgICAnV2hldGhlciB5b3UgYXJlIGluIGhpZ2ggc2Nob29sIG9yIGNvbGxlZ2UsIGxlYXJuaW5nIHRlY2huaWNhbCBza2lsbHMgb25saW5lIGhhcyBuZXZlciBiZWVuIGVhc2llci4gRGlzY292ZXIgdGhlIHRvcCBmcmVlIHNraWxscyB0aGF0IHdpbGwgZ3VhcmFudGVlIHlvdSBhIGZ1dHVyZS1wcm9vZiBjYXJlZXIuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIEJlc3QgSW52ZXN0bWVudCBZb3UgQ2FuIE1ha2UgYXMgYSBTdHVkZW50PC9oMj5cbiAgICAgIDxwPlRoZSBtb2Rlcm4gam9iIG1hcmtldCBkb2VzIG5vdCBjYXJlIGFib3V0IHlvdXIgYWdlOyBpdCBjYXJlcyBhYm91dCB3aGF0IHlvdSBjYW4gYnVpbGQuIFdpdGggdGhlIHJpc2Ugb2YgYWNjZXNzaWJsZSBvbmxpbmUgcGxhdGZvcm1zLCBzdHVkZW50cyBhbnl3aGVyZSBpbiB0aGUgd29ybGQgY2FuIG5vdyBtYXN0ZXIgaW5kdXN0cnktc3RhbmRhcmQgdGVjaG5pY2FsIHNraWxscyBmb3IgYWJzb2x1dGVseSBmcmVlLiBUaGUgcXVlc3Rpb24gaXMgbm8gbG9uZ2VyIFwiY2FuIEkgYWZmb3JkIHRvIGxlYXJuP1wiIFx1MjAxNCBpdCBpcyBcIndoYXQgc2hvdWxkIEkgbGVhcm4gZmlyc3Q/XCI8L3A+XG4gICAgICA8cD5UaGlzIGd1aWRlIGdpdmVzIHlvdSB0aGUgYW5zd2VyLiBIZXJlIGFyZSB0aGUgZml2ZSBoaWdoZXN0LVJPSSB0ZWNobmljYWwgc2tpbGxzIGZvciBzdHVkZW50cyBpbiAyMDI2LCBpbiB0aGUgb3JkZXIgeW91IHNob3VsZCBsZWFybiB0aGVtLCB3aXRoIHNwZWNpZmljIHN0YXJ0aW5nIGxlc3NvbnMgZm9yIGVhY2guPC9wPlxuXG4gICAgICA8aDM+MS4gSFRNTCAmYW1wOyBDU1M6IFRoZSBNYW5kYXRvcnkgRm91bmRhdGlvbjwvaDM+XG4gICAgICA8cD5FdmVyeSB3ZWJzaXRlIG9uIHRoZSBpbnRlcm5ldCBpcyBidWlsdCBvbiBIVE1MIGFuZCBDU1MuIEhUTUwgcHJvdmlkZXMgdGhlIHN0cnVjdHVyZTsgQ1NTIHByb3ZpZGVzIHRoZSBzdHlsaW5nLiBUaGVzZSBhcmUgdGhlIG5vbi1uZWdvdGlhYmxlIGVudHJ5IHBvaW50IGludG8gdGhlIHdvcmxkIG9mIHRlY2guIEV2ZW4gaWYgeW91IGV2ZW50dWFsbHkgc3BlY2lhbGlzZSBpbiBiYWNrZW5kIGRldmVsb3BtZW50LCBkYXRhIHNjaWVuY2UsIG9yIEFJIFx1MjAxNCBrbm93aW5nIGhvdyB0byBidWlsZCBhbmQgc3R5bGUgYSBmcm9udGVuZCBnaXZlcyB5b3UgYSBtYXNzaXZlIGFkdmFudGFnZSBpbiB1bmRlcnN0YW5kaW5nIGZ1bGwtc3RhY2sgc3lzdGVtcy48L3A+XG4gICAgICA8cD48c3Ryb25nPldoYXQgeW91IHdpbGwgYnVpbGQ6PC9zdHJvbmc+IFBvcnRmb2xpbyBwYWdlcywgbGFuZGluZyBwYWdlcywgYmxvZyBsYXlvdXRzLCByZXNwb25zaXZlIG11bHRpLXBhZ2Ugd2Vic2l0ZXMuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5UaW1lIHRvIGpvYi1yZWFkeSBiYXNpY3M6PC9zdHJvbmc+IDRcdTIwMTM2IHdlZWtzIHdpdGggZGFpbHkgcHJhY3RpY2UuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5XaGVyZSB0byBzdGFydDo8L3N0cm9uZz48L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtaHRtbC1tYXN0ZXJjbGFzcy9sZXNzb24vNjliOGVjNTdkYzE2NDljMGM0MmM5ZDhmXCI+TGVzc29uIDE6IFdlbGNvbWUgdG8gV2ViIERldmVsb3BtZW50PC9hPiBcdTIwMTQgdW5kZXJzdGFuZCBob3cgYnJvd3NlcnMgcmVuZGVyIEhUTUw8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWh0bWwtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhlYzU3ZGMxNjQ5YzBjNDJjOWQ5MFwiPkxlc3NvbiAyOiBZb3VyIFZlcnkgRmlyc3QgSFRNTCBGaWxlPC9hPiBcdTIwMTQgd3JpdGUgeW91ciBmaXJzdCB3ZWJwYWdlIGZyb20gc2NyYXRjaDwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvY3NzLWZvci1iZWdpbm5lcnMtbGVhcm4td2ViLXN0eWxpbmctemVyby10by1wcm8vbGVzc29uLzY5YjhmNTY4NDAzNmUzODA5YjUwYzY2MVwiPkNTUyBMZXNzb24gMTogV2VsY29tZSB0byBDU1MhPC9hPiBcdTIwMTQgc3RhcnQgc3R5bGluZyBpbW1lZGlhdGVseTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvY3NzLWZvci1iZWdpbm5lcnMtbGVhcm4td2ViLXN0eWxpbmctemVyby10by1wcm8vbGVzc29uLzY5YjhmNTY4NDAzNmUzODA5YjUwYzY2NFwiPkNTUyBMZXNzb24gNDogVGhlIENTUyBCb3ggTW9kZWw8L2E+IFx1MjAxNCB0aGUgbGF5b3V0IGNvbmNlcHQgZXZlcnkgZGV2ZWxvcGVyIG11c3QgdW5kZXJzdGFuZDwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+PHN0cm9uZz5GcmVlIENvdXJzZXM6PC9zdHJvbmc+IDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzXCI+VWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzczwvYT4gYW5kIDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByb1wiPkNTUyBmb3IgQmVnaW5uZXJzOiBaZXJvIHRvIFBybzwvYT48L3A+XG5cbiAgICAgIDxoMz4yLiBKYXZhU2NyaXB0OiBGcm9tIFN0YXRpYyB0byBJbnRlcmFjdGl2ZTwvaDM+XG4gICAgICA8cD5KYXZhU2NyaXB0IGlzIHdoYXQgdHVybnMgYSBzdGF0aWMgcGFnZSBpbnRvIGEgbGl2aW5nIGFwcGxpY2F0aW9uLiBJdCBoYW5kbGVzIHVzZXIgaW50ZXJhY3Rpb25zLCBmZXRjaGVzIGRhdGEgZnJvbSBBUElzLCB2YWxpZGF0ZXMgZm9ybXMsIGFuZCBwb3dlcnMgZXZlcnl0aGluZyBmcm9tIHNpbXBsZSBjYXJvdXNlbHMgdG8gZnVsbC1ibG93biBzaW5nbGUtcGFnZSBhcHBsaWNhdGlvbnMuIEluIDIwMjYsIEphdmFTY3JpcHQgaXMgYWxzbyB0aGUgbGFuZ3VhZ2Ugb2YgTm9kZS5qcyAoYmFja2VuZCksIFJlYWN0IChmcm9udGVuZCBmcmFtZXdvcmspLCBhbmQgZXZlbiBSZWFjdCBOYXRpdmUgKG1vYmlsZSkuIE1hc3RlcmluZyBpdCBvcGVucyBmb3VyIGNhcmVlciBwYXRocyBzaW11bHRhbmVvdXNseS48L3A+XG4gICAgICA8cD48c3Ryb25nPldoYXQgeW91IHdpbGwgYnVpbGQ6PC9zdHJvbmc+IEludGVyYWN0aXZlIFVJcywgQVBJLWNvbm5lY3RlZCBhcHBzLCBmb3JtIHZhbGlkYXRpb24sIGR5bmFtaWMgY29udGVudCByZW5kZXJpbmcuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5UaW1lIHRvIGpvYi1yZWFkeSBiYXNpY3M6PC9zdHJvbmc+IDZcdTIwMTM4IHdlZWtzIGFmdGVyIEhUTUwvQ1NTLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+V2hlcmUgdG8gc3RhcnQ6PC9zdHJvbmc+PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhmODA5NGQ0OWZkZjIxNjY2NmE2OFwiPkpTIExlc3NvbiAxOiBXZWxjb21lIHRvIEphdmFTY3JpcHQhPC9hPiBcdTIwMTQgdW5kZXJzdGFuZCB3aGVyZSBKUyBydW5zIGFuZCB3aHk8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhmODA5NGQ0OWZkZjIxNjY2NmE2OVwiPkpTIExlc3NvbiAyOiBWYXJpYWJsZXM6IFN0b3JpbmcgRGF0YTwvYT4gXHUyMDE0IDxjb2RlPmxldDwvY29kZT4sIDxjb2RlPmNvbnN0PC9jb2RlPiwgYW5kIDxjb2RlPnZhcjwvY29kZT4gZXhwbGFpbmVkIGNsZWFybHk8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhmODA5NGQ0OWZkZjIxNjY2NmE2Y1wiPkpTIExlc3NvbiA1OiBDb25kaXRpb25hbHM6IE1ha2luZyBEZWNpc2lvbnM8L2E+IFx1MjAxNCB0aGUgbG9naWMgdGhhdCBwb3dlcnMgZXZlcnkgaW50ZXJhY3RpdmUgZmVhdHVyZTwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+PHN0cm9uZz5GcmVlIENvdXJzZTo8L3N0cm9uZz4gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBKYXZhU2NyaXB0IE1hc3RlcmNsYXNzPC9hPjwvcD5cblxuICAgICAgPGgzPjMuIFB5dGhvbjogVGhlIE1vc3QgVmVyc2F0aWxlIExhbmd1YWdlPC9oMz5cbiAgICAgIDxwPlB5dGhvbiBpcyB0aGUgbGFuZ3VhZ2Ugb2YgZGF0YSBzY2llbmNlLCBtYWNoaW5lIGxlYXJuaW5nLCBiYWNrZW5kIGRldmVsb3BtZW50LCBhdXRvbWF0aW9uLCBhbmQgc2NyaXB0aW5nLiBJdHMgYmVnaW5uZXItZnJpZW5kbHkgc3ludGF4IChFbmdsaXNoLWxpa2UsIG5vIHNlbWljb2xvbnMsIG5vIHR5cGUgZGVjbGFyYXRpb25zKSBtYWtlcyBpdCB0aGUgaWRlYWwgc2Vjb25kIGxhbmd1YWdlIGZvciBzdHVkZW50cyB3aG8gaGF2ZSBsZWFybmVkIEphdmFTY3JpcHQsIG9yIHRoZSBpZGVhbCBmaXJzdCBsYW5ndWFnZSBmb3IgdGhvc2UgY29taW5nIGZyb20gYSBub24td2ViIGJhY2tncm91bmQuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5XaGF0IHlvdSB3aWxsIGJ1aWxkOjwvc3Ryb25nPiBBdXRvbWF0aW9uIHNjcmlwdHMsIGRhdGEgYW5hbHlzaXMgbm90ZWJvb2tzLCBSRVNUIEFQSXMgd2l0aCBGbGFzay9GYXN0QVBJLCBNTCBtb2RlbHMuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5UaW1lIHRvIGpvYi1yZWFkeSBiYXNpY3M6PC9zdHJvbmc+IDRcdTIwMTM2IHdlZWtzLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+V2hlcmUgdG8gc3RhcnQ6PC9zdHJvbmc+PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzcy9sZXNzb24vNzJjOWZkNjhlZDI3NTBkMWQ1M2QwZTAxXCI+UHl0aG9uIExlc3NvbiAxOiBXZWxjb21lIHRvIFB5dGhvbjwvYT4gXHUyMDE0IHdoeSBQeXRob24gYW5kIGhvdyB0byBzZXQgdXAgeW91ciBlbnZpcm9ubWVudDwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzL2xlc3Nvbi83MmM5ZmQ2OGVkMjc1MGQxZDUzZDBlMDNcIj5QeXRob24gTGVzc29uIDM6IENvbnRyb2wgRmxvdzwvYT4gXHUyMDE0IGNvbmRpdGlvbmFscyBhbmQgbG9vcHMgYXJlIHdoZXJlIFB5dGhvbidzIHJlYWRhYmlsaXR5IHNoaW5lczwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzL2xlc3Nvbi83MmM5ZmQ2OGVkMjc1MGQxZDUzZDBlMDVcIj5QeXRob24gTGVzc29uIDU6IEZ1bmN0aW9uczwvYT4gXHUyMDE0IHRoZSBidWlsZGluZyBibG9jayBvZiBldmVyeSBQeXRob24gcHJvZ3JhbTwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+PHN0cm9uZz5GcmVlIENvdXJzZTo8L3N0cm9uZz4gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIFB5dGhvbiBNYXN0ZXJjbGFzczwvYT48L3A+XG5cbiAgICAgIDxoMz40LiBKYXZhOiBUaGUgRW50ZXJwcmlzZSBTdGFuZGFyZDwvaDM+XG4gICAgICA8cD5KYXZhIHBvd2VycyBBbmRyb2lkIGFwcHMsIGVudGVycHJpc2UgYmFua2luZyBzeXN0ZW1zLCBlLWNvbW1lcmNlIGJhY2tlbmRzLCBhbmQgbGFyZ2Utc2NhbGUgZGlzdHJpYnV0ZWQgc3lzdGVtcy4gSXQgaXMgb25lIG9mIHRoZSBtb3N0IGNvbnNpc3RlbnRseSBpbi1kZW1hbmQgbGFuZ3VhZ2VzIGF0IG11bHRpbmF0aW9uYWwgY29tcGFuaWVzIGluIEluZGlhIGFuZCBnbG9iYWxseS4gTGVhcm5pbmcgSmF2YSB0ZWFjaGVzIHlvdSBPYmplY3QtT3JpZW50ZWQgUHJvZ3JhbW1pbmcgaW4gaXRzIG1vc3Qgcmlnb3JvdXMgZm9ybSBcdTIwMTQgbWFraW5nIHlvdSBhIG1vcmUgZGlzY2lwbGluZWQgZGV2ZWxvcGVyIGluIGFueSBsYW5ndWFnZS48L3A+XG4gICAgICA8cD48c3Ryb25nPldoYXQgeW91IHdpbGwgYnVpbGQ6PC9zdHJvbmc+IENvbW1hbmQtbGluZSBhcHBsaWNhdGlvbnMsIE9PUCBkZXNpZ25zLCBBbmRyb2lkIGFwcCBmb3VuZGF0aW9ucywgYmFja2VuZCBBUElzIHdpdGggU3ByaW5nIEJvb3QuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5UaW1lIHRvIGpvYi1yZWFkeSBiYXNpY3M6PC9zdHJvbmc+IDZcdTIwMTM4IHdlZWtzLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+V2hlcmUgdG8gc3RhcnQ6PC9zdHJvbmc+PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmEtbWFzdGVyY2xhc3MvbGVzc29uLzc4YzlmZDY4ZWQyNzUwZDFkNTNkMGVhMFwiPkphdmEgTGVzc29uIDE6IFdlbGNvbWUgdG8gSmF2YTwvYT4gXHUyMDE0IEpWTSwgY29tcGlsYXRpb24sIGFuZCB5b3VyIGZpcnN0IEhlbGxvIFdvcmxkPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhLW1hc3RlcmNsYXNzL2xlc3Nvbi83OGM5ZmQ2OGVkMjc1MGQxZDUzZDBlYTJcIj5KYXZhIExlc3NvbiAzOiBWYXJpYWJsZXMgJmFtcDsgRGF0YSBUeXBlczwvYT4gXHUyMDE0IHN0cmljdCB0eXBpbmcgdGhhdCBidWlsZHMgZGlzY2lwbGluZTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YS1tYXN0ZXJjbGFzcy9sZXNzb24vNzhjOWZkNjhlZDI3NTBkMWQ1M2QwZWE0XCI+SmF2YSBMZXNzb24gNTogQ29udHJvbCBGbG93PC9hPiBcdTIwMTQgaWYvZWxzZSwgc3dpdGNoLCBsb29wcyBpbiBKYXZhPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD48c3Ryb25nPkZyZWUgQ291cnNlOjwvc3Ryb25nPiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YS1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEphdmEgTWFzdGVyY2xhc3M8L2E+PC9wPlxuXG4gICAgICA8aDM+NS4gQXJ0aWZpY2lhbCBJbnRlbGxpZ2VuY2UgJmFtcDsgTWFjaGluZSBMZWFybmluZzwvaDM+XG4gICAgICA8cD5BSSBoYXMgY3Jvc3NlZCB0aGUgdGhyZXNob2xkIGZyb20gc3BlY2lhbGlzZWQgbmljaGUgdG8gbWFpbnN0cmVhbSByZXF1aXJlbWVudC4gU3R1ZGVudHMgd2hvIGdyYWR1YXRlIGluIDIwMjYgYW5kIGJleW9uZCB3aWxsIGJlIGVudGVyaW5nIGEgd29ya2ZvcmNlIHdoZXJlIEFJIGxpdGVyYWN5IGlzIGFzIGV4cGVjdGVkIGFzIEV4Y2VsIHByb2ZpY2llbmN5IHdhcyBhIGRlY2FkZSBhZ28uIFVuZGVyc3RhbmRpbmcgaG93IG1vZGVscyBhcmUgdHJhaW5lZCwgd2hhdCBuZXVyYWwgbmV0d29ya3MgZG8sIGFuZCBob3cgdG8gaW50ZWdyYXRlIEFJIEFQSXMgZ2l2ZXMgeW91IGEgcGVybWFuZW50IGVkZ2UgaW4gYW55IHRlY2ggcm9sZS48L3A+XG4gICAgICA8cD48c3Ryb25nPldoYXQgeW91IHdpbGwgYnVpbGQ6PC9zdHJvbmc+IENsYXNzaWZpY2F0aW9uIG1vZGVscywgaW1hZ2UgcmVjb2duaXNlcnMsIExMTS1wb3dlcmVkIGNoYXRib3RzLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+UHJlcmVxdWlzaXRlOjwvc3Ryb25nPiBQeXRob24gYmFzaWNzICgzXHUyMDEzNCB3ZWVrcyBpbikuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5XaGVyZSB0byBzdGFydDo8L3N0cm9uZz48L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVycy9sZXNzb24vNjliOGY4MDk0ZDQ5ZmRmMjE2NjY2MjAxXCI+QUkgTGVzc29uIDE6IFdoYXQgaXMgQXJ0aWZpY2lhbCBJbnRlbGxpZ2VuY2U/PC9hPiBcdTIwMTQgY2xlYXIgdGF4b25vbXkgb2YgQUksIE1MLCBhbmQgRGVlcCBMZWFybmluZzwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVycy9sZXNzb24vNjliOGY4MDk0ZDQ5ZmRmMjE2NjY2MjA0XCI+QUkgTGVzc29uIDQ6IFdoYXQgaXMgTWFjaGluZSBMZWFybmluZz88L2E+IFx1MjAxNCBob3cgbW9kZWxzIGxlYXJuIGZyb20gZGF0YTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVycy9sZXNzb24vNjliOGY4MDk0ZDQ5ZmRmMjE2NjY2MjA1XCI+QUkgTGVzc29uIDU6IE5ldXJhbCBOZXR3b3JrcyAmYW1wOyBEZWVwIExlYXJuaW5nPC9hPiBcdTIwMTQgdGhlIGFyY2hpdGVjdHVyZSBiZWhpbmQgQ2hhdEdQVDwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+PHN0cm9uZz5GcmVlIENvdXJzZTo8L3N0cm9uZz4gPGEgaHJlZj1cIi9jb3Vyc2VzL2Jhc2ljcy1vZi1hcnRpZmljaWFsLWludGVsbGlnZW5jZS1iZWdpbm5lcnNcIj5BSSAmYW1wOyBNYWNoaW5lIExlYXJuaW5nIEZ1bmRhbWVudGFsczwvYT48L3A+XG5cbiAgICAgIDxoMj5UaGUgUmVjb21tZW5kZWQgTGVhcm5pbmcgT3JkZXI8L2gyPlxuICAgICAgPHA+SWYgeW91IGFyZSBzdGFydGluZyBmcm9tIHplcm8sIGZvbGxvdyB0aGlzIHNlcXVlbmNlLiBFYWNoIHNraWxsIGJ1aWxkcyBhIGZvdW5kYXRpb24gZm9yIHRoZSBuZXh0OjwvcD5cbiAgICAgIDxvbD5cbiAgICAgICAgPGxpPjxzdHJvbmc+SFRNTDwvc3Ryb25nPiBcdTIwMTQgc3RydWN0dXJlIChXZWVrIDFcdTIwMTMyKTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkNTUzwvc3Ryb25nPiBcdTIwMTQgc3R5bGUgKFdlZWsgMlx1MjAxMzQpPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+SmF2YVNjcmlwdDwvc3Ryb25nPiBcdTIwMTQgaW50ZXJhY3Rpdml0eSAoV2VlayA0XHUyMDEzMTApPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UHl0aG9uPC9zdHJvbmc+IFx1MjAxNCB2ZXJzYXRpbGl0eSAoV2VlayAxMFx1MjAxMzE2LCBjYW4gb3ZlcmxhcCB3aXRoIEpTKTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkFJL01MPC9zdHJvbmc+IFx1MjAxNCBpbnRlbGxpZ2VuY2UgKGFmdGVyIFB5dGhvbiBiYXNpY3MpPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+SmF2YTwvc3Ryb25nPiBcdTIwMTQgZW50ZXJwcmlzZSBkZXB0aCAoY2FuIHN0YXJ0IHBhcmFsbGVsIHRvIFB5dGhvbik8L2xpPlxuICAgICAgPC9vbD5cbiAgICAgIDxwPllvdSBkbyBub3QgbmVlZCB0byBmaW5pc2ggb25lIGJlZm9yZSBzdGFydGluZyB0aGUgbmV4dC4gT25jZSB5b3UgYXJlIGNvbWZvcnRhYmxlIHdpdGggSFRNTC9DU1MgYmFzaWNzLCB5b3UgY2FuIGJlZ2luIEphdmFTY3JpcHQuIE9uY2UgUHl0aG9uIGxvb3BzIGZlZWwgbmF0dXJhbCwgeW91IGNhbiBzdGFydCB0aGUgQUkgY291cnNlLiBQcm9ncmVzcyBpcyBjdW11bGF0aXZlLCBub3Qgc2VxdWVudGlhbC48L3A+XG5cbiAgICAgIDxoMj5SZWxhdGVkIEd1aWRlczwvaDI+XG4gICAgICA8cD5Mb29raW5nIGZvciBhIG1vcmUgc3RydWN0dXJlZCBjYXJlZXIgcGxhbj8gUmVhZCBvdXIgY29tcGxldGUgPGEgaHJlZj1cIi9ibG9nL2hvdy10by1iZWNvbWUtd2ViLWRldmVsb3Blci0yMDI2LXJvYWRtYXBcIj5XZWIgRGV2ZWxvcGVyIFJvYWRtYXAgZm9yIDIwMjY8L2E+LiBUbyB1bmRlcnN0YW5kIHdoeSBjZXJ0aWZpY2F0aW9ucyBtYXR0ZXIgYWxvbmdzaWRlIHNraWxscywgcmVhZCA8YSBocmVmPVwiL2Jsb2cvaG93LXNraWxsdmFsaXgtaGVscHMtc3R1ZGVudHMtYmVjb21lLWpvYi1yZWFkeVwiPkhvdyBTa2lsbFZhbGl4IEhlbHBzIFN0dWRlbnRzIEJlY29tZSBKb2IgUmVhZHk8L2E+LjwvcD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zPC9oMj5cblxuICAgICAgPHA+PHN0cm9uZz5RMTogU2hvdWxkIEkgbGVhcm4gYWxsIDUgc2tpbGxzPzwvc3Ryb25nPjxici8+XG4gICAgICBOb3QgbmVjZXNzYXJpbHkgXHUyMDE0IGF0IGxlYXN0IG5vdCBhdCB0aGUgc2FtZSB0aW1lLiBQaWNrIGEgcHJpbWFyeSB0cmFjazogV2ViIERldmVsb3BtZW50IChIVE1MICsgQ1NTICsgSmF2YVNjcmlwdCksIERhdGEgU2NpZW5jZSAoUHl0aG9uICsgQUkpLCBvciBGdWxsLVN0YWNrIChhbGwpLiBTcGVjaWFsaXNlIGZpcnN0LCB0aGVuIGV4cGFuZC4gVHJ5aW5nIHRvIGxlYXJuIGFsbCBmaXZlIHNpbXVsdGFuZW91c2x5IGxlYWRzIHRvIHN1cGVyZmljaWFsIHVuZGVyc3RhbmRpbmcgb2YgYWxsIGFuZCBtYXN0ZXJ5IG9mIG5vbmUuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEyOiBDYW4gSSBnZXQgYSBqb2Iga25vd2luZyBvbmx5IEhUTUwgYW5kIENTUz88L3N0cm9uZz48YnIvPlxuICAgICAgSXQgaXMgZGlmZmljdWx0IHRvIGdldCBhIGZ1bGwtdGltZSBzb2Z0d2FyZSBlbmdpbmVlcmluZyByb2xlIHdpdGggb25seSBIVE1MIGFuZCBDU1MuIEhvd2V2ZXIsIG1hbnkgZnJlZWxhbmNlcnMsIGp1bmlvciB3ZWIgZGVzaWduZXJzLCBhbmQgdGVtcGxhdGUgZGV2ZWxvcGVycyBlYXJuIHdlbGwgd2l0aCB0aGVzZSB0d28gc2tpbGxzLiBGb3Igc29mdHdhcmUgZW5naW5lZXJpbmcgcm9sZXMsIGFkZCBKYXZhU2NyaXB0IGFuZCBhdCBsZWFzdCBvbmUgYmFja2VuZCBza2lsbCAoUHl0aG9uIHdpdGggRmxhc2ssIG9yIE5vZGUuanMpLiBPdXIgPGEgaHJlZj1cIi9ibG9nL2ZyZWVsYW5jaW5nLWFzLWRldmVsb3Blci1iZWdpbm5lcnMtZ3VpZGVcIj5mcmVlbGFuY2luZyBndWlkZTwvYT4gZXhwbGFpbnMgaG93IHRvIG1vbmV0aXNlIGJhc2ljIEhUTUwvQ1NTIHNraWxscyB3aGlsZSBsZWFybmluZyBtb3JlLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMzogV2hpY2ggaXMgYmV0dGVyIHRvIGxlYXJuIGZpcnN0IFx1MjAxNCBQeXRob24gb3IgSmF2YVNjcmlwdD88L3N0cm9uZz48YnIvPlxuICAgICAgRm9yIHdlYiBkZXZlbG9wbWVudDogSmF2YVNjcmlwdCBmaXJzdC4gRm9yIGRhdGEgc2NpZW5jZSwgQUksIG9yIHNjcmlwdGluZzogUHl0aG9uIGZpcnN0LiBJZiB5b3UgYXJlIGNvbXBsZXRlbHkgdW5kZWNpZGVkLCBKYXZhU2NyaXB0IGlzIG1hcmdpbmFsbHkgbW9yZSB2ZXJzYXRpbGUgZm9yIGdldHRpbmcgaGlyZWQgcXVpY2tseSBcdTIwMTQgYm90aCBmcm9udGVuZCBhbmQgYmFja2VuZCBOb2RlLmpzIHJvbGVzIGFyZSBhdmFpbGFibGUgdG8gc3Ryb25nIEphdmFTY3JpcHQgZGV2ZWxvcGVycy4gQnV0IFB5dGhvbiBoYXMgYSBsb3dlciBsZWFybmluZyBjdXJ2ZSBhbmQgaXMgYWxtb3N0IHVuaXZlcnNhbGx5IHJlcXVpcmVkIGZvciBBSS9NTCByb2xlcy48L3A+XG5cbiAgICAgIDxoMj5TdGFydCBGcmVlLiBTdGFydCBUb2RheS48L2gyPlxuICAgICAgPHA+QXQgPGEgaHJlZj1cIi9cIj5Ta2lsbFZhbGl4PC9hPiwgZXZlcnkgY291cnNlIGluIHRoaXMgbGlzdCBpcyAxMDAlIGZyZWUuIE5vIHN1YnNjcmlwdGlvbiwgbm8gdHJpYWwsIG5vIGNyZWRpdCBjYXJkLiBBbGwgY291cnNlcyBlbmQgd2l0aCBhIHZlcmlmaWVkIGNlcnRpZmljYXRlIHRpZWQgdG8gYSB1bmlxdWUgSUQgXHUyMDE0IHNvbWV0aGluZyB5b3UgY2FuIGxpbmsgZGlyZWN0bHkgb24gTGlua2VkSW4gYW5kIHlvdXIgcmVzdW1lLiBUaGUgb25seSBpbnZlc3RtZW50IHJlcXVpcmVkIGlzIHlvdXIgdGltZSBhbmQgY29uc2lzdGVuY3kuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnTmVoYSBTaGFybWEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTAzLTI3VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTA1VDE4OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnTWFyY2ggMjcsIDIwMjYnLFxuICAgIHJlYWRUaW1lOiAnMTIgbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogMTM4MCxcbiAgICBjYXRlZ29yeTogJ0NhcmVlciAmIEluZHVzdHJ5JyxcbiAgICB0YWdzOiBbJ1N0dWRlbnQgUmVzb3VyY2VzJywgJ0NhcmVlciBBZHZpY2UnLCAnRnJlZSBDb3Vyc2VzJywgJ0xlYXJuIHRvIENvZGUnLCAnUHJvZ3JhbW1pbmcnLCAnVGVjaG5vbG9neSAyMDI2JywgJ0hUTUwgQ1NTIEphdmFTY3JpcHQnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTIyMjAyMTc2OTg4LTY2MjczYzJmZDU1Zj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdTdHVkZW50cyBzdHVkeWluZyB0b2dldGhlciB3aXRoIGxhcHRvcHMnLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvdG9wLXNraWxscy1zdHVkZW50cy1sZWFybi1vbmxpbmUtZnJlZScsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdUaGUgVWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzcyBmb3IgQmVnaW5uZXJzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3RhcnQgeW91ciBqb3VybmV5IHRvZGF5IGZyb20gYWJzb2x1dGUgc2NyYXRjaC4nXG4gICAgfVxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMCBORVcgUE9TVFMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIHtcbiAgICBpZDogJ2hvdy10by1idWlsZC1wb3dlcmZ1bC1wdWJsaWMtcG9ydGZvbGlvLTIwMjYnLFxuICAgIHRpdGxlOiAnSG93IHRvIEJ1aWxkIGEgUG93ZXJmdWwgUHVibGljIFBvcnRmb2xpbyB0byBHZXQgSGlyZWQgaW4gMjAyNicsXG4gICAgbWV0YVRpdGxlOiAnSG93IHRvIEJ1aWxkIGEgUG93ZXJmdWwgUHVibGljIFBvcnRmb2xpbyB0byBHZXQgSGlyZWQgKDIwMjYpIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnTGVhcm4gaG93IHRvIGNyZWF0ZSBhIGpvYi13aW5uaW5nIHB1YmxpYyBkZXZlbG9wZXIgcG9ydGZvbGlvIGluIDIwMjYuIFNob3djYXNlIHlvdXIgY2VydGlmaWNhdGVzLCBwcm9qZWN0cywgYW5kIHNraWxscyBhbGwgaW4gb25lIHByb2Zlc3Npb25hbCBVUkwuIFN0ZXAtYnktc3RlcCBndWlkZSBpbmNsdWRlZC4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnZGV2ZWxvcGVyIHBvcnRmb2xpbyB0ZW1wbGF0ZSAyMDI2JyxcbiAgICAgICdwdWJsaWMgcG9ydGZvbGlvIGZvciByZWNydWl0ZXJzJyxcbiAgICAgICdzaG93Y2FzZSBjZXJ0aWZpY2F0aW9ucyBvbiBwb3J0Zm9saW8nLFxuICAgICAgJ2J1aWxkIGRldmVsb3BlciBwcm9maWxlIGZyZWUnLFxuICAgICAgJ3dlYiBkZXZlbG9wZXIgcG9ydGZvbGlvIEluZGlhJyxcbiAgICAgICdTa2lsbFZhbGl4IHB1YmxpYyBwb3J0Zm9saW8nLFxuICAgICAgJ2dldCBoaXJlZCBhcyBhIGRldmVsb3BlciAyMDI2JyxcbiAgICAgICdwb3J0Zm9saW8gU0VPIGZvciBkZXZlbG9wZXJzJ1xuICAgIF0sXG4gICAgZXhjZXJwdDogJ1lvdXIgR2l0SHViIGFsb25lIGlzIG5vIGxvbmdlciBlbm91Z2guIEluIDIwMjYsIHJlY3J1aXRlcnMgd2FudCBhIHVuaWZpZWQgcHJvZmVzc2lvbmFsIHByZXNlbmNlIHRoYXQgc2hvd3Mgbm90IGp1c3QgeW91ciBjb2RlLCBidXQgeW91ciB2ZXJpZmlhYmxlIHNraWxscyBhbmQgY2VydGlmaWNhdGlvbnMuIEhlcmUgaXMgaG93IHRvIGJ1aWxkIG9uZSBpbiA1IG1pbnV0ZXMuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIE5ldyBTdGFuZGFyZDogVGhlIFVuaWZpZWQgUHJvZmVzc2lvbmFsIFByb2ZpbGU8L2gyPlxuICAgICAgPHA+R29uZSBhcmUgdGhlIGRheXMgd2hlbiB5b3UgY291bGQganVzdCBzZW5kIGEgUERGIHJlc3VtZSBhbmQgYSBHaXRIdWIgbGluay4gSW4gYSBjb21wZXRpdGl2ZSAyMDI2IGpvYiBtYXJrZXQsIGhpcmluZyBtYW5hZ2VycyBhcmUgbG9va2luZyBmb3IgPHN0cm9uZz5zb2NpYWwgcHJvb2Y8L3N0cm9uZz4uIFRoZXkgd2FudCB0byBzZWUgdGhhdCB5b3VyIHNraWxscyBhcmUgdmVyaWZpZWQsIHlvdXIgY2VydGlmaWNhdGVzIGFyZSByZWFsLCBhbmQgeW91ciBwcm9qZWN0cyBhcmUgYWNjZXNzaWJsZVx1MjAxNGFsbCBpbiBvbmUgcGxhY2UuPC9wPlxuXG4gICAgICA8aDM+MS4gV2h5IFlvdSBOZWVkIGEgUHVibGljIFBvcnRmb2xpbyBVUkw8L2gzPlxuICAgICAgPHA+QSBwZXJzb25hbCBwb3J0Zm9saW8gVVJMIGxpa2UgPGNvZGU+c2tpbGx2YWxpeC5jb20vdS95b3VybmFtZTwvY29kZT4gYWN0cyBhcyB5b3VyIGRpZ2l0YWwgaWRlbnRpdHkuIEl0IGlzIFNFTy1mcmllbmRseSwgbWVhbmluZyB3aGVuIGEgcmVjcnVpdGVyIHNlYXJjaGVzIHlvdXIgbmFtZSBvbiBHb29nbGUsIHlvdXIgcHJvZmVzc2lvbmFsIGFjaGlldmVtZW50cyBhcHBlYXIgZmlyc3QuIEl0IGFnZ3JlZ2F0ZXMgeW91ciBHaXRIdWIsIExpbmtlZEluLCBSZXN1bWUsIGFuZCBhbGwgeW91ciBTa2lsbFZhbGl4IGNlcnRpZmljYXRpb25zIGludG8gYSBzaW5nbGUsIGhpZ2gtY29udmVyc2lvbiBwYWdlLjwvcD5cblxuICAgICAgPGgzPjIuIEVzc2VudGlhbCBFbGVtZW50cyBvZiBhIDIwMjYgUG9ydGZvbGlvPC9oMz5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+VmVyaWZpYWJsZSBDcmVkZW50aWFsczo8L3N0cm9uZz4gRG9uJ3QganVzdCBsaXN0IHNraWxsczsgc2hvdyB0aGUgY2VydGlmaWNhdGVzIHRoYXQgcHJvdmUgdGhlbS4gRXZlcnkgY291cnNlIHlvdSBjb21wbGV0ZSBvbiBTa2lsbFZhbGl4IGF1dG9tYXRpY2FsbHkgc3luY3MgdG8geW91ciBwdWJsaWMgcHJvZmlsZS48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5PcGVuIHRvIFdvcmsgU3RhdHVzOjwvc3Ryb25nPiBDbGVhcmx5IHNpZ25hbCB0byByZWNydWl0ZXJzIHRoYXQgeW91IGFyZSBhdmFpbGFibGUgZm9yIG5ldyBvcHBvcnR1bml0aWVzIHdpdGggYSBzaW5nbGUgdG9nZ2xlLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlByb2plY3QgU2hvd2Nhc2VzOjwvc3Ryb25nPiBMaW5rIHlvdXIgdG9wIEdpdEh1YiByZXBvc2l0b3JpZXMgd2l0aCBkZXNjcmlwdGlvbnMgdGhhdCBleHBsYWluIHRoZSA8ZW0+cHJvYmxlbSB5b3Ugc29sdmVkPC9lbT4sIG5vdCBqdXN0IHRoZSB0ZWNoIHlvdSB1c2VkLjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDM+My4gSG93IHRvIEFjdGl2YXRlIFlvdXIgUG9ydGZvbGlvIG9uIFNraWxsVmFsaXg8L2gzPlxuICAgICAgPHA+QXQgU2tpbGxWYWxpeCwgd2UndmUgYnVpbHQgdGhlIFB1YmxpYyBQb3J0Zm9saW8gZmVhdHVyZSB0byBiZSBlbnRpcmVseSBhdXRvbWF0aWMuIE9uY2UgeW91IGNvbXBsZXRlIHlvdXIgcHJvZmlsZSBkZXRhaWxzIGFuZCBzZXQgYSBjdXN0b20gdXNlcm5hbWUsIHlvdXIgcG9ydGZvbGlvIGlzIGxpdmUgZm9yIHRoZSB3b3JsZCB0byBzZWUuPC9wPlxuICAgICAgXG4gICAgICA8ZGl2IGNsYXNzPVwiYmctYmx1ZS01MCBwLTYgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1ibHVlLTEwMCBteS04XCI+XG4gICAgICAgIDxoNCBjbGFzcz1cInRleHQtYmx1ZS05MDAgZm9udC1ib2xkIG1iLTJcIj5cdUQ4M0RcdURFODAgUmVhZHkgdG8gZ2V0IHN0YXJ0ZWQ/PC9oND5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LWJsdWUtNzAwIHRleHQtc20gbWItNFwiPkNsaWNrIHRoZSBidXR0b24gYmVsb3cgdG8gZ28gZGlyZWN0bHkgdG8geW91ciBQb3J0Zm9saW8gc2V0dGluZ3MuIEZpbGwgaW4geW91ciBiaW8sIGFkZCB5b3VyIHNvY2lhbCBsaW5rcywgYW5kIG1ha2UgeW91ciBwcm9maWxlIHB1YmxpYyB0b2RheSE8L3A+XG4gICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkP3RhYj1wcm9maWxlXCIgY2xhc3M9XCJpbmxpbmUtYmxvY2sgYmctYmx1ZS02MDAgdGV4dC13aGl0ZSBmb250LWJvbGQgcHktMyBweC02IHJvdW5kZWQteGwgaG92ZXI6YmctYmx1ZS03MDAgdHJhbnNpdGlvbi1hbGwgc2hhZG93LWxnIHNoYWRvdy1ibHVlLTIwMFwiPlNldCBVcCBNeSBQb3J0Zm9saW8gTm93PC9hPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxoMz40LiBTRU8gVGlwcyBmb3IgWW91ciBEZXZlbG9wZXIgUHJvZmlsZTwvaDM+XG4gICAgICA8cD5UbyByYW5rIGhpZ2hlciBpbiBHb29nbGUsIGVuc3VyZSB5b3VyIDxzdHJvbmc+QmlvPC9zdHJvbmc+IGNvbnRhaW5zIHJlbGV2YW50IGtleXdvcmRzIGxpa2UgXCJGcm9udGVuZCBEZXZlbG9wZXJcIiwgXCJSZWFjdCBTcGVjaWFsaXN0XCIsIG9yIFwiRGF0YSBBbmFseXN0XCIuIE1lbnRpb24gdGhlIHNwZWNpZmljIHRlY2hub2xvZ2llcyB5b3UgYXJlIHBhc3Npb25hdGUgYWJvdXQuIFNlYXJjaCBlbmdpbmVzIGxvdmUgcmljaCwga2V5d29yZC1yZWxldmFudCB0ZXh0IGNvbnRlbnQuPC9wPlxuXG4gICAgICA8cD5TdG9wIHNlbmRpbmcgc2NhdHRlcmVkIGxpbmtzLiBTdGFydCBzZW5kaW5nIGEgcHJvZmVzc2lvbmFsIGxlZ2FjeS4gQnVpbGQgeW91ciBwb3J0Zm9saW8gZm9yIGZyZWUgYXQgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U2tpbGxWYWxpeDwvYT4uPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnQXJqdW4gTWVodGEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTA1VDEwOjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTA1VDEwOjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgMDUsIDIwMjYnLFxuICAgIHJlYWRUaW1lOiAnNSBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiA0ODAsXG4gICAgY2F0ZWdvcnk6ICdDYXJlZXIgJiBJbmR1c3RyeScsXG4gICAgdGFnczogWydQb3J0Zm9saW8nLCAnQ2FyZWVyIERldmVsb3BtZW50JywgJ1JlY3J1aXRtZW50JywgJ1BlcnNvbmFsIEJyYW5kaW5nJywgJ1dlYiBEZXZlbG9wbWVudCddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDcwMTQ3NjItM2E5NGZiNGRmNzBhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ1Byb2Zlc3Npb25hbCBkZXZlbG9wZXIgcG9ydGZvbGlvIG9uIGEgaGlnaC1yZXNvbHV0aW9uIG1vbml0b3InLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvaG93LXRvLWJ1aWxkLXBvd2VyZnVsLXB1YmxpYy1wb3J0Zm9saW8tMjAyNicsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdUaGUgVWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzcyBmb3IgQmVnaW5uZXJzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvdW5kYXRpb24gZm9yIGFueSBkZXZlbG9wZXIgcG9ydGZvbGlvXHUyMDE0bWFzdGVyIEhUTUw1IGFuZCBlYXJuIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuXG4gIHtcbiAgICBpZDogJ3doYXQtaXMtc2tpbGx2YWxpeC1jb21wbGV0ZS1ndWlkZScsXG4gICAgdGl0bGU6ICdXaGF0IGlzIFNraWxsVmFsaXg/IFRoZSBDb21wbGV0ZSBHdWlkZSB0byBCdWlsZGluZyBZb3VyIENhcmVlciBpbiAyMDI2JyxcbiAgICBtZXRhVGl0bGU6ICdXaGF0IGlzIFNraWxsVmFsaXg/IFx1MjAxNCBGcmVlIENhcmVlciBCdWlsZGluZyBQbGF0Zm9ybSB8IFNraWxsVmFsaXgnLFxuICAgIG1ldGFEZXNjcmlwdGlvbjogJ0Rpc2NvdmVyIHdoYXQgU2tpbGxWYWxpeCBpcyBhbmQgaG93IGl0IGhlbHBzIHN0dWRlbnRzIGFuZCBwcm9mZXNzaW9uYWxzIGJ1aWxkIHRlY2ggY2FyZWVycy4gTGVhcm4gYWJvdXQgZnJlZSBjb3Vyc2VzLCBqb2Igc2ltdWxhdGlvbnMsIGhhY2thdGhvbnMsIGFuZCBjZXJ0aWZpY2F0aW9ucy4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnc2tpbGx2YWxpeCcsXG4gICAgICAnd2hhdCBpcyBza2lsbHZhbGl4JyxcbiAgICAgICdza2lsbHZhbGl4IGZyZWUgY291cnNlcycsXG4gICAgICAnc2tpbGx2YWxpeCByZXZpZXcnLFxuICAgICAgJ3NraWxsdmFsaXggY2VydGlmaWNhdGUnLFxuICAgICAgJ3NraWxsdmFsaXggaGFja2F0aG9uIEluZGlhJyxcbiAgICAgICdza2lsbHZhbGl4IGpvYiBzaW11bGF0aW9ucycsXG4gICAgICAnYnVpbGQgdGVjaCBjYXJlZXIgZnJlZSdcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdTa2lsbFZhbGl4IGlzIG1vcmUgdGhhbiBqdXN0IGEgbGVhcm5pbmcgcGxhdGZvcm1cdTIwMTRpdCBpcyBhIGNvbXBsZXRlIGNhcmVlciBidWlsZGluZyBlbmdpbmUuIERpc2NvdmVyIGhvdyB5b3UgY2FuIHVzZSBTa2lsbFZhbGl4IHRvIGxlYXJuLCBidWlsZCBwcm9qZWN0cywgYW5kIGdldCBoaXJlZCBieSB3b3JsZC1jbGFzcyBjb21wYW5pZXMuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+V2hhdCBFeGFjdGx5IGlzIFNraWxsVmFsaXg/PC9oMj5cbiAgICAgIDxwPkluIHRvZGF5J3MgZmFzdC1wYWNlZCBkaWdpdGFsIHdvcmxkLCB0aGUgZ2FwIGJldHdlZW4gdHJhZGl0aW9uYWwgZWR1Y2F0aW9uIGFuZCBpbmR1c3RyeSByZXF1aXJlbWVudHMgaXMgd2lkZXIgdGhhbiBldmVyLiBNYW55IHN0dWRlbnRzIGdyYWR1YXRlIHdpdGggZGVncmVlcyBidXQgbGFjayB0aGUgcHJhY3RpY2FsIFwic2hpcHBpbmdcIiBza2lsbHMgdGhhdCB0b3AgdGVjaCBjb21wYW5pZXMgbG9vayBmb3IuIFRoaXMgZGlzY29ubmVjdCBpcyBleGFjdGx5IHdoeSA8c3Ryb25nPlNraWxsVmFsaXg8L3N0cm9uZz4gd2FzIGZvdW5kZWQuPC9wPlxuICAgICAgXG4gICAgICA8cD5XaGV0aGVyIHlvdSBhcmUgYSBjb2xsZWdlIHN0dWRlbnQgaW4gSW5kaWEgbG9va2luZyBmb3IgeW91ciBmaXJzdCBpbnRlcm5zaGlwLCBhIGNhcmVlciBzd2l0Y2hlciB0cnlpbmcgdG8gZW50ZXIgdGhlIHRlY2ggaW5kdXN0cnksIG9yIGEgZGV2ZWxvcGVyIHdhbnRpbmcgdG8gcHJvdmUgeW91ciBza2lsbHMsIDxzdHJvbmc+U2tpbGxWYWxpeDwvc3Ryb25nPiBpcyBidWlsdCBmb3IgeW91LiBVbmxpa2UgdHJhZGl0aW9uYWwgbGVhcm5pbmcgcGxhdGZvcm1zIHRoYXQgc3RvcCBhdCB2aWRlbyB0dXRvcmlhbHMsIFNraWxsVmFsaXggZm9jdXNlcyBvbiB0aGUgZW50aXJlIGxpZmVjeWNsZSBvZiBhIGRldmVsb3Blclx1MjAxOXMgam91cm5leTogPHN0cm9uZz5MZWFybiwgQnVpbGQsIGFuZCBHZXQgSGlyZWQuPC9zdHJvbmc+PC9wPlxuXG4gICAgICA8aDM+QSBQbGF0Zm9ybSBCdWlsdCBmb3IgUHJhY3RpY2FsIFNraWxsczwvaDM+XG4gICAgICA8cD5BdCBpdHMgY29yZSwgPHN0cm9uZz5Ta2lsbFZhbGl4PC9zdHJvbmc+IGlzIGEgYnJpZGdlLiBJdCBjb25uZWN0cyB0aGUgdGhlb3J5IG9mIHByb2dyYW1taW5nIHdpdGggdGhlIHJlYWxpdHkgb2YgcHJvZmVzc2lvbmFsIHNvZnR3YXJlIGVuZ2luZWVyaW5nLiBCeSBwcm92aWRpbmcgaGlnaC1xdWFsaXR5LCBmcmVlIGVkdWNhdGlvbiBwYWlyZWQgd2l0aCBpbmR1c3RyeS1sZXZlbCBhc3Nlc3NtZW50cywgU2tpbGxWYWxpeCBlbnN1cmVzIHRoYXQgZXZlcnkgaG91ciB5b3Ugc3BlbmQgb24gdGhlIHBsYXRmb3JtIHRyYW5zbGF0ZXMgaW50byBhIG1lYXN1cmFibGUgY2FyZWVyIGFkdmFudGFnZS4gVGhlIHBsYXRmb3JtIHdhcyBidWlsdCBvbiBhIHNpbXBsZSBwaGlsb3NvcGh5OiA8c3Ryb25nPlNraWxscyBzaG91bGQgYmUgdmVyaWZpYWJsZSwgbm90IGp1c3QgY2xhaW1lZC48L3N0cm9uZz48L3A+XG5cbiAgICAgIDxoMj5LZXkgRmVhdHVyZXMgb2YgU2tpbGxWYWxpeDwvaDI+XG4gICAgICA8cD5UbyB1bmRlcnN0YW5kIHdoeSBTa2lsbFZhbGl4IGlzIGRpZmZlcmVudCBmcm9tIG90aGVyIHNpdGVzIGxpa2UgVWRlbXkgb3IgQ291cnNlcmEsIHlvdSBuZWVkIHRvIGxvb2sgYXQgaXRzIGludGVncmF0ZWQgZWNvc3lzdGVtLiBIZXJlIGFyZSB0aGUgZml2ZSBjb3JlIHBpbGxhcnMgdGhhdCBtYWtlIFNraWxsVmFsaXggYSBwb3dlcmhvdXNlIGZvciBjYXJlZXIgZ3Jvd3RoLjwvcD5cblxuICAgICAgPGgzPjEuIEZyZWUsIEhpZ2gtUXVhbGl0eSBUZWNobmljYWwgQ291cnNlczwvaDM+XG4gICAgICA8cD5FZHVjYXRpb24gc2hvdWxkIG5vdCBoYXZlIGEgcHJpY2UgdGFnIHRoYXQgcHJldmVudHMgdGFsZW50ZWQgaW5kaXZpZHVhbHMgZnJvbSBsZWFybmluZy4gRXZlcnkgbWFzdGVyY2xhc3Mgb24gU2tpbGxWYWxpeCBpcyBjb21wbGV0ZWx5IGZyZWUuIEZyb20gdGhlIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzXCI+VWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzczwvYT4gdG8gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLXJlYWN0LW1hc3RlcmNsYXNzXCI+UmVhY3QuanMgTWFzdGVyeTwvYT4gYW5kIDxhIGhyZWY9XCIvY291cnNlcy9iYXNpY3Mtb2YtYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UtYmVnaW5uZXJzXCI+QUkgRnVuZGFtZW50YWxzPC9hPiwgb3VyIGN1cnJpY3VsdW0gaXMgZGVzaWduZWQgYnkgaW5kdXN0cnkgZXhwZXJ0cyB3aG8ga25vdyB3aGF0IGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIGluIHByb2R1Y3Rpb24uPC9wPlxuXG4gICAgICA8aDM+Mi4gUmVhbC1Xb3JsZCBKb2IgU2ltdWxhdGlvbnMgKFZpcnR1YWwgSW50ZXJuc2hpcHMpPC9oMz5cbiAgICAgIDxwPlRoZSBiaWdnZXN0IHN0cnVnZ2xlIGZvciBmcmVzaGVycyBpcyB0aGUgXCJleHBlcmllbmNlIHJlcXVpcmVkXCIgbG9vcDogeW91IG5lZWQgZXhwZXJpZW5jZSB0byBnZXQgYSBqb2IsIGJ1dCB5b3UgbmVlZCBhIGpvYiB0byBnZXQgZXhwZXJpZW5jZS4gU2tpbGxWYWxpeCBicmVha3MgdGhpcyBjeWNsZSB3aXRoIEpvYiBTaW11bGF0aW9ucy4gVGhlc2UgYXJlIGN1cmF0ZWQsIG11bHRpLXRhc2sgc2ltdWxhdGlvbnMgdGhhdCBtaXJyb3IgdGhlIGFjdHVhbCB0aWNrZXRzIGFuZCB0YXNrcyBhIGp1bmlvciBkZXZlbG9wZXIgcmVjZWl2ZXMgaW4gYSBzdGFydHVwLjwvcD5cblxuICAgICAgPGgzPjMuIEluZHVzdHJ5LUxldmVsIEhhY2thdGhvbnM8L2gzPlxuICAgICAgPHA+Q29tcGV0aXRpb24gYnJlZWRzIGV4Y2VsbGVuY2UuIFNraWxsVmFsaXggaG9zdHMgYW5kIHN1cHBvcnRzIHNvbWUgb2YgSW5kaWFcdTIwMTlzIG1vc3QgZXhjaXRpbmcgb25saW5lIGhhY2thdGhvbnMuIFRoZXNlIGFyZW4ndCBqdXN0IGNvZGluZyBjb250ZXN0czsgdGhleSBhcmUgb3Bwb3J0dW5pdGllcyB0byBjb2xsYWJvcmF0ZSB3aXRoIG90aGVycywgbmV0d29yayB3aXRoIG1lbnRvcnMsIGFuZCB3aW4gcHJpemVzIHRoYXQgbG9vayBpbmNyZWRpYmxlIG9uIHlvdXIgcmVzdW1lLjwvcD5cblxuICAgICAgPGgzPjQuIFZlcmlmaWVkIENlcnRpZmljYXRpb25zPC9oMz5cbiAgICAgIDxwPkEgUERGIFwiY2VydGlmaWNhdGUgb2YgY29tcGxldGlvblwiIGlzIGVhc3kgdG8gZm9yZ2UuIFNraWxsVmFsaXggQ2VydGlmaWNhdGlvbnMgYXJlIGRpZmZlcmVudC4gRXZlcnkgY2VydGlmaWNhdGUgaXNzdWVkIGJ5IFNraWxsVmFsaXggaXMgdGllZCB0byBhIHVuaXF1ZSBJRCBhbmQgYSB2ZXJpZmljYXRpb24gbGluayBob3N0ZWQgb24gb3VyIHBsYXRmb3JtLiBXaGVuIGEgcmVjcnVpdGVyIGNsaWNrcyB0aGF0IGxpbmssIHRoZXkgc2VlIHlvdXIgZXhhbSBzY29yZSBhbmQgdGhlIHNwZWNpZmljIHNraWxscyB5b3UgbWFzdGVyZWQuPC9wPlxuXG4gICAgICA8aDM+NS4gVGhlIFB1YmxpYyBMaW5rZWRJbi1TdHlsZSBQb3J0Zm9saW88L2gzPlxuICAgICAgPHA+WW91ciBTa2lsbFZhbGl4IHByb2ZpbGUgYXV0b21hdGljYWxseSBhZ2dyZWdhdGVzIHlvdXIgY291cnNlIHByb2dyZXNzLCB5b3VyIGhhY2thdGhvbiB3aW5zLCBhbmQgeW91ciBqb2Igc2ltdWxhdGlvbiByZXN1bHRzIGludG8gYSBzbGVlaywgcHVibGljLWZhY2luZyBwb3J0Zm9saW8uIEluc3RlYWQgb2Ygc2VuZGluZyAxMCBkaWZmZXJlbnQgbGlua3MgdG8gcmVjcnVpdGVycywgeW91IHNlbmQgb25lOiB5b3VyIFNraWxsVmFsaXggcHJvZmlsZS48L3A+XG5cbiAgICAgIDxoMj5XaHkgQ2hvb3NlIFNraWxsVmFsaXggb3ZlciBPdGhlciBQbGF0Zm9ybXM/PC9oMj5cbiAgICAgIDxwPldpdGggc28gbWFueSByZXNvdXJjZXMgb25saW5lLCB3aHkgc2hvdWxkIHlvdSBzcGVuZCB5b3VyIHRpbWUgb24gU2tpbGxWYWxpeD8gSGVyZSBpcyBvdXIgdW5pcXVlIHZhbHVlIHByb3Bvc2l0aW9uOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+Rm9jdXMgb24gUG9ydGZvbGlvIEJ1aWxkaW5nOjwvc3Ryb25nPiBXZSB0cmFjayB5b3VyIFwiQnVpbGRpbmcgQWJpbGl0eSxcIiB3aGljaCBpcyBhIGZhciBiZXR0ZXIgcHJlZGljdG9yIG9mIGpvYiBzdWNjZXNzIHRoYW4ganVzdCBcIkxlYXJuaW5nIFRpbWUuXCI8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5ObyBHYXRla2VlcGluZyAoRnJlZSBBY2Nlc3MpOjwvc3Ryb25nPiBXZSBiZWxpZXZlIHRoYXQgdGFsZW50IGlzIHVuaXZlcnNhbCwgYnV0IG9wcG9ydHVuaXR5IGlzIG5vdC4gV2Uga2VlcCBvdXIgY29yZSBjb3Vyc2VzIGZyZWUgZm9yIGV2ZXJ5b25lLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlZlcmlmaWVkIENyZWRpYmlsaXR5Ojwvc3Ryb25nPiBCZWNhdXNlIG91ciBleGFtcyBhbmQgc2ltdWxhdGlvbnMgYXJlIHJpZ29yb3VzLCBhIFNraWxsVmFsaXggY3JlZGVudGlhbCBtZWFucyBzb21ldGhpbmcgaW4gdGhlIHJlYWwgd29ybGQuPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9ucyAoRkFRKTwvaDI+XG4gICAgICA8cD48c3Ryb25nPlExOiBJcyBTa2lsbFZhbGl4IHJlYWxseSBmcmVlPzwvc3Ryb25nPjxici8+XG4gICAgICBZZXMhIEFsbCBjb3JlIHRlY2huaWNhbCBtYXN0ZXJjbGFzc2VzLCBwcm9qZWN0IGd1aWRlcywgYW5kIGNvbW11bml0eSBoYWNrYXRob25zIG9uIFNraWxsVmFsaXggYXJlIDEwMCUgZnJlZS4gT3VyIG1pc3Npb24gaXMgdG8gbWFrZSBoaWdoLXF1YWxpdHkgdGVjaCBlZHVjYXRpb24gYWNjZXNzaWJsZSB0byBldmVyeSBzdHVkZW50LjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogQ2FuIEkgZ2V0IGEgam9iIHRocm91Z2ggU2tpbGxWYWxpeD88L3N0cm9uZz48YnIvPlxuICAgICAgV2hpbGUgU2tpbGxWYWxpeCBpcyBhIHNraWxsLWJ1aWxkaW5nIHBsYXRmb3JtLCBtYW55IHN0dWRlbnRzIHVzZSB0aGVpciBTa2lsbFZhbGl4IHBvcnRmb2xpb3MgYW5kIHZlcmlmaWVkIGNlcnRpZmljYXRlcyB0byBzdGFuZCBvdXQgaW4gaW50ZXJ2aWV3cy4gV2UgYWxzbyBob3N0IGhpcmluZyBoYWNrYXRob25zIHdoZXJlIHN0YXJ0dXBzIGRpcmVjdGx5IHJlY3J1aXQgd2lubmVycy48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IEhvdyBkbyB0aGUgU2tpbGxWYWxpeCBKb2IgU2ltdWxhdGlvbnMgd29yaz88L3N0cm9uZz48YnIvPlxuICAgICAgVGhleSBwcm92aWRlIHlvdSB3aXRoIGEgc2VyaWVzIG9mIHRhc2tzIHRoYXQgYSBkZXZlbG9wZXIgd291bGQgZG8gaW4gYSByZWFsIGNvbXBhbnkuIFlvdSByZWNlaXZlIGEgYnJpZWYsIHdyaXRlIHRoZSBjb2RlLCBhbmQgc3VibWl0IHlvdXIgd29yay4gSXRcdTIwMTlzIGRlc2lnbmVkIHRvIGdpdmUgeW91IHZpcnR1YWwgZXhwZXJpZW5jZSBmb3IgeW91ciByZXN1bWUuPC9wPlxuXG4gICAgICA8cD5Zb3VyIHRlY2ggY2FyZWVyIGluIDIwMjYgd2FpdHMgZm9yIG5vIG9uZS4gU3RvcCBqdXN0IFwibGVhcm5pbmdcIiBhbmQgc3RhcnQgPHN0cm9uZz52YWxpZGF0aW5nPC9zdHJvbmc+LiBCdWlsZCB5b3VyIHBvcnRmb2xpbywgZWFybiB5b3VyIGNyZWRlbnRpYWxzLCBhbmQgc2hvdyB0aGUgd29ybGQgd2hhdCB5b3UgYXJlIGNhcGFibGUgb2YgYXQgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U2tpbGxWYWxpeC5jb208L2E+LjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ0FyanVuIE1laHRhJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wNC0wNVQxMTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wNVQxMTowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ0FwcmlsIDA1LCAyMDI2JyxcbiAgICByZWFkVGltZTogJzcgbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogODgwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnU2tpbGxWYWxpeCcsICdDYXJlZXIgRGV2ZWxvcG1lbnQnLCAnRnJlZSBDb3Vyc2VzJywgJ0VkdWNhdGlvbicsICdQZXJzb25hbCBCcmFuZGluZyddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTcyNDUzODY4MDctYmI0M2Y4MmMzM2M0P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ1lvdW5nIHByb2Zlc3Npb25hbHMgY29sbGFib3JhdGluZyBpbiBhIG1vZGVybiB0ZWNoIGVudmlyb25tZW50JyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL3doYXQtaXMtc2tpbGx2YWxpeC1jb21wbGV0ZS1ndWlkZScsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdVbHRpbWF0ZSBIVE1MIE1hc3RlcmNsYXNzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGJlc3Qgd2F5IHRvIHN0YXJ0IHlvdXIgam91cm5leSBvbiBTa2lsbFZhbGl4XHUyMDE0bWFzdGVyIHRoZSBjb3JlIG9mIHRoZSB3ZWIgZm9yIGZyZWUuJ1xuICAgIH1cbiAgfSxcblxuICB7XG4gICAgaWQ6ICdob3ctc2tpbGx2YWxpeC1oZWxwcy1zdHVkZW50cy1iZWNvbWUtam9iLXJlYWR5JyxcbiAgICB0aXRsZTogJ0hvdyBTa2lsbFZhbGl4IEhlbHBzIFN0dWRlbnRzIEJlY29tZSBKb2IgUmVhZHk6IDcgS2V5IFNraWxsVmFsaXggQmVuZWZpdHMnLFxuICAgIG1ldGFUaXRsZTogJ0hvdyBTa2lsbFZhbGl4IEhlbHBzIFN0dWRlbnRzIEJlY29tZSBKb2IgUmVhZHkgfCBTa2lsbFZhbGl4IEJlbmVmaXRzJyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdEaXNjb3ZlciB0aGUgdG9wIFNraWxsVmFsaXggYmVuZWZpdHMgZm9yIHN0dWRlbnRzIGFuZCBmcmVzaGVycy4gTGVhcm4gaG93IG91ciBmcmVlIGNvdXJzZXMsIGpvYiBzaW11bGF0aW9ucywgYW5kIHZlcmlmaWVkIHBvcnRmb2xpb3MgbWFrZSB5b3Ugam9iLXJlYWR5IGluIDIwMjYuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ3NraWxsdmFsaXggYmVuZWZpdHMnLFxuICAgICAgJ2hvdyB0byBiZWNvbWUgam9iIHJlYWR5IGFzIGEgc3R1ZGVudCcsXG4gICAgICAnc2tpbGx2YWxpeCBmb3IgZW5naW5lZXJpbmcgc3R1ZGVudHMgSW5kaWEnLFxuICAgICAgJ3ZpcnR1YWwgaW50ZXJuc2hpcCBmb3IgZnJlc2hlcnMnLFxuICAgICAgJ2J1aWxkIGEgZGV2ZWxvcGVyIHBvcnRmb2xpbyBmcmVlJyxcbiAgICAgICdza2lsbHZhbGl4IGNlcnRpZmllZCBkZXZlbG9wZXInLFxuICAgICAgJ2NhcmVlciBncm93dGggd2l0aCBza2lsbHZhbGl4JyxcbiAgICAgICdmcmVlIHRlY2huaWNhbCBjZXJ0aWZpY2F0aW9ucyBJbmRpYSdcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdJcyB5b3VyIGNvbGxlZ2UgZGVncmVlIGVub3VnaCB0byBsYW5kIGEgdGVjaCBqb2IgaW4gMjAyNj8gUHJvYmFibHkgbm90LiBEaXNjb3ZlciB0aGUgbWFqb3IgU2tpbGxWYWxpeCBiZW5lZml0cyB0aGF0IGhlbHAgeW91IGJyaWRnZSB0aGUgZ2FwIGJldHdlZW4gYmVpbmcgYSBzdHVkZW50IGFuZCBiZWNvbWluZyBhIHByb2Zlc3Npb25hbCBkZXZlbG9wZXIuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIEdhcCBCZXR3ZWVuIENvbGxlZ2UgYW5kIENhcmVlcnM8L2gyPlxuICAgICAgPHA+VGhlIHRlY2ggaW5kdXN0cnkgaW4gMjAyNiBtb3ZlcyBmYXN0ZXIgdGhhbiBhbnkgdW5pdmVyc2l0eSBjdXJyaWN1bHVtIGNhbiBrZWVwIHVwIHdpdGguIEV2ZXJ5IHllYXIsIHRob3VzYW5kcyBvZiBlbmdpbmVlcmluZyBzdHVkZW50cyBncmFkdWF0ZSBpbiBJbmRpYSB3aXRoIGhpZ2ggZ3JhZGVzIGJ1dCBzdHJ1Z2dsZSB0byBsYW5kIHRoZWlyIGZpcnN0IGpvYi4gV2h5PyBCZWNhdXNlIHRoZXkgYXJlIFwiZWR1Y2F0ZWRcIiBpbiB0aGVvcnkgYnV0IG5vdCBcInJlYWR5XCIgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzLjwvcD5cbiAgICAgIFxuICAgICAgPHA+VGhpcyBpcyB3aGVyZSA8c3Ryb25nPlNraWxsVmFsaXg8L3N0cm9uZz4gY29tZXMgaW4uIE91ciBwbGF0Zm9ybSBpcyBzcGVjaWZpY2FsbHkgZGVzaWduZWQgdG8gc29sdmUgdGhlIFwibGFjayBvZiBleHBlcmllbmNlXCIgcHJvYmxlbS4gQnkgZm9jdXNpbmcgb24gcHJhY3RpY2FsIGFwcGxpY2F0aW9uIG92ZXIgcm90ZSBtZW1vcml6YXRpb24sIHdlIG9mZmVyIHNldmVyYWwgPHN0cm9uZz5Ta2lsbFZhbGl4IGJlbmVmaXRzPC9zdHJvbmc+IHRoYXQgdHJhZGl0aW9uYWwgZWR1Y2F0aW9uIHNpbXBseSBjYW5ub3QgcHJvdmlkZS48L3A+XG5cbiAgICAgIDxoMz5XaHkgVHJhZGl0aW9uYWwgRGVncmVlcyBBcmVuJ3QgRW5vdWdoPC9oMz5cbiAgICAgIDxwPkEgZGVncmVlIHByb3ZlcyB5b3UgY2FuIGxlYXJuOyBhIHBvcnRmb2xpbyBwcm92ZXMgeW91IGNhbiBidWlsZC4gTW9zdCByZWNydWl0ZXJzIG5vdyBza2lwIHBhc3QgdGhlIFwiRWR1Y2F0aW9uXCIgc2VjdGlvbiBhbmQgaGVhZCBzdHJhaWdodCBmb3IgdGhlIFwiUHJvamVjdHNcIiBhbmQgXCJDZXJ0aWZpY2F0aW9uc1wiIGxpbmtzLiBJZiB5b3UgZG9uJ3QgaGF2ZSBwcm9vZiBvZiB3b3JrLCB5b3UgYXJlIGludmlzaWJsZSB0byB0b3AtdGllciBzdGFydHVwcyBhbmQgTU5Dcy48L3A+XG5cbiAgICAgIDxoMj43IE1ham9yIFNraWxsVmFsaXggQmVuZWZpdHMgZm9yIFN0dWRlbnRzPC9oMj5cbiAgICAgIDxwPklmIHlvdSBhcmUgbG9va2luZyB0byBhY2NlbGVyYXRlIHlvdXIgY2FyZWVyLCBoZXJlIGlzIGhvdyA8c3Ryb25nPlNraWxsVmFsaXg8L3N0cm9uZz4gdHJhbnNmb3JtcyB5b3VyIHByb2Zlc3Npb25hbCBvdXRsb29rLjwvcD5cblxuICAgICAgPGgzPjEuIEdhaW5pbmcgXCJCdWlsZGluZyBFeHBlcmllbmNlXCIgdGhyb3VnaCBTaW11bGF0aW9uczwvaDM+XG4gICAgICA8cD5PbmUgb2YgdGhlIHRvcCA8c3Ryb25nPlNraWxsVmFsaXggYmVuZWZpdHM8L3N0cm9uZz4gaXMgb3VyIHVuaXF1ZSBKb2IgU2ltdWxhdGlvbnMuIFRoZXNlIGFyZW4ndCBqdXN0IHR1dG9yaWFsczsgdGhleSBhcmUgdmlydHVhbCBpbnRlcm5zaGlwcy4gWW91IHJlY2VpdmUgYSByZWFsaXN0aWMgcHJvamVjdCBicmllZiwgY29tcGxldGUgd2l0aCBidWdzIHRvIGZpeCBhbmQgZmVhdHVyZXMgdG8gc2hpcC4gVGhpcyBnaXZlcyB5b3UgdGhlIGNvbmZpZGVuY2UgdG8gc2F5IFwiSSBoYXZlIGRvbmUgdGhpcyBiZWZvcmVcIiBkdXJpbmcgYW4gaW50ZXJ2aWV3LjwvcD5cblxuICAgICAgPGgzPjIuIE1hc3RlcmluZyBJbmR1c3RyeS1TdGFuZGFyZCBUb29sczwvaDM+XG4gICAgICA8cD5XZSBkb24ndCB0ZWFjaCBvdXRkYXRlZCB0ZWNobm9sb2dpZXMuIFNraWxsVmFsaXggY291cnNlcyBmb2N1cyBvbiB0aGUgc3RhY2tzIGN1cnJlbnRseSB1c2VkIGJ5IHRoZSB3b3JsZCdzIGJlc3QgZW5naW5lZXJpbmcgdGVhbXNcdTIwMTRSZWFjdCwgTm9kZS5qcywgTW9uZ29EQiwgUHl0aG9uLCBhbmQgQUkuIFlvdSBsZWFybiB0aGUgdG9vbHMgdGhhdCBhcmUgYWN0dWFsbHkgaW4gZGVtYW5kIG9uIGpvYiBib2FyZHMgdG9kYXkuPC9wPlxuXG4gICAgICA8aDM+My4gRWFybmluZyBIaWdoLVRydXN0IFZlcmlmaWVkIENlcnRpZmljYXRpb25zPC9oMz5cbiAgICAgIDxwPk1vc3QgZnJlZSBjZXJ0aWZpY2F0ZXMgYXJlIHdvcnRoIG5vdGhpbmcgYmVjYXVzZSB0aGV5IGRvbid0IHJlcXVpcmUgYW4gZXhhbS4gU2tpbGxWYWxpeCBjZXJ0aWZpY2F0aW9ucyByZXF1aXJlIHlvdSB0byBwYXNzIGEgcmlnb3JvdXMgYXNzZXNzbWVudC4gRXZlcnkgY2VydGlmaWNhdGUgY29tZXMgd2l0aCBhIHVuaXF1ZSB2ZXJpZmljYXRpb24gbGluayB0aGF0IHJlY3J1aXRlcnMgY2FuIGNoZWNrIGluc3RhbnRseS4gVGhpcyBhZGRzIG1hc3NpdmUgY3JlZGliaWxpdHkgdG8geW91ciBDVi48L3A+XG5cbiAgICAgIDxoMz40LiBDcmVhdGluZyBhIFB1YmxpYy1GYWNpbmcgUHJvZmVzc2lvbmFsIFBvcnRmb2xpbzwvaDM+XG4gICAgICA8cD5Zb3VyIFNraWxsVmFsaXggcHJvZmlsZSBpcyB5b3VyIHJlc3VtZSwgcG9ydGZvbGlvLCBhbmQgY3JlZGl0IHNjb3JlIGFsbCBpbiBvbmUuIEl0IGF1dG9tYXRpY2FsbHkgZGlzcGxheXMgeW91ciBjb3Vyc2UgcHJvZ3Jlc3MsIHlvdXIgaGFja2F0aG9uIHdpbnMsIGFuZCB5b3VyIHNpbXVsYXRpb24gdGFza3MgaW4gYSBzbGVlaywgcHVibGljLWZhY2luZyBmb3JtYXQgdGhhdCB5b3UgY2FuIHNoYXJlIG9uIExpbmtlZEluLjwvcD5cblxuICAgICAgPGgzPjUuIE5ldHdvcmtpbmcgdmlhIE5hdGlvbndpZGUgSGFja2F0aG9uczwvaDM+XG4gICAgICA8cD5Ta2lsbFZhbGl4IGhvc3RzIGFuZCBtYW5hZ2VzIHNvbWUgb2YgdGhlIG1vc3QgY29tcGV0aXRpdmUgb25saW5lIGhhY2thdGhvbnMgaW4gSW5kaWEuIFBhcnRpY2lwYXRpbmcgaW4gdGhlc2UgZXZlbnRzIGFsbG93cyB5b3UgdG8gbWVldCBvdGhlciBhbWJpdGlvdXMgZGV2ZWxvcGVycywgY29ubmVjdCB3aXRoIG1lbnRvcnMsIGFuZCBnZXQgbm90aWNlZCBieSBjb3Jwb3JhdGUgc3BvbnNvcnMgbG9va2luZyBmb3IgZnJlc2ggdGFsZW50LjwvcD5cblxuICAgICAgPGgzPjYuIExlYXJuaW5nIHRvIERlYnVnIGFuZCBTaGlwIFByb2R1Y3Rpb24gQ29kZTwvaDM+XG4gICAgICA8cD5JbiBjb2xsZWdlLCB5b3Ugd3JpdGUgY29kZSB0aGF0IG9ubHkgeW91IHNlZS4gSW4gPHN0cm9uZz5Ta2lsbFZhbGl4PC9zdHJvbmc+IHNpbXVsYXRpb25zLCB5b3UgbGVhcm4gdG8gd3JpdGUgY2xlYW4sIGRvY3VtZW50ZWQsIGFuZCBwcm9kdWN0aW9uLXJlYWR5IGNvZGUuIFlvdSBsZWFybiBob3cgdG8gdXNlIEdpdEh1YiwgaG93IHRvIHdyaXRlIFJFQURNRSBmaWxlcywgYW5kIGhvdyB0byBkZXBsb3kgeW91ciBhcHBsaWNhdGlvbnMgdG8gdGhlIHdlYi48L3A+XG5cbiAgICAgIDxoMz43LiBOby1Db3N0IEFjY2VzcyB0byBQcmVtaXVtIFRlY2huaWNhbCBLbm93bGVkZ2U8L2gzPlxuICAgICAgPHA+SGlnaC1xdWFsaXR5IHRlY2ggZWR1Y2F0aW9uIHNob3VsZCBub3QgYmUgbG9ja2VkIGJlaGluZCBhIHBheXdhbGwuIE9uZSBvZiB0aGUgbW9zdCBzaWduaWZpY2FudCA8c3Ryb25nPlNraWxsVmFsaXggYmVuZWZpdHM8L3N0cm9uZz4gaXMgdGhhdCBvdXIgY29yZSBtYXN0ZXJjbGFzc2VzIGFyZSAxMDAlIGZyZWUuIFRoaXMgZW5zdXJlcyB0aGF0IGV2ZXJ5IHN0dWRlbnQsIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgZmluYW5jaWFsIGJhY2tncm91bmQsIGhhcyBhIGZhaXIgc2hvdCBhdCBhIHRlY2ggY2FyZWVyLjwvcD5cblxuICAgICAgPGgyPkhvdyB0byBVc2UgU2tpbGxWYWxpeCB0byBHZXQgWW91ciBGaXJzdCBJbnRlcm5zaGlwPC9oMj5cbiAgICAgIDxwPklmIHlvdSB3YW50IHRvIG1heGltaXplIHlvdXIgY2hhbmNlcyBvZiBnZXR0aW5nIGhpcmVkLCBmb2xsb3cgdGhpcyBzaW1wbGUgYmx1ZXByaW50OjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+UGljayBhIFRyYWNrOjwvc3Ryb25nPiBDaG9vc2UgYSBzcGVjaWZpYyBwYXRoIGxpa2UgRnJvbnRlbmQsIEJhY2tlbmQsIG9yIERhdGEgQW5hbHlzdC48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Db21wbGV0ZSB0aGUgTWFzdGVyY2xhc3M6PC9zdHJvbmc+IEdvIHRocm91Z2ggdGhlIGxlc3NvbnMgYW5kIGJ1aWxkIGV2ZXJ5IHByb2plY3QgYWxvbmdzaWRlIHRoZSBpbnN0cnVjdG9yLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlBhc3MgdGhlIEV4YW06PC9zdHJvbmc+IEdldCB5b3VyIHZlcmlmaWVkIGNlcnRpZmljYXRlIGFuZCBhZGQgaXQgdG8geW91ciBMaW5rZWRJbiBwcm9maWxlLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlJ1biBhIFNpbXVsYXRpb246PC9zdHJvbmc+IENvbXBsZXRlIHRoZSBKb2IgU2ltdWxhdGlvbiBmb3IgeW91ciB0cmFjayB0byBnYWluIFwidmlydHVhbCBleHBlcmllbmNlLlwiPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+T3B0aW1pemUgWW91ciBQb3J0Zm9saW86PC9zdHJvbmc+IEFkZCBhIHByb2Zlc3Npb25hbCBiaW8gdG8geW91ciBTa2lsbFZhbGl4IHByb2ZpbGUgYW5kIHNoYXJlIHlvdXIgcHVibGljIGxpbmsgaW4gam9iIGFwcGxpY2F0aW9ucy48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zIChGQVEpPC9oMj5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IFdoYXQgYXJlIHRoZSBtYWluIFNraWxsVmFsaXggYmVuZWZpdHMgZm9yIGZyZXNoZXJzPzwvc3Ryb25nPjxici8+XG4gICAgICBUaGUgbWFpbiBiZW5lZml0cyBpbmNsdWRlIGZyZWUgYWNjZXNzIHRvIGluZHVzdHJ5LWxldmVsIGNvdXJzZXMsIHRoZSBhYmlsaXR5IHRvIGVhcm4gdmVyaWZpZWQgY2VydGlmaWNhdGlvbnMgdGhhdCByZWNydWl0ZXJzIHRydXN0LCBhbmQgYSBwbGF0Zm9ybSB0byBidWlsZCBhIHByb2Zlc3Npb25hbCBwdWJsaWMgcG9ydGZvbGlvIHRoYXQgcHJvdmVzIHlvdXIgc2tpbGxzLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogSG93IGRvIFNraWxsVmFsaXggY2VydGlmaWNhdGlvbnMgaGVscCBpbiBqb2IgaW50ZXJ2aWV3cz88L3N0cm9uZz48YnIvPlxuICAgICAgQmVjYXVzZSBTa2lsbFZhbGl4IGNlcnRpZmljYXRlcyBhcmUgdmVyaWZpYWJsZSBhbmQgdGllZCB0byByZWFsIGFzc2Vzc21lbnRzLCB0aGV5IHByb3ZlIHRvIHRoZSBpbnRlcnZpZXdlciB0aGF0IHlvdSBhY3R1YWxseSBoYXZlIHRoZSBza2lsbHMgbGlzdGVkIG9uIHlvdXIgcmVzdW1lLiBZb3UgY2FuIHNpbXBseSBzaGFyZSB5b3VyIHZlcmlmaWNhdGlvbiBsaW5rLCBhbmQgdGhleSBjYW4gc2VlIHlvdXIgcHJvb2Ygb2Ygd29yay48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IElzIFNraWxsVmFsaXggYXZhaWxhYmxlIGZvciBzdHVkZW50cyBvdXRzaWRlIEluZGlhPzwvc3Ryb25nPjxici8+XG4gICAgICBZZXMhIFdoaWxlIHdlIGhhdmUgYSBzdHJvbmcgZm9jdXMgb24gdGhlIEluZGlhbiBkZXZlbG9wZXIgY29tbXVuaXR5LCA8c3Ryb25nPlNraWxsVmFsaXg8L3N0cm9uZz4gaXMgYXZhaWxhYmxlIHRvIHN0dWRlbnRzIGFuZCBwcm9mZXNzaW9uYWxzIHdvcmxkd2lkZS4gQW55b25lIHdhbnRpbmcgdG8gYnVpbGQgYSBjYXJlZXIgaW4gdGVjaCBjYW4gam9pbiBmb3IgZnJlZS48L3A+XG5cbiAgICAgIDxwPlJlYWR5IHRvIHVubG9jayB0aGVzZSA8c3Ryb25nPlNraWxsVmFsaXggYmVuZWZpdHM8L3N0cm9uZz4/IFlvdXIgcHJvZmVzc2lvbmFsIGxlZ2FjeSBzdGFydHMgaGVyZS4gSm9pbiB0aG91c2FuZHMgb2Ygb3RoZXIgc3R1ZGVudHMgd2hvIGFyZSBidWlsZGluZyB0aGVpciBmdXR1cmUgdG9kYXkgYXQgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U2tpbGxWYWxpeC5jb208L2E+LjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ0FyanVuIE1laHRhJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wNC0wNVQxMTozMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wNVQxMTozMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ0FwcmlsIDA1LCAyMDI2JyxcbiAgICByZWFkVGltZTogJzggbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogOTIwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnU2tpbGxWYWxpeCBCZW5lZml0cycsICdKb2IgUmVhZHknLCAnU3R1ZGVudCBDYXJlZXInLCAnRW5naW5lZXJpbmcgU3R1ZGVudHMgSW5kaWEnLCAnQ2FyZWVyIEFkdmljZSddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjIyMDIxNzY5ODgtNjYyNzNjMmZkNTVmP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ0VuZ2luZWVyaW5nIHN0dWRlbnRzIGluIEluZGlhIGNvbGxhYm9yYXRpbmcgb24gYSB0ZWNoIHByb2plY3QnLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvaG93LXNraWxsdmFsaXgtaGVscHMtc3R1ZGVudHMtYmVjb21lLWpvYi1yZWFkeScsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdVbHRpbWF0ZSBSZWFjdCBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtcmVhY3QtbWFzdGVyY2xhc3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmFzdGVzdCB3YXkgdG8gYmVjb21lIGpvYi1yZWFkeSBcdTIwMTQgbWFzdGVyIG1vZGVybiBSZWFjdCBhbmQgZWFybiBhIHZlcmlmaWVkIGNlcnRpZmljYXRlLidcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2hvdy10by1iZWNvbWUtd2ViLWRldmVsb3Blci0yMDI2LXJvYWRtYXAnLFxuICAgIHRpdGxlOiAnSG93IHRvIEJlY29tZSBhIFdlYiBEZXZlbG9wZXIgaW4gMjAyNjogVGhlIENvbXBsZXRlIEZyZWUgUm9hZG1hcCcsXG4gICAgbWV0YVRpdGxlOiAnSG93IHRvIEJlY29tZSBhIFdlYiBEZXZlbG9wZXIgaW4gMjAyNiBcdTIwMTQgRnJlZSBSb2FkbWFwIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnVGhlIGRlZmluaXRpdmUgc3RlcC1ieS1zdGVwIHJvYWRtYXAgdG8gYmVjb21pbmcgYSB3ZWIgZGV2ZWxvcGVyIGluIDIwMjYgXHUyMDE0IGNvbXBsZXRlbHkgZnJlZS4gTGVhcm4gSFRNTCwgQ1NTLCBKYXZhU2NyaXB0LCBSZWFjdCwgTm9kZS5qcyBhbmQgYmV5b25kIHdpdGggbm8gbW9uZXkgYW5kIG5vIGV4cGVyaWVuY2UgbmVlZGVkLicsXG4gICAga2V5d29yZHM6IFtcbiAgICAgICdob3cgdG8gYmVjb21lIGEgd2ViIGRldmVsb3BlciAyMDI2JyxcbiAgICAgICd3ZWIgZGV2ZWxvcGVyIHJvYWRtYXAgZnJlZScsXG4gICAgICAnbGVhcm4gd2ViIGRldmVsb3BtZW50IGZyb20gc2NyYXRjaCcsXG4gICAgICAnd2ViIGRldmVsb3BtZW50IGJlZ2lubmVyIGd1aWRlJyxcbiAgICAgICdmcm9udGVuZCBkZXZlbG9wZXIgY2FyZWVyIHBhdGgnLFxuICAgICAgJ2ZyZWUgd2ViIGRldmVsb3BtZW50IGNvdXJzZSAyMDI2JyxcbiAgICAgICdiZWNvbWUgYSBkZXZlbG9wZXIgd2l0aG91dCBhIGRlZ3JlZScsXG4gICAgICAnbGVhcm4gdG8gY29kZSBmcmVlIEluZGlhJyxcbiAgICAgICdmdWxsIHN0YWNrIGRldmVsb3BlciByb2FkbWFwIDIwMjYnXG4gICAgXSxcbiAgICBleGNlcnB0OiAnQmVjb21pbmcgYSB3ZWIgZGV2ZWxvcGVyIGluIDIwMjYgaGFzIG5ldmVyIGJlZW4gbW9yZSBhY2hpZXZhYmxlLiBIZXJlIGlzIHRoZSBleGFjdCBmcmVlIHJvYWRtYXAgXHUyMDE0IGZyb20gSFRNTCB0byB5b3VyIGZpcnN0IGpvYiBcdTIwMTQgd2l0aCBubyBkZWdyZWUsIG5vIGJvb3RjYW1wIGZlZXMsIGFuZCBubyBndWVzc3dvcmsuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIE15dGg6IFlvdSBOZWVkIGEgQ1MgRGVncmVlIG9yIGFuIEV4cGVuc2l2ZSBCb290Y2FtcDwvaDI+XG4gICAgICA8cD5UaGUgc2luZ2xlIGJpZ2dlc3QgYmFycmllciBzdG9wcGluZyBwZW9wbGUgZnJvbSBiZWNvbWluZyBkZXZlbG9wZXJzIGlzIHRoZSBiZWxpZWYgdGhhdCB5b3UgbmVlZCBhIENTIGRlZ3JlZSBvciBhIFx1MjBCOTEsNTAsMDAwIGJvb3RjYW1wLiBJbiAyMDI2LCB0aGF0IGJhcnJpZXIgZG9lcyBub3QgZXhpc3QuIEV2ZXJ5IHNraWxsIHlvdSBuZWVkIGlzIGF2YWlsYWJsZSBvbmxpbmUgXHUyMDE0IGZvciBmcmVlIFx1MjAxNCBpbiBhIHN0cnVjdHVyZWQsIHByb2dyZXNzaXZlIGZvcm1hdC4gVGhpcyByb2FkbWFwIHNob3dzIHlvdSBleGFjdGx5IHdoYXQgdG8gbGVhcm4sIGluIHdoYXQgb3JkZXIsIGFuZCB3aGVyZSB0byBzdGFydCBlYWNoIHN0ZXAuPC9wPlxuICAgICAgPHA+V2UgZXN0aW1hdGUgaXQgdGFrZXMgPHN0cm9uZz40XHUyMDEzNiBtb250aHMgb2YgY29uc2lzdGVudCBsZWFybmluZyAoMVx1MjAxMzIgaG91cnMvZGF5KTwvc3Ryb25nPiB0byBnbyBmcm9tIHplcm8gdG8ganVuaW9yIGRldmVsb3BlciByZWFkeS4gTGV0J3MgYnJlYWsgaXQgZG93bi48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDE6IEhUTUwgXHUyMDE0IFRoZSBTdHJ1Y3R1cmUgb2YgdGhlIFdlYiAoV2Vla3MgMVx1MjAxMzIpPC9oMj5cbiAgICAgIDxwPkV2ZXJ5IHdlYnNpdGUgb24gdGhlIGludGVybmV0IHN0YXJ0cyB3aXRoIEhUTUwgKEh5cGVyVGV4dCBNYXJrdXAgTGFuZ3VhZ2UpLiBIVE1MIGRlZmluZXMgdGhlIHN0cnVjdHVyZSBvZiBhIHBhZ2UgXHUyMDE0IHdoYXQgaXMgYSBoZWFkaW5nLCB3aGF0IGlzIGEgcGFyYWdyYXBoLCB3aGF0IGlzIGEgbmF2aWdhdGlvbiBtZW51LiBCZWZvcmUgQ1NTLCBiZWZvcmUgSmF2YVNjcmlwdCwgYmVmb3JlIGFueSBmcmFtZXdvcmsgXHUyMDE0IEhUTUwuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5XaGF0IHRvIGxlYXJuOjwvc3Ryb25nPiBEb2N1bWVudCBzdHJ1Y3R1cmUgKDxjb2RlPiZsdDtodG1sJmd0OzwvY29kZT4sIDxjb2RlPiZsdDtoZWFkJmd0OzwvY29kZT4sIDxjb2RlPiZsdDtib2R5Jmd0OzwvY29kZT4pLCBzZW1hbnRpYyB0YWdzICg8Y29kZT4mbHQ7bWFpbiZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7YXJ0aWNsZSZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7bmF2Jmd0OzwvY29kZT4pLCBoZWFkaW5ncywgcGFyYWdyYXBocywgbGlua3MsIGltYWdlcywgbGlzdHMsIHRhYmxlcywgYW5kIGZvcm1zLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+U3BlY2lmaWMgbGVzc29ucyB0byBzdGFydCB3aXRoOjwvc3Ryb25nPjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzL2xlc3Nvbi82OWI4ZWM1N2RjMTY0OWMwYzQyYzlkOGZcIj5MZXNzb24gMTogV2VsY29tZSB0byBXZWIgRGV2ZWxvcG1lbnQ8L2E+IFx1MjAxNCB1bmRlcnN0YW5kIGhvdyB0aGUgYnJvd3NlciByZW5kZXJzIEhUTUwgYmVmb3JlIHdyaXRpbmcgYSBzaW5nbGUgbGluZTwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtaHRtbC1tYXN0ZXJjbGFzcy9sZXNzb24vNjliOGVjNTdkYzE2NDljMGM0MmM5ZDkwXCI+TGVzc29uIDI6IFlvdXIgVmVyeSBGaXJzdCBIVE1MIEZpbGU8L2E+IFx1MjAxNCBzZXQgdXAgVlMgQ29kZSBhbmQgd3JpdGUgeW91ciBmaXJzdCByZWFsIHBhZ2U8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWh0bWwtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhlYzU3ZGMxNjQ5YzBjNDJjOWQ5MVwiPkxlc3NvbiAzOiBIZWFkaW5ncyBhbmQgUGFyYWdyYXBoczwvYT4gXHUyMDE0IHRoZSBidWlsZGluZyBibG9ja3Mgb2YgYWxsIHRleHQgY29udGVudDwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtaHRtbC1tYXN0ZXJjbGFzcy9sZXNzb24vNjliOGVjNTdkYzE2NDljMGM0MmM5ZDkzXCI+TGVzc29uIDU6IExpbmtzOiBDb25uZWN0aW5nIHRoZSBXZWI8L2E+IFx1MjAxNCBldmVyeSB3ZWJzaXRlIHJlbGllcyBvbiBhbmNob3IgdGFnczwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+PHN0cm9uZz5GcmVlIENvdXJzZTo8L3N0cm9uZz4gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWh0bWwtbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBIVE1MIE1hc3RlcmNsYXNzPC9hPiBcdTIwMTQgZnJlZSwgc3RydWN0dXJlZCwgZW5kcyB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDI6IENTUyBcdTIwMTQgTWFraW5nIEl0IExvb2sgR29vZCAoV2Vla3MgMlx1MjAxMzQpPC9oMj5cbiAgICAgIDxwPkNTUyAoQ2FzY2FkaW5nIFN0eWxlIFNoZWV0cykgaXMgd2hhdCB0cmFuc2Zvcm1zIGEgcGxhaW4gSFRNTCBkb2N1bWVudCBpbnRvIGEgYmVhdXRpZnVsLCByZXNwb25zaXZlIGRlc2lnbi4gQ1NTIGNvbnRyb2xzIGNvbG91cnMsIGZvbnRzLCBzcGFjaW5nLCBsYXlvdXRzLCBhbmQgYW5pbWF0aW9ucy4gVGhlIG1vc3QgaW1wb3J0YW50IGxheW91dCBjb25jZXB0cyB5b3UgbmVlZCB0byBtYXN0ZXIgYXJlIHRoZSBCb3ggTW9kZWwsIEZsZXhib3gsIGFuZCBDU1MgR3JpZC48L3A+XG4gICAgICA8cD48c3Ryb25nPldoYXQgdG8gbGVhcm46PC9zdHJvbmc+IFNlbGVjdG9ycywgc3BlY2lmaWNpdHksIHRoZSBCb3ggTW9kZWwsIEZsZXhib3gsIENTUyBHcmlkLCByZXNwb25zaXZlIGRlc2lnbiB3aXRoIG1lZGlhIHF1ZXJpZXMsIENTUyB2YXJpYWJsZXMsIGFuZCB0cmFuc2l0aW9ucy48L3A+XG4gICAgICA8cD48c3Ryb25nPlNwZWNpZmljIGxlc3NvbnMgdG8gc3RhcnQgd2l0aDo8L3N0cm9uZz48L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvY3NzLWZvci1iZWdpbm5lcnMtbGVhcm4td2ViLXN0eWxpbmctemVyby10by1wcm8vbGVzc29uLzY5YjhmNTY4NDAzNmUzODA5YjUwYzY2MVwiPkNTUyBMZXNzb24gMTogV2VsY29tZSB0byBDU1MhPC9hPiBcdTIwMTQgaG93IENTUyBjb25uZWN0cyB0byBIVE1MIHdpdGggdGhlIHRocmVlIGxpbmtpbmcgbWV0aG9kczwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvY3NzLWZvci1iZWdpbm5lcnMtbGVhcm4td2ViLXN0eWxpbmctemVyby10by1wcm8vbGVzc29uLzY5YjhmNTY4NDAzNmUzODA5YjUwYzY2MlwiPkNTUyBMZXNzb24gMjogU2VsZWN0b3JzIFx1MjAxNCBUYXJnZXRpbmcgRWxlbWVudHMgUHJlY2lzZWx5PC9hPiBcdTIwMTQgY2xhc3MsIElELCBhdHRyaWJ1dGUsIGFuZCBwc2V1ZG8tY2xhc3Mgc2VsZWN0b3JzPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByby9sZXNzb24vNjliOGY1Njg0MDM2ZTM4MDliNTBjNjY0XCI+Q1NTIExlc3NvbiA0OiBUaGUgQ1NTIEJveCBNb2RlbDwvYT4gXHUyMDE0IGV2ZXJ5IGxheW91dCBwcm9ibGVtIHRyYWNlcyBiYWNrIHRvIHRoaXM8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvL2xlc3Nvbi82OWI4ZjU2ODQwMzZlMzgwOWI1MGM2NjVcIj5DU1MgTGVzc29uIDU6IENvbG9ycywgQmFja2dyb3VuZHMgJmFtcDsgR3JhZGllbnRzPC9hPiBcdTIwMTQgbWFrZSB5b3VyIGRlc2lnbnMgdmlzdWFsbHkgY29tcGVsbGluZzwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+T25jZSB5b3UgZmluaXNoIHRoZSBDU1MgY291cnNlLCByZWFkIG91ciA8YSBocmVmPVwiL2Jsb2cvY3NzLWdyaWQtdnMtZmxleGJveC1tb2Rlcm4td2ViXCI+Q1NTIEdyaWQgdnMgRmxleGJveCBkZWVwIGRpdmU8L2E+IGFuZCBvdXIgPGEgaHJlZj1cIi9ibG9nL2Nzcy1hbmltYXRpb25zLW1pY3JvLWludGVyYWN0aW9ucy1ndWlkZVwiPkNTUyBtaWNybyBhbmltYXRpb25zIGd1aWRlPC9hPiBcdTIwMTQgdHdvIHNraWxscyB0aGF0IGltbWVkaWF0ZWx5IHNldCB5b3UgYXBhcnQgZnJvbSBvdGhlciBlbnRyeS1sZXZlbCBkZXZlbG9wZXJzLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+RnJlZSBDb3Vyc2U6PC9zdHJvbmc+IDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByb1wiPkNTUyBmb3IgQmVnaW5uZXJzOiBaZXJvIHRvIFBybzwvYT48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDM6IEphdmFTY3JpcHQgXHUyMDE0IFRoZSBFbmdpbmUgb2YgdGhlIFdlYiAoV2Vla3MgNFx1MjAxMzEwKTwvaDI+XG4gICAgICA8cD5KYXZhU2NyaXB0IGlzIHRoZSBvbmx5IHByb2dyYW1taW5nIGxhbmd1YWdlIHRoYXQgcnVucyBuYXRpdmVseSBpbiBldmVyeSB3ZWIgYnJvd3Nlci4gSXQgaXMgd2hhdCB0dXJucyBhIHN0YXRpYyBwYWdlIGludG8gYW4gaW50ZXJhY3RpdmUgYXBwbGljYXRpb24uIFZhcmlhYmxlcywgZnVuY3Rpb25zLCBsb29wcywgRE9NIG1hbmlwdWxhdGlvbiwgYXJyYXlzLCBvYmplY3RzLCBmZXRjaCBBUElzLCBhc3luYy9hd2FpdCBcdTIwMTQgdGhlc2UgYXJlIHRoZSBjb25jZXB0cyB0aGF0IHNlcGFyYXRlIGEgd2ViIGJlZ2lubmVyIGZyb20gYSB3b3JraW5nIGRldmVsb3Blci48L3A+XG4gICAgICA8cD48c3Ryb25nPldoYXQgdG8gbGVhcm46PC9zdHJvbmc+IFZhcmlhYmxlcyAoPGNvZGU+bGV0PC9jb2RlPi88Y29kZT5jb25zdDwvY29kZT4pLCBkYXRhIHR5cGVzLCBjb25kaXRpb25hbHMsIGxvb3BzLCBmdW5jdGlvbnMsIGFycmF5cywgb2JqZWN0cywgRE9NIG1hbmlwdWxhdGlvbiwgZXZlbnRzLCBmZXRjaCBBUEksIFByb21pc2VzLCBhbmQgYXN5bmMvYXdhaXQuPC9wPlxuICAgICAgPHA+PHN0cm9uZz5TcGVjaWZpYyBsZXNzb25zIHRvIHN0YXJ0IHdpdGg6PC9zdHJvbmc+PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhmODA5NGQ0OWZkZjIxNjY2NmE2OFwiPkpTIExlc3NvbiAxOiBXZWxjb21lIHRvIEphdmFTY3JpcHQhPC9hPiBcdTIwMTQgaG93IEpTIHJ1bnMgaW4gdGhlIGJyb3dzZXIgYW5kIGhvdyB0byB1c2UgdGhlIGNvbnNvbGU8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MvbGVzc29uLzY5YjhmODA5NGQ0OWZkZjIxNjY2NmE2OVwiPkpTIExlc3NvbiAyOiBWYXJpYWJsZXMgXHUyMDE0IFN0b3JpbmcgRGF0YTwvYT4gXHUyMDE0IHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gPGNvZGU+bGV0PC9jb2RlPiwgPGNvZGU+Y29uc3Q8L2NvZGU+LCBhbmQgPGNvZGU+dmFyPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzcy9sZXNzb24vNjliOGY4MDk0ZDQ5ZmRmMjE2NjY2YTZhXCI+SlMgTGVzc29uIDM6IERhdGEgVHlwZXM8L2E+IFx1MjAxNCBzdHJpbmdzLCBudW1iZXJzLCBib29sZWFucywgbnVsbCwgdW5kZWZpbmVkLCBvYmplY3RzPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhc2NyaXB0LW1hc3RlcmNsYXNzL2xlc3Nvbi82OWI4ZjgwOTRkNDlmZGYyMTY2NjZhNmNcIj5KUyBMZXNzb24gNTogQ29uZGl0aW9uYWxzIFx1MjAxNCBNYWtpbmcgRGVjaXNpb25zPC9hPiBcdTIwMTQgdGhlIGNvcmUgb2YgZXZlcnkgaW50ZXJhY3RpdmUgZmVhdHVyZTwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+QWZ0ZXIgdGhlIGZ1bmRhbWVudGFscywgbWFrZSBzdXJlIHRvIHJlYWQgb3VyIDxhIGhyZWY9XCIvYmxvZy9qYXZhc2NyaXB0LWRvbS1tYW5pcHVsYXRpb24tc2VjcmV0c1wiPkphdmFTY3JpcHQgRE9NIE1hbmlwdWxhdGlvbiBndWlkZTwvYT4gXHUyMDE0IGl0IGNvdmVycyB0aGUgYWR2YW5jZWQgRE9NIHBhdHRlcm5zIHVzZWQgaW4gcHJvZHVjdGlvbiB0aGF0IHRoZSBjb3Vyc2UgaW50cm9kdWNlcy48L3A+XG4gICAgICA8cD48c3Ryb25nPkZyZWUgQ291cnNlOjwvc3Ryb25nPiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3M8L2E+PC9wPlxuXG4gICAgICA8aDI+U3RlcCA0OiBCdWlsZCAzIFJlYWwgUHJvamVjdHMgKFdlZWtzIDExXHUyMDEzMTQpPC9oMj5cbiAgICAgIDxwPk5vIHJlY3J1aXRlciBjYXJlcyB3aGF0IHlvdSBzdHVkaWVkLiBUaGV5IGNhcmUgd2hhdCB5b3UgYnVpbHQuIEFmdGVyIGNvbXBsZXRpbmcgdGhlIHRocmVlIGNvdXJzZXMgYWJvdmUsIGJ1aWxkIHRoZXNlIHRocmVlIHByb2plY3RzIGFuZCBwdWJsaXNoIHRoZW0gdG8gR2l0SHViOjwvcD5cbiAgICAgIDxvbD5cbiAgICAgICAgPGxpPjxzdHJvbmc+UGVyc29uYWwgUG9ydGZvbGlvIFdlYnNpdGU8L3N0cm9uZz4gXHUyMDE0IEhUTUwgKyBDU1Mgb25seS4gU2hvd2Nhc2UgeW91ciBuYW1lLCBza2lsbHMsIHByb2plY3RzLCBhbmQgYSBjb250YWN0IGZvcm0uIFRoaXMgaXMgdGhlIGZpcnN0IGxpbmsgaW4geW91ciBqb2IgYXBwbGljYXRpb25zLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPldlYXRoZXIgQXBwPC9zdHJvbmc+IFx1MjAxNCBIVE1MICsgQ1NTICsgSmF2YVNjcmlwdCArIGEgcHVibGljIEFQSSAoT3BlbldlYXRoZXJNYXAgaXMgZnJlZSkuIEZldGNoZXMgbGl2ZSB3ZWF0aGVyIGRhdGEgYmFzZWQgb24gYSBjaXR5IG5hbWUgYW5kIGRpc3BsYXlzIGl0LiBEZW1vbnN0cmF0ZXMgRE9NIG1hbmlwdWxhdGlvbiBhbmQgYXN5bmMvZmV0Y2guPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+VGFzayBNYW5hZ2VyIEFwcDwvc3Ryb25nPiBcdTIwMTQgSFRNTCArIENTUyArIEphdmFTY3JpcHQgKyBsb2NhbFN0b3JhZ2UuIEEgZnVsbCBDUlVEIGFwcCAoQ3JlYXRlLCBSZWFkLCBVcGRhdGUsIERlbGV0ZSkgd2l0aCBkYXRhIHBlcnNpc3RlbmNlLiBEZW1vbnN0cmF0ZXMgc3RhdGUgbWFuYWdlbWVudCBhdCB0aGUgRE9NIGxldmVsLjwvbGk+XG4gICAgICA8L29sPlxuICAgICAgPHA+RWFjaCBwcm9qZWN0IG5lZWRzOiBhIEdpdEh1YiByZXBvc2l0b3J5IHdpdGggYSBjbGVhciBSRUFETUUsIGEgbGl2ZSBkZW1vIGxpbmsgKGRlcGxveSBmcmVlIG9uIFZlcmNlbCBvciBHaXRIdWIgUGFnZXMpLCBhbmQgYSBicmllZiBkZXNjcmlwdGlvbiBvZiB3aGF0IHByb2JsZW0gaXQgc29sdmVzIGFuZCB3aGF0IHRlY2hub2xvZ2llcyBpdCB1c2VzLjwvcD5cblxuICAgICAgPGgyPlN0ZXAgNTogTGVhcm4gUmVhY3QgKFdlZWtzIDE0XHUyMDEzMjApPC9oMj5cbiAgICAgIDxwPk9uY2UgeW91IGFyZSBzb2xpZCBvbiB2YW5pbGxhIEphdmFTY3JpcHQsIGFkZCBSZWFjdCBcdTIwMTQgdGhlIG1vc3QgcG9wdWxhciBmcm9udGVuZCBmcmFtZXdvcmsgaW4gdGhlIHdvcmxkLCB1c2VkIGJ5IE1ldGEsIE5ldGZsaXgsIEFpcmJuYiwgYW5kIHRob3VzYW5kcyBvZiBzdGFydHVwcy4gUmVhY3QgbGV0cyB5b3UgYnVpbGQgY29tcGxleCBVSXMgZnJvbSByZXVzYWJsZSBjb21wb25lbnRzLCBtYW5hZ2VzIGFwcGxpY2F0aW9uIHN0YXRlLCBhbmQgaXMgdGhlIGluZHVzdHJ5IHN0YW5kYXJkIGZvciBmcm9udGVuZCBlbmdpbmVlcmluZyByb2xlcy48L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcmVhY3QtbWFzdGVyY2xhc3MvbGVzc29uLzdhYzFmOGIyMGQ0ZjlhM2U2MWMyYjkxMFwiPlJlYWN0IExlc3NvbiAxOiBSZWFjdCBFY29zeXN0ZW0gYW5kIE1vZGVybiBUb29saW5nPC9hPiBcdTIwMTQgVml0ZSwgbnBtLCBhbmQgdGhlIG1vZGVybiBSZWFjdCBzZXR1cDwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcmVhY3QtbWFzdGVyY2xhc3MvbGVzc29uLzdhYzFmOGIyMGQ0ZjlhM2U2MWMyYjkxMVwiPlJlYWN0IExlc3NvbiAyOiBKU1ggU3ludGF4IGluIERlcHRoPC9hPiBcdTIwMTQgd3JpdGluZyBIVE1MIGluc2lkZSBKYXZhU2NyaXB0PC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1yZWFjdC1tYXN0ZXJjbGFzcy9sZXNzb24vN2FjMWY4YjIwZDRmOWEzZTYxYzJiOTEzXCI+UmVhY3QgTGVzc29uIDQ6IFByb3BzLCBTdGF0ZSwgYW5kIERhdGEgRmxvdzwvYT4gXHUyMDE0IHRoZSBjb3JlIG1lbnRhbCBtb2RlbCBvZiBSZWFjdDwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcmVhY3QtbWFzdGVyY2xhc3MvbGVzc29uLzdhYzFmOGIyMGQ0ZjlhM2U2MWMyYjkxNFwiPlJlYWN0IExlc3NvbiA1OiBFdmVudCBIYW5kbGluZyBhbmQgQ29udHJvbGxlZCBGb3JtczwvYT4gXHUyMDE0IHJlYWwtd29ybGQgZm9ybXMgdGhhdCBhY3R1YWxseSB3b3JrPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD48c3Ryb25nPkZyZWUgQ291cnNlOjwvc3Ryb25nPiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcmVhY3QtbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBSZWFjdCBNYXN0ZXJjbGFzczwvYT48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDY6IEFkZCBhIEJhY2tlbmQgd2l0aCBOb2RlLmpzIChXZWVrcyAyMFx1MjAxMzI2LCBPcHRpb25hbCBmb3IgRnJvbnRlbmQgUm9sZXMpPC9oMj5cbiAgICAgIDxwPkZ1bGwtc3RhY2sgZGV2ZWxvcGVycyBidWlsZCBib3RoIHRoZSBmcm9udGVuZCAoUmVhY3QpIGFuZCB0aGUgYmFja2VuZCAodGhlIHNlcnZlciwgZGF0YWJhc2UsIGFuZCBBUEkpLiBOb2RlLmpzIHdpdGggRXhwcmVzcyBpcyB0aGUgbW9zdCBiZWdpbm5lci1mcmllbmRseSBiYWNrZW5kIHRlY2hub2xvZ3kgXHUyMDE0IGl0IHVzZXMgSmF2YVNjcmlwdCwgdGhlIHNhbWUgbGFuZ3VhZ2UgeW91IGFscmVhZHkga25vdy48L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvbm9kZWpzLWV4cHJlc3MtYXBpLWRldmVsb3BtZW50L2xlc3Nvbi83YWMxZjhiMjBkNGY5YTNlNjFjMmJhMTBcIj5Ob2RlLmpzIExlc3NvbiAxOiBBcmNoaXRlY3R1cmUgYW5kIEV2ZW50IExvb3A8L2E+IFx1MjAxNCB3aHkgbm9uLWJsb2NraW5nIEkvTyBpcyBhIHN1cGVycG93ZXI8L2xpPlxuICAgICAgICA8bGk+PGEgaHJlZj1cIi9jb3Vyc2VzL25vZGVqcy1leHByZXNzLWFwaS1kZXZlbG9wbWVudC9sZXNzb24vN2FjMWY4YjIwZDRmOWEzZTYxYzJiYTEyXCI+Tm9kZS5qcyBMZXNzb24gMzogUkVTVCBBUEkgRGVzaWduIFByaW5jaXBsZXM8L2E+IFx1MjAxNCBidWlsZCBhIHJlYWwgQVBJIGZyb20gc2NyYXRjaDwvbGk+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvbm9kZWpzLWV4cHJlc3MtYXBpLWRldmVsb3BtZW50L2xlc3Nvbi83YWMxZjhiMjBkNGY5YTNlNjFjMmJhMTRcIj5Ob2RlLmpzIExlc3NvbiA1OiBBdXRoZW50aWNhdGlvbiB3aXRoIEpXVDwvYT4gXHUyMDE0IGFkZCB1c2VyIGxvZ2luIHRvIHlvdXIgYXBwbGljYXRpb25zPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD48c3Ryb25nPkZyZWUgQ291cnNlOjwvc3Ryb25nPiA8YSBocmVmPVwiL2NvdXJzZXMvbm9kZWpzLWV4cHJlc3MtYXBpLWRldmVsb3BtZW50XCI+Tm9kZS5qcyAmYW1wOyBFeHByZXNzIEFQSSBEZXZlbG9wbWVudDwvYT48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDc6IEdldCBDZXJ0aWZpZWQgYW5kIEFwcGx5PC9oMj5cbiAgICAgIDxwPkFmdGVyIGNvbXBsZXRpbmcgZWFjaCBTa2lsbFZhbGl4IGNvdXJzZSwgdGFrZSB0aGUgY2VydGlmaWNhdGlvbiBleGFtIHRvIGVhcm4gYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlLiBBIHZlcmlmaWFibGUgY2VydGlmaWNhdGUgaXMgZnVuZGFtZW50YWxseSBkaWZmZXJlbnQgZnJvbSBhIFwiY29tcGxldGlvbiBiYWRnZVwiIFx1MjAxNCBpdCBwcm92ZXMgeW91IHBhc3NlZCBhIHJlYWwgYXNzZXNzbWVudC4gVGhlIGNlcnRpZmljYXRlIGxpbmtzIGRpcmVjdGx5IHRvIHlvdXIgc2NvcmUgYW5kIHNraWxscyBvbiB5b3VyIFNraWxsVmFsaXggcHVibGljIHByb2ZpbGUuIEFkZCBldmVyeSBjZXJ0aWZpY2F0ZSB0byB5b3VyIExpbmtlZEluIHByb2ZpbGUgYW5kIGxpbmsgeW91ciBwcm9maWxlIFVSTCBpbiBldmVyeSBqb2IgYXBwbGljYXRpb24uPC9wPlxuICAgICAgPHA+UmVhZCBvdXIgZ3VpZGUgb24gPGEgaHJlZj1cIi9ibG9nL2hvdy10by1idWlsZC1wb3dlcmZ1bC1wdWJsaWMtcG9ydGZvbGlvLTIwMjZcIj5ob3cgdG8gYnVpbGQgYSBwb3dlcmZ1bCBkZXZlbG9wZXIgcG9ydGZvbGlvPC9hPiBzbyB5b3VyIHByb2ZpbGUgaXMgb3B0aW1pc2VkIGZvciByZWNydWl0ZXIgZGlzY292ZXJ5LjwvcD5cblxuICAgICAgPGgyPlRoZSBSZWFsaXN0aWMgVGltZWxpbmU8L2gyPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Nb250aCAxOjwvc3Ryb25nPiBIVE1MICsgQ1NTIGJhc2ljcy4gQ2FuIGJ1aWxkIHNpbXBsZSBzdGF0aWMgd2Vic2l0ZXMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TW9udGggMjo8L3N0cm9uZz4gQ1NTIGFkdmFuY2VkIChGbGV4Ym94LCBHcmlkLCBhbmltYXRpb25zKSArIEphdmFTY3JpcHQgYmFzaWNzICh2YXJpYWJsZXMsIGxvb3BzLCBmdW5jdGlvbnMpLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPk1vbnRoIDM6PC9zdHJvbmc+IEphdmFTY3JpcHQgRE9NIG1hbmlwdWxhdGlvbi4gQnVpbGQgV2VhdGhlciBBcHAgKyBQb3J0Zm9saW8gc2l0ZS48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Nb250aCA0Ojwvc3Ryb25nPiBKYXZhU2NyaXB0IGFkdmFuY2VkIChhc3luYywgZmV0Y2gsIFByb21pc2VzKS4gQnVpbGQgVGFzayBNYW5hZ2VyLiBTdGFydCBSZWFjdC48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Nb250aCA1Ojwvc3Ryb25nPiBSZWFjdCBjb21wb25lbnRzLCBzdGF0ZSwgaG9va3MuIEJ1aWxkIG9uZSBSZWFjdCBwcm9qZWN0IChlLmcuIGEgbW92aWUgc2VhcmNoIGFwcCB1c2luZyBUTURCIEFQSSkuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TW9udGggNjo8L3N0cm9uZz4gUG9saXNoIHBvcnRmb2xpbywgYXBwbHkgZm9yIGp1bmlvciBmcm9udGVuZCByb2xlcywgZG8gU2tpbGxWYWxpeCBqb2Igc2ltdWxhdGlvbnMuPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9uczwvaDI+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IENhbiBJIGJlY29tZSBhIHdlYiBkZXZlbG9wZXIgd2l0aG91dCBhbnkgcHJpb3IgcHJvZ3JhbW1pbmcgZXhwZXJpZW5jZT88L3N0cm9uZz48YnIvPlxuICAgICAgWWVzLCBjb21wbGV0ZWx5LiBIVE1MIGFuZCBDU1MgYXJlIGFtb25nIHRoZSBtb3N0IGJlZ2lubmVyLWZyaWVuZGx5IHRlY2hub2xvZ2llcyBldmVyIGNyZWF0ZWQuIE1vc3QgZGV2ZWxvcGVycyBzdGFydGVkIHdpdGggemVybyBleHBlcmllbmNlLiBUaGUga2V5IGlzIGNvbnNpc3RlbmN5IFx1MjAxNCBldmVuIDEgaG91ciBldmVyeSBkYXkgY29tcG91bmRzIHNpZ25pZmljYW50bHkgb3ZlciA2IG1vbnRocy48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTI6IERvIEkgbmVlZCB0byBsZWFybiBiYWNrZW5kIGRldmVsb3BtZW50IHRvIGdldCBhIGpvYj88L3N0cm9uZz48YnIvPlxuICAgICAgTm8uIEZyb250ZW5kLW9ubHkgcm9sZXMgKEhUTUwgKyBDU1MgKyBKYXZhU2NyaXB0ICsgUmVhY3QpIGFyZSBleHRyZW1lbHkgY29tbW9uIGF0IHN0YXJ0dXBzLCBhZ2VuY2llcywgYW5kIHByb2R1Y3QgY29tcGFuaWVzLiBGdWxsLXN0YWNrIHJvbGVzIGNvbW1hbmQgaGlnaGVyIHNhbGFyaWVzIGJ1dCByZXF1aXJlIG1vcmUgbGVhcm5pbmcgdGltZS4gU3RhcnQgd2l0aCBmcm9udGVuZCwgZ2V0IGhpcmVkLCB0aGVuIGFkZCBiYWNrZW5kIGtub3dsZWRnZSBvbiB0aGUgam9iLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMzogSG93IGltcG9ydGFudCBhcmUgY2VydGlmaWNhdGlvbnMgdnMgcHJvamVjdHMgZm9yIGdldHRpbmcgaGlyZWQ/PC9zdHJvbmc+PGJyLz5cbiAgICAgIEJvdGggbWF0dGVyLCBmb3IgZGlmZmVyZW50IHJlYXNvbnMuIFByb2plY3RzIHByb3ZlIHlvdSBjYW4gYnVpbGQgXHUyMDE0IHRoZXkgYXJlIHRoZSBtb3N0IGltcG9ydGFudCBoaXJpbmcgc2lnbmFsLiBDZXJ0aWZpY2F0aW9ucyBmcm9tIHZlcmlmaWVkIGFzc2Vzc21lbnRzIChsaWtlIFNraWxsVmFsaXgpIHByb3ZlIHRoZSBwcm9qZWN0cyBhcmUgbm90IGZsdWtlcyBcdTIwMTQgdGhleSBzaG93IHlvdSBwYXNzZWQgYSByaWdvcm91cyB0ZXN0LiBUaGUgd2lubmluZyBjb21iaW5hdGlvbiBpcyBzdHJvbmcgcHJvamVjdHMgKyB2ZXJpZmllZCBjZXJ0aWZpY2F0ZXMgKyBhbiBvcHRpbWlzZWQgcG9ydGZvbGlvIFVSTC48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTQ6IFdoYXQgaXMgdGhlIGJlc3QgZmlyc3QgcHJvamVjdCB0byBidWlsZD88L3N0cm9uZz48YnIvPlxuICAgICAgWW91ciBwZXJzb25hbCBwb3J0Zm9saW8gd2Vic2l0ZS4gSXQgc2VydmVzIGRvdWJsZSBkdXR5OiBpdCBpcyBhIHByb2plY3QgdGhhdCBkZW1vbnN0cmF0ZXMgeW91ciBIVE1ML0NTUy9KUyBza2lsbHMsIEFORCBpdCBpcyB0aGUgbGl2ZSBVUkwgeW91IHNlbmQgdG8gZXZlcnkgZW1wbG95ZXIuIEJ1aWxkIGl0IHdpdGggSFRNTCBhbmQgQ1NTIG9ubHkgZmlyc3QuIFRoZW4gYWRkIEphdmFTY3JpcHQgYW5pbWF0aW9ucyBhbmQgaW50ZXJhY3Rpdml0eSBhcyB5b3UgbGVhcm4uIFRoZW4gZXZlbnR1YWxseSByZWJ1aWxkIGl0IGluIFJlYWN0LiBJdCBncm93cyB3aXRoIHlvdSBhcyB5b3VyIHNraWxscyBncm93LjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ0FyanVuIE1laHRhJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wMy0yOFQwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wNVQxODowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ01hcmNoIDI4LCAyMDI2JyxcbiAgICByZWFkVGltZTogJzE0IG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDE2MjAsXG4gICAgY2F0ZWdvcnk6ICdDYXJlZXIgJiBJbmR1c3RyeScsXG4gICAgdGFnczogWydXZWIgRGV2ZWxvcG1lbnQnLCAnQ2FyZWVyIFJvYWRtYXAnLCAnQmVnaW5uZXJzJywgJ0Zyb250ZW5kIERldmVsb3BlcicsICdGdWxsIFN0YWNrJywgJ0ZyZWUgQ291cnNlcycsICdMZWFybiB0byBDb2RlIDIwMjYnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk4MDUwMTA4MDIzLWM1MjQ5ZjRkZjA4NT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdEZXZlbG9wZXIgd29ya2luZyBvbiBsYXB0b3Agd2l0aCBIVE1MIENTUyBKYXZhU2NyaXB0IGNvZGUgb24gc2NyZWVuJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL2hvdy10by1iZWNvbWUtd2ViLWRldmVsb3Blci0yMDI2LXJvYWRtYXAnLFxuICAgIHJlbGF0ZWRDb3Vyc2U6IHtcbiAgICAgIHRpdGxlOiAnVWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtaHRtbC1tYXN0ZXJjbGFzcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1lvdXIgZmlyc3Qgc3RlcCBvbiB0aGUgcm9hZG1hcCBcdTIwMTQgbWFzdGVyIEhUTUw1IGZyb20gc2NyYXRjaCB3aXRoIGEgZnJlZSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlLidcbiAgICB9XG4gIH0sXG5cbiAge1xuICAgIGlkOiAnY3NzLWFuaW1hdGlvbnMtbWljcm8taW50ZXJhY3Rpb25zLWd1aWRlJyxcbiAgICB0aXRsZTogJ0NTUyBNaWNybyBBbmltYXRpb25zICYgTWljcm8tSW50ZXJhY3Rpb25zOiBUaGUgQ29tcGxldGUgR3VpZGUgdG8gTWFraW5nIFlvdXIgV2Vic2l0ZSBGZWVsIEFsaXZlICgyMDI2KScsXG4gICAgbWV0YVRpdGxlOiAnQ1NTIE1pY3JvIEFuaW1hdGlvbnMgJiBNaWNyby1JbnRlcmFjdGlvbnM6IENvbXBsZXRlIEd1aWRlIDIwMjYgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdNYXN0ZXIgQ1NTIG1pY3JvIGFuaW1hdGlvbnMgYW5kIG1pY3JvLWludGVyYWN0aW9ucyBpbiAyMDI2LiBMZWFybiB0cmFuc2l0aW9ucywgQGtleWZyYW1lcywgaG92ZXIgZWZmZWN0cywgc2Nyb2xsIGFuaW1hdGlvbnMsIGFuZCBHUFUtYWNjZWxlcmF0ZWQgdGVjaG5pcXVlcyB3aXRoIHJlYWwgY29kZSBleGFtcGxlcy4gQnVpbGQgd2Vic2l0ZXMgdXNlcnMgbG92ZS4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnQ1NTIG1pY3JvIGFuaW1hdGlvbnMnLFxuICAgICAgJ0NTUyBtaWNyby1pbnRlcmFjdGlvbnMnLFxuICAgICAgJ0NTUyBhbmltYXRpb25zIHR1dG9yaWFsIDIwMjYnLFxuICAgICAgJ0NTUyB0cmFuc2l0aW9ucyBndWlkZScsXG4gICAgICAna2V5ZnJhbWVzIGFuaW1hdGlvbiBDU1MnLFxuICAgICAgJ0NTUyBob3ZlciBlZmZlY3RzJyxcbiAgICAgICd3ZWIgYW5pbWF0aW9uIGJlc3QgcHJhY3RpY2VzJyxcbiAgICAgICdVSSBhbmltYXRpb24gQ1NTIGV4YW1wbGVzJyxcbiAgICAgICdDU1MgYW5pbWF0aW9uIHBlcmZvcm1hbmNlJyxcbiAgICAgICdidXR0b24gaG92ZXIgYW5pbWF0aW9uIENTUycsXG4gICAgICAnY2FyZCBob3ZlciBlZmZlY3QgQ1NTJyxcbiAgICAgICdDU1MgbG9hZGluZyBhbmltYXRpb24nLFxuICAgICAgJ3Njcm9sbCBhbmltYXRpb24gQ1NTJyxcbiAgICAgICdwdXJlIENTUyBhbmltYXRpb24gbm8gSmF2YVNjcmlwdCdcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdDU1MgbWljcm8gYW5pbWF0aW9ucyBhcmUgdGhlIHNlY3JldCB3ZWFwb24gb2YgZWxpdGUgVVggZGVzaWduZXJzLiBBIGJ1dHRvbiB0aGF0IGxpZnRzIG9uIGhvdmVyLCBhIGNhcmQgdGhhdCBnbG93cyBvbiBmb2N1cywgYSBsb2FkZXIgdGhhdCBwdWxzZXMgXHUyMDE0IHRoZXNlIHRpbnkgbW9tZW50cyB0cmFuc2Zvcm0gYSB3ZWJzaXRlIGZyb20gZnVuY3Rpb25hbCB0byB1bmZvcmdldHRhYmxlLiBIZXJlIGlzIHRoZSBjb21wbGV0ZSAyMDI2IGd1aWRlIHRvIGJ1aWxkaW5nIHRoZW0gd2l0aCBwdXJlIENTUy4nLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxoMj5XaGF0IEFyZSBDU1MgTWljcm8gQW5pbWF0aW9ucz8gKEFuZCBXaHkgVGhleSBNYXR0ZXIpPC9oMj5cbiAgICAgIDxwPkEgPHN0cm9uZz5DU1MgbWljcm8gYW5pbWF0aW9uPC9zdHJvbmc+IGlzIGEgc21hbGwsIHB1cnBvc2VmdWwgbW90aW9uIHRoYXQgcmVzcG9uZHMgdG8gYSB1c2VyIGFjdGlvbi4gSXQgaXMgbm90IGEgZmxhc2h5IGJhbm5lciBvciBhIGZ1bGwtcGFnZSB0cmFuc2l0aW9uLiBJdCBpcyBhIGJ1dHRvbiB0aGF0IHNoaWZ0cyAycHggdXB3YXJkIHdoZW4gaG92ZXJlZC4gSXQgaXMgYSBjaGVja2JveCB0aGF0IHNjYWxlcyB3aXRoIGEgc2F0aXNmeWluZyBwb3Agd2hlbiBjaGVja2VkLiBJdCBpcyBhIG5hdmlnYXRpb24gbGluayB3aG9zZSB1bmRlcmxpbmUgc2xpZGVzIGluIGZyb20gdGhlIGxlZnQuPC9wPlxuICAgICAgPHA+VGhlc2UgbWljcm8gYW5pbWF0aW9ucyBzZXJ2ZSBhIGNyaXRpY2FsIFVYIHB1cnBvc2U6IHRoZXkgcHJvdmlkZSA8c3Ryb25nPmZlZWRiYWNrPC9zdHJvbmc+LiBUaGV5IHRlbGwgdGhlIHVzZXIgXCJ5ZXMsIHlvdXIgYWN0aW9uIHdhcyByZWdpc3RlcmVkXCIgd2l0aG91dCBhIHNpbmdsZSBsaW5lIG9mIGNvcHkuIFJlc2VhcmNoIGZyb20gdGhlIE5pZWxzZW4gTm9ybWFuIEdyb3VwIGNvbnNpc3RlbnRseSBzaG93cyB0aGF0IGludGVyZmFjZXMgd2l0aCBwdXJwb3NlZnVsIG1pY3JvLWludGVyYWN0aW9ucyBmZWVsIG1vcmUgdHJ1c3R3b3J0aHkgYW5kIGVhc2llciB0byB1c2UuPC9wPlxuICAgICAgPHA+VGhlIGJlc3QgbmV3cz8gSW4gMjAyNiwgeW91IG5lZWQgPHN0cm9uZz56ZXJvIEphdmFTY3JpcHQ8L3N0cm9uZz4gZm9yIDkwJSBvZiB0aGVzZSBlZmZlY3RzLiBQdXJlIENTUyBpcyBmYXN0ZXIsIHNpbXBsZXIsIGFuZCBtb3JlIGFjY2Vzc2libGUuPC9wPlxuXG4gICAgICA8aDI+VGhlIEZvdW5kYXRpb246IENTUyB0cmFuc2l0aW9uczwvaDI+XG4gICAgICA8cD5UaGUgPGNvZGU+dHJhbnNpdGlvbjwvY29kZT4gcHJvcGVydHkgaXMgeW91ciBtb3N0LXVzZWQgdG9vbCBmb3IgQ1NTIG1pY3JvIGFuaW1hdGlvbnMuIChMZWFybiBtb3JlIGluIDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByby9sZXNzb24vNjliOGY1Njg0MDM2ZTM4MDliNTBjNjZlXCI+TGVzc29uIDE0OiBDU1MgVHJhbnNpdGlvbnMgJmFtcDsgQW5pbWF0aW9uczwvYT4pLiBJdCBzbW9vdGhseSBhbmltYXRlcyBhIENTUyBwcm9wZXJ0eSBmcm9tIG9uZSB2YWx1ZSB0byBhbm90aGVyIHdoZW5ldmVyIHRoYXQgcHJvcGVydHkgY2hhbmdlcyBcdTIwMTQgdHlwaWNhbGx5IG9uIDxjb2RlPjpob3ZlcjwvY29kZT4sIDxjb2RlPjpmb2N1czwvY29kZT4sIG9yIDxjb2RlPjphY3RpdmU8L2NvZGU+LjwvcD5cbiAgICAgIDxwPlRoZSBzeW50YXggaGFzIGZvdXIgcGFydHM6PC9wPlxuICAgICAgPHByZT48Y29kZT50cmFuc2l0aW9uOiBbcHJvcGVydHldIFtkdXJhdGlvbl0gW3RpbWluZy1mdW5jdGlvbl0gW2RlbGF5XTs8L2NvZGU+PC9wcmU+XG4gICAgICA8cD5IZXJlIGlzIHRoZSBtb3N0IHVzZWZ1bCBwYXR0ZXJuIFx1MjAxNCBhIGJ1dHRvbiBtaWNybyBhbmltYXRpb24gdGhhdCBsaWZ0cyBhbmQgZGVlcGVucyBpdHMgc2hhZG93IG9uIGhvdmVyOjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+LmJ0bi1wcmltYXJ5IHtcbiAgYmFja2dyb3VuZDogIzRmNDZlNTtcbiAgY29sb3I6IHdoaXRlO1xuICBwYWRkaW5nOiAxMnB4IDI4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgYm9yZGVyOiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDZweCByZ2JhKDc5LCA3MCwgMjI5LCAwLjI1KTtcblxuICAvKiBNaWNybyBhbmltYXRpb246IHRyYW5zaXRpb24gbXVsdGlwbGUgcHJvcGVydGllcyBhdCBvbmNlICovXG4gIHRyYW5zaXRpb246XG4gICAgYmFja2dyb3VuZC1jb2xvciAwLjI1cyBlYXNlLFxuICAgIHRyYW5zZm9ybSAgICAgICAwLjJzICBlYXNlLFxuICAgIGJveC1zaGFkb3cgICAgICAwLjI1cyBlYXNlO1xufVxuXG4uYnRuLXByaW1hcnk6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjNDMzOGNhO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTNweCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSg3OSwgNzAsIDIyOSwgMC40KTtcbn1cblxuLmJ0bi1wcmltYXJ5OmFjdGl2ZSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwcHgpO1xuICBib3gtc2hhZG93OiAwIDJweCA2cHggcmdiYSg3OSwgNzAsIDIyOSwgMC4yNSk7XG59PC9jb2RlPjwvcHJlPlxuICAgICAgPHA+Tm90aWNlIHRoZSA8Y29kZT46YWN0aXZlPC9jb2RlPiBzdGF0ZSBcdTIwMTQgd2hlbiBhIHVzZXIgY2xpY2tzLCB0aGUgYnV0dG9uIHNuYXBzIGJhY2sgZG93bi4gVGhpcyBcInByZXNzXCIgbWljcm8gYW5pbWF0aW9uIGlzIGEgc3VidGxlIGJ1dCBwb3dlcmZ1bCBwaWVjZSBvZiBwaHlzaWNhbCBmZWVkYmFjayB0aGF0IG1ha2VzIGJ1dHRvbnMgZmVlbCB0YWN0aWxlLjwvcD5cblxuICAgICAgPGgzPlRpbWluZyBGdW5jdGlvbnM6IFRoZSBTb3VsIG9mIGEgTWljcm8gQW5pbWF0aW9uPC9oMz5cbiAgICAgIDxwPlRoZSB0aW1pbmcgZnVuY3Rpb24gKG9yIFwiZWFzaW5nXCIpIGNvbnRyb2xzIHRoZSBhY2NlbGVyYXRpb24gY3VydmUgb2YgeW91ciBDU1MgbWljcm8gYW5pbWF0aW9uLiBDaG9vc2luZyB0aGUgd3Jvbmcgb25lIG1ha2VzIGFuaW1hdGlvbnMgZmVlbCBtZWNoYW5pY2FsLiBIZXJlIGFyZSB0aGUgb25lcyB0aGF0IG1hdHRlcjo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPmVhc2U8L3N0cm9uZz4gKGRlZmF1bHQpOiBTdGFydHMgc2xvdywgc3BlZWRzIHVwLCB0aGVuIHNsb3dzIGRvd24uIEdvb2QgZm9yIG1vc3QgZ2VuZXJhbCBtaWNybyBhbmltYXRpb25zLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPmVhc2Utb3V0PC9zdHJvbmc+OiBTdGFydHMgZmFzdCwgZW5kcyBzbG93LiBCZXN0IGZvciBlbGVtZW50cyBlbnRlcmluZyB0aGUgc2NyZWVuIChmZWVscyBuYXR1cmFsLCBsaWtlIHNvbWV0aGluZyBzbGlkaW5nIGludG8gcGxhY2UpLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPmVhc2UtaW48L3N0cm9uZz46IFN0YXJ0cyBzbG93LCBlbmRzIGZhc3QuIEJlc3QgZm9yIGVsZW1lbnRzIGxlYXZpbmcgdGhlIHNjcmVlbi48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5jdWJpYy1iZXppZXIoKTwvc3Ryb25nPjogRnVsbCBjdXN0b20gY29udHJvbC4gVXNlIDxhIGhyZWY9XCJodHRwczovL2N1YmljLWJlemllci5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+Y3ViaWMtYmV6aWVyLmNvbTwvYT4gdG8gZGVzaWduIHlvdXIgZXhhY3QgY3VydmUuPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cHJlPjxjb2RlPi8qIEEgXCJib3VuY3lcIiBjdXN0b20gZWFzaW5nIFx1MjAxNCBncmVhdCBmb3IgY2FyZCBob3ZlciBlZmZlY3RzICovXG4uY2FyZCB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjM1cyBjdWJpYy1iZXppZXIoMC4zNCwgMS41NiwgMC42NCwgMSk7XG59XG4uY2FyZDpob3ZlciB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KSBzY2FsZSgxLjAyKTtcbn08L2NvZGU+PC9wcmU+XG4gICAgICA8cD5UaGUgPGNvZGU+Y3ViaWMtYmV6aWVyKDAuMzQsIDEuNTYsIDAuNjQsIDEpPC9jb2RlPiB2YWx1ZSBvdmVyc2hvb3RzIHNsaWdodGx5IGJlZm9yZSBzZXR0bGluZyBcdTIwMTQgdGhpcyBpcyBjYWxsZWQgYSBcInNwcmluZ1wiIGVhc2luZyBhbmQgaXQgbWFrZXMgbWljcm8gYW5pbWF0aW9ucyBmZWVsIGFsaXZlIGFuZCBwaHlzaWNhbC48L3A+XG5cbiAgICAgIDxoMj5Hb2luZyBEZWVwZXI6IENTUyBAa2V5ZnJhbWVzIEFuaW1hdGlvbnM8L2gyPlxuICAgICAgPHA+V2hpbGUgPGNvZGU+dHJhbnNpdGlvbjwvY29kZT4gYW5pbWF0ZXMgYmV0d2VlbiB0d28gc3RhdGVzLCA8Y29kZT5Aa2V5ZnJhbWVzPC9jb2RlPiBnaXZlcyB5b3UgZnVsbCBuYXJyYXRpdmUgY29udHJvbC4gWW91IGRlZmluZSBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb24gXHUyMDE0IGFuZCB0aGUgYnJvd3NlciBoYW5kbGVzIHRoZSByZXN0LjwvcD5cbiAgICAgIDxwPkhlcmUgaXMgdGhlIHN5bnRheCBwYXR0ZXJuOjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+QGtleWZyYW1lcyBhbmltYXRpb24tbmFtZSB7XG4gIDAlICAgeyAvKiBzdGFydGluZyBzdGF0ZSAqLyB9XG4gIDUwJSAgeyAvKiBtaWQtcG9pbnQgc3RhdGUgKi8gfVxuICAxMDAlIHsgLyogZW5kaW5nIHN0YXRlICovIH1cbn1cblxuLmVsZW1lbnQge1xuICBhbmltYXRpb246IGFuaW1hdGlvbi1uYW1lIFtkdXJhdGlvbl0gW3RpbWluZ10gW2RlbGF5XSBbaXRlcmF0aW9uXSBbZGlyZWN0aW9uXTtcbn08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz5QcmFjdGljYWwgRXhhbXBsZSAxOiBQdWxzaW5nIE5vdGlmaWNhdGlvbiBEb3Q8L2gzPlxuICAgICAgPHA+VGhpcyBpcyBvbmUgb2YgdGhlIG1vc3QgY29tbW9uIENTUyBtaWNybyBhbmltYXRpb25zIHlvdSBzZWUgb24gbW9kZXJuIGRhc2hib2FyZHMgXHUyMDE0IHRoZSBwdWxzaW5nIHJlZCBkb3Qgb24gYSBub3RpZmljYXRpb24gaWNvbjo8L3A+XG4gICAgICA8cHJlPjxjb2RlPkBrZXlmcmFtZXMgcHVsc2UtcmluZyB7XG4gIDAlICAgeyB0cmFuc2Zvcm06IHNjYWxlKDEpOyAgIG9wYWNpdHk6IDE7IH1cbiAgNzAlICB7IHRyYW5zZm9ybTogc2NhbGUoMi4yKTsgb3BhY2l0eTogMDsgfVxuICAxMDAlIHsgdHJhbnNmb3JtOiBzY2FsZSgyLjIpOyBvcGFjaXR5OiAwOyB9XG59XG5cbi5ub3RpZmljYXRpb24tZG90IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogMTBweDtcbiAgaGVpZ2h0OiAxMHB4O1xuICBiYWNrZ3JvdW5kOiAjZWY0NDQ0O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG5cbi8qIFRoZSBleHBhbmRpbmcgcmluZyBlZmZlY3QgKi9cbi5ub3RpZmljYXRpb24tZG90OjpiZWZvcmUge1xuICBjb250ZW50OiAnJztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgYmFja2dyb3VuZDogI2VmNDQ0NDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IHB1bHNlLXJpbmcgMS41cyBlYXNlLW91dCBpbmZpbml0ZTtcbn08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz5QcmFjdGljYWwgRXhhbXBsZSAyOiBTa2VsZXRvbiBMb2FkaW5nIEFuaW1hdGlvbjwvaDM+XG4gICAgICA8cD5Ta2VsZXRvbiBsb2FkZXJzIGFyZSBhIGZhbnRhc3RpYyBDU1MgbWljcm8gYW5pbWF0aW9uIHBhdHRlcm4uIEluc3RlYWQgb2Ygc2hvd2luZyBhIHNwaW5uZXIsIHlvdSBzaG93IGEgc2hpbW1lcmluZyBwbGFjZWhvbGRlciBpbiB0aGUgZXhhY3Qgc2hhcGUgb2YgdGhlIGNvbnRlbnQgYmVpbmcgbG9hZGVkLiBUaGlzIGRyYW1hdGljYWxseSByZWR1Y2VzIHBlcmNlaXZlZCBsb2FkaW5nIHRpbWU6PC9wPlxuICAgICAgPHByZT48Y29kZT5Aa2V5ZnJhbWVzIHNoaW1tZXIge1xuICAwJSAgIHsgYmFja2dyb3VuZC1wb3NpdGlvbjogLTEwMDBweCAwOyB9XG4gIDEwMCUgeyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAgMTAwMHB4IDA7IH1cbn1cblxuLnNrZWxldG9uIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgIDkwZGVnLFxuICAgICNlMmU4ZjAgMjUlLFxuICAgICNmMWY1ZjkgNTAlLFxuICAgICNlMmU4ZjAgNzUlXG4gICk7XG4gIGJhY2tncm91bmQtc2l6ZTogMTAwMHB4IDEwMCU7XG4gIGFuaW1hdGlvbjogc2hpbW1lciAxLjhzIGluZmluaXRlIGxpbmVhcjtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xufVxuXG4vKiBVc2FnZSBleGFtcGxlcyAqL1xuLnNrZWxldG9uLXRpdGxlICB7IGhlaWdodDogMjRweDsgd2lkdGg6IDcwJTsgbWFyZ2luLWJvdHRvbTogMTJweDsgfVxuLnNrZWxldG9uLXRleHQgICB7IGhlaWdodDogMTRweDsgd2lkdGg6IDEwMCU7IG1hcmdpbi1ib3R0b206IDhweDsgfVxuLnNrZWxldG9uLWF2YXRhciB7IGhlaWdodDogNDhweDsgd2lkdGg6IDQ4cHg7IGJvcmRlci1yYWRpdXM6IDUwJTsgfTwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPlByYWN0aWNhbCBFeGFtcGxlIDM6IFNsaWRlLUluIE5hdmlnYXRpb24gVW5kZXJsaW5lPC9oMz5cbiAgICAgIDxwPlRoaXMgQ1NTIG1pY3JvIGFuaW1hdGlvbiByZXBsYWNlcyB0aGUgcGxhaW4gdW5kZXJsaW5lIG9uIG5hdiBsaW5rcyB3aXRoIGEgc21vb3RoIHNsaWRpbmcgZWZmZWN0IFx1MjAxNCBhIGhhbGxtYXJrIG9mIHBvbGlzaGVkIG5hdmlnYXRpb24gZGVzaWduOjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Lm5hdi1saW5rIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiAjNDc1NTY5O1xuICBmb250LXdlaWdodDogNTAwO1xuICBwYWRkaW5nLWJvdHRvbTogNHB4O1xufVxuXG4vKiBUaGUgYW5pbWF0ZWQgdW5kZXJsaW5lICovXG4ubmF2LWxpbms6OmFmdGVyIHtcbiAgY29udGVudDogJyc7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAycHg7XG4gIGJhY2tncm91bmQ6ICM0ZjQ2ZTU7XG4gIHRyYW5zZm9ybTogc2NhbGVYKDApO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0O1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xufVxuXG4ubmF2LWxpbms6aG92ZXI6OmFmdGVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZVgoMSk7XG59PC9jb2RlPjwvcHJlPlxuICAgICAgPHA+VGhlIGtleSBoZXJlIGlzIDxjb2RlPnRyYW5zZm9ybS1vcmlnaW46IGxlZnQ8L2NvZGU+IFx1MjAxNCBpdCBtYWtlcyB0aGUgdW5kZXJsaW5lIHNsaWRlIDxlbT5mcm9tIGxlZnQgdG8gcmlnaHQ8L2VtPi4gQ2hhbmdlIGl0IHRvIDxjb2RlPnJpZ2h0PC9jb2RlPiB0byByZXZlcnNlIGRpcmVjdGlvbiwgb3IgPGNvZGU+Y2VudGVyPC9jb2RlPiBmb3IgYSBleHBhbnNpb24tZnJvbS1jZW50ZXIgZWZmZWN0LjwvcD5cblxuICAgICAgPGgyPkNTUyBNaWNybyBBbmltYXRpb25zIGZvciBDYXJkcyBhbmQgSW50ZXJhY3RpdmUgRWxlbWVudHM8L2gyPlxuXG4gICAgICA8aDM+VGhlIENhcmQgTGlmdCBFZmZlY3Q8L2gzPlxuICAgICAgPHA+Q2FyZCBob3ZlciBlZmZlY3RzIGFyZSBhbW9uZyB0aGUgbW9zdCBzZWFyY2hlZCBDU1MgbWljcm8gYW5pbWF0aW9ucy4gRG9uZSBjb3JyZWN0bHksIHRoZXkgbWFrZSBhIGdyaWQgb2YgY29udGVudCBjYXJkcyBmZWVsIGludGVyYWN0aXZlIGFuZCBwcmVtaXVtOjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+LmNvdXJzZS1jYXJkIHtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlMmU4ZjA7XG4gIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMDYpO1xuXG4gIC8qIE1pY3JvIGFuaW1hdGlvbiBzZXR1cCAqL1xuICB0cmFuc2l0aW9uOlxuICAgIHRyYW5zZm9ybSAgIDAuM3MgY3ViaWMtYmV6aWVyKDAuMzQsIDEuNTYsIDAuNjQsIDEpLFxuICAgIGJveC1zaGFkb3cgIDAuM3MgZWFzZSxcbiAgICBib3JkZXItY29sb3IgMC4zcyBlYXNlO1xufVxuXG4uY291cnNlLWNhcmQ6aG92ZXIge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTZweCk7XG4gIGJveC1zaGFkb3c6IDAgMjBweCA0MHB4IHJnYmEoNzksIDcwLCAyMjksIDAuMTUpO1xuICBib3JkZXItY29sb3I6ICNjN2QyZmU7XG59PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+SW5wdXQgRm9jdXMgTWljcm8gQW5pbWF0aW9uPC9oMz5cbiAgICAgIDxwPkZvcm0gaW5wdXRzIGFyZSBvZnRlbiBvdmVybG9va2VkLCBidXQgYSBwb2xpc2hlZCBmb2N1cyBzdGF0ZSBtaWNybyBhbmltYXRpb24gbWFrZXMgeW91ciBmb3JtcyBmZWVsIHByb2Zlc3Npb25hbDo8L3A+XG4gICAgICA8cHJlPjxjb2RlPi5mb3JtLWlucHV0IHtcbiAgYm9yZGVyOiAycHggc29saWQgI2UyZThmMDtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBwYWRkaW5nOiAxMHB4IDE0cHg7XG4gIG91dGxpbmU6IG5vbmU7XG4gIHRyYW5zaXRpb246XG4gICAgYm9yZGVyLWNvbG9yIDAuMnMgZWFzZSxcbiAgICBib3gtc2hhZG93ICAgMC4ycyBlYXNlLFxuICAgIHRyYW5zZm9ybSAgICAwLjE1cyBlYXNlO1xufVxuXG4uZm9ybS1pbnB1dDpmb2N1cyB7XG4gIGJvcmRlci1jb2xvcjogIzYzNjZmMTtcbiAgYm94LXNoYWRvdzogMCAwIDAgNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjE1KTtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjAxKTtcbn08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMj5UaGUgUGVyZm9ybWFuY2UgUnVsZXMgb2YgQ1NTIE1pY3JvIEFuaW1hdGlvbnM8L2gyPlxuICAgICAgPHA+VGhpcyBpcyB3aGVyZSBtb3N0IHR1dG9yaWFscyBmYWlsLiBCZWF1dGlmdWwgQ1NTIG1pY3JvIGFuaW1hdGlvbnMgdGhhdCBjYXVzZSBqYW5rIChzdHV0dGVyaW5nKSBhcmUgd29yc2UgdGhhbiBubyBhbmltYXRpb24gYXQgYWxsLiBIZXJlIGFyZSB0aGUgbm9uLW5lZ290aWFibGUgcGVyZm9ybWFuY2UgcnVsZXM6PC9wPlxuXG4gICAgICA8aDM+UnVsZSAxOiBPbmx5IEFuaW1hdGUgdHJhbnNmb3JtIGFuZCBvcGFjaXR5PC9oMz5cbiAgICAgIDxwPk1vZGVybiBicm93c2VycyB1c2UgdGhlIEdQVSB0byBjb21wb3NpdGUgbGF5ZXJzIGZvciA8Y29kZT50cmFuc2Zvcm08L2NvZGU+IGFuZCA8Y29kZT5vcGFjaXR5PC9jb2RlPi4gVGhlc2UgcHJvcGVydGllcyBkbyBub3QgdHJpZ2dlciBsYXlvdXQgcmVjYWxjdWxhdGlvbiBvciByZXBhaW50LiBFdmVyeXRoaW5nIGVsc2UgXHUyMDE0IDxjb2RlPndpZHRoPC9jb2RlPiwgPGNvZGU+aGVpZ2h0PC9jb2RlPiwgPGNvZGU+dG9wPC9jb2RlPiwgPGNvZGU+bGVmdDwvY29kZT4sIDxjb2RlPm1hcmdpbjwvY29kZT4gXHUyMDE0IGZvcmNlcyBhIGZ1bGwgbGF5b3V0IHJlZmxvdyBvbiBldmVyeSBmcmFtZSwgY2F1c2luZyA2MGZwcyB0byBkcm9wIHRvIDE1ZnBzLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+LyogXHUyNzRDIERPIE5PVCBhbmltYXRlIHRoZXNlIFx1MjAxNCBjYXVzZXMgbGF5b3V0IHRocmFzaCAqL1xuLmJhZCB7IHRyYW5zaXRpb246IHdpZHRoIDAuM3MgZWFzZTsgfVxuLmFsc28tYmFkIHsgdHJhbnNpdGlvbjogdG9wIDAuM3MgZWFzZSwgbGVmdCAwLjNzIGVhc2U7IH1cblxuLyogXHUyNzA1IERPIGFuaW1hdGUgdGhlc2UgXHUyMDE0IEdQVSBhY2NlbGVyYXRlZCAqL1xuLmdvb2QgeyB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlOyB9XG4uYWxzby1nb29kIHsgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzIGVhc2UsIHRyYW5zZm9ybSAwLjNzIGVhc2U7IH08L2NvZGU+PC9wcmU+XG5cbiAgICAgIDxoMz5SdWxlIDI6IFVzZSB3aWxsLWNoYW5nZSBTcGFyaW5nbHk8L2gzPlxuICAgICAgPHA+VGhlIDxjb2RlPndpbGwtY2hhbmdlPC9jb2RlPiBwcm9wZXJ0eSB0ZWxscyB0aGUgYnJvd3NlciB0byBwcm9tb3RlIGFuIGVsZW1lbnQgdG8gaXRzIG93biBHUFUgbGF5ZXIgPGVtPmJlZm9yZTwvZW0+IHRoZSBhbmltYXRpb24gc3RhcnRzLiBUaGlzIGVsaW1pbmF0ZXMgdGhlIGluaXRpYWwgZnJhbWUgamFuazo8L3A+XG4gICAgICA8cHJlPjxjb2RlPi5hbmltYXRlZC1lbGVtZW50IHtcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybSwgb3BhY2l0eTtcbn1cblxuLyogXHUyNkEwXHVGRTBGIEltcG9ydGFudDogUmVtb3ZlIHdpbGwtY2hhbmdlIGFmdGVyIGFuaW1hdGlvbiBlbmRzICovXG4vKiBOZXZlciBhcHBseSBpdCB0byBldmVyeSBlbGVtZW50IFx1MjAxNCBpdCB3YXN0ZXMgR1BVIG1lbW9yeSAqLzwvY29kZT48L3ByZT5cblxuICAgICAgPGgzPlJ1bGUgMzogUmVzcGVjdCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uPC9oMz5cbiAgICAgIDxwPkFwcHJveGltYXRlbHkgMzUlIG9mIHVzZXJzIGhhdmUgdmVzdGlidWxhciBkaXNvcmRlcnMgb3IgbW90aW9uIHNlbnNpdGl2aXR5LiBBbHdheXMgd3JhcCB5b3VyIENTUyBtaWNybyBhbmltYXRpb25zIGluIGEgPGEgaHJlZj1cIi9jb3Vyc2VzL2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvL2xlc3Nvbi82OWI4ZjU2ODQwMzZlMzgwOWI1MGM2NmJcIj5tZWRpYSBxdWVyeTwvYT4gdGhhdCByZXNwZWN0cyB0aGUgdXNlcidzIHN5c3RlbSBwcmVmZXJlbmNlOjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+LyogQWxsIHlvdXIgbWljcm8gYW5pbWF0aW9ucyBoZXJlLi4uICovXG4uY2FyZCB7IHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7IH1cbi5jYXJkOmhvdmVyIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC02cHgpOyB9XG5cbi8qIE92ZXJyaWRlIGZvciB1c2VycyB3aG8gcHJlZmVyIHJlZHVjZWQgbW90aW9uICovXG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSkge1xuICAuY2FyZCB7XG4gICAgdHJhbnNpdGlvbjogbm9uZTtcbiAgfVxuICAuY2FyZDpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICB9XG59PC9jb2RlPjwvcHJlPlxuICAgICAgPHA+VGhpcyBpcyBhbHNvIGEgR29vZ2xlIExpZ2h0aG91c2UgYWNjZXNzaWJpbGl0eSBjcml0ZXJpb24uIElnbm9yaW5nIGl0IHdpbGwgaHVydCB5b3VyIFNFTyBzY29yZS48L3A+XG5cbiAgICAgIDxoMj5TY3JvbGwtVHJpZ2dlcmVkIENTUyBNaWNybyBBbmltYXRpb25zIChObyBKYXZhU2NyaXB0KTwvaDI+XG4gICAgICA8cD5JbiAyMDI2LCBDU1MgaGFzIGEgbmF0aXZlIHdheSB0byB0cmlnZ2VyIG1pY3JvIGFuaW1hdGlvbnMgYmFzZWQgb24gc2Nyb2xsIHBvc2l0aW9uIHVzaW5nIDxjb2RlPkBrZXlmcmFtZXM8L2NvZGU+IGNvbWJpbmVkIHdpdGggPGNvZGU+YW5pbWF0aW9uLXRpbWVsaW5lOiBzY3JvbGwoKTwvY29kZT4gXHUyMDE0IGEgbmV3IGZlYXR1cmUgc3VwcG9ydGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnM6PC9wPlxuICAgICAgPHByZT48Y29kZT5Aa2V5ZnJhbWVzIGZhZGUtaW4tdXAge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgzMHB4KTtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbn1cblxuLyogRWxlbWVudHMgYW5pbWF0ZSBpbiBhcyB0aGV5IGVudGVyIHRoZSB2aWV3cG9ydCAqL1xuLmFuaW1hdGUtb24tc2Nyb2xsIHtcbiAgYW5pbWF0aW9uOiBmYWRlLWluLXVwIDAuNnMgZWFzZS1vdXQgYm90aDtcbiAgYW5pbWF0aW9uLXRpbWVsaW5lOiB2aWV3KCk7XG4gIGFuaW1hdGlvbi1yYW5nZTogZW50cnkgMCUgZW50cnkgMzAlO1xufTwvY29kZT48L3ByZT5cbiAgICAgIDxwPlRoaXMgaXMgYSBnYW1lLWNoYW5nZXIuIFByZXZpb3VzbHksIGRldmVsb3BlcnMgbmVlZGVkIEludGVyc2VjdGlvbiBPYnNlcnZlciArIEphdmFTY3JpcHQgdG8gYWNoaWV2ZSB0aGlzLiBOb3cgaXQgaXMgcHVyZSBDU1MuPC9wPlxuXG4gICAgICA8aDI+Q1NTIE1pY3JvIEFuaW1hdGlvbnMgQ2hlYXQgU2hlZXQ8L2gyPlxuICAgICAgPHA+SGVyZSBpcyBhIHF1aWNrLXJlZmVyZW5jZSB0YWJsZSBvZiB0aGUgbW9zdCB1c2VmdWwgQ1NTIG1pY3JvIGFuaW1hdGlvbiBwYXR0ZXJuczo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPkJ1dHRvbiBsaWZ0Ojwvc3Ryb25nPiA8Y29kZT50cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTNweCk8L2NvZGU+IG9uIDxjb2RlPjpob3ZlcjwvY29kZT4gKyBib3gtc2hhZG93IGRlZXBlbmluZzwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkJ1dHRvbiBwcmVzczo8L3N0cm9uZz4gPGNvZGU+dHJhbnNmb3JtOiB0cmFuc2xhdGVZKDFweCkgc2NhbGUoMC45OCk8L2NvZGU+IG9uIDxjb2RlPjphY3RpdmU8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q2FyZCBnbG93Ojwvc3Ryb25nPiA8Y29kZT5ib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSg5OSwxMDIsMjQxLDAuMyk8L2NvZGU+IG9uIDxjb2RlPjpob3ZlcjwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5JY29uIHNwaW46PC9zdHJvbmc+IDxjb2RlPkBrZXlmcmFtZXMgc3BpbiB7IHRvIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9PC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkZhZGUgaW46PC9zdHJvbmc+IDxjb2RlPkBrZXlmcmFtZXMgZmFkZUluIHsgZnJvbSB7IG9wYWNpdHk6IDA7IH0gdG8geyBvcGFjaXR5OiAxOyB9IH08L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+U2xpZGUgdXA6PC9zdHJvbmc+IDxjb2RlPkBrZXlmcmFtZXMgc2xpZGVVcCB7IGZyb20geyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCk7IG9wYWNpdHk6IDA7IH0gfTwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5VbmRlcmxpbmUgcmV2ZWFsOjwvc3Ryb25nPiA8Y29kZT46OmFmdGVyPC9jb2RlPiB3aXRoIDxjb2RlPnNjYWxlWCgwKSBcdTIxOTIgc2NhbGVYKDEpPC9jb2RlPiB2aWEgPGNvZGU+dHJhbnNpdGlvbjwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Ta2VsZXRvbiBzaGltbWVyOjwvc3Ryb25nPiBBbmltYXRlZCA8Y29kZT5iYWNrZ3JvdW5kLXBvc2l0aW9uPC9jb2RlPiBvbiBhIGdyYWRpZW50IGJhY2tncm91bmQ8L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPlB1dHRpbmcgSXQgQWxsIFRvZ2V0aGVyOiBBIFJlYWwtV29ybGQgQ29tcG9uZW50PC9oMj5cbiAgICAgIDxwPkhlcmUgaXMgYSBjb21wbGV0ZSwgcHJvZHVjdGlvbi1yZWFkeSBjb3Vyc2UgY2FyZCBjb21wb25lbnQgdGhhdCBjb21iaW5lcyBtdWx0aXBsZSBDU1MgbWljcm8gYW5pbWF0aW9ucyBpbiBoYXJtb255IFx1MjAxNCB0aGUga2luZCB5b3Ugc2VlIG9uIHBsYXRmb3JtcyBsaWtlIFNraWxsVmFsaXgncyA8YSBocmVmPVwiL2NvdXJzZXNcIj5mcmVlIGNvdXJzZXMgcGFnZTwvYT46PC9wPlxuICAgICAgPHByZT48Y29kZT4uY291cnNlLWNhcmQge1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm9yZGVyOiAxcHggc29saWQgI2UyZThmMDtcbiAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4wNSk7XG4gIHRyYW5zaXRpb246XG4gICAgdHJhbnNmb3JtICAgMC4zcyBjdWJpYy1iZXppZXIoMC4zNCwgMS41NiwgMC42NCwgMSksXG4gICAgYm94LXNoYWRvdyAgMC4zcyBlYXNlLFxuICAgIGJvcmRlci1jb2xvciAwLjNzIGVhc2U7XG59XG5cbi5jb3Vyc2UtY2FyZDpob3ZlciB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KSBzY2FsZSgxLjAxKTtcbiAgYm94LXNoYWRvdzogMCAyNHB4IDQ4cHggcmdiYSg3OSwgNzAsIDIyOSwgMC4xMik7XG4gIGJvcmRlci1jb2xvcjogI2E1YjRmYztcbn1cblxuLyogVGh1bWJuYWlsIHpvb20gb24gaG92ZXIgKi9cbi5jb3Vyc2UtY2FyZCAudGh1bWJuYWlsIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLmNvdXJzZS1jYXJkIC50aHVtYm5haWwgaW1nIHtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuNXMgZWFzZTtcbn1cblxuLmNvdXJzZS1jYXJkOmhvdmVyIC50aHVtYm5haWwgaW1nIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjA4KTtcbn1cblxuLyogQ1RBIGJ1dHRvbiByZXZlYWwgb24gaG92ZXIgKi9cbi5jb3Vyc2UtY2FyZCAuZW5yb2xsLWJ0biB7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMjVzIGVhc2UsIHRyYW5zZm9ybSAwLjI1cyBlYXNlO1xufVxuXG4uY291cnNlLWNhcmQ6aG92ZXIgLmVucm9sbC1idG4ge1xuICBvcGFjaXR5OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG59XG5cbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKSB7XG4gIC5jb3Vyc2UtY2FyZCxcbiAgLmNvdXJzZS1jYXJkIC50aHVtYm5haWwgaW1nLFxuICAuY291cnNlLWNhcmQgLmVucm9sbC1idG4ge1xuICAgIHRyYW5zaXRpb246IG5vbmU7XG4gICAgYW5pbWF0aW9uOiBub25lO1xuICB9XG59PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDI+V2hlcmUgdG8gTGVhcm4gQ1NTIEFuaW1hdGlvbnMgaW4gRGVwdGg8L2gyPlxuICAgICAgPHA+SWYgeW91IHdhbnQgdG8gZ28gYmV5b25kIG1pY3JvIGFuaW1hdGlvbnMgYW5kIG1hc3RlciB0aGUgZnVsbCBDU1MgdG9vbGtpdCBcdTIwMTQgaW5jbHVkaW5nIDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByby9sZXNzb24vNjliOGY1Njg0MDM2ZTM4MDliNTBjNjY5XCI+RmxleGJveDwvYT4sIDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByby9sZXNzb24vNjliOGY1Njg0MDM2ZTM4MDliNTBjNjZhXCI+Q1NTIEdyaWQ8L2E+LCByZXNwb25zaXZlIGRlc2lnbiwgYW5kIGFkdmFuY2VkIGFuaW1hdGlvbnMgXHUyMDE0IHRoZSBiZXN0IHN0YXJ0aW5nIHBvaW50IGlzIG91ciBmcmVlIDxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByb1wiPkNTUyBmb3IgQmVnaW5uZXJzOiBaZXJvIHRvIFBybyBjb3Vyc2U8L2E+LiBJdCBpcyBjb21wbGV0ZWx5IGZyZWUsIHN0cnVjdHVyZWQsIGFuZCBlbmRzIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIHRoYXQgcHJvdmVzIHlvdXIgc2tpbGxzIHRvIGVtcGxveWVycy48L3A+XG4gICAgICA8cD5Zb3Ugc2hvdWxkIGFsc28gZXhwbG9yZSBvdXIgPGEgaHJlZj1cIi9ibG9nL2Nzcy1ncmlkLXZzLWZsZXhib3gtbW9kZXJuLXdlYlwiPkNTUyBHcmlkIHZzIEZsZXhib3ggZ3VpZGU8L2E+IHRvIHVuZGVyc3RhbmQgaG93IHRvIGJ1aWxkIHRoZSBsYXlvdXRzIHRoYXQgeW91ciBDU1MgbWljcm8gYW5pbWF0aW9ucyB3aWxsIGxpdmUgaW5zaWRlLiBBbmQgaWYgeW91IHdhbnQgdG8gY29tYmluZSB0aGVzZSBhbmltYXRpb25zIHdpdGggSmF2YVNjcmlwdCBpbnRlcmFjdGl2aXR5LCBvdXIgPGEgaHJlZj1cIi9ibG9nL2phdmFzY3JpcHQtZG9tLW1hbmlwdWxhdGlvbi1zZWNyZXRzXCI+SmF2YVNjcmlwdCBET00gbWFuaXB1bGF0aW9uIGd1aWRlPC9hPiBzaG93cyB5b3UgZXhhY3RseSBob3cgdG8gdHJpZ2dlciBDU1MgYW5pbWF0aW9ucyBwcm9ncmFtbWF0aWNhbGx5LjwvcD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zIEFib3V0IENTUyBNaWNybyBBbmltYXRpb25zPC9oMj5cblxuICAgICAgPHA+PHN0cm9uZz5RMTogV2hhdCBpcyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGEgQ1NTIHRyYW5zaXRpb24gYW5kIGEgQ1NTIGFuaW1hdGlvbj88L3N0cm9uZz48YnIvPlxuICAgICAgQSA8Y29kZT50cmFuc2l0aW9uPC9jb2RlPiBhbmltYXRlcyBiZXR3ZWVuIGV4YWN0bHkgdHdvIHN0YXRlcyAoZS5nLiwgZGVmYXVsdCBcdTIxOTIgaG92ZXIpLiBBIDxjb2RlPkBrZXlmcmFtZXM8L2NvZGU+IGFuaW1hdGlvbiBjYW4gaGF2ZSBtdWx0aXBsZSBzdGVwcywgY2FuIGxvb3AsIGNhbiBhdXRvLXBsYXkgb24gcGFnZSBsb2FkLCBhbmQgZ2l2ZXMgeW91IG11Y2ggbW9yZSB0aW1pbmcgY29udHJvbC4gRm9yIHNpbXBsZSBob3ZlciBtaWNybyBhbmltYXRpb25zLCBhbHdheXMgdXNlIDxjb2RlPnRyYW5zaXRpb248L2NvZGU+LiBGb3IgY29tcGxleCwgbXVsdGktc3RlcCwgb3IgbG9vcGluZyBhbmltYXRpb25zLCB1c2UgPGNvZGU+QGtleWZyYW1lczwvY29kZT4uPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEyOiBEbyBDU1MgbWljcm8gYW5pbWF0aW9ucyBodXJ0IHdlYnNpdGUgcGVyZm9ybWFuY2U/PC9zdHJvbmc+PGJyLz5cbiAgICAgIE9ubHkgaWYgeW91IGFuaW1hdGUgdGhlIHdyb25nIHByb3BlcnRpZXMuIEFuaW1hdGluZyA8Y29kZT50cmFuc2Zvcm08L2NvZGU+IGFuZCA8Y29kZT5vcGFjaXR5PC9jb2RlPiBpcyBHUFUtYWNjZWxlcmF0ZWQgYW5kIGhhcyB6ZXJvIHBlcmZvcm1hbmNlIGNvc3QuIEFuaW1hdGluZyA8Y29kZT53aWR0aDwvY29kZT4sIDxjb2RlPmhlaWdodDwvY29kZT4sIDxjb2RlPnRvcDwvY29kZT4sIG9yIDxjb2RlPmxlZnQ8L2NvZGU+IHRyaWdnZXJzIGxheW91dCByZWNhbGN1bGF0aW9uIG9uIGV2ZXJ5IGZyYW1lIGFuZCBjYW4gc2V2ZXJlbHkgaHVydCBwZXJmb3JtYW5jZSwgZXNwZWNpYWxseSBvbiBtb2JpbGUgZGV2aWNlcy48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IFNob3VsZCBJIHVzZSBDU1MgYW5pbWF0aW9ucyBvciBKYXZhU2NyaXB0IGFuaW1hdGlvbnM/PC9zdHJvbmc+PGJyLz5cbiAgICAgIEZvciBVSSBtaWNybyBhbmltYXRpb25zIChob3ZlciBzdGF0ZXMsIGxvYWRpbmcgaW5kaWNhdG9ycywgdHJhbnNpdGlvbnMgYmV0d2VlbiBzdGF0ZXMpLCBDU1MgaXMgYWxtb3N0IGFsd2F5cyB0aGUgYmV0dGVyIGNob2ljZS4gSXQgaXMgcGFyc2VkIGRpcmVjdGx5IGJ5IHRoZSBicm93c2VyLCBydW5zIG9mZiB0aGUgbWFpbiB0aHJlYWQsIGFuZCByZXF1aXJlcyBubyBsaWJyYXJ5LiBVc2UgSmF2YVNjcmlwdCAob3IgbGlicmFyaWVzIGxpa2UgR1NBUCkgb25seSB3aGVuIHlvdSBuZWVkIHRydWx5IGNvbXBsZXggc2VxdWVuY2luZywgdXNlci1jb250cm9sbGVkIHNjcnViYmluZywgb3IgcGh5c2ljcy1iYXNlZCBhbmltYXRpb25zLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RNDogSG93IG1hbnkgQ1NTIG1pY3JvIGFuaW1hdGlvbnMgc2hvdWxkIGEgcGFnZSBoYXZlPzwvc3Ryb25nPjxici8+XG4gICAgICBRdWFsaXR5IG92ZXIgcXVhbnRpdHkuIEEgcGFnZSB3aXRoIDNcdTIwMTM1IHB1cnBvc2VmdWwgbWljcm8gYW5pbWF0aW9ucyBmZWVscyBwcmVtaXVtLiBBIHBhZ2Ugd2l0aCAyMCBjb21wZXRpbmcgYW5pbWF0aW9ucyBmZWVscyBjaGFvdGljIGFuZCBvdmVyd2hlbG1pbmcuIEVhY2ggYW5pbWF0aW9uIHNob3VsZCBzZXJ2ZSBleGFjdGx5IG9uZSBwdXJwb3NlOiBjb25maXJtIGFuIGFjdGlvbiwgaW5kaWNhdGUgc3RhdGUgY2hhbmdlLCBvciBndWlkZSB0aGUgdXNlcidzIGF0dGVudGlvbi48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTU6IEFyZSBDU1MgYW5pbWF0aW9ucyBhY2Nlc3NpYmxlPzwvc3Ryb25nPjxici8+XG4gICAgICBUaGV5IGNhbiBiZSwgaWYgeW91IGltcGxlbWVudCB0aGUgPGNvZGU+cHJlZmVycy1yZWR1Y2VkLW1vdGlvbjwvY29kZT4gbWVkaWEgcXVlcnkuIEFsd2F5cyB3cml0ZSBhIGZhbGxiYWNrIHRoYXQgZGlzYWJsZXMgb3IgcmVkdWNlcyBhbmltYXRpb24gZm9yIHVzZXJzIHdobyBoYXZlIGluZGljYXRlZCBtb3Rpb24gc2Vuc2l0aXZpdHkgaW4gdGhlaXIgT1Mgc2V0dGluZ3MuIFRoaXMgaXMgYm90aCBhbiBldGhpY2FsIHJlcXVpcmVtZW50IGFuZCBhIExpZ2h0aG91c2UgYWNjZXNzaWJpbGl0eSBjcml0ZXJpb24uPC9wPlxuXG4gICAgICA8cD5SZWFkeSB0byBidWlsZCBzdHVubmluZywgYW5pbWF0ZWQgaW50ZXJmYWNlcyBmcm9tIHRoZSBncm91bmQgdXA/IFN0YXJ0IHdpdGggdGhlIGZyZWUgPGEgaHJlZj1cIi9jb3Vyc2VzL2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvXCI+Q1NTIGZvciBCZWdpbm5lcnMgY291cnNlIG9uIFNraWxsVmFsaXg8L2E+IFx1MjAxNCBubyBmZWVzLCBubyBnYXRla2VlcGluZywganVzdCByZWFsIHNraWxscyB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS48L3A+XG4gICAgYCxcbiAgICBhdXRob3I6ICdOZWhhIFNoYXJtYScsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDMtMjlUMDk6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDQtMDVUMTg6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdNYXJjaCAyOSwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxNCBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAyMjUwLFxuICAgIGNhdGVnb3J5OiAnQ1NTICYgRGVzaWduJyxcbiAgICB0YWdzOiBbJ0NTUyBNaWNybyBBbmltYXRpb25zJywgJ0NTUyBBbmltYXRpb25zJywgJ0NTUyBUcmFuc2l0aW9ucycsICdVSSBEZXNpZ24nLCAnV2ViIERldmVsb3BtZW50JywgJ01pY3JvLUludGVyYWN0aW9ucycsICdDU1MgUGVyZm9ybWFuY2UnLCAnVVggRGVzaWduJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0NTIzNTYxNy05NDY1ZDJhNTU2OTg/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnQ1NTIG1pY3JvIGFuaW1hdGlvbnMgYW5kIGludGVyYWN0aXZlIFVJIGRlc2lnbiBwYXR0ZXJucyBvbiBzY3JlZW4nLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvY3NzLWFuaW1hdGlvbnMtbWljcm8taW50ZXJhY3Rpb25zLWd1aWRlJyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ0NTUyBmb3IgQmVnaW5uZXJzIFx1MjAxNCBaZXJvIHRvIFBybycsXG4gICAgICBzbHVnOiAnY3NzLWZvci1iZWdpbm5lcnMtbGVhcm4td2ViLXN0eWxpbmctemVyby10by1wcm8nLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXN0ZXIgQ1NTIGFuaW1hdGlvbnMsIEZsZXhib3gsIEdyaWQgYW5kIHRyYW5zaXRpb25zIHdpdGggYSBmcmVlIHZlcmlmaWFibGUgY2VydGlmaWNhdGUuJ1xuICAgIH1cbiAgfSxcblxuICB7XG4gICAgaWQ6ICdmcmVlbGFuY2luZy1hcy1kZXZlbG9wZXItYmVnaW5uZXJzLWd1aWRlJyxcbiAgICB0aXRsZTogJ0hvdyB0byBTdGFydCBGcmVlbGFuY2luZyBhcyBhIERldmVsb3BlciBpbiAyMDI2IChFdmVuIGFzIGEgQmVnaW5uZXIpJyxcbiAgICBtZXRhVGl0bGU6ICdIb3cgdG8gU3RhcnQgRnJlZWxhbmNpbmcgYXMgYSBEZXZlbG9wZXIgaW4gMjAyNiBcdTIwMTQgQmVnaW5uZXIgR3VpZGUgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdBIHByYWN0aWNhbCBndWlkZSB0byBzdGFydGluZyB5b3VyIGZyZWVsYW5jaW5nIGNhcmVlciBhcyBhIHdlYiBkZXZlbG9wZXIgaW4gMjAyNi4gTGVhcm4gaG93IHRvIGZpbmQgeW91ciBmaXJzdCBjbGllbnQsIHNldCB5b3VyIHJhdGVzLCBhbmQgYnVpbGQgYSBwb3J0Zm9saW8gXHUyMDE0IGV2ZW4gaWYgeW91IGFyZSBqdXN0IHN0YXJ0aW5nIG91dC4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnZnJlZWxhbmNpbmcgZm9yIGRldmVsb3BlcnMgMjAyNicsXG4gICAgICAnaG93IHRvIHN0YXJ0IGZyZWVsYW5jaW5nIGJlZ2lubmVyJyxcbiAgICAgICd3ZWIgZGV2ZWxvcGVyIGZyZWVsYW5jZSBndWlkZScsXG4gICAgICAnZmluZCBmaXJzdCBjbGllbnQgZnJlZWxhbmNlcicsXG4gICAgICAnZnJlZWxhbmNlIHdlYiBkZXZlbG9wbWVudCBJbmRpYScsXG4gICAgICAndXB3b3JrIGZpdmVyciBkZXZlbG9wZXIgdGlwcycsXG4gICAgICAnYnVpbGQgcG9ydGZvbGlvIGZvciBmcmVlbGFuY2luZycsXG4gICAgICAnZGV2ZWxvcGVyIHNpZGUgaW5jb21lJ1xuICAgIF0sXG4gICAgZXhjZXJwdDogJ1lvdSBkbyBub3QgbmVlZCB5ZWFycyBvZiBleHBlcmllbmNlIHRvIHN0YXJ0IGZyZWVsYW5jaW5nLiBZb3UgbmVlZCBvbmUgZ29vZCBwcm9qZWN0IGFuZCBvbmUgaGFwcHkgY2xpZW50LiBIZXJlIGlzIHRoZSBleGFjdCBibHVlcHJpbnQgdG8gZ2V0IHlvdXIgZmlyc3QgcGFpZCBwcm9qZWN0IGFzIGEgZGV2ZWxvcGVyIGluIDIwMjYuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIEZyZWVsYW5jZSBEZXZlbG9wZXIgT3Bwb3J0dW5pdHkgaW4gMjAyNjwvaDI+XG4gICAgICA8cD5UaGUgZ2xvYmFsIGRlbWFuZCBmb3Igd2ViIGRldmVsb3BtZW50IGZyZWVsYW5jZXJzIGhhcyBuZXZlciBiZWVuIGhpZ2hlci4gU21hbGwgYnVzaW5lc3NlcywgY29udGVudCBjcmVhdG9ycywgbG9jYWwgc2hvcHMsIGFuZCBzdGFydHVwcyBhbGwgbmVlZCB3ZWJzaXRlcy4gTW9zdCBvZiB0aGVtIGNhbm5vdCBhZmZvcmQgYSBmdWxsLXRpbWUgZGV2ZWxvcGVyIFx1MjAxNCBidXQgdGhleSBjYW4gYWJzb2x1dGVseSBhZmZvcmQgYSBza2lsbGVkIGZyZWVsYW5jZXIuPC9wPlxuXG4gICAgICA8aDM+U3RlcCAxOiBCdWlsZCBhIFBvcnRmb2xpbyB3aXRoIDMgUHJvamVjdHM8L2gzPlxuICAgICAgPHA+WW91IGRvIG5vdCBuZWVkIDEwIHByb2plY3RzLiBZb3UgbmVlZCAzIGV4Y2VsbGVudCBvbmVzLiBBIHBlcnNvbmFsIHBvcnRmb2xpbyBzaXRlLCBhIGJ1c2luZXNzIGxhbmRpbmcgcGFnZSwgYW5kIG9uZSBpbnRlcmFjdGl2ZSBhcHAuIEhvc3QgdGhlbSBhbGwgb24gR2l0SHViIFBhZ2VzIG9yIE5ldGxpZnkgZm9yIGZyZWUuIFRoaXMgaXMgeW91ciBwcm9vZiBvZiBhYmlsaXR5LjwvcD5cblxuICAgICAgPGgzPlN0ZXAgMjogR2V0IGEgVmVyaWZpYWJsZSBDZXJ0aWZpY2F0ZTwvaDM+XG4gICAgICA8cD5BIGNlcnRpZmljYXRlIGZyb20gYSByZWNvZ25pc2VkIHBsYXRmb3JtIHNpZ25hbHMgY3JlZGliaWxpdHkuIFdoZW4gcGl0Y2hpbmcgdG8gYSBjbGllbnQgb24gVXB3b3JrIG9yIEZpdmVyciwgYXR0YWNoaW5nIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZSBsaW5rIGZyb20gPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U2tpbGxWYWxpeDwvYT4gZ2l2ZXMgdGhlbSBpbW1lZGlhdGUgY29uZmlkZW5jZSB0aGF0IHlvdSBwYXNzZWQgYSByZWFsIGV4YW0gXHUyMDE0IG5vdCBqdXN0IHdhdGNoZWQgWW91VHViZSB0dXRvcmlhbHMuPC9wPlxuXG4gICAgICA8aDM+U3RlcCAzOiBQcmljaW5nIFlvdXIgRmlyc3QgUHJvamVjdHM8L2gzPlxuICAgICAgPHA+U3RhcnQgYXQgXHUyMEI5NSwwMDBcdTIwMTNcdTIwQjkxNSwwMDAgKCQ2MFx1MjAxMyQxODApIHBlciBwcm9qZWN0IGZvciBzaW1wbGUgbGFuZGluZyBwYWdlcy4gQXMgeW91IGFjY3VtdWxhdGUgcmV2aWV3cyBhbmQgdGVzdGltb25pYWxzLCByYWlzZSB5b3VyIHJhdGVzIGV2ZXJ5IDMgbW9udGhzLiBZb3VyIHNraWxscyB3aWxsIGltcHJvdmUgZmFzdGVyIHRoYW4geW91IHRoaW5rLjwvcD5cblxuICAgICAgPGgzPlN0ZXAgNDogV2hlcmUgdG8gRmluZCBDbGllbnRzPC9oMz5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+UGxhdGZvcm1zOjwvc3Ryb25nPiBVcHdvcmssIEZpdmVyciwgVG9wdGFsIChhcyB5b3UgZ3Jvdyk8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Mb2NhbCBidXNpbmVzc2VzOjwvc3Ryb25nPiBSZXN0YXVyYW50cywgY2xpbmljcywgYm91dGlxdWVzIG5lYXIgeW91IHdobyBsYWNrIGEgd2Vic2l0ZTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkxpbmtlZEluOjwvc3Ryb25nPiBQb3N0IHlvdXIgcHJvamVjdHMgd2Vla2x5IGFuZCBlbmdhZ2Ugd2l0aCBidXNpbmVzcyBvd25lcnM8L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPHA+VGhlIHNraWxscyB5b3UgbmVlZCB0byBzdGFydCBhcmUgYXZhaWxhYmxlIGZyZWUgdG9kYXkgYXQgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2NvdXJzZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5Ta2lsbFZhbGl4IENvdXJzZXM8L2E+LjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ1JhaHVsIE1laHRhJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wMy0zMFQwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wMy0zMFQwOTowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ01hcmNoIDMwLCAyMDI2JyxcbiAgICByZWFkVGltZTogJzcgbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogNDUwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnRnJlZWxhbmNpbmcnLCAnV2ViIERldmVsb3BtZW50JywgJ0NhcmVlcicsICdCZWdpbm5lcnMnLCAnSW5jb21lJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxNjMyMTMxODQyMy1mMDZmODVlNTA0YjM/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnRnJlZWxhbmNlciB3b3JraW5nIHJlbW90ZWx5IG9uIGxhcHRvcCBhdCBhIGNvZmZlZSBzaG9wJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL2ZyZWVsYW5jaW5nLWFzLWRldmVsb3Blci1iZWdpbm5lcnMtZ3VpZGUnLFxuICAgIHJlbGF0ZWRDb3Vyc2U6IHtcbiAgICAgIHRpdGxlOiAnVWx0aW1hdGUgSmF2YVNjcmlwdCBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0J1aWxkIHRoZSBKYXZhU2NyaXB0IHNraWxscyBldmVyeSBjbGllbnQgZXhwZWN0cyBcdTIwMTQgZnJlZSB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuXG4gIHtcbiAgICBpZDogJ2RldmVsb3Blci1yZXN1bWUtcG9ydGZvbGlvLXRpcHMtMjAyNicsXG4gICAgdGl0bGU6ICc3IFRoaW5ncyBFdmVyeSBEZXZlbG9wZXIgUmVzdW1lIE11c3QgSGF2ZSBpbiAyMDI2IChXaXRoIEV4YW1wbGVzKScsXG4gICAgbWV0YVRpdGxlOiAnNyBUaGluZ3MgRXZlcnkgRGV2ZWxvcGVyIFJlc3VtZSBNdXN0IEhhdmUgaW4gMjAyNiB8IFNraWxsVmFsaXgnLFxuICAgIG1ldGFEZXNjcmlwdGlvbjogJ1N0cnVnZ2xpbmcgdG8gZ2V0IGludGVydmlld3MgYXMgYSBkZXZlbG9wZXI/IFlvdXIgcmVzdW1lIG1pZ2h0IGJlIHRoZSBwcm9ibGVtLiBMZWFybiB0aGUgNyBlc3NlbnRpYWwgZWxlbWVudHMgZXZlcnkgZGV2ZWxvcGVyIENWIG5lZWRzIGluIDIwMjYgdG8gZ2V0IG5vdGljZWQgYnkgcmVjcnVpdGVycy4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnZGV2ZWxvcGVyIHJlc3VtZSB0aXBzIDIwMjYnLFxuICAgICAgJ3dlYiBkZXZlbG9wZXIgQ1YgZ3VpZGUnLFxuICAgICAgJ3Byb2dyYW1tZXIgcmVzdW1lIGV4YW1wbGVzJyxcbiAgICAgICdkZXZlbG9wZXIgcG9ydGZvbGlvIHRpcHMnLFxuICAgICAgJ3RlY2ggcmVzdW1lIEluZGlhJyxcbiAgICAgICdnZXQgZGV2ZWxvcGVyIGpvYiAyMDI2JyxcbiAgICAgICdyZXN1bWUgZm9yIGZyZXNoZXJzIHNvZnR3YXJlIGRldmVsb3BlcicsXG4gICAgICAncHJvZ3JhbW1lciBDViBubyBleHBlcmllbmNlJ1xuICAgIF0sXG4gICAgZXhjZXJwdDogJ01vc3QgZGV2ZWxvcGVyIHJlc3VtZXMgZmFpbCB3aXRoaW4gdGhlIGZpcnN0IDYgc2Vjb25kcyBvZiByZXZpZXcuIEZpbmQgb3V0IHRoZSA3IGNyaXRpY2FsIGVsZW1lbnRzIHRoYXQgc2VwYXJhdGUgQ1ZzIHRoYXQgZ2V0IGludGVydmlld3MgZnJvbSB0aG9zZSB0aGF0IGdldCBpZ25vcmVkIFx1MjAxNCBldmVuIGZvciBmcmVzaCBncmFkdWF0ZXMuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+VGhlIDYtU2Vjb25kIFJlc3VtZSBUZXN0PC9oMj5cbiAgICAgIDxwPlJlY3J1aXRlcnMgc3BlbmQgYW4gYXZlcmFnZSBvZiA2IHNlY29uZHMgc2Nhbm5pbmcgYSByZXN1bWUgYmVmb3JlIGRlY2lkaW5nIHdoZXRoZXIgdG8gcmVhZCBpdCBmdXJ0aGVyLiBUaGF0IG1lYW5zIHlvdXIgbW9zdCBpbXBvcnRhbnQgaW5mb3JtYXRpb24gbXVzdCBiZSBpbW1lZGlhdGVseSB2aXNpYmxlLCBzY2FubmFibGUsIGFuZCBjb21wZWxsaW5nLjwvcD5cblxuICAgICAgPGgzPjEuIEEgR2l0SHViIFByb2ZpbGUgTGluayAoTm90IE9wdGlvbmFsIGluIDIwMjYpPC9oMz5cbiAgICAgIDxwPkEgR2l0SHViIHByb2ZpbGUgd2l0aCByZWd1bGFyIGNvbW1pdHMgaXMgd29ydGggbW9yZSB0aGFuIGEgbGlzdCBvZiBza2lsbHMuIEl0IHNob3dzIHRoYXQgeW91IGJ1aWxkIHRoaW5ncywgdGhhdCB5b3UgY2FyZSwgYW5kIHRoYXQgeW91IHdyaXRlIHJlYWwgY29kZS4gSW5jbHVkZSB5b3VyIDMgYmVzdCByZXBvc2l0b3JpZXMgd2l0aCBjbGVhciBSRUFETUUgZmlsZXMuPC9wPlxuXG4gICAgICA8aDM+Mi4gVmVyaWZpYWJsZSBDZXJ0aWZpY2F0ZXMsIE5vdCBKdXN0IFwiQ29tcGxldGVkXCIgQ2xhaW1zPC9oMz5cbiAgICAgIDxwPkFueW9uZSBjYW4gd3JpdGUgXCJDb21wbGV0ZWQgSFRNTCBDb3Vyc2VcIiBvbiBhIHJlc3VtZS4gQSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIHdpdGggYSB1bmlxdWUgSUQgdGhhdCBhIHJlY3J1aXRlciBjYW4gYWN0dWFsbHkgY2hlY2sgaXMgYSBjb21wbGV0ZWx5IGRpZmZlcmVudCBzaWduYWwuIENlcnRpZmljYXRlcyBmcm9tIHBsYXRmb3JtcyB3aXRoIHJlYWwgZXhhbXMgXHUyMDE0IGxpa2UgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U2tpbGxWYWxpeDwvYT4gXHUyMDE0IHByb3ZpZGUgdGhhdCB2ZXJpZmljYXRpb24gbGluayBpbnN0YW50bHkuPC9wPlxuXG4gICAgICA8aDM+My4gUXVhbnRpZmllZCBQcm9qZWN0cywgTm90IFZhZ3VlIERlc2NyaXB0aW9uczwvaDM+XG4gICAgICA8cD5CYWQ6IFwiQnVpbHQgYSBwb3J0Zm9saW8gd2Vic2l0ZS5cIiBHb29kOiBcIkJ1aWx0IGEgcmVzcG9uc2l2ZSBwb3J0Zm9saW8gc2l0ZSB1c2luZyBIVE1MNSAmIENTUyBHcmlkLCB3aXRoIDk1KyBMaWdodGhvdXNlIHBlcmZvcm1hbmNlIHNjb3JlLCBkZXBsb3llZCBvbiBOZXRsaWZ5LlwiIE51bWJlcnMgYW5kIHNwZWNpZmljcyB0ZWxsIGEgc3Rvcnkgc2tpbGxzIGxpc3RzIGNhbm5vdC48L3A+XG5cbiAgICAgIDxoMz40LiBBIFNraWxscyBTZWN0aW9uIE9yZGVyZWQgYnkgUHJvZmljaWVuY3k8L2gzPlxuICAgICAgPHA+TGlzdCBsYW5ndWFnZXMgYW5kIHRvb2xzIHlvdSBhcmUgY29uZmlkZW50IGJlaW5nIHRlc3RlZCBvbi4gUmVjcnVpdGVycyB3aWxsIGFzayB5b3UgYWJvdXQgYW55dGhpbmcgeW91IGxpc3QuIE9ubHkgaW5jbHVkZSB3aGF0IHlvdSBjYW4gZGlzY3VzcyBpbiBkZXB0aC48L3A+XG5cbiAgICAgIDxoMz41LiBBIE9uZS1MaW5lIExpbmtlZEluIFByb2ZpbGUgVVJMPC9oMz5cbiAgICAgIDxoMz42LiBBIENsZWFuLCBTaW5nbGUtQ29sdW1uIExheW91dCAoTm8gR3JhcGhpY3MsIE5vIFRhYmxlcyk8L2gzPlxuICAgICAgPGgzPjcuIEEgVGFpbG9yZWQgU3VtbWFyeSwgTm90IGEgR2VuZXJpYyBPYmplY3RpdmU8L2gzPlxuICAgICAgPHA+V3JpdGUgMlx1MjAxMzMgc2VudGVuY2VzIHRoYXQgc2F5IGV4YWN0bHkgd2hhdCBraW5kIG9mIHJvbGUgeW91IHdhbnQgYW5kIHdoYXQgdW5pcXVlIHZhbHVlIHlvdSBicmluZy4gVGhpcyBpcyB5b3VyIDYtc2Vjb25kIGhvb2suPC9wPlxuXG4gICAgICA8cD5CdWlsZCB0aGUgc2tpbGxzIHRoYXQgZmlsbCB5b3VyIHJlc3VtZSBhdCA8YSBocmVmPVwiaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vY291cnNlc1wiIHRhcmdldD1cIl9ibGFua1wiPlNraWxsVmFsaXg8L2E+IFx1MjAxNCBjb21wbGV0ZWx5IGZyZWUgd2l0aCBjZXJ0aWZpZWQgZXhhbXMuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnUHJpeWEgU2hhcm1hJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wNC0wMVQwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wMVQwOTowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ0FwcmlsIDEsIDIwMjYnLFxuICAgIHJlYWRUaW1lOiAnNiBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiA0MjAsXG4gICAgY2F0ZWdvcnk6ICdDYXJlZXIgJiBJbmR1c3RyeScsXG4gICAgdGFnczogWydSZXN1bWUgVGlwcycsICdKb2IgU2VhcmNoJywgJ0RldmVsb3BlciBDYXJlZXInLCAnUG9ydGZvbGlvJywgJ0ZyZXNoZXJzJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU4NjI4MTM4MDM0OS02MzI1MzFkYjdlZDQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnRGV2ZWxvcGVyIHJldmlld2luZyByZXN1bWUgYW5kIHBvcnRmb2xpbyBvbiBkZXNrJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL2RldmVsb3Blci1yZXN1bWUtcG9ydGZvbGlvLXRpcHMtMjAyNicsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdVbHRpbWF0ZSBKYXZhU2NyaXB0IE1hc3RlcmNsYXNzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1qYXZhc2NyaXB0LW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWRkIEpTIHRvIHlvdXIgcmVzdW1lIHdpdGggY29uZmlkZW5jZSBcdTIwMTQgcGFzcyB0aGUgZXhhbSBhbmQgZWFybiBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUgZm9yIGZyZWUuJ1xuICAgIH1cbiAgfSxcblxuICB7XG4gICAgaWQ6ICdhaS10b29scy1ldmVyeS1kZXZlbG9wZXItc2hvdWxkLXVzZS0yMDI2JyxcbiAgICB0aXRsZTogJzEwIEFJIFRvb2xzIEV2ZXJ5IERldmVsb3BlciBNdXN0IFVzZSBpbiAyMDI2IHRvIENvZGUgRmFzdGVyJyxcbiAgICBtZXRhVGl0bGU6ICcxMCBBSSBUb29scyBFdmVyeSBEZXZlbG9wZXIgTXVzdCBVc2UgaW4gMjAyNiB8IFNraWxsVmFsaXgnLFxuICAgIG1ldGFEZXNjcmlwdGlvbjogJ0Rpc2NvdmVyIHRoZSB0b3AgMTAgQUktcG93ZXJlZCBkZXZlbG9wZXIgdG9vbHMgaW4gMjAyNiB0aGF0IHdpbGwgc3VwZXJjaGFyZ2UgeW91ciBwcm9kdWN0aXZpdHkgXHUyMDE0IGZyb20gQUkgY29kZSBjb21wbGV0aW9uIHRvIGF1dG9tYXRlZCB0ZXN0aW5nLiBTdGF5IGFoZWFkIG9mIHRoZSBjdXJ2ZS4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnQUkgdG9vbHMgZm9yIGRldmVsb3BlcnMgMjAyNicsXG4gICAgICAnYmVzdCBBSSBjb2RpbmcgdG9vbHMnLFxuICAgICAgJ0dpdEh1YiBDb3BpbG90IGFsdGVybmF0aXZlcycsXG4gICAgICAnQUkgZm9yIHdlYiBkZXZlbG9wbWVudCcsXG4gICAgICAnZGV2ZWxvcGVyIHByb2R1Y3Rpdml0eSBBSScsXG4gICAgICAnQUkgY29kZSByZXZpZXcgdG9vbHMnLFxuICAgICAgJ21hY2hpbmUgbGVhcm5pbmcgdG9vbHMgcHJvZ3JhbW1lcnMnLFxuICAgICAgJ0NoYXRHUFQgZm9yIGRldmVsb3BlcnMnXG4gICAgXSxcbiAgICBleGNlcnB0OiAnQUkgaXMgbm90IHJlcGxhY2luZyBkZXZlbG9wZXJzIFx1MjAxNCBidXQgZGV2ZWxvcGVycyB3aG8gdXNlIEFJIGFyZSByZXBsYWNpbmcgdGhvc2Ugd2hvIGRvIG5vdC4gSGVyZSBhcmUgdGhlIDEwIEFJIHRvb2xzIGluIDIwMjYgdGhhdCB3aWxsIG1ha2UgeW91IGNvZGUgdHdpY2UgYXMgZmFzdCB3aXRoIGhhbGYgdGhlIGZydXN0cmF0aW9uLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPlRoZSBBSS1BdWdtZW50ZWQgRGV2ZWxvcGVyIGluIDIwMjY8L2gyPlxuICAgICAgPHA+VGhlIGJpZ2dlc3QgcHJvZHVjdGl2aXR5IHNoaWZ0IGluIHNvZnR3YXJlIGRldmVsb3BtZW50IHJpZ2h0IG5vdyBpcyBub3QgYSBuZXcgZnJhbWV3b3JrIG9yIGEgbmV3IGxhbmd1YWdlLiBJdCBpcyBBSS1wb3dlcmVkIHRvb2xpbmcuIERldmVsb3BlcnMgd2hvIGludGVncmF0ZSB0aGVzZSB0b29scyBpbnRvIHRoZWlyIHdvcmtmbG93IGFyZSBkcmFtYXRpY2FsbHkgb3V0cGVyZm9ybWluZyB0aG9zZSB3aG8gZG8gbm90LjwvcD5cblxuICAgICAgPGgzPjEuIEdpdEh1YiBDb3BpbG90IFx1MjAxNCBBSSBQYWlyIFByb2dyYW1tZXI8L2gzPlxuICAgICAgPHA+Q29waWxvdCBhdXRvY29tcGxldGVzIGVudGlyZSBmdW5jdGlvbnMgYXMgeW91IHR5cGUuIEl0IHJlYWRzIHRoZSBjb250ZXh0IG9mIHlvdXIgZmlsZSBhbmQgc3VnZ2VzdHMgdGhlIG5leHQgbG9naWNhbCBibG9jayBvZiBjb2RlLiBUcmVhdCBpdCBhcyBhIGZhc3QsIHRpcmVsZXNzIGp1bmlvciBkZXZlbG9wZXIgd2hvIHN1Z2dlc3RzLCB3aGlsZSB5b3UgcmV2aWV3IGFuZCBkZWNpZGUuPC9wPlxuXG4gICAgICA8aDM+Mi4gQ3Vyc29yIFx1MjAxNCBBSS1OYXRpdmUgQ29kZSBFZGl0b3I8L2gzPlxuICAgICAgPHA+QSBmb3JrIG9mIFZTIENvZGUgd2l0aCBkZWVwIEFJIGludGVncmF0aW9uLiBZb3UgY2FuIHVzZSBuYXR1cmFsIGxhbmd1YWdlIGNvbW1hbmRzIHRvIHJlZmFjdG9yIGNvZGUsIGV4cGxhaW4gZXJyb3IgbWVzc2FnZXMsIGFuZCBldmVuIGdlbmVyYXRlIGNvbXBsZXRlIGNvbXBvbmVudHMgZnJvbSBhIGRlc2NyaXB0aW9uLjwvcD5cblxuICAgICAgPGgzPjMuIFRhYm5pbmUgXHUyMDE0IFByaXZhY3ktRmlyc3QgQUkgQ29tcGxldGlvbjwvaDM+XG4gICAgICA8cD5Gb3IgZGV2ZWxvcGVycyBvciB0ZWFtcyB3aG8gY2Fubm90IHNlbmQgY29kZSB0byBleHRlcm5hbCBzZXJ2ZXJzIChoZWFsdGhjYXJlLCBmaW50ZWNoKSwgVGFibmluZSBydW5zIGVudGlyZWx5IGxvY2FsbHkuIEVudGVycHJpc2UtZ3JhZGUgQUkgY29tcGxldGlvbiB3aXRob3V0IGRhdGEgZXhwb3N1cmUuPC9wPlxuXG4gICAgICA8aDM+NC4gQ2hhdEdQVCAvIENsYXVkZSBmb3IgRGVidWdnaW5nPC9oMz5cbiAgICAgIDxwPlBhc3RlIGEgY29uZnVzaW5nIGVycm9yIHN0YWNrIHRyYWNlIGFuZCBhc2sgQUkgdG8gZXhwbGFpbiBpdC4gVGhlIGV4cGxhbmF0aW9uIHF1YWxpdHkgaW4gMjAyNiBpcyByZW1hcmthYmxlIFx1MjAxNCBvZnRlbiBiZXR0ZXIgdGhhbiBTdGFjayBPdmVyZmxvdyBmb3IgdW5jb21tb24gZWRnZSBjYXNlcy48L3A+XG5cbiAgICAgIDxoMz41XHUyMDEzMTAuIEhvbm91cmFibGUgTWVudGlvbnM8L2gzPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Db2RlaXVtPC9zdHJvbmc+IFx1MjAxNCBGcmVlIEdpdEh1YiBDb3BpbG90IGFsdGVybmF0aXZlPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UGllY2VzLmFwcDwvc3Ryb25nPiBcdTIwMTQgQUktcG93ZXJlZCBjb2RlIHNuaXBwZXQgbWFuYWdlcjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPldhcnA8L3N0cm9uZz4gXHUyMDE0IEFJIHRlcm1pbmFsIHdpdGggbmF0dXJhbCBsYW5ndWFnZSBjb21tYW5kczwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlZlcmNlbCB2MDwvc3Ryb25nPiBcdTIwMTQgR2VuZXJhdGUgUmVhY3QgVUkgY29tcG9uZW50cyBmcm9tIHRleHQgcHJvbXB0czwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPk1pbnRsaWZ5PC9zdHJvbmc+IFx1MjAxNCBBdXRvLWdlbmVyYXRlIGNvZGUgZG9jdW1lbnRhdGlvbjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlNueWs8L3N0cm9uZz4gXHUyMDE0IEFJLXBvd2VyZWQgc2VjdXJpdHkgdnVsbmVyYWJpbGl0eSBzY2FubmVyPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxwPlVuZGVyc3RhbmRpbmcgaG93IEFJIGFuZCBNYWNoaW5lIExlYXJuaW5nIHdvcmsgdW5kZXIgdGhlIGhvb2QgbWFrZXMgeW91IGEgc2lnbmlmaWNhbnRseSBiZXR0ZXIgdXNlciBvZiB0aGVzZSB0b29scy4gRXhwbG9yZSB0aGUgZnJlZSA8YSBocmVmPVwiaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vY291cnNlcy9iYXNpY3Mtb2YtYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UtYmVnaW5uZXJzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QUkgJiBNYWNoaW5lIExlYXJuaW5nIEZ1bmRhbWVudGFsczwvYT4gY291cnNlIG9uIFNraWxsVmFsaXguPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnQXJqdW4gTWVodGEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTAyVDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTAyVDA5OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgMiwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICc3IG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDQ2MCxcbiAgICBjYXRlZ29yeTogJ0FJICYgRGF0YSBTY2llbmNlJyxcbiAgICB0YWdzOiBbJ0FJIFRvb2xzJywgJ0RldmVsb3BlciBQcm9kdWN0aXZpdHknLCAnR2l0SHViIENvcGlsb3QnLCAnTWFjaGluZSBMZWFybmluZycsICdUZWNobm9sb2d5IDIwMjYnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjc3NDQyMTM1NzAzLTE3ODdlZWE1Y2UwMT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdBSSBjb2RlIGdlbmVyYXRpb24gaW50ZXJmYWNlIG9uIGEgZGV2ZWxvcGVyIHNjcmVlbicsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9haS10b29scy1ldmVyeS1kZXZlbG9wZXItc2hvdWxkLXVzZS0yMDI2JyxcbnJlbGF0ZWRDb3Vyc2U6IHtcbiAgICAgIHRpdGxlOiAnQUkgJiBNYWNoaW5lIExlYXJuaW5nIEZ1bmRhbWVudGFscycsXG4gICAgICBzbHVnOiAnYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVycycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VuZGVyc3RhbmQgdGhlIEFJIHBvd2VyaW5nIHRoZXNlIHRvb2xzIFx1MjAxNCBsZWFybiBmb3IgZnJlZSB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuXG4gIHtcbiAgICBpZDogJ2hvdy10by1ob3N0LWhhY2thdGhvbi1pbi1pbmRpYS0yMDI2JyxcbiAgICB0aXRsZTogJ0hvdyB0byBIb3N0IGEgSGFja2F0aG9uIGluIEluZGlhIGluIDIwMjY6IFRoZSBDb21wbGV0ZSBHdWlkZScsXG4gICAgbWV0YVRpdGxlOiAnSG93IHRvIEhvc3QgYSBIYWNrYXRob24gaW4gSW5kaWEgaW4gMjAyNiBcdTIwMTQgQ29tcGxldGUgR3VpZGUgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdQbGFubmluZyB0byBob3N0IGEgaGFja2F0aG9uIGluIEluZGlhPyBUaGlzIGNvbXBsZXRlIDIwMjYgZ3VpZGUgY292ZXJzIGV2ZXJ5dGhpbmcgXHUyMDE0IGZyb20gdGVhbSByZWdpc3RyYXRpb24gYW5kIHBheW1lbnQgY29sbGVjdGlvbiB0byBzdWJtaXNzaW9uIG1hbmFnZW1lbnQgYW5kIGNlcnRpZmljYXRpb24uIE5vIEdvb2dsZSBGb3JtcyBuZWVkZWQuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ2hvdyB0byBob3N0IGEgaGFja2F0aG9uIGluIEluZGlhJyxcbiAgICAgICdoYWNrYXRob24gaG9zdCBJbmRpYScsXG4gICAgICAnb3JnYW5pemUgaGFja2F0aG9uIG9ubGluZSBJbmRpYScsXG4gICAgICAnaGFja2F0aG9uIHBsYXRmb3JtIEluZGlhIDIwMjYnLFxuICAgICAgJ2hvc3QgY29sbGVnZSBoYWNrYXRob24nLFxuICAgICAgJ2hhY2thdGhvbiBtYW5hZ2VtZW50IHBsYXRmb3JtJyxcbiAgICAgICdvbmxpbmUgaGFja2F0aG9uIEluZGlhJyxcbiAgICAgICdoYWNrYXRob24gcmVnaXN0cmF0aW9uIHBsYXRmb3JtJyxcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdIb3N0aW5nIGEgaGFja2F0aG9uIGluIEluZGlhIHVzZWQgdG8gbWVhbiBjaGFvdGljIEdvb2dsZSBGb3JtcywgbWFudWFsIHBheW1lbnQgdHJhY2tpbmcsIGFuZCBXaGF0c0FwcCBncm91cCBwYW5kZW1vbml1bS4gTm90IGFueW1vcmUuIEhlcmUgaXMgaG93IHRvIHJ1biBhIHByb2Zlc3Npb25hbCwgZnVsbHktYXV0b21hdGVkIGhhY2thdGhvbiBlbmQtdG8tZW5kLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPlRoZSBQcm9ibGVtIHdpdGggXCJUcmFkaXRpb25hbFwiIEhhY2thdGhvbiBPcmdhbml6aW5nIGluIEluZGlhPC9oMj5cbiAgICAgIDxwPklmIHlvdSBoYXZlIGV2ZXIgdHJpZWQgdG8gb3JnYW5pemUgYSBoYWNrYXRob24gXHUyMDE0IHdoZXRoZXIgZm9yIHlvdXIgY29sbGVnZSBmZXN0LCBhIGNvcnBvcmF0ZSBpbm5vdmF0aW9uIGRyaXZlLCBvciBhIGNvbW11bml0eSBldmVudCBcdTIwMTQgeW91IGtub3cgdGhlIHBhaW4uIEl0IHN0YXJ0cyB3aXRoIGEgR29vZ2xlIEZvcm0uIFRoZW4gc29tZW9uZSBidWlsZHMgYSBXaGF0c0FwcCBncm91cC4gVGhlbiBFeGNlbCBzaGVldHMgZm9yIHRlYW0gdHJhY2tpbmcuIFRoZW4gYSBVUEkgUVIgY29kZSBmb3IgcGF5bWVudHMuIFRoZW4gY2hhc2luZyAyMDAgcGFydGljaXBhbnRzIGZvciB0aGVpciBzdWJtaXNzaW9uIGxpbmtzIHRoZSBuaWdodCBiZWZvcmUgdGhlIGRlYWRsaW5lLjwvcD5cbiAgICAgIDxwPlRoZSByZXN1bHQ/IE9yZ2FuaXplcnMgYnVybiBvdXQuIFBhcnRpY2lwYW50cyBnZXQgY29uZnVzZWQuIEFuZCB0aGUgaGFja2F0aG9uJ3MgcmVwdXRhdGlvbiBzdWZmZXJzIGJlZm9yZSBpdCBldmVuIGJlZ2lucy48L3A+XG5cbiAgICAgIDxoMz5XaGF0IERvZXMgYSBNb2Rlcm4gSGFja2F0aG9uIFBsYXRmb3JtIERvPzwvaDM+XG4gICAgICA8cD5BIGRlZGljYXRlZCBoYWNrYXRob24gaG9zdGluZyBwbGF0Zm9ybSBlbGltaW5hdGVzIGV2ZXJ5IG1hbnVhbCBzdGVwIGluIHRoZSBwcm9jZXNzLiBIZXJlIGlzIHdoYXQgdGhlIHdvcmtmbG93IGxvb2tzIGxpa2Ugb24gYSBwdXJwb3NlLWJ1aWx0IHBsYXRmb3JtIGxpa2UgPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2hvc3RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5Ta2lsbFZhbGl4PC9hPjo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPlRlYW0gUmVnaXN0cmF0aW9uOjwvc3Ryb25nPiBQYXJ0aWNpcGFudHMgc2lnbiB1cCwgY3JlYXRlIHRlYW1zLCBhbmQgaW52aXRlIG1lbWJlcnMgXHUyMDE0IGFsbCBtYW5hZ2VkIGluc2lkZSBhIHNlY3VyZSBkYXNoYm9hcmQuIE5vIG1vcmUgRXhjZWwuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+QnVpbHQtaW4gUGF5bWVudDo8L3N0cm9uZz4gSWYgeW91ciBoYWNrYXRob24gaGFzIGEgcmVnaXN0cmF0aW9uIGZlZSwgcGFydGljaXBhbnRzIHBheSBkaXJlY3RseSB0aHJvdWdoIHRoZSBwbGF0Zm9ybS4gWW91IHJlY2VpdmUgSU5SIHBheW1lbnRzIHdpdGhvdXQgc2hhcmluZyBhIHBlcnNvbmFsIFVQSSBRUiBvciBjaGFzaW5nIGNvbmZpcm1hdGlvbnMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RGVhZGxpbmUgQ291bnRkb3duOjwvc3Ryb25nPiBFdmVyeSBwYXJ0aWNpcGFudCBzZWVzIGEgbGl2ZSBjb3VudGRvd24gdG8gdGhlIHN1Ym1pc3Npb24gZGVhZGxpbmUuIE5vIG1vcmUgXCJTaXIsIHdoYXQgaXMgdGhlIGxhc3QgdGltZT9cIiBtZXNzYWdlcy48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5TdHJ1Y3R1cmVkIFN1Ym1pc3Npb25zOjwvc3Ryb25nPiBUZWFtcyBwYXN0ZSB0aGVpciBHaXRIdWIgcmVwbywgR29vZ2xlIERyaXZlIGxpbmssIG9yIFBERiBkaXJlY3RseSBmcm9tIHRoZWlyIHRlYW0gZGFzaGJvYXJkIFx1MjAxNCBvcmdhbml6ZWQsIHRpbWVzdGFtcGVkLCBhbmQgcmVhZHkgZm9yIHJldmlldy48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5BZG1pbiBTY29yaW5nOjwvc3Ryb25nPiBZb3UgcmV2aWV3IGVhY2ggdGVhbSdzIHN1Ym1pc3Npb24sIGFzc2lnbiBhIHNjb3JlIG91dCBvZiAxMDAsIGFuZCB0aGUgcGxhdGZvcm0gdHJhY2tzIHJhbmtpbmdzIGF1dG9tYXRpY2FsbHkuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+QXV0by1DZXJ0aWZpY2F0ZXM6PC9zdHJvbmc+IFdpbm5lcnMgYW5kIHBhcnRpY2lwYW50cyByZWNlaXZlIGJlYXV0aWZ1bCwgdmVyaWZpYWJsZSBkaWdpdGFsIGNlcnRpZmljYXRlcyB0aGUgbW9tZW50IHlvdSBjbGljayBcIlB1Ymxpc2ggUmVzdWx0c1wiLiBaZXJvIG1hbnVhbCBQREYgZ2VuZXJhdGlvbi48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgzPldobyBTaG91bGQgSG9zdCBhIEhhY2thdGhvbj88L2gzPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5FbmdpbmVlcmluZyBDb2xsZWdlczo8L3N0cm9uZz4gVGVjaG5pY2FsIGZlc3RzLCBkZXBhcnRtZW50LWxldmVsIGNvZGluZyBldmVudHMsIGludGVyLWNvbGxlZ2UgY29sbGFib3JhdGl2ZSBoYWNrYXRob25zLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlRlY2ggQ29tbXVuaXRpZXM6PC9zdHJvbmc+IERldmVsb3BlciBtZWV0dXAgZ3JvdXBzLCBvcGVuLXNvdXJjZSBjbHVicywgYm9vdGNhbXAgY29ob3J0cy48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5TdGFydHVwcyAmIENvbXBhbmllczo8L3N0cm9uZz4gUHJvZHVjdCBpbm5vdmF0aW9uIHNwcmludHMsIGNhbXB1cyBoaXJpbmcgZHJpdmVzLCBpbnRlcm5hbCB0ZWFtLWJ1aWxkaW5nIGV2ZW50cy48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5OR09zICYgRWR1Y2F0aW9uIFBsYXRmb3Jtczo8L3N0cm9uZz4gU29jaWFsIGltcGFjdCBoYWNrYXRob25zLCBlZHVjYXRpb24gaW5ub3ZhdGlvbiBjaGFsbGVuZ2VzLjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDM+SG93IHRvIExhdW5jaCBZb3VyIEhhY2thdGhvbiBpbiAyIE1pbnV0ZXM8L2gzPlxuICAgICAgPHA+T24gU2tpbGxWYWxpeCwgY3JlYXRpbmcgYSBoYWNrYXRob24gaXMgYXMgZmFzdCBhcyBmaWxsaW5nIGEgZm9ybS4gWW91IHNldCB0aGUgdGl0bGUsIGRlc2NyaXB0aW9uLCBkZWFkbGluZSwgdGVhbSBzaXplIGxpbWl0cywgcGF5bWVudCBjb25maWcsIGFuZCBzdWJtaXNzaW9uIHJ1bGVzLiBUaGUgcGxhdGZvcm0gZ29lcyBsaXZlIGluc3RhbnRseS4gUGFydGljaXBhbnRzIGNhbiByZWdpc3RlciB0aGUgc2FtZSBtaW51dGUuPC9wPlxuICAgICAgPHA+UmVhZHkgdG8gcnVuIEluZGlhJ3MgbmV4dCBncmVhdCBoYWNrYXRob24/IDxhIGhyZWY9XCJodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ob3N0XCIgdGFyZ2V0PVwiX2JsYW5rXCI+U3VibWl0IHlvdXIgaG9zdGluZyByZXF1ZXN0IGhlcmU8L2E+IGFuZCBsZXQncyBtYWtlIGl0IGhhcHBlbi48L3A+XG4gICAgYCxcbiAgICBhdXRob3I6ICdBcmp1biBNZWh0YScsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDQtMDJUMTA6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDQtMDJUMTA6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdBcHJpbCAyLCAyMDI2JyxcbiAgICByZWFkVGltZTogJzggbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogNTQwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnSGFja2F0aG9uJywgJ0hvc3QgSGFja2F0aG9uIEluZGlhJywgJ0V2ZW50IE1hbmFnZW1lbnQnLCAnQ29kaW5nIEV2ZW50cycsICdUZWNoIENvbW11bml0eSddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDQzODQzMDgwOTAtYzg5NGZkY2M1MzhkP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ0RldmVsb3BlcnMgY29sbGFib3JhdGluZyBhdCBhIGhhY2thdGhvbiBldmVudCBpbiBJbmRpYScsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9ob3ctdG8taG9zdC1oYWNrYXRob24taW4taW5kaWEtMjAyNicsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdUaGUgVWx0aW1hdGUgSmF2YVNjcmlwdCBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0J1aWxkIHRoZSBza2lsbHMgdG8gY29tcGV0ZSBhbmQgd2luIGF0IHlvdXIgZmlyc3QgaGFja2F0aG9uIFx1MjAxNCBmcmVlIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlLidcbiAgICB9XG4gIH0sXG5cbiAge1xuICAgIGlkOiAnYmVzdC1vbmxpbmUtaGFja2F0aG9ucy1pbmRpYS0yMDI2JyxcbiAgICB0aXRsZTogJ0Jlc3QgT25saW5lIEhhY2thdGhvbnMgaW4gSW5kaWEgMjAyNjogV2hlcmUgdG8gQ29tcGV0ZSAmIFdpbicsXG4gICAgbWV0YVRpdGxlOiAnQmVzdCBPbmxpbmUgSGFja2F0aG9ucyBpbiBJbmRpYSAyMDI2IFx1MjAxNCBXaW4gUHJpemVzICYgQ2VydGlmaWNhdGVzIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnTG9va2luZyBmb3IgdGhlIGJlc3Qgb25saW5lIGhhY2thdGhvbnMgaW4gSW5kaWEgaW4gMjAyNj8gRGlzY292ZXIgdG9wIGNvZGluZyBjaGFsbGVuZ2VzLCB3aW4gY2FzaCBwcml6ZXMsIGFuZCBlYXJuIHZlcmlmaWFibGUgZGlnaXRhbCBjZXJ0aWZpY2F0ZXMuIEZpbmQgYW5kIGpvaW4gbGl2ZSBldmVudHMgb24gU2tpbGxWYWxpeC4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnYmVzdCBvbmxpbmUgaGFja2F0aG9ucyBpbiBJbmRpYSAyMDI2JyxcbiAgICAgICdvbmxpbmUgaGFja2F0aG9uIEluZGlhJyxcbiAgICAgICdjb2RpbmcgY2hhbGxlbmdlcyBJbmRpYSAyMDI2JyxcbiAgICAgICdoYWNrYXRob24gZm9yIHN0dWRlbnRzIEluZGlhJyxcbiAgICAgICdmcmVlIGhhY2thdGhvbiBvbmxpbmUgSW5kaWEnLFxuICAgICAgJ3dpbiBwcml6ZXMgaGFja2F0aG9uIEluZGlhJyxcbiAgICAgICdoYWNrYXRob24gd2l0aCBjZXJ0aWZpY2F0ZSBJbmRpYScsXG4gICAgICAnY29kaW5nIGNvbXBldGl0aW9uIEluZGlhIDIwMjYnLFxuICAgIF0sXG4gICAgZXhjZXJwdDogJ0ZvcmdldCBzY291cmluZyBSZWRkaXQgYW5kIERpc2NvcmQgZm9yIGhhY2thdGhvbiBhbm5vdW5jZW1lbnRzLiBIZXJlIGlzIHlvdXIgYXV0aG9yaXRhdGl2ZSBndWlkZSB0byBmaW5kaW5nLCBqb2luaW5nLCBhbmQgd2lubmluZyB0aGUgYmVzdCBvbmxpbmUgaGFja2F0aG9ucyBpbiBJbmRpYSBpbiAyMDI2IFx1MjAxNCBjb21wbGV0ZSB3aXRoIHByaXplcyBhbmQgY2VydGlmaWNhdGVzLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPldoeSBPbmxpbmUgSGFja2F0aG9ucyBhcmUgdGhlIEJlc3QgQ2FyZWVyIE1vdmUgZm9yIEluZGlhbiBEZXZlbG9wZXJzPC9oMj5cbiAgICAgIDxwPkZpdmUgeWVhcnMgYWdvLCBwYXJ0aWNpcGF0aW5nIGluIGEgdG9wIGhhY2thdGhvbiBtZWFudCB0cmF2ZWxsaW5nIHRvIE11bWJhaSwgQmVuZ2FsdXJ1LCBvciBEZWxoaSwgYm9va2luZyBob3RlbHMsIGFuZCB0YWtpbmcgdGltZSBvZmYgY29sbGVnZS4gSW4gMjAyNiwgdGhlIG1vc3QgcHJlc3RpZ2lvdXMsIGhpZ2gtcGF5aW5nIGNvZGluZyBjaGFsbGVuZ2VzIGFyZSBmdWxseSBvbmxpbmUuIFlvdSBjb21wZXRlIGZyb20geW91ciByb29tLCBjb2xsYWJvcmF0ZSB3aXRoIHRlYW1tYXRlcyBhY3Jvc3MgdGhlIGNvdW50cnksIGFuZCB3aW4gY2FzaCBwcml6ZXMgXHUyMDE0IGFsbCB3aXRob3V0IGxlYXZpbmcgeW91ciBjaXR5LjwvcD5cbiAgICAgIDxwPkZvciBlbmdpbmVlcmluZyBzdHVkZW50cyBhbmQgZWFybHktY2FyZWVyIGRldmVsb3BlcnMgaW4gSW5kaWEsIGhhY2thdGhvbnMgYXJlIHRoZSBzaW5nbGUgZmFzdGVzdCB3YXkgdG8gYnVpbGQgYSBwb3J0Zm9saW8sIGVhcm4gaW5kdXN0cnkgcmVjb2duaXRpb24sIGFuZCBnZXQgbm90aWNlZCBieSByZWNydWl0ZXJzLjwvcD5cblxuICAgICAgPGgzPldoYXQgTWFrZXMgYSBIYWNrYXRob24gXCJUaGUgQmVzdFwiPzwvaDM+XG4gICAgICA8cD5Ob3QgYWxsIGhhY2thdGhvbnMgYXJlIGVxdWFsLiBCZWZvcmUgcmVnaXN0ZXJpbmcsIGV2YWx1YXRlIGVhY2ggZXZlbnQgb24gdGhlc2UgZml2ZSBjcml0ZXJpYTo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPkNsZWFyIFByb2JsZW0gU3RhdGVtZW50Ojwvc3Ryb25nPiBUaGUgYmVzdCBoYWNrYXRob25zIGdpdmUgeW91IGEgZGVmaW5lZCBzY29wZS4gVmFndWUgXCJidWlsZCBhbnl0aGluZ1wiIHByb21wdHMgbGVhZCB0byB2YWd1ZSBwcm9qZWN0cyB0aGF0IGRvIG5vdCBpbXByZXNzIGp1ZGdlcyBvciBlbXBsb3llcnMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+VHJhbnNwYXJlbnQgSnVkZ2luZyBDcml0ZXJpYTo8L3N0cm9uZz4gWW91IHNob3VsZCBrbm93IGV4YWN0bHkgaG93IHlvdXIgcHJvamVjdCB3aWxsIGJlIGV2YWx1YXRlZCBcdTIwMTQgaW5ub3ZhdGlvbiwgdGVjaG5pY2FsIGNvbXBsZXhpdHksIFVYLCBhbmQgcHJlc2VudGF0aW9uIHdlaWdodC48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5TdHJ1Y3R1cmVkIFJlZ2lzdHJhdGlvbjo8L3N0cm9uZz4gQSBwcm9mZXNzaW9uYWwgZXZlbnQgdXNlcyBhIHByb3BlciBwbGF0Zm9ybSBcdTIwMTQgbm90IGEgR29vZ2xlIEZvcm0uIFBsYXRmb3JtcyBsaWtlIDxhIGhyZWY9XCJodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9oYWNrYXRob25zXCIgdGFyZ2V0PVwiX2JsYW5rXCI+U2tpbGxWYWxpeDwvYT4gbWFuYWdlIHlvdXIgdGVhbSwgcGF5bWVudCwgYW5kIHN1Ym1pc3Npb24gaW4gb25lIHBsYWNlLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlJlYWwgUHJpemVzOjwvc3Ryb25nPiBDYXNoIHByaXplcywgaW50ZXJuc2hpcCBvZmZlcnMsIG9yIGd1YXJhbnRlZWQgaW50ZXJ2aWV3IG9wcG9ydHVuaXRpZXMgZnJvbSByZWFsIGNvbXBhbmllcyBzaWduYWwgYSBzZXJpb3VzIGV2ZW50LjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlZlcmlmaWFibGUgQ2VydGlmaWNhdGVzOjwvc3Ryb25nPiBBIGNlcnRpZmljYXRlIHlvdSBjYW4gbGluayB0byBvbiBMaW5rZWRJbiBcdTIwMTQgd2l0aCBhIHVuaXF1ZSBJRCB0aGF0IGFueW9uZSBjYW4gdmVyaWZ5IFx1MjAxNCBjYXJyaWVzIGZhciBtb3JlIHdlaWdodCB0aGFuIGEgUE5HIGZpbGUgZW1haWxlZCB0byB5b3UuPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMz5Ib3cgdG8gTWF4aW1pemUgWW91ciBDaGFuY2VzIG9mIFdpbm5pbmc8L2gzPlxuICAgICAgPG9sPlxuICAgICAgICA8bGk+PHN0cm9uZz5SZWFkIHRoZSBicmllZiAzIHRpbWVzLjwvc3Ryb25nPiBNb3N0IGxvc2luZyB0ZWFtcyBzb2x2ZSB0aGUgd3JvbmcgcHJvYmxlbS48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5CdWlsZCBhbiBNVlAsIG5vdCBhIG1hc3RlcnBpZWNlLjwvc3Ryb25nPiBBIHdvcmtpbmcgZGVtbyB3aXRoIDMgZmVhdHVyZXMgYmVhdHMgYSBwZXJmZWN0IGRlc2lnbiB3aXRoIDAgZmVhdHVyZXMuIEp1ZGdlcyBjbGljayBidXR0b25zLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlByZXBhcmUgYSAyLW1pbnV0ZSBwaXRjaC48L3N0cm9uZz4gWW91ciBwcmVzZW50YXRpb24gbWF0dGVycyBhcyBtdWNoIGFzIHlvdXIgY29kZS4gUHJhY3RpY2UgZXhwbGFpbmluZyB5b3VyIHNvbHV0aW9uIHRvIGEgbm9uLXRlY2huaWNhbCBwZXJzb24uPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RG9jdW1lbnQgb24gR2l0SHViLjwvc3Ryb25nPiBBIGNsZWFuIFJFQURNRSB3aXRoIHNjcmVlbnNob3RzLCBhIGxpdmUgZGVtbyBsaW5rLCBhbmQgaW5zdGFsbCBpbnN0cnVjdGlvbnMgaXMgdGhlIG1hcmsgb2YgYSBwcm9mZXNzaW9uYWwgdGVhbS48L2xpPlxuICAgICAgPC9vbD5cblxuICAgICAgPGgzPldoZXJlIHRvIEZpbmQgdGhlIEJlc3QgT25saW5lIEhhY2thdGhvbnMgaW4gSW5kaWE8L2gzPlxuICAgICAgPHA+UmF0aGVyIHRoYW4gY2hhc2luZyBzY2F0dGVyZWQgYW5ub3VuY2VtZW50cyBhY3Jvc3Mgc29jaWFsIG1lZGlhLCB2aXNpdCA8YSBocmVmPVwiaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vaGFja2F0aG9uc1wiIHRhcmdldD1cIl9ibGFua1wiPlNraWxsVmFsaXggSGFja2F0aG9uczwvYT4gXHUyMDE0IGEgY3VyYXRlZCBodWIgb2YgbGl2ZSBhbmQgdXBjb21pbmcgZXZlbnRzIGJ1aWx0IHNwZWNpZmljYWxseSBmb3IgdGhlIEluZGlhbiBkZXZlbG9wZXIgY29tbXVuaXR5LiBFYWNoIGV2ZW50IHBhZ2Ugc2hvd3MgeW91IHRoZSBmdWxsIGRldGFpbHM6IGRlYWRsaW5lLCB0ZWFtIHNpemUsIHByaXplcywgcnVsZXMsIGFuZCBzdWJtaXNzaW9uIGZvcm1hdCBcdTIwMTQgYWxsIGluIG9uZSBwbGFjZS48L3A+XG4gICAgICA8cD5SZWdpc3RlciwgZm9ybSB5b3VyIHRlYW0sIGFuZCBzdGFydCBidWlsZGluZy4gWW91ciBuZXh0IHdpbiBpcyBvbmUgaGFja2F0aG9uIGF3YXkuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnTmVoYSBTaGFybWEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTAyVDExOjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTAyVDExOjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgMiwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICc3IG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDUxMCxcbiAgICBjYXRlZ29yeTogJ0NhcmVlciAmIEluZHVzdHJ5JyxcbiAgICB0YWdzOiBbJ0hhY2thdGhvbicsICdPbmxpbmUgSGFja2F0aG9uIEluZGlhJywgJ0NvZGluZyBDb21wZXRpdGlvbicsICdTdHVkZW50IENhcmVlcicsICdXaW4gUHJpemVzJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxNzA0ODY3NjczMi1kNjViYzkzN2Y5NTI/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnVGVhbSBvZiB5b3VuZyBJbmRpYW4gZGV2ZWxvcGVycyB3b3JraW5nIHRvZ2V0aGVyIGF0IGEgaGFja2F0aG9uJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL2Jlc3Qtb25saW5lLWhhY2thdGhvbnMtaW5kaWEtMjAyNicsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdVbHRpbWF0ZSBQeXRob24gTWFzdGVyY2xhc3MnLFxuICAgICAgc2x1ZzogJ3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1B5dGhvbiBpcyB0aGUgIzEgbGFuZ3VhZ2UgdXNlZCBpbiB3aW5uaW5nIEFJIGFuZCBkYXRhLWZvY3VzZWQgaGFja2F0aG9ucyBcdTIwMTQgbGVhcm4gaXQgZnJlZS4nXG4gICAgfVxuICB9LFxuXG4gIHtcbiAgICBpZDogJ2NvcnBvcmF0ZS1oYWNrYXRob24tcGxhdGZvcm0taW5kaWEtaGlyaW5nJyxcbiAgICB0aXRsZTogJ1doeSBJbmRpYW4gU3RhcnR1cHMgYXJlIFJlcGxhY2luZyBUZWNobmljYWwgSW50ZXJ2aWV3cyB3aXRoIEhhY2thdGhvbnMnLFxuICAgIG1ldGFUaXRsZTogJ0NvcnBvcmF0ZSBIYWNrYXRob24gUGxhdGZvcm0gSW5kaWEgXHUyMDE0IEhpcmUgRGV2ZWxvcGVycyBUaHJvdWdoIEhhY2thdGhvbnMgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdEaXNjb3ZlciB3aHkgbGVhZGluZyBJbmRpYW4gc3RhcnR1cHMgYW5kIGNvbXBhbmllcyBhcmUgdXNpbmcgaGFja2F0aG9ucyBhcyB0aGVpciBwcmltYXJ5IHRlY2huaWNhbCBoaXJpbmcgdG9vbCBpbiAyMDI2LiBMZWFybiBob3cgdG8gaG9zdCBhIGNvcnBvcmF0ZSBoYWNrYXRob24gYW5kIGZpbmQgeW91ciBuZXh0IGJlc3QgZW5naW5lZXIuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ2NvcnBvcmF0ZSBoYWNrYXRob24gcGxhdGZvcm0gSW5kaWEnLFxuICAgICAgJ2hpcmUgZGV2ZWxvcGVycyB0aHJvdWdoIGhhY2thdGhvbicsXG4gICAgICAnaGFja2F0aG9uIGZvciByZWNydWl0bWVudCBJbmRpYScsXG4gICAgICAndGVjaCBoaXJpbmcgaGFja2F0aG9uIDIwMjYnLFxuICAgICAgJ2hvc3QgaGFja2F0aG9uIGZvciBjb21wYW5pZXMnLFxuICAgICAgJ2NhbXB1cyBoYWNrYXRob24gSW5kaWEnLFxuICAgICAgJ3N0YXJ0dXAgaGFja2F0aG9uIEluZGlhJyxcbiAgICAgICdkZXZlbG9wZXIgcmVjcnVpdG1lbnQgcGxhdGZvcm0gSW5kaWEnLFxuICAgIF0sXG4gICAgZXhjZXJwdDogJ1RoZSB0cmFkaXRpb25hbCB0ZWNobmljYWwgaW50ZXJ2aWV3IGlzIGJyb2tlbi4gV2hpdGVib2FyZCBwcm9ibGVtcyBjYW5ub3QgdGVsbCB5b3UgaWYgYSBjYW5kaWRhdGUgY2FuIHNoaXAgcmVhbCBjb2RlIHVuZGVyIHJlYWwgcHJlc3N1cmUuIEhlcmUgaXMgd2h5IEluZGlhXFwncyBmYXN0ZXN0LWdyb3dpbmcgY29tcGFuaWVzIGFyZSBzd2l0Y2hpbmcgdG8gaGFja2F0aG9uLWJhc2VkIGhpcmluZy4nLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxoMj5UaGUgVGVjaG5pY2FsIEludGVydmlldyBpcyBGYWlsaW5nIEV2ZXJ5b25lPC9oMj5cbiAgICAgIDxwPkVuZ2luZWVyaW5nIGhpcmluZyBpbiBJbmRpYSBmb2xsb3dzIGEgcHJlZGljdGFibGUsIGJyb2tlbiBwYXR0ZXJuLiBBIHJlY3J1aXRlciBzY3JlZW5zIDUwMCByZXN1bWVzLiA1MCBjYW5kaWRhdGVzIGdldCBhIExlZXRDb2RlIG9ubGluZSBhc3Nlc3NtZW50LiAxMCBwYXNzLiA1IGdldCBhIHRlY2huaWNhbCBpbnRlcnZpZXcuIDIgZ2V0IG9mZmVycy4gT2YgdGhvc2UgMiwgb25lIGpvaW5zIGFuZCB0dXJucyBvdXQgdG8gYmUgYSBncmVhdCBMZWV0Q29kZSBzb2x2ZXIgYnV0IGEgbWVkaW9jcmUgYnVpbGRlci48L3A+XG4gICAgICA8cD5UaGUgcHJvYmxlbSBpcyBmdW5kYW1lbnRhbDogdGhlIHNraWxscyByZXF1aXJlZCB0byBhY2UgYSB3aGl0ZWJvYXJkIGludGVydmlldyBoYXZlIGFsbW9zdCB6ZXJvIGNvcnJlbGF0aW9uIHdpdGggdGhlIHNraWxscyByZXF1aXJlZCB0byBidWlsZCBhIHByb2R1Y3QgdW5kZXIgYSBkZWFkbGluZS48L3A+XG5cbiAgICAgIDxoMz5XaGF0IGEgSGFja2F0aG9uIFJldmVhbCBUaGF0IGFuIEludGVydmlldyBDYW5ub3Q8L2gzPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5SZWFsLVdvcmxkIEJ1aWxkaW5nIEFiaWxpdHk6PC9zdHJvbmc+IENhbiB0aGUgY2FuZGlkYXRlIHNjb3BlIGEgcHJvYmxlbSwgbWFrZSBhcmNoaXRlY3R1cmUgZGVjaXNpb25zLCBhbmQgc2hpcCB3b3JraW5nIGNvZGUgaW4gNDggaG91cnM/IEEgaGFja2F0aG9uIGFuc3dlcnMgdGhpcyB3aXRoIGNlcnRhaW50eS48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Db2xsYWJvcmF0aW9uIFVuZGVyIFByZXNzdXJlOjwvc3Ryb25nPiBDYW4gdGhleSBjb21tdW5pY2F0ZSBjbGVhcmx5IHdpdGggdGVhbW1hdGVzLCBkaXZpZGUgdGFza3MgZWZmaWNpZW50bHksIGFuZCBpbnRlZ3JhdGUgZWFjaCBvdGhlcidzIGNvZGU/IFlvdSB3aWxsIHNlZSB0aGlzIGxpdmUuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UHJvZHVjdCBTZW5zZTo8L3N0cm9uZz4gRG8gdGhleSB0aGluayBhYm91dCB0aGUgdXNlciBleHBlcmllbmNlLCBvciBkbyB0aGV5IG9ubHkgdGhpbmsgYWJvdXQgYWxnb3JpdGhtcz8gVGhlIGJlc3QgZW5naW5lZXJzIGRvIGJvdGguPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q29kZSBRdWFsaXR5Ojwvc3Ryb25nPiBBIEdpdEh1YiBzdWJtaXNzaW9uIHdpdGggY2xlYW4gY29tbWl0cywgYSBwcm9wZXIgUkVBRE1FLCBhbmQgcmVhZGFibGUgY29kZSB0ZWxscyB5b3UgbW9yZSB0aGFuIGFueSB0YWtlLWhvbWUgYXNzZXNzbWVudC48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgzPkhvdyB0byBSdW4gYSBIaXJpbmcgSGFja2F0aG9uIFdpdGhvdXQgQnVpbGRpbmcgQ3VzdG9tIEluZnJhc3RydWN0dXJlPC9oMz5cbiAgICAgIDxwPlRoZSAjMSByZWFzb24gY29tcGFuaWVzIGF2b2lkZWQgaGFja2F0aG9uLWJhc2VkIGhpcmluZyBpbiB0aGUgcGFzdCB3YXMgbG9naXN0aWNzLiBCdWlsZGluZyBhIGN1c3RvbSByZWdpc3RyYXRpb24gcG9ydGFsLCBwYXltZW50IHN5c3RlbSwgc3VibWlzc2lvbiB0cmFja2VyLCBhbmQgc2NvcmluZyBkYXNoYm9hcmQganVzdCBmb3IgaGlyaW5nIGZlbHQgZGlzcHJvcG9ydGlvbmF0ZS48L3A+XG4gICAgICA8cD5JbiAyMDI2LCB0aGF0IGV4Y3VzZSBubyBsb25nZXIgZXhpc3RzLiA8YSBocmVmPVwiaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vaG9zdFwiIHRhcmdldD1cIl9ibGFua1wiPlNraWxsVmFsaXg8L2E+IHByb3ZpZGVzIGFsbCBvZiB0aGlzIG91dCBvZiB0aGUgYm94LiBBcyBhIGNvbXBhbnksIHlvdSBzdWJtaXQgeW91ciBldmVudCBkZXRhaWxzIGFuZCBnZXQgYSBmdWxseSBmdW5jdGlvbmFsIGhhY2thdGhvbiBwYWdlIGxpdmUgd2l0aGluIG1pbnV0ZXM6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+UGFydGljaXBhbnRzIHJlZ2lzdGVyIGFuZCBmb3JtIHRlYW1zIG9uIHRoZSBwbGF0Zm9ybTwvbGk+XG4gICAgICAgIDxsaT5Zb3VyIHByb2JsZW0gc3RhdGVtZW50IGFuZCBqdWRnaW5nIGNyaXRlcmlhIGFyZSBkaXNwbGF5ZWQgY2xlYXJseTwvbGk+XG4gICAgICAgIDxsaT5UZWFtcyBzdWJtaXQgR2l0SHViIGxpbmtzLCBsaXZlIGRlbW9zLCBvciBQREZzIGRpcmVjdGx5PC9saT5cbiAgICAgICAgPGxpPllvdXIgaGlyaW5nIHRlYW0gcmV2aWV3cyBzdWJtaXNzaW9ucyBzaWRlLWJ5LXNpZGUgYW5kIGFzc2lnbnMgc2NvcmVzPC9saT5cbiAgICAgICAgPGxpPlRvcCBwZXJmb3JtZXJzIGdldCBjZXJ0aWZpY2F0ZXMgYW5kIGFuIGludml0YXRpb24gdG8gdGhlIG5leHQgaW50ZXJ2aWV3IHJvdW5kPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMz5UaGUgUk9JIG9mIEhhY2thdGhvbiBIaXJpbmc8L2gzPlxuICAgICAgPHA+Q29uc2lkZXIgdGhpczogYSB0cmFkaXRpb25hbCBjYW1wdXMgaGlyaW5nIGRyaXZlIGNvc3RzIFx1MjBCOTNcdTIwMTM4IGxha2hzIHdoZW4geW91IGZhY3RvciBpbiB0cmF2ZWwsIHNldHVwLCBhbmQgSFIgaG91cnMuIEEgaGFja2F0aG9uIG9uIGEgcGxhdGZvcm0gY29zdHMgYSBmcmFjdGlvbiBvZiB0aGF0LCByZWFjaGVzIDEweCB0aGUgY2FuZGlkYXRlIHBvb2wgbmF0aW9uYWxseSwgYW5kIGZpbHRlcnMgdGFsZW50IGZhciBtb3JlIGVmZmVjdGl2ZWx5LjwvcD5cbiAgICAgIDxwPkNvbXBhbmllcyBydW5uaW5nIGhhY2thdGhvbnMgdGhyb3VnaCBTa2lsbFZhbGl4IGhhdmUgcmVwb3J0ZWQgZmluZGluZyBjYW5kaWRhdGVzIHRoZXkgd291bGQgaGF2ZSBzY3JlZW5lZCBvdXQgb24gcGFwZXIgXHUyMDE0IHN0dWRlbnRzIGZyb20gVGllci0yIGNvbGxlZ2VzIHdpdGggZXh0cmFvcmRpbmFyeSBidWlsZGluZyBhYmlsaXR5IHdobyBzaW1wbHkgdGVzdCBwb29ybHkgaW4gaW50ZXJ2aWV3IGZvcm1hdHMuPC9wPlxuXG4gICAgICA8aDM+R2V0IFN0YXJ0ZWQgVG9kYXk8L2gzPlxuICAgICAgPHA+SWYgeW91IGFyZSBhIHN0YXJ0dXAsIGEgc2NhbGUtdXAsIG9yIGFuIGVzdGFibGlzaGVkIHRlY2ggY29tcGFueSBsb29raW5nIGZvciB5b3VyIG5leHQgZ3JlYXQgZW5naW5lZXIsIHN0b3AgcmVseWluZyBvbiByZXN1bWUgc2NyZWVuaW5nIGFuZCBMZWV0Q29kZS4gPGEgaHJlZj1cImh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2hvc3RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5TdWJtaXQgYSBob3N0aW5nIHJlcXVlc3Qgb24gU2tpbGxWYWxpeDwvYT4gYW5kIHJ1biB5b3VyIGZpcnN0IGNvcnBvcmF0ZSBoYWNrYXRob24gdGhpcyBxdWFydGVyLjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ0FyanVuIE1laHRhJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wNC0wMlQxMjowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNC0wMlQxMjowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ0FwcmlsIDIsIDIwMjYnLFxuICAgIHJlYWRUaW1lOiAnOCBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiA1ODAsXG4gICAgY2F0ZWdvcnk6ICdDYXJlZXIgJiBJbmR1c3RyeScsXG4gICAgdGFnczogWydDb3Jwb3JhdGUgSGFja2F0aG9uJywgJ1RlY2ggSGlyaW5nIEluZGlhJywgJ1JlY3J1aXRtZW50JywgJ0hhY2thdGhvbiBQbGF0Zm9ybScsICdTdGFydHVwcyBJbmRpYSddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTkxMzY1NTUtOTMwM2JhZWE4ZWJkP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ0NvcnBvcmF0ZSB0ZWFtIGV2YWx1YXRpbmcgZGV2ZWxvcGVyIGhhY2thdGhvbiBzdWJtaXNzaW9ucyBpbiBJbmRpYScsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9jb3Jwb3JhdGUtaGFja2F0aG9uLXBsYXRmb3JtLWluZGlhLWhpcmluZycsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdBSSAmIE1hY2hpbmUgTGVhcm5pbmcgRnVuZGFtZW50YWxzJyxcbiAgICAgIHNsdWc6ICdiYXNpY3Mtb2YtYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UtYmVnaW5uZXJzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNraWxsIGNvbXBhbmllcyB3YW50IG1vc3QgaW4gaGFja2F0aG9uIGNhbmRpZGF0ZXMgXHUyMDE0IGxlYXJuIGl0IGZyZWUgd2l0aCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUuJ1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnZnJlZS1vbmxpbmUtY291cnNlcy13aXRoLWNlcnRpZmljYXRlLWluZGlhLTIwMjYnLFxuICAgIHRpdGxlOiAnQmVzdCBGcmVlIE9ubGluZSBDb3Vyc2VzIHdpdGggQ2VydGlmaWNhdGUgaW4gSW5kaWEgMjAyNiAoTm8gRmVlLCBWZXJpZmllZCknLFxuICAgIG1ldGFUaXRsZTogJ0Jlc3QgRnJlZSBPbmxpbmUgQ291cnNlcyB3aXRoIENlcnRpZmljYXRlIGluIEluZGlhIDIwMjYgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdMb29raW5nIGZvciBmcmVlIG9ubGluZSBjb3Vyc2VzIHdpdGggY2VydGlmaWNhdGUgaW4gSW5kaWE/IFNraWxsVmFsaXggb2ZmZXJzIDEwMCUgZnJlZSBjb3Vyc2VzIGluIEhUTUwsIENTUywgSmF2YVNjcmlwdCwgUHl0aG9uLCBKYXZhICYgQUkgXHUyMDE0IGFsbCB3aXRoIHZlcmlmaWFibGUgY2VydGlmaWNhdGVzLiBObyBmZWUsIG5vIGNyZWRpdCBjYXJkLicsXG4gICAga2V5d29yZHM6IFtcbiAgICAgICdmcmVlIG9ubGluZSBjb3Vyc2VzIHdpdGggY2VydGlmaWNhdGUgaW4gSW5kaWEnLFxuICAgICAgJ2ZyZWUgY291cnNlcyB3aXRoIGNlcnRpZmljYXRlIEluZGlhIDIwMjYnLFxuICAgICAgJ2ZyZWUgY2VydGlmaWNhdGlvbiBjb3Vyc2VzIEluZGlhJyxcbiAgICAgICdvbmxpbmUgY291cnNlcyBmcmVlIGNlcnRpZmljYXRlIEluZGlhJyxcbiAgICAgICdiZXN0IGZyZWUgb25saW5lIGNvdXJzZXMgSW5kaWEnLFxuICAgICAgJ2ZyZWUgc2tpbGwgY291cnNlcyBJbmRpYScsXG4gICAgICAnZnJlZSBjZXJ0aWZpY2F0ZSBjb3Vyc2VzIGZvciBzdHVkZW50cyBJbmRpYScsXG4gICAgICAnZnJlZSBvbmxpbmUgbGVhcm5pbmcgSW5kaWEnLFxuICAgIF0sXG4gICAgZXhjZXJwdDogJ0luZGlhIGhhcyB0aG91c2FuZHMgb2YgZnJlZSBjb3Vyc2UgcGxhdGZvcm1zIFx1MjAxNCBidXQgdmVyeSBmZXcgZ2l2ZSB5b3UgYSBjZXJ0aWZpY2F0ZSB0aGF0IGFjdHVhbGx5IG1lYW5zIHNvbWV0aGluZy4gSGVyZSBhcmUgdGhlIGJlc3QgZnJlZSBvbmxpbmUgY291cnNlcyB3aXRoIHZlcmlmaWFibGUgY2VydGlmaWNhdGVzIGF2YWlsYWJsZSB0byBJbmRpYW4gc3R1ZGVudHMgaW4gMjAyNi4nLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxoMj5XaHkgRnJlZSBDZXJ0aWZpY2F0ZXMgaW4gSW5kaWEgQXJlIGEgQmlnIERlYWwgaW4gMjAyNjwvaDI+XG4gICAgICA8cD5JbmRpYSBwcm9kdWNlcyBvdmVyIDEuNSBtaWxsaW9uIGVuZ2luZWVyaW5nIGdyYWR1YXRlcyBhbm51YWxseS4gVGhlIGJydXRhbCByZWFsaXR5PyBNb3N0IG9mIHRoZW0gY29tcGV0ZSBmb3IgdGhlIHNhbWUgZW50cnktbGV2ZWwgcm9sZXMgd2l0aCBuZWFybHkgaWRlbnRpY2FsIHJlc3VtZXMuIEEgZnJlZSwgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZSBmcm9tIGEgY3JlZGlibGUgcGxhdGZvcm0gaXMgb25lIG9mIHRoZSBmYXN0ZXN0IHdheXMgdG8gbWFrZSB5b3VyIGFwcGxpY2F0aW9uIHN0YW5kIG91dCBcdTIwMTQgZXNwZWNpYWxseSBpZiB5b3UncmUgYSBzdHVkZW50IGZyb20gYSBUaWVyLTIgb3IgVGllci0zIGNvbGxlZ2UuPC9wPlxuICAgICAgPHA+VGhlIGdvb2QgbmV3czogeW91IGRvbid0IG5lZWQgdG8gc3BlbmQgYSBydXBlZS4gVGhlIGJlc3QgZnJlZSBvbmxpbmUgY291cnNlcyB3aXRoIGNlcnRpZmljYXRlcyBpbiBJbmRpYSBhcmUgYXZhaWxhYmxlIHJpZ2h0IG5vdywgYW5kIHRoZXkncmUgbW9yZSBjb21wcmVoZW5zaXZlIHRoYW4gbW9zdCBwYWlkIGFsdGVybmF0aXZlcy48L3A+XG5cbiAgICAgIDxoMj5XaGF0IE1ha2VzIGEgRnJlZSBDZXJ0aWZpY2F0ZSBXb3J0aCBIYXZpbmc/PC9oMj5cbiAgICAgIDxwPk5vdCBhbGwgZnJlZSBjZXJ0aWZpY2F0ZXMgYXJlIGVxdWFsLiBCZWZvcmUgeW91IHNwZW5kIDEwIGhvdXJzIG9uIGEgY291cnNlLCBjaGVjayBmb3IgdGhlc2UgdGhyZWUgdGhpbmdzOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+VmVyaWZpYWJpbGl0eTo8L3N0cm9uZz4gQ2FuIGFuIGVtcGxveWVyIGluZGVwZW5kZW50bHkgdmVyaWZ5IHRoYXQgeW91IGFjdHVhbGx5IGNvbXBsZXRlZCB0aGUgY291cnNlPyBBIGdvb2QgcGxhdGZvcm0gZ2l2ZXMgZXZlcnkgY2VydGlmaWNhdGUgYSB1bmlxdWUgSUQgdGhhdCBhbnlvbmUgY2FuIGNoZWNrIG9ubGluZS48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5FeGFtIHJlcXVpcmVtZW50Ojwvc3Ryb25nPiBDZXJ0aWZpY2F0ZXMgdGhhdCByZXF1aXJlIHlvdSB0byBwYXNzIGFuIGFjdHVhbCBleGFtIGFyZSB3b3J0aCBmYXIgbW9yZSB0aGFuIGNvdXJzZS1jb21wbGV0aW9uIGNlcnRpZmljYXRlcy4gQ29tcGxldGlvbiBwcm92ZXMgeW91IHdhdGNoZWQuIEFuIGV4YW0gcHJvdmVzIHlvdSB1bmRlcnN0b29kLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPk5vIHBheXdhbGwgYXQgdGhlIGVuZDo8L3N0cm9uZz4gU29tZSBwbGF0Zm9ybXMgb2ZmZXIgZnJlZSBjb3Vyc2UgYWNjZXNzIGJ1dCB0aGVuIGNoYXJnZSB5b3UgZm9yIHRoZSBjZXJ0aWZpY2F0ZS4gQXZvaWQgdGhlc2UuIE9uIFNraWxsVmFsaXgsIGJvdGggbGVhcm5pbmcgYW5kIHRoZSBjZXJ0aWZpY2F0ZSBhcmUgY29tcGxldGVseSBmcmVlLjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDI+QmVzdCBGcmVlIE9ubGluZSBDb3Vyc2VzIHdpdGggQ2VydGlmaWNhdGUgaW4gSW5kaWEgXHUyMDE0IDIwMjYgTGlzdDwvaDI+XG5cbiAgICAgIDxoMz4xLiBIVE1MNSBmb3IgQmVnaW5uZXJzIFx1MjAxNCBTa2lsbFZhbGl4PC9oMz5cbiAgICAgIDxwPlRoZSBmb3VuZGF0aW9uIG9mIGFsbCB3ZWIgZGV2ZWxvcG1lbnQuIFRoaXMgZnJlZSBjb3Vyc2UgY292ZXJzIGV2ZXJ5dGhpbmcgZnJvbSBkb2N1bWVudCBzdHJ1Y3R1cmUgdG8gZm9ybXMsIHNlbWFudGljIEhUTUwsIGFuZCBTRU8tcmVsZXZhbnQgbWFya3VwLiBQYXNzIHRoZSBleGFtIGFuZCBnZXQgYSB2ZXJpZmllZCBjZXJ0aWZpY2F0ZSBpbW1lZGlhdGVseS4gUGVyZmVjdCBmb3IgYmVnaW5uZXJzIFx1MjAxNCBubyBwcmlvciBrbm93bGVkZ2UgcmVxdWlyZWQuIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzXCI+U3RhcnQgdGhlIEhUTUwgY291cnNlIGZyZWUgXHUyMTkyPC9hPjwvcD5cblxuICAgICAgPGgzPjIuIENTUyBmb3IgQmVnaW5uZXJzOiBaZXJvIHRvIFBybyBcdTIwMTQgU2tpbGxWYWxpeDwvaDM+XG4gICAgICA8cD5Nb2Rlcm4gQ1NTIGluY2x1ZGluZyBGbGV4Ym94LCBHcmlkLCBhbmltYXRpb25zLCBhbmQgcmVzcG9uc2l2ZSBkZXNpZ24uIFRoaXMgY291cnNlIGlzIGJ1aWx0IGZvciBzb21lb25lIHdobyBoYXMgZmluaXNoZWQgSFRNTCBhbmQgd2FudHMgdG8gbWFrZSB3ZWJzaXRlcyBsb29rIHByb2Zlc3Npb25hbC4gRnJlZSwgc2VsZi1wYWNlZCwgYW5kIGVuZHMgd2l0aCBhIGNlcnRpZmljYXRlIG9uIGV4YW0gY29tcGxldGlvbi4gPGEgaHJlZj1cIi9jb3Vyc2VzL2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvXCI+U3RhcnQgdGhlIENTUyBjb3Vyc2UgZnJlZSBcdTIxOTI8L2E+PC9wPlxuXG4gICAgICA8aDM+My4gSmF2YVNjcmlwdCBNYXN0ZXJjbGFzcyBcdTIwMTQgU2tpbGxWYWxpeDwvaDM+XG4gICAgICA8cD5UaGUgbW9zdCBzb3VnaHQtYWZ0ZXIgc2tpbGwgaW4gSW5kaWFuIHRlY2ggaGlyaW5nLiBUaGlzIGZyZWUgSmF2YVNjcmlwdCBjb3Vyc2UgY292ZXJzIHZhcmlhYmxlcywgZnVuY3Rpb25zLCBET00gbWFuaXB1bGF0aW9uLCBjbG9zdXJlcywgYXN5bmMvYXdhaXQsIGFuZCBBUElzLiBWZXJpZmllZCBjZXJ0aWZpY2F0ZSBpbmNsdWRlZC4gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3NcIj5TdGFydCB0aGUgSmF2YVNjcmlwdCBjb3Vyc2UgZnJlZSBcdTIxOTI8L2E+PC9wPlxuXG4gICAgICA8aDM+NC4gUHl0aG9uIGZvciBCZWdpbm5lcnMgXHUyMDE0IFNraWxsVmFsaXg8L2gzPlxuICAgICAgPHA+VXNlZCBpbiBBSSwgZGF0YSBzY2llbmNlLCBhdXRvbWF0aW9uLCBhbmQgYmFja2VuZCBkZXZlbG9wbWVudC4gUHl0aG9uIGlzIHRoZSBzaW5nbGUgbW9zdCB2ZXJzYXRpbGUgbGFuZ3VhZ2UgdG8gbGVhcm4gaW4gMjAyNi4gVGhpcyBmcmVlIGNvdXJzZSB0YWtlcyB5b3UgZnJvbSB6ZXJvIHRvIGZ1bmN0aW9uYWwgUHl0aG9uIHByb2dyYW1tZXIgd2l0aCBhIHZlcmlmaWVkIGNlcnRpZmljYXRlLiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzXCI+U3RhcnQgdGhlIFB5dGhvbiBjb3Vyc2UgZnJlZSBcdTIxOTI8L2E+PC9wPlxuXG4gICAgICA8aDM+NS4gSmF2YSBQcm9ncmFtbWluZyBNYXN0ZXJjbGFzcyBcdTIwMTQgU2tpbGxWYWxpeDwvaDM+XG4gICAgICA8cD5KYXZhIHJlbWFpbnMgdGhlIGRvbWluYW50IGxhbmd1YWdlIGZvciBBbmRyb2lkIGRldmVsb3BtZW50LCBlbnRlcnByaXNlIHNvZnR3YXJlLCBhbmQgYmFja2VuZCBzeXN0ZW1zLiBUaGlzIGZyZWUgY291cnNlIGNvdmVycyBPT1AsIGNvbGxlY3Rpb25zLCBzdHJlYW1zLCBhbmQgZXhjZXB0aW9uIGhhbmRsaW5nLiBDZXJ0aWZpY2F0ZSBpbmNsdWRlZC4gPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWphdmEtbWFzdGVyY2xhc3NcIj5TdGFydCB0aGUgSmF2YSBjb3Vyc2UgZnJlZSBcdTIxOTI8L2E+PC9wPlxuXG4gICAgICA8aDM+Ni4gQUkgJiBNYWNoaW5lIExlYXJuaW5nIEZ1bmRhbWVudGFscyBcdTIwMTQgU2tpbGxWYWxpeDwvaDM+XG4gICAgICA8cD5BcnRpZmljaWFsIGludGVsbGlnZW5jZSBpcyB0aGUgZGVmaW5pbmcgc2tpbGwgb2YgdGhpcyBkZWNhZGUuIFRoaXMgY291cnNlIGdpdmVzIHlvdSBhIGNvbmNlcHR1YWwgYW5kIHByYWN0aWNhbCBmb3VuZGF0aW9uIGluIEFJIFx1MjAxNCBuZXVyYWwgbmV0d29ya3MsIG1hY2hpbmUgbGVhcm5pbmcgcGlwZWxpbmVzLCByZWFsLXdvcmxkIEFJIHVzZSBjYXNlcyBcdTIwMTQgYWxsIGZyZWUgd2l0aCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUuIDxhIGhyZWY9XCIvY291cnNlcy9iYXNpY3Mtb2YtYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UtYmVnaW5uZXJzXCI+U3RhcnQgdGhlIEFJIGNvdXJzZSBmcmVlIFx1MjE5MjwvYT48L3A+XG5cbiAgICAgIDxoMj5Ib3cgdG8gQWRkIFRoZXNlIENlcnRpZmljYXRlcyB0byBMaW5rZWRJbjwvaDI+XG4gICAgICA8cD5PbmNlIHlvdSBlYXJuIHlvdXIgY2VydGlmaWNhdGUgb24gU2tpbGxWYWxpeCwgaGVyZSdzIGV4YWN0bHkgaG93IHRvIGFkZCBpdCB0byB5b3VyIExpbmtlZEluIHByb2ZpbGU6PC9wPlxuICAgICAgPG9sPlxuICAgICAgICA8bGk+R28gdG8geW91ciBMaW5rZWRJbiBwcm9maWxlIGFuZCBjbGljayA8c3Ryb25nPkFkZCBzZWN0aW9uIFx1MjE5MiBMaWNlbnNlcyAmIENlcnRpZmljYXRpb25zPC9zdHJvbmc+PC9saT5cbiAgICAgICAgPGxpPkVudGVyIHRoZSBjb3Vyc2UgbmFtZSBhcyB0aGUgQ2VydGlmaWNhdGUgTmFtZTwvbGk+XG4gICAgICAgIDxsaT5TZXQgSXNzdWluZyBPcmdhbml6YXRpb24gdG8gPHN0cm9uZz5Ta2lsbFZhbGl4PC9zdHJvbmc+PC9saT5cbiAgICAgICAgPGxpPkVudGVyIHlvdXIgY2VydGlmaWNhdGUncyB1bmlxdWUgSUQgaW4gdGhlIENyZWRlbnRpYWwgSUQgZmllbGQ8L2xpPlxuICAgICAgICA8bGk+QWRkIHRoZSB2ZXJpZmljYXRpb24gVVJMOiA8c3Ryb25nPmh0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL3ZlcmlmeS9beW91ci1jZXJ0aWZpY2F0ZS1pZF08L3N0cm9uZz48L2xpPlxuICAgICAgPC9vbD5cbiAgICAgIDxwPlRoaXMgbWFrZXMgeW91ciBjZXJ0aWZpY2F0ZSBpbmRlcGVuZGVudGx5IHZlcmlmaWFibGUgXHUyMDE0IGFueSByZWNydWl0ZXIgY2FuIGNsaWNrIHRoZSBVUkwgYW5kIGluc3RhbnRseSBjb25maXJtIHlvdXIgYWNoaWV2ZW1lbnQuPC9wPlxuXG4gICAgICA8aDI+QmV5b25kIENlcnRpZmljYXRlczogU3R1ZGVudCBIYWNrYXRob25zPC9oMj5cbiAgICAgIDxwPkEgY2VydGlmaWNhdGUgc2hvd3MgeW91IGNhbiBsZWFybi4gQSA8YSBocmVmPVwiL2hhY2thdGhvbnNcIj5oYWNrYXRob24gcHJvamVjdDwvYT4gc2hvd3MgeW91IGNhbiBidWlsZC4gVGhlIHN0dWRlbnRzIHdobyBjb21iaW5lIGJvdGggXHUyMDE0IGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZSBhbmQgYSByZWFsIGhhY2thdGhvbiBzdWJtaXNzaW9uIFx1MjAxNCBhcmUgdGhlIG9uZXMgd2hvIGNvbnNpc3RlbnRseSBzdGFuZCBvdXQgaW4gYXBwbGljYXRpb25zLiBTa2lsbFZhbGl4IHJ1bnMgZnJlZSBvbmxpbmUgc3R1ZGVudCBoYWNrYXRob25zIHllYXItcm91bmQsIG9wZW4gdG8gYmVnaW5uZXJzLiBObyByZWdpc3RyYXRpb24gZmVlLiBFdmVyeSBwYXJ0aWNpcGFudCBnZXRzIGEgY2VydGlmaWNhdGUuPC9wPlxuXG4gICAgICA8aDI+RnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnM8L2gyPlxuXG4gICAgICA8cD48c3Ryb25nPlExOiBBcmUgU2tpbGxWYWxpeCBjZXJ0aWZpY2F0ZXMgcmVjb2duaXplZCBieSBlbXBsb3llcnMgaW4gSW5kaWE/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFllcy4gRWFjaCBTa2lsbFZhbGl4IGNlcnRpZmljYXRlIGhhcyBhIHVuaXF1ZSB2ZXJpZmljYXRpb24gSUQuIEVtcGxveWVycyBjYW4gdmVyaWZ5IHlvdXIgYWNoaWV2ZW1lbnQgYXQgc2tpbGx2YWxpeC5jb20vdmVyaWZ5IGluIHNlY29uZHMuIFRob3VzYW5kcyBvZiBJbmRpYW4gc3R1ZGVudHMgaGF2ZSBzdWNjZXNzZnVsbHkgYWRkZWQgdGhlc2UgY2VydGlmaWNhdGVzIHRvIHRoZWlyIExpbmtlZEluIHByb2ZpbGVzIGFuZCByZWNlaXZlZCBpbnRlcnZpZXcgY2FsbHMgZnJvbSBJVCBjb21wYW5pZXMsIHN0YXJ0dXBzLCBhbmQgcHJvZHVjdCBjb21wYW5pZXMuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEyOiBEbyBJIG5lZWQgdG8gcGF5IGFueXRoaW5nIGZvciB0aGUgY2VydGlmaWNhdGU/PC9zdHJvbmc+PGJyLz5cbiAgICAgIE5vLiBPbiBTa2lsbFZhbGl4LCBib3RoIHRoZSBjb3Vyc2UgY29udGVudCBhbmQgdGhlIGNlcnRpZmljYXRlIGFyZSBjb21wbGV0ZWx5IGZyZWUuIFlvdSBwYXNzIHRoZSBleGFtLCB5b3UgZ2V0IHRoZSBjZXJ0aWZpY2F0ZSBcdTIwMTQgbm8gY3JlZGl0IGNhcmQsIG5vIGhpZGRlbiBmZWVzLCBubyBzdWJzY3JpcHRpb24uPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBXaGljaCBmcmVlIGNvdXJzZSBzaG91bGQgSSBzdGFydCB3aXRoIGFzIGEgY29tcGxldGUgYmVnaW5uZXI/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFN0YXJ0IHdpdGggSFRNTC4gSXQncyB0aGUgZm91bmRhdGlvbiBvZiBhbGwgd2ViIGRldmVsb3BtZW50IGFuZCB0YWtlcyBtb3N0IHN0dWRlbnRzIGp1c3QgM1x1MjAxMzQgaG91cnMgdG8gY29tcGxldGUuIFRoZW4gbW92ZSB0byBDU1MsIHRoZW4gSmF2YVNjcmlwdC4gVGhpcyB0aHJlZS1jb3Vyc2UgcGF0aCBnaXZlcyB5b3UgYSBmdWxsIGZyb250ZW5kIHdlYiBkZXZlbG9wbWVudCBmb3VuZGF0aW9uIFx1MjAxNCBhbGwgZnJlZSwgYWxsIHdpdGggY2VydGlmaWNhdGVzLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RNDogQ2FuIHN0dWRlbnRzIGZyb20gYW55IGNvbGxlZ2UgaW4gSW5kaWEgam9pbiBTa2lsbFZhbGl4Pzwvc3Ryb25nPjxici8+XG4gICAgICBBYnNvbHV0ZWx5LiBTa2lsbFZhbGl4IGlzIG9wZW4gdG8gYWxsIHN0dWRlbnRzIGFjcm9zcyBJbmRpYSBcdTIwMTQgVGllci0xLCBUaWVyLTIsIGFuZCBUaWVyLTMgY29sbGVnZXMuIFRoZSBwbGF0Zm9ybSB3YXMgc3BlY2lmaWNhbGx5IGJ1aWx0IHRvIGdpdmUgZXF1YWwgb3Bwb3J0dW5pdHkgdG8gc3R1ZGVudHMgd2hvIGRvbid0IGhhdmUgYWNjZXNzIHRvIHByZW1pdW0gY29hY2hpbmcgb3IgZXhwZW5zaXZlIGNvdXJzZXMuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnTmVoYSBTaGFybWEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTA2VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTA4VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgNiwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxMSBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxMTgwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnRnJlZSBDb3Vyc2VzIEluZGlhJywgJ0ZyZWUgQ2VydGlmaWNhdGUgSW5kaWEnLCAnT25saW5lIExlYXJuaW5nIEluZGlhJywgJ1NraWxsVmFsaXgnLCAnU3R1ZGVudCBTa2lsbHMnLCAnQ2VydGlmaWNhdGlvbiddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0MzQwMzAyMTY0MTEtMGI3OTNmNGI0MTczP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ0luZGlhbiBzdHVkZW50IHN0dWR5aW5nIG9ubGluZSBvbiBsYXB0b3Agd2l0aCBmcmVlIGNvdXJzZSBjZXJ0aWZpY2F0ZSBvbiBzY3JlZW4nLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvZnJlZS1vbmxpbmUtY291cnNlcy13aXRoLWNlcnRpZmljYXRlLWluZGlhLTIwMjYnLFxuICAgIHJlbGF0ZWRDb3Vyc2U6IHtcbiAgICAgIHRpdGxlOiAnRnJlZSBPbmxpbmUgQ291cnNlcyBcdTIwMTQgQWxsIFN1YmplY3RzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3RhcnQgd2l0aCBIVE1MIFx1MjAxNCB0aGUgZm91bmRhdGlvbiBvZiBhbGwgd2ViIGRldmVsb3BtZW50LiBGcmVlIGNvdXJzZSwgZnJlZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdob3ctdG8td2luLWEtaGFja2F0aG9uLWJlZ2lubmVyLWd1aWRlLTIwMjYnLFxuICAgIHRpdGxlOiAnSG93IHRvIFdpbiBhIEhhY2thdGhvbjogQ29tcGxldGUgQmVnaW5uZXIgR3VpZGUgKDIwMjYpJyxcbiAgICBtZXRhVGl0bGU6ICdIb3cgdG8gV2luIGEgSGFja2F0aG9uOiBCZWdpbm5lciBTdHJhdGVneSBHdWlkZSAyMDI2IHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnV2FudCB0byB3aW4geW91ciBmaXJzdCBoYWNrYXRob24/IFRoaXMgY29tcGxldGUgYmVnaW5uZXIgZ3VpZGUgY292ZXJzIHRlYW0gZm9ybWF0aW9uLCBpZGVhIHNlbGVjdGlvbiwgcHJvamVjdCBleGVjdXRpb24sIGFuZCBwcmVzZW50YXRpb24gc3RyYXRlZ2llcyB0aGF0IGp1ZGdlcyBhY3R1YWxseSByZXdhcmQuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ2hvdyB0byB3aW4gYSBoYWNrYXRob24nLFxuICAgICAgJ2hhY2thdGhvbiB0aXBzIGZvciBiZWdpbm5lcnMnLFxuICAgICAgJ2hvdyB0byBwYXJ0aWNpcGF0ZSBpbiBoYWNrYXRob24nLFxuICAgICAgJ2hhY2thdGhvbiBzdHJhdGVneSAyMDI2JyxcbiAgICAgICdmaXJzdCBoYWNrYXRob24gdGlwcycsXG4gICAgICAnb25saW5lIGhhY2thdGhvbiBmb3IgYmVnaW5uZXJzIEluZGlhJyxcbiAgICAgICdoYWNrYXRob24gcHJvamVjdCBpZGVhcycsXG4gICAgICAnaGFja2F0aG9uIHdpbm5pbmcgdGlwcycsXG4gICAgXSxcbiAgICBleGNlcnB0OiAnTW9zdCBiZWdpbm5lcnMgbG9zZSBoYWNrYXRob25zIG5vdCBiZWNhdXNlIHRoZXkgbGFjayBza2lsbCBcdTIwMTQgYnV0IGJlY2F1c2UgdGhleSBwaWNrIHRoZSB3cm9uZyBpZGVhLCBidXJuIHRpbWUgb24gdGhlIHdyb25nIGZlYXR1cmVzLCBvciBwcmVzZW50IGJhZGx5LiBIZXJlIGlzIHRoZSBjb21wbGV0ZSBzdHJhdGVneSBndWlkZSBmb3IgeW91ciBmaXJzdCBoYWNrYXRob24gd2luLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPldoeSBNb3N0IEJlZ2lubmVycyBEb24ndCBXaW4gXHUyMDE0IEFuZCBIb3cgdG8gRml4IEl0PC9oMj5cbiAgICAgIDxwPlRoZSAjMSByZWFzb24gYmVnaW5uZXJzIGRvbid0IHdpbiBoYWNrYXRob25zIGhhcyBub3RoaW5nIHRvIGRvIHdpdGggY29kaW5nIGFiaWxpdHkuIEl0J3Mgc3RyYXRlZ3kuIE1vc3QgZmlyc3QtdGltZXJzIHRyeSB0byBidWlsZCBzb21ldGhpbmcgaW1wcmVzc2l2ZSByYXRoZXIgdGhhbiBzb21ldGhpbmcgPGVtPmNvbXBsZXRlPC9lbT4uIEp1ZGdlcyBkb24ndCByZXdhcmQgYW1iaXRpb24gXHUyMDE0IHRoZXkgcmV3YXJkIGV4ZWN1dGlvbi4gQSBzaW1wbGUgaWRlYSB0aGF0IGFjdHVhbGx5IHdvcmtzIGJlYXRzIGEgY29tcGxleCBpZGVhIHRoYXQgYmFyZWx5IHJ1bnMgZXZlcnkgc2luZ2xlIHRpbWUuPC9wPlxuICAgICAgPHA+VGhpcyBndWlkZSBnaXZlcyB5b3UgdGhlIGV4YWN0IHN0cmF0ZWd5IHRvIG1heGltaXplIHlvdXIgY2hhbmNlcyBvZiB3aW5uaW5nIHlvdXIgZmlyc3QgaGFja2F0aG9uIFx1MjAxNCBldmVuIGlmIHlvdSdyZSBhIGJlZ2lubmVyLCBldmVuIGlmIHlvdSdyZSBhIHNvbG8gcGFydGljaXBhbnQsIGFuZCBldmVuIGlmIHlvdSd2ZSBuZXZlciBidWlsdCBhbnl0aGluZyBhdCBzY2FsZSBiZWZvcmUuPC9wPlxuXG4gICAgICA8aDI+U3RlcCAxOiBQaWNrIHRoZSBSaWdodCBIYWNrYXRob248L2gyPlxuICAgICAgPHA+Tm90IGFsbCBoYWNrYXRob25zIGFyZSBlcXVhbC4gQXMgYSBiZWdpbm5lciwgbG9vayBmb3I6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5CZWdpbm5lci1mcmllbmRseSB0aGVtZXM6PC9zdHJvbmc+IFwiU29jaWFsIEltcGFjdFwiLCBcIkVkVGVjaFwiLCBcIkhlYWx0aFwiIGFyZSBlYXNpZXIgdG8gYnVpbGQgZm9yIHRoYW4gXCJCbG9ja2NoYWluXCIgb3IgXCJRdWFudHVtIENvbXB1dGluZ1wiPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+T25saW5lIGZvcm1hdDo8L3N0cm9uZz4gT25saW5lIGhhY2thdGhvbnMgcmVtb3ZlIHRyYXZlbCBzdHJlc3MgYW5kIGxldCB5b3Ugd29yayBpbiB5b3VyIG93biBlbnZpcm9ubWVudC4gPGEgaHJlZj1cIi9oYWNrYXRob25zXCI+U2tpbGxWYWxpeCBoYWNrYXRob25zPC9hPiBhcmUgMTAwJSBvbmxpbmUgYW5kIGZyZWUgdG8gZW50ZXIuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UGFydGljaXBhdGlvbiBjZXJ0aWZpY2F0ZXM6PC9zdHJvbmc+IEV2ZW4gaWYgeW91IGRvbid0IHdpbiwgeW91IGxlYXZlIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIGRvY3VtZW50aW5nIHlvdXIgcGFydGljaXBhdGlvbjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlNvbG8gb3Igc21hbGwgdGVhbSBvcHRpb25zOjwvc3Ryb25nPiBTb2xvIHBhcnRpY2lwYXRpb24gbWVhbnMgeW91IGNvbnRyb2wgZXZlcnkgZGVjaXNpb24gYW5kIHN1Ym1pdCB3aXRob3V0IGNvb3JkaW5hdGlvbiBjb21wbGV4aXR5PC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5TdGVwIDI6IElkZWEgU2VsZWN0aW9uIFx1MjAxNCBUaGluayBTbWFsbCwgVGhpbmsgQ29tcGxldGU8L2gyPlxuICAgICAgPHA+VGhlIG1vc3QgY29tbW9uIGJlZ2lubmVyIG1pc3Rha2UgaXMgc2NvcGUgY3JlZXAgXHUyMDE0IHBpY2tpbmcgYW4gaWRlYSB0aGF0IHJlcXVpcmVzIDEwIGZlYXR1cmVzIGFuZCBvbmx5IGZpbmlzaGluZyAzLiBIZXJlJ3MgdGhlIHdpbm5pbmcgZnJhbWV3b3JrOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+T25lIGNvcmUgcHJvYmxlbSwgb25lIGNvcmUgc29sdXRpb24uPC9zdHJvbmc+IElmIHlvdSBjYW4ndCBkZXNjcmliZSB5b3VyIHByb2plY3QgaW4gb25lIHNlbnRlbmNlLCBpdCdzIHRvbyBjb21wbGV4LjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlNvbHZlIGEgcmVhbCBwcm9ibGVtIGZvciBhIHNwZWNpZmljIHVzZXIuPC9zdHJvbmc+IFwiQW4gYXBwIGZvciBzdHVkZW50cyB0byB0cmFjayBzdHVkeSB0aW1lIHdpdGggYXV0by1zY2hlZHVsaW5nXCIgYmVhdHMgXCJBbiBBSS1wb3dlcmVkIHN1cGVyIHBsYXRmb3JtIGZvciBwcm9kdWN0aXZpdHlcIjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkJ1aWxkIHNvbWV0aGluZyB5b3UgY2FuIGRlbW8gaW4gMiBtaW51dGVzLjwvc3Ryb25nPiBKdWRnZXMgc2VlIGRvemVucyBvZiBwcm9qZWN0cy4gQSBjbGVhbiwgd29ya2luZyBkZW1vIHRoYXQgdGFrZXMgOTAgc2Vjb25kcyB0byBzaG93IHdpbnMgb3ZlciBhIHBvbGlzaGVkIHBpdGNoIGRlY2sgZm9yIHNvbWV0aGluZyB0aGF0IGRvZXNuJ3Qgd29yay48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPlN0ZXAgMzogVGVhbSBGb3JtYXRpb24gKElmIFlvdSdyZSBOb3QgU29sbyk8L2gyPlxuICAgICAgPHA+VGhlIGlkZWFsIGhhY2thdGhvbiB0ZWFtIG9mIDJcdTIwMTM0IHBlb3BsZSBoYXMgb25lIHBlcnNvbiBpbiBlYWNoIHJvbGU6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5CdWlsZGVyL0RldmVsb3Blcjo8L3N0cm9uZz4gRm9jdXNlcyBvbiBtYWtpbmcgdGhlIHByb2R1Y3QgYWN0dWFsbHkgd29yazwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkRlc2lnbmVyOjwvc3Ryb25nPiBNYWtlcyBpdCBsb29rIGNyZWRpYmxlIFx1MjAxNCBldmVuIGJhc2ljIEZpZ21hIG1vY2t1cHMgaGVscCBlbm9ybW91c2x5PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UHJlc2VudGVyOjwvc3Ryb25nPiBPd25zIHRoZSBwaXRjaCBhbmQgdGhlIGRlbW8gXHUyMDE0IHRoZSBwZXJzb24gd2hvIGNhbiB0YWxrIGNvbmZpZGVudGx5IGFib3V0IHRoZSBwcm9ibGVtIGFuZCBzb2x1dGlvbjwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+SWYgeW91J3JlIGJ1aWxkaW5nIHNvbG8sIGFsbG9jYXRlIHlvdXIgdGltZTogNzAlIGJ1aWxkaW5nLCAyMCUgZGVzaWduaW5nL3BvbGlzaGluZywgMTAlIHByZXBhcmluZyB5b3VyIHByZXNlbnRhdGlvbiBvciBzdWJtaXNzaW9uIGRvY3VtZW50LjwvcD5cblxuICAgICAgPGgyPlN0ZXAgNDogRXhlY3V0aW9uIFx1MjAxNCBUaGUgMy1QaGFzZSBBcHByb2FjaDwvaDI+XG4gICAgICA8aDM+UGhhc2UgMTogRm91bmRhdGlvbiAoRmlyc3QgMzAlIG9mIHRpbWUpPC9oMz5cbiAgICAgIDxwPkdldCB0aGUgY29yZSB3b3JraW5nLiBObyBVSSBwb2xpc2gsIG5vIGV4dHJhIGZlYXR1cmVzIFx1MjAxNCBqdXN0IHRoZSBlc3NlbnRpYWwgdXNlciBmbG93IHdvcmtpbmcgZW5kIHRvIGVuZC4gVGhpcyBpcyB5b3VyIHNhZmV0eSBuZXQuIElmIHlvdSBydW4gb3V0IG9mIHRpbWUsIHRoaXMgaXMgd2hhdCB5b3Ugc3VibWl0LjwvcD5cblxuICAgICAgPGgzPlBoYXNlIDI6IFBvbGlzaCAoTWlkZGxlIDUwJSBvZiB0aW1lKTwvaDM+XG4gICAgICA8cD5BZGQgdGhlIFVJIGxheWVyLCBmaXggb2J2aW91cyBidWdzLCBjb25uZWN0IGxvb3NlIHdpcmVzLiBUaGlzIGlzIHdoZXJlIG1vc3Qgb2YgeW91ciB2aXNpYmxlIHByb2dyZXNzIGNvbWVzIGZyb20uPC9wPlxuXG4gICAgICA8aDM+UGhhc2UgMzogU3VibWlzc2lvbiBQcmVwIChGaW5hbCAyMCUgb2YgdGltZSk8L2gzPlxuICAgICAgPHA+U3RvcCBhZGRpbmcgZmVhdHVyZXMuIFdyaXRlIHlvdXIgUkVBRE1FIG9yIHN1Ym1pc3Npb24gZG9jdW1lbnQuIFJlY29yZCBhIGNsZWFyIGRlbW8gdmlkZW8gaWYgcmVxdWlyZWQuIEEgd2VsbC1kb2N1bWVudGVkLCBtZWRpb2NyZSBwcm9qZWN0IGNvbnNpc3RlbnRseSBiZWF0cyBhbiB1bmRvY3VtZW50ZWQgZXhjZWxsZW50IG9uZS48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDU6IFRoZSBXaW5uaW5nIFN1Ym1pc3Npb248L2gyPlxuICAgICAgPHA+TW9zdCBoYWNrYXRob24gc3VibWlzc2lvbnMgYXJlIGp1ZGdlZCBvbiA0IHRoaW5nczo8L3A+XG4gICAgICA8b2w+XG4gICAgICAgIDxsaT48c3Ryb25nPlByb2JsZW0gY2xhcml0eTo8L3N0cm9uZz4gRGlkIHlvdSBjbGVhcmx5IGRlZmluZSBhIHJlYWwgcHJvYmxlbT88L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Tb2x1dGlvbiBxdWFsaXR5Ojwvc3Ryb25nPiBEb2VzIHlvdXIgc29sdXRpb24gYWN0dWFsbHkgYWRkcmVzcyB0aGUgcHJvYmxlbT88L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5UZWNobmljYWwgZXhlY3V0aW9uOjwvc3Ryb25nPiBEb2VzIGl0IHdvcms/IElzIHRoZSBjb2RlIHJlYXNvbmFibGU/PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+SW1wYWN0IHBvdGVudGlhbDo8L3N0cm9uZz4gQ291bGQgdGhpcyBhY3R1YWxseSBoZWxwIHBlb3BsZSBpZiBkZXZlbG9wZWQgZnVydGhlcj88L2xpPlxuICAgICAgPC9vbD5cbiAgICAgIDxwPlN0cnVjdHVyZSB5b3VyIHN1Ym1pc3Npb24gZG9jdW1lbnQgYXJvdW5kIHRoZXNlIGZvdXIgcG9pbnRzLiBPbmUgcGFyYWdyYXBoIGVhY2guIENsZWFyLCBkaXJlY3QgbGFuZ3VhZ2UuIE5vIGphcmdvbi48L3A+XG5cbiAgICAgIDxoMj5XaGVyZSB0byBQcmFjdGljZTogRnJlZSBIYWNrYXRob25zIG9uIFNraWxsVmFsaXg8L2gyPlxuICAgICAgPHA+VGhlIGJlc3Qgd2F5IHRvIGdldCBiZXR0ZXIgYXQgaGFja2F0aG9ucyBpcyB0byBkbyB0aGVtLiA8YSBocmVmPVwiL2hhY2thdGhvbnNcIj5Ta2lsbFZhbGl4IGhhY2thdGhvbnM8L2E+IGFyZSBzcGVjaWZpY2FsbHkgZGVzaWduZWQgZm9yIGJlZ2lubmVycyBhZ2VkIDE2XHUyMDEzMzAuIFRoZXkncmUgb25saW5lLCBmcmVlIHRvIGVudGVyLCBoYXZlIGJlZ2lubmVyLWZyaWVuZGx5IHRoZW1lcywgYW5kIGV2ZXJ5IHBhcnRpY2lwYW50IHJlY2VpdmVzIGEgdmVyaWZpZWQgY2VydGlmaWNhdGUgd2hldGhlciB0aGV5IHdpbiBvciBub3QuIFdpbm5pbmcgdGVhbXMgcmVjZWl2ZSBtZXJpdCBjZXJ0aWZpY2F0ZXMgdGhhdCBhcmUgdmVyaWZpYWJsZSBvbiB5b3VyIHB1YmxpYyBwcm9maWxlLjwvcD5cbiAgICAgIDxwPkJlZm9yZSB5b3Ugam9pbiwgc3RyZW5ndGhlbiB5b3VyIGZ1bmRhbWVudGFscyBcdTIwMTQgdGhlIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhc2NyaXB0LW1hc3RlcmNsYXNzXCI+ZnJlZSBKYXZhU2NyaXB0IGNvdXJzZTwvYT4gYW5kIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3NcIj5mcmVlIFB5dGhvbiBjb3Vyc2U8L2E+IG9uIFNraWxsVmFsaXggd2lsbCBnaXZlIHlvdSB0aGUgdGVjaG5pY2FsIGZvdW5kYXRpb24gdG8gYnVpbGQgc29tZXRoaW5nIG1lYW5pbmdmdWwgaW4gYW55IGhhY2thdGhvbiBlbnZpcm9ubWVudC48L3A+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9uczwvaDI+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IENhbiBhIGNvbXBsZXRlIGJlZ2lubmVyIHdpbiBhIGhhY2thdGhvbj88L3N0cm9uZz48YnIvPlxuICAgICAgWWVzIFx1MjAxNCBpZiB0aGV5IHBpY2sgdGhlIHJpZ2h0IGhhY2thdGhvbiBhbmQgZXhlY3V0ZSBzdHJhdGVnaWNhbGx5LiBCZWdpbm5lcnMgd2hvIGZvY3VzIG9uIGJ1aWxkaW5nIGEgc2ltcGxlLCBjb21wbGV0ZSwgd2VsbC1kb2N1bWVudGVkIHNvbHV0aW9uIG9mdGVuIGJlYXQgYWR2YW5jZWQgdGVhbXMgd2hvIG92ZXJzY29wZSBhbmQgc3VibWl0IHNvbWV0aGluZyBicm9rZW4uIEV4ZWN1dGlvbiBiZWF0cyBhbWJpdGlvbiBldmVyeSB0aW1lLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogRG8gSSBuZWVkIGEgdGVhbSB0byBwYXJ0aWNpcGF0ZSBpbiBoYWNrYXRob25zPzwvc3Ryb25nPjxici8+XG4gICAgICBOby4gTWFueSBoYWNrYXRob25zLCBpbmNsdWRpbmcgdGhvc2Ugb24gU2tpbGxWYWxpeCwgYWxsb3cgc29sbyBwYXJ0aWNpcGF0aW9uLiBTb2xvIHN1Ym1pc3Npb25zIGFyZSBldmFsdWF0ZWQgb24gdGhlIHNhbWUgY3JpdGVyaWEgYXMgdGVhbSBzdWJtaXNzaW9ucy4gV29ya2luZyBzb2xvIG1lYW5zIHlvdSBjb250cm9sIGV2ZXJ5IGRlY2lzaW9uLCB3aGljaCBjYW4gYmUgYW4gYWR2YW50YWdlIGZvciBiZWdpbm5lcnMgbGVhcm5pbmcgdGhlaXIgd29ya2Zsb3cuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBXaGF0IHByb2dyYW1taW5nIGxhbmd1YWdlcyBzaG91bGQgSSBrbm93IGZvciBoYWNrYXRob25zPzwvc3Ryb25nPjxici8+XG4gICAgICBIVE1MICsgQ1NTICsgSmF2YVNjcmlwdCBjb3ZlcnMgdGhlIHZhc3QgbWFqb3JpdHkgb2YgaGFja2F0aG9uIHVzZSBjYXNlcyAod2ViIGFwcHMpLiBQeXRob24gaXMgdXNlZnVsIGZvciBkYXRhL0FJIHRoZW1lZCBjaGFsbGVuZ2VzLiBNb3N0IGp1ZGdlcyBkb24ndCBjYXJlIHdoaWNoIGxhbmd1YWdlIHlvdSB1c2UgXHUyMDE0IHRoZXkgY2FyZSB0aGF0IHlvdXIgcHJvamVjdCB3b3Jrcy48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTQ6IEhvdyBkbyBJIGdldCBhIGhhY2thdGhvbiBwYXJ0aWNpcGF0aW9uIGNlcnRpZmljYXRlPzwvc3Ryb25nPjxici8+XG4gICAgICBPbiBTa2lsbFZhbGl4LCBldmVyeSBwYXJ0aWNpcGFudCB3aG8gc3VibWl0cyBhIHZhbGlkIHByb2plY3QgcmVjZWl2ZXMgYSB2ZXJpZmllZCBwYXJ0aWNpcGF0aW9uIGNlcnRpZmljYXRlLiBXaW5uZXJzIHJlY2VpdmUgc3BlY2lhbCBtZXJpdCBjZXJ0aWZpY2F0ZXMuIEJvdGggYXJlIHZlcmlmaWFibGUgb24geW91ciBwdWJsaWMgU2tpbGxWYWxpeCBwcm9maWxlLjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ0FtaXQgUGF0ZWwnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTA3VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTA4VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgNywgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxMiBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxMjUwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnSGFja2F0aG9uIFRpcHMnLCAnSG93IHRvIFdpbiBIYWNrYXRob24nLCAnQmVnaW5uZXIgSGFja2F0aG9uJywgJ09ubGluZSBIYWNrYXRob24gSW5kaWEnLCAnU3R1ZGVudCBIYWNrYXRob24nLCAnSGFja2F0aG9uIFN0cmF0ZWd5J10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDM4NDMwODA5MC1jODk0ZmRjYzUzOGQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnU3R1ZGVudHMgY29sbGFib3JhdGluZyBvbiBhIGhhY2thdGhvbiBwcm9qZWN0IHdpdGggbGFwdG9wcyBpbiBhIGJyaWdodCB3b3Jrc3BhY2UnLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvaG93LXRvLXdpbi1hLWhhY2thdGhvbi1iZWdpbm5lci1ndWlkZS0yMDI2JyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1VsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3MnLFxuICAgICAgc2x1ZzogJ3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdCdWlsZCB0aGUgSmF2YVNjcmlwdCBza2lsbHMgeW91IG5lZWQgdG8gc2hpcCBhIGhhY2thdGhvbiBwcm9qZWN0IGluIGhvdXJzLiBGcmVlIHdpdGggY2VydGlmaWNhdGUuJ1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnd2ViLWRldmVsb3BtZW50LXJvYWRtYXAtMjAyNi1iZWdpbm5lcnMnLFxuICAgIHRpdGxlOiAnV2ViIERldmVsb3BtZW50IFJvYWRtYXAgMjAyNjogVGhlIENvbXBsZXRlIEZyZWUgR3VpZGUgZm9yIEJlZ2lubmVycycsXG4gICAgbWV0YVRpdGxlOiAnV2ViIERldmVsb3BtZW50IFJvYWRtYXAgMjAyNjogQ29tcGxldGUgRnJlZSBHdWlkZSBmb3IgQmVnaW5uZXJzIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnRm9sbG93IHRoZSBjb21wbGV0ZSB3ZWIgZGV2ZWxvcG1lbnQgcm9hZG1hcCBmb3IgMjAyNi4gTGVhcm4gSFRNTCwgQ1NTLCBKYXZhU2NyaXB0LCBSZWFjdCwgTm9kZS5qcyBhbmQgbW9yZSBcdTIwMTQgaW4gdGhlIHJpZ2h0IG9yZGVyLCB3aXRoIGZyZWUgcmVzb3VyY2VzIGFuZCBjZXJ0aWZpY2F0ZXMgYXQgZXZlcnkgc3RlcC4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnd2ViIGRldmVsb3BtZW50IHJvYWRtYXAgMjAyNicsXG4gICAgICAnaG93IHRvIGJlY29tZSBhIHdlYiBkZXZlbG9wZXIgMjAyNicsXG4gICAgICAnd2ViIGRldmVsb3BtZW50IGZvciBiZWdpbm5lcnMnLFxuICAgICAgJ2Zyb250ZW5kIGRldmVsb3BtZW50IHJvYWRtYXAnLFxuICAgICAgJ2xlYXJuIHdlYiBkZXZlbG9wbWVudCBmcmVlIEluZGlhJyxcbiAgICAgICd3ZWIgZGV2ZWxvcGVyIHJvYWRtYXAgYmVnaW5uZXJzJyxcbiAgICAgICdIVE1MIENTUyBKYXZhU2NyaXB0IHJvYWRtYXAnLFxuICAgICAgJ2Z1bGwgc3RhY2sgZGV2ZWxvcG1lbnQgcm9hZG1hcCAyMDI2JyxcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdUaGVyZVxcJ3Mgbm8gc2hvcnRhZ2Ugb2Ygd2ViIGRldmVsb3BtZW50IGNvbnRlbnQgXHUyMDE0IGJ1dCBubyBvbmUgdGVsbHMgeW91IHdoYXQgdG8gbGVhcm4gZmlyc3QsIHdoYXQgdG8gc2tpcCwgYW5kIHdoYXQgb3JkZXIgYWN0dWFsbHkgbWFrZXMgc2Vuc2UuIFRoaXMgaXMgdGhlIGNvbXBsZXRlLCBvcGluaW9uYXRlZCByb2FkbWFwIGZvciAyMDI2LicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPlRoZSBQcm9ibGVtIHdpdGggTW9zdCBXZWIgRGV2IFJvYWRtYXBzPC9oMj5cbiAgICAgIDxwPlNlYXJjaCBcIndlYiBkZXZlbG9wbWVudCByb2FkbWFwXCIgYW5kIHlvdSdsbCBnZXQgYSAyMDAtdGVjaG5vbG9neSBkaWFncmFtIHRoYXQgbWFrZXMgeW91IGZlZWwgbGlrZSB5b3UgbmVlZCA1IHllYXJzIHRvIGV2ZW4gc3RhcnQuIFRoaXMgZ3VpZGUgaXMgZGlmZmVyZW50LiBJdCBnaXZlcyB5b3UgdGhlIGV4YWN0IGxlYXJuaW5nIHBhdGggXHUyMDE0IGluIHNlcXVlbmNlLCB3aXRoIHRpbWUgZXN0aW1hdGVzIFx1MjAxNCB0byBnbyBmcm9tIHplcm8gdG8gam9iLXJlYWR5IHdlYiBkZXZlbG9wZXIgdXNpbmcgb25seSBmcmVlIHJlc291cmNlcy48L3A+XG5cbiAgICAgIDxoMj5QaGFzZSAxOiBIVE1MIFx1MjAxNCBUaGUgTm9uLU5lZ290aWFibGUgRm91bmRhdGlvbiAoMlx1MjAxMzQgd2Vla3MpPC9oMj5cbiAgICAgIDxwPkV2ZXJ5IHdlYnNpdGUgb24gdGhlIGludGVybmV0IGlzIGJ1aWx0IG9uIEhUTUwuIE5vIGV4Y2VwdGlvbnMuIFlvdSBjYW5ub3Qgc2tpcCB0aGlzLiBIVE1MIHRlYWNoZXMgeW91IHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHdlYiBcdTIwMTQgaG93IGJyb3dzZXJzIHVuZGVyc3RhbmQgY29udGVudCwgaG93IHBhZ2VzIGFyZSBvcmdhbml6ZWQsIGFuZCBob3cgdG8gd3JpdGUgbWVhbmluZ2Z1bCBtYXJrdXAgdGhhdCBzZWFyY2ggZW5naW5lcyBhbmQgc2NyZWVuIHJlYWRlcnMgY2FuIHVuZGVyc3RhbmQuPC9wPlxuICAgICAgPHA+V2hhdCB0byBsZWFybiBpbiBIVE1MOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPkRvY3VtZW50IHN0cnVjdHVyZTogRE9DVFlQRSwgaHRtbCwgaGVhZCwgYm9keTwvbGk+XG4gICAgICAgIDxsaT5TZW1hbnRpYyB0YWdzOiBhcnRpY2xlLCBzZWN0aW9uLCBuYXYsIGhlYWRlciwgZm9vdGVyLCBtYWluLCBhc2lkZTwvbGk+XG4gICAgICAgIDxsaT5MaW5rcywgaW1hZ2VzLCBhbmQgbXVsdGltZWRpYTwvbGk+XG4gICAgICAgIDxsaT5Gb3JtcyBhbmQgaW5wdXQgdmFsaWRhdGlvbjwvbGk+XG4gICAgICAgIDxsaT5UYWJsZXMgYW5kIGxpc3RzPC9saT5cbiAgICAgICAgPGxpPkFjY2Vzc2liaWxpdHkgYmFzaWNzIChhcmlhLWxhYmVsLCBhbHQgYXR0cmlidXRlcyk8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkZyZWUgcmVzb3VyY2U6IDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzXCI+VGhlIFVsdGltYXRlIEhUTUwgTWFzdGVyY2xhc3Mgb24gU2tpbGxWYWxpeDwvYT4gY292ZXJzIGFsbCBvZiB0aGlzIHdpdGggY29kZSBleGFtcGxlcywgcXVpenplcywgYW5kIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS48L3A+XG4gICAgICA8cD48c3Ryb25nPlRpbWUgZXN0aW1hdGU6PC9zdHJvbmc+IDNcdTIwMTM0IGhvdXJzIG9mIGZvY3VzZWQgc3R1ZHkuIE1vc3QgZGV0ZXJtaW5lZCBiZWdpbm5lcnMgZmluaXNoIGluIGEgd2Vla2VuZC48L3A+XG5cbiAgICAgIDxoMj5QaGFzZSAyOiBDU1MgXHUyMDE0IE1ha2luZyBUaGluZ3MgTG9vayBHb29kICgzXHUyMDEzNSB3ZWVrcyk8L2gyPlxuICAgICAgPHA+SFRNTCBnaXZlcyB5b3Ugc3RydWN0dXJlLiBDU1MgZ2l2ZXMgeW91IGRlc2lnbi4gSW4gMjAyNiwgQ1NTIGlzIHJlbWFya2FibHkgcG93ZXJmdWwgXHUyMDE0IHlvdSBjYW4gYnVpbGQgY29tcGxleCBsYXlvdXRzLCBhbmltYXRpb25zLCBhbmQgcmVzcG9uc2l2ZSBkZXNpZ25zIHdpdGggcHVyZSBDU1MgYWxvbmUuPC9wPlxuICAgICAgPHA+V2hhdCB0byBsZWFybiBpbiBDU1M6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+U2VsZWN0b3JzLCBzcGVjaWZpY2l0eSwgYW5kIHRoZSBjYXNjYWRlPC9saT5cbiAgICAgICAgPGxpPkJveCBtb2RlbDogbWFyZ2luLCBwYWRkaW5nLCBib3JkZXI8L2xpPlxuICAgICAgICA8bGk+RmxleGJveCBcdTIwMTQgZm9yIG9uZS1kaW1lbnNpb25hbCBsYXlvdXRzIChuYXZiYXJzLCBjYXJkIHJvd3MpPC9saT5cbiAgICAgICAgPGxpPkNTUyBHcmlkIFx1MjAxNCBmb3IgdHdvLWRpbWVuc2lvbmFsIGxheW91dHMgKGZ1bGwgcGFnZSBzdHJ1Y3R1cmUpPC9saT5cbiAgICAgICAgPGxpPlJlc3BvbnNpdmUgZGVzaWduIGFuZCBtZWRpYSBxdWVyaWVzPC9saT5cbiAgICAgICAgPGxpPkNTUyBDdXN0b20gUHJvcGVydGllcyAodmFyaWFibGVzKTwvbGk+XG4gICAgICAgIDxsaT5UcmFuc2l0aW9ucyBhbmQgYW5pbWF0aW9uczwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+RnJlZSByZXNvdXJjZTogPGEgaHJlZj1cIi9jb3Vyc2VzL2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvXCI+Q1NTIGZvciBCZWdpbm5lcnM6IFplcm8gdG8gUHJvIG9uIFNraWxsVmFsaXg8L2E+IGNvdmVycyBldmVyeXRoaW5nIGFib3ZlIGluIGEgc3RydWN0dXJlZCwgYmVnaW5uZXItZmlyc3QgZm9ybWF0LjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+VGltZSBlc3RpbWF0ZTo8L3N0cm9uZz4gNVx1MjAxMzYgaG91cnMuIFRoaXMgaXMgd2hlcmUgYmVnaW5uZXJzIG9mdGVuIHNwZW5kIHRoZSBtb3N0IHRpbWUgXHUyMDE0IENTUyBpcyBpbnR1aXRpdmUgb25jZSBpdCBjbGlja3MsIGJ1dCBpdCB0YWtlcyBwcmFjdGljZS48L3A+XG5cbiAgICAgIDxoMj5QaGFzZSAzOiBKYXZhU2NyaXB0IFx1MjAxNCBCcmluZ2luZyBQYWdlcyB0byBMaWZlICg2XHUyMDEzMTAgd2Vla3MpPC9oMj5cbiAgICAgIDxwPkphdmFTY3JpcHQgaXMgdGhlIG1vc3QgaW1wb3J0YW50IGxhbmd1YWdlIGZvciB3ZWIgZGV2ZWxvcG1lbnQuIEl0IG1ha2VzIHdlYnNpdGVzIGludGVyYWN0aXZlIFx1MjAxNCBoYW5kbGluZyBjbGlja3MsIGZldGNoaW5nIGRhdGEgZnJvbSBBUElzLCB1cGRhdGluZyBjb250ZW50IHdpdGhvdXQgcGFnZSByZWxvYWRzLCBhbmQgYnVpbGRpbmcgY29tcGxleCB1c2VyIGludGVyZmFjZXMuPC9wPlxuICAgICAgPHA+V2hhdCB0byBsZWFybiBpbiBKYXZhU2NyaXB0IChpbiB0aGlzIG9yZGVyKTo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT5WYXJpYWJsZXMsIGRhdGEgdHlwZXMsIG9wZXJhdG9yczwvbGk+XG4gICAgICAgIDxsaT5GdW5jdGlvbnMsIHNjb3BlLCBhbmQgY2xvc3VyZXM8L2xpPlxuICAgICAgICA8bGk+RE9NIG1hbmlwdWxhdGlvbiBcdTIwMTQgc2VsZWN0aW5nLCBtb2RpZnlpbmcsIGFuZCBhZGRpbmcgSFRNTCBlbGVtZW50czwvbGk+XG4gICAgICAgIDxsaT5FdmVudHMgXHUyMDE0IGNsaWNrLCBzdWJtaXQsIGtleXByZXNzPC9saT5cbiAgICAgICAgPGxpPkFycmF5cyBhbmQgb2JqZWN0cyBcdTIwMTQgdGhlIHR3byBtb3N0IGltcG9ydGFudCBkYXRhIHN0cnVjdHVyZXM8L2xpPlxuICAgICAgICA8bGk+QXN5bmMgSmF2YVNjcmlwdCBcdTIwMTQgUHJvbWlzZXMsIGFzeW5jL2F3YWl0LCBmZXRjaCBBUEk8L2xpPlxuICAgICAgICA8bGk+RVM2KyBmZWF0dXJlcyBcdTIwMTQgYXJyb3cgZnVuY3Rpb25zLCBkZXN0cnVjdHVyaW5nLCBzcHJlYWQsIG1vZHVsZXM8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkZyZWUgcmVzb3VyY2U6IDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhc2NyaXB0LW1hc3RlcmNsYXNzXCI+VGhlIFVsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3Mgb24gU2tpbGxWYWxpeDwvYT4gY292ZXJzIGFsbCBvZiB0aGUgYWJvdmUgd2l0aCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUgb24gY29tcGxldGlvbi48L3A+XG4gICAgICA8cD48c3Ryb25nPlRpbWUgZXN0aW1hdGU6PC9zdHJvbmc+IDZcdTIwMTM4IGhvdXJzIG9mIGNvdXJzZSBjb250ZW50LCBwbHVzIDIwXHUyMDEzNDAgaG91cnMgb2YgcHJhY3RpY2UgcHJvamVjdHMuIEphdmFTY3JpcHQgcmVxdWlyZXMgYnVpbGRpbmcgdGhpbmdzIHRvIHRydWx5IGludGVybmFsaXplLjwvcD5cblxuICAgICAgPGgyPlBoYXNlIDQ6IEJ1aWxkIDMgUHJvamVjdHMgKDRcdTIwMTM2IHdlZWtzKTwvaDI+XG4gICAgICA8cD5BZnRlciBIVE1MLCBDU1MsIGFuZCBKYXZhU2NyaXB0LCBzdG9wIGxlYXJuaW5nIGFuZCBzdGFydCBidWlsZGluZy4gVGhlIHRocmVlIGJlc3QgYmVnaW5uZXIgcHJvamVjdHM6PC9wPlxuICAgICAgPG9sPlxuICAgICAgICA8bGk+PHN0cm9uZz5QZXJzb25hbCBwb3J0Zm9saW8gd2Vic2l0ZTwvc3Ryb25nPiBcdTIwMTQgU2hvd3MgeW91ciBIVE1ML0NTUyBza2lsbHMgYW5kIGJlY29tZXMgeW91ciBvbmxpbmUgcHJlc2VuY2U8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Uby1kbyBsaXN0IGFwcCB3aXRoIGxvY2FsU3RvcmFnZTwvc3Ryb25nPiBcdTIwMTQgVGVzdHMgeW91ciBKYXZhU2NyaXB0LCBET00gbWFuaXB1bGF0aW9uLCBhbmQgZGF0YSBwZXJzaXN0ZW5jZTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPldlYXRoZXIgYXBwIHVzaW5nIGEgcHVibGljIEFQSTwvc3Ryb25nPiBcdTIwMTQgSW50cm9kdWNlcyBhc3luYyBKYXZhU2NyaXB0LCBmZXRjaCwgYW5kIHdvcmtpbmcgd2l0aCBKU09OIGRhdGE8L2xpPlxuICAgICAgPC9vbD5cbiAgICAgIDxwPlB1dCB0aGVzZSBvbiBHaXRIdWIuIExpbmsgdGhlbSBpbiB5b3VyIExpbmtlZEluIHByb2ZpbGUuIFRoaXMgaXMgeW91ciBwb3J0Zm9saW8uPC9wPlxuXG4gICAgICA8aDI+UGhhc2UgNTogUmVhY3QgKDZcdTIwMTM4IHdlZWtzKTwvaDI+XG4gICAgICA8cD5SZWFjdCBpcyB0aGUgZG9taW5hbnQgSmF2YVNjcmlwdCBmcmFtZXdvcmsgZm9yIGJ1aWxkaW5nIGNvbXBsZXggdXNlciBpbnRlcmZhY2VzLiBJdCdzIHVzZWQgYnkgTWV0YSwgQWlyYm5iLCBOZXRmbGl4LCBhbmQgdGhvdXNhbmRzIG9mIHN0YXJ0dXBzLiBPbmNlIHlvdSB1bmRlcnN0YW5kIEphdmFTY3JpcHQsIFJlYWN0J3MgY29uY2VwdHMgKGNvbXBvbmVudHMsIHN0YXRlLCBwcm9wcywgaG9va3MpIGZvbGxvdyBsb2dpY2FsbHkuPC9wPlxuXG4gICAgICA8aDI+UGhhc2UgNjogQmFja2VuZCBCYXNpY3MgXHUyMDE0IE5vZGUuanMgJiBFeHByZXNzICg0XHUyMDEzNiB3ZWVrcyk8L2gyPlxuICAgICAgPHA+RnJvbnRlbmQgYWxvbmUgbGltaXRzIHdoYXQgeW91IGNhbiBidWlsZC4gTm9kZS5qcyBsZXRzIHlvdSB3cml0ZSBKYXZhU2NyaXB0IG9uIHRoZSBzZXJ2ZXIuIENvbWJpbmVkIHdpdGggRXhwcmVzcy5qcyBhbmQgYSBkYXRhYmFzZSBsaWtlIE1vbmdvREIsIHlvdSBjYW4gYnVpbGQgZnVsbC1zdGFjayBhcHBsaWNhdGlvbnMgXHUyMDE0IHRoZSBmb3VuZGF0aW9uIGZvciBtb3N0IG1vZGVybiB3ZWIgcHJvZHVjdHMuPC9wPlxuXG4gICAgICA8aDI+QWNjZWxlcmF0ZSB3aXRoIEhhY2thdGhvbnM8L2gyPlxuICAgICAgPHA+Tm90aGluZyBhY2NlbGVyYXRlcyBsZWFybmluZyBmYXN0ZXIgdGhhbiBidWlsZGluZyBzb21ldGhpbmcgdW5kZXIgcHJlc3N1cmUuIDxhIGhyZWY9XCIvaGFja2F0aG9uc1wiPlNraWxsVmFsaXggc3R1ZGVudCBoYWNrYXRob25zPC9hPiBnaXZlIHlvdSBhIHJlYWwgY29uc3RyYWludCBcdTIwMTQgYSB0aGVtZSwgYSBkZWFkbGluZSwgYW5kIGEgc3VibWlzc2lvbiByZXF1aXJlbWVudC4gVGhlIHByb2plY3RzIHlvdSBidWlsZCBpbiBoYWNrYXRob25zIGJlY29tZSB5b3VyIHN0cm9uZ2VzdCBwb3J0Zm9saW8gcGllY2VzLjwvcD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zPC9oMj5cblxuICAgICAgPHA+PHN0cm9uZz5RMTogSG93IGxvbmcgZG9lcyBpdCB0YWtlIHRvIGJlY29tZSBhIHdlYiBkZXZlbG9wZXIgZnJvbSBzY3JhdGNoPzwvc3Ryb25nPjxici8+XG4gICAgICBXaXRoIGZvY3VzZWQsIGNvbnNpc3RlbnQgZWZmb3J0ICgyXHUyMDEzMyBob3VycyBwZXIgZGF5KSwgbW9zdCBiZWdpbm5lcnMgYXJlIGpvYi1yZWFkeSBpbiA2XHUyMDEzMTIgbW9udGhzLiBUaGUgcm9hZG1hcCBhYm92ZSB0YWtlcyBhcHByb3hpbWF0ZWx5IDYgbW9udGhzIGZvciBhIGRlZGljYXRlZCBsZWFybmVyIHdvcmtpbmcgb24gd2Vla2VuZHMgYW5kIGV2ZW5pbmdzLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogRG8gSSBuZWVkIGEgY29tcHV0ZXIgc2NpZW5jZSBkZWdyZWUgdG8gYmVjb21lIGEgd2ViIGRldmVsb3Blcj88L3N0cm9uZz48YnIvPlxuICAgICAgTm8uIFdlYiBkZXZlbG9wbWVudCBpcyBvbmUgb2YgdGhlIG1vc3QgYWNjZXNzaWJsZSBmaWVsZHMgZm9yIHNlbGYtbGVhcm5lcnMuIFRob3VzYW5kcyBvZiBJbmRpYW4gZGV2ZWxvcGVycyBcdTIwMTQgaW5jbHVkaW5nIHNlbmlvciBlbmdpbmVlcnMgYXQgdG9wIHByb2R1Y3QgY29tcGFuaWVzIFx1MjAxNCBhcmUgc2VsZi10YXVnaHQuIFdoYXQgbWF0dGVycyBpcyB5b3VyIEdpdEh1YiBwb3J0Zm9saW8gYW5kIHlvdXIgYWJpbGl0eSB0byBidWlsZCB0aGluZ3MuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBXaGljaCBpcyB0aGUgYmVzdCBmaXJzdCBwcm9ncmFtbWluZyBsYW5ndWFnZSBmb3Igd2ViIGRldmVsb3BtZW50Pzwvc3Ryb25nPjxici8+XG4gICAgICBIVE1MIGZpcnN0IChpdCdzIG5vdCB0ZWNobmljYWxseSBhIHByb2dyYW1taW5nIGxhbmd1YWdlIGJ1dCBpdCdzIHRoZSBmb3VuZGF0aW9uKSwgdGhlbiBDU1MsIHRoZW4gSmF2YVNjcmlwdC4gVGhpcyBvcmRlciBpcyBub24tbmVnb3RpYWJsZSBcdTIwMTQgZWFjaCBidWlsZHMgb24gdGhlIHByZXZpb3VzIG9uZS48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTQ6IEFyZSBmcmVlIGNvdXJzZXMgZW5vdWdoIHRvIGdldCBhIHdlYiBkZXZlbG9wbWVudCBqb2I/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFllcywgaWYgeW91IHN1cHBsZW1lbnQgdGhlbSB3aXRoIHJlYWwgcHJvamVjdHMuIFRoZSBmcmVlIEhUTUwsIENTUywgYW5kIEphdmFTY3JpcHQgY291cnNlcyBvbiBTa2lsbFZhbGl4IFx1MjAxNCBjb21iaW5lZCB3aXRoIDNcdTIwMTM1IHBvcnRmb2xpbyBwcm9qZWN0cyBhbmQgYSBoYWNrYXRob24gcGFydGljaXBhdGlvbiBcdTIwMTQgZ2l2ZSB5b3UgZXZlcnl0aGluZyB5b3UgbmVlZCB0byBhcHBseSBmb3IganVuaW9yIGZyb250ZW5kIHJvbGVzLjwvcD5cbiAgICBgLFxuICAgIGF1dGhvcjogJ1JpeWEgRGVzYWknLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTA4VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTA4VDA5OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgOCwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxMyBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxMzIwLFxuICAgIGNhdGVnb3J5OiAnQ2FyZWVyICYgSW5kdXN0cnknLFxuICAgIHRhZ3M6IFsnV2ViIERldmVsb3BtZW50IFJvYWRtYXAnLCAnTGVhcm4gV2ViIERldmVsb3BtZW50JywgJ0Zyb250ZW5kIERldmVsb3BtZW50JywgJ0hUTUwgQ1NTIEphdmFTY3JpcHQnLCAnV2ViIERldiAyMDI2JywgJ0JlZ2lubmVyIEd1aWRlJ10sXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5ODA1MDEwODAyMy1jNTI0OWY0ZGYwODU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0xMjAwJnE9ODAnLFxuICAgIGltYWdlQWx0OiAnRGV2ZWxvcGVyIGxvb2tpbmcgYXQgd2ViIGRldmVsb3BtZW50IHJvYWRtYXAgb24gZHVhbCBtb25pdG9yIHNldHVwJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL3dlYi1kZXZlbG9wbWVudC1yb2FkbWFwLTIwMjYtYmVnaW5uZXJzJyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1RoZSBVbHRpbWF0ZSBIVE1MIE1hc3RlcmNsYXNzJyxcbiAgICAgIHNsdWc6ICd1bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3RhcnQgeW91ciB3ZWIgZGV2ZWxvcG1lbnQgam91cm5leSBoZXJlLiBGcmVlIGNvdXJzZSwgZnJlZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdqYXZhc2NyaXB0LWludGVydmlldy1xdWVzdGlvbnMtMjAyNicsXG4gICAgdGl0bGU6ICdUb3AgMzAgSmF2YVNjcmlwdCBJbnRlcnZpZXcgUXVlc3Rpb25zICYgQW5zd2VycyBmb3IgMjAyNiAoRnJlc2hlcnMgJiBFeHBlcmllbmNlZCknLFxuICAgIG1ldGFUaXRsZTogJ1RvcCAzMCBKYXZhU2NyaXB0IEludGVydmlldyBRdWVzdGlvbnMgJiBBbnN3ZXJzIDIwMjYgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdQcmVwYXJlIGZvciB5b3VyIEphdmFTY3JpcHQgaW50ZXJ2aWV3IHdpdGggdGhlIHRvcCAzMCBtb3N0IGFza2VkIEpTIHF1ZXN0aW9ucyBpbiAyMDI2LiBDb3ZlcnMgY2xvc3VyZXMsIHByb21pc2VzLCBldmVudCBsb29wLCBob2lzdGluZywgdGhpcyBrZXl3b3JkLCBhbmQgRVM2KyBmZWF0dXJlcyB3aXRoIGNsZWFyIGFuc3dlcnMuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ0phdmFTY3JpcHQgaW50ZXJ2aWV3IHF1ZXN0aW9ucyAyMDI2JyxcbiAgICAgICdKYXZhU2NyaXB0IGludGVydmlldyBxdWVzdGlvbnMgZm9yIGZyZXNoZXJzJyxcbiAgICAgICdKYXZhU2NyaXB0IGludGVydmlldyBxdWVzdGlvbnMgYW5kIGFuc3dlcnMnLFxuICAgICAgJ0pTIGludGVydmlldyBxdWVzdGlvbnMnLFxuICAgICAgJ0phdmFTY3JpcHQgY29kaW5nIGludGVydmlldyBxdWVzdGlvbnMnLFxuICAgICAgJ0phdmFTY3JpcHQgRVM2IGludGVydmlldyBxdWVzdGlvbnMnLFxuICAgICAgJ2Nsb3N1cmVzIEphdmFTY3JpcHQgaW50ZXJ2aWV3JyxcbiAgICAgICdwcm9taXNlcyBhc3luYyBhd2FpdCBpbnRlcnZpZXcgcXVlc3Rpb25zJyxcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdQcmVwYXJpbmcgZm9yIGEgSmF2YVNjcmlwdCBpbnRlcnZpZXcgaW4gMjAyNj8gVGhlc2UgYXJlIHRoZSAzMCBtb3N0IGNvbW1vbmx5IGFza2VkIHF1ZXN0aW9ucyBcdTIwMTQgZnJvbSBjbG9zdXJlcyBhbmQgaG9pc3RpbmcgdG8gZXZlbnQgbG9vcHMgYW5kIGFzeW5jL2F3YWl0IFx1MjAxNCB3aXRoIGNsZWFyLCBjb25jaXNlIGFuc3dlcnMgeW91IGNhbiB1c2UgaW1tZWRpYXRlbHkuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+SG93IHRvIFVzZSBUaGlzIEd1aWRlPC9oMj5cbiAgICAgIDxwPkRvbid0IG1lbW9yaXplIHRoZXNlIGFuc3dlcnMuIFVuZGVyc3RhbmQgdGhlbS4gSW50ZXJ2aWV3ZXJzIGF0IHByb2R1Y3QgY29tcGFuaWVzIGNhbiBpbW1lZGlhdGVseSB0ZWxsIHdoZW4gY2FuZGlkYXRlcyBhcmUgcmVjaXRpbmcgYW5zd2VycyB2ZXJzdXMgd2hlbiB0aGV5IGFjdHVhbGx5IHVuZGVyc3RhbmQgdGhlIGNvbmNlcHQuIFJlYWQgZWFjaCBxdWVzdGlvbiwgY292ZXIgdGhlIGFuc3dlciwgdHJ5IHRvIGV4cGxhaW4gaXQgaW4geW91ciBvd24gd29yZHMsIHRoZW4gY2hlY2sgdGhlIGFuc3dlciBmb3IgYWNjdXJhY3kuPC9wPlxuXG4gICAgICA8aDI+Q29yZSBKYXZhU2NyaXB0IENvbmNlcHRzPC9oMj5cblxuICAgICAgPGgzPlExOiBXaGF0IGlzIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdmFyLCBsZXQsIGFuZCBjb25zdD88L2gzPlxuICAgICAgPHA+PGNvZGU+dmFyPC9jb2RlPiBpcyBmdW5jdGlvbi1zY29wZWQgYW5kIGhvaXN0ZWQgKGluaXRpYWxpemVkIGFzIHVuZGVmaW5lZCkuIDxjb2RlPmxldDwvY29kZT4gYW5kIDxjb2RlPmNvbnN0PC9jb2RlPiBhcmUgYmxvY2stc2NvcGVkIGFuZCBpbiB0aGUgdGVtcG9yYWwgZGVhZCB6b25lIGJlZm9yZSB0aGVpciBkZWNsYXJhdGlvbiBsaW5lLiA8Y29kZT5jb25zdDwvY29kZT4gY3JlYXRlcyBhIHJlZmVyZW5jZSB0aGF0IGNhbm5vdCBiZSByZWFzc2lnbmVkIFx1MjAxNCBidXQgdGhlIG9iamVjdCBvciBhcnJheSBpdCBwb2ludHMgdG8gY2FuIHN0aWxsIGJlIG11dGF0ZWQuIEluIG1vZGVybiBKYXZhU2NyaXB0LCB1c2UgPGNvZGU+Y29uc3Q8L2NvZGU+IGJ5IGRlZmF1bHQsIDxjb2RlPmxldDwvY29kZT4gd2hlbiB5b3UgbmVlZCB0byByZWFzc2lnbiwgYW5kIG5ldmVyIHVzZSA8Y29kZT52YXI8L2NvZGU+LjwvcD5cblxuICAgICAgPGgzPlEyOiBXaGF0IGlzIGhvaXN0aW5nIGluIEphdmFTY3JpcHQ/PC9oMz5cbiAgICAgIDxwPkhvaXN0aW5nIGlzIEphdmFTY3JpcHQncyBiZWhhdmlvciBvZiBtb3ZpbmcgZnVuY3Rpb24gYW5kIHZhcmlhYmxlIGRlY2xhcmF0aW9ucyB0byB0aGUgdG9wIG9mIHRoZWlyIHNjb3BlIGJlZm9yZSBjb2RlIGV4ZWN1dGVzLiBGdW5jdGlvbiBkZWNsYXJhdGlvbnMgYXJlIGZ1bGx5IGhvaXN0ZWQgKGF2YWlsYWJsZSBiZWZvcmUgdGhlIGxpbmUgdGhleSBhcHBlYXIpLiA8Y29kZT52YXI8L2NvZGU+IGRlY2xhcmF0aW9ucyBhcmUgaG9pc3RlZCBidXQgaW5pdGlhbGl6ZWQgYXMgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi4gPGNvZGU+bGV0PC9jb2RlPiBhbmQgPGNvZGU+Y29uc3Q8L2NvZGU+IGFyZSBob2lzdGVkIGJ1dCBOT1QgaW5pdGlhbGl6ZWQgXHUyMDE0IGFjY2Vzc2luZyB0aGVtIGJlZm9yZSBkZWNsYXJhdGlvbiB0aHJvd3MgYSBSZWZlcmVuY2VFcnJvciAodGhlIFRlbXBvcmFsIERlYWQgWm9uZSkuPC9wPlxuXG4gICAgICA8aDM+UTM6IEV4cGxhaW4gY2xvc3VyZXMgaW4gSmF2YVNjcmlwdC48L2gzPlxuICAgICAgPHA+QSBjbG9zdXJlIGlzIGEgZnVuY3Rpb24gdGhhdCByZXRhaW5zIGFjY2VzcyB0byB2YXJpYWJsZXMgZnJvbSBpdHMgb3V0ZXIgKGVuY2xvc2luZykgc2NvcGUgZXZlbiBhZnRlciB0aGF0IG91dGVyIGZ1bmN0aW9uIGhhcyByZXR1cm5lZC4gVGhpcyBoYXBwZW5zIGJlY2F1c2UgSmF2YVNjcmlwdCBmdW5jdGlvbnMgY2FycnkgYSByZWZlcmVuY2UgdG8gdGhlaXIgbGV4aWNhbCBlbnZpcm9ubWVudC4gQ2xvc3VyZXMgYXJlIHVzZWQgZm9yIGRhdGEgZW5jYXBzdWxhdGlvbiwgZmFjdG9yeSBmdW5jdGlvbnMsIG1lbW9pemF0aW9uLCBhbmQgZXZlbnQgaGFuZGxlcnMuPC9wPlxuICAgICAgPHByZT48Y29kZT5mdW5jdGlvbiBtYWtlQ291bnRlcigpIHtcbiAgbGV0IGNvdW50ID0gMDsgICAgICAgICAgIC8vICdjb3VudCcgaXMgaW4gbWFrZUNvdW50ZXIncyBzY29wZVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY291bnQrKzsgICAgICAgICAgICAgICAvLyBJbm5lciBmdW5jdGlvbiByZXRhaW5zIGFjY2VzcyBcdTIwMTQgY2xvc3VyZVxuICAgIHJldHVybiBjb3VudDtcbiAgfTtcbn1cbmNvbnN0IGNvdW50ZXIgPSBtYWtlQ291bnRlcigpO1xuY291bnRlcigpOyAvLyAxXG5jb3VudGVyKCk7IC8vIDIgXHUyMDE0ICdjb3VudCcgcGVyc2lzdHMgYWNyb3NzIGNhbGxzPC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+UTQ6IFdoYXQgaXMgdGhlIGV2ZW50IGxvb3AgaW4gSmF2YVNjcmlwdD88L2gzPlxuICAgICAgPHA+SmF2YVNjcmlwdCBpcyBzaW5nbGUtdGhyZWFkZWQgYnV0IGhhbmRsZXMgYXN5bmMgdGFza3MgdGhyb3VnaCB0aGUgZXZlbnQgbG9vcC4gVGhlIGNhbGwgc3RhY2sgZXhlY3V0ZXMgc3luY2hyb25vdXMgY29kZS4gV2hlbiBhbiBhc3luYyBvcGVyYXRpb24gY29tcGxldGVzIChzZXRUaW1lb3V0LCBmZXRjaCwgZXRjLiksIGl0cyBjYWxsYmFjayBpcyBwbGFjZWQgaW4gdGhlIGNhbGxiYWNrIHF1ZXVlLiBUaGUgZXZlbnQgbG9vcCBjb250aW51b3VzbHkgY2hlY2tzOiBpZiB0aGUgY2FsbCBzdGFjayBpcyBlbXB0eSwgaXQgcHVzaGVzIHRoZSBuZXh0IGNhbGxiYWNrIGZyb20gdGhlIHF1ZXVlIG9udG8gdGhlIHN0YWNrLiBNaWNyb3Rhc2tzIChQcm9taXNlcykgaGF2ZSBhIHNlcGFyYXRlLCBoaWdoZXItcHJpb3JpdHkgcXVldWUgdGhhdCBpcyBkcmFpbmVkIGNvbXBsZXRlbHkgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzayBjYWxsYmFjayBydW5zLjwvcD5cblxuICAgICAgPGgzPlE1OiBXaGF0IGlzIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gPT0gYW5kID09PT88L2gzPlxuICAgICAgPHA+PGNvZGU+PT08L2NvZGU+IHBlcmZvcm1zIHR5cGUgY29lcmNpb24gYmVmb3JlIGNvbXBhcmluZy4gPGNvZGU+PT09PC9jb2RlPiBjaGVja3MgYm90aCB2YWx1ZSBhbmQgdHlwZSB3aXRob3V0IGNvZXJjaW9uLiBBbHdheXMgdXNlIDxjb2RlPj09PTwvY29kZT4uIEV4YW1wbGVzIG9mIDxjb2RlPj09PC9jb2RlPiBzdXJwcmlzZXM6IDxjb2RlPjAgPT0gZmFsc2U8L2NvZGU+ICh0cnVlKSwgPGNvZGU+JycgPT0gZmFsc2U8L2NvZGU+ICh0cnVlKSwgPGNvZGU+bnVsbCA9PSB1bmRlZmluZWQ8L2NvZGU+ICh0cnVlKS48L3A+XG5cbiAgICAgIDxoMj5GdW5jdGlvbnMgJiBTY29wZTwvaDI+XG5cbiAgICAgIDxoMz5RNjogV2hhdCBpcyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGZ1bmN0aW9uIGRlY2xhcmF0aW9ucyBhbmQgZnVuY3Rpb24gZXhwcmVzc2lvbnM/PC9oMz5cbiAgICAgIDxwPkZ1bmN0aW9uIGRlY2xhcmF0aW9ucyAoPGNvZGU+ZnVuY3Rpb24gZm9vKCkge308L2NvZGU+KSBhcmUgZnVsbHkgaG9pc3RlZCBcdTIwMTQgeW91IGNhbiBjYWxsIHRoZW0gYmVmb3JlIHRoZXkgYXBwZWFyIGluIGNvZGUuIEZ1bmN0aW9uIGV4cHJlc3Npb25zICg8Y29kZT5jb25zdCBmb28gPSBmdW5jdGlvbigpIHt9PC9jb2RlPikgYXJlIG5vdCBhdmFpbGFibGUgYmVmb3JlIHRoZWlyIGxpbmUuIEFycm93IGZ1bmN0aW9ucyBhcmUgYWx3YXlzIGV4cHJlc3Npb25zLiBJbiBtb2Rlcm4gY29kZSwgcHJlZmVyIGFycm93IGZ1bmN0aW9ucyBmb3IgY2FsbGJhY2tzIGFuZCByZWd1bGFyIGZ1bmN0aW9ucyBmb3IgbWV0aG9kcyB0aGF0IG5lZWQgdGhlaXIgb3duIDxjb2RlPnRoaXM8L2NvZGU+LjwvcD5cblxuICAgICAgPGgzPlE3OiBXaGF0IGRvZXMgdGhlICd0aGlzJyBrZXl3b3JkIHJlZmVyIHRvPzwvaDM+XG4gICAgICA8cD48Y29kZT50aGlzPC9jb2RlPiByZWZlcnMgdG8gdGhlIGV4ZWN1dGlvbiBjb250ZXh0LiBJbiBhIHJlZ3VsYXIgZnVuY3Rpb24sIDxjb2RlPnRoaXM8L2NvZGU+IGlzIGRldGVybWluZWQgYXQgY2FsbCB0aW1lIFx1MjAxNCBpdCdzIHRoZSBvYmplY3QgYmVmb3JlIHRoZSBkb3QuIEluIGFuIGFycm93IGZ1bmN0aW9uLCA8Y29kZT50aGlzPC9jb2RlPiBpcyBsZXhpY2FsbHkgYm91bmQgKGluaGVyaXRlZCBmcm9tIHRoZSBlbmNsb3Npbmcgc2NvcGUgYXQgZGVmaW5pdGlvbiB0aW1lKS4gPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIGEgY2xhc3MgbWV0aG9kIHJlZmVycyB0byB0aGUgY2xhc3MgaW5zdGFuY2UuIEluIHN0cmljdCBtb2RlIGdsb2JhbCBjb2RlLCA8Y29kZT50aGlzPC9jb2RlPiBpcyB1bmRlZmluZWQuPC9wPlxuXG4gICAgICA8aDM+UTg6IFdoYXQgaXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBjYWxsLCBhcHBseSwgYW5kIGJpbmQ/PC9oMz5cbiAgICAgIDxwPkFsbCB0aHJlZSBzZXQgdGhlIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGV4cGxpY2l0bHkuIDxjb2RlPmNhbGwodGhpc0FyZywgYXJnMSwgYXJnMik8L2NvZGU+IGludm9rZXMgdGhlIGZ1bmN0aW9uIGltbWVkaWF0ZWx5LiA8Y29kZT5hcHBseSh0aGlzQXJnLCBbYXJnc10pPC9jb2RlPiBpbnZva2VzIGltbWVkaWF0ZWx5IGJ1dCBwYXNzZXMgYXJncyBhcyBhbiBhcnJheS4gPGNvZGU+YmluZCh0aGlzQXJnKTwvY29kZT4gcmV0dXJucyBhIG5ldyBmdW5jdGlvbiB3aXRoIDxjb2RlPnRoaXM8L2NvZGU+IHBlcm1hbmVudGx5IHNldCBcdTIwMTQgdXNlZnVsIGZvciBldmVudCBoYW5kbGVycyBhbmQgY2FsbGJhY2tzLjwvcD5cblxuICAgICAgPGgyPkFzeW5jIEphdmFTY3JpcHQ8L2gyPlxuXG4gICAgICA8aDM+UTk6IFdoYXQgaXMgYSBQcm9taXNlPyBXaGF0IGFyZSBpdHMgc3RhdGVzPzwvaDM+XG4gICAgICA8cD5BIFByb21pc2UgcmVwcmVzZW50cyBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uIHRoYXQgd2lsbCBldmVudHVhbGx5IHByb2R1Y2UgYSB2YWx1ZS4gU3RhdGVzOiA8c3Ryb25nPlBlbmRpbmc8L3N0cm9uZz4gKGluaXRpYWwpLCA8c3Ryb25nPkZ1bGZpbGxlZDwvc3Ryb25nPiAocmVzb2x2ZWQgd2l0aCBhIHZhbHVlKSwgPHN0cm9uZz5SZWplY3RlZDwvc3Ryb25nPiAoZmFpbGVkIHdpdGggYSByZWFzb24pLiBQcm9taXNlcyBhcmUgY29uc3VtZWQgd2l0aCA8Y29kZT4udGhlbigpPC9jb2RlPiBmb3Igc3VjY2VzcywgPGNvZGU+LmNhdGNoKCk8L2NvZGU+IGZvciBlcnJvcnMsIGFuZCA8Y29kZT4uZmluYWxseSgpPC9jb2RlPiBmb3IgY2xlYW51cCByZWdhcmRsZXNzIG9mIG91dGNvbWUuPC9wPlxuXG4gICAgICA8aDM+UTEwOiBXaGF0IGlzIGFzeW5jL2F3YWl0IGFuZCBob3cgZG9lcyBpdCBkaWZmZXIgZnJvbSBQcm9taXNlcz88L2gzPlxuICAgICAgPHA+PGNvZGU+YXN5bmMvYXdhaXQ8L2NvZGU+IGlzIHN5bnRhY3RpYyBzdWdhciBvdmVyIFByb21pc2VzIHRoYXQgbWFrZXMgYXN5bmMgY29kZSByZWFkIGxpa2Ugc3luY2hyb25vdXMgY29kZS4gQW4gPGNvZGU+YXN5bmM8L2NvZGU+IGZ1bmN0aW9uIGFsd2F5cyByZXR1cm5zIGEgUHJvbWlzZS4gPGNvZGU+YXdhaXQ8L2NvZGU+IHBhdXNlcyBleGVjdXRpb24gdW50aWwgdGhlIFByb21pc2UgcmVzb2x2ZXMuIEVycm9yIGhhbmRsaW5nIHVzZXMgdHJ5L2NhdGNoIGluc3RlYWQgb2YgLmNhdGNoKCkuIFVuZGVyIHRoZSBob29kLCB0aGV5IGFyZSBpZGVudGljYWwgXHUyMDE0IGFzeW5jL2F3YWl0IGNvbXBpbGVzIHRvIFByb21pc2UgY2hhaW5zLjwvcD5cblxuICAgICAgPGgyPkVTNisgRmVhdHVyZXM8L2gyPlxuXG4gICAgICA8aDM+UTExOiBXaGF0IGlzIGRlc3RydWN0dXJpbmc/PC9oMz5cbiAgICAgIDxwPkRlc3RydWN0dXJpbmcgZXh0cmFjdHMgdmFsdWVzIGZyb20gYXJyYXlzIG9yIHByb3BlcnRpZXMgZnJvbSBvYmplY3RzIGludG8gZGlzdGluY3QgdmFyaWFibGVzLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+Ly8gT2JqZWN0IGRlc3RydWN0dXJpbmdcbmNvbnN0IHsgbmFtZSwgYWdlIH0gPSB1c2VyO1xuXG4vLyBBcnJheSBkZXN0cnVjdHVyaW5nXG5jb25zdCBbZmlyc3QsIHNlY29uZF0gPSBudW1iZXJzO1xuXG4vLyBXaXRoIGRlZmF1bHRzXG5jb25zdCB7IHJvbGUgPSAndXNlcicgfSA9IG9wdGlvbnM7PC9jb2RlPjwvcHJlPlxuXG4gICAgICA8aDM+UTEyOiBXaGF0IGlzIHRoZSBzcHJlYWQgb3BlcmF0b3IgYW5kIHJlc3QgcGFyYW1ldGVycz88L2gzPlxuICAgICAgPHA+Qm90aCB1c2UgPGNvZGU+Li4uPC9jb2RlPi4gVGhlIHNwcmVhZCBvcGVyYXRvciBleHBhbmRzIGl0ZXJhYmxlczogPGNvZGU+Y29uc3QgbWVyZ2VkID0gWy4uLmFycjEsIC4uLmFycjJdPC9jb2RlPi4gUmVzdCBwYXJhbWV0ZXJzIGNvbGxlY3QgcmVtYWluaW5nIGZ1bmN0aW9uIGFyZ3VtZW50czogPGNvZGU+ZnVuY3Rpb24gc3VtKC4uLm51bXMpPC9jb2RlPi4gU2FtZSBzeW50YXgsIG9wcG9zaXRlIGRpcmVjdGlvbiBcdTIwMTQgc3ByZWFkIGV4cGFuZHMsIHJlc3QgY29sbGVjdHMuPC9wPlxuXG4gICAgICA8aDI+UHJvdG90eXBlICYgT09QPC9oMj5cblxuICAgICAgPGgzPlExMzogV2hhdCBpcyB0aGUgcHJvdG90eXBlIGNoYWluPzwvaDM+XG4gICAgICA8cD5FdmVyeSBKYXZhU2NyaXB0IG9iamVjdCBoYXMgYSA8Y29kZT5bW1Byb3RvdHlwZV1dPC9jb2RlPiBsaW5rIHRvIGFub3RoZXIgb2JqZWN0LiBXaGVuIHlvdSBhY2Nlc3MgYSBwcm9wZXJ0eSwgSmF2YVNjcmlwdCBmaXJzdCBsb29rcyBvbiB0aGUgb2JqZWN0IGl0c2VsZiwgdGhlbiB3YWxrcyB1cCB0aGUgcHJvdG90eXBlIGNoYWluIHVudGlsIGl0IGZpbmRzIGl0IG9yIHJlYWNoZXMgPGNvZGU+bnVsbDwvY29kZT4uIFRoaXMgaXMgdGhlIG1lY2hhbmlzbSBiZWhpbmQgaW5oZXJpdGFuY2UgaW4gSmF2YVNjcmlwdCBcdTIwMTQgY2xhc3NlcyBhcmUgc3ludGFjdGljIHN1Z2FyIG92ZXIgcHJvdG90eXBlLWJhc2VkIGluaGVyaXRhbmNlLjwvcD5cblxuICAgICAgPGgyPkJ1aWxkIHRoZSBTa2lsbHMgVGhlc2UgUXVlc3Rpb25zIFRlc3Q8L2gyPlxuICAgICAgPHA+VW5kZXJzdGFuZGluZyB0aGVzZSBjb25jZXB0cyBkZWVwbHkgcmVxdWlyZXMgcHJhY3RpY2UgXHUyMDE0IG5vdCBtZW1vcml6YXRpb24uIFRoZSA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzc1wiPmZyZWUgSmF2YVNjcmlwdCBNYXN0ZXJjbGFzcyBvbiBTa2lsbFZhbGl4PC9hPiBjb3ZlcnMgYWxsIG9mIHRoZXNlIHRvcGljcyBpbiBkZXB0aDogY2xvc3VyZXMsIGFzeW5jL2F3YWl0LCB0aGUgZXZlbnQgbG9vcCwgcHJvdG90eXBlcywgYW5kIEVTNisgZmVhdHVyZXMuIENvbXBsZXRpbmcgaXQgZ2l2ZXMgeW91IGJvdGggdGhlIGtub3dsZWRnZSBhbmQgYSB2ZXJpZmllZCBjZXJ0aWZpY2F0ZSB0byBwcm92ZSBpdC48L3A+XG4gICAgICA8cD5UbyBnZXQgcmVhbCBpbnRlcnZpZXcgZXhwZXJpZW5jZSwgam9pbiBhIDxhIGhyZWY9XCIvaGFja2F0aG9uc1wiPlNraWxsVmFsaXggaGFja2F0aG9uPC9hPiBcdTIwMTQgYnVpbGRpbmcgYSByZWFsIHByb2plY3QgdW5kZXIgdGltZSBwcmVzc3VyZSBpcyB0aGUgc2luZ2xlIGJlc3Qgd2F5IHRvIG1ha2UgdGhlc2UgY29uY2VwdHMgc3RpY2suPC9wPlxuXG4gICAgICA8aDI+RnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnM8L2gyPlxuXG4gICAgICA8cD48c3Ryb25nPlE6IFdoaWNoIEphdmFTY3JpcHQgdG9waWNzIGFyZSBtb3N0IGNvbW1vbmx5IGFza2VkIGluIGZyZXNoZXIgaW50ZXJ2aWV3cyBpbiBJbmRpYT88L3N0cm9uZz48YnIvPlxuICAgICAgQ2xvc3VyZXMsIGhvaXN0aW5nLCB2YXIvbGV0L2NvbnN0IGRpZmZlcmVuY2VzLCB0aGUgZXZlbnQgbG9vcCwgUHJvbWlzZXMsIGFuZCBhcnJheSBtZXRob2RzIChtYXAsIGZpbHRlciwgcmVkdWNlKSBhcmUgYXNrZWQgaW4gbmVhcmx5IGV2ZXJ5IEphdmFTY3JpcHQgaW50ZXJ2aWV3IGZvciBmcmVzaGVycyBpbiBJbmRpYS4gS25vdyB0aGVzZSBpbnNpZGUgb3V0LjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5ROiBIb3cgc2hvdWxkIEkgcHJlcGFyZSBmb3IgYSBKYXZhU2NyaXB0IGludGVydmlldyBpbiAyIHdlZWtzPzwvc3Ryb25nPjxici8+XG4gICAgICBEYXkgMVx1MjAxMzU6IENvcmUgY29uY2VwdHMgKGNsb3N1cmVzLCBob2lzdGluZywgdGhpcywgcHJvdG90eXBlKS4gRGF5IDZcdTIwMTMxMDogQXN5bmMgSmF2YVNjcmlwdCAoUHJvbWlzZXMsIGFzeW5jL2F3YWl0LCBldmVudCBsb29wKS4gRGF5IDExXHUyMDEzMTQ6IEJ1aWxkIDIgc21hbGwgcHJvamVjdHMgZnJvbSBzY3JhdGNoIGFuZCBkbyBtb2NrIGludGVydmlld3MgZXhwbGFpbmluZyB5b3VyIGNvZGUuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnQXJqdW4gTWVodGEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA0LTA4VDEwOjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA0LTA4VDEwOjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnQXByaWwgOCwgMjAyNicsXG4gICAgcmVhZFRpbWU6ICcxNSBtaW4gcmVhZCcsXG4gICAgd29yZENvdW50OiAxNDgwLFxuICAgIGNhdGVnb3J5OiAnSmF2YVNjcmlwdCcsXG4gICAgdGFnczogWydKYXZhU2NyaXB0IEludGVydmlldycsICdKUyBJbnRlcnZpZXcgUXVlc3Rpb25zJywgJ0phdmFTY3JpcHQgMjAyNicsICdGcmVzaGVyIEludGVydmlldycsICdDb2RpbmcgSW50ZXJ2aWV3JywgJ0phdmFTY3JpcHQgQ29uY2VwdHMnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTE2MTE2MjE2NjI0LTUzZTY5N2ZlZGJlYT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdKYXZhU2NyaXB0IGNvZGUgb24gc2NyZWVuIHdpdGggaW50ZXJ2aWV3IHByZXBhcmF0aW9uIG5vdGVzIG9uIGRlc2snLFxuICAgIGNhbm9uaWNhbFVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cvamF2YXNjcmlwdC1pbnRlcnZpZXctcXVlc3Rpb25zLTIwMjYnLFxuICAgIHJlbGF0ZWRDb3Vyc2U6IHtcbiAgICAgIHRpdGxlOiAnVWx0aW1hdGUgSmF2YVNjcmlwdCBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ01hc3RlciBldmVyeSBjb25jZXB0IGNvdmVyZWQgaW4gdGhlc2UgaW50ZXJ2aWV3IHF1ZXN0aW9ucyBcdTIwMTQgZnJlZSB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdweXRob24tZm9yLWRhdGEtc2NpZW5jZS1iZWdpbm5lcnMtMjAyNicsXG4gICAgdGl0bGU6ICdQeXRob24gZm9yIERhdGEgU2NpZW5jZTogQmVnaW5uZXIgR3VpZGUgMjAyNiAoRnJlZSBSZXNvdXJjZXMgSW5jbHVkZWQpJyxcbiAgICBtZXRhVGl0bGU6ICdQeXRob24gZm9yIERhdGEgU2NpZW5jZSBCZWdpbm5lcnMgMjAyNiBcdTIwMTMgRnJlZSBHdWlkZSB8IFNraWxsVmFsaXgnLFxuICAgIG1ldGFEZXNjcmlwdGlvbjogJ0xlYXJuIFB5dGhvbiBmb3IgRGF0YSBTY2llbmNlIGZyb20gc2NyYXRjaCBpbiAyMDI2LiBDb3ZlcnMgTnVtUHksIFBhbmRhcywgZGF0YSB2aXN1YWxpemF0aW9uLCBhbmQgbWFjaGluZSBsZWFybmluZyBiYXNpY3MgXHUyMDE0IHdpdGggZnJlZSBsZWFybmluZyByZXNvdXJjZXMgYW5kIGEgc3RlcC1ieS1zdGVwIHJvYWRtYXAgZm9yIGJlZ2lubmVycy4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnUHl0aG9uIGZvciBkYXRhIHNjaWVuY2UgYmVnaW5uZXJzJyxcbiAgICAgICdsZWFybiBQeXRob24gZm9yIGRhdGEgc2NpZW5jZSAyMDI2JyxcbiAgICAgICdQeXRob24gZGF0YSBzY2llbmNlIHJvYWRtYXAnLFxuICAgICAgJ1B5dGhvbiBtYWNoaW5lIGxlYXJuaW5nIGJlZ2lubmVycycsXG4gICAgICAnZGF0YSBzY2llbmNlIFB5dGhvbiB0dXRvcmlhbCcsXG4gICAgICAnUHl0aG9uIEFJIGJlZ2lubmVycyBJbmRpYScsXG4gICAgICAnbGVhcm4gZGF0YSBzY2llbmNlIGZyZWUgSW5kaWEnLFxuICAgICAgJ1B5dGhvbiBOdW1QeSBQYW5kYXMgdHV0b3JpYWwnLFxuICAgIF0sXG4gICAgZXhjZXJwdDogJ1B5dGhvbiBpcyB0aGUgbGFuZ3VhZ2Ugb2YgZGF0YSBzY2llbmNlLiBUaGlzIGJlZ2lubmVyIGd1aWRlIHNob3dzIHlvdSBleGFjdGx5IHdoYXQgdG8gbGVhcm4sIGluIHdoYXQgb3JkZXIsIGFuZCB3aGVyZSB0byBnZXQgdGhlIGZvdW5kYXRpb25hbCBQeXRob24gc2tpbGxzIHlvdSBuZWVkIGJlZm9yZSBkaXZpbmcgaW50byBkYXRhIHNjaWVuY2UgbGlicmFyaWVzLicsXG4gICAgY29udGVudDogYFxuICAgICAgPGgyPldoeSBQeXRob24gSXMgdGhlIExhbmd1YWdlIG9mIERhdGEgU2NpZW5jZTwvaDI+XG4gICAgICA8cD5JbiAyMDI2LCBQeXRob24gcnVucyB0aGUgQUkgcmV2b2x1dGlvbi4gRXZlcnkgbWFqb3IgbWFjaGluZSBsZWFybmluZyBmcmFtZXdvcmsgXHUyMDE0IFRlbnNvckZsb3csIFB5VG9yY2gsIHNjaWtpdC1sZWFybiBcdTIwMTQgaXMgd3JpdHRlbiBpbiBvciBmb3IgUHl0aG9uLiBFdmVyeSBkYXRhIHNjaWVuY2UgdGVhbSBpbiBJbmRpYSB1c2VzIFB5dGhvbi4gQW5kIFB5dGhvbiBoYXMgdGhlIG1vc3QgYmVnaW5uZXItZnJpZW5kbHkgc3ludGF4IG9mIGFueSBsYW5ndWFnZSwgd2hpY2ggaXMgd2h5IGl0J3MgdGhlIHVuaXZlcnNhbCBzdGFydGluZyBwb2ludCBmb3IgYXNwaXJpbmcgZGF0YSBzY2llbnRpc3RzIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgYmFja2dyb3VuZC48L3A+XG4gICAgICA8cD5CdXQgaGVyZSdzIHRoZSB0cmFwIGJlZ2lubmVycyBmYWxsIGludG86IGp1bXBpbmcgc3RyYWlnaHQgaW50byBOdW1QeSBhbmQgbWFjaGluZSBsZWFybmluZyBiZWZvcmUgbWFzdGVyaW5nIFB5dGhvbiBmdW5kYW1lbnRhbHMuIFRoaXMgZ3VpZGUgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IHNlcXVlbmNlLjwvcD5cblxuICAgICAgPGgyPlN0ZXAgMTogUHl0aG9uIEZ1bmRhbWVudGFscyAoQmVmb3JlIEFueXRoaW5nIEVsc2UpPC9oMj5cbiAgICAgIDxwPkJlZm9yZSB5b3UgdG91Y2ggYSBzaW5nbGUgZGF0YSBzY2llbmNlIGxpYnJhcnksIHlvdSBuZWVkIHRvIGJlIGNvbWZvcnRhYmxlIHdpdGggY29yZSBQeXRob24uIElmIHlvdSB0cnkgdG8gbGVhcm4gUGFuZGFzIHdpdGhvdXQgdW5kZXJzdGFuZGluZyBQeXRob24gZGljdGlvbmFyaWVzLCB5b3UnbGwgYmUgbG9zdCBjb25zdGFudGx5LjwvcD5cbiAgICAgIDxwPlB5dGhvbiBmdW5kYW1lbnRhbHMgeW91IG11c3Qga25vdyBmaXJzdDo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPlZhcmlhYmxlcyBhbmQgZGF0YSB0eXBlczo8L3N0cm9uZz4gaW50LCBmbG9hdCwgc3RyLCBib29sLCBOb25lPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TGlzdHMgYW5kIGRpY3Rpb25hcmllczo8L3N0cm9uZz4gVGhlIHR3byBtb3N0IHVzZWQgZGF0YSBzdHJ1Y3R1cmVzIGluIGRhdGEgc2NpZW5jZTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkxvb3BzIGFuZCBjb25kaXRpb25hbHM6PC9zdHJvbmc+IGZvciBsb29wcywgd2hpbGUgbG9vcHMsIGlmL2VsaWYvZWxzZTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkZ1bmN0aW9uczo8L3N0cm9uZz4gRGVmaW5pbmcsIGNhbGxpbmcsIHBhcmFtZXRlcnMsIHJldHVybiB2YWx1ZXMsIGxhbWJkYSBmdW5jdGlvbnM8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5GaWxlIEkvTzo8L3N0cm9uZz4gUmVhZGluZyBhbmQgd3JpdGluZyBDU1YgYW5kIHRleHQgZmlsZXMgXHUyMDE0IGVzc2VudGlhbCBmb3IgZGF0YSBzY2llbmNlPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TGlzdCBjb21wcmVoZW5zaW9uczo8L3N0cm9uZz4gVGhlIFB5dGhvbmljIHdheSB0byB0cmFuc2Zvcm0gZGF0YTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkVycm9yIGhhbmRsaW5nOjwvc3Ryb25nPiB0cnkvZXhjZXB0IGJsb2NrczwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+RnJlZSByZXNvdXJjZTogVGhlIDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBQeXRob24gTWFzdGVyY2xhc3Mgb24gU2tpbGxWYWxpeDwvYT4gY292ZXJzIGFsbCBvZiB0aGlzIGZyb20gc2NyYXRjaCB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZSBvbiBjb21wbGV0aW9uLiBUaGlzIGlzIHlvdXIgZm91bmRhdGlvbi4gRG9uJ3Qgc2tpcCBpdC48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDI6IE51bVB5IFx1MjAxNCBOdW1lcmljYWwgQ29tcHV0aW5nPC9oMj5cbiAgICAgIDxwPk51bVB5IChOdW1lcmljYWwgUHl0aG9uKSBpcyB0aGUgZm91bmRhdGlvbiBvZiBhbGwgc2NpZW50aWZpYyBjb21wdXRpbmcgaW4gUHl0aG9uLiBJdCBpbnRyb2R1Y2VzIGFycmF5cyBcdTIwMTQgbXVsdGktZGltZW5zaW9uYWwgZGF0YSBzdHJ1Y3R1cmVzIHRoYXQgYXJlIGRyYW1hdGljYWxseSBmYXN0ZXIgdGhhbiBQeXRob24gbGlzdHMgZm9yIG51bWVyaWNhbCBvcGVyYXRpb25zLjwvcD5cbiAgICAgIDxwPktleSBOdW1QeSBjb25jZXB0czo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT5DcmVhdGluZyBhcnJheXM6IDxjb2RlPm5wLmFycmF5KCk8L2NvZGU+LCA8Y29kZT5ucC56ZXJvcygpPC9jb2RlPiwgPGNvZGU+bnAub25lcygpPC9jb2RlPiwgPGNvZGU+bnAuYXJhbmdlKCk8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPkFycmF5IG9wZXJhdGlvbnM6IGVsZW1lbnQtd2lzZSBhcml0aG1ldGljLCBicm9hZGNhc3Rpbmc8L2xpPlxuICAgICAgICA8bGk+SW5kZXhpbmcgYW5kIHNsaWNpbmc6IHNlbGVjdGluZyByb3dzLCBjb2x1bW5zLCBhbmQgc3Vic2V0czwvbGk+XG4gICAgICAgIDxsaT5TdGF0aXN0aWNhbCBmdW5jdGlvbnM6IDxjb2RlPm5wLm1lYW4oKTwvY29kZT4sIDxjb2RlPm5wLnN0ZCgpPC9jb2RlPiwgPGNvZGU+bnAuc3VtKCk8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPlJlc2hhcGluZzogPGNvZGU+cmVzaGFwZSgpPC9jb2RlPiwgPGNvZGU+ZmxhdHRlbigpPC9jb2RlPiwgPGNvZGU+dHJhbnNwb3NlKCk8L2NvZGU+PC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5TdGVwIDM6IFBhbmRhcyBcdTIwMTQgRGF0YSBNYW5pcHVsYXRpb248L2gyPlxuICAgICAgPHA+UGFuZGFzIGlzIHdoYXQgZGF0YSBzY2llbnRpc3RzIHVzZSBmb3IgODAlIG9mIHRoZWlyIGRhaWx5IHdvcmsgXHUyMDE0IGxvYWRpbmcsIGNsZWFuaW5nLCB0cmFuc2Zvcm1pbmcsIGFuZCBhbmFseXppbmcgdGFidWxhciBkYXRhLiBBIERhdGFGcmFtZSBpcyBQYW5kYXMnIGNvcmUgc3RydWN0dXJlOiBhIDJEIHRhYmxlIHdpdGggbGFiZWxsZWQgcm93cyBhbmQgY29sdW1ucyAoZXNzZW50aWFsbHkgYSBzcHJlYWRzaGVldCBpbiBjb2RlKS48L3A+XG4gICAgICA8cD5Fc3NlbnRpYWwgUGFuZGFzIHNraWxsczo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT5Mb2FkaW5nIGRhdGE6IDxjb2RlPnBkLnJlYWRfY3N2KCk8L2NvZGU+LCA8Y29kZT5wZC5yZWFkX2V4Y2VsKCk8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPkV4cGxvcmluZyBkYXRhOiA8Y29kZT4uaGVhZCgpPC9jb2RlPiwgPGNvZGU+LmluZm8oKTwvY29kZT4sIDxjb2RlPi5kZXNjcmliZSgpPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT5TZWxlY3RpbmcgZGF0YTogPGNvZGU+bG9jW108L2NvZGU+IChsYWJlbC1iYXNlZCksIDxjb2RlPmlsb2NbXTwvY29kZT4gKGluZGV4LWJhc2VkKTwvbGk+XG4gICAgICAgIDxsaT5GaWx0ZXJpbmcgcm93czogYm9vbGVhbiBpbmRleGluZzwvbGk+XG4gICAgICAgIDxsaT5IYW5kbGluZyBtaXNzaW5nIHZhbHVlczogPGNvZGU+LmRyb3BuYSgpPC9jb2RlPiwgPGNvZGU+LmZpbGxuYSgpPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT5Hcm91cGluZyBhbmQgYWdncmVnYXRpbmc6IDxjb2RlPmdyb3VwYnkoKTwvY29kZT4sIDxjb2RlPmFnZygpPC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT5NZXJnaW5nIERhdGFGcmFtZXM6IDxjb2RlPm1lcmdlKCk8L2NvZGU+LCA8Y29kZT5jb25jYXQoKTwvY29kZT48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPlN0ZXAgNDogRGF0YSBWaXN1YWxpemF0aW9uPC9oMj5cbiAgICAgIDxwPkRhdGEgc2NpZW50aXN0cyBjb21tdW5pY2F0ZSBmaW5kaW5ncyB0aHJvdWdoIHZpc3VhbGl6YXRpb25zLiBUd28gbGlicmFyaWVzIGRvbWluYXRlOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+TWF0cGxvdGxpYjo8L3N0cm9uZz4gVGhlIGxvdy1sZXZlbCBmb3VuZGF0aW9uLiBHaXZlcyB5b3UgZnVsbCBjb250cm9sIG92ZXIgZXZlcnkgZWxlbWVudCBvZiBhIHBsb3QuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+U2VhYm9ybjo8L3N0cm9uZz4gQnVpbHQgb24gTWF0cGxvdGxpYi4gQ3JlYXRlcyBiZWF1dGlmdWwgc3RhdGlzdGljYWwgcGxvdHMgaW4gMlx1MjAxMzMgbGluZXMgb2YgY29kZS48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPlN0ZXAgNTogTWFjaGluZSBMZWFybmluZyBCYXNpY3Mgd2l0aCBzY2lraXQtbGVhcm48L2gyPlxuICAgICAgPHA+T25jZSB5b3UncmUgY29tZm9ydGFibGUgd2l0aCBOdW1QeSBhbmQgUGFuZGFzLCBzY2lraXQtbGVhcm4gbWFrZXMgaXQgZWFzeSB0byB0cmFpbiBtYWNoaW5lIGxlYXJuaW5nIG1vZGVscy4gSXQgcHJvdmlkZXMgYSBjb25zaXN0ZW50IEFQSSBmb3IgcHJlcHJvY2Vzc2luZyBkYXRhLCBzcGxpdHRpbmcgdHJhaW4vdGVzdCBzZXRzLCB0cmFpbmluZyBtb2RlbHMsIGFuZCBldmFsdWF0aW5nIHBlcmZvcm1hbmNlLjwvcD5cbiAgICAgIDxwPlN0YXJ0IHdpdGggdGhlc2Ugc2Npa2l0LWxlYXJuIGNvbmNlcHRzOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPlRyYWluL3Rlc3Qgc3BsaXQ6IDxjb2RlPnRyYWluX3Rlc3Rfc3BsaXQoKTwvY29kZT48L2xpPlxuICAgICAgICA8bGk+TGluZWFyIFJlZ3Jlc3Npb246IHByZWRpY3RpbmcgY29udGludW91cyB2YWx1ZXM8L2xpPlxuICAgICAgICA8bGk+TG9naXN0aWMgUmVncmVzc2lvbjogYmluYXJ5IGNsYXNzaWZpY2F0aW9uPC9saT5cbiAgICAgICAgPGxpPkRlY2lzaW9uIFRyZWVzIGFuZCBSYW5kb20gRm9yZXN0czwvbGk+XG4gICAgICAgIDxsaT5Nb2RlbCBldmFsdWF0aW9uOiBhY2N1cmFjeSwgcHJlY2lzaW9uLCByZWNhbGwsIGNvbmZ1c2lvbiBtYXRyaXg8L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPkJ1aWxkIHRoZSBGb3VuZGF0aW9uIHdpdGggU2tpbGxWYWxpeDwvaDI+XG4gICAgICA8cD5UaGUgPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzc1wiPmZyZWUgUHl0aG9uIGNvdXJzZSBvbiBTa2lsbFZhbGl4PC9hPiBnaXZlcyB5b3UgdGhlIFB5dGhvbiBmdW5kYW1lbnRhbHMgeW91IG5lZWQgYmVmb3JlIGRhdGEgc2NpZW5jZSBsaWJyYXJpZXMgXHUyMDE0IHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIGF0IHRoZSBlbmQuIENvbWJpbmVkIHdpdGggdGhlIDxhIGhyZWY9XCIvY291cnNlcy9iYXNpY3Mtb2YtYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UtYmVnaW5uZXJzXCI+ZnJlZSBBSSAmIE1hY2hpbmUgTGVhcm5pbmcgRnVuZGFtZW50YWxzIGNvdXJzZTwvYT4sIHlvdSBnZXQgdGhlIGNvbmNlcHR1YWwgZm91bmRhdGlvbiB0byB1bmRlcnN0YW5kIHdoYXQgc2Npa2l0LWxlYXJuIGFuZCBUZW5zb3JGbG93IGFyZSBhY3R1YWxseSBkb2luZyB1bmRlciB0aGUgaG9vZC48L3A+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9uczwvaDI+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IERvIEkgbmVlZCBhIG1hdGggYmFja2dyb3VuZCB0byBsZWFybiBQeXRob24gZm9yIGRhdGEgc2NpZW5jZT88L3N0cm9uZz48YnIvPlxuICAgICAgQmFzaWMgc3RhdGlzdGljcyAobWVhbiwgbWVkaWFuLCBzdGFuZGFyZCBkZXZpYXRpb24pIGFuZCBsaW5lYXIgYWxnZWJyYSBiYXNpY3MgKG1hdHJpY2VzLCB2ZWN0b3JzKSBoZWxwLCBidXQgeW91IGRvbid0IG5lZWQgYWR2YW5jZWQgbWF0aGVtYXRpY3MgdG8gZ2V0IHN0YXJ0ZWQuIEFzIHlvdSBhZHZhbmNlIGludG8gbWFjaGluZSBsZWFybmluZywgeW91J2xsIG5hdHVyYWxseSBlbmNvdW50ZXIgdGhlIG1hdGggYW5kIGNhbiBzdHVkeSBpdCBjb250ZXh0dWFsbHkuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEyOiBIb3cgbG9uZyBkb2VzIGl0IHRha2UgdG8gbGVhcm4gUHl0aG9uIGZvciBkYXRhIHNjaWVuY2U/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFB5dGhvbiBmdW5kYW1lbnRhbHM6IDJcdTIwMTM0IHdlZWtzIHdpdGggY29uc2lzdGVudCBwcmFjdGljZS4gTnVtUHkgKyBQYW5kYXM6IDNcdTIwMTM0IHdlZWtzLiBWaXN1YWxpemF0aW9uICsgTUwgYmFzaWNzOiA0XHUyMDEzNiB3ZWVrcy4gVG90YWw6IDJcdTIwMTM0IG1vbnRocyB0byBiZSBlbXBsb3lhYmxlIGFzIGEganVuaW9yIGRhdGEgYW5hbHlzdC48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IElzIFB5dGhvbiBlbm91Z2ggdG8gZ2V0IGEgZGF0YSBzY2llbmNlIGpvYiBpbiBJbmRpYT88L3N0cm9uZz48YnIvPlxuICAgICAgUHl0aG9uIGlzIHRoZSBmb3VuZGF0aW9uLCBidXQgZW1wbG95ZXJzIGFsc28gd2FudDogU1FMIChmb3IgZGF0YWJhc2UgcXVlcmllcyksIGRhdGEgdmlzdWFsaXphdGlvbiBza2lsbHMsIGFuZCBrbm93bGVkZ2Ugb2YgYXQgbGVhc3Qgb25lIE1MIGZyYW1ld29yay4gVGhlIGNvbWJpbmF0aW9uIG9mIFB5dGhvbiArIFNRTCArIFRhYmxlYXUvUG93ZXIgQkkgaXMgZW5vdWdoIGZvciBtb3N0IGp1bmlvciBkYXRhIGFuYWx5c3Qgcm9sZXMgaW4gSW5kaWEuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnUml5YSBEZXNhaScsXG4gICAgYXV0aG9yVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZycsXG4gICAgcHVibGlzaGVkRGF0ZTogJzIwMjYtMDQtMDhUMTE6MDA6MDArMDU6MzAnLFxuICAgIG1vZGlmaWVkRGF0ZTogJzIwMjYtMDQtMDhUMTE6MDA6MDArMDU6MzAnLFxuICAgIGRhdGU6ICdBcHJpbCA4LCAyMDI2JyxcbiAgICByZWFkVGltZTogJzEyIG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDEyNTAsXG4gICAgY2F0ZWdvcnk6ICdQeXRob24nLFxuICAgIHRhZ3M6IFsnUHl0aG9uIERhdGEgU2NpZW5jZScsICdEYXRhIFNjaWVuY2UgQmVnaW5uZXJzJywgJ1B5dGhvbiBNYWNoaW5lIExlYXJuaW5nJywgJ051bVB5IFBhbmRhcycsICdBSSBQeXRob24gMjAyNicsICdMZWFybiBEYXRhIFNjaWVuY2UgSW5kaWEnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxMjg4MDQ5LWJlYmRhNGUzOGY3MT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdEYXRhIHNjaWVuY2UgY2hhcnRzIGFuZCBQeXRob24gY29kZSBvbiBhIGNvbXB1dGVyIHNjcmVlbicsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9weXRob24tZm9yLWRhdGEtc2NpZW5jZS1iZWdpbm5lcnMtMjAyNicsXG4gICAgcmVsYXRlZENvdXJzZToge1xuICAgICAgdGl0bGU6ICdVbHRpbWF0ZSBQeXRob24gTWFzdGVyY2xhc3MnLFxuICAgICAgc2x1ZzogJ3VsdGltYXRlLXB5dGhvbi1tYXN0ZXJjbGFzcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xlYXJuIFB5dGhvbiBmcm9tIHNjcmF0Y2ggXHUyMDE0IHRoZSBmb3VuZGF0aW9uIGZvciBkYXRhIHNjaWVuY2UsIEFJLCBhbmQgYXV0b21hdGlvbi4gRnJlZSB3aXRoIGNlcnRpZmljYXRlLidcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2hvdy10by1iZWNvbWUtYS13ZWItZGV2ZWxvcGVyLTIwMjYnLFxuICAgIHRpdGxlOiAnSG93IHRvIEJlY29tZSBhIFdlYiBEZXZlbG9wZXIgaW4gMjAyNjogVGhlIENvbXBsZXRlIFJvYWRtYXAnLFxuICAgIG1ldGFUaXRsZTogJ0hvdyB0byBCZWNvbWUgYSBXZWIgRGV2ZWxvcGVyIGluIDIwMjYgXHUyMDE0IENvbXBsZXRlIFJvYWRtYXAgfCBTa2lsbFZhbGl4JyxcbiAgICBtZXRhRGVzY3JpcHRpb246ICdXYW50IHRvIGJlY29tZSBhIHdlYiBkZXZlbG9wZXIgaW4gMjAyNj8gVGhpcyBjb21wbGV0ZSBzdGVwLWJ5LXN0ZXAgcm9hZG1hcCBjb3ZlcnMgSFRNTCwgQ1NTLCBKYXZhU2NyaXB0LCBSZWFjdCwgYmFja2VuZCwgYW5kIGhvdyB0byBsYW5kIHlvdXIgZmlyc3Qgam9iIFx1MjAxNCBldmVuIHdpdGhvdXQgYSBkZWdyZWUuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ2hvdyB0byBiZWNvbWUgYSB3ZWIgZGV2ZWxvcGVyJyxcbiAgICAgICd3ZWIgZGV2ZWxvcGVyIHJvYWRtYXAgMjAyNicsXG4gICAgICAnYmVjb21lIGEgd2ViIGRldmVsb3BlciB3aXRob3V0IGRlZ3JlZScsXG4gICAgICAnd2ViIGRldmVsb3BtZW50IGNhcmVlciAyMDI2JyxcbiAgICAgICdsZWFybiB3ZWIgZGV2ZWxvcG1lbnQgZnJlZScsXG4gICAgICAnZnJvbnRlbmQgZGV2ZWxvcGVyIHJvYWRtYXAnLFxuICAgICAgJ3dlYiBkZXZlbG9wZXIgc2FsYXJ5IEluZGlhJyxcbiAgICAgICdob3cgdG8gZ2V0IHdlYiBkZXZlbG9wZXIgam9iJyxcbiAgICAgICdmdWxsIHN0YWNrIGRldmVsb3BlciByb2FkbWFwJyxcbiAgICAgICd3ZWIgZGV2ZWxvcG1lbnQgZm9yIGJlZ2lubmVycyAyMDI2JyxcbiAgICBdLFxuICAgIGV4Y2VycHQ6ICdXZWIgZGV2ZWxvcG1lbnQgaXMgb25lIG9mIHRoZSBtb3N0IGluLWRlbWFuZCBhbmQgaGlnaGVzdC1wYXlpbmcgY2FyZWVycyBpbiAyMDI2LiBIZXJlIGlzIHRoZSBleGFjdCBzdGVwLWJ5LXN0ZXAgcm9hZG1hcCB0byBnbyBmcm9tIHplcm8gdG8gam9iLXJlYWR5IFx1MjAxNCBubyBkZWdyZWUgcmVxdWlyZWQuJyxcbiAgICBjb250ZW50OiBgXG4gICAgICA8aDI+V2h5IFdlYiBEZXZlbG9wbWVudCBpcyB0aGUgQmVzdCBDYXJlZXIgdG8gU3RhcnQgaW4gMjAyNjwvaDI+XG4gICAgICA8cD5XZWIgZGV2ZWxvcGVycyBhcmUgYW1vbmcgdGhlIG1vc3QgaW4tZGVtYW5kIHByb2Zlc3Npb25hbHMgaW4gSW5kaWEgYW5kIGdsb2JhbGx5LiBUaGUgYXZlcmFnZSBmcmVzaGVyIHdlYiBkZXZlbG9wZXIgc2FsYXJ5IGluIEluZGlhIHJhbmdlcyBmcm9tIFx1MjBCOTMuNSBMUEEgdG8gXHUyMEI5NyBMUEEsIHdpdGggZXhwZXJpZW5jZWQgZGV2ZWxvcGVycyBlYXJuaW5nIFx1MjBCOTE1XHUyMDEzNDAgTFBBIGFuZCBhYm92ZS4gVW5saWtlIG1hbnkgY2FyZWVycywgd2ViIGRldmVsb3BtZW50IGlzIDEwMCUgc2tpbGwtYmFzZWQgXHUyMDE0IG5vIGRlZ3JlZSwgbm8gY29sbGVnZSBicmFuZCwgbm8gZW50cmFuY2UgZXhhbS4gV2hhdCBtYXR0ZXJzIGlzIHdoYXQgeW91IGNhbiBidWlsZC48L3A+XG4gICAgICA8cD5UaGlzIHJvYWRtYXAgZ2l2ZXMgeW91IHRoZSBleGFjdCBzZXF1ZW5jZSBvZiBza2lsbHMgdG8gbGVhcm4sIGluIHRoZSBjb3JyZWN0IG9yZGVyLCB3aXRoIGZyZWUgcmVzb3VyY2VzIGZvciBlYWNoIHN0ZXAuPC9wPlxuXG4gICAgICA8aDI+U3RlcCAxOiBNYXN0ZXIgSFRNTCBcdTIwMTQgVGhlIEZvdW5kYXRpb24gKDJcdTIwMTMzIFdlZWtzKTwvaDI+XG4gICAgICA8cD5IVE1MIChIeXBlclRleHQgTWFya3VwIExhbmd1YWdlKSBpcyB0aGUgc2tlbGV0b24gb2YgZXZlcnkgd2VicGFnZS4gRXZlcnkgd2ViIGRldmVsb3BlciBzdGFydHMgaGVyZS4gVGhlcmUgYXJlIG5vIHNob3J0Y3V0cy4gWW91IG11c3QgdW5kZXJzdGFuZCBIVE1MIGJlZm9yZSB0b3VjaGluZyBDU1Mgb3IgSmF2YVNjcmlwdC48L3A+XG4gICAgICA8cD5XaGF0IHRvIGxlYXJuIGluIEhUTUw6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Eb2N1bWVudCBzdHJ1Y3R1cmU6PC9zdHJvbmc+IDxjb2RlPiZsdDshRE9DVFlQRSBodG1sJmd0OzwvY29kZT4sIDxjb2RlPiZsdDtodG1sJmd0OzwvY29kZT4sIDxjb2RlPiZsdDtoZWFkJmd0OzwvY29kZT4sIDxjb2RlPiZsdDtib2R5Jmd0OzwvY29kZT48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5UZXh0IGVsZW1lbnRzOjwvc3Ryb25nPiBIZWFkaW5ncyAoaDFcdTIwMTNoNiksIHBhcmFncmFwaHMsIGxpc3RzLCBsaW5rcywgaW1hZ2VzPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+U2VtYW50aWMgSFRNTDUgdGFnczo8L3N0cm9uZz4gPGNvZGU+Jmx0O2hlYWRlciZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7bWFpbiZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7YXJ0aWNsZSZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7c2VjdGlvbiZndDs8L2NvZGU+LCA8Y29kZT4mbHQ7Zm9vdGVyJmd0OzwvY29kZT4sIDxjb2RlPiZsdDtuYXYmZ3Q7PC9jb2RlPjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkZvcm1zOjwvc3Ryb25nPiBJbnB1dCB0eXBlcywgdmFsaWRhdGlvbiBhdHRyaWJ1dGVzLCBsYWJlbHMsIGJ1dHRvbnM8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5UYWJsZXMgYW5kIG1lZGlhOjwvc3Ryb25nPiBUYWJsZXMsIHZpZGVvLCBhdWRpbywgaWZyYW1lczwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkFjY2Vzc2liaWxpdHkgYmFzaWNzOjwvc3Ryb25nPiBhbHQgdGV4dCwgYXJpYS1sYWJlbCwgc2VtYW50aWMgc3RydWN0dXJlPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD5GcmVlIHJlc291cmNlOiBUaGUgPGEgaHJlZj1cIi9jb3Vyc2VzL3VsdGltYXRlLWh0bWwtbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBIVE1MIE1hc3RlcmNsYXNzIG9uIFNraWxsVmFsaXg8L2E+IGNvdmVycyBhbGwgb2YgdGhpcyBmcm9tIHNjcmF0Y2ggd2l0aCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUuPC9wPlxuXG4gICAgICA8aDI+U3RlcCAyOiBMZWFybiBDU1MgXHUyMDE0IE1ha2UgSXQgTG9vayBHb29kICgzXHUyMDEzNCBXZWVrcyk8L2gyPlxuICAgICAgPHA+Q1NTIChDYXNjYWRpbmcgU3R5bGUgU2hlZXRzKSBjb250cm9scyB0aGUgdmlzdWFsIHByZXNlbnRhdGlvbiBvZiB5b3VyIEhUTUwuIFRoaXMgaXMgd2hlcmUgd2ViIGRldmVsb3BtZW50IGdldHMgY3JlYXRpdmUuIE1vZGVybiBDU1MgaXMgcG93ZXJmdWwgXHUyMDE0IHlvdSBjYW4gYnVpbGQgc3R1bm5pbmcsIHJlc3BvbnNpdmUgbGF5b3V0cyB3aXRob3V0IGEgc2luZ2xlIGxpbmUgb2YgSmF2YVNjcmlwdC48L3A+XG4gICAgICA8cD5Fc3NlbnRpYWwgQ1NTIHNraWxsczo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48c3Ryb25nPlNlbGVjdG9ycyBhbmQgc3BlY2lmaWNpdHk6PC9zdHJvbmc+IGNsYXNzLCBpZCwgZWxlbWVudCwgcHNldWRvLWNsYXNzIHNlbGVjdG9yczwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlRoZSBib3ggbW9kZWw6PC9zdHJvbmc+IG1hcmdpbiwgcGFkZGluZywgYm9yZGVyLCBjb250ZW50IFx1MjAxNCB0aGUgZm91bmRhdGlvbiBvZiBhbGwgbGF5b3V0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RmxleGJveDo8L3N0cm9uZz4gT25lLWRpbWVuc2lvbmFsIGxheW91dHMgXHUyMDE0IG5hdmJhcnMsIGNhcmQgcm93cywgY2VudGVyaW5nPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q1NTIEdyaWQ6PC9zdHJvbmc+IFR3by1kaW1lbnNpb25hbCBsYXlvdXRzIFx1MjAxNCBmdWxsIHBhZ2Ugc3RydWN0dXJlcywgY2FyZCBncmlkczwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlJlc3BvbnNpdmUgZGVzaWduOjwvc3Ryb25nPiBNZWRpYSBxdWVyaWVzLCBtb2JpbGUtZmlyc3QgYXBwcm9hY2gsIHZpZXdwb3J0IHVuaXRzPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q1NTIHZhcmlhYmxlczo8L3N0cm9uZz4gPGNvZGU+LS1wcmltYXJ5LWNvbG9yPC9jb2RlPiBmb3IgY29uc2lzdGVudCwgbWFpbnRhaW5hYmxlIHN0eWxlczwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlRyYW5zaXRpb25zIGFuZCBhbmltYXRpb25zOjwvc3Ryb25nPiBTbW9vdGggaG92ZXIgZWZmZWN0cyBhbmQgbWljcm8taW50ZXJhY3Rpb25zPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD5GcmVlIHJlc291cmNlOiBUaGUgPGEgaHJlZj1cIi9jb3Vyc2VzL2Nzcy1mb3ItYmVnaW5uZXJzLWxlYXJuLXdlYi1zdHlsaW5nLXplcm8tdG8tcHJvXCI+Q1NTIGZvciBCZWdpbm5lcnM6IFplcm8gdG8gUHJvIGNvdXJzZSBvbiBTa2lsbFZhbGl4PC9hPiB0YWtlcyB5b3UgZnJvbSB5b3VyIGZpcnN0IHNlbGVjdG9yIHRvIGFkdmFuY2VkIEdyaWQgbGF5b3V0cy48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDM6IE1hc3RlciBKYXZhU2NyaXB0IFx1MjAxNCBBZGQgQmVoYXZpb3VyICg0XHUyMDEzNiBXZWVrcyk8L2gyPlxuICAgICAgPHA+SmF2YVNjcmlwdCBpcyB3aGF0IG1ha2VzIHdlYnNpdGVzIGludGVyYWN0aXZlLiBGb3JtcyB0aGF0IHZhbGlkYXRlLCBtZW51cyB0aGF0IG9wZW4sIGNvbnRlbnQgdGhhdCBsb2FkcyB3aXRob3V0IHJlZnJlc2hpbmcgXHUyMDE0IGFsbCBKYXZhU2NyaXB0LiBJdCBpcyB0aGUgbW9zdCBpbXBvcnRhbnQgbGFuZ3VhZ2UgaW4gd2ViIGRldmVsb3BtZW50IGFuZCBvbmUgb2YgdGhlIG1vc3QgdmVyc2F0aWxlIHByb2dyYW1taW5nIGxhbmd1YWdlcyBldmVyIGNyZWF0ZWQuPC9wPlxuICAgICAgPHA+SmF2YVNjcmlwdCBmdW5kYW1lbnRhbHMgdG8gbWFzdGVyOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPlZhcmlhYmxlczogPGNvZGU+bGV0PC9jb2RlPiwgPGNvZGU+Y29uc3Q8L2NvZGU+LCBkYXRhIHR5cGVzLCB0eXBlIGNvZXJjaW9uPC9saT5cbiAgICAgICAgPGxpPkZ1bmN0aW9uczogZGVjbGFyYXRpb25zLCBleHByZXNzaW9ucywgYXJyb3cgZnVuY3Rpb25zLCBjYWxsYmFja3M8L2xpPlxuICAgICAgICA8bGk+QXJyYXlzIGFuZCBvYmplY3RzOiBtZXRob2RzLCBkZXN0cnVjdHVyaW5nLCBzcHJlYWQgb3BlcmF0b3I8L2xpPlxuICAgICAgICA8bGk+RE9NIG1hbmlwdWxhdGlvbjogPGNvZGU+cXVlcnlTZWxlY3RvcjwvY29kZT4sIDxjb2RlPmFkZEV2ZW50TGlzdGVuZXI8L2NvZGU+LCA8Y29kZT5jbGFzc0xpc3Q8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPkFzeW5jIEphdmFTY3JpcHQ6IFByb21pc2VzLCA8Y29kZT5hc3luYy9hd2FpdDwvY29kZT4sIDxjb2RlPmZldGNoKCk8L2NvZGU+IEFQSTwvbGk+XG4gICAgICAgIDxsaT5FUzYrIGZlYXR1cmVzOiBtb2R1bGVzLCB0ZW1wbGF0ZSBsaXRlcmFscywgb3B0aW9uYWwgY2hhaW5pbmc8L2xpPlxuICAgICAgICA8bGk+RXJyb3IgaGFuZGxpbmc6IHRyeS9jYXRjaCwgZXJyb3IgdHlwZXM8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkF0IHRoaXMgcG9pbnQgXHUyMDE0IHdpdGggSFRNTCwgQ1NTLCBhbmQgSmF2YVNjcmlwdCBcdTIwMTQgeW91IGNhbiBidWlsZCBjb21wbGV0ZSBzdGF0aWMgd2Vic2l0ZXMgYW5kIGFwcGx5IGZvciBqdW5pb3IgZnJvbnRlbmQgcm9sZXMgb3IgaW50ZXJuc2hpcHMuIEJ1aWxkIDJcdTIwMTMzIHByb2plY3RzIChhIHBvcnRmb2xpbyBzaXRlLCBhIHRvLWRvIGFwcCwgYSB3ZWF0aGVyIGFwcCB1c2luZyBhIHB1YmxpYyBBUEkpIGFuZCBwdXQgdGhlbSBvbiBHaXRIdWIuPC9wPlxuXG4gICAgICA8aDI+U3RlcCA0OiBMZWFybiBSZWFjdCBcdTIwMTQgVGhlIEluZHVzdHJ5IFN0YW5kYXJkICg0XHUyMDEzNSBXZWVrcyk8L2gyPlxuICAgICAgPHA+UmVhY3QgaXMgdXNlZCBieSA0MCUrIG9mIGFsbCB3ZWIgYXBwbGljYXRpb25zIGdsb2JhbGx5LiBFdmVyeSBtYWpvciB0ZWNoIGNvbXBhbnkgaW4gSW5kaWEgXHUyMDE0IEZsaXBrYXJ0LCBTd2lnZ3ksIFpvbWF0bywgUmF6b3JwYXkgXHUyMDE0IHVzZXMgUmVhY3QuIExlYXJuaW5nIFJlYWN0IG1ha2VzIHlvdSBkcmFtYXRpY2FsbHkgbW9yZSBlbXBsb3lhYmxlIGFzIGEgZnJvbnRlbmQgZGV2ZWxvcGVyLjwvcD5cbiAgICAgIDxwPkNvcmUgUmVhY3QgY29uY2VwdHM6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5KU1g6PC9zdHJvbmc+IEhUTUwtbGlrZSBzeW50YXggaW5zaWRlIEphdmFTY3JpcHQ8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Db21wb25lbnRzOjwvc3Ryb25nPiBGdW5jdGlvbmFsIGNvbXBvbmVudHMsIHByb3BzLCBjb21wb25lbnQgY29tcG9zaXRpb248L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5TdGF0ZSBtYW5hZ2VtZW50Ojwvc3Ryb25nPiA8Y29kZT51c2VTdGF0ZTwvY29kZT4sIDxjb2RlPnVzZUVmZmVjdDwvY29kZT4sIDxjb2RlPnVzZUNvbnRleHQ8L2NvZGU+PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UmVhY3QgUm91dGVyOjwvc3Ryb25nPiBDbGllbnQtc2lkZSByb3V0aW5nIGZvciBzaW5nbGUtcGFnZSBhcHBsaWNhdGlvbnM8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5GZXRjaGluZyBkYXRhOjwvc3Ryb25nPiBBUEkgY2FsbHMgd2l0aCA8Y29kZT5mZXRjaDwvY29kZT4gb3IgQXhpb3MgaW4gdXNlRWZmZWN0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Rm9ybXMgaW4gUmVhY3Q6PC9zdHJvbmc+IENvbnRyb2xsZWQgaW5wdXRzLCBmb3JtIHZhbGlkYXRpb248L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkJ1aWxkIGEgZnVsbCBSZWFjdCBwcm9qZWN0IFx1MjAxNCBhIG11bHRpLXBhZ2UgYXBwIHdpdGggcm91dGluZywgQVBJIGludGVncmF0aW9uLCBhbmQgc3RhdGUgbWFuYWdlbWVudC4gVGhpcyBpcyB5b3VyIHBvcnRmb2xpbyBjZW50cmVwaWVjZS48L3A+XG5cbiAgICAgIDxoMj5TdGVwIDU6IEJhY2tlbmQgQmFzaWNzIFx1MjAxNCBOb2RlLmpzIGFuZCBFeHByZXNzICgzXHUyMDEzNCBXZWVrcyk8L2gyPlxuICAgICAgPHA+VG8gYmVjb21lIGEgZnVsbC1zdGFjayBkZXZlbG9wZXIgXHUyMDE0IHdoaWNoIHBheXMgc2lnbmlmaWNhbnRseSBtb3JlIFx1MjAxNCB5b3UgbmVlZCBiYWNrZW5kIGtub3dsZWRnZS4gTm9kZS5qcyBsZXRzIHlvdSBydW4gSmF2YVNjcmlwdCBvbiB0aGUgc2VydmVyLCBhbmQgRXhwcmVzcyBpcyB0aGUgbW9zdCBwb3B1bGFyIGZyYW1ld29yayBmb3IgYnVpbGRpbmcgQVBJcyBpbiBOb2RlLjwvcD5cbiAgICAgIDxwPkJhY2tlbmQgc2tpbGxzIHRvIGxlYXJuOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPk5vZGUuanMgZnVuZGFtZW50YWxzOiBtb2R1bGVzLCBucG0sIGZpbGUgc3lzdGVtPC9saT5cbiAgICAgICAgPGxpPkV4cHJlc3M6IHJvdXRpbmcsIG1pZGRsZXdhcmUsIHJlcXVlc3QvcmVzcG9uc2UgaGFuZGxpbmc8L2xpPlxuICAgICAgICA8bGk+UkVTVCBBUElzOiBHRVQsIFBPU1QsIFBVVCwgREVMRVRFIGVuZHBvaW50czwvbGk+XG4gICAgICAgIDxsaT5Nb25nb0RCOiBkb2N1bWVudC1iYXNlZCBkYXRhYmFzZSwgQ1JVRCBvcGVyYXRpb25zIHdpdGggTW9uZ29vc2U8L2xpPlxuICAgICAgICA8bGk+QXV0aGVudGljYXRpb246IEpXVCB0b2tlbnMsIGJjcnlwdCBwYXNzd29yZCBoYXNoaW5nPC9saT5cbiAgICAgICAgPGxpPkVudmlyb25tZW50IHZhcmlhYmxlcyBhbmQgLmVudiBmaWxlczwvbGk+XG4gICAgICAgIDxsaT5EZXBsb3lpbmcgdG8gVmVyY2VsIG9yIFJlbmRlcjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDI+U3RlcCA2OiBCdWlsZCBQcm9qZWN0cyBhbmQgQ3JlYXRlIFlvdXIgUG9ydGZvbGlvPC9oMj5cbiAgICAgIDxwPlByb2plY3RzIGFyZSB0aGUgbW9zdCBpbXBvcnRhbnQgcGFydCBvZiB5b3VyIHdlYiBkZXZlbG9wbWVudCBqb3VybmV5LiBSZWNydWl0ZXJzIHNwZW5kIDEwIHNlY29uZHMgb24geW91ciByZXN1bWUgXHUyMDE0IGJ1dCB0aGV5IHNwZW5kIDUgbWludXRlcyBvbiB5b3VyIHBvcnRmb2xpby4gSGVyZSBhcmUgdGhlIHByb2plY3RzIGV2ZXJ5IGp1bmlvciBkZXZlbG9wZXIgc2hvdWxkIGhhdmU6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5QZXJzb25hbCBwb3J0Zm9saW8gd2Vic2l0ZTwvc3Ryb25nPiBcdTIwMTQgU2hvd2Nhc2VzIHlvdXIgc2tpbGxzLCBwcm9qZWN0cywgYW5kIGNvbnRhY3QgaW5mbzwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkZ1bGwtc3RhY2sgQ1JVRCBhcHA8L3N0cm9uZz4gXHUyMDE0IEEgbm90ZS10YWtpbmcgYXBwLCB0YXNrIG1hbmFnZXIsIG9yIGJsb2cgd2l0aCB1c2VyIGF1dGhlbnRpY2F0aW9uPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+QVBJIGludGVncmF0aW9uIHByb2plY3Q8L3N0cm9uZz4gXHUyMDE0IEEgd2VhdGhlciBhcHAsIGN1cnJlbmN5IGNvbnZlcnRlciwgb3IgbW92aWUgZGF0YWJhc2UgdXNpbmcgYSBwdWJsaWMgQVBJPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RS1jb21tZXJjZSBvciBib29raW5nIFVJIGNsb25lPC9zdHJvbmc+IFx1MjAxNCBEZW1vbnN0cmF0ZXMgeW91ciBhYmlsaXR5IHRvIGJ1aWxkIGNvbXBsZXgsIHJlYWwtd29ybGQgaW50ZXJmYWNlczwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+SG9zdCBhbGwgcHJvamVjdHMgb24gR2l0SHViIHdpdGggY2xlYXIgUkVBRE1FIGZpbGVzLiBEZXBsb3kgdGhlbSBsaXZlIChWZXJjZWwgZm9yIGZyb250ZW5kLCBSZW5kZXIgZm9yIGJhY2tlbmQpIHNvIHJlY3J1aXRlcnMgY2FuIHNlZSB0aGVtIHdvcmtpbmcuPC9wPlxuXG4gICAgICA8aDI+U3RlcCA3OiBBcHBseSBmb3IgSm9icyBhbmQgRnJlZWxhbmNlIFByb2plY3RzPC9oMj5cbiAgICAgIDxwPk9uY2UgeW91IGhhdmUgMyBwcm9qZWN0cyBsaXZlIGFuZCB5b3VyIGZ1bmRhbWVudGFscyBzb2xpZCwgc3RhcnQgYXBwbHlpbmcuIEhlcmUgaXMgdGhlIHJlYWxpc3RpYyB0aW1lbGluZSBmb3IgbGFuZGluZyB5b3VyIGZpcnN0IHJvbGU6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Nb250aCAxXHUyMDEzMjo8L3N0cm9uZz4gSFRNTCwgQ1NTLCBiYXNpYyBKYXZhU2NyaXB0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TW9udGggM1x1MjAxMzQ6PC9zdHJvbmc+IEFkdmFuY2VkIEphdmFTY3JpcHQsIFJlYWN0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TW9udGggNVx1MjAxMzY6PC9zdHJvbmc+IE5vZGUuanMvRXhwcmVzcywgTW9uZ29EQiwgZnVsbC1zdGFjayBwcm9qZWN0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TW9udGggNlx1MjAxMzg6PC9zdHJvbmc+IEFjdGl2ZWx5IGFwcGx5aW5nLCBidWlsZGluZyBwb3J0Zm9saW8sIGRvaW5nIG1vY2sgaW50ZXJ2aWV3czwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+V2hlcmUgdG8gZmluZCBqb2JzOiBMaW5rZWRJbiBKb2JzLCBOYXVrcmksIEludGVybnNoYWxhIChmb3IgaW50ZXJuc2hpcHMpLCBBbmdlbExpc3QgZm9yIHN0YXJ0dXBzLCBhbmQgZGlyZWN0IGFwcGxpY2F0aW9ucyB0byBjb21wYW5pZXMgeW91IGFkbWlyZS4gRm9yIGZyZWVsYW5jaW5nLCBwbGF0Zm9ybXMgbGlrZSBUb3B0YWwsIFVwd29yaywgYW5kIEZpdmVyciBhcmUgc3RhcnRpbmcgcG9pbnRzIHdoaWxlIHlvdSBidWlsZCB5b3VyIHJlcHV0YXRpb24uPC9wPlxuXG4gICAgICA8aDI+RG8gWW91IE5lZWQgYSBDb21wdXRlciBTY2llbmNlIERlZ3JlZSB0byBCZWNvbWUgYSBXZWIgRGV2ZWxvcGVyPzwvaDI+XG4gICAgICA8cD5ObyBcdTIwMTQgYW5kIHRoaXMgaXMgb25lIG9mIHRoZSBtb3N0IGxpYmVyYXRpbmcgZmFjdHMgYWJvdXQgd2ViIGRldmVsb3BtZW50LiBFbXBsb3llcnMgaGlyZSB3ZWIgZGV2ZWxvcGVycyBiYXNlZCBvbiB0aGVpciBwb3J0Zm9saW8gYW5kIHdoYXQgdGhleSBjYW4gYnVpbGQsIG5vdCB0aGVpciBkZWdyZWVzLiBNYW55IG9mIEluZGlhJ3MgdG9wIGZyb250ZW5kIGFuZCBmdWxsLXN0YWNrIGRldmVsb3BlcnMgYXJlIHNlbGYtdGF1Z2h0LiBBIHN0cm9uZyBHaXRIdWIgcHJvZmlsZSB3aXRoIGRlcGxveWVkIHByb2plY3RzIGlzIHdvcnRoIG1vcmUgdGhhbiBtb3N0IGNvbGxlZ2UgZGVncmVlcyBpbiB0aGlzIGZpZWxkLjwvcD5cbiAgICAgIDxwPlRoYXQgc2FpZCwgaWYgeW91IHdhbnQgdG8gbW92ZSBpbnRvIGJhY2tlbmQgZW5naW5lZXJpbmcsIHN5c3RlbSBkZXNpZ24sIG9yIG1hY2hpbmUgbGVhcm5pbmcgbGF0ZXIsIGEgQ1MgZm91bmRhdGlvbiBoZWxwcy4gQnV0IGZvciB3ZWIgZGV2ZWxvcG1lbnQgc3BlY2lmaWNhbGx5LCBza2lsbHMgYW5kIHBvcnRmb2xpbyBiZWF0IGNyZWRlbnRpYWxzIGV2ZXJ5IHRpbWUuPC9wPlxuXG4gICAgICA8aDI+RnJlZSBXZWIgRGV2ZWxvcG1lbnQgQ291cnNlcyBvbiBTa2lsbFZhbGl4PC9oMj5cbiAgICAgIDxwPkFsbCB0aGUgY291cnNlcyB5b3UgbmVlZCBmb3IgdGhpcyByb2FkbWFwIGFyZSBhdmFpbGFibGUgZnJlZSBvbiBTa2lsbFZhbGl4LCBlYWNoIGVuZGluZyB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZTo8L3A+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT48YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtaHRtbC1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEhUTUwgTWFzdGVyY2xhc3M8L2E+IFx1MjAxNCBNYXN0ZXIgc2VtYW50aWMgSFRNTDUgZnJvbSBzY3JhdGNoPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy9jc3MtZm9yLWJlZ2lubmVycy1sZWFybi13ZWItc3R5bGluZy16ZXJvLXRvLXByb1wiPkNTUyBmb3IgQmVnaW5uZXJzOiBaZXJvIHRvIFBybzwvYT4gXHUyMDE0IEZsZXhib3gsIEdyaWQsIGFuaW1hdGlvbnMsIHJlc3BvbnNpdmUgZGVzaWduPC9saT5cbiAgICAgICAgPGxpPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhc2NyaXB0LW1hc3RlcmNsYXNzXCI+VWx0aW1hdGUgSmF2YVNjcmlwdCBNYXN0ZXJjbGFzczwvYT4gXHUyMDE0IEZ1bGwgSlMgZnJvbSB2YXJpYWJsZXMgdG8gYXN5bmMvYXdhaXQ8L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zPC9oMj5cblxuICAgICAgPHA+PHN0cm9uZz5RMTogSG93IGxvbmcgZG9lcyBpdCB0YWtlIHRvIGJlY29tZSBhIHdlYiBkZXZlbG9wZXIgZnJvbSBzY3JhdGNoPzwvc3Ryb25nPjxici8+XG4gICAgICBXaXRoIGNvbnNpc3RlbnQgZGFpbHkgcHJhY3RpY2Ugb2YgMlx1MjAxMzMgaG91cnMsIG1vc3QgcGVvcGxlIHJlYWNoIGp1bmlvciBqb2ItcmVhZHkgbGV2ZWwgaW4gNlx1MjAxMzkgbW9udGhzLiBJZiB5b3Ugc3R1ZHkgZnVsbC10aW1lICg2XHUyMDEzOCBob3VycyBwZXIgZGF5KSwgeW91IGNhbiBjb21wcmVzcyB0aGlzIHRvIDNcdTIwMTM0IG1vbnRocy4gVGhlIGtleSB2YXJpYWJsZSBpcyBub3QgdGltZSBcdTIwMTQgaXQgaXMgdGhlIHF1YWxpdHkgYW5kIHF1YW50aXR5IG9mIHByb2plY3RzIHlvdSBidWlsZCBhbG9uZyB0aGUgd2F5LjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogV2hhdCBpcyB0aGUgc2FsYXJ5IG9mIGEgd2ViIGRldmVsb3BlciBpbiBJbmRpYSBpbiAyMDI2Pzwvc3Ryb25nPjxici8+XG4gICAgICBKdW5pb3Igd2ViIGRldmVsb3BlcjogXHUyMEI5M1x1MjAxMzYgTFBBLiBNaWQtbGV2ZWwgKDJcdTIwMTM0IHllYXJzIGV4cGVyaWVuY2UpOiBcdTIwQjk4XHUyMDEzMTggTFBBLiBTZW5pb3IvZnVsbC1zdGFjayAoNSsgeWVhcnMpOiBcdTIwQjkyMFx1MjAxMzQ1IExQQS4gUmVhY3QgYW5kIE5vZGUuanMgc2tpbGxzIHB1c2ggc2FsYXJpZXMgdG8gdGhlIGhpZ2hlciBlbmQuIEZyZWVsYW5jaW5nIGNhbiBlYXJuIFx1MjBCOTUwLDAwMFx1MjAxM1x1MjBCOTMsMDAsMDAwKyBwZXIgbW9udGggZm9yIGV4cGVyaWVuY2VkIGRldmVsb3BlcnMgd2l0aCBnb29kIGNsaWVudHMuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBTaG91bGQgSSBsZWFybiBmcm9udGVuZCBvciBmdWxsLXN0YWNrIGZpcnN0Pzwvc3Ryb25nPjxici8+XG4gICAgICBBbHdheXMgc3RhcnQgd2l0aCBmcm9udGVuZCAoSFRNTCwgQ1NTLCBKYXZhU2NyaXB0LCBSZWFjdCkuIEl0IGlzIGZhc3RlciB0byBzZWUgcmVzdWx0cywgbW9yZSBiZWdpbm5lci1mcmllbmRseSwgYW5kIGdpdmVzIHlvdSB0aGUgdmlzdWFsIGZlZWRiYWNrIHRoYXQga2VlcHMgeW91IG1vdGl2YXRlZC4gT25jZSB5b3UgYXJlIGNvbWZvcnRhYmxlIHdpdGggUmVhY3QsIGFkZGluZyBOb2RlLmpzIGFuZCBNb25nb0RCIHRha2VzIDRcdTIwMTM2IGFkZGl0aW9uYWwgd2Vla3MuIEZ1bGwtc3RhY2sga25vd2xlZGdlIG5lYXJseSBkb3VibGVzIHlvdXIgam9iIG9wcG9ydHVuaXRpZXMgYW5kIHNhbGFyeSBwb3RlbnRpYWwuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlE0OiBJcyB3ZWIgZGV2ZWxvcG1lbnQgc3RpbGwgaW4gZGVtYW5kIGluIDIwMjY/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFllcyBcdTIwMTQgbW9yZSB0aGFuIGV2ZXIuIEV2ZXJ5IGJ1c2luZXNzIG5lZWRzIGEgd2ViIHByZXNlbmNlLiBBSSB0b29scyBsaWtlIEdpdEh1YiBDb3BpbG90IGFzc2lzdCBkZXZlbG9wZXJzIGJ1dCBjYW5ub3QgcmVwbGFjZSB0aGVtIFx1MjAxNCB0aGV5IHJlcXVpcmUgYSBkZXZlbG9wZXIgd2hvIHVuZGVyc3RhbmRzIHRoZSBjb2RlIHRoZXkgZ2VuZXJhdGUuIFRoZSByaXNlIG9mIEFJIGhhcyBhY3R1YWxseSBpbmNyZWFzZWQgZGVtYW5kIGZvciBkZXZlbG9wZXJzIHdobyB1bmRlcnN0YW5kIGJvdGggY29kZSBBTkQgQUkgdG9vbHMuIFdlYiBkZXZlbG9wbWVudCByZW1haW5zIG9uZSBvZiB0aGUgbW9zdCBzZWN1cmUgYW5kIGhpZ2gtcGF5aW5nIHRlY2hub2xvZ3kgY2FyZWVycyB0aHJvdWdoIGF0IGxlYXN0IDIwMzAuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnQXJqdW4gTWVodGEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA1LTAxVDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA1LTAxVDA5OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnTWF5IDEsIDIwMjYnLFxuICAgIHJlYWRUaW1lOiAnMTQgbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogMTU0MCxcbiAgICBjYXRlZ29yeTogJ0NhcmVlcicsXG4gICAgdGFnczogWydXZWIgRGV2ZWxvcG1lbnQgQ2FyZWVyJywgJ1dlYiBEZXZlbG9wZXIgUm9hZG1hcCcsICdMZWFybiBXZWIgRGV2ZWxvcG1lbnQnLCAnRnJvbnRlbmQgRGV2ZWxvcGVyJywgJ0Z1bGwgU3RhY2sgRGV2ZWxvcGVyJywgJ1dlYiBEZXZlbG9wZXIgU2FsYXJ5IEluZGlhJywgJ0NvZGluZyBDYXJlZXIgMjAyNiddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTgwNTAxMDgwMjMtYzUyNDlmNGRmMDg1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ0RldmVsb3BlciBjb2Rpbmcgb24gbGFwdG9wIHdpdGggSFRNTCBDU1MgSmF2YVNjcmlwdCBjb2RlIG9uIHNjcmVlbicsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9ob3ctdG8tYmVjb21lLWEtd2ViLWRldmVsb3Blci0yMDI2JyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1VsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3MnLFxuICAgICAgc2x1ZzogJ3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXN0ZXIgdGhlIG1vc3QgY3JpdGljYWwgc2tpbGwgaW4gd2ViIGRldmVsb3BtZW50IFx1MjAxNCBKYXZhU2NyaXB0IFx1MjAxNCBmb3IgZnJlZSB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZS4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdiZXN0LXByb2dyYW1taW5nLWxhbmd1YWdlcy10by1sZWFybi0yMDI2JyxcbiAgICB0aXRsZTogJ0Jlc3QgUHJvZ3JhbW1pbmcgTGFuZ3VhZ2VzIHRvIExlYXJuIGluIDIwMjYgKFJhbmtlZCBieSBKb2JzICYgU2FsYXJ5KScsXG4gICAgbWV0YVRpdGxlOiAnQmVzdCBQcm9ncmFtbWluZyBMYW5ndWFnZXMgdG8gTGVhcm4gaW4gMjAyNiBcdTIwMTQgUmFua2VkIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnV2hpY2ggcHJvZ3JhbW1pbmcgbGFuZ3VhZ2Ugc2hvdWxkIHlvdSBsZWFybiBpbiAyMDI2PyBXZSByYW5rIHRoZSB0b3AgbGFuZ3VhZ2VzIGJ5IGpvYiBkZW1hbmQsIGF2ZXJhZ2Ugc2FsYXJ5LCBhbmQgbGVhcm5pbmcgY3VydmUgXHUyMDE0IHNvIHlvdSBjYW4gbWFrZSB0aGUgcmlnaHQgY2hvaWNlIGZvciB5b3VyIGNhcmVlci4nLFxuICAgIGtleXdvcmRzOiBbXG4gICAgICAnYmVzdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMgdG8gbGVhcm4gMjAyNicsXG4gICAgICAnd2hpY2ggcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UgdG8gbGVhcm4nLFxuICAgICAgJ21vc3QgaW4gZGVtYW5kIHByb2dyYW1taW5nIGxhbmd1YWdlcyAyMDI2JyxcbiAgICAgICdwcm9ncmFtbWluZyBsYW5ndWFnZSBmb3Igam9iIDIwMjYnLFxuICAgICAgJ2Jlc3QgY29kaW5nIGxhbmd1YWdlIGZvciBiZWdpbm5lcnMnLFxuICAgICAgJ0phdmFTY3JpcHQgdnMgUHl0aG9uIDIwMjYnLFxuICAgICAgJ3Byb2dyYW1taW5nIGxhbmd1YWdlIHNhbGFyeSBJbmRpYScsXG4gICAgICAndG9wIHByb2dyYW1taW5nIGxhbmd1YWdlcyBmb3Igam9icyBJbmRpYScsXG4gICAgXSxcbiAgICBleGNlcnB0OiAnSmF2YVNjcmlwdCwgUHl0aG9uLCBKYXZhLCBHbywgUnVzdCBcdTIwMTQgd2l0aCBzbyBtYW55IGxhbmd1YWdlcywgd2hpY2ggb25lIHNob3VsZCB5b3UgYWN0dWFsbHkgbGVhcm4gaW4gMjAyNj8gV2UgcmFuayB0aGUgdG9wIHByb2dyYW1taW5nIGxhbmd1YWdlcyBieSBqb2IgZGVtYW5kLCBzYWxhcnksIGFuZCBsZWFybmluZyBjdXJ2ZS4nLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxoMj5UaGUgTW9zdCBJbXBvcnRhbnQgRGVjaXNpb24gYSBCZWdpbm5lciBNYWtlczwvaDI+XG4gICAgICA8cD5DaG9vc2luZyB5b3VyIGZpcnN0IHByb2dyYW1taW5nIGxhbmd1YWdlIGlzIHRoZSBtb3N0IGltcGFjdGZ1bCBkZWNpc2lvbiB5b3Ugd2lsbCBtYWtlIGFzIGEgYmVnaW5uZXIgXHUyMDE0IG5vdCBiZWNhdXNlIHNvbWUgbGFuZ3VhZ2VzIGFyZSBpbXBvc3NpYmx5IGhhcmQsIGJ1dCBiZWNhdXNlIGVhY2ggb25lIG9wZW5zIGEgZGlmZmVyZW50IGRvb3IuIFB5dGhvbiBnZXRzIHlvdSBpbnRvIGRhdGEgc2NpZW5jZSBhbmQgQUkuIEphdmFTY3JpcHQgZ2V0cyB5b3UgaW50byB3ZWIgYW5kIG1vYmlsZSBkZXZlbG9wbWVudC4gSmF2YSBnZXRzIHlvdSBpbnRvIGVudGVycHJpc2Ugc29mdHdhcmUgYW5kIEFuZHJvaWQuIFRoZSByaWdodCBjaG9pY2UgZGVwZW5kcyBvbiB3aGVyZSB5b3Ugd2FudCB0byBnby48L3A+XG4gICAgICA8cD5UaGlzIGd1aWRlIHJhbmtzIHRoZSB0b3AgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzIGJ5IHRocmVlIGZhY3RvcnMgdGhhdCBhY3R1YWxseSBtYXR0ZXI6IGpvYiBkZW1hbmQgaW4gSW5kaWEgYW5kIGdsb2JhbGx5LCBhdmVyYWdlIHNhbGFyeSwgYW5kIHJlYWxpc3RpYyBsZWFybmluZyBjdXJ2ZSBmb3IgYSBiZWdpbm5lci48L3A+XG5cbiAgICAgIDxoMj4xLiBKYXZhU2NyaXB0IFx1MjAxNCBCZXN0IGZvciBXZWIgRGV2ZWxvcG1lbnQgJiBIaWdoZXN0IEpvYiBWb2x1bWU8L2gyPlxuICAgICAgPHA+PHN0cm9uZz5CZXN0IGZvcjo8L3N0cm9uZz4gV2ViIGRldmVsb3BtZW50IChmcm9udGVuZCArIGJhY2tlbmQpLCBtb2JpbGUgYXBwcyAoUmVhY3QgTmF0aXZlKSwgc2VydmVybGVzcyBmdW5jdGlvbnM8L3A+XG4gICAgICA8cD48c3Ryb25nPkF2ZXJhZ2Ugc2FsYXJ5IGluIEluZGlhOjwvc3Ryb25nPiBcdTIwQjk1XHUyMDEzMzAgTFBBIGRlcGVuZGluZyBvbiBleHBlcmllbmNlIGFuZCBmcmFtZXdvcms8L3A+XG4gICAgICA8cD48c3Ryb25nPkxlYXJuaW5nIGN1cnZlOjwvc3Ryb25nPiBNZWRpdW0gXHUyMDE0IGVhc3kgdG8gc3RhcnQsIGRlZXAgdG8gbWFzdGVyPC9wPlxuICAgICAgPHA+SmF2YVNjcmlwdCBpcyB0aGUgb25seSBsYW5ndWFnZSB0aGF0IHJ1bnMgbmF0aXZlbHkgaW4gd2ViIGJyb3dzZXJzIFx1MjAxNCB3aGljaCBtZWFucyBldmVyeSB3ZWJzaXRlIG9uIHRoZSBpbnRlcm5ldCB1c2VzIGl0LiBJdCBhbHNvIHJ1bnMgb24gc2VydmVycyAoTm9kZS5qcyksIG1vYmlsZSAoUmVhY3QgTmF0aXZlKSwgYW5kIGRlc2t0b3AgKEVsZWN0cm9uKS4gVGhlIGpvYiB2b2x1bWUgZm9yIEphdmFTY3JpcHQgZGV2ZWxvcGVycyBpcyB0aGUgaGlnaGVzdCBvZiBhbnkgbGFuZ3VhZ2UgaW4gSW5kaWEgb24gTmF1a3JpLCBMaW5rZWRJbiwgYW5kIEluc3RhaHlyZS48L3A+XG4gICAgICA8cD5JbiAyMDI2LCBrbm93aW5nIEphdmFTY3JpcHQgd2l0aCBSZWFjdCAoZnJvbnRlbmQpIGFuZCBOb2RlLmpzIChiYWNrZW5kKSBtYWtlcyB5b3UgYSBmdWxsLXN0YWNrIGRldmVsb3BlciBcdTIwMTQgb25lIG9mIHRoZSBtb3N0IGluLWRlbWFuZCBhbmQgdmVyc2F0aWxlIHJvbGVzIGluIHRlY2guIFRoZSBsZWFybmluZyBwYXRoIGlzIHdlbGwtZG9jdW1lbnRlZCwgZnJlZSByZXNvdXJjZXMgYXJlIGFidW5kYW50LCBhbmQgdGhlIGNvbW11bml0eSBpcyBlbm9ybW91cy48L3A+XG4gICAgICA8cD48c3Ryb25nPkxlYXJuIGl0IGlmOjwvc3Ryb25nPiBZb3Ugd2FudCB0byBidWlsZCB3ZWJzaXRlcywgd2ViIGFwcHMsIG9yIG1vYmlsZSBhcHBzLCBvciB3YW50IHRoZSBtb3N0IGpvYiBvcHBvcnR1bml0aWVzIGFzIGEgZnJlc2hlci48L3A+XG4gICAgICA8cD5GcmVlIHJlc291cmNlOiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzc1wiPlVsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3Mgb24gU2tpbGxWYWxpeDwvYT48L3A+XG5cbiAgICAgIDxoMj4yLiBQeXRob24gXHUyMDE0IEJlc3QgZm9yIEFJLCBEYXRhIFNjaWVuY2UgJiBBdXRvbWF0aW9uPC9oMj5cbiAgICAgIDxwPjxzdHJvbmc+QmVzdCBmb3I6PC9zdHJvbmc+IERhdGEgc2NpZW5jZSwgbWFjaGluZSBsZWFybmluZywgQUksIGF1dG9tYXRpb24sIHNjcmlwdGluZywgd2ViIEFQSXMgKERqYW5nby9GYXN0QVBJKTwvcD5cbiAgICAgIDxwPjxzdHJvbmc+QXZlcmFnZSBzYWxhcnkgaW4gSW5kaWE6PC9zdHJvbmc+IFx1MjBCOTRcdTIwMTMzNSBMUEEgKGRhdGEgc2NpZW5jZSByb2xlcyBwYXkgc2lnbmlmaWNhbnRseSBtb3JlKTwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm5pbmcgY3VydmU6PC9zdHJvbmc+IExvdyBcdTIwMTQgdGhlIG1vc3QgYmVnaW5uZXItZnJpZW5kbHkgc3ludGF4IG9mIGFueSBtYWpvciBsYW5ndWFnZTwvcD5cbiAgICAgIDxwPlB5dGhvbidzIGRvbWluYW5jZSBpbiBBSSBhbmQgbWFjaGluZSBsZWFybmluZyBpcyBhYnNvbHV0ZS4gRXZlcnkgbWFqb3IgTUwgZnJhbWV3b3JrIFx1MjAxNCBUZW5zb3JGbG93LCBQeVRvcmNoLCBzY2lraXQtbGVhcm4sIEh1Z2dpbmcgRmFjZSBcdTIwMTQgaXMgUHl0aG9uLWZpcnN0LiBBcyBBSSB0cmFuc2Zvcm1zIGV2ZXJ5IGluZHVzdHJ5IGluIDIwMjYsIFB5dGhvbiBza2lsbHMgYXJlIGJlY29taW5nIGEgcmVxdWlyZW1lbnQgaW4gcm9sZXMgZmFyIGJleW9uZCB0cmFkaXRpb25hbCBzb2Z0d2FyZSBlbmdpbmVlcmluZyBcdTIwMTQgZGF0YSBhbmFseXN0cywgcmVzZWFyY2hlcnMsIHByb2R1Y3QgbWFuYWdlcnMsIGFuZCBldmVuIGZpbmFuY2UgcHJvZmVzc2lvbmFscyBhcmUgbGVhcm5pbmcgUHl0aG9uLjwvcD5cbiAgICAgIDxwPlB5dGhvbiBhbHNvIGhhcyB0aGUgc2ltcGxlc3QsIG1vc3QgcmVhZGFibGUgc3ludGF4IG9mIGFueSBsYW5ndWFnZSBcdTIwMTQgd2hpY2ggbWFrZXMgaXQgdGhlIGJlc3QgZmlyc3QgbGFuZ3VhZ2UgZm9yIGNvbXBsZXRlIGJlZ2lubmVycy4gWW91IHdyaXRlIGxlc3MgY29kZSB0byBkbyBtb3JlLCBhbmQgZXJyb3IgbWVzc2FnZXMgYXJlIGNsZWFyIGFuZCBhY3Rpb25hYmxlLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm4gaXQgaWY6PC9zdHJvbmc+IFlvdSB3YW50IHRvIHdvcmsgaW4gQUksIGRhdGEgc2NpZW5jZSwgYXV0b21hdGlvbiwgb3IgbmVlZCBhIGJlZ2lubmVyLWZyaWVuZGx5IGZpcnN0IGxhbmd1YWdlLjwvcD5cbiAgICAgIDxwPkZyZWUgcmVzb3VyY2U6IDxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3NcIj5VbHRpbWF0ZSBQeXRob24gTWFzdGVyY2xhc3Mgb24gU2tpbGxWYWxpeDwvYT48L3A+XG5cbiAgICAgIDxoMj4zLiBKYXZhIFx1MjAxNCBCZXN0IGZvciBFbnRlcnByaXNlIFNvZnR3YXJlICYgQW5kcm9pZDwvaDI+XG4gICAgICA8cD48c3Ryb25nPkJlc3QgZm9yOjwvc3Ryb25nPiBFbnRlcnByaXNlIGJhY2tlbmQgc3lzdGVtcywgQW5kcm9pZCBkZXZlbG9wbWVudCwgbGFyZ2Utc2NhbGUgZGlzdHJpYnV0ZWQgc3lzdGVtczwvcD5cbiAgICAgIDxwPjxzdHJvbmc+QXZlcmFnZSBzYWxhcnkgaW4gSW5kaWE6PC9zdHJvbmc+IFx1MjBCOTVcdTIwMTM0MCBMUEEgKHNlbmlvciBKYXZhIGFyY2hpdGVjdHMgY29tbWFuZCB2ZXJ5IGhpZ2ggc2FsYXJpZXMpPC9wPlxuICAgICAgPHA+PHN0cm9uZz5MZWFybmluZyBjdXJ2ZTo8L3N0cm9uZz4gSGlnaCBcdTIwMTQgc3RyaWN0IHR5cGluZyBhbmQgdmVyYm9zZSBzeW50YXg8L3A+XG4gICAgICA8cD5KYXZhIGhhcyBwb3dlcmVkIGVudGVycHJpc2Ugc29mdHdhcmUgZm9yIDMwIHllYXJzIFx1MjAxNCBhbmQgaXQgc3RpbGwgZG9lcy4gQkZTSSAoQmFua2luZywgRmluYW5jaWFsIFNlcnZpY2VzLCBJbnN1cmFuY2UpIGNvbXBhbmllcywgbGFyZ2UgZW50ZXJwcmlzZXMsIGFuZCBNTkNzIGxpa2UgVENTLCBJbmZvc3lzLCBXaXBybywgYW5kIElCTSBoaXJlIEphdmEgZGV2ZWxvcGVycyBhdCBtYXNzaXZlIHNjYWxlLiBBbmRyb2lkIGRldmVsb3BtZW50ICh0aG91Z2ggS290bGluIGlzIG5vdyBwcmVmZXJyZWQsIEphdmEgcmVtYWlucyB3aWRlbHkgdXNlZCkgYWxzbyBkcml2ZXMgSmF2YSBkZW1hbmQuPC9wPlxuICAgICAgPHA+SmF2YSBpcyBtb3JlIHZlcmJvc2UgYW5kIGhhcyBhIHN0ZWVwZXIgbGVhcm5pbmcgY3VydmUgdGhhbiBQeXRob24gb3IgSmF2YVNjcmlwdCBcdTIwMTQgYnV0IGl0IHRlYWNoZXMgeW91IHN0cm9uZyBzb2Z0d2FyZSBlbmdpbmVlcmluZyBwcmluY2lwbGVzIChPT1AsIGRlc2lnbiBwYXR0ZXJucywgdHlwZSBzeXN0ZW1zKSB0aGF0IHRyYW5zZmVyIHRvIGV2ZXJ5IG90aGVyIGxhbmd1YWdlLiBKYXZhIGRldmVsb3BlcnMgYXJlIHJlbGlhYmx5IGVtcGxveWVkIGFuZCBjb21tYW5kIHN0cm9uZyBzYWxhcmllcyBhdCBtaWQtdG8tc2VuaW9yIGxldmVscy48L3A+XG4gICAgICA8cD48c3Ryb25nPkxlYXJuIGl0IGlmOjwvc3Ryb25nPiBZb3Ugd2FudCB0byB3b3JrIGF0IGxhcmdlIGNvbXBhbmllcywgaW4gZW50ZXJwcmlzZSBiYW5raW5nL2luc3VyYW5jZSBzb2Z0d2FyZSwgb3Igd2FudCBBbmRyb2lkIGRldmVsb3BtZW50LjwvcD5cblxuICAgICAgPGgyPjQuIFNRTCBcdTIwMTQgVGhlIE1vc3QgVW5kZXJyYXRlZCBFc3NlbnRpYWwgU2tpbGw8L2gyPlxuICAgICAgPHA+PHN0cm9uZz5CZXN0IGZvcjo8L3N0cm9uZz4gRGF0YSBhbmFseXNpcywgYmFja2VuZCBkZXZlbG9wbWVudCwgYnVzaW5lc3MgaW50ZWxsaWdlbmNlLCBhbnkgcm9sZSB0aGF0IHRvdWNoZXMgZGF0YTwvcD5cbiAgICAgIDxwPjxzdHJvbmc+QXZlcmFnZSBzYWxhcnkgYm9vc3Q6PC9zdHJvbmc+IFNRTCBhZGRzIFx1MjBCOTFcdTIwMTM1IExQQSB0byBhbnkgcm9sZSB0aGF0IHVzZXMgZGF0YTwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm5pbmcgY3VydmU6PC9zdHJvbmc+IFZlcnkgbG93IFx1MjAxNCBtb3N0IGJhc2ljcyBsZWFybmFibGUgaW4gYSB3ZWVrPC9wPlxuICAgICAgPHA+U1FMIGlzIG5vdCBhIGdlbmVyYWwtcHVycG9zZSBwcm9ncmFtbWluZyBsYW5ndWFnZSBcdTIwMTQgaXQgaXMgYSBxdWVyeSBsYW5ndWFnZSBmb3IgZGF0YWJhc2VzLiBCdXQgaXQgaXMgYXJndWFibHkgdGhlIG1vc3QgdW5pdmVyc2FsbHkgdXNlZnVsIHRlY2huaWNhbCBza2lsbCBvZiBhbGwuIEV2ZXJ5IGNvbXBhbnkgc3RvcmVzIGRhdGEgaW4gZGF0YWJhc2VzLiBFdmVyeSBkYXRhIGFuYWx5c3QsIGJhY2tlbmQgZGV2ZWxvcGVyLCBidXNpbmVzcyBhbmFseXN0LCBhbmQgcHJvZHVjdCBtYW5hZ2VyIHdobyB0b3VjaGVzIGRhdGEgdXNlcyBTUUwgZGFpbHkuPC9wPlxuICAgICAgPHA+U1FMIGlzIG9mdGVuIG92ZXJsb29rZWQgYnkgYmVnaW5uZXJzIGluIGZhdm91ciBvZiBmbGFzaGllciBsYW5ndWFnZXMgXHUyMDE0IHdoaWNoIGlzIGEgbWlzdGFrZS4gQmVpbmcgU1FMLXByb2ZpY2llbnQgc2V0cyB5b3UgYXBhcnQgaW4gam9iIGFwcGxpY2F0aW9ucywgaXMgbGVhcm5hYmxlIGluIDJcdTIwMTM0IHdlZWtzLCBhbmQgYXBwbGllcyB0byB2aXJ0dWFsbHkgZXZlcnkgdGVjaCByb2xlLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm4gaXQgaWY6PC9zdHJvbmc+IFlvdSB3YW50IGFueSByb2xlIHRoYXQgaW52b2x2ZXMgZGF0YSBcdTIwMTQgd2hpY2ggaXMgYmFzaWNhbGx5IGV2ZXJ5IHRlY2ggcm9sZS48L3A+XG5cbiAgICAgIDxoMj41LiBUeXBlU2NyaXB0IFx1MjAxNCBUaGUgUHJvZmVzc2lvbmFsIEphdmFTY3JpcHQ8L2gyPlxuICAgICAgPHA+PHN0cm9uZz5CZXN0IGZvcjo8L3N0cm9uZz4gTGFyZ2Utc2NhbGUgd2ViIGFwcGxpY2F0aW9uIGRldmVsb3BtZW50LCB0ZWFtcywgZW50ZXJwcmlzZSBSZWFjdC9Ob2RlLmpzIHByb2plY3RzPC9wPlxuICAgICAgPHA+PHN0cm9uZz5BdmVyYWdlIHNhbGFyeTo8L3N0cm9uZz4gVHlwZVNjcmlwdCBkZXZlbG9wZXJzIGVhcm4gMTVcdTIwMTMyNSUgbW9yZSB0aGFuIHBsYWluIEphdmFTY3JpcHQgZGV2ZWxvcGVyczwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm5pbmcgY3VydmU6PC9zdHJvbmc+IExvdyBmb3IgSmF2YVNjcmlwdCBkZXZlbG9wZXJzIFx1MjAxNCBUeXBlU2NyaXB0IGlzIGEgc3VwZXJzZXQgb2YgSlM8L3A+XG4gICAgICA8cD5UeXBlU2NyaXB0IGFkZHMgb3B0aW9uYWwgc3RhdGljIHR5cGluZyB0byBKYXZhU2NyaXB0LiBJbiAyMDI2LCBldmVyeSBtYWpvciBSZWFjdCBjb2RlYmFzZSwgTm9kZS5qcyBiYWNrZW5kLCBhbmQgTmV4dC5qcyBhcHBsaWNhdGlvbiBhdCBhIHNlcmlvdXMgY29tcGFueSB1c2VzIFR5cGVTY3JpcHQuIEl0IGNhdGNoZXMgYnVncyBhdCBjb21waWxlIHRpbWUgdGhhdCBKYXZhU2NyaXB0IHdvdWxkIG9ubHkgY2F0Y2ggYXQgcnVudGltZSwgbWFrZXMgbGFyZ2UgY29kZWJhc2VzIG1haW50YWluYWJsZSwgYW5kIGRyYW1hdGljYWxseSBpbXByb3ZlcyBJREUgYXV0b2NvbXBsZXRlIGFuZCBlcnJvciBkZXRlY3Rpb24uPC9wPlxuICAgICAgPHA+SWYgeW91IGFscmVhZHkga25vdyBKYXZhU2NyaXB0LCBhZGRpbmcgVHlwZVNjcmlwdCB0YWtlcyAxXHUyMDEzMiB3ZWVrcyBhbmQgbWFrZXMgeW91IGEgc2lnbmlmaWNhbnRseSBtb3JlIGF0dHJhY3RpdmUgY2FuZGlkYXRlIHRvIGNvbXBhbmllcyB3aXRoIG1hdHVyZSBlbmdpbmVlcmluZyB0ZWFtcy48L3A+XG4gICAgICA8cD48c3Ryb25nPkxlYXJuIGl0IGlmOjwvc3Ryb25nPiBZb3Uga25vdyBKYXZhU2NyaXB0IGFuZCB3YW50IHRvIHdvcmsgYXQgY29tcGFuaWVzIHdpdGggc2VuaW9yIGVuZ2luZWVyaW5nIHRlYW1zIG9yIG9uIGxhcmdlIGNvZGViYXNlcy48L3A+XG5cbiAgICAgIDxoMj42LiBHbyAoR29sYW5nKSBcdTIwMTQgQmVzdCBmb3IgSGlnaC1QZXJmb3JtYW5jZSBCYWNrZW5kPC9oMj5cbiAgICAgIDxwPjxzdHJvbmc+QmVzdCBmb3I6PC9zdHJvbmc+IEhpZ2gtcGVyZm9ybWFuY2UgQVBJcywgbWljcm9zZXJ2aWNlcywgY2xvdWQgaW5mcmFzdHJ1Y3R1cmUsIERldk9wcyB0b29sczwvcD5cbiAgICAgIDxwPjxzdHJvbmc+QXZlcmFnZSBzYWxhcnkgaW4gSW5kaWE6PC9zdHJvbmc+IFx1MjBCOTE1XHUyMDEzNTAgTFBBIChHbyBpcyBhIHNwZWNpYWxpc3Qgc2tpbGwgd2l0aCBwcmVtaXVtIHNhbGFyaWVzKTwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm5pbmcgY3VydmU6PC9zdHJvbmc+IE1lZGl1bSBcdTIwMTQgc2ltcGxlciB0aGFuIEphdmEsIG1vcmUgZXhwbGljaXQgdGhhbiBQeXRob248L3A+XG4gICAgICA8cD5HbyB3YXMgYnVpbHQgYnkgR29vZ2xlIGZvciBoaWdoLXBlcmZvcm1hbmNlIGJhY2tlbmQgc3lzdGVtcy4gSXQgY29tcGlsZXMgdG8gbWFjaGluZSBjb2RlIChmYXN0IGFzIEMpLCBoYXMgYnVpbHQtaW4gY29uY3VycmVuY3kgcHJpbWl0aXZlcyAoZ29yb3V0aW5lcyksIGFuZCBwcm9kdWNlcyBzbWFsbCwgc2luZ2xlLWJpbmFyeSBleGVjdXRhYmxlcy4gQ29tcGFuaWVzIGxpa2UgR29vZ2xlLCBVYmVyLCBDbG91ZGZsYXJlLCBhbmQgUmF6b3JwYXkgdXNlIEdvIGZvciB0aGVpciBtb3N0IHBlcmZvcm1hbmNlLWNyaXRpY2FsIHNlcnZpY2VzLjwvcD5cbiAgICAgIDxwPkdvIGlzIG5vdCBhIGZpcnN0IGxhbmd1YWdlIFx1MjAxNCBsZWFybiBQeXRob24gb3IgSmF2YVNjcmlwdCBmaXJzdC4gQnV0IGZvciBkZXZlbG9wZXJzIHdobyB3YW50IHRvIHNwZWNpYWxpc2UgaW4gYmFja2VuZCBpbmZyYXN0cnVjdHVyZSwgRGV2T3BzLCBvciBoaWdoLXBlcmZvcm1hbmNlIG1pY3Jvc2VydmljZXMsIEdvIGlzIHRoZSBtb3N0IHZhbHVhYmxlIHNwZWNpYWxpc3Qgc2tpbGwgd2l0aCB0aGUgaGlnaGVzdCBzYWxhcnkgcHJlbWl1bSBpbiAyMDI2LjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+TGVhcm4gaXQgaWY6PC9zdHJvbmc+IFlvdSBoYXZlIDFcdTIwMTMyIHllYXJzIG9mIGV4cGVyaWVuY2UgYW5kIHdhbnQgdG8gc3BlY2lhbGlzZSBpbiBiYWNrZW5kIGluZnJhc3RydWN0dXJlIG9yIGNsb3VkIHN5c3RlbXMuPC9wPlxuXG4gICAgICA8aDI+VGhlIERlY2lzaW9uIEZyYW1ld29yazogV2hpY2ggTGFuZ3VhZ2UgU2hvdWxkIFlPVSBMZWFybj88L2gyPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Db21wbGV0ZSBiZWdpbm5lciwgd2FudCBtYXhpbXVtIGpvYiBvcHBvcnR1bml0aWVzOjwvc3Ryb25nPiBKYXZhU2NyaXB0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q29tcGxldGUgYmVnaW5uZXIsIGludGVyZXN0ZWQgaW4gQUkgb3IgZGF0YTo8L3N0cm9uZz4gUHl0aG9uPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+V2FudCB0byB3b3JrIGF0IGxhcmdlIEluZGlhbiBlbnRlcnByaXNlcyBvciBNTkNzOjwvc3Ryb25nPiBKYXZhPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+QWxyZWFkeSBrbm93IEphdmFTY3JpcHQsIHdhbnQgYSBzYWxhcnkgYnVtcDo8L3N0cm9uZz4gVHlwZVNjcmlwdDwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPldhbnQgdG8gd29yayBpbiBkYXRhIGFuYWx5c2lzIHdpdGhvdXQgZnVsbCBlbmdpbmVlcmluZzo8L3N0cm9uZz4gU1FMICsgUHl0aG9uPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RXhwZXJpZW5jZWQgZGV2ZWxvcGVyLCB3YW50IHNwZWNpYWxpc3QgYmFja2VuZCBwcmVtaXVtOjwvc3Ryb25nPiBHbzwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHA+T25lIGltcG9ydGFudCBwcmluY2lwbGU6IG1hc3RlciBvbmUgbGFuZ3VhZ2UgZGVlcGx5IGJlZm9yZSBhZGRpbmcgYSBzZWNvbmQuIEEgZGV2ZWxvcGVyIHdobyBrbm93cyBKYXZhU2NyaXB0IGF0IGEgc2VuaW9yIGxldmVsIGlzIGZhciBtb3JlIGVtcGxveWFibGUgdGhhbiBvbmUgd2hvIGtub3dzIHNpeCBsYW5ndWFnZXMgYXQgYSBiZWdpbm5lciBsZXZlbC4gRGVwdGggYmVhdHMgYnJlYWR0aCBcdTIwMTQgZXNwZWNpYWxseSBmb3IgeW91ciBmaXJzdCB0d28geWVhcnMuPC9wPlxuXG4gICAgICA8aDI+V2hhdCBBYm91dCBSdXN0LCBLb3RsaW4sIFN3aWZ0LCBhbmQgUEhQPzwvaDI+XG4gICAgICA8cD5SdXN0IGlzIGV4Y2VsbGVudCBmb3Igc3lzdGVtcyBwcm9ncmFtbWluZyBhbmQgbWVtb3J5IHNhZmV0eSBidXQgaGFzIGEgdmVyeSBzdGVlcCBsZWFybmluZyBjdXJ2ZSBhbmQgbGltaXRlZCBqb2Igdm9sdW1lIGluIEluZGlhLiBLb3RsaW4gaXMgcHJlZmVycmVkIGZvciBuZXcgQW5kcm9pZCBhcHBzIGJ1dCBKYXZhIHJlbWFpbnMgZG9taW5hbnQuIFN3aWZ0IGlzIGVzc2VudGlhbCBmb3IgaU9TL21hY09TIGRldmVsb3BtZW50LiBQSFAgcG93ZXJzIFdvcmRQcmVzcyBzaXRlcyBidXQgaGFzIGRlY2xpbmluZyByZWxldmFuY2UgZm9yIG5ldyBwcm9qZWN0cy4gVGhlc2UgYXJlIGFsbCB2YWx1YWJsZSBcdTIwMTQgYnV0IG5vbmUgb2YgdGhlbSBhcmUgdGhlIHJpZ2h0IGZpcnN0IGNob2ljZSBmb3IgYSBiZWdpbm5lciB0YXJnZXRpbmcgbWF4aW11bSBjYXJlZXIgaW1wYWN0IGluIDIwMjYuPC9wPlxuXG4gICAgICA8aDI+RnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnM8L2gyPlxuXG4gICAgICA8cD48c3Ryb25nPlExOiBTaG91bGQgSSBsZWFybiBQeXRob24gb3IgSmF2YVNjcmlwdCBmaXJzdD88L3N0cm9uZz48YnIvPlxuICAgICAgQm90aCBhcmUgZXhjZWxsZW50IGNob2ljZXMuIElmIHlvdSB3YW50IHRvIGJ1aWxkIHdlYnNpdGVzIG9yIGFwcHMgXHUyMDE0IGNob29zZSBKYXZhU2NyaXB0LiBJZiB5b3Ugd2FudCB0byB3b3JrIHdpdGggZGF0YSwgQUksIG9yIGF1dG9tYXRpb24gXHUyMDE0IGNob29zZSBQeXRob24uIEJvdGggYXJlIGJlZ2lubmVyLWZyaWVuZGx5IGFuZCBoYXZlIHN0cm9uZyBqb2IgbWFya2V0cy4gVGhlIHNpbmdsZSBiaWdnZXN0IG1pc3Rha2UgaXMgc3BlbmRpbmcgd2Vla3MgdW5hYmxlIHRvIGRlY2lkZS4gUGljayBvbmUgYW5kIHN0YXJ0IHRvZGF5LjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogSXMgSmF2YSBzdGlsbCB3b3J0aCBsZWFybmluZyBpbiAyMDI2Pzwvc3Ryb25nPjxici8+XG4gICAgICBZZXMsIGFic29sdXRlbHkuIEphdmEncyBqb2Igdm9sdW1lIGluIEluZGlhIGlzIGVub3Jtb3VzIFx1MjAxNCBwYXJ0aWN1bGFybHkgaW4gQkZTSSwgZW50ZXJwcmlzZSBzb2Z0d2FyZSwgYW5kIGxhcmdlIElUIGNvbXBhbmllcy4gSmF2YSBkZXZlbG9wZXJzIHdpdGggU3ByaW5nIEJvb3Qgc2tpbGxzIGFyZSBjb25zaXN0ZW50bHkgaW4gZGVtYW5kIGFuZCB3ZWxsLXBhaWQuIEtvdGxpbiBpcyBwcmVmZXJyZWQgZm9yIG5ldyBBbmRyb2lkIGRldmVsb3BtZW50LCBidXQgSmF2YSdzIGVudGVycHJpc2UgZG9taW5hbmNlIG1ha2VzIGl0IGEgc291bmQgY2FyZWVyIGNob2ljZS48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTM6IEhvdyBtYW55IHByb2dyYW1taW5nIGxhbmd1YWdlcyBzaG91bGQgSSBrbm93Pzwvc3Ryb25nPjxici8+XG4gICAgICBGb3Igam9iIGFwcGxpY2F0aW9uczogbWFzdGVyIG9uZSBsYW5ndWFnZSBhbmQga25vdyBvbmUgc2Vjb25kYXJ5IGxhbmd1YWdlLiBGb3Igc2VuaW9yIHJvbGVzOiB0eXBpY2FsbHkgMlx1MjAxMzMgbGFuZ3VhZ2VzIHdlbGwsIHdpdGggZmFtaWxpYXJpdHkgaW4gMlx1MjAxMzMgb3RoZXJzLiBUaGUgZ29hbCBpcyBhbHdheXMgbWFzdGVyeSBvZiBhdCBsZWFzdCBvbmUgbGFuZ3VhZ2UgXHUyMDE0IGEganVuaW9yIHdobyBrbm93cyBKYXZhU2NyaXB0IGRlZXBseSB3aWxsIG91dGNvbXBldGUgb25lIHdobyBrbm93cyBKYXZhU2NyaXB0LCBQeXRob24sIEphdmEsIGFuZCBHbyBzdXBlcmZpY2lhbGx5IGV2ZXJ5IHRpbWUuPC9wPlxuICAgIGAsXG4gICAgYXV0aG9yOiAnTmVoYSBTaGFybWEnLFxuICAgIGF1dGhvclVybDogJ2h0dHBzOi8vd3d3LnNraWxsdmFsaXguY29tL2Jsb2cnLFxuICAgIHB1Ymxpc2hlZERhdGU6ICcyMDI2LTA1LTAyVDA5OjAwOjAwKzA1OjMwJyxcbiAgICBtb2RpZmllZERhdGU6ICcyMDI2LTA1LTAyVDA5OjAwOjAwKzA1OjMwJyxcbiAgICBkYXRlOiAnTWF5IDIsIDIwMjYnLFxuICAgIHJlYWRUaW1lOiAnMTMgbWluIHJlYWQnLFxuICAgIHdvcmRDb3VudDogMTM4MCxcbiAgICBjYXRlZ29yeTogJ0NhcmVlcicsXG4gICAgdGFnczogWydCZXN0IFByb2dyYW1taW5nIExhbmd1YWdlcyAyMDI2JywgJ0phdmFTY3JpcHQgdnMgUHl0aG9uJywgJ0xlYXJuIHRvIENvZGUnLCAnQ29kaW5nIENhcmVlciBJbmRpYScsICdQcm9ncmFtbWluZyBmb3IgQmVnaW5uZXJzJywgJ1dlYiBEZXZlbG9wbWVudCBDYXJlZXInLCAnRGF0YSBTY2llbmNlIENhcmVlciddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTU4NzkyMTgzNjctODQ2NmQ5MTBhYWE0P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ011bHRpcGxlIHByb2dyYW1taW5nIGxhbmd1YWdlIGxvZ29zIG9uIGEgc2NyZWVuIHJlcHJlc2VudGluZyBjb2RpbmcgbGFuZ3VhZ2UgY2hvaWNlcycsXG4gICAgY2Fub25pY2FsVXJsOiAnaHR0cHM6Ly93d3cuc2tpbGx2YWxpeC5jb20vYmxvZy9iZXN0LXByb2dyYW1taW5nLWxhbmd1YWdlcy10by1sZWFybi0yMDI2JyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1VsdGltYXRlIFB5dGhvbiBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGVhcm4gdGhlICMyIG1vc3QgaW1wb3J0YW50IGxhbmd1YWdlIGZvciAyMDI2IFx1MjAxNCBmcmVlIHdpdGggYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlLidcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZyZWUtb25saW5lLWNvdXJzZXMtd2l0aC1jZXJ0aWZpY2F0ZS1pbmRpYS0yMDI2JyxcbiAgICB0aXRsZTogJ0ZyZWUgT25saW5lIENvdXJzZXMgd2l0aCBDZXJ0aWZpY2F0ZSBpbiBJbmRpYSAoMjAyNikgXHUyMDE0IFZlcmlmaWVkICYgUmVjb2duaXNlZCcsXG4gICAgbWV0YVRpdGxlOiAnRnJlZSBPbmxpbmUgQ291cnNlcyB3aXRoIENlcnRpZmljYXRlIEluZGlhIDIwMjYgXHUyMDE0IFZlcmlmaWVkIHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnTG9va2luZyBmb3IgZnJlZSBvbmxpbmUgY291cnNlcyB3aXRoIGNlcnRpZmljYXRlcyBpbiBJbmRpYSBmb3IgMjAyNj8gRGlzY292ZXIgdGhlIGJlc3QgZnJlZSBjZXJ0aWZpZWQgY291cnNlcyBpbiB3ZWIgZGV2ZWxvcG1lbnQsIFB5dGhvbiwgQUksIGRhdGEgc2NpZW5jZSwgYW5kIG1vcmUgXHUyMDE0IHJlY29nbmlzZWQgYnkgZW1wbG95ZXJzLicsXG4gICAga2V5d29yZHM6IFtcbiAgICAgICdmcmVlIG9ubGluZSBjb3Vyc2VzIHdpdGggY2VydGlmaWNhdGUgSW5kaWEgMjAyNicsXG4gICAgICAnZnJlZSBjZXJ0aWZpY2F0aW9uIGNvdXJzZXMgSW5kaWEnLFxuICAgICAgJ2ZyZWUgb25saW5lIGNvdXJzZXMgd2l0aCBjZXJ0aWZpY2F0ZScsXG4gICAgICAnYmVzdCBmcmVlIG9ubGluZSBjb3Vyc2VzIEluZGlhJyxcbiAgICAgICdmcmVlIGNvZGluZyBjb3Vyc2VzIHdpdGggY2VydGlmaWNhdGUnLFxuICAgICAgJ2ZyZWUgcHl0aG9uIGNvdXJzZSBjZXJ0aWZpY2F0ZSBJbmRpYScsXG4gICAgICAnb25saW5lIGNlcnRpZmljYXRlIGNvdXJzZXMgZm9yIGpvYnMgSW5kaWEnLFxuICAgICAgJ2ZyZWUgd2ViIGRldmVsb3BtZW50IGNvdXJzZSBjZXJ0aWZpY2F0ZScsXG4gICAgICAnU2tpbGxWYWxpeCBmcmVlIGNvdXJzZXMnLFxuICAgICAgJ2xlYXJuIG9ubGluZSBmcmVlIGNlcnRpZmljYXRlIDIwMjYnLFxuICAgIF0sXG4gICAgZXhjZXJwdDogJ0ZyZWUgb25saW5lIGNvdXJzZXMgd2l0aCB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlcyBhcmUgb25lIG9mIHRoZSBmYXN0ZXN0IHdheXMgdG8gdXBza2lsbCBhbmQgcHJvdmUgeW91ciBza2lsbHMgdG8gZW1wbG95ZXJzIGluIDIwMjYuIEhlcmUgYXJlIHRoZSBiZXN0IG9wdGlvbnMgaW4gSW5kaWEgXHUyMDE0IG5vIGZlZXMsIG5vIGhpZGRlbiBjb3N0cy4nLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxoMj5XaHkgQ2VydGlmaWNhdGVzIGZyb20gRnJlZSBDb3Vyc2VzIE1hdHRlciBpbiAyMDI2PC9oMj5cbiAgICAgIDxwPlRoZSBjZXJ0aWZpY2F0ZSBpdHNlbGYgaXMgbm90IHdoYXQgbWF0dGVycyBcdTIwMTQgdGhlIHNraWxscyBiZWhpbmQgaXQgYXJlLiBCdXQgYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIGZyb20gYSByZXB1dGFibGUgcGxhdGZvcm0gc2VydmVzIGFzIHByb29mIG9mIHRob3NlIHNraWxscyB0byByZWNydWl0ZXJzIHdobyByZWNlaXZlIGh1bmRyZWRzIG9mIGFwcGxpY2F0aW9ucy4gSW4gMjAyNiwgSW5kaWFuIGVtcGxveWVycyBcdTIwMTQgZnJvbSBzdGFydHVwcyB0byBNTkNzIFx1MjAxNCBhY3RpdmVseSBsb29rIGZvciBjYW5kaWRhdGVzIHdpdGggZGVtb25zdHJhYmxlLCBzZWxmLWRpcmVjdGVkIGxlYXJuaW5nIHRocm91Z2ggb25saW5lIHBsYXRmb3Jtcy4gQSB2ZXJpZmllZCBjZXJ0aWZpY2F0ZSBvbiB5b3VyIExpbmtlZEluIG9yIHJlc3VtZSBpcyBhIGNyZWRpYmlsaXR5IHNpZ25hbCB0aGF0IGNvc3RzIHlvdSBub3RoaW5nIGV4Y2VwdCB0aW1lIGFuZCBlZmZvcnQuPC9wPlxuICAgICAgPHA+VGhpcyBndWlkZSBjb3ZlcnMgdGhlIGJlc3QgZnJlZSBjZXJ0aWZpZWQgY291cnNlcyBpbiBJbmRpYSBpbiAyMDI2LCB3aGF0IHNraWxscyB0aGV5IHRlYWNoLCBhbmQgd2hvIHNob3VsZCB0YWtlIHRoZW0uPC9wPlxuXG4gICAgICA8aDI+RnJlZSBDb3Vyc2VzIG9uIFNraWxsVmFsaXggKFdpdGggVmVyaWZpYWJsZSBDZXJ0aWZpY2F0ZXMpPC9oMj5cbiAgICAgIDxwPlNraWxsVmFsaXggb2ZmZXJzIGNvbXBsZXRlbHkgZnJlZSBjb3Vyc2VzIGFjcm9zcyBwcm9ncmFtbWluZywgd2ViIGRldmVsb3BtZW50LCBBSSwgYW5kIGRhdGEgc2NpZW5jZSBcdTIwMTQgYWxsIGVuZGluZyB3aXRoIGEgdmVyaWZpYWJsZSBjZXJ0aWZpY2F0ZSB0aGF0IGNhbiBiZSBzaGFyZWQgb24gTGlua2VkSW4gYW5kIGluY2x1ZGVkIG9uIHlvdXIgcmVzdW1lLiBVbmxpa2UgbWFueSBwbGF0Zm9ybXMgdGhhdCBvZmZlciBmcmVlIGNvdXJzZSBjb250ZW50IGJ1dCBjaGFyZ2UgZm9yIHRoZSBjZXJ0aWZpY2F0ZSwgU2tpbGxWYWxpeCBjZXJ0aWZpY2F0ZXMgYXJlIGNvbXBsZXRlbHkgZnJlZS48L3A+XG5cbiAgICAgIDxoMz4xLiBVbHRpbWF0ZSBKYXZhU2NyaXB0IE1hc3RlcmNsYXNzIFx1MjAxNCBGcmVlIHdpdGggQ2VydGlmaWNhdGU8L2gzPlxuICAgICAgPHA+SmF2YVNjcmlwdCBpcyB0aGUgbW9zdCBpbi1kZW1hbmQgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UgZm9yIHdlYiBkZXZlbG9wbWVudCBqb2JzLiBUaGlzIGNvdXJzZSB0YWtlcyB5b3UgZnJvbSB6ZXJvIHRvIHByb2ZpY2llbnQ6IHZhcmlhYmxlcywgZnVuY3Rpb25zLCBET00gbWFuaXB1bGF0aW9uLCBhcnJheXMsIG9iamVjdHMsIGNsb3N1cmVzLCBQcm9taXNlcywgYXN5bmMvYXdhaXQsIGFuZCBFUzYrIGZlYXR1cmVzLiBJZGVhbCBmb3IgYW55b25lIHdobyB3YW50cyB0byBiZWNvbWUgYSBmcm9udGVuZCBvciBmdWxsLXN0YWNrIGRldmVsb3Blci48L3A+XG4gICAgICA8cD48c3Ryb25nPkR1cmF0aW9uOjwvc3Ryb25nPiA4XHUyMDEzMTIgaG91cnMgb2YgY29udGVudCB8IDxzdHJvbmc+Q2VydGlmaWNhdGU6PC9zdHJvbmc+IFZlcmlmaWFibGUsIHNoYXJlYWJsZSBvbiBMaW5rZWRJbjwvcD5cbiAgICAgIDxwPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1qYXZhc2NyaXB0LW1hc3RlcmNsYXNzXCI+RW5yb2wgZnJlZSBcdTIxOTIgVWx0aW1hdGUgSmF2YVNjcmlwdCBNYXN0ZXJjbGFzczwvYT48L3A+XG5cbiAgICAgIDxoMz4yLiBVbHRpbWF0ZSBQeXRob24gTWFzdGVyY2xhc3MgXHUyMDE0IEZyZWUgd2l0aCBDZXJ0aWZpY2F0ZTwvaDM+XG4gICAgICA8cD5QeXRob24gaXMgdGhlIGxhbmd1YWdlIG9mIGRhdGEgc2NpZW5jZSwgQUksIGFuZCBhdXRvbWF0aW9uLiBUaGlzIGNvdXJzZSBjb3ZlcnMgUHl0aG9uIGZyb20gdGhlIGdyb3VuZCB1cDogdmFyaWFibGVzLCBjb250cm9sIGZsb3csIGZ1bmN0aW9ucywgZGF0YSBzdHJ1Y3R1cmVzLCBmaWxlIEkvTywgZXJyb3IgaGFuZGxpbmcsIGFuZCBvYmplY3Qtb3JpZW50ZWQgcHJvZ3JhbW1pbmcuIFN1aXRhYmxlIGZvciBjb21wbGV0ZSBiZWdpbm5lcnMgd2l0aCBubyBwcmlvciBjb2RpbmcgZXhwZXJpZW5jZS48L3A+XG4gICAgICA8cD48c3Ryb25nPkR1cmF0aW9uOjwvc3Ryb25nPiAxMFx1MjAxMzE0IGhvdXJzIHwgPHN0cm9uZz5DZXJ0aWZpY2F0ZTo8L3N0cm9uZz4gVmVyaWZpYWJsZSwgZnJlZTwvcD5cbiAgICAgIDxwPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1weXRob24tbWFzdGVyY2xhc3NcIj5FbnJvbCBmcmVlIFx1MjE5MiBVbHRpbWF0ZSBQeXRob24gTWFzdGVyY2xhc3M8L2E+PC9wPlxuXG4gICAgICA8aDM+My4gVWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzcyBcdTIwMTQgRnJlZSB3aXRoIENlcnRpZmljYXRlPC9oMz5cbiAgICAgIDxwPkhUTUwgaXMgdGhlIGZvdW5kYXRpb24gb2YgZXZlcnkgd2Vic2l0ZSBvbiB0aGUgaW50ZXJuZXQuIFRoaXMgY291cnNlIGNvdmVycyBzZW1hbnRpYyBIVE1MNSwgZm9ybXMsIGFjY2Vzc2liaWxpdHksIG11bHRpbWVkaWEsIGFuZCBkb2N1bWVudCBzdHJ1Y3R1cmUgXHUyMDE0IGdpdmluZyB5b3UgdGhlIHNvbGlkIGZvdW5kYXRpb24gZXZlcnkgd2ViIGRldmVsb3BlciBuZWVkcyBiZWZvcmUgbGVhcm5pbmcgQ1NTIGFuZCBKYXZhU2NyaXB0LjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+RHVyYXRpb246PC9zdHJvbmc+IDRcdTIwMTM2IGhvdXJzIHwgPHN0cm9uZz5DZXJ0aWZpY2F0ZTo8L3N0cm9uZz4gVmVyaWZpYWJsZSwgZnJlZTwvcD5cbiAgICAgIDxwPjxhIGhyZWY9XCIvY291cnNlcy91bHRpbWF0ZS1odG1sLW1hc3RlcmNsYXNzXCI+RW5yb2wgZnJlZSBcdTIxOTIgVWx0aW1hdGUgSFRNTCBNYXN0ZXJjbGFzczwvYT48L3A+XG5cbiAgICAgIDxoMz40LiBDU1MgZm9yIEJlZ2lubmVyczogWmVybyB0byBQcm8gXHUyMDE0IEZyZWUgd2l0aCBDZXJ0aWZpY2F0ZTwvaDM+XG4gICAgICA8cD5MZWFybiBDU1MgZnJvbSBmaXJzdCBwcmluY2lwbGVzOiBzZWxlY3RvcnMsIHRoZSBib3ggbW9kZWwsIEZsZXhib3gsIENTUyBHcmlkLCByZXNwb25zaXZlIGRlc2lnbiB3aXRoIG1lZGlhIHF1ZXJpZXMsIENTUyB2YXJpYWJsZXMsIGFuZCBhbmltYXRpb25zLiBCdWlsZCBiZWF1dGlmdWwsIHJlc3BvbnNpdmUgd2ViIGxheW91dHMuIFRoaXMgaXMgdGhlIGNvdXJzZSB0aGF0IG1ha2VzIHlvdXIgSFRNTCBsb29rIHByb2Zlc3Npb25hbC48L3A+XG4gICAgICA8cD48c3Ryb25nPkR1cmF0aW9uOjwvc3Ryb25nPiA2XHUyMDEzOCBob3VycyB8IDxzdHJvbmc+Q2VydGlmaWNhdGU6PC9zdHJvbmc+IFZlcmlmaWFibGUsIGZyZWU8L3A+XG4gICAgICA8cD48YSBocmVmPVwiL2NvdXJzZXMvY3NzLWZvci1iZWdpbm5lcnMtbGVhcm4td2ViLXN0eWxpbmctemVyby10by1wcm9cIj5FbnJvbCBmcmVlIFx1MjE5MiBDU1M6IFplcm8gdG8gUHJvPC9hPjwvcD5cblxuICAgICAgPGgzPjUuIEFJICYgTWFjaGluZSBMZWFybmluZyBGdW5kYW1lbnRhbHMgXHUyMDE0IEZyZWUgd2l0aCBDZXJ0aWZpY2F0ZTwvaDM+XG4gICAgICA8cD5VbmRlcnN0YW5kIHRoZSBjb3JlIGNvbmNlcHRzIGJlaGluZCBhcnRpZmljaWFsIGludGVsbGlnZW5jZSBhbmQgbWFjaGluZSBsZWFybmluZyB3aXRob3V0IGFkdmFuY2VkIG1hdGhlbWF0aWNzLiBUaGlzIGNvdXJzZSBleHBsYWlucyBuZXVyYWwgbmV0d29ya3MsIHN1cGVydmlzZWQgYW5kIHVuc3VwZXJ2aXNlZCBsZWFybmluZywgbW9kZWwgZXZhbHVhdGlvbiwgYW5kIHJlYWwtd29ybGQgQUkgYXBwbGljYXRpb25zIFx1MjAxNCBnaXZpbmcgeW91IHRoZSBjb25jZXB0dWFsIGZvdW5kYXRpb24gZm9yIGRlZXBlciBNTCBzdHVkeS48L3A+XG4gICAgICA8cD48c3Ryb25nPkR1cmF0aW9uOjwvc3Ryb25nPiA1XHUyMDEzNyBob3VycyB8IDxzdHJvbmc+Q2VydGlmaWNhdGU6PC9zdHJvbmc+IFZlcmlmaWFibGUsIGZyZWU8L3A+XG4gICAgICA8cD48YSBocmVmPVwiL2NvdXJzZXMvYmFzaWNzLW9mLWFydGlmaWNpYWwtaW50ZWxsaWdlbmNlLWJlZ2lubmVyc1wiPkVucm9sIGZyZWUgXHUyMTkyIEFJICYgTUwgRnVuZGFtZW50YWxzPC9hPjwvcD5cblxuICAgICAgPGgyPkhvdyB0byBNYWtlIHRoZSBNb3N0IG9mIEZyZWUgT25saW5lIENvdXJzZXM8L2gyPlxuICAgICAgPHA+RnJlZSBjb3Vyc2VzIG9ubHkgY3JlYXRlIHZhbHVlIGlmIHlvdSBjb21wbGV0ZSB0aGVtIGFuZCBhcHBseSB0aGUgc2tpbGxzLiBIZXJlIGlzIGhvdyB0byBtYXhpbWlzZSB0aGUgcmV0dXJuIGZyb20gYW55IGZyZWUgY291cnNlOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q29kZSBhbG9uZywgZG9uJ3QganVzdCB3YXRjaDo8L3N0cm9uZz4gUGFzc2l2ZSB3YXRjaGluZyByZXRhaW5zIDEwJSBvZiBjb250ZW50LiBUeXBpbmcgZXZlcnkgbGluZSBvZiBjb2RlIHlvdXJzZWxmIHJldGFpbnMgODAlKy48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5CdWlsZCBhIHByb2plY3QgYWZ0ZXIgZWFjaCBjb3Vyc2U6PC9zdHJvbmc+IEFwcGx5IHdoYXQgeW91IGxlYXJuZWQgaW4gYSByZWFsIG1pbmktcHJvamVjdCBiZWZvcmUgbW92aW5nIG9uLiBQcm9qZWN0cyBhcmUgd2hhdCBlbXBsb3llcnMgYWN0dWFsbHkgZXZhbHVhdGUuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+QWRkIHlvdXIgY2VydGlmaWNhdGUgdG8gTGlua2VkSW4gaW1tZWRpYXRlbHk6PC9zdHJvbmc+IEdvIHRvIExpbmtlZEluIFx1MjE5MiBQcm9maWxlIFx1MjE5MiBBZGQgc2VjdGlvbiBcdTIxOTIgTGljZW5zZXMgJiBDZXJ0aWZpY2F0aW9ucy4gSW5jbHVkZSB0aGUgY291cnNlIG5hbWUsIGlzc3VpbmcgcGxhdGZvcm0gKFNraWxsVmFsaXgpLCBhbmQgY3JlZGVudGlhbCBVUkwuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q29tYmluZSBjb3Vyc2VzIGludG8gYSBza2lsbCBzdGFjazo8L3N0cm9uZz4gSFRNTCArIENTUyArIEphdmFTY3JpcHQgZ2l2ZXMgeW91IGZyb250ZW5kIHNraWxscy4gUHl0aG9uICsgQUkgRnVuZGFtZW50YWxzIGdpdmVzIHlvdSBhIGRhdGEgc2NpZW5jZSBmb3VuZGF0aW9uLiBUaGluayBpbiBzdGFja3MsIG5vdCBpbmRpdmlkdWFsIGNvdXJzZXMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q29tcGxldGUgdGhlIGFzc2Vzc21lbnQvcXVpejo8L3N0cm9uZz4gU2tpbGxWYWxpeCBjZXJ0aWZpY2F0ZXMgcmVxdWlyZSBwYXNzaW5nIGEgcXVpeiBcdTIwMTQgdGhpcyByZWluZm9yY2VzIHRoZSBjb25jZXB0cyBhbmQgcHJvdmVzIGdlbnVpbmUgdW5kZXJzdGFuZGluZyByYXRoZXIgdGhhbiBwYXNzaXZlIHdhdGNoaW5nLjwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDI+V2hhdCBNYWtlcyBhIENlcnRpZmljYXRlIFZhbHVhYmxlIHRvIEVtcGxveWVycz88L2gyPlxuICAgICAgPHA+Tm90IGFsbCBjZXJ0aWZpY2F0ZXMgYXJlIGVxdWFsLiBFbXBsb3llcnMgbG9vayBmb3IgY2VydGlmaWNhdGVzIHRoYXQgaW5kaWNhdGUgcmVhbCBza2lsbCwgbm90IGp1c3QgY291cnNlIGNvbXBsZXRpb24uIFRoZSBmYWN0b3JzIHRoYXQgbWFrZSBhbiBvbmxpbmUgY2VydGlmaWNhdGUgY3JlZGlibGU6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5WZXJpZmlhYmlsaXR5Ojwvc3Ryb25nPiBDYW4gdGhlIGVtcGxveWVyIHZlcmlmeSBpdCBpcyByZWFsPyBTa2lsbFZhbGl4IGNlcnRpZmljYXRlcyBoYXZlIGEgdW5pcXVlIElEIGFuZCB2ZXJpZmljYXRpb24gVVJMLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkFzc2Vzc21lbnQtYmFzZWQ6PC9zdHJvbmc+IENlcnRpZmljYXRlcyBhd2FyZGVkIGFmdGVyIHBhc3NpbmcgYSBxdWl6IG9yIGJ1aWxkaW5nIGEgcHJvamVjdCBjYXJyeSBtb3JlIHdlaWdodCB0aGFuIGNvbXBsZXRpb24tb25seSBjZXJ0aWZpY2F0ZXMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UmVsZXZhbmNlOjwvc3Ryb25nPiBBIEphdmFTY3JpcHQgY2VydGlmaWNhdGUgaXMgdmFsdWFibGUgZm9yIHdlYiBkZXZlbG9wbWVudCByb2xlcy4gQSBQeXRob24gY2VydGlmaWNhdGUgaXMgdmFsdWFibGUgZm9yIGRhdGEgc2NpZW5jZSBhbmQgYXV0b21hdGlvbiByb2xlcy4gTWF0Y2ggY2VydGlmaWNhdGVzIHRvIHRoZSBqb2JzIHlvdSBhcmUgdGFyZ2V0aW5nLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlJlY2VuY3k6PC9zdHJvbmc+IDIwMjVcdTIwMTMyMDI2IGNlcnRpZmljYXRlcyBzaWduYWwgdGhhdCB5b3VyIHNraWxscyBhcmUgY3VycmVudCBcdTIwMTQgZXNwZWNpYWxseSBpbXBvcnRhbnQgaW4gZmFzdC1tb3ZpbmcgZmllbGRzIGxpa2UgQUkgYW5kIHdlYiBkZXZlbG9wbWVudC48L2xpPlxuICAgICAgPC91bD5cblxuICAgICAgPGgyPk90aGVyIEZyZWUgQ2VydGlmaWNhdGlvbiBQbGF0Zm9ybXMgaW4gSW5kaWE8L2gyPlxuICAgICAgPHA+QmV5b25kIFNraWxsVmFsaXgsIHRoZXNlIHBsYXRmb3JtcyBhbHNvIG9mZmVyIGZyZWUgY291cnNlcyBhbmQgY2VydGlmaWNhdGVzOjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+TlBURUwgKElJVC9JSVNjKTo8L3N0cm9uZz4gR292ZXJubWVudC1iYWNrZWQgY291cnNlcyB3aXRoIHByb2N0b3JlZCBleGFtcy4gSGlnaGx5IHJlc3BlY3RlZCBieSBQU1VzIGFuZCBsYXJnZSBJbmRpYW4gY29ycG9yYXRlcy4gU3ViamVjdHM6IGVuZ2luZWVyaW5nLCBDUywgbWFuYWdlbWVudC48L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5Hb29nbGUgRGlnaXRhbCBHYXJhZ2U6PC9zdHJvbmc+IEZyZWUgZGlnaXRhbCBtYXJrZXRpbmcgYW5kIGRhdGEgZnVuZGFtZW50YWxzIGNvdXJzZXMgd2l0aCBHb29nbGUtYnJhbmRlZCBjZXJ0aWZpY2F0ZXMuIEV4Y2VsbGVudCBmb3Igbm9uLXRlY2ggcm9sZXMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+TWljcm9zb2Z0IExlYXJuOjwvc3Ryb25nPiBGcmVlIGNvdXJzZXMgb24gQXp1cmUsIFBvd2VyIEJJLCBhbmQgTWljcm9zb2Z0IHRlY2hub2xvZ2llcyB3aXRoIE1pY3Jvc29mdCBiYWRnZXMuPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+Q291cnNlcmEgKEF1ZGl0IG1vZGUpOjwvc3Ryb25nPiBBY2Nlc3MgY291cnNlIGNvbnRlbnQgZnJlZSBieSBhdWRpdGluZyBcdTIwMTQgY2VydGlmaWNhdGUgcmVxdWlyZXMgcGF5bWVudCwgYnV0IHRoZSBsZWFybmluZyBpcyBmcmVlLjwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPmVkWCAoQXVkaXQgbW9kZSk6PC9zdHJvbmc+IFNpbWlsYXIgdG8gQ291cnNlcmEgXHUyMDE0IGZyZWUgY29udGVudCwgcGFpZCBjZXJ0aWZpY2F0ZS48L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkZvciBwcm9ncmFtbWluZyBhbmQgd2ViIGRldmVsb3BtZW50IHNwZWNpZmljYWxseSwgU2tpbGxWYWxpeCdzIGZyZWUgY291cnNlcyB3aXRoIGNvbXBsZXRlbHkgZnJlZSBjZXJ0aWZpY2F0ZXMgcHJvdmlkZSB0aGUgYmVzdCBjb21iaW5hdGlvbiBvZiBxdWFsaXR5LCByZWxldmFuY2UsIGFuZCB2ZXJpZmlhYmlsaXR5IGZvciB0aGUgSW5kaWFuIGpvYiBtYXJrZXQuPC9wPlxuXG4gICAgICA8aDI+QnVpbGRpbmcgYSBSZXN1bWUgQXJvdW5kIEZyZWUgQ2VydGlmaWNhdGVzPC9oMj5cbiAgICAgIDxwPkhlcmUgaXMgYSBzYW1wbGUgcmVzdW1lIHNraWxscyBzZWN0aW9uIGJ1aWx0IGVudGlyZWx5IGZyb20gZnJlZSBjZXJ0aWZpY2F0ZXM6PC9wPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5Gcm9udGVuZCBEZXZlbG9wbWVudDo8L3N0cm9uZz4gSFRNTDUsIENTUzMgKEZsZXhib3gsIEdyaWQpLCBKYXZhU2NyaXB0IEVTNissIFJlYWN0LmpzIFx1MjAxNCBDZXJ0aWZpZWQgdmlhIFNraWxsVmFsaXg8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5QeXRob24gUHJvZ3JhbW1pbmc6PC9zdHJvbmc+IFZhcmlhYmxlcywgZnVuY3Rpb25zLCBPT1AsIGZpbGUgSS9PIFx1MjAxNCBDZXJ0aWZpZWQgdmlhIFNraWxsVmFsaXg8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5BSSBGdW5kYW1lbnRhbHM6PC9zdHJvbmc+IE1hY2hpbmUgbGVhcm5pbmcgY29uY2VwdHMsIG5ldXJhbCBuZXR3b3JrcywgbW9kZWwgZXZhbHVhdGlvbiBcdTIwMTQgQ2VydGlmaWVkIHZpYSBTa2lsbFZhbGl4PC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD5UaGlzIGRlbW9uc3RyYXRlcyBpbml0aWF0aXZlLCBzZWxmLWRpcmVjdGVkIGxlYXJuaW5nLCBhbmQgY3VycmVudCBza2lsbHMgXHUyMDE0IGFsbCBmcm9tIGZyZWUgcmVzb3VyY2VzLiBQYWlyIHRoZXNlIHdpdGggR2l0SHViIHByb2plY3RzIGFuZCB5b3UgaGF2ZSBhIGdlbnVpbmVseSBjb21wZXRpdGl2ZSBwcm9maWxlLjwvcD5cblxuICAgICAgPGgyPkZyZXF1ZW50bHkgQXNrZWQgUXVlc3Rpb25zPC9oMj5cblxuICAgICAgPHA+PHN0cm9uZz5RMTogQXJlIGZyZWUgb25saW5lIGNlcnRpZmljYXRlcyByZWNvZ25pc2VkIGJ5IGVtcGxveWVycyBpbiBJbmRpYT88L3N0cm9uZz48YnIvPlxuICAgICAgWWVzIFx1MjAxNCBlc3BlY2lhbGx5IGZyb20gZXN0YWJsaXNoZWQgcGxhdGZvcm1zLiBTa2lsbFZhbGl4LCBHb29nbGUsIE1pY3Jvc29mdCwgYW5kIE5QVEVMIGNlcnRpZmljYXRlcyBhcmUgYWxsIHJlY29nbmlzZWQgYnkgSW5kaWFuIGVtcGxveWVycy4gVGhlIGtleSBpcyB0aGF0IHRoZSBjZXJ0aWZpY2F0ZSBzaG91bGQgYmUgdmVyaWZpYWJsZSBvbmxpbmUuIEVtcGxveWVycyBpbiB0ZWNoIHN0YXJ0dXBzIGluIHBhcnRpY3VsYXIgYWN0aXZlbHkgdmFsdWUgc2VsZi1kaXJlY3RlZCBsZWFybmluZyBzaG93biB0aHJvdWdoIG9ubGluZSBjb3Vyc2VzLjwvcD5cblxuICAgICAgPHA+PHN0cm9uZz5RMjogRG8gSSBuZWVkIHRvIHBheSBmb3IgYSBjZXJ0aWZpY2F0ZSBvbiBTa2lsbFZhbGl4Pzwvc3Ryb25nPjxici8+XG4gICAgICBOby4gQWxsIFNraWxsVmFsaXggY291cnNlcyBhbmQgY2VydGlmaWNhdGVzIGFyZSBjb21wbGV0ZWx5IGZyZWUgXHUyMDE0IGluY2x1ZGluZyB0aGUgY2VydGlmaWNhdGUuIFRoZXJlIGFyZSBubyBoaWRkZW4gZmVlcywgbm8gcHJlbWl1bSB0aWVycyBmb3IgY2VydGlmaWNhdGVzLiBZb3UgZW5yb2wsIGNvbXBsZXRlIHRoZSBjb3Vyc2UsIHBhc3MgdGhlIGFzc2Vzc21lbnQsIGFuZCBnZXQgYSB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlIGF0IG5vIGNvc3QuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBXaGljaCBmcmVlIGNlcnRpZmljYXRlIGNvdXJzZSBpcyBiZXN0IGZvciBnZXR0aW5nIGEgam9iIGluIDIwMjY/PC9zdHJvbmc+PGJyLz5cbiAgICAgIEZvciB3ZWIgZGV2ZWxvcG1lbnQgam9iczogc3RhcnQgd2l0aCBIVE1MIFx1MjE5MiBDU1MgXHUyMTkyIEphdmFTY3JpcHQgKGFsbCBmcmVlIG9uIFNraWxsVmFsaXgpLiBGb3IgZGF0YSBzY2llbmNlL0FJIGpvYnM6IHN0YXJ0IHdpdGggUHl0aG9uIFx1MjE5MiBBSSBGdW5kYW1lbnRhbHMuIEZvciBhbnkgdGVjaCBqb2I6IFB5dGhvbiBpcyB0aGUgbW9zdCB1bml2ZXJzYWxseSBhcHBsaWNhYmxlLiBUaGUgYmVzdCBjZXJ0aWZpY2F0ZSBpcyBmcm9tIHdoaWNoZXZlciBjb3Vyc2UgYnVpbGRzIHNraWxscyBkaXJlY3RseSByZWxldmFudCB0byB0aGUgam9icyB5b3UgYXJlIGFwcGx5aW5nIGZvci48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTQ6IEhvdyBsb25nIGRvZXMgaXQgdGFrZSB0byBjb21wbGV0ZSBhIFNraWxsVmFsaXggY291cnNlPzwvc3Ryb25nPjxici8+XG4gICAgICBDb3Vyc2VzIHJhbmdlIGZyb20gNCBob3VycyAoSFRNTCkgdG8gMTQgaG91cnMgKFB5dGhvbikuIEF0IGEgcGFjZSBvZiAxXHUyMDEzMiBob3VycyBwZXIgZGF5LCB5b3UgY2FuIGNvbXBsZXRlIGFueSBjb3Vyc2UgaW4gMVx1MjAxMzIgd2Vla3MuIENvbXBsZXRpbmcgYWxsIGZpdmUgY29yZSBjb3Vyc2VzIChIVE1MLCBDU1MsIEphdmFTY3JpcHQsIFB5dGhvbiwgQUkgRnVuZGFtZW50YWxzKSB0YWtlcyBhcHByb3hpbWF0ZWx5IDZcdTIwMTM4IHdlZWtzIGF0IGEgY29tZm9ydGFibGUgbGVhcm5pbmcgcGFjZS48L3A+XG4gICAgYCxcbiAgICBhdXRob3I6ICdSaXlhIERlc2FpJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wNS0wM1QwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNS0wM1QwOTowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ01heSAzLCAyMDI2JyxcbiAgICByZWFkVGltZTogJzExIG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDEyODAsXG4gICAgY2F0ZWdvcnk6ICdDYXJlZXInLFxuICAgIHRhZ3M6IFsnRnJlZSBDb3Vyc2VzIEluZGlhIDIwMjYnLCAnRnJlZSBDZXJ0aWZpY2F0ZSBDb3Vyc2VzJywgJ09ubGluZSBMZWFybmluZyBJbmRpYScsICdTa2lsbFZhbGl4IENvdXJzZXMnLCAnTGVhcm4gT25saW5lIEZyZWUnLCAnQ29kaW5nIENlcnRpZmljYXRlIEluZGlhJywgJ1Vwc2tpbGwgSW5kaWEnXSxcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDM0MDMwMjE2NDExLTBiNzkzZjRiNDE3Mz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTEyMDAmcT04MCcsXG4gICAgaW1hZ2VBbHQ6ICdTdHVkZW50IHN0dWR5aW5nIG9ubGluZSBvbiBsYXB0b3Agd2l0aCBjb3Vyc2UgY2VydGlmaWNhdGUgb24gc2NyZWVuJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL2ZyZWUtb25saW5lLWNvdXJzZXMtd2l0aC1jZXJ0aWZpY2F0ZS1pbmRpYS0yMDI2JyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1VsdGltYXRlIEphdmFTY3JpcHQgTWFzdGVyY2xhc3MnLFxuICAgICAgc2x1ZzogJ3VsdGltYXRlLWphdmFzY3JpcHQtbWFzdGVyY2xhc3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdTdGFydCB5b3VyIGZyZWUgY2VydGlmaWVkIGxlYXJuaW5nIGpvdXJuZXkgd2l0aCB0aGUgbW9zdCBpbi1kZW1hbmQgc2tpbGwgaW4gdGVjaC4nXG4gICAgfVxuICB9LFxuICB7XG4gICAgaWQ6ICdweXRob24tdnMtamF2YXNjcmlwdC13aGljaC10by1sZWFybi1maXJzdCcsXG4gICAgdGl0bGU6ICdQeXRob24gdnMgSmF2YVNjcmlwdDogV2hpY2ggU2hvdWxkIFlvdSBMZWFybiBGaXJzdCBpbiAyMDI2PycsXG4gICAgbWV0YVRpdGxlOiAnUHl0aG9uIHZzIEphdmFTY3JpcHQ6IFdoaWNoIHRvIExlYXJuIEZpcnN0IGluIDIwMjY/IHwgU2tpbGxWYWxpeCcsXG4gICAgbWV0YURlc2NyaXB0aW9uOiAnUHl0aG9uIG9yIEphdmFTY3JpcHQgXHUyMDE0IHdoaWNoIHByb2dyYW1taW5nIGxhbmd1YWdlIHNob3VsZCB5b3UgbGVhcm4gZmlyc3QgaW4gMjAyNj8gQSBkZXRhaWxlZCwgaG9uZXN0IGNvbXBhcmlzb24gY292ZXJpbmcgam9icywgc2FsYXJ5LCBsZWFybmluZyBjdXJ2ZSwgYW5kIGNhcmVlciBwYXRocyB0byBoZWxwIHlvdSBkZWNpZGUuJyxcbiAgICBrZXl3b3JkczogW1xuICAgICAgJ3B5dGhvbiB2cyBqYXZhc2NyaXB0IHdoaWNoIHRvIGxlYXJuIGZpcnN0JyxcbiAgICAgICdweXRob24gb3IgamF2YXNjcmlwdCBmb3IgYmVnaW5uZXJzJyxcbiAgICAgICdweXRob24gdnMgamF2YXNjcmlwdCAyMDI2JyxcbiAgICAgICdiZXN0IGZpcnN0IHByb2dyYW1taW5nIGxhbmd1YWdlIDIwMjYnLFxuICAgICAgJ3B5dGhvbiB2cyBqYXZhc2NyaXB0IHNhbGFyeSBJbmRpYScsXG4gICAgICAnc2hvdWxkIEkgbGVhcm4gcHl0aG9uIG9yIGphdmFzY3JpcHQnLFxuICAgICAgJ3B5dGhvbiB2cyBqYXZhc2NyaXB0IGZvciBqb2JzJyxcbiAgICAgICdmaXJzdCBwcm9ncmFtbWluZyBsYW5ndWFnZSBiZWdpbm5lcnMgSW5kaWEnLFxuICAgIF0sXG4gICAgZXhjZXJwdDogJ1RoZSBtb3N0IGNvbW1vbiBxdWVzdGlvbiBiZWdpbm5lcnMgYXNrIFx1MjAxNCBzaG91bGQgSSBsZWFybiBQeXRob24gb3IgSmF2YVNjcmlwdCBmaXJzdD8gSGVyZSBpcyBhbiBob25lc3QsIGRldGFpbGVkIGNvbXBhcmlzb24gY292ZXJpbmcgam9icywgc2FsYXJ5LCBsZWFybmluZyBjdXJ2ZSwgYW5kIGNhcmVlciBwYXRocy4nLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxoMj5UaGUgUXVlc3Rpb24gRXZlcnkgQmVnaW5uZXIgQXNrczwvaDI+XG4gICAgICA8cD5QeXRob24gYW5kIEphdmFTY3JpcHQgYXJlIHRoZSB0d28gbW9zdCBiZWdpbm5lci1mcmllbmRseSBhbmQgam9iLXJlbGV2YW50IHByb2dyYW1taW5nIGxhbmd1YWdlcyBpbiAyMDI2LiBCb3RoIGFyZSBleGNlbGxlbnQuIEJvdGggaGF2ZSBtYXNzaXZlIGpvYiBtYXJrZXRzLiBCb3RoIGFyZSBmcmVlIHRvIGxlYXJuLiBUaGUgcHJvYmxlbSBpcyB0aGF0IGJlZ2lubmVycyBzcGVuZCB3ZWVrcyAoc29tZXRpbWVzIG1vbnRocykgcGFyYWx5c2VkIHRyeWluZyB0byBjaG9vc2UgYmV0d2VlbiB0aGVtIFx1MjAxNCBhbmQgZXZlcnkgd2VlayBvZiBpbmRlY2lzaW9uIGlzIGEgd2VlayB5b3UgY291bGQgaGF2ZSBzcGVudCBsZWFybmluZy48L3A+XG4gICAgICA8cD5UaGlzIGFydGljbGUgZ2l2ZXMgeW91IGEgZGVmaW5pdGl2ZSBhbnN3ZXIgYmFzZWQgb24geW91ciBzcGVjaWZpYyBjYXJlZXIgZ29hbHMgXHUyMDE0IHNvIHlvdSBjYW4gZGVjaWRlIHRvZGF5IGFuZCBzdGFydCB0b21vcnJvdy48L3A+XG5cbiAgICAgIDxoMj5UaGUgQ29yZSBEaWZmZXJlbmNlIGluIE9uZSBTZW50ZW5jZTwvaDI+XG4gICAgICA8cD48c3Ryb25nPkphdmFTY3JpcHQgcnVucyBpbiBicm93c2VycyBhbmQgYnVpbGRzIHdlYnNpdGVzLiBQeXRob24gcnVucyBvbiBzZXJ2ZXJzIGFuZCBhbmFseXNlcyBkYXRhLjwvc3Ryb25nPjwvcD5cbiAgICAgIDxwPlRoYXQgaXMgdGhlIG1vc3QgaW1wb3J0YW50IGRpc3RpbmN0aW9uLiBFdmVyeXRoaW5nIGVsc2UgZm9sbG93cyBmcm9tIHRoaXMgZnVuZGFtZW50YWwgZGlmZmVyZW5jZSBpbiB3aGF0IGVhY2ggbGFuZ3VhZ2Ugd2FzIGRlc2lnbmVkIHRvIGRvLjwvcD5cblxuICAgICAgPGgyPkxlYXJuaW5nIEN1cnZlIENvbXBhcmlzb248L2gyPlxuICAgICAgPGgzPlB5dGhvbiBMZWFybmluZyBDdXJ2ZTogVmVyeSBMb3c8L2gzPlxuICAgICAgPHA+UHl0aG9uIHdhcyBleHBsaWNpdGx5IGRlc2lnbmVkIHRvIGJlIHJlYWRhYmxlLiBJdHMgc3ludGF4IGlzIGNsb3NlIHRvIHBsYWluIEVuZ2xpc2ggXHUyMDE0IHdoaWNoIG1lYW5zIHlvdSBzcGVuZCBsZXNzIG1lbnRhbCBlbmVyZ3kgZGVjb2Rpbmcgc3ludGF4IGFuZCBtb3JlIGVuZXJneSB1bmRlcnN0YW5kaW5nIHByb2dyYW1taW5nIGNvbmNlcHRzLjwvcD5cbiAgICAgIDxwcmU+PGNvZGU+IyBQeXRob24gXHUyMDE0IHNpbXBsZSwgcmVhZGFibGVcbm5hbWUgPSBcIkFyanVuXCJcbmlmIG5hbWUgPT0gXCJBcmp1blwiOlxuICAgIHByaW50KGZcIkhlbGxvLCB7bmFtZX0hXCIpXG4jIE91dHB1dDogSGVsbG8sIEFyanVuITwvY29kZT48L3ByZT5cbiAgICAgIDxwPlB5dGhvbiBlbmZvcmNlcyBpbmRlbnRhdGlvbiwgd2hpY2ggZm9yY2VzIGNsZWFuIGNvZGUgaGFiaXRzIGZyb20gZGF5IG9uZS4gRXJyb3IgbWVzc2FnZXMgYXJlIGNsZWFyIGFuZCBkZXNjcmlwdGl2ZS4gVGhlIHN0YW5kYXJkIGxpYnJhcnkgaXMgZW5vcm1vdXMgXHUyMDE0IHRoZXJlIGlzIGEgYnVpbHQtaW4gbW9kdWxlIGZvciBhbG1vc3QgZXZlcnl0aGluZy48L3A+XG5cbiAgICAgIDxoMz5KYXZhU2NyaXB0IExlYXJuaW5nIEN1cnZlOiBNZWRpdW08L2gzPlxuICAgICAgPHA+SmF2YVNjcmlwdCBpcyBiZWdpbm5lci1mcmllbmRseSBidXQgaGFzIG1vcmUgcXVpcmtzIHRoYW4gUHl0aG9uLiBUeXBlIGNvZXJjaW9uLCB0aGUgPGNvZGU+dGhpczwvY29kZT4ga2V5d29yZCwgYXN5bmNocm9ub3VzIHByb2dyYW1taW5nLCBhbmQgdGhlIHByb3RvdHlwZSBjaGFpbiBhcmUgYWxsIGNvbmNlcHRzIHRoYXQgdHJpcCBiZWdpbm5lcnMgdXAuIEhvd2V2ZXIsIEphdmFTY3JpcHQncyBpbW1lZGlhdGUgdmlzdWFsIGZlZWRiYWNrICh5b3UgY2FuIG9wZW4gYSBicm93c2VyIGNvbnNvbGUgYW5kIHJ1biBjb2RlIGluc3RhbnRseSkgaXMgZXh0cmVtZWx5IG1vdGl2YXRpbmcuPC9wPlxuICAgICAgPHByZT48Y29kZT4vLyBKYXZhU2NyaXB0IFx1MjAxNCBzbGlnaHRseSBtb3JlIHN5bnRheCB0byBtYW5hZ2VcbmNvbnN0IG5hbWUgPSBcIkFyanVuXCI7XG5pZiAobmFtZSA9PT0gXCJBcmp1blwiKSB7XG4gIGNvbnNvbGUubG9nKCYjOTY7SGVsbG8sIFxcJHtuYW1lfSEmIzk2Oyk7XG59XG4vLyBPdXRwdXQ6IEhlbGxvLCBBcmp1biE8L2NvZGU+PC9wcmU+XG4gICAgICA8cD48c3Ryb25nPlZlcmRpY3Q6IFB5dGhvbiBoYXMgYSBsb3dlciBsZWFybmluZyBjdXJ2ZSBmb3IgY29tcGxldGUgYmVnaW5uZXJzLjwvc3Ryb25nPjwvcD5cblxuICAgICAgPGgyPkpvYiBNYXJrZXQgQ29tcGFyaXNvbiBpbiBJbmRpYSAoMjAyNik8L2gyPlxuICAgICAgPGgzPkphdmFTY3JpcHQgSm9iczwvaDM+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT5Gcm9udGVuZCBEZXZlbG9wZXIgKFJlYWN0LCBWdWUsIEFuZ3VsYXIpPC9saT5cbiAgICAgICAgPGxpPkZ1bGwtU3RhY2sgRGV2ZWxvcGVyIChSZWFjdCArIE5vZGUuanMpPC9saT5cbiAgICAgICAgPGxpPkJhY2tlbmQgRGV2ZWxvcGVyIChOb2RlLmpzLCBFeHByZXNzKTwvbGk+XG4gICAgICAgIDxsaT5Nb2JpbGUgRGV2ZWxvcGVyIChSZWFjdCBOYXRpdmUpPC9saT5cbiAgICAgICAgPGxpPlNvZnR3YXJlIEVuZ2luZWVyIGF0IHByb2R1Y3Qgc3RhcnR1cHM8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPkphdmFTY3JpcHQgaGFzIHRoZSBoaWdoZXN0IHJhdyBqb2Igdm9sdW1lIG9mIGFueSBsYW5ndWFnZSBpbiBJbmRpYS4gT24gTGlua2VkSW4gSm9icyBhbmQgTmF1a3JpLCBSZWFjdCBkZXZlbG9wZXIgcm9sZXMgYWxvbmUgbnVtYmVyIGluIHRoZSB0aG91c2FuZHMgYXQgYW55IGdpdmVuIHRpbWUuPC9wPlxuXG4gICAgICA8aDM+UHl0aG9uIEpvYnM8L2gzPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+RGF0YSBBbmFseXN0IC8gRGF0YSBTY2llbnRpc3Q8L2xpPlxuICAgICAgICA8bGk+TWFjaGluZSBMZWFybmluZyBFbmdpbmVlcjwvbGk+XG4gICAgICAgIDxsaT5BSSBFbmdpbmVlciAvIE1MT3BzIEVuZ2luZWVyPC9saT5cbiAgICAgICAgPGxpPkJhY2tlbmQgRGV2ZWxvcGVyIChEamFuZ28sIEZhc3RBUEkpPC9saT5cbiAgICAgICAgPGxpPkF1dG9tYXRpb24gLyBEZXZPcHMgRW5naW5lZXI8L2xpPlxuICAgICAgICA8bGk+UmVzZWFyY2ggRW5naW5lZXI8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxwPlB5dGhvbidzIGpvYiBtYXJrZXQgaXMgZ3Jvd2luZyBmYXN0ZXIgdGhhbiBKYXZhU2NyaXB0J3MgaW4gMjAyNiwgZHJpdmVuIGJ5IHRoZSBBSSBib29tLiBEYXRhIHNjaWVuY2UgYW5kIE1MIHJvbGVzIGNvbW1hbmQgaGlnaGVyIHNhbGFyaWVzIGJ1dCBvZnRlbiByZXF1aXJlIGFkZGl0aW9uYWwgc2tpbGxzIChTUUwsIHN0YXRpc3RpY3MsIGRvbWFpbiBrbm93bGVkZ2UpLjwvcD5cbiAgICAgIDxwPjxzdHJvbmc+VmVyZGljdDogSmF2YVNjcmlwdCBoYXMgbW9yZSB0b3RhbCBqb2JzLiBQeXRob24gam9icyBwYXkgbW9yZSBvbiBhdmVyYWdlIGFuZCBhcmUgZ3Jvd2luZyBmYXN0ZXIuPC9zdHJvbmc+PC9wPlxuXG4gICAgICA8aDI+U2FsYXJ5IENvbXBhcmlzb24gaW4gSW5kaWE8L2gyPlxuICAgICAgPHVsPlxuICAgICAgICA8bGk+PHN0cm9uZz5KYXZhU2NyaXB0IGRldmVsb3BlciAoZnJlc2hlcik6PC9zdHJvbmc+IFx1MjBCOTMuNVx1MjAxMzYgTFBBPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UHl0aG9uIGRldmVsb3BlciAoZnJlc2hlcik6PC9zdHJvbmc+IFx1MjBCOTMuNVx1MjAxMzYgTFBBPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+UmVhY3QgZGV2ZWxvcGVyICgyXHUyMDEzMyB5ZWFycyk6PC9zdHJvbmc+IFx1MjBCOThcdTIwMTMxOCBMUEE8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5EYXRhIHNjaWVudGlzdCB3aXRoIFB5dGhvbiAoMlx1MjAxMzMgeWVhcnMpOjwvc3Ryb25nPiBcdTIwQjkxMlx1MjAxMzI1IExQQTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlNlbmlvciBGdWxsLVN0YWNrIChKUywgNSsgeWVhcnMpOjwvc3Ryb25nPiBcdTIwQjkyNVx1MjAxMzQ1IExQQTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPlNlbmlvciBNTCBFbmdpbmVlciAoUHl0aG9uLCA1KyB5ZWFycyk6PC9zdHJvbmc+IFx1MjBCOTMwXHUyMDEzNjAgTFBBPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8cD5BdCB0aGUgZnJlc2hlciBsZXZlbCwgc2FsYXJpZXMgYXJlIHNpbWlsYXIuIFRoZSBkaXZlcmdlbmNlIGhhcHBlbnMgYXQgbWlkIGFuZCBzZW5pb3IgbGV2ZWxzIFx1MjAxNCBQeXRob24gZGF0YSBzY2llbmNlL01MIGNhcmVlcnMgdGVuZCB0byBwYXkgc2lnbmlmaWNhbnRseSBtb3JlIGF0IHRoZSB0b3AgZW5kLjwvcD5cblxuICAgICAgPGgyPldoYXQgQ2FuIFlvdSBCdWlsZD88L2gyPlxuICAgICAgPGgzPldpdGggSmF2YVNjcmlwdCB5b3UgY2FuIGJ1aWxkOjwvaDM+XG4gICAgICA8dWw+XG4gICAgICAgIDxsaT5Bbnkgd2Vic2l0ZSBvciB3ZWIgYXBwbGljYXRpb24gKGZyb250ZW5kKTwvbGk+XG4gICAgICAgIDxsaT5SRVNUIEFQSXMgYW5kIGJhY2tlbmQgc2VydmljZXMgKE5vZGUuanMpPC9saT5cbiAgICAgICAgPGxpPk1vYmlsZSBhcHBzIChSZWFjdCBOYXRpdmUpPC9saT5cbiAgICAgICAgPGxpPkRlc2t0b3AgYXBwcyAoRWxlY3Ryb24pPC9saT5cbiAgICAgICAgPGxpPkJyb3dzZXIgZXh0ZW5zaW9uczwvbGk+XG4gICAgICAgIDxsaT5SZWFsLXRpbWUgYXBwcyAoV2ViU29ja2V0cywgU29ja2V0LmlvKTwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPGgzPldpdGggUHl0aG9uIHlvdSBjYW4gYnVpbGQ6PC9oMz5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPkRhdGEgYW5hbHlzaXMgYW5kIHZpc3VhbGlzYXRpb24gc2NyaXB0czwvbGk+XG4gICAgICAgIDxsaT5NYWNoaW5lIGxlYXJuaW5nIG1vZGVsczwvbGk+XG4gICAgICAgIDxsaT5XZWIgQVBJcyAoRGphbmdvLCBGYXN0QVBJKTwvbGk+XG4gICAgICAgIDxsaT5BdXRvbWF0aW9uIHNjcmlwdHMgKHdlYiBzY3JhcGluZywgZmlsZSBwcm9jZXNzaW5nKTwvbGk+XG4gICAgICAgIDxsaT5BSSBjaGF0Ym90cyBhbmQgTkxQIGFwcGxpY2F0aW9uczwvbGk+XG4gICAgICAgIDxsaT5TY2llbnRpZmljIHNpbXVsYXRpb25zPC9saT5cbiAgICAgIDwvdWw+XG5cbiAgICAgIDxoMj5UaGUgRGVmaW5pdGl2ZSBEZWNpc2lvbiBHdWlkZTwvaDI+XG4gICAgICA8cD5BbnN3ZXIgdGhlc2UgcXVlc3Rpb25zIGhvbmVzdGx5OjwvcD5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+RG8geW91IHdhbnQgdG8gYnVpbGQgd2Vic2l0ZXMgYW5kIGFwcHM/PC9zdHJvbmc+IFx1MjE5MiBKYXZhU2NyaXB0PC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RG8geW91IHdhbnQgdG8gd29yayB3aXRoIGRhdGEsIEFJLCBvciBtYWNoaW5lIGxlYXJuaW5nPzwvc3Ryb25nPiBcdTIxOTIgUHl0aG9uPC9saT5cbiAgICAgICAgPGxpPjxzdHJvbmc+RG8geW91IHdhbnQgdGhlIG1vc3Qgam9iIHBvc3RpbmdzIHRvIGFwcGx5IHRvIGFzIGEgZnJlc2hlcj88L3N0cm9uZz4gXHUyMTkyIEphdmFTY3JpcHQ8L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5EbyB5b3Ugd2FudCB0aGUgaGlnaGVzdCBlYXJuaW5nIHBvdGVudGlhbCBsb25nLXRlcm0/PC9zdHJvbmc+IFx1MjE5MiBQeXRob24gKGRhdGEgc2NpZW5jZS9NTCBwYXRoKTwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkRvIHlvdSB3YW50IHRoZSBlYXNpZXN0IGxlYXJuaW5nIGV4cGVyaWVuY2U/PC9zdHJvbmc+IFx1MjE5MiBQeXRob248L2xpPlxuICAgICAgICA8bGk+PHN0cm9uZz5EbyB5b3Ugd2FudCB0byBzZWUgaW1tZWRpYXRlIHZpc3VhbCByZXN1bHRzIGluIHRoZSBicm93c2VyPzwvc3Ryb25nPiBcdTIxOTIgSmF2YVNjcmlwdDwvbGk+XG4gICAgICAgIDxsaT48c3Ryb25nPkRvIHlvdSBoYXZlIG5vIGNsZWFyIHByZWZlcmVuY2U/PC9zdHJvbmc+IFx1MjE5MiBKYXZhU2NyaXB0IChtb3N0IHZlcnNhdGlsZSwgbW9zdCBqb2JzKTwvbGk+XG4gICAgICA8L3VsPlxuXG4gICAgICA8aDI+VGhlIEFuc3dlciBNb3N0IEV4cGVydHMgR2l2ZTwvaDI+XG4gICAgICA8cD5JZiB5b3UgaGF2ZSBubyBzdHJvbmcgcHJlZmVyZW5jZSBhbmQganVzdCB3YW50IHRvIHN0YXJ0IGNvZGluZyBhbmQgZ2V0IGEgam9iIGFzIGVmZmljaWVudGx5IGFzIHBvc3NpYmxlOiA8c3Ryb25nPnN0YXJ0IHdpdGggSmF2YVNjcmlwdDwvc3Ryb25nPi4gSXQgaGFzIHRoZSBtb3N0IGpvYiBvcHBvcnR1bml0aWVzIGF0IHRoZSBmcmVzaGVyIGxldmVsLCB5b3UgY2FuIHNlZSB5b3VyIGNvZGUgd29ya2luZyBpbiB0aGUgYnJvd3NlciBpbW1lZGlhdGVseSAod2hpY2ggaXMgZXh0cmVtZWx5IG1vdGl2YXRpbmcpLCBhbmQgdGhlIHBhdGggZnJvbSB6ZXJvIHRvIGVtcGxveWVkIGlzIGZhc3RlciBhbmQgbW9yZSBkaXJlY3QgZm9yIG1vc3QgcGVvcGxlLjwvcD5cbiAgICAgIDxwPklmIHlvdSBrbm93IHlvdSB3YW50IHRvIHdvcmsgaW4gQUksIGRhdGEgc2NpZW5jZSwgb3IgcmVzZWFyY2ggXHUyMDE0IG9yIGlmIHlvdSBhcmUgYWxyZWFkeSBjb21mb3J0YWJsZSB3aXRoIGxvZ2ljIGFuZCB3YW50IHRoZSBjbGVhbmVzdCBwb3NzaWJsZSBmaXJzdCBsYW5ndWFnZTogPHN0cm9uZz5zdGFydCB3aXRoIFB5dGhvbjwvc3Ryb25nPi48L3A+XG4gICAgICA8cD5Cb3RoIGFyZSBhdmFpbGFibGUgZm9yIGZyZWUgd2l0aCB2ZXJpZmlhYmxlIGNlcnRpZmljYXRlcyBvbiBTa2lsbFZhbGl4OiA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtamF2YXNjcmlwdC1tYXN0ZXJjbGFzc1wiPkphdmFTY3JpcHQgTWFzdGVyY2xhc3M8L2E+IGFuZCA8YSBocmVmPVwiL2NvdXJzZXMvdWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzXCI+UHl0aG9uIE1hc3RlcmNsYXNzPC9hPi48L3A+XG5cbiAgICAgIDxoMj5GcmVxdWVudGx5IEFza2VkIFF1ZXN0aW9uczwvaDI+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTE6IENhbiBJIGxlYXJuIGJvdGggUHl0aG9uIGFuZCBKYXZhU2NyaXB0IGF0IHRoZSBzYW1lIHRpbWU/PC9zdHJvbmc+PGJyLz5cbiAgICAgIE5vdCByZWNvbW1lbmRlZCBmb3IgYmVnaW5uZXJzLiBMZWFybmluZyB0d28gbGFuZ3VhZ2VzIHNpbXVsdGFuZW91c2x5IGRvdWJsZXMgeW91ciBjb25mdXNpb24gYW5kIGhhbHZlcyB5b3VyIHByb2dyZXNzIGluIGVhY2guIE1hc3RlciBvbmUgdG8gYSBwcm9kdWN0aXZlIGxldmVsICh3aGVyZSB5b3UgY2FuIGJ1aWxkIHJlYWwgdGhpbmdzKSBiZWZvcmUgc3RhcnRpbmcgdGhlIHNlY29uZC4gVGhlIHNlY29uZCBsYW5ndWFnZSBhbHdheXMgY29tZXMgZmFzdGVyIGJlY2F1c2UgeW91IGFscmVhZHkgdW5kZXJzdGFuZCBwcm9ncmFtbWluZyBjb25jZXB0cy48L3A+XG5cbiAgICAgIDxwPjxzdHJvbmc+UTI6IElzIFB5dGhvbiBlYXNpZXIgdGhhbiBKYXZhU2NyaXB0IGZvciBjb21wbGV0ZSBiZWdpbm5lcnM/PC9zdHJvbmc+PGJyLz5cbiAgICAgIFllcywgbWFyZ2luYWxseS4gUHl0aG9uJ3Mgc3ludGF4IGlzIGNsZWFuZXIsIGl0cyBlcnJvciBtZXNzYWdlcyBhcmUgY2xlYXJlciwgYW5kIGl0IGhhcyBmZXdlciBcImdvdGNoYVwiIGJlaGF2aW91cnMgdGhhbiBKYXZhU2NyaXB0LiBCdXQgdGhlIGRpZmZlcmVuY2UgaXMgbm90IGRyYW1hdGljIFx1MjAxNCBib3RoIGFyZSBiZWdpbm5lci1mcmllbmRseS4gSmF2YVNjcmlwdCBoYXMgdGhlIGFkdmFudGFnZSBvZiBpbW1lZGlhdGUgYnJvd3NlciBmZWVkYmFjaywgd2hpY2ggc29tZSBiZWdpbm5lcnMgZmluZCBtb3JlIG1vdGl2YXRpbmcgdGhhbiBQeXRob24ncyB0ZXJtaW5hbCBvdXRwdXQuPC9wPlxuXG4gICAgICA8cD48c3Ryb25nPlEzOiBJZiBJIGxlYXJuIEphdmFTY3JpcHQsIGRvIEkgc3RpbGwgbmVlZCB0byBsZWFybiBQeXRob24gbGF0ZXI/PC9zdHJvbmc+PGJyLz5cbiAgICAgIE5vdCBuZWNlc3NhcmlseS4gTWFueSBzdWNjZXNzZnVsIGRldmVsb3BlcnMgdXNlIEphdmFTY3JpcHQgZXhjbHVzaXZlbHkgZm9yIHRoZWlyIGVudGlyZSBjYXJlZXJzLiBIb3dldmVyLCBpZiB5b3Ugd2FudCB0byBhZGQgZGF0YSBzY2llbmNlLCBtYWNoaW5lIGxlYXJuaW5nLCBvciBBSSB0byB5b3VyIHNraWxsIHNldCBsYXRlciwgeW91IHdpbGwgbmVlZCB0byBsZWFybiBQeXRob24uIFRoZSBnb29kIG5ld3M6IG9uY2UgeW91IGtub3cgSmF2YVNjcmlwdCB3ZWxsLCBwaWNraW5nIHVwIFB5dGhvbiB0YWtlcyAyXHUyMDEzMyB3ZWVrcy48L3A+XG4gICAgYCxcbiAgICBhdXRob3I6ICdBbWl0IFBhdGVsJyxcbiAgICBhdXRob3JVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nJyxcbiAgICBwdWJsaXNoZWREYXRlOiAnMjAyNi0wNS0wNFQwOTowMDowMCswNTozMCcsXG4gICAgbW9kaWZpZWREYXRlOiAnMjAyNi0wNS0wNFQwOTowMDowMCswNTozMCcsXG4gICAgZGF0ZTogJ01heSA0LCAyMDI2JyxcbiAgICByZWFkVGltZTogJzEyIG1pbiByZWFkJyxcbiAgICB3b3JkQ291bnQ6IDEzMjAsXG4gICAgY2F0ZWdvcnk6ICdDYXJlZXInLFxuICAgIHRhZ3M6IFsnUHl0aG9uIHZzIEphdmFTY3JpcHQnLCAnQmVzdCBGaXJzdCBQcm9ncmFtbWluZyBMYW5ndWFnZScsICdMZWFybiBQeXRob24nLCAnTGVhcm4gSmF2YVNjcmlwdCcsICdDb2RpbmcgZm9yIEJlZ2lubmVycyBJbmRpYScsICdQcm9ncmFtbWluZyBDYXJlZXIgMjAyNiddLFxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjE3NDkyODA2ODQtZGNjYmE2MzBlMmY2P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTIwMCZxPTgwJyxcbiAgICBpbWFnZUFsdDogJ1B5dGhvbiBhbmQgSmF2YVNjcmlwdCBjb2RlIHNpZGUgYnkgc2lkZSBvbiBhIG1vbml0b3Igc2hvd2luZyBjb21wYXJpc29uJyxcbiAgICBjYW5vbmljYWxVcmw6ICdodHRwczovL3d3dy5za2lsbHZhbGl4LmNvbS9ibG9nL3B5dGhvbi12cy1qYXZhc2NyaXB0LXdoaWNoLXRvLWxlYXJuLWZpcnN0JyxcbiAgICByZWxhdGVkQ291cnNlOiB7XG4gICAgICB0aXRsZTogJ1VsdGltYXRlIFB5dGhvbiBNYXN0ZXJjbGFzcycsXG4gICAgICBzbHVnOiAndWx0aW1hdGUtcHl0aG9uLW1hc3RlcmNsYXNzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3RhcnQgeW91ciBQeXRob24gam91cm5leSB0b2RheSBcdTIwMTQgZnJlZSBjb3Vyc2Ugd2l0aCBhIHZlcmlmaWFibGUgY2VydGlmaWNhdGUuJ1xuICAgIH1cbiAgfVxuXTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsb0JBQW9CO0FBQ2pSLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjs7O0FDQWpCLElBQU0sWUFBWTtBQUFBLEVBQ3ZCO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxpQkFDRTtBQUFBLElBQ0YsVUFBVTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FDRTtBQUFBLElBQ0YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBdUpULFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxJQUNmLGNBQWM7QUFBQSxJQUNkLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLE1BQU0sQ0FBQyxTQUFTLE9BQU8saUJBQWlCLG1CQUFtQixpQkFBaUIsa0JBQWtCLGFBQWE7QUFBQSxJQUMzRyxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixjQUFjO0FBQUEsSUFDZCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixhQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxpQkFDRTtBQUFBLElBQ0YsVUFBVTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FDRTtBQUFBLElBQ0YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FB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QixhQUFhO0FBQUEsSUFDeEgsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sYUFBYTtBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsaUJBQ0U7QUFBQSxJQUNGLFVBQVU7QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FDRTtBQUFBLElBQ0YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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QUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FB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
