import mysql, { type RowDataPacket } from "mysql2/promise";
import { config } from "../config.js";

const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: false,
});

export interface KbCategory extends RowDataPacket {
  id: number;
  parentid: number;
  name: string;
  description: string;
  hidden: string;
  language: string;
}

export interface KbArticle extends RowDataPacket {
  id: number;
  title: string;
  article: string;
  views: number;
  useful: number;
  votes: number;
  private: string;
  order: number;
  parentid: number;
  language: string;
}

export async function getKbCategories(): Promise<KbCategory[]> {
  const [rows] = await pool.query<KbCategory[]>(
    "SELECT id, parentid, name, description, hidden, language FROM tblknowledgebasecats WHERE hidden = '' ORDER BY parentid, id"
  );
  return rows;
}

export async function getKbCategory(categoryId: string): Promise<{
  category: KbCategory | null;
  articles: KbArticle[];
}> {
  const id = parseInt(categoryId, 10);
  if (isNaN(id)) {
    return { category: null, articles: [] };
  }

  const [categories] = await pool.query<KbCategory[]>(
    "SELECT id, parentid, name, description, hidden, language FROM tblknowledgebasecats WHERE id = ? AND hidden = ''",
    [id]
  );

  if (categories.length === 0) {
    return { category: null, articles: [] };
  }

  const [articles] = await pool.query<KbArticle[]>(
    "SELECT id, title, article, views, useful, votes, private, `order`, parentid, language FROM tblknowledgebase WHERE parentid = ? AND private = '' ORDER BY `order`",
    [id]
  );

  return { category: categories[0], articles };
}

export async function getKbArticle(categoryId: string, articleId: string): Promise<{
  category: KbCategory | null;
  article: KbArticle | null;
}> {
  const catId = parseInt(categoryId, 10);
  const artId = parseInt(articleId, 10);

  if (isNaN(catId) || isNaN(artId)) {
    return { category: null, article: null };
  }

  const [categories] = await pool.query<KbCategory[]>(
    "SELECT id, parentid, name, description, hidden, language FROM tblknowledgebasecats WHERE id = ? AND hidden = ''",
    [catId]
  );

  const [articles] = await pool.query<KbArticle[]>(
    "SELECT id, title, article, views, useful, votes, private, `order`, parentid, language FROM tblknowledgebase WHERE id = ? AND parentid = ? AND private = ''",
    [artId, catId]
  );

  return {
    category: categories[0] || null,
    article: articles[0] || null,
  };
}

export async function searchKb(query: string): Promise<KbArticle[]> {
  const searchTerm = `%${query}%`;
  const [rows] = await pool.query<KbArticle[]>(
    `SELECT id, title, article, views, useful, votes, private, \`order\`, parentid, language
     FROM tblknowledgebase
     WHERE private = '' AND (title LIKE ? OR article LIKE ?)
     ORDER BY views DESC LIMIT 20`,
    [searchTerm, searchTerm]
  );
  return rows;
}

export async function getKbIndex(): Promise<{
  categories: (KbCategory & { articleCount: number })[];
}> {
  const [rows] = await pool.query<
    (KbCategory & { articleCount: number })[]
  >(`
    SELECT c.id, c.parentid, c.name, c.description, c.hidden, c.language, COUNT(a.id) as articleCount
    FROM tblknowledgebasecats c
    LEFT JOIN tblknowledgebase a ON a.parentid = c.id AND a.private = ''
    WHERE c.hidden = ''
    GROUP BY c.id
    ORDER BY c.parentid, c.id
  `);
  return { categories: rows };
}

export default pool;
