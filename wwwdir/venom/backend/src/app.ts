import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pino from "pino";
import pinoHttp from "pino-http";
import { config } from "./config.js";
import { registerApiRoutes } from "../../routes/api.js";
import { registerWebRoutes } from "../../routes/web.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { handleWhmcsWebhook } from "./routes/webhooks.routes.js";

export function createApp(): express.Application {
  const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
  const app = express();
  app.set("trust proxy", 1);

  // Raw body for HMAC verification — must run before express.json()
  app.post(
    "/api/webhooks/whmcs",
    express.raw({ type: "application/json", limit: "1mb" }),
    handleWhmcsWebhook,
  );

  app.use(pinoHttp({ logger }));
  app.use(
    cors({
      origin: config.FRONTEND_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(globalLimiter);

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too_many_requests", message: "Too many login attempts. Please try again later." },
  });

  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
  app.use("/api/auth/forgot-password", authLimiter);

  registerApiRoutes(app);
  registerWebRoutes(app);

  app.use(errorMiddleware);
  return app;
}
