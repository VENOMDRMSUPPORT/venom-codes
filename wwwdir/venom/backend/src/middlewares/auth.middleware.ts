import type { RequestHandler } from "express";
import { verifyToken } from "../lib/jwt.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "unauthorized",
      message: "Missing or invalid token",
    });
    return;
  }

  const token = auth.slice("Bearer ".length).trim();
  try {
    const { sub } = verifyToken(token);
    req.clientId = sub;
    next();
  } catch {
    res.status(401).json({
      error: "unauthorized",
      message: "Invalid or expired token",
    });
  }
};
