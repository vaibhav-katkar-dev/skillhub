/**
 * courseLoader.js
 * ───────────────────────────────────────────────────────
 * Single source of truth for all course + lesson data.
 *
 * HOW IT WORKS:
 *  - All courses+lessons live in ONE file: /data/all-courses.json
 *  - This loader fetches it ONCE and caches it in memory.
 *  - Every component (Courses, CourseDetail, LessonView, Dashboard)
 *    calls these helpers — zero duplicate network requests.
 *  - Cache is valid for the entire browser session (refresh = re-fetch).
 *
 * TO ADD A NEW COURSE:
 *  - Open public/data/all-courses.json
 *  - Add a new object { "course": {...}, "lessons": [...] } to the array
 *  - Save. Done.
 */

// ── Module-level cache ──────────────────────────────────
let _promise = null;   // in-flight or resolved promise
let _data    = null;   // cached parsed array

/** @returns {Promise<Array<{course: object, lessons: Array}>>} */
async function _load() {
  if (_data) return _data;        // already loaded
  if (_promise) return _promise;  // already loading

  _promise = fetch('/data/all-courses.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
      return res.json();
    })
    .then(parsed => {
      _data = parsed;
      return parsed;
    });

  return _promise;
}

// ── Public API ──────────────────────────────────────────

/**
 * Get the flat list of course objects (for Courses page / Dashboard).
 * @returns {Promise<Array<object>>}
 */
export async function getCourseList() {
  const all = await _load();
  return all.map(entry => entry.course);
}

/**
 * Get full course detail + lessons for a given slug.
 * @param {string} slug
 * @returns {Promise<{course: object, lessons: Array}|null>}
 */
export async function getCourseBySlug(slug) {
  const all = await _load();
  return all.find(entry => entry.course.slug === slug) || null;
}

/**
 * Preload all data immediately (optional, call on app mount for speed).
 */
export function preloadCourses() {
  _load().catch(() => {}); // fire and forget
}
