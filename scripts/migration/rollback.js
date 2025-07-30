#!/usr/bin/env node

/**
 * Migration Rollback Script
 * 
 * Provides rollback capabilities for migration phases.
 * Can rollback to specific phases or checkpoints.
 * 
 * Usage:
 *   node scripts/migration/rollback.js --to-phase=2
 *   node scripts/migration/rollback.js --to-checkpoint=ui-components
 *   node scripts/migration/rollback.js --list-backups
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Migration phases for rollback reference
const MIGRATION_PHASES = {
  1: 'Infrastructure Setup',
  2: 'Parallel Structure Creation',
  3: 'UI Components Migration',
  4: 'Domain Migration',
  5: 'Feature Slice Migration',
  6: 'Cleanup and Validation'
};

const CHECKPOINTS = {
  'infrastructure': 1,
  'parallel-structure': 2,
  'ui-components': 3,
  'domains': 4,
  'feature-slices': 5,
  'cleanup': 6
};

// Command line arguments
const args = process.argv.slice(2);
const toPhase = args.find(arg => arg.startsWith('--to-phase='))?.split('=')[1];
const toCheckpoint = args.find(arg => arg.startsWith('--to-checkpoint='))?.split('=')[1];
const listBackups = args.includes('--list-backups');
const force = args.includes('--force');

const backupBaseDir = path.join(process.cwd(), '.migration-backup');

/**
 * List available backups
 */
function listAvailableBackups() {
  console.log('📦 Available Migration Backups:\n');
  
  if (!fs.existsSync(backupBaseDir)) {
    console.log('   No backups found. Run a migration first to create backups.\n');
    return;
  }
  
  const backups = fs.readdirSync(backupBaseDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  
  if (backups.length === 0) {
    console.log('   No backups found.\n');
    return;
  }
  
  backups.forEach(backup => {
    const backupPath = path.join(backupBaseDir, backup);
    const stats = fs.statSync(backupPath);
    console.log(`   📁 ${backup}`);
    console.log(`      Created: ${stats.birthtime.toLocaleString()}`);
    console.log(`      Modified: ${stats.mtime.toLocaleString()}\n`);
  });
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Restore files from backup
 */
function restoreFromBackup(backupName) {
  const backupPath = path.join(backupBaseDir, backupName);
  
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup '${backupName}' not found`);
  }
  
  console.log(`📦 Restoring from backup: ${backupName}`);
  
  const backupFiles = getAllFiles(backupPath);
  let restoredCount = 0;
  
  backupFiles.forEach(backupFile => {
    const relativePath = path.relative(backupPath, backupFile);
    const targetPath = path.join(process.cwd(), relativePath);
    const targetDir = path.dirname(targetPath);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy file from backup to target location
    fs.copyFileSync(backupFile, targetPath);
    restoredCount++;
  });
  
  console.log(`✅ Restored ${restoredCount} files from backup`);
}

/**
 * Remove directories created during migration
 */
function cleanupMigrationDirectories(phase) {
  const directoriesToCleanup = [];
  
  if (phase >= 3) {
    directoriesToCleanup.push('src/ui');
  }
  
  if (phase >= 4) {
    directoriesToCleanup.push('src/domains');
  }
  
  if (phase >= 3) {
    directoriesToCleanup.push('src/lib');
  }
  
  directoriesToCleanup.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      console.log(`🗑️  Removing migration directory: ${dir}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  });
}

/**
 * Rollback tsconfig.json changes
 */
function rollbackTsConfig() {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    return;
  }
  
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  // Remove migration path aliases
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    const pathsToRemove = ['@ui/*', '@domains/*', '@lib/*', '@context/*', '@types/*'];
    
    pathsToRemove.forEach(pathAlias => {
      if (tsconfig.compilerOptions.paths[pathAlias]) {
        delete tsconfig.compilerOptions.paths[pathAlias];
        console.log(`🔧 Removed path alias: ${pathAlias}`);
      }
    });
    
    // If paths object is empty, remove it
    if (Object.keys(tsconfig.compilerOptions.paths).length === 0) {
      delete tsconfig.compilerOptions.paths;
    }
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }
}

/**
 * Run import rollback for specific phases
 */
function rollbackImports(phase) {
  const phasesToRollback = [];
  
  if (phase >= 3) {
    phasesToRollback.push('ui-components');
  }
  
  if (phase >= 4) {
    phasesToRollback.push('domains');
  }
  
  if (phase >= 3) {
    phasesToRollback.push('lib');
  }
  
  phasesToRollback.forEach(phaseToRollback => {
    try {
      console.log(`🔄 Rolling back imports for phase: ${phaseToRollback}`);
      execSync(`node scripts/migration/update-imports.js --phase=${phaseToRollback} --rollback`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`⚠️  Warning: Could not rollback imports for ${phaseToRollback}`);
    }
  });
}

/**
 * Main rollback function
 */
function performRollback() {
  let targetPhase;
  
  if (toCheckpoint) {
    if (!CHECKPOINTS[toCheckpoint]) {
      console.error(`❌ Invalid checkpoint: ${toCheckpoint}`);
      console.error('Available checkpoints:', Object.keys(CHECKPOINTS).join(', '));
      process.exit(1);
    }
    targetPhase = CHECKPOINTS[toCheckpoint];
  } else if (toPhase) {
    targetPhase = parseInt(toPhase);
    if (!MIGRATION_PHASES[targetPhase]) {
      console.error(`❌ Invalid phase: ${toPhase}`);
      console.error('Available phases:', Object.keys(MIGRATION_PHASES).join(', '));
      process.exit(1);
    }
  } else {
    console.error('❌ Must specify --to-phase or --to-checkpoint');
    process.exit(1);
  }
  
  console.log(`🔄 Rolling back to Phase ${targetPhase}: ${MIGRATION_PHASES[targetPhase]}`);
  
  if (!force) {
    console.log('\n⚠️  This will:');
    console.log('   - Restore files from backup');
    console.log('   - Remove migration directories');
    console.log('   - Rollback configuration changes');
    console.log('   - Rollback import statements');
    console.log('\n❓ Continue? Add --force to skip this confirmation.');
    process.exit(0);
  }
  
  try {
    // Step 1: Rollback imports
    rollbackImports(targetPhase + 1);
    
    // Step 2: Clean up migration directories
    cleanupMigrationDirectories(targetPhase + 1);
    
    // Step 3: Rollback configuration
    if (targetPhase < 1) {
      rollbackTsConfig();
    }
    
    // Step 4: Restore from backups if available
    const availableBackups = fs.existsSync(backupBaseDir) 
      ? fs.readdirSync(backupBaseDir, { withFileTypes: true })
          .filter(entry => entry.isDirectory())
          .map(entry => entry.name)
      : [];
    
    if (availableBackups.length > 0) {
      // Use the most recent backup
      const latestBackup = availableBackups.sort().pop();
      restoreFromBackup(latestBackup);
    }
    
    console.log(`\n✅ Rollback to Phase ${targetPhase} completed successfully!`);
    console.log('💡 Run tests to verify everything is working correctly.');
    
  } catch (error) {
    console.error(`❌ Rollback failed:`, error.message);
    process.exit(1);
  }
}

// Main execution
if (listBackups) {
  listAvailableBackups();
} else {
  performRollback();
}
