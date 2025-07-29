/**
 * Subjects Domain - Business logic for subject management
 * 
 * This domain handles all subject-related operations including:
 * - Subject CRUD operations
 * - Grading systems
 * - Standards alignment
 * - Subject scheduling
 */

// Export all subjects domain modules
export * from './api';
export * from './types';

// Export main services for backward compatibility
export {
  SubjectService,
  SubjectRepository
} from './api';

// Re-export main service as default for backward compatibility
export { SubjectService as default } from './api';
