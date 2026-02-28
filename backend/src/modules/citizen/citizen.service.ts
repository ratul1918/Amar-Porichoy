import { prisma } from '@database/client';
import { getRedisClient, RedisKeys } from '@database/redis';
import { AppError } from '@utils/errors';
import { ErrorCode, CreateCitizenDto, UpdateCitizenDto, PaginationQuery } from '@app-types/index';
import { buildPaginationParams, buildPaginationMeta } from '@utils/response.utils';
import { writeAuditLog } from '@middleware/audit.middleware';
import { Prisma, VerificationStatus } from '@prisma/client';

// ─────────────────────────────────────────────
// Citizen Service
// ─────────────────────────────────────────────

export class CitizenService {
  // Fields exposed to citizen's own view
  private readonly CITIZEN_SELECT = {
    id: true,
    userId: true,
    nidNumber: true,
    birthRegNumber: true,
    nameBn: true,
    nameEn: true,
    fatherNameBn: true,
    fatherNameEn: true,
    motherNameBn: true,
    motherNameEn: true,
    spouseNameBn: true,
    dateOfBirth: true,
    gender: true,
    bloodGroup: true,
    presentAddress: true,
    permanentAddress: true,
    photoUrl: true,
    verificationStatus: true,
    verifiedAt: true,
    createdAt: true,
    updatedAt: true,
  };

  // ── Create citizen profile (after registration) ──

  async createCitizenProfile(
    userId: string,
    dto: CreateCitizenDto,
    requestId?: string
  ) {
    // Ensure user doesn't already have a citizen profile
    const exists = await prisma.citizen.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (exists) {
      throw AppError.conflict(ErrorCode.ALREADY_EXISTS, 'Citizen profile already exists');
    }

    // Check NID uniqueness
    if (dto.nidNumber) {
      const nidTaken = await prisma.citizen.findUnique({
        where: { nidNumber: dto.nidNumber },
        select: { id: true },
      });
      if (nidTaken) {
        throw AppError.conflict(ErrorCode.ALREADY_EXISTS, 'NID number is already registered');
      }
    }

    const citizen = await prisma.citizen.create({
      data: {
        userId,
        nidNumber: dto.nidNumber,
        birthRegNumber: dto.birthRegNumber,
        nameBn: dto.nameBn,
        nameEn: dto.nameEn,
        fatherNameBn: dto.fatherNameBn,
        fatherNameEn: dto.fatherNameEn,
        motherNameBn: dto.motherNameBn,
        motherNameEn: dto.motherNameEn,
        spouseNameBn: dto.spouseNameBn,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        presentAddress: dto.presentAddress as unknown as Prisma.InputJsonValue,
        permanentAddress: dto.permanentAddress as unknown as Prisma.InputJsonValue,
        verificationStatus: VerificationStatus.PENDING,
      },
      select: this.CITIZEN_SELECT,
    });

    await writeAuditLog({
      userId,
      action: 'CITIZEN_CREATED',
      entityType: 'Citizen',
      entityId: citizen.id,
      newData: { nidNumber: dto.nidNumber, nameBn: dto.nameBn },
      requestId,
    });

    return citizen;
  }

  // ── Get own profile ──────────────────────────

  async getMyProfile(userId: string) {
    // Try cache first
    const citizen = await prisma.citizen.findUnique({
      where: { userId },
      select: this.CITIZEN_SELECT,
    });

    if (!citizen) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen profile not found');
    }

    return citizen;
  }

  // ── Get citizen by ID (officer access) ──────

  async getCitizenById(citizenId: string) {
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
      select: this.CITIZEN_SELECT,
    });
    if (!citizen) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen not found');
    }
    return citizen;
  }

  // ── Search citizens (admin/officer) ─────────

  async searchCitizens(
    query: { search?: string; verificationStatus?: VerificationStatus } & PaginationQuery
  ) {
    const { skip, take, orderBy } = buildPaginationParams(query);

    const where: Prisma.CitizenWhereInput = {
      ...(query.verificationStatus ? { verificationStatus: query.verificationStatus } : {}),
      ...(query.search
        ? {
            OR: [
              { nameBn: { contains: query.search, mode: 'insensitive' } },
              { nameEn: { contains: query.search, mode: 'insensitive' } },
              { nidNumber: { contains: query.search } },
              { birthRegNumber: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [citizens, total] = await Promise.all([
      prisma.citizen.findMany({
        where,
        select: this.CITIZEN_SELECT,
        skip,
        take,
        orderBy,
      }),
      prisma.citizen.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return { citizens, meta: buildPaginationMeta(total, page, limit) };
  }

  // ── Update citizen profile (citizen self-update) ──

  async updateMyProfile(
    userId: string,
    dto: UpdateCitizenDto,
    requestId?: string
  ) {
    const current = await prisma.citizen.findUnique({
      where: { userId },
      select: { id: true, nameBn: true, presentAddress: true },
    });
    if (!current) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen profile not found');
    }

    // Citizens cannot self-update NID/birth-reg or names — those require officer approval
    const allowedFields = {
      spouseNameBn: dto.spouseNameBn,
      bloodGroup: dto.bloodGroup,
      presentAddress: dto.presentAddress as unknown as Prisma.InputJsonValue,
      permanentAddress: dto.permanentAddress as unknown as Prisma.InputJsonValue,
    };

    const updated = await prisma.citizen.update({
      where: { userId },
      data: allowedFields,
      select: this.CITIZEN_SELECT,
    });

    // Invalidate cache
    await getRedisClient().del(RedisKeys.citizenProfile(current.id));

    await writeAuditLog({
      userId,
      action: 'CITIZEN_UPDATED',
      entityType: 'Citizen',
      entityId: current.id,
      oldData: { spouseNameBn: current.nameBn },
      newData: allowedFields,
      requestId,
    });

    return updated;
  }

  // ── Officer: update verification status ─────

  async updateVerificationStatus(
    citizenId: string,
    officerUserId: string,
    status: VerificationStatus,
    rejectionReason?: string
  ) {
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
      select: { id: true, verificationStatus: true },
    });
    if (!citizen) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen not found');
    }

    const updated = await prisma.citizen.update({
      where: { id: citizenId },
      data: {
        verificationStatus: status,
        verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : undefined,
        verifiedBy: officerUserId,
        rejectionReason: rejectionReason ?? null,
      },
      select: this.CITIZEN_SELECT,
    });

    // Invalidate profile cache
    await getRedisClient().del(RedisKeys.citizenProfile(citizenId));

    await writeAuditLog({
      userId: officerUserId,
      action: 'NID_VERIFIED',
      entityType: 'Citizen',
      entityId: citizenId,
      oldData: { status: citizen.verificationStatus },
      newData: { status, rejectionReason },
    });

    return updated;
  }
}

export const citizenService = new CitizenService();
