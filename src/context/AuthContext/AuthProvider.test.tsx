import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

// Mock Supabase
jest.mock('@lib/utils/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: jest.fn() } } 
      }),
      signOut: jest.fn().mockResolvedValue({}),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
  },
}));

// Mock logger
jest.mock('@lib/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

// Simple test component
const TestComponent = () => {
  const { loading } = useAuth();
  return <Text testID="loading-state">{loading ? 'Loading' : 'Not Loading'}</Text>;
};

describe('AuthProvider', () => {
  it('should render children without crashing', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Text testID="child">Child component</Text>
      </AuthProvider>
    );
    
    expect(getByTestId('child')).toBeTruthy();
  });

  it('should provide auth context to children', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(getByTestId('loading-state')).toBeTruthy();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
