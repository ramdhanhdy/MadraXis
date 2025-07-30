import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import AntiBullying from '@ui/templates/StudentAntiBullyingTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  RESOURCE_TYPE_LABELS,
  INCIDENT_TYPE_LABELS,
  DIFFICULTY_LABELS,
  ANTI_BULLYING_ERRORS 
} from './model';

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
