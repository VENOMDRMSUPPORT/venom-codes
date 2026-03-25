import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  PORT: z.coerce.number().int().positive().default(8080),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  WHMCS_URL: z.string().url(),
  WHMCS_IDENTIFIER: z.string().min(1),
  WHMCS_SECRET: z.string().min(1),
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
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
    VENOM_ADMIN_API_KEY: process.env.VENOM_ADMIN_API_KEY || undefined,
    VENOM_WEBHOOK_SECRET: process.env.VENOM_WEBHOOK_SECRET || undefined,
    VENOM_ENABLE_SSL_API: process.env.VENOM_ENABLE_SSL_API,
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
