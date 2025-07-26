/**
 * StudentSelectionList Module Exports
 * 
 * Barrel exports for the StudentSelectionList component and its sub-components.
 * Provides a clean interface for importing the student selection functionality.
 */

export { StudentSelectionList } from './StudentSelectionList';
export { StudentSelectionItem } from './StudentSelectionItem';

export type {
  StudentSelectionListProps,
  StudentFilters,
} from './StudentSelectionList';

export type {
  StudentSelectionItemProps,
} from './StudentSelectionItem';

// Default export
export { StudentSelectionList as default } from './StudentSelectionList';