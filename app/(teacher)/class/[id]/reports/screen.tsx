import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import ClassReports from '@ui/templates/ClassReportsTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  REPORT_TYPE_LABELS,
  SEMESTER_LABELS,
  REPORT_STATUS_LABELS,
  GRADE_SCALE,
  REPORTS_ERRORS,
  calculateGrade,
  getGradeLabel,
  calculateClassAverage,
  calculatePassRate,
  formatReportType,
  formatSemester,
  formatReportStatus 
} from './model';

export default function ClassReportsScreen() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Laporan Kelas"
      }} />
      <ClassReports />
    </>
  );
}
