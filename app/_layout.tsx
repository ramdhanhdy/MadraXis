import React, { useEffect, useCallback, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './components/AnimatedSplashScreen';
import { supabase } from '../src/utils/supabase';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
    const { loading: authLoading } = useAuth();
    const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

    const onLayoutRootView = useCallback(async () => {
        if (!authLoading) {
            await SplashScreen.hideAsync();
        }
    }, [authLoading]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    if (!splashAnimationComplete || authLoading) {
        return (
            <AnimatedSplashScreen
                onAnimationFinish={() => setSplashAnimationComplete(true)}
            />
        );
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="screens/auth/ManagementAuthScreen" />
                <Stack.Screen name="screens/teacher/TeacherDashboard" />
                <Stack.Screen name="screens/student/StudentDashboard" />
                <Stack.Screen name="teacher/index" />
                <Stack.Screen name="student/index" />
                <Stack.Screen name="student/dashboard" />
                <Stack.Screen name="student/quran-progress" />
                <Stack.Screen name="student/schedule" />
                <Stack.Screen name="student/boarding-info" />
                <Stack.Screen name="student/incident-report" />
                <Stack.Screen name="student/anti-bullying" />
                <Stack.Screen name="teacher/class/index" />
                <Stack.Screen name="teacher/class/[id]/index" />
                <Stack.Screen name="teacher/class/[id]/students/index" />
                <Stack.Screen name="teacher/class/[id]/schedule/index" />
                <Stack.Screen name="teacher/class/[id]/reports/index" />
                <Stack.Screen name="management/dashboard" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
