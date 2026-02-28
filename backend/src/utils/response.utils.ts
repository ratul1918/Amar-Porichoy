import { Response } from 'express';
import { PaginationMeta, PaginationQuery } from '@app-types/index';

// ─────────────────────────────────────────────
// Pagination helpers
// ─────────────────────────────────────────────

export interface PaginationParams {
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

export function buildPaginationParams(
  query: PaginationQuery,
  defaultSortBy = 'createdAt'
): PaginationParams {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  const sortBy = query.sortBy ?? defaultSortBy;
  const sortOrder = query.sortOrder ?? 'desc';

  return {
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// ─────────────────────────────────────────────
// Typed API response builders
// ─────────────────────────────────────────────

export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: string | { message?: string; statusCode?: number }
): void {
  const opts = typeof options === 'string' ? { message: options } : options;
  res.status(opts?.statusCode ?? 200).json({
    success: true,
    data,
    message: opts?.message,
    timestamp: new Date().toISOString(),
    requestId: (res.locals as { requestId?: string }).requestId ?? '',
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta
): void {
  res.status(200).json({
    success: true,
    data,
    pagination: meta,
    timestamp: new Date().toISOString(),
    requestId: (res.locals as { requestId?: string }).requestId ?? '',
  });
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, { statusCode: 201, ...(message !== undefined ? { message } : {}) });
}
