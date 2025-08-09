/**
 * Content Generation Service
 * 
 * This service handles the generation of different types of content including
 * broker reviews, comparisons, toplists, educational content, and country pages.
 */

import { AIProviderGateway, AIResponse } from './AIProviderGateway';
import { ContentSchema, ContentType, ContentGenerationParameters, BrokerData } from '../types';
import { AIContentGeneratorConfig } from '../config';
import { ContentTemplateService } from './ContentTemplateService';
import { BrokerDataService } from './BrokerDataService';

export class ContentGenerationService {
  private aiGateway: AIProviderGateway;
  private templateService: ContentTemplateService;
  private brokerDataService: BrokerDataService;
  private config: AIContentGeneratorConfig;

  constructor(
    aiGateway: AIProviderGateway,
    templateService: ContentTemplateService,
    brokerDataService: BrokerDataService,
    config: AIContentGeneratorConfig
  ) {
    this.aiGateway = aiGateway;
    this.templateService = templateService;
    this.brokerDataService = brokerDataService;
    this.config = config;
  }

  /**
   * Generate content based on type and parameters
   */
  async generateContent(
    type: ContentType,
    parameters: ContentGenerationParameters
  ): Promise<ContentSchema> {
    const contentId = this.generateContentId();
    
    try {
      // Get relevant broker data if needed
      const brokerData = await this.getBrokerData(parameters.brokerIds);
      
      // Generate the main content
      const prompt = await this.buildPrompt(type, parameters, brokerData);
      const aiResponse = await this.aiGateway.generateContent(prompt, {
        maxTokens: this.getMaxTokensForType(type),
        temperature: 0.7
      });
      
      // Parse and structure the content
      const structuredContent = await this.parseAIResponse(aiResponse.content, type);
      
      // Generate SEO metadata
      const seoMetadata = await this.generateSEOMetadata(structuredContent, parameters);
      
      // Create content schema
      const content: ContentSchema = {
        id: contentId,
        type,
        title: structuredContent.title,
        slug: this.generateSlug(structuredContent.title),
        content: structuredContent.content,
        excerpt: structuredContent.excerpt,
        metaDescription: seoMetadata.metaDescription,
        keywords: seoMetadata.keywords,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'AI Content Generator',
        brokerIds: parameters.brokerIds,
        countryCode: parameters.countryCode,
        language: parameters.language,
        wordCount: this.countWords(structuredContent.content),
        readingTime: this.calculateReadingTime(structuredContent.content),
        seoScore: 0, // Will be calculated by QA pipeline
        qualityScore: 0, // Will be calculated by QA pipeline
        structuredData: await this.generateStructuredData(structuredContent, type, brokerData),
        images: await this.getRelevantImages(parameters.brokerIds),
        relatedContent: []
      };
      
      return content;
    } catch (error) {
      throw new Error(`Content generation failed for type ${type}: ${error.message}`);
    }
  }

  /**
   * Build AI prompt based on content type and parameters
   */
  private async buildPrompt(
    type: ContentType,
    parameters: ContentGenerationParameters,
    brokerData: BrokerData[]
  ): Promise<string> {
    const template = await this.templateService.getTemplate(type);
    const wordCount = parameters.wordCountRange;
    
    let basePrompt = `You are an expert financial content writer specializing in broker analysis and trading education. `;
    
    switch (type) {
      case 'broker-review':
        basePrompt += this.buildBrokerReviewPrompt(parameters, brokerData[0], wordCount);
        break;
      case 'broker-comparison':
        basePrompt += this.buildBrokerComparisonPrompt(parameters, brokerData, wordCount);
        break;
      case 'toplist':
        basePrompt += this.buildToplistPrompt(parameters, brokerData, wordCount);
        break;
      case 'educational':
        basePrompt += this.buildEducationalPrompt(parameters, wordCount);
        break;
      case 'country-page':
        basePrompt += this.buildCountryPagePrompt(parameters, brokerData, wordCount);
        break;
      case 'faq':
        basePrompt += this.buildFAQPrompt(parameters, wordCount);
        break;
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
    
    basePrompt += this.addCommonInstructions(parameters);
    
    return basePrompt;
  }

  private buildBrokerReviewPrompt(
    parameters: ContentGenerationParameters,
    broker: BrokerData,
    wordCount: { min: number; max: number }
  ): string {
    return `Write a comprehensive review of ${broker.name} broker. 

Broker Details:
- Name: ${broker.name}
- Founded: ${broker.founded}
- Headquarters: ${broker.headquarters}
- Regulation: ${broker.regulation.join(', ')}
- Minimum Deposit: $${broker.minDeposit}
- Platforms: ${broker.platforms.join(', ')}
- Assets: ${broker.assets.join(', ')}
- Overall Rating: ${broker.rating.overall}/5

The review should be ${wordCount.min}-${wordCount.max} words and include:
1. Executive summary
2. Company background and regulation
3. Trading platforms and tools
4. Account types and fees
5. Available assets and markets
6. Customer support
7. Pros and cons
8. Final verdict and rating

Target keywords: ${parameters.targetKeywords.join(', ')}
`;
  }

  private buildBrokerComparisonPrompt(
    parameters: ContentGenerationParameters,
    brokers: BrokerData[],
    wordCount: { min: number; max: number }
  ): string {
    const brokerNames = brokers.map(b => b.name).join(' vs ');
    const brokerDetails = brokers.map(b => `
- ${b.name}: Rating ${b.rating.overall}/5, Min Deposit $${b.minDeposit}, Regulation: ${b.regulation.join(', ')}`).join('');
    
    return `Write a detailed comparison between ${brokerNames}.

Brokers to compare:${brokerDetails}

The comparison should be ${wordCount.min}-${wordCount.max} words and include:
1. Executive summary with key differences
2. Side-by-side feature comparison
3. Fees and costs comparison
4. Platform and tools comparison
5. Regulation and safety comparison
6. Pros and cons for each broker
7. Recommendation based on trader type
8. Final verdict

Target keywords: ${parameters.targetKeywords.join(', ')}
`;
  }

  private buildToplistPrompt(
    parameters: ContentGenerationParameters,
    brokers: BrokerData[],
    wordCount: { min: number; max: number }
  ): string {
    const brokerList = brokers.map((b, i) => `${i + 1}. ${b.name} - Rating: ${b.rating.overall}/5`).join('\n');
    
    return `Write a comprehensive "Best Online Brokers" toplist for ${parameters.countryCode || 'global'} traders in 2025.

Top Brokers to feature:
${brokerList}

The toplist should be ${wordCount.min}-${wordCount.max} words and include:
1. Introduction explaining ranking methodology
2. Top 10 brokers with detailed descriptions
3. Key features and highlights for each
4. Comparison table with ratings
5. How to choose the right broker
6. Frequently asked questions
7. Conclusion and recommendations

Target keywords: ${parameters.targetKeywords.join(', ')}
`;
  }

  private buildEducationalPrompt(
    parameters: ContentGenerationParameters,
    wordCount: { min: number; max: number }
  ): string {
    return `Write an educational article about trading and brokers.

Topic focus: ${parameters.targetKeywords[0] || 'trading basics'}
Target audience: ${parameters.tone === 'educational' ? 'Beginner traders' : 'Intermediate traders'}

The article should be ${wordCount.min}-${wordCount.max} words and include:
1. Introduction to the topic
2. Key concepts and definitions
3. Step-by-step explanations
4. Practical examples
5. Common mistakes to avoid
6. Tips for success
7. Conclusion with actionable advice

Target keywords: ${parameters.targetKeywords.join(', ')}
Tone: ${parameters.tone}
`;
  }

  private buildCountryPagePrompt(
    parameters: ContentGenerationParameters,
    brokers: BrokerData[],
    wordCount: { min: number; max: number }
  ): string {
    const availableBrokers = brokers.filter(b => 
      b.countries.allowed.includes(parameters.countryCode || '')
    );
    
    return `Write a comprehensive guide for traders in ${parameters.countryCode}.

Available brokers: ${availableBrokers.map(b => b.name).join(', ')}

The guide should be ${wordCount.min}-${wordCount.max} words and include:
1. Trading landscape in ${parameters.countryCode}
2. Regulatory environment
3. Best brokers for ${parameters.countryCode} residents
4. Local payment methods
5. Tax considerations
6. Getting started guide
7. Frequently asked questions
8. Conclusion and recommendations

Target keywords: ${parameters.targetKeywords.join(', ')}
`;
  }

  private buildFAQPrompt(
    parameters: ContentGenerationParameters,
    wordCount: { min: number; max: number }
  ): string {
    return `Create a comprehensive FAQ section about ${parameters.targetKeywords[0] || 'online trading'}.

The FAQ should be ${wordCount.min}-${wordCount.max} words and include:
1. 15-20 frequently asked questions
2. Detailed, helpful answers
3. Clear, easy-to-understand language
4. Practical examples where relevant
5. Links to related topics

Target keywords: ${parameters.targetKeywords.join(', ')}
Tone: ${parameters.tone}
`;
  }

  private addCommonInstructions(parameters: ContentGenerationParameters): string {
    return `

IMPORTANT INSTRUCTIONS:
- Write in ${parameters.language}
- Use ${parameters.tone} tone
- Include relevant keywords naturally
- Ensure content is factual and up-to-date
- Add disclaimers about trading risks
- Structure content with clear headings
- Make it engaging and informative
- Include call-to-action where appropriate
${parameters.customInstructions ? `- Additional instructions: ${parameters.customInstructions}` : ''}

Please format the response as JSON with the following structure:
{
  "title": "Main title for the content",
  "excerpt": "Brief summary (150-200 characters)",
  "content": "Full content with HTML formatting",
  "headings": ["List of main headings used"]
}`;
  }

  /**
   * Parse AI response and extract structured content
   */
  private async parseAIResponse(response: string, type: ContentType): Promise<any> {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      // If not JSON, extract content manually
      return this.extractContentFromText(response, type);
    }
  }

  private extractContentFromText(text: string, type: ContentType): any {
    // Extract title (first line or heading)
    const lines = text.split('\n').filter(line => line.trim());
    const title = lines[0].replace(/^#+\s*/, '').trim();
    
    // Extract excerpt (first paragraph)
    const excerpt = lines.find(line => line.length > 50 && !line.startsWith('#'))?.substring(0, 200) + '...';
    
    // Convert to HTML
    const content = this.convertToHTML(text);
    
    return {
      title,
      excerpt: excerpt || title.substring(0, 200) + '...',
      content,
      headings: this.extractHeadings(text)
    };
  }

  private convertToHTML(text: string): string {
    return text
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.)/gm, '<p>$1')
      .replace(/(.*)$/gm, '$1</p>');
  }

  private extractHeadings(text: string): string[] {
    const headingRegex = /^#+\s*(.*)$/gm;
    const headings: string[] = [];
    let match;
    
    while ((match = headingRegex.exec(text)) !== null) {
      headings.push(match[1].trim());
    }
    
    return headings;
  }

  /**
   * Generate SEO metadata
   */
  private async generateSEOMetadata(content: any, parameters: ContentGenerationParameters): Promise<any> {
    const metaPrompt = `Generate SEO metadata for the following content:

Title: ${content.title}
Keywords: ${parameters.targetKeywords.join(', ')}

Provide:
1. Meta description (150-160 characters)
2. Additional relevant keywords
3. Optimized title suggestions

Format as JSON: {"metaDescription": "", "keywords": [], "titleSuggestions": []}`;
    
    try {
      const response = await this.aiGateway.generateContent(metaPrompt, {
        maxTokens: 500,
        temperature: 0.3
      });
      
      return JSON.parse(response.content);
    } catch {
      // Fallback to basic SEO metadata
      return {
        metaDescription: content.excerpt,
        keywords: parameters.targetKeywords,
        titleSuggestions: [content.title]
      };
    }
  }

  /**
   * Get broker data for content generation
   */
  private async getBrokerData(brokerIds?: string[]): Promise<BrokerData[]> {
    if (!brokerIds || brokerIds.length === 0) {
      return [];
    }
    
    return this.brokerDataService.getBrokersByIds(brokerIds);
  }

  /**
   * Get relevant images for content
   */
  private async getRelevantImages(brokerIds?: string[]): Promise<any[]> {
    if (!brokerIds) return [];
    
    // Get broker logos from the specified directory
    const images = [];
    for (const brokerId of brokerIds) {
      const broker = await this.brokerDataService.getBrokerById(brokerId);
      if (broker?.logoUrl) {
        images.push({
          id: `logo_${brokerId}`,
          url: broker.logoUrl,
          alt: `${broker.name} logo`,
          caption: `${broker.name} broker logo`,
          format: 'png',
          size: 0
        });
      }
    }
    
    return images;
  }

  /**
   * Generate structured data for SEO
   */
  private async generateStructuredData(content: any, type: ContentType, brokerData: BrokerData[]): Promise<any> {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': content.title,
      'description': content.excerpt,
      'author': {
        '@type': 'Organization',
        'name': 'BrokerAnalysis'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'BrokerAnalysis',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://brokeranalysis.com/logo.png'
        }
      },
      'datePublished': new Date().toISOString(),
      'dateModified': new Date().toISOString()
    };

    // Add type-specific structured data
    if (type === 'broker-review' && brokerData.length > 0) {
      const broker = brokerData[0];
      baseStructuredData['@type'] = 'Review';
      baseStructuredData['itemReviewed'] = {
        '@type': 'FinancialService',
        'name': broker.name,
        'description': broker.description
      };
      baseStructuredData['reviewRating'] = {
        '@type': 'Rating',
        'ratingValue': broker.rating.overall,
        'bestRating': 5
      };
    }

    return baseStructuredData;
  }

  /**
   * Utility methods
   */
  private generateContentId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.countWords(text);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private getMaxTokensForType(type: ContentType): number {
    const limits = this.config.contentGeneration.wordCountLimits;
    const typeLimit = limits[type as keyof typeof limits];
    
    if (typeLimit) {
      // Estimate tokens (roughly 1.3 tokens per word)
      return Math.ceil(typeLimit.max * 1.3);
    }
    
    return 2000; // Default
  }
}