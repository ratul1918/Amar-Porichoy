import { Router } from 'express';
import { Request, Response } from 'express';
import { prisma } from '@database/client';
import { authenticate, checkTokenBlocklist } from '@middleware/auth.middleware';
import { requireRole, requirePermission } from '@middleware/rbac.middleware';
import { paginationSchema } from '@utils/validators';
import { sendPaginated } from '@utils/response.utils';
import { buildPaginationParams, buildPaginationMeta } from '@utils/response.utils';
import { AuditAction, AuditLevel } from '@prisma/client';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Audit Controller (inline — simple enough)
// ─────────────────────────────────────────────

const auditQuerySchema = paginationSchema.extend({
  userId: z.string().uuid().optional(),
  action: z.nativeEnum(AuditAction).optional(),
  level: z.nativeEnum(AuditLevel).optional(),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

async function listAuditLogs(req: Request, res: Response): Promise<void> {
  const query = auditQuerySchema.parse(req.query);
  const { skip, take, orderBy } = buildPaginationParams(query, 'timestamp');

  const where = {
    ...(query.userId ? { userId: query.userId } : {}),
    ...(query.action ? { action: query.action } : {}),
    ...(query.level ? { level: query.level } : {}),
    ...(query.entityType ? { entityType: query.entityType } : {}),
    ...(query.entityId ? { entityId: query.entityId } : {}),
    ...(query.from || query.to
      ? {
          timestamp: {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(query.to) } : {}),
          },
        }
      : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        userId: true,
        action: true,
        level: true,
        entityType: true,
        entityId: true,
        ipAddress: true,
        requestId: true,
        metadata: true,
        timestamp: true,
      },
      skip,
      take,
      orderBy,
    }),
    prisma.auditLog.count({ where }),
  ]);

  sendPaginated(res, logs, buildPaginationMeta(total, query.page ?? 1, query.limit ?? 20));
}

// ─────────────────────────────────────────────
// Audit Routes
// ─────────────────────────────────────────────

const router = Router();

router.use(authenticate, checkTokenBlocklist);

router.get(
  '/',
  requireRole('ADMIN', 'SUPER_ADMIN'),
  requirePermission('audit:read'),
  (req, res, next) => listAuditLogs(req, res).catch(next)
);

export default router;
