import React from 'react'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAIChatState,
  useBrokerState,
  usePersistedState,
  useSearchState,
  useUIState,
  useUserPreferences,
} from '../useHomepageState'
import { statePersistenceService } from '@/services/StatePersistenceService'

// Mock the persistence service
jest.mock('@/services/StatePersistenceService', () => ({
  statePersistenceService: {
    loadState: jest.fn(),
    saveState: jest.fn(),
    saveSearchToHistory: jest.fn(),
    saveNamedSearch: jest.fn(),
    removeSavedSearch: jest.fn(),
    saveAIChatMessage: jest.fn(),
    clearAIChatHistory: jest.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('usePersistedState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(statePersistenceService.loadState as jest.Mock).mockReturnValue({
      searchHistory: [],
      savedSearches: [],
      userPreferences: {
        preferredBrokers: [],
        hiddenBrokers: [],
        comparisonSettings: {},
        notificationSettings: {},
      },
      uiPreferences: {
        activeSection: 'hero',
        collapsedSections: [],
        viewMode: 'grid',
      },
      aiChatHistory: [],
    })
  })

  it('loads persisted state on mount', async () => {
    const { result } = renderHook(() => usePersistedState(), {
      wrapper: createWrapper(),
    })

    expect(statePersistenceService.loadState).toHaveBeenCalled()
    
    // Wait for the query to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.persistedState).toBeDefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('updates persisted state', async () => {
    const { result } = renderHook(() => usePersistedState(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.updatePersistedState({
        userPreferences: {
          preferredBrokers: ['broker-1'],
          hiddenBrokers: [],
          comparisonSettings: {},
          notificationSettings: {},
        },
      })
    })

    expect(statePersistenceService.saveState).toHaveBeenCalledWith({
      userPreferences: {
        preferredBrokers: ['broker-1'],
        hiddenBrokers: [],
        comparisonSettings: {},
        notificationSettings: {},
      },
    })
  })
})

describe('useSearchState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(statePersistenceService.loadState as jest.Mock).mockReturnValue({
      searchHistory: [
        { query: 'test', timestamp: new Date(), filters: {} },
      ],
      savedSearches: [
        { id: '1', name: 'My Search', query: 'test', filters: {}, createdAt: new Date() },
      ],
      userPreferences: {
        preferredBrokers: [],
        hiddenBrokers: [],
        comparisonSettings: {},
        notificationSettings: {},
      },
      uiPreferences: {
        activeSection: 'hero',
        collapsedSections: [],
        viewMode: 'grid',
      },
      aiChatHistory: [],
    })
  })

  it('provides search state and actions', async () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    })

    // Wait for persisted state to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.currentSearch).toEqual({
      query: '',
      filters: {},
      results: [],
      isLoading: false,
    })

    expect(result.current.searchHistory).toHaveLength(1)
    expect(result.current.savedSearches).toHaveLength(1)
  })

  it('updates current search', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateSearch({
        query: 'new query',
        isLoading: true,
      })
    })

    expect(result.current.currentSearch.query).toBe('new query')
    expect(result.current.currentSearch.isLoading).toBe(true)
  })

  it('saves search to history', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.saveToHistory('test query', { category: 'forex' })
    })

    expect(statePersistenceService.saveSearchToHistory).toHaveBeenCalledWith(
      'test query',
      { category: 'forex' }
    )
  })

  it('saves named search', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.saveNamedSearch('My Search', 'test query', { category: 'forex' })
    })

    expect(statePersistenceService.saveNamedSearch).toHaveBeenCalledWith(
      expect.any(String),
      'My Search',
      'test query',
      { category: 'forex' }
    )
  })

  it('clears search', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: createWrapper(),
    })

    // Set some search data first
    act(() => {
      result.current.updateSearch({
        query: 'test',
        results: [{ id: '1' } as any],
      })
    })

    // Clear search
    act(() => {
      result.current.clearSearch()
    })

    expect(result.current.currentSearch).toEqual({
      query: '',
      filters: {},
      results: [],
      isLoading: false,
    })
  })
})

describe('useAIChatState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(statePersistenceService.loadState as jest.Mock).mockReturnValue({
      searchHistory: [],
      savedSearches: [],
      userPreferences: {
        preferredBrokers: [],
        hiddenBrokers: [],
        comparisonSettings: {},
        notificationSettings: {},
      },
      uiPreferences: {
        activeSection: 'hero',
        collapsedSections: [],
        viewMode: 'grid',
      },
      aiChatHistory: [
        {
          id: '1',
          role: 'user',
          content: 'Hello',
          timestamp: new Date(),
          context: 'general',
        },
      ],
    })
  })

  it('provides AI chat state and actions', async () => {
    const { result } = renderHook(() => useAIChatState(), {
      wrapper: createWrapper(),
    })

    // Wait for persisted state to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.currentChat).toEqual({
      isOpen: false,
      isLoading: false,
      context: 'general',
      tempMessages: [],
    })

    expect(result.current.chatHistory).toHaveLength(1)
    expect(result.current.allMessages).toHaveLength(1)
  })

  it('updates chat state', () => {
    const { result } = renderHook(() => useAIChatState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateChat({
        isOpen: true,
        context: 'hero',
      })
    })

    expect(result.current.currentChat.isOpen).toBe(true)
    expect(result.current.currentChat.context).toBe('hero')
  })

  it('adds temporary messages', () => {
    const { result } = renderHook(() => useAIChatState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.addTempMessage({
        id: 'temp-1',
        role: 'user',
        content: 'Temp message',
      })
    })

    expect(result.current.currentChat.tempMessages).toHaveLength(1)
    expect(result.current.currentChat.tempMessages[0].content).toBe('Temp message')
  })

  it('saves messages to persistent storage', () => {
    const { result } = renderHook(() => useAIChatState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.saveMessage({
        id: 'msg-1',
        role: 'user',
        content: 'Persistent message',
        context: 'general',
      })
    })

    expect(statePersistenceService.saveAIChatMessage).toHaveBeenCalledWith({
      id: 'msg-1',
      role: 'user',
      content: 'Persistent message',
      context: 'general',
    })
  })

  it('clears chat history', () => {
    const { result } = renderHook(() => useAIChatState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.clearChatHistory()
    })

    expect(statePersistenceService.clearAIChatHistory).toHaveBeenCalled()
  })
})

describe('useUIState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(statePersistenceService.loadState as jest.Mock).mockReturnValue({
      searchHistory: [],
      savedSearches: [],
      userPreferences: {
        preferredBrokers: [],
        hiddenBrokers: [],
        comparisonSettings: {},
        notificationSettings: {},
      },
      uiPreferences: {
        activeSection: 'comparison',
        collapsedSections: ['section1'],
        viewMode: 'list',
      },
      aiChatHistory: [],
    })
  })

  it('provides UI state and actions', async () => {
    const { result } = renderHook(() => useUIState(), {
      wrapper: createWrapper(),
    })

    // Wait for persisted state to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.activeSection).toBe('comparison')
    expect(result.current.uiPreferences?.viewMode).toBe('list')
    expect(result.current.modalsOpen).toEqual({})
    expect(result.current.notifications).toEqual([])
  })

  it('manages modal state', () => {
    const { result } = renderHook(() => useUIState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.openModal('test-modal')
    })

    expect(result.current.modalsOpen['test-modal']).toBe(true)

    act(() => {
      result.current.closeModal('test-modal')
    })

    expect(result.current.modalsOpen['test-modal']).toBe(false)
  })

  it('manages notifications', () => {
    const { result } = renderHook(() => useUIState(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.addNotification({
        type: 'success',
        message: 'Test notification',
      })
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0].message).toBe('Test notification')

    const notificationId = result.current.notifications[0].id

    act(() => {
      result.current.removeNotification(notificationId)
    })

    expect(result.current.notifications).toHaveLength(0)
  })
})
