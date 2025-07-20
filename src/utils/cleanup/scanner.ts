import * as fs from 'fs';
import * as path from 'path';
import { AnalysisConfig, FileType } from './types';
import * as micromatch from 'micromatch';

/**
 * Information about a scanned file
 */
export interface ScannedFile {
  /** Absolute file path */
  filePath: string;
  /** Relative path from root directory */
  relativePath: string;
  /** File extension */
  extension: string;
  /** File type categorization */
  fileType: FileType;
  /** File size in bytes */
  size: number;
  /** Whether this file should be analyzed */
  shouldAnalyze: boolean;
}

/**
 * Result of directory scanning
 */
export interface ScanResult {
  /** All files found */
  allFiles: ScannedFile[];
  /** Files that should be analyzed */
  analyzableFiles: ScannedFile[];
  /** Files that were excluded */
  excludedFiles: ScannedFile[];
  /** Directories that were skipped */
  skippedDirectories: string[];
}

/**
 * Check if a file path matches any of the exclusion patterns
 */
function isExcluded(filePath: string, rootDir: string, excludePatterns: string[]): boolean {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  
  return excludePatterns.some(pattern => 
    micromatch.isMatch(relativePath, pattern) || micromatch.isMatch(path.basename(filePath), pattern)
  );
}

/**
 * Determine file type based on file path and extension
 */
function determineFileType(filePath: string): FileType {
  const basename = path.basename(filePath);
  const extension = path.extname(filePath);
  
  // Test files
  if (basename.includes('.test.') || basename.includes('.spec.') || filePath.includes('__tests__')) {
    return 'test';
  }
  
  // Storybook files
  if (basename.includes('.stories.')) {
    return 'story';
  }
  
  // Configuration files
  if (basename.includes('config') || basename.includes('.config.') || 
      ['.json', '.js', '.ts'].includes(extension) && 
      ['package.json', 'tsconfig.json', 'babel.config.js'].includes(basename)) {
    return 'config';
  }
  
  // Type definition files
  if (basename.endsWith('.d.ts') || basename.includes('types') || basename.includes('interfaces')) {
    return 'type';
  }
  
  // React components
  if (['.tsx', '.jsx'].includes(extension) && 
      (basename.includes('Component') || /^[A-Z]/.test(basename))) {
    return 'component';
  }
  
  // Services (API, data access, etc.)
  if (basename.includes('service') || basename.includes('api') || basename.includes('client')) {
    return 'service';
  }
  
  // Default to utility
  return 'utility';
}

/**
 * Check if a file should be analyzed based on its extension and type
 */
function shouldAnalyzeFile(file: ScannedFile, config: AnalysisConfig): boolean {
  const analyzableExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  
  if (!analyzableExtensions.includes(file.extension)) {
    return false;
  }
  
  // Check config flags for test and story files
  if (file.fileType === 'test' && !config.includeTestFiles) {
    return false;
  }
  
  if (file.fileType === 'story' && !config.includeStoryFiles) {
    return false;
  }
  
  return true;
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(
  dirPath: string,
  rootDir: string,
  config: AnalysisConfig,
  result: ScanResult
): void {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Check if directory should be excluded
        if (isExcluded(fullPath, rootDir, config.excludePatterns)) {
          result.skippedDirectories.push(fullPath);
          continue;
        }
        
        // Recursively scan subdirectory
        scanDirectory(fullPath, rootDir, config, result);
      } else if (entry.isFile()) {
        const stats = fs.statSync(fullPath);
        const scannedFile: ScannedFile = {
          filePath: fullPath,
          relativePath: path.relative(rootDir, fullPath),
          extension: path.extname(entry.name),
          fileType: determineFileType(fullPath),
          size: stats.size,
          shouldAnalyze: false, // Will be set below
        };
        
        scannedFile.shouldAnalyze = shouldAnalyzeFile(scannedFile, config);
        
        result.allFiles.push(scannedFile);
        
        if (isExcluded(fullPath, rootDir, config.excludePatterns)) {
          result.excludedFiles.push(scannedFile);
        } else if (scannedFile.shouldAnalyze) {
          result.analyzableFiles.push(scannedFile);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
  }
}

/**
 * Scan project directory for files to analyze
 */
export function scanProjectFiles(config: AnalysisConfig): ScanResult {
  const result: ScanResult = {
    allFiles: [],
    analyzableFiles: [],
    excludedFiles: [],
    skippedDirectories: [],
  };
  
  if (!fs.existsSync(config.rootDir)) {
    throw new Error(`Root directory does not exist: ${config.rootDir}`);
  }
  
  const stats = fs.statSync(config.rootDir);
  if (!stats.isDirectory()) {
    throw new Error(`Root path is not a directory: ${config.rootDir}`);
  }
  
  scanDirectory(config.rootDir, config.rootDir, config, result);
  
  return result;
}

/**
 * Get file statistics from scan result
 */
export function getFileStatistics(scanResult: ScanResult) {
  const stats = {
    totalFiles: scanResult.allFiles.length,
    analyzableFiles: scanResult.analyzableFiles.length,
    excludedFiles: scanResult.excludedFiles.length,
    skippedDirectories: scanResult.skippedDirectories.length,
    totalSize: scanResult.allFiles.reduce((sum, file) => sum + file.size, 0),
    analyzableSize: scanResult.analyzableFiles.reduce((sum, file) => sum + file.size, 0),
    fileTypeBreakdown: {} as Record<FileType, number>,
  };
  
  // Calculate file type breakdown
  for (const file of scanResult.allFiles) {
    stats.fileTypeBreakdown[file.fileType] = (stats.fileTypeBreakdown[file.fileType] || 0) + 1;
  }
  
  return stats;
}