import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/src/utils/supabase';
import { Button } from '@ui/atoms/Button';
import { Input } from '@ui/atoms/Input';
import { Typography } from '@ui/atoms/Typography';
// Theme colors are used via baseColors import
import { baseColors } from '@/src/styles/colors';

interface AuthFormProps {
  role?: string | null;
  isManagementScreen?: boolean;
}

export default function AuthForm({ role, isManagementScreen = false }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [mode, setMode] = useState<'login' | 'reset' | 'otp' | 'otp-verify'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Theme colors are used via baseColors import

  async function handleLogin() {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }

  async function handleSendOTP() {
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // B2B: Only existing users
      }
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      Alert.alert('Check your email', 'We\'ve sent you a 6-digit code.');
      setMode('otp-verify');
    }
    setIsLoading(false);
  }

  async function handleVerifyOTP() {
    if (!email || !otpCode) {
      setErrorMessage('Please enter both email and verification code.');
      return;
    }
    
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email',
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }

  async function handleSendReset() {
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'madraxis://reset-password',
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      Alert.alert('Check your email', 'We\'ve sent you a link to set your password.');
      setMode('login');
    }
    setIsLoading(false);
  }

  return (
    <View style={styles.formContainer}>
      {errorMessage ? (
        <View style={[styles.errorContainer, { backgroundColor: baseColors.error[100] }]}>
          <Typography color="error" align="center">{errorMessage}</Typography>
        </View>
      ) : null}
      
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading && mode !== 'otp-verify'}
        leftIcon="mail-outline"
      />

      {mode === 'login' && (
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!isLoading}
          leftIcon="lock-closed-outline"
        />
      )}

      {mode === 'otp-verify' && (
        <Input
          label="Verification Code"
          placeholder="000000"
          value={otpCode}
          onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          editable={!isLoading}
          textAlign="center"
          helperText="Enter the 6-digit code sent to your email"
        />
      )}

      {/* Main Action Buttons */}
      {mode === 'login' ? (
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleLogin}
          disabled={isLoading}
          loading={isLoading}
          icon="log-in-outline"
          iconPosition="left"
        >
          Login with Password
        </Button>
      ) : mode === 'otp' ? (
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSendOTP}
          disabled={isLoading}
          loading={isLoading}
          icon="mail-outline"
          iconPosition="left"
        >
          Send Code
        </Button>
      ) : mode === 'otp-verify' ? (
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleVerifyOTP}
          disabled={isLoading}
          loading={isLoading}
          icon="checkmark-outline"
          iconPosition="left"
        >
          Verify Code
        </Button>
      ) : (
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSendReset}
          disabled={isLoading}
          loading={isLoading}
          icon="mail-outline"
          iconPosition="left"
        >
          Send Reset Link
        </Button>
      )}

      {/* Mode Toggle Links */}
      {mode === 'login' && (
        <>
          <Button
            variant="ghost"
            size="medium"
            onPress={() => setMode('otp')}
            style={styles.toggleButton}
          >
            Or login with code instead
          </Button>
          <Button
            variant="ghost"
            size="medium"
            onPress={() => setMode('reset')}
            style={styles.toggleButton}
          >
            Forgot password? Set/Reset Password
          </Button>
        </>
      )}

      {mode === 'otp' && (
        <Button
          variant="ghost"
          size="medium"
          onPress={() => setMode('login')}
          style={styles.toggleButton}
        >
          Back to password login
        </Button>
      )}

      {mode === 'otp-verify' && (
        <>
          <Button
            variant="ghost"
            size="medium"
            onPress={handleSendOTP}
            disabled={isLoading}
            style={styles.toggleButton}
          >
            Resend code
          </Button>
          <Button
            variant="ghost"
            size="medium"
            onPress={() => setMode('login')}
            style={styles.toggleButton}
          >
            Back to login
          </Button>
        </>
      )}

      {mode === 'reset' && (
        <Button
          variant="ghost"
          size="medium"
          onPress={() => setMode('login')}
          style={styles.toggleButton}
        >
          Back to Login
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
  },
  toggleButton: {
    marginTop: 8,
  },
});
