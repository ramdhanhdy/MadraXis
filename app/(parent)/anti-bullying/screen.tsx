import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import AntiBullyingResources from '@ui/templates/AntiBullyingResourcesTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  RESOURCE_TYPE_LABELS,
  TARGET_AUDIENCE_LABELS,
  AGE_GROUP_LABELS,
  INCIDENT_TYPE_LABELS,
  PRIORITY_LABELS,
  WARNING_SIGNS,
  PREVENTION_TIPS,
  PARENT_ANTI_BULLYING_ERRORS,
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
  mockEmergencyContacts 
} from './model';

export default function ParentAntiBullyingScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Sumber Daya Anti-Perundungan" 
      }} />
      <AntiBullyingResources />
    </>
  );
}
