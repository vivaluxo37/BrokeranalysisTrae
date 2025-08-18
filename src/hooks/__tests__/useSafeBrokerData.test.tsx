import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSafeBrokerData, useSafeBrokerProperty, useSafeBrokersData } from '../useSafeBrokerData'
import { brokerDataService } from '@/services/BrokerDataService'
import type { Broker } from '@/types/brokerTypes'

// Mock the BrokerDataService
vi.mock('@/services/BrokerDataService', () => ({
  brokerDataService: {
    getBrokerWithFallback: vi.fn(),
    getBrokerProperty: vi.fn(),
  },
}))

const mockBroker: Broker = {
  id: 'test-broker',
  name: 'Test Broker',
  logo: 'https://example.com/logo.png',
  rating: 4.5,
  reviewCount: 100,
  regulators: ['FCA'],
  minDeposit: 100,
  maxLeverage: 500,
  spreadsFrom: 0.1,
  assetClasses: ['forex'],
  platforms: ['MT4'],
  category: 'ecn',
  featured: true,
  trustScore: 8.5,
  isRegulated: true,
}

describe('useSafeBrokerData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads broker data successfully', async () => {
    vi.mocked(brokerDataService.getBrokerWithFallback).mockResolvedValue(mockBroker)

    const { result } = renderHook(() => useSafeBrokerData('test-broker'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.broker).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.broker).toEqual(mockBroker)
    expect(result.current.error).toBeNull()
    expect(brokerDataService.getBrokerWithFallback).toHaveBeenCalledWith('test-broker')
  })

  it('handles missing broker ID', async () => {
    const { result } = renderHook(() => useSafeBrokerData(undefined))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.broker).toBeNull()
    expect(result.current.error).toBe('No broker ID provided')
    expect(brokerDataService.getBrokerWithFallback).not.toHaveBeenCalled()
  })

  it('handles broker loading errors with fallback', async () => {
    const fallbackBroker = { ...mockBroker, name: 'Fallback Broker' }
    vi.mocked(brokerDataService.getBrokerWithFallback)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(fallbackBroker)

    const { result } = renderHook(() => useSafeBrokerData('test-broker'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.broker).toEqual(fallbackBroker)
    expect(result.current.error).toBe('Network error')
    expect(brokerDataService.getBrokerWithFallback).toHaveBeenCalledTimes(2)
  })

  it('provides retry functionality', async () => {
    vi.mocked(brokerDataService.getBrokerWithFallback)
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce(mockBroker)
      .mockResolvedValueOnce(mockBroker)

    const { result } = renderHook(() => useSafeBrokerData('test-broker'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('First attempt failed')

    // Retry
    result.current.retry()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.broker).toEqual(mockBroker)
    expect(result.current.error).toBeNull()
  })

  it('updates when broker ID changes', async () => {
    const broker1 = { ...mockBroker, id: 'broker-1', name: 'Broker 1' }
    const broker2 = { ...mockBroker, id: 'broker-2', name: 'Broker 2' }

    vi.mocked(brokerDataService.getBrokerWithFallback)
      .mockResolvedValueOnce(broker1)
      .mockResolvedValueOnce(broker2)

    const { result, rerender } = renderHook(
      ({ brokerId }) => useSafeBrokerData(brokerId),
      { initialProps: { brokerId: 'broker-1' } }
    )

    await waitFor(() => {
      expect(result.current.broker).toEqual(broker1)
    })

    rerender({ brokerId: 'broker-2' })

    await waitFor(() => {
      expect(result.current.broker).toEqual(broker2)
    })

    expect(brokerDataService.getBrokerWithFallback).toHaveBeenCalledWith('broker-1')
    expect(brokerDataService.getBrokerWithFallback).toHaveBeenCalledWith('broker-2')
  })
})

describe('useSafeBrokerProperty', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns property value from service', () => {
    vi.mocked(brokerDataService.getBrokerProperty).mockReturnValue('Test Broker')

    const { result } = renderHook(() => 
      useSafeBrokerProperty(mockBroker, 'name', 'Fallback Name')
    )

    expect(result.current).toBe('Test Broker')
    expect(brokerDataService.getBrokerProperty).toHaveBeenCalledWith(
      mockBroker,
      'name',
      'Fallback Name'
    )
  })

  it('handles null broker', () => {
    vi.mocked(brokerDataService.getBrokerProperty).mockReturnValue('Fallback Name')

    const { result } = renderHook(() => 
      useSafeBrokerProperty(null, 'name', 'Fallback Name')
    )

    expect(result.current).toBe('Fallback Name')
    expect(brokerDataService.getBrokerProperty).toHaveBeenCalledWith(
      null,
      'name',
      'Fallback Name'
    )
  })
})

describe('useSafeBrokersData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads multiple brokers successfully', async () => {
    const broker1 = { ...mockBroker, id: 'broker-1', name: 'Broker 1' }
    const broker2 = { ...mockBroker, id: 'broker-2', name: 'Broker 2' }

    vi.mocked(brokerDataService.getBrokerWithFallback)
      .mockResolvedValueOnce(broker1)
      .mockResolvedValueOnce(broker2)

    const { result } = renderHook(() => useSafeBrokersData(['broker-1', 'broker-2']))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.brokers).toEqual([])
    expect(result.current.errors).toEqual([])

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.brokers).toEqual([broker1, broker2])
    expect(result.current.errors).toEqual([])
  })

  it('handles errors while still providing fallback brokers', async () => {
    const broker1 = { ...mockBroker, id: 'broker-1', name: 'Broker 1' }
    const fallbackBroker = { ...mockBroker, id: 'broker-2', name: 'Fallback Broker 2' }

    vi.mocked(brokerDataService.getBrokerWithFallback)
      .mockResolvedValueOnce(broker1)
      .mockRejectedValueOnce(new Error('Failed to load broker-2'))
      .mockResolvedValueOnce(fallbackBroker)

    const { result } = renderHook(() => useSafeBrokersData(['broker-1', 'broker-2']))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.brokers).toEqual([broker1, fallbackBroker])
    expect(result.current.errors).toEqual(['Failed to load broker broker-2: Error: Failed to load broker-2'])
  })

  it('handles empty broker IDs array', async () => {
    const { result } = renderHook(() => useSafeBrokersData([]))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.brokers).toEqual([])
    expect(result.current.errors).toEqual([])
    expect(brokerDataService.getBrokerWithFallback).not.toHaveBeenCalled()
  })

  it('updates when broker IDs change', async () => {
    const broker1 = { ...mockBroker, id: 'broker-1', name: 'Broker 1' }
    const broker2 = { ...mockBroker, id: 'broker-2', name: 'Broker 2' }
    const broker3 = { ...mockBroker, id: 'broker-3', name: 'Broker 3' }

    vi.mocked(brokerDataService.getBrokerWithFallback)
      .mockResolvedValueOnce(broker1)
      .mockResolvedValueOnce(broker2)
      .mockResolvedValueOnce(broker3)

    const { result, rerender } = renderHook(
      ({ brokerIds }) => useSafeBrokersData(brokerIds),
      { initialProps: { brokerIds: ['broker-1', 'broker-2'] } }
    )

    await waitFor(() => {
      expect(result.current.brokers).toEqual([broker1, broker2])
    })

    rerender({ brokerIds: ['broker-3'] })

    await waitFor(() => {
      expect(result.current.brokers).toEqual([broker3])
    })
  })
})
