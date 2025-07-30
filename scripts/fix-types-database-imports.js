#!/usr/bin/env node

/**
 * Fix @types/database Import Conflicts Script
 * 
 * This script fixes TS6137 "Cannot import type declaration files" errors
 * caused by @types/database imports conflicting with npm's @types namespace.
 * 
 * The script converts @types/database imports to appropriate relative paths
 * based on the file's location in the directory structure.
 * 
 * Pattern fixed:
 * - @types/database → relative path to src/types/database
 * 
 * Usage:
 *   node scripts/fix-types-database-imports.js --dry-run  # Preview changes
 *   node scripts/fix-types-database-imports.js            # Apply changes
 *   node scripts/fix-types-database-imports.js --verbose  # Detailed output
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  directories: ['src/', 'app/'],
  
  // File extensions to process
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
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
  importsFixed: 0,
  errors: []
};

/**
 * Calculate relative path from file to src/types/database
 */
function getRelativePathToDatabase(filePath) {
  // Normalize the file path
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  
  // Count directory levels from the file to the root
  const pathParts = normalizedFilePath.split('/');
  
  // Find how many levels up we need to go to reach the root
  let levelsUp = 0;
  let foundSrc = false;
  
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === 'src' || pathParts[i] === 'app') {
      foundSrc = true;
      // Count remaining directory levels (excluding the filename)
      levelsUp = pathParts.length - i - 2; // -1 for filename, -1 for the src/app directory itself
      break;
    }
  }
  
  if (!foundSrc) {
    // Fallback: assume we're in a subdirectory
    levelsUp = pathParts.length - 2; // -1 for filename, -1 for current directory
  }
  
  // Build the relative path
  const upPath = '../'.repeat(Math.max(levelsUp, 0));
  return `${upPath}src/types/database`;
}

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
 * Fix @types/database imports in a file
 */
function fixDatabaseImports(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains @types/database imports
    if (!originalContent.includes('@types/database')) {
      stats.filesScanned++;
      return;
    }
    
    // Calculate the correct relative path for this file
    const relativePath = getRelativePathToDatabase(filePath);
    
    // Replace all @types/database imports with the relative path
    const modifiedContent = originalContent.replace(
      /@types\/database/g,
      relativePath
    );
    
    const importsFixed = (originalContent.match(/@types\/database/g) || []).length;
    
    if (importsFixed > 0) {
      if (isVerbose) {
        console.log(`📝 ${filePath}:`);
        console.log(`   @types/database → ${relativePath}`);
        console.log(`   Fixed ${importsFixed} import(s)`);
      }
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
      
      stats.filesModified++;
      stats.importsFixed += importsFixed;
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
  console.log('🔧 Fixing @types/database Import Conflicts...\n');
  console.log('   Converting: @types/database');
  console.log('   To:         relative path to src/types/database\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Get all files to process
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(filePath => {
    fixDatabaseImports(filePath);
  });
  
  // Print results
  console.log('\n📊 Results:');
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   @types/database imports fixed: ${stats.importsFixed}`);
  
  if (stats.errors.length > 0) {
    console.log(`   Errors: ${stats.errors.length}`);
    console.log('\n❌ Errors encountered:');
    stats.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (stats.importsFixed > 0) {
    console.log('\n✅ @types/database import conflicts have been fixed!');
    console.log('   All imports now use relative paths to avoid npm @types conflicts');
    if (isDryRun) {
      console.log('   Run without --dry-run to apply changes');
    }
  } else {
    console.log('\n✨ No @types/database import issues found!');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('• Run TypeScript check to verify TS6137 errors are resolved');
  console.log('• Check that all database type imports are working correctly');
}

// Run the script
main();
