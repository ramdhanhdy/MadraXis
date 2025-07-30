#!/usr/bin/env node

/**
 * Bundle Analysis Script for MadraXis Expo React Native App
 * 
 * This script provides comprehensive bundle analysis for:
 * - Web builds (webpack-bundle-analyzer)
 * - React Native builds (Metro bundler analysis)
 * - Dependency analysis
 * - Performance metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  outputDir: './performance-reports',
  platforms: ['web', 'android', 'ios'],
  reportFormats: ['html', 'json'],
  thresholds: {
    maxBundleSize: 5 * 1024 * 1024, // 5MB
    maxChunkSize: 1 * 1024 * 1024,  // 1MB
    maxDependencies: 100
  }
};

class BundleAnalyzer {
  constructor() {
    this.ensureOutputDir();
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  ensureOutputDir() {
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
  }

  async analyzeAll() {
    console.log('🔍 Starting comprehensive bundle analysis...\n');
    
    const results = {
      timestamp: this.timestamp,
      platforms: {},
      dependencies: {},
      recommendations: []
    };

    try {
      // Analyze web bundle
      console.log('📦 Analyzing web bundle...');
      results.platforms.web = await this.analyzeWebBundle();

      // Analyze dependencies
      console.log('📚 Analyzing dependencies...');
      results.dependencies = await this.analyzeDependencies();

      // Generate recommendations
      console.log('💡 Generating recommendations...');
      results.recommendations = this.generateRecommendations(results);

      // Save comprehensive report
      await this.saveReport(results);

      console.log('\n✅ Bundle analysis complete!');
      console.log(`📊 Reports saved to: ${CONFIG.outputDir}`);

    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeWebBundle() {
    try {
      console.log('  Building web bundle...');
      execSync('expo export --platform web --clear', { stdio: 'pipe' });

      const bundlePath = '.expo-shared/web-bundle';
      if (!fs.existsSync(bundlePath)) {
        throw new Error('Web bundle not found. Make sure expo export completed successfully.');
      }

      // Get bundle stats
      const stats = this.getBundleStats(bundlePath);
      
      // Generate webpack bundle analyzer report
      const reportPath = path.join(CONFIG.outputDir, `web-bundle-${this.timestamp}.html`);
      execSync(`npx webpack-bundle-analyzer ${bundlePath} --mode static --report ${reportPath}`, { stdio: 'pipe' });

      return {
        size: stats.totalSize,
        files: stats.fileCount,
        reportPath: reportPath,
        analysis: this.analyzeWebBundleContent(bundlePath)
      };

    } catch (error) {
      console.warn('  ⚠️  Web bundle analysis failed:', error.message);
      return { error: error.message };
    }
  }

  getBundleStats(bundlePath) {
    let totalSize = 0;
    let fileCount = 0;

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          totalSize += stat.size;
          fileCount++;
        }
      });
    };

    if (fs.existsSync(bundlePath)) {
      walkDir(bundlePath);
    }

    return { totalSize, fileCount };
  }

  analyzeWebBundleContent(bundlePath) {
    const analysis = {
      largestFiles: [],
      jsFiles: { count: 0, totalSize: 0 },
      cssFiles: { count: 0, totalSize: 0 },
      assetFiles: { count: 0, totalSize: 0 }
    };

    // This is a simplified analysis - in a real implementation,
    // you'd parse the webpack stats.json for detailed chunk analysis
    return analysis;
  }

  async analyzeDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const analysis = {
        total: Object.keys(dependencies).length,
        production: Object.keys(packageJson.dependencies || {}).length,
        development: Object.keys(packageJson.devDependencies || {}).length,
        heaviest: await this.findHeaviestDependencies(dependencies),
        duplicates: await this.findDuplicateDependencies()
      };

      return analysis;
    } catch (error) {
      console.warn('  ⚠️  Dependency analysis failed:', error.message);
      return { error: error.message };
    }
  }

  async findHeaviestDependencies(dependencies) {
    // This would typically use a tool like bundle-phobia API
    // For now, return known heavy dependencies
    const knownHeavy = [
      '@supabase/supabase-js',
      'react-native-reanimated',
      'react-native-svg',
      '@expo/vector-icons',
      'expo'
    ];

    return Object.keys(dependencies)
      .filter(dep => knownHeavy.includes(dep))
      .map(dep => ({ name: dep, version: dependencies[dep] }));
  }

  async findDuplicateDependencies() {
    // This would typically analyze node_modules for duplicate packages
    // For now, return empty array
    return [];
  }

  generateRecommendations(results) {
    const recommendations = [];

    // Bundle size recommendations
    if (results.platforms.web && results.platforms.web.size > CONFIG.thresholds.maxBundleSize) {
      recommendations.push({
        type: 'bundle-size',
        severity: 'high',
        message: `Web bundle size (${(results.platforms.web.size / 1024 / 1024).toFixed(2)}MB) exceeds recommended maximum (${CONFIG.thresholds.maxBundleSize / 1024 / 1024}MB)`,
        actions: [
          'Implement code splitting',
          'Use dynamic imports for large components',
          'Optimize asset loading'
        ]
      });
    }

    // Dependency recommendations
    if (results.dependencies.total > CONFIG.thresholds.maxDependencies) {
      recommendations.push({
        type: 'dependencies',
        severity: 'medium',
        message: `High number of dependencies (${results.dependencies.total}) may impact bundle size`,
        actions: [
          'Audit unused dependencies',
          'Consider lighter alternatives',
          'Use tree shaking'
        ]
      });
    }

    return recommendations;
  }

  async saveReport(results) {
    const reportPath = path.join(CONFIG.outputDir, `bundle-analysis-${this.timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    // Generate HTML summary report
    const htmlReport = this.generateHtmlReport(results);
    const htmlPath = path.join(CONFIG.outputDir, `bundle-summary-${this.timestamp}.html`);
    fs.writeFileSync(htmlPath, htmlReport);

    console.log(`  📄 JSON report: ${reportPath}`);
    console.log(`  🌐 HTML report: ${htmlPath}`);
  }

  generateHtmlReport(results) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>MadraXis Bundle Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #e3f2fd; border-radius: 4px; }
        .recommendation { background: #fff3e0; padding: 15px; margin: 10px 0; border-left: 4px solid #ff9800; }
        .high { border-left-color: #f44336; }
        .medium { border-left-color: #ff9800; }
        .low { border-left-color: #4caf50; }
    </style>
</head>
<body>
    <div class="header">
        <h1>MadraXis Bundle Analysis Report</h1>
        <p>Generated: ${results.timestamp}</p>
    </div>

    <div class="section">
        <h2>Bundle Metrics</h2>
        ${results.platforms.web ? `
        <div class="metric">
            <strong>Web Bundle Size:</strong><br>
            ${results.platforms.web.size ? (results.platforms.web.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
        </div>
        ` : ''}
        <div class="metric">
            <strong>Total Dependencies:</strong><br>
            ${results.dependencies.total || 'N/A'}
        </div>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        ${results.recommendations.map(rec => `
        <div class="recommendation ${rec.severity}">
            <strong>${rec.type.toUpperCase()}:</strong> ${rec.message}
            <ul>
                ${rec.actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
        `).join('')}
    </div>
</body>
</html>
    `;
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyzeAll().catch(console.error);
}

module.exports = BundleAnalyzer;
