import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { ScannedFile } from './scanner';

/**
 * Information about an import statement
 */
export interface ImportInfo {
  /** Module being imported (e.g., 'react', './components/Button') */
  moduleSpecifier: string;
  /** Resolved absolute path if it's a local import */
  resolvedPath?: string;
  /** Named imports (e.g., ['useState', 'useEffect']) */
  namedImports: string[];
  /** Default import name */
  defaultImport?: string;
  /** Namespace import name (import * as name) */
  namespaceImport?: string;
  /** Whether this is a type-only import */
  isTypeOnly: boolean;
  /** Whether this is a dynamic import */
  isDynamic: boolean;
  /** Line number where import appears */
  lineNumber: number;
}

/**
 * Information about an export statement
 */
export interface ExportInfo {
  /** Name of the exported item */
  name: string;
  /** Type of export */
  type: 'function' | 'class' | 'interface' | 'type' | 'const' | 'let' | 'var' | 'default' | 'namespace';
  /** Whether this is a type-only export */
  isTypeOnly: boolean;
  /** Whether this is a re-export from another module */
  isReExport: boolean;
  /** Module being re-exported from */
  reExportSource?: string;
  /** Line number where export appears */
  lineNumber: number;
}

/**
 * Result of parsing a TypeScript/JavaScript file
 */
export interface ParseResult {
  /** File that was parsed */
  file: ScannedFile;
  /** All imports found in the file */
  imports: ImportInfo[];
  /** All exports found in the file */
  exports: ExportInfo[];
  /** Whether the file has dynamic imports */
  hasDynamicImports: boolean;
  /** Parse errors encountered */
  errors: string[];
  /** Whether parsing was successful */
  success: boolean;
}

/**
 * Resolve a module specifier to an absolute path
 */
function resolveModuleSpecifier(
  moduleSpecifier: string,
  containingFile: string,
  rootDir: string
): string | undefined {
  // Skip external modules (don't start with . or /)
  if (!moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('/')) {
    return undefined;
  }
  
  const containingDir = path.dirname(containingFile);
  let resolvedPath = path.resolve(containingDir, moduleSpecifier);
  
  // Try different extensions
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts'];
  
  // Check if it's already a file
  for (const ext of extensions) {
    const withExt = resolvedPath + ext;
    if (fs.existsSync(withExt)) {
      return withExt;
    }
  }
  
  // Check if it's a directory with index file
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    for (const ext of extensions) {
      const indexFile = path.join(resolvedPath, `index${ext}`);
      if (fs.existsSync(indexFile)) {
        return indexFile;
      }
    }
  }
  
  return undefined;
}

/**
 * Extract import information from import declaration
 */
function extractImportInfo(
  node: ts.ImportDeclaration,
  sourceFile: ts.SourceFile,
  filePath: string,
  rootDir: string
): ImportInfo {
  const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
  const lineNumber = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
  
  const importInfo: ImportInfo = {
    moduleSpecifier,
    resolvedPath: resolveModuleSpecifier(moduleSpecifier, filePath, rootDir),
    namedImports: [],
    isTypeOnly: node.importClause?.isTypeOnly || false,
    isDynamic: false,
    lineNumber,
  };
  
  if (node.importClause) {
    // Default import
    if (node.importClause.name) {
      importInfo.defaultImport = node.importClause.name.text;
    }
    
    // Named imports
    if (node.importClause.namedBindings) {
      if (ts.isNamespaceImport(node.importClause.namedBindings)) {
        // import * as name
        importInfo.namespaceImport = node.importClause.namedBindings.name.text;
      } else if (ts.isNamedImports(node.importClause.namedBindings)) {
        // import { name1, name2 }
        importInfo.namedImports = node.importClause.namedBindings.elements.map(
          element => element.name.text
        );
      }
    }
  }
  
  return importInfo;
}

/**
 * Extract export information from export declaration
 */
function extractExportInfo(
  node: ts.Node,
  sourceFile: ts.SourceFile
): ExportInfo[] {
  const exports: ExportInfo[] = [];
  const lineNumber = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
  
  if (ts.isExportDeclaration(node)) {
    // export { name1, name2 } from 'module'
    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const element of node.exportClause.elements) {
        exports.push({
          name: element.name.text,
          type: 'const', // Default type for re-exports
          isTypeOnly: node.isTypeOnly || false,
          isReExport: !!node.moduleSpecifier,
          reExportSource: node.moduleSpecifier ? (node.moduleSpecifier as ts.StringLiteral).text : undefined,
          lineNumber,
        });
      }
    }
  } else if (ts.isExportAssignment(node)) {
    // export = or export default
    exports.push({
      name: 'default',
      type: 'default',
      isTypeOnly: false,
      isReExport: false,
      lineNumber,
    });
  } else if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    // export const/let/var
    for (const declaration of node.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        exports.push({
          name: declaration.name.text,
          type: node.declarationList.flags & ts.NodeFlags.Const ? 'const' :
                node.declarationList.flags & ts.NodeFlags.Let ? 'let' : 'var',
          isTypeOnly: false,
          isReExport: false,
          lineNumber,
        });
      }
    }
  } else if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    // export function
    if (node.name) {
      exports.push({
        name: node.name.text,
        type: 'function',
        isTypeOnly: false,
        isReExport: false,
        lineNumber,
      });
    }
  } else if (ts.isClassDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    // export class
    if (node.name) {
      exports.push({
        name: node.name.text,
        type: 'class',
        isTypeOnly: false,
        isReExport: false,
        lineNumber,
      });
    }
  } else if (ts.isInterfaceDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    // export interface
    exports.push({
      name: node.name.text,
      type: 'interface',
      isTypeOnly: true,
      isReExport: false,
      lineNumber,
    });
  } else if (ts.isTypeAliasDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    // export type
    exports.push({
      name: node.name.text,
      type: 'type',
      isTypeOnly: true,
      isReExport: false,
      lineNumber,
    });
  }
  
  return exports;
}

/**
 * Find dynamic imports in the source file
 */
function findDynamicImports(sourceFile: ts.SourceFile, filePath: string, rootDir: string): ImportInfo[] {
  const dynamicImports: ImportInfo[] = [];
  
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && 
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments.length > 0 &&
        ts.isStringLiteral(node.arguments[0])) {
      
      const moduleSpecifier = node.arguments[0].text;
      const lineNumber = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      
      dynamicImports.push({
        moduleSpecifier,
        resolvedPath: resolveModuleSpecifier(moduleSpecifier, filePath, rootDir),
        namedImports: [],
        isTypeOnly: false,
        isDynamic: true,
        lineNumber,
      });
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return dynamicImports;
}

/**
 * Parse a TypeScript/JavaScript file
 */
export function parseFile(file: ScannedFile, rootDir: string): ParseResult {
  const result: ParseResult = {
    file,
    imports: [],
    exports: [],
    hasDynamicImports: false,
    errors: [],
    success: false,
  };
  
  try {
    const sourceCode = fs.readFileSync(file.filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      file.filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Extract imports and exports
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isImportDeclaration(node)) {
        const importInfo = extractImportInfo(node, sourceFile, file.filePath, rootDir);
        result.imports.push(importInfo);
      } else {
        const exportInfos = extractExportInfo(node, sourceFile);
        result.exports.push(...exportInfos);
      }
    });
    
    // Find dynamic imports
    const dynamicImports = findDynamicImports(sourceFile, file.filePath, rootDir);
    result.imports.push(...dynamicImports);
    result.hasDynamicImports = dynamicImports.length > 0;
    
    result.success = true;
  } catch (error) {
    result.errors.push(`Failed to parse file: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return result;
}

/**
 * Parse multiple files
 */
export function parseFiles(files: ScannedFile[], rootDir: string): ParseResult[] {
  return files.map(file => parseFile(file, rootDir));
}