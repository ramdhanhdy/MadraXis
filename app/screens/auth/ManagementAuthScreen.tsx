import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { supabase } from '../../../src/utils/supabase';

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

export default function ManagementAuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      email: email,
      password: password,
    });

    if (error) {
      setErrorMessage(error.message);
    }
    // On success, the AuthProvider will handle navigation.
    setIsLoading(false);
  }

  async function handleRegister() {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { role: 'management' }, // Hardcode role for management sign-up
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      Alert.alert('Success!', 'Please check your email for a confirmation link to complete your registration.');
    }
    setIsLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      setErrorMessage('Please enter your email address to reset your password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setErrorMessage(error.message);
    } else {
      Alert.alert('Success!', 'Password reset link has been sent to your email.');
    }
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgXml xml={logoSvg} width={100} height={100} />
        <Text style={styles.appName}>Pondok Pesantren Tahfidz ZAID BIN TSAABIT</Text>
        <Text style={styles.title}>Management Portal</Text>
      </View>

      {/* Combined Login/Register Form */}
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password Anda"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={styles.forgotPasswordContainer} 
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.loginButtonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.registerButton, {marginTop: 15}, isLoading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.registerButtonText}>Daftar Akun Baru</Text>}
        </TouchableOpacity>
      </View>
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
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005e7a',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
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
});
