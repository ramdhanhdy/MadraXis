/**
 * Parent Dashboard Feature Barrel Export
 */

// Main screen component
export { default as ParentDashboardScreen } from './screen';

// Types and models
export type {
  ParentDashboardState,
  ActivityItem,
  EventItem,
  StudentData,
} from './model';

export {
  PARENT_DASHBOARD_TABS,
  MOCK_STUDENT_DATA,
  MOCK_ACTIVITIES,
  MOCK_EVENTS,
  getActivityIcon,
  formatActivityDisplay,
  getGreetingMessage,
  initialParentDashboardState,
  FEATURE_MESSAGES,
} from './model';
