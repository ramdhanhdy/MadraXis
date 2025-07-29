import React from 'react';
import { Stack } from 'expo-router';
import AntiBullyingResources from '@ui/templates/AntiBullyingResourcesTemplate';

export default function AntiBullyingScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Sumber Daya Anti-Perundungan" 
      }} />
      <AntiBullyingResources />
    </>
  );
} 