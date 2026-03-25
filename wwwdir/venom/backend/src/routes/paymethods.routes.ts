/**
 * Client pay methods — static paths (e.g. POST /capture) before `/:payMethodId`.
 */
import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { mapPayMethodsList } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetPayMethods", {
      clientid: req.clientId!,
    });
    res.json(mapPayMethodsList(result));
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
  invoiceId: z.string().min(1),
  cvv: z.string().optional(),
});

/**
 * POST /paymethods/capture — WHMCS CapturePayment (invoiceid, optional cvv).
 * @see https://developers.whmcs.com/api-reference/capturepayment/
 */
router.post("/capture", async (req, res, next) => {
  try {
    const body = captureSchema.parse(req.body);
    await whmcsCall("CapturePayment", {
      invoiceid: body.invoiceId,
      ...(body.cvv !== undefined && body.cvv !== "" ? { cvv: body.cvv } : {}),
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
