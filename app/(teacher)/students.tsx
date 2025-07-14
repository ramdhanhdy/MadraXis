import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StudentsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Students',
        headerShown: true 
      }} />
      
      <View style={styles.content}>
        <Ionicons name="people" size={64} color="#005e7a" style={styles.icon} />
        <Text style={styles.title}>Students Management</Text>
        <Text style={styles.subtitle}>Student management features coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005e7a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});