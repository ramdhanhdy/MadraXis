/**
 * Utility functions for safe ID conversion between string and number types.
 * This ensures type compatibility when interfacing between components that use
 * different ID formats (GlobalStudent uses string, local components use number).
 */

/**
 * Safely converts a string ID to a number.
 * @param id - The string ID to convert
 * @returns The numeric ID
 * @throws Error if the ID format is invalid
 */
export const convertStringToNumber = (id: string): number => {
  // Validate input is not empty or just whitespace
  if (!id || id.trim().length === 0) {
    throw new Error(`Invalid ID format: empty or whitespace-only string`);
  }
  
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    throw new Error(`Invalid ID format: ${id}`);
  }
  return numId;
};

/**
 * Converts a number ID to a string.
 * @param id - The numeric ID to convert
 * @returns The string representation of the ID
 * @throws Error if the input is not a valid positive number
 */
export const convertNumberToString = (id: number): string => {
  // Validate input is a valid positive number
  if (typeof id !== 'number' || isNaN(id) || id <= 0) {
    throw new Error(`Invalid ID format: must be a positive number, received ${id}`);
  }
  
  return id.toString();
};

/**
 * Type guard to check if a value is a valid numeric ID.
 * @param value - The value to check
 * @returns True if the value is a valid numeric ID
 */
export const isValidNumericId = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Type guard to check if a value is a valid string ID.
 * @param value - The value to check
 * @returns True if the value is a valid string ID
 */
export const isValidStringId = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 && !isNaN(parseInt(trimmedValue, 10));
};
