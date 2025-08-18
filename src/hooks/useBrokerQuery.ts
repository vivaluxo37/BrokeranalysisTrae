import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type {
  Broker,
  BrokerFeature,
  BrokerRegulation,
  BrokerI18n,
  Review,
  ReviewInsert,
  BrokerDetails
} from '../types/supabase'

// =====================================================
// TYPES
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

export interface BrokerWithAggregateData {
  broker: Broker
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

export interface BrokersResponse {
  brokers: BrokerDetails[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CreateReviewData {
  broker_id: string
  rating: number
  body: string
  lang?: string
  author?: string
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const calculateAggregateRating = async (brokerId: string): Promise<number | null> => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating, kind')
      .eq('broker_id', brokerId)
      .not('rating', 'is', null)

    if (error || !reviews || reviews.length === 0) {
      return null
    }

    // Calculate weighted average: editorial reviews have 2x weight
    let totalWeight = 0
    let weightedSum = 0

    reviews.forEach(review => {
      if (review.rating !== null) {
        const weight = review.kind === 'editorial' ? 2 : 1
        weightedSum += review.rating * weight
        totalWeight += weight
      }
    })

    return totalWeight > 0 ? weightedSum / totalWeight : null
  } catch (error) {
    console.error('Error calculating aggregate rating:', error)
    return null
  }
}

const fetchBrokerData = async (slug: string, lang: string): Promise<BrokerWithAggregateData> => {
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

  // Fetch all related data in parallel
  const [featuresResult, regulationResult, i18nResult] = await Promise.allSettled([
    supabase
      .from('broker_features')
      .select('*')
      .eq('broker_id', broker.id),
    supabase
      .from('broker_regulation')
      .select('*')
      .eq('broker_id', broker.id),
    supabase
      .from('broker_i18n')
      .select('*')
      .eq('broker_id', broker.id)
      .eq('lang', lang)
      .single()
  ])

  // Extract data from settled promises
  const features = featuresResult.status === 'fulfilled' ? featuresResult.value.data || [] : []
  const regulation = regulationResult.status === 'fulfilled' ? regulationResult.value.data || [] : []
  const i18n = i18nResult.status === 'fulfilled' ? i18nResult.value.data : null

  // Calculate aggregate rating
  const aggregateRating = await calculateAggregateRating(broker.id)

  return {
    broker,
    features,
    regulation,
    i18n,
    aggregateRating
  }
}

const fetchBrokersWithFilters = async (params: UseBrokersParams): Promise<BrokersResponse> => {
  const {
    page = 1,
    limit = 20,
    country,
    platform,
    minRating,
    sortBy = 'avg_rating',
    sortOrder = 'desc'
  } = params

  const offset = (page - 1) * limit

  let query = supabase
    .from('broker_details')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  // Apply filters
  if (country) {
    // Get broker IDs that have regulation in the specified country
    const { data: brokerIds } = await supabase
      .from('broker_regulation')
      .select('broker_id')
      .eq('country_code', country)

    if (brokerIds && brokerIds.length > 0) {
      const ids = brokerIds.map(item => item.broker_id)
      query = query.in('id', ids)
    } else {
      // No brokers found for this country
      return {
        brokers: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }

  if (platform) {
    // Get broker IDs that have the specified platform feature
    const { data: brokerIds } = await supabase
      .from('broker_features')
      .select('broker_id')
      .eq('feature_key', 'platforms')
      .ilike('feature_value', `%${platform}%`)

    if (brokerIds && brokerIds.length > 0) {
      const ids = brokerIds.map(item => item.broker_id)
      query = query.in('id', ids)
    } else {
      return {
        brokers: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }

  if (minRating) {
    query = query.gte('avg_rating', minRating)
  }

  // Apply sorting
  const ascending = sortOrder === 'asc'
  query = query.order(sortBy, { ascending })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: brokers, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch brokers: ${error.message}`)
  }

  const totalCount = count || 0
  const hasNextPage = offset + limit < totalCount
  const hasPreviousPage = page > 1

  return {
    brokers: brokers || [],
    totalCount,
    hasNextPage,
    hasPreviousPage
  }
}

const fetchReviews = async (
  brokerId: string,
  lang: string,
  page: number,
  limit: number = 10
): Promise<ReviewsResponse> => {
  const offset = (page - 1) * limit

  const { data: reviews, error, count } = await supabase
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
    reviews: reviews || [],
    totalCount,
    hasNextPage,
    hasPreviousPage
  }
}

// =====================================================
// HOOKS
// =====================================================

/**
 * Hook to fetch a single broker with all related data
 * @param slug - Broker slug identifier
 * @param lang - Language code for i18n content
 * @returns Query result with broker data, features, regulation, i18n, and aggregate rating
 */
export function useBroker(slug: string, lang: string = 'en') {
  return useQuery({
    queryKey: ['broker', slug, lang],
    queryFn: () => fetchBrokerData(slug, lang),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.message?.includes('not found')) {
        return false
      }
      return failureCount < 2
    }
  })
}

/**
 * Hook to fetch brokers with pagination and filters
 * @param params - Filter and pagination parameters
 * @returns Query result with brokers list and pagination info
 */
export function useBrokers(params: UseBrokersParams = {}) {
  return useQuery({
    queryKey: ['brokers', params],
    queryFn: () => fetchBrokersWithFilters(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
    retry: 2
  })
}

/**
 * Hook to fetch reviews for a broker with pagination
 * @param brokerId - Broker ID
 * @param lang - Language code
 * @param page - Page number (1-based)
 * @returns Query result with reviews and pagination info
 */
export function useReviews(
  brokerId: string,
  lang: string = 'en',
  page: number = 1
) {
  return useQuery({
    queryKey: ['reviews', brokerId, lang, page],
    queryFn: () => fetchReviews(brokerId, lang, page),
    enabled: !!brokerId,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    retry: 2
  })
}

/**
 * Hook to create a new review with optimistic updates
 * @returns Mutation function for creating reviews
 */
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Authentication required to submit reviews')
      }

      const insertData: ReviewInsert = {
        ...reviewData,
        kind: 'user',
        author_id: user.id,
        author: reviewData.author || user.email || 'Anonymous',
        lang: reviewData.lang || 'en',
        published_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert(insertData)
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
      const optimisticReview: Review = {
        id: `temp-${Date.now()}`,
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
          if (!old) {
            return {
              reviews: [optimisticReview],
              totalCount: 1,
              hasNextPage: false,
              hasPreviousPage: false
            }
          }
          return {
            ...old,
            reviews: [optimisticReview, ...old.reviews],
            totalCount: old.totalCount + 1
          }
        }
      )

      return { previousReviews }
    },
    onError: (err, newReview, context) => {
      // Rollback on error
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

/**
 * Hook to fetch fee comparison data for a broker
 * @param brokerId - Broker ID
 * @returns Query result with fee comparison data
 */
export function useFeeComparison(brokerId: string) {
  return useQuery({
    queryKey: ['fee-comparison', brokerId],
    queryFn: () => supabase.getFeeComparison(brokerId),
    enabled: !!brokerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

// =====================================================
// EXPORTS FOR TREE-SHAKING
// =====================================================

export type {
  UseBrokersParams,
  UseReviewsParams,
  BrokerWithAggregateData,
  ReviewsResponse,
  BrokersResponse,
  CreateReviewData
}