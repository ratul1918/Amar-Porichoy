import { ErrorCodeType } from '@app-types/index';

// ─────────────────────────────────────────────
// Central AppError class
// ─────────────────────────────────────────────

export class AppError extends Error {
  public readonly code: ErrorCodeType;
  public readonly statusCode: number;
  public readonly details?: Record<string, string[]>;
  public readonly field?: string;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCodeType,
    message: string,
    statusCode = 500,
    options?: {
      details?: Record<string, string[]>;
      field?: string;
      isOperational?: boolean;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    if (options?.details !== undefined) this.details = options.details;
    if (options?.field !== undefined) this.field = options.field;
    this.isOperational = options?.isOperational ?? true;

    // Capture proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(code: ErrorCodeType, message: string, details?: Record<string, string[]>): AppError {
    return new AppError(code, message, 400, details !== undefined ? { details } : undefined);
  }

  static unauthorized(code: ErrorCodeType, message: string): AppError {
    return new AppError(code, message, 401);
  }

  static forbidden(code: ErrorCodeType, message: string): AppError {
    return new AppError(code, message, 403);
  }

  static notFound(code: ErrorCodeType, message: string): AppError {
    return new AppError(code, message, 404);
  }

  static conflict(code: ErrorCodeType, message: string): AppError {
    return new AppError(code, message, 409);
  }

  static tooManyRequests(code: ErrorCodeType, message: string): AppError {
    return new AppError(code, message, 429);
  }

  static internal(message = 'An internal error occurred'): AppError {
    return new AppError('INTERNAL_ERROR', message, 500, { isOperational: false });
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
