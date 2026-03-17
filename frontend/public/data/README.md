# 📁 SkillHub — Static Course Data

All course and lesson content is managed through the JSON files in this folder.
**No database upload required.** Just edit the files and redeploy (or refresh in dev).

---

## 📂 File Structure

```
public/data/
├── courses.json                                  ← Course listing (index page)
├── ultimate-html-masterclass.json                ← HTML course detail + lessons
├── css-for-beginners-learn-web-styling-zero-to-pro.json  ← CSS course detail + lessons
└── your-new-course-slug.json                     ← Add new courses here
```

---

## ➕ Adding a New Course

### Step 1 — Create the course detail file

Filename must match the course `slug`. Example: `my-new-course.json`

```json
{
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My New Course",
    "slug": "my-new-course",
    "description": "A comprehensive course description.",
    "image": "https://images.unsplash.com/photo-xxxx?w=800&q=80",
    "theme": "blue",
    "published": true,
    "instructor": "507f1f77bcf86cd799439012",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "__v": 0
  },
  "lessons": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "1. Introduction",
      "content": "<h2>Welcome!</h2><p>Lesson content in HTML format.</p>",
      "videoUrl": "https://www.youtube.com/embed/VIDEO_ID",
      "duration": 15,
      "order": 1
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "2. Core Concepts",
      "content": "<h2>Core Concepts</h2><p>More content...</p>",
      "videoUrl": "",
      "duration": 20,
      "order": 2
    }
  ]
}
```

### Step 2 — Add entry to `courses.json`

Add the course object (without lessons) to the array:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My New Course",
  "slug": "my-new-course",
  "description": "A comprehensive course description.",
  "image": "https://images.unsplash.com/photo-xxxx?w=800&q=80",
  "theme": "blue",
  "instructor": "507f1f77bcf86cd799439012",
  "published": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "__v": 0
}
```

> ⚠️ **Important:** The `_id` in `courses.json` AND in the course detail file must be identical. It links to the quiz and certificate in the database.

---

## ✏️ Editing a Course

1. Open the course's `.json` file (e.g., `ultimate-html-masterclass.json`)
2. Edit the `course` object or add/remove items in the `lessons` array
3. Save — changes appear instantly in dev or after redeployment

---

## 🎨 Available Themes

| Value      | Color           |
|------------|-----------------|
| `"blue"`   | Indigo → Blue   |
| `"green"`  | Emerald → Teal  |
| `"pink"`   | Rose → Pink     |
| `"orange"` | Amber → Orange  |

---

## 🆔 Generating Unique IDs

IDs must be 24-character hex strings (MongoDB ObjectId format).

**Option 1** — Online: [objectid.io](https://objectid.io)  
**Option 2** — Node.js:
```js
const { ObjectId } = require('mongodb');
console.log(new ObjectId().toString());
```
**Option 3** — Any 24-char hex string works:
```
507f1f77bcf86cd799439011
```

---

## 🔒 What Stays Dynamic (Backend API)

| Feature         | Storage       | How to manage                          |
|----------------|---------------|----------------------------------------|
| Quiz Questions | MongoDB       | POST `/api/courses/upload` (quiz only) |
| Certificates   | MongoDB       | Auto-generated after quiz pass         |
| User Accounts  | MongoDB       | Register/Login flow                    |

---

## 🚀 Lesson Content Format

Lesson `content` is stored as raw HTML. Use any HTML tags:

```html
<h2>Section Title</h2>
<p>Paragraph text with <strong>bold</strong> and <em>italics</em>.</p>
<pre><code>const x = 10; // Code block</code></pre>
<ul>
  <li>List item one</li>
  <li>List item two</li>
</ul>
<blockquote>A highlighted tip or note</blockquote>
```

---

*For the admin UI with templates and guides, visit `/admin` when logged in as admin.*
