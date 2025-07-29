import React from 'react';
import { Stack } from 'expo-router';
import ClassDetailView from '../../../../src/components/templates/ClassDetailView';

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