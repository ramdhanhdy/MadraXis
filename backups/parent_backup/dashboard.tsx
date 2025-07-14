import React from 'react';
import { Stack } from 'expo-router';
import ParentDashboard from '../screens/parent/ParentDashboard';

export default function ParentDashboardScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Dashboard Orang Tua" 
      }} />
      <ParentDashboard />
    </>
  );
} 