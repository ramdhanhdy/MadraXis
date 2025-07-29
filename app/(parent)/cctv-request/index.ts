/**
 * CCTV Request Feature Barrel Export
 * 
 * This file provides a clean interface for importing CCTV request feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as CCTVRequestScreen } from './screen';

// Types and models
export type {
  CCTVRequest,
  CCTVLocation,
  CCTVRequestState,
  RequestFormData,
  CCTVRequestSchema,
  RequestFormSchema,
} from './model';

export {
  cctvRequestSchema,
  requestFormSchema,
  REQUEST_TYPES,
  REQUEST_TYPE_LABELS,
  PRIORITY_LEVELS,
  PRIORITY_LABELS,
  REQUEST_STATUS,
  STATUS_LABELS,
  LOCATION_ZONES,
  ZONE_LABELS,
  LEGAL_BASIS_OPTIONS,
  DATA_USAGE_PURPOSES,
  VIEWING_METHODS,
  VIEWING_METHOD_LABELS,
  validateCCTVRequest,
  validateRequestForm,
  parseTime,
  formatTime,
  getPriorityColor,
  getStatusColor,
  formatRequestType,
  formatPriority,
  formatStatus,
  formatZone,
  formatViewingMethod,
  calculateRequestDuration,
  isRequestExpired,
  canRequestLocation,
  filterRequestsByStatus,
  sortRequests,
  initialRequestFormData,
  initialCCTVRequestState,
  mockAvailableLocations,
  CCTV_REQUEST_ERRORS,
} from './model';
