/**
 * Users Domain - Business logic for user management
 * 
 * This domain handles all user-related operations including:
 * - Student management
 * - Teacher management
 * - Parent management
 * - User profiles and authentication
 */

// Export all users domain modules
export * from './api';
export * from './hooks';
export * from './store';
export * from './types';

// Export main services for backward compatibility
export {
  UserService,
  UserRepository
} from './api';

// Export specific functions for backward compatibility
// Import the actual service functions
import { UserService } from './api';

export const fetchStudents = UserService.fetchStudents;
export const fetchTeachers = UserService.fetchTeachers;

// Re-export main service as default for backward compatibility
export { UserService as default } from './api';
