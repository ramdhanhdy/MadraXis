/**
 * Input sanitization utilities to prevent SQL injection attacks
 */

/**
 * Sanitizes a string to prevent SQL injection in LIKE clauses
 * Removes special characters that could be used for SQL injection
 * 
 * @param input - The input string to sanitize
 * @returns Sanitized string safe for use in LIKE clauses
 */
export function sanitizeLikeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove SQL special characters and escape wildcards
  return input
    .replace(/[%_\\]/g, '\\$&') // Escape %, _, and \ characters
    .replace(/['"`;\-\-\/\*\+\=\<\>\!\@\#\$\^\&\*\(\)\[\]\{\}\|\:\?\~]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 255); // Limit length to prevent buffer overflow
}

/**
 * Sanitizes a string for use in SQL identifiers (column names, table names)
 * Only allows alphanumeric characters and underscores
 * 
 * @param input - The input string to sanitize
 * @returns Sanitized string safe for use as SQL identifier
 */
export function sanitizeIdentifier(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Only allow alphanumeric characters and underscores
  return input.replace(/[^a-zA-Z0-9_]/g, '');
}

/**
 * Sanitizes an array of IDs for use in SQL IN clauses
 * Ensures all elements are valid identifiers/numbers
 * 
 * @param ids - Array of IDs to sanitize
 * @returns Array of sanitized IDs
 */
export function sanitizeIdArray(ids: (string | number)[]): (string | number)[] {
  if (!Array.isArray(ids)) return [];
  
  return ids.filter(id => {
    if (typeof id === 'number') {
      return Number.isInteger(id) && id > 0;
    }
    if (typeof id === 'string') {
      return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 0;
    }
    return false;
  });
}

/**
 * Validates and sanitizes pagination parameters
 * 
 * @param page - Page number
 * @param limit - Items per page limit
 * @returns Sanitized pagination parameters
 */
export function sanitizePagination(page: unknown, limit: unknown): { page: number; limit: number } {
  const sanitizedPage = Math.max(1, Math.floor(Number(page) || 1));
  const sanitizedLimit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 20))); // Max 100 items per page
  
  return { page: sanitizedPage, limit: sanitizedLimit };
}

/**
 * Validates and sanitizes sort parameters
 * 
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction ('asc' or 'desc')
 * @returns Sanitized sort parameters
 */
export function sanitizeSortParams(
  sortBy: unknown,
  sortOrder: unknown
): { sortBy: string; sortOrder: 'asc' | 'desc' } {
  const validSortFields = [
    'name', 'full_name', 'created_at', 'updated_at', 'level', 'student_count',
    'nis', 'gender', 'boarding', 'date_of_birth'
  ];
  
  const sanitizedSortBy = validSortFields.includes(String(sortBy)) ? String(sortBy) : 'created_at';
  const sanitizedSortOrder = String(sortOrder).toLowerCase() === 'asc' ? 'asc' : 'desc';
  
  return { sortBy: sanitizedSortBy, sortOrder: sanitizedSortOrder };
}

/**
 * Validates and sanitizes enum values
 * 
 * @param value - Value to validate
 * @param validValues - Array of valid enum values
 * @param defaultValue - Default value if validation fails
 * @returns Sanitized enum value
 */
export function sanitizeEnum<T extends string>(
  value: unknown,
  validValues: readonly T[],
  defaultValue: T
): T {
  const stringValue = String(value).slice(0, 50); // Limit length
  return validValues.includes(stringValue as T) ? (stringValue as T) : defaultValue;
}

/**
 * Validates and sanitizes numeric input for SQL queries
 * Ensures the value is a valid integer within safe bounds
 * 
 * @param value - Value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param defaultValue - Default value if validation fails
 * @returns Sanitized numeric value
 */
export function sanitizeNumeric(
  value: unknown,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER,
  defaultValue: number = 0
): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return defaultValue;
  return Math.max(min, Math.min(max, Math.floor(num)));
}

/**
 * Validates and sanitizes string input for SQL queries
 * Removes dangerous characters and limits length
 * 
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string safe for SQL queries
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/['"`;\/]/g, '') // Remove SQL special characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and sanitizes array input for SQL IN clauses
 * Ensures all elements are valid and within safe bounds
 * 
 * @param input - Array to validate
 * @param maxLength - Maximum array length
 * @returns Sanitized array safe for SQL IN clauses
 */
export function sanitizeArray<T extends string | number>(
  input: T[],
  maxLength: number = 1000
): T[] {
  if (!Array.isArray(input)) return [];
  
  return input
    .slice(0, maxLength)
    .filter((item, index, self) => {
      // Ensure unique values only
      return self.indexOf(item) === index;
    })
    .filter(item => {
      if (typeof item === 'number') {
        return Number.isInteger(item) && item > 0 && item <= 2147483647; // PostgreSQL int max
      }
      if (typeof item === 'string') {
        return /^[a-zA-Z0-9_-]+$/.test(item) && item.length > 0 && item.length <= 255;
      }
      return false;
    });
}

/**
 * Validates and sanitizes boolean values
 * 
 * @param value - Value to validate
 * @param defaultValue - Default value if validation fails
 * @returns Sanitized boolean value
 */
export function sanitizeBoolean(value: unknown, defaultValue: boolean = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return defaultValue;
}