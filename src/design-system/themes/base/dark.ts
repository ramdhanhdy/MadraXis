/**
 * Dark Base Theme Configuration
 * Comprehensive dark theme using enhanced design tokens with optimized contrast
 */

import { Theme } from '../../core/types';
import { deepMerge } from '../../core/utils';
import { enhancedLightTheme } from './light';
import { 
  baseColors, 
  darkModeColors, 
  contextualColors 
} from '../../tokens/colors';
import { 
  spacingTokens 
} from '../../tokens/spacing';
import { 
  shadows 
} from '../../tokens/shadows';
import { 
  borderRadius 
} from '../../../styles/theme';

/**
 * Create component themes optimized for dark mode
 */
function createDarkComponentThemes() {
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
        small: enhancedLightTheme.typography.variants.buttonSmall,
        medium: enhancedLightTheme.typography.variants.button,
        large: enhancedLightTheme.typography.variants.buttonLarge,
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
      backgroundColor: darkModeColors.surface.primary,
      shadow: {
        ...shadows.semantic.card.default,
        shadowColor: '#000000',
        shadowOpacity: 0.3, // Increased for dark mode visibility
      },
    },
    modal: {
      borderRadius: borderRadius['2xl'],
      padding: spacingTokens.base.lg,
      backgroundColor: darkModeColors.surface.primary,
      shadow: {
        ...shadows.semantic.modal,
        shadowColor: '#000000',
        shadowOpacity: 0.4, // Increased for dark mode
      },
      backdropColor: 'rgba(0, 0, 0, 0.8)', // Darker backdrop
      maxHeight: '80%',
    },
    navigation: {
      backgroundColor: darkModeColors.surface.secondary,
      accentColor: darkModeColors.role.student.primary, // Default to student accent
      height: 60,
      padding: {
        horizontal: spacingTokens.base.md,
        vertical: spacingTokens.base.sm,
      },
    },
  };
}

/**
 * Dark mode status colors with adjusted contrast
 */
const darkModeStatusColors = {
  success: {
    subtle: baseColors.success[900],
    muted: baseColors.success[800],
    default: baseColors.success[400], // Brighter for dark backgrounds
    emphasis: baseColors.success[300],
    strong: baseColors.success[200],
  },
  warning: {
    subtle: baseColors.warning[900],
    muted: baseColors.warning[800],
    default: baseColors.warning[400],
    emphasis: baseColors.warning[300],
    strong: baseColors.warning[200],
  },
  error: {
    subtle: baseColors.error[900],
    muted: baseColors.error[800],
    default: baseColors.error[400],
    emphasis: baseColors.error[300],
    strong: baseColors.error[200],
  },
  info: {
    subtle: baseColors.teal[900],
    muted: baseColors.teal[800],
    default: baseColors.teal[400],
    emphasis: baseColors.teal[300],
    strong: baseColors.teal[200],
  },
};

/**
 * Dark mode interactive colors
 */
const darkModeInteractiveColors = {
  default: baseColors.neutral[800],
  hover: baseColors.neutral[700],
  active: baseColors.neutral[600],
  pressed: baseColors.neutral[500],
  disabled: baseColors.neutral[700],
  focus: baseColors.teal[400], // Brighter focus for visibility
};

/**
 * Dark Base Theme - Foundation for all dark themes
 */
export const darkBaseTheme: Theme = deepMerge(enhancedLightTheme, {
  colors: {
    // Primary colors remain role-specific (will be overridden)
    primary: {
      main: baseColors.teal[400], // Brighter for dark mode
      light: baseColors.teal[300],
      dark: baseColors.teal[500],
      contrast: baseColors.neutral[900],
    },
    secondary: {
      main: baseColors.gold[400],
      light: baseColors.gold[300],
      dark: baseColors.gold[500],
      contrast: baseColors.neutral[900],
    },
    
    // Status colors optimized for dark mode
    success: {
      main: baseColors.success[400],
      light: baseColors.success[300],
      dark: baseColors.success[500],
      contrast: baseColors.neutral[900],
    },
    warning: {
      main: baseColors.warning[400],
      light: baseColors.warning[300],
      dark: baseColors.warning[500],
      contrast: baseColors.neutral[900],
    },
    error: {
      main: baseColors.error[400],
      light: baseColors.error[300],
      dark: baseColors.error[500],
      contrast: baseColors.neutral[900],
    },
    info: {
      main: baseColors.teal[400],
      light: baseColors.teal[300],
      dark: baseColors.teal[500],
      contrast: baseColors.neutral[900],
    },
    
    // Dark mode specific colors
    background: darkModeColors.background,
    surface: darkModeColors.surface,
    text: darkModeColors.text,
    border: darkModeColors.border,
    interactive: darkModeInteractiveColors,
    
    // Role colors optimized for dark mode
    role: darkModeColors.role,
    
    // Enhanced contextual colors for dark mode
    status: darkModeStatusColors,
    dataViz: {
      primary: [
        baseColors.teal[400],
        baseColors.green[400],
        baseColors.amber[400],
        baseColors.rose[400],
      ],
      sequential: [
        baseColors.teal[200],
        baseColors.teal[300],
        baseColors.teal[400],
        baseColors.teal[500],
        baseColors.teal[600],
      ],
      diverging: [
        baseColors.rose[400],
        baseColors.rose[300],
        baseColors.neutral[500],
        baseColors.teal[300],
        baseColors.teal[400],
      ],
    },
  },
  
  // Component themes optimized for dark mode
  componentThemes: createDarkComponentThemes(),
});

/**
 * Enhanced dark theme with all features
 */
export const enhancedDarkTheme: Theme = {
  ...darkBaseTheme,
  
  // Enhanced animations with reduced motion considerations for dark mode
  animations: {
    ...darkBaseTheme.animations,
    
    // Slightly slower animations for dark mode (easier on the eyes)
    duration: {
      instant: 0,
      fast: 200, // Slightly slower than light mode
      normal: 350,
      slow: 550,
      slower: 800,
      slowest: 1100,
    },
  },
  
  // Enhanced accessibility for dark mode
  accessibility: {
    ...darkBaseTheme.accessibility,
    
    // Enhanced contrast requirements for dark mode
    contrast: {
      minimum: 4.5,
      enhanced: 8.0,
      aa: {
        normal: 4.5,
        large: 3.0,
        nonText: 3.0,
      },
      aaa: {
        normal: 7.0,
        large: 4.5,
        nonText: 3.0,
      },
      enhancedLevels: {
        normal: 8.0, // Higher for dark mode
        large: 5.5,  // Higher for dark mode
        nonText: 4.5,
      },
    },
    
    // Dark mode specific focus ring
    focusRing: {
      width: 2,
      offset: 2,
      color: baseColors.teal[400], // Brighter for dark mode
    },

    // Reduced motion for dark mode
    reducedMotion: {
      duration: 0,
      easing: 'linear',
    },
  },
} as Theme;

export default enhancedDarkTheme;
