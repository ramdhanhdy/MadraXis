#!/usr/bin/env node

/**
 * Schools to Management Migration Script
 *
 * This script systematically migrates the entire codebase from "School" terminology
 * to "Management" terminology, including:
 * 1. Import paths: @domains/schools → @domains/management
 * 2. Type names: School → Management, SchoolService → ManagementService, etc.
 * 3. Variable names: school → management, schools → managements
 * 4. Comments and documentation
 *
 * Usage:
 *   node scripts/fix-schools-to-management.js --dry-run  # Preview changes
 *   node scripts/fix-schools-to-management.js            # Apply changes
 *   node scripts/fix-schools-to-management.js --verbose  # Detailed output
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Directories to scan
  directories: ['src/', 'app/'],
  
  // File extensions to process
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Import path replacement patterns only
  patterns: [
    // @domains/schools → @domains/management
    {
      regex: /from\s*['"]@domains\/schools['"];?/g,
      replacement: "from '@domains/management';"
    },
    // Dynamic imports
    {
      regex: /import\s*\(\s*['"]@domains\/schools['"]\s*\)/g,
      replacement: "import('@domains/management')"
    },
    // Require statements
    {
      regex: /require\s*\(\s*['"]@domains\/schools['"]\s*\)/g,
      replacement: "require('@domains/management')"
    },
    // Relative path imports to schools domain
    {
      regex: /from\s*['"]\.\.\/\.\.\/\.\.\/domains\/schools['"];?/g,
      replacement: "from '../../../domains/management';"
    },
    {
      regex: /from\s*['"]\.\.\/\.\.\/domains\/schools['"];?/g,
      replacement: "from '../../domains/management';"
    },
    {
      regex: /from\s*['"]\.\.\/domains\/schools['"];?/g,
      replacement: "from '../domains/management';"
    },
    {
      regex: /from\s*['"]\.\/domains\/schools['"];?/g,
      replacement: "from './domains/management';"
    },
    // Absolute path imports
    {
      regex: /from\s*['"]src\/domains\/schools['"];?/g,
      replacement: "from 'src/domains/management';"
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
  replacementsMade: 0,
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
 * Fix schools domain references in a file
 */
function fixSchoolsReferences(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = originalContent;
    let fileModified = false;
    let replacementsInFile = 0;
    
    // Apply each pattern
    CONFIG.patterns.forEach(pattern => {
      const matches = modifiedContent.match(pattern.regex);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        replacementsInFile += matches.length;
        fileModified = true;
      }
    });
    
    if (fileModified) {
      if (isVerbose) {
        console.log(`📝 ${filePath}: Made ${replacementsInFile} replacement(s)`);
      }
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
      
      stats.filesModified++;
      stats.replacementsMade += replacementsInFile;
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
  console.log('🔄 Fixing Import Paths: @domains/schools → @domains/management...\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Get all files to process
  const files = getAllFiles();
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(filePath => {
    fixSchoolsReferences(filePath);
  });
  
  // Print results
  console.log('\n📊 Results:');
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   Replacements made: ${stats.replacementsMade}`);
  
  if (stats.errors.length > 0) {
    console.log(`   Errors: ${stats.errors.length}`);
    console.log('\n❌ Errors encountered:');
    stats.errors.forEach(error => console.log(`   ${error}`));
  }
  
  if (stats.replacementsMade > 0) {
    console.log('\n✅ Import path migration completed!');
    if (isDryRun) {
      console.log('   Run without --dry-run to apply changes');
    }
  } else {
    console.log('\n✨ No @domains/schools import paths found!');
  }
}

// Run the script
main();
