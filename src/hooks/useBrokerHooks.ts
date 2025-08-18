import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type {
  Broker,
  BrokerDetails,
  BrokerLocalized,
  Review,
  ReviewInsert,
  BrokerFeature,
  BrokerRegulation,
  BrokerI18n
} from '../types/supabase'

// =====================================================
// TYPES FOR HOOK PARAMETERS
// =====================================================

export interface UseBrokersParams {
  page?: number
  limit?: number
  country?: string
  platform?: string
  minRating?: number
  sortBy?: 'rating' | 'name' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface UseReviewsParams {
  page?: number
  limit?: number
}

export interface BrokerWithAggregateData extends Broker {
  features: BrokerFeature[]
  regulation: BrokerRegulation[]
  i18n: BrokerI18n | null
  aggregateRating: number | null
}

export interface ReviewsResponse {
  reviews: Review[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const calculateAggregateRating = async (brokerId: string): Promise<number | null> => {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('broker_id', brokerId)
    .not('rating', 'is', null)

  if (error || !reviews || reviews.length === 0) {
    return null
  }

  const validRatings = reviews.filter(r => r.rating !== null).map(r => r.rating as number)
  if (validRatings.length === 0) return null

  return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
}

const fetchBrokerWithData = async (slug: string, lang: string): Promise<BrokerWithAggregateData | null> => {
  // Get broker basic info
  const { data: broker, error: brokerError } = await supabase
    .from('brokers')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (brokerError || !broker) {
    throw new Error(`Broker not found: ${slug}`)
  }

  // Get features
  const { data: features, error: featuresError } = await supabase
    .from('broker_features')
    .select('*')
    .eq('broker_id', broker.id)

  if (featuresError) {
    throw new Error('Failed to fetch broker features')
  }

  // Get regulation
  const { data: regulation, error: regulationError } = await supabase
    .from('broker_regulation')
    .select('*')
    .eq('broker_id', broker.id)

  if (regulationError) {
    throw new Error('Failed to fetch broker regulation')
  }

  // Get i18n data
  const { data: i18n, error: i18nError } = await supabase
    .from('broker_i18n')
    .select('*')
    .eq('broker_id', broker.id)
    .eq('lang', lang)
    .single()

  // i18n is optional, so we don't throw on error
  const i18nData = i18nError ? null : i18n

  // Calculate aggregate rating
  const aggregateRating = await calculateAggregateRating(broker.id)

  return {
    ...broker,
    features: features || [],
    regulation: regulation || [],
    i18n: i18nData,
    aggregateRating
  }
}

const fetchBrokersWithFilters = async (params: UseBrokersParams): Promise<{ brokers: BrokerDetails[], totalCount: number }> => {
  const {
    page = 1,
    limit = 20,
    country,
    platform,
    minRating,
    sortBy = 'rating',
    sortOrder = 'desc'
  } = params

  const offset = (page - 1) * limit

  let query = supabase
    .from('broker_details')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  // Apply filters
  if (country) {
    // Filter by regulation country
    const { data: brokerIds } = await supabase
      .from('broker_regulation')
      .select('broker_id')
      .eq('country_code', country)

    if (brokerIds && brokerIds.length > 0) {
      const ids = brokerIds.map(b => b.broker_id)
      query = query.in('id', ids)
    } else {
      // No brokers found for this country
      return { brokers: [], totalCount: 0 }
    }
  }

  if (platform) {
    // Filter by platform feature
    const { data: brokerIds } = await supabase
      .from('broker_features')
      .select('broker_id')
      .eq('feature_key', 'platforms')
      .ilike('feature_value', `%${platform}%`)

    if (brokerIds && brokerIds.length > 0) {
      const ids = brokerIds.map(b => b.broker_id)
      query = query.in('id', ids)
    } else {
      return { brokers: [], totalCount: 0 }
    }
  }

  if (minRating) {
    query = query.gte('avg_rating', minRating)
  }

  // Apply sorting
  const sortColumn = sortBy === 'rating' ? 'avg_rating' : sortBy
  query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch brokers: ${error.message}`)
  }

  return {
    brokers: data || [],
    totalCount: count || 0
  }
}

const fetchReviewsPaginated = async (
  brokerId: string,
  lang: string,
  params: UseReviewsParams
): Promise<ReviewsResponse> => {
  const { page = 1, limit = 10 } = params
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('broker_id', brokerId)
    .eq('lang', lang)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`)
  }

  const totalCount = count || 0
  const hasNextPage = offset + limit < totalCount
  const hasPreviousPage = page > 1

  return {
    reviews: data || [],
    totalCount,
    hasNextPage,
    hasPreviousPage
  }
}

// =====================================================
// HOOKS
// =====================================================

/**
 * Hook to fetch a single broker with features, regulation, i18n, and aggregate rating
 * @param slug - Broker slug
 * @param lang - Language code for i18n data
 */
export function useBroker(slug: string, lang: string = 'en') {
  return useQuery({
    queryKey: ['broker', slug, lang],
    queryFn: () => fetchBrokerWithData(slug, lang),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404-like errors
      if (error?.message?.includes('not found')) {
        return false
      }
      return failureCount < 2
    }
  })
}

/**
 * Hook to fetch brokers list with pagination and filters
 * @param params - Filter and pagination parameters
 */
export function useBrokers(params: UseBrokersParams = {}) {
  return useQuery({
    queryKey: ['brokers', params],
    queryFn: () => fetchBrokersWithFilters(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // For smooth pagination
    retry: 2
  })
}

/**
 * Hook to fetch paginated reviews for a broker
 * @param brokerId - Broker ID
 * @param lang - Language code
 * @param page - Page number (1-based)
 */
export function useReviews(
  brokerId: string,
  lang: string = 'en',
  page: number = 1
) {
  const params: UseReviewsParams = { page }
  
  return useQuery({
    queryKey: ['reviews', brokerId, lang, page],
    queryFn: () => fetchReviewsPaginated(brokerId, lang, params),
    enabled: !!brokerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // For smooth pagination
    retry: 2
  })
}

/**
 * Hook to create a new review with optimistic updates
 */
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reviewData: {
      broker_id: string
      rating: number
      body: string
      lang?: string
      author?: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to submit reviews')
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          kind: 'user' as const,
          author_id: user.id,
          author: reviewData.author || user.email || 'Anonymous',
          lang: reviewData.lang || 'en',
          published_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create review: ${error.message}`)
      }

      return data
    },
    onMutate: async (newReview) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['reviews', newReview.broker_id] 
      })

      // Snapshot the previous value
      const previousReviews = queryClient.getQueryData([
        'reviews', 
        newReview.broker_id, 
        newReview.lang || 'en', 
        1
      ])

      // Optimistically update to the new value
      if (previousReviews) {
        const optimisticReview: Review = {
          id: 'temp-' + Date.now(),
          broker_id: newReview.broker_id,
          kind: 'user',
          author: newReview.author || 'You',
          author_id: 'temp-user-id',
          rating: newReview.rating,
          body: newReview.body,
          lang: newReview.lang || 'en',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }

        queryClient.setQueryData(
          ['reviews', newReview.broker_id, newReview.lang || 'en', 1],
          (old: ReviewsResponse | undefined) => {
            if (!old) return old
            return {
              ...old,
              reviews: [optimisticReview, ...old.reviews],
              totalCount: old.totalCount + 1
            }
          }
        )
      }

      return { previousReviews }
    },
    onError: (err, newReview, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousReviews) {
        queryClient.setQueryData(
          ['reviews', newReview.broker_id, newReview.lang || 'en', 1],
          context.previousReviews
        )
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.broker_id] 
      })
      
      // Also invalidate broker data to update aggregate rating
      queryClient.invalidateQueries({ 
        queryKey: ['broker'] 
      })
    }
  })
}

// =====================================================
// EXPORT ALL HOOKS FOR TREE-SHAKING
// =====================================================

export { useBroker, useBrokers, useReviews, useCreateReview }
export type { UseBrokersParams, UseReviewsParams, BrokerWithAggregateData, ReviewsResponse }