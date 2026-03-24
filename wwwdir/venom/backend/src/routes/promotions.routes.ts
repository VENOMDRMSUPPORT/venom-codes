import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";

const router: IRouter = Router();

/** GET /promotions - Get available promotions and coupons */
router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetPromotions", {
      ...queryToWhmcsParams(req.query),
    });
    const promotions = result.promotions as { promotion?: unknown } | undefined;
    const raw = promotions?.promotion;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((p: Record<string, unknown>) => ({
      code: String(p.code ?? ""),
      type: String(p.type ?? ""),
      value: String(p.value ?? ""),
      duration: String(p.duration ?? ""),
      requires: String(p.requires ?? ""),
      maxUses: Number(p.maxuses ?? 0),
      used: Number(p.used ?? 0),
      startDate: p.startdate ?? null,
      endDate: p.enddate ?? null,
      cycles: String(p.cycles ?? ""),
    }));
    res.json({ promotions: mapped });
  } catch (e) {
    next(e);
  }
});

export default router;
