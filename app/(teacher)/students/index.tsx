import React from 'react';
import { Stack } from 'expo-router';
import StudentsList from '@ui/templates/StudentsListTemplate';

export default function StudentsListPage() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Daftar Siswa" 
      }} />
      <StudentsList />
    </>
  );
}
