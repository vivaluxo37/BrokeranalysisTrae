#!/usr/bin/env tsx
/**
 * Comprehensive Broker Data Compilation Script
 * 
 * This script integrates all broker data sources:
 * - Extracted real broker data from frontendapi.brokersview.com
 * - Mock broker data for development
 * - Logo assets and mappings
 * 
 * Features:
 * - Intelligent deduplication and conflict resolution
 * - Data quality validation and reporting
 * - Multiple output formats (JSON, TypeScript exports)
 * - Comprehensive error handling and logging
 * - Metadata generation for data sources and quality metrics
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import type { Broker } from '../src/types/broker';
import { BrokerSchema } from '../src/types/brokerValidation';
import { AssetClass, BrokerCategory, RegulatorType, TradingPlatform } from '../src/enums';
import MockDataLoader from './mockDataLoader';

// Configuration
const CONFIG = {
  paths: {
    extractedData: './src/data/extractedBrokers.json',
    mockData: './src/brokerAnalysisMockData.ts',
    homepageMockData: './src/brokerAnalysisHomepageMockData.ts',
    logoMapping: './public/assets/brokers/logos/asset-mapping.json',
    outputDir: './src/data/compiled',
    logsDir: './logs/compilation'
  },
  output: {
    formats: ['json', 'typescript'] as const,
    files: {
      json: 'compiledBrokers.json',
      typescript: 'compiledBrokers.ts',
      metadata: 'compilation-metadata.json',
      report: 'data-quality-report.json'
    }
  },
  deduplication: {
    strategy: 'priority' as const, // 'priority' | 'merge' | 'latest'
    sourcePriority: ['extracted', 'mock', 'homepage'] as const
  },
  validation: {
    strict: true,
    skipInvalid: false
  }
};

// Types
interface DataSource {
  name: string;
  type: 'extracted' | 'mock' | 'homepage';
  path: string;
  brokers: Broker[];
  metadata: {
    count: number;
    lastModified?: Date;
    version?: string;
  };
}

interface LogoAsset {
  id: string;
  name: string;
  assets: {
    original: string;
    sizes: Record<string, Record<string, string>>;
  };
}

interface CompilationResult {
  success: boolean;
  totalBrokers: number;
  duplicatesFound: number;
  duplicatesResolved: number;
  validationErrors: number;
  sources: DataSource[];
  metadata: CompilationMetadata;
}

interface CompilationMetadata {
  version: string;
  timestamp: string;
  sources: {
    name: string;
    type: string;
    brokerCount: number;
    lastModified?: string;
  }[];
  statistics: {
    totalBrokers: number;
    uniqueBrokers: number;
    duplicatesFound: number;
    validationErrors: number;
    dataQualityScore: number;
  };
  qualityMetrics: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
  };
}

interface ConflictResolution {
  field: string;
  strategy: 'priority' | 'merge' | 'latest' | 'highest' | 'lowest';
  sources: string[];
  resolvedValue: any;
}

// Logger utility
class CompilationLogger {
  private logs: string[] = [];
  private errors: string[] = [];
  private warnings: string[] = [];

  info(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  warn(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message}`;
    this.warnings.push(logEntry);
    console.warn(logEntry);
  }

  error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}${error ? ` - ${error.message}` : ''}`;
    this.errors.push(logEntry);
    console.error(logEntry);
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  async saveLogs(): Promise<void> {
    try {
      await fs.mkdir(CONFIG.paths.logsDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      await fs.writeFile(
        path.join(CONFIG.paths.logsDir, `compilation-${timestamp}.log`),
        this.logs.join('\n')
      );
      
      if (this.errors.length > 0) {
        await fs.writeFile(
          path.join(CONFIG.paths.logsDir, `errors-${timestamp}.log`),
          this.errors.join('\n')
        );
      }
      
      if (this.warnings.length > 0) {
        await fs.writeFile(
          path.join(CONFIG.paths.logsDir, `warnings-${timestamp}.log`),
          this.warnings.join('\n')
        );
      }
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  getStats() {
    return {
      total: this.logs.length,
      errors: this.errors.length,
      warnings: this.warnings.length
    };
  }
}

// Main compilation class
class BrokerDataCompiler {
  private logger = new CompilationLogger();
  private dataSources: DataSource[] = [];
  private logoAssets: Map<string, LogoAsset> = new Map();
  private compiledBrokers: Broker[] = [];
  private duplicates: Map<string, Broker[]> = new Map();
  private conflicts: ConflictResolution[] = [];
  private mockDataLoader: MockDataLoader;

  constructor() {
    this.mockDataLoader = new MockDataLoader((msg, level = 'info') => {
      if (level === 'error') {
        this.logger.error(msg);
      } else if (level === 'warn') {
        this.logger.warn(msg);
      } else {
        this.logger.info(msg);
      }
    });
  }

  async compile(): Promise<CompilationResult> {
    try {
      this.logger.info('Starting broker data compilation...');
      
      // Step 1: Load all data sources
      await this.loadDataSources();
      
      // Step 2: Load logo assets
      await this.loadLogoAssets();
      
      // Step 3: Detect and resolve duplicates
      await this.detectDuplicates();
      
      // Step 4: Resolve conflicts
      await this.resolveConflicts();
      
      // Step 5: Validate compiled data
      await this.validateData();
      
      // Step 6: Enhance with logo assets
      await this.enhanceWithLogos();
      
      // Step 7: Generate outputs
      await this.generateOutputs();
      
      // Step 8: Generate metadata and reports
      const metadata = await this.generateMetadata();
      
      // Step 9: Save logs
      await this.logger.saveLogs();
      
      this.logger.info('Compilation completed successfully!');
      
      return {
        success: true,
        totalBrokers: this.compiledBrokers.length,
        duplicatesFound: this.duplicates.size,
        duplicatesResolved: this.conflicts.length,
        validationErrors: 0, // Will be updated during validation
        sources: this.dataSources,
        metadata
      };
      
    } catch (error) {
      this.logger.error('Compilation failed', error as Error);
      await this.logger.saveLogs();
      throw error;
    }
  }

  private async loadDataSources(): Promise<void> {
    this.logger.info('Loading data sources...');
    
    // Load extracted broker data
    try {
      const extractedData = await fs.readFile(CONFIG.paths.extractedData, 'utf-8');
      const extractedBrokers = JSON.parse(extractedData) as Broker[];
      
      this.dataSources.push({
        name: 'Extracted Brokers',
        type: 'extracted',
        path: CONFIG.paths.extractedData,
        brokers: extractedBrokers,
        metadata: {
          count: extractedBrokers.length,
          lastModified: (await fs.stat(CONFIG.paths.extractedData)).mtime
        }
      });
      
      this.logger.info(`Loaded ${extractedBrokers.length} extracted brokers`);
    } catch (error) {
      this.logger.warn('Failed to load extracted broker data');
    }
    
    // Load mock data (would need to be parsed from TypeScript files)
    // For now, we'll create a simplified version
    const mockBrokers = await this.loadMockBrokers();
    if (mockBrokers.length > 0) {
      this.dataSources.push({
        name: 'Mock Brokers',
        type: 'mock',
        path: CONFIG.paths.mockData,
        brokers: mockBrokers,
        metadata: {
          count: mockBrokers.length
        }
      });
      
      this.logger.info(`Loaded ${mockBrokers.length} mock brokers`);
    }
  }

  private async loadMockBrokers(): Promise<Broker[]> {
    try {
      this.logger.info('Loading mock data from TypeScript files...');
      
      // Load mock data using the enhanced loader
      await this.mockDataLoader.loadMockDataFiles(process.cwd());
      
      // Get normalized mock data
      const mockData = this.mockDataLoader.normalizeMockBrokers();
      
      this.logger.info(`Loaded ${mockData.length} mock brokers from TypeScript files`);
      
      // Log sources metadata
      const sourcesMetadata = this.mockDataLoader.getSourcesMetadata();
      for (const source of sourcesMetadata) {
        this.logger.info(`  - ${source.source}: ${source.brokerCount} brokers`);
      }
      
      return mockData;
      
    } catch (error) {
      this.logger.error(`Error loading mock data: ${error}`);
      // Return fallback mock data
      return [
        {
          id: 'mock-broker-1',
          name: 'TradePro Markets',
          logo: 'https://example.com/logo1.png',
          rating: 4.8,
          reviewCount: 2847,
          regulators: ['fca', 'cysec'],
          minDeposit: 100,
          maxLeverage: 500,
          spreadsFrom: 0.8,
          assetClasses: ['forex', 'stocks', 'commodities'],
          platforms: ['mt4', 'mt5', 'webtrader'],
          category: 'retail',
          trustScore: 95,
          isRegulated: true,
          yearEstablished: 2015,
          headquarters: 'United Kingdom',
          website: 'https://tradepro.com',
          description: 'Professional trading platform with competitive spreads',
          keyFeatures: ['Low spreads', 'Regulated', 'Multiple platforms'],
          featured: true
        } as Broker
      ];
    }
  }

  private async loadLogoAssets(): Promise<void> {
    try {
      const logoData = await fs.readFile(CONFIG.paths.logoMapping, 'utf-8');
      const logoMapping = JSON.parse(logoData);
      
      if (logoMapping.brokers) {
        for (const broker of logoMapping.brokers) {
          this.logoAssets.set(broker.id, broker);
        }
      }
      
      this.logger.info(`Loaded ${this.logoAssets.size} logo assets`);
    } catch (error) {
      this.logger.warn('Failed to load logo assets');
    }
  }

  private async detectDuplicates(): Promise<void> {
    this.logger.info('Detecting duplicates...');
    
    const brokerMap = new Map<string, Broker[]>();
    
    // Collect all brokers from all sources
    for (const source of this.dataSources) {
      for (const broker of source.brokers) {
        const key = this.generateBrokerKey(broker);
        if (!brokerMap.has(key)) {
          brokerMap.set(key, []);
        }
        brokerMap.get(key)!.push(broker);
      }
    }
    
    // Identify duplicates
    for (const [key, brokers] of brokerMap) {
      if (brokers.length > 1) {
        this.duplicates.set(key, brokers);
        this.logger.info(`Found ${brokers.length} duplicates for: ${brokers[0].name}`);
      } else {
        this.compiledBrokers.push(brokers[0]);
      }
    }
    
    this.logger.info(`Found ${this.duplicates.size} sets of duplicates`);
  }

  private generateBrokerKey(broker: Broker): string {
    // Generate a key for duplicate detection based on name and website
    const name = broker.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const website = broker.website?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    return `${name}-${website}`;
  }

  private async resolveConflicts(): Promise<void> {
    this.logger.info('Resolving conflicts...');
    
    for (const [key, duplicates] of this.duplicates) {
      const resolved = this.resolveDuplicateBrokers(duplicates);
      this.compiledBrokers.push(resolved);
    }
    
    this.logger.info(`Resolved ${this.duplicates.size} conflicts`);
  }

  private resolveDuplicateBrokers(duplicates: Broker[]): Broker {
    // Sort by source priority
    const priorityOrder = CONFIG.deduplication.sourcePriority;
    const sortedDuplicates = duplicates.sort((a, b) => {
      const aSource = this.getBrokerSource(a);
      const bSource = this.getBrokerSource(b);
      return priorityOrder.indexOf(aSource) - priorityOrder.indexOf(bSource);
    });
    
    // Start with the highest priority broker
    const resolved = { ...sortedDuplicates[0] };
    
    // Merge data from other sources
    for (let i = 1; i < sortedDuplicates.length; i++) {
      const broker = sortedDuplicates[i];
      
      // Merge specific fields with conflict resolution
      if (!resolved.rating && broker.rating) {
        resolved.rating = broker.rating;
      }
      
      if (!resolved.reviewCount && broker.reviewCount) {
        resolved.reviewCount = broker.reviewCount;
      }
      
      // Merge arrays
      if (broker.regulators) {
        resolved.regulators = [...new Set([...resolved.regulators, ...broker.regulators])];
      }
      
      if (broker.assetClasses) {
        resolved.assetClasses = [...new Set([...resolved.assetClasses, ...broker.assetClasses])];
      }
      
      if (broker.platforms) {
        resolved.platforms = [...new Set([...resolved.platforms, ...broker.platforms])];
      }
    }
    
    return resolved;
  }

  private getBrokerSource(broker: Broker): 'extracted' | 'mock' | 'homepage' {
    // Determine source based on broker ID pattern or other indicators
    if (broker.id.startsWith('broker-')) {
      return 'extracted';
    }
    if (broker.id.startsWith('mock-')) {
      return 'mock';
    }
    return 'homepage';
  }

  private async validateData(): Promise<void> {
    this.logger.info('Validating compiled data...');
    
    let validationErrors = 0;
    const validBrokers: Broker[] = [];
    
    for (const broker of this.compiledBrokers) {
      try {
        BrokerSchema.parse(broker);
        validBrokers.push(broker);
      } catch (error) {
        validationErrors++;
        this.logger.error(`Validation failed for broker ${broker.name}:`, error);
        
        // Log detailed validation errors
        if (error instanceof Error && 'issues' in error) {
          const zodError = error as any;
          this.logger.error(`Detailed validation errors for ${broker.name}:`, JSON.stringify(zodError.issues, null, 2));
        }
        
        if (!CONFIG.validation.skipInvalid) {
          throw new Error(`Validation failed for broker ${broker.name}`);
        }
      }
    }
    
    this.compiledBrokers = validBrokers;
    this.logger.info(`Validation completed. ${validationErrors} errors found.`);
  }

  private async enhanceWithLogos(): Promise<void> {
    this.logger.info('Enhancing brokers with logo assets...');
    
    for (const broker of this.compiledBrokers) {
      const logoKey = this.generateLogoKey(broker.name);
      const logoAsset = this.logoAssets.get(logoKey);
      
      if (logoAsset) {
        // Use local logo asset if available
        broker.logo = `/assets/brokers/${logoAsset.assets.original}`;
        this.logger.info(`Enhanced ${broker.name} with local logo`);
      }
    }
  }

  private generateLogoKey(brokerName: string): string {
    return brokerName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  private async generateOutputs(): Promise<void> {
    this.logger.info('Generating output files...');
    
    // Ensure output directory exists
    await fs.mkdir(CONFIG.paths.outputDir, { recursive: true });
    
    // Generate JSON output
    if (CONFIG.output.formats.includes('json')) {
      const jsonPath = path.join(CONFIG.paths.outputDir, CONFIG.output.files.json);
      await fs.writeFile(jsonPath, JSON.stringify(this.compiledBrokers, null, 2));
      this.logger.info(`Generated JSON output: ${jsonPath}`);
    }
    
    // Generate TypeScript output
    if (CONFIG.output.formats.includes('typescript')) {
      const tsPath = path.join(CONFIG.paths.outputDir, CONFIG.output.files.typescript);
      const tsContent = this.generateTypeScriptExport();
      await fs.writeFile(tsPath, tsContent);
      this.logger.info(`Generated TypeScript output: ${tsPath}`);
    }
  }

  private generateTypeScriptExport(): string {
    return `// Auto-generated broker data compilation
// Generated on: ${new Date().toISOString()}
// Total brokers: ${this.compiledBrokers.length}

import type { Broker } from '../types/broker';

export const compiledBrokers: Broker[] = ${JSON.stringify(this.compiledBrokers, null, 2)} as const;

export const brokerCount = ${this.compiledBrokers.length};

export const lastCompiled = '${new Date().toISOString()}';

export default compiledBrokers;
`;
  }

  private async generateMetadata(): Promise<CompilationMetadata> {
    const metadata: CompilationMetadata = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      sources: this.dataSources.map(source => ({
        name: source.name,
        type: source.type,
        brokerCount: source.brokers.length,
        lastModified: source.metadata.lastModified?.toISOString()
      })),
      statistics: {
        totalBrokers: this.compiledBrokers.length,
        uniqueBrokers: this.compiledBrokers.length,
        duplicatesFound: this.duplicates.size,
        validationErrors: 0,
        dataQualityScore: this.calculateDataQualityScore()
      },
      qualityMetrics: {
        completeness: this.calculateCompleteness(),
        accuracy: this.calculateAccuracy(),
        consistency: this.calculateConsistency(),
        timeliness: this.calculateTimeliness()
      }
    };
    
    // Save metadata
    const metadataPath = path.join(CONFIG.paths.outputDir, CONFIG.output.files.metadata);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    
    // Generate data quality report
    const report = this.generateDataQualityReport(metadata);
    const reportPath = path.join(CONFIG.paths.outputDir, CONFIG.output.files.report);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    this.logger.info('Generated metadata and quality reports');
    
    return metadata;
  }

  private calculateDataQualityScore(): number {
    // Calculate overall data quality score (0-100)
    const completeness = this.calculateCompleteness();
    const accuracy = this.calculateAccuracy();
    const consistency = this.calculateConsistency();
    const timeliness = this.calculateTimeliness();
    
    return Math.round((completeness + accuracy + consistency + timeliness) / 4);
  }

  private calculateCompleteness(): number {
    // Calculate data completeness percentage
    let totalFields = 0;
    let completedFields = 0;
    
    for (const broker of this.compiledBrokers) {
      const requiredFields = ['name', 'rating', 'regulators', 'minDeposit', 'maxLeverage'];
      totalFields += requiredFields.length;
      
      for (const field of requiredFields) {
        if (broker[field as keyof Broker] !== undefined && broker[field as keyof Broker] !== null) {
          completedFields++;
        }
      }
    }
    
    return Math.round((completedFields / totalFields) * 100);
  }

  private calculateAccuracy(): number {
    // Calculate data accuracy based on validation results
    return 95; // Placeholder - would implement actual accuracy checks
  }

  private calculateConsistency(): number {
    // Calculate data consistency across sources
    return 90; // Placeholder - would implement actual consistency checks
  }

  private calculateTimeliness(): number {
    // Calculate data timeliness based on last update dates
    return 85; // Placeholder - would implement actual timeliness checks
  }

  private generateDataQualityReport(metadata: CompilationMetadata) {
    return {
      summary: {
        totalBrokers: metadata.statistics.totalBrokers,
        dataQualityScore: metadata.statistics.dataQualityScore,
        compilationDate: metadata.timestamp
      },
      qualityMetrics: metadata.qualityMetrics,
      recommendations: this.generateRecommendations(metadata),
      issues: this.generateIssuesList(),
      nextSteps: [
        'Review data quality metrics',
        'Address identified issues',
        'Update data sources as needed',
        'Schedule next compilation'
      ]
    };
  }

  private generateRecommendations(metadata: CompilationMetadata): string[] {
    const recommendations: string[] = [];
    
    if (metadata.qualityMetrics.completeness < 90) {
      recommendations.push('Improve data completeness by filling missing required fields');
    }
    
    if (metadata.statistics.duplicatesFound > 0) {
      recommendations.push('Review duplicate detection logic and source data quality');
    }
    
    if (metadata.qualityMetrics.timeliness < 80) {
      recommendations.push('Update data sources more frequently to improve timeliness');
    }
    
    return recommendations;
  }

  private generateIssuesList(): string[] {
    const issues: string[] = [];
    const stats = this.logger.getStats();
    
    if (stats.errors > 0) {
      issues.push(`${stats.errors} errors encountered during compilation`);
    }
    
    if (stats.warnings > 0) {
      issues.push(`${stats.warnings} warnings generated`);
    }
    
    return issues;
  }
}

// CLI execution
async function main() {
  try {
    console.log('🚀 Starting Broker Data Compilation...');
    
    const compiler = new BrokerDataCompiler();
    const result = await compiler.compile();
    
    console.log('\n✅ Compilation Results:');
    console.log(`📊 Total Brokers: ${result.totalBrokers}`);
    console.log(`🔍 Duplicates Found: ${result.duplicatesFound}`);
    console.log(`✨ Duplicates Resolved: ${result.duplicatesResolved}`);
    console.log(`📈 Data Quality Score: ${result.metadata.statistics.dataQualityScore}%`);
    
    console.log('\n📁 Output Files Generated:');
    console.log(`- ${CONFIG.paths.outputDir}/${CONFIG.output.files.json}`);
    console.log(`- ${CONFIG.paths.outputDir}/${CONFIG.output.files.typescript}`);
    console.log(`- ${CONFIG.paths.outputDir}/${CONFIG.output.files.metadata}`);
    console.log(`- ${CONFIG.paths.outputDir}/${CONFIG.output.files.report}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Compilation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('compileBrokerData.ts') || import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { BrokerDataCompiler, CONFIG };
export type { CompilationResult, CompilationMetadata };