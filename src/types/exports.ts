/**
 * Type Exports - Single Entry Point
 *
 * This file serves as the main entry point for all type definitions.
 * All types have been consolidated into index.ts for better organization.
 *
 * Usage:
 * - import { Profile, Class, DashboardMetrics } from '@types';
 * - import type { UserRole, ClassStatus } from '@types';
 */

// Export all consolidated types from index.ts
export * from './index';

// Legacy compatibility - individual files are maintained for backward compatibility
// but all types are now consolidated in index.ts to avoid duplicate exports
// Individual files can still be imported directly if needed:
// - import { Class } from '@types/class';
// - import { DashboardMetrics } from '@types/dashboard';
// - import { Database } from '@types/database';
// - import { Student } from '@types/student';

// Service-specific types (these remain in their respective service files)
export type { School } from '../services/schools';

// Note: Utility types from typeHelpers.ts are temporarily excluded due to syntax errors
// They will be re-added once the typeHelpers.ts file is fixed
// export * from '../lib/utils/typeHelpers';