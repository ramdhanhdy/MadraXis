/**
 * Services - Legacy service exports
 * 
 * This file provides backward compatibility for existing service imports
 * while gradually migrating to the new domain-based architecture.
 */

// Export all existing services
export * from './classService';
export * from './users';
export * from './incidents';
export * from './dashboard';
export * from './schools';
export * from './subjectService';

// MIGRATION COMPATIBILITY: Re-export from new domains structure
// This allows both old and new import paths to work during migration
export * from '../domains';
