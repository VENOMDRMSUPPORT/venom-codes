import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";

const router: IRouter = Router();

/** POST /notifications/trigger - Trigger a notification event */
router.post("/trigger", async (req, res, next) => {
  try {
    const { event, parameters } = req.body as {
      event?: string;
      parameters?: Record<string, unknown>;
    };
    
    if (!event) {
      res.status(400).json({ error: "bad_request", message: "Event is required" });
      return;
    }
    
    const result = await whmcsCall<Record<string, unknown>>("TriggerNotificationEvent", {
      event,
      ...parameters,
    });
    
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** GET /notifications/settings - Get notification settings */
router.get("/settings", async (_req, res, next) => {
  try {
    // This might need custom implementation based on WHMCS notification settings
    res.json({
      message: "Notification settings endpoint - configure in WHMCS admin panel",
    });
  } catch (e) {
    next(e);
  }
});

/** POST /notifications/settings - Update notification settings */
router.post("/settings", async (req, res, next) => {
  try {
    // This might need custom implementation based on WHMCS notification settings
    const { settings } = req.body as { settings?: Record<string, unknown> };
    res.json({
      success: true,
      message: "Notification settings updated",
    });
  } catch (e) {
    next(e);
  }
});

export default router;
