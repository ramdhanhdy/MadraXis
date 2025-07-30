import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useAuth } from '@context/AuthContext';
import { LoginHeader, LoginForm, LoginLoading } from './ui';
import { useLogin } from './model'; // Assumes a hook for login logic from the feature's model/store

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const { session, loading: authLoading } = useAuth();

  // This custom hook would encapsulate form state, validation, and submission logic
  // as per the FSD pattern described in your project docs.
  const {
    formData,
    errors,
    isLoading: loginLoading,
    handleFormDataChange,
    handleLogin,
  } = useLogin({ role });

  const handleForgotPassword = () => {
    router.push('/(auth)/reset-password');
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoginLoading message="Checking session..." />
      </View>
    );
  }

  // Don't render login form if user is authenticated
  if (session) {
    return null; // Or a redirect component
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginHeader role={role} />
      <LoginForm
        formData={formData}
        errors={errors}
        isLoading={loginLoading}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // This should come from the design system theme
    padding: 20,
  },
});
