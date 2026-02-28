import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { Request, Response, NextFunction } from 'express';
import { config } from '@config/index';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';

// ─────────────────────────────────────────────
// Security Headers via Helmet
// ─────────────────────────────────────────────

export const securityHeaders = helmet({
  // Strict-Transport-Security: max-age=1year; includeSubDomains; preload
  hsts: {
    maxAge: 31_536_000,
    includeSubDomains: true,
    preload: true,
  },
  // Content-Security-Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  // Prevent browsers from MIME-sniffing
  noSniff: true,
  // X-Frame-Options: DENY
  frameguard: { action: 'deny' },
  // X-XSS-Protection (legacy browsers)
  xssFilter: true,
  // Referrer-Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Remove X-Powered-By
  hidePoweredBy: true,
  // Permissions-Policy
  permittedCrossDomainPolicies: false,
});

// ─────────────────────────────────────────────
// CORS Configuration
// ─────────────────────────────────────────────

const allowedOrigins = config.CORS_ORIGINS.split(',').map((o: string) => o.trim());

export const corsMiddleware = cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Request-ID',
  ],
  exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86_400, // 24h preflight cache
});

// ─────────────────────────────────────────────
// CSRF Protection
// Uses Double-Submit Cookie pattern:
// 1. Server sets __Host-csrf cookie (httpOnly: false so JS can read)
// 2. Client includes same value in X-CSRF-Token header
// 3. Server validates they match
// ─────────────────────────────────────────────

export function csrfProtection(req: Request, _res: Response, next: NextFunction): void {
  // Skip CSRF for GET, HEAD, OPTIONS (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieToken = (req.cookies as Record<string, string | undefined>)['__Host-csrf'];
  const headerToken = req.headers['x-csrf-token'] as string | undefined;

  if (!cookieToken || !headerToken) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'CSRF token missing', 403);
  }

  if (cookieToken !== headerToken) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'CSRF token mismatch', 403);
  }

  next();
}

// ─────────────────────────────────────────────
// Response compression
// ─────────────────────────────────────────────

export const compressionMiddleware = compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  threshold: 1024, // only compress responses > 1KB
});

// ─────────────────────────────────────────────
// Request size limits are configured in app.ts via express.json()
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Central Error Handler
// ─────────────────────────────────────────────

import { logger } from '@utils/logger';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.requestId ?? '';

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, requestId }, 'Non-operational AppError');
    } else {
      logger.warn({ code: err.code, statusCode: err.statusCode, requestId }, err.message);
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
        ...(err.field ? { field: err.field } : {}),
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
    return;
  }

  // ZodError from Zod schema validation
  // (imported inline to avoid circular dep)
  if ((err as { name?: string }).name === 'ZodError') {
    const zodErr = err as { errors: Array<{ path: (string | number)[]; message: string }> };
    const details: Record<string, string[]> = {};
    for (const issue of zodErr.errors) {
      const key = issue.path.join('.');
      details[key] = [...(details[key] ?? []), issue.message];
    }
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details,
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
    return;
  }

  // CORS errors
  if ((err as Error).message?.startsWith('CORS:')) {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: (err as Error).message },
      timestamp: new Date().toISOString(),
      requestId,
    });
    return;
  }

  // Unknown / programming error
  logger.error({ err, requestId }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    },
    timestamp: new Date().toISOString(),
    requestId,
  });
}

// 404 handler — must be added after all routes
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(ErrorCode.NOT_FOUND, `Route ${req.method} ${req.path} not found`, 404));
}
