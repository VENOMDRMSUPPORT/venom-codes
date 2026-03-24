// Allow self-signed certificates in development (Laravel Valet, etc.)
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

const app = express();
app.set("trust proxy", 1);

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

registerApiRoutes(app);
registerWebRoutes(app);

app.use(errorMiddleware);

app.listen(config.PORT, "0.0.0.0", () => {
  logger.info({ port: config.PORT }, "Venom API listening");
});
