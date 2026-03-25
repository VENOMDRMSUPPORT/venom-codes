import pino from "pino";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { validateJwtConfig } from "./lib/jwt.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

// Validate JWT configuration at startup (fail-fast)
try {
  validateJwtConfig();
} catch (error) {
  logger.error({ error }, "JWT configuration validation failed");
  process.exit(1);
}

const app = createApp();

app.listen(config.PORT, "0.0.0.0", () => {
  logger.info({ port: config.PORT }, "Venom API listening");
});
