import React, { useEffect, useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './components/AnimatedSplashScreen';

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
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(student)" options={{ headerShown: false }} />
                <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
                <Stack.Screen name="(parent)" options={{ headerShown: false }} />
                <Stack.Screen name="(management)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="light" />
        </>
    );
};

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </ThemeProvider>
    );
}
