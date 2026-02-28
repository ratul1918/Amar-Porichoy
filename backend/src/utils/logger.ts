import pino from 'pino';
import { config } from '@config/index';

export const logger = pino({
  level: config.LOG_LEVEL,
  ...(config.LOG_JSON
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }),
  base: {
    service: 'porichoy-api',
    env: config.NODE_ENV,
  },
  redact: {
    paths: [
      'password',
      'passwordHash',
      'newPassword',
      'currentPassword',
      'refreshToken',
      'accessToken',
      'tokenHash',
      '*.password',
      '*.passwordHash',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});
