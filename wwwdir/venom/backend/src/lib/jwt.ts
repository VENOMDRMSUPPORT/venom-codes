import jwt, { type SignOptions, type JwtPayload as JwtJsonWebTokenPayload } from "jsonwebtoken";
import { config } from "../config.js";

/**
 * JWT Configuration Security Settings
 * 
 * SECURITY:
 * - Explicit algorithm specification (HS256) to prevent algorithm confusion attacks
 * - Token version for revocation/rotation support
 * - Startup validation for fail-fast on misconfiguration
 */
const JWT_ALGORITHM = "HS256";
const JWT_TOKEN_VERSION = 1;

export interface JwtPayload {
  sub: string;
  /** Token version for revocation support */
  v?: number;
}

/**
 * Validates JWT configuration at startup.
 * Call this function when the application starts to fail fast if configuration is invalid.
 * 
 * @throws Error if JWT configuration is invalid
 */
export function validateJwtConfig(): void {
  // Verify secret exists
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is required but not configured");
  }
  
  // Verify secret meets minimum length
  if (config.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters for security");
  }
  
  // Warn about weak secret patterns
  const weakSecrets = ["secret", "password", "jwt_secret", "changeme", "test", "example"];
  const secretLower = config.JWT_SECRET.toLowerCase();
  if (weakSecrets.some(weak => secretLower.includes(weak))) {
    console.warn("[SECURITY WARNING] JWT_SECRET appears to contain a weak value. Please use a strong, random secret.");
  }
  
  // Validate expiry format
  const expiryPattern = /^\d+[smhd]$/;
  if (!expiryPattern.test(config.JWT_EXPIRES_IN)) {
    console.warn(`[SECURITY WARNING] JWT_EXPIRES_IN format "${config.JWT_EXPIRES_IN}" may not be valid. Expected format like "7d", "24h", "60m".`);
  }
  
  console.log("[JWT] Configuration validated successfully");
}

/**
 * Signs a JWT token with security-hardened configuration.
 *
 * SECURITY:
 * - Algorithm is explicitly set to HS256 to prevent algorithm confusion attacks
 * - Token version included for future revocation support
 * - Standard expiry from configuration
 *
 * @param payload - The payload to sign (must include 'sub' for subject/user ID)
 * @returns The signed JWT token
 */
export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    algorithm: JWT_ALGORITHM,
  };
  
  // Add token version for revocation support
  const payloadWithVersion = {
    ...payload,
    v: JWT_TOKEN_VERSION,
  };
  
  return jwt.sign(payloadWithVersion, config.JWT_SECRET, options);
}

/**
 * Verifies a JWT token and returns the payload.
 *
 * SECURITY:
 * - Algorithm is explicitly validated to prevent algorithm confusion attacks
 * - Token version is checked for revocation support
 * - Token structure is validated with proper type guards
 * - Expiration is checked by jwt.verify
 * - Token blacklist is checked for revoked tokens
 *
 * @param token - The JWT token to verify
 * @returns The token payload with subject claim
 * @throws Error if token is invalid, expired, revoked, or malformed
 */
export function verifyToken(token: string): JwtPayload {
  // Check if token has been revoked
  if (isTokenRevoked(token)) {
    throw new Error("Token has been revoked");
  }
  
  try {
    // SECURITY: Explicitly validate algorithm to prevent algorithm confusion attacks
    // Without this, an attacker could use "none" algorithm or other algorithms
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: [JWT_ALGORITHM], // Only accept HS256
    }) as unknown;

    // Type guard: Verify decoded is an object
    if (typeof decoded !== "object" || decoded === null) {
      throw new Error("Invalid token: not an object");
    }

    // Type guard: Verify 'sub' claim exists and is valid
    if (!("sub" in decoded)) {
      throw new Error("Invalid token: missing sub claim");
    }

    const sub = (decoded as Record<string, unknown>).sub;
    if (typeof sub !== "string" && typeof sub !== "number") {
      throw new Error("Invalid token: sub must be string or number");
    }

    // Check token version (for future revocation support)
    const version = (decoded as Record<string, unknown>).v;
    if (typeof version === "number" && version !== JWT_TOKEN_VERSION) {
      throw new Error("Token version mismatch - token may have been revoked");
    }

    return { sub: String(sub), v: version as number | undefined };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid token: ${error.message}`);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error("Token not yet valid");
    }
    throw error;
  }
}

/**
 * Decodes a token without verifying it.
 * WARNING: Only use this for debugging. Never use decoded values for auth decisions.
 *
 * @param token - The JWT token to decode
 * @returns The decoded token payload or null if invalid
 */
export function decodeTokenUnsafe(token: string): JwtJsonWebTokenPayload | null {
  try {
    const decoded = jwt.decode(token);
    return decoded !== null && typeof decoded === "object" ? decoded : null;
  } catch {
    return null;
  }
}

// ============================================================================
// Token Revocation Support
// ============================================================================

/**
 * Simple in-memory token blacklist for logout/token revocation.
 * 
 * NOTE: This is a basic implementation suitable for single-instance deployments.
 * For multi-instance deployments, consider using Redis or a database-backed store.
 * 
 * In production with multiple instances, you would replace this with:
 * - Redis SET with TTL matching token expiry
 * - Database table with token ID and expiry
 */
const revokedTokens = new Set<string>();
const tokenExpiryTimes = new Map<string, number>();

/**
 * Maximum number of revoked tokens to keep in memory.
 * When exceeded, oldest expired tokens are cleaned up.
 */
const MAX_REVOKED_TOKENS = 10000;

/**
 * Revokes a token by adding it to the blacklist.
 * The token will be rejected even if it hasn't expired yet.
 * 
 * @param token - The JWT token to revoke
 */
export function revokeToken(token: string): void {
  revokedTokens.add(token);
  
  // Store expiry time for cleanup (approximate - use current time + max expiry)
  const maxExpiryMs = parseExpiryToMs(config.JWT_EXPIRES_IN);
  tokenExpiryTimes.set(token, Date.now() + maxExpiryMs);
  
  // Cleanup old entries if we're approaching the limit
  if (revokedTokens.size > MAX_REVOKED_TOKENS) {
    cleanupExpiredRevokedTokens();
  }
}

/**
 * Checks if a token has been revoked.
 * 
 * @param token - The JWT token to check
 * @returns true if the token has been revoked
 */
export function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}

/**
 * Parses a JWT expiry string (e.g., "7d", "24h", "60m") to milliseconds.
 */
function parseExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000; // Default 7 days
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2];
  
  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}

/**
 * Removes expired tokens from the revocation list to free memory.
 */
function cleanupExpiredRevokedTokens(): void {
  const now = Date.now();
  const tokensToRemove: string[] = [];
  
  for (const [token, expiryTime] of tokenExpiryTimes) {
    if (expiryTime < now) {
      tokensToRemove.push(token);
    }
  }
  
  for (const token of tokensToRemove) {
    revokedTokens.delete(token);
    tokenExpiryTimes.delete(token);
  }
  
  if (tokensToRemove.length > 0) {
    console.log(`[JWT] Cleaned up ${tokensToRemove.length} expired revoked tokens`);
  }
}
