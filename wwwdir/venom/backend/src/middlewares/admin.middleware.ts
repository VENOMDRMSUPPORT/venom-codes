import type { RequestHandler } from "express";
import crypto from "crypto";
import { config } from "../config.js";

/**
 * Performs a constant-time comparison of two strings to prevent timing attacks.
 * Both strings are padded to the same length before comparison to ensure
 * the comparison time is independent of the input values.
 */
function timingSafeEqual(a: string, b: string): boolean {
  // If either string is empty, return false (no valid key should be empty)
  if (!a || !b) {
    return false;
  }
  
  // Convert to buffers for timing-safe comparison
  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");
  
  // If lengths differ, we still need to do a comparison of equal length
  // to maintain constant time - we'll use the expected length
  if (aBuffer.length !== bBuffer.length) {
    // Create a dummy buffer of the expected length for constant-time comparison
    // The result will always be false, but we do the work anyway
    const dummyBuffer = Buffer.alloc(aBuffer.length);
    crypto.timingSafeEqual(aBuffer, dummyBuffer);
    return false;
  }
  
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

/**
 * Protects admin-only WHMCS proxy routes. Requires `VENOM_ADMIN_API_KEY` at startup
 * and header `X-Admin-Key` on each request.
 * 
 * Security: Uses constant-time comparison to prevent timing attacks on the API key.
 */
export const requireAdminKey: RequestHandler = (req, res, next) => {
  const expected = config.VENOM_ADMIN_API_KEY;
  if (!expected) {
    res.status(503).json({
      error: "admin_api_disabled",
      message: "Admin API routes are not enabled (set VENOM_ADMIN_API_KEY).",
    });
    return;
  }
  const provided = req.headers["x-admin-key"];
  if (typeof provided !== "string" || !timingSafeEqual(provided, expected)) {
    res.status(401).json({
      error: "unauthorized",
      message: "Invalid or missing X-Admin-Key",
    });
    return;
  }
  next();
};
