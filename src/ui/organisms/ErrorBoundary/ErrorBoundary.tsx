import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { logger } from '@lib/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error', { error, errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If a fallback component is provided, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View 
          style={styles.container} 
          accessibilityRole="alert"
          accessibilityLabel="Error occurred"
        >
          <Text 
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Error title: Something went wrong"
          >
            Something went wrong
          </Text>
          <Text
            style={styles.message}
            accessibilityLabel="Error description"
          >
            We&apos;re sorry, but an unexpected error occurred.
          </Text>
          {this.state.error && (
            <Text
              style={styles.errorDetails}
              numberOfLines={3}
              accessibilityLabel={`Error details: ${this.state.error.message}`}
            >
              {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry loading the application"
            accessibilityHint="Double tap to attempt to reload the application"
          >
            <Text
              style={styles.retryButtonText}
              accessibilityLabel="Retry button text"
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});