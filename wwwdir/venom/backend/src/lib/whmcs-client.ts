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
 *
 * CONFIGURATION:
 * - Timeout is configurable via WHMCS_TIMEOUT environment variable (default: 30000ms)
 * - Adjust this based on your WHMCS server performance and network latency
 *
 * @see https://developers.whmcs.com/api/
 */
export async function whmcsCall<T = Record<string, unknown>>(
  action: string,
  params: WhmcsParams = {},
  options?: { throwOnError?: boolean },
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
    signal: AbortSignal.timeout(config.WHMCS_TIMEOUT),
  });

  const json = (await res.json()) as Record<string, unknown>;

  // Only throw error if throwOnError is true (default for backwards compatibility)
  // For auth endpoints, we want to return the full response to handle invalid credentials
  const shouldThrow = options?.throwOnError ?? true;
  if (json.result === "error" && shouldThrow) {
    throw new WhmcsApiError(
      String(json.message ?? "WHMCS API error"),
      "whmcs_error",
      json,
    );
  }

  return json as T;
}
