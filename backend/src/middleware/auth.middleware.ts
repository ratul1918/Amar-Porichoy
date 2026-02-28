import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, hashToken } from '@utils/jwt.utils';
import { getRedisClient, RedisKeys } from '@database/redis';
import { AppError } from '@utils/errors';
import { ErrorCode, JwtAccessPayload } from '@app-types/index';
import { logger } from '@utils/logger';

// Extend Express Request to carry the authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtAccessPayload;
      requestId?: string;
    }
    interface Locals {
      requestId?: string;
    }
  }
}

// ─────────────────────────────────────────────
// Request ID middleware — attach to every request
// ─────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.locals['requestId'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

// ─────────────────────────────────────────────
// Authentication middleware
// ─────────────────────────────────────────────

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'Authorization header missing or malformed', 401);
  }

  const token = authHeader.slice(7);

  // Verify JWT signature + expiry
  const payload = verifyAccessToken(token);

  req.user = payload;
  next();
}

// ─────────────────────────────────────────────
// Token blocklist check (async — must run AFTER authenticate)
// ─────────────────────────────────────────────

export async function checkTokenBlocklist(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.slice(7);
  const tokenHash = hashToken(token);

  const redis = getRedisClient();
  const blocked = await redis.exists(RedisKeys.tokenBlocklist(tokenHash));

  if (blocked) {
    throw new AppError(ErrorCode.TOKEN_INVALID, 'Token has been revoked', 401);
  }

  next();
}

// ─────────────────────────────────────────────
// Optional auth — attaches user if token present, doesn't throw
// ─────────────────────────────────────────────

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.slice(7);
    req.user = verifyAccessToken(token);
  } catch {
    logger.debug('Optional auth: invalid token ignored');
  }

  next();
}
