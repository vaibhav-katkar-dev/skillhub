/**
 * courseSeo.js
 * Comprehensive SEO Metadata & Schema.org JSON-LD Generator for SkillValix Courses.
 */

const SITE_URL = 'https://www.skillvalix.com';
const SITE_NAME = 'SkillValix';
const DEFAULT_IMAGE = 'https://www.skillvalix.com/logo.svg';
const LOGO_URL = 'https://www.skillvalix.com/logo.svg';

/**
 * Returns comprehensive SEO properties + JSON-LD schemas for a given course.
 * @param {object} course - The course metadata object
 * @param {string} slug - Course slug
 * @param {Array} lessons - Lessons array
 * @returns {object|null} Calculated SEO fields & schemas
 */
export function getCourseSeoMetadata(course, slug, lessons = []) {
  if (!course) return null;

  const courseTitle = course.title || 'Free Online Course';
  const cleanDescription = (course.description || '').replace(/\s+/g, ' ').trim();
  
  // 1. Meta Title (Ideal for Google SERP)
  const metaTitle = course.metaTitle || `${courseTitle} | Free Certified Course | ${SITE_NAME}`;

  // 2. Meta Description (150 - 160 chars)
  const metaDescription = course.metaDescription || (
    cleanDescription.length > 155
      ? `${cleanDescription.substring(0, 152)}...`
      : cleanDescription || `Learn ${courseTitle} for free on ${SITE_NAME}. Step-by-step interactive modules, hands-on practice, and verified certification.`
  );

  // 3. Keywords Array -> Comma Separated String
  const defaultKeywords = [
    courseTitle,
    `${courseTitle} course`,
    `learn ${courseTitle} online`,
    `free ${courseTitle} tutorial`,
    `${courseTitle} certification`,
    'online coding course free',
    'SkillValix courses',
    'web development certification'
  ];
  const keywordsList = Array.isArray(course.keywords) && course.keywords.length > 0
    ? course.keywords
    : defaultKeywords;
  const keywordsString = keywordsList.join(', ');

  // 4. Category & Level
  const category = course.category || 'Web Development';
  const level = course.level || 'Beginner to Advanced';
  const rawImage = course.image || DEFAULT_IMAGE;
  const imageUrl = rawImage.startsWith('http://') || rawImage.startsWith('https://')
    ? rawImage
    : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  // 5. Schema.org Course JSON-LD Payload
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseTitle,
    description: metaDescription,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL
      }
    },
    image: imageUrl,
    url: canonicalUrl,
    inLanguage: 'en',
    educationalLevel: level,
    isAccessibleForFree: true,
    courseCode: slug,
    about: [category, ...keywordsList.slice(0, 5)],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT2H',
      isAccessibleForFree: true,
      instructor: {
        '@type': 'Organization',
        name: 'SkillValix Technical Instructors'
      }
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Free Course with Certificate'
    },
    ...(lessons && lessons.length > 0 && {
      hasCourseSection: lessons.map((lesson, idx) => ({
        '@type': 'CourseSection',
        name: lesson.title || `Lesson ${idx + 1}`,
        position: idx + 1
      }))
    })
  };

  // 6. Schema.org BreadcrumbList JSON-LD Payload
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Courses',
        item: `${SITE_URL}/courses`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category,
        item: `${SITE_URL}/courses?category=${encodeURIComponent(category)}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: courseTitle,
        item: canonicalUrl
      }
    ]
  };

  return {
    metaTitle,
    metaDescription,
    keywordsString,
    keywordsList,
    category,
    level,
    canonicalUrl,
    imageUrl,
    courseSchema,
    breadcrumbSchema,
    siteName: SITE_NAME
  };
}
