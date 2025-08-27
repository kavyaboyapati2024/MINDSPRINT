export async function encrypt(password, text) {
  const enc = new TextEncoder();

  // Convert password into a 16-byte key
  let keyBytes = enc.encode(password);
  if (keyBytes.length < 16) {
    const padded = new Uint8Array(16);
    padded.set(keyBytes);
    keyBytes = padded;
  } else if (keyBytes.length > 16) {
    keyBytes = keyBytes.slice(0, 16);
  }

  // Import key for AES-CTR
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-CTR",
    false,
    ["encrypt"]
  );

  // Generate random 16-byte IV
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Encrypt the text
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-CTR", counter: iv, length: 64 },
    cryptoKey,
    enc.encode(text)
  );

  // Convert IV + encrypted data to hex string
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const hex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("") +
    Array.from(encryptedArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return hex;
}