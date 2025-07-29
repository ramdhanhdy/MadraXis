/**
 * Design System Usage Example
 * Demonstrates how to use the enhanced design system
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// Import design system components and utilities
import { useTheme, useThemeSwitcher, useResponsiveValue } from '@design-system';
import { Button } from '@ui/atoms/Button';
import { Card } from '@ui/molecules/Card';
import { Modal } from '@ui/organisms/Modal';

// Development-only imports
import { ThemeInspector, useThemeDebugger } from '@design-system/debug';

/**
 * Example component showcasing design system features
 */
export const ThemeExample: React.FC = () => {
  const { theme } = useTheme();
  const {
    currentRole,
    currentMode,
    availableRoles,
    switchRole,
    toggleMode,
  } = useThemeSwitcher();

  // Responsive design example
  const cardPadding = useResponsiveValue({
    xs: 'small',
    md: 'medium',
    lg: 'large',
  });

  // Component state
  const [showModal, setShowModal] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  // Debug info (development only)
  const debugInfo = useThemeDebugger({
    enableValidation: true,
    enablePerformanceTracking: true,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface?.primary || '#ffffff' }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text?.primary || '#000000' }]}>
            🎨 Design System Example
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text?.secondary || '#666666' }]}>
            Current: {currentRole} • {currentMode} mode
          </Text>
        </View>

        {/* Role Switching */}
        <Card variant="default" padding={cardPadding}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text?.primary || '#000000' }]}>
            Role-Based Theming
          </Text>
          <View style={styles.buttonGrid}>
            {availableRoles.map((role) => (
              <Button
                key={role.key}
                variant={currentRole === role.key ? 'primary' : 'outline'}
                size="medium"
                onPress={() => switchRole(role.key)}
                style={styles.roleButton}
              >
                {role.label}
              </Button>
            ))}
          </View>
        </Card>

        {/* Theme Controls */}
        <Card variant="elevated" padding={cardPadding}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text?.primary || '#000000' }]}>
            Theme Controls
          </Text>
          <View style={styles.controlsRow}>
            <Button
              variant="secondary"
              size="medium"
              onPress={toggleMode}
              style={styles.controlButton}
            >
              {currentMode === 'light' ? '🌙 Dark' : '☀️ Light'}
            </Button>
            <Button
              variant="ghost"
              size="medium"
              onPress={() => setShowModal(true)}
              style={styles.controlButton}
            >
              📱 Show Modal
            </Button>
            {__DEV__ && (
              <Button
                variant="outline"
                size="medium"
                onPress={() => setShowInspector(true)}
                style={styles.controlButton}
              >
                🔧 Inspector
              </Button>
            )}
          </View>
        </Card>

        {/* Color Showcase */}
        <Card variant="outlined" padding={cardPadding}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text?.primary || '#000000' }]}>
            Color Palette
          </Text>
          <View style={styles.colorGrid}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary.main }]}>
              <Text style={[styles.colorLabel, { color: theme.colors.primary.contrast }]}>
                Primary
              </Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary.main }]}>
              <Text style={[styles.colorLabel, { color: theme.colors.secondary.contrast }]}>
                Secondary
              </Text>
            </View>
            {theme.colors.error?.main && (
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.error.main }]}>
                <Text style={[styles.colorLabel, { color: theme.colors.error.contrast || '#ffffff' }]}>
                  Error
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Performance Info (Development Only) */}
        {__DEV__ && (
          <Card variant="default" padding={cardPadding}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text?.primary || '#000000' }]}>
              Performance Metrics
            </Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.primary.main }]}>
                  {debugInfo.performance.renderCount}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.text?.secondary || '#666666' }]}>
                  Renders
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.primary.main }]}>
                  {debugInfo.performance.averageRenderTime.toFixed(1)}ms
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.text?.secondary || '#666666' }]}>
                  Avg Time
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.primary.main }]}>
                  {debugInfo.validation.summary.accessibilityScore}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.text?.secondary || '#666666' }]}>
                  A11y Score
                </Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Example Modal */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Design System Modal"
        size="medium"
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, { color: theme.colors.text?.primary || '#000000' }]}>
            This modal automatically uses the current theme colors and styling.
          </Text>
          <Button
            variant="primary"
            size="medium"
            onPress={() => setShowModal(false)}
            style={styles.modalButton}
          >
            Close Modal
          </Button>
        </View>
      </Modal>

      {/* Theme Inspector (Development Only) */}
      {__DEV__ && (
        <ThemeInspector
          visible={showInspector}
          onClose={() => setShowInspector(false)}
          position="bottom"
        />
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    minWidth: 100,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flex: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    minWidth: 120,
  },
});

export default ThemeExample;
