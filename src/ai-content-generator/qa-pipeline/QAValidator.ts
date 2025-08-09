/**
 * QA Validator
 * 
 * Handles basic validation rules for content structure, required fields,
 * and SEO compliance checks.
 */

import { ContentSchema, QAIssue } from '../types';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  contentTypes: string[];
  validate: (content: ContentSchema) => Promise<QAIssue[]> | QAIssue[];
}

export class QAValidator {
  private validationRules: Map<string, ValidationRule> = new Map();
  private seoRules: Map<string, ValidationRule> = new Map();

  constructor() {
    this.initializeValidationRules();
    this.initializeSEORules();
  }

  /**
   * Initialize basic validation rules
   */
  private initializeValidationRules(): void {
    // Required fields validation
    this.validationRules.set('required-title', {
      id: 'required-title',
      name: 'Required Title',
      description: 'Content must have a title',
      severity: 'error',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.title || content.title.trim().length === 0) {
          issues.push({
            type: 'validation',
            severity: 'error',
            message: 'Content title is required',
            location: 'title',
            suggestion: 'Add a descriptive title for the content'
          });
        }
        
        return issues;
      }
    });

    this.validationRules.set('required-content', {
      id: 'required-content',
      name: 'Required Content',
      description: 'Content must have body text',
      severity: 'error',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.content || content.content.trim().length === 0) {
          issues.push({
            type: 'validation',
            severity: 'error',
            message: 'Content body is required',
            location: 'content',
            suggestion: 'Add content body text'
          });
        }
        
        return issues;
      }
    });

    this.validationRules.set('required-slug', {
      id: 'required-slug',
      name: 'Required Slug',
      description: 'Content must have a URL slug',
      severity: 'error',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.slug || content.slug.trim().length === 0) {
          issues.push({
            type: 'validation',
            severity: 'error',
            message: 'Content slug is required',
            location: 'slug',
            suggestion: 'Generate a URL-friendly slug'
          });
        } else if (!/^[a-z0-9-]+$/.test(content.slug)) {
          issues.push({
            type: 'validation',
            severity: 'error',
            message: 'Slug must contain only lowercase letters, numbers, and hyphens',
            location: 'slug',
            suggestion: 'Use only lowercase letters, numbers, and hyphens in the slug'
          });
        }
        
        return issues;
      }
    });

    // Word count validation
    this.validationRules.set('word-count', {
      id: 'word-count',
      name: 'Word Count',
      description: 'Content must meet word count requirements',
      severity: 'error',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        const wordCount = this.countWords(content.content);
        const limits = this.getWordCountLimits(content.type);
        
        if (wordCount < limits.min) {
          issues.push({
            type: 'validation',
            severity: 'error',
            message: `Content is too short (${wordCount} words). Minimum required: ${limits.min} words`,
            location: 'content',
            suggestion: `Add more content to reach at least ${limits.min} words`
          });
        } else if (wordCount > limits.max) {
          issues.push({
            type: 'validation',
            severity: 'warning',
            message: `Content is very long (${wordCount} words). Maximum recommended: ${limits.max} words`,
            location: 'content',
            suggestion: `Consider shortening content or breaking it into sections`
          });
        }
        
        return issues;
      }
    });

    // Content structure validation
    this.validationRules.set('content-structure', {
      id: 'content-structure',
      name: 'Content Structure',
      description: 'Content must have proper heading structure',
      severity: 'warning',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        // Check for H1 heading
        if (!content.content.includes('<h1>') && !content.content.includes('# ')) {
          issues.push({
            type: 'validation',
            severity: 'warning',
            message: 'Content should have an H1 heading',
            location: 'content',
            suggestion: 'Add a main heading (H1) to the content'
          });
        }
        
        // Check for proper paragraph structure
        const lines = content.content.split('\n').filter(line => line.trim().length > 0);
        const hasProperParagraphs = lines.some(line => line.trim().length > 50);
        
        if (!hasProperParagraphs) {
          issues.push({
            type: 'validation',
            severity: 'warning',
            message: 'Content should have well-formed paragraphs',
            location: 'content',
            suggestion: 'Organize content into proper paragraphs with sufficient length'
          });
        }
        
        return issues;
      }
    });

    // Placeholder text validation
    this.validationRules.set('no-placeholders', {
      id: 'no-placeholders',
      name: 'No Placeholder Text',
      description: 'Content must not contain placeholder text',
      severity: 'error',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        const placeholders = [
          '[PLACEHOLDER]', 'TODO:', 'FIXME:', 'XXX:', 'Lorem ipsum',
          '[INSERT', '[ADD', '[REPLACE', 'TBD', 'To be determined'
        ];
        
        const foundPlaceholders = placeholders.filter(placeholder => 
          content.content.toLowerCase().includes(placeholder.toLowerCase()) ||
          content.title.toLowerCase().includes(placeholder.toLowerCase())
        );
        
        if (foundPlaceholders.length > 0) {
          issues.push({
            type: 'validation',
            severity: 'error',
            message: `Content contains placeholder text: ${foundPlaceholders.join(', ')}`,
            location: 'content',
            suggestion: 'Replace all placeholder text with actual content'
          });
        }
        
        return issues;
      }
    });
  }

  /**
   * Initialize SEO validation rules
   */
  private initializeSEORules(): void {
    // SEO title validation
    this.seoRules.set('seo-title', {
      id: 'seo-title',
      name: 'SEO Title',
      description: 'SEO title must be present and properly formatted',
      severity: 'warning',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.seo?.title) {
          issues.push({
            type: 'seo',
            severity: 'warning',
            message: 'SEO title is missing',
            location: 'seo.title',
            suggestion: 'Add an SEO-optimized title'
          });
        } else {
          const titleLength = content.seo.title.length;
          
          if (titleLength < 30) {
            issues.push({
              type: 'seo',
              severity: 'warning',
              message: `SEO title is too short (${titleLength} characters). Recommended: 30-60 characters`,
              location: 'seo.title',
              suggestion: 'Expand the SEO title to be more descriptive'
            });
          } else if (titleLength > 60) {
            issues.push({
              type: 'seo',
              severity: 'warning',
              message: `SEO title is too long (${titleLength} characters). Recommended: 30-60 characters`,
              location: 'seo.title',
              suggestion: 'Shorten the SEO title to improve search result display'
            });
          }
        }
        
        return issues;
      }
    });

    // Meta description validation
    this.seoRules.set('meta-description', {
      id: 'meta-description',
      name: 'Meta Description',
      description: 'Meta description must be present and properly formatted',
      severity: 'warning',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.seo?.metaDescription) {
          issues.push({
            type: 'seo',
            severity: 'warning',
            message: 'Meta description is missing',
            location: 'seo.metaDescription',
            suggestion: 'Add a compelling meta description'
          });
        } else {
          const descLength = content.seo.metaDescription.length;
          
          if (descLength < 120) {
            issues.push({
              type: 'seo',
              severity: 'warning',
              message: `Meta description is too short (${descLength} characters). Recommended: 120-160 characters`,
              location: 'seo.metaDescription',
              suggestion: 'Expand the meta description to be more informative'
            });
          } else if (descLength > 160) {
            issues.push({
              type: 'seo',
              severity: 'warning',
              message: `Meta description is too long (${descLength} characters). Recommended: 120-160 characters`,
              location: 'seo.metaDescription',
              suggestion: 'Shorten the meta description to prevent truncation in search results'
            });
          }
        }
        
        return issues;
      }
    });

    // Keywords validation
    this.seoRules.set('seo-keywords', {
      id: 'seo-keywords',
      name: 'SEO Keywords',
      description: 'Content should have relevant keywords',
      severity: 'info',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.seo?.keywords || content.seo.keywords.length === 0) {
          issues.push({
            type: 'seo',
            severity: 'info',
            message: 'SEO keywords are missing',
            location: 'seo.keywords',
            suggestion: 'Add relevant keywords to improve SEO'
          });
        } else if (content.seo.keywords.length > 10) {
          issues.push({
            type: 'seo',
            severity: 'info',
            message: `Too many keywords (${content.seo.keywords.length}). Recommended: 3-7 keywords`,
            location: 'seo.keywords',
            suggestion: 'Focus on the most important keywords'
          });
        }
        
        return issues;
      }
    });

    // Canonical URL validation
    this.seoRules.set('canonical-url', {
      id: 'canonical-url',
      name: 'Canonical URL',
      description: 'Content should have a canonical URL',
      severity: 'info',
      contentTypes: ['all'],
      validate: (content: ContentSchema) => {
        const issues: QAIssue[] = [];
        
        if (!content.seo?.canonicalUrl) {
          issues.push({
            type: 'seo',
            severity: 'info',
            message: 'Canonical URL is missing',
            location: 'seo.canonicalUrl',
            suggestion: 'Add a canonical URL to prevent duplicate content issues'
          });
        }
        
        return issues;
      }
    });
  }

  /**
   * Validate content using all applicable rules
   */
  async validateContent(content: ContentSchema): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];
    
    for (const rule of this.validationRules.values()) {
      if (this.isRuleApplicable(rule, content.type)) {
        try {
          const ruleIssues = await rule.validate(content);
          issues.push(...ruleIssues);
        } catch (error) {
          console.error(`Validation rule ${rule.id} failed:`, error);
          issues.push({
            type: 'validation',
            severity: 'error',
            message: `Validation rule '${rule.name}' failed: ${error.message}`,
            location: 'system',
            suggestion: 'Review content manually'
          });
        }
      }
    }
    
    return issues;
  }

  /**
   * Validate SEO aspects of content
   */
  async validateSEO(content: ContentSchema): Promise<QAIssue[]> {
    const issues: QAIssue[] = [];
    
    for (const rule of this.seoRules.values()) {
      if (this.isRuleApplicable(rule, content.type)) {
        try {
          const ruleIssues = await rule.validate(content);
          issues.push(...ruleIssues);
        } catch (error) {
          console.error(`SEO rule ${rule.id} failed:`, error);
          issues.push({
            type: 'seo',
            severity: 'warning',
            message: `SEO rule '${rule.name}' failed: ${error.message}`,
            location: 'system',
            suggestion: 'Review SEO settings manually'
          });
        }
      }
    }
    
    return issues;
  }

  /**
   * Add custom validation rule
   */
  addValidationRule(rule: ValidationRule): void {
    this.validationRules.set(rule.id, rule);
  }

  /**
   * Add custom SEO rule
   */
  addSEORule(rule: ValidationRule): void {
    this.seoRules.set(rule.id, rule);
  }

  /**
   * Remove validation rule
   */
  removeValidationRule(ruleId: string): void {
    this.validationRules.delete(ruleId);
  }

  /**
   * Remove SEO rule
   */
  removeSEORule(ruleId: string): void {
    this.seoRules.delete(ruleId);
  }

  /**
   * Get all validation rules
   */
  getValidationRules(): ValidationRule[] {
    return Array.from(this.validationRules.values());
  }

  /**
   * Get all SEO rules
   */
  getSEORules(): ValidationRule[] {
    return Array.from(this.seoRules.values());
  }

  /**
   * Check if rule is applicable to content type
   */
  private isRuleApplicable(rule: ValidationRule, contentType: string): boolean {
    return rule.contentTypes.includes('all') || rule.contentTypes.includes(contentType);
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
   * Get word count limits for content type
   */
  private getWordCountLimits(contentType: string): { min: number; max: number } {
    const limits = {
      'broker-review': { min: 800, max: 1500 },
      'broker-comparison': { min: 1000, max: 2000 },
      'toplist': { min: 1200, max: 2500 },
      'educational': { min: 600, max: 1200 },
      'country-page': { min: 800, max: 1500 },
      'faq': { min: 100, max: 300 }
    };
    
    return limits[contentType] || { min: 300, max: 1000 };
  }
}