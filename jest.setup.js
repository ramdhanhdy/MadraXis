/**
 * Jest Setup Configuration
 * Sets up testing environment for React Native components
 */

import '@testing-library/jest-native/extend-expect';

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