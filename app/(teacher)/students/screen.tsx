import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import StudentsList from '@ui/templates/StudentsListTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  STUDENT_STATUS_LABELS,
  GENDER_LABELS,
  SCORE_TYPE_LABELS,
  BEHAVIOR_TYPE_LABELS,
  BEHAVIOR_CATEGORY_LABELS,
  GRADE_SCALE,
  STUDENTS_ERRORS,
  calculateAge,
  calculateGrade,
  getGradeLabel,
  formatStudentStatus,
  formatGender,
  formatScoreType,
  formatBehaviorType,
  formatBehaviorCategory,
  getStatusColor,
  getBehaviorTypeColor,
  searchStudents,
  filterStudentsByStatus,
  filterStudentsByClass,
  sortStudents,
  calculateOverallGrade,
  calculateBehaviorScore 
} from './model';

export default function StudentsListScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Daftar Siswa" 
      }} />
      <StudentsList />
    </>
  );
}
