import type { Request } from "express";
import type { WhmcsParams } from "./whmcs-client.js";

/** Coerce Express `req.query` into flat string values for WHMCS API calls. */
export function queryToWhmcsParams(query: Request["query"]): WhmcsParams {
  const out: WhmcsParams = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (typeof value === "string") {
      out[key] = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    } else if (Array.isArray(value)) {
      out[key] = value.map(String).join(",");
    }
  }
  return out;
}
