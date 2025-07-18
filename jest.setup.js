/**
 * Jest Setup Configuration
 * Sets up testing environment for React Native components
 */

require('@testing-library/jest-native/extend-expect');

// Mock Expo modules that might cause issues in tests
jest.mock('expo-constants', () => ({
  expoConfig: {
    name: 'MadraXis',
    slug: 'madraxis',
  },
  executionEnvironment: 'standalone',
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: View,
    MaterialIcons: View,
    FontAwesome: View,
    AntDesign: View,
    Entypo: View,
    EvilIcons: View,
    Feather: View,
    Foundation: View,
    MaterialCommunityIcons: View,
    Octicons: View,
    SimpleLineIcons: View,
    Zocial: View,
  };
});

// Mock React Native ActivityIndicator to avoid ES6 syntax issues
jest.mock('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ size = 'small', color = '#007AFF', testID, ...props }) => {
      return React.createElement(View, {
        ...props,
        testID: testID || 'activity-indicator',
        size: size,
        color: color
      });
    },
  };
});

// Mock ActivityIndicatorViewNativeComponent
jest.mock('react-native/src/private/specs_DEPRECATED/components/ActivityIndicatorViewNativeComponent', () => {
  return {
    __INTERNAL_VIEW_CONFIG: {},
  };
});

// Mock Theme Context for hooks
jest.mock('./src/context/ThemeContext', () => ({
  ...jest.requireActual('./src/context/ThemeContext'),
  useTypography: jest.fn(() => ({
    variants: {
      h1: { fontSize: 32, fontWeight: '700', lineHeight: 40, fontFamily: 'System' },
      h2: { fontSize: 28, fontWeight: '600', lineHeight: 36, fontFamily: 'System' },
      h3: { fontSize: 24, fontWeight: '600', lineHeight: 32, fontFamily: 'System' },
      h4: { fontSize: 20, fontWeight: '600', lineHeight: 28, fontFamily: 'System' },
      body1: { fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily: 'System' },
      body2: { fontSize: 14, fontWeight: '400', lineHeight: 20, fontFamily: 'System' },
      button: { fontSize: 14, fontWeight: '600', lineHeight: 20, fontFamily: 'System' },
      buttonSmall: { fontSize: 12, fontWeight: '600', lineHeight: 16, fontFamily: 'System' },
      buttonLarge: { fontSize: 16, fontWeight: '600', lineHeight: 24, fontFamily: 'System' },
      caption: { fontSize: 12, fontWeight: '400', lineHeight: 16, fontFamily: 'System' },
      overline: { fontSize: 10, fontWeight: '600', lineHeight: 12, fontFamily: 'System' },
    },
  })),
  useColors: jest.fn(() => ({
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      tertiary: '#adb5bd',
      disabled: '#ced4da',
      inverse: '#ffffff',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
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
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
    },
    interactive: {
      hover: '#e9ecef',
      active: '#dee2e6',
      selected: '#007bff',
      disabled: '#f8f9fa',
    },
  })),
  useSpacing: jest.fn(() => ({
    base: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
  })),
  useTheme: jest.fn(() => ({
    theme: {
      typography: {
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.8,
        },
        fontSize: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 30,
          '4xl': 36,
        },
      },
      spacing: {
        base: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
        },
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
      shadows: {
        none: { shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
        sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
        md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
        lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 },
        button: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
      },
    },
  })),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
// Note: This mock is commented out as it may not be available in all RN versions
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};