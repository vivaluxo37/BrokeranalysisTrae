/**
 * Compliance Checker
 * 
 * Ensures content meets regulatory requirements, platform standards,
 * and legal compliance for financial content.
 */

import { ContentSchema, QAIssue } from '../types';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: 'regulatory' | 'legal' | 'platform' | 'editorial';
  check: (content: ContentSchema) => Promise<QAIssue[]>;
}

export interface ComplianceReport {
  passed: boolean;
  score: number;
  issues: QAIssue[];
  checkedRules: string[];
  exemptions: string[];
}

export class ComplianceChecker {
  private rules = new Map<string, ComplianceRule>();
  private exemptions = new Set<string>();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Check content compliance against all applicable rules
   */
  async checkCompliance(content: ContentSchema): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];
    const applicableRules = this.getApplicableRules(content);

    for (const rule of applicableRules) {
      if (this.exemptions.has(rule.id)) {
        continue;
      }

      try {
        const ruleIssues = await rule.check(content);
        issues.push(...ruleIssues);
      } catch (error) {
        console.error(`Compliance rule ${rule.id} failed:`, error);
        issues.push({
          type: 'compliance',
          severity: 'warning',
          message: `Compliance check failed for rule: ${rule.name}`,
          location: 'system',
          suggestion: 'Manual review required'
        });
      }
    }

    return issues;
  }

  /**
   * Generate detailed compliance report
   */
  async generateComplianceReport(content: ContentSchema): Promise<ComplianceReport> {
    const issues = await this.checkCompliance(content);
    const applicableRules = this.getApplicableRules(content);
    
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    // Calculate compliance score (0-1)
    const totalChecks = applicableRules.length;
    const failedChecks = new Set(issues.map(i => i.message)).size;
    const score = totalChecks > 0 ? Math.max(0, (totalChecks - failedChecks) / totalChecks) : 1;

    return {
      passed: errorCount === 0,
      score,
      issues,
      checkedRules: applicableRules.map(r => r.id),
      exemptions: Array.from(this.exemptions)
    };
  }

  /**
   * Initialize default compliance rules
   */
  private initializeDefaultRules(): void {
    // Financial disclaimer requirements
    this.addRule({
      id: 'financial-disclaimer',
      name: 'Financial Disclaimer Required',
      description: 'Financial content must include appropriate disclaimers',
      severity: 'error',
      category: 'regulatory',
      check: async (content) => {
        const issues: QAIssue[] = [];
        const disclaimerKeywords = [
          'not financial advice',
          'consult a financial advisor',
          'past performance',
          'risk of loss',
          'disclaimer'
        ];

        const hasDisclaimer = disclaimerKeywords.some(keyword => 
          content.content.toLowerCase().includes(keyword.toLowerCase())
        );

        if (!hasDisclaimer && this.isFinancialContent(content)) {
          issues.push({
            type: 'compliance',
            severity: 'error',
            message: 'Financial content missing required disclaimer',
            location: 'content',
            suggestion: 'Add appropriate financial disclaimer stating this is not financial advice'
          });
        }

        return issues;
      }
    });

    // Risk disclosure requirements
    this.addRule({
      id: 'risk-disclosure',
      name: 'Risk Disclosure',
      description: 'Trading and investment content must include risk warnings',
      severity: 'warning',
      category: 'regulatory',
      check: async (content) => {
        const issues: QAIssue[] = [];
        const riskKeywords = ['risk', 'loss', 'volatile', 'fluctuat'];
        
        if (this.isTradingContent(content)) {
          const hasRiskMention = riskKeywords.some(keyword => 
            content.content.toLowerCase().includes(keyword)
          );

          if (!hasRiskMention) {
            issues.push({
              type: 'compliance',
              severity: 'warning',
              message: 'Trading content should mention associated risks',
              location: 'content',
              suggestion: 'Include information about trading risks and potential losses'
            });
          }
        }

        return issues;
      }
    });

    // Regulatory compliance for broker reviews
    this.addRule({
      id: 'broker-regulation-mention',
      name: 'Broker Regulation Information',
      description: 'Broker reviews must mention regulatory status',
      severity: 'warning',
      category: 'regulatory',
      check: async (content) => {
        const issues: QAIssue[] = [];
        
        if (content.type === 'broker-review') {
          const regulatoryKeywords = [
            'regulated', 'regulation', 'license', 'authorized',
            'SEC', 'FINRA', 'FCA', 'ASIC', 'CySEC'
          ];

          const hasRegulationMention = regulatoryKeywords.some(keyword => 
            content.content.toLowerCase().includes(keyword.toLowerCase())
          );

          if (!hasRegulationMention) {
            issues.push({
              type: 'compliance',
              severity: 'warning',
              message: 'Broker review should mention regulatory status',
              location: 'content',
              suggestion: 'Include information about the broker\'s regulatory licenses and oversight'
            });
          }
        }

        return issues;
      }
    });

    // Prohibited content check
    this.addRule({
      id: 'prohibited-content',
      name: 'Prohibited Content Check',
      description: 'Content must not contain prohibited or inappropriate material',
      severity: 'error',
      category: 'platform',
      check: async (content) => {
        const issues: QAIssue[] = [];
        const prohibitedTerms = [
          'guaranteed profit',
          'risk-free',
          'get rich quick',
          'insider information',
          'pump and dump'
        ];

        for (const term of prohibitedTerms) {
          if (content.content.toLowerCase().includes(term.toLowerCase())) {
            issues.push({
              type: 'compliance',
              severity: 'error',
              message: `Content contains prohibited term: "${term}"`,
              location: 'content',
              suggestion: `Remove or rephrase content containing "${term}"`
            });
          }
        }

        return issues;
      }
    });

    // Accuracy and fact-checking
    this.addRule({
      id: 'factual-accuracy',
      name: 'Factual Accuracy Check',
      description: 'Content should not contain obviously false or misleading information',
      severity: 'warning',
      category: 'editorial',
      check: async (content) => {
        const issues: QAIssue[] = [];
        const suspiciousPatterns = [
          /\d+%\s+guaranteed/i,
          /100%\s+success/i,
          /never\s+lose/i,
          /always\s+profit/i
        ];

        for (const pattern of suspiciousPatterns) {
          if (pattern.test(content.content)) {
            issues.push({
              type: 'compliance',
              severity: 'warning',
              message: 'Content contains potentially misleading claims',
              location: 'content',
              suggestion: 'Review and verify all factual claims, avoid absolute statements'
            });
          }
        }

        return issues;
      }
    });

    // SEO and content quality standards
    this.addRule({
      id: 'content-standards',
      name: 'Content Quality Standards',
      description: 'Content must meet platform quality standards',
      severity: 'info',
      category: 'platform',
      check: async (content) => {
        const issues: QAIssue[] = [];
        
        // Check for minimum content length
        const wordCount = this.countWords(content.content);
        const minWords = this.getMinWordCount(content.type);
        
        if (wordCount < minWords) {
          issues.push({
            type: 'compliance',
            severity: 'info',
            message: `Content is shorter than recommended (${wordCount}/${minWords} words)`,
            location: 'content',
            suggestion: `Expand content to at least ${minWords} words for better SEO and user value`
          });
        }

        // Check for proper heading structure
        const hasH1 = /<h1[^>]*>|^#\s/m.test(content.content);
        if (!hasH1) {
          issues.push({
            type: 'compliance',
            severity: 'info',
            message: 'Content missing H1 heading',
            location: 'content',
            suggestion: 'Add a clear H1 heading to improve content structure'
          });
        }

        return issues;
      }
    });

    // Copyright and attribution
    this.addRule({
      id: 'copyright-attribution',
      name: 'Copyright and Attribution',
      description: 'Content must properly attribute sources and respect copyright',
      severity: 'warning',
      category: 'legal',
      check: async (content) => {
        const issues: QAIssue[] = [];
        
        // Check for potential copyright issues
        const copyrightIndicators = [
          /©\s*\d{4}/,
          /copyright\s+\d{4}/i,
          /all\s+rights\s+reserved/i
        ];

        for (const indicator of copyrightIndicators) {
          if (indicator.test(content.content)) {
            issues.push({
              type: 'compliance',
              severity: 'warning',
              message: 'Content may contain copyrighted material',
              location: 'content',
              suggestion: 'Verify copyright permissions and proper attribution'
            });
            break;
          }
        }

        return issues;
      }
    });
  }

  /**
   * Add a new compliance rule
   */
  addRule(rule: ComplianceRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove a compliance rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Add exemption for a rule
   */
  addExemption(ruleId: string): void {
    this.exemptions.add(ruleId);
  }

  /**
   * Remove exemption for a rule
   */
  removeExemption(ruleId: string): void {
    this.exemptions.delete(ruleId);
  }

  /**
   * Get applicable rules for content type
   */
  private getApplicableRules(content: ContentSchema): ComplianceRule[] {
    return Array.from(this.rules.values()).filter(rule => {
      // All rules apply by default, but could be filtered by content type
      return true;
    });
  }

  /**
   * Check if content is financial in nature
   */
  private isFinancialContent(content: ContentSchema): boolean {
    const financialKeywords = [
      'invest', 'trading', 'broker', 'stock', 'forex',
      'cryptocurrency', 'portfolio', 'return', 'profit'
    ];
    
    const contentText = (`${content.title  } ${  content.content}`).toLowerCase();
    return financialKeywords.some(keyword => contentText.includes(keyword));
  }

  /**
   * Check if content is trading-related
   */
  private isTradingContent(content: ContentSchema): boolean {
    const tradingKeywords = [
      'trading', 'trade', 'buy', 'sell', 'position',
      'market', 'price', 'chart', 'analysis'
    ];
    
    const contentText = (`${content.title  } ${  content.content}`).toLowerCase();
    return tradingKeywords.some(keyword => contentText.includes(keyword));
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content
      .replace(/[#*`\[\]()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  /**
   * Get minimum word count for content type
   */
  private getMinWordCount(contentType: string): number {
    const minimums: Record<string, number> = {
      'broker-review': 1500,
      'broker-comparison': 1200,
      'toplist': 800,
      'educational': 1000,
      'country-page': 1200,
      'faq': 300
    };

    return minimums[contentType] || 500;
  }

  /**
   * Get all available rules
   */
  getAllRules(): ComplianceRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get compliance statistics
   */
  getComplianceStats(): {
    totalRules: number;
    activeRules: number;
    exemptions: number;
    rulesByCategory: Record<string, number>;
  } {
    const rules = Array.from(this.rules.values());
    const rulesByCategory: Record<string, number> = {};
    
    for (const rule of rules) {
      rulesByCategory[rule.category] = (rulesByCategory[rule.category] || 0) + 1;
    }

    return {
      totalRules: rules.length,
      activeRules: rules.length - this.exemptions.size,
      exemptions: this.exemptions.size,
      rulesByCategory
    };
  }
}