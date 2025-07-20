import * as fs from 'fs';
import { parseFile, parseFiles } from '../parser';
import { ScannedFile } from '../scanner';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('File Parser', () => {
  const mockRootDir = '/test/project';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseFile', () => {
    it('should parse imports correctly', () => {
      const mockFile: ScannedFile = {
        filePath: '/test/project/src/component.tsx',
        relativePath: 'src/component.tsx',
        extension: '.tsx',
        fileType: 'component',
        size: 1000,
        shouldAnalyze: true,
      };

      const sourceCode = `
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import * as utils from '../utils';
import type { ComponentProps } from './types';
import './styles.css';
      `;

      mockFs.readFileSync.mockReturnValue(sourceCode);

      const result = parseFile(mockFile, mockRootDir);

      expect(result.success).toBe(true);
      expect(result.imports).toHaveLength(5);
      
      // Check React import
      const reactImport = result.imports.find(imp => imp.moduleSpecifier === 'react');
      expect(reactImport).toBeDefined();
      expect(reactImport?.defaultImport).toBe('React');
      expect(reactImport?.namedImports).toEqual(['useState', 'useEffect']);
      
      // Check local import
      const buttonImport = result.imports.find(imp => imp.moduleSpecifier === './Button');
      expect(buttonImport).toBeDefined();
      expect(buttonImport?.namedImports).toEqual(['Button']);
      
      // Check namespace import
      const utilsImport = result.imports.find(imp => imp.moduleSpecifier === '../utils');
      expect(utilsImport).toBeDefined();
      expect(utilsImport?.namespaceImport).toBe('utils');
      
      // Check type-only import
      const typeImport = result.imports.find(imp => imp.moduleSpecifier === './types');
      expect(typeImport).toBeDefined();
      expect(typeImport?.isTypeOnly).toBe(true);
    });

    it('should parse exports correctly', () => {
      const mockFile: ScannedFile = {
        filePath: '/test/project/src/component.tsx',
        relativePath: 'src/component.tsx',
        extension: '.tsx',
        fileType: 'component',
        size: 1000,
        shouldAnalyze: true,
      };

      const sourceCode = `
export const CONSTANT = 'value';
export let variable = 42;
export function myFunction() {}
export class MyClass {}
export interface MyInterface {}
export type MyType = string;
export default Component;
export { namedExport } from './other';
      `;

      mockFs.readFileSync.mockReturnValue(sourceCode);

      const result = parseFile(mockFile, mockRootDir);

      expect(result.success).toBe(true);
      expect(result.exports.length).toBeGreaterThan(0);
      
      // Check different export types
      const constantExport = result.exports.find(exp => exp.name === 'CONSTANT');
      expect(constantExport?.type).toBe('const');
      
      const functionExport = result.exports.find(exp => exp.name === 'myFunction');
      expect(functionExport?.type).toBe('function');
      
      const classExport = result.exports.find(exp => exp.name === 'MyClass');
      expect(classExport?.type).toBe('class');
      
      const interfaceExport = result.exports.find(exp => exp.name === 'MyInterface');
      expect(interfaceExport?.type).toBe('interface');
      expect(interfaceExport?.isTypeOnly).toBe(true);
      
      const typeExport = result.exports.find(exp => exp.name === 'MyType');
      expect(typeExport?.type).toBe('type');
      expect(typeExport?.isTypeOnly).toBe(true);
      
      const defaultExport = result.exports.find(exp => exp.name === 'default');
      expect(defaultExport?.type).toBe('default');
      
      const reExport = result.exports.find(exp => exp.name === 'namedExport');
      expect(reExport?.isReExport).toBe(true);
      expect(reExport?.reExportSource).toBe('./other');
    });

    it('should detect dynamic imports', () => {
      const mockFile: ScannedFile = {
        filePath: '/test/project/src/component.tsx',
        relativePath: 'src/component.tsx',
        extension: '.tsx',
        fileType: 'component',
        size: 1000,
        shouldAnalyze: true,
      };

      const sourceCode = `
const loadComponent = async () => {
  const module = await import('./LazyComponent');
  return module.default;
};

function conditionalImport() {
  if (condition) {
    return import('../utils/helper');
  }
}
      `;

      mockFs.readFileSync.mockReturnValue(sourceCode);

      const result = parseFile(mockFile, mockRootDir);

      expect(result.success).toBe(true);
      expect(result.hasDynamicImports).toBe(true);
      
      const dynamicImports = result.imports.filter(imp => imp.isDynamic);
      expect(dynamicImports).toHaveLength(2);
      expect(dynamicImports[0].moduleSpecifier).toBe('./LazyComponent');
      expect(dynamicImports[1].moduleSpecifier).toBe('../utils/helper');
    });

    it('should handle parse errors gracefully', () => {
      const mockFile: ScannedFile = {
        filePath: '/test/project/src/invalid.tsx',
        relativePath: 'src/invalid.tsx',
        extension: '.tsx',
        fileType: 'component',
        size: 1000,
        shouldAnalyze: true,
      };

      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = parseFile(mockFile, mockRootDir);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Failed to parse file');
    });

    it('should resolve local module paths', () => {
      const mockFile: ScannedFile = {
        filePath: '/test/project/src/components/Button.tsx',
        relativePath: 'src/components/Button.tsx',
        extension: '.tsx',
        fileType: 'component',
        size: 1000,
        shouldAnalyze: true,
      };

      const sourceCode = `
import { utils } from '../utils';
import { Component } from './Component';
import { external } from 'external-package';
      `;

      mockFs.readFileSync.mockReturnValue(sourceCode);
      
      // Mock file existence checks for module resolution
      mockFs.existsSync.mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        return pathStr.includes('utils.ts') || pathStr.includes('Component.tsx');
      });
      
      mockFs.statSync.mockReturnValue({
        isDirectory: () => false,
      } as any);

      const result = parseFile(mockFile, mockRootDir);

      expect(result.success).toBe(true);
      
      const utilsImport = result.imports.find(imp => imp.moduleSpecifier === '../utils');
      expect(utilsImport?.resolvedPath).toBeDefined();
      
      const componentImport = result.imports.find(imp => imp.moduleSpecifier === './Component');
      expect(componentImport?.resolvedPath).toBeDefined();
      
      const externalImport = result.imports.find(imp => imp.moduleSpecifier === 'external-package');
      expect(externalImport?.resolvedPath).toBeUndefined();
    });
  });

  describe('parseFiles', () => {
    it('should parse multiple files', () => {
      const mockFiles: ScannedFile[] = [
        {
          filePath: '/test/project/src/file1.ts',
          relativePath: 'src/file1.ts',
          extension: '.ts',
          fileType: 'utility',
          size: 500,
          shouldAnalyze: true,
        },
        {
          filePath: '/test/project/src/file2.ts',
          relativePath: 'src/file2.ts',
          extension: '.ts',
          fileType: 'utility',
          size: 600,
          shouldAnalyze: true,
        },
      ];

      mockFs.readFileSync.mockImplementation((filePath) => {
        if (filePath.toString().includes('file1')) {
          return 'export const value1 = 1;';
        }
        return 'export const value2 = 2;';
      });

      const results = parseFiles(mockFiles, mockRootDir);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[0].exports).toHaveLength(1);
      expect(results[1].exports).toHaveLength(1);
    });
  });
});