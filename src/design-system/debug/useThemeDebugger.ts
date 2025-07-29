/**
 * Theme Debugger Hook
 * Development-only hook for theme inspection and debugging
 */

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../core/types';
import { validateTheme, ValidationResult } from '../validation';
import { useTheme } from '../themes/ThemeProvider';

// Debug information types
export interface ThemeDebugInfo {
  theme: Theme;
  validation: ValidationResult;
  performance: PerformanceMetrics;
  usage: UsageStats;
  history: ThemeChangeHistory[];
}

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage: number;
  themeResolutionTime: number;
}

export interface UsageStats {
  componentsUsingTheme: string[];
  mostUsedTokens: TokenUsage[];
  unusedTokens: string[];
  colorContrastIssues: number;
}

export interface TokenUsage {
  path: string;
  count: number;
  lastUsed: number;
}

export interface ThemeChangeHistory {
  timestamp: number;
  previousTheme: string;
  newTheme: string;
  trigger: 'user' | 'system' | 'role_change' | 'strategy_change';
  performance: {
    switchTime: number;
    componentsRerendered: number;
  };
}

export interface ThemeDebuggerOptions {
  enableValidation?: boolean;
  enablePerformanceTracking?: boolean;
  enableUsageTracking?: boolean;
  enableHistory?: boolean;
  maxHistoryEntries?: number;
}

/**
 * Theme debugger hook for development
 */
export function useThemeDebugger(options: ThemeDebuggerOptions = {}): ThemeDebugInfo {
  const {
    enableValidation = true,
    enablePerformanceTracking = true,
    enableUsageTracking = true,
    enableHistory = true,
    maxHistoryEntries = 50,
  } = options;

  const { theme, strategy, role } = useTheme();
  
  // State for debug information
  const [debugInfo, setDebugInfo] = useState<ThemeDebugInfo>(() => ({
    theme,
    validation: { isValid: true, errors: [], warnings: [], summary: { totalErrors: 0, totalWarnings: 0, accessibilityScore: 100, completenessScore: 100, consistencyScore: 100 } },
    performance: {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      memoryUsage: 0,
      themeResolutionTime: 0,
    },
    usage: {
      componentsUsingTheme: [],
      mostUsedTokens: [],
      unusedTokens: [],
      colorContrastIssues: 0,
    },
    history: [],
  }));

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    memoryUsage: 0,
    themeResolutionTime: 0,
  });

  // Usage tracking
  const [usageStats, setUsageStats] = useState<UsageStats>({
    componentsUsingTheme: [],
    mostUsedTokens: [],
    unusedTokens: [],
    colorContrastIssues: 0,
  });

  // Theme change history
  const [history, setHistory] = useState<ThemeChangeHistory[]>([]);

  // Track theme changes
  useEffect(() => {
    if (!enableHistory) return;

    const startTime = performance.now();
    
    // Add to history
    const historyEntry: ThemeChangeHistory = {
      timestamp: Date.now(),
      previousTheme: history[0]?.newTheme || 'initial',
      newTheme: `${strategy}-${role}`,
      trigger: 'system', // This could be enhanced to detect actual trigger
      performance: {
        switchTime: performance.now() - startTime,
        componentsRerendered: 0, // This would need to be tracked separately
      },
    };

    setHistory(prev => [historyEntry, ...prev.slice(0, maxHistoryEntries - 1)]);
  }, [theme, strategy, role, enableHistory, maxHistoryEntries]);

  // Performance tracking
  useEffect(() => {
    if (!enablePerformanceTracking) return;

    const startTime = performance.now();
    
    setPerformanceMetrics(prev => {
      const renderTime = performance.now() - startTime;
      const newRenderCount = prev.renderCount + 1;
      const newAverageRenderTime = (prev.averageRenderTime * (newRenderCount - 1) + renderTime) / newRenderCount;
      
      return {
        ...prev,
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverageRenderTime,
        themeResolutionTime: renderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      };
    });
  }, [theme, enablePerformanceTracking]);

  // Validation
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    summary: {
      totalErrors: 0,
      totalWarnings: 0,
      accessibilityScore: 100,
      completenessScore: 100,
      consistencyScore: 100,
    },
  });

  useEffect(() => {
    if (!enableValidation) return;

    const validationResult = validateTheme(theme, {
      checkAccessibility: true,
      checkCompleteness: true,
      checkConsistency: true,
      contrastLevel: 'AA',
    });

    setValidation(validationResult);
  }, [theme, enableValidation]);

  // Usage tracking (simplified - in real implementation this would be more sophisticated)
  useEffect(() => {
    if (!enableUsageTracking) return;

    // This is a simplified version - real implementation would track actual component usage
    const mockUsageStats: UsageStats = {
      componentsUsingTheme: ['Button', 'Card', 'Modal', 'Navigation'],
      mostUsedTokens: [
        { path: 'colors.primary.main', count: 15, lastUsed: Date.now() },
        { path: 'spacing.base.md', count: 12, lastUsed: Date.now() },
        { path: 'typography.fontSize.base', count: 10, lastUsed: Date.now() },
      ],
      unusedTokens: ['colors.tertiary.light', 'spacing.component.xxl'],
      colorContrastIssues: validation.errors.filter(e => e.type === 'contrast_failure').length,
    };

    setUsageStats(mockUsageStats);
  }, [theme, validation, enableUsageTracking]);

  // Update debug info
  useEffect(() => {
    setDebugInfo({
      theme,
      validation,
      performance: performanceMetrics,
      usage: usageStats,
      history,
    });
  }, [theme, validation, performanceMetrics, usageStats, history]);

  return debugInfo;
}

/**
 * Theme inspector utilities
 */
export class ThemeInspector {
  /**
   * Get theme token by path
   */
  static getTokenByPath(theme: Theme, path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], theme as any);
  }

  /**
   * Find all tokens matching a pattern
   */
  static findTokens(theme: Theme, pattern: RegExp): Array<{ path: string; value: any }> {
    const results: Array<{ path: string; value: any }> = [];
    
    const traverse = (obj: any, currentPath: string = '') => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const newPath = currentPath ? `${currentPath}.${key}` : key;
          
          if (pattern.test(newPath)) {
            results.push({ path: newPath, value: obj[key] });
          }
          
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            traverse(obj[key], newPath);
          }
        });
      }
    };
    
    traverse(theme);
    return results;
  }

  /**
   * Get theme structure as a tree
   */
  static getThemeTree(theme: Theme): ThemeTreeNode {
    const createNode = (obj: any, name: string): ThemeTreeNode => {
      const node: ThemeTreeNode = {
        name,
        type: typeof obj,
        value: obj,
        children: [],
      };

      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        node.children = Object.keys(obj).map(key => createNode(obj[key], key));
      }

      return node;
    };

    return createNode(theme, 'theme');
  }

  /**
   * Compare two themes and find differences
   */
  static compareThemes(theme1: Theme, theme2: Theme): ThemeComparison {
    const differences: ThemeDifference[] = [];
    
    const compare = (obj1: any, obj2: any, path: string = '') => {
      const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
      
      keys.forEach(key => {
        const newPath = path ? `${path}.${key}` : key;
        const val1 = obj1?.[key];
        const val2 = obj2?.[key];
        
        if (val1 === undefined && val2 !== undefined) {
          differences.push({
            path: newPath,
            type: 'added',
            oldValue: undefined,
            newValue: val2,
          });
        } else if (val1 !== undefined && val2 === undefined) {
          differences.push({
            path: newPath,
            type: 'removed',
            oldValue: val1,
            newValue: undefined,
          });
        } else if (val1 !== val2) {
          if (typeof val1 === 'object' && typeof val2 === 'object') {
            compare(val1, val2, newPath);
          } else {
            differences.push({
              path: newPath,
              type: 'changed',
              oldValue: val1,
              newValue: val2,
            });
          }
        }
      });
    };
    
    compare(theme1, theme2);
    
    return {
      differences,
      summary: {
        added: differences.filter(d => d.type === 'added').length,
        removed: differences.filter(d => d.type === 'removed').length,
        changed: differences.filter(d => d.type === 'changed').length,
      },
    };
  }

  /**
   * Export theme as JSON
   */
  static exportTheme(theme: Theme, format: 'json' | 'css' | 'scss' = 'json'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(theme, null, 2);
      
      case 'css':
        return this.themeToCssVariables(theme);
      
      case 'scss':
        return this.themeToScssVariables(theme);
      
      default:
        return JSON.stringify(theme, null, 2);
    }
  }

  /**
   * Convert theme to CSS custom properties
   */
  private static themeToCssVariables(theme: Theme): string {
    const variables: string[] = [':root {'];
    
    const traverse = (obj: any, prefix: string = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const varName = prefix ? `${prefix}-${key}` : key;
        
        if (typeof value === 'string' || typeof value === 'number') {
          variables.push(`  --${varName}: ${value};`);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, varName);
        }
      });
    };
    
    traverse(theme);
    variables.push('}');
    
    return variables.join('\n');
  }

  /**
   * Convert theme to SCSS variables
   */
  private static themeToScssVariables(theme: Theme): string {
    const variables: string[] = [];
    
    const traverse = (obj: any, prefix: string = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const varName = prefix ? `${prefix}-${key}` : key;
        
        if (typeof value === 'string' || typeof value === 'number') {
          variables.push(`$${varName}: ${value};`);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, varName);
        }
      });
    };
    
    traverse(theme);
    
    return variables.join('\n');
  }
}

// Supporting types
export interface ThemeTreeNode {
  name: string;
  type: string;
  value: any;
  children: ThemeTreeNode[];
}

export interface ThemeComparison {
  differences: ThemeDifference[];
  summary: {
    added: number;
    removed: number;
    changed: number;
  };
}

export interface ThemeDifference {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue: any;
  newValue: any;
}

// Development-only warning
if (__DEV__) {
  console.log('🎨 Theme Debugger loaded - use useThemeDebugger() hook for theme inspection');
}
