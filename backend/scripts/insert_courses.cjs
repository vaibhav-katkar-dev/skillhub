const fs = require('fs');
const path = 'H:/SkillHub/frontend/public/data/all-courses.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const instructorId = data[0].course.instructor; // Borrow instructor from first course

// Create C Course
const cCourseId = 'c0c0c0c0c0c0c0c0c0c0c0c0';
const cCourse = {
  course: {
    _id: cCourseId,
    title: 'Ultimate C Programming: Hardware to High Performance',
    slug: 'ultimate-c-programming',
    description: 'Master the mother of all modern programming languages. Learn memory management, pointers, and low-level systems programming that powers embedded devices, operating systems, and high-performance engines.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    theme: 'slate',
    instructor: instructorId,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  },
  lessons: [
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c001',
      course: cCourseId,
      title: '1. Hello, C! The Mother of Languages',
      content: '<h2>Why Learn C?</h2><p>C is fast, direct, and powers practically the entire digital world. Windows, Linux, Python, and Git were all built in C!</p><h3>Your First C Program</h3><pre><code>#include &lt;stdio.h&gt;\n\nint main() {\n  printf("Hello, Hardware!\\n");\n  return 0;\n}</code></pre><p>Unlike modern languages, you must <strong>compile</strong> C code into machine code before the processor can run it.</p>',
      videoUrl: '', order: 1, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c002',
      course: cCourseId,
      title: '2. Pointers: Memory at Your Fingertips',
      content: '<h2>The True Power of C</h2><p>A pointer is simply a variable that stores the memory address of another variable.</p><pre><code>int age = 22;\nint *pAge = &amp;age; // pAge holds the memory address of age</code></pre><p>They give you raw, unfiltered access to hardware memory. With great power comes great segmentation faults!</p>',
      videoUrl: '', order: 2, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c003',
      course: cCourseId,
      title: '3. Memory Management: malloc & free',
      content: '<h2>Manual Allocation</h2><p>Unlike Java or Python, C does not have a Garbage Collector. You must ask the OS for memory, and <strong>you</strong> must give it back.</p><pre><code>int *arr = malloc(10 * sizeof(int));\n// Do work...\nfree(arr); // Never forget this!</code></pre><p>Failing to call <code>free()</code> causes memory leaks.</p>',
      videoUrl: '', order: 3, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }
  ],
  quiz: null
};

// Create C++ Course
const cppCourseId = 'cbbcbbcbbcbbcbbcbbcbbcbb';
const cppCourse = {
  course: {
    _id: cppCourseId,
    title: 'Modern C++: Powerful Object-Oriented Development',
    slug: 'modern-cpp-mastery',
    description: 'Level up from C to C++. Learn Object-Oriented Principles, the Standard Template Library (STL), and advanced memory safety features used in AAA Game Engines and heavy finance applications.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    theme: 'indigo',
    instructor: instructorId,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  },
  lessons: [
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0001',
      course: cppCourseId,
      title: '1. C++ vs C: The Paradigm Shift',
      content: '<h2>Object-Oriented Power</h2><p>C++ builds on C but adds classes, namespaces, and standard libraries.</p><pre><code>#include &lt;iostream&gt;\nusing namespace std;\n\nint main() {\n  cout &lt;&lt; "Hello Objects!" &lt;&lt; endl;\n  return 0;\n}</code></pre>',
      videoUrl: '', order: 1, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0002',
      course: cppCourseId,
      title: '2. Classes & Encapsulation',
      content: '<h2>Modeling the Real World</h2><p>Classes bind data and functions together.</p><pre><code>class Player {\nprivate:\n  int health;\npublic:\n  Player() { health = 100; }\n  void takeDamage(int x) { health -= x; }\n};</code></pre>',
      videoUrl: '', order: 2, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0003',
      course: cppCourseId,
      title: '3. The STL: Vectors & Maps',
      content: `<h2>Don't Reinvent the Wheel</h2><p>The Standard Template Library gives you high-performance data structures out of the box so you do not have to write linked lists manually anymore.</p><pre><code>#include &lt;vector&gt;\nvector&lt;int&gt; scores = {99, 85, 100};\nscores.push_back(92);</code></pre>`,
      videoUrl: '', order: 3, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }
  ],
  quiz: null
};

data.push(cCourse);
data.push(cppCourse);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Added C and C++ courses! Total courses: ${data.length}`);
