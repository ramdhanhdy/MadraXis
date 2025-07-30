/**
 * Student Dashboard Feature Barrel Export
 */

// Main screen component
export { default as StudentDashboardScreen } from './screen';

// Types and models
export type {
  StudentDashboardState,
  StudentProgress,
  UpcomingSchedule,
  QuickActionItem,
} from './model';

export {
  DASHBOARD_TABS,
  MOCK_STUDENT_PROGRESS,
  MOCK_UPCOMING_SCHEDULE,
  calculateProgressPercentage,
  formatScheduleTime,
  getGreetingMessage,
  initialStudentDashboardState,
  FEATURE_MESSAGES,
} from './model';
