import { prisma } from '@database/client';
import { AppError } from '@utils/errors';
import { ErrorCode, CreateApplicationDto, UpdateApplicationStatusDto, PaginationQuery } from '@app-types/index';
import { buildPaginationParams, buildPaginationMeta } from '@utils/response.utils';
import { generateTrackingNumber } from '@utils/crypto.utils';
import { writeAuditLog } from '@middleware/audit.middleware';
import { Prisma, ApplicationStatus, VerificationStatus } from '@prisma/client';

// ─────────────────────────────────────────────
// Application Service
// ─────────────────────────────────────────────

export class ApplicationService {
  private readonly BASE_SELECT = {
    id: true,
    citizenId: true,
    serviceId: true,
    trackingNumber: true,
    status: true,
    priority: true,
    submittedAt: true,
    processedAt: true,
    approvedAt: true,
    deliveredAt: true,
    dueDate: true,
    officerNotes: true,
    decisionReason: true,
    createdAt: true,
    updatedAt: true,
    service: {
      select: { code: true, nameBn: true, nameEn: true, category: true, processingDays: true, fees: true },
    },
    statusHistory: {
      select: { fromStatus: true, toStatus: true, changedAt: true, reason: true },
      orderBy: { changedAt: 'asc' as const },
    },
  };

  // ── Create application (draft) ───────────────

  async createApplication(userId: string, dto: CreateApplicationDto, requestId?: string) {
    // Validate service exists and is active
    const service = await prisma.serviceCatalog.findUnique({
      where: { id: dto.serviceId, isActive: true },
      select: { id: true, code: true, processingDays: true, requiresVerification: true },
    });
    if (!service) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Service not found or is currently unavailable');
    }

    // Verify citizen has a verified profile if service requires it
    const citizen = await prisma.citizen.findUnique({
      where: { userId },
      select: { id: true, verificationStatus: true },
    });
    if (!citizen) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen profile not found. Please complete your profile first.');
    }
    if (service.requiresVerification && citizen.verificationStatus !== VerificationStatus.VERIFIED) {
      throw AppError.badRequest(
        ErrorCode.CITIZEN_NOT_VERIFIED,
        'Your identity must be verified before applying for this service'
      );
    }

    // Calculate SLA due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + service.processingDays);

    const application = await prisma.application.create({
      data: {
        citizenId: citizen.id,
        serviceId: dto.serviceId,
        trackingNumber: generateTrackingNumber(service.code),
        status: ApplicationStatus.DRAFT,
        formData: dto.formData as unknown as Prisma.InputJsonValue,
        dueDate,
      },
      select: this.BASE_SELECT,
    });

    await writeAuditLog({
      userId,
      action: 'APPLICATION_CREATED',
      entityType: 'Application',
      entityId: application.id,
      newData: { serviceId: dto.serviceId, trackingNumber: application.trackingNumber },
      requestId,
    });

    return application;
  }

  // ── Submit application (draft → submitted) ───

  async submitApplication(userId: string, applicationId: string, requestId?: string) {
    const citizen = await prisma.citizen.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    const application = await prisma.application.findFirst({
      where: { id: applicationId, citizenId: citizen.id },
      select: { id: true, status: true, serviceId: true },
    });

    if (!application) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Application not found');
    }
    if (application.status !== ApplicationStatus.DRAFT) {
      throw AppError.conflict(ErrorCode.CONFLICT, 'Only DRAFT applications can be submitted');
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: ApplicationStatus.SUBMITTED,
          submittedAt: new Date(),
        },
        select: this.BASE_SELECT,
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus: ApplicationStatus.DRAFT,
          toStatus: ApplicationStatus.SUBMITTED,
          changedBy: userId,
          reason: 'Citizen submitted application',
        },
      });

      return app;
    });

    await writeAuditLog({
      userId,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'Application',
      entityId: applicationId,
      requestId,
    });

    return updated;
  }

  // ── Get citizen's own applications ──────────

  async getMyApplications(userId: string, query: PaginationQuery) {
    const citizen = await prisma.citizen.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!citizen) throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen profile not found');

    const { skip, take, orderBy } = buildPaginationParams(query);
    const where = { citizenId: citizen.id };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({ where, select: this.BASE_SELECT, skip, take, orderBy }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      meta: buildPaginationMeta(total, query.page ?? 1, query.limit ?? 20),
    };
  }

  // ── Get application by tracking number (public-ish) ──

  async getByTrackingNumber(trackingNumber: string) {
    const application = await prisma.application.findUnique({
      where: { trackingNumber },
      select: {
        ...this.BASE_SELECT,
        // Exclude sensitive form data for public tracking
        formData: false,
      },
    });
    if (!application) throw AppError.notFound(ErrorCode.NOT_FOUND, 'Application not found');
    return application;
  }

  // ── Officer: list all applications with filters ──

  async listApplications(
    query: {
      status?: ApplicationStatus;
      serviceId?: string;
      search?: string;
    } & PaginationQuery
  ) {
    const { skip, take, orderBy } = buildPaginationParams(query, 'submittedAt');
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.serviceId ? { serviceId: query.serviceId } : {}),
      ...(query.search
        ? { trackingNumber: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({ where, select: this.BASE_SELECT, skip, take, orderBy }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      meta: buildPaginationMeta(total, query.page ?? 1, query.limit ?? 20),
    };
  }

  // ── Officer: update application status ──────

  async updateStatus(
    applicationId: string,
    officerUserId: string,
    dto: UpdateApplicationStatusDto,
    requestId?: string
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true },
    });
    if (!application) throw AppError.notFound(ErrorCode.NOT_FOUND, 'Application not found');

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: dto.status,
          officerNotes: dto.officerNotes ?? undefined,
          decisionReason: dto.reason ?? undefined,
          processedBy: officerUserId,
          processedAt: (dto.status === ApplicationStatus.APPROVED || dto.status === ApplicationStatus.REJECTED)
            ? new Date()
            : undefined,
          approvedAt: dto.status === ApplicationStatus.APPROVED ? new Date() : undefined,
          approvedBy: dto.status === ApplicationStatus.APPROVED ? officerUserId : undefined,
          deliveredAt: dto.status === ApplicationStatus.DELIVERED ? new Date() : undefined,
        },
        select: this.BASE_SELECT,
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus: application.status,
          toStatus: dto.status,
          changedBy: officerUserId,
          reason: dto.reason ?? undefined,
        },
      });

      return app;
    });

    await writeAuditLog({
      userId: officerUserId,
      action: 'APPLICATION_STATUS_CHANGED',
      entityType: 'Application',
      entityId: applicationId,
      oldData: { status: application.status },
      newData: { status: dto.status },
      requestId,
    });

    return updated;
  }
}

export const applicationService = new ApplicationService();
