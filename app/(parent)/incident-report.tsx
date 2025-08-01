import React from 'react';
import { Stack } from 'expo-router';
import IncidentReport from '../../src/components/templates/ParentIncidentReportTemplate';

export default function IncidentReportScreen() {
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