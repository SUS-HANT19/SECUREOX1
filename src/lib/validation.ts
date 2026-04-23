const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{10,20}$/;
const SQL_INJECTION_PATTERNS = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|UNION)\b)|([';])/i;
const XSS_PATTERNS = /<script|javascript:|onerror=|onload=|<iframe|eval\(|expression\(/i;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export function sanitizeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (SQL_INJECTION_PATTERNS.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in email' };
  }

  return { isValid: true, sanitized: trimmed.toLowerCase() };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmed = phone.trim();

  if (trimmed.length === 0) {
    return { isValid: true, sanitized: '' };
  }

  if (!PHONE_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  if (SQL_INJECTION_PATTERNS.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in phone number' };
  }

  return { isValid: true, sanitized: trimmed };
}

export function validateText(
  text: string,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 1000
): ValidationResult {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }

  if (SQL_INJECTION_PATTERNS.test(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }

  if (XSS_PATTERNS.test(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid content` };
  }

  return { isValid: true, sanitized: sanitizeInput(trimmed) };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 12) {
    return { isValid: false, error: 'Password must be at least 12 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password must not exceed 128 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain uppercase, lowercase, number, and special character'
    };
  }

  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return { isValid: false, error: 'Password is too common' };
  }

  return { isValid: true, sanitized: password };
}

export function validateFileSize(size: number, maxSizeMB: number = 10): ValidationResult {
  if (typeof size !== 'number' || size <= 0) {
    return { isValid: false, error: 'Invalid file size' };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (size > maxSizeBytes) {
    return { isValid: false, error: `File size must not exceed ${maxSizeMB}MB` };
  }

  return { isValid: true };
}

export function validateFileName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'File name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'File name cannot be empty' };
  }

  if (trimmed.length > 255) {
    return { isValid: false, error: 'File name is too long' };
  }

  const invalidChars = /[<>:"|?*\\/]/;
  if (invalidChars.test(trimmed)) {
    return { isValid: false, error: 'File name contains invalid characters' };
  }

  if (SQL_INJECTION_PATTERNS.test(trimmed) || XSS_PATTERNS.test(trimmed)) {
    return { isValid: false, error: 'File name contains invalid content' };
  }

  const sanitized = sanitizeInput(trimmed);
  return { isValid: true, sanitized };
}

export function validateUrl(url: string): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    if (XSS_PATTERNS.test(url)) {
      return { isValid: false, error: 'URL contains invalid content' };
    }

    return { isValid: true, sanitized: url };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}
