// TypeScript types for Supabase database schema
// Generated from the database schema for type safety

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brokers: {
        Row: {
          id: string
          slug: string
          name: string
          founded_year: number | null
          headquarters: string | null
          base_currency: string | null
          avg_rating: number | null
          logo_url: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          founded_year?: number | null
          headquarters?: string | null
          base_currency?: string | null
          avg_rating?: number | null
          logo_url?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          founded_year?: number | null
          headquarters?: string | null
          base_currency?: string | null
          avg_rating?: number | null
          logo_url?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      broker_features: {
        Row: {
          id: string
          broker_id: string
          feature_key: string
          feature_value: string
          created_at: string
        }
        Insert: {
          id?: string
          broker_id: string
          feature_key: string
          feature_value: string
          created_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          feature_key?: string
          feature_value?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_features_broker_id_fkey"
            columns: ["broker_id"]
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          }
        ]
      }
      broker_regulation: {
        Row: {
          id: string
          broker_id: string
          country_code: string
          regulator_name: string
          license_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          broker_id: string
          country_code: string
          regulator_name: string
          license_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          country_code?: string
          regulator_name?: string
          license_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_regulation_broker_id_fkey"
            columns: ["broker_id"]
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          broker_id: string
          kind: 'editorial' | 'user'
          author: string | null
          author_id: string | null
          rating: number | null
          body: string
          lang: string
          published_at: string
          created_at: string
        }
        Insert: {
          id?: string
          broker_id: string
          kind: 'editorial' | 'user'
          author?: string | null
          author_id?: string | null
          rating?: number | null
          body: string
          lang?: string
          published_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          kind?: 'editorial' | 'user'
          author?: string | null
          author_id?: string | null
          rating?: number | null
          body?: string
          lang?: string
          published_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_broker_id_fkey"
            columns: ["broker_id"]
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          }
        ]
      }
      locales: {
        Row: {
          code: string
          label: string
          enabled: boolean
          created_at: string
        }
        Insert: {
          code: string
          label: string
          enabled?: boolean
          created_at?: string
        }
        Update: {
          code?: string
          label?: string
          enabled?: boolean
          created_at?: string
        }
        Relationships: []
      }
      broker_i18n: {
        Row: {
          id: string
          broker_id: string
          lang: string
          title: string | null
          summary: string | null
          pros: string[] | null
          cons: string[] | null
          faqs: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          broker_id: string
          lang: string
          title?: string | null
          summary?: string | null
          pros?: string[] | null
          cons?: string[] | null
          faqs?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          broker_id?: string
          lang?: string
          title?: string | null
          summary?: string | null
          pros?: string[] | null
          cons?: string[] | null
          faqs?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_i18n_broker_id_fkey"
            columns: ["broker_id"]
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_i18n_lang_fkey"
            columns: ["lang"]
            referencedRelation: "locales"
            referencedColumns: ["code"]
          }
        ]
      }
      pages_i18n: {
        Row: {
          id: string
          page_key: string
          lang: string
          t: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_key: string
          lang: string
          t: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_key?: string
          lang?: string
          t?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_i18n_lang_fkey"
            columns: ["lang"]
            referencedRelation: "locales"
            referencedColumns: ["code"]
          }
        ]
      }
      ingest_jobs: {
        Row: {
          id: string
          subject: string
          status: 'queued' | 'processing' | 'done' | 'error'
          payload: Json | null
          error: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          status?: 'queued' | 'processing' | 'done' | 'error'
          payload?: Json | null
          error?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          status?: 'queued' | 'processing' | 'done' | 'error'
          payload?: Json | null
          error?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      broker_details: {
        Row: {
          id: string
          slug: string
          name: string
          founded_year: number | null
          headquarters: string | null
          base_currency: string | null
          avg_rating: number | null
          logo_url: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
          features: Json
          regulation: Json
        }
        Relationships: []
      }
      broker_localized: {
        Row: {
          id: string
          slug: string
          name: string
          founded_year: number | null
          headquarters: string | null
          base_currency: string | null
          avg_rating: number | null
          logo_url: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
          lang: string
          title: string | null
          summary: string | null
          pros: string[] | null
          cons: string[] | null
          faqs: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      set_user_role: {
        Args: {
          user_id: string
          role_name: string
        }
        Returns: undefined
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_broker_avg_rating: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}

// Convenience types for common operations
export type Broker = Database['public']['Tables']['brokers']['Row']
export type BrokerInsert = Database['public']['Tables']['brokers']['Insert']
export type BrokerUpdate = Database['public']['Tables']['brokers']['Update']

export type BrokerFeature = Database['public']['Tables']['broker_features']['Row']
export type BrokerFeatureInsert = Database['public']['Tables']['broker_features']['Insert']

export type BrokerRegulation = Database['public']['Tables']['broker_regulation']['Row']
export type BrokerRegulationInsert = Database['public']['Tables']['broker_regulation']['Insert']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type Locale = Database['public']['Tables']['locales']['Row']
export type LocaleInsert = Database['public']['Tables']['locales']['Insert']

export type BrokerI18n = Database['public']['Tables']['broker_i18n']['Row']
export type BrokerI18nInsert = Database['public']['Tables']['broker_i18n']['Insert']
export type BrokerI18nUpdate = Database['public']['Tables']['broker_i18n']['Update']

export type PageI18n = Database['public']['Tables']['pages_i18n']['Row']
export type PageI18nInsert = Database['public']['Tables']['pages_i18n']['Insert']
export type PageI18nUpdate = Database['public']['Tables']['pages_i18n']['Update']

export type IngestJob = Database['public']['Tables']['ingest_jobs']['Row']
export type IngestJobInsert = Database['public']['Tables']['ingest_jobs']['Insert']
export type IngestJobUpdate = Database['public']['Tables']['ingest_jobs']['Update']

// View types
export type BrokerDetails = Database['public']['Views']['broker_details']['Row']
export type BrokerLocalized = Database['public']['Views']['broker_localized']['Row']

// Extended types with relationships
export interface BrokerWithFeatures extends Broker {
  broker_features: BrokerFeature[]
  broker_regulation: BrokerRegulation[]
  reviews?: Review[]
}

export interface BrokerWithI18n extends Broker {
  broker_i18n: BrokerI18n[]
}

export interface ReviewWithBroker extends Review {
  brokers: Broker
}

// Feature-specific types
export interface BrokerFeatureMap {
  min_deposit?: string
  max_leverage?: string
  spreads_from?: string
  platforms?: string
  account_types?: string
  payment_methods?: string
  customer_support?: string
  demo_account?: string
  mobile_app?: string
  web_platform?: string
  api_trading?: string
  copy_trading?: string
  social_trading?: string
  educational_resources?: string
  research_tools?: string
  market_analysis?: string
  trading_signals?: string
  risk_management?: string
  [key: string]: string | undefined
}

// Regulation-specific types
export interface RegulationInfo {
  country_code: string
  regulator_name: string
  license_id?: string
  regulation_url?: string
  investor_protection?: string
}

// FAQ structure for broker_i18n.faqs
export interface BrokerFAQ {
  question: string
  answer: string
  category?: string
  order?: number
}

// Page translation structure
export interface PageTranslations {
  [key: string]: string | PageTranslations
}

// Search and filter types
export interface BrokerSearchFilters {
  country_code?: string
  min_rating?: number
  max_min_deposit?: number
  regulators?: string[]
  features?: string[]
  asset_classes?: string[]
  platforms?: string[]
}

export interface BrokerSearchResult {
  brokers: BrokerDetails[]
  total_count: number
  filters_applied: BrokerSearchFilters
}

// Analytics types
export interface BrokerAnalytics {
  total_brokers: number
  total_reviews: number
  average_rating: number
  top_rated_brokers: Broker[]
  most_reviewed_brokers: Broker[]
  regulation_distribution: Record<string, number>
  feature_popularity: Record<string, number>
}

// Real-time subscription types
export interface RealtimePayload<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  errors: string[] | null
}

export type ReviewRealtimePayload = RealtimePayload<Review>
export type BrokerRealtimePayload = RealtimePayload<Broker>

// Error types
export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

// Auth types
export interface UserProfile {
  id: string
  email: string
  role?: 'admin' | 'user'
  created_at: string
  last_sign_in_at?: string
}

export interface AuthState {
  user: UserProfile | null
  session: any | null
  loading: boolean
  error: SupabaseError | null
}