/**
 * Input Component
 * Consistent form input implementation with validation, states, and accessibility
 */

import React, { useState, useRef, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors, useComponentTheme } from '../../../context/ThemeContext';

// Input Props Interface
export interface InputProps extends Omit<TextInputProps, 'style'> {
  // Label and helper text
  label?: string;
  helperText?: string;
  errorText?: string;
  
  // Input states
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  
  // Icons
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  
  // Input variants
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  
  // Custom styling
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
  
  // Validation
  showCharacterCount?: boolean;
  maxLength?: number;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Input Component with forwardRef for TextInput ref access
export const Input = forwardRef<TextInput, InputProps>(({
  label,
  helperText,
  errorText,
  error = false,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  inputStyle,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  showCharacterCount = false,
  maxLength,
  accessibilityLabel,
  accessibilityHint,
  onFocus,
  onBlur,
  value,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  // Handle focus events
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Handle value changes for character count
  const handleChangeText = (text: string) => {
    setInternalValue(text);
    props.onChangeText?.(text);
  };

  // Get current value for character count
  const currentValue = value !== undefined ? value : internalValue;

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: theme.spacing.base.sm,
    };

    return {
      ...baseStyle,
      opacity: disabled ? 0.6 : 1,
    };
  };

  // Get input container styles
  const getInputContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
    };

    // Size-specific styles
    const sizeStyles = {
      small: {
        minHeight: 36,
        paddingHorizontal: theme.spacing.base.sm,
        paddingVertical: theme.spacing.base.xs,
      },
      medium: {
        minHeight: 40,
        paddingHorizontal: theme.spacing.base.md,
        paddingVertical: theme.spacing.base.sm,
      },
      large: {
        minHeight: 48,
        paddingHorizontal: theme.spacing.base.lg,
        paddingVertical: theme.spacing.base.md,
      },
    };

    // Variant-specific styles
    const variantStyles = {
      outlined: {
        backgroundColor: disabled ? colors.interactive.disabled : colors.surface.primary,
        borderColor: error 
          ? colors.border.error 
          : isFocused 
            ? colors.border.focus 
            : colors.border.primary,
      },
      filled: {
        backgroundColor: disabled 
          ? colors.interactive.disabled 
          : isFocused 
            ? colors.surface.primary 
            : colors.surface.secondary,
        borderColor: error 
          ? colors.border.error 
          : 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  // Get input text styles
  const getInputTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal as TextStyle['fontWeight'],
      color: disabled ? colors.text.disabled : colors.text.primary,
      lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    };

    // Size-specific text styles
    const sizeTextStyles = {
      small: {
        fontSize: theme.typography.fontSize.sm,
        lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      },
      medium: {
        fontSize: theme.typography.fontSize.base,
        lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
      },
      large: {
        fontSize: theme.typography.fontSize.lg,
        lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
      },
    };

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
    };
  };

  // Get label styles
  const getLabelStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium as TextStyle['fontWeight'],
      color: error ? colors.error.main : colors.text.primary,
      marginBottom: theme.spacing.base.xs,
    };
  };

  // Get helper text styles
  const getHelperTextStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: theme.spacing.base.xs,
    };
  };

  // Get error text styles
  const getErrorTextStyles = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.xs,
      color: colors.error.main,
      marginTop: theme.spacing.base.xs,
    };
  };

  // Get icon size based on input size
  const getIconSize = (): number => {
    const iconSizes = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return iconSizes[size];
  };

  // Get icon color
  const getIconColor = (): string => {
    if (disabled) return colors.text.disabled;
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.text.secondary;
  };

  // Render left icon
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <Ionicons
        name={leftIcon}
        size={getIconSize()}
        color={getIconColor()}
        style={styles.leftIcon}
      />
    );
  };

  // Render right icon
  const renderRightIcon = () => {
    if (!rightIcon) return null;

    const IconComponent = onRightIconPress ? TouchableOpacity : View;

    return (
      <IconComponent
        onPress={onRightIconPress}
        disabled={disabled}
        style={styles.rightIconContainer}
      >
        <Ionicons
          name={rightIcon}
          size={getIconSize()}
          color={getIconColor()}
        />
      </IconComponent>
    );
  };

  // Render character count
  const renderCharacterCount = () => {
    if (!showCharacterCount || !maxLength) return null;

    const count = currentValue.length;
    const isOverLimit = count > maxLength;

    return (
      <Text style={[
        getHelperTextStyles(),
        { textAlign: 'right' },
        isOverLimit && { color: colors.error.main }
      ]}>
        {count}/{maxLength}
      </Text>
    );
  };

  // Render label
  const renderLabel = () => {
    if (!label) return null;

    return (
      <Text style={[getLabelStyles(), labelStyle]}>
        {label}
        {required && <Text style={{ color: colors.error.main }}> *</Text>}
      </Text>
    );
  };

  // Render helper text or error text
  const renderHelperText = () => {
    if (error && errorText) {
      return (
        <View style={styles.helperTextContainer}>
          <Text style={[getErrorTextStyles(), errorTextStyle]}>
            {errorText}
          </Text>
          {renderCharacterCount()}
        </View>
      );
    }

    if (helperText || showCharacterCount) {
      return (
        <View style={styles.helperTextContainer}>
          {helperText && (
            <Text style={[getHelperTextStyles(), helperTextStyle]}>
              {helperText}
            </Text>
          )}
          {renderCharacterCount()}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[getContainerStyles(), containerStyle]}>
      {renderLabel()}
      
      <View style={getInputContainerStyles()}>
        {renderLeftIcon()}
        
        <TextInput
          ref={ref}
          style={[getInputTextStyles(), inputStyle]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          maxLength={maxLength}
          placeholderTextColor={colors.text.tertiary}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled,
          }}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {renderHelperText()}
    </View>
  );
});

// Set display name for debugging
Input.displayName = 'Input';

// Internal styles
const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
    padding: 4,
  },
  helperTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

// Export default
export default Input;