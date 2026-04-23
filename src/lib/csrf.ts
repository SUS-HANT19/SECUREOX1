const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_EXPIRY_KEY = 'csrf_token_expiry';
const TOKEN_LIFETIME_MS = 60 * 60 * 1000;

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

  const expiry = Date.now() + TOKEN_LIFETIME_MS;

  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  sessionStorage.setItem(CSRF_TOKEN_EXPIRY_KEY, expiry.toString());

  return token;
}

export function getCSRFToken(): string | null {
  const token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  const expiry = sessionStorage.getItem(CSRF_TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  if (Date.now() > parseInt(expiry, 10)) {
    clearCSRFToken();
    return null;
  }

  return token;
}

export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken();

  if (!storedToken) {
    return false;
  }

  return storedToken === token;
}

export function clearCSRFToken(): void {
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
  sessionStorage.removeItem(CSRF_TOKEN_EXPIRY_KEY);
}

export function refreshCSRFToken(): string {
  clearCSRFToken();
  return generateCSRFToken();
}

export function ensureCSRFToken(): string {
  const existingToken = getCSRFToken();

  if (existingToken) {
    return existingToken;
  }

  return generateCSRFToken();
}
