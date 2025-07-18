import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IncidentReportPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: 'Incident Report' }} />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Incident Report Page</Text>
      </View>
    </SafeAreaView>
  );
}
