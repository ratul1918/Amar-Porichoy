import { createApp } from './app';
import { config } from '@config/index';
import { connectDatabase, disconnectDatabase } from '@database/client';
import { connectRedis, disconnectRedis } from '@database/redis';
import { logger } from '@utils/logger';
import http from 'http';

// ─────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  logger.info(`Starting Porichoy API [${config.NODE_ENV}]`);

  // Connect to PostgreSQL
  await connectDatabase();

  // Connect to Redis
  await connectRedis();

  // Create Express app
  const app = createApp();
  const server = http.createServer(app);

  // ── Graceful shutdown ───────────────────────

  function shutdown(signal: string) {
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDatabase();
      await disconnectRedis();
      logger.info('All connections closed. Exiting.');
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown hangs
    setTimeout(() => {
      logger.fatal('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught exception — shutting down');
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Unhandled rejection — shutting down');
    shutdown('unhandledRejection');
  });

  // ── Start listening ─────────────────────────

  server.listen(config.PORT, () => {
    logger.info(
      `🇧🇩 Porichoy API listening on http://localhost:${config.PORT}/api/${config.API_VERSION}`
    );
    logger.info(`Health check: http://localhost:${config.PORT}/health`);
  });
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
