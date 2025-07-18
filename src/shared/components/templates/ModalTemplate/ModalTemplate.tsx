/**
 * ModalTemplate Component
 * Consistent modal template with header, content, and action areas
 */

import React from 'react';
import {
  View,
  ScrollView,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '@/src/context/ThemeContext';
import { Modal } from '@/src/shared/components/organisms/Modal';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Button } from '@/src/shared/components/atoms/Button';

// Action button interface
export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

// ModalTemplate Props Interface
export interface ModalTemplateProps {
  // Modal visibility
  visible: boolean;
  onClose: () => void;
  
  // Header configuration
  title: string;
  subtitle?: string;
  showCloseButton?: boolean;
  
  // Content
  children: React.ReactNode;
  
  // Actions
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  actions?: ModalAction[];
  
  // Layout options
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  scrollable?: boolean;
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

// ModalTemplate Component
export const ModalTemplate: React.FC<ModalTemplateProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  showCloseButton = true,
  children,
  primaryAction,
  secondaryAction,
  actions,
  size = 'medium',
  scrollable = true,
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

  // Get header styles
  const getHeaderStyles = (): ViewStyle => {
    return {
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.surface.primary,
    };
  };

  // Get content styles
  const getContentStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor: colors.surface.primary,
    };

    if (contentPadding) {
      baseStyle.paddingHorizontal = theme.spacing.base.lg;
      baseStyle.paddingVertical = theme.spacing.base.md;
    }

    return baseStyle;
  };

  // Get actions styles
  const getActionsStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
      backgroundColor: colors.surface.primary,
      gap: theme.spacing.base.sm,
    };
  };

  // Render header
  const renderHeader = () => {
    return (
      <View style={[getHeaderStyles(), headerStyle]}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Typography
              variant="h4"
              color="primary"
              weight="semibold"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="secondary"
                style={{ marginTop: 4 }}
              >
                {subtitle}
              </Typography>
            )}
          </View>
          
          {showCloseButton && (
            <Button
              variant="ghost"
              size="small"
              icon="close"
              onPress={onClose}
              accessibilityLabel="Close modal"
              testID={testID ? `${testID}-close-button` : 'modal-close-button'}
            >
              Close
            </Button>
          )}
        </View>
      </View>
    );
  };

  // Render content
  const renderContent = () => {
    const contentContainer = (
      <View style={[getContentStyles(), contentStyle]}>
        {children}
      </View>
    );

    if (scrollable) {
      return (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          testID={testID ? `${testID}-scroll` : 'modal-scroll'}
        >
          {contentContainer}
        </ScrollView>
      );
    }

    return contentContainer;
  };

  // Render actions
  const renderActions = () => {
    // Combine primary/secondary actions with additional actions
    const allActions: ModalAction[] = [];
    
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

    return (
      <View style={[getActionsStyles(), actionsStyle]}>
        {allActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || (index === allActions.length - 1 ? 'primary' : 'outline')}
            size="medium"
            icon={action.icon}
            loading={action.loading}
            disabled={action.disabled}
            onPress={action.onPress}
            testID={testID ? `${testID}-action-${index}` : `modal-action-${index}`}
          >
            {action.label}
          </Button>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      size={size}
      style={style}
      accessibilityLabel={accessibilityLabel || `${title} modal`}
      testID={testID || 'modal-template'}
    >
      <View style={styles.container}>
        {renderHeader()}
        {renderContent()}
        {renderActions()}
      </View>
    </Modal>
  );
};

// Internal styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
});

// Export default
export default ModalTemplate;