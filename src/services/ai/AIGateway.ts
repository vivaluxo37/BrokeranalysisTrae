/**
 * AI Gateway Service for managing multiple AI providers
 * Supports Groq and OpenRouter with automatic fallback
 */

export interface AIProvider {
  name: string
  enabled: boolean
  priority: number
  apiKey?: string
  baseUrl?: string
  models: string[]
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export interface AIResponse {
  content: string
  provider: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost?: number
}

export interface AIStreamResponse {
  content: string
  done: boolean
  provider: string
  model: string
}

export interface AIConfig {
  providers: {
    groq: AIProvider
    openrouter: AIProvider
  }
  defaultModel: string
  maxRetries: number
  timeout: number
  enableStreaming: boolean
}

/**
 * AI Gateway class for managing multiple AI providers
 */
export class AIGateway {
  private config: AIConfig
  private activeProvider: string | null = null
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(config: Partial<AIConfig> = {}) {
    this.config = {
      providers: {
        groq: {
          name: 'groq',
          enabled: true,
          priority: 1,
          apiKey: import.meta.env.VITE_GROQ_API_KEY,
          baseUrl: 'https://api.groq.com/openai/v1',
          models: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'],
        },
        openrouter: {
          name: 'openrouter',
          enabled: true,
          priority: 2,
          apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
          baseUrl: 'https://openrouter.ai/api/v1',
          models: ['openai/gpt-3.5-turbo', 'openai/gpt-4', 'anthropic/claude-3-haiku'],
        },
      },
      defaultModel: 'llama3-8b-8192',
      maxRetries: 3,
      timeout: 30000,
      enableStreaming: true,
      ...config,
    }
  }

  /**
   * Send a chat completion request
   */
  async chat(
    messages: AIMessage[],
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
      stream?: boolean
      provider?: string
    }
  ): Promise<AIResponse> {
    const provider = this.selectProvider(options?.provider)
    const model = options?.model || this.config.defaultModel

    try {
      const response = await this.makeRequest(provider, {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1000,
        stream: options?.stream || false,
      })

      return {
        content: response.choices[0]?.message?.content || '',
        provider: provider.name,
        model,
        usage: response.usage,
        cost: this.calculateCost(provider.name, response.usage),
      }
    } catch (error) {
      console.error(`AI request failed for provider ${provider.name}:`, error)
      
      // Try fallback provider
      const fallbackProvider = this.getFallbackProvider(provider.name)
      if (fallbackProvider) {
        return this.chat(messages, { ...options, provider: fallbackProvider.name })
      }
      
      throw error
    }
  }

  /**
   * Send a streaming chat completion request
   */
  async *chatStream(
    messages: AIMessage[],
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
      provider?: string
    }
  ): AsyncGenerator<AIStreamResponse> {
    const provider = this.selectProvider(options?.provider)
    const model = options?.model || this.config.defaultModel

    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body reader available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                yield {
                  content: '',
                  done: true,
                  provider: provider.name,
                  model,
                }
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''
                if (content) {
                  yield {
                    content,
                    done: false,
                    provider: provider.name,
                    model,
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      console.error(`AI streaming failed for provider ${provider.name}:`, error)
      throw error
    }
  }

  /**
   * Generate text completion
   */
  async complete(
    prompt: string,
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
      provider?: string
    }
  ): Promise<AIResponse> {
    return this.chat(
      [{ role: 'user', content: prompt }],
      options
    )
  }

  /**
   * Summarize text content
   */
  async summarize(
    content: string,
    options?: {
      maxLength?: number
      style?: 'brief' | 'detailed' | 'bullet-points'
      provider?: string
    }
  ): Promise<AIResponse> {
    const style = options?.style || 'brief'
    const maxLength = options?.maxLength || 200
    
    const prompt = `Please summarize the following content in a ${style} style, keeping it under ${maxLength} words:\n\n${content}`
    
    return this.complete(prompt, {
      provider: options?.provider,
      temperature: 0.3,
      maxTokens: Math.min(maxLength * 2, 500),
    })
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(
    text: string,
    provider?: string
  ): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; reasoning: string }> {
    const prompt = `Analyze the sentiment of the following text and respond with a JSON object containing "sentiment" (positive/negative/neutral), "confidence" (0-1), and "reasoning":\n\n${text}`
    
    const response = await this.complete(prompt, {
      provider,
      temperature: 0.1,
      maxTokens: 200,
    })

    try {
      return JSON.parse(response.content)
    } catch {
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        reasoning: 'Unable to parse sentiment analysis',
      }
    }
  }

  /**
   * Select the best available provider
   */
  private selectProvider(preferredProvider?: string): AIProvider {
    const providers = Object.values(this.config.providers)
      .filter(p => p.enabled && p.apiKey)
      .sort((a, b) => a.priority - b.priority)

    if (preferredProvider) {
      const preferred = providers.find(p => p.name === preferredProvider)
      if (preferred && this.isProviderAvailable(preferred)) {
        return preferred
      }
    }

    for (const provider of providers) {
      if (this.isProviderAvailable(provider)) {
        return provider
      }
    }

    throw new Error('No available AI providers')
  }

  /**
   * Get fallback provider
   */
  private getFallbackProvider(currentProvider: string): AIProvider | null {
    const providers = Object.values(this.config.providers)
      .filter(p => p.enabled && p.apiKey && p.name !== currentProvider)
      .sort((a, b) => a.priority - b.priority)

    return providers.find(p => this.isProviderAvailable(p)) || null
  }

  /**
   * Check if provider is available (not rate limited)
   */
  private isProviderAvailable(provider: AIProvider): boolean {
    const rateLimit = this.rateLimits.get(provider.name)
    if (!rateLimit) return true

    const now = Date.now()
    if (now > rateLimit.resetTime) {
      this.rateLimits.delete(provider.name)
      return true
    }

    return rateLimit.count < 100 // Arbitrary limit
  }

  /**
   * Make HTTP request to AI provider
   */
  private async makeRequest(provider: AIProvider, payload: any): Promise<any> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited
        this.rateLimits.set(provider.name, {
          count: 100,
          resetTime: Date.now() + 60000, // 1 minute
        })
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Calculate cost based on usage
   */
  private calculateCost(provider: string, usage?: any): number {
    if (!usage) return 0

    // Simplified cost calculation - would need real pricing data
    const costPerToken = provider === 'groq' ? 0.0001 : 0.0002
    return (usage.totalTokens || 0) * costPerToken
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): AIProvider[] {
    return Object.values(this.config.providers).filter(p => p.enabled && p.apiKey)
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config }
  }
}

// Default instance
export const aiGateway = new AIGateway()
export default aiGateway