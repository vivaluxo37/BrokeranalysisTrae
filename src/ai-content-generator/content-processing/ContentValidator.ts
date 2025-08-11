/**
 * Content Validator
 * 
 * Validates generated content for quality, accuracy, and compliance with guidelines.
 */

import { ContentSchema, ContentType } from '../types';

export interface ValidationRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validate: (content: ContentSchema) => ValidationResult;
}

export interface ValidationResult {
  passed: boolean;
  score: number; // 0-100
  message: string;
  suggestions?: string[];
}

export interface ValidationReport {
  overall: {
    passed: boolean;
    score: number;
    errors: number;
    warnings: number;
    infos: number;
  };
  results: {
    rule: string;
    result: ValidationResult;
  }[];
  recommendations: string[];
}

export class ContentValidator {
  private rules = new Map<string, ValidationRule>();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Add a validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.set(rule.name, rule);
  }

  /**
   * Remove a validation rule
   */
  removeRule(ruleName: string): void {
    this.rules.delete(ruleName);
  }

  /**
   * Validate content against all rules
   */
  validateContent(content: ContentSchema): ValidationReport {
    const results: { rule: string; result: ValidationResult }[] = [];
    let totalScore = 0;
    let errors = 0;
    let warnings = 0;
    let infos = 0;

    // Run all validation rules
    for (const [ruleName, rule] of this.rules) {
      const result = rule.validate(content);
      results.push({ rule: ruleName, result });
      
      totalScore += result.score;
      
      if (!result.passed) {
        switch (rule.severity) {
          case 'error':
            errors++;
            break;
          case 'warning':
            warnings++;
            break;
          case 'info':
            infos++;
            break;
        }
      }
    }

    const averageScore = this.rules.size > 0 ? totalScore / this.rules.size : 0;
    const overallPassed = errors === 0;

    return {
      overall: {
        passed: overallPassed,
        score: Math.round(averageScore),
        errors,
        warnings,
        infos
      },
      results,
      recommendations: this.generateRecommendations(results)
    };
  }

  /**
   * Initialize default validation rules
   */
  private initializeDefaultRules(): void {
    // Content length validation
    this.addRule({
      name: 'content-length',
      description: 'Validates content length meets minimum requirements',
      severity: 'error',
      validate: (content: ContentSchema) => {
        const wordCount = this.countWords(content.content);
        const minWords = this.getMinWordCount(content.type);
        const maxWords = this.getMaxWordCount(content.type);
        
        if (wordCount < minWords) {
          return {
            passed: false,
            score: Math.max(0, (wordCount / minWords) * 100),
            message: `Content too short: ${wordCount} words (minimum: ${minWords})`,
            suggestions: ['Add more detailed information', 'Include additional sections', 'Expand on key points']
          };
        }
        
        if (wordCount > maxWords) {
          return {
            passed: false,
            score: Math.max(0, 100 - ((wordCount - maxWords) / maxWords) * 50),
            message: `Content too long: ${wordCount} words (maximum: ${maxWords})`,
            suggestions: ['Remove redundant information', 'Consolidate similar points', 'Split into multiple articles']
          };
        }
        
        return {
          passed: true,
          score: 100,
          message: `Content length optimal: ${wordCount} words`
        };
      }
    });

    // Title validation
    this.addRule({
      name: 'title-quality',
      description: 'Validates title quality and SEO optimization',
      severity: 'warning',
      validate: (content: ContentSchema) => {
        const {title} = content;
        const titleLength = title.length;
        let score = 100;
        const issues: string[] = [];
        
        // Check title length (optimal: 50-60 characters)
        if (titleLength < 30) {
          score -= 20;
          issues.push('Title too short for SEO');
        } else if (titleLength > 70) {
          score -= 15;
          issues.push('Title too long for search results');
        }
        
        // Check for power words
        const powerWords = ['best', 'top', 'ultimate', 'complete', 'comprehensive', 'guide', 'review'];
        const hasPowerWord = powerWords.some(word => title.toLowerCase().includes(word));
        if (!hasPowerWord) {
          score -= 10;
          issues.push('Consider adding power words');
        }
        
        // Check for year (current year)
        const currentYear = new Date().getFullYear();
        if (!title.includes(currentYear.toString())) {
          score -= 5;
          issues.push(`Consider adding ${currentYear} for freshness`);
        }
        
        return {
          passed: score >= 70,
          score: Math.max(0, score),
          message: issues.length > 0 ? `Title issues: ${issues.join(', ')}` : 'Title quality good',
          suggestions: issues.length > 0 ? [
            'Optimize title length (50-60 characters)',
            'Add power words like "best", "top", "ultimate"',
            'Include current year for freshness'
          ] : undefined
        };
      }
    });

    // SEO metadata validation
    this.addRule({
      name: 'seo-metadata',
      description: 'Validates SEO metadata completeness',
      severity: 'warning',
      validate: (content: ContentSchema) => {
        let score = 100;
        const issues: string[] = [];
        
        // Check meta description
        if (!content.metaDescription) {
          score -= 30;
          issues.push('Missing meta description');
        } else if (content.metaDescription.length < 120 || content.metaDescription.length > 160) {
          score -= 15;
          issues.push('Meta description length not optimal (120-160 chars)');
        }
        
        // Check keywords
        if (!content.keywords || content.keywords.length === 0) {
          score -= 20;
          issues.push('Missing keywords');
        } else if (content.keywords.length < 3) {
          score -= 10;
          issues.push('Too few keywords (minimum 3 recommended)');
        }
        
        // Check slug
        if (!content.slug) {
          score -= 20;
          issues.push('Missing URL slug');
        } else if (content.slug.length > 60) {
          score -= 10;
          issues.push('URL slug too long');
        }
        
        return {
          passed: score >= 70,
          score: Math.max(0, score),
          message: issues.length > 0 ? `SEO issues: ${issues.join(', ')}` : 'SEO metadata complete',
          suggestions: issues.length > 0 ? [
            'Add compelling meta description (120-160 characters)',
            'Include relevant keywords (3-5 recommended)',
            'Optimize URL slug (under 60 characters)'
          ] : undefined
        };
      }
    });

    // Content structure validation
    this.addRule({
      name: 'content-structure',
      description: 'Validates content structure and readability',
      severity: 'warning',
      validate: (content: ContentSchema) => {
        const text = content.content;
        let score = 100;
        const issues: string[] = [];
        
        // Check for headings
        const headingMatches = text.match(/^#{1,6}\s+.+$/gm);
        const headingCount = headingMatches ? headingMatches.length : 0;
        const wordCount = this.countWords(text);
        
        if (headingCount === 0) {
          score -= 25;
          issues.push('No headings found');
        } else if (headingCount < Math.floor(wordCount / 300)) {
          score -= 15;
          issues.push('Too few headings for content length');
        }
        
        // Check for lists
        const listMatches = text.match(/^[\s]*[-*+]\s+.+$/gm);
        const listCount = listMatches ? listMatches.length : 0;
        
        if (listCount === 0 && wordCount > 500) {
          score -= 10;
          issues.push('Consider adding bullet points or lists');
        }
        
        // Check paragraph length
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        const longParagraphs = paragraphs.filter(p => this.countWords(p) > 150);
        
        if (longParagraphs.length > paragraphs.length * 0.3) {
          score -= 15;
          issues.push('Some paragraphs are too long');
        }
        
        return {
          passed: score >= 70,
          score: Math.max(0, score),
          message: issues.length > 0 ? `Structure issues: ${issues.join(', ')}` : 'Content structure good',
          suggestions: issues.length > 0 ? [
            'Add more headings to break up content',
            'Use bullet points and lists for better readability',
            'Keep paragraphs under 150 words'
          ] : undefined
        };
      }
    });

    // Factual accuracy validation
    this.addRule({
      name: 'factual-accuracy',
      description: 'Validates factual accuracy and claims',
      severity: 'error',
      validate: (content: ContentSchema) => {
        const text = content.content.toLowerCase();
        let score = 100;
        const issues: string[] = [];
        
        // Check for unsupported claims
        const claimWords = ['guaranteed', 'always', 'never', 'impossible', 'certain', 'definitely'];
        const foundClaims = claimWords.filter(word => text.includes(word));
        
        if (foundClaims.length > 0) {
          score -= foundClaims.length * 10;
          issues.push(`Unsupported absolute claims: ${foundClaims.join(', ')}`);
        }
        
        // Check for financial advice disclaimers
        const hasDisclaimer = text.includes('not financial advice') || 
                             text.includes('consult a financial advisor') ||
                             text.includes('do your own research');
        
        if (!hasDisclaimer && (content.type === 'broker-review' || content.type === 'educational')) {
          score -= 20;
          issues.push('Missing financial advice disclaimer');
        }
        
        return {
          passed: score >= 80,
          score: Math.max(0, score),
          message: issues.length > 0 ? `Accuracy issues: ${issues.join(', ')}` : 'Factual accuracy good',
          suggestions: issues.length > 0 ? [
            'Avoid absolute claims without evidence',
            'Add appropriate disclaimers',
            'Use qualifying language ("may", "could", "typically")'
          ] : undefined
        };
      }
    });

    // Compliance validation
    this.addRule({
      name: 'compliance',
      description: 'Validates regulatory compliance and legal requirements',
      severity: 'error',
      validate: (content: ContentSchema) => {
        const text = content.content.toLowerCase();
        let score = 100;
        const issues: string[] = [];
        
        // Check for required disclaimers
        const requiredPhrases = [
          'trading involves risk',
          'past performance',
          'not financial advice'
        ];
        
        const missingPhrases = requiredPhrases.filter(phrase => !text.includes(phrase));
        
        if (missingPhrases.length > 0) {
          score -= missingPhrases.length * 15;
          issues.push(`Missing required disclaimers: ${missingPhrases.join(', ')}`);
        }
        
        // Check for prohibited language
        const prohibitedWords = ['guaranteed profit', 'risk-free', 'get rich quick'];
        const foundProhibited = prohibitedWords.filter(word => text.includes(word));
        
        if (foundProhibited.length > 0) {
          score -= foundProhibited.length * 25;
          issues.push(`Prohibited language: ${foundProhibited.join(', ')}`);
        }
        
        return {
          passed: score >= 80,
          score: Math.max(0, score),
          message: issues.length > 0 ? `Compliance issues: ${issues.join(', ')}` : 'Compliance requirements met',
          suggestions: issues.length > 0 ? [
            'Add required risk disclaimers',
            'Remove prohibited promotional language',
            'Include past performance disclaimers'
          ] : undefined
        };
      }
    });
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(results: { rule: string; result: ValidationResult }[]): string[] {
    const recommendations: string[] = [];
    
    results.forEach(({ result }) => {
      if (result.suggestions) {
        recommendations.push(...result.suggestions);
      }
    });
    
    // Remove duplicates
    return [...new Set(recommendations)];
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Get minimum word count for content type
   */
  private getMinWordCount(type: ContentType): number {
    const minimums: Record<ContentType, number> = {
      'broker-review': 1500,
      'broker-comparison': 1200,
      'toplist': 1000,
      'educational': 800,
      'country-page': 1000,
      'faq': 500
    };
    
    return minimums[type] || 800;
  }

  /**
   * Get maximum word count for content type
   */
  private getMaxWordCount(type: ContentType): number {
    const maximums: Record<ContentType, number> = {
      'broker-review': 4000,
      'broker-comparison': 3500,
      'toplist': 3000,
      'educational': 2500,
      'country-page': 3000,
      'faq': 2000
    };
    
    return maximums[type] || 3000;
  }

  /**
   * Get validation rules
   */
  getRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get validation rule by name
   */
  getRule(name: string): ValidationRule | undefined {
    return this.rules.get(name);
  }
}