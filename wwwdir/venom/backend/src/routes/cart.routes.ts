import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

/** GET /cart - Get current pending orders in cart */
router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetOrders", {
      userid: req.clientId!,
      status: "Pending",
    });
    const orders = result.orders as { order?: unknown } | undefined;
    const raw = orders?.order;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const items = list.map((o: Record<string, unknown>) => ({
      orderId: String(o.id ?? o.orderid ?? ""),
      productId: String(o.pid ?? ""),
      productName: String(o.name ?? o.productname ?? ""),
      domain: String(o.domain ?? ""),
      billingCycle: String(o.billingcycle ?? ""),
      amount: String(o.amount ?? "0"),
      status: String(o.status ?? "Pending"),
    }));
    res.json({
      items,
      subtotal: items.reduce((sum, i) => sum + Number(i.amount), 0),
      tax: 0,
      total: items.reduce((sum, i) => sum + Number(i.amount), 0),
    });
  } catch (e) {
    next(e);
  }
});

/** POST /cart - Create new cart/quote */
router.post("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("CreateQuote", {
      userid: req.clientId!,
      subject: "Shopping Cart Quote",
    });
    res.status(201).json({
      quoteId: result.quoteid,
      success: true,
    });
  } catch (e) {
    next(e);
  }
});

const addItemSchema = z.object({
  productId: z.string(),
  billingCycle: z.string().optional(),
  domain: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  configOptions: z.record(z.union([z.string(), z.number()])).optional(),
  addons: z
    .array(z.object({ id: z.string(), quantity: z.number().int().positive() }))
    .optional(),
});

/** POST /cart/items - Add item to cart (creates pending order) */
router.post("/items", async (req, res, next) => {
  try {
    const body = addItemSchema.parse(req.body);
    const result = await whmcsCall<Record<string, unknown>>("AddOrder", {
      clientid: req.clientId!,
      pid: body.productId,
      billingcycle: body.billingCycle ?? "Monthly",
      domain: body.domain ?? "",
      paymentmethod: "mailin",
      quantity: body.quantity ?? 1,
      ...(body.configOptions ?? {}),
    });
    res.status(201).json({
      success: true,
      orderId: (result as { orderid?: unknown }).orderid ?? ((result as { orderids?: unknown[] }).orderids?.[0] ?? null),
    });
  } catch (e) {
    next(e);
  }
});

/** POST /cart/clear - Remove all pending orders (cart) */
router.post("/clear", async (req, res, next) => {
  try {
    const ordersResult = await whmcsCall<Record<string, unknown>>("GetOrders", {
      userid: req.clientId!,
      status: "Pending",
    });
    const orders = ordersResult.orders as { order?: unknown } | undefined;
    const raw = orders?.order;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const order of list) {
      const orderId = String((order as Record<string, unknown>).id ?? "");
      if (orderId) {
        await whmcsCall("DeleteOrder", { orderid: orderId });
      }
    }
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /cart/items/:orderId - Remove item from cart */
router.delete("/items/:orderId", async (req, res, next) => {
  try {
    await whmcsCall("DeleteOrder", {
      orderid: req.params.orderId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

const promoSchema = z.object({
  code: z.string().min(1),
});

/** POST /cart/promo - Apply promotion code */
router.post("/promo", async (req, res, next) => {
  try {
    const { code } = promoSchema.parse(req.body);
    // AddOrder with promo code
    const result = await whmcsCall<Record<string, unknown>>("AddOrder", {
      clientid: req.clientId!,
      promoCode: code,
      paymentmethod: "mailin",
    });
    res.json({
      success: true,
      orderId: result.orderid ?? null,
    });
  } catch (e) {
    next(e);
  }
});

const checkoutSchema = z.object({
  paymentMethodId: z.string().optional(),
  acceptTerms: z.boolean().optional(),
});

/** POST /cart/checkout - Finalize cart (accept pending orders) */
router.post("/checkout", async (req, res, next) => {
  try {
    checkoutSchema.parse(req.body);
    // Get pending orders
    const ordersResult = await whmcsCall<Record<string, unknown>>("GetOrders", {
      userid: req.clientId!,
      status: "Pending",
    });
    const orders = ordersResult.orders as { order?: unknown } | undefined;
    const raw = orders?.order;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

    // Accept each pending order
    const accepted: string[] = [];
    for (const order of list) {
      const orderId = (order as Record<string, unknown>).id as string;
      if (orderId) {
        await whmcsCall("AcceptOrder", { orderid: orderId });
        accepted.push(orderId);
      }
    }

    res.json({
      success: true,
      acceptedOrders: accepted,
      message: `${accepted.length} order(s) accepted`,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
