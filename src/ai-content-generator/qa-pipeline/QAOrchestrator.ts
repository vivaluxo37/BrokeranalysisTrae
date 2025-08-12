/**
 * QA Orchestrator
 * 
 * Coordinates the entire QA pipeline process, managing validation rules,
 * quality checks, and approval workflows for generated content.
 */

import { BrokerData, ContentSchema, QACheckType, QAIssue, QAResult } from '../types';
import { QAValidator } from './QAValidator';
import { QualityAnalyzer } from './QualityAnalyzer';
import { ComplianceChecker } from './ComplianceChecker';
import { FactChecker } from './FactChecker';
import { AIProviderGateway } from '../services/AIProviderGateway';

export interface QAConfig {
  enabledChecks: QACheckType[];
  passThreshold: number;
  autoPublishThreshold: number;
  humanReviewThreshold: number;
  strictMode: boolean;
  timeoutMs: number;
}

export interface QAPipelineResult {
  contentId: string;
  passed: boolean;
  score: number;
  recommendation: 'publish' | 'review' | 'reject';
  issues: QAIssue[];
  processingTime: number;
  checksCompleted: QACheckType[];
  metadata: {
    checkedAt: Date;
    version: string;
    config: QAConfig;
  };
}

export class QAOrchestrator {
  private validator: QAValidator;
  private qualityAnalyzer: QualityAnalyzer;
  private complianceChecker: ComplianceChecker;
  private factChecker: FactChecker;
  private config: QAConfig;
  private aiGateway: AIProviderGateway;

  constructor(aiGateway: AIProviderGateway, config?: Partial<QAConfig>) {
    this.aiGateway = aiGateway;
    this.config = {
      enabledChecks: ['validation', 'seo', 'content-quality', 'compliance', 'fact-check'],
      passThreshold: 0.8,
      autoPublishThreshold: 0.95,
      humanReviewThreshold: 0.7,
      strictMode: false,
      timeoutMs: 30000,
      ...config
    };

    this.validator = new QAValidator();
    this.qualityAnalyzer = new QualityAnalyzer(aiGateway);
    this.complianceChecker = new ComplianceChecker();
    this.factChecker = new FactChecker(aiGateway);
  }

  /**
   * Run complete QA pipeline on content
   */
  async runQAPipeline(
    content: ContentSchema,
    brokerData?: BrokerData[]
  ): Promise<QAPipelineResult> {
    const startTime = Date.now();
    const issues: QAIssue[] = [];
    const checksCompleted: QACheckType[] = [];

    try {
      // Phase 1: Basic Validation
      if (this.config.enabledChecks.includes('validation')) {
        const validationIssues = await this.validator.validateContent(content);
        issues.push(...validationIssues);
        checksCompleted.push('validation');

        // Stop if critical validation errors in strict mode
        if (this.config.strictMode && this.hasCriticalErrors(validationIssues)) {
          return this.buildResult(content.id, false, 0, 'reject', issues, checksCompleted, startTime);
        }
      }

      // Phase 2: SEO Validation
      if (this.config.enabledChecks.includes('seo')) {
        const seoIssues = await this.validator.validateSEO(content);
        issues.push(...seoIssues);
        checksCompleted.push('seo');
      }

      // Phase 3: Content Quality Analysis
      if (this.config.enabledChecks.includes('content-quality')) {
        const qualityIssues = await this.qualityAnalyzer.analyzeQuality(content);
        issues.push(...qualityIssues);
        checksCompleted.push('content-quality');
      }

      // Phase 4: Compliance Checking
      if (this.config.enabledChecks.includes('compliance')) {
        const complianceIssues = await this.complianceChecker.checkCompliance(content);
        issues.push(...complianceIssues);
        checksCompleted.push('compliance');
      }

      // Phase 5: Fact Checking (for broker-related content)
      if (this.config.enabledChecks.includes('fact-check') && brokerData) {
        const factCheckIssues = await this.factChecker.checkFacts(content, brokerData);
        issues.push(...factCheckIssues);
        checksCompleted.push('fact-check');
      }

      // Calculate overall score and recommendation
      const score = this.calculateOverallScore(issues);
      const recommendation = this.determineRecommendation(score, issues);
      const passed = score >= this.config.passThreshold && !this.hasCriticalErrors(issues);

      return this.buildResult(content.id, passed, score, recommendation, issues, checksCompleted, startTime);

    } catch (error) {
      console.error('QA Pipeline error:', error);
      
      const systemIssue: QAIssue = {
        type: 'system-error',
        severity: 'error',
        message: `QA Pipeline failed: ${error.message}`,
        location: 'system',
        suggestion: 'Review content manually and retry QA process'
      };

      return this.buildResult(content.id, false, 0, 'reject', [systemIssue], checksCompleted, startTime);
    }
  }

  /**
   * Run quick validation for real-time feedback
   */
  async runQuickValidation(content: ContentSchema): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];

    // Basic validation only
    const validationIssues = await this.validator.validateContent(content);
    issues.push(...validationIssues);

    // Quick SEO check
    const seoIssues = await this.validator.validateSEO(content);
    issues.push(...seoIssues.filter(issue => issue.severity === 'error'));

    return issues;
  }

  /**
   * Batch process multiple content items
   */
  async batchQA(
    contentItems: { content: ContentSchema; brokerData?: BrokerData[] }[],
    concurrency = 3
  ): Promise<QAPipelineResult[]> {
    const results: QAPipelineResult[] = [];
    
    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < contentItems.length; i += concurrency) {
      const batch = contentItems.slice(i, i + concurrency);
      
      const batchPromises = batch.map(item => 
        this.runQAPipeline(item.content, item.brokerData)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error('Batch QA failed:', result.reason);
          // Add error result
          results.push({
            contentId: 'unknown',
            passed: false,
            score: 0,
            recommendation: 'reject',
            issues: [{
              type: 'system-error',
              severity: 'error',
              message: `Batch processing failed: ${result.reason}`,
              location: 'system',
              suggestion: 'Review content manually'
            }],
            processingTime: 0,
            checksCompleted: [],
            metadata: {
              checkedAt: new Date(),
              version: '1.0.0',
              config: this.config
            }
          });
        }
      }
    }

    return results;
  }

  /**
   * Update QA configuration
   */
  updateConfig(newConfig: Partial<QAConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get QA statistics
   */
  async getQAStatistics(): Promise<{
    totalChecks: number;
    passRate: number;
    averageScore: number;
    commonIssues: { type: string; count: number }[];
  }> {
    // This would typically query a database or cache
    // For now, return mock statistics
    return {
      totalChecks: 0,
      passRate: 0.85,
      averageScore: 0.82,
      commonIssues: [
        { type: 'seo', count: 15 },
        { type: 'content-quality', count: 12 },
        { type: 'validation', count: 8 }
      ]
    };
  }

  /**
   * Calculate overall score based on issues
   */
  private calculateOverallScore(issues: QAIssue[]): number {
    if (issues.length === 0) return 1.0;
    
    let totalDeductions = 0;
    
    for (const issue of issues) {
      switch (issue.severity) {
        case 'error':
          totalDeductions += 0.25;
          break;
        case 'warning':
          totalDeductions += 0.1;
          break;
        case 'info':
          totalDeductions += 0.05;
          break;
      }
    }
    
    return Math.max(0, 1 - totalDeductions);
  }

  /**
   * Determine recommendation based on score and issues
   */
  private determineRecommendation(
    score: number,
    issues: QAIssue[]
  ): 'publish' | 'review' | 'reject' {
    // Reject if critical errors
    if (this.hasCriticalErrors(issues)) {
      return 'reject';
    }

    // Auto-publish if score is very high
    if (score >= this.config.autoPublishThreshold) {
      return 'publish';
    }

    // Reject if score is too low
    if (score < this.config.humanReviewThreshold) {
      return 'reject';
    }

    // Otherwise, needs human review
    return 'review';
  }

  /**
   * Check if issues contain critical errors
   */
  private hasCriticalErrors(issues: QAIssue[]): boolean {
    return issues.some(issue => 
      issue.severity === 'error' && 
      ['validation', 'compliance', 'fact-check'].includes(issue.type)
    );
  }

  /**
   * Build QA pipeline result
   */
  private buildResult(
    contentId: string,
    passed: boolean,
    score: number,
    recommendation: 'publish' | 'review' | 'reject',
    issues: QAIssue[],
    checksCompleted: QACheckType[],
    startTime: number
  ): QAPipelineResult {
    return {
      contentId,
      passed,
      score,
      recommendation,
      issues,
      processingTime: Date.now() - startTime,
      checksCompleted,
      metadata: {
        checkedAt: new Date(),
        version: '1.0.0',
        config: this.config
      }
    };
  }
}
