#!/usr/bin/env node

/**
 * Design System Component Inventory Script
 * 
 * Analyzes all components and creates migration priority lists.
 * Generates detailed reports for migration planning.
 * 
 * Usage:
 *   node scripts/design-system/inventory.js
 *   node scripts/design-system/inventory.js --dir=src/ui/atoms
 *   node scripts/design-system/inventory.js --report --output=migration-report.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  directories: {
    ui: 'src/ui',
    app: 'app',
    backup: '.migration-backups'
  },
  patterns: {
    designSystemImport: /@design-system/g,
    uiComponentImport: /@ui\//g,
    oldThemeImport: /from ['"].*ThemeContext['"]/g,
    stylesheetCreate: /StyleSheet\.create\s*\(/g,
    hardcodedColors: /['"]#[0-9a-fA-F]{3,6}['"]/g,
  },
  extensions: ['.tsx', '.ts', '.jsx', '.js']
};

class ComponentInventory {
  constructor() {
    this.components = [];
    this.summary = {
      totalComponents: 0,
      alreadyMigrated: 0,
      needsMigration: 0,
      complexMigration: 0
    };
  }

  /**
   * Scan directory for components
   */
  scanDirectory(dirPath) {
    console.log(`📁 Scanning directory: ${dirPath}`);
    
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Directory not found: ${dirPath}`);
      return;
    }

    const files = this.getAllFiles(dirPath);
    
    for (const filePath of files) {
      if (this.isComponentFile(filePath)) {
        const component = this.analyzeComponent(filePath);
        if (component) {
          this.components.push(component);
        }
      }
    }
  }

  /**
   * Get all files recursively
   */
  getAllFiles(dirPath) {
    const files = [];
    
    const scanDir = (currentPath) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and other irrelevant directories
          if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
            scanDir(fullPath);
          }
        } else {
          files.push(fullPath);
        }
      }
    };
    
    scanDir(dirPath);
    return files;
  }

  /**
   * Check if file is a component file
   */
  isComponentFile(filePath) {
    const ext = path.extname(filePath);
    if (!CONFIG.extensions.includes(ext)) return false;
    
    // Skip test files, story files, and index files
    const basename = path.basename(filePath);
    if (basename.includes('.test.') || 
        basename.includes('.spec.') || 
        basename.includes('.stories.') ||
        basename === 'index.ts' ||
        basename === 'index.tsx') {
      return false;
    }
    
    return true;
  }

  /**
   * Analyze individual component
   */
  analyzeComponent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      const analysis = {
        name: this.getComponentName(filePath),
        path: relativePath,
        size: content.length,
        lines: content.split('\n').length,
        imports: this.analyzeImports(content),
        patterns: this.analyzePatterns(content),
        complexity: 'simple',
        priority: 'medium',
        status: 'needs-migration',
        migrationEffort: 1
      };
      
      // Determine migration status
      analysis.status = this.determineMigrationStatus(analysis);
      
      // Calculate complexity and priority
      analysis.complexity = this.calculateComplexity(analysis);
      analysis.priority = this.calculatePriority(analysis);
      analysis.migrationEffort = this.estimateMigrationEffort(analysis);
      
      return analysis;
      
    } catch (error) {
      console.error(`❌ Error analyzing ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Get component name from file path
   */
  getComponentName(filePath) {
    const basename = path.basename(filePath, path.extname(filePath));
    return basename;
  }

  /**
   * Analyze import statements
   */
  analyzeImports(content) {
    const imports = {
      designSystem: (content.match(CONFIG.patterns.designSystemImport) || []).length,
      uiComponents: (content.match(CONFIG.patterns.uiComponentImport) || []).length,
      oldTheme: (content.match(CONFIG.patterns.oldThemeImport) || []).length,
      reactNative: content.includes("from 'react-native'"),
      styleSheet: content.includes('StyleSheet')
    };
    
    return imports;
  }

  /**
   * Analyze styling patterns
   */
  analyzePatterns(content) {
    const patterns = {
      stylesheetCreate: (content.match(CONFIG.patterns.stylesheetCreate) || []).length,
      hardcodedColors: (content.match(CONFIG.patterns.hardcodedColors) || []).length,
      oldThemeUsage: (content.match(CONFIG.patterns.oldThemeImport) || []).length,
      inlineStyles: (content.match(/style=\{\{/g) || []).length
    };
    
    return patterns;
  }

  /**
   * Determine migration status
   */
  determineMigrationStatus(analysis) {
    // Already migrated if using design system imports and no legacy patterns
    if (analysis.imports.designSystem > 0 && 
        analysis.patterns.stylesheetCreate === 0 &&
        analysis.patterns.oldThemeUsage === 0 &&
        analysis.patterns.hardcodedColors === 0) {
      return 'migrated';
    }
    
    // Partially migrated if some design system usage
    if (analysis.imports.designSystem > 0 || analysis.imports.uiComponents > 0) {
      return 'partial';
    }
    
    return 'needs-migration';
  }

  /**
   * Calculate migration complexity
   */
  calculateComplexity(analysis) {
    let complexityScore = 0;
    
    // File size and lines contribute to complexity
    if (analysis.lines > 200) complexityScore += 2;
    else if (analysis.lines > 100) complexityScore += 1;
    
    // Styling patterns contribute to complexity
    complexityScore += analysis.patterns.stylesheetCreate;
    complexityScore += analysis.patterns.hardcodedColors * 0.5;
    complexityScore += analysis.patterns.inlineStyles * 0.3;
    
    // Old theme usage adds complexity
    if (analysis.patterns.oldThemeUsage > 0) complexityScore += 2;
    
    if (complexityScore >= 5) return 'complex';
    if (complexityScore >= 2) return 'moderate';
    return 'simple';
  }

  /**
   * Calculate migration priority
   */
  calculatePriority(analysis) {
    let priorityScore = 0;
    
    // UI components have higher priority
    if (analysis.path.includes('src/ui/')) priorityScore += 3;
    
    // App screens have high priority
    if (analysis.path.includes('app/')) priorityScore += 2;
    
    // Components with many legacy patterns need urgent attention
    priorityScore += analysis.patterns.stylesheetCreate;
    priorityScore += analysis.patterns.hardcodedColors * 0.5;
    
    // Atoms and molecules have higher priority than organisms
    if (analysis.path.includes('/atoms/')) priorityScore += 2;
    if (analysis.path.includes('/molecules/')) priorityScore += 1;
    
    if (priorityScore >= 4) return 'high';
    if (priorityScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Estimate migration effort in story points
   */
  estimateMigrationEffort(analysis) {
    let effort = 1; // Base effort
    
    // Complexity adds effort
    if (analysis.complexity === 'complex') effort += 3;
    else if (analysis.complexity === 'moderate') effort += 1;
    
    // Legacy patterns add effort
    effort += Math.min(analysis.patterns.stylesheetCreate * 0.5, 2);
    effort += Math.min(analysis.patterns.hardcodedColors * 0.2, 1);
    
    // Old theme usage adds significant effort
    if (analysis.patterns.oldThemeUsage > 0) effort += 1;
    
    return Math.ceil(Math.min(effort, 8)); // Cap at 8 SP
  }

  /**
   * Generate summary statistics
   */
  generateSummary() {
    this.summary.totalComponents = this.components.length;
    
    for (const component of this.components) {
      if (component.status === 'migrated') {
        this.summary.alreadyMigrated++;
      } else {
        this.summary.needsMigration++;
        if (component.complexity === 'complex') {
          this.summary.complexMigration++;
        }
      }
    }
    
    this.summary.totalEffort = this.components.reduce((sum, c) => sum + c.migrationEffort, 0);
    this.summary.migrationProgress = Math.round((this.summary.alreadyMigrated / this.summary.totalComponents) * 100);
  }

  /**
   * Generate detailed report
   */
  generateReport() {
    this.generateSummary();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.summary,
      components: this.components.sort((a, b) => {
        // Sort by priority, then by effort
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.migrationEffort - a.migrationEffort;
      }),
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  /**
   * Generate migration recommendations
   */
  generateRecommendations() {
    const highPriority = this.components.filter(c => c.priority === 'high' && c.status !== 'migrated');
    const complexComponents = this.components.filter(c => c.complexity === 'complex' && c.status !== 'migrated');
    
    return {
      startWith: highPriority.slice(0, 5).map(c => c.name),
      reviewCarefully: complexComponents.map(c => c.name),
      quickWins: this.components.filter(c => 
        c.complexity === 'simple' && 
        c.priority === 'high' && 
        c.status !== 'migrated'
      ).map(c => c.name)
    };
  }

  /**
   * Print summary to console
   */
  printSummary() {
    console.log('\n📊 Component Inventory Summary');
    console.log('================================');
    console.log(`Total Components: ${this.summary.totalComponents}`);
    console.log(`Already Migrated: ${this.summary.alreadyMigrated} (${this.summary.migrationProgress}%)`);
    console.log(`Needs Migration: ${this.summary.needsMigration}`);
    console.log(`Complex Migration: ${this.summary.complexMigration}`);
    console.log(`Total Effort: ${this.summary.totalEffort} SP`);
    
    console.log('\n🎯 Priority Breakdown:');
    const priorities = { high: 0, medium: 0, low: 0 };
    this.components.forEach(c => priorities[c.priority]++);
    console.log(`High Priority: ${priorities.high}`);
    console.log(`Medium Priority: ${priorities.medium}`);
    console.log(`Low Priority: ${priorities.low}`);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const inventory = new ComponentInventory();
  
  // Parse command line arguments
  let targetDir = null;
  let generateReport = false;
  let outputFile = null;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--dir=')) {
      targetDir = args[i].split('=')[1];
    } else if (args[i] === '--report') {
      generateReport = true;
    } else if (args[i].startsWith('--output=')) {
      outputFile = args[i].split('=')[1];
    }
  }
  
  // Scan directories
  const dirsToScan = targetDir ? [targetDir] : [CONFIG.directories.ui, CONFIG.directories.app];
  
  for (const dir of dirsToScan) {
    inventory.scanDirectory(dir);
  }
  
  // Generate and display results
  inventory.printSummary();
  
  if (generateReport) {
    const report = inventory.generateReport();
    const filename = outputFile || 'migration-inventory.json';
    
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${filename}`);
  }
  
  console.log('\n✅ Component inventory complete!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ComponentInventory;
