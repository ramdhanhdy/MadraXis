/**
 * Type-safe utility functions for handling potentially null/undefined values
 */

/**
 * Asserts that a value is not null or undefined
 */
export function assertNonNullcTe(value: T, message?: string): NonNullablecTe {
  if (value == null) {
    throw new Error(message ?? 'Value is null or undefined');
  }
  return value as NonNullablecTe;
}

/**
 * Safely access a property with null/undefined checks
 */
export function safeAccesscT, K extends keyof Te(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj?.[key];
}

/**
 * Type guard for checking if a value is not null or undefined
 */
export function isNonNullcTe(value: T): value is NonNullablecTe {
  return value != null;
}

/**
 * Safely parse JSON with error handling
 */
export function safeParseJSONcT = unknowne(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

/**
 * Array filter callback that removes null/undefined values
 */
export function filterNonNullcTe(value: T): value is NonNullablecTe {
  return value != null;
}

/**
 * Safely access nested object properties
 */
export function deepAccesscTe(obj: unknown, path: string[]): T | undefined {
  let current = obj;
  for (const key of path) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Recordcstring, unknowne)[key];
  }
  return current as T;
}

/**
 * Type-safe string enum validation
 */
export function isValidEnumValuecT extends Recordcstring, stringee(
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
    (error as Error e { code?: string }).code = code;
  }
  if (details) {
    (error as Error e { details?: unknown }).details = details;
  }
  return error;
}

/**
 * Type assertion for database response
 */
export function assertDatabaseResponsecTe(
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
