import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapQuotesResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetQuotes", {
      userid: req.clientId!,
      ...queryToWhmcsParams(req.query),
    });
    const quotes = mapQuotesResponse(result);
    res.json({ quotes });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("CreateQuote", {
      userid: req.clientId!,
      subject: String((req.body as { subject?: string }).subject ?? "Quote request"),
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:quoteId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetQuotes", {
      id: req.params.quoteId,
    });
    const quotes = mapQuotesResponse(result);
    const one = quotes[0];
    if (!one) {
      res.status(404).json({ error: "not_found", message: "Quote not found" });
      return;
    }
    res.json(one);
  } catch (e) {
    next(e);
  }
});

router.put("/:quoteId", async (req, res, next) => {
  try {
    await whmcsCall("UpdateQuote", {
      quoteid: req.params.quoteId,
      ...req.body,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:quoteId/accept", async (req, res, next) => {
  try {
    await whmcsCall("AcceptQuote", {
      quoteid: req.params.quoteId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:quoteId/send", async (req, res, next) => {
  try {
    await whmcsCall("SendQuote", {
      quoteid: req.params.quoteId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /quotes/:quoteId - Delete a quote */
router.delete("/:quoteId", async (req, res, next) => {
  try {
    await whmcsCall("DeleteQuote", {
      quoteid: req.params.quoteId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
