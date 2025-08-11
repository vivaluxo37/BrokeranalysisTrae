import { z } from 'zod'
import type { Broker } from '@/types/brokerTypes'
import { errorReportingService } from './ErrorReportingService'

// Zod schema for broker validation
const BrokerSchema = z.object({
  id: z.string().min(1, 'Broker ID is required'),
  name: z.string().min(1, 'Broker name is required'),
  logo: z.string().url('Logo must be a valid URL').or(z.string().length(0)),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  regulators: z.array(z.string()),
  minDeposit: z.number().min(0),
  maxLeverage: z.number().min(1),
  spreadsFrom: z.number().min(0),
  assetClasses: z.array(z.string()),
  platforms: z.array(z.string()),
  category: z.string(),
  featured: z.boolean(),
  trustScore: z.number().min(0).max(10).optional(),
  isRegulated: z.boolean().optional(),
  details: z.object({
    foundedYear: z.number().optional(),
    headquarters: z.string().optional(),
    clientCount: z.number().optional(),
    assetsUnderManagement: z.number().optional(),
    description: z.string().optional(),
    website: z.string().url().optional(),
    demoAccount: z.boolean().optional(),
    islamicAccount: z.boolean().optional(),
    languages: z.array(z.string()).optional(),
    operatingCountries: z.array(z.string()).optional(),
  }).optional(),
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    liveChat: z.boolean().optional(),
    supportHours: z.string().optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
      postalCode: z.string().optional(),
    }).optional(),
  }).optional(),
  regulation: z.array(z.object({
    authority: z.string(),
    licenseNumber: z.string().optional(),
    status: z.enum(['active', 'pending', 'suspended', 'revoked']),
    issuedDate: z.string().optional(),
    expiryDate: z.string().optional(),
    jurisdiction: z.string().optional(),
    verificationUrl: z.string().url().optional(),
  })).optional(),
  features: z.object({
    education: z.object({
      webinars: z.boolean(),
      tutorials: z.boolean(),
      eBooks: z.boolean(),
      marketAnalysis: z.boolean(),
    }).optional(),
    research: z.object({
      marketNews: z.boolean(),
      technicalAnalysis: z.boolean(),
      fundamentalAnalysis: z.boolean(),
      tradingSignals: z.boolean(),
    }).optional(),
    trading: z.object({
      copyTrading: z.boolean(),
      algorithmicTrading: z.boolean(),
      socialTrading: z.boolean(),
      mobileTrading: z.boolean(),
      apiAccess: z.boolean(),
    }).optional(),
    support: z.object({
      multiLanguage: z.boolean(),
      personalAccountManager: z.boolean(),
      prioritySupport: z.boolean(),
      phoneSupport: z.boolean(),
    }).optional(),
  }).optional(),
  costs: z.object({
    spreads: z.object({
      type: z.enum(['fixed', 'variable']),
      typical: z.number(),
      minimum: z.number(),
      currency: z.string(),
    }).optional(),
    commissions: z.object({
      forex: z.number(),
      stocks: z.number(),
      crypto: z.number(),
      cfd: z.number(),
      currency: z.string(),
    }).optional(),
    swapRates: z.object({
      long: z.number(),
      short: z.number(),
      currency: z.string(),
    }).optional(),
    fees: z.object({
      deposit: z.number(),
      withdrawal: z.number(),
      inactivity: z.number(),
      currency: z.string(),
    }).optional(),
  }).optional(),
  accountTypes: z.array(z.string()).optional(),
})

/**
 * Service for safely loading and validating broker data
 * Provides fallback mechanisms and error handling for broker data operations
 */
export class BrokerDataService {
  private brokerCache = new Map<string, Broker>()
  private failedBrokers = new Set<string>()
  private retryAttempts = new Map<string, number>()
  private maxRetries = 3

  /**
   * Get broker data by ID with validation and error handling
   */
  async getBroker(id: string): Promise<Broker | null> {
    try {
      // Check cache first
      if (this.brokerCache.has(id)) {
        return this.brokerCache.get(id)!
      }

      // Check if broker has failed too many times
      if (this.failedBrokers.has(id)) {
        return null
      }

      // Attempt to fetch broker data
      const brokerData = await this.fetchBrokerData(id)
      
      if (!brokerData) {
        this.handleBrokerNotFound(id)
        return null
      }

      // Validate broker data
      const validatedBroker = this.validateBrokerData(brokerData)
      
      if (!validatedBroker) {
        this.handleInvalidBrokerData(id, brokerData)
        return null
      }

      // Cache successful result
      this.brokerCache.set(id, validatedBroker)
      this.retryAttempts.delete(id)
      
      return validatedBroker

    } catch (error) {
      this.handleBrokerError(id, error as Error)
      return null
    }
  }

  /**
   * Get broker with fallback data if original fails
   */
  async getBrokerWithFallback(id: string): Promise<Broker> {
    const broker = await this.getBroker(id)
    
    if (broker) {
      return broker
    }

    // Return fallback broker data
    return this.createFallbackBroker(id)
  }

  /**
   * Validate broker data using Zod schema
   */
  validateBrokerData(data: unknown): Broker | null {
    try {
      const result = BrokerSchema.safeParse(data)
      
      if (result.success) {
        return result.data as Broker
      } else {
        errorReportingService.reportHandledError(
          `Broker data validation failed: ${result.error.message}`,
          {
            section: 'broker-data-service',
            component: 'validateBrokerData',
            metadata: {
              validationErrors: result.error.errors,
              rawData: data,
            },
          }
        )
        return null
      }
    } catch (error) {
      errorReportingService.reportError(error as Error, {
        section: 'broker-data-service',
        component: 'validateBrokerData',
        metadata: { rawData: data },
      })
      return null
    }
  }

  /**
   * Check if broker data exists and is valid
   */
  isBrokerValid(broker: unknown): broker is Broker {
    if (!broker || typeof broker !== 'object') {
      return false
    }

    const b = broker as any
    return (
      typeof b.id === 'string' &&
      typeof b.name === 'string' &&
      typeof b.rating === 'number' &&
      Array.isArray(b.regulators) &&
      typeof b.minDeposit === 'number' &&
      typeof b.maxLeverage === 'number'
    )
  }

  /**
   * Get safe broker property with fallback
   */
  getBrokerProperty<K extends keyof Broker>(
    broker: Broker | null | undefined,
    property: K,
    fallback: Broker[K]
  ): Broker[K] {
    try {
      if (!broker || !this.isBrokerValid(broker)) {
        return fallback
      }

      const value = broker[property]
      return value !== undefined && value !== null ? value : fallback
    } catch (error) {
      errorReportingService.reportHandledError(
        `Error accessing broker property: ${String(property)}`,
        {
          section: 'broker-data-service',
          component: 'getBrokerProperty',
          metadata: { property, brokerId: broker?.id },
        }
      )
      return fallback
    }
  }

  /**
   * Clear broker cache
   */
  clearCache(): void {
    this.brokerCache.clear()
    this.failedBrokers.clear()
    this.retryAttempts.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedBrokers: this.brokerCache.size,
      failedBrokers: this.failedBrokers.size,
      retryAttempts: Array.from(this.retryAttempts.entries()),
    }
  }

  /**
   * Preload broker data for better performance
   */
  async preloadBrokers(brokerIds: string[]): Promise<void> {
    const promises = brokerIds.map(id => this.getBroker(id))
    await Promise.allSettled(promises)
  }

  /**
   * Fetch broker data from API or data source
   */
  private async fetchBrokerData(id: string): Promise<unknown> {
    // In a real implementation, this would fetch from an API
    // For now, we'll simulate with mock data or return null
    
    try {
      // Try to load from extracted brokers data
      const response = await import('@/data/extractedBrokers.json')
      const brokers = response.default || response
      
      if (Array.isArray(brokers)) {
        return brokers.find((broker: any) => broker.id === id)
      }
      
      return null
    } catch (error) {
      // If data file doesn't exist or can't be loaded, return null
      return null
    }
  }

  /**
   * Handle broker not found scenario
   */
  private handleBrokerNotFound(id: string): void {
    const attempts = this.retryAttempts.get(id) || 0
    
    if (attempts >= this.maxRetries) {
      this.failedBrokers.add(id)
      this.retryAttempts.delete(id)
    } else {
      this.retryAttempts.set(id, attempts + 1)
    }

    errorReportingService.reportHandledError(
      `Broker not found: ${id}`,
      {
        section: 'broker-data-service',
        component: 'handleBrokerNotFound',
        metadata: { brokerId: id, attempts },
      }
    )
  }

  /**
   * Handle invalid broker data
   */
  private handleInvalidBrokerData(id: string, data: unknown): void {
    errorReportingService.reportHandledError(
      `Invalid broker data for: ${id}`,
      {
        section: 'broker-data-service',
        component: 'handleInvalidBrokerData',
        metadata: { brokerId: id, rawData: data },
      }
    )
  }

  /**
   * Handle broker loading errors
   */
  private handleBrokerError(id: string, error: Error): void {
    const attempts = this.retryAttempts.get(id) || 0
    
    if (attempts >= this.maxRetries) {
      this.failedBrokers.add(id)
      this.retryAttempts.delete(id)
    } else {
      this.retryAttempts.set(id, attempts + 1)
    }

    errorReportingService.reportError(error, {
      section: 'broker-data-service',
      component: 'handleBrokerError',
      metadata: { brokerId: id, attempts },
    })
  }

  /**
   * Create fallback broker data when original fails
   */
  private createFallbackBroker(id: string): Broker {
    return {
      id,
      name: `Broker ${id}`,
      logo: '/assets/icons/broker-placeholder.svg',
      rating: 0,
      reviewCount: 0,
      regulators: [],
      minDeposit: 0,
      maxLeverage: 1,
      spreadsFrom: 0,
      assetClasses: [],
      platforms: [],
      category: 'unknown',
      featured: false,
      trustScore: 0,
      isRegulated: false,
      details: {
        description: 'Broker information is currently unavailable. Please try again later or contact support.',
        website: '#',
        demoAccount: false,
        islamicAccount: false,
        languages: ['English'],
        operatingCountries: [],
      },
    }
  }
}

// Create singleton instance
export const brokerDataService = new BrokerDataService()

// Development helper
if (process.env.NODE_ENV === 'development') {
  ;(window as any).brokerDataService = brokerDataService
}