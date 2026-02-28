import { Router } from 'express';
import { uploadMiddleware } from './document.service';
import { authenticate, checkTokenBlocklist } from '@middleware/auth.middleware';
import { requirePermission } from '@middleware/rbac.middleware';
import { uploadRateLimit } from '@middleware/rate-limit.middleware';
import { DocumentController } from './document.controller';

const router = Router();
const dc = new DocumentController();

router.use(authenticate, checkTokenBlocklist);

// POST /documents/upload — citizen uploads a file
router.post(
  '/upload',
  uploadRateLimit,
  requirePermission('documents:upload'),
  uploadMiddleware.single('file'),
  (req, res, next) => dc.upload(req, res).catch(next)
);

// GET /documents — list own documents
router.get(
  '/',
  requirePermission('documents:read:own'),
  (req, res, next) => dc.list(req, res).catch(next)
);

// GET /documents/:id/download — pre-signed URL
router.get(
  '/:id/download',
  requirePermission('documents:read:own'),
  (req, res, next) => dc.download(req, res).catch(next)
);

// DELETE /documents/:id
router.delete(
  '/:id',
  requirePermission('documents:upload'),
  (req, res, next) => dc.delete(req, res).catch(next)
);

export default router;
