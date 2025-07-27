#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');

/**
 * Automated Fix Script for Console Logging Security Issues
 * Attempts to automatically replace console statements with secure logger
 * Optimized for Bun runtime
 */

class LoggingSecurityFixer {
  constructor() {
    this.fixedFiles = new Set();
    this.backupDir = path.join(process.cwd(), '.security-backups', Date.now().toString());
  }

  async createBackup(filePath) {
    const backupPath = path.join(this.backupDir, filePath);
    const backupDirPath = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }
    
    const sourceFile = Bun.file(filePath);
    const content = await sourceFile.text();
    await Bun.write(backupPath, content);
  }

  async fixFile(filePath) {
    try {
      await this.createBackup(filePath);
      
      const file = Bun.file(filePath);
      let content = await file.text();
      let modified = false;
      
      // Add logger import if not present
      if (!content.includes("import { logger }") && !content.includes("from '../../utils/logger'")) {
        const importPath = this.getLoggerImportPath(filePath);
        content = `import { logger } from '${importPath}';\n${content}`;
        modified = true;
      }
      
      // Replace console statements
      const replacements = [
        { from: /console\.log\(/g, to: 'logger.debug(' },
        { from: /console\.info\(/g, to: 'logger.info(' },
        { from: /console\.warn\(/g, to: 'logger.warn(' },
        { from: /console\.error\(/g, to: 'logger.error(' },
        { from: /console\.debug\(/g, to: 'logger.debug(' }
      ];
      
      replacements.forEach(({ from, to }) => {
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      });
      
      if (modified) {
        await Bun.write(filePath, content);
        this.fixedFiles.add(filePath);
        console.log(`✅ Fixed: ${filePath}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to fix ${filePath}: ${error.message}`);
    }
  }

  getLoggerImportPath(filePath) {
    const depth = filePath.split('/').length - 2; // Subtract 2 for src and filename
    return '../'.repeat(depth) + 'utils/logger';
  }

  async run() {
    console.log('🔧 Starting automated logging security fixes...\n');
    
    // First, run audit to find issues
    const { default: LoggingSecurityAuditor } = await import('./audit-logging.js');
    const auditor = new LoggingSecurityAuditor();
    await auditor.run();
    const report = auditor.generateReport();
    
    if (report.findings.length === 0) {
      console.log('✅ No issues to fix!');
      return;
    }
    
    console.log(`\n🔧 Attempting to fix ${report.findings.length} issues...\n`);
    
    // Group findings by file
    const fileFindings = {};
    report.findings.forEach(finding => {
      if (!fileFindings[finding.file]) {
        fileFindings[finding.file] = [];
      }
      fileFindings[finding.file].push(finding);
    });
    
    // Fix each file
    for (const filePath of Object.keys(fileFindings)) {
      await this.fixFile(filePath);
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Files fixed: ${this.fixedFiles.size}`);
    console.log(`Backup location: ${this.backupDir}`);
    
    if (this.fixedFiles.size > 0) {
      console.log('\n⚠️  IMPORTANT: Review the changes and test your application!');
      console.log('   Run the audit script again to verify fixes.');
    }
  }
}

// Run the fixer
if (import.meta.main) {
  const fixer = new LoggingSecurityFixer();
  await fixer.run();
}

export default LoggingSecurityFixer;

