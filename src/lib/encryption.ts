/**
 * Helper to convert a hex string to a Uint8Array.
 */
function hexToUint8Array(hexString: string): Uint8Array {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const array = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    array[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return array;
}

/**
 * Helper to convert a Uint8Array to a hex string.
 */
function uint8ArrayToHex(array: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < array.length; i++) {
    hex += array[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Imports the encryption key passphrase as a CryptoKey using SHA-256 hash.
 */
async function getKey(secret: string): Promise<CryptoKey> {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Cryptography API is not supported in this environment');
  }
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const hash = await cryptoObj.subtle.digest('SHA-256', keyData);
  return cryptoObj.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string using AES-256-GCM (Web Crypto API).
 * @param text Plaintext to encrypt
 * @param secret Encryption key passphrase
 * @returns The formatted encrypted string (iv:ciphertext:tag)
 */
export async function encrypt(text: string, secret: string): Promise<string> {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  if (!cryptoObj) {
    throw new Error('Web Cryptography API is not supported in this environment');
  }
  const key = await getKey(secret);
  const iv = cryptoObj.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encoded = enc.encode(text);
  
  const ciphertextBuffer = await cryptoObj.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );
  
  const ciphertextAndTag = new Uint8Array(ciphertextBuffer);
  // Web Crypto GCM appends the 16-byte authentication tag at the end of the ciphertext
  const ciphertextBytes = ciphertextAndTag.slice(0, ciphertextAndTag.length - 16);
  const tagBytes = ciphertextAndTag.slice(ciphertextAndTag.length - 16);
  
  return `${uint8ArrayToHex(iv)}:${uint8ArrayToHex(ciphertextBytes)}:${uint8ArrayToHex(tagBytes)}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string (Web Crypto API).
 * @param encryptedText Formatted encrypted string (iv:ciphertext:tag)
 * @param secret Encryption key passphrase
 * @returns Plaintext string
 */
export async function decrypt(encryptedText: string, secret: string): Promise<string> {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  if (!cryptoObj) {
    throw new Error('Web Cryptography API is not supported in this environment');
  }
  const key = await getKey(secret);
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format. Expected iv:ciphertext:tag');
  }
  const [ivHex, ciphertextHex, tagHex] = parts;
  
  const iv = hexToUint8Array(ivHex);
  const ciphertextBytes = hexToUint8Array(ciphertextHex);
  const tagBytes = hexToUint8Array(tagHex);
  
  // Reconstruct the ciphertext + auth tag buffer expected by Web Crypto
  const ciphertextAndTag = new Uint8Array(ciphertextBytes.length + tagBytes.length);
  ciphertextAndTag.set(ciphertextBytes);
  ciphertextAndTag.set(tagBytes, ciphertextBytes.length);
  
  const decryptedBuffer = await cryptoObj.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as any,
    },
    key,
    ciphertextAndTag as any
  );
  
  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}
