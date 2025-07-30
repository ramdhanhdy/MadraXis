/**
 * Shared Test Utilities - Navigation Mocks
 * 
 * This module provides comprehensive mocks for navigation-related functionality
 * including Expo Router, React Navigation, and custom navigation hooks.
 */

import { jest } from '@jest/globals';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Mock router interface matching Expo Router
 */
export interface MockRouter {
  push: jest.MockedFunction<(href: string) => void>;
  replace: jest.MockedFunction<(href: string) => void>;
  back: jest.MockedFunction<() => void>;
  canGoBack: jest.MockedFunction<() => boolean>;
  setParams: jest.MockedFunction<(params: Record<string, any>) => void>;
  pathname: string;
  params: Record<string, any>;
}

/**
 * Mock navigation interface matching React Navigation
 */
export interface MockNavigation {
  navigate: jest.MockedFunction<(name: string, params?: any) => void>;
  goBack: jest.MockedFunction<() => void>;
  canGoBack: jest.MockedFunction<() => boolean>;
  reset: jest.MockedFunction<(state: any) => void>;
  setParams: jest.MockedFunction<(params: Record<string, any>) => void>;
  addListener: jest.MockedFunction<(event: string, callback: Function) => () => void>;
  removeListener: jest.MockedFunction<(event: string, callback: Function) => void>;
  isFocused: jest.MockedFunction<() => boolean>;
  getState: jest.MockedFunction<() => any>;
  getParent: jest.MockedFunction<() => any>;
}

/**
 * Mock route interface
 */
export interface MockRoute {
  key: string;
  name: string;
  params?: Record<string, any>;
  path?: string;
}

/**
 * Navigation mock configuration
 */
export interface NavigationMockConfig {
  initialRoute?: string;
  initialParams?: Record<string, any>;
  canGoBack?: boolean;
  isFocused?: boolean;
  navigationState?: any;
}

// ============================================================================
// MOCK FACTORIES
// ============================================================================

/**
 * Create a mock Expo Router instance
 */
export function createMockRouter(config: NavigationMockConfig = {}): MockRouter {
  const {
    initialRoute = '/',
    initialParams = {},
    canGoBack = false
  } = config;

  return {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => canGoBack),
    setParams: jest.fn(),
    pathname: initialRoute,
    params: initialParams
  };
}

/**
 * Create a mock React Navigation instance
 */
export function createMockNavigation(config: NavigationMockConfig = {}): MockNavigation {
  const {
    canGoBack = false,
    isFocused = true,
    navigationState = null
  } = config;

  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => canGoBack),
    reset: jest.fn(),
    setParams: jest.fn(),
    addListener: jest.fn(() => jest.fn()), // Returns unsubscribe function
    removeListener: jest.fn(),
    isFocused: jest.fn(() => isFocused),
    getState: jest.fn(() => navigationState),
    getParent: jest.fn(() => null)
  };
}

/**
 * Create a mock route object
 */
export function createMockRoute(
  name: string,
  params: Record<string, any> = {},
  key: string = `${name}-${Date.now()}`
): MockRoute {
  return {
    key,
    name,
    params,
    path: `/${name}`
  };
}

// ============================================================================
// JEST MOCKS
// ============================================================================

/**
 * Mock Expo Router module
 */
export const mockExpoRouter = (config: NavigationMockConfig = {}) => {
  const mockRouter = createMockRouter(config);
  
  return jest.doMock('expo-router', () => ({
    useRouter: () => mockRouter,
    useLocalSearchParams: () => mockRouter.params,
    usePathname: () => mockRouter.pathname,
    useSegments: () => mockRouter.pathname.split('/').filter(Boolean),
    router: mockRouter,
    Stack: {
      Screen: ({ children }: { children: React.ReactNode }) => children
    },
    Tabs: {
      Screen: ({ children }: { children: React.ReactNode }) => children
    },
    Slot: ({ children }: { children: React.ReactNode }) => children,
    Link: ({ children }: { children: React.ReactNode }) => children,
    Redirect: () => null
  }));
};

/**
 * Mock React Navigation module
 */
export const mockReactNavigation = (config: NavigationMockConfig = {}) => {
  const mockNavigation = createMockNavigation(config);
  const mockRoute = createMockRoute(config.initialRoute || 'Home', config.initialParams);
  
  return jest.doMock('@react-navigation/native', () => ({
    useNavigation: () => mockNavigation,
    useRoute: () => mockRoute,
    useFocusEffect: (callback: Function) => {
      // Simulate focus effect
      callback();
    },
    useIsFocused: () => mockNavigation.isFocused(),
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
    createNavigationContainerRef: () => ({
      current: mockNavigation
    })
  }));
};

/**
 * Mock navigation-related hooks from the app
 */
export const mockNavigationHooks = () => {
  return jest.doMock('../../hooks', () => ({
    useNavigationHistory: () => ({
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
    }),
    useNavigationGuards: () => ({
      hasAccess: true,
      isLoading: false,
      error: null,
      validateAccess: jest.fn(() => Promise.resolve(true))
    }),
    useAuth: () => ({
      session: null,
      user: null,
      profile: null,
      loading: false,
      signOut: jest.fn(),
      clearSession: jest.fn()
    })
  }));
};

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Common navigation mock configurations
 */
export const navigationPresets = {
  /**
   * Student dashboard navigation
   */
  studentDashboard: {
    initialRoute: '/(student)/dashboard',
    initialParams: {},
    canGoBack: false,
    isFocused: true
  },

  /**
   * Teacher class management navigation
   */
  teacherClass: {
    initialRoute: '/(teacher)/class/123',
    initialParams: { id: '123' },
    canGoBack: true,
    isFocused: true
  },

  /**
   * Parent dashboard navigation
   */
  parentDashboard: {
    initialRoute: '/(parent)/dashboard',
    initialParams: {},
    canGoBack: false,
    isFocused: true
  },

  /**
   * Management setup navigation
   */
  managementSetup: {
    initialRoute: '/(management)/setup',
    initialParams: {},
    canGoBack: false,
    isFocused: true
  },

  /**
   * Authentication flow navigation
   */
  authLogin: {
    initialRoute: '/(auth)/login',
    initialParams: {},
    canGoBack: false,
    isFocused: true
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Setup navigation mocks for testing
 */
export function setupNavigationMocks(config: NavigationMockConfig = {}) {
  mockExpoRouter(config);
  mockReactNavigation(config);
  mockNavigationHooks();
}

/**
 * Reset all navigation mocks
 */
export function resetNavigationMocks() {
  jest.clearAllMocks();
}

/**
 * Create a complete navigation test environment
 */
export function createNavigationTestEnvironment(preset?: keyof typeof navigationPresets) {
  const config = preset ? navigationPresets[preset] : {};
  
  const mockRouter = createMockRouter(config);
  const mockNavigation = createMockNavigation(config);
  const mockRoute = createMockRoute(
    config.initialRoute || 'Home',
    config.initialParams || {}
  );

  setupNavigationMocks(config);

  return {
    mockRouter,
    mockNavigation,
    mockRoute,
    config,
    // Utility functions for testing
    navigateTo: (route: string, params?: any) => {
      mockRouter.push(route);
      mockNavigation.navigate(route, params);
    },
    goBack: () => {
      mockRouter.back();
      mockNavigation.goBack();
    },
    setParams: (params: Record<string, any>) => {
      mockRouter.setParams(params);
      mockNavigation.setParams(params);
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export commonly used mocks
export {
  createMockRouter,
  createMockNavigation,
  createMockRoute,
  mockExpoRouter,
  mockReactNavigation,
  mockNavigationHooks,
  setupNavigationMocks,
  resetNavigationMocks,
  createNavigationTestEnvironment
};

// Export preset configurations
export { navigationPresets };

// Default export for convenience
export default {
  createMockRouter,
  createMockNavigation,
  createMockRoute,
  setupNavigationMocks,
  resetNavigationMocks,
  createNavigationTestEnvironment,
  presets: navigationPresets
};
