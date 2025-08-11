import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import type React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { focusUtils, skipLinks } from '@/utils/focusManagement'

/**
 * Navigation Analytics Event
 */
interface NavigationEvent {
  type: 'page_view' | 'navigation_click' | 'breadcrumb_click' | 'search' | 'mobile_menu_toggle'
  path: string
  previousPath?: string
  timestamp: number
  metadata?: Record<string, any>
}

/**
 * Focus Management State
 */
interface FocusState {
  lastFocusedElement: HTMLElement | null
  skipLinkTarget: string | null
  focusHistory: string[]
}

/**
 * Navigation State
 */
interface NavigationState {
  currentPath: string
  previousPath: string | null
  isNavigating: boolean
  isMobileMenuOpen: boolean
  searchQuery: string
  focusState: FocusState
  navigationHistory: string[]
  analytics: NavigationEvent[]
}

/**
 * Navigation Context Value
 */
interface NavigationContextValue {
  // State
  state: NavigationState
  
  // Navigation actions
  navigateTo: (path: string, options?: { replace?: boolean; state?: any }) => void
  goBack: () => void
  goForward: () => void
  
  // Mobile menu actions
  toggleMobileMenu: (open?: boolean) => void
  closeMobileMenu: () => void
  
  // Search actions
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => void
  
  // Focus management
  setFocus: (elementId: string) => void
  restoreFocus: () => void
  setSkipLinkTarget: (target: string) => void
  
  // Analytics
  trackNavigation: (event: Omit<NavigationEvent, 'timestamp'>) => void
  getAnalytics: () => NavigationEvent[]
  clearAnalytics: () => void
  
  // Utility functions
  isActiveRoute: (path: string, exact?: boolean) => boolean
  getRouteDepth: () => number
  getBreadcrumbPath: () => string[]
}

/**
 * Navigation Context
 */
const NavigationContext = createContext<NavigationContextValue | null>(null)

/**
 * Navigation Provider Props
 */
interface NavigationProviderProps {
  children: React.ReactNode
  enableAnalytics?: boolean
  maxAnalyticsEvents?: number
}

/**
 * Navigation Provider Component
 */
export function NavigationProvider({ 
  children, 
  enableAnalytics = true, 
  maxAnalyticsEvents = 1000 
}: NavigationProviderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  
  // State
  const [state, setState] = useState<NavigationState>({
    currentPath: location.pathname,
    previousPath: null,
    isNavigating: false,
    isMobileMenuOpen: false,
    searchQuery: '',
    focusState: {
      lastFocusedElement: null,
      skipLinkTarget: null,
      focusHistory: [],
    },
    navigationHistory: [location.pathname],
    analytics: [],
  })

  // Refs for focus management
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousPathRef = useRef<string>(location.pathname)

  /**
   * Track navigation analytics
   */
  const trackNavigation = useCallback((event: Omit<NavigationEvent, 'timestamp'>) => {
    if (!enableAnalytics) return

    setState(prev => {
      const newEvent: NavigationEvent = {
        ...event,
        timestamp: Date.now(),
      }

      const newAnalytics = [...prev.analytics, newEvent]
      
      // Limit analytics events to prevent memory issues
      if (newAnalytics.length > maxAnalyticsEvents) {
        newAnalytics.splice(0, newAnalytics.length - maxAnalyticsEvents)
      }

      return {
        ...prev,
        analytics: newAnalytics,
      }
    })
  }, [enableAnalytics, maxAnalyticsEvents])

  /**
   * Navigate to a path
   */
  const navigateTo = useCallback((path: string, options?: { replace?: boolean; state?: any }) => {
    setState(prev => ({ ...prev, isNavigating: true }))
    
    trackNavigation({
      type: 'navigation_click',
      path,
      previousPath: location.pathname,
      metadata: options || {},
    })

    navigate(path, options)
  }, [navigate, location.pathname, trackNavigation])

  /**
   * Go back in history
   */
  const goBack = useCallback(() => {
    trackNavigation({
      type: 'navigation_click',
      path: 'back',
      previousPath: location.pathname,
      metadata: { action: 'back' },
    })
    
    window.history.back()
  }, [location.pathname, trackNavigation])

  /**
   * Go forward in history
   */
  const goForward = useCallback(() => {
    trackNavigation({
      type: 'navigation_click',
      path: 'forward',
      previousPath: location.pathname,
      metadata: { action: 'forward' },
    })
    
    window.history.forward()
  }, [location.pathname, trackNavigation])

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = useCallback((open?: boolean) => {
    setState(prev => {
      const newOpen = open !== undefined ? open : !prev.isMobileMenuOpen
      
      if (newOpen !== prev.isMobileMenuOpen) {
        trackNavigation({
          type: 'mobile_menu_toggle',
          path: location.pathname,
          metadata: { open: newOpen },
        })
      }

      return {
        ...prev,
        isMobileMenuOpen: newOpen,
      }
    })
  }, [location.pathname, trackNavigation])

  /**
   * Close mobile menu
   */
  const closeMobileMenu = useCallback(() => {
    toggleMobileMenu(false)
  }, [toggleMobileMenu])

  /**
   * Set search query
   */
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
    }))
  }, [])

  /**
   * Perform search
   */
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) return

    trackNavigation({
      type: 'search',
      path: location.pathname,
      metadata: { query: query.trim() },
    })

    navigateTo(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchQuery('')
  }, [location.pathname, trackNavigation, navigateTo, setSearchQuery])

  /**
   * Set focus to element
   */
  const setFocus = useCallback((elementId: string) => {
    // Clear any existing timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current)
    }

    // Set focus after a short delay to ensure element is rendered
    focusTimeoutRef.current = setTimeout(() => {
      // Store current focused element before changing focus
      setState(prev => ({
        ...prev,
        focusState: {
          ...prev.focusState,
          lastFocusedElement: document.activeElement as HTMLElement,
          focusHistory: [...prev.focusState.focusHistory, elementId].slice(-10), // Keep last 10
        },
      }))

      // Use focus utility for better error handling
      const success = focusUtils.setFocus(elementId, { preventScroll: false })
      
      if (!success) {
        // Try alternative focus targets in order of preference
        const fallbackTargets = ['main-content', 'main', 'body']
        let focused = false
        
        for (const target of fallbackTargets) {
          if (focusUtils.setFocus(target, { preventScroll: false })) {
            focused = true
            break
          }
        }
        
        // If all else fails, focus the document body
        if (!focused) {
          try {
            document.body.focus()
          } catch (error) {
            // Silently fail if even body focus doesn't work
            console.debug('Focus management: Unable to set focus to any element')
          }
        }
      }
    }, 150) // Increased delay slightly for better reliability
  }, [])

  /**
   * Restore focus to previous element
   */
  const restoreFocus = useCallback(() => {
    setState(prev => {
      if (prev.focusState.lastFocusedElement) {
        prev.focusState.lastFocusedElement.focus()
      }
      
      return {
        ...prev,
        focusState: {
          ...prev.focusState,
          lastFocusedElement: null,
        },
      }
    })
  }, [])

  /**
   * Set skip link target
   */
  const setSkipLinkTarget = useCallback((target: string) => {
    setState(prev => ({
      ...prev,
      focusState: {
        ...prev.focusState,
        skipLinkTarget: target,
      },
    }))
  }, [])

  /**
   * Check if route is active
   */
  const isActiveRoute = useCallback((path: string, exact = false): boolean => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path) && path !== '/'
  }, [location.pathname])

  /**
   * Get route depth
   */
  const getRouteDepth = useCallback((): number => {
    return location.pathname.split('/').filter(Boolean).length
  }, [location.pathname])

  /**
   * Get breadcrumb path
   */
  const getBreadcrumbPath = useCallback((): string[] => {
    const segments = location.pathname.split('/').filter(Boolean)
    const paths: string[] = ['']
    
    segments.forEach((_, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/')
      paths.push(path)
    })
    
    return paths
  }, [location.pathname])

  /**
   * Get analytics data
   */
  const getAnalytics = useCallback((): NavigationEvent[] => {
    return state.analytics
  }, [state.analytics])

  /**
   * Clear analytics data
   */
  const clearAnalytics = useCallback(() => {
    setState(prev => ({
      ...prev,
      analytics: [],
    }))
  }, [])

  // Initialize skip links on mount
  useEffect(() => {
    const skipLinksData = [
      { target: 'main-content', text: 'Skip to main content' },
      { target: 'navigation', text: 'Skip to navigation' },
      { target: 'footer', text: 'Skip to footer' }
    ]

    // Only add skip links if they don't already exist
    if (!document.querySelector('.skip-links')) {
      skipLinks.addToPage(skipLinksData)
    }
  }, [])

  // Handle route changes
  useEffect(() => {
    const currentPath = location.pathname
    const previousPath = previousPathRef.current

    if (currentPath !== previousPath) {
      setState(prev => ({
        ...prev,
        currentPath,
        previousPath,
        isNavigating: false,
        isMobileMenuOpen: false, // Close mobile menu on route change
        navigationHistory: [...prev.navigationHistory, currentPath].slice(-50), // Keep last 50
      }))

      // Track page view
      trackNavigation({
        type: 'page_view',
        path: currentPath,
        previousPath,
      })

      // Update ref
      previousPathRef.current = currentPath

      // Set focus to main content after navigation
      setFocus('main-content')
    }
  }, [location.pathname, trackNavigation, setFocus])

  // Handle custom breadcrumb navigation events
  useEffect(() => {
    const handleBreadcrumbNavigate = (event: CustomEvent<{ href: string }>) => {
      trackNavigation({
        type: 'breadcrumb_click',
        path: event.detail.href,
        previousPath: location.pathname,
      })
      
      navigateTo(event.detail.href)
    }

    window.addEventListener('breadcrumb-navigate', handleBreadcrumbNavigate as EventListener)
    
    return () => {
      window.removeEventListener('breadcrumb-navigate', handleBreadcrumbNavigate as EventListener)
    }
  }, [location.pathname, trackNavigation, navigateTo])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
    }
  }, [])

  // Context value
  const contextValue: NavigationContextValue = {
    state,
    navigateTo,
    goBack,
    goForward,
    toggleMobileMenu,
    closeMobileMenu,
    setSearchQuery,
    performSearch,
    setFocus,
    restoreFocus,
    setSkipLinkTarget,
    trackNavigation,
    getAnalytics,
    clearAnalytics,
    isActiveRoute,
    getRouteDepth,
    getBreadcrumbPath,
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

/**
 * Hook to use navigation context
 */
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  
  return context
}

/**
 * Hook for navigation analytics
 */
export function useNavigationAnalytics() {
  const { getAnalytics, clearAnalytics, trackNavigation } = useNavigation()
  
  return {
    getAnalytics,
    clearAnalytics,
    trackNavigation,
  }
}

/**
 * Hook for focus management
 */
export function useFocusManagement() {
  const { setFocus, restoreFocus, setSkipLinkTarget, state } = useNavigation()
  
  return {
    setFocus,
    restoreFocus,
    setSkipLinkTarget,
    focusState: state.focusState,
  }
}

/**
 * Hook for mobile menu state
 */
export function useMobileMenu() {
  const { toggleMobileMenu, closeMobileMenu, state } = useNavigation()
  
  return {
    isOpen: state.isMobileMenuOpen,
    toggle: toggleMobileMenu,
    close: closeMobileMenu,
  }
}

/**
 * Hook for search functionality
 */
export function useNavigationSearch() {
  const { setSearchQuery, performSearch, state } = useNavigation()
  
  return {
    query: state.searchQuery,
    setQuery: setSearchQuery,
    performSearch,
  }
}

/**
 * Hook for route utilities
 */
export function useRouteUtils() {
  const { isActiveRoute, getRouteDepth, getBreadcrumbPath, state } = useNavigation()
  
  return {
    isActiveRoute,
    getRouteDepth,
    getBreadcrumbPath,
    currentPath: state.currentPath,
    previousPath: state.previousPath,
    navigationHistory: state.navigationHistory,
  }
}
