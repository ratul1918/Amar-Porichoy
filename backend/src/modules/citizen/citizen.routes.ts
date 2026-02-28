import { Router } from 'express';
import { citizenController } from './citizen.controller';
import { authenticate, checkTokenBlocklist } from '@middleware/auth.middleware';
import { requirePermission, requireRole } from '@middleware/rbac.middleware';
import { auditMiddleware } from '@middleware/audit.middleware';

const router = Router();

// All citizen routes require authentication
router.use(authenticate, checkTokenBlocklist);

// ── Citizen's own profile ────────────────────
router.post(
  '/profile',
  requirePermission('profile:update'),
  auditMiddleware('CITIZEN_CREATED', 'Citizen'),
  (req, res, next) => citizenController.createProfile(req, res).catch(next)
);

router.get(
  '/me',
  requirePermission('profile:read'),
  auditMiddleware('CITIZEN_VIEWED', 'Citizen'),
  (req, res, next) => citizenController.getMyProfile(req, res).catch(next)
);

router.patch(
  '/me',
  requirePermission('profile:update'),
  auditMiddleware('CITIZEN_UPDATED', 'Citizen'),
  (req, res, next) => citizenController.updateMyProfile(req, res).catch(next)
);

// ── Officer / Admin routes ───────────────────
router.get(
  '/',
  requireRole('OFFICER', 'SUPERVISOR', 'ADMIN', 'SUPER_ADMIN'),
  requirePermission('citizens:read'),
  (req, res, next) => citizenController.listCitizens(req, res).catch(next)
);

router.get(
  '/:id',
  requireRole('OFFICER', 'SUPERVISOR', 'ADMIN', 'SUPER_ADMIN'),
  requirePermission('citizens:read'),
  auditMiddleware('CITIZEN_VIEWED', 'Citizen'),
  (req, res, next) => citizenController.getCitizen(req, res).catch(next)
);

router.patch(
  '/:id/verify',
  requireRole('OFFICER', 'SUPERVISOR', 'ADMIN', 'SUPER_ADMIN'),
  requirePermission('citizens:update'),
  auditMiddleware('NID_VERIFIED', 'Citizen'),
  (req, res, next) => citizenController.updateVerification(req, res).catch(next)
);

export default router;
