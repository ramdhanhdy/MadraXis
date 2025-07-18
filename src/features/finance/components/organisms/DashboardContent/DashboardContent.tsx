/**
 * DashboardContent Component
 * Reusable dashboard content container with progress tracking and quick actions
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { Typography } from '@/src/shared/components/atoms/Typography';
import { Card } from '@/src/shared/components/molecules/Card';
import { QuickAction } from '@/src/shared/components/molecules/QuickAction';
import { ProgressBar } from '@/src/shared/components/molecules/ProgressBar';
import type { QuickActionConfig, ProgressConfig } from '@/src/types/dashboard';

// DashboardContent Props Interface
export interface DashboardContentProps {
  // Quick actions configuration
  quickActions: QuickActionConfig[];
  
  // Progress data
  progressData: ProgressConfig[];
  
  // Loading state
  loading?: boolean;
  
  // Custom content
  children?: React.ReactNode;
  
  // Test ID
  testID?: string;
}

// DashboardContent Component
export const DashboardContent: React.FC<DashboardContentProps> = React.memo(({
  quickActions,
  progressData,
  loading = false,
  children,
  testID,
}) => {
  const { theme } = useTheme();

  // Create styles
  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography variant="body1" color="secondary">
          Loading dashboard...
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      {/* Quick Actions Section */}
      <Card style={styles.section}>
        <Typography 
          variant="h4" 
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          Quick Actions
        </Typography>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={`${action.title}-${index}`}
              style={styles.quickActionItem}
              {...action}
              accessibilityRole="button"
            />
          ))}
        </View>
      </Card>

      {/* Progress Section */}
      <Card style={styles.section}>
        <Typography 
          variant="h4" 
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          Academic Progress
        </Typography>
        <View style={styles.progressContainer}>
          {progressData.map((progress, index) => (
            <ProgressBar
              key={`${progress.label}-${index}`}
              style={styles.progressItem}
              showLabel
              showPercentage
              {...progress}
            />
          ))}
        </View>
      </Card>

      {/* Custom Content */}
      {children && (
        <View style={styles.contentContainer}>
          {children}
        </View>
      )}
    </ScrollView>
  );
});

// Create styles function
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  quickActionItem: {
    flex: 1,
    minWidth: 150,
    maxWidth: '48%',
  },
  progressContainer: {
    gap: theme.spacing.sm,
  },
  progressItem: {
    marginBottom: theme.spacing.sm,
  },
});

// Set display name
DashboardContent.displayName = 'DashboardContent';

// Export default
export default DashboardContent;