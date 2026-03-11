import { createHash, randomBytes } from "crypto";
import { SESSION_TOKEN_BYTES } from "@/lib/utils/constants";

/**
 * @returns {string}
 */
export function generateSessionToken() {
  return randomBytes(SESSION_TOKEN_BYTES).toString("hex");
}

/**
 * @param {string} token
 * @returns {string}
 */
export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
