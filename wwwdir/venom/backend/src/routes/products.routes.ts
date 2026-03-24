import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";

const router: IRouter = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProducts", {
      ...queryToWhmcsParams(req.query),
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:productId/addons", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>("GetProducts", {
      pid: req.params.productId,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
