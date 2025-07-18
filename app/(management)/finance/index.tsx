import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Import services
import { expenses, analytics, search, utils } from '../../../src/services/finance';
import { useAuth } from '../../../src/context/AuthContext';

// Import components (will be created in next steps)
import { ProgressRing } from '../../../src/components/atoms/ProgressRing';
import { ExpenseCard } from '../../../src/components/molecules/ExpenseCard';
import { SearchBar } from '../../../src/components/molecules/SearchBar';

// Import styles
import { colors } from '../../../src/styles/colors';
import { spacing } from '../../../src/styles/spacing';
import { typography } from '../../../src/styles/typography';

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

export default function FinanceHub() {
  const router = useRouter();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterChips, setFilterChips] = useState<FilterChip[]>([
    { id: 'today', label: 'Today', active: false },
    { id: 'yesterday', label: 'Yesterday', active: false },
    { id: 'this_week', label: 'This Week', active: false },
  ]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetTab, setBottomSheetTab] = useState<'expense' | 'budget'>('expense');

  // Queries
  const { data: recentExpenses, isLoading: expensesLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses', 'recent'],
    queryFn: () => expenses.getRecent(),
  });

  const { data: dashboardSummary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => analytics.getDashboardSummary(),
  });

  const { data: budgetHealth, isLoading: budgetLoading } = useQuery({
    queryKey: ['budget', 'health', selectedCategory],
    queryFn: () => selectedCategory ? analytics.getBudgetHealth(selectedCategory) : null,
    enabled: !!selectedCategory,
  });

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await search.searchExpenses(query);
        // Update expenses query with search results
        queryClient.setQueryData(['expenses', 'search', query], results);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  // Handle filter chip selection
  const handleFilterChip = async (chipId: string) => {
    const updatedChips = filterChips.map(chip => ({
      ...chip,
      active: chip.id === chipId ? !chip.active : false
    }));
    setFilterChips(updatedChips);

    const activeChip = updatedChips.find(chip => chip.active);
    if (activeChip) {
      try {
        const results = await search.getExpensesByTimeFilter(activeChip.id as any);
        queryClient.setQueryData(['expenses', 'filtered', activeChip.id], results);
      } catch (error) {
        console.error('Filter error:', error);
      }
    }
  };

  // Handle expense duplicate
  const handleDuplicateExpense = async (expenseId: string) => {
    try {
      await expenses.duplicate(expenseId);
      refetchExpenses();
      Alert.alert('Success', 'Expense duplicated successfully');
    } catch (error) {
      console.error('Duplicate error:', error);
      Alert.alert('Error', 'Failed to duplicate expense');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchExpenses();
    refetchSummary();
  };

  // Open bottom sheet for adding expense
  const openAddExpense = () => {
    setBottomSheetTab('expense');
    setShowBottomSheet(true);
  };

  // Open bottom sheet for budget adjustment
  const openBudgetAdjust = () => {
    setBottomSheetTab('budget');
    setShowBottomSheet(true);
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="wallet-outline" size={80} color={colors.gray[400]} />
      <Text style={styles.emptyStateTitle}>Log your first expense to light up the dashboard</Text>
      <Text style={styles.emptyStateSubtitle}>
        Track your school's financial health with our simple expense logging system
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={openAddExpense}>
        <Text style={styles.emptyStateButtonText}>Add First Expense</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading skeleton
  const renderSkeleton = () => (
    <View style={styles.skeleton}>
      <View style={styles.skeletonCard} />
      <View style={styles.skeletonCard} />
      <View style={styles.skeletonCard} />
    </View>
  );

  if (expensesLoading || summaryLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finance Hub</Text>
        </View>
        {renderSkeleton()}
      </SafeAreaView>
    );
  }

  if (!recentExpenses?.length && !searchQuery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finance Hub</Text>
        </View>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finance Hub</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* Search Bar and Filter Chips */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={colors.gray[400]}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
            {filterChips.map((chip) => (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.filterChip,
                  chip.active && styles.filterChipActive
                ]}
                onPress={() => handleFilterChip(chip.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  chip.active && styles.filterChipTextActive
                ]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Budget Ring Card */}
        {dashboardSummary && (
          <View style={styles.budgetRingCard}>
            <View style={styles.budgetRingHeader}>
              <Text style={styles.budgetRingTitle}>Budget Overview</Text>
              <TouchableOpacity onPress={openBudgetAdjust}>
                <Ionicons name="settings-outline" size={20} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.budgetRingContent}>
              <ProgressRing
                progress={dashboardSummary.total_budget > 0 ? 
                  (dashboardSummary.total_spent / dashboardSummary.total_budget) * 100 : 0}
                size={120}
                strokeWidth={12}
                color={
                  dashboardSummary.total_budget > 0 ?
                    (dashboardSummary.total_spent / dashboardSummary.total_budget) > 0.95 ? colors.red[500] :
                    (dashboardSummary.total_spent / dashboardSummary.total_budget) > 0.8 ? colors.yellow[500] :
                    colors.green[500] : colors.gray[300]
                }
              />
              
              <View style={styles.budgetRingInfo}>
                <Text style={styles.budgetAmount}>
                  {utils.formatCurrency(dashboardSummary.total_spent)} / {utils.formatCurrency(dashboardSummary.total_budget)}
                </Text>
                <Text style={styles.budgetSubtext}>
                  {utils.formatCurrency(dashboardSummary.total_remaining)} left • {utils.getDaysRemainingInMonth()} days remaining
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Expenses */}
        <View style={styles.recentExpensesSection}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          
          {recentExpenses?.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDuplicate={() => handleDuplicateExpense(expense.id)}
            />
          ))}
          
          {recentExpenses?.length === 0 && (
            <Text style={styles.noExpensesText}>No expenses found</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openAddExpense}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Bottom Sheet Modal - Will be implemented in Phase 3 */}
      {showBottomSheet && (
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity 
            style={styles.bottomSheetBackdrop}
            onPress={() => setShowBottomSheet(false)}
          />
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>
              {bottomSheetTab === 'expense' ? 'Log Expense' : 'Adjust Budget'}
            </Text>
            <Text style={styles.bottomSheetSubtitle}>
              Bottom sheet implementation coming in Phase 3
            </Text>
            <TouchableOpacity
              style={styles.bottomSheetCloseButton}
              onPress={() => setShowBottomSheet(false)}
            >
              <Text style={styles.bottomSheetCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    ...typography.h2,
    color: colors.gray[900],
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.gray[900],
  },
  filterChips: {
    flexDirection: 'row' as const,
  },
  filterChip: {
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.blue[500],
  },
  filterChipText: {
    ...typography.caption,
    color: colors.gray[600],
  },
  filterChipTextActive: {
    color: colors.white,
  },
  budgetRingCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetRingHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.lg,
  },
  budgetRingTitle: {
    ...typography.h3,
    color: colors.gray[900],
  },
  budgetRingContent: {
    alignItems: 'center' as const,
  },
  budgetRingInfo: {
    alignItems: 'center' as const,
    marginTop: spacing.md,
  },
  budgetAmount: {
    ...typography.h4,
    color: colors.gray[900],
    textAlign: 'center' as const,
  },
  budgetSubtext: {
    ...typography.caption,
    color: colors.gray[600],
    textAlign: 'center' as const,
    marginTop: spacing.xs,
  },
  recentExpensesSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  noExpensesText: {
    ...typography.body,
    color: colors.gray[500],
    textAlign: 'center' as const,
    marginTop: spacing.lg,
  },
  fab: {
    position: 'absolute' as const,
    bottom: spacing.xl + 16, // 16dp above bottom nav as specified
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue[500],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.h3,
    color: colors.gray[900],
    textAlign: 'center' as const,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    ...typography.body,
    color: colors.gray[600],
    textAlign: 'center' as const,
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: colors.blue[500],
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  emptyStateButtonText: {
    ...typography.button,
    color: colors.white,
  },
  skeleton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  skeletonCard: {
    height: 80,
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  bottomSheetOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  bottomSheetBackdrop: {
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    minHeight: 300,
  },
  bottomSheetTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  bottomSheetSubtitle: {
    ...typography.body,
    color: colors.gray[600],
    marginBottom: spacing.lg,
  },
  bottomSheetCloseButton: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignSelf: 'center' as const,
  },
  bottomSheetCloseText: {
    ...typography.button,
    color: colors.gray[700],
  },
};
