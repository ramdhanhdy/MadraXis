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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  async function handleSendOtp() {
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // shouldCreateUser: true, // This is true by default
        emailRedirectTo: 'madraxis://otp',
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      Alert.alert('Check your email', 'A magic link has been sent to your email address.');
      router.push({ pathname: '/otp', params: { email: email } });
    }
    // We don't set isLoading to false here, as the user is navigating away.
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
          placeholder="Masukkan email Anda"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.disabledButton]} 
        onPress={handleSendOtp}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.loginButtonText}>Send Magic Link</Text>}
      </TouchableOpacity>
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
