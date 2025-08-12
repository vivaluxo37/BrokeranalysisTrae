/**
 * Content Enricher
 * 
 * Enhances generated content with additional data, images, formatting, and metadata.
 */

import { BrokerData, ContentSchema, ContentType } from '../types';
import { BrokerDataService } from '../services/BrokerDataService';

export interface EnrichmentOptions {
  addImages?: boolean;
  addTables?: boolean;
  addCharts?: boolean;
  addRelatedContent?: boolean;
  addSEOEnhancements?: boolean;
  addStructuredData?: boolean;
}

export interface ImageEnrichment {
  url: string;
  alt: string;
  caption?: string;
  position: 'top' | 'middle' | 'bottom' | 'inline';
}

export interface TableEnrichment {
  title: string;
  headers: string[];
  rows: string[][];
  position: 'top' | 'middle' | 'bottom';
}

export interface ChartEnrichment {
  type: 'bar' | 'line' | 'pie' | 'comparison';
  title: string;
  data: any;
  position: 'top' | 'middle' | 'bottom';
}

export class ContentEnricher {
  private brokerDataService: BrokerDataService;
  private brokerLogosPath: string;

  constructor(brokerDataService: BrokerDataService, brokerLogosPath = '/c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/') {
    this.brokerDataService = brokerDataService;
    this.brokerLogosPath = brokerLogosPath;
  }

  /**
   * Enrich content with additional data and formatting
   */
  async enrichContent(content: ContentSchema, options: EnrichmentOptions = {}): Promise<ContentSchema> {
    let enrichedContent = { ...content };

    // Add images
    if (options.addImages) {
      enrichedContent = await this.addImages(enrichedContent);
    }

    // Add tables
    if (options.addTables) {
      enrichedContent = await this.addTables(enrichedContent);
    }

    // Add charts
    if (options.addCharts) {
      enrichedContent = await this.addCharts(enrichedContent);
    }

    // Add related content
    if (options.addRelatedContent) {
      enrichedContent = await this.addRelatedContent(enrichedContent);
    }

    // Add SEO enhancements
    if (options.addSEOEnhancements) {
      enrichedContent = await this.addSEOEnhancements(enrichedContent);
    }

    // Add structured data
    if (options.addStructuredData) {
      enrichedContent = await this.addStructuredData(enrichedContent);
    }

    return enrichedContent;
  }

  /**
   * Add relevant images to content
   */
  private async addImages(content: ContentSchema): Promise<ContentSchema> {
    const images: ImageEnrichment[] = [];

    // Add broker logos for broker-related content
    if (content.type === 'broker-review' && content.metadata?.brokerId) {
      const brokerData = await this.brokerDataService.getBrokerById(content.metadata.brokerId);
      const logoPath = this.getBrokerLogoPath(brokerData.name);
      
      images.push({
        url: logoPath,
        alt: `${brokerData.name} logo`,
        caption: `${brokerData.name} - Established ${brokerData.founded || 'N/A'}`,
        position: 'top'
      });
    }

    // Add comparison images for broker comparisons
    if (content.type === 'broker-comparison' && content.metadata?.broker1Id && content.metadata?.broker2Id) {
      const [broker1, broker2] = await Promise.all([
        this.brokerDataService.getBrokerById(content.metadata.broker1Id),
        this.brokerDataService.getBrokerById(content.metadata.broker2Id)
      ]);

      images.push(
        {
          url: this.getBrokerLogoPath(broker1.name),
          alt: `${broker1.name} logo`,
          position: 'top'
        },
        {
          url: this.getBrokerLogoPath(broker2.name),
          alt: `${broker2.name} logo`,
          position: 'top'
        }
      );
    }

    // Add toplist images
    if (content.type === 'toplist' && content.metadata?.brokerIds) {
      const brokers = await Promise.all(
        content.metadata.brokerIds.map((id: string) => this.brokerDataService.getBrokerById(id))
      );

      brokers.forEach((broker, index) => {
        images.push({
          url: this.getBrokerLogoPath(broker.name),
          alt: `${broker.name} logo`,
          caption: `#${index + 1} ${broker.name}`,
          position: 'inline'
        });
      });
    }

    // Add educational images
    if (content.type === 'educational') {
      images.push({
        url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20trading%20education%20illustration%20modern%20clean%20style&image_size=landscape_16_9',
        alt: 'Trading education illustration',
        caption: 'Learn the fundamentals of online trading',
        position: 'top'
      });
    }

    // Embed images in content
    content.metadata = {
      ...content.metadata,
      images
    };

    return content;
  }

  /**
   * Add comparison tables to content
   */
  private async addTables(content: ContentSchema): Promise<ContentSchema> {
    const tables: TableEnrichment[] = [];

    if (content.type === 'broker-comparison' && content.metadata?.broker1Id && content.metadata?.broker2Id) {
      const [broker1, broker2] = await Promise.all([
        this.brokerDataService.getBrokerById(content.metadata.broker1Id),
        this.brokerDataService.getBrokerById(content.metadata.broker2Id)
      ]);

      tables.push({
        title: 'Quick Comparison',
        headers: ['Feature', broker1.name, broker2.name],
        rows: [
          ['Minimum Deposit', broker1.minDeposit || 'N/A', broker2.minDeposit || 'N/A'],
          ['Commission', broker1.commission || 'N/A', broker2.commission || 'N/A'],
          ['Regulation', broker1.regulation?.join(', ') || 'N/A', broker2.regulation?.join(', ') || 'N/A'],
          ['Founded', broker1.founded?.toString() || 'N/A', broker2.founded?.toString() || 'N/A'],
          ['Headquarters', broker1.headquarters || 'N/A', broker2.headquarters || 'N/A']
        ],
        position: 'top'
      });
    }

    if (content.type === 'toplist' && content.metadata?.brokerIds) {
      const brokers = await Promise.all(
        content.metadata.brokerIds.map((id: string) => this.brokerDataService.getBrokerById(id))
      );

      tables.push({
        title: 'Top Brokers Comparison',
        headers: ['Rank', 'Broker', 'Min Deposit', 'Commission', 'Rating'],
        rows: brokers.map((broker, index) => [
          `#${index + 1}`,
          broker.name,
          broker.minDeposit || 'N/A',
          broker.commission || 'N/A',
          broker.rating?.toString() || 'N/A'
        ]),
        position: 'middle'
      });
    }

    content.metadata = {
      ...content.metadata,
      tables
    };

    return content;
  }

  /**
   * Add charts and visualizations to content
   */
  private async addCharts(content: ContentSchema): Promise<ContentSchema> {
    const charts: ChartEnrichment[] = [];

    if (content.type === 'broker-comparison' && content.metadata?.broker1Id && content.metadata?.broker2Id) {
      const [broker1, broker2] = await Promise.all([
        this.brokerDataService.getBrokerById(content.metadata.broker1Id),
        this.brokerDataService.getBrokerById(content.metadata.broker2Id)
      ]);

      charts.push({
        type: 'comparison',
        title: 'Rating Comparison',
        data: {
          labels: [broker1.name, broker2.name],
          datasets: [{
            label: 'Overall Rating',
            data: [broker1.rating || 0, broker2.rating || 0],
            backgroundColor: ['#3B82F6', '#10B981']
          }]
        },
        position: 'middle'
      });
    }

    if (content.type === 'toplist' && content.metadata?.brokerIds) {
      const brokers = await Promise.all(
        content.metadata.brokerIds.map((id: string) => this.brokerDataService.getBrokerById(id))
      );

      charts.push({
        type: 'bar',
        title: 'Broker Ratings',
        data: {
          labels: brokers.map(b => b.name),
          datasets: [{
            label: 'Rating',
            data: brokers.map(b => b.rating || 0),
            backgroundColor: '#3B82F6'
          }]
        },
        position: 'bottom'
      });
    }

    content.metadata = {
      ...content.metadata,
      charts
    };

    return content;
  }

  /**
   * Add related content suggestions
   */
  private async addRelatedContent(content: ContentSchema): Promise<ContentSchema> {
    const relatedContent: any[] = [];

    // Add related broker reviews
    if (content.type === 'broker-review' && content.metadata?.brokerId) {
      const similarBrokers = await this.brokerDataService.getSimilarBrokers(content.metadata.brokerId, 3);
      relatedContent.push(...similarBrokers.map(broker => ({
        type: 'broker-review',
        title: `${broker.name} Review`,
        url: `/brokers/${broker.slug}`,
        description: `Read our comprehensive review of ${broker.name}`
      })));
    }

    // Add related comparisons
    if (content.type === 'broker-comparison') {
      relatedContent.push(
        {
          type: 'toplist',
          title: 'Best Online Brokers 2025',
          url: '/best-online-brokers',
          description: 'Compare the top online brokers'
        },
        {
          type: 'educational',
          title: 'How to Choose a Broker',
          url: '/education/how-to-choose-broker',
          description: 'Learn what to look for in a broker'
        }
      );
    }

    content.metadata = {
      ...content.metadata,
      relatedContent
    };

    return content;
  }

  /**
   * Add SEO enhancements
   */
  private async addSEOEnhancements(content: ContentSchema): Promise<ContentSchema> {
    // Add internal links
    let enhancedContent = content.content;

    // Add links to broker names
    if (content.type !== 'broker-review') {
      const brokerNames = await this.getBrokerNames();
      brokerNames.forEach(brokerName => {
        const regex = new RegExp(`\\b${brokerName}\\b`, 'gi');
        const slug = brokerName.toLowerCase().replace(/\s+/g, '-');
        enhancedContent = enhancedContent.replace(regex, `[${brokerName}](/brokers/${slug})`);
      });
    }

    // Add FAQ schema
    if (content.content.includes('?')) {
      const faqItems = this.extractFAQItems(content.content);
      content.metadata = {
        ...content.metadata,
        faqSchema: {
          '@type': 'FAQPage',
          'mainEntity': faqItems.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': item.answer
            }
          }))
        }
      };
    }

    return {
      ...content,
      content: enhancedContent
    };
  }

  /**
   * Add structured data
   */
  private async addStructuredData(content: ContentSchema): Promise<ContentSchema> {
    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': content.title,
      'description': content.excerpt,
      'datePublished': content.publishedAt?.toISOString(),
      'dateModified': content.updatedAt?.toISOString(),
      'author': {
        '@type': 'Organization',
        'name': 'BrokerAnalysis'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'BrokerAnalysis'
      }
    };

    // Add specific structured data based on content type
    if (content.type === 'broker-review') {
      structuredData['@type'] = 'Review';
      structuredData.itemReviewed = {
        '@type': 'FinancialService',
        'name': content.metadata?.brokerName
      };
      if (content.metadata?.rating) {
        structuredData.reviewRating = {
          '@type': 'Rating',
          'ratingValue': content.metadata.rating,
          'bestRating': 5
        };
      }
    }

    content.metadata = {
      ...content.metadata,
      structuredData
    };

    return content;
  }

  /**
   * Get broker logo path
   */
  private getBrokerLogoPath(brokerName: string): string {
    // Normalize broker name for file path
    const normalizedName = brokerName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${this.brokerLogosPath}${normalizedName}-logo.png`;
  }

  /**
   * Get all broker names for internal linking
   */
  private async getBrokerNames(): Promise<string[]> {
    const brokers = await this.brokerDataService.getAllBrokers();
    return brokers.map(broker => broker.name);
  }

  /**
   * Extract FAQ items from content
   */
  private extractFAQItems(content: string): { question: string; answer: string }[] {
    const faqItems: { question: string; answer: string }[] = [];
    const lines = content.split('\n');
    
    let currentQuestion = '';
    let currentAnswer = '';
    let inAnswer = false;

    for (const line of lines) {
      if (line.trim().endsWith('?')) {
        if (currentQuestion && currentAnswer) {
          faqItems.push({ question: currentQuestion, answer: currentAnswer.trim() });
        }
        currentQuestion = line.trim();
        currentAnswer = '';
        inAnswer = true;
      } else if (inAnswer && line.trim()) {
        currentAnswer += `${line  } `;
      } else if (inAnswer && !line.trim()) {
        inAnswer = false;
      }
    }

    if (currentQuestion && currentAnswer) {
      faqItems.push({ question: currentQuestion, answer: currentAnswer.trim() });
    }

    return faqItems;
  }
}
