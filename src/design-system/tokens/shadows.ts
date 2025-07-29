/**
 * Shadow Design Tokens
 * Enhanced shadow system with elevation levels and semantic shadows
 * Migrated and enhanced from src/styles/shadows.ts
 */

// Base Shadow Definitions - Platform-specific shadows
export const baseShadows = {
  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // Small shadows
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Medium shadows
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Large shadows
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  '3xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

// Semantic Shadows - Context-aware shadow usage
export const semanticShadows = {
  // Interactive elements
  button: {
    default: baseShadows.sm,
    hover: baseShadows.md,
    pressed: baseShadows.xs,
    disabled: baseShadows.none,
  },
  
  // Content containers
  card: {
    default: baseShadows.md,
    hover: baseShadows.lg,
    selected: baseShadows.xl,
  },
  
  // Navigation elements
  header: baseShadows.sm,
  tabBar: baseShadows.sm,
  sidebar: baseShadows.lg,
  
  // Overlays
  modal: baseShadows['2xl'],
  dropdown: baseShadows.lg,
  tooltip: baseShadows.md,
  popover: baseShadows.xl,
  
  // Form elements
  input: {
    default: baseShadows.xs,
    focus: baseShadows.sm,
    error: {
      shadowColor: '#dc2626',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  },
  
  // Status indicators
  success: {
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warning: {
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  error: {
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

// Elevation Levels - Material Design inspired elevation system
export const elevationLevels = {
  // Surface levels
  surface: 0,           // Base surface
  raised: 1,            // Slightly raised elements
  overlay: 8,           // Overlays and modals
  modal: 16,            // Modal dialogs
  popover: 24,          // Popovers and tooltips
  toast: 32,            // Toast notifications
} as const;

// Role-specific shadow preferences
export const roleShadows = {
  student: {
    // Softer, more playful shadows
    card: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    button: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  teacher: {
    // Professional, subtle shadows
    card: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    },
    button: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
  },
  parent: {
    // Warm, comfortable shadows
    card: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 7,
      elevation: 3,
    },
    button: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.09,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  management: {
    // Sharp, authoritative shadows
    card: {
      shadowColor: '#E11D48',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    button: {
      shadowColor: '#E11D48',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 2,
    },
  },
} as const;

// Colored shadows for brand elements
export const coloredShadows = {
  // Primary brand shadows
  teal: {
    light: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    medium: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 5,
    },
  },
  
  // Success shadows
  green: {
    light: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  // Warning shadows
  amber: {
    light: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  // Error shadows
  red: {
    light: {
      shadowColor: '#E11D48',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
} as const;

// Inner shadows for inset effects
export const innerShadows = {
  // Inset effects (CSS only, not supported in React Native)
  inset: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    lg: 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
} as const;

// Glow effects for special states
export const glowShadows = {
  // Focus glow
  focus: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 0,
  },
  
  // Success glow
  success: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 0,
  },
  
  // Error glow
  error: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 0,
  },
} as const;

// Complete shadow system
export const shadows = {
  ...baseShadows,
  semantic: semanticShadows,
  elevation: elevationLevels,
  role: roleShadows,
  colored: coloredShadows,
  inner: innerShadows,
  glow: glowShadows,
} as const;

// Type definitions
export type BaseShadowKey = keyof typeof baseShadows;
export type SemanticShadowKey = keyof typeof semanticShadows;
export type ElevationLevel = keyof typeof elevationLevels;
export type RoleShadowKey = keyof typeof roleShadows;

export default shadows;
