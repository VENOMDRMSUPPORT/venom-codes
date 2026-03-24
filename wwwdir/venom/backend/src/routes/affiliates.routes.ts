import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** GET /affiliates - Get affiliate information for client */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const queryParams = queryToWhmcsParams(req.query);
    const result = await whmcsCall<Record<string, unknown>>("GetAffiliates", {
      clientid: req.clientId!,
      limitstart: typeof queryParams.limitstart === "string" ? queryParams.limitstart : "0",
      limitnum: typeof queryParams.limitnum === "string" ? queryParams.limitnum : "100",
    });
    const affiliates = result.affiliates as { affiliate?: unknown } | undefined;
    const raw = affiliates?.affiliate;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((a: Record<string, unknown>) => ({
      id: String(a.id ?? ""),
      clientId: String(a.clientid ?? ""),
      pendingCommission: String(a.pendingcommissions ?? a.pending ?? "0.00"),
      availableCommission: String(a.availablecommissions ?? a.available ?? "0.00"),
      withdrawn: String(a.withdrawn ?? "0.00"),
      referrals: Number(a.referrals ?? 0),
      conversionRate: String(a.conversionrate ?? "0"),
      lastPaid: a.lastpaid ?? null,
      status: String(a.status ?? "Active"),
    }));
    res.json({ affiliates: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /affiliates/:affiliateId - Get specific affiliate details */
router.get("/:affiliateId", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAffiliates", {
      clientid: req.clientId!,
      affiliateid: req.params.affiliateId,
      limitstart: "0",
      limitnum: "1",
    });
    const affiliates = result.affiliates as { affiliate?: unknown } | undefined;
    const raw = affiliates?.affiliate;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (list.length === 0) {
      res.status(404).json({ error: "not_found", message: "Affiliate not found" });
      return;
    }
    res.json(list[0]);
  } catch (e) {
    next(e);
  }
});

/** POST /affiliates/:affiliateId/activate - Activate affiliate account */
router.post("/:affiliateId/activate", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("AffiliateActivate", {
      affiliateid: req.params.affiliateId,
    });
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** GET /affiliates/:affiliateId/stats - Get affiliate statistics */
router.get("/:affiliateId/stats", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAffiliates", {
      clientid: req.clientId!,
      affiliateid: req.params.affiliateId,
    });
    const affiliates = result.affiliates as { affiliate?: unknown } | undefined;
    const raw = affiliates?.affiliate;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const affiliate = list[0] as Record<string, unknown> | undefined;
    
    if (!affiliate) {
      res.status(404).json({ error: "not_found", message: "Affiliate not found" });
      return;
    }

    res.json({
      pendingCommission: affiliate.pendingcommissions ?? affiliate.pending ?? "0.00",
      availableCommission: affiliate.availablecommissions ?? affiliate.available ?? "0.00",
      totalWithdrawn: affiliate.withdrawn ?? "0.00",
      referralCount: Number(affiliate.referrals ?? 0),
      conversionRate: affiliate.conversionrate ?? "0",
      banners: affiliate.banners ?? [],
      links: affiliate.links ?? [],
      lastPaidDate: affiliate.lastpaid ?? null,
      status: affiliate.status ?? "Active",
    });
  } catch (e) {
    next(e);
  }
});

/** GET /affiliates/pending-commissions - Get pending commissions */
router.get("/pending-commissions", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAffiliates", {
      clientid: req.clientId!,
      limitstart: "0",
      limitnum: "100",
    });
    const affiliates = result.affiliates as { affiliate?: unknown } | undefined;
    const raw = affiliates?.affiliate;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    
    const pending = list
      .filter((a: Record<string, unknown>) => Number(a.pendingcommissions ?? a.pending ?? 0) > 0)
      .map((a: Record<string, unknown>) => ({
        id: String(a.id ?? ""),
        amount: String(a.pendingcommissions ?? a.pending ?? "0.00"),
        date: a.pendingdate ?? null,
      }));
    
    res.json({ pendingCommissions: pending });
  } catch (e) {
    next(e);
  }
});

/** GET /affiliates/withdrawn-history - Get withdrawn commissions history */
router.get("/withdrawn-history", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAffiliates", {
      clientid: req.clientId!,
      limitstart: "0",
      limitnum: "100",
    });
    const affiliates = result.affiliates as { affiliate?: unknown } | undefined;
    const raw = affiliates?.affiliate;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    
    // Extract withdrawn history from affiliates
    const withdrawn = list
      .filter((a: Record<string, unknown>) => Number(a.withdrawn ?? 0) > 0)
      .map((a: Record<string, unknown>) => ({
        id: String(a.id ?? ""),
        amount: String(a.withdrawn ?? "0.00"),
        lastPaid: a.lastpaid ?? null,
      }));
    
    res.json({ withdrawnHistory: withdrawn });
  } catch (e) {
    next(e);
  }
});

export default router;
