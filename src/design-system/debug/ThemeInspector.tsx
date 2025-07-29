/**
 * Theme Inspector Component
 * Development-only visual theme inspector and debugging tool
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useThemeDebugger, ThemeInspector as ThemeInspectorUtils } from './useThemeDebugger';
import { ThemeExporter } from './theme-export';
import { validateTheme } from '../validation';
import { useTheme } from '../themes/ThemeProvider';

// Component props
export interface ThemeInspectorProps {
  visible: boolean;
  onClose: () => void;
  position?: 'bottom' | 'right' | 'fullscreen';
}

// Internal state types
interface InspectorTab {
  id: string;
  label: string;
  icon: string;
}

const INSPECTOR_TABS: InspectorTab[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'tokens', label: 'Tokens', icon: '🎨' },
  { id: 'validation', label: 'Validation', icon: '✅' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'export', label: 'Export', icon: '📤' },
];

/**
 * Development-only theme inspector component
 */
export const ThemeInspector: React.FC<ThemeInspectorProps> = ({
  visible,
  onClose,
  position = 'bottom',
}) => {
  // Only render in development
  if (!__DEV__) {
    return null;
  }

  const { theme } = useTheme();
  const debugInfo = useThemeDebugger({
    enableValidation: true,
    enablePerformanceTracking: true,
    enableUsageTracking: true,
    enableHistory: true,
  });

  // Component state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Filtered tokens based on search
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return null;
    
    const pattern = new RegExp(searchQuery, 'i');
    return ThemeInspectorUtils.findTokens(theme, pattern);
  }, [theme, searchQuery]);

  // Theme tree for token browser
  const themeTree = useMemo(() => {
    return ThemeInspectorUtils.getThemeTree(theme);
  }, [theme]);

  // Toggle node expansion
  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  // Export theme
  const handleExport = (format: string) => {
    try {
      const result = ThemeExporter.export(theme, { 
        format: format as any,
        includeValidation: true,
        includeMetadata: true,
      });
      
      // In a real app, this would trigger a download or copy to clipboard
      console.log(`Theme exported as ${format}:`, result);
      alert(`Theme exported as ${format}! Check console for output.`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Check console for details.');
    }
  };

  // Render methods for different tabs
  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Strategy</Text>
            <Text style={styles.infoValue}>{debugInfo.theme.strategy || 'default'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{debugInfo.theme.role || 'shared'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mode</Text>
            <Text style={styles.infoValue}>{debugInfo.theme.mode || 'light'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Validation Summary</Text>
        <View style={styles.validationSummary}>
          <View style={[styles.scoreCard, { backgroundColor: debugInfo.validation.summary.accessibilityScore > 80 ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.scoreValue}>{debugInfo.validation.summary.accessibilityScore}</Text>
            <Text style={styles.scoreLabel}>Accessibility</Text>
          </View>
          <View style={[styles.scoreCard, { backgroundColor: debugInfo.validation.summary.completenessScore > 80 ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.scoreValue}>{debugInfo.validation.summary.completenessScore}</Text>
            <Text style={styles.scoreLabel}>Completeness</Text>
          </View>
          <View style={[styles.scoreCard, { backgroundColor: debugInfo.validation.summary.consistencyScore > 80 ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.scoreValue}>{debugInfo.validation.summary.consistencyScore}</Text>
            <Text style={styles.scoreLabel}>Consistency</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricsList}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Render Count</Text>
            <Text style={styles.metricValue}>{debugInfo.performance.renderCount}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Avg Render Time</Text>
            <Text style={styles.metricValue}>{debugInfo.performance.averageRenderTime.toFixed(2)}ms</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Memory Usage</Text>
            <Text style={styles.metricValue}>{(debugInfo.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderTokensTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tokens..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView style={styles.tokensList}>
        {searchQuery && filteredTokens ? (
          filteredTokens.map((token, index) => (
            <View key={index} style={styles.tokenItem}>
              <Text style={styles.tokenPath}>{token.path}</Text>
              <Text style={styles.tokenValue}>{JSON.stringify(token.value)}</Text>
            </View>
          ))
        ) : (
          <TokenTreeNode 
            node={themeTree} 
            level={0} 
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
          />
        )}
      </ScrollView>
    </View>
  );

  const renderValidationTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Validation Results</Text>
        
        {debugInfo.validation.errors.length > 0 && (
          <View style={styles.validationGroup}>
            <Text style={styles.validationGroupTitle}>❌ Errors ({debugInfo.validation.errors.length})</Text>
            {debugInfo.validation.errors.map((error, index) => (
              <View key={index} style={styles.validationItem}>
                <Text style={styles.validationPath}>{error.path}</Text>
                <Text style={styles.validationMessage}>{error.message}</Text>
                {error.suggestion && (
                  <Text style={styles.validationSuggestion}>💡 {error.suggestion}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {debugInfo.validation.warnings.length > 0 && (
          <View style={styles.validationGroup}>
            <Text style={styles.validationGroupTitle}>⚠️ Warnings ({debugInfo.validation.warnings.length})</Text>
            {debugInfo.validation.warnings.map((warning, index) => (
              <View key={index} style={styles.validationItem}>
                <Text style={styles.validationPath}>{warning.path}</Text>
                <Text style={styles.validationMessage}>{warning.message}</Text>
                {warning.suggestion && (
                  <Text style={styles.validationSuggestion}>💡 {warning.suggestion}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {debugInfo.validation.errors.length === 0 && debugInfo.validation.warnings.length === 0 && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>✅ All validation checks passed!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderPerformanceTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance History</Text>
        {debugInfo.history.slice(0, 10).map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyTime}>
              {new Date(entry.timestamp).toLocaleTimeString()}
            </Text>
            <Text style={styles.historyChange}>
              {entry.previousTheme} → {entry.newTheme}
            </Text>
            <Text style={styles.historyPerf}>
              {entry.performance.switchTime.toFixed(2)}ms
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Statistics</Text>
        <View style={styles.usageStats}>
          <Text style={styles.usageLabel}>Components using theme: {debugInfo.usage.componentsUsingTheme.length}</Text>
          <Text style={styles.usageLabel}>Most used tokens:</Text>
          {debugInfo.usage.mostUsedTokens.slice(0, 5).map((token, index) => (
            <Text key={index} style={styles.usageToken}>
              • {token.path} ({token.count} uses)
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderExportTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Theme</Text>
        <View style={styles.exportButtons}>
          {['json', 'css', 'scss', 'figma', 'documentation'].map(format => (
            <TouchableOpacity
              key={format}
              style={styles.exportButton}
              onPress={() => handleExport(format)}
            >
              <Text style={styles.exportButtonText}>{format.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // Main render
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={position === 'fullscreen' ? 'fullScreen' : 'pageSheet'}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎨 Theme Inspector</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {INSPECTOR_TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'tokens' && renderTokensTab()}
          {activeTab === 'validation' && renderValidationTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'export' && renderExportTab()}
        </View>
      </View>
    </Modal>
  );
};

// Token tree node component
const TokenTreeNode: React.FC<{
  node: any;
  level: number;
  expandedNodes: Set<string>;
  onToggle: (path: string) => void;
}> = ({ node, level, expandedNodes, onToggle }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.name);
  const indent = level * 20;

  return (
    <View>
      <TouchableOpacity
        style={[styles.treeNode, { paddingLeft: indent }]}
        onPress={() => hasChildren && onToggle(node.name)}
      >
        <Text style={styles.treeNodeIcon}>
          {hasChildren ? (isExpanded ? '📂' : '📁') : '📄'}
        </Text>
        <Text style={styles.treeNodeName}>{node.name}</Text>
        {!hasChildren && (
          <Text style={styles.treeNodeValue}>{JSON.stringify(node.value)}</Text>
        )}
      </TouchableOpacity>
      
      {hasChildren && isExpanded && (
        <View>
          {node.children.map((child: any, index: number) => (
            <TokenTreeNode
              key={index}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '33%',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  validationSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  metricsList: {
    gap: 8,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  tokensList: {
    flex: 1,
  },
  tokenItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tokenPath: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  tokenValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  treeNode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  treeNodeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  treeNodeName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  treeNodeValue: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  validationGroup: {
    marginBottom: 16,
  },
  validationGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  validationItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  validationPath: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  validationMessage: {
    fontSize: 14,
    marginTop: 4,
  },
  validationSuggestion: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  successMessage: {
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
  },
  historyChange: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  historyPerf: {
    fontSize: 12,
    color: '#666',
  },
  usageStats: {
    gap: 4,
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  usageToken: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  exportButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exportButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
