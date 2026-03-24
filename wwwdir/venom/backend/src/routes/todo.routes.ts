import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** GET /todo - Get all todo items */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const params: Record<string, string> = {};
    if (req.query.limitstart) params.limitstart = String(req.query.limitstart);
    if (req.query.limitnum) params.limitnum = String(req.query.limitnum);
    if (req.query.status) params.status = String(req.query.status);
    
    const result = await whmcsCall<Record<string, unknown>>("GetToDoItems", params);
    const items = result.items as { item?: unknown } | undefined;
    const raw = items?.item;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((t: Record<string, unknown>) => ({
      id: String(t.id ?? ""),
      date: String(t.date ?? ""),
      description: String(t.description ?? ""),
      status: String(t.status ?? ""),
      admin: String(t.admin ?? ""),
      due: t.due ?? null,
    }));
    res.json({ todos: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /todo/statuses - Get todo item statuses */
router.get("/statuses", requireAuth, async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetToDoItemStatuses", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /todo/:todoId - Get specific todo item */
router.get("/:todoId", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetToDoItems", {
      itemid: req.params.todoId,
    } as Record<string, string>);
    const items = result.items as { item?: unknown } | undefined;
    const raw = items?.item;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (list.length === 0) {
      res.status(404).json({ error: "not_found", message: "Todo item not found" });
      return;
    }
    res.json(list[0]);
  } catch (e) {
    next(e);
  }
});

const updateTodoSchema = z.object({
  status: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

/** PUT /todo/:todoId - Update todo item */
router.put("/:todoId", requireAuth, async (req, res, next) => {
  try {
    const body = updateTodoSchema.parse(req.body);
    const params: Record<string, string> = { itemid: String(req.params.todoId) };
    if (body.status) params.status = body.status;
    if (body.description) params.description = body.description;
    if (body.dueDate) params.duedate = body.dueDate;
    
    await whmcsCall("UpdateToDoItem", params as Record<string, string>);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /todo/:todoId - Delete todo item */
router.delete("/:todoId", requireAuth, async (req, res, next) => {
  try {
    await whmcsCall("DeleteToDoItem", {
      itemid: req.params.todoId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /todo - Create new todo item */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, description, dueDate, adminId } = req.body as {
      title?: string;
      description?: string;
      dueDate?: string;
      adminId?: string;
    };
    
    // Get admin ID if not provided
    let adminIdToUse = adminId;
    if (!adminIdToUse) {
      const adminResult = await whmcsCall<Record<string, unknown>>("GetAdminUsers", {});
      const admins = adminResult.admins as { admin?: unknown } | undefined;
      const raw = admins?.admin;
      const adminList = Array.isArray(raw) ? raw : raw ? [raw] : [];
      if (adminList.length > 0) {
        adminIdToUse = String((adminList[0] as Record<string, unknown>).id ?? "");
      }
    }

    const result = await whmcsCall<Record<string, unknown>>("UpdateToDoItem", {
      adminid: adminIdToUse ?? "",
      title: title ?? "New Task",
      description: description ?? "",
      ...(dueDate && { duedate: dueDate }),
    });
    
    res.status(201).json({
      success: result.result === "success",
      itemId: result.id ?? result.itemid ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
