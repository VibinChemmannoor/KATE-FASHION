import { privateDecrypt, constants as cryptoConstants } from "crypto";

/**
 * @param {string} encryptedBase64
 * @returns {string}
 */
export function decryptPassword(encryptedBase64) {
  const privateKey = process.env.AUTH_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!privateKey) throw new Error("AUTH_PRIVATE_KEY is not set");

  const buffer = Buffer.from(encryptedBase64, "base64");
  const decrypted = privateDecrypt(
    {
      key: privateKey,
      padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return decrypted.toString("utf8");
}
