import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/src/utils/supabase';

export default function OtpVerifyScreen() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();

  const handleVerifyOtp = async () => {
    if (!token || !email) {
      Alert.alert('Error', 'Email or token is missing.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      Alert.alert('Error', error.message);
      setIsLoading(false);
    } else {
      // On success, the AuthProvider will detect the SIGNED_IN event and navigate automatically.
      // We can add a small delay or just let the provider handle it.
      router.replace('/'); // Navigate to home, AuthProvider will redirect to correct dashboard.
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to {email}. Please enter it below.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="123456"
        value={token}
        onChangeText={setToken}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify & Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#005e7a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
