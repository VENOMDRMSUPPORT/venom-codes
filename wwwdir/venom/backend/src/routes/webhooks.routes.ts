import { createHmac, timingSafeEqual } from "crypto";
import type { RequestHandler } from "express";
import { config } from "../config.js";

/**
 * POST /api/webhooks/whmcs — verify HMAC-SHA256 hex digest of raw body, then accept payload.
 * Configure WHMCS PHP hooks to POST JSON to this URL with header X-Whmcs-Signature: <hex>.
 */
export const handleWhmcsWebhook: RequestHandler = (req, res) => {
  const secret = config.VENOM_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).json({
      error: "webhooks_disabled",
      message: "Set VENOM_WEBHOOK_SECRET to accept webhooks.",
    });
    return;
  }

  const raw = req.body as Buffer | undefined;
  if (!raw || !Buffer.isBuffer(raw)) {
    res.status(400).json({ error: "bad_request", message: "Expected raw JSON body" });
    return;
  }

  const sigHeader = req.headers["x-whmcs-signature"];
  if (typeof sigHeader !== "string" || !sigHeader) {
    res.status(401).json({ error: "unauthorized", message: "Missing X-Whmcs-Signature" });
    return;
  }

  const expectedHex = createHmac("sha256", secret).update(raw).digest("hex");
  const providedHex = sigHeader.trim().replace(/^sha256=/, "");
  if (!/^[0-9a-fA-F]+$/.test(providedHex) || providedHex.length !== expectedHex.length) {
    res.status(401).json({ error: "unauthorized", message: "Invalid signature format" });
    return;
  }
  const providedBuf = Buffer.from(providedHex, "hex");
  const expectedBuf = Buffer.from(expectedHex, "hex");
  if (!timingSafeEqual(providedBuf, expectedBuf)) {
    res.status(401).json({ error: "unauthorized", message: "Invalid signature" });
    return;
  }

  const text = raw.toString("utf8");
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    res.status(400).json({ error: "bad_request", message: "Invalid JSON" });
    return;
  }

  res.status(200).json({
    received: true,
    payload: parsed,
  });
};
