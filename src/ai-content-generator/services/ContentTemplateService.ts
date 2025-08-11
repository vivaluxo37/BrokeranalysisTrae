/**
 * Content Template Service
 * 
 * This service manages content templates for different types of content generation.
 * Templates provide structure and consistency for AI-generated content.
 */

import { ContentTemplate, ContentType, SEOTemplate, TemplateVariable } from '../types';

export class ContentTemplateService {
  private templates = new Map<ContentType, ContentTemplate>();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default templates for all content types
   */
  private initializeDefaultTemplates(): void {
    // Broker Review Template
    this.templates.set('broker-review', {
      id: 'broker-review-default',
      name: 'Default Broker Review',
      type: 'broker-review',
      description: 'Comprehensive broker review template',
      template: `
# {{brokerName}} Review 2025: Complete Analysis

## Executive Summary
{{executiveSummary}}

## About {{brokerName}}
{{companyBackground}}

## Regulation and Safety
{{regulationInfo}}

## Trading Platforms
{{platformsInfo}}

## Account Types and Fees
{{accountTypesAndFees}}

## Available Assets
{{availableAssets}}

## Customer Support
{{customerSupport}}

## Pros and Cons
### Pros
{{pros}}

### Cons
{{cons}}

## Final Verdict
{{finalVerdict}}

## Frequently Asked Questions
{{faq}}
      `,
      variables: [
        { name: 'brokerName', type: 'string', required: true, description: 'Name of the broker' },
        { name: 'executiveSummary', type: 'string', required: true, description: 'Brief overview of the broker' },
        { name: 'companyBackground', type: 'string', required: true, description: 'Company history and background' },
        { name: 'regulationInfo', type: 'string', required: true, description: 'Regulatory information' },
        { name: 'platformsInfo', type: 'string', required: true, description: 'Trading platforms information' },
        { name: 'accountTypesAndFees', type: 'string', required: true, description: 'Account types and fee structure' },
        { name: 'availableAssets', type: 'string', required: true, description: 'Available trading assets' },
        { name: 'customerSupport', type: 'string', required: true, description: 'Customer support information' },
        { name: 'pros', type: 'array', required: true, description: 'List of advantages' },
        { name: 'cons', type: 'array', required: true, description: 'List of disadvantages' },
        { name: 'finalVerdict', type: 'string', required: true, description: 'Final assessment and rating' },
        { name: 'faq', type: 'string', required: false, description: 'Frequently asked questions' }
      ],
      seoTemplate: {
        titleTemplate: '{{brokerName}} Review 2025: {{rating}}/5 Stars - Complete Analysis',
        metaDescriptionTemplate: 'Read our comprehensive {{brokerName}} review. Learn about fees, platforms, regulation, and more. {{rating}}/5 stars based on detailed analysis.',
        keywordTemplate: '{{brokerName}} review, {{brokerName}} broker, online trading, forex broker',
        structuredDataTemplate: {
          '@type': 'Review',
          'itemReviewed': {
            '@type': 'FinancialService',
            'name': '{{brokerName}}'
          }
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    // Broker Comparison Template
    this.templates.set('broker-comparison', {
      id: 'broker-comparison-default',
      name: 'Default Broker Comparison',
      type: 'broker-comparison',
      description: 'Side-by-side broker comparison template',
      template: `
# {{broker1Name}} vs {{broker2Name}}: Complete Comparison 2025

## Executive Summary
{{executiveSummary}}

## Quick Comparison Table
{{comparisonTable}}

## {{broker1Name}} Overview
{{broker1Overview}}

## {{broker2Name}} Overview
{{broker2Overview}}

## Fees and Costs Comparison
{{feesComparison}}

## Trading Platforms Comparison
{{platformsComparison}}

## Regulation and Safety
{{regulationComparison}}

## Available Assets
{{assetsComparison}}

## Customer Support
{{supportComparison}}

## Pros and Cons
### {{broker1Name}}
{{broker1ProsCons}}

### {{broker2Name}}
{{broker2ProsCons}}

## Which Broker is Better?
{{recommendation}}

## Conclusion
{{conclusion}}
      `,
      variables: [
        { name: 'broker1Name', type: 'string', required: true, description: 'First broker name' },
        { name: 'broker2Name', type: 'string', required: true, description: 'Second broker name' },
        { name: 'executiveSummary', type: 'string', required: true, description: 'Comparison overview' },
        { name: 'comparisonTable', type: 'string', required: true, description: 'Quick comparison table' },
        { name: 'broker1Overview', type: 'string', required: true, description: 'First broker overview' },
        { name: 'broker2Overview', type: 'string', required: true, description: 'Second broker overview' },
        { name: 'feesComparison', type: 'string', required: true, description: 'Fees comparison' },
        { name: 'platformsComparison', type: 'string', required: true, description: 'Platforms comparison' },
        { name: 'regulationComparison', type: 'string', required: true, description: 'Regulation comparison' },
        { name: 'assetsComparison', type: 'string', required: true, description: 'Assets comparison' },
        { name: 'supportComparison', type: 'string', required: true, description: 'Support comparison' },
        { name: 'broker1ProsCons', type: 'string', required: true, description: 'First broker pros and cons' },
        { name: 'broker2ProsCons', type: 'string', required: true, description: 'Second broker pros and cons' },
        { name: 'recommendation', type: 'string', required: true, description: 'Recommendation based on trader type' },
        { name: 'conclusion', type: 'string', required: true, description: 'Final conclusion' }
      ],
      seoTemplate: {
        titleTemplate: '{{broker1Name}} vs {{broker2Name}}: Which is Better in 2025?',
        metaDescriptionTemplate: 'Compare {{broker1Name}} vs {{broker2Name}}. Detailed analysis of fees, platforms, regulation, and features. Find the best broker for your needs.',
        keywordTemplate: '{{broker1Name}} vs {{broker2Name}}, broker comparison, best online broker',
        structuredDataTemplate: {
          '@type': 'ComparisonTable',
          'about': ['{{broker1Name}}', '{{broker2Name}}']
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    // Toplist Template
    this.templates.set('toplist', {
      id: 'toplist-default',
      name: 'Default Toplist',
      type: 'toplist',
      description: 'Best brokers toplist template',
      template: `
# Best Online Brokers in 2025: Top {{count}} Picks

## Introduction
{{introduction}}

## Our Ranking Methodology
{{methodology}}

## Top {{count}} Online Brokers

{{brokerRankings}}

## Comparison Table
{{comparisonTable}}

## How to Choose the Right Broker
{{choosingGuide}}

## Frequently Asked Questions
{{faq}}

## Conclusion
{{conclusion}}
      `,
      variables: [
        { name: 'count', type: 'number', required: true, description: 'Number of brokers in the list' },
        { name: 'introduction', type: 'string', required: true, description: 'Introduction to the toplist' },
        { name: 'methodology', type: 'string', required: true, description: 'Ranking methodology explanation' },
        { name: 'brokerRankings', type: 'string', required: true, description: 'Detailed broker rankings' },
        { name: 'comparisonTable', type: 'string', required: true, description: 'Comparison table' },
        { name: 'choosingGuide', type: 'string', required: true, description: 'Guide for choosing brokers' },
        { name: 'faq', type: 'string', required: true, description: 'Frequently asked questions' },
        { name: 'conclusion', type: 'string', required: true, description: 'Conclusion and recommendations' }
      ],
      seoTemplate: {
        titleTemplate: 'Best Online Brokers 2025: Top {{count}} Picks for Traders',
        metaDescriptionTemplate: 'Discover the best online brokers in 2025. Our expert analysis ranks the top {{count}} brokers based on fees, platforms, and features.',
        keywordTemplate: 'best online brokers, top brokers 2025, online trading platforms',
        structuredDataTemplate: {
          '@type': 'ItemList',
          'numberOfItems': '{{count}}'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    // Educational Template
    this.templates.set('educational', {
      id: 'educational-default',
      name: 'Default Educational Content',
      type: 'educational',
      description: 'Educational content template',
      template: `
# {{title}}

## Introduction
{{introduction}}

## What is {{topic}}?
{{definition}}

## Key Concepts
{{keyConcepts}}

## How It Works
{{howItWorks}}

## Practical Examples
{{examples}}

## Common Mistakes to Avoid
{{commonMistakes}}

## Tips for Success
{{tips}}

## Conclusion
{{conclusion}}
      `,
      variables: [
        { name: 'title', type: 'string', required: true, description: 'Article title' },
        { name: 'topic', type: 'string', required: true, description: 'Main topic' },
        { name: 'introduction', type: 'string', required: true, description: 'Introduction to the topic' },
        { name: 'definition', type: 'string', required: true, description: 'Definition and explanation' },
        { name: 'keyConcepts', type: 'string', required: true, description: 'Key concepts to understand' },
        { name: 'howItWorks', type: 'string', required: true, description: 'How it works explanation' },
        { name: 'examples', type: 'string', required: true, description: 'Practical examples' },
        { name: 'commonMistakes', type: 'string', required: true, description: 'Common mistakes to avoid' },
        { name: 'tips', type: 'string', required: true, description: 'Tips for success' },
        { name: 'conclusion', type: 'string', required: true, description: 'Conclusion and key takeaways' }
      ],
      seoTemplate: {
        titleTemplate: '{{title}}: Complete Guide for Beginners',
        metaDescriptionTemplate: 'Learn about {{topic}} with our comprehensive guide. Understand key concepts, avoid common mistakes, and get expert tips.',
        keywordTemplate: '{{topic}}, trading education, how to trade',
        structuredDataTemplate: {
          '@type': 'HowTo',
          'name': '{{title}}'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    // Country Page Template
    this.templates.set('country-page', {
      id: 'country-page-default',
      name: 'Default Country Page',
      type: 'country-page',
      description: 'Country-specific trading guide template',
      template: `
# Best Online Brokers for {{countryName}} Traders in 2025

## Introduction
{{introduction}}

## Trading Landscape in {{countryName}}
{{tradingLandscape}}

## Regulatory Environment
{{regulatoryEnvironment}}

## Best Brokers for {{countryName}} Residents
{{bestBrokers}}

## Local Payment Methods
{{paymentMethods}}

## Tax Considerations
{{taxConsiderations}}

## Getting Started Guide
{{gettingStarted}}

## Frequently Asked Questions
{{faq}}

## Conclusion
{{conclusion}}
      `,
      variables: [
        { name: 'countryName', type: 'string', required: true, description: 'Country name' },
        { name: 'introduction', type: 'string', required: true, description: 'Introduction to trading in the country' },
        { name: 'tradingLandscape', type: 'string', required: true, description: 'Trading landscape overview' },
        { name: 'regulatoryEnvironment', type: 'string', required: true, description: 'Regulatory environment' },
        { name: 'bestBrokers', type: 'string', required: true, description: 'Best brokers for the country' },
        { name: 'paymentMethods', type: 'string', required: true, description: 'Local payment methods' },
        { name: 'taxConsiderations', type: 'string', required: true, description: 'Tax considerations' },
        { name: 'gettingStarted', type: 'string', required: true, description: 'Getting started guide' },
        { name: 'faq', type: 'string', required: true, description: 'Frequently asked questions' },
        { name: 'conclusion', type: 'string', required: true, description: 'Conclusion and recommendations' }
      ],
      seoTemplate: {
        titleTemplate: 'Best Online Brokers for {{countryName}} Traders 2025',
        metaDescriptionTemplate: 'Find the best online brokers for {{countryName}} traders. Compare fees, regulation, and features. Start trading today.',
        keywordTemplate: '{{countryName}} brokers, online trading {{countryName}}, best brokers {{countryName}}',
        structuredDataTemplate: {
          '@type': 'Article',
          'about': 'Online trading in {{countryName}}'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    // FAQ Template
    this.templates.set('faq', {
      id: 'faq-default',
      name: 'Default FAQ',
      type: 'faq',
      description: 'FAQ section template',
      template: `
# Frequently Asked Questions: {{topic}}

## Introduction
{{introduction}}

{{faqItems}}

## Still Have Questions?
{{contactInfo}}
      `,
      variables: [
        { name: 'topic', type: 'string', required: true, description: 'FAQ topic' },
        { name: 'introduction', type: 'string', required: true, description: 'Introduction to the FAQ' },
        { name: 'faqItems', type: 'string', required: true, description: 'FAQ items with questions and answers' },
        { name: 'contactInfo', type: 'string', required: false, description: 'Contact information for additional questions' }
      ],
      seoTemplate: {
        titleTemplate: '{{topic}} FAQ: Common Questions Answered',
        metaDescriptionTemplate: 'Get answers to common questions about {{topic}}. Comprehensive FAQ with expert insights.',
        keywordTemplate: '{{topic}} FAQ, {{topic}} questions, {{topic}} help',
        structuredDataTemplate: {
          '@type': 'FAQPage'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
  }

  /**
   * Get template by content type
   */
  async getTemplate(type: ContentType): Promise<ContentTemplate> {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Template not found for content type: ${type}`);
    }
    return template;
  }

  /**
   * Get all templates
   */
  async getAllTemplates(): Promise<ContentTemplate[]> {
    return Array.from(this.templates.values());
  }

  /**
   * Add or update a template
   */
  async saveTemplate(template: ContentTemplate): Promise<void> {
    template.updatedAt = new Date();
    this.templates.set(template.type, template);
  }

  /**
   * Delete a template
   */
  async deleteTemplate(type: ContentType): Promise<void> {
    this.templates.delete(type);
  }

  /**
   * Render template with variables
   */
  async renderTemplate(type: ContentType, variables: Record<string, any>): Promise<string> {
    const template = await this.getTemplate(type);
    let rendered = template.template;

    // Replace template variables
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }

    // Remove any unreplaced variables
    rendered = rendered.replace(/{{[^}]+}}/g, '');

    return rendered;
  }

  /**
   * Validate template variables
   */
  async validateTemplateVariables(type: ContentType, variables: Record<string, any>): Promise<{ valid: boolean; errors: string[] }> {
    const template = await this.getTemplate(type);
    const errors: string[] = [];

    // Check required variables
    for (const variable of template.variables) {
      if (variable.required && !(variable.name in variables)) {
        errors.push(`Required variable '${variable.name}' is missing`);
      }

      if (variable.name in variables) {
        const value = variables[variable.name];
        const expectedType = variable.type;

        // Type validation
        if (expectedType === 'string' && typeof value !== 'string') {
          errors.push(`Variable '${variable.name}' should be a string`);
        } else if (expectedType === 'number' && typeof value !== 'number') {
          errors.push(`Variable '${variable.name}' should be a number`);
        } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Variable '${variable.name}' should be a boolean`);
        } else if (expectedType === 'array' && !Array.isArray(value)) {
          errors.push(`Variable '${variable.name}' should be an array`);
        } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
          errors.push(`Variable '${variable.name}' should be an object`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate SEO metadata from template
   */
  async generateSEOFromTemplate(type: ContentType, variables: Record<string, any>): Promise<any> {
    const template = await this.getTemplate(type);
    const {seoTemplate} = template;

    const renderSEOField = (field: string): string => {
      let rendered = field;
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        rendered = rendered.replace(regex, String(value));
      }
      return rendered.replace(/{{[^}]+}}/g, '');
    };

    return {
      title: renderSEOField(seoTemplate.titleTemplate),
      metaDescription: renderSEOField(seoTemplate.metaDescriptionTemplate),
      keywords: renderSEOField(seoTemplate.keywordTemplate).split(', '),
      structuredData: this.renderStructuredData(seoTemplate.structuredDataTemplate, variables)
    };
  }

  /**
   * Render structured data with variables
   */
  private renderStructuredData(template: Record<string, any>, variables: Record<string, any>): Record<string, any> {
    const rendered = JSON.parse(JSON.stringify(template));

    const replaceInObject = (obj: any): any => {
      if (typeof obj === 'string') {
        let result = obj;
        for (const [key, value] of Object.entries(variables)) {
          const regex = new RegExp(`{{${key}}}`, 'g');
          result = result.replace(regex, String(value));
        }
        return result.replace(/{{[^}]+}}/g, '');
      } else if (Array.isArray(obj)) {
        return obj.map(replaceInObject);
      } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = replaceInObject(value);
        }
        return result;
      }
      return obj;
    };

    return replaceInObject(rendered);
  }
}