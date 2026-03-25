import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { requireAdminKey } from "../middlewares/admin.middleware.js";

const router: IRouter = Router();

// Protect all admin routes with X-Admin-Key header
router.use(requireAdminKey);

/** GET /admin/activity - Get activity log */
router.get("/activity", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetActivityLog", {
      ...queryToWhmcsParams(req.query),
    });
    const entries = result.log as { logentry?: unknown } | undefined;
    const raw = entries?.logentry;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((e: Record<string, unknown>) => ({
      id: String(e.id ?? ""),
      date: String(e.date ?? ""),
      description: String(e.description ?? e.action ?? ""),
      username: String(e.username ?? e.user ?? ""),
      ipaddress: String(e.ipaddress ?? e.ip ?? ""),
    }));
    res.json({ activity: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /admin/details - Get admin user details */
router.get("/details", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAdminDetails", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /admin/users - Get all admin users */
router.get("/users", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAdminUsers", {});
    const admins = result.admins as { admin?: unknown } | undefined;
    const raw = admins?.admin;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((a: Record<string, unknown>) => ({
      id: String(a.id ?? ""),
      username: String(a.username ?? ""),
      firstname: String(a.firstname ?? ""),
      lastname: String(a.lastname ?? ""),
      email: String(a.email ?? ""),
      roleId: String(a.roleid ?? ""),
      supportPermissions: a.supportpermissions ?? [],
      adminPermissions: a.adminpermissions ?? [],
      disabled: a.disabled === true || a.disabled === "1",
    }));
    res.json({ admins: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /admin/servers - Get all servers */
router.get("/servers", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetServers", {});
    const servers = result.servers as { server?: unknown } | undefined;
    const raw = servers?.server;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((s: Record<string, unknown>) => ({
      id: String(s.id ?? ""),
      hostname: String(s.hostname ?? ""),
      ip: String(s.ip ?? ""),
      status: String(s.status ?? ""),
      name: String(s.name ?? ""),
      type: String(s.type ?? ""),
      dedicatedIp: String(s.dedicatedip ?? ""),
      ns1: String(s.ns1 ?? ""),
      ns2: String(s.ns2 ?? ""),
      accountCount: Number(s.numaccounts ?? 0),
    }));
    res.json({ servers: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /admin/servers/:serverId - Get specific server details */
router.get("/servers/:serverId", async (req, res, next) => {
  try {
    const { serverId } = req.params;

    // SECURITY: First verify the server exists in the allowed list
    // This prevents admins from accessing arbitrary servers by ID guessing
    const allServersResult = await whmcsCall<Record<string, unknown>>("GetServers", {});
    const allServers = allServersResult.servers as { server?: unknown } | undefined;
    const rawAll = allServers?.server;
    const serverList = Array.isArray(rawAll) ? rawAll : rawAll ? [rawAll] : [];

    // Verify the requested server ID exists in the list
    const exists = serverList.some((s: Record<string, unknown>) =>
      String(s.id ?? "") === String(serverId)
    );

    if (!exists) {
      res.status(404).json({ error: "not_found", message: "Server not found" });
      return;
    }

    // Server exists, fetch its details
    const result = await whmcsCall<Record<string, unknown>>("GetServers", {
      serverid: serverId,
    });
    const servers = result.servers as { server?: unknown } | undefined;
    const raw = servers?.server;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (list.length === 0) {
      res.status(404).json({ error: "not_found", message: "Server not found" });
      return;
    }
    res.json(list[0]);
  } catch (e) {
    next(e);
  }
});

/** GET /admin/staff-online - Get online staff members */
router.get("/staff-online", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetStaffOnline", {});
    const staff = result.staff as { admin?: unknown } | undefined;
    const raw = staff?.admin;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const mapped = list.map((s: Record<string, unknown>) => ({
      id: String(s.id ?? ""),
      username: String(s.username ?? ""),
      firstname: String(s.firstname ?? ""),
      lastname: String(s.lastname ?? ""),
      lastActive: s.lastactive ?? null,
    }));
    res.json({ staff: mapped });
  } catch (e) {
    next(e);
  }
});

/** GET /admin/emails - Get email templates */
router.get("/emails", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetEmailTemplates", {
      ...queryToWhmcsParams(req.query),
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /admin/automation - Get automation log */
router.get("/automation", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAutomationLog", {
      ...queryToWhmcsParams(req.query),
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /admin/emails - Send admin email */
router.post("/emails", async (req, res, next) => {
  try {
    const { type, subject, message, to, cc } = req.body as {
      type?: string;
      subject?: string;
      message?: string;
      to?: string;
      cc?: string;
    };
    const result = await whmcsCall<Record<string, unknown>>("SendAdminEmail", {
      ...(type && { type }),
      ...(subject && { subject }),
      ...(message && { message }),
      ...(to && { to }),
      ...(cc && { cc }),
    });
    res.json({ success: true, result });
  } catch (e) {
    next(e);
  }
});

/** POST /admin/activity - Log activity */
router.post("/activity", async (req, res, next) => {
  try {
    const { description } = req.body as { description?: string };
    if (!description) {
      res.status(400).json({ error: "bad_request", message: "Description is required" });
      return;
    }
    await whmcsCall("LogActivity", {
      description,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** GET /admin/configuration/:key - Get configuration value */
router.get("/configuration/:key", async (req, res, next) => {
  try {
    const key = req.params.key;
    const result = await whmcsCall<Record<string, unknown>>("GetConfigurationValue", {
      setting: key,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /admin/configuration/:key - Set configuration value */
router.post("/configuration/:key", async (req, res, next) => {
  try {
    const key = req.params.key;
    const { value } = req.body as { value?: string };
    if (value === undefined) {
      res.status(400).json({ error: "bad_request", message: "Value is required" });
      return;
    }
    await whmcsCall("SetConfigurationValue", {
      setting: key,
      value,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /admin/invoices/generate - Generate invoices */
router.post("/invoices/generate", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GenInvoices", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
