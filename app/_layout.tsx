import React, { useEffect, useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/features/authentication/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';

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


    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/reset-password" />
                <Stack.Screen name="(student)/dashboard" />
                <Stack.Screen name="(student)/anti-bullying" />
                <Stack.Screen name="(student)/boarding-info" />
                <Stack.Screen name="(student)/incident-report" />
                <Stack.Screen name="(student)/quran-progress" />
                <Stack.Screen name="(student)/schedule" />
                <Stack.Screen name="(teacher)/dashboard" />
                <Stack.Screen name="(teacher)/classes" />
                <Stack.Screen name="(teacher)/students" />
                <Stack.Screen name="(teacher)/class/[id]" />
                <Stack.Screen name="(teacher)/class/[id]/students" />
                <Stack.Screen name="(teacher)/class/[id]/schedule" />
                <Stack.Screen name="(teacher)/class/[id]/reports" />
                <Stack.Screen name="(parent)/dashboard" />
                <Stack.Screen name="(management)/dashboard" />
                <Stack.Screen name="(management)/finance/index" options={{ title: "Finance Hub" }} />
                <Stack.Screen name="management/setup" />
                <Stack.Screen name="home" />
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
