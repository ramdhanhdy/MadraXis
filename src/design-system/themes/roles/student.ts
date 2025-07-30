/**
 * Student Theme Configuration
 * Teal primary theme - energetic, Gen-Z friendly design
 */

import { Theme, ThemeConfig } from '../../core/types';
import { deepMerge } from '../../core/utils';
import { enhancedLightTheme, enhancedDarkTheme } from '../base';
import { sharedThemeCustomizations } from '../shared/default';
import { baseColors } from '../../tokens/colors';
import { animations } from '../../tokens/animations';

/**
 * Student-specific theme customizations
 */
export const studentThemeCustomizations = {
  // Student brand colors - Teal primary (#14B8A6)
  colors: {
    primary: {
      main: '#14B8A6',      // Student primary
      light: '#2DD4BF',     // Lighter teal
      dark: '#0D9488',      // Darker teal
      contrast: '#FFFFFF',  // White text
    },
    secondary: {
      main: '#5EEAD4',      // Light teal accent
      light: '#99F6E4',     // Very light teal
      dark: '#2DD4BF',      // Medium teal
      contrast: '#FFFFFF',  // White text
    },
    accent: {
      main: '#F0FDFA',      // Teal 50 for subtle accents
      emphasis: '#CCFBF1',  // Teal 100 for emphasis
    },
  },
  
  // Student-specific component styling
  components: {
    // Energetic button styling
    button: {
      borderRadius: 8,      // 8px rounded corners
      shadow: {
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      hover: {
        transform: [{ scale: 1 }, { scale: 1.02 }],
        shadowOpacity: 0.15,
      },
    },
    
    // Elevated card styling
    card: {
      borderRadius: 12,     // More rounded for friendly feel
      elevation: 4,         // 4dp elevation
      shadow: {
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
      hover: {
        elevation: 6,
        transform: [{ translateY: 0 }, { translateY: -2 }],
      },
    },
    
    // Dashboard styling
    dashboard: {
      backgroundColor: '#F0FDFA', // Teal 50 background
      cardStyle: 'elevated',
      primaryAction: '#14B8A6',
      accentColor: '#5EEAD4',
    },
    
    // Navigation styling
    navigation: {
      backgroundColor: '#14B8A6',
      accentColor: '#5EEAD4',
      activeIndicator: '#2DD4BF',
      textColor: '#FFFFFF',
    },
  },
  
  // Student-specific animations - bouncy and energetic
  animations: {
    defaultDuration: 300,
    defaultEasing: 'spring',    // Bouncy animations
    microInteractions: {
      buttonPress: {
        transform: [{ scale: 1 }, { scale: 0.95 }, { scale: 1.02 }, { scale: 1 }],
        duration: 300,
        easing: 'spring',
      },
      cardHover: {
        transform: [{ scale: 1 }, { scale: 1.02 }],
        shadowOpacity: [0.08, 0.12],
        duration: 200,
        easing: 'spring',
      },
    },
  },
  
  // Student-specific spacing - generous for easy interaction
  spacing: {
    cardPadding: 24,        // lg spacing
    buttonPadding: 16,      // md spacing
    contentSpacing: 24,     // lg spacing
    sectionSpacing: 32,     // xl spacing
  },
  
  // Student accessibility preferences
  accessibility: {
    minTouchTarget: 48,     // Comfortable touch targets
    focusRing: {
      width: 3,
      offset: 2,
      color: '#2DD4BF',     // Bright teal for visibility
    },
    animations: {
      reducedMotion: false, // Students typically prefer animations
      duration: 300,
    },
  },
} as const;

/**
 * Light Student Theme
 */
export const lightStudentTheme: Theme = deepMerge(
  enhancedLightTheme,
  sharedThemeCustomizations,
  studentThemeCustomizations,
  {
    // Override specific colors for light mode
    colors: {
      background: {
        primary: '#F0FDFA',   // Teal 50 - subtle teal background
        secondary: '#FFFFFF', // White
        tertiary: '#CCFBF1',  // Teal 100
      },
      surface: {
        primary: '#FFFFFF',   // White cards
        secondary: '#F0FDFA', // Teal 50
        tertiary: '#CCFBF1',  // Teal 100
      },
      interactive: {
        hover: '#CCFBF1',     // Teal 100
        pressed: '#99F6E4',   // Teal 200
        focus: '#5EEAD4',     // Teal 300
        disabled: '#F0FDFA',  // Teal 50
      },
    },
  }
);

/**
 * Dark Student Theme
 */
export const darkStudentTheme: Theme = deepMerge(
  enhancedDarkTheme,
  sharedThemeCustomizations,
  studentThemeCustomizations,
  {
    // Override colors for dark mode
    colors: {
      primary: {
        main: '#2DD4BF',      // Brighter teal for dark backgrounds
        light: '#5EEAD4',     // Even brighter
        dark: '#14B8A6',      // Original teal
        contrast: '#134E4A',  // Dark teal for contrast
      },
      secondary: {
        main: '#5EEAD4',      // Light teal
        light: '#99F6E4',     // Very light teal
        dark: '#2DD4BF',      // Medium teal
        contrast: '#134E4A',  // Dark teal
      },
      background: {
        primary: '#134E4A',   // Dark teal background
        secondary: '#115E59', // Slightly lighter
        tertiary: '#0F766E',  // Medium dark teal
      },
      surface: {
        primary: '#115E59',   // Dark teal surface
        secondary: '#0F766E', // Medium dark teal
        tertiary: '#0D9488',  // Lighter dark teal
      },
    },
    
    // Adjust component themes for dark mode
    components: {
      navigation: {
        backgroundColor: '#115E59',
        accentColor: '#5EEAD4',
        activeIndicator: '#2DD4BF',
        textColor: '#F0FDFA',
      },
      dashboard: {
        backgroundColor: '#134E4A',
        cardStyle: 'elevated',
        primaryAction: '#2DD4BF',
        accentColor: '#5EEAD4',
      },
    },
  }
);

/**
 * Student theme configuration for createTheme
 */
export const studentThemeConfig: ThemeConfig = {
  strategy: 'role-based',
  baseTheme: 'light',
  roleOverrides: studentThemeCustomizations,
};

/**
 * Create student theme with color scheme
 */
export function createStudentTheme(colorScheme: 'light' | 'dark' = 'light'): Theme {
  return colorScheme === 'dark' ? darkStudentTheme : lightStudentTheme;
}

/**
 * Student theme metadata
 */
export const studentThemeMetadata = {
  name: 'Student Theme',
  description: 'Energetic, Gen-Z friendly theme with teal primary colors',
  primaryColor: '#14B8A6',
  personality: 'energetic',
  targetAudience: 'students',
  designPrinciples: [
    'Energetic and engaging',
    'Gen-Z friendly aesthetics',
    'Bouncy micro-animations',
    'Generous spacing for easy interaction',
    'Elevated card design',
  ],
} as const;

// Export default light theme
export default lightStudentTheme;
