import type { ErrorRequestHandler, Request } from "express";
import { ZodError } from "zod";
import { WhmcsApiError } from "../lib/whmcs-client.js";
import type { Logger } from "pino";

// Safe error messages that don't leak sensitive information
const SAFE_ERROR_MESSAGES = {
  validation_error: "Invalid request data. Please check your input.",
  whmcs_error: "An error occurred while processing your request.",
  internal_error: "An internal server error occurred. Please try again later.",
  not_found: "The requested resource was not found.",
  unauthorized: "Authentication is required to access this resource.",
  forbidden: "You do not have permission to perform this action.",
  too_many_requests: "Too many requests. Please slow down.",
};

/**
 * Sanitizes Zod error paths to prevent leaking sensitive field names
 * Only shows the field name if it's a common, non-sensitive field
 */
function sanitizeZodPath(path: (string | number)[]): string {
  const pathStr = path.join(".");
  // Block sensitive field paths that could leak internal structure
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /token/i,
    /api.*key/i,
    /credential/i,
  ];
  if (sensitivePatterns.some((pattern) => pattern.test(pathStr))) {
    return "field";
  }
  return pathStr;
}

/**
 * Sanitizes WHMCS API error messages
 * Returns a generic message for known error patterns
 */
function sanitizeWhmcsMessage(message: string): string {
  // Don't expose raw WHMCS error messages to clients
  // Log server-side, return generic message client-side
  const lowerMessage = message.toLowerCase();

  // Check for specific error types that can be safely exposed
  if (lowerMessage.includes("invalid") || lowerMessage.includes("not found")) {
    return SAFE_ERROR_MESSAGES.whmcs_error;
  }
  if (lowerMessage.includes("duplicate") || lowerMessage.includes("already exists")) {
    return "This record already exists.";
  }
  if (lowerMessage.includes("required")) {
    return "Required information is missing.";
  }

  // Default to generic message
  return SAFE_ERROR_MESSAGES.whmcs_error;
}

/**
 * Logs error details server-side for debugging
 *
 * NOTE: Logger should always be available on req.log from pinoHttp middleware.
 * If logger is undefined, it indicates a configuration issue with middleware ordering.
 */
function logError(logger: Logger | undefined, err: unknown, context?: string) {
  if (!logger) {
    // This should never happen if pinoHttp middleware is properly configured
    console.error("[CONFIG ERROR] Logger not available on request object - check pinoHttp middleware setup");
    console.error("[Error]", context || "Error:", err);
    return;
  }

  const errorObj = err instanceof Error ? {
    name: err.name,
    message: err.message,
    stack: err.stack,
  } : { error: err };

  logger.error({
    ...errorObj,
    context,
  }, "Error occurred");
}

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res,
  _next,
) => {
  const logger = (req as any).log as Logger | undefined;

  if (err instanceof ZodError) {
    // Log full Zod error server-side
    logError(logger, err, "validation_error");

    // Return sanitized message to client
    const sanitizedIssues = err.issues.map((i) => {
      const path = sanitizeZodPath(i.path);
      return `${path}: ${i.message}`;
    });
    res.status(400).json({
      error: "validation_error",
      message: SAFE_ERROR_MESSAGES.validation_error,
      details: sanitizedIssues,
    });
    return;
  }

  if (err instanceof WhmcsApiError) {
    // Log full WHMCS error server-side
    logError(logger, err, `whmcs_error: ${err.code}`);

    // Return sanitized message to client
    res.status(400).json({
      error: err.code ?? "whmcs_error",
      message: sanitizeWhmcsMessage(err.message),
    });
    return;
  }

  // Log unknown errors server-side
  logError(logger, err, "internal_error");

  // Always return generic message to client
  res.status(500).json({
    error: "internal_error",
    message: SAFE_ERROR_MESSAGES.internal_error,
  });
};
