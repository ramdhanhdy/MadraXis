/**
 * Login Feature UI Components
 * 
 * This module contains UI components specific to the login feature.
 * These components are composed from the atomic design system components.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Typography } from '@ui/atoms/Typography';
import { Button } from '@ui/atoms/Button';
import { Input } from '@ui/atoms/Input';
import { LoadingSpinner } from '@ui/atoms/LoadingSpinner';
import { Card } from '@ui/molecules/Card';
import type { LoginFormData, UserRole } from './model';

// Logo SVG - could be moved to a shared assets location
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

interface LoginHeaderProps {
  role?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ role }) => {
  return (
    <View style={styles.logoContainer}>
      <SvgXml xml={logoSvg} width={100} height={100} />
      <Typography 
        variant="h4" 
        color="primary" 
        weight="bold" 
        align="center"
        style={styles.appName}
      >
        Pondok Pesantren Tahfidz ZAID BIN TSAABIT
      </Typography>
      {role && (
        <View style={styles.roleChip}>
          <Typography variant="body2" color="white" weight="bold">
            Login as: {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
        </View>
      )}
    </View>
  );
};

interface LoginFormProps {
  formData: LoginFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  onFormDataChange: (data: Partial<LoginFormData>) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  isLoading,
  onFormDataChange,
  onSubmit,
  onForgotPassword,
}) => {
  return (
    <Card variant="default" padding="large" style={styles.formCard}>
      {errors.general && (
        <View style={styles.errorContainer}>
          <Typography variant="body2" color="error" align="center">
            {errors.general}
          </Typography>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(email) => onFormDataChange({ email })}
          placeholder="Masukkan email Anda"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          testID="login-email-input"
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Password"
          value={formData.password}
          onChangeText={(password) => onFormDataChange({ password })}
          placeholder="Masukkan password Anda"
          secureTextEntry
          autoComplete="password"
          error={errors.password}
          testID="login-password-input"
        />
      </View>

      <View style={styles.forgotPasswordContainer}>
        <Button
          variant="text"
          size="small"
          onPress={onForgotPassword}
          testID="forgot-password-button"
        >
          Lupa Password?
        </Button>
      </View>

      <Button
        variant="solid"
        size="large"
        onPress={onSubmit}
        disabled={isLoading}
        style={styles.loginButton}
        testID="login-submit-button"
      >
        {isLoading ? 'Masuk...' : 'Masuk'}
      </Button>
    </Card>
  );
};

interface LoginLoadingProps {
  message?: string;
}

export const LoginLoading: React.FC<LoginLoadingProps> = ({ 
  message = 'Memuat...' 
}) => {
  return (
    <View style={styles.loadingContainer}>
      <LoadingSpinner size="large" />
      <Typography 
        variant="body1" 
        color="secondary" 
        align="center"
        style={styles.loadingText}
      >
        {message}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  appName: {
    marginTop: 16,
    marginBottom: 8,
  },
  roleChip: {
    backgroundColor: '#005e7a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  formCard: {
    marginHorizontal: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
  },
});
