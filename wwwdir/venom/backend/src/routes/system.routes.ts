import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";

const router: IRouter = Router();

/** GET /system/details - Get WHMCS system details */
router.get("/details", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("WhmcsDetails", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /system/health - Check WHMCS API health */
router.get("/health", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetHealthStatus", {});
    res.json({
      status: result.status ?? "unknown",
      details: result,
    });
  } catch (e) {
    next(e);
  }
});

/** GET /system/stats - Get WHMCS statistics */
router.get("/stats", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetStats", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /system/email - Send email to client */
router.post("/email", async (req, res, next) => {
  try {
    const { to, subject, message, from } = req.body as {
      to?: string;
      subject?: string;
      message?: string;
      from?: string;
    };
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: "bad_request", 
        message: "to, subject, and message are required" 
      });
      return;
    }
    
    const result = await whmcsCall<Record<string, unknown>>("SendEmail", {
      messageto: to,
      subject,
      message,
      ...(from && { messagefrom: from }),
    });
    
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /system/encrypt - Encrypt a password */
router.post("/encrypt", async (req, res, next) => {
  try {
    const { password } = req.body as { password?: string };
    if (!password) {
      res.status(400).json({ error: "bad_request", message: "Password is required" });
      return;
    }
    const result = await whmcsCall<Record<string, unknown>>("EncryptPassword", {
      password2: password,
    });
    res.json({
      encrypted: result.password ?? result.encrypted ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /system/decrypt - Decrypt a password */
router.post("/decrypt", async (req, res, next) => {
  try {
    const { password } = req.body as { password?: string };
    if (!password) {
      res.status(400).json({ error: "bad_request", message: "Password is required" });
      return;
    }
    const result = await whmcsCall<Record<string, unknown>>("DecryptPassword", {
      password: password,
    });
    res.json({
      decrypted: result.password ?? result.decrypted ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
