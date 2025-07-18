import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';

interface FinanceEmptyStateProps {
  onAddExpense: () => void;
}

export const FinanceEmptyState: React.FC<FinanceEmptyStateProps> = ({ onAddExpense }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600 }}
      style={styles.container}
    >
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 200 }}
      >
        <View style={styles.illustrationContainer}>
          <Ionicons name="wallet-outline" size={80} color={colors.primary.main} />
          <View style={styles.glowEffect} />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', delay: 400, duration: 500 }}
      >
        <Text style={styles.title}>Log your first expense to light up the dashboard</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', delay: 500, duration: 500 }}
      >
        <Text style={styles.subtitle}>
          Track your school's financial health with our simple expense logging system
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', delay: 600, duration: 500 }}
      >
        <TouchableOpacity style={styles.button} onPress={onAddExpense}>
          <Text style={styles.buttonText}>Add First Expense</Text>
        </TouchableOpacity>
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  glowEffect: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    opacity: 0.1,
    transform: [{ scale: 1.2 }],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default FinanceEmptyState;