import { Router, type IRouter } from "express";
import { whmcsCall } from "../lib/whmcs-client.js";

const router: IRouter = Router();

/** 
 * GET /knowledgebase - Knowledgebase endpoint
 * Note: WHMCS doesn't have a built-in Knowledgebase API. 
 * This would typically require a custom solution or addon.
 */
router.get("/", async (_req, res, next) => {
  try {
    // Return a placeholder - KB typically requires custom implementation
    res.json({
      message: "Knowledgebase API not available in standard WHMCS",
      suggestion: "Consider implementing custom KB endpoints or using a plugin",
      categories: [],
      articles: [],
    });
  } catch (e) {
    next(e);
  }
});

/** GET /knowledgebase/search - Search KB (placeholder) */
router.get("/search", async (req, res, next) => {
  try {
    const { query: searchQuery } = req.query;
    res.json({
      message: "Knowledgebase search not available in standard WHMCS",
      searchQuery,
      results: [],
    });
  } catch (e) {
    next(e);
  }
});

/** GET /knowledgebase/:articleId - Get KB article (placeholder) */
router.get("/:articleId", async (req, res, next) => {
  try {
    res.json({
      message: "Knowledgebase article lookup not available in standard WHMCS",
      articleId: req.params.articleId,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
