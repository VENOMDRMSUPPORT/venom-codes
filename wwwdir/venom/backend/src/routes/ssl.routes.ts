import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** GET /ssl - Get SSL certificates for client */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const params: Record<string, string> = { clientid: req.clientId! };
    if (req.query.limitstart) params.limitstart = String(req.query.limitstart);
    if (req.query.limitnum) params.limitnum = String(req.query.limitnum);
    
    const result = await whmcsCall<Record<string, unknown>>("GetSsl", params);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /ssl/:certId - Get specific SSL certificate */
router.get("/:certId", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetSsl", {
      certificateid: req.params.certId,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /ssl - Create new SSL certificate order */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { 
      certtype, 
      provider, 
      productId, 
      years,
      domain,
      csr,
      webserverType,
    } = req.body as {
      certtype?: string;
      provider?: string;
      productId?: string;
      years?: number;
      domain?: string;
      csr?: string;
      webserverType?: string;
    };
    
    const result = await whmcsCall<Record<string, unknown>>("CreateSslOrder", {
      clientid: req.clientId!,
      ...(certtype && { certtype }),
      ...(provider && { provider }),
      ...(productId && { pid: productId }),
      ...(years && { regperiod: years }),
      ...(domain && { domain }),
      ...(csr && { csr }),
      ...(webserverType && { webservertype: webserverType }),
    });
    
    res.status(201).json({
      success: result.result === "success",
      orderId: result.orderid ?? result.id ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** PUT /ssl/:certId - Update SSL certificate */
router.put("/:certId", requireAuth, async (req, res, next) => {
  try {
    const { csr, webserverType } = req.body as {
      csr?: string;
      webserverType?: string;
    };
    
    const result = await whmcsCall<Record<string, unknown>>("UpdateSsl", {
      certificateid: req.params.certId,
      ...(csr && { csr }),
      ...(webserverType && { webservertype: webserverType }),
    });
    
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /ssl/:certId/resend - Resend SSL certificate email */
router.post("/:certId/resend", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("ResendSslEmail", {
      certificateid: req.params.certId,
    });
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /ssl/:certId/renew - Renew SSL certificate */
router.post("/:certId/renew", requireAuth, async (req, res, next) => {
  try {
    const { years } = req.body as { years?: number };
    const result = await whmcsCall<Record<string, unknown>>("RenewSsl", {
      certificateid: req.params.certId,
      ...(years && { regperiod: years }),
    });
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /ssl/:certId/complete - Complete SSL certificate setup */
router.post("/:certId/complete", requireAuth, async (req, res, next) => {
  try {
    const { crt, caBundle } = req.body as { crt?: string; caBundle?: string };
    const result = await whmcsCall<Record<string, unknown>>("CompleteSsl", {
      certificateid: req.params.certId,
      ...(crt && { crt }),
      ...(caBundle && { cabundle: caBundle }),
    });
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
