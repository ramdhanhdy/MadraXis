import React from 'react';
import { Stack } from 'expo-router';

export default function TeacherLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="classes" />
            <Stack.Screen name="students" />
            <Stack.Screen name="index" />
            <Stack.Screen name="class/index" />
            <Stack.Screen name="class/[id]/index" />
            <Stack.Screen name="class/[id]/students/index" />
            <Stack.Screen name="class/[id]/schedule/index" />
            <Stack.Screen name="class/[id]/reports/index" />
        </Stack>
    );
}