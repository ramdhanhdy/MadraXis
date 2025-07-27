#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');

/**
 * Security Audit Script for Console Logging
 * Scans codebase for potential sensitive data leaks through console statements
 * Optimized for Bun runtime
 */

const SENSITIVE_PATTERNS = [
  // Direct console logging patterns
  /console\.(log|error|warn|info|debug)\s*\([^)]*(?:password|token|secret|key|auth|email|phone|address|npsn|userData|formData|response\.data)[^)]*\)/gi,
  
  // Console logging with variables that might contain sensitive data
  /console\.(log|error|warn|info|debug)\s*\(\s*(?:error|err|data|result|user|auth|token|credentials|session)\s*[,)]/gi,
  
  // Console logging entire objects that might contain sensitive data
  /console\.(log|error|warn|info|debug)\s*\(\s*\{[^}]*(?:password|token|secret|email|phone)[^}]*\}/gi,
  
  // Template literals in console statements
  /console\.(log|error|warn|info|debug)\s*\(\s*`[^`]*\$\{[^}]*(?:password|token|secret|user|auth)[^}]*\}[^`]*`/gi
];

const SENSITIVE_KEYWORDS = [
  'password', 'token', 'secret', 'key', 'auth', 'email', 'phone', 
  'address', 'npsn', 'userData', 'formData', 'credentials', 'session'
];

const SCAN_DIRECTORIES = [
  'src/services',
  'src/context',
  'src/utils',
  'src/hooks',
  'src/components'
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.expo/,
  /android/,
  /ios/,
  /scripts\/security/ // Don't scan this script itself
];

class LoggingSecurityAuditor {
  constructor() {
    this.findings = [];
    this.scannedFiles = 0;
  }

  async scanFile(filePath) {
    try {
      const file = Bun.file(filePath);
      const content = await file.text();
      const lines = content.split('\n');
      
      lines.forEach((line, lineNumber) => {
        this.checkLineForIssues(line, filePath, lineNumber + 1);
      });
      
      this.scannedFiles++;
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    }
  }

  checkLineForIssues(line, filePath, lineNumber) {
    // Skip comments and logger usage (our secure logger)
    if (line.trim().startsWith('//') || 
        line.trim().startsWith('*') || 
        line.includes('logger.')) {
      return;
    }

    // Check for console statements
    const consoleMatch = line.match(/console\.(log|error|warn|info|debug)/);
    if (consoleMatch) {
      const severity = this.assessSeverity(line);
      
      this.findings.push({
        file: filePath,
        line: lineNumber,
        content: line.trim(),
        type: 'console_logging',
        severity,
        method: consoleMatch[1],
        recommendation: this.getRecommendation(line, severity)
      });
    }

    // Check for sensitive patterns
    SENSITIVE_PATTERNS.forEach(pattern => {
      if (pattern.test(line)) {
        this.findings.push({
          file: filePath,
          line: lineNumber,
          content: line.trim(),
          type: 'sensitive_logging',
          severity: 'HIGH',
          recommendation: 'Replace with secure logger and sanitize sensitive data'
        });
      }
    });
  }

  assessSeverity(line) {
    const lowerLine = line.toLowerCase();
    
    // High severity: Contains sensitive keywords
    if (SENSITIVE_KEYWORDS.some(keyword => lowerLine.includes(keyword))) {
      return 'HIGH';
    }
    
    // Medium severity: Logs objects or errors that might contain sensitive data
    if (lowerLine.includes('error') || lowerLine.includes('data') || 
        lowerLine.includes('{') || lowerLine.includes('response')) {
      return 'MEDIUM';
    }
    
    // Low severity: General console logging
    return 'LOW';
  }

  getRecommendation(line, severity) {
    switch (severity) {
      case 'HIGH':
        return 'CRITICAL: Replace with logger and sanitize sensitive data immediately';
      case 'MEDIUM':
        return 'Replace with structured logging and sanitize object data';
      case 'LOW':
        return 'Replace with appropriate logger method (debug/info/warn/error)';
      default:
        return 'Review and replace with secure logging';
    }
  }

  async scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Warning: Directory ${dirPath} does not exist`);
      return;
    }

    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      // Skip excluded patterns
      if (EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.shouldScanFile(fullPath)) {
        await this.scanFile(fullPath);
      }
    }
  }

  shouldScanFile(filePath) {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  }

  generateReport() {
    const report = {
      summary: {
        totalFiles: this.scannedFiles,
        totalFindings: this.findings.length,
        highSeverity: this.findings.filter(f => f.severity === 'HIGH').length,
        mediumSeverity: this.findings.filter(f => f.severity === 'MEDIUM').length,
        lowSeverity: this.findings.filter(f => f.severity === 'LOW').length
      },
      findings: this.findings.sort((a, b) => {
        const severityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
    };

    return report;
  }

  async run() {
    console.log('🔍 Starting security audit for console logging...\n');
    
    for (const dir of SCAN_DIRECTORIES) {
      console.log(`Scanning ${dir}...`);
      await this.scanDirectory(dir);
    }
    
    const report = this.generateReport();
    this.printReport(report);
    
    return report.summary.highSeverity === 0 ? 0 : 1; // Exit code
  }

  printReport(report) {
    console.log('\n📊 SECURITY AUDIT REPORT');
    console.log('========================\n');
    
    console.log(`Files scanned: ${report.summary.totalFiles}`);
    console.log(`Total findings: ${report.summary.totalFindings}`);
    console.log(`🔴 High severity: ${report.summary.highSeverity}`);
    console.log(`🟡 Medium severity: ${report.summary.mediumSeverity}`);
    console.log(`🟢 Low severity: ${report.summary.lowSeverity}\n`);
    
    if (report.findings.length === 0) {
      console.log('✅ No console logging security issues found!');
      return;
    }
    
    console.log('DETAILED FINDINGS:');
    console.log('==================\n');
    
    report.findings.forEach((finding, index) => {
      const severityIcon = finding.severity === 'HIGH' ? '🔴' : 
                          finding.severity === 'MEDIUM' ? '🟡' : '🟢';
      
      console.log(`${index + 1}. ${severityIcon} ${finding.severity} - ${finding.file}:${finding.line}`);
      console.log(`   Code: ${finding.content}`);
      console.log(`   Type: ${finding.type}`);
      console.log(`   Fix: ${finding.recommendation}\n`);
    });
    
    if (report.summary.highSeverity > 0) {
      console.log('⚠️  CRITICAL: High severity issues found! Address immediately.');
    }
  }
}

// Run the audit
if (import.meta.main) {
  const auditor = new LoggingSecurityAuditor();
  const exitCode = await auditor.run();
  process.exit(exitCode);
}

export default LoggingSecurityAuditor;

