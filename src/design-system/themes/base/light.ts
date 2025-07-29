/**
 * Light Base Theme Configuration
 * Comprehensive light theme using enhanced design tokens
 */

import { Theme } from '../../core/types';
import { 
  baseColors, 
  semanticColors, 
  roleColors, 
  contextualColors 
} from '../../tokens/colors';
import { 
  typography, 
  responsiveTypography 
} from '../../tokens/typography';
import { 
  spacingTokens, 
  contextualSpacing, 
  densitySpacing 
} from '../../tokens/spacing';
import { 
  shadows, 
  roleShadows 
} from '../../tokens/shadows';
import { 
  animations, 
  microInteractions, 
  performanceAnimations 
} from '../../tokens/animations';
import { 
  accessibility 
} from '../../tokens/accessibility';
import { 
  borderRadius, 
  duration, 
  easing, 
  nativeEasing, 
  breakpoints, 
  zIndex, 
  zIndexUtils, 
  elevationLevels 
} from '../../../styles/theme';

/**
 * Create component themes based on light theme colors
 */
function createLightComponentThemes() {
  return {
    button: {
      borderRadius: borderRadius.md,
      minHeight: {
        small: 32,
        medium: 40,
        large: 48,
      },
      padding: {
        small: { horizontal: 12, vertical: 6 },
        medium: { horizontal: 16, vertical: 8 },
        large: { horizontal: 20, vertical: 12 },
      },
      typography: {
        small: typography.variants.buttonSmall,
        medium: typography.variants.button,
        large: typography.variants.buttonLarge,
      },
    },
    card: {
      borderRadius: borderRadius.lg,
      padding: {
        none: 0,
        small: spacingTokens.base.sm,
        medium: spacingTokens.base.md,
        large: spacingTokens.base.lg,
      },
      backgroundColor: semanticColors.surface.primary,
      shadow: shadows.semantic.card.default,
    },
    modal: {
      borderRadius: borderRadius['2xl'],
      padding: spacingTokens.base.lg,
      backgroundColor: semanticColors.surface.primary,
      shadow: shadows.semantic.modal,
      backdropColor: 'rgba(0, 0, 0, 0.5)',
      maxHeight: '80%',
    },
    navigation: {
      backgroundColor: semanticColors.primary.main,
      accentColor: semanticColors.secondary.main,
      height: 60,
      padding: {
        horizontal: spacingTokens.base.md,
        vertical: spacingTokens.base.sm,
      },
    },
  };
}

/**
 * Light Base Theme - Foundation for all light themes
 */
export const lightBaseTheme: Theme = {
  colors: {
    // Primary and secondary colors (default to teal/gold)
    primary: {
      main: semanticColors.primary.main,
      light: semanticColors.primary.light,
      dark: semanticColors.primary.dark,
      contrast: semanticColors.primary.contrast,
    },
    secondary: {
      main: semanticColors.secondary.main,
      light: semanticColors.secondary.light,
      dark: semanticColors.secondary.dark,
      contrast: semanticColors.secondary.contrast,
    },
    
    // Status colors (shared across all themes)
    success: semanticColors.success,
    warning: semanticColors.warning,
    error: semanticColors.error,
    info: semanticColors.info,
    
    // Background colors
    background: semanticColors.background,
    
    // Surface colors
    surface: semanticColors.surface,
    
    // Text colors
    text: semanticColors.text,
    
    // Border colors
    border: semanticColors.border,
    
    // Interactive colors
    interactive: semanticColors.interactive,
    
    // Role-specific colors
    role: roleColors,
    
    // Base color palettes
    teal: baseColors.teal,
    gold: baseColors.gold,
    neutral: baseColors.neutral,
    white: baseColors.white,
    black: baseColors.black,
  },
  
  // Typography system
  typography,
  
  // Spacing system
  spacing: spacingTokens,
  
  // Shadow system
  shadows,
  
  // Border radius scale
  borderRadius,
  
  // Animation durations
  duration,
  
  // Easing functions
  easing,
  nativeEasing,
  
  // Responsive breakpoints
  breakpoints,
  
  // Z-index scale
  zIndex,
  zIndexUtils,
  
  // Elevation levels
  elevationLevels,
  
  // Enhanced animation tokens
  animations,
  
  // Accessibility tokens
  accessibility,
  
  // Component themes
  componentThemes: createLightComponentThemes(),
};

/**
 * Light theme with enhanced features
 */
export const enhancedLightTheme: Theme = {
  ...lightBaseTheme,
  
  // Enhanced colors with contextual mappings
  colors: {
    ...lightBaseTheme.colors,
    
    // Add contextual colors
    status: contextualColors.status,
    interactive: {
      ...lightBaseTheme.colors.interactive,
      ...contextualColors.interactive,
    },
    dataViz: contextualColors.dataViz,
  },
  
  // Enhanced spacing with contextual and density options
  spacing: {
    ...spacingTokens,
    contextual: contextualSpacing,
    density: densitySpacing,
  },
  
  // Enhanced typography with responsive scales
  typography: {
    ...typography,
    responsive: responsiveTypography,
  },
  
  // Enhanced animations with micro-interactions
  animations: {
    ...animations,
    microInteractions,
    performance: performanceAnimations,
  },
  
  // Enhanced shadows with role-specific options
  shadows: {
    ...shadows,
    role: roleShadows,
  },
} as Theme;

export default enhancedLightTheme;
