import { Router } from 'express';
import { applicationController } from './application.controller';
import { authenticate, checkTokenBlocklist } from '@middleware/auth.middleware';
import { requirePermission, requireRole } from '@middleware/rbac.middleware';

const router = Router();

// All routes require auth
router.use(authenticate, checkTokenBlocklist);

// Public-ish: track by tracking number (still requires auth to prevent enumeration)
router.get('/track/:trackingNumber', (req, res, next) =>
  applicationController.track(req, res).catch(next)
);

// Citizen routes
router.post(
  '/',
  requirePermission('applications:create'),
  (req, res, next) => applicationController.create(req, res).catch(next)
);

router.post(
  '/:id/submit',
  requirePermission('applications:create'),
  (req, res, next) => applicationController.submit(req, res).catch(next)
);

router.get(
  '/me',
  requirePermission('applications:read:own'),
  (req, res, next) => applicationController.getMyApplications(req, res).catch(next)
);

// Officer / Admin routes
router.get(
  '/',
  requireRole('OFFICER', 'SUPERVISOR', 'ADMIN', 'SUPER_ADMIN'),
  requirePermission('applications:read'),
  (req, res, next) => applicationController.listAll(req, res).catch(next)
);

router.patch(
  '/:id/status',
  requireRole('OFFICER', 'SUPERVISOR', 'ADMIN', 'SUPER_ADMIN'),
  requirePermission('applications:process'),
  (req, res, next) => applicationController.updateStatus(req, res).catch(next)
);

export default router;
