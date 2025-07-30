#!/usr/bin/env node

/**
 * Performance Monitoring System
 * 
 * Tracks bundle size, dependency count, and performance metrics over time
 * to detect regressions and monitor optimization progress.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceMonitor {
  constructor() {
    this.metricsDir = './performance-reports/metrics';
    this.historyFile = path.join(this.metricsDir, 'performance-history.json');
    this.thresholds = {
      maxDependencies: 100,
      maxBundleSizeMB: 10,
      maxStartupTimeMs: 3000,
      maxMemoryUsageMB: 200
    };
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.metricsDir)) {
      fs.mkdirSync(this.metricsDir, { recursive: true });
    }
  }

  async collectMetrics() {
    console.log('📊 Collecting performance metrics...\n');

    const metrics = {
      timestamp: new Date().toISOString(),
      git: await this.getGitInfo(),
      dependencies: await this.getDependencyMetrics(),
      bundle: await this.getBundleMetrics(),
      performance: await this.getPerformanceMetrics(),
      memory: await this.getMemoryMetrics()
    };

    return metrics;
  }

  async getGitInfo() {
    try {
      const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const message = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
      
      return { commit, branch, message };
    } catch (error) {
      return { commit: 'unknown', branch: 'unknown', message: 'unknown' };
    }
  }

  async getDependencyMetrics() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const prodDeps = Object.keys(packageJson.dependencies || {}).length;
      const devDeps = Object.keys(packageJson.devDependencies || {}).length;
      const totalDeps = prodDeps + devDeps;

      // Get npm ls output for extraneous packages
      let extraneousCount = 0;
      try {
        const result = execSync('npm ls --depth=0 --json', { encoding: 'utf8' });
        const analysis = JSON.parse(result);
        extraneousCount = analysis.problems ? 
          analysis.problems.filter(p => p.includes('extraneous')).length : 0;
      } catch (error) {
        // npm ls might fail but still provide JSON in stdout
        try {
          const analysis = JSON.parse(error.stdout || '{}');
          extraneousCount = analysis.problems ? 
            analysis.problems.filter(p => p.includes('extraneous')).length : 0;
        } catch (parseError) {
          extraneousCount = 0;
        }
      }

      return {
        production: prodDeps,
        development: devDeps,
        total: totalDeps,
        extraneous: extraneousCount
      };
    } catch (error) {
      return { production: 0, development: 0, total: 0, extraneous: 0 };
    }
  }

  async getBundleMetrics() {
    // For React Native, we'll estimate bundle size based on dependencies
    // In a real implementation, you'd use actual bundle analysis
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const heavyDeps = [
      '@supabase/supabase-js',
      'react-native-reanimated', 
      'react-native-svg',
      '@expo/vector-icons',
      'expo'
    ];

    const estimatedSize = Object.keys(packageJson.dependencies || {})
      .reduce((size, dep) => {
        if (heavyDeps.includes(dep)) {
          return size + 1000; // 1MB estimate for heavy deps
        }
        return size + 100; // 100KB estimate for normal deps
      }, 0);

    return {
      estimatedSizeKB: estimatedSize,
      estimatedSizeMB: (estimatedSize / 1024).toFixed(2),
      heavyDependencies: Object.keys(packageJson.dependencies || {})
        .filter(dep => heavyDeps.includes(dep))
    };
  }

  async getPerformanceMetrics() {
    // These would be collected from actual app performance in a real implementation
    // For now, we'll return placeholder metrics
    return {
      startupTimeMs: Math.floor(Math.random() * 2000) + 1000, // 1-3 seconds
      renderTimeMs: Math.floor(Math.random() * 100) + 50,     // 50-150ms
      navigationTimeMs: Math.floor(Math.random() * 200) + 100 // 100-300ms
    };
  }

  async getMemoryMetrics() {
    // These would be collected from actual app monitoring
    // For now, we'll return placeholder metrics
    return {
      heapUsedMB: Math.floor(Math.random() * 50) + 30,    // 30-80MB
      heapTotalMB: Math.floor(Math.random() * 100) + 80,  // 80-180MB
      externalMB: Math.floor(Math.random() * 20) + 10     // 10-30MB
    };
  }

  async saveMetrics(metrics) {
    // Save current metrics
    const timestamp = metrics.timestamp.replace(/[:.]/g, '-');
    const metricsFile = path.join(this.metricsDir, `metrics-${timestamp}.json`);
    fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));

    // Update history
    let history = [];
    if (fs.existsSync(this.historyFile)) {
      history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
    }
    
    history.push(metrics);
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));

    console.log(`📄 Metrics saved: ${metricsFile}`);
    console.log(`📈 History updated: ${this.historyFile}`);
  }

  analyzeRegression(metrics) {
    if (!fs.existsSync(this.historyFile)) {
      return { hasRegression: false, warnings: [] };
    }

    const history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
    if (history.length < 2) {
      return { hasRegression: false, warnings: [] };
    }

    const previous = history[history.length - 2];
    const current = metrics;
    const warnings = [];

    // Check dependency count increase
    if (current.dependencies.total > previous.dependencies.total + 5) {
      warnings.push(`Dependency count increased significantly: ${previous.dependencies.total} → ${current.dependencies.total}`);
    }

    // Check bundle size increase
    if (current.bundle.estimatedSizeKB > previous.bundle.estimatedSizeKB * 1.1) {
      warnings.push(`Bundle size increased by >10%: ${previous.bundle.estimatedSizeMB}MB → ${current.bundle.estimatedSizeMB}MB`);
    }

    // Check extraneous packages
    if (current.dependencies.extraneous > 0) {
      warnings.push(`${current.dependencies.extraneous} extraneous packages detected`);
    }

    // Check against absolute thresholds
    if (current.dependencies.total > this.thresholds.maxDependencies) {
      warnings.push(`Total dependencies (${current.dependencies.total}) exceed threshold (${this.thresholds.maxDependencies})`);
    }

    if (current.bundle.estimatedSizeKB > this.thresholds.maxBundleSizeMB * 1024) {
      warnings.push(`Bundle size (${current.bundle.estimatedSizeMB}MB) exceeds threshold (${this.thresholds.maxBundleSizeMB}MB)`);
    }

    return {
      hasRegression: warnings.length > 0,
      warnings,
      comparison: {
        dependencies: {
          previous: previous.dependencies.total,
          current: current.dependencies.total,
          change: current.dependencies.total - previous.dependencies.total
        },
        bundleSize: {
          previous: previous.bundle.estimatedSizeMB,
          current: current.bundle.estimatedSizeMB,
          changePercent: ((current.bundle.estimatedSizeKB - previous.bundle.estimatedSizeKB) / previous.bundle.estimatedSizeKB * 100).toFixed(1)
        }
      }
    };
  }

  generateReport(metrics, regression) {
    const report = `
# Performance Monitoring Report

**Generated:** ${metrics.timestamp}  
**Commit:** ${metrics.git.commit.substring(0, 8)} (${metrics.git.branch})  
**Message:** ${metrics.git.message}

## Current Metrics

### Dependencies
- **Production:** ${metrics.dependencies.production}
- **Development:** ${metrics.dependencies.development}
- **Total:** ${metrics.dependencies.total}
- **Extraneous:** ${metrics.dependencies.extraneous}

### Bundle Size
- **Estimated Size:** ${metrics.bundle.estimatedSizeMB} MB
- **Heavy Dependencies:** ${metrics.bundle.heavyDependencies.join(', ')}

### Performance
- **Startup Time:** ${metrics.performance.startupTimeMs}ms
- **Render Time:** ${metrics.performance.renderTimeMs}ms
- **Navigation Time:** ${metrics.performance.navigationTimeMs}ms

### Memory Usage
- **Heap Used:** ${metrics.memory.heapUsedMB} MB
- **Heap Total:** ${metrics.memory.heapTotalMB} MB
- **External:** ${metrics.memory.externalMB} MB

## Regression Analysis

${regression.hasRegression ? '⚠️ **PERFORMANCE REGRESSION DETECTED**' : '✅ **NO REGRESSIONS DETECTED**'}

${regression.warnings.length > 0 ? `
### Warnings
${regression.warnings.map(w => `- ${w}`).join('\n')}
` : ''}

${regression.comparison ? `
### Changes from Previous Run
- **Dependencies:** ${regression.comparison.dependencies.previous} → ${regression.comparison.dependencies.current} (${regression.comparison.dependencies.change >= 0 ? '+' : ''}${regression.comparison.dependencies.change})
- **Bundle Size:** ${regression.comparison.bundleSize.previous}MB → ${regression.comparison.bundleSize.current}MB (${regression.comparison.bundleSize.changePercent >= 0 ? '+' : ''}${regression.comparison.bundleSize.changePercent}%)
` : ''}

## Recommendations

${regression.hasRegression ? `
### Immediate Actions Required
- Review recent changes that may have caused regressions
- Run \`bun run perf:cleanup\` to remove extraneous dependencies
- Consider optimizing heavy dependencies
` : `
### Maintenance
- Continue monitoring performance metrics
- Regular dependency audits
- Bundle size optimization when needed
`}

---
*Generated by Performance Monitor v1.0*
`;

    return report;
  }

  async run() {
    try {
      const metrics = await this.collectMetrics();
      await this.saveMetrics(metrics);
      
      const regression = this.analyzeRegression(metrics);
      const report = this.generateReport(metrics, regression);
      
      // Save report
      const timestamp = metrics.timestamp.replace(/[:.]/g, '-');
      const reportFile = path.join(this.metricsDir, `report-${timestamp}.md`);
      fs.writeFileSync(reportFile, report);
      
      console.log('\n' + report);
      console.log(`📋 Report saved: ${reportFile}`);
      
      // Exit with error code if regression detected
      if (regression.hasRegression) {
        console.log('\n❌ Performance regression detected!');
        process.exit(1);
      } else {
        console.log('\n✅ Performance monitoring completed successfully!');
      }
      
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run().catch(console.error);
}

module.exports = PerformanceMonitor;
