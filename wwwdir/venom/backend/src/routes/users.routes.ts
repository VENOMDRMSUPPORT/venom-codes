/**
 * Users — static `GET /permissions-list` before `/:userId`.
 */
import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

// Admin-only middleware for user management operations
// For now, this is a placeholder - in production, implement proper role-based access control
const requireAdmin = (req: any, res: any, next: any) => {
  // TODO: Implement proper admin role check
  // For security, we disable user enumeration by returning 403
  // In a full implementation, check req.userRole === 'admin'
  return res.status(403).json({
    error: "forbidden",
    message: "User management endpoints require admin privileges"
  });
};

const router: IRouter = Router();

/** GET /users - Get all users (ADMIN ONLY - disabled for security) */
router.get("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const params: Record<string, string> = {};
    if (req.query.limitstart) params.limitstart = String(req.query.limitstart);
    if (req.query.limitnum) params.limitnum = String(req.query.limitnum);
    if (req.query.orderby) params.orderby = String(req.query.orderby);
    if (req.query.sort) params.sort = String(req.query.sort);

    const result = await whmcsCall<Record<string, unknown>>("GetUsers", params);
    const users = result.users as { user?: unknown } | undefined;
    const raw = users?.user;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((u: Record<string, unknown>) => ({
      id: String(u.id ?? ""),
      email: String(u.email ?? ""),
      firstname: String(u.firstname ?? ""),
      lastname: String(u.lastname ?? ""),
      lastLogin: u.lastlogin ?? null,
      createdAt: u.created_at ?? u.createdat ?? null,
    }));
    res.json({ users: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /users/permissions-list - Get available permissions */
router.get("/permissions-list", requireAuth, async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetPermissionsList", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /users/:userId - Get specific user details (own profile only) */
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.clientId;

    // IDOR fix: Users can only view their own profile
    if (requestedUserId !== authenticatedUserId) {
      res.status(403).json({
        error: "forbidden",
        message: "You can only view your own profile"
      });
      return;
    }

    const result = await whmcsCall<Record<string, unknown>>("GetUsers", {
      userid: req.params.userId,
    });
    const users = result.users as { user?: unknown } | undefined;
    const raw = users?.user;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (list.length === 0) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }
    res.json(list[0]);
  } catch (e) {
    next(e);
  }
});

const addUserSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

/** POST /users - Create new user (ADMIN ONLY) */
router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = addUserSchema.parse(req.body);
    const result = await whmcsCall<Record<string, unknown>>("AddUser", {
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      password2: body.password,
    });
    res.status(201).json({
      success: result.result === "success",
      userId: result.userid ?? result.id ?? null,
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

const updateUserSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
});

/** PUT /users/:userId - Update user (own profile only, except admins) */
router.put("/:userId", requireAuth, async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.clientId;

    // Users can only update their own profile
    if (requestedUserId !== authenticatedUserId) {
      res.status(403).json({
        error: "forbidden",
        message: "You can only update your own profile"
      });
      return;
    }

    const body = updateUserSchema.parse(req.body);
    const params: Record<string, string> = { userid: String(req.params.userId) };
    if (typeof body.firstname === "string") params.firstname = body.firstname;
    if (typeof body.lastname === "string") params.lastname = body.lastname;
    if (typeof body.email === "string") params.email = body.email;

    await whmcsCall("UpdateUser", params);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /users/:userId - Delete user (ADMIN ONLY) */
router.delete("/:userId", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await whmcsCall("DeleteUser", {
      userid: req.params.userId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /users/:userId/clients - Associate user with client (ADMIN ONLY) */
router.post("/:userId/clients", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.body as { clientId?: string };
    if (!clientId) {
      res.status(400).json({ error: "bad_request", message: "Client ID is required" });
      return;
    }
    await whmcsCall("AddUserClient", {
      userid: req.params.userId,
      clientid: clientId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /users/:userId/clients/:clientId - Remove user-client association (ADMIN ONLY) */
router.delete("/:userId/clients/:clientId", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await whmcsCall("DeleteUserClient", {
      userid: req.params.userId,
      clientid: req.params.clientId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /users/:userId/permissions - Get user permissions (ADMIN ONLY) */
router.get("/:userId/permissions", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetUserPermissions", {
      userid: req.params.userId,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** PUT /users/:userId/permissions - Update user permissions (ADMIN ONLY) */
router.put("/:userId/permissions", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { permissions } = req.body as { permissions?: string[] };
    if (!permissions) {
      res.status(400).json({ error: "bad_request", message: "Permissions array is required" });
      return;
    }
    await whmcsCall("UpdateUserPermissions", {
      userid: req.params.userId,
      permissions: permissions.join(","),
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
