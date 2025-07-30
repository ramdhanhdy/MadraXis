import React from 'react';
import { Stack } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BoardingInfoScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Informasi Asrama" 
      }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Halaman Informasi Asrama akan segera tersedia</Text>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    padding: 20,
  }
}); 