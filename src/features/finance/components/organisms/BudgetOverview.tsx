import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { ProgressRing } from '@/src/shared/components/atoms/ProgressRing';
import { utils } from '@/src/features/finance/services/finance.service';

interface BudgetOverviewProps {
  dashboardSummary?: {
    total_budget: number;
    total_spent: number;
    total_remaining: number;
  };
  onAdjustBudget: () => void;
  isLoading?: boolean;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  dashboardSummary,
  onAdjustBudget,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading budget...</Text>
        </View>
      </View>
    );
  }

  if (!dashboardSummary) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No budget data available</Text>
        </View>
      </View>
    );
  }

  const budgetProgress = dashboardSummary.total_budget > 0 
    ? (dashboardSummary.total_spent / dashboardSummary.total_budget) * 100 
    : 0;

  const getProgressColor = () => {
    if (dashboardSummary.total_budget === 0) return theme.colors.neutral[300];
    if (budgetProgress > 95) return theme.colors.error.main;
    if (budgetProgress > 80) return theme.colors.warning.main;
    return theme.colors.success.main;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Overview</Text>
        <TouchableOpacity onPress={onAdjustBudget}>
          <Ionicons 
            name="settings-outline" 
            size={20} 
            color={theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <ProgressRing
          progress={budgetProgress}
          size={120}
          strokeWidth={12}
          color={getProgressColor()}
        />
        
        <View style={styles.info}>
          <Text style={styles.amount}>
            {utils.formatCurrency(dashboardSummary.total_spent)} / {utils.formatCurrency(dashboardSummary.total_budget)}
          </Text>
          <Text style={styles.subtext}>
            {utils.formatCurrency(dashboardSummary.total_remaining)} left • {utils.getDaysRemainingInMonth()} days remaining
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  content: {
    alignItems: 'center',
  },
  info: {
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
  },
});

export default BudgetOverview;
