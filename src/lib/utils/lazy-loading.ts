/**
 * Lazy Loading Utilities
 * 
 * This module provides utilities for creating lazy-loaded components
 * to improve app startup performance and reduce initial bundle size.
 */

import React, { Suspense } from 'react';
import { logger } from './logger';

/**
 * Basic lazy component creator
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName?: string
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(() => {
    if (componentName) {
      logger.debug(`Lazy loading component: ${componentName}`, { componentName });
    }
    return importFn();
  });

  return LazyComponent;
}

/**
 * Monitored lazy component creator with error handling
 */
export function createMonitoredLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(() => {
    const startTime = Date.now();
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Starting lazy load: ${componentName}`, { componentName, startTime });
    }

    return importFn()
      .then((module) => {
        const loadTime = Date.now() - startTime;
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug(`Successfully loaded: ${componentName}`, { 
            componentName, 
            loadTime,
            success: true 
          });
        }
        
        return module;
      })
      .catch((error) => {
        const loadTime = Date.now() - startTime;
        
        logger.error(`Failed to load component: ${componentName}`, { 
          componentName, 
          loadTime,
          error: error instanceof Error ? error.message : String(error),
          success: false 
        });
        
        // Re-throw the error to be handled by ErrorBoundary
        throw error;
      });
  });

  return LazyComponent;
}

/**
 * Loading fallback component for lazy-loaded components
 */
export interface LoadingFallbackProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingFallback({ size = 'medium', message }: LoadingFallbackProps) {
  // For now, return a simple loading indicator
  // In a real implementation, you might use your LoadingSpinner component
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: size === 'small' ? '8px' : size === 'medium' ? '16px' : '24px',
    },
    children: message || 'Loading...'
  });
}

/**
 * Higher-order component for lazy loading with error boundary
 */
export function withLazyLoading<P extends object>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  FallbackComponent: React.ComponentType = LoadingFallback,
  ErrorFallback?: React.ComponentType<{ error: Error }>
): React.ComponentType<P> {
  return function LazyLoadedComponent(props: P) {
    return React.createElement(
      React.Suspense,
      { fallback: React.createElement(FallbackComponent) },
      React.createElement(
        ErrorBoundary,
        { fallback: ErrorFallback, children: React.createElement(LazyComponent, props) }
      )
    );
  };
}

/**
 * Simple error boundary component for lazy-loaded components
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error in lazy-loaded component', {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent) {
        return React.createElement(FallbackComponent, { error: this.state.error });
      }

      return React.createElement('div', {
        style: { padding: '16px', textAlign: 'center', color: 'red' }
      },
        React.createElement('h3', null, 'Something went wrong'),
        React.createElement('p', null, this.state.error?.message)
      );
    }

    return this.props.children;
  }
}

/**
 * Performance monitoring utilities for lazy loading
 */
export interface LazyLoadingMetrics {
  componentName: string;
  loadTime: number;
  success: boolean;
  timestamp: number;
}

class LazyLoadingMonitor {
  private metrics: LazyLoadingMetrics[] = [];

  recordMetric(metric: LazyLoadingMetrics) {
    this.metrics.push(metric);
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Lazy loading metric recorded', metric);
    }
  }

  getMetrics(): LazyLoadingMetrics[] {
    return [...this.metrics];
  }

  getAverageLoadTime(componentName?: string): number {
    const relevantMetrics = componentName 
      ? this.metrics.filter(m => m.componentName === componentName && m.success)
      : this.metrics.filter(m => m.success);
    
    if (relevantMetrics.length === 0) return 0;
    
    const totalTime = relevantMetrics.reduce((sum, m) => sum + m.loadTime, 0);
    return totalTime / relevantMetrics.length;
  }

  clear() {
    this.metrics = [];
  }
}

export const lazyLoadingMonitor = new LazyLoadingMonitor();

/**
 * Hook for tracking lazy loading performance
 */
export function useLazyLoadingMetrics() {
  return {
    metrics: lazyLoadingMonitor.getMetrics(),
    averageLoadTime: lazyLoadingMonitor.getAverageLoadTime(),
    recordMetric: (metric: LazyLoadingMetrics) => lazyLoadingMonitor.recordMetric(metric),
    clearMetrics: () => lazyLoadingMonitor.clear(),
  };
}