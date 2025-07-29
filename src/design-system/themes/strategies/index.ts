/**
 * Theme Strategies
 * Pre-configured theme strategies for different use cases
 */

import { ThemeStrategy, ThemeConfig } from '../../core/types';
import { UserRole } from '../../tokens/colors';
import { createTheme } from '../../core/theme-builder';
import { sharedThemeStrategy } from '../shared/default';
import { roleThemes } from '../roles';

/**
 * Role-based theme strategy
 */
export const roleBasedThemeStrategy: ThemeStrategy = {
  name: 'Role-Based Theme Strategy',
  description: 'Different themes for each user role with role-specific branding',
  type: 'role-based',
  themes: {
    roles: {
      student: roleThemes.student.light,
      teacher: roleThemes.teacher.light,
      parent: roleThemes.parent.light,
      management: roleThemes.management.light,
    },
  },
  resolver: (config: ThemeConfig, role?: UserRole) => {
    if (!role) {
      // Return default theme if no role specified
      return createTheme(config);
    }
    
    const colorScheme = config.baseTheme || 'light';
    const roleTheme = roleThemes[role][colorScheme];
    
    if (config.customizations) {
      return createTheme({
        ...config,
        roleOverrides: roleTheme,
      }, role);
    }
    
    return roleTheme;
  },
};

/**
 * Dark mode role-based theme strategy
 */
export const darkRoleBasedThemeStrategy: ThemeStrategy = {
  name: 'Dark Role-Based Theme Strategy',
  description: 'Dark mode themes for each user role',
  type: 'role-based',
  themes: {
    roles: {
      student: roleThemes.student.dark,
      teacher: roleThemes.teacher.dark,
      parent: roleThemes.parent.dark,
      management: roleThemes.management.dark,
    },
  },
  resolver: (config: ThemeConfig, role?: UserRole) => {
    if (!role) {
      return createTheme({ ...config, baseTheme: 'dark' });
    }
    
    const roleTheme = roleThemes[role].dark;
    
    if (config.customizations) {
      return createTheme({
        ...config,
        baseTheme: 'dark',
        roleOverrides: roleTheme,
      }, role);
    }
    
    return roleTheme;
  },
};

/**
 * Adaptive theme strategy - switches between shared and role-based
 */
export const adaptiveThemeStrategy: ThemeStrategy = {
  name: 'Adaptive Theme Strategy',
  description: 'Automatically switches between shared and role-based themes based on context',
  type: 'role-based', // Default to role-based
  themes: {
    shared: sharedThemeStrategy.themes.shared,
    roles: roleBasedThemeStrategy.themes.roles,
  },
  resolver: (config: ThemeConfig, role?: UserRole) => {
    // Use shared theme if no role or if explicitly configured
    if (!role || config.strategy === 'shared') {
      return sharedThemeStrategy.resolver(config);
    }
    
    // Use role-based theme
    return roleBasedThemeStrategy.resolver(config, role);
  },
};

/**
 * High contrast theme strategy for accessibility
 */
export const highContrastThemeStrategy: ThemeStrategy = {
  name: 'High Contrast Theme Strategy',
  description: 'High contrast themes for improved accessibility',
  type: 'shared',
  themes: {
    shared: createTheme({
      strategy: 'shared',
      baseTheme: 'light',
      customizations: {
        colors: {
          background: { primary: '#FFFFFF', secondary: '#FFFFFF', tertiary: '#F5F5F5' },
          text: { primary: '#000000', secondary: '#000000', tertiary: '#333333' },
          border: { primary: '#000000', secondary: '#000000', focus: '#0000FF' },
          primary: { main: '#0000FF', light: '#3333FF', dark: '#0000CC', contrast: '#FFFFFF' },
        },
        accessibility: {
          contrast: { aa: { normal: 7, large: 4.5 }, aaa: { normal: 10, large: 7 } },
          focusRing: { width: 3, offset: 2, color: '#0000FF' },
        },
      },
    }),
  },
  resolver: (config: ThemeConfig) => {
    return createTheme({
      ...config,
      customizations: {
        ...config.customizations,
        // Force high contrast settings
        colors: {
          background: { primary: '#FFFFFF', secondary: '#FFFFFF', tertiary: '#F5F5F5' },
          text: { primary: '#000000', secondary: '#000000', tertiary: '#333333' },
          border: { primary: '#000000', secondary: '#000000', focus: '#0000FF' },
        },
      },
    });
  },
};

/**
 * Reduced motion theme strategy
 */
export const reducedMotionThemeStrategy: ThemeStrategy = {
  name: 'Reduced Motion Theme Strategy',
  description: 'Themes with reduced animations for accessibility',
  type: 'shared',
  themes: {
    shared: createTheme({
      strategy: 'shared',
      baseTheme: 'light',
      customizations: {
        animations: {
          duration: { instant: 0, fast: 0, normal: 0, slow: 0 },
          reducedMotion: {
            duration: 0,
            easing: 'linear',
            transitions: {
              fade: { opacity: [0, 1], duration: 0 },
              slide: { opacity: [0, 1], duration: 0 },
              scale: { opacity: [0, 1], duration: 0 },
            },
          },
        },
      },
    }),
  },
  resolver: (config: ThemeConfig, role?: UserRole) => {
    const baseStrategy = role ? roleBasedThemeStrategy : sharedThemeStrategy;
    const baseTheme = baseStrategy.resolver(config, role);
    
    return createTheme({
      ...config,
      customizations: {
        ...config.customizations,
        animations: {
          duration: { instant: 0, fast: 0, normal: 0, slow: 0 },
          reducedMotion: {
            duration: 0,
            easing: 'linear',
          },
        },
      },
    }, role);
  },
};

/**
 * All available theme strategies
 */
export const themeStrategies = {
  shared: sharedThemeStrategy,
  roleBased: roleBasedThemeStrategy,
  darkRoleBased: darkRoleBasedThemeStrategy,
  adaptive: adaptiveThemeStrategy,
  highContrast: highContrastThemeStrategy,
  reducedMotion: reducedMotionThemeStrategy,
} as const;

// Export individual strategies
export { sharedThemeStrategy };

/**
 * Get theme strategy by name
 */
export function getThemeStrategy(name: keyof typeof themeStrategies): ThemeStrategy {
  return themeStrategies[name];
}

/**
 * Create custom theme strategy
 */
export function createCustomThemeStrategy(
  name: string,
  description: string,
  type: 'shared' | 'role-based',
  resolver: ThemeStrategy['resolver']
): ThemeStrategy {
  return {
    name,
    description,
    type,
    themes: type === 'shared' 
      ? { shared: sharedThemeStrategy.themes.shared }
      : { roles: roleBasedThemeStrategy.themes.roles },
    resolver,
  };
}

/**
 * Default theme strategy (role-based)
 */
export const defaultThemeStrategy = roleBasedThemeStrategy;

export default themeStrategies;
