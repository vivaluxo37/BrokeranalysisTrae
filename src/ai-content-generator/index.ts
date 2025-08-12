/**
 * AI Content Generator System
 * 
 * Main entry point for the AI Content Generator system that creates
 * broker reviews, comparison pages, toplists, educational content,
 * country-specific pages, and FAQs based on the complete site map.
 * 
 * This system integrates with the existing BrokerAnalysis platform
 * and uses broker logos from the specified directory.
 */

// Export main service
export { AIContentGeneratorService } from './services/AIContentGeneratorService';

// Export individual services
export {
  AIProviderGateway,
  ContentGenerationService,
  ContentTemplateService,
  BrokerDataService,
  QAPipelineService,
  PublishingService
} from './services';

// Export types
export type {
  ContentType,
  ContentStatus,
  QACheckType,
  ContentSchema,
  ContentImage,
  BrokerData,
  AIProvider,
  AIRequest,
  ContentGenerationRequest,
  ContentGenerationParameters,
  QAResult,
  QAIssue,
  PublishingJob,
  ContentAnalytics,
  SystemMetrics,
  ErrorLog,
  ContentTemplate,
  TemplateVariable,
  SEOTemplate,
  APIResponse,
  PaginatedResponse
} from './types';

// Export utilities
export * from './utils';

// Export configuration
export { config } from './config';

// Export default instance factory
export function createAIContentGenerator(
  brokerLogosPath = 'c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
  outputDirectory?: string
): AIContentGeneratorService {
  return new AIContentGeneratorService(brokerLogosPath, outputDirectory);
}

// Export quick start function for generating site map content
export async function generateSiteMapContent(
  brokerLogosPath?: string,
  autoPublish = false
) {
  const generator = createAIContentGenerator(brokerLogosPath);
  
  // Default site map configuration based on the complete site map
  const siteMapConfig = {
    brokerReviews: {
      limit: 50,
      targetCountry: 'US'
    },
    comparisons: {
      targetCountry: 'US'
    },
    toplists: {
      targetCountry: 'US'
    },
    educational: {
      topics: [
        'How to Choose a Broker',
        'Understanding Trading Fees',
        'Forex Trading for Beginners',
        'Stock Market Basics',
        'Risk Management in Trading',
        'Technical Analysis Guide',
        'Fundamental Analysis Basics',
        'Trading Psychology',
        'Portfolio Diversification',
        'Options Trading Guide'
      ]
    },
    countryPages: {
      countries: ['US', 'UK', 'AU', 'CA', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE']
    },
    faqs: {
      topics: [
        'How to start trading?',
        'What is the minimum deposit?',
        'How to choose a trading platform?',
        'What are trading fees?',
        'Is online trading safe?',
        'How to verify a broker?',
        'What is leverage in trading?',
        'How to manage trading risks?',
        'What are CFDs?',
        'How to read trading charts?'
      ]
    }
  };
  
  console.log('Starting AI Content Generator for complete site map...');
  console.log('Broker logos path:', brokerLogosPath || 'default path');
  console.log('Auto-publish:', autoPublish);
  
  try {
    const result = await generator.generateSiteMapContent(siteMapConfig, autoPublish);
    
    console.log('Site map content generation completed!');
    console.log('Summary:', result.summary);
    
    return result;
  } catch (error) {
    console.error('Site map content generation failed:', error);
    throw error;
  }
}

// Export health check function
export async function checkSystemHealth(
  brokerLogosPath?: string
): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  details: any;
}> {
  const generator = createAIContentGenerator(brokerLogosPath);
  return await generator.healthCheck();
}

// Export system metrics function
export async function getSystemMetrics(
  brokerLogosPath?: string
) {
  const generator = createAIContentGenerator(brokerLogosPath);
  return await generator.getSystemMetrics();
}

/**
 * Quick start example usage:
 * 
 * ```typescript
 * import { generateSiteMapContent, checkSystemHealth } from './ai-content-generator';
 * 
 * // Generate all site map content
 * const result = await generateSiteMapContent(
 *   'c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
 *   false // Set to true to auto-publish
 * );
 * 
 * // Check system health
 * const health = await checkSystemHealth();
 * console.log('System status:', health.status);
 * ```
 */
