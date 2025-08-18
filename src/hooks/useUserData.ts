import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import userService from '@/services/userService'
import type {
  UserProfile,
  UserPreference,
  SavedSearch,
  SavedResult,
  UserBrokerInteraction,
  UserBrokerList,
  CreateSavedSearchRequest,
  CreateSavedResultRequest,
  CreateUserBrokerListRequest,
  UpdateUserProfileRequest,
  UserAnalytics
} from '@/types/user'

// User Profile Hooks
export function useUserProfile() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => userService.getUserProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => 
      userService.updateUserProfile(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] })
    },
  })
}

// User Preferences Hooks
export function useUserPreferences() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['userPreferences', user?.id],
    queryFn: () => userService.getUserPreferences(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (preferences: Partial<UserPreference>) => 
      userService.updateUserPreferences(user!.id, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences', user?.id] })
    },
  })
}

// Saved Searches Hooks
export function useSavedSearches(page = 1, limit = 10) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['savedSearches', user?.id, page, limit],
    queryFn: () => userService.getSavedSearches(user!.id, { page, limit }),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateSavedSearch() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (data: CreateSavedSearchRequest) => 
      userService.createSavedSearch(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedSearches', user?.id] })
    },
  })
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (searchId: string) => 
      userService.deleteSavedSearch(user!.id, searchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedSearches', user?.id] })
    },
  })
}

// Saved Results Hooks
export function useSavedResults(page = 1, limit = 10) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['savedResults', user?.id, page, limit],
    queryFn: () => userService.getSavedResults(user!.id, { page, limit }),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateSavedResult() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (data: CreateSavedResultRequest) => 
      userService.createSavedResult(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedResults', user?.id] })
    },
  })
}

export function useDeleteSavedResult() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (resultId: string) => 
      userService.deleteSavedResult(user!.id, resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedResults', user?.id] })
    },
  })
}

// Broker Interactions Hooks
export function useBrokerInteractions(brokerId?: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['brokerInteractions', user?.id, brokerId],
    queryFn: () => userService.getBrokerInteractions(user!.id, brokerId),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRecordBrokerInteraction() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (data: Omit<UserBrokerInteraction, 'id' | 'user_id' | 'created_at'>) => 
      userService.recordBrokerInteraction(user!.id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['brokerInteractions', user?.id, variables.broker_id] 
      })
    },
  })
}

// Broker Lists Hooks
export function useBrokerLists() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['brokerLists', user?.id],
    queryFn: () => userService.getBrokerLists(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateBrokerList() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (data: CreateUserBrokerListRequest) => 
      userService.createBrokerList(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brokerLists', user?.id] })
    },
  })
}

export function useAddBrokerToList() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: ({ listId, brokerId, notes }: { listId: string; brokerId: string; notes?: string }) => 
      userService.addBrokerToList(user!.id, listId, brokerId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brokerLists', user?.id] })
    },
  })
}

export function useRemoveBrokerFromList() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: ({ listId, brokerId }: { listId: string; brokerId: string }) => 
      userService.removeBrokerFromList(user!.id, listId, brokerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brokerLists', user?.id] })
    },
  })
}

// Analytics Hooks
export function useUserAnalytics() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['userAnalytics', user?.id],
    queryFn: () => userService.getUserAnalytics(user!.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Combined Hook for Dashboard
export function useUserData() {
  const { user } = useAuth()
  const profile = useUserProfile()
  const preferences = useUserPreferences()
  const savedSearches = useSavedSearches(1, 5) // Recent 5
  const savedResults = useSavedResults(1, 5) // Recent 5
  const brokerLists = useBrokerLists()
  const analytics = useUserAnalytics()
  
  return {
    user,
    profile: profile.data,
    preferences: preferences.data,
    savedSearches: savedSearches.data,
    savedResults: savedResults.data,
    brokerLists: brokerLists.data,
    analytics: analytics.data,
    isLoading: profile.isLoading || preferences.isLoading || savedSearches.isLoading || savedResults.isLoading,
    error: profile.error || preferences.error || savedSearches.error || savedResults.error,
    refetch: () => {
      profile.refetch()
      preferences.refetch()
      savedSearches.refetch()
      savedResults.refetch()
      brokerLists.refetch()
      analytics.refetch()
    }
  }
}

// Utility Hooks
export function useUserStats() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      const [searches, results, interactions] = await Promise.all([
        userService.getSavedSearches(user!.id, { page: 1, limit: 1 }),
        userService.getSavedResults(user!.id, { page: 1, limit: 1 }),
        userService.getBrokerInteractions(user!.id)
      ])
      
      return {
        totalSearches: searches.total,
        totalResults: results.total,
        totalInteractions: interactions.length,
        lastActivity: Math.max(
          ...searches.data.map(s => new Date(s.created_at).getTime()),
          ...results.data.map(r => new Date(r.created_at).getTime()),
          ...interactions.map(i => new Date(i.created_at).getTime())
        )
      }
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}