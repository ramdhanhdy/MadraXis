import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeableRow } from '../SwipeableRow/SwipeableRow';

// Import types and utils
import { Expense } from '../../../services/finance';
import { utils } from '../../../services/finance';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

interface ExpenseCardProps {
  expense: Expense & {
    expense_categories?: {
      id: string;
      name: string;
    };
  };
  onDuplicate: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onDuplicate,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const handleDuplicate = () => {
    onDuplicate();
    // Announce action for accessibility
    AccessibilityInfo.announceForAccessibility('Expense duplicated');
  };

  return (
    <SwipeableRow onDuplicate={handleDuplicate}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {expense.expense_categories?.name || 'Unknown'}
              </Text>
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
              {expense.description}
            </Text>
            
            {expense.notes && (
              <Text style={styles.notes} numberOfLines={1}>
                {expense.notes}
              </Text>
            )}
          </View>
          
          <View style={styles.rightContent}>
            <Text style={styles.amount}>
              {utils.formatCurrency(expense.amount)}
            </Text>
            
            <Text style={styles.date}>
              {formatDate(expense.date)}
            </Text>
            
            {expense.attachment_url && (
              <View style={styles.attachmentIndicator}>
                <Ionicons name="attach" size={16} color={colors.text.tertiary} />
              </View>
            )}
          </View>
        </View>
      </View>
    </SwipeableRow>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'flex-start',
    minHeight: 80, // Ensure touch target is at least 48x48dp
  },
  leftContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  rightContent: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  categoryBadge: {
    backgroundColor: colors.primary.light,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.dark,
  },
  description: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  notes: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  attachmentIndicator: {
    alignSelf: 'flex-end',
  },
});

export default ExpenseCard;
