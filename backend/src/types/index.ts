import {
  AuditAction,
  AuditLevel,
  ApplicationStatus,
  DocumentType,
  Gender,
  RoleName,
  UserStatus,
  VerificationStatus,
} from '@prisma/client';

export {
  AuditAction,
  AuditLevel,
  ApplicationStatus,
  DocumentType,
  Gender,
  RoleName,
  UserStatus,
  VerificationStatus,
};

// ─────────────────────────────────────────────
// Auth / Token
// ─────────────────────────────────────────────

export interface JwtAccessPayload {
  sub: string;           // user id
  citizenId?: string;
  roles: RoleName[];
  permissions: string[];
  sessionId: string;
  type: 'access';
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string;
  sessionId: string;
  family: string;
  type: 'refresh';
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;       // seconds until access token expiry
  refreshExpiresIn: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtAccessPayload;
  requestId: string;
}

// ─────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    field?: string;
  };
  timestamp: string;
  requestId: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedApiSuccess<T> extends ApiSuccess<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─────────────────────────────────────────────
// Address
// ─────────────────────────────────────────────

export interface Address {
  division: string;
  divisionCode: string;
  district: string;
  districtCode: string;
  upazila: string;
  upazilaCode: string;
  union?: string;
  village?: string;
  holdingNumber?: string;
  postalCode: string;
}

// ─────────────────────────────────────────────
// DTOs — Auth
// ─────────────────────────────────────────────

export interface LoginDto {
  identifier: string;         // NID or birth reg number
  identifierType: 'nid' | 'birth_reg';
  dateOfBirth: string;        // YYYY-MM-DD
  password: string;
}

export interface RegisterDto {
  identifier: string;
  identifierType: 'nid' | 'birth_reg';
  phone: string;
  email?: string;
  password: string;
  dateOfBirth: string;
  nameBn: string;
  nameEn: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ─────────────────────────────────────────────
// DTOs — Citizen
// ─────────────────────────────────────────────

export interface CreateCitizenDto {
  nidNumber?: string;
  birthRegNumber?: string;
  nameBn: string;
  nameEn: string;
  fatherNameBn: string;
  fatherNameEn?: string;
  motherNameBn: string;
  motherNameEn?: string;
  spouseNameBn?: string;
  dateOfBirth: string;   // YYYY-MM-DD
  gender: Gender;
  bloodGroup?: string;
  presentAddress: Address;
  permanentAddress: Address;
}

export interface UpdateCitizenDto extends Partial<CreateCitizenDto> {}

// ─────────────────────────────────────────────
// DTOs — Application
// ─────────────────────────────────────────────

export interface CreateApplicationDto {
  serviceId: string;
  formData: Record<string, unknown>;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  reason?: string;
  officerNotes?: string;
}

// ─────────────────────────────────────────────
// Error codes
// ─────────────────────────────────────────────

export const ErrorCode = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_REUSE_DETECTED: 'TOKEN_REUSE_DETECTED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_NID: 'INVALID_NID',
  INVALID_BIRTH_REG: 'INVALID_BIRTH_REG',
  INVALID_PHONE: 'INVALID_PHONE',

  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Business
  CITIZEN_NOT_VERIFIED: 'CITIZEN_NOT_VERIFIED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  VIRUS_DETECTED: 'VIRUS_DETECTED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

// Role hierarchy (higher index = higher authority)
export const ROLE_HIERARCHY: RoleName[] = [
  'CITIZEN',
  'AGENT',
  'OFFICER',
  'SUPERVISOR',
  'ADMIN',
  'SUPER_ADMIN',
];

export const PERMISSIONS: Record<string, string[]> = {
  CITIZEN: [
    'profile:read',
    'profile:update',
    'applications:create',
    'applications:read:own',
    'documents:upload',
    'documents:read:own',
    'tracking:read:own',
  ],
  AGENT: [
    'citizens:read',
    'applications:read',
    'documents:read',
    'nid:verify',
  ],
  OFFICER: [
    'citizens:read',
    'citizens:update',
    'applications:read',
    'applications:process',
    'applications:approve',
    'applications:reject',
    'documents:read',
    'documents:verify',
    'nid:verify',
  ],
  SUPERVISOR: [
    'citizens:read',
    'citizens:update',
    'applications:read',
    'applications:process',
    'applications:approve',
    'applications:reject',
    'applications:reassign',
    'officers:manage',
    'reports:read',
  ],
  ADMIN: [
    'users:manage',
    'roles:assign',
    'services:manage',
    'reports:read',
    'reports:export',
    'audit:read',
    'system:config',
  ],
  SUPER_ADMIN: ['*'],
};
