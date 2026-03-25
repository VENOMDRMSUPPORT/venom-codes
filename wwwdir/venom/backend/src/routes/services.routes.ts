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
    const limitRaw = req.query.limit;
    const limit =
      typeof limitRaw === "string"
        ? Number.parseInt(limitRaw, 10) || 100
        : typeof limitRaw === "number"
          ? limitRaw
          : 100;
    res.json({
      services,
      total: services.length,
      limit,
    });
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
    const body = cancelBody.parse(req.body);
    await whmcsCall("AddCancelRequest", {
      serviceid: req.params.serviceId,
      ...(body.reason && { reason: body.reason }),
      ...(body.type && { type: body.type }),
    });
    res.json({ success: true, message: "Cancellation requested" });
  } catch (e) {
    next(e);
  }
});

const upgradeBody = z.object({
  newProductId: z.string().optional(),
  newproductid: z.string().optional(),
  billingCycle: z.string().optional(),
  billingcycle: z.string().optional(),
  paymentmethod: z.string().optional(),
});

router.post("/:serviceId/upgrade", async (req, res, next) => {
  try {
    const body = upgradeBody.parse(req.body);
    const pid = body.newProductId ?? body.newproductid;
    const billingcycle = body.billingCycle ?? body.billingcycle;
    await whmcsCall("UpgradeProduct", {
      serviceid: req.params.serviceId,
      ...(pid && { pid }),
      ...(billingcycle && { billingcycle }),
      ...(body.paymentmethod && { paymentmethod: body.paymentmethod }),
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

/** POST /services/:serviceId/password - Change hosting account password */
router.post("/:serviceId/password", async (req, res, next) => {
  try {
    const { newPassword } = req.body as { newPassword?: string };
    if (!newPassword) {
      res.status(400).json({ error: "bad_request", message: "New password is required" });
      return;
    }
    await whmcsCall("ModuleChangePw", {
      serviceid: req.params.serviceId,
      newPassword,
    });
    res.json({ success: true, message: "Password changed successfully" });
  } catch (e) {
    next(e);
  }
});

/** GET /services/:serviceId/configoptions - Get configurable options for a service */
router.get("/:serviceId/configoptions", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetClientsProducts",
      {
        clientid: req.clientId!,
        serviceid: req.params.serviceId,
      },
    );
    // The configoptions should be in the product response
    const products = result.products as { product?: unknown } | undefined;
    const raw = products?.product;
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const configoptions = (list[0] as Record<string, unknown>)?.configoptions;
    res.json({ configoptions: configoptions ?? [] });
  } catch (e) {
    next(e);
  }
});

/** PUT /services/:serviceId/config - Update service configuration */
router.put("/:serviceId/config", async (req, res, next) => {
  try {
    const { configoptions } = req.body as { configoptions?: Record<string, string | number> };
    await whmcsCall("UpdateClientProduct", {
      serviceid: req.params.serviceId,
      ...configoptions,
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
