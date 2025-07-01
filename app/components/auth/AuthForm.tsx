import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';

interface AuthFormProps {
  role?: string | null;
  isManagementScreen?: boolean;
}

export default function AuthForm({ role, isManagementScreen = false }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

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
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
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

      {mode === 'login' ? (
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
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

      {mode === 'login' ? (
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => setMode('reset')}
        >
          <Text style={styles.forgotPasswordText}>Forgot password? Set/Reset Password</Text>
        </TouchableOpacity>
      ) : (
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
});
