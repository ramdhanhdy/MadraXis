/**
 * Anti-Bullying Feature Barrel Export
 * 
 * This file provides a clean interface for importing anti-bullying feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as AntiBullyingScreen } from './screen';

// Types and models
export type {
  AntiBullyingResource,
  AntiBullyingState,
  BullyingReport,
  AntiBullyingResourceSchema,
  BullyingReportSchema,
} from './model';

export {
  antiBullyingResourceSchema,
  bullyingReportSchema,
  RESOURCE_TYPES,
  INCIDENT_TYPES,
  RESOURCE_TYPE_LABELS,
  INCIDENT_TYPE_LABELS,
  DIFFICULTY_LABELS,
  validateResource,
  validateBullyingReport,
  filterResourcesByType,
  searchResources,
  formatDuration,
  initialAntiBullyingState,
  ANTI_BULLYING_ERRORS,
} from './model';
