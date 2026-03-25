/**
 * Simple in-memory caching layer using LRU eviction.
 * Used to cache expensive WHMCS API responses (e.g., dashboard data).
 *
 * @module cache
 */

import { LRUCache } from "lru-cache";

/**
 * Cache configuration options.
 */
interface CacheOptions {
  /** Maximum number of items to store in cache */
  max: number;
  /** Time-to-live in milliseconds */
  ttl: number;
}

/**
 * Default cache configuration.
 * - max: 500 items
 * - ttl: 2 minutes (120,000 ms)
 */
const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  max: 500,
  ttl: 1000 * 60 * 2,
};

/**
 * LRU cache instance for storing dashboard and other expensive data.
 */
const cache = new LRUCache<string, any>(DEFAULT_CACHE_OPTIONS);

/**
 * Gets a value from cache or fetches it using the provided function.
 * @param key - Cache key
 * @param fetcher - Function to fetch the data if not cached
 * @returns Promise resolving to the cached or fetched data
 * @template T - Type of data being cached
 */
export async function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key) as T | undefined;
  if (cached !== undefined) {
    return cached;
  }

  const result = await fetcher();
  cache.set(key, result);
  return result;
}

/**
 * Sets a value in the cache.
 * @param key - Cache key
 * @param value - Value to cache
 * @template T - Type of data being cached
 */
export function setCached<T>(key: string, value: T): void {
  cache.set(key, value);
}

/**
 * Invalidates a cache entry by key.
 * @param key - Cache key to invalidate
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Clears all cache entries.
 * Use this when data is modified and needs to be refreshed.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Gets cache statistics.
 * @returns Object with cache size and configuration
 */
export function getCacheStats(): { size: number; max: number; ttl: number } {
  return {
    size: cache.size,
    max: DEFAULT_CACHE_OPTIONS.max,
    ttl: DEFAULT_CACHE_OPTIONS.ttl,
  };
}

/**
 * Generates a cache key for dashboard data.
 * @param clientId - Client ID for the dashboard
 * @returns Cache key string
 */
export function dashboardCacheKey(clientId: string): string {
  return `dashboard:${clientId}`;
}

/**
 * Generates a cache key for invoice data.
 * @param clientId - Client ID
 * @param invoiceId - Invoice ID
 * @returns Cache key string
 */
export function invoiceCacheKey(clientId: string, invoiceId: string): string {
  return `invoice:${clientId}:${invoiceId}`;
}

/**
 * Generates a cache key for ticket data.
 * @param clientId - Client ID
 * @returns Cache key string
 */
export function ticketsCacheKey(clientId: string): string {
  return `tickets:${clientId}`;
}

/**
 * Invalidates all cache entries for a specific client.
 * Use when client data is modified.
 * @param clientId - Client ID to invalidate cache for
 */
export function invalidateClientCache(clientId: string): void {
  const keysToDelete: string[] = [];
  for (const key of cache.keys()) {
    if (key.includes(`:${clientId}`) || key.startsWith(`${clientId}:`)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => cache.delete(key));
}
