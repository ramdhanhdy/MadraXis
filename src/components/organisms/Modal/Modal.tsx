/**
 * Modal Component
 * Consistent overlay component with header structure, close buttons, and content layouts
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';

// Modal size type
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

// Modal action interface
export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

// Modal Props Interface
export interface ModalProps {
  // Visibility
  visible: boolean;
  onClose: () => void;
  
  // Content
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  
  // Actions
  actions?: ModalAction[];
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnBackButton?: boolean;
  
  // Layout
  size?: ModalSize;
  scrollable?: boolean;
  
  // Animation
  animationType?: 'slide' | 'fade' | 'none';
  animationDuration?: number;
  
  // Styling
  backgroundColor?: string;
  backdropColor?: string;
  backdropOpacity?: number;
  
  // Keyboard
  keyboardAvoidingBehavior?: 'height' | 'position' | 'padding';
  
  // Custom styling
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  
  // Test ID
  testID?: string;
}

// Modal Component
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  actions = [],
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnBackButton = true,
  size = 'medium',
  scrollable = true,
  animationType = 'slide',
  animationDuration = 300,
  backgroundColor,
  backdropColor,
  backdropOpacity = 0.5,
  keyboardAvoidingBehavior = 'padding',
  style,
  contentStyle,
  headerStyle,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useColors();
  const screenDimensions = Dimensions.get('window');
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(screenDimensions.height)).current;

  // Handle modal visibility changes
  React.useEffect(() => {
    if (visible) {
      // Show modal
      if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      }
    } else {
      // Hide modal
      if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: screenDimensions.height,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, animationType, animationDuration, fadeAnim, slideAnim, screenDimensions.height]);

  // Get modal dimensions based on size
  const getModalDimensions = () => {
    const { width, height } = screenDimensions;
    
    switch (size) {
      case 'small':
        return {
          width: Math.min(400, width * 0.9),
          maxHeight: height * 0.6,
        };
      case 'medium':
        return {
          width: Math.min(500, width * 0.9),
          maxHeight: height * 0.8,
        };
      case 'large':
        return {
          width: Math.min(700, width * 0.95),
          maxHeight: height * 0.9,
        };
      case 'fullscreen':
        return {
          width: width,
          height: height,
        };
      default:
        return {
          width: Math.min(500, width * 0.9),
          maxHeight: height * 0.8,
        };
    }
  };

  // Get backdrop styles
  const getBackdropStyles = (): ViewStyle => {
    return {
      flex: 1,
      backgroundColor: backdropColor || `rgba(0, 0, 0, ${backdropOpacity})`,
      justifyContent: size === 'fullscreen' ? 'flex-start' : 'center',
      alignItems: 'center',
      padding: size === 'fullscreen' ? 0 : theme.spacing.base.md,
    };
  };

  // Get modal container styles
  const getModalContainerStyles = (): ViewStyle => {
    const dimensions = getModalDimensions();
    
    const baseStyle: ViewStyle = {
      backgroundColor: backgroundColor || colors.surface.primary,
      borderRadius: size === 'fullscreen' ? 0 : theme.borderRadius.xl,
      ...theme.shadows.modal,
      overflow: 'hidden',
    };

    if (size === 'fullscreen') {
      return {
        ...baseStyle,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    return {
      ...baseStyle,
      width: dimensions.width,
      maxHeight: dimensions.maxHeight,
    };
  };

  // Get header styles
  const getHeaderStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      minHeight: 60,
    };
  };

  // Get content styles
  const getContentStyles = (): ViewStyle => {
    return {
      flex: 1,
      padding: theme.spacing.base.lg,
    };
  };

  // Get actions container styles
  const getActionsStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderTopWidth: actions.length > 0 ? 1 : 0,
      borderTopColor: colors.border.primary,
      gap: theme.spacing.base.sm,
    };
  };

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  // Render header
  const renderHeader = () => {
    if (!title && !showCloseButton) return null;
    
    return (
      <View style={[getHeaderStyles(), headerStyle]}>
        <View style={{ flex: 1 }}>
          {title && (
            <Typography
              variant="h4"
              color="primary"
              weight="semibold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography
              variant="body2"
              color="secondary"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ marginTop: 2 }}
            >
              {subtitle}
            </Typography>
          )}
        </View>
        
        {showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
            accessibilityHint="Closes the modal dialog"
            testID="modal-close-button"
            activeOpacity={0.7}
          >
            <Icon
              name="close"
              size="md"
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render actions
  const renderActions = () => {
    if (actions.length === 0) return null;
    
    return (
      <View style={getActionsStyles()}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'primary'}
            size="medium"
            onPress={action.onPress}
            disabled={action.disabled}
            loading={action.loading}
            testID={action.testID}
          >
            {action.label}
          </Button>
        ))}
      </View>
    );
  };

  // Render modal content
  const renderModalContent = () => {
    const ContentWrapper = scrollable ? 
      ({ children: wrapperChildren }: { children: React.ReactNode }) => (
        <View style={{ flex: 1 }}>
          {wrapperChildren}
        </View>
      ) : 
      ({ children: wrapperChildren }: { children: React.ReactNode }) => (
        <View style={{ flex: 1 }}>
          {wrapperChildren}
        </View>
      );

    let animatedStyle = {};
    if (animationType === 'fade') {
      animatedStyle = { opacity: fadeAnim };
    } else if (animationType === 'slide') {
      animatedStyle = { transform: [{ translateY: slideAnim }] };
    }

    return (
      <Animated.View style={[getModalContainerStyles(), animatedStyle, style]}>
        {renderHeader()}
        
        <ContentWrapper>
          <View style={[getContentStyles(), contentStyle]}>
            {children}
          </View>
        </ContentWrapper>
        
        {renderActions()}
      </Animated.View>
    );
  };

  // Render keyboard avoiding view wrapper
  const renderWithKeyboardAvoidance = (content: React.ReactNode) => {
    if (Platform.OS === 'ios' && keyboardAvoidingBehavior) {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={keyboardAvoidingBehavior}
          keyboardVerticalOffset={StatusBar.currentHeight || 0}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }
    
    return content;
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none" // We handle animations manually
      onRequestClose={closeOnBackButton ? onClose : undefined}
      statusBarTranslucent
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel || title || 'Modal dialog'}
      testID={testID}
    >
      {renderWithKeyboardAvoidance(
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={getBackdropStyles()}>
            <TouchableWithoutFeedback>
              {renderModalContent()}
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </RNModal>
  );
};

// Internal styles
const styles = StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 8,
  },
});

// Export default
export default Modal;