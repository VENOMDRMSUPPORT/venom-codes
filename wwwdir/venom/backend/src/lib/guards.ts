/**
 * Type guards and validation utilities for external API responses.
 * Use these instead of type assertions to maintain type safety.
 *
 * @module guards
 */

/**
 * Checks if the data is a WHMCS success response.
 * @param data - Unknown data to validate
 * @returns True if data is a WHMCS success response
 */
export function isWhmcsSuccessResponse(data: unknown): data is { result: "success" } {
  return typeof data === "object" && data !== null && "result" in data && data.result === "success";
}

/**
 * Checks if the data is a record with string values.
 * @param data - Unknown data to validate
 * @returns True if data is a string record
 */
export function isStringRecord(data: unknown): data is Record<string, string> {
  if (typeof data !== "object" || data === null) return false;
  return Object.entries(data as Record<string, unknown>).every(
    ([k, v]) => typeof k === "string" && typeof v === "string"
  );
}

/**
 * Type guard to check if an object has a specific property.
 * @param data - Unknown data to validate
 * @param key - Property key to check for
 * @returns True if data is an object with the specified key
 */
export function hasProperty<K extends PropertyKey>(
  data: unknown,
  key: K
): data is Record<K, unknown> {
  return typeof data === "object" && data !== null && key in data;
}

/**
 * Asserts that a value is a string and returns it.
 * Throws an error if the value is not a string.
 * @param value - Unknown value to validate
 * @returns The value as a string
 * @throws Error if value is not a string
 */
export function assertString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error(`Expected string, got ${typeof value}`);
  }
  return value;
}

/**
 * Asserts that a value is a number and returns it.
 * Throws an error if the value is not a number.
 * @param value - Unknown value to validate
 * @returns The value as a number
 * @throws Error if value is not a number
 */
export function assertNumber(value: unknown): number {
  if (typeof value !== "number") {
    throw new Error(`Expected number, got ${typeof value}`);
  }
  return value;
}

/**
 * Asserts that a value is an array and returns it.
 * Throws an error if the value is not an array.
 * @param value - Unknown value to validate
 * @returns The value as an array
 * @throws Error if value is not an array
 */
export function assertArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected array, got ${typeof value}`);
  }
  return value as T[];
}

/**
 * Safely extracts a string property from an unknown object.
 * Returns null if the property doesn't exist or is not a string.
 * @param data - Unknown data to extract from
 * @param key - Property key to extract
 * @returns The string value or null
 */
export function getStringProperty(data: unknown, key: string): string | null {
  if (typeof data !== "object" || data === null) return null;
  if (!(key in data)) return null;
  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

/**
 * Safely extracts a number property from an unknown object.
 * Returns null if the property doesn't exist or is not a number.
 * @param data - Unknown data to extract from
 * @param key - Property key to extract
 * @returns The number value or null
 */
export function getNumberProperty(data: unknown, key: string): number | null {
  if (typeof data !== "object" || data === null) return null;
  if (!(key in data)) return null;
  const value = (data as Record<string, unknown>)[key];
  return typeof value === "number" ? value : null;
}

/**
 * Type guard for WHMCS contact objects.
 */
export function isWhmcsContact(data: unknown): data is {
  id: string | number;
  firstname: string;
  lastname: string;
  email: string;
} {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    ("id" in obj && (typeof obj.id === "string" || typeof obj.id === "number")) &&
    "firstname" in obj && typeof obj.firstname === "string" &&
    "lastname" in obj && typeof obj.lastname === "string" &&
    "email" in obj && typeof obj.email === "string"
  );
}

/**
 * Type guard for WHMCS server objects.
 */
export function isWhmcsServer(data: unknown): data is {
  id: string | number;
  name: string;
  type: string;
} {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    ("id" in obj && (typeof obj.id === "string" || typeof obj.id === "number")) &&
    "name" in obj && typeof obj.name === "string" &&
    "type" in obj && typeof obj.type === "string"
  );
}
