import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";
import { queryToWhmcsParams } from "../lib/query-params.js";

const router: IRouter = Router();

router.get("/", async (_req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetKnowledgebaseCategories",
      {},
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetKnowledgebaseArticles",
      {
        ...queryToWhmcsParams(req.query),
      },
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:categoryId/:articleId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetKnowledgebaseArticle",
      {
        articleid: req.params.articleId,
      },
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:categoryId", async (req, res, next) => {
  try {
    const result = await whmcsCall<Record<string, unknown>>(
      "GetKnowledgebaseArticles",
      {
        categoryid: req.params.categoryId,
      },
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
