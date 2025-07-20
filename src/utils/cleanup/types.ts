/**
 * Core types for codebase cleanup analysis and reporting
 */

export type UnusedItemType = 'file' | 'dependency' | 'export' | 'code';
export type RiskLevel = 'low' | 'medium' | 'high';
export type FileType = 'component' | 'service' | 'utility' | 'type' | 'config' | 'test' | 'story';

/**
 * Represents an unused item identified during analysis
 */
export interface UnusedItem {
  /** File path or dependency name */
  path: string;
  /** Type of unused item */
  type: UnusedItemType;
  /** Reason why this item is considered unused */
  reason: string;
  /** Risk level for removing this item */
  riskLevel: RiskLevel;
  /** Context where this item might be used (for manual review) */
  usageContext?: string[];
  /** Size impact (lines of code, file size, etc.) */
  sizeImpact?: number;
}

/**
 * Error that occurred during cleanup process
 */
export interface CleanupError {
  /** Error message */
  message: string;
  /** File or item that caused the error */
  item: string;
  /** Error type for categorization */
  type: 'parse' | 'filesystem' | 'test' | 'build';
  /** Stack trace if available */
  stack?: string;
}

/**
 * Summary statistics for cleanup operations
 */
export interface CleanupSummary {
  /** Number of files removed */
  filesRemoved: number;
  /** Number of dependencies removed */
  dependenciesRemoved: number;
  /** Number of unused exports removed */
  exportsRemoved: number;
  /** Lines of code reduced */
  linesOfCodeReduced: number;
  /** Total file size reduced in bytes */
  fileSizeReduced: number;
}

/**
 * Comprehensive report of cleanup operations
 */
export interface CleanupReport {
  /** Items that were successfully removed */
  removed: UnusedItem[];
  /** Items flagged for manual review */
  flaggedForReview: UnusedItem[];
  /** Errors encountered during cleanup */
  errors: CleanupError[];
  /** Summary statistics */
  summary: CleanupSummary;
  /** Timestamp when cleanup was performed */
  timestamp: Date;
  /** Configuration used for this cleanup */
  config: AnalysisConfig;
}

/**
 * Node in the dependency graph
 */
export interface DependencyNode {
  /** Absolute file path */
  filePath: string;
  /** Files this node imports */
  imports: string[];
  /** What this file exports */
  exports: string[];
  /** Files that depend on this node */
  dependents: string[];
  /** Files this node depends on */
  dependencies: string[];
  /** Whether this is an entry point (not imported by others) */
  isEntryPoint: boolean;
  /** Type of file for categorization */
  fileType: FileType;
  /** Whether this file contains dynamic imports */
  hasDynamicImports: boolean;
}

/**
 * Complete project dependency graph
 */
export interface ProjectGraph {
  /** Map of file path to dependency node */
  nodes: Map<string, DependencyNode>;
  /** Entry point files (app routes, main files) */
  entryPoints: string[];
  /** Files with no dependents */
  orphanedFiles: string[];
  /** Files that couldn't be parsed */
  unparsedFiles: string[];
}

/**
 * Package dependency information
 */
export interface PackageDependency {
  /** Package name */
  name: string;
  /** Version specified in package.json */
  version: string;
  /** Dependency type */
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
  /** Files where this package is imported */
  usedIn: string[];
  /** Whether this is used indirectly (config files, etc.) */
  indirectUsage: boolean;
}

/**
 * Analysis configuration options
 */
export interface AnalysisConfig {
  /** Patterns to exclude from analysis */
  excludePatterns: string[];
  /** Whether to include test files in analysis */
  includeTestFiles: boolean;
  /** Whether to include Storybook files in analysis */
  includeStoryFiles: boolean;
  /** Whether to run safety checks before removal */
  safetyChecks: boolean;
  /** Whether to create backups before removal */
  createBackups: boolean;
  /** Root directory to analyze */
  rootDir: string;
  /** Patterns for entry point files */
  entryPointPatterns: string[];
  /** Risk threshold for automatic removal */
  autoRemoveRiskThreshold: RiskLevel;
  /** Whether to run in dry-run mode */
  dryRun: boolean;
}

/**
 * Progress callback for long-running operations
 */
export interface ProgressCallback {
  (phase: string, current: number, total: number): void;
}

/**
 * Result of a cleanup operation
 */
export interface CleanupResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Items that were processed */
  processed: UnusedItem[];
  /** Items that were skipped */
  skipped: UnusedItem[];
  /** Errors that occurred */
  errors: CleanupError[];
}