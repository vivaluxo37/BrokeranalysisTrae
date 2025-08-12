/**
 * Authentication Types
 * 
 * Type definitions for user authentication, profiles, and auth-related data structures
 */

export interface UserProfile {
  firstName: string
  lastName: string
  displayName?: string
  avatar?: string
  bio?: string
  preferences?: {
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      marketing: boolean
    }
  }
  tradingExperience?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  interestedAssets?: string[]
  riskTolerance?: 'low' | 'medium' | 'high'
}

export interface User {
  id: string
  email: string
  profile: UserProfile
  isEmailVerified: boolean
  createdAt: Date
  lastLogin: Date | null
  loginAttempts: number
  isActive: boolean
  role: 'user' | 'admin' | 'moderator'
  subscription?: {
    plan: 'free' | 'premium' | 'professional'
    status: 'active' | 'cancelled' | 'expired'
    expiresAt?: Date
  }
}

export interface AuthSession {
  user: User
  token: string
  refreshToken: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
  clearError: () => void
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  password: string
  confirmPassword: string
}

export interface EmailVerification {
  token: string
}

// Auth API Response Types
export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    token: string
    refreshToken: string
  }
  error?: string
  message?: string
}

export interface AuthError {
  code: string
  message: string
  field?: string
}