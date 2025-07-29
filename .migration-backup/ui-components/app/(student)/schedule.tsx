import React from 'react';
import { Stack } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScheduleScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Jadwal Kegiatan" 
      }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Halaman Jadwal Kegiatan akan segera tersedia</Text>
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