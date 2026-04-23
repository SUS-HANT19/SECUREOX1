export enum ErrorCode {
  UNKNOWN = 'UNKNOWN_ERROR',
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTH_ERROR',
  AUTHORIZATION = 'AUTHZ_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE = 'INVALID_FILE',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  OCR_FAILED = 'OCR_FAILED',
  DATABASE = 'DATABASE_ERROR',
  CSRF = 'CSRF_ERROR'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  statusCode?: number;
}

const USER_FRIENDLY_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN]: 'An unexpected error occurred. Please try again.',
  [ErrorCode.NETWORK]: 'Network connection failed. Please check your internet connection.',
  [ErrorCode.AUTHENTICATION]: 'Authentication failed. Please sign in again.',
  [ErrorCode.AUTHORIZATION]: 'You do not have permission to perform this action.',
  [ErrorCode.VALIDATION]: 'Please check your input and try again.',
  [ErrorCode.RATE_LIMIT]: 'Too many attempts. Please try again later.',
  [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds the maximum limit.',
  [ErrorCode.INVALID_FILE]: 'Invalid file format or corrupted file.',
  [ErrorCode.ENCRYPTION_FAILED]: 'Failed to encrypt data. Please try again.',
  [ErrorCode.DECRYPTION_FAILED]: 'Failed to decrypt data. Please check your password.',
  [ErrorCode.OCR_FAILED]: 'Failed to extract text from image. Please try a clearer image.',
  [ErrorCode.DATABASE]: 'Database operation failed. Please try again.',
  [ErrorCode.CSRF]: 'Security validation failed. Please refresh the page.'
};

export function createError(code: ErrorCode, message: string, statusCode?: number): AppError {
  const isDevelopment = import.meta.env.DEV;

  const userMessage = USER_FRIENDLY_MESSAGES[code];
  const devMessage = isDevelopment ? ` (Dev: ${message})` : '';

  return {
    code,
    message,
    userMessage: userMessage + devMessage,
    statusCode
  };
}

export function handleError(error: unknown): AppError {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const err = error as { code?: string; message?: string; userMessage?: string };

    if (err.userMessage) {
      return error as AppError;
    }

    if (err.message && typeof err.message === 'string') {
      return {
        code: ErrorCode.UNKNOWN,
        message: err.message,
        userMessage: err.message,
        statusCode: undefined
      };
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return createError(ErrorCode.NETWORK, error.message);
    }

    if (message.includes('auth') || message.includes('unauthorized')) {
      return createError(ErrorCode.AUTHENTICATION, error.message, 401);
    }

    if (message.includes('forbidden') || message.includes('permission')) {
      return createError(ErrorCode.AUTHORIZATION, error.message, 403);
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return createError(ErrorCode.VALIDATION, error.message, 400);
    }

    if (import.meta.env.DEV) {
      console.error('Unhandled error:', error);
    }

    return {
      code: ErrorCode.UNKNOWN,
      message: error.message,
      userMessage: error.message,
      statusCode: undefined
    };
  }

  const errorMessage = String(error);

  if (import.meta.env.DEV) {
    console.error('Unknown error type:', error);
  }

  return createError(ErrorCode.UNKNOWN, errorMessage);
}

export function logError(error: AppError, context?: Record<string, unknown>): void {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    console.group(`Error: ${error.code}`);
    console.error('Message:', error.message);
    console.error('User Message:', error.userMessage);
    if (error.statusCode) {
      console.error('Status Code:', error.statusCode);
    }
    if (context) {
      console.error('Context:', context);
    }
    console.groupEnd();
  }
}

export function isAuthError(error: AppError): boolean {
  return error.code === ErrorCode.AUTHENTICATION || error.code === ErrorCode.AUTHORIZATION;
}

export function isRateLimitError(error: AppError): boolean {
  return error.code === ErrorCode.RATE_LIMIT;
}

export function sanitizeErrorMessage(message: string): string {
  const sensitivePatterns = [
    /password[=:]\s*\S+/gi,
    /token[=:]\s*\S+/gi,
    /key[=:]\s*\S+/gi,
    /secret[=:]\s*\S+/gi,
    /api[_-]key[=:]\s*\S+/gi,
    /bearer\s+\S+/gi,
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  ];

  let sanitized = message;

  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
}
