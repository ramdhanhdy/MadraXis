import React from 'react';
import { Stack } from 'expo-router';
import ClassSchedule from '@ui/templates/ClassScheduleTemplate';

export default function ClassScheduleIndex() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Jadwal Kelas"
      }} />
      <ClassSchedule />
    </>
  );
}