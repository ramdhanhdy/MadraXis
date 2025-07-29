/**
 * Theme Export Utilities
 * Tools for exporting themes in various formats for design tools and documentation
 */

import { Theme } from '../core/types';
import { validateTheme } from '../validation';

// Export format types
export type ExportFormat = 'json' | 'css' | 'scss' | 'figma' | 'sketch' | 'tokens' | 'documentation';

export interface ExportOptions {
  format: ExportFormat;
  includeValidation?: boolean;
  includeMetadata?: boolean;
  minify?: boolean;
  prefix?: string;
  filter?: (path: string, value: any) => boolean;
}

export interface ExportResult {
  content: string;
  metadata: ExportMetadata;
  validation?: any;
}

export interface ExportMetadata {
  format: ExportFormat;
  timestamp: number;
  version: string;
  tokenCount: number;
  size: number;
}

/**
 * Main theme export utility
 */
export class ThemeExporter {
  /**
   * Export theme in specified format
   */
  static export(theme: Theme, options: ExportOptions): ExportResult {
    const {
      format,
      includeValidation = false,
      includeMetadata = true,
      minify = false,
      prefix = '',
      filter,
    } = options;

    let content: string;
    let tokenCount = 0;

    // Filter theme if filter function provided
    const filteredTheme = filter ? this.filterTheme(theme, filter) : theme;
    
    // Count tokens
    tokenCount = this.countTokens(filteredTheme);

    // Generate content based on format
    switch (format) {
      case 'json':
        content = this.exportAsJSON(filteredTheme, minify);
        break;
      case 'css':
        content = this.exportAsCSS(filteredTheme, prefix);
        break;
      case 'scss':
        content = this.exportAsSCSS(filteredTheme, prefix);
        break;
      case 'figma':
        content = this.exportAsFigmaTokens(filteredTheme);
        break;
      case 'sketch':
        content = this.exportAsSketchTokens(filteredTheme);
        break;
      case 'tokens':
        content = this.exportAsDesignTokens(filteredTheme);
        break;
      case 'documentation':
        content = this.exportAsDocumentation(filteredTheme);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    // Create metadata
    const metadata: ExportMetadata = {
      format,
      timestamp: Date.now(),
      version: '1.0.0', // This could be dynamic
      tokenCount,
      size: new Blob([content]).size,
    };

    // Add validation if requested
    let validation;
    if (includeValidation) {
      validation = validateTheme(filteredTheme);
    }

    return {
      content,
      metadata,
      validation,
    };
  }

  /**
   * Export as JSON
   */
  private static exportAsJSON(theme: Theme, minify: boolean): string {
    return JSON.stringify(theme, null, minify ? 0 : 2);
  }

  /**
   * Export as CSS custom properties
   */
  private static exportAsCSS(theme: Theme, prefix: string): string {
    const variables: string[] = [':root {'];
    
    const traverse = (obj: any, path: string[] = []) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = [...path, key];
        const varName = `--${prefix}${currentPath.join('-')}`.replace(/--+/g, '--');
        
        if (this.isPrimitiveValue(value)) {
          variables.push(`  ${varName}: ${this.formatCSSValue(value)};`);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    };
    
    traverse(theme);
    variables.push('}');
    
    return variables.join('\n');
  }

  /**
   * Export as SCSS variables
   */
  private static exportAsSCSS(theme: Theme, prefix: string): string {
    const variables: string[] = [];
    
    const traverse = (obj: any, path: string[] = []) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = [...path, key];
        const varName = `$${prefix}${currentPath.join('-')}`.replace(/-+/g, '-');
        
        if (this.isPrimitiveValue(value)) {
          variables.push(`${varName}: ${this.formatSCSSValue(value)};`);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    };
    
    traverse(theme);
    
    return variables.join('\n');
  }

  /**
   * Export as Figma design tokens
   */
  private static exportAsFigmaTokens(theme: Theme): string {
    const tokens: any = {};
    
    const traverse = (obj: any, path: string[] = []) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = [...path, key];
        
        if (this.isPrimitiveValue(value)) {
          this.setNestedProperty(tokens, currentPath, {
            value: this.formatFigmaValue(value, currentPath),
            type: this.getFigmaTokenType(value, currentPath),
          });
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    };
    
    traverse(theme);
    
    return JSON.stringify(tokens, null, 2);
  }

  /**
   * Export as Sketch design tokens
   */
  private static exportAsSketchTokens(theme: Theme): string {
    const tokens: any = {
      colors: {},
      typography: {},
      spacing: {},
    };
    
    // Extract colors
    if (theme.colors) {
      this.extractSketchColors(theme.colors, tokens.colors);
    }
    
    // Extract typography
    if (theme.typography) {
      tokens.typography = this.extractSketchTypography(theme.typography);
    }
    
    // Extract spacing
    if (theme.spacing) {
      tokens.spacing = this.extractSketchSpacing(theme.spacing);
    }
    
    return JSON.stringify(tokens, null, 2);
  }

  /**
   * Export as W3C Design Tokens format
   */
  private static exportAsDesignTokens(theme: Theme): string {
    const tokens: any = {};
    
    const traverse = (obj: any, path: string[] = []) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = [...path, key];
        
        if (this.isPrimitiveValue(value)) {
          this.setNestedProperty(tokens, currentPath, {
            $value: value,
            $type: this.getW3CTokenType(value, currentPath),
          });
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    };
    
    traverse(theme);
    
    return JSON.stringify(tokens, null, 2);
  }

  /**
   * Export as documentation markdown
   */
  private static exportAsDocumentation(theme: Theme): string {
    const sections: string[] = [];
    
    sections.push('# Design System Theme Documentation\n');
    sections.push(`Generated on: ${new Date().toISOString()}\n`);
    
    // Colors section
    if (theme.colors) {
      sections.push('## Colors\n');
      sections.push(this.generateColorDocumentation(theme.colors));
    }
    
    // Typography section
    if (theme.typography) {
      sections.push('## Typography\n');
      sections.push(this.generateTypographyDocumentation(theme.typography));
    }
    
    // Spacing section
    if (theme.spacing) {
      sections.push('## Spacing\n');
      sections.push(this.generateSpacingDocumentation(theme.spacing));
    }
    
    // Component themes section
    if (theme.componentThemes) {
      sections.push('## Component Themes\n');
      sections.push(this.generateComponentThemeDocumentation(theme.componentThemes));
    }
    
    return sections.join('\n');
  }

  /**
   * Helper methods
   */
  private static filterTheme(theme: Theme, filter: (path: string, value: any) => boolean): Theme {
    const filtered: any = {};
    
    const traverse = (obj: any, target: any, path: string[] = []) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = [...path, key];
        const pathString = currentPath.join('.');
        
        if (filter(pathString, value)) {
          if (this.isPrimitiveValue(value)) {
            target[key] = value;
          } else if (typeof value === 'object' && value !== null) {
            target[key] = {};
            traverse(value, target[key], currentPath);
          }
        }
      });
    };
    
    traverse(theme, filtered);
    return filtered as Theme;
  }

  private static countTokens(theme: Theme): number {
    let count = 0;
    
    const traverse = (obj: any) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (this.isPrimitiveValue(value)) {
          count++;
        } else if (typeof value === 'object' && value !== null) {
          traverse(value);
        }
      });
    };
    
    traverse(theme);
    return count;
  }

  private static isPrimitiveValue(value: any): boolean {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  private static formatCSSValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    return String(value);
  }

  private static formatSCSSValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return String(value);
  }

  private static formatFigmaValue(value: any, path: string[]): any {
    // Convert values to Figma-compatible format
    if (path.includes('colors') && typeof value === 'string') {
      return this.hexToRgb(value);
    }
    return value;
  }

  private static getFigmaTokenType(value: any, path: string[]): string {
    if (path.includes('colors')) return 'color';
    if (path.includes('spacing')) return 'dimension';
    if (path.includes('fontSize')) return 'dimension';
    if (path.includes('fontWeight')) return 'fontWeight';
    if (path.includes('fontFamily')) return 'fontFamily';
    return 'other';
  }

  private static getW3CTokenType(value: any, path: string[]): string {
    if (path.includes('colors')) return 'color';
    if (path.includes('spacing')) return 'dimension';
    if (path.includes('fontSize')) return 'dimension';
    if (path.includes('fontWeight')) return 'fontWeight';
    if (path.includes('fontFamily')) return 'fontFamily';
    if (path.includes('duration')) return 'duration';
    return 'other';
  }

  private static setNestedProperty(obj: any, path: string[], value: any): void {
    const lastKey = path.pop()!;
    const target = path.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : null;
  }

  private static extractSketchColors(colors: any, target: any, path: string[] = []): void {
    Object.keys(colors).forEach(key => {
      const value = colors[key];
      if (typeof value === 'string') {
        const colorPath = [...path, key].join('/');
        target[colorPath] = value;
      } else if (typeof value === 'object' && value !== null) {
        this.extractSketchColors(value, target, [...path, key]);
      }
    });
  }

  private static extractSketchTypography(typography: any): any {
    return {
      fontSizes: typography.fontSize || {},
      fontWeights: typography.fontWeight || {},
      lineHeights: typography.lineHeight || {},
      fontFamilies: typography.fontFamily || {},
    };
  }

  private static extractSketchSpacing(spacing: any): any {
    return spacing.base || spacing;
  }

  private static generateColorDocumentation(colors: any): string {
    const docs: string[] = [];
    
    const traverse = (obj: any, path: string[] = [], level: number = 3) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = [...path, key];
        
        if (typeof value === 'string') {
          const heading = '#'.repeat(level);
          docs.push(`${heading} ${currentPath.join(' → ')}`);
          docs.push(`- **Value**: \`${value}\``);
          docs.push(`- **Usage**: ${this.getColorUsageDescription(currentPath)}\n`);
        } else if (typeof value === 'object' && value !== null) {
          const heading = '#'.repeat(level);
          docs.push(`${heading} ${key.charAt(0).toUpperCase() + key.slice(1)}\n`);
          traverse(value, currentPath, level + 1);
        }
      });
    };
    
    traverse(colors);
    return docs.join('\n');
  }

  private static generateTypographyDocumentation(typography: any): string {
    const docs: string[] = [];
    
    if (typography.fontSize) {
      docs.push('### Font Sizes\n');
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        docs.push(`- **${key}**: ${value}`);
      });
      docs.push('');
    }
    
    if (typography.fontWeight) {
      docs.push('### Font Weights\n');
      Object.entries(typography.fontWeight).forEach(([key, value]) => {
        docs.push(`- **${key}**: ${value}`);
      });
      docs.push('');
    }
    
    return docs.join('\n');
  }

  private static generateSpacingDocumentation(spacing: any): string {
    const docs: string[] = [];
    
    if (spacing.base) {
      docs.push('### Base Spacing\n');
      Object.entries(spacing.base).forEach(([key, value]) => {
        docs.push(`- **${key}**: ${value}px`);
      });
      docs.push('');
    }
    
    return docs.join('\n');
  }

  private static generateComponentThemeDocumentation(componentThemes: any): string {
    const docs: string[] = [];
    
    Object.keys(componentThemes).forEach(component => {
      docs.push(`### ${component.charAt(0).toUpperCase() + component.slice(1)} Component\n`);
      docs.push('```json');
      docs.push(JSON.stringify(componentThemes[component], null, 2));
      docs.push('```\n');
    });
    
    return docs.join('\n');
  }

  private static getColorUsageDescription(path: string[]): string {
    const pathString = path.join('.');
    
    if (pathString.includes('primary')) return 'Primary brand color for buttons, links, and key UI elements';
    if (pathString.includes('secondary')) return 'Secondary color for supporting UI elements';
    if (pathString.includes('error')) return 'Error states, validation messages, and destructive actions';
    if (pathString.includes('warning')) return 'Warning states and cautionary messages';
    if (pathString.includes('success')) return 'Success states and positive feedback';
    if (pathString.includes('neutral')) return 'Text, borders, and neutral UI elements';
    if (pathString.includes('surface')) return 'Background colors for cards, modals, and surfaces';
    
    return 'General purpose color token';
  }
}

/**
 * Convenience functions for common export formats
 */
export const exportThemeAsJSON = (theme: Theme, minify = false) => 
  ThemeExporter.export(theme, { format: 'json', minify });

export const exportThemeAsCSS = (theme: Theme, prefix = '') => 
  ThemeExporter.export(theme, { format: 'css', prefix });

export const exportThemeAsSCSS = (theme: Theme, prefix = '') => 
  ThemeExporter.export(theme, { format: 'scss', prefix });

export const exportThemeForFigma = (theme: Theme) => 
  ThemeExporter.export(theme, { format: 'figma' });

export const exportThemeDocumentation = (theme: Theme) => 
  ThemeExporter.export(theme, { format: 'documentation', includeValidation: true });
