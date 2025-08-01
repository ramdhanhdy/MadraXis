import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { useAuth } from '../../src/hooks/useAuth';
import AuthForm from '../../src/components/organisms/AuthForm';
import { LoadingSpinner } from '../../src/components/atoms/LoadingSpinner';

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="95" fill="#005e7a" />
  <circle cx="100" cy="100" r="85" fill="#ffffff" />
  <path d="M100 60C100 60 70 50 50 60V140C70 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 60C100 60 130 50 150 60V140C130 130 100 140 100 140V60Z" fill="#005e7a" />
  <path d="M100 70C100 70 75 62 60 70V130C75 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 70C100 70 125 62 140 70V130C125 122 100 130 100 130V70Z" fill="#ffffff" />
  <path d="M100 40C100 40 90 45 100 50C110 45 100 40 100 40Z" fill="#f0c75e" />
  <path d="M80 45C80 45 70 50 80 55C90 50 80 45 80 45Z" fill="#f0c75e" />
  <path d="M120 45C120 45 110 50 120 55C130 50 120 45 120 45Z" fill="#f0c75e" />
  <path d="M70 160H130V170H70V160Z" fill="#005e7a" />
  <path d="M70 160L130 160L100 145L70 160Z" fill="#005e7a" />
  <path d="M85 170V180H115V170" stroke="#005e7a" stroke-width="10" stroke-linecap="round" />
</svg>`;

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const { session, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </View>
      </View>
    );
  }

  // Don't render login form if user is authenticated
  if (session) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.logoContainer}>
        <SvgXml xml={logoSvg} width={100} height={100} />
        <Text style={styles.appName}>Pondok Pesantren Tahfidz ZAID BIN TSAABIT</Text>
        {role && (
          <View style={styles.roleChip}>
            <Text style={styles.roleText}>
              Login as: {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </View>
        )}
      </View>

      <AuthForm role={role} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
    textAlign: 'center',
  },
  roleChip: {
    backgroundColor: '#005e7a',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  roleText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#005e7a',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#005e7a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#f0c75e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});