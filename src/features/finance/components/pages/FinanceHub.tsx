import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Import services
import { expenses, analytics, search, utils } from '@/src/features/finance/services';
import { useAuth } from '@/src/features/authentication/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';

// Import components
import { BudgetOverview } from '@/src/features/finance/components/organisms/BudgetOverview';
import { ExpensesList } from '@/src/features/finance/components/organisms/ExpensesList';
import { FinanceEmptyState } from '@/src/features/finance/components/molecules/FinanceEmptyState';
import { SkeletonCard as FinanceSkeleton } from '@/src/features/finance/components/molecules/SkeletonCard/SkeletonCard';

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

export const FinanceHubPage: React.FC = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const { theme } = useTheme();
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

  // Create dynamic styles
  const styles = createStyles(theme);

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
    <FinanceEmptyState onAddExpense={openAddExpense} />
  );

  // Render loading skeleton
  const renderSkeleton = () => (
    <FinanceSkeleton />
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
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar and Filter Chips */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={theme.colors.text.tertiary}
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

        {/* Budget Overview */}
        <BudgetOverview
          dashboardSummary={dashboardSummary}
          onAdjustBudget={openBudgetAdjust}
          isLoading={summaryLoading}
        />

        {/* Recent Expenses */}
        <ExpensesList
          expenses={recentExpenses}
          onDuplicateExpense={handleDuplicateExpense}
          isLoading={expensesLoading}
          title="Recent Expenses"
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openAddExpense}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
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
};

// Dynamic styles using theme
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.xs,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  filterChips: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary.main,
  },
  filterChipText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.white,
  },

  fab: {
    position: 'absolute',
    bottom: 48,
    right: theme.spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetBackdrop: {
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: theme.colors.surface.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minHeight: 300,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  bottomSheetSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  bottomSheetCloseButton: {
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'center',
  },
  bottomSheetCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});

export default FinanceHubPage;
