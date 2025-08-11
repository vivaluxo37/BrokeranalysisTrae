import { useEffect, useState } from 'react'
import { brokerDataService } from '@/services/BrokerDataService'
import type { Broker } from '@/types/brokerTypes'

interface UseSafeBrokerDataResult {
  broker: Broker | null
  isLoading: boolean
  error: string | null
  retry: () => void
}

/**
 * Custom hook for safely loading broker data with error handling and fallbacks
 */
export function useSafeBrokerData(brokerId: string | undefined): UseSafeBrokerDataResult {
  const [broker, setBroker] = useState<Broker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBroker = async () => {
    if (!brokerId) {
      setError('No broker ID provided')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Use BrokerDataService for safe loading with fallback
      const brokerData = await brokerDataService.getBrokerWithFallback(brokerId)
      setBroker(brokerData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load broker data'
      setError(errorMessage)
      
      // Still provide fallback broker even on error
      const fallbackBroker = await brokerDataService.getBrokerWithFallback(brokerId || 'unknown')
      setBroker(fallbackBroker)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBroker()
  }, [brokerId])

  const retry = () => {
    loadBroker()
  }

  return {
    broker,
    isLoading,
    error,
    retry
  }
}

/**
 * Hook for safely accessing broker properties with fallbacks
 */
export function useSafeBrokerProperty<K extends keyof Broker>(
  broker: Broker | null | undefined,
  property: K,
  fallback: Broker[K]
): Broker[K] {
  return brokerDataService.getBrokerProperty(broker, property, fallback)
}

/**
 * Hook for loading multiple brokers safely
 */
export function useSafeBrokersData(brokerIds: string[]): {
  brokers: Broker[]
  isLoading: boolean
  errors: string[]
} {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const loadBrokers = async () => {
      setIsLoading(true)
      setErrors([])

      const brokerPromises = brokerIds.map(async (id) => {
        try {
          return await brokerDataService.getBrokerWithFallback(id)
        } catch (error) {
          setErrors(prev => [...prev, `Failed to load broker ${id}: ${error}`])
          return brokerDataService.getBrokerWithFallback(id) // Still return fallback
        }
      })

      const loadedBrokers = await Promise.all(brokerPromises)
      setBrokers(loadedBrokers)
      setIsLoading(false)
    }

    if (brokerIds.length > 0) {
      loadBrokers()
    } else {
      setIsLoading(false)
    }
  }, [brokerIds])

  return {
    brokers,
    isLoading,
    errors
  }
}
