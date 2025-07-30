/**
 * Teacher Theme Configuration
 * Green primary theme - calm authority, classroom clarity
 */

import { Theme, ThemeConfig } from '../../core/types';
import { deepMerge } from '../../core/utils';
import { enhancedLightTheme, enhancedDarkTheme } from '../base';
import { sharedThemeCustomizations } from '../shared/default';
import { baseColors } from '../../tokens/colors';

/**
 * Teacher-specific theme customizations
 */
export const teacherThemeCustomizations = {
  // Teacher brand colors - Green primary (#10B981)
  colors: {
    primary: {
      main: '#10B981',      // Teacher primary green
      light: '#4ADE80',     // Lighter green
      dark: '#059669',      // Darker green
      contrast: '#FFFFFF',  // White text
    },
    secondary: {
      main: '#86EFAC',      // Light green accent
      light: '#BBF7D0',     // Very light green
      dark: '#4ADE80',      // Medium green
      contrast: '#FFFFFF',  // White text
    },
    accent: {
      main: '#F0FDF4',      // Green 50 for subtle accents
      emphasis: '#DCFCE7',  // Green 100 for emphasis
    },
  },
  
  // Teacher-specific component styling
  components: {
    // Professional button styling
    button: {
      borderRadius: 4,      // 4px rounded corners - professional
      shadow: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      },
      hover: {
        transform: [{ scale: 1 }, { scale: 1.01 }],
        shadowOpacity: 0.12,
      },
    },
    
    // Clean card styling
    card: {
      borderRadius: 8,      // Moderate rounding for professional feel
      elevation: 3,         // 3dp elevation
      shadow: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
      },
      hover: {
        elevation: 4,
        shadowOpacity: 0.08,
      },
    },
    
    // Dashboard styling
    dashboard: {
      backgroundColor: '#F0FDF4', // Green 50 background
      cardStyle: 'clean',
      primaryAction: '#10B981',
      accentColor: '#86EFAC',
    },
    
    // Navigation styling
    navigation: {
      backgroundColor: '#10B981',
      accentColor: '#86EFAC',
      activeIndicator: '#4ADE80',
      textColor: '#FFFFFF',
    },
    
    // Classroom-specific components
    classroom: {
      headerColor: '#10B981',
      sectionDivider: '#DCFCE7',
      studentListBackground: '#F0FDF4',
      gradeColors: {
        excellent: '#10B981',
        good: '#4ADE80',
        average: '#86EFAC',
        needsImprovement: '#FCD34D',
        poor: '#F87171',
      },
    },
  },
  
  // Teacher-specific animations - smooth and professional
  animations: {
    defaultDuration: 200,
    defaultEasing: 'ease-out',  // Smooth, professional animations
    microInteractions: {
      buttonPress: {
        transform: [{ scale: 1 }, { scale: 0.98 }],
        duration: 150,
        easing: 'ease-in',
      },
      cardHover: {
        transform: [{ scale: 1 }, { scale: 1.01 }],
        shadowOpacity: [0.06, 0.08],
        duration: 200,
        easing: 'ease-out',
      },
      fadeTransition: {
        opacity: [0, 1],
        duration: 200,
        easing: 'ease-out',
      },
    },
  },
  
  // Teacher-specific spacing - balanced and organized
  spacing: {
    cardPadding: 20,        // Balanced spacing
    buttonPadding: 12,      // Compact but comfortable
    contentSpacing: 16,     // Standard spacing
    sectionSpacing: 24,     // Clear section separation
    classroomGutter: 24,    // Spacious classroom layout
  },
  
  // Teacher accessibility preferences
  accessibility: {
    minTouchTarget: 44,     // Standard touch targets
    focusRing: {
      width: 2,
      offset: 2,
      color: '#4ADE80',     // Light green for visibility
    },
    animations: {
      reducedMotion: false,
      duration: 200,        // Faster, more efficient
    },
    classroom: {
      highContrast: true,   // Important for classroom visibility
      largeText: false,     // Standard text sizes
      colorCoding: true,    // Use colors for organization
    },
  },
} as const;

/**
 * Light Teacher Theme
 */
export const lightTeacherTheme: Theme = deepMerge(
  enhancedLightTheme,
  sharedThemeCustomizations,
  teacherThemeCustomizations,
  {
    // Override specific colors for light mode
    colors: {
      background: {
        primary: '#F0FDF4',   // Green 50 - subtle green background
        secondary: '#FFFFFF', // White
        tertiary: '#DCFCE7',  // Green 100
      },
      surface: {
        primary: '#FFFFFF',   // White cards
        secondary: '#F0FDF4', // Green 50
        tertiary: '#DCFCE7',  // Green 100
      },
      interactive: {
        hover: '#DCFCE7',     // Green 100
        pressed: '#BBF7D0',   // Green 200
        focus: '#86EFAC',     // Green 300
        disabled: '#F0FDF4',  // Green 50
      },
      
      // Success color aligned with teacher theme
      success: {
        main: '#10B981',      // Same as primary for consistency
        light: '#4ADE80',
        dark: '#059669',
        contrast: '#FFFFFF',
      },
    },
  }
);

/**
 * Dark Teacher Theme
 */
export const darkTeacherTheme: Theme = deepMerge(
  enhancedDarkTheme,
  sharedThemeCustomizations,
  teacherThemeCustomizations,
  {
    // Override colors for dark mode
    colors: {
      primary: {
        main: '#4ADE80',      // Brighter green for dark backgrounds
        light: '#86EFAC',     // Even brighter
        dark: '#10B981',      // Original green
        contrast: '#064E3B',  // Dark green for contrast
      },
      secondary: {
        main: '#86EFAC',      // Light green
        light: '#BBF7D0',     // Very light green
        dark: '#4ADE80',      // Medium green
        contrast: '#064E3B',  // Dark green
      },
      background: {
        primary: '#064E3B',   // Dark green background
        secondary: '#065F46', // Slightly lighter
        tertiary: '#047857',  // Medium dark green
      },
      surface: {
        primary: '#065F46',   // Dark green surface
        secondary: '#047857', // Medium dark green
        tertiary: '#059669',  // Lighter dark green
      },
    },
    
    // Adjust component themes for dark mode
    components: {
      navigation: {
        backgroundColor: '#065F46',
        accentColor: '#86EFAC',
        activeIndicator: '#4ADE80',
        textColor: '#F0FDF4',
      },
      dashboard: {
        backgroundColor: '#064E3B',
        cardStyle: 'clean',
        primaryAction: '#4ADE80',
        accentColor: '#86EFAC',
      },
      classroom: {
        headerColor: '#4ADE80',
        sectionDivider: '#047857',
        studentListBackground: '#065F46',
        gradeColors: {
          excellent: '#4ADE80',
          good: '#86EFAC',
          average: '#BBF7D0',
          needsImprovement: '#FCD34D',
          poor: '#F87171',
        },
      },
    },
  }
);

/**
 * Teacher theme configuration for createTheme
 */
export const teacherThemeConfig: ThemeConfig = {
  strategy: 'role-based',
  baseTheme: 'light',
  roleOverrides: teacherThemeCustomizations,
};

/**
 * Create teacher theme with color scheme
 */
export function createTeacherTheme(colorScheme: 'light' | 'dark' = 'light'): Theme {
  return colorScheme === 'dark' ? darkTeacherTheme : lightTeacherTheme;
}

/**
 * Teacher theme metadata
 */
export const teacherThemeMetadata = {
  name: 'Teacher Theme',
  description: 'Professional theme with green primary colors for calm authority and classroom clarity',
  primaryColor: '#10B981',
  personality: 'professional',
  targetAudience: 'teachers',
  designPrinciples: [
    'Calm authority and professionalism',
    'Classroom clarity and organization',
    'Smooth, efficient animations',
    'Balanced spacing for productivity',
    'Clean, organized interface design',
  ],
} as const;

// Export default light theme
export default lightTeacherTheme;
