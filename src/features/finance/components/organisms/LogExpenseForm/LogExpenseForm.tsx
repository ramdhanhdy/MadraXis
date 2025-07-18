import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { financeService } from '../../../services/finance';
import { spacing } from '../../../styles/spacing';
import { typographyVariants } from '../../../styles/typography';

interface LogExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  duplicateExpense?: any; // For duplicating existing expenses
}

export const LogExpenseForm: React.FC<LogExpenseFormProps> = ({
  onSuccess,
  onCancel,
  duplicateExpense,
}) => {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const styles = createStyles(theme);

  // Form state
  const [formData, setFormData] = useState({
    category_id: duplicateExpense?.category_id || '',
    description: duplicateExpense?.description || '',
    amount: duplicateExpense?.amount?.toString() || '',
    date: duplicateExpense?.date || new Date().toISOString().split('T')[0],
    receipt_url: duplicateExpense?.receipt_url || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock categories for now - in real app, fetch from API
  const categories = [
    { id: '1', name: 'Operational', color: '#3b82f6' },
    { id: '2', name: 'Maintenance', color: '#10b981' },
    { id: '3', name: 'Supplies', color: '#f59e0b' },
    { id: '4', name: 'Utilities', color: '#ef4444' },
    { id: '5', name: 'Other', color: '#8b5cf6' },
  ];

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: financeService.createExpense,
    onSuccess: () => {
      // Invalidate and refetch expenses
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analytics'] });
      
      Alert.alert('Success', 'Expense logged successfully!');
      onSuccess?.();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to log expense');
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (!profile?.school_id) {
      Alert.alert('Error', 'School information not found');
      return;
    }

    const expenseData = {
      school_id: profile.school_id,
      category_id: formData.category_id,
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      date: formData.date,
      receipt_url: formData.receipt_url || null,
    };

    createExpenseMutation.mutate(expenseData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {duplicateExpense ? 'Duplicate Expense' : 'Log New Expense'}
        </Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Category Selection */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    formData.category_id === category.id && styles.categoryChipActive,
                  ]}
                  onPress={() => updateField('category_id', category.id)}
                >
                  <View
                    style={[
                      styles.categoryColor,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category_id === category.id && styles.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, errors.description && styles.inputError]}
            placeholder="Enter expense description"
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            numberOfLines={2}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Amount */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.amount}
            onChangeText={(value) => updateField('amount', value)}
            keyboardType="numeric"
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        {/* Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.date}
            onChangeText={(value) => updateField('date', value)}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        {/* Receipt URL (Optional) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Receipt URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.receipt_url}
            onChangeText={(value) => updateField('receipt_url', value)}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {onCancel && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            createExpenseMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createExpenseMutation.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createExpenseMutation.isPending ? 'Logging...' : 'Log Expense'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typographyVariants.h3,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  form: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typographyVariants.body2,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    ...typographyVariants.body1,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 48,
  },
  inputError: {
    borderColor: theme.colors.error.main,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingRight: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.dark,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...typographyVariants.caption,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: theme.colors.surface.primary,
    fontWeight: '600',
  },
  errorText: {
    ...typographyVariants.caption,
    color: theme.colors.error.main,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  cancelButtonText: {
    ...typographyVariants.button,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.colors.primary.main,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.primary.light,
    opacity: 0.6,
  },
  submitButtonText: {
    ...typographyVariants.button,
    color: theme.colors.surface.primary,
    fontWeight: '600',
  },
});

export default LogExpenseForm;
