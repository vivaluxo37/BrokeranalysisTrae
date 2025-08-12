/**
 * Type-safe data access utilities for broker data
 * 
 * This file provides safe, convenient, and type-safe access to broker data
 * with proper error handling, validation, and performance optimization.
 * 
 * @fileoverview Type-safe broker data access layer
 * @version 1.0.0
 * @since 2025-01-10
 */

import type { Broker, BrokerRating } from '../types/brokerTypes';
import { brokers } from '../data/brokers/brokerData';
import { brokerRatings, getBrokerRating } from '../data/brokers/brokerRatings';
import { meetsMinimumRequirements, validateBroker } from './brokerValidation';
import type { SafeCollection } from './SafeCollection';
import { SafeCollectionImpl } from './SafeCollection';

// Type definitions for data access
export interface BrokerSearchOptions {
  minRating?: number;
  maxMinDeposit?: number;
  assetClasses?: string[];
  platforms?: string[];
  jurisdictions?: string[];
  minTrustScore?: number;
  regulatedOnly?: boolean;
}

export interface BrokerSortOptions {
  sortBy: 'rating' | 'trustScore' | 'minDeposit' | 'name' | 'reviewCount';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface BrokerQueryResult {
  brokers: Broker[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BrokerWithRating extends Broker {
  ratingData: BrokerRating;
}

/**
 * Safe broker data access class
 */
export class BrokerDataAccess {
  private static instance: BrokerDataAccess;
  private brokerCollection: SafeCollection<Broker>;
  private brokerMap: Map<string, Broker>;
  private ratingMap: Map<string, BrokerRating>;

  private constructor() {
    this.brokerCollection = new SafeCollectionImpl(brokers);
    this.brokerMap = new Map(brokers.map(broker => [broker.id, broker]));
    this.ratingMap = new Map(Object.entries(brokerRatings));
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BrokerDataAccess {
    if (!BrokerDataAccess.instance) {
      BrokerDataAccess.instance = new BrokerDataAccess();
    }
    return BrokerDataAccess.instance;
  }

  /**
   * Get broker by ID safely
   * @param id - Broker ID
   * @returns Broker object or null if not found
   */
  public getBrokerById(id: string): Broker | null {
    if (!id || typeof id !== 'string') {
      return null;
    }
    return this.brokerMap.get(id) || null;
  }

  /**
   * Get broker with rating data
   * @param id - Broker ID
   * @returns Broker with rating data or null if not found
   */
  public getBrokerWithRating(id: string): BrokerWithRating | null {
    const broker = this.getBrokerById(id);
    if (!broker) {
      return null;
    }

    const ratingData = this.ratingMap.get(id);
    if (!ratingData) {
      return null;
    }

    return {
      ...broker,
      ratingData
    };
  }

  /**
   * Get multiple brokers by IDs
   * @param ids - Array of broker IDs
   * @returns Array of found brokers (excludes not found)
   */
  public getBrokersByIds(ids: string[]): Broker[] {
    if (!Array.isArray(ids)) {
      return [];
    }

    return ids
      .map(id => this.getBrokerById(id))
      .filter((broker): broker is Broker => broker !== null);
  }

  /**
   * Get all brokers safely
   * @returns Safe collection of all brokers
   */
  public getAllBrokers(): SafeCollection<Broker> {
    return this.brokerCollection;
  }

  /**
   * Search brokers with filters
   * @param options - Search options
   * @returns Array of matching brokers
   */
  public searchBrokers(options: BrokerSearchOptions = {}): Broker[] {
    return this.brokerCollection
      .filter(broker => {
        // Rating filter
        if (options.minRating && broker.rating < options.minRating) {
          return false;
        }

        // Minimum deposit filter
        if (options.maxMinDeposit && broker.minDeposit > options.maxMinDeposit) {
          return false;
        }

        // Trust score filter
        if (options.minTrustScore && broker.trustScore < options.minTrustScore) {
          return false;
        }

        // Asset classes filter
        if (options.assetClasses && options.assetClasses.length > 0) {
          const hasMatchingAsset = options.assetClasses.some(asset => 
            broker.assetClasses.includes(asset)
          );
          if (!hasMatchingAsset) {
            return false;
          }
        }

        // Platforms filter
        if (options.platforms && options.platforms.length > 0) {
          const hasMatchingPlatform = options.platforms.some(platform => 
            broker.platforms.includes(platform)
          );
          if (!hasMatchingPlatform) {
            return false;
          }
        }

        // Jurisdictions filter
        if (options.jurisdictions && options.jurisdictions.length > 0) {
          const hasMatchingJurisdiction = options.jurisdictions.some(jurisdiction => 
            broker.regulation.jurisdictions.includes(jurisdiction)
          );
          if (!hasMatchingJurisdiction) {
            return false;
          }
        }

        // Regulated only filter
        if (options.regulatedOnly && !meetsMinimumRequirements(broker)) {
          return false;
        }

        return true;
      })
      .toArray();
  }

  /**
   * Get brokers with pagination and sorting
   * @param searchOptions - Search filters
   * @param sortOptions - Sorting options
   * @param paginationOptions - Pagination options
   * @returns Paginated broker query result
   */
  public queryBrokers(
    searchOptions: BrokerSearchOptions = {},
    sortOptions: BrokerSortOptions = { sortBy: 'rating', sortOrder: 'desc' },
    paginationOptions: PaginationOptions = { page: 1, limit: 10 }
  ): BrokerQueryResult {
    // Search and filter
    const filteredBrokers = this.searchBrokers(searchOptions);

    // Sort
    filteredBrokers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'trustScore':
          aValue = a.trustScore;
          bValue = b.trustScore;
          break;
        case 'minDeposit':
          aValue = a.minDeposit;
          bValue = b.minDeposit;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'reviewCount':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }

      if (sortOptions.sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    // Paginate
    const total = filteredBrokers.length;
    const startIndex = (paginationOptions.page - 1) * paginationOptions.limit;
    const endIndex = startIndex + paginationOptions.limit;
    const paginatedBrokers = filteredBrokers.slice(startIndex, endIndex);

    return {
      brokers: paginatedBrokers,
      total,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      hasNext: endIndex < total,
      hasPrev: paginationOptions.page > 1
    };
  }

  /**
   * Get featured brokers
   * @param limit - Maximum number of brokers to return
   * @returns Array of featured brokers
   */
  public getFeaturedBrokers(limit = 5): Broker[] {
    return this.brokerCollection
      .filter(broker => broker.featured || broker.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .take(limit)
      .toArray();
  }

  /**
   * Get top-rated brokers
   * @param limit - Maximum number of brokers to return
   * @returns Array of top-rated brokers
   */
  public getTopRatedBrokers(limit = 10): Broker[] {
    return this.brokerCollection
      .sort((a, b) => b.rating - a.rating)
      .take(limit)
      .toArray();
  }

  /**
   * Get brokers by asset class
   * @param assetClass - Asset class to filter by
   * @returns Array of brokers supporting the asset class
   */
  public getBrokersByAssetClass(assetClass: string): Broker[] {
    if (!assetClass || typeof assetClass !== 'string') {
      return [];
    }

    return this.brokerCollection
      .filter(broker => broker.assetClasses.includes(assetClass))
      .toArray();
  }

  /**
   * Get brokers by platform
   * @param platform - Platform to filter by
   * @returns Array of brokers supporting the platform
   */
  public getBrokersByPlatform(platform: string): Broker[] {
    if (!platform || typeof platform !== 'string') {
      return [];
    }

    return this.brokerCollection
      .filter(broker => broker.platforms.includes(platform))
      .toArray();
  }

  /**
   * Get brokers by jurisdiction
   * @param jurisdiction - Jurisdiction to filter by
   * @returns Array of brokers regulated in the jurisdiction
   */
  public getBrokersByJurisdiction(jurisdiction: string): Broker[] {
    if (!jurisdiction || typeof jurisdiction !== 'string') {
      return [];
    }

    return this.brokerCollection
      .filter(broker => broker.regulation.jurisdictions.includes(jurisdiction))
      .toArray();
  }

  /**
   * Get broker statistics
   * @returns Object containing broker statistics
   */
  public getBrokerStats() {
    const allBrokers = this.brokerCollection.toArray();
    const ratings = allBrokers.map(b => b.rating);
    const trustScores = allBrokers.map(b => b.trustScore);
    const minDeposits = allBrokers.map(b => b.minDeposit);

    return {
      total: allBrokers.length,
      averageRating: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
      averageTrustScore: trustScores.reduce((sum, t) => sum + t, 0) / trustScores.length,
      averageMinDeposit: minDeposits.reduce((sum, d) => sum + d, 0) / minDeposits.length,
      highestRating: Math.max(...ratings),
      lowestRating: Math.min(...ratings),
      highestTrustScore: Math.max(...trustScores),
      lowestTrustScore: Math.min(...trustScores),
      regulatedBrokers: allBrokers.filter(b => meetsMinimumRequirements(b)).length,
      featuredBrokers: allBrokers.filter(b => b.featured).length
    };
  }

  /**
   * Validate broker exists and is accessible
   * @param id - Broker ID
   * @returns Boolean indicating if broker exists and is valid
   */
  public isValidBroker(id: string): boolean {
    const broker = this.getBrokerById(id);
    if (!broker) {
      return false;
    }

    const validation = validateBroker(broker);
    return validation.isValid;
  }

  /**
   * Get available asset classes
   * @returns Array of unique asset classes
   */
  public getAvailableAssetClasses(): string[] {
    const assetClasses = new Set<string>();
    this.brokerCollection.forEach(broker => {
      broker.assetClasses.forEach(asset => assetClasses.add(asset));
    });
    return Array.from(assetClasses).sort();
  }

  /**
   * Get available platforms
   * @returns Array of unique platforms
   */
  public getAvailablePlatforms(): string[] {
    const platforms = new Set<string>();
    this.brokerCollection.forEach(broker => {
      broker.platforms.forEach(platform => platforms.add(platform));
    });
    return Array.from(platforms).sort();
  }

  /**
   * Get available jurisdictions
   * @returns Array of unique jurisdictions
   */
  public getAvailableJurisdictions(): string[] {
    const jurisdictions = new Set<string>();
    this.brokerCollection.forEach(broker => {
      broker.regulation.jurisdictions.forEach(jurisdiction => jurisdictions.add(jurisdiction));
    });
    return Array.from(jurisdictions).sort();
  }
}

// Export singleton instance
export const brokerDataAccess = BrokerDataAccess.getInstance();

// Export convenience functions
export const getBrokerById = (id: string) => brokerDataAccess.getBrokerById(id);
export const getBrokerWithRating = (id: string) => brokerDataAccess.getBrokerWithRating(id);
export const getBrokersByIds = (ids: string[]) => brokerDataAccess.getBrokersByIds(ids);
export const searchBrokers = (options: BrokerSearchOptions) => brokerDataAccess.searchBrokers(options);
export const queryBrokers = (
  searchOptions?: BrokerSearchOptions,
  sortOptions?: BrokerSortOptions,
  paginationOptions?: PaginationOptions
) => brokerDataAccess.queryBrokers(searchOptions, sortOptions, paginationOptions);
export const getFeaturedBrokers = (limit?: number) => brokerDataAccess.getFeaturedBrokers(limit);
export const getTopRatedBrokers = (limit?: number) => brokerDataAccess.getTopRatedBrokers(limit);
export const getBrokersByAssetClass = (assetClass: string) => brokerDataAccess.getBrokersByAssetClass(assetClass);
export const getBrokersByPlatform = (platform: string) => brokerDataAccess.getBrokersByPlatform(platform);
export const getBrokersByJurisdiction = (jurisdiction: string) => brokerDataAccess.getBrokersByJurisdiction(jurisdiction);
export const getBrokerStats = () => brokerDataAccess.getBrokerStats();
export const isValidBroker = (id: string) => brokerDataAccess.isValidBroker(id);
export const getAvailableAssetClasses = () => brokerDataAccess.getAvailableAssetClasses();
export const getAvailablePlatforms = () => brokerDataAccess.getAvailablePlatforms();
export const getAvailableJurisdictions = () => brokerDataAccess.getAvailableJurisdictions();

// Export metadata
export const brokerDataAccessMetadata = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  totalBrokers: brokerDataAccess.getAllBrokers().size(),
  features: [
    'Type-safe data access',
    'Advanced filtering and search',
    'Pagination and sorting',
    'Data validation',
    'Performance optimization',
    'Safe collection handling'
  ]
};
