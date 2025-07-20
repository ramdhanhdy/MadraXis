import { AnalysisConfig } from './types';

/**
 * Default configuration for codebase cleanup analysis
 */
export const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
  // Exclude common directories and files that shouldn't be removed
  excludePatterns: [
    // Build and dependency directories
    'node_modules/**',
    '.expo/**',
    '.git/**',
    'dist/**',
    'build/**',
    
    // Configuration files
    '*.config.js',
    '*.config.ts',
    '.env*',
    'package.json',
    'package-lock.json',
    'bun.lock',
    'yarn.lock',
    
    // Documentation and meta files
    'README.md',
    'LICENSE*',
    'CHANGELOG*',
    'docs/**',
    '.kiro/**',
    '.vscode/**',
    
    // Asset directories
    'assets/**',
    'public/**',
    'static/**',
    
    // Platform-specific files
    'android/**',
    'ios/**',
    
    // Test setup and configuration
    'jest.setup.js',
    'jest.config.*',
    'babel.config.*',
    'metro.config.*',
    'tsconfig.json',
    
    // Expo specific
    'app.config.*',
    'expo-env.d.ts',
  ],
  
  // Include test files in analysis but flag for manual review
  includeTestFiles: true,
  
  // Include Storybook files in analysis but flag for manual review
  includeStoryFiles: true,
  
  // Always run safety checks in production
  safetyChecks: true,
  
  // Create backups before making changes
  createBackups: true,
  
  // Default to current working directory
  rootDir: process.cwd(),
  
  // Entry point patterns for React Native/Expo projects
  entryPointPatterns: [
    'app/index.tsx',
    'app/_layout.tsx',
    'app/**/index.tsx',
    'app/**/_layout.tsx',
    'src/index.ts',
    'src/index.tsx',
    'index.js',
    'index.ts',
    'App.tsx',
    'App.js',
  ],
  
  // Only auto-remove low-risk items
  autoRemoveRiskThreshold: 'low',
  
  // Default to dry-run mode for safety
  dryRun: true,
};

/**
 * React Native/Expo specific configuration overrides
 */
export const REACT_NATIVE_CONFIG_OVERRIDES: Partial<AnalysisConfig> = {
  excludePatterns: [
    ...DEFAULT_ANALYSIS_CONFIG.excludePatterns,
    // React Native specific exclusions
    '__tests__/**',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    // Expo specific
    '.expo-shared/**',
    'web-build/**',
  ],
  
  entryPointPatterns: [
    ...DEFAULT_ANALYSIS_CONFIG.entryPointPatterns,
    // Expo Router specific entry points
    'app/(auth)/**',
    'app/(management)/**',
    'app/(teacher)/**',
    'app/(parent)/**',
    'app/(student)/**',
  ],
};

/**
 * Configuration for different cleanup modes
 */
export const CLEANUP_MODES = {
  conservative: {
    ...DEFAULT_ANALYSIS_CONFIG,
    autoRemoveRiskThreshold: 'low' as const,
    safetyChecks: true,
    createBackups: true,
    dryRun: true,
  },
  
  moderate: {
    ...DEFAULT_ANALYSIS_CONFIG,
    autoRemoveRiskThreshold: 'medium' as const,
    safetyChecks: true,
    createBackups: true,
    dryRun: false,
  },
  
  aggressive: {
    ...DEFAULT_ANALYSIS_CONFIG,
    autoRemoveRiskThreshold: 'high' as const,
    safetyChecks: true,
    createBackups: true,
    dryRun: false,
    includeTestFiles: false,
    includeStoryFiles: false,
  },
} as const;

/**
 * Get configuration for the current project type
 */
export function getProjectConfig(projectType: 'react-native' | 'web' | 'node' = 'react-native'): AnalysisConfig {
  const baseConfig = DEFAULT_ANALYSIS_CONFIG;
  
  switch (projectType) {
    case 'react-native':
      return {
        ...baseConfig,
        ...REACT_NATIVE_CONFIG_OVERRIDES,
      };
    case 'web':
      return {
        ...baseConfig,
        excludePatterns: [
          ...baseConfig.excludePatterns,
          'public/**',
          'build/**',
          'dist/**',
        ],
      };
    case 'node':
      return {
        ...baseConfig,
        excludePatterns: [
          ...baseConfig.excludePatterns,
          'lib/**',
          'dist/**',
        ],
        entryPointPatterns: [
          'src/index.ts',
          'src/index.js',
          'index.ts',
          'index.js',
          'server.ts',
          'server.js',
        ],
      };
    default:
      return baseConfig;
  }
}

/**
 * Validate and normalize configuration
 */
export function validateConfig(config: Partial<AnalysisConfig>): AnalysisConfig {
  const fullConfig = {
    ...DEFAULT_ANALYSIS_CONFIG,
    ...config,
  };
  
  // Ensure rootDir is absolute
  if (!fullConfig.rootDir.startsWith('/') && !fullConfig.rootDir.match(/^[A-Z]:/)) {
    fullConfig.rootDir = process.cwd();
  }
  
  // Ensure excludePatterns is not empty
  if (fullConfig.excludePatterns.length === 0) {
    fullConfig.excludePatterns = DEFAULT_ANALYSIS_CONFIG.excludePatterns;
  }
  
  // Ensure entryPointPatterns is not empty
  if (fullConfig.entryPointPatterns.length === 0) {
    fullConfig.entryPointPatterns = DEFAULT_ANALYSIS_CONFIG.entryPointPatterns;
  }
  
  return fullConfig;
}