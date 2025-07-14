import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, View, ViewStyle, StyleProp } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface LogoutButtonProps {
  style?: StyleProp<ViewStyle>;
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
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color="#ff4444" />
      </View>
    );
  }

  if (variant === 'icon') {
    return (
      <TouchableOpacity onPress={handleLogout} style={[styles.iconContainer, style]}>
        <Ionicons name="log-out-outline" size={24} color="#ff4444" />
      </TouchableOpacity>
    );
  }

  if (variant === 'text') {
    return (
      <TouchableOpacity onPress={handleLogout} style={[styles.textContainer, style]}>
        {showIcon && <Ionicons name="log-out-outline" size={16} color="#ff4444" style={styles.icon} />}
        <Text style={styles.text}>Keluar</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handleLogout} style={[styles.button, style]}>
      {showIcon && <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.buttonIcon} />}
      <Text style={styles.buttonText}>Keluar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
});
