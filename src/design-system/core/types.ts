/**
 * Design System Core Types
 * Comprehensive TypeScript interfaces for the enhanced theme system
 */

import { UserRole } from '../../styles/colors';

// Color palette interface for consistent color definitions
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// Semantic color interface for theme colors
export interface SemanticColor {
  main: string;
  light: string;
  dark: string;
  contrast: string;
}

// Animation tokens interface
export interface AnimationTokens {
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
  };
  transitions: {
    fade: { opacity: number[] };
    slide: { transform: Array<{ translateY: number }> };
    scale: { transform: Array<{ scale: number }> };
  };
}

// Accessibility tokens interface
export interface AccessibilityTokens {
  minTouchTarget: number;
  focusRing: {
    width: number;
    offset: number;
    color: string;
  };
  contrast: {
    minimum: number;
    enhanced: number;
  };
  reducedMotion: {
    duration: number;
    easing: string;
  };
}

// Component theme interfaces
export interface ButtonComponentTheme {
  borderRadius: number;
  minHeight: {
    small: number;
    medium: number;
    large: number;
  };
  padding: {
    small: { horizontal: number; vertical: number };
    medium: { horizontal: number; vertical: number };
    large: { horizontal: number; vertical: number };
  };
  typography: {
    small: any;
    medium: any;
    large: any;
  };
}

export interface CardComponentTheme {
  borderRadius: number;
  padding: {
    none: number;
    small: number;
    medium: number;
    large: number;
  };
  backgroundColor: string;
  shadow: any;
}

export interface ModalComponentTheme {
  borderRadius: number;
  padding: number;
  backgroundColor: string;
  shadow: any;
  backdropColor: string;
  maxHeight: string;
}

export interface NavigationComponentTheme {
  backgroundColor: string;
  accentColor: string;
  height: number;
  padding: {
    horizontal: number;
    vertical: number;
  };
}

// Component themes collection
export interface ComponentThemes {
  button: ButtonComponentTheme;
  card: CardComponentTheme;
  modal: ModalComponentTheme;
  navigation: NavigationComponentTheme;
}

// Enhanced Theme interface with all design tokens
export interface Theme {
  colors: {
    // Primary and secondary colors (role-specific)
    primary: SemanticColor;
    secondary: SemanticColor;
    
    // Status colors (shared across roles)
    success: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
    info: SemanticColor;
    
    // Background colors
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    
    // Surface colors
    surface: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    
    // Text colors
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      inverse: string;
    };
    
    // Border colors
    border: {
      primary: string;
      secondary: string;
      focus: string;
      error: string;
    };
    
    // Interactive colors
    interactive: {
      hover: string;
      pressed: string;
      focus: string;
      disabled: string;
    };
    
    // Role-specific colors
    role: Record<UserRole, {
      primary: string;
      accent: string;
    }>;
    
    // Base color palettes
    teal: ColorPalette;
    gold: ColorPalette;
    neutral: ColorPalette;
    white: string;
    black: string;
  };
  
  typography: any; // Will be enhanced in future iterations
  spacing: any; // Will be enhanced in future iterations
  shadows: any; // Will be enhanced in future iterations
  borderRadius: any; // Will be enhanced in future iterations
  duration: any; // Will be enhanced in future iterations
  easing: any; // Will be enhanced in future iterations
  nativeEasing: any; // Will be enhanced in future iterations
  breakpoints: any; // Will be enhanced in future iterations
  zIndex: any; // Will be enhanced in future iterations
  zIndexUtils: any; // Will be enhanced in future iterations
  elevationLevels: any; // Will be enhanced in future iterations
  
  // Enhanced design tokens
  animations: AnimationTokens;
  accessibility: AccessibilityTokens;
  
  // Component themes
  componentThemes: ComponentThemes;
}

// Theme configuration interface for theme composition
export interface ThemeConfig {
  strategy: 'shared' | 'role-based';
  baseTheme: 'light' | 'dark';
  roleOverrides?: Partial<Theme>;
  customizations?: Partial<Theme>;
}

// Theme strategy interface for flexible theme management
export interface ThemeStrategy {
  name: string;
  description: string;
  type: 'shared' | 'role-based';
  themes: {
    shared?: Theme;
    roles?: Record<UserRole, Theme>;
  };
  resolver: (config: ThemeConfig, role?: UserRole) => Theme;
}

// Role theme configuration interface
export interface RoleThemeConfig {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  components: Partial<ComponentThemes>;
}

// Theme validation result interface
export interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Theme context interface for React context
export interface ThemeContextType {
  theme: Theme;
  currentRole: UserRole | null;
  setRole: (role: UserRole | null) => void;
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
  strategy: ThemeStrategy;
  setStrategy: (strategy: ThemeStrategy) => void;
}

// Deep merge utility type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Export type utilities
export type ThemeColorKey = keyof Theme['colors'];
export type ComponentThemeKey = keyof ComponentThemes;
export type AnimationDurationKey = keyof AnimationTokens['duration'];
export type AnimationEasingKey = keyof AnimationTokens['easing'];
