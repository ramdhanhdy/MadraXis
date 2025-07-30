#!/usr/bin/env node

/**
 * Fix TS2304 Type Import Errors Script
 * 
 * This script fixes TS2304 "Cannot find name" errors caused by files that
 * re-export types and then try to use them in the same file.
 * 
 * Pattern fixed:
 * - export type { TypeName } from '@types' → import type { TypeName } from '@types'
 * 
 * This resolves the issue where TypeScript can't resolve types that are
 * re-exported and used in the same file.
 * 
 * Usage:
 *   node scripts/fix-ts2304-type-imports.js --dry-run  # Preview changes
 *   node scripts/fix-ts2304-type-imports.js            # Apply changes
 *   node scripts/fix-ts2304-type-imports.js --verbose  # Detailed output
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  directories: ['src/', 'app/'],
  
  // File extensions to process
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Type import patterns to fix
  patterns: [
    // Main pattern: export type { ... } from '@types' → import type { ... } from '@types'
    {
      regex: /^(\s*)export\s+type\s*{\s*([^}]+)\s*}\s*from\s*['"]@types['"];?\s*$/gm,
      replacement: "$1import type { $2 } from '@types';"
    },
    // Pattern with specific type paths
    {
      regex: /^(\s*)export\s+type\s*{\s*([^}]+)\s*}\s*from\s*['"]@types\/([^'"]+)['"];?\s*$/gm,
      replacement: "$1import type { $2 } from '@types/$3';"
    },
    // Pattern for student/teacher specific types
    {
      regex: /^(\s*)export\s+type\s*{\s*(Student|Teacher|AcademicRecord|BehaviorRecord|[^}]+)\s*}\s*from\s*['"]@types\/student['"];?\s*$/gm,
      replacement: "$1import type { $2 } from '@types/student';"
    },
    // Pattern for other common type imports
    {
      regex: /^(\s*)export\s+type\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/\.\.\/src\/types['"];?\s*$/gm,
      replacement: "$1import type { $2 } from '@types';"
    },
    {
      regex: /^(\s*)export\s+type\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/src\/types['"];?\s*$/gm,
      replacement: "$1import type { $2 } from '@types';"
    }
  ],
  
  // Directories to exclude
  excludeDirs: ['node_modules', '.git', '.expo', 'dist', 'build', '.migration-backups']
};

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose') || isDryRun;

// Statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  exportsFixed: 0,
  errors: []
};

/**
 * Get all files to process
 */
function getAllFiles(directories = CONFIG.directories) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) {
      console.warn(`⚠️  Directory not found: ${currentDir}`);
      return;
    }
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (!CONFIG.excludeDirs.includes(entry.name) && !entry.name.startsWith('.')) {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        // Include files with matching extensions
        const ext = path.extname(entry.name);
        if (CONFIG.extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  directories.forEach(dir => traverse(dir));
  return files;
}

/**
 * Fix type export/import issues in a file
 */
function fixTypeImports(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = originalContent;
    let fileModified = false;
    let exportsFixedInFile = 0;
    
    // Apply each pattern
    CONFIG.patterns.forEach(pattern => {
      const matches = modifiedContent.match(pattern.regex);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        exportsFixedInFile += matches.length;
        fileModified = true;
      }
    });
    
    if (fileModified) {
      if (isVerbose) {
        console.log(`📝 ${filePath}: Fixed ${exportsFixedInFile} type export(s) → import(s)`);
      }
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
      
      stats.filesModified++;
      stats.exportsFixed += exportsFixedInFile;
    }
    
    stats.filesScanned++;
    
  } catch (error) {
    const errorMsg = `Error processing ${filePath}: ${error.message}`;
    stats.errors.push(errorMsg);
    console.error(`❌ ${errorMsg}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Fixing TS2304 Type Import Errors...\n');
  console.log('   Converting: export type { ... } from \'@types\'');
  console.log('   To:         import type { ... } from \'@types\'\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Get all files to process
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(filePath => {
    fixTypeImports(filePath);
  });
  
  // Print results
  console.log('\n📊 Results:');
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   Type exports → imports fixed: ${stats.exportsFixed}`);
  
  if (stats.errors.length > 0) {
    console.log(`   Errors: ${stats.errors.length}`);
    console.log('\n❌ Errors encountered:');
    stats.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (stats.exportsFixed > 0) {
    console.log('\n✅ TS2304 type import errors have been fixed!');
    console.log('   Re-run TypeScript check to verify improvements');
    if (isDryRun) {
      console.log('   Run without --dry-run to apply changes');
    }
  } else {
    console.log('\n✨ No type export/import issues found!');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('• Run: bun tsc --noEmit --skipLibCheck 2>&1 | node scripts/list-ts2304-errors.js');
  console.log('• Check if TS2304 error count has decreased');
  console.log('• Address any remaining hook import issues separately');
}

// Run the script
main();
