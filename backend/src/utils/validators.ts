import { z } from 'zod';

// ─────────────────────────────────────────────
// Bangladesh NID Validators
// ─────────────────────────────────────────────

// NID: 10 digits (old) or 17 digits (new smart NID)
const NID_REGEX_10 = /^\d{10}$/;
const NID_REGEX_17 = /^\d{17}$/;

export function isValidNid(nid: string): boolean {
  return NID_REGEX_10.test(nid) || NID_REGEX_17.test(nid);
}

// Birth Registration Number: 17 digits
const BIRTH_REG_REGEX = /^\d{17}$/;

export function isValidBirthReg(birthReg: string): boolean {
  return BIRTH_REG_REGEX.test(birthReg);
}

// Bangladesh phone: +8801XXXXXXXXX or 01XXXXXXXXX
const BD_PHONE_REGEX = /^(?:\+880|880|0)1[3-9]\d{8}$/;

export function isValidBdPhone(phone: string): boolean {
  return BD_PHONE_REGEX.test(phone.replace(/\s/g, ''));
}

// Normalize BD phone to E.164 (+8801XXXXXXXXX)
export function normalizeBdPhone(phone: string): string {
  const clean = phone.replace(/\s/g, '');
  if (clean.startsWith('+880')) return clean;
  if (clean.startsWith('880')) return `+${clean}`;
  if (clean.startsWith('0')) return `+880${clean.slice(1)}`;
  return `+880${clean}`;
}

// ─────────────────────────────────────────────
// Zod Schemas (reusable across the codebase)
// ─────────────────────────────────────────────

export const zUuid = z.string().uuid();
export const zDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');
export const zPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const zNid = z.string().refine(isValidNid, {
  message: 'NID must be 10 or 17 digits',
});

export const zBirthReg = z.string().refine(isValidBirthReg, {
  message: 'Birth Registration Number must be 17 digits',
});

export const zBdPhone = z.string().refine(isValidBdPhone, {
  message: 'Please enter a valid Bangladesh phone number',
});

export const zAddress = z.object({
  division: z.string().min(1),
  divisionCode: z.string().min(1),
  district: z.string().min(1),
  districtCode: z.string().min(1),
  upazila: z.string().min(1),
  upazilaCode: z.string().min(1),
  union: z.string().optional(),
  village: z.string().optional(),
  holdingNumber: z.string().optional(),
  postalCode: z.string().min(4).max(10),
});

// ─────────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  identifierType: z.enum(['nid', 'birth_reg']),
  dateOfBirth: zDateString,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  identifier: z.string().min(1),
  identifierType: z.enum(['nid', 'birth_reg']),
  phone: zBdPhone,
  email: z.string().email().optional(),
  password: zPassword,
  dateOfBirth: zDateString,
  nameBn: z.string().min(2).max(200),
  nameEn: z.string().min(2).max(200).regex(/^[a-zA-Z\s.'-]+$/, 'English name only'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: zPassword,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ─────────────────────────────────────────────
// Citizen Schemas
// ─────────────────────────────────────────────

export const createCitizenSchema = z.object({
  nidNumber: zNid.optional(),
  birthRegNumber: zBirthReg.optional(),
  nameBn: z.string().min(2).max(200),
  nameEn: z.string().min(2).max(200).regex(/^[a-zA-Z\s.'-]+$/),
  fatherNameBn: z.string().min(2).max(200),
  fatherNameEn: z.string().max(200).optional(),
  motherNameBn: z.string().min(2).max(200),
  motherNameEn: z.string().max(200).optional(),
  spouseNameBn: z.string().max(200).optional(),
  dateOfBirth: zDateString,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  presentAddress: zAddress,
  permanentAddress: zAddress,
}).refine(
  (data) => data.nidNumber ?? data.birthRegNumber,
  { message: 'Either NID number or Birth Registration Number must be provided' }
);

export const updateCitizenSchema = z.object({
  nidNumber: zNid.optional(),
  birthRegNumber: zBirthReg.optional(),
  nameBn: z.string().min(2).max(200).optional(),
  nameEn: z.string().min(2).max(200).regex(/^[a-zA-Z\s.'-]+$/).optional(),
  fatherNameBn: z.string().min(2).max(200).optional(),
  fatherNameEn: z.string().max(200).optional(),
  motherNameBn: z.string().min(2).max(200).optional(),
  motherNameEn: z.string().max(200).optional(),
  spouseNameBn: z.string().max(200).optional(),
  dateOfBirth: zDateString.optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  presentAddress: zAddress.optional(),
  permanentAddress: zAddress.optional(),
});

// ─────────────────────────────────────────────
// Application Schemas
// ─────────────────────────────────────────────

export const createApplicationSchema = z.object({
  serviceId: zUuid,
  formData: z.record(z.unknown()),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS',
    'PROCESSING', 'APPROVED', 'REJECTED', 'CANCELLED', 'DELIVERED',
  ]),
  reason: z.string().max(2000).optional(),
  officerNotes: z.string().max(5000).optional(),
});

// ─────────────────────────────────────────────
// Pagination Schema
// ─────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─────────────────────────────────────────────
// XSS / SQL injection mitigation
// ─────────────────────────────────────────────

const DANGEROUS_CHARS = /[<>"'`&;\\]/g;

export function sanitizeString(input: string): string {
  return input.replace(DANGEROUS_CHARS, '').trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
