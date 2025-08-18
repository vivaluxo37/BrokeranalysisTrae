// User Service for BrokerAnalysis Platform
// Handles all user-related database operations with Supabase

import { supabase } from '../lib/supabase';
import type {
  UserProfile,
  UserPreference,
  SavedSearch,
  SavedResult,
  UserBrokerInteraction,
  UserBrokerList,
  UserBrokerListItem,
  CreateUserProfileData,
  CreateSavedSearchData,
  CreateSavedResultData,
  CreateUserBrokerListData,
  SavedSearchWithResults,
  SavedResultWithSearch,
  UserBrokerListWithItems,
  UserDashboard,
  BrokerPopularity,
  UserBrokerRecommendation,
  SavedSearchFilters,
  SavedResultFilters,
  UserBrokerInteractionFilters,
  PaginationParams,
  PaginatedResponse,
  UserAnalytics,
  InteractionType,
  ListType
} from '../types/user';

// Error handling utility
export class UserServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'UserServiceError';
  }
}

// User Profile Operations
export class UserProfileService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new UserServiceError('Failed to fetch user profile', 'FETCH_PROFILE_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching profile', 'UNKNOWN_ERROR', error);
    }
  }

  static async createProfile(userId: string, profileData: CreateUserProfileData): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          ...profileData,
          preferred_language: profileData.preferred_language || 'en',
          timezone: profileData.timezone || 'UTC',
          email_notifications: profileData.email_notifications ?? true,
          marketing_emails: profileData.marketing_emails ?? false
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to create user profile', 'CREATE_PROFILE_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error creating profile', 'UNKNOWN_ERROR', error);
    }
  }

  static async updateProfile(userId: string, updates: Partial<CreateUserProfileData>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to update user profile', 'UPDATE_PROFILE_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error updating profile', 'UNKNOWN_ERROR', error);
    }
  }

  static async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new UserServiceError('Failed to delete user profile', 'DELETE_PROFILE_ERROR', error);
      }
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error deleting profile', 'UNKNOWN_ERROR', error);
    }
  }

  static async getDashboard(userId: string): Promise<UserDashboard | null> {
    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new UserServiceError('Failed to fetch user dashboard', 'FETCH_DASHBOARD_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching dashboard', 'UNKNOWN_ERROR', error);
    }
  }
}

// User Preferences Operations
export class UserPreferencesService {
  static async getPreferences(userId: string, type?: string): Promise<UserPreference[]> {
    try {
      let query = supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('weight', { ascending: false });

      if (type) {
        query = query.eq('preference_type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw new UserServiceError('Failed to fetch user preferences', 'FETCH_PREFERENCES_ERROR', error);
      }

      return data || [];
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching preferences', 'UNKNOWN_ERROR', error);
    }
  }

  static async setPreference(
    userId: string,
    type: string,
    key: string,
    value: string,
    weight: number = 1.0,
    isRequired: boolean = false
  ): Promise<UserPreference> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preference_type: type,
          preference_key: key,
          preference_value: value,
          weight: Math.max(0, Math.min(1, weight)),
          is_required: isRequired
        }, {
          onConflict: 'user_id,preference_type,preference_key'
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to set user preference', 'SET_PREFERENCE_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error setting preference', 'UNKNOWN_ERROR', error);
    }
  }

  static async removePreference(userId: string, type: string, key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', userId)
        .eq('preference_type', type)
        .eq('preference_key', key);

      if (error) {
        throw new UserServiceError('Failed to remove user preference', 'REMOVE_PREFERENCE_ERROR', error);
      }
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error removing preference', 'UNKNOWN_ERROR', error);
    }
  }
}

// Saved Searches Operations
export class SavedSearchService {
  static async getSavedSearches(
    userId: string,
    filters?: SavedSearchFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<SavedSearchWithResults>> {
    try {
      let query = supabase
        .from('saved_searches')
        .select(`
          *,
          results_count:saved_results(count),
          latest_result:saved_results(
            id,
            name,
            created_at,
            is_favorite
          )
        `, { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filters?.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters?.is_favorite !== undefined) {
        query = query.eq('is_favorite', filters.is_favorite);
      }
      if (filters?.is_alert_enabled !== undefined) {
        query = query.eq('is_alert_enabled', filters.is_alert_enabled);
      }
      if (filters?.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters?.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Apply pagination and sorting
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const sortBy = pagination?.sort_by || 'created_at';
      const sortOrder = pagination?.sort_order || 'desc';

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new UserServiceError('Failed to fetch saved searches', 'FETCH_SEARCHES_ERROR', error);
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      };
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching saved searches', 'UNKNOWN_ERROR', error);
    }
  }

  static async createSavedSearch(userId: string, searchData: CreateSavedSearchData): Promise<SavedSearch> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: userId,
          ...searchData,
          is_favorite: searchData.is_favorite || false,
          is_alert_enabled: searchData.is_alert_enabled || false,
          alert_frequency: searchData.alert_frequency || 'weekly',
          execution_count: 0
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to create saved search', 'CREATE_SEARCH_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error creating saved search', 'UNKNOWN_ERROR', error);
    }
  }

  static async updateSavedSearch(searchId: string, updates: Partial<CreateSavedSearchData>): Promise<SavedSearch> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .update(updates)
        .eq('id', searchId)
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to update saved search', 'UPDATE_SEARCH_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error updating saved search', 'UNKNOWN_ERROR', error);
    }
  }

  static async deleteSavedSearch(searchId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) {
        throw new UserServiceError('Failed to delete saved search', 'DELETE_SEARCH_ERROR', error);
      }
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error deleting saved search', 'UNKNOWN_ERROR', error);
    }
  }

  static async executeSearch(searchId: string): Promise<SavedSearch> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .update({
          last_executed_at: new Date().toISOString(),
          execution_count: supabase.raw('execution_count + 1')
        })
        .eq('id', searchId)
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to update search execution', 'EXECUTE_SEARCH_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error executing search', 'UNKNOWN_ERROR', error);
    }
  }
}

// Saved Results Operations
export class SavedResultService {
  static async getSavedResults(
    userId: string,
    filters?: SavedResultFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<SavedResultWithSearch>> {
    try {
      let query = supabase
        .from('saved_results')
        .select(`
          *,
          saved_search:saved_searches(
            id,
            name,
            description
          )
        `, { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filters?.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters?.is_favorite !== undefined) {
        query = query.eq('is_favorite', filters.is_favorite);
      }
      if (filters?.shared_publicly !== undefined) {
        query = query.eq('shared_publicly', filters.shared_publicly);
      }
      if (filters?.has_search !== undefined) {
        if (filters.has_search) {
          query = query.not('saved_search_id', 'is', null);
        } else {
          query = query.is('saved_search_id', null);
        }
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters?.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters?.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Apply pagination and sorting
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const sortBy = pagination?.sort_by || 'created_at';
      const sortOrder = pagination?.sort_order || 'desc';

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new UserServiceError('Failed to fetch saved results', 'FETCH_RESULTS_ERROR', error);
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      };
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching saved results', 'UNKNOWN_ERROR', error);
    }
  }

  static async createSavedResult(userId: string, resultData: CreateSavedResultData): Promise<SavedResult> {
    try {
      const { data, error } = await supabase
        .from('saved_results')
        .insert({
          user_id: userId,
          ...resultData,
          is_favorite: resultData.is_favorite || false,
          shared_publicly: resultData.shared_publicly || false
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to create saved result', 'CREATE_RESULT_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error creating saved result', 'UNKNOWN_ERROR', error);
    }
  }

  static async updateSavedResult(resultId: string, updates: Partial<CreateSavedResultData>): Promise<SavedResult> {
    try {
      const { data, error } = await supabase
        .from('saved_results')
        .update(updates)
        .eq('id', resultId)
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to update saved result', 'UPDATE_RESULT_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error updating saved result', 'UNKNOWN_ERROR', error);
    }
  }

  static async deleteSavedResult(resultId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_results')
        .delete()
        .eq('id', resultId);

      if (error) {
        throw new UserServiceError('Failed to delete saved result', 'DELETE_RESULT_ERROR', error);
      }
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error deleting saved result', 'UNKNOWN_ERROR', error);
    }
  }

  static async getSharedResult(shareToken: string): Promise<SavedResult | null> {
    try {
      const { data, error } = await supabase
        .from('saved_results')
        .select('*')
        .eq('share_token', shareToken)
        .eq('shared_publicly', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new UserServiceError('Failed to fetch shared result', 'FETCH_SHARED_RESULT_ERROR', error);
      }

      // Check if result has expired
      if (data?.expires_at && new Date(data.expires_at) < new Date()) {
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching shared result', 'UNKNOWN_ERROR', error);
    }
  }
}

// User Broker Interactions
export class UserBrokerInteractionService {
  static async recordInteraction(
    userId: string,
    brokerId: string,
    interactionType: InteractionType,
    interactionData?: Record<string, any>,
    sessionId?: string
  ): Promise<UserBrokerInteraction> {
    try {
      const { data, error } = await supabase
        .from('user_broker_interactions')
        .insert({
          user_id: userId,
          broker_id: brokerId,
          interaction_type: interactionType,
          interaction_data: interactionData,
          session_id: sessionId
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to record interaction', 'RECORD_INTERACTION_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error recording interaction', 'UNKNOWN_ERROR', error);
    }
  }

  static async getInteractions(
    userId: string,
    filters?: UserBrokerInteractionFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<UserBrokerInteraction>> {
    try {
      let query = supabase
        .from('user_broker_interactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filters?.broker_id) {
        query = query.eq('broker_id', filters.broker_id);
      }
      if (filters?.interaction_type) {
        query = query.eq('interaction_type', filters.interaction_type);
      }
      if (filters?.session_id) {
        query = query.eq('session_id', filters.session_id);
      }
      if (filters?.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters?.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Apply pagination and sorting
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 50;
      const sortBy = pagination?.sort_by || 'created_at';
      const sortOrder = pagination?.sort_order || 'desc';

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new UserServiceError('Failed to fetch interactions', 'FETCH_INTERACTIONS_ERROR', error);
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      };
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching interactions', 'UNKNOWN_ERROR', error);
    }
  }

  static async getBrokerPopularity(limit: number = 20): Promise<BrokerPopularity[]> {
    try {
      const { data, error } = await supabase
        .from('broker_popularity')
        .select('*')
        .order('total_users_interacted', { ascending: false })
        .limit(limit);

      if (error) {
        throw new UserServiceError('Failed to fetch broker popularity', 'FETCH_POPULARITY_ERROR', error);
      }

      return data || [];
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching broker popularity', 'UNKNOWN_ERROR', error);
    }
  }

  static async getUserBrokerRecommendations(userId: string, limit: number = 10): Promise<UserBrokerRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('user_broker_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('avg_rating', { ascending: false })
        .limit(limit);

      if (error) {
        throw new UserServiceError('Failed to fetch broker recommendations', 'FETCH_RECOMMENDATIONS_ERROR', error);
      }

      return data || [];
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching recommendations', 'UNKNOWN_ERROR', error);
    }
  }
}

// User Broker Lists
export class UserBrokerListService {
  static async getBrokerLists(userId: string): Promise<UserBrokerListWithItems[]> {
    try {
      const { data, error } = await supabase
        .from('user_broker_lists')
        .select(`
          *,
          items:user_broker_list_items(
            *,
            broker:brokers(
              id,
              name,
              slug,
              logo_url,
              avg_rating
            )
          )
        `)
        .eq('user_id', userId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new UserServiceError('Failed to fetch broker lists', 'FETCH_LISTS_ERROR', error);
      }

      return (data || []).map(list => ({
        ...list,
        items_count: list.items?.length || 0
      }));
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error fetching broker lists', 'UNKNOWN_ERROR', error);
    }
  }

  static async createBrokerList(userId: string, listData: CreateUserBrokerListData): Promise<UserBrokerList> {
    try {
      const { data, error } = await supabase
        .from('user_broker_lists')
        .insert({
          user_id: userId,
          ...listData,
          is_default: false,
          is_public: listData.is_public || false,
          sort_order: listData.sort_order || 0
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to create broker list', 'CREATE_LIST_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error creating broker list', 'UNKNOWN_ERROR', error);
    }
  }

  static async addBrokerToList(listId: string, brokerId: string, notes?: string): Promise<UserBrokerListItem> {
    try {
      // Get the next sort order
      const { data: maxOrder } = await supabase
        .from('user_broker_list_items')
        .select('sort_order')
        .eq('list_id', listId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      const sortOrder = (maxOrder?.sort_order || 0) + 1;

      const { data, error } = await supabase
        .from('user_broker_list_items')
        .insert({
          list_id: listId,
          broker_id: brokerId,
          notes: notes,
          sort_order: sortOrder
        })
        .select()
        .single();

      if (error) {
        throw new UserServiceError('Failed to add broker to list', 'ADD_BROKER_ERROR', error);
      }

      return data;
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error adding broker to list', 'UNKNOWN_ERROR', error);
    }
  }

  static async removeBrokerFromList(listId: string, brokerId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_broker_list_items')
        .delete()
        .eq('list_id', listId)
        .eq('broker_id', brokerId);

      if (error) {
        throw new UserServiceError('Failed to remove broker from list', 'REMOVE_BROKER_ERROR', error);
      }
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error removing broker from list', 'UNKNOWN_ERROR', error);
    }
  }

  static async deleteBrokerList(listId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_broker_lists')
        .delete()
        .eq('id', listId);

      if (error) {
        throw new UserServiceError('Failed to delete broker list', 'DELETE_LIST_ERROR', error);
      }
    } catch (error) {
      if (error instanceof UserServiceError) throw error;
      throw new UserServiceError('Unexpected error deleting broker list', 'UNKNOWN_ERROR', error);
    }
  }
}

// Analytics Service
export class UserAnalyticsService {
  static async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      // Get basic counts
      const [searchesResult, resultsResult, interactionsResult, favoritesResult] = await Promise.all([
        supabase.from('saved_searches').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('saved_results').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_broker_interactions').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_broker_list_items')
          .select('id', { count: 'exact' })
          .in('list_id', 
            supabase.from('user_broker_lists')
              .select('id')
              .eq('user_id', userId)
              .eq('list_type', 'favorites')
          )
      ]);

      // Get most viewed brokers
      const { data: mostViewed } = await supabase
        .from('user_broker_interactions')
        .select(`
          broker_id,
          broker:brokers(name)
        `)
        .eq('user_id', userId)
        .eq('interaction_type', 'view');

      // Process most viewed brokers
      const brokerViewCounts = mostViewed?.reduce((acc, interaction) => {
        const brokerId = interaction.broker_id;
        acc[brokerId] = (acc[brokerId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const mostViewedBrokers = Object.entries(brokerViewCounts)
        .map(([broker_id, view_count]) => ({
          broker_id,
          broker_name: mostViewed?.find(i => i.broker_id === broker_id)?.broker?.name || 'Unknown',
          view_count
        }))
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, 5);

      // Get search frequency (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: searchFrequency } = await supabase
        .from('saved_searches')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Process search frequency by day
      const searchByDay = searchFrequency?.reduce((acc, search) => {
        const date = new Date(search.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const searchFrequencyArray = Object.entries(searchByDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Get interaction breakdown
      const { data: interactions } = await supabase
        .from('user_broker_interactions')
        .select('interaction_type')
        .eq('user_id', userId);

      const interactionBreakdown = interactions?.reduce((acc, interaction) => {
        const type = interaction.interaction_type as InteractionType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<InteractionType, number>) || {} as Record<InteractionType, number>;

      return {
        total_searches: searchesResult.count || 0,
        total_results: resultsResult.count || 0,
        total_interactions: interactionsResult.count || 0,
        favorite_brokers: favoritesResult.count || 0,
        most_viewed_brokers: mostViewedBrokers,
        search_frequency: searchFrequencyArray,
        interaction_breakdown: interactionBreakdown
      };
    } catch (error) {
      throw new UserServiceError('Failed to fetch user analytics', 'FETCH_ANALYTICS_ERROR', error);
    }
  }
}

// All services are already exported individually above

// Default export with all services
export default {
  UserProfile: UserProfileService,
  UserPreferences: UserPreferencesService,
  SavedSearch: SavedSearchService,
  SavedResult: SavedResultService,
  UserBrokerInteraction: UserBrokerInteractionService,
  UserBrokerList: UserBrokerListService,
  UserAnalytics: UserAnalyticsService
};