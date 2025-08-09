/**
 * Comprehensive TypeScript interfaces for BrokerAnalysis platform
 * Defines the complete data structure for broker information, ratings, regulation, and features
 */

import { AssetClass, BrokerCategory, RegulatorType, TradingPlatform, AccountType, ReviewType } from '../enums';

// ============================================================================
// CORE BROKER INTERFACES
// ============================================================================

/**
 * Core Broker interface representing a trading broker with all essential information
 */
export interface Broker {
  /** Unique identifier for the broker */
  id: string;
  
  /** Display name of the broker */
  name: string;
  
  /** URL to the broker's logo image */
  logo: string;
  
  /** Overall rating of the broker (0-5 scale) */
  rating: number;
  
  /** Total number of reviews for this broker */
  reviewCount: number;
  
  /** List of regulatory authorities overseeing this broker */
  regulators: RegulatorType[];
  
  /** Minimum deposit required to open an account */
  minDeposit: number;
  
  /** Maximum leverage offered by the broker */
  maxLeverage: number;
  
  /** Starting spread value (in pips or percentage) */
  spreadsFrom: number;
  
  /** Asset classes available for trading */
  assetClasses: AssetClass[];
  
  /** Trading platforms supported by the broker */
  platforms: TradingPlatform[];
  
  /** Category classification of the broker */
  category: BrokerCategory;
  
  /** Whether this broker is featured on the platform */
  featured: boolean;
  
  /** Trust score of the broker (0-10 scale) */
  trustScore?: number;
  
  /** Whether this broker is regulated */
  isRegulated?: boolean;
  
  /** Optional detailed broker information */
  details?: BrokerDetails;
  
  /** Optional contact information */
  contact?: BrokerContact;
  
  /** Optional regulation details */
  regulation?: BrokerRegulation[];
  
  /** Optional features and offerings */
  features?: BrokerFeatures;
  
  /** Optional trading costs breakdown */
  costs?: BrokerCosts;
  
  /** Optional account types offered */
  accountTypes?: AccountType[];
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

/**
 * Detailed broker information beyond basic properties
 */
export interface BrokerDetails {
  /** Year the broker was established */
  foundedYear?: number;
  
  /** Headquarters location */
  headquarters?: string;
  
  /** Number of active clients */
  clientCount?: number;
  
  /** Total assets under management */
  assetsUnderManagement?: number;
  
  /** Brief description of the broker */
  description?: string;
  
  /** Website URL */
  website?: string;
  
  /** Whether the broker offers demo accounts */
  demoAccount?: boolean;
  
  /** Whether the broker offers Islamic accounts */
  islamicAccount?: boolean;
  
  /** Supported languages */
  languages?: string[];
  
  /** Countries where the broker operates */
  operatingCountries?: string[];
}

/**
 * Contact information for the broker
 */
export interface BrokerContact {
  /** Customer support email */
  email?: string;
  
  /** Customer support phone number */
  phone?: string;
  
  /** Live chat availability */
  liveChat?: boolean;
  
  /** Support hours */
  supportHours?: string;
  
  /** Physical address */
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  };
}

/**
 * Regulatory information for the broker
 */
export interface BrokerRegulation {
  /** Regulatory authority */
  authority: RegulatorType;
  
  /** License number */
  licenseNumber?: string;
  
  /** License status */
  status: 'active' | 'pending' | 'suspended' | 'revoked';
  
  /** Date when license was issued */
  issuedDate?: string;
  
  /** Date when license expires */
  expiryDate?: string;
  
  /** Jurisdiction covered by this regulation */
  jurisdiction?: string;
  
  /** Link to regulatory authority's verification page */
  verificationUrl?: string;
}

/**
 * Features and offerings provided by the broker
 */
export interface BrokerFeatures {
  /** Educational resources available */
  education?: {
    webinars: boolean;
    tutorials: boolean;
    eBooks: boolean;
    marketAnalysis: boolean;
  };
  
  /** Research and analysis tools */
  research?: {
    marketNews: boolean;
    technicalAnalysis: boolean;
    fundamentalAnalysis: boolean;
    tradingSignals: boolean;
  };
  
  /** Trading tools and features */
  trading?: {
    copyTrading: boolean;
    algorithmicTrading: boolean;
    socialTrading: boolean;
    mobileTrading: boolean;
    apiAccess: boolean;
  };
  
  /** Customer service features */
  support?: {
    multiLanguage: boolean;
    personalAccountManager: boolean;
    prioritySupport: boolean;
    phoneSupport: boolean;
  };
}

/**
 * Trading costs and fee structure
 */
export interface BrokerCosts {
  /** Spread information */
  spreads?: {
    type: 'fixed' | 'variable';
    typical: number;
    minimum: number;
    currency: string;
  };
  
  /** Commission structure */
  commissions?: {
    forex: number;
    stocks: number;
    crypto: number;
    cfd: number;
    currency: string;
  };
  
  /** Overnight financing costs */
  swapRates?: {
    long: number;
    short: number;
    currency: string;
  };
  
  /** Deposit and withdrawal fees */
  fees?: {
    deposit: number;
    withdrawal: number;
    inactivity: number;
    currency: string;
  };
}

/**
 * Rating breakdown for different aspects of the broker
 */
export interface BrokerRating {
  /** Overall rating */
  overall: number;
  
  /** Platform and tools rating */
  platform: number;
  
  /** Customer service rating */
  customerService: number;
  
  /** Costs and fees rating */
  costs: number;
  
  /** Research and education rating */
  research: number;
  
  /** Mobile trading rating */
  mobile: number;
  
  /** Trust and regulation rating */
  trust: number;
}

// ============================================================================
// REVIEW AND TESTIMONIAL INTERFACES
// ============================================================================

/**
 * User review for a broker
 */
export interface BrokerReview {
  /** Unique review identifier */
  id: string;
  
  /** Broker being reviewed */
  brokerId: string;
  
  /** Broker name for display */
  brokerName: string;
  
  /** Review rating (1-5 stars) */
  rating: number;
  
  /** Type of review */
  reviewType: ReviewType;
  
  /** Reviewer's location */
  userLocation: string;
  
  /** Date when review was submitted */
  reviewDate: string;
  
  /** Short excerpt of the review */
  excerpt: string;
  
  /** Full review content (optional) */
  content?: string;
  
  /** Whether the review is verified */
  verified?: boolean;
  
  /** Helpful votes count */
  helpfulVotes?: number;
  
  /** Trading experience level of reviewer */
  traderExperience?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * User testimonial
 */
export interface UserTestimonial {
  /** Unique testimonial identifier */
  id: string;
  
  /** Testimonial quote */
  quote: string;
  
  /** Author name */
  author: string;
  
  /** Author location */
  location: string;
  
  /** Rating given */
  rating: number;
  
  /** Whether testimonial is verified */
  verified: boolean;
  
  /** Avatar image URL */
  avatar?: string;
  
  /** Date of testimonial */
  date?: string;
}

// ============================================================================
// UTILITY AND HELPER INTERFACES
// ============================================================================

/**
 * Asset category information
 */
export interface AssetCategory {
  /** Asset class type */
  type: AssetClass;
  
  /** Display title */
  title: string;
  
  /** Description of the asset class */
  description: string;
  
  /** Number of brokers offering this asset class */
  brokerCount: number;
  
  /** Icon identifier for UI display */
  icon: string;
  
  /** Whether this category is featured */
  featured: boolean;
}

/**
 * Trading tool information
 */
export interface TradingTool {
  /** Tool type identifier */
  type: string;
  
  /** Display title */
  title: string;
  
  /** Tool description */
  description: string;
  
  /** Icon identifier */
  icon: string;
  
  /** Link to the tool */
  link: string;
  
  /** Whether the tool is popular */
  popular?: boolean;
  
  /** Difficulty level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  /** Tool features */
  features?: string[];
}

/**
 * Trust indicators for the platform
 */
export interface TrustIndicators {
  /** Total number of brokers listed */
  totalBrokers: number;
  
  /** Total number of reviews */
  totalReviews: number;
  
  /** Average rating across all brokers */
  averageRating: number;
  
  /** Number of regulated brokers */
  regulatedBrokers: number;
  
  /** Years of experience */
  yearsOfExperience: number;
  
  /** Number of countries served */
  countriesServed: number;
}

/**
 * News article interface
 */
export interface NewsArticle {
  /** Unique article identifier */
  id: string;
  
  /** Article title */
  title: string;
  
  /** Article excerpt */
  excerpt: string;
  
  /** Thumbnail image URL */
  thumbnail?: string;
  
  /** Publication date */
  publishDate: string;
  
  /** Article category */
  category: string;
  
  /** Estimated read time */
  readTime: string;
  
  /** Full article content (optional) */
  content?: string;
  
  /** Article author */
  author?: string;
  
  /** Article tags */
  tags?: string[];
}

/**
 * Education level information
 */
export interface EducationLevel {
  /** Level identifier */
  level: 'beginner' | 'intermediate' | 'advanced';
  
  /** Display title */
  title: string;
  
  /** Level description */
  description: string;
  
  /** Number of courses available */
  courseCount: number;
  
  /** Estimated completion time */
  estimatedTime: string;
}

// ============================================================================
// SEARCH AND FILTER INTERFACES
// ============================================================================

/**
 * Search filters for broker discovery
 */
export interface BrokerSearchFilters {
  /** Asset class filter */
  assetClass?: AssetClass[];
  
  /** Region filter */
  region?: string[];
  
  /** Regulation filter */
  regulation?: RegulatorType[];
  
  /** Minimum deposit range */
  minDeposit?: {
    min: number;
    max: number;
  };
  
  /** Maximum leverage range */
  maxLeverage?: {
    min: number;
    max: number;
  };
  
  /** Spread range */
  spread?: {
    min: number;
    max: number;
  };
  
  /** Platform filter */
  platforms?: TradingPlatform[];
  
  /** Account type filter */
  accountTypes?: AccountType[];
  
  /** Features filter */
  features?: string[];
  
  /** Sort criteria */
  sortBy?: 'rating' | 'reviewCount' | 'minDeposit' | 'spread' | 'name';
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Search result interface
 */
export interface BrokerSearchResult {
  /** Matching brokers */
  brokers: Broker[];
  
  /** Total number of results */
  total: number;
  
  /** Current page */
  page: number;
  
  /** Results per page */
  limit: number;
  
  /** Applied filters */
  filters: BrokerSearchFilters;
  
  /** Search execution time */
  executionTime?: number;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  Broker,
  BrokerDetails,
  BrokerContact,
  BrokerRegulation,
  BrokerFeatures,
  BrokerCosts,
  BrokerRating,
  BrokerReview,
  UserTestimonial,
  AssetCategory,
  TradingTool,
  TrustIndicators,
  NewsArticle,
  EducationLevel,
  BrokerSearchFilters,
  BrokerSearchResult
};