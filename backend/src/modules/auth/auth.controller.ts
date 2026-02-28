import { Request, Response } from 'express';
import { authService } from './auth.service';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '@utils/validators';
import { sendSuccess, sendCreated } from '@utils/response.utils';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';

// ─────────────────────────────────────────────
// Auth Controller — thin layer: validate → service → respond
// ─────────────────────────────────────────────

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Public — registers a new citizen account
   */
  async register(req: Request, res: Response): Promise<void> {
    const dto = registerSchema.parse(req.body);
    const result = await authService.register(dto, req.ip);
    sendCreated(res, result, 'Registration successful. Please verify your phone number.');
  }

  /**
   * POST /api/v1/auth/login
   * Public — authenticates a citizen and returns JWT pair
   */
  async login(req: Request, res: Response): Promise<void> {
    const dto = loginSchema.parse(req.body);
    const tokenPair = await authService.login(dto, req.ip, req.headers['user-agent']);

    // Set refresh token as httpOnly, Secure, SameSite=Strict cookie
    res.cookie('refresh_token', tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: tokenPair.refreshExpiresIn * 1000,
      path: '/api/v1/auth/refresh',
    });

    sendSuccess(res, {
      accessToken: tokenPair.accessToken,
      expiresIn: tokenPair.expiresIn,
      tokenType: 'Bearer',
    });
  }

  /**
   * POST /api/v1/auth/refresh
   * Public — rotates the refresh token and issues a new access token
   */
  async refresh(req: Request, res: Response): Promise<void> {
    // Prefer httpOnly cookie, fall back to body (for non-browser clients)
    const rawToken =
      (req.cookies as Record<string, string | undefined>)['refresh_token'] ??
      refreshTokenSchema.parse(req.body).refreshToken;

    const tokenPair = await authService.refreshTokens(rawToken, req.ip);

    res.cookie('refresh_token', tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: tokenPair.refreshExpiresIn * 1000,
      path: '/api/v1/auth/refresh',
    });

    sendSuccess(res, {
      accessToken: tokenPair.accessToken,
      expiresIn: tokenPair.expiresIn,
      tokenType: 'Bearer',
    });
  }

  /**
   * POST /api/v1/auth/logout
   * Protected — revokes current session
   */
  async logout(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    const rawAccessToken = req.headers.authorization?.slice(7) ?? '';
    const revokeAll = (req.body as { revokeAll?: boolean }).revokeAll === true;

    await authService.logout(req.user.sub, req.user.sessionId, rawAccessToken, revokeAll);

    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
    sendSuccess(res, null, 'Logged out successfully');
  }

  /**
   * POST /api/v1/auth/change-password
   * Protected
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user.sub, currentPassword, newPassword, req.ip);

    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
    sendSuccess(res, null, 'Password changed. Please login again with your new password.');
  }

  /**
   * GET /api/v1/auth/me
   * Protected — returns the authenticated user's basic info
   */
  async me(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    sendSuccess(res, {
      userId: req.user.sub,
      citizenId: req.user.citizenId,
      roles: req.user.roles,
      permissions: req.user.permissions,
      sessionId: req.user.sessionId,
    });
  }
}

export const authController = new AuthController();
