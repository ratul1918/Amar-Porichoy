import Redis from 'ioredis';
import { config } from '@config/index';
import { logger } from '@utils/logger';

// ─────────────────────────────────────────────
// Redis client singleton — used for:
// • JWT blacklist (invalidated access tokens)
// • Rate limit counters (backed in Redis for multi-pod safety)
// • OTP temporary storage
// • Session state cache
// ─────────────────────────────────────────────

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  redisClient = new Redis(config.REDIS_URL, {
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DB,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 10) {
        logger.error('Redis: max retries exceeded');
        return null;
      }
      return Math.min(times * 200, 3000);
    },
    enableOfflineQueue: false,
    lazyConnect: true,
  });

  redisClient.on('connect', () => logger.info('Redis connected'));
  redisClient.on('error', (err: Error) => logger.error({ err }, 'Redis error'));
  redisClient.on('close', () => logger.warn('Redis connection closed'));

  return redisClient;
}

export async function connectRedis(): Promise<void> {
  const client = getRedisClient();
  await client.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis disconnected');
  }
}

// ─────────────────────────────────────────────
// Key namespacing helpers
// ─────────────────────────────────────────────

export const RedisKeys = {
  // JWT blocklist — key is SHA-256(token), value is '1', TTL = token remaining life
  tokenBlocklist: (tokenHash: string) => `blocklist:${tokenHash}`,

  // Rate limit — per-IP or per-identifier
  rateLimit: (key: string) => `rl:${key}`,

  // Login attempt counter per identifier
  loginAttempts: (identifier: string) => `login_attempts:${identifier}`,

  // OTP (5-minute TTL set in the store call)
  otp: (userId: string, purpose: string) => `otp:${userId}:${purpose}`,

  // Cached citizen profile — invalidated on update
  citizenProfile: (citizenId: string) => `citizen:${citizenId}`,

  // Active sessions counter for a user
  userSessions: (userId: string) => `sessions:${userId}`,
};
