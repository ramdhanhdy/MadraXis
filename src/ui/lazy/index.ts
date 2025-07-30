/**
 * Lazy-loaded UI Components
 * 
 * This module provides lazy-loaded versions of heavy UI components
 * to improve app startup performance and reduce initial bundle size.
 */

import { createLazyComponent, createMonitoredLazyComponent } from '@lib/utils/lazy-loading';

// Lazy-loaded Organisms (Heavy components)
export const LazyAddStudentsToClassModal = createMonitoredLazyComponent(
  // Handle modules that might not have a default export by mapping the named export.
  () => import('@ui/organisms/AddStudentsToClassModal')
    .then(module => ({ default: (module as any).AddStudentsToClassModal })),
  'AddStudentsToClassModal',
);

export const LazyModal = createMonitoredLazyComponent(
  () => import('@ui/organisms/Modal'),
  'Modal'
);

export const LazyNavigationPanel = createMonitoredLazyComponent(
  () => import('@ui/organisms/NavigationPanel'),
  'NavigationPanel'
);

export const LazyHeader = createMonitoredLazyComponent(
  () => import('@ui/organisms/Header'),
  'Header'
);

export const LazyTabBar = createMonitoredLazyComponent(
  () => import('@ui/organisms/TabBar'),
  'TabBar'
);

export const LazyDashboardContent = createMonitoredLazyComponent(
  () => import('@ui/organisms/DashboardContent'),
  'DashboardContent'
);

// Lazy-loaded Templates (Very heavy components)
export const LazyDashboardTemplate = createMonitoredLazyComponent(
  () => import('@ui/templates/DashboardTemplate'),
  'DashboardTemplate'
);

export const LazyFormTemplate = createMonitoredLazyComponent(
  () => import('@ui/templates/FormTemplate'),
  'FormTemplate'
);

export const LazyModalTemplate = createMonitoredLazyComponent(
  () => import('@ui/templates/ModalTemplate'),
  'ModalTemplate'
);

// Lazy-loaded Complex Molecules
export const LazyStudentSelectionList = createMonitoredLazyComponent(
  () => import('@ui/molecules/StudentSelectionList'),
  'StudentSelectionList'
);

export const LazyBulkActionBar = createMonitoredLazyComponent(
  // Handle modules that might not have a default export by mapping the named export.
  () => import('../molecules/BulkActionBar')
    .then(module => ({ default: (module as any).BulkActionBar })),
  'BulkActionBar',
);

// Development-only lazy components (Storybook, debugging tools)
export const LazyStorybook = __DEV__ ? createLazyComponent(
  // Point to the local Storybook entry point which exports the UI as default.
  () => import('../../../.rnstorybook'),
) : null;

// Theme debugging tools (development only)
export const LazyThemeInspector = __DEV__ ? createLazyComponent(
  () => import('@design-system/debug/ThemeInspector').then(module => ({ default: module.ThemeInspector }))
) : null;

// Performance monitoring component
export const LazyPerformanceMonitor = __DEV__ ? createLazyComponent(
  () => import('./PerformanceMonitor').then(module => ({ default: module.PerformanceMonitor }))
) : null;

/**
 * Lazy loading configuration
 */
export const LAZY_LOADING_CONFIG = {
  // Components that should always be lazy-loaded
  alwaysLazy: [
    'AddStudentsToClassModal',
    'DashboardTemplate',
    'FormTemplate',
    'ModalTemplate',
    'StudentSelectionList'
  ],
  
  // Components that should be lazy-loaded only on slower devices
  conditionallyLazy: [
    'NavigationPanel',
    'Header',
    'TabBar'
  ],
  
  // Development-only components
  devOnly: [
    'ThemeInspector',
    'PerformanceMonitor',
    'Storybook'
  ]
};

/**
 * Utility to get lazy component based on performance conditions
 */
export function getLazyComponent(componentName: string, fallback: any) {
  // In a real implementation, you might check device performance here
  const shouldLazyLoad = LAZY_LOADING_CONFIG.alwaysLazy.includes(componentName);
  
  if (shouldLazyLoad) {
    switch (componentName) {
      case 'AddStudentsToClassModal':
        return LazyAddStudentsToClassModal;
      case 'DashboardTemplate':
        return LazyDashboardTemplate;
      case 'FormTemplate':
        return LazyFormTemplate;
      case 'ModalTemplate':
        return LazyModalTemplate;
      case 'StudentSelectionList':
        return LazyStudentSelectionList;
      default:
        return fallback;
    }
  }
  
  return fallback;
}
