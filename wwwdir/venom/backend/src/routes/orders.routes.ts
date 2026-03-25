import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapOrdersResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

// Validation schemas for order operations
// This schema validates known safe fields and prevents parameter injection
const addOrderSchema = z.object({
  pid: z.union([z.string(), z.number()]).optional(),
  domain: z.string().max(255).optional(),
  billingcycle: z.string().max(50).optional(),
  promocode: z.string().max(50).optional(),
  paymentmethod: z.string().max(50).optional(),
  // Prevent client ID override - security critical
  clientid: z.never().optional(),
  userid: z.never().optional(),
});

/**
 * Safely extracts allowed order parameters from request body
 * Prevents parameter injection by only accepting known safe fields
 */
function sanitizeOrderParams(body: Record<string, unknown>): Record<string, string | number> {
  const safeParams: Record<string, string | number> = {};
  const allowedFields = ["pid", "domain", "billingcycle", "promocode", "paymentmethod"];

  // Also allow configoptions, customfields, and addons (handled by WHMCS)
  // These are complex structures that WHMCS API parses directly
  const complexPrefixes = ["configoptions", "customfields", "addons"];

  for (const [key, value] of Object.entries(body)) {
    // Check if this is an allowed simple field
    if (allowedFields.includes(key)) {
      if (typeof value === "string" || typeof value === "number") {
        safeParams[key] = value;
      }
    }
    // Check if this is a complex field (starts with allowed prefix)
    else if (complexPrefixes.some((prefix) => key.startsWith(prefix))) {
      if (typeof value === "string" || typeof value === "number") {
        safeParams[key] = value;
      }
    }
    // Reject unknown fields for security
    else if (key === "clientid" || key === "userid") {
      // Security: Never allow clientid/userid override
      throw new Error(`Cannot override ${key}`);
    }
  }

  return safeParams;
}

const router: IRouter = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetOrders", {
      userid: req.clientId!,
      ...queryToWhmcsParams(req.query),
    });
    const orders = mapOrdersResponse(result);
    res.json({ orders });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // Sanitize request body to prevent parameter injection
    const safeParams = sanitizeOrderParams(req.body);
    const result = await whmcsCall<Record<string, unknown>>("AddOrder", {
      clientid: req.clientId!,
      ...safeParams,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    // IDOR fix: Restrict to authenticated user's orders
    const result = await whmcsCall<Record<string, unknown>>("GetOrders", {
      id: req.params.orderId,
      userid: req.clientId!, // Ownership check
    });
    const orders = mapOrdersResponse(result);
    const one = orders[0];
    if (!one) {
      res.status(404).json({ error: "not_found", message: "Order not found" });
      return;
    }
    res.json(one);
  } catch (e) {
    next(e);
  }
});

router.post("/:orderId/cancel", async (req, res, next) => {
  try {
    // IDOR fix: Verify ownership before canceling
    // First check if order belongs to user
    const orderCheck = await whmcsCall<Record<string, unknown>>("GetOrders", {
      id: req.params.orderId,
      userid: req.clientId!,
    });
    if (!orderCheck.orders || (Array.isArray(orderCheck.orders) && orderCheck.orders.length === 0)) {
      res.status(403).json({ error: "forbidden", message: "You can only cancel your own orders" });
      return;
    }
    await whmcsCall("CancelOrder", {
      orderid: req.params.orderId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:orderId/accept", async (req, res, next) => {
  try {
    // IDOR fix: Verify ownership before accepting
    const orderCheck = await whmcsCall<Record<string, unknown>>("GetOrders", {
      id: req.params.orderId,
      userid: req.clientId!,
    });
    if (!orderCheck.orders || (Array.isArray(orderCheck.orders) && orderCheck.orders.length === 0)) {
      res.status(403).json({ error: "forbidden", message: "You can only accept your own orders" });
      return;
    }
    await whmcsCall("AcceptOrder", {
      orderid: req.params.orderId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:orderId/pending", async (req, res, next) => {
  try {
    // IDOR fix: Verify ownership before marking pending
    const orderCheck = await whmcsCall<Record<string, unknown>>("GetOrders", {
      id: req.params.orderId,
      userid: req.clientId!,
    });
    if (!orderCheck.orders || (Array.isArray(orderCheck.orders) && orderCheck.orders.length === 0)) {
      res.status(403).json({ error: "forbidden", message: "Access denied" });
      return;
    }
    await whmcsCall("PendingOrder", {
      orderid: req.params.orderId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /orders/:orderId/fraud - Mark order as fraud */
router.post("/:orderId/fraud", async (req, res, next) => {
  try {
    // IDOR fix: Verify ownership before marking as fraud
    const orderCheck = await whmcsCall<Record<string, unknown>>("GetOrders", {
      id: req.params.orderId,
      userid: req.clientId!,
    });
    if (!orderCheck.orders || (Array.isArray(orderCheck.orders) && orderCheck.orders.length === 0)) {
      res.status(403).json({ error: "forbidden", message: "Access denied" });
      return;
    }
    await whmcsCall("FraudOrder", {
      orderid: req.params.orderId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /orders/statuses - Get all order statuses */
router.get("/statuses", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetOrderStatuses", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
