import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate, checkTokenBlocklist } from '@middleware/auth.middleware';
import { authRateLimit, sensitiveRateLimit } from '@middleware/rate-limit.middleware';

const router = Router();

// ─────────────────────────────────────────────
// Public routes
// ─────────────────────────────────────────────

// POST /auth/register
router.post('/register', authRateLimit, (req, res, next) => {
  authController.register(req, res).catch(next);
});

// POST /auth/login
router.post('/login', authRateLimit, (req, res, next) => {
  authController.login(req, res).catch(next);
});

// POST /auth/refresh  (uses httpOnly cookie by default)
router.post('/refresh', sensitiveRateLimit, (req, res, next) => {
  authController.refresh(req, res).catch(next);
});

// ─────────────────────────────────────────────
// Protected routes
// ─────────────────────────────────────────────

// POST /auth/logout
router.post(
  '/logout',
  authenticate,
  checkTokenBlocklist,
  (req, res, next) => {
    authController.logout(req, res).catch(next);
  }
);

// POST /auth/change-password
router.post(
  '/change-password',
  sensitiveRateLimit,
  authenticate,
  checkTokenBlocklist,
  (req, res, next) => {
    authController.changePassword(req, res).catch(next);
  }
);

// GET /auth/me
router.get(
  '/me',
  authenticate,
  checkTokenBlocklist,
  (req, res, next) => {
    authController.me(req, res).catch(next);
  }
);

export default router;
