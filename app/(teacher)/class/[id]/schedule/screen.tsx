import React from 'react';
import { Stack } from 'expo-router';

// UI Template
import ClassSchedule from '@ui/templates/ClassScheduleTemplate';

// Feature Model (imported for future use when template is enhanced)
import { 
  DAY_LABELS,
  SCHEDULE_TYPE_LABELS,
  SEMESTER_LABELS,
  STATUS_LABELS,
  DEFAULT_TIME_SLOTS,
  SCHEDULE_COLORS,
  SCHEDULE_ERRORS,
  parseTime,
  formatTime,
  formatTimeRange,
  getDayLabel,
  getScheduleTypeLabel,
  getSemesterLabel,
  getStatusLabel,
  getScheduleForDay,
  checkTimeConflict,
  generateScheduleColor 
} from './model';

export default function ClassScheduleScreen() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        title: "Jadwal Kelas"
      }} />
      <ClassSchedule />
    </>
  );
}
