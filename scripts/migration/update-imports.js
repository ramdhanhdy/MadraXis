#!/usr/bin/env node

/**
 * Migration Import Update Script
 * 
 * Automatically updates import paths during the codebase refactoring process.
 * Supports different migration phases and provides rollback capabilities.
 * 
 * Usage:
 *   node scripts/migration/update-imports.js --phase=ui-components
 *   node scripts/migration/update-imports.js --phase=domains
 *   node scripts/migration/update-imports.js --phase=lib
 *   node scripts/migration/update-imports.js --rollback --phase=ui-components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Migration phase configurations
const MIGRATION_PHASES = {
  'ui-components': {
    name: 'UI Components Migration',
    patterns: [
      {
        from: /from ['"]\.\.\/\.\.\/src\/components\/atoms\/([^'"]+)['"]/g,
        to: "from '@ui/atoms/$1'"
      },
      {
        from: /from ['"]\.\.\/\.\.\/src\/components\/molecules\/([^'"]+)['"]/g,
        to: "from '@ui/molecules/$1'"
      },
      {
        from: /from ['"]\.\.\/\.\.\/src\/components\/organisms\/([^'"]+)['"]/g,
        to: "from '@ui/organisms/$1'"
      },
      {
        from: /from ['"]\.\.\/\.\.\/src\/components\/templates\/([^'"]+)['"]/g,
        to: "from '@ui/templates/$1'"
      },
      {
        from: /from ['"]\.\.\/src\/components\/([^'"]+)['"]/g,
        to: "from '@ui/$1'"
      }
    ],
    directories: ['app/', 'src/']
  },
  'domains': {
    name: 'Domain Migration',
    patterns: [
      {
        from: /from ['"]\.\.\/\.\.\/src\/services\/classService['"]/g,
        to: "from '@domains/class'"
      },
      {
        from: /from ['"]\.\.\/src\/services\/classService['"]/g,
        to: "from '@domains/class'"
      },
      {
        from: /from ['"]\.\.\/\.\.\/src\/services\/([^'"]+)['"]/g,
        to: "from '@domains/$1'"
      },
      {
        from: /from ['"]\.\.\/src\/services\/([^'"]+)['"]/g,
        to: "from '@domains/$1'"
      }
    ],
    directories: ['app/', 'src/']
  },
  'lib': {
    name: 'Library Migration',
    patterns: [
      {
        from: /from ['"]\.\.\/\.\.\/src\/hooks\/([^'"]+)['"]/g,
        to: "from '@lib/hooks/$1'"
      },
      {
        from: /from ['"]\.\.\/src\/hooks\/([^'"]+)['"]/g,
        to: "from '@lib/hooks/$1'"
      },
      {
        from: /from ['"]\.\.\/\.\.\/src\/utils\/([^'"]+)['"]/g,
        to: "from '@lib/utils/$1'"
      },
      {
        from: /from ['"]\.\.\/src\/utils\/([^'"]+)['"]/g,
        to: "from '@lib/utils/$1'"
      }
    ],
    directories: ['app/', 'src/']
  }
};

// Command line argument parsing
const args = process.argv.slice(2);
const phase = args.find(arg => arg.startsWith('--phase='))?.split('=')[1];
const isRollback = args.includes('--rollback');
const isDryRun = args.includes('--dry-run');

if (!phase || !MIGRATION_PHASES[phase]) {
  console.error('❌ Invalid or missing phase. Available phases:');
  Object.keys(MIGRATION_PHASES).forEach(p => {
    console.error(`   - ${p}: ${MIGRATION_PHASES[p].name}`);
  });
  process.exit(1);
}

const config = MIGRATION_PHASES[phase];

/**
 * Get all TypeScript and JavaScript files in a directory
 */
function getSourceFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        traverse(fullPath);
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Update imports in a single file
 */
function updateFileImports(filePath, patterns, isRollback = false) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;
  
  patterns.forEach(pattern => {
    const { from, to } = isRollback ? { from: new RegExp(to.replace(/'/g, "['\"']"), 'g'), to: from.source } : pattern;
    
    if (from.test(updatedContent)) {
      updatedContent = updatedContent.replace(from, to);
      hasChanges = true;
    }
  });
  
  return { content: updatedContent, hasChanges };
}

/**
 * Create backup of files before migration
 */
function createBackup(files) {
  const backupDir = path.join(process.cwd(), '.migration-backup', phase);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  files.forEach(file => {
    const relativePath = path.relative(process.cwd(), file);
    const backupPath = path.join(backupDir, relativePath);
    const backupDirPath = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }
    
    fs.copyFileSync(file, backupPath);
  });
  
  console.log(`📦 Backup created in ${backupDir}`);
}

/**
 * Main migration function
 */
function runMigration() {
  console.log(`🚀 Starting ${isRollback ? 'rollback for' : 'migration of'} ${config.name}...`);
  
  // Collect all files to process
  const allFiles = [];
  config.directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles.push(...getSourceFiles(dir));
    }
  });
  
  console.log(`📁 Found ${allFiles.length} files to process`);
  
  if (!isDryRun && !isRollback) {
    createBackup(allFiles);
  }
  
  let processedFiles = 0;
  let modifiedFiles = 0;
  
  allFiles.forEach(file => {
    const { content, hasChanges } = updateFileImports(file, config.patterns, isRollback);
    
    if (hasChanges) {
      if (isDryRun) {
        console.log(`📝 Would update: ${file}`);
      } else {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
      }
      modifiedFiles++;
    }
    
    processedFiles++;
  });
  
  console.log(`\n📊 Migration Summary:`);
  console.log(`   - Files processed: ${processedFiles}`);
  console.log(`   - Files modified: ${modifiedFiles}`);
  console.log(`   - Phase: ${config.name}`);
  console.log(`   - Mode: ${isDryRun ? 'Dry Run' : isRollback ? 'Rollback' : 'Migration'}`);
  
  if (!isDryRun) {
    console.log(`\n✨ ${config.name} ${isRollback ? 'rollback' : 'migration'} completed successfully!`);
    console.log(`💡 Run validation: node scripts/migration/validate-imports.js`);
  }
}

// Run the migration
try {
  runMigration();
} catch (error) {
  console.error(`❌ Migration failed:`, error.message);
  process.exit(1);
}
