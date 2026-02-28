import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { config } from '@config/index';
import {
  securityHeaders,
  corsMiddleware,
  compressionMiddleware,
  errorHandler,
  notFoundHandler,
} from '@middleware/security.middleware';
import { globalRateLimit } from '@middleware/rate-limit.middleware';
import { requestIdMiddleware } from '@middleware/auth.middleware';

// Route modules
import authRoutes from '@modules/auth/auth.routes';
import citizenRoutes from '@modules/citizen/citizen.routes';
import applicationRoutes from '@modules/application/application.routes';
import documentRoutes from '@modules/document/document.routes';
import auditRoutes from '@modules/audit/audit.routes';

// ─────────────────────────────────────────────
// Express Application Factory
// ─────────────────────────────────────────────

export function createApp() {
  const app = express();

  // ── Trust proxy (for IP extraction behind nginx/ELB) ──
  app.set('trust proxy', 1);

  // ── Core middleware ──────────────────────────
  app.use(requestIdMiddleware);
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(compressionMiddleware);
  app.use(cookieParser());

  // Structured HTTP logging via morgan → pino
  if (config.NODE_ENV !== 'test') {
    app.use(
      morgan(':method :url :status :res[content-length] - :response-time ms', {
        stream: {
          write: (msg) => {
            const { logger } = require('@utils/logger');
            logger.info(msg.trim());
          },
        },
      })
    );
  }

  // JSON body parser — 5MB max
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // ── Global rate limit ────────────────────────
  app.use(globalRateLimit);

  // ── Health check (no auth, no rate limit) ────
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'porichoy-api',
      version: config.API_VERSION,
      timestamp: new Date().toISOString(),
    });
  });

  // ── API Routes ───────────────────────────────
  const apiBase = `/api/${config.API_VERSION}`;

  app.use(`${apiBase}/auth`, authRoutes);
  app.use(`${apiBase}/citizens`, citizenRoutes);
  app.use(`${apiBase}/applications`, applicationRoutes);
  app.use(`${apiBase}/documents`, documentRoutes);
  app.use(`${apiBase}/audit`, auditRoutes);

  // ── 404 & Error Handlers ─────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
