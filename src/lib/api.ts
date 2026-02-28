/**
 * API Client
 *
 * Typed HTTP client wrapping all backend communication.
 * - Attaches auth headers automatically
 * - Handles CSRF tokens
 * - Enforces response envelope parsing
 * - Centralizes error normalization
 * - Never exposes raw fetch calls in page components
 */

import type { ApiResponse } from '../types/api';
import { secureStore, secureLog, generateCSRFToken } from './security';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const API_TIMEOUT_MS = 15_000;

// One CSRF token per page session; rotate after each mutation
let csrfToken = generateCSRFToken();

function rotateCSRF(): void {
  csrfToken = generateCSRFToken();
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** If true, skips auth header (for public endpoints) */
  isPublic?: boolean;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, isPublic = false } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const accessToken = secureStore.get('accessToken');

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-Source': 'web',
    ...headers,
  };

  if (!isPublic && accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  // Attach CSRF token to all state-mutating requests
  if (method !== 'GET') {
    requestHeaders['X-CSRF-Token'] = csrfToken;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: 'include', // send httpOnly cookies (for refresh token)
    });

    clearTimeout(timeoutId);

    // Rotate CSRF after every mutation
    if (method !== 'GET') rotateCSRF();

    if (response.status === 401) {
      // Token expired — trigger refresh flow via event
      window.dispatchEvent(new CustomEvent('auth:token-expired'));
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Session expired', requestId: '' } };
    }

    if (response.status === 429) {
      return { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait.', requestId: '' } };
    }

    const json = await response.json() as ApiResponse<T>;
    return json;
  } catch (err) {
    clearTimeout(timeoutId);

    if ((err as Error).name === 'AbortError') {
      secureLog.error('Request timed out', path);
      return { success: false, error: { code: 'TIMEOUT', message: 'Request timed out. Please try again.', requestId: '' } };
    }

    secureLog.error('Network error', err);
    return { success: false, error: { code: 'NETWORK_ERROR', message: 'Network error. Please check your connection.', requestId: '' } };
  }
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  requestOTP: (phone: string) =>
    request<{ sessionId: string }>('/auth/otp/request', {
      method: 'POST',
      body: { phone },
      isPublic: true,
    }),

  verifyOTP: (sessionId: string, otp: string) =>
    request<{ verified: boolean }>('/auth/otp/verify', {
      method: 'POST',
      body: { sessionId, otp },
      isPublic: true,
    }),

  login: (payload: { method: string; idNumber: string; dateOfBirth: string; otpCode: string }) =>
    request<{ accessToken: string; expiresAt: number }>('/auth/login', {
      method: 'POST',
      body: payload,
      isPublic: true,
    }),

  logout: () =>
    request<void>('/auth/logout', { method: 'POST' }),

  refreshToken: () =>
    request<{ accessToken: string; expiresAt: number }>('/auth/token/refresh', {
      method: 'POST',
    }),
};

// ─── Identity API ────────────────────────────────────────────────────────────

export const identityApi = {
  getProfile: () =>
    request<import('../types/citizen').CitizenIdentity>('/identity/profile'),

  getApplications: (page = 1, perPage = 10) =>
    request<import('../types/api').PaginatedResponse<import('../types/citizen').ApplicationRecord>>(
      `/identity/applications?page=${page}&perPage=${perPage}`
    ),

  getApplication: (id: string) =>
    request<import('../types/citizen').ApplicationRecord>(`/identity/applications/${encodeURIComponent(id)}`),
};

// ─── Services API ────────────────────────────────────────────────────────────

export const servicesApi = {
  getAll: () =>
    request<import('../types/citizen').GovernmentService[]>('/services', { isPublic: true }),

  getById: (id: string) =>
    request<import('../types/citizen').GovernmentService>(`/services/${encodeURIComponent(id)}`, { isPublic: true }),

  submitApplication: (serviceId: string, formData: Record<string, unknown>) =>
    request<import('../types/citizen').ApplicationRecord>('/applications', {
      method: 'POST',
      body: { serviceId, formData },
    }),
};
