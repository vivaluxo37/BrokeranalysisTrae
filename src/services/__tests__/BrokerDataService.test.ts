import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrokerDataService, brokerDataService } from '../BrokerDataService'
import { errorReportingService } from '../ErrorReportingService'
import type { Broker } from '@/types/brokerTypes'

// Mock the error reporting service
vi.mock('../ErrorReportingService', () => ({
  errorReportingService: {
    reportError: vi.fn(),
    reportHandledError: vi.fn(),
  },
}))

// Mock the data import
vi.mock('@/data/extractedBrokers.json', () => ({
  default: [
    {
      id: 'test-broker-1',
      name: 'Test Broker 1',
      logo: 'https://example.com/logo1.png',
      rating: 4.5,
      reviewCount: 100,
      regulators: ['FCA', 'CySEC'],
      minDeposit: 100,
      maxLeverage: 500,
      spreadsFrom: 0.1,
      assetClasses: ['forex', 'stocks'],
      platforms: ['MT4', 'MT5'],
      category: 'forex',
      featured: true,
      trustScore: 8.5,
      isRegulated: true,
    },
    {
      id: 'invalid-broker',
      name: '', // Invalid: empty name
      logo: 'invalid-url', // Invalid: not a URL
      rating: -1, // Invalid: negative rating
      reviewCount: 50,
      regulators: ['FCA'],
      minDeposit: 100,
      maxLeverage: 500,
      spreadsFrom: 0.1,
      assetClasses: ['forex'],
      platforms: ['MT4'],
      category: 'forex',
      featured: false,
    },
  ],
}))

describe('BrokerDataService', () => {
  let service: BrokerDataService

  beforeEach(() => {
    service = new BrokerDataService()
    vi.clearAllMocks()
  })

  afterEach(() => {
    service.clearCache()
  })

  describe('getBroker', () => {
    it('returns valid broker data when found', async () => {
      const broker = await service.getBroker('test-broker-1')

      expect(broker).toBeDefined()
      expect(broker?.id).toBe('test-broker-1')
      expect(broker?.name).toBe('Test Broker 1')
      expect(broker?.rating).toBe(4.5)
    })

    it('returns null when broker is not found', async () => {
      const broker = await service.getBroker('non-existent-broker')

      expect(broker).toBeNull()
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        'Broker not found: non-existent-broker',
        expect.objectContaining({
          section: 'broker-data-service',
          component: 'handleBrokerNotFound',
        })
      )
    })

    it('returns null for invalid broker data', async () => {
      const broker = await service.getBroker('invalid-broker')

      expect(broker).toBeNull()
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        expect.stringContaining('Broker data validation failed'),
        expect.objectContaining({
          section: 'broker-data-service',
          component: 'validateBrokerData',
        })
      )
    })

    it('caches successful broker requests', async () => {
      const broker1 = await service.getBroker('test-broker-1')
      const broker2 = await service.getBroker('test-broker-1')

      expect(broker1).toBe(broker2) // Same object reference from cache
    })

    it('handles errors gracefully', async () => {
      // Mock import to throw an error
      vi.doMock('@/data/extractedBrokers.json', () => {
        throw new Error('Failed to load data')
      })

      const broker = await service.getBroker('test-broker-1')

      expect(broker).toBeNull()
    })
  })

  describe('getBrokerWithFallback', () => {
    it('returns actual broker when available', async () => {
      const broker = await service.getBrokerWithFallback('test-broker-1')

      expect(broker.id).toBe('test-broker-1')
      expect(broker.name).toBe('Test Broker 1')
    })

    it('returns fallback broker when original fails', async () => {
      const broker = await service.getBrokerWithFallback('non-existent-broker')

      expect(broker.id).toBe('non-existent-broker')
      expect(broker.name).toBe('Broker non-existent-broker')
      expect(broker.rating).toBe(0)
      expect(broker.logo).toBe('/assets/icons/broker-placeholder.svg')
    })

    it('fallback broker has required properties', async () => {
      const broker = await service.getBrokerWithFallback('fallback-test')

      expect(broker).toMatchObject({
        id: 'fallback-test',
        name: 'Broker fallback-test',
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
      })
    })
  })

  describe('validateBrokerData', () => {
    it('validates correct broker data', () => {
      const validBroker = {
        id: 'test-broker',
        name: 'Test Broker',
        logo: 'https://example.com/logo.png',
        rating: 4.0,
        reviewCount: 50,
        regulators: ['FCA'],
        minDeposit: 100,
        maxLeverage: 500,
        spreadsFrom: 0.1,
        assetClasses: ['forex'],
        platforms: ['MT4'],
        category: 'forex',
        featured: false,
      }

      const result = service.validateBrokerData(validBroker)

      expect(result).toEqual(validBroker)
    })

    it('rejects invalid broker data', () => {
      const invalidBroker = {
        id: '', // Invalid: empty ID
        name: 'Test Broker',
        rating: 6, // Invalid: rating > 5
        reviewCount: -1, // Invalid: negative count
      }

      const result = service.validateBrokerData(invalidBroker)

      expect(result).toBeNull()
      expect(errorReportingService.reportHandledError).toHaveBeenCalled()
    })

    it('handles validation errors gracefully', () => {
      const result = service.validateBrokerData(null)

      expect(result).toBeNull()
    })
  })

  describe('isBrokerValid', () => {
    it('returns true for valid broker objects', () => {
      const validBroker = {
        id: 'test',
        name: 'Test Broker',
        rating: 4.0,
        regulators: ['FCA'],
        minDeposit: 100,
        maxLeverage: 500,
      }

      expect(service.isBrokerValid(validBroker)).toBe(true)
    })

    it('returns false for invalid broker objects', () => {
      expect(service.isBrokerValid(null)).toBe(false)
      expect(service.isBrokerValid(undefined)).toBe(false)
      expect(service.isBrokerValid({})).toBe(false)
      expect(service.isBrokerValid({ id: 'test' })).toBe(false) // Missing required fields
    })
  })

  describe('getBrokerProperty', () => {
    const validBroker: Broker = {
      id: 'test-broker',
      name: 'Test Broker',
      logo: 'https://example.com/logo.png',
      rating: 4.0,
      reviewCount: 50,
      regulators: ['FCA'],
      minDeposit: 100,
      maxLeverage: 500,
      spreadsFrom: 0.1,
      assetClasses: ['forex'],
      platforms: ['MT4'],
      category: 'forex',
      featured: false,
    }

    it('returns actual property value when broker is valid', () => {
      const name = service.getBrokerProperty(validBroker, 'name', 'Fallback Name')
      expect(name).toBe('Test Broker')
    })

    it('returns fallback when broker is null', () => {
      const name = service.getBrokerProperty(null, 'name', 'Fallback Name')
      expect(name).toBe('Fallback Name')
    })

    it('returns fallback when broker is undefined', () => {
      const name = service.getBrokerProperty(undefined, 'name', 'Fallback Name')
      expect(name).toBe('Fallback Name')
    })

    it('returns fallback when property is undefined', () => {
      const brokerWithUndefined = { ...validBroker, trustScore: undefined }
      const trustScore = service.getBrokerProperty(brokerWithUndefined, 'trustScore', 5.0)
      expect(trustScore).toBe(5.0)
    })

    it('handles errors when accessing properties', () => {
      // Create a broker object that throws when accessing properties
      const problematicBroker = new Proxy(validBroker, {
        get(target, prop) {
          if (prop === 'name') {
            throw new Error('Property access error')
          }
          return target[prop as keyof Broker]
        }
      })

      const name = service.getBrokerProperty(problematicBroker, 'name', 'Fallback Name')
      expect(name).toBe('Fallback Name')
      expect(errorReportingService.reportHandledError).toHaveBeenCalledWith(
        'Error accessing broker property: name',
        expect.objectContaining({
          section: 'broker-data-service',
          component: 'getBrokerProperty',
        })
      )
    })
  })

  describe('cache management', () => {
    it('clears cache correctly', async () => {
      await service.getBroker('test-broker-1')
      
      let stats = service.getCacheStats()
      expect(stats.cachedBrokers).toBe(1)

      service.clearCache()
      
      stats = service.getCacheStats()
      expect(stats.cachedBrokers).toBe(0)
      expect(stats.failedBrokers).toBe(0)
    })

    it('tracks cache statistics', async () => {
      await service.getBroker('test-broker-1')
      await service.getBroker('non-existent-broker')

      const stats = service.getCacheStats()
      expect(stats.cachedBrokers).toBe(1)
      expect(stats.failedBrokers).toBe(0) // Only marked as failed after max retries
    })
  })

  describe('preloadBrokers', () => {
    it('preloads multiple brokers', async () => {
      await service.preloadBrokers(['test-broker-1', 'non-existent-broker'])

      const stats = service.getCacheStats()
      expect(stats.cachedBrokers).toBe(1) // Only valid broker is cached
    })

    it('handles errors during preloading', async () => {
      // Should not throw even if some brokers fail to load
      await expect(service.preloadBrokers(['test-broker-1', 'invalid-broker', 'non-existent-broker']))
        .resolves.toBeUndefined()
    })
  })

  describe('retry mechanism', () => {
    it('tracks retry attempts for failed brokers', async () => {
      // First attempt
      await service.getBroker('non-existent-broker')
      
      let stats = service.getCacheStats()
      expect(stats.retryAttempts).toHaveLength(1)
      expect(stats.retryAttempts[0][0]).toBe('non-existent-broker')
      expect(stats.retryAttempts[0][1]).toBe(1)

      // Second attempt
      await service.getBroker('non-existent-broker')
      
      stats = service.getCacheStats()
      expect(stats.retryAttempts[0][1]).toBe(2)
    })

    it('marks broker as failed after max retries', async () => {
      // Attempt multiple times to exceed max retries
      for (let i = 0; i < 4; i++) {
        await service.getBroker('non-existent-broker')
      }

      const stats = service.getCacheStats()
      expect(stats.failedBrokers).toBe(1)
      expect(stats.retryAttempts).toHaveLength(0) // Cleared after marking as failed
    })
  })
})

describe('brokerDataService singleton', () => {
  it('exports a singleton instance', () => {
    expect(brokerDataService).toBeInstanceOf(BrokerDataService)
  })

  it('maintains state across calls', async () => {
    await brokerDataService.getBroker('test-broker-1')
    
    const stats = brokerDataService.getCacheStats()
    expect(stats.cachedBrokers).toBe(1)
  })
})
