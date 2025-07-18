/**
 * Typography Component
 * Consistent text rendering with all variants, colors, and styling options
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme, useColors, useTypography } from '../../../context/ThemeContext';

// Typography Props Interface
export interface TypographyProps extends Omit<TextProps, 'style'> {
  // Content
  children: React.ReactNode;
  
  // Typography variants
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline' | 'button' | 'buttonSmall' | 'buttonLarge';
  
  // Color options
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse' | 'success' | 'warning' | 'error' | string;
  
  // Text alignment
  align?: 'left' | 'center' | 'right' | 'justify';
  
  // Font weight override
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  // Text transform
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Text decoration
  decoration?: 'none' | 'underline' | 'line-through';
  
  // Line height override
  lineHeight?: 'tight' | 'normal' | 'relaxed' | number;
  
  // Font size override (use sparingly)
  fontSize?: number;
  
  // Truncation
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  
  // Custom styling
  style?: TextStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'text' | 'header' | 'link' | 'button';
}

// Typography Component
export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight,
  transform = 'none',
  decoration = 'none',
  lineHeight,
  fontSize,
  numberOfLines,
  ellipsizeMode = 'tail',
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  const typography = useTypography();

  // Get base typography styles for the variant
  const getVariantStyles = (): TextStyle => {
    const variantStyle = typography.variants[variant];
    
    return {
      fontSize: fontSize || variantStyle.fontSize,
      fontWeight: weight ? theme.typography.fontWeight[weight] as TextStyle['fontWeight'] : variantStyle.fontWeight as TextStyle['fontWeight'],
      lineHeight: getLineHeight(variantStyle),
      letterSpacing: variantStyle.letterSpacing,
      ...((variantStyle as any).textTransform && { textTransform: (variantStyle as any).textTransform as TextStyle['textTransform'] }),
    };
  };

  // Calculate line height
  const getLineHeight = (variantStyle: typeof typography.variants[keyof typeof typography.variants]): number => {
    if (typeof lineHeight === 'number') {
      return lineHeight;
    }
    
    if (lineHeight) {
      const lineHeightMultiplier = theme.typography.lineHeight[lineHeight];
      return (fontSize || variantStyle.fontSize) * lineHeightMultiplier;
    }
    
    return variantStyle.lineHeight * (fontSize || variantStyle.fontSize);
  };

  // Get text color
  const getTextColor = (): string => {
    // If color is a custom hex/rgb value, use it directly
    if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
      return color;
    }

    // Map semantic color names to theme colors
    const colorMap = {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      tertiary: colors.text.tertiary,
      disabled: colors.text.disabled,
      inverse: colors.text.inverse,
      success: colors.success.main,
      warning: colors.warning.main,
      error: colors.error.main,
    };

    return colorMap[color as keyof typeof colorMap] || colors.text.primary;
  };

  // Get accessibility role based on variant
  const getAccessibilityRole = (): TextProps['accessibilityRole'] => {
    if (accessibilityRole) {
      return accessibilityRole;
    }

    // Auto-assign roles based on variant
    if (variant.startsWith('h')) {
      return 'header';
    }
    
    if (variant.includes('button')) {
      return 'button';
    }
    
    return 'text';
  };

  // Combine all styles
  const textStyles: TextStyle = {
    ...getVariantStyles(),
    color: getTextColor(),
    textAlign: align,
    textTransform: transform as TextStyle['textTransform'],
    textDecorationLine: decoration as TextStyle['textDecorationLine'],
  };

  return (
    <Text
      style={[textStyles, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={getAccessibilityRole()}
      {...props}
    >
      {children}
    </Text>
  );
};

// Convenience components for common variants
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

// Export default
export default Typography;