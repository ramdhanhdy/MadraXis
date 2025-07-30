import React from 'react';
import { Stack } from 'expo-router';
import ClassSchedule from '../../../../../src/components/templates/ClassScheduleTemplate';

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