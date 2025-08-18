/**
 * Enhanced Review Submission Hook
 * 
 * Integrates with TanStack Query for cache management and provides
 * comprehensive review submission with all security features
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { submitReview, validateReviewData } from '@/lib/reviewSubmissionHandler'
import { computeSimHash } from '@/lib/utils'
import { useAuth } from './useSupabase'

interface ReviewSubmissionData {
  rating: number
  body: string
  captchaToken: string
}

interface UseReviewSubmissionOptions {
  brokerId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

/**
 * Hook for submitting reviews with comprehensive validation,
 * security checks, and cache management
 */
export function useReviewSubmission({ 
  brokerId, 
  onSuccess, 
  onError 
}: UseReviewSubmissionOptions) {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (data: ReviewSubmissionData) => {
      if (!user) {
        throw new Error('You must be logged in to submit a review')
      }

      // Validate review data
      const validationError = validateReviewData(data)
      if (validationError) {
        throw new Error(validationError)
      }

      // Compute SimHash for duplicate detection
      const simHash = computeSimHash(data.body)

      // Submit review with all security features
      const result = await submitReview(brokerId, user.id, {
        rating: data.rating,
        body: data.body,
        captchaToken: data.captchaToken,
        simHash
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit review')
      }

      return result
    },
    onSuccess: (result) => {
      // Invalidate and refetch broker reviews
      queryClient.invalidateQueries({ 
        queryKey: ['broker-reviews', brokerId] 
      })
      
      // Invalidate broker data to update average rating and review count
      queryClient.invalidateQueries({ 
        queryKey: ['broker', brokerId] 
      })
      
      // Invalidate general broker queries
      queryClient.invalidateQueries({ 
        queryKey: ['broker'] 
      })
      
      // Invalidate broker stats if they exist
      queryClient.invalidateQueries({ 
        queryKey: ['broker-stats'] 
      })

      // Show appropriate success message
      if (result.flagged) {
        toast.success(
          'Review submitted successfully! It is currently pending moderation due to content that requires review.',
          {
            duration: 6000,
            description: 'Your review will be published after admin approval.'
          }
        )
      } else {
        toast.success(
          'Review submitted successfully!',
          {
            duration: 4000,
            description: 'Thank you for sharing your experience.'
          }
        )
      }

      // Call custom success callback
      onSuccess?.()
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(
        error.message || 'Failed to submit review',
        {
          duration: 5000,
          description: 'Please try again or contact support if the problem persists.'
        }
      )

      // Call custom error callback
      onError?.(error.message)
    }
  })
}

/**
 * Hook for invalidating review-related cache entries
 * Useful for manual cache management
 */
export function useInvalidateReviewCache() {
  const queryClient = useQueryClient()

  return {
    invalidateAllReviews: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['broker-reviews'] 
      })
    },
    invalidateBrokerReviews: (brokerId: string) => {
      queryClient.invalidateQueries({ 
        queryKey: ['broker-reviews', brokerId] 
      })
    },
    invalidateBrokerData: (brokerId?: string) => {
      if (brokerId) {
        queryClient.invalidateQueries({ 
          queryKey: ['broker', brokerId] 
        })
      } else {
        queryClient.invalidateQueries({ 
          queryKey: ['broker'] 
        })
      }
    },
    invalidateStats: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['broker-stats'] 
      })
    }
  }
}

/**
 * Hook for prefetching review data
 * Useful for optimistic updates and better UX
 */
export function usePrefetchReviews() {
  const queryClient = useQueryClient()

  return {
    prefetchBrokerReviews: async (brokerId: string, kind?: 'editorial' | 'user') => {
      await queryClient.prefetchQuery({
        queryKey: ['broker-reviews', brokerId, kind],
        queryFn: async () => {
          // This would need to be imported from supabaseHelpers
          // For now, we'll just return a placeholder
          return []
        },
        staleTime: 2 * 60 * 1000
      })
    }
  }
}

export default useReviewSubmission