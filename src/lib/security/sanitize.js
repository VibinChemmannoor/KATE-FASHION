/**
 * Basic string sanitizer that strips HTML tags and trims whitespace.
 * Works in both server and client environments without jsdom dependency.
 * @param {string} str
 * @returns {string}
 */
function stripHtml(str) {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Recursively sanitize all string values in an object.
 * @param {object|string} input
 * @returns {object|string}
 */
export function sanitizeInput(input) {
  if (typeof input === "string") return stripHtml(input);
  if (Array.isArray(input)) return input.map(sanitizeInput);
  if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeInput(value)])
    );
  }
  return input;
}
