import { createHash, randomBytes } from "crypto";

/**
 * @returns {string}
 */
export function generateCsrfToken() {
  return randomBytes(32).toString("hex");
}

/**
 * @param {string} token
 * @param {string} sessionToken
 * @returns {boolean}
 */
export function verifyCsrfToken(token, sessionToken) {
  const expected = createHash("sha256").update(sessionToken).digest("hex");
  return token === expected;
}
