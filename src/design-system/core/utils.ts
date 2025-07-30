/**
 * Design System Core Utilities
 * Deep merge, color manipulation, and theme validation utilities
 */

import { Theme, ThemeValidationResult, DeepPartial } from './types';

/**
 * Deep merge utility for theme composition
 * Recursively merges objects, with later objects taking precedence
 */
export function deepMerge<T extends Record<string, any>>(...objects: Array<DeepPartial<T> | undefined>): T {
  const result = {} as T;
  
  for (const obj of objects) {
    if (!obj) continue;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively merge objects
          result[key] = deepMerge(result[key] || {}, value);
        } else {
          // Direct assignment for primitives and arrays
          result[key] = value as T[Extract<keyof T, string>];
        }
      }
    }
  }
  
  return result;
}

/**
 * Color manipulation utilities
 */

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lighten a hex color by a given amount (0-1)
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  
  return rgbToHex(newR, newG, newB);
}

/**
 * Darken a hex color by a given amount (0-1)
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  
  return rgbToHex(newR, newG, newB);
}

/**
 * Calculate relative luminance of a color (for contrast calculations)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if a color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
}

/**
 * Generate color variants for a base color
 */
export function generateColorVariants(baseColor: string): {
  light: string;
  dark: string;
  lighter: string;
  darker: string;
} {
  return {
    light: lighten(baseColor, 0.2),
    dark: darken(baseColor, 0.2),
    lighter: lighten(baseColor, 0.4),
    darker: darken(baseColor, 0.4),
  };
}

/**
 * Theme validation utilities
 */

/**
 * Validate theme structure and accessibility compliance
 */
export function validateTheme(theme: Theme): ThemeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required color properties
  if (!theme.colors.primary?.main) {
    errors.push('Missing primary.main color');
  }
  
  if (!theme.colors.secondary?.main) {
    errors.push('Missing secondary.main color');
  }
  
  // Check contrast ratios for text on backgrounds
  if (theme.colors.text?.primary && theme.colors.background?.primary) {
    const textContrast = getContrastRatio(
      theme.colors.text.primary,
      theme.colors.background.primary
    );
    
    if (textContrast < 4.5) {
      errors.push(`Insufficient contrast ratio for primary text: ${textContrast.toFixed(2)} (minimum: 4.5)`);
    } else if (textContrast < 7) {
      warnings.push(`Text contrast could be improved: ${textContrast.toFixed(2)} (AAA standard: 7)`);
    }
  }
  
  // Check if primary color has sufficient contrast on white background
  if (theme.colors.primary?.main) {
    const primaryContrast = getContrastRatio(theme.colors.primary.main, '#ffffff');
    if (primaryContrast < 4.5) {
      errors.push(`Primary color insufficient contrast on white: ${primaryContrast.toFixed(2)}`);
    }
  }
  
  // Check component themes
  if (!theme.componentThemes) {
    warnings.push('Missing component themes');
  }
  
  // Check accessibility tokens
  if (!theme.accessibility) {
    warnings.push('Missing accessibility tokens');
  } else {
    if (theme.accessibility.minTouchTarget < 44) {
      warnings.push(`Touch target size below recommended minimum: ${theme.accessibility.minTouchTarget}px (recommended: 44px)`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Utility to check if a value is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Utility to ensure a color is valid, with fallback
 */
export function ensureValidColor(color: string, fallback: string = '#000000'): string {
  return isValidHexColor(color) ? color : fallback;
}

/**
 * Create a safe color palette from a base color
 */
export function createSafeColorPalette(baseColor: string) {
  const safeBase = ensureValidColor(baseColor);
  
  return {
    50: lighten(safeBase, 0.9),
    100: lighten(safeBase, 0.8),
    200: lighten(safeBase, 0.6),
    300: lighten(safeBase, 0.4),
    400: lighten(safeBase, 0.2),
    500: safeBase,
    600: darken(safeBase, 0.1),
    700: darken(safeBase, 0.2),
    800: darken(safeBase, 0.3),
    900: darken(safeBase, 0.4),
  };
}
