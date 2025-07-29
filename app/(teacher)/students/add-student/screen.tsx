import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import AddStudent from '@ui/templates/AddStudentTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  FORM_STEPS,
  GENDER_OPTIONS,
  CLASS_OPTIONS,
  ADD_STUDENT_ERRORS,
  validateFormStep,
  validateCompleteForm,
  generateStudentNumber,
  calculateAge,
  formatPhoneNumber,
  isStepComplete,
  getCompletedStepsCount,
  getFormProgress,
  convertFormDataToStudent 
} from './model';

export default function AddStudentScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Tambah Siswa" 
      }} />
      <AddStudent />
    </>
  );
}
