// This file serves as a single entry point for all type definitions
// It re-exports all types from various files for easier imports

// Core types
export * from './index';
export * from './class';
export * from './dashboard';
export * from './database';

// Database-specific types are already exported via export * from './database' above

// Service-specific types
export type { School } from '../services/schools';
export type { DashboardMetrics } from '../services/dashboard';

// Utility types
export * from '../utils/typeHelpers';