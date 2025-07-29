import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import IncidentReport from '@ui/templates/ParentIncidentReportTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  INCIDENT_TYPE_LABELS,
  SEVERITY_LABELS,
  STATUS_LABELS,
  COMMON_LOCATIONS,
  COMMON_ACTIONS,
  DESIRED_OUTCOMES,
  PARENT_INCIDENT_ERRORS,
  getSeverityColor,
  getStatusColor,
  formatIncidentType,
  formatSeverity,
  formatStatus,
  getIncidentTypeIcon,
  filterReportsByStatus,
  sortReports,
  getUrgentReports,
  mockIncidentTemplates 
} from './model';

export default function ParentIncidentReportScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Laporan Insiden" 
      }} />
      <IncidentReport />
    </>
  );
}
