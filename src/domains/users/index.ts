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

// Re-export main service as default for backward compatibility
export { UserService as default } from './api';
