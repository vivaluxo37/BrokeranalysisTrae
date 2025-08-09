/**
 * QA Pipeline Service
 * 
 * This service handles quality assurance for generated content,
 * including validation, fact-checking, and compliance verification.
 */

import { QAResult, QAIssue, QACheckType, ContentSchema, BrokerData } from '../types';
import { AIProviderGateway } from './AIProviderGateway';

export class QAPipelineService {
  private aiGateway: AIProviderGateway;
  private qaRules: Map<string, QARule> = new Map();
  private factCheckCache: Map<string, boolean> = new Map();

  constructor(aiGateway: AIProviderGateway) {
    this.aiGateway = aiGateway;
    this.initializeQARules();
  }

  /**
   * Initialize QA rules for different content types
   */
  private initializeQARules(): void {
    // Word count rules
    this.qaRules.set('broker-review-word-count', {
      type: 'word-count',
      contentTypes: ['broker-review'],
      minWords: 800,
      maxWords: 1500,
      severity: 'error'
    });

    this.qaRules.set('comparison-word-count', {
      type: 'word-count',
      contentTypes: ['broker-comparison'],
      minWords: 1000,
      maxWords: 2000,
      severity: 'error'
    });

    this.qaRules.set('toplist-word-count', {
      type: 'word-count',
      contentTypes: ['toplist'],
      minWords: 1200,
      maxWords: 2500,
      severity: 'error'
    });

    this.qaRules.set('educational-word-count', {
      type: 'word-count',
      contentTypes: ['educational'],
      minWords: 600,
      maxWords: 1200,
      severity: 'error'
    });

    this.qaRules.set('country-page-word-count', {
      type: 'word-count',
      contentTypes: ['country-page'],
      minWords: 800,
      maxWords: 1500,
      severity: 'error'
    });

    this.qaRules.set('faq-word-count', {
      type: 'word-count',
      contentTypes: ['faq'],
      minWords: 100,
      maxWords: 300,
      severity: 'warning'
    });

    // SEO rules
    this.qaRules.set('title-length', {
      type: 'seo',
      contentTypes: ['all'],
      check: (content: ContentSchema) => {
        const titleLength = content.seo?.title?.length || 0;
        return titleLength >= 30 && titleLength <= 60;
      },
      message: 'SEO title should be between 30-60 characters',
      severity: 'warning'
    });

    this.qaRules.set('meta-description-length', {
      type: 'seo',
      contentTypes: ['all'],
      check: (content: ContentSchema) => {
        const descLength = content.seo?.metaDescription?.length || 0;
        return descLength >= 120 && descLength <= 160;
      },
      message: 'Meta description should be between 120-160 characters',
      severity: 'warning'
    });

    this.qaRules.set('h1-presence', {
      type: 'seo',
      contentTypes: ['all'],
      check: (content: ContentSchema) => {
        return content.content.includes('<h1>') || content.content.includes('# ');
      },
      message: 'Content should have an H1 heading',
      severity: 'error'
    });

    // Content quality rules
    this.qaRules.set('no-placeholder-text', {
      type: 'content-quality',
      contentTypes: ['all'],
      check: (content: ContentSchema) => {
        const placeholders = ['[PLACEHOLDER]', 'TODO:', 'FIXME:', 'XXX:', 'Lorem ipsum'];
        return !placeholders.some(placeholder => 
          content.content.toLowerCase().includes(placeholder.toLowerCase())
        );
      },
      message: 'Content contains placeholder text that needs to be replaced',
      severity: 'error'
    });

    this.qaRules.set('proper-formatting', {
      type: 'content-quality',
      contentTypes: ['all'],
      check: (content: ContentSchema) => {
        // Check for proper paragraph breaks and structure
        const lines = content.content.split('\n');
        const hasProperStructure = lines.some(line => line.trim().startsWith('#')) &&
                                  lines.some(line => line.trim().length > 50);
        return hasProperStructure;
      },
      message: 'Content should have proper heading structure and paragraphs',
      severity: 'warning'
    });

    // Broker-specific rules
    this.qaRules.set('broker-data-accuracy', {
      type: 'broker-specific',
      contentTypes: ['broker-review', 'broker-comparison'],
      check: async (content: ContentSchema, brokerData?: BrokerData[]) => {
        if (!brokerData || brokerData.length === 0) return true;
        
        // Check if broker names in content match provided broker data
        const brokerNames = brokerData.map(b => b.name.toLowerCase());
        const contentLower = content.content.toLowerCase();
        
        return brokerNames.some(name => contentLower.includes(name));
      },
      message: 'Content should reference the specified brokers',
      severity: 'error'
    });
  }

  /**
   * Run comprehensive QA checks on content
   */
  async runQAChecks(
    content: ContentSchema,
    brokerData?: BrokerData[]
  ): Promise<QAResult> {
    const issues: QAIssue[] = [];
    const startTime = Date.now();

    try {
      // Run basic validation checks
      const basicIssues = await this.runBasicValidation(content);
      issues.push(...basicIssues);

      // Run content-specific checks
      const contentIssues = await this.runContentSpecificChecks(content, brokerData);
      issues.push(...contentIssues);

      // Run AI-powered quality checks
      const aiIssues = await this.runAIQualityChecks(content);
      issues.push(...aiIssues);

      // Run fact-checking if enabled
      const factCheckIssues = await this.runFactChecking(content, brokerData);
      issues.push(...factCheckIssues);

      // Calculate overall score
      const score = this.calculateQAScore(issues);
      const passed = score >= 0.8 && !issues.some(issue => issue.severity === 'error');

      return {
        contentId: content.id,
        passed,
        score,
        issues,
        checkedAt: new Date(),
        processingTime: Date.now() - startTime,
        checksRun: this.getChecksRun(content.type)
      };
    } catch (error) {
      console.error('QA Pipeline error:', error);
      
      return {
        contentId: content.id,
        passed: false,
        score: 0,
        issues: [{
          type: 'system-error',
          severity: 'error',
          message: `QA Pipeline failed: ${error.message}`,
          location: 'system',
          suggestion: 'Review content manually and retry QA process'
        }],
        checkedAt: new Date(),
        processingTime: Date.now() - startTime,
        checksRun: []
      };
    }
  }

  /**
   * Run basic validation checks
   */
  private async runBasicValidation(content: ContentSchema): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];

    // Check required fields
    if (!content.title || content.title.trim().length === 0) {
      issues.push({
        type: 'validation',
        severity: 'error',
        message: 'Content title is required',
        location: 'title',
        suggestion: 'Add a descriptive title for the content'
      });
    }

    if (!content.content || content.content.trim().length === 0) {
      issues.push({
        type: 'validation',
        severity: 'error',
        message: 'Content body is required',
        location: 'content',
        suggestion: 'Add content body text'
      });
    }

    if (!content.slug || content.slug.trim().length === 0) {
      issues.push({
        type: 'validation',
        severity: 'error',
        message: 'Content slug is required',
        location: 'slug',
        suggestion: 'Generate a URL-friendly slug'
      });
    }

    // Check SEO fields
    if (!content.seo?.title) {
      issues.push({
        type: 'seo',
        severity: 'warning',
        message: 'SEO title is missing',
        location: 'seo.title',
        suggestion: 'Add an SEO-optimized title'
      });
    }

    if (!content.seo?.metaDescription) {
      issues.push({
        type: 'seo',
        severity: 'warning',
        message: 'Meta description is missing',
        location: 'seo.metaDescription',
        suggestion: 'Add a compelling meta description'
      });
    }

    return issues;
  }

  /**
   * Run content-specific checks based on content type
   */
  private async runContentSpecificChecks(
    content: ContentSchema,
    brokerData?: BrokerData[]
  ): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];

    // Get applicable rules for this content type
    const applicableRules = Array.from(this.qaRules.values()).filter(rule =>
      rule.contentTypes.includes(content.type) || rule.contentTypes.includes('all')
    );

    for (const rule of applicableRules) {
      try {
        let passed = true;
        let message = rule.message || 'Rule check failed';

        if (rule.type === 'word-count') {
          const wordCount = this.countWords(content.content);
          passed = wordCount >= (rule.minWords || 0) && wordCount <= (rule.maxWords || Infinity);
          if (!passed) {
            message = `Word count (${wordCount}) should be between ${rule.minWords}-${rule.maxWords} words`;
          }
        } else if (rule.check) {
          if (rule.check.constructor.name === 'AsyncFunction') {
            passed = await rule.check(content, brokerData);
          } else {
            passed = rule.check(content, brokerData);
          }
        }

        if (!passed) {
          issues.push({
            type: rule.type as QACheckType,
            severity: rule.severity,
            message,
            location: rule.location || 'content',
            suggestion: rule.suggestion || 'Review and fix the identified issue'
          });
        }
      } catch (error) {
        console.error(`QA rule check failed for ${rule.type}:`, error);
      }
    }

    return issues;
  }

  /**
   * Run AI-powered quality checks
   */
  private async runAIQualityChecks(content: ContentSchema): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];

    try {
      const prompt = `
Analyze the following content for quality issues. Check for:
1. Grammar and spelling errors
2. Readability and flow
3. Factual consistency
4. Professional tone
5. Completeness of information

Content Type: ${content.type}
Title: ${content.title}
Content: ${content.content.substring(0, 2000)}...

Provide a JSON response with the following structure:
{
  "issues": [
    {
      "type": "grammar|readability|factual|tone|completeness",
      "severity": "error|warning|info",
      "message": "Description of the issue",
      "location": "Location in content",
      "suggestion": "How to fix the issue"
    }
  ],
  "overallQuality": "excellent|good|fair|poor",
  "confidence": 0.95
}
`;

      const response = await this.aiGateway.generateContent({
        prompt,
        maxTokens: 1000,
        temperature: 0.1,
        contentType: 'qa-analysis'
      });

      if (response.success && response.content) {
        try {
          const analysis = JSON.parse(response.content);
          if (analysis.issues && Array.isArray(analysis.issues)) {
            issues.push(...analysis.issues.map(issue => ({
              type: 'ai-quality' as QACheckType,
              severity: issue.severity || 'warning',
              message: issue.message,
              location: issue.location || 'content',
              suggestion: issue.suggestion || 'Review and improve content quality'
            })));
          }
        } catch (parseError) {
          console.warn('Failed to parse AI quality analysis:', parseError);
        }
      }
    } catch (error) {
      console.error('AI quality check failed:', error);
    }

    return issues;
  }

  /**
   * Run fact-checking on content
   */
  private async runFactChecking(
    content: ContentSchema,
    brokerData?: BrokerData[]
  ): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];

    if (!brokerData || brokerData.length === 0) {
      return issues;
    }

    try {
      // Extract factual claims from content
      const claims = this.extractFactualClaims(content.content);
      
      for (const claim of claims) {
        const cacheKey = `${content.type}-${claim}`;
        
        // Check cache first
        if (this.factCheckCache.has(cacheKey)) {
          continue;
        }

        // Verify claim against broker data
        const isAccurate = await this.verifyClaimAgainstBrokerData(claim, brokerData);
        this.factCheckCache.set(cacheKey, isAccurate);

        if (!isAccurate) {
          issues.push({
            type: 'fact-check',
            severity: 'error',
            message: `Potentially inaccurate claim: "${claim}"`,
            location: 'content',
            suggestion: 'Verify this information against official broker data'
          });
        }
      }
    } catch (error) {
      console.error('Fact-checking failed:', error);
    }

    return issues;
  }

  /**
   * Extract factual claims from content
   */
  private extractFactualClaims(content: string): string[] {
    const claims: string[] = [];
    
    // Simple pattern matching for common factual statements
    const patterns = [
      /founded in (\d{4})/gi,
      /established in (\d{4})/gi,
      /regulated by ([A-Z]{2,10})/gi,
      /minimum deposit of \$?([0-9,]+)/gi,
      /spreads from ([0-9.]+)/gi,
      /headquartered in ([A-Za-z\s,]+)/gi
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        claims.push(...matches);
      }
    }

    return claims;
  }

  /**
   * Verify claim against broker data
   */
  private async verifyClaimAgainstBrokerData(
    claim: string,
    brokerData: BrokerData[]
  ): Promise<boolean> {
    // Simple verification logic - can be enhanced with more sophisticated matching
    const claimLower = claim.toLowerCase();
    
    for (const broker of brokerData) {
      // Check founding year
      if (claimLower.includes('founded') || claimLower.includes('established')) {
        const yearMatch = claim.match(/\d{4}/);
        if (yearMatch && parseInt(yearMatch[0]) === broker.founded) {
          return true;
        }
      }
      
      // Check regulation
      if (claimLower.includes('regulated')) {
        const regMatch = claim.match(/regulated by ([A-Z]{2,10})/i);
        if (regMatch && broker.regulation.includes(regMatch[1])) {
          return true;
        }
      }
      
      // Check minimum deposit
      if (claimLower.includes('minimum deposit')) {
        const depositMatch = claim.match(/\$?([0-9,]+)/);
        if (depositMatch) {
          const amount = parseInt(depositMatch[1].replace(/,/g, ''));
          if (amount === broker.minDeposit) {
            return true;
          }
        }
      }
    }
    
    return false; // Claim not verified
  }

  /**
   * Calculate overall QA score
   */
  private calculateQAScore(issues: QAIssue[]): number {
    if (issues.length === 0) return 1.0;
    
    let totalDeductions = 0;
    
    for (const issue of issues) {
      switch (issue.severity) {
        case 'error':
          totalDeductions += 0.3;
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
   * Get list of checks run for content type
   */
  private getChecksRun(contentType: string): QACheckType[] {
    const checks: QACheckType[] = ['validation', 'seo', 'content-quality'];
    
    if (['broker-review', 'broker-comparison'].includes(contentType)) {
      checks.push('broker-specific', 'fact-check');
    }
    
    checks.push('ai-quality');
    
    return checks;
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content
      .replace(/[#*`\[\]()]/g, '') // Remove markdown formatting
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  /**
   * Add custom QA rule
   */
  addQARule(id: string, rule: QARule): void {
    this.qaRules.set(id, rule);
  }

  /**
   * Remove QA rule
   */
  removeQARule(id: string): void {
    this.qaRules.delete(id);
  }

  /**
   * Get QA statistics
   */
  async getQAStatistics(): Promise<any> {
    return {
      totalRules: this.qaRules.size,
      cacheSize: this.factCheckCache.size,
      rulesByType: this.getRulesByType()
    };
  }

  private getRulesByType(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const rule of this.qaRules.values()) {
      distribution[rule.type] = (distribution[rule.type] || 0) + 1;
    }
    
    return distribution;
  }

  /**
   * Clear fact-check cache
   */
  clearFactCheckCache(): void {
    this.factCheckCache.clear();
  }
}

/**
 * QA Rule interface
 */
interface QARule {
  type: string;
  contentTypes: string[];
  severity: 'error' | 'warning' | 'info';
  message?: string;
  location?: string;
  suggestion?: string;
  minWords?: number;
  maxWords?: number;
  check?: (content: ContentSchema, brokerData?: BrokerData[]) => boolean | Promise<boolean>;
}