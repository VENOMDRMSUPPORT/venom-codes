import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapDomainsResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

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

router.put("/:domainId/nameservers", async (req, res, next) => {
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

router.post("/:domainId/renew", async (req, res, next) => {
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

router.post("/:domainId/idprotection", async (req, res, next) => {
  try {
    await whmcsCall("DomainUpdateIDProtection", {
      domainid: req.params.domainId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:domainId/registrarlock", async (req, res, next) => {
  try {
    await whmcsCall("DomainRegistrarLock", {
      domainid: req.params.domainId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:domainId/autorenew", async (req, res, next) => {
  try {
    await whmcsCall("DomainUpdateAutorenew", {
      domainid: req.params.domainId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

const transferSchema = z.object({
  eppCode: z.string().min(1),
});

router.post("/:domainId/transfer", async (req, res, next) => {
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

export default router;
