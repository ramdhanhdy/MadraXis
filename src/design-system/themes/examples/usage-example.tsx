/**
 * Theme System Usage Example
 * Comprehensive example demonstrating the enhanced theme system capabilities
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ThemeProvider,
  useTheme,
  useThemeDebugger,
  roleBasedThemeStrategy,
  sharedThemeStrategy,
  adaptiveThemeStrategy,
  highContrastThemeStrategy,
} from '../index';
import { UserRole } from '../../tokens/colors';

/**
 * Example App Component
 */
const ExampleApp: React.FC = () => {
  const [currentStrategy, setCurrentStrategy] = useState(roleBasedThemeStrategy);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');

  return (
    <ThemeProvider 
      strategy={currentStrategy}
      initialRole={currentRole}
      enablePerformanceOptimizations={true}
      enableThemeValidation={true}
      onThemeChange={(theme, role) => {
        console.log('Theme changed:', { role, primaryColor: theme.colors.primary.main });
      }}
      onThemeError={(error, fallbackUsed) => {
        console.error('Theme error:', error.message, 'Fallback used:', fallbackUsed);
      }}
    >
      <MainContent 
        onStrategyChange={setCurrentStrategy}
        onRoleChange={setCurrentRole}
      />
    </ThemeProvider>
  );
};

/**
 * Main Content Component
 */
interface MainContentProps {
  onStrategyChange: (strategy: any) => void;
  onRoleChange: (role: UserRole) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onStrategyChange, onRoleChange }) => {
  const { theme, currentRole, setRole, colorScheme, setColorScheme } = useTheme();
  const debugger = useThemeDebugger();

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MadraXis Design System</Text>
        <Text style={styles.headerSubtitle}>
          Role: {currentRole || 'None'} | Mode: {colorScheme}
        </Text>
      </View>

      {/* Role Switcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Roles</Text>
        <View style={styles.buttonRow}>
          {(['student', 'teacher', 'parent', 'management'] as UserRole[]).map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                { backgroundColor: getRoleColor(role) },
                currentRole === role && styles.activeButton,
              ]}
              onPress={() => {
                setRole(role);
                onRoleChange(role);
              }}
            >
              <Text style={styles.buttonText}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Theme Strategy Switcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Strategies</Text>
        <View style={styles.buttonColumn}>
          <TouchableOpacity
            style={[styles.strategyButton, styles.roleBasedButton]}
            onPress={() => onStrategyChange(roleBasedThemeStrategy)}
          >
            <Text style={styles.buttonText}>Role-Based Themes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.strategyButton, styles.sharedButton]}
            onPress={() => onStrategyChange(sharedThemeStrategy)}
          >
            <Text style={styles.buttonText}>Shared Theme</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.strategyButton, styles.adaptiveButton]}
            onPress={() => onStrategyChange(adaptiveThemeStrategy)}
          >
            <Text style={styles.buttonText}>Adaptive Strategy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.strategyButton, styles.accessibilityButton]}
            onPress={() => onStrategyChange(highContrastThemeStrategy)}
          >
            <Text style={styles.buttonText}>High Contrast</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Color Scheme Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Scheme</Text>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: theme.colors.secondary.main }]}
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
        >
          <Text style={styles.buttonText}>
            Switch to {colorScheme === 'light' ? 'Dark' : 'Light'} Mode
          </Text>
        </TouchableOpacity>
      </View>

      {/* Theme Preview Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Preview</Text>
        <View style={styles.cardRow}>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.primary.main }]}>
            <Text style={[styles.cardText, { color: theme.colors.primary.contrast }]}>
              Primary
            </Text>
          </View>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.secondary.main }]}>
            <Text style={[styles.cardText, { color: theme.colors.secondary.contrast }]}>
              Secondary
            </Text>
          </View>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.success.main }]}>
            <Text style={[styles.cardText, { color: theme.colors.success.contrast }]}>
              Success
            </Text>
          </View>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.error.main }]}>
            <Text style={[styles.cardText, { color: theme.colors.error.contrast }]}>
              Error
            </Text>
          </View>
        </View>
      </View>

      {/* Debug Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Information</Text>
        <TouchableOpacity
          style={[styles.debugButton, { backgroundColor: theme.colors.text.secondary }]}
          onPress={() => debugger.logTheme()}
        >
          <Text style={[styles.buttonText, { color: theme.colors.background.primary }]}>
            Log Theme to Console
          </Text>
        </TouchableOpacity>
        
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Strategy: {debugger.getThemeMetadata().strategyName}
          </Text>
          <Text style={styles.debugText}>
            Primary Color: {theme.colors.primary.main}
          </Text>
          <Text style={styles.debugText}>
            Component Themes: {Object.keys(theme.componentThemes).length}
          </Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Helper function to get role-specific colors
 */
function getRoleColor(role: UserRole): string {
  const colors = {
    student: '#14B8A6',
    teacher: '#10B981',
    parent: '#FBBF24',
    management: '#E11D48',
  };
  return colors[role];
}

/**
 * Dynamic styles based on theme
 */
function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.base.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.base.xl,
      padding: theme.spacing.base.lg,
      backgroundColor: theme.colors.surface.primary,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.semantic.card.default,
    },
    headerTitle: {
      fontSize: theme.typography.variants.h2.fontSize,
      fontWeight: theme.typography.variants.h2.fontWeight,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.base.xs,
    },
    headerSubtitle: {
      fontSize: theme.typography.variants.body.fontSize,
      color: theme.colors.text.secondary,
    },
    section: {
      marginBottom: theme.spacing.base.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.variants.h4.fontSize,
      fontWeight: theme.typography.variants.h4.fontWeight,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.base.md,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.base.sm,
    },
    buttonColumn: {
      gap: theme.spacing.base.sm,
    },
    roleButton: {
      paddingHorizontal: theme.spacing.base.md,
      paddingVertical: theme.spacing.base.sm,
      borderRadius: theme.borderRadius.md,
      minWidth: 80,
      alignItems: 'center',
    },
    strategyButton: {
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    roleBasedButton: {
      backgroundColor: '#14B8A6',
    },
    sharedButton: {
      backgroundColor: '#6B7280',
    },
    adaptiveButton: {
      backgroundColor: '#8B5CF6',
    },
    accessibilityButton: {
      backgroundColor: '#F59E0B',
    },
    toggleButton: {
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    activeButton: {
      borderWidth: 2,
      borderColor: theme.colors.text.primary,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: theme.typography.fontWeight.medium,
      fontSize: theme.typography.variants.button.fontSize,
    },
    cardRow: {
      flexDirection: 'row',
      gap: theme.spacing.base.sm,
    },
    previewCard: {
      flex: 1,
      padding: theme.spacing.base.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      minHeight: 60,
      justifyContent: 'center',
    },
    cardText: {
      fontWeight: theme.typography.fontWeight.medium,
      fontSize: theme.typography.variants.buttonSmall.fontSize,
    },
    debugButton: {
      paddingHorizontal: theme.spacing.base.lg,
      paddingVertical: theme.spacing.base.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginBottom: theme.spacing.base.md,
    },
    debugInfo: {
      backgroundColor: theme.colors.surface.secondary,
      padding: theme.spacing.base.md,
      borderRadius: theme.borderRadius.md,
    },
    debugText: {
      fontSize: theme.typography.variants.bodySmall.fontSize,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.base.xs,
    },
  });
}

export default ExampleApp;
