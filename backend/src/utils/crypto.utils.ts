import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
  timingSafeEqual,
} from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '@config/index';

// ─────────────────────────────────────────────
// AES-256-GCM Field Encryption
// ─────────────────────────────────────────────
// Used for PII fields: NID numbers in API logs,
// NID registrar API responses in nid_verifications.

const ALGORITHM = 'aes-256-gcm';
const KEY_BYTES = 32;
const IV_BYTES = 12;   // 96-bit IV for GCM

function getEncryptionKey(): Buffer {
  return Buffer.from(config.ENCRYPTION_KEY, 'hex').subarray(0, KEY_BYTES);
}

/**
 * Encrypts plaintext using AES-256-GCM.
 * Returns: iv:encryptedHex:authTag (all hex, colon-separated)
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${tag.toString('hex')}`;
}

/**
 * Decrypts an AES-256-GCM encrypted value.
 * Input must be in the format produced by encrypt().
 */
export function decrypt(encryptedValue: string): string {
  const key = getEncryptionKey();
  const [ivHex, encryptedHex, tagHex] = encryptedValue.split(':');

  if (!ivHex || !encryptedHex || !tagHex) {
    throw new Error('Invalid encrypted value format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

// ─────────────────────────────────────────────
// Password Hashing (bcrypt)
// ─────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─────────────────────────────────────────────
// CSRF Token — cryptographically secure random
// ─────────────────────────────────────────────

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

// ─────────────────────────────────────────────
// OTP Generation (6-digit)
// ─────────────────────────────────────────────

export function generateOtp(): string {
  const bytes = randomBytes(4);
  const value = bytes.readUInt32BE(0) % 1_000_000;
  return value.toString().padStart(6, '0');
}

export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

export function verifyOtp(rawOtp: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashOtp(rawOtp), 'hex');
  const stored = Buffer.from(storedHash, 'hex');
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
}

// ─────────────────────────────────────────────
// Generic SHA-256
// ─────────────────────────────────────────────

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

// ─────────────────────────────────────────────
// Tracking Number Generator
// YYYY-SERVICECODE-XXXXXXXX (e.g. 2024-PSP-8F3A1C2D)
// ─────────────────────────────────────────────

export function generateTrackingNumber(serviceCode: string): string {
  const year = new Date().getFullYear();
  const suffix = randomBytes(4).toString('hex').toUpperCase();
  return `${year}-${serviceCode.substring(0, 5).toUpperCase()}-${suffix}`;
}
