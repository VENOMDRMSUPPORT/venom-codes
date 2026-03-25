import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  PORT: z.coerce.number().int().positive().default(8080),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters for security"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  WHMCS_URL: z.string().url(),
  WHMCS_IDENTIFIER: z.string().min(1),
  WHMCS_SECRET: z.string().min(1),
  /** WHMCS API timeout in milliseconds (default: 30 seconds) */
  WHMCS_TIMEOUT: z.coerce.number().int().positive().default(30000),
  FRONTEND_ORIGIN: z
    .string()
    .min(1)
    .describe("Allowed CORS origin for the SPA (no wildcards in production)"),
  /** When set, mounts /api/admin, /api/system, /api/modules, /api/notifications and requires X-Admin-Key header. */
  VENOM_ADMIN_API_KEY: z.string().min(8).optional(),
  /** HMAC secret for POST /api/webhooks/whmcs (WHMCS PHP hooks). */
  VENOM_WEBHOOK_SECRET: z.string().min(16).optional(),
  /** Enable WHMCS SSL External API proxy routes (verify actions against your WHMCS version). */
  VENOM_ENABLE_SSL_API: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
  /** Database connection settings */
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default("admin"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("whmcs"),
  /** MySQL connection pool limit (default: 20, increased from 10 for production) */
  MYSQL_CONNECTION_LIMIT: z.coerce.number().int().positive().default(20),
  /** MySQL connection queue limit (default: 50, was 0 = unlimited) */
  MYSQL_QUEUE_LIMIT: z.coerce.number().int().min(0).default(50),
  /** MySQL connection timeout in milliseconds (default: 10000 = 10 seconds)
   *  Rationale: Same-network MySQL should connect in <1s; 10s allows for
   *  network hiccups while failing fast on real connectivity issues.
   */
  MYSQL_CONNECT_TIMEOUT: z.coerce.number().int().positive().default(10000),
  /** Trust proxy setting for Express (default: true in production, false otherwise)
   *  Set to "true" or "1" to enable, any other value disables.
   *  When undefined, defaults based on NODE_ENV (true in production, false otherwise).
   */
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      return v === "true" || v === "1";
    }),
});

export type AppConfig = z.infer<typeof envSchema>;

function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    WHMCS_URL: process.env.WHMCS_URL,
    WHMCS_IDENTIFIER: process.env.WHMCS_IDENTIFIER,
    WHMCS_SECRET: process.env.WHMCS_SECRET,
    WHMCS_TIMEOUT: process.env.WHMCS_TIMEOUT,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
    VENOM_ADMIN_API_KEY: process.env.VENOM_ADMIN_API_KEY || undefined,
    VENOM_WEBHOOK_SECRET: process.env.VENOM_WEBHOOK_SECRET || undefined,
    VENOM_ENABLE_SSL_API: process.env.VENOM_ENABLE_SSL_API,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    MYSQL_CONNECTION_LIMIT: process.env.MYSQL_CONNECTION_LIMIT,
    MYSQL_QUEUE_LIMIT: process.env.MYSQL_QUEUE_LIMIT,
    MYSQL_CONNECT_TIMEOUT: process.env.MYSQL_CONNECT_TIMEOUT,
    TRUST_PROXY: process.env.TRUST_PROXY,
  });

  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${msg}`);
  }

  return parsed.data;
}

export const config = loadConfig();
