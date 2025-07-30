/**
 * Custom Jest Matchers for MadraXis Testing
 * 
 * Provides domain-specific matchers to improve test readability and maintainability.
 * These matchers are automatically available in all test files through jest setup.
 */

import { ReactTestInstance } from 'react-test-renderer';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Checks if element has accessible role and label
       */
      toBeAccessible(): R;
      
      /**
       * Checks if button component has correct loading state
       */
      toHaveLoadingState(): R;
      
      /**
       * Checks if component has theme-compliant colors
       */
      toHaveThemeColors(colors: Record<string, string>): R;
      
      /**
       * Checks if text follows typography guidelines
       */
      toHaveValidTypography(): R;
      
      /**
       * Checks if component has proper touch target size (44x44 minimum)
       */
      toHaveValidTouchTarget(): R;
      
      /**
       * Checks if component renders with error boundary protection
       */
      toHaveErrorBoundary(): R;
    }
  }
}

/**
 * Checks if element has proper accessibility attributes
 */
export const toBeAccessible = (received: ReactTestInstance) => {
  const hasAccessibilityLabel = received.props.accessibilityLabel || received.props['aria-label'];
  const hasAccessibilityRole = received.props.accessibilityRole || received.props.role;
  const hasTestID = received.props.testID || received.props['data-testid'];
  
  const pass = hasAccessibilityLabel && (hasAccessibilityRole || hasTestID);
  
  return {
    message: () => 
      pass
        ? `Expected element not to be accessible, but it has proper accessibility attributes`
        : `Expected element to be accessible. Missing: ${[
            !hasAccessibilityLabel && 'accessibilityLabel',
            !hasAccessibilityRole && !hasTestID && 'accessibilityRole or testID'
          ].filter(Boolean).join(', ')}`,
    pass,
  };
};

/**
 * Checks if button has loading state indicators
 */
export const toHaveLoadingState = (received: ReactTestInstance) => {
  const hasLoadingProp = received.props.loading === true;
  const hasDisabledState = received.props.disabled === true;
  const hasLoadingIndicator = received.findAllByType ? 
    received.findAllByType('ActivityIndicator').length > 0 || 
    received.findAllByProps({ 'data-testid': 'loading-spinner' }).length > 0 : false;
  
  const pass = hasLoadingProp && hasDisabledState && hasLoadingIndicator;
  
  return {
    message: () =>
      pass
        ? `Expected button not to have loading state`
        : `Expected button to have loading state. Missing: ${[
            !hasLoadingProp && 'loading prop',
            !hasDisabledState && 'disabled state',
            !hasLoadingIndicator && 'loading indicator'
          ].filter(Boolean).join(', ')}`,
    pass,
  };
};

/**
 * Checks if component uses theme-compliant colors
 */
export const toHaveThemeColors = (received: ReactTestInstance, expectedColors: Record<string, string>) => {
  const style = received.props.style || {};
  const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  
  const colorChecks = Object.entries(expectedColors).map(([property, expectedColor]) => {
    const actualColor = flatStyle[property];
    const matches = actualColor === expectedColor;
    return { property, expectedColor, actualColor, matches };
  });
  
  const allMatch = colorChecks.every(check => check.matches);
  const failures = colorChecks.filter(check => !check.matches);
  
  return {
    message: () =>
      allMatch
        ? `Expected component not to have theme colors`
        : `Expected component to have theme-compliant colors. Mismatches: ${failures
            .map(f => `${f.property}: expected ${f.expectedColor}, got ${f.actualColor}`)
            .join(', ')}`,
    pass: allMatch,
  };
};

/**
 * Checks if text follows typography guidelines
 */
export const toHaveValidTypography = (received: ReactTestInstance) => {
  const style = received.props.style || {};
  const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  
  const fontSize = flatStyle.fontSize;
  const fontWeight = flatStyle.fontWeight;
  const lineHeight = flatStyle.lineHeight;
  
  // Check if fontSize is within expected ranges (12-36px typically)
  const validFontSize = fontSize >= 12 && fontSize <= 36;
  
  // Check if fontWeight is a valid value
  const validFontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const validFontWeight = !fontWeight || validFontWeights.includes(String(fontWeight));
  
  // Check if lineHeight is reasonable (1.2 - 2.0 typically)
  const validLineHeight = !lineHeight || (lineHeight >= fontSize * 1.2 && lineHeight <= fontSize * 2.0);
  
  const pass = validFontSize && validFontWeight && validLineHeight;
  
  return {
    message: () =>
      pass
        ? `Expected text not to have valid typography`
        : `Expected text to have valid typography. Issues: ${[
            !validFontSize && `fontSize ${fontSize} out of range (12-36)`,
            !validFontWeight && `fontWeight ${fontWeight} invalid`,
            !validLineHeight && `lineHeight ${lineHeight} invalid for fontSize ${fontSize}`
          ].filter(Boolean).join(', ')}`,
    pass,
  };
};

/**
 * Checks if component has minimum touch target size (44x44)
 */
export const toHaveValidTouchTarget = (received: ReactTestInstance) => {
  const style = received.props.style || {};
  const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  
  const minTouchTarget = 44;
  const width = flatStyle.width || flatStyle.minWidth;
  const height = flatStyle.height || flatStyle.minHeight;
  const padding = flatStyle.padding || 0;
  const paddingVertical = flatStyle.paddingVertical || padding;
  const paddingHorizontal = flatStyle.paddingHorizontal || padding;
  
  // Calculate effective touch area
  const effectiveWidth = (width || 0) + (paddingHorizontal * 2);
  const effectiveHeight = (height || 0) + (paddingVertical * 2);
  
  const validWidth = effectiveWidth >= minTouchTarget;
  const validHeight = effectiveHeight >= minTouchTarget;
  const pass = validWidth && validHeight;
  
  return {
    message: () =>
      pass
        ? `Expected component not to have valid touch target`
        : `Expected component to have minimum touch target of ${minTouchTarget}x${minTouchTarget}. ` +
          `Actual: ${effectiveWidth}x${effectiveHeight}`,
    pass,
  };
};

/**
 * Checks if component is wrapped with error boundary
 */
export const toHaveErrorBoundary = (received: ReactTestInstance) => {
  // Look for error boundary in component tree
  let current = received.parent;
  let hasErrorBoundary = false;
  
  while (current && !hasErrorBoundary) {
    // Check if current component looks like an error boundary
    if (current.type && typeof current.type === 'object') {
      const componentName = current.type.displayName || current.type.name || '';
      hasErrorBoundary = componentName.toLowerCase().includes('errorboundary');
    }
    current = current.parent;
  }
  
  return {
    message: () =>
      hasErrorBoundary
        ? `Expected component not to have error boundary`
        : `Expected component to be wrapped with error boundary`,
    pass: hasErrorBoundary,
  };
};

// Export all matchers for setup
export const customMatchers = {
  toBeAccessible,
  toHaveLoadingState,
  toHaveThemeColors,
  toHaveValidTypography,
  toHaveValidTouchTarget,
  toHaveErrorBoundary,
};
