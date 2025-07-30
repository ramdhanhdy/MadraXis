/**
 * Enhanced ThemeProvider with Strategy Pattern
 * Performance-optimized theme provider with role-based theme switching
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode
} from 'react';
import { Theme, ThemeStrategy, ThemeContextType } from '../../core/types';
import { UserRole } from '../../tokens/colors';
import { validateTheme } from '../../core/utils';
import { fallbackTheme } from '../shared/default';
import { roleThemes } from '../roles';
import { EnhancedThemeContext } from '../context';

// EnhancedThemeContext is now imported from ../context.ts

/**
 * Theme Provider Props
 */
interface EnhancedThemeProviderProps {
  children: ReactNode;
  strategy: ThemeStrategy;
  initialRole?: UserRole | null;
  initialColorScheme?: 'light' | 'dark';
  enablePerformanceOptimizations?: boolean;
  enableThemeValidation?: boolean;
  onThemeChange?: (theme: Theme, role: UserRole | null) => void;
  onThemeError?: (error: Error, fallbackUsed: boolean) => void;
}

/**
 * Enhanced ThemeProvider Component
 */
export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  strategy,
  initialRole = null,
  initialColorScheme = 'light',
  enablePerformanceOptimizations = true,
  enableThemeValidation = __DEV__,
  onThemeChange,
  onThemeError,
}) => {
  // State management
  const [currentRole, setCurrentRole] = useState<UserRole | null>(initialRole);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(initialColorScheme);
  const [themeStrategy, setThemeStrategy] = useState<ThemeStrategy>(strategy);
  const [isLoading, setIsLoading] = useState(false);
  const [themeError, setThemeError] = useState<Error | null>(null);

  /**
   * Memoized theme resolution with error handling
   */
  const activeTheme = useMemo(() => {
    try {
      setIsLoading(true);
      setThemeError(null);

      let resolvedTheme: Theme;

      if (themeStrategy.type === 'shared') {
        // Use shared theme
        resolvedTheme = themeStrategy.themes.shared || fallbackTheme;
      } else if (themeStrategy.type === 'role-based' && currentRole) {
        // Use role-specific theme
        const roleTheme = themeStrategy.themes.roles?.[currentRole];
        if (roleTheme) {
          resolvedTheme = roleTheme;
        } else {
          // Fallback to role themes collection
          resolvedTheme = roleThemes[currentRole][colorScheme];
        }
      } else {
        // Fallback to shared theme or default
        resolvedTheme = themeStrategy.themes.shared || fallbackTheme;
      }

      // Theme validation in development
      if (enableThemeValidation) {
        const validation = validateTheme(resolvedTheme);
        if (!validation.isValid) {
          const error = new Error(`Theme validation failed: ${validation.errors.join(', ')}`);
          setThemeError(error);
          onThemeError?.(error, true);
          return fallbackTheme;
        }
        
        if (validation.warnings.length > 0) {
          console.warn('Theme validation warnings:', validation.warnings);
        }
      }

      setIsLoading(false);
      return resolvedTheme;
    } catch (error) {
      const themeError = error instanceof Error ? error : new Error('Unknown theme error');
      setThemeError(themeError);
      setIsLoading(false);
      onThemeError?.(themeError, true);
      return fallbackTheme;
    }
  }, [
    themeStrategy, 
    currentRole, 
    colorScheme, 
    enableThemeValidation, 
    onThemeError
  ]);

  /**
   * Performance-optimized role setter
   */
  const setRole = useCallback((role: UserRole | null) => {
    if (role !== currentRole) {
      setCurrentRole(role);
    }
  }, [currentRole]);

  /**
   * Performance-optimized color scheme setter
   */
  const setColorSchemeOptimized = useCallback((scheme: 'light' | 'dark') => {
    if (scheme !== colorScheme) {
      setColorScheme(scheme);
    }
  }, [colorScheme]);

  /**
   * Strategy setter with validation
   */
  const setStrategy = useCallback((newStrategy: ThemeStrategy) => {
    try {
      // Validate strategy has required themes
      if (newStrategy.type === 'shared' && !newStrategy.themes.shared) {
        throw new Error('Shared strategy must have a shared theme');
      }
      if (newStrategy.type === 'role-based' && !newStrategy.themes.roles) {
        throw new Error('Role-based strategy must have role themes');
      }
      
      setThemeStrategy(newStrategy);
    } catch (error) {
      const strategyError = error instanceof Error ? error : new Error('Strategy validation failed');
      setThemeError(strategyError);
      onThemeError?.(strategyError, false);
    }
  }, [onThemeError]);

  /**
   * Theme change notification
   */
  useEffect(() => {
    if (onThemeChange && !isLoading && !themeError) {
      onThemeChange(activeTheme, currentRole);
    }
  }, [activeTheme, currentRole, onThemeChange, isLoading, themeError]);

  /**
   * Performance optimization: Memoize context value
   */
  const contextValue = useMemo<ThemeContextType>(() => ({
    theme: activeTheme,
    currentRole,
    setRole,
    colorScheme,
    setColorScheme: setColorSchemeOptimized,
    strategy: themeStrategy,
    setStrategy,
    isLoading,
    error: themeError,
  }), [
    activeTheme,
    currentRole,
    setRole,
    colorScheme,
    setColorSchemeOptimized,
    themeStrategy,
    setStrategy,
    isLoading,
    themeError,
  ]);

  return (
    <EnhancedThemeContext.Provider value={contextValue}>
      {children}
    </EnhancedThemeContext.Provider>
  );
};

// useEnhancedTheme hook is now in ../hooks.ts

/**
 * Theme debugging hook
 */
export const useThemeDebugger = () => {
  const { theme, currentRole, strategy } = useEnhancedTheme();
  
  return {
    logTheme: () => {
      console.group('🎨 Theme Debug Information');
      console.log('Current Role:', currentRole);
      console.log('Strategy:', strategy.type);
      console.log('Theme Colors:', theme.colors);
      console.log('Component Themes:', theme.componentThemes);
      console.groupEnd();
    },
    
    validateCurrentTheme: () => {
      return validateTheme(theme);
    },
    
    exportTheme: () => {
      return JSON.stringify({
        role: currentRole,
        strategy: strategy.type,
        theme: {
          colors: theme.colors,
          componentThemes: theme.componentThemes,
        },
      }, null, 2);
    },
    
    getThemeMetadata: () => ({
      role: currentRole,
      strategyType: strategy.type,
      strategyName: strategy.name,
      hasErrors: !!theme.error,
      isLoading: !!theme.isLoading,
    }),
  };
};

/**
 * Performance monitoring hook
 */
export const useThemePerformance = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number>(0);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastRenderTime(Date.now());
  });
  
  return {
    renderCount,
    lastRenderTime,
    resetCounters: () => {
      setRenderCount(0);
      setLastRenderTime(0);
    },
  };
};

/**
 * Backward compatibility with existing ThemeProvider
 */
export const ThemeProvider = EnhancedThemeProvider;

export default EnhancedThemeProvider;
