import React from 'react';
import { Stack } from 'expo-router';
import StudentDetail from '@ui/templates/StudentDetailTemplate';

export default function StudentDetailPage() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Detail Siswa" 
      }} />
      <StudentDetail />
    </>
  );
}
