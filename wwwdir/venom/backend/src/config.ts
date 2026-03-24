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
