/**
 * Parent Incident Report Route - Backward Compatibility Wrapper
 *
 * This file maintains backward compatibility with the existing route structure
 * while delegating to the new feature slice implementation.
 */

// Re-export the screen from the feature slice
export { default } from './incident-report/screen';