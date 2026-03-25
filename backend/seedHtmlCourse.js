import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

const htmlCourseData = {
  title: "HTML Fundamentals: The Complete Guide",
  slug: "html-fundamentals-guide",
  description: "Master the building blocks of the web. This comprehensive W3Schools-style course covers everything from basic syntax to advanced semantic HTML5, forms, and multimedia integration.",
  published: true
};

const htmlLessonsData = [
  {
    title: "1. Introduction to HTML",
    content: `
      <h2>What is HTML?</h2>
      <p>HTML stands for Hyper Text Markup Language. It is the standard markup language for creating Web pages. HTML describes the structure of a Web page and consists of a series of elements.</p>
      
      <h3>The Basic HTML Document structure</h3>
      <pre><code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

  &lt;h1&gt;My First Heading&lt;/h1&gt;
  &lt;p&gt;My first paragraph.&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
      </code></pre>
      
      <h3>HTML Elements</h3>
      <p>An HTML element is defined by a start tag, some content, and an end tag: <code>&lt;tagname&gt;Content goes here...&lt;/tagname&gt;</code></p>
    `,
    order: 1
  },
  {
    title: "2. HTML Attributes and Formatting",
    content: `
      <h2>HTML Attributes</h2>
      <p>Attributes provide additional information about HTML elements. All HTML elements can have attributes. They are always specified in the start tag and usually come in name/value pairs like: <code>name="value"</code>.</p>
      
      <h3>The href Attribute</h3>
      <p>The <code>&lt;a&gt;</code> tag defines a hyperlink. The <code>href</code> attribute specifies the URL of the page the link goes to:</p>
      <pre><code>&lt;a href="https://www.w3schools.com"&gt;Visit W3Schools&lt;/a&gt;</code></pre>

      <h3>The src Attribute</h3>
      <p>The <code>&lt;img&gt;</code> tag is used to embed an image. The <code>src</code> attribute specifies the path to the image:</p>
       <pre><code>&lt;img src="img_girl.jpg" alt="Girl with a jacket"&gt;</code></pre>
       
       <h3>HTML Text Formatting</h3>
       <ul>
        <li><code>&lt;b&gt;</code> - Bold text</li>
        <li><code>&lt;strong&gt;</code> - Important text</li>
        <li><code>&lt;i&gt;</code> - Italic text</li>
        <li><code>&lt;em&gt;</code> - Emphasized text</li>
        <li><code>&lt;mark&gt;</code> - Marked text</li>
       </ul>
    `,
    order: 2
  },
  {
    title: "3. HTML Lists and Tables",
    content: `
      <h2>HTML Lists</h2>
      <p>HTML offers web developers three ways for specifying lists of information. All lists must contain one or more list elements.</p>
      
      <h3>Unordered HTML List</h3>
      <p>An unordered list starts with the <code>&lt;ul&gt;</code> tag. Each list item starts with the <code>&lt;li&gt;</code> tag.</p>
      <pre><code>
&lt;ul&gt;
  &lt;li&gt;Coffee&lt;/li&gt;
  &lt;li&gt;Tea&lt;/li&gt;
  &lt;li&gt;Milk&lt;/li&gt;
&lt;/ul&gt;
      </code></pre>
      
      <h3>HTML Tables</h3>
      <p>A table in HTML consists of table cells inside rows and columns. Use the <code>&lt;table&gt;</code> tag.</p>
      <pre><code>
&lt;table&gt;
  &lt;tr&gt;
    &lt;th&gt;Company&lt;/th&gt;
    &lt;th&gt;Contact&lt;/th&gt;
    &lt;th&gt;Country&lt;/th&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;Alfreds Futterkiste&lt;/td&gt;
    &lt;td&gt;Maria Anders&lt;/td&gt;
    &lt;td&gt;Germany&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
      </code></pre>
    `,
    order: 3
  },
  {
    title: "4. HTML Forms and Inputs",
    content: `
      <h2>HTML Forms</h2>
      <p>An HTML form is used to collect user input. The user input is most often sent to a server for processing. Use the <code>&lt;form&gt;</code> element to create an HTML form.</p>
      
      <h3>The &lt;input&gt; Element</h3>
      <p>The <code>&lt;input&gt;</code> element is the most used form element. It can be displayed in many ways, depending on the <strong>type</strong> attribute.</p>
      
      <pre><code>
&lt;form action="/action_page.php"&gt;
  &lt;label for="fname"&gt;First name:&lt;/label&gt;&lt;br&gt;
  &lt;input type="text" id="fname" name="fname" value="John"&gt;&lt;br&gt;
  
  &lt;label for="lname"&gt;Last name:&lt;/label&gt;&lt;br&gt;
  &lt;input type="text" id="lname" name="lname" value="Doe"&gt;&lt;br&gt;&lt;br&gt;
  
  &lt;input type="submit" value="Submit"&gt;
&lt;/form&gt;
      </code></pre>
      
      <h3>Input Types</h3>
      <p>Common input types include: <code>text</code>, <code>password</code>, <code>radio</code>, <code>checkbox</code>, <code>submit</code>, <code>button</code>, <code>date</code>, and <code>email</code>.</p>
    `,
    order: 4
  },
  {
    title: "5. Semantic HTML5",
    content: `
      <h2>Semantic Elements</h2>
      <p>A semantic element clearly describes its meaning to both the browser and the developer. Examples of non-semantic elements: <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code>. Examples of semantic elements: <code>&lt;form&gt;</code>, <code>&lt;table&gt;</code>, and <code>&lt;article&gt;</code>.</p>
      
      <h3>New Semantic Elements in HTML5</h3>
      <ul>
        <li><code>&lt;header&gt;</code>: Defines a header for a document or a section</li>
        <li><code>&lt;nav&gt;</code>: Defines a set of navigation links</li>
        <li><code>&lt;section&gt;</code>: Defines a section in a document</li>
        <li><code>&lt;article&gt;</code>: Defines an independent, self-contained content</li>
        <li><code>&lt;aside&gt;</code>: Defines content aside from the page content (like a sidebar)</li>
        <li><code>&lt;footer&gt;</code>: Defines a footer for a document or a section</li>
        <li><code>&lt;main&gt;</code>: Specifies the main content of a document</li>
      </ul>
      
      <p>Using semantic tags helps screen readers parse your site and improves SEO (Search Engine Optimization) significantly.</p>
    `,
    order: 5
  }
];

const htmlQuizData = {
  passingScore: 80,
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
      questionText: "Choose the correct HTML element for the largest heading:",
      options: [
        "<heading>",
        "<h6>",
        "<h1>",
        "<head>"
      ],
      correctOptionIndex: 2
    },
    {
      questionText: "What is the correct HTML element for inserting a line break?",
      options: [
        "<break>",
        "<br>",
        "<lb>",
        "<hr>"
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "Which character is used to indicate an end tag?",
      options: [
        "<",
        "/",
        "^",
        "*"
      ],
      correctOptionIndex: 1
    },
    {
      questionText: "Which HTML element is used to specify a footer for a document or section?",
      options: [
        "<bottom>",
        "<footer>",
        "<section>",
        "<aside>"
      ],
      correctOptionIndex: 1
    }
  ]
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

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
    console.log(`Created Final Quiz for Course: ${course.title}`);

    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
