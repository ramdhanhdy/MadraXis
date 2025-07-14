import React from 'react';
import { Stack } from 'expo-router';
import StudentDashboard from '../screens/student/StudentDashboard';

export default function StudentDashboardScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Dashboard Siswa" 
      }} />
      <StudentDashboard />
    </>
  );
} 