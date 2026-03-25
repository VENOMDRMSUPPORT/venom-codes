/**
 * Admin module management — static paths (`/registrars`, `/queue`) before `/:type`.
 */
import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();

/** GET /modules/registrars - Get available domain registrars */
router.get("/registrars", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetRegistrars", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /modules/queue - Get module queue */
router.get("/queue", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetModuleQueue", {});
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /modules/services/:serviceId/module-create - Create service via module */
router.post("/services/:serviceId/module-create", requireAuth, async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("ModuleCreate", {
      serviceid: req.params.serviceId,
    });
    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /modules/services/:serviceId/module-custom - Execute custom module function */
router.post("/services/:serviceId/module-custom", requireAuth, async (req, res, next) => {
  try {
    const { function: func, ...params } = req.body as { function?: string; [key: string]: unknown };
    if (!func) {
      res.status(400).json({ error: "bad_request", message: "Function name is required" });
      return;
    }

    const result = await whmcsCall<Record<string, unknown>>("ModuleCustom", {
      serviceid: req.params.serviceId,
      function: func,
      ...params,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /modules/:type - Get modules by type (registrar, ssl, provisioning) */
router.get("/:type", async (req, res, next) => {
  try {
    const { type } = req.params;

    if (type === "registrars") {
      const result = await whmcsCall<Record<string, unknown>>("GetRegistrars", {});
      res.json(result);
    } else if (type === "provisioning") {
      const result = await whmcsCall<Record<string, unknown>>("GetProducts", {});
      res.json(result);
    } else {
      res.json({ modules: [] });
    }
  } catch (e) {
    next(e);
  }
});

/** GET /modules/:type/:moduleName - Get module configuration parameters */
router.get("/:type/:moduleName", async (req, res, next) => {
  try {
    const { type, moduleName } = req.params;
    const result = await whmcsCall<Record<string, unknown>>("GetModuleConfigurationParameters", {
      type,
      module: moduleName,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** POST /modules/:type/:moduleName/activate - Activate a module */
router.post("/:type/:moduleName/activate", async (req, res, next) => {
  try {
    const { type, moduleName } = req.params;
    const { params } = req.body as { params?: Record<string, string> };

    const callParams: Record<string, string> = { type, module: moduleName };
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) callParams[key] = value;
      }
    }

    const result = await whmcsCall<Record<string, unknown>>("ActivateModule", callParams);

    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** POST /modules/:type/:moduleName/deactivate - Deactivate a module */
router.post("/:type/:moduleName/deactivate", async (req, res, next) => {
  try {
    const { type, moduleName } = req.params;
    const { params } = req.body as { params?: Record<string, string> };

    const callParams: Record<string, string> = { type, module: moduleName };
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) callParams[key] = value;
      }
    }

    const result = await whmcsCall<Record<string, unknown>>("DeactivateModule", callParams);

    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

/** PUT /modules/:type/:moduleName/configuration - Update module configuration */
router.put("/:type/:moduleName/configuration", async (req, res, next) => {
  try {
    const { type, moduleName } = req.params;
    const { settings } = req.body as { settings?: Record<string, string> };

    const result = await whmcsCall<Record<string, unknown>>("UpdateModuleConfiguration", {
      type,
      module: moduleName,
      ...settings,
    });

    res.json({
      success: result.result === "success",
      raw: result,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
