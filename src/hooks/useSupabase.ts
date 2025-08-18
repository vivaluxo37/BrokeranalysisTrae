import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, supabaseHelpers } from '../lib/supabase'
import type {
  Broker,
  BrokerDetails,
  BrokerLocalized,
  Review,
  ReviewInsert,
  BrokerSearchFilters,
  AuthState,
  UserProfile,
  Locale,
  PageTranslations
} from '../types/supabase'

// =====================================================
// AUTHENTICATION HOOKS
// =====================================================

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }))
        return
      }

      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.app_metadata?.role || 'user',
        created_at: session.user.created_at,
        last_sign_in_at: session.user.last_sign_in_at
      } : null

      setAuthState({
        user,
        session,
        loading: false,
        error: null
      })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ? {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.app_metadata?.role || 'user',
          created_at: session.user.created_at,
          last_sign_in_at: session.user.last_sign_in_at
        } : null

        setAuthState({
          user,
          session,
          loading: false,
          error: null
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Email/Password Authentication
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  // OAuth Authentication
  const signInWithGoogle = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  const signInWithFacebook = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email',
      },
    })
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'facebook' | 'github' | 'twitter', options?: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...options,
      },
    })
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  // Password Reset
  const resetPassword = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  // Update User
  const updateUser = useCallback(async (attributes: { email?: string; password?: string; data?: any }) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.updateUser(attributes)
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  // Sign Out
  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }))
    }
    return { error }
  }, [])

  return {
    ...authState,
    // Email/Password methods
    signIn,
    signUp,
    signOut,
    // OAuth methods
    signInWithGoogle,
    signInWithFacebook,
    signInWithOAuth,
    // User management
    resetPassword,
    updateUser,
    // State helpers
    isAuthenticated: !!authState.user,
    isAdmin: authState.user?.role === 'admin'
  }
}

// =====================================================
// BROKER HOOKS
// =====================================================

export function useBrokers(limit?: number) {
  return useQuery({
    queryKey: ['brokers', limit],
    queryFn: () => supabaseHelpers.getBrokers(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useBroker(slug: string) {
  return useQuery({
    queryKey: ['broker', slug],
    queryFn: () => supabaseHelpers.getBrokerBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}

export function useBrokerLocalized(slug: string, lang: string = 'en') {
  return useQuery({
    queryKey: ['broker-localized', slug, lang],
    queryFn: () => supabaseHelpers.getBrokerLocalized(slug, lang),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}

export function useBrokersByCountry(countryCode: string) {
  return useQuery({
    queryKey: ['brokers-by-country', countryCode],
    queryFn: () => supabaseHelpers.getBrokersByCountry(countryCode),
    enabled: !!countryCode,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  })
}

export function useSearchBrokers(searchTerm: string) {
  return useQuery({
    queryKey: ['search-brokers', searchTerm],
    queryFn: () => supabaseHelpers.searchBrokers(searchTerm),
    enabled: searchTerm.length > 2,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  })
}

// =====================================================
// REVIEW HOOKS
// =====================================================

export function useBrokerReviews(brokerId: string, kind?: 'editorial' | 'user') {
  return useQuery({
    queryKey: ['broker-reviews', brokerId, kind],
    queryFn: () => supabaseHelpers.getBrokerReviews(brokerId, kind),
    enabled: !!brokerId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: supabaseHelpers.submitUserReview,
    onSuccess: (data, variables) => {
      // Invalidate and refetch broker reviews
      queryClient.invalidateQueries({ 
        queryKey: ['broker-reviews', variables.broker_id] 
      })
      // Invalidate broker data to update average rating
      queryClient.invalidateQueries({ 
        queryKey: ['broker'] 
      })
    },
  })
}

// =====================================================
// LOCALIZATION HOOKS
// =====================================================

export function useLocales() {
  return useQuery({
    queryKey: ['locales'],
    queryFn: supabaseHelpers.getLocales,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  })
}

export function usePageTranslations(pageKey: string, lang: string = 'en') {
  return useQuery({
    queryKey: ['page-translations', pageKey, lang],
    queryFn: () => supabaseHelpers.getPageTranslations(pageKey, lang),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  })
}

// =====================================================
// ANALYTICS HOOKS
// =====================================================

export function useBrokerStats() {
  return useQuery({
    queryKey: ['broker-stats'],
    queryFn: supabaseHelpers.getBrokerStats,
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
  })
}

// =====================================================
// REAL-TIME HOOKS
// =====================================================

export function useRealtimeReviews(brokerId: string) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!brokerId) return

    const subscription = supabaseHelpers.subscribeToReviews(
      brokerId,
      (payload) => {
        // Invalidate reviews query to refetch data
        queryClient.invalidateQueries({ 
          queryKey: ['broker-reviews', brokerId] 
        })
        
        // Also invalidate broker data for rating updates
        queryClient.invalidateQueries({ 
          queryKey: ['broker'] 
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [brokerId, queryClient])
}

// =====================================================
// ADMIN HOOKS
// =====================================================

export function useUploadBrokerLogo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ brokerSlug, file }: { brokerSlug: string; file: File }) => 
      supabaseHelpers.uploadBrokerLogo(brokerSlug, file),
    onSuccess: (data, variables) => {
      // Invalidate broker data to show new logo
      queryClient.invalidateQueries({ 
        queryKey: ['broker', variables.brokerSlug] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['brokers'] 
      })
    },
  })
}

// =====================================================
// CUSTOM HOOKS FOR COMPLEX OPERATIONS
// =====================================================

export function useBrokerComparison(brokerSlugs: string[]) {
  return useQuery({
    queryKey: ['broker-comparison', brokerSlugs.sort()],
    queryFn: async () => {
      const brokerPromises = brokerSlugs.map(slug => 
        supabaseHelpers.getBrokerBySlug(slug)
      )
      const results = await Promise.allSettled(brokerPromises)
      
      return results
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled' && result.value.data
        )
        .map(result => result.value.data)
    },
    enabled: brokerSlugs.length > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}

export function useFeaturedBrokers(limit: number = 6) {
  return useQuery({
    queryKey: ['featured-brokers', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('broker_details')
        .select('*')
        .gte('avg_rating', 4.0)
        .order('avg_rating', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
  })
}

export function useTopRatedBrokers(limit: number = 10) {
  return useQuery({
    queryKey: ['top-rated-brokers', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('broker_details')
        .select('*')
        .not('avg_rating', 'is', null)
        .order('avg_rating', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
  })
}

// =====================================================
// UTILITY HOOKS
// =====================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// =====================================================
// ERROR BOUNDARY HOOK
// =====================================================

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null)

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('Application error:', error)
    setError(error)
  }, [])

  return {
    error,
    resetError,
    handleError,
    hasError: !!error
  }
}