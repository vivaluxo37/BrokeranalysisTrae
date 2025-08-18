import React, { createContext, useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useSupabase'
import type { AuthState } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// =====================================================
// QUERY CLIENT CONFIGURATION
// =====================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})

// =====================================================
// SUPABASE CONTEXT
// =====================================================

interface SupabaseContextType {
  supabase: typeof supabase
  queryClient: QueryClient
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function useSupabaseContext() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider')
  }
  return context
}

// =====================================================
// AUTH CONTEXT
// =====================================================

interface AuthContextType extends AuthState {
  // Email/Password Authentication
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  
  // OAuth Authentication
  signInWithGoogle: () => Promise<{ error: any }>
  signInWithFacebook: () => Promise<{ error: any }>
  signInWithOAuth: (provider: 'google' | 'facebook' | 'github' | 'twitter', options?: any) => Promise<{ error: any }>
  
  // User Management
  resetPassword: (email: string) => Promise<{ error: any }>
  updateUser: (attributes: { email?: string; password?: string; data?: any }) => Promise<{ error: any }>
  
  // State Helpers
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a SupabaseProvider')
  }
  return context
}

// =====================================================
// SUPABASE PROVIDER COMPONENT
// =====================================================

interface SupabaseProviderProps {
  children: React.ReactNode
  enableDevtools?: boolean
}

export function SupabaseProvider({ 
  children, 
  enableDevtools = import.meta.env.DEV 
}: SupabaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<Error | null>(null)
  
  // Initialize Supabase connection
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        console.log('Initializing Supabase connection...')
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
        console.log('Supabase Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
        
        // Test the connection with a simple query
        const { data, error } = await supabase
          .from('brokers')
          .select('id')
          .limit(1)
        
        if (error) {
          console.error('Supabase query error:', error)
          // Only throw for serious errors, not "no rows" errors
          if (error.code !== 'PGRST116' && !error.message.includes('relation "public.brokers" does not exist')) {
            throw new Error(`Supabase connection failed: ${error.message}`)
          }
        }
        
        console.log('Supabase connection successful')
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        setInitError(error as Error)
        // Allow app to load even with connection issues for development
        setIsInitialized(true)
      }
    }

    initializeSupabase()
  }, [])

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    )
  }

  // Show error state if initialization failed (only in production)
  if (initError && import.meta.env.PROD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the database. Please check your internet connection and try again.
          </p>
          <details className="text-left text-sm text-gray-500 mb-4">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {initError.message}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseContext.Provider value={{ supabase, queryClient }}>
        <AuthProvider>
          {/* Show development warning if there's an error */}
          {initError && import.meta.env.DEV && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Supabase Connection Warning:</strong> {initError.message}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    The app will continue to work with limited functionality.
                  </p>
                </div>
              </div>
            </div>
          )}
          {children}
          {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </AuthProvider>
      </SupabaseContext.Provider>
    </QueryClientProvider>
  )
}

// =====================================================
// AUTH PROVIDER COMPONENT
// =====================================================

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// =====================================================
// ERROR BOUNDARY FOR SUPABASE OPERATIONS
// =====================================================

interface SupabaseErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class SupabaseErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; resetError: () => void }> },
  SupabaseErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): SupabaseErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Supabase Error Boundary caught an error:', error, errorInfo)
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// =====================================================
// DEFAULT ERROR FALLBACK COMPONENT
// =====================================================

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="space-x-3">
          <button 
            onClick={resetError}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

// =====================================================
// UTILITY HOOKS FOR PROVIDER
// =====================================================

export function useQueryClient() {
  const { queryClient } = useSupabaseContext()
  return queryClient
}

export function useSupabaseClient() {
  const { supabase } = useSupabaseContext()
  return supabase
}

// =====================================================
// PROVIDER CONFIGURATION HELPERS
// =====================================================

export const createSupabaseQueryClient = (options?: {
  staleTime?: number
  cacheTime?: number
  retry?: number
}) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: options?.staleTime ?? 5 * 60 * 1000,
        cacheTime: options?.cacheTime ?? 10 * 60 * 1000,
        retry: options?.retry ?? 3,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  })
}

export const SupabaseProviderConfig = {
  development: {
    enableDevtools: true,
    staleTime: 1 * 60 * 1000, // 1 minute for faster development
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },
  production: {
    enableDevtools: false,
    staleTime: 10 * 60 * 1000, // 10 minutes for better performance
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
} as const