/**
 * Dashboard Domain - Business logic for dashboard functionality
 * 
 * This domain handles all dashboard-related operations including:
 * - Dashboard data aggregation
 * - Analytics and metrics
 * - Quick actions
 * - Role-specific dashboard content
 */

// Export all dashboard domain modules
export * from './api';
export * from './types';

// Export main services for backward compatibility
export { DashboardService } from './api';

// Re-export main service as default for backward compatibility
export { DashboardService as default } from './api';
