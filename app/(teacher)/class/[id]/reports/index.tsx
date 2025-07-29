import React from 'react';
import { Stack } from 'expo-router';
import ClassReports from '@ui/templates/ClassReportsTemplate';

export default function ClassReportsIndex() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Laporan Kelas"
      }} />
      <ClassReports />
    </>
  );
}