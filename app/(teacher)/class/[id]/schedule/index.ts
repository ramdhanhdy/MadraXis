/**
 * Class Schedule Feature Barrel Export
 * 
 * This file provides a clean interface for importing class schedule feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as ClassScheduleScreen } from './screen';

// Types and models
export type {
  ClassSchedule,
  ScheduleItem,
  ClassScheduleState,
  TimeSlot,
  ScheduleItemSchema,
  ClassScheduleSchema,
} from './model';

export {
  scheduleItemSchema,
  classScheduleSchema,
  DAYS_OF_WEEK,
  DAY_LABELS,
  SCHEDULE_TYPES,
  SCHEDULE_TYPE_LABELS,
  SEMESTER_LABELS,
  STATUS_LABELS,
  DEFAULT_TIME_SLOTS,
  SCHEDULE_COLORS,
  validateScheduleItem,
  parseTime,
  formatTime,
  formatTimeRange,
  getDayLabel,
  getScheduleTypeLabel,
  getSemesterLabel,
  getStatusLabel,
  getScheduleForDay,
  checkTimeConflict,
  generateScheduleColor,
  filterScheduleByType,
  initialClassScheduleState,
  SCHEDULE_ERRORS,
} from './model';
