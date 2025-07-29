/**
 * Design System Debug Tools - Main Export
 * Development-only debugging and inspection tools
 */

// Only export debug tools in development
if (__DEV__) {
  // Theme debugger hook
  export {
    useThemeDebugger,
    ThemeInspector as ThemeInspectorUtils,
  } from './useThemeDebugger';

  export type {
    ThemeDebugInfo,
    PerformanceMetrics,
    UsageStats,
    TokenUsage,
    ThemeChangeHistory,
    ThemeDebuggerOptions,
    ThemeTreeNode,
    ThemeComparison,
    ThemeDifference,
  } from './useThemeDebugger';

  // Theme export utilities
  export {
    ThemeExporter,
    exportThemeAsJSON,
    exportThemeAsCSS,
    exportThemeAsSCSS,
    exportThemeForFigma,
    exportThemeDocumentation,
  } from './theme-export';

  export type {
    ExportFormat,
    ExportOptions,
    ExportResult,
    ExportMetadata,
  } from './theme-export';

  // Theme inspector component
  export { ThemeInspector } from './ThemeInspector';

  export type {
    ThemeInspectorProps,
  } from './ThemeInspector';

  // Development warning
  console.log('🔧 Design System Debug Tools loaded - available in development only');
} else {
  // Production stubs - no-op functions to prevent errors
  export const useThemeDebugger = () => ({
    theme: {},
    validation: { isValid: true, errors: [], warnings: [], summary: {} },
    performance: {},
    usage: {},
    history: [],
  });

  export const ThemeInspector = () => null;
  export const ThemeExporter = {
    export: () => ({ content: '', metadata: {}, validation: null }),
  };

  export const exportThemeAsJSON = () => ({ content: '{}', metadata: {}, validation: null });
  export const exportThemeAsCSS = () => ({ content: '', metadata: {}, validation: null });
  export const exportThemeAsSCSS = () => ({ content: '', metadata: {}, validation: null });
  export const exportThemeForFigma = () => ({ content: '{}', metadata: {}, validation: null });
  export const exportThemeDocumentation = () => ({ content: '', metadata: {}, validation: null });
}
