/**
 * Spacing Design Tokens
 * Enhanced spacing system with semantic naming and component-specific spacing
 * Migrated and enhanced from src/styles/spacing.ts
 */

// Base Spacing Scale - 4px base unit for consistency
export const baseSpacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
  '8xl': 128,
  '9xl': 160,
} as const;

// Semantic Spacing - Context-aware spacing values
export const semanticSpacing = {
  // Content spacing
  content: {
    tight: baseSpacing.sm,      // 8px - Tight content spacing
    normal: baseSpacing.md,     // 16px - Normal content spacing
    loose: baseSpacing.lg,      // 24px - Loose content spacing
  },
  
  // Layout spacing
  layout: {
    section: baseSpacing.xl,    // 32px - Between major sections
    container: baseSpacing.lg,  // 24px - Container padding
    grid: baseSpacing.md,       // 16px - Grid gaps
  },
  
  // Interactive spacing
  interactive: {
    button: baseSpacing.sm,     // 8px - Button internal padding
    input: baseSpacing.md,      // 16px - Input field padding
    card: baseSpacing.lg,       // 24px - Card internal padding
  },
  
  // Navigation spacing
  navigation: {
    item: baseSpacing.md,       // 16px - Navigation item spacing
    group: baseSpacing.lg,      // 24px - Navigation group spacing
    level: baseSpacing.xl,      // 32px - Navigation level spacing
  },
} as const;

// Component-specific Spacing
export const componentSpacing = {
  // Header component
  header: {
    height: 60,
    horizontal: baseSpacing.md,
    vertical: baseSpacing.sm,
    title: baseSpacing.md,
  },
  
  // Tab bar component
  tabBar: {
    height: 60,
    horizontal: baseSpacing.md,
    vertical: baseSpacing.sm,
    item: baseSpacing.md,
  },
  
  // Modal component
  modal: {
    padding: baseSpacing.lg,
    margin: baseSpacing.md,
    backdrop: baseSpacing.none,
  },
  
  // Card component
  card: {
    padding: {
      small: baseSpacing.md,
      medium: baseSpacing.lg,
      large: baseSpacing.xl,
    },
    margin: baseSpacing.md,
    gap: baseSpacing.sm,
  },
  
  // Button component
  button: {
    padding: {
      small: { horizontal: baseSpacing.md, vertical: baseSpacing.xs },
      medium: { horizontal: baseSpacing.lg, vertical: baseSpacing.sm },
      large: { horizontal: baseSpacing.xl, vertical: baseSpacing.md },
    },
    margin: baseSpacing.sm,
    gap: baseSpacing.xs,
  },
  
  // Input component
  input: {
    padding: {
      horizontal: baseSpacing.md,
      vertical: baseSpacing.sm,
    },
    margin: baseSpacing.sm,
    label: baseSpacing.xs,
    error: baseSpacing.xs,
  },
  
  // List component
  list: {
    item: {
      padding: baseSpacing.md,
      margin: baseSpacing.xs,
      gap: baseSpacing.sm,
    },
    section: {
      padding: baseSpacing.lg,
      margin: baseSpacing.md,
      header: baseSpacing.sm,
    },
  },
  
  // Form component
  form: {
    field: baseSpacing.lg,
    group: baseSpacing.xl,
    section: baseSpacing['2xl'],
    actions: baseSpacing.lg,
  },
  
  // Dashboard component
  dashboard: {
    widget: {
      padding: baseSpacing.lg,
      margin: baseSpacing.md,
      gap: baseSpacing.md,
    },
    grid: {
      gap: baseSpacing.md,
      margin: baseSpacing.lg,
    },
  },
} as const;

// Role-specific spacing preferences
export const roleSpacing = {
  student: {
    // More generous spacing for easier interaction
    base: baseSpacing.lg,
    card: baseSpacing.xl,
    button: baseSpacing.md,
    content: baseSpacing.lg,
  },
  teacher: {
    // Balanced spacing for professional use
    base: baseSpacing.md,
    card: baseSpacing.lg,
    button: baseSpacing.sm,
    content: baseSpacing.md,
  },
  parent: {
    // Comfortable spacing for family use
    base: baseSpacing.lg,
    card: baseSpacing.lg,
    button: baseSpacing.md,
    content: baseSpacing.lg,
  },
  management: {
    // Compact spacing for efficiency
    base: baseSpacing.sm,
    card: baseSpacing.md,
    button: baseSpacing.xs,
    content: baseSpacing.sm,
  },
} as const;

// Responsive spacing - Adapts to screen size
export const responsiveSpacing = {
  // Mobile-first approach
  mobile: {
    container: baseSpacing.md,
    section: baseSpacing.lg,
    content: baseSpacing.md,
  },
  
  // Tablet spacing
  tablet: {
    container: baseSpacing.lg,
    section: baseSpacing.xl,
    content: baseSpacing.lg,
  },
  
  // Desktop spacing
  desktop: {
    container: baseSpacing.xl,
    section: baseSpacing['2xl'],
    content: baseSpacing.xl,
  },
} as const;

// Accessibility spacing - Enhanced for touch targets
export const accessibilitySpacing = {
  // Minimum touch target spacing
  touchTarget: {
    minimum: 44,      // WCAG minimum
    comfortable: 48,  // Comfortable size
    large: 56,        // Large for accessibility
  },
  
  // Focus ring spacing
  focusRing: {
    offset: 2,
    width: 2,
  },
  
  // Text spacing for readability
  text: {
    paragraph: baseSpacing.md,
    line: baseSpacing.xs,
    word: 4,
  },
} as const;

// Grid system spacing
export const gridSpacing = {
  // Column gaps
  columns: {
    tight: baseSpacing.sm,
    normal: baseSpacing.md,
    loose: baseSpacing.lg,
  },
  
  // Row gaps
  rows: {
    tight: baseSpacing.sm,
    normal: baseSpacing.md,
    loose: baseSpacing.lg,
  },
  
  // Container spacing
  container: {
    mobile: baseSpacing.md,
    tablet: baseSpacing.lg,
    desktop: baseSpacing.xl,
  },
} as const;

// Animation spacing - For motion design
export const animationSpacing = {
  // Transform distances
  transform: {
    small: baseSpacing.xs,
    medium: baseSpacing.sm,
    large: baseSpacing.md,
  },
  
  // Stagger delays (in ms)
  stagger: {
    fast: 50,
    normal: 100,
    slow: 200,
  },
} as const;

// Complete spacing system
export const spacingTokens = {
  base: baseSpacing,
  semantic: semanticSpacing,
  component: componentSpacing,
  role: roleSpacing,
  responsive: responsiveSpacing,
  accessibility: accessibilitySpacing,
  grid: gridSpacing,
  animation: animationSpacing,
} as const;

// Legacy exports for backward compatibility
export const spacing = baseSpacing;

// Type definitions
export type BaseSpacingKey = keyof typeof baseSpacing;
export type SemanticSpacingKey = keyof typeof semanticSpacing;
export type ComponentSpacingKey = keyof typeof componentSpacing;
export type RoleSpacingKey = keyof typeof roleSpacing;

export default spacingTokens;
