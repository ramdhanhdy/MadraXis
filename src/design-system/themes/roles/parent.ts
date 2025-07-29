/**
 * Parent Theme Configuration
 * Amber primary theme - trusting, family-first design
 */

import { Theme, ThemeConfig } from '../../core/types';
import { deepMerge } from '../../core/utils';
import { enhancedLightTheme, enhancedDarkTheme } from '../base';
import { sharedThemeCustomizations } from '../shared/default';
import { baseColors } from '../../tokens/colors';

/**
 * Parent-specific theme customizations
 */
export const parentThemeCustomizations = {
  // Parent brand colors - Amber primary (#FBBF24)
  colors: {
    primary: {
      main: '#FBBF24',      // Parent primary amber
      light: '#FCD34D',     // Lighter amber
      dark: '#D97706',      // Darker amber
      contrast: '#FFFFFF',  // White text
    },
    secondary: {
      main: '#FDE68A',      // Light amber accent
      light: '#FEF3C7',     // Very light amber
      dark: '#FBBF24',      // Medium amber
      contrast: '#92400E',  // Dark amber for contrast
    },
    accent: {
      main: '#FFFBEB',      // Amber 50 for subtle accents
      emphasis: '#FEF3C7',  // Amber 100 for emphasis
    },
  },
  
  // Parent-specific component styling
  components: {
    // Comfortable button styling
    button: {
      borderRadius: 6,      // 6px rounded corners - friendly but not too playful
      shadow: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.09,
        shadowRadius: 4,
        elevation: 3,
      },
      hover: {
        transform: [{ scale: 1 }, { scale: 1.01 }],
        shadowOpacity: 0.12,
      },
    },
    
    // Warm card styling
    card: {
      borderRadius: 10,     // Comfortable rounding for family feel
      elevation: 3,         // 3dp elevation
      shadow: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 7,
        elevation: 3,
      },
      hover: {
        elevation: 4,
        shadowOpacity: 0.09,
      },
    },
    
    // Dashboard styling
    dashboard: {
      backgroundColor: '#FFFBEB', // Amber 50 background
      cardStyle: 'warm',
      primaryAction: '#FBBF24',
      accentColor: '#FDE68A',
    },
    
    // Navigation styling
    navigation: {
      backgroundColor: '#FBBF24',
      accentColor: '#FDE68A',
      activeIndicator: '#FCD34D',
      textColor: '#92400E',   // Dark amber for better contrast
    },
    
    // Family-specific components
    family: {
      childCardBackground: '#FEF3C7',
      scheduleBackground: '#FFFBEB',
      notificationColor: '#F59E0B',
      urgentColor: '#DC2626',
      calendarAccent: '#FBBF24',
      progressColor: '#10B981',
    },
  },
  
  // Parent-specific animations - gentle and comfortable
  animations: {
    defaultDuration: 250,
    defaultEasing: 'ease-in-out', // Gentle, comfortable animations
    microInteractions: {
      buttonPress: {
        transform: [{ scale: 1 }, { scale: 0.99 }],
        duration: 200,
        easing: 'ease-in-out',
      },
      cardHover: {
        opacity: [1, 0.95],
        shadowOpacity: [0.07, 0.09],
        duration: 250,
        easing: 'ease-in-out',
      },
      slideTransition: {
        transform: [{ translateX: 10 }, { translateX: 0 }],
        opacity: [0, 1],
        duration: 250,
        easing: 'ease-out',
      },
    },
  },
  
  // Parent-specific spacing - comfortable and family-friendly
  spacing: {
    cardPadding: 20,        // Comfortable spacing
    buttonPadding: 16,      // Generous button padding
    contentSpacing: 20,     // Comfortable content spacing
    sectionSpacing: 28,     // Clear section separation
    familyGutter: 20,       // Family-friendly layout spacing
  },
  
  // Parent accessibility preferences
  accessibility: {
    minTouchTarget: 48,     // Larger touch targets for comfort
    focusRing: {
      width: 2,
      offset: 2,
      color: '#FCD34D',     // Light amber for visibility
    },
    animations: {
      reducedMotion: false,
      duration: 250,        // Comfortable timing
    },
    family: {
      highContrast: false,  // Comfortable contrast
      largeText: true,      // Slightly larger text for readability
      colorCoding: true,    // Use colors for child identification
    },
  },
} as const;

/**
 * Light Parent Theme
 */
export const lightParentTheme: Theme = deepMerge(
  enhancedLightTheme,
  sharedThemeCustomizations,
  parentThemeCustomizations,
  {
    // Override specific colors for light mode
    colors: {
      background: {
        primary: '#FFFBEB',   // Amber 50 - warm background
        secondary: '#FFFFFF', // White
        tertiary: '#FEF3C7',  // Amber 100
      },
      surface: {
        primary: '#FFFFFF',   // White cards
        secondary: '#FFFBEB', // Amber 50
        tertiary: '#FEF3C7',  // Amber 100
      },
      interactive: {
        hover: '#FEF3C7',     // Amber 100
        pressed: '#FDE68A',   // Amber 200
        focus: '#FCD34D',     // Amber 300
        disabled: '#FFFBEB',  // Amber 50
      },
      
      // Warning color aligned with parent theme
      warning: {
        main: '#F59E0B',      // Consistent with primary palette
        light: '#FBBF24',
        dark: '#D97706',
        contrast: '#FFFFFF',
      },
    },
  }
);

/**
 * Dark Parent Theme
 */
export const darkParentTheme: Theme = deepMerge(
  enhancedDarkTheme,
  sharedThemeCustomizations,
  parentThemeCustomizations,
  {
    // Override colors for dark mode
    colors: {
      primary: {
        main: '#FBBF24',      // Keep amber bright for dark backgrounds
        light: '#FCD34D',     // Brighter amber
        dark: '#F59E0B',      // Original amber
        contrast: '#78350F',  // Dark amber for contrast
      },
      secondary: {
        main: '#FDE68A',      // Light amber
        light: '#FEF3C7',     // Very light amber
        dark: '#FBBF24',      // Medium amber
        contrast: '#78350F',  // Dark amber
      },
      background: {
        primary: '#78350F',   // Dark amber background
        secondary: '#92400E', // Slightly lighter
        tertiary: '#B45309',  // Medium dark amber
      },
      surface: {
        primary: '#92400E',   // Dark amber surface
        secondary: '#B45309', // Medium dark amber
        tertiary: '#D97706',  // Lighter dark amber
      },
    },
    
    // Adjust component themes for dark mode
    components: {
      navigation: {
        backgroundColor: '#92400E',
        accentColor: '#FDE68A',
        activeIndicator: '#FBBF24',
        textColor: '#FEF3C7',
      },
      dashboard: {
        backgroundColor: '#78350F',
        cardStyle: 'warm',
        primaryAction: '#FBBF24',
        accentColor: '#FDE68A',
      },
      family: {
        childCardBackground: '#B45309',
        scheduleBackground: '#92400E',
        notificationColor: '#FBBF24',
        urgentColor: '#F87171',
        calendarAccent: '#FCD34D',
        progressColor: '#4ADE80',
      },
    },
  }
);

/**
 * Parent theme configuration for createTheme
 */
export const parentThemeConfig: ThemeConfig = {
  strategy: 'role-based',
  baseTheme: 'light',
  roleOverrides: parentThemeCustomizations,
};

/**
 * Create parent theme with color scheme
 */
export function createParentTheme(colorScheme: 'light' | 'dark' = 'light'): Theme {
  return colorScheme === 'dark' ? darkParentTheme : lightParentTheme;
}

/**
 * Parent theme metadata
 */
export const parentThemeMetadata = {
  name: 'Parent Theme',
  description: 'Warm, family-first theme with amber primary colors for trust and comfort',
  primaryColor: '#FBBF24',
  personality: 'warm',
  targetAudience: 'parents',
  designPrinciples: [
    'Trusting and family-first approach',
    'Warm, comfortable color palette',
    'Gentle, comfortable animations',
    'Generous spacing for easy interaction',
    'Family-oriented component design',
  ],
} as const;

// Export default light theme
export default lightParentTheme;
