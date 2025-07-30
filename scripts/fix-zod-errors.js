#!/usr/bin/env node

/**
 * Fix Zod Error Property Script
 * 
 * This script systematically finds and fixes all incorrect usage of 'error.errors'
 * in Zod error handling and replaces them with the correct 'error.issues' property.
 * 
 * Common Zod error patterns:
 * - error.errors.forEach() → error.issues.forEach()
 * - error.errors[0] → error.issues[0]
 * - error.errors.length → error.issues.length
 * - error.errors.map() → error.issues.map()
 * 
 * Usage:
 *   node scripts/fix-zod-errors.js --dry-run  # Preview changes
 *   node scripts/fix-zod-errors.js            # Apply changes
 *   node scripts/fix-zod-errors.js --verbose  # Detailed output
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  directories: ['src/', 'app/'],
  
  // File extensions to process
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Zod error property replacement patterns
  patterns: [
    // error.errors.forEach() → error.issues.forEach()
    {
      regex: /(\w+)\.errors\.forEach\(/g,
      replacement: "$1.issues.forEach("
    },
    // error.errors.map() → error.issues.map()
    {
      regex: /(\w+)\.errors\.map\(/g,
      replacement: "$1.issues.map("
    },
    // error.errors.filter() → error.issues.filter()
    {
      regex: /(\w+)\.errors\.filter\(/g,
      replacement: "$1.issues.filter("
    },
    // error.errors.find() → error.issues.find()
    {
      regex: /(\w+)\.errors\.find\(/g,
      replacement: "$1.issues.find("
    },
    // error.errors.length → error.issues.length
    {
      regex: /(\w+)\.errors\.length/g,
      replacement: "$1.issues.length"
    },
    // error.errors[index] → error.issues[index]
    {
      regex: /(\w+)\.errors\[([^\]]+)\]/g,
      replacement: "$1.issues[$2]"
    },
    // error.errors.some() → error.issues.some()
    {
      regex: /(\w+)\.errors\.some\(/g,
      replacement: "$1.issues.some("
    },
    // error.errors.every() → error.issues.every()
    {
      regex: /(\w+)\.errors\.every\(/g,
      replacement: "$1.issues.every("
    },
    // error.errors.reduce() → error.issues.reduce()
    {
      regex: /(\w+)\.errors\.reduce\(/g,
      replacement: "$1.issues.reduce("
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
  errorsFixed: 0,
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
 * Fix Zod error properties in a file
 */
function fixZodErrors(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = originalContent;
    let fileModified = false;
    let errorsFixedInFile = 0;
    
    // Apply each pattern
    CONFIG.patterns.forEach(pattern => {
      const matches = modifiedContent.match(pattern.regex);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        errorsFixedInFile += matches.length;
        fileModified = true;
      }
    });
    
    if (fileModified) {
      if (isVerbose) {
        console.log(`📝 ${filePath}: Fixed ${errorsFixedInFile} Zod error property usage(s)`);
      }
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
      
      stats.filesModified++;
      stats.errorsFixed += errorsFixedInFile;
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
  console.log('🔧 Fixing Zod Error Properties: error.errors → error.issues...\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Get all files to process
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(filePath => {
    fixZodErrors(filePath);
  });
  
  // Print results
  console.log('\n📊 Results:');
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   Zod error properties fixed: ${stats.errorsFixed}`);
  
  if (stats.errors.length > 0) {
    console.log(`   Errors: ${stats.errors.length}`);
    console.log('\n❌ Errors encountered:');
    stats.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (stats.errorsFixed > 0) {
    console.log('\n✅ Zod error properties have been fixed!');
    console.log('   All error.errors → error.issues conversions completed');
    if (isDryRun) {
      console.log('   Run without --dry-run to apply changes');
    }
  } else {
    console.log('\n✨ No Zod error property issues found!');
  }
}

// Run the script
main();
