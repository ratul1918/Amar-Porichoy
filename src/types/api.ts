/**
 * Shared API response envelope and common utility types.
 */

/** Standard API envelope — every backend response is wrapped in this. */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly meta?: ResponseMeta;
}

export interface ApiError {
  readonly code: string;             // e.g. "IDENTITY_NOT_FOUND"
  readonly message: string;          // user-safe message
  readonly details?: string;         // developer details (strip in prod logs)
  readonly requestId: string;        // for support correlation
}

export interface ResponseMeta {
  readonly page?: number;
  readonly perPage?: number;
  readonly total?: number;
  readonly requestId: string;
  readonly timestamp: string;        // ISO 8601
}

/** Generic paginated list response */
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly perPage: number;
  readonly total: number;
  readonly totalPages: number;
}

/** Bilingual string pair — used everywhere UI text is shown */
export interface BilingualText {
  readonly bn: string;
  readonly en: string;
}

/** Rate limit result */
export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetAt: number;          // unix epoch ms
}

/** Audit log entry */
export interface AuditEntry {
  readonly eventType: AuditEventType;
  readonly actorId?: string;
  readonly actorRole?: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly outcome: 'success' | 'failure';
  readonly metadata?: Record<string, string | number | boolean>;
  readonly timestamp: string;        // ISO 8601
  readonly sessionId?: string;
  readonly ipHash?: string;          // hashed — never store raw IP in frontend
  readonly userAgentHash?: string;
}

export type AuditEventType =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_failed'
  | 'auth.session_expired'
  | 'identity.viewed'
  | 'application.created'
  | 'application.viewed'
  | 'application.submitted'
  | 'service.accessed';

/** Form field validation state */
export interface FieldValidation {
  readonly isValid: boolean;
  readonly error?: string;
}

export type FormValidationState<T extends Record<string, unknown>> = {
  readonly [K in keyof T]: FieldValidation;
};

/** Loading states for async operations */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
