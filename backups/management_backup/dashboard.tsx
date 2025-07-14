import React from 'react';
import { Stack } from 'expo-router';
import ManagementDashboard from '../screens/management/ManagementDashboard';

export default function ManagementDashboardScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Dashboard Manajemen" 
      }} />
      <ManagementDashboard />
    </>
  );
} 