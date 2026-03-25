# Security & Code Quality Checklist

This checklist is designed to prevent security vulnerabilities and maintain code quality. Use it during code reviews and before committing changes.

---

## Pre-Commit Checklist

Before committing any route or API change, verify:

### Authorization & Ownership

- [ ] Every route with `:resourceId` parameter has ownership check
- [ ] `req.clientId` or authenticated user ID is used in all data queries
- [ ] Admin routes verify permissions beyond just API key presence
- [ ] No direct access to resources without tenant/user scoping
- [ ] Cross-user data access is prevented (IDOR protection)

### Authentication & JWT

- [ ] JWT verification includes explicit algorithm validation (`algorithms: ["HS256"]`)
- [ ] Token expiration is checked
- [ ] Type assertions are avoided in auth logic
- [ ] Token payload is validated with proper type guards
- [ ] Tokens are signed with strong secrets (≥32 characters)

### Input Validation

- [ ] All user input is validated with Zod or similar schema validator
- [ ] SQL queries use parameterized statements only
- [ ] No string concatenation in queries
- [ ] File uploads are validated for type and size
- [ ] URL parameters are sanitized before use

### Error Handling

- [ ] Error messages don't leak internal state to clients
- [ ] Sensitive data (secrets, passwords, tokens) never logged
- [ ] Stack traces only logged server-side, never sent to clients
- [ ] Generic error messages returned to users
- [ ] Errors are properly propagated to error middleware

### Rate Limiting

- [ ] Sensitive endpoints have stricter rate limits
- [ ] Rate limit configuration is in one place (app.ts)
- [ ] No duplicate rate limiting middleware
- [ ] Global rate limit is configured
- [ ] Auth endpoints have additional rate limiting

### Type Safety

- [ ] Minimize use of `as` type assertions
- [ ] Use type guards instead of assertions for external data
- [ ] No `as any` in production code paths
- [ ] External API responses are validated before casting
- [ ] Proper TypeScript types for all function parameters

### Configuration

- [ ] Secrets are in environment variables only
- [ ] No hardcoded secrets or keys
- [ ] Configuration validation fails fast on startup
- [ ] Default values are secure
- [ ] Sensitive config is not logged

### Testing

- [ ] Authorization failures have test cases
- [ ] Happy path has test coverage
- [ ] Edge cases are covered
- [ ] Tests verify security properties, not just functionality
- [ ] Mock external dependencies properly

---

## Patterns to Avoid

### ❌ IDOR Pattern (Insecure Direct Object Reference)

```typescript
// DON'T: Direct ID use without ownership check
router.get("/resources/:id", async (req, res) => {
  const resource = await db.getResource(req.params.id);
  res.json(resource); // VULNERABLE: Any user can access any resource
});
```

### ✅ Secure Pattern (Ownership Verification)

```typescript
// DO: Always verify ownership
router.get("/resources/:id", requireAuth, async (req, res) => {
  // SECURITY: Verify resource belongs to authenticated user
  const resource = await db.getResource(req.params.id, req.userId);
  if (!resource || resource.userId !== req.userId) {
    return res.status(404).json({ error: "not_found" });
  }
  res.json(resource);
});
```

### ❌ Weak Type Assertion

```typescript
// DON'T: Blind type assertion
const data = response as { user: User }; // No validation
console.log(data.user.email); // Could crash if response structure differs
```

### ✅ Type Guard Pattern

```typescript
// DO: Validate structure
function isUserResponse(data: unknown): data is { user: User } {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return "user" in obj && typeof obj.user === "object";
}

if (!isUserResponse(response)) {
  throw new Error("Invalid response structure");
}
console.log(response.user.email); // Safe
```

### ❌ SQL Injection Risk

```typescript
// DON'T: String concatenation in SQL
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

### ✅ Parameterized Query

```typescript
// DO: Use parameterized statements
const query = "SELECT * FROM users WHERE id = ?";
await db.query(query, [userId]);
```

### ❌ Algorithm Confusion Vulnerability

```typescript
// DON'T: Accept any JWT algorithm
const decoded = jwt.verify(token, secret); // Accepts "none" algorithm!
```

### ✅ Explicit Algorithm Validation

```typescript
// DO: Specify accepted algorithms
const decoded = jwt.verify(token, secret, {
  algorithms: ["HS256"] // Only accept HS256
});
```

### ❌ Error Information Leakage

```typescript
// DON'T: Expose internal errors to clients
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack // LEAKS: Internal implementation details
  });
});
```

### ✅ Generic Error Messages

```typescript
// DO: Log details server-side, return generic message to client
app.use((err, req, res, next) => {
  logger.error({ err }, "Request failed"); // Full details in logs
  res.status(500).json({
    error: "internal_error",
    message: "An error occurred. Please try again."
  }); // Generic message to client
});
```

---

## Code Review Focus Areas

When reviewing PRs, check for:

### 1. New Routes
- [ ] Ownership checks on `:resourceId` parameters
- [ ] Authentication required where appropriate
- [ ] Input validation with Zod schemas
- [ ] Rate limiting for sensitive operations

### 2. Authentication Changes
- [ ] Algorithm validation in JWT verification
- [ ] Token expiration properly handled
- [ ] Session timeout configured
- [ ] Password complexity requirements

### 3. External API Integration
- [ ] Timeout configured
- [ ] Error handling for network failures
- [ ] Response validation before use
- [ ] Secrets not hardcoded

### 4. Database Queries
- [ ] Parameterized statements only
- [ ] Index usage for queries
- [ ] Connection pooling configured
- [ ] No N+1 query patterns

### 5. Error Handling
- [ ] No sensitive data in error responses
- [ ] Proper HTTP status codes
- [ ] Errors logged with context
- [ ] Graceful degradation

---

## Remediation Commands

```bash
# Run type checking
npm run type-check
# or
tsc --noEmit

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Security audit (Node.js)
npm audit

# Fix audit issues (carefully)
npm audit fix

# Dependency check
npm outdated
```

---

## Security Headers Checklist

Ensure the following headers are set in production:

| Header | Expected Value | Purpose |
|--------|---------------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforce HTTPS |
| `Content-Security-Policy` | `default-src 'self'` | Control resource loading |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |

---

## OWASP Top 10 Coverage

| Risk | Mitigation | Status |
|------|------------|--------|
| A01: Broken Access Control | Ownership checks on all routes | ✅ Implemented |
| A02: Cryptographic Failures | Strong secrets, HTTPS only | ✅ Configured |
| A03: Injection | Parameterized queries, input validation | ✅ Implemented |
| A04: Insecure Design | Rate limiting, threat modeling | ✅ Partial |
| A05: Security Misconfiguration | Security headers, no defaults | ✅ Implemented |
| A06: Vulnerable Components | Dependency audits, updates needed | ⚠️ Monitor |
| A07: Authentication Failures | JWT hardening, session management | ✅ Implemented |
| A08: Software/Data Integrity | Git verification, trusted deps | ✅ Configured |
| A09: Security Logging | Pino logger, audit trails | ✅ Implemented |
| A10: Server-Side Request Forgery | URL validation, allowlists | ⚠️ Pending |

---

## Quick Reference

### Secure Route Template

```typescript
import { z } from "zod";
import { Router } from "express";

const router = Router();

// Input validation schema
const UpdateContactSchema = z.object({
  firstname: z.string().min(1).max(100),
  lastname: z.string().min(1).max(100),
  email: z.string().email(),
});

// Ownership verification helper
async function verifyOwnership(
  contactId: string,
  clientId: string
): Promise<boolean> {
  // Implementation...
}

// Secure route pattern
router.put("/contacts/:contactId", requireAuth, async (req, res, next) => {
  try {
    // 1. Validate input
    const body = UpdateContactSchema.parse(req.body);

    // 2. Verify ownership
    const isOwner = await verifyOwnership(req.params.contactId, req.clientId!);
    if (!isOwner) {
      return res.status(403).json({ error: "forbidden" });
    }

    // 3. Perform operation
    const result = await updateContact(req.params.contactId, body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-25 | Initial checklist from security remediation |

---

## Related Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
