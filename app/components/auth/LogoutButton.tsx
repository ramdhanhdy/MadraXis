import React, { useState } from 'react';
import { Alert, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/atoms/Button';
import { Ionicons } from '@expo/vector-icons';

interface LogoutButtonProps {
  style?: ViewStyle;
  showIcon?: boolean;
  variant?: 'button' | 'text' | 'icon';
  onLogout?: () => void;
}

export default function LogoutButton({ 
  style, 
  showIcon = true, 
  variant = 'button',
  onLogout 
}: LogoutButtonProps) {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
              if (onLogout) {
                onLogout();
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'Gagal keluar dari aplikasi. Silakan coba lagi.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <Button
        variant={variant === 'icon' ? 'ghost' : 'danger'}
        size={variant === 'icon' ? 'small' : 'medium'}
        disabled
        loading
        style={style}
      >
        Keluar
      </Button>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="small"
        iconOnly
        icon="log-out-outline"
        onPress={handleLogout}
        style={style}
        accessibilityLabel="Logout"
        accessibilityHint="Keluar dari aplikasi"
      >
        Logout
      </Button>
    );
  }

  if (variant === 'text') {
    return (
      <Button
        variant="ghost"
        size="medium"
        icon={showIcon ? 'log-out-outline' : undefined}
        iconPosition="left"
        onPress={handleLogout}
        style={style}
      >
        Keluar
      </Button>
    );
  }

  return (
    <Button
      variant="danger"
      size="medium"
      icon={showIcon ? 'log-out-outline' : undefined}
      iconPosition="left"
      onPress={handleLogout}
      style={style}
    >
      Keluar
    </Button>
  );
}
