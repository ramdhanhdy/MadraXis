/**
 * Shared Utilities - Helper functions and utilities
 *
 * This module contains shared utility functions that can be used across
 * different domains and components. These are pure functions that provide
 * common functionality.
 */

// Utility functions barrel export
export * from './backgroundPattern';
export * from './date';
export * from './idConversion';
export * from './lazy-loading';
export * from './linking';
export * from './logger';
export * from './navigationGuard';
export * from './responsive';
export * from './retry';
export * from './sanitization';
export * from './supabase';
export * from './svgPatterns';
export * from './typeHelpers';

// Add combineStyles utility
export const combineStyles = <T extends object>(...styles: (T | T[] | undefined | null | false)[]): T[] => {
  return styles
    .filter(Boolean)
    .flat()
    .filter(Boolean) as T[];
};
