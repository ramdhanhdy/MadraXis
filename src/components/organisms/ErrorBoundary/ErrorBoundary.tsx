/**
 * ErrorBoundary Component
 * Consistent error boundary for handling React errors across all user roles
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ErrorMessage } from '../../molecules/ErrorMessage/ErrorMessage';

// ErrorBoundary Props Interface
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnRetry?: boolean;
}

// ErrorBoundary State Interface
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ErrorBoundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    if (this.props.resetOnRetry) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    } else {
      // Reload the app
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ThemeProvider>
          <View style={styles.container}>
            <ErrorMessage
              title="Something went wrong"
              message={this.state.error?.message || 'An unexpected error occurred. Please try again.'}
              onRetry={this.handleRetry}
              retryLabel="Reload App"
              variant="error"
              fullScreen={true}
              testID="error-boundary-message"
            />
          </View>
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

// Internal styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Export default
export default ErrorBoundary;