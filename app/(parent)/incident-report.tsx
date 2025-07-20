import React from 'react';
import { Stack } from 'expo-router';
import IncidentReport from '../screens/parent/IncidentReport';

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