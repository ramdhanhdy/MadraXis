/**
 * Boarding Info Feature Barrel Export
 * 
 * This file provides a clean interface for importing boarding info feature components,
 * types, and utilities from other parts of the application.
 */

// Main screen component
export { default as BoardingInfoScreen } from './screen';

// Types and models
export type {
  BoardingInfoData,
  BoardingInfoState,
  BoardingInfoSchema,
  EmergencyContact,
} from './model';

export {
  boardingInfoSchema,
  COMMON_FACILITIES,
  COMMON_RULES,
  DORMITORY_TYPES,
  validateBoardingInfo,
  formatPhoneNumber,
  calculateStayDuration,
  initialBoardingInfoState,
  BOARDING_ERRORS,
  mockBoardingInfo,
  mockEmergencyContacts,
} from './model';
