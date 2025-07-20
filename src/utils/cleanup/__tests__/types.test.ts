import {
  UnusedItem,
  CleanupReport,
  AnalysisConfig,
  DependencyNode,
  ProjectGraph,
  PackageDependency,
  CleanupResult,
} from '../types';
import { DEFAULT_ANALYSIS_CONFIG, getProjectConfig, validateConfig } from '../config';

describe('Cleanup Types', () => {
  it('should create a valid UnusedItem', () => {
    const unusedItem: UnusedItem = {
      path: 'src/unused-file.ts',
      type: 'file',
      reason: 'No imports found',
      riskLevel: 'low',
      usageContext: [],
      sizeImpact: 150,
    };

    expect(unusedItem.path).toBe('src/unused-file.ts');
    expect(unusedItem.type).toBe('file');
    expect(unusedItem.riskLevel).toBe('low');
  });

  it('should create a valid CleanupReport', () => {
    const report: CleanupReport = {
      removed: [],
      flaggedForReview: [],
      errors: [],
      summary: {
        filesRemoved: 0,
        dependenciesRemoved: 0,
        exportsRemoved: 0,
        linesOfCodeReduced: 0,
        fileSizeReduced: 0,
      },
      timestamp: new Date(),
      config: DEFAULT_ANALYSIS_CONFIG,
    };

    expect(report.removed).toEqual([]);
    expect(report.summary.filesRemoved).toBe(0);
    expect(report.config).toBeDefined();
  });

  it('should create a valid DependencyNode', () => {
    const node: DependencyNode = {
      filePath: '/src/components/Button.tsx',
      imports: ['react'],
      exports: ['Button'],
      dependents: ['/src/components/Form.tsx'],
      dependencies: ['react'],
      isEntryPoint: false,
      fileType: 'component',
      hasDynamicImports: false,
    };

    expect(node.fileType).toBe('component');
    expect(node.isEntryPoint).toBe(false);
  });

  it('should create a valid ProjectGraph', () => {
    const graph: ProjectGraph = {
      nodes: new Map(),
      entryPoints: ['app/index.tsx'],
      orphanedFiles: [],
      unparsedFiles: [],
    };

    expect(graph.nodes.size).toBe(0);
    expect(graph.entryPoints).toContain('app/index.tsx');
  });
});

describe('Cleanup Config', () => {
  it('should have valid default configuration', () => {
    expect(DEFAULT_ANALYSIS_CONFIG.excludePatterns).toContain('node_modules/**');
    expect(DEFAULT_ANALYSIS_CONFIG.safetyChecks).toBe(true);
    expect(DEFAULT_ANALYSIS_CONFIG.dryRun).toBe(true);
    expect(DEFAULT_ANALYSIS_CONFIG.autoRemoveRiskThreshold).toBe('low');
  });

  it('should get React Native project configuration', () => {
    const config = getProjectConfig('react-native');
    
    expect(config.entryPointPatterns).toContain('app/index.tsx');
    expect(config.excludePatterns).toContain('.expo/**');
  });

  it('should validate and normalize configuration', () => {
    const partialConfig: Partial<AnalysisConfig> = {
      dryRun: false,
      safetyChecks: false,
    };

    const validatedConfig = validateConfig(partialConfig);
    
    expect(validatedConfig.dryRun).toBe(false);
    expect(validatedConfig.safetyChecks).toBe(false);
    expect(validatedConfig.excludePatterns.length).toBeGreaterThan(0);
    expect(validatedConfig.entryPointPatterns.length).toBeGreaterThan(0);
  });
});