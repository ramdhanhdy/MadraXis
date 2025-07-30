import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import CCTVAccessRequest from '@ui/templates/CCTVAccessRequestTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  REQUEST_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  ZONE_LABELS,
  VIEWING_METHOD_LABELS,
  LEGAL_BASIS_OPTIONS,
  DATA_USAGE_PURPOSES,
  CCTV_REQUEST_ERRORS,
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
  mockAvailableLocations 
} from './model';

export default function CCTVRequestScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Permintaan Akses CCTV" 
      }} />
      <CCTVAccessRequest />
    </>
  );
}
