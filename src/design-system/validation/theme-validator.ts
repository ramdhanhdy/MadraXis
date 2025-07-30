/**
 * Theme Validation System
 * Runtime validation for theme integrity and accessibility compliance
 */

import { Theme, ComponentThemes } from '../core/types';
import { calculateContrastRatio } from '../utilities/accessibility';

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: ValidationSummary;
}

export interface ValidationError {
  type: 'missing_property' | 'invalid_type' | 'contrast_failure' | 'invalid_value';
  path: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface ValidationWarning {
  type: 'accessibility' | 'performance' | 'consistency' | 'best_practice';
  path: string;
  message: string;
  suggestion?: string;
}

export interface ValidationSummary {
  totalErrors: number;
  totalWarnings: number;
  accessibilityScore: number; // 0-100
  completenessScore: number; // 0-100
  consistencyScore: number; // 0-100;
}

// Required theme properties schema
const REQUIRED_THEME_PROPERTIES = {
  colors: {
    primary: ['main', 'contrast'],
    secondary: ['main', 'contrast'],
    neutral: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  typography: {
    fontSize: ['xs', 'sm', 'base', 'lg', 'xl'],
    fontWeight: ['normal', 'medium', 'semibold', 'bold'],
    lineHeight: ['tight', 'normal', 'relaxed'],
  },
  spacing: {
    base: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  componentThemes: {
    button: ['borderRadius', 'minHeight', 'padding', 'typography'],
    card: ['borderRadius', 'backgroundColor', 'padding', 'shadow'],
    modal: ['borderRadius', 'backgroundColor', 'padding', 'shadow', 'backdropColor'],
    navigation: ['backgroundColor', 'height', 'padding', 'accentColor'],
  },
} as const;

// Minimum contrast ratios for WCAG compliance
const CONTRAST_REQUIREMENTS = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const;

/**
 * Main theme validator class
 */
export class ThemeValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  /**
   * Validate complete theme object
   */
  validateTheme(theme: Theme, options: ValidationOptions = {}): ValidationResult {
    this.errors = [];
    this.warnings = [];

    const {
      checkAccessibility = true,
      checkCompleteness = true,
      checkConsistency = true,
      contrastLevel = 'AA',
    } = options;

    // Validate required properties
    if (checkCompleteness) {
      this.validateRequiredProperties(theme);
    }

    // Validate accessibility
    if (checkAccessibility) {
      this.validateAccessibility(theme, contrastLevel);
    }

    // Validate consistency
    if (checkConsistency) {
      this.validateConsistency(theme);
    }

    // Calculate scores
    const summary = this.calculateValidationSummary(theme);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      summary,
    };
  }

  /**
   * Validate required theme properties
   */
  private validateRequiredProperties(theme: Theme): void {
    this.validateColorProperties(theme);
    this.validateTypographyProperties(theme);
    this.validateSpacingProperties(theme);
    this.validateComponentThemes(theme);
  }

  /**
   * Validate color properties
   */
  private validateColorProperties(theme: Theme): void {
    const colors = theme.colors;
    if (!colors) {
      this.addError('missing_property', 'colors', 'Theme is missing colors object');
      return;
    }

    // Validate primary colors
    if (!colors.primary) {
      this.addError('missing_property', 'colors.primary', 'Missing primary color object');
    } else {
      if (!colors.primary.main) {
        this.addError('missing_property', 'colors.primary.main', 'Missing primary main color');
      }
      if (!colors.primary.contrast) {
        this.addError('missing_property', 'colors.primary.contrast', 'Missing primary contrast color');
      }
    }

    // Validate secondary colors
    if (!colors.secondary) {
      this.addError('missing_property', 'colors.secondary', 'Missing secondary color object');
    } else {
      if (!colors.secondary.main) {
        this.addError('missing_property', 'colors.secondary.main', 'Missing secondary main color');
      }
      if (!colors.secondary.contrast) {
        this.addError('missing_property', 'colors.secondary.contrast', 'Missing secondary contrast color');
      }
    }

    // Validate neutral colors
    if (!colors.neutral) {
      this.addError('missing_property', 'colors.neutral', 'Missing neutral color palette');
    } else {
      const requiredNeutralShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      requiredNeutralShades.forEach(shade => {
        if (!colors.neutral?.[shade]) {
          this.addWarning('consistency', `colors.neutral.${shade}`, `Missing neutral-${shade} color`);
        }
      });
    }
  }

  /**
   * Validate typography properties
   */
  private validateTypographyProperties(theme: Theme): void {
    const typography = theme.typography;
    if (!typography) {
      this.addError('missing_property', 'typography', 'Theme is missing typography object');
      return;
    }

    // Validate font sizes
    if (!typography.fontSize) {
      this.addError('missing_property', 'typography.fontSize', 'Missing fontSize object');
    } else {
      const requiredSizes = ['xs', 'sm', 'base', 'lg', 'xl'];
      requiredSizes.forEach(size => {
        if (!typography.fontSize?.[size]) {
          this.addWarning('consistency', `typography.fontSize.${size}`, `Missing ${size} font size`);
        }
      });
    }

    // Validate font weights
    if (!typography.fontWeight) {
      this.addError('missing_property', 'typography.fontWeight', 'Missing fontWeight object');
    }

    // Validate line heights
    if (!typography.lineHeight) {
      this.addError('missing_property', 'typography.lineHeight', 'Missing lineHeight object');
    }
  }

  /**
   * Validate spacing properties
   */
  private validateSpacingProperties(theme: Theme): void {
    const spacing = theme.spacing;
    if (!spacing) {
      this.addError('missing_property', 'spacing', 'Theme is missing spacing object');
      return;
    }

    if (!spacing.base) {
      this.addError('missing_property', 'spacing.base', 'Missing base spacing object');
    } else {
      const requiredSpacing = ['xs', 'sm', 'md', 'lg', 'xl'];
      requiredSpacing.forEach(size => {
        if (!spacing.base?.[size]) {
          this.addWarning('consistency', `spacing.base.${size}`, `Missing ${size} spacing value`);
        }
      });
    }
  }

  /**
   * Validate component themes
   */
  private validateComponentThemes(theme: Theme): void {
    const componentThemes = theme.componentThemes;
    if (!componentThemes) {
      this.addError('missing_property', 'componentThemes', 'Theme is missing componentThemes object');
      return;
    }

    // Validate button theme
    this.validateButtonTheme(componentThemes.button);
    this.validateCardTheme(componentThemes.card);
    this.validateModalTheme(componentThemes.modal);
    this.validateNavigationTheme(componentThemes.navigation);
  }

  /**
   * Validate button component theme
   */
  private validateButtonTheme(buttonTheme: any): void {
    if (!buttonTheme) {
      this.addError('missing_property', 'componentThemes.button', 'Missing button component theme');
      return;
    }

    const requiredProps = ['borderRadius', 'minHeight', 'padding', 'typography'];
    requiredProps.forEach(prop => {
      if (!buttonTheme[prop]) {
        this.addError('missing_property', `componentThemes.button.${prop}`, `Missing button ${prop}`);
      }
    });
  }

  /**
   * Validate card component theme
   */
  private validateCardTheme(cardTheme: any): void {
    if (!cardTheme) {
      this.addError('missing_property', 'componentThemes.card', 'Missing card component theme');
      return;
    }

    const requiredProps = ['borderRadius', 'backgroundColor', 'padding', 'shadow'];
    requiredProps.forEach(prop => {
      if (!cardTheme[prop]) {
        this.addError('missing_property', `componentThemes.card.${prop}`, `Missing card ${prop}`);
      }
    });
  }

  /**
   * Validate modal component theme
   */
  private validateModalTheme(modalTheme: any): void {
    if (!modalTheme) {
      this.addError('missing_property', 'componentThemes.modal', 'Missing modal component theme');
      return;
    }

    const requiredProps = ['borderRadius', 'backgroundColor', 'padding', 'shadow', 'backdropColor'];
    requiredProps.forEach(prop => {
      if (!modalTheme[prop]) {
        this.addError('missing_property', `componentThemes.modal.${prop}`, `Missing modal ${prop}`);
      }
    });
  }

  /**
   * Validate navigation component theme
   */
  private validateNavigationTheme(navigationTheme: any): void {
    if (!navigationTheme) {
      this.addError('missing_property', 'componentThemes.navigation', 'Missing navigation component theme');
      return;
    }

    const requiredProps = ['backgroundColor', 'height', 'padding', 'accentColor'];
    requiredProps.forEach(prop => {
      if (!navigationTheme[prop]) {
        this.addError('missing_property', `componentThemes.navigation.${prop}`, `Missing navigation ${prop}`);
      }
    });
  }

  /**
   * Validate accessibility compliance
   */
  private validateAccessibility(theme: Theme, level: 'AA' | 'AAA' = 'AA'): void {
    this.validateColorContrast(theme, level);
    this.validateTouchTargets(theme);
    this.validateFocusIndicators(theme);
  }

  /**
   * Validate color contrast ratios
   */
  private validateColorContrast(theme: Theme, level: 'AA' | 'AAA'): void {
    const colors = theme.colors;
    if (!colors) return;

    // Check primary color contrast
    if (colors.primary?.main && colors.primary?.contrast) {
      const contrast = calculateContrastRatio(colors.primary.contrast, colors.primary.main);
      const required = CONTRAST_REQUIREMENTS[level].normal;
      
      if (contrast < required) {
        this.addError(
          'contrast_failure',
          'colors.primary',
          `Primary color contrast ratio ${contrast.toFixed(2)} is below ${level} standard (${required})`,
          `Consider using a darker or lighter contrast color`
        );
      }
    }

    // Check secondary color contrast
    if (colors.secondary?.main && colors.secondary?.contrast) {
      const contrast = calculateContrastRatio(colors.secondary.contrast, colors.secondary.main);
      const required = CONTRAST_REQUIREMENTS[level].normal;
      
      if (contrast < required) {
        this.addError(
          'contrast_failure',
          'colors.secondary',
          `Secondary color contrast ratio ${contrast.toFixed(2)} is below ${level} standard (${required})`,
          `Consider using a darker or lighter contrast color`
        );
      }
    }
  }

  /**
   * Validate touch target sizes
   */
  private validateTouchTargets(theme: Theme): void {
    const accessibility = theme.accessibility;
    const minTouchTarget = accessibility?.minTouchTarget || 44;

    if (minTouchTarget < 44) {
      this.addWarning(
        'accessibility',
        'accessibility.minTouchTarget',
        `Minimum touch target ${minTouchTarget}px is below WCAG recommendation (44px)`,
        'Set minTouchTarget to at least 44px for better accessibility'
      );
    }

    // Check button minimum heights
    const buttonTheme = theme.componentThemes?.button;
    if (buttonTheme?.minHeight) {
      Object.entries(buttonTheme.minHeight).forEach(([size, height]) => {
        if (typeof height === 'number' && height < 44) {
          this.addWarning(
            'accessibility',
            `componentThemes.button.minHeight.${size}`,
            `Button ${size} height ${height}px is below recommended 44px`,
            'Consider increasing button height for better touch accessibility'
          );
        }
      });
    }
  }

  /**
   * Validate focus indicators
   */
  private validateFocusIndicators(theme: Theme): void {
    const accessibility = theme.accessibility;
    if (!accessibility?.focusRing) {
      this.addWarning(
        'accessibility',
        'accessibility.focusRing',
        'Missing focus ring configuration for keyboard navigation',
        'Add focusRing configuration for better keyboard accessibility'
      );
    }
  }

  /**
   * Validate theme consistency
   */
  private validateConsistency(theme: Theme): void {
    this.validateColorConsistency(theme);
    this.validateSpacingConsistency(theme);
    this.validateTypographyConsistency(theme);
  }

  /**
   * Validate color consistency
   */
  private validateColorConsistency(theme: Theme): void {
    // Check if role-specific colors follow the same pattern
    const colors = theme.colors;
    if (!colors) return;

    // Validate that all role colors have the same structure
    const roleColors = ['student', 'teacher', 'parent', 'management'];
    roleColors.forEach(role => {
      const roleColor = (colors as any)[role];
      if (roleColor) {
        if (!roleColor.primary) {
          this.addWarning('consistency', `colors.${role}.primary`, `Missing primary color for ${role} role`);
        }
        if (!roleColor.secondary) {
          this.addWarning('consistency', `colors.${role}.secondary`, `Missing secondary color for ${role} role`);
        }
      }
    });
  }

  /**
   * Validate spacing consistency
   */
  private validateSpacingConsistency(theme: Theme): void {
    const spacing = theme.spacing?.base;
    if (!spacing) return;

    // Check if spacing values follow a consistent scale
    const spacingValues = Object.values(spacing).filter(v => typeof v === 'number') as number[];
    if (spacingValues.length > 1) {
      const ratios = [];
      for (let i = 1; i < spacingValues.length; i++) {
        ratios.push(spacingValues[i] / spacingValues[i - 1]);
      }
      
      // Check if ratios are consistent (within 20% variance)
      const avgRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
      const hasInconsistentRatios = ratios.some(ratio => Math.abs(ratio - avgRatio) / avgRatio > 0.2);
      
      if (hasInconsistentRatios) {
        this.addWarning(
          'consistency',
          'spacing.base',
          'Spacing values do not follow a consistent scale',
          'Consider using a consistent ratio between spacing values (e.g., 1.5x or 2x)'
        );
      }
    }
  }

  /**
   * Validate typography consistency
   */
  private validateTypographyConsistency(theme: Theme): void {
    const typography = theme.typography;
    if (!typography?.fontSize) return;

    // Check if font sizes follow a consistent scale
    const fontSizes = Object.values(typography.fontSize).filter(v => typeof v === 'number') as number[];
    if (fontSizes.length > 1) {
      const sortedSizes = [...fontSizes].sort((a, b) => a - b);
      const ratios = [];
      
      for (let i = 1; i < sortedSizes.length; i++) {
        ratios.push(sortedSizes[i] / sortedSizes[i - 1]);
      }
      
      // Check if ratios are consistent
      const avgRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
      const hasInconsistentRatios = ratios.some(ratio => Math.abs(ratio - avgRatio) / avgRatio > 0.15);
      
      if (hasInconsistentRatios) {
        this.addWarning(
          'consistency',
          'typography.fontSize',
          'Font sizes do not follow a consistent typographic scale',
          'Consider using a consistent ratio between font sizes (e.g., 1.25x or 1.414x)'
        );
      }
    }
  }

  /**
   * Calculate validation summary scores
   */
  private calculateValidationSummary(theme: Theme): ValidationSummary {
    const totalErrors = this.errors.length;
    const totalWarnings = this.warnings.length;

    // Calculate accessibility score (0-100)
    const accessibilityErrors = this.errors.filter(e => e.type === 'contrast_failure').length;
    const accessibilityWarnings = this.warnings.filter(w => w.type === 'accessibility').length;
    const accessibilityScore = Math.max(0, 100 - (accessibilityErrors * 20) - (accessibilityWarnings * 5));

    // Calculate completeness score (0-100)
    const missingPropertyErrors = this.errors.filter(e => e.type === 'missing_property').length;
    const completenessScore = Math.max(0, 100 - (missingPropertyErrors * 10));

    // Calculate consistency score (0-100)
    const consistencyWarnings = this.warnings.filter(w => w.type === 'consistency').length;
    const consistencyScore = Math.max(0, 100 - (consistencyWarnings * 8));

    return {
      totalErrors,
      totalWarnings,
      accessibilityScore,
      completenessScore,
      consistencyScore,
    };
  }

  /**
   * Helper methods for adding errors and warnings
   */
  private addError(
    type: ValidationError['type'],
    path: string,
    message: string,
    suggestion?: string
  ): void {
    this.errors.push({
      type,
      path,
      message,
      severity: 'error',
      suggestion,
    });
  }

  private addWarning(
    type: ValidationWarning['type'],
    path: string,
    message: string,
    suggestion?: string
  ): void {
    this.warnings.push({
      type,
      path,
      message,
      suggestion,
    });
  }
}

// Validation options interface
export interface ValidationOptions {
  checkAccessibility?: boolean;
  checkCompleteness?: boolean;
  checkConsistency?: boolean;
  contrastLevel?: 'AA' | 'AAA';
}

// Export validation function for easy use
export function validateTheme(theme: Theme, options?: ValidationOptions): ValidationResult {
  const validator = new ThemeValidator();
  return validator.validateTheme(theme, options);
}
