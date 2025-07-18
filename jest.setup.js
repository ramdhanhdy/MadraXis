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
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'System',
  })),
  useColors: jest.fn(() => ({
    text: '#000000',
    textSecondary: '#666666',
    primary: '#007AFF',
    background: '#ffffff',
    surface: '#f5f5f5',
  })),
  useSpacing: jest.fn(() => ({
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  })),
  useTheme: jest.fn(() => ({
    theme: 'light',
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