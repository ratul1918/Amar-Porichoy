import { PrismaClient, Prisma } from '@prisma/client';
import { config } from '@config/index';
import { logger } from '@utils/logger';

// ─────────────────────────────────────────────
// Prisma client singleton with connection pool
// ─────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
    errorFormat: 'pretty',
  });

if (config.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Extend with soft-delete middleware
prisma.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<unknown>) => {
  // Soft delete: transform delete → update deletedAt
  if (params.model === 'User' && params.action === 'delete') {
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  }
  if (params.model === 'User' && params.action === 'deleteMany') {
    params.action = 'updateMany';
    params.args['data'] = { deletedAt: new Date() };
  }
  // Filter out soft-deleted users from all reads
  if (params.model === 'User') {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      params.args.where = { ...params.args.where, deletedAt: null };
    }
    if (params.action === 'findMany') {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
  }
  return next(params);
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected successfully');
  } catch (err) {
    logger.fatal({ err }, 'Failed to connect to PostgreSQL');
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('PostgreSQL disconnected');
}
