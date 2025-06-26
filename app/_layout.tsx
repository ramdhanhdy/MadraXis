import React, { useEffect, useCallback, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './components/AnimatedSplashScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
    const { session, loading: authLoading } = useAuth();
    const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
    const router = useRouter();

    const onLayoutRootView = useCallback(async () => {
        if (!authLoading) {
            await SplashScreen.hideAsync();
        }
    }, [authLoading]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    useEffect(() => {
        if (authLoading === false && splashAnimationComplete) {
            if (session) {
                const userRole = session.user?.user_metadata?.role;
                switch (userRole) {
                    case 'teacher':
                        router.replace('/screens/teacher/TeacherDashboard');
                        break;
                    case 'management':
                        if (session.user?.user_metadata?.school_id) {
                            router.replace('/management/dashboard');
                        } else {
                            router.replace('/management/setup');
                        }
                        break;
                    default:
                        // Fallback for other roles if they exist
                        router.replace('/screens/auth/ManagementAuthScreen');
                        break;
                }
            } else {
                // User is not authenticated, send to the management auth screen
                router.replace('/screens/auth/ManagementAuthScreen');
            }
        }
    }, [authLoading, splashAnimationComplete, session, router]);

    if (!splashAnimationComplete || authLoading) {
        return (
            <AnimatedSplashScreen
                onAnimationFinish={() => setSplashAnimationComplete(true)}
            />
        );
    }

    // Auth loading is complete, now render the Stack navigator.
    // The useEffect above will handle redirection based on session state.
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="screens/auth/ManagementAuthScreen" />
                {/* We can remove RoleSelectionScreen and LoginScreen if they are no longer used */}
                {/* <Stack.Screen name="screens/RoleSelectionScreen" /> */}
                {/* <Stack.Screen name="screens/auth/LoginScreen" /> */}
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
                {/* <Stack.Screen name="parent/dashboard" /> */}
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
