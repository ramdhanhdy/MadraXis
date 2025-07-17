import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { LoadingSpinner } from './LoadingSpinner';

// Mock the theme context
jest.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      spacing: {
        base: { sm: 8, lg: 16 }
      }
    }
  }),
  useColors: () => ({
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' }
  }),
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
    render(
      <ThemeProvider>
        <LoadingSpinner size="small" />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
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