import React from 'react';
import { Stack } from 'expo-router';

export default function ParentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="incident-report" />
            <Stack.Screen name="anti-bullying" />
            <Stack.Screen name="cctv-request" />
        </Stack>
    );
}