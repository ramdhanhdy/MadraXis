import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { SkeletonCard } from './SkeletonCard';

// Mock the theme context
jest.mock('../../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      spacing: {
        base: { xs: 4, sm: 8, md: 12, lg: 16 }
      },
      borderRadius: { sm: 4, md: 8 }
    }
  }),
  useColors: () => ({
    surface: { primary: '#ffffff', secondary: '#f8f9fa' },
    border: { primary: '#e9ecef' }
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('SkeletonCard', () => {
  it('renders correctly with default props', () => {
    render(
      <ThemeProvider>
        <SkeletonCard />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });

  it('renders with small variant', () => {
    render(
      <ThemeProvider>
        <SkeletonCard variant="small" />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });

  it('renders with horizontal layout', () => {
    render(
      <ThemeProvider>
        <SkeletonCard horizontal={true} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });

  it('renders with custom lines count', () => {
    render(
      <ThemeProvider>
        <SkeletonCard lines={5} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-content')).toBeTruthy();
  });

  it('renders with avatar', () => {
    render(
      <ThemeProvider>
        <SkeletonCard showAvatar={true} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });

  it('renders with compact variant', () => {
    render(
      <ThemeProvider>
        <SkeletonCard variant="compact" />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });

  it('renders with large variant', () => {
    render(
      <ThemeProvider>
        <SkeletonCard variant="large" />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });

  it('applies custom testID', () => {
    render(
      <ThemeProvider>
        <SkeletonCard testID="custom-skeleton-card" />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('custom-skeleton-card')).toBeTruthy();
    expect(screen.getByTestId('custom-skeleton-card-content')).toBeTruthy();
  });

  it('applies custom style', () => {
    render(
      <ThemeProvider>
        <SkeletonCard style={{ margin: 10 }} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('skeleton-card')).toBeTruthy();
  });
});