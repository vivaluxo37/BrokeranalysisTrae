# BrokerAnalysis Platform - Broker Integration Project
## Data Schema Specification

## Overview

This document defines the comprehensive data schema for broker information, ratings, features, and regulatory data used throughout the BrokerAnalysis platform. All schemas include TypeScript interfaces, Zod validation schemas, and usage examples.

## Core Data Schemas

### 1. Broker Schema

**Primary broker entity containing all essential information**

```typescript
// src/types/broker.ts
export interface Broker {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Official broker name
  displayName?: string;          // Alternative display name
  logo: BrokerLogo;             // Logo assets in multiple formats
  rating: BrokerRating;         // Comprehensive rating information
  regulation: BrokerRegulation; // Regulatory and licensing data
  features: BrokerFeatures;     // Trading features and conditions
  contact: BrokerContact;       // Contact and company information
  metadata: BrokerMetadata;     // System metadata
}

// Zod validation schema
export const BrokerSchema = z.object({
  id: z.string()
    .min(1, 'Broker ID is required')
    .regex(/^[a-z0-9-]+$/, 'ID must be kebab-case'),
  name: z.string()
    .min(1, 'Broker name is required')
    .max(100, 'Name too long'),
  displayName: z.string().max(100).optional(),
  logo: BrokerLogoSchema,
  rating: BrokerRatingSchema,
  regulation: BrokerRegulationSchema,
  features: BrokerFeaturesSchema,
  contact: BrokerContactSchema,
  metadata: BrokerMetadataSchema
});
```

### 2. Broker Logo Schema

**Asset management for broker logos and branding**

```typescript
export interface BrokerLogo {
  square: BrokerLogoVariant;     // Square logos (64x64, 128x128, 256x256)
  horizontal: BrokerLogoVariant; // Horizontal/wide logos
  favicon: BrokerLogoVariant;    // Favicon (16x16, 32x32)
  symbol?: BrokerLogoVariant;    // Symbol/icon only
}

export interface BrokerLogoVariant {
  webp: LogoSizeMap;            // WebP format (preferred)
  png: LogoSizeMap;             // PNG fallback
  svg?: string;                 // SVG path (if available)
}

export interface LogoSizeMap {
  small: string;                // 64x64 or equivalent
  medium: string;               // 128x128 or equivalent
  large: string;                // 256x256 or equivalent
}

// Validation schema
export const BrokerLogoSchema = z.object({
  square: BrokerLogoVariantSchema,
  horizontal: BrokerLogoVariantSchema,
  favicon: BrokerLogoVariantSchema,
  symbol: BrokerLogoVariantSchema.optional()
});

export const BrokerLogoVariantSchema = z.object({
  webp: LogoSizeMapSchema,
  png: LogoSizeMapSchema,
  svg: z.string().url().optional()
});

export const LogoSizeMapSchema = z.object({
  small: z.string().url(),
  medium: z.string().url(),
  large: z.string().url()
});
```

### 3. Broker Rating Schema

**Comprehensive rating and review information**

```typescript
export interface BrokerRating {
  overall: number;              // Overall rating (1-5 scale)
  reviewCount: number;          // Total number of reviews
  trustScore: number;           // Trust score (1-100 scale)
  breakdown: RatingBreakdown;   // Detailed rating breakdown
  sources: RatingSource[];      // Rating sources and attribution
  lastUpdated: string;          // ISO date string
}

export interface RatingBreakdown {
  platform: number;             // Trading platform rating (1-5)
  support: number;              // Customer support rating (1-5)
  fees: number;                 // Fees and costs rating (1-5)
  execution: number;            // Order execution rating (1-5)
  education: number;            // Educational resources rating (1-5)
  research: number;             // Research and analysis rating (1-5)
}

export interface RatingSource {
  name: string;                 // Source name (e.g., 'ForexPeaceArmy')
  rating: number;               // Rating from this source
  reviewCount: number;          // Reviews from this source
  url?: string;                 // Link to source
  lastUpdated: string;          // ISO date string
}

// Validation schema
export const BrokerRatingSchema = z.object({
  overall: z.number().min(1).max(5),
  reviewCount: z.number().min(0),
  trustScore: z.number().min(1).max(100),
  breakdown: z.object({
    platform: z.number().min(1).max(5),
    support: z.number().min(1).max(5),
    fees: z.number().min(1).max(5),
    execution: z.number().min(1).max(5),
    education: z.number().min(1).max(5),
    research: z.number().min(1).max(5)
  }),
  sources: z.array(RatingSourceSchema),
  lastUpdated: z.string().datetime()
});
```

### 4. Broker Regulation Schema

**Regulatory compliance and licensing information**

```typescript
export interface BrokerRegulation {
  licenses: RegulationLicense[];    // Active licenses
  jurisdictions: string[];          // Operating jurisdictions
  verified: boolean;                // Verification status
  riskWarning: string;              // Required risk warning text
  compensationScheme?: CompensationScheme; // Investor protection
  lastVerified: string;             // ISO date string
}

export interface RegulationLicense {
  regulator: RegulatorType;         // Regulatory authority
  licenseNumber: string;            // License/registration number
  jurisdiction: string;             // Country/region
  status: LicenseStatus;            // Active, suspended, etc.
  issueDate: string;                // ISO date string
  expiryDate?: string;              // ISO date string (if applicable)
  url?: string;                     // Verification URL
}

export interface CompensationScheme {
  name: string;                     // Scheme name (e.g., 'FSCS')
  coverage: number;                 // Coverage amount
  currency: string;                 // Coverage currency
  description: string;              // Scheme description
}

export enum RegulatorType {
  FCA = 'FCA',                      // UK Financial Conduct Authority
  CYSEC = 'CySEC',                  // Cyprus Securities Exchange Commission
  ASIC = 'ASIC',                    // Australian Securities & Investments Commission
  SEC = 'SEC',                      // US Securities and Exchange Commission
  CFTC = 'CFTC',                   // US Commodity Futures Trading Commission
  BAFIN = 'BaFin',                  // German Federal Financial Supervisory Authority
  AMF = 'AMF',                      // French Financial Markets Authority
  CONSOB = 'CONSOB',                // Italian Securities and Exchange Commission
  CNMV = 'CNMV',                    // Spanish Securities Market Commission
  FSA = 'FSA',                      // Various Financial Services Authorities
  OTHER = 'OTHER'                   // Other regulatory bodies
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED'
}

// Validation schema
export const BrokerRegulationSchema = z.object({
  licenses: z.array(RegulationLicenseSchema),
  jurisdictions: z.array(z.string()),
  verified: z.boolean(),
  riskWarning: z.string(),
  compensationScheme: CompensationSchemeSchema.optional(),
  lastVerified: z.string().datetime()
});
```

### 5. Broker Features Schema

**Trading features, conditions, and platform details**

```typescript
export interface BrokerFeatures {
  trading: TradingFeatures;         // Core trading features
  platforms: TradingPlatform[];     // Available platforms
  assetClasses: AssetClass[];       // Tradeable instruments
  accountTypes: AccountType[];      // Account options
  funding: FundingOptions;          // Deposit/withdrawal methods
  education: EducationFeatures;     // Educational resources
  research: ResearchFeatures;       // Research and analysis tools
}

export interface TradingFeatures {
  minDeposit: number;               // Minimum deposit (USD)
  maxLeverage: number;              // Maximum leverage ratio
  spreadsFrom: number;              // Minimum spread (pips)
  commission: CommissionStructure;  // Commission details
  swapFree: boolean;                // Islamic account availability
  demoAccount: boolean;             // Demo account availability
  copyTrading: boolean;             // Social/copy trading
  algorithmicTrading: boolean;      // EA/algorithm support
  hedging: boolean;                 // Hedging allowed
  scalping: boolean;                // Scalping allowed
  newsTrading: boolean;             // News trading allowed
}

export interface CommissionStructure {
  type: 'spread' | 'commission' | 'hybrid';
  forex: number;                    // Forex commission (per lot)
  stocks: number;                   // Stock commission (per share/percentage)
  crypto: number;                   // Crypto commission (percentage)
  commodities: number;              // Commodities commission
}

export interface FundingOptions {
  depositMethods: PaymentMethod[];  // Available deposit methods
  withdrawalMethods: PaymentMethod[]; // Available withdrawal methods
  minWithdrawal: number;            // Minimum withdrawal amount
  withdrawalFee: number;            // Withdrawal fee
  processingTime: ProcessingTime;   // Processing timeframes
}

export interface PaymentMethod {
  type: PaymentType;
  name: string;
  fee: number;                      // Fee amount or percentage
  minAmount: number;
  maxAmount: number;
  processingTime: string;           // e.g., 'Instant', '1-3 days'
}

export enum PaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  E_WALLET = 'E_WALLET',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  OTHER = 'OTHER'
}

export enum TradingPlatform {
  METATRADER_4 = 'MT4',
  METATRADER_5 = 'MT5',
  CTRADER = 'cTrader',
  PROPRIETARY = 'Proprietary',
  WEB_TRADER = 'WebTrader',
  MOBILE_APP = 'Mobile App',
  TRADINGVIEW = 'TradingView',
  OTHER = 'Other'
}

export enum AssetClass {
  FOREX = 'Forex',
  STOCKS = 'Stocks',
  INDICES = 'Indices',
  COMMODITIES = 'Commodities',
  CRYPTO = 'Cryptocurrency',
  CFD = 'CFD',
  BONDS = 'Bonds',
  ETF = 'ETF',
  OPTIONS = 'Options',
  FUTURES = 'Futures'
}

// Validation schema
export const BrokerFeaturesSchema = z.object({
  trading: TradingFeaturesSchema,
  platforms: z.array(z.nativeEnum(TradingPlatform)),
  assetClasses: z.array(z.nativeEnum(AssetClass)),
  accountTypes: z.array(AccountTypeSchema),
  funding: FundingOptionsSchema,
  education: EducationFeaturesSchema,
  research: ResearchFeaturesSchema
});
```

### 6. Broker Contact Schema

**Contact information and company details**

```typescript
export interface BrokerContact {
  company: CompanyInfo;             // Legal company information
  website: string;                  // Primary website URL
  support: SupportChannels;         // Customer support options
  social: SocialMediaLinks;         // Social media presence
  address: CompanyAddress;          // Physical address
}

export interface CompanyInfo {
  legalName: string;                // Legal company name
  tradingName?: string;             // Trading/brand name
  registrationNumber?: string;      // Company registration number
  vatNumber?: string;               // VAT/tax number
  foundedYear?: number;             // Year established
  employees?: number;               // Number of employees
}

export interface SupportChannels {
  email?: string;                   // Support email
  phone?: string;                   // Support phone
  liveChat: boolean;                // Live chat availability
  languages: string[];              // Supported languages
  hours: string;                    // Support hours
  responseTime: string;             // Average response time
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
  telegram?: string;
}

export interface CompanyAddress {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Validation schema
export const BrokerContactSchema = z.object({
  company: CompanyInfoSchema,
  website: z.string().url(),
  support: SupportChannelsSchema,
  social: SocialMediaLinksSchema,
  address: CompanyAddressSchema
});
```

### 7. Broker Metadata Schema

**System metadata and data management information**

```typescript
export interface BrokerMetadata {
  createdAt: string;                // ISO date string
  updatedAt: string;                // ISO date string
  lastVerified: string;             // ISO date string
  dataSource: DataSource[];         // Data sources
  status: BrokerStatus;             // Broker status
  featured: boolean;                // Featured broker flag
  priority: number;                 // Display priority (1-10)
  tags: string[];                   // Searchable tags
  notes?: string;                   // Internal notes
}

export interface DataSource {
  name: string;                     // Source name
  url?: string;                     // Source URL
  extractedAt: string;              // ISO date string
  confidence: number;               // Data confidence (0-1)
  fields: string[];                 // Fields from this source
}

export enum BrokerStatus {
  ACTIVE = 'ACTIVE',                // Currently operating
  INACTIVE = 'INACTIVE',            // Not currently operating
  SUSPENDED = 'SUSPENDED',          // Temporarily suspended
  UNDER_REVIEW = 'UNDER_REVIEW',    // Under regulatory review
  CLOSED = 'CLOSED'                 // Permanently closed
}

// Validation schema
export const BrokerMetadataSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastVerified: z.string().datetime(),
  dataSource: z.array(DataSourceSchema),
  status: z.nativeEnum(BrokerStatus),
  featured: z.boolean(),
  priority: z.number().min(1).max(10),
  tags: z.array(z.string()),
  notes: z.string().optional()
});
```

## Data Validation Utilities

### Validation Functions

```typescript
// src/utils/brokerValidation.ts
import { ZodError } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export function validateBroker(data: unknown): ValidationResult<Broker> {
  try {
    const validatedData = BrokerSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    throw error;
  }
}

export function validateBrokerArray(data: unknown[]): ValidationResult<Broker[]> {
  const results = data.map((item, index) => {
    const result = validateBroker(item);
    if (!result.success) {
      return {
        index,
        errors: result.errors
      };
    }
    return {
      index,
      data: result.data
    };
  });

  const errors = results.filter(r => 'errors' in r);
  if (errors.length > 0) {
    return {
      success: false,
      errors: errors.flatMap(e => e.errors || [])
    };
  }

  return {
    success: true,
    data: results.map(r => r.data!)
  };
}
```

### Data Transformation Utilities

```typescript
// src/utils/brokerTransform.ts
export function normalizeBrokerData(rawData: any): Partial<Broker> {
  // Transform raw data from various sources into standardized format
  return {
    id: generateBrokerId(rawData.name),
    name: rawData.name?.trim(),
    // ... other transformations
  };
}

export function generateBrokerId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function mergeBrokerData(sources: Partial<Broker>[]): Broker {
  // Merge data from multiple sources with conflict resolution
  const merged = sources.reduce((acc, source) => {
    return {
      ...acc,
      ...source,
      // Custom merge logic for complex fields
    };
  }, {} as Partial<Broker>);

  const validation = validateBroker(merged);
  if (!validation.success) {
    throw new Error(`Invalid merged broker data: ${validation.errors?.map(e => e.message).join(', ')}`);
  }

  return validation.data!;
}
```

## Usage Examples

### Creating a Broker Record

```typescript
// Example: Creating a complete broker record
const igMarkets: Broker = {
  id: 'ig-markets',
  name: 'IG Markets',
  logo: {
    square: {
      webp: {
        small: '/assets/brokers/logos/square/webp/64x64/ig-markets.webp',
        medium: '/assets/brokers/logos/square/webp/128x128/ig-markets.webp',
        large: '/assets/brokers/logos/square/webp/256x256/ig-markets.webp'
      },
      png: {
        small: '/assets/brokers/logos/square/png/64x64/ig-markets.png',
        medium: '/assets/brokers/logos/square/png/128x128/ig-markets.png',
        large: '/assets/brokers/logos/square/png/256x256/ig-markets.png'
      }
    },
    horizontal: {
      webp: {
        small: '/assets/brokers/logos/horizontal/webp/ig-markets-small.webp',
        medium: '/assets/brokers/logos/horizontal/webp/ig-markets-medium.webp',
        large: '/assets/brokers/logos/horizontal/webp/ig-markets-large.webp'
      },
      png: {
        small: '/assets/brokers/logos/horizontal/png/ig-markets-small.png',
        medium: '/assets/brokers/logos/horizontal/png/ig-markets-medium.png',
        large: '/assets/brokers/logos/horizontal/png/ig-markets-large.png'
      }
    },
    favicon: {
      webp: {
        small: '/assets/brokers/logos/favicons/webp/ig-markets-16.webp',
        medium: '/assets/brokers/logos/favicons/webp/ig-markets-32.webp',
        large: '/assets/brokers/logos/favicons/webp/ig-markets-64.webp'
      },
      png: {
        small: '/assets/brokers/logos/favicons/png/ig-markets-16.png',
        medium: '/assets/brokers/logos/favicons/png/ig-markets-32.png',
        large: '/assets/brokers/logos/favicons/png/ig-markets-64.png'
      }
    }
  },
  rating: {
    overall: 4.8,
    reviewCount: 12500,
    trustScore: 95,
    breakdown: {
      platform: 4.9,
      support: 4.7,
      fees: 4.6,
      execution: 4.9,
      education: 4.8,
      research: 4.7
    },
    sources: [
      {
        name: 'ForexPeaceArmy',
        rating: 4.7,
        reviewCount: 8500,
        url: 'https://www.forexpeacearmy.com/forex_reviews/ig-markets',
        lastUpdated: '2024-01-15T10:30:00Z'
      }
    ],
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  // ... rest of the broker data
};

// Validate the broker data
const validation = validateBroker(igMarkets);
if (validation.success) {
  console.log('Broker data is valid');
} else {
  console.error('Validation errors:', validation.errors);
}
```

This comprehensive data schema provides a robust foundation for managing broker information throughout the BrokerAnalysis platform, ensuring data consistency, validation, and type safety across all components and services.