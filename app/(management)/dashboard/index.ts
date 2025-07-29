/**
 * Management Dashboard Feature Barrel Export
 * 
 * This file provides a clean interface for importing management dashboard feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as ManagementDashboardScreen } from './screen';

// Types and models
export type {
  DashboardMetrics,
  Incident,
  IoniconsIcon,
  ManagementDashboardState,
  QuickActionItem,
  HeaderAction,
  TabItem,
  IncidentSummary,
  IncidentSchema,
  DashboardMetricsSchema,
} from './model';

export {
  incidentSchema,
  dashboardMetricsSchema,
  DASHBOARD_TABS,
  TAB_LABELS,
  INCIDENT_STATUS,
  INCIDENT_STATUS_LABELS,
  INCIDENT_TYPES,
  INCIDENT_TYPE_LABELS,
  validateIncident,
  getIncidentPriorityColor,
  getIncidentStatusColor,
  getRelativeTime,
  formatIncidentType,
  formatIncidentStatus,
  calculateIncidentSummary,
  getRecentIncidents,
  getPendingIncidentsCount,
  filterIncidentsByStatus,
  filterIncidentsByType,
  searchIncidents,
  formatDashboardMetrics,
  getMetricChangeIndicator,
  calculateMetricPercentageChange,
  initialManagementDashboardState,
  MANAGEMENT_DASHBOARD_ERRORS,
} from './model';
