const fs = require('fs');
const path = 'H:/SkillHub/frontend/public/data/all-courses.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Find C course
const cCourse = data.find(c => c.course.slug === 'ultimate-c-programming');
if (cCourse) {
  const newCLessons = [
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c004',
      course: cCourse.course._id,
      title: '4. Arrays and Strings: Contiguous Memory',
      content: `<h2>Contiguous Memory Blocks</h2><p>In C, an array is simply a contiguous block of memory. The array variable itself acts as a pointer to the first element!</p><pre><code>int scores[5] = {90, 85, 99, 100, 75};\nprintf("First score: %d\\n", scores[0]);\nprintf("First score using pointer: %d\\n", *scores);</code></pre><h3>Strings in C</h3><p>C has no string type. Strings are just arrays of characters ending with a null terminator <code>\\0</code>.</p><pre><code>char name[] = "SkillValix"; // Automatically adds \\0\nprintf("Hello %s", name);</code></pre>`,
      videoUrl: '', order: 4, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c005',
      course: cCourse.course._id,
      title: '5. Structs: Building Custom Types',
      content: `<h2>Grouping Data</h2><p>Structs allow you to bundle multiple variables under a single custom memory structure.</p><pre><code>struct Player {\n  char name[50];\n  int health;\n  float speed;\n};\n\nint main() {\n  struct Player p1 = { "Hero", 100, 5.5 };\n  printf("%s has %d health", p1.name, p1.health);\n}</code></pre><p>Structs do not contain functions. They only group data, providing an early step before Object-Oriented design.</p>`,
      videoUrl: '', order: 5, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c006',
      course: cCourse.course._id,
      title: '6. File I/O: Reading and Writing',
      content: `<h2>Persistent Storage</h2><p>Programs lose state when they close. Writing to files is how we save data permanently.</p><pre><code>FILE *file = fopen("data.txt", "w");\nif (file != NULL) {\n  fprintf(file, "Saving high score: 9999\\n");\n  fclose(file);\n}</code></pre>`,
      videoUrl: '', order: 6, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c007',
      course: cCourse.course._id,
      title: '7. Advanced Pointers: Pointers to Pointers',
      content: `<h2>Deep References</h2><p>Pointers can point to other pointers. This is essential for dynamically allocating multi-dimensional arrays.</p><pre><code>int x = 100;\nint *ptr = &amp;x;\nint **ptr2 = &amp;ptr;\nprintf("Value: %d", **ptr2); // Outputs 100</code></pre>`,
      videoUrl: '', order: 7, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c008',
      course: cCourse.course._id,
      title: '8. Function Pointers: Callbacks in C',
      content: `<h2>Variables That Execute</h2><p>In C, you can store memory addresses of functions inside variables and pass them as arguments. This is the foundation of callback logic in modern operating systems!</p><pre><code>void greet() { printf("Hi!"); }\nvoid execute(void (*func)()) { func(); }\n\nint main() {\n  execute(greet);\n}</code></pre>`,
      videoUrl: '', order: 8, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c009',
      course: cCourse.course._id,
      title: '9. Header Files and Multiple Files',
      content: `<h2>Scaling Codebases</h2><p>Writing an entire OS in <code>main.c</code> is impossible. You must split logic using headers!</p><pre><code>// math.h\nint add(int a, int b);\n\n// math.c\n#include "math.h"\nint add(int a, int b) { return a + b; }</code></pre>`,
      videoUrl: '', order: 9, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'c0c0c0c0c0c0c0c0c0c0c010',
      course: cCourse.course._id,
      title: '10. Macros and Preprocessor Directives',
      content: `<h2>Code Generating Code</h2><p>The C Preprocessor runs before compilation. Macros can aggressively speed up execution but can be hard to debug.</p><pre><code>#define PI 3.14159265\n#define SQUARE(x) ((x) * (x))\n\nint main() {\n  printf("%f", SQUARE(5.0));\n}</code></pre>`,
      videoUrl: '', order: 10, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }
  ];

  // Merge avoiding duplicates by title
  newCLessons.forEach(nl => {
    if (!cCourse.lessons.find(l => l.title === nl.title)) {
      cCourse.lessons.push(nl);
    }
  });

  // Sort by order just in case
  cCourse.lessons.sort((a,b) => a.order - b.order);
}

// Find C++ course
const cppCourse = data.find(c => c.course.slug === 'modern-cpp-mastery');
if (cppCourse) {
  const newCppLessons = [
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0004',
      course: cppCourse.course._id,
      title: '4. RAII and Smart Pointers',
      content: `<h2>No More Memory Leaks</h2><p>Modern C++ introduces Smart Pointers. RAII (Resource Acquisition Is Initialization) ties resource lifespan to object lifespan.</p><pre><code>#include &lt;memory&gt;\nusing namespace std;\n\nvoid run() {\n  unique_ptr&lt;int&gt; ptr = make_unique&lt;int&gt;(100);\n  cout &lt;&lt; *ptr &lt;&lt; endl;\n} // ptr is automatically freed here! No delete needed.</code></pre>`,
      videoUrl: '', order: 4, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0005',
      course: cppCourse.course._id,
      title: '5. Inheritance and Polymorphism',
      content: `<h2>Extending Behavior</h2><p>Inheritance lets classes share properties. Polymorphism lets you use a child class where a parent class is expected.</p><pre><code>class Animal {\npublic:\n  virtual void speak() { cout &lt;&lt; "Unknown" &lt;&lt; endl; }\n};\n\nclass Dog : public Animal {\npublic:\n  void speak() override { cout &lt;&lt; "Bark!" &lt;&lt; endl; }\n};\n</code></pre><p>This allows game engines to loop through lists of entirely different entities using a single parent pointer.</p>`,
      videoUrl: '', order: 5, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0006',
      course: cppCourse.course._id,
      title: '6. Templates: Generic Programming',
      content: `<h2>Write Once, Use Anywhere</h2><p>Templates allow C++ to statically generate functions for any data type at compile time.</p><pre><code>template &lt;typename T&gt;\nT add(T a, T b) {\n  return a + b;\n}\n\nint main() {\n  cout &lt;&lt; add&lt;int&gt;(5, 5) &lt;&lt; endl;\n  cout &lt;&lt; add&lt;double&gt;(5.5, 2.1) &lt;&lt; endl;\n}</code></pre>`,
      videoUrl: '', order: 6, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0007',
      course: cppCourse.course._id,
      title: '7. Exceptions and Error Handling',
      content: `<h2>Graceful Failures</h2><p>Throwing and catching exceptions allows deep functions to safely escape execution during an error.</p><pre><code>void divide(int a, int b) {\n  if (b == 0) throw runtime_error("Division by zero!");\n  cout &lt;&lt; a / b &lt;&lt; endl;\n}\n\nint main() {\n  try { divide(10, 0); }\n  catch(const exception&amp; e) { cout &lt;&lt; e.what(); }\n}</code></pre>`,
      videoUrl: '', order: 7, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0008',
      course: cppCourse.course._id,
      title: '8. Multithreading in C++',
      content: `<h2>Concurrent Execution</h2><p>Heavy workloads can be executed simultaneously using the <code>&lt;thread&gt;</code> library over multiple CPU cores.</p><pre><code>#include &lt;thread&gt;\nvoid task() { cout &lt;&lt; "Background task" &lt;&lt; endl; }\n\nint main() {\n  thread t1(task);\n  t1.join(); // Wait for thread to finish\n}</code></pre>`,
      videoUrl: '', order: 8, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0009',
      course: cppCourse.course._id,
      title: '9. Move Semantics and Rvalue References',
      content: `<h2>High Performance C++</h2><p>Move semantics allow C++ to "steal" internal data structures instead of doing expensive deep copies. This is how Modern C++ is lightning fast.</p><pre><code>vector&lt;int&gt; v1 = {1, 2, 3};\nvector&lt;int&gt; v2 = std::move(v1); // v1 is now empty, v2 took its memory</code></pre>`,
      videoUrl: '', order: 9, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      _id: 'cbbcbbcbbcbbcbbcbbcb0010',
      course: cppCourse.course._id,
      title: '10. Lambdas and Functional C++',
      content: `<h2>Anonymous Functions</h2><p>Lambdas allow you to write functions directly inside other functions! Immensely useful for algorithms like std::sort.</p><pre><code>vector&lt;int&gt; nums = {3, 1, 4};\nsort(nums.begin(), nums.end(), [](int a, int b) {\n  return a &lt; b;\n});</code></pre>`,
      videoUrl: '', order: 10, __v: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }
  ];

  newCppLessons.forEach(nl => {
    if (!cppCourse.lessons.find(l => l.title === nl.title)) {
      cppCourse.lessons.push(nl);
    }
  });

  cppCourse.lessons.sort((a,b) => a.order - b.order);
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Successfully expanded C and C++ courses!');
