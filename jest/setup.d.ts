/**
 * Jest Setup Type Declarations
 * 
 * This file provides type declarations for Jest setup to avoid conflicts
 * between React Native and DOM types during testing.
 */

// Extend Jest matchers with custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveLoadingState(): R;
      toHaveErrorBoundary(): R;
    }
  }
}

// Mock component prop types
interface MockActivityIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  testID?: string;
  [key: string]: any;
}

interface MockModalProps {
  visible?: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  onRequestClose?: () => void;
  children?: React.ReactNode;
  testID?: string;
  [key: string]: any;
}

interface MockScrollViewProps {
  children?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  showsVerticalScrollIndicator?: boolean;
  testID?: string;
  [key: string]: any;
}

interface MockSafeAreaViewProps {
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
}

export {};
