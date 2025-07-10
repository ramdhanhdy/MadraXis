import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/src/utils/supabase';

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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, mode === 'otp-verify' && styles.disabledInput]}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading && mode !== 'otp-verify'}
        />
      </View>

      {mode === 'login' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
      )}

      {mode === 'otp-verify' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[styles.input, styles.otpInput]}
            placeholder="000000"
            value={otpCode}
            onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
            textAlign="center"
          />
          <Text style={styles.otpHint}>Enter the 6-digit code sent to your email</Text>
        </View>
      )}

      {/* Main Action Buttons */}
      {mode === 'login' ? (
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Login with Password</Text>
          )}
        </TouchableOpacity>
      ) : mode === 'otp' ? (
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleSendOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Send Code</Text>
          )}
        </TouchableOpacity>
      ) : mode === 'otp-verify' ? (
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Verify Code</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleSendReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Mode Toggle Links */}
      {mode === 'login' && (
        <>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => setMode('otp')}
          >
            <Text style={styles.toggleText}>Or login with code instead</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => setMode('reset')}
          >
            <Text style={styles.forgotPasswordText}>Forgot password? Set/Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      {mode === 'otp' && (
        <>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => setMode('login')}
          >
            <Text style={styles.toggleText}>Back to password login</Text>
          </TouchableOpacity>
        </>
      )}

      {mode === 'otp-verify' && (
        <>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Text style={[styles.toggleText, isLoading && styles.disabledText]}>Resend code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => setMode('login')}
          >
            <Text style={styles.forgotPasswordText}>Back to login</Text>
          </TouchableOpacity>
        </>
      )}

      {mode === 'reset' && (
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => setMode('login')}
        >
          <Text style={styles.forgotPasswordText}>Back to Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
      disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#888888',
      },
      otpInput: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 8,
        textAlign: 'center',
      },
      otpHint: {
        fontSize: 12,
        color: '#777777',
        textAlign: 'center',
        marginTop: 5,
      },
      forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
      },
      forgotPasswordText: {
        color: '#005e7a',
        fontSize: 14,
      },
      toggleContainer: {
        alignItems: 'center',
        marginVertical: 15,
      },
      toggleText: {
        color: '#005e7a',
        fontSize: 14,
        textDecorationLine: 'underline',
      },
      disabledText: {
        color: '#a0a0a0',
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
});
