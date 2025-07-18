import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { EmptyState } from './EmptyState';

// Use global theme context mocks from jest.setup.js

describe('EmptyState', () => {
  it('renders correctly with title and message', () => {
    render(
      <ThemeProvider>
        <EmptyState
          title="No Data"
          message="There is no data available"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('No Data')).toBeTruthy();
    expect(screen.getByText('There is no data available')).toBeTruthy();
  });

  it('renders correctly without title', () => {
    render(
      <ThemeProvider>
        <EmptyState message="No items found" />
      </ThemeProvider>
    );
    
    expect(screen.queryByText('No Data')).toBeNull();
    expect(screen.getByText('No items found')).toBeTruthy();
  });

  it('renders with custom icon', () => {
    render(
      <ThemeProvider>
        <EmptyState
          message="No results"
          icon="search"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('No results')).toBeTruthy();
  });

  it('renders with action button', () => {
    const mockAction = jest.fn();
    
    render(
      <ThemeProvider>
        <EmptyState
          title="Empty Cart"
          message="Your cart is empty"
          actionLabel="Add Items"
          onAction={mockAction}
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Empty Cart')).toBeTruthy();
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    expect(screen.getByText('Add Items')).toBeTruthy();
  });

  it('calls onAction when action button is pressed', () => {
    const mockAction = jest.fn();
    
    render(
      <ThemeProvider>
        <EmptyState
          message="No data"
          actionLabel="Retry"
          onAction={mockAction}
        />
      </ThemeProvider>
    );
    
    fireEvent.press(screen.getByText('Retry'));
    expect(mockAction).toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <ThemeProvider>
        <EmptyState
          message="No search results"
          variant="search"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('No search results')).toBeTruthy();
    
    rerender(
      <ThemeProvider>
        <EmptyState
          message="No notifications"
          variant="notification"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('No notifications')).toBeTruthy();
  });

  it('renders in full screen mode', () => {
    render(
      <ThemeProvider>
        <EmptyState
          message="Full screen empty state"
          fullScreen={true}
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Full screen empty state')).toBeTruthy();
  });

  it('applies custom testID', () => {
    render(
      <ThemeProvider>
        <EmptyState
          message="Test message"
          testID="custom-empty-state"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('custom-empty-state')).toBeTruthy();
    expect(screen.getByTestId('custom-empty-state-content')).toBeTruthy();
  });

  it('applies custom accessibility label', () => {
    render(
      <ThemeProvider>
        <EmptyState
          title="Custom Title"
          message="Custom message"
          accessibilityLabel="Custom accessibility label"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByLabelText('Custom accessibility label')).toBeTruthy();
  });
});