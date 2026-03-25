/**
 * JWT Validation Tests
 *
 * Tests verifyToken() security hardening including:
 * - Algorithm confusion attack prevention
 * - Token structure validation
 * - Expiration handling
 * - Invalid token rejection
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import jwt from "jsonwebtoken";
import { signToken, verifyToken, decodeTokenUnsafe } from "./jwt.js";

// Test secrets - MUST match vitest.setup.ts for config module to work correctly
const TEST_SECRET = "test-jwt-secret-key-at-least-32-characters-long-for-security";
const TEST_EXPIRES_IN = "1h";
const WRONG_SECRET = "wrong_secret_key_different_from_config_at_least_32_chars";

describe("JWT Validation", () => {
  beforeEach(() => {
    // Reset process.env for each test
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
    vi.stubEnv("JWT_EXPIRES_IN", TEST_EXPIRES_IN);
  });

  describe("Algorithm Confusion Prevention", () => {
    it("should accept valid HS256 tokens", () => {
      const token = signToken({ sub: "user123" });
      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");

      const decoded = verifyToken(token);
      expect(decoded.sub).toBe("user123");
    });

    it("should reject tokens with 'none' algorithm", () => {
      // Create a malicious "none" algorithm token
      // This simulates an algorithm confusion attack
      const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
      const payload = btoa(JSON.stringify({ sub: "admin", iat: Date.now() / 1000 }));
      const signature = ""; // 'none' algorithm has no signature
      const maliciousToken = `${header}.${payload}.${signature}`;

      expect(() => verifyToken(maliciousToken)).toThrow("Invalid token");
    });

    it("should reject tokens with wrong algorithm (RS256)", () => {
      // Verify header has HS256
      const validToken = signToken({ sub: "user123" });
      const parts = validToken.split(".");
      const header = JSON.parse(Buffer.from(parts[0], "base64").toString());

      expect(header.alg).toBe("HS256");

      // If someone tries to modify the header to say RS256
      // verification should fail because signature won't match
      header.alg = "RS256";
      const modifiedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
      const fakeToken = `${modifiedHeader}.${parts[1]}.${parts[2]}`;

      expect(() => verifyToken(fakeToken)).toThrow();
    });

    it("should reject tokens without algorithm specification", () => {
      // Test that explicit algorithm check is in place
      // A token with no algorithm in header should be rejected
      const header = btoa(JSON.stringify({ typ: "JWT" })); // no alg field
      const payload = btoa(JSON.stringify({ sub: "user123" }));
      const signature = "signature";
      const malformedToken = `${header}.${payload}.${signature}`;

      expect(() => verifyToken(malformedToken)).toThrow();
    });
  });

  describe("Token Structure Validation", () => {
    it("should reject tokens without sub claim", () => {
      // Create a valid token without 'sub' claim
      const tokenWithoutSub = jwt.sign(
        { data: "something" },
        TEST_SECRET,
        { algorithm: "HS256", expiresIn: "1h" }
      );

      expect(() => verifyToken(tokenWithoutSub)).toThrow("missing sub claim");
    });

    it("should reject tokens where sub is not string or number", () => {
      // Create a token with invalid sub type
      const tokenWithInvalidSub = jwt.sign(
        { sub: { userId: "123" } }, // sub is object, not string/number
        TEST_SECRET,
        { algorithm: "HS256", expiresIn: "1h" }
      );

      expect(() => verifyToken(tokenWithInvalidSub)).toThrow("sub must be string or number");
    });

    it("should accept tokens with numeric sub claim", () => {
      const token = jwt.sign(
        { sub: 12345 }, // numeric sub
        TEST_SECRET,
        { algorithm: "HS256", expiresIn: "1h" }
      );

      const decoded = verifyToken(token);
      expect(decoded.sub).toBe("12345"); // Converted to string
    });

    it("should accept tokens with string sub claim", () => {
      const token = signToken({ sub: "user-abc-123" });
      const decoded = verifyToken(token);
      expect(decoded.sub).toBe("user-abc-123");
    });
  });

  describe("Expiration Handling", () => {
    it("should reject expired tokens", () => {
      // Create a token that expired 1 hour ago
      const expiredToken = jwt.sign(
        { sub: "user123" },
        TEST_SECRET,
        { algorithm: "HS256", expiresIn: "-1h" }
      );

      expect(() => verifyToken(expiredToken)).toThrow("jwt expired");
    });

    it("should accept non-expired tokens", () => {
      const token = signToken({ sub: "user123" });
      const decoded = verifyToken(token);
      expect(decoded.sub).toBe("user123");
    });

    it("should handle tokens with exp claim in the past", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = jwt.sign(
        { sub: "user123", exp: pastTime },
        TEST_SECRET,
        { algorithm: "HS256" }
      );

      expect(() => verifyToken(token)).toThrow("jwt expired");
    });
  });

  describe("Malformed Token Rejection", () => {
    it("should reject tokens with invalid signature", () => {
      const validToken = signToken({ sub: "user123" });
      const parts = validToken.split(".");
      // Tamper with the signature
      const tamperedToken = `${parts[0]}.${parts[1]}.tampered_signature`;

      expect(() => verifyToken(tamperedToken)).toThrow("Invalid token");
    });

    it("should reject tokens with invalid structure", () => {
      const invalidTokens = [
        "", // empty
        "not.a.token", // wrong format
        "only.two", // missing signature
        "a.b.c.d", // too many parts
        "Bearer token", // prefix
      ];

      for (const token of invalidTokens) {
        expect(() => verifyToken(token), `Token: "${token}" should be rejected`).toThrow();
      }
    });

    it("should reject tokens with invalid base64", () => {
      const invalidToken = "not-valid-base64.not-valid-base64.signature";
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it("should reject tokens signed with wrong secret", () => {
      const tokenWithWrongSecret = jwt.sign(
        { sub: "user123" },
        WRONG_SECRET,
        { algorithm: "HS256", expiresIn: "1h" }
      );

      expect(() => verifyToken(tokenWithWrongSecret)).toThrow("Invalid token");
    });
  });

  describe("Cross-Token Validation", () => {
    it("should not verify token signed with different secret", () => {
      const secret1 = "secret_1_at_least_32_characters_long_for_security";
      const secret2 = "secret_2_at_least_32_characters_long_for_security";

      const token = jwt.sign(
        { sub: "user123" },
        secret1,
        { algorithm: "HS256", expiresIn: "1h" }
      );

      // Try to verify with secret2 - should fail
      vi.stubEnv("JWT_SECRET", secret2);
      expect(() => verifyToken(token)).toThrow();
    });
  });
});

describe("decodeTokenUnsafe (Debugging Only)", () => {
  it("should decode token without verification", () => {
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
    vi.stubEnv("JWT_EXPIRES_IN", TEST_EXPIRES_IN);

    const token = signToken({ sub: "user123" });
    const decoded = decodeTokenUnsafe(token);

    expect(decoded).toBeTruthy();
    expect(decoded?.sub).toBe("user123");
  });

  it("should return null for invalid tokens", () => {
    const invalidTokens = [
      "",
      "invalid.token.format",
      "not-a-jwt",
    ];

    for (const token of invalidTokens) {
      expect(decodeTokenUnsafe(token)).toBeNull();
    }
  });

  it("should decode expired tokens without throwing", () => {
    const expiredToken = jwt.sign(
      { sub: "user123" },
      TEST_SECRET,
      { algorithm: "HS256", expiresIn: "-1h" }
    );

    const decoded = decodeTokenUnsafe(expiredToken);
    expect(decoded).toBeTruthy();
    expect(decoded?.sub).toBe("user123");
  });

  it("should decode tokens with wrong secret", () => {
    const token = jwt.sign(
      { sub: "user123" },
      "different_secret_at_least_32_characters_long",
      { algorithm: "HS256", expiresIn: "1h" }
    );

    const decoded = decodeTokenUnsafe(token);
    expect(decoded).toBeTruthy(); // Decodes without verification
    expect(decoded?.sub).toBe("user123");
  });
});

describe("signToken", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", TEST_SECRET);
    vi.stubEnv("JWT_EXPIRES_IN", TEST_EXPIRES_IN);
  });

  it("should create tokens with HS256 algorithm", () => {
    const token = signToken({ sub: "user123" });
    const parts = token.split(".");
    const header = JSON.parse(Buffer.from(parts[0], "base64").toString());

    expect(header.alg).toBe("HS256");
    expect(header.typ).toBe("JWT");
  });

  it("should include all payload fields", () => {
    const token = signToken({ sub: "client-789" });
    const decoded = verifyToken(token);

    expect(decoded.sub).toBe("client-789");
  });

  it("should generate different tokens each time", () => {
    vi.useFakeTimers();
    const token1 = signToken({ sub: "user123" });
    // Advance time by 2 seconds to ensure different iat (JWT uses second precision)
    vi.advanceTimersByTime(2000);
    const token2 = signToken({ sub: "user123" });
    vi.useRealTimers();

    // Tokens should be different due to iat (issued at) claim
    expect(token1).not.toBe(token2);
  });
});
