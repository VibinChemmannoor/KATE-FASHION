/**
 * @param {string} pem
 * @returns {ArrayBuffer}
 */
function pemToArrayBuffer(pem) {
  const cleaned = pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function encryptPassword(password) {
  const response = await fetch("/api/auth/public-key");
  if (!response.ok) {
    throw new Error("Unable to fetch public key");
  }
  const data = await response.json();
  const publicKeyPem = data?.key;
  if (!publicKeyPem) {
    throw new Error("Public key missing");
  }

  const keyBuffer = pemToArrayBuffer(publicKeyPem);
  const cryptoKey = await window.crypto.subtle.importKey(
    "spki",
    keyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encoded = new TextEncoder().encode(password);
  const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, cryptoKey, encoded);
  return arrayBufferToBase64(encrypted);
}
