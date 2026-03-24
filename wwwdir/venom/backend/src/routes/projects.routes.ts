import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** GET /projects - Get all projects */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const params: Record<string, string> = {};
    if (req.query.limitstart) params.limitstart = String(req.query.limitstart);
    if (req.query.limitnum) params.limitnum = String(req.query.limitnum);
    if (req.query.status) params.status = String(req.query.status);
    
    const result = await whmcsCall<Record<string, unknown>>("GetProjects", params);
    const projects = result.projects as { project?: unknown } | undefined;
    const raw = projects?.project;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((p: Record<string, unknown>) => ({
      id: String(p.id ?? ""),
      name: String(p.name ?? ""),
      title: String(p.title ?? ""),
      status: String(p.status ?? ""),
      created: String(p.created ?? ""),
      dueDate: p.duedate ?? null,
      admin: String(p.admin ?? ""),
      completed: p.completed === true || p.completed === "1",
    }));
    res.json({ projects: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /projects/:projectId - Get specific project */
router.get("/:projectId", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProject", {
      projectid: String(req.params.projectId),
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  adminId: z.string().optional(),
});

/** POST /projects - Create new project */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = createProjectSchema.parse(req.body);
    const params: Record<string, string> = { title: body.title };
    if (body.description) params.description = body.description;
    if (body.status) params.status = body.status;
    if (body.dueDate) params.duedate = body.dueDate;
    if (body.adminId) params.adminid = body.adminId;
    
    const result = await whmcsCall<Record<string, unknown>>("CreateProject", params as Record<string, string>);
    res.status(201).json({
      success: result.result === "success",
      projectId: result.id ?? result.projectid ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
});

/** PUT /projects/:projectId - Update project */
router.put("/:projectId", requireAuth, async (req, res, next) => {
  try {
    const body = updateProjectSchema.parse(req.body);
    const params: Record<string, string> = { projectid: String(req.params.projectId) };
    if (body.title) params.title = body.title;
    if (body.description) params.description = body.description;
    if (body.status) params.status = body.status;
    if (body.dueDate) params.duedate = body.dueDate;
    if (body.completed !== undefined) params.completed = body.completed ? "on" : "";
    
    await whmcsCall("UpdateProject", params as Record<string, string>);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /projects/:projectId - Delete project */
router.delete("/:projectId", requireAuth, async (req, res, next) => {
  try {
    await whmcsCall("DeleteProject", {
      projectid: req.params.projectId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /projects/:projectId/tasks - Get project tasks */
router.get("/:projectId/tasks", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProject", {
      projectid: req.params.projectId,
    });
    const tasks = result.tasks as { task?: unknown } | undefined;
    const raw = tasks?.task;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    res.json({ tasks: list });
  } catch (e) {
    next(e);
  }
});

const addTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  adminId: z.string().optional(),
});

/** POST /projects/:projectId/tasks - Add task to project */
router.post("/:projectId/tasks", requireAuth, async (req, res, next) => {
  try {
    const body = addTaskSchema.parse(req.body);
    const params: Record<string, string> = { projectid: String(req.params.projectId), title: body.title };
    if (body.description) params.description = body.description;
    if (body.dueDate) params.duedate = body.dueDate;
    if (body.adminId) params.adminid = body.adminId;
    
    const result = await whmcsCall<Record<string, unknown>>("AddProjectTask", params);
    res.status(201).json({
      success: result.result === "success",
      taskId: result.id ?? result.taskid ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.string().optional(),
  completed: z.boolean().optional(),
});

/** PUT /projects/:projectId/tasks/:taskId - Update project task */
router.put("/:projectId/tasks/:taskId", requireAuth, async (req, res, next) => {
  try {
    const body = updateTaskSchema.parse(req.body);
    const params: Record<string, string> = { 
      taskid: String(req.params.taskId),
      projectid: String(req.params.projectId) 
    };
    if (body.title) params.title = body.title;
    if (body.description) params.description = body.description;
    if (body.dueDate) params.duedate = body.dueDate;
    if (body.status) params.status = body.status;
    if (body.completed !== undefined) params.completed = body.completed ? "on" : "";
    
    await whmcsCall("UpdateProjectTask", params as Record<string, string>);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /projects/:projectId/tasks/:taskId - Delete project task */
router.delete("/:projectId/tasks/:taskId", requireAuth, async (req, res, next) => {
  try {
    await whmcsCall("DeleteProjectTask", {
      taskid: String(req.params.taskId),
    } as Record<string, string>);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /projects/:projectId/messages - Get project messages */
router.get("/:projectId/messages", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProject", {
      projectid: String(req.params.projectId),
    });
    const messages = result.messages as { message?: unknown } | undefined;
    const raw = messages?.message;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    res.json({ messages: list });
  } catch (e) {
    next(e);
  }
});

/** POST /projects/:projectId/messages - Add message to project */
router.post("/:projectId/messages", requireAuth, async (req, res, next) => {
  try {
    const { message } = req.body as { message?: string };
    if (!message) {
      res.status(400).json({ error: "bad_request", message: "Message is required" });
      return;
    }
    const result = await whmcsCall<Record<string, unknown>>("AddProjectMessage", {
      projectid: String(req.params.projectId),
      message,
    });
    res.status(201).json({
      success: result.result === "success",
      messageId: result.id ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /projects/:projectId/timer/start - Start project timer */
router.post("/:projectId/timer/start", requireAuth, async (req, res, next) => {
  try {
    const { taskId } = req.body as { taskId?: string };
    const params: Record<string, string> = { projectid: String(req.params.projectId) };
    if (taskId) params.taskid = taskId;
    
    const result = await whmcsCall<Record<string, unknown>>("StartTaskTimer", params as Record<string, string>);
    res.json({
      success: result.result === "success",
      timerId: result.id ?? result.timerid ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /projects/:projectId/timer/end - End project timer */
router.post("/:projectId/timer/end", requireAuth, async (req, res, next) => {
  try {
    const { taskId, time } = req.body as { taskId?: string; time?: string };
    const params: Record<string, string> = { projectid: String(req.params.projectId) };
    if (taskId) params.taskid = taskId;
    if (time) params.time = time;
    
    const result = await whmcsCall<Record<string, unknown>>("EndTaskTimer", params as Record<string, string>);
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
