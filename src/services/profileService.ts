import type { User } from '@/types/auth'

/**
 * User profile data interface
 */
export interface UserProfile {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  email: string
  avatar?: string
  bio?: string
  preferences: {
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    trading: {
      experience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      riskTolerance: 'low' | 'medium' | 'high'
      investmentGoals: string[]
      preferredAssets: string[]
      tradingStyle: 'day-trading' | 'swing-trading' | 'long-term' | 'scalping'
    }
    brokerPreferences: {
      minDeposit?: number
      maxSpread?: number
      requiredRegulation: string[]
      preferredPlatforms: string[]
      accountTypes: string[]
    }
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * Profile service for managing user profiles and preferences
 */
class ProfileService {
  private baseUrl: string
  private cache: Map<string, UserProfile> = new Map()

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  }

  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to get profile: ${response.statusText}`)
      }

      const profile = await response.json()
      
      // Cache the profile
      this.cache.set(userId, profile)
      
      return profile
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    }
  }

  /**
   * Create a new user profile
   */
  async createProfile(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create profile: ${response.statusText}`)
      }

      const profile = await response.json()
      
      // Cache the new profile
      this.cache.set(profile.userId, profile)
      
      return profile
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`)
      }

      const profile = await response.json()
      
      // Update cache
      this.cache.set(userId, profile)
      
      return profile
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string, 
    preferences: Partial<UserProfile['preferences']>
  ): Promise<UserProfile> {
    const currentProfile = await this.getProfile(userId)
    if (!currentProfile) {
      throw new Error('Profile not found')
    }

    const updatedPreferences = {
      ...currentProfile.preferences,
      ...preferences,
    }

    return this.updateProfile(userId, { preferences: updatedPreferences })
  }

  /**
   * Update trading preferences
   */
  async updateTradingPreferences(
    userId: string,
    tradingPrefs: Partial<UserProfile['preferences']['trading']>
  ): Promise<UserProfile> {
    const currentProfile = await this.getProfile(userId)
    if (!currentProfile) {
      throw new Error('Profile not found')
    }

    const updatedPreferences = {
      ...currentProfile.preferences,
      trading: {
        ...currentProfile.preferences.trading,
        ...tradingPrefs,
      },
    }

    return this.updateProfile(userId, { preferences: updatedPreferences })
  }

  /**
   * Update broker preferences
   */
  async updateBrokerPreferences(
    userId: string,
    brokerPrefs: Partial<UserProfile['preferences']['brokerPreferences']>
  ): Promise<UserProfile> {
    const currentProfile = await this.getProfile(userId)
    if (!currentProfile) {
      throw new Error('Profile not found')
    }

    const updatedPreferences = {
      ...currentProfile.preferences,
      brokerPreferences: {
        ...currentProfile.preferences.brokerPreferences,
        ...brokerPrefs,
      },
    }

    return this.updateProfile(userId, { preferences: updatedPreferences })
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete profile: ${response.statusText}`)
      }

      // Remove from cache
      this.cache.delete(userId)
    } catch (error) {
      console.error('Error deleting profile:', error)
      throw error
    }
  }

  /**
   * Get default preferences for new users
   */
  getDefaultPreferences(): UserProfile['preferences'] {
    return {
      language: 'en',
      currency: 'USD',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      trading: {
        experience: 'beginner',
        riskTolerance: 'medium',
        investmentGoals: [],
        preferredAssets: [],
        tradingStyle: 'long-term',
      },
      brokerPreferences: {
        requiredRegulation: [],
        preferredPlatforms: [],
        accountTypes: [],
      },
    }
  }

  /**
   * Clear profile cache
   */
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId)
    } else {
      this.cache.clear()
    }
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || ''
  }

  /**
   * Validate profile data
   */
  validateProfile(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.push('Invalid email format')
    }

    if (profile.preferences?.trading?.experience && 
        !['beginner', 'intermediate', 'advanced', 'expert'].includes(profile.preferences.trading.experience)) {
      errors.push('Invalid trading experience level')
    }

    if (profile.preferences?.trading?.riskTolerance && 
        !['low', 'medium', 'high'].includes(profile.preferences.trading.riskTolerance)) {
      errors.push('Invalid risk tolerance level')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService()
export default profileService