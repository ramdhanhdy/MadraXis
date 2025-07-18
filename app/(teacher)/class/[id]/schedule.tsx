import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassSchedulePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: `Class Schedule (${id})` }} />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Schedule for Class ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
