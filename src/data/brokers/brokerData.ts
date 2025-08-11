/**
 * Main broker data file for BrokerAnalysis platform
 * 
 * This file provides structured, validated broker data for platform consumption.
 * Data is sourced from compiled broker information and validated against type schemas.
 * 
 * @fileoverview Centralized broker data export with type safety
 * @version 1.0.0
 * @since 2025-01-10
 */

import type { Broker } from '../../types/brokerTypes';
import { compiledBrokers } from '../compiled/compiledBrokers';

/**
 * Broker data array
 * Exported directly from compiled brokers for platform consumption
 */
export const brokers: Broker[] = compiledBrokers as Broker[];

/**
 * Get broker by ID
 * @param id - Broker identifier
 * @returns Broker object or undefined if not found
 */
export function getBrokerById(id: string): Broker | undefined {
  return brokers.find(broker => broker.id === id);
}

/**
 * Get brokers by category
 * @param category - Broker category (ecn, stp, market-maker, etc.)
 * @returns Array of brokers in the specified category
 */
export function getBrokersByCategory(category: string): Broker[] {
  return brokers.filter(broker => broker.category === category);
}

/**
 * Get featured brokers
 * @returns Array of featured brokers
 */
export function getFeaturedBrokers(): Broker[] {
  return brokers.filter(broker => broker.featured === true);
}

/**
 * Get regulated brokers
 * @returns Array of regulated brokers
 */
export function getRegulatedBrokers(): Broker[] {
  return brokers.filter(broker => broker.isRegulated === true);
}

/**
 * Get brokers by minimum deposit range
 * @param minDeposit - Maximum minimum deposit amount
 * @returns Array of brokers with minimum deposit <= specified amount
 */
export function getBrokersByMinDeposit(minDeposit: number): Broker[] {
  return brokers.filter(broker => broker.minDeposit <= minDeposit);
}

/**
 * Get brokers by trust score range
 * @param minTrustScore - Minimum trust score threshold
 * @returns Array of brokers with trust score >= specified threshold
 */
export function getBrokersByTrustScore(minTrustScore: number): Broker[] {
  return brokers.filter(broker => broker.trustScore >= minTrustScore);
}

/**
 * Get total number of brokers
 * @returns Total count of available brokers
 */
export function getBrokerCount(): number {
  return brokers.length;
}

/**
 * Get broker statistics
 * @returns Object containing broker statistics
 */
export function getBrokerStats() {
  const totalBrokers = brokers.length;
  const regulatedBrokers = getRegulatedBrokers().length;
  const featuredBrokers = getFeaturedBrokers().length;
  const avgTrustScore = brokers.reduce((sum, broker) => sum + broker.trustScore, 0) / totalBrokers;
  const avgRating = brokers.reduce((sum, broker) => sum + broker.rating, 0) / totalBrokers;
  
  return {
    totalBrokers,
    regulatedBrokers,
    featuredBrokers,
    regulationRate: (regulatedBrokers / totalBrokers) * 100,
    avgTrustScore: Math.round(avgTrustScore * 100) / 100,
    avgRating: Math.round(avgRating * 100) / 100,
    categories: [...new Set(brokers.map(broker => broker.category))],
    regulators: [...new Set(brokers.flatMap(broker => broker.regulators))]
  };
}

// Export default for convenience
export default brokers;

// Export metadata
export const brokerDataMetadata = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  totalBrokers: brokers.length,
  dataSource: 'compiled',
  validated: true
};