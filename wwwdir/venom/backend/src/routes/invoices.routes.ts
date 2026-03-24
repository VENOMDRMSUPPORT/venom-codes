import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapInvoicesResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetInvoices", {
      userid: req.clientId!,
      ...queryToWhmcsParams(req.query),
    });
    const invoices = mapInvoicesResponse(result);
    res.json({ invoices });
  } catch (e) {
    next(e);
  }
});

router.get("/:invoiceId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetInvoice", {
      invoiceid: req.params.invoiceId,
    });
    const inv = result as Record<string, unknown>;
    res.json({
      id: String(inv.id ?? inv.invoiceid ?? req.params.invoiceId),
      status: String(inv.status ?? ""),
      date: inv.date != null ? String(inv.date) : undefined,
      dueDate: inv.duedate != null ? String(inv.duedate) : undefined,
      total: String(inv.total ?? inv.balance ?? "0"),
      subtotal: inv.subtotal != null ? String(inv.subtotal) : undefined,
      taxAmount: inv.tax != null ? String(inv.tax) : undefined,
      credit: inv.credit != null ? String(inv.credit) : undefined,
      paymentMethod:
        inv.paymentmethod === null || inv.paymentmethod === undefined
          ? null
          : String(inv.paymentmethod),
      items: inv.items,
      notes:
        inv.notes === null || inv.notes === undefined ? null : String(inv.notes),
    });
  } catch (e) {
    next(e);
  }
});

const payBody = z.object({
  payMethodId: z.string().optional(),
  capture: z.boolean().optional(),
});

router.post("/:invoiceId/pay", async (req, res, next) => {
  try {
    const body = payBody.parse(req.body);
    const result = await whmcsCall<Record<string, unknown>>("AddInvoicePayment", {
      invoiceid: req.params.invoiceId,
      transid: body.payMethodId ?? "",
      gateway: "manual",
      amount: "0",
    });
    res.json({
      success: true,
      transactionId: String(result.transactionid ?? ""),
      status: "paid",
    });
  } catch (e) {
    next(e);
  }
});

/** POST /invoices - Create a new invoice */
router.post("/", async (req, res, next) => {
  try {
    const {
      items,
      clientId,
    } = req.body as {
      items?: Array<{ description: string; amount: string }>;
      clientId?: string;
    };
    
    // Build items string for WHMCS API
    const itemsData = items 
      ? items.map((item, index) => {
          const prefix = `item${index + 1}`;
          return `${prefix}description=${encodeURIComponent(item.description)}&${prefix}amount=${encodeURIComponent(item.amount)}`;
        }).join("&")
      : "";
    
    const result = await whmcsCall<Record<string, unknown>>("CreateInvoice", {
      userid: clientId ?? req.clientId!,
      ...(itemsData && { lineitems: itemsData } as Record<string, unknown>),
    });
    res.status(201).json({
      success: true,
      invoiceId: (result as { id?: unknown }).id ?? (result as { invoiceid?: unknown }).invoiceid ?? null,
    });
  } catch (e) {
    next(e);
  }
});

/** PUT /invoices/:invoiceId - Update an invoice */
router.put("/:invoiceId", async (req, res, next) => {
  try {
    const { status, notes, dueDate } = req.body as {
      status?: string;
      notes?: string;
      dueDate?: string;
    };
    await whmcsCall("UpdateInvoice", {
      invoiceid: req.params.invoiceId,
      ...(status && { status }),
      ...(notes && { notes }),
      ...(dueDate && { duedate: dueDate }),
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
