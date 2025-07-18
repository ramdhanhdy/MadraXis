import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AntiBullyingPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: 'Anti-Bullying' }} />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Anti-Bullying Page</Text>
      </View>
    </SafeAreaView>
  );
}
