/**
 * AI Content Generator Service
 * 
 * Main orchestrator service that coordinates all AI content generation components
 * including content generation, QA pipeline, and publishing workflow.
 */

import { 
  ContentType, 
  ContentGenerationRequest, 
  ContentSchema, 
  QAResult, 
  PublishingJob,
  BrokerData,
  ContentAnalytics,
  SystemMetrics,
  ErrorLog
} from '../types';
import { AIProviderGateway } from './AIProviderGateway';
import { ContentGenerationService } from './ContentGenerationService';
import { ContentTemplateService } from './ContentTemplateService';
import { BrokerDataService } from './BrokerDataService';
import { QAPipelineService } from './QAPipelineService';
import { PublishingService } from './PublishingService';
import { config } from '../config';

export class AIContentGeneratorService {
  private aiGateway: AIProviderGateway;
  private contentGenerator: ContentGenerationService;
  private templateService: ContentTemplateService;
  private brokerDataService: BrokerDataService;
  private qaService: QAPipelineService;
  private publishingService: PublishingService;
  
  private generationQueue: Map<string, ContentGenerationRequest> = new Map();
  private generationHistory: Map<string, ContentSchema> = new Map();
  private analytics: ContentAnalytics = this.initializeAnalytics();
  private errorLogs: ErrorLog[] = [];
  private isProcessing: boolean = false;

  constructor(
    brokerLogosPath: string = 'c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
    outputDirectory?: string
  ) {
    // Initialize services
    this.aiGateway = new AIProviderGateway(config.aiProviders);
    this.brokerDataService = new BrokerDataService(brokerLogosPath);
    this.templateService = new ContentTemplateService();
    this.contentGenerator = new ContentGenerationService(
      this.aiGateway,
      this.brokerDataService,
      this.templateService
    );
    this.qaService = new QAPipelineService(this.aiGateway);
    this.publishingService = new PublishingService(outputDirectory);
  }

  /**
   * Initialize analytics object
   */
  private initializeAnalytics(): ContentAnalytics {
    return {
      totalGenerated: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageGenerationTime: 0,
      contentTypeBreakdown: {},
      qaPassRate: 0,
      publishingSuccessRate: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      lastUpdated: new Date()
    };
  }

  /**
   * Generate content with full pipeline (Generation -> QA -> Publishing)
   */
  async generateContent(
    request: ContentGenerationRequest,
    autoPublish: boolean = false
  ): Promise<{
    content: ContentSchema | null;
    qaResult: QAResult | null;
    publishingJob: PublishingJob | null;
    success: boolean;
    error?: string;
  }> {
    const startTime = Date.now();
    let content: ContentSchema | null = null;
    let qaResult: QAResult | null = null;
    let publishingJob: PublishingJob | null = null;

    try {
      // Step 1: Generate content
      console.log(`Starting content generation for: ${request.title}`);
      content = await this.contentGenerator.generateContent(request);
      
      if (!content) {
        throw new Error('Content generation failed');
      }

      // Store in history
      this.generationHistory.set(content.id, content);

      // Step 2: Run QA checks
      console.log(`Running QA checks for: ${content.title}`);
      const brokerData = request.brokerIds ? 
        await this.brokerDataService.getBrokersByIds(request.brokerIds) : [];
      
      qaResult = await this.qaService.runQAChecks(content, brokerData);

      // Step 3: Auto-publish if requested and QA passed
      if (autoPublish && qaResult.passed) {
        console.log(`Auto-publishing content: ${content.title}`);
        const jobId = await this.publishingService.queueForPublishing(
          content, 
          qaResult, 
          request.priority || 'medium'
        );
        publishingJob = this.publishingService.getJobStatus(jobId);
      }

      // Update analytics
      this.updateAnalytics({
        success: true,
        contentType: request.contentType,
        generationTime: Date.now() - startTime,
        tokensUsed: content.metadata?.tokensUsed || 0,
        cost: content.metadata?.cost || 0,
        qaResult
      });

      return {
        content,
        qaResult,
        publishingJob,
        success: true
      };

    } catch (error) {
      console.error('Content generation pipeline failed:', error);
      
      // Log error
      this.logError({
        id: this.generateErrorId(),
        timestamp: new Date(),
        level: 'error',
        message: error.message,
        context: {
          request,
          step: content ? (qaResult ? 'publishing' : 'qa') : 'generation'
        },
        stack: error.stack
      });

      // Update analytics
      this.updateAnalytics({
        success: false,
        contentType: request.contentType,
        generationTime: Date.now() - startTime,
        tokensUsed: 0,
        cost: 0
      });

      return {
        content,
        qaResult,
        publishingJob,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate multiple pieces of content in batch
   */
  async generateBatchContent(
    requests: ContentGenerationRequest[],
    autoPublish: boolean = false,
    maxConcurrent: number = 3
  ): Promise<{
    results: Array<{
      request: ContentGenerationRequest;
      content: ContentSchema | null;
      qaResult: QAResult | null;
      publishingJob: PublishingJob | null;
      success: boolean;
      error?: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
      published: number;
    };
  }> {
    const results = [];
    const summary = { total: requests.length, successful: 0, failed: 0, published: 0 };

    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < requests.length; i += maxConcurrent) {
      const batch = requests.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async (request) => {
        const result = await this.generateContent(request, autoPublish);
        return {
          request,
          ...result
        };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Update summary
      batchResults.forEach(result => {
        if (result.success) {
          summary.successful++;
          if (result.publishingJob) {
            summary.published++;
          }
        } else {
          summary.failed++;
        }
      });

      // Add delay between batches to respect rate limits
      if (i + maxConcurrent < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return { results, summary };
  }

  /**
   * Generate content for entire site map
   */
  async generateSiteMapContent(
    siteMapConfig: SiteMapConfig,
    autoPublish: boolean = false
  ): Promise<{
    results: any[];
    summary: any;
  }> {
    const requests: ContentGenerationRequest[] = [];

    // Generate broker review requests
    if (siteMapConfig.brokerReviews) {
      const brokers = await this.brokerDataService.getAllBrokers();
      for (const broker of brokers.slice(0, siteMapConfig.brokerReviews.limit || 50)) {
        requests.push({
          contentType: 'broker-review',
          title: `${broker.name} Review ${new Date().getFullYear()}`,
          brokerIds: [broker.id],
          targetCountry: siteMapConfig.brokerReviews.targetCountry,
          priority: 'high'
        });
      }
    }

    // Generate comparison requests
    if (siteMapConfig.comparisons) {
      const brokers = await this.brokerDataService.getTopRatedBrokers(20);
      for (let i = 0; i < brokers.length - 1; i += 2) {
        const broker1 = brokers[i];
        const broker2 = brokers[i + 1];
        if (broker2) {
          requests.push({
            contentType: 'broker-comparison',
            title: `${broker1.name} vs ${broker2.name} Comparison`,
            brokerIds: [broker1.id, broker2.id],
            targetCountry: siteMapConfig.comparisons.targetCountry,
            priority: 'medium'
          });
        }
      }
    }

    // Generate toplist requests
    if (siteMapConfig.toplists) {
      const toplistTypes = [
        'Best Online Brokers',
        'Best Forex Brokers',
        'Best Stock Brokers',
        'Best CFD Brokers',
        'Best Crypto Brokers'
      ];
      
      for (const type of toplistTypes) {
        requests.push({
          contentType: 'toplist',
          title: `${type} ${new Date().getFullYear()}`,
          targetCountry: siteMapConfig.toplists.targetCountry,
          priority: 'high'
        });
      }
    }

    // Generate educational content requests
    if (siteMapConfig.educational) {
      const topics = [
        'How to Choose a Broker',
        'Understanding Trading Fees',
        'Forex Trading for Beginners',
        'Stock Market Basics',
        'Risk Management in Trading'
      ];
      
      for (const topic of topics) {
        requests.push({
          contentType: 'educational',
          title: topic,
          priority: 'low'
        });
      }
    }

    // Generate country-specific pages
    if (siteMapConfig.countryPages) {
      const countries = siteMapConfig.countryPages.countries || ['US', 'UK', 'AU', 'CA', 'DE'];
      
      for (const country of countries) {
        requests.push({
          contentType: 'country-page',
          title: `Best Brokers in ${this.getCountryName(country)}`,
          targetCountry: country,
          priority: 'medium'
        });
      }
    }

    // Generate FAQ content
    if (siteMapConfig.faqs) {
      const faqTopics = [
        'How to start trading?',
        'What is the minimum deposit?',
        'How to choose a trading platform?',
        'What are trading fees?',
        'Is online trading safe?'
      ];
      
      for (const topic of faqTopics) {
        requests.push({
          contentType: 'faq',
          title: topic,
          priority: 'low'
        });
      }
    }

    console.log(`Generated ${requests.length} content requests for site map`);
    return await this.generateBatchContent(requests, autoPublish, 2);
  }

  /**
   * Get content generation status
   */
  getGenerationStatus(): {
    isProcessing: boolean;
    queueSize: number;
    completedCount: number;
    analytics: ContentAnalytics;
  } {
    return {
      isProcessing: this.isProcessing,
      queueSize: this.generationQueue.size,
      completedCount: this.generationHistory.size,
      analytics: this.analytics
    };
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const aiStats = await this.aiGateway.getProviderStats();
    const brokerStats = await this.brokerDataService.getBrokerStats();
    const qaStats = await this.qaService.getQAStatistics();
    const publishingStats = await this.publishingService.getPublishingStats();

    return {
      timestamp: new Date(),
      aiProviders: aiStats,
      contentGeneration: {
        totalGenerated: this.analytics.totalGenerated,
        successRate: this.analytics.successfulGenerations / Math.max(this.analytics.totalGenerated, 1),
        averageTime: this.analytics.averageGenerationTime,
        queueSize: this.generationQueue.size
      },
      brokerData: brokerStats,
      qaMetrics: qaStats,
      publishing: publishingStats,
      errors: {
        total: this.errorLogs.length,
        recent: this.errorLogs.slice(-10)
      }
    };
  }

  /**
   * Update analytics
   */
  private updateAnalytics(data: {
    success: boolean;
    contentType: ContentType;
    generationTime: number;
    tokensUsed: number;
    cost: number;
    qaResult?: QAResult;
  }): void {
    this.analytics.totalGenerated++;
    
    if (data.success) {
      this.analytics.successfulGenerations++;
    } else {
      this.analytics.failedGenerations++;
    }

    // Update average generation time
    this.analytics.averageGenerationTime = 
      (this.analytics.averageGenerationTime * (this.analytics.totalGenerated - 1) + data.generationTime) / 
      this.analytics.totalGenerated;

    // Update content type breakdown
    this.analytics.contentTypeBreakdown[data.contentType] = 
      (this.analytics.contentTypeBreakdown[data.contentType] || 0) + 1;

    // Update tokens and cost
    this.analytics.totalTokensUsed += data.tokensUsed;
    this.analytics.totalCost += data.cost;

    // Update QA pass rate
    if (data.qaResult) {
      const totalQAChecks = this.analytics.totalGenerated;
      const passedQAChecks = data.qaResult.passed ? 1 : 0;
      this.analytics.qaPassRate = 
        (this.analytics.qaPassRate * (totalQAChecks - 1) + passedQAChecks) / totalQAChecks;
    }

    this.analytics.lastUpdated = new Date();
  }

  /**
   * Log error
   */
  private logError(error: ErrorLog): void {
    this.errorLogs.push(error);
    
    // Keep only last 100 errors
    if (this.errorLogs.length > 100) {
      this.errorLogs = this.errorLogs.slice(-100);
    }
  }

  /**
   * Generate error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get country name from code
   */
  private getCountryName(code: string): string {
    const countryMap: Record<string, string> = {
      'US': 'United States',
      'UK': 'United Kingdom',
      'AU': 'Australia',
      'CA': 'Canada',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland'
    };
    
    return countryMap[code] || code;
  }

  /**
   * Get generated content by ID
   */
  getGeneratedContent(contentId: string): ContentSchema | null {
    return this.generationHistory.get(contentId) || null;
  }

  /**
   * Get all generated content
   */
  getAllGeneratedContent(): ContentSchema[] {
    return Array.from(this.generationHistory.values());
  }

  /**
   * Clear generation history
   */
  clearGenerationHistory(): void {
    this.generationHistory.clear();
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): ContentAnalytics {
    return { ...this.analytics };
  }

  /**
   * Reset analytics
   */
  resetAnalytics(): void {
    this.analytics = this.initializeAnalytics();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    details: any;
  }> {
    const services = {
      aiGateway: false,
      brokerData: false,
      qa: false,
      publishing: false
    };

    try {
      // Check AI Gateway
      const aiStats = await this.aiGateway.getProviderStats();
      services.aiGateway = Object.values(aiStats).some(stat => stat.available);

      // Check Broker Data
      const brokers = await this.brokerDataService.getAllBrokers();
      services.brokerData = brokers.length > 0;

      // Check QA Service
      const qaStats = await this.qaService.getQAStatistics();
      services.qa = qaStats.totalRules > 0;

      // Check Publishing Service
      const pubStats = await this.publishingService.getPublishingStats();
      services.publishing = true; // Publishing service is always available

      const healthyServices = Object.values(services).filter(Boolean).length;
      const totalServices = Object.keys(services).length;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyServices === totalServices) {
        status = 'healthy';
      } else if (healthyServices >= totalServices / 2) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return {
        status,
        services,
        details: {
          aiProviders: aiStats,
          brokerCount: brokers.length,
          qaRules: qaStats.totalRules,
          publishingJobs: pubStats.totalJobs
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        services,
        details: { error: error.message }
      };
    }
  }
}

/**
 * Site map configuration interface
 */
interface SiteMapConfig {
  brokerReviews?: {
    limit?: number;
    targetCountry?: string;
  };
  comparisons?: {
    targetCountry?: string;
  };
  toplists?: {
    targetCountry?: string;
  };
  educational?: {
    topics?: string[];
  };
  countryPages?: {
    countries?: string[];
  };
  faqs?: {
    topics?: string[];
  };
}