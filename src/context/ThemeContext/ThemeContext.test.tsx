import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppThemeProvider } from './ThemeProvider';
import { 
  useTheme, 
  useColors, 
  useTypography, 
  useSpacing,
  useIsDarkMode,
  useCurrentRole,
  useHasThemeRole,
  useThemeStrategy,
  useStyleHelpers,
  useButtonStyles,
  useRoleColors
} from './useTheme';

// Mock the design system components
jest.mock('@design-system/themes/provider/ThemeProvider', () => ({
  EnhancedThemeProvider: ({ children, onThemeChange, onThemeError }: any) => {
    // Mock theme context value
    const mockThemeContext = {
      theme: {
        colors: {
          primary: { main: '#007bff', light: '#66b3ff', dark: '#0056b3' },
          secondary: { main: '#6c757d', light: '#adb5bd', dark: '#495057' },
          background: { primary: '#ffffff', secondary: '#f8f9fa' },
          text: { primary: '#212529', secondary: '#6c757d' },
        },
        typography: {
          fontFamily: { primary: 'System' },
          fontSize: { sm: 14, md: 16, lg: 18 },
          fontWeight: { normal: '400', bold: '700' },
        },
        spacing: { sm: 8, md: 16, lg: 24 },
        borderRadius: { sm: 4, md: 8, lg: 12 },
        shadows: { sm: '0 1px 2px rgba(0, 0, 0, 0.05)', md: '0 4px 6px rgba(0, 0, 0, 0.1)' },
        componentThemes: {
          button: {
            baseStyle: { borderRadius: 8, fontWeight: '500' },
            variants: {
              solid: { backgroundColor: '#007bff', color: '#ffffff' },
              outline: { backgroundColor: 'transparent', borderColor: '#007bff' },
            },
            sizes: {
              sm: { paddingHorizontal: 12, paddingVertical: 8 },
              md: { paddingHorizontal: 16, paddingVertical: 10 },
            },
          },
        },
      },
      currentRole: 'student',
      setRole: jest.fn(),
      colorScheme: 'light',
      setColorScheme: jest.fn(),
      strategy: {
        type: 'shared',
        name: 'Test Strategy',
        description: 'Test theme strategy',
      },
      setStrategy: jest.fn(),
      isLoading: false,
      error: null,
    };

    return (
      <div data-testid="mock-theme-provider">
        {React.Children.map(children, child =>
          React.cloneElement(child, { mockThemeContext })
        )}
      </div>
    );
  },
  useEnhancedTheme: () => ({
    theme: {
      colors: {
        primary: { main: '#007bff', light: '#66b3ff', dark: '#0056b3' },
        secondary: { main: '#6c757d', light: '#adb5bd', dark: '#495057' },
        background: { primary: '#ffffff', secondary: '#f8f9fa' },
        text: { primary: '#212529', secondary: '#6c757d' },
      },
      typography: {
        fontFamily: { primary: 'System' },
        fontSize: { sm: 14, md: 16, lg: 18 },
        fontWeight: { normal: '400', bold: '700' },
      },
      spacing: { sm: 8, md: 16, lg: 24 },
      borderRadius: { sm: 4, md: 8, lg: 12 },
      shadows: { sm: '0 1px 2px rgba(0, 0, 0, 0.05)', md: '0 4px 6px rgba(0, 0, 0, 0.1)' },
      componentThemes: {
        button: {
          baseStyle: { borderRadius: 8, fontWeight: '500' },
          variants: {
            solid: { backgroundColor: '#007bff', color: '#ffffff' },
            outline: { backgroundColor: 'transparent', borderColor: '#007bff' },
          },
          sizes: {
            sm: { paddingHorizontal: 12, paddingVertical: 8 },
            md: { paddingHorizontal: 16, paddingVertical: 10 },
          },
        },
      },
    },
    currentRole: 'student',
    setRole: jest.fn(),
    colorScheme: 'light',
    setColorScheme: jest.fn(),
    strategy: {
      type: 'shared',
      name: 'Test Strategy',
      description: 'Test theme strategy',
    },
    setStrategy: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock theme config
jest.mock('../../app/theme-config', () => ({
  themeConfig: {
    subscribe: jest.fn(() => jest.fn()),
  },
  getThemeConfig: jest.fn(() => ({
    defaultStrategy: 'shared',
    features: { roleBasedTheming: true },
  })),
}));

// Mock logger
jest.mock('@lib/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

// Test components
const ThemeTestComponent = () => {
  const { theme, currentRole, colorScheme } = useTheme();
  const colors = useColors();
  const typography = useTypography();
  const spacing = useSpacing();
  const isDarkMode = useIsDarkMode();
  const role = useCurrentRole();
  const hasStudentRole = useHasThemeRole('student');
  const strategy = useThemeStrategy();
  
  return (
    <div>
      <div data-testid="primary-color">{colors.primary.main}</div>
      <div data-testid="font-size-md">{typography.fontSize.md}</div>
      <div data-testid="spacing-md">{spacing.md}</div>
      <div data-testid="is-dark-mode">{isDarkMode.toString()}</div>
      <div data-testid="current-role">{role}</div>
      <div data-testid="has-student-role">{hasStudentRole.toString()}</div>
      <div data-testid="strategy-type">{strategy.type}</div>
    </div>
  );
};

const StyleHelpersTestComponent = () => {
  const styleHelpers = useStyleHelpers();
  const buttonStyles = useButtonStyles('solid', 'md');
  const roleColors = useRoleColors('student');
  
  return (
    <div>
      <div data-testid="margin-style">{JSON.stringify(styleHelpers.margin('md'))}</div>
      <div data-testid="button-bg-color">{buttonStyles.backgroundColor}</div>
      <div data-testid="role-accent-color">{roleColors.accent}</div>
    </div>
  );
};

describe('ThemeContext', () => {
  describe('AppThemeProvider', () => {
    it('should render children', () => {
      render(
        <AppThemeProvider>
          <div data-testid="child">Child component</div>
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('mock-theme-provider')).toBeInTheDocument();
    });

    it('should provide theme context to children', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('primary-color')).toHaveTextContent('#007bff');
      expect(screen.getByTestId('font-size-md')).toHaveTextContent('16');
      expect(screen.getByTestId('spacing-md')).toHaveTextContent('16');
      expect(screen.getByTestId('current-role')).toHaveTextContent('student');
      expect(screen.getByTestId('strategy-type')).toHaveTextContent('shared');
    });
  });

  describe('Theme hooks', () => {
    it('should provide color values', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('primary-color')).toHaveTextContent('#007bff');
    });

    it('should provide typography values', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('font-size-md')).toHaveTextContent('16');
    });

    it('should provide spacing values', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('spacing-md')).toHaveTextContent('16');
    });

    it('should detect dark mode correctly', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });

    it('should provide current role', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('current-role')).toHaveTextContent('student');
      expect(screen.getByTestId('has-student-role')).toHaveTextContent('true');
    });

    it('should provide strategy information', () => {
      render(
        <AppThemeProvider>
          <ThemeTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('strategy-type')).toHaveTextContent('shared');
    });
  });

  describe('Style helpers', () => {
    it('should provide style helper functions', () => {
      render(
        <AppThemeProvider>
          <StyleHelpersTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('margin-style')).toHaveTextContent('{"margin":16}');
    });

    it('should provide button styles', () => {
      render(
        <AppThemeProvider>
          <StyleHelpersTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('button-bg-color')).toHaveTextContent('#007bff');
    });

    it('should provide role-specific colors', () => {
      render(
        <AppThemeProvider>
          <StyleHelpersTestComponent />
        </AppThemeProvider>
      );
      
      expect(screen.getByTestId('role-accent-color')).toHaveTextContent('#14B8A6');
    });
  });

  describe('Error handling', () => {
    it('should handle theme provider initialization', () => {
      // This test ensures the provider doesn't crash during initialization
      expect(() => {
        render(
          <AppThemeProvider>
            <div>Test</div>
          </AppThemeProvider>
        );
      }).not.toThrow();
    });
  });
});
