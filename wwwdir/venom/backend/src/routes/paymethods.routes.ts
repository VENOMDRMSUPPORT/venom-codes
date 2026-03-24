import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetPayMethods", {
      clientid: req.clientId!,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await whmcsCall("AddPayMethod", {
      clientid: req.clientId!,
      ...req.body,
    });
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

const captureSchema = z.object({
  amount: z.number().optional(),
});

router.post("/:payMethodId/capture", async (req, res, next) => {
  try {
    captureSchema.parse(req.body);
    await whmcsCall("CapturePayment", {
      paymentid: req.params.payMethodId,
      ...req.body,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.delete("/:payMethodId", async (req, res, next) => {
  try {
    await whmcsCall("DeletePayMethod", {
      paymethodid: req.params.payMethodId,
      clientid: req.clientId!,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
