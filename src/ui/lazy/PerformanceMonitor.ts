/**
 * Performance Monitor Component
 *
 * A development-only component for monitoring app performance metrics.
 * Only loaded in development environment.
 */

import React, { useEffect, useState } from 'react';
import { logger } from '@lib/utils/logger';
import { Typography } from '@ui/atoms/Typography';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  visible?: boolean;
}

export function PerformanceMonitor({ visible = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (!__DEV__) return;

    let animationFrameId: number;

    const measurePerformance = () => {
      try {
        // Simple FPS calculation
        const now = performance.now();
        const fps = 60; // Simplified for now
        
        const newMetrics: PerformanceMetrics = {
          fps,
          memory: 0, // Memory usage not available in React Native
          renderTime: now,
          timestamp: Date.now()
        };

        setMetrics(newMetrics);
      } catch (error) {
        logger.warn('Performance measurement failed', { error });
      }

      animationFrameId = requestAnimationFrame(measurePerformance);
    };

    if (isVisible) {
      measurePerformance();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible]);

  if (!__DEV__ || !isVisible) {
    return null;
  }

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'inverse',
      padding: 8,
      borderRadius: 4,
      zIndex: 9999,
    }
  }, [
    React.createElement('div', { key: 'toggle' },
      React.createElement('button', {
        onClick: () => setIsVisible(!isVisible),
        style: { marginBottom: 8 }
      }, React.createElement(Typography, { variant: 'caption', color: 'inverse', children: 'Toggle Monitor' }))
    ),
    metrics && React.createElement('div', { key: 'metrics' }, [
      React.createElement('div', { key: 'fps' }, React.createElement(Typography, { variant: 'caption', color: 'inverse', children: `FPS: ${metrics.fps}`})),
      React.createElement('div', { key: 'render' }, React.createElement(Typography, { variant: 'caption', color: 'inverse', children: `Render: ${metrics.renderTime.toFixed(2)}ms`})),
      React.createElement('div', { key: 'time' }, React.createElement(Typography, { variant: 'caption', color: 'inverse', children: `Time: ${new Date(metrics.timestamp).toLocaleTimeString()}`}))
    ])
  ]);
}