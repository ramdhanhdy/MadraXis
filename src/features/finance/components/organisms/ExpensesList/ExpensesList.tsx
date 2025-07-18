import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { ExpenseCard } from '../../molecules/ExpenseCard';
import { Expense } from '../../../services/finance';

interface ExpensesListProps {
  expenses?: Expense[];
  onDuplicateExpense: (expenseId: string) => void;
  isLoading?: boolean;
  title?: string;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({
  expenses = [],
  onDuplicateExpense,
  isLoading = false,
  title = "Recent Expenses",
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDuplicate={() => onDuplicateExpense(expense.id)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>No expenses found</Text>
      )}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 100, // Space for FAB
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});

export default ExpensesList;
