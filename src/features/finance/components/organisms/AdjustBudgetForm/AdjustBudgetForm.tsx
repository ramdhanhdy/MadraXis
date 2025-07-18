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

interface AdjustBudgetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  currentBudget?: any; // Current budget data for editing
}

export const AdjustBudgetForm: React.FC<AdjustBudgetFormProps> = ({
  onSuccess,
  onCancel,
  currentBudget,
}) => {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const styles = createStyles(theme);

  // Form state
  const [formData, setFormData] = useState({
    month: currentBudget?.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
    total_budget: currentBudget?.total_budget?.toString() || '',
    operational_budget: currentBudget?.operational_budget?.toString() || '',
    maintenance_budget: currentBudget?.maintenance_budget?.toString() || '',
    supplies_budget: currentBudget?.supplies_budget?.toString() || '',
    utilities_budget: currentBudget?.utilities_budget?.toString() || '',
    other_budget: currentBudget?.other_budget?.toString() || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create/Update budget mutation
  const budgetMutation = useMutation({
    mutationFn: currentBudget 
      ? (data: any) => financeService.updateBudget(currentBudget.id, data)
      : financeService.createBudget,
    onSuccess: () => {
      // Invalidate and refetch budgets
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analytics'] });
      
      Alert.alert('Success', `Budget ${currentBudget ? 'updated' : 'created'} successfully!`);
      onSuccess?.();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || `Failed to ${currentBudget ? 'update' : 'create'} budget`);
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }
    if (!formData.total_budget || parseFloat(formData.total_budget) <= 0) {
      newErrors.total_budget = 'Valid total budget is required';
    }

    // Validate individual budgets
    const budgetFields = [
      'operational_budget',
      'maintenance_budget', 
      'supplies_budget',
      'utilities_budget',
      'other_budget'
    ];

    let totalIndividual = 0;
    budgetFields.forEach(field => {
      const value = parseFloat(formData[field as keyof typeof formData] || '0');
      if (value < 0) {
        newErrors[field] = 'Budget cannot be negative';
      }
      totalIndividual += value;
    });

    // Check if individual budgets sum to total budget
    const totalBudget = parseFloat(formData.total_budget || '0');
    if (totalIndividual > totalBudget) {
      newErrors.total_budget = 'Individual budgets exceed total budget';
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

    const budgetData = {
      school_id: profile.school_id,
      month: formData.month + '-01', // Convert to first day of month
      total_budget: parseFloat(formData.total_budget),
      operational_budget: parseFloat(formData.operational_budget || '0'),
      maintenance_budget: parseFloat(formData.maintenance_budget || '0'),
      supplies_budget: parseFloat(formData.supplies_budget || '0'),
      utilities_budget: parseFloat(formData.utilities_budget || '0'),
      other_budget: parseFloat(formData.other_budget || '0'),
    };

    budgetMutation.mutate(budgetData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateRemaining = () => {
    const total = parseFloat(formData.total_budget || '0');
    const allocated = [
      'operational_budget',
      'maintenance_budget',
      'supplies_budget', 
      'utilities_budget',
      'other_budget'
    ].reduce((sum, field) => {
      return sum + parseFloat(formData[field as keyof typeof formData] || '0');
    }, 0);
    
    return total - allocated;
  };

  const remaining = calculateRemaining();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {currentBudget ? 'Adjust Budget' : 'Set Monthly Budget'}
        </Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Month */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Month *</Text>
          <TextInput
            style={[styles.input, errors.month && styles.inputError]}
            placeholder="YYYY-MM"
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.month}
            onChangeText={(value) => updateField('month', value)}
          />
          {errors.month && <Text style={styles.errorText}>{errors.month}</Text>}
        </View>

        {/* Total Budget */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Total Budget *</Text>
          <TextInput
            style={[styles.input, errors.total_budget && styles.inputError]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.text.secondary}
            value={formData.total_budget}
            onChangeText={(value) => updateField('total_budget', value)}
            keyboardType="numeric"
          />
          {errors.total_budget && <Text style={styles.errorText}>{errors.total_budget}</Text>}
        </View>

        {/* Budget Allocation */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Budget Allocation</Text>
          
          {/* Operational Budget */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Operational</Text>
            <TextInput
              style={[styles.input, errors.operational_budget && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.operational_budget}
              onChangeText={(value) => updateField('operational_budget', value)}
              keyboardType="numeric"
            />
            {errors.operational_budget && <Text style={styles.errorText}>{errors.operational_budget}</Text>}
          </View>

          {/* Maintenance Budget */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Maintenance</Text>
            <TextInput
              style={[styles.input, errors.maintenance_budget && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.maintenance_budget}
              onChangeText={(value) => updateField('maintenance_budget', value)}
              keyboardType="numeric"
            />
            {errors.maintenance_budget && <Text style={styles.errorText}>{errors.maintenance_budget}</Text>}
          </View>

          {/* Supplies Budget */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Supplies</Text>
            <TextInput
              style={[styles.input, errors.supplies_budget && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.supplies_budget}
              onChangeText={(value) => updateField('supplies_budget', value)}
              keyboardType="numeric"
            />
            {errors.supplies_budget && <Text style={styles.errorText}>{errors.supplies_budget}</Text>}
          </View>

          {/* Utilities Budget */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Utilities</Text>
            <TextInput
              style={[styles.input, errors.utilities_budget && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.utilities_budget}
              onChangeText={(value) => updateField('utilities_budget', value)}
              keyboardType="numeric"
            />
            {errors.utilities_budget && <Text style={styles.errorText}>{errors.utilities_budget}</Text>}
          </View>

          {/* Other Budget */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Other</Text>
            <TextInput
              style={[styles.input, errors.other_budget && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.other_budget}
              onChangeText={(value) => updateField('other_budget', value)}
              keyboardType="numeric"
            />
            {errors.other_budget && <Text style={styles.errorText}>{errors.other_budget}</Text>}
          </View>

          {/* Remaining Budget Indicator */}
          <View style={styles.remainingContainer}>
            <Text style={styles.remainingLabel}>Remaining:</Text>
            <Text style={[
              styles.remainingAmount,
              remaining < 0 ? styles.remainingNegative : styles.remainingPositive
            ]}>
              ${remaining.toFixed(2)}
            </Text>
          </View>
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
            (budgetMutation.isPending || remaining < 0) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={budgetMutation.isPending || remaining < 0}
        >
          <Text style={styles.submitButtonText}>
            {budgetMutation.isPending 
              ? (currentBudget ? 'Updating...' : 'Creating...') 
              : (currentBudget ? 'Update Budget' : 'Set Budget')
            }
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
    marginBottom: spacing.md,
  },
  sectionContainer: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typographyVariants.h4,
    color: theme.colors.text.primary,
    marginBottom: spacing.md,
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
  errorText: {
    ...typographyVariants.caption,
    color: theme.colors.error.main,
    marginTop: spacing.xs,
  },
  remainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  remainingLabel: {
    ...typographyVariants.body2,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  remainingAmount: {
    ...typographyVariants.body1,
    fontWeight: '700',
  },
  remainingPositive: {
    color: theme.colors.success.main,
  },
  remainingNegative: {
    color: theme.colors.error.main,
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

export default AdjustBudgetForm;
