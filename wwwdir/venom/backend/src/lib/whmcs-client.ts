import { config } from "../config.js";

export class WhmcsApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly raw?: unknown,
  ) {
    super(message);
    this.name = "WhmcsApiError";
  }
}

// Allow string arrays as they'll be joined when making the API call
export type WhmcsParams = Record<
  string,
  string | number | boolean | undefined | string[]
>;

/**
 * Calls WHMCS External API (POST includes/api.php).
 * @see https://developers.whmcs.com/api/
 */
export async function whmcsCall<T = Record<string, unknown>>(
  action: string,
  params: WhmcsParams = {},
): Promise<T> {
  const base = config.WHMCS_URL.replace(/\/$/, "");
  const url = `${base}/includes/api.php`;

  const body = new URLSearchParams();
  body.set("identifier", config.WHMCS_IDENTIFIER);
  body.set("secret", config.WHMCS_SECRET);
  body.set("action", action);
  body.set("responsetype", "json");

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    body.set(key, String(value));
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await res.json()) as Record<string, unknown>;

  if (json.result === "error") {
    throw new WhmcsApiError(
      String(json.message ?? "WHMCS API error"),
      "whmcs_error",
      json,
    );
  }

  return json as T;
}
