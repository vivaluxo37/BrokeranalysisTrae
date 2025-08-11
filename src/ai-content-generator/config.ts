/**
 * AI Content Generator System Configuration
 * 
 * This file contains all configuration settings for the AI Content Generator System
 * including AI provider settings, content generation parameters, and system limits.
 */

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl: string;
  models: {
    content: string;
    qa: string;
    summarization: string;
  };
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  priority: number;
}

export interface ContentGenerationConfig {
  maxRetries: number;
  timeoutMs: number;
  batchSize: number;
  concurrentRequests: number;
  qualityThreshold: number;
  wordCountLimits: {
    brokerReview: { min: number; max: number };
    comparison: { min: number; max: number };
    educational: { min: number; max: number };
    countryPage: { min: number; max: number };
    toplist: { min: number; max: number };
  };
}

export interface QAPipelineConfig {
  enabledChecks: string[];
  passThreshold: number;
  autoPublishThreshold: number;
  humanReviewThreshold: number;
}

export interface PublishingConfig {
  autoPublish: boolean;
  scheduledPublishing: boolean;
  seoOptimization: boolean;
  geoVerification: boolean;
  contentBackup: boolean;
}

export interface AIContentGeneratorConfig {
  providers: AIProviderConfig[];
  contentGeneration: ContentGenerationConfig;
  qaPipeline: QAPipelineConfig;
  publishing: PublishingConfig;
  brokerLogosPath: string;
  outputDirectory: string;
  enableLogging: boolean;
  enableAnalytics: boolean;
}

// Default configuration
export const defaultConfig: AIContentGeneratorConfig = {
  providers: [
    {
      name: 'groq',
      apiKey: process.env.GROQ_API_KEY || '',
      baseUrl: 'https://api.groq.com/openai/v1',
      models: {
        content: 'llama-3.1-70b-versatile',
        qa: 'llama-3.1-8b-instant',
        summarization: 'llama-3.1-8b-instant'
      },
      rateLimits: {
        requestsPerMinute: 30,
        tokensPerMinute: 6000
      },
      priority: 1
    },
    {
      name: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: {
        content: 'anthropic/claude-3.5-sonnet',
        qa: 'meta-llama/llama-3.1-8b-instruct:free',
        summarization: 'meta-llama/llama-3.1-8b-instruct:free'
      },
      rateLimits: {
        requestsPerMinute: 20,
        tokensPerMinute: 4000
      },
      priority: 2
    }
  ],
  contentGeneration: {
    maxRetries: 3,
    timeoutMs: 30000,
    batchSize: 5,
    concurrentRequests: 3,
    qualityThreshold: 0.8,
    wordCountLimits: {
      brokerReview: { min: 1500, max: 3000 },
      comparison: { min: 1200, max: 2500 },
      educational: { min: 800, max: 2000 },
      countryPage: { min: 1000, max: 2000 },
      toplist: { min: 1500, max: 2500 }
    }
  },
  qaPipeline: {
    enabledChecks: [
      'grammar',
      'factAccuracy',
      'seoOptimization',
      'readability',
      'plagiarism',
      'brandConsistency'
    ],
    passThreshold: 0.85,
    autoPublishThreshold: 0.95,
    humanReviewThreshold: 0.75
  },
  publishing: {
    autoPublish: false,
    scheduledPublishing: true,
    seoOptimization: true,
    geoVerification: true,
    contentBackup: true
  },
  brokerLogosPath: '/c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
  outputDirectory: './generated-content',
  enableLogging: true,
  enableAnalytics: true
};

// Environment-specific configuration loader
export function loadConfig(): AIContentGeneratorConfig {
  const config = { ...defaultConfig };
  
  // Override with environment variables if available
  if (process.env.AI_CONTENT_GENERATOR_CONFIG) {
    try {
      const envConfig = JSON.parse(process.env.AI_CONTENT_GENERATOR_CONFIG);
      Object.assign(config, envConfig);
    } catch (error) {
      console.warn('Failed to parse AI_CONTENT_GENERATOR_CONFIG environment variable:', error);
    }
  }

  // Override API keys from environment
  if (process.env.GROQ_API_KEY) {
    const groqProvider = config.providers.find(p => p.name === 'groq');
    if (groqProvider) {
      groqProvider.apiKey = process.env.GROQ_API_KEY;
    }
  }
  if (process.env.OPENROUTER_API_KEY) {
    const openRouterProvider = config.providers.find(p => p.name === 'openrouter');
    if (openRouterProvider) {
      openRouterProvider.apiKey = process.env.OPENROUTER_API_KEY;
    }
  }

  // Override paths from environment
  if (process.env.AI_CONTENT_LOGO_DIR) {
    config.brokerLogosPath = process.env.AI_CONTENT_LOGO_DIR;
  }
  if (process.env.AI_CONTENT_OUTPUT_DIR) {
    config.outputDirectory = process.env.AI_CONTENT_OUTPUT_DIR;
  }

  // Demo mode: Use placeholder API keys if none provided
  const hasValidApiKey = config.providers.some(provider => 
    provider.apiKey && provider.apiKey !== '' && !provider.apiKey.includes('your_') && !provider.apiKey.includes('demo-')
  );
  
  if (!hasValidApiKey) {
    console.log('🔧 Demo mode: Using placeholder API keys for demonstration');
    const groqProvider = config.providers.find(p => p.name === 'groq');
    const openRouterProvider = config.providers.find(p => p.name === 'openrouter');
    if (groqProvider) groqProvider.apiKey = 'demo-groq-key';
    if (openRouterProvider) openRouterProvider.apiKey = 'demo-openrouter-key';
  }
  
  return config;
}