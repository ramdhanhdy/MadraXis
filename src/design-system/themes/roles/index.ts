/**
 * Role-Specific Themes Export
 * All role-based theme configurations and utilities
 */

// Student theme exports
export {
  lightStudentTheme,
  darkStudentTheme,
  studentThemeConfig,
  createStudentTheme,
  studentThemeMetadata,
  studentThemeCustomizations,
} from './student';

// Teacher theme exports
export {
  lightTeacherTheme,
  darkTeacherTheme,
  teacherThemeConfig,
  createTeacherTheme,
  teacherThemeMetadata,
  teacherThemeCustomizations,
} from './teacher';

// Parent theme exports
export {
  lightParentTheme,
  darkParentTheme,
  parentThemeConfig,
  createParentTheme,
  parentThemeMetadata,
  parentThemeCustomizations,
} from './parent';

// Management theme exports
export {
  lightManagementTheme,
  darkManagementTheme,
  managementThemeConfig,
  createManagementTheme,
  managementThemeMetadata,
  managementThemeCustomizations,
} from './management';

// Default theme exports by role
export { default as studentTheme } from './student';
export { default as teacherTheme } from './teacher';
export { default as parentTheme } from './parent';
export { default as managementTheme } from './management';

// Role theme collection
export const roleThemes = {
  student: {
    light: lightStudentTheme,
    dark: darkStudentTheme,
    metadata: studentThemeMetadata,
  },
  teacher: {
    light: lightTeacherTheme,
    dark: darkTeacherTheme,
    metadata: teacherThemeMetadata,
  },
  parent: {
    light: lightParentTheme,
    dark: darkParentTheme,
    metadata: parentThemeMetadata,
  },
  management: {
    light: lightManagementTheme,
    dark: darkManagementTheme,
    metadata: managementThemeMetadata,
  },
} as const;

// Role theme configurations
export const roleThemeConfigs = {
  student: studentThemeConfig,
  teacher: teacherThemeConfig,
  parent: parentThemeConfig,
  management: managementThemeConfig,
} as const;

// Role theme creators
export const roleThemeCreators = {
  student: createStudentTheme,
  teacher: createTeacherTheme,
  parent: createParentTheme,
  management: createManagementTheme,
} as const;
