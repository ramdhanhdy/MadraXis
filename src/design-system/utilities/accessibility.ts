/**
 * Accessibility Utilities for Component Theming
 * Provides helper functions for WCAG-compliant accessible components
 */

import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../core/types';

// Accessibility configuration types
export interface AccessibilityConfig {
  label?: string;
  hint?: string;
  role?: 'button' | 'text' | 'image' | 'header' | 'link' | 'search' | 'none';
  state?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    expanded?: boolean;
    busy?: boolean;
  };
  value?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  live?: 'none' | 'polite' | 'assertive';
  atomic?: boolean;
}

export interface TouchTargetConfig {
  minWidth?: number;
  minHeight?: number;
  padding?: number;
}

export interface FocusConfig {
  focusable?: boolean;
  tabIndex?: number;
  nextFocusDown?: string;
  nextFocusForward?: string;
  nextFocusLeft?: string;
  nextFocusRight?: string;
  nextFocusUp?: string;
}

/**
 * Create accessibility props for components
 */
export function createAccessibilityProps(
  config: AccessibilityConfig
): Record<string, any> {
  const props: Record<string, any> = {};
  
  if (config.label) {
    props.accessibilityLabel = config.label;
  }
  
  if (config.hint) {
    props.accessibilityHint = config.hint;
  }
  
  if (config.role) {
    props.accessibilityRole = config.role;
  }
  
  if (config.state) {
    props.accessibilityState = config.state;
  }
  
  if (config.value) {
    props.accessibilityValue = config.value;
  }
  
  if (config.live) {
    props.accessibilityLiveRegion = config.live;
  }
  
  if (config.atomic !== undefined) {
    props.accessibilityElementsHidden = config.atomic;
  }
  
  return props;
}

/**
 * Ensure minimum touch target size for accessibility
 */
export function createTouchTargetStyle(
  theme: Theme,
  config: TouchTargetConfig = {}
): ViewStyle {
  const accessibility = theme.accessibility || {};
  const minTouchTarget = accessibility.minTouchTarget || 44;
  
  const minWidth = config.minWidth || minTouchTarget;
  const minHeight = config.minHeight || minTouchTarget;
  const padding = config.padding || 0;
  
  return {
    minWidth,
    minHeight,
    padding,
    alignItems: 'center',
    justifyContent: 'center',
  };
}

/**
 * Create focus ring styles for keyboard navigation
 */
export function createFocusRingStyle(
  theme: Theme,
  focused: boolean = false
): ViewStyle {
  const accessibility = theme.accessibility || {};
  const focusRing = accessibility.focusRing || {
    width: 2,
    offset: 2,
    color: theme.colors?.primary?.main || '#007AFF',
  };
  
  if (!focused) {
    return {};
  }
  
  return {
    borderWidth: focusRing.width,
    borderColor: focusRing.color,
    borderRadius: 4,
    // Add offset using margin or shadow
    shadowColor: focusRing.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: focusRing.offset,
    elevation: 2,
  };
}

/**
 * Calculate color contrast ratio
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  // Convert hex colors to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };
  
  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) {
    return 1; // Return minimum contrast if colors can't be parsed
  }
  
  const fgLuminance = getLuminance(fgRgb);
  const bgLuminance = getLuminance(bgRgb);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate color contrast meets WCAG standards
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): { isValid: boolean; ratio: number; required: number } {
  const ratio = calculateContrastRatio(foreground, background);
  
  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };
  
  const required = requirements[level][size];
  const isValid = ratio >= required;
  
  return { isValid, ratio, required };
}

/**
 * Create high contrast color variants
 */
export function createHighContrastColors(
  theme: Theme,
  baseColors: Record<string, string>
): Record<string, string> {
  const highContrastColors: Record<string, string> = {};
  
  Object.entries(baseColors).forEach(([key, color]) => {
    // Increase contrast by making colors more extreme
    if (color.includes('#')) {
      const rgb = color.match(/\w\w/g);
      if (rgb) {
        const [r, g, b] = rgb.map(x => parseInt(x, 16));
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Make light colors lighter and dark colors darker
        highContrastColors[key] = luminance > 0.5 ? '#FFFFFF' : '#000000';
      }
    } else {
      highContrastColors[key] = color;
    }
  });
  
  return highContrastColors;
}

/**
 * Create reduced motion styles
 */
export function createReducedMotionStyle(
  theme: Theme,
  normalStyle: ViewStyle,
  reducedMotionPreference: boolean = false
): ViewStyle {
  if (!reducedMotionPreference) {
    return normalStyle;
  }
  
  const reducedMotion = theme.accessibility?.reducedMotion || {};
  
  return {
    ...normalStyle,
    // Remove transforms that might cause motion
    transform: undefined,
  };
}

/**
 * Screen reader utilities
 */
export class ScreenReaderUtils {
  /**
   * Create screen reader only text
   */
  static createScreenReaderOnlyStyle(): TextStyle {
    return {
      position: 'absolute',
      left: -10000,
      top: 'auto',
      width: 1,
      height: 1,
      overflow: 'hidden',
    };
  }
  
  /**
   * Create skip link for keyboard navigation
   */
  static createSkipLinkProps(targetId: string) {
    return {
      accessibilityRole: 'link' as const,
      accessibilityLabel: `Skip to ${targetId}`,
      accessibilityHint: 'Activate to skip to main content',
    };
  }
  
  /**
   * Create heading hierarchy props
   */
  static createHeadingProps(level: 1 | 2 | 3 | 4 | 5 | 6, text: string) {
    return {
      accessibilityRole: 'header' as const,
      accessibilityLevel: level,
      accessibilityLabel: text,
    };
  }
  
  /**
   * Create list item props
   */
  static createListItemProps(
    position: number,
    total: number,
    text: string
  ) {
    return {
      accessibilityLabel: `${text}, ${position} of ${total}`,
      accessibilityRole: 'text' as const,
    };
  }
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigationUtils {
  /**
   * Create keyboard navigation props
   */
  static createKeyboardProps(config: FocusConfig) {
    return {
      focusable: config.focusable !== false,
      ...(config.tabIndex !== undefined && { tabIndex: config.tabIndex }),
      ...(config.nextFocusDown && { nextFocusDown: config.nextFocusDown }),
      ...(config.nextFocusForward && { nextFocusForward: config.nextFocusForward }),
      ...(config.nextFocusLeft && { nextFocusLeft: config.nextFocusLeft }),
      ...(config.nextFocusRight && { nextFocusRight: config.nextFocusRight }),
      ...(config.nextFocusUp && { nextFocusUp: config.nextFocusUp }),
    };
  }
  
  /**
   * Create tab trap for modals
   */
  static createTabTrapProps(firstElementId: string, lastElementId: string) {
    return {
      onKeyDown: (event: any) => {
        if (event.key === 'Tab') {
          const { shiftKey, target } = event;
          
          if (shiftKey && target.id === firstElementId) {
            event.preventDefault();
            // Focus last element
          } else if (!shiftKey && target.id === lastElementId) {
            event.preventDefault();
            // Focus first element
          }
        }
      },
    };
  }
}

/**
 * Voice control utilities
 */
export class VoiceControlUtils {
  /**
   * Create voice control labels
   */
  static createVoiceLabel(text: string, alternatives?: string[]) {
    const labels = [text, ...(alternatives || [])];
    return {
      accessibilityLabel: text,
      accessibilityHint: alternatives?.length 
        ? `Also responds to: ${alternatives.join(', ')}`
        : undefined,
    };
  }
  
  /**
   * Create voice navigation props
   */
  static createVoiceNavigationProps(commands: string[]) {
    return {
      accessibilityActions: commands.map(command => ({
        name: command.toLowerCase().replace(/\s+/g, '_'),
        label: command,
      })),
    };
  }
}

/**
 * Create comprehensive accessibility configuration
 */
export function createAccessibilityConfiguration(
  theme: Theme,
  config: {
    component: 'button' | 'input' | 'card' | 'modal' | 'navigation';
    label: string;
    hint?: string;
    state?: AccessibilityConfig['state'];
    touchTarget?: TouchTargetConfig;
    focus?: FocusConfig;
    highContrast?: boolean;
    reducedMotion?: boolean;
  }
) {
  const accessibility = theme.accessibility || {};
  
  const baseProps = createAccessibilityProps({
    label: config.label,
    hint: config.hint,
    role: config.component === 'button' ? 'button' : 'none',
    state: config.state,
  });
  
  const touchTargetStyle = createTouchTargetStyle(theme, config.touchTarget);
  const keyboardProps = config.focus ? KeyboardNavigationUtils.createKeyboardProps(config.focus) : {};
  
  return {
    props: {
      ...baseProps,
      ...keyboardProps,
    },
    styles: {
      ...touchTargetStyle,
      ...(config.highContrast && {
        // Apply high contrast styles
        borderWidth: 2,
        borderColor: theme.colors?.text?.primary || '#000000',
      }),
    },
  };
}
