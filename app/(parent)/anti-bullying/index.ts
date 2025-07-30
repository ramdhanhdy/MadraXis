/**
 * Parent Anti-Bullying Feature Barrel Export
 * 
 * This file provides a clean interface for importing parent anti-bullying feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as ParentAntiBullyingScreen } from './screen';

// Types and models
export type {
  AntiBullyingResource,
  ParentAntiBullyingState,
  BullyingIncident,
  EmergencyContact,
  AntiBullyingResourceSchema,
  BullyingIncidentSchema,
} from './model';

export {
  antiBullyingResourceSchema,
  bullyingIncidentSchema,
  RESOURCE_TYPES,
  RESOURCE_TYPE_LABELS,
  TARGET_AUDIENCE_LABELS,
  AGE_GROUP_LABELS,
  INCIDENT_TYPE_LABELS,
  PRIORITY_LABELS,
  WARNING_SIGNS,
  PREVENTION_TIPS,
  validateResource,
  validateIncident,
  filterResourcesByType,
  filterResourcesByAudience,
  filterResourcesByAgeGroup,
  searchResources,
  getEmergencyResources,
  sortResourcesByPriority,
  formatResourceType,
  formatTargetAudience,
  formatAgeGroup,
  formatIncidentType,
  formatPriority,
  getPriorityColor,
  getResourceTypeIcon,
  initialParentAntiBullyingState,
  mockEmergencyContacts,
  PARENT_ANTI_BULLYING_ERRORS,
} from './model';
