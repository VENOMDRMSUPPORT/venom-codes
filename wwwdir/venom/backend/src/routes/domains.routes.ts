import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapDomainsResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireDomainOwnership } from "../middlewares/authorization.js";

const router: IRouter = Router();

router.get("/whois", async (req, res, next) => {
  try {
    const domain = req.query.domain as string | undefined;
    if (!domain) {
      res.status(400).json({ error: "bad_request", message: "domain is required" });
      return;
    }
    const result = await whmcsCall<Record<string, unknown>>("DomainWhois", {
      domain,
    });
    res.json({
      domain,
      available: result.status === "available" || result.available === true,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetClientsDomains", {
      clientid: req.clientId!,
      ...queryToWhmcsParams(req.query),
    });
    const domains = mapDomainsResponse(result);
    res.json({ domains });
  } catch (e) {
    next(e);
  }
});

router.get("/:domainId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetClientsDomains", {
      clientid: req.clientId!,
      domainid: req.params.domainId,
    });
    const domains = mapDomainsResponse(result);
    const one = domains.find((d) => d.id === req.params.domainId) ?? domains[0];
    if (!one) {
      res.status(404).json({ error: "not_found", message: "Domain not found" });
      return;
    }
    res.json(one);
  } catch (e) {
    next(e);
  }
});

const nsSchema = z.object({
  nameservers: z.array(z.string()).min(2),
});

router.put("/:domainId/nameservers", requireDomainOwnership, async (req, res, next) => {
  try {
    const body = nsSchema.parse(req.body);
    await whmcsCall("DomainUpdateNameservers", {
      domainid: req.params.domainId,
      ns1: body.nameservers[0],
      ns2: body.nameservers[1],
      ns3: body.nameservers[2],
      ns4: body.nameservers[3],
      ns5: body.nameservers[4],
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

const renewSchema = z.object({
  years: z.number().int().positive().optional(),
});

router.post("/:domainId/renew", requireDomainOwnership, async (req, res, next) => {
  try {
    const body = renewSchema.parse(req.body);
    await whmcsCall("DomainRenew", {
      domainid: req.params.domainId,
      regperiod: body.years ?? 1,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

const autoRenewSchema = z.object({
  enabled: z.boolean(),
});

router.post("/:domainId/autorenew", requireDomainOwnership, async (req, res, next) => {
  try {
    const body = autoRenewSchema.parse(req.body);
    await whmcsCall("DomainUpdateAutoRenew", {
      domainid: req.params.domainId,
      autorenew: body.enabled ? "1" : "0",
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:domainId/idprotection", requireDomainOwnership, async (req, res, next) => {
  try {
    const { enable } = req.body as { enable?: boolean };
    await whmcsCall("DomainToggleIdProtect", {
      domainid: req.params.domainId,
      ...(enable !== undefined && { idprotect: enable ? "1" : "0" }),
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:domainId/registrarlock", requireDomainOwnership, async (req, res, next) => {
  try {
    const { lock } = req.body as { lock?: boolean };
    await whmcsCall("DomainUpdateLockingStatus", {
      domainid: req.params.domainId,
      lockstatus: lock ?? true,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

const transferSchema = z.object({
  eppCode: z.string().min(1),
});

router.post("/:domainId/transfer", requireDomainOwnership, async (req, res, next) => {
  try {
    const body = transferSchema.parse(req.body);
    await whmcsCall("DomainTransfer", {
      domainid: req.params.domainId,
      eppcode: body.eppCode,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /domains/:domainId/lock-status - Get domain registrar lock status */
router.get("/:domainId/lock-status", requireDomainOwnership, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("DomainGetLockingStatus", {
      domainid: req.params.domainId,
    });
    res.json({
      locked: result.lockstatus === "locked" || result.lockstatus === "1",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** PUT /domains/:domainId/lock-status - Enable/disable registrar lock */
router.put("/:domainId/lock-status", requireDomainOwnership, async (req, res, next) => {
  try {
    const { lock } = req.body as { lock?: boolean };
    await whmcsCall("DomainUpdateLockingStatus", {
      domainid: req.params.domainId,
      lock: lock === false ? "unlock" : "lock",
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /domains/:domainId/nameservers - Get domain nameservers */
router.get("/:domainId/nameservers", requireDomainOwnership, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("DomainGetNameservers", {
      domainid: req.params.domainId,
    });
    res.json({
      ns1: result.ns1 ?? null,
      ns2: result.ns2 ?? null,
      ns3: result.ns3 ?? null,
      ns4: result.ns4 ?? null,
      ns5: result.ns5 ?? null,
    });
  } catch (e) {
    next(e);
  }
});

/** GET /domains/:domainId/whois - Get domain WHOIS information */
router.get("/:domainId/whois", requireDomainOwnership, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("DomainGetWhoisInfo", {
      domainid: req.params.domainId,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** PUT /domains/:domainId/whois - Update domain WHOIS information */
router.put("/:domainId/whois", requireDomainOwnership, async (req, res, next) => {
  try {
    const { contactInformation } = req.body as { contactInformation?: Record<string, unknown> };
    await whmcsCall("DomainUpdateWhoisInfo", {
      domainid: req.params.domainId,
      ...contactInformation,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /domains/:domainId/epp - Request EPP code for domain transfer */
router.post("/:domainId/epp", requireDomainOwnership, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("DomainRequestEPP", {
      domainid: req.params.domainId,
    });
    res.json({
      success: true,
      eppCode: result.eppcode ?? null,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /domains/:domainId/register - Register a domain (admin only typically) */
router.post("/:domainId/register", requireDomainOwnership, async (req, res, next) => {
  try {
    const {
      years = 1,
      nameservers,
      registrant,
    } = req.body as {
      years?: number;
      nameservers?: string[];
      registrant?: Record<string, unknown>;
    };
    await whmcsCall("DomainRegister", {
      domainid: req.params.domainId,
      regperiod: years,
      ns1: nameservers?.[0],
      ns2: nameservers?.[1],
      ns3: nameservers?.[2],
      ns4: nameservers?.[3],
      ...registrant,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /domains/:domainId/release - Release domain to another registrar */
router.post("/:domainId/release", requireDomainOwnership, async (req, res, next) => {
  try {
    const { tag } = req.body as { tag?: string };
    if (!tag) {
      res.status(400).json({ error: "bad_request", message: "Tag is required" });
      return;
    }
    await whmcsCall("DomainRelease", {
      domainid: req.params.domainId,
      transfertag: tag,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
