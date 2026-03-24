import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapTicketsResponse } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/departments", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetSupportDepartments",
      {},
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTickets", {
      clientid: req.clientId!,
      ...queryToWhmcsParams(req.query),
    });
    const tickets = mapTicketsResponse(result);
    res.json({ tickets });
  } catch (e) {
    next(e);
  }
});

const createTicketSchema = z.object({
  departmentId: z.union([z.string(), z.number()]),
  subject: z.string().min(1),
  message: z.string().min(1),
  priority: z.string().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const body = createTicketSchema.parse(req.body);
    const result = await whmcsCall<Record<string, unknown>>("OpenTicket", {
      deptid: String(body.departmentId),
      subject: body.subject,
      message: body.message,
      clientid: req.clientId!,
      priority: body.priority,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:ticketId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTicket", {
      ticketid: req.params.ticketId,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

const replySchema = z.object({
  message: z.string().min(1),
});

router.post("/:ticketId/reply", async (req, res, next) => {
  try {
    const body = replySchema.parse(req.body);
    await whmcsCall("AddTicketReply", {
      ticketid: req.params.ticketId,
      message: body.message,
      clientid: req.clientId!,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:ticketId/close", async (req, res, next) => {
  try {
    await whmcsCall("UpdateTicket", {
      ticketid: req.params.ticketId,
      status: "Closed",
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /tickets/statuses - Get support ticket statuses */
router.get("/statuses", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetSupportStatuses", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /tickets/counts - Get ticket counts by status */
router.get("/counts", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTicketCounts", {
      clientid: req.clientId!,
    });
    res.json({
      open: Number(result.open ?? 0),
      awaitingReply: Number(result.awaiting_reply ?? 0),
      inProgress: Number(result.in_progress ?? 0),
      onHold: Number(result.on_hold ?? 0),
      closed: Number(result.closed ?? 0),
      total: Number(result.total ?? 0),
    });
  } catch (e) {
    next(e);
  }
});

/** GET /tickets/:ticketId/notes - Get ticket notes */
router.get("/:ticketId/notes", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTicketNotes", {
      ticketid: req.params.ticketId,
    });
    const notes = result.notes as { note?: unknown } | undefined;
    const raw = notes?.note;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((n: Record<string, unknown>) => ({
      id: String(n.id ?? ""),
      date: String(n.date ?? ""),
      author: String(n.admin ?? ""),
      message: String(n.note ?? ""),
    }));
    res.json({ notes: mapped });
  } catch (e) {
    next(e);
  }
});

/** POST /tickets/:ticketId/notes - Add a note to ticket */
router.post("/:ticketId/notes", async (req, res, next) => {
  try {
    const { message } = req.body as { message?: string };
    if (!message) {
      res.status(400).json({ error: "bad_request", message: "Note message is required" });
      return;
    }
    await whmcsCall("AddTicketNote", {
      ticketid: req.params.ticketId,
      message,
    });
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /tickets/:ticketId/attachments - Get ticket attachments */
router.get("/:ticketId/attachments", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTicketAttachment", {
      ticketid: req.params.ticketId,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** DELETE /tickets/:ticketId/replies/:replyId - Delete ticket reply */
router.delete("/:ticketId/replies/:replyId", async (req, res, next) => {
  try {
    await whmcsCall("DeleteTicketReply", {
      ticketid: req.params.ticketId,
      replyid: req.params.replyId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /tickets/predefined/categories - Get predefined ticket categories */
router.get("/predefined/categories", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetTicketPredefinedCats", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /tickets/predefined/replies - Get predefined ticket replies */
router.get("/predefined/replies", async (req, res, next) => {
  try {
    const category = req.query.category;
    const result = await whmcsCall<Record<string, unknown>>("GetTicketPredefinedReplies", {
      ...(category && typeof category === "string" ? { category } : {}),
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /tickets/block-sender - Block a ticket sender */
router.post("/block-sender", async (req, res, next) => {
  try {
    const { email, ip } = req.body as { email?: string; ip?: string };
    if (!email && !ip) {
      res.status(400).json({ error: "bad_request", message: "Email or IP is required" });
      return;
    }
    await whmcsCall("BlockTicketSender", {
      ...(email && { email }),
      ...(ip && { ip }),
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
