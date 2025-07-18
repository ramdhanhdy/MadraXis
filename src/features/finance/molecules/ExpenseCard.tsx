import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

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
  const [translateX] = useState(new Animated.Value(0));
  const [showActions, setShowActions] = useState(false);

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

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationX } = event.nativeEvent;
    
    // Only allow left swipe (negative translation)
    if (translationX < 0) {
      translateX.setValue(Math.max(translationX, -120));
    }
  };

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      // Determine if swipe was significant enough to show actions
      const shouldShowActions = translationX < -60 || velocityX < -500;
      
      if (shouldShowActions) {
        setShowActions(true);
        Animated.spring(translateX, {
          toValue: -120,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else {
        setShowActions(false);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  const handleDuplicate = () => {
    setShowActions(false);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    onDuplicate();
  };

  const handleEdit = () => {
    if (onEdit) {
      setShowActions(false);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      onEdit();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      setShowActions(false);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      onDelete();
    }
  };

  return (
    <View style={styles.container}>
      {/* Action buttons (shown when swiped) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.duplicateButton]}
          onPress={handleDuplicate}
        >
          <Ionicons name="copy-outline" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>Duplicate</Text>
        </TouchableOpacity>
        
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Ionicons name="pencil-outline" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main card content */}
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
            },
          ]}
        >
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
                  <Ionicons name="attach" size={16} color={colors.gray[500]} />
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = {
  container: {
    marginBottom: spacing.md,
    position: 'relative' as const,
  },
  actionsContainer: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    zIndex: 1,
  },
  actionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.xs,
  },
  duplicateButton: {
    backgroundColor: colors.blue[500],
  },
  editButton: {
    backgroundColor: colors.yellow[500],
  },
  deleteButton: {
    backgroundColor: colors.red[500],
  },
  actionButtonText: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing.xs,
    fontSize: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  cardContent: {
    flexDirection: 'row' as const,
    padding: spacing.md,
    alignItems: 'flex-start' as const,
  },
  leftContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  rightContent: {
    alignItems: 'flex-end' as const,
    minWidth: 100,
  },
  categoryBadge: {
    backgroundColor: colors.blue[100],
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start' as const,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.caption,
    color: colors.blue[700],
    fontWeight: '600' as const,
  },
  description: {
    ...typography.body,
    color: colors.gray[900],
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  notes: {
    ...typography.caption,
    color: colors.gray[600],
    fontStyle: 'italic' as const,
  },
  amount: {
    ...typography.h4,
    color: colors.gray[900],
    fontWeight: '700' as const,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  attachmentIndicator: {
    alignSelf: 'flex-end' as const,
  },
};

export default ExpenseCard;
