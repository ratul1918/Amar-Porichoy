/**
 * Authentication & Authorization types.
 * Follows OpenID Connect / OAuth 2.0 patterns adapted for a government identity platform.
 */

export type UserRole = 'citizen' | 'officer' | 'admin' | 'auditor';

export type Permission =
  | 'applications:read'
  | 'applications:write'
  | 'applications:approve'
  | 'identity:read'
  | 'identity:verify'
  | 'users:manage'
  | 'audit:read';

/** Maps roles to their allowed permissions. Principle of Least Privilege. */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  citizen: ['applications:read', 'applications:write', 'identity:read'],
  officer: ['applications:read', 'applications:write', 'applications:approve', 'identity:read', 'identity:verify'],
  admin: ['applications:read', 'applications:write', 'applications:approve', 'identity:read', 'identity:verify', 'users:manage', 'audit:read'],
  auditor: ['audit:read', 'applications:read', 'identity:read'],
} as const;

export interface AuthUser {
  readonly id: string;
  readonly citizenId: string;
  readonly nameBn: string;
  readonly nameEn: string;
  readonly phone: string;            // masked where exposed
  readonly role: UserRole;
  readonly isVerified: boolean;
  readonly sessionId: string;        // for server-side invalidation
  readonly iat: number;              // issued-at (unix epoch)
  readonly exp: number;              // expiry (unix epoch)
}

export interface AuthSession {
  readonly user: AuthUser;
  /** Opaque access token — never store in localStorage; use httpOnly cookies in prod */
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;        // unix epoch ms
}

export type LoginMethod = 'birth_certificate' | 'nid' | 'email';

export interface LoginCredentials {
  readonly method: LoginMethod;
  readonly idNumber: string;
  readonly dateOfBirth: string;      // YYYY-MM-DD for verification
  readonly otpCode?: string;
  readonly email?: string;
  readonly password?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: AuthSession }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_REFRESH'; payload: Pick<AuthSession, 'accessToken' | 'expiresAt'> };
