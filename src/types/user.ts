// User-related TypeScript interfaces for BrokerAnalysis Platform
// Corresponds to the user tables in user-tables-migration.sql

export interface UserProfile {
  id: string; // UUID from auth.users
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  country_code?: string;
  preferred_language: string;
  timezone: string;
  trading_experience?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  account_type?: 'individual' | 'business' | 'institutional';
  investment_goals?: string[];
  risk_tolerance?: 'conservative' | 'moderate' | 'aggressive';
  preferred_instruments?: string[];
  email_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  preference_type: 'broker' | 'instrument' | 'feature' | 'region';
  preference_key: string;
  preference_value: string;
  weight: number; // 0.0 to 1.0
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  search_criteria: Record<string, any>;
  filters?: Record<string, any>;
  sort_criteria?: Record<string, any>;
  is_favorite: boolean;
  is_alert_enabled: boolean;
  alert_frequency: 'daily' | 'weekly' | 'monthly';
  last_executed_at?: string;
  execution_count: number;
  created_at: string;
  updated_at: string;
}

export interface SavedResult {
  id: string;
  user_id: string;
  saved_search_id?: string;
  name: string;
  description?: string;
  questionnaire_responses: Record<string, any>;
  recommended_brokers: Record<string, any>;
  matching_criteria?: Record<string, any>;
  score_breakdown?: Record<string, any>;
  total_brokers_analyzed?: number;
  execution_time_ms?: number;
  is_favorite: boolean;
  tags?: string[];
  notes?: string;
  shared_publicly: boolean;
  share_token?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserBrokerInteraction {
  id: string;
  user_id: string;
  broker_id: string;
  interaction_type: 'view' | 'favorite' | 'hide' | 'compare' | 'visit_website' | 'start_application';
  interaction_data?: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export interface UserBrokerList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  list_type: 'favorites' | 'watchlist' | 'hidden' | 'custom';
  is_default: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserBrokerListItem {
  id: string;
  list_id: string;
  broker_id: string;
  notes?: string;
  sort_order: number;
  added_at: string;
}

// View interfaces
export interface UserDashboard {
  user_id: string;
  display_name?: string;
  trading_experience?: string;
  country_code?: string;
  saved_searches_count: number;
  saved_results_count: number;
  favorite_brokers_count: number;
  recent_interactions_count: number;
  last_activity_at?: string;
}

export interface BrokerPopularity {
  broker_id: string;
  broker_name: string;
  broker_slug: string;
  total_users_interacted: number;
  total_views: number;
  total_favorites: number;
  total_compares: number;
  total_website_visits: number;
  recent_interactions: number;
  favorite_rate: number;
}

export interface UserBrokerRecommendation {
  user_id: string;
  broker_id: string;
  broker_name: string;
  broker_slug: string;
  avg_rating?: number;
  user_relationship: 'favorited' | 'hidden' | 'previously_favorited' | 'neutral';
  user_view_count: number;
  last_interaction_at?: string;
}

// Form interfaces for creating/updating
export interface CreateUserProfileData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  country_code?: string;
  preferred_language?: string;
  timezone?: string;
  trading_experience?: UserProfile['trading_experience'];
  account_type?: UserProfile['account_type'];
  investment_goals?: string[];
  risk_tolerance?: UserProfile['risk_tolerance'];
  preferred_instruments?: string[];
  email_notifications?: boolean;
  marketing_emails?: boolean;
}

export interface CreateSavedSearchData {
  name: string;
  description?: string;
  search_criteria: Record<string, any>;
  filters?: Record<string, any>;
  sort_criteria?: Record<string, any>;
  is_favorite?: boolean;
  is_alert_enabled?: boolean;
  alert_frequency?: SavedSearch['alert_frequency'];
}

export interface CreateSavedResultData {
  saved_search_id?: string;
  name: string;
  description?: string;
  questionnaire_responses: Record<string, any>;
  recommended_brokers: Record<string, any>;
  matching_criteria?: Record<string, any>;
  score_breakdown?: Record<string, any>;
  total_brokers_analyzed?: number;
  execution_time_ms?: number;
  is_favorite?: boolean;
  tags?: string[];
  notes?: string;
  shared_publicly?: boolean;
  expires_at?: string;
}

export interface CreateUserBrokerListData {
  name: string;
  description?: string;
  list_type: UserBrokerList['list_type'];
  is_public?: boolean;
  sort_order?: number;
}

// API response interfaces
export interface SavedSearchWithResults extends SavedSearch {
  results_count: number;
  latest_result?: SavedResult;
}

export interface SavedResultWithSearch extends SavedResult {
  saved_search?: SavedSearch;
}

export interface UserBrokerListWithItems extends UserBrokerList {
  items: (UserBrokerListItem & {
    broker: {
      id: string;
      name: string;
      slug: string;
      logo_url?: string;
      avg_rating?: number;
    };
  })[];
  items_count: number;
}

// Utility types
export type UserPreferenceType = UserPreference['preference_type'];
export type InteractionType = UserBrokerInteraction['interaction_type'];
export type ListType = UserBrokerList['list_type'];
export type AlertFrequency = SavedSearch['alert_frequency'];
export type TradingExperience = NonNullable<UserProfile['trading_experience']>;
export type AccountType = NonNullable<UserProfile['account_type']>;
export type RiskTolerance = NonNullable<UserProfile['risk_tolerance']>;

// Filter and sort interfaces
export interface SavedSearchFilters {
  name?: string;
  is_favorite?: boolean;
  is_alert_enabled?: boolean;
  created_after?: string;
  created_before?: string;
}

export interface SavedResultFilters {
  name?: string;
  is_favorite?: boolean;
  shared_publicly?: boolean;
  has_search?: boolean;
  tags?: string[];
  created_after?: string;
  created_before?: string;
}

export interface UserBrokerInteractionFilters {
  broker_id?: string;
  interaction_type?: InteractionType;
  session_id?: string;
  created_after?: string;
  created_before?: string;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Error interfaces
export interface UserDataError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Analytics interfaces
export interface UserAnalytics {
  total_searches: number;
  total_results: number;
  total_interactions: number;
  favorite_brokers: number;
  most_viewed_brokers: Array<{
    broker_id: string;
    broker_name: string;
    view_count: number;
  }>;
  search_frequency: Array<{
    date: string;
    count: number;
  }>;
  interaction_breakdown: Record<InteractionType, number>;
}

// Export all types as a namespace for easier imports
export namespace UserTypes {
  export type Profile = UserProfile;
  export type Preference = UserPreference;
  export type Search = SavedSearch;
  export type Result = SavedResult;
  export type Interaction = UserBrokerInteraction;
  export type BrokerList = UserBrokerList;
  export type BrokerListItem = UserBrokerListItem;
  export type Dashboard = UserDashboard;
  export type Analytics = UserAnalytics;
}