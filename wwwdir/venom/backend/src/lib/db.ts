import mysql, { type RowDataPacket } from "mysql2/promise";
import { config } from "../config.js";

/**
 * MySQL connection pool configuration.
 *
 * Production-aware settings with timeout controls:
 *
 * CONNECTION POOL:
 * - connectionLimit: Max connections in pool (default: 20)
 *   Rationale: Balance between resource usage and concurrency. 20 connections
 *   can handle ~200-400 concurrent requests with proper connection reuse.
 *
 * - queueLimit: Max queued connection requests (default: 50)
 *   Rationale: Prevents unbounded memory growth. 50 queued requests gives
 *   ~250 total pending operations (20 active + 50 queued * ~4.6 avg wait).
 *   Requests beyond this fail fast rather than waiting indefinitely.
 *
 * TIMEOUT SETTINGS:
 * - connectTimeout: Initial connection timeout (default: 10000ms = 10s)
 *   Rationale: MySQL on same network/datacenter should connect in <1s.
 *   10s allows for network hiccups while failing fast on real issues.
 *
 * - waitForConnections + queueLimit: Controls pool exhaustion behavior.
 *   When queueLimit is reached, new requests fail immediately with error.
 *   This is preferable to unbounded queuing which can cause memory issues.
 *
 * IDLE CONNECTION HANDLING:
 * - mysql2 doesn't support idleTimeout in pool config directly.
 * - Idle timeout is handled at the MySQL server level (wait_timeout).
 * - enableKeepAlive: true prevents "connection lost" errors from idle TCP.
 * - The pool automatically recreates connections if server closes them.
 *
 * KEEP-ALIVE:
 * - enableKeepAlive: Prevents connection drops from idle TCP connections
 * - keepAliveInitialDelay: 0 means use OS default (usually 2 hours)
 *
 * SECURITY:
 * - multipleStatements: false - Prevents SQL injection via stacked queries
 */
const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(config.MYSQL_CONNECTION_LIMIT),
  queueLimit: Number(config.MYSQL_QUEUE_LIMIT),
  // Timeout settings for stability
  connectTimeout: Number(config.MYSQL_CONNECT_TIMEOUT),
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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
