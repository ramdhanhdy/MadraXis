import React from 'react';
import { Stack } from 'expo-router';
import CCTVAccessRequest from '../screens/parent/CCTVAccessRequest';

export default function CCTVRequestScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Permintaan Akses CCTV" 
      }} />
      <CCTVAccessRequest />
    </>
  );
} 