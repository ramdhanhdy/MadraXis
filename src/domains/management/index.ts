/**
 * Management Domain - Business logic for school administration and management
 *
 * This domain handles all administrative operations including:
 * - School profile and configuration
 * - Administrative settings and setup
 * - Multi-school support
 * - System-wide management features
 */

// Export all management domain modules
export * from './api';
export * from './types';

// Export main services for backward compatibility
export {
  SchoolService,
  SchoolRepository
} from './api';

// Re-export main service as default for backward compatibility
export { SchoolService as default } from './api';
