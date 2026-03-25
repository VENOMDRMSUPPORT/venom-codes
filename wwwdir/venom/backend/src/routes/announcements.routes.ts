import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";

const router: IRouter = Router();

/** GET /announcements - List all announcements */
router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAnnouncements", {
      ...queryToWhmcsParams(req.query),
    });
    const ann = result.announcements as { announcement?: unknown } | undefined;
    const raw = ann?.announcement;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const announcements = (list as Record<string, unknown>[]).map((a) => ({
      id: String(a.id ?? ""),
      title: String(a.title ?? ""),
      announcement: String(a.announcement ?? a.text ?? ""),
      date: a.date != null ? String(a.date) : undefined,
    }));
    res.json({ announcements });
  } catch (e) {
    next(e);
  }
});

/** GET /announcements/:id — single announcement */
router.get("/:announcementId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetAnnouncements", {
      id: req.params.announcementId,
    });
    const ann = result.announcements as { announcement?: unknown } | undefined;
    const raw = ann?.announcement;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const first = list[0] as Record<string, unknown> | undefined;
    if (!first) {
      res.status(404).json({ error: "not_found", message: "Announcement not found" });
      return;
    }
    res.json({
      id: String(first.id ?? req.params.announcementId),
      title: String(first.title ?? ""),
      announcement: String(first.announcement ?? first.text ?? ""),
      date: first.date != null ? String(first.date) : undefined,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
