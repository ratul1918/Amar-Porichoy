import { Request, Response } from 'express';
import { citizenService } from './citizen.service';
import { createCitizenSchema, updateCitizenSchema, paginationSchema } from '@utils/validators';
import { sendSuccess, sendCreated, sendPaginated } from '@utils/response.utils';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';
import { VerificationStatus } from '@prisma/client';
import { z } from 'zod';

const verifyStatusSchema = z.object({
  status: z.nativeEnum(VerificationStatus),
  rejectionReason: z.string().max(2000).optional(),
});

export class CitizenController {
  /** POST /citizens/profile — citizen creates own profile */
  async createProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const dto = createCitizenSchema.parse(req.body);
    const citizen = await citizenService.createCitizenProfile(req.user.sub, dto, req.requestId);
    sendCreated(res, citizen, 'Profile created successfully');
  }

  /** GET /citizens/me — citizen fetches own profile */
  async getMyProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const citizen = await citizenService.getMyProfile(req.user.sub);
    sendSuccess(res, citizen);
  }

  /** PATCH /citizens/me — citizen updates allowed fields */
  async updateMyProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const dto = updateCitizenSchema.parse(req.body);
    const citizen = await citizenService.updateMyProfile(req.user.sub, dto, req.requestId);
    sendSuccess(res, citizen, 'Profile updated');
  }

  /** GET /citizens — officer/admin: list all citizens */
  async listCitizens(req: Request, res: Response): Promise<void> {
    const query = paginationSchema.parse(req.query);
    const search = typeof req.query['search'] === 'string' ? req.query['search'] : undefined;
    const vs = req.query['verificationStatus'] as VerificationStatus | undefined;

    const { citizens, meta } = await citizenService.searchCitizens({
      ...query,
      search,
      verificationStatus: vs,
    });
    sendPaginated(res, citizens, meta);
  }

  /** GET /citizens/:id — officer/admin: get specific citizen */
  async getCitizen(req: Request, res: Response): Promise<void> {
    const id = req.params['id'] ?? '';
    const citizen = await citizenService.getCitizenById(id);
    sendSuccess(res, citizen);
  }

  /** PATCH /citizens/:id/verify — officer: update verification status */
  async updateVerification(req: Request, res: Response): Promise<void> {
    if (!req.user) throw AppError.unauthorized(ErrorCode.UNAUTHORIZED, 'Not authenticated');
    const id = req.params['id'] ?? '';
    const { status, rejectionReason } = verifyStatusSchema.parse(req.body);
    const citizen = await citizenService.updateVerificationStatus(
      id,
      req.user.sub,
      status,
      rejectionReason
    );
    sendSuccess(res, citizen, `Verification status updated to ${status}`);
  }
}

export const citizenController = new CitizenController();
