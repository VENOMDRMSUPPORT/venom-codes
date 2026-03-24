import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapOrdersResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

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
    const result = await whmcsCall<Record<string, unknown>>("AddOrder", {
      clientid: req.clientId!,
      ...req.body,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetOrders", {
      id: req.params.orderId,
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
