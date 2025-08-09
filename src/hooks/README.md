# Homepage State Management Hooks

This directory contains custom React hooks for managing homepage state with persistence and synchronization capabilities.

## Overview

The homepage state management system is built on top of React Query and provides:

- **Persistent State**: Automatic saving/loading from localStorage
- **State Synchronization**: Cross-component state synchronization
- **Optimistic Updates**: Immediate UI updates with background persistence
- **Error Handling**: Graceful error handling and recovery
- **Type Safety**: Full TypeScript support

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Homepage State Layer                     │
├─────────────────────────────────────────────────────────────┤
│  useSearchState  │  useAIChatState  │  useBrokerState      │
│  useUIState      │  useUserPrefs    │  usePersistedState   │
├─────────────────────────────────────────────────────────────┤
│                React Query (Server State)                  │
├─────────────────────────────────────────────────────────────┤
│           StatePersistenceService (localStorage)           │
├─────────────────────────────────────────────────────────────┤
│         StateSynchronizationService (Event System)         │
└─────────────────────────────────────────────────────────────┘
```

## Core Hooks

### usePersistedState

Base hook for managing persistent state with localStorage.

```tsx
import { usePersistedState } from '@/hooks/useHomepageState'

function MyComponent() {
  const { persistedState, updatePersistedState, isLoading } = usePersistedState()

  const handleUpdate = () => {
    updatePersistedState({
      userPreferences: {
        preferredBrokers: ['broker-1', 'broker-2'],
      },
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Active Section: {persistedState?.uiPreferences?.activeSection}</p>
      <button onClick={handleUpdate}>Update Preferences</button>
    </div>
  )
}
```

### useSearchState

Manages search functionality with history and saved searches.

```tsx
import { useSearchState } from '@/hooks/useHomepageState'

function SearchComponent() {
  const {
    currentSearch,
    searchHistory,
    savedSearches,
    updateSearch,
    clearSearch,
    saveToHistory,
    saveNamedSearch,
  } = useSearchState()

  const handleSearch = async (query: string) => {
    updateSearch({ query, isLoading: true })
    
    try {
      // Perform search...
      const results = await searchAPI(query)
      updateSearch({ results, isLoading: false })
      saveToHistory(query)
    } catch (error) {
      updateSearch({ isLoading: false })
    }
  }

  return (
    <div>
      <input
        value={currentSearch.query}
        onChange={(e) => updateSearch({ query: e.target.value })}
        placeholder="Search brokers..."
      />
      
      {currentSearch.isLoading && <div>Searching...</div>}
      
      <div>
        <h3>Recent Searches</h3>
        {searchHistory.map((item, index) => (
          <button key={index} onClick={() => handleSearch(item.query)}>
            {item.query}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### useAIChatState

Manages AI chat functionality with persistent message history.

```tsx
import { useAIChatState } from '@/hooks/useHomepageState'

function AIChatComponent() {
  const {
    currentChat,
    allMessages,
    updateChat,
    addTempMessage,
    saveMessage,
    clearChatHistory,
  } = useAIChatState()

  const sendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
    }

    // Add temporary message for immediate UI update
    addTempMessage(userMessage)
    updateChat({ isLoading: true })

    try {
      // Send to AI service...
      const response = await aiService.chat(content)
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.content,
      }

      // Add assistant message and save both to persistent storage
      addTempMessage(assistantMessage)
      saveMessage({ ...userMessage, context: currentChat.context })
      saveMessage({ ...assistantMessage, context: currentChat.context })
      
      updateChat({ isLoading: false })
    } catch (error) {
      updateChat({ isLoading: false })
    }
  }

  return (
    <div>
      <div className="messages">
        {allMessages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      
      {currentChat.isLoading && <div>AI is typing...</div>}
      
      <button onClick={() => sendMessage('Hello!')}>
        Send Message
      </button>
    </div>
  )
}
```

### useBrokerState

Manages broker data with caching and comparison functionality.

```tsx
import { useBrokerState } from '@/hooks/useHomepageState'

function BrokerComponent() {
  const {
    featuredBrokers,
    personalizedBrokers,
    comparisonBrokers,
    isLoadingFeatured,
    addToComparison,
    removeFromComparison,
    clearComparison,
  } = useBrokerState()

  return (
    <div>
      <section>
        <h2>Featured Brokers</h2>
        {isLoadingFeatured ? (
          <div>Loading...</div>
        ) : (
          featuredBrokers.map((broker) => (
            <div key={broker.id}>
              <h3>{broker.name}</h3>
              <button onClick={() => addToComparison(broker)}>
                Add to Comparison
              </button>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Comparison ({comparisonBrokers.length}/3)</h2>
        {comparisonBrokers.map((broker) => (
          <div key={broker.id}>
            <span>{broker.name}</span>
            <button onClick={() => removeFromComparison(broker.id)}>
              Remove
            </button>
          </div>
        ))}
        {comparisonBrokers.length > 0 && (
          <button onClick={clearComparison}>Clear All</button>
        )}
      </section>
    </div>
  )
}
```

### useUIState

Manages UI state including modals, notifications, and preferences.

```tsx
import { useUIState } from '@/hooks/useHomepageState'

function UIComponent() {
  const {
    activeSection,
    modalsOpen,
    notifications,
    setActiveSection,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
  } = useUIState()

  const showSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Operation completed successfully!',
    })
  }

  return (
    <div>
      <nav>
        {['hero', 'comparison', 'testimonials'].map((section) => (
          <button
            key={section}
            className={activeSection === section ? 'active' : ''}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </nav>

      <button onClick={() => openModal('settings')}>
        Open Settings
      </button>

      {modalsOpen.settings && (
        <div className="modal">
          <h2>Settings</h2>
          <button onClick={() => closeModal('settings')}>Close</button>
        </div>
      )}

      <div className="notifications">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
            <button onClick={() => removeNotification(notification.id)}>×</button>
          </div>
        ))}
      </div>

      <button onClick={showSuccess}>Show Success</button>
    </div>
  )
}
```

### useUserPreferences

Manages user preferences with persistence.

```tsx
import { useUserPreferences } from '@/hooks/useHomepageState'

function PreferencesComponent() {
  const {
    userPreferences,
    updateUserPreferences,
    addPreferredBroker,
    removePreferredBroker,
    addHiddenBroker,
    removeHiddenBroker,
  } = useUserPreferences()

  const toggleNotifications = (type: string, enabled: boolean) => {
    updateUserPreferences({
      notificationSettings: {
        ...userPreferences?.notificationSettings,
        [type]: enabled,
      },
    })
  }

  return (
    <div>
      <h2>Notification Preferences</h2>
      {Object.entries(userPreferences?.notificationSettings || {}).map(([type, enabled]) => (
        <label key={type}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => toggleNotifications(type, e.target.checked)}
          />
          {type}
        </label>
      ))}

      <h2>Preferred Brokers</h2>
      {userPreferences?.preferredBrokers?.map((brokerId) => (
        <div key={brokerId}>
          {brokerId}
          <button onClick={() => removePreferredBroker(brokerId)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

## Query Keys

All React Query keys are centralized for consistency:

```tsx
export const HOMEPAGE_QUERY_KEYS = {
  persistedState: ['homepage', 'persisted-state'],
  searchHistory: ['homepage', 'search-history'],
  savedSearches: ['homepage', 'saved-searches'],
  userPreferences: ['homepage', 'user-preferences'],
  featuredBrokers: ['homepage', 'featured-brokers'],
  personalizedBrokers: (userId?: string) => ['homepage', 'personalized-brokers', userId],
  brokerComparison: ['homepage', 'broker-comparison'],
  aiChatHistory: ['homepage', 'ai-chat-history'],
}
```

## State Persistence

State is automatically persisted to localStorage with the following features:

- **Automatic Cleanup**: Old data is automatically removed
- **Data Migration**: Handles schema changes gracefully
- **Storage Limits**: Monitors and manages storage usage
- **Error Handling**: Graceful fallback when localStorage is unavailable

### Persisted Data Structure

```typescript
interface PersistableState {
  searchHistory: Array<{
    query: string
    timestamp: Date
    filters?: Record<string, any>
  }>
  savedSearches: Array<{
    id: string
    name: string
    query: string
    filters: Record<string, any>
    createdAt: Date
  }>
  userPreferences: {
    preferredBrokers: string[]
    hiddenBrokers: string[]
    comparisonSettings: Record<string, any>
    notificationSettings: Record<string, boolean>
  }
  uiPreferences: {
    activeSection: string
    collapsedSections: string[]
    viewMode: 'grid' | 'list' | 'table'
  }
  aiChatHistory: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    context: string
  }>
}
```

## State Synchronization

The state synchronization system allows different components to communicate state changes:

```tsx
import { useStateSync, useStateSyncEmitter, STATE_SYNC_ACTIONS } from '@/services/StateSynchronizationService'

function ComponentA() {
  const { emitSearchEvent } = useStateSyncEmitter()

  const handleSearch = (query: string) => {
    // Emit search event
    emitSearchEvent(
      STATE_SYNC_ACTIONS.SEARCH.QUERY_CHANGED,
      { query },
      'component-a'
    )
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}

function ComponentB() {
  // Listen for search events
  useStateSync('search', (event) => {
    if (event.action === STATE_SYNC_ACTIONS.SEARCH.QUERY_CHANGED) {
      console.log('Search query changed:', event.payload.query)
      // Update component state or trigger side effects
    }
  })

  return <div>Component B responds to search changes</div>
}
```

## Best Practices

### 1. Use Appropriate Hooks

- Use `useSearchState` for search-related functionality
- Use `useAIChatState` for AI chat features
- Use `useBrokerState` for broker data and comparisons
- Use `useUIState` for UI state and notifications
- Use `useUserPreferences` for user settings

### 2. Handle Loading States

```tsx
const { currentSearch, updateSearch } = useSearchState()

// Always handle loading states
if (currentSearch.isLoading) {
  return <LoadingSpinner />
}
```

### 3. Optimize Re-renders

```tsx
// Use specific state slices to minimize re-renders
const { activeSection } = useUIState()

// Instead of destructuring everything
const uiState = useUIState()
```

### 4. Error Handling

```tsx
const { addNotification } = useUIState()

try {
  await performAction()
  addNotification({ type: 'success', message: 'Success!' })
} catch (error) {
  addNotification({ type: 'error', message: 'Something went wrong' })
}
```

### 5. State Synchronization

```tsx
// Emit events for important state changes
const { emitBrokerEvent } = useStateSyncEmitter()

const addBrokerToComparison = (broker) => {
  // Update local state
  addToComparison(broker)
  
  // Notify other components
  emitBrokerEvent(
    STATE_SYNC_ACTIONS.BROKER.ADDED_TO_COMPARISON,
    { broker },
    'broker-card'
  )
}
```

## Testing

All hooks are thoroughly tested with React Testing Library:

```bash
npm test src/hooks
```

Test files include:
- `useHomepageState.test.tsx` - Tests for all state management hooks
- Mock implementations for persistence service
- Integration tests with React Query

## Performance Considerations

- **Memoization**: All hooks use proper memoization to prevent unnecessary re-renders
- **Selective Updates**: Only update specific state slices when needed
- **Lazy Loading**: Expensive operations are deferred until needed
- **Cleanup**: Automatic cleanup of event listeners and timers
- **Storage Optimization**: Automatic cleanup of old persisted data

## Migration Guide

When updating from the old state management system:

1. Replace direct state updates with hook calls
2. Update component props to use hook returns
3. Add error boundaries for graceful degradation
4. Test persistence functionality
5. Verify state synchronization works correctly