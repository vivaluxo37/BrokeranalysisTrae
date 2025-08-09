import React, { createContext, useContext, ReactNode } from 'react'
import { authService } from '@/services/authService'
import { SearchService } from '@/services/search/SearchService'
import { AIGateway } from '@/services/ai/AIGateway'
import { profileService } from '@/services/profileService'
import { ExternalAPIService } from '@/services/external/ExternalAPIService'
import { DataSyncService } from '@/services/sync/DataSyncService'
import { CacheService } from '@/services/sync/CacheService'
import { useAuth } from '@/hooks/useAuth'
import { useSearch } from '@/hooks/useSearch'
import { useProfile } from '@/hooks/useProfile'
import type { User } from '@/types/auth'
import type { SearchFilters, SearchResult, SavedSearch } from '@/types/search'
import type { Broker } from '@/types/broker'

/**
 * Feature flags for gradual rollout of homepage integrations
 */
export interface FeatureFlags {
  homepageIntegration: {
    searchIntegration: boolean
    aiIntegration: boolean
    authIntegration: boolean
    profileIntegration: boolean
    realtimeData: boolean
    personalization: boolean
  }
}

/**
 * API configuration for external services
 */
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
}

/**
 * AI configuration for homepage features
 */
export interface AIConfig {
  enabled: boolean
  providers: {
    groq: { enabled: boolean; priority: number }
    openrouter: { enabled: boolean; priority: number }
  }
  features: {
    chatbot: boolean
    recommendations: boolean
    summarization: boolean
  }
}

/**
 * Homepage state interface
 */
export interface HomepageState {
  user: User | null
  searchState: {
    query: string
    filters: SearchFilters
    results: SearchResult[]
    savedSearches: SavedSearch[]
    isLoading: boolean
  }
  aiState: {
    isOpen: boolean
    messages: Array<{
      id: string
      role: 'user' | 'assistant'
      content: string
      timestamp: Date
    }>
    isLoading: boolean
    context: 'hero' | 'comparison' | 'testimonials' | 'general'
  }
  brokerState: {
    featured: Broker[]
    personalized: Broker[]
    comparison: Broker[]
    isLoading: boolean
  }
  uiState: {
    activeSection: string
    modalsOpen: Record<string, boolean>
    notifications: Array<{
      id: string
      type: 'error' | 'warning' | 'info' | 'success'
      message: string
      timestamp: Date
    }>
  }
}

/**
 * Service collection interface
 */
export interface HomepageServices {
  authService: typeof authService
  searchService: SearchService
  aiGateway: AIGateway
  profileService: typeof profileService
  externalAPIService: ExternalAPIService
  dataSyncService: DataSyncService
  cacheService: CacheService
}

/**
 * Hook collection interface
 */
export interface HomepageHooks {
  useAuth: typeof useAuth
  useSearch: typeof useSearch
  useProfile: typeof useProfile
}

/**
 * Complete homepage integration context
 */
export interface HomepageIntegrationContextType {
  services: HomepageServices
  hooks: HomepageHooks
  config: {
    features: FeatureFlags
    apiEndpoints: ApiConfig
    aiConfig: AIConfig
  }
  state: HomepageState
  actions: {
    // Search actions
    performSearch: (query: string, filters?: SearchFilters) => Promise<void>
    saveSearch: (search: SavedSearch) => Promise<void>
    clearSearch: () => void
    
    // AI actions
    openAIChat: (context?: string) => void
    closeAIChat: () => void
    sendAIMessage: (message: string) => Promise<void>
    
    // UI actions
    setActiveSection: (section: string) => void
    openModal: (modalId: string) => void
    closeModal: (modalId: string) => void
    addNotification: (notification: Omit<HomepageState['uiState']['notifications'][0], 'id' | 'timestamp'>) => void
    removeNotification: (id: string) => void
    
    // Broker actions
    loadFeaturedBrokers: () => Promise<void>
    loadPersonalizedBrokers: () => Promise<void>
    addToComparison: (broker: Broker) => void
    removeFromComparison: (brokerId: string) => void
  }
}

// Create the context
const HomepageIntegrationContext = createContext<HomepageIntegrationContextType | undefined>(undefined)

/**
 * Hook to use the homepage integration context
 */
export const useHomepageIntegration = (): HomepageIntegrationContextType => {
  const context = useContext(HomepageIntegrationContext)
  if (!context) {
    throw new Error('useHomepageIntegration must be used within a HomepageIntegrationProvider')
  }
  return context
}

/**
 * Default feature flags - can be overridden via props
 */
const defaultFeatureFlags: FeatureFlags = {
  homepageIntegration: {
    searchIntegration: true,
    aiIntegration: true,
    authIntegration: true,
    profileIntegration: true,
    realtimeData: true,
    personalization: true,
  },
}

/**
 * Default API configuration
 */
const defaultApiConfig: ApiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  retryAttempts: 3,
}

/**
 * Default AI configuration
 */
const defaultAIConfig: AIConfig = {
  enabled: true,
  providers: {
    groq: { enabled: true, priority: 1 },
    openrouter: { enabled: true, priority: 2 },
  },
  features: {
    chatbot: true,
    recommendations: true,
    summarization: true,
  },
}

/**
 * Props for the HomepageIntegrationProvider
 */
export interface HomepageIntegrationProviderProps {
  children: ReactNode
  features?: Partial<FeatureFlags>
  apiConfig?: Partial<ApiConfig>
  aiConfig?: Partial<AIConfig>
}

export { HomepageIntegrationContext, defaultFeatureFlags, defaultApiConfig, defaultAIConfig }