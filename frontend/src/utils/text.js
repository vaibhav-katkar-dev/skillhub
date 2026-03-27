const REPLACEMENTS = [
  ['Â·', '·'],
  ['â€”', '-'],
  ['â€“', '-'],
  ['â€"', '-'],
  ['â€˜', "'"],
  ['â€™', "'"],
  ['â€œ', '"'],
  ['â€\u009d', '"'],
  ['â€¦', '...'],
  ['â€¢', '•'],
  ['âœ¦', '•'],
  ['âœ…', ''],
  ['â†’', '->'],
  ['Ã—', 'x'],
  ['âƒ£', ''],
  ['DALLÂ·E', 'DALL·E'],
  ['â€', '"'],
];

export function normalizeDisplayText(value) {
  if (typeof value !== 'string') return value;

  let normalized = value;
  for (const [from, to] of REPLACEMENTS) {
    normalized = normalized.split(from).join(to);
  }

  return normalized.replace(/\uFEFF/g, '').replace(/�/g, '').trim();
}

export function normalizeHtmlContent(html) {
  return normalizeDisplayText(html);
}

export function normalizeDeepStrings(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeDeepStrings);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeDeepStrings(entryValue)])
    );
  }
  return normalizeDisplayText(value);
}
