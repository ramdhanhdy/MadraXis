import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useColors } from '@/src/context/ThemeContext';

import { Typography } from '@/src/shared/components/atoms/Typography';

export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  onPress?: (id: string) => void;
  testID?: string;
}

const ICON_MAP: Record<NotificationItemProps['type'], keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'warning',
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, title, message, timestamp, type, read, onPress, testID }) => {
  const { theme } = useTheme();
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: theme.spacing.base.md,
      alignItems: 'flex-start',
      backgroundColor: colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    iconContainer: {
      marginRight: theme.spacing.base.md,
      marginTop: theme.spacing.base.xs,
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.base.xs,
    },
    title: {
      flex: 1,
    },
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary.main,
      marginLeft: theme.spacing.base.sm,
    },
    message: {
      marginBottom: theme.spacing.base.sm,
    },
    timestamp: {
      alignSelf: 'flex-end',
    },
  });

  const typeColor = colors[type]?.main || colors.text.primary;

  return (
    <TouchableOpacity onPress={() => onPress?.(id)} disabled={!onPress} testID={testID}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name={ICON_MAP[type]} size={24} color={typeColor} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
                      <Typography variant="body1" style={styles.title} numberOfLines={1}>
              {title}
            </Typography>
            {!read && <View style={styles.unreadIndicator} testID={`${testID}-unread-indicator`} />}
          </View>
          <Typography variant="body2" style={styles.message} color="secondary">
            {message}
          </Typography>
          <Typography variant="caption" color="tertiary" style={styles.timestamp}>
            {timestamp}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};
