/**
 * HTTP client used by Orval-generated API hooks.
 * Attaches JWT from the auth store and resolves relative URLs against an optional API base.
 */

export type AuthTokenGetter = () => string | null;

export type BodyType<T> = T extends undefined ? unknown : T;

export type ErrorType<T> = T;

let baseUrl = "";

let authTokenGetter: AuthTokenGetter = () => null;

export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, "");
}

export function setAuthTokenGetter(getter: AuthTokenGetter): void {
  authTokenGetter = getter;
}

function resolveUrl(input: string): string {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }
  const path = input.startsWith("/") ? input : `/${input}`;
  return baseUrl ? `${baseUrl}${path}` : path;
}

async function parseJsonErrorBody(text: string): Promise<unknown> {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function customFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const token = authTokenGetter();
  const headers = new Headers(init?.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const resolved = resolveUrl(url);
  const res = await fetch(resolved, { ...init, headers });

  if (res.status === 401) {
    const body = await res.text();
    const parsed = await parseJsonErrorBody(body);
    const err = new Error(
      typeof parsed === "object" && parsed !== null && "message" in parsed
        ? String((parsed as { message?: unknown }).message)
        : "Unauthorized",
    ) as Error & { status?: number; body?: unknown };
    err.status = 401;
    err.body = parsed;
    throw err;
  }

  if (!res.ok) {
    const body = await res.text();
    const parsed = await parseJsonErrorBody(body);
    const err = new Error(
      res.statusText || `HTTP ${res.status}`,
    ) as Error & { status?: number; body?: unknown };
    err.status = res.status;
    err.body = parsed;
    throw err;
  }

  const contentLength = res.headers.get("content-length");
  if (contentLength === "0" || res.status === 204) {
    return undefined as T;
  }

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
