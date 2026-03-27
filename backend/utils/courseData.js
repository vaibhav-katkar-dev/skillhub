import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const COURSE_JSON_PATH = path.resolve(__dirname, '../../frontend/public/data/all-courses.json');

/**
 * Loads all course data from the frontend's static JSON file.
 * This is used for generating certificates and processing quizzes 
 * even if the course document is not present in the MongoDB.
 */
export async function getAllCoursesFromJSON() {
  try {
    const data = await fs.readFile(COURSE_JSON_PATH, 'utf-8');
    const sanitized = typeof data === 'string' ? data.replace(/^[^{[]+/, '') : '';
    return JSON.parse(sanitized);
  } catch (err) {
    console.warn(`[JSONLoader] Could not read all-courses.json at ${COURSE_JSON_PATH}:`, err.message);
    return [];
  }
}

/**
 * Finds a specific course by ID in the JSON.
 */
export async function getCourseFromJSON(courseId) {
  const all = await getAllCoursesFromJSON();
  // Find the course node that matches the given ID. 
  // Each entry in all-courses.json is like { course: { _id, title, ... }, lessons: [...] }
  const found = all.find(c => c.course._id.toString() === courseId.toString());
  return found ? found.course : null;
}

/**
 * Finds a specific quiz by course ID in the JSON.
 * (User should manually add a "quiz" field to each entry in the JSON)
 */
export async function getQuizFromJSON(courseId) {
  const all = await getAllCoursesFromJSON();
  const entry = all.find(c => c.course._id.toString() === courseId.toString());
  return entry ? entry.quiz : null;
}
