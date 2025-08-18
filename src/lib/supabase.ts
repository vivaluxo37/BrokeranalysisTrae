import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with TypeScript support
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper functions for common operations
export const supabaseHelpers = {
  // Get active brokers with features and regulation
  async getBrokers(limit?: number) {
    let query = supabase
      .from('broker_details')
      .select('*')
      .order('avg_rating', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    return query
  },

  // Get single broker by slug
  async getBrokerBySlug(slug: string) {
    return supabase
      .from('broker_details')
      .select('*')
      .eq('slug', slug)
      .single()
  },

  // Get localized broker content
  async getBrokerLocalized(slug: string, lang: string = 'en') {
    return supabase
      .from('broker_localized')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .single()
  },

  // Get brokers by country regulation
  async getBrokersByCountry(countryCode: string) {
    return supabase
      .from('brokers')
      .select(`
        *,
        broker_regulation!inner(
          country_code,
          regulator_name,
          license_id
        )
      `)
      .eq('broker_regulation.country_code', countryCode)
      .eq('status', 'active')
  },

  // Search brokers by features
  async searchBrokers(searchTerm: string) {
    return supabase
      .from('brokers')
      .select(`
        *,
        broker_features(
          feature_key,
          feature_value
        )
      `)
      .or(`name.ilike.%${searchTerm}%,broker_features.feature_value.ilike.%${searchTerm}%`)
      .eq('status', 'active')
  },

  // Get broker reviews
  async getBrokerReviews(brokerId: string, kind?: 'editorial' | 'user') {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('broker_id', brokerId)
      .order('published_at', { ascending: false })
    
    if (kind) {
      query = query.eq('kind', kind)
    }
    
    return query
  },

  // Submit user review (with rate limiting)
  async submitUserReview(review: {
    broker_id: string
    rating: number
    body: string
    author?: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to submit reviews')
    }

    return supabase
      .from('reviews')
      .insert({
        ...review,
        kind: 'user',
        author_id: user.id,
        author: review.author || user.email || 'Anonymous'
      })
  },

  // Get page translations
  async getPageTranslations(pageKey: string, lang: string = 'en') {
    return supabase
      .from('pages_i18n')
      .select('t')
      .eq('page_key', pageKey)
      .eq('lang', lang)
      .single()
  },

  // Get available locales
  async getLocales() {
    return supabase
      .from('locales')
      .select('*')
      .eq('enabled', true)
      .order('code')
  },

  // Get fee comparison data
  async getFeeComparison(brokerId: string) {
    return supabase
      .from('fee_comparison')
      .select(`
        *,
        competitor:brokers!competitor_broker_id(name)
      `)
      .eq('broker_id', brokerId)
  },

  // Upload broker logo
  async uploadBrokerLogo(brokerSlug: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `logo.${fileExt}`
    const filePath = `${brokerSlug}/${fileName}`

    const { data, error } = await supabase.storage
      .from('broker-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('broker-assets')
      .getPublicUrl(filePath)

    // Update broker logo_url
    await supabase
      .from('brokers')
      .update({ logo_url: publicUrl })
      .eq('slug', brokerSlug)

    return { data, publicUrl }
  },

  // Real-time subscriptions
  subscribeToReviews(brokerId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`reviews:${brokerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `broker_id=eq.${brokerId}`
        },
        callback
      )
      .subscribe()
  },

  // Analytics helpers
  async getBrokerStats() {
    const { data: totalBrokers } = await supabase
      .from('brokers')
      .select('id', { count: 'exact' })
      .eq('status', 'active')

    const { data: totalReviews } = await supabase
      .from('reviews')
      .select('id', { count: 'exact' })

    const { data: avgRating } = await supabase
      .from('brokers')
      .select('avg_rating')
      .eq('status', 'active')

    const overallAvgRating = avgRating?.reduce((sum, broker) => 
      sum + (broker.avg_rating || 0), 0
    ) / (avgRating?.length || 1)

    return {
      totalBrokers: totalBrokers?.length || 0,
      totalReviews: totalReviews?.length || 0,
      averageRating: Math.round(overallAvgRating * 10) / 10
    }
  }
}

// Export types for use in components
export type SupabaseClient = typeof supabase
export type SupabaseHelpers = typeof supabaseHelpers

// Auth helpers
export const auth = {
  // Email/Password Authentication
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),
  
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  // OAuth Authentication
  signInWithGoogle: () => 
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  
  signInWithFacebook: () => 
    supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email',
      },
    }),
  
  // General OAuth method for extensibility
  signInWithOAuth: (provider: 'google' | 'facebook' | 'github' | 'twitter', options?: any) => 
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...options,
      },
    }),
  
  // Session Management
  signOut: () => supabase.auth.signOut(),
  
  getUser: () => supabase.auth.getUser(),
  
  getSession: () => supabase.auth.getSession(),
  
  refreshSession: () => supabase.auth.refreshSession(),
  
  // Auth State Monitoring
  onAuthStateChange: (callback: (event: string, session: any) => void) => 
    supabase.auth.onAuthStateChange(callback),
  
  // Password Reset
  resetPassword: (email: string) => 
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    }),
  
  // Update Password
  updatePassword: (password: string) => 
    supabase.auth.updateUser({ password }),
  
  // Update User Metadata
  updateUser: (attributes: { email?: string; password?: string; data?: any }) => 
    supabase.auth.updateUser(attributes)
}

export default supabase