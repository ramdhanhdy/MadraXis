#!/usr/bin/env node

/**
 * Fix Common Import Paths Script
 * 
 * This script fixes the three most common incorrect import patterns:
 * 1. @/src/hooks/useAuth → @lib/hooks/useAuth
 * 2. @/src/styles/colors → @design-system/tokens/colors
 * 3. @/src/styles/spacing → @design-system/tokens/spacing
 * 
 * Usage:
 *   node scripts/fix-common-imports.js --dry-run  # Preview changes
 *   node scripts/fix-common-imports.js            # Apply changes
 *   node scripts/fix-common-imports.js --verbose  # Detailed output
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  directories: ['src/', 'app/'],
  
  // File extensions to process
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Specific import path replacement patterns
  patterns: [
    // 1. useAuth hook import
    {
      regex: /from\s*['"]@\/src\/hooks\/useAuth['"];?/g,
      replacement: "from '@lib/hooks/useAuth';"
    },
    // 2. Colors import
    {
      regex: /from\s*['"]@\/src\/styles\/colors['"];?/g,
      replacement: "from '@design-system/tokens/colors';"
    },
    // 3. Spacing import
    {
      regex: /from\s*['"]@\/src\/styles\/spacing['"];?/g,
      replacement: "from '@design-system/tokens/spacing';"
    },
    // Dynamic imports
    {
      regex: /import\s*\(\s*['"]@\/src\/hooks\/useAuth['"]\s*\)/g,
      replacement: "import('@lib/hooks/useAuth')"
    },
    {
      regex: /import\s*\(\s*['"]@\/src\/styles\/colors['"]\s*\)/g,
      replacement: "import('@design-system/tokens/colors')"
    },
    {
      regex: /import\s*\(\s*['"]@\/src\/styles\/spacing['"]\s*\)/g,
      replacement: "import('@design-system/tokens/spacing')"
    },
    // Require statements
    {
      regex: /require\s*\(\s*['"]@\/src\/hooks\/useAuth['"]\s*\)/g,
      replacement: "require('@lib/hooks/useAuth')"
    },
    {
      regex: /require\s*\(\s*['"]@\/src\/styles\/colors['"]\s*\)/g,
      replacement: "require('@design-system/tokens/colors')"
    },
    {
      regex: /require\s*\(\s*['"]@\/src\/styles\/spacing['"]\s*\)/g,
      replacement: "require('@design-system/tokens/spacing')"
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
  errors: [],
  fixedByType: {
    useAuth: 0,
    colors: 0,
    spacing: 0
  }
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
 * Fix common imports in a file
 */
function fixCommonImports(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = originalContent;
    let fileModified = false;
    let importsFixedInFile = 0;
    let fixTypes = [];
    
    // Apply each pattern and track what was fixed
    CONFIG.patterns.forEach((pattern, index) => {
      const matches = modifiedContent.match(pattern.regex);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        importsFixedInFile += matches.length;
        fileModified = true;
        
        // Track fix types
        if (pattern.regex.toString().includes('useAuth')) {
          stats.fixedByType.useAuth += matches.length;
          fixTypes.push(`useAuth (${matches.length})`);
        } else if (pattern.regex.toString().includes('colors')) {
          stats.fixedByType.colors += matches.length;
          fixTypes.push(`colors (${matches.length})`);
        } else if (pattern.regex.toString().includes('spacing')) {
          stats.fixedByType.spacing += matches.length;
          fixTypes.push(`spacing (${matches.length})`);
        }
      }
    });
    
    if (fileModified) {
      if (isVerbose) {
        console.log(`📝 ${filePath}: Fixed ${importsFixedInFile} import(s) - ${fixTypes.join(', ')}`);
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
  console.log('🔧 Fixing Common Import Paths...\n');
  console.log('   1. @/src/hooks/useAuth → @lib/hooks/useAuth');
  console.log('   2. @/src/styles/colors → @design-system/tokens/colors');
  console.log('   3. @/src/styles/spacing → @design-system/tokens/spacing\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Get all files to process
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(filePath => {
    fixCommonImports(filePath);
  });
  
  // Print results
  console.log('\n📊 Results:');
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   Total imports fixed: ${stats.importsFixed}`);
  console.log('\n📋 Breakdown by type:');
  console.log(`   useAuth imports: ${stats.fixedByType.useAuth}`);
  console.log(`   colors imports: ${stats.fixedByType.colors}`);
  console.log(`   spacing imports: ${stats.fixedByType.spacing}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n❌ Errors: ${stats.errors.length}`);
    stats.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (stats.importsFixed > 0) {
    console.log('\n✅ Common import paths have been fixed!');
    if (isDryRun) {
      console.log('   Run without --dry-run to apply changes');
    }
  } else {
    console.log('\n✨ No common import issues found!');
  }
}

// Run the script
main();
