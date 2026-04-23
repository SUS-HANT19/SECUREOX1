const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(plaintext: string, passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const key = await deriveKey(passphrase, salt);
  const encryptedData = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    key,
    encoder.encode(plaintext)
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedArray, salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptText(ciphertext: string, passphrase: string): Promise<string> {
  try {
    const decoder = new TextDecoder();
    const combined = new Uint8Array(
      atob(ciphertext)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedData = combined.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(passphrase, salt);
    const decryptedData = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: iv },
      key,
      encryptedData
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    throw new Error('Decryption failed: Invalid passphrase or corrupted data');
  }
}
