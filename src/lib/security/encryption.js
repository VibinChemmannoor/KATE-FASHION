import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import {
  ENCRYPTION_ALGORITHM,
  ENCRYPTION_IV_BYTES,
  ENCRYPTION_TAG_BYTES,
} from "@/lib/utils/constants";

/**
 * @param {string} key
 * @returns {Buffer}
 */
function normalizeKey(key) {
  return Buffer.from(key, "hex");
}

/**
 * @param {string} plaintext
 * @returns {string}
 */
export function encryptText(plaintext) {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set");

  const iv = randomBytes(ENCRYPTION_IV_BYTES);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, normalizeKey(key), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

/**
 * @param {string} payload
 * @returns {string}
 */
export function decryptText(payload) {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set");

  const buffer = Buffer.from(payload, "base64");
  const iv = buffer.subarray(0, ENCRYPTION_IV_BYTES);
  const tag = buffer.subarray(ENCRYPTION_IV_BYTES, ENCRYPTION_IV_BYTES + ENCRYPTION_TAG_BYTES);
  const data = buffer.subarray(ENCRYPTION_IV_BYTES + ENCRYPTION_TAG_BYTES);

  const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, normalizeKey(key), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  return decrypted.toString("utf8");
}
