import type { RequestHandler } from "express";
import { config } from "../config.js";

/**
 * Protects admin-only WHMCS proxy routes. Requires `VENOM_ADMIN_API_KEY` at startup
 * and header `X-Admin-Key` on each request.
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
  if (typeof provided !== "string" || provided !== expected) {
    res.status(401).json({
      error: "unauthorized",
      message: "Invalid or missing X-Admin-Key",
    });
    return;
  }
  next();
};
