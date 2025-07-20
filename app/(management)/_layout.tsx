import React from 'react';
import { Stack } from 'expo-router';

export default function ManagementLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="setup" />
            <Stack.Screen name="user-management" />
        </Stack>
    );
}