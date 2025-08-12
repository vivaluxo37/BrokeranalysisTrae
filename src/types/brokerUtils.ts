/**
 * Type utility functions for BrokerAnalysis platform
 * Provides helper functions for data validation, transformation, and type guards
 */

import { z } from 'zod';
import {
  AssetCategory,
  Broker,
  BrokerContact,
  BrokerCosts,
  BrokerDetails,
  BrokerFeatures,
  BrokerRating,
  BrokerRegulation,
  BrokerReview,
  BrokerSearchFilters,
  BrokerSearchResult,
  EducationLevel,
  NewsArticle,
  TradingTool,
  TrustIndicators,
  UserTestimonial
} from './broker';
import {
  AssetCategorySchema,
  BrokerReviewSchema,
  BrokerSchema,
  BrokerSearchFiltersSchema,
  BrokerSearchResultSchema,
  EducationLevelSchema,
  NewsArticleSchema,
  TradingToolSchema,
  TrustIndicatorsSchema,
  UserTestimonialSchema,
  validateBroker,
  validateBrokerReview,
  validateBrokers,
  validateNewsArticle,
  validateSearchFilters,
  validateSearchResult,
  validateTrustIndicators,
  validateUserTestimonial
} from './brokerValidation';
import { AccountType, AssetClass, BrokerCategory, RegulatorType, ReviewType, TradingPlatform } from '../enums';

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if an object is a valid Broker
 */
export function isBroker(obj: unknown): obj is Broker {
  const result = validateBroker(obj);
  return result.success;
}

/**
 * Type guard to check if an object is a valid BrokerReview
 */
export function isBrokerReview(obj: unknown): obj is BrokerReview {
  const result = validateBrokerReview(obj);
  return result.success;
}

/**
 * Type guard to check if an object is a valid UserTestimonial
 */
export function isUserTestimonial(obj: unknown): obj is UserTestimonial {
  const result = validateUserTestimonial(obj);
  return result.success;
}

/**
 * Type guard to check if an object is a valid AssetCategory
 */
export function isAssetCategory(obj: unknown): obj is AssetCategory {
  const result = AssetCategorySchema.safeParse(obj);
  return result.success;
}

/**
 * Type guard to check if an object is a valid TradingTool
 */
export function isTradingTool(obj: unknown): obj is TradingTool {
  const result = TradingToolSchema.safeParse(obj);
  return result.success;
}

/**
 * Type guard to check if an object is a valid NewsArticle
 */
export function isNewsArticle(obj: unknown): obj is NewsArticle {
  const result = validateNewsArticle(obj);
  return result.success;
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Safely parses and validates broker data
 */
export function parseBrokerData(data: unknown): { success: true; data: Broker } | { success: false; error: string } {
  const result = validateBroker(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    error: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
  };
}

/**
 * Safely parses and validates an array of brokers
 */
export function parseBrokersData(data: unknown): { success: true; data: Broker[] } | { success: false; error: string } {
  const result = validateBrokers(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    error: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
  };
}

/**
 * Transforms raw broker data to ensure all required fields are present
 */
export function normalizeBrokerData(rawData: Partial<Broker> & Pick<Broker, 'id' | 'name'>): Broker {
  const defaultBroker: Broker = {
    id: rawData.id,
    name: rawData.name,
    logo: rawData.logo || '/assets/brokers/fallbacks/default-logo.png',
    rating: rawData.rating || 0,
    reviewCount: rawData.reviewCount || 0,
    regulators: rawData.regulators || [],
    minDeposit: rawData.minDeposit || 0,
    maxLeverage: rawData.maxLeverage || 1,
    spreadsFrom: rawData.spreadsFrom || 0,
    assetClasses: rawData.assetClasses || [AssetClass.FOREX],
    platforms: rawData.platforms || [TradingPlatform.MT4],
    category: rawData.category || BrokerCategory.RETAIL,
    featured: rawData.featured || false,
    ...rawData
  };
  
  return defaultBroker;
}

/**
 * Calculates overall broker rating from individual rating components
 */
export function calculateOverallRating(rating: Partial<BrokerRating>): number {
  const weights = {
    platform: 0.2,
    customerService: 0.15,
    costs: 0.2,
    research: 0.1,
    mobile: 0.1,
    trust: 0.25
  };
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  Object.entries(weights).forEach(([key, weight]) => {
    const value = rating[key as keyof BrokerRating];
    if (typeof value === 'number' && value >= 0 && value <= 5) {
      weightedSum += value * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
}

/**
 * Formats broker minimum deposit for display
 */
export function formatMinDeposit(amount: number, currency = 'USD'): string {
  if (amount === 0) return 'No minimum';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
}

/**
 * Formats leverage ratio for display
 */
export function formatLeverage(leverage: number): string {
  if (leverage <= 1) return '1:1';
  return `1:${leverage}`;
}

/**
 * Formats spread value for display
 */
export function formatSpread(spread: number, unit: 'pips' | 'percentage' = 'pips'): string {
  if (unit === 'percentage') {
    return `${(spread * 100).toFixed(2)}%`;
  }
  return `${spread} pips`;
}

// ============================================================================
// SEARCH AND FILTER UTILITIES
// ============================================================================

/**
 * Filters brokers based on search criteria
 */
export function filterBrokers(brokers: Broker[], filters: BrokerSearchFilters): Broker[] {
  return brokers.filter(broker => {
    // Asset class filter
    if (filters.assetClass && filters.assetClass.length > 0) {
      const hasMatchingAsset = filters.assetClass.some(asset => 
        broker.assetClasses.includes(asset)
      );
      if (!hasMatchingAsset) return false;
    }
    
    // Regulation filter
    if (filters.regulation && filters.regulation.length > 0) {
      const hasMatchingRegulator = filters.regulation.some(regulator => 
        broker.regulators.includes(regulator)
      );
      if (!hasMatchingRegulator) return false;
    }
    
    // Minimum deposit filter
    if (filters.minDeposit) {
      if (broker.minDeposit < filters.minDeposit.min || 
          broker.minDeposit > filters.minDeposit.max) {
        return false;
      }
    }
    
    // Maximum leverage filter
    if (filters.maxLeverage) {
      if (broker.maxLeverage < filters.maxLeverage.min || 
          broker.maxLeverage > filters.maxLeverage.max) {
        return false;
      }
    }
    
    // Spread filter
    if (filters.spread) {
      if (broker.spreadsFrom < filters.spread.min || 
          broker.spreadsFrom > filters.spread.max) {
        return false;
      }
    }
    
    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      const hasMatchingPlatform = filters.platforms.some(platform => 
        broker.platforms.includes(platform)
      );
      if (!hasMatchingPlatform) return false;
    }
    
    // Account type filter
    if (filters.accountTypes && filters.accountTypes.length > 0) {
      const hasMatchingAccountType = filters.accountTypes.some(accountType => 
        broker.accountTypes?.includes(accountType)
      );
      if (!hasMatchingAccountType) return false;
    }
    
    return true;
  });
}

/**
 * Sorts brokers based on specified criteria
 */
export function sortBrokers(brokers: Broker[], sortBy: string, direction: 'asc' | 'desc' = 'desc'): Broker[] {
  const sorted = [...brokers].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;
    
    switch (sortBy) {
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'reviewCount':
        aValue = a.reviewCount;
        bValue = b.reviewCount;
        break;
      case 'minDeposit':
        aValue = a.minDeposit;
        bValue = b.minDeposit;
        break;
      case 'spread':
        aValue = a.spreadsFrom;
        bValue = b.spreadsFrom;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  return sorted;
}

/**
 * Searches brokers by name or description
 */
export function searchBrokers(brokers: Broker[], query: string): Broker[] {
  if (!query.trim()) return brokers;
  
  const searchTerm = query.toLowerCase().trim();
  
  return brokers.filter(broker => {
    // Search in broker name
    if (broker.name.toLowerCase().includes(searchTerm)) return true;
    
    // Search in broker description
    if (broker.details?.description?.toLowerCase().includes(searchTerm)) return true;
    
    // Search in asset classes
    if (broker.assetClasses.some(asset => 
      asset.toLowerCase().includes(searchTerm)
    )) return true;
    
    // Search in platforms
    if (broker.platforms.some(platform => 
      platform.toLowerCase().includes(searchTerm)
    )) return true;
    
    return false;
  });
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates if a broker has all required regulatory information
 */
export function hasValidRegulation(broker: Broker): boolean {
  if (!broker.regulation || broker.regulation.length === 0) {
    return broker.regulators.length > 0;
  }
  
  return broker.regulation.every(reg => 
    reg.status === 'active' && reg.authority
  );
}

/**
 * Validates if a broker has complete contact information
 */
export function hasCompleteContact(broker: Broker): boolean {
  if (!broker.contact) return false;
  
  return !!(broker.contact.email || broker.contact.phone || broker.contact.liveChat);
}

/**
 * Calculates a trust score for a broker based on various factors
 */
export function calculateTrustScore(broker: Broker): number {
  let score = 0;
  
  // Regulation score (40% weight)
  if (hasValidRegulation(broker)) {
    score += 40;
    
    // Bonus for multiple regulators
    if (broker.regulators.length > 1) {
      score += 10;
    }
  }
  
  // Review score (30% weight)
  if (broker.reviewCount > 0) {
    const reviewScore = Math.min(broker.reviewCount / 100, 1) * 20;
    const ratingScore = (broker.rating / 5) * 10;
    score += reviewScore + ratingScore;
  }
  
  // Contact information (10% weight)
  if (hasCompleteContact(broker)) {
    score += 10;
  }
  
  // Years in business (10% weight)
  if (broker.details?.foundedYear) {
    const yearsInBusiness = new Date().getFullYear() - broker.details.foundedYear;
    const yearsScore = Math.min(yearsInBusiness / 10, 1) * 10;
    score += yearsScore;
  }
  
  // Platform diversity (10% weight)
  if (broker.platforms.length >= 2) {
    score += 10;
  }
  
  return Math.min(Math.round(score), 100);
}

// ============================================================================
// MOCK DATA UTILITIES
// ============================================================================

/**
 * Creates a mock broker for testing purposes
 */
export function createMockBroker(overrides: Partial<Broker> = {}): Broker {
  const defaultBroker: Broker = {
    id: 'mock-broker-1',
    name: 'Mock Broker',
    logo: '/assets/brokers/fallbacks/default-logo.png',
    rating: 4.2,
    reviewCount: 150,
    regulators: [RegulatorType.FCA],
    minDeposit: 100,
    maxLeverage: 500,
    spreadsFrom: 0.8,
    assetClasses: [AssetClass.FOREX, AssetClass.STOCKS],
    platforms: [TradingPlatform.MT4, TradingPlatform.MT5],
    category: BrokerCategory.RETAIL,
    featured: false
  };
  
  return { ...defaultBroker, ...overrides };
}

/**
 * Creates mock broker review for testing
 */
export function createMockReview(overrides: Partial<BrokerReview> = {}): BrokerReview {
  const defaultReview: BrokerReview = {
    id: 'mock-review-1',
    brokerId: 'mock-broker-1',
    brokerName: 'Mock Broker',
    rating: 4,
    reviewType: ReviewType.VERIFIED,
    userLocation: 'United Kingdom',
    reviewDate: new Date().toISOString().split('T')[0],
    excerpt: 'Great broker with excellent customer service and competitive spreads.'
  };
  
  return { ...defaultReview, ...overrides };
}

// ============================================================================
// EXPORTS
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
} from './broker';

export {
  validateBroker,
  validateBrokers,
  validateBrokerReview,
  validateSearchFilters,
  validateSearchResult,
  validateTrustIndicators,
  validateNewsArticle,
  validateUserTestimonial
} from './brokerValidation';
