import React from 'react';
import { Stack } from 'expo-router';

export default function StudentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="index" />
            <Stack.Screen name="quran-progress" />
            <Stack.Screen name="schedule" />
            <Stack.Screen name="boarding-info" />
            <Stack.Screen name="incident-report" />
            <Stack.Screen name="anti-bullying" />
        </Stack>
    );
}