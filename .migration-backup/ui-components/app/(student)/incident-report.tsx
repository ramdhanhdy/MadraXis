import React from 'react';
import { Stack } from 'expo-router';
import IncidentReport from '@ui/templates/StudentIncidentReportTemplate';

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