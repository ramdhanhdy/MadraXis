import React from 'react';
import { Stack } from 'expo-router';
import AddStudent from '@ui/templates/AddStudentTemplate';

export default function AddStudentPage() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Tambah Siswa" 
      }} />
      <AddStudent />
    </>
  );
}
