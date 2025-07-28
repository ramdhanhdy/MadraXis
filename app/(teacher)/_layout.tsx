import React from 'react';
import { Stack } from 'expo-router';

export default function TeacherLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="students/index" />
            <Stack.Screen name="students/[id]" />
            <Stack.Screen name="students/add" />
            <Stack.Screen name="index" />
            <Stack.Screen name="class/index" />
            <Stack.Screen name="class/[id]/index" />
            <Stack.Screen name="class/[id]/students/index" />
            <Stack.Screen name="class/[id]/schedule/index" />
            <Stack.Screen name="class/[id]/reports/index" />
            <Stack.Screen
                name="class/[id]/add-students"
                options={{
                    presentation: 'modal',
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    fullScreenGestureEnabled: true,
                }}
            />
        </Stack>
    );
}