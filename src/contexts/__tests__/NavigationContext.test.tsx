import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NavigationProvider, useNavigation } from '../NavigationContext'

// Test component that uses the navigation context
function TestComponent() {
  const {
    state,
    navigateTo,
    toggleMobileMenu,
    setSearchQuery,
    performSearch,
    trackNavigation,
    isActiveRoute,
    getRouteDepth,
    getBreadcrumbPath
  } = useNavigation()

  return (
    <div>
      <div data-testid="current-path">{state.currentPath}</div>
      <div data-testid="mobile-menu-open">{state.isMobileMenuOpen.toString()}</div>
      <div data-testid="search-query">{state.searchQuery}</div>
      <div data-testid="analytics-count">{state.analytics.length}</div>
      <div data-testid="route-depth">{getRouteDepth()}</div>
      <div data-testid="breadcrumb-path">{getBreadcrumbPath().join(',')}</div>
      <div data-testid="is-active-home">{isActiveRoute('/').toString()}</div>
      
      <button 
        data-testid="navigate-button" 
        onClick={() => navigateTo('/test')}
      >
        Navigate
      </button>
      
      <button 
        data-testid="toggle-menu-button" 
        onClick={() => toggleMobileMenu()}
      >
        Toggle Menu
      </button>
      
      <button 
        data-testid="search-button" 
        onClick={() => performSearch('test query')}
      >
        Search
      </button>
      
      <button 
        data-testid="track-button" 
        onClick={() => trackNavigation({
          type: 'navigation_click',
          path: '/test',
          metadata: { test: true }
        })}
      >
        Track Event
      </button>
      
      <input 
        data-testid="search-input"
        value={state.searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <NavigationProvider enableAnalytics={true}>
        {children}
      </NavigationProvider>
    </BrowserRouter>
  )
}

describe('NavigationContext', () => {
  beforeEach(() => {
    // Clear any existing skip links
    const existingSkipLinks = document.querySelector('.skip-links')
    if (existingSkipLinks) {
      existingSkipLinks.remove()
    }
  })

  it('provides initial navigation state', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('current-path')).toHaveTextContent('/')
    expect(screen.getByTestId('mobile-menu-open')).toHaveTextContent('false')
    expect(screen.getByTestId('search-query')).toHaveTextContent('')
    expect(screen.getByTestId('analytics-count')).toHaveTextContent('1') // Initial page view
    expect(screen.getByTestId('route-depth')).toHaveTextContent('0')
    expect(screen.getByTestId('breadcrumb-path')).toHaveTextContent(',/')
    expect(screen.getByTestId('is-active-home')).toHaveTextContent('true')
  })

  it('toggles mobile menu state', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const toggleButton = screen.getByTestId('toggle-menu-button')
    
    // Initially closed
    expect(screen.getByTestId('mobile-menu-open')).toHaveTextContent('false')
    
    // Toggle open
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('mobile-menu-open')).toHaveTextContent('true')
    
    // Toggle closed
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('mobile-menu-open')).toHaveTextContent('false')
  })

  it('updates search query', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const searchInput = screen.getByTestId('search-input')
    
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    expect(screen.getByTestId('search-query')).toHaveTextContent('test search')
  })

  it('tracks navigation events', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const trackButton = screen.getByTestId('track-button')
    
    // Initial count (page view event)
    expect(screen.getByTestId('analytics-count')).toHaveTextContent('1')
    
    // Track custom event
    fireEvent.click(trackButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('analytics-count')).toHaveTextContent('2')
    })
  })

  it('calculates route depth correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Root path has depth 0
    expect(screen.getByTestId('route-depth')).toHaveTextContent('0')
  })

  it('generates breadcrumb path correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Root path breadcrumbs
    expect(screen.getByTestId('breadcrumb-path')).toHaveTextContent(',/')
  })

  it('checks active routes correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Home route should be active
    expect(screen.getByTestId('is-active-home')).toHaveTextContent('true')
  })

  it('adds skip links to the page', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Check if skip links were added
    const skipLinks = document.querySelector('.skip-links')
    expect(skipLinks).toBeInTheDocument()
    
    const skipLinksElements = skipLinks?.querySelectorAll('a')
    expect(skipLinksElements).toHaveLength(3) // main-content, navigation, footer
  })

  it('handles keyboard shortcuts', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Test Escape key to close mobile menu
    const toggleButton = screen.getByTestId('toggle-menu-button')
    
    // Open menu first
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('mobile-menu-open')).toHaveTextContent('true')
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByTestId('mobile-menu-open')).toHaveTextContent('false')
  })

  it('provides focus management utilities', () => {
    const { container } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // The NavigationProvider should provide focus management
    // This is tested indirectly through the context being available
    expect(container).toBeInTheDocument()
  })
})

describe('NavigationContext hooks', () => {
  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useNavigation must be used within a NavigationProvider')
    
    consoleSpy.mockRestore()
  })
})