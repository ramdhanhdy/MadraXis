/**
 * Teacher Dashboard Feature Barrel Export
 * 
 * This file provides a clean interface for importing teacher dashboard feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as TeacherDashboardScreen } from './screen';

// Types and models
export type {
  IoniconsIcon,
  ActivityItem,
  TeacherScheduleItem,
  TeacherData,
  QuickActionItem,
  HeaderAction,
  TabItem,
  TeacherDashboardState,
  ActivityItemSchema,
  TeacherScheduleSchema,
  TeacherDataSchema,
} from './model';

export {
  activityItemSchema,
  teacherScheduleSchema,
  teacherDataSchema,
  DASHBOARD_TABS,
  TAB_LABELS,
  QUICK_ACTION_TYPES,
  validateActivity,
  validateTeacherSchedule,
  formatTimeAgo,
  formatIndonesianDate,
  getGreetingMessage,
  sortActivitiesByTime,
  initialTeacherDashboardState,
  mockActivities,
  mockUpcomingSchedule,
  DASHBOARD_ERRORS,
} from './model';
