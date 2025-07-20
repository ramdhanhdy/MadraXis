import React from 'react';
import { Stack } from 'expo-router';
import ClassDetail from '../../../../src/components/templates/ClassDetailTemplate';

export default function ClassDetailIndex() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Detail Kelas"
      }} />
      <ClassDetail />
    </>
  );
}