import express from "express";
import cors from "cors";
import helmet from "helmet";
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

  // TRUST PROXY CONFIGURATION
  // This application typically runs behind a trusted reverse proxy (nginx)
  // that properly sets X-Forwarded-* headers.
  //
  // Architecture: Client -> nginx (trusted) -> Node.js
  //
  // The 'trust proxy' setting tells Express to trust X-Forwarded-* headers from proxies.
  // - Configurable via TRUST_PROXY environment variable ("true"/"1" to enable)
  // - When TRUST_PROXY is not set, defaults based on NODE_ENV:
  //   - production: true (assumes behind reverse proxy)
  //   - development/test: false (direct connection)
  // - `trust proxy: 1` trusts the first proxy (nginx)
  //
  // SECURITY: Only enable trust proxy when behind a trusted reverse proxy.
  // If the app is exposed directly to the internet, keep this disabled to prevent
  // IP spoofing via X-Forwarded-For headers.
  // See: https://expressjs.com/en/guide/behind-proxies.html
  const trustProxy = config.TRUST_PROXY ?? (config.NODE_ENV === "production");
  if (trustProxy) {
    app.set("trust proxy", 1);
    logger.debug({ trustProxy }, "Trust proxy enabled");
  }

  // Raw body for HMAC verification — must run before express.json()
  app.post(
    "/api/webhooks/whmcs",
    express.raw({ type: "application/json", limit: "1mb" }),
    handleWhmcsWebhook,
  );

  app.use(pinoHttp({ logger }));

  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline needed for Tailwind CSS
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...getAllowedCSPDomains()],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }));

  function getAllowedCSPDomains(): string[] {
    const domains: string[] = [];
    if (config.FRONTEND_ORIGIN) {
      try {
        // Support multiple origins (comma-separated in FRONTEND_ORIGIN)
        const origins = config.FRONTEND_ORIGIN.split(",").map(o => o.trim());
        for (const origin of origins) {
          try {
            const originUrl = new URL(origin);
            domains.push(originUrl.origin);
          } catch {
            // Invalid URL, skip
          }
        }
      } catch {
        // Invalid URL, skip
      }
    }
    return domains;
  }

  // CORS CONFIGURATION
  // Supports multiple development origins via comma-separated FRONTEND_ORIGIN
  // Example: FRONTEND_ORIGIN=http://localhost:5173,http://localhost:3000,https://venom-codes.test
  //
  // Credentials mode allows cookies to be sent/received for authenticated requests
  // Note: JWT is primarily sent via Authorization header, but cookies are used for webhooks
  const allowedOrigins = config.FRONTEND_ORIGIN.split(",").map(o => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman, etc.)
        if (!origin) {
          return callback(null, true);
        }
        // Check if the origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
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

  // Rate limiting for other sensitive endpoints
  const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too_many_requests", message: "Too many requests. Please slow down." },
  });

  // Apply to ticket creation
  app.use("/api/tickets", sensitiveLimiter);

  registerApiRoutes(app);
  registerWebRoutes(app);

  app.use(errorMiddleware);
  return app;
}
