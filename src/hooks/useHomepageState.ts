import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import type { PersistableState } from '@/services/StatePersistenceService'
import { statePersistenceService } from '@/services/StatePersistenceService'
import type { SavedSearch, SearchFilters, SearchResult } from '@/types/search'
import type { Broker } from '@/types/brokerTypes'
import type { User } from '@/types/auth'

/**
 * Query keys for React Query
 */
export const HOMEPAGE_QUERY_KEYS = {
  persistedState: ['homepage', 'persisted-state'] as const,
  searchHistory: ['homepage', 'search-history'] as const,
  savedSearches: ['homepage', 'saved-searches'] as const,
  userPreferences: ['homepage', 'user-preferences'] as const,
  featuredBrokers: ['homepage', 'featured-brokers'] as const,
  personalizedBrokers: (userId?: string) => ['homepage', 'personalized-brokers', userId] as const,
  brokerComparison: ['homepage', 'broker-comparison'] as const,
  aiChatHistory: ['homepage', 'ai-chat-history'] as const,
} as const

/**
 * Hook for managing persisted homepage state
 */
export const usePersistedState = () => {
  const queryClient = useQueryClient()

  // Query for persisted state
  const { data: persistedState, isLoading } = useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.persistedState,
    queryFn: () => statePersistenceService.loadState(),
    staleTime: Infinity, // Never stale since it's local storage
    gcTime: Infinity, // Never garbage collect
  })

  // Mutation for updating persisted state
  const updatePersistedState = useMutation({
    mutationFn: (updates: Partial<PersistableState>) => {
      statePersistenceService.saveState(updates)
      return Promise.resolve(statePersistenceService.loadState())
    },
    onSuccess: (newState) => {
      queryClient.setQueryData(HOMEPAGE_QUERY_KEYS.persistedState, newState)
    },
  })

  return {
    persistedState,
    isLoading,
    updatePersistedState: updatePersistedState.mutate,
    isUpdating: updatePersistedState.isPending,
  }
}

/**
 * Hook for managing search state with persistence
 */
export const useSearchState = () => {
  const queryClient = useQueryClient()
  const { persistedState, updatePersistedState } = usePersistedState()

  const [currentSearch, setCurrentSearch] = useState<{
    query: string
    filters: SearchFilters
    results: SearchResult[]
    isLoading: boolean
  }>({
    query: '',
    filters: {},
    results: [],
    isLoading: false,
  })

  // Save search to history
  const saveToHistory = useCallback((query: string, filters?: SearchFilters) => {
    statePersistenceService.saveSearchToHistory(query, filters)
    queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEYS.searchHistory })
  }, [queryClient])

  // Save named search
  const saveNamedSearch = useCallback((name: string, query: string, filters: SearchFilters) => {
    const id = `search_${Date.now()}`
    statePersistenceService.saveNamedSearch(id, name, query, filters)
    queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEYS.savedSearches })
  }, [queryClient])

  // Remove saved search
  const removeSavedSearch = useCallback((id: string) => {
    statePersistenceService.removeSavedSearch(id)
    queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEYS.savedSearches })
  }, [queryClient])

  // Update current search
  const updateSearch = useCallback((updates: Partial<typeof currentSearch>) => {
    setCurrentSearch(prev => ({ ...prev, ...updates }))
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setCurrentSearch({
      query: '',
      filters: {},
      results: [],
      isLoading: false,
    })
  }, [])

  return {
    currentSearch,
    searchHistory: persistedState?.searchHistory || [],
    savedSearches: persistedState?.savedSearches || [],
    updateSearch,
    clearSearch,
    saveToHistory,
    saveNamedSearch,
    removeSavedSearch,
  }
}

/**
 * Hook for managing AI chat state with persistence
 */
export const useAIChatState = () => {
  const queryClient = useQueryClient()
  const { persistedState } = usePersistedState()

  const [currentChat, setCurrentChat] = useState<{
    isOpen: boolean
    isLoading: boolean
    context: 'hero' | 'comparison' | 'testimonials' | 'general'
    tempMessages: {
      id: string
      role: 'user' | 'assistant'
      content: string
      timestamp: Date
    }[]
  }>({
    isOpen: false,
    isLoading: false,
    context: 'general',
    tempMessages: [],
  })

  // Save message to persistent history
  const saveMessage = useCallback((message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    context: string
  }) => {
    statePersistenceService.saveAIChatMessage(message)
    queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEYS.aiChatHistory })
  }, [queryClient])

  // Add temporary message (before saving)
  const addTempMessage = useCallback((message: {
    id: string
    role: 'user' | 'assistant'
    content: string
  }) => {
    const fullMessage = {
      ...message,
      timestamp: new Date(),
    }
    setCurrentChat(prev => ({
      ...prev,
      tempMessages: [...prev.tempMessages, fullMessage],
    }))
  }, [])

  // Clear temporary messages
  const clearTempMessages = useCallback(() => {
    setCurrentChat(prev => ({
      ...prev,
      tempMessages: [],
    }))
  }, [])

  // Update chat state
  const updateChat = useCallback((updates: Partial<typeof currentChat>) => {
    setCurrentChat(prev => ({ ...prev, ...updates }))
  }, [])

  // Clear chat history
  const clearChatHistory = useCallback(() => {
    statePersistenceService.clearAIChatHistory()
    queryClient.invalidateQueries({ queryKey: HOMEPAGE_QUERY_KEYS.aiChatHistory })
    clearTempMessages()
  }, [queryClient, clearTempMessages])

  // Get all messages (persistent + temporary)
  const allMessages = [
    ...(persistedState?.aiChatHistory || []),
    ...currentChat.tempMessages,
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return {
    currentChat,
    chatHistory: persistedState?.aiChatHistory || [],
    allMessages,
    updateChat,
    saveMessage,
    addTempMessage,
    clearTempMessages,
    clearChatHistory,
  }
}

/**
 * Hook for managing broker state with caching
 */
export const useBrokerState = () => {
  const queryClient = useQueryClient()

  const [comparisonBrokers, setComparisonBrokers] = useState<Broker[]>([])

  // Featured brokers query
  const featuredBrokersQuery = useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.featuredBrokers,
    queryFn: async () => {
      // This would typically call an API
      // For now, return empty array
      return [] as Broker[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Personalized brokers query
  const personalizedBrokersQuery = useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.personalizedBrokers(),
    queryFn: async () => {
      // This would typically call an API with user preferences
      return [] as Broker[]
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: false, // Only enable when user is authenticated
  })

  // Add broker to comparison
  const addToComparison = useCallback((broker: Broker) => {
    setComparisonBrokers(prev => {
      const filtered = prev.filter(b => b.id !== broker.id)
      return [...filtered, broker].slice(0, 3) // Max 3 brokers
    })
  }, [])

  // Remove broker from comparison
  const removeFromComparison = useCallback((brokerId: string) => {
    setComparisonBrokers(prev => prev.filter(b => b.id !== brokerId))
  }, [])

  // Clear comparison
  const clearComparison = useCallback(() => {
    setComparisonBrokers([])
  }, [])

  return {
    featuredBrokers: featuredBrokersQuery.data || [],
    personalizedBrokers: personalizedBrokersQuery.data || [],
    comparisonBrokers,
    isLoadingFeatured: featuredBrokersQuery.isLoading,
    isLoadingPersonalized: personalizedBrokersQuery.isLoading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    refetchFeatured: featuredBrokersQuery.refetch,
    refetchPersonalized: personalizedBrokersQuery.refetch,
  }
}

/**
 * Hook for managing UI state with persistence
 */
export const useUIState = () => {
  const { persistedState, updatePersistedState } = usePersistedState()

  const [temporaryState, setTemporaryState] = useState<{
    modalsOpen: Record<string, boolean>
    notifications: {
      id: string
      type: 'error' | 'warning' | 'info' | 'success'
      message: string
      timestamp: Date
    }[]
  }>({
    modalsOpen: {},
    notifications: [],
  })

  // Update active section (persisted)
  const setActiveSection = useCallback((section: string) => {
    updatePersistedState({
      uiPreferences: {
        ...persistedState?.uiPreferences,
        activeSection: section,
      },
    })
  }, [persistedState, updatePersistedState])

  // Update UI preferences (persisted)
  const updateUIPreferences = useCallback((preferences: Partial<PersistableState['uiPreferences']>) => {
    updatePersistedState({
      uiPreferences: {
        ...persistedState?.uiPreferences,
        ...preferences,
      },
    })
  }, [persistedState, updatePersistedState])

  // Modal management (temporary)
  const openModal = useCallback((modalId: string) => {
    setTemporaryState(prev => ({
      ...prev,
      modalsOpen: { ...prev.modalsOpen, [modalId]: true },
    }))
  }, [])

  const closeModal = useCallback((modalId: string) => {
    setTemporaryState(prev => ({
      ...prev,
      modalsOpen: { ...prev.modalsOpen, [modalId]: false },
    }))
  }, [])

  // Notification management (temporary)
  const addNotification = useCallback((notification: {
    type: 'error' | 'warning' | 'info' | 'success'
    message: string
  }) => {
    const newNotification = {
      ...notification,
      id: `notification_${Date.now()}`,
      timestamp: new Date(),
    }

    setTemporaryState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification],
    }))

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setTemporaryState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }))
  }, [])

  return {
    activeSection: persistedState?.uiPreferences?.activeSection || 'hero',
    uiPreferences: persistedState?.uiPreferences,
    modalsOpen: temporaryState.modalsOpen,
    notifications: temporaryState.notifications,
    setActiveSection,
    updateUIPreferences,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
  }
}

/**
 * Hook for managing user preferences with persistence
 */
export const useUserPreferences = () => {
  const { persistedState, updatePersistedState } = usePersistedState()

  const updateUserPreferences = useCallback((preferences: Partial<PersistableState['userPreferences']>) => {
    updatePersistedState({
      userPreferences: {
        ...persistedState?.userPreferences,
        ...preferences,
      },
    })
  }, [persistedState, updatePersistedState])

  const addPreferredBroker = useCallback((brokerId: string) => {
    const current = persistedState?.userPreferences?.preferredBrokers || []
    if (!current.includes(brokerId)) {
      updateUserPreferences({
        preferredBrokers: [...current, brokerId],
      })
    }
  }, [persistedState, updateUserPreferences])

  const removePreferredBroker = useCallback((brokerId: string) => {
    const current = persistedState?.userPreferences?.preferredBrokers || []
    updateUserPreferences({
      preferredBrokers: current.filter(id => id !== brokerId),
    })
  }, [persistedState, updateUserPreferences])

  const addHiddenBroker = useCallback((brokerId: string) => {
    const current = persistedState?.userPreferences?.hiddenBrokers || []
    if (!current.includes(brokerId)) {
      updateUserPreferences({
        hiddenBrokers: [...current, brokerId],
      })
    }
  }, [persistedState, updateUserPreferences])

  const removeHiddenBroker = useCallback((brokerId: string) => {
    const current = persistedState?.userPreferences?.hiddenBrokers || []
    updateUserPreferences({
      hiddenBrokers: current.filter(id => id !== brokerId),
    })
  }, [persistedState, updateUserPreferences])

  return {
    userPreferences: persistedState?.userPreferences,
    updateUserPreferences,
    addPreferredBroker,
    removePreferredBroker,
    addHiddenBroker,
    removeHiddenBroker,
  }
}
