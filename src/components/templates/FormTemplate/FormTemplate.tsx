/**
 * FormTemplate Component
 * Consistent form template with header, form fields, and action buttons
 */

import React from 'react';
import {
  View,
  ScrollView,
  ViewStyle,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { Card } from '../../molecules/Card';

// Form section interface
export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

// Form action interface
export interface FormAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

// FormTemplate Props Interface
export interface FormTemplateProps {
  // Header configuration
  title: string;
  subtitle?: string;
  description?: string;
  
  // Form content
  children?: React.ReactNode;
  sections?: FormSection[];
  
  // Actions
  primaryAction?: FormAction;
  secondaryAction?: FormAction;
  actions?: FormAction[];
  
  // Layout options
  variant?: 'default' | 'card' | 'modal';
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  contentPadding?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  actionsStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// FormTemplate Component
export const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  subtitle,
  description,
  children,
  sections,
  primaryAction,
  secondaryAction,
  actions,
  variant = 'default',
  scrollable = true,
  keyboardAvoiding = true,
  contentPadding = true,
  style,
  headerStyle,
  contentStyle,
  actionsStyle,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();

  // Get container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor: colors.background.primary,
    };

    if (variant === 'card') {
      baseStyle.padding = theme.spacing.base.lg;
      baseStyle.backgroundColor = colors.background.secondary;
    }

    return baseStyle;
  };

  // Get header styles
  const getHeaderStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: theme.spacing.base.lg,
    };

    if (contentPadding && variant !== 'card') {
      baseStyle.paddingHorizontal = theme.spacing.base.lg;
      baseStyle.paddingTop = theme.spacing.base.lg;
    }

    return baseStyle;
  };

  // Get content styles
  const getContentStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
    };

    if (contentPadding && variant !== 'card') {
      baseStyle.paddingHorizontal = theme.spacing.base.lg;
    }

    return baseStyle;
  };

  // Get actions styles
  const getActionsStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginTop: theme.spacing.base.xl,
      gap: theme.spacing.base.sm,
    };

    if (contentPadding && variant !== 'card') {
      baseStyle.paddingHorizontal = theme.spacing.base.lg;
      baseStyle.paddingBottom = theme.spacing.base.lg;
    }

    return baseStyle;
  };

  // Render header
  const renderHeader = () => {
    return (
      <View style={[getHeaderStyles(), headerStyle]}>
        <Typography
          variant="h2"
          color="primary"
          weight="bold"
          style={{ marginBottom: subtitle || description ? theme.spacing.base.xs : 0 }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="h4"
            color="secondary"
            weight="medium"
            style={{ marginBottom: description ? theme.spacing.base.xs : 0 }}
          >
            {subtitle}
          </Typography>
        )}
        
        {description && (
          <Typography
            variant="body1"
            color="secondary"
          >
            {description}
          </Typography>
        )}
      </View>
    );
  };

  // Render form sections
  const renderSections = () => {
    if (!sections || sections.length === 0) return null;

    return (
      <View style={{ gap: theme.spacing.base.lg }}>
        {sections.map((section, index) => (
          <View key={section.id} style={styles.section}>
            {section.title && (
              <Typography
                variant="h4"
                color="primary"
                weight="semibold"
                style={{ marginBottom: theme.spacing.base.sm }}
              >
                {section.title}
              </Typography>
            )}
            
            {section.description && (
              <Typography
                variant="body2"
                color="secondary"
                style={{ marginBottom: theme.spacing.base.md }}
              >
                {section.description}
              </Typography>
            )}
            
            {section.children}
          </View>
        ))}
      </View>
    );
  };

  // Render content
  const renderContent = () => {
    const content = (
      <View style={[getContentStyles(), contentStyle]}>
        {children}
        {renderSections()}
      </View>
    );

    if (variant === 'card') {
      return (
        <Card variant="elevated" padding="large">
          {content}
        </Card>
      );
    }

    return content;
  };

  // Render actions
  const renderActions = () => {
    // Combine primary/secondary actions with additional actions
    const allActions: FormAction[] = [];
    
    if (secondaryAction) {
      allActions.push(secondaryAction);
    }
    
    if (primaryAction) {
      allActions.push(primaryAction);
    }
    
    if (actions) {
      allActions.push(...actions);
    }

    if (allActions.length === 0) return null;

    // Check if any action is full width
    const hasFullWidthAction = allActions.some(action => action.fullWidth);

    return (
      <View style={[getActionsStyles(), actionsStyle]}>
        {hasFullWidthAction ? (
          // Stack actions vertically for full width
          allActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || (index === allActions.length - 1 ? 'primary' : 'outline')}
              size="large"
              icon={action.icon}
              loading={action.loading}
              disabled={action.disabled}
              fullWidth={action.fullWidth}
              onPress={action.onPress}
              testID={testID ? `${testID}-action-${index}` : `form-action-${index}`}
            >
              {action.label}
            </Button>
          ))
        ) : (
          // Horizontal layout for regular actions
          <View style={styles.actionsRow}>
            {allActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || (index === allActions.length - 1 ? 'primary' : 'outline')}
                size="large"
                icon={action.icon}
                loading={action.loading}
                disabled={action.disabled}
                onPress={action.onPress}
                style={{ flex: 1 }}
                testID={testID ? `${testID}-action-${index}` : `form-action-${index}`}
              >
                {action.label}
              </Button>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Main content
  const mainContent = (
    <View style={[getContainerStyles(), style]}>
      {renderHeader()}
      {scrollable ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          testID={testID ? `${testID}-scroll` : 'form-scroll'}
        >
          {renderContent()}
          {renderActions()}
        </ScrollView>
      ) : (
        <>
          {renderContent()}
          {renderActions()}
        </>
      )}
    </View>
  );

  // Wrap with KeyboardAvoidingView if needed
  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        accessibilityLabel={accessibilityLabel || `${title} form`}
        testID={testID || 'form-template'}
      >
        {mainContent}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View
      style={{ flex: 1 }}
      accessibilityLabel={accessibilityLabel || `${title} form`}
      testID={testID || 'form-template'}
    >
      {mainContent}
    </View>
  );
};

// Internal styles
const styles = StyleSheet.create({
  section: {
    // Section styles
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

// Export default
export default FormTemplate;