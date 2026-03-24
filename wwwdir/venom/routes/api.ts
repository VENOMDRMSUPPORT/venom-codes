import type { Express } from "express";
import rateLimit from "express-rate-limit";
import healthRouter from "../backend/src/routes/health.js";
import authRouter from "../backend/src/routes/auth.routes.js";
import clientRouter from "../backend/src/routes/client.routes.js";
import servicesRouter from "../backend/src/routes/services.routes.js";
import invoicesRouter from "../backend/src/routes/invoices.routes.js";
import quotesRouter from "../backend/src/routes/quotes.routes.js";
import ticketsRouter from "../backend/src/routes/tickets.routes.js";
import domainsRouter from "../backend/src/routes/domains.routes.js";
import ordersRouter from "../backend/src/routes/orders.routes.js";
import productsRouter from "../backend/src/routes/products.routes.js";
import cartRouter from "../backend/src/routes/cart.routes.js";
import announcementsRouter from "../backend/src/routes/announcements.routes.js";
import knowledgebaseRouter from "../backend/src/routes/knowledgebase.routes.js";
import paymethodsRouter from "../backend/src/routes/paymethods.routes.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerApiRoutes(app: Express): void {
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
  app.use("/api/auth/forgot-password", authLimiter);

  app.use("/api", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/client", clientRouter);
  app.use("/api/services", servicesRouter);
  app.use("/api/invoices", invoicesRouter);
  app.use("/api/quotes", quotesRouter);
  app.use("/api/tickets", ticketsRouter);
  app.use("/api/domains", domainsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/announcements", announcementsRouter);
  app.use("/api/knowledgebase", knowledgebaseRouter);
  app.use("/api/paymethods", paymethodsRouter);
}
