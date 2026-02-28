import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  API_VERSION: z.string().default('v1'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DB_POOL_MIN: z.coerce.number().default(2),
  DB_POOL_MAX: z.coerce.number().default(20),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(64, 'JWT_ACCESS_SECRET must be >= 64 chars'),
  JWT_REFRESH_SECRET: z.string().min(64, 'JWT_REFRESH_SECRET must be >= 64 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Crypto
  ENCRYPTION_KEY: z.string().length(64, 'ENCRYPTION_KEY must be 64 hex chars (32 bytes)'),
  FIELD_ENCRYPTION_KEY: z.string().length(64, 'FIELD_ENCRYPTION_KEY must be 64 hex chars'),

  // Object Storage (MinIO / S3-compatible)
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET_DOCUMENTS: z.string().default('porichoy-documents'),
  S3_BUCKET_PHOTOS: z.string().default('porichoy-photos'),
  S3_REGION: z.string().default('ap-southeast-1'),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true), // true for MinIO

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().default(5),
  LOGIN_LOCKOUT_DURATION_MS: z.coerce.number().default(15 * 60 * 1000),
  MAX_FAILED_ATTEMPTS: z.coerce.number().default(5),

  // File upload
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  ALLOWED_MIME_TYPES: z.string().default('image/jpeg,image/png,image/webp,application/pdf'),

  // External services
  NID_VERIFICATION_API_URL: z.string().optional(),
  NID_VERIFICATION_API_KEY: z.string().optional(),
  SMS_PROVIDER_URL: z.string().optional(),
  SMS_API_KEY: z.string().optional(),
  EMAIL_SMTP_HOST: z.string().optional(),
  EMAIL_SMTP_PORT: z.coerce.number().default(587),
  EMAIL_SMTP_USER: z.string().optional(),
  EMAIL_SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@porichoy.gov.bd'),

  // Security
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  OTP_EXPIRES_IN_MINUTES: z.coerce.number().default(10),
  SESSION_ABSOLUTE_TTL_HOURS: z.coerce.number().default(8),

  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  LOG_JSON: z.coerce.boolean().default(false),
});

function loadConfig() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();
export type Config = typeof config;
