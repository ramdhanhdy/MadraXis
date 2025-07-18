import React, { useEffect, useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './components/AnimatedSplashScreen';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
    const { loading: authLoading } = useAuth();
    const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

    const handleAnimationFinish = () => {
        requestAnimationFrame(() => {
            setSplashAnimationComplete(true);
        });
    };

    const onLayoutRootView = useCallback(async () => {
        if (!authLoading && splashAnimationComplete) {
            await SplashScreen.hideAsync();
        }
    }, [authLoading, splashAnimationComplete]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    // Show animated splash screen until both auth loading and animation are complete
    if (authLoading || !splashAnimationComplete) {
        return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="debug-auth" />
                <Stack.Screen name="screens/auth/login" />
                <Stack.Screen name="screens/auth/ManagementAuthScreen" />
                <Stack.Screen name="screens/teacher/TeacherDashboard" />
                <Stack.Screen name="screens/student/StudentDashboard" />
                <Stack.Screen name="screens/parent/ParentDashboard" />
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
                <Stack.Screen name="management/setup" />
                <Stack.Screen name="management/user-management" />
                <Stack.Screen name="(management)/finance/index" options={{ title: "Finance Hub" }} />
                <Stack.Screen name="parent/dashboard" />
                <Stack.Screen name="parent/incident-report" />
                <Stack.Screen name="parent/anti-bullying" />
                <Stack.Screen name="parent/cctv-request" />
                <Stack.Screen name="(auth)/reset-password" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
};

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <RootLayoutNav />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
