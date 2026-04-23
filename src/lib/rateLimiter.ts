interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil?: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: number | null = null;

  constructor() {
    this.startCleanup();
  }

  private startCleanup(): void {
    this.cleanupInterval = window.setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      this.storage.forEach((entry, key) => {
        if (entry.blockedUntil && entry.blockedUntil < now) {
          keysToDelete.push(key);
        } else if (now - entry.firstAttemptTime > 3600000) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => this.storage.delete(key));
    }, 60000);
  }

  check(identifier: string, config: RateLimitConfig): { allowed: boolean; remainingAttempts: number; resetTime: number } {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    if (entry?.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockedUntil
      };
    }

    if (!entry || now - entry.firstAttemptTime > config.windowMs) {
      this.storage.set(identifier, {
        attempts: 1,
        firstAttemptTime: now
      });
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      };
    }

    if (entry.attempts >= config.maxAttempts) {
      const blockUntil = now + (config.blockDurationMs || config.windowMs * 2);
      this.storage.set(identifier, {
        ...entry,
        blockedUntil: blockUntil
      });
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: blockUntil
      };
    }

    entry.attempts++;
    this.storage.set(identifier, entry);

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - entry.attempts,
      resetTime: entry.firstAttemptTime + config.windowMs
    };
  }

  reset(identifier: string): void {
    this.storage.delete(identifier);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

export const rateLimiter = new RateLimiter();

export const RATE_LIMITS = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  SIGNUP: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 24 * 60 * 60 * 1000 },
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 2 * 60 * 60 * 1000 },
  DEMO_REQUEST: { maxAttempts: 2, windowMs: 24 * 60 * 60 * 1000, blockDurationMs: 24 * 60 * 60 * 1000 },
  ENCRYPTION: { maxAttempts: 30, windowMs: 60 * 1000 },
  OCR: { maxAttempts: 10, windowMs: 60 * 1000 },
  FILE_OPERATION: { maxAttempts: 20, windowMs: 60 * 1000 }
};

export function getRateLimitIdentifier(operation: string, userIdentifier?: string): string {
  const baseId = userIdentifier || getDeviceFingerprint();
  return `${operation}:${baseId}`;
}

function getDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');

  return hashString(fingerprint);
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
