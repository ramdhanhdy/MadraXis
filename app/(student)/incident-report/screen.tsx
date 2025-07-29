import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import IncidentReport from '@ui/templates/StudentIncidentReportTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  INCIDENT_TYPE_LABELS,
  SEVERITY_LABELS,
  STATUS_LABELS,
  INCIDENT_ERRORS,
  getSeverityColor,
  getStatusColor,
  formatIncidentType,
  formatSeverity,
  formatStatus 
} from './model';

export default function IncidentReportScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Lapor Masalah" 
      }} />
      <IncidentReport />
    </>
  );
}
