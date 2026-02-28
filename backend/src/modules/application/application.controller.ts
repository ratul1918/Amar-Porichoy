import { Request, Response } from 'express';
import { applicationService } from './application.service';
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  paginationSchema,
} from '@utils/validators';
import { sendSuccess, sendCreated, sendPaginated } from '@utils/response.utils';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationController {
  /** POST /applications */
  async create(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const dto = createApplicationSchema.parse(req.body);
    const app = await applicationService.createApplication(req.user.sub, dto, req.requestId);
    sendCreated(res, app, 'Application created as draft');
  }

  /** POST /applications/:id/submit */
  async submit(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const id = req.params['id'] ?? '';
    const app = await applicationService.submitApplication(req.user.sub, id, req.requestId);
    sendSuccess(res, app, 'Application submitted successfully');
  }

  /** GET /applications/me */
  async getMyApplications(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const query = paginationSchema.parse(req.query);
    const { applications, meta } = await applicationService.getMyApplications(
      req.user.sub,
      query
    );
    sendPaginated(res, applications, meta);
  }

  /** GET /applications/track/:trackingNumber — public */
  async track(req: Request, res: Response): Promise<void> {
    const tracking = req.params['trackingNumber'] ?? '';
    const app = await applicationService.getByTrackingNumber(tracking);
    sendSuccess(res, app);
  }

  /** GET /applications — officer */
  async listAll(req: Request, res: Response): Promise<void> {
    const query = paginationSchema.parse(req.query);
    const status = req.query['status'] as ApplicationStatus | undefined;
    const serviceId = req.query['serviceId'] as string | undefined;
    const search = req.query['search'] as string | undefined;
    const { applications, meta } = await applicationService.listApplications({
      ...query,
      status,
      serviceId,
      search,
    });
    sendPaginated(res, applications, meta);
  }

  /** PATCH /applications/:id/status — officer */
  async updateStatus(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const id = req.params['id'] ?? '';
    const dto = updateApplicationStatusSchema.parse(req.body);
    const app = await applicationService.updateStatus(id, req.user.sub, dto, req.requestId);
    sendSuccess(res, app, `Status updated to ${dto.status}`);
  }
}

export const applicationController = new ApplicationController();
