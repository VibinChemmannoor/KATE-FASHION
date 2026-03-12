import DOMPurify from "isomorphic-dompurify";

/**
 * Recursively sanitize all string values in an object.
 * @param {object|string} input
 * @returns {object|string}
 */
export function sanitizeInput(input) {
  if (typeof input === "string") return DOMPurify.sanitize(input.trim());
  if (Array.isArray(input)) return input.map(sanitizeInput);
  if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeInput(value)])
    );
  }
  return input;
}
