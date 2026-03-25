import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

const htmlCourseData = {
  title: "HTML Developer Certification",
  slug: "html-developer-certification",
  description: "The ultimate, comprehensive HTML course. From absolute basics to complex forms, semantic architectures, and embedded multimedia. Completing this rigorous course and passing the 15-question final exam earns you an official Certification.",
  published: true
};

const htmlLessonsData = [
  {
    title: "1. Introduction to the Web & HTML",
    content: `
      <h2>The Foundation of the Web</h2>
      <p>HTML (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content. Other technologies besides HTML are generally used to describe a web page's appearance/presentation (CSS) or functionality/behavior (JavaScript).</p>
      
      <h3>Anatomy of an HTML Element</h3>
      <p>An HTML element is set off from other text in a document by "tags", which consist of the element name surrounded by "&lt;" and "&gt;". The name of an element inside a tag is case insensitive.</p>
      <pre><code>
&lt;!-- Start Tag --&gt;    &lt;!-- Content --&gt;    &lt;!-- End Tag --&gt;
&lt;p&gt;                   My paragraph text.   &lt;/p&gt;
      </code></pre>

      <h3>The Standard Boilerplate</h3>
      <p>Every standard HTML5 document requires a specific skeleton to be valid and render correctly across all browsers:</p>
      <pre><code>
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;My Webpage&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Hello, World!&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;
      </code></pre>
      
      <div class="p-4 bg-blue-50 border-l-4 border-blue-600 rounded mt-6">
        <strong>Key Takeaway:</strong> The <code>&lt;head&gt;</code> contains metadata (data about data) and is not rendered in the main viewport. The <code>&lt;body&gt;</code> contains everything the user actually sees.
      </div>
    `,
    order: 1
  },
  {
    title: "2. Text Formatting & Hyperlinks",
    content: `
      <h2>Working with Text</h2>
      <p>HTML provides a deep set of tools for expressing the precise meaning of your text. While CSS dictates <em>how</em> it looks, HTML dictates <em>what</em> it means.</p>
      
      <h3>Headings</h3>
      <p>Headings are defined with the <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> tags. <code>&lt;h1&gt;</code> defines the most important heading. You should generally only have one H1 per page, representing the main topic.</p>
      <pre><code>
&lt;h1&gt;Main Article Title&lt;/h1&gt;
&lt;h2&gt;Sub-section&lt;/h2&gt;
&lt;h3&gt;Minor grouping&lt;/h3&gt;
      </code></pre>

      <h3>Inline Formatting</h3>
      <ul>
        <li><code>&lt;strong&gt;</code>: Indicates that its contents have strong importance, seriousness, or urgency. Browsers typically render the contents in bold type.</li>
        <li><code>&lt;em&gt;</code>: Marks text that has stress emphasis. Browsers typically render it in italics.</li>
        <li><code>&lt;mark&gt;</code>: Represents text which is marked or highlighted for reference purposes.</li>
        <li><code>&lt;sup&gt;</code> & <code>&lt;sub&gt;</code>: Superscript and Subscript.</li>
      </ul>

      <h3>The Anchor Tag (Hyperlinks)</h3>
      <p>The Web is built on links. The <code>&lt;a&gt;</code> element (or anchor element), with its <code>href</code> attribute, creates a hyperlink to web pages, files, email addresses, locations in the same page, or anything else a URL can address.</p>
      <pre><code>
&lt;!-- Linking to another website --&gt;
&lt;a href="https://mozilla.org" target="_blank" rel="noopener noreferrer"&gt;Mozilla Foundation&lt;/a&gt;

&lt;!-- Linking to an email --&gt;
&lt;a href="mailto:nowhere@mozilla.org"&gt;Send email to nowhere&lt;/a&gt;
      </code></pre>
    `,
    order: 2
  },
  {
    title: "3. Multimedia: Images, Audio, and Video",
    content: `
      <h2>Bringing Pages to Life</h2>
      <p>The web isn't just text. HTML handles rich media beautifully, but it requires specific attributes to ensure accessibility and performance.</p>
      
      <h3>Images</h3>
      <p>The <code>&lt;img&gt;</code> tag is empty, meaning it contains attributes only, and does not have a closing tag. The <strong>src</strong> attribute specifies the URL of the image, and the <strong>alt</strong> attribute provides alternate text for screen readers or if the image fails to load.</p>
      <pre><code>
&lt;img src="sunset.jpg" alt="A beautiful orange sunset over the ocean" loading="lazy" width="800" height="600" /&gt;
      </code></pre>
      <p><em>Note: Always include width and height to prevent cumulative layout shift (CLS), a key web performance metric.</em></p>

      <h3>Video Elements</h3>
      <p>The <code>&lt;video&gt;</code> element is used to embed video clips. You can provide multiple sources using the <code>&lt;source&gt;</code> tag so the browser can pick the format it supports.</p>
      <pre><code>
&lt;video width="320" height="240" controls autoplay muted&gt;
  &lt;source src="movie.mp4" type="video/mp4"&gt;
  &lt;source src="movie.ogg" type="video/ogg"&gt;
  Your browser does not support the video tag.
&lt;/video&gt;
      </code></pre>
      <p>The <code>controls</code> attribute is critical as it provides the user with play, pause, and volume controls.</p>
    `,
    order: 3
  },
  {
    title: "4. Powerful Lists and Tabular Data",
    content: `
      <h2>Structuring Data</h2>
      
      <h3>Lists</h3>
      <p>We use Unordered Lists (<code>&lt;ul&gt;</code>) for collections of items where order doesn't matter, and Ordered Lists (<code>&lt;ol&gt;</code>) when sequence is critical (like a recipe).</p>
      <pre><code>
&lt;!-- Ordered List --&gt;
&lt;ol&gt;
  &lt;li&gt;Cut the tomatoes&lt;/li&gt;
  &lt;li&gt;Boil the pasta&lt;/li&gt;
  &lt;li&gt;Mix the sauce&lt;/li&gt;
&lt;/ol&gt;
      </code></pre>

      <h3>Data Tables</h3>
      <p>HTML tables allow web developers to arrange data into rows and columns. They should <strong>never</strong> be used for page layout, only for presenting tabular data.</p>
      
      <p>A comprehensive table structure uses <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, and <code>&lt;tfoot&gt;</code> to logically group rows.</p>
      
      <pre><code>
&lt;table border="1"&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th scope="col"&gt;Item&lt;/th&gt;
      &lt;th scope="col"&gt;Price&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;Bananas&lt;/td&gt;
      &lt;td&gt;$2.00&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;td&gt;Apples&lt;/td&gt;
      &lt;td&gt;$3.50&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
  &lt;tfoot&gt;
    &lt;tr&gt;
      &lt;th scope="row"&gt;Total&lt;/th&gt;
      &lt;td&gt;$5.50&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tfoot&gt;
&lt;/table&gt;
      </code></pre>
    `,
    order: 4
  },
  {
    title: "5. Form Architecture & Input Mastery",
    content: `
      <h2>Interacting with the User</h2>
      <p>Forms are the primary method for gathering data from users on the web. A <code>&lt;form&gt;</code> element acts as a container for various inputs.</p>

      <h3>The Label Element</h3>
      <p>The <code>&lt;label&gt;</code> tag defines a label for many form elements. It's incredibly important for accessibility. The <code>for</code> attribute of the label must be equal to the <code>id</code> attribute of the related element to bind them together. Clicking on the label will also focus the input!</p>

      <pre><code>
&lt;form action="/submit-data" method="POST"&gt;
  
  &lt;div&gt;
    &lt;label for="username"&gt;Username:&lt;/label&gt;
    &lt;input type="text" id="username" name="username" required minlength="3"&gt;
  &lt;/div&gt;

  &lt;div&gt;
    &lt;label for="userpwd"&gt;Password:&lt;/label&gt;
    &lt;input type="password" id="userpwd" name="userpwd" required&gt;
  &lt;/div&gt;

  &lt;div&gt;
    &lt;label for="category"&gt;Topic:&lt;/label&gt;
    &lt;select id="category" name="category"&gt;
      &lt;option value="html"&gt;HTML&lt;/option&gt;
      &lt;option value="css"&gt;CSS&lt;/option&gt;
    &lt;/select&gt;
  &lt;/div&gt;

  &lt;button type="submit"&gt;Create Account&lt;/button&gt;
  
&lt;/form&gt;
      </code></pre>
      
      <h3>Modern Input Types</h3>
      <p>HTML5 introduced many new input types that provide built-in browser validation and specialized mobile keyboards:</p>
      <ul>
        <li><code>type="email"</code>: Validates that the string has an @ symbol.</li>
        <li><code>type="date"</code>: Opens a native calendar picker.</li>
        <li><code>type="number"</code>: Restricts input to numerals and opens a numeric keypad on phones.</li>
      </ul>
    `,
    order: 5
  },
  {
    title: "6. Semantic HTML5 Deep Dive",
    content: `
      <h2>Designing for Meaning</h2>
      <p>A semantic element clearly describes its meaning to both the browser and the developer. Prior to HTML5, developers primarily used <code>&lt;div id="nav"&gt;</code> or <code>&lt;div class="header"&gt;</code>. Now, we use standardized elements.</p>
      
      <h3>The Core Layout Elements</h3>
      <ul>
        <li><code>&lt;header&gt;</code>: Represents introductory content, typically a group of introductory or navigational aids.</li>
        <li><code>&lt;nav&gt;</code>: Represents a section of a page whose purpose is to provide navigation links.</li>
        <li><code>&lt;main&gt;</code>: Represents the dominant content of the body. There should only be one visible main element per document.</li>
        <li><code>&lt;article&gt;</code>: Represents a self-contained composition (like a forum post, a magazine or newspaper article, or a blog entry).</li>
        <li><code>&lt;section&gt;</code>: Represents a standalone section — which doesn't have a more specific semantic element to represent it — contained within an HTML document. Usually has a heading.</li>
        <li><code>&lt;aside&gt;</code>: Represents a portion of a document whose content is only indirectly related to the document's main content (like a sidebar).</li>
        <li><code>&lt;footer&gt;</code>: Represents a footer for its nearest ancestor sectioning content or sectioning root element.</li>
      </ul>

      <p>Why do we use semantic elements?</p>
      <ol>
        <li><strong>Accessibility:</strong> Screen readers analyze semantic tags to formulate an outline for blind users to navigate the page rapidly.</li>
        <li><strong>SEO:</strong> Search engines weigh content inside an <code>&lt;article&gt;</code> or <code>&lt;main&gt;</code> tag heavier than content buried in endless nested <code>&lt;div&gt;</code> tags.</li>
        <li><strong>Maintainability:</strong> It is much easier for a developer to read semantic tags than deciphering a "div soup".</li>
      </ol>
    `,
    order: 6
  }
];

const htmlQuizData = {
  passingScore: 80, // Needs 12/15 correct
  questions: [
    {
      questionText: "What does HTML stand for?",
      options: [
        "Hyperlinks and Text Markup Language",
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyper Tool Multi Language"
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "Which HTML structure represents the exact entry point and standard boilerplate of an HTML5 document?",
      options: [
        "<html><head></head><body></body></html>",
        "<!DOCTYPE html><html><head></head><body></body></html>",
        "<xml><head></head><body></body></xml>",
        "<!DOCTYPE HTML PUBLIC>"
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "Which HTML tag is used to define an internal stylesheet or include internal CSS?",
      options: [
        "<css>",
        "<script>",
        "<style>",
        "<link>"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "Choose the correct HTML element to define important text, which is typically rendered as bold.",
      options: [
        "<b>",
        "<i>",
        "<strong>",
        "<important>"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "Which attribute is used to provide alternate text for an image, vital for accessibility?",
      options: [
        "title",
        "description",
        "alt",
        "src"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "How do you create a hyperlink that opens in a new tab or browser window?",
      options: [
        "<a href='url' target='_blank'>",
        "<a href='url' target='new'>",
        "<a href='url' new>",
        "<a href='url' window='_blank'>"
      ],
      correctOptionIndex: 0
    },
    {
      questionText: "In an HTML form, which attribute binds a <label> to its corresponding <input> field?",
      options: [
        "name",
        "id",
        "for",
        "class"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "Which input type restricts user entry solely to numerical values and often prompts a numeric keypad on mobile?",
      options: [
        "tel",
        "number",
        "digit",
        "numeric"
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "Which tag is used to define an individual item within an ordered or unordered list?",
      options: [
        "<item>",
        "<list>",
        "<li>",
        "<ul>"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "What is the correct semantic element for grouping the navigational links of a website?",
      options: [
        "<menu>",
        "<nav>",
        "<navigation>",
        "<header>"
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "In a data table, which element should be used to define a header cell?",
      options: [
        "<tr>",
        "<td>",
        "<th>",
        "<thead-cell>"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "Which HTML5 video attribute ensures the user can play, pause, and adjust volume?",
      options: [
        "autoplay",
        "media",
        "ui",
        "controls"
      ],
      correctOptionIndex: 3
    },
    {
      questionText: "Which HTML element represents self-contained content that could be distributed independently (like a blog post)?",
      options: [
        "<section>",
        "<main>",
        "<article>",
        "<div>"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "The 'loading=\"lazy\"' attribute on an image tag does what?",
      options: [
        "Blurs the image until hovered.",
        "Defers rendering the image until it is near the visible viewport.",
        "Compresses the image file size automatically.",
        "Prevents the image from being cached."
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "Why shouldn't you use tables for web page layout?",
      options: [
        "They are difficult for screen readers to interpret as layout rather than data.",
        "They break CSS grid.",
        "They are no longer supported by HTML5.",
        "They take longer to compile on the server."
      ],
      correctOptionIndex: 0
    }
  ]
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Expanded HTML Course seeding...');

    // Clean previous course if it exists to prevent duplicates on rerun
    await Course.deleteMany({ slug: htmlCourseData.slug });

    // 1. Create Course
    const course = new Course(htmlCourseData);
    await course.save();
    console.log(`Created Course: ${course.title}`);

    // 2. Create Lessons
    for (const lessonData of htmlLessonsData) {
      const lesson = new Lesson({ ...lessonData, course: course._id });
      await lesson.save();
      console.log(`  Created Lesson: ${lesson.title}`);
    }

    // 3. Create Quiz
    const quiz = new Quiz({ ...htmlQuizData, course: course._id });
    await quiz.save();
    console.log(`Created Expanded 15-Question Final Quiz for Course: ${course.title}`);

    console.log('--- EXTENDED SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
