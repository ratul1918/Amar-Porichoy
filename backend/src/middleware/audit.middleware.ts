import { Request, Response, NextFunction } from 'express';
import { prisma } from '@database/client';
import { AuditAction, AuditLevel, Prisma } from '@prisma/client';
import { logger } from '@utils/logger';

// ─────────────────────────────────────────────
// Audit Middleware — automatically logs HTTP requests
// ─────────────────────────────────────────────

/**
 * Wraps res.json to capture the response body for audit logging.
 * Call after authenticate middleware for user-attributed logs.
 */
export function auditMiddleware(action: AuditAction, entityType?: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Capture start time
    const startTime = Date.now();
    const originalJson = res.json.bind(res);

    // Patch res.json temporarily
    res.json = function (body: unknown) {
      return originalJson(body);
    };

    // Run after response is sent
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const level: AuditLevel =
        res.statusCode >= 500 ? 'ERROR' :
        res.statusCode >= 400 ? 'WARNING' :
        'INFO';

      const entityId =
        (req.params['id'] ?? req.params['citizenId'] ?? req.params['applicationId']) as string | undefined;

      prisma.auditLog
        .create({
          data: {
            userId: req.user?.sub,
            action,
            level,
            entityType: entityType ?? undefined,
            entityId: entityId ?? undefined,
            ipAddress: req.ip ?? undefined,
            userAgent: req.headers['user-agent'] ?? undefined,
            requestId: req.requestId ?? undefined,
            metadata: ({
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
              durationMs: duration,
              query: sanitizeQueryParams(req.query as Record<string, unknown>),
            }) as unknown as Prisma.InputJsonValue,
          },
        })
        .catch((err: unknown) => logger.error({ err }, 'Failed to write audit log'));
    });

    next();
  };
}

// Strip sensitive query params before logging
function sanitizeQueryParams(query: Record<string, unknown>): Record<string, unknown> {
  const REDACTED_KEYS = new Set(['password', 'token', 'secret', 'key', 'otp']);
  return Object.fromEntries(
    Object.entries(query).map(([k, v]) => [k, REDACTED_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : v])
  );
}

// ─────────────────────────────────────────────
// Manual audit log helper (use in service layer)
// ─────────────────────────────────────────────

export async function writeAuditLog(params: {
  userId?: string;
  action: AuditAction;
  level?: AuditLevel;
  entityType?: string;
  entityId?: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: unknown;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        level: params.level ?? 'INFO',
        entityType: params.entityType,
        entityId: params.entityId,
        oldData: params.oldData as Prisma.InputJsonValue ?? undefined,
        newData: params.newData as Prisma.InputJsonValue ?? undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        requestId: params.requestId,
        metadata: params.metadata as Prisma.InputJsonValue ?? undefined,
      },
    });
  } catch (err) {
    logger.error({ err }, 'Failed to write audit log');
  }
}
