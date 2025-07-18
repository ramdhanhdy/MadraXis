import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/styles/colors';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDuplicate: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({ children, onDuplicate }) => {
  const renderRightAction = (progress: Animated.AnimatedInterpolation<string>) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          style={styles.duplicateButton}
          onPress={onDuplicate}
          accessibilityLabel="Duplicate expense"
          accessibilityRole="button"
        >
          <Ionicons name="duplicate-outline" size={24} color={colors.white} />
          <Text style={styles.actionText}>Duplicate</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightAction}
      rightThreshold={40}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    height: 80,
    width: 100,
  },
  duplicateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  actionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default SwipeableRow;