import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuranProgressPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: 'Quran Progress' }} />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Quran Progress Page</Text>
      </View>
    </SafeAreaView>
  );
}
