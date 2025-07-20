import React from 'react';
import { Stack } from 'expo-router';
import ClassStudents from '../../../../../src/components/templates/ClassStudentsTemplate';

export default function ClassStudentsIndex() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Siswa Kelas"
      }} />
      <ClassStudents />
    </>
  );
}