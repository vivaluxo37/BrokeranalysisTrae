/**
 * Zod validation schemas for BrokerAnalysis platform
 * Provides runtime validation for all broker-related data structures
 */

import { z } from 'zod';
import { AccountType, AssetClass, BrokerCategory, RegulatorType, ReviewType, TradingPlatform } from '../enums';

// ============================================================================
// ENUM VALIDATION SCHEMAS
// ============================================================================

const AssetClassSchema = z.nativeEnum(AssetClass);
const BrokerCategorySchema = z.nativeEnum(BrokerCategory);
const RegulatorTypeSchema = z.nativeEnum(RegulatorType);
const TradingPlatformSchema = z.nativeEnum(TradingPlatform);
const AccountTypeSchema = z.nativeEnum(AccountType);
const ReviewTypeSchema = z.nativeEnum(ReviewType);

// ============================================================================
// SUPPORTING SCHEMAS
// ============================================================================

/**
 * Address validation schema
 */
const AddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional()
});

/**
 * Education features schema
 */
const EducationFeaturesSchema = z.object({
  webinars: z.boolean(),
  tutorials: z.boolean(),
  eBooks: z.boolean(),
  marketAnalysis: z.boolean()
});

/**
 * Research features schema
 */
const ResearchFeaturesSchema = z.object({
  marketNews: z.boolean(),
  technicalAnalysis: z.boolean(),
  fundamentalAnalysis: z.boolean(),
  tradingSignals: z.boolean()
});

/**
 * Trading features schema
 */
const TradingFeaturesSchema = z.object({
  copyTrading: z.boolean(),
  algorithmicTrading: z.boolean(),
  socialTrading: z.boolean(),
  mobileTrading: z.boolean(),
  apiAccess: z.boolean()
});

/**
 * Support features schema
 */
const SupportFeaturesSchema = z.object({
  multiLanguage: z.boolean(),
  personalAccountManager: z.boolean(),
  prioritySupport: z.boolean(),
  phoneSupport: z.boolean()
});

/**
 * Spread information schema
 */
const SpreadSchema = z.object({
  type: z.enum(['fixed', 'variable']),
  typical: z.number().min(0, 'Typical spread must be non-negative'),
  minimum: z.number().min(0, 'Minimum spread must be non-negative'),
  currency: z.string().min(1, 'Currency is required')
});

/**
 * Commission structure schema
 */
const CommissionSchema = z.object({
  forex: z.number().min(0, 'Forex commission must be non-negative'),
  stocks: z.number().min(0, 'Stocks commission must be non-negative'),
  crypto: z.number().min(0, 'Crypto commission must be non-negative'),
  cfd: z.number().min(0, 'CFD commission must be non-negative'),
  currency: z.string().min(1, 'Currency is required')
});

/**
 * Swap rates schema
 */
const SwapRatesSchema = z.object({
  long: z.number(),
  short: z.number(),
  currency: z.string().min(1, 'Currency is required')
});

/**
 * Fees schema
 */
const FeesSchema = z.object({
  deposit: z.number().min(0, 'Deposit fee must be non-negative'),
  withdrawal: z.number().min(0, 'Withdrawal fee must be non-negative'),
  inactivity: z.number().min(0, 'Inactivity fee must be non-negative'),
  currency: z.string().min(1, 'Currency is required')
});

// ============================================================================
// MAIN INTERFACE SCHEMAS
// ============================================================================

/**
 * Broker details validation schema
 */
export const BrokerDetailsSchema = z.object({
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  headquarters: z.string().optional(),
  clientCount: z.number().int().min(0).optional(),
  assetsUnderManagement: z.number().min(0).optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  demoAccount: z.boolean().optional(),
  islamicAccount: z.boolean().optional(),
  languages: z.array(z.string()).optional(),
  operatingCountries: z.array(z.string()).optional()
});

/**
 * Broker contact validation schema
 */
export const BrokerContactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  liveChat: z.boolean().optional(),
  supportHours: z.string().optional(),
  address: AddressSchema.optional()
});

/**
 * Broker regulation validation schema
 */
export const BrokerRegulationSchema = z.object({
  authority: RegulatorTypeSchema,
  licenseNumber: z.string().optional(),
  status: z.enum(['active', 'pending', 'suspended', 'revoked']),
  issuedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  jurisdiction: z.string().optional(),
  verificationUrl: z.string().url().optional()
});

/**
 * Broker features validation schema
 */
export const BrokerFeaturesSchema = z.object({
  education: EducationFeaturesSchema.optional(),
  research: ResearchFeaturesSchema.optional(),
  trading: TradingFeaturesSchema.optional(),
  support: SupportFeaturesSchema.optional()
});

/**
 * Broker costs validation schema
 */
export const BrokerCostsSchema = z.object({
  spreads: SpreadSchema.optional(),
  commissions: CommissionSchema.optional(),
  swapRates: SwapRatesSchema.optional(),
  fees: FeesSchema.optional()
});

/**
 * Broker rating validation schema
 */
export const BrokerRatingSchema = z.object({
  overall: z.number().min(0).max(5),
  platform: z.number().min(0).max(5),
  customerService: z.number().min(0).max(5),
  costs: z.number().min(0).max(5),
  research: z.number().min(0).max(5),
  mobile: z.number().min(0).max(5),
  trust: z.number().min(0).max(5)
});

/**
 * Core Broker validation schema
 */
export const BrokerSchema = z.object({
  id: z.string().min(1, 'Broker ID is required'),
  name: z.string().min(1, 'Broker name is required'),
  logo: z.string().url('Logo must be a valid URL'),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  reviewCount: z.number().int().min(0, 'Review count must be non-negative'),
  regulators: z.array(RegulatorTypeSchema).min(1, 'At least one regulator is required'),
  minDeposit: z.number().min(0, 'Minimum deposit must be non-negative'),
  maxLeverage: z.number().min(1, 'Maximum leverage must be at least 1'),
  spreadsFrom: z.number().min(0, 'Spreads must be non-negative'),
  assetClasses: z.array(AssetClassSchema).min(1, 'At least one asset class is required'),
  platforms: z.array(TradingPlatformSchema).min(1, 'At least one platform is required'),
  category: BrokerCategorySchema,
  featured: z.boolean(),
  details: BrokerDetailsSchema.optional(),
  contact: BrokerContactSchema.optional(),
  regulation: z.array(BrokerRegulationSchema).optional(),
  features: BrokerFeaturesSchema.optional(),
  costs: BrokerCostsSchema.optional(),
  accountTypes: z.array(AccountTypeSchema).optional()
});

/**
 * Broker review validation schema
 */
export const BrokerReviewSchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
  brokerId: z.string().min(1, 'Broker ID is required'),
  brokerName: z.string().min(1, 'Broker name is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  reviewType: ReviewTypeSchema,
  userLocation: z.string().min(1, 'User location is required'),
  reviewDate: z.string().min(1, 'Review date is required'),
  excerpt: z.string().min(1, 'Review excerpt is required'),
  content: z.string().optional(),
  verified: z.boolean().optional(),
  helpfulVotes: z.number().int().min(0).optional(),
  traderExperience: z.enum(['beginner', 'intermediate', 'advanced']).optional()
});

/**
 * User testimonial validation schema
 */
export const UserTestimonialSchema = z.object({
  id: z.string().min(1, 'Testimonial ID is required'),
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
  location: z.string().min(1, 'Location is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  verified: z.boolean(),
  avatar: z.string().url().optional(),
  date: z.string().optional()
});

/**
 * Asset category validation schema
 */
export const AssetCategorySchema = z.object({
  type: AssetClassSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  brokerCount: z.number().int().min(0, 'Broker count must be non-negative'),
  icon: z.string().min(1, 'Icon is required'),
  featured: z.boolean()
});

/**
 * Trading tool validation schema
 */
export const TradingToolSchema = z.object({
  type: z.string().min(1, 'Tool type is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  link: z.string().url('Link must be a valid URL'),
  popular: z.boolean().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  features: z.array(z.string()).optional()
});

/**
 * Trust indicators validation schema
 */
export const TrustIndicatorsSchema = z.object({
  totalBrokers: z.number().int().min(0, 'Total brokers must be non-negative'),
  totalReviews: z.number().int().min(0, 'Total reviews must be non-negative'),
  averageRating: z.number().min(0).max(5, 'Average rating must be between 0 and 5'),
  regulatedBrokers: z.number().int().min(0, 'Regulated brokers must be non-negative'),
  yearsOfExperience: z.number().int().min(0, 'Years of experience must be non-negative'),
  countriesServed: z.number().int().min(0, 'Countries served must be non-negative')
});

/**
 * News article validation schema
 */
export const NewsArticleSchema = z.object({
  id: z.string().min(1, 'Article ID is required'),
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  thumbnail: z.string().url().optional(),
  publishDate: z.string().min(1, 'Publish date is required'),
  category: z.string().min(1, 'Category is required'),
  readTime: z.string().min(1, 'Read time is required'),
  content: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional()
});

/**
 * Education level validation schema
 */
export const EducationLevelSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  courseCount: z.number().int().min(0, 'Course count must be non-negative'),
  estimatedTime: z.string().min(1, 'Estimated time is required')
});

/**
 * Broker search filters validation schema
 */
export const BrokerSearchFiltersSchema = z.object({
  assetClass: z.array(AssetClassSchema).optional(),
  region: z.array(z.string()).optional(),
  regulation: z.array(RegulatorTypeSchema).optional(),
  minDeposit: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }).optional(),
  maxLeverage: z.object({
    min: z.number().min(1),
    max: z.number().min(1)
  }).optional(),
  spread: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }).optional(),
  platforms: z.array(TradingPlatformSchema).optional(),
  accountTypes: z.array(AccountTypeSchema).optional(),
  features: z.array(z.string()).optional(),
  sortBy: z.enum(['rating', 'reviewCount', 'minDeposit', 'spread', 'name']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional()
});

/**
 * Broker search result validation schema
 */
export const BrokerSearchResultSchema = z.object({
  brokers: z.array(BrokerSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
  page: z.number().int().min(1, 'Page must be at least 1'),
  limit: z.number().int().min(1, 'Limit must be at least 1'),
  filters: BrokerSearchFiltersSchema,
  executionTime: z.number().min(0).optional()
});

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validates a broker object and returns validation result
 */
export function validateBroker(data: unknown) {
  return BrokerSchema.safeParse(data);
}

/**
 * Validates an array of brokers
 */
export function validateBrokers(data: unknown) {
  return z.array(BrokerSchema).safeParse(data);
}

/**
 * Validates a broker review
 */
export function validateBrokerReview(data: unknown) {
  return BrokerReviewSchema.safeParse(data);
}

/**
 * Validates search filters
 */
export function validateSearchFilters(data: unknown) {
  return BrokerSearchFiltersSchema.safeParse(data);
}

/**
 * Validates search results
 */
export function validateSearchResult(data: unknown) {
  return BrokerSearchResultSchema.safeParse(data);
}

/**
 * Validates trust indicators
 */
export function validateTrustIndicators(data: unknown) {
  return TrustIndicatorsSchema.safeParse(data);
}

/**
 * Validates news article
 */
export function validateNewsArticle(data: unknown) {
  return NewsArticleSchema.safeParse(data);
}

/**
 * Validates user testimonial
 */
export function validateUserTestimonial(data: unknown) {
  return UserTestimonialSchema.safeParse(data);
}

// All schemas are already exported individually above
// No need for duplicate exports