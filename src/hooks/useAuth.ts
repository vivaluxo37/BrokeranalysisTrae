/**
 * useAuth Hook
 * 
 * React hook for authentication state management and auth operations
 */

import { useState, useEffect, useCallback } from 'react'
import type { 
  AuthState, 
  AuthContextType, 
  LoginCredentials, 
  RegisterData, 
  UserProfile 
} from '@/types/auth'
import { authService } from '@/services/authService'

export function useAuth(): AuthContextType {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  /**
   * Initialize authentication state
   */
  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const session = await authService.getCurrentSession()
      
      if (session) {
        setAuthState({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication',
      })
    }
  }, [])

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await authService.login(credentials)
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed',
        }))
        throw new Error(response.error || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await authService.register(data)
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
        }))
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      await authService.logout()
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  /**
   * Refresh authentication token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        }))
      } else {
        // Token refresh failed, logout user
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired',
        })
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired',
      })
    }
  }, [])

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await authService.updateProfile(profile)
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
          isLoading: false,
          error: null,
        }))
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Profile update failed',
        }))
        throw new Error(response.error || 'Profile update failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  /**
   * Clear authentication error
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  /**
   * Set up token refresh interval
   */
  useEffect(() => {
    if (!authState.isAuthenticated) return

    // Refresh token every 23 hours (before 24-hour expiry)
    const refreshInterval = setInterval(() => {
      refreshToken()
    }, 23 * 60 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [authState.isAuthenticated, refreshToken])

  /**
   * Handle storage events (for multi-tab sync)
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token' || event.key === 'auth_user') {
        // Re-initialize auth state when storage changes
        initializeAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [initializeAuth])

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    clearError,
  }
}