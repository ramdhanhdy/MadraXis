/**
 * Shared Test Utilities - Render with Providers
 * 
 * This module provides a comprehensive test rendering utility that wraps
 * components with all necessary providers for consistent testing across
 * the application.
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../../context/ThemeContext';
import { NavigationHistoryProvider } from '../../context/NavigationHistoryContext';
import { UserRole } from '../constants/roleCapabilities';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Custom render options extending React Testing Library's RenderOptions
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial route for navigation testing
   */
  initialRoute?: string;
  
  /**
   * User role for theme and permission testing
   */
  userRole?: UserRole;
  
  /**
   * Theme mode for testing light/dark themes
   */
  themeMode?: 'light' | 'dark';
  
  /**
   * Whether to include navigation container
   */
  includeNavigation?: boolean;
  
  /**
   * Whether to include theme provider
   */
  includeTheme?: boolean;
  
  /**
   * Whether to include navigation history provider
   */
  includeNavigationHistory?: boolean;
  
  /**
   * Custom wrapper component to add additional providers
   */
  customWrapper?: React.ComponentType<{ children: ReactNode }>;
  
  /**
   * Mock navigation state for testing
   */
  navigationState?: any;
}

/**
 * Mock theme for testing
 */
const mockTheme = {
  colors: {
    primary: {
      main: '#007bff',
      light: '#66b3ff',
      dark: '#0056b3',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#6c757d',
      light: '#adb5bd',
      dark: '#495057',
      contrast: '#ffffff'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef'
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      elevated: '#ffffff'
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#adb5bd',
      inverse: '#ffffff'
    },
    border: {
      primary: '#dee2e6',
      secondary: '#e9ecef',
      focus: '#007bff'
    },
    status: {
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8'
    }
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: 'bold', lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: 'bold', lineHeight: 28 },
    h5: { fontSize: 18, fontWeight: 'bold', lineHeight: 24 },
    h6: { fontSize: 16, fontWeight: 'bold', lineHeight: 22 },
    body1: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: 'normal', lineHeight: 16 },
    button: { fontSize: 14, fontWeight: 'medium', lineHeight: 20 }
  },
  spacing: {
    base: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
    component: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
    layout: { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },
  shadows: {
    none: { elevation: 0 },
    sm: { elevation: 2 },
    md: { elevation: 4 },
    lg: { elevation: 8 },
    xl: { elevation: 12 }
  }
};

// ============================================================================
// MOCK PROVIDERS
// ============================================================================

/**
 * Mock Theme Provider for testing
 */
const MockThemeProvider: React.FC<{ 
  children: ReactNode; 
  userRole?: UserRole;
  themeMode?: 'light' | 'dark';
}> = ({ children, userRole, themeMode = 'light' }) => {
  const contextValue = {
    theme: mockTheme,
    currentRole: userRole || null,
    setRole: jest.fn(),
    colorScheme: themeMode,
    setColorScheme: jest.fn(),
    strategy: 'shared' as const
  };

  return (
    <ThemeProvider value={contextValue}>
      {children}
    </ThemeProvider>
  );
};

/**
 * Mock Navigation Container for testing
 */
const MockNavigationContainer: React.FC<{ 
  children: ReactNode;
  initialRoute?: string;
  navigationState?: any;
}> = ({ children, initialRoute, navigationState }) => {
  return (
    <NavigationContainer
      initialState={navigationState}
      documentTitle={{
        formatter: (options, route) => `${options?.title ?? route?.name ?? 'MadraXis'}`
      }}
    >
      {children}
    </NavigationContainer>
  );
};

/**
 * Mock Navigation History Provider for testing
 */
const MockNavigationHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = {
    history: [],
    currentIndex: -1,
    canGoBack: false,
    canGoForward: false,
    addToHistory: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    clearHistory: jest.fn(),
    getBreadcrumbItems: jest.fn(() => []),
    navigateToHistoryItem: jest.fn()
  };

  return (
    <NavigationHistoryProvider value={contextValue}>
      {children}
    </NavigationHistoryProvider>
  );
};

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

/**
 * Custom render function that wraps components with necessary providers
 * 
 * @param ui - The component to render
 * @param options - Custom render options
 * @returns Render result with additional utilities
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    initialRoute,
    userRole,
    themeMode = 'light',
    includeNavigation = true,
    includeTheme = true,
    includeNavigationHistory = true,
    customWrapper,
    navigationState,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Build wrapper component with requested providers
  const AllTheProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
    let wrappedChildren = children;

    // Apply custom wrapper first (innermost)
    if (customWrapper) {
      const CustomWrapper = customWrapper;
      wrappedChildren = <CustomWrapper>{wrappedChildren}</CustomWrapper>;
    }

    // Apply theme provider
    if (includeTheme) {
      wrappedChildren = (
        <MockThemeProvider userRole={userRole} themeMode={themeMode}>
          {wrappedChildren}
        </MockThemeProvider>
      );
    }

    // Apply navigation history provider
    if (includeNavigationHistory) {
      wrappedChildren = (
        <MockNavigationHistoryProvider>
          {wrappedChildren}
        </MockNavigationHistoryProvider>
      );
    }

    // Apply navigation container (outermost)
    if (includeNavigation) {
      wrappedChildren = (
        <MockNavigationContainer 
          initialRoute={initialRoute}
          navigationState={navigationState}
        >
          {wrappedChildren}
        </MockNavigationContainer>
      );
    }

    return <>{wrappedChildren}</>;
  };

  const renderResult = render(ui, { wrapper: AllTheProviders, ...renderOptions });

  return {
    ...renderResult,
    // Additional utilities for testing
    mockTheme,
    rerender: (newUi: ReactElement) => 
      renderResult.rerender(<AllTheProviders>{newUi}</AllTheProviders>)
  };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Render component with only theme provider
 */
export function renderWithTheme(
  ui: ReactElement,
  options: Pick<CustomRenderOptions, 'userRole' | 'themeMode'> = {}
) {
  return renderWithProviders(ui, {
    ...options,
    includeNavigation: false,
    includeNavigationHistory: false
  });
}

/**
 * Render component with only navigation providers
 */
export function renderWithNavigation(
  ui: ReactElement,
  options: Pick<CustomRenderOptions, 'initialRoute' | 'navigationState'> = {}
) {
  return renderWithProviders(ui, {
    ...options,
    includeTheme: false
  });
}

/**
 * Render component without any providers (minimal setup)
 */
export function renderMinimal(ui: ReactElement, options: RenderOptions = {}) {
  return render(ui, options);
}

// Re-export everything from React Testing Library for convenience
export * from '@testing-library/react-native';
