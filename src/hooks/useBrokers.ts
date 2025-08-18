import { useQuery, useQueries } from '@tanstack/react-query'
import { BrokerDataService } from '@/services/BrokerDataService'
import { dataIntegrationService } from '@/services/dataIntegrationService'
import type { Broker } from '@/types/brokerTypes'
import type { AssetClass, RegulatorType, TradingPlatform } from '@/enums'

// Create a singleton instance of the broker service
const brokerService = new BrokerDataService()

// Query keys for consistent caching
export const brokerQueryKeys = {
  all: ['brokers'] as const,
  lists: () => [...brokerQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...brokerQueryKeys.lists(), filters] as const,
  details: () => [...brokerQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...brokerQueryKeys.details(), id] as const,
}

/**
 * Hook to fetch a single broker by ID
 */
export function useBroker(id: string) {
  return useQuery({
    queryKey: brokerQueryKeys.detail(id),
    queryFn: () => brokerService.getBroker(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  })
}

/**
 * Hook to fetch multiple brokers by IDs
 */
export function useBrokers(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: brokerQueryKeys.detail(id),
      queryFn: () => brokerService.getBroker(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 30,
    })),
  })
}

/**
 * Hook to fetch all available brokers
 */
export function useAllBrokers() {
  return useQuery({
    queryKey: brokerQueryKeys.lists(),
    queryFn: () => {
      const { allBrokers } = dataIntegrationService.getIntegratedBrokerData()
      return allBrokers
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
  })
}

/**
 * Hook to preload brokers for better performance
 */
export function usePreloadBrokers(ids: string[]) {
  return useQuery({
    queryKey: ['preload-brokers', ids],
    queryFn: () => brokerService.preloadBrokers(ids),
    enabled: ids.length > 0,
    staleTime: Infinity, // Don't refetch preload operations
  })
}

/**
 * Hook to get broker cache statistics
 */
export function useBrokerCacheStats() {
  return useQuery({
    queryKey: ['broker-cache-stats'],
    queryFn: () => brokerService.getCacheStats(),
    refetchInterval: 1000 * 30, // Refresh every 30 seconds
    staleTime: 1000 * 10, // 10 seconds
  })
}

/**
 * Hook for broker search functionality
 */
export function useBrokerSearch(searchTerm: string, filters?: {
  assetClass?: AssetClass
  minRating?: number
  maxMinDeposit?: number
  regulators?: RegulatorType[]
  platforms?: TradingPlatform[]
}) {
  return useQuery({
    queryKey: brokerQueryKeys.list({ search: searchTerm, ...filters }),
    queryFn: () => {
      let results: Broker[]
      
      if (filters && Object.keys(filters).length > 0) {
        // Use the data integration service's search functionality
        results = dataIntegrationService.searchBrokers(filters)
      } else {
        // Get all brokers if no filters
        const { allBrokers } = dataIntegrationService.getIntegratedBrokerData()
        results = allBrokers
      }
      
      // Apply text search if provided
      if (searchTerm) {
        results = results.filter(broker => 
          broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          broker.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      return results
    },
    enabled: true,
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
  })
}

/**
 * Hook to get featured/top brokers
 */
export function useFeaturedBrokers(limit: number = 10) {
  return useQuery({
    queryKey: ['featured-brokers', limit],
    queryFn: () => {
      const { featuredBrokers } = dataIntegrationService.getIntegratedBrokerData()
      return featuredBrokers.slice(0, limit)
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

/**
 * Hook to get top rated brokers
 */
export function useTopRatedBrokers(limit: number = 8) {
  return useQuery({
    queryKey: ['top-rated-brokers', limit],
    queryFn: () => {
      const { topRatedBrokers } = dataIntegrationService.getIntegratedBrokerData()
      return topRatedBrokers.slice(0, limit)
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

/**
 * Hook to get brokers by category
 */
export function useBrokersByCategory(category: string) {
  return useQuery({
    queryKey: ['brokers-by-category', category],
    queryFn: () => {
      const { allBrokers } = dataIntegrationService.getIntegratedBrokerData()
      return allBrokers.filter(broker => broker.category === category)
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to get data statistics
 */
export function useBrokerDataStats() {
  return useQuery({
    queryKey: ['broker-data-stats'],
    queryFn: () => dataIntegrationService.getDataStatistics(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}