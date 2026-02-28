import { Request, Response } from 'express';
import { documentService } from './document.service';
import { sendSuccess, sendCreated } from '@utils/response.utils';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';
import { DocumentType } from '@prisma/client';
import { z } from 'zod';

const uploadQuerySchema = z.object({
  documentType: z.nativeEnum(DocumentType),
  applicationId: z.string().uuid().optional(),
});

export class DocumentController {
  /** POST /documents/upload */
  async upload(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    const file = req.file;
    if (!file) throw AppError.badRequest(ErrorCode.VALIDATION_ERROR, 'No file provided');

    const params = uploadQuerySchema.parse(req.body);
    const doc = await documentService.uploadDocument(req.user.sub, file, params, req.requestId);
    sendCreated(res, doc, 'Document uploaded successfully. Virus scan in progress.');
  }

  /** GET /documents/:id/download */
  async download(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    const id = req.params['id'] ?? '';
    const url = await documentService.getDownloadUrl(req.user.sub, id);
    sendSuccess(res, { downloadUrl: url, expiresInSeconds: 300 });
  }

  /** GET /documents — list own documents */
  async list(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    const citizen = (await import('@database/client')).prisma.citizen.findUnique({
      where: { userId: req.user.sub },
      select: { id: true },
    });
    const c = await citizen;
    if (!c) throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen profile not found');

    const applicationId = req.query['applicationId'] as string | undefined;
    const docs = await documentService.listDocuments(c.id, applicationId);
    sendSuccess(res, docs);
  }

  /** DELETE /documents/:id */
  async delete(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');

    const id = req.params['id'] ?? '';
    await documentService.deleteDocument(req.user.sub, id, req.requestId);
    sendSuccess(res, null, 'Document deleted');
  }
}

export const documentController = new DocumentController();
