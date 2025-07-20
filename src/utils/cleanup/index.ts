// Barrel export for cleanup utilities

// Import and re-export types
import type {
    UnusedItemType,
    RiskLevel,
    FileType,
    UnusedItem,
    CleanupError,
    CleanupSummary,
    CleanupReport,
    DependencyNode,
    ProjectGraph,
    PackageDependency,
    AnalysisConfig,
    ProgressCallback,
    CleanupResult,
} from './types';

// Import and re-export config
import {
    DEFAULT_ANALYSIS_CONFIG,
    REACT_NATIVE_CONFIG_OVERRIDES,
    CLEANUP_MODES,
    getProjectConfig,
    validateConfig,
} from './config';

// Import and re-export scanner
import type { ScannedFile, ScanResult } from './scanner';
import { scanProjectFiles, getFileStatistics } from './scanner';

// Import and re-export parser
import type { ImportInfo, ExportInfo, ParseResult } from './parser';
import { parseFile, parseFiles } from './parser';

// Re-export types
export type {
    UnusedItemType,
    RiskLevel,
    FileType,
    UnusedItem,
    CleanupError,
    CleanupSummary,
    CleanupReport,
    DependencyNode,
    ProjectGraph,
    PackageDependency,
    AnalysisConfig,
    ProgressCallback,
    CleanupResult,
    ScannedFile,
    ScanResult,
    ImportInfo,
    ExportInfo,
    ParseResult,
};

// Re-export config
export {
    DEFAULT_ANALYSIS_CONFIG,
    REACT_NATIVE_CONFIG_OVERRIDES,
    CLEANUP_MODES,
    getProjectConfig,
    validateConfig,
};

// Re-export scanner
export {
    scanProjectFiles,
    getFileStatistics,
};

// Re-export parser
export {
    parseFile,
    parseFiles,
};