export const CATEGORY_KEYWORDS = {
  'HTML':       ['html'],
  'CSS':        ['css'],
  'JavaScript': ['javascript', 'js', 'react', 'node', 'express'],
  'Python':     ['python'],
  'Java':       ['java'],
  'AI / ML':    ['artificial intelligence', 'machine learning', 'ai', 'data science'],
};

export function getCourseCategory(course) {
  if (course.isJobSimulation) return 'Job Simulation';
  const title = (course.title || '').toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => title.includes(k))) return cat;
  }
  return 'Other';
}
