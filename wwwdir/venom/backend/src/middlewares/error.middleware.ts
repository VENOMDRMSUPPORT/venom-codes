import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { WhmcsApiError } from "../lib/whmcs-client.js";

export const errorMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "validation_error",
      message: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    });
    return;
  }

  if (err instanceof WhmcsApiError) {
    res.status(400).json({
      error: err.code ?? "whmcs_error",
      message: err.message,
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  console.error(err);
  res.status(500).json({
    error: "internal_error",
    message,
  });
};
