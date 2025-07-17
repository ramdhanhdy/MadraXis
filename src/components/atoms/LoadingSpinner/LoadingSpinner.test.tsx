import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { LoadingSpinner } from './LoadingSpinner';

// Comprehensive theme mock that matches the actual structure
const mockTheme = {
  colors: {
    primary: {
      main: '#007bff',
      light: '#66b3ff',
      dark: '#0056b3',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
      light: '#a8b3bd',
      dark: '#495057',
      contrast: '#ffffff',
    },
    success: {
      main: '#28a745',
      light: '#7dd87d',
      dark: '#1e7e34',
      contrast: '#ffffff',
    },
    warning: {
      main: '#ffc107',
      light: '#ffda6a',
      dark: '#c69500',
      contrast: '#212529',
    },
    error: {
      main: '#dc3545',
      light: '#f17a84',
      dark: '#a71d2a',
      contrast: '#ffffff',
    },
    info: {
      main: '#17a2b8',
      light: '#6edff6',
      dark: '#117a8b',
      contrast: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
      secondary: '#e9ecef',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef',
      disabled: '#f8f9fa',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      tertiary: '#adb5bd',
      disabled: '#ced4da',
      inverse: '#ffffff',
    },
    border: {
      primary: '#dee2e6',
      secondary: '#e9ecef',
      tertiary: '#f8f9fa',
      focus: '#007bff',
      error: '#dc3545',
    },
    interactive: {
      hover: '#e9ecef',
      active: '#dee2e6',
      selected: '#007bff',
      disabled: '#f8f9fa',
    },
    white: '#ffffff',
    black: '#000000',
  },
  typography: {
    variants: {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40, fontFamily: 'System' },
      h2: { fontSize: 28, fontWeight: '600', lineHeight: 36, fontFamily: 'System' },
      h3: { fontSize: 24, fontWeight: '600', lineHeight: 32, fontFamily: 'System' },
      h4: { fontSize: 20, fontWeight: '600', lineHeight: 28, fontFamily: 'System' },
      h5: { fontSize: 18, fontWeight: '600', lineHeight: 24, fontFamily: 'System' },
      h6: { fontSize: 16, fontWeight: '600', lineHeight: 22, fontFamily: 'System' },
      body1: { fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily: 'System' },
      body2: { fontSize: 14, fontWeight: '400', lineHeight: 20, fontFamily: 'System' },
      button: { fontSize: 14, fontWeight: '600', lineHeight: 20, fontFamily: 'System' },
      buttonSmall: { fontSize: 12, fontWeight: '600', lineHeight: 16, fontFamily: 'System' },
      buttonLarge: { fontSize: 16, fontWeight: '600', lineHeight: 24, fontFamily: 'System' },
      caption: { fontSize: 12, fontWeight: '400', lineHeight: 16, fontFamily: 'System' },
      overline: { fontSize: 10, fontWeight: '600', lineHeight: 12, fontFamily: 'System' },
    },
  },
  spacing: {
    base: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    semantic: {
      component: { xs: 4, sm: 8, md: 16, lg: 24 },
      layout: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, '2xl': 64 },
      container: { xs: 8, sm: 16, md: 24, lg: 32 },
      card: { xs: 8, sm: 16, md: 24, lg: 32 },
      button: { xs: 4, sm: 8, md: 16, lg: 24 },
      input: { xs: 8, sm: 16, md: 24 },
      listItem: { xs: 8, sm: 16, md: 24 },
    },
    grid: {
      gap: { xs: 4, sm: 8, md: 16, lg: 24 },
      column: { xs: 8, sm: 16, md: 24, lg: 32 },
    },
    screen: {
      horizontal: 16,
      vertical: 24,
      top: 24,
      bottom: 24,
    },
    component: {
      header: { horizontal: 16, vertical: 16, height: 60 },
      tabBar: { horizontal: 8, vertical: 8, height: 60 },
      modal: { padding: 24, margin: 16, borderRadius: 24 },
      quickAction: { gap: 16, padding: 16 },
      welcomeBanner: { padding: 24, margin: 16 },
      section: { marginBottom: 24, padding: 16 },
    },
  },
  shadows: {
    none: { shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 },
    xl: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 16 },
    card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    modal: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 16 },
    header: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
    tabBar: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  },
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  duration: { fast: 150, normal: 300, slow: 500 },
  easing: { linear: 'linear', ease: 'ease', easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out' },
  nativeEasing: { linear: jest.fn(), ease: jest.fn(), easeIn: jest.fn(), easeOut: jest.fn(), easeInOut: jest.fn() },
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
  zIndex: { hide: -1, base: 0, docked: 10, dropdown: 1000, sticky: 1100, banner: 1200, overlay: 1300, modal: 1400, popover: 1500, skipLink: 1600, toast: 1700, tooltip: 1800 },
  zIndexUtils: { auto: 'auto', getNumeric: jest.fn(), getAuto: jest.fn() },
  elevationLevels: { none: 0, sm: 2, md: 4, lg: 8, xl: 16 },
  componentThemes: {},
};

// Simplified mock that avoids Jest hoisting issues
jest.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: mockTheme,
    currentRole: null,
    setRole: jest.fn(),
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
  }),
  useColors: () => mockTheme.colors,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LoadingSpinner', () => {
  it('renders correctly with default props', () => {
    render(
      <ThemeProvider>
        <LoadingSpinner />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <LoadingSpinner size="small" />
      </ThemeProvider>
    );
    
    const spinner = getByTestId('loading-spinner');
    expect(spinner).toBeTruthy();
    
    // Verify the ActivityIndicator has the correct size prop
    const activityIndicator = getByTestId('loading-spinner-spinner');
    expect(activityIndicator.props.size).toBe('small');
  });

  it('renders with large size', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <LoadingSpinner size="large" />
      </ThemeProvider>
    );
    
    const activityIndicator = getByTestId('loading-spinner-spinner');
    expect(activityIndicator.props.size).toBe('large');
  });

  it('applies spacing based on theme tokens', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <LoadingSpinner message="Loading..." />
      </ThemeProvider>
    );
    
    const spinnerContainer = getByTestId('loading-spinner');
    expect(spinnerContainer.props.style.padding).toBe(24); // theme.spacing.base.lg
    
    const message = getByTestId('loading-message');
    expect(message.props.style.marginTop).toBe(8); // theme.spacing.base.sm
  });

  it('renders with custom message', () => {
    render(
      <ThemeProvider>
        <LoadingSpinner message="Loading data..." />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Loading data...')).toBeTruthy();
  });

  it('renders horizontally when vertical is false', () => {
    render(
      <ThemeProvider>
        <LoadingSpinner message="Loading" vertical={false} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('applies custom accessibility label', () => {
    render(
      <ThemeProvider>
        <LoadingSpinner accessibilityLabel="Custom loading label" />
      </ThemeProvider>
    );
    
    expect(screen.getByLabelText('Custom loading label')).toBeTruthy();
  });

  it('applies custom testID', () => {
    render(
      <ThemeProvider>
        <LoadingSpinner testID="custom-spinner" />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('custom-spinner')).toBeTruthy();
    expect(screen.getByTestId('custom-spinner-spinner')).toBeTruthy();
  });
});