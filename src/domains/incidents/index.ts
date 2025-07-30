/**
 * Incidents Domain - Business logic for incident management
 * 
 * This domain handles all incident-related operations including:
 * - Incident reporting
 * - Incident tracking
 * - Anti-bullying resources
 * - Communication with parents/teachers
 */

// Export all incidents domain modules
export * from './api';
export * from './hooks';
export * from './store';
export * from './types';

// Export main services for backward compatibility
export {
  IncidentService,
  IncidentRepository
} from './api';

// Re-export main service as default for backward compatibility
export { IncidentService as default } from './api';
