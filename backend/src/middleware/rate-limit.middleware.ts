import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';
import { Request, Response } from 'express';
import { getRedisClient } from '@database/redis';
import { config } from '@config/index';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';

// ─────────────────────────────────────────────
// Helper: create Redis-backed limiter
// ─────────────────────────────────────────────

function createLimiter(
  prefix: string,
  windowMs: number,
  max: number,
  message: string
) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
      return `${prefix}:${ip}`;
    },
    handler: (_req: Request, _res: Response) => {
      throw new AppError(
        ErrorCode.RATE_LIMITED,
        message,
        429
      );
    },
    store: new RedisStore({
      sendCommand: (...args: string[]): Promise<RedisReply> => {
        const [cmd, ...rest] = args;
        return getRedisClient().call(cmd ?? '', ...rest) as unknown as Promise<RedisReply>;
      },
      prefix: `rl:${prefix}:`,
    }),
  });
}

// ─────────────────────────────────────────────
// Global API rate limiter — 100 req / 15 min per IP
// ─────────────────────────────────────────────

export const globalRateLimit = createLimiter(
  'global',
  config.RATE_LIMIT_WINDOW_MS,
  config.RATE_LIMIT_MAX_REQUESTS,
  'Too many requests. Please try again later.'
);

// ─────────────────────────────────────────────
// Auth-specific rate limiter — 5 attempts / 15 min
// Applied only to POST /auth/login and POST /auth/register
// ─────────────────────────────────────────────

export const authRateLimit = createLimiter(
  'auth',
  config.RATE_LIMIT_WINDOW_MS,
  config.LOGIN_RATE_LIMIT_MAX,
  'Too many login attempts. Your IP has been temporarily blocked for 15 minutes.'
);

// ─────────────────────────────────────────────
// Sensitive operations — 10 req / 15 min
// Used for OTP endpoints, password reset, NID verify
// ─────────────────────────────────────────────

export const sensitiveRateLimit = createLimiter(
  'sensitive',
  config.RATE_LIMIT_WINDOW_MS,
  10,
  'Too many attempts. Please wait before trying again.'
);

// ─────────────────────────────────────────────
// File upload limiter — 20 uploads / 15 min
// ─────────────────────────────────────────────

export const uploadRateLimit = createLimiter(
  'upload',
  config.RATE_LIMIT_WINDOW_MS,
  20,
  'File upload limit reached. Please try again later.'
);
