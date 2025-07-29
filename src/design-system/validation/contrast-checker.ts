/**
 * Contrast Ratio Checking Utilities
 * Advanced color contrast validation for WCAG compliance
 */

import { Theme } from '../core/types';

// Color format types
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'rgba' | 'hsla';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  isAccessible: boolean;
  recommendation?: string;
}

export interface ContrastCheckOptions {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  level?: 'AA' | 'AAA';
}

// WCAG contrast requirements
const WCAG_REQUIREMENTS = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const;

// Large text threshold (18pt regular or 14pt bold)
const LARGE_TEXT_THRESHOLD = {
  regular: 18,
  bold: 14,
} as const;

/**
 * Color parsing utilities
 */
export class ColorParser {
  /**
   * Parse color string to RGB values
   */
  static parseColor(color: string): RGBColor | null {
    // Remove whitespace and convert to lowercase
    const cleanColor = color.trim().toLowerCase();

    // Try hex format
    const hexMatch = cleanColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16),
      };
    }

    // Try short hex format
    const shortHexMatch = cleanColor.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
    if (shortHexMatch) {
      return {
        r: parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
        g: parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
        b: parseInt(shortHexMatch[3] + shortHexMatch[3], 16),
      };
    }

    // Try RGB format
    const rgbMatch = cleanColor.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10),
      };
    }

    // Try RGBA format
    const rgbaMatch = cleanColor.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1], 10),
        g: parseInt(rgbaMatch[2], 10),
        b: parseInt(rgbaMatch[3], 10),
        a: parseFloat(rgbaMatch[4]),
      };
    }

    // Try named colors
    const namedColors: Record<string, RGBColor> = {
      black: { r: 0, g: 0, b: 0 },
      white: { r: 255, g: 255, b: 255 },
      red: { r: 255, g: 0, b: 0 },
      green: { r: 0, g: 128, b: 0 },
      blue: { r: 0, g: 0, b: 255 },
      yellow: { r: 255, g: 255, b: 0 },
      cyan: { r: 0, g: 255, b: 255 },
      magenta: { r: 255, g: 0, b: 255 },
      gray: { r: 128, g: 128, b: 128 },
      grey: { r: 128, g: 128, b: 128 },
    };

    return namedColors[cleanColor] || null;
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(rgb: RGBColor): HSLColor {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: rgb.a,
    };
  }

  /**
   * Convert HSL to RGB
   */
  static hslToRgb(hsl: HSLColor): RGBColor {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
      a: hsl.a,
    };
  }
}

/**
 * Contrast ratio calculation utilities
 */
export class ContrastCalculator {
  /**
   * Calculate relative luminance of a color
   */
  static getRelativeLuminance(rgb: RGBColor): number {
    const { r, g, b } = rgb;
    
    // Convert to sRGB
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // Calculate luminance using ITU-R BT.709 coefficients
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static calculateContrastRatio(foreground: string, background: string): number {
    const fgRgb = ColorParser.parseColor(foreground);
    const bgRgb = ColorParser.parseColor(background);

    if (!fgRgb || !bgRgb) {
      console.warn('Invalid color format provided to contrast calculator');
      return 1; // Return minimum contrast if colors can't be parsed
    }

    const fgLuminance = this.getRelativeLuminance(fgRgb);
    const bgLuminance = this.getRelativeLuminance(bgRgb);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if contrast ratio meets WCAG requirements
   */
  static checkContrastCompliance(
    foreground: string,
    background: string,
    options: ContrastCheckOptions = {}
  ): ContrastResult {
    const {
      fontSize = 16,
      fontWeight = 'normal',
      level = 'AA',
    } = options;

    const ratio = this.calculateContrastRatio(foreground, background);
    
    // Determine if text is considered "large"
    const isLargeText = (fontSize >= LARGE_TEXT_THRESHOLD.regular) || 
                       (fontSize >= LARGE_TEXT_THRESHOLD.bold && fontWeight === 'bold');
    
    const requirement = WCAG_REQUIREMENTS[level][isLargeText ? 'large' : 'normal'];
    const isAccessible = ratio >= requirement;

    // Determine compliance level
    let complianceLevel: ContrastResult['level'];
    if (ratio >= WCAG_REQUIREMENTS.AAA[isLargeText ? 'large' : 'normal']) {
      complianceLevel = 'AAA';
    } else if (ratio >= WCAG_REQUIREMENTS.AA[isLargeText ? 'large' : 'normal']) {
      complianceLevel = 'AA';
    } else if (ratio >= 3.0) {
      complianceLevel = 'A';
    } else {
      complianceLevel = 'FAIL';
    }

    // Generate recommendation if not accessible
    let recommendation: string | undefined;
    if (!isAccessible) {
      const needed = requirement - ratio;
      if (needed > 2) {
        recommendation = 'Consider using a much darker or lighter color for better contrast';
      } else if (needed > 1) {
        recommendation = 'Adjust color darkness/lightness to improve contrast';
      } else {
        recommendation = 'Minor color adjustment needed to meet accessibility standards';
      }
    }

    return {
      ratio: Math.round(ratio * 100) / 100, // Round to 2 decimal places
      level: complianceLevel,
      isAccessible,
      recommendation,
    };
  }
}

/**
 * Theme-specific contrast validation
 */
export class ThemeContrastValidator {
  /**
   * Validate all color combinations in a theme
   */
  static validateThemeContrast(theme: Theme, level: 'AA' | 'AAA' = 'AA'): ContrastValidationResult {
    const results: ContrastCheckResult[] = [];
    const colors = theme.colors;

    if (!colors) {
      return { results, summary: { total: 0, passed: 0, failed: 0, warnings: 0 } };
    }

    // Check primary color combinations
    if (colors.primary?.main && colors.primary?.contrast) {
      results.push({
        name: 'Primary Button Text',
        foreground: colors.primary.contrast,
        background: colors.primary.main,
        context: 'Button text on primary background',
        result: ContrastCalculator.checkContrastCompliance(
          colors.primary.contrast,
          colors.primary.main,
          { level }
        ),
      });
    }

    // Check secondary color combinations
    if (colors.secondary?.main && colors.secondary?.contrast) {
      results.push({
        name: 'Secondary Button Text',
        foreground: colors.secondary.contrast,
        background: colors.secondary.main,
        context: 'Button text on secondary background',
        result: ContrastCalculator.checkContrastCompliance(
          colors.secondary.contrast,
          colors.secondary.main,
          { level }
        ),
      });
    }

    // Check text on surface colors
    if (colors.text?.primary && colors.surface?.primary) {
      results.push({
        name: 'Primary Text on Surface',
        foreground: colors.text.primary,
        background: colors.surface.primary,
        context: 'Main text content',
        result: ContrastCalculator.checkContrastCompliance(
          colors.text.primary,
          colors.surface.primary,
          { level }
        ),
      });
    }

    // Check error color combinations
    if (colors.error?.main && colors.error?.contrast) {
      results.push({
        name: 'Error Text',
        foreground: colors.error.contrast,
        background: colors.error.main,
        context: 'Error messages and alerts',
        result: ContrastCalculator.checkContrastCompliance(
          colors.error.contrast,
          colors.error.main,
          { level }
        ),
      });
    }

    // Calculate summary
    const total = results.length;
    const passed = results.filter(r => r.result.isAccessible).length;
    const failed = results.filter(r => !r.result.isAccessible).length;
    const warnings = results.filter(r => r.result.level === 'A').length;

    return {
      results,
      summary: { total, passed, failed, warnings },
    };
  }

  /**
   * Generate color suggestions for better contrast
   */
  static suggestBetterColors(
    foreground: string,
    background: string,
    targetRatio: number = 4.5
  ): ColorSuggestion[] {
    const fgRgb = ColorParser.parseColor(foreground);
    const bgRgb = ColorParser.parseColor(background);

    if (!fgRgb || !bgRgb) {
      return [];
    }

    const suggestions: ColorSuggestion[] = [];

    // Convert to HSL for easier manipulation
    const fgHsl = ColorParser.rgbToHsl(fgRgb);
    const bgHsl = ColorParser.rgbToHsl(bgRgb);

    // Try darkening the foreground
    for (let l = fgHsl.l - 10; l >= 0; l -= 10) {
      const newFgHsl = { ...fgHsl, l };
      const newFgRgb = ColorParser.hslToRgb(newFgHsl);
      const newFgHex = `#${newFgRgb.r.toString(16).padStart(2, '0')}${newFgRgb.g.toString(16).padStart(2, '0')}${newFgRgb.b.toString(16).padStart(2, '0')}`;
      
      const ratio = ContrastCalculator.calculateContrastRatio(newFgHex, background);
      if (ratio >= targetRatio) {
        suggestions.push({
          type: 'foreground',
          color: newFgHex,
          ratio,
          description: `Darker foreground (${l}% lightness)`,
        });
        break;
      }
    }

    // Try lightening the foreground
    for (let l = fgHsl.l + 10; l <= 100; l += 10) {
      const newFgHsl = { ...fgHsl, l };
      const newFgRgb = ColorParser.hslToRgb(newFgHsl);
      const newFgHex = `#${newFgRgb.r.toString(16).padStart(2, '0')}${newFgRgb.g.toString(16).padStart(2, '0')}${newFgRgb.b.toString(16).padStart(2, '0')}`;
      
      const ratio = ContrastCalculator.calculateContrastRatio(newFgHex, background);
      if (ratio >= targetRatio) {
        suggestions.push({
          type: 'foreground',
          color: newFgHex,
          ratio,
          description: `Lighter foreground (${l}% lightness)`,
        });
        break;
      }
    }

    // Try darkening the background
    for (let l = bgHsl.l - 10; l >= 0; l -= 10) {
      const newBgHsl = { ...bgHsl, l };
      const newBgRgb = ColorParser.hslToRgb(newBgHsl);
      const newBgHex = `#${newBgRgb.r.toString(16).padStart(2, '0')}${newBgRgb.g.toString(16).padStart(2, '0')}${newBgRgb.b.toString(16).padStart(2, '0')}`;
      
      const ratio = ContrastCalculator.calculateContrastRatio(foreground, newBgHex);
      if (ratio >= targetRatio) {
        suggestions.push({
          type: 'background',
          color: newBgHex,
          ratio,
          description: `Darker background (${l}% lightness)`,
        });
        break;
      }
    }

    // Try lightening the background
    for (let l = bgHsl.l + 10; l <= 100; l += 10) {
      const newBgHsl = { ...bgHsl, l };
      const newBgRgb = ColorParser.hslToRgb(newBgHsl);
      const newBgHex = `#${newBgRgb.r.toString(16).padStart(2, '0')}${newBgRgb.g.toString(16).padStart(2, '0')}${newBgRgb.b.toString(16).padStart(2, '0')}`;
      
      const ratio = ContrastCalculator.calculateContrastRatio(foreground, newBgHex);
      if (ratio >= targetRatio) {
        suggestions.push({
          type: 'background',
          color: newBgHex,
          ratio,
          description: `Lighter background (${l}% lightness)`,
        });
        break;
      }
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }
}

// Type definitions for contrast validation results
export interface ContrastCheckResult {
  name: string;
  foreground: string;
  background: string;
  context: string;
  result: ContrastResult;
}

export interface ContrastValidationResult {
  results: ContrastCheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export interface ColorSuggestion {
  type: 'foreground' | 'background';
  color: string;
  ratio: number;
  description: string;
}

// Export main functions for easy use
export const checkContrast = ContrastCalculator.checkContrastCompliance;
export const calculateContrast = ContrastCalculator.calculateContrastRatio;
export const validateThemeContrast = ThemeContrastValidator.validateThemeContrast;
export const suggestBetterColors = ThemeContrastValidator.suggestBetterColors;
