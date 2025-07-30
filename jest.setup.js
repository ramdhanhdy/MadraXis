/**
 * Jest Setup Configuration - Backward Compatibility Wrapper
 *
 * This file has been migrated to jest/setup.ts as part of the codebase refactor.
 * This wrapper is kept for backward compatibility during the migration.
 *
 * All actual setup logic is now in jest/setup.ts to avoid duplication
 * and ensure consistency with the new TypeScript-based structure.
 */

// Delegate to the new TypeScript setup file
require('./jest/setup');