import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const styles = createStyles(theme);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton components for specific layouts
export const SkeletonExpenseCard: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseCardHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.expenseCardContent}>
          <SkeletonLoader width="60%" height={16} />
          <SkeletonLoader width="40%" height={14} style={{ marginTop: 4 }} />
        </View>
        <SkeletonLoader width="25%" height={18} />
      </View>
    </View>
  );
};

export const SkeletonProgressRing: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.progressRing}>
      <SkeletonLoader width={120} height={120} borderRadius={60} />
      <View style={styles.progressRingText}>
        <SkeletonLoader width="80%" height={16} />
        <SkeletonLoader width="60%" height={14} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
};

export const SkeletonFinanceHub: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.financeHub}>
      {/* Search bar skeleton */}
      <SkeletonLoader width="100%" height={48} borderRadius={24} style={{ marginBottom: theme.spacing.md }} />
      
      {/* Filter chips skeleton */}
      <View style={styles.filterChips}>
        <SkeletonLoader width={80} height={32} borderRadius={16} />
        <SkeletonLoader width={90} height={32} borderRadius={16} />
        <SkeletonLoader width={100} height={32} borderRadius={16} />
      </View>
      
      {/* Progress ring skeleton */}
      <View style={styles.progressSection}>
        <SkeletonProgressRing />
      </View>
      
      {/* Recent expenses skeleton */}
      <View style={styles.expensesSection}>
        <SkeletonLoader width="40%" height={20} style={{ marginBottom: theme.spacing.md }} />
        <SkeletonExpenseCard />
        <SkeletonExpenseCard />
        <SkeletonExpenseCard />
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.surface.secondary,
  },
  expenseCard: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  expenseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseCardContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  progressRing: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  progressRingText: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  financeHub: {
    flex: 1,
    padding: theme.spacing.md,
  },
  filterChips: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  expensesSection: {
    flex: 1,
  },
});

export default SkeletonLoader;
