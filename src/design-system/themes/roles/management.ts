/**
 * Management Theme Configuration
 * Rose primary theme - commanding, data-driven design
 */

import { Theme, ThemeConfig } from '../../core/types';
import { deepMerge } from '../../core/utils';
import { enhancedLightTheme, enhancedDarkTheme } from '../base';
import { sharedThemeCustomizations } from '../shared/default';
import { baseColors } from '../../tokens/colors';

/**
 * Management-specific theme customizations
 */
export const managementThemeCustomizations = {
  // Management brand colors - Rose primary (#E11D48)
  colors: {
    primary: {
      main: '#E11D48',      // Management primary rose
      light: '#FB7185',     // Lighter rose
      dark: '#BE123C',      // Darker rose
      contrast: '#FFFFFF',  // White text
    },
    secondary: {
      main: '#FDA4AF',      // Light rose accent
      light: '#FECDD3',     // Very light rose
      dark: '#FB7185',      // Medium rose
      contrast: '#881337',  // Dark rose for contrast
    },
    accent: {
      main: '#FFF1F2',      // Rose 50 for subtle accents
      emphasis: '#FFE4E6',  // Rose 100 for emphasis
    },
  },
  
  // Management-specific component styling
  components: {
    // Sharp, authoritative button styling
    button: {
      borderRadius: 2,      // 2px radius - crisp, authoritative
      shadow: {
        shadowColor: '#E11D48',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 2,
      },
      hover: {
        transform: [{ scale: 1 }, { scale: 1.005 }],
        shadowOpacity: 0.08,
      },
    },
    
    // Efficient card styling
    card: {
      borderRadius: 4,      // Minimal rounding for efficiency
      elevation: 2,         // 2dp elevation - subtle
      shadow: {
        shadowColor: '#E11D48',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      },
      hover: {
        elevation: 3,
        shadowOpacity: 0.07,
      },
    },
    
    // Dashboard styling
    dashboard: {
      backgroundColor: '#FFF1F2', // Rose 50 background
      cardStyle: 'efficient',
      primaryAction: '#E11D48',
      accentColor: '#FDA4AF',
      gridLayout: 'condensed',    // 12-column condensed grid
    },
    
    // Navigation styling
    navigation: {
      backgroundColor: '#E11D48',
      accentColor: '#FDA4AF',
      activeIndicator: '#FB7185',
      textColor: '#FFFFFF',
    },
    
    // Management-specific components
    management: {
      headerColor: '#E11D48',
      dataTableStripe: '#FFF1F2',
      criticalAlert: '#DC2626',
      warningAlert: '#F59E0B',
      successMetric: '#10B981',
      kpiBackground: '#FFE4E6',
      chartAccent: '#FB7185',
    },
  },
  
  // Management-specific animations - crisp and efficient
  animations: {
    defaultDuration: 150,
    defaultEasing: 'ease-in',   // Sharp, decisive animations
    microInteractions: {
      buttonPress: {
        transform: [{ scale: 1 }, { scale: 0.99 }],
        duration: 100,
        easing: 'ease-in',
      },
      cardHover: {
        transform: [{ scale: 1 }, { scale: 1.005 }],
        shadowOpacity: [0.05, 0.07],
        duration: 150,
        easing: 'ease-in',
      },
      dataTransition: {
        opacity: [0, 1],
        duration: 150,
        easing: 'ease-out',
      },
    },
  },
  
  // Management-specific spacing - compact and efficient
  spacing: {
    cardPadding: 16,        // Compact spacing
    buttonPadding: 8,       // Minimal button padding
    contentSpacing: 12,     // Tight content spacing
    sectionSpacing: 20,     // Efficient section separation
    dataGutter: 12,         // Condensed data layout
    dashboardGrid: 16,      // Tight grid spacing
  },
  
  // Management accessibility preferences
  accessibility: {
    minTouchTarget: 44,     // Standard touch targets
    focusRing: {
      width: 2,
      offset: 1,            // Tighter focus ring
      color: '#FB7185',     // Light rose for visibility
    },
    animations: {
      reducedMotion: true,  // Prefer efficiency over animation
      duration: 150,        // Fast, efficient timing
    },
    management: {
      highContrast: true,   // Important for data clarity
      largeText: false,     // Compact text for data density
      colorCoding: true,    // Essential for data visualization
      dataVisualization: {
        colorBlindSafe: true,
        patternSupport: true,
        highContrast: true,
      },
    },
  },
} as const;

/**
 * Light Management Theme
 */
export const lightManagementTheme: Theme = deepMerge(
  enhancedLightTheme,
  sharedThemeCustomizations,
  managementThemeCustomizations,
  {
    // Override specific colors for light mode
    colors: {
      background: {
        primary: '#FFF1F2',   // Rose 50 - subtle rose background
        secondary: '#FFFFFF', // White
        tertiary: '#FFE4E6',  // Rose 100
      },
      surface: {
        primary: '#FFFFFF',   // White cards
        secondary: '#FFF1F2', // Rose 50
        tertiary: '#FFE4E6',  // Rose 100
      },
      interactive: {
        hover: '#FFE4E6',     // Rose 100
        pressed: '#FECDD3',   // Rose 200
        focus: '#FDA4AF',     // Rose 300
        disabled: '#FFF1F2',  // Rose 50
      },
      
      // Error color aligned with management theme
      error: {
        main: '#E11D48',      // Consistent with primary palette
        light: '#FB7185',
        dark: '#BE123C',
        contrast: '#FFFFFF',
      },
      
      // Data visualization colors
      dataViz: {
        primary: [
          '#E11D48',  // Rose
          '#10B981',  // Green
          '#F59E0B',  // Amber
          '#3B82F6',  // Blue
          '#8B5CF6',  // Purple
        ],
        status: {
          critical: '#DC2626',
          warning: '#F59E0B',
          success: '#10B981',
          info: '#3B82F6',
          neutral: '#6B7280',
        },
      },
    },
  }
);

/**
 * Dark Management Theme
 */
export const darkManagementTheme: Theme = deepMerge(
  enhancedDarkTheme,
  sharedThemeCustomizations,
  managementThemeCustomizations,
  {
    // Override colors for dark mode
    colors: {
      primary: {
        main: '#FB7185',      // Brighter rose for dark backgrounds
        light: '#FDA4AF',     // Even brighter
        dark: '#E11D48',      // Original rose
        contrast: '#881337',  // Dark rose for contrast
      },
      secondary: {
        main: '#FDA4AF',      // Light rose
        light: '#FECDD3',     // Very light rose
        dark: '#FB7185',      // Medium rose
        contrast: '#881337',  // Dark rose
      },
      background: {
        primary: '#881337',   // Dark rose background
        secondary: '#9F1239', // Slightly lighter
        tertiary: '#BE123C',  // Medium dark rose
      },
      surface: {
        primary: '#9F1239',   // Dark rose surface
        secondary: '#BE123C', // Medium dark rose
        tertiary: '#E11D48',  // Lighter dark rose
      },
    },
    
    // Adjust component themes for dark mode
    components: {
      navigation: {
        backgroundColor: '#9F1239',
        accentColor: '#FDA4AF',
        activeIndicator: '#FB7185',
        textColor: '#FFE4E6',
      },
      dashboard: {
        backgroundColor: '#881337',
        cardStyle: 'efficient',
        primaryAction: '#FB7185',
        accentColor: '#FDA4AF',
        gridLayout: 'condensed',
      },
      management: {
        headerColor: '#FB7185',
        dataTableStripe: '#9F1239',
        criticalAlert: '#F87171',
        warningAlert: '#FBBF24',
        successMetric: '#4ADE80',
        kpiBackground: '#BE123C',
        chartAccent: '#FDA4AF',
      },
    },
  }
);

/**
 * Management theme configuration for createTheme
 */
export const managementThemeConfig: ThemeConfig = {
  strategy: 'role-based',
  baseTheme: 'light',
  roleOverrides: managementThemeCustomizations,
};

/**
 * Create management theme with color scheme
 */
export function createManagementTheme(colorScheme: 'light' | 'dark' = 'light'): Theme {
  return colorScheme === 'dark' ? darkManagementTheme : lightManagementTheme;
}

/**
 * Management theme metadata
 */
export const managementThemeMetadata = {
  name: 'Management Theme',
  description: 'Authoritative theme with rose primary colors for commanding, data-driven interfaces',
  primaryColor: '#E11D48',
  personality: 'authoritative',
  targetAudience: 'management',
  designPrinciples: [
    'Commanding and authoritative presence',
    'Data-driven interface design',
    'Crisp, efficient animations',
    'Compact spacing for information density',
    'Sharp, professional aesthetics',
  ],
} as const;

// Export default light theme
export default lightManagementTheme;
