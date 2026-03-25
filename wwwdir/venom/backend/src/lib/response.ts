/**
 * Standardized API response utilities
 */

import { type Response } from "express";

export interface ApiError {
  error: string;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Send a successful response
 */
export function success<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

/**
 * Send a paginated response
 */
export function paginated<T>(
  res: Response,
  items: T[],
  page: number,
  limit: number,
  total: number
): Response {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

/**
 * Send an error response
 */
export function error(
  res: Response,
  message: string,
  code: string = "error",
  status = 400,
  details?: unknown
): Response {
  const response: Record<string, unknown> = {
    error: code,
    message,
  };
  if (details) {
    response.details = details;
  }
  return res.status(status).json(response);
}

/**
 * Send a not found response
 */
export function notFound(res: Response, message = "Resource not found"): Response {
  return error(res, message, "not_found", 404);
}

/**
 * Send an unauthorized response
 */
export function unauthorized(
  res: Response,
  message = "Unauthorized"
): Response {
  return error(res, message, "unauthorized", 401);
}

/**
 * Send a forbidden response
 */
export function forbidden(
  res: Response,
  message = "Forbidden"
): Response {
  return error(res, message, "forbidden", 403);
}

/**
 * Send a validation error response
 */
export function validationError(
  res: Response,
  message: string,
  details?: unknown
): Response {
  return error(res, message, "validation_error", 400, details);
}

/**
 * Send an internal server error response
 */
export function serverError(
  res: Response,
  message = "Internal server error"
): Response {
  // Don't leak internal error details in production
  return error(
    res,
    process.env.NODE_ENV === "production" ? message : message,
    "internal_error",
    500
  );
}

/**
 * Parse pagination query params
 */
export function parsePagination(
  query: Record<string, unknown>
): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(String(query.page), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit), 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}