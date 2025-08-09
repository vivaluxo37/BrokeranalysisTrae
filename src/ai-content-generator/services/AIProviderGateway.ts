/**
 * AI Provider Gateway Service
 * 
 * This service manages multiple AI providers (Groq, OpenRouter) with automatic
 * fallback, rate limiting, and performance monitoring.
 */

import { AIProviderConfig, AIContentGeneratorConfig } from '../config';
import { AIProvider, AIRequest } from '../types';

export interface AIResponse {
  content: string;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
  provider: string;
  model: string;
  responseTime: number;
}

export interface AIRequestOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  timeout?: number;
  retries?: number;
}

export class AIProviderGateway {
  private providers: Map<string, AIProvider> = new Map();
  private config: AIContentGeneratorConfig;
  private requestQueue: AIRequest[] = [];
  private activeRequests: Map<string, AIRequest> = new Map();

  constructor(config: AIContentGeneratorConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    this.config.providers.forEach(providerConfig => {
      this.providers.set(providerConfig.name, {
        name: providerConfig.name,
        isAvailable: true,
        requestCount: 0,
        successRate: 1.0,
        averageResponseTime: 0,
        costPerToken: this.getCostPerToken(providerConfig.name)
      });
    });
  }

  private getCostPerToken(providerName: string): number {
    // Estimated costs per 1K tokens
    const costs: Record<string, number> = {
      'groq': 0.0001, // Very low cost
      'openrouter': 0.002 // Variable based on model
    };
    return costs[providerName] || 0.001;
  }

  /**
   * Generate content using the best available AI provider
   */
  async generateContent(
    prompt: string,
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    const request: AIRequest = {
      id: this.generateRequestId(),
      provider: '',
      model: '',
      prompt,
      maxTokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      createdAt: new Date(),
      status: 'pending'
    };

    const providers = this.getAvailableProviders();
    let lastError: Error | null = null;

    for (const providerConfig of providers) {
      try {
        const startTime = Date.now();
        request.provider = providerConfig.name;
        request.model = options.model || providerConfig.models.content;
        
        this.activeRequests.set(request.id, request);
        
        const response = await this.callProvider(providerConfig, request, options);
        const responseTime = Date.now() - startTime;
        
        // Update provider statistics
        this.updateProviderStats(providerConfig.name, true, responseTime);
        
        request.status = 'completed';
        request.completedAt = new Date();
        request.response = response.content;
        request.tokenUsage = response.tokenUsage;
        request.cost = response.cost;
        
        this.activeRequests.delete(request.id);
        
        return {
          ...response,
          provider: providerConfig.name,
          model: request.model,
          responseTime
        };
      } catch (error) {
        lastError = error as Error;
        this.updateProviderStats(providerConfig.name, false, 0);
        this.handleProviderError(providerConfig.name, error as Error);
        
        request.error = error.message;
        
        // Continue to next provider
        continue;
      }
    }

    request.status = 'failed';
    this.activeRequests.delete(request.id);
    
    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }

  /**
   * Call a specific AI provider
   */
  private async callProvider(
    providerConfig: AIProviderConfig,
    request: AIRequest,
    options: AIRequestOptions
  ): Promise<AIResponse> {
    const { name, apiKey, baseUrl, models } = providerConfig;
    
    if (!apiKey) {
      throw new Error(`API key not configured for provider: ${name}`);
    }

    const requestBody = {
      model: request.model,
      messages: [
        {
          role: 'user',
          content: request.prompt
        }
      ],
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      stream: false
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, options.timeout || this.config.contentGeneration.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...(name === 'openrouter' && {
            'HTTP-Referer': 'https://brokeranalysis.com',
            'X-Title': 'BrokerAnalysis AI Content Generator'
          })
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Provider ${name} error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error(`Invalid response format from provider: ${name}`);
      }

      const content = data.choices[0].message.content;
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
      
      return {
        content,
        tokenUsage: {
          prompt: usage.prompt_tokens,
          completion: usage.completion_tokens,
          total: usage.total_tokens
        },
        cost: this.calculateCost(name, usage.total_tokens),
        provider: name,
        model: request.model,
        responseTime: 0 // Will be set by caller
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get available providers sorted by priority and availability
   */
  private getAvailableProviders(): AIProviderConfig[] {
    return this.config.providers
      .filter(provider => {
        const providerStats = this.providers.get(provider.name);
        return providerStats?.isAvailable && provider.apiKey;
      })
      .sort((a, b) => {
        const statsA = this.providers.get(a.name)!;
        const statsB = this.providers.get(b.name)!;
        
        // Sort by success rate first, then by priority
        if (statsA.successRate !== statsB.successRate) {
          return statsB.successRate - statsA.successRate;
        }
        return a.priority - b.priority;
      });
  }

  /**
   * Update provider performance statistics
   */
  private updateProviderStats(providerName: string, success: boolean, responseTime: number): void {
    const provider = this.providers.get(providerName);
    if (!provider) return;

    provider.requestCount++;
    
    // Update success rate (exponential moving average)
    const alpha = 0.1;
    provider.successRate = success 
      ? provider.successRate * (1 - alpha) + alpha
      : provider.successRate * (1 - alpha);
    
    // Update average response time
    if (success && responseTime > 0) {
      provider.averageResponseTime = provider.averageResponseTime === 0
        ? responseTime
        : provider.averageResponseTime * 0.9 + responseTime * 0.1;
    }
  }

  /**
   * Handle provider errors and implement circuit breaker pattern
   */
  private handleProviderError(providerName: string, error: Error): void {
    const provider = this.providers.get(providerName);
    if (!provider) return;

    provider.lastError = error.message;
    
    // Implement circuit breaker: disable provider if success rate is too low
    if (provider.successRate < 0.1 && provider.requestCount > 5) {
      provider.isAvailable = false;
      console.warn(`Provider ${providerName} disabled due to low success rate: ${provider.successRate}`);
      
      // Re-enable after 5 minutes
      setTimeout(() => {
        provider.isAvailable = true;
        provider.successRate = 0.5; // Reset to neutral
        console.info(`Provider ${providerName} re-enabled`);
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(providerName: string, totalTokens: number): number {
    const provider = this.providers.get(providerName);
    if (!provider) return 0;
    
    return (totalTokens / 1000) * provider.costPerToken;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get provider statistics
   */
  getProviderStats(): Record<string, AIProvider> {
    const stats: Record<string, AIProvider> = {};
    this.providers.forEach((provider, name) => {
      stats[name] = { ...provider };
    });
    return stats;
  }

  /**
   * Reset provider statistics
   */
  resetProviderStats(): void {
    this.providers.forEach(provider => {
      provider.requestCount = 0;
      provider.successRate = 1.0;
      provider.averageResponseTime = 0;
      provider.isAvailable = true;
      provider.lastError = undefined;
    });
  }

  /**
   * Get active requests count
   */
  getActiveRequestsCount(): number {
    return this.activeRequests.size;
  }

  /**
   * Cancel all active requests
   */
  cancelAllRequests(): void {
    this.activeRequests.clear();
  }
}