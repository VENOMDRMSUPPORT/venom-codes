export type Tone = "primary" | "success" | "warning" | "danger" | "muted";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(value: string | Date | undefined | null, fallback = "TBC") {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatDateTime(value: string | Date | undefined | null, fallback = "TBC") {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

export function initials(firstname?: string, lastname?: string) {
  return `${firstname?.[0] ?? "V"}${lastname?.[0] ?? "C"}`.toUpperCase();
}

export function statusTone(status: string): Tone {
  const value = status.toLowerCase();

  if (["active", "healthy", "paid", "resolved", "delivered", "accepted", "open"].includes(value)) {
    return "success";
  }

  if (["unpaid", "pending", "awaiting client", "in progress", "partially paid", "provisioning", "draft", "transfer pending"].includes(value)) {
    return "warning";
  }

  if (["cancelled", "terminated", "failed", "overdue", "suspended", "closed", "fraud"].includes(value)) {
    return "danger";
  }

  if (["inactive", "archived"].includes(value)) {
    return "muted";
  }

  return "primary";
}

export function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function toStringValue(value: unknown, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readPath(record: Record<string, unknown>, keys: string[], fallback?: unknown) {
  for (const key of keys) {
    if (key in record && record[key] !== undefined && record[key] !== null && record[key] !== "") {
      return record[key];
    }
  }

  return fallback;
}

export function arrayFromPayload(payload: unknown, keys: string[] = []) {
  if (Array.isArray(payload)) return payload;

  if (isObject(payload)) {
    for (const key of keys) {
      const value = payload[key];
      if (Array.isArray(value)) return value;
    }

    for (const value of Object.values(payload)) {
      if (Array.isArray(value)) return value;
    }
  }

  return [];
}

export function sumNumericStrings(values: string[]) {
  return values.reduce((total, value) => total + toNumber(value, 0), 0);
}

export function titleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}
