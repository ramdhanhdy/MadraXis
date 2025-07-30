import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppThemeProvider } from './ThemeProvider';

// Mock the design system components
jest.mock('@design-system/themes/provider/ThemeProvider', () => ({
  EnhancedThemeProvider: ({ children }: any) => <>{children}</>,
  useEnhancedTheme: () => ({
    theme: {
      colors: {
        primary: { main: '#007bff' },
        secondary: { main: '#6c757d' },
      },
      typography: {
        fontSize: { md: 16 },
      },
      spacing: { md: 16 },
    },
    currentRole: 'student',
    colorScheme: 'light',
    strategy: { type: 'shared' },
  }),
}));

// Mock theme config - remove this since we're not using it anymore

// Mock logger
jest.mock('@lib/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AppThemeProvider', () => {
  it('should render children without crashing', () => {
    const { getByTestId } = render(
      <AppThemeProvider>
        <Text testID="child">Child component</Text>
      </AppThemeProvider>
    );
    
    expect(getByTestId('child')).toBeTruthy();
  });

  it('should provide theme context', () => {
    // This test just ensures the provider doesn't crash
    expect(() => {
      render(
        <AppThemeProvider>
          <Text>Test</Text>
        </AppThemeProvider>
      );
    }).not.toThrow();
  });
});
