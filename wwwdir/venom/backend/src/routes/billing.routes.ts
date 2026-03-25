import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** WHMCS-standard billing cycle labels (no dedicated GetBillingCycles External API action). */
const WHMCS_BILLING_CYCLES = [
  "Free Account",
  "One Time",
  "Monthly",
  "Quarterly",
  "Semi-Annually",
  "Annually",
  "Biennially",
  "Triennially",
];

/** GET /billing/cycles — static list aligned with WHMCS product cycle names */
router.get("/cycles", (_req, res) => {
  res.json({ cycles: WHMCS_BILLING_CYCLES, source: "static" });
});

/** GET /billing/currencies - Get supported currencies */
router.get("/currencies", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetCurrencies", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /billing/gateways — active payment gateways (WHMCS GetPaymentMethods).
 * For stored client pay methods use GET /api/paymethods (GetPayMethods).
 */
router.get("/gateways", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetPaymentMethods", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /billing/transactions - Get client transactions */
router.get("/transactions", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTransactions", {
      userid: req.clientId!,
      ...queryToWhmcsParams(req.query),
    });
    const transactions = result.transactions as { transaction?: unknown } | undefined;
    const raw = transactions?.transaction;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((t: Record<string, unknown>) => ({
      id: String(t.id ?? ""),
      date: String(t.date ?? ""),
      description: String(t.description ?? ""),
      amount: String(t.amount ?? "0"),
      fees: String(t.fees ?? "0"),
      total: String(t.total ?? "0"),
      invoiceId: t.invoiceid != null ? String(t.invoiceid) : null,
      transactionId: t.transactionid ?? null,
    }));
    res.json({ transactions: mapped });
  } catch (e) {
    next(e);
  }
});

/** POST /billing/apply-credit - Apply account credit to invoice */
router.post("/apply-credit", requireAuth, async (req, res, next) => {
  try {
    const { invoiceId, amount } = req.body as { invoiceId?: string; amount?: string };
    if (!invoiceId) {
      res.status(400).json({ error: "bad_request", message: "Invoice ID is required" });
      return;
    }
    await whmcsCall("ApplyCredit", {
      invoiceid: invoiceId,
      amount: amount ?? "",
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /billing/add-credit - Add credit to client account */
router.post("/add-credit", requireAuth, async (req, res, next) => {
  try {
    const { amount, description } = req.body as { amount?: string; description?: string };
    if (!amount) {
      res.status(400).json({ error: "bad_request", message: "Amount is required" });
      return;
    }
    await whmcsCall("AddCredit", {
      clientid: req.clientId!,
      amount,
      description: description ?? "",
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /billing/add-transaction - Add a transaction (manual payment) */
router.post("/transactions", requireAuth, async (req, res, next) => {
  try {
    const {
      amount,
      gateway,
      description,
      invoiceId,
      transactionId,
    } = req.body as {
      amount?: string;
      gateway?: string;
      description?: string;
      invoiceId?: string;
      transactionId?: string;
    };
    if (!amount) {
      res.status(400).json({ error: "bad_request", message: "Amount is required" });
      return;
    }
    await whmcsCall("AddTransaction", {
      clientid: req.clientId!,
      amount,
      gateway: gateway ?? "mailin",
      description: description ?? "",
      invoiceid: invoiceId ?? "",
      transid: transactionId ?? "",
    });
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
