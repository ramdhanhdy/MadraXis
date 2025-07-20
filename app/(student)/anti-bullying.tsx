import React from 'react';
import { Stack } from 'expo-router';
import AntiBullying from '../../src/components/templates/StudentAntiBullyingTemplate';

export default function AntiBullyingScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Edukasi Anti-Perundungan" 
      }} />
      <AntiBullying />
    </>
  );
} 