#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

/**
 * Automated Fix Script for Console Logging Security Issues
 * Uses AST parsing to accurately replace console statements with secure logger
 * Avoids altering console statements inside comments or strings
 * Optimized for Bun runtime
 */

class LoggingSecurityFixer {
  constructor() {
    this.fixedFiles = new Set();
    this.backupDir = path.join(process.cwd(), '.security-backups', Date.now().toString());
  }

  async createBackup(filePath) {
    const backupPath = path.join(this.backupDir, filePath);
    const backupDirPath = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }
    
    const sourceFile = Bun.file(filePath);
    const content = await sourceFile.text();
    await Bun.write(backupPath, content);
  }

  async fixFile(filePath) {
    try {
      await this.createBackup(filePath);
      
      const file = Bun.file(filePath);
      let content = await file.text();
      let modified = false;
      
      // Parse the file using Babel parser
      let ast;
      try {
        ast = parser.parse(content, {
          sourceType: 'module',
          allowImportExportEverywhere: true,
          allowReturnOutsideFunction: true,
          plugins: [
            'jsx',
            'typescript',
            'decorators-legacy',
            'classProperties',
            'objectRestSpread',
            'asyncGenerators',
            'dynamicImport'
          ]
        });
      } catch (parseError) {
        console.error(`❌ Failed to parse ${filePath}: ${parseError.message}`);
        return;
      }

      // Track if we need to add logger import
      let needsLoggerImport = true;
      let hasConsoleCalls = false;

      // Check for existing logger import
      traverse(ast, {
        ImportDeclaration(path) {
          const importPath = path.node.source.value;
          if (importPath.includes('logger') || importPath.includes('utils/logger')) {
            path.node.specifiers.forEach(specifier => {
              if (specifier.imported && specifier.imported.name === 'logger') {
                needsLoggerImport = false;
              } else if (specifier.local && specifier.local.name === 'logger') {
                needsLoggerImport = false;
              }
            });
          }
        },

        // Find console calls that need replacement
        MemberExpression(path) {
          if (
            t.isIdentifier(path.node.object, { name: 'console' }) &&
            ['log', 'info', 'warn', 'error', 'debug'].includes(path.node.property.name)
          ) {
            const parent = path.parent;
            if (t.isCallExpression(parent) && path === parent.callee) {
              hasConsoleCalls = true;
            }
          }
        }
      });

      if (!hasConsoleCalls && !needsLoggerImport) {
        // No changes needed
        return;
      }

      // Transform the AST
      traverse(ast, {
        CallExpression(path) {
          if (
            t.isMemberExpression(path.node.callee) &&
            t.isIdentifier(path.node.callee.object, { name: 'console' }) &&
            t.isIdentifier(path.node.callee.property) &&
            ['log', 'info', 'warn', 'error', 'debug'].includes(path.node.callee.property.name)
          ) {
            // Replace console.method with logger.method
            const methodName = path.node.callee.property.name;
            const loggerMethod = methodName === 'log' ? 'debug' : methodName;
            
            path.node.callee = t.memberExpression(
              t.identifier('logger'),
              t.identifier(loggerMethod)
            );
            
            modified = true;
          }
        }
      });

      // Generate new code from AST
      const newContent = generator(ast, {
        retainLines: true,
        compact: false,
        concise: false
      }).code;

      // Add logger import if needed
      let finalContent = newContent;
      if (needsLoggerImport) {
        const importPath = this.getLoggerImportPath(filePath);
        finalContent = `import { logger } from '${importPath}';\n${newContent}`;
      }

      if (modified || needsLoggerImport) {
        await Bun.write(filePath, finalContent);
        this.fixedFiles.add(filePath);
        console.log(`✅ Fixed: ${filePath}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to fix ${filePath}: ${error.message}`);
    }
  }

  getLoggerImportPath(filePath) {
    // Normalize path for both Windows and Unix systems
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Get the directory of the current file
    const fileDir = path.dirname(normalizedPath);
    
    // Get the project root directory (where package.json is located)
    const projectRoot = process.cwd().replace(/\\/g, '/');
    
    // Calculate the relative path from file directory to utils/logger
    let relativePath = path.relative(fileDir, path.join(projectRoot, 'src', 'utils', 'logger'));
    
    // Ensure forward slashes for consistency
    relativePath = relativePath.replace(/\\/g, '/');
    
    // Ensure the path starts with ./ for relative imports when needed
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    // Remove the .ts extension if present
    relativePath = relativePath.replace(/\.ts$/, '');
    
    return relativePath;
  }

  async run() {
    console.log('🔧 Starting automated logging security fixes...\n');
    
    // First, run audit to find issues
    const { default: LoggingSecurityAuditor } = await import('./audit-logging.js');
    const auditor = new LoggingSecurityAuditor();
    await auditor.run();
    const report = auditor.generateReport();
    
    if (report.findings.length === 0) {
      console.log('✅ No issues to fix!');
      return;
    }
    
    console.log(`\n🔧 Attempting to fix ${report.findings.length} issues...\n`);
    
    // Group findings by file
    const fileFindings = {};
    report.findings.forEach(finding => {
      if (!fileFindings[finding.file]) {
        fileFindings[finding.file] = [];
      }
      fileFindings[finding.file].push(finding);
    });
    
    // Fix each file
    for (const filePath of Object.keys(fileFindings)) {
      await this.fixFile(filePath);
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Files fixed: ${this.fixedFiles.size}`);
    console.log(`Backup location: ${this.backupDir}`);
    
    if (this.fixedFiles.size > 0) {
      console.log('\n⚠️  IMPORTANT: Review the changes and test your application!');
      console.log('   Run the audit script again to verify fixes.');
    }
  }
}

// Run the fixer
if (import.meta.main) {
  const fixer = new LoggingSecurityFixer();
  fixer.run();
}

export default LoggingSecurityFixer;
