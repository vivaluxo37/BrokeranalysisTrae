import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  HomepageHooks,
  HomepageIntegrationContext,
  HomepageIntegrationContextType,
  HomepageIntegrationProviderProps,
  HomepageServices,
  HomepageState,
  defaultAIConfig,
  defaultApiConfig,
  defaultFeatureFlags,
} from './HomepageIntegrationContext'
import {
  useAIChatState,
  useBrokerState,
  useSearchState,
  useUIState,
  useUserPreferences,
} from '@/hooks/useHomepageState'
import {
  STATE_SYNC_ACTIONS,
  useStateSync,
  useStateSyncEmitter,
} from '@/services/StateSynchronizationService'
import { authService } from '@/services/authService'
import { SearchService } from '@/services/search/SearchService'
import { AIGateway } from '@/services/ai/AIGateway'
import { profileService } from '@/services/profileService'
import { ExternalAPIService } from '@/services/external'
import { DataSyncService } from '@/services/sync/DataSyncService'
import { CacheService } from '@/services/sync/CacheService'
import { useAuth } from '@/hooks/useAuth'
import { useSearch } from '@/hooks/useSearch'
import { useProfile } from '@/hooks/useProfile'
import type { SavedSearch, SearchFilters } from '@/types/search'
import type { Broker } from '@/types/brokerTypes'

/**
 * Homepage Integration Provider Component
 * Provides all necessary services, hooks, and state management for homepage integration
 */
export const HomepageIntegrationProvider: React.FC<HomepageIntegrationProviderProps> = ({
  children,
  features = {},
  apiConfig = {},
  aiConfig = {},
}) => {
  // Merge provided configs with defaults
  const mergedFeatures = useMemo(() => ({
    ...defaultFeatureFlags,
    homepageIntegration: {
      ...defaultFeatureFlags.homepageIntegration,
      ...features.homepageIntegration,
    },
  }), [features])

  const mergedApiConfig = useMemo(() => ({
    ...defaultApiConfig,
    ...apiConfig,
  }), [apiConfig])

  const mergedAIConfig = useMemo(() => ({
    ...defaultAIConfig,
    ...aiConfig,
    providers: {
      ...defaultAIConfig.providers,
      ...aiConfig.providers,
    },
    features: {
      ...defaultAIConfig.features,
      ...aiConfig.features,
    },
  }), [aiConfig])

  // Initialize services
  const services = useMemo<HomepageServices>(() => {
    // Initialize SearchService with default config
    const searchService = new SearchService({
      node: process.env.REACT_APP_ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: {
        username: process.env.REACT_APP_ELASTICSEARCH_USERNAME || '',
        password: process.env.REACT_APP_ELASTICSEARCH_PASSWORD || '',
      },
      indices: {
        brokers: 'brokers',
        reviews: 'reviews',
        news: 'news',
      },
      useMockData: process.env.NODE_ENV === 'development',
    })

    // Initialize AIGateway with default config
    const aiGateway = new AIGateway()

    // Initialize ExternalAPIService with default config
    const externalAPIService = new ExternalAPIService({
      brokerData: {
        baseURL: process.env.REACT_APP_BROKER_API_URL || 'http://localhost:3001',
        apiKey: process.env.REACT_APP_BROKER_API_KEY || '',
        timeout: 10000,
        rateLimit: { maxRequests: 100, windowMs: 60000 },
        retryConfig: { maxRetries: 3, retryDelay: 1000 },
        endpoints: {
          spreads: '/v1/spreads',
          serverStatus: '/v1/status',
          brokerInfo: '/v1/brokers'
        }
      },
      financialData: {
        baseURL: process.env.REACT_APP_FINANCIAL_API_URL || 'https://www.alphavantage.co/query',
        apiKey: process.env.REACT_APP_FINANCIAL_API_KEY || '',
        timeout: 15000,
        rateLimit: { maxRequests: 500, windowMs: 60000 },
        retryConfig: { maxRetries: 2, retryDelay: 500 },
        provider: 'alpha-vantage',
        endpoints: {
          quotes: '/v1/quotes',
          historical: '/v1/historical',
          forex: '/v1/forex'
        }
      },
      news: {
        baseURL: process.env.REACT_APP_NEWS_API_URL || 'https://newsapi.org/v2',
        apiKey: process.env.REACT_APP_NEWS_API_KEY || '',
        timeout: 10000,
        rateLimit: { maxRequests: 1000, windowMs: 60000 },
        retryConfig: { maxRetries: 2, retryDelay: 1000 },
        provider: 'newsapi',
        endpoints: {
          everything: '/everything',
          topHeadlines: '/top-headlines',
          sources: '/sources'
        }
      },
      regulatory: {
        baseURL: process.env.REACT_APP_REGULATORY_API_URL || 'http://localhost:3002',
        apiKey: process.env.REACT_APP_REGULATORY_API_KEY || '',
        timeout: 15000,
        rateLimit: { maxRequests: 200, windowMs: 60000 },
        retryConfig: { maxRetries: 3, retryDelay: 2000 },
        provider: 'consolidated',
        endpoints: {
          brokerInfo: '/v1/brokers',
          licenses: '/v1/licenses',
          warnings: '/v1/warnings',
          documents: '/v1/documents',
          search: '/v1/search'
        }
      },
      useMockData: process.env.NODE_ENV === 'development',
    })

    // Initialize DataSyncService with default config
    const dataSyncService = new DataSyncService({
      syncInterval: 300000, // 5 minutes
      batchSize: 50,
      maxRetries: 3,
      enableRealTimeSync: true,
    })

    // Initialize CacheService with default config
    const cacheService = new CacheService({
      defaultTTL: 300, // 5 minutes
      maxSize: 1000,
      enablePersistence: true,
    })

    return {
      authService,
      searchService,
      aiGateway,
      profileService,
      externalAPIService,
      dataSyncService,
      cacheService,
    }
  }, [])

  // Initialize hooks
  const hooks = useMemo<HomepageHooks>(() => ({
    useAuth,
    useSearch,
    useProfile,
  }), [])

  // Use the new state management hooks
  const searchState = useSearchState()
  const aiChatState = useAIChatState()
  const brokerState = useBrokerState()
  const uiState = useUIState()
  const userPreferences = useUserPreferences()
  const authState = useAuth()
  const stateSyncEmitter = useStateSyncEmitter()

  // Combine all state into the homepage state structure
  const homepageState = useMemo<HomepageState>(() => ({
    user: authState.user,
    searchState: {
      query: searchState.currentSearch.query,
      filters: searchState.currentSearch.filters,
      results: searchState.currentSearch.results,
      savedSearches: searchState.savedSearches,
      isLoading: searchState.currentSearch.isLoading,
    },
    aiState: {
      isOpen: aiChatState.currentChat.isOpen,
      messages: aiChatState.allMessages,
      isLoading: aiChatState.currentChat.isLoading,
      context: aiChatState.currentChat.context,
    },
    brokerState: {
      featured: brokerState.featuredBrokers,
      personalized: brokerState.personalizedBrokers,
      comparison: brokerState.comparisonBrokers,
      isLoading: brokerState.isLoadingFeatured || brokerState.isLoadingPersonalized,
    },
    uiState: {
      activeSection: uiState.activeSection,
      modalsOpen: uiState.modalsOpen,
      notifications: uiState.notifications,
    },
  }), [
    authState.user,
    searchState,
    aiChatState,
    brokerState,
    uiState,
  ])

  // Set up state synchronization listeners
  useStateSync('user', (event) => {
    if (event.action === STATE_SYNC_ACTIONS.USER.LOGGED_IN) {
      // Refresh personalized data when user logs in
      brokerState.refetchPersonalized()
    }
  }, [brokerState.refetchPersonalized])

  useStateSync('search', (event) => {
    if (event.action === STATE_SYNC_ACTIONS.SEARCH.QUERY_CHANGED) {
      // Could trigger AI suggestions or broker filtering
      console.log('Search query changed:', event.payload)
    }
  }, [])

  useStateSync('broker', (event) => {
    if (event.action === STATE_SYNC_ACTIONS.BROKER.ADDED_TO_COMPARISON) {
      // Could trigger analytics or recommendations
      console.log('Broker added to comparison:', event.payload)
    }
  }, [])

  // Search actions
  const performSearch = useCallback(async (query: string, filters: SearchFilters = {}) => {
    if (!mergedFeatures.homepageIntegration.searchIntegration) return

    // Update search state
    searchState.updateSearch({ query, filters, isLoading: true })
    
    // Emit state sync event
    stateSyncEmitter.emitSearchEvent(
      STATE_SYNC_ACTIONS.SEARCH.QUERY_CHANGED,
      { query, filters },
      'homepage-provider'
    )

    try {
      const results = await services.searchService.search(query, filters)
      
      // Update search state with results
      searchState.updateSearch({ results, isLoading: false })
      
      // Save to history
      searchState.saveToHistory(query, filters)
      
      // Emit results loaded event
      stateSyncEmitter.emitSearchEvent(
        STATE_SYNC_ACTIONS.SEARCH.RESULTS_LOADED,
        { query, filters, resultCount: results.length },
        'homepage-provider'
      )
    } catch (error) {
      console.error('Search failed:', error)
      searchState.updateSearch({ isLoading: false })
      uiState.addNotification({
        type: 'error',
        message: 'Search failed. Please try again.',
      })
    }
  }, [services.searchService, mergedFeatures.homepageIntegration.searchIntegration, searchState, stateSyncEmitter, uiState])

  const saveSearch = useCallback(async (search: SavedSearch) => {
    if (!mergedFeatures.homepageIntegration.searchIntegration) return

    try {
      // Save using the search state hook
      searchState.saveNamedSearch(search.name, search.query, search.filters)
      
      // Also save to backend/cache
      await services.cacheService.set(`saved_search_${search.id}`, search)
      
      // Emit event
      stateSyncEmitter.emitSearchEvent(
        STATE_SYNC_ACTIONS.SEARCH.SEARCH_SAVED,
        search,
        'homepage-provider'
      )

      uiState.addNotification({
        type: 'success',
        message: 'Search saved successfully.',
      })
    } catch (error) {
      console.error('Failed to save search:', error)
      uiState.addNotification({
        type: 'error',
        message: 'Failed to save search.',
      })
    }
  }, [services.cacheService, mergedFeatures.homepageIntegration.searchIntegration, searchState, stateSyncEmitter, uiState])

  const clearSearch = useCallback(() => {
    searchState.clearSearch()
    stateSyncEmitter.emitSearchEvent(
      STATE_SYNC_ACTIONS.SEARCH.SEARCH_CLEARED,
      {},
      'homepage-provider'
    )
  }, [searchState, stateSyncEmitter])

  // AI actions
  const openAIChat = useCallback((context = 'general') => {
    if (!mergedFeatures.homepageIntegration.aiIntegration) return

    aiChatState.updateChat({ 
      isOpen: true, 
      context: context as any 
    })
    
    stateSyncEmitter.emitAIEvent(
      STATE_SYNC_ACTIONS.AI.CHAT_OPENED,
      { context },
      'homepage-provider'
    )
  }, [mergedFeatures.homepageIntegration.aiIntegration, aiChatState, stateSyncEmitter])

  const closeAIChat = useCallback(() => {
    aiChatState.updateChat({ isOpen: false })
    
    stateSyncEmitter.emitAIEvent(
      STATE_SYNC_ACTIONS.AI.CHAT_CLOSED,
      {},
      'homepage-provider'
    )
  }, [aiChatState, stateSyncEmitter])

  const sendAIMessage = useCallback(async (message: string) => {
    if (!mergedFeatures.homepageIntegration.aiIntegration) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
    }

    // Add temporary message and set loading
    aiChatState.addTempMessage(userMessage)
    aiChatState.updateChat({ isLoading: true })
    
    // Emit message sent event
    stateSyncEmitter.emitAIEvent(
      STATE_SYNC_ACTIONS.AI.MESSAGE_SENT,
      { message },
      'homepage-provider'
    )

    try {
      const response = await services.aiGateway.chat({
        messages: [{ role: 'user', content: message }],
        useCase: 'chatbot',
        context: {
          userProfile: homepageState.user,
          currentSection: homepageState.uiState.activeSection,
        },
      })

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.content,
      }

      // Add assistant message and save both to persistent storage
      aiChatState.addTempMessage(assistantMessage)
      aiChatState.saveMessage({
        ...userMessage,
        context: aiChatState.currentChat.context,
      })
      aiChatState.saveMessage({
        ...assistantMessage,
        context: aiChatState.currentChat.context,
      })
      
      aiChatState.updateChat({ isLoading: false })
      
      // Emit message received event
      stateSyncEmitter.emitAIEvent(
        STATE_SYNC_ACTIONS.AI.MESSAGE_RECEIVED,
        { response: response.content },
        'homepage-provider'
      )
    } catch (error) {
      console.error('AI message failed:', error)
      aiChatState.updateChat({ isLoading: false })
      uiState.addNotification({
        type: 'error',
        message: 'AI assistant is temporarily unavailable.',
      })
    }
  }, [services.aiGateway, homepageState.user, homepageState.uiState.activeSection, mergedFeatures.homepageIntegration.aiIntegration, aiChatState, stateSyncEmitter, uiState])

  // UI actions
  const setActiveSection = useCallback((section: string) => {
    uiState.setActiveSection(section)
    
    stateSyncEmitter.emitUIEvent(
      STATE_SYNC_ACTIONS.UI.SECTION_CHANGED,
      { section },
      'homepage-provider'
    )
  }, [uiState, stateSyncEmitter])

  const openModal = useCallback((modalId: string) => {
    uiState.openModal(modalId)
    
    stateSyncEmitter.emitUIEvent(
      STATE_SYNC_ACTIONS.UI.MODAL_OPENED,
      { modalId },
      'homepage-provider'
    )
  }, [uiState, stateSyncEmitter])

  const closeModal = useCallback((modalId: string) => {
    uiState.closeModal(modalId)
    
    stateSyncEmitter.emitUIEvent(
      STATE_SYNC_ACTIONS.UI.MODAL_CLOSED,
      { modalId },
      'homepage-provider'
    )
  }, [uiState, stateSyncEmitter])

  const addNotification = useCallback((notification: Omit<HomepageState['uiState']['notifications'][0], 'id' | 'timestamp'>) => {
    uiState.addNotification(notification)
    
    stateSyncEmitter.emitUIEvent(
      STATE_SYNC_ACTIONS.UI.NOTIFICATION_ADDED,
      notification,
      'homepage-provider'
    )
  }, [uiState, stateSyncEmitter])

  const removeNotification = useCallback((id: string) => {
    uiState.removeNotification(id)
    
    stateSyncEmitter.emitUIEvent(
      STATE_SYNC_ACTIONS.UI.NOTIFICATION_REMOVED,
      { id },
      'homepage-provider'
    )
  }, [uiState, stateSyncEmitter])

  // Broker actions
  const loadFeaturedBrokers = useCallback(async () => {
    if (!mergedFeatures.homepageIntegration.realtimeData) return

    // Use the refetch method from the broker state hook
    await brokerState.refetchFeatured()
  }, [mergedFeatures.homepageIntegration.realtimeData, brokerState])

  const loadPersonalizedBrokers = useCallback(async () => {
    if (!mergedFeatures.homepageIntegration.personalization || !homepageState.user) return

    // Use the refetch method from the broker state hook
    await brokerState.refetchPersonalized()
  }, [mergedFeatures.homepageIntegration.personalization, homepageState.user, brokerState])

  const addToComparison = useCallback((broker: Broker) => {
    brokerState.addToComparison(broker)
    
    stateSyncEmitter.emitBrokerEvent(
      STATE_SYNC_ACTIONS.BROKER.ADDED_TO_COMPARISON,
      { broker },
      'homepage-provider'
    )
  }, [brokerState, stateSyncEmitter])

  const removeFromComparison = useCallback((brokerId: string) => {
    brokerState.removeFromComparison(brokerId)
    
    stateSyncEmitter.emitBrokerEvent(
      STATE_SYNC_ACTIONS.BROKER.REMOVED_FROM_COMPARISON,
      { brokerId },
      'homepage-provider'
    )
  }, [brokerState, stateSyncEmitter])

  // Create context value
  const contextValue = useMemo<HomepageIntegrationContextType>(() => ({
    services,
    hooks,
    config: {
      features: mergedFeatures,
      apiEndpoints: mergedApiConfig,
      aiConfig: mergedAIConfig,
    },
    state: homepageState,
    actions: {
      performSearch,
      saveSearch,
      clearSearch,
      openAIChat,
      closeAIChat,
      sendAIMessage,
      setActiveSection,
      openModal,
      closeModal,
      addNotification,
      removeNotification,
      loadFeaturedBrokers,
      loadPersonalizedBrokers,
      addToComparison,
      removeFromComparison,
    },
  }), [
    services,
    hooks,
    mergedFeatures,
    mergedApiConfig,
    mergedAIConfig,
    homepageState,
    performSearch,
    saveSearch,
    clearSearch,
    openAIChat,
    closeAIChat,
    sendAIMessage,
    setActiveSection,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    loadFeaturedBrokers,
    loadPersonalizedBrokers,
    addToComparison,
    removeFromComparison,
  ])

  return (
    <HomepageIntegrationContext.Provider value={contextValue}>
      {children}
    </HomepageIntegrationContext.Provider>
  )
}
