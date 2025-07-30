/**
 * Class Domain - Business logic for class management
 *
 * This domain handles all class-related operations including:
 * - Class CRUD operations
 * - Student enrollment
 * - Class scheduling
 * - Teacher assignments
 */

// Export all class domain modules
export * from './api';
export * from './hooks';
export * from './store';
export * from './types';

// Legacy exports for backward compatibility
export {
  ClassService,
  ClassRepository,
  ClassAccessControl,
  ClassEnrollmentService,
  ClassBulkOperations
} from './api';

// Re-export main service as default for backward compatibility
export { ClassService as default } from './api';
