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

export default router;
