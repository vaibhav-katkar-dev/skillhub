export const blogPosts = [
  {
    id: 'mastering-html5-semantic-tags-seo',
    title: 'Mastering HTML5 in 2026: Why Semantic Tags Matter for SEO',
    excerpt: 'Semantic HTML5 tags like <article>, <section>, and <nav> are no longer optional. Learn how using them correctly boosts both your search engine rankings and web accessibility.',
    content: `
      <h2>The Shift to Meaningful Markup</h2>
      <p>For years, developers relied heavily on <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> tags to structure their web pages. While this approach worked for styling purposes, it provided zero context to search engines and screen readers.</p>
      <p>Enter HTML5 semantic tags. By replacing generic containers with meaningful tags, you are creating a map of your content's importance.</p>
      
      <h3>Key Semantic Tags You Must Use</h3>
      <ul>
        <li><strong>&lt;header&gt; &amp; &lt;footer&gt;:</strong> Clearly defines the top and bottom of your page or section.</li>
        <li><strong>&lt;nav&gt;:</strong> Tells search engines exactly where your primary navigation links are located.</li>
        <li><strong>&lt;main&gt;:</strong> The most critical tag—it identifies the central topic of the document.</li>
        <li><strong>&lt;article&gt;:</strong> Used for independent, self-contained content (like a blog post!).</li>
      </ul>

      <h3>How Semantic Tags Boost SEO</h3>
      <p>Google's algorithms are incredibly sophisticated, but they still rely on HTML structure to understand context. When a search engine sees an <code>&lt;article&gt;</code> tag with an <code>&lt;h1&gt;</code> inside, it immediately knows that is the primary content. This clarity helps your pages rank higher for relevant keywords.</p>
      <p>If you build sites entirely out of divs, search engines have to guess what your content is about. Stop making them guess.</p>
    `,
    author: 'Vaibhav Katkar',
    date: 'March 15, 2026',
    readTime: '6 min read',
    category: 'SEO & HTML',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200',
    relatedCourse: {
      title: 'The Ultimate HTML Masterclass for Beginners',
      slug: 'ultimate-html-masterclass',
      description: 'Master semantic HTML5, multimedia, and form validations.'
    }
  },
  {
    id: 'css-grid-vs-flexbox-modern-web',
    title: 'CSS Grid vs Flexbox: The Ultimate Guide for Modern Web Design',
    excerpt: 'Confused about when to use CSS Grid and when to use Flexbox? We break down the differences and explain how to combine them for pixel-perfect, responsive layouts.',
    content: `
      <h2>The Two Kings of Layout</h2>
      <p>Before Flexbox and Grid, CSS layout was a nightmare of floats, clearfixes, and table-based hacks. Today, CSS gives us two incredibly powerful layout modules. But a common question persists: which one should I use?</p>
      
      <h3>Flexbox: One-Dimensional Powerhouse</h3>
      <p>Flexbox (Flexible Box Layout) was designed for one-dimensional layouts—meaning it handles elements in a single row OR a single column. It excels at distributing space and aligning items within a container.</p>
      <p><strong>Best used for:</strong> Navigation bars, aligning icons with text, equal-height cards in a row, and centering elements perfectly.</p>

      <h3>CSS Grid: Two-Dimensional Control</h3>
      <p>CSS Grid is the ultimate tool for two-dimensional layouts. It allows you to define both rows and columns simultaneously, creating complex, magazine-style layouts with ease.</p>
      <p><strong>Best used for:</strong> Overall page skeletons, complex photo galleries, and overlapping elements.</p>

      <h3>The Perfect Harmony</h3>
      <p>The secret that senior developers know is that it is not Grid <em>versus</em> Flexbox—it is Grid <em>and</em> Flexbox. Use Grid for the macro-layout (the page structure) and Flexbox for the micro-layout (aligning items inside the grid cells).</p>
    `,
    author: 'Neha Sharma',
    date: 'March 12, 2026',
    readTime: '8 min read',
    category: 'CSS & Design',
    imageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1200',
    relatedCourse: {
      title: 'CSS for Beginners: Learn Web Styling from Zero to Pro',
      slug: 'css-for-beginners-learn-web-styling-zero-to-pro',
      description: 'Learn Flexbox, Grid, animations and responsive design.'
    }
  },
  {
    id: 'javascript-dom-manipulation-secrets',
    title: 'JavaScript DOM Manipulation Secrets that Pro Developers Use',
    excerpt: 'Stop relying on older, slower techniques. Discover the modern, performant ways to select, traverse, and modify the Document Object Model using vanilla JavaScript.',
    content: `
      <h2>The DOM is Your Playground</h2>
      <p>The Document Object Model (DOM) is the bridge between your HTML and your JavaScript. While frameworks like React and Vue abstract the DOM away, understanding how to manipulate it directly is a foundational skill every developer needs.</p>
      
      <h3>Selecting Elements Like a Pro</h3>
      <p>Forget <code>getElementById</code> and <code>getElementsByClassName</code>. Modern developers use <code>querySelector</code> and <code>querySelectorAll</code>. These methods allow you to use complex CSS selectors to target exactly what you need.</p>
      <pre><code>// Selects the first active button inside the nav
const activeBtn = document.querySelector('nav button.active');</code></pre>

      <h3>Efficient DOM Updates</h3>
      <p>Directly modifying the DOM is computationally expensive. If you need to add multiple elements, do not append them one by one in a loop. Instead, use a <code>DocumentFragment</code>.</p>
      <p>A DocumentFragment is a lightweight, in-memory DOM representation. You append everything to the fragment, and then append the fragment to the live DOM exactly once. This drastically reduces reflows and repaints, boosting your app's performance.</p>

      <h3>Event Delegation</h3>
      <p>Instead of attaching 100 event listeners to a list of 100 items, attach a single listener to the parent <code>&lt;ul&gt;</code> and use <code>event.target</code> to figure out which item was clicked. This saves memory and automatically handles dynamically added items.</p>
    `,
    author: 'Amit Patel',
    date: 'March 08, 2026',
    readTime: '7 min read',
    category: 'JavaScript',
    imageUrl: 'https://images.unsplash.com/photo-1627398240449-01153124411e?auto=format&fit=crop&q=80&w=1200',
    relatedCourse: {
      title: 'JavaScript Basics',
      slug: 'ultimate-javascript-masterclass',
      description: 'Master Vanilla JS, DOM, functions, and async code.'
    }
  }
];
