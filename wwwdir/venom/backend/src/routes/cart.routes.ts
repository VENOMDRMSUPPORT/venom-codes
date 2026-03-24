import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

/** WHMCS cart flows vary by version; this returns a minimal cart shape for the SPA. */
router.get("/", async (_req, res) => {
  res.json({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    currency: "USD",
  });
});

router.post("/", async (_req, res) => {
  res.json({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    currency: "USD",
  });
});

const addItemSchema = z.object({
  productId: z.string(),
  billingCycle: z.string().optional(),
  quantity: z.number().int().positive().optional(),
});

router.post("/items", async (req, res, next) => {
  try {
    addItemSchema.parse(req.body);
    await whmcsCall("AddOrder", {
      clientid: req.clientId!,
      paymentmethod: "mailin",
      ...req.body,
    });
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.delete("/items/:itemId", async (req, res) => {
  res.json({ success: true, message: `Removed ${req.params.itemId}` });
});

const checkoutSchema = z.object({
  paymentMethodId: z.string().optional(),
});

router.post("/checkout", async (req, res, next) => {
  try {
    checkoutSchema.parse(req.body);
    res.json({
      orderId: "",
      invoiceId: "",
      total: 0,
      paymentUrl: null,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
