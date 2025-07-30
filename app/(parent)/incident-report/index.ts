/**
 * Parent Incident Report Feature Barrel Export
 * 
 * This file provides a clean interface for importing parent incident report feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as ParentIncidentReportScreen } from './screen';

// Types and models
export type {
  ParentIncidentReport,
  ParentIncidentReportState,
  IncidentFormData,
  IncidentTemplate,
  ParentIncidentReportSchema,
  IncidentFormSchema,
} from './model';

export {
  parentIncidentReportSchema,
  incidentFormSchema,
  INCIDENT_TYPES,
  INCIDENT_TYPE_LABELS,
  SEVERITY_LEVELS,
  SEVERITY_LABELS,
  REPORT_STATUS,
  STATUS_LABELS,
  COMMON_LOCATIONS,
  COMMON_ACTIONS,
  DESIRED_OUTCOMES,
  validateIncidentReport,
  validateIncidentForm,
  getSeverityColor,
  getStatusColor,
  formatIncidentType,
  formatSeverity,
  formatStatus,
  getIncidentTypeIcon,
  filterReportsByStatus,
  sortReports,
  getUrgentReports,
  initialIncidentFormData,
  initialParentIncidentReportState,
  mockIncidentTemplates,
  PARENT_INCIDENT_ERRORS,
} from './model';
