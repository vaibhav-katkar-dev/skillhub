import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

const unifiedCourseData = {
  title: "The Ultimate HTML Masterclass for Beginners",
  slug: "ultimate-html-masterclass",
  description: "A definitive, beginner-friendly course covering everything from absolute web basics to advanced HTML5 semantics, embedded multimedia, and complex form structures. Highly detailed, interactive, and beautifully designed. Includes a massive 25-question final exam to truly test your mastery.",
  published: true
};

const getInfoBox = (title, text, type = 'info') => {
  const colors = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    success: 'bg-emerald-50 border-emerald-500 text-emerald-800',
    warning: 'bg-orange-50 border-orange-500 text-orange-800',
    tip: 'bg-purple-50 border-purple-500 text-purple-800'
  };
  const icon = type === 'tip' ? '💡' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
  return `
    <div class="border-l-4 ${colors[type]} p-5 my-6 rounded-r-xl shadow-sm">
      <h4 class="font-bold m-0 flex items-center gap-2 text-lg">${icon} ${title}</h4>
      <p class="m-0 mt-2 opacity-90 leading-relaxed">${text}</p>
    </div>
  `;
};

const getExampleBox = (code, title = "Example code:") => {
  return `
    <div class="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div class="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
        ${title}
      </div>
      <pre class="!m-0 !rounded-none !bg-slate-900 !p-6"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
  `;
};

const unifiedLessonsData = [
  {
    title: "1. Welcome to Web Development! 🚀",
    content: `
      <h2>Hello, Future Developer!</h2>
      <p class="text-xl text-slate-600 leading-relaxed">Welcome to the exciting world of web development. By the end of this course, you will know exactly how to build the structure of any website on the internet.</p>
      
      <h3>The Three Pillars of the Web</h3>
      <p>Every website you visit is built using three core languages. Think of building a house:</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div class="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <div class="text-4xl mb-4">🧱</div>
          <h4 class="text-orange-900 font-bold m-0 mb-2">HTML</h4>
          <p class="text-orange-800 text-sm m-0">The brick and mortar. It gives the website its structure (text, images, links).</p>
        </div>
        <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div class="text-4xl mb-4">🎨</div>
          <h4 class="text-blue-900 font-bold m-0 mb-2">CSS</h4>
          <p class="text-blue-800 text-sm m-0">The paint and interior design. It makes the website look beautiful (colors, fonts, layouts).</p>
        </div>
        <div class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
          <div class="text-4xl mb-4">⚡</div>
          <h4 class="text-yellow-900 font-bold m-0 mb-2">JavaScript</h4>
          <p class="text-yellow-800 text-sm m-0">The electricity and plumbing. It makes the website interactive (popups, animations, logic).</p>
        </div>
      </div>

      ${getInfoBox("What you will learn", "In this specific masterclass, we are focusing 100% on HTML. This is the foundation that you absolutely must master before moving on to CSS or JavaScript.", "success")}
    `,
    order: 1
  },
  {
    title: "2. Your Very First HTML File 📄",
    content: `
      <h2>Let's Get Started!</h2>
      <p>HTML stands for <strong>HyperText Markup Language</strong>. It is not a programming language; it is a <em>markup</em> language. This means we use "tags" to mark up our text so the browser knows what to do with it.</p>
      
      <h3>What is an HTML Tag?</h3>
      <p>Tags are hidden keywords within a web page that define how your web browser must format and display the content. Most tags have an opening part and a closing part.</p>
      
      ${getExampleBox('<p>This is a paragraph!</p>', "Anatomy of a tag")}
      
      <ul class="space-y-2 mb-6">
        <li><code>&lt;p&gt;</code> is the <strong>opening tag</strong>.</li>
        <li><code>This is a paragraph!</code> is the <strong>content</strong>.</li>
        <li><code>&lt;/p&gt;</code> is the <strong>closing tag</strong> (notice the forward slash <code>/</code>).</li>
      </ul>

      <h3>The HTML Skeleton</h3>
      <p>Every HTML document in the world needs a basic structure to work properly. Copy this code whenever you start a new website:</p>
      
      ${getExampleBox(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Website</title>
</head>
<body>
  <h1>Welcome to my website!</h1>
  <p>I am learning to code!</p>
</body>
</html>`, "The HTML5 Boilerplate")}

      ${getInfoBox("The <head> vs The <body>", "The <strong>&lt;head&gt;</strong> contains secret information for the browser (like the title shown in the browser tab). The <strong>&lt;body&gt;</strong> contains everything you actually <em>see</em> on the screen!", "tip")}
    `,
    order: 2
  },
  {
    title: "3. Headings and Paragraphs 📝",
    content: `
      <h2>Structuring Your Text</h2>
      <p>When you write an essay, you use titles, subtitles, and paragraphs. Web pages work the exact same way!</p>
      
      <h3>HTML Headings</h3>
      <p>HTML provides 6 levels of headings, from <code>&lt;h1&gt;</code> (most important) to <code>&lt;h6&gt;</code> (least important).</p>
      
      ${getExampleBox(`<h1>This is Heading 1 (Biggest)</h1>
<h2>This is Heading 2</h2>
<h3>This is Heading 3</h3>
<h4>This is Heading 4</h4>
<h5>This is Heading 5</h5>
<h6>This is Heading 6 (Smallest)</h6>`, "Heading Tags")}

      ${getInfoBox("SEO Best Practice", "Search engines like Google use your headings to understand what your website is about. You should generally only use <strong>one <code>&lt;h1&gt;</code> per page</strong> for the main title!", "tip")}

      <h3>Paragraphs</h3>
      <p>To write normal text, we wrap it in the <code>&lt;p&gt;</code> (paragraph) tag.</p>
      
      ${getExampleBox(`<p>This is my first paragraph. It usually contains sentences explaining a concept.</p>
<p>This is my second paragraph. Browsers will automatically add a little bit of spacing between paragraphs so they don't squish together.</p>`)}
    `,
    order: 3
  },
  {
    title: "4. Formatting Text like a Pro ✨",
    content: `
      <h2>Making Words Stand Out</h2>
      <p>Sometimes you need to emphasize a specific word in a sentence. HTML provides special tags just for this!</p>
      
      <table class="w-full text-left border-collapse my-6">
        <thead>
          <tr class="bg-slate-100">
            <th class="p-3 border border-slate-200 rounded-tl-lg">Tag</th>
            <th class="p-3 border border-slate-200">Result</th>
            <th class="p-3 border border-slate-200 rounded-tr-lg">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-3 border border-slate-200 font-mono text-blue-600 bg-blue-50/50">&lt;strong&gt;</td>
            <td class="p-3 border border-slate-200"><strong>Bold Text</strong></td>
            <td class="p-3 border border-slate-200">Indicates strong importance.</td>
          </tr>
          <tr>
            <td class="p-3 border border-slate-200 font-mono text-blue-600 bg-blue-50/50">&lt;em&gt;</td>
            <td class="p-3 border border-slate-200"><em>Italic Text</em></td>
            <td class="p-3 border border-slate-200">Indicates emphasized text.</td>
          </tr>
          <tr>
            <td class="p-3 border border-slate-200 font-mono text-blue-600 bg-blue-50/50">&lt;mark&gt;</td>
            <td class="p-3 border border-slate-200"><mark>Highlighted</mark></td>
            <td class="p-3 border border-slate-200">Highly visible marked text.</td>
          </tr>
        </tbody>
      </table>

      <h3>Putting It Together</h3>
      ${getExampleBox('<p>Please do <strong>NOT</strong> press the <mark>red</mark> button unless it is an <em>emergency</em>!</p>')}

      <h3>Line Breaks (The &lt;br&gt; Tag)</h3>
      <p>Normally, HTML ignores extra spaces and enters (line breaks) in your code. If you want a hard line break without starting a new paragraph, use <code>&lt;br&gt;</code>. It is a "void" element, meaning it does not need a closing tag!</p>
      
      ${getExampleBox(`<p>Roses are red,<br>
Violets are blue,<br>
HTML is awesome,<br>
And so are you!</p>`)}
    `,
    order: 4
  },
  {
    title: "5. Links: Connecting the Web 🔗",
    content: `
      <h2>The "Hyper" in HyperText</h2>
      <p>Links are what make the web a "web". They connect pages to other pages. To create a link, we use the <strong>Anchor</strong> tag: <code>&lt;a&gt;</code>.</p>
      
      <h3>The href Attribute</h3>
      <p>Tags can have "attributes" which provide extra information. The anchor tag requires the <code>href</code> attribute, which tells the browser <em>where</em> the link should go.</p>
      
      ${getExampleBox(`<a href="https://www.google.com">Click here to visit Google</a>`)}
      
      ${getInfoBox("Anatomy of the link", "The text between the opening and closing tag is what the user clicks on. The URL inside the `href` is where the browser secretly takes them.", "info")}

      <h3>Opening in a New Tab</h3>
      <p>If you are linking to an external website, it's polite to open it in a new tab so they don't lose your page! We do this with the <code>target="_blank"</code> attribute.</p>
      
      ${getExampleBox(`<a href="https://wikipedia.org" target="_blank">Read Wikipedia in a new tab</a>`)}

      <h3>Linking to Emails</h3>
      <p>You can even make a link that opens the user's email client to send you an email!</p>
      ${getExampleBox(`<a href="mailto:support@hello.com">Email our support team!</a>`)}
    `,
    order: 5
  },
  {
    title: "6. Adding Images 🖼️",
    content: `
      <h2>A Picture is Worth a Thousand Words</h2>
      <p>To add an image to your site, use the <code>&lt;img&gt;</code> tag. Like the <code>&lt;br&gt;</code> tag, the image tag is empty—it doesn't have a closing tag.</p>
      
      <h3>Essential Attributes</h3>
      <p>The image tag requires two attributes to work properly and safely:</p>
      <ol class="space-y-2 mb-6 ml-6 list-decimal">
        <li><strong>src</strong> (Source): The URL or file path of the image.</li>
        <li><strong>alt</strong> (Alternative Text): Text that describes the image. This is crucial for blind users using screen readers, and is shown if the image fails to load.</li>
      </ol>

      ${getExampleBox(`<img src="https://example.com/cute-puppy.jpg" alt="A fluffy golden retriever puppy sleeping">`)}

      <h3>Sizing Your Images</h3>
      <p>You can use the <code>width</code> and <code>height</code> attributes to set the size of the image in pixels. This stops the website from jumping around while the image loads.</p>
      
      ${getExampleBox(`<img src="logo.png" alt="Company Logo" width="200" height="100">`)}

      ${getInfoBox("Pro Tip", "While you can set width and height in HTML, most modern developers prefer to set the image sizes using CSS later, to make them responsive for mobile phones!", "tip")}
    `,
    order: 6
  },
  {
    title: "7. Making Lists 📋",
    content: `
      <h2>Organizing Information</h2>
      <p>HTML offers two main types of lists: Unordered (bullet points) and Ordered (numbers).</p>
      
      <h3>Unordered Lists (Bulleted)</h3>
      <p>Use the <code>&lt;ul&gt;</code> tag for the list itself, and the <code>&lt;li&gt;</code> (list item) tag for each item inside.</p>
      
      ${getExampleBox(`<h3>Grocery List</h3>
<ul>
  <li>Milk</li>
  <li>Bread</li>
  <li>Eggs</li>
</ul>`)}

      <h3>Ordered Lists (Numbered)</h3>
      <p>If the order matters (like a recipe or instructions), use the <code>&lt;ol&gt;</code> tag.</p>
      
      ${getExampleBox(`<h3>How to make tea</h3>
<ol>
  <li>Boil water</li>
  <li>Put tea bag in cup</li>
  <li>Pour water</li>
  <li>Wait 3 minutes</li>
</ol>`)}

      ${getInfoBox("Nesting Lists", "You can totally put a list INSIDE another list! Just place a new <code>&lt;ul&gt;</code> inside one of the <code>&lt;li&gt;</code> elements.", "success")}
    `,
    order: 7
  },
  {
    title: "8. HTML Tables 📊",
    content: `
      <h2>Rows and Columns</h2>
      <p>Tables are used to display data in a grid format (like an Excel spreadsheet). They have a very specific structure of tags.</p>
      
      <ul class="space-y-2 mb-6">
        <li><code>&lt;table&gt;</code>: Wraps the entire table</li>
        <li><code>&lt;tr&gt;</code>: Table Row</li>
        <li><code>&lt;th&gt;</code>: Table Heading (makes text bold and centered)</li>
        <li><code>&lt;td&gt;</code>: Table Data (a normal cell)</li>
      </ul>

      <h3>A Basic Table Example</h3>
      ${getExampleBox(`<table border="1">
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>
  <tr>
    <td>Alice</td>
    <td>25</td>
    <td>New York</td>
  </tr>
  <tr>
    <td>Bob</td>
    <td>30</td>
    <td>London</td>
  </tr>
</table>`, "Standard Table Structure")}

      ${getInfoBox("Historical Warning", "In the 1990s, developers used tables to build the layout of their entire website! Today, this is considered terrible practice. <strong>Only use tables for tabular data</strong> (like schedules, pricing, or statistics), never for design layouts.", "warning")}
    `,
    order: 8
  },
  {
    title: "9. Building Forms 📝",
    content: `
      <h2>Interacting with Users</h2>
      <p>Forms are how websites collect data from you—like logging in, signing up, or sending an email. The container for this is the <code>&lt;form&gt;</code> tag.</p>
      
      <h3>Inputs and Labels</h3>
      <p>The <code>&lt;input&gt;</code> tag is the most versatile element. By changing its <code>type</code> attribute, it transforms entirely!</p>
      <p>Always use a <code>&lt;label&gt;</code> to tell the user what the input is for. You link them using <code>for</code> and <code>id</code>.</p>
      
      ${getExampleBox(`<form>
  <!-- Text Input -->
  <label for="username">Username:</label>
  <input type="text" id="username" name="username">
  <br><br>
  
  <!-- Password Input -->
  <label for="password">Password:</label>
  <input type="password" id="password" name="password">
  <br><br>
  
  <button type="submit">Log In</button>
</form>`)}

      <h3>Awesome Input Types in HTML5</h3>
      <p>Modern HTML gives us inputs that do the hard work for us, even popping up custom mobile keyboards!</p>
      <ul class="list-disc ml-6 space-y-2">
        <li><code>type="email"</code>: Checks if there is an @ symbol.</li>
        <li><code>type="date"</code>: Pops up a beautiful calendar picker!</li>
        <li><code>type="number"</code>: Only allows numbers and shows up/down arrows.</li>
        <li><code>type="color"</code>: Pops up a color picker palette!</li>
      </ul>

      ${getExampleBox(`<label for="birthday">Pick your birthday:</label>
<input type="date" id="birthday" name="birthday">`)}
    `,
    order: 9
  },
  {
    title: "10. Checkboxes, Radios & Selects ☑️",
    content: `
      <h2>Giving Users Choices</h2>
      <p>Sometimes a text input isn't right. You want the user to pick from specific options.</p>

      <h3>Radio Buttons (Pick Only ONE)</h3>
      <p>Use radio buttons when the user must make exactly one choice. <strong>Crucial:</strong> All radio buttons in a group must have the EXACT SAME <code>name</code> attribute!</p>
      
      ${getExampleBox(`<p>Choose your course level:</p>
<input type="radio" id="beginner" name="level" value="beginner">
<label for="beginner">Beginner</label><br>

<input type="radio" id="expert" name="level" value="expert">
<label for="expert">Expert</label>`)}

      <h3>Checkboxes (Pick Multiple)</h3>
      <p>Use checkboxes when the user can select zero, one, or many options.</p>
      
      ${getExampleBox(`<input type="checkbox" id="pizza" name="food" value="pizza">
<label for="pizza">I like Pizza</label><br>

<input type="checkbox" id="pasta" name="food" value="pasta">
<label for="pasta">I like Pasta</label>`)}

      <h3>Dropdown Menus (Select)</h3>
      <p>If you have a massive list of options (like all the countries in the world), a dropdown menu saves space on the screen.</p>
      
      ${getExampleBox(`<label for="cars">Choose a car:</label>
<select id="cars" name="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>`)}
    `,
    order: 10
  },
  {
    title: "11. Audio, Video, and Iframes 🎬",
    content: `
      <h2>The Multimedia Web</h2>
      <p>HTML5 brought incredible native support for playing music and videos right in the browser, without needing clunky plugins like Flash!</p>
      
      <h3>Embedding Video</h3>
      <p>The <code>&lt;video&gt;</code> element is easy to use. Ensure you add the <code>controls</code> attribute so the user has a play/pause button and a volume slider!</p>
      
      ${getExampleBox(`<video width="400" controls>
  <source src="my-vacation.mp4" type="video/mp4">
  Whoops, your browser doesn't support HTML5 video!
</video>`)}

      <h3>Embedding Audio</h3>
      <p>The <code>&lt;audio&gt;</code> tag works exactly the same way.</p>
      
      ${getExampleBox(`<audio controls>
  <source src="podcast-episode.mp3" type="audio/mpeg">
</audio>`)}

      <h3>iFrames (Embedding other websites!)</h3>
      <p>An <code>&lt;iframe&gt;</code> lets you literally cut a window into your website to show another website inside of it. This is how YouTube videos, Google Maps, and Spotify players are added to sites.</p>
      
      ${getExampleBox(`<iframe 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  width="560" 
  height="315" 
  allowfullscreen>
</iframe>`, "Embedding a YouTube Video")}

      ${getInfoBox("Fun Fact", "Iframes stand for 'Inline Frames'. They are super powerful for bringing complex content to your site instantly.", "info")}
    `,
    order: 11
  },
  {
    title: "12. HTML5 Semantic Tags & Layouts 🏗️",
    content: `
      <h2>Writing Code with Meaning</h2>
      <p>In older websites, developers would wrap everything in a generic <code>&lt;div&gt;</code> tag. It was chaotic. HTML5 introduced "Semantic" tags—tags whose names literally describe what they do.</p>
      
      <div class="space-y-4 my-6">
        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex gap-4 items-center shadow-sm">
          <div class="bg-indigo-600 text-white font-mono px-3 py-1 rounded-md text-sm">&lt;header&gt;</div>
          <p class="m-0 text-slate-700">The top section of the page, usually containing the logo and main title.</p>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex gap-4 items-center shadow-sm">
          <div class="bg-indigo-600 text-white font-mono px-3 py-1 rounded-md text-sm">&lt;nav&gt;</div>
          <p class="m-0 text-slate-700">A block of major navigation links (your main menu).</p>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex gap-4 items-center shadow-sm">
          <div class="bg-indigo-600 text-white font-mono px-3 py-1 rounded-md text-sm">&lt;main&gt;</div>
          <p class="m-0 text-slate-700">The dominant, unique content of the body. You should only have one per page.</p>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex gap-4 items-center shadow-sm">
          <div class="bg-indigo-600 text-white font-mono px-3 py-1 rounded-md text-sm">&lt;article&gt;</div>
          <p class="m-0 text-slate-700">A self-contained piece of content, like a news story or a blog post.</p>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex gap-4 items-center shadow-sm">
          <div class="bg-indigo-600 text-white font-mono px-3 py-1 rounded-md text-sm">&lt;footer&gt;</div>
          <p class="m-0 text-slate-700">The bottom of the page, containing copyright info, terms of service, etc.</p>
        </div>
      </div>

      <h3>Why do we use these?</h3>
      <ol class="space-y-2 mb-6 ml-6 list-decimal text-slate-700">
        <li><strong>Accessibility:</strong> Screen readers use these specific tags to help blind users instantly jump to the navigation or the main content.</li>
        <li><strong>SEO (Search Ranking):</strong> Google prefers a well-structured semantic page over a chaotic page made only of <code>&lt;div&gt;</code>s.</li>
        <li><strong>Developer Readability:</strong> It is monumentally easier for you and your team to read code when it describes itself.</li>
      </ol>
      
      ${getInfoBox("Congratulations!", "You have completed the Ultimate HTML Masterclass! It is time to prove your knowledge in the massive Final Exam. If you pass, you will earn your verified downloadable certificate!", "success")}
    `,
    order: 12
  }
];

const unifiedQuizData = {
  passingScore: 60, // Needs 15/25 correct to pass
  questions: [
    { questionText: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyper Tool Multi Language"], correctOptionIndex: 1 },
    { questionText: "Which HTML structure is the correct boilerplate start?", options: ["<html><head></head>", "<!DOCTYPE html><html>", "<xml><html>", "<!DOCTYPE HTML PUBLIC>"], correctOptionIndex: 1 },
    { questionText: "Which part of the HTML document contains everything that the user actually sees on their screen?", options: ["<head>", "<title>", "<body>", "<meta>"], correctOptionIndex: 2 },
    { questionText: "What is the correct HTML element for the absolute largest, most important heading on a page?", options: ["<heading>", "<h6>", "<h1>", "<head>"], correctOptionIndex: 2 },
    { questionText: "What is the correct HTML element for inserting a single line break?", options: ["<break>", "<br>", "<line>", "<hr>"], correctOptionIndex: 1 },
    { questionText: "To indicate strong importance, typically rendered in bold, you should use:", options: ["<i>", "<important>", "<strong>", "<b>"], correctOptionIndex: 2 },
    { questionText: "How can you make a hyperlink open in a brand new browser tab?", options: ["<a href='url' target='_blank'>", "<a href='url' target='new'>", "<a href='url' new>", "<a href='url' window='_blank'>"], correctOptionIndex: 0 },
    { questionText: "Which attribute is REQUIRED on an <img> tag to provide alternate text for screen readers?", options: ["title", "description", "alt", "src"], correctOptionIndex: 2 },
    { questionText: "What is the purpose of the <head> element?", options: ["To display the main title on the page", "To contain metadata and scripts hidden from the viewport", "To act as the top navigation bar", "To wrap the <h1> tag"], correctOptionIndex: 1 },
    { questionText: "How do you create an ordered, numbered list?", options: ["<ul>", "<dl>", "<ol>", "<list>"], correctOptionIndex: 2 },
    { questionText: "How do you create an unordered, bulleted list?", options: ["<ul>", "<dl>", "<ol>", "<list>"], correctOptionIndex: 0 },
    { questionText: "In a table, what tag is used to create a new Row?", options: ["<td>", "<th>", "<table>", "<tr>"], correctOptionIndex: 3 },
    { questionText: "Why is it considered extremely bad practice to use Tables for page layout?", options: ["It breaks screen readers and accessibility tools", "It breaks CSS grids", "It is not supported in HTML5", "Tables cost money to use"], correctOptionIndex: 0 },
    { questionText: "Which attribute is used to logically bind a <label> directly to an <input> field?", options: ["name", "id", "for", "class"], correctOptionIndex: 2 },
    { questionText: "If you want a user to pick EXACTLY ONE option from a list, which input type should you use?", options: ["checkbox", "radio", "text", "dropdown"], correctOptionIndex: 1 },
    { questionText: "If you want a user to pick MULTIPLE options from a list, which input type should you use?", options: ["checkbox", "radio", "multiple", "select"], correctOptionIndex: 0 },
    { questionText: "Which HTML5 input type automatically restricts entry to numerical values and shows a specialized keypad on mobile?", options: ["tel", "number", "digit", "numeric"], correctOptionIndex: 1 },
    { questionText: "Which HTML5 input type pops up a beautifully native calendar for the user to select from?", options: ["time", "calendar", "date", "datetime"], correctOptionIndex: 2 },
    { questionText: "Which tag do we use to wrap an entire block of options into a dropdown menu?", options: ["<input type='dropdown'>", "<list>", "<select>", "<options>"], correctOptionIndex: 2 },
    { questionText: "How do you embed another website entirely (like a YouTube video) into your webpage?", options: ["<embed>", "<window>", "<iframe>", "<portal>"], correctOptionIndex: 2 },
    { questionText: "What attribute is placed on a <video> tag to give the user play, pause, and volume buttons?", options: ["autoplay", "media", "ui", "controls"], correctOptionIndex: 3 },
    { questionText: "Which HTML5 semantic element represents self-contained content, like a newspaper article or blog post?", options: ["<section>", "<main>", "<article>", "<div>"], correctOptionIndex: 2 },
    { questionText: "Which HTML5 element is specifically designed for groupings of navigation links?", options: ["<menu>", "<nav>", "<navigation>", "<header>"], correctOptionIndex: 1 },
    { questionText: "Which HTML element represents the primary, unique content of the document body?", options: ["<body>", "<content>", "<main>", "<section>"], correctOptionIndex: 2 },
    { questionText: "What is an HTML attribute?", options: ["A tool for drawing borders", "Extra information provided inside the opening tag (like href or src)", "A closing tag", "A type of CSS style"], correctOptionIndex: 1 }
  ]
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for MEGA UNIFIED HTML Course seeding...');

    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared old fragmented data.');

    const course = new Course(unifiedCourseData);
    await course.save();
    console.log(`Created Course: ${course.title}`);

    for (const lessonData of unifiedLessonsData) {
      const lesson = new Lesson({ ...lessonData, course: course._id });
      await lesson.save();
      console.log(`  Created Lesson: ${lesson.title}`);
    }

    const quiz = new Quiz({ ...unifiedQuizData, course: course._id });
    await quiz.save();
    console.log(`Created EXPANDED ${unifiedQuizData.questions.length}-Question Final Quiz for Course: ${course.title}`);

    console.log('--- MEGA UNIFIED SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
