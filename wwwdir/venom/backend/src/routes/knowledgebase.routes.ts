import { Router, type IRouter } from "express";
import * as db from "../lib/db.js";

const router: IRouter = Router();

/** GET /knowledgebase - Get KB index with categories and article counts */
router.get("/", async (req, res, next) => {
  try {
    const result = await db.getKbIndex();
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /knowledgebase/categories - Get all KB categories */
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await db.getKbCategories();
    res.json({ categories });
  } catch (e) {
    next(e);
  }
});

/** GET /knowledgebase/search - Search KB articles */
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q as string | undefined;
    if (!query) {
      res.json({ articles: [] });
      return;
    }
    const articles = await db.searchKb(query);
    res.json({ articles });
  } catch (e) {
    next(e);
  }
});

/** GET /knowledgebase/categories/:categoryId - Get category with articles */
router.get("/categories/:categoryId", async (req, res, next) => {
  try {
    const result = await db.getKbCategory(req.params.categoryId);
    if (!result.category) {
      res.status(404).json({ error: "not_found", message: "Category not found" });
      return;
    }
    res.json(result);
  } catch (e) {
    next(e);
  }
});

/** GET /knowledgebase/categories/:categoryId/articles/:articleId - Get specific article */
router.get("/categories/:categoryId/articles/:articleId", async (req, res, next) => {
  try {
    const result = await db.getKbArticle(req.params.categoryId, req.params.articleId);
    if (!result.article) {
      res.status(404).json({ error: "not_found", message: "Article not found" });
      return;
    }
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
