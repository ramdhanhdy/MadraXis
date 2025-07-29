import React from 'react';
import { Stack } from 'expo-router';
import ClassDetailView from '@ui/templates/ClassDetailView';

export default function ClassDetailIndex() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Detail Kelas"
      }} />
      <ClassDetailView />
    </>
  );
}