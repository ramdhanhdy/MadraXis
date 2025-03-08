import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/RoleSelectionScreen" />
        <Stack.Screen name="screens/teacher/TeacherDashboard" />
        <Stack.Screen name="screens/student/StudentDashboard" />
        <Stack.Screen name="teacher/index" />
        <Stack.Screen name="student/index" />
        <Stack.Screen name="teacher/class/index" />
        <Stack.Screen name="teacher/class/[id]/index" />
        <Stack.Screen name="teacher/class/[id]/students/index" />
        <Stack.Screen name="teacher/class/[id]/schedule/index" />
        <Stack.Screen name="teacher/class/[id]/reports/index" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
