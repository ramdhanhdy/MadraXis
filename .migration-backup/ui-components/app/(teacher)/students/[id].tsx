import React from 'react';
import { Stack } from 'expo-router';
import StudentDetail from '../../../src/components/templates/StudentDetailTemplate';

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
