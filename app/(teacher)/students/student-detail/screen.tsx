import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import StudentDetail from '@ui/templates/StudentDetailTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  ATTENDANCE_STATUS_LABELS,
  NOTE_TYPE_LABELS,
  TAB_LABELS,
  TREND_LABELS,
  STUDENT_DETAIL_ERRORS,
  formatAttendanceStatus,
  formatNoteType,
  formatTrend,
  getAttendanceStatusColor,
  getTrendColor,
  getNoteTypeColor,
  calculateAttendanceRate,
  getAttendanceStatistics,
  analyzeProgress,
  filterNotesByType,
  sortNotesByDate,
  getRecentBehaviorTrend 
} from './model';

export default function StudentDetailScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false,
        title: "Detail Siswa" 
      }} />
      <StudentDetail />
    </>
  );
}
