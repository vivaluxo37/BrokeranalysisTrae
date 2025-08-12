/**
 * Authentication Service
 * 
 * Handles user authentication, session management, and auth-related API calls
 */

import type { 
  User, 
  AuthSession, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  UserProfile,
  PasswordResetRequest,
  PasswordReset,
  EmailVerification
} from '@/types/auth'

class AuthService {
  private baseUrl = '/api/auth'
  private tokenKey = 'auth_token'
  private refreshTokenKey = 'refresh_token'
  private userKey = 'auth_user'

  /**
   * Get current authentication session
   */
  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const token = this.getStoredToken()
      const user = this.getStoredUser()
      
      if (!token || !user) {
        return null
      }

      // Verify token is still valid
      const isValid = await this.verifyToken(token)
      if (!isValid) {
        this.clearSession()
        return null
      }

      return {
        user,
        token,
        refreshToken: this.getStoredRefreshToken() || '',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    } catch (error) {
      console.error('Error getting current session:', error)
      this.clearSession()
      return null
    }
  }

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        this.storeSession(data.data)
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Network error occurred during login'
      }
    }
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        this.storeSession(data.data)
      }

      return data
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'Network error occurred during registration'
      }
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getStoredToken()
      if (token) {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearSession()
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getStoredRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        this.storeSession(data.data)
      } else {
        this.clearSession()
      }

      return data
    } catch (error) {
      console.error('Token refresh error:', error)
      this.clearSession()
      return {
        success: false,
        error: 'Failed to refresh authentication token'
      }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      const token = this.getStoredToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        this.storeUser(data.data.user)
      }

      return data
    } catch (error) {
      console.error('Profile update error:', error)
      return {
        success: false,
        error: 'Failed to update profile'
      }
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      return await response.json()
    } catch (error) {
      console.error('Password reset request error:', error)
      return {
        success: false,
        error: 'Failed to request password reset'
      }
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetData: PasswordReset): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/password-reset/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      })

      return await response.json()
    } catch (error) {
      console.error('Password reset error:', error)
      return {
        success: false,
        error: 'Failed to reset password'
      }
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(verification: EmailVerification): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verification),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        this.storeUser(data.data.user)
      }

      return data
    } catch (error) {
      console.error('Email verification error:', error)
      return {
        success: false,
        error: 'Failed to verify email'
      }
    }
  }

  /**
   * Verify if token is still valid
   */
  private async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error('Token verification error:', error)
      return false
    }
  }

  /**
   * Store authentication session in localStorage
   */
  private storeSession(session: { user: User; token: string; refreshToken: string }): void {
    localStorage.setItem(this.tokenKey, session.token)
    localStorage.setItem(this.refreshTokenKey, session.refreshToken)
    localStorage.setItem(this.userKey, JSON.stringify(session.user))
  }

  /**
   * Store user data in localStorage
   */
  private storeUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  /**
   * Get stored authentication token
   */
  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * Get stored refresh token
   */
  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey)
  }

  /**
   * Get stored user data
   */
  private getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(this.userKey)
      if (!userData) return null
      
      const user = JSON.parse(userData)
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt)
      user.lastLogin = user.lastLogin ? new Date(user.lastLogin) : null
      
      return user
    } catch (error) {
      console.error('Error parsing stored user data:', error)
      return null
    }
  }

  /**
   * Clear authentication session
   */
  private clearSession(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    localStorage.removeItem(this.userKey)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken() && !!this.getStoredUser()
  }

  /**
   * Get current user without API call
   */
  getCurrentUser(): User | null {
    return this.getStoredUser()
  }
}

// Export singleton instance
export const authService = new AuthService()