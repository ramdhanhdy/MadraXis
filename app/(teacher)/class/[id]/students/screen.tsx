import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import ClassStudents from '@ui/templates/ClassStudentsTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  STUDENT_STATUS_LABELS,
  GENDER_LABELS,
  ASSIGNMENT_TYPE_LABELS,
  GRADE_SCALE,
  STUDENTS_ERRORS,
  calculateAge,
  calculateGrade,
  getGradeLabel,
  formatStudentStatus,
  formatGender,
  formatAssignmentType,
  getStatusColor,
  searchStudents,
  filterStudentsByStatus,
  sortStudents,
  calculateOverallScore 
} from './model';

export default function ClassStudentsScreen() {
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
