/**
 * Content Processor
 * 
 * Main orchestrator for content processing pipeline.
 * Coordinates content generation, template rendering, and quality validation.
 */

import { ContentGenerationService } from '../services/ContentGenerationService';
import { ContentTemplateService } from '../services/ContentTemplateService';
import { AIProviderGateway } from '../services/AIProviderGateway';
import { BrokerDataService } from '../services/BrokerDataService';
import { ContentSchema, ContentType, ProcessingOptions, ProcessingResult } from '../types';

export interface ContentProcessingRequest {
  type: ContentType;
  parameters: Record<string, any>;
  options?: ProcessingOptions;
  templateOverride?: string;
}

export interface ContentProcessingPipeline {
  preProcess?: (request: ContentProcessingRequest) => Promise<ContentProcessingRequest>;
  process: (request: ContentProcessingRequest) => Promise<ContentSchema>;
  postProcess?: (content: ContentSchema) => Promise<ContentSchema>;
  validate?: (content: ContentSchema) => Promise<boolean>;
}

export class ContentProcessor {
  private contentGenerationService: ContentGenerationService;
  private templateService: ContentTemplateService;
  private aiGateway: AIProviderGateway;
  private brokerDataService: BrokerDataService;
  private pipelines = new Map<ContentType, ContentProcessingPipeline>();

  constructor(
    contentGenerationService: ContentGenerationService,
    templateService: ContentTemplateService,
    aiGateway: AIProviderGateway,
    brokerDataService: BrokerDataService
  ) {
    this.contentGenerationService = contentGenerationService;
    this.templateService = templateService;
    this.aiGateway = aiGateway;
    this.brokerDataService = brokerDataService;
    this.initializePipelines();
  }

  /**
   * Initialize processing pipelines for different content types
   */
  private initializePipelines(): void {
    // Broker Review Pipeline
    this.pipelines.set('broker-review', {
      preProcess: async (request) => {
        // Enrich with broker data
        if (request.parameters.brokerId) {
          const brokerData = await this.brokerDataService.getBrokerById(request.parameters.brokerId);
          request.parameters = { ...request.parameters, ...brokerData };
        }
        return request;
      },
      process: async (request) => {
        return this.contentGenerationService.generateContent(request.type, request.parameters);
      },
      postProcess: async (content) => {
        // Add broker-specific enhancements
        content = await this.enhanceBrokerContent(content);
        return content;
      },
      validate: async (content) => {
        return this.validateBrokerReview(content);
      }
    });

    // Broker Comparison Pipeline
    this.pipelines.set('broker-comparison', {
      preProcess: async (request) => {
        // Enrich with data for both brokers
        if (request.parameters.broker1Id && request.parameters.broker2Id) {
          const [broker1Data, broker2Data] = await Promise.all([
            this.brokerDataService.getBrokerById(request.parameters.broker1Id),
            this.brokerDataService.getBrokerById(request.parameters.broker2Id)
          ]);
          request.parameters = {
            ...request.parameters,
            broker1: broker1Data,
            broker2: broker2Data
          };
        }
        return request;
      },
      process: async (request) => {
        return this.contentGenerationService.generateContent(request.type, request.parameters);
      },
      postProcess: async (content) => {
        // Add comparison-specific enhancements
        content = await this.enhanceComparisonContent(content);
        return content;
      },
      validate: async (content) => {
        return this.validateComparison(content);
      }
    });

    // Toplist Pipeline
    this.pipelines.set('toplist', {
      preProcess: async (request) => {
        // Get broker data for all brokers in the list
        if (request.parameters.brokerIds && Array.isArray(request.parameters.brokerIds)) {
          const brokersData = await Promise.all(
            request.parameters.brokerIds.map((id: string) => 
              this.brokerDataService.getBrokerById(id)
            )
          );
          request.parameters.brokers = brokersData;
        }
        return request;
      },
      process: async (request) => {
        return this.contentGenerationService.generateContent(request.type, request.parameters);
      },
      postProcess: async (content) => {
        // Add toplist-specific enhancements
        content = await this.enhanceToplistContent(content);
        return content;
      },
      validate: async (content) => {
        return this.validateToplist(content);
      }
    });

    // Educational Content Pipeline
    this.pipelines.set('educational', {
      process: async (request) => {
        return this.contentGenerationService.generateContent(request.type, request.parameters);
      },
      postProcess: async (content) => {
        // Add educational-specific enhancements
        content = await this.enhanceEducationalContent(content);
        return content;
      },
      validate: async (content) => {
        return this.validateEducationalContent(content);
      }
    });

    // Country Page Pipeline
    this.pipelines.set('country-page', {
      preProcess: async (request) => {
        // Get country-specific broker data
        if (request.parameters.countryCode) {
          const countryBrokers = await this.brokerDataService.getBrokersByCountry(request.parameters.countryCode);
          request.parameters.availableBrokers = countryBrokers;
        }
        return request;
      },
      process: async (request) => {
        return this.contentGenerationService.generateContent(request.type, request.parameters);
      },
      postProcess: async (content) => {
        // Add country-specific enhancements
        content = await this.enhanceCountryContent(content);
        return content;
      },
      validate: async (content) => {
        return this.validateCountryPage(content);
      }
    });

    // FAQ Pipeline
    this.pipelines.set('faq', {
      process: async (request) => {
        return this.contentGenerationService.generateContent(request.type, request.parameters);
      },
      postProcess: async (content) => {
        // Add FAQ-specific enhancements
        content = await this.enhanceFAQContent(content);
        return content;
      },
      validate: async (content) => {
        return this.validateFAQ(content);
      }
    });
  }

  /**
   * Process content using the appropriate pipeline
   */
  async processContent(request: ContentProcessingRequest): Promise<ProcessingResult> {
    const startTime = Date.now();
    const pipeline = this.pipelines.get(request.type);
    
    if (!pipeline) {
      throw new Error(`No processing pipeline found for content type: ${request.type}`);
    }

    try {
      // Pre-processing
      let processedRequest = request;
      if (pipeline.preProcess) {
        processedRequest = await pipeline.preProcess(request);
      }

      // Main processing
      let content = await pipeline.process(processedRequest);

      // Post-processing
      if (pipeline.postProcess) {
        content = await pipeline.postProcess(content);
      }

      // Validation
      let isValid = true;
      const validationErrors: string[] = [];
      if (pipeline.validate) {
        try {
          isValid = await pipeline.validate(content);
        } catch (error) {
          isValid = false;
          validationErrors.push(error instanceof Error ? error.message : 'Validation failed');
        }
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        content,
        isValid,
        validationErrors,
        processingTime,
        metadata: {
          contentType: request.type,
          processingPipeline: 'standard',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime,
        metadata: {
          contentType: request.type,
          processingPipeline: 'standard',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Process multiple content requests in batch
   */
  async processBatch(requests: ContentProcessingRequest[]): Promise<ProcessingResult[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.processContent(request))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Batch processing failed',
          processingTime: 0,
          metadata: {
            contentType: requests[index].type,
            processingPipeline: 'batch',
            timestamp: new Date().toISOString()
          }
        };
      }
    });
  }

  /**
   * Register a custom processing pipeline
   */
  registerPipeline(contentType: ContentType, pipeline: ContentProcessingPipeline): void {
    this.pipelines.set(contentType, pipeline);
  }

  /**
   * Get available content types
   */
  getAvailableContentTypes(): ContentType[] {
    return Array.from(this.pipelines.keys());
  }

  // Enhancement methods for different content types
  private async enhanceBrokerContent(content: ContentSchema): Promise<ContentSchema> {
    // Add broker-specific enhancements like logos, ratings, etc.
    if (content.metadata?.brokerId) {
      const brokerData = await this.brokerDataService.getBrokerById(content.metadata.brokerId);
      content.metadata.brokerLogo = brokerData.logoUrl;
      content.metadata.brokerRating = brokerData.rating;
    }
    return content;
  }

  private async enhanceComparisonContent(content: ContentSchema): Promise<ContentSchema> {
    // Add comparison-specific enhancements
    return content;
  }

  private async enhanceToplistContent(content: ContentSchema): Promise<ContentSchema> {
    // Add toplist-specific enhancements
    return content;
  }

  private async enhanceEducationalContent(content: ContentSchema): Promise<ContentSchema> {
    // Add educational-specific enhancements
    return content;
  }

  private async enhanceCountryContent(content: ContentSchema): Promise<ContentSchema> {
    // Add country-specific enhancements
    return content;
  }

  private async enhanceFAQContent(content: ContentSchema): Promise<ContentSchema> {
    // Add FAQ-specific enhancements
    return content;
  }

  // Validation methods for different content types
  private async validateBrokerReview(content: ContentSchema): Promise<boolean> {
    // Validate broker review content
    return content.content.length > 1000 && content.title.length > 10;
  }

  private async validateComparison(content: ContentSchema): Promise<boolean> {
    // Validate comparison content
    return content.content.includes('vs') && content.content.length > 1500;
  }

  private async validateToplist(content: ContentSchema): Promise<boolean> {
    // Validate toplist content
    return content.content.includes('Best') && content.content.length > 2000;
  }

  private async validateEducationalContent(content: ContentSchema): Promise<boolean> {
    // Validate educational content
    return content.content.length > 800 && content.title.length > 10;
  }

  private async validateCountryPage(content: ContentSchema): Promise<boolean> {
    // Validate country page content
    return content.content.length > 1200 && content.title.includes('Traders');
  }

  private async validateFAQ(content: ContentSchema): Promise<boolean> {
    // Validate FAQ content
    return content.content.includes('?') && content.content.length > 500;
  }
}
