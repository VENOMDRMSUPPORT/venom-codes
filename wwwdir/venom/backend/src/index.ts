import pino from "pino";
import { createApp } from "./app.js";
import { config } from "./config.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const app = createApp();

app.listen(config.PORT, "0.0.0.0", () => {
  logger.info({ port: config.PORT }, "Venom API listening");
});
