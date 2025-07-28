import React, { useEffect, useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../src/hooks/useAuth';
import { ThemeProvider } from '../src/context/ThemeContext';
import { NavigationHistoryProvider } from '../src/context/NavigationHistoryContext';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from '../src/components/organisms/AnimatedSplashScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
    const { loading: authLoading } = useAuth();
    const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
    const [splashHidden, setSplashHidden] = useState(false);

    const handleAnimationFinish = useCallback(() => {
        console.log('🎬 Animation finished');
        setSplashAnimationComplete(true);
    }, []);

    useEffect(() => {
        console.log(`🔄 Splash state: authLoading=${authLoading}, animComplete=${splashAnimationComplete}, hidden=${splashHidden}`);
        if (!authLoading && splashAnimationComplete && !splashHidden) {
            console.log('🎬 Hiding splash screen');
            SplashScreen.hideAsync().then(() => {
                setSplashHidden(true);
            });
        }
    }, [authLoading, splashAnimationComplete, splashHidden]);

    // Show animated splash screen until both auth loading and animation are complete
    if (authLoading || !splashAnimationComplete) {
        console.log(`🎬 Showing splash: authLoading=${authLoading}, animComplete=${splashAnimationComplete}`);
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
            <NavigationHistoryProvider>
                <RootLayoutNav />
            </NavigationHistoryProvider>
        </ThemeProvider>
    );
}
