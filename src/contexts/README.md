# Homepage Integration Context

This directory contains the homepage integration context and provider that centralizes all services, state management, and feature flags for the BrokerAnalysis homepage.

## Overview

The Homepage Integration Context provides a unified interface for all homepage features including:

- Authentication management
- Search functionality
- AI-powered features
- Broker comparison and data
- User profiles and personalization
- Real-time data synchronization
- UI state management
- Feature flags for gradual rollout

## Components

### HomepageIntegrationContext

The main context that defines the interface and types for homepage integration.

**Key Types:**
- `HomepageIntegrationContextType` - Main context interface
- `HomepageState` - Complete homepage state structure
- `FeatureFlags` - Feature flag configuration
- `HomepageServices` - Service collection interface

### HomepageIntegrationProvider

The provider component that implements the context and manages all state and services.

**Features:**
- Service initialization with proper configurations
- State management using React hooks and React Query
- Feature flag support for gradual rollout
- Error handling and notifications
- Automatic cleanup and optimization

### Error Boundaries

**HomepageErrorBoundary** - Provides graceful error handling for homepage sections.

**Features:**
- Section-specific error boundaries
- Custom fallback components
- Error reporting and logging
- Retry functionality
- Development error details

### Notification System

**NotificationSystem** - Displays user notifications and alerts.

**Features:**
- Multiple notification types (success, error, warning, info)
- Auto-dismiss functionality
- Smooth animations
- Accessible design

## Usage

### Basic Setup

```tsx
import { HomepageIntegrationProvider } from '@/contexts'

function App() {
  return (
    <HomepageIntegrationProvider>
      <HomePage />
    </HomepageIntegrationProvider>
  )
}
```

### Using the Context

```tsx
import { useHomepageIntegration } from '@/contexts'

function MyComponent() {
  const { state, actions, services, config } = useHomepageIntegration()

  // Access user state
  const user = state.user

  // Perform search
  const handleSearch = async (query: string) => {
    await actions.performSearch(query)
  }

  // Open AI chat
  const openChat = () => {
    actions.openAIChat('hero')
  }

  // Check feature flags
  const isSearchEnabled = config.features.homepageIntegration.searchIntegration

  return (
    <div>
      {/* Your component JSX */}
    </div>
  )
}
```

### Custom Configuration

```tsx
import { HomepageIntegrationProvider } from '@/contexts'

const customFeatures = {
  homepageIntegration: {
    searchIntegration: true,
    aiIntegration: false, // Disable AI features
    authIntegration: true,
    profileIntegration: true,
    realtimeData: false, // Disable real-time data
    personalization: true,
  },
}

const customApiConfig = {
  baseUrl: 'https://api.mybrokersite.com',
  timeout: 15000,
  retryAttempts: 5,
}

function App() {
  return (
    <HomepageIntegrationProvider 
      features={customFeatures}
      apiConfig={customApiConfig}
    >
      <HomePage />
    </HomepageIntegrationProvider>
  )
}
```

### Error Boundaries

```tsx
import { HomepageErrorBoundary, SearchFallback } from '@/components/common'

function SearchSection() {
  return (
    <HomepageErrorBoundary 
      section="search" 
      fallback={<SearchFallback />}
    >
      <SearchContainer />
    </HomepageErrorBoundary>
  )
}
```

### Notifications

```tsx
import { useNotifications } from '@/components/common'

function MyComponent() {
  const { showSuccess, showError } = useNotifications()

  const handleAction = async () => {
    try {
      await someAsyncAction()
      showSuccess('Action completed successfully!')
    } catch (error) {
      showError('Action failed. Please try again.')
    }
  }

  return <button onClick={handleAction}>Do Something</button>
}
```

## State Structure

```typescript
interface HomepageState {
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
    messages: ChatMessage[]
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
    notifications: Notification[]
  }
}
```

## Available Actions

### Search Actions
- `performSearch(query, filters)` - Execute search with filters
- `saveSearch(search)` - Save search for later use
- `clearSearch()` - Clear current search state

### AI Actions
- `openAIChat(context)` - Open AI chat with context
- `closeAIChat()` - Close AI chat interface
- `sendAIMessage(message)` - Send message to AI assistant

### UI Actions
- `setActiveSection(section)` - Set currently active homepage section
- `openModal(modalId)` - Open specific modal
- `closeModal(modalId)` - Close specific modal
- `addNotification(notification)` - Add user notification
- `removeNotification(id)` - Remove notification

### Broker Actions
- `loadFeaturedBrokers()` - Load featured brokers
- `loadPersonalizedBrokers()` - Load personalized broker recommendations
- `addToComparison(broker)` - Add broker to comparison
- `removeFromComparison(brokerId)` - Remove broker from comparison

## Feature Flags

Feature flags allow for gradual rollout and A/B testing:

```typescript
interface FeatureFlags {
  homepageIntegration: {
    searchIntegration: boolean      // Enable/disable search features
    aiIntegration: boolean          // Enable/disable AI features
    authIntegration: boolean        // Enable/disable auth features
    profileIntegration: boolean     // Enable/disable profile features
    realtimeData: boolean          // Enable/disable real-time data
    personalization: boolean       // Enable/disable personalization
  }
}
```

## Environment Variables

The context uses these environment variables for configuration:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_BROKER_API_KEY=your_broker_api_key
REACT_APP_FINANCIAL_API_KEY=your_financial_api_key
REACT_APP_NEWS_API_KEY=your_news_api_key

# Search Configuration
REACT_APP_ELASTICSEARCH_URL=http://localhost:9200
REACT_APP_ELASTICSEARCH_USERNAME=elastic
REACT_APP_ELASTICSEARCH_PASSWORD=password

# External APIs
REACT_APP_REGULATORY_API_URL=http://localhost:3002
```

## Testing

The context includes comprehensive tests covering:

- Initial state and configuration
- Feature flag functionality
- Action execution
- Error handling
- Custom configuration
- Provider requirements

Run tests with:
```bash
npm test src/contexts
```

## Performance Considerations

- Services are memoized to prevent unnecessary re-initialization
- State updates are optimized to minimize re-renders
- Feature flags allow disabling expensive features
- Automatic cleanup prevents memory leaks
- Lazy loading for non-critical components

## Development Tools

In development mode, the feature flag service is exposed on the window object for debugging:

```javascript
// In browser console
window.featureFlags.getFlags()
window.featureFlags.enableFeature('aiIntegration')
window.featureFlags.disableFeature('realtimeData')
```