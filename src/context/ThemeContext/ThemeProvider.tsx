/**
 * Enhanced ThemeProvider Integration
 * Integrates the design-system's enhanced ThemeProvider with the application context
 */

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { EnhancedThemeProvider as DesignSystemThemeProvider } from '../../design-system/themes/provider/ThemeProvider';
import { useEnhancedTheme } from '../../design-system/themes/hooks';
import { ThemeStrategy, Theme } from '../../design-system/core/types';
import { UserRole } from '../../design-system/tokens/colors';
import { sharedThemeStrategy, lightSharedTheme, darkSharedTheme } from '../../design-system/themes/shared/default';
import { logger } from '@lib/utils/logger';

// Simple theme config for now - will be enhanced later
const createSimpleThemeConfig = () => ({
  defaultStrategy: 'shared' as const,
  features: { roleBasedTheming: true },
  subscribe: (callback: (config: any) => void) => {
    // Simple implementation - no actual subscription for now
    return () => {};
  },
});

/**
 * Application Theme Provider Props
 */
interface AppThemeProviderProps {
  children: ReactNode;
  initialRole?: UserRole | null;
  initialColorScheme?: 'light' | 'dark';
  enablePerformanceOptimizations?: boolean;
  enableThemeValidation?: boolean;
}

/**
 * Get default theme strategy using design system
 * This creates a proper theme strategy that uses the design system's actual themes
 */
const getDefaultThemeStrategy = (): ThemeStrategy => {
  try {
    // Use the actual design system's shared theme strategy
    logger.debug('🎨 Loading design system shared theme strategy');
    return {
      ...sharedThemeStrategy,
      // Override with our app-specific configuration
      name: 'MadraXis Enhanced Theme',
      description: 'Enhanced shared theme using design system with MadraXis customizations',
      themes: {
        shared: lightSharedTheme, // Use actual design system theme
      },
      resolver: (config, role) => {
        // Enhanced resolver that uses actual design system themes
        const baseTheme = config?.baseTheme || 'light';
        const theme = baseTheme === 'dark' ? darkSharedTheme : lightSharedTheme;

        logger.debug('🎨 Resolving theme', { baseTheme, role });
        return theme;
      },
    };
  } catch (error) {
    logger.error('Failed to load design system themes, using fallback', { error });
    // Fallback to basic theme if design system fails
    return {
      type: 'shared',
      name: 'Fallback Theme',
      description: 'Fallback theme when design system is unavailable',
      themes: {
        shared: lightSharedTheme, // Still use design system theme as fallback
      },
      resolver: () => lightSharedTheme,
    };
  }
};

/**
 * Application Theme Provider
 * Wraps the design system's enhanced theme provider with app-specific configuration
 */
export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
  initialRole = null,
  initialColorScheme = 'light',
  enablePerformanceOptimizations = true,
  enableThemeValidation = __DEV__,
}) => {
  const [themeStrategy, setThemeStrategy] = useState<ThemeStrategy>(getDefaultThemeStrategy());

  // Handle theme changes
  const handleThemeChange = useCallback((theme: Theme, role: UserRole | null) => {
    if (__DEV__) {
      logger.debug('🎨 Theme changed', { role, strategy: themeStrategy.type });
    }
  }, [themeStrategy.type]);

  // Handle theme errors
  const handleThemeError = useCallback((error: Error, fallbackUsed: boolean) => {
    logger.error('🎨 Theme error occurred', {
      error: error.message,
      fallbackUsed,
      strategy: themeStrategy.type
    });
  }, [themeStrategy.type]);

  // Use the actual design system provider
  return (
    <DesignSystemThemeProvider
      strategy={themeStrategy}
      initialRole={initialRole}
      initialColorScheme={initialColorScheme}
      enablePerformanceOptimizations={enablePerformanceOptimizations}
      enableThemeValidation={enableThemeValidation}
      onThemeChange={handleThemeChange}
      onThemeError={handleThemeError}
    >
      {children}
    </DesignSystemThemeProvider>
  );
};

/**
 * Re-export the enhanced theme hook for convenience
 */
export const useTheme = useEnhancedTheme;

/**
 * Backward compatibility with existing ThemeProvider
 */
export const ThemeProvider = AppThemeProvider;

export default AppThemeProvider;
