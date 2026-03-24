import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";

const router: IRouter = Router();

/** GET /products - Get all products */
router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProducts", {
      ...queryToWhmcsParams(req.query),
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /products/groups - Get product groups */
router.get("/groups", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProducts", {});
    const groups = result.groups as { group?: unknown } | undefined;
    const raw = groups?.group;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((g: Record<string, unknown>) => ({
      id: String(g.id ?? ""),
      name: String(g.name ?? ""),
      order: Number(g.order ?? 0),
    }));
    res.json({ groups: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /products/:productId - Get single product details */
router.get("/:productId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProducts", {
      pid: req.params.productId,
    });
    const products = result.products as { product?: unknown } | undefined;
    const raw = products?.product;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (list.length === 0) {
      res.status(404).json({ error: "not_found", message: "Product not found" });
      return;
    }
    res.json(list[0]);
  } catch (e) {
    next(e);
  }
});

/** GET /products/:productId/addons - Get addons for a product */
router.get("/:productId/addons", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProducts", {
      pid: req.params.productId,
    });
    const products = result.products as { product?: unknown } | undefined;
    const raw = products?.product;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const addons = (list[0] as Record<string, unknown>)?.addons;
    res.json({ addons: addons ?? [] });
  } catch (e) {
    next(e);
  }
});

/** GET /products/pricing - Get TLD/domain pricing */
router.get("/pricing", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTLDPricing", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
