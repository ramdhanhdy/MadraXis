/**
 * Quran Progress Feature Barrel Export
 * 
 * This file provides a clean interface for importing Quran progress feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as QuranProgressScreen } from './screen';

// Types and models
export type {
  QuranProgressData,
  QuranProgressState,
  QuranProgressSchema,
} from './model';

export {
  quranProgressSchema,
  PROGRESS_STATUS,
  STATUS_DISPLAY_NAMES,
  COMMON_SURAHS,
  validateProgressData,
  formatProgressStatus,
  calculateProgressPercentage,
  getProgressByStatus,
  initialQuranProgressState,
  PROGRESS_ERRORS,
  mockProgressData,
} from './model';
