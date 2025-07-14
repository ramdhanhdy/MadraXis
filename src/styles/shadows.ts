/**
 * Shadow Design Tokens
 * Elevation system for depth and hierarchy using consistent shadow definitions
 */

import { Platform } from 'react-native';

// Shadow Style Interface
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android elevation
}

// Base Shadow Definitions
const baseShadows = {
  none: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// Semantic Shadow Mappings
export const semanticShadows = {
  // Component-specific shadows
  card: baseShadows.sm,           // Standard card elevation
  cardHover: baseShadows.md,      // Card hover state
  button: baseShadows.xs,         // Button elevation
  buttonPressed: baseShadows.none, // Button pressed state
  modal: baseShadows.xl,          // Modal overlay
  header: baseShadows.xs,         // Header elevation
  tabBar: baseShadows.sm,         // Tab bar elevation
  
  // Interactive shadows
  interactive: {
    rest: baseShadows.xs,         // Default interactive element
    hover: baseShadows.sm,        // Hover state
    pressed: baseShadows.none,    // Pressed state
    focus: baseShadows.md,        // Focus state
  },
  
  // Notification shadows
  notification: baseShadows.lg,   // Notification panel
  toast: baseShadows.md,          // Toast messages
  
  // Overlay shadows
  overlay: baseShadows.xl,        // Full screen overlays
  dropdown: baseShadows.lg,       // Dropdown menus
  tooltip: baseShadows.md,        // Tooltips
} as const;

// Platform-specific shadow adjustments
const getPlatformShadow = (shadow: ShadowStyle): ShadowStyle => {
  if (Platform.OS === 'android') {
    // Android uses elevation, reduce shadow opacity
    return {
      ...shadow,
      shadowOpacity: shadow.shadowOpacity * 0.5,
    };
  }
  return shadow;
};

// Export shadows with platform adjustments
export const shadows = {
  // Base shadows
  none: getPlatformShadow(baseShadows.none),
  xs: getPlatformShadow(baseShadows.xs),
  sm: getPlatformShadow(baseShadows.sm),
  md: getPlatformShadow(baseShadows.md),
  lg: getPlatformShadow(baseShadows.lg),
  xl: getPlatformShadow(baseShadows.xl),
  
  // Component-specific shadows
  card: getPlatformShadow(semanticShadows.card),
  cardHover: getPlatformShadow(semanticShadows.cardHover),
  button: getPlatformShadow(semanticShadows.button),
  buttonPressed: getPlatformShadow(semanticShadows.buttonPressed),
  modal: getPlatformShadow(semanticShadows.modal),
  header: getPlatformShadow(semanticShadows.header),
  tabBar: getPlatformShadow(semanticShadows.tabBar),
  
  // Interactive shadows
  interactive: {
    rest: getPlatformShadow(semanticShadows.interactive.rest),
    hover: getPlatformShadow(semanticShadows.interactive.hover),
    pressed: getPlatformShadow(semanticShadows.interactive.pressed),
    focus: getPlatformShadow(semanticShadows.interactive.focus),
  },
  
  // Notification shadows
  notification: getPlatformShadow(semanticShadows.notification),
  toast: getPlatformShadow(semanticShadows.toast),
  
  // Overlay shadows
  overlay: getPlatformShadow(semanticShadows.overlay),
  dropdown: getPlatformShadow(semanticShadows.dropdown),
  tooltip: getPlatformShadow(semanticShadows.tooltip),
} as const;

// Type definitions
export type ShadowKey = keyof typeof shadows;
export type SemanticShadowKey = keyof typeof semanticShadows;

// Helper functions
export const getShadow = (key: ShadowKey): ShadowStyle => {
  return shadows[key];
};

export const getSemanticShadow = (key: SemanticShadowKey): ShadowStyle | any => {
  return shadows[key];
};

// Shadow utilities for common patterns
export const shadowUtils = {
  // Create shadow styles for components
  card: () => shadows.card,
  cardHover: () => shadows.cardHover,
  button: () => shadows.button,
  modal: () => shadows.modal,
  
  // Create custom shadow with specific elevation
  custom: (elevation: number): ShadowStyle => {
    const baseOpacity = 0.1;
    const maxOpacity = 0.3;
    const opacity = Math.min(baseOpacity + (elevation * 0.02), maxOpacity);
    
    return getPlatformShadow({
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: opacity,
      shadowRadius: elevation * 2,
      elevation: elevation,
    });
  },
  
  // Combine multiple shadows (iOS only)
  combine: (...shadowKeys: ShadowKey[]): ShadowStyle => {
    if (Platform.OS === 'android') {
      // Android doesn't support multiple shadows, use the strongest one
      const strongestShadow = shadowKeys.reduce((strongest, current) => {
        const currentShadow = shadows[current];
        const strongestShadow = shadows[strongest];
        return currentShadow.elevation > strongestShadow.elevation ? current : strongest;
      });
      return shadows[strongestShadow];
    }
    
    // For iOS, we can only return one shadow, so use the strongest
    const strongestShadow = shadowKeys.reduce((strongest, current) => {
      const currentShadow = shadows[current];
      const strongestShadow = shadows[strongest];
      return currentShadow.shadowRadius > strongestShadow.shadowRadius ? current : strongest;
    });
    return shadows[strongestShadow];
  },
} as const;

// Elevation levels for consistent z-index management
export const elevationLevels = {
  background: 0,
  surface: 1,
  card: 2,
  button: 3,
  header: 10,
  tabBar: 10,
  modal: 100,
  overlay: 1000,
  toast: 2000,
} as const;

export type ElevationLevel = keyof typeof elevationLevels;