#!/usr/bin/env node

/**
 * Fix NavigationGuard Import Paths Script
 * 
 * This script systematically finds and fixes all incorrect imports for navigationGuard
 * from '@/src/utils/navigationGuard' to the correct '@lib/utils/navigationGuard' path alias.
 * 
 * Usage:
 *   node scripts/fix-navigationguard-imports.js --dry-run  # Preview changes
 *   node scripts/fix-navigationguard-imports.js            # Apply changes
 *   node scripts/fix-navigationguard-imports.js --verbose  # Detailed output
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  directories: ['src/', 'app/'],
  
  // File extensions to process
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // NavigationGuard import path replacement patterns
  patterns: [
    // Main pattern: @/src/utils/navigationGuard → @lib/utils/navigationGuard
    {
      regex: /from\s*['"]@\/src\/utils\/navigationGuard['"];?/g,
      replacement: "from '@lib/utils/navigationGuard';"
    },
    // Dynamic imports
    {
      regex: /import\s*\(\s*['"]@\/src\/utils\/navigationGuard['"]\s*\)/g,
      replacement: "import('@lib/utils/navigationGuard')"
    },
    // Require statements
    {
      regex: /require\s*\(\s*['"]@\/src\/utils\/navigationGuard['"]\s*\)/g,
      replacement: "require('@lib/utils/navigationGuard')"
    },
    // Alternative patterns that might exist
    {
      regex: /from\s*['"]@\/src\/utils\/navigationGuard\.ts['"];?/g,
      replacement: "from '@lib/utils/navigationGuard';"
    },
    {
      regex: /from\s*['"]@\/src\/utils\/navigationGuard\.js['"];?/g,
      replacement: "from '@lib/utils/navigationGuard';"
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
  importsFixed: 0,
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
 * Fix navigationGuard imports in a file
 */
function fixNavigationGuardImports(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = originalContent;
    let fileModified = false;
    let importsFixedInFile = 0;
    
    // Apply each pattern
    CONFIG.patterns.forEach(pattern => {
      const matches = modifiedContent.match(pattern.regex);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        importsFixedInFile += matches.length;
        fileModified = true;
      }
    });
    
    if (fileModified) {
      if (isVerbose) {
        console.log(`📝 ${filePath}: Fixed ${importsFixedInFile} navigationGuard import(s)`);
      }
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
      
      stats.filesModified++;
      stats.importsFixed += importsFixedInFile;
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
  console.log('🧭 Fixing NavigationGuard Import Paths: @/src/utils/navigationGuard → @lib/utils/navigationGuard...\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Get all files to process
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(filePath => {
    fixNavigationGuardImports(filePath);
  });
  
  // Print results
  console.log('\n📊 Results:');
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   NavigationGuard imports fixed: ${stats.importsFixed}`);
  
  if (stats.errors.length > 0) {
    console.log(`   Errors: ${stats.errors.length}`);
    console.log('\n❌ Errors encountered:');
    stats.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (stats.importsFixed > 0) {
    console.log('\n✅ NavigationGuard import paths have been fixed!');
    if (isDryRun) {
      console.log('   Run without --dry-run to apply changes');
    }
  } else {
    console.log('\n✨ No navigationGuard import issues found!');
  }
}

// Run the script
main();
