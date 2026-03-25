import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** GET /oauth/credentials - List OAuth credentials */
router.get("/credentials", requireAuth, async (req, res, next) => {
  try {
    const params: Record<string, string> = {};
    if (req.query.limitstart) params.limitstart = String(req.query.limitstart);
    if (req.query.limitnum) params.limitnum = String(req.query.limitnum);
    
    const result = await whmcsCall<Record<string, unknown>>("ListOAuthCredentials", params);
    const credentials = result.credentials as { credential?: unknown } | undefined;
    const raw = credentials?.credential;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((c: Record<string, unknown>) => ({
      id: String(c.id ?? ""),
      clientId: String(c.clientid ?? ""),
      name: String(c.name ?? ""),
      secret: String(c.secret ?? ""),
      scope: String(c.scope ?? ""),
      redirectUri: String(c.redirecturi ?? c.redirect_uri ?? ""),
      createdAt: c.created_at ?? c.created ?? null,
    }));
    res.json({ credentials: mapped });
  } catch (e) {
    next(e);
  }
});

const createCredentialSchema = z.object({
  name: z.string().min(1),
  scope: z.string().optional(),
  redirectUri: z.string().url().optional(),
});

/** POST /oauth/credentials - Create OAuth credential */
router.post("/credentials", requireAuth, async (req, res, next) => {
  try {
    const body = createCredentialSchema.parse(req.body);
    const params: Record<string, string> = { clientid: req.clientId!, name: body.name };
    if (body.scope) params.scope = body.scope;
    if (body.redirectUri) params.redirecturi = body.redirectUri;
    
    const result = await whmcsCall<Record<string, unknown>>("CreateOAuthCredential", params as Record<string, string>);
    res.status(201).json({
      success: result.result === "success",
      credentialId: result.id ?? result.credentialid ?? null,
      secret: result.secret ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** GET /oauth/credentials/:credentialId - Get specific OAuth credential */
router.get("/credentials/:credentialId", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("ListOAuthCredentials", {
      credentialid: req.params.credentialId,
    });
    const credentials = result.credentials as { credential?: unknown } | undefined;
    const raw = credentials?.credential;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (list.length === 0) {
      res.status(404).json({ error: "not_found", message: "Credential not found" });
      return;
    }
    res.json(list[0]);
  } catch (e) {
    next(e);
  }
});

const updateCredentialSchema = z.object({
  name: z.string().optional(),
  scope: z.string().optional(),
  redirectUri: z.string().url().optional(),
});

/** PUT /oauth/credentials/:credentialId - Update OAuth credential */
router.put("/credentials/:credentialId", requireAuth, async (req, res, next) => {
  try {
    const body = updateCredentialSchema.parse(req.body);
    const params: Record<string, string> = { credentialid: String(req.params.credentialId) };
    if (body.name) params.name = body.name;
    if (body.scope) params.scope = body.scope;
    if (body.redirectUri) params.redirecturi = body.redirectUri;
    
    await whmcsCall("UpdateOAuthCredential", params as Record<string, string>);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /oauth/credentials/:credentialId - Delete OAuth credential */
router.delete("/credentials/:credentialId", requireAuth, async (req, res, next) => {
  try {
    await whmcsCall("DeleteOAuthCredential", {
      credentialid: String(req.params.credentialId),
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

const ssoTokenSchema = z.object({
  destination: z.string().optional(),
  serviceId: z.string().optional(),
  domainId: z.string().optional(),
  userId: z.string().optional(),
  ssoRedirectPath: z.string().optional(),
});

/**
 * POST /oauth/token — WHMCS CreateSsoToken (client SSO), not OAuth2 token exchange.
 * @see https://developers.whmcs.com/api-reference/createssotoken/
 */
router.post("/token", requireAuth, async (req, res, next) => {
  try {
    const body = ssoTokenSchema.parse(req.body ?? {});
    const params: Record<string, string> = {
      client_id: req.clientId!,
    };
    if (body.destination) params.destination = body.destination;
    if (body.serviceId) params.service_id = body.serviceId;
    if (body.domainId) params.domain_id = body.domainId;
    if (body.userId) params.user_id = body.userId;
    if (body.ssoRedirectPath) params.sso_redirect_path = body.ssoRedirectPath;

    const result = await whmcsCall<Record<string, unknown>>("CreateSsoToken", params);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
