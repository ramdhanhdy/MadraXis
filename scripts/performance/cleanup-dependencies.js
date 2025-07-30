#!/usr/bin/env node

/**
 * Dependency Cleanup Script
 * 
 * Removes extraneous dependencies identified in the bundle analysis
 * to reduce bundle size and improve performance.
 */

const { execSync } = require('child_process');
const fs = require('fs');

// List of extraneous dependencies to remove
const EXTRANEOUS_DEPENDENCIES = [
  // Storybook web-specific packages (not needed for React Native)
  '@storybook/addon-backgrounds',
  '@storybook/addon-highlight', 
  '@storybook/addon-measure',
  '@storybook/addon-outline',
  '@storybook/addon-toolbars',
  '@storybook/blocks',
  '@storybook/builder-vite',
  '@storybook/csf-plugin',
  '@storybook/icons',
  
  // Build tools not needed
  'vite',
  'rollup',
  '@rollup/pluginutils',
  '@rollup/rollup-win32-x64-msvc',
  'webpack-virtual-modules',
  'unplugin',
  
  // Unused type definitions
  '@types/doctrine',
  '@types/mdx', 
  '@types/resolve',
  '@types/uuid',
  
  // Unused utilities
  'doctrine',
  'estree-walker',
  'find-up',
  'locate-path',
  'p-locate',
  'path-exists',
  'magic-string',
  'strip-indent',
  'unicorn-magic',
  'yallist',
  'signal-exit',
  'ansi-styles',
  'cosmiconfig',
  
  // Development tools that shouldn't be in production
  'react-docgen',
  'react-docgen-typescript',
  '@joshwooding/vite-plugin-react-docgen-typescript',
  '@mdx-js/react',
  'axe-core',
  'postcss',
  'resolve',
  'tsconfig-paths',
  
  // Hermes tools (should be handled by Expo)
  'hermes-estree',
  'hermes-parser',
  'jest-worker',
  
  // Animation library that might not be needed
  'rive-react-native'
];

class DependencyCleanup {
  constructor() {
    this.backupFile = './performance-reports/package-backup.json';
    this.logFile = './performance-reports/cleanup-log.txt';
  }

  async cleanup() {
    console.log('🧹 Starting dependency cleanup...\n');
    
    try {
      // Create backup
      await this.createBackup();
      
      // Analyze current state
      const beforeAnalysis = await this.analyzeDependencies();
      console.log(`📊 Before cleanup: ${beforeAnalysis.total} total dependencies\n`);
      
      // Remove extraneous dependencies
      await this.removeExtraneousDependencies();
      
      // Analyze after cleanup
      const afterAnalysis = await this.analyzeDependencies();
      console.log(`📊 After cleanup: ${afterAnalysis.total} total dependencies`);
      console.log(`✅ Removed ${beforeAnalysis.total - afterAnalysis.total} dependencies\n`);
      
      // Generate report
      await this.generateCleanupReport(beforeAnalysis, afterAnalysis);
      
      console.log('🎉 Dependency cleanup completed successfully!');
      console.log(`📄 Backup saved to: ${this.backupFile}`);
      console.log(`📋 Report saved to: ${this.logFile}`);
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      console.log('🔄 Restoring from backup...');
      await this.restoreBackup();
      process.exit(1);
    }
  }

  async createBackup() {
    console.log('💾 Creating package.json backup...');
    const packageJson = fs.readFileSync('package.json', 'utf8');
    fs.writeFileSync(this.backupFile, packageJson);
    console.log('✅ Backup created\n');
  }

  async restoreBackup() {
    if (fs.existsSync(this.backupFile)) {
      const backup = fs.readFileSync(this.backupFile, 'utf8');
      fs.writeFileSync('package.json', backup);
      console.log('✅ Package.json restored from backup');
    }
  }

  async analyzeDependencies() {
    try {
      const result = execSync('npm ls --depth=0 --json', { encoding: 'utf8' });
      const analysis = JSON.parse(result);
      
      return {
        total: Object.keys(analysis.dependencies || {}).length,
        extraneous: analysis.problems ? analysis.problems.filter(p => p.includes('extraneous')).length : 0,
        dependencies: analysis.dependencies || {}
      };
    } catch (error) {
      // npm ls returns non-zero exit code when there are issues, but still provides JSON
      const output = error.stdout || error.message;
      try {
        const analysis = JSON.parse(output);
        return {
          total: Object.keys(analysis.dependencies || {}).length,
          extraneous: analysis.problems ? analysis.problems.filter(p => p.includes('extraneous')).length : 0,
          dependencies: analysis.dependencies || {}
        };
      } catch (parseError) {
        return { total: 0, extraneous: 0, dependencies: {} };
      }
    }
  }

  async removeExtraneousDependencies() {
    console.log('🗑️  Removing extraneous dependencies...\n');
    
    const removedDeps = [];
    const failedDeps = [];
    
    for (const dep of EXTRANEOUS_DEPENDENCIES) {
      try {
        console.log(`  Removing ${dep}...`);
        execSync(`bun remove ${dep}`, { stdio: 'pipe' });
        removedDeps.push(dep);
        console.log(`  ✅ ${dep} removed`);
      } catch (error) {
        console.log(`  ⚠️  ${dep} not found or failed to remove`);
        failedDeps.push(dep);
      }
    }
    
    console.log(`\n📊 Removal summary:`);
    console.log(`  ✅ Successfully removed: ${removedDeps.length}`);
    console.log(`  ⚠️  Failed/Not found: ${failedDeps.length}\n`);
    
    return { removed: removedDeps, failed: failedDeps };
  }

  async generateCleanupReport(before, after) {
    const report = `
# Dependency Cleanup Report

**Date:** ${new Date().toISOString()}
**Script:** cleanup-dependencies.js

## Summary

- **Before:** ${before.total} total dependencies (${before.extraneous} extraneous)
- **After:** ${after.total} total dependencies (${after.extraneous} extraneous)
- **Removed:** ${before.total - after.total} dependencies
- **Space Saved:** Estimated ~${((before.total - after.total) * 50).toFixed(0)}KB

## Dependencies Removed

${EXTRANEOUS_DEPENDENCIES.map(dep => `- ${dep}`).join('\n')}

## Recommendations

1. Run \`bun install\` to ensure lock file is updated
2. Test the application to ensure no functionality is broken
3. Run bundle analysis to measure actual size reduction
4. Consider setting up dependency monitoring to prevent future bloat

## Next Steps

1. \`bun install\` - Update lock file
2. \`bun run test\` - Verify functionality
3. \`bun run analyze:bundle\` - Measure improvements
4. Commit changes with message: "perf: remove extraneous dependencies"
`;

    fs.writeFileSync(this.logFile, report);
  }
}

// CLI interface
if (require.main === module) {
  const cleanup = new DependencyCleanup();
  cleanup.cleanup().catch(console.error);
}

module.exports = DependencyCleanup;
