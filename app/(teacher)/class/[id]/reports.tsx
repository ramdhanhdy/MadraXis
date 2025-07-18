import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassReportsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: `Class Reports (${id})` }} />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Reports for Class ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
