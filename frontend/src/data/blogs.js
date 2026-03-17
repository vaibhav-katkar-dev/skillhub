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
    imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80',
    relatedCourse: {
      title: 'JavaScript Basics',
      slug: 'ultimate-javascript-masterclass',
      description: 'Master Vanilla JS, DOM, functions, and async code.'
    }
  },
  {
    id: 'python-beginner-mistakes-to-avoid',
    title: '10 Python Mistakes Every Beginner Makes (And How to Fix Them)',
    excerpt: 'Writing Python code is easy — writing it correctly is another story. Avoid these common beginner pitfalls and instantly level up your Python skills with clean, professional habits.',
    content: `
      <h2>Python Looks Easy — Until It Isn't</h2>
      <p>Python is famous for its beginner-friendly syntax. But that simplicity can be deceiving. Many beginners pick up bad habits early that cause hard-to-debug bugs later. Let's fix them right now.</p>

      <h3>1. Using == to Compare Instead of is</h3>
      <p>Beginners often use <code>==</code> to check if a variable is <code>None</code>, <code>True</code>, or <code>False</code>. The correct and Pythonic way is to use <code>is</code> for identity checks.</p>
      <pre><code># ❌ Wrong
if result == None:
    print("No result")

# ✅ Correct
if result is None:
    print("No result")</code></pre>

      <h3>2. Mutable Default Arguments in Functions</h3>
      <p>This is one of Python's most notorious traps. Never use a mutable object like a list or dictionary as a default parameter value. It is created once and shared across all calls to the function.</p>
      <pre><code># ❌ Wrong — the same list persists across calls!
def add_item(item, cart=[]):
    cart.append(item)
    return cart

# ✅ Correct — use None as default, create inside
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart</code></pre>

      <h3>3. Not Using List Comprehensions</h3>
      <p>A traditional loop to build a list is verbose and slow. Python's list comprehensions are not just shorter — they are also faster under the hood because they are optimised at the interpreter level.</p>
      <pre><code># ❌ Verbose way
squares = []
for i in range(1, 11):
    squares.append(i ** 2)

# ✅ Pythonic way — list comprehension
squares = [i ** 2 for i in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]</code></pre>

      <h3>4. Catching Bare Exceptions</h3>
      <p>Writing <code>except:</code> with no exception type silently swallows every error — including keyboard interrupts and system exits. Always specify which exception you expect.</p>
      <pre><code># ❌ Wrong — catches literally everything
try:
    result = 10 / 0
except:
    print("Something went wrong")

# ✅ Correct — specific and informative
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Math error: {e}")</code></pre>

      <h3>5. Opening Files Without a Context Manager</h3>
      <p>Forgetting to close a file leads to memory leaks and data corruption. Always use <code>with open()</code> — it guarantees the file is closed automatically, even if an error occurs inside the block.</p>
      <pre><code># ❌ Wrong — what if an error occurs before file.close()?
file = open("data.txt", "r")
content = file.read()
file.close()

# ✅ Correct — auto-closes no matter what
with open("data.txt", "r") as file:
    content = file.read()</code></pre>

      <h3>Bonus: Use enumerate() Instead of range(len())</h3>
      <p>When you need both the index and the value while looping over a list, avoid the clunky <code>range(len(...))</code> pattern. Python's built-in <code>enumerate()</code> is cleaner and more readable.</p>
      <pre><code># ❌ Ugly way
fruits = ["Apple", "Banana", "Mango"]
for i in range(len(fruits)):
    print(i, fruits[i])

# ✅ Pythonic way
for i, fruit in enumerate(fruits):
    print(i, fruit)</code></pre>

      <h2>Write Python the Way Python Was Meant to Be Written</h2>
      <p>These fixes are not just cosmetic. They improve performance, prevent bugs, and make your code far easier for other developers (and your future self) to read and maintain. The Python community calls this writing <strong>Pythonic</strong> code — clean, expressive, and idiomatic.</p>
    `,
    author: 'Riya Desai',
    date: 'March 17, 2026',
    readTime: '8 min read',
    category: 'Python',
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    relatedCourse: {
      title: 'Python Basics',
      slug: 'ultimate-python-masterclass',
      description: 'Master Python from scratch — variables, loops, functions, OOP and more.'
    }
  }
];
