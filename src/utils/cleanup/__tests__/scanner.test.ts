import * as fs from 'fs';
import * as path from 'path';
import { scanProjectFiles, getFileStatistics, ScannedFile } from '../scanner';
import { DEFAULT_ANALYSIS_CONFIG } from '../config';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('File Scanner', () => {
  const mockRootDir = '/test/project';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scanProjectFiles', () => {
    it('should scan directory and categorize files correctly', () => {
      // Mock file system structure
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr === mockRootDir) {
          return { isDirectory: () => true, isFile: () => false, size: 0 } as any;
        }
        return {
          isDirectory: () => pathStr.includes('src') || pathStr.includes('components'),
          isFile: () => !pathStr.includes('src') && !pathStr.includes('components'),
          size: 1000,
        } as any;
      });

      mockFs.readdirSync.mockImplementation((dirPath) => {
        if (dirPath === mockRootDir) {
          return [
            { name: 'src', isDirectory: () => true, isFile: () => false },
            { name: 'package.json', isDirectory: () => false, isFile: () => true },
            { name: 'node_modules', isDirectory: () => true, isFile: () => false },
          ] as any;
        }
        if (dirPath.toString().includes('src')) {
          return [
            { name: 'components', isDirectory: () => true, isFile: () => false },
            { name: 'utils.ts', isDirectory: () => false, isFile: () => true },
            { name: 'types.ts', isDirectory: () => false, isFile: () => true },
          ] as any;
        }
        if (dirPath.toString().includes('components')) {
          return [
            { name: 'Button.tsx', isDirectory: () => false, isFile: () => true },
            { name: 'Button.test.tsx', isDirectory: () => false, isFile: () => true },
            { name: 'Button.stories.tsx', isDirectory: () => false, isFile: () => true },
          ] as any;
        }
        return [] as any;
      });

      const config = {
        ...DEFAULT_ANALYSIS_CONFIG,
        rootDir: mockRootDir,
        includeTestFiles: true,
        includeStoryFiles: true,
      };

      const result = scanProjectFiles(config);

      expect(result.allFiles.length).toBeGreaterThan(0);
      expect(result.analyzableFiles.length).toBeGreaterThan(0);
      expect(result.excludedFiles.length).toBeGreaterThan(0);
      expect(result.skippedDirectories).toContain(path.join(mockRootDir, 'node_modules'));
    });

    it('should exclude files based on patterns', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr === mockRootDir) {
          return { isDirectory: () => true, isFile: () => false, size: 0 } as any;
        }
        return {
          isDirectory: () => false,
          isFile: () => true,
          size: 1000,
        } as any;
      });

      mockFs.readdirSync.mockReturnValue([
        { name: 'component.tsx', isDirectory: () => false, isFile: () => true },
        { name: 'test.spec.ts', isDirectory: () => false, isFile: () => true },
        { name: 'config.js', isDirectory: () => false, isFile: () => true },
      ] as any);

      const config = {
        ...DEFAULT_ANALYSIS_CONFIG,
        rootDir: mockRootDir,
        excludePatterns: ['*.spec.ts', '*.config.js'],
        includeTestFiles: false,
      };

      const result = scanProjectFiles(config);

      const excludedFiles = result.excludedFiles.map(f => path.basename(f.filePath));
      expect(excludedFiles).toContain('test.spec.ts');
      expect(excludedFiles).toContain('config.js');
    });

    it('should handle non-existent directory', () => {
      mockFs.existsSync.mockReturnValue(false);

      const config = {
        ...DEFAULT_ANALYSIS_CONFIG,
        rootDir: '/non/existent/path',
      };

      expect(() => scanProjectFiles(config)).toThrow('Root directory does not exist');
    });

    it('should categorize file types correctly', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr === mockRootDir) {
          return { isDirectory: () => true, isFile: () => false, size: 0 } as any;
        }
        return {
          isDirectory: () => false,
          isFile: () => true,
          size: 1000,
        } as any;
      });

      mockFs.readdirSync.mockReturnValue([
        { name: 'Button.tsx', isDirectory: () => false, isFile: () => true },
        { name: 'api.service.ts', isDirectory: () => false, isFile: () => true },
        { name: 'types.d.ts', isDirectory: () => false, isFile: () => true },
        { name: 'utils.test.ts', isDirectory: () => false, isFile: () => true },
        { name: 'Component.stories.tsx', isDirectory: () => false, isFile: () => true },
        { name: 'config.json', isDirectory: () => false, isFile: () => true },
      ] as any);

      const config = {
        ...DEFAULT_ANALYSIS_CONFIG,
        rootDir: mockRootDir,
        excludePatterns: [],
      };

      const result = scanProjectFiles(config);

      const fileTypes = result.allFiles.reduce((acc, file) => {
        acc[file.fileType] = (acc[file.fileType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(fileTypes.component).toBe(1); // Button.tsx
      expect(fileTypes.service).toBe(1); // api.service.ts
      expect(fileTypes.type).toBe(1); // types.d.ts
      expect(fileTypes.test).toBe(1); // utils.test.ts
      expect(fileTypes.story).toBe(1); // Component.stories.tsx
      expect(fileTypes.config).toBe(1); // config.json
    });
  });

  describe('getFileStatistics', () => {
    it('should calculate statistics correctly', () => {
      const mockScanResult = {
        allFiles: [
          { fileType: 'component', size: 1000 } as ScannedFile,
          { fileType: 'test', size: 500 } as ScannedFile,
          { fileType: 'component', size: 800 } as ScannedFile,
        ],
        analyzableFiles: [
          { fileType: 'component', size: 1000 } as ScannedFile,
          { fileType: 'component', size: 800 } as ScannedFile,
        ],
        excludedFiles: [
          { fileType: 'test', size: 500 } as ScannedFile,
        ],
        skippedDirectories: ['node_modules'],
      };

      const stats = getFileStatistics(mockScanResult);

      expect(stats.totalFiles).toBe(3);
      expect(stats.analyzableFiles).toBe(2);
      expect(stats.excludedFiles).toBe(1);
      expect(stats.skippedDirectories).toBe(1);
      expect(stats.totalSize).toBe(2300);
      expect(stats.analyzableSize).toBe(1800);
      expect(stats.fileTypeBreakdown.component).toBe(2);
      expect(stats.fileTypeBreakdown.test).toBe(1);
    });
  });
});