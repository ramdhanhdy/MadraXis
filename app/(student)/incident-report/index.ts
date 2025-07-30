/**
 * Incident Report Feature Barrel Export
 * 
 * This file provides a clean interface for importing incident report feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as IncidentReportScreen } from './screen';

// Types and models
export type {
  IncidentReport,
  IncidentReportState,
  IncidentFormData,
  IncidentReportSchema,
  IncidentFormSchema,
} from './model';

export {
  incidentReportSchema,
  incidentFormSchema,
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  INCIDENT_STATUS,
  INCIDENT_TYPE_LABELS,
  SEVERITY_LABELS,
  STATUS_LABELS,
  validateIncidentReport,
  validateIncidentForm,
  getSeverityColor,
  getStatusColor,
  formatIncidentType,
  formatSeverity,
  formatStatus,
  initialIncidentReportState,
  initialIncidentFormData,
  INCIDENT_ERRORS,
} from './model';
