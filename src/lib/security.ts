/**
 * Security Utilities
 *
 * Client-side security hardening for a government identity platform.
 * These are complementary to server-side security — never a replacement.
 */

// ─── CSRF ────────────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically secure CSRF token.
 * Store in memory (React state) and send as a header on each mutation request.
 * NEVER store in localStorage or sessionStorage — those are vulnerable to XSS.
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiter. Limits actions per time window.
 * This is UX-only — enforce rate limits on the server/WAF as well.
 *
 * @param key     Unique key per action (e.g. "login:attempt")
 * @param maxHits Maximum allowed calls in the window
 * @param windowMs Time window in milliseconds (default 60s)
 */
export function checkRateLimit(key: string, maxHits: number, windowMs = 60_000): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxHits - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxHits) {
    return { allowed: false, remaining: 0, resetAt: entry.windowStart + windowMs };
  }

  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: maxHits - entry.count, resetAt: entry.windowStart + windowMs };
}

// ─── Session ─────────────────────────────────────────────────────────────────

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes (government standard)
const ABSOLUTE_TIMEOUT_MS   = 8 * 60 * 60 * 1000; // 8 hours max session

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let sessionStartTime: number | null = null;

/**
 * Start (or restart) inactivity watchdog.
 * Call on every user interaction event.
 * @param onTimeout Callback to invoke when session expires
 */
export function resetInactivityTimer(onTimeout: () => void): void {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(onTimeout, INACTIVITY_TIMEOUT_MS);
}

/** Returns true if the absolute session limit has been exceeded. */
export function isAbsoluteSessionExpired(): boolean {
  if (!sessionStartTime) return false;
  return Date.now() - sessionStartTime > ABSOLUTE_TIMEOUT_MS;
}

export function startSessionClock(): void {
  sessionStartTime = Date.now();
}

export function clearSessionClock(): void {
  sessionStartTime = null;
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
}

// ─── Secure Storage ──────────────────────────────────────────────────────────

/**
 * Secure in-memory store for short-lived sensitive data (e.g. tokens in SPAs).
 * DO NOT persist auth tokens to localStorage or sessionStorage.
 * In production, use httpOnly cookies managed by the backend.
 */
class SecureMemoryStore {
  private store = new Map<string, string>();

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  get(key: string): string | undefined {
    return this.store.get(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const secureStore = new SecureMemoryStore();

// ─── Environment ─────────────────────────────────────────────────────────────

/** Returns true only in production — used to conditionally enable debug tooling */
export const IS_PRODUCTION = import.meta.env.PROD;

/** Safe logger — strips sensitive data in production */
export const secureLog = {
  info: (...args: unknown[]) => {
    if (!IS_PRODUCTION) console.info('[Porichoy]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (!IS_PRODUCTION) console.warn('[Porichoy]', ...args);
  },
  error: (message: string, error?: unknown) => {
    // Always log errors, but strip details in production
    if (IS_PRODUCTION) {
      console.error('[Porichoy Error]', message);
    } else {
      console.error('[Porichoy Error]', message, error);
    }
  },
};
