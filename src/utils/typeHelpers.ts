/**
 * Type-safe utility functions for handling potentially null/undefined values
 */

/**
 * Asserts that a value is not null or undefined
 */
export function assertNonNull<T>(value: T, message?: string): NonNullable<T> {
  if (value == null) {
    throw new Error(message ?? 'Value is null or undefined');
  }
  return value as NonNullable<T>;
}

/**
 * Safely access a property with null/undefined checks
 */
export function safeAccess<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj?.[key];
}

/**
 * Type guard for checking if a value is not null or undefined
 */
export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

/**
 * Safely parse JSON with error handling
 */
export function safeParseJSON<T = unknown>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

/**
 * Array filter callback that removes null/undefined values
 */
export function filterNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

/**
 * Safely access nested object properties
 */
export function deepAccess<T>(obj: unknown, path: string[]): T | undefined {
  let current = obj;
  for (const key of path) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current as T;
}

/**
 * Type-safe string enum validation
 */
export function isValidEnumValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

/**
 * Creates a type-safe error object
 */
export function createError(message: string, code?: string, details?: unknown): Error {
  const error = new Error(message);
  if (code) {
    (error as Error & { code?: string }).code = code;
  }
  if (details) {
    (error as Error & { details?: unknown }).details = details;
  }
  return error;
}

/**
 * Type assertion for database response
 */
export function assertDatabaseResponse<T>(
  response: { data: T | null; error: Error | null }
): T {
  if (response.error) {
    throw response.error;
  }
  if (response.data == null) {
    throw new Error('Database response contains no data');
  }
  return response.data;
}