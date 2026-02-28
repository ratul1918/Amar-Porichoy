import { prisma } from '@database/client';
import { getRedisClient, RedisKeys } from '@database/redis';
import { config } from '@config/index';
import { hashPassword, verifyPassword } from '@utils/crypto.utils';
import {
  verifyRefreshToken,
  hashToken,
  generateTokenFamily,
  buildTokenPair,
  getAccessTokenExpiry,
} from '@utils/jwt.utils';
import { buildPermissionsForRoles } from '@middleware/rbac.middleware';
import { AppError } from '@utils/errors';
import { ErrorCode, LoginDto, RegisterDto, TokenPair, RoleName } from '@app-types/index';
import { writeAuditLog } from '@middleware/audit.middleware';
import { logger } from '@utils/logger';
import { UserStatus } from '@prisma/client';

// ─────────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────────

export class AuthService {
  // ── Register ────────────────────────────────

  async register(dto: RegisterDto, ipAddress?: string): Promise<{ userId: string }> {
    // Check for duplicate identifier
    const existingUser = await prisma.user.findUnique({
      where: { identifier: dto.identifier },
      select: { id: true },
    });
    if (existingUser) {
      throw AppError.conflict(
        ErrorCode.ALREADY_EXISTS,
        'An account with this identifier already exists'
      );
    }

    // Check phone uniqueness
    if (dto.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: dto.phone },
        select: { id: true },
      });
      if (existingPhone) {
        throw AppError.conflict(ErrorCode.ALREADY_EXISTS, 'Phone number is already registered');
      }
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          identifier: dto.identifier,
          identifierType: dto.identifierType,
          phone: dto.phone,
          email: dto.email,
          passwordHash,
          status: UserStatus.PENDING_VERIFICATION,
        },
        select: { id: true },
      });

      // Assign default CITIZEN role
      const citizenRole = await tx.role.findUniqueOrThrow({
        where: { name: 'CITIZEN' },
        select: { id: true },
      });

      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: citizenRole.id,
        },
      });

      return newUser;
    });

    await writeAuditLog({
      userId: user.id,
      action: 'CITIZEN_CREATED',
      entityType: 'User',
      entityId: user.id,
      ipAddress,
      metadata: { identifier: dto.identifier, identifierType: dto.identifierType },
    });

    logger.info({ userId: user.id }, 'New user registered');
    return { userId: user.id };
  }

  // ── Login ────────────────────────────────────

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<TokenPair> {
    const redis = getRedisClient();

    // Progressive lockout check via Redis
    const lockKey = RedisKeys.loginAttempts(dto.identifier);
    const attempts = parseInt((await redis.get(lockKey)) ?? '0', 10);

    if (attempts >= config.MAX_FAILED_ATTEMPTS) {
      await writeAuditLog({
        action: 'ACCOUNT_LOCKED',
        ipAddress,
        metadata: { identifier: dto.identifier, attempts },
      });
      throw AppError.tooManyRequests(
        ErrorCode.ACCOUNT_LOCKED,
        'Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.'
      );
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { identifier: dto.identifier, deletedAt: null },
      include: {
        userRoles: {
          include: {
            role: { select: { name: true, permissions: true } },
          },
        },
        citizen: { select: { id: true } },
      },
    });

    // Timing-safe path: always run password hash compare even when user not found
    const dummyHash = '$2b$12$dummyhashfortimingequalityVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    const passwordMatch = user
      ? await verifyPassword(dto.password, user.passwordHash)
      : await verifyPassword(dto.password, dummyHash);

    if (!user || !passwordMatch) {
      // Increment Redis attempt counter
      await redis.incr(lockKey);
      await redis.expire(lockKey, Math.floor(config.LOGIN_LOCKOUT_DURATION_MS / 1000));

      await writeAuditLog({
        userId: user?.id,
        action: 'LOGIN_FAILED',
        ipAddress,
        metadata: { identifier: dto.identifier },
      });

      throw AppError.unauthorized(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials');
    }

    // Account status check
    if (user.status === UserStatus.LOCKED) {
      throw AppError.unauthorized(ErrorCode.ACCOUNT_LOCKED, 'Account is locked. Contact support.');
    }
    if (user.status === UserStatus.DEACTIVATED || user.status === UserStatus.INACTIVE) {
      throw AppError.unauthorized(ErrorCode.ACCOUNT_INACTIVE, 'Account is deactivated.');
    }

    // Date of birth verification (adds security layer similar to PIN)
    if (user.citizen) {
      const citizen = await prisma.citizen.findUnique({
        where: { id: user.citizen.id },
        select: { dateOfBirth: true },
      });
      if (citizen) {
        const providedDob = new Date(dto.dateOfBirth).toISOString().split('T')[0];
        const storedDob = citizen.dateOfBirth.toISOString().split('T')[0];
        if (providedDob !== storedDob) {
          await redis.incr(lockKey);
          throw AppError.unauthorized(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials');
        }
      }
    }

    // Clear failed attempts on successful login
    await redis.del(lockKey);

    // Build role/permission lists
    const roles = user.userRoles.map((ur) => ur.role.name as RoleName);
    const permissions = buildPermissionsForRoles(roles);

    // Create session
    const tokenFamily = generateTokenFamily();
    const sessionExpiresAt = new Date(
      Date.now() + config.SESSION_ABSOLUTE_TTL_HOURS * 60 * 60 * 1000
    );

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        tokenFamily,
        ipAddress: ipAddress ?? '0.0.0.0',
        userAgent: userAgent ?? '',
        expiresAt: sessionExpiresAt,
      },
      select: { id: true },
    });

    // Build token pair
    const tokenPair = buildTokenPair(
      {
        sub: user.id,
        citizenId: user.citizen?.id,
        roles,
        permissions,
        sessionId: session.id,
      },
      {
        sub: user.id,
        sessionId: session.id,
        family: tokenFamily,
      }
    );

    // Persist refresh token hash
    const refreshTokenHash = hashToken(tokenPair.refreshToken);
    const refreshPayload = verifyRefreshToken(tokenPair.refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        tokenHash: refreshTokenHash,
        family: tokenFamily,
        expiresAt: new Date((refreshPayload.exp ?? 0) * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        failedAttempts: 0,
      },
    });

    await writeAuditLog({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'Session',
      entityId: session.id,
      ipAddress,
      userAgent,
      metadata: { roles },
    });

    return tokenPair;
  }

  // ── Refresh Token ────────────────────────────

  async refreshTokens(rawRefreshToken: string, ipAddress?: string): Promise<TokenPair> {
    const payload = verifyRefreshToken(rawRefreshToken);
    const tokenHash = hashToken(rawRefreshToken);

    // Look up stored token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            userRoles: { include: { role: { select: { name: true } } } },
            citizen: { select: { id: true } },
          },
        },
        session: { select: { id: true, expiresAt: true, revokedAt: true } },
      },
    });

    // Token reuse detection: token not found means it was already used → revoke entire family
    if (!storedToken) {
      await this.revokeFamily(payload.family, 'TOKEN_REUSE');
      await writeAuditLog({
        userId: payload.sub,
        action: 'LOGIN_FAILED',
        ipAddress,
        metadata: { reason: 'refresh_token_reuse', family: payload.family },
      });
      throw AppError.unauthorized(ErrorCode.TOKEN_REUSE_DETECTED, 'Token reuse detected. All sessions invalidated.');
    }

    // Check if session is revoked / expired
    if (storedToken.session.revokedAt || storedToken.session.expiresAt < new Date()) {
      throw AppError.unauthorized(ErrorCode.TOKEN_EXPIRED, 'Session expired. Please login again.');
    }

    // Check token revocation
    if (storedToken.revokedAt) {
      throw AppError.unauthorized(ErrorCode.TOKEN_INVALID, 'Refresh token revoked.');
    }

    // Mark token as used + rotated
    await prisma.refreshToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    });

    const { user } = storedToken;
    const roles = user.userRoles.map((ur) => ur.role.name as RoleName);
    const permissions = buildPermissionsForRoles(roles);

    // Issue new token pair
    const newTokenPair = buildTokenPair(
      {
        sub: user.id,
        citizenId: user.citizen?.id,
        roles,
        permissions,
        sessionId: storedToken.session.id,
      },
      {
        sub: user.id,
        sessionId: storedToken.session.id,
        family: payload.family,
      }
    );

    // Persist new refresh token + link to previous
    const newRefreshHash = hashToken(newTokenPair.refreshToken);
    const newRefreshPayload = verifyRefreshToken(newTokenPair.refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        sessionId: storedToken.session.id,
        tokenHash: newRefreshHash,
        family: payload.family,
        expiresAt: new Date((newRefreshPayload.exp ?? 0) * 1000),
        replacedBy: storedToken.id,
      },
    });

    // Update session last active
    await prisma.session.update({
      where: { id: storedToken.session.id },
      data: { lastActiveAt: new Date() },
    });

    await writeAuditLog({
      userId: user.id,
      action: 'TOKEN_REFRESHED',
      entityType: 'Session',
      entityId: storedToken.session.id,
      ipAddress,
      metadata: { family: payload.family },
    });

    return newTokenPair;
  }

  // ── Logout ───────────────────────────────────

  async logout(
    userId: string,
    sessionId: string,
    rawAccessToken: string,
    revokeAll = false
  ): Promise<void> {
    const redis = getRedisClient();

    // Blocklist the current access token until it expires
    const ttlMs = getAccessTokenExpiry(rawAccessToken);
    if (ttlMs > 0) {
      const tokenHash = hashToken(rawAccessToken);
      await redis.setex(
        RedisKeys.tokenBlocklist(tokenHash),
        Math.ceil(ttlMs / 1000),
        '1'
      );
    }

    if (revokeAll) {
      // Revoke all sessions for this user
      await prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: 'user_logout_all' },
      });
    } else {
      // Revoke only the current session
      await prisma.session.update({
        where: { id: sessionId },
        data: { revokedAt: new Date(), revokedReason: 'user_logout' },
      });
    }

    await writeAuditLog({
      userId,
      action: 'LOGOUT',
      entityType: 'Session',
      entityId: sessionId,
      metadata: { revokeAll },
    });
  }

  // ── Change Password ──────────────────────────

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ipAddress?: string
  ): Promise<void> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { passwordHash: true },
    });

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      throw AppError.unauthorized(ErrorCode.INVALID_CREDENTIALS, 'Current password is incorrect');
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, mustChangePassword: false },
    });

    // Revoke all sessions except current (force re-login)
    await prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'password_changed' },
    });

    await writeAuditLog({
      userId,
      action: 'PASSWORD_CHANGED',
      entityType: 'User',
      entityId: userId,
      ipAddress,
    });
  }

  // ── Internal: revoke token family ───────────

  private async revokeFamily(family: string, reason: string): Promise<void> {
    await prisma.session.updateMany({
      where: { tokenFamily: family },
      data: { revokedAt: new Date(), revokedReason: reason },
    });
  }
}

export const authService = new AuthService();
