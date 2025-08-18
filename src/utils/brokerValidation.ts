/**
 * Enhanced broker validation utilities for BrokerAnalysis platform
 * 
 * This file provides comprehensive validation functions for broker data,
 * including data integrity checking, schema validation, and business rule validation.
 * 
 * @fileoverview Comprehensive broker data validation system
 * @version 1.0.0
 * @since 2025-01-10
 */

import { z } from 'zod';
import type { Broker, BrokerRating } from '@/types/brokerTypes';

// Validation schemas
const BrokerValidationSchema = z.object({
  id: z.string().min(1, 'Broker ID is required'),
  name: z.string().min(1, 'Broker name is required'),
  logo: z.string().min(1, 'Logo is required'),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  reviewCount: z.number().min(0, 'Review count cannot be negative'),
  regulators: z.array(z.string()).min(1, 'At least one regulator is required'),
  minDeposit: z.number().min(0, 'Minimum deposit cannot be negative'),
  maxLeverage: z.number().min(1, 'Maximum leverage must be at least 1'),
  spreadsFrom: z.number().min(0, 'Spreads from cannot be negative'),
  assetClasses: z.array(z.string()).min(1, 'At least one asset class is required'),
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
  category: z.string().min(1, 'Category is required'),
  trustScore: z.number().min(0).max(100, 'Trust score must be between 0 and 100').optional(),
  isRegulated: z.boolean().optional(),
  yearEstablished: z.number().min(1900).max(new Date().getFullYear()).optional(),
  headquarters: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  keyFeatures: z.array(z.string()).optional(),
  featured: z.boolean(),
  details: z.any().optional(),
  contact: z.any().optional(),
  regulation: z.array(z.object({
    authority: z.string(),
    licenseNumber: z.string().optional(),
    status: z.enum(['active', 'pending', 'suspended', 'revoked']),
    issuedDate: z.string().optional(),
    expiryDate: z.string().optional(),
    jurisdiction: z.string().optional(),
    verificationUrl: z.string().optional()
  })).optional(),
  features: z.any().optional(),
  costs: z.any().optional(),
  accountTypes: z.array(z.string()).optional()
});

const BrokerRatingValidationSchema = z.object({
  overall: z.number().min(0).max(5, 'Overall rating must be between 0 and 5'),
  platform: z.number().min(0).max(5, 'Platform rating must be between 0 and 5'),
  customerService: z.number().min(0).max(5, 'Customer service rating must be between 0 and 5'),
  costs: z.number().min(0).max(5, 'Costs rating must be between 0 and 5'),
  research: z.number().min(0).max(5, 'Research rating must be between 0 and 5'),
  mobile: z.number().min(0).max(5, 'Mobile rating must be between 0 and 5'),
  trustScore: z.number().min(0).max(100, 'Trust score must be between 0 and 100'),
  reviewCount: z.number().min(0, 'Review count cannot be negative'),
  breakdown: z.object({
    platform: z.number().min(0).max(5),
    support: z.number().min(0).max(5),
    fees: z.number().min(0).max(5),
    execution: z.number().min(0).max(5)
  })
});

// Validation result interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DataIntegrityReport {
  totalBrokers: number;
  validBrokers: number;
  invalidBrokers: number;
  missingRatings: number;
  duplicateIds: string[];
  orphanedRatings: string[];
  inconsistentData: {
    brokerId: string;
    issue: string;
    severity: 'error' | 'warning';
  }[];
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Validate a single broker object
 * @param broker - Broker object to validate
 * @returns ValidationResult with errors and warnings
 */
export function validateBroker(broker: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    BrokerValidationSchema.parse(broker);
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.isValid = false;
      result.errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
  }

  // Additional business rule validations
  if (broker.rating && broker.trustScore) {
    const ratingDiff = Math.abs(broker.rating - (broker.trustScore / 20));
    if (ratingDiff > 1) {
      result.warnings.push('Rating and trust score seem inconsistent');
    }
  }

  if (broker.minDeposit > 10000) {
    result.warnings.push('Minimum deposit is unusually high');
  }

  if (broker.reviewCount < 10) {
    result.warnings.push('Low review count may indicate limited user feedback');
  }

  return result;
}

/**
 * Validate a broker rating object
 * @param rating - BrokerRating object to validate
 * @returns ValidationResult with errors and warnings
 */
export function validateBrokerRating(rating: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    BrokerRatingValidationSchema.parse(rating);
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.isValid = false;
      result.errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
  }

  // Check rating consistency
  if (rating.breakdown) {
    const breakdownAvg = (rating.breakdown.platform + rating.breakdown.support + 
                        rating.breakdown.fees + rating.breakdown.execution) / 4;
    const overallDiff = Math.abs(rating.overall - breakdownAvg);
    
    if (overallDiff > 0.5) {
      result.warnings.push('Overall rating differs significantly from breakdown average');
    }
  }

  return result;
}

/**
 * Validate an array of brokers
 * @param brokerArray - Array of broker objects to validate
 * @returns ValidationResult with aggregated errors and warnings
 */
export function validateBrokerArray(brokerArray: any[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!Array.isArray(brokerArray)) {
    result.isValid = false;
    result.errors.push('Input must be an array');
    return result;
  }

  const brokerIds = new Set<string>();
  
  brokerArray.forEach((broker, index) => {
    const brokerResult = validateBroker(broker);
    
    if (!brokerResult.isValid) {
      result.isValid = false;
      result.errors.push(...brokerResult.errors.map(err => `Broker ${index}: ${err}`));
    }
    
    result.warnings.push(...brokerResult.warnings.map(warn => `Broker ${index}: ${warn}`));
    
    // Check for duplicate IDs
    if (broker.id) {
      if (brokerIds.has(broker.id)) {
        result.isValid = false;
        result.errors.push(`Duplicate broker ID: ${broker.id}`);
      } else {
        brokerIds.add(broker.id);
      }
    }
  });

  return result;
}

/**
 * Validate data integrity across brokers and ratings
 * @param brokers - Array of broker objects to validate
 * @param brokerRatings - Object containing broker ratings
 * @returns DataIntegrityReport with comprehensive analysis
 */
export function validateDataIntegrity(brokers: Broker[], brokerRatings: Record<string, BrokerRating>): DataIntegrityReport {
  const report: DataIntegrityReport = {
    totalBrokers: brokers.length,
    validBrokers: 0,
    invalidBrokers: 0,
    missingRatings: 0,
    duplicateIds: [],
    orphanedRatings: [],
    inconsistentData: [],
    overallHealth: 'excellent'
  };

  // Check broker validation
  const brokerIds = new Set<string>();
  const ratingIds = new Set(Object.keys(brokerRatings));

  brokers.forEach(broker => {
    const validation = validateBroker(broker);
    
    if (validation.isValid) {
      report.validBrokers++;
    } else {
      report.invalidBrokers++;
      report.inconsistentData.push({
        brokerId: broker.id,
        issue: validation.errors.join(', '),
        severity: 'error'
      });
    }

    // Check for duplicates
    if (brokerIds.has(broker.id)) {
      report.duplicateIds.push(broker.id);
    } else {
      brokerIds.add(broker.id);
    }

    // Check for missing ratings
    if (!brokerRatings[broker.id]) {
      report.missingRatings++;
      report.inconsistentData.push({
        brokerId: broker.id,
        issue: 'Missing rating data',
        severity: 'warning'
      });
    }

    // Add warnings as inconsistent data
    validation.warnings.forEach(warning => {
      report.inconsistentData.push({
        brokerId: broker.id,
        issue: warning,
        severity: 'warning'
      });
    });
  });

  // Check for orphaned ratings
  ratingIds.forEach(ratingId => {
    if (!brokerIds.has(ratingId)) {
      report.orphanedRatings.push(ratingId);
    }
  });

  // Determine overall health
  const errorCount = report.invalidBrokers + report.duplicateIds.length;
  const warningCount = report.missingRatings + report.orphanedRatings.length;
  
  if (errorCount === 0 && warningCount === 0) {
    report.overallHealth = 'excellent';
  } else if (errorCount === 0 && warningCount <= 2) {
    report.overallHealth = 'good';
  } else if (errorCount <= 2 && warningCount <= 5) {
    report.overallHealth = 'fair';
  } else {
    report.overallHealth = 'poor';
  }

  return report;
}

/**
 * Check if broker has valid regulation
 * @param broker - Broker object to check
 * @returns Boolean indicating if regulation is valid
 */
export function hasValidRegulation(broker: Broker): boolean {
  if (!broker.regulation || !Array.isArray(broker.regulation)) return false;
  
  return broker.regulation.length > 0 && 
         broker.regulation.some(reg => reg.authority && reg.status === 'active');
}

/**
 * Check if broker meets minimum requirements
 * @param broker - Broker object to check
 * @returns Boolean indicating if broker meets minimum requirements
 */
export function meetsMinimumRequirements(broker: Broker): boolean {
  return (
    broker.id &&
    broker.name &&
    broker.rating >= 3.0 &&
    (broker.trustScore || 0) >= 60 &&
    hasValidRegulation(broker) &&
    broker.assetClasses &&
    broker.assetClasses.length > 0 &&
    broker.platforms &&
    broker.platforms.length > 0
  );
}

/**
 * Get brokers that fail validation
 * @param brokers - Array of broker objects to check
 * @returns Array of broker IDs that fail validation
 */
export function getInvalidBrokers(brokers: Broker[]): string[] {
  return brokers
    .filter(broker => !validateBroker(broker).isValid)
    .map(broker => broker.id);
}

/**
 * Get brokers missing ratings
 * @param brokers - Array of broker objects to check
 * @param brokerRatings - Object containing broker ratings
 * @returns Array of broker IDs missing rating data
 */
export function getBrokersMissingRatings(brokers: Broker[], brokerRatings: Record<string, BrokerRating>): string[] {
  return brokers
    .filter(broker => !brokerRatings[broker.id])
    .map(broker => broker.id);
}

/**
 * Validate broker data consistency
 * @param brokerId - Broker ID to check
 * @param brokers - Array of broker objects
 * @param brokerRatings - Object containing broker ratings
 * @returns ValidationResult for data consistency
 */
export function validateBrokerConsistency(brokerId: string, brokers: Broker[], brokerRatings: Record<string, BrokerRating>): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const broker = brokers.find(b => b.id === brokerId);
  const rating = brokerRatings[brokerId];

  if (!broker) {
    result.isValid = false;
    result.errors.push('Broker not found');
    return result;
  }

  if (!rating) {
    result.warnings.push('Rating data missing');
  } else {
    // Check rating consistency
    if (Math.abs(broker.rating - rating.overall) > 0.1) {
      result.warnings.push('Broker rating and rating data overall score differ');
    }

    if (broker.trustScore && Math.abs(broker.trustScore - rating.trustScore) > 1) {
      result.warnings.push('Trust scores differ between broker and rating data');
    }

    if (Math.abs(broker.reviewCount - rating.reviewCount) > 0) {
      result.warnings.push('Review counts differ between broker and rating data');
    }
  }

  return result;
}

/**
 * Export validation utilities
 */
export const validationUtils = {
  validateBroker,
  validateBrokerRating,
  validateBrokerArray,
  validateDataIntegrity,
  hasValidRegulation,
  meetsMinimumRequirements,
  getInvalidBrokers,
  getBrokersMissingRatings,
  validateBrokerConsistency
};

// Export schemas for external use
export { BrokerValidationSchema, BrokerRatingValidationSchema };
export const BrokerSchema = BrokerValidationSchema; // Alias for backward compatibility

// Export metadata
export const validationMetadata = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  supportedSchemas: ['Broker', 'BrokerRating'],
  validationRules: [
    'Schema validation using Zod',
    'Business rule validation',
    'Data consistency checks',
    'Duplicate detection',
    'Orphaned data detection'
  ]
};
