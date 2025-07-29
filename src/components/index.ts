/**
 * Main component barrel exports
 * 
 * This file provides a single entry point for importing all components
 * following the atomic design methodology: Atoms → Molecules → Organisms → Templates
 */

// Standalone components
export { LogoIcon } from './LogoIcon';

// Re-export from atomic design layers
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';

// MIGRATION COMPATIBILITY: Re-export from new UI structure
// This allows both old and new import paths to work during migration
export * from '../ui';