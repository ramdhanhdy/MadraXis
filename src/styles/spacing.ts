/**
 * Spacing Design Tokens
 * Consistent spacing scale for margins, padding, and gaps
 */

// Base Spacing Scale (in pixels)
// Following 8px grid system for consistent spacing
export const spacing = {
  xs: 4,   // Extra small spacing
  sm: 8,   // Small spacing
  md: 16,  // Medium spacing (base unit)
  lg: 24,  // Large spacing
  xl: 32,  // Extra large spacing
  '2xl': 48, // 2x extra large spacing
  '3xl': 64, // 3x extra large spacing
} as const;

// Semantic Spacing Mappings
export const semanticSpacing = {
  // Component Internal Spacing
  component: {
    xs: spacing.xs,   // 4px - minimal internal spacing
    sm: spacing.sm,   // 8px - small internal spacing
    md: spacing.md,   // 16px - standard internal spacing
    lg: spacing.lg,   // 24px - large internal spacing
  },
  
  // Layout Spacing
  layout: {
    xs: spacing.sm,   // 8px - tight layout spacing
    sm: spacing.md,   // 16px - standard layout spacing
    md: spacing.lg,   // 24px - comfortable layout spacing
    lg: spacing.xl,   // 32px - spacious layout spacing
    xl: spacing['2xl'], // 48px - section spacing
    '2xl': spacing['3xl'], // 64px - page spacing
  },
  
  // Container Padding
  container: {
    xs: spacing.sm,   // 8px - minimal container padding
    sm: spacing.md,   // 16px - standard container padding
    md: spacing.lg,   // 24px - comfortable container padding
    lg: spacing.xl,   // 32px - spacious container padding
  },
  
  // Card Spacing
  card: {
    xs: spacing.sm,   // 8px - minimal card padding
    sm: spacing.md,   // 16px - standard card padding
    md: spacing.lg,   // 24px - comfortable card padding
    lg: spacing.xl,   // 32px - spacious card padding
  },
  
  // Button Spacing
  button: {
    xs: spacing.xs,   // 4px - minimal button padding
    sm: spacing.sm,   // 8px - small button padding
    md: spacing.md,   // 16px - standard button padding
    lg: spacing.lg,   // 24px - large button padding
  },
  
  // Input Spacing
  input: {
    xs: spacing.sm,   // 8px - minimal input padding
    sm: spacing.md,   // 16px - standard input padding
    md: spacing.lg,   // 24px - comfortable input padding
  },
  
  // List Item Spacing
  listItem: {
    xs: spacing.sm,   // 8px - minimal list item padding
    sm: spacing.md,   // 16px - standard list item padding
    md: spacing.lg,   // 24px - comfortable list item padding
  },
} as const;

// Grid System Spacing
export const gridSpacing = {
  // Gap between grid items
  gap: {
    xs: spacing.xs,   // 4px
    sm: spacing.sm,   // 8px
    md: spacing.md,   // 16px
    lg: spacing.lg,   // 24px
  },
  
  // Column spacing
  column: {
    xs: spacing.sm,   // 8px
    sm: spacing.md,   // 16px
    md: spacing.lg,   // 24px
    lg: spacing.xl,   // 32px
  },
} as const;

// Screen Edge Spacing (safe areas)
export const screenSpacing = {
  horizontal: spacing.md, // 16px - standard horizontal screen padding
  vertical: spacing.lg,   // 24px - standard vertical screen padding
  top: spacing.lg,        // 24px - top safe area
  bottom: spacing.lg,     // 24px - bottom safe area
} as const;

// Component-specific Spacing Presets
export const componentSpacing = {
  // Header spacing
  header: {
    horizontal: spacing.md, // 16px
    vertical: spacing.md,   // 16px
    height: 60,             // Standard header height
  },
  
  // Tab bar spacing
  tabBar: {
    horizontal: spacing.sm, // 8px
    vertical: spacing.sm,   // 8px
    height: 60,             // Standard tab bar height
  },
  
  // Modal spacing
  modal: {
    padding: spacing.lg,    // 24px
    margin: spacing.md,     // 16px
    borderRadius: spacing.lg, // 24px (will be overridden by border radius tokens)
  },
  
  // Quick action grid
  quickAction: {
    gap: spacing.md,        // 16px - gap between quick actions
    padding: spacing.md,    // 16px - internal padding
  },
  
  // Welcome banner
  welcomeBanner: {
    padding: spacing.lg,    // 24px
    margin: spacing.md,     // 16px
  },
  
  // Section containers
  section: {
    marginBottom: spacing.lg, // 24px - space between sections
    padding: spacing.md,      // 16px - internal section padding
  },
} as const;

// Export all spacing tokens
export const spacingTokens = {
  base: spacing,
  semantic: semanticSpacing,
  grid: gridSpacing,
  screen: screenSpacing,
  component: componentSpacing,
} as const;

// Type definitions
export type SpacingKey = keyof typeof spacing;
export type SemanticSpacingCategory = keyof typeof semanticSpacing;
export type ComponentSpacingKey = keyof typeof componentSpacing;

// Helper functions
export const getSpacing = (size: SpacingKey): number => spacing[size];

export const getSemanticSpacing = (
  category: SemanticSpacingCategory,
  size: keyof typeof semanticSpacing[SemanticSpacingCategory]
): number => {
  return semanticSpacing[category][size as keyof typeof semanticSpacing[typeof category]];
};

// Spacing utilities for common patterns
export const spacingUtils = {
  // Create consistent margin/padding objects
  margin: (size: SpacingKey) => ({ margin: spacing[size] }),
  marginHorizontal: (size: SpacingKey) => ({ marginHorizontal: spacing[size] }),
  marginVertical: (size: SpacingKey) => ({ marginVertical: spacing[size] }),
  marginTop: (size: SpacingKey) => ({ marginTop: spacing[size] }),
  marginBottom: (size: SpacingKey) => ({ marginBottom: spacing[size] }),
  marginLeft: (size: SpacingKey) => ({ marginLeft: spacing[size] }),
  marginRight: (size: SpacingKey) => ({ marginRight: spacing[size] }),
  
  padding: (size: SpacingKey) => ({ padding: spacing[size] }),
  paddingHorizontal: (size: SpacingKey) => ({ paddingHorizontal: spacing[size] }),
  paddingVertical: (size: SpacingKey) => ({ paddingVertical: spacing[size] }),
  paddingTop: (size: SpacingKey) => ({ paddingTop: spacing[size] }),
  paddingBottom: (size: SpacingKey) => ({ paddingBottom: spacing[size] }),
  paddingLeft: (size: SpacingKey) => ({ paddingLeft: spacing[size] }),
  paddingRight: (size: SpacingKey) => ({ paddingRight: spacing[size] }),
} as const;