import type { SearchFilters, SearchResult, SavedSearch } from '@/types/search'
import type { Broker } from '@/types/brokerTypes'

/**
 * Search configuration interface
 */
export interface SearchConfig {
  baseUrl: string
  timeout: number
  maxResults: number
  enableFuzzySearch: boolean
  enableFilters: boolean
}

/**
 * Search service for broker discovery and filtering
 */
export class SearchService {
  private config: SearchConfig
  private cache: Map<string, SearchResult[]> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  constructor(config: Partial<SearchConfig> = {}) {
    this.config = {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
      timeout: 10000,
      maxResults: 50,
      enableFuzzySearch: true,
      enableFilters: true,
      ...config,
    }
  }

  /**
   * Perform a search for brokers
   */
  async search(
    query: string,
    filters?: SearchFilters,
    options?: {
      useCache?: boolean
      signal?: AbortSignal
    }
  ): Promise<SearchResult[]> {
    const cacheKey = this.generateCacheKey(query, filters)
    
    // Check cache first
    if (options?.useCache !== false && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!
      return cached
    }

    try {
      const searchParams = new URLSearchParams()
      searchParams.append('q', query)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, String(v)))
            } else {
              searchParams.append(key, String(value))
            }
          }
        })
      }

      const response = await fetch(
        `${this.config.baseUrl}/api/search?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: options?.signal,
        }
      )

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()
      const results: SearchResult[] = data.results || []

      // Cache the results
      this.cache.set(cacheKey, results)
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

      return results
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(
    partialQuery: string,
    limit: number = 10
  ): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/search/suggestions?q=${encodeURIComponent(partialQuery)}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error(`Suggestions failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.suggestions || []
    } catch (error) {
      console.error('Suggestions error:', error)
      return []
    }
  }

  /**
   * Save a search for later use
   */
  async saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/search/saved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(search),
      })

      if (!response.ok) {
        throw new Error(`Save search failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Save search error:', error)
      throw error
    }
  }

  /**
   * Get saved searches for a user
   */
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/search/saved?userId=${userId}`
      )

      if (!response.ok) {
        throw new Error(`Get saved searches failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.searches || []
    } catch (error) {
      console.error('Get saved searches error:', error)
      return []
    }
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/search/saved/${searchId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(`Delete saved search failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Delete saved search error:', error)
      throw error
    }
  }

  /**
   * Get popular search terms
   */
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/search/popular?limit=${limit}`
      )

      if (!response.ok) {
        throw new Error(`Get popular searches failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.searches || []
    } catch (error) {
      console.error('Get popular searches error:', error)
      return []
    }
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Generate cache key for search results
   */
  private generateCacheKey(query: string, filters?: SearchFilters): string {
    const filterString = filters ? JSON.stringify(filters) : ''
    return `${query}:${filterString}`
  }

  /**
   * Update search configuration
   */
  updateConfig(newConfig: Partial<SearchConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): SearchConfig {
    return { ...this.config }
  }
}

// Default instance
export const searchService = new SearchService()
export default searchService