// Custom React hooks
// Export all custom hooks for tree-shaking support
// Import only what you need: import { useBroker, useBrokers } from '@/hooks'

// New optimized Supabase-based broker hooks with React Query
export {
  useBroker,
  useBrokers,
  useReviews,
  useCreateReview,
  type UseBrokersParams,
  type UseReviewsParams,
  type BrokerWithAggregateData,
  type ReviewsResponse,
  type BrokersResponse,
  type CreateReviewData
} from './useBrokerQuery'

// Legacy broker hooks (deprecated - use hooks from useBrokerQuery instead)
export {
  useBroker as useLegacyBrokerHook,
  useBrokers as useLegacyBrokersHook,
  useReviews as useLegacyReviewsHook,
  useCreateReview as useLegacyCreateReviewHook,
  type UseBrokersParams as LegacyUseBrokersParams,
  type UseReviewsParams as LegacyUseReviewsParams,
  type BrokerWithAggregateData as LegacyBrokerWithAggregateData,
  type ReviewsResponse as LegacyReviewsResponse
} from './useBrokerHooks'

// Other legacy broker hooks
export {
  useBrokers as useLegacyBrokers,
  useInfiniteBrokers,
  useBroker as useLegacyBroker,
  usePopularBrokers,
  useBrokersByCountry,
  useBrokerCategories,
  useBrokerCountries,
  brokerKeys,
} from './useBrokers'

// Utility hooks
export { useDebounce } from './useDebounce'

// Safe data access hooks
export {
  useSafeBrokerData,
  useSafeBrokerProperty,
  useSafeBrokersData,
} from './useSafeBrokerData'

// Supabase hooks (if available)
export {
  useAuth,
  useBrokerReviews,
  useSubmitReview,
  useLocales,
  usePageTranslations,
  useBrokerStats,
  useRealtimeReviews,
  useUploadBrokerLogo,
  useBrokerComparison,
  useFeaturedBrokers,
  useTopRatedBrokers,
  useLocalStorage,
  useErrorHandler
} from './useSupabase'

// I18n hook (if available)
try {
  export { useI18n } from './useI18n'
} catch {
  // useI18n not available
}
