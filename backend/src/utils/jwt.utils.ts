import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { config } from '@config/index';
import { JwtAccessPayload, JwtRefreshPayload, TokenPair } from '@app-types/index';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';
import ms from 'ms';

// ─────────────────────────────────────────────
// Access Token
// ─────────────────────────────────────────────

export function signAccessToken(payload: Omit<JwtAccessPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    config.JWT_ACCESS_SECRET,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
      algorithm: 'HS256',
      issuer: 'porichoy.gov.bd',
      audience: 'porichoy-client',
    } as SignOptions
  );
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  try {
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
      issuer: 'porichoy.gov.bd',
      audience: 'porichoy-client',
    } satisfies VerifyOptions) as JwtAccessPayload;

    if (payload.type !== 'access') {
      throw new AppError(ErrorCode.TOKEN_INVALID, 'Token type mismatch', 401);
    }
    return payload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(ErrorCode.TOKEN_EXPIRED, 'Access token expired', 401);
    }
    if (err instanceof AppError) throw err;
    throw new AppError(ErrorCode.TOKEN_INVALID, 'Invalid access token', 401);
  }
}

// ─────────────────────────────────────────────
// Refresh Token
// ─────────────────────────────────────────────

export function signRefreshToken(
  payload: Omit<JwtRefreshPayload, 'type' | 'iat' | 'exp'>
): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    config.JWT_REFRESH_SECRET,
    {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
      algorithm: 'HS256',
      issuer: 'porichoy.gov.bd',
    } as SignOptions
  );
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  try {
    const payload = jwt.verify(token, config.JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
      issuer: 'porichoy.gov.bd',
    } satisfies VerifyOptions) as JwtRefreshPayload;

    if (payload.type !== 'refresh') {
      throw new AppError(ErrorCode.TOKEN_INVALID, 'Token type mismatch', 401);
    }
    return payload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(ErrorCode.TOKEN_EXPIRED, 'Refresh token expired — please login again', 401);
    }
    if (err instanceof AppError) throw err;
    throw new AppError(ErrorCode.TOKEN_INVALID, 'Invalid refresh token', 401);
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

export function generateTokenFamily(): string {
  return randomBytes(32).toString('hex');
}

export function getTokenExpiryMs(expiresIn: string): number {
  return ms(expiresIn as Parameters<typeof ms>[0]);
}

export function buildTokenPair(
  accessPayload: Omit<JwtAccessPayload, 'type' | 'iat' | 'exp'>,
  refreshPayload: Omit<JwtRefreshPayload, 'type' | 'iat' | 'exp'>
): TokenPair {
  const accessToken = signAccessToken(accessPayload);
  const refreshToken = signRefreshToken(refreshPayload);
  return {
    accessToken,
    refreshToken,
    expiresIn: getTokenExpiryMs(config.JWT_ACCESS_EXPIRES_IN) / 1000,
    refreshExpiresIn: getTokenExpiryMs(config.JWT_REFRESH_EXPIRES_IN) / 1000,
  };
}

export function getAccessTokenExpiry(token: string): number {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) return 0;
  return decoded.exp * 1000 - Date.now();
}
