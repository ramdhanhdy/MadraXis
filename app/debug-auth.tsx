import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function DebugAuthScreen() {
  const { user, session, profile, loading, clearSession, signOut } = useAuth();
  const router = useRouter();

  const handleClearSession = async () => {
    Alert.alert(
      'Clear Session',
      'This will clear all authentication data and redirect to login. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await clearSession();
          }
        }
      ]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    // Navigation handled by onAuthStateChange listener
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Authentication Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Loading:</Text>
        <Text style={styles.value}>{loading ? 'Yes' : 'No'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>{user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'None'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{profile?.role || 'None'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>School ID:</Text>
        <Text style={styles.value}>{profile?.school_id || 'None'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Session:</Text>
        <Text style={styles.value}>{session ? 'EXISTS' : 'NONE'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleClearSession}>
          <Text style={styles.buttonText}>🚨 Clear Session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>🔓 Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}
          <Text style={styles.buttonText}>🔄 Go to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 