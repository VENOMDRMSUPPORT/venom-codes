import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";

const router: IRouter = Router();

const triggerSchema = z.object({
  event: z.string().min(1),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

/** POST /notifications/trigger — WHMCS TriggerNotificationEvent (admin API) */
router.post("/trigger", async (req, res, next) => {
  try {
    const body = triggerSchema.parse(req.body);
    const flat: Record<string, string> = { event: body.event };
    if (body.parameters) {
      for (const [k, v] of Object.entries(body.parameters)) {
        flat[k] = String(v);
      }
    }
    const result = await whmcsCall<Record<string, unknown>>("TriggerNotificationEvent", flat);
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/settings", (_req, res) => {
  res.status(501).json({
    error: "not_implemented",
    message:
      "WHMCS notification preferences are not exposed as a single External API action. Configure in WHMCS Admin or via applicable WHMCS APIs for your version.",
  });
});

router.post("/settings", (_req, res) => {
  res.status(501).json({
    error: "not_implemented",
    message:
      "Updating notification settings via this API is not implemented. Use WHMCS Admin.",
  });
});

export default router;
