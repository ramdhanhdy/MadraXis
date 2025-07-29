import React from 'react';
import { Stack } from 'expo-router';
import ClassesList from '@ui/templates/ClassesListTemplate';

export default function ClassesIndex() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Daftar Kelas"
      }} />
      <ClassesList />
    </>
  );
}