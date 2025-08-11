import { ErrorReportingService } from '../ErrorReportingService'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'test-user-agent',
  },
})

// Mock location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/test',
  },
})

describe('ErrorReportingService', () => {
  let service: ErrorReportingService

  beforeEach(() => {
    service = new ErrorReportingService()
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
  })

  afterEach(() => {
    service.clearErrors()
  })

  describe('error reporting', () => {
    it('reports errors with context', () => {
      const error = new Error('Test error')
      const context = {
        section: 'search',
        component: 'SearchInput',
        feature: 'autocomplete',
      }

      const errorId = service.reportError(error, context)

      expect(errorId).toBeDefined()
      expect(errorId).toMatch(/^error_\d+_[a-z0-9]+$/)

      const stats = service.getStats()
      expect(stats.totalErrors).toBe(1)
      expect(stats.errorsBySection.search).toBe(1)
    })

    it('reports handled errors', () => {
      const errorId = service.reportHandledError('Handled error message', {
        section: 'ai',
        component: 'ChatBot',
      })

      expect(errorId).toBeDefined()

      const stats = service.getStats()
      expect(stats.totalErrors).toBe(1)
      expect(stats.recentErrors[0].error.name).toBe('HandledError')
    })

    it('reports performance issues', () => {
      const errorId = service.reportPerformanceIssue('loadTime', 5000, 3000, {
        section: 'broker-comparison',
        component: 'BrokerTable',
      })

      expect(errorId).toBeDefined()

      const stats = service.getStats()
      expect(stats.totalErrors).toBe(1)
      expect(stats.recentErrors[0].error.name).toBe('PerformanceIssue')
      expect(stats.recentErrors[0].metadata?.metric).toBe('loadTime')
      expect(stats.recentErrors[0].metadata?.value).toBe(5000)
      expect(stats.recentErrors[0].metadata?.threshold).toBe(3000)
    })

    it('determines error severity correctly', () => {
      // Critical error
      const chunkError = new Error('Loading chunk 1 failed')
      chunkError.name = 'ChunkLoadError'
      const criticalId = service.reportError(chunkError, { section: 'test' })

      // High severity error
      const searchError = new Error('Search failed')
      const highId = service.reportError(searchError, { section: 'search' })

      // Medium severity error
      const componentError = new Error('Component error')
      const mediumId = service.reportError(componentError, { 
        section: 'ui', 
        component: 'Button' 
      })

      // Low severity error
      const lowError = new Error('Low priority error')
      const lowId = service.reportError(lowError, { section: 'other' })

      const stats = service.getStats()
      const errors = stats.recentErrors

      const criticalError = errors.find(e => e.id === criticalId)
      const highError = errors.find(e => e.id === highId)
      const mediumError = errors.find(e => e.id === mediumId)
      const lowErrorReport = errors.find(e => e.id === lowId)

      expect(criticalError?.severity).toBe('critical')
      expect(highError?.severity).toBe('high')
      expect(mediumError?.severity).toBe('medium')
      expect(lowErrorReport?.severity).toBe('low')
    })

    it('generates appropriate tags', () => {
      const error = new TypeError('Cannot read property of undefined')
      const errorId = service.reportError(error, {
        section: 'search',
        component: 'SearchInput',
        feature: 'autocomplete',
      })

      const stats = service.getStats()
      const reportedError = stats.recentErrors.find(e => e.id === errorId)

      expect(reportedError?.tags).toContain('search')
      expect(reportedError?.tags).toContain('component:SearchInput')
      expect(reportedError?.tags).toContain('feature:autocomplete')
      expect(reportedError?.tags).toContain('type-error')
    })
  })

  describe('error storage and persistence', () => {
    it('stores errors in localStorage', () => {
      const error = new Error('Test error')
      service.reportError(error, { section: 'test' })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'brokeranalysis_errors',
        expect.any(String)
      )
    })

    it('loads stored errors on initialization', () => {
      const storedErrors = [
        {
          id: 'test-error-1',
          timestamp: new Date().toISOString(),
          error: { name: 'Error', message: 'Stored error' },
          context: { section: 'test', userAgent: 'test', url: 'test' },
          severity: 'low',
          tags: ['test'],
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedErrors))

      const newService = new ErrorReportingService()
      newService.loadStoredErrors()

      const stats = newService.getStats()
      expect(stats.totalErrors).toBe(1)
    })

    it('limits stored errors', () => {
      // Report more errors than the max limit
      for (let i = 0; i < 150; i++) {
        service.reportError(new Error(`Error ${i}`), { section: 'test' })
      }

      const stats = service.getStats()
      expect(stats.totalErrors).toBeLessThanOrEqual(100)
    })
  })

  describe('error statistics', () => {
    beforeEach(() => {
      // Add some test errors
      service.reportError(new Error('Search error 1'), { section: 'search' })
      service.reportError(new Error('Search error 2'), { section: 'search' })
      service.reportError(new Error('AI error'), { section: 'ai' })
      service.reportError(new TypeError('Type error'), { section: 'ui' })
    })

    it('provides comprehensive error statistics', () => {
      const stats = service.getStats()

      expect(stats.totalErrors).toBe(4)
      expect(stats.errorsBySection.search).toBe(2)
      expect(stats.errorsBySection.ai).toBe(1)
      expect(stats.errorsBySection.ui).toBe(1)
      expect(stats.errorsByType.Error).toBe(3)
      expect(stats.errorsByType.TypeError).toBe(1)
      expect(stats.recentErrors).toHaveLength(4)
      expect(stats.topErrors).toHaveLength(4)
    })

    it('gets errors for specific section', () => {
      const searchErrors = service.getErrorsForSection('search')
      expect(searchErrors).toHaveLength(2)
      expect(searchErrors.every(e => e.context.section === 'search')).toBe(true)
    })

    it('checks for recent errors', () => {
      expect(service.hasRecentErrors('search')).toBe(true)
      expect(service.hasRecentErrors('nonexistent')).toBe(false)
    })
  })

  describe('error subscriptions', () => {
    it('notifies subscribers of new errors', () => {
      const mockSubscriber = jest.fn()
      const unsubscribe = service.subscribe(mockSubscriber)

      const error = new Error('Test error')
      service.reportError(error, { section: 'test' })

      expect(mockSubscriber).toHaveBeenCalledTimes(1)
      expect(mockSubscriber).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Test error',
          }),
          context: expect.objectContaining({
            section: 'test',
          }),
        })
      )

      unsubscribe()

      // Should not be called after unsubscribe
      service.reportError(new Error('Another error'), { section: 'test' })
      expect(mockSubscriber).toHaveBeenCalledTimes(1)
    })

    it('handles subscriber errors gracefully', () => {
      const errorSubscriber = jest.fn(() => {
        throw new Error('Subscriber error')
      })
      const normalSubscriber = jest.fn()

      service.subscribe(errorSubscriber)
      service.subscribe(normalSubscriber)

      // Should not throw
      expect(() => {
        service.reportError(new Error('Test error'), { section: 'test' })
      }).not.toThrow()

      expect(normalSubscriber).toHaveBeenCalled()
    })
  })

  describe('error clearing', () => {
    it('clears all errors', () => {
      service.reportError(new Error('Test error'), { section: 'test' })
      expect(service.getStats().totalErrors).toBe(1)

      service.clearErrors()
      expect(service.getStats().totalErrors).toBe(0)
    })
  })
})