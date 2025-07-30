/**
 * Theme System Test Suite
 * Comprehensive tests for the enhanced theme system
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import { 
  EnhancedThemeProvider, 
  useThemeDebugger 
} from '../provider/ThemeProvider';
import { useEnhancedTheme } from '../hooks';
import { 
  roleBasedThemeStrategy, 
  sharedThemeStrategy,
  adaptiveThemeStrategy 
} from '../strategies';
import { roleThemes } from '../roles';
import { validateTheme } from '../../core/utils';

// Test component to access theme context
const TestComponent: React.FC = () => {
  const { theme, currentRole, setRole, colorScheme, setColorScheme } = useEnhancedTheme();
  const themeDebugger = useThemeDebugger();

  return (
    <div>
      <div data-testid="current-role">{currentRole || 'none'}</div>
      <div data-testid="color-scheme">{colorScheme}</div>
      <div data-testid="primary-color">{theme.colors.primary.main}</div>
      <div data-testid="strategy-type">{themeDebugger.getThemeMetadata().strategyType}</div>
      <button 
        data-testid="set-student" 
        onClick={() => setRole('student')}
      >
        Set Student
      </button>
      <button 
        data-testid="set-dark" 
        onClick={() => setColorScheme('dark')}
      >
        Set Dark
      </button>
    </div>
  );
};

describe('Enhanced Theme System', () => {
  describe('ThemeProvider', () => {
    test('should provide default theme context', () => {
      const { getByTestId } = render(
        <EnhancedThemeProvider strategy={sharedThemeStrategy}>
          <TestComponent />
        </EnhancedThemeProvider>
      );

      expect(getByTestId('current-role')).toHaveTextContent('none');
      expect(getByTestId('color-scheme')).toHaveTextContent('light');
      expect(getByTestId('strategy-type')).toHaveTextContent('shared');
    });

    test('should handle role-based theme switching', () => {
      const { getByTestId } = render(
        <EnhancedThemeProvider strategy={roleBasedThemeStrategy}>
          <TestComponent />
        </EnhancedThemeProvider>
      );

      // Initially no role
      expect(getByTestId('current-role')).toHaveTextContent('none');

      // Switch to student role
      act(() => {
        getByTestId('set-student').click();
      });

      expect(getByTestId('current-role')).toHaveTextContent('student');
      expect(getByTestId('primary-color')).toHaveTextContent('#14B8A6'); // Student teal
    });

    test('should handle color scheme switching', () => {
      const { getByTestId } = render(
        <EnhancedThemeProvider 
          strategy={roleBasedThemeStrategy}
          initialRole="student"
        >
          <TestComponent />
        </EnhancedThemeProvider>
      );

      // Initially light mode
      expect(getByTestId('color-scheme')).toHaveTextContent('light');

      // Switch to dark mode
      act(() => {
        getByTestId('set-dark').click();
      });

      expect(getByTestId('color-scheme')).toHaveTextContent('dark');
    });

    test('should handle theme change callbacks', () => {
      const onThemeChange = jest.fn();
      const onThemeError = jest.fn();

      render(
        <EnhancedThemeProvider 
          strategy={roleBasedThemeStrategy}
          onThemeChange={onThemeChange}
          onThemeError={onThemeError}
        >
          <TestComponent />
        </EnhancedThemeProvider>
      );

      expect(onThemeChange).toHaveBeenCalled();
      expect(onThemeError).not.toHaveBeenCalled();
    });
  });

  describe('Theme Strategies', () => {
    test('should resolve shared theme correctly', () => {
      const theme = sharedThemeStrategy.resolver({
        strategy: 'shared',
        baseTheme: 'light',
      });

      expect(theme).toBeDefined();
      expect(theme.colors.primary.main).toBeDefined();
      expect(validateTheme(theme).isValid).toBe(true);
    });

    test('should resolve role-based theme correctly', () => {
      const studentTheme = roleBasedThemeStrategy.resolver({
        strategy: 'role-based',
        baseTheme: 'light',
      }, 'student');

      expect(studentTheme).toBeDefined();
      expect(studentTheme.colors.primary.main).toBe('#14B8A6'); // Student teal
      expect(validateTheme(studentTheme).isValid).toBe(true);
    });

    test('should handle adaptive strategy switching', () => {
      // Test shared mode
      const sharedTheme = adaptiveThemeStrategy.resolver({
        strategy: 'shared',
        baseTheme: 'light',
      });

      expect(sharedTheme).toBeDefined();

      // Test role-based mode
      const roleTheme = adaptiveThemeStrategy.resolver({
        strategy: 'role-based',
        baseTheme: 'light',
      }, 'teacher');

      expect(roleTheme).toBeDefined();
      expect(roleTheme.colors.primary.main).toBe('#10B981'); // Teacher green
    });
  });

  describe('Role Themes', () => {
    test('should have all required role themes', () => {
      expect(roleThemes.student).toBeDefined();
      expect(roleThemes.teacher).toBeDefined();
      expect(roleThemes.parent).toBeDefined();
      expect(roleThemes.management).toBeDefined();
    });

    test('should have light and dark variants for each role', () => {
      Object.keys(roleThemes).forEach(role => {
        expect(roleThemes[role as keyof typeof roleThemes].light).toBeDefined();
        expect(roleThemes[role as keyof typeof roleThemes].dark).toBeDefined();
      });
    });

    test('should have correct primary colors for each role', () => {
      expect(roleThemes.student.light.colors.primary.main).toBe('#14B8A6'); // Teal
      expect(roleThemes.teacher.light.colors.primary.main).toBe('#10B981'); // Green
      expect(roleThemes.parent.light.colors.primary.main).toBe('#FBBF24'); // Amber
      expect(roleThemes.management.light.colors.primary.main).toBe('#E11D48'); // Rose
    });

    test('should validate all role themes', () => {
      Object.entries(roleThemes).forEach(([role, themes]) => {
        const lightValidation = validateTheme(themes.light);
        const darkValidation = validateTheme(themes.dark);

        expect(lightValidation.isValid).toBe(true);
        expect(darkValidation.isValid).toBe(true);
      });
    });
  });

  describe('Theme Debugging', () => {
    test('should provide debugging utilities', () => {
      const TestDebugComponent: React.FC = () => {
        const themeDebugger = useThemeDebugger();
        const metadata = themeDebugger.getThemeMetadata();
        
        return (
          <div>
            <div data-testid="debug-role">{metadata.role || 'none'}</div>
            <div data-testid="debug-strategy">{metadata.strategyType}</div>
            <div data-testid="debug-errors">{metadata.hasErrors.toString()}</div>
          </div>
        );
      };

      const { getByTestId } = render(
        <EnhancedThemeProvider 
          strategy={roleBasedThemeStrategy}
          initialRole="student"
        >
          <TestDebugComponent />
        </EnhancedThemeProvider>
      );

      expect(getByTestId('debug-role')).toHaveTextContent('student');
      expect(getByTestId('debug-strategy')).toHaveTextContent('role-based');
      expect(getByTestId('debug-errors')).toHaveTextContent('false');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid strategy gracefully', () => {
      const onThemeError = jest.fn();
      const invalidStrategy = {
        name: 'Invalid Strategy',
        description: 'Invalid strategy for testing',
        type: 'shared' as const,
        themes: {}, // Missing required themes
        resolver: () => roleThemes.student.light,
      };

      render(
        <EnhancedThemeProvider 
          strategy={invalidStrategy}
          onThemeError={onThemeError}
        >
          <TestComponent />
        </EnhancedThemeProvider>
      );

      // Should use fallback theme and call error handler
      expect(onThemeError).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      let renderCount = 0;
      
      const TestPerformanceComponent: React.FC = () => {
        renderCount++;
        const { theme } = useEnhancedTheme();
        return <div data-testid="primary-color">{theme.colors.primary.main}</div>;
      };

      const { getByTestId, rerender } = render(
        <EnhancedThemeProvider strategy={roleBasedThemeStrategy}>
          <TestPerformanceComponent />
        </EnhancedThemeProvider>
      );

      const initialRenderCount = renderCount;

      // Re-render with same props should not cause theme re-computation
      rerender(
        <EnhancedThemeProvider strategy={roleBasedThemeStrategy}>
          <TestPerformanceComponent />
        </EnhancedThemeProvider>
      );

      expect(renderCount).toBe(initialRenderCount + 1); // Only one additional render
    });
  });
});
