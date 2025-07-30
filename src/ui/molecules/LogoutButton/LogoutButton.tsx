import { logger } from '@lib/utils/logger';
/**
 * LogoutButton Component
 * A reusable logout button component with confirmation alert, loading state, and variants
 * Integrates with auth store for sign-out functionality
 */

import React, { useState } from 'react';
import { Alert, ViewStyle } from 'react-native';
import { Button } from '@ui/atoms/Button';
import { useAuth } from '@lib/hooks/useAuth';

export interface LogoutButtonProps {
  variant?: 'button' | 'text' | 'icon';
  style?: ViewStyle;
  showConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  onLogoutStart?: () => void;
  onLogoutComplete?: () => void;
  onLogoutError?: (error: Error) => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'button',
  style,
  showConfirmation = true,
  confirmationTitle = 'Konfirmasi Logout',
  confirmationMessage = 'Apakah Anda yakin ingin keluar dari aplikasi?',
  onLogoutStart,
  onLogoutComplete,
  onLogoutError
}) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      onLogoutStart?.();

      await signOut();

      onLogoutComplete?.();
    } catch (error) {
      logger.error('Logout error', {
        error: error instanceof Error ? error.message : String(error),
        operation: 'logout'
      });
      onLogoutError?.(error as Error);

      Alert.alert(
        'Error',
        'Terjadi kesalahan saat logout. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    if (showConfirmation) {
      Alert.alert(
        confirmationTitle,
        confirmationMessage,
        [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout
        }]

      );
    } else {
      handleLogout();
    }
  };

  // Render based on variant
  switch (variant) {
    case 'icon':
      return (
        <Button
          variant="outline"
          icon="log-out"
          iconOnly
          loading={loading}
          onPress={confirmLogout}
          style={style}
          accessibilityLabel="Logout"
          accessibilityHint="Keluar dari aplikasi">
          
          {null}
        </Button>);


    case 'text':
      return (
        <Button
          variant="ghost"
          loading={loading}
          onPress={confirmLogout}
          style={style}
          accessibilityLabel="Logout"
          accessibilityHint="Keluar dari aplikasi">
          
          Logout
        </Button>);


    default:
      return (
        <Button
          variant="danger"
          icon="log-out"
          iconPosition="left"
          loading={loading}
          onPress={confirmLogout}
          style={style}
          accessibilityLabel="Logout"
          accessibilityHint="Keluar dari aplikasi">
          
          Logout
        </Button>);

  }
};

export default LogoutButton;