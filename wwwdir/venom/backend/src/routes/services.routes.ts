import { Router, type IRouter } from "express";
import { z } from "zod";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";
import { mapProductsToServices } from "../lib/whmcs-transforms.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router: IRouter = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetClientsProducts",
      {
        clientid: req.clientId!,
        ...queryToWhmcsParams(req.query),
      },
    );
    let services = mapProductsToServices(result);
    const sid = req.query.serviceid as string | undefined;
    if (sid) {
      services = services.filter((s) => s.id === sid);
    }
    res.json({ services });
  } catch (e) {
    next(e);
  }
});

router.get("/:serviceId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetClientsProducts",
      {
        clientid: req.clientId!,
        serviceid: req.params.serviceId,
      },
    );
    const services = mapProductsToServices(result);
    const one = services.find((s) => s.id === req.params.serviceId) ?? services[0];
    if (!one) {
      res.status(404).json({ error: "not_found", message: "Service not found" });
      return;
    }
    res.json(one);
  } catch (e) {
    next(e);
  }
});

router.get("/:serviceId/addons", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetClientsAddons",
      {
        serviceid: req.params.serviceId,
        clientid: req.clientId!,
      },
    );
    const addons = result.addons as { addon?: unknown } | undefined;
    const raw = addons?.addon;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    res.json(list);
  } catch (e) {
    next(e);
  }
});

const cancelBody = z.object({
  reason: z.string().optional(),
  type: z.string().optional(),
});

router.post("/:serviceId/cancel", async (req, res, next) => {
  try {
    cancelBody.parse(req.body);
    await whmcsCall("ModuleTerminate", {
      serviceid: req.params.serviceId,
    });
    res.json({ success: true, message: "Cancellation requested" });
  } catch (e) {
    next(e);
  }
});

const upgradeBody = z.object({
  newProductId: z.string().optional(),
  billingCycle: z.string().optional(),
});

router.post("/:serviceId/upgrade", async (req, res, next) => {
  try {
    const body = upgradeBody.parse(req.body);
    await whmcsCall("UpgradeProduct", {
      serviceid: req.params.serviceId,
      pid: body.newProductId,
      billingcycle: body.billingCycle,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:serviceId/suspend", async (req, res, next) => {
  try {
    await whmcsCall("ModuleSuspend", {
      serviceid: req.params.serviceId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:serviceId/terminate", async (req, res, next) => {
  try {
    await whmcsCall("ModuleTerminate", {
      serviceid: req.params.serviceId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post("/:serviceId/unsuspend", async (req, res, next) => {
  try {
    await whmcsCall("ModuleUnsuspend", {
      serviceid: req.params.serviceId,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
